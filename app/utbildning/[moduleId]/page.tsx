'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Wrench,
  GraduationCap,
  Check
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getModuleById, getModules } from '@/lib/modules'
import { ExternalResource } from '@/types'

const resourceTypeIcons: Record<string, any> = {
  video: Video,
  article: FileText,
  course: GraduationCap,
  tool: Wrench,
}

export default function ModulePage() {
  const params = useParams()
  const router = useRouter()
  const moduleId = params.moduleId as string
  const module = getModuleById(moduleId)
  const modules = getModules()

  const [completed, setCompleted] = useState(false)
  const [completedResources, setCompletedResources] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user && module) {
        // Fetch module progress
        const { data: moduleProgress } = await supabase
          .from('user_progress')
          .select('completed')
          .eq('user_id', user.id)
          .eq('module_id', module.id)
          .single()

        if (moduleProgress) {
          setCompleted(moduleProgress.completed)
        }

        // Fetch resource progress
        const { data: resourceProgress } = await supabase
          .from('resource_progress')
          .select('resource_id')
          .eq('user_id', user.id)
          .eq('module_id', module.id)
          .eq('completed', true)

        if (resourceProgress) {
          setCompletedResources(resourceProgress.map(r => r.resource_id))
        }
      }
    }

    fetchProgress()
  }, [module])

  if (!module) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Modulen hittades inte</h1>
        <Link href="/utbildning" className="text-curago-600 hover:underline">
          Tillbaka till översikten
        </Link>
      </div>
    )
  }

  const currentIndex = modules.findIndex(m => m.id === module.id)
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null

  const markAsCompleted = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase.from('user_progress').upsert({
        user_id: user.id,
        module_id: module.id,
        completed: true,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,module_id'
      })

      setCompleted(true)
    }

    setSaving(false)
  }

  const toggleResourceCompleted = async (resourceId: string) => {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const isCurrentlyCompleted = completedResources.includes(resourceId)

      if (isCurrentlyCompleted) {
        // Remove from completed
        await supabase
          .from('resource_progress')
          .delete()
          .eq('user_id', user.id)
          .eq('resource_id', resourceId)

        setCompletedResources(prev => prev.filter(id => id !== resourceId))
      } else {
        // Add to completed
        await supabase.from('resource_progress').upsert({
          user_id: user.id,
          resource_id: resourceId,
          module_id: module.id,
          completed: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,resource_id'
        })

        setCompletedResources(prev => [...prev, resourceId])
      }
    }
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
              completed ? 'bg-green-100 text-green-600' : 'bg-curago-100 text-curago-600'
            }`}>
              {completed ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <span className="text-lg font-bold">{module.number}</span>
              )}
            </div>
            <div>
              <p className="text-sm text-slate-500">Del {module.number} av {modules.length}</p>
              <h1 className="text-2xl font-bold text-slate-900">{module.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-400">
            <Clock className="w-4 h-4" />
            {module.estimatedTime} min
          </div>
        </div>

        <p className="text-slate-600 mb-4">{module.description}</p>

        {/* Key Points */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2">I denna modul lär du dig:</h3>
          <ul className="space-y-1">
            {module.keyPoints.map((point, idx) => (
              <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                <Check className="w-4 h-4 text-curago-600 mt-0.5 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Module Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{
          __html: module.content
            .split('\n')
            .map(line => {
              if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`
              if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`
              if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`
              if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`
              if (line.startsWith('> ')) return `<blockquote>${line.slice(2)}</blockquote>`
              if (line.startsWith('**') && line.endsWith('**')) return `<strong>${line.slice(2, -2)}</strong>`
              if (line.trim() === '') return '<br/>'
              return `<p>${line}</p>`
            })
            .join('')
            .replace(/<\/li>\n?<li>/g, '</li><li>')
            .replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>')
        }} />
      </div>

      {/* External Resources */}
      {module.externalResources.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-curago-600" />
            Fördjupning & externa resurser
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Frivilliga resurser för dig som vill lära dig mer
          </p>

          <div className="space-y-3">
            {module.externalResources.map((resource) => {
              const Icon = resourceTypeIcons[resource.type] || FileText
              const isResourceCompleted = completedResources.includes(resource.id)

              return (
                <div
                  key={resource.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                    isResourceCompleted
                      ? 'bg-green-50 border-green-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <button
                    onClick={() => toggleResourceCompleted(resource.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${
                      isResourceCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-slate-300 hover:border-curago-500'
                    }`}
                  >
                    {isResourceCompleted && <Check className="w-4 h-4" />}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-400 uppercase">{resource.type}</span>
                      {resource.duration && (
                        <span className="text-xs text-slate-400">• {resource.duration}</span>
                      )}
                    </div>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-slate-900 hover:text-curago-600 flex items-center gap-1"
                    >
                      {resource.title}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    {resource.provider && (
                      <p className="text-sm text-slate-500">{resource.provider}</p>
                    )}
                    <p className="text-sm text-slate-500 mt-1">{resource.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quiz CTA */}
      {module.quiz && (
        <div className="bg-curago-50 rounded-2xl border border-curago-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Testa din kunskap
              </h3>
              <p className="text-sm text-slate-600">
                Frivilligt quiz med {module.quiz.questions.length} frågor
              </p>
            </div>
            <Link
              href={`/utbildning/${module.id}/quiz`}
              className="bg-curago-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-curago-700 transition-colors flex items-center gap-2"
            >
              Starta quiz
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Mark as Completed */}
      {!completed && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 text-center">
          <p className="text-slate-600 mb-4">Har du läst igenom modulen?</p>
          <button
            onClick={markAsCompleted}
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
            href={`/utbildning/${prevModule.id}`}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <div>
              <p className="text-xs text-slate-400">Föregående</p>
              <p className="font-medium">{prevModule.title}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextModule ? (
          <Link
            href={`/utbildning/${nextModule.id}`}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-right"
          >
            <div>
              <p className="text-xs text-slate-400">Nästa</p>
              <p className="font-medium">{nextModule.title}</p>
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
