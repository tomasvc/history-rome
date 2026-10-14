import { Link } from 'react-router-dom';
import { figureById, stemmata } from '../data';
import type { Stemma } from '../types';

export function StemmaById({ id, highlight }: { id: string; highlight?: string }) {
  const s = stemmata.find((x) => x.id === id);
  if (!s) return <p className="missing">Family tree “{id}” not found.</p>;
  return (
    <div className="stemma-embed">
      <p className="stemma-title ui">
        Family tree: <Link to={`/people?view=trees&tree=${s.id}`}>{s.title}</Link>
      </p>
      <StemmaView s={s} highlight={highlight} />
    </div>
  );
}

export function StemmaView({ s, highlight }: { s: Stemma; highlight?: string }) {
  const cw = 150;
  const rh = 96;
  const maxX = Math.max(...s.nodes.map((n) => n.x));
  const maxY = Math.max(...s.nodes.map((n) => n.y));
  const W = (maxX + 1) * cw + 40;
  const H = (maxY + 1) * rh + 30;
  const P = (x: number, y: number) => ({ x: 20 + x * cw + cw / 2, y: 30 + y * rh });
  const byId = new Map(s.nodes.map((n) => [n.id, n]));
  return (
    <figure className="stemma">
      <p className="stemma-summary">{s.summary}</p>
      <div className="stemma-scroll">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Family tree: ${s.title}`}>
          {s.edges.map((e, i) => {
            const a = byId.get(e.from);
            const b = byId.get(e.to);
            if (!a || !b) return null;
            const pa = P(a.x, a.y);
            const pb = P(b.x, b.y);
            if (e.kind === 'marriage') return <line key={i} x1={pa.x} y1={pa.y + 8} x2={pb.x} y2={pb.y + 8} className="st-marriage" />;
            const midY = pa.y + rh / 2 + 6;
            return (
              <path
                key={i}
                d={`M${pa.x},${pa.y + 24} V${midY} H${pb.x} V${pb.y - 14}`}
                className={e.kind === 'adoption' ? 'st-adopt' : 'st-birth'}
              />
            );
          })}
          {s.nodes.map((n) => {
            const f = figureById.get(n.id);
            const p = P(n.x, n.y);
            const label = n.label ?? f?.name ?? n.id;
            const words = label.split(' ');
            const lines: string[] = [];
            let cur = '';
            for (const w of words) {
              if ((cur + ' ' + w).trim().length > 18) {
                lines.push(cur.trim());
                cur = w;
              } else cur += ' ' + w;
            }
            lines.push(cur.trim());
            const inner = (
              <>
                <rect x={p.x - cw / 2 + 8} y={p.y - 14} width={cw - 16} height={lines.length > 1 ? 40 : 30} className={`st-box ${n.ruler ? 'ruler' : ''} ${highlight === n.id ? 'hl' : ''}`} />
                {lines.map((l, i) => (
                  <text key={i} x={p.x} y={p.y + 4 + i * 14} textAnchor="middle" className="st-name">
                    {l}
                  </text>
                ))}
              </>
            );
            return f ? (
              <Link key={n.id} to={`/people/${n.id}`} className="st-node">
                {inner}
              </Link>
            ) : (
              <g key={n.id} className="st-node plain">
                {inner}
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="ui small">
        <span className="st-key">
          <span className="k-birth" /> birth
        </span>
        <span className="st-key">
          <span className="k-adopt" /> adoption
        </span>
        <span className="st-key">
          <span className="k-marriage" /> marriage
        </span>
        <span className="st-key">
          <span className="k-ruler" /> reigning emperor
        </span>
      </figcaption>
      <ul className="stemma-notes">
        {s.notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </figure>
  );
}
