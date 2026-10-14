# Review: a lecturer's and a designer's pass over the finished app

The app was reviewed as built and running (production build served locally, inspected in Chromium at 1280 px and 390 px wide, in light and dark themes, with every lesson opened and checked for console errors and unparsed markup), not only as source code. Two questions guided it:

- **As a university lecturer:** would a student who worked through this understand Roman history better, and could they trust and follow up what they read?
- **As a senior product designer:** does every screen and control earn its place, work, and read clearly?

Where the two pulled in different directions, deepening the history took priority over adding features.

## What the lecturer found, and what changed

**1. The later and thematic lessons were thinner than the early ones.** Lessons on the Republic ran to 1,600–2,600 words; many lessons from Trajan onwards, and most thematic lessons, were 800–1,500 words of accurate but general narrative, with few documents a student could actually work with.

*Changed:* about 70 new evidence-led sections were written into 30 lessons, each built around a specific document, object or case rather than general statements. Lesson text grew to about 74,700 words, and no lesson is now under 1,400 words. Examples:

- Government seen from below: Babatha's archive from the Cave of Letters; the Skaptopara petition of 238 and the emperor's reply; the Panopolis papyri on preparing for Diocletian's visit.
- The economy in documents: the Sulpicii archive from Puteoli; wages and income distribution (Price Edict, Scheidel and Friesen); Trajan's *alimenta*.
- The army: Hadrian's address at Lambaesis; the army calendar from Dura-Europos; two soldiers up close (Longinus at Colchester, Claudius Terentianus in Egypt).
- Religion and conversion: the house church, synagogue and temples of Dura-Europos; Augustine's account of his conversion; the curse tablets of Bath; a sacrifice step by step.
- The end of Rome in the West seen locally: Severinus of Noricum and the last garrison of Batavis; Sidonius Apollinaris under Gothic kings.
- The East: the Gainas crisis of 400; Justinian's plague law of 544 and the silk trade; Egypt and the coinage after the Arab conquest; the trial of Pope Martin I; Liudprand at the court of Constantinople; the revolt of 1042; Manuel II in London; Plethon and Bessarion.
- Source criticism: Lactantius as witness and prosecutor; the Constantinian documents in Eusebius and the papyrus that supports them; Ammianus as a historian; how Lorenzo Valla exposed the Donation of Constantine; Tacitus' *Germania* and its afterlife.
- Social history: women's work, women's own words and actions (Hortensia, Julia Felix, Plancia Magna, Perpetua), childhood, the enslaved household of Musicus Scurranus, slave collars and sale documents, languages that outlived Rome.
- Environment and legacy: the Okmok eruption of 43 BC; malaria; how the Digest reached modern civil codes; who claimed the Roman inheritance after 1453.

Each new section marks how secure its claims are (established, interpretation, contested) and gives ancient references.

**2. The lessons did not talk to each other enough.** A student reading about the plague of 541 was not pointed to the Antonine plague; the adoption of emperors was discussed in one lesson and its consequences in another without a link.

*Changed:* the first mention of every person, place and term a lesson declares is now linked automatically (about 700 links). Lesson links can now point to a specific section (`[[lesson:severans#women]]`), and the validator checks that the section exists; twenty cross-lesson links of this kind were written where one argument depends on another. People and places mentioned in the new sections were added to lesson metadata, so profile and place pages list every lesson that discusses them.

**3. The bibliography could not be trusted yet.** Every entry was labelled "to verify".

*Changed:* all 296 entries were checked against publisher pages, library catalogues, journal archives or published reviews, and each now records what it was checked against. Checking caught ten errors, which were corrected: four titles (Blockley's *Classicising*, Burckhardt's *Constantin's*, Barbaro's *Diary*, Sallares's subtitle), one page range (Croke 1983) and five online resources whose address or publisher had changed. Twenty articles and chapters whose page range could not be confirmed are marked "pages unconfirmed" rather than presented as certain. Eleven works that were in the Library but cited nowhere were added to the reading lists of the lessons they serve. Reading-list notes that only repeated a book's title were replaced by the Library's note on what the book is good for.

**4. Factual slips in draft material.** Writing the new sections included checking them; claims that did not survive were corrected before they went in. For example: the remark that Hortensia's speech was still read generations later comes from Quintilian, not Valerius Maximus; Perpetua's prison diary is the earliest known writing by a Christian woman, not the earliest Latin writing by a woman (Sulpicia is earlier); "a most dangerous book" is Momigliano's phrase, which Krebs took as his title; in 193 Clodius Albinus was bought off as Caesar rather than proclaimed emperor; the silkworm-eggs-in-a-cane detail is not in Procopius, so it was dropped.

**5. Smaller teaching problems.** Reading times were authored by hand and inconsistent; they are now computed from the text, checks, sources and diagrams. Scenario outcomes now say plainly whether a path is what happened or a counterfactual inference. Family trees appear inside the lessons on the Julio-Claudians, Severans and Constantine, not only on the People page.

**6. A broken study plan.** Five weekly tasks in the three-term study plan (for example "Atlas: compare the snapshots for AD 600 and AD 700") were being read by YAML as key–value pairs and would have displayed as `[object Object]`. They were fixed, and the content validator now checks every prose field in the curriculum, atlas and family trees as well as in lessons.

## What the designer found, and what changed

**1. Too much loaded before anything appeared.** All lesson text shipped in the main content bundle, which weighed 554 KB gzipped. Lesson bodies are now split into their own files and fetched when a lesson opens, with the next lesson prefetched; the content bundle fell to about 390 KB gzipped (it now also carries the verification notes for every reference). Search indexes titles and headings immediately and the full text in the background, so it never blocks.

**2. The people network was hard to read.** Nodes piled up against the top edge, long names were cut off at the sides, and the layout changed randomly on every visit. The layout now keeps every node and label inside the frame and uses stable positions.

**3. Reading lists repeated themselves.** Many entries said the book's title twice. They now show what the work is good for, plus a lesson-specific note only when it adds something.

**4. Earlier fixes from the same review.** A module header that showed its date twice; a debate page whose question was set as a three-line heading (now a short title with the question beneath); overlapping year labels on the timeline ribbon at phone width; the scenario outcome appearing above the choice on mobile; and a set of diagram problems (arrows hidden under boxes, strokes overridden by CSS, text too small in split layouts, labels overlapping in the Cannae, legion, aqueduct and climate diagrams).

**5. Image credits were vague.** Six of the seven photographs now carry the photographer or source and licence recorded on their Commons file pages. The seventh points to its file page, because its author could not be confirmed.

**6. Code health.** Components that reset state inside effects (lesson, source and comparison pages) were rewritten so that state belongs to the item being viewed. Twenty-one unit tests now cover dates, spaced repetition, Chicago citation formatting, autolinking, lesson markup and the reading-note filter.

## What remains

- Twenty references have confirmed titles and venues but unconfirmed page ranges; they are labelled.
- Photographs depend on Wikimedia Commons being reachable, and Commons pages can change.
- The content bundle still includes all quizzes, sources, debates and the bibliography (about 390 KB gzipped). Splitting those as well would help slow connections.
- Period boundaries in the atlas are approximate, as the atlas itself says.
- Progress lives in one browser; the backup file on My study is the only way to move it.
- The lessons are syntheses of current scholarship. A lecturer adopting them for a credit-bearing course should still read them against the cited works, as with any textbook.
