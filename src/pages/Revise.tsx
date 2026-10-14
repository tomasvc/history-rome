import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { allChecks, curriculum, flashcards, lessonById, moduleById, orderedLessons, quizById, quizzes } from '../data';
import { update, useStudy, type StudyState } from '../lib/store';
import { isDue, nextIntervalLabel, review, strength, type Grade } from '../lib/srs';
import { KnowledgeCheck, SKILL_LABEL } from '../components/KnowledgeCheck';
import { Rich } from '../components/Markup';
import { ReadingList } from '../components/Biblio';
import type { Flashcard, Skill } from '../types';
import './study.css';

const TABS = [
  { id: 'cards', label: 'Flashcards' },
  { id: 'quiz', label: 'Quizzes' },
  { id: 'essays', label: 'Essays' },
  { id: 'insights', label: 'What to revisit' },
];

export default function RevisePage() {
  const { tab = 'cards', id } = useParams();
  const nav = useNavigate();
  return (
    <div className="page revise-page">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Revision</p>
          <h1>Revise</h1>
          <p className="lede">
            Long-term learning comes from retrieval, spacing and writing. Review flashcards on a spaced schedule, take module quizzes that test reasoning
            as well as recall, plan essays, and let your results tell you what to revisit.
          </p>
        </header>
        <div className="tabs" role="tablist" aria-label="Revision tools">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className="tab" onClick={() => nav(`/revise/${t.id}`)}>
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'cards' && <Cards />}
        {tab === 'quiz' && (id ? <QuizRunner id={id} /> : <QuizList />)}
        {tab === 'essays' && <Essays selected={id} />}
        {tab === 'insights' && <Insights />}
      </div>
    </div>
  );
}

// ---------------- Flashcards ----------------
const DECKS = ['All', 'Terms', 'People', 'Dates', 'Concepts'];

function Cards() {
  const [params, setParams] = useSearchParams();
  const lesson = params.get('lesson');
  const [deck, setDeck] = useState(params.get('deck') ?? 'All');
  const cards = useStudy((s) => s.cards);
  const pool = useMemo(
    () =>
      flashcards.filter((c) => (lesson ? c.lesson === lesson : deck === 'All' || c.deck === deck || (deck === 'Concepts' && !['Terms', 'People', 'Dates'].includes(c.deck)))),
    [deck, lesson],
  );
  const stats = useMemo(() => {
    const s = { new: 0, learning: 0, young: 0, mature: 0, due: 0 };
    for (const c of pool) {
      s[strength(cards[c.id])] += 1;
      if (cards[c.id] && isDue(cards[c.id])) s.due += 1;
    }
    return s;
  }, [pool, cards]);
  const [session, setSession] = useState<Flashcard[] | null>(null);
  const [newLimit, setNewLimit] = useState(15);

  const start = () => {
    const now = Date.now();
    const due = pool.filter((c) => cards[c.id] && cards[c.id].due <= now).sort((a, b) => cards[a.id].due - cards[b.id].due);
    const fresh = pool.filter((c) => !cards[c.id]).slice(0, newLimit);
    setSession([...due, ...fresh]);
  };

  if (session) return <CardSession queue={session} onEnd={() => setSession(null)} />;
  return (
    <div className="cards-home">
      <div className="toolbar">
        {lesson ? (
          <span className="ui">
            Cards for <strong>{lessonById.get(lesson)?.title}</strong>{' '}
            <button className="btn ghost small" onClick={() => setParams({})}>
              Show all decks
            </button>
          </span>
        ) : (
          <div className="group" role="group" aria-label="Deck">
            <span className="group-label">Deck</span>
            {DECKS.map((d) => (
              <button key={d} className="chip" aria-pressed={deck === d} onClick={() => setDeck(d)}>
                {d}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="cards-stats ui">
        <div>
          <strong className="stat">{stats.due}</strong> due now
        </div>
        <div>
          <strong className="stat">{stats.new}</strong> not yet studied
        </div>
        <div>
          <strong className="stat">{stats.learning}</strong> learning
        </div>
        <div>
          <strong className="stat">{stats.young + stats.mature}</strong> well known ({stats.mature} mature)
        </div>
      </div>
      <div className="row">
        <button className="btn primary" onClick={start} disabled={stats.due === 0 && stats.new === 0}>
          {stats.due ? `Review ${stats.due} due card${stats.due > 1 ? 's' : ''}` : 'Study new cards'}
          {stats.new > 0 ? ` + up to ${Math.min(newLimit, stats.new)} new` : ''}
        </button>
        <label className="ui small">
          New cards per session{' '}
          <select value={newLimit} onChange={(e) => setNewLimit(Number(e.target.value))}>
            {[5, 10, 15, 25, 40].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="ui small muted cards-explain">
        Cards you know well come back after longer and longer gaps; cards you miss return within minutes. A few minutes most days is far more effective
        than a long session before an essay. Cards are drawn from the glossary, the people, key dates and concept cards written for each module.
      </p>
    </div>
  );
}

function CardSession({ queue: initial, onEnd }: { queue: Flashcard[]; onEnd: () => void }) {
  const [queue, setQueue] = useState(initial);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(0);
  const [again, setAgain] = useState(0);
  const cards = useStudy((s) => s.cards);
  const card = queue[0];
  const grade = (g: Grade) => {
    if (!card) return;
    update((s) => {
      s.cards[card.id] = review(s.cards[card.id] ?? { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: Date.now() }, g);
    });
    setFlipped(false);
    setDone(done + 1);
    if (g === 0) {
      setAgain(again + 1);
      setQueue([...queue.slice(1), card]);
    } else setQueue(queue.slice(1));
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'TEXTAREA' || (e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.key === ' ') {
        e.preventDefault();
        setFlipped(true);
      } else if (flipped && ['1', '2', '3', '4'].includes(e.key)) grade((Number(e.key) - 1) as Grade);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  if (!card)
    return (
      <div className="card-done">
        <h2>Session complete</h2>
        <p className="ui">
          {done} reviews, {again} marked “again”. Cards will come back when they are due.
        </p>
        <button className="btn primary" onClick={onEnd}>
          Back to decks
        </button>
      </div>
    );
  const lesson = card.lesson ? lessonById.get(card.lesson) : undefined;
  return (
    <div className="card-session">
      <p className="ui small faint">
        {queue.length} left in this session · {card.deck}
      </p>
      <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
        <div className="fc-front">
          <Rich text={card.front} />
        </div>
        {flipped && (
          <div className="fc-back">
            <Rich text={card.back} />
            {lesson && (
              <Link to={`/lesson/${lesson.id}`} className="ui small">
                From: {lesson.title}
              </Link>
            )}
          </div>
        )}
      </div>
      {!flipped ? (
        <button className="btn primary" onClick={() => setFlipped(true)}>
          Show answer <kbd>space</kbd>
        </button>
      ) : (
        <div className="grade-row" role="group" aria-label="How well did you recall it?">
          {(['Again', 'Hard', 'Good', 'Easy'] as const).map((l, i) => (
            <button key={l} className={`btn grade-${i}`} onClick={() => grade(i as Grade)}>
              {l}
              <span className="grade-next">{nextIntervalLabel(cards[card.id], i as Grade)}</span>
              <kbd>{i + 1}</kbd>
            </button>
          ))}
        </div>
      )}
      <button className="btn ghost small end-session" onClick={onEnd}>
        End session
      </button>
    </div>
  );
}

// ---------------- Quizzes ----------------
function QuizList() {
  const runs = useStudy((s) => s.quizRuns);
  return (
    <ul className="quiz-list">
      {curriculum.modules.map((m) => {
        const q = quizzes.find((x) => x.module === m.id);
        if (!q) return null;
        const mine = runs.filter((r) => r.quiz === q.id);
        const best = mine.length ? Math.max(...mine.map((r) => r.score / r.total)) : null;
        const skills = [...new Set(q.checks.map((c) => c.skill))];
        return (
          <li key={q.id}>
            <span className="quiz-num">{m.number}</span>
            <div>
              <Link to={`/revise/quiz/${q.id}`} className="entry-title">
                {q.title}
              </Link>
              <p className="meta">
                {q.checks.length} questions · {skills.map((s) => SKILL_LABEL[s]).join(', ')}
              </p>
            </div>
            <span className="ui small">{best !== null ? `Best ${Math.round(best * 100)}%` : 'Not attempted'}</span>
          </li>
        );
      })}
    </ul>
  );
}

function QuizRunner({ id }: { id: string }) {
  const q = quizById.get(id);
  const [i, setI] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  if (!q) return <p className="empty">Quiz not found.</p>;
  const check = q.checks[i];
  const mod = moduleById.get(q.module);
  const answered = check && scores[check.id] !== undefined;
  const finish = () => {
    const total = q.checks.length;
    const score = Object.values(scores).reduce((a, b) => a + b, 0);
    update((s) => {
      s.quizRuns = [...s.quizRuns, { quiz: q.id, at: Date.now(), score, total }];
    });
    setFinished(true);
  };
  if (finished) {
    const bySkill = new Map<Skill, number[]>();
    q.checks.forEach((c) => bySkill.set(c.skill, [...(bySkill.get(c.skill) ?? []), scores[c.id] ?? 0]));
    const weak = q.checks.filter((c) => (scores[c.id] ?? 0) < 0.6);
    const weakLessons = [...new Set(weak.map((c) => c.lesson).filter(Boolean))] as string[];
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    return (
      <div className="quiz-result">
        <h2>
          {q.title}: {Math.round((total / q.checks.length) * 100)}%
        </h2>
        <table className="data skill-table">
          <tbody>
            {[...bySkill.entries()].map(([sk, v]) => (
              <tr key={sk}>
                <th scope="row">{SKILL_LABEL[sk]}</th>
                <td>
                  <span className="skill-bar">
                    <span style={{ width: `${(v.reduce((a, b) => a + b, 0) / v.length) * 100}%` }} />
                  </span>
                </td>
                <td>{Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        {weak.length > 0 ? (
          <>
            <h3>Revisit</h3>
            <ul className="ui">
              {weakLessons.map((l) => (
                <li key={l}>
                  <Link to={`/lesson/${l}`}>{lessonById.get(l)?.title}</Link>
                </li>
              ))}
              {weakLessons.length === 0 && mod && (
                <li>
                  The lessons of <Link to={`/course/${mod.id}`}>Module {mod.number}</Link>
                </li>
              )}
            </ul>
          </>
        ) : (
          <p className="ui">Strong across the board. Try an essay question from this module next.</p>
        )}
        <div className="row">
          <Link className="btn" to="/revise/quiz">
            All quizzes
          </Link>
          {mod && (
            <Link className="btn ghost" to={`/course/${mod.id}`}>
              Module {mod.number} essays
            </Link>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="quiz-runner">
      <div className="quiz-progress ui">
        <span>
          {q.title} · Question {i + 1} of {q.checks.length}
        </span>
        <span className="quiz-dots" aria-hidden="true">
          {q.checks.map((c, j) => (
            <span key={c.id} className={`qd ${j === i ? 'cur' : ''} ${scores[c.id] !== undefined ? (scores[c.id] >= 0.6 ? 'ok' : 'no') : ''}`} />
          ))}
        </span>
      </div>
      <KnowledgeCheck key={check.id} check={check} label={`Question ${i + 1}`} onDone={(s) => setScores({ ...scores, [check.id]: s })} />
      <div className="row">
        {i > 0 && (
          <button className="btn ghost" onClick={() => setI(i - 1)}>
            Previous
          </button>
        )}
        {i < q.checks.length - 1 ? (
          <button className="btn primary" onClick={() => setI(i + 1)} disabled={!answered}>
            Next question
          </button>
        ) : (
          <button className="btn primary" onClick={finish} disabled={!answered}>
            Finish and see results
          </button>
        )}
        {!answered && <span className="ui small faint">Answer (or self-assess) to continue.</span>}
      </div>
    </div>
  );
}

// ---------------- Essays ----------------
function Essays({ selected }: { selected?: string }) {
  const essays = useStudy((s) => s.essays);
  const all = curriculum.modules.flatMap((m) => m.essays.map((e) => ({ ...e, module: m })));
  const e = all.find((x) => x.id === selected);
  if (!e)
    return (
      <div className="essay-index">
        <p className="ui muted">
          Undergraduate-style essay questions for every module, with guidance on how to approach them. Plan your answer here: a thesis, the arguments and
          evidence, the strongest counter-argument, then a draft.
        </p>
        {curriculum.parts.map((p) => (
          <section key={p.id}>
            <h2 className="section-title">
              Part {p.numeral}: {p.title}
            </h2>
            <ul className="ruled">
              {all
                .filter((x) => x.module.part === p.id)
                .map((x) => (
                  <li key={x.id}>
                    <Link to={`/revise/essays/${x.id}`} className="essay-q essay-link">
                      {x.prompt}
                    </Link>
                    <p className="meta">
                      Module {x.module.number}: {x.module.title}
                      {essays[x.id] ? ` · plan started ${new Date(essays[x.id].at).toLocaleDateString('en-GB')}` : ''}
                    </p>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    );
  return <EssayPlanner key={e.id} e={e} />;
}

function EssayPlanner({ e }: { e: { id: string; prompt: string; guidance: string; readings?: string[]; module: { id: string; number: number; title: string } } }) {
  const saved = useStudy((s) => s.essays[e.id]);
  const [plan, setPlan] = useState(saved ?? { thesis: '', points: '', counter: '', draft: '', at: 0 });
  const [status, setStatus] = useState('');
  useEffect(() => {
    if (!plan.at && !plan.thesis && !plan.points && !plan.counter && !plan.draft) return;
    const t = setTimeout(() => {
      update((s: StudyState) => {
        s.essays[e.id] = { ...plan, at: Date.now() };
      });
      setStatus('Saved in this browser.');
    }, 700);
    return () => clearTimeout(t);
  }, [plan]); // eslint-disable-line react-hooks/exhaustive-deps
  const words = plan.draft.trim() ? plan.draft.trim().split(/\s+/).length : 0;
  const field = (k: 'thesis' | 'points' | 'counter' | 'draft', label: string, hint: string, rows: number) => (
    <label className="field essay-field">
      <span>
        <strong>{label}</strong> {hint}
      </span>
      <textarea rows={rows} value={plan[k]} onChange={(ev) => setPlan({ ...plan, [k]: ev.target.value, at: Date.now() })} />
    </label>
  );
  return (
    <div className="essay-planner split">
      <div>
        <p className="kicker">
          <Link to="/revise/essays">All essay questions</Link> · Module {e.module.number}: {e.module.title}
        </p>
        <h2 className="essay-title">{e.prompt}</h2>
        {field('thesis', 'Thesis.', 'Your answer to the question in one or two sentences.', 3)}
        {field('points', 'Arguments and evidence.', 'Three to five steps, each with a named piece of ancient evidence or a historian.', 7)}
        {field('counter', 'Counter-argument.', 'The strongest case against you, and your reply.', 4)}
        {field('draft', 'Draft.', 'Write the essay or its opening paragraphs.', 14)}
        <p className="ui small faint" aria-live="polite">
          {words} words in draft. {status}
        </p>
      </div>
      <aside>
        <section className="side-block">
          <h3>How to approach it</h3>
          <Rich text={e.guidance} />
        </section>
        {e.readings && (
          <section className="side-block">
            <h3>Reading</h3>
            <ReadingList refs={e.readings} showLevel={false} />
          </section>
        )}
        <section className="side-block">
          <h3>A checklist examiners use</h3>
          <ul className="ui small checklist">
            <li>Does the introduction answer the question rather than restate it?</li>
            <li>Does each paragraph advance the argument, not just the narrative?</li>
            <li>Is ancient evidence quoted or cited precisely, with its limitations acknowledged?</li>
            <li>Are historians’ views attributed and weighed, not just listed?</li>
            <li>Is the strongest counter-argument met head on?</li>
            <li>Does the conclusion make a judgement about “how far” or “why”?</li>
          </ul>
        </section>
      </aside>
    </div>
  );
}

// ---------------- Insights ----------------
export function Insights() {
  const checks = useStudy((s) => s.checks);
  const runs = useStudy((s) => s.quizRuns);
  const results = Object.entries(checks);
  if (!results.length)
    return (
      <p className="empty">
        Nothing to analyse yet. Answer the knowledge checks in a lesson or take a module quiz, and this page will show which skills and topics need
        another look.
      </p>
    );
  const bySkill = new Map<Skill, number[]>();
  const byLesson = new Map<string, number[]>();
  for (const [id, r] of results) {
    bySkill.set(r.skill, [...(bySkill.get(r.skill) ?? []), r.score]);
    const c = allChecks.find((x) => x.id === id);
    const lesson = r.lesson ?? c?.lesson;
    if (lesson) byLesson.set(lesson, [...(byLesson.get(lesson) ?? []), r.score]);
  }
  const avg = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
  const weakLessons = [...byLesson.entries()].filter(([, v]) => avg(v) < 0.65).sort((a, b) => avg(a[1]) - avg(b[1]));
  const weakSkills = [...bySkill.entries()].filter(([, v]) => avg(v) < 0.65);
  const SECTION_FOR: Partial<Record<Skill, string>> = { chronology: 'chronology', causation: 'causation', source: 'evidence', interpretation: 'historiography' };
  return (
    <div className="insights split">
      <div>
        <h2 className="section-title">By skill</h2>
        <table className="data skill-table">
          <tbody>
            {(Object.keys(SKILL_LABEL) as Skill[]).map((sk) => {
              const v = bySkill.get(sk);
              return (
                <tr key={sk}>
                  <th scope="row">{SKILL_LABEL[sk]}</th>
                  <td>
                    <span className="skill-bar">{v && <span style={{ width: `${avg(v) * 100}%` }} />}</span>
                  </td>
                  <td>{v ? `${Math.round(avg(v) * 100)}% · ${v.length} answered` : 'not yet tested'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h2 className="section-title">Suggested revisits</h2>
        {weakLessons.length === 0 && weakSkills.length === 0 ? (
          <p className="ui">No weak spots in what you have attempted so far. Widen the net: try a quiz from a module you have not tested.</p>
        ) : (
          <ul className="ruled">
            {weakLessons.map(([l, v]) => {
              const lessonChecks = allChecks.filter((c) => c.lesson === l && checks[c.id] && checks[c.id].score < 0.65);
              const skills = [...new Set(lessonChecks.map((c) => c.skill))];
              return (
                <li key={l}>
                  <Link to={`/lesson/${l}`} className="entry-title">
                    {lessonById.get(l)?.title}
                  </Link>
                  <p className="meta">
                    {Math.round(avg(v) * 100)}% on {v.length} checks · weakest: {skills.map((s) => SKILL_LABEL[s]).join(', ') || '—'}
                  </p>
                  <p className="ui small">
                    {skills
                      .filter((s) => SECTION_FOR[s])
                      .map((s) => (
                        <Link key={s} to={`/lesson/${l}#${SECTION_FOR[s]}`} className="revisit-link">
                          Reread the {SECTION_FOR[s]} section
                        </Link>
                      ))}
                  </p>
                </li>
              );
            })}
            {weakSkills.map(([sk]) => (
              <li key={sk}>
                <strong>{SKILL_LABEL[sk]}</strong>
                <p className="ui small muted">
                  {sk === 'chronology' && 'Use the Timeline with “Key events only” and practise ordering events within each module.'}
                  {sk === 'causation' && 'On the Timeline, select key events and follow the arrows to their causes and consequences; then write a three-step causal chain.'}
                  {sk === 'source' && 'Work through the “Analyse this source” exercises in Sources, starting with documents rather than histories.'}
                  {sk === 'interpretation' && 'Read a Debate page and complete “Weigh the evidence”, noting why historians read the same evidence differently.'}
                  {sk === 'recall' && 'Run a daily flashcard session; recall is the foundation the other skills build on.'}
                  {sk === 'comparison' && 'Open a Comparison and write the exam-practice paragraph before reading the model.'}
                  {sk === 'argument' && 'Plan an essay: thesis, three steps, counter-argument. Then compare with the guidance.'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <aside>
        <section className="side-block">
          <h3>Quiz history</h3>
          {runs.length === 0 ? (
            <p className="ui small muted">No quizzes taken yet.</p>
          ) : (
            <ul className="ruled tight ui">
              {[...runs]
                .reverse()
                .slice(0, 12)
                .map((r, i) => (
                  <li key={i}>
                    {quizById.get(r.quiz)?.title}: {Math.round((r.score / r.total) * 100)}%{' '}
                    <span className="meta">{new Date(r.at).toLocaleDateString('en-GB')}</span>
                  </li>
                ))}
            </ul>
          )}
        </section>
        <section className="side-block">
          <h3>Coverage</h3>
          <p className="ui small">
            You have answered checks from {byLesson.size} of {orderedLessons.length} lessons.
          </p>
        </section>
      </aside>
    </div>
  );
}
