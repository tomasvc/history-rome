---
id: roman-law
module: t03
title: Roman Law
subtitle: From the Twelve Tables to Justinian and beyond
span: [-451, 1100]
minutes: 14
status: complete
objectives:
  - Trace the development of Roman law from the Twelve Tables to Justinian.
  - Explain the roles of statute, magistrates' edicts, jurists and emperors in making law.
  - Describe key institutions of private law (persons, property, obligations, succession).
  - Assess how law worked in practice and why Roman law had such a long afterlife.
questions:
  - Who made Roman law, and how?
  - How did law treat people of different status?
  - Why did a body of law developed for a Mediterranean empire become the basis of legal systems across the world?
figures: [ulpian, tribonian, justinian, cicero, hadrian, theodosius-ii]
events: [twelve-tables-ev, constitutio-antoniniana-ev, theodosian-code-ev, corpus-iuris-ev]
places: [rome, constantinople, pompeii, herculaneum]
sources: [twelve-tables, justinian-institutes, constitutio-antoniniana]
terms: [ius-civile, ius-gentium, jurist, twelve-tables, corpus-iuris, digest, rescript, edict, praetor, paterfamilias, patria-potestas, manus, honestiores, provocatio, quaestio, lex, freedman, manumission, peculium]
debates: []
checks:
  - id: rl-1
    type: match
    skill: recall
    prompt: Match each source of Roman law with its description.
    pairs:
      - {left: 'Leges (statutes)', right: 'Laws passed by the assemblies of the Roman people'}
      - {left: 'The praetor''s edict', right: 'Annual announcement of the remedies a magistrate would grant, which developed law flexibly'}
      - {left: 'Responsa of the jurists', right: 'Opinions of legal experts, whose writings became authoritative'}
      - {left: 'Imperial constitutions', right: 'Edicts, decrees and rescripts of the emperors, which had the force of law'}
    explain: >-
      Roman law developed less through legislation than through magistrates and jurists responding to cases; under the empire, the emperor
      became the main source of new law.
  - id: rl-2
    type: source
    skill: source
    sourceId: twelve-tables
    prompt: What do the surviving fragments of the Twelve Tables suggest about early Roman society?
    model: >-
      They show a rural society of households, with fathers holding strong power over sons (who could be sold), harsh debt enforcement, and
      procedures for summoning to court that depended on the plaintiff's own action. Retaliation in kind for injury and the curse on a patron
      who wronged a client show self-help and religious sanctions. They also show the importance of making rules public. Since the text
      survives only in later quotations, sometimes modernised, the details must be used cautiously.
    rubric:
      - Mentions the household and paternal power.
      - Mentions debt and self-help.
      - Mentions publicity of law.
      - Notes the problem of transmission.
  - id: rl-3
    type: mcq
    skill: interpretation
    prompt: What was the distinction between honestiores and humiliores that developed in the second and third centuries AD?
    options:
      - text: A legal division of free people by social rank, under which the "more honourable" (decurions, soldiers, veterans, equestrians, senators) received milder penalties and were exempt from torture and degrading punishments.
        correct: true
        why: The distinction, studied by Peter Garnsey, cut across citizenship and became more important after 212.
      - text: The division between citizens and non-citizens.
        why: The new distinction was within the free population, including citizens.
      - text: The difference between patricians and plebeians.
        why: That was an early Republican distinction that had lost its significance.
      - text: The division between Christians and pagans.
        why: The distinction was social, not religious.
  - id: rl-4
    type: short
    skill: causation
    prompt: Explain how Roman law came to influence modern legal systems.
    model: >-
      Justinian's Corpus Iuris Civilis preserved Roman law in a systematic form. In the late eleventh century, the Digest was rediscovered in
      Italy and taught at Bologna, where glossators and commentators made it the basis of a European legal science. Combined with canon law, it
      formed the "common law" (ius commune) of continental Europe and was received into national legal systems. The codifications of the
      nineteenth century, such as the French Civil Code (1804) and German Civil Code (1900), were built on it and spread through empire and
      imitation to Latin America, parts of Africa and Asia. In the East, Justinian's law continued through Byzantine codes.
    rubric:
      - Mentions Justinian's codification.
      - Mentions Bologna and the medieval revival.
      - Mentions modern codifications.
      - Mentions global spread or Byzantine continuity.
reading:
  - {ref: nicholas-1962, note: 'An Introduction to Roman Law: the classic short guide.'}
  - {ref: frier-mcginn-2004, note: 'A Casebook on Roman Family Law.'}
  - {ref: gaius-gordon-robinson-1988, note: 'The Institutes of Gaius in translation.'}
  - {ref: digest-watson-1985, note: 'The Digest in English translation.'}
  - {ref: harries-1999, note: 'Law and Empire in Late Antiquity.'}
  - {ref: garnsey-1970, note: 'Social Status and Legal Privilege in the Roman Empire.'}
  - {ref: crawford-statutes-1996, note: 'Roman Statutes: texts of Republican laws.'}
inquiry:
  - Choose a case from the Digest. How would it be decided today in your legal system?
  - What does the Babatha archive reveal about law in practice for a Jewish woman in the province of Arabia?
  - Why did Roman jurists rarely discuss the justice of slavery?
---
## Introduction {#context}

Roman law is the most enduring Roman achievement. It governed relationships among Romans for over a thousand years, was codified by
Justinian in the sixth century, revived in medieval Italy, and forms the basis of the civil law systems used by a majority of the world's
countries. Studying it shows how Romans thought about property, family, contracts and status, and how a legal system can develop over
centuries through practice rather than design.

## Chronology {#chronology}

:::timeline
451–450 BC | Twelve Tables | twelve-tables-ev
367 BC | Urban praetor created; the edict begins to develop
c. 242 BC | Peregrine praetor for cases involving foreigners
c. 95 BC | Q. Mucius Scaevola's systematic treatise on civil law
c. AD 130 | Hadrian has the praetor's edict fixed by Salvius Julianus
c. AD 160 | Gaius' Institutes
c. AD 200–230 | Papinian, Ulpian and Paul
AD 212 | Citizenship for almost all free inhabitants | constitutio-antoniniana-ev
AD 438 | Theodosian Code | theodosian-code-ev
AD 529–534 | Justinian's Code, Digest and Institutes | corpus-iuris-ev
c. AD 1070–1100 | Digest studied at Bologna
:::

## How law was made {#sources}

The Romans traced their law to the **Twelve Tables** (451–450 BC), a code published after plebeian pressure so that the rules would be known.

:::source twelve-tables
:::

:::check rl-2
:::

Statutes (*leges*) passed by assemblies covered specific matters, but most private law developed in other ways. Each year the urban praetor
issued an **edict** announcing the actions and defences he would grant; by adding remedies, he could reshape the law without legislation.
The peregrine praetor did the same for disputes involving foreigners, developing a body of rules thought common to all peoples, the *ius
gentium*. The edict became fixed under Hadrian.

The **jurists** were the creative force. Members of the elite, initially often pontiffs, they gave opinions (*responsa*) to magistrates,
judges and citizens, taught pupils and wrote treatises. Augustus gave some of them the right to answer "by the authority of the emperor". The
jurists of the Severan age, Papinian, Ulpian and Paul, many of whom served as praetorian prefects, wrote voluminously.

Under the empire, **imperial constitutions** became the main source of new law: edicts addressed to the public, decisions in cases, and
rescripts in answer to petitions from officials and private individuals.

:::check rl-1
:::

## Persons, property and obligations {#private}

The jurist Gaius divided law into persons, things and actions, a scheme that shaped legal textbooks for centuries.

**Persons.** The fundamental distinction was between free people and slaves; among the free, between those born free and freed slaves; among
citizens, between those who were legally independent (*sui iuris*) and those under the power of another. The Roman [[term:paterfamilias]] held
*patria potestas* over his children and their descendants for life: in law they owned nothing, and he could, in early law, sell or even kill
them. In practice, sons managed property as *[[term:peculium]]*, and the power was moderated by custom and emotion. Women were under the power
of a father, or of a husband if married with *manus*, or of a guardian; by the late Republic most marriages were without *manus*, so wives
remained in their fathers' power or became independent on their deaths.

**Things.** Roman law developed a sophisticated concept of ownership (*dominium*) distinct from possession, with remedies to protect each, and
rules for acquiring ownership by delivery, by long possession, and by inheritance.

**Obligations.** The jurists classified obligations arising from contracts (sale, hire, partnership, mandate, loan, stipulation) and from
wrongs (theft, damage to property, injury). Many of their categories and principles, such as good faith in contracts of sale, remain familiar.

:::source justinian-institutes
:::

## Courts and procedure {#courts}

In the classical formulary procedure, a case began before the praetor, who defined the issue in a written formula, and was decided by a private
judge (*iudex*), often a layman advised by jurists. Under the empire this gave way to procedure entirely before officials (*cognitio*), with
appeals to higher officials and ultimately to the emperor.

Criminal law was less developed. In the late Republic standing courts (*quaestiones*) with large juries tried crimes such as extortion,
murder, electoral bribery and treason. Under the empire, governors and other officials judged criminal cases directly, with wide discretion
in punishment.

## Law and status {#status}

Roman law was not equal. Slaves could be tortured to give evidence, and their testimony was valid only under torture. From the second century
AD, free people were divided into *honestiores* and *humiliores*, who faced different punishments for the same crime: execution by beheading or
exile for the former, crucifixion, the beasts or the mines for the latter.{{ref:garnsey-1970}}

:::check rl-3
:::

The extension of citizenship in 212 made Roman law the law of almost all free inhabitants of the empire, though local customs persisted, and
papyri show provincials using a mix of Roman and local law.

:::source constitutio-antoniniana
:::

## Thinking like a Roman jurist {#method}

Roman jurists did not build a legal system from abstract principles. They worked case by case, asking what the right answer was in a concrete situation, often an imaginary one, and they recorded disagreements as well as solutions. In the early empire two "schools", the Sabinians and the Proculians, were known for different approaches to particular questions. The Digest preserves this method: rather than stating rules, it often reports what one jurist thought, what another replied, and why.

### A case from the Digest

A famous example concerns liability for damage under the lex Aquilia, the statute on wrongful damage to property, which included slaves. Ulpian reports a case discussed by earlier jurists: some people were playing ball; one hit the ball hard, it struck the hand of a barber who was shaving a slave, and the razor cut the slave's throat. Who was liable to the slave's owner? Mela said that whoever was at fault was liable. Proculus said the fault was the barber's, and Ulpian agreed that if the barber was shaving where ball games were usually played, or where there was much traffic, he was to blame; but, he added, it can also be said that if someone entrusts himself to a barber who has set up his chair in a dangerous place, he has only himself to blame.{{anc:Dig. 9.2.11 pr.}}

The case shows several features of Roman legal thinking: attention to fault (*culpa*) rather than mere causation; the use of everyday situations; the willingness to weigh several parties' responsibility; and the fact that, in law, the injured slave was the owner's property, so the claim belonged to the master. It is also a reminder of how ordinary life in Roman towns, with barbers working in the street and games in public spaces, appears in legal sources.

## Who used the courts? {#access}

In principle anyone could bring a case; in practice, litigation required money, time, connections and often the help of an advocate. Wealthy and powerful defendants could intimidate weaker plaintiffs, and governors' assizes were held only periodically in each region. Papyri from Egypt show that people of quite modest means did petition officials and go to law over property, debts, inheritances and assaults, often with the help of professional scribes who drafted petitions in the right form. Law was not only an elite affair, but its benefits were unequally distributed.

## Law in practice {#practice}

Documents show how people used the law. Wax tablets from Herculaneum and from the Murecine archive near Pompeii record loans, sales and court
proceedings. The archive of Babatha, a Jewish woman whose documents were found in a cave near the Dead Sea, shows her litigating over property
and guardianship in the Roman province of Arabia in the 120s (see the case study in [[lesson:governing-provinces#babatha|Governing an Empire]]).
The Murecine tablets are examined more closely in [[lesson:roman-economy#sulpicii|The Roman Economy]]. Petitions on papyrus from Egypt show ordinary people appealing to officials
against neighbours, relatives and tax collectors.

## Codification and afterlife {#codification}

In the late empire, the mass of imperial constitutions was collected in private codes (Gregorian and Hermogenian) and then the official
Theodosian Code (438). Justinian's codification (529–534) preserved the classical jurists' work in the Digest and remained the law of the
eastern empire, adapted in Greek in the *Basilika* (c. 900). In the West, Roman law survived in barbarian codes and in the Church, and the
Digest's rediscovery in eleventh-century Italy launched the study of law in medieval universities.

:::check rl-4
:::

## Historiography {#historiography}

Legal historians once studied Roman law as a timeless system, reconstructing its "classical" form and removing later "interpolations" from
Justinian's texts. Social historians now ask how law worked in practice, whom it served, and how it shaped and reflected Roman society,
especially the family, slavery and status. The evidence of documents (papyri, tablets) is increasingly used alongside the jurists.{{ref:harries-1999}}

:::aside A palimpsest
Gaius' *Institutes* survived the Middle Ages only by accident: in 1816 the historian Barthold Niebuhr identified the text beneath later
writing in a manuscript in the cathedral library at Verona, where the parchment had been scraped and reused. It is the only classical legal
work that survives substantially independent of Justinian.
:::
