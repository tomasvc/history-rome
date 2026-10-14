import { describe, expect, it } from 'vitest';
import { autoLink, figureNames, type LinkTarget } from '../autolink';

const fig = (id: string, name: string): LinkTarget => ({ kind: 'fig', id, names: figureNames(name, id), caseSensitive: true });

describe('autolinking', () => {
  it('links only the first mention', () => {
    const out = autoLink('Hadrian built a wall. Hadrian travelled.', [fig('hadrian', 'Hadrian')]);
    expect(out).toBe('[[fig:hadrian|Hadrian]] built a wall. Hadrian travelled.');
  });
  it('does not mistake part of a longer name for the person', () => {
    const t = [fig('tiberius', 'Tiberius'), fig('claudius', 'Claudius')];
    const out = autoLink('Tiberius Gracchus and Appius Claudius were not emperors. Later Tiberius and Claudius ruled.', t);
    expect(out).toBe('Tiberius Gracchus and Appius Claudius were not emperors. Later [[fig:tiberius|Tiberius]] and [[fig:claudius|Claudius]] ruled.');
  });
  it('leaves headings, directive blocks and explicit links alone', () => {
    const body = '## Hadrian {#h}\n\n:::source x\nHadrian\n:::\n\nSee [[fig:hadrian|the emperor]]; Hadrian again.';
    expect(autoLink(body, [fig('hadrian', 'Hadrian')])).toBe(body);
  });
  it('skips regnal numbers and "the Elder"', () => {
    const out = autoLink('Constantine VII wrote. Constantine founded a city.', [fig('constantine', 'Constantine')]);
    expect(out).toBe('Constantine VII wrote. [[fig:constantine|Constantine]] founded a city.');
  });
});
