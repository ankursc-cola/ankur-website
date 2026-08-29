/**
 * A rectangular alpona-style border that wraps a group of content (e.g. all
 * sponsors in one tier). Unlike LiveAlpona.jsx (a fixed-size circular
 * mandala), this measures its own container via ResizeObserver and draws
 * the border to match — so it works around content of any width/height,
 * including content that changes size (e.g. more sponsors added later).
 *
 * Structure:
 *   1. outer frame rect
 *   2. small circle accents evenly spaced along the top and bottom edges
 *   3. (platinum only) small triangle accents alternating with the circles
 *   4. a glow dot that continuously travels the full rectangle perimeter
 *      via SVG <animateMotion>, plus a soft trailing halo on platinum
 *
 * Color and density step down by tier: platinum is busiest and brightest,
 * gold is calmer, silver is just a quiet frame with a faint traveling dot.
 *
 * IMPORTANT (same gotcha documented in LiveAlpona.jsx): nothing in this
 * file combines a static SVG `transform` attribute with a CSS animation
 * that also animates `transform` on the same element. The traveling glow
 * uses SMIL <animateMotion>, not CSS transform, specifically to avoid
 * that trap.
 */

import { useEffect, useRef, useState } from "react";

const TIER_CONFIG = {
  platinum: {
    stroke: "#FCD34D",
    innerStroke: "#C63822",
    accent: "#C63822",
    accent2: "#F5A623",
    glowColor: "#FCD34D",
    glowDuration: "5s",
    glowHalo: true,
    showTriangles: true,
    accentCount: 5,
    frameWidth: 1.2,
  },
  gold: {
    stroke: "#F5A623",
    innerStroke: null,
    accent: "#F5A623",
    accent2: "#F5A623",
    glowColor: "#F5A623",
    glowDuration: "7s",
    glowHalo: false,
    showTriangles: false,
    accentCount: 5,
    frameWidth: 1,
  },
  silver: {
    stroke: "#5A3825",
    innerStroke: null,
    accent: null,
    accent2: null,
    glowColor: "#5A3825",
    glowDuration: "9s",
    glowHalo: false,
    showTriangles: false,
    accentCount: 0,
    frameWidth: 0.6,
  },
};

export default function RectAlpona({ tier = "silver", padding = 20, children }) {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG.silver;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { width, height } = size;
  const ready = width > 0 && height > 0;

  const x0 = padding / 2;
  const y0 = padding / 2;
  const x1 = width - padding / 2;
  const y1 = height - padding / 2;
  const perimeterPathId = `alp-rect-path-${tier}`;
  const perimeterD = `M ${x0} ${y0} H ${x1} V ${y1} H ${x0} Z`;

  const accents = [];
  if (ready && cfg.accentCount > 0) {
    const usableWidth = x1 - x0;
    for (let i = 0; i < cfg.accentCount; i++) {
      const px = x0 + (usableWidth * i) / (cfg.accentCount - 1);
      accents.push({ x: px, key: `top-${i}` });
    }
  }

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {ready && (
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <defs>
            <path id={perimeterPathId} d={perimeterD} />
          </defs>

          <rect
            x={x0}
            y={y0}
            width={x1 - x0}
            height={y1 - y0}
            rx="6"
            fill="none"
            stroke={cfg.stroke}
            strokeWidth={cfg.frameWidth}
            opacity="0.85"
          />
          {cfg.innerStroke && (
            <rect
              x={x0 + 8}
              y={y0 + 8}
              width={x1 - x0 - 16}
              height={y1 - y0 - 16}
              rx="4"
              fill="none"
              stroke={cfg.innerStroke}
              strokeWidth="0.5"
            />
          )}

          {cfg.accent &&
            accents.map((a) => (
              <g key={a.key}>
                <circle cx={a.x} cy={y0} r="3.5" fill={cfg.accent} />
                <circle cx={a.x} cy={y1} r="3.5" fill={cfg.accent} />
                {cfg.showTriangles && a.key !== "top-0" && a.key !== `top-${cfg.accentCount - 1}` && (
                  <>
                    <polygon
                      points={`${a.x - 5},${y0 - 3} ${a.x + 5},${y0 - 3} ${a.x},${y0 - 12}`}
                      fill={cfg.accent2}
                    />
                    <polygon
                      points={`${a.x - 5},${y1 + 3} ${a.x + 5},${y1 + 3} ${a.x},${y1 + 12}`}
                      fill={cfg.accent2}
                    />
                  </>
                )}
              </g>
            ))}

          {cfg.glowHalo && (
            <circle r="10" fill={cfg.glowColor} opacity="0.3">
              <animateMotion dur={cfg.glowDuration} repeatCount="indefinite">
                <mpath href={`#${perimeterPathId}`} />
              </animateMotion>
            </circle>
          )}
          <circle r={cfg.glowHalo ? 6 : tier === "silver" ? 4 : 5} fill={cfg.glowColor} opacity="0.9">
            <animateMotion dur={cfg.glowDuration} repeatCount="indefinite">
              <mpath href={`#${perimeterPathId}`} />
            </animateMotion>
          </circle>
        </svg>
      )}
      <div style={{ position: "relative", padding: `${padding + 12}px ${padding + 16}px` }}>
        {children}
      </div>
    </div>
  );
}
