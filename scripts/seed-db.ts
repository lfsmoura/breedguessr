import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Read the JSON dataset
const datasetPath = join(__dirname, '../src/data/index-dataset.json')
const dataset = JSON.parse(readFileSync(datasetPath, 'utf-8')) as Array<{
  dogBreed: string
  image: string
  hash: string
}>

console.log(`Generating SQL for ${dataset.length} records...`)

// Generate SQL INSERT statements in batches
const BATCH_SIZE = 500
const sqlStatements: string[] = []

for (let i = 0; i < dataset.length; i += BATCH_SIZE) {
  const batch = dataset.slice(i, i + BATCH_SIZE)
  const values = batch
    .map(dog => {
      const breed = dog.dogBreed.replace(/'/g, "''")
      const image = dog.image.replace(/'/g, "''")
      const hash = dog.hash.replace(/'/g, "''")
      return `('${breed}', '${image}', '${hash}')`
    })
    .join(',\n  ')

  sqlStatements.push(`INSERT INTO dogs (dog_breed, image, hash) VALUES\n  ${values};`)
}

const fullSql = sqlStatements.join('\n\n')

// Write to migrations folder
const outputPath = join(__dirname, '../migrations/0002_seed_dogs.sql')
writeFileSync(outputPath, fullSql)

console.log(`Generated ${outputPath}`)
console.log(`Total batches: ${sqlStatements.length}`)
