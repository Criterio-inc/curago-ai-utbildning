'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Home, LogOut, Menu, X, User, Loader2 } from 'lucide-react'
import { supabase, signOut } from '@/lib/supabase'

export default function UtbildningLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/')
        return
      }

      setUser(session.user)
      setLoading(false)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-curago-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/utbildning" className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-curago-600" />
              <span className="text-xl font-semibold text-slate-900">Curago AI</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/utbildning"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/utbildning'
                    ? 'text-curago-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  Översikt
                </span>
              </Link>
            </nav>

            {/* User Menu */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-slate-500 flex items-center gap-2">
                <User className="w-4 h-4" />
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                Logga ut
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-600" />
              ) : (
                <Menu className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link
                href="/utbildning"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-600 hover:text-slate-900"
              >
                Översikt
              </Link>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500 mb-2">{user?.email}</p>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Logga ut
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Curago. Internutbildning för AI-kompetens.
        </div>
      </footer>
    </div>
  )
}
