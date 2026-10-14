import type { BibEntry } from '../types';

/** Chicago Manual of Style (17th ed.) notes-and-bibliography, as plain text with *italic* markers. */

const invertFirst = (names: string[]) =>
  names.map((n, i) => {
    if (i === 0) return n; // already "Last, First"
    const [last, first] = n.split(',').map((s) => s.trim());
    return first ? `${first} ${last}` : last;
  });

const ETAL = 'et al.';

function joinNames(names: string[]): string {
  if (names.includes(ETAL)) return `${invertFirst(names.filter((n) => n !== ETAL)).join(', ')}, et al.`;
  const ns = invertFirst(names);
  if (ns.length === 1) return ns[0];
  if (ns.length === 2) return `${ns[0]}, and ${ns[1]}`;
  if (ns.length > 10) return `${ns.slice(0, 7).join(', ')}, et al.`;
  return `${ns.slice(0, -1).join(', ')}, and ${ns[ns.length - 1]}`;
}
const natural = (n: string) => {
  const [last, first] = n.split(',').map((s) => s.trim());
  return first ? `${first} ${last}` : last;
};
const naturalList = (names: string[]) => {
  const ns = names.map(natural);
  if (ns.length <= 2) return ns.join(' and ');
  return `${ns.slice(0, -1).join(', ')}, and ${ns[ns.length - 1]}`;
};
const pub = (b: BibEntry) => [b.place, b.publisher].filter(Boolean).join(': ');
const end = (s: string) => (/[.?!]$/.test(s) ? s : s + '.');

export function bibliographyEntry(b: BibEntry): string {
  const who = b.authors?.length ? joinNames(b.authors) : b.editors?.length ? `${joinNames(b.editors)}, ${b.editors.length > 1 ? 'eds' : 'ed'}` : '';
  const head = who ? end(who) + ' ' : '';
  const tr = b.translators?.length ? ` Translated by ${naturalList(b.translators)}.` : '';
  const eds = b.authors?.length && b.editors?.length ? ` Edited by ${naturalList(b.editors)}.` : '';
  const edn = b.edition ? ` ${end(b.edition)}` : '';
  const link = b.doi ? ` https://doi.org/${b.doi}.` : b.url ? ` ${b.url}.` : '';
  switch (b.type) {
    case 'article': {
      const vol = [b.volume, b.issue ? `no. ${b.issue}` : ''].filter(Boolean).join(', ');
      return `${head}“${end(b.title)}” *${b.container}* ${vol} (${b.year})${b.pages ? `: ${b.pages}` : ''}.${link}`;
    }
    case 'chapter':
      return `${head}“${end(b.title)}” In *${b.container}*${b.editors?.length ? `, edited by ${naturalList(b.editors)}` : ''}${b.pages ? `, ${b.pages}` : ''}. ${pub(b)}, ${b.year}.${link}`;
    case 'digital':
      return `${head}*${b.title}*. ${b.publisher ? b.publisher + '. ' : ''}${b.year && b.year !== 'n.d.' ? b.year + '. ' : ''}${b.url ?? ''}`.trim();
    default:
      return `${head}*${end(b.title).replace(/\.$/, '')}*.${edn}${tr}${eds}${b.volume ? ` ${b.volume}.` : ''} ${pub(b)}${pub(b) ? ', ' : ''}${b.year}.${link}`.replace(
        /\s+/g,
        ' ',
      );
  }
}

/** Short note form: "Syme, *Roman Revolution*, 12." */
export function shortNote(b: BibEntry, loc?: string): string {
  const who = b.authors?.includes(ETAL)
    ? `${b.authors[0].split(',')[0]} et al.`
    : b.authors?.length
    ? b.authors.map((a) => a.split(',')[0]).slice(0, 3).join(b.authors.length === 2 ? ' and ' : ', ')
    : b.editors?.length
      ? b.editors.map((a) => a.split(',')[0]).slice(0, 2).join(' and ')
      : '';
  const short = b.title.split(':')[0].replace(/^(The|A|An) /, (m) => (b.title.split(':')[0].split(' ').length > 4 ? '' : m));
  const title = b.type === 'article' || b.type === 'chapter' ? `“${short}”` : `*${short}*`;
  // Chicago: commas and periods go inside closing quotation marks.
  return ([who, title, loc].filter(Boolean).join(', ') + '.').replace(/”([,.])/g, '$1”');
}

/** Author–date label, e.g. "Syme 1939" */
export function authorDate(b: BibEntry): string {
  const who = (b.authors ?? b.editors ?? [b.title]).map((a) => a.split(',')[0]);
  const w = who.length > 2 || who.includes(ETAL) ? `${who[0]} et al.` : who.join(' and ');
  return `${w} ${b.year}`;
}

export const normTitle = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
/** A lesson's note on a reading adds nothing if it only repeats the work's title. */
export function addsToTitle(note: string, title: string): boolean {
  const n = normTitle(note);
  const t = normTitle(title);
  if (!n) return false;
  if (n === t || t.startsWith(n)) return false;
  if (n.startsWith(t) && n.length - t.length < 14) return false;
  if (n.length < 25 && t.includes(n)) return false;
  return true;
}
