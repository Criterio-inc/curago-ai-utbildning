// =============================================================================
// Progress tracking — localStorage (sektioner) + Supabase (modul/quiz)
// =============================================================================

const STORAGE_KEY = 'curago-ai-progress'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Vilka sektioner inom en modul som användaren markerat som lästa */
export interface ModuleSectionProgress {
  sectionsRead: string[]
  exercisesCompleted: string[]
  lastVisited: string
}

/** All sektionsprogress, indexerat på modul-id */
export interface AllSectionProgress {
  [moduleId: string]: ModuleSectionProgress
}

/** Supabase-data per modul */
export interface ModuleBackendProgress {
  moduleId: string
  completed: boolean
  completedAt?: string
  quizScore?: number
  quizCompletedAt?: string
}

/** Sammanställd progress för en enskild modul */
export interface ModuleProgressSummary {
  moduleNumber: number
  moduleId: string
  sectionsTotal: number
  sectionsRead: number
  exercisesTotal: number
  exercisesCompleted: number
  quizTotal: number
  quizScore?: number
  quizCompleted: boolean
  moduleCompleted: boolean
  percentage: number
}

/** Sammanställd progress för hela utbildningen */
export interface TrainingProgressSummary {
  modules: ModuleProgressSummary[]
  totalPercentage: number
  modulesCompleted: number
  totalModules: number
  totalSectionsRead: number
  totalSections: number
  quizzesCompleted: number
  averageQuizScore: number
}

// ---------------------------------------------------------------------------
// Trackable section IDs — deterministic from ParsedModule
// ---------------------------------------------------------------------------

export interface TrackableSections {
  sectionIds: string[]
  exerciseIds: string[]
  quizCount: number
}

/** Räkna ut vilka sektioner som finns att tracka i en modul */
export function getTrackableSections(mod: {
  contentSections: { number: number }[]
  keyConcepts: unknown[]
  exercises: { id: string }[]
  reflectionQuestions: unknown[]
  practicalExamples: unknown[]
  quiz: unknown[]
}): TrackableSections {
  const sectionIds: string[] = []

  if (mod.keyConcepts.length > 0) sectionIds.push('concepts')
  for (const s of mod.contentSections) sectionIds.push(`content-${s.number}`)
  if (mod.practicalExamples.length > 0) sectionIds.push('examples')
  if (mod.exercises.length > 0) sectionIds.push('exercises')
  if (mod.reflectionQuestions.length > 0) sectionIds.push('reflections')

  const exerciseIds = mod.exercises.map((e) => e.id)

  return { sectionIds, exerciseIds, quizCount: mod.quiz.length }
}

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

function readStorage(): AllSectionProgress {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeStorage(data: AllSectionProgress) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getSectionProgress(moduleId: string): ModuleSectionProgress {
  const all = readStorage()
  return all[moduleId] || { sectionsRead: [], exercisesCompleted: [], lastVisited: '' }
}

export function markSectionRead(moduleId: string, sectionId: string) {
  const all = readStorage()
  const mod = all[moduleId] || { sectionsRead: [], exercisesCompleted: [], lastVisited: '' }

  if (!mod.sectionsRead.includes(sectionId)) {
    mod.sectionsRead = [...mod.sectionsRead, sectionId]
  }
  mod.lastVisited = new Date().toISOString()
  all[moduleId] = mod
  writeStorage(all)
  return mod
}

export function unmarkSectionRead(moduleId: string, sectionId: string) {
  const all = readStorage()
  const mod = all[moduleId] || { sectionsRead: [], exercisesCompleted: [], lastVisited: '' }
  mod.sectionsRead = mod.sectionsRead.filter((s) => s !== sectionId)
  mod.lastVisited = new Date().toISOString()
  all[moduleId] = mod
  writeStorage(all)
  return mod
}

export function markExerciseCompleted(moduleId: string, exerciseId: string) {
  const all = readStorage()
  const mod = all[moduleId] || { sectionsRead: [], exercisesCompleted: [], lastVisited: '' }

  if (!mod.exercisesCompleted.includes(exerciseId)) {
    mod.exercisesCompleted = [...mod.exercisesCompleted, exerciseId]
  }
  mod.lastVisited = new Date().toISOString()
  all[moduleId] = mod
  writeStorage(all)
  return mod
}

export function toggleExerciseCompleted(moduleId: string, exerciseId: string) {
  const all = readStorage()
  const mod = all[moduleId] || { sectionsRead: [], exercisesCompleted: [], lastVisited: '' }

  if (mod.exercisesCompleted.includes(exerciseId)) {
    mod.exercisesCompleted = mod.exercisesCompleted.filter((e) => e !== exerciseId)
  } else {
    mod.exercisesCompleted = [...mod.exercisesCompleted, exerciseId]
  }
  mod.lastVisited = new Date().toISOString()
  all[moduleId] = mod
  writeStorage(all)
  return mod
}

export function getAllSectionProgress(): AllSectionProgress {
  return readStorage()
}

// ---------------------------------------------------------------------------
// Progress calculation
// ---------------------------------------------------------------------------

/** Beräkna sammanställd progress för en modul */
export function calculateModuleProgress(
  moduleNumber: number,
  trackable: TrackableSections,
  sectionProgress: ModuleSectionProgress,
  backend?: ModuleBackendProgress
): ModuleProgressSummary {
  const moduleId = `modul-${moduleNumber}`

  const sectionsTotal = trackable.sectionIds.length
  const sectionsRead = sectionProgress.sectionsRead.filter((s) =>
    trackable.sectionIds.includes(s)
  ).length

  const exercisesTotal = trackable.exerciseIds.length
  const exercisesCompleted = sectionProgress.exercisesCompleted.filter((e) =>
    trackable.exerciseIds.includes(e)
  ).length

  const quizTotal = trackable.quizCount
  const quizCompleted = backend?.quizScore !== undefined
  const quizScore = backend?.quizScore
  const moduleCompleted = backend?.completed || false

  // Weighted progress:
  // 50% sections read, 20% exercises, 20% quiz, 10% module marked complete
  // Exception: if module is marked as completed, show 100%
  let percentage: number

  if (moduleCompleted) {
    percentage = 100
  } else {
    const sectionWeight = sectionsTotal > 0 ? (sectionsRead / sectionsTotal) * 50 : 50
    const exerciseWeight = exercisesTotal > 0 ? (exercisesCompleted / exercisesTotal) * 20 : 20
    const quizWeight = quizCompleted ? 20 : 0

    percentage = Math.round(sectionWeight + exerciseWeight + quizWeight)
  }

  return {
    moduleNumber,
    moduleId,
    sectionsTotal,
    sectionsRead,
    exercisesTotal,
    exercisesCompleted,
    quizTotal,
    quizScore,
    quizCompleted,
    moduleCompleted,
    percentage,
  }
}

/** Beräkna sammanställd progress för hela utbildningen */
export function calculateTrainingProgress(
  moduleSummaries: ModuleProgressSummary[]
): TrainingProgressSummary {
  const totalModules = moduleSummaries.length
  const modulesCompleted = moduleSummaries.filter((m) => m.moduleCompleted).length
  const totalSectionsRead = moduleSummaries.reduce((s, m) => s + m.sectionsRead, 0)
  const totalSections = moduleSummaries.reduce((s, m) => s + m.sectionsTotal, 0)
  const quizzesCompleted = moduleSummaries.filter((m) => m.quizCompleted).length

  const quizScores = moduleSummaries
    .filter((m) => m.quizScore !== undefined)
    .map((m) => m.quizScore!)
  const averageQuizScore = quizScores.length > 0
    ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
    : 0

  const totalPercentage = totalModules > 0
    ? Math.round(moduleSummaries.reduce((s, m) => s + m.percentage, 0) / totalModules)
    : 0

  return {
    modules: moduleSummaries,
    totalPercentage,
    modulesCompleted,
    totalModules,
    totalSectionsRead,
    totalSections,
    quizzesCompleted,
    averageQuizScore,
  }
}
