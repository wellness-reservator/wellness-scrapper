wellness-scrapper
=================

Permet de récupérer toutes les salles et toutes les cours de wellness.
S'enregistre dans une base sqlite par défaut.


# Installation

```sh
$ yarn
```

# Lancer le scrap

Pour lancer la récupération des données, il faut définir 2 variables d'environnements :
 - WELLNESS_USER: votre compte dans wellness
 - WELLNESS_PASSWORD: votre mot de passe dans wellness

ex d'utilisation:

```sh
$ WELLNESS_USER=toto@gmail.com WELLNESS_PASSWORD=titi yarn start
```