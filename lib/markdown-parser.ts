import fs from 'fs'
import path from 'path'
import type {
  ParsedModule,
  ModuleMetadata,
  LearningObjective,
  KeyConcept,
  ContentSection,
  ContentSubsection,
  ParsedTable,
  PromptTemplate,
  PracticalExample,
  Exercise,
  ReflectionQuestion,
  ExternalResourceGroup,
  ExternalResourceEntry,
  QuizQuestion,
  QuizOption,
  SummaryPoint,
} from '@/types/module-content'

// =============================================================================
// Hjälpfunktioner
// =============================================================================

/** Dela markdown i top-level sektioner (## rubriker) */
function splitSections(markdown: string): { heading: string; body: string }[] {
  const sections: { heading: string; body: string }[] = []
  const lines = markdown.split('\n')
  let currentHeading = ''
  let currentBody: string[] = []

  for (const line of lines) {
    if (line.startsWith('## ') && !line.startsWith('### ')) {
      if (currentHeading || currentBody.length > 0) {
        sections.push({
          heading: currentHeading,
          body: currentBody.join('\n').trim(),
        })
      }
      currentHeading = line.replace('## ', '').trim()
      currentBody = []
    } else {
      currentBody.push(line)
    }
  }

  if (currentHeading || currentBody.length > 0) {
    sections.push({
      heading: currentHeading,
      body: currentBody.join('\n').trim(),
    })
  }

  return sections
}

/** Parsa en markdown-tabell till strukturerad data */
function parseTable(tableText: string): ParsedTable | null {
  const lines = tableText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|'))

  if (lines.length < 3) return null

  const parseRow = (line: string): string[] =>
    line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.replace(/\*\*/g, '').trim())

  const headers = parseRow(lines[0])
  // lines[1] is the separator row
  const rows = lines.slice(2).map((line) => {
    const cells = parseRow(line)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h] = cells[i] || ''
    })
    return row
  })

  return { headers, rows }
}

/** Hitta alla tabeller i en textblock */
function extractTables(text: string): ParsedTable[] {
  const tables: ParsedTable[] = []
  const lines = text.split('\n')
  let tableLines: string[] = []
  let inTable = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('|')) {
      inTable = true
      tableLines.push(trimmed)
    } else if (inTable) {
      const parsed = parseTable(tableLines.join('\n'))
      if (parsed) tables.push(parsed)
      tableLines = []
      inTable = false
    }
  }

  if (inTable && tableLines.length > 0) {
    const parsed = parseTable(tableLines.join('\n'))
    if (parsed) tables.push(parsed)
  }

  return tables
}

/** Extrahera kodblock (promptmallar) */
function extractPromptTemplates(text: string): PromptTemplate[] {
  const templates: PromptTemplate[] = []
  const regex = /\*\*Promptmall\s*[–-]\s*(.+?):\*\*\s*\n```\n?([\s\S]*?)```/g
  let match

  while ((match = regex.exec(text)) !== null) {
    templates.push({
      title: match[1].trim(),
      content: match[2].trim(),
    })
  }

  return templates
}

// =============================================================================
// Sektionsparsers
// =============================================================================

/** Parsa metadata från hela markdown-filens början */
function parseMetadata(
  fullMarkdown: string,
  firstHeading: string
): ModuleMetadata {
  const title = firstHeading || ''

  const subtitleMatch = fullMarkdown.match(/^## (.+)/m)
  const subtitle = subtitleMatch ? subtitleMatch[1].trim() : ''

  const timeMatch = fullMarkdown.match(/\*\*Tid:\*\*\s*(\d+)\s*minut/)
  const typeMatch = fullMarkdown.match(/\*\*Typ:\*\*\s*(.+)/)
  const statusMatch = fullMarkdown.match(/\*\*Status:\*\*\s*(.+)/)

  return {
    title,
    subtitle,
    estimatedTime: timeMatch ? parseInt(timeMatch[1], 10) : 0,
    type: typeMatch ? typeMatch[1].trim().replace(/\s{2,}$/, '') : '',
    status: statusMatch ? statusMatch[1].trim() : '',
  }
}

/** Parsa lärandemål */
function parseLearningObjectives(body: string): LearningObjective[] {
  const objectives: LearningObjective[] = []
  const regex = /(\d+)\.\s+\*\*([^\*]+)\*\*\s+(.+)/g
  let match

  while ((match = regex.exec(body)) !== null) {
    objectives.push({
      id: `lo-${match[1]}`,
      verb: match[2],
      description: match[3].trim(),
    })
  }

  return objectives
}

/** Parsa nyckelbegrepp */
function parseKeyConcepts(body: string): KeyConcept[] {
  const concepts: KeyConcept[] = []
  const parts = body.split(/### /).filter(Boolean)

  for (const part of parts) {
    const lines = part.split('\n')
    const term = lines[0].trim()
    if (!term) continue

    const restLines = lines.slice(1)
    const definitionLines: string[] = []
    const details: string[] = []
    let inDetails = false

    for (const line of restLines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('**Kännetecken:**') || trimmed.startsWith('- ')) {
        inDetails = true
      }
      if (inDetails && trimmed.startsWith('- ')) {
        details.push(trimmed.replace(/^- /, ''))
      } else if (!inDetails && trimmed) {
        definitionLines.push(trimmed)
      }
    }

    concepts.push({
      term,
      definition: definitionLines.join(' ').trim(),
      details,
    })
  }

  return concepts
}

/** Parsa huvudinnehåll i numrerade sektioner */
function parseContentSections(body: string): ContentSection[] {
  const sections: ContentSection[] = []
  const parts = body.split(/### (\d+)\.\s+/).filter(Boolean)

  for (let i = 0; i < parts.length - 1; i += 2) {
    const number = parseInt(parts[i], 10)
    const content = parts[i + 1]
    if (isNaN(number)) continue

    const lines = content.split('\n')
    const heading = lines[0].trim()
    const sectionBody = lines.slice(1).join('\n').trim()

    // Dela i subsektioner (#### rubriker)
    const subParts = sectionBody.split(/#### /).filter(Boolean)
    const subsections: ContentSubsection[] = []

    for (const sub of subParts) {
      const subLines = sub.split('\n')
      const subHeading = subLines[0].trim()
      const subBody = subLines.slice(1).join('\n').trim()

      if (
        subHeading.includes(':') ||
        subHeading.length > 2
      ) {
        subsections.push({
          heading: subHeading,
          body: subBody,
          tables: extractTables(subBody),
          promptTemplates: extractPromptTemplates(subBody),
        })
      }
    }

    sections.push({
      number,
      heading,
      body: sectionBody,
      subsections,
    })
  }

  return sections
}

/** Parsa praktiska exempel */
function parsePracticalExamples(body: string): PracticalExample[] {
  const examples: PracticalExample[] = []
  const parts = body.split(/### Exempel (\d+):/).filter(Boolean)

  for (let i = 0; i < parts.length - 1; i += 2) {
    const num = parts[i].trim()
    const content = parts[i + 1].trim()
    examples.push({
      id: `ex-${num}`,
      title: content.split('\n')[0].trim(),
      body: content.split('\n').slice(1).join('\n').trim(),
    })
  }

  return examples
}

/** Parsa övningar */
function parseExercises(body: string): Exercise[] {
  const exercises: Exercise[] = []
  const parts = body.split(/### Övning (\d+):/).filter(Boolean)

  for (let i = 0; i < parts.length - 1; i += 2) {
    const num = parts[i].trim()
    const content = parts[i + 1].trim()
    const titleLine = content.split('\n')[0].trim()

    const durationMatch = titleLine.match(/\((\d+\s*min)\)/)
    const duration = durationMatch ? durationMatch[1] : undefined

    // Kolla om det finns ett lösningsblock (details/summary)
    let mainBody = content.split('\n').slice(1).join('\n').trim()
    let solution: string | undefined

    const detailsMatch = mainBody.match(
      /<details>\s*<summary>.*?<\/summary>\s*([\s\S]*?)<\/details>/
    )
    if (detailsMatch) {
      solution = detailsMatch[1].trim()
      mainBody = mainBody
        .replace(/<details>[\s\S]*?<\/details>/, '')
        .trim()
    }

    exercises.push({
      id: `exercise-${num}`,
      title: titleLine.replace(/\(\d+\s*min\)/, '').trim(),
      duration,
      body: mainBody,
      solution,
    })
  }

  return exercises
}

/** Parsa reflektionsfrågor */
function parseReflectionQuestions(body: string): ReflectionQuestion[] {
  const questions: ReflectionQuestion[] = []
  const regex = /(\d+)\.\s+(.+)/g
  let match

  while ((match = regex.exec(body)) !== null) {
    questions.push({
      id: `ref-${match[1]}`,
      text: match[2].trim(),
    })
  }

  return questions
}

/** Parsa externa resurser */
/** Extrahera URL från markdown-länk: [text](url) → { text, url } */
function extractMarkdownLink(text: string): { text: string; url?: string } {
  const match = text.match(/^\[(.+?)\]\((.+?)\)$/)
  if (match) return { text: match[1], url: match[2] }
  // Stöd för inline-länk i längre text: "**[Title](url)** – description"
  const inlineMatch = text.match(/\[(.+?)\]\((.+?)\)/)
  if (inlineMatch) return { text: inlineMatch[1], url: inlineMatch[2] }
  return { text }
}

function parseExternalResources(body: string): ExternalResourceGroup[] {
  const groups: ExternalResourceGroup[] = []
  const parts = body.split(/### /).filter(Boolean)

  for (const part of parts) {
    const lines = part.split('\n')
    const category = lines[0].trim()
    const tables = extractTables(lines.slice(1).join('\n'))

    if (tables.length > 0) {
      const resources: ExternalResourceEntry[] = tables[0].rows.map((row) => {
        const rawTitle = row['Resurs'] || row['Källa'] || Object.values(row)[0] || ''
        const { text: title, url: titleUrl } = extractMarkdownLink(rawTitle)
        const rawSource = row['Källa'] || row['URL'] || ''
        const { text: source, url: sourceUrl } = extractMarkdownLink(rawSource)
        return {
          title,
          source: source || undefined,
          duration: row['Tid'] || undefined,
          description: row['Beskrivning'] || row['Fokus'] || '',
          url: titleUrl || sourceUrl || undefined,
        }
      })

      groups.push({ category, resources })
    } else {
      // Punktlista med resurser
      const bulletResources: ExternalResourceEntry[] = []
      for (const line of lines.slice(1)) {
        const trimmed = line.trim()
        const bulletMatch = trimmed.match(
          /^-\s+\*\*(.+?)\*\*\s*[–-]?\s*(.*)/
        )
        if (bulletMatch) {
          const { text: title, url } = extractMarkdownLink(bulletMatch[1])
          bulletResources.push({
            title,
            description: bulletMatch[2] || '',
            url,
          })
        }
      }
      if (bulletResources.length > 0) {
        groups.push({ category, resources: bulletResources })
      }
    }
  }

  return groups
}

/** Parsa kunskapstest (quiz) */
function parseQuiz(body: string): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  const parts = body.split(/### Fråga (\d+)/).filter(Boolean)

  for (let i = 0; i < parts.length - 1; i += 2) {
    const num = parts[i].trim()
    const content = parts[i + 1].trim()
    const lines = content.split('\n').filter((l) => l.trim())

    const text = lines[0].trim()
    const options: QuizOption[] = []
    let correctAnswer = ''

    for (const line of lines.slice(1)) {
      const trimmed = line.trim()
      const optionMatch = trimmed.match(/^- ([A-D])\)\s+(.+)/)
      if (optionMatch) {
        options.push({
          letter: optionMatch[1],
          text: optionMatch[2],
        })
      }

      const answerMatch = trimmed.match(/\*\*Rätt svar:\*\*\s*([A-D])/)
      if (answerMatch) {
        correctAnswer = answerMatch[1]
      }
    }

    if (text && options.length > 0) {
      questions.push({
        id: `q${num}`,
        text,
        options,
        correctAnswer,
      })
    }
  }

  return questions
}

/** Parsa sammanfattning */
function parseSummary(body: string): SummaryPoint[] {
  const points: SummaryPoint[] = []
  const regex = /^-\s+(.+)/gm
  let match

  while ((match = regex.exec(body)) !== null) {
    points.push({
      text: match[1].replace(/\*\*/g, '').trim(),
    })
  }

  return points
}

// =============================================================================
// Huvudparser
// =============================================================================

/** Parsa en komplett modulfil från markdown till strukturerad data */
export function parseModuleMarkdown(markdown: string, moduleNumber: number): ParsedModule {
  const sections = splitSections(markdown)

  // Första sektionen är headern (innan första ## )
  const headerParts = markdown.split(/^## /m)
  const headerRaw = headerParts[0] || ''
  const titleMatch = headerRaw.match(/^# (.+)/m)
  const firstTitle = titleMatch ? titleMatch[1].trim() : ''

  // Hitta sektioner per rubrik
  const findSection = (name: string) =>
    sections.find((s) =>
      s.heading.toLowerCase().includes(name.toLowerCase())
    )

  const metadata = parseMetadata(markdown, firstTitle)

  const learningSection = findSection('Lärandemål')
  const conceptsSection = findSection('Nyckelbegrepp')
  const contentSection = findSection('Huvudinnehåll')
  const examplesSection = findSection('Praktiska exempel')
  const exercisesSection = findSection('Praktiska övningar') || findSection('Övning')
  const reflectionSection = findSection('Reflektionsfrågor') || findSection('Avslutande reflektionsfrågor')
  const resourcesSection = findSection('Fördjupning')
  const quizSection = findSection('Kunskapstest')
  const summarySection = findSection('Sammanfattning')

  return {
    moduleNumber,
    metadata,
    learningObjectives: learningSection
      ? parseLearningObjectives(learningSection.body)
      : [],
    keyConcepts: conceptsSection
      ? parseKeyConcepts(conceptsSection.body)
      : [],
    contentSections: contentSection
      ? parseContentSections(contentSection.body)
      : [],
    practicalExamples: examplesSection
      ? parsePracticalExamples(examplesSection.body)
      : [],
    exercises: exercisesSection
      ? parseExercises(exercisesSection.body)
      : [],
    reflectionQuestions: reflectionSection
      ? parseReflectionQuestions(reflectionSection.body)
      : [],
    externalResources: resourcesSection
      ? parseExternalResources(resourcesSection.body)
      : [],
    quiz: quizSection ? parseQuiz(quizSection.body) : [],
    summary: summarySection
      ? parseSummary(summarySection.body)
      : [],
    rawMarkdown: markdown,
  }
}

/** Läs och parsa en modulfil från disk */
export function parseModuleFile(filePath: string, moduleNumber: number): ParsedModule {
  const markdown = fs.readFileSync(filePath, 'utf-8')
  return parseModuleMarkdown(markdown, moduleNumber)
}

/** Läs och parsa alla modulfiler (01-06) från en katalog */
export function parseAllModules(directory: string): ParsedModule[] {
  const moduleFiles = [
    { file: '01_AI_i_kontext.md', num: 1 },
    { file: '02_AI_i_dagliga_konsultarbetet.md', num: 2 },
    { file: '03_AI_i_styrning_projekt.md', num: 3 },
    { file: '04_AI_i_kunddialog.md', num: 4 },
    { file: '05_Ansvar_risk_omdomme.md', num: 5 },
    { file: '06_Forankring_fortsatt_larande.md', num: 6 },
  ]

  return moduleFiles.map(({ file, num }) =>
    parseModuleFile(path.join(directory, file), num)
  )
}
