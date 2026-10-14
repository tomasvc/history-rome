import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { setTextSize, setTheme, storageAvailable, useStudy } from '../lib/store';
import { SearchPalette } from './SearchPalette';

const PRIMARY = [
  { to: '/course', label: 'Course' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/atlas', label: 'Atlas' },
  { to: '/people', label: 'People' },
  { to: '/sources', label: 'Sources' },
  { to: '/debates', label: 'Debates' },
  { to: '/revise', label: 'Revise' },
];

const INDEX = [
  {
    group: 'Learn',
    items: [
      { to: '/course', label: 'Course', desc: 'Five parts, from the early Republic to 1453, with a three-term study plan' },
      { to: '/scenarios', label: 'Scenarios', desc: 'Decide as a Roman would, then compare with what happened' },
      { to: '/compare', label: 'Compare', desc: 'Periods, rulers, armies and provinces side by side' },
    ],
  },
  {
    group: 'Explore',
    items: [
      { to: '/timeline', label: 'Timeline', desc: 'Zoomable chronology with causes and consequences' },
      { to: '/atlas', label: 'Atlas', desc: 'Territory, provinces, roads, frontiers and battles over time' },
      { to: '/people', label: 'People', desc: 'Profiles, family trees, lifespans and networks' },
    ],
  },
  {
    group: 'Evidence',
    items: [
      { to: '/sources', label: 'Sources', desc: 'Inscriptions, coins, laws, letters and histories, with commentary' },
      { to: '/debates', label: 'Debates', desc: 'Where historians disagree, and on what evidence' },
      { to: '/library', label: 'Library', desc: 'Annotated bibliography in Chicago style' },
      { to: '/glossary', label: 'Glossary', desc: 'Latin and Greek terms, offices and concepts' },
    ],
  },
  {
    group: 'Practise',
    items: [
      { to: '/revise', label: 'Revise', desc: 'Flashcards with spaced repetition, quizzes and essay planning' },
      { to: '/study', label: 'My study', desc: 'Progress, notes, bookmarks and what to revisit' },
    ],
  },
];

export function Layout() {
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const loc = useLocation();
  const theme = useStudy((s) => s.settings.theme);
  const textSize = useStudy((s) => s.settings.textSize ?? 'normal');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenu(false);
    if (!loc.hash) window.scrollTo(0, 0);
  }, [loc.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = /INPUT|TEXTAREA|SELECT/.test(target.tagName) || target.isContentEditable;
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setMenu(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (menu) menuRef.current?.querySelector<HTMLElement>('a,button')?.focus();
  }, [menu]);

  return (
    <>
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Skip to content
      </a>
      <header className="masthead">
        <div className="wrap mast-inner">
          <Link to="/" className="wordmark" aria-label="Tabularium, home">
            <span className="wm-main">Tabularium</span>
            <span className="wm-sub">Roman history, 753 BC – AD 1453</span>
          </Link>
          <nav className="primary-nav" aria-label="Main">
            {PRIMARY.map((p) => (
              <NavLink key={p.to} to={p.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {p.label}
              </NavLink>
            ))}
          </nav>
          <div className="mast-tools">
            <button className="mast-search" onClick={() => setSearchOpen(true)} aria-label="Search everything">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span className="mast-search-label">Search</span>
              <kbd>/</kbd>
            </button>
            <NavLink to="/study" className="mast-study">
              My study
            </NavLink>
            <button className="mast-menu" aria-expanded={menu} aria-controls="index-drawer" onClick={() => setMenu(!menu)}>
              <span aria-hidden="true" className="burger" />
              Index
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div className="drawer-scrim" onClick={() => setMenu(false)}>
          <div id="index-drawer" className="drawer" role="dialog" aria-modal="true" aria-label="Index of the course" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <h2>Index</h2>
              <button className="btn ghost small" onClick={() => setMenu(false)}>
                Close
              </button>
            </div>
            {INDEX.map((g) => (
              <section key={g.group} className="drawer-group">
                <h3>{g.group}</h3>
                <ul>
                  {g.items.map((i) => (
                    <li key={i.to}>
                      <Link to={i.to}>{i.label}</Link>
                      <span>{i.desc}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <section className="drawer-group">
              <h3>Reading settings</h3>
              <div className="toolbar">
                <div className="group" role="group" aria-label="Colour theme">
                  <span className="group-label">Theme</span>
                  {(['system', 'light', 'dark'] as const).map((t) => (
                    <button key={t} className="chip" aria-pressed={theme === t} onClick={() => setTheme(t)}>
                      {t === 'system' ? 'Match device' : t === 'light' ? 'Marble' : 'Lamplight'}
                    </button>
                  ))}
                </div>
                <div className="group" role="group" aria-label="Text size">
                  <span className="group-label">Text</span>
                  {(['normal', 'large'] as const).map((t) => (
                    <button key={t} className="chip" aria-pressed={textSize === t} onClick={() => setTextSize(t)}>
                      {t === 'normal' ? 'Standard' : 'Larger'}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {searchOpen && <SearchPalette onClose={() => setSearchOpen(false)} />}

      <main id="main" tabIndex={-1}>
        {!storageAvailable() && (
          <div className="wrap">
            <p className="storage-warning ui">This browser is not allowing local storage, so progress and notes will not be kept after you close the page.</p>
          </div>
        )}
        <Outlet />
      </main>

      <footer className="colophon">
        <div className="wrap colophon-inner">
          <div>
            <p className="colophon-mark">Tabularium</p>
            <p>
              The <em>tabularium</em> was the record office of the Roman state on the Capitoline Hill. This one is a study companion: lessons, evidence and
              exercises for learning Roman history at undergraduate level.
            </p>
          </div>
          <div>
            <h4>About the evidence</h4>
            <p>
              Lessons distinguish established facts from interpretation and open debate. Translations marked “course translation” were made for this course
              from the original Latin or Greek; check them against a published edition before quoting. The <Link to="/library">Library</Link> shows which
              references have been checked against publisher or library catalogues.
            </p>
          </div>
          <div>
            <h4>Data and credits</h4>
            <p>
              Map data: Ancient World Mapping Center (ODbL), derived from the <em>Barrington Atlas</em>; historical-basemaps by A. Ourednik (GPL-3.0); Natural
              Earth coastlines (public domain). Photographs: Wikimedia Commons contributors, credited on each image. Your progress and notes stay in this
              browser; export them from <Link to="/study">My study</Link>.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
