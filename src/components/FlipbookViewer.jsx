import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page as PdfPage, pdfjs } from "react-pdf";

// pdf.js does its heavy lifting in a Web Worker. Vite needs to be told where the
// worker file lives; `new URL(..., import.meta.url)` makes Vite bundle it for us.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Defined once, outside the component. react-pdf reloads the whole document if the
// `options` object changes identity between renders.
const PDF_OPTIONS = {};

// Only pages within this many positions of the current page get a live <canvas>.
// Every other page is a lightweight placeholder. This is what keeps a 90-page
// magazine from eating a phone's memory.
const RENDER_RADIUS = 3;

// Below this viewport width we show one page at a time instead of a two-page spread.
const SINGLE_PAGE_BREAKPOINT = 700;

// Space the toolbar + footer controls take, so the book fits in what's left.
const TOOLBAR_H = 52;
const FOOTER_H = 64;
const STAGE_PAD = 12;

// The current page index travels through context, NOT through props. react-pageflip
// reads its children once at init; if the children changed every flip it would
// re-initialise mid-turn. With context the children array stays identical forever
// and only the pages that care about "current" re-render.
const CurrentPageContext = createContext(0);

const FlipPage = forwardRef(function FlipPage({ index, total, width }, ref) {
  const current = useContext(CurrentPageContext);
  const live = Math.abs(index - current) <= RENDER_RADIUS;
  const isCover = index === 0 || index === total - 1;
  const placeholder = <div className="flip-page-ph">{index + 1}</div>;

  return (
    <div ref={ref} className="flip-page" data-density={isCover ? "hard" : "soft"}>
      {live ? (
        <PdfPage
          pageNumber={index + 1}
          width={width}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          devicePixelRatio={Math.min(window.devicePixelRatio || 1, 2)}
          loading={placeholder}
        />
      ) : (
        placeholder
      )}
    </div>
  );
});

function useViewportSize() {
  const read = () => ({ w: window.innerWidth, h: window.innerHeight });
  const [size, setSize] = useState(read);
  useEffect(() => {
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setSize(read()), 150); // debounce: rotating a phone fires many events
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);
  return size;
}

export default function FlipbookViewer({ pdfUrl, title, year, onClose }) {
  const [numPages, setNumPages] = useState(0);
  const [ratio, setRatio] = useState(null); // page width / page height
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0); // zero-based index of the current (left) page
  const book = useRef(null);
  const closeBtn = useRef(null);
  const vp = useViewportSize();

  const isSingle = vp.w < SINGLE_PAGE_BREAKPOINT;

  // Fit the book into whatever room is left after toolbar + footer.
  const { pageW, pageH } = useMemo(() => {
    if (!ratio) return { pageW: 0, pageH: 0 };
    const availW = vp.w - STAGE_PAD * 2;
    const availH = vp.h - TOOLBAR_H - FOOTER_H - STAGE_PAD * 2;
    const maxW = isSingle ? availW : availW / 2;
    const w = Math.floor(Math.min(maxW, availH * ratio));
    return { pageW: w, pageH: Math.floor(w / ratio) };
  }, [ratio, vp.w, vp.h, isSingle]);

  // Stable array of pages (see CurrentPageContext note above).
  const pages = useMemo(
    () =>
      Array.from({ length: numPages }, (_, i) => (
        <FlipPage key={i} index={i} total={numPages} width={pageW} />
      )),
    [numPages, pageW]
  );

  const flipPrev = useCallback(() => book.current?.pageFlip()?.flipPrev(), []);
  const flipNext = useCallback(() => book.current?.pageFlip()?.flipNext(), []);
  const onFlip = useCallback((e) => setPage(e.data), []);

  const jumpTo = (n) => {
    const idx = Math.max(0, Math.min(numPages - 1, n));
    book.current?.pageFlip()?.turnToPage(idx);
    setPage(idx);
  };

  // Touch swipes. react-pageflip's own touch handling only recognises a flick that finishes
  // in under 250 ms; slower, deliberate swipes fall into its corner-drag mode, which is
  // unreliable from mid-page (we saw it do nothing, or even flip the wrong way). So on touch
  // we run our own speed-independent rule: any mostly-horizontal swipe of 40px+ turns the page.
  // The listeners are native + capture-phase so they run BEFORE the library's and can stop
  // it from seeing the touch at all. Mouse input (desktop) is left entirely to the library.
  const stageRef = useRef(null);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let start = null;
    const onStart = (e) => {
      e.stopPropagation();
      if (e.touches.length !== 1) { start = null; return; } // ignore pinch / multi-finger
      start = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
    };
    const onMove = (e) => e.stopPropagation();
    // The OS cancels a touch when something interrupts it (notification, system gesture).
    // That is not a swipe, so just forget the gesture.
    const onCancel = (e) => {
      e.stopPropagation();
      start = null;
    };
    const onEnd = (e) => {
      e.stopPropagation();
      const s = start;
      start = null;
      if (!s || !e.changedTouches.length) return;
      const dx = e.changedTouches[0].clientX - s.x;
      const dy = e.changedTouches[0].clientY - s.y;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5 && Date.now() - s.t < 1500) {
        if (dx < 0) flipNext();
        else flipPrev();
      }
    };
    const opts = { capture: true, passive: true };
    el.addEventListener("touchstart", onStart, opts);
    el.addEventListener("touchmove", onMove, opts);
    el.addEventListener("touchend", onEnd, opts);
    el.addEventListener("touchcancel", onCancel, opts);
    return () => {
      el.removeEventListener("touchstart", onStart, opts);
      el.removeEventListener("touchmove", onMove, opts);
      el.removeEventListener("touchend", onEnd, opts);
      el.removeEventListener("touchcancel", onCancel, opts);
    };
  }, [flipNext, flipPrev]);

  // Keyboard: arrows flip, Esc closes. Also lock page scroll behind the overlay.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") flipNext();
      else if (e.key === "ArrowLeft") flipPrev();
      else if (e.key === "Home") jumpTo(0);
      else if (e.key === "End") jumpTo(numPages - 1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, flipNext, flipPrev, numPages]);

  // "Page 5 of 80" on phones; "Pages 4–5 of 80" on spreads; the cover stands alone.
  const label = (() => {
    if (!numPages) return "";
    if (isSingle || page === 0) return `Page ${page + 1} of ${numPages}`;
    const right = page + 2;
    return right > numPages
      ? `Page ${page + 1} of ${numPages}`
      : `Pages ${page + 1}–${right} of ${numPages}`;
  })();

  const handleLoadSuccess = async (pdf) => {
    try {
      const first = await pdf.getPage(1);
      const vpt = first.getViewport({ scale: 1 });
      setRatio(vpt.width / vpt.height);
      setNumPages(pdf.numPages);
    } catch {
      setError(true);
    }
  };

  const heading = [title, year].filter(Boolean).join(" · ");

  return (
    <div className="flip-overlay" role="dialog" aria-modal="true" aria-label={`${heading} — magazine reader`}>
      <div className="flip-toolbar">
        <span className="flip-title">{heading}</span>
        <a className="flip-download" href={pdfUrl} target="_blank" rel="noopener noreferrer">
          Download PDF
        </a>
        <button ref={closeBtn} type="button" className="flip-close" onClick={onClose} aria-label="Close magazine">
          ×
        </button>
      </div>

      <div className="flip-stage" ref={stageRef}>
        {error ? (
          <div className="flip-message">
            <p>Sorry — we couldn't open this magazine here.</p>
            <a className="btn btn-ghost" href={pdfUrl} target="_blank" rel="noopener noreferrer">
              Open the PDF in a new tab →
            </a>
          </div>
        ) : (
          <Document
            file={pdfUrl}
            options={PDF_OPTIONS}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={() => setError(true)}
            onSourceError={() => setError(true)}
            onLoadProgress={({ loaded, total }) => total && setProgress(Math.round((loaded / total) * 100))}
            loading={
              <div className="flip-message">
                <p>Opening the magazine…{progress ? ` ${progress}%` : ""}</p>
              </div>
            }
            error={null}
            className="flip-document"
          >
            {ratio && (
              <CurrentPageContext.Provider value={page}>
                {/* Explicit wrapper width: one page wide on phones, two on spreads. This is what
                    makes react-pageflip pick portrait vs. landscape deterministically. */}
                <div style={{ width: isSingle ? pageW : pageW * 2, height: pageH }}>
                  <HTMLFlipBook
                    // Remount when the layout changes (rotation / resize); resume on the same page.
                    key={`${isSingle ? "s" : "d"}-${pageW}-${pageH}`}
                    ref={book}
                    width={pageW}
                    height={pageH}
                    size="fixed"
                    startPage={page}
                    showCover
                    usePortrait={isSingle}
                    drawShadow
                    maxShadowOpacity={0.5}
                    flippingTime={700}
                    mobileScrollSupport={false}
                    swipeDistance={30}
                    onFlip={onFlip}
                    className="flip-book"
                  >
                    {pages}
                  </HTMLFlipBook>
                </div>
              </CurrentPageContext.Provider>
            )}
          </Document>
        )}
      </div>

      {numPages > 0 && !error && (
        <div className="flip-footer">
          <button type="button" className="flip-nav" onClick={flipPrev} disabled={page === 0} aria-label="Previous page">
            ‹
          </button>
          <input
            className="flip-slider"
            type="range"
            min={1}
            max={numPages}
            value={page + 1}
            onChange={(e) => jumpTo(Number(e.target.value) - 1)}
            aria-label="Jump to page"
          />
          <span className="flip-count">{label}</span>
          <button
            type="button"
            className="flip-nav"
            onClick={flipNext}
            disabled={page >= numPages - 1}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
