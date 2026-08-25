import { useMemo } from "react";

/**
 * HoliAlpona — a thicker, whiter/cream alpona with rounded flower
 * clusters instead of the crimson/gold Durga Puja motif, plus an
 * animated ring of "gulal" (colored powder) particles that sprinkle
 * outward from the center and fade, looping continuously.
 *
 * Self-contained, same philosophy as LiveAlpona.jsx: all animation
 * CSS lives in the inline <style> below, no changes needed to
 * index.css. Drop this in as a sibling component and swap it in
 * wherever LiveAlpona is rendered for a specific event.
 */

const HOLI_COLORS = [
  "#EC4899", // pink
  "#FBBF24", // yellow
  "#22C55E", // green
  "#3B82F6", // blue
  "#A855F7", // purple
  "#FB923C", // orange
  "#F472B6", // rose
  "#38BDF8", // sky
  "#C63822", // vermillion — Ankur's own Avro palette, woven into the mix
  "#F5A623", // amber — same
];

const CREAM = "#FFFBF0";
const CREAM_LINE = "#F3E9D2";
const PETAL_OUTLINE = "#E3B25C"; // warm gold-amber, from the Avro family — was a
                                  // generic pink before, unrelated to the site's palette
const GOLD_GLOW = "#FCD34D"; // exact Avro gold-glow, for the center medallion

// Generated once at module load, not per-render — keeps the burst
// visually stable during a session while still looking organically
// random each time the page loads.
function makeParticles(count) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 150 + Math.random() * 150; // travel much further before fading
    const size = 3 + Math.random() * 5;
    const color = HOLI_COLORS[Math.floor(Math.random() * HOLI_COLORS.length)];
    const delay = Math.random() * 3.5;
    const duration = 2.6 + Math.random() * 1.8;
    particles.push({
      id: i,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      size,
      color,
      delay,
      duration,
    });
  }
  return particles;
}

export default function HoliAlpona({ size = 320 }) {
  const particles = useMemo(() => makeParticles(46), []);

  // Four flower clusters at N / E / S / W, each 5 rounded petals —
  // same structural idea as LiveAlpona's lotus clusters, restyled as
  // soft blossoms in cream with a faint pink outline.
  const clusterAngles = [-90, 0, 90, 180];

  // A real 5-petal blossom: each petal is a teardrop radiating OUT
  // from one shared center point, evenly spaced around 360deg — the
  // classic flower construction. The earlier version instead offset
  // plain ellipses sideways along an arc, which is why they read as
  // a row of eggs rather than a flower.
  function petal(rotation) {
    return (
      <path
        d="M 0,0 C -9,-14 -11,-34 0,-46 C 11,-34 9,-14 0,0 Z"
        fill={CREAM}
        stroke={PETAL_OUTLINE}
        strokeWidth="1.6"
        transform={`rotate(${rotation})`}
      />
    );
  }

  function flowerCluster(angleDeg, key) {
    // Position this flower's own center out along the main ring,
    // then draw its 5 petals radiating from that local point.
    const flowerCenterR = 140;
    const rad = (angleDeg * Math.PI) / 180;
    const fx = 200 + Math.cos(rad) * flowerCenterR;
    const fy = 200 + Math.sin(rad) * flowerCenterR;
    const petalAngles = [0, 72, 144, 216, 288];
    return (
      <g key={key} transform={`translate(${fx} ${fy})`}>
        {petalAngles.map((pa) => (
          <g key={pa}>{petal(pa)}</g>
        ))}
        <circle r="7" fill={GOLD_GLOW} />
      </g>
    );
  }

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <style>{`
        .holi-particle {
          animation-name: holiBurst;
          animation-iteration-count: infinite;
          animation-timing-function: ease-out;
          transform-origin: center;
        }
        @keyframes holiBurst {
          0%   { transform: translate(0, 0) scale(0.4); opacity: 0; }
          10%  { opacity: 1; }
          85%  { opacity: 0.8; }
          100% { transform: translate(var(--dx), var(--dy)) scale(1); opacity: 0; }
        }
        .holi-ring-line {
          animation: holiRingPulse 6s ease-in-out infinite;
        }
        @keyframes holiRingPulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.9; }
        }
      `}</style>

      <svg viewBox="-120 -120 640 640" width={size} height={size} fill="none">
        {/* Outer thin ring, cream */}
        <circle
          cx="200"
          cy="200"
          r="196"
          stroke={CREAM_LINE}
          strokeWidth="1.5"
          className="holi-ring-line"
        />

        {/* Thicker inner ring — this is the "thicker, whiter" alpona line */}
        <circle
          cx="200"
          cy="200"
          r="150"
          stroke={CREAM}
          strokeWidth="6"
        />
        <circle
          cx="200"
          cy="200"
          r="150"
          stroke={PETAL_OUTLINE}
          strokeWidth="1"
        />

        {/* Four flower clusters */}
        {clusterAngles.map((a, i) => flowerCluster(a, i))}

        {/* Center medallion */}
        <circle cx="200" cy="200" r="34" fill={CREAM} stroke={PETAL_OUTLINE} strokeWidth="1.5" />
        <circle cx="200" cy="200" r="10" fill="#FDE68A" />

        {/* Colored gulal particles, bursting outward from center */}
        {particles.map((p) => (
          <circle
            key={p.id}
            className="holi-particle"
            cx="200"
            cy="200"
            r={p.size}
            fill={p.color}
            style={{
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
