# Configurer le compte ScaleAIsy

Ce guide sert à l’agent qui règle le compte d’un utilisateur avec l’outil
`configurer_compte` du connecteur ScaleAIsy. Lisez d’abord `options_compte` : il
donne les valeurs actuelles, les niches disponibles et la longueur maximale de
chaque champ.

## Pourquoi c’est important

Le **contexte de qualification** est lu par l’IA de ScaleAIsy à chaque nouveau
lead : c’est lui qui décide si un prospect est chaud, tiède, froid ou écarté, et
ce qui est écrit dans la fiche du lead. Il est aussi repris par défaut dans
chaque nouveau tunnel.

Une phrase de 15 mots donne une qualification vague. Un texte précis, avec des
signaux concrets, donne une qualification juste et des fiches utiles au
commercial. **Visez des contenus riches** : la longueur conseillée est indiquée
pour chaque champ ci-dessous.

## Méthode

1. **Interrogez l’utilisateur avant d’écrire** si l’information manque : son
   offre exacte, son prix, son client idéal réel (un exemple de bon client
   passé), ce qui lui fait perdre du temps, et ce qui doit se passer après le
   formulaire. Ne remplissez jamais un champ avec des généralités.
2. **Partez de ce qui existe** (`options_compte`) : enrichissez, ne remplacez
   pas un texte précis par un texte plus court.
3. **Écrivez des signaux observables** : ce que le prospect dit, possède, a
   déjà fait, son budget, son délai, ses outils. Évitez les adjectifs
   (« motivé », « sérieux ») sans preuve associée.
4. **Gardez la même cible partout** : le profil idéal, le profil à nourrir et le
   profil à écarter doivent se compléter sans se contredire.
5. **Montrez la proposition** à l’utilisateur. Elle arrive dans ScaleAIsy en
   attente de validation : il peut retoucher chaque texte avant de valider.

## Identité et données d’analyse

| Champ | Ce qu’il faut fournir |
| --- | --- |
| `nom_business` | Le nom commercial tel que les prospects le connaissent. |
| `nom_affiche` | Le nom de la personne qui utilise le compte (prénom et nom, ou nom de l’équipe). Il s’affiche dans l’application. |
| `couleur_marque` | La couleur principale de la marque, au format `#RRGGBB`. |
| `panier_moyen` | Le montant moyen d’une vente, en euros HT, sans texte. |
| `taux_closing` | Le pourcentage de rendez-vous qui se transforment en vente. |
| `marche` et `niche` | Toujours ensemble, avec une valeur donnée par `options_compte`. |

## Contexte de qualification, champ par champ

Chaque gabarit se remplit avec les mots de l’utilisateur. Les crochets
indiquent ce qu’il faut remplacer. Les exemples portent sur une agence
d’automatisation marketing : adaptez-les, ne les recopiez pas.

### `contexte.offer` · Votre offre

**Longueur conseillée** : 500 à 1 200 caractères.

**Gabarit**

> [Nom de l’offre] aide [cible précise] à [résultat mesurable] en [délai].
> Elle comprend : [livrable 1], [livrable 2], [livrable 3].
> Format : [accompagnement, prestation, logiciel…], [durée], [à distance ou sur place].
> Ce qui la distingue : [différence concrète face aux alternatives].
> Elle ne convient pas pour : [cas hors périmètre].

**Exemple**

> Programme « Agence pilotée » : nous aidons les agences et indépendants du
> marketing à automatiser leur suivi commercial dans GoHighLevel, pour ne plus
> perdre un lead entre le formulaire et le rendez-vous. En 6 semaines : audit des
> tunnels, mise en place du CRM et des relances, agenda connecté, tableau de bord
> des ventes. Accompagnement en visio, deux séances par semaine, accès aux
> modèles. Différence : nous livrons le système configuré, pas une formation. Ne
> convient pas pour créer une offre de zéro.

### `contexte.target_audience` · Le prospect recherché

**Longueur conseillée** : 400 à 1 000 caractères.

**Gabarit**

> [Type d’entreprise ou de personne], [taille ou chiffre d’affaires],
> [secteur], [situation actuelle]. Ses problèmes : [problème 1], [problème 2].
> Il a déjà : [outils, équipe, ventes existantes]. Il cherche : [résultat].
> Il décide : [seul, avec un associé…], en [délai habituel].

### `contexte.price_or_commitment` · Prix ou engagement moyen

**Longueur conseillée** : 100 à 400 caractères.

**Gabarit**

> [Montant] € HT [en une fois, par mois pendant X mois], [options de paiement].
> Engagement attendu : [temps à consacrer par semaine, durée].

### `contexte.hard_disqualifiers` · Critères réellement bloquants

**Longueur conseillée** : 300 à 900 caractères.

N’y mettez que ce qui rend la vente impossible, pas ce qui la rend difficile.

**Gabarit**

> Écarter si : [critère 1 vérifiable], [critère 2 vérifiable], [critère 3].
> Ne pas écarter pour : [faux critère fréquent, ex. « budget à confirmer »].

### `contexte.desired_action` · Action attendue

**Longueur conseillée** : 100 à 500 caractères.

**Gabarit**

> Après le formulaire, un prospect retenu doit [réserver un appel de X minutes,
> recevoir un devis…]. Un prospect à nourrir reçoit [ressource]. Un prospect
> écarté reçoit [réponse bienveillante, ressource gratuite].

### `contexte.closing_priorities` · Priorités commerciales

**Longueur conseillée** : 600 à 1 600 caractères.

**Gabarit**

> À traiter en priorité : [profil prioritaire], qui [signal 1] et [signal 2].
> Signaux d’urgence : [délai, événement, perte en cours].
> Opportunités à repérer : [équipement ou situation qui rend la vente facile].
> À traiter ensuite : [profil secondaire].
> Points à vérifier pendant l’appel : [question 1], [question 2].

**Exemple**

> En priorité : les agences qui ont déjà une offre validée, au moins 3 ventes par
> mois et un budget disponible maintenant, avec un besoin dans les 30 jours.
> Signaux d’urgence : leads perdus faute de relance, lancement prévu, recrutement
> d’un commercial. Opportunités : déjà abonnés à GoHighLevel sans l’utiliser, ou
> qui jonglent entre plusieurs outils (CRM, agenda, e-mailing, tunnels).
> Ensuite : les indépendants qui veulent passer en agence dans l’année. À vérifier
> pendant l’appel : qui décide, quel outil est en place, combien de leads par mois.

### `contexte.ideal_profile` · Profil idéal (lead chaud)

**Longueur conseillée** : 600 à 1 400 caractères.

**Gabarit**

> Situation : [qui il est, taille, ancienneté].
> Résultats actuels : [ventes, chiffre, clients].
> Problème ressenti : [ce qu’il perd, en ses mots].
> Équipement : [outils déjà en place].
> Budget et délai : [montant disponible], [décision sous X jours].
> Ce qu’il dit typiquement : « [phrase type d’un bon prospect] ».
> Signes qui confirment : [signal 1], [signal 2], [signal 3].

**Exemple**

> Indépendant ou agence de 1 à 10 personnes, en activité depuis plus d’un an,
> avec une offre validée et quelques ventes par mois. Il perd des leads faute de
> suivi ou d’automatisation et le sait. Il a déjà GoHighLevel ou est prêt à
> l’adopter. Il peut investir 3 000 € maintenant et veut démarrer sous 30 jours.
> Ce qu’il dit : « Je génère des contacts mais je n’ai pas le temps de les
> rappeler ». Signes qui confirment : chiffre son volume de leads, nomme ses
> outils, parle d’un objectif de chiffre d’affaires précis.

### `contexte.low_interest_profile` · Profil à nourrir (lead tiède ou froid)

**Longueur conseillée** : 400 à 1 000 caractères.

**Gabarit**

> Intéressant plus tard si : [situation pas encore mûre].
> Signaux : [délai lointain], [budget à confirmer], [offre en construction].
> À lui proposer : [contenu, rappel dans X mois, offre d’entrée].
> Bascule en profil idéal si : [événement qui change la donne].

### `contexte.disqualifying_profile` · Profil à écarter

**Longueur conseillée** : 300 à 900 caractères.

**Gabarit**

> Écarter : [profil 1], [profil 2], [profil 3].
> Signaux : [ce qu’il dit ou ne peut pas fournir].
> Ne pas confondre avec : [profil proche à nourrir plutôt qu’à écarter].

**Exemple**

> Écarter : les personnes sans offre ni client, sans budget, qui cherchent une
> formation gratuite ou un dépannage ponctuel d’une heure. Signaux : « je me
> renseigne », aucun outil en place, refuse d’indiquer un budget. Ne pas
> confondre avec un indépendant qui a déjà des clients mais un budget à confirmer
> le mois prochain : celui-là est à nourrir.

## Avant d’envoyer

- Chaque champ du contexte dépasse la longueur conseillée minimale, sauf si
  l’utilisateur a demandé un texte court.
- Aucun texte ne reprend un exemple de ce guide mot pour mot.
- Les montants, délais et outils viennent de l’utilisateur, pas d’une supposition.
- Résumez à l’utilisateur ce qui va changer, puis donnez-lui le lien de
  validation renvoyé par `configurer_compte`.
