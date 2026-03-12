'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, ArrowRight, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { supabase, updatePassword } from '@/lib/supabase'
import CuragoLogo from '@/components/CuragoLogo'
import ThemeToggle from '@/components/ThemeToggle'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [sessionReady, setSessionReady] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true)
        setCheckingSession(false)
      }
    })

    // Also check if user already has a session (e.g. page refresh)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setSessionReady(true)
      }
      setCheckingSession(false)
    }

    checkSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Lösenordet måste vara minst 6 tecken.' })
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Lösenorden matchar inte.' })
      setLoading(false)
      return
    }

    const result = await updatePassword(password)
    if (result.success) {
      setMessage({ type: 'success', text: 'Lösenordet har uppdaterats!' })
      setTimeout(() => router.push('/utbildning'), 2000)
    } else {
      setMessage({
        type: 'error',
        text: result.error || 'Något gick fel. Försök igen.'
      })
    }

    setLoading(false)
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!sessionReady) {
    return (
      <main className="min-h-screen">
        <header className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <CuragoLogo size="md" />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto bg-card rounded-2xl shadow-lg border border-border p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Ogiltig eller utgången länk</h2>
            <p className="text-muted-foreground mb-6">
              Återställningslänken är ogiltig eller har redan använts. Begär en ny via inloggningssidan.
            </p>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Tillbaka till inloggning
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <CuragoLogo size="md" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-card rounded-2xl shadow-lg border border-border p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Välj nytt lösenord</h2>
          <p className="text-muted-foreground mb-6">
            Ange ditt nya lösenord nedan.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="Nytt lösenord"
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
              <p className="text-xs text-muted-foreground mt-1.5 ml-1">Minst 6 tecken</p>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                placeholder="Bekräfta nytt lösenord"
                className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uppdaterar...
                </>
              ) : (
                <>
                  Uppdatera lösenord
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800'
                : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800'
            }`}>
              {message.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
              {message.text}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
