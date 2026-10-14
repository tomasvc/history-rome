import type { ReactNode } from 'react';

/** Shared frame for teaching diagrams: a title, the figure, and a note on what it is based on. */
export function Frame({
  title,
  children,
  caption,
  basis,
  controls,
}: {
  title: string;
  children: ReactNode;
  caption?: ReactNode;
  basis?: ReactNode;
  controls?: ReactNode;
}) {
  return (
    <figure className="diagram">
      <div className="diagram-head">
        <span className="diagram-title">{title}</span>
        {controls && <div className="diagram-controls ui">{controls}</div>}
      </div>
      <div className="diagram-body">{children}</div>
      {(caption || basis) && (
        <figcaption className="diagram-foot ui">
          {caption && <p>{caption}</p>}
          {basis && <p className="diagram-basis">Based on: {basis}</p>}
        </figcaption>
      )}
    </figure>
  );
}

export function Toggle<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="dg-toggle" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" className="chip" aria-pressed={o.id === value} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Point where the line from the centre of box A towards point B leaves box A (half-width hw, half-height hh). */
export function exitPoint(ax: number, ay: number, bx: number, by: number, hw: number, hh: number, gap = 3): [number, number] {
  const dx = bx - ax;
  const dy = by - ay;
  const tx = dx === 0 ? Infinity : (hw + gap) / Math.abs(dx);
  const ty = dy === 0 ? Infinity : (hh + gap) / Math.abs(dy);
  const t = Math.min(tx, ty);
  return [ax + dx * t, ay + dy * t];
}
