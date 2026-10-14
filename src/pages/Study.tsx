import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { curriculum, entityHref, flashcards, lessonById, moduleById, orderedLessons } from '../data';
import { exportState, importState, resetState, useStudy } from '../lib/store';
import { isDue } from '../lib/srs';
import { SpanRibbon } from '../components/SpanRibbon';
import { Insights } from './Revise';
import './study.css';

function download(name: string, text: string, type = 'text/plain') {
  const blob = new Blob([text], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export default function StudyPage() {
  const progress = useStudy((s) => s.progress);
  const bookmarks = useStudy((s) => s.bookmarks);
  const notes = useStudy((s) => s.notes);
  const recent = useStudy((s) => s.recent);
  const cards = useStudy((s) => s.cards);
  const positions = useStudy((s) => s.positions);
  const [confirmReset, setConfirmReset] = useState(false);
  const [msg, setMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const completed = orderedLessons.filter((l) => progress[l.id]?.completed);
  const due = flashcards.filter((c) => cards[c.id] && isDue(cards[c.id])).length;
  const next = orderedLessons.find((l) => !progress[l.id]?.completed);
  const noteList = Object.values(notes).sort((a, b) => b.at - a.at);

  const exportNotes = () => {
    const md = [
      '# Tabularium: my notes',
      '',
      ...noteList.flatMap((n) => [`## ${n.title}`, `*${n.kind}, last edited ${new Date(n.at).toLocaleDateString('en-GB')}*`, '', n.text, '']),
    ].join('\n');
    download('tabularium-notes.md', md, 'text/markdown');
  };

  return (
    <div className="page study-page">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Your record</p>
          <h1>My study</h1>
          <p className="lede">Progress, notes, bookmarks and the topics your answers suggest revisiting. Everything here is stored in this browser only.</p>
        </header>

        <section aria-labelledby="prog-h">
          <h2 id="prog-h" className="section-title">
            Progress
          </h2>
          <p className="ui">
            <strong className="stat">{completed.length}</strong> of {orderedLessons.length} lessons completed ·{' '}
            <strong className="stat">{due}</strong> flashcards due · <strong className="stat">{Object.keys(positions).length}</strong> debates with a
            recorded position
          </p>
          <SpanRibbon size="large" progress={completed.map((l) => l.span)} />
          <div className="part-progress">
            {curriculum.parts.map((p) => {
              const ls = p.modules.flatMap((m) => moduleById.get(m)?.lessons ?? []);
              const d = ls.filter((l) => progress[l]?.completed).length;
              return (
                <div key={p.id} className="pp">
                  <span className="pp-label ui">
                    Part {p.numeral}: {p.title}
                  </span>
                  <span className="pp-bar">
                    <span style={{ width: `${(d / Math.max(1, ls.length)) * 100}%` }} />
                  </span>
                  <span className="ui small">
                    {d}/{ls.length}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="row">
            {next && (
              <Link className="btn primary" to={`/lesson/${next.id}`}>
                Next lesson: {next.title}
              </Link>
            )}
            {due > 0 && (
              <Link className="btn" to="/revise/cards">
                Review {due} cards
              </Link>
            )}
          </div>
        </section>

        <h2 className="section-title">What to revisit</h2>
        <Insights />

        <div className="study-columns">
          <section>
            <h2 className="section-title">Notes</h2>
            {noteList.length === 0 ? (
              <p className="empty">No notes yet. Every lesson, person, source and comparison has a notes box at the bottom.</p>
            ) : (
              <>
                <ul className="ruled note-list">
                  {noteList.map((n) => (
                    <li key={`${n.kind}:${n.id}`}>
                      <Link to={entityHref(n.kind, n.id)} className="entry-title">
                        {n.title}
                      </Link>
                      <span className="meta">
                        {' '}
                        {n.kind} · {new Date(n.at).toLocaleDateString('en-GB')}
                      </span>
                      <p className="note-excerpt">{n.text.slice(0, 280)}{n.text.length > 280 ? '…' : ''}</p>
                    </li>
                  ))}
                </ul>
                <button className="btn small" onClick={exportNotes}>
                  Download notes as Markdown
                </button>
              </>
            )}
          </section>
          <section>
            <h2 className="section-title">Bookmarks</h2>
            {Object.values(bookmarks).length === 0 ? (
              <p className="empty">Bookmark lessons, people, sources and debates to collect them here.</p>
            ) : (
              <ul className="ruled tight ui">
                {Object.values(bookmarks)
                  .sort((a, b) => b.at - a.at)
                  .map((b) => (
                    <li key={`${b.kind}:${b.id}`}>
                      <Link to={entityHref(b.kind, b.id)}>{b.title}</Link> <span className="meta">{b.kind}</span>
                    </li>
                  ))}
              </ul>
            )}
            <h2 className="section-title">Recently opened</h2>
            {recent.length === 0 ? (
              <p className="ui small muted">Nothing yet.</p>
            ) : (
              <ul className="ruled tight ui">
                {recent.slice(0, 15).map((r) => (
                  <li key={`${r.kind}:${r.id}`}>
                    <Link to={entityHref(r.kind, r.id)}>{r.kind === 'lesson' ? lessonById.get(r.id)?.title ?? r.title : r.title}</Link>{' '}
                    <span className="meta">
                      {r.kind} · {new Date(r.at).toLocaleDateString('en-GB')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="backup" aria-labelledby="backup-h">
          <h2 id="backup-h" className="section-title">
            Back up or move your study record
          </h2>
          <p className="ui muted">
            Your progress lives in this browser’s local storage. Download a backup to keep it safe or to move it to another device, then restore it there.
          </p>
          <div className="row">
            <button className="btn" onClick={() => download(`tabularium-backup-${new Date().toISOString().slice(0, 10)}.json`, exportState(), 'application/json')}>
              Download backup
            </button>
            <button className="btn" onClick={() => fileRef.current?.click()}>
              Restore from backup
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              hidden
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setMsg(importState(await f.text()) ? 'Backup restored.' : 'That file is not a Tabularium backup.');
              }}
            />
            {!confirmReset ? (
              <button className="btn ghost" onClick={() => setConfirmReset(true)}>
                Erase everything
              </button>
            ) : (
              <span className="ui confirm-reset">
                Erase all progress, notes and cards?{' '}
                <button
                  className="btn small primary"
                  onClick={() => {
                    resetState();
                    setConfirmReset(false);
                    setMsg('Study record erased.');
                  }}
                >
                  Erase
                </button>{' '}
                <button className="btn small ghost" onClick={() => setConfirmReset(false)}>
                  Keep it
                </button>
              </span>
            )}
          </div>
          {msg && (
            <p className="ui small" role="status">
              {msg}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
