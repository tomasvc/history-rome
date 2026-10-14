import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { sources } from '../data';
import { formatDate } from '../lib/dates';
import { THEMES, type SourceKind } from '../types';
import { SourceGlyph } from '../components/Glyphs';
import './sources.css';

export const KIND_LABEL: Record<SourceKind, string> = {
  inscription: 'Inscription',
  coin: 'Coin',
  law: 'Law and legal text',
  speech: 'Speech',
  letter: 'Letter',
  history: 'History',
  biography: 'Biography',
  papyrus: 'Papyrus',
  tablet: 'Writing tablet',
  archaeology: 'Archaeology',
  poetry: 'Poetry',
  philosophy: 'Philosophy',
  religious: 'Religious text',
};
const PERIODS: { id: string; label: string; range: [number, number] }[] = [
  { id: 'all', label: 'All periods', range: [-1000, 1500] },
  { id: 'rep', label: 'Republic', range: [-1000, -31] },
  { id: 'emp', label: 'Principate', range: [-31, 284] },
  { id: 'late', label: 'Late empire', range: [284, 500] },
  { id: 'east', label: 'East Rome', range: [500, 1500] },
];
const DOCUMENTARY: SourceKind[] = ['inscription', 'coin', 'law', 'papyrus', 'tablet', 'archaeology'];

export default function SourcesPage() {
  const [kind, setKind] = useState<'all' | 'documentary' | 'literary' | SourceKind>('all');
  const [period, setPeriod] = useState('all');
  const [theme, setTheme] = useState('all');
  const [q, setQ] = useState('');
  const range = PERIODS.find((p) => p.id === period)!.range;
  const list = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return sources.filter(
      (s) =>
        (kind === 'all' || (kind === 'documentary' ? DOCUMENTARY.includes(s.kind) : kind === 'literary' ? !DOCUMENTARY.includes(s.kind) : s.kind === kind)) &&
        s.date.from >= range[0] &&
        s.date.from < range[1] &&
        (theme === 'all' || s.themes.includes(theme as never)) &&
        (!qq || `${s.title} ${s.author ?? ''} ${s.citation} ${s.tells}`.toLowerCase().includes(qq)),
    );
  }, [kind, range, theme, q]);
  const kinds = [...new Set(sources.map((s) => s.kind))];

  return (
    <div className="page sources-page">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Evidence</p>
          <h1>Primary sources</h1>
          <p className="lede">
            The evidence historians actually work from: inscriptions, coins, laws, letters, papyri, writing tablets and histories. Each source has the
            original text where useful, a translation, and commentary on who made it, for whom, what it can show and where it misleads.
          </p>
        </header>
        <div className="toolbar sources-filters">
          <div className="group" role="group" aria-label="Kind of evidence">
            <button className="chip" aria-pressed={kind === 'all'} onClick={() => setKind('all')}>
              All
            </button>
            <button className="chip" aria-pressed={kind === 'documentary'} onClick={() => setKind('documentary')}>
              Documents and objects
            </button>
            <button className="chip" aria-pressed={kind === 'literary'} onClick={() => setKind('literary')}>
              Literary texts
            </button>
            <select value={DOCUMENTARY.includes(kind as SourceKind) || kinds.includes(kind as SourceKind) ? kind : ''} onChange={(e) => setKind((e.target.value || 'all') as SourceKind)} aria-label="Specific kind">
              <option value="">Any specific kind</option>
              {kinds.map((k) => (
                <option key={k} value={k}>
                  {KIND_LABEL[k]}
                </option>
              ))}
            </select>
          </div>
          <div className="group" role="group" aria-label="Period">
            {PERIODS.map((p) => (
              <button key={p.id} className="chip" aria-pressed={period === p.id} onClick={() => setPeriod(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
          <label className="group">
            <span className="group-label">Theme</span>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="all">Any</option>
              {THEMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sources" aria-label="Search sources" />
        </div>
        {list.length === 0 ? (
          <p className="empty">No sources match. Widen the period or clear the search.</p>
        ) : (
          <ul className="source-list">
            {list.map((s) => (
              <li key={s.id}>
                <SourceGlyph kind={s.kind} size={34} />
                <div>
                  <Link to={`/sources/${s.id}`} className="entry-title">
                    {s.title}
                  </Link>
                  <p className="meta">
                    {KIND_LABEL[s.kind]} · {formatDate(s.date)} · {s.language}
                    {s.author ? ` · ${s.author}` : ''}
                  </p>
                  <p className="source-list-tells">{s.tells.replace(/\[\[[a-z]+:[a-z0-9-]+\|([^\]]+)\]\]/g, '$1').replace(/\[\[[a-z]+:([a-z0-9-]+)\]\]/g, '$1').replace(/\{\{[^}]+\}\}/g, '').replace(/\*/g, '').slice(0, 220)}…</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
