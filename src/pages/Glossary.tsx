import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { lessonById, lessonsForTerm, termById, terms } from '../data';
import { Rich } from '../components/Markup';
import type { Term } from '../types';
import './study.css';

const CAT: Record<Term['category'], string> = {
  office: 'Offices',
  institution: 'Institutions',
  concept: 'Concepts',
  military: 'Military',
  religion: 'Religion',
  law: 'Law',
  society: 'Society',
  economy: 'Economy',
  historiography: 'Historiography',
  place: 'Places and regions',
};

export default function GlossaryPage() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const loc = useLocation();
  const target = loc.hash.slice(1);
  useEffect(() => {
    if (target) {
      setQ('');
      setCat('all');
      setTimeout(() => document.getElementById(target)?.scrollIntoView({ block: 'center' }), 60);
    }
  }, [target]);
  const list = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return terms.filter((t) => (cat === 'all' || t.category === cat) && (!qq || `${t.term} ${t.literal ?? ''} ${t.def}`.toLowerCase().includes(qq)));
  }, [q, cat]);
  const letters = [...new Set(list.map((t) => t.term[0].toUpperCase()))];
  return (
    <div className="page glossary-page">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Reference</p>
          <h1>Glossary</h1>
          <p className="lede">
            Latin and Greek terms, offices, institutions and historians’ concepts, with literal meanings where they help and links to the lessons that use
            them. Every term is also a flashcard.
          </p>
        </header>
        <div className="toolbar">
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a term" aria-label="Find a term" />
          <div className="group" role="group" aria-label="Category">
            <button className="chip" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>
              All
            </button>
            {Object.entries(CAT).map(([k, v]) => (
              <button key={k} className="chip" aria-pressed={cat === k} onClick={() => setCat(k)}>
                {v}
              </button>
            ))}
          </div>
          <Link to="/revise/cards?deck=Terms" className="ui small">
            Study terms as flashcards
          </Link>
        </div>
        <nav className="az" aria-label="Jump to letter">
          {letters.map((l) => (
            <a
              key={l}
              href={`#letter-${l}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(`letter-${l}`)?.scrollIntoView();
              }}
            >
              {l}
            </a>
          ))}
        </nav>
        {letters.map((l) => (
          <section key={l} id={`letter-${l}`} className="gl-letter">
            <h2 className="gl-letter-h">{l}</h2>
            <dl className="gl-list">
              {list
                .filter((t) => t.term[0].toUpperCase() === l)
                .map((t) => {
                  const ls = lessonsForTerm.get(t.id) ?? [];
                  return (
                    <div key={t.id} id={t.id} className={`gl-entry ${target === t.id ? 'target' : ''}`}>
                      <dt>
                        <span className="gl-term">{t.term}</span>
                        <span className="meta">
                          {t.lang && t.lang !== 'English' ? `${t.lang} · ` : ''}
                          {CAT[t.category]}
                        </span>
                        {t.literal && <span className="gl-literal">“{t.literal}”</span>}
                      </dt>
                      <dd>
                        <Rich text={t.def} />
                        {t.related && t.related.length > 0 && (
                          <p className="ui small gl-related">
                            See also:{' '}
                            {t.related
                              .filter((r) => termById.has(r))
                              .map((r, i) => (
                                <span key={r}>
                                  {i > 0 && ', '}
                                  <Link to={`/glossary#${r}`}>{termById.get(r)!.term}</Link>
                                </span>
                              ))}
                          </p>
                        )}
                        {ls.length > 0 && (
                          <p className="ui small gl-used">
                            Used in:{' '}
                            {ls.slice(0, 6).map((x, i) => (
                              <span key={x}>
                                {i > 0 && ', '}
                                <Link to={`/lesson/${x}`}>{lessonById.get(x)?.title}</Link>
                              </span>
                            ))}
                            {ls.length > 6 ? ` and ${ls.length - 6} more` : ''}
                          </p>
                        )}
                      </dd>
                    </div>
                  );
                })}
            </dl>
          </section>
        ))}
        {list.length === 0 && <p className="empty">No terms match “{q}”.</p>}
      </div>
    </div>
  );
}
