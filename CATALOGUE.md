# Catalogue ScaleAIsy

## Bibliothèque fonctionnalités

`spec` : décrivable dans le format. `builder` : à régler ensuite dans l’interface ScaleAIsy.

### Questions

- **Question vocale** [spec] (`questions[].type = "voice"`) : Le prospect répond à l’oral. La réponse est transcrite puis analysée par l’IA. Trois questions vocales au plus par formulaire, de 15 à 180 secondes.
- **Question écrite** [spec] (`questions[].type = "text"`) : Réponse libre au clavier, analysable par l’IA comme une réponse vocale.
- **Question à choix** [spec] (`questions[].type = "choice"`) : Choix unique ou multiple, de 2 à 20 réponses. Chaque réponse porte un impact sur la qualification.
- **Curseur chiffré** [spec] (`questions[].type = "scale"`) : Le prospect choisit une valeur de 0 au maximum. Des plages consécutives donnent l’impact de chaque valeur.
- **Vidéo sur une question** [builder] : Une vidéo accompagne la question, avec test A/B possible et déverrouillage après un délai.

### Qualification IA

- **Contexte de qualification** [spec] (`qualification`) : Offre, cible, engagement demandé et critères rédhibitoires : l’IA s’en sert pour classer chaque prospect en chaud, tiède, froid ou éliminé.
- **Analyse par question** [spec] (`questions[].ai`) : Pour chaque question vocale ou écrite : réponse idéale, peu intéressante et disqualifiante.
- **Impact des réponses** [spec] (`questions[].options[].impact`) : Très positif, positif, neutre, négatif ou disqualifiant. Une réponse disqualifiante envoie vers la fin « non retenu ».
- **Profils A à D** [builder] : Les réponses orientent vers jusqu’à quatre profils, chacun avec sa propre fin : écran, redirection ou agenda.

### Parcours

- **Écran d’accueil** [spec] (`intro`) : Titre et sous-titre affichés avant la première étape.
- **Position du contact** [spec] (`contact.position`) : Coordonnées demandées avant ou après les questions.
- **Logique conditionnelle** [spec] (`questions[].routes`) : Selon le choix, le prospect passe à une question plus loin ou termine les questions. Une destination par défaut est obligatoire.
- **Fins retenu / non retenu** [spec] (`endings`) : Deux écrans de fin distincts, avec titre, texte et bouton.
- **Agenda en fin de parcours** [spec] (`endings.qualified.calendarUrl`) : Les prospects retenus accèdent à votre agenda externe.
- **Étapes vidéo** [builder] : Vidéos intercalées dans le parcours, avec bouton d’action et fenêtre de relance à la pause.
- **Diagnostic chiffré** [builder] : Un score calculé à partir des réponses et un récapitulatif affiché au prospect.
- **VSL adaptative** [builder] : Une vidéo de vente découpée en chapitres, jouée dans l’ordre qui correspond aux réponses du prospect.

### Contact et conformité

- **Champs de contact** [spec] (`contact`) : Prénom, e-mail et téléphone, avec nom et indicatif pays en option.
- **Consentement au recontact** [spec] (`contact.consent`) : Case de consentement facultative ou obligatoire, avec un texte modifiable.

### Affichage

- **Format d’affichage** [spec] (`display.mode`) : Standard (formulaire intégrable dans une page) ou formats vidéo : Intégré et Full Page. Les formats vidéo demandent au moins une vidéo, à ajouter dans le builder avant publication.
- **Taille** [spec] (`display.size`) : Petit, moyen ou grand.
- **Design** [spec] (`design`) : Un thème de la bibliothèque design, éventuellement ajusté couleur par couleur.
- **Logo et marque blanche** [builder] : Logo du compte et retrait de la mention ScaleAIsy selon le forfait.

### Intégrations

- **Notification des leads** [builder] : Chaque lead analysé est envoyé par e-mail au créateur.
- **Envoi vers un outil externe** [builder] : Les résultats peuvent être transmis automatiquement à votre CRM.
- **Suivi publicitaire** [builder] : Mesure des conversions pour vos campagnes publicitaires.
- **Pilotage du tunnel** [builder] : Bouton Pilotage de la carte du tunnel : nom structuré (rôle · catégorie · stratégie · nom libre), réglages d’acquisition et parcours Scaling en cinq étapes. Rôle : principal, secondaire ou test. Stratégie : acquisition (nouveaux contacts), ventes (agenda et appel de vente) ou analyse.

## Bibliothèque design

- **Clarté** (`design.preset = "clarte"`) : Fond blanc, texte anthracite, accent bleu. Sobre et lisible partout.
- **Nuit** (`design.preset = "nuit"`) : Fond nuit profond et accent violet lumineux, pour les tunnels premium.
- **Aurore** (`design.preset = "aurore"`) : Accent rose-orangé chaleureux sur fond crème, pour le coaching et le bien-être.
- **Forêt** (`design.preset = "foret"`) : Vert profond et tons naturels, pour inspirer confiance et sérénité.
