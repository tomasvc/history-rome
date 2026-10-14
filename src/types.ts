// Content model for Tabularium. Years are integers: negative = BC, positive = AD (no year zero).

export type Theme = 'political' | 'military' | 'social' | 'cultural' | 'economic' | 'religious' | 'legal';
export const THEMES: Theme[] = ['political', 'military', 'social', 'cultural', 'economic', 'religious', 'legal'];

/** How secure a statement is. Used for claim boxes, dates and identifications. */
export type Certainty = 'established' | 'interpretation' | 'contested' | 'speculative';

export type Skill = 'recall' | 'chronology' | 'causation' | 'source' | 'interpretation' | 'comparison' | 'argument';

export interface DateSpec {
  from: number;
  to?: number;
  circa?: boolean;
  /** Free-text display override, e.g. "Jan 49 BC" */
  label?: string;
  /** Explains uncertainty: e.g. "Traditional date; archaeology suggests a gradual process" */
  note?: string;
}

export interface Part {
  id: string;
  numeral: string;
  title: string;
  subtitle: string;
  span: [number, number];
  tone: 'cinnabar' | 'black' | 'ochre' | 'porphyry' | 'caeruleum';
  summary: string;
  modules: string[];
}

export interface EssayPrompt {
  id: string;
  prompt: string;
  guidance: string;
  readings?: string[];
}

export interface Module {
  id: string;
  part: string;
  number: number;
  title: string;
  subtitle?: string;
  span: [number, number];
  summary: string;
  objectives: string[];
  lessons: string[];
  essays: EssayPrompt[];
  readings: string[];
}

export interface StudyWeek {
  week: number;
  title: string;
  lessons: string[];
  tasks: string[];
}
export interface StudyTerm {
  id: string;
  title: string;
  summary: string;
  weeks: StudyWeek[];
}

export interface Curriculum {
  parts: Part[];
  modules: Module[];
  terms: StudyTerm[];
}

// ---- Assessment ----
interface CheckBase {
  id: string;
  skill: Skill;
  prompt: string;
  /** lesson the check belongs to (filled by loader for lesson checks) */
  lesson?: string;
  module?: string;
}
export interface McqCheck extends CheckBase {
  type: 'mcq';
  options: { text: string; correct?: boolean; why: string }[];
}
export interface OrderCheck extends CheckBase {
  type: 'order';
  /** items listed in the correct order; UI shuffles */
  items: string[];
  explain: string;
}
export interface MatchCheck extends CheckBase {
  type: 'match';
  pairs: { left: string; right: string }[];
  explain: string;
}
export interface WrittenCheck extends CheckBase {
  type: 'short' | 'source' | 'essay';
  sourceId?: string;
  model: string;
  rubric: string[];
}
export type Check = McqCheck | OrderCheck | MatchCheck | WrittenCheck;

export interface Quiz {
  id: string;
  module: string;
  title: string;
  checks: Check[];
}

// ---- Lessons ----
export interface ReadingRef {
  ref: string;
  note?: string;
  loc?: string;
}
export interface LessonMeta {
  id: string;
  module: string;
  title: string;
  subtitle?: string;
  span: [number, number];
  minutes: number;
  status: 'complete' | 'outline';
  objectives: string[];
  questions: string[];
  figures?: string[];
  events?: string[];
  places?: string[];
  sources?: string[];
  terms?: string[];
  debates?: string[];
  checks?: Check[];
  reading?: ReadingRef[];
  inquiry?: string[];
}
/** Derived at build time from the lesson body, which itself is loaded on demand (see loadLessonBody). */
export interface Lesson extends LessonMeta {
  stats: { words: number; sources: number; diagrams: number };
  mentions: Partial<Record<'fig' | 'evt' | 'src' | 'term' | 'place' | 'debate' | 'lesson' | 'scenario' | 'compare', string[]>>;
  refs: string[];
  headings: string[];
  sections: { id: string; title: string }[];
}

// ---- People ----
export type RelationType =
  | 'parent'
  | 'spouse'
  | 'adoptive-parent'
  | 'sibling'
  | 'ally'
  | 'rival'
  | 'patron'
  | 'teacher'
  | 'successor'
  | 'killed'
  | 'colleague'
  | 'other-family';
export interface Relation {
  to: string;
  type: RelationType;
  note?: string;
}
export interface Figure {
  id: string;
  name: string;
  full?: string;
  born?: DateSpec;
  died?: DateSpec;
  floruit?: DateSpec;
  category: 'ruler' | 'politician' | 'general' | 'writer' | 'woman' | 'religious' | 'foreign' | 'jurist' | 'other';
  roles: string[];
  dynasty?: string;
  summary: string;
  bio: string;
  evidence: string;
  relations?: Relation[];
  events?: string[];
  sources?: string[];
  image?: string;
}

export interface StemmaNode {
  id: string; // figure id or ad-hoc id
  label?: string; // for non-figure nodes
  x: number;
  y: number;
  ruler?: boolean;
}
export interface StemmaEdge {
  from: string;
  to: string;
  kind: 'birth' | 'marriage' | 'adoption';
}
export interface Stemma {
  id: string;
  title: string;
  span: [number, number];
  summary: string;
  nodes: StemmaNode[];
  edges: StemmaEdge[];
  notes: string[];
}

// ---- Events / places ----
export interface HistEvent {
  id: string;
  title: string;
  date: DateSpec;
  themes: Theme[];
  weight: 1 | 2 | 3;
  summary: string;
  causes?: string[];
  figures?: string[];
  places?: string[];
  sources?: string[];
  lesson?: string;
  certainty?: Certainty;
}

export interface Place {
  id: string;
  name: string;
  ancient?: string;
  modern?: string;
  lat: number;
  lon: number;
  kind: 'city' | 'battle' | 'frontier' | 'site' | 'port';
  /** 1 = always labelled; 2 = labelled when zoomed; 3 = minor */
  rank?: 1 | 2 | 3;
  /** years during which the place is shown on the atlas */
  span?: [number, number];
  summary: string;
  locationNote?: string;
  events?: string[];
}

// ---- Primary sources ----
export type SourceKind =
  | 'inscription'
  | 'coin'
  | 'law'
  | 'speech'
  | 'letter'
  | 'history'
  | 'biography'
  | 'papyrus'
  | 'tablet'
  | 'archaeology'
  | 'poetry'
  | 'philosophy'
  | 'religious';

export interface CoinFace {
  legend: string;
  /** expansions for legend abbreviations */
  gloss?: { abbr: string; full: string; meaning: string }[];
  device: string; // description
  motif?: 'portrait' | 'daggers' | 'aquila' | 'temple' | 'chirho' | 'wreath' | 'standards' | 'crocodile' | 'clasped' | 'gate';
}
export interface PrimarySource {
  id: string;
  title: string;
  kind: SourceKind;
  author?: string;
  date: DateSpec;
  origin?: string;
  language: string;
  citation: string;
  themes: Theme[];
  original?: string[];
  translation: string[];
  translator: string;
  context: string;
  creator: string;
  audience: string;
  tells: string;
  limits: string;
  usage: string;
  related?: string[];
  coin?: { obverse: CoinFace; reverse: CoinFace; denomination: string; ref?: string };
  exercise?: { q: string; model: string }[];
  editions?: string[];
  image?: string;
}

// ---- Glossary / bibliography ----
export interface Term {
  id: string;
  term: string;
  lang?: 'Latin' | 'Greek' | 'English' | 'German' | 'Persian';
  literal?: string;
  category: 'office' | 'institution' | 'concept' | 'military' | 'religion' | 'law' | 'society' | 'economy' | 'historiography' | 'place';
  def: string;
  related?: string[];
}

export type BibType = 'primary' | 'monograph' | 'edited' | 'article' | 'chapter' | 'reference' | 'digital' | 'sourcebook';
export interface BibEntry {
  id: string;
  type: BibType;
  authors?: string[];
  editors?: string[];
  translators?: string[];
  title: string;
  container?: string; // journal or edited volume
  volume?: string;
  issue?: string;
  pages?: string;
  edition?: string;
  place?: string;
  publisher?: string;
  year: string;
  url?: string;
  doi?: string;
  level: 'introductory' | 'intermediate' | 'advanced';
  topics: string[];
  note: string;
  verified?: 'catalogue' | 'unverified';
  verifiedNote?: string;
  /** Verified in a catalogue, but the page range could not be confirmed there. */
  pagesUnchecked?: boolean;
}

// ---- Debates / comparisons / scenarios ----
export interface DebatePosition {
  id: string;
  label: string;
  claim: string;
  argument: string;
  proponents: { name: string; ref?: string; year?: string }[];
  weaknesses: string;
}
export interface DebateEvidence {
  id: string;
  text: string;
  source?: string;
  supports: string[]; // position ids
  comment: string;
}
export interface Debate {
  id: string;
  title: string;
  question: string;
  span: [number, number];
  why: string;
  positions: DebatePosition[];
  evidence: DebateEvidence[];
  history: { year: string; who: string; what: string; ref?: string }[];
  state: string;
  lessons?: string[];
  reading?: string[];
}

export interface Comparison {
  id: string;
  title: string;
  question: string;
  columns: { id: string; label: string; span?: string; figure?: string }[];
  rows: { dimension: string; cells: Record<string, string>; note?: string }[];
  synthesis: string;
  exam: { prompt: string; model: string };
  lessons?: string[];
}

export interface ScenarioChoice {
  label: string;
  detail?: string;
  next: string; // node id
  effects?: Record<string, number>;
  outcome: string;
  /** true if this is what actually happened; false/undefined marks a counterfactual path */
  historical?: boolean;
}
export interface ScenarioNode {
  id: string;
  date?: string;
  title: string;
  text: string;
  choices?: ScenarioChoice[];
  end?: boolean;
}
export interface Scenario {
  id: string;
  title: string;
  role: string;
  date: string;
  span: [number, number];
  summary: string;
  briefing: string;
  stakes: { id: string; label: string; start: number; note: string }[];
  start: string;
  nodes: ScenarioNode[];
  history: string;
  debrief: string[];
  sources?: string[];
  lessons?: string[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  deck: string;
  lesson?: string;
}

export interface AtlasSnapshot {
  id: string;
  year: number;
  label: string;
  layer: string;
  roles?: string[];
  provinces?: 'prov_200' | 'prov_late';
  source: 'AWMC' | 'HB' | 'derived';
  /** previous/next snapshot years define which battles and events appear */
  era?: [number, number];
  confidence: Certainty;
  summary: string;
  caveat: string;
}

export interface AtlasLine {
  id: string;
  name: string;
  kind: 'river' | 'route' | 'frontier';
  coords: [number, number][];
  note: string;
  span?: [number, number];
}

export interface MuseumImage {
  id: string;
  file: string; // Wikimedia Commons file name
  title: string;
  object: string;
  date: string;
  holding?: string;
  credit: string;
  license: string;
  caveat?: string;
  kind: 'artifact' | 'site' | 'reconstruction' | 'manuscript' | 'coin' | 'portrait';
}

export type EntityKind = 'lesson' | 'figure' | 'event' | 'place' | 'source' | 'term' | 'debate' | 'bib' | 'scenario' | 'comparison' | 'module';
