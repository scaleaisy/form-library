import { createServer } from 'node:http'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative, resolve, sep } from 'node:path'

// Banc de test du sur mesure : sert votre formulaire en local et une page de
// contrôle qui vérifie son branchement au tunnel avec la clé de test.
const dossier = resolve(process.argv[2] ?? 'sur-mesure/exemple')
const port = Number(process.env.PORT ?? 4321)
const banc = readFileSync(new URL('../sur-mesure/banc.html', import.meta.url), 'utf8')
const KIT = 'https://scaleaisy.app/sur-mesure/v1.js'
const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2',
}

function fichiers(racine: string, max = 400): string[] {
  const trouves: string[] = []
  const parcourir = (chemin: string) => {
    for (const nom of readdirSync(chemin)) {
      if (trouves.length >= max || nom === 'node_modules' || nom.startsWith('.')) continue
      const complet = join(chemin, nom)
      if (statSync(complet).isDirectory()) parcourir(complet)
      else if (/\.(html?|m?js|jsx|tsx?|vue|svelte|astro)$/.test(nom)) trouves.push(complet)
    }
  }
  parcourir(racine)
  return trouves
}

function analyser() {
  const contenu = fichiers(dossier).map(chemin => ({ chemin: relative(dossier, chemin), texte: readFileSync(chemin, 'utf8') }))
  const avecKit = contenu.filter(f => f.texte.includes(KIT) || f.texte.includes('ScaleAIsy.open')).map(f => f.chemin)
  const clesTest = [...new Set(contenu.flatMap(f => f.texte.match(/sm_test_[A-Za-z0-9]{32}/g) ?? []))]
  const clesReelles = [...new Set(contenu.flatMap(f => f.texte.match(/sm_live_[A-Za-z0-9]{32}/g) ?? []))]
  const evenements = [...new Set(contenu.flatMap(f => [...f.texte.matchAll(/\.track\(\s*['"]([a-z_]+)['"]/g)].map(m => m[1])))]
  return {
    dossier,
    fichiers: contenu.length,
    avecKit,
    clesTest,
    clesReelles: clesReelles.length,
    evenements,
    enregistrementVocal: contenu.some(f => f.texte.includes('ScaleAIsy.record')),
    gereErreurs: contenu.some(f => /catch\s*\(/.test(f.texte) && f.texte.includes('.submit(')),
  }
}

createServer((requete, reponse) => {
  const url = new URL(requete.url ?? '/', `http://localhost:${port}`)
  if (url.pathname === '/__banc') {
    reponse.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    return reponse.end(banc)
  }
  if (url.pathname === '/__banc/analyse') {
    reponse.writeHead(200, { 'content-type': 'application/json' })
    return reponse.end(JSON.stringify(analyser()))
  }
  let chemin = resolve(dossier, `.${decodeURIComponent(url.pathname)}`)
  if (chemin !== dossier && !chemin.startsWith(dossier + sep)) {
    reponse.writeHead(403)
    return reponse.end()
  }
  try {
    if (statSync(chemin).isDirectory()) chemin = join(chemin, 'index.html')
    const corps = readFileSync(chemin)
    reponse.writeHead(200, { 'content-type': TYPES[extname(chemin)] ?? 'application/octet-stream', 'cache-control': 'no-store' })
    reponse.end(corps)
  } catch {
    reponse.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    reponse.end('Introuvable')
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Votre formulaire : http://localhost:${port}/`)
  console.log(`Banc de test     : http://localhost:${port}/__banc`)
  console.log(`Dossier servi    : ${dossier}`)
})
