// Copie du format officiel ScaleAIsy. Ne pas modifier ici : les changements
// arrivent depuis la plateforme à chaque version.
/**
 * Catalogue public de ce qu’un formulaire ScaleAIsy sait faire.
 *
 * Deux bibliothèques distinctes :
 * - fonctionnalités : fermée, maintenue par ScaleAIsy ;
 * - design : thèmes de couleurs du builder, maintenus par ScaleAIsy.
 *
 * Recopié dans le dépôt public et servi aux agents : vocabulaire produit
 * uniquement, aucune information interne ni de sécurité.
 */

import type { DesignPreset } from './design.ts'

export type FeatureAvailability = 'spec' | 'builder'

export type FeatureEntry = {
  id: string
  title: string
  description: string
  /** `spec` : décrivable dans le format ; `builder` : à régler ensuite dans l’interface. */
  availability: FeatureAvailability
  /** Emplacement dans le format quand la fonctionnalité y est décrivable. */
  specPath?: string
}

export type FeatureGroup = { id: string; title: string; features: FeatureEntry[] }

export const FEATURE_CATALOG: FeatureGroup[] = [
  {
    id: 'questions',
    title: 'Questions',
    features: [
      { id: 'voice-question', title: 'Question vocale', availability: 'spec', specPath: 'questions[].type = "voice"', description: 'Le prospect répond à l’oral. La réponse est transcrite puis analysée par l’IA. Trois questions vocales au plus par formulaire, de 15 à 180 secondes.' },
      { id: 'text-question', title: 'Question écrite', availability: 'spec', specPath: 'questions[].type = "text"', description: 'Réponse libre au clavier, analysable par l’IA comme une réponse vocale.' },
      { id: 'choice-question', title: 'Question à choix', availability: 'spec', specPath: 'questions[].type = "choice"', description: 'Choix unique ou multiple, de 2 à 20 réponses. Chaque réponse porte un impact sur la qualification.' },
      { id: 'scale-question', title: 'Curseur chiffré', availability: 'spec', specPath: 'questions[].type = "scale"', description: 'Le prospect choisit une valeur de 0 au maximum. Des plages consécutives donnent l’impact de chaque valeur.' },
      { id: 'question-video', title: 'Vidéo sur une question', availability: 'builder', description: 'Une vidéo accompagne la question, avec test A/B possible et déverrouillage après un délai.' },
    ],
  },
  {
    id: 'qualification',
    title: 'Qualification IA',
    features: [
      { id: 'form-qualification', title: 'Contexte de qualification', availability: 'spec', specPath: 'qualification', description: 'Offre, cible, engagement demandé et critères rédhibitoires : l’IA s’en sert pour classer chaque prospect en chaud, tiède, froid ou éliminé.' },
      { id: 'question-analysis', title: 'Analyse par question', availability: 'spec', specPath: 'questions[].ai', description: 'Pour chaque question vocale ou écrite : réponse idéale, peu intéressante et disqualifiante.' },
      { id: 'answer-impact', title: 'Impact des réponses', availability: 'spec', specPath: 'questions[].options[].impact', description: 'Très positif, positif, neutre, négatif ou disqualifiant. Une réponse disqualifiante envoie vers la fin « non retenu ».' },
      { id: 'profiles', title: 'Profils A à D', availability: 'builder', description: 'Les réponses orientent vers jusqu’à quatre profils, chacun avec sa propre fin : écran, redirection ou agenda.' },
    ],
  },
  {
    id: 'journey',
    title: 'Parcours',
    features: [
      { id: 'intro', title: 'Écran d’accueil', availability: 'spec', specPath: 'intro', description: 'Titre et sous-titre affichés avant la première étape.' },
      { id: 'contact-position', title: 'Position du contact', availability: 'spec', specPath: 'contact.position', description: 'Coordonnées demandées avant ou après les questions.' },
      { id: 'conditional-routing', title: 'Logique conditionnelle', availability: 'spec', specPath: 'questions[].routes', description: 'Selon le choix, le prospect passe à une question plus loin ou termine les questions. Une destination par défaut est obligatoire.' },
      { id: 'endings', title: 'Fins retenu / non retenu', availability: 'spec', specPath: 'endings', description: 'Deux écrans de fin distincts, avec titre, texte et bouton.' },
      { id: 'calendar', title: 'Agenda en fin de parcours', availability: 'spec', specPath: 'endings.qualified.calendarUrl', description: 'Les prospects retenus accèdent à votre agenda externe.' },
      { id: 'video-steps', title: 'Étapes vidéo', availability: 'builder', description: 'Vidéos intercalées dans le parcours, avec bouton d’action et fenêtre de relance à la pause.' },
      { id: 'diagnostic', title: 'Diagnostic chiffré', availability: 'builder', description: 'Un score calculé à partir des réponses et un récapitulatif affiché au prospect.' },
      { id: 'adaptive-vsl', title: 'VSL adaptative', availability: 'builder', description: 'Une vidéo de vente découpée en chapitres, jouée dans l’ordre qui correspond aux réponses du prospect.' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact et conformité',
    features: [
      { id: 'contact-fields', title: 'Champs de contact', availability: 'spec', specPath: 'contact', description: 'Prénom, e-mail et téléphone, avec nom et indicatif pays en option.' },
      { id: 'consent', title: 'Consentement au recontact', availability: 'spec', specPath: 'contact.consent', description: 'Case de consentement facultative ou obligatoire, avec un texte modifiable.' },
    ],
  },
  {
    id: 'display',
    title: 'Affichage',
    features: [
      { id: 'display-mode', title: 'Format d’affichage', availability: 'spec', specPath: 'display.mode', description: 'Classique (formulaire intégrable dans une page) ou formats vidéo : intégré et pleine page. Les formats vidéo demandent au moins une vidéo, à ajouter dans le builder avant publication.' },
      { id: 'display-size', title: 'Taille', availability: 'spec', specPath: 'display.size', description: 'Petit, moyen ou grand.' },
      { id: 'design', title: 'Design', availability: 'spec', specPath: 'design', description: 'Un thème de la bibliothèque design, éventuellement ajusté couleur par couleur.' },
      { id: 'branding', title: 'Logo et marque blanche', availability: 'builder', description: 'Logo du compte et retrait de la mention ScaleAIsy selon le forfait.' },
    ],
  },
  {
    id: 'integrations',
    title: 'Intégrations',
    features: [
      { id: 'notifications', title: 'Notification des leads', availability: 'builder', description: 'Chaque lead analysé est envoyé par e-mail au créateur.' },
      { id: 'crm-export', title: 'Envoi vers un outil externe', availability: 'builder', description: 'Les résultats peuvent être transmis automatiquement à votre CRM.' },
      { id: 'ads-tracking', title: 'Suivi publicitaire', availability: 'builder', description: 'Mesure des conversions pour vos campagnes publicitaires.' },
    ],
  },
]

/** Bibliothèque design : thèmes de couleurs du builder. */
export const DESIGN_LIBRARY: DesignPreset[] = [
  {
    id: 'clarte',
    title: 'Clarté',
    description: 'Fond blanc, texte anthracite, accent bleu. Sobre et lisible partout.',
    settings: { primaryColor: '#2563EB', backgroundColor: '#FFFFFF', textColor: '#1F2937', fieldTextColor: '#111827', buttonTextColor: '#FFFFFF', darkMode: false },
  },
  {
    id: 'nuit',
    title: 'Nuit',
    description: 'Fond nuit profond et accent violet lumineux, pour les tunnels premium.',
    settings: { primaryColor: '#7C3AED', backgroundColor: '#0F172A', textColor: '#F8FAFC', fieldTextColor: '#F8FAFC', buttonTextColor: '#FFFFFF', darkMode: true },
  },
  {
    id: 'aurore',
    title: 'Aurore',
    description: 'Accent rose-orangé chaleureux sur fond crème, pour le coaching et le bien-être.',
    settings: { primaryColor: '#C2410C', backgroundColor: '#FFF8F1', textColor: '#3B2418', fieldTextColor: '#2B1A10', buttonTextColor: '#FFFFFF', darkMode: false },
  },
  {
    id: 'foret',
    title: 'Forêt',
    description: 'Vert profond et tons naturels, pour inspirer confiance et sérénité.',
    settings: { primaryColor: '#15803D', backgroundColor: '#F6FBF7', textColor: '#14281D', fieldTextColor: '#0F1F16', buttonTextColor: '#FFFFFF', darkMode: false },
  },
]

export function findDesignPreset(id: string | undefined) {
  return id ? DESIGN_LIBRARY.find(preset => preset.id === id) ?? null : null
}

/** Version Markdown du catalogue, servie aux agents et publiée dans le dépôt public. */
export function renderCatalogMarkdown() {
  const lines = ['# Catalogue ScaleAIsy', '', '## Bibliothèque fonctionnalités', '']
  lines.push('`spec` : décrivable dans le format. `builder` : à régler ensuite dans l’interface ScaleAIsy.', '')
  for (const group of FEATURE_CATALOG) {
    lines.push(`### ${group.title}`, '')
    for (const feature of group.features) {
      const where = feature.specPath ? ` (\`${feature.specPath}\`)` : ''
      lines.push(`- **${feature.title}** [${feature.availability}]${where} : ${feature.description}`)
    }
    lines.push('')
  }
  lines.push('## Bibliothèque design', '')
  for (const preset of DESIGN_LIBRARY) {
    lines.push(`- **${preset.title}** (\`design.preset = "${preset.id}"\`) : ${preset.description}`)
  }
  return `${lines.join('\n')}\n`
}
