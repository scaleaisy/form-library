// Copie du format officiel ScaleAIsy. Ne pas modifier ici : les changements
// arrivent depuis la plateforme à chaque version.
import { z } from 'zod'

/**
 * Contrat d’un thème de couleurs.
 * Un thème est une simple palette : aucune feuille de style, aucun script,
 * aucun lien externe.
 */

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/
const color = z.string().regex(HEX_COLOR, 'Utilisez une couleur hexadécimale à 6 chiffres, par exemple #1A2B3C.')

/** Contraste minimal d’un texte avec son fond (WCAG AA). */
export const MIN_TEXT_CONTRAST = 4.5
/** Contraste minimal d’un élément d’interface (cases, curseur, progression) avec son fond. */
export const MIN_CONTROL_CONTRAST = 3

export const designPresetSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9][a-z0-9-]{1,39}$/, 'Identifiant : 2 à 40 caractères parmi a-z, 0-9 et « - ».'),
  title: z.string().trim().min(2).max(40),
  description: z.string().trim().min(10).max(200),
  settings: z.strictObject({
    primaryColor: color,
    backgroundColor: color,
    textColor: color,
    fieldTextColor: color,
    buttonTextColor: color,
    darkMode: z.boolean(),
  }),
})

export type DesignPreset = z.output<typeof designPresetSchema>
export type DesignPalette = DesignPreset['settings']

/** Valide un thème. Lève une erreur si le thème est invalide. */
export function defineDesignPreset(input: DesignPreset): DesignPreset {
  return designPresetSchema.parse(input)
}

function luminance(hex: string) {
  const [red, green, blue] = [1, 3, 5].map(offset => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

/** Rapport de contraste WCAG entre deux couleurs hexadécimales. */
export function contrastRatio(first: string, second: string) {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a)
  return (light + 0.05) / (dark + 0.05)
}

/** Lisibilité minimale exigée de tout thème : textes (WCAG AA) et éléments d’interface visibles. */
export function designReadabilityIssues(preset: DesignPreset) {
  const { settings } = preset
  const checks: Array<[string, string, string, number]> = [
    ['Texte sur le fond', settings.textColor, settings.backgroundColor, MIN_TEXT_CONTRAST],
    ['Texte des champs sur le fond', settings.fieldTextColor, settings.backgroundColor, MIN_TEXT_CONTRAST],
    ['Texte des boutons sur la couleur principale', settings.buttonTextColor, settings.primaryColor, MIN_TEXT_CONTRAST],
    ['Couleur principale sur le fond (cases, curseur, progression)', settings.primaryColor, settings.backgroundColor, MIN_CONTROL_CONTRAST],
  ]
  return checks
    .map(([label, foreground, background, minimum]) => ({ label, minimum, ratio: contrastRatio(foreground, background) }))
    .filter(check => check.ratio < check.minimum)
    .map(check => `${check.label} : contraste ${check.ratio.toFixed(2)}, minimum ${check.minimum}.`)
}

/** Applique des ajustements de couleur (venant d’un formulaire) à un thème. */
export function withPaletteOverrides(preset: DesignPreset, overrides: Partial<DesignPalette>): DesignPreset {
  const defined = Object.fromEntries(Object.entries(overrides).filter(([, value]) => value !== undefined))
  return { ...preset, settings: { ...preset.settings, ...defined } }
}
