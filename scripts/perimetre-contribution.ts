// Les contributions externes ne sont pas ouvertes : toute modification est refusée.
const base = process.argv[2]
if (!base) {
  console.error('Usage : node scripts/perimetre-contribution.ts <commit-de-base>')
  process.exit(2)
}
console.error('✗ Ce dépôt est maintenu par ScaleAIsy et n’accepte pas de contribution externe. Ouvrez une issue.')
process.exit(1)
