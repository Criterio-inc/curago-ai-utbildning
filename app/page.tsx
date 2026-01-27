'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Users, TrendingUp, CheckCircle, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'
import { supabase, signIn, signUp, isEmailAllowed } from '@/lib/supabase'

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsersToday: 0,
    avgCompletionPercentage: 0
  })

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/utbildning')
      } else {
        setCheckingAuth(false)
      }
    }

    // Fetch aggregate stats
    const fetchStats = async () => {
      const { data } = await supabase
        .from('aggregate_stats')
        .select('*')
        .order('stat_date', { ascending: false })
        .limit(1)
        .single()

      if (data) {
        setStats({
          totalUsers: data.total_users || 0,
          activeUsersToday: data.active_users_today || 0,
          avgCompletionPercentage: Math.round(data.avg_completion_percentage || 0)
        })
      }
    }

    checkAuth()
    fetchStats()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Validate email domain first
    if (!isEmailAllowed(email)) {
      setMessage({
        type: 'error',
        text: 'Endast e-postadresser med @curago.se kan använda denna tjänst.'
      })
      setLoading(false)
      return
    }

    // Validate password length
    if (password.length < 6) {
      setMessage({
        type: 'error',
        text: 'Lösenordet måste vara minst 6 tecken.'
      })
      setLoading(false)
      return
    }

    if (isRegistering) {
      // Sign up
      const result = await signUp(email, password)
      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Kontot har skapats! Du kan nu logga in.'
        })
        setIsRegistering(false)
        setPassword('')
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Något gick fel vid registrering.'
        })
      }
    } else {
      // Sign in
      const result = await signIn(email, password)
      if (result.success) {
        router.push('/utbildning')
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Något gick fel vid inloggning.'
        })
      }
    }

    setLoading(false)
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-curago-600" />
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-curago-600" />
            <span className="text-xl font-semibold text-slate-900">Curago</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          AI-utbildning för Curago
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
          Utveckla din förmåga att använda AI som ett professionellt stöd i arbete och kunddialoger.
        </p>

        {/* Login/Register Form */}
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            {isRegistering ? 'Skapa konto' : 'Logga in'}
          </h2>
          <p className="text-slate-500 mb-6">
            {isRegistering
              ? 'Registrera dig med din Curago-e-post'
              : 'Ange din Curago-e-post och lösenord'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din.email@curago.se"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-curago-500 focus:border-transparent"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Lösenord"
                className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-curago-500 focus:border-transparent"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-curago-600 text-white py-3 rounded-lg font-medium hover:bg-curago-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isRegistering ? 'Skapar konto...' : 'Loggar in...'}
                </>
              ) : (
                <>
                  {isRegistering ? 'Skapa konto' : 'Logga in'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              {isRegistering ? 'Har du redan ett konto?' : 'Har du inget konto?'}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering)
                  setMessage(null)
                }}
                className="ml-1 text-curago-600 hover:text-curago-700 font-medium"
              >
                {isRegistering ? 'Logga in' : 'Skapa konto'}
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <Users className="w-10 h-10 text-curago-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-slate-900">{stats.totalUsers}</div>
            <div className="text-slate-500">Registrerade användare</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <TrendingUp className="w-10 h-10 text-curago-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-slate-900">{stats.activeUsersToday}</div>
            <div className="text-slate-500">Aktiva idag</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <CheckCircle className="w-10 h-10 text-curago-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-slate-900">{stats.avgCompletionPercentage}%</div>
            <div className="text-slate-500">Snittframsteg</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Om utbildningen</h2>

          <div className="space-y-4 text-slate-600">
            <p>
              Denna utbildning ger dig som Curago-konsult den AI-kompetens du behöver för att
              använda AI som ett professionellt verktyg i ditt dagliga arbete och i kunddialoger.
            </p>

            <h3 className="text-lg font-medium text-slate-800 mt-6 mb-3">Utbildningen innehåller 6 moduler:</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Del 1:</strong> AI i kontext - grundförståelse och gemensamt språk</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Del 2:</strong> AI i det dagliga konsultarbetet - praktisk användning</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Del 3:</strong> AI i styrning och projekt - planering och riskhantering</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Del 4:</strong> AI i kunddialog - positionering och gränsdragning</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Del 5:</strong> Ansvar, risk och omdöme - etik och säkerhet</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Del 6:</strong> Förankring och fortsatt lärande</span>
              </li>
            </ul>

            <p className="mt-6">
              Varje modul innehåller läsmaterial, frivilliga quiz för att testa din förståelse,
              samt länkar till externa resurser för fördjupning.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-slate-500">
          <p>© {new Date().getFullYear()} Curago. Internutbildning för AI-kompetens.</p>
        </div>
      </footer>
    </main>
  )
}
