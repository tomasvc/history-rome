import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { eventById, eventsForFigure, figureById, formatLife, lessonById, lessonsForFigure, relationsOf, sourceById, stemmata } from '../data';
import { formatDate } from '../lib/dates';
import { visit } from '../lib/store';
import { Rich } from '../components/Markup';
import { SpanRibbon } from '../components/SpanRibbon';
import { BookmarkButton, NoteBox } from '../components/StudyTools';
import { MuseumImage } from '../components/MuseumImage';
import { StemmaView } from '../components/Stemma';
import NotFound from './NotFound';
import './people.css';

export default function PersonPage() {
  const { id = '' } = useParams();
  const f = figureById.get(id);
  useEffect(() => {
    if (f) visit({ kind: 'figure', id: f.id, title: f.name });
  }, [f]);
  if (!f) return <NotFound />;
  const rels = relationsOf(f.id);
  const family = rels.filter((r) => r.family);
  const political = rels.filter((r) => !r.family);
  const evs = (eventsForFigure.get(f.id) ?? []).map((e) => eventById.get(e)!).filter(Boolean).sort((a, b) => a.date.from - b.date.from);
  const lessons = lessonsForFigure.get(f.id) ?? [];
  const tree = stemmata.find((s) => s.nodes.some((n) => n.id === f.id));
  const a = f.born?.from ?? f.floruit?.from;
  const b = f.died?.from ?? f.floruit?.to;

  return (
    <div className="page person-page">
      <div className="wrap">
        <header className="page-head person-head">
          <p className="kicker">
            <Link to="/people">People</Link> · {f.roles.join(', ')}
          </p>
          <h1>{f.name}</h1>
          {f.full && <p className="person-full">{f.full}</p>}
          <p className="lede">{formatLife(f)}</p>
          {(f.born?.note || f.died?.note) && <p className="ui small person-datenote">{[f.born?.note, f.died?.note].filter(Boolean).join(' ')}</p>}
          {a !== undefined && b !== undefined && <SpanRibbon highlight={[a, b]} />}
          <div className="row" style={{ marginTop: '1rem' }}>
            <BookmarkButton refItem={{ kind: 'figure', id: f.id, title: f.name }} />
          </div>
        </header>
        <div className="split">
          <div>
            <p className="lede-text">
              <Rich text={f.summary} inline />
            </p>
            {f.image && <MuseumImage id={f.image} />}
            <Rich text={f.bio} className="rich person-bio" />
            <aside className="evidence-box">
              <h2>How we know</h2>
              <Rich text={f.evidence} />
            </aside>
            {tree && (
              <section>
                <h2 className="section-title">Family tree: {tree.title}</h2>
                <StemmaView s={tree} highlight={f.id} />
              </section>
            )}
            <h2 className="section-title">Your notes</h2>
            <NoteBox refItem={{ kind: 'figure', id: f.id, title: f.name }} />
          </div>
          <aside>
            {family.length > 0 && (
              <section className="side-block">
                <h3>Family</h3>
                <ul className="rel-list ui">
                  {family.map((r, i) => (
                    <li key={i}>
                      <span className="rel-label">{r.label}</span> <Link to={`/people/${r.other}`}>{figureById.get(r.other)?.name}</Link>
                      {r.note && <span className="rel-note">{r.note}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {political.length > 0 && (
              <section className="side-block">
                <h3>Allies, rivals and associates</h3>
                <ul className="rel-list ui">
                  {political.map((r, i) => (
                    <li key={i}>
                      <span className="rel-label">{r.label}</span> <Link to={`/people/${r.other}`}>{figureById.get(r.other)?.name}</Link>
                      {r.note && <span className="rel-note">{r.note}</span>}
                    </li>
                  ))}
                </ul>
                <Link to="/people?view=network" className="ui small">
                  See the network
                </Link>
              </section>
            )}
            {evs.length > 0 && (
              <section className="side-block">
                <h3>Events</h3>
                <ul className="ruled tight ui">
                  {evs.map((e) => (
                    <li key={e.id}>
                      <Link to={`/timeline?event=${e.id}`}>{e.title}</Link> <span className="meta">{formatDate(e.date)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {f.sources && f.sources.length > 0 && (
              <section className="side-block">
                <h3>Sources</h3>
                <ul className="ruled tight ui">
                  {f.sources
                    .filter((s) => sourceById.has(s))
                    .map((s) => (
                      <li key={s}>
                        <Link to={`/sources/${s}`}>{sourceById.get(s)!.title}</Link>
                      </li>
                    ))}
                </ul>
              </section>
            )}
            {lessons.length > 0 && (
              <section className="side-block">
                <h3>Appears in lessons</h3>
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
