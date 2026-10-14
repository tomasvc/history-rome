import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, type SimulationNodeDatum } from 'd3-force';
import { figureById, figures, formatLife, relationEdges, stemmata } from '../data';
import { astro, formatYear } from '../lib/dates';
import type { Figure, RelationType } from '../types';
import { StemmaView } from '../components/Stemma';
import './people.css';

/** Stable pseudo-random number in [0, 1) from a string. */
const jitter = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
};


const CATEGORY: Record<Figure['category'], string> = {
  ruler: 'Rulers',
  politician: 'Politicians',
  general: 'Generals',
  writer: 'Writers and thinkers',
  woman: 'Women of power',
  religious: 'Religious figures',
  foreign: 'Rome’s neighbours',
  jurist: 'Jurists',
  other: 'Others',
};
const ERAS: { id: string; label: string; range: [number, number] }[] = [
  { id: 'all', label: 'All periods', range: [-800, 1500] },
  { id: 'rep', label: 'Republic', range: [-800, -44] },
  { id: 'aug', label: 'Augustus to the Severans', range: [-63, 235] },
  { id: 'late', label: 'Late empire', range: [200, 500] },
  { id: 'east', label: 'East Rome', range: [480, 1500] },
];
const lifeRange = (f: Figure): [number, number] | null => {
  const a = f.born?.from ?? f.floruit?.from ?? (f.died ? f.died.from - 50 : undefined);
  const b = f.died?.to ?? f.died?.from ?? f.floruit?.to ?? (a !== undefined ? a + 50 : undefined);
  return a !== undefined && b !== undefined ? [a, b] : null;
};

export default function PeoplePage() {
  const [params, setParams] = useSearchParams();
  const view = (params.get('view') as 'list' | 'lives' | 'network' | 'trees') ?? 'list';
  const [cat, setCat] = useState<string>('all');
  const [era, setEra] = useState('all');
  const [q, setQ] = useState('');
  const setView = (v: string) => {
    const n = new URLSearchParams(params);
    n.set('view', v);
    setParams(n, { replace: true });
  };
  const range = ERAS.find((e) => e.id === era)!.range;
  const list = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return figures
      .filter((f) => cat === 'all' || f.category === cat)
      .filter((f) => {
        const r = lifeRange(f);
        return !r || (r[1] >= range[0] && r[0] <= range[1]);
      })
      .filter((f) => !qq || f.name.toLowerCase().includes(qq) || (f.full ?? '').toLowerCase().includes(qq) || f.roles.join(' ').toLowerCase().includes(qq))
      .sort((a, b) => (lifeRange(a)?.[0] ?? 0) - (lifeRange(b)?.[0] ?? 0));
  }, [cat, range, q]);

  return (
    <div className="page people-page">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Prosopography</p>
          <h1>People</h1>
          <p className="lede">
            Emperors, politicians, generals, writers and the women whose influence ancient authors resented. Each profile separates what contemporary
            evidence shows from later tradition.
          </p>
        </header>
        <div className="tabs" role="tablist" aria-label="People views">
          {[
            ['list', 'Profiles'],
            ['lives', 'Lifespans'],
            ['network', 'Network'],
            ['trees', 'Family trees'],
          ].map(([v, l]) => (
            <button key={v} role="tab" aria-selected={view === v} className="tab" onClick={() => setView(v)}>
              {l}
            </button>
          ))}
        </div>
        {view !== 'trees' && (
          <div className="toolbar people-filters">
            <label className="group">
              <span className="group-label">Role</span>
              <select value={cat} onChange={(e) => setCat(e.target.value)}>
                <option value="all">Everyone</option>
                {Object.entries(CATEGORY).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <div className="group" role="group" aria-label="Period">
              {ERAS.map((e) => (
                <button key={e.id} className="chip" aria-pressed={era === e.id} onClick={() => setEra(e.id)}>
                  {e.label}
                </button>
              ))}
            </div>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a person" aria-label="Find a person" />
            <span className="faint">{list.length} people</span>
          </div>
        )}
        {view === 'list' && <ProfileList list={list} />}
        {view === 'lives' && <Lifespans list={list} />}
        {view === 'network' && <Network list={list} />}
        {view === 'trees' && <Trees />}
      </div>
    </div>
  );
}

function ProfileList({ list }: { list: Figure[] }) {
  if (!list.length) return <p className="empty">No one matches these filters. Try “All periods” or clear the search.</p>;
  return (
    <ul className="profile-list">
      {list.map((f) => (
        <li key={f.id}>
          <Link to={`/people/${f.id}`} className="entry-title">
            {f.name}
          </Link>
          <span className="meta">
            {formatLife(f)} · {f.roles.slice(0, 2).join(', ')}
          </span>
          <p>{f.summary.replace(/\[\[[a-z]+:[a-z0-9-]+\|([^\]]+)\]\]/g, '$1').replace(/\[\[[a-z]+:([a-z0-9-]+)\]\]/g, (_, x: string) => figureById.get(x)?.name ?? x).replace(/\*/g, '')}</p>
        </li>
      ))}
    </ul>
  );
}

function Lifespans({ list }: { list: Figure[] }) {
  const rows = list.map((f) => ({ f, r: lifeRange(f) })).filter((x): x is { f: Figure; r: [number, number] } => Boolean(x.r));
  if (!rows.length) return <p className="empty">No lifespans to show.</p>;
  const lo = Math.min(...rows.map((x) => x.r[0]));
  const hi = Math.max(...rows.map((x) => x.r[1]));
  const pad = Math.max(5, (hi - lo) * 0.03);
  const a0 = astro(lo - pad);
  const a1 = astro(hi + pad);
  const X = (y: number) => ((astro(y) - a0) / (a1 - a0)) * 100;
  const step = hi - lo > 1000 ? 200 : hi - lo > 400 ? 100 : hi - lo > 150 ? 50 : 25;
  const ticks: number[] = [];
  for (let y = Math.ceil((lo - pad) / step) * step; y <= hi + pad; y += step) if (y !== 0) ticks.push(y);
  return (
    <div className="lives">
      <p className="ui small muted">
        Bars run from birth to death (hatched where a date is approximate). Look for overlaps: who could have known whom, and who outlived whom.
      </p>
      <div className="lives-axis" aria-hidden="true">
        {ticks.map((y) => (
          <span key={y} style={{ left: `${X(y)}%` }}>
            {formatYear(y)}
          </span>
        ))}
      </div>
      <ol className="lives-rows">
        {rows.map(({ f, r }) => {
          const approx = f.born?.circa || f.died?.circa || !f.born;
          return (
            <li key={f.id}>
              <Link to={`/people/${f.id}`} className="lives-name">
                {f.name}
              </Link>
              <span className="lives-track">
                {ticks.map((y) => (
                  <span key={y} className="lives-grid" style={{ left: `${X(y)}%` }} />
                ))}
                <span
                  className={`lives-bar cat-${f.category} ${approx ? 'approx' : ''}`}
                  style={{ left: `${X(r[0])}%`, width: `${Math.max(0.5, X(r[1]) - X(r[0]))}%` }}
                  title={`${f.name}: ${formatLife(f)}`}
                />
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const REL_STYLE: Partial<Record<RelationType, string>> = {
  parent: 'fam',
  spouse: 'fam',
  'adoptive-parent': 'adopt',
  sibling: 'fam',
  ally: 'ally',
  rival: 'rival',
  killed: 'rival',
  patron: 'patron',
  teacher: 'patron',
  successor: 'succ',
  colleague: 'ally',
  'other-family': 'fam',
};

interface N extends SimulationNodeDatum {
  id: string;
  f: Figure;
  deg: number;
}

function Network({ list }: { list: Figure[] }) {
  const [kinds, setKinds] = useState<Set<string>>(new Set(['fam', 'adopt', 'ally', 'rival', 'patron', 'succ']));
  const [focus, setFocus] = useState<string | null>(null);
  const ids = useMemo(() => new Set(list.map((f) => f.id)), [list]);
  const edges = useMemo(() => relationEdges.filter((e) => ids.has(e.a) && ids.has(e.b) && kinds.has(REL_STYLE[e.type] ?? 'ally')), [ids, kinds]);
  const W = 960;
  const H = 760;
  // Layout is computed once per filter, synchronously, with a deterministic jitter so the graph looks the same on every visit.
  const nodes = useMemo(() => {
    const deg = new Map<string, number>();
    edges.forEach((e) => {
      deg.set(e.a, (deg.get(e.a) ?? 0) + 1);
      deg.set(e.b, (deg.get(e.b) ?? 0) + 1);
    });
    const connected = list.filter((f) => deg.has(f.id));
    const yr = (f: Figure) => lifeRange(f)?.[0] ?? 0;
    const ys = connected.map(yr);
    const lo = Math.min(...ys);
    const hi = Math.max(...ys);
    const ns: N[] = connected.map((f) => ({ id: f.id, f, deg: deg.get(f.id) ?? 0, x: 60 + ((yr(f) - lo) / Math.max(1, hi - lo)) * (W - 120), y: H / 2 + (jitter(f.id) - 0.5) * 200 }));
    const links = edges.map((e) => ({ source: e.a, target: e.b }));
    const sim = forceSimulation<N>(ns)
      .force('link', forceLink<N, { source: string; target: string }>(links).id((d) => d.id).distance(70).strength(0.5))
      .force('charge', forceManyBody().strength(-160))
      .force('x', forceX<N>((d) => 60 + ((yr(d.f) - lo) / Math.max(1, hi - lo)) * (W - 120)).strength(0.25))
      .force('y', forceY(H / 2).strength(0.1))
      .force('collide', forceCollide(26))
      .stop();
    // Keep nodes inside the frame on every tick, so crowded periods spread out instead of piling up at the edge.
    const bound = () =>
      ns.forEach((n) => {
        const half = 12 + n.f.name.length * 3.3; // labels are centred on the node
        n.x = Math.max(half, Math.min(W - half, n.x ?? 0));
        n.y = Math.max(30, Math.min(H - 24, n.y ?? 0));
      });
    for (let i = 0; i < 320; i++) {
      sim.tick();
      bound();
    }
    return ns;
  }, [edges, list]);

  const pos = new Map(nodes.map((n) => [n.id, n]));
  const focusSet = focus ? new Set([focus, ...edges.filter((e) => e.a === focus || e.b === focus).flatMap((e) => [e.a, e.b])]) : null;
  const toggle = (k: string) => {
    const n = new Set(kinds);
    if (n.has(k)) n.delete(k);
    else n.add(k);
    setKinds(n);
  };
  return (
    <div className="network">
      <div className="toolbar">
        <div className="group" role="group" aria-label="Relationship types">
          <span className="group-label">Show</span>
          {[
            ['fam', 'Family and marriage'],
            ['adopt', 'Adoption'],
            ['ally', 'Alliance'],
            ['rival', 'Rivalry and violence'],
            ['patron', 'Patronage and teaching'],
            ['succ', 'Succession'],
          ].map(([k, l]) => (
            <button key={k} className="chip" aria-pressed={kinds.has(k)} onClick={() => toggle(k)}>
              <span className={`swatch net-sw-${k}`} />
              {l}
            </button>
          ))}
        </div>
      </div>
      <p className="ui small muted">People are placed roughly left to right by date of birth. Select a name to highlight its connections; select again to open the profile.</p>
      <div className="network-box">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Network of relationships between historical figures">
          {edges.map((e, i) => {
            const a = pos.get(e.a);
            const b = pos.get(e.b);
            if (!a || !b) return null;
            const dim = focusSet && !(focusSet.has(e.a) && focusSet.has(e.b));
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={`net-edge net-${REL_STYLE[e.type] ?? 'ally'} ${dim ? 'dim' : ''}`} />;
          })}
          {nodes.map((n) => {
            const dim = focusSet && !focusSet.has(n.id);
            return (
              <g key={n.id} transform={`translate(${n.x},${n.y})`} className={`net-node cat-${n.f.category} ${dim ? 'dim' : ''} ${focus === n.id ? 'focus' : ''}`}>
                <circle r={4 + Math.min(8, n.deg)} />
                <text y={-8 - Math.min(8, n.deg)} textAnchor="middle">
                  {n.f.name}
                </text>
              </g>
            );
          })}
        </svg>
        <ul className="network-a11y">
          {nodes.map((n) => (
            <li key={n.id}>
              <button
                className="sr-only-focusable"
                onClick={() => setFocus(focus === n.id ? null : n.id)}
                aria-pressed={focus === n.id}
                style={{ position: 'absolute', left: `${((n.x ?? 0) / W) * 100}%`, top: `${((n.y ?? 0) / H) * 100}%` }}
              >
                {n.f.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {focus && figureById.get(focus) && (
        <div className="network-focus ui">
          <strong>{figureById.get(focus)!.name}</strong>: {edges.filter((e) => e.a === focus || e.b === focus).length} connections shown.{' '}
          <Link to={`/people/${focus}`}>Open profile</Link>
          <ul>
            {edges
              .filter((e) => e.a === focus || e.b === focus)
              .map((e, i) => {
                const other = e.a === focus ? e.b : e.a;
                return (
                  <li key={i}>
                    {e.a === focus ? `${e.label}: ` : `${figureById.get(e.a)?.name} → `}
                    <button className="linklike" onClick={() => setFocus(other)}>
                      {figureById.get(other)?.name}
                    </button>
                    {e.note ? ` (${e.note})` : ''}
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
}

function Trees() {
  const [params, setParams] = useSearchParams();
  const id = params.get('tree') ?? stemmata[0]?.id;
  const setId = (t: string) => {
    const n = new URLSearchParams(params);
    n.set('tree', t);
    setParams(n, { replace: true });
  };
  const s = stemmata.find((x) => x.id === id);
  if (!stemmata.length) return <p className="empty">No family trees yet.</p>;
  return (
    <div className="trees">
      <div className="toolbar">
        <div className="group" role="group" aria-label="Family tree">
          {stemmata.map((x) => (
            <button key={x.id} className="chip" aria-pressed={x.id === id} onClick={() => setId(x.id)}>
              {x.title}
            </button>
          ))}
        </div>
      </div>
      {s && <StemmaView s={s} />}
    </div>
  );
}
