import { useSyncExternalStore } from 'react';
import type { EntityKind, Skill } from '../types';

/** Everything the learner creates is kept in one versioned localStorage record. */
export interface CardState {
  ease: number;
  interval: number; // days
  reps: number;
  lapses: number;
  due: number; // epoch ms
  last?: number;
}
export interface CheckResult {
  attempts: number;
  correct: number;
  score: number; // last score 0..1
  skill: Skill;
  lesson?: string;
  module?: string;
  at: number;
}
export interface Ref {
  kind: EntityKind;
  id: string;
  title: string;
}
export interface StudyState {
  version: 1;
  progress: Record<string, { completed?: number; visited?: number; section?: string }>;
  bookmarks: Record<string, Ref & { at: number }>;
  notes: Record<string, Ref & { text: string; at: number }>;
  recent: (Ref & { at: number })[];
  checks: Record<string, CheckResult>;
  cards: Record<string, CardState>;
  quizRuns: { quiz: string; at: number; score: number; total: number }[];
  scenarioRuns: { id: string; at: number; path: string[]; ending: string }[];
  positions: Record<string, { value: string; text: string; at: number; weighed?: Record<string, string> }>;
  essays: Record<string, { thesis: string; points: string; counter: string; draft: string; at: number }>;
  answers: Record<string, string>;
  settings: { theme: 'system' | 'light' | 'dark'; textSize?: 'normal' | 'large' };
}

const KEY = 'tabularium.v1';
const empty = (): StudyState => ({
  version: 1,
  progress: {},
  bookmarks: {},
  notes: {},
  recent: [],
  checks: {},
  cards: {},
  quizRuns: [],
  scenarioRuns: [],
  positions: {},
  essays: {},
  answers: {},
  settings: { theme: 'system' },
});

function load(): StudyState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw);
    return { ...empty(), ...parsed, settings: { ...empty().settings, ...(parsed.settings || {}) } };
  } catch {
    return empty();
  }
}

let state: StudyState = load();
let storageOk = true;
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    storageOk = true;
  } catch {
    storageOk = false;
  }
}

export function update(fn: (s: StudyState) => StudyState | void) {
  const draft = structuredClone(state);
  const next = fn(draft) ?? draft;
  state = next;
  persist();
  listeners.forEach((l) => l());
}

export function getState() {
  return state;
}
export function storageAvailable() {
  return storageOk;
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = load();
      l();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener('storage', onStorage);
  };
}

export function useStudy<T>(select: (s: StudyState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => select(state),
    () => select(state),
  );
}

// ---- actions ----
export const refKey = (kind: EntityKind, id: string) => `${kind}:${id}`;

export function visit(ref: Ref) {
  update((s) => {
    s.recent = [{ ...ref, at: Date.now() }, ...s.recent.filter((r) => !(r.kind === ref.kind && r.id === ref.id))].slice(0, 30);
    if (ref.kind === 'lesson') s.progress[ref.id] = { ...s.progress[ref.id], visited: Date.now() };
  });
}

export function toggleBookmark(ref: Ref) {
  update((s) => {
    const k = refKey(ref.kind, ref.id);
    if (s.bookmarks[k]) delete s.bookmarks[k];
    else s.bookmarks[k] = { ...ref, at: Date.now() };
  });
}

export function saveNote(ref: Ref, text: string) {
  update((s) => {
    const k = refKey(ref.kind, ref.id);
    if (!text.trim()) delete s.notes[k];
    else s.notes[k] = { ...ref, text, at: Date.now() };
  });
}

export function setLessonComplete(id: string, done: boolean) {
  update((s) => {
    s.progress[id] = { ...s.progress[id], completed: done ? Date.now() : undefined };
  });
}

export function recordCheck(id: string, r: Omit<CheckResult, 'attempts' | 'correct' | 'at'> & { ok: boolean }) {
  update((s) => {
    const prev = s.checks[id];
    s.checks[id] = {
      attempts: (prev?.attempts ?? 0) + 1,
      correct: (prev?.correct ?? 0) + (r.ok ? 1 : 0),
      score: r.score,
      skill: r.skill,
      lesson: r.lesson,
      module: r.module,
      at: Date.now(),
    };
  });
}

export function setTheme(theme: StudyState['settings']['theme']) {
  update((s) => {
    s.settings.theme = theme;
  });
  if (theme === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
}
export function setTextSize(size: 'normal' | 'large') {
  update((s) => {
    s.settings.textSize = size;
  });
  document.documentElement.dataset.textsize = size;
}

export function exportState(): string {
  return JSON.stringify(state, null, 2);
}
export function importState(json: string): boolean {
  try {
    const parsed = JSON.parse(json);
    if (parsed.version !== 1) return false;
    update(() => ({ ...empty(), ...parsed }));
    return true;
  } catch {
    return false;
  }
}
export function resetState() {
  update(() => empty());
}

export function saveAnswer(id: string, text: string) {
  update((s) => {
    s.answers[id] = text;
  });
}
