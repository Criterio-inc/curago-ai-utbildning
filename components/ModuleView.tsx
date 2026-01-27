'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle,
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Target,
  Lightbulb,
  MessageSquare,
  FileText,
  Video,
  GraduationCap,
  Wrench,
  Check,
  Circle,
} from 'lucide-react'
import { useModuleProgress } from '@/hooks/useProgress'
import type { ParsedModule, Exercise } from '@/types/module-content'

interface ModuleViewProps {
  module: ParsedModule
  allModules: ParsedModule[]
}

// ---------------------------------------------------------------------------
// ExerciseCard — med "markera som gjord"
// ---------------------------------------------------------------------------

function ExerciseCard({
  exercise,
  isCompleted,
  onToggle,
}: {
  exercise: Exercise
  isCompleted: boolean
  onToggle: () => void
}) {
  const [showSolution, setShowSolution] = useState(false)

  return (
    <div className={`rounded-lg border p-5 transition-colors ${
      isCompleted ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-start gap-3 mb-2">
        <button
          onClick={onToggle}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
            isCompleted
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-slate-300 hover:border-curago-500'
          }`}
        >
          {isCompleted && <Check className="w-3 h-3" />}
        </button>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h4 className={`font-medium ${isCompleted ? 'text-green-800' : 'text-slate-900'}`}>
              {exercise.title}
            </h4>
            {exercise.duration && (
              <span className="text-xs bg-white px-2 py-1 rounded-full text-slate-500 border border-slate-200 flex-shrink-0 ml-2">
                {exercise.duration}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="ml-8 text-sm text-slate-600 space-y-2">
        {exercise.body.split('\n\n').map((paragraph, i) => (
          <div key={i}>
            {paragraph.split('\n').map((line, j) => {
              const trimmed = line.trim()
              if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                return <p key={j} className="font-semibold text-slate-800 mt-2">{trimmed.replace(/\*\*/g, '')}</p>
              }
              if (trimmed.startsWith('- ')) {
                return <li key={j} className="ml-4 list-disc">{trimmed.slice(2)}</li>
              }
              if (/^\d+\.\s/.test(trimmed)) {
                return <li key={j} className="ml-4 list-decimal">{trimmed.replace(/^\d+\.\s/, '')}</li>
              }
              if (trimmed.startsWith('*') && trimmed.endsWith('*')) {
                return <p key={j} className="italic text-slate-500">{trimmed.replace(/\*/g, '')}</p>
              }
              if (trimmed) {
                return <p key={j}>{trimmed}</p>
              }
              return null
            })}
          </div>
        ))}
      </div>

      {exercise.solution && (
        <div className="ml-8 mt-4">
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="text-sm text-curago-600 hover:text-curago-700 font-medium flex items-center gap-1"
          >
            {showSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showSolution ? 'Dölj svar' : 'Visa svar'}
          </button>
          {showSolution && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-curago-200 text-sm text-slate-600">
              {exercise.solution.split('\n').map((line, i) => (
                <p key={i} className="mb-1">{line}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// SectionCheckbox — markera som läst
// ---------------------------------------------------------------------------

function SectionReadToggle({
  isRead,
  onToggle,
  label,
}: {
  isRead: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
        isRead
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
      }`}
    >
      {isRead ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
      {label}
    </button>
  )
}

// ---------------------------------------------------------------------------
// ModuleProgressBar
// ---------------------------------------------------------------------------

function ModuleProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className="bg-curago-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium text-slate-600 min-w-[40px] text-right">
        {percentage}%
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ModuleView
// ---------------------------------------------------------------------------

export default function ModuleView({ module, allModules }: ModuleViewProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const {
    summary,
    saving,
    toggleSection,
    toggleExercise,
    markModuleCompleted,
    isSectionRead,
    isExerciseCompleted,
  } = useModuleProgress(module.moduleNumber, module)

  const currentIndex = allModules.findIndex(m => m.moduleNumber === module.moduleNumber)
  const prevModule = currentIndex > 0 ? allModules[currentIndex - 1] : null
  const nextModule = currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null
  const moduleId = `modul-${module.moduleNumber}`

  const toggleExpand = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb */}
      <Link
        href="/utbildning"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Tillbaka till översikten
      </Link>

      {/* Module Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              summary.moduleCompleted ? 'bg-green-100 text-green-600' : 'bg-curago-100 text-curago-600'
            }`}>
              {summary.moduleCompleted ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <span className="text-lg font-bold">{module.moduleNumber}</span>
              )}
            </div>
            <div>
              <p className="text-sm text-slate-500">Del {module.moduleNumber} av {allModules.length}</p>
              <h1 className="text-2xl font-bold text-slate-900">{module.metadata.title}</h1>
              {module.metadata.subtitle && (
                <p className="text-sm text-slate-500 italic">{module.metadata.subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-500">
              {module.metadata.type}
            </span>
            <div className="flex items-center gap-1 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              {module.metadata.estimatedTime} min
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <ModuleProgressBar percentage={summary.percentage} />
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
            <span>{summary.sectionsRead}/{summary.sectionsTotal} sektioner lästa</span>
            <span>{summary.exercisesCompleted}/{summary.exercisesTotal} övningar gjorda</span>
            {summary.quizCompleted && (
              <span>Quiz: {summary.quizScore}%</span>
            )}
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-curago-600" />
            Lärandemål
          </h3>
          <ul className="space-y-1.5">
            {module.learningObjectives.map((obj) => (
              <li key={obj.id} className="text-sm text-slate-600 flex items-start gap-2">
                <Check className="w-4 h-4 text-curago-600 mt-0.5 flex-shrink-0" />
                <span>
                  <span className="font-medium text-slate-700">{obj.verb}</span> {obj.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Key Concepts */}
      {module.keyConcepts.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-curago-600" />
              Nyckelbegrepp
            </h2>
            <SectionReadToggle
              isRead={isSectionRead('concepts')}
              onToggle={() => toggleSection('concepts')}
              label={isSectionRead('concepts') ? 'Läst' : 'Markera som läst'}
            />
          </div>

          <div className="space-y-4">
            {module.keyConcepts.map((concept, idx) => (
              <div key={idx} className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-1">{concept.term}</h4>
                <p className="text-sm text-slate-600">{concept.definition}</p>
                {concept.details.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {concept.details.map((detail, i) => (
                      <li key={i} className="text-sm text-slate-500 flex items-start gap-2">
                        <span className="text-curago-500 mt-0.5">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Sections */}
      {module.contentSections.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8">
          <div className="prose max-w-none">
            {module.contentSections.map((section) => {
              const sectionKey = `content-${section.number}`
              const isExpanded = expandedSections[sectionKey] !== false
              const isRead = isSectionRead(sectionKey)

              return (
                <div key={section.number} className="mb-8 last:mb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={() => toggleExpand(sectionKey)}
                      className="flex items-center gap-3 flex-1 text-left group"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                        isRead
                          ? 'bg-green-100 text-green-600'
                          : 'bg-curago-100 text-curago-600'
                      }`}>
                        {isRead ? <Check className="w-4 h-4" /> : section.number}
                      </div>
                      <h2 className="text-xl font-semibold text-slate-800 group-hover:text-curago-600 transition-colors flex-1">
                        {section.heading}
                      </h2>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <SectionReadToggle
                      isRead={isRead}
                      onToggle={() => toggleSection(sectionKey)}
                      label={isRead ? 'Läst' : 'Läs'}
                    />
                  </div>

                  {isExpanded && (
                    <div className="ml-11">
                      {section.subsections.map((sub, subIdx) => (
                        <div key={subIdx} className="mb-6 last:mb-0">
                          {sub.heading && !sub.heading.startsWith('|') && !sub.heading.startsWith('**') && (
                            <h3 className="text-lg font-medium text-slate-700 mb-3">
                              {sub.heading.replace(/\*\*/g, '')}
                            </h3>
                          )}

                          {sub.tables.map((table, tIdx) => (
                            <div key={tIdx} className="overflow-x-auto mb-4">
                              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                                <thead>
                                  <tr className="bg-slate-50">
                                    {table.headers.map((h, hIdx) => (
                                      <th key={hIdx} className="text-left p-3 font-medium text-slate-700 border-b border-slate-200">
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {table.rows.map((row, rIdx) => (
                                    <tr key={rIdx} className="border-b border-slate-100 last:border-0">
                                      {table.headers.map((h, hIdx) => (
                                        <td key={hIdx} className="p-3 text-slate-600">
                                          {row[h]}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ))}

                          {sub.promptTemplates.map((tmpl, pIdx) => (
                            <div key={pIdx} className="mb-4">
                              <p className="text-sm font-medium text-slate-700 mb-2">
                                Promptmall – {tmpl.title}:
                              </p>
                              <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-sm overflow-x-auto whitespace-pre-wrap">
                                {tmpl.content}
                              </pre>
                            </div>
                          ))}

                          {sub.tables.length === 0 && sub.promptTemplates.length === 0 && (
                            <div className="text-sm text-slate-600 space-y-2">
                              {sub.body.split('\n').map((line, lIdx) => {
                                const trimmed = line.trim()
                                if (!trimmed) return null
                                if (trimmed.startsWith('|')) return null
                                if (trimmed.startsWith('```')) return null
                                if (trimmed.startsWith('> ')) {
                                  return (
                                    <blockquote key={lIdx} className="border-l-4 border-curago-500 pl-4 italic text-slate-600 my-3">
                                      {trimmed.slice(2).replace(/\*\*/g, '')}
                                    </blockquote>
                                  )
                                }
                                if (trimmed.startsWith('- ')) {
                                  return (
                                    <li key={lIdx} className="ml-4 list-disc">
                                      <span dangerouslySetInnerHTML={{
                                        __html: trimmed.slice(2)
                                          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                                          .replace(/\*(.+?)\*/g, '<em>$1</em>')
                                      }} />
                                    </li>
                                  )
                                }
                                return (
                                  <p key={lIdx}>
                                    <span dangerouslySetInnerHTML={{
                                      __html: trimmed
                                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                                        .replace(/\*(.+?)\*/g, '<em>$1</em>')
                                    }} />
                                  </p>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Practical Examples */}
      {module.practicalExamples.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-curago-600" />
              Praktiska exempel
            </h2>
            <SectionReadToggle
              isRead={isSectionRead('examples')}
              onToggle={() => toggleSection('examples')}
              label={isSectionRead('examples') ? 'Läst' : 'Markera som läst'}
            />
          </div>

          <div className="space-y-4">
            {module.practicalExamples.map((example) => (
              <div key={example.id} className="bg-slate-50 rounded-lg p-5">
                <h4 className="font-medium text-slate-900 mb-2">{example.title}</h4>
                <div className="text-sm text-slate-600 space-y-2">
                  {example.body.split('\n\n').map((paragraph, i) => (
                    <div key={i}>
                      {paragraph.split('\n').map((line, j) => {
                        const trimmed = line.trim()
                        if (!trimmed) return null
                        if (trimmed.startsWith('**') && trimmed.includes(':**')) {
                          const label = trimmed.match(/\*\*(.+?)\*\*/)?.[1] || ''
                          const rest = trimmed.replace(/\*\*.+?\*\*\s*/, '')
                          return (
                            <p key={j}>
                              <span className="font-semibold text-slate-800">{label}</span> {rest}
                            </p>
                          )
                        }
                        if (trimmed.startsWith('- ')) {
                          return <li key={j} className="ml-4 list-disc">{trimmed.slice(2)}</li>
                        }
                        if (trimmed === '---') return null
                        return <p key={j}>{trimmed}</p>
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercises */}
      {module.exercises.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-curago-600" />
              Praktiska övningar
            </h2>
            <span className="text-xs text-slate-500">
              {summary.exercisesCompleted}/{summary.exercisesTotal} gjorda
            </span>
          </div>

          <div className="space-y-4">
            {module.exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                isCompleted={isExerciseCompleted(exercise.id)}
                onToggle={() => toggleExercise(exercise.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Reflection Questions */}
      {module.reflectionQuestions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-curago-600" />
              Reflektionsfrågor
            </h2>
            <SectionReadToggle
              isRead={isSectionRead('reflections')}
              onToggle={() => toggleSection('reflections')}
              label={isSectionRead('reflections') ? 'Läst' : 'Markera som läst'}
            />
          </div>

          <ol className="space-y-3">
            {module.reflectionQuestions.map((q, idx) => (
              <li key={q.id} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-curago-100 text-curago-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  {idx + 1}
                </span>
                <p className="text-sm text-slate-600 pt-0.5">{q.text}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* External Resources */}
      {module.externalResources.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-curago-600" />
            Fördjupning & externa resurser
          </h2>

          <div className="space-y-6">
            {module.externalResources.map((group, gIdx) => (
              <div key={gIdx}>
                <h3 className="text-sm font-medium text-slate-700 mb-3">{group.category}</h3>
                <div className="space-y-2">
                  {group.resources.map((resource, rIdx) => (
                    <div
                      key={rIdx}
                      className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-slate-900">{resource.title}</span>
                          {resource.source && (
                            <span className="text-xs text-slate-400">{resource.source}</span>
                          )}
                          {resource.duration && (
                            <span className="text-xs text-slate-400">• {resource.duration}</span>
                          )}
                        </div>
                        {resource.description && (
                          <p className="text-xs text-slate-500 mt-0.5">{resource.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz CTA */}
      {module.quiz.length > 0 && (
        <div className={`rounded-2xl border p-6 mb-8 ${
          summary.quizCompleted
            ? 'bg-green-50 border-green-200'
            : 'bg-curago-50 border-curago-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                {summary.quizCompleted ? 'Quiz avklarat' : 'Testa din kunskap'}
              </h3>
              <p className="text-sm text-slate-600">
                {summary.quizCompleted
                  ? `Resultat: ${summary.quizScore}% — ${module.quiz.length} frågor`
                  : `Frivilligt quiz med ${module.quiz.length} frågor`}
              </p>
            </div>
            <Link
              href={`/utbildning/${moduleId}/quiz`}
              className="bg-curago-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-curago-700 transition-colors flex items-center gap-2"
            >
              {summary.quizCompleted ? 'Gör om' : 'Starta quiz'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Summary */}
      {module.summary.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Sammanfattning</h2>
          <ul className="space-y-2">
            {module.summary.map((point, idx) => (
              <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                <Check className="w-4 h-4 text-curago-600 mt-0.5 flex-shrink-0" />
                {point.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mark as Completed */}
      {!summary.moduleCompleted && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 text-center">
          <p className="text-slate-600 mb-4">Har du gått igenom modulen?</p>
          <button
            onClick={markModuleCompleted}
            disabled={saving}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {saving ? 'Sparar...' : 'Markera som avklarad'}
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {prevModule ? (
          <Link
            href={`/utbildning/modul-${prevModule.moduleNumber}`}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <div>
              <p className="text-xs text-slate-400">Föregående</p>
              <p className="font-medium">{prevModule.metadata.title}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextModule ? (
          <Link
            href={`/utbildning/modul-${nextModule.moduleNumber}`}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-right"
          >
            <div>
              <p className="text-xs text-slate-400">Nästa</p>
              <p className="font-medium">{nextModule.metadata.title}</p>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Link>
        ) : (
          <Link
            href="/utbildning"
            className="flex items-center gap-2 text-curago-600 hover:text-curago-700"
          >
            <div className="text-right">
              <p className="text-xs text-slate-400">Slutförd!</p>
              <p className="font-medium">Tillbaka till översikten</p>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Link>
        )}
      </div>
    </div>
  )
}
