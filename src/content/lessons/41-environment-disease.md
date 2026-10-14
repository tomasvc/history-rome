---
id: environment-disease
module: t11
title: Environment, Disease and Demography
subtitle: Climate, pandemics and population in Roman history
span: [-200, 750]
minutes: 13
status: complete
objectives:
  - Describe the scientific evidence for climate change in the Roman period.
  - Compare the three great pandemics of Roman history and the evidence for each.
  - Explain how historians estimate ancient populations.
  - Evaluate the strengths and dangers of environmental explanations of historical change.
questions:
  - Did climate change and disease cause the fall of Rome?
  - How can ice cores and tree rings be combined with texts?
  - What can and can't we know about the size of the Roman population?
figures: [galen, cyprian, procopius, marcus-aurelius, justinian, cleopatra]
events: [vesuvius, antonine-plague, plague-cyprian, justinianic-plague, dust-veil-536]
places: [rome, alexandria, constantinople, pompeii, oxyrhynchus]
sources: [procopius-plague, greenland-lead]
terms: [annona, census]
debates: [climate-disease]
checks:
  - id: ed-1
    type: match
    skill: comparison
    prompt: Match each pandemic with what is known about it.
    pairs:
      - {left: 'Antonine plague (from 165)', right: 'Described by Galen; most often identified, tentatively, as smallpox'}
      - {left: 'Plague of Cyprian (from c. 249)', right: 'Described by Christian writers; pathogen unknown'}
      - {left: 'Justinianic plague (from 541)', right: 'Confirmed by ancient DNA as Yersinia pestis'}
    explain: >-
      Only the third pandemic has a scientifically identified pathogen. For all three, mortality and long-term effects remain debated.
  - id: ed-2
    type: mcq
    skill: interpretation
    prompt: What is the "Roman Climate Optimum"?
    options:
      - text: A period of relatively warm, stable and wet conditions in much of the Mediterranean, roughly from the second century BC to the mid-second century AD, identified from scientific proxies and associated by some historians with Roman prosperity.
        correct: true
        why: The term, used by McCormick, Harper and others, comes from palaeoclimate data; its regional consistency and historical effects are debated.
      - text: The best season for military campaigns.
        why: The term refers to long-term climate.
      - text: A Roman scientific theory about climate.
        why: It is a modern scientific concept.
      - text: The climate of the fifth century AD.
        why: The later period saw more instability and, from 536, cooling.
  - id: ed-3
    type: source
    skill: source
    sourceId: procopius-plague
    prompt: How does Procopius describe the plague's arrival and spread, and what makes his account valuable and problematic?
    model: >-
      Procopius dates its start to Pelusium in Egypt, describes its spread to Alexandria, Palestine and the whole world, and gives vivid detail
      of symptoms (fever and buboes) and of mass death in Constantinople. As an eyewitness in the capital and an experienced observer, he is
      invaluable. But he models his account partly on Thucydides' description of the plague of Athens, his mortality figures are impressionistic,
      and his view of the whole world is limited to what he knew.
    rubric:
      - Summarises the origin and spread.
      - Notes the eyewitness value.
      - Notes the Thucydidean model.
      - Notes the problem of figures.
  - id: ed-4
    type: short
    skill: argument
    prompt: What are the risks of explaining historical change by climate and disease?
    model: >-
      Environmental explanations can become deterministic, ignoring human choices, institutions and resilience; correlation between climate
      events and political change may be coincidental; proxy data are often regional and uncertain in dating, while texts are anecdotal, so
      combining them risks circular reasoning. Critics like Haldon and colleagues argue for careful attention to scale, local variation and
      societies' responses. Yet ignoring the environment would leave out real shocks. The best approach integrates natural and social factors.
    rubric:
      - Mentions determinism.
      - Mentions correlation and dating problems.
      - Names a critique or critic.
      - Offers a balanced approach.
reading:
  - {ref: harper-2017, note: 'The Fate of Rome: Climate, Disease and the End of an Empire.'}
  - {ref: haldon-2018, note: 'A critical response to Harper.'}
  - {ref: mccormick-2012, note: 'Climate change during and after the Roman empire.'}
  - {ref: buntgen-2016, note: 'The Late Antique Little Ice Age.'}
  - {ref: little-2007, note: 'Plague and the End of Antiquity.'}
  - {ref: sallares-2002, note: 'Malaria and Rome.'}
  - {ref: scheidel-2001, note: 'Problems in Roman demography.'}
inquiry:
  - How would you test the claim that the Antonine plague caused a long-term economic decline?
  - Why might the city of Rome have needed constant immigration to maintain its population?
  - How did ancient people explain epidemics, and how did those explanations shape their responses?
---
## A new kind of evidence {#context}

Historians of Rome have always known about famines, earthquakes and plagues from ancient texts. What is new is scientific evidence: ice cores
from Greenland and the Alps, tree rings, cave formations (speleothems), lake sediments and pollen, which record past climate; ancient DNA
from skeletons, which can identify pathogens; and isotopes, which reveal diet and mobility. These sources have made environmental history one of
the most dynamic fields of Roman studies, and one of the most contested.

## Climate {#climate}

:::diagram climate-timeline
:::

Palaeoclimate data suggest that much of the Mediterranean enjoyed relatively warm, stable and wet conditions from about the second century BC to
the mid-second century AD, which some scholars call the Roman Climate Optimum. This favoured agriculture, including in marginal regions, and may
have supported population growth. A more variable "transitional" period followed. In the sixth century, major volcanic eruptions in 536 and
539/540 caused a sudden cooling across the northern hemisphere, the start of what Ulf Büntgen and colleagues called the Late Antique Little Ice
Age (c. 536–660).{{ref:buntgen-2016}}

:::check ed-2
:::

:::claim contested
How strongly climate shaped Roman history is disputed. Kyle Harper's *The Fate of Rome* (2017) argued that the end of the climate optimum and the
great pandemics were central causes of the empire's crises. Critics, including John Haldon and colleagues, argue that the climate data are
regionally uneven, that correlations do not prove causation, and that human institutions and choices mediated environmental shocks.
:::

:::debate climate-disease
:::

## A volcano and the end of the Republic {#okmok}

Environmental evidence is beginning to change the history of individual years. Ancient writers recorded that after Caesar's murder in 44 BC the sun was dim and pale for a year, and crops failed to ripen.{{anc:Plut. Caes. 69.4}} This used to be connected with an eruption of Etna in 44 BC. In 2020 a team led by Joseph McConnell, analysing ice cores from Greenland and the Russian Arctic, identified a far larger eruption in early 43 BC, and matched its volcanic glass to Okmok volcano in Alaska. Tree-ring and climate models suggest that 43 and 42 BC were among the coldest years in the northern hemisphere of the last two and a half millennia. Ancient sources report unusual weather, crop failures and famine in Italy, and a failure of the Nile flood in Egypt, in the same years.{{ref:mcconnell-2020}}

:::claim contested
The authors suggest that this climate shock may have aggravated the instability of the years after [[lesson:caesar|Caesar's death]], when the triumvirs fought for power, and the crisis of Cleopatra's Egypt. Historians welcome the data but caution about causation: the civil wars had political causes that long predated 43 BC, and the documentary evidence for famine is scattered. The case shows both the promise of climate science for ancient history and the need to integrate it with a careful reading of the written record.
:::

## Disease {#disease}

Roman cities were unhealthy: dense, with poor sanitation in many areas and endemic infections, including malaria, which was especially severe in
Rome and its surroundings.{{ref:sallares-2002}} Three pandemics stand out.

1. **The Antonine plague** (from 165), brought back by the armies from the East and described by the physician Galen, is usually identified as
   smallpox. Its mortality is hotly debated.
2. **The plague of Cyprian** (from about 249), described by Christian writers, coincided with the military and political crisis of the third
   century; its pathogen is unknown.
3. **The Justinianic plague** (from 541), confirmed by ancient DNA as bubonic plague (*Yersinia pestis*), recurred in waves until the mid-eighth
   century.

:::check ed-1
:::

:::source procopius-plague
:::

:::check ed-3
:::

## Population {#population}

How many people lived in the Roman empire? There was no empire-wide census that survives, and estimates rely on models. Augustus recorded three
censuses of Roman citizens: 4,063,000 in 28 BC, 4,233,000 in 8 BC and 4,937,000 in AD 14.{{anc:RG 8}} These figures are far higher than the
Republican census totals (around 900,000 in 70/69 BC), which has generated a long debate: did Augustus count women and children as well as adult
men ("low count"), implying an Italian population of perhaps 6–7 million, or did the free population of Italy grow and the counts remain
comparable ("high count"), implying perhaps 12–15 million?{{ref:scheidel-2001}}

For the empire as a whole, a commonly cited estimate is around 45 million under Augustus and perhaps 60–75 million at its peak in the mid-second
century, before the Antonine plague. The city of Rome may have had about a million inhabitants at its height; like other pre-modern cities, it
probably had more deaths than births and depended on migration.

:::claim interpretation
All population figures for the Roman empire are reconstructions with wide margins of error. They are built from census figures of uncertain
meaning, the extent of settled land, densities of comparable societies, and demographic models. They are useful for thinking about scale, not as
precise facts.
:::

## Human impact on the environment {#impact}

Romans also changed their environment. Mining and smelting polluted the atmosphere, as lead levels in Greenland ice show; deforestation and
agriculture caused erosion in some regions; and the transport of grain, animals and people spread pests and pathogens across the
Mediterranean. Cities drew resources from huge hinterlands.

:::source greenland-lead
:::

## Natural disasters {#disasters}

Earthquakes regularly damaged cities in the eastern Mediterranean; a great earthquake and tsunami in 365 struck Crete and Alexandria, described by
Ammianus. The eruption of Vesuvius in 79 destroyed several towns. Responses to disasters, such as imperial tax remissions and rebuilding, reveal
how the state managed risk.{{ref:garnsey-1988}}

:::check ed-4
:::

## Malaria and the seasons of death {#malaria}

Not all disease came in dramatic pandemics. Endemic diseases shaped ordinary life and death. Malaria was endemic in the low-lying parts of Rome and the surrounding countryside, and Robert Sallares has argued that it contributed to high mortality, especially among newcomers to the city.{{ref:sallares-2002}} Galen and other medical writers describe recurrent fevers that fit malarial infection. Studies of the dates recorded on Christian epitaphs from Rome show a sharp peak in deaths in late summer and early autumn, the season of malaria and gastrointestinal infections, a pattern that differs from those of modern cities.

These patterns had consequences. The city of Rome, like other large pre-modern cities, probably recorded more deaths than births and depended on constant migration, free and enslaved, to maintain its population. The capital was a demographic sink, drawing in people from Italy and the provinces.

## How the state responded {#responses}

Roman governments could not prevent disasters, but they did respond. When an earthquake destroyed twelve cities in Asia in AD 17, Tiberius remitted their taxes for five years and gave ten million sesterces to Sardis, the worst hit.{{anc:Tac. Ann. 2.47}} Emperors organised the grain supply of Rome to prevent famine, and city councils across the empire were expected to manage local food shortages, sometimes by forcing landowners to sell grain. During the Justinianic plague, Procopius says, Justinian assigned officials and money to bury the dead in Constantinople.

:::claim interpretation
Peter Garnsey argued that famine in the strict sense, mass death from starvation, was rare in the Roman world, while food shortages were frequent; cities and the state developed strategies, such as storage, imports and price controls, that usually prevented shortage from turning into famine. Disease and dearth were nonetheless constant companions of ancient life.
:::

## The ethics of environmental history {#ethics}

Environmental history has become popular partly because of modern concern about climate change, and comparisons between Rome and the present are frequent. Historians debate how far such comparisons are useful. Rome's crises show that complex societies are vulnerable to environmental shocks; but Roman society, technology and climate change were so different from ours that direct lessons are hard to draw. The value of the Roman case lies in understanding how a large, connected society experienced and responded to forces it could not control.

## Historiography {#historiography}

Environmental explanations of Rome's fall are old, from Ellsworth Huntington's climatic theories in the early twentieth century to lead poisoning
hypotheses in the 1980s, which historians largely rejected. The new environmental history is better grounded in data, but its critics warn
against "environmental determinism". Most historians now seek to integrate environment, disease and human agency, asking how Roman society
was exposed and how it responded to shocks.{{ref:haldon-2018}}

:::aside Interdisciplinary humility
Combining scientific and historical evidence requires each side to understand the other's uncertainties. A tree-ring date may be precise to the
year, but tell us only about summer temperatures in one region; a chronicle may report a famine but exaggerate it. The strongest arguments
come from independent lines of evidence that point the same way.
:::
