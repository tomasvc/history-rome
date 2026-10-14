import { Link } from 'react-router-dom';
import { astro, COURSE_END, COURSE_START, formatSpan, formatYear, PERIODS } from '../lib/dates';

const A0 = astro(COURSE_START);
const A1 = astro(COURSE_END);
export const spanX = (y: number) => ((astro(Math.max(COURSE_START, Math.min(COURSE_END, y))) - A0) / (A1 - A0)) * 100;

interface Mark {
  from: number;
  to?: number;
  label?: string;
  tone?: string;
}

/**
 * The course's recurring orientation device: the full 2,200-year span of Roman history,
 * with conventional periods drawn to scale and the current subject marked on it.
 */
export function SpanRibbon({
  highlight,
  marks = [],
  size = 'compact',
  linkPeriods = false,
  progress,
}: {
  highlight?: [number, number];
  marks?: Mark[];
  size?: 'compact' | 'large';
  linkPeriods?: boolean;
  progress?: [number, number][];
}) {
  const label = highlight
    ? `Position in the course: ${formatSpan(highlight[0], highlight[1])}, within ${formatYear(COURSE_START)} to ${formatYear(COURSE_END)}`
    : `Roman history from ${formatYear(COURSE_START)} to ${formatYear(COURSE_END)}`;
  return (
    <div className={`span-ribbon span-${size}`} role="img" aria-label={label}>
      <div className="span-track">
        {PERIODS.map((p) => {
          const left = spanX(p.from);
          const width = spanX(p.to) - left;
          const inner = (
            <>
              {size === 'large' && (
                <span className="span-period-label">
                  <span className="span-period-name">{p.short}</span>
                  <span className="span-period-dates">{formatSpan(p.from, p.to)}</span>
                </span>
              )}
            </>
          );
          const style = { left: `${left}%`, width: `${width}%`, ['--tone' as string]: p.tone };
          return linkPeriods ? (
            <Link key={p.id} to={`/timeline?from=${p.from}&to=${p.to}`} className="span-period" style={style} title={`${p.label}, ${formatSpan(p.from, p.to)}`}>
              {inner}
            </Link>
          ) : (
            <span key={p.id} className="span-period" style={style} title={`${p.label}, ${formatSpan(p.from, p.to)}`}>
              {inner}
            </span>
          );
        })}
        {progress?.map(([a, b], i) => (
          <span key={`p${i}`} className="span-progress" style={{ left: `${spanX(a)}%`, width: `${Math.max(0.3, spanX(b) - spanX(a))}%` }} />
        ))}
        {marks.map((m, i) => (
          <span
            key={`m${i}`}
            className="span-mark"
            style={{ left: `${spanX(m.from)}%`, width: m.to ? `${Math.max(0.35, spanX(m.to) - spanX(m.from))}%` : undefined, ['--tone' as string]: m.tone }}
            title={m.label}
          />
        ))}
        {highlight && (
          <span
            className="span-highlight"
            style={{ left: `${spanX(highlight[0])}%`, width: `${Math.max(0.5, spanX(highlight[1]) - spanX(highlight[0]))}%` }}
          />
        )}
      </div>
      <div className="span-axis" aria-hidden="true">
        {[-753, -500, -1, 500, 1000, 1453].map((y) => (
          <span key={y} className={y === -500 || y === 500 ? 'minor' : undefined} style={{ left: `${spanX(y === -1 ? 1 : y)}%` }}>
            {y === -1 ? 'BC | AD' : formatYear(y)}
          </span>
        ))}
      </div>
    </div>
  );
}
