import { Link } from 'react-router-dom';
import { curriculum, debates, lessonById, orderedLessons, sources, flashcards, partOfLesson, scenarios } from '../data';
import { SpanRibbon } from '../components/SpanRibbon';
import { Rich } from '../components/Markup';
import { SourceGlyph } from '../components/Glyphs';
import { useStudy } from '../lib/store';
import { isDue } from '../lib/srs';
import { formatDate, formatSpan } from '../lib/dates';

const dayOfYear = () => Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);

const WAYS = [
  {
    to: '/course',
    title: 'Chronologically',
    text: 'Follow the course from the earliest settlement on the Palatine to the Ottoman siege of 1453, lesson by lesson.',
    example: { to: '/lesson/origins', label: 'Begin with the origins of Rome' },
  },
  {
    to: '/course#p5',
    title: 'Thematically',
    text: 'Study slavery, law, religion, gender, the army or the economy across the whole span.',
    example: { to: '/lesson/slavery-freedpeople', label: 'Slaves and freedpeople' },
  },
  {
    to: '/atlas',
    title: 'Geographically',
    text: 'Watch territory expand and contract, and explore provinces, frontiers, roads and battlefields.',
    example: { to: '/atlas?snapshot=117', label: 'The empire in AD 117' },
  },
  {
    to: '/people',
    title: 'Biographically',
    text: 'Read lives of emperors, generals, writers and women, with family trees and networks.',
    example: { to: '/people/cicero', label: 'Cicero' },
  },
  {
    to: '/sources',
    title: 'As a historian',
    text: 'Read inscriptions, coins, laws and histories in translation, and weigh the debates they feed.',
    example: { to: '/debates', label: 'Where historians disagree' },
  },
];

export default function Home() {
  const progress = useStudy((s) => s.progress);
  const cards = useStudy((s) => s.cards);
  const recent = useStudy((s) => s.recent);
  const completed = orderedLessons.filter((l) => progress[l.id]?.completed);
  const nextLesson = orderedLessons.find((l) => !progress[l.id]?.completed && l.status === 'complete') ?? orderedLessons[0];
  const lastLesson = recent.find((r) => r.kind === 'lesson');
  const continueLesson = lastLesson && !progress[lastLesson.id]?.completed ? lessonById.get(lastLesson.id) : nextLesson;
  const started = Object.keys(progress).length > 0;
  const due = flashcards.filter((c) => cards[c.id] && isDue(cards[c.id])).length;

  const d = dayOfYear();
  const debate = debates.length ? debates[d % debates.length] : undefined;
  const source = sources.length ? sources[(d * 7) % sources.length] : undefined;
  const scenario = scenarios.length ? scenarios[(d * 3) % scenarios.length] : undefined;
  const lessonCount = orderedLessons.filter((l) => l.status === 'complete').length;

  return (
    <div className="home">
      <section className="hero">
        <div className="wrap">
          <div className="hero-text">
            <h1 className="hero-title">From a hilltop village on the Tiber to the walls of Constantinople</h1>
            <p className="hero-lede">
              A university-level course in Roman history across twenty-two centuries. Read substantial lessons, test their claims against ancient
              evidence, trace causes across the timeline and atlas, and argue with the historians who disagree.
            </p>
            <div className="row hero-actions">
              {continueLesson && (
                <Link className="btn primary" to={`/lesson/${continueLesson.id}`}>
                  {started ? `Continue: ${continueLesson.title}` : 'Start the first lesson'}
                </Link>
              )}
              <Link className="btn" to="/course">
                See the syllabus
              </Link>
            </div>
          </div>
          <div className="hero-span">
            <SpanRibbon
              size="large"
              linkPeriods
              progress={completed.map((l) => l.span)}
            />
            <p className="hero-span-note ui">
              Conventional periods, drawn to scale. Select one to open it on the timeline.
              {completed.length > 0 && ` Shaded marks show the ${completed.length} lesson${completed.length === 1 ? '' : 's'} you have completed.`} The Eastern
              empire outlived the last western emperor by 977 years.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap ways" aria-labelledby="ways-h">
        <h2 id="ways-h" className="section-title">
          Five ways in
        </h2>
        <ol className="ways-list">
          {WAYS.map((w) => (
            <li key={w.title}>
              <Link to={w.to} className="ways-title">
                {w.title}
              </Link>
              <p>{w.text}</p>
              <Link to={w.example.to} className="ui small">
                {w.example.label}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {started && (
        <section className="wrap home-study" aria-labelledby="study-h">
          <h2 id="study-h" className="section-title">
            Your study
          </h2>
          <div className="home-study-grid ui">
            <p>
              <strong className="stat">{completed.length}</strong> of {lessonCount} lessons completed.{' '}
              <Link to="/study">Open your study record</Link>
            </p>
            <p>
              <strong className="stat">{due}</strong> flashcard{due === 1 ? '' : 's'} due for review. <Link to="/revise/cards">Review now</Link>
            </p>
            {recent.slice(0, 1).map((r) => (
              <p key={r.id}>
                Last opened: <Link to={r.kind === 'lesson' ? `/lesson/${r.id}` : '/study'}>{r.title}</Link>
              </p>
            ))}
          </div>
        </section>
      )}

      <section className="wrap home-feature" aria-label="Today's study prompts">
        {debate && (
          <article className="feature feature-debate">
            <h2 className="feature-label">An argument to have today</h2>
            <Link to={`/debates/${debate.id}`} className="feature-title">
              {debate.question}
            </Link>
            <p className="muted">{debate.why.split('. ')[0]}.</p>
            <ul className="feature-positions">
              {debate.positions.slice(0, 3).map((p) => (
                <li key={p.id}>
                  <strong>{p.label}:</strong> {p.proponents.map((x) => x.name).slice(0, 2).join(', ')}
                </li>
              ))}
            </ul>
          </article>
        )}
        {source && (
          <article className="feature feature-source">
            <h2 className="feature-label">A source to read</h2>
            <div className="row">
              <SourceGlyph kind={source.kind} />
              <div>
                <Link to={`/sources/${source.id}`} className="feature-title">
                  {source.title}
                </Link>
                <div className="meta">
                  {source.citation} · {formatDate(source.date)}
                </div>
              </div>
            </div>
            <blockquote className="feature-quote">
              <Rich text={source.translation[0].slice(0, 300) + (source.translation[0].length > 300 ? '…' : '')} />
            </blockquote>
          </article>
        )}
        {scenario && (
          <article className="feature feature-scenario">
            <h2 className="feature-label">A decision to make</h2>
            <Link to={`/scenarios/${scenario.id}`} className="feature-title">
              {scenario.title}
            </Link>
            <p className="meta">
              {scenario.role} · {scenario.date}
            </p>
            <p className="muted">{scenario.summary}</p>
          </article>
        )}
      </section>

      <section className="wrap home-parts" aria-labelledby="parts-h">
        <h2 id="parts-h" className="section-title">
          The course in five parts
        </h2>
        <ol className="parts-strip">
          {curriculum.parts.map((p) => {
            const ls = p.modules.flatMap((m) => curriculum.modules.find((x) => x.id === m)?.lessons ?? []);
            const done = ls.filter((l) => progress[l]?.completed).length;
            return (
              <li key={p.id} className={`fresco tone-${p.tone}`}>
                <Link to={`/course#${p.id}`} className="fresco-inner">
                  <span className="part-numeral">{p.numeral}</span>
                  <span className="part-title">{p.title}</span>
                  <span className="part-span">{p.id === 'p5' ? p.subtitle : formatSpan(p.span[0], p.span[1])}</span>
                  <span className="part-count">
                    {ls.length} lessons{done ? ` · ${done} done` : ''}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
        {nextLesson && (
          <p className="ui muted small">
            Suggested next: <Link to={`/lesson/${nextLesson.id}`}>{nextLesson.title}</Link> ({partOfLesson(nextLesson.id)?.title})
          </p>
        )}
      </section>
    </div>
  );
}
