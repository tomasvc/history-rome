import { Link } from 'react-router-dom';
import { debates } from '../data';
import { formatSpan } from '../lib/dates';
import { useStudy } from '../lib/store';
import { CertaintyKey } from '../components/Certainty';
import './debates.css';

export default function DebatesPage() {
  const positions = useStudy((s) => s.positions);
  const sorted = [...debates].sort((a, b) => a.span[0] - b.span[0]);
  return (
    <div className="page debates-page">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Historiography</p>
          <h1>Debates</h1>
          <p className="lede">
            Roman history is an argument conducted over two and a half centuries of modern scholarship. Each debate sets out the positions, the historians
            who hold them, the evidence each side relies on, and how the field has moved. Then it asks where you stand.
          </p>
        </header>
        <div className="split">
          <ol className="debate-list">
            {sorted.map((d) => {
              const mine = positions[d.id];
              const pos = mine ? d.positions.find((p) => p.id === String(mine.value)) : undefined;
              return (
                <li key={d.id}>
                  <span className="meta">{formatSpan(d.span[0], d.span[1])}</span>
                  <Link to={`/debates/${d.id}`} className="debate-list-q">
                    {d.question}
                  </Link>
                  <p className="debate-list-pos ui">
                    {d.positions.map((p) => p.label).join(' · ')}
                  </p>
                  {pos && <p className="ui small debate-mine">Your position: {pos.label}</p>}
                </li>
              );
            })}
          </ol>
          <aside>
            <section className="side-block">
              <h3>Reading a debate</h3>
              <p className="ui muted">
                Historians rarely disagree about everything. Notice where positions share evidence but weigh it differently, where a debate turns on a
                definition (what counts as “decline”?), and where new kinds of evidence (archaeology, ice cores, ancient DNA) have shifted the ground.
              </p>
              <CertaintyKey />
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
