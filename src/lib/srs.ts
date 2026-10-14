import type { CardState } from './store';

/** Grades follow the familiar four-button scheme. */
export type Grade = 0 | 1 | 2 | 3; // again, hard, good, easy
const DAY = 24 * 60 * 60 * 1000;

export function newCard(now = Date.now()): CardState {
  return { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: now };
}

/**
 * A modified SM-2 schedule. Lapses reset the interval to 10 minutes and lower
 * the ease; successful reviews grow the interval by the ease factor.
 */
export function review(card: CardState, grade: Grade, now = Date.now()): CardState {
  let { ease, interval, reps, lapses } = card;
  if (grade === 0) {
    lapses += 1;
    reps = 0;
    ease = Math.max(1.3, ease - 0.2);
    return { ease, interval: 0, reps, lapses, due: now + 10 * 60 * 1000, last: now };
  }
  reps += 1;
  if (grade === 1) ease = Math.max(1.3, ease - 0.15);
  if (grade === 3) ease = ease + 0.15;
  if (reps === 1) interval = grade === 3 ? 4 : 1;
  else if (reps === 2) interval = grade === 1 ? 3 : 6;
  else interval = Math.round(interval * (grade === 1 ? 1.2 : ease) * (grade === 3 ? 1.3 : 1));
  interval = Math.min(interval, 365);
  return { ease, interval, reps, lapses, due: now + interval * DAY, last: now };
}

export function isDue(card: CardState | undefined, now = Date.now()) {
  return !card || card.due <= now;
}

export function nextIntervalLabel(card: CardState | undefined, grade: Grade): string {
  const c = review(card ?? newCard(), grade);
  if (grade === 0) return '10 min';
  return c.interval === 1 ? '1 day' : `${c.interval} days`;
}

export function strength(card: CardState | undefined): 'new' | 'learning' | 'young' | 'mature' {
  if (!card || card.reps === 0) return card && card.lapses > 0 ? 'learning' : 'new';
  if (card.interval < 7) return 'learning';
  if (card.interval < 21) return 'young';
  return 'mature';
}
