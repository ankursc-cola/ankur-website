import { useMemo } from "react";

/**
 * BoiAlpona — themed for Saraswati Puja (Basanti Panchami). Same
 * structural pattern as HoliAlpona.jsx: a real 5-petal blossom
 * cluster at N/E/S/W, plus an animated particle system radiating
 * from center. Here the particles are small drifting petal shapes
 * (not round powder dots), in a narrow, serene basanti-yellow and
 * white palette — deliberately calmer and slower than Holi's burst,
 * matching Saraswati's association with knowledge, music, and quiet
 * elegance rather than a festive explosion of color.
 */

const SARASWATI_COLORS = ["#FDE68A", "#FBBF24", "#FFFFFF", "#FEF3C7", "#F5D98A"];

const CREAM = "#FFFBF0";
const PETAL_OUTLINE = "#D4A017"; // soft basanti mustard-yellow
const CENTER_GOLD = "#F5C543";

function makeParticles(count) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 150 + Math.random() * 150;
    const size = 3 + Math.random() * 4;
    const color = SARASWATI_COLORS[Math.floor(Math.random() * SARASWATI_COLORS.length)];
    const delay = Math.random() * 4;
    const duration = 4.5 + Math.random() * 2.5; // slower, gentler drift than Holi
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

export default function BoiAlpona({ size = 320 }) {
  const particles = useMemo(() => makeParticles(28), []);
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
        .boi-particle {
          animation-name: boiDrift;
          animation-iteration-count: infinite;
          animation-timing-function: ease-out;
          transform-origin: center;
        }
        @keyframes boiDrift {
          0%   { transform: translate(0, 0) scale(0.4); opacity: 0; }
          14%  { opacity: 0.95; }
          85%  { opacity: 0.7; }
          100% { transform: translate(var(--dx), var(--dy)) scale(1); opacity: 0; }
        }
        .boi-ring-line {
          animation: boiRingPulse 7s ease-in-out infinite;
        }
        @keyframes boiRingPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.85; }
        }
      `}</style>

      <svg viewBox="-120 -120 640 640" width={size} height={size} fill="none">
        <circle cx="200" cy="200" r="196" stroke="#F3E9D2" strokeWidth="1.5" className="boi-ring-line" />
        <circle cx="200" cy="200" r="150" stroke={CREAM} strokeWidth="6" />
        <circle cx="200" cy="200" r="150" stroke={PETAL_OUTLINE} strokeWidth="1" />

        {clusterAngles.map((a, i) => flowerCluster(a, i))}

        <circle cx="200" cy="200" r="34" fill={CREAM} stroke={PETAL_OUTLINE} strokeWidth="1.5" />
        <circle cx="200" cy="200" r="10" fill={CENTER_GOLD} />

        {particles.map((p) => (
          <circle
            key={p.id}
            className="boi-particle"
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
