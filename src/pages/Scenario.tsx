import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { lessonById, scenarioById, sourceById } from '../data';
import { update, visit } from '../lib/store';
import { Rich } from '../components/Markup';
import type { Scenario, ScenarioChoice } from '../types';
import NotFound from './NotFound';
import './scenarios.css';

interface Step {
  node: string;
  choice: number;
}

export default function ScenarioPage() {
  const { id = '' } = useParams();
  const s = scenarioById.get(id);
  useEffect(() => {
    if (s) visit({ kind: 'scenario', id: s.id, title: s.title });
  }, [s]);
  if (!s) return <NotFound />;
  return <Runner key={s.id} s={s} />;
}

function Runner({ s }: { s: Scenario }) {
  const [started, setStarted] = useState(false);
  const [nodeId, setNodeId] = useState(s.start);
  const [path, setPath] = useState<Step[]>([]);
  const [pending, setPending] = useState<ScenarioChoice | null>(null);
  const [stakes, setStakes] = useState<Record<string, number>>(() => Object.fromEntries(s.stakes.map((k) => [k.id, k.start])));
  const [delta, setDelta] = useState<Record<string, number>>({});
  const node = s.nodes.find((n) => n.id === nodeId)!;

  const choose = (c: ScenarioChoice, i: number) => {
    setPending(c);
    setPath([...path, { node: nodeId, choice: i }]);
    const next = { ...stakes };
    const d: Record<string, number> = {};
    for (const [k, v] of Object.entries(c.effects ?? {})) {
      next[k] = Math.max(0, Math.min(100, (next[k] ?? 50) + v));
      d[k] = v;
    }
    setStakes(next);
    setDelta(d);
  };
  const proceed = () => {
    if (!pending) return;
    const nextNode = s.nodes.find((n) => n.id === pending.next);
    setNodeId(pending.next);
    setPending(null);
    setDelta({});
    if (nextNode?.end) {
      update((st) => {
        st.scenarioRuns = [...st.scenarioRuns, { id: s.id, at: Date.now(), path: [...path.map((p) => `${p.node}:${p.choice}`)], ending: nextNode.id }].slice(-100);
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const restart = () => {
    setStarted(false);
    setNodeId(s.start);
    setPath([]);
    setPending(null);
    setStakes(Object.fromEntries(s.stakes.map((k) => [k.id, k.start])));
    setDelta({});
  };

  return (
    <div className="page scenario-page">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">
            <Link to="/scenarios">Scenarios</Link> · {s.date}
          </p>
          <h1>{s.title}</h1>
          <p className="lede">You are {s.role}.</p>
        </header>
        <div className="scenario-layout">
          <div className="scenario-main">
            {!started ? (
              <section className="scenario-brief">
                <h2>Briefing</h2>
                <Rich text={s.briefing} />
                <aside className="sim-note ui">
                  This is an educational simulation. Choices and consequences are reconstructed from what we know of the period and the people involved;
                  where your path departs from history, the outcome is a plausible inference, not a fact. The debrief at the end sets out what really
                  happened and the evidence for it.
                </aside>
                <button className="btn primary" onClick={() => setStarted(true)}>
                  Begin
                </button>
              </section>
            ) : (
              <section className={`scenario-node ${node.end ? 'end' : ''}`} aria-live="polite">
                {node.date && <p className="kicker">{node.date}</p>}
                <h2>{node.title}</h2>
                <Rich text={node.text} />
                {!node.end && !pending && node.choices && (
                  <ol className="choices">
                    {node.choices.map((c, i) => (
                      <li key={i}>
                        <button className="choice" onClick={() => choose(c, i)}>
                          <span className="choice-label">{c.label}</span>
                          {c.detail && <span className="choice-detail">{c.detail}</span>}
                        </button>
                      </li>
                    ))}
                  </ol>
                )}
                {pending && (
                  <div className="outcome">
                    <p className={`path-kind ui ${pending.historical ? 'historical' : 'counterfactual'}`}>
                      {pending.historical ? 'This is what happened' : 'Counterfactual: a plausible inference, not a recorded event'}
                    </p>
                    <h3>What follows</h3>
                    <Rich text={pending.outcome} />
                    <button className="btn primary" onClick={proceed}>
                      Continue
                    </button>
                  </div>
                )}
                {node.end && (
                  <div className="debrief">
                    <h3>What actually happened</h3>
                    <Rich text={s.history} />
                    <h3>Why this was hard</h3>
                    <ul>
                      {s.debrief.map((d) => (
                        <li key={d}>
                          <Rich text={d} inline />
                        </li>
                      ))}
                    </ul>
                    <h3>Your path</h3>
                    <ol className="path-list ui">
                      {path.map((p, i) => {
                        const n = s.nodes.find((x) => x.id === p.node);
                        return (
                          <li key={i}>
                            {n?.title}: <strong>{n?.choices?.[p.choice]?.label}</strong>{' '}
                            <span className="path-tag">{n?.choices?.[p.choice]?.historical ? '(historical)' : '(counterfactual)'}</span>
                          </li>
                        );
                      })}
                    </ol>
                    <div className="row">
                      <button className="btn" onClick={restart}>
                        Play again with different choices
                      </button>
                      <Link className="btn ghost" to="/scenarios">
                        All scenarios
                      </Link>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
          <aside className="scenario-side">
            <h2 className="ui-h">Pressures on you</h2>
            <ul className="stakes">
              {s.stakes.map((k) => (
                <li key={k.id} title={k.note}>
                  <div className="stake-head ui">
                    <span>{k.label}</span>
                    {delta[k.id] ? <span className={`stake-delta ${delta[k.id] > 0 ? 'up' : 'down'}`}>{delta[k.id] > 0 ? `+${delta[k.id]}` : delta[k.id]}</span> : null}
                  </div>
                  <div className="stake-bar" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={stakes[k.id]} aria-label={k.label}>
                    <span style={{ width: `${stakes[k.id]}%` }} />
                  </div>
                  <p className="stake-note">{k.note}</p>
                </li>
              ))}
            </ul>
            <p className="ui small faint">These gauges are a simplification to make trade-offs visible; Romans did not think in scores.</p>
            {s.sources && s.sources.length > 0 && (
              <section className="side-block">
                <h3>Evidence behind the scenario</h3>
                <ul className="ruled tight ui">
                  {s.sources
                    .filter((x) => sourceById.has(x))
                    .map((x) => (
                      <li key={x}>
                        <Link to={`/sources/${x}`}>{sourceById.get(x)!.title}</Link>
                      </li>
                    ))}
                </ul>
              </section>
            )}
            {s.lessons && s.lessons.length > 0 && (
              <section className="side-block">
                <h3>Background lessons</h3>
                <ul className="ruled tight ui">
                  {s.lessons.map((l) => (
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
