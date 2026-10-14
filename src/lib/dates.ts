import type { DateSpec } from '../types';

/** Convert a historical year (no year zero) to an astronomical number for scales. */
export const astro = (y: number) => (y < 0 ? y + 1 : y);
/** Inverse of astro. */
export const fromAstro = (a: number) => (a <= 0 ? a - 1 : a);

export function formatYear(y: number, opts: { era?: boolean } = {}): string {
  const era = opts.era ?? true;
  if (y < 0) return era ? `${-y} BC` : `${-y}`;
  if (y >= 1000) return `${y}`;
  return era ? `AD ${y}` : `${y}`;
}

/** "133–121 BC", "27 BC – AD 14", "AD 284–305", "1204–1453" */
export function formatSpan(from: number, to?: number, circa = false): string {
  const c = circa ? 'c. ' : '';
  if (to === undefined || to === from) return c + formatYear(from);
  if (from < 0 && to < 0) return `${c}${-from}–${-to} BC`;
  if (from > 0 && to > 0) {
    if (from >= 1000) return `${c}${from}–${to}`;
    return `${c}AD ${from}–${to}`;
  }
  return `${c}${formatYear(from)} – ${formatYear(to)}`;
}

export function formatDate(d: DateSpec | undefined): string {
  if (!d) return '';
  if (d.label) return d.label;
  return formatSpan(d.from, d.to, d.circa);
}

export function centuryLabel(y: number): string {
  const bc = y < 0;
  const n = bc ? Math.ceil(-y / 100) : Math.ceil(y / 100);
  const ord = (k: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = k % 100;
    return k + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  return `${ord(n)} c. ${bc ? 'BC' : 'AD'}`;
}

/** The overall span of the course. */
export const COURSE_START = -753;
export const COURSE_END = 1453;

export interface Period {
  id: string;
  label: string;
  short: string;
  from: number;
  to: number;
  tone: string;
}
/** Conventional periods. The boundaries are modern conventions, not ancient ones. */
export const PERIODS: Period[] = [
  { id: 'regal', label: 'Regal period (traditional)', short: 'Kings', from: -753, to: -509, tone: 'var(--c-umber)' },
  { id: 'early-rep', label: 'Early and Middle Republic', short: 'Republic', from: -509, to: -133, tone: 'var(--c-cinnabar)' },
  { id: 'late-rep', label: 'Late Republic', short: 'Late Rep.', from: -133, to: -27, tone: 'var(--c-oxblood)' },
  { id: 'principate', label: 'Principate', short: 'Principate', from: -27, to: 235, tone: 'var(--c-ink-soft)' },
  { id: 'crisis', label: 'Third-century crisis', short: 'Crisis', from: 235, to: 284, tone: 'var(--c-ochre)' },
  { id: 'late-ant', label: 'Late Roman Empire', short: 'Late Empire', from: 284, to: 476, tone: 'var(--c-verdigris)' },
  { id: 'early-byz', label: 'East Rome: Late Antiquity to the 7th century', short: 'East Rome', from: 476, to: 641, tone: 'var(--c-porphyry)' },
  { id: 'mid-byz', label: 'Middle Byzantine period', short: 'Middle Byz.', from: 641, to: 1204, tone: 'var(--c-caeruleum)' },
  { id: 'late-byz', label: 'Late Byzantine period', short: 'Late Byz.', from: 1204, to: 1453, tone: 'var(--c-slate)' },
];

export function periodFor(y: number): Period | undefined {
  return PERIODS.find((p) => y >= p.from && y < p.to) ?? (y >= 1453 ? PERIODS[PERIODS.length - 1] : undefined);
}
