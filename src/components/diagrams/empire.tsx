import { useState } from 'react';
import { Frame, Toggle, exitPoint } from './Frame';

/* ------------------------------------------------------------------ */
/* The legion: manipular and cohort                                    */
/* ------------------------------------------------------------------ */

export function Legion() {
  const [era, setEra] = useState<'polybian' | 'imperial'>('polybian');
  return (
    <Frame
      title="Inside a legion"
      controls={
        <Toggle
          label="Period"
          value={era}
          onChange={setEra}
          options={[
            { id: 'polybian', label: 'Republic, c. 150 BC' },
            { id: 'imperial', label: 'Empire, 2nd century AD' },
          ]}
        />
      }
      caption={
        era === 'polybian'
          ? 'The manipular legion described by Polybius: three lines of heavy infantry by age and experience, arranged in a chequerboard so that the lines could relieve each other, with light troops in front and cavalry on the wings. Each legion fought beside an allied contingent of at least equal size.'
          : 'The imperial legion of about 5,000 men in ten cohorts. From the late first century AD the first cohort had five double-strength centuries. A small cavalry unit was attached, and auxiliary units of similar total size served alongside.'
      }
      basis={
        era === 'polybian'
          ? 'Polybius 6.19–26. His figures are for a standard legion of 4,200 infantry; legions could be raised larger.'
          : 'Inscriptions, papyri and the plans of legionary fortresses; the date and universality of the double first cohort are debated.'
      }
    >
      {era === 'polybian' ? <Manipular /> : <Cohortal />}
    </Frame>
  );
}

function Manipular() {
  const lines = [
    { label: 'Velites', sub: '1,200 light troops', y: 30, n: 0, cls: 'f-ochre' },
    { label: 'Hastati', sub: '10 maniples × 120', y: 80, n: 10, cls: 'f-cinnabar', offset: 0 },
    { label: 'Principes', sub: '10 maniples × 120', y: 140, n: 10, cls: 'f-oxblood', offset: 1 },
    { label: 'Triarii', sub: '10 maniples × 60', y: 200, n: 10, cls: 'f-umber', offset: 0, half: true },
  ];
  return (
    <svg className="dg" viewBox="0 0 640 260" role="img" aria-label="A manipular legion in three lines with light troops in front">
      <text x={320} y={14} textAnchor="middle" className="t-sm">
        enemy
      </text>
      {lines.map((l) => (
        <g key={l.label}>
          <text x={118} y={l.y + 16} textAnchor="end">
            {l.label}
          </text>
          <text x={118} y={l.y + 31} textAnchor="end" className="t-sm">
            {l.sub}
          </text>
          {l.n === 0 ? (
            Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={182 + i * 10.2} cy={l.y + 18} r={2.5} className="f-ochre" />)
          ) : (
            Array.from({ length: l.n }).map((_, i) => (
              <rect key={i} x={180 + i * 40 + (l.offset ? 20 : 0)} y={l.y + 6} width={22} height={l.half ? 14 : 26} className={l.cls} />
            ))
          )}
        </g>
      ))}
      <rect x={136} y={110} width={30} height={60} className="f-slate" />
      <rect x={600} y={110} width={30} height={60} className="f-slate" />
      <text x={615} y={186} textAnchor="middle" className="t-sm">
        cavalry
      </text>
      <text x={615} y={200} textAnchor="middle" className="t-sm">
        300 in all
      </text>
    </svg>
  );
}

function Cohortal() {
  const cohorts = Array.from({ length: 10 }, (_, i) => i + 1);
  return (
    <svg className="dg" viewBox="0 0 640 300" role="img" aria-label="An imperial legion of ten cohorts">
      <g>
        <rect x={250} y={10} width={140} height={40} className="f-porphyry" />
        <text x={320} y={28} textAnchor="middle" className="t-on">
          Legate (senator)
        </text>
        <text x={320} y={43} textAnchor="middle" className="t-on t-sm" style={{ fill: 'var(--surface)' }}>
          with six tribunes and a camp prefect
        </text>
      </g>
      <line x1={320} y1={50} x2={320} y2={70} className="ln-strong" />
      <line x1={60} y1={70} x2={580} y2={70} className="ln-strong" />
      {cohorts.map((c, i) => {
        const x = 30 + i * 61;
        const first = c === 1;
        const cents = first ? 5 : 6;
        return (
          <g key={c}>
            <line x1={x + 27} y1={70} x2={x + 27} y2={86} className="ln" />
            <rect x={x} y={86} width={54} height={first ? 170 : 140} className="box" />
            <text x={x + 27} y={102} textAnchor="middle" className="t-sm">
              Cohort {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][i]}
            </text>
            {Array.from({ length: cents }).map((_, k) => (
              <rect key={k} x={x + 7} y={110 + k * (first ? 28 : 20)} width={40} height={first ? 24 : 16} className={first ? 'f-oxblood' : 'f-cinnabar'} />
            ))}
            <text x={x + 27} y={first ? 272 : 242} textAnchor="middle" className="t-sm">
              {first ? '5 × 160' : '6 × 80'}
            </text>
          </g>
        );
      })}
      <text x={320} y={292} textAnchor="middle" className="t-sm">
        Each century of 80 commanded by a centurion; about 5,000 men in all, plus 120 cavalry
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Government of a province                                            */
/* ------------------------------------------------------------------ */

type Flow = 'orders' | 'petitions' | 'taxes';
export function ProvincialGovernment() {
  const [flow, setFlow] = useState<Flow>('orders');
  const nodes = [
    { id: 'emperor', label: 'Emperor and his staff', sub: 'answers letters and petitions', x: 320, y: 40, cls: 'f-porphyry' },
    { id: 'senate', label: 'Senate', sub: 'chooses proconsuls by lot', x: 110, y: 40, cls: 'f-slate' },
    { id: 'governor', label: 'Governor', sub: 'legate or proconsul + small staff', x: 230, y: 140, cls: 'f-cinnabar' },
    { id: 'procurator', label: 'Procurator', sub: 'emperor’s finances', x: 450, y: 140, cls: 'f-ochre' },
    { id: 'army', label: 'Army units', sub: 'policing, escort, roads', x: 560, y: 40, cls: 'f-umber' },
    { id: 'cities', label: 'Self-governing cities', sub: 'councils and annual magistrates', x: 320, y: 250, cls: 'f-verdigris' },
    { id: 'people', label: 'Provincials', sub: 'citizens, non-citizens, slaves', x: 320, y: 350, cls: 'f-caeruleum' },
  ];
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const edges: Record<Flow, [string, string, string][]> = {
    orders: [
      ['emperor', 'governor', 'mandates'],
      ['senate', 'governor', 'appoints proconsuls'],
      ['emperor', 'procurator', 'appoints'],
      ['governor', 'cities', 'edicts, assizes'],
      ['cities', 'people', 'local rule'],
    ],
    petitions: [
      ['people', 'cities', 'complaints'],
      ['people', 'governor', 'petitions'],
      ['cities', 'emperor', 'embassies'],
      ['governor', 'emperor', 'letters'],
      ['people', 'emperor', 'petitions'],
    ],
    taxes: [
      ['people', 'cities', 'land and poll tax'],
      ['cities', 'procurator', 'collected sums'],
      ['procurator', 'emperor', 'fiscus'],
      ['people', 'procurator', 'indirect taxes'],
    ],
  };
  return (
    <Frame
      title="How a province was governed"
      caption="Most governing was done by the cities themselves; Roman officials were few. Switch between the flows to see how orders went down, petitions went up, and taxes were collected."
      basis="Garnsey and Saller, The Roman Empire; Millar, The Emperor in the Roman World; Pliny, Letters 10. A simplified model: arrangements differed between provinces and over time."
      controls={
        <Toggle
          label="Flow"
          value={flow}
          onChange={setFlow}
          options={[
            { id: 'orders', label: 'Orders and law' },
            { id: 'petitions', label: 'Petitions' },
            { id: 'taxes', label: 'Taxes' },
          ]}
        />
      }
    >
      <svg className="dg" viewBox="0 0 680 400" role="img" aria-label={`Province government: ${flow}`}>
        <defs>
          <marker id="pg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="arrowhead" />
          </marker>
        </defs>
        {edges[flow].map(([a, b, label]) => {
          const A = byId.get(a)!;
          const B = byId.get(b)!;
          const [x1, y1] = exitPoint(A.x, A.y, B.x, B.y, 90, 22);
          const [x2, y2] = exitPoint(B.x, B.y, A.x, A.y, 90, 22, 6);
          const bend = a === 'people' && b === 'emperor';
          return (
            <g key={a + b}>
              {bend ? (
                <path d={`M ${A.x + 90},${A.y} C 660,330 660,80 ${B.x + 90},${B.y}`} className="ln-strong" markerEnd="url(#pg-arrow)" />
              ) : (
                <line x1={x1} y1={y1} x2={x2} y2={y2} className="ln-strong" markerEnd="url(#pg-arrow)" />
              )}
              {label && (
                <text x={bend ? 640 : (x1 + x2) / 2 + 8} y={bend ? 200 : (y1 + y2) / 2 + 4} className="t-sm" textAnchor={bend ? 'end' : 'start'} paintOrder="stroke" stroke="var(--surface)" strokeWidth={4}>
                  {label}
                </text>
              )}
            </g>
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <rect x={n.x - 90} y={n.y - 22} width={180} height={44} rx={2} className={n.cls} />
            <text x={n.x} y={n.y - 3} textAnchor="middle" className="t-on">
              {n.label}
            </text>
            <text x={n.x} y={n.y + 13} textAnchor="middle" className="t-sm" style={{ fill: 'var(--surface)' }}>
              {n.sub}
            </text>
          </g>
        ))}
      </svg>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Hopkins: taxes and trade                                            */
/* ------------------------------------------------------------------ */

const TT_STEPS = [
  {
    title: 'Taxes',
    text: 'Rich interior provinces (such as Spain, Gaul, Africa, Egypt and Asia) pay taxes, increasingly in coin. Most of the money goes to two places: the city of Rome and the frontier armies.',
  },
  {
    title: 'Spending',
    text: 'The state spends the money on soldiers’ pay, the court and the city of Rome. Soldiers and city-dwellers become consumers concentrated in a few regions.',
  },
  {
    title: 'Trade',
    text: 'To earn back the coin they need for next year’s taxes, the tax-paying provinces sell goods (grain, oil, wine, cloth, pottery) to the places where the money was spent.',
  },
  {
    title: 'Integration',
    text: 'The cycle monetises the economy, encourages specialisation and long-distance trade, and binds the provinces together, without any deliberate economic policy.',
  },
];

export function TaxesTrade() {
  const [step, setStep] = useState(0);
  const s = TT_STEPS[step];
  const show = (k: number) => step >= k;
  return (
    <Frame
      title="Taxes and trade"
      caption="Keith Hopkins’ model of how imperial taxation drove trade. Step through the cycle."
      basis="Hopkins, ‘Taxes and Trade in the Roman Empire (200 B.C.–A.D. 400)’, JRS 70 (1980). A model to be tested, not a description of every region."
      controls={
        <div className="dg-steps">
          <button type="button" className="btn small ghost" onClick={() => setStep((x) => Math.max(0, x - 1))} disabled={step === 0}>
            Previous
          </button>
          <span className="ui small">
            {step + 1} / {TT_STEPS.length}
          </span>
          <button type="button" className="btn small" onClick={() => setStep((x) => Math.min(TT_STEPS.length - 1, x + 1))} disabled={step === TT_STEPS.length - 1}>
            Next
          </button>
        </div>
      }
    >
      <svg className="dg" viewBox="0 0 640 300" role="img" aria-label={`${s.title}: ${s.text}`}>
        <defs>
          <marker id="tt-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="arrowhead" />
          </marker>
        </defs>
        <rect x={40} y={110} width={180} height={80} className="f-verdigris" />
        <text x={130} y={145} textAnchor="middle" className="t-on">
          Tax-paying provinces
        </text>
        <text x={130} y={163} textAnchor="middle" className="t-sm" style={{ fill: 'var(--surface)' }}>
          producers
        </text>
        <rect x={430} y={30} width={170} height={70} className="f-cinnabar" />
        <text x={515} y={62} textAnchor="middle" className="t-on">
          City of Rome
        </text>
        <text x={515} y={80} textAnchor="middle" className="t-sm" style={{ fill: 'var(--surface)' }}>
          court, plebs, elite
        </text>
        <rect x={430} y={200} width={170} height={70} className="f-umber" />
        <text x={515} y={232} textAnchor="middle" className="t-on">
          Frontier armies
        </text>
        <text x={515} y={250} textAnchor="middle" className="t-sm" style={{ fill: 'var(--surface)' }}>
          Rhine, Danube, East
        </text>
        <g opacity={show(0) ? 1 : 0.15}>
          <path d="M220,130 C320,70 360,60 428,62" className="ln-strong" markerEnd="url(#tt-arrow)" stroke="var(--c-ochre)" strokeWidth={3} />
          <path d="M220,170 C320,230 360,236 428,236" className="ln-strong" markerEnd="url(#tt-arrow)" stroke="var(--c-ochre)" strokeWidth={3} />
          <text x={330} y={50} className="t-sm" textAnchor="middle">
            taxes, increasingly in coin
          </text>
        </g>
        <g opacity={show(1) ? 1 : 0.15}>
          <text x={515} y={130} textAnchor="middle" className="t-sm">
            state spends coin here
          </text>
          <text x={515} y={146} textAnchor="middle" className="t-sm">
            (pay, grain, building)
          </text>
        </g>
        <g opacity={show(2) ? 1 : 0.15}>
          <path d="M430,90 C350,110 300,130 222,140" className="ln-dash" markerEnd="url(#tt-arrow)" stroke="var(--c-verdigris)" strokeWidth={2} />
          <path d="M430,210 C350,190 300,170 222,160" className="ln-dash" markerEnd="url(#tt-arrow)" stroke="var(--c-verdigris)" strokeWidth={2} />
          <text x={330} y={150} className="t-sm" textAnchor="middle">
            coin returns as payment for goods
          </text>
          <text x={330} y={292} className="t-sm" textAnchor="middle">
            goods (grain, oil, wine, cloth) flow towards Rome and the armies
          </text>
        </g>
      </svg>
      <p className="dg-status" aria-live="polite">
        <strong>{s.title}.</strong> {s.text}
      </p>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Legitimacy                                                           */
/* ------------------------------------------------------------------ */

const LEGIT = {
  principate: {
    title: 'Principate (1st–2nd centuries)',
    groups: [
      { label: 'Army', how: 'Pay, donatives, oath, the emperor as commander (imperator) and victor.' },
      { label: 'Senate', how: 'Respect for its dignity, offices and honours; conferral of powers by law.' },
      { label: 'People of Rome', how: 'Grain, games, building; acclamation in the circus and theatre.' },
      { label: 'Provincial elites', how: 'Citizenship, access by petition, the imperial cult.' },
      { label: 'Gods', how: 'The emperor as pontifex maximus; deification after death.' },
    ],
  },
  late: {
    title: 'Late empire and Byzantium',
    groups: [
      { label: 'Army', how: 'Acclamation on the shield; pay in gold; the emperor as victorious general.' },
      { label: 'Court', how: 'Ministers, eunuchs, the consistory; ceremony and proximity to the emperor.' },
      { label: 'People of the capital', how: 'Acclamations in the Hippodrome; the factions; riots could topple emperors.' },
      { label: 'Church', how: 'Coronation by the patriarch; defence of orthodoxy; councils.' },
      { label: 'God', how: 'The emperor chosen by God and ruling as his representative on earth.' },
    ],
  },
};

export function Legitimacy() {
  const [era, setEra] = useState<'principate' | 'late'>('principate');
  const [sel, setSel] = useState(0);
  const d = LEGIT[era];
  const g = d.groups[sel] ?? d.groups[0];
  const cx = 230;
  const cy = 170;
  return (
    <Frame
      title="Whose acceptance did an emperor need?"
      caption="The emperor’s position rested on continuing acceptance by several groups. Select a group to see how emperors won it; switch periods to see how the cast changed."
      basis="Flaig’s idea of an ‘acceptance system’; Millar, The Emperor in the Roman World; Kaldellis, The Byzantine Republic."
      controls={
        <Toggle
          label="Period"
          value={era}
          onChange={(v) => (setEra(v), setSel(0))}
          options={[
            { id: 'principate', label: 'Principate' },
            { id: 'late', label: 'Late empire and Byzantium' },
          ]}
        />
      }
    >
      <div className="dg-split">
        <svg className="dg" viewBox="0 0 460 340" role="group" aria-label={d.title}>
          {d.groups.map((grp, i) => {
            const a = (i / d.groups.length) * Math.PI * 2 - Math.PI / 2;
            const x = cx + Math.cos(a) * 130;
            const y = cy + Math.sin(a) * 125;
            const isSel = i === sel;
            return (
              <g key={grp.label}>
                <line x1={cx} y1={cy} x2={x} y2={y} className={isSel ? 'ln-strong' : 'ln'} />
                <g
                  className={`hit ${isSel ? 'sel' : ''}`}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSel}
                  aria-label={grp.label}
                  onClick={() => setSel(i)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(i))}
                >
                  <rect x={x - 66} y={y - 18} width={132} height={36} rx={2} className="box" stroke={isSel ? 'var(--text)' : undefined} strokeWidth={isSel ? 2 : 1} />
                  <text x={x} y={y + 5} textAnchor="middle">
                    {grp.label}
                  </text>
                </g>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={44} className="f-porphyry" />
          <text x={cx} y={cy + 5} textAnchor="middle" className="t-on t-lg">
            Emperor
          </text>
        </svg>
        <div className="dg-panel" aria-live="polite">
          <h5>{g.label}</h5>
          <p>{g.how}</p>
          <p className="hint">Losing the support of any one group could end a reign: there was no legal procedure for removing an emperor.</p>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Domus                                                                */
/* ------------------------------------------------------------------ */

const ROOMS = [
  { id: 'fauces', name: 'Fauces (entrance)', x: 200, y: 330, w: 40, h: 50, text: 'A narrow entrance passage from the street, often with a mosaic or painted greeting at the threshold.' },
  { id: 'taberna1', name: 'Shop (taberna)', x: 120, y: 330, w: 78, h: 50, text: 'Rooms facing the street were often rented out or run by the household’s slaves or freedmen as shops or workshops.' },
  { id: 'taberna2', name: 'Shop (taberna)', x: 242, y: 330, w: 78, h: 50, text: 'Many grand houses earned income from shops built into their street front.' },
  { id: 'atrium', name: 'Atrium', x: 150, y: 200, w: 140, h: 128, text: 'The main hall, open to the sky above a pool (impluvium) that collected rainwater. Here the master received clients at the morning salutatio, and family portraits and shrines were displayed.' },
  { id: 'cubicula', name: 'Cubicula', x: 120, y: 200, w: 28, h: 128, text: 'Small rooms off the atrium used for sleeping, but also for private meetings; their functions were flexible.' },
  { id: 'cubicula2', name: 'Cubicula', x: 292, y: 200, w: 28, h: 128, text: 'Rooms around the atrium could serve as bedrooms, stores or offices.' },
  { id: 'tablinum', name: 'Tablinum', x: 180, y: 150, w: 80, h: 48, text: 'The room at the back of the atrium, where the master did business and family records were kept; it framed a view through to the garden.' },
  { id: 'triclinium', name: 'Triclinium (dining room)', x: 120, y: 150, w: 58, h: 48, text: 'Dining room with three couches; guests reclined, placed by rank. Dinner parties were a key setting for social and political life.' },
  { id: 'kitchen', name: 'Kitchen and latrine', x: 262, y: 150, w: 58, h: 48, text: 'Small, dark service rooms used by slaves. Many Pompeian houses had a latrine next to the kitchen.' },
  { id: 'peristyle', name: 'Peristyle garden', x: 120, y: 30, w: 200, h: 118, text: 'A garden surrounded by a colonnade, inspired by Greek architecture, with plants, fountains and statues; reception rooms opened onto it.' },
];

export function Domus() {
  const [sel, setSel] = useState('atrium');
  const r = ROOMS.find((x) => x.id === sel)!;
  return (
    <Frame
      title="An atrium house"
      caption="A typical layout based on houses at Pompeii and Herculaneum. No single house followed it exactly, and room functions were flexible. Select a room."
      basis="Wallace-Hadrill, Houses and Society in Pompeii and Herculaneum (1994); Vitruvius 6.3–5."
    >
      <div className="dg-split">
        <svg className="dg" viewBox="0 0 440 420" role="group" aria-label="Plan of a Roman atrium house">
          <text x={220} y={404} textAnchor="middle" className="t-sm">
            street
          </text>
          <line x1={100} y1={386} x2={340} y2={386} className="ln-strong" />
          {ROOMS.map((room) => {
            const isSel = room.id === sel;
            return (
              <g
                key={room.id}
                className={`hit ${isSel ? 'sel' : ''}`}
                tabIndex={0}
                role="button"
                aria-pressed={isSel}
                aria-label={room.name}
                onClick={() => setSel(room.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(room.id))}
              >
                <rect
                  x={room.x}
                  y={room.y}
                  width={room.w}
                  height={room.h}
                  fill={isSel ? 'var(--accent-wash)' : room.id === 'peristyle' ? 'color-mix(in srgb, var(--c-verdigris) 14%, var(--surface))' : 'var(--surface)'}
                  stroke={isSel ? 'var(--text)' : 'var(--rule-strong)'}
                  strokeWidth={isSel ? 2 : 1}
                />
              </g>
            );
          })}
          <rect x={198} y={240} width={44} height={44} fill="color-mix(in srgb, var(--c-caeruleum) 25%, var(--surface))" stroke="var(--c-caeruleum)" pointerEvents="none" />
          <text x={220} y={300} textAnchor="middle" className="t-sm" pointerEvents="none">
            impluvium
          </text>
          <text x={220} y={226} textAnchor="middle" pointerEvents="none">
            atrium
          </text>
          {[
            ['entrance', 220, 360],
            ['shop', 159, 360],
            ['shop', 281, 360],
            ['dining', 149, 178],
            ['kitchen', 291, 178],
          ].map(([t, x, y]) => (
            <text key={`${t}${x}`} x={x as number} y={y as number} textAnchor="middle" className="t-sm" pointerEvents="none">
              {t}
            </text>
          ))}
          <text x={134} y={268} textAnchor="middle" className="t-sm" pointerEvents="none" transform="rotate(-90 134 268)">
            bedrooms
          </text>
          <text x={306} y={268} textAnchor="middle" className="t-sm" pointerEvents="none" transform="rotate(-90 306 268)">
            bedrooms
          </text>
          <text x={220} y={178} textAnchor="middle" className="t-sm" pointerEvents="none">
            tablinum
          </text>
          <text x={220} y={92} textAnchor="middle" pointerEvents="none">
            peristyle
          </text>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={i} cx={140 + i * 32} cy={50} r={3} className="f-slate" pointerEvents="none" />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={'b' + i} cx={140 + i * 32} cy={128} r={3} className="f-slate" pointerEvents="none" />
          ))}
        </svg>
        <div className="dg-panel" aria-live="polite">
          <h5>{r.name}</h5>
          <p>{r.text}</p>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Aqueduct profile                                                     */
/* ------------------------------------------------------------------ */

const AQ_PARTS = [
  { id: 'source', name: 'Source', x: 62, text: 'Springs or a river, often in hills far from the city. Rome’s aqueducts drew on sources up to about 90 km away by the channel’s route.' },
  { id: 'channel', name: 'Underground channel', x: 180, text: 'Most of an aqueduct ran in a covered channel (specus) at or below ground, following contours, with access shafts for maintenance.' },
  { id: 'tank', name: 'Settling tank', x: 300, text: 'Basins allowed sediment to settle out before the water continued.' },
  { id: 'bridge', name: 'Arcade over a valley', x: 420, text: 'Only where the channel had to cross a valley was it raised on arches, as at the Pont du Gard. Elsewhere inverted siphons of lead or stone pipes could carry water across.' },
  { id: 'castellum', name: 'Distribution tank', x: 560, text: 'At the city, a castellum divided the flow into pipes for public fountains, baths and private customers who paid for a connection.' },
];

export function Aqueduct() {
  const [sel, setSel] = useState('bridge');
  const p = AQ_PARTS.find((x) => x.id === sel)!;
  // ground profile
  const ground = 'M0,90 C60,80 100,150 160,150 S240,160 300,170 L330,175 C350,250 420,260 450,180 L480,182 C510,186 560,190 640,195';
  return (
    <Frame
      title="How an aqueduct worked"
      caption="Water flowed by gravity alone, so the channel had to fall steadily but very gently. The Nîmes aqueduct falls only about 12 metres over some 50 kilometres. Select a section."
      basis="Hodge, Roman Aqueducts and Water Supply; Frontinus, On the Aqueducts. Vertical scale greatly exaggerated."
    >
      <svg className="dg" viewBox="0 0 640 300" role="group" aria-label="Profile of an aqueduct from source to city">
        <path d={ground + ' L640,300 L0,300 Z'} fill="var(--inset)" />
        <path d={ground} className="ln" />
        <path d="M30,96 L330,124 L450,134 L560,146" stroke="var(--c-caeruleum)" strokeWidth={4} fill="none" />
        <text x={200} y={140} className="t-sm">
          channel falls gently
        </text>
        {Array.from({ length: 6 }).map((_, i) => {
          const x = 338 + i * 18;
          const top = 125 + (x - 330) * 0.08;
          return <rect key={i} x={x} y={top + 3} width={10} height={225 - top} fill="none" stroke="var(--c-umber)" strokeWidth={1.5} />;
        })}
        <rect x={540} y={140} width={40} height={30} className="f-ochre" />
        <rect x={288} y={114} width={24} height={14} className="f-slate" />
        {AQ_PARTS.map((part) => {
          const isSel = part.id === sel;
          return (
            <g
              key={part.id}
              className={`hit ${isSel ? 'sel' : ''}`}
              tabIndex={0}
              role="button"
              aria-pressed={isSel}
              aria-label={part.name}
              onClick={() => setSel(part.id)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(part.id))}
            >
              <rect x={part.x - 58} y={20} width={116} height={26} rx={2} className="box" stroke={isSel ? 'var(--text)' : undefined} strokeWidth={isSel ? 2 : 1} />
              <text x={part.x} y={37} textAnchor="middle" className="t-sm" style={{ fill: 'var(--text)' }}>
                {part.name}
              </text>
              <line x1={part.x} y1={46} x2={part.x} y2={part.id === 'source' ? 88 : part.id === 'bridge' ? 120 : 110} className="ln" />
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
