'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, TrendingUp, CheckCircle, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'
import { supabase, signIn, signUp, isEmailAllowed } from '@/lib/supabase'
import CuragoLogo from '@/components/CuragoLogo'
import ThemeToggle from '@/components/ThemeToggle'

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
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/utbildning')
      } else {
        setCheckingAuth(false)
      }
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats')
        if (res.ok) {
          const data = await res.json()
          setStats({
            totalUsers: data.total_users || 0,
            activeUsersToday: data.active_users_today || 0,
            avgCompletionPercentage: Math.round(data.avg_completion_percentage || 0)
          })
        }
      } catch {
        // Stats are non-critical — keep defaults (0)
      }
    }

    checkAuth()
    fetchStats()

    // Uppdatera statistiken var 30:e sekund
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!isEmailAllowed(email)) {
      setMessage({
        type: 'error',
        text: 'Endast e-postadresser med @curago.se kan använda denna tjänst.'
      })
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage({
        type: 'error',
        text: 'Lösenordet måste vara minst 6 tecken.'
      })
      setLoading(false)
      return
    }

    if (isRegistering) {
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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <CuragoLogo size="md" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          AI-utbildning för Curago
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Utveckla din förmåga att använda AI som ett professionellt stöd i arbete och kunddialoger.
        </p>

        {/* Login/Register Form */}
        <div className="max-w-md mx-auto bg-card rounded-2xl shadow-lg border border-border p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {isRegistering ? 'Skapa konto' : 'Logga in'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isRegistering
              ? 'Registrera dig med din Curago-e-post'
              : 'Ange din Curago-e-post och lösenord'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din.email@curago.se"
                className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Lösenord"
                className="w-full pl-10 pr-12 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800'
                : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {isRegistering ? 'Har du redan ett konto?' : 'Har du inget konto?'}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering)
                  setMessage(null)
                }}
                className="ml-1 text-primary hover:underline font-medium"
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
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <Users className="w-10 h-10 text-primary mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground">{stats.totalUsers}</div>
            <div className="text-muted-foreground">Registrerade användare</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground">{stats.activeUsersToday}</div>
            <div className="text-muted-foreground">Aktiva idag</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <CheckCircle className="w-10 h-10 text-primary mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground">{stats.avgCompletionPercentage}%</div>
            <div className="text-muted-foreground">Snittframsteg</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-card rounded-2xl border border-border p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Om utbildningen</h2>

          <div className="space-y-4 text-muted-foreground">
            <p>
              Denna utbildning ger dig som Curago-konsult den AI-kompetens du behöver för att
              använda AI som ett professionellt verktyg i ditt dagliga arbete och i kunddialoger.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Utbildningen innehåller 6 moduler:</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Del 1:</strong> AI i kontext - grundförståelse och gemensamt språk</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Del 2:</strong> AI i det dagliga konsultarbetet - praktisk användning</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Del 3:</strong> AI i styrning och projekt - planering och riskhantering</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Del 4:</strong> AI i kunddialog - positionering och gränsdragning</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Del 5:</strong> Ansvar, risk och omdöme - etik och säkerhet</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Del 6:</strong> Förankring och fortsatt lärande</span>
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
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Curago. Internutbildning för AI-kompetens.</p>
        </div>
      </footer>
    </main>
  )
}
