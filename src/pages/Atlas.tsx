import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { geoConicEqualArea, geoPath, geoGraticule10 } from 'd3-geo';
import { select } from 'd3-selection';
import { zoom as d3zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import 'd3-transition';
import { feature, mesh } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import topoRaw from '../geo/atlas.topo.json';
import { atlasLines, atlasSnapshots, eventById, eventsForPlace, lessonById, lessonsForPlace, placeById, places } from '../data';
import { formatDate, formatYear } from '../lib/dates';
import type { AtlasSnapshot, Place } from '../types';
import { Rich } from '../components/Markup';
import { CertaintyBadge } from '../components/Certainty';
import './atlas.css';

const topo = topoRaw as unknown as Topology;
const W = 1000;
const H = 660;
const projection = geoConicEqualArea()
  .parallels([33, 47])
  .rotate([-16, 0])
  .fitExtent(
    [
      [10, 10],
      [W - 10, H - 10],
    ],
    { type: 'MultiPoint', coordinates: [[-10, 25], [46, 25], [-10, 56], [46, 56], [18, 57], [18, 24]] },
  );
const path = geoPath(projection);

type FC = FeatureCollection<Geometry, Record<string, string>>;
const fcache = new Map<string, FC>();
function layer(name: string): FC {
  if (!fcache.has(name)) {
    const obj = topo.objects[name] as GeometryCollection | undefined;
    fcache.set(name, obj ? (feature(topo, obj) as unknown as FC) : { type: 'FeatureCollection', features: [] });
  }
  return fcache.get(name)!;
}
const landPath = path(feature(topo, topo.objects.land as GeometryCollection) as unknown as FeatureCollection) ?? '';
const graticule = path(geoGraticule10()) ?? '';

const ROLE_CLASS: Record<string, string> = {
  core: 'terr-rome',
  west: 'terr-rome',
  east: 'terr-east',
  client: 'terr-client',
  successor: 'terr-successor',
  Diocletianus: 'terr-t1',
  Galerius: 'terr-t2',
  Maximian: 'terr-t3',
  Constantinus: 'terr-t4',
};
const ROLE_LABEL: Record<string, string> = {
  Diocletianus: 'Diocletian (Augustus, East)',
  Galerius: 'Galerius (Caesar, East)',
  Maximian: 'Maximian (Augustus, West)',
  Constantinus: 'Constantius I (Caesar, West)',
};

const LAYERS = [
  { id: 'territory', label: 'Territory' },
  { id: 'zones', label: 'Borders as zones' },
  { id: 'provinces', label: 'Provinces' },
  { id: 'roads', label: 'Roads' },
  { id: 'walls', label: 'Frontier works' },
  { id: 'rivers', label: 'Rivers' },
  { id: 'routes', label: 'Trade routes' },
  { id: 'cities', label: 'Cities and sites' },
  { id: 'battles', label: 'Battles' },
] as const;
type LayerId = (typeof LAYERS)[number]['id'];

function battleYear(p: Place): number | undefined {
  if (p.span) return p.span[0];
  const evs = eventsForPlace.get(p.id) ?? [];
  const e = evs.map((id) => eventById.get(id)).find(Boolean);
  return e?.date.from;
}

export default function AtlasPage() {
  const [params, setParams] = useSearchParams();
  const snapParam = params.get('snapshot');
  const placeId = params.get('place') ?? undefined;
  const place = placeId ? placeById.get(placeId) : undefined;
  const snaps = atlasSnapshots;
  const initialIdx = useMemo(() => {
    if (snapParam) {
      const i = snaps.findIndex((s) => s.id === snapParam || String(s.year) === snapParam);
      if (i >= 0) return i;
    }
    if (place) {
      const y = place.kind === 'battle' ? battleYear(place) : place.span?.[0];
      if (y !== undefined) {
        let best = 0;
        snaps.forEach((s, i) => {
          if (s.year >= y && (snaps[best].year < y || s.year < snaps[best].year)) best = i;
        });
        return best;
      }
    }
    return Math.max(0, snaps.findIndex((s) => s.year === 117));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [idx, setIdx] = useState(initialIdx);
  const snap: AtlasSnapshot | undefined = snaps[idx];
  const prevYear = idx > 0 ? snaps[idx - 1].year : -1000;
  const [on, setOn] = useState<Set<LayerId>>(new Set(['territory', 'provinces', 'walls', 'rivers', 'cities', 'battles']));
  const [allBattles, setAllBattles] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState<ZoomTransform>(zoomIdentity);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const z = d3zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 12])
      .translateExtent([
        [0, 0],
        [W, H],
      ])
      .on('zoom', (ev) => setT(ev.transform));
    zoomRef.current = z;
    select(svgRef.current).call(z).on('dblclick.zoom', null);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setIdx((i) => {
        if (i >= snaps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 2600);
    return () => clearInterval(id);
  }, [playing, snaps.length]);

  // zoom to a selected place
  useEffect(() => {
    if (!place || !svgRef.current || !zoomRef.current) return;
    const p = projection([place.lon, place.lat]);
    if (!p) return;
    const k = Math.max(t.k, 3);
    const target = zoomIdentity.translate(W / 2 - p[0] * k, H / 2 - p[1] * k).scale(k);
    select(svgRef.current).transition().duration(600).call(zoomRef.current.transform, target);
  }, [placeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const setSnap = (i: number) => {
    setIdx(i);
    const next = new URLSearchParams(params);
    next.set('snapshot', snaps[i].id);
    setParams(next, { replace: true });
  };
  const choosePlace = (id?: string) => {
    const next = new URLSearchParams(params);
    if (id) next.set('place', id);
    else next.delete('place');
    setParams(next, { replace: true });
  };
  const toggle = (id: LayerId) => {
    const n = new Set(on);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    setOn(n);
  };
  const zoomBy = (f: number) => {
    if (svgRef.current && zoomRef.current) select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, f);
  };

  const year = snap?.year ?? 117;
  const territory = useMemo(() => {
    if (!snap) return [] as Feature<Geometry, Record<string, string>>[];
    return layer(snap.layer).features.filter((f) => !snap.roles || snap.roles.includes(f.properties?.role));
  }, [snap]);
  const territoryOutline = useMemo(() => {
    if (!snap) return '';
    const obj = topo.objects[snap.layer] as GeometryCollection;
    return path(mesh(topo, obj)) ?? '';
  }, [snap]);
  const provinces = snap?.provinces ? layer(snap.provinces) : null;
  const roads = layer('roads');
  const walls = layer('walls');

  const visiblePlaces = places.filter((p) => {
    if (p.kind === 'battle') {
      if (!on.has('battles')) return false;
      if (allBattles) return true;
      const by = battleYear(p);
      return by !== undefined && by > prevYear && by <= year;
    }
    if (!on.has('cities')) return false;
    if (p.span) return year >= p.span[0] && year <= p.span[1];
    return true;
  });
  const k = t.k;
  const showLabel = (p: Place) => p.id === placeId || (p.rank ?? 2) === 1 || ((p.rank ?? 2) === 2 && k >= 2.2) || k >= 4.5;

  const lines = atlasLines.filter((l) => (l.kind === 'river' ? on.has('rivers') : l.kind === 'route' ? on.has('routes') : on.has('walls')) && (!l.span || (year >= l.span[0] && year <= l.span[1])));
  const placeEvents = place ? (eventsForPlace.get(place.id) ?? []).map((e) => eventById.get(e)!).filter(Boolean) : [];
  const placeLessons = place ? (lessonsForPlace.get(place.id) ?? []) : [];

  return (
    <div className="page atlas-page">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Historical atlas</p>
          <h1>Atlas</h1>
          <p className="lede">
            How far Roman power reached, and how it changed, from the Republic to 1453. Step through the maps, switch layers on and off, and select a
            place to see what happened there. Every map states where its lines come from and how far to trust them.
          </p>
        </header>

        <div className="atlas-stepper" role="group" aria-label="Choose a date">
          <button className="btn small" onClick={() => setSnap(Math.max(0, idx - 1))} disabled={idx === 0} aria-label="Earlier map">
            ←
          </button>
          <ol className="atlas-steps">
            {snaps.map((s, i) => (
              <li key={s.id}>
                <button className={`atlas-step ${i === idx ? 'active' : ''} ${i < idx ? 'past' : ''}`} onClick={() => setSnap(i)} aria-current={i === idx ? 'step' : undefined}>
                  <span className="atlas-step-year">{formatYear(s.year)}</span>
                </button>
              </li>
            ))}
          </ol>
          <button className="btn small" onClick={() => setSnap(Math.min(snaps.length - 1, idx + 1))} disabled={idx === snaps.length - 1} aria-label="Later map">
            →
          </button>
          <button className="btn small" aria-pressed={playing} onClick={() => setPlaying(!playing)}>
            {playing ? 'Pause' : 'Play'}
          </button>
        </div>

        <div className="atlas-layout">
          <div className="atlas-map-col">
            <div className="atlas-map">
              <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Map of the Mediterranean world, ${snap ? snap.label : ''}`} className={on.has('zones') ? 'zones' : ''}>
                <defs>
                  <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="6" className="hatch-line" />
                  </pattern>
                  <filter id="blur-edge" x="-5%" y="-5%" width="110%" height="110%">
                    <feGaussianBlur stdDeviation="6" />
                  </filter>
                </defs>
                <rect width={W} height={H} className="sea" />
                <g transform={t.toString()}>
                  <path d={graticule} className="graticule" />
                  <path d={landPath} className="land" />
                  {on.has('territory') &&
                    territory.map((f, i) => <path key={i} d={path(f) ?? ''} className={`terr ${ROLE_CLASS[f.properties?.role] ?? 'terr-rome'}`} />)}
                  {on.has('territory') && on.has('zones') && <path d={territoryOutline} className="terr-zone" filter="url(#blur-edge)" />}
                  {on.has('territory') && !on.has('zones') && <path d={territoryOutline} className="terr-edge" />}
                  {on.has('provinces') && provinces && <path d={path(provinces as unknown as FeatureCollection) ?? ''} className="prov" />}
                  {on.has('roads') && <path d={path(roads as unknown as FeatureCollection) ?? ''} className="road" />}
                  {on.has('walls') && year >= 100 && year <= 450 && <path d={path(walls as unknown as FeatureCollection) ?? ''} className="wall" />}
                  {lines.map((l) => (
                    <path
                      key={l.id}
                      d={path({ type: 'LineString', coordinates: l.coords }) ?? ''}
                      className={`line-${l.kind}`}
                      style={{ strokeWidth: (l.kind === 'route' ? 2 : 1.3) / Math.sqrt(k) }}
                    >
                      <title>{l.name}</title>
                    </path>
                  ))}
                  {visiblePlaces.map((p) => {
                    const xy = projection([p.lon, p.lat]);
                    if (!xy) return null;
                    const sel = p.id === placeId;
                    const s = 1 / k;
                    return (
                      <g
                        key={p.id}
                        transform={`translate(${xy[0]},${xy[1]}) scale(${s})`}
                        className={`pl pl-${p.kind} ${sel ? 'sel' : ''}`}
                        onClick={() => choosePlace(sel ? undefined : p.id)}
                        role="button"
                        tabIndex={0}
                        aria-label={`${p.name}${p.kind === 'battle' ? ' (battle)' : ''}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            choosePlace(sel ? undefined : p.id);
                          }
                        }}
                      >
                        {p.kind === 'battle' ? (
                          <path d="M-5,-5 L5,5 M5,-5 L-5,5" className="pl-mark-battle" />
                        ) : p.kind === 'frontier' ? (
                          <rect x={-3.5} y={-3.5} width={7} height={7} className="pl-mark" />
                        ) : (
                          <circle r={(p.rank ?? 2) === 1 ? 4.5 : 3.2} className="pl-mark" />
                        )}
                        {sel && <circle r={11} className="pl-halo" />}
                        {showLabel(p) && (
                          <text x={7} y={4} className={`pl-label r${p.rank ?? 2}`}>
                            {p.name}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>
              <div className="atlas-zoom">
                <button className="btn small" onClick={() => zoomBy(1.6)} aria-label="Zoom in">
                  +
                </button>
                <button className="btn small" onClick={() => zoomBy(1 / 1.6)} aria-label="Zoom out">
                  −
                </button>
                <button
                  className="btn small"
                  onClick={() => svgRef.current && zoomRef.current && select(svgRef.current).transition().duration(400).call(zoomRef.current.transform, zoomIdentity)}
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="toolbar atlas-layers" role="group" aria-label="Map layers">
              {LAYERS.map((l) => (
                <button key={l.id} className="chip" aria-pressed={on.has(l.id)} onClick={() => toggle(l.id)}>
                  {l.label}
                </button>
              ))}
              {on.has('battles') && (
                <button className="chip" aria-pressed={allBattles} onClick={() => setAllBattles(!allBattles)}>
                  Battles of every period
                </button>
              )}
            </div>
            <Legend snap={snap} />
          </div>

          <aside className="atlas-panel">
            {place ? (
              <div className="atlas-place">
                <button className="btn ghost small" onClick={() => choosePlace(undefined)}>
                  Back to the map of {snap ? formatYear(snap.year) : ''}
                </button>
                <h2>{place.name}</h2>
                <p className="meta">
                  {[place.ancient && place.ancient !== place.name ? `Latin/Greek: ${place.ancient}` : '', place.modern ? `Modern: ${place.modern}` : '', place.kind]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                <Rich text={place.summary} />
                {place.locationNote && <p className="ui small atlas-locnote">Location: {place.locationNote}</p>}
                {placeEvents.length > 0 && (
                  <>
                    <h3>Events here</h3>
                    <ul className="ruled tight ui">
                      {placeEvents.map((e) => (
                        <li key={e.id}>
                          <Link to={`/timeline?event=${e.id}`}>{e.title}</Link> <span className="meta">{formatDate(e.date)}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {placeLessons.length > 0 && (
                  <>
                    <h3>Studied in</h3>
                    <ul className="ruled tight ui">
                      {placeLessons.map((l) => (
                        <li key={l}>
                          <Link to={`/lesson/${l}`}>{lessonById.get(l)?.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ) : snap ? (
              <div className="atlas-snap">
                <p className="ui small faint">Map {idx + 1} of {snaps.length}</p>
                <h2>{snap.label}</h2>
                <Rich text={snap.summary} />
                <h3>How far to trust this map</h3>
                <CertaintyBadge level={snap.confidence} />
                <Rich text={snap.caveat} />
                <p className="ui small faint atlas-source">
                  Boundary data:{' '}
                  {snap.source === 'AWMC'
                    ? 'Ancient World Mapping Center, derived from the Barrington Atlas of the Greek and Roman World (ODbL).'
                    : snap.source === 'HB'
                      ? 'historical-basemaps by A. Ourednik (GPL-3.0), approximate world-scale borders.'
                      : 'Derived for this course from the sources described above.'}
                </p>
                <h3>Places on this map</h3>
                <ul className="atlas-placelist ui">
                  {visiblePlaces
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((p) => (
                      <li key={p.id}>
                        <button className="linklike" onClick={() => choosePlace(p.id)}>
                          {p.name}
                        </button>
                        {p.kind === 'battle' && <span className="meta"> battle</span>}
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <p className="empty">No maps are available.</p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function Legend({ snap }: { snap?: AtlasSnapshot }) {
  const roles = snap ? [...new Set(layer(snap.layer).features.map((f) => f.properties?.role).filter((r) => !snap.roles || snap.roles.includes(r)))] : [];
  return (
    <dl className="atlas-legend ui">
      {roles.map((r) => (
        <div key={r}>
          <dt>
            <span className={`lg-swatch ${ROLE_CLASS[r] ?? 'terr-rome'}`} />
          </dt>
          <dd>
            {ROLE_LABEL[r] ??
              (r === 'client'
                ? 'Client kingdoms and dependent rulers'
                : r === 'east'
                  ? 'Roman Empire in the East'
                  : r === 'west'
                    ? 'Roman Empire in the West'
                    : r === 'successor'
                      ? 'Roman successor state (Trebizond)'
                      : 'Roman provinces and directly ruled territory')}
          </dd>
        </div>
      ))}
      <div>
        <dt>
          <span className="lg-line lg-prov" />
        </dt>
        <dd>Provincial boundary</dd>
      </div>
      <div>
        <dt>
          <span className="lg-line lg-road" />
        </dt>
        <dd>Major road</dd>
      </div>
      <div>
        <dt>
          <span className="lg-line lg-wall" />
        </dt>
        <dd>Frontier wall or earthwork</dd>
      </div>
      <div>
        <dt>
          <span className="lg-line lg-route" />
        </dt>
        <dd>Trade route (schematic)</dd>
      </div>
      <div>
        <dt>
          <span className="lg-dot" />
        </dt>
        <dd>City or site</dd>
      </div>
      <div>
        <dt>
          <span className="lg-battle">×</span>
        </dt>
        <dd>Battle (since the previous map)</dd>
      </div>
    </dl>
  );
}
