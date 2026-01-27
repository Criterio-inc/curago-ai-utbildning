# Claude Code Briefing: Curago AI-utbildning

## Projektöversikt

Implementera ett interaktivt utbildningsprogram för AI-kompetens riktat till IT-konsulter. Materialet finns som markdown-filer och ska omvandlas till en fullständig applikationsfunktionalitet.

**Repo:** https://github.com/Criterio-inc/curago-ai-utbildning.git

---

## Innehållsstruktur

### 7 markdown-filer

| Fil | Innehåll | Tid |
|-----|----------|-----|
| `00_OVERSIKT.md` | Programöversikt, mål, pedagogik | - |
| `01_AI_i_kontext.md` | AI-grunderna, LLM, konsultvärde | 45 min |
| `02_AI_i_dagliga_konsultarbetet.md` | Promptteknik, användningsfall | 60 min |
| `03_AI_i_styrning_projekt.md` | AI i projektledning, förändring | 60 min |
| `04_AI_i_kunddialog.md` | Kundkommunikation, positionering | 45 min |
| `05_Ansvar_risk_omdomme.md` | Etik, regelverk, GDPR, OSL, MBL | 60 min |
| `06_Forankring_fortsatt_larande.md` | Handlingsplan, fortsatt lärande | 30 min |

### Gemensam struktur per modul

Varje modul (01-06) innehåller dessa sektioner:
- **Lärandemål** (3-5 punkter)
- **Nyckelbegrepp** (definitioner)
- **Huvudinnehåll** (teori + exempel)
- **Praktiska övningar** (3-5 st, olika format)
- **Reflektionsfrågor** (5 st)
- **Fördjupning & externa resurser** (länkar)
- **Kunskapstest** (5 flervalsfrågor med markerat rätt svar)

---

## Datamodell (förslag)

### Module
```typescript
interface Module {
  id: string;                    // "01", "02", etc.
  slug: string;                  // "ai-i-kontext"
  title: string;                 // "AI i kontext"
  subtitle: string;              // "Från verktyg till förändringskraft"
  estimatedMinutes: number;      // 45
  order: number;                 // 1
  status: "draft" | "published";
  content: ModuleContent;
}

interface ModuleContent {
  learningObjectives: string[];
  keyConcepts: KeyConcept[];
  sections: ContentSection[];
  exercises: Exercise[];
  reflectionQuestions: string[];
  externalResources: Resource[];
  quiz: QuizQuestion[];
}

interface KeyConcept {
  term: string;
  definition: string;
}

interface ContentSection {
  id: string;
  title: string;
  content: string;              // Markdown
  order: number;
}

interface Exercise {
  id: string;
  title: string;
  type: "individual" | "pair" | "group" | "homework";
  durationMinutes: number;
  instructions: string;         // Markdown
  hint?: string;                // För <details> innehåll
}

interface Resource {
  title: string;
  url?: string;
  source: string;
  description: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: { key: string; text: string }[];
  correctAnswer: string;        // "A", "B", "C", "D"
  explanation?: string;
}
```

### UserProgress
```typescript
interface UserProgress {
  odoo
  odoo
  userId: string;
  odoo
  moduleId: string;
  status: "not_started" | "in_progress" | "completed";
  sectionsCompleted: string[];
  exercisesCompleted: string[];
  quizAttempts: QuizAttempt[];
  completedAt?: Date;
  timeSpentMinutes: number;
}

interface QuizAttempt {
  attemptedAt: Date;
  answers: { questionId: string; selectedAnswer: string }[];
  score: number;                // 0-5
  passed: boolean;              // >= 4 av 5
}
```

---

## Funktionella krav

### 1. Modulnavigering
- Lista alla moduler med status (ej påbörjad/pågående/klar)
- Visuell progress-indikator (0-100%)
- Linjär progression rekommenderad men ej tvingande

### 2. Modulvy
- Rendera markdown-innehåll
- Expanderbara sektioner för övningar
- Collapsible hints (`<details>` → accordion)
- Länkade externa resurser (öppnas i ny flik)

### 3. Quiz-funktionalitet
- 5 flervalsfrågor per modul
- Direkt feedback per fråga
- Totalresultat med "Godkänt" (≥4/5) eller "Försök igen"
- Spara bästa resultat

### 4. Progress tracking
- Markera sektioner som lästa
- Markera övningar som genomförda
- Beräkna total programprogress
- Visa uppskattad återstående tid

### 5. Certifikat/slutförande
- Generera enkel "Genomförd"-status när alla moduler klara
- Valfritt: PDF-certifikat

---

## Tekniska riktlinjer

### Markdown-parsning
Materialet innehåller:
- Standard markdown (headers, bold, italic, lists)
- Tabeller (GFM-format)
- `<details><summary>` för hints
- Emoji (🚫 ⚠️ ✅)
- Kodblock (för promptexempel)

**Rekommendation:** Använd `react-markdown` med `remark-gfm` plugin.

### Quiz-parsning
Quizfrågorna följer detta mönster i markdown:
```markdown
### Fråga 1
Frågetext här?

- A) Alternativ 1
- B) Alternativ 2
- C) Alternativ 3
- D) Alternativ 4

**Rätt svar:** B
```

Bygg en parser som extraherar detta till `QuizQuestion[]`.

### State management
- Lokal state för modulnavigering
- Persistent state (localStorage eller backend) för progress
- Optimistisk uppdatering av progress

---

## UI-komponenter (förslag)

```
/training
  ├── TrainingDashboard.tsx      # Översikt alla moduler
  ├── ModuleCard.tsx             # Kort per modul
  ├── ModuleView.tsx             # Fullständig modulvy
  ├── ContentSection.tsx         # Renderare för markdown-sektioner
  ├── ExerciseCard.tsx           # Övningskort med expandera
  ├── QuizView.tsx               # Quiz-gränssnitt
  ├── QuizQuestion.tsx           # Enskild fråga
  ├── ProgressBar.tsx            # Progress-indikator
  ├── ResourceList.tsx           # Externa resurser
  └── CertificateView.tsx        # Slutförande-vy
```

---

## Prioriteringsordning

### Fas 1: MVP
1. Markdown-parsning och rendering
2. Modulnavigering
3. Grundläggande progress (markera som läst)

### Fas 2: Interaktivitet
4. Quiz-funktionalitet
5. Progress tracking (persistent)
6. Övningshantering

### Fas 3: Polish
7. Certifikat/slutförande
8. Statistik/dashboard
9. Admin-vy för innehållsuppdatering

---

## Viktiga designbeslut att ta

1. **Var lagras content?** 
   - Alt A: Markdown-filer i repo (statiskt)
   - Alt B: Databas (CMS-liknande)
   - Alt C: Hybrid (markdown → bygg-steg → JSON)

2. **Var lagras progress?**
   - Alt A: localStorage (enklast, ej synkat)
   - Alt B: Backend/databas (kräver auth)

3. **Parsning av markdown?**
   - Alt A: Runtime (vid rendering)
   - Alt B: Build-time (generera JSON)

---

## Kontaktpunkter med DIGG/IMY-riktlinjer

Modul 5 refererar till digg.se/ai – överväg att:
- Länka direkt till riktlinjerna
- Eventuellt embedda en "Snabbguide" som sammanfattar de 18 riktlinjerna
- Hålla innehållet uppdateringsbart (riktlinjerna uppdateras löpande)

---

## Testdata

För utveckling kan du använda modul 01 som pilot:
- Kortast (45 min)
- Enkel struktur
- Bra för att validera parsning och rendering

---

*Denna briefing skapades 2025-01-27 baserat på färdigutvecklat utbildningsmaterial.*
