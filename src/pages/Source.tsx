import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { eventById, eventsForSource, lessonById, lessonsForSource, sourceById } from '../data';
import { formatDate } from '../lib/dates';
import { saveAnswer, useStudy, visit } from '../lib/store';
import { Rich } from '../components/Markup';
import { SourceGlyph } from '../components/Glyphs';
import { CoinFigure } from '../components/Coin';
import { MuseumImage } from '../components/MuseumImage';
import { ReadingList } from '../components/Biblio';
import { SpanRibbon } from '../components/SpanRibbon';
import { BookmarkButton, NoteBox } from '../components/StudyTools';
import { KIND_LABEL } from './Sources';
import NotFound from './NotFound';
import './sources.css';

export default function SourcePage() {
  const { id = '' } = useParams();
  const s = sourceById.get(id);
  type Mode = 'translation' | 'original' | 'parallel';
  // The reading mode resets to the translation whenever another source is opened.
  const [modeFor, setModeFor] = useState<{ id: string; mode: Mode }>({ id, mode: 'translation' });
  const mode: Mode = modeFor.id === id ? modeFor.mode : 'translation';
  const setMode = (m: Mode) => setModeFor({ id, mode: m });
  useEffect(() => {
    if (s) visit({ kind: 'source', id: s.id, title: s.title });
  }, [s]);
  if (!s) return <NotFound />;
  const greek = /Greek/i.test(s.language);
  const hasOriginal = Boolean(s.original?.length);
  const evs = (eventsForSource.get(s.id) ?? []).map((e) => eventById.get(e)!).filter(Boolean);
  const lessons = lessonsForSource.get(s.id) ?? [];

  return (
    <div className="page source-page">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">
            <Link to="/sources">Sources</Link> · {KIND_LABEL[s.kind]} · {formatDate(s.date)}
          </p>
          <div className="source-title-row">
            <SourceGlyph kind={s.kind} size={44} />
            <h1>{s.title}</h1>
          </div>
          <p className="lede">
            {[s.author, s.origin, s.citation].filter(Boolean).join(' · ')} · {s.language}
          </p>
          {s.date.note && <p className="ui small source-datenote">Dating: {s.date.note}</p>}
          <SpanRibbon highlight={[s.date.from, s.date.to ?? s.date.from]} />
          <div className="row" style={{ marginTop: '1rem' }}>
            <BookmarkButton refItem={{ kind: 'source', id: s.id, title: s.title }} />
          </div>
        </header>

        {s.coin && <CoinFigure coin={s.coin} id={s.id} />}
        {s.image && <MuseumImage id={s.image} />}

        <section className="source-text" aria-labelledby="text-h">
          <div className="source-text-head">
            <h2 id="text-h">The text</h2>
            {hasOriginal && (
              <div className="group toolbar" role="group" aria-label="Display">
                {(['translation', 'original', 'parallel'] as const).map((m) => (
                  <button key={m} className="chip" aria-pressed={mode === m} onClick={() => setMode(m)}>
                    {m === 'translation' ? 'Translation' : m === 'original' ? s.language.split(/[ ,(]/)[0] : 'Side by side'}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className={`source-columns mode-${mode}`}>
            {s.translation.map((para, i) => (
              <div className="source-row" key={i}>
                {(mode === 'original' || mode === 'parallel') && s.original?.[i] && (
                  <div className={`source-orig ${greek ? 'greek' : 'latin'}`} lang={greek ? 'grc' : 'la'}>
                    {s.original[i]}
                  </div>
                )}
                {(mode === 'translation' || mode === 'parallel') && (
                  <div className="source-trans">
                    <Rich text={para} />
                  </div>
                )}
              </div>
            ))}
            {mode === 'original' && s.original && s.original.length > s.translation.length && (
              <div className="source-row">
                {s.original.slice(s.translation.length).map((o, i) => (
                  <div key={i} className={`source-orig ${greek ? 'greek' : 'latin'}`}>
                    {o}
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="ui small faint source-translator">Translation: {s.translator}</p>
        </section>

        <section className="source-commentary" aria-label="Commentary">
          <div>
            <h3>Context</h3>
            <Rich text={s.context} />
          </div>
          <div>
            <h3>Who made it</h3>
            <Rich text={s.creator} />
          </div>
          <div>
            <h3>Audience and purpose</h3>
            <Rich text={s.audience} />
          </div>
          <div>
            <h3>What it can tell us</h3>
            <Rich text={s.tells} />
          </div>
          <div className="limits">
            <h3>Limits and biases</h3>
            <Rich text={s.limits} />
          </div>
          <div>
            <h3>How historians use it</h3>
            <Rich text={s.usage} />
          </div>
        </section>

        {s.exercise && s.exercise.length > 0 && <Exercise id={s.id} items={s.exercise} />}

        <div className="split source-foot">
          <div>
            <h2 className="section-title">Your notes</h2>
            <NoteBox refItem={{ kind: 'source', id: s.id, title: s.title }} prompt="What does this source assume its reader already knows?" />
            {s.editions && s.editions.length > 0 && (
              <>
                <h2 className="section-title">Editions and translations to consult</h2>
                <ReadingList refs={s.editions} />
              </>
            )}
          </div>
          <aside>
            {s.related && s.related.length > 0 && (
              <section className="side-block">
                <h3>Read it alongside</h3>
                <ul className="ruled tight ui">
                  {s.related
                    .filter((r) => sourceById.has(r))
                    .map((r) => (
                      <li key={r}>
                        <Link to={`/sources/${r}`}>{sourceById.get(r)!.title}</Link>
                      </li>
                    ))}
                </ul>
              </section>
            )}
            {evs.length > 0 && (
              <section className="side-block">
                <h3>Evidence for</h3>
                <ul className="ruled tight ui">
                  {evs.map((e) => (
                    <li key={e.id}>
                      <Link to={`/timeline?event=${e.id}`}>{e.title}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {lessons.length > 0 && (
              <section className="side-block">
                <h3>Used in lessons</h3>
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

function Exercise({ id, items }: { id: string; items: { q: string; model: string }[] }) {
  const answers = useStudy((s) => s.answers);
  const [shown, setShown] = useState<Record<number, boolean>>({});
  return (
    <section className="source-exercise" aria-labelledby="ex-h">
      <h2 id="ex-h">Analyse this source</h2>
      <p className="ui muted">Write your own answer first, then compare it with a model. Answers are saved in this browser.</p>
      <ol>
        {items.map((it, i) => {
          const key = `src-ex:${id}:${i}`;
          return (
            <li key={i}>
              <div className="ex-q">
                <Rich text={it.q} inline />
              </div>
              <textarea rows={4} defaultValue={answers[key] ?? ''} onBlur={(e) => saveAnswer(key, e.target.value)} aria-label={`Your answer to question ${i + 1}`} />
              {!shown[i] ? (
                <button className="btn small" onClick={() => setShown({ ...shown, [i]: true })}>
                  Show a model answer
                </button>
              ) : (
                <div className="ex-model">
                  <Rich text={it.model} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
