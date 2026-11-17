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

Les clés ne sont pas secrètes : elles sont visibles dans le code de votre page.
Chacune ne fonctionne que pour ce tunnel et depuis vos sites autorisés. Vous
pouvez les régénérer à tout moment.

| Clé | Fonctionne depuis | Ce qu’elle fait |
| --- | --- | --- |
| Test | vos sites autorisés et `http://localhost` | Envoie des réponses **de test** sur la version brouillon du tunnel : pas de statistiques, pas de visiteur compté. Limitée à quelques dizaines d’envois par jour. |
| Réelle | vos sites autorisés | Envoie de vraies réponses. Le tunnel doit être **publié**. |

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

### Erreurs

Chaque erreur du kit est une `ScaleAIsyError` avec un message en français
affichable tel quel, un `status` et parfois `retryAfter` (secondes). Gardez les
réponses du prospect en mémoire pour qu’il puisse renvoyer sans tout refaire.

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

- [ ] Toutes les questions de `definition.questions` sont affichées, dans l’ordre.
- [ ] Les questions `required` sont obligatoires dans votre formulaire.
- [ ] Prénom et e-mail sont demandés ; nom et téléphone si `contact` l’exige.
- [ ] Chaque consentement de `definition.consents` est affiché avec son texte
      exact, et coché par le prospect lui-même.
- [ ] Le formulaire fonctionne sur mobile, au clavier, et sans micro.
- [ ] Les erreurs s’affichent et l’envoi peut être relancé.
- [ ] La clé réelle n’est utilisée que sur vos sites autorisés.

Un exemple complet se trouve dans [`exemple/`](exemple).

## Votre responsabilité

En activant le sur mesure, vous acceptez de construire et d’héberger le
formulaire vous-même. Son affichage, son bon fonctionnement, la fiabilité du suivi
et l’affichage des consentements (RGPD) relèvent de votre responsabilité.
ScaleAIsy reçoit, vérifie et traite les réponses selon votre forfait.
