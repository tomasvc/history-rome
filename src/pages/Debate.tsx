import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { bibById, debateById, lessonById, lessonsForDebate, sourceById } from '../data';
import { formatSpan } from '../lib/dates';
import { shortNote } from '../lib/cite';
import { update, useStudy, visit } from '../lib/store';
import { Em, Rich } from '../components/Markup';
import { ReadingList } from '../components/Biblio';
import { BookmarkButton } from '../components/StudyTools';
import NotFound from './NotFound';
import './debates.css';

export default function DebatePage() {
  const { id = '' } = useParams();
  const d = debateById.get(id);
  const saved = useStudy((s) => s.positions[id]);
  const [weighed, setWeighed] = useState<Record<string, string>>(saved?.weighed ?? {});
  const [choice, setChoice] = useState<string>(saved ? String(saved.value) : '');
  const [text, setText] = useState(saved?.text ?? '');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  useEffect(() => {
    if (d) visit({ kind: 'debate', id: d.id, title: d.title });
  }, [d]);
  if (!d) return <NotFound />;
  const lessons = lessonsForDebate.get(d.id) ?? [];

  const weigh = (evId: string, pos: string) => {
    const next = { ...weighed, [evId]: pos };
    setWeighed(next);
    update((s) => {
      s.positions[d.id] = { ...(s.positions[d.id] ?? { value: '', text: '', at: Date.now() }), weighed: next };
    });
  };
  const savePosition = () => {
    update((s) => {
      s.positions[d.id] = { value: choice, text, at: Date.now(), weighed };
    });
    setSavedAt(Date.now());
  };
  const tally = d.positions.map((p) => ({ p, n: Object.values(weighed).filter((v) => v === p.id).length }));

  return (
    <div className="page debate-page">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">
            <Link to="/debates">Debates</Link> · {formatSpan(d.span[0], d.span[1])}
          </p>
          <h1>{d.title}</h1>
          <p className="lede debate-q">{d.question}</p>
          <div className="row">
            <BookmarkButton refItem={{ kind: 'debate', id: d.id, title: d.title }} />
          </div>
        </header>

        <section className="debate-why">
          <h2 className="section-title">Why it matters</h2>
          <Rich text={d.why} />
        </section>

        <section aria-labelledby="pos-h">
          <h2 id="pos-h" className="section-title">
            The positions
          </h2>
          <div className="positions" style={{ ['--n' as string]: d.positions.length }}>
            {d.positions.map((p, i) => (
              <article key={p.id} className="position">
                <span className="position-letter">{String.fromCharCode(65 + i)}</span>
                <h3>{p.label}</h3>
                <p className="position-claim">
                  <Rich text={p.claim} inline />
                </p>
                <Rich text={p.argument} />
                <h4>Associated with</h4>
                <ul className="position-who ui">
                  {p.proponents.map((x) => {
                    const b = x.ref ? bibById.get(x.ref) : undefined;
                    return (
                      <li key={x.name}>
                        <strong>{x.name}</strong>
                        {x.year ? ` (${x.year})` : ''}
                        {b && (
                          <>
                            {': '}
                            <Link to={`/library#${b.id}`}>
                              <Em text={shortNote(b)} />
                            </Link>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <h4>Weaknesses critics point to</h4>
                <Rich text={p.weaknesses} />
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="ev-h" className="weigh">
          <h2 id="ev-h" className="section-title">
            Weigh the evidence
          </h2>
          <p className="ui muted">
            For each piece of evidence, decide which position it most supports. Then see how historians have used it. There is often more than one
            defensible answer.
          </p>
          <ol className="evidence-list">
            {d.evidence.map((ev) => {
              const pick = weighed[ev.id];
              const src = ev.source ? sourceById.get(ev.source) : undefined;
              return (
                <li key={ev.id} className="evidence-item">
                  <div className="evidence-text">
                    <Rich text={ev.text} />
                    {src && (
                      <Link to={`/sources/${src.id}`} className="ui small">
                        Source: {src.title}
                      </Link>
                    )}
                  </div>
                  <div className="evidence-choices" role="group" aria-label="This evidence best supports">
                    {d.positions.map((p, i) => (
                      <button key={p.id} className="chip" aria-pressed={pick === p.id} onClick={() => weigh(ev.id, p.id)}>
                        {String.fromCharCode(65 + i)}: {p.label}
                      </button>
                    ))}
                    <button className="chip" aria-pressed={pick === 'both'} onClick={() => weigh(ev.id, 'both')}>
                      Cuts both ways
                    </button>
                  </div>
                  {pick && (
                    <div className="evidence-comment">
                      <p className="ui small">
                        Usually cited for:{' '}
                        <strong>{ev.supports.map((s) => d.positions.find((p) => p.id === s)?.label ?? s).join(' and ')}</strong>
                        {ev.supports.includes(pick) ? ' — your reading matches.' : pick === 'both' ? '.' : ' — a different reading from yours; consider why.'}
                      </p>
                      <Rich text={ev.comment} />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
          {Object.keys(weighed).length > 0 && (
            <p className="ui small tally">
              Your weighing so far: {tally.map(({ p, n }) => `${p.label} ${n}`).join(' · ')}
            </p>
          )}
        </section>

        <section aria-labelledby="hist-h">
          <h2 id="hist-h" className="section-title">
            How the debate has moved
          </h2>
          <ol className="debate-history">
            {d.history.map((h, i) => {
              const b = h.ref ? bibById.get(h.ref) : undefined;
              return (
                <li key={i}>
                  <span className="dh-year">{h.year}</span>
                  <div>
                    <strong>{h.who}</strong>
                    <Rich text={h.what} />
                    {b && (
                      <Link to={`/library#${b.id}`} className="ui small">
                        <Em text={shortNote(b)} />
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="debate-state">
          <h2 className="section-title">Where the field stands now</h2>
          <Rich text={d.state} />
        </section>

        <section className="take-position" aria-labelledby="take-h">
          <h2 id="take-h">Where do you stand?</h2>
          <div className="toolbar" role="radiogroup" aria-label="Your position">
            {d.positions.map((p, i) => (
              <button key={p.id} role="radio" aria-checked={choice === p.id} className="chip" aria-pressed={choice === p.id} onClick={() => setChoice(p.id)}>
                {String.fromCharCode(65 + i)}: {p.label}
              </button>
            ))}
            <button role="radio" aria-checked={choice === 'synthesis'} className="chip" aria-pressed={choice === 'synthesis'} onClick={() => setChoice('synthesis')}>
              A synthesis of my own
            </button>
          </div>
          <label className="field">
            <span>Justify it in a paragraph. Name the strongest piece of evidence against your view and answer it.</span>
            <textarea rows={7} value={text} onChange={(e) => setText(e.target.value)} />
          </label>
          <div className="row">
            <button className="btn primary" onClick={savePosition} disabled={!choice || text.trim().split(/\s+/).length < 10}>
              Save my position
            </button>
            {(savedAt || saved?.at) && <span className="ui small faint">Saved {new Date(savedAt ?? saved!.at).toLocaleString('en-GB')}</span>}
          </div>
        </section>

        <div className="split">
          <div>
            {d.reading && d.reading.length > 0 && (
              <>
                <h2 className="section-title">Reading for this debate</h2>
                <ReadingList refs={d.reading} />
              </>
            )}
          </div>
          <aside>
            {lessons.length > 0 && (
              <section className="side-block">
                <h3>Lessons</h3>
                <ul className="ruled tight ui">
                  {lessons.map((l) => (
                    <li key={l}>
                      <Link to={`/lesson/${l}`}>{lessonById.get(l)?.title}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
