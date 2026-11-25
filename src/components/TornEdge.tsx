/**
 * A torn paper edge for the top or bottom of a section. The jagged path is
 * seeded, so the server and browser draw the same shape. It takes the
 * section's background via `currentColor`; for crumpled sections pass `paper`
 * to show the same texture through the tear.
 */

function seeded(seed: number) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function tornPath(seed: number, teeth = 90) {
  const rnd = seeded(seed);
  let d = "M0 24 L0 ";
  d += (10 + rnd() * 8).toFixed(1);
  for (let i = 1; i <= teeth; i++) {
    const x = (i / teeth) * 1000;
    const y = 4 + rnd() * 14 + (i % 2 ? rnd() * 4 : 0);
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d} L1000 24 Z`;
}

interface TornEdgeProps {
  side: "top" | "bottom";
  seed?: number;
  className?: string;
}

export function TornEdge({ side, seed = 1, className }: TornEdgeProps) {
  return (
    <span className={`torn-edge torn-edge--${side} ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 1000 24" preserveAspectRatio="none">
        <path d={tornPath(seed)} />
      </svg>
    </span>
  );
}
