'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ModuleView from '@/components/ModuleView'
import type { ParsedModule } from '@/types/module-content'

export default function ModulePage() {
  const params = useParams()
  const moduleId = params.moduleId as string
  const [modules, setModules] = useState<ParsedModule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadModules() {
      const res = await fetch('/api/modules')
      const data = await res.json()
      setModules(data)
      setLoading(false)
    }
    loadModules()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-curago-600 mx-auto" />
        <p className="text-slate-500 mt-4">Laddar modul...</p>
      </div>
    )
  }

  const moduleNumber = parseInt(moduleId.replace('modul-', ''), 10)
  const module = modules.find(m => m.moduleNumber === moduleNumber)

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

  return <ModuleView module={module} allModules={modules} />
}
