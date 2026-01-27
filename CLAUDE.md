# Curago AI-utbildning

> Internt utbildningsverktyg för Curago-konsulter. Markdown-drivet kursinnehåll med progress-tracking, quiz och dark/light mode.

## Tech Stack

- **Framework**: Next.js 14.2.3 (App Router, React 18, TypeScript 5.4)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS 3.4 med CSS custom properties (design tokens i `globals.css`)
- **Ikoner**: Lucide React
- **Deploy**: Vercel (auto-deploy vid push till main)

## Kommandon

```bash
npm run dev          # Starta utvecklingsserver (localhost:3000)
npm run build        # Produktionsbygge
npx tsc --noEmit     # Typkontroll utan bygge
npm run lint         # ESLint
npx tsx scripts/test-parser.ts  # Testa markdown-parsern
```

## Projektstruktur

```
app/
├── layout.tsx                   # Root-layout (metadata, tema-script, font)
├── page.tsx                     # Landningssida (login/registrering)
├── globals.css                  # CSS-variabler (:root / .dark) + Tailwind
├── icon.svg                     # Favicon (Cg-logotyp)
├── opengraph-image.tsx          # OG-bild (1200×630, genereras med ImageResponse)
├── api/modules/route.ts         # GET /api/modules → parsade moduler som JSON
└── utbildning/
    ├── layout.tsx               # Auth-skydd, header med logotyp + tema-toggle
    ├── page.tsx                 # Dashboard (hämtar /api/modules → TrainingDashboard)
    └── [moduleId]/
        ├── page.tsx             # Modulvy (hämtar /api/modules → ModuleView)
        └── quiz/page.tsx        # Quiz (hämtar /api/modules → QuizView)

components/
├── TrainingDashboard.tsx        # Översikt med alla moduler, progress, statistik
├── ModuleView.tsx               # Modulinnehåll: sektioner, övningar, resurser
├── QuizView.tsx                 # Interaktivt quiz med feedback och resultat
├── CuragoLogo.tsx               # SVG-logotyp (Cura[svart] + go[blå])
└── ThemeToggle.tsx              # Dark/light mode toggle (localStorage)

lib/
├── markdown-parser.ts           # Konverterar .md → ParsedModule
├── progress.ts                  # localStorage CRUD + beräkning av progress
├── supabase.ts                  # Browser-klient (auth, email-validering)
└── supabase-server.ts           # Server-klient (cookies)

hooks/
└── useProgress.ts               # useModuleProgress + useTrainingProgress

types/
└── module-content.ts            # ParsedModule, QuizQuestion, Exercise, etc.

01_AI_i_kontext.md … 06_*.md     # Modulinnehåll (markdown, läses av parsern)
```

## Nyckelfiler

- **`lib/markdown-parser.ts`** — Parsern som driver allt innehåll. Läser 01-06 .md-filer och returnerar strukturerad data (`ParsedModule`).
- **`app/api/modules/route.ts`** — Enda API-endpointen. Anropar parsern vid varje request.
- **`hooks/useProgress.ts`** — Hybridlagring: localStorage (sektioner/övningar) + Supabase (quiz/modulstatus).
- **`app/globals.css`** — Alla design tokens som CSS-variabler (`:root` + `.dark`).

## Arkitektur

### Dataflöde
1. Sidor hämtar `GET /api/modules` → parsern läser .md-filer från disk
2. Komponenter renderar strukturerad data (`ParsedModule[]`)
3. Progress sparas i localStorage (granulär) + Supabase (quiz/completion)

### Auth
- Email/lösenord via Supabase Auth
- Begränsat till `@curago.se`-domänen
- Middleware skyddar `/utbildning/*`-routes

### Progress-beräkning (viktad)
- 50% sektioner lästa
- 20% övningar gjorda
- 20% quiz-resultat
- 10% modul markerad som klar

### Tema
- CSS-variabler i `:root` / `.dark` (globals.css)
- Tailwind `darkMode: 'class'`
- Inline script i `<head>` för flash-fri init
- Toggle sparar i localStorage (`'theme'`)

## Miljövariabler

```
NEXT_PUBLIC_SUPABASE_URL=<supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

## Supabase-tabeller

| Tabell | Syfte |
|--------|-------|
| `user_progress` | Quiz-resultat, modulstatus (PK: user_id + module_id) |
| `aggregate_stats` | Statistik för landningssidan |
| `auth.users` | Inbyggd Supabase-auth |

## Verifiering

Kör innan commit:
1. `npx tsc --noEmit` — inga typfel
2. `npm run lint` — inga lintfel
3. Manuell kontroll i webbläsaren om UI ändrats

## Filgränser

- **Säkra att redigera**: `app/`, `components/`, `hooks/`, `lib/`, `types/`, `01-06_*.md`
- **Redigera varsamt**: `tailwind.config.ts`, `globals.css`, `next.config.js`
- **Rör aldrig**: `node_modules/`, `.git/`, `.next/`

## Vanliga uppgifter

### Lägga till/ändra modulinnehåll
Redigera relevant `NN_*.md`-fil i projektroten. Parsern (`lib/markdown-parser.ts`) förväntar sig denna struktur:

```markdown
# Modul N: Titel
## Undertitel

**Tid:** X minuter | **Typ:** Teori/Praktik | **Status:** Aktiv

## Lärandemål
1. **Verb** beskrivning

## Nyckelbegrepp
### Term
Definition
- **Kännetecken:** punkt1, punkt2

## Huvudinnehåll
### 1. Rubrik
#### Underrubrik
Brödtext med **bold**, *italic*, listor, tabeller, promptmallar

## Praktiska övningar
### Övning 1: Titel (X min)
Instruktioner
<details><summary>Visa svar</summary>Svar</details>

## Reflektionsfrågor
1. Fråga

## Fördjupning & Externa resurser
### Kategori
| Resurs | Källa | Tid | Fokus |
|--------|-------|-----|-------|
| [Titel med länk](https://example.com) | Källa | 10 min | Beskrivning |
| [YouTube-video](https://youtube.com/watch?v=VIDEO_ID) | YouTube | 5 min | Embeddas automatiskt |

## Kunskapstest
### Fråga 1
Frågetext
- A) Alternativ
- B) Alternativ
- C) Alternativ
- D) Alternativ
**Rätt svar:** B

## Sammanfattning
- Punkt
```

### Lägga till en ny modul
1. Skapa `07_Modulnamn.md` med strukturen ovan
2. Lägg till i `parseAllModules()` i `lib/markdown-parser.ts` (filnamn + nummer)

### Ändra design tokens / färger
Redigera CSS-variablerna i `app/globals.css` (`:root` för ljust, `.dark` för mörkt).
Tailwind-klasser mappar via `tailwind.config.ts` → `background`, `foreground`, `card`, `primary`, `muted`, etc.

### Lägga till externa resurser (webb/YouTube)
Parsern stöder markdown-länkar `[text](url)` i resurstabeller och punktlistor.

**Webbsidor:** Lägg till URL i Resurs-kolumnen:
```markdown
| [AI Sweden](https://ai.se) | AI Sweden | — | Nationellt AI-center |
```
Renderas som klickbar blå länk med extern-ikon.

**YouTube-klipp:** Lägg till YouTube-URL:
```markdown
| [What is AI?](https://youtube.com/watch?v=abc123) | Google | 10 min | Intro till AI |
```
Renderas med klickbar länk + inbäddad YouTube-spelare direkt i modulvyn.

**Punktlista med länk:**
```markdown
- **[Claude.ai](https://claude.ai)** – Anthropics AI-assistent
```

### Hålla applikationen uppdaterad
- **Innehåll**: Redigera `01-06_*.md` direkt — parsern läser dem vid varje request
- **Ny modul**: Skapa `07_*.md` + registrera i `lib/markdown-parser.ts:parseAllModules()`
- **Design/färger**: Ändra CSS-variabler i `globals.css`
- **Kod**: Standardflöde — redigera, `npx tsc --noEmit`, committa, push → Vercel auto-deploy

### Lägga till en ny komponent
Följ mönstret i `components/` — `'use client'`, importera hooks/types, använd semantiska Tailwind-klasser (`bg-card`, `text-foreground`, `border-border`).
