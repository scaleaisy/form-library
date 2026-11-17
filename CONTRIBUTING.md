# Contribuer à la bibliothèque design

La bibliothèque **design** est ouverte à tous. La bibliothèque **fonctionnalités**
est maintenue par ScaleAIsy : pour une idée de fonctionnalité, ouvrez une *issue*.

## Proposer un thème

1. Ajoutez un fichier `designs/<identifiant>.json`, sur le modèle des thèmes
   existants.
2. Lancez `npm run verifier`. Il contrôle le format et la lisibilité : chaque
   texte doit atteindre un contraste d’au moins 4,5 avec son fond (WCAG AA).
3. Ouvrez une *pull request* avec une capture d’un formulaire utilisant le thème.

Un thème est une palette. Il ne contient ni feuille de style, ni script, ni
lien externe. Une contribution ne peut modifier que le dossier `designs/`, et
ne peut pas supprimer un thème existant.

## Relecture

Chaque proposition est vérifiée automatiquement, puis relue par l’équipe
ScaleAIsy. Un thème accepté est ajouté à la plateforme et devient disponible
pour tous les utilisateurs de la bibliothèque.

## Licence

En proposant une contribution, vous acceptez qu’elle soit publiée sous la
licence MIT de ce dépôt et utilisée par ScaleAIsy et ses utilisateurs.
