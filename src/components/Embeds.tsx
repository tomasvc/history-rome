import { Link } from 'react-router-dom';
import { debateById, eventById, figureById, formatLife, sourceById } from '../data';
import { formatDate } from '../lib/dates';
import type { Block } from '../lib/markup';
import { Blocks, Rich } from './Markup';
import { SourceGlyph } from './Glyphs';

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, s.lastIndexOf(' ', n)) + '…' : s);

export function SourceCard({ id, caption }: { id: string; caption?: Block[] }) {
  const s = sourceById.get(id);
  if (!s) return <p className="missing">Source “{id}” not found.</p>;
  return (
    <figure className="source-card">
      <div className="source-card-head">
        <SourceGlyph kind={s.kind} />
        <div>
          <Link to={`/sources/${s.id}`} className="source-card-title">
            {s.title}
          </Link>
          <div className="meta">
            {s.citation} · {formatDate(s.date)} · {s.language}
          </div>
        </div>
      </div>
      <blockquote className="source-card-text">
        <Rich text={clip(s.translation[0], 420)} />
      </blockquote>
      {caption && caption.length > 0 && (
        <figcaption className="source-card-caption">
          <Blocks blocks={caption} notesInline />
        </figcaption>
      )}
      <Link to={`/sources/${s.id}`} className="source-card-more ui">
        Read the source with commentary
      </Link>
    </figure>
  );
}

export function DebateTeaser({ id }: { id: string }) {
  const d = debateById.get(id);
  if (!d) return <p className="missing">Debate “{id}” not found.</p>;
  return (
    <aside className="debate-teaser">
      <div className="debate-teaser-label ui">Historians disagree</div>
      <Link to={`/debates/${d.id}`} className="debate-teaser-title">
        {d.question}
      </Link>
      <ul className="debate-teaser-positions">
        {d.positions.map((p) => (
          <li key={p.id}>
            <strong>{p.label}.</strong> {clip(p.claim.replace(/\*/g, ''), 150)}
          </li>
        ))}
      </ul>
      <Link to={`/debates/${d.id}`} className="ui small">
        Weigh the evidence and take a position
      </Link>
    </aside>
  );
}

export function MiniChronology({ lines }: { lines: string[] }) {
  return (
    <ol className="mini-chron">
      {lines.map((l, i) => {
        const [date, text, evt] = l.split('|').map((x) => x.trim());
        const e = evt ? eventById.get(evt) : undefined;
        return (
          <li key={i}>
            <span className="mc-date">{date}</span>
            <span className="mc-text">
              <Rich text={text} inline />
              {e && (
                <>
                  {' '}
                  <Link to={`/timeline?event=${e.id}`} className="mc-link ui" aria-label={`Show ${e.title} on the timeline`}>
                    timeline
                  </Link>
                </>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function PeopleRow({ ids }: { ids: string[] }) {
  return (
    <ul className="people-row">
      {ids.map((id) => {
        const f = figureById.get(id);
        if (!f) return null;
        return (
          <li key={id}>
            <Link to={`/people/${id}`} className="people-row-name">
              {f.name}
            </Link>
            <span className="meta">{formatLife(f)}</span>
            <span className="people-row-sum">{clip(f.summary.replace(/\[\[[a-z]+:[a-z0-9-]+\|([^\]]+)\]\]/g, '$1').replace(/\[\[[a-z]+:([a-z0-9-]+)\]\]/g, '$1').replace(/\*/g, ''), 160)}</span>
          </li>
        );
      })}
    </ul>
  );
}
