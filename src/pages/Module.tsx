import { Link, useParams } from 'react-router-dom';
import { comparisons, debates, lessonById, lessonsForDebate, moduleById, partOfModule, quizzes, scenarios } from '../data';
import { formatSpan } from '../lib/dates';
import { useStudy } from '../lib/store';
import { ReadingList } from '../components/Biblio';
import { SpanRibbon } from '../components/SpanRibbon';
import NotFound from './NotFound';

export default function ModulePage() {
  const { id = '' } = useParams();
  const m = moduleById.get(id);
  const progress = useStudy((s) => s.progress);
  const checks = useStudy((s) => s.checks);
  if (!m) return <NotFound />;
  const part = partOfModule(m.id)!;
  const quiz = quizzes.find((q) => q.module === m.id);
  const relDebates = debates.filter((d) => (lessonsForDebate.get(d.id) ?? []).some((l) => m.lessons.includes(l)));
  const relScen = scenarios.filter((s) => (s.lessons ?? []).some((l) => m.lessons.includes(l)));
  const relComp = comparisons.filter((c) => (c.lessons ?? []).some((l) => m.lessons.includes(l)));
  const quizResults = quiz ? quiz.checks.map((c) => checks[c.id]).filter(Boolean) : [];

  return (
    <div className="page module-page">
      <header className={`fresco tone-${part.tone} module-band`}>
        <div className="wrap fresco-inner">
          <p className="kicker band-kicker">
            <Link to={`/course#${part.id}`}>
              Part {part.numeral}: {part.title}
            </Link>{' '}
            · Module {m.number}
          </p>
          <h1>{m.title}</h1>
          <p className="band-sub">
            {m.subtitle}
            {part.id !== 'p5' && !/\d/.test(m.subtitle ?? '') && `, ${formatSpan(m.span[0], m.span[1])}`}
          </p>
        </div>
      </header>
      <div className="wrap">
        {part.id !== 'p5' && <SpanRibbon highlight={m.span} />}
        <div className="split module-grid">
          <div>
            <p className="lede-text">{m.summary}</p>
            <h2 className="section-title">Learning objectives</h2>
            <p className="ui muted">By the end of this module you should be able to:</p>
            <ol className="objectives">
              {m.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ol>

            <h2 className="section-title">Lessons</h2>
            <ol className="module-lessons ruled">
              {m.lessons.map((lid) => {
                const l = lessonById.get(lid);
                if (!l) return null;
                return (
                  <li key={lid}>
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                      <Link to={`/lesson/${l.id}`} className="entry-title">
                        {l.title}
                      </Link>
                      <span className="meta">
                        {progress[l.id]?.completed ? 'Completed · ' : ''}
                        {l.status === 'outline' ? 'Outline' : `${l.minutes} min`}
                      </span>
                    </div>
                    {l.subtitle && <p className="muted">{l.subtitle}</p>}
                    <ul className="key-questions">
                      {l.questions.slice(0, 3).map((q) => (
                        <li key={q}>{q}</li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ol>

            <h2 className="section-title">Essay questions</h2>
            <ol className="essay-prompts">
              {m.essays.map((e) => (
                <li key={e.id}>
                  <p className="essay-q">{e.prompt}</p>
                  <details>
                    <summary className="ui">How to approach this question</summary>
                    <p>{e.guidance}</p>
                    {e.readings && <ReadingList refs={e.readings} showLevel={false} />}
                  </details>
                  <Link to={`/revise/essays/${e.id}`} className="ui small">
                    Plan this essay
                  </Link>
                </li>
              ))}
            </ol>
          </div>
          <aside className="module-side">
            {quiz && (
              <section className="side-block">
                <h3>Module quiz</h3>
                <p className="ui small muted">
                  {quiz.checks.length} questions testing recall, chronology, causation, sources and interpretation.
                  {quizResults.length > 0 && ` You have attempted ${quizResults.length}.`}
                </p>
                <Link className="btn primary small" to={`/revise/quiz/${quiz.id}`}>
                  Take the quiz
                </Link>
              </section>
            )}
            {relDebates.length > 0 && (
              <section className="side-block">
                <h3>Debates</h3>
                <ul className="ruled tight">
                  {relDebates.map((d) => (
                    <li key={d.id}>
                      <Link to={`/debates/${d.id}`}>{d.title}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {relScen.length > 0 && (
              <section className="side-block">
                <h3>Scenarios</h3>
                <ul className="ruled tight">
                  {relScen.map((s) => (
                    <li key={s.id}>
                      <Link to={`/scenarios/${s.id}`}>{s.title}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {relComp.length > 0 && (
              <section className="side-block">
                <h3>Comparisons</h3>
                <ul className="ruled tight">
                  {relComp.map((c) => (
                    <li key={c.id}>
                      <Link to={`/compare/${c.id}`}>{c.title}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <section className="side-block">
              <h3>Module reading</h3>
              <ReadingList refs={m.readings} />
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
