/**
 * Content integrity check: every cross-reference must resolve.
 * Run: npm run validate
 */
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';

const root = path.resolve('src/content');
const errors: string[] = [];
const warnings: string[] = [];
const readYaml = (f: string) => load(fs.readFileSync(f, 'utf8'), { filename: f }) as any;
const dirItems = (dir: string) => {
  const d = path.join(root, dir);
  if (!fs.existsSync(d)) return [] as any[];
  return fs
    .readdirSync(d)
    .filter((f) => f.endsWith('.yaml'))
    .flatMap((f) => {
      try {
        const v = readYaml(path.join(d, f));
        return (Array.isArray(v) ? v : [v]).filter(Boolean).map((x: any) => ({ ...x, __file: `${dir}/${f}` }));
      } catch (e) {
        errors.push(`YAML ${dir}/${f}: ${(e as Error).message.split('\n')[0]}`);
        return [];
      }
    });
};

const curriculum = readYaml(path.join(root, 'curriculum.yaml'));
const atlas = readYaml(path.join(root, 'atlas.yaml')) ?? [];
const atlasLines = readYaml(path.join(root, 'atlas-lines.yaml')) ?? [];
const lessons = fs
  .readdirSync(path.join(root, 'lessons'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const raw = fs.readFileSync(path.join(root, 'lessons', f), 'utf8');
    const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!m) {
      errors.push(`lesson ${f}: no front matter`);
      return null;
    }
    try {
      return { ...(load(m[1]) as any), body: m[2], __file: `lessons/${f}` };
    } catch (e) {
      errors.push(`lesson ${f}: ${(e as Error).message.split('\n')[0]}`);
      return null;
    }
  })
  .filter(Boolean) as any[];

const figures = dirItems('figures');
const events = dirItems('events');
const places = dirItems('places');
const sources = dirItems('sources');
const terms = dirItems('glossary');
const bib = dirItems('bibliography');
const debates = dirItems('debates');
const comparisons = dirItems('comparisons');
const scenarios = dirItems('scenarios');
const quizzes = dirItems('quizzes');
const cards = dirItems('flashcards');
const stemmata = dirItems('stemmata');
const images = dirItems('images');

const ids = (xs: any[], kind: string) => {
  const s = new Set<string>();
  for (const x of xs) {
    if (!x.id) errors.push(`${kind} without id in ${x.__file}`);
    else if (s.has(x.id)) errors.push(`duplicate ${kind} id: ${x.id} (${x.__file})`);
    else s.add(x.id);
  }
  return s;
};
const L = ids(lessons, 'lesson');
const F = ids(figures, 'figure');
const E = ids(events, 'event');
const P = ids(places, 'place');
const S = ids(sources, 'source');
const T = ids(terms, 'term');
const B = ids(bib, 'bib');
const D = ids(debates, 'debate');
const C = ids(comparisons, 'comparison');
const SC = ids(scenarios, 'scenario');
ids(quizzes, 'quiz'); // registers quiz ids and reports duplicates
const IM = ids(images, 'image');
const ST = ids(stemmata, 'stemma');
const M = new Set<string>(curriculum.modules.map((m: any) => m.id));
const allCheckIds = new Set<string>();
for (const l of lessons) for (const c of l.checks ?? []) {
  if (allCheckIds.has(c.id)) errors.push(`duplicate check id ${c.id} in ${l.__file}`);
  allCheckIds.add(c.id);
}
for (const q of quizzes) for (const c of q.checks ?? []) {
  if (allCheckIds.has(c.id)) errors.push(`duplicate check id ${c.id} in ${q.__file}`);
  allCheckIds.add(c.id);
}

const DIAGRAMS = new Set(
  [...fs.readFileSync('src/components/diagrams/index.tsx', 'utf8').matchAll(/^\s*'([a-z0-9-]+)':/gm)].map((m) => m[1]),
);
const KIND: Record<string, Set<string>> = { fig: F, evt: E, place: P, src: S, term: T, lesson: L, debate: D, scenario: SC, compare: C };

const SECTIONS = new Map<string, Set<string>>(
  lessons.map((l: any) => [l.id, new Set([...String(l.body).matchAll(/^## .+? \{#([a-z0-9-]+)\}$/gm)].map((m) => m[1]))]),
);

function checkText(text: unknown, where: string) {
  if (typeof text !== 'string') return;
  for (const m of text.matchAll(/\[\[([a-z]+):([a-z0-9-]+)(?:#([a-z0-9-]+))?(?:\|[^\]]+)?\]\]/g)) {
    const set = KIND[m[1]];
    if (!set) errors.push(`${where}: unknown link kind ${m[1]}`);
    else if (!set.has(m[2])) errors.push(`${where}: unresolved [[${m[1]}:${m[2]}]]`);
    else if (m[3] && m[1] !== 'lesson') errors.push(`${where}: section anchors are only supported on lesson links (${m[0]})`);
    else if (m[3] && !SECTIONS.get(m[2])?.has(m[3])) errors.push(`${where}: lesson ${m[2]} has no section #${m[3]}`);
  }
  for (const m of text.matchAll(/\[\[[^\]]*\]\]/g))
    if (!/^\[\[[a-z]+:[a-z0-9-]+(?:#[a-z0-9-]+)?(?:\|[^\]]+)?\]\]$/.test(m[0])) errors.push(`${where}: malformed link ${m[0]}`);
  for (const m of text.matchAll(/\{\{ref:([a-z0-9-]+)/g)) if (!B.has(m[1])) errors.push(`${where}: unresolved ref ${m[1]}`);
  for (const m of text.matchAll(/^:::([a-z]+)\s*(\S*)/gm)) {
    const [, name, arg] = m;
    if (name === 'check' && !allCheckIds.has(arg)) errors.push(`${where}: check ${arg} not defined`);
    if (name === 'source' && !S.has(arg)) errors.push(`${where}: source ${arg} not found`);
    if (name === 'debate' && !D.has(arg)) errors.push(`${where}: debate ${arg} not found`);
    if (name === 'diagram' && !DIAGRAMS.has(arg)) errors.push(`${where}: diagram ${arg} not registered`);
    if (name === 'image' && !IM.has(arg)) errors.push(`${where}: image ${arg} not found`);
    if (name === 'claim' && !['established', 'interpretation', 'contested', 'speculative'].includes(arg)) errors.push(`${where}: claim level ${arg}`);
    if (name === 'stemma' && !ST.has(arg)) errors.push(`${where}: stemma ${arg} not found`);
    if (!['claim', 'aside', 'quote', 'check', 'source', 'debate', 'diagram', 'image', 'timeline', 'people', 'stemma'].includes(name)) errors.push(`${where}: unknown directive ${name}`);
  }
  const opens = (text.match(/^:::[a-z]/gm) ?? []).length;
  const closes = (text.match(/^:::\s*$/gm) ?? []).length;
  if (opens !== closes) errors.push(`${where}: ${opens} directives opened, ${closes} closed`);
  for (const m of text.matchAll(/^:::people\n([\s\S]*?)\n:::/gm)) for (const id of m[1].split(/[\s,]+/).filter(Boolean)) if (!F.has(id)) errors.push(`${where}: people ${id}`);
  for (const m of text.matchAll(/^:::timeline\n([\s\S]*?)\n:::/gm))
    for (const line of m[1].split('\n')) {
      const evt = line.split('|')[2]?.trim();
      if (evt && !E.has(evt)) errors.push(`${where}: timeline event ${evt}`);
    }
}
function deep(obj: unknown, where: string) {
  if (typeof obj === 'string') checkText(obj, where);
  else if (Array.isArray(obj)) obj.forEach((x, i) => deep(x, `${where}[${i}]`));
  else if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) if (k !== '__file' && k !== 'body') deep(v, `${where}.${k}`);
}
const refList = (list: string[] | undefined, set: Set<string>, kind: string, where: string) => {
  for (const x of list ?? []) if (!set.has(x)) errors.push(`${where}: ${kind} ${x} not found`);
};

// curriculum
for (const p of curriculum.parts) for (const m of p.modules) if (!M.has(m)) errors.push(`part ${p.id}: module ${m}`);
for (const m of curriculum.modules) {
  for (const l of m.lessons) if (!L.has(l)) warnings.push(`module ${m.id}: lesson ${l} not written`);
  refList(m.readings, B, 'bib', `module ${m.id} readings`);
  for (const e of m.essays) refList(e.readings, B, 'bib', `essay ${e.id}`);
}
for (const t of curriculum.terms) for (const w of t.weeks) for (const l of w.lessons) if (!L.has(l)) warnings.push(`study plan ${t.id} w${w.week}: lesson ${l} missing`);
const moduleLessons = new Set(curriculum.modules.flatMap((m: any) => m.lessons));

for (const l of lessons) {
  const w = l.__file;
  if (!M.has(l.module)) errors.push(`${w}: module ${l.module}`);
  if (!moduleLessons.has(l.id)) errors.push(`${w}: lesson not listed in curriculum`);
  refList(l.figures, F, 'figure', w);
  refList(l.events, E, 'event', w);
  refList(l.places, P, 'place', w);
  refList(l.sources, S, 'source', w);
  refList(l.terms, T, 'term', w);
  refList(l.debates, D, 'debate', w);
  for (const r of l.reading ?? []) if (!B.has(r.ref)) errors.push(`${w}: reading ${r.ref}`);
  checkText(l.body, w);
  deep({ objectives: l.objectives, questions: l.questions, checks: l.checks, inquiry: l.inquiry }, w);
  for (const c of l.checks ?? []) {
    if (!l.body.includes(`:::check ${c.id}`)) warnings.push(`${w}: check ${c.id} defined but not placed`);
    if (c.type === 'mcq' && !c.options.some((o: any) => o.correct)) errors.push(`${w}: check ${c.id} has no correct option`);
    if (c.sourceId && !S.has(c.sourceId)) errors.push(`${w}: check ${c.id} source ${c.sourceId}`);
  }
  const words = l.body.split(/\s+/).length;
  if (l.status === 'complete' && words < 1400) warnings.push(`${w}: only ${words} words, likely too thin for a university-level lesson`);

}
for (const f of figures) {
  for (const r of f.relations ?? []) if (!F.has(r.to)) errors.push(`figure ${f.id}: relation to ${r.to}`);
  refList(f.events, E, 'event', `figure ${f.id}`);
  refList(f.sources, S, 'source', `figure ${f.id}`);
  if (f.image && !IM.has(f.image)) errors.push(`figure ${f.id}: image ${f.image}`);
  deep({ summary: f.summary, bio: f.bio, evidence: f.evidence }, `figure ${f.id}`);
}
for (const e of events) {
  refList(e.causes, E, 'cause', `event ${e.id}`);
  refList(e.figures, F, 'figure', `event ${e.id}`);
  refList(e.places, P, 'place', `event ${e.id}`);
  refList(e.sources, S, 'source', `event ${e.id}`);
  if (e.lesson && !L.has(e.lesson)) warnings.push(`event ${e.id}: lesson ${e.lesson}`);
  for (const c of e.causes ?? []) {
    const ce = events.find((x) => x.id === c);
    if (ce && ce.date.from > e.date.from) errors.push(`event ${e.id}: cause ${c} is later`);
  }
  deep(e.summary, `event ${e.id}`);
}
for (const p of places) {
  refList(p.events, E, 'event', `place ${p.id}`);
  if (typeof p.lat !== 'number' || typeof p.lon !== 'number') errors.push(`place ${p.id}: coordinates`);
  deep(p.summary, `place ${p.id}`);
}
for (const s of sources) {
  refList(s.related, S, 'source', `source ${s.id}`);
  refList(s.editions, B, 'bib', `source ${s.id}`);
  if (s.original && s.original.length !== s.translation.length) warnings.push(`source ${s.id}: ${s.original.length} original vs ${s.translation.length} translation paragraphs`);
  if (s.image && !IM.has(s.image)) errors.push(`source ${s.id}: image ${s.image}`);
  deep({ ...s, original: undefined }, `source ${s.id}`);
}
for (const t of terms) {
  refList(t.related, T, 'term', `term ${t.id}`);
  deep(t.def, `term ${t.id}`);
}
for (const d of debates) {
  const pos = new Set(d.positions.map((p: any) => p.id));
  for (const p of d.positions) for (const x of p.proponents) if (x.ref && !B.has(x.ref)) errors.push(`debate ${d.id}: proponent ref ${x.ref}`);
  for (const e of d.evidence) {
    for (const s of e.supports) if (!pos.has(s)) errors.push(`debate ${d.id}: evidence ${e.id} supports ${s}`);
    if (e.source && !S.has(e.source)) errors.push(`debate ${d.id}: evidence source ${e.source}`);
  }
  for (const h of d.history) if (h.ref && !B.has(h.ref)) errors.push(`debate ${d.id}: history ref ${h.ref}`);
  refList(d.lessons, L, 'lesson', `debate ${d.id}`);
  refList(d.reading, B, 'bib', `debate ${d.id}`);
  deep(d, `debate ${d.id}`);
}
for (const c of comparisons) {
  refList(c.lessons, L, 'lesson', `comparison ${c.id}`);
  const cols = new Set(c.columns.map((x: any) => x.id));
  for (const r of c.rows) for (const k of Object.keys(r.cells)) if (!cols.has(k)) errors.push(`comparison ${c.id}: cell column ${k}`);
  for (const col of c.columns) if (col.figure && !F.has(col.figure)) errors.push(`comparison ${c.id}: figure ${col.figure}`);
  deep(c, `comparison ${c.id}`);
}
for (const s of scenarios) {
  const nodes = new Set(s.nodes.map((n: any) => n.id));
  if (!nodes.has(s.start)) errors.push(`scenario ${s.id}: start ${s.start}`);
  const stakes = new Set(s.stakes.map((k: any) => k.id));
  for (const n of s.nodes) {
    if (!n.end && !(n.choices ?? []).length) errors.push(`scenario ${s.id}: node ${n.id} has no choices and is not an end`);
    for (const c of n.choices ?? []) {
      if (!nodes.has(c.next)) errors.push(`scenario ${s.id}: node ${n.id} → ${c.next}`);
      for (const k of Object.keys(c.effects ?? {})) if (!stakes.has(k)) errors.push(`scenario ${s.id}: stake ${k}`);
    }
  }
  refList(s.sources, S, 'source', `scenario ${s.id}`);
  refList(s.lessons, L, 'lesson', `scenario ${s.id}`);
  deep(s, `scenario ${s.id}`);
}
for (const q of quizzes) {
  if (!M.has(q.module)) errors.push(`quiz ${q.id}: module ${q.module}`);
  for (const c of q.checks) {
    if (c.lesson && !L.has(c.lesson)) errors.push(`quiz ${q.id}: check ${c.id} lesson ${c.lesson}`);
    if (c.type === 'mcq' && !c.options.some((o: any) => o.correct)) errors.push(`quiz ${q.id}: ${c.id} no correct option`);
    if (c.sourceId && !S.has(c.sourceId)) errors.push(`quiz ${q.id}: ${c.id} source`);
  }
  deep(q, `quiz ${q.id}`);
}
for (const c of cards) {
  if (c.lesson && !L.has(c.lesson)) errors.push(`card ${c.id}: lesson ${c.lesson}`);
  deep(c, `card ${c.id}`);
}
for (const s of stemmata) {
  const nodes = new Set(s.nodes.map((n: any) => n.id));
  for (const n of s.nodes) if (!n.label && !F.has(n.id)) errors.push(`stemma ${s.id}: node ${n.id} needs label or figure`);
  for (const e of s.edges) if (!nodes.has(e.from) || !nodes.has(e.to)) errors.push(`stemma ${s.id}: edge ${e.from}→${e.to}`);
  const pos = new Set<string>();
  for (const n of s.nodes) {
    const k = `${n.x},${n.y}`;
    if (pos.has(k)) errors.push(`stemma ${s.id}: overlapping nodes at ${k}`);
    pos.add(k);
  }
}
const topo = JSON.parse(fs.readFileSync('src/geo/atlas.topo.json', 'utf8'));
for (const a of atlas) if (!topo.objects[a.layer]) errors.push(`atlas ${a.id}: layer ${a.layer}`);
for (const a of atlas) deep(a, `atlas ${a.id}`);
for (const l of atlasLines) if (!Array.isArray(l.coords) || l.coords.length < 2) errors.push(`atlas line ${l.id}: coords`);

// unused
const usedBib = new Set<string>();
const allText = JSON.stringify([lessons, debates, sources, curriculum, figures, comparisons]);
for (const m of allText.matchAll(/"(?:ref|readings?|editions)":\s*"?([a-z0-9-]+)/g)) usedBib.add(m[1]);
// Reference works and online resources are listed in the Library rather than cited in lessons.
for (const b of bib)
  if (!b.__file.endsWith('reference.yaml') && b.type !== 'digital' && !allText.includes(`"${b.id}"`) && !allText.includes(`ref:${b.id}`))
    warnings.push(`bib ${b.id} not cited anywhere`);

// YAML turns an unquoted scalar containing ": " into a mapping, and bare numbers into numbers. Prose fields
// must stay strings, or the renderer fails at runtime; catch that here.
const PROSE_KEYS = new Set(['prompt', 'text', 'why', 'explain', 'model', 'left', 'right', 'label', 'title', 'subtitle', 'note', 'q', 'front', 'back', 'summary', 'claim', 'argument', 'weaknesses', 'comment', 'what', 'who', 'state', 'question', 'synthesis', 'outcome', 'detail', 'briefing', 'dimension']);
const PROSE_LISTS = new Set(['items', 'objectives', 'questions', 'inquiry', 'rubric', 'debrief', 'translation', 'original', 'notes', 'tasks']);
function proseTypes(o: unknown, at: string, file: string) {
  if (Array.isArray(o)) o.forEach((x, i) => proseTypes(x, `${at}[${i}]`, file));
  else if (o && typeof o === 'object')
    for (const [k, v] of Object.entries(o)) {
      if (k === 'body' || k === '__file') continue;
      if (PROSE_KEYS.has(k) && v !== null && v !== undefined && typeof v !== 'string' && typeof v !== 'object')
        errors.push(`${file}: ${at}.${k} should be text, got ${JSON.stringify(v)}`);
      if (PROSE_KEYS.has(k) && v && typeof v === 'object' && !Array.isArray(v)) errors.push(`${file}: ${at}.${k} parsed as a mapping (quote it): ${JSON.stringify(v).slice(0, 80)}`);
      if (PROSE_LISTS.has(k) && Array.isArray(v))
        v.forEach((x, i) => typeof x !== 'string' && errors.push(`${file}: ${at}.${k}[${i}] should be text (quote it): ${JSON.stringify(x).slice(0, 80)}`));
      proseTypes(v, `${at}.${k}`, file);
    }
}
for (const x of [...lessons, ...figures, ...events, ...places, ...sources, ...terms, ...debates, ...comparisons, ...scenarios, ...quizzes, ...cards, ...images])
  proseTypes(x, x.id ?? '', x.__file);
proseTypes(curriculum, 'curriculum', 'curriculum.yaml');
proseTypes(atlas, 'atlas', 'atlas.yaml');
proseTypes(stemmata, 'stemmata', 'stemmata');

console.log(
  `lessons ${lessons.length} (${lessons.filter((l) => l.status === 'complete').length} complete, ${lessons.reduce((a, l) => a + l.body.split(/\s+/).length, 0)} words) · figures ${figures.length} · events ${events.length} · places ${places.length} · sources ${sources.length} · terms ${terms.length} · bib ${bib.length} · debates ${debates.length} · comparisons ${comparisons.length} · scenarios ${scenarios.length} · quizzes ${quizzes.length} (${quizzes.reduce((a, q) => a + q.checks.length, 0)} q) · lesson checks ${lessons.reduce((a, l) => a + (l.checks ?? []).length, 0)} · cards ${cards.length} · stemmata ${stemmata.length} · images ${images.length} · atlas ${atlas.length}`,
);
if (warnings.length) console.log(`\n${warnings.length} warnings:\n` + warnings.slice(0, 80).join('\n'));
if (errors.length) {
  console.log(`\n${errors.length} ERRORS:\n` + errors.slice(0, 150).join('\n'));
  process.exit(1);
} else console.log('\nNo errors.');
