import { describe, expect, it } from 'vitest';
import { isDue, newCard, review, strength } from '../srs';

const DAY = 86_400_000;
describe('spaced repetition', () => {
  const t0 = Date.UTC(2026, 0, 1);
  it('grows intervals on successful reviews', () => {
    let c = review(newCard(t0), 2, t0);
    expect(c.interval).toBe(1);
    c = review(c, 2, c.due);
    expect(c.interval).toBe(6);
    c = review(c, 2, c.due);
    expect(c.interval).toBe(15);
    expect(strength(c)).toBe('young');
  });
  it('resets a lapsed card to a short relearning step and lowers ease', () => {
    const c = review(review(newCard(t0), 2, t0), 0, t0 + DAY);
    expect(c.interval).toBe(0);
    expect(c.lapses).toBe(1);
    expect(c.ease).toBeCloseTo(2.3);
    expect(c.due - (t0 + DAY)).toBe(10 * 60 * 1000);
    expect(strength(c)).toBe('learning');
  });
  it('never lets ease fall below 1.3 and caps intervals at a year', () => {
    let c = newCard(t0);
    for (let i = 0; i < 10; i++) c = review(c, 0, t0);
    expect(c.ease).toBe(1.3);
    c = { ...c, reps: 5, interval: 300, ease: 2.5 };
    expect(review(c, 3, t0).interval).toBe(365);
  });
  it('treats unseen cards as due', () => {
    expect(isDue(undefined, t0)).toBe(true);
    expect(isDue({ ...newCard(t0), due: t0 + DAY }, t0)).toBe(false);
  });
});
