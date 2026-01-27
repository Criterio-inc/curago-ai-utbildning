// =============================================================================
// Datamodell för AI-utbildningens modulinnehåll
// Parsas från markdown-filer (01-06)
// =============================================================================

/** Metadata som finns i varje modulfils header */
export interface ModuleMetadata {
  title: string
  subtitle: string
  estimatedTime: number
  type: string
  status: string
}

/** Lärandemål med verb och beskrivning */
export interface LearningObjective {
  id: string
  verb: string
  description: string
}

/** Nyckelbegrepp med term, definition och eventuella detaljer */
export interface KeyConcept {
  term: string
  definition: string
  details: string[]
}

/** Tabellrad – generisk för olika tabeller i innehållet */
export interface TableRow {
  [key: string]: string
}

/** Promptmall som förekommer i modulernas innehåll */
export interface PromptTemplate {
  title: string
  content: string
}

/** Undersektion i huvudinnehållet */
export interface ContentSubsection {
  heading: string
  body: string
  tables: ParsedTable[]
  promptTemplates: PromptTemplate[]
}

/** En numrerad sektion i huvudinnehållet */
export interface ContentSection {
  number: number
  heading: string
  subsections: ContentSubsection[]
  body: string
}

/** Parsad tabell från markdown */
export interface ParsedTable {
  headers: string[]
  rows: TableRow[]
}

/** Praktiskt exempel från modulen */
export interface PracticalExample {
  id: string
  title: string
  body: string
}

/** Övning med scenario, uppgift och eventuellt lösningsförslag */
export interface Exercise {
  id: string
  title: string
  duration?: string
  body: string
  solution?: string
}

/** Reflektionsfråga */
export interface ReflectionQuestion {
  id: string
  text: string
}

/** Extern resurs (tabell) från fördjupningssektionen */
export interface ExternalResourceEntry {
  title: string
  source?: string
  duration?: string
  description: string
  url?: string
}

/** Grupp av externa resurser under en rubrik */
export interface ExternalResourceGroup {
  category: string
  resources: ExternalResourceEntry[]
}

/** Quizfråga med flervalsalternativ */
export interface QuizQuestion {
  id: string
  text: string
  options: QuizOption[]
  correctAnswer: string
}

/** Svarsalternativ i quiz */
export interface QuizOption {
  letter: string
  text: string
}

/** Sammanfattningspunkt */
export interface SummaryPoint {
  text: string
}

/** Komplett parsad modul – hela datamodellen */
export interface ParsedModule {
  moduleNumber: number
  metadata: ModuleMetadata
  learningObjectives: LearningObjective[]
  keyConcepts: KeyConcept[]
  contentSections: ContentSection[]
  practicalExamples: PracticalExample[]
  exercises: Exercise[]
  reflectionQuestions: ReflectionQuestion[]
  externalResources: ExternalResourceGroup[]
  quiz: QuizQuestion[]
  summary: SummaryPoint[]
  rawMarkdown: string
}
