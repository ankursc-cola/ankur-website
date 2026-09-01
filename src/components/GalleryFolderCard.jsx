import { Link } from "react-router-dom";

/**
 * One event "folder" on the Gallery landing page.
 * Layout order (always visible, not hover-gated): heading (event name)
 * -> cover photo as the folder's "icon" -> years/photos count.
 * The tab-tilt on hover/focus/active in index.css is just a small
 * delight accent now — it no longer controls whether the text shows.
 */
export default function GalleryFolderCard({ to, label, coverUrl, count, yearsCount }) {
  const photoLabel = `${count} photo${count === 1 ? "" : "s"}`;
  const metaLabel =
    yearsCount > 0 ? `${yearsCount} year${yearsCount === 1 ? "" : "s"} \u00B7 ${photoLabel}` : photoLabel;

  return (
    <Link to={to} className="gallery-folder-card" aria-label={`${label}, ${metaLabel}`}>
      <span className="gallery-folder-tab" aria-hidden="true" />
      <span className="gallery-folder-body">
        <span className="gallery-folder-label">{label}</span>
        <span className="gallery-folder-photo-wrap">
          <img className="gallery-folder-photo" src={coverUrl} alt="" loading="lazy" />
        </span>
        <span className="gallery-folder-count">{metaLabel}</span>
      </span>
    </Link>
  );
}
