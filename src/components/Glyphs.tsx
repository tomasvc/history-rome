import type { SourceKind } from '../types';

/** Small line glyphs for kinds of evidence, drawn like catalogue marks. */
export function SourceGlyph({ kind, size = 28 }: { kind: SourceKind; size?: number }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  let g: React.ReactNode;
  switch (kind) {
    case 'coin':
      g = (
        <>
          <circle cx="16" cy="16" r="11" {...s} />
          <circle cx="16" cy="16" r="8" {...s} strokeDasharray="1 1.6" />
          <path d="M13 20c0-3 1-6 4-7 2 0 3 2 2 4-1 1-2 1-2 3" {...s} />
        </>
      );
      break;
    case 'inscription':
      g = (
        <>
          <rect x="6" y="5" width="20" height="22" {...s} />
          <path d="M9 10h14M9 14h14M9 18h10M9 22h12" {...s} />
        </>
      );
      break;
    case 'law':
      g = (
        <>
          <rect x="7" y="6" width="18" height="21" rx="1" {...s} />
          <path d="M7 10h18M11 15h10M11 19h10M11 23h6" {...s} />
          <path d="M16 3v3" {...s} />
        </>
      );
      break;
    case 'letter':
    case 'tablet':
      g = (
        <>
          <rect x="5" y="8" width="22" height="16" {...s} />
          <path d="M5 8l11 8 11-8" {...s} />
        </>
      );
      break;
    case 'papyrus':
      g = (
        <>
          <path d="M8 7h16v18H8z" {...s} />
          <path d="M8 7c-2 0-3 1-3 2.5S6 12 8 12M24 25c2 0 3-1 3-2.5S26 20 24 20" {...s} />
          <path d="M11 11h10M11 15h10M11 19h7" {...s} strokeDasharray="2 1.4" />
        </>
      );
      break;
    case 'speech':
      g = (
        <>
          <path d="M6 9h20v11H14l-5 5v-5H6z" {...s} />
          <path d="M10 13h12M10 16h8" {...s} />
        </>
      );
      break;
    case 'archaeology':
      g = (
        <>
          <path d="M5 25h22M8 25V13l8-6 8 6v12" {...s} />
          <path d="M12 25v-7h8v7M12 14h8" {...s} />
        </>
      );
      break;
    case 'poetry':
    case 'philosophy':
    case 'religious':
    case 'history':
    case 'biography':
    default:
      g = (
        <>
          <path d="M7 6h14l4 4v16H7z" {...s} />
          <path d="M21 6v4h4M10 13h12M10 17h12M10 21h8" {...s} />
        </>
      );
  }
  return (
    <svg className="source-glyph" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      {g}
    </svg>
  );
}

export function Ornament({ className }: { className?: string }) {
  // A simple interpunct ornament like the triangular stops on Roman inscriptions.
  return (
    <svg className={className ?? 'ornament'} width="44" height="10" viewBox="0 0 44 10" aria-hidden="true">
      <path d="M0 5h16M28 5h16" stroke="currentColor" strokeWidth="1" />
      <path d="M22 1l4 4-4 4-4-4z" fill="currentColor" />
    </svg>
  );
}
