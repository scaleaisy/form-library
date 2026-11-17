import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { designPresetSchema, designReadabilityIssues, formSpecJsonSchema, parseFormSpec, renderCatalogMarkdown } from '../src/index.ts'

// Contrôle complet du dépôt : exemples, thèmes et fichiers générés.
const errors: string[] = []
const jsonFiles = (dir: string) => readdirSync(dir).filter(file => file.endsWith('.json')).map(file => path.join(dir, file))

for (const file of jsonFiles('exemples')) {
  const result = parseFormSpec(JSON.parse(readFileSync(file, 'utf8')))
  if (!result.ok) errors.push(...result.issues.map(issue => `${file} › ${issue.path} : ${issue.message}`))
}

const ids = new Set<string>()
for (const file of jsonFiles('designs')) {
  const result = designPresetSchema.safeParse(JSON.parse(readFileSync(file, 'utf8')))
  if (!result.success) {
    errors.push(...result.error.issues.map(issue => `${file} › ${issue.path.join('.')} : ${issue.message}`))
    continue
  }
  if (path.basename(file, '.json') !== result.data.id) errors.push(`${file} : le nom du fichier doit être « ${result.data.id}.json ».`)
  if (ids.has(result.data.id)) errors.push(`${file} : l’identifiant « ${result.data.id} » existe déjà.`)
  ids.add(result.data.id)
  errors.push(...designReadabilityIssues(result.data).map(issue => `${file} › ${issue}`))
}

const expectedSchema = `${JSON.stringify(formSpecJsonSchema(), null, 2)}\n`
if (readFileSync('schema/formulaire.schema.json', 'utf8') !== expectedSchema) errors.push('schema/formulaire.schema.json n’est pas à jour : lancez npm run generer.')
if (readFileSync('CATALOGUE.md', 'utf8') !== renderCatalogMarkdown()) errors.push('CATALOGUE.md n’est pas à jour : lancez npm run generer.')

if (errors.length > 0) {
  for (const error of errors) console.error(`✗ ${error}`)
  process.exit(1)
}
console.log('✓ Exemples, thèmes et fichiers générés conformes.')
