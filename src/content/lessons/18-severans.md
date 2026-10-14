---
id: severans
module: m08
title: The Severan Dynasty
subtitle: An African emperor, a Syrian court and a militarised monarchy, AD 193–235
span: [193, 235]
minutes: 14
status: complete
objectives:
  - Narrate the civil wars of 193–197 and the establishment of Septimius Severus.
  - Explain Severus' reforms of the army and their political and financial consequences.
  - Analyse the Constitutio Antoniniana and its possible motives.
  - Assess the roles of the Severan women and the jurists.
questions:
  - Did Severus make the empire more dependent on the army, or simply acknowledge that it already was?
  - Why did Caracalla make almost everyone a citizen?
  - Why did the Severan dynasty end with the murder of a young emperor by his own soldiers?
figures: [septimius-severus, julia-domna, caracalla, geta, elagabalus, severus-alexander, julia-mamaea, ulpian, cassius-dio, commodus]
events: [commodus-killed, year-193, severan-army, constitutio-antoniniana-ev, sasanian-rise, maximinus-acclaimed]
places: [rome, lepcis-magna, lugdunum, eboracum, ctesiphon, mainz, nisibis, antioch, carrhae]
sources: [dio-severus, constitutio-antoniniana]
terms: [praetorian-guard, praetorian-prefect, constitutio-antoniniana, honestiores, jurist, damnatio-memoriae, antoninianus, legion, denarius]
debates: [third-century-crisis]
checks:
  - id: sv-1
    type: order
    skill: chronology
    prompt: Put these events in order.
    items:
      - Pertinax murdered by the Praetorian Guard
      - Septimius Severus proclaimed at Carnuntum and marches on Rome
      - Defeat of Pescennius Niger in the East
      - Defeat of Clodius Albinus at Lugdunum
      - Severus dies at York
      - Caracalla has Geta murdered
      - Constitutio Antoniniana
    explain: March 193; April 193; 194; 197; 211; December 211; 212.
  - id: sv-2
    type: source
    skill: source
    sourceId: constitutio-antoniniana
    prompt: The surviving papyrus of the Constitutio Antoniniana gives a religious reason for the grant. What other motives have been suggested, and how would you weigh them?
    model: >-
      The text (P. Giessen 40) presents the grant as thanks to the gods, so that more people might share in their worship. Cassius Dio,
      hostile, claims the purpose was to increase revenue from taxes paid only by citizens, such as the inheritance tax, which Caracalla
      had doubled. Historians also point to a desire for unity after Geta's murder, an ideology of a universal empire, and the
      recognition of a process of integration already far advanced. Because the text is damaged and Dio is biased, a combination of
      motives is likely; the fiscal explanation alone does not explain the religious language, and the religious language alone does
      not explain the timing.
    rubric:
      - States the religious reason in the text.
      - Explains Dio's fiscal explanation and his bias.
      - Adds at least one further motive.
      - Weighs the evidence.
  - id: sv-3
    type: mcq
    skill: causation
    prompt: Which consequence of Severus' military reforms is most often emphasised by historians?
    options:
      - text: Higher pay and donatives greatly increased state expenditure, contributing to fiscal pressure and debasement of the silver coinage.
        correct: true
        why: Severus and Caracalla raised pay substantially; the denarius fell in silver content, and Caracalla introduced the antoninianus.
      - text: The army became smaller and weaker.
        why: Severus raised three new legions and increased the Guard.
      - text: Soldiers were forbidden from marrying.
        why: Severus permitted soldiers to marry, reversing the earlier ban.
      - text: Italy was demilitarised.
        why: Severus stationed a legion (II Parthica) at Albanum near Rome, the first legion in Italy for two centuries.
  - id: sv-4
    type: short
    skill: interpretation
    prompt: Why were the Severan women so prominent, and why did the sources treat them with hostility?
    model: >-
      Julia Domna, her sister Julia Maesa and Maesa's daughters Soaemias and Mamaea controlled family wealth, networks and the
      dynastic claim through their kinship with Severus; under young emperors (Elagabalus, Severus Alexander) they effectively directed
      government. Julia Domna presided over an intellectual circle and handled correspondence for Caracalla. Senatorial historians
      regarded women's exercise of public power as illegitimate and as a sign of a degenerate regime, and they were also hostile to the
      Syrian origins of the family and the cult of Elagabal; so the sources both reveal and distort their real influence.
    rubric:
      - Explains the dynastic basis of their power.
      - Gives specific examples of their roles.
      - Identifies the source of hostility.
      - Recognises the distortion.
reading:
  - {ref: birley-1999, note: 'Septimius Severus: The African Emperor.'}
  - {ref: dio-cary-1914, note: 'Dio Books 74–80, an eyewitness senator''s account.'}
  - {ref: herodian-whittaker-1969, note: 'Herodian''s History, a second contemporary narrative.'}
  - {ref: potter-2014, note: 'The Roman Empire at Bay.'}
  - {ref: ando-2012, note: 'Imperial Rome AD 193 to 284.'}
  - {ref: cah-12}
inquiry:
  - Compare Dio and Herodian on the same event. How do their purposes differ?
  - What does the arch of Septimius Severus at Lepcis Magna tell us about the relationship between an emperor and his home town?
  - Why did the Roman legal tradition flourish under emperors remembered as tyrants?
---
## Historical context {#context}

Commodus' murder on 31 December 192 began a year of civil war resembling 69. Within five months two emperors were killed in Rome, and
three provincial governors with large armies claimed the throne. The winner, L. Septimius Severus, was born at Lepcis Magna in Africa to a
family of Punic origin that had entered the Roman elite; his wife, Julia Domna, came from the priestly family of the sun god Elagabal at
Emesa in Syria. The dynasty they founded ruled until 235 and is often seen as a turning point towards a more openly military monarchy.

:::stemma severan
:::

## Chronology {#chronology}

:::timeline
1 Jan AD 193 | Pertinax emperor; murdered by the Guard in March | year-193
Mar AD 193 | Didius Julianus "buys" the empire from the Guard
Apr AD 193 | Severus proclaimed on the Danube; enters Rome in June
AD 194 | Pescennius Niger defeated near Issus
AD 197 | Clodius Albinus defeated at Lugdunum; army reforms | severan-army
AD 197–199 | Parthian war; Ctesiphon sacked; province of Mesopotamia
AD 208–211 | Campaigns in Scotland; Severus dies at York
AD 211 | Caracalla murders Geta
AD 212 | Constitutio Antoniniana | constitutio-antoniniana-ev
AD 217 | Caracalla murdered; Macrinus emperor
AD 218–222 | Elagabalus
AD 222–235 | Severus Alexander; murder of Ulpian
AD 224–226 | Ardashir founds the Sasanian empire | sasanian-rise
AD 235 | Severus Alexander and Mamaea killed by soldiers near Mainz | maximinus-acclaimed
:::

## The civil wars of 193–197 {#civil-war}

P. Helvius Pertinax, an experienced senator and son of a freedman, became emperor after Commodus' murder but attempted economies that
alienated the Guard, who killed him after eighty-seven days. According to Dio and Herodian, the Guard then sold the throne to the highest
bidder, the wealthy senator Didius Julianus.{{anc:Cass. Dio 74.11}} The auction may be embellished, but Julianus did owe his position to a
huge donative and had no other support.

Three provincial armies proclaimed their commanders: Septimius Severus in Upper Pannonia, Pescennius Niger in Syria and Clodius Albinus in
Britain. Severus, closest to Rome, made Albinus his Caesar (heir) to neutralise him, marched on Rome, had Julianus killed, dismissed the
Guard and replaced it with men from his own Danubian legions. He then defeated Niger (194) and punished cities that had supported him.
In 196 he broke with Albinus, naming his own son as Caesar, and destroyed him at Lugdunum in 197, followed by executions of senators who
had supported him.

:::check sv-1
:::

## The army and the state {#army}

:::source dio-severus
:::

Severus' reforms strengthened his military base:

- Pay was raised substantially (by perhaps a half) and soldiers below the rank of centurion were permitted to marry.
- Three new legions (I–III Parthica) were raised; II Parthica was stationed at Albanum near Rome, the first legion based in Italy in two
  centuries.
- The Guard was recruited from the provincial legions instead of from Italians, and doubled in size.
- Equestrians, many of them former soldiers, were given more commands, including those of the new legions and the province of Mesopotamia.

Historians have long debated whether these changes "militarised" the empire. The army had always been the ultimate basis of power; Severus
made the relationship more open and more expensive. Increased pay was financed partly by debasing the silver denarius, whose silver content
fell to around 50 per cent, a step towards the monetary crisis of the later third century.

:::check sv-3
:::

Severus campaigned against Parthia (197–199), sacking Ctesiphon and annexing northern Mesopotamia. The cost was continuing war with Parthia
and then the Sasanians. In Britain, from 208, he campaigned in Scotland with both sons, and died at York in February 211.

## Lepcis Magna: an emperor's home town {#lepcis}

Severus' birthplace, Lepcis Magna on the coast of modern Libya, shows how a provincial city could benefit from producing an emperor. A Phoenician foundation, it had become a prosperous Roman town whose elite still used Punic: its theatre, built in the reign of Augustus, carries a dedication in both Latin and Punic by a local benefactor, Annobal Tapapius Rufus. Under Severus the city received the *ius Italicum*, the privilege of being treated as if on Italian soil, which exempted its land from direct tax.{{anc:Dig. 50.15.8.11}} A huge building programme followed: a new forum and basilica, a colonnaded street, a monumental fountain, an enlarged harbour, and a four-way arch decorated with reliefs of the imperial family.

:::claim interpretation
Lepcis illustrates two features of the second and third centuries: the integration of provincial elites into the Roman ruling class, to the point of producing an emperor, and the way imperial favour flowed along personal networks. The buildings were also a statement to the empire that the new dynasty's African origins were a source of pride. Compare the bilingual elite of Lepcis with other [[lesson:romanisation#cases|provincial case studies]]. The city's later decline, after Severan favour ended and as the region's security and economy weakened, is equally instructive.
:::

## Caracalla and the citizenship {#caracalla}

Severus left the empire jointly to Caracalla and Geta, who loathed each other. In December 211 Caracalla had Geta murdered, reportedly in
their mother's arms. Geta's memory was condemned: his name and image were erased from inscriptions, coins and paintings across the empire.
On a painted wooden panel of the family from Egypt, now in Berlin, Geta's face has been scratched out.

:::source constitutio-antoniniana
:::

:::check sv-2
:::

The grant of citizenship in 212 made Roman law the formal law of almost all free inhabitants, though local laws and customs persisted. Its
immediate practical effects are debated; its symbolic effect was to make the empire, in law, a community of Romans. Many new citizens took
the name Aurelius after the emperor (Marcus Aurelius Antoninus was Caracalla's official name), which is why "Aurelius" becomes so common in
later inscriptions and papyri.

Caracalla spent most of his reign with the armies, imitated Alexander the Great, and was murdered in 217 near Carrhae by an officer acting
for the praetorian prefect Macrinus, the first equestrian emperor.

## Emesa in Rome: Elagabalus and Severus Alexander {#emesa}

Julia Domna's sister Julia Maesa engineered Macrinus' overthrow in 218 by presenting her fourteen-year-old grandson, the priest of Elagabal at
Emesa, as Caracalla's son. The young emperor, known to history by his god's name, Elagabalus, brought the god's sacred stone to Rome, made it
the supreme god of the Roman state and scandalised senators with his rituals and private life, as reported (and perhaps embellished) by
Dio, Herodian and the Historia Augusta. In 222 the Guard killed him and his mother.

His cousin Severus Alexander, aged thirteen, ruled under the guidance of his grandmother Maesa and mother Julia Mamaea. The great jurist
Ulpian was praetorian prefect until he was killed by the Guard. In the East the Parthian dynasty fell to the Persian Ardashir, founder of the
Sasanian empire (224–226), a far more aggressive neighbour. Alexander's Persian campaign of 231–233 was inconclusive; on the Rhine in 235 his
soldiers, contemptuous of an emperor who sought to buy peace and was dominated by his mother, killed both of them and proclaimed the
equestrian officer Maximinus.

:::check sv-4
:::

## The women of the Severan house {#women}

The Severan dynasty is unusual in how prominently women appear in its history, and in how much power the sources attribute to them. Julia Domna, Severus' wife, was honoured from 195 as "mother of the camp" (*mater castrorum*), later with longer titles making her mother of the emperor, the camp, the Senate and the fatherland. She was a patron of intellectuals: the sophist Philostratus says that he wrote his *Life of Apollonius of Tyana* at her request. Under Caracalla, according to Dio, she was given charge of petitions and of the emperor's correspondence in Greek and Latin, except for the most urgent matters.{{anc:Cass. Dio 78.18.2}} After her son's murder in 217 she died at Antioch, probably by starving herself.

Her sister Julia Maesa organised the coup that made her grandson Elagabalus emperor, and then helped replace him with his cousin Severus Alexander. Alexander's mother, Julia Mamaea, dominated his reign; her interest in religion and philosophy led her to summon the Christian scholar Origen to Antioch to hear him teach.{{anc:Euseb. Hist. eccl. 6.21.3–4}}

:::claim interpretation
How much power these women really held is hard to judge. Senatorial historians used powerful women as a sign of a disordered reign, and the Historia Augusta's stories of a "women's senate" are fiction. Coins, inscriptions and titles confirm their public prominence; Dio, who knew the court, confirms Julia Domna's administrative role. Their importance came above all from their place in the dynasty: in a regime whose legitimacy rested on family, women were the links that made new emperors appear to be Severans.
:::

## The jurists {#law}

The Severan age was the golden age of Roman jurisprudence. Papinian (executed by Caracalla), Ulpian and Paul, all of whom served as
praetorian prefects or on the emperor's council, wrote commentaries and treatises that later formed a large part of Justinian's Digest.
Ulpian is the source of definitions that shaped European legal thought, such as justice as "the constant and perpetual will to give each
person his due".{{anc:Dig. 1.1.10}} Many of these jurists came from the eastern provinces. Their work shows that the empire's legal and
administrative culture remained highly sophisticated even as the political order became more violent.

## Consequences {#consequences}

The Severans made the army's central role explicit, increased its cost and enlarged the role of equestrian officers. They also confronted a
new Persian power and left a currency under strain. When the dynasty ended in 235, the empire entered fifty years in which almost every
emperor would be made by soldiers and killed by them.

:::debate third-century-crisis
:::

## Historiography and evidence {#historiography}

The two main narrative sources are contemporaries: Cassius Dio, a senator from Nicaea who held high office and wrote a Roman history in
Greek in eighty books, and Herodian, probably a minor official, whose more rhetorical history covers 180–238. Both are hostile to emperors
who did not respect the Senate. The Historia Augusta's lives of Elagabalus and Severus Alexander are largely fiction: an exemplary portrait
of Alexander as the ideal senatorial emperor set against a fantastical monster. Anthony Birley's biography emphasises Severus' African
background and administrative competence.{{ref:birley-1999}}

:::aside An African emperor?
Modern writers sometimes describe Severus as "the first African emperor". He was born in Africa, but to a wealthy family of Punic and Italian
descent, Roman citizens long integrated into the elite. Ancient sources do not identify him by skin colour, and the story that he spoke Latin
with an African accent comes from the Historia Augusta. The label tells us more about modern categories than about Roman ones; see the lesson
on race and ethnicity.
:::
