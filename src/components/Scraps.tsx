/**
 * Torn paper letters ("ransom note" style). The torn edge is a polygon
 * clip-path; it is seeded per letter so the server and the browser draw
 * the same shape (no hydration mismatch).
 */

function seeded(seed: number) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function tornClip(seed: number) {
  const rnd = seeded(seed);
  const pts: string[] = [];
  const n = 7;
  for (let i = 0; i <= n; i++) pts.push(`${((i / n) * 100).toFixed(1)}% ${(rnd() * 6).toFixed(1)}%`);
  for (let i = 0; i <= n; i++) pts.push(`${(100 - rnd() * 5).toFixed(1)}% ${((i / n) * 100).toFixed(1)}%`);
  for (let i = n; i >= 0; i--) pts.push(`${((i / n) * 100).toFixed(1)}% ${(100 - rnd() * 6).toFixed(1)}%`);
  for (let i = n; i >= 0; i--) pts.push(`${(rnd() * 5).toFixed(1)}% ${((i / n) * 100).toFixed(1)}%`);
  return `polygon(${pts.join(",")})`;
}

interface ScrapsProps {
  word: string;
  seed?: number;
  className?: string;
}

export function Scraps({ word, seed = 1, className }: ScrapsProps) {
  return (
    <span className={className} aria-hidden="true">
      {[...word].map((char, i) => (
        <span key={i} className="scrap" style={{ clipPath: tornClip(seed * 31 + i) }}>
          {char}
        </span>
      ))}
    </span>
  );
}
