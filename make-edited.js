const fs = require('fs')

const src = 'aboutPage-about-2026-11-01.json'
const out = 'aboutPage-about-edited.json'

const doc = JSON.parse(fs.readFileSync(src, 'utf8'))

for (const key of ['awards', '_rev', '_system', '_createdAt', '_updatedAt']) {
  delete doc[key]
}

fs.writeFileSync(out, JSON.stringify(doc, null, 2), 'utf8')
console.log('Wrote', out, 'with', Object.keys(doc).length, 'top-level fields')