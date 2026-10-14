import { useEffect, useMemo, useRef, useState } from 'react';
import { astro, formatYear, fromAstro } from '../../lib/dates';
import { Frame, Toggle, exitPoint, reducedMotion } from './Frame';

/* ------------------------------------------------------------------ */
/* Cursus honorum                                                      */
/* ------------------------------------------------------------------ */

type Office = {
  id: string;
  name: string;
  perYear: number;
  annual: string;
  age: string;
  imperium: boolean;
  duties: string;
  note?: string;
  optional?: boolean;
};

const OFFICES: Office[] = [
  {
    id: 'censor',
    name: 'Censor',
    perYear: 2,
    annual: 'Two, elected about every five years for eighteen months',
    age: 'Normally former consuls',
    imperium: false,
    duties:
      'Held the census of citizens and property, assigned citizens to classes and tribes, revised the roll of the Senate and let public contracts.',
    note: 'The most prestigious office, but without imperium. Sulla made entry to the Senate automatic for quaestors, which reduced the censors’ power.',
  },
  {
    id: 'consul',
    name: 'Consul',
    perYear: 2,
    annual: 'Two each year',
    age: '42 (after Sulla)',
    imperium: true,
    duties:
      'Chief magistrates: commanded armies, presided over the Senate and the centuriate assembly, and gave their names to the year.',
    note: 'After the year in office, a consul’s command could be extended as proconsul to govern a province.',
  },
  {
    id: 'praetor',
    name: 'Praetor',
    perYear: 8,
    annual: 'Eight a year after Sulla (one from 367 BC, two from c. 242 BC, later six)',
    age: '39 (after Sulla)',
    imperium: true,
    duties: 'Administered justice in Rome and, from 227 BC, governed provinces; could command armies.',
    note: 'After Sulla, praetors served their year in Rome running the courts and then governed provinces as propraetors or proconsuls.',
  },
  {
    id: 'aedile',
    name: 'Aedile',
    perYear: 4,
    annual: 'Four: two curule and two plebeian',
    age: 'about 36; not required for the ladder',
    imperium: false,
    optional: true,
    duties: 'Supervised streets, markets, the grain supply and public games.',
    note: 'Lavish games as aedile could win votes for the praetorship, at ruinous cost.',
  },
  {
    id: 'tribune',
    name: 'Tribune of the plebs',
    perYear: 10,
    annual: 'Ten, elected by plebeians only',
    age: 'Plebeians only; not required for the ladder',
    imperium: false,
    optional: true,
    duties: 'Protected citizens, could veto any magistrate or decree of the Senate, and proposed laws to the plebeian assembly.',
    note: 'Sulla barred ex-tribunes from higher office; the restriction was lifted in 75 BC and the tribunes’ full powers restored in 70 BC.',
  },
  {
    id: 'quaestor',
    name: 'Quaestor',
    perYear: 20,
    annual: 'Twenty a year after Sulla',
    age: '30 (after Sulla)',
    imperium: false,
    duties: 'Managed public finances in Rome and the accounts and supplies of commanders and governors.',
    note: 'After Sulla, election as quaestor brought membership of the Senate for life.',
  },
];

export function CursusHonorum() {
  const [sel, setSel] = useState('consul');
  const o = OFFICES.find((x) => x.id === sel)!;
  const main = ['quaestor', 'praetor', 'consul', 'censor'];
  const W = 520;
  const rowY: Record<string, number> = { censor: 40, consul: 110, praetor: 190, quaestor: 290, aedile: 240, tribune: 240 };
  const width = (n: number) => 46 + n * 15;
  return (
    <Frame
      title="The cursus honorum after Sulla (81 BC)"
      caption="Width shows the number of posts each year: twenty quaestors competed, in time, for two consulships. Select an office for its powers."
      basis="Lintott, The Constitution of the Roman Republic; ages are the minimums usually inferred from Sulla’s law and Cicero’s career, and the earlier lex Villia (180 BC) figures are uncertain."
    >
      <div className="dg-split">
        <svg className="dg" viewBox={`0 0 ${W} 340`} role="group" aria-label="The sequence of Roman offices">
          <defs>
            <marker id="ch-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className="arrowhead" />
            </marker>
          </defs>
          {main.slice(0, -1).map((id, i) => (
            <line
              key={id}
              x1={W / 2 - 40}
              x2={W / 2 - 40}
              y1={rowY[id] - 18}
              y2={rowY[main[i + 1]] + 20}
              className="ln-strong"
              markerEnd="url(#ch-arrow)"
            />
          ))}
          <text x={W / 2 - 40} y={334} textAnchor="middle" className="t-sm">
            ten years of military service or campaigns
          </text>
          {OFFICES.map((x) => {
            const y = rowY[x.id];
            const w = width(x.perYear);
            const cx = x.id === 'aedile' ? W - 90 : x.id === 'tribune' ? 112 : W / 2 - 40;
            const isSel = x.id === sel;
            return (
              <g
                key={x.id}
                className={`hit ${isSel ? 'sel' : ''}`}
                tabIndex={0}
                role="button"
                aria-pressed={isSel}
                aria-label={x.name}
                onClick={() => setSel(x.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(x.id))}
              >
                <rect
                  x={cx - w / 2}
                  y={y - 18}
                  width={w}
                  height={36}
                  rx={2}
                  className={x.imperium ? 'f-cinnabar' : x.optional ? 'box' : 'f-slate'}
                  strokeDasharray={x.optional ? '4 3' : undefined}
                  stroke={isSel ? 'var(--text)' : 'var(--rule-strong)'}
                  strokeWidth={isSel ? 2 : 1}
                />
                <text x={cx} y={y + 4} textAnchor="middle" className={x.optional ? '' : 't-on'}>
                  {x.name}
                </text>
                <text x={cx + w / 2 + 6} y={y + 4} className="t-sm" textAnchor="start">
                  {x.optional ? '' : `×${x.perYear}`}
                </text>
              </g>
            );
          })}
          <text x={112} y={268} textAnchor="middle" className="t-sm">
            optional ×10
          </text>
          <text x={W - 90} y={268} textAnchor="middle" className="t-sm">
            optional ×4
          </text>
        </svg>
        <div className="dg-panel" aria-live="polite">
          <h5>{o.name}</h5>
          <dl>
            <dt>Posts</dt>
            <dd>{o.annual}</dd>
            <dt>Minimum age</dt>
            <dd>{o.age}</dd>
            <dt>Imperium</dt>
            <dd>{o.imperium ? 'Yes: could command armies' : 'No'}</dd>
          </dl>
          <p>{o.duties}</p>
          {o.note && <p className="hint">{o.note}</p>}
        </div>
      </div>
      <div className="dg-legend">
        <span>
          <i className="dg-key" style={{ background: 'var(--c-cinnabar)' }} />
          office with imperium
        </span>
        <span>
          <i style={{ background: 'var(--c-slate)' }} />
          required office without imperium
        </span>
        <span>
          <i style={{ border: '1px dashed var(--rule-strong)' }} />
          optional office
        </span>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Centuriate assembly                                                 */
/* ------------------------------------------------------------------ */

const CLASSES = [
  { label: 'Equites (cavalry)', n: 18, fill: 'var(--c-porphyry)' },
  { label: 'First class', n: 80, fill: 'var(--c-cinnabar)' },
  { label: 'Engineers', n: 2, fill: 'var(--c-cinnabar)' },
  { label: 'Second class', n: 20, fill: 'var(--c-ochre)' },
  { label: 'Third class', n: 20, fill: 'var(--c-umber)' },
  { label: 'Fourth class', n: 20, fill: 'var(--c-verdigris)' },
  { label: 'Fifth class', n: 30, fill: 'var(--c-caeruleum)' },
  { label: 'Musicians', n: 2, fill: 'var(--c-caeruleum)' },
  { label: 'Proletarii (one century)', n: 1, fill: 'var(--c-slate)' },
];
const TOTAL = CLASSES.reduce((a, c) => a + c.n, 0); // 193
const MAJORITY = Math.floor(TOTAL / 2) + 1; // 97

export function CenturiateAssembly() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!running) return;
    if (reducedMotion()) {
      setCount(MAJORITY);
      setRunning(false);
      return;
    }
    timer.current = window.setInterval(() => {
      setCount((c) => {
        if (c + 1 >= MAJORITY) {
          setRunning(false);
          return MAJORITY;
        }
        return c + 1;
      });
    }, 28);
    return () => window.clearInterval(timer.current);
  }, [running]);

  const cell = 11;
  const gap = 3;
  const perRow = 40;
  let idx = 0;
  let y = 8;
  const rows: { label: string; y: number; cells: { x: number; y: number; i: number; fill: string }[]; h: number }[] = [];
  for (const c of CLASSES) {
    const cells: { x: number; y: number; i: number; fill: string }[] = [];
    for (let k = 0; k < c.n; k++) {
      const r = Math.floor(k / perRow);
      cells.push({ x: 160 + (k % perRow) * (cell + gap), y: y + r * (cell + gap), i: idx++, fill: c.fill });
    }
    const h = Math.ceil(c.n / perRow) * (cell + gap);
    rows.push({ label: `${c.label}: ${c.n}`, y, cells, h });
    y += h + 6;
  }
  const H = y + 4;
  const done = count >= MAJORITY;
  return (
    <Frame
      title="Voting in the centuriate assembly"
      caption={`Votes were counted by century, not by head. The 18 equestrian centuries and the 80 of the first class (with 2 of engineers) made 100 of 193: a majority, if they agreed, before the poorer classes were called. The poorest citizens, the proletarii, formed a single century.`}
      basis="Livy 1.43 and Dionysius of Halicarnassus 4.16–21, describing the system attributed to Servius Tullius. A reform in the third century BC linked the first class to the 35 tribes and reduced its centuries; its details are debated."
      controls={
        <>
          <button type="button" className="btn small" onClick={() => (setCount(0), setRunning(true))} disabled={running}>
            {count === 0 ? 'Hold an election' : 'Vote again'}
          </button>
          <button type="button" className="btn small ghost" onClick={() => (setRunning(false), setCount(0))}>
            Reset
          </button>
        </>
      }
    >
      <svg className="dg" viewBox={`0 0 ${160 + perRow * (cell + gap) + 10} ${H}`} role="img" aria-label={`193 centuries grouped by property class; ${count} have voted.`}>
        {rows.map((r) => (
          <g key={r.label}>
            <text x={150} y={r.y + 10} textAnchor="end" className="t-sm">
              {r.label}
            </text>
            {r.cells.map((c) => (
              <rect
                key={c.i}
                x={c.x}
                y={c.y}
                width={cell}
                height={cell}
                fill={c.i < count ? c.fill : 'var(--inset)'}
                stroke={c.i < count ? 'none' : 'var(--rule)'}
              />
            ))}
          </g>
        ))}
      </svg>
      <p className="dg-status" aria-live="polite">
        {count === 0
          ? `A majority is ${MAJORITY} of ${TOTAL} centuries. Press the button to see how far down the classes voting went if the wealthy voted together.`
          : done
            ? `Majority reached after ${MAJORITY} centuries. The second to fifth classes and the proletarii were never asked. (If the first class split, voting continued down the classes.)`
            : `${count} centuries have voted…`}
      </p>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Polybius' mixed constitution                                        */
/* ------------------------------------------------------------------ */

const MIXED = {
  consuls: {
    name: 'Consuls (the monarchic element)',
    powers: 'Command armies with near-absolute power in the field; summon and preside over the Senate and assemblies; carry out decrees.',
    checks: [
      'The Senate controls the supply of grain, clothing and pay to armies, can replace a commander after his year, and decides whether he may celebrate a triumph.',
      'The people must ratify treaties and peace terms, and a consul must render account of his conduct to them after his year.',
    ],
  },
  senate: {
    name: 'Senate (the aristocratic element)',
    powers: 'Controls the treasury, investigates serious crimes in Italy, receives embassies and manages relations with allies and foreign states.',
    checks: [
      'The people decide capital trials and can pass laws affecting the Senate’s privileges and property.',
      'Any tribune of the plebs can veto the Senate’s decrees and even prevent it from meeting.',
    ],
  },
  people: {
    name: 'People (the democratic element)',
    powers: 'Elect magistrates, pass laws, decide on war and peace, ratify treaties, and judge capital cases.',
    checks: [
      'Many citizens depend on public contracts let by the censors under the Senate’s authority, and judges in important civil cases are senators.',
      'On campaign every citizen is subject to the consul’s imperium.',
    ],
  },
} as const;
type MixedKey = keyof typeof MIXED;

export function MixedConstitution() {
  const [sel, setSel] = useState<MixedKey>('senate');
  const pos: Record<MixedKey, [number, number]> = { consuls: [210, 50], senate: [70, 250], people: [350, 250] };
  const item = MIXED[sel];
  return (
    <Frame
      title="Polybius' mixed constitution"
      caption="Polybius argued that each of the three elements could both help and hinder the others, so that none could dominate. Select an element to see its powers and the checks on it."
      basis="Polybius 6.11–18, written c. 150 BC. A Greek theoretical model: it describes formal powers and omits wealth, patronage and the nobility’s dominance."
    >
      <div className="dg-split">
        <svg className="dg" viewBox="0 0 420 300" role="group" aria-label="Three elements of the Roman constitution">
          {(['consuls', 'senate', 'people'] as MixedKey[]).map((a, i, arr) => {
            const b = arr[(i + 1) % 3];
            const [x1, y1] = pos[a];
            const [x2, y2] = pos[b];
            const active = sel === a || sel === b;
            return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} className={active ? 'ln-strong' : 'ln'} />;
          })}
          <text x={210} y={190} textAnchor="middle" className="t-sm">
            each can check
          </text>
          <text x={210} y={206} textAnchor="middle" className="t-sm">
            and assist the others
          </text>
          {(Object.keys(MIXED) as MixedKey[]).map((k) => {
            const [x, y] = pos[k];
            const isSel = k === sel;
            const label = k === 'consuls' ? 'Consuls' : k === 'senate' ? 'Senate' : 'People';
            return (
              <g
                key={k}
                className={`hit ${isSel ? 'sel' : ''}`}
                tabIndex={0}
                role="button"
                aria-pressed={isSel}
                aria-label={MIXED[k].name}
                onClick={() => setSel(k)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(k))}
              >
                <circle cx={x} cy={y} r={40} className={k === 'consuls' ? 'f-cinnabar' : k === 'senate' ? 'f-porphyry' : 'f-caeruleum'} stroke={isSel ? 'var(--text)' : 'none'} strokeWidth={3} />
                <text x={x} y={y + 5} textAnchor="middle" className="t-on t-lg">
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="dg-panel" aria-live="polite">
          <h5>{item.name}</h5>
          <p>{item.powers}</p>
          <p className="hint">Checked by:</p>
          <ul>
            {item.checks.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Cannae                                                              */
/* ------------------------------------------------------------------ */

const CANNAE_STEPS = [
  {
    title: '1. Deployment',
    text: 'The Romans deepen their infantry into a dense mass. Hannibal pushes his Gallic and Spanish infantry forward in a crescent, keeps his African veterans on the wings, and places heavy cavalry under Hasdrubal facing the Roman horse by the river.',
  },
  {
    title: '2. The cavalry battle',
    text: 'Hasdrubal’s heavy cavalry routs the Roman cavalry on the Roman right. On the other wing the Numidian horse ties down the allied cavalry. Meanwhile the Roman infantry advances.',
  },
  {
    title: '3. The centre gives way',
    text: 'The Roman mass drives the crescent back until it bends inwards. Pressing into the gap, the Romans are drawn between the African infantry on both wings, who turn inward against their flanks.',
  },
  {
    title: '4. Encirclement',
    text: 'Hasdrubal’s cavalry, having driven off the allied horse as well, falls on the Roman rear. Surrounded and too compressed to fight, the Roman army is destroyed.',
  },
];

type Geo = { x: number; y: number; w: number; h: number };
function Unit({ g, cls, o = 1, label }: { g: Geo; cls: string; o?: number; label?: string }) {
  return (
    <g style={{ transition: 'opacity 700ms ease', opacity: o }}>
      <rect x={g.x} y={g.y} width={g.w} height={g.h} className={cls} style={{ transition: 'x 700ms ease, y 700ms ease, width 700ms ease, height 700ms ease' }} />
      {label && (
        <text x={g.x + g.w / 2} y={g.y + g.h / 2 + 4} textAnchor="middle" className="t-sm" style={{ fill: 'var(--surface)', transition: 'x 700ms ease, y 700ms ease' }}>
          {label}
        </text>
      )}
    </g>
  );
}

export function Cannae() {
  const [step, setStep] = useState(0);
  const s = CANNAE_STEPS[step];
  // geometry per step
  const romanInf = [
    { x: 190, y: 255, w: 260, h: 50 },
    { x: 190, y: 220, w: 260, h: 50 },
    { x: 215, y: 180, w: 210, h: 66 },
    { x: 222, y: 176, w: 196, h: 70 },
  ][step];
  const crescent = [
    'M190,160 Q320,215 450,160 L450,140 Q320,195 190,140 Z',
    'M190,170 Q320,185 450,170 L450,150 Q320,165 190,150 Z',
    'M190,155 Q320,115 450,155 L450,135 Q320,95 190,135 Z',
    'M200,155 Q320,112 440,155 L440,135 Q320,92 200,135 Z',
  ][step];
  const africans = [
    [
      { x: 122, y: 135, w: 62, h: 36 },
      { x: 456, y: 135, w: 62, h: 36 },
    ],
    [
      { x: 122, y: 140, w: 62, h: 36 },
      { x: 456, y: 140, w: 62, h: 36 },
    ],
    [
      { x: 146, y: 180, w: 62, h: 66 },
      { x: 432, y: 180, w: 62, h: 66 },
    ],
    [
      { x: 158, y: 176, w: 62, h: 70 },
      { x: 420, y: 176, w: 62, h: 70 },
    ],
  ][step];
  const hasdrubal = [
    { x: 532, y: 135, w: 84, h: 36 },
    { x: 532, y: 222, w: 84, h: 36 },
    { x: 280, y: 300, w: 100, h: 28 },
    { x: 222, y: 254, w: 196, h: 26 },
  ][step];
  const romanCav = [
    { x: 532, y: 265, w: 84, h: 34, o: 1 },
    { x: 560, y: 300, w: 70, h: 28, o: 0.35 },
    { x: 580, y: 330, w: 50, h: 20, o: 0 },
    { x: 580, y: 330, w: 50, h: 20, o: 0 },
  ][step];
  const alliedCav = [
    { x: 24, y: 265, w: 84, h: 34, o: 1 },
    { x: 24, y: 270, w: 84, h: 34, o: 1 },
    { x: 14, y: 300, w: 70, h: 28, o: 0.4 },
    { x: 10, y: 330, w: 50, h: 20, o: 0 },
  ][step];
  const numidians = [
    { x: 24, y: 135, w: 84, h: 36 },
    { x: 24, y: 222, w: 84, h: 36 },
    { x: 20, y: 262, w: 84, h: 30 },
    { x: 24, y: 290, w: 84, h: 30 },
  ][step];
  return (
    <Frame
      title="The battle of Cannae, 216 BC"
      caption="A schematic, not a map: units are shown in their roles, not to scale, and the exact location of the battlefield on the Aufidus river is itself debated."
      basis="Polybius 3.113–117 and Livy 22.45–49. Numbers in the sources: about 80,000 Roman and allied infantry and 6,000 cavalry; Hannibal about 40,000 infantry and 10,000 cavalry."
      controls={
        <div className="dg-steps">
          <button type="button" className="btn small ghost" onClick={() => setStep((x) => Math.max(0, x - 1))} disabled={step === 0}>
            Previous
          </button>
          <span className="ui small">
            {step + 1} / {CANNAE_STEPS.length}
          </span>
          <button type="button" className="btn small" onClick={() => setStep((x) => Math.min(CANNAE_STEPS.length - 1, x + 1))} disabled={step === CANNAE_STEPS.length - 1}>
            Next phase
          </button>
        </div>
      }
    >
      <svg className="dg" viewBox="0 0 640 360" role="img" aria-label={`${s.title}. ${s.text}`}>
        <path d="M0,40 C140,20 300,60 460,30 S620,40 640,30" className="ln" strokeWidth={6} stroke="var(--c-caeruleum)" opacity={0.35} />
        <text x={24} y={62} className="t-sm">
          river Aufidus (schematic)
        </text>
        <text x={320} y={70} textAnchor="middle" className="t-sm">
          Hannibal’s army
        </text>
        <text x={320} y={350} textAnchor="middle" className="t-sm">
          Roman army
        </text>
        <path d={crescent} className="f-ochre" style={{ transition: 'd 700ms ease' }} />
        <text x={320} y={step === 1 ? 145 : step < 2 ? 132 : 88} textAnchor="middle" className="t-sm" style={{ transition: 'all 700ms ease' }}>
          Gauls and Spaniards
        </text>
        {africans.map((a, i) => (
          <Unit key={i} g={a} cls="f-umber" label="Africans" />
        ))}
        <Unit g={hasdrubal} cls="f-oxblood" label="Hasdrubal" />
        <Unit g={numidians} cls="f-umber" label="Numidians" />
        <Unit g={romanInf} cls="f-cinnabar" label="Roman and allied infantry" />
        <Unit g={romanCav} cls="f-slate" o={romanCav.o} label="Roman cav." />
        <Unit g={alliedCav} cls="f-slate" o={alliedCav.o} label="Allied cav." />
      </svg>
      <p className="dg-status" aria-live="polite">
        <strong>{s.title}.</strong> {s.text}
      </p>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Hopkins: conquerors and slaves                                      */
/* ------------------------------------------------------------------ */

type HNode = { id: string; label: string[]; x: number; y: number; evidence: string; critique?: string };
const HNODES: HNode[] = [
  { id: 'war', label: ['Almost continuous', 'war overseas'], x: 340, y: 40, evidence: 'Rome was at war in almost every year of the second century; Brunt estimated that a large share of adult male citizens served for years at a time.' },
  { id: 'wealth', label: ['Booty and tribute', 'flow to Italy'], x: 560, y: 140, evidence: 'Triumphal booty, war indemnities and provincial revenues; after 167 BC citizens stopped paying direct tax.' },
  { id: 'captives', label: ['Captives sold', 'as slaves'], x: 340, y: 140, evidence: 'Mass enslavements such as 150,000 Epirotes in 167 BC; slave markets at Delos.' },
  { id: 'estates', label: ['The rich buy land and', 'occupy public land'], x: 560, y: 250, evidence: 'Appian and Plutarch on the occupation of ager publicus; Cato’s handbook for a slave-run estate.' , critique: 'Field surveys show villas appearing alongside small farms, not replacing them everywhere.' },
  { id: 'slavework', label: ['Estates worked', 'by slaves'], x: 340, y: 250, evidence: 'Cato’s De agricultura; the scale of the Sicilian slave revolts.' },
  { id: 'absence', label: ['Peasant soldiers', 'away for years'], x: 110, y: 140, evidence: 'Long campaigns in Spain; resistance to the levy in the 150s–130s.', critique: 'Rosenstein: families could spare young unmarried men, so service need not ruin farms.' },
  { id: 'displaced', label: ['Small farms sold', 'or abandoned'], x: 220, y: 350, evidence: 'The Gracchan narratives (Plutarch, Ti. Gracch. 8; Appian, B Civ. 1.7).', critique: 'Regional surveys find many small rural sites continuing; the decline was uneven.' },
  { id: 'migration', label: ['Migration to Rome', 'and colonies'], x: 480, y: 350, evidence: 'Growth of the city of Rome; demand for colonies and land grants.' },
  { id: 'recruits', label: ['Fewer men qualified', 'for the legions'], x: 350, y: 440, evidence: 'Census figures dip in the 130s; Tiberius Gracchus framed his law as a remedy.', critique: 'The census figures can be read in other ways (Rich 1983); the "shortage" may be political perception.' },
];
const HEDGES: [string, string, boolean?][] = [
  ['war', 'wealth'],
  ['war', 'captives'],
  ['war', 'absence'],
  ['wealth', 'estates'],
  ['captives', 'slavework'],
  ['estates', 'slavework'],
  ['estates', 'displaced', true],
  ['absence', 'displaced', true],
  ['slavework', 'displaced'],
  ['displaced', 'migration'],
  ['displaced', 'recruits', true],
  ['migration', 'recruits'],
];

export function HopkinsModel() {
  const [sel, setSel] = useState<string>('war');
  const [crit, setCrit] = useState<'model' | 'critique'>('model');
  const byId = useMemo(() => new Map(HNODES.map((n) => [n.id, n])), []);
  const n = byId.get(sel)!;
  return (
    <Frame
      title="Conquerors and slaves: Hopkins' model"
      caption="Keith Hopkins linked conquest, wealth, slavery and the displacement of Italian peasants in a single process. Select a step to see its evidence; switch to the critique to see which links later research has questioned."
      basis="Hopkins, Conquerors and Slaves (1978), ch. 1; Brunt, Italian Manpower (1971); critiques by Rich (1983) and Rosenstein (2004)."
      controls={
        <Toggle
          label="View"
          value={crit}
          onChange={setCrit}
          options={[
            { id: 'model', label: 'The model' },
            { id: 'critique', label: 'Where it is challenged' },
          ]}
        />
      }
    >
      <div className="dg-split stack">
        <svg className="dg" viewBox="0 0 680 470" role="group" aria-label="Hopkins' model as a network of causes">
          <defs>
            <marker id="hm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className="arrowhead" />
            </marker>
          </defs>
          {HEDGES.map(([a, b, contested]) => {
            const A = byId.get(a)!;
            const B = byId.get(b)!;
            const [x1, y1] = exitPoint(A.x, A.y, B.x, B.y, 78, 24);
            const [x2, y2] = exitPoint(B.x, B.y, A.x, A.y, 78, 24, 6);
            const show = crit === 'critique' && contested;
            return (
              <line
                key={a + b}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={show ? 'ln-dash' : 'ln-strong'}
                stroke={show ? 'var(--c-cinnabar)' : undefined}
                strokeWidth={show ? 2 : 1.2}
                markerEnd="url(#hm-arrow)"
                opacity={sel === a || sel === b ? 1 : 0.55}
              />
            );
          })}
          {HNODES.map((h) => {
            const isSel = h.id === sel;
            const flagged = crit === 'critique' && h.critique;
            return (
              <g
                key={h.id}
                className={`hit ${isSel ? 'sel' : ''}`}
                tabIndex={0}
                role="button"
                aria-pressed={isSel}
                aria-label={h.label.join(' ')}
                onClick={() => setSel(h.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(h.id))}
              >
                <rect x={h.x - 78} y={h.y - 24} width={156} height={48} rx={3} className="box" stroke={flagged ? 'var(--c-cinnabar)' : undefined} strokeWidth={flagged ? 2 : 1} />
                {h.label.map((l, i) => (
                  <text key={l} x={h.x} y={h.y - 4 + i * 16} textAnchor="middle">
                    {l}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
        <div className="dg-panel" aria-live="polite">
          <h5>{n.label.join(' ')}</h5>
          <p>
            <strong>Evidence: </strong>
            {n.evidence}
          </p>
          {n.critique ? (
            <p>
              <strong>Challenge: </strong>
              {n.critique}
            </p>
          ) : (
            <p className="hint">This step is not seriously disputed, though its scale is.</p>
          )}
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Augustus' powers over time                                          */
/* ------------------------------------------------------------------ */

type PowerRow = { label: string; spans: [number, number][]; ticks?: number[]; note: string };
const POWERS: PowerRow[] = [
  { label: 'Triumvir', spans: [[-43, -33]], note: 'Board of three under the lex Titia, renewed in 37 BC; lapsed at the end of 33 or in 32 BC.' },
  { label: 'Consul', spans: [[-43, -43], [-33, -33], [-31, -23], [-5, -5], [-2, -2]], note: 'Consul every year from 31 to 23 BC; afterwards only twice, to introduce his grandsons to public life.' },
  { label: 'Province with the armies', spans: [[-27, 14]], ticks: [-18, -13, -8, 3, 13], note: 'Granted in 27 BC for ten years and renewed in 18, 13 and 8 BC and AD 3 and 13.' },
  { label: 'Tribunician power', spans: [[-23, 14]], note: 'Held for life from 23 BC and used to number the years of his rule; he had a tribune’s sacrosanctity from 36 BC.' },
  { label: 'Greater imperium', spans: [[-23, 14]], note: 'Proconsular imperium greater than that of other governors, valid inside Rome as well.' },
  { label: 'Pontifex maximus', spans: [[-12, 14]], note: 'Taken in 12 BC on the death of Lepidus.' },
];
const MARKS: [number, string][] = [
  [-31, 'Actium'],
  [-27, 'Name Augustus'],
  [-2, 'Pater patriae'],
];

export function AugustusPowers() {
  const [year, setYear] = useState(-23);
  const A0 = astro(-44);
  const A1 = astro(14);
  const W = 640;
  const L = 170;
  const x = (y: number) => L + ((astro(y) - A0) / (A1 - A0)) * (W - L - 16);
  const active = POWERS.filter((p) => p.spans.some(([a, b]) => year >= a && year <= b));
  const ticks = [-40, -30, -20, -10, 1, 10];
  return (
    <Frame
      title="How Augustus' powers accumulated"
      caption="Augustus never held a single office called 'emperor'. Move through the years to see which legal powers he held at each point."
      basis="Res Gestae 1–35; Cassius Dio 53–55. Some details, such as the consular powers of 19 BC, are disputed."
      controls={
        <label className="dg-range">
          <span>Year: {formatYear(year)}</span>
          <input
            type="range"
            min={astro(-44)}
            max={astro(14)}
            value={astro(year)}
            onChange={(e) => setYear(fromAstro(Number(e.target.value)))}
            aria-label="Year"
          />
        </label>
      }
    >
      <svg className="dg" viewBox={`0 0 ${W} ${POWERS.length * 34 + 84}`} role="img" aria-label={`In ${formatYear(year)} Augustus held: ${active.map((a) => a.label).join(', ') || 'no formal power'}.`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={18} y2={POWERS.length * 34 + 30} className="ln" />
            <text x={x(t)} y={12} textAnchor="middle" className="t-sm">
              {formatYear(t)}
            </text>
          </g>
        ))}
        {POWERS.map((p, i) => {
          const y0 = 30 + i * 34;
          const on = active.includes(p);
          return (
            <g key={p.label}>
              <text x={L - 8} y={y0 + 15} textAnchor="end" className={on ? '' : 't-muted'}>
                {p.label}
              </text>
              {p.spans.map(([a, b]) => (
                <rect key={a} x={x(a)} y={y0 + 4} width={Math.max(4, x(b) - x(a) + 6)} height={16} className={on ? 'f-cinnabar' : 'f-rule'} />
              ))}
              {p.ticks?.map((t) => (
                <line key={t} x1={x(t) + 3} x2={x(t) + 3} y1={y0 + 1} y2={y0 + 23} stroke="var(--text)" strokeWidth={1.5} />
              ))}
            </g>
          );
        })}
        {MARKS.map(([y, l], i) => (
          <g key={l}>
            <circle cx={x(y) + 3} cy={POWERS.length * 34 + 44} r={4} className="f-porphyry" />
            <text x={x(y) + 3} y={POWERS.length * 34 + 60 + (i % 2) * 14} textAnchor="middle" className="t-sm">
              {l}
            </text>
          </g>
        ))}
        <line x1={x(year) + 3} x2={x(year) + 3} y1={20} y2={POWERS.length * 34 + 34} stroke="var(--c-caeruleum)" strokeWidth={2} />
      </svg>
      <div className="dg-status" aria-live="polite">
        {active.length ? (
          <ul>
            {active.map((a) => (
              <li key={a.label}>
                <strong>{a.label}.</strong> {a.note}
              </li>
            ))}
          </ul>
        ) : (
          <p>In {formatYear(year)} Octavian held no formal power: he commanded an army of Caesar’s veterans raised on his own initiative.</p>
        )}
      </div>
    </Frame>
  );
}
