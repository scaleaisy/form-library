# Bibliothèque de formulaires ScaleAIsy

Ce dépôt apprend à votre agent IA (Claude Code, Codex, Cursor…) à concevoir un
formulaire ScaleAIsy complet et conforme : questions vocales ou écrites,
qualification par l’IA, logique conditionnelle, fins « retenu » et « non retenu »,
agenda et design.

Deux niveaux au choix :

- **Builder** : votre agent décrit le formulaire dans un fichier JSON. ScaleAIsy le
  crée en **brouillon** dans votre compte, l’affiche et l’héberge.
- **Sur mesure** : votre agent code le formulaire de vos rêves sur votre propre
  site et le branche à un tunnel ScaleAIsy avec le kit JavaScript. Voir
  [`sur-mesure/`](sur-mesure).

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
| [`designs/`](designs) | Les thèmes de couleurs du builder. |
| [`sur-mesure/`](sur-mesure) | Guide, exemple et banc de test des formulaires sur mesure. |
| [`src/`](src) | Le format officiel et le validateur. |

## Valider un formulaire hors ligne

Il faut Node.js 24 ou plus récent.

```bash
npm install
npm run valider -- mon-formulaire.json
```

Le validateur applique exactement les mêmes règles que ScaleAIsy et explique
chaque erreur.

## Tester un formulaire sur mesure

```bash
npm run banc -- chemin/vers/votre/formulaire
```

Le banc sert votre formulaire en local et vérifie son branchement au tunnel avec
la clé de test. Détails dans [`sur-mesure/README.md`](sur-mesure/README.md).

## Contributions

Le dépôt est maintenu par ScaleAIsy. Une idée ou un problème ? Ouvrez une *issue*.
Voir [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Licence

MIT. Voir [`LICENSE`](LICENSE).
