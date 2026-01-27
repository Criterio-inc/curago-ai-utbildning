'use client'

import { useState, useEffect } from 'react'
import TrainingDashboard from '@/components/TrainingDashboard'
import type { ParsedModule } from '@/types/module-content'

export default function ParsedDashboardPage() {
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
        <p className="text-slate-500 mt-4">Laddar moduler...</p>
      </div>
    )
  }

  return <TrainingDashboard modules={modules} />
}
