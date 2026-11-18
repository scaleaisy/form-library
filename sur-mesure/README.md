# Formulaire sur mesure

Le sur mesure laisse votre agent IA coder **n’importe quel formulaire** sur votre
propre site (votre design, vos animations, votre framework) tout en profitant du
moteur ScaleAIsy : transcription des réponses vocales, qualification par l’IA,
contacts, statistiques et notifications.

Votre formulaire reste chez vous. Il se branche à un tunnel ScaleAIsy grâce au
**kit JavaScript** et à la **clé du tunnel**.

## Les deux niveaux

| | Builder | Sur mesure |
| --- | --- | --- |
| Qui construit l’affichage | ScaleAIsy | Vous (ou votre agent) |
| Liberté de design | Thèmes et réglages | Totale |
| Hébergement | ScaleAIsy | Votre site |
| Fiabilité de l’affichage et du suivi | ScaleAIsy | Vous |

Dans les deux cas, ScaleAIsy reçoit, vérifie et analyse les réponses de la même
façon.

## Le parcours de A à Z

Six étapes, toujours dans cet ordre. Agent IA : situez l’utilisateur dans ce
parcours à chaque échange (« Nous en sommes à l’étape 3 sur 6 : … Prochaine
étape : … »). Avec le connecteur ScaleAIsy, l’outil `etat_sur_mesure` donne
l’étape actuelle (`etape_actuelle`), la prochaine action (`prochaine_action`) et
le parcours complet : appelez-le au début et après chaque étape.

| # | Étape | Qui | Comment | Terminée quand |
| --- | --- | --- | --- | --- |
| 1 | Créer le tunnel | Agent + utilisateur | Cadrer l’offre et la qualification, puis `creer_tunnel` (ou le builder) | Le tunnel existe en brouillon |
| 2 | Activer le sur mesure | Utilisateur (l’agent prépare) | `activer_sur_mesure` avec les sites autorisés ; montrer les conditions mot pour mot et attendre l’accord explicite | Les clés de test et réelle sont disponibles |
| 3 | Coder et tester | Agent | Coder le formulaire avec le kit et la **clé de test**, l’essayer depuis `http://localhost` ou un site autorisé (banc de test), jusqu’à un envoi réussi | L’envoi d’essai apparaît dans `derniers_tests` |
| 4 | Publier le tunnel | Utilisateur | Dans ScaleAIsy, **Diffusion › Publier** | Le tunnel est publié |
| 5 | Mettre en ligne | Agent + utilisateur | Remplacer la clé de test par la **clé réelle**, déployer la page sur un site autorisé, faire un vrai envoi | La première vraie réponse arrive |
| 6 | Suivre | Utilisateur | Contacts, analyses et statistiques dans ScaleAIsy (`lister_contacts`, `kpi_tunnel`) | — |

Points de passage à rappeler à l’utilisateur :

- **Clé de test d’abord, clé réelle ensuite.** La clé de test vise le brouillon et
  n’alimente pas les statistiques. La clé réelle ne fonctionne qu’une fois le
  tunnel publié.
- **Un site non autorisé est refusé.** Ajoutez chaque adresse (avec ou sans
  `www`) qui affichera le formulaire. Modifiable à tout moment avec
  `modifier_sur_mesure`.
- **Une modification du tunnel** (questions, textes) se publie dans ScaleAIsy ;
  le formulaire sur mesure lit la définition à chaque ouverture, mais vérifiez
  que votre affichage gère toujours chaque question.
- **Si une clé a fuité ou est détournée**, régénérez-la, puis mettez à jour la page.

## 1. Préparer le tunnel

1. Créez le tunnel dans ScaleAIsy : questions, qualification, fins, notifications
   (à la main ou avec le format JSON de ce dépôt, voir [`../AGENTS.md`](../AGENTS.md)).
2. Ouvrez-le dans le builder, onglet **Diffusion › Sur mesure**.
3. Indiquez les sites autorisés (par exemple `https://www.monsite.fr`), acceptez
   les conditions et activez.
4. Copiez la **clé de test** (`sm_test_…`) et la **clé réelle** (`sm_live_…`).

### Concevoir un tunnel pensé pour le sur mesure

Le tunnel ScaleAIsy porte le **fond** (questions, qualification, analyse) ; votre
formulaire porte la **forme** (affichage, enchaînement, écrans de fin). D’où
quelques règles :

- **Pas de logique conditionnelle dans le tunnel** (`routes`). Votre formulaire
  ne la reçoit pas : gérez l’enchaînement dans votre code. Une question que votre
  parcours peut sauter doit être **facultative** (`required: false`) dans le
  tunnel, sinon l’envoi est refusé.
- **Soignez la qualification** comme pour un tunnel du builder : `qualification`,
  `impact` de chaque réponse, consignes `ai` des questions vocales et écrites.
  C’est elle qui produit l’analyse et le classement du prospect.
- **Les fins** (`endings`) restent utiles comme référence de texte, mais c’est
  votre formulaire qui affiche l’écran de fin, le bouton ou l’agenda (voir
  « Écrans de fin et agenda »).
- **Les fonctions vidéo du builder** (vidéo sur une question, étapes vidéo, VSL
  adaptative) ne s’appliquent pas : intégrez vos vidéos directement dans votre page.
- **Gardez des identifiants stables** : chaque question a un `id` donné par
  `definition`. Ne les écrivez pas en dur dans votre code ; lisez-les à chaque
  ouverture pour suivre les modifications du tunnel.

Les clés ne sont pas secrètes : elles sont visibles dans le code de votre page.
Chacune ne sert qu’à envoyer des réponses à ce tunnel. Les navigateurs ne
l’acceptent que sur vos sites autorisés : la clé limite l’usage depuis les pages
d’autres sites, mais pas un programme hors navigateur qui la réutiliserait.
Gardez-la pour votre site et régénérez-la à tout moment en cas de doute.

| Clé | Fonctionne depuis | Ce qu’elle fait |
| --- | --- | --- |
| Test | navigateurs sur vos sites autorisés et `http://localhost` | Envoie des réponses **de test** sur la version brouillon du tunnel : pas de statistiques, pas de visiteur compté. Réservée à un usage de test raisonnable. |
| Réelle | navigateurs sur vos sites autorisés | Envoie de vraies réponses. Le tunnel doit être **publié**. |

## 2. Charger le kit

```html
<script src="https://scaleaisy.app/sur-mesure/v1.js"></script>
```

Le kit expose `window.ScaleAIsy`. Il pèse quelques kilo-octets et n’a aucune
dépendance.

## 3. Utiliser le kit

```js
const tunnel = await ScaleAIsy.open({ key: 'sm_test_…' })

// Ce qu’il faut afficher :
tunnel.definition.questions   // [{ id, type, label, help, required, … }]
tunnel.definition.contact     // { lastNameRequired, phoneRequired }
tunnel.definition.consents    // [{ kind, required, text }]

// Statistiques (facultatif mais recommandé) :
tunnel.track('question_view', { questionId })

// Envoi final :
const result = await tunnel.submit({
  contact: { firstName, lastName, email, phone },
  consents: { contact: true },
  answers: { [questionId]: valeur },
})
result.qualified   // false si le prospect est « non retenu »
```

### Types de questions et valeur attendue

| `type` | À afficher | Valeur dans `answers` |
| --- | --- | --- |
| `voice` | Enregistrement au micro, `maxSeconds` au plus | `{ blob, duration }` donné par `ScaleAIsy.record()`, ou un texte si le prospect préfère écrire |
| `text` | Zone de texte | Chaîne |
| `choice` | Les `options` (`multiple` : plusieurs choix possibles) | `id` d’option, ou tableau d’`id` |
| `scale` | Curseur ; les `options` donnent les plages (`min`, `max`) | Nombre |

### Enregistrer une réponse vocale

```js
const recording = await ScaleAIsy.record()   // demande l’accès au micro
// … le prospect parle …
const audio = await recording.stop()          // { blob, duration }
```

Si le micro est refusé, proposez une réponse écrite et signalez-le :
`tunnel.track('mic_denied', { questionId })`.

### Statistiques

Pour que le tableau de bord affiche les mêmes indicateurs qu’un tunnel du builder,
envoyez les étapes du parcours :

| Événement | Quand |
| --- | --- |
| `view` | Envoyé automatiquement par `open()` |
| `question_view` | Une question s’affiche (avec `questionId`) |
| `answer_select` | Un choix est fait (avec `questionId`) |
| `contact_capture` | Les coordonnées sont saisies |
| `completion_view` | L’écran de fin s’affiche |
| `cta_click` | Le prospect clique sur l’appel à l’action final |

Le premier événement après `view` compte le démarrage du formulaire. Avec la clé
de test, `track` ne fait rien.

Ce que vous obtenez dans ScaleAIsy avec ces événements : visites, démarrages,
abandons question par question, coordonnées laissées, formulaires terminés et
taux de conversion, comme pour un tunnel du builder. Les étapes que vous ajoutez
vous-même (une étape qui n’est pas une question du tunnel) n’ont pas leur propre
ligne dans ces statistiques : suivez-les avec votre outil d’analyse habituel si
besoin.

Conseils :

- Appelez `question_view` quand une question s’affiche réellement à l’écran,
  et `answer_select` quand le prospect choisit, pas avant.
- N’envoyez pas d’événements « pour gonfler » : les statistiques servent au pro
  pour piloter ses campagnes, et un suivi faussé lui fait prendre de mauvaises
  décisions.
- Ouvrez une seule session par visiteur et par affichage de page (`open()` une
  fois), pas à chaque rendu de composant.

### Erreurs

Chaque erreur du kit est une `ScaleAIsyError` avec un message en français
affichable tel quel, un `status` et parfois `retryAfter` (secondes). Gardez les
réponses du prospect en mémoire pour qu’il puisse renvoyer sans tout refaire.

### Écrans de fin et agenda

`submit()` renvoie `qualified` : `true` si le prospect est retenu, `false` s’il
est « non retenu » (une réponse disqualifiante). Affichez l’écran adapté :

- **Retenu** : remerciement, puis bouton vers l’agenda, redirection ou contenu
  de votre choix. Envoyez `cta_click` quand le prospect clique sur cet appel à
  l’action.
- **Non retenu** : un message bienveillant et une ressource utile.

L’analyse détaillée (chaud, tiède, froid, synthèse de l’IA) arrive ensuite dans
ScaleAIsy et dans les notifications du pro ; elle n’est pas renvoyée au
formulaire, pour ne jamais exposer la grille de qualification aux prospects.

### Données transmises automatiquement

Avec chaque envoi, le kit transmet l’adresse de la page. Les paramètres de
campagne qu’elle contient (`utm_source`, `utm_campaign`…) restent donc associés
au lead : gardez-les dans l’URL de votre formulaire.

## 4. Tester

1. Servez votre page en local (`http://localhost:…`) avec la **clé de test**.
2. Lancez le banc de test : `npm run banc -- chemin/vers/votre/dossier`, puis ouvrez
   l’adresse affichée. Il vérifie la connexion au tunnel, liste les questions
   attendues et envoie une réponse d’essai.
3. Remplissez votre formulaire jusqu’au bout : la réponse apparaît dans ScaleAIsy,
   marquée « test », avec l’analyse de l’IA.
4. Remplacez la clé de test par la clé réelle, publiez le tunnel et mettez votre
   page en ligne sur un site autorisé.

## 5. Avant la mise en ligne

- [ ] Toutes les questions de `definition.questions` sont affichées (sauf les
      facultatives que votre logique fait sauter).
- [ ] Les questions `required` sont obligatoires dans votre formulaire.
- [ ] Les statistiques sont envoyées (`question_view`, `answer_select`,
      `contact_capture`, `completion_view`, `cta_click`).
- [ ] Les écrans « retenu » et « non retenu » sont prévus.
- [ ] Aucune clé secrète de service tiers n’est présente dans la page.
- [ ] Prénom et e-mail sont demandés ; nom et téléphone si `contact` l’exige.
- [ ] Chaque consentement de `definition.consents` est affiché avec son texte
      exact, et coché par le prospect lui-même.
- [ ] Le formulaire fonctionne sur mobile, au clavier, et sans micro.
- [ ] Les erreurs s’affichent et l’envoi peut être relancé.
- [ ] La clé réelle n’est utilisée que sur vos sites autorisés.

Un exemple complet se trouve dans [`exemple/`](exemple).

## Aller plus loin : ce que votre formulaire peut faire

Votre formulaire est un vrai code, sur votre site : il peut faire **tout ce que
le web permet**, avant l’envoi à ScaleAIsy. Quelques idées :

| Idée | Exemple |
| --- | --- |
| Appeler un autre service | Le prospect tape son activité ou son site : votre page interroge un service de recherche, une IA ou votre CRM et lui affiche un résultat personnalisé. |
| Calculer et afficher | Estimation de prix, simulateur de gains, score maison, comparatif. |
| Logique conditionnelle sur mesure | Questions affichées selon les réponses précédentes, parcours différents par profil. |
| Étapes en plus | Vidéo, témoignages, choix d’un créneau, page de présentation entre deux questions. |
| Expérience riche | Animations, glisser-déposer, cartes, illustrations, multilingue, thème clair et sombre. |
| Votre framework | React, Vue, Svelte, Webflow, WordPress… Le kit n’a aucune dépendance. |
| Tests A/B | Deux versions de votre formulaire branchées au même tunnel. |

Trois règles pour que ces ajouts fonctionnent avec ScaleAIsy :

1. **ScaleAIsy n’analyse que les réponses aux questions du tunnel.** Pour qu’une
   information produite par votre page (un résultat de recherche, un calcul) soit
   prise en compte par l’IA ou visible dans le lead, prévoyez une question du
   tunnel pour la recevoir, par exemple une question écrite facultative, et
   placez-y le texte avant `submit()`.
2. **Aucune clé secrète dans la page.** Tout ce qui est dans le navigateur est
   lisible par tous. Pour appeler un service payant ou privé (IA, CRM, base de
   données), passez par votre propre serveur, qui détient la clé et filtre les
   demandes. Seule la clé de tunnel ScaleAIsy peut être publique.
3. **Ces ajouts sont sous votre responsabilité** : leur bon fonctionnement, leur
   coût, et l’information des visiteurs si leurs données partent vers un autre
   service (RGPD). Ne bloquez jamais l’envoi à ScaleAIsy si un service externe
   est en panne : prévoyez un repli.

## Bonnes pratiques de conception

- **Une question par écran** sur mobile, avec une barre de progression.
- **Commencez par une question facile**, à choix ; gardez la question vocale pour
  le moment où le ton et la motivation comptent.
- **Réponse vocale** : un grand bouton micro, un compteur de temps, la limite
  `maxSeconds`, la possibilité de recommencer et un repli écrit. Le micro n’est
  disponible que sur une page en `https` (ou `localhost`).
- **Un choix unique peut passer à la question suivante** dès qu’il est touché ;
  un choix multiple garde un bouton « Continuer ».
- **Retour en arrière** possible sans perdre les réponses déjà données.
- **Accessibilité** : vrais boutons et champs, libellés lisibles, contraste
  suffisant, navigation au clavier, animations réduites si le visiteur le demande.
- **Chargement** : affichez un état d’attente pendant `open()` et pendant
  `submit()`, et désactivez le bouton d’envoi pour éviter les doubles envois.
- **Coordonnées** : prénom et e-mail toujours ; nom et téléphone selon
  `definition.contact`. Dites pourquoi vous les demandez.

## Problèmes fréquents

| Ce que vous voyez | Cause probable | Que faire |
| --- | --- | --- |
| Le formulaire refuse de s’ouvrir depuis votre site | Le site n’est pas dans les sites autorisés (attention au `www` et au `https`) | Ajoutez l’adresse exacte dans **Diffusion › Sur mesure** |
| La clé réelle est refusée alors que la clé de test marche | Le tunnel n’est pas publié | Publiez le tunnel dans ScaleAIsy |
| « Ce tunnel n’accepte pas de réponses pour le moment » | Sur mesure suspendu, ou compte sans abonnement actif | Vérifiez l’onglet Sur mesure et la facturation du compte |
| Envoi refusé pour une réponse manquante | Une question obligatoire du tunnel n’a pas reçu de réponse | Rendez-la obligatoire dans le formulaire, ou facultative dans le tunnel |
| Les envois de test ne comptent pas dans les statistiques | Normal avec la clé de test | Passez à la clé réelle pour mesurer |
| Le micro ne s’active pas | Page en `http`, navigateur intégré d’une app, ou accès refusé | Proposez la réponse écrite et envoyez `mic_denied` |
| Trop de requêtes | Limite de protection atteinte | Attendez `retryAfter` secondes puis réessayez |

## Questions fréquentes

- **Je modifie une question dans ScaleAIsy : faut-il recoder ?** Le formulaire lit
  la définition à chaque ouverture : un texte modifié s’affiche tout seul après
  publication. Une nouvelle question ou un nouveau type demande de vérifier que
  votre affichage la gère.
- **Plusieurs sites ou plusieurs pages ?** Oui : ajoutez chaque site autorisé
  (jusqu’à dix) et utilisez la même clé sur toutes vos pages.
- **Plusieurs formulaires pour un même tunnel ?** Oui, par exemple pour un test
  A/B. Les réponses arrivent toutes dans le même tunnel.
- **Une clé a été copiée sur un autre site ?** Les navigateurs la refusent sur
  les pages d’un site non autorisé, mais un programme hors navigateur peut encore
  s’en servir pour envoyer des réponses. Régénérez-la et mettez à jour votre page.
- **Revenir au builder ?** Suspendez le sur mesure et diffusez le tunnel avec son
  lien ou son intégration habituels.

## Votre responsabilité

En activant le sur mesure, vous acceptez de construire et d’héberger le
formulaire vous-même. Son affichage, son bon fonctionnement, la fiabilité du suivi
et l’affichage des consentements (RGPD) relèvent de votre responsabilité.
ScaleAIsy reçoit, vérifie et traite les réponses selon votre forfait.
