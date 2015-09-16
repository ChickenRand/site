FAQ
===

# Qu'est ce que ChickenRand ?

ChickenRand est un projet de recherche appliquée portant sur l'influence de l'intention sur la matière. On pourrait donc le rapporter à ce que l'on appelle communément de la parapsychologie, bien que ce terme soit constament décrié et considéré par ses détracteurs comme de la "pseudo science".

Nous n'avons pas pour vocation première de produire un travail de recherche scientifique menant à des publications. D'autres personnes (voir section suivante) l'ont fait avant nous.

Nous avons un objectif que l'on pourrait qualifier d'ingénieurie et nous partons du principe que le phénomène, bien que difficilement décelable, est réel. Nous cherchons donc à trouver des moyens de déceler plus efficacement et plus rapidement le phénomène dans le but d'y trouver des applications pratiques.

# Sur quelles études se basent ces recherches ?

Nous nous basons principalement sur les recherches du [PEAR](http://www.princeton.edu/~pear/pdfs/), laboratoire américain qui a étudié le phénomène pendant plus de 30 ans.

Une autre de nos inspirations est [la thèse de René Peoc'h](http://psiland.free.fr/savoirplus/theses/peoch.pdf) portant sur l'influence de l'intention humaine et [animale sur un petit robot se déplacant aléatoirement](http://www.dailymotion.com/video/xb6zgf_l-esprit-et-la-matiere_tech).
[![Vidéo de présentation des travaux de René Peoc'h](http://s1.dmcdn.net/bfc8/220x124-Osi.jpg)](http://www.dailymotion.com/video/xb6zgf_l-esprit-et-la-matiere_tech)

Sans oublier bien sûr les travaux de Dean Radin avec le [Global Consciousness Project](http://noosphere.princeton.edu/).

# Quelles pourrait être les applications de vos recherches ?

Il est encore trop tôt pour le dire car il se peut que l'on arrive pas à aller plus loin que de constater que le phénomène existe ou n'existe pas sans pouvoir y déceler des "patterns" et donc sans pouvoir "utiliser" un tel phénomène.

Mais si nous arrivons à savoir quand une personne tente d'influencer le générateur, alors là, les possibilités sont illimitées et l'on peut imaginer toutes sortes de dispositifs.
Le domaine d'application le plus important serait sans doute la santé.

# Qu'est ce qu'un générateur de nombres aléatoires (GNA) ?

Un générateur de nombres aléatoire est un dispositif électronique dont le fonctionnement est similaire à une machine qui tirerait à pile ou face plusieurs centaines de fois par seconde.
Pile représenterait 1 et face 0.
Cette machine est faite de telle manière qu'il est théoriquement impossible de prédire quel sera le résultat (pile ou face) du prochain lancé mais nous pouvons assurer que satistiquement, les chances d'avoir pile ou face sont égale (p=0,5). Enfin, si personne n'essaie de l'influencer...

# Quel modèle de GNA utilisez-vous ?

Pour l'instant nous utilisons un dispositif fait maison basé sur les plans de [Giorgio Vazzana](http://holdenc.altervista.org/avalanche/).

Nous planifions d'utiliser très prochainement un générateur [OneRNG](http://onerng.info/) dès qu'ils seront de nouveau commercialisables.

# Pourquoi ne pas simplement utiliser la fonctione rand() d'un ordinateur ou /dev/urandom ?

Nous avons besoin de nombre dont la source d'entropie est assurée, c'est pour cela que nous nous basons sur un dispositif physique conçu explicitement pour cet usage.

De plus, la plupart des sources d'entropie (il y en a dans les processeurs, les disques durs ou autres) sont ensuite passé dans des algoritmes dits de "debiaisage" pour éliminer un éventuel biais (lié au dispositif physique lui même) et ainsi assurer des nombres aléatoires de meilleure qualité. Le problème c'est que nous essayons de déceler un tel biais, de tels algoritmes empêcheraient donc d'obsverver le phénomène que nous recherchons.

OneRNG étant un dispositif open source et open hardware, nous avons la possibilité de récupérer les nombres bruts avant qu'ils passent par une phase de débiaisage.

# Vous ne faites donc aucune phase de débiaisage ?

Si, mais nous tâchons de la réduire à son strict minimum afin d'éliminer un éventuelle biais trop grossier de la machine tout en gardant la possibilité de déceller un effet sur les nombres.

Nous appliquons un simple XOR sur les pairs de bit que nous générons.

C'est ce qui était effectué dans les recherches du PEAR. Cette pratique est en effet questionnable mais nous n'avons, pour l'instant, pas trouvé de solutions plus satisfaisante.
Si vous êtes un spécialiste de la question et que vous avez des idées, n'hésitez pas à nous contacter. Nous sommes preneurs de tous conseils !

Plus d'informations [ici](http://noosphere.princeton.edu/xor.html) et [la](http://noosphere.princeton.edu/reg.html) à ce sujet.

# Comment est-ce possible, cela viole les lois de la physique ?

Les "lois" de la physique ont évolué a travers les siècles et rien ne dit que nous n'allons pas découvrir de nouvelles exceptions qui nécessiteront de revoir les bases de la physique. Après tout, la théorie de la relativité d'Einstein ou la physique quantique ont révolutionner notre vision de la matière. Cette dernière accorde même un rôle prépondérant à l'observateur, le fait même d'observer agirait sur la matière.

# Que signifie ChickenRand ?

C'est un étudiant d'Epitech qui a trouvé ce nom.
ChickenRand est un jeu de mot entre le film ChickenRun et le mot "Random" en anglais qui signifie aléatoire. Pourquoi avoir pris cette référence ? Car l'expérience qui a motivée ce travail de recherche a été mené avec des poussins (Chicken en anglais signifie poussin).

# Pourquoi avez-vous besoin de ces informations lors de l'inscription ?

Les recherches du PEAR ont montré que le sexe de la personne, sa croyance ou non dans le phénomène jouaient un role déterminant dans les résultats. Nous pensons que d'autres facteurs comme la latéralité, la pratique de la méditation, ce que l'on a mangé ou bu avant l'expérience peuvent jouer un rôle tout aussi important et nous tâchons donc de récolter un maximum d'informations.