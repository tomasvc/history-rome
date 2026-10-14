import { Link } from 'react-router-dom';
import { scenarios } from '../data';
import { useStudy } from '../lib/store';
import './scenarios.css';

export default function ScenariosPage() {
  const runs = useStudy((s) => s.scenarioRuns);
  const sorted = [...scenarios].sort((a, b) => a.span[0] - b.span[0]);
  return (
    <div className="page scenarios-page">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Historical simulations</p>
          <h1>Scenarios</h1>
          <p className="lede">
            Real dilemmas, faced with the information available at the time. Choose as a Roman might have, see the plausible consequences, then compare
            your path with what actually happened. The simulations are teaching devices: their outcomes are reasoned reconstructions, not history.
          </p>
        </header>
        <ol className="scenario-list">
          {sorted.map((s) => {
            const done = runs.filter((r) => r.id === s.id).length;
            return (
              <li key={s.id}>
                <span className="scenario-date">{s.date}</span>
                <div>
                  <Link to={`/scenarios/${s.id}`} className="entry-title">
                    {s.title}
                  </Link>
                  <p className="meta">You are: {s.role}</p>
                  <p>{s.summary}</p>
                  {done > 0 && <p className="ui small faint">Played {done} time{done > 1 ? 's' : ''}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
