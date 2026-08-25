import { useMemo } from "react";

/**
 * NoboAlpona — themed for Poila Boishakh (Bengali New Year). Same
 * structural pattern as HoliAlpona/BoiAlpona: a real 5-petal blossom
 * cluster at N/E/S/W, plus an animated particle burst from center.
 * Palette is the traditional red-and-white of Poila Boishakh, which
 * happens to line up directly with Ankur's own vermillion/crimson —
 * leaned into deliberately rather than treated as coincidence. A
 * static radiating sunray motif sits behind the rings, matching the
 * "new year, new dawn" symbolism of the festival.
 */

const NOBO_COLORS = ["#C63822", "#7A1B1F", "#FFFFFF", "#FCD34D", "#E85D3D"];

const CREAM = "#FFFBF0";
const PETAL_OUTLINE = "#C63822"; // vermillion — Ankur's own
const CENTER_GOLD = "#FCD34D";

function makeParticles(count) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 150 + Math.random() * 150;
    const size = 3 + Math.random() * 5;
    const color = NOBO_COLORS[Math.floor(Math.random() * NOBO_COLORS.length)];
    const delay = Math.random() * 3.5;
    const duration = 2.8 + Math.random() * 1.8;
    particles.push({ id: i, dx: Math.cos(angle) * distance, dy: Math.sin(angle) * distance, size, color, delay, duration });
  }
  return particles;
}

function makeSunrays(count) {
  const rays = [];
  for (let i = 0; i < count; i++) {
    rays.push((360 / count) * i);
  }
  return rays;
}

export default function NoboAlpona({ size = 320 }) {
  const particles = useMemo(() => makeParticles(38), []);
  const rays = useMemo(() => makeSunrays(16), []);
  const clusterAngles = [-90, 0, 90, 180];

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
        <circle r="7" fill={CENTER_GOLD} />
      </g>
    );
  }

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <style>{`
        .nobo-particle {
          animation-name: noboBurst;
          animation-iteration-count: infinite;
          animation-timing-function: ease-out;
          transform-origin: center;
        }
        @keyframes noboBurst {
          0%   { transform: translate(0, 0) scale(0.4); opacity: 0; }
          10%  { opacity: 1; }
          85%  { opacity: 0.8; }
          100% { transform: translate(var(--dx), var(--dy)) scale(1); opacity: 0; }
        }
        .nobo-ray {
          animation: noboRayGlow 5s ease-in-out infinite;
        }
        @keyframes noboRayGlow {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.55; }
        }
      `}</style>

      <svg viewBox="-120 -120 640 640" width={size} height={size} fill="none">
        {/* Static radiating sunray motif, behind everything else */}
        {rays.map((deg, i) => (
          <line
            key={i}
            className="nobo-ray"
            x1="200"
            y1="200"
            x2="200"
            y2="30"
            stroke={CENTER_GOLD}
            strokeWidth="2"
            transform={`rotate(${deg} 200 200)`}
            style={{ animationDelay: `${(i % 4) * 0.4}s` }}
          />
        ))}

        <circle cx="200" cy="200" r="196" stroke="#F3E9D2" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="150" stroke={CREAM} strokeWidth="6" />
        <circle cx="200" cy="200" r="150" stroke={PETAL_OUTLINE} strokeWidth="1" />

        {clusterAngles.map((a, i) => flowerCluster(a, i))}

        <circle cx="200" cy="200" r="34" fill={CREAM} stroke={PETAL_OUTLINE} strokeWidth="1.5" />
        <circle cx="200" cy="200" r="10" fill={CENTER_GOLD} />

        {particles.map((p) => (
          <circle
            key={p.id}
            className="nobo-particle"
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
