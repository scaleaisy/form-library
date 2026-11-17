// Copie du format officiel ScaleAIsy. Ne pas modifier ici : les changements
// arrivent depuis la plateforme à chaque version.
import { z } from 'zod'

/**
 * Contrat d’un thème de la bibliothèque design.
 * Un thème est une simple palette : aucune feuille de style, aucun script,
 * aucun lien externe. Ils restent sûrs par construction.
 */

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/
const color = z.string().regex(HEX_COLOR, 'Utilisez une couleur hexadécimale à 6 chiffres, par exemple #1A2B3C.')

export const MIN_TEXT_CONTRAST = 4.5

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

function luminance(hex: string) {
  const channel = (offset: number) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5)
}

/** Rapport de contraste WCAG entre deux couleurs hexadécimales. */
export function contrastRatio(first: string, second: string) {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a)
  return (light + 0.05) / (dark + 0.05)
}

/** Lisibilité minimale exigée de tout thème (niveau WCAG AA). */
export function designReadabilityIssues(preset: DesignPreset) {
  const { settings } = preset
  const pairs: Array<[string, string, string]> = [
    ['Texte sur le fond', settings.textColor, settings.backgroundColor],
    ['Texte des champs sur le fond', settings.fieldTextColor, settings.backgroundColor],
    ['Texte des boutons sur la couleur principale', settings.buttonTextColor, settings.primaryColor],
  ]
  return pairs
    .map(([label, foreground, background]) => ({ label, ratio: contrastRatio(foreground, background) }))
    .filter(pair => pair.ratio < MIN_TEXT_CONTRAST)
    .map(pair => `${pair.label} : contraste ${pair.ratio.toFixed(2)}, minimum ${MIN_TEXT_CONTRAST}.`)
}
