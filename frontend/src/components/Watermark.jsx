export function Watermark({ text }) {
  if (!text) return null;
  const tile = `${text} · POLYCODE SCHOOL`;
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      style={{ zIndex: 9999 }}
      aria-hidden="true"
      data-testid="pdf-watermark"
    >
      <div
        className="absolute inset-0"
        style={{
          transform: "rotate(-28deg) scale(1.6)",
          transformOrigin: "center",
          opacity: 0.08,
          color: "#6A66EB",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.18em",
          whiteSpace: "nowrap",
          lineHeight: "44px",
        }}
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i}>
            {Array.from({ length: 12 })
              .map(() => tile)
              .join("    ")}
          </div>
        ))}
      </div>
    </div>
  );
}
