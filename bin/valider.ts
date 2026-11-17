import { readFileSync } from 'node:fs'
import { designPresetSchema, designReadabilityIssues, parseFormSpec } from '../src/index.ts'

const files = process.argv.slice(2)
if (files.length === 0) {
  console.error('Usage : npm run valider -- mon-formulaire.json [autre.json…]')
  process.exit(2)
}

let failed = false
for (const file of files) {
  let input: unknown
  try {
    input = JSON.parse(readFileSync(file, 'utf8'))
  } catch (error) {
    console.error(`✗ ${file} : JSON illisible (${(error as Error).message}).`)
    failed = true
    continue
  }

  const isDesign = Boolean(input && typeof input === 'object' && 'settings' in input)
  const issues = isDesign ? designIssues(input) : formIssues(input)
  if (issues.length === 0) {
    console.log(`✓ ${file} : ${isDesign ? 'thème' : 'formulaire'} valide.`)
  } else {
    failed = true
    console.error(`✗ ${file} :`)
    for (const issue of issues) console.error(`  - ${issue}`)
  }
}
process.exit(failed ? 1 : 0)

function formIssues(input: unknown) {
  const result = parseFormSpec(input)
  return result.ok ? [] : result.issues.map(issue => `${issue.path} : ${issue.message}`)
}

function designIssues(input: unknown) {
  const result = designPresetSchema.safeParse(input)
  if (!result.success) return result.error.issues.map(issue => `${issue.path.join('.') || '(racine)'} : ${issue.message}`)
  return designReadabilityIssues(result.data)
}
