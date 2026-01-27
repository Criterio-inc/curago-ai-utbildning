import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if email is in whitelist
export async function isEmailAllowed(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('allowed_emails')
    .select('email')
    .eq('email', email.toLowerCase())
    .eq('is_active', true)
    .single()

  return !error && !!data
}

// Send magic link
export async function sendMagicLink(email: string, redirectTo: string): Promise<{ success: boolean; error?: string }> {
  // First check whitelist
  const allowed = await isEmailAllowed(email)

  if (!allowed) {
    return {
      success: false,
      error: 'Denna e-postadress har inte behörighet. Kontakta din administratör.'
    }
  }

  // Send magic link
  const { error } = await supabase.auth.signInWithOtp({
    email: email.toLowerCase(),
    options: {
      emailRedirectTo: redirectTo
    }
  })

  if (error) {
    return {
      success: false,
      error: 'Kunde inte skicka inloggningslänk. Försök igen.'
    }
  }

  return { success: true }
}

// Get current user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Sign out
export async function signOut() {
  await supabase.auth.signOut()
}
