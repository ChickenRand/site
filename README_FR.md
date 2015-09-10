# Introduction

L'esprit peut-il influencer la matière ?

C'est à cette question que tente de répondre ChickenRand, projet de recherche appliquée consistant en des expériences sur internet basées sur des mini jeux.

Mais avant d'aller plus loin, laissez moi vous raconter une histoire...

# Le PEAR

## Présentation

Celle de Robert G. Jahn, l'un des plus grands experts au monde sur la propulsion à réaction et Brenda Dunne, psychologue, qui en 1979 fondèrent le laboratoire de recherche sur les anomalies électroniques de Princeton (le PEAR), financé par la présitigieuse université qui accueilla à l'époque Albert Einstein.

Le but du PEAR était d'étudier l'influence de l'esprit humain sur les dispositifs électroniques.

Ils ont eu l'idée d'utiliser des générateurs de nombres aléatoires, sortent de machine à faire pile ou face plusieurs centaines de fois par seconde, et de voir si une personne pouvait en modifier le comportement.

En temps normal, une telle machine génère statistiquement autant de 1 que de 0, on a donc 1 chance sur 2 d'avoir un 1 et 1 chance sur 2 d'avoir un 0.

Mais s'ils demandaient à une personne de se concentrer sur la machine pour qu'elle génère plus de 1, aussi bizarre que cela puisse paraitre, elle générait plus de 1 sur de très longues séries (à raison de 2 ou 3 un en plus par mille).

Pendant presque 30 ans le PEAR à étudié ce phénomène en fabriquant toutes sortes de machines, en s'efforcant d'éliminer tous les biais possibles de l'expérience (d'éventuelles ondes, de la chaleur ou tout autres éléments qui aurait pu perturber la génération de nombres) et d'y trouver une explication.

## Conclusions du PEAR

Leur conclusion est sans appel : l'esprit est bien capable d'influencer, de manière très minime la matière. 
Mais le phénomène comportent plusieurs caractéristiques atypiques :
* Difficulté de reproduction : toutes leurs expériences n'ont pas donné des résultats aussi possitifs mais il y a toujours des éléments intriguants.
* Non localité : peu importe où se trouve le générateur de nombres aléatoires (même à des milliers de kilomètres), une personne peut avoir une influence dessus.
* Différences entre individus : les hommes et les femmes n'obtenaient pas les mêmes résultats et certaines personnes étaient plus douées que d'autres.
* Importance de l'attachement émotionnel : plus une personne était impliquée dans l'expérience, plus elle était "attachée" au dispositif et plus les résultats étaient positifs. De même, si deux personnes avec un fort attachement mutuelle (un couple par exemple), elles avaient plus de chances d'obtenir de bons résultats.

## Fermeture du laboratoire

Malgré le sérieu des recherches et l'intégrité de leurs auteurs, les travaux scientifiques du PEAR n'ont pu paraitre dans aucunes grandes revues scientifiques à commité de lecture, pour la simple et bonne raison que l'objet même de leur recherche était rejeté *a priori*.
Leurs confrères ne voulant pas considérer comme scientifique une telle question.
La [page wikipédia anglaise](https://en.wikipedia.org/wiki/Princeton_Engineering_Anomalies_Research_Lab) du laboratoire est toujours très critique à son égard...
Pourtant, la physique quantique a démontrée depuis presque un siècle le rôle primordiale de la conscience sur le façonnement de notre réalité.
Le PEAR a donc malheureusement fermé ses portes en 2007, fatigué d'essayer de faire reconnaître un phénomène démontrer statistiquement des dizaines de fois.

Pour Dr. Jahn : "il est temps que quelqu'un trouve quelles sont les implications de ces résultats pour la culture humaine..."

Je partage cet avis et c'est justement le but du projet ChickenRand.

# ChickenRand

## Motivations

J'ai pris le parti de croire aux résultats du PEAR (et aussi aux résultats d'autres expériences menées avec des générateurs de nombres aléatoires) même si pour l'instant, aucun modèle physique n'est compatible avec leurs conclusions.
Et comme on dit si bien : "Si on avait attendu de comprendre la combustion pour construire des automobiles, on serait encore en train d'utiliser les chevaux."

Nous chercons ici à étudier le phénomène dans le but d'en trouver des usages pratiques et de développer des technologies ou des méthodes permettant d'améliorer notre quotidien.

## De la recherche ouverte

ChickenRand est un projet de recherche à but non lucratif sous l'égide d'une association d'intérêt générale ce qui fait qu'il est possible de déduire vos dons de vos impôts à hauteur de 60%.

C'est aussi un projet entièrement libre et open source ce qui fait que tout le monde peut facilement reproduire les conditions d'expérimentation chez lui et étudier la manière dont sont traitées les données.

## Un site internet et une application smartphone

Concrétement, il s'agit d'un site internet et d'une application smartphone sur lequel tout le monde est invité à créer un compte et à participer à des expériences similaires à celles du PEAR mais de chez eux.
Notre serveur étant relié à un ensemble de générateurs de nombres aléatoires servant aux expériences.

## Aller plus loin que le PEAR

Dans bien des points, nous nous inscrivons dans la démarche du PEAR mais nous souhaitons aller plus loin. Tout d'abord en proposant à quiconque le souhaite de participer aux expériences devant son ordinateur  ou son smartphone puis en proposant des expériences à fort attachement emotionnel.

## Le jeu vidéo comme outil

Là où le PEAR demandait simplement aux participants de générer plus de 1 ou plus de 0, nous proposons aux utilisateurs du site de jouer à des jeux vidéo en supposant que l'attachement émotionnel à l'expérience en sera accru.

Ces jeux seront simples pour transcrire une volonté comme faire plus de 1 (par exemple, faire monter un personnage vers le haut) ou diriger un robot qui se déplace aléatoirement (jeu où l'on déplace un robot en utilisant les touches).

De plus, nous comptons rendre disponible en direct les résultats des utilisateurs afin qu'ils puissent voir leur courbe d'évolution et se sentir ainsi plus impliqué dans le processus. La mise en concurrence des utilisateurs permettra aussi une émulation qui, nous l'espérons, sera bénéfique pour les résultats.

## Où en est le projet

### Phase 1

J'ai déjà construit un premier générateur de nombres aléatoire et mis au point un site internet sur lequel plusieurs centaines d'expériences ont été menées. Les résultats semble intéressant et nécessite que l'on se penche plus dessus.

### Phase 2

Cette première avancée est encourageante, mais j'aimerai utiliser du matériel plus fiable et plus performant, à savoir un générateur de nombres aléatoire Open Source et Open Hardware qui se branche directement par USB : le OneRNG.

J'aimerai aussi pouvoir faire passer les expériences à un nombre beaucoup plus important de personnes pour avoir des statistiques aussi vastes que possible. Pour cela, il faut plus de générateur de nombres aléatoires car il ne peut y avoir qu'une expérience en simultané pour l'instant, faute de moyens.

L'aspect graphique du site, de l'application et des jeux nécessite un soin constant et de vraies compétences dont seul un graphiste professionnel peut s'occuper.

Enfin, j'ai beaucoup d'idée de jeux vidéo, d'analyse statistiques et cela prend du temps, temps que je ne peux consacré au projet s'il n'est pas financé.

C'est pourquoi nous avons besoin de vous pour financer le projet et le faire aller encore plus loin.

### Et après ?

Qui sait ce que ces expériences vont nous reveler, il n'y a pas de limite aux applications que l'on pourrait imaginer. Cela va du simple interrupteur que l'on actionne par la pensée a des systèmes d'assistance aux personnes en situation de handicap en passant par des outils de développement personnel.