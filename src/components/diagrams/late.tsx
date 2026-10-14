import { useMemo, useState, type ReactElement } from 'react';
import { astro, formatYear } from '../../lib/dates';
import { Frame, Toggle, exitPoint } from './Frame';

/* ------------------------------------------------------------------ */
/* Debasement of the silver coinage                                     */
/* ------------------------------------------------------------------ */

const SILVER: { year: number; pct: number; label: string }[] = [
  { year: 14, pct: 97, label: 'Augustus' },
  { year: 64, pct: 93, label: 'Nero’s reform' },
  { year: 107, pct: 89, label: 'Trajan' },
  { year: 170, pct: 79, label: 'Marcus Aurelius' },
  { year: 196, pct: 56, label: 'Septimius Severus' },
  { year: 215, pct: 52, label: 'Caracalla: antoninianus' },
  { year: 240, pct: 45, label: 'Gordian III' },
  { year: 250, pct: 37, label: 'Decius' },
  { year: 256, pct: 25, label: 'Valerian' },
  { year: 262, pct: 10, label: 'Gallienus, sole rule' },
  { year: 268, pct: 3, label: 'Gallienus, last years' },
  { year: 274, pct: 5, label: 'Aurelian’s reform' },
];

export function Debasement() {
  const [sel, setSel] = useState(SILVER.length - 3);
  const W = 640;
  const H = 300;
  const L = 50;
  const B = 260;
  const x = (y: number) => L + ((y - 0) / (290 - 0)) * (W - L - 20);
  const y = (p: number) => B - (p / 100) * (B - 20);
  const d = SILVER.map((p, i) => `${i ? 'L' : 'M'}${x(p.year)},${y(p.pct)}`).join(' ');
  const p = SILVER[sel];
  return (
    <Frame
      title="The silver content of Rome’s main silver coin"
      caption="Emperors paid soldiers with more coins containing less silver. By the late 260s the ‘silver’ antoninianus was a bronze coin with a thin silver wash. Select a point."
      basis="Approximate fineness from metallurgical analyses summarised in Howgego, Ancient History from Coins, and Harl, Coinage in the Roman Economy. Individual coins vary widely, and published analyses differ by several percentage points."
    >
      <svg className="dg" viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Line chart: silver content falls from about 97 per cent under Augustus to a few per cent by the 260s">
        {[0, 25, 50, 75, 100].map((t) => (
          <g key={t}>
            <line x1={L} x2={W - 20} y1={y(t)} y2={y(t)} className="ln" />
            <text x={L - 6} y={y(t) + 4} textAnchor="end" className="t-sm">
              {t}%
            </text>
          </g>
        ))}
        {[1, 50, 100, 150, 200, 250].map((t) => (
          <text key={t} x={x(t)} y={B + 18} textAnchor="middle" className="t-sm">
            {formatYear(t)}
          </text>
        ))}
        <rect x={x(235)} y={20} width={x(284) - x(235)} height={B - 20} fill="var(--accent-wash)" />
        <text x={x(259)} y={34} textAnchor="middle" className="t-sm">
          soldier-emperors
        </text>
        <path d={d} className="ln-strong" stroke="var(--c-cinnabar)" strokeWidth={2} />
        {SILVER.map((pt, i) => (
          <g
            key={pt.year}
            className={`hit ${i === sel ? 'sel' : ''}`}
            tabIndex={0}
            role="button"
            aria-pressed={i === sel}
            aria-label={`${pt.label}, ${formatYear(pt.year)}: about ${pt.pct} per cent silver`}
            onClick={() => setSel(i)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(i))}
          >
            <circle cx={x(pt.year)} cy={y(pt.pct)} r={i === sel ? 7 : 5} className="f-cinnabar" stroke="var(--surface)" strokeWidth={2} />
          </g>
        ))}
      </svg>
      <p className="dg-status" aria-live="polite">
        <strong>
          {p.label}, {formatYear(p.year)}:
        </strong>{' '}
        about {p.pct} per cent silver.
      </p>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Tetrarchy                                                           */
/* ------------------------------------------------------------------ */

const TETRARCHS = [
  { id: 'diocletian', name: 'Diocletian', rank: 'Augustus (senior)', patron: 'Jupiter (Iovius)', area: 'The East: Asia Minor, Syria, Egypt', seat: 'Nicomedia', x: 340, y: 70, link: 'Adopted Galerius, who married his daughter Valeria.' },
  { id: 'maximian', name: 'Maximian', rank: 'Augustus', patron: 'Hercules (Herculius)', area: 'Italy, Africa and Spain', seat: 'Milan', x: 120, y: 70, link: 'Adopted Constantius, who married his (step)daughter Theodora.' },
  { id: 'galerius', name: 'Galerius', rank: 'Caesar', patron: 'Jupiter', area: 'The Balkans and, at times, the Persian front', seat: 'Sirmium, Antioch, later Thessalonica', x: 340, y: 230, link: 'Caesar to Diocletian; Augustus in 305.' },
  { id: 'constantius', name: 'Constantius', rank: 'Caesar', patron: 'Hercules', area: 'Gaul and, from 296, Britain', seat: 'Trier', x: 120, y: 230, link: 'Caesar to Maximian; father of Constantine; Augustus in 305, died at York in 306.' },
];

export function Tetrarchy() {
  const [sel, setSel] = useState('diocletian');
  const t = TETRARCHS.find((x) => x.id === sel)!;
  return (
    <Frame
      title="The Tetrarchy of AD 293"
      caption="Two senior emperors (Augusti), each with a junior colleague (Caesar) bound to him by adoption and marriage. Laws were issued in all four names. Select a ruler."
      basis="Lactantius, On the Deaths of the Persecutors; panegyrics; Barnes, The New Empire of Diocletian and Constantine. Regional responsibilities shifted with campaigns."
    >
      <div className="dg-split">
        <svg className="dg" viewBox="0 0 460 310" role="group" aria-label="The four rulers of the Tetrarchy">
          <line x1={120} y1={70} x2={340} y2={70} className="ln-strong" />
          <text x={230} y={60} textAnchor="middle" className="t-sm">
            Augusti
          </text>
          <line x1={120} y1={96} x2={120} y2={204} className="ln-dash" />
          <line x1={340} y1={96} x2={340} y2={204} className="ln-dash" />
          <text x={230} y={146} textAnchor="middle" className="t-sm">
            each Caesar adopted
          </text>
          <text x={230} y={162} textAnchor="middle" className="t-sm">
            and married into
          </text>
          <text x={230} y={178} textAnchor="middle" className="t-sm">
            his Augustus’ family
          </text>
          <text x={230} y={234} textAnchor="middle" className="t-sm">
            Caesars
          </text>
          <text x={120} y={292} textAnchor="middle" className="t-sm">
            West
          </text>
          <text x={340} y={292} textAnchor="middle" className="t-sm">
            East
          </text>
          {TETRARCHS.map((r) => {
            const isSel = r.id === sel;
            const aug = r.rank.startsWith('Augustus');
            return (
              <g
                key={r.id}
                className={`hit ${isSel ? 'sel' : ''}`}
                tabIndex={0}
                role="button"
                aria-pressed={isSel}
                aria-label={`${r.name}, ${r.rank}`}
                onClick={() => setSel(r.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(r.id))}
              >
                <rect x={r.x - 84} y={r.y - 26} width={168} height={52} className={aug ? 'f-porphyry' : 'f-caeruleum'} stroke={isSel ? 'var(--text)' : 'none'} strokeWidth={3} />
                <text x={r.x} y={r.y - 4} textAnchor="middle" className="t-on t-lg">
                  {r.name}
                </text>
                <text x={r.x} y={r.y + 14} textAnchor="middle" className="t-sm" style={{ fill: 'var(--surface)' }}>
                  {r.seat.split(',')[0]}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="dg-panel" aria-live="polite">
          <h5>{t.name}</h5>
          <dl>
            <dt>Rank</dt>
            <dd>{t.rank}</dd>
            <dt>Divine patron</dt>
            <dd>{t.patron}</dd>
            <dt>Main area</dt>
            <dd>{t.area}</dd>
            <dt>Residences</dt>
            <dd>{t.seat}</dd>
          </dl>
          <p>{t.link}</p>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Late Roman administration                                            */
/* ------------------------------------------------------------------ */

const ADMIN = [
  { id: 'emperor', label: 'Emperor', x: 340, y: 30, branch: 'top', text: 'Ruled with the advice of the consistory (sacrum consistorium), the council of senior officials. By c. 400 there were separate emperors and administrations for East and West.' },
  { id: 'palace', label: 'Palace ministers', x: 96, y: 100, branch: 'palace', text: 'The master of offices (secretariats, couriers, arms factories), the quaestor (legal drafting), two finance ministers (the sacred largesses and the private estates), and the eunuch chamberlain of the sacred bedchamber.' },
  { id: 'prefects', label: 'Praetorian prefects', x: 330, y: 100, branch: 'civil', text: 'After Constantine, purely civil officials: supreme judges of appeal and managers of the tax in kind (annona) that fed the army. By the late fourth century there were usually four prefectures.' },
  { id: 'vicars', label: 'Vicars of dioceses', x: 330, y: 170, branch: 'civil', text: 'Diocletian grouped the provinces into twelve dioceses, each under a vicarius; the number later rose slightly.' },
  { id: 'governors', label: 'Provincial governors', x: 330, y: 240, branch: 'civil', text: 'About a hundred provinces, later more, each with a civil governor who judged cases and supervised taxation, but in most frontier provinces did not command troops.' },
  { id: 'cities', label: 'City councils', x: 330, y: 310, branch: 'civil', text: 'Councillors (curiales) remained responsible for collecting taxes and were increasingly bound to their duties by hereditary obligation.' },
  { id: 'magistri', label: 'Masters of the soldiers', x: 590, y: 100, branch: 'military', text: 'Commanders of infantry and cavalry (magistri militum), at the head of the mobile field armies. In the fifth-century West they became the real power behind the throne.' },
  { id: 'comitatenses', label: 'Field armies', x: 510, y: 200, branch: 'military', text: 'Mobile units (comitatenses), stationed near cities in the interior and moved to meet threats.' },
  { id: 'duces', label: 'Frontier commanders', x: 666, y: 200, branch: 'military', text: 'Duces commanded the frontier troops (limitanei) of one or more provinces.' },
];
const ADMIN_EDGES: [string, string][] = [
  ['emperor', 'palace'],
  ['emperor', 'prefects'],
  ['emperor', 'magistri'],
  ['prefects', 'vicars'],
  ['vicars', 'governors'],
  ['governors', 'cities'],
  ['magistri', 'comitatenses'],
  ['magistri', 'duces'],
];

export function LateAdministration() {
  const [sel, setSel] = useState('prefects');
  const byId = useMemo(() => new Map(ADMIN.map((a) => [a.id, a])), []);
  const a = byId.get(sel)!;
  return (
    <Frame
      title="The late Roman state, c. AD 400"
      caption="Diocletian and Constantine separated civil from military command and multiplied layers of officials. Select an office."
      basis="The Notitia Dignitatum; Jones, The Later Roman Empire; Kelly, Ruling the Later Roman Empire. Simplified: titles and numbers changed during the fourth and fifth centuries."
    >
      <div className="dg-split stack">
        <svg className="dg" viewBox="0 0 740 340" role="group" aria-label="Hierarchy of late Roman government">
          {ADMIN_EDGES.map(([p, c]) => {
            const P = byId.get(p)!;
            const C = byId.get(c)!;
            return <path key={p + c} d={`M${P.x},${P.y + 16} V${(P.y + C.y) / 2} H${C.x} V${C.y - 16}`} className="ln-strong" />;
          })}
          {ADMIN.map((n) => {
            const isSel = n.id === sel;
            const cls = n.branch === 'military' ? 'f-umber' : n.branch === 'palace' ? 'f-porphyry' : n.branch === 'top' ? 'f-oxblood' : 'f-caeruleum';
            return (
              <g
                key={n.id}
                className={`hit ${isSel ? 'sel' : ''}`}
                tabIndex={0}
                role="button"
                aria-pressed={isSel}
                aria-label={n.label}
                onClick={() => setSel(n.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(n.id))}
              >
                <rect x={n.x - 70} y={n.y - 16} width={140} height={32} className={cls} stroke={isSel ? 'var(--text)' : 'none'} strokeWidth={3} />
                <text x={n.x} y={n.y + 5} textAnchor="middle" className="t-on">
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="dg-panel" aria-live="polite">
          <h5>{a.label}</h5>
          <p>{a.text}</p>
        </div>
      </div>
      <div className="dg-legend">
        <span>
          <i style={{ background: 'var(--c-porphyry)' }} />
          palace
        </span>
        <span>
          <i style={{ background: 'var(--c-caeruleum)' }} />
          civil administration
        </span>
        <span>
          <i style={{ background: 'var(--c-umber)' }} />
          army commands
        </span>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Christian growth model                                               */
/* ------------------------------------------------------------------ */

export function ChristianGrowth() {
  const [rate, setRate] = useState(40);
  const POP = 60_000_000;
  const START = 1000;
  const years = useMemo(() => Array.from({ length: 32 }, (_, i) => 40 + i * 10), []);
  const val = (yr: number) => START * Math.pow(1 + rate / 100, (yr - 40) / 10);
  const W = 640;
  const H = 280;
  const L = 50;
  const B = 240;
  const x = (yr: number) => L + ((yr - 40) / (350 - 40)) * (W - L - 20);
  const y = (share: number) => B - Math.min(1, share) * (B - 20);
  const d = years.map((yr, i) => `${i ? 'L' : 'M'}${x(yr)},${y(val(yr) / POP)}`).join(' ');
  const fmt = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)} million` : n >= 10_000 ? `${Math.round(n / 1000)} thousand` : Math.round(n).toLocaleString('en-GB');
  return (
    <Frame
      title="A model of Christian growth"
      caption="Rodney Stark’s model: about 1,000 Christians in AD 40 growing at a constant rate per decade, in an imperial population held at 60 million. Change the rate to see how sensitive the result is. This is a model, not data: no ancient source counts Christians."
      basis="Stark, The Rise of Christianity (1996); Hopkins, ‘Christian Number and Its Implications’ (1998)."
      controls={
        <label className="dg-range">
          <span>Growth per decade: {rate}%</span>
          <input type="range" min={25} max={50} value={rate} onChange={(e) => setRate(Number(e.target.value))} aria-label="Growth per decade" />
        </label>
      }
    >
      <svg className="dg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`At ${rate}% a decade the model gives ${fmt(val(300))} Christians in AD 300.`}>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line x1={L} x2={W - 20} y1={y(t)} y2={y(t)} className="ln" />
            <text x={L - 6} y={y(t) + 4} textAnchor="end" className="t-sm">
              {t * 100}%
            </text>
          </g>
        ))}
        {[50, 100, 150, 200, 250, 300, 350].map((t) => (
          <text key={t} x={x(t)} y={B + 18} textAnchor="middle" className="t-sm">
            {formatYear(t)}
          </text>
        ))}
        <line x1={x(312)} x2={x(312)} y1={20} y2={B} className="ln-dash" />
        <text x={x(312) - 4} y={34} textAnchor="end" className="t-sm">
          Constantine, 312
        </text>
        <path d={d} className="ln-strong" stroke="var(--c-porphyry)" strokeWidth={2.5} />
        <text x={L + 4} y={B - 8} className="t-sm">
          share of a population of 60 million
        </text>
      </svg>
      <div className="dg-legend">
        {[100, 200, 250, 300, 350].map((yr) => (
          <span key={yr}>
            {formatYear(yr)}: <strong>{fmt(Math.min(val(yr), POP))}</strong> ({Math.min(100, (val(yr) / POP) * 100).toFixed(val(yr) / POP < 0.01 ? 2 : 0)}%)
          </span>
        ))}
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Why did the West fall? A causal web                                  */
/* ------------------------------------------------------------------ */

type WNode = { id: string; label: string[]; x: number; y: number; text: string };
const WNODES: WNode[] = [
  { id: 'huns', label: ['Hunnic expansion', 'on the steppe'], x: 110, y: 50, text: 'From the 370s the Huns’ advance pushed Gothic and other groups towards the Roman frontiers, and in the 440s Attila’s empire extracted huge payments.' },
  { id: 'groups', label: ['Armed groups settle', 'inside the empire'], x: 330, y: 50, text: 'Goths after 376 and 382; Vandals, Alans and Sueves after 406; later Burgundians and Franks. They became autonomous forces the state could neither expel nor fully absorb.' },
  { id: 'civil', label: ['Civil wars and', 'usurpations'], x: 560, y: 50, text: 'Usurpers in Britain and Gaul (407–411) and repeated struggles between generals diverted armies from defence and invited outsiders in as allies.' },
  { id: 'court', label: ['Child emperors and', 'dominant generals'], x: 560, y: 180, text: 'Honorius and Valentinian III came to the throne as children; Stilicho, Aetius and Ricimer ruled through them, and rivalries at court led to the murder of the West’s best generals.' },
  { id: 'loss', label: ['Loss of provinces:', 'Britain, Spain, Gaul, Africa'], x: 330, y: 180, text: 'Each territory lost reduced the tax base. Britain was abandoned around 410; much of Spain and Gaul was out of control by the 420s–460s; the loss of Africa in 439 was decisive.' },
  { id: 'fiscal', label: ['Too little revenue', 'to pay the army'], x: 110, y: 180, text: 'Without revenue, the government could not maintain a regular army and relied more on federate groups paid with land or shares of tax.' },
  { id: 'federates', label: ['Dependence on', 'barbarian federates'], x: 110, y: 310, text: 'Federate armies fought for Rome but followed their own kings and interests, which strengthened them at the state’s expense.' },
  { id: 'elites', label: ['Local elites deal with', 'new rulers'], x: 330, y: 310, text: 'Provincial aristocrats and bishops increasingly found it safer to work with barbarian kings than to rely on a distant and weak emperor.' },
  { id: 'east', label: ['The East survives', 'and pays enemies off'], x: 560, y: 310, text: 'Constantinople had secure walls, rich unthreatened provinces and shorter frontiers, and could pay or persuade enemies to move west. It helped the West at times (468) but put its own security first.' },
];
const WEDGES: [string, string][] = [
  ['huns', 'groups'],
  ['groups', 'loss'],
  ['civil', 'groups'],
  ['civil', 'loss'],
  ['court', 'civil'],
  ['loss', 'fiscal'],
  ['fiscal', 'federates'],
  ['federates', 'groups'],
  ['loss', 'elites'],
  ['federates', 'elites'],
  ['east', 'groups'],
];
const LENSES = {
  all: { label: 'All factors', nodes: WNODES.map((n) => n.id), who: 'Most historians combine these factors, weighting them differently.' },
  heather: { label: 'Heather', nodes: ['huns', 'groups', 'loss', 'fiscal'], who: 'Peter Heather: the Huns’ impact outside the frontier was the prime mover; the loss of revenue-producing provinces made recovery impossible.' },
  halsall: { label: 'Halsall', nodes: ['civil', 'court', 'groups', 'elites'], who: 'Guy Halsall: the crisis began inside the empire, as political failure drew barbarian groups into Roman conflicts.' },
  goffart: { label: 'Goffart', nodes: ['federates', 'elites'], who: 'Walter Goffart: settlement was accommodated, often through tax-sharing, and transformation was managed rather than violent.' },
  wardperkins: { label: 'Ward-Perkins', nodes: ['groups', 'loss', 'fiscal', 'elites'], who: 'Bryan Ward-Perkins: violent conquest destroyed the economic complexity that sustained Roman life.' },
} as const;
type LensKey = keyof typeof LENSES;

export function WestCauses() {
  const [sel, setSel] = useState('loss');
  const [lens, setLens] = useState<LensKey>('all');
  const byId = useMemo(() => new Map(WNODES.map((n) => [n.id, n])), []);
  const focus = new Set<string>(LENSES[lens].nodes);
  const n = byId.get(sel)!;
  return (
    <Frame
      title="Why did the western empire fall? A web of causes"
      caption="Causes interacted rather than acting alone. Select a factor to read about it; choose a historian to see which factors their account emphasises."
      basis="Heather, The Fall of the Roman Empire (2005); Halsall, Barbarian Migrations (2007); Goffart, Barbarians and Romans (1980); Ward-Perkins, The Fall of Rome (2005). The lenses are simplifications of complex arguments."
      controls={
        <Toggle
          label="Historian's emphasis"
          value={lens}
          onChange={setLens}
          options={(Object.keys(LENSES) as LensKey[]).map((k) => ({ id: k, label: LENSES[k].label }))}
        />
      }
    >
      <div className="dg-split stack">
        <svg className="dg" viewBox="0 0 680 370" role="group" aria-label="Network of causes of the fall of the western empire">
          <defs>
            <marker id="wc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className="arrowhead" />
            </marker>
          </defs>
          {WEDGES.map(([a, b]) => {
            const A = byId.get(a)!;
            const B = byId.get(b)!;
            const [x1, y1] = exitPoint(A.x, A.y, B.x, B.y, 88, 26);
            const [x2, y2] = exitPoint(B.x, B.y, A.x, A.y, 88, 26, 6);
            const on = focus.has(a) && focus.has(b);
            return (
              <line
                key={a + b}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className="ln-strong"
                markerEnd="url(#wc-arrow)"
                opacity={on ? 1 : 0.2}
              />
            );
          })}
          {WNODES.map((w) => {
            const isSel = w.id === sel;
            const on = focus.has(w.id);
            return (
              <g
                key={w.id}
                className={`hit ${isSel ? 'sel' : ''} ${on ? '' : 'dim'}`}
                tabIndex={0}
                role="button"
                aria-pressed={isSel}
                aria-label={w.label.join(' ')}
                onClick={() => setSel(w.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(w.id))}
              >
                <rect x={w.x - 88} y={w.y - 26} width={176} height={52} rx={2} className="box" stroke={isSel ? 'var(--text)' : undefined} strokeWidth={isSel ? 2 : 1} />
                {w.label.map((l, i) => (
                  <text key={l} x={w.x} y={w.y - 4 + i * 16} textAnchor="middle">
                    {l}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
        <div className="dg-panel" aria-live="polite">
          <h5>{n.label.join(' ')}</h5>
          <p>{n.text}</p>
          <p className="hint">{LENSES[lens].who}</p>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Theodosian walls                                                     */
/* ------------------------------------------------------------------ */

const WALL_PARTS = [
  { id: 'moat', name: 'Moat', text: 'A ditch about 20 metres wide, partly fed with water in places, with a low crenellated wall on its inner edge.' },
  { id: 'outer', name: 'Outer wall', text: 'About 8.5 metres high, with its own towers set between those of the inner wall, so that defenders on both walls could fire at the same time.' },
  { id: 'terrace', name: 'Terrace (peribolos)', text: 'A space between the walls, about 15–20 metres wide, where troops could move along the line.' },
  { id: 'inner', name: 'Inner wall', text: 'The main wall, about 12 metres high and nearly 5 metres thick, with 96 towers up to about 20 metres high.' },
];

export function TheodosianWalls() {
  const [sel, setSel] = useState('inner');
  const p = WALL_PARTS.find((x) => x.id === sel)!;
  const ground = 230;
  const shapes: Record<string, ReactElement> = {
    moat: (
      <g>
        <path d={`M40,${ground} L60,${ground + 40} L150,${ground + 40} L170,${ground} Z`} fill="color-mix(in srgb, var(--c-caeruleum) 30%, var(--surface))" stroke="var(--rule-strong)" />
        <rect x={166} y={ground - 22} width={10} height={22} className="f-slate" />
      </g>
    ),
    outer: <rect x={260} y={ground - 85} width={22} height={85} className="f-slate" />,
    terrace: <rect x={282} y={ground - 4} width={150} height={4} className="f-umber" />,
    inner: (
      <g>
        <rect x={432} y={ground - 120} width={46} height={120} className="f-oxblood" />
        <rect x={420} y={ground - 200} width={70} height={80} fill="none" stroke="var(--c-oxblood)" strokeDasharray="4 3" />
        <text x={455} y={ground - 205} textAnchor="middle" className="t-sm">
          tower
        </text>
      </g>
    ),
  };
  return (
    <Frame
      title="The land walls of Constantinople"
      caption="A section through the triple defences built under Theodosius II (completed in 413, outer wall after 447). Select a part. Dimensions are approximate and varied along the line."
      basis="Archaeological surveys summarised in the Oxford Dictionary of Byzantium; not to scale vertically."
    >
      <svg className="dg" viewBox="0 0 640 300" role="group" aria-label="Section through the Theodosian walls">
        <line x1={0} y1={ground} x2={640} y2={ground} className="ln" />
        <text x={20} y={ground - 10} className="t-sm">
          outside
        </text>
        <text x={620} y={ground - 10} textAnchor="end" className="t-sm">
          city
        </text>
        <rect x={176} y={ground - 3} width={84} height={3} className="f-rule" />
        {WALL_PARTS.map((w) => {
          const isSel = w.id === sel;
          return (
            <g
              key={w.id}
              className={`hit ${isSel ? '' : 'dim'}`}
              style={{ opacity: isSel ? 1 : 0.55 }}
              tabIndex={0}
              role="button"
              aria-pressed={isSel}
              aria-label={w.name}
              onClick={() => setSel(w.id)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(w.id))}
            >
              {shapes[w.id]}
              <text
                x={w.id === 'moat' ? 105 : w.id === 'outer' ? 271 : w.id === 'terrace' ? 357 : 455}
                y={w.id === 'moat' ? ground + 60 : w.id === 'terrace' ? ground + 22 : ground + 22}
                textAnchor="middle"
                className="t-sm"
                style={{ fill: 'var(--text)' }}
              >
                {w.name}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="dg-status" aria-live="polite">
        <strong>{p.name}.</strong> {p.text}
      </p>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Climate and pandemics                                                */
/* ------------------------------------------------------------------ */

export function ClimateTimeline() {
  const A0 = astro(-200);
  const A1 = astro(760);
  const W = 700;
  const L = 24;
  const R = 640;
  const x = (y: number) => L + ((astro(y) - A0) / (A1 - A0)) * (R - L);
  const bands = [
    { from: -200, to: 150, label: 'Roman Climate Optimum', sub: 'warmer, stable, often wetter', cls: 'f-verdigris', below: true },
    { from: 150, to: 450, label: 'Transitional period', sub: 'more variable', cls: 'f-ochre', below: true },
    { from: 536, to: 660, label: 'Late Antique Little Ice Age', sub: 'abrupt cooling after eruptions', cls: 'f-caeruleum', below: true },
  ];
  const events = [
    { year: 165, label: 'Antonine plague, 165', row: 0 },
    { year: 249, label: 'Plague of Cyprian, c. 249', row: 1 },
    { year: 536, label: 'Eruptions 536, 539/40', row: 0 },
    { year: 541, label: 'Justinianic plague, 541 to c. 750', row: 2 },
  ];
  const barY = 92;
  return (
    <Frame
      title="Climate phases and pandemics"
      caption="Approximate climate phases as reconstructed from tree rings, ice cores, cave deposits and lake sediments, with the three great pandemics. Climate varied by region, and the boundaries between phases are approximate."
      basis="McCormick et al. (2012); Büntgen et al. (2016); Harper, The Fate of Rome (2017). Labels follow Harper and Büntgen; other scholars divide the period differently."
    >
      <svg className="dg" viewBox={`0 0 ${W} 264`} role="img" aria-label="Timeline of Roman climate phases from 200 BC to AD 750 with pandemic markers">
        {events.map((e) => {
          const ly = 18 + e.row * 18;
          return (
            <g key={e.label}>
              <line x1={x(e.year)} x2={x(e.year)} y1={ly + 4} y2={barY + 28} stroke="var(--c-cinnabar)" strokeWidth={2} />
              <text x={x(e.year) + (e.year > 500 ? -5 : 5)} y={ly} textAnchor={e.year > 500 ? 'end' : 'start'} className="t-sm" style={{ fill: 'var(--c-cinnabar)' }}>
                {e.label}
              </text>
            </g>
          );
        })}
        {bands.map((b) => (
          <g key={b.label}>
            <rect x={x(b.from)} y={barY} width={x(b.to) - x(b.from)} height={24} className={b.cls} opacity={0.85} />
            <text x={x(b.from) + 2} y={barY + 42} className="t-sm" style={{ fill: 'var(--text)', fontWeight: 600 }}>
              {b.label}
            </text>
            <text x={x(b.from) + 2} y={barY + 56} className="t-sm">
              {b.sub}
            </text>
          </g>
        ))}
        <line x1={L} x2={R} y1={174} y2={174} className="ln" />
        {[-200, 1, 200, 400, 600].map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={174} y2={180} className="ln" />
            <text x={x(t)} y={194} textAnchor="middle" className="t-sm">
              {formatYear(t)}
            </text>
          </g>
        ))}
        {[
          [-27, 'Augustus'],
          [284, 'Diocletian'],
          [476, '476'],
          [632, 'Arab conquests begin'],
        ].map(([t, l]) => (
          <g key={l as string}>
            <circle cx={x(t as number)} cy={218} r={3} className="f-slate" />
            <text x={x(t as number)} y={236} textAnchor="middle" className="t-sm">
              {l as string}
            </text>
          </g>
        ))}
      </svg>
    </Frame>
  );
}
