'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import {
  getSectionProgress,
  markSectionRead,
  unmarkSectionRead,
  toggleExerciseCompleted,
  getAllSectionProgress,
  getTrackableSections,
  calculateModuleProgress,
  calculateTrainingProgress,
  type ModuleSectionProgress,
  type ModuleBackendProgress,
  type ModuleProgressSummary,
  type TrainingProgressSummary,
} from '@/lib/progress'
import type { ParsedModule } from '@/types/module-content'

// ---------------------------------------------------------------------------
// Hook: progress för en enskild modul
// ---------------------------------------------------------------------------

export function useModuleProgress(moduleNumber: number, module: ParsedModule) {
  const moduleId = `modul-${moduleNumber}`

  const [sectionProgress, setSectionProgress] = useState<ModuleSectionProgress>({
    sectionsRead: [],
    exercisesCompleted: [],
    lastVisited: '',
  })
  const [backend, setBackend] = useState<ModuleBackendProgress>({
    moduleId,
    completed: false,
  })
  const [saving, setSaving] = useState(false)

  const trackable = getTrackableSections(module)

  // Load on mount
  useEffect(() => {
    setSectionProgress(getSectionProgress(moduleId))

    const loadBackend = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('user_progress')
        .select('completed, completed_at, quiz_score, quiz_completed_at')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .single()

      if (data) {
        setBackend({
          moduleId,
          completed: data.completed,
          completedAt: data.completed_at,
          quizScore: data.quiz_score,
          quizCompletedAt: data.quiz_completed_at,
        })
      }
    }

    loadBackend()
  }, [moduleId])

  const toggleSection = useCallback((sectionId: string) => {
    const current = getSectionProgress(moduleId)
    const isRead = current.sectionsRead.includes(sectionId)

    const updated = isRead
      ? unmarkSectionRead(moduleId, sectionId)
      : markSectionRead(moduleId, sectionId)

    setSectionProgress({ ...updated })
  }, [moduleId])

  const toggleExercise = useCallback((exerciseId: string) => {
    const updated = toggleExerciseCompleted(moduleId, exerciseId)
    setSectionProgress({ ...updated })
  }, [moduleId])

  const markModuleCompleted = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    setSaving(true)

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        console.error('Auth error:', authError)
        setSaving(false)
        return { success: false, error: 'Du måste vara inloggad för att spara progress.' }
      }

      // First, check if a row already exists
      const { data: existing } = await supabase
        .from('user_progress')
        .select('quiz_score, quiz_completed_at')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .single()

      // Upsert with all existing data preserved
      const { error } = await supabase.from('user_progress').upsert({
        user_id: user.id,
        module_id: moduleId,
        completed: true,
        completed_at: new Date().toISOString(),
        // Preserve existing quiz data if it exists
        ...(existing?.quiz_score !== undefined && { quiz_score: existing.quiz_score }),
        ...(existing?.quiz_completed_at && { quiz_completed_at: existing.quiz_completed_at }),
      }, {
        onConflict: 'user_id,module_id',
      })

      if (error) {
        console.error('Failed to mark module as completed:', error)
        setSaving(false)
        return { success: false, error: `Kunde inte spara: ${error.message}` }
      }

      setBackend((prev) => ({ ...prev, completed: true, completedAt: new Date().toISOString() }))
      setSaving(false)
      return { success: true }
    } catch (err) {
      console.error('Unexpected error:', err)
      setSaving(false)
      return { success: false, error: 'Ett oväntat fel uppstod.' }
    }
  }, [moduleId])

  const summary = calculateModuleProgress(moduleNumber, trackable, sectionProgress, backend)

  return {
    sectionProgress,
    backend,
    summary,
    trackable,
    saving,
    toggleSection,
    toggleExercise,
    markModuleCompleted,
    isSectionRead: (id: string) => sectionProgress.sectionsRead.includes(id),
    isExerciseCompleted: (id: string) => sectionProgress.exercisesCompleted.includes(id),
  }
}

// ---------------------------------------------------------------------------
// Hook: aggregerad progress för hela utbildningen
// ---------------------------------------------------------------------------

export function useTrainingProgress(modules: ParsedModule[]) {
  const [backendProgress, setBackendProgress] = useState<ModuleBackendProgress[]>([])
  const [sectionProgressMap, setSectionProgressMap] = useState<
    Record<string, ModuleSectionProgress>
  >({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // localStorage
    const allLocal = getAllSectionProgress()
    setSectionProgressMap(allLocal)

    // Supabase
    const loadBackend = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('user_progress')
          .select('module_id, completed, completed_at, quiz_score, quiz_completed_at')
          .eq('user_id', user.id)

        if (data) {
          setBackendProgress(data.map((row) => ({
            moduleId: row.module_id,
            completed: row.completed,
            completedAt: row.completed_at,
            quizScore: row.quiz_score,
            quizCompletedAt: row.quiz_completed_at,
          })))
        }
      }

      setLoading(false)
    }

    loadBackend()
  }, [])

  // Listen for localStorage changes (from other tabs or ModuleView updates)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'curago-ai-progress') {
        setSectionProgressMap(getAllSectionProgress())
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const refresh = useCallback(() => {
    setSectionProgressMap(getAllSectionProgress())
  }, [])

  const moduleSummaries: ModuleProgressSummary[] = modules.map((mod) => {
    const moduleId = `modul-${mod.moduleNumber}`
    const trackable = getTrackableSections(mod)
    const sp = sectionProgressMap[moduleId] || {
      sectionsRead: [],
      exercisesCompleted: [],
      lastVisited: '',
    }
    const bp = backendProgress.find((b) => b.moduleId === moduleId)

    return calculateModuleProgress(mod.moduleNumber, trackable, sp, bp)
  })

  const trainingSummary: TrainingProgressSummary = calculateTrainingProgress(moduleSummaries)

  return {
    loading,
    moduleSummaries,
    trainingSummary,
    backendProgress,
    refresh,
    getModuleSummary: (moduleNumber: number) =>
      moduleSummaries.find((m) => m.moduleNumber === moduleNumber),
  }
}
