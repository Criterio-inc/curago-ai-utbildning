/**
 * Testskript för markdown-parsern.
 * Kör med: npx tsx scripts/test-parser.ts
 */
import path from 'path'
import { parseModuleFile } from '../lib/markdown-parser'

const projectRoot = path.resolve(__dirname, '..')
const modulePath = path.join(projectRoot, '01_AI_i_kontext.md')

console.log('=== Testar markdown-parser på Modul 01 ===\n')

const parsed = parseModuleFile(modulePath, 1)

// --- Metadata ---
console.log('--- METADATA ---')
console.log(JSON.stringify(parsed.metadata, null, 2))

// --- Lärandemål ---
console.log('\n--- LÄRANDEMÅL (%d st) ---', parsed.learningObjectives.length)
for (const obj of parsed.learningObjectives) {
  console.log(`  [${obj.id}] ${obj.verb}: ${obj.description}`)
}

// --- Nyckelbegrepp ---
console.log('\n--- NYCKELBEGREPP (%d st) ---', parsed.keyConcepts.length)
for (const concept of parsed.keyConcepts) {
  console.log(`  ${concept.term}`)
  console.log(`    Definition: ${concept.definition.substring(0, 100)}...`)
  if (concept.details.length > 0) {
    console.log(`    Detaljer: ${concept.details.length} punkter`)
  }
}

// --- Innehållssektioner ---
console.log('\n--- INNEHÅLLSSEKTIONER (%d st) ---', parsed.contentSections.length)
for (const section of parsed.contentSections) {
  console.log(`  ${section.number}. ${section.heading}`)
  console.log(`     Subsektioner: ${section.subsections.length}`)
  for (const sub of section.subsections) {
    console.log(`       - ${sub.heading} (tabeller: ${sub.tables.length}, promptmallar: ${sub.promptTemplates.length})`)
  }
}

// --- Praktiska exempel ---
console.log('\n--- PRAKTISKA EXEMPEL (%d st) ---', parsed.practicalExamples.length)
for (const ex of parsed.practicalExamples) {
  console.log(`  [${ex.id}] ${ex.title}`)
}

// --- Övningar ---
console.log('\n--- ÖVNINGAR (%d st) ---', parsed.exercises.length)
for (const ex of parsed.exercises) {
  console.log(`  [${ex.id}] ${ex.title}`)
  if (ex.duration) console.log(`    Tid: ${ex.duration}`)
  if (ex.solution) console.log(`    Har lösning: ja`)
}

// --- Reflektionsfrågor ---
console.log('\n--- REFLEKTIONSFRÅGOR (%d st) ---', parsed.reflectionQuestions.length)
for (const q of parsed.reflectionQuestions) {
  console.log(`  [${q.id}] ${q.text.substring(0, 80)}...`)
}

// --- Externa resurser ---
console.log('\n--- EXTERNA RESURSER (%d grupper) ---', parsed.externalResources.length)
for (const group of parsed.externalResources) {
  console.log(`  ${group.category} (${group.resources.length} resurser)`)
  for (const r of group.resources) {
    console.log(`    - ${r.title}`)
  }
}

// --- Quiz ---
console.log('\n--- QUIZ (%d frågor) ---', parsed.quiz.length)
for (const q of parsed.quiz) {
  console.log(`  [${q.id}] ${q.text}`)
  for (const opt of q.options) {
    const marker = opt.letter === q.correctAnswer ? ' ✓' : ''
    console.log(`    ${opt.letter}) ${opt.text}${marker}`)
  }
}

// --- Sammanfattning ---
console.log('\n--- SAMMANFATTNING (%d punkter) ---', parsed.summary.length)
for (const pt of parsed.summary) {
  console.log(`  • ${pt.text}`)
}

// --- Full JSON (förkortat) ---
console.log('\n--- KOMPLETT STRUKTUR (JSON) ---')
const output = {
  ...parsed,
  rawMarkdown: `[${parsed.rawMarkdown.length} tecken]`,
  contentSections: parsed.contentSections.map((s) => ({
    ...s,
    body: s.body.substring(0, 80) + '...',
    subsections: s.subsections.map((sub) => ({
      ...sub,
      body: sub.body.substring(0, 80) + '...',
    })),
  })),
}
console.log(JSON.stringify(output, null, 2))
