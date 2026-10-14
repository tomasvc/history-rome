import MiniSearch from 'minisearch';
import { bibliography, comparisons, debates, events, figures, lessons, places, scenarios, sources, terms, entityHref, formatLife, loadAllLessonBodies } from '../data';
import type { Lesson } from '../types';
import { formatDate } from './dates';
import { plainText } from './markup';

export interface SearchDoc {
  key: string;
  kind: 'Lesson' | 'Person' | 'Event' | 'Place' | 'Source' | 'Term' | 'Reading' | 'Debate' | 'Scenario' | 'Comparison';
  title: string;
  alt: string;
  text: string;
  meta: string;
  href: string;
}

let index: MiniSearch<SearchDoc> | null = null;
let fullText: Promise<void> | null = null;

/** Until lesson bodies have loaded, a lesson is indexed by its aims, questions and section headings. */
function lessonDoc(l: Lesson, body?: string): SearchDoc {
  return {
    key: `lesson:${l.id}`,
    kind: 'Lesson',
    title: l.title,
    alt: [l.subtitle ?? '', ...l.headings].join(' '),
    text: body ? plainText(body) : [...l.objectives, ...l.questions].join(' '),
    meta: l.status === 'outline' ? 'Lesson outline' : 'Lesson',
    href: entityHref('lesson', l.id),
  };
}

function docs(): SearchDoc[] {
  return [
    ...lessons.map((l) => lessonDoc(l)),
    ...figures.map((f) => ({
      key: `fig:${f.id}`,
      kind: 'Person' as const,
      title: f.name,
      alt: [f.full, ...f.roles].filter(Boolean).join(' '),
      text: plainText(`${f.summary} ${f.bio}`),
      meta: formatLife(f),
      href: entityHref('fig', f.id),
    })),
    ...events.map((e) => ({
      key: `evt:${e.id}`,
      kind: 'Event' as const,
      title: e.title,
      alt: e.themes.join(' '),
      text: plainText(e.summary),
      meta: formatDate(e.date),
      href: entityHref('evt', e.id),
    })),
    ...places.map((p) => ({
      key: `place:${p.id}`,
      kind: 'Place' as const,
      title: p.name,
      alt: [p.ancient, p.modern].filter(Boolean).join(' '),
      text: plainText(p.summary),
      meta: p.modern ? `Modern ${p.modern}` : p.kind,
      href: entityHref('place', p.id),
    })),
    ...sources.map((s) => ({
      key: `src:${s.id}`,
      kind: 'Source' as const,
      title: s.title,
      alt: [s.author, s.citation].filter(Boolean).join(' '),
      text: plainText(`${s.tells} ${s.context} ${s.translation.join(' ')}`),
      meta: `${s.kind}, ${formatDate(s.date)}`,
      href: entityHref('src', s.id),
    })),
    ...terms.map((t) => ({
      key: `term:${t.id}`,
      kind: 'Term' as const,
      title: t.term,
      alt: t.literal ?? '',
      text: plainText(t.def),
      meta: t.category,
      href: entityHref('term', t.id),
    })),
    ...bibliography.map((b) => ({
      key: `bib:${b.id}`,
      kind: 'Reading' as const,
      title: b.title,
      alt: [...(b.authors ?? []), ...(b.editors ?? [])].join(' '),
      text: plainText(b.note),
      meta: `${(b.authors ?? b.editors ?? [''])[0].split(',')[0]} ${b.year}`,
      href: entityHref('bib', b.id),
    })),
    ...debates.map((d) => ({
      key: `debate:${d.id}`,
      kind: 'Debate' as const,
      title: d.title,
      alt: d.question,
      text: plainText(d.why),
      meta: 'Historiographical debate',
      href: entityHref('debate', d.id),
    })),
    ...scenarios.map((s) => ({
      key: `scenario:${s.id}`,
      kind: 'Scenario' as const,
      title: s.title,
      alt: s.role,
      text: plainText(s.summary),
      meta: s.date,
      href: entityHref('scenario', s.id),
    })),
    ...comparisons.map((c) => ({
      key: `cmp:${c.id}`,
      kind: 'Comparison' as const,
      title: c.title,
      alt: c.question,
      text: plainText(c.synthesis),
      meta: 'Comparison',
      href: entityHref('comparison', c.id),
    })),
  ];
}

export function getIndex() {
  if (!index) {
    index = new MiniSearch<SearchDoc>({
      idField: 'key',
      fields: ['title', 'alt', 'text'],
      storeFields: ['key', 'kind', 'title', 'meta', 'href'],
      searchOptions: { boost: { title: 4, alt: 2 }, prefix: true, fuzzy: 0.15, combineWith: 'AND' },
    });
    index.addAll(docs());
  }
  return index;
}

/** Fetch every lesson body and re-index lessons by their full text. Resolves once; safe to call repeatedly. */
export function ensureFullText(): Promise<void> {
  if (!fullText) {
    fullText = loadAllLessonBodies().then((pairs) => {
      const idx = getIndex();
      const byId = new Map(lessons.map((l) => [l.id, l]));
      for (const [id, body] of pairs) idx.replace(lessonDoc(byId.get(id)!, body));
    });
  }
  return fullText;
}

export function search(q: string, limit = 30) {
  if (!q.trim()) return [];
  const idx = getIndex();
  let res = idx.search(q);
  if (!res.length) res = idx.search(q, { combineWith: 'OR' });
  return res.slice(0, limit) as unknown as (SearchDoc & { score: number })[];
}
