// Copie du format officiel ScaleAIsy. Ne pas modifier ici : les changements
// arrivent depuis la plateforme à chaque version.
import { z } from 'zod'
import { findDesignPreset } from './catalog.ts'
import { designReadabilityIssues, withPaletteOverrides } from './design.ts'

/**
 * Format public de description d’un formulaire ScaleAIsy (version 1).
 *
 * Ce fichier est recopié tel quel dans le dépôt public destiné aux agents IA.
 * Il ne doit dépendre que de `zod` et n’employer que le vocabulaire produit :
 * aucun détail d’implémentation de la plateforme.
 */

export const FORM_SPEC_VERSION = 1 as const

export const FORM_SPEC_LANGUAGES = ['fr', 'en', 'es', 'de'] as const
export const FORM_SPEC_DISPLAY_MODES = ['classic', 'immersive', 'fullPage'] as const
export const FORM_SPEC_DISPLAY_SIZES = ['small', 'medium', 'large'] as const
export const FORM_SPEC_QUESTION_TYPES = ['voice', 'text', 'choice', 'scale'] as const
export const FORM_SPEC_ANSWER_IMPACTS = ['veryPositive', 'positive', 'neutral', 'negative', 'disqualifying'] as const
export const FORM_SPEC_GOALS = ['optin', 'beforeCalendar', 'afterCalendar', 'reactivation'] as const
export const FORM_SPEC_END_TARGET = 'end' as const

/** Règles produit visibles dans le builder : elles conditionnent la validité d’un formulaire. */
export const FORM_SPEC_RULES = {
  maxQuestions: 30,
  maxVoiceQuestions: 3,
  minVoiceDurationSeconds: 15,
  maxVoiceDurationSeconds: 180,
  maxChoiceOptions: 20,
  maxScaleMaximum: 99_000_000,
} as const

const KEY_PATTERN = /^[a-z0-9][a-z0-9-]{0,39}$/
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/

const key = (label: string) => z.string().regex(KEY_PATTERN, `${label} : utilisez 1 à 40 caractères parmi a-z, 0-9 et « - ».`)
const text = (max: number) => z.string().trim().min(1, 'Ce texte ne peut pas être vide.').max(max, `Ce texte dépasse ${max} caractères.`)
const optionalText = (max: number) => z.string().trim().max(max, `Ce texte dépasse ${max} caractères.`).optional()
const color = z.string().regex(HEX_COLOR, 'Utilisez une couleur hexadécimale à 6 chiffres, par exemple #1A2B3C.')
const httpsUrl = z.string().max(2_000).refine(value => {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password
  } catch {
    return false
  }
}, 'Utilisez une adresse https:// complète.')

const choiceOption = z.strictObject({
  key: key('La clé du choix'),
  label: text(500),
  impact: z.enum(FORM_SPEC_ANSWER_IMPACTS).default('neutral'),
})

const scaleRange = z.strictObject({
  key: key('La clé de la plage'),
  label: text(500),
  from: z.number().int().min(0),
  to: z.number().int().min(0),
  impact: z.enum(FORM_SPEC_ANSWER_IMPACTS).default('neutral'),
})

const aiAnalysis = z.strictObject({
  idealAnswer: optionalText(4_000),
  lowInterestAnswer: optionalText(4_000),
  disqualifyingAnswer: optionalText(4_000),
  /** La réponse peut envoyer le prospect vers la fin « non retenu ». */
  eliminatory: z.boolean().default(false),
})

const questionBase = {
  key: key('La clé de la question'),
  text: text(3_000),
  help: optionalText(1_200),
  required: z.boolean().default(true),
}

const voiceQuestion = z.strictObject({
  ...questionBase,
  type: z.literal('voice'),
  maxDurationSeconds: z.number().int()
    .min(FORM_SPEC_RULES.minVoiceDurationSeconds)
    .max(FORM_SPEC_RULES.maxVoiceDurationSeconds)
    .default(60),
  ai: aiAnalysis.optional(),
})

const textQuestion = z.strictObject({
  ...questionBase,
  type: z.literal('text'),
  ai: aiAnalysis.optional(),
})

const routes = z.record(z.string(), z.string()).optional()

const choiceQuestion = z.strictObject({
  ...questionBase,
  type: z.literal('choice'),
  multiple: z.boolean().default(false),
  options: z.array(choiceOption).min(2, 'Une question à choix demande au moins 2 choix.').max(FORM_SPEC_RULES.maxChoiceOptions),
  /** Choix → clé de la question suivante, ou « end » pour terminer les questions. */
  routes,
  /** Destination des choix sans route. Obligatoire dès qu’une route existe. */
  defaultNext: z.string().optional(),
})

const scaleQuestion = z.strictObject({
  ...questionBase,
  type: z.literal('scale'),
  maximum: z.number().int().min(1).max(FORM_SPEC_RULES.maxScaleMaximum),
  ranges: z.array(scaleRange).min(1).max(FORM_SPEC_RULES.maxChoiceOptions),
})

const question = z.discriminatedUnion('type', [voiceQuestion, textQuestion, choiceQuestion, scaleQuestion])

const consent = z.strictObject({
  required: z.boolean().default(false),
  text: optionalText(500),
})

const ending = z.strictObject({
  title: optionalText(240),
  subtitle: optionalText(1_200),
  button: z.strictObject({ label: text(80), url: httpsUrl }).optional(),
  /** Lien d’agenda externe proposé à la fin (prospects retenus uniquement). */
  calendarUrl: httpsUrl.optional(),
})

const design = z.strictObject({
  /** Identifiant d’un thème de la bibliothèque design. */
  preset: z.string().regex(KEY_PATTERN).optional(),
  primaryColor: color.optional(),
  backgroundColor: color.optional(),
  textColor: color.optional(),
  fieldTextColor: color.optional(),
  buttonTextColor: color.optional(),
  transparentBackground: z.boolean().optional(),
  darkMode: z.boolean().optional(),
})

export const formSpecSchema = z.strictObject({
  specVersion: z.literal(FORM_SPEC_VERSION),
  name: text(120),
  language: z.enum(FORM_SPEC_LANGUAGES).default('fr'),
  goal: z.enum(FORM_SPEC_GOALS).default('beforeCalendar'),
  display: z.strictObject({
    mode: z.enum(FORM_SPEC_DISPLAY_MODES).default('classic'),
    size: z.enum(FORM_SPEC_DISPLAY_SIZES).default('medium'),
  }).default({ mode: 'classic', size: 'medium' }),
  design: design.default({}),
  intro: z.strictObject({ title: text(120), subtitle: optionalText(260) }).optional(),
  contact: z.strictObject({
    position: z.enum(['beforeQuestions', 'afterQuestions']).default('beforeQuestions'),
    phoneRequired: z.boolean().default(true),
    lastNameRequired: z.boolean().default(false),
    countrySelector: z.boolean().default(false),
    consent: consent.optional(),
  }).default({ position: 'beforeQuestions', phoneRequired: true, lastNameRequired: false, countrySelector: false }),
  qualification: z.strictObject({
    offer: optionalText(1_600),
    targetAudience: optionalText(1_600),
    priceOrCommitment: optionalText(600),
    hardDisqualifiers: optionalText(1_600),
    idealProfile: optionalText(4_000),
    lowInterestProfile: optionalText(4_000),
    disqualifyingProfile: optionalText(4_000),
  }).optional(),
  questions: z.array(question).min(1, 'Ajoutez au moins une question.').max(FORM_SPEC_RULES.maxQuestions),
  endings: z.strictObject({
    qualified: ending.optional(),
    disqualified: ending.omit({ calendarUrl: true }).optional(),
  }).default({}),
}).superRefine((spec, ctx) => {
  const preset = findDesignPreset(spec.design.preset)
  if (spec.design.preset && !preset) {
    ctx.addIssue({ code: 'custom', path: ['design', 'preset'], message: `Le thème « ${spec.design.preset} » n’existe pas dans la bibliothèque design.` })
  }
  if (preset) {
    const { primaryColor, backgroundColor, textColor, fieldTextColor, buttonTextColor, darkMode } = spec.design
    const adjusted = withPaletteOverrides(preset, { primaryColor, backgroundColor, textColor, fieldTextColor, buttonTextColor, darkMode })
    for (const message of designReadabilityIssues(adjusted)) {
      ctx.addIssue({ code: 'custom', path: ['design'], message: `Couleurs ajustées peu lisibles. ${message}` })
    }
  }

  const keys = new Set<string>()
  spec.questions.forEach((item, index) => {
    if (keys.has(item.key)) ctx.addIssue({ code: 'custom', path: ['questions', index, 'key'], message: `La clé « ${item.key} » est utilisée plusieurs fois.` })
    keys.add(item.key)
  })

  const voiceCount = spec.questions.filter(item => item.type === 'voice').length
  if (voiceCount > FORM_SPEC_RULES.maxVoiceQuestions) {
    ctx.addIssue({ code: 'custom', path: ['questions'], message: `Un formulaire contient au plus ${FORM_SPEC_RULES.maxVoiceQuestions} questions vocales.` })
  }

  const positionOf = new Map(spec.questions.map((item, index) => [item.key, index]))
  spec.questions.forEach((item, index) => {
    if ((item.type === 'voice' || item.type === 'text') && item.ai?.eliminatory && !item.ai.disqualifyingAnswer) {
      ctx.addIssue({ code: 'custom', path: ['questions', index, 'ai', 'disqualifyingAnswer'], message: 'Décrivez la réponse disqualifiante d’une question éliminatoire.' })
    }

    if (item.type === 'choice') {
      const optionKeys = new Set<string>()
      item.options.forEach((option, optionIndex) => {
        if (optionKeys.has(option.key)) ctx.addIssue({ code: 'custom', path: ['questions', index, 'options', optionIndex, 'key'], message: `La clé de choix « ${option.key} » est utilisée plusieurs fois.` })
        optionKeys.add(option.key)
      })
      const hasRoutes = item.routes && Object.keys(item.routes).length > 0
      if (hasRoutes && !item.defaultNext) {
        ctx.addIssue({ code: 'custom', path: ['questions', index, 'defaultNext'], message: 'Indiquez la destination par défaut des choix sans route.' })
      }
      if (hasRoutes && item.multiple) {
        ctx.addIssue({ code: 'custom', path: ['questions', index, 'routes'], message: 'Les routes conditionnelles demandent une question à choix unique.' })
      }
      const targets: Array<[(string | number)[], string]> = Object.entries(item.routes ?? {}).map(([optionKey, target]) => [['questions', index, 'routes', optionKey], target])
      if (item.defaultNext) targets.push([['questions', index, 'defaultNext'], item.defaultNext])
      for (const optionKey of Object.keys(item.routes ?? {})) {
        if (!optionKeys.has(optionKey)) ctx.addIssue({ code: 'custom', path: ['questions', index, 'routes', optionKey], message: `Le choix « ${optionKey} » n’existe pas.` })
      }
      for (const [path, target] of targets) {
        if (target === FORM_SPEC_END_TARGET) continue
        const targetIndex = positionOf.get(target)
        if (targetIndex === undefined) ctx.addIssue({ code: 'custom', path, message: `La question « ${target} » n’existe pas.` })
        else if (targetIndex <= index) ctx.addIssue({ code: 'custom', path, message: 'Une route doit mener vers une question placée plus loin, pour éviter les boucles.' })
      }
    }

    if (item.type === 'scale') {
      const ranges = [...item.ranges].sort((a, b) => a.from - b.from)
      const rangeKeys = new Set<string>()
      item.ranges.forEach((range, rangeIndex) => {
        if (rangeKeys.has(range.key)) ctx.addIssue({ code: 'custom', path: ['questions', index, 'ranges', rangeIndex, 'key'], message: `La clé de plage « ${range.key} » est utilisée plusieurs fois.` })
        rangeKeys.add(range.key)
        if (range.to < range.from) ctx.addIssue({ code: 'custom', path: ['questions', index, 'ranges', rangeIndex], message: 'La fin d’une plage doit être supérieure ou égale à son début.' })
      })
      const covers = ranges[0]?.from === 0
        && ranges.at(-1)?.to === item.maximum
        && ranges.every((range, rangeIndex) => rangeIndex === 0 || range.from === ranges[rangeIndex - 1].to + 1)
      if (!covers) ctx.addIssue({ code: 'custom', path: ['questions', index, 'ranges'], message: `Les plages doivent couvrir 0 à ${item.maximum} sans trou ni chevauchement.` })
    }
  })
})

export type FormSpec = z.output<typeof formSpecSchema>
export type FormSpecInput = z.input<typeof formSpecSchema>
export type FormSpecQuestion = FormSpec['questions'][number]

export type FormSpecIssue = { path: string; message: string }
export type FormSpecParseResult =
  | { ok: true; spec: FormSpec }
  | { ok: false; issues: FormSpecIssue[] }

function formatPath(path: ReadonlyArray<PropertyKey>) {
  return path.reduce<string>((result, part) => (
    typeof part === 'number' ? `${result}[${part}]` : result ? `${result}.${String(part)}` : String(part)
  ), '') || '(racine)'
}

/** Valide une description et renvoie des erreurs lisibles par un agent. */
export function parseFormSpec(input: unknown): FormSpecParseResult {
  const result = formSpecSchema.safeParse(input)
  if (result.success) return { ok: true, spec: result.data }
  return {
    ok: false,
    issues: result.error.issues.map(issue => ({ path: formatPath(issue.path), message: issue.message })),
  }
}

/** Schéma JSON publié avec le dépôt public (éditeurs, agents, validation hors ligne). */
export function formSpecJsonSchema() {
  return z.toJSONSchema(formSpecSchema, { io: 'input', unrepresentable: 'any' })
}
