---
id: romanisation
module: t10
title: Becoming Roman?
subtitle: Romanisation, provincial cultures and the critique of a concept
span: [-200, 400]
minutes: 13
status: complete
objectives:
  - Explain the concept of "Romanisation" and its origins in modern imperial history.
  - Evaluate the main critiques and alternative models (elite emulation, creolisation, discrepant identities).
  - Analyse archaeological and epigraphic evidence for cultural change in the provinces.
  - Compare the western and eastern provinces.
questions:
  - What changed when a province came under Roman rule, and who changed it?
  - Is "Romanisation" a useful concept, or does it import modern colonial assumptions?
  - Why did the Greek East remain Greek while the West became Latin?
figures: [agricola, claudius, boudica, tacitus, hadrian, septimius-severus, augustine]
events: [gauls-senate, boudican-revolt, constitutio-antoniniana-ev]
places: [lugdunum, londinium, lepcis-magna, timgad, nemausus, athens, ephesus, vindolanda, camulodunum, hippo-regius, carthage]
sources: [tacitus-agricola, claudius-gauls, vindolanda-brittunculi]
terms: [romanisation, romanitas, hellenisation, colonia, municipium, latin-rights, imperial-cult, villa, euergetism, barbarian]
debates: [romanisation]
checks:
  - id: ro-1
    type: mcq
    skill: interpretation
    prompt: How did Francis Haverfield understand Romanisation in his 1905 study of Roman Britain?
    options:
      - text: As the progressive adoption of a superior Roman civilisation by provincials, which spread from the elite downward and produced a uniform culture.
        correct: true
        why: Haverfield's model reflected the assumptions of British imperialism, which saw empire as a civilising mission.
      - text: As the resistance of Britons to Roman culture.
        why: Haverfield emphasised adoption, not resistance.
      - text: As a myth invented by Roman historians.
        why: He took the process as real and largely beneficial.
      - text: As the process by which Romans adopted British culture.
        why: He studied the reverse direction.
  - id: ro-2
    type: source
    skill: source
    sourceId: tacitus-agricola
    prompt: In Agricola 21 Tacitus says that Britons adopted Roman dress, baths and banquets and called it "civilisation" (humanitas) "when it was part of their enslavement". How should historians use this?
    model: >-
      Tacitus presents cultural change as a deliberate policy of Agricola, who encouraged building and educated the sons of chiefs, and
      treats Roman comforts as corrupting. The passage is ironic moral commentary by a Roman senator critical of Roman decadence, not a neutral
      observation, and it credits a single governor with processes that took generations. But it shows that Romans themselves saw cultural
      change as political and linked to power. Archaeology must test what changed, where, and among whom.
    rubric:
      - Identifies the claim and Agricola's role.
      - Identifies Tacitus' moralising irony.
      - Notes the exaggeration of one governor's agency.
      - Proposes testing with archaeology.
  - id: ro-3
    type: match
    skill: interpretation
    prompt: Match each scholar to their model of cultural change in the provinces.
    pairs:
      - {left: 'Martin Millett', right: 'Native elites adopted Roman culture to maintain status, driving change without central policy'}
      - {left: 'Jane Webster', right: '"Creolisation": a blending of Roman and local practices, especially among non-elites'}
      - {left: 'Greg Woolf', right: 'Becoming Roman in Gaul as participation in a new, evolving imperial culture'}
      - {left: 'David Mattingly', right: '"Discrepant identities": different groups experienced and responded to empire very differently'}
    explain: >-
      All four reject Haverfield's model of a superior culture spreading downward. They differ in emphasising elite agency, hybridity,
      participation or inequality.
  - id: ro-4
    type: short
    skill: comparison
    prompt: Why did the eastern provinces not become Latin-speaking?
    model: >-
      The East was already urbanised and had a prestigious Greek culture that Romans themselves admired and shared; Greek served as the language
      of administration in the East from the start. Rome governed through existing Greek cities, whose elites became Roman citizens while
      remaining culturally Greek. Latin spread mainly through colonies and the army. In the West, by contrast, Rome encountered societies without
      an established written high culture that Romans recognised, and Latin became the language of power, education and opportunity.
    rubric:
      - Notes the existing Greek urban culture.
      - Notes Roman use of Greek in administration.
      - Contrasts with the West.
      - Mentions the role of colonies or elites.
reading:
  - {ref: woolf-1998, note: 'Becoming Roman: The Origins of Provincial Civilization in Gaul.'}
  - {ref: millett-1990, note: 'The Romanization of Britain.'}
  - {ref: webster-2001, note: 'Creolizing the Roman provinces.'}
  - {ref: mattingly-2006, note: 'An Imperial Possession: Britain in the Roman Empire.'}
  - {ref: mattingly-2011, note: 'Imperialism, Power and Identity.'}
  - {ref: haverfield-1905, note: 'The classic model, read as a historical document.'}
  - {ref: wallace-hadrill-2008}
  - {ref: millar-1993, note: 'The Near Eastern provinces, their languages, cults and communities.'}
inquiry:
  - What does the cult of Sulis Minerva at Bath reveal about religious interaction in Roman Britain?
  - Compare Lepcis Magna and Londinium as Roman cities. What made each "Roman"?
  - How might a farmer in rural Gaul have experienced the arrival of Roman rule differently from a chief's son?
---
## The concept {#context}

"Romanisation" is the term historians have used for the process by which provincial peoples adopted Roman culture: Latin, Roman dress and
names, cities with Roman buildings, villas, Roman gods and the imperial cult, Roman law and citizenship. The word itself is modern, not Roman,
and it has a history. It was formulated by Theodor Mommsen and especially by Francis Haverfield, whose *The Romanization of Roman Britain*
(1905) described the adoption of a superior civilisation by grateful natives, a model shaped by the assumptions of the British Empire in which
Haverfield lived.{{ref:haverfield-1905}}

:::check ro-1
:::

## Evidence for change {#evidence}

Whatever we call it, the archaeological record shows profound change in many provinces after Roman conquest:

- **Cities**: new towns with forums, basilicas, temples, baths and theatres, often replacing or relocating pre-Roman centres; colonies of veterans
  such as Timgad in Africa were laid out on regular grids.
- **Language and writing**: Latin inscriptions, the "epigraphic habit", spread across the West; Latin became the language of the elite and much
  of the population in Gaul, Spain and Africa.
- **Names and citizenship**: provincials took Roman names, especially on receiving citizenship.
- **Rural landscapes**: villas, Roman-style farming and new crops in some regions.
- **Religion**: Roman gods were identified with local gods (*interpretatio Romana*), as Sulis Minerva at Bath; the imperial cult provided a common
  focus.
- **Material culture**: Roman pottery, dress, food (olive oil, wine, fish sauce) and baths.

But the change was uneven: strong in towns and among elites, weaker in rural areas; strong in the West, limited in the East.

## Tacitus on Britain {#tacitus}

The classic ancient description comes from Tacitus, writing about his father-in-law Agricola's governorship of Britain. He describes Agricola
encouraging the Britons to build temples, forums and houses, and educating the sons of chiefs in the liberal arts, so that those who had
rejected Latin now wanted to speak it eloquently; then came the toga, porticoes, baths and banquets, which "the inexperienced called
civilisation, when it was a part of their enslavement".{{anc:Tac. Agr. 21}}

:::source tacitus-agricola
:::

:::check ro-2
:::

## Critiques and alternatives {#critiques}

Since the 1990s the concept has been heavily criticised.

- **Elite emulation.** Martin Millett argued that change in Britain was driven not by Roman policy but by native elites, who adopted Roman culture
  to maintain their status under the new regime.{{ref:millett-1990}}
- **Becoming Roman.** Greg Woolf, studying Gaul, showed that "Roman culture" was itself new and changing, created in the provinces as much as in
  Rome, and that Gauls became Roman by participating in it, not by copying a fixed model.{{ref:woolf-1998}}
- **Creolisation.** Jane Webster borrowed a term from studies of the Caribbean to describe a blending of cultures, especially among non-elites,
  in which local practices persisted under Roman forms.{{ref:webster-2001}}
- **Discrepant identities.** David Mattingly emphasised power and inequality: the experience of empire differed for elites, soldiers, urban
  populations and peasants, and the term "Romanisation" hides the violence and exploitation of empire.{{ref:mattingly-2011}}

:::check ro-3
:::

:::debate romanisation
:::

## Three case studies {#cases}

General models are tested best on particular places. Three provinces show how differently "becoming Roman" could work.

### Gaul

Before the conquest, the peoples of Gaul lived in large fortified settlements (*oppida*), such as Bibracte, the hill-town of the Aedui. Within a generation of Caesar's wars, the Aedui moved their centre to a new Roman-style town in the plain below, Augustodunum (Autun), with walls, a grid of streets and, later, famous schools of rhetoric. Leading Gauls became Roman citizens, took Roman names, served as officers and priests of the imperial cult at the altar of Lugdunum, and in AD 48 were admitted to the Senate. Greg Woolf argues that this was not imitation of an Italian model but participation in a new imperial culture that Gauls helped to make: Gallo-Roman temples, for example, had a distinctive form found nowhere in Italy.{{ref:woolf-1998}}

### North Africa

At Lepcis Magna, a Phoenician city in what is now Libya, a wealthy citizen named Annobal Tapapius Rufus paid for a market and then a theatre around the turn of the eras, and recorded his gifts in inscriptions in both Latin and Punic. His name combines Punic (Annobal) and Roman (Rufus) elements. Lepcis later became a Roman municipality and then a colony, and produced an emperor, Septimius Severus. Punic remained a spoken language in parts of Africa into the time of Augustine, who mentions it, while the elites of the African cities became some of the most Latin-educated in the empire.

### Britain

In Britain change was faster and more visible in the south and east than in the north and west. The client king Tiberius Claudius Togidubnus, named on an inscription at Chichester as a "great king in Britain", ruled a kingdom allied to Rome; the lavish palace at Fishbourne nearby is often, though not certainly, associated with him. In the military north, the Roman presence meant forts, soldiers from across the empire and a frontier economy. Many rural Britons continued to live in roundhouses and farm as before, adopting some Roman goods without other changes. The model of elite emulation fits the south; it fits the countryside of the north and west much less well.{{ref:mattingly-2006}}

:::claim interpretation
The case studies suggest that "Romanisation" was less a single process than a set of local negotiations whose outcome depended on pre-Roman social structures, the presence of the army, the interests of local elites and the economic opportunities that Roman rule created.
:::

## East and West {#east-west}

In the Greek East, Rome encountered urban societies with a prestigious literary culture that Romans admired. There, Rome governed in Greek
through existing cities; Greek elites became Roman citizens and senators but remained culturally Greek. Latin spread only in colonies and the
army. "Roman" identity in the East was political, attached to citizenship and loyalty to the emperor, rather than linguistic, a fact that
explains why the eastern empire could later be both Greek-speaking and Roman.

:::check ro-4
:::

## Voices of the conquered {#voices}

Most of our evidence comes from those who participated in Roman culture: those who wrote Latin inscriptions or built villas. People who
resisted or ignored it are harder to see. The Vindolanda tablets show Roman soldiers calling Britons by a dismissive diminutive. Boudica's
revolt destroyed the Roman towns of Camulodunum, Londinium and Verulamium. Elsewhere, local languages survived for centuries: Punic in Africa,
Aramaic and Coptic in the East, Celtic languages in parts of Gaul and Britain.

:::source vindolanda-brittunculi
:::

:::source claudius-gauls
An emperor argues that Rome has always grown by incorporating outsiders.
:::

## Languages that outlived Rome {#languages}

Language is one of the best tests of how deeply Roman rule changed provincial societies, and the evidence is uneven.

- **Gaulish** was still written in the Roman period: a lead tablet found at Larzac in southern France in 1983, carrying a curse or magical text of around AD 100 in Gaulish written in Latin letters, is the longest known text in the language. Gaulish may have survived as a spoken language in some regions into late antiquity, though it eventually gave way to Latin.
- **Punic**, the language of Carthage, was still spoken in North Africa in Augustine's time. Augustine chose a Punic-speaking priest as bishop for a rural community near Hippo because its people needed a pastor who spoke their language.{{anc:Aug. Ep. 209.3}}
- **British Celtic** survived Roman rule to become Welsh, Cornish and Breton, while Latin largely disappeared from Britain after the end of Roman rule.
- **Basque**, unrelated to any other known language, survived in the western Pyrenees.
- In the East, **Greek** remained dominant, and **Aramaic** (in its Syriac form) and **Coptic** developed rich Christian literatures from the third and fourth centuries.

Yet Latin's victory in the West was remarkable. Romanian descends from the Latin of the Balkans, although the province of Dacia north of the Danube was held for only about 165 years, a puzzle that historians and linguists still debate.

:::claim interpretation
The persistence of local languages shows the limits of Roman cultural change, especially in the countryside. Their eventual decline in much of the West shows its depth: Latin spread not by any policy of linguistic conquest, which Rome never pursued, but because it was useful for law, trade, the army, the Church and social advancement.
:::

## Historiography {#historiography}

The debate over Romanisation is also a debate about modern empire. Haverfield's model reflected British imperialism; post-colonial theory
encouraged the critiques of the 1990s and 2000s. Some scholars now avoid the term entirely; others retain it as a convenient label for real
processes, while rejecting its assumptions. Andrew Wallace-Hadrill has suggested thinking of multiple, coexisting identities, so that someone
could be Roman, Greek and local at once, switching between them by context.{{ref:wallace-hadrill-2008}}

:::aside Ask "whose culture?"
When you see a "Roman" object in a provincial museum (a mosaic, a lamp, a tombstone), ask: who made it, who paid for it, who used it, and what
did it mean to them? A Roman-style bath in Britain may have meant something very different to a British aristocrat than to a legionary from
Pannonia.
:::
