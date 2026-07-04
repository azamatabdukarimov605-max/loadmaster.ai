export function RouteNetwork({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="260" fill="url(#glow)" />
      <circle
        cx="300"
        cy="300"
        r="200"
        fill="none"
        stroke="#00D4FF"
        strokeOpacity="0.15"
      />
      <circle
        cx="300"
        cy="300"
        r="140"
        fill="none"
        stroke="#00D4FF"
        strokeOpacity="0.2"
      />
      <circle
        cx="300"
        cy="300"
        r="80"
        fill="none"
        stroke="#00D4FF"
        strokeOpacity="0.25"
      />

      {[
        [300, 60, 460, 200],
        [300, 60, 150, 220],
        [460, 200, 500, 400],
        [150, 220, 100, 420],
        [500, 400, 340, 540],
        [100, 420, 260, 540],
        [340, 540, 260, 540],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#00D4FF"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          strokeOpacity="0.5"
          className="animate-pulseGlow"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}

      {[
        [300, 60],
        [460, 200],
        [150, 220],
        [500, 400],
        [100, 420],
        [340, 540],
        [260, 540],
        [300, 300],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={i === 7 ? 8 : 5}
          fill="#00D4FF"
          className="animate-floaty"
          style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}
    </svg>
  );
}
