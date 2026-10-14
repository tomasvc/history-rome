import type {
  AtlasLine,
  AtlasSnapshot,
  BibEntry,
  Check,
  Comparison,
  Curriculum,
  Debate,
  EntityKind,
  Figure,
  Flashcard,
  HistEvent,
  Lesson,
  Module,
  MuseumImage,
  Place,
  PrimarySource,
  Quiz,
  RelationType,
  Scenario,
  Stemma,
  Term,
} from '../types';
import curriculumRaw from '../content/curriculum.yaml';
import atlasRaw from '../content/atlas.yaml';
import atlasLinesRaw from '../content/atlas-lines.yaml';

type Mods = Record<string, unknown>;
function collect<T>(mods: Mods): T[] {
  return Object.entries(mods)
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([, v]) => (Array.isArray(v) ? (v as T[]) : v ? [v as T] : []));
}
const byId = <T extends { id: string }>(xs: T[]) => new Map(xs.map((x) => [x.id, x]));

export const curriculum = curriculumRaw as Curriculum;
export const atlasSnapshots = atlasRaw as AtlasSnapshot[];
export const atlasLines = atlasLinesRaw as AtlasLine[];

/**
 * Reading time is computed, not authored: about 200 words a minute of prose, plus time to work through
 * knowledge checks, embedded primary sources and interactive diagrams.
 */
export function readingMinutes(stats: Lesson['stats'], checks: number): number {
  return Math.max(5, Math.round(stats.words / 200 + checks * 1.5 + stats.sources * 1.5 + stats.diagrams));
}
const lessonMods = import.meta.glob('../content/lessons/*.md', { eager: true, import: 'default' }) as Record<string, Lesson>;
export const lessons = collect<Lesson>(lessonMods).map((l) => ({ ...l, minutes: readingMinutes(l.stats, l.checks?.length ?? 0) }));

/** Lesson bodies are split into their own chunks and fetched when a lesson is opened (or when search needs them). */
const bodyLoaders = import.meta.glob('../content/lessons/*.md', { query: '?body', import: 'default' }) as Record<string, () => Promise<string>>;
const bodyPathById = new Map(Object.entries(lessonMods).map(([path, l]) => [l.id, path]));
const bodyCache = new Map<string, string>();
export const cachedLessonBody = (id: string) => bodyCache.get(id);
export async function loadLessonBody(id: string): Promise<string> {
  const hit = bodyCache.get(id);
  if (hit !== undefined) return hit;
  const path = bodyPathById.get(id);
  if (!path) throw new Error(`Unknown lesson ${id}`);
  const body = await bodyLoaders[path]();
  bodyCache.set(id, body);
  return body;
}
export const loadAllLessonBodies = () => Promise.all(lessons.map((l) => loadLessonBody(l.id).then((body) => [l.id, body] as const)));
export const figures = collect<Figure>(import.meta.glob('../content/figures/*.yaml', { eager: true, import: 'default' }));
export const events = collect<HistEvent>(import.meta.glob('../content/events/*.yaml', { eager: true, import: 'default' })).sort(
  (a, b) => a.date.from - b.date.from,
);
export const places = collect<Place>(import.meta.glob('../content/places/*.yaml', { eager: true, import: 'default' }));
export const sources = collect<PrimarySource>(import.meta.glob('../content/sources/*.yaml', { eager: true, import: 'default' })).sort(
  (a, b) => a.date.from - b.date.from,
);
export const terms = collect<Term>(import.meta.glob('../content/glossary/*.yaml', { eager: true, import: 'default' })).sort((a, b) =>
  a.term.localeCompare(b.term),
);
export const bibliography = collect<BibEntry>(import.meta.glob('../content/bibliography/*.yaml', { eager: true, import: 'default' }));
export const debates = collect<Debate>(import.meta.glob('../content/debates/*.yaml', { eager: true, import: 'default' }));
export const comparisons = collect<Comparison>(import.meta.glob('../content/comparisons/*.yaml', { eager: true, import: 'default' }));
export const scenarios = collect<Scenario>(import.meta.glob('../content/scenarios/*.yaml', { eager: true, import: 'default' }));
export const quizzes = collect<Quiz>(import.meta.glob('../content/quizzes/*.yaml', { eager: true, import: 'default' }));
export const extraCards = collect<Flashcard>(import.meta.glob('../content/flashcards/*.yaml', { eager: true, import: 'default' }));
export const stemmata = collect<Stemma>(import.meta.glob('../content/stemmata/*.yaml', { eager: true, import: 'default' }));
export const images = collect<MuseumImage>(import.meta.glob('../content/images/*.yaml', { eager: true, import: 'default' }));

export const lessonById = byId(lessons);
export const moduleById = byId(curriculum.modules);
export const partById = byId(curriculum.parts);
export const figureById = byId(figures);
export const eventById = byId(events);
export const placeById = byId(places);
export const sourceById = byId(sources);
export const termById = byId(terms);
export const bibById = byId(bibliography);
export const debateById = byId(debates);
export const comparisonById = byId(comparisons);
export const scenarioById = byId(scenarios);
export const quizById = byId(quizzes);
export const stemmaById = byId(stemmata);
export const imageById = byId(images);

// ---- course order ----
export const orderedModules: Module[] = curriculum.parts.flatMap((p) => p.modules.map((m) => moduleById.get(m)!).filter(Boolean));
export const orderedLessons: Lesson[] = orderedModules.flatMap((m) => m.lessons.map((l) => lessonById.get(l)!).filter(Boolean));
export const lessonIndex = new Map(orderedLessons.map((l, i) => [l.id, i]));
export const lessonNumber = (id: string) => (lessonIndex.get(id) ?? -1) + 1;
export const partOfModule = (moduleId: string) => curriculum.parts.find((p) => p.modules.includes(moduleId));
export const partOfLesson = (lessonId: string) => {
  const l = lessonById.get(lessonId);
  return l ? partOfModule(l.module) : undefined;
};
export const neighbours = (id: string) => {
  const i = lessonIndex.get(id) ?? -1;
  return { prev: orderedLessons[i - 1], next: orderedLessons[i + 1] };
};

// Attach lesson/module to lesson checks; collect all checks.
for (const l of lessons) for (const c of l.checks ?? []) Object.assign(c, { lesson: l.id, module: l.module });
for (const q of quizzes) for (const c of q.checks) Object.assign(c, { module: q.module });
export const allChecks: Check[] = [...lessons.flatMap((l) => l.checks ?? []), ...quizzes.flatMap((q) => q.checks)];
export const checkById = byId(allChecks);

// ---- reverse indices ----
function invert(getter: (l: Lesson) => string[] | undefined) {
  const m = new Map<string, string[]>();
  for (const l of orderedLessons) for (const id of getter(l) ?? []) m.set(id, [...(m.get(id) ?? []), l.id]);
  return m;
}
/** Find entity links written inline in lesson bodies, e.g. [[fig:augustus]] */
function inlineMentions(kind: keyof Lesson['mentions']) {
  const m = new Map<string, string[]>();
  for (const l of orderedLessons) {
    for (const id of l.mentions[kind] ?? []) {
      const arr = m.get(id) ?? [];
      if (!arr.includes(l.id)) m.set(id, [...arr, l.id]);
    }
  }
  return m;
}
function merge(a: Map<string, string[]>, b: Map<string, string[]>) {
  const out = new Map(a);
  for (const [k, v] of b) out.set(k, [...new Set([...(out.get(k) ?? []), ...v])]);
  return out;
}
export const lessonsForFigure = merge(invert((l) => l.figures), inlineMentions('fig'));
export const lessonsForEvent = merge(invert((l) => l.events), inlineMentions('evt'));
export const lessonsForSource = merge(invert((l) => l.sources), inlineMentions('src'));
export const lessonsForTerm = merge(invert((l) => l.terms), inlineMentions('term'));
export const lessonsForPlace = merge(invert((l) => l.places), inlineMentions('place'));
export const lessonsForDebate = merge(invert((l) => l.debates), inlineMentions('debate'));
for (const d of debates) for (const l of d.lessons ?? []) lessonsForDebate.set(d.id, [...new Set([...(lessonsForDebate.get(d.id) ?? []), l])]);

export const lessonsCitingBib = (() => {
  const m = new Map<string, string[]>();
  for (const l of orderedLessons) {
    const ids = new Set<string>([...(l.reading ?? []).map((r) => r.ref), ...l.refs]);
    for (const id of ids) m.set(id, [...(m.get(id) ?? []), l.id]);
  }
  return m;
})();

export const eventsForFigure = (() => {
  const m = new Map<string, string[]>();
  for (const e of events) for (const f of e.figures ?? []) m.set(f, [...(m.get(f) ?? []), e.id]);
  for (const f of figures) for (const e of f.events ?? []) if (!(m.get(f.id) ?? []).includes(e)) m.set(f.id, [...(m.get(f.id) ?? []), e]);
  return m;
})();
export const eventsForPlace = (() => {
  const m = new Map<string, string[]>();
  for (const e of events) for (const p of e.places ?? []) m.set(p, [...(m.get(p) ?? []), e.id]);
  for (const p of places) for (const e of p.events ?? []) if (!(m.get(p.id) ?? []).includes(e)) m.set(p.id, [...(m.get(p.id) ?? []), e]);
  return m;
})();
export const eventsForSource = (() => {
  const m = new Map<string, string[]>();
  for (const e of events) for (const s of e.sources ?? []) m.set(s, [...(m.get(s) ?? []), e.id]);
  return m;
})();
/** Effects of each event, derived from the `causes` lists of later events. */
export const consequencesOf = (() => {
  const m = new Map<string, string[]>();
  for (const e of events) for (const c of e.causes ?? []) m.set(c, [...(m.get(c) ?? []), e.id]);
  return m;
})();

// ---- relations, made symmetrical ----
export const INVERSE: Record<RelationType, string> = {
  parent: 'child',
  spouse: 'spouse',
  'adoptive-parent': 'adopted child',
  sibling: 'sibling',
  ally: 'ally',
  rival: 'rival',
  patron: 'protégé',
  teacher: 'pupil',
  successor: 'predecessor',
  killed: 'victim',
  colleague: 'colleague',
  'other-family': 'relative',
};
export const RELATION_LABEL: Record<RelationType, string> = {
  parent: 'parent',
  spouse: 'spouse',
  'adoptive-parent': 'adoptive parent',
  sibling: 'sibling',
  ally: 'ally',
  rival: 'rival',
  patron: 'patron',
  teacher: 'teacher',
  successor: 'successor',
  killed: 'killed by / on orders of',
  colleague: 'colleague',
  'other-family': 'relative',
};
export interface Edge {
  a: string;
  b: string;
  type: RelationType;
  label: string;
  note?: string;
}
export const relationEdges: Edge[] = figures.flatMap((f) =>
  (f.relations ?? []).filter((r) => figureById.has(r.to)).map((r) => ({ a: f.id, b: r.to, type: r.type, label: RELATION_LABEL[r.type], note: r.note })),
);
export function relationsOf(id: string) {
  const out: { other: string; label: string; type: RelationType; note?: string; family: boolean }[] = [];
  const family = (t: RelationType) => ['parent', 'spouse', 'adoptive-parent', 'sibling', 'other-family'].includes(t);
  for (const e of relationEdges) {
    if (e.a === id) out.push({ other: e.b, label: e.label, type: e.type, note: e.note, family: family(e.type) });
    else if (e.b === id) out.push({ other: e.a, label: INVERSE[e.type], type: e.type, note: e.note, family: family(e.type) });
  }
  const seen = new Set<string>();
  return out.filter((r) => {
    const k = r.other + r.label;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// ---- generic entity helpers ----
export function entityHref(kind: EntityKind | string, id: string): string {
  switch (kind) {
    case 'lesson':
      return `/lesson/${id}`;
    case 'module':
      return `/course/${id}`;
    case 'figure':
    case 'fig':
      return `/people/${id}`;
    case 'event':
    case 'evt':
      return `/timeline?event=${id}`;
    case 'place':
      return `/atlas?place=${id}`;
    case 'source':
    case 'src':
      return `/sources/${id}`;
    case 'term':
      return `/glossary#${id}`;
    case 'debate':
      return `/debates/${id}`;
    case 'bib':
      return `/library#${id}`;
    case 'scenario':
      return `/scenarios/${id}`;
    case 'comparison':
    case 'compare':
      return `/compare/${id}`;
    default:
      return '/';
  }
}
export function entityTitle(kind: EntityKind | string, id: string): string | undefined {
  switch (kind) {
    case 'lesson':
      return lessonById.get(id)?.title;
    case 'module':
      return moduleById.get(id)?.title;
    case 'figure':
    case 'fig':
      return figureById.get(id)?.name;
    case 'event':
    case 'evt':
      return eventById.get(id)?.title;
    case 'place':
      return placeById.get(id)?.name;
    case 'source':
    case 'src':
      return sourceById.get(id)?.title;
    case 'term':
      return termById.get(id)?.term;
    case 'debate':
      return debateById.get(id)?.title;
    case 'bib':
      return bibById.get(id)?.title;
    case 'scenario':
      return scenarioById.get(id)?.title;
    case 'comparison':
    case 'compare':
      return comparisonById.get(id)?.title;
  }
  return undefined;
}

/** Flashcards: curated cards plus cards generated from the glossary, people and key events. */
import { formatDate } from '../lib/dates';
export const flashcards: Flashcard[] = [
  ...extraCards,
  ...terms.map((t) => ({
    id: `term:${t.id}`,
    deck: 'Terms',
    front: t.term + (t.lang && t.lang !== 'English' ? ` (${t.lang})` : ''),
    back: (t.literal ? `Literally “${t.literal}”. ` : '') + t.def,
    lesson: lessonsForTerm.get(t.id)?.[0],
  })),
  ...figures.map((f) => ({
    id: `fig:${f.id}`,
    deck: 'People',
    front: f.name,
    back: `${formatLife(f)}. ${f.summary}`,
    lesson: lessonsForFigure.get(f.id)?.[0],
  })),
  ...events
    .filter((e) => e.weight === 3)
    .map((e) => ({
      id: `evt:${e.id}`,
      deck: 'Dates',
      front: `When, and why does it matter: ${e.title}?`,
      back: `${formatDate(e.date)}. ${e.summary}`,
      lesson: e.lesson ?? lessonsForEvent.get(e.id)?.[0],
    })),
];
export function formatLife(f: Figure): string {
  if (f.born || f.died) {
    const b = f.born ? formatDate(f.born) : '?';
    const d = f.died ? formatDate(f.died) : '?';
    return `${b} – ${d}`;
  }
  if (f.floruit) return `fl. ${formatDate(f.floruit)}`;
  return '';
}
