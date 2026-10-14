---
id: soldiers-lives
module: t02
title: Soldiers and Warfare
subtitle: From citizen militia to Byzantine theme armies
span: [-300, 1100]
minutes: 13
status: complete
objectives:
  - Compare the Roman army of the middle Republic, the Principate, late antiquity and Byzantium.
  - Explain how training, discipline and logistics contributed to Roman military effectiveness.
  - Analyse the experience of battle and military service from the soldier's perspective.
  - Assess the relationship between soldiers and civilians.
questions:
  - What made the Roman army effective, and was it consistently so?
  - What did military service offer a recruit, and what did it cost him?
  - How did civilians experience the presence of soldiers?
figures: [polybius, marius, caesar, hadrian, josephus, ammianus, belisarius, heraclius, boudica, basil-ii]
events: [cannae, marius-recruits, teutoburg, severan-army, adrianople, manzikert]
places: [cannae, numantia, alesia, masada, vindolanda, dura-europos, adrianople, camulodunum, serdica, new-carthage, manzikert, alexandria]
sources: [josephus-drill, vindolanda-brittunculi, ammianus-adrianople]
terms: [legion, cohort, century, centurion, contubernium, auxilia, sacramentum, diploma, comitatenses, limitanei, foederati, themes, strategos, virtus, triumph]
debates: [marian-reforms, grand-strategy]
checks:
  - id: sl-1
    type: match
    skill: comparison
    prompt: Match each army to its typical features.
    pairs:
      - {left: 'Middle Republic (c. 200 BC)', right: 'Citizen farmers levied for campaigns, organised in maniples with allied contingents'}
      - {left: 'Principate (c. AD 100)', right: 'Long-service professionals in legions and auxiliary units stationed on the frontiers'}
      - {left: 'Late empire (c. AD 400)', right: 'Mobile field armies and frontier troops, with many recruits and allied units from beyond the frontier'}
      - {left: 'Middle Byzantium (c. AD 900)', right: 'Provincial theme armies supported by land and taxes, plus professional units in the capital'}
    explain: >-
      The Roman army constantly changed in response to manpower, money and enemies. A comparison shows which features persisted
      (discipline, engineering, logistics, the link between service and status) and which changed.
  - id: sl-2
    type: source
    skill: source
    sourceId: josephus-drill
    prompt: Josephus praises Roman training and discipline. Why might he have written this, and how far can we trust it?
    model: >-
      Josephus had fought against the Romans in Galilee and surrendered; he wrote under Flavian patronage in Rome. Praising Roman discipline
      explained the Jewish defeat without dishonouring his people, flattered his patrons, and warned other provincials against revolt (he
      says so explicitly). As a commander he had seen the Roman army at close quarters, so his description has value; but it is an idealised
      portrait that leaves out mutinies, defeats and indiscipline known from other sources.
    rubric:
      - Notes Josephus' background and position.
      - Identifies purposes (explanation, flattery, deterrence).
      - Notes his first-hand knowledge.
      - Notes the idealisation.
  - id: sl-3
    type: mcq
    skill: interpretation
    prompt: What approach to ancient battle did Adrian Goldsworthy's The Roman Army at War (1996) take?
    options:
      - text: It studied the experience of battle, the psychology of soldiers and the dynamics of combat, following the "face of battle" approach of John Keegan.
        correct: true
        why: Goldsworthy asked how battles actually unfolded, how long men could fight and why units broke.
      - text: It argued that the Romans never fought pitched battles.
        why: Pitched battles were less common than raids and sieges but did occur.
      - text: It focused on the emperors' grand strategy.
        why: Grand strategy is Luttwak's subject; Goldsworthy's book is about combat.
      - text: It compiled a list of all Roman legions.
        why: It is an analytical study, not a catalogue.
  - id: sl-4
    type: short
    skill: causation
    prompt: Why were relations between soldiers and civilians often tense, even in peaceful provinces?
    model: >-
      Soldiers were armed, privileged and often outsiders; they had legal advantages, and civilians found it hard to sue them. They could
      requisition transport, lodging and supplies, and some extorted money or goods. Papyri, petitions and literary texts (such as Apuleius'
      story of a soldier seizing a gardener's donkey, or the advice in Luke's Gospel not to extort) show abuse. At the same time forts created
      markets and soldiers married locally, so relationships were mixed.
    rubric:
      - Mentions privilege and legal advantage.
      - Mentions requisition and extortion.
      - Uses evidence (petition, literary example).
      - Notes positive or mixed relationships.
reading:
  - {ref: goldsworthy-1996, note: 'The Roman Army at War, 100 BC–AD 200.'}
  - {ref: lendon-2005, note: 'Soldiers and Ghosts: battle and culture in classical antiquity.'}
  - {ref: roth-1999, note: 'The logistics of the Roman army.'}
  - {ref: campbell-1984, note: 'The Emperor and the Roman Army.'}
  - {ref: elton-1996, note: 'Warfare in Roman Europe, AD 350–425.'}
  - {ref: phang-2001}
  - {ref: campbell-army-1994}
inquiry:
  - Compare a Roman soldier's tombstone with a modern war memorial. What do they choose to commemorate?
  - Why did Roman armies spend so much time building?
  - How did the meaning of virtus change as soldiers became professionals?
---
## Introduction {#context}

Rome's history was made by its armies. They conquered the Mediterranean, held its frontiers, made and unmade emperors, and defended
Constantinople until 1453. But "the Roman army" was not one institution: it changed fundamentally several times over sixteen centuries. This
lesson compares those armies and asks what military service meant to the men who served and to the people around them.

[[compare:roman-armies|Compare the four Roman armies side by side.]]

## The citizen army of the Republic {#republic}

:::diagram legion
:::

In the middle Republic, Roman citizens with property were liable for military service between the ages of seventeen and forty-six. Polybius
describes the annual levy and the organisation of the legion: light-armed *velites*, and three lines of heavy infantry, the *hastati*,
*principes* and *triarii*, arranged by age and experience in flexible units called maniples, supported by cavalry.{{anc:Polyb. 6.19–26}}
Each legion was matched by allied contingents of at least equal size. Soldiers provided their own equipment, received a small allowance, and
served for a campaign or a few years at a time, up to sixteen campaigns.

Its strengths were its numbers, its flexible tactical organisation, its discipline and its ability to absorb losses. Polybius describes
punishments such as the beating to death of a sentry who fell asleep and the decimation of units that fled, along with rewards: crowns for
saving a citizen or being first over a wall.{{anc:Polyb. 6.37–39}} Military glory was the core of aristocratic *[[term:virtus]]*.

## The professional army of the emperors {#principate}

From the late Republic, and definitively under Augustus, the army became a standing, professional force of long-service volunteers (see the
lesson on the army and the frontiers). The legion was organised in cohorts and centuries; the centurion became the key professional officer.
Training was rigorous, and Romans believed it was the secret of their success.

:::source josephus-drill
:::

:::check sl-2
:::

Soldiers' lives revolved around the fort: drill, guard duty, construction, escort and supply work, policing, and only occasionally war. Their
diet was mainly grain (baked into bread or cooked as porridge), with meat, cheese, vegetables, sour wine and beer. They worshipped the gods of
Rome and the emperor, the standards of their unit, and many local and imported deities; the cult of Mithras was popular among soldiers.

:::source vindolanda-brittunculi
:::

Military service offered a regular income, food, medical care, the prospect of promotion and, for auxiliaries, citizenship; it also brought
harsh discipline, the risk of death, and twenty-five years away from home. Veterans often settled near their forts, and many married local
women.

## Battle {#battle}

Most Roman soldiers spent most of their service not fighting. When they did fight, what was it like? Historians influenced by John Keegan's
*The Face of Battle* have tried to reconstruct the experience: battles lasting hours, lines that rested and renewed combat, the decisive role
of morale, and the slaughter when one side broke and fled.{{ref:goldsworthy-1996}} J. E. Lendon emphasised the cultural models, such as the
Homeric single combat or disciplined drill, that shaped how Romans fought.{{ref:lendon-2005}}

:::check sl-3
:::

Sieges were at least as important as battles. Roman armies besieged Numantia, Alesia, Jerusalem and Masada with circumvallation lines,
ramps, towers and artillery; the siege works at Masada and Alesia can still be traced. Logistics were the foundation of everything: armies
needed thousands of tonnes of grain and fodder and depended on roads, rivers, supply bases and requisition.{{ref:roth-1999}}

## The late Roman army {#late}

From the late third century the army was reorganised into mobile field armies (*comitatenses*) attached to emperors and regional commanders,
and frontier troops (*limitanei*). It was larger than the Principate army, though how much larger is debated. Its recruits included
conscripts from estates (landowners had to supply men or pay instead), sons of soldiers, and many men from beyond the frontiers, as well as
allied contingents (*foederati*) under their own leaders. Late Roman writers such as Vegetius lamented a decline in discipline and armour,
but modern historians caution against taking such moralising at face value: late Roman armies won many battles.{{ref:elton-1996}}

:::source ammianus-adrianople
Ammianus, himself a former officer, describes the destruction of an eastern field army.
:::

## The Byzantine army {#byzantine}

After the seventh-century defeats, the surviving armies were settled in the themes of Anatolia, where soldiers were supported partly by land
holdings and local taxes, under generals (*strategoi*) who also governed. Professional regiments (*tagmata*) were stationed around
Constantinople. Byzantine military manuals, such as the *Strategikon* attributed to the emperor Maurice (around 600) and the *Taktika* of Leo VI,
emphasise caution, intelligence, deception and avoiding battle unless victory was sure, an approach often contrasted with western knightly
warfare. The tenth-century expansion under Nikephoros Phokas and Basil II depended on these professional armies; the eleventh-century decline of
the theme armies and reliance on mercenaries contributed to the disaster at Manzikert.

:::check sl-1
:::

## Two soldiers up close {#portraits}

**Longinus at Colchester.** In 1928 a tombstone was found at Colchester, the Roman colony of Camulodunum. It commemorates Longinus Sdapeze, son of Matycus, a "double-pay" officer of the First Cavalry Squadron of Thracians, from Sardica (modern Sofia), who died aged forty after fifteen years' service. The relief shows him on horseback riding down a naked, crouching enemy, a standard image of Roman victory. When found, the rider's face was missing; fragments of it were recovered in excavations nearby in 1996. The damage may have been done during Boudica's sack of the colony in 60 or 61. A man from Thrace, serving in a Roman unit in Britain, was commemorated in Latin with an image of conquest, then defaced by the conquered.

**Claudius Terentianus in Egypt.** A group of private letters on papyrus, found at Karanis in Egypt and dated to the early second century, were written by a young man serving with the fleet at Alexandria to his father. In Latin and Greek, he asks for equipment and clothing, reports on his health and his hopes of transferring to a legion, and complains that nothing can be achieved without money, and that letters of recommendation are of no use unless a man helps himself. His letters show a soldier's family as a network of support, supplying goods, money and influence.

## Careers and promotion {#careers}

Military service was a career with grades of privilege. Ordinary soldiers (*milites*) did fatigues and heavy labour; those with skills became *immunes*, excused heavy duties because they worked as clerks, surveyors, medical orderlies, armourers or musicians; *principales* held posts such as standard-bearer or the centurion's deputy (*optio*) on higher pay. A capable and well-connected man could become a centurion, and the senior centurion of a legion (*primus pilus*) could rise into the equestrian order and on to posts such as camp prefect or procurator.

A papyrus letter of AD 107 from a young recruit named Julius Apollinarius, stationed in the new province of Arabia, to his father in Egypt, captures the value of such privileges: he thanks the god Sarapis that he has been made a clerk of the legion, so that while others spend the whole day cutting stone he moves about doing nothing. Letters like this show soldiers using patronage and literacy to get on, exactly as civilians did.

## What war did to civilians {#war-civilians}

Roman warfare was brutal by design. When a city that had resisted was stormed, Roman custom allowed the soldiers to sack it. Polybius, describing the capture of New Carthage in 209 BC, explains that the Romans were ordered to kill everyone they met, sparing no one, until a signal was given, and only then to turn to plunder; one could see in captured towns, he says, not only humans but dogs cut in half. The purpose, he thought, was to terrify.{{anc:Polyb. 10.15}} Enslavement of whole populations was routine in the Republic, and the sack of Cremona by Roman soldiers in AD 69 shows that civil wars could be as savage as foreign ones.

Such violence was justified in Roman thinking by the "laws of war": a community that surrendered (*deditio*) before the battering ram touched its walls might be spared, while one that resisted forfeited all rights. Historians debate how far Roman violence differed from that of other ancient states, but the evidence of mass enslavement and destruction is unambiguous.

:::claim established
Mass enslavement after conquest is attested again and again in the narrative sources, for example in Epirus in 167 BC, at Carthage in 146 BC and in Gaul under Caesar. Even where the figures are exaggerated, the practice is beyond doubt, and it supplied much of the slave population of Italy in the late Republic.
:::

## Soldiers and civilians {#civilians}

For civilians, soldiers could mean protection, markets and employment, but also requisition, billeting and abuse. The Gospel of Luke has John
the Baptist tell soldiers not to extort money and to be content with their pay.{{anc:Luke 3:14}} Apuleius' novel *The Golden Ass* tells of a
legionary who beats a gardener and seizes his donkey.{{anc:Apul. Met. 9.39–42}} Petitions on papyrus and inscriptions record complaints about
soldiers' demands, and emperors repeatedly forbade illegal requisitions, which suggests that they continued.

:::check sl-4
:::

## Historiography {#historiography}

Military history once focused on generals, tactics and campaigns. Since the 1970s it has expanded to the social history of the army (recruitment,
families, religion, the economy of the frontier), the experience of combat, and the cultural meanings of war. The debate over the "Marian reforms"
and that over "grand strategy" both show how the field is now questioning long-accepted narratives.{{ref:campbell-1984}}

:::debate marian-reforms
:::
