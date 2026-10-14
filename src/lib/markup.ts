/**
 * A small, purpose-built markup for course content.
 *
 * Block level
 *   ## Section title {#kind}        section (lessons only)
 *   ### Subheading
 *   - item / 1. item               lists
 *   :::name argument               directive block, closed by a line containing only :::
 *
 * Inline
 *   [[fig:augustus|label]]         entity link (fig, evt, src, place, term, lesson, debate, scenario, compare)
 *   [[lesson:severans#women|label]] link to a section of a lesson
 *   {{ref:bib-id|loc}}             modern scholarship note
 *   {{anc:Tac. Ann. 1.2}}          ancient source reference note
 *   {{note:free text}}             explanatory note
 *   **strong**  *emphasis*
 */
export type Inline =
  | { t: 'text'; v: string }
  | { t: 'em'; c: Inline[] }
  | { t: 'strong'; c: Inline[] }
  | { t: 'link'; kind: string; id: string; anchor?: string; label?: string }
  | Note;

export interface Note {
  t: 'note';
  n: number;
  kind: 'ref' | 'anc' | 'note';
  id?: string;
  loc?: string;
  text?: string;
  c?: Inline[];
}

export type Block =
  | { t: 'p'; c: Inline[]; notes: Note[] }
  | { t: 'h3'; c: Inline[] }
  | { t: 'ul' | 'ol'; items: Inline[][]; notes: Note[] }
  | { t: 'dir'; name: string; arg: string; blocks: Block[]; lines: string[] };

export interface Section {
  id: string;
  title: string;
  blocks: Block[];
}

export interface Counter {
  n: number;
}

const INLINE_RE =
  /\[\[([a-z]+):([a-z0-9-]+)(?:#([a-z0-9-]+))?(?:\|([^\]]+))?\]\]|\{\{(ref|anc|note):((?:[^{}]|\{[^{}]*\})+?)\}\}|\*\*(.+?)\*\*|\*([^*\s](?:[^*]*?[^*\s])?)\*/g;

export function parseInline(text: string, counter: Counter = { n: 0 }, allowNotes = true): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE_RE)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ t: 'text', v: text.slice(last, i) });
    if (m[1]) out.push({ t: 'link', kind: m[1], id: m[2], anchor: m[3], label: m[4] });
    else if (m[5]) {
      const kind = m[5] as Note['kind'];
      const raw = m[6].trim();
      if (!allowNotes) {
        out.push({ t: 'text', v: '' });
      } else {
        counter.n += 1;
        if (kind === 'ref') {
          const [id, ...loc] = raw.split('|');
          out.push({ t: 'note', n: counter.n, kind, id: id.trim(), loc: loc.join('|').trim() || undefined });
        } else if (kind === 'anc') out.push({ t: 'note', n: counter.n, kind, text: raw });
        else out.push({ t: 'note', n: counter.n, kind, c: parseInline(raw, counter, false) });
      }
    } else if (m[7]) out.push({ t: 'strong', c: parseInline(m[7], counter, allowNotes) });
    else if (m[8]) out.push({ t: 'em', c: parseInline(m[8], counter, allowNotes) });
    last = i + m[0].length;
  }
  if (last < text.length) out.push({ t: 'text', v: text.slice(last) });
  return out;
}

export function collectNotes(c: Inline[]): Note[] {
  const out: Note[] = [];
  const walk = (xs: Inline[]) => {
    for (const x of xs) {
      if (x.t === 'note') out.push(x);
      else if (x.t === 'em' || x.t === 'strong') walk(x.c);
    }
  };
  walk(c);
  return out;
}

export function parseBlocks(text: string, counter: Counter = { n: 0 }): Block[] {
  const lines = text.replace(/\r/g, '').split('\n');
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushPara = () => {
    if (para.length) {
      const c = parseInline(para.join(' ').trim(), counter);
      blocks.push({ t: 'p', c, notes: collectNotes(c) });
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      const items = list.items.map((it) => parseInline(it, counter));
      blocks.push({ t: list.ordered ? 'ol' : 'ul', items, notes: items.flatMap(collectNotes) });
      list = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith(':::') && trimmed.length > 3) {
      flushPara();
      flushList();
      const head = trimmed.slice(3).trim();
      const sp = head.indexOf(' ');
      const name = sp === -1 ? head : head.slice(0, sp);
      const arg = sp === -1 ? '' : head.slice(sp + 1).trim();
      const inner: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ':::') inner.push(lines[i++]);
      const innerText = inner.join('\n');
      const raw = ['timeline', 'people'].includes(name);
      blocks.push({ t: 'dir', name, arg, lines: inner.filter((l) => l.trim()), blocks: raw ? [] : parseBlocks(innerText, counter) });
      continue;
    }
    if (!trimmed) {
      flushPara();
      flushList();
      continue;
    }
    if (trimmed.startsWith('### ')) {
      flushPara();
      flushList();
      blocks.push({ t: 'h3', c: parseInline(trimmed.slice(4), counter) });
      continue;
    }
    const ul = trimmed.match(/^[-•]\s+(.*)$/);
    const ol = trimmed.match(/^\d+\.\s+(.*)$/);
    if (ul || ol) {
      flushPara();
      const ordered = Boolean(ol);
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push((ul ?? ol)![1]);
      continue;
    }
    if (list && /^\s{2,}\S/.test(line)) {
      list.items[list.items.length - 1] += ' ' + trimmed;
      continue;
    }
    flushList();
    para.push(trimmed);
  }
  flushPara();
  flushList();
  return blocks;
}

export function parseSections(body: string): Section[] {
  const counter = { n: 0 };
  const parts = body.split(/^## /m);
  const sections: Section[] = [];
  const intro = parts.shift() ?? '';
  if (intro.trim()) sections.push({ id: 'introduction', title: 'Introduction', blocks: parseBlocks(intro, counter) });
  for (const part of parts) {
    const nl = part.indexOf('\n');
    const head = (nl === -1 ? part : part.slice(0, nl)).trim();
    const m = head.match(/^(.*?)\s*\{#([a-z0-9-]+)\}\s*$/);
    const title = m ? m[1] : head;
    const id = m ? m[2] : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    sections.push({ id, title, blocks: parseBlocks(nl === -1 ? '' : part.slice(nl + 1), counter) });
  }
  return sections;
}

/** Plain text for search indexing and reading-time estimates. */
export function plainText(text: string): string {
  return text
    .replace(/\{\{(ref|anc|note):((?:[^{}]|\{[^{}]*\})+?)\}\}/g, ' ')
    .replace(/\[\[[a-z]+:([a-z0-9-]+)(?:#[a-z0-9-]+)?\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[[a-z]+:([a-z0-9-]+)(?:#[a-z0-9-]+)?\]\]/g, (_, id: string) => id.replace(/-/g, ' '))
    .replace(/^:::.*$/gm, ' ')
    .replace(/[*#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
