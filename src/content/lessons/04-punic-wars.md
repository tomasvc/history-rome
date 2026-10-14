---
id: punic-wars
module: m02
title: Rome and Carthage
subtitle: The Punic Wars, 264–146 BC
span: [-264, -146]
minutes: 16
status: complete
objectives:
  - Narrate the three Punic Wars and identify their turning points.
  - Explain how Rome survived Cannae, using the evidence for manpower and the loyalty of the allies.
  - Evaluate Polybius and Livy as sources for a war in which the losing side's own histories are lost.
  - Assess explanations for the outbreak of the First and Third Punic Wars.
questions:
  - Why did a dispute over one Sicilian town lead to a twenty-three-year naval war?
  - Hannibal won the greatest battlefield victories of antiquity in Italy. Why did he lose the war?
  - Was the destruction of Carthage in 146 BC a strategic necessity, a political choice or an act of revenge?
figures: [hamilcar-barca, hannibal, fabius-maximus, scipio-africanus, cato-elder, scipio-aemilianus, polybius]
events: [first-punic-war, mylae, aegates, sicily-province, sardinia-seized, second-punic-war, trebia, trasimene, cannae, capua-defects, new-carthage, metaurus, zama, third-punic-war, carthage-destroyed]
places: [carthage, messana, syracuse, mylae, aegates, saguntum, new-carthage, trebia, trasimene, cannae, capua, tarentum, metaurus, zama, utica]
sources: [polybius-manpower]
terms: [socii, latin-rights, colonia, legion, dictator, promagistrate, foedus, triumph]
debates: [roman-imperialism]
checks:
  - id: pw-1
    type: order
    skill: chronology
    prompt: Put these events of the Punic Wars in chronological order.
    items:
      - The Mamertines of Messana appeal to Rome (264 BC)
      - Roman naval victory at Mylae (260 BC)
      - Battle of the Aegates Islands ends the First Punic War (241 BC)
      - Rome seizes Sardinia from Carthage (238 BC)
      - Hannibal crosses the Alps (218 BC)
      - Battle of Cannae (216 BC)
      - Scipio captures New Carthage (209 BC)
      - Battle of Zama (202 BC)
      - Destruction of Carthage (146 BC)
    explain: >-
      The First War (264–241) was fought for Sicily and decided at sea. Rome's seizure of Sardinia in 238, while Carthage was
      fighting its own mercenaries, embittered relations. The Second War (218–201) began in Spain and was fought in Italy, Spain,
      Sicily and finally Africa. The Third (149–146) was a short war of annihilation.
  - id: pw-2
    type: mcq
    skill: causation
    prompt: Which factor does Polybius himself stress most when explaining how Rome survived the disasters of 218–216 BC?
    options:
      - text: The Roman constitution and the resources of manpower that Rome and its allies could mobilise.
        correct: true
        why: Polybius interrupts his narrative after Cannae to analyse the constitution (Book 6), and earlier lists the huge manpower available in 225 BC (2.24).
      - text: The genius of a single general, Scipio Africanus.
        why: Polybius admired Scipio, but he explicitly argues that Rome's recovery depended on its institutions, not on one man.
      - text: Divine favour shown in prodigies and omens.
        why: Polybius, a Greek rationalist, treats Roman religion as a political instrument rather than as an explanation.
      - text: Carthage's lack of a fleet.
        why: Carthage still had a substantial navy in the Second War; its problem was using it to support Hannibal in Italy.
  - id: pw-3
    type: source
    skill: source
    sourceId: polybius-manpower
    prompt: What does Polybius' list of men available in 225 BC suggest about Hannibal's strategy, and how far can the figures be trusted?
    model: >-
      The figures, which Polybius probably took from Fabius Pictor, list several hundred thousand Roman and allied men liable for
      service. They imply that Rome could lose whole armies and still raise new ones, so Hannibal could not win simply by defeating
      Roman armies; he had to break the alliance by detaching allies. Their precise accuracy is uncertain (they may combine census
      totals with estimates, and the categories are not always clear), but historians generally accept the order of magnitude, which
      is what matters for the argument.
    rubric:
      - Links the scale of manpower to Rome's ability to absorb defeats.
      - Connects this to Hannibal's need to break up the alliance.
      - Notes the likely source (Fabius Pictor) or problems with the figures.
      - Distinguishes order of magnitude from exact numbers.
  - id: pw-4
    type: mcq
    skill: interpretation
    prompt: Why is it harder to write a balanced history of the Punic Wars than of, say, the war between Caesar and Pompey?
    options:
      - text: Carthaginian accounts, such as the history by Hannibal's companion Silenus, are lost, so the surviving narratives were written by Greeks and Romans on the winning side.
        correct: true
        why: Polybius knew pro-Carthaginian historians (Philinus, Silenus, Sosylus) but we read them only through his criticism; Livy's portrait of Hannibal draws on Roman traditions.
      - text: There are no surviving narrative sources at all for the Punic Wars.
        why: Polybius (Books 1–3 and fragments) and Livy (Books 21–30) give continuous narratives of the first two wars.
      - text: Carthage did not use writing.
        why: The Carthaginians were literate; Punic inscriptions survive in large numbers, and Mago's agricultural treatise was translated into Latin.
      - text: The wars were too short for historians to record.
        why: The first two wars lasted twenty-three and seventeen years respectively.
reading:
  - {ref: polybius-waterfield-2010, note: 'Books 1–3 for the first two wars; 6.58 on Roman behaviour after Cannae.'}
  - {ref: livy-yardley-2006, note: 'Livy Books 21–30, the Second Punic War, in a modern translation.'}
  - {ref: goldsworthy-2000, note: 'A clear military narrative of all three wars.'}
  - {ref: hoyos-2011, note: 'Specialist essays on Carthage, the wars, sources and archaeology.'}
  - {ref: rosenstein-2004, note: 'How the Roman countryside supplied soldiers, and what war did to families.'}
  - {ref: cah-8}
inquiry:
  - Compare Livy's and Polybius' explanations of Hannibal's decision to go to war. What does each want his reader to conclude?
  - Read Polybius on the treaties between Rome and Carthage (3.22–27). Who, on his evidence, was in the right over Sardinia in 238 BC?
  - How would a Carthaginian historian have told the story of 146 BC?
---
## Historical context {#context}

Carthage was founded by Phoenicians from Tyre, traditionally in 814 BC; archaeology places the first settlement in the later ninth
or eighth century. By the third century it was the greatest city of the western Mediterranean, controlling the coast of North Africa
from Libya to the Atlantic, western Sicily, Sardinia and trading posts in southern Spain. Its wealth came from trade, from the
farmland of its African hinterland and from tribute. It was governed by two annually elected chief magistrates (*sufetes*), a council
of elders and a citizen assembly; Aristotle had praised its constitution as one of the best of his day. Its armies were raised largely
from Libyan subjects, Numidian allies and mercenaries, commanded by Carthaginian generals, while its citizens manned the fleet.

Rome and Carthage had been on good terms for centuries. Polybius quotes three treaties, the first dated to the first year of the
Republic, defining zones of trade and influence, and in 279/8 BC they allied against Pyrrhus.{{anc:Polyb. 3.22–25}} What brought them
to war was not ancient enmity but Rome's arrival, after the conquest of the Greek cities of the south, at the Strait of Messina.

## Chronology {#chronology}

:::timeline
264 BC | Rome answers an appeal from the Mamertines of Messana; the First Punic War begins | first-punic-war
260 BC | A new Roman fleet defeats Carthage at Mylae | mylae
256–255 BC | Regulus invades Africa and is defeated; Roman fleets lost in storms
241 BC | Roman victory at the Aegates Islands; Carthage cedes Sicily | aegates
241–238 BC | Carthage's war with its unpaid mercenaries; Rome seizes Sardinia | sardinia-seized
237–219 BC | The Barcid family builds a Carthaginian dominion in Spain
218 BC | Hannibal crosses the Alps; victory at the Trebia | trebia
217 BC | Trasimene; Fabius Maximus appointed dictator | trasimene
216 BC | Cannae; Capua and much of the south defect | cannae
211 BC | Capua retaken; Syracuse falls; both Scipios killed in Spain | capua-defects
209 BC | P. Cornelius Scipio takes New Carthage | new-carthage
207 BC | Hasdrubal defeated and killed at the Metaurus | metaurus
202 BC | Scipio defeats Hannibal at Zama | zama
149–146 BC | Third Punic War; Carthage destroyed | carthage-destroyed
:::

## The First Punic War, 264–241 BC {#first-war}

In 264 BC a band of Campanian mercenaries who called themselves Mamertines ("sons of Mars") held Messana, across the strait from
Italy. Threatened by Hiero II of Syracuse, they appealed both to Carthage and to Rome. Polybius says the Senate hesitated, because
Rome had just punished Roman mercenaries for seizing Rhegium in exactly the same way; the decision for war was taken by the people,
encouraged by the consuls with promises of booty.{{anc:Polyb. 1.10–11}} The story shows that even in this period a war vote could be
contested, and that the prospect of plunder mattered to ordinary voters as well as to commanders.

What began as an intervention in one town became a struggle for Sicily. Hiero soon changed sides and remained Rome's loyal ally until
his death in 215. After taking Agrigentum in 262, the Romans realised that they could not drive Carthage from the coastal cities
without a navy. They built one: Polybius says the first fleet of 100 quinqueremes and 20 triremes was built in sixty days, modelled
on a captured Carthaginian ship.{{anc:Polyb. 1.20–21}} To compensate for inexperience they fitted the *corvus*, a boarding bridge with a
spike, which turned sea battles into infantry fights. At Mylae in 260 the consul C. Duilius won Rome's first naval victory, celebrated
with a column decorated with ships' rams in the Forum.

:::people
hamilcar-barca polybius
:::

The war then dragged on. A Roman invasion of Africa under M. Atilius Regulus in 256 won early successes but was destroyed in 255 by a
Carthaginian army reorganised by the Spartan mercenary Xanthippus; Regulus was captured. Roman fleets were lost to storms, perhaps
because the corvus made ships unstable. Polybius reckoned that Rome lost some 700 quinqueremes during the war, Carthage about
500.{{anc:Polyb. 1.63}} From 247 Hamilcar Barca waged a stubborn guerrilla war from the mountains of western Sicily. The decision
came only when Rome, its treasury exhausted, built a final fleet financed by loans from wealthy citizens and destroyed a Carthaginian
supply fleet off the Aegates Islands in 241.

:::claim established
Since 2004 underwater survey off the Aegates Islands has recovered bronze warship rams, helmets and amphorae from the battle area.
Several rams carry inscriptions, some Latin naming Roman magistrates who approved them, some Punic. They give rare physical evidence
for a battle known otherwise only from texts.
:::

Carthage agreed to evacuate Sicily and pay an indemnity of 3,200 talents over ten years. Sicily, apart from Hiero's kingdom, became
Rome's first overseas province, governed from 227 BC by a praetor. Then Carthage's unpaid mercenaries revolted and a brutal war
followed in Africa (241–237). Rome first stayed neutral, but in 238, when Carthage prepared to recover Sardinia from its rebellious
garrison, Rome threatened war and forced Carthage to give up the island and pay a further 1,200 talents. Polybius, no friend of
Carthage, called this act unjust and named it as a true cause of the next war.{{anc:Polyb. 3.10, 3.28}}

:::check pw-1
:::

## Hannibal's war, 218–201 BC {#second-war}

After 237 Hamilcar Barca led an army to Spain and built a Carthaginian dominion there, rich in silver mines and soldiers. His
son-in-law Hasdrubal continued the work and in 226 agreed with Rome not to cross the Ebro in arms. In 221 command passed to Hamilcar's
son Hannibal, then about twenty-six. Hannibal besieged Saguntum, a city south of the Ebro that had placed itself under Rome's
friendship. Its fall in 219 led Rome to demand his surrender; Carthage refused and Rome declared war.

:::people
hannibal fabius-maximus scipio-africanus
:::

Rome planned to fight in Spain and Africa. Hannibal instead marched overland to Italy, crossing the Pyrenees, the Rhône and, in late
autumn 218, the Alps, arriving with perhaps 20,000 infantry and 6,000 cavalry after heavy losses.{{anc:Polyb. 3.56}} His aim was not
to capture Rome, which he lacked the siege equipment and numbers to take, but to break the Roman alliance by defeating Roman armies
on Italian soil and persuading Rome's allies that Rome could no longer protect them. He released allied prisoners without ransom
while keeping Romans captive.

The first part of the plan succeeded spectacularly. At the Trebia in December 218 he ambushed and destroyed a consular army; Gauls of
the Po valley joined him. At Lake Trasimene in 217 he trapped the consul Flaminius' army in morning mist between the hills and the
lake. Rome appointed Q. Fabius Maximus dictator; Fabius refused battle and shadowed Hannibal, earning the nickname *Cunctator*, "the
Delayer". The strategy was unpopular and in 216 the Romans raised an exceptionally large army under the consuls L. Aemilius Paullus
and C. Terentius Varro.

### Cannae

:::diagram cannae
:::

At Cannae in Apulia, in August 216, perhaps 80,000 Roman and allied infantry faced about 40,000 of Hannibal's foot and a superior
cavalry. Hannibal placed his weaker Gallic and Spanish infantry in a forward-bowed centre and his veteran African infantry on the
wings. As the Roman mass pushed the centre back, the Africans turned inward, and Hannibal's cavalry, having routed the Roman horse,
fell on the Roman rear. Encircled, the Roman army was slaughtered. Polybius gives some 70,000 dead; Livy gives about 48,000 killed and
many captured.{{anc:Polyb. 3.117; Livy 22.49}} Aemilius Paullus died, along with some eighty senators. Modern estimates differ, but
Cannae was among the bloodiest single days in the history of war.

:::claim interpretation
The figures for Cannae come from ancient historians with limited access to reliable totals, and modern scholars revise them in both
directions. What is not in doubt is the scale: Rome lost in a single afternoon a large proportion of the men it had in the field,
and the defeat shook its alliance in southern Italy.
:::

After Cannae, Capua, the second city of Italy, defected, followed by many communities in Samnium, Lucania, Bruttium and, in 212,
Tarentum. Philip V of Macedon allied with Hannibal in 215; Syracuse broke with Rome after Hiero's death. This was the moment the
alliance system might have collapsed.

### Why Rome survived

It did not collapse. The Latin colonies and most of the allies of central Italy stayed loyal. Many southern defectors were cities in
which local factions were already hostile to Rome, and once they had changed sides Hannibal had to protect them, which tied him down.
Rome refused to negotiate. According to Polybius and Livy, the Senate declined to ransom the prisoners taken at Cannae; it armed
8,000 slaves who volunteered (the *volones*), lowered the age of enlistment and raised new legions.{{anc:Polyb. 6.58; Livy 22.57}}

:::source polybius-manpower
Polybius' figures for 225 BC explain why Rome could lose army after army and still put new ones into the field.
:::

:::check pw-3
:::

Rome also changed how it fought. It avoided pitched battle with Hannibal while besieging and retaking the cities that had defected.
Commanders were kept in post for years through prorogation, so that experienced men such as Fabius, Marcellus and Fulvius Flaccus
could pursue long campaigns. Marcellus took Syracuse in 212/211; the mathematician Archimedes was killed in the sack. Capua fell in
211, despite Hannibal's march on Rome itself to draw the besiegers away, and was severely punished. Tarentum was retaken in 209.

:::check pw-2
:::

The war was decided outside Italy. In Spain the brothers P. and Cn. Scipio held the Carthaginians down until both were killed in 211.
The Senate then gave command to the dead Publius' son, also Publius, aged about twenty-five and holding no senior office, an
extraordinary appointment voted by the people. In 209 he took New Carthage, the Carthaginian base in Spain, by a surprise assault
across a lagoon; by 206 he had driven Carthage from the peninsula. Hannibal's brother Hasdrubal escaped to Italy with a relief army
but was destroyed at the Metaurus in 207; his head was thrown into Hannibal's camp. In 204 Scipio crossed to Africa, won over the
Numidian prince Masinissa and forced Carthage to recall Hannibal. At Zama in 202, with Numidian cavalry now on the Roman side,
Scipio defeated him. Scipio took the name Africanus.

The peace of 201 left Carthage independent in Africa but stripped of Spain and its fleet, apart from ten ships; it had to pay 10,000
talents over fifty years and could not make war, even in Africa, without Roman permission.

## The Third Punic War, 149–146 BC {#third-war}

Carthage recovered economically and paid off its indemnity. Masinissa, now king of Numidia, used the treaty to seize Carthaginian
land, knowing that Rome would back him. When in 151/150 Carthage finally fought back, it broke the treaty. In Rome, Cato the Elder had
been urging for some time that Carthage be destroyed; Plutarch says he ended every speech in the Senate with that demand, and
illustrates it with a fresh fig from Africa, to show how close the enemy was.{{anc:Plut. Cat. Mai. 27}}

:::claim interpretation
The famous Latin phrase *Carthago delenda est*, "Carthage must be destroyed", is a later formulation. Ancient authors report the
substance of Cato's demand, not those exact words.
:::

In 149 Rome declared war. Carthage surrendered hostages and its weapons, and was then ordered to abandon the city and resettle at
least ten miles from the sea, which meant the end of Carthage as a trading city. The Carthaginians refused and held out for three
years. In 146 Scipio Aemilianus, the adoptive grandson of Africanus, stormed the city. Polybius was with him and reported that
Scipio wept as he watched it burn, quoting Homer on the fall of Troy and reflecting that Rome too might one day fall.{{anc:Polyb.
38.21–22 (via Appian, Pun. 132)}} The survivors were enslaved and the territory became the province of Africa. In the same year a
Roman army sacked Corinth.

:::people
cato-elder scipio-aemilianus
:::

## Causes and explanations {#causation}

Three questions about causation have dominated discussion.

**Why war in 264?** Polybius' account suggests opportunism: Rome feared that Carthage would control the strait and threaten Italy, and
voters wanted booty. Some historians emphasise Roman insecurity; others, like W. V. Harris, see this as one example of a Roman society
geared to annual war, in which aristocrats needed commands and glory and citizens expected gain.{{ref:harris-1979}}

**Why war in 218?** The Romans blamed Hannibal's hatred, the "wrath of the Barcids" that Polybius reports Hamilcar instilled in his son
by having him swear at an altar never to be a friend to Rome.{{anc:Polyb. 3.11}} Polybius himself distinguished between the pretext
(Saguntum), the beginning (Hannibal's attack) and the deeper causes: Hamilcar's anger after the First War, the Sardinian seizure and
Carthaginian success in Spain, which gave them the means to fight. Modern historians add Roman expansion in northern Italy and the
ambiguity of Rome's relationship with Saguntum, which lay south of the Ebro line.

**Why 146?** Explanations range from strategic fear of a reviving Carthage, to the influence of Cato and others who stood to gain land
and booty, to a hardening of Roman attitudes in the 150s visible also in Spain and Greece. The sources do not allow a single answer.

:::debate roman-imperialism
:::

## Consequences {#consequences}

The Punic Wars made Rome a Mediterranean power. They created the first provinces (Sicily, Sardinia-Corsica, the two Spains, Africa),
standing overseas commitments and the habit of governing through magistrates with prorogued imperium. They demonstrated the
extraordinary resilience of the Roman-Italian alliance, but also its costs: the war with Hannibal devastated parts of southern Italy,
kept tens of thousands of men under arms for years, and put the allies under heavy strain. Both points would matter in the next
century, when allies who had fought Rome's wars began to demand Roman citizenship.

The wars also created new kinds of political career. Scipio Africanus, elected to command without having held the usual offices,
won a fame and wealth that troubled his peers; he was eventually attacked in the courts and withdrew from Rome. The lex Villia
annalis of 180 BC, which regulated the age and sequence of offices, can be read as the nobility's attempt to stop such careers from
happening again.

## Historiography and sources {#historiography}

Our main narrative sources are Polybius and Livy. Polybius, a Greek statesman deported to Rome as a hostage in 167 and a close
friend of Scipio Aemilianus, wrote his *Histories* to explain how Rome came to rule the known world in less than fifty-three years
(220–167 BC). He used Roman and pro-Carthaginian historians, criticising the Roman Fabius Pictor for partiality to Rome and Philinus
of Agrigentum for partiality to Carthage, and he walked Hannibal's route over the Alps. Livy, writing under Augustus, gives a fuller,
more dramatic narrative in Books 21–30; he used Polybius and Roman annalists, and his account is shaped by moral and patriotic
purposes.{{ref:livy-yardley-2006}}

The Carthaginian side survives only indirectly. Hannibal took Greek historians with him, Silenus and Sosylus, whose works are lost.
Archaeology at Carthage, especially the excavations of the 1970s and later international projects, has shown a large, prosperous
city with a circular naval harbour and houses on the Byrsa hill destroyed in 146.{{ref:hoyos-2011}} Modern narratives such as
Goldsworthy's analyse the wars militarily;{{ref:goldsworthy-2000}} social historians such as Rosenstein have asked what years of
service meant for the farming families who supplied Rome's soldiers.{{ref:rosenstein-2004}}

## Working with the evidence {#evidence}

:::aside How much can we trust the numbers?
Ancient army and casualty figures are notoriously unreliable: they could be exaggerated for glory, rounded, or reconstructed long
afterwards. Polybius is more careful than most, and his figures for 225 BC appear to derive from official lists, but even these
present problems of categorisation. When you meet a figure, ask where the author could have found it, whether it is round or precise,
and whether the argument depends on the number or only on its scale.
:::

:::check pw-4
:::
