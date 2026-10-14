import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { zoom as d3zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import 'd3-transition';
import { consequencesOf, eventById, events, figureById, lessonById, lessonsForEvent, placeById, sourceById } from '../data';
import { astro, formatDate, formatYear, fromAstro, PERIODS } from '../lib/dates';
import { THEMES, type HistEvent, type Theme } from '../types';
import { Rich } from '../components/Markup';
import { CertaintyBadge } from '../components/Certainty';
import { spanX } from '../components/SpanRibbon';
import './timeline.css';

const FULL: [number, number] = [-800, 1460];
const A0 = astro(FULL[0]);
const A1 = astro(FULL[1]);
const LANE_H = 58;
const TOP = 46;

const THEME_LABEL: Record<Theme, string> = {
  political: 'Political',
  military: 'Military',
  social: 'Social',
  cultural: 'Cultural',
  economic: 'Economic',
  religious: 'Religious',
  legal: 'Legal',
};

const PRESETS: { label: string; range: [number, number] }[] = [
  { label: 'The whole span', range: FULL },
  { label: 'Kings and early Republic', range: [-760, -260] },
  { label: 'Mediterranean conquest', range: [-270, -125] },
  { label: 'Fall of the Republic', range: [-140, -20] },
  { label: 'Augustus to Nero', range: [-50, 72] },
  { label: 'The high empire', range: [60, 200] },
  { label: 'The third century', range: [185, 310] },
  { label: 'Constantine to Theodosius', range: [300, 400] },
  { label: 'The end of the West', range: [370, 500] },
  { label: 'Justinian and Heraclius', range: [500, 650] },
  { label: 'Middle Byzantium', range: [630, 1210] },
  { label: 'The last centuries', range: [1190, 1460] },
];

function tickStep(span: number) {
  if (span > 1500) return 250;
  if (span > 700) return 100;
  if (span > 300) return 50;
  if (span > 120) return 25;
  if (span > 50) return 10;
  if (span > 20) return 5;
  if (span > 8) return 2;
  return 1;
}

export default function TimelinePage() {
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('event') ?? undefined;
  const selected = selectedId ? eventById.get(selectedId) : undefined;
  const [themes, setThemes] = useState<Set<Theme>>(new Set(THEMES));
  const [keyOnly, setKeyOnly] = useState(false);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'chart' | 'list'>('chart');
  const [width, setWidth] = useState(900);
  const [t, setT] = useState<ZoomTransform>(zoomIdentity);
  const [hover, setHover] = useState<HistEvent | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const base = useMemo(() => scaleLinear().domain([A0, A1]).range([0, width]), [width]);
  const x = useMemo(() => t.rescaleX(base), [t, base]);
  const [d0, d1] = x.domain();
  const span = d1 - d0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter(
      (e) => e.themes.some((th) => themes.has(th)) && (!keyOnly || e.weight === 3) && (!q || e.title.toLowerCase().includes(q) || e.summary.toLowerCase().includes(q)),
    );
  }, [themes, keyOnly, query]);
  const lanes = THEMES.filter((th) => themes.has(th));
  const height = TOP + lanes.length * LANE_H + 12;

  // size
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(Math.max(320, el.clientWidth)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [view]);

  // zoom behaviour
  useEffect(() => {
    if (view !== 'chart' || !svgRef.current) return;
    const z = d3zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 350])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .extent([
        [0, 0],
        [width, height],
      ])
      .on('zoom', (ev) => setT(ev.transform));
    zoomRef.current = z;
    const sel = select(svgRef.current);
    sel.call(z);
    sel.on('dblclick.zoom', null);
    return () => {
      sel.on('.zoom', null);
    };
  }, [width, height, view]);

  const zoomTo = useCallback(
    (range: [number, number], animate = true) => {
      if (!svgRef.current || !zoomRef.current) return;
      const a = astro(range[0]);
      const b = astro(range[1]);
      const k = Math.max(1, Math.min(350, (A1 - A0) / Math.max(4, b - a)));
      const tx = -base(a) * k;
      const target = zoomIdentity.translate(tx, 0).scale(k);
      const sel = select(svgRef.current);
      if (animate) sel.transition().duration(550).call(zoomRef.current.transform, target);
      else sel.call(zoomRef.current.transform, target);
    },
    [base],
  );

  // initial range from URL
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current || !zoomRef.current || view !== 'chart') return;
    didInit.current = true;
    const from = params.get('from');
    const to = params.get('to');
    if (from && to) zoomTo([Number(from), Number(to)], false);
    else if (selected) {
      const s = selected.date.from;
      const e = selected.date.to ?? s;
      const pad = Math.max(40, (e - s) * 1.5);
      zoomTo([s - pad, e + pad], false);
    }
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const select_ = (e?: HistEvent) => {
    const next = new URLSearchParams(params);
    if (e) next.set('event', e.id);
    else next.delete('event');
    next.delete('from');
    next.delete('to');
    setParams(next, { replace: true });
  };

  // keyboard navigation
  const onKey = (ev: React.KeyboardEvent) => {
    const visible = filtered.filter((e) => astro(e.date.from) >= d0 - 1 && astro(e.date.from) <= d1 + 1);
    const list = visible.length ? visible : filtered;
    const i = selected ? list.findIndex((e) => e.id === selected.id) : -1;
    if (ev.key === 'ArrowRight') {
      ev.preventDefault();
      const n = list[Math.min(list.length - 1, i + 1)];
      if (n) {
        select_(n);
        if (astro(n.date.from) > d1) zoomTo([fromAstro(astro(n.date.from) - span / 2), fromAstro(astro(n.date.from) + span / 2)]);
      }
    } else if (ev.key === 'ArrowLeft') {
      ev.preventDefault();
      const n = list[Math.max(0, i - 1)];
      if (n) {
        select_(n);
        if (astro(n.date.from) < d0) zoomTo([fromAstro(astro(n.date.from) - span / 2), fromAstro(astro(n.date.from) + span / 2)]);
      }
    } else if (ev.key === '+' || ev.key === '=') zoomBy(2);
    else if (ev.key === '-') zoomBy(0.5);
    else if (ev.key === '0') zoomTo(FULL);
    else if (ev.key === 'Escape') select_(undefined);
  };
  const zoomBy = (f: number) => {
    if (!svgRef.current || !zoomRef.current) return;
    select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, f, [width / 2, height / 2]);
  };

  // ---- layout of marks and labels ----
  const marks = useMemo(() => {
    const showLabel = (e: HistEvent) => e.weight === 3 || (e.weight === 2 && span < 700) || (e.weight === 1 && span < 170) || e.id === selectedId;
    const out: { e: HistEvent; x1: number; x2: number; y: number; label?: { x: number; y: number } }[] = [];
    for (const lane of lanes) {
      const li = lanes.indexOf(lane);
      const y = TOP + li * LANE_H + 18;
      const rowsEnd = [-Infinity, -Infinity];
      const inLane = filtered.filter((e) => e.themes[0] === lane || (!themes.has(e.themes[0]) && e.themes.find((th) => themes.has(th)) === lane));
      const sorted = [...inLane].sort((a, b) => b.weight - a.weight || a.date.from - b.date.from);
      const placed: typeof out = [];
      for (const e of sorted) {
        const x1 = x(astro(e.date.from));
        const x2 = e.date.to && e.date.to !== e.date.from ? x(astro(e.date.to)) : x1;
        if (x2 < -200 || x1 > width + 200) continue;
        const m: (typeof out)[number] = { e, x1, x2, y };
        if (showLabel(e) && x1 > -100 && x1 < width) {
          const lw = Math.min(220, e.title.length * 6.3) + 10;
          const lx = Math.max(x1, 0) + 7;
          for (let r = 0; r < 2; r++) {
            const occupied = placed.some((p) => p.label && p.label.y === y + 14 + r * 15 && !(lx > p.label.x + Math.min(220, p.e.title.length * 6.3) + 14 || lx + lw < p.label.x));
            if (!occupied) {
              m.label = { x: lx, y: y + 14 + r * 15 };
              rowsEnd[r] = lx + lw;
              break;
            }
          }
        }
        placed.push(m);
      }
      out.push(...placed);
    }
    return out;
  }, [filtered, lanes, x, width, span, selectedId, themes]);

  const posOf = (id: string) => {
    const m = marks.find((mm) => mm.e.id === id);
    if (m) return { x: m.x1, y: m.y };
    const e = eventById.get(id);
    if (!e) return null;
    const lane = lanes.indexOf(e.themes.find((th) => themes.has(th)) ?? e.themes[0]);
    return { x: x(astro(e.date.from)), y: TOP + Math.max(0, lane) * LANE_H + 18 };
  };

  const step = tickStep(span);
  const ticks: number[] = [];
  {
    const y0 = fromAstro(Math.floor(d0));
    const y1 = fromAstro(Math.ceil(d1));
    for (let yv = Math.ceil(y0 / step) * step; yv <= y1; yv += step) {
      if (yv === 0) continue;
      ticks.push(yv);
    }
  }

  const causes = selected?.causes?.filter((c) => eventById.has(c)) ?? [];
  const effects = selected ? (consequencesOf.get(selected.id) ?? []) : [];

  const arc = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const mx = (from.x + to.x) / 2;
    const lift = Math.min(90, 26 + Math.abs(to.x - from.x) * 0.12);
    const my = Math.min(from.y, to.y) - lift;
    return `M${from.x},${from.y - 5} Q${mx},${my} ${to.x},${to.y - 5}`;
  };

  return (
    <div className="page timeline-page">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Chronology</p>
          <h1>Timeline</h1>
          <p className="lede">
            Events across twenty-two centuries, sorted by theme. Zoom from centuries to single years, select an event to read about it, and follow the
            arrows to its causes and consequences.
          </p>
        </header>

        <div className="toolbar tl-toolbar">
          <div className="group" role="group" aria-label="Themes">
            <span className="group-label">Themes</span>
            {THEMES.map((th) => (
              <button
                key={th}
                className="chip"
                aria-pressed={themes.has(th)}
                onClick={() => {
                  const n = new Set(themes);
                  if (n.has(th)) {
                    if (n.size > 1) n.delete(th);
                  } else n.add(th);
                  setThemes(n);
                }}
              >
                <span className="swatch" style={{ background: `var(--th-${th})` }} />
                {THEME_LABEL[th]}
              </button>
            ))}
          </div>
          <div className="group">
            <button className="chip" aria-pressed={keyOnly} onClick={() => setKeyOnly(!keyOnly)}>
              Key events only
            </button>
            <input type="search" placeholder="Filter events" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Filter events by text" />
          </div>
          <div className="group" role="group" aria-label="View">
            <button className="chip" aria-pressed={view === 'chart'} onClick={() => setView('chart')}>
              Chart
            </button>
            <button className="chip" aria-pressed={view === 'list'} onClick={() => setView('list')}>
              List
            </button>
          </div>
        </div>

        <div className={`tl-layout ${selected ? 'has-detail' : ''}`}>
          <div className="tl-main">
            {view === 'chart' ? (
              <>
                <div className="toolbar tl-zoombar">
                  <label className="group">
                    <span className="group-label">Jump to</span>
                    <select
                      onChange={(e) => {
                        const p = PRESETS[Number(e.target.value)];
                        if (p) zoomTo(p.range);
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Choose a period…
                      </option>
                      {PRESETS.map((p, i) => (
                        <option key={p.label} value={i}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="group">
                    <button className="btn small" onClick={() => zoomBy(2)} aria-label="Zoom in">
                      Zoom in
                    </button>
                    <button className="btn small" onClick={() => zoomBy(0.5)} aria-label="Zoom out">
                      Zoom out
                    </button>
                    <button className="btn small ghost" onClick={() => zoomTo(FULL)}>
                      Reset
                    </button>
                  </div>
                  <span className="faint">
                    Showing {formatYear(fromAstro(Math.round(d0)))} – {formatYear(fromAstro(Math.round(d1)))}
                  </span>
                </div>
                <div className="tl-chart" ref={boxRef}>
                  <div className="tl-lanes" aria-hidden="true">
                    {lanes.map((th, i) => (
                      <span key={th} style={{ top: TOP + i * LANE_H, color: `var(--th-${th})` }}>
                        {THEME_LABEL[th]}
                      </span>
                    ))}
                  </div>
                  <svg
                    ref={svgRef}
                    width={width}
                    height={height}
                    className="tl-svg"
                    tabIndex={0}
                    role="application"
                    aria-label="Timeline chart. Use left and right arrows to move between events, plus and minus to zoom, 0 to reset."
                    onKeyDown={onKey}
                  >
                    <defs>
                      <marker id="arrow-in" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)" />
                      </marker>
                      <marker id="arrow-out" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="var(--good)" />
                      </marker>
                    </defs>
                    {/* periods */}
                    {PERIODS.map((p) => {
                      const a = x(astro(p.from));
                      const b = x(astro(p.to));
                      if (b < 0 || a > width) return null;
                      return (
                        <g key={p.id}>
                          <rect x={a} y={0} width={Math.max(0, b - a)} height={16} fill={p.tone} opacity={0.22} />
                          {b - a > 60 && (
                            <text x={Math.max(a, 0) + 5} y={12} className="tl-period-label">
                              {b - a > 150 ? p.label : p.short}
                            </text>
                          )}
                        </g>
                      );
                    })}
                    {/* ticks */}
                    {ticks.map((yv) => {
                      const xx = x(astro(yv));
                      return (
                        <g key={yv}>
                          <line x1={xx} x2={xx} y1={20} y2={height} className="tl-grid" />
                          <text x={xx + 3} y={34} className="tl-tick">
                            {formatYear(yv)}
                          </text>
                        </g>
                      );
                    })}
                    {lanes.map((th, i) => (
                      <line key={th} x1={0} x2={width} y1={TOP + i * LANE_H} y2={TOP + i * LANE_H} className="tl-lane-rule" />
                    ))}
                    {/* causal arcs */}
                    {selected &&
                      causes.map((c) => {
                        const a = posOf(c);
                        const b = posOf(selected.id);
                        return a && b ? <path key={'c' + c} d={arc(a, b)} className="tl-arc tl-arc-in" markerEnd="url(#arrow-in)" /> : null;
                      })}
                    {selected &&
                      effects.map((c) => {
                        const a = posOf(selected.id);
                        const b = posOf(c);
                        return a && b ? <path key={'e' + c} d={arc(a, b)} className="tl-arc tl-arc-out" markerEnd="url(#arrow-out)" /> : null;
                      })}
                    {/* marks */}
                    {marks.map(({ e, x1, x2, y, label }) => {
                      const th = e.themes[0];
                      const isSel = e.id === selectedId;
                      const related = causes.includes(e.id) || effects.includes(e.id);
                      const r = e.weight === 3 ? 6 : e.weight === 2 ? 4.5 : 3.5;
                      return (
                        <g
                          key={e.id}
                          className={`tl-mark ${isSel ? 'sel' : ''} ${related ? 'rel' : ''} ${selected && !isSel && !related ? 'dim' : ''}`}
                          onClick={() => select_(isSel ? undefined : e)}
                          onMouseEnter={() => setHover(e)}
                          onMouseLeave={() => setHover(null)}
                          style={{ ['--c' as string]: `var(--th-${th})` }}
                        >
                          {x2 - x1 > 2 && <rect x={x1} y={y - 3} width={x2 - x1} height={6} className="tl-bar" />}
                          <path d={`M${x1},${y - r} L${x1 + r},${y} L${x1},${y + r} L${x1 - r},${y} Z`} className="tl-diamond" />
                          {e.certainty === 'contested' && <circle cx={x1} cy={y} r={r + 3} className="tl-uncertain" />}
                          {label && (
                            <text x={label.x} y={label.y} className={`tl-label w${e.weight}`}>
                              {e.title.length > 34 ? e.title.slice(0, 33) + '…' : e.title}
                            </text>
                          )}
                          <rect x={Math.min(x1, x2) - 8} y={y - 10} width={Math.max(16, x2 - x1 + 16)} height={20} fill="transparent" />
                        </g>
                      );
                    })}
                  </svg>
                  {hover && (
                    <div className="tl-hover ui" style={{ left: Math.min(width - 260, Math.max(0, x(astro(hover.date.from)) + 10)) }}>
                      <strong>{hover.title}</strong>
                      <span>{formatDate(hover.date)}</span>
                    </div>
                  )}
                </div>
                <div className="tl-overview" aria-hidden="true">
                  <div
                    className="tl-overview-track"
                    onClick={(ev) => {
                      const r = (ev.currentTarget as HTMLDivElement).getBoundingClientRect();
                      const frac = (ev.clientX - r.left) / r.width;
                      const c = -753 + frac * (1453 + 753);
                      zoomTo([c - Math.max(10, span / 2), c + Math.max(10, span / 2)]);
                    }}
                  >
                    {PERIODS.map((p) => (
                      <span key={p.id} style={{ left: `${spanX(p.from)}%`, width: `${spanX(p.to) - spanX(p.from)}%`, background: p.tone }} />
                    ))}
                    <span
                      className="tl-overview-window"
                      style={{ left: `${spanX(fromAstro(Math.round(d0)))}%`, width: `${Math.max(0.6, spanX(fromAstro(Math.round(d1))) - spanX(fromAstro(Math.round(d0))))}%` }}
                    />
                  </div>
                  <span className="ui small faint">Click the overview to move. Scroll or pinch on the chart to zoom; drag to pan.</span>
                </div>
                <p className="ui small faint tl-legend">
                  ◆ event · ▬ duration · ○ contested date or significance · <span style={{ color: 'var(--accent)' }}>red arrows</span> lead in from causes,{' '}
                  <span style={{ color: 'var(--good)' }}>green arrows</span> lead out to consequences. {filtered.length} events shown.
                </p>
              </>
            ) : (
              <EventList events={filtered} onSelect={select_} selectedId={selectedId} />
            )}
          </div>
          {selected && (
            <EventDetail
              e={selected}
              causes={causes}
              effects={effects}
              onSelect={(id) => {
                const ev = eventById.get(id);
                if (ev) {
                  select_(ev);
                  if (view === 'chart') {
                    const c = ev.date.from;
                    if (astro(c) < d0 || astro(c) > d1) zoomTo([c - span / 2, c + span / 2]);
                  }
                }
              }}
              onClose={() => select_(undefined)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function EventList({ events: list, onSelect, selectedId }: { events: HistEvent[]; onSelect: (e: HistEvent) => void; selectedId?: string }) {
  return (
    <table className="data tl-table">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Event</th>
          <th scope="col">Themes</th>
        </tr>
      </thead>
      <tbody>
        {list.map((e) => (
          <tr key={e.id} className={e.id === selectedId ? 'sel' : ''}>
            <td className="tl-table-date">{formatDate(e.date)}</td>
            <td>
              <button className="linklike" onClick={() => onSelect(e)}>
                {e.title}
              </button>
              {e.weight === 3 && <span className="sr-only"> (key event)</span>}
            </td>
            <td>
              {e.themes.map((th) => (
                <span key={th} className="theme-dot" style={{ background: `var(--th-${th})` }} title={th} />
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EventDetail({ e, causes, effects, onSelect, onClose }: { e: HistEvent; causes: string[]; effects: string[]; onSelect: (id: string) => void; onClose: () => void }) {
  const lessons = [...new Set([...(e.lesson ? [e.lesson] : []), ...(lessonsForEvent.get(e.id) ?? [])])];
  return (
    <aside className="tl-detail" aria-label="Selected event">
      <div className="tl-detail-head">
        <span className="ui small faint">{formatDate(e.date)}</span>
        <button className="btn ghost small" onClick={onClose} aria-label="Close event details">
          Close
        </button>
      </div>
      <h2>{e.title}</h2>
      <div className="row tl-detail-themes">
        {e.themes.map((th) => (
          <span key={th} className="chip">
            <span className="swatch" style={{ background: `var(--th-${th})` }} />
            {th}
          </span>
        ))}
        {e.certainty && <CertaintyBadge level={e.certainty} />}
      </div>
      {e.date.note && <p className="ui small tl-date-note">Dating: {e.date.note}</p>}
      <Rich text={e.summary} />
      {causes.length > 0 && (
        <section>
          <h3>Grew out of</h3>
          <ul className="tl-links in">
            {causes.map((c) => (
              <li key={c}>
                <button className="linklike" onClick={() => onSelect(c)}>
                  {eventById.get(c)?.title}
                </button>{' '}
                <span className="meta">{formatDate(eventById.get(c)?.date)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {effects.length > 0 && (
        <section>
          <h3>Led to</h3>
          <ul className="tl-links out">
            {effects.map((c) => (
              <li key={c}>
                <button className="linklike" onClick={() => onSelect(c)}>
                  {eventById.get(c)?.title}
                </button>{' '}
                <span className="meta">{formatDate(eventById.get(c)?.date)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {e.figures && e.figures.length > 0 && (
        <section>
          <h3>People</h3>
          <p className="ui">
            {e.figures
              .filter((f) => figureById.has(f))
              .map((f, i) => (
                <span key={f}>
                  {i > 0 && ', '}
                  <Link to={`/people/${f}`}>{figureById.get(f)!.name}</Link>
                </span>
              ))}
          </p>
        </section>
      )}
      {e.places && e.places.length > 0 && (
        <section>
          <h3>Where</h3>
          <p className="ui">
            {e.places
              .filter((p) => placeById.has(p))
              .map((p, i) => (
                <span key={p}>
                  {i > 0 && ', '}
                  <Link to={`/atlas?place=${p}`}>{placeById.get(p)!.name}</Link>
                </span>
              ))}
          </p>
        </section>
      )}
      {e.sources && e.sources.length > 0 && (
        <section>
          <h3>Evidence</h3>
          <ul className="ui">
            {e.sources
              .filter((s) => sourceById.has(s))
              .map((s) => (
                <li key={s}>
                  <Link to={`/sources/${s}`}>{sourceById.get(s)!.title}</Link>
                </li>
              ))}
          </ul>
        </section>
      )}
      {lessons.length > 0 && (
        <section>
          <h3>Studied in</h3>
          <ul className="ui">
            {lessons.map((l) => (
              <li key={l}>
                <Link to={`/lesson/${l}`}>{lessonById.get(l)?.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
