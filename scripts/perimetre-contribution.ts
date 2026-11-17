import { execFileSync } from 'node:child_process'

// Une contribution externe ne peut qu’ajouter ou modifier des thèmes dans designs/.
const base = process.argv[2]
if (!base) {
  console.error('Usage : node scripts/perimetre-contribution.ts <commit-de-base>')
  process.exit(2)
}

const MAX_THEMES = 3
const changes = execFileSync('git', ['diff', '--name-status', '--no-renames', `${base}...HEAD`], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
  .map(line => {
    const [status, file] = line.split('\t')
    return { status, file }
  })

const errors: string[] = []
for (const { status, file } of changes) {
  if (!/^designs\/[a-z0-9][a-z0-9-]{1,39}\.json$/.test(file)) errors.push(`${file} : seuls les fichiers de designs/ peuvent être proposés.`)
  else if (status === 'D') errors.push(`${file} : la suppression d’un thème n’est pas possible par contribution.`)
}
if (changes.length > MAX_THEMES) errors.push(`Proposez au plus ${MAX_THEMES} thèmes par contribution.`)
if (changes.length === 0) errors.push('Aucun thème proposé.')

if (errors.length > 0) {
  for (const error of errors) console.error(`✗ ${error}`)
  process.exit(1)
}
console.log(`✓ ${changes.length} thème(s) proposé(s).`)
