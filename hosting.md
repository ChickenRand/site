--user : on indique à l'utilisateur d'intervenir
-v : on spécifie la version alternative à utilisé
nano : editeur de texte
LVE manager est un plugin pour les panneaux de controle les plus populaire, Il permet de contrôler et de surveiller les limites, et de fixer des limites par base de paquet.

selectorctl --interpreter=ruby --user=$USER -v 2.4 : va nous donner la liste de toutes les versions d'interpréteur ruby disponibles dans le fichier

CRÉATION DE LA WEBAPP

On spécifie l'interpreteur, sa version, l'utilisateur, et on créer la webapp (remplacer ce qui est entre '<>' avec vos valeurs :
selectorctl --interpreter=ruby --user <username> -v 2.1.10 --create-webapp <projectname>
( warning not – but -)

selectorctl -i ruby --set-user-current=2.1 : définit la version spécifiée comme celle à utiliser pour cet utilisateur final.

nano ~/rubyvenv/site/2.1/bin/bundle : on rentre dans le fichier afin de le modifier

git clone https://github.com/ChickenRand/site.git

usr/bin/selectorctl --interpreter=ruby --version=2.1 --create-webapp

selectorctl --interpreter=ruby --enable-user-extensions=bundle site

Installation de l'application
Récupération du code

Mettez vous en ssh à la racine de votre serveur (sur o2switch il faut demander au service technique de mettre votre IP en liste blanche).

Récupérer le code via git en https :
git clone https://github.com/ChickenRand/site.git
Installation de bundler

Ajouter le gems bundle à votre projet o2switch :

selectorctl --interpreter=ruby --enable-user-extensions=bundle <projectname>
Configuration de bundler

Plusieurs interpréteur Ruby étant installés sur les serveurs o2switch, il faut utiliser celui de notre projet avec l'interpreteur Ruby de notre projet.

2 solutions :

    Soit préciser l'interpreteur à utiliser de cette manière :
    ~/rubyvenv/<projectname>/2.1/bin/ruby ~/rubyvenv/<projectname>/2.1/bin/bundle install
    Soit modifier le fichier bundle pour mettre le bon path dans shebang :

nano ~/rubyvenv/<projectname>/2.1/bin/bundle

# Changer la première ligne du fichier et mettre le bon binaire ruby de cette manière :

#!/home/<username>/rubyvenv/<projectname>/2.1/bin/ruby

Installation des dépendances

Aller dans le dossier de votre projet et tapper installer les dépendances via :

~/rubyvenv/<projectname>/2.1/bin/bundle install
Troubleshooting

Si vous avez des erreurs lié à l'impossibilité de créer des process, ceci est dut à une option activée sur les serveurs o2switch pour limité le shell bombing et il faut contacter le support technique pour la désactiver sur votre serveur.

INSTALATION DE DÉPENDANCE
~/rubyvenv/site/2.1/bin/bundle install : on installe les dépendance du projet
