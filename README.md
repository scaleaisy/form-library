# Bibliothèque de formulaires ScaleAIsy

Ce dépôt apprend à votre agent IA (Claude Code, Codex, Cursor…) à concevoir un
formulaire ScaleAIsy complet et conforme : questions vocales ou écrites,
qualification par l’IA, logique conditionnelle, fins « retenu » et « non retenu »,
agenda et design.

Votre agent décrit le formulaire dans un fichier JSON. ScaleAIsy le crée ensuite
en **brouillon** dans votre compte : vous le relisez, puis vous le publiez.

## Démarrer en 3 étapes

1. **Connectez votre agent à ScaleAIsy** depuis votre espace :
   *Paramètres › Connecteurs* sur [scaleaisy.app](https://scaleaisy.app/dashboard/connecteurs).
2. **Donnez-lui ce dépôt** :
   > Lis https://github.com/scaleaisy/form-library, puis crée-moi un tunnel ScaleAIsy
   > pour [votre offre, votre cible, votre objectif].
3. **Relisez le brouillon** dans le builder ScaleAIsy, ajoutez vos vidéos si besoin,
   puis publiez.

## Ce que contient le dépôt

| Dossier | Contenu |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | La méthode de conception, à lire par l’agent. |
| [`CATALOGUE.md`](CATALOGUE.md) | Tout ce qu’un formulaire sait faire, et les thèmes disponibles. |
| [`schema/formulaire.schema.json`](schema/formulaire.schema.json) | Le format, en JSON Schema. |
| [`exemples/`](exemples) | Des formulaires complets et valides. |
| [`designs/`](designs) | La bibliothèque design : un fichier par thème. |
| [`src/`](src) | Le format officiel et le validateur. |

## Valider un formulaire hors ligne

Il faut Node.js 24 ou plus récent.

```bash
npm install
npm run valider -- mon-formulaire.json
```

Le validateur applique exactement les mêmes règles que ScaleAIsy et explique
chaque erreur.

## Deux bibliothèques

- **Fonctionnalités** : ce que le formulaire sait faire. Elle est maintenue par
  ScaleAIsy. Une idée ? Ouvrez une *issue*.
- **Design** : des thèmes visuels, ouverts aux contributions. Voir
  [`CONTRIBUTING.md`](CONTRIBUTING.md). Un thème accepté devient disponible pour
  tous les utilisateurs de la bibliothèque.

## Licence

MIT. Voir [`LICENSE`](LICENSE).
