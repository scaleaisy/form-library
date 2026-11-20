# Concevoir un formulaire ScaleAIsy

Tu aides un utilisateur de ScaleAIsy à concevoir un formulaire de qualification
(on dit aussi « tunnel »).

**Connecté au connecteur ScaleAIsy ?** Lis d’abord la
[notice du connecteur](connecteur/README.md) : appelle `bien_demarrer`, fais le
check-up et propose un plan à l’utilisateur avant toute modification.

## Choisir le niveau

- **Builder** (par défaut) : ScaleAIsy affiche et héberge le formulaire. Le résultat
  est **un seul fichier JSON** conforme au format de ce dépôt. Suis la méthode
  ci-dessous.
- **Sur mesure** : l’utilisateur veut un formulaire entièrement libre sur son propre
  site (design, animations, framework). Crée d’abord le tunnel avec la méthode
  ci-dessous (questions, qualification, fins), puis code le formulaire en suivant
  [`sur-mesure/README.md`](sur-mesure/README.md). Rappelle à l’utilisateur qu’il
  est responsable de l’affichage, du suivi et des consentements de ce formulaire.
  Suis le **parcours en six étapes** de ce guide et dis toujours à l’utilisateur
  où il en est et ce qui vient ensuite (outil `etat_sur_mesure` du connecteur).
  Présente-lui aussi ce que son formulaire peut faire de plus que le builder
  (section « Aller plus loin ») et les règles qui vont avec.

## Méthode

1. **Cadre l’objectif** avec l’utilisateur avant d’écrire : son offre, sa cible,
   le prix ou l’engagement demandé, ce qui disqualifie un prospect, et ce qui doit
   se passer à la fin (prise de rendez-vous, ressource, simple prise de contact).
2. **Lis [`CATALOGUE.md`](CATALOGUE.md).** N’utilise que les fonctionnalités
   marquées `spec`. Celles marquées `builder` se règlent ensuite dans l’interface :
   signale-les à l’utilisateur s’il en a besoin.
3. **Pars d’un exemple** de [`exemples/`](exemples), puis adapte-le.
4. **Valide** avec `npm run valider -- fichier.json` et corrige jusqu’à zéro erreur.
5. **Envoie le formulaire** avec l’outil `creer_tunnel` du connecteur ScaleAIsy.
   Lis d’abord l’outil `format_tunnel`, qui donne la version à jour du format.
   Le formulaire arrive en brouillon : donne à l’utilisateur le lien renvoyé.

## Configurer le compte

Pour régler le compte (identité, panier moyen, contexte de qualification, profils
idéal, à nourrir et à écarter), suis [`compte/README.md`](compte/README.md) : il
donne un gabarit et une longueur conseillée pour chaque champ. Des textes riches
et précis donnent une qualification juste ; une phrase courte ne suffit pas.

## Bonnes pratiques

- **Court d’abord** : 3 à 6 questions suffisent le plus souvent. Commence par une
  question facile, à choix.
- **Une question vocale au bon moment** : celle où le ton et la motivation
  comptent (objectif, situation, urgence). Trois au plus.
- **Qualifie à chaque question.** Pour un choix, donne un `impact` à chaque
  réponse. Pour une question vocale ou écrite, décris dans `ai` la réponse
  idéale, peu intéressante et disqualifiante.
- **Éliminatoire avec parcimonie** : `disqualifying` envoie vers la fin « non
  retenu ». Réserve-le aux critères vraiment rédhibitoires.
- **Logique conditionnelle** : sur une question à choix unique, `routes` envoie un
  choix vers une question **placée plus loin** ou vers `"end"`. Ajoute toujours
  `defaultNext`.
- **Contact** : avant les questions pour capter un maximum de prospects, après
  pour un parcours plus engageant.
- **Fins** : soigne les deux. La fin « non retenu » doit rester bienveillante et
  proposer une ressource utile.
- **Design** : choisis un thème de [`designs/`](designs) avec `design.preset`.
  Ajuste au besoin une couleur, en gardant un texte lisible.
- **Formats vidéo** : `immersive` et `fullPage` exigent une vidéo, que
  l’utilisateur ajoute dans le builder. Sans vidéo, utilise `classic`.
- **Vidéos et Vidéothèque** : le format ne porte pas de lien vidéo. L’utilisateur
  choisit ses vidéos dans le builder (bouton « Vidéothèque » à côté de chaque
  champ vidéo) ou les ajoute dans l’onglet Vidéothèque (lien MP4 direct en https,
  nom, dossier). Pour réutiliser une vidéo, garde le même lien : ScaleAIsy n’en
  héberge qu’une copie, quel que soit le nombre de tunnels. Elle n’est hébergée
  (lecture rapide, image d’aperçu à 3 secondes sur la première étape) que tant
  qu’un tunnel **publié** l’utilise : rappelle à l’utilisateur de publier le tunnel.

## Langue

Écris les textes dans la langue du public visé (`language` : `fr`, `en`, `es`
ou `de`). Vouvoie par défaut en français.
