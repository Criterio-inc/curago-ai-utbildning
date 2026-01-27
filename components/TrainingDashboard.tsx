'use client'

import Link from 'next/link'
import {
  Clock,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Target,
  FileText,
  Lightbulb,
  BarChart3,
} from 'lucide-react'
import { useTrainingProgress } from '@/hooks/useProgress'
import type { ParsedModule } from '@/types/module-content'

interface TrainingDashboardProps {
  modules: ParsedModule[]
}

export default function TrainingDashboard({ modules }: TrainingDashboardProps) {
  const {
    loading,
    moduleSummaries,
    trainingSummary,
    getModuleSummary,
  } = useTrainingProgress(modules)

  const totalTime = modules.reduce((sum, m) => sum + m.metadata.estimatedTime, 0)
  const totalQuizQuestions = modules.reduce((sum, m) => sum + m.quiz.length, 0)
  const totalExercises = modules.reduce((sum, m) => sum + m.exercises.length, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">AI-utbildning</h1>
        <p className="text-slate-500 mb-6">
          Curagos interna kompetenshöjning – {modules.length} moduler, ca {Math.round(totalTime / 60)} timmar
        </p>

        {/* Main progress bar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
            <div
              className="bg-curago-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${trainingSummary.totalPercentage}%` }}
            />
          </div>
          <span className="text-lg font-semibold text-slate-900 min-w-[60px]">
            {trainingSummary.totalPercentage}%
          </span>
        </div>

        {/* Detailed stats */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
          <span>{trainingSummary.modulesCompleted} av {trainingSummary.totalModules} moduler avklarade</span>
          <span className="text-slate-300">|</span>
          <span>{trainingSummary.totalSectionsRead}/{trainingSummary.totalSections} sektioner lästa</span>
          {trainingSummary.quizzesCompleted > 0 && (
            <>
              <span className="text-slate-300">|</span>
              <span>{trainingSummary.quizzesCompleted} quiz gjorda (snitt {trainingSummary.averageQuizScore}%)</span>
            </>
          )}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-curago-600 mb-1">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-lg font-semibold text-slate-900">{modules.length}</div>
            <div className="text-xs text-slate-500">Moduler</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-curago-600 mb-1">
              <Target className="w-4 h-4" />
            </div>
            <div className="text-lg font-semibold text-slate-900">{totalQuizQuestions}</div>
            <div className="text-xs text-slate-500">Quizfrågor</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-curago-600 mb-1">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="text-lg font-semibold text-slate-900">{totalExercises}</div>
            <div className="text-xs text-slate-500">Övningar</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-curago-600 mb-1">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="text-lg font-semibold text-slate-900">{trainingSummary.totalSectionsRead}</div>
            <div className="text-xs text-slate-500">Lästa sektioner</div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => {
          const modSummary = getModuleSummary(mod.moduleNumber)
          const isCompleted = modSummary?.moduleCompleted
          const hasStarted = modSummary && modSummary.percentage > 0

          return (
            <Link
              key={mod.moduleNumber}
              href={`/utbildning/modul-${mod.moduleNumber}`}
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
                    <span className="font-semibold">{mod.moduleNumber}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-500">
                    {mod.metadata.type}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-slate-400">
                    <Clock className="w-4 h-4" />
                    {mod.metadata.estimatedTime} min
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-curago-600 transition-colors">
                {mod.metadata.title}
              </h3>
              <p className="text-sm text-slate-500 mb-1 italic">
                {mod.metadata.subtitle}
              </p>

              {/* Module progress bar */}
              {modSummary && (
                <div className="mt-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-green-500' : 'bg-curago-500'
                        }`}
                        style={{ width: `${modSummary.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-500 min-w-[32px] text-right">
                      {modSummary.percentage}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                    <span>{modSummary.sectionsRead}/{modSummary.sectionsTotal} sektioner</span>
                    {modSummary.exercisesTotal > 0 && (
                      <span>{modSummary.exercisesCompleted}/{modSummary.exercisesTotal} övningar</span>
                    )}
                    {modSummary.quizCompleted && (
                      <span>Quiz {modSummary.quizScore}%</span>
                    )}
                  </div>
                </div>
              )}

              {/* Learning objectives preview */}
              <div className="mb-4">
                <ul className="space-y-1">
                  {mod.learningObjectives.slice(0, 3).map((obj) => (
                    <li key={obj.id} className="text-xs text-slate-500 flex items-start gap-1.5">
                      <span className="text-curago-500 mt-0.5 flex-shrink-0">•</span>
                      <span>
                        <span className="font-medium text-slate-600">{obj.verb}</span>{' '}
                        {obj.description.length > 60
                          ? obj.description.substring(0, 60) + '...'
                          : obj.description}
                      </span>
                    </li>
                  ))}
                  {mod.learningObjectives.length > 3 && (
                    <li className="text-xs text-slate-400">
                      +{mod.learningObjectives.length - 3} fler mål
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <span className="text-sm text-green-600 font-medium">Avklarad</span>
                  ) : hasStarted ? (
                    <span className="text-sm text-amber-600 font-medium">Påbörjad</span>
                  ) : (
                    <span className="text-sm text-slate-400">Ej påbörjad</span>
                  )}
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-curago-600 transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Tips */}
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
              Testa dig själv om du vill – men det är helt valfritt. Ingen annan ser dina resultat.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-slate-800 mb-2">Praktiska övningar</h3>
            <p className="text-sm text-slate-500">
              Varje modul har övningar kopplade till verkliga arbetsuppgifter. Markera som gjorda när du testat.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-slate-800 mb-2">Fördjupning</h3>
            <p className="text-sm text-slate-500">
              Externa resurser finns för dig som vill gå djupare – allt från korta videos till hela kurser.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
