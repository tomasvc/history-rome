import { describe, expect, it } from 'vitest';
import { astro, centuryLabel, formatSpan, fromAstro } from '../dates';

describe('dates', () => {
  it('formats spans across the BC/AD boundary without a year zero', () => {
    expect(formatSpan(-133, -121)).toBe('133–121 BC');
    expect(formatSpan(-27, 14)).toBe('27 BC – AD 14');
    expect(formatSpan(284, 305)).toBe('AD 284–305');
    expect(formatSpan(1204, 1453)).toBe('1204–1453');
    expect(formatSpan(-44, -44, true)).toBe('c. 44 BC');
  });
  it('converts to and from astronomical years', () => {
    expect(astro(-1)).toBe(0);
    expect(astro(1)).toBe(1);
    expect(fromAstro(0)).toBe(-1);
    expect(fromAstro(astro(-753))).toBe(-753);
  });
  it('labels centuries', () => {
    expect(centuryLabel(-50)).toBe('1st c. BC');
    expect(centuryLabel(212)).toBe('3rd c. AD');
    expect(centuryLabel(1453)).toBe('15th c. AD');
    expect(centuryLabel(1100)).toBe('11th c. AD');
  });
});
