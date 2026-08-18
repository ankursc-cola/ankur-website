/**
 * A large alpona mandala that continuously "redraws" itself in stages
 * (center outward), as if a hand is currently painting it — plus five
 * small glowing tracer dots orbiting at different rings/speeds ("planets").
 */
export default function LiveAlpona({ size = 300 }) {
  const N = 16;
  const outerPetals = Array.from({ length: N });
  const innerPetals = Array.from({ length: N });
  const rays = Array.from({ length: N });
  const leafs = Array.from({ length: N });
  const dots = Array.from({ length: N * 2 });

  return (
    <div style={{ width: size, height: size, position: "relative", margin: "0 auto" }}>
      <svg viewBox="0 0 400 400" width={size} height={size} fill="none">
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
          <circle cx="200" cy="200" r="9" fill="#33190F" className="alp-step" style={{ animationDelay: "0s" }} />
          <circle cx="200" cy="200" r="9" fill="none" stroke="#FCD34D" strokeWidth="2" className="alp-step" style={{ animationDelay: "0.15s" }} />

          <circle cx="200" cy="200" r="34" stroke="#33190F" strokeWidth="2.6" className="alp-draw" style={{ animationDelay: "0.3s", strokeDasharray: 220 }} />
          <circle cx="200" cy="200" r="42" stroke="#FCD34D" strokeWidth="1.4" opacity="0.85" className="alp-draw" style={{ animationDelay: "0.5s", strokeDasharray: 270 }} />

          {rays.map((_, i) => {
            const a = (i * Math.PI * 2) / N;
            const x1 = 200 + Math.cos(a) * 46;
            const y1 = 200 + Math.sin(a) * 46;
            const x2 = 200 + Math.cos(a) * 92;
            const y2 = 200 + Math.sin(a) * 92;
            return (
              <path
                key={"r" + i}
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                stroke="#33190F"
                strokeWidth="2"
                opacity="0.8"
                className="alp-draw"
                style={{ animationDelay: `${0.9 + i * 0.045}s`, strokeDasharray: 60 }}
              />
            );
          })}

          {innerPetals.map((_, i) => {
            const a = (i * Math.PI * 2) / N;
            const x1 = 200 + Math.cos(a) * 92;
            const y1 = 200 + Math.sin(a) * 92;
            const x2 = 200 + Math.cos(a + 0.3) * 92;
            const y2 = 200 + Math.sin(a + 0.3) * 92;
            const cx = 200 + Math.cos(a + 0.15) * 118;
            const cy = 200 + Math.sin(a + 0.15) * 118;
            return (
              <path
                key={"ip" + i}
                d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                stroke="#C63822"
                strokeWidth="2"
                className="alp-draw"
                style={{ animationDelay: `${1.5 + i * 0.05}s`, strokeDasharray: 140 }}
              />
            );
          })}

          {outerPetals.map((_, i) => {
            const a = (i * Math.PI * 2) / N;
            const x1 = 200 + Math.cos(a) * 130;
            const y1 = 200 + Math.sin(a) * 130;
            const x2 = 200 + Math.cos(a + 0.34) * 130;
            const y2 = 200 + Math.sin(a + 0.34) * 130;
            const cx = 200 + Math.cos(a + 0.17) * 178;
            const cy = 200 + Math.sin(a + 0.17) * 178;
            const tipX = 200 + Math.cos(a + 0.17) * 186;
            const tipY = 200 + Math.sin(a + 0.17) * 186;
            return (
              <g key={"op" + i}>
                <path
                  d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                  stroke="#33190F"
                  strokeWidth="2.4"
                  className="alp-draw"
                  style={{ animationDelay: `${2.2 + i * 0.055}s`, strokeDasharray: 170 }}
                />
                <circle cx={tipX} cy={tipY} r="4.5" fill="#FCD34D" className="alp-step" style={{ animationDelay: `${2.9 + i * 0.055}s` }} />
              </g>
            );
          })}

          {leafs.map((_, i) => {
            const a = (i * Math.PI * 2) / N + Math.PI / N;
            const bx = 200 + Math.cos(a) * 150;
            const by = 200 + Math.sin(a) * 150;
            const tx = 200 + Math.cos(a) * 168;
            const ty = 200 + Math.sin(a) * 168;
            const cx1 = bx + Math.cos(a + 1.4) * 10;
            const cy1 = by + Math.sin(a + 1.4) * 10;
            return (
              <path
                key={"lf" + i}
                d={`M ${bx} ${by} Q ${cx1} ${cy1} ${tx} ${ty}`}
                stroke="#F5A623"
                strokeWidth="1.8"
                opacity="0.85"
                className="alp-draw"
                style={{ animationDelay: `${3.5 + i * 0.04}s`, strokeDasharray: 40 }}
              />
            );
          })}

          <circle cx="200" cy="200" r="192" stroke="#33190F" strokeWidth="2.2" opacity="0.75" className="alp-draw" style={{ animationDelay: "4s", strokeDasharray: 1210 }} />
          <circle cx="200" cy="200" r="200" stroke="#FCD34D" strokeWidth="1.2" opacity="0.6" className="alp-draw" style={{ animationDelay: "4.2s", strokeDasharray: 1260 }} />

          {dots.map((_, i) => {
            const a = (i * Math.PI * 2) / (N * 2);
            const r = i % 2 === 0 ? 192 : 200;
            const x = 200 + Math.cos(a) * r;
            const y = 200 + Math.sin(a) * r;
            return (
              <circle
                key={"d" + i}
                cx={x}
                cy={y}
                r={i % 2 === 0 ? 3.2 : 2.2}
                fill={i % 2 === 0 ? "#33190F" : "#C63822"}
                className="alp-step"
                style={{ animationDelay: `${4.6 + i * 0.025}s` }}
              />
            );
          })}
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
