# Curago AI-utbildning

> Internt utbildningsverktyg för Curago-konsulter. Markdown-drivet kursinnehåll med progress-tracking, quiz och dark/light mode.

## Tech Stack

- **Framework**: Next.js 14.2.3 (App Router, React 18, TypeScript 5.4)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS 3.4 med CSS custom properties (design tokens i `globals.css`)
- **Ikoner**: Lucide React
- **Deploy**: Vercel (auto-deploy vid push till main)

---

## Snabbguide: Uppdatera innehåll (utan kodkunskap)

Allt kursinnehåll ligger i vanliga textfiler (markdown) i projektmappen. Du redigerar dem med valfri textredigerare — inga programmeringsverktyg behövs.

### Redigera befintligt modulinnehåll

1. Öppna filen för modulen du vill ändra, t.ex. `01_AI_i_kontext.md`
   - Filerna heter `01_…`, `02_…` upp till `06_…` och ligger i projektets rotmapp
2. Gör dina ändringar i texten — formateringen är enkel:
   - `# Rubrik` = stor rubrik
   - `## Underrubrik` = mellanrubrik
   - `**fetstil**` = fetstil
   - `*kursiv*` = kursiv
   - `- punkt` = punktlista
3. Spara filen
4. Ändringarna syns automatiskt nästa gång sidan laddas

### Lägga till en webbsidelänk i resurser

I sektionen `## Fördjupning & Externa resurser` i en modulfil, lägg till en rad i tabellen:

```
| [Namn på sidan](https://adressen.se) | Källa | Tid | Kort beskrivning |
```

**Exempel — lägga till AI Swedens webbsida:**
```
| [AI Sweden](https://ai.se) | AI Sweden | — | Nationellt AI-center |
```

Resultatet i appen: en klickbar blå länk som öppnas i ny flik.

### Lägga till ett YouTube-klipp

Samma tabell som ovan, men med en YouTube-adress:

```
| [Namn på videon](https://youtube.com/watch?v=VIDEO_ID) | Källa | Tid | Beskrivning |
```

**Exempel — lägga till en introduktionsvideo:**
```
| [What is AI?](https://youtube.com/watch?v=ad79nYk2keg) | Google | 10 min | Intro till AI |
```

Resultatet i appen: en klickbar länk **plus** en inbäddad YouTube-spelare direkt på sidan.

> Tips: `VIDEO_ID` hittar du i YouTube-adressen efter `watch?v=`. T.ex. i `https://youtube.com/watch?v=ad79nYk2keg` är ID:t `ad79nYk2keg`.

### Lägga till en helt ny modul

1. Skapa en ny fil i projektmappen, t.ex. `07_Ny_modul.md`
2. Kopiera strukturen från en befintlig modulfil (t.ex. `01_AI_i_kontext.md`) och byt ut innehållet
3. Se till att filen börjar med:
   ```
   # Modul 7: Din titel här
   ## Din undertitel

   **Tid:** X minuter | **Typ:** Teori | **Status:** Aktiv
   ```
4. **OBS — detta steg kräver en utvecklare:** Filen behöver registreras i koden (`lib/markdown-parser.ts`). Be en utvecklare lägga till filnamnet i funktionen `parseAllModules()`.

### Publicera ändringar (deploy)

Appen uppdateras automatiskt när ändringar pushas till `main`-branchen i GitHub:

1. Spara dina filändringar
2. I terminalen (eller GitHub Desktop):
   ```
   git add .
   git commit -m "Uppdaterat modulinnehåll"
   git push
   ```
3. Vercel bygger och publicerar automatiskt — klart inom ca 1–2 minuter

> Om du inte är van vid Git: be en kollega hjälpa dig första gången, eller redigera filerna direkt i GitHubs webbgränssnitt (klicka på filen → pennikonen → spara).

---

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
