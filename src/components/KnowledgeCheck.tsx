import { useMemo, useState } from 'react';
import type { Check, McqCheck, MatchCheck, OrderCheck, Skill, WrittenCheck } from '../types';
import { recordCheck, saveAnswer, useStudy } from '../lib/store';
import { Rich } from './Markup';
import { SourceCard } from './Embeds';

export const SKILL_LABEL: Record<Skill, string> = {
  recall: 'Knowledge',
  chronology: 'Chronology',
  causation: 'Causation',
  source: 'Source criticism',
  interpretation: 'Interpretation',
  comparison: 'Comparison',
  argument: 'Argument',
};

function seeded(id: string) {
  let h = 2166136261;
  for (const ch of id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}
export function shuffle<T>(xs: T[], seed: string): T[] {
  const r = seeded(seed);
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function KnowledgeCheck({ check, label = 'Check your understanding', onDone }: { check: Check; label?: string; onDone?: (score: number) => void }) {
  const prior = useStudy((s) => s.checks[check.id]);
  const done = (ok: boolean, score: number) => {
    recordCheck(check.id, { ok, score, skill: check.skill, lesson: check.lesson, module: check.module });
    onDone?.(score);
  };
  return (
    <section className={`kcheck kcheck-${check.type}`} aria-label={label}>
      <header className="kcheck-head">
        <span className="kcheck-label">{label}</span>
        <span className="kcheck-skill">{SKILL_LABEL[check.skill]}</span>
        {prior && (
          <span className="kcheck-prior" title="Your last attempt">
            Last: {Math.round(prior.score * 100)}%
          </span>
        )}
      </header>
      <div className="kcheck-prompt">
        <Rich text={check.prompt} />
      </div>
      {check.type === 'mcq' && <Mcq check={check} done={done} />}
      {check.type === 'order' && <Order check={check} done={done} />}
      {check.type === 'match' && <Match check={check} done={done} />}
      {(check.type === 'short' || check.type === 'source' || check.type === 'essay') && <Written check={check} done={done} />}
    </section>
  );
}

function Mcq({ check, done }: { check: McqCheck; done: (ok: boolean, s: number) => void }) {
  const options = useMemo(() => shuffle(check.options.map((o, i) => ({ ...o, i })), check.id), [check]);
  const multi = check.options.filter((o) => o.correct).length > 1;
  const [picked, setPicked] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const toggle = (i: number) => {
    if (submitted) return;
    setPicked((p) => (multi ? (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]) : [i]));
  };
  const submit = () => {
    const correct = check.options.map((o, i) => (o.correct ? i : -1)).filter((i) => i >= 0);
    const ok = correct.length === picked.length && correct.every((c) => picked.includes(c));
    setSubmitted(true);
    done(ok, ok ? 1 : 0);
  };
  const ok = submitted && check.options.every((o, i) => Boolean(o.correct) === picked.includes(i));
  return (
    <div>
      {multi && <p className="ui faint">Select all that apply.</p>}
      <ul className="mcq-options" role={multi ? 'group' : 'radiogroup'}>
        {options.map((o) => {
          const chosen = picked.includes(o.i);
          const state = submitted ? (o.correct ? 'right' : chosen ? 'wrong' : 'other') : chosen ? 'chosen' : '';
          return (
            <li key={o.i} className={`mcq-option ${state}`}>
              <button
                type="button"
                role={multi ? 'checkbox' : 'radio'}
                aria-checked={chosen}
                onClick={() => toggle(o.i)}
                disabled={submitted}
                className="mcq-button"
              >
                <span className="mcq-mark" aria-hidden="true" />
                <span className="mcq-text">
                  <Rich text={o.text} inline />
                </span>
              </button>
              {submitted && (o.correct || chosen) && (
                <div className="mcq-why">
                  <strong>{o.correct ? 'Correct.' : 'Not quite.'}</strong> <Rich text={o.why} inline />
                </div>
              )}
              {submitted && !o.correct && !chosen && (
                <details className="mcq-why-other">
                  <summary>Why not this one?</summary>
                  <Rich text={o.why} inline />
                </details>
              )}
            </li>
          );
        })}
      </ul>
      <div className="kcheck-actions">
        {!submitted ? (
          <button className="btn primary small" onClick={submit} disabled={!picked.length}>
            Check answer
          </button>
        ) : (
          <>
            <span className={`verdict ${ok ? 'good' : 'bad'}`} role="status">
              {ok ? 'Well reasoned.' : 'Review the explanations above.'}
            </span>
            <button
              className="btn ghost small"
              onClick={() => {
                setSubmitted(false);
                setPicked([]);
              }}
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Order({ check, done }: { check: OrderCheck; done: (ok: boolean, s: number) => void }) {
  const [items, setItems] = useState(() => {
    let s = shuffle(check.items, check.id);
    if (s.every((x, i) => x === check.items[i])) s = [...s.slice(1), s[0]];
    return s;
  });
  const [submitted, setSubmitted] = useState(false);
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  };
  const submit = () => {
    const right = items.filter((x, i) => x === check.items[i]).length;
    setSubmitted(true);
    done(right === items.length, right / items.length);
  };
  return (
    <div>
      <p className="ui faint">Arrange from earliest (top) to latest. Use the arrow buttons.</p>
      <ol className="order-list">
        {items.map((it, i) => {
          const correctPos = check.items.indexOf(it);
          const state = submitted ? (correctPos === i ? 'right' : 'wrong') : '';
          return (
            <li key={it} className={`order-item ${state}`}>
              <span className="order-text">
                <Rich text={it} inline />
              </span>
              {!submitted ? (
                <span className="order-moves">
                  <button className="btn ghost small" aria-label="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                    ↑
                  </button>
                  <button className="btn ghost small" aria-label="Move down" onClick={() => move(i, 1)} disabled={i === items.length - 1}>
                    ↓
                  </button>
                </span>
              ) : (
                state === 'wrong' && <span className="order-hint">belongs in position {correctPos + 1}</span>
              )}
            </li>
          );
        })}
      </ol>
      <div className="kcheck-actions">
        {!submitted ? (
          <button className="btn primary small" onClick={submit}>
            Check order
          </button>
        ) : (
          <button className="btn ghost small" onClick={() => setSubmitted(false)}>
            Rearrange
          </button>
        )}
      </div>
      {submitted && (
        <div className="kcheck-explain">
          <Rich text={check.explain} />
        </div>
      )}
    </div>
  );
}

function Match({ check, done }: { check: MatchCheck; done: (ok: boolean, s: number) => void }) {
  const rights = useMemo(() => shuffle(check.pairs.map((p) => p.right), check.id + 'r'), [check]);
  const [chosen, setChosen] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const submit = () => {
    const right = check.pairs.filter((p, i) => chosen[i] === p.right).length;
    setSubmitted(true);
    done(right === check.pairs.length, right / check.pairs.length);
  };
  return (
    <div>
      <table className="match-table">
        <tbody>
          {check.pairs.map((p, i) => {
            const state = submitted ? (chosen[i] === p.right ? 'right' : 'wrong') : '';
            return (
              <tr key={i} className={state}>
                <th scope="row">
                  <Rich text={p.left} inline />
                </th>
                <td>
                  <select
                    aria-label={`Match for ${p.left.replace(/\[\[|\]\]|\{\{.*?\}\}/g, '')}`}
                    value={chosen[i] ?? ''}
                    disabled={submitted}
                    onChange={(e) => setChosen({ ...chosen, [i]: e.target.value })}
                  >
                    <option value="">Choose…</option>
                    {rights.map((r) => (
                      <option key={r} value={r}>
                        {r.replace(/\[\[[a-z]+:[a-z0-9-]+\|([^\]]+)\]\]/g, '$1').replace(/\*/g, '')}
                      </option>
                    ))}
                  </select>
                  {submitted && state === 'wrong' && (
                    <div className="match-correct">
                      Answer: <Rich text={p.right} inline />
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="kcheck-actions">
        {!submitted ? (
          <button className="btn primary small" onClick={submit} disabled={Object.keys(chosen).length < check.pairs.length}>
            Check matches
          </button>
        ) : (
          <button className="btn ghost small" onClick={() => setSubmitted(false)}>
            Change answers
          </button>
        )}
      </div>
      {submitted && (
        <div className="kcheck-explain">
          <Rich text={check.explain} />
        </div>
      )}
    </div>
  );
}

function Written({ check, done }: { check: WrittenCheck; done: (ok: boolean, s: number) => void }) {
  const saved = useStudy((s) => s.answers[check.id] ?? '');
  const [text, setText] = useState(saved);
  const [revealed, setRevealed] = useState(false);
  const [ticks, setTicks] = useState<boolean[]>(() => check.rubric.map(() => false));
  const [scored, setScored] = useState(false);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (
    <div>
      {check.sourceId && <SourceCard id={check.sourceId} />}
      <label className="field">
        <span>Your answer {check.type === 'essay' ? '(plan or full paragraph)' : ''}</span>
        <textarea rows={check.type === 'essay' ? 8 : 5} value={text} onChange={(e) => setText(e.target.value)} onBlur={() => saveAnswer(check.id, text)} />
      </label>
      <div className="kcheck-actions">
        <span className="faint ui small">{words} words · saved in this browser</span>
        {!revealed && (
          <button
            className="btn primary small"
            onClick={() => {
              saveAnswer(check.id, text);
              setRevealed(true);
            }}
            disabled={words < 5}
          >
            Compare with a model answer
          </button>
        )}
      </div>
      {revealed && (
        <div className="model-answer">
          <h4>A strong answer would…</h4>
          <Rich text={check.model} />
          <fieldset className="rubric">
            <legend>Mark your own answer honestly. Did you…</legend>
            {check.rubric.map((r, i) => (
              <label key={i} className="rubric-item">
                <input
                  type="checkbox"
                  checked={ticks[i]}
                  disabled={scored}
                  onChange={(e) => setTicks(ticks.map((t, j) => (j === i ? e.target.checked : t)))}
                />
                <span>
                  <Rich text={r} inline />
                </span>
              </label>
            ))}
          </fieldset>
          {!scored ? (
            <button
              className="btn small"
              onClick={() => {
                const s = ticks.filter(Boolean).length / ticks.length;
                setScored(true);
                done(s >= 0.6, s);
              }}
            >
              Record self-assessment
            </button>
          ) : (
            <p className="verdict ui" role="status">
              Recorded: {ticks.filter(Boolean).length} of {ticks.length} criteria. Revise your answer above whenever you like.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
