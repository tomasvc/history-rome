import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ensureFullText, search, type SearchDoc } from '../lib/search';

export function SearchPalette({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const nav = useNavigate();
  // Lesson texts load in the background; re-run the query when they arrive.
  const [textReady, setTextReady] = useState(0);
  useEffect(() => {
    let live = true;
    ensureFullText().then(() => live && setTextReady((n) => n + 1));
    return () => {
      live = false;
    };
  }, []);
  const results = useMemo(() => (textReady >= 0 ? search(q, 40) : []), [q, textReady]);
  const grouped = useMemo(() => {
    const g = new Map<string, (SearchDoc & { score: number })[]>();
    for (const r of results) g.set(r.kind, [...(g.get(r.kind) ?? []), r]);
    return [...g.entries()];
  }, [results]);
  const flat = grouped.flatMap(([, rs]) => rs);

  useEffect(() => {
    input.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  useEffect(() => setActive(0), [q]);

  const go = (r?: SearchDoc) => {
    if (!r) return;
    nav(r.href);
    onClose();
  };

  return (
    <div className="palette-scrim" onClick={onClose}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Search" onClick={(e) => e.stopPropagation()}>
        <div className="palette-input">
          <input
            ref={input}
            type="search"
            placeholder="Search lessons, people, events, places, sources, terms…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-controls="palette-results"
            aria-activedescendant={flat[active] ? `pr-${active}` : undefined}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive((a) => Math.min(flat.length - 1, a + 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              } else if (e.key === 'Enter') go(flat[active]);
              else if (e.key === 'Escape') onClose();
            }}
          />
          <button className="btn ghost small" onClick={onClose}>
            Esc
          </button>
        </div>
        <div id="palette-results" className="palette-results" role="listbox">
          {!q && (
            <p className="palette-hint ui">
              Try “tribune”, “Cannae”, “Ammianus”, “annona”, “Theodora” or “Heather”. Press <kbd>/</kbd> anywhere to search.
            </p>
          )}
          {q && !flat.length && <p className="palette-hint ui">Nothing matches “{q}”. Try a shorter word or a Latin term.</p>}
          {grouped.map(([kind, rs]) => (
            <section key={kind}>
              <h3 className="palette-group">{kind === 'Person' ? 'People' : kind + 's'}</h3>
              <ul>
                {rs.map((r) => {
                  const i = flat.indexOf(r);
                  return (
                    <li
                      key={r.key}
                      id={`pr-${i}`}
                      role="option"
                      aria-selected={i === active}
                      className={i === active ? 'active' : ''}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(r)}
                    >
                      <span className="pr-title">{r.title}</span>
                      <span className="pr-meta">{r.meta}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
