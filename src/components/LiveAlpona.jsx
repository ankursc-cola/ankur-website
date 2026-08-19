/**
 * A large alpona mandala that continuously "redraws" itself in stages
 * (center outward), as if a hand is currently painting it — plus five
 * small glowing tracer dots orbiting at different rings/speeds ("planets").
 *
 * Structure (center to edge), matching a traditional stencil alpona:
 *   1. center chakra (dot + spokes + ring)
 *   2. toothed gear ring
 *   3. four lotus clusters at N / E / S / W, each a fan of petals
 *   4. paisley curl connectors at the diagonals (NE / SE / SW / NW)
 *   5. alternating leaf ring
 *   6. fine dotted ring
 *   7. beaded scalloped border
 *   8. outermost fine dotted rim + frame line
 *   9. kalka (paisley/mango curl) band + finishing outer ring
 *
 * The viewBox has a 40-unit outer margin ("-40 -40 480 480") specifically
 * to make room for the kalka band (outer edge ~234.5 from center) without
 * touching any existing ring's coordinates. If you extend the kalka band
 * or add another outer layer, recompute its farthest radius from center
 * and make sure the margin covers it — an earlier version of this file
 * used a 24-unit margin, which was too small and clipped the kalka ring's
 * outer edge on all four sides.
 *
 * Dark accent color is "#5A3825" (Coffee) — NOT the site's Mahogany
 * Night ("#33190F"). Mahogany Night was used originally, but at the
 * small scale of the gear teeth / spokes / dots it read as near-black
 * rather than brown. If you darken this again, check it against the
 * small elements specifically, not just the large lotus petals — a
 * color can look fine at petal size and still read as black at dot size.
 *
 * This file is self-contained: the new fill-reveal animation
 * ("alp-fill") is scoped in a local <style> below rather than added to
 * index.css, so replacing just this one file is enough. The five
 * ".alp-tracer-N" spans at the end are untouched and still driven by
 * the existing rules in index.css — do not rename those classes.
 */

const TAU = Math.PI * 2;
const polar = (cx, cy, r, angle) => [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];

export default function LiveAlpona({ size = 370 }) {
  const cx = 200;
  const cy = 200;

  // ---- Ring 0: center chakra spokes ----
  const spokeCount = 12;
  const spokes = Array.from({ length: spokeCount }).map((_, i) => {
    const a = (i * TAU) / spokeCount;
    const [x1, y1] = polar(cx, cy, 14, a);
    const [x2, y2] = polar(cx, cy, 34, a);
    return { key: `spoke${i}`, x1, y1, x2, y2, delay: 0.2 + i * 0.03 };
  });

  // ---- Ring 1: toothed gear ring ----
  const toothCount = 24;
  const teeth = Array.from({ length: toothCount }).map((_, i) => {
    const a = (i * TAU) / toothCount;
    const half = (TAU / toothCount) * 0.32;
    const [bx1, by1] = polar(cx, cy, 52, a - half);
    const [bx2, by2] = polar(cx, cy, 52, a + half);
    const [tx, ty] = polar(cx, cy, 72, a);
    return {
      key: `tooth${i}`,
      d: `M ${bx1} ${by1} L ${tx} ${ty} L ${bx2} ${by2} Z`,
      fill: i % 2 === 0 ? "#5A3825" : "#FCD34D",
      delay: 0.9 + i * 0.02,
    };
  });

  // ---- Ring 2: four lotus clusters (N, E, S, W) ----
  const clusterAngles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
  const petalsPerCluster = 5;
  const lotusClusters = clusterAngles.map((centerAngle, ci) => {
    const petals = Array.from({ length: petalsPerCluster }).map((_, pi) => {
      const mid = (petalsPerCluster - 1) / 2;
      const spread = 0.86;
      const a = centerAngle + (pi - mid) * (spread / (petalsPerCluster - 1));
      const rBase = 82;
      const rTip = pi === mid ? 172 : 150 - Math.abs(pi - mid) * 8;
      const widthAngle = 0.16 + (pi === mid ? 0.02 : 0);
      const [bx1, by1] = polar(cx, cy, rBase, a - widthAngle);
      const [bx2, by2] = polar(cx, cy, rBase, a + widthAngle);
      const [tipX, tipY] = polar(cx, cy, rTip, a);
      // control points bow OUTWARD past the base-to-tip line for a
      // rounded, bulbous petal belly instead of a straight-edged arrow
      const [c1x, c1y] = polar(cx, cy, rTip * 0.62, a - widthAngle * 1.35);
      const [c2x, c2y] = polar(cx, cy, rTip * 0.62, a + widthAngle * 1.35);
      return {
        key: `lotus${ci}-${pi}`,
        d: `M ${bx1} ${by1} Q ${c1x} ${c1y} ${tipX} ${tipY} Q ${c2x} ${c2y} ${bx2} ${by2} Q ${cx + (bx1 - cx) * 0.9} ${cy + (by1 - cy) * 0.9} ${bx1} ${by1} Z`,
        fill: pi === mid ? "#F5A623" : "#C63822",
        delay: 1.6 + ci * 0.3 + pi * 0.06,
      };
    });
    return petals;
  });

  // ---- Diagonal paisley curl connectors (NE, SE, SW, NW) ----
  const paisleyAngles = [-Math.PI / 4, Math.PI / 4, (3 * Math.PI) / 4, (-3 * Math.PI) / 4];
  const paisleys = paisleyAngles.map((a, i) => {
    const [bx, by] = polar(cx, cy, 96, a);
    const [midX, midY] = polar(cx, cy, 126, a - 0.28);
    const [tipX, tipY] = polar(cx, cy, 118, a + 0.22);
    const [curlX, curlY] = polar(cx, cy, 108, a + 0.42);
    return {
      key: `paisley${i}`,
      d: `M ${bx} ${by} Q ${midX} ${midY} ${tipX} ${tipY} Q ${curlX} ${curlY} ${bx} ${by} Z`,
      delay: 2.7 + i * 0.15,
    };
  });

  // ---- Ring 3: alternating leaf ring ----
  const leafCount = 20;
  const leafRing = Array.from({ length: leafCount }).map((_, i) => {
    const a = (i * TAU) / leafCount;
    const rOut = i % 2 === 0 ? 175 : 165;
    const [bx1, by1] = polar(cx, cy, 148, a - 0.09);
    const [bx2, by2] = polar(cx, cy, 148, a + 0.09);
    const [tipX, tipY] = polar(cx, cy, rOut, a);
    return {
      key: `leaf${i}`,
      d: `M ${bx1} ${by1} Q ${(bx1 + tipX) / 2} ${(by1 + tipY) / 2} ${tipX} ${tipY} Q ${(bx2 + tipX) / 2} ${(by2 + tipY) / 2} ${bx2} ${by2} Z`,
      fill: i % 2 === 0 ? "#5A3825" : "#F5A623",
      delay: 3.1 + i * 0.03,
    };
  });

  // ---- Ring 4: fine dotted ring ----
  const dotRing1Count = 40;
  const dotRing1 = Array.from({ length: dotRing1Count }).map((_, i) => {
    const a = (i * TAU) / dotRing1Count;
    const [x, y] = polar(cx, cy, 181, a);
    return { key: `dr1-${i}`, x, y, r: 2.1, fill: "#C63822", delay: 3.7 + i * 0.012 };
  });

  // ---- Ring 5: beaded scalloped border ----
  const scallopCount = 32;
  const scallops = Array.from({ length: scallopCount }).map((_, i) => {
    const a = (i * TAU) / scallopCount;
    const [x, y] = polar(cx, cy, 190, a);
    return { key: `sc-${i}`, x, y, r: 5, fill: "#FCD34D", delay: 4.05 + i * 0.02 };
  });

  // ---- Ring 6: outermost fine dotted rim ----
  const dotRing2Count = 60;
  const dotRing2 = Array.from({ length: dotRing2Count }).map((_, i) => {
    const a = (i * TAU) / dotRing2Count;
    const [x, y] = polar(cx, cy, 198, a);
    return { key: `dr2-${i}`, x, y, r: 1.6, fill: "#5A3825", delay: 4.45 + i * 0.008 };
  });

  // ---- Ring 7: kalka (paisley/mango curl) band — new outer layer ----
  // Each motif is drawn in a local frame (local +x = "outward along the
  // radial direction") then rotated into place, since a proper kalka
  // curl isn't a simple radial wedge like the other rings — it's a
  // teardrop body that bulges to one side and hooks back on itself.
  //
  // IMPORTANT: the position/rotation transform is applied on a
  // wrapping <g>, NOT directly on the animated <path>. A CSS
  // `transform` animation (which "alp-fill" applies for the scale-in
  // effect) silently REPLACES an element's own SVG `transform`
  // attribute rather than combining with it — putting both on the
  // same element collapses every instance to the same untransformed
  // spot. This bit me on the first pass; keep the split if you touch
  // this ring.
  const kalkaCount = 20;
  const kalkaLen = 30;
  const kalkaWidth = 15;
  const kalkaInnerR = 206;
  const kalkaPath = `
    M 0 0
    C ${kalkaLen * 0.15} ${kalkaWidth * 0.55}, ${kalkaLen * 0.55} ${kalkaWidth * 0.6}, ${kalkaLen * 0.78} ${kalkaWidth * 0.15}
    C ${kalkaLen * 0.92} ${-kalkaWidth * 0.05}, ${kalkaLen * 0.85} ${-kalkaWidth * 0.35}, ${kalkaLen * 0.62} ${-kalkaWidth * 0.32}
    C ${kalkaLen * 0.5} ${-kalkaWidth * 0.3}, ${kalkaLen * 0.4} ${-kalkaWidth * 0.15}, ${kalkaLen * 0.42} ${kalkaWidth * 0.02}
    C ${kalkaLen * 0.3} ${kalkaWidth * 0.05}, ${kalkaLen * 0.15} ${-kalkaWidth * 0.05}, 0 0
    Z
  `;
  const kalkas = Array.from({ length: kalkaCount }).map((_, i) => {
    const a = (i * TAU) / kalkaCount;
    const [x0, y0] = polar(cx, cy, kalkaInnerR, a);
    const degrees = (a * 180) / Math.PI;
    return {
      key: `kalka${i}`,
      transform: `translate(${x0} ${y0}) rotate(${degrees})`,
      fill: i % 2 === 0 ? "#C63822" : "#F5A623",
      delay: 5.0 + i * 0.035,
    };
  });
  const outerFrameR = kalkaInnerR + kalkaLen * 0.95;

  return (
    <div style={{ width: size, height: size, position: "relative", margin: "0 auto" }}>
      <style>{`
        .alp-fill {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          animation-name: alp-fill-cycle;
          animation-duration: 16s;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @keyframes alp-fill-cycle {
          0%   { opacity: 0; transform: scale(0.55); }
          6%   { opacity: 0; }
          10%  { opacity: 1; transform: scale(1); }
          78%  { opacity: 1; transform: scale(1); }
          92%  { opacity: 0; transform: scale(0.55); }
          100% { opacity: 0; }
        }
      `}</style>

      <svg viewBox="-40 -40 480 480" width={size} height={size} fill="none">
        <defs>
          <filter id="alpGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g strokeLinecap="round" filter="url(#alpGlow)">
          {/* center chakra */}
          <circle cx={cx} cy={cy} r="10" fill="#5A3825" className="alp-step" style={{ animationDelay: "0s" }} />
          <circle cx={cx} cy={cy} r="10" fill="none" stroke="#FCD34D" strokeWidth="2" className="alp-step" style={{ animationDelay: "0.15s" }} />
          {spokes.map((s) => (
            <path
              key={s.key}
              d={`M ${s.x1} ${s.y1} L ${s.x2} ${s.y2}`}
              stroke="#5A3825"
              strokeWidth="2.2"
              className="alp-draw"
              style={{ animationDelay: `${s.delay}s`, strokeDasharray: 30 }}
            />
          ))}
          <circle cx={cx} cy={cy} r="38" stroke="#FCD34D" strokeWidth="1.2" opacity="0.85" className="alp-draw" style={{ animationDelay: "0.6s", strokeDasharray: 240 }} />

          {/* toothed gear ring */}
          {teeth.map((t) => (
            <path key={t.key} d={t.d} fill={t.fill} className="alp-fill" style={{ animationDelay: `${t.delay}s` }} />
          ))}

          {/* four lotus clusters */}
          {lotusClusters.map((petals) => petals.map((p) => (
            <path key={p.key} d={p.d} fill={p.fill} stroke="#5A3825" strokeWidth="0.8" className="alp-fill" style={{ animationDelay: `${p.delay}s` }} />
          )))}

          {/* diagonal paisley connectors */}
          {paisleys.map((p) => (
            <path key={p.key} d={p.d} fill="#F5A623" stroke="#5A3825" strokeWidth="0.8" className="alp-fill" style={{ animationDelay: `${p.delay}s` }} />
          ))}

          {/* alternating leaf ring */}
          {leafRing.map((l) => (
            <path key={l.key} d={l.d} fill={l.fill} className="alp-fill" style={{ animationDelay: `${l.delay}s` }} />
          ))}

          {/* fine dotted ring */}
          {dotRing1.map((d) => (
            <circle key={d.key} cx={d.x} cy={d.y} r={d.r} fill={d.fill} className="alp-step" style={{ animationDelay: `${d.delay}s` }} />
          ))}

          {/* beaded scalloped border */}
          {scallops.map((s) => (
            <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={s.fill} className="alp-step" style={{ animationDelay: `${s.delay}s` }} />
          ))}

          {/* outer frame line */}
          <circle cx={cx} cy={cy} r="199" stroke="#FCD34D" strokeWidth="1" opacity="0.6" className="alp-draw" style={{ animationDelay: "4.4s", strokeDasharray: 1260 }} />

          {/* outermost fine dotted rim */}
          {dotRing2.map((d) => (
            <circle key={d.key} cx={d.x} cy={d.y} r={d.r} fill={d.fill} className="alp-step" style={{ animationDelay: `${d.delay}s` }} />
          ))}

          {/* kalka (paisley/mango curl) band */}
          {kalkas.map((k) => (
            <g key={k.key} transform={k.transform}>
              <path
                d={kalkaPath}
                fill={k.fill}
                stroke="#5A3825"
                strokeWidth="0.8"
                className="alp-fill"
                style={{ animationDelay: `${k.delay}s` }}
              />
            </g>
          ))}

          {/* finishing outer ring, just past the kalka band */}
          <circle cx={cx} cy={cy} r={outerFrameR} stroke="#FCD34D" strokeWidth="1" opacity="0.5" className="alp-draw" style={{ animationDelay: "5.8s", strokeDasharray: 1440 }} />
        </g>
      </svg>

      <span className="alp-tracer alp-tracer-1" />
      <span className="alp-tracer alp-tracer-2" />
      <span className="alp-tracer alp-tracer-3" />
      <span className="alp-tracer alp-tracer-4" />
      <span className="alp-tracer alp-tracer-5" />
    </div>
  );
}
