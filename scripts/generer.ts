import { mkdirSync, writeFileSync } from 'node:fs'
import { formSpecJsonSchema, renderCatalogMarkdown } from '../src/index.ts'

// Régénère les fichiers dérivés du format officiel.
mkdirSync('schema', { recursive: true })
writeFileSync('schema/formulaire.schema.json', `${JSON.stringify(formSpecJsonSchema(), null, 2)}\n`)
writeFileSync('CATALOGUE.md', renderCatalogMarkdown())
console.log('Fichiers générés : schema/formulaire.schema.json, CATALOGUE.md')
