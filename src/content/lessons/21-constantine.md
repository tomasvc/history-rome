---
id: constantine
module: m09
title: Constantine
subtitle: Civil war, conversion and a new Rome, AD 306–337
span: [306, 337]
minutes: 16
status: complete
objectives:
  - Narrate Constantine's rise from usurper at York to sole emperor.
  - Compare the earliest accounts of his conversion and assess their reliability.
  - Explain his policies towards the Church, including the Council of Nicaea.
  - Evaluate the foundation of Constantinople and the significance of his reign.
questions:
  - What happened in 312, and how do we know?
  - Was Constantine's conversion sincere, political or both, and does the question make sense?
  - Why did an emperor intervene in disputes about the nature of God?
figures: [constantine, maxentius, licinius, helena, eusebius, lactantius, constantius-i, galerius, constantius-ii, ambrose, diocletian, maximian]
events: [constantine-proclaimed, galerius-toleration, milvian-bridge, milan-313, chrysopolis, nicaea-council, constantinople-founded]
places: [eboracum, trier, milvian-bridge, rome, constantinople, nicaea, nicomedia, jerusalem, arelate, adrianople, mediolanum]
sources: [lactantius-vision, eusebius-vision, milan-letter]
terms: [chi-rho, labarum, solidus, bishop, council, arianism, nicene, comitatenses, praetorian-prefect, pontifex-maximus, persecution]
debates: [constantine-conversion, christian-growth]
checks:
  - id: co-1
    type: source
    skill: source
    sourceId: eusebius-vision
    prompt: Compare Lactantius' and Eusebius' accounts of Constantine's vision. Why do they differ?
    model: >-
      Lactantius, writing within a few years of 312, describes a dream on the night before the battle in which Constantine was told to
      mark a sign of Christ on his soldiers' shields. Eusebius, writing after Constantine's death in 337 and claiming to have heard the
      story from the emperor himself on oath, describes a vision of a cross of light in the sky with the words "by this conquer", seen
      by the whole army, followed by a dream and the creation of the labarum standard. The later account is more miraculous, ties the
      vision to a campaign rather than the eve of battle, and serves Eusebius' purpose of presenting Constantine as God's chosen
      emperor. The difference shows how the story developed over a generation, possibly with Constantine's own retelling.
    rubric:
      - Summarises Lactantius' account and date.
      - Summarises Eusebius' account and date.
      - Identifies key differences.
      - Explains the reasons for differences.
  - id: co-2
    type: mcq
    skill: recall
    prompt: What did the so-called Edict of Milan (313) actually do?
    options:
      - text: It was a letter of Licinius, agreed with Constantine, granting freedom of worship to Christians and all others and ordering the return of confiscated Christian property.
        correct: true
        why: The text survives in Lactantius and Eusebius as a letter issued by Licinius to eastern governors.
      - text: It made Christianity the official religion of the empire.
        why: That came with Theodosius' legislation of 380 and later; the Milan text is about toleration.
      - text: It banned pagan sacrifice.
        why: Constantine may have restricted some forms of sacrifice later; the Milan agreement guaranteed freedom of worship to all.
      - text: It summoned the Council of Nicaea.
        why: Nicaea met in 325.
  - id: co-3
    type: short
    skill: causation
    prompt: Why did Constantine call the Council of Nicaea, and what did it decide?
    model: >-
      A dispute had broken out in Alexandria over the teaching of the priest Arius that the Son was created by the Father and therefore
      not co-eternal with him. Constantine wanted unity in the Church, which he saw as necessary for divine favour towards the empire and
      for public order. He summoned bishops to Nicaea in 325, where they adopted a creed declaring the Son "of the same substance"
      (homoousios) as the Father, condemned Arius, and also fixed a common date for Easter and issued disciplinary canons.
    rubric:
      - Explains the Arian dispute.
      - Explains Constantine's motive.
      - States the doctrinal decision (homoousios).
      - Mentions other decisions or consequences.
  - id: co-4
    type: order
    skill: chronology
    prompt: Put these events in order.
    items:
      - Constantine proclaimed at York
      - Galerius' edict of toleration
      - Battle of the Milvian Bridge
      - Agreement of Constantine and Licinius at Milan
      - Constantine defeats Licinius at Chrysopolis
      - Council of Nicaea
      - Dedication of Constantinople
      - Constantine baptised shortly before his death
    explain: 306; 311; 312; 313; 324; 325; 330; 337.
reading:
  - {ref: lactantius-creed-1984, note: 'On the Deaths of the Persecutors, with the earliest account of 312.'}
  - {ref: eusebius-vc-1999, note: 'Life of Constantine, translated with commentary by Averil Cameron and Stuart Hall.'}
  - {ref: barnes-1981, note: 'Constantine and Eusebius: a classic study.'}
  - {ref: barnes-2011, note: 'Constantine: Dynasty, Religion and Power, a reassessment.'}
  - {ref: lenski-2012, note: 'The Cambridge Companion to the Age of Constantine.'}
  - {ref: lane-fox-1986, note: 'Pagans and Christians, ending with Constantine.'}
  - {ref: cah-12}
inquiry:
  - Look at the Arch of Constantine. Why does its inscription speak of "the instigation of the divinity" without naming any god?
  - How did Constantine's legislation affect daily life (Sunday, crucifixion, gladiators, manumission in churches)?
  - Why did Constantine choose Byzantium for his new city?
---
## Historical context {#context}

When Constantius died at York in July 306, his army proclaimed his son Constantine, then in his early thirties. Constantine had been raised
at Diocletian's court and passed over in the succession of 305. Over the next eighteen years he defeated every rival and became sole
emperor. He was also the first emperor to support Christianity, an event that historians have described as one of the most consequential
turning points in the history of Europe and the Mediterranean.

:::stemma constantinian
:::

## Chronology {#chronology}

:::timeline
AD 306 | Constantine proclaimed at York | constantine-proclaimed
AD 310 | Maximian dies; Constantine claims descent from Claudius II and a vision of Apollo
AD 311 | Galerius' edict of toleration; Galerius dies | galerius-toleration
AD 312 | Battle of the Milvian Bridge; Maxentius killed | milvian-bridge
AD 313 | Constantine and Licinius agree at Milan; Licinius defeats Maximinus | milan-313
AD 314 | Council of Arles on the Donatist dispute
AD 316–317 | First war with Licinius
AD 324 | Licinius defeated at Chrysopolis; Constantine sole emperor | chrysopolis
AD 325 | Council of Nicaea | nicaea-council
AD 326 | Execution of Crispus and death of Fausta
AD 330 | Dedication of Constantinople | constantinople-founded
AD 337 | Constantine baptised and dies near Nicomedia
:::

## The road to Rome {#rise}

Constantine at first worked within the tetrarchic system, accepting the rank of Caesar from Galerius and marrying Maximian's daughter Fausta.
After Maximian's attempt to seize power in 310 and his death, Constantine claimed descent from the third-century emperor Claudius II, a
dynastic claim independent of the tetrarchy. A panegyric of 310 describes his vision of Apollo in a shrine in Gaul.

Maxentius, Maximian's son, controlled Italy and Africa from Rome. In 312 Constantine invaded Italy with a smaller army, defeated Maxentius'
forces at Turin and Verona, and marched on Rome. On 28 October Maxentius came out to fight at the Milvian Bridge over the Tiber; his army was
defeated and he drowned. Constantine entered Rome, disbanded the Praetorian Guard, which had supported Maxentius, and was recognised by the
Senate as senior Augustus.

## The vision {#vision}

Constantine believed, or came to believe, that he owed his victory to the Christian God. The two earliest accounts differ significantly.

:::source lactantius-vision
:::

:::source eusebius-vision
:::

:::check co-1
:::

:::claim contested
What, if anything, Constantine saw is unknowable. Some historians have suggested that a solar halo phenomenon underlies the story; others
treat the vision as Constantine's later interpretation of a less dramatic experience; still others regard the conversion as a gradual
process in which 312 was a moment of public commitment. The sources agree that by the end of 312 Constantine associated his victory with the
God of the Christians.
:::

The Arch of Constantine, dedicated by the Senate in 315, credits his victory to the "instigation of the divinity" (*instinctu divinitatis*),
an ambiguous phrase that pagans and Christians could both accept. Much of its sculpture was taken from monuments of Trajan, Hadrian and
Marcus Aurelius, with the faces recut as Constantine's. His coins continued to show Sol Invictus, the Unconquered Sun, until the 320s.

## Constantine and the Church {#church}

In early 313 Constantine and Licinius met at Milan and agreed a policy of religious freedom.

:::source milan-letter
:::

:::check co-2
:::

Constantine went much further than toleration. He gave the Church money, buildings and privileges: clergy were exempted from public duties;
bishops could hear civil cases if both parties agreed; manumission of slaves could take place in church; Sunday became a day of rest for
courts and urban workers (321). He built great churches: the Lateran basilica and St Peter's in Rome, and, with his mother Helena, churches
at the holy places of Palestine, including the Church of the Holy Sepulchre in Jerusalem.

He also became entangled in the Church's disputes. In North Africa, the Donatists refused to accept clergy who had handed over scriptures
during the persecution; Constantine referred the matter to councils of bishops (Rome 313, Arles 314), found against the Donatists, and for a
time tried to coerce them, without success.

### Nicaea

In Alexandria the priest Arius taught that the Son of God had been created by the Father and was therefore subordinate to him. His bishop,
Alexander, condemned him; the dispute spread across the East. After defeating Licinius in 324, Constantine summoned a council of bishops,
some 250–300 by various reckonings, to Nicaea in 325. He attended in person.

:::check co-3
:::

The creed adopted at Nicaea declared the Son *homoousios*, "of the same substance", with the Father. Arius was exiled. The settlement did not
end the controversy: Constantine soon readmitted Arius, and under his sons the empire's emperors and bishops would be divided over the
Nicene formula for half a century.

:::debate constantine-conversion
:::

## Constantine's own words? Documents in Eusebius {#documents}

Eusebius' *Life of Constantine* quotes in full more than a dozen letters and edicts that he presents as Constantine's own: letters to bishops, to the eastern provincials after the defeat of Licinius, and to the Persian king Shapur II, presenting the emperor as protector of the Christians in Persia. Because Eusebius wrote as a panegyrist, some modern scholars suspected that he had invented or rewritten them.

In 1954 A. H. M. Jones and T. C. Skeat pointed to a papyrus in the British Library, that preserves part of Constantine's letter to the provincials of Palestine, the same text Eusebius quotes. Its handwriting places the copy in the first half of the fourth century, probably within Constantine's lifetime, and it was made independently of Eusebius.{{ref:jones-skeat-1954}} Most historians now accept that the documents in the *Life* are substantially genuine, which makes them precious evidence for how Constantine wished to present himself: as a ruler chosen by God to end persecution and spread the true religion.

:::claim interpretation
Genuine documents still need interpretation. A letter written in the emperor's name was usually drafted by officials, and Eusebius selected which documents to include. They tell us how Constantine's government spoke about religion, which is not the same as telling us what he believed.
:::

## Sole emperor {#sole}

The alliance with Licinius, who ruled the East, broke down. A first war (316–317) cost Licinius most of the Balkans; in 324 Constantine
defeated him at Adrianople and Chrysopolis. Licinius, promised his life, was executed the following year. Constantine's propaganda
presented the war as a crusade against a persecutor, though Licinius' measures against Christians were limited.

Constantine's reign had its dark side. In 326 he had his eldest son Crispus executed, and soon afterwards his wife Fausta died, apparently
in an overheated bath; the reasons are unknown and the sources evasive. His laws were often savage: those who abducted girls were to be
burned alive, and nurses who helped them had molten lead poured down their throats.

## Helena in the Holy Land {#helena}

Constantine's mother, Helena, had been of humble origin, perhaps a stable-girl or innkeeper's daughter, and Constantius had set her aside for a politically useful marriage. Her son made her Augusta in 324. Soon afterwards, already elderly, she travelled to Palestine. Eusebius describes her journey as a pilgrimage of piety and generosity, distributing gifts to soldiers, the poor and prisoners, and credits her with founding churches at Bethlehem and on the Mount of Olives.{{anc:Euseb. Vit. Const. 3.41–47}}

Eusebius says nothing about the discovery of the True Cross. The story that Helena found it in Jerusalem first appears in writing in the 390s, notably in Ambrose's funeral speech for Theodosius in 395, and grew in the telling over the following centuries, with the miraculous identification of the true cross among three. Meanwhile the great church on the site of Christ's tomb in Jerusalem, which Eusebius attributes to Constantine's own initiative, became the centre of a new Christian geography of holy places, visited by pilgrims from across the empire (see [[lesson:christianisation#society|Christian empire, Christian society]]).

:::claim established
Comparing Eusebius' account with later versions shows how a tradition develops. Helena's journey and her church foundations are well attested; the finding of the Cross is a later legend, whatever relics were venerated in Jerusalem by the mid-fourth century.
:::

## Constantinople {#constantinople}

In 324 Constantine began to rebuild the Greek city of Byzantium on the Bosporus as a new imperial capital, dedicated on 11 May 330. Its site
commanded the crossing between Europe and Asia and the passage between the Black Sea and the Mediterranean, and lay between the Danube and
Euphrates frontiers. Constantine gave it a forum with a porphyry column topped by his statue, a hippodrome, palace, churches, a Senate, and a
grain dole modelled on Rome's. Statues were brought from all over the Greek world.

:::claim interpretation
Whether Constantine intended Constantinople as a "Christian" capital in contrast to pagan Rome has been debated. The city contained churches
but also temples (some reused) and classical statues, and its founding ceremonies drew on traditional rituals. Its Christian character
developed over the following generations; its importance as the eastern capital grew especially under Theodosius I.
:::

## Government, army and money {#government}

Constantine continued and modified Diocletian's reforms. He created a mobile field army (*comitatenses*) under new commanders, the masters of
infantry and cavalry, separate from frontier troops (*limitanei*). Praetorian prefects lost their military functions and became the highest
civil officials, each responsible for a large region. He introduced a new gold coin, the *solidus* (72 to the Roman pound), funded partly by
confiscated temple treasures, which remained stable for seven centuries. Zosimus, a pagan historian, blamed Constantine for weakening the
frontiers and for a new tax on traders.

:::check co-4
:::

## Consequences {#consequences}

Constantine was baptised by Eusebius of Nicomedia, a bishop sympathetic to Arius, shortly before his death in May 337, and was buried in the
Church of the Holy Apostles in Constantinople among memorials to the twelve apostles. His three surviving sons divided the empire after a
massacre of other male relatives. Within a century Christianity, still a minority religion in 312, had become the religion of the emperor,
the court and much of the population, and pagan sacrifice had been banned. A Christian Roman empire, with a capital at Constantinople,
would last until 1453.

:::debate christian-growth
:::

## Historiography {#historiography}

No figure in ancient history has been more fought over. Eusebius' *Life of Constantine* presents a pious Christian ruler; the pagan Zosimus
portrays a tyrant whose conversion was a way to escape guilt for murdering his son and wife; Jacob Burckhardt saw a calculating politician
using religion. Modern scholars, such as T. D. Barnes, accept a genuine early commitment to Christianity;{{ref:barnes-2011}} others
emphasise a gradual development and continued ambiguity in Constantine's public self-presentation.{{ref:lenski-2012}}

:::aside Coins as a barometer
Constantine's coinage offers a rough index of his public religion. Pagan imagery, especially Sol, continued on his coins until about 320–325.
The chi-rho appears occasionally from 315, on a helmet in a silver medallion from Ticinum, and more often in the 320s and 330s. Coins were
seen by more people than any other imperial message, and the slow shift suggests caution in public presentation, whatever Constantine's
private convictions.
:::
