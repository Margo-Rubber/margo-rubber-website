// Puts the `awards` section back on aboutPage-about from the 2026-11-01 snapshot,
// undoing unset-awards.js. Dry run by default; pass --write to commit the patch.
import {createClient} from '@sanity/client'
import fs from 'fs'

import dotenv from 'dotenv'
dotenv.config({path: '.env.local'})

const client = createClient({
  projectId: 'jyg2beas',
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const snapshot = JSON.parse(fs.readFileSync('aboutPage-about-2026-11-01.json', 'utf8'))
const {awards} = snapshot
if (!awards) throw new Error('Snapshot has no awards field')

const current = await client.getDocument('aboutPage-about')
if (!current) throw new Error('aboutPage-about not found in production')
console.log('Current awards:', current.awards ? 'present' : 'missing')
console.log('Restoring', awards.items.length, 'items, auditedLabel:', awards.auditedLabel)

if (!process.argv.includes('--write')) {
  console.log('Dry run. Re-run with --write to patch production.')
  process.exit(0)
}

const result = await client.patch('aboutPage-about').set({awards}).commit()
console.log('Patched', result._id, 'rev', result._rev)
