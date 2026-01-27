# Curago AI-utbildning

En webbaserad utbildningsplattform för Curagos konsulter med fokus på AI-kompetens.

## Kom igång

### Miljövariabler

Skapa en `.env.local` fil med följande variabler:

```
NEXT_PUBLIC_SUPABASE_URL=din-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=din-anon-key
```

### Utveckling

```bash
npm install
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

### Deployment

Projektet är konfigurerat för Vercel. Push till `main`-branchen triggar automatisk deployment.

## Hantera användare

Lägg till användare i Supabase → Table Editor → `allowed_emails`:

```sql
INSERT INTO allowed_emails (email) VALUES ('ny.användare@curago.se');
```

## Teknisk stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Hosting**: Vercel
