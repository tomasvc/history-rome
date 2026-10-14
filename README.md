# Tabularium: Roman history, 753 BC – AD 1453

A university-level course on Rome, from the foundation legends to the fall of Constantinople, built as a single-page web app. It is meant to be studied, not skimmed: every lesson argues from evidence, separates what is established from what is interpreted or contested, and sends the reader to the ancient sources and the modern debates.

## What is in it

| | |
| --- | --- |
| Lessons | 43, in 5 parts and 27 modules (about 75,000 words), each with aims, chronology, case studies, primary sources, knowledge checks, historiography and a reading list |
| Study plan | 3 terms of 11 weeks, with weekly lessons and tasks and two essays per term |
| People | 132 profiles, lifespans chart, relationship network and 4 family trees |
| Timeline | 182 dated events with causes and consequences |
| Atlas | 104 places and 17 period snapshots of Roman territory |
| Primary sources | 54 texts with context, translation (and original where useful), what the source can and cannot tell us, and an exercise with a model answer |
| Debates | 18 historiographical debates with positions, proponents, evidence and the state of the question |
| Comparisons and scenarios | 6 structured comparisons and 6 decision scenarios that mark which paths are historical and which are counterfactual |
| Diagrams | 19 interactive explanatory diagrams (the centuriate assembly, Cannae, the legion, the tetrarchy, the Theodosian walls and others) |
| Revision | 27 module quizzes (95 questions: multiple choice, ordering, matching and written answers with rubrics), 172 in-lesson checks, a spaced-repetition flashcard deck, essay prompts and an insights view |
| Library | 296 works in Chicago notes-and-bibliography style, each checked against a catalogue (see below) |
| Glossary | 166 terms |

Progress, notes, bookmarks, flashcard scheduling and answers are kept in the browser's local storage. The My study page can export and import them as a file.

## Running it

Requires Node.js 20 or later.

```bash
npm install
npm run dev        # development server with hot reload
npm run build      # type-check and build into dist/
npm run preview    # serve the built app at http://localhost:4173
```

The build is static and uses relative paths and hash routing, so `dist/` can be served from any static host or sub-folder. It must be served over HTTP; opening `dist/index.html` directly from disk will not work, because browsers block module scripts on `file://`.

Museum photographs load from Wikimedia Commons, so they need an internet connection. Everything else works offline once loaded.

## Checks

```bash
npm run validate   # content integrity: every cross-reference, citation, check, diagram and section anchor must resolve
npm test           # unit tests (dates, spaced repetition, Chicago citations, autolinking, lesson markup)
npm run lint       # oxlint
```

`npm run validate` also catches the commonest YAML mistake in the content: an unquoted line containing `: `, which YAML silently turns into a mapping instead of text.

## How the content is organised

All course content is plain text in `src/content/`:

```
curriculum.yaml        parts, modules and the three-term study plan
lessons/*.md           one file per lesson: YAML front matter + body
figures/ events/ places/ sources/ glossary/ debates/ comparisons/ scenarios/
quizzes/ flashcards/ stemmata/ images/ bibliography/
atlas.yaml, atlas-lines.yaml
```

A small Vite plugin (`vite.config.ts`) turns YAML into JSON at build time and splits each lesson into its metadata, which loads with the app, and its body, which is fetched when the lesson is opened. Search indexes lesson titles and headings at once and the full lesson text in the background.

### Lesson markup

```
## Section title {#section-id}

:::claim established|interpretation|contested|speculative
A claim, marked with how certain it is.
:::

:::source tacitus-annals-1        embed a primary source
:::debate grand-strategy          embed a debate
:::diagram legion                 embed an interactive diagram
:::stemma julio-claudian          embed a family tree
:::check jc-1                     embed a knowledge check
:::timeline / :::people / :::image / :::aside Title / :::quote

[[fig:augustus|Augustus]]                 link to a person (also evt, src, place, term, debate, scenario, compare, lesson)
[[lesson:severans#women|Severan women]]   link to a section of another lesson
{{ref:syme-1939|45}}                      modern reference (footnote, Chicago short form)
{{anc:Tac. Ann. 1.2}}                     ancient reference
{{note:Any explanatory note}}
```

The first mention in a lesson of each person, place and term listed in its front matter is linked automatically.

## Sources, verification and provenance

- **Bibliography.** All 296 entries were checked in October 2026 against publisher pages, library catalogues (WorldCat, national and university libraries), journal archives (Cambridge Core, JSTOR, Project MUSE) or published reviews (BMCR and others). The note on each entry in the Library says what it was checked against. Twenty articles and chapters were confirmed in a catalogue but their page ranges could not be; those are marked "pages unconfirmed". Ten entries were corrected during checking: four titles, one page range, and five online resources whose address or publisher had changed.
- **Ancient texts.** Translations are either the cited modern translations, quoted briefly, or paraphrases. References use standard citation forms (book, chapter, section).
- **Claims.** Lesson text marks claims as established, interpretation, contested or speculative. Uncertain dates are marked with c. Counterfactual outcomes in scenarios are labelled as such.
- **Images.** Seven photographs are loaded from Wikimedia Commons, each credited with photographer and licence as recorded on its Commons file page (one, the Constantine mosaic, points to its file page because the author could not be confirmed). Diagrams, maps and family trees are drawn for this app; none is presented as an ancient image. No generated imagery is used.
- **Map data.** The atlas TopoJSON (`src/geo/atlas.topo.json`) was built with `scripts/build-geo.mjs` from the Ancient World Mapping Center's data (ODbL), the historical-basemaps project (GPL-3.0) and Natural Earth land via `world-atlas` (public domain). Period boundaries are approximate and are presented as such.
- **Fonts.** Marcellus, Source Serif 4, Source Sans 3 and Gentium Book Plus, all under the SIL Open Font License, via Fontsource.

## Project layout

```
src/
  pages/        one component per route (Course, Lesson, Timeline, Atlas, People, Sources, Debates, Revise, Study, Library …)
  components/   lesson markup renderer, knowledge checks, diagrams, family trees, search palette, study tools
  lib/          markup parser, autolinker, Chicago citation formatter, spaced repetition, search, local store
  data/         loads and cross-indexes all content
  content/      the course itself
scripts/
  validate-content.ts   content integrity checks
  screenshots.mjs       screenshots of routes with a local Chromium (used for visual review)
  build-geo.mjs         rebuilds the atlas data
```

See `REVIEW.md` for the review of the finished app from the perspective of a university lecturer and a product designer, and what was changed as a result.
