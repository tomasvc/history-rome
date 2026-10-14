import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { curriculum, lessonById, moduleById, quizzes } from '../data';
import { formatSpan } from '../lib/dates';
import { useStudy } from '../lib/store';
import { SpanRibbon } from '../components/SpanRibbon';

export default function CoursePage() {
  const [tab, setTab] = useState<'syllabus' | 'plan'>('syllabus');
  const progress = useStudy((s) => s.progress);
  const loc = useLocation();
  useEffect(() => {
    if (loc.hash) document.getElementById(loc.hash.slice(1))?.scrollIntoView();
  }, [loc.hash]);

  return (
    <div className="page course">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Syllabus</p>
          <h1>The course</h1>
          <p className="lede">
            Fourteen chronological modules and thirteen thematic studies. Each lesson sets out its context, chronology, people, institutions, causes,
            consequences, historiographical debates and evidence, with knowledge checks as you read and a quiz at the end of each module.
          </p>
        </header>
        <div className="tabs" role="tablist" aria-label="Course views">
          <button role="tab" aria-selected={tab === 'syllabus'} className="tab" onClick={() => setTab('syllabus')}>
            Syllabus
          </button>
          <button role="tab" aria-selected={tab === 'plan'} className="tab" onClick={() => setTab('plan')}>
            Three-term study plan
          </button>
        </div>
      </div>

      {tab === 'syllabus' ? (
        <div className="syllabus">
          {curriculum.parts.map((p) => (
            <section key={p.id} id={p.id} className="syllabus-part" aria-labelledby={`${p.id}-h`}>
              <div className={`fresco tone-${p.tone} part-band`}>
                <div className="wrap fresco-inner part-band-inner">
                  <span className="part-numeral">{p.numeral}</span>
                  <div>
                    <h2 id={`${p.id}-h`}>{p.title}</h2>
                    <p className="part-band-sub">{p.id === 'p5' ? p.subtitle : formatSpan(p.span[0], p.span[1])}</p>
                    <p className="part-band-summary">{p.summary}</p>
                  </div>
                </div>
              </div>
              <div className="wrap">
                {p.id !== 'p5' && <SpanRibbon highlight={p.span} />}
                <ol className="syllabus-modules">
                  {p.modules.map((mid) => {
                    const m = moduleById.get(mid);
                    if (!m) return null;
                    const quiz = quizzes.find((q) => q.module === m.id);
                    return (
                      <li key={m.id} className="syllabus-module">
                        <div className="sm-head">
                          <span className="sm-num">{m.number}</span>
                          <div>
                            <Link to={`/course/${m.id}`} className="sm-title">
                              {m.title}
                            </Link>
                            <p className="meta">
                              {m.subtitle}
                              {p.id !== 'p5' ? ` · ${formatSpan(m.span[0], m.span[1])}` : ''}
                            </p>
                          </div>
                        </div>
                        <ol className="sm-lessons">
                          {m.lessons.map((lid) => {
                            const l = lessonById.get(lid);
                            if (!l) return (
                              <li key={lid} className="sm-lesson planned">
                                <span className="sm-lesson-title">{lid}</span>
                                <span className="meta">in preparation</span>
                              </li>
                            );
                            const done = progress[l.id]?.completed;
                            return (
                              <li key={lid} className={`sm-lesson ${done ? 'done' : ''} ${l.status}`}>
                                <span className="sm-check" aria-label={done ? 'Completed' : 'Not completed'}>
                                  {done ? '✓' : ''}
                                </span>
                                <Link to={`/lesson/${l.id}`} className="sm-lesson-title">
                                  {l.title}
                                </Link>
                                <span className="meta">
                                  {l.status === 'outline' ? 'outline' : `${l.minutes} min`}
                                </span>
                              </li>
                            );
                          })}
                          {quiz && (
                            <li className="sm-lesson sm-quiz">
                              <span className="sm-check" aria-hidden="true">?</span>
                              <Link to={`/revise/quiz/${quiz.id}`} className="sm-lesson-title">
                                Module quiz
                              </Link>
                              <span className="meta">{quiz.checks.length} questions</span>
                            </li>
                          )}
                        </ol>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="wrap plan">
          <p className="lede muted">
            A suggested sequence for three terms of roughly eleven weeks, at about 8–12 hours a week. Each week pairs chronological lessons with a
            thematic study and a practical task. Weeks fill in as you complete their lessons.
          </p>
          {curriculum.terms.map((t) => (
            <section key={t.id} className="plan-term">
              <h2>{t.title}</h2>
              <p className="muted">{t.summary}</p>
              <table className="data plan-table">
                <thead>
                  <tr>
                    <th scope="col">Week</th>
                    <th scope="col">Topic and lessons</th>
                    <th scope="col">Tasks</th>
                  </tr>
                </thead>
                <tbody>
                  {t.weeks.map((w) => {
                    const done = w.lessons.length > 0 && w.lessons.every((l) => progress[l]?.completed);
                    return (
                      <tr key={w.week} className={done ? 'done' : ''}>
                        <td className="plan-week">
                          {w.week}
                          {done && <span className="sr-only"> (completed)</span>}
                        </td>
                        <td>
                          <strong>{w.title}</strong>
                          <ul className="plan-lessons">
                            {w.lessons.map((lid) => {
                              const l = lessonById.get(lid);
                              return (
                                <li key={lid}>
                                  {progress[lid]?.completed ? '✓ ' : ''}
                                  {l ? <Link to={`/lesson/${lid}`}>{l.title}</Link> : lid}
                                </li>
                              );
                            })}
                          </ul>
                        </td>
                        <td>
                          <ul className="plan-tasks">
                            {w.tasks.map((task) => (
                              <li key={task}>{task}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
