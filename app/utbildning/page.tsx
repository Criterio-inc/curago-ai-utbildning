'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, CheckCircle, Circle, ArrowRight, BookOpen, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getModules } from '@/lib/modules'
import { Module, UserProgress } from '@/types'

export default function UtbildningPage() {
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const modules = getModules()

  useEffect(() => {
    const fetchProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('user_progress')
          .select('module_id, completed, completed_at, quiz_score')
          .eq('user_id', user.id)

        if (data) {
          setProgress(data.map(p => ({
            moduleId: p.module_id,
            completed: p.completed,
            completedAt: p.completed_at,
            quizScore: p.quiz_score
          })))
        }
      }

      setLoading(false)
    }

    fetchProgress()
  }, [])

  const getModuleProgress = (moduleId: string) => {
    return progress.find(p => p.moduleId === moduleId)
  }

  const completedCount = progress.filter(p => p.completed).length
  const totalModules = modules.length
  const progressPercentage = Math.round((completedCount / totalModules) * 100)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Din utbildning</h1>
        <p className="text-slate-500 mb-6">Följ din progress genom de 6 modulerna</p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
            <div
              className="bg-curago-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-lg font-semibold text-slate-900 min-w-[60px]">
            {progressPercentage}%
          </span>
        </div>

        <p className="text-sm text-slate-500">
          {completedCount} av {totalModules} moduler avklarade
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const moduleProgress = getModuleProgress(module.id)
          const isCompleted = moduleProgress?.completed

          return (
            <Link
              key={module.id}
              href={`/utbildning/${module.id}`}
              className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-curago-200 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-100 text-green-600'
                    : 'bg-curago-100 text-curago-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{module.number}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-400">
                  <Clock className="w-4 h-4" />
                  {module.estimatedTime} min
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-curago-600 transition-colors">
                {module.title}
              </h3>

              <p className="text-sm text-slate-500 mb-4">
                {module.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <span className="text-sm text-green-600 font-medium">Avklarad</span>
                  ) : moduleProgress ? (
                    <span className="text-sm text-amber-600 font-medium">Påbörjad</span>
                  ) : (
                    <span className="text-sm text-slate-400">Ej påbörjad</span>
                  )}
                  {moduleProgress?.quizScore !== undefined && (
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                      Quiz: {moduleProgress.quizScore}%
                    </span>
                  )}
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-curago-600 transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Resources Section */}
      <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-curago-600" />
          Tips för din utbildning
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-slate-800 mb-2">Ta det i din egen takt</h3>
            <p className="text-sm text-slate-500">
              Du kan pausa och fortsätta när som helst. Din progress sparas automatiskt.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-slate-800 mb-2">Quiz är frivilliga</h3>
            <p className="text-sm text-slate-500">
              Testa dig själv om du vill - men det är helt valfritt. Ingen annan ser dina resultat.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-slate-800 mb-2">Utforska externa resurser</h3>
            <p className="text-sm text-slate-500">
              Varje modul innehåller länkar till fördjupande material om du vill lära dig mer.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-slate-800 mb-2">Din integritet</h3>
            <p className="text-sm text-slate-500">
              Endast du kan se din progress och dina quizresultat. Ingen övervakning sker.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
