--user : on indique à l'utilisateur d'intervenir
-v : on spécifie la version alternative à utilisé
nano : editeur de texte
LVE manager est un plugin pour les panneaux de controle les plus populaire, Il permet de contrôler et de surveiller les limites, et de fixer des limites par base de paquet.

selectorctl --interpreter=ruby --user=$USER -v 2.4 : va nous donner la liste de toutes les versions d'interpréteur ruby disponibles dans le fichier

selectorctl --interpreter=ruby --user andreaslive -v 2.1.10 --create-webapp site ( warning not – but -) : on specifie l'interpreteur, l'utilisateur, la version et on créer la webapp

selectorctl --interpreter=ruby --user andreaslive -v 2.1.10 --create-webapp --list

selectorctl -i ruby --set-user-current=2.1 : définit la version spécifiée comme celle à utiliser pour cet utilisateur final.

PATH=$PATH:~/rubyvenv/site/2.1/bin

nano ~/rubyvenv/site/2.1/bin/bundle : on rentre dans le fichier afin de le modifier

yum install lvemanager : on installe le plugin lvemanager

git clone git@github.com:ChickenRand/site.git

git clone https://github.com/ChickenRand/site.git

usr/bin/selectorctl --interpreter=ruby --version=2.1 --create-webapp /home/andreaslive/site/www.chickenrand.org/

selectorctl --interpreter=ruby --enable-user-extensions=bundle site

~/rubyvenv/site/2.1/bin/bundle install : on installe bundle
