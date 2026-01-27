import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
// Allowed email domain
const ALLOWED_DOMAIN = 'curago.se'

// Check if email is from allowed domain
export function isEmailAllowed(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  return domain === ALLOWED_DOMAIN
}

// Sign up with email and password
export async function signUp(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  // Check domain
  if (!isEmailAllowed(email)) {
    return {
      success: false,
      error: `Endast e-postadresser med @${ALLOWED_DOMAIN} kan registrera sig.`
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.toLowerCase(),
    password: password
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { success: false, error: 'Denna e-postadress är redan registrerad. Försök logga in istället.' }
    }
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  // Check domain
  if (!isEmailAllowed(email)) {
    return {
      success: false,
      error: `Endast e-postadresser med @${ALLOWED_DOMAIN} kan logga in.`
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase(),
    password: password
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { success: false, error: 'Fel e-postadress eller lösenord.' }
    }
    return { success: false, error: error.message }
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
