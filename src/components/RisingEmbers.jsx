import { useMemo } from "react";

/**
 * A field of small golden dots that drift slowly upward and fade,
 * like embers/diya sparks rising. Purely decorative — sits behind
 * the hero content, same layer style as GlowLayer.
 */
export default function RisingEmbers({ count = 26 }) {
  const embers = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,            // % across the hero
      size: 8 + Math.random() * 5,           // px
      duration: 5 + Math.random() * 10,      // seconds to rise
      delay: -(Math.random() * 18),          // negative = already mid-flight on load
      drift: (Math.random() - 0.5) * 60,     // px of horizontal sway
      opacity: 0.2 + Math.random() * 0.5,
    }));
  }, [count]);

  return (
    <div className="embers-layer" aria-hidden="true">
      {embers.map((e) => (
        <span
          key={e.id}
          className="ember"
          style={{
            left: `${e.left}%`,
            width: e.size,
            height: e.size,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
            "--drift": `${e.drift}px`,
            "--peak-opacity": e.opacity,
          }}
        />
      ))}
    </div>
  );
}
