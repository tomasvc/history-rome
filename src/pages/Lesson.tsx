import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  cachedLessonBody,
  debateById,
  eventById,
  figureById,
  formatLife,
  lessonById,
  lessonNumber,
  loadLessonBody,
  moduleById,
  neighbours,
  orderedLessons,
  partOfModule,
  placeById,
  quizzes,
  sourceById,
  termById,
} from '../data';
import { formatDate, formatSpan } from '../lib/dates';
import { parseSections } from '../lib/markup';
import { autoLink, figureNames, placeNames, termNames, type LinkTarget } from '../lib/autolink';
import { setLessonComplete, useStudy, visit } from '../lib/store';
import { Blocks, Rich } from '../components/Markup';
import { SpanRibbon } from '../components/SpanRibbon';
import { BookmarkButton, NoteBox } from '../components/StudyTools';
import { ReadingList } from '../components/Biblio';
import { CertaintyKey } from '../components/Certainty';
import NotFound from './NotFound';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];

export default function LessonPage() {
  const { id = '' } = useParams();
  const lesson = lessonById.get(id);
  const completed = useStudy((s) => s.progress[id]?.completed);
  const checks = useStudy((s) => s.checks);
  // The lesson text is fetched on demand; metadata (aims, checks, readings) renders immediately.
  const [loaded, setLoaded] = useState<{ id: string; body?: string; failed?: boolean }>();
  const body = cachedLessonBody(id) ?? (loaded?.id === id ? loaded.body : undefined);
  const loadFailed = loaded?.id === id && Boolean(loaded.failed);
  useEffect(() => {
    if (!lessonById.has(id)) return;
    let live = true;
    loadLessonBody(id)
      .then((b) => {
        if (!live) return;
        setLoaded({ id, body: b });
        const { next } = neighbours(id);
        if (next) void loadLessonBody(next.id).catch(() => undefined);
      })
      .catch(() => live && setLoaded({ id, failed: true }));
    return () => {
      live = false;
    };
  }, [id]);
  const sections = useMemo(() => {
    if (!lesson || body === undefined) return [];
    const targets: LinkTarget[] = [
      ...(lesson.figures ?? []).flatMap((fid) => {
        const f = figureById.get(fid);
        return f ? [{ kind: 'fig' as const, id: fid, names: figureNames(f.name, fid), caseSensitive: true }] : [];
      }),
      ...(lesson.places ?? []).flatMap((pid) => {
        const p = placeById.get(pid);
        return p ? [{ kind: 'place' as const, id: pid, names: placeNames(p), caseSensitive: true }] : [];
      }),
      ...(lesson.terms ?? []).flatMap((tid) => {
        const t = termById.get(tid);
        return t ? [{ kind: 'term' as const, id: tid, names: termNames(t.term, tid), caseSensitive: false }] : [];
      }),
    ];
    return parseSections(autoLink(body, targets));
  }, [lesson, body]);
  const [active, setActive] = useState<string>('');

  const location = useLocation();
  useEffect(() => {
    if (lesson) visit({ kind: 'lesson', id: lesson.id, title: lesson.title });
  }, [lesson]);
  useEffect(() => {
    if (location.hash && sections.length) setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView(), 80);
  }, [location.hash, id, sections.length]);

  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('.lesson-section')];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '-90px 0px -60% 0px' },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [sections]);

  if (!lesson) return <NotFound />;
  const mod = moduleById.get(lesson.module)!;
  const part = partOfModule(lesson.module)!;
  const { prev, next } = neighbours(lesson.id);
  const quiz = quizzes.find((q) => q.module === mod.id);
  const lessonChecks = lesson.checks ?? [];
  const attempted = lessonChecks.filter((c) => checks[c.id]).length;
  const isLastInModule = mod.lessons[mod.lessons.length - 1] === lesson.id;
  const words = lesson.stats.words;

  const toc = [
    { id: 'aims', title: 'Aims and questions' },
    ...sections.map((s) => ({ id: s.id, title: s.title })),
    { id: 'reading', title: 'Reading' },
    { id: 'connections', title: 'Connections' },
    { id: 'notes', title: 'Your notes' },
  ];

  return (
    <article className={`lesson tone-${part.tone}`}>
      <header className={`lesson-band fresco tone-${part.tone}`}>
        <div className="wrap fresco-inner">
          <p className="kicker band-kicker">
            <Link to={`/course#${part.id}`}>Part {part.numeral}</Link> · <Link to={`/course/${mod.id}`}>Module {mod.number}: {mod.title}</Link> · Lesson{' '}
            {lessonNumber(lesson.id)} of {orderedLessons.length}
          </p>
          <h1 className="lesson-title">{lesson.title}</h1>
          {lesson.subtitle && <p className="band-sub">{lesson.subtitle}</p>}
          <p className="lesson-meta ui">
            <span>{formatSpan(lesson.span[0], lesson.span[1])}</span>
            <span>{lesson.minutes} min reading</span>
            <span>{lessonChecks.length} knowledge checks</span>
            {lesson.status === 'outline' && <span className="outline-flag">Outline: full lesson in preparation</span>}
          </p>
        </div>
      </header>
      <div className="wrap">
        <div className="lesson-span">
          <SpanRibbon highlight={lesson.span} />
        </div>
        <div className="lesson-actions row">
          <BookmarkButton refItem={{ kind: 'lesson', id: lesson.id, title: lesson.title }} />
          <button className="btn small" aria-pressed={Boolean(completed)} onClick={() => setLessonComplete(lesson.id, !completed)}>
            {completed ? 'Completed' : 'Mark as completed'}
          </button>
          <span className="ui small faint">
            {words.toLocaleString('en-GB')} words · {attempted}/{lessonChecks.length} checks attempted
          </span>
        </div>
      </div>

      <div className="wrap lesson-grid">
        <nav className="lesson-toc" aria-label="Lesson contents">
          <details open>
            <summary className="ui">Contents</summary>
            <ol>
              {toc.map((t) => {
                const n = sections.findIndex((s) => s.id === t.id);
                return (
                  <li key={t.id} className={active === t.id ? 'active' : ''}>
                    <a
                      href={`#${t.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {n >= 0 && <span className="toc-num">{ROMAN[n]}</span>}
                      {t.title}
                    </a>
                  </li>
                );
              })}
            </ol>
          </details>
          <details className="toc-key">
            <summary className="ui">How claims are marked</summary>
            <CertaintyKey />
          </details>
        </nav>

        <div className="lesson-main">
          <section id="aims" className="lesson-aims">
            <div className="aims-col">
              <h2 className="aims-h">Objectives</h2>
              <ol className="objectives">
                {lesson.objectives.map((o) => (
                  <li key={o}>
                    <Rich text={o} inline />
                  </li>
                ))}
              </ol>
            </div>
            <div className="aims-col">
              <h2 className="aims-h">Questions to hold in mind</h2>
              <ul className="key-questions">
                {lesson.questions.map((q) => (
                  <li key={q}>
                    <Rich text={q} inline />
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {body === undefined && (
            <p className="lesson-loading ui" role="status">
              {loadFailed ? (
                <>
                  The lesson text could not be loaded. Check your connection and{' '}
                  <button className="linklike" onClick={() => window.location.reload()}>
                    reload the page
                  </button>
                  .
                </>
              ) : (
                'Loading the lesson…'
              )}
            </p>
          )}

          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="lesson-section" aria-labelledby={`${s.id}-h`}>
              <h2 id={`${s.id}-h`} className="lesson-h2">
                <span className="sec-num">{ROMAN[i]}</span>
                {s.title}
              </h2>
              <Blocks blocks={s.blocks} />
            </section>
          ))}

          {lesson.inquiry && lesson.inquiry.length > 0 && (
            <section className="lesson-section inquiry" aria-labelledby="inquiry-h">
              <h2 id="inquiry-h" className="lesson-h2">
                <span className="sec-num">?</span>For further inquiry
              </h2>
              <ul className="inquiry-list">
                {lesson.inquiry.map((q) => (
                  <li key={q}>
                    <Rich text={q} inline />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section id="reading" className="lesson-section" aria-labelledby="reading-h">
            <h2 id="reading-h" className="lesson-h2">
              <span className="sec-num">§</span>Reading
            </h2>
            <p className="ui muted small">Ancient sources in translation first, then modern scholarship. “Start here” marks the most accessible way in.</p>
            <ReadingList refs={lesson.reading ?? []} />
          </section>

          <section id="connections" className="lesson-section connections" aria-labelledby="conn-h">
            <h2 id="conn-h" className="lesson-h2">
              <span className="sec-num">⁂</span>Connections
            </h2>
            <div className="conn-grid">
              {lesson.figures && lesson.figures.length > 0 && (
                <div>
                  <h3>People</h3>
                  <ul>
                    {lesson.figures.map((f) => {
                      const x = figureById.get(f);
                      return x ? (
                        <li key={f}>
                          <Link to={`/people/${f}`}>{x.name}</Link> <span className="meta">{formatLife(x)}</span>
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              )}
              {lesson.events && lesson.events.length > 0 && (
                <div>
                  <h3>Events</h3>
                  <ul>
                    {lesson.events.map((e) => {
                      const x = eventById.get(e);
                      return x ? (
                        <li key={e}>
                          <Link to={`/timeline?event=${e}`}>{x.title}</Link> <span className="meta">{formatDate(x.date)}</span>
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              )}
              {lesson.places && lesson.places.length > 0 && (
                <div>
                  <h3>Places</h3>
                  <ul>
                    {lesson.places.map((p) => {
                      const x = placeById.get(p);
                      return x ? (
                        <li key={p}>
                          <Link to={`/atlas?place=${p}`}>{x.name}</Link>
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              )}
              {lesson.sources && lesson.sources.length > 0 && (
                <div>
                  <h3>Sources</h3>
                  <ul>
                    {lesson.sources.map((s) => {
                      const x = sourceById.get(s);
                      return x ? (
                        <li key={s}>
                          <Link to={`/sources/${s}`}>{x.title}</Link>
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              )}
              {lesson.debates && lesson.debates.length > 0 && (
                <div>
                  <h3>Debates</h3>
                  <ul>
                    {lesson.debates.map((d) => {
                      const x = debateById.get(d);
                      return x ? (
                        <li key={d}>
                          <Link to={`/debates/${d}`}>{x.title}</Link>
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              )}
              {lesson.terms && lesson.terms.length > 0 && (
                <div>
                  <h3>Key terms</h3>
                  <ul className="term-list">
                    {lesson.terms.map((t) => {
                      const x = termById.get(t);
                      return x ? (
                        <li key={t}>
                          <Link to={`/glossary#${t}`}>{x.term}</Link>
                        </li>
                      ) : null;
                    })}
                  </ul>
                  <Link to={`/revise/cards?lesson=${lesson.id}`} className="ui small">
                    Revise these as flashcards
                  </Link>
                </div>
              )}
            </div>
          </section>

          <section id="notes" className="lesson-section" aria-labelledby="notes-h">
            <h2 id="notes-h" className="lesson-h2">
              <span className="sec-num">✎</span>Your notes
            </h2>
            <NoteBox refItem={{ kind: 'lesson', id: lesson.id, title: lesson.title }} prompt="Summarise the argument of this lesson in three sentences, then note one question you would put to a tutor." />
          </section>

          <footer className="lesson-foot">
            <button className="btn primary" onClick={() => setLessonComplete(lesson.id, !completed)} aria-pressed={Boolean(completed)}>
              {completed ? 'Completed' : 'Mark lesson as completed'}
            </button>
            {isLastInModule && quiz && (
              <Link to={`/revise/quiz/${quiz.id}`} className="btn">
                Take the module {mod.number} quiz
              </Link>
            )}
            <nav className="prev-next" aria-label="Lesson sequence">
              {prev && (
                <Link to={`/lesson/${prev.id}`} className="pn prev">
                  <span className="ui small faint">Previous</span>
                  <span>{prev.title}</span>
                </Link>
              )}
              {next && (
                <Link to={`/lesson/${next.id}`} className="pn next">
                  <span className="ui small faint">Next</span>
                  <span>{next.title}</span>
                </Link>
              )}
            </nav>
          </footer>
        </div>
      </div>
    </article>
  );
}
