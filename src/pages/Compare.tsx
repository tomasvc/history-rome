import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { comparisonById, comparisons, figureById, lessonById } from '../data';
import { Rich } from '../components/Markup';
import { NoteBox } from '../components/StudyTools';
import './compare.css';

export default function ComparePage() {
  const { id } = useParams();
  const nav = useNavigate();
  const c = id ? comparisonById.get(id) : undefined;
  // View state belongs to one comparison and resets when another is opened.
  type View = { id?: string; cols: string[]; showModel: boolean; openRow: number | null };
  const fresh = (): View => ({ id: c?.id, cols: c ? c.columns.slice(0, 3).map((x) => x.id) : [], showModel: false, openRow: null });
  const [view, setView] = useState<View>(fresh);
  const current = view.id === c?.id ? view : fresh();
  const { cols, showModel, openRow } = current;
  const setCols = (f: string[] | ((x: string[]) => string[])) => setView({ ...current, cols: typeof f === 'function' ? f(current.cols) : f });
  const setShowModel = (f: boolean | ((x: boolean) => boolean)) => setView({ ...current, showModel: typeof f === 'function' ? f(current.showModel) : f });
  const setOpenRow = (f: number | null | ((x: number | null) => number | null)) => setView({ ...current, openRow: typeof f === 'function' ? f(current.openRow) : f });

  if (!c) {
    return (
      <div className="page compare-page">
        <div className="wrap">
          <header className="page-head">
            <p className="kicker">Comparative history</p>
            <h1>Compare</h1>
            <p className="lede">
              Comparison is how historians test explanations: if a cause mattered in one case, what happened where it was absent? Choose a comparison to
              see rulers, systems and regions side by side, dimension by dimension.
            </p>
          </header>
          <ul className="compare-list">
            {comparisons.map((x) => (
              <li key={x.id}>
                <Link to={`/compare/${x.id}`} className="entry-title">
                  {x.title}
                </Link>
                <p className="muted">{x.question}</p>
                <p className="meta">{x.columns.map((col) => col.label).join(' · ')}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const visible = c.columns.filter((col) => cols.includes(col.id));
  return (
    <div className="page compare-page">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">
            <Link to="/compare">Compare</Link>
          </p>
          <h1>{c.title}</h1>
          <p className="lede">{c.question}</p>
        </header>
        <div className="toolbar compare-tools">
          <label className="group">
            <span className="group-label">Comparison</span>
            <select value={c.id} onChange={(e) => nav(`/compare/${e.target.value}`)}>
              {comparisons.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.title}
                </option>
              ))}
            </select>
          </label>
          {c.columns.length > 2 && (
            <div className="group" role="group" aria-label="Columns to show">
              <span className="group-label">Show</span>
              {c.columns.map((col) => (
                <button
                  key={col.id}
                  className="chip"
                  aria-pressed={cols.includes(col.id)}
                  onClick={() => setCols(cols.includes(col.id) ? (cols.length > 2 ? cols.filter((x) => x !== col.id) : cols) : [...cols, col.id])}
                >
                  {col.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="compare-scroll">
          <table className="compare-table" style={{ ['--cols' as string]: visible.length }}>
            <thead>
              <tr>
                <th scope="col" className="dim-col">
                  Dimension
                </th>
                {visible.map((col) => (
                  <th key={col.id} scope="col">
                    <span className="cmp-col-label">{col.figure && figureById.has(col.figure) ? <Link to={`/people/${col.figure}`}>{col.label}</Link> : col.label}</span>
                    {col.span && <span className="meta">{col.span}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r, i) => (
                <tr key={r.dimension}>
                  <th scope="row" className="dim-col">
                    {r.dimension}
                    {r.note && (
                      <button className="linklike ui small cmp-note-btn" aria-expanded={openRow === i} onClick={() => setOpenRow(openRow === i ? null : i)}>
                        {openRow === i ? 'Hide analysis' : 'Analysis'}
                      </button>
                    )}
                    {openRow === i && r.note && (
                      <div className="cmp-note">
                        <Rich text={r.note} />
                      </div>
                    )}
                  </th>
                  {visible.map((col) => (
                    <td key={col.id}>
                      <Rich text={r.cells[col.id] ?? '—'} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="split compare-bottom">
          <div>
            <h2 className="section-title">Synthesis</h2>
            <Rich text={c.synthesis} />
            <section className="compare-exam">
              <h2>Exam practice</h2>
              <p className="essay-q">{c.exam.prompt}</p>
              <NoteBox refItem={{ kind: 'comparison', id: c.id, title: c.title }} prompt="Write a comparative paragraph: claim, evidence from both sides, and a judgement." />
              {!showModel ? (
                <button className="btn small" onClick={() => setShowModel(true)}>
                  Show a model answer outline
                </button>
              ) : (
                <div className="ex-model">
                  <Rich text={c.exam.model} />
                </div>
              )}
            </section>
          </div>
          <aside>
            {c.lessons && c.lessons.length > 0 && (
              <section className="side-block">
                <h3>Lessons to revisit</h3>
                <ul className="ruled tight ui">
                  {c.lessons.map((l) => (
                    <li key={l}>
                      <Link to={`/lesson/${l}`}>{lessonById.get(l)?.title ?? l}</Link>
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
