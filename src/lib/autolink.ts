/**
 * Links the first mention of each person, place and term that a lesson declares in its front matter,
 * so that readers can open a profile, map or definition from the running text. Authors' explicit
 * [[kind:id|...]] links always take precedence, and directive blocks and headings are left alone.
 */
export interface LinkTarget {
  kind: 'fig' | 'place' | 'term';
  id: string;
  names: string[];
  caseSensitive: boolean;
}

const SKIP_BLOCKS = new Set(['timeline', 'people', 'check', 'source', 'debate', 'diagram', 'image', 'stemma']);

/** Name variants people actually use in prose. */
export function figureNames(name: string, id: string): string[] {
  const out = new Set<string>([name]);
  const base = name.replace(/\s*\(.*?\)\s*/g, '').trim();
  if (base !== name) return []; // "Julia (daughter of Caesar)": too ambiguous to match in prose
  const extra: Record<string, string[]> = {
    marius: ['Marius'],
    caesar: ['Caesar'],
    'mithridates': ['Mithridates'],
    cleopatra: ['Cleopatra'],
    eusebius: ['Eusebius'],
    ammianus: ['Ammianus'],
    theoderic: ['Theoderic'],
    'alexios-i': ['Alexios'],
    'michael-viii': ['Michael VIII'],
    'constantine-xi': ['Constantine XI'],
    'cato-elder': ['Cato'],
    'pliny-younger': ['Pliny'],
    'mark-antony': ['Antony'],
    'theodosius-i': ['Theodosius'],
    'shapur-i': ['Shapur'],
    'hamilcar-barca': ['Hamilcar'],
    'appius-claudius-caecus': ['Appius Claudius'],
    'tarquinius-superbus': ['Tarquin'],
  };
  for (const e of extra[id] ?? []) out.add(e);
  return [...out];
}

export function placeNames(p: { name: string; modern?: string }): string[] {
  const out = new Set<string>([p.name]);
  if (p.modern && !/[(,]/.test(p.modern)) out.add(p.modern);
  if (p.name.startsWith('River ')) out.add(p.name.slice(6));
  if (p.name === 'Hippo Regius') out.add('Hippo');
  if (p.name === 'Caesarea Maritima') out.add('Caesarea');
  return [...out];
}

export function termNames(term: string, id: string): string[] {
  if (/\(/.test(term)) return []; // e.g. "Augustus (title)", which would collide with the person
  const special: Record<string, string[]> = {
    freedman: ['freedman', 'freedmen', 'freedwoman', 'freedwomen', 'freedpeople'],
    colonia: ['colony', 'colonies', 'colonia'],
    lares: ['Lares'],
    nicene: ['Nicene'],
    council: ['ecumenical council', 'council'],
    chalcedon: ['Chalcedon'],
    'tribune-plebs': ['tribune of the plebs', 'tribunes of the plebs'],
  };
  if (special[id]) return special[id];
  return term.split(/,\s*/).filter(Boolean);
}

/** First names and family names that, placed before a one-word name, show it belongs to someone else. */
const PRAENOMINA = 'Appius|Aulus|Decimus|Gaius|Gnaeus|Lucius|Manius|Marcus|Publius|Quintus|Servius|Sextus|Spurius|Tiberius|Titus|Julia|Flavius|Aurelius|Claudius|Septimius|Didius|Clodius|Pescennius|Junius|Cornelius|Valerius';
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function autoLink(body: string, targets: LinkTarget[]): string {
  const already = new Set<string>();
  for (const m of body.matchAll(/\[\[([a-z]+):([a-z0-9-]+)/g)) already.add(`${m[1]}:${m[2]}`);
  const pending = targets.filter((t) => !already.has(`${t.kind}:${t.id}`) && t.names.length);
  if (!pending.length) return body;

  // Targets with longer names first, so "Tiberius Gracchus" wins over "Tiberius";
  // within a target, the earliest mention in the line wins.
  const ordered = [...pending].sort((a, b) => Math.max(...b.names.map((n) => n.length)) - Math.max(...a.names.map((n) => n.length)));
  const done = new Set<string>();

  const lines = body.split('\n');
  let skipping = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith(':::')) {
      const name = trimmed.slice(3).split(/\s+/)[0];
      skipping = name ? SKIP_BLOCKS.has(name) : false;
      continue;
    }
    if (skipping || trimmed.startsWith('#') || !trimmed) continue;
    let text = line;
    for (const t of ordered) {
      const key = `${t.kind}:${t.id}`;
      if (done.has(key)) continue;
      const protectedRanges: [number, number][] = [];
      for (const m of text.matchAll(/\[\[[^\]]*\]\]|\{\{(?:[^{}]|\{[^{}]*\})*\}\}/g)) protectedRanges.push([m.index!, m.index! + m[0].length]);
      let found = -1;
      let matchLen = 0;
      for (const n of [...t.names].sort((a, b) => b.length - a.length)) {
        // A one-word personal name inside a longer name ("Tiberius Gracchus", "Appius Claudius",
        // "Claudius Terentianus") refers to someone else.
        const single = t.kind === 'fig' && !/\s/.test(n);
        const guard = single ? `(?!\\s+\\p{Lu}\\p{Ll})` : '';
        const before = single ? `(?<!\\b(?:${PRAENOMINA})\\s)` : '';
        const re = new RegExp(
          `(^|[^\\p{L}\\[|:-])${before}(${escape(n)}${t.kind === 'term' ? '(?:s|es)?' : ''})(?![\\p{L}-])(?!\\s+(?:[IVX]+\\b|the\\s+(?:Elder|Younger)\\b))${guard}`,
          t.caseSensitive ? 'gu' : 'giu',
        );
        for (const m of text.matchAll(re)) {
          const start = m.index! + m[1].length;
          if (protectedRanges.some(([x, y]) => start >= x && start < y)) continue;
          if (found === -1 || start < found) {
            found = start;
            matchLen = m[2].length;
          }
          break;
        }
      }
      if (found >= 0) {
        const matched = text.slice(found, found + matchLen);
        text = `${text.slice(0, found)}[[${t.kind}:${t.id}|${matched}]]${text.slice(found + matchLen)}`;
        done.add(key);
      }
    }
    lines[i] = text;
  }
  return lines.join('\n');
}
