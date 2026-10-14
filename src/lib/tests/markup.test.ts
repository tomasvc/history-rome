import { describe, expect, it } from 'vitest';
import { parseInline, parseSections, plainText } from '../markup';

describe('lesson markup', () => {
  it('parses entity links with section anchors', () => {
    const [, link] = parseInline('See [[lesson:severans#women|the Severan women]].');
    expect(link).toEqual({ t: 'link', kind: 'lesson', id: 'severans', anchor: 'women', label: 'the Severan women' });
  });
  it('numbers notes in order', () => {
    const xs = parseInline('A.{{anc:Tac. Ann. 1.1}} B.{{ref:syme-1939|12}}');
    const notes = xs.filter((x) => x.t === 'note');
    expect(notes.map((n) => (n as { n: number }).n)).toEqual([1, 2]);
  });
  it('splits sections by level-two headings with ids', () => {
    const s = parseSections('## One {#a}\n\nText.\n\n## Two {#b}\n\nMore.');
    expect(s.map((x) => [x.id, x.title])).toEqual([
      ['a', 'One'],
      ['b', 'Two'],
    ]);
  });
  it('produces plain text for search', () => {
    expect(plainText('**Rome** and [[place:carthage#x|Carthage]]{{anc:Polyb. 1.1}}')).toBe('Rome and Carthage');
  });
});
