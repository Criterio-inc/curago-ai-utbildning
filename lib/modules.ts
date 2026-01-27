import { Module, ExternalResource } from '@/types'

const externalResources: Record<string, ExternalResource[]> = {
  'modul-1': [
    {
      id: 'r1-1',
      title: 'AI for Everyone',
      type: 'course',
      url: 'https://www.coursera.org/learn/ai-for-everyone',
      duration: '4 timmar',
      provider: 'Coursera / Andrew Ng',
      description: 'Grundläggande introduktion till AI för icke-tekniker'
    },
    {
      id: 'r1-2',
      title: 'What is Generative AI?',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=G2fqAlgmoPo',
      duration: '10 min',
      provider: 'Google',
      description: 'Kort förklaring av generativ AI'
    }
  ],
  'modul-2': [
    {
      id: 'r2-1',
      title: 'Prompt Engineering Guide',
      type: 'article',
      url: 'https://www.promptingguide.ai/',
      description: 'Omfattande guide till effektiva prompts'
    },
    {
      id: 'r2-2',
      title: 'ChatGPT',
      type: 'tool',
      url: 'https://chat.openai.com',
      provider: 'OpenAI',
      description: 'Praktisera direkt med ChatGPT'
    },
    {
      id: 'r2-3',
      title: 'Claude',
      type: 'tool',
      url: 'https://claude.ai',
      provider: 'Anthropic',
      description: 'Alternativ AI-assistent'
    }
  ],
  'modul-3': [
    {
      id: 'r3-1',
      title: 'AI for Project Management',
      type: 'article',
      url: 'https://www.pmi.org/learning/library/artificial-intelligence-project-management',
      provider: 'PMI',
      description: 'Hur AI påverkar projektledning'
    }
  ],
  'modul-4': [
    {
      id: 'r4-1',
      title: 'How to Talk to Clients About AI',
      type: 'article',
      url: 'https://hbr.org/2023/09/how-to-talk-to-your-team-about-ai',
      provider: 'Harvard Business Review',
      description: 'Kommunikationsstrategier kring AI'
    }
  ],
  'modul-5': [
    {
      id: 'r5-1',
      title: 'EU AI Act Summary',
      type: 'article',
      url: 'https://artificialintelligenceact.eu/',
      description: 'Översikt av EUs AI-förordning'
    },
    {
      id: 'r5-2',
      title: 'Responsible AI Practices',
      type: 'article',
      url: 'https://ai.google/responsibility/responsible-ai-practices/',
      provider: 'Google',
      description: 'Googles riktlinjer för ansvarsfull AI'
    }
  ],
  'modul-6': [
    {
      id: 'r6-1',
      title: 'AI News & Updates',
      type: 'article',
      url: 'https://www.technologyreview.com/artificial-intelligence/',
      provider: 'MIT Technology Review',
      description: 'Håll dig uppdaterad om AI-utvecklingen'
    }
  ]
}

export const modules: Module[] = [
  {
    id: 'modul-1',
    number: 1,
    title: 'AI i kontext',
    description: 'Grundförståelse, gemensamt språk, skillnaden mellan analytisk och generativ AI',
    estimatedTime: 45,
    keyPoints: [
      'Vad AI är och inte är',
      'Skillnaden mellan analytisk och generativ AI',
      'Vanliga missuppfattningar om AI',
      'AI som verktyg, inte ersättare'
    ],
    content: `
# Del 1: AI i kontext

## Syfte
Skapa en gemensam grund och ett gemensamt språk kring AI. Efter denna modul ska du förstå skillnaden mellan analytisk och generativ AI, samt kunna förklara vad AI är och inte är.

## Vad är AI?

AI (artificiell intelligens) är ett samlingsbegrepp för system som kan utföra uppgifter som traditionellt kräver mänsklig intelligens. Det handlar om datorsystem som kan lära sig från data, identifiera mönster och fatta beslut.

### Viktigt att förstå

AI är **inte** en allvetande superintelligens. Det är matematiska modeller som är tränade på stora mängder data för att utföra specifika uppgifter.

## Analytisk vs Generativ AI

### Analytisk AI
- Analyserar och klassificerar befintlig data
- Identifierar mönster och gör förutsägelser
- Exempel: bedrägeridetektering, rekommendationssystem, bildklassificering

### Generativ AI
- Skapar nytt innehåll (text, bild, kod, ljud)
- Tränad på stora datamängder för att producera liknande innehåll
- Exempel: ChatGPT, Claude, DALL-E, Midjourney

## Vanliga missuppfattningar

1. **"AI förstår som en människa"** - Nej, AI processar mönster utan verklig förståelse
2. **"AI är alltid rätt"** - Nej, AI kan producera felaktig information (hallucinationer)
3. **"AI kommer ersätta alla jobb"** - Troligare att AI transformerar hur vi arbetar
4. **"AI är neutral"** - AI kan ha bias baserat på träningsdata

## AI som konsultförmåga

På Curago ser vi AI som en del av konsultens verktygslåda - inte som en specialisering.

Målet är **skickliggörande**: att varje konsult kan använda AI som stöd för tänkande, inte som ersättning för omdöme.
    `,
    externalResources: externalResources['modul-1'],
    quiz: {
      passingScore: 70,
      questions: [
        {
          id: 'q1-1',
          text: 'Vad är den huvudsakliga skillnaden mellan analytisk och generativ AI?',
          options: [
            'Analytisk AI är snabbare än generativ AI',
            'Analytisk AI analyserar data medan generativ AI skapar nytt innehåll',
            'Generativ AI är mer exakt än analytisk AI',
            'Det finns ingen skillnad'
          ],
          correctAnswer: 1,
          explanation: 'Analytisk AI fokuserar på att analysera befintlig data och hitta mönster, medan generativ AI skapar helt nytt innehåll baserat på vad den lärt sig.'
        },
        {
          id: 'q1-2',
          text: 'Vilken av dessa är en vanlig missuppfattning om AI?',
          options: [
            'AI är tränad på data',
            'AI kan hjälpa med textbearbetning',
            'AI förstår information precis som en människa',
            'AI kan göra fel'
          ],
          correctAnswer: 2,
          explanation: 'AI processar mönster matematiskt men har ingen verklig förståelse på det sätt människor har. Det är en viktig distinktion att vara medveten om.'
        },
        {
          id: 'q1-3',
          text: 'Hur ser Curago på AI i konsultarbetet?',
          options: [
            'Som en specialisering för utvalda konsulter',
            'Som en del av varje konsults verktygslåda',
            'Som något att undvika i kunduppdrag',
            'Som en ersättning för konsulter'
          ],
          correctAnswer: 1,
          explanation: 'Curago ser AI som en konsultförmåga som alla bör behärska - en del av verktygslådan, inte en specialisering för några få.'
        }
      ]
    }
  },
  {
    id: 'modul-2',
    number: 2,
    title: 'AI i det dagliga konsultarbetet',
    description: 'Praktisk användning för analys, strukturering, beslutsunderlag och textbearbetning',
    estimatedTime: 60,
    keyPoints: [
      'Effektiv promptning',
      'Analys och strukturering av information',
      'Textbearbetning och sammanfattningar',
      'Beslutsunderlag och kvalitetssäkring'
    ],
    content: `
# Del 2: AI i det dagliga konsultarbetet

## Syfte
Ge dig praktiska verktyg för att använda AI som stöd i ditt dagliga arbete. Fokus ligger på konkreta tillämpningar som ökar din effektivitet.

## Effektiv promptning

En "prompt" är instruktionen du ger till AI:n. Kvaliteten på ditt svar beror ofta på kvaliteten på din prompt.

### Grundprinciper

1. **Var specifik** - Beskriv vad du vill ha och i vilket format
2. **Ge kontext** - Förklara situationen och syftet
3. **Definiera roll** - Be AI:n agera som expert inom relevant område
4. **Iterera** - Förfina genom följdfrågor

### Exempel på effektiv prompt

*Svag prompt:*
> "Skriv om projektledning"

*Stark prompt:*
> "Agera som en erfaren projektledare inom IT. Jag behöver en strukturerad sammanfattning (max 500 ord) av de fem viktigaste framgångsfaktorerna för IT-projekt i offentlig sektor. Inkludera konkreta exempel."

## Praktiska användningsområden

### Analys och strukturering
- Sammanfatta långa dokument och rapporter
- Identifiera huvudteman i intervjumaterial
- Strukturera ostrukturerad information

### Textbearbetning
- Förbättra tydlighet och läsbarhet
- Anpassa ton för olika målgrupper
- Översätta mellan språk

### Beslutsunderlag
- Identifiera för- och nackdelar med olika alternativ
- Strukturera argumentation
- Hitta blinda fläckar i resonemang

## Kvalitetssäkring

Kom ihåg: AI är ett stöd, inte en ersättning för ditt omdöme.

**Kontrollera alltid:**
- Faktauppgifter och siffror
- Källhänvisningar
- Logiska resonemang
- Att output matchar verksamhetens kontext
    `,
    externalResources: externalResources['modul-2'],
    quiz: {
      passingScore: 70,
      questions: [
        {
          id: 'q2-1',
          text: 'Vilken av dessa är en princip för effektiv promptning?',
          options: [
            'Håll prompten så kort som möjligt',
            'Undvik att ge kontext',
            'Var specifik och ge relevant kontext',
            'Använd alltid samma prompt'
          ],
          correctAnswer: 2,
          explanation: 'Specifika prompts med relevant kontext ger mycket bättre resultat än vaga eller generella instruktioner.'
        },
        {
          id: 'q2-2',
          text: 'Vad bör du alltid göra med AI-genererat innehåll?',
          options: [
            'Använda det direkt utan ändringar',
            'Kontrollera fakta och kvalitetssäkra',
            'Ignorera det helt',
            'Bara använda det för privat bruk'
          ],
          correctAnswer: 1,
          explanation: 'AI kan producera fel eller "hallucinera" fakta. Det är alltid ditt ansvar att kvalitetssäkra innehållet innan du använder det.'
        }
      ]
    }
  },
  {
    id: 'modul-3',
    number: 3,
    title: 'AI i styrning, projekt och förändringsarbete',
    description: 'Planering, prioritering, riskhantering och scenarioanalys',
    estimatedTime: 60,
    keyPoints: [
      'AI som stöd i planering och prioritering',
      'Riskidentifiering och scenarioanalys',
      'Uppföljning och statusrapportering',
      'Förändringsledning i AI-kontext'
    ],
    content: `
# Del 3: AI i styrning, projekt och förändringsarbete

## Syfte
Utforska hur AI kan stödja strategiskt arbete med styrning, projektledning och organisatorisk förändring.

## AI i planering och prioritering

### Strukturera komplexitet
AI kan hjälpa dig att:
- Bryta ner stora initiativ i hanterbara delar
- Identifiera beroenden mellan aktiviteter
- Generera alternativa tillvägagångssätt

### Prioriteringsramverk
Använd AI för att:
- Tillämpa prioriteringsmatriser på din backlog
- Identifiera quick wins vs strategiska satsningar
- Balansera kortsiktiga och långsiktiga mål

## Riskhantering

### Riskidentifiering
AI kan agera "djävulens advokat" och hjälpa dig:
- Identifiera blinda fläckar i din planering
- Generera tänkbara riskscenarier
- Utmana antaganden

### Scenarioanalys
- Utforska "vad om"-scenarier
- Stresstesta planer mot olika förutsättningar
- Identifiera tidiga varningssignaler

## Förändringsledning

AI-initiativ innebär ofta organisatorisk förändring. Viktiga aspekter:

### Påverkan på roller
- AI förändrar hur arbete utförs, inte bara vad som görs
- Var transparent om förändringen
- Fokusera på transformation, inte elimination

### Motstånd och acceptans
- Förstå oron bakom motståndet
- Involvera medarbetare tidigt
- Visa konkret nytta

### Curagos 5-stegsmodell
1. **Syfte** - Varför gör vi detta?
2. **Värde** - Vad skapar faktisk nytta?
3. **Möjligheter och hinder** - Vad är realistiskt?
4. **Prioritering** - Vad ska vi göra först?
5. **Handling** - Hur går vi från plan till effekt?
    `,
    externalResources: externalResources['modul-3'],
    quiz: {
      passingScore: 70,
      questions: [
        {
          id: 'q3-1',
          text: 'Hur kan AI stödja riskhantering i projekt?',
          options: [
            'Genom att eliminera alla risker automatiskt',
            'Genom att agera djävulens advokat och identifiera blinda fläckar',
            'Genom att ta över projektledarens ansvar',
            'AI kan inte användas för riskhantering'
          ],
          correctAnswer: 1,
          explanation: 'AI kan hjälpa till att utmana antaganden och identifiera risker vi kanske missat, men ansvaret ligger fortfarande hos projektledaren.'
        }
      ]
    }
  },
  {
    id: 'modul-4',
    number: 4,
    title: 'AI i kunddialog och uppdrag',
    description: 'Positionering, kundkommunikation och professionell gränsdragning',
    estimatedTime: 45,
    keyPoints: [
      'Curagos positionering kring AI',
      'Hantera kundfrågor professionellt',
      'Gränsdragning - vad vi gör och inte gör',
      'Identifiera relevanta AI-möjligheter'
    ],
    content: `
# Del 4: AI i kunddialog och uppdrag

## Syfte
Ge dig trygghet i att föra professionella samtal om AI med kunder, och tydlighet kring Curagos positionering.

## Curagos positionering

### Vad vi är
- Konsulter som använder AI som ett verktyg bland andra
- Experter på styrning, ledning och verksamhetsutveckling
- Partners som hjälper kunder navigera digital transformation

### Vad vi inte är
- Tekniska AI-utvecklare eller datavetare
- AI-utbildare som erbjuder separata AI-kurser
- Specialister som säljer AI-lösningar

## Hantera kundfrågor

### Vanliga frågor och hur du svarar

**"Hur kan vi använda AI?"**
> Fokusera på verksamhetsnytta, inte teknik. Fråga: "Vilka utmaningar har ni som tar tid eller resurser idag?"

**"Vilken AI-lösning ska vi välja?"**
> "Det beror på era specifika behov och förutsättningar. Vi kan hjälpa er strukturera beslutet, men den tekniska implementationen kräver specialister."

**"Är AI säkert att använda?"**
> "Med rätt riktlinjer och medvetenhet, ja. Viktiga aspekter är datahantering, kvalitetssäkring och transparens."

## Gränsdragning

### Vi hjälper gärna med:
- Strategisk rådgivning kring AI-initiativ
- Styrning och governance av AI-projekt
- Förändringsledning kopplat till AI
- Processutveckling där AI är en komponent

### Vi hänvisar vidare för:
- Teknisk AI-utveckling och implementation
- Datavetenskapliga analyser
- Drift och förvaltning av AI-system
- Djup juridisk rådgivning kring AI

## Identifiera möjligheter

Inom ramen för ditt uppdrag, var uppmärksam på:
- Repetitiva uppgifter som tar mycket tid
- Informationsbearbetning i stor skala
- Beslutsunderlag som kräver snabb analys
- Dokumentation och rapportering
    `,
    externalResources: externalResources['modul-4'],
    quiz: {
      passingScore: 70,
      questions: [
        {
          id: 'q4-1',
          text: 'Hur positionerar sig Curago kring AI?',
          options: [
            'Som tekniska AI-utvecklare',
            'Som konsulter där AI är ett verktyg i verktygslådan',
            'Som AI-utbildare',
            'Som AI-produktföretag'
          ],
          correctAnswer: 1,
          explanation: 'Curago ser AI som ett verktyg bland andra, inte som en specialisering. Vi är experter på styrning och verksamhetsutveckling.'
        }
      ]
    }
  },
  {
    id: 'modul-5',
    number: 5,
    title: 'Ansvar, risk och professionellt omdöme',
    description: 'Etik, bias, transparens, informationssäkerhet och regelverk',
    estimatedTime: 60,
    keyPoints: [
      'Etiska överväganden vid AI-användning',
      'Bias och fairness',
      'Informationssäkerhet och GDPR',
      'Professionellt omdöme framför checklistor'
    ],
    content: `
# Del 5: Ansvar, risk och professionellt omdöme

## Syfte
Utveckla din förmåga att göra professionella avvägningar kring AI-användning - med fokus på omdöme snarare än regelkunskap.

## Etiska överväganden

### Grundläggande principer
- **Transparens** - Var öppen med när AI används
- **Ansvarighet** - Du är ansvarig för output, inte AI:n
- **Rättvisa** - Var medveten om bias och skevheter
- **Integritet** - Skydda personlig information

### Praktiska frågor att ställa sig
1. Skulle jag vara bekväm om kunden visste exakt hur detta skapades?
2. Har jag granskat innehållet tillräckligt?
3. Finns det risk att någon påverkas negativt?

## Bias och kvalitet

### Vanliga problem
- **Träningsdata-bias** - AI reflekterar skevheter i data den tränats på
- **Hallucinationer** - AI kan "hitta på" fakta som låter trovärdiga
- **Bekräftelsebias** - AI kan förstärka befintliga antaganden

### Motåtgärder
- Granska kritiskt, särskilt faktauppgifter
- Använd flera källor för viktiga beslut
- Var extra vaksam vid känsliga ämnen

## Informationssäkerhet

### Vad du INTE ska mata in i publika AI-verktyg:
- Personuppgifter
- Konfidentiell kundinformation
- Affärshemligheter
- Interna dokument utan godkännande

### GDPR och AI
- Personuppgifter får inte processas utan rättslig grund
- Kunder har rätt att veta om AI använts i beslut som rör dem
- Var transparent och dokumentera användning

## Professionellt omdöme

### Omdöme framför checklistor
Det går inte att skapa en komplett regelbok för AI-användning. Istället behöver du:
- Förstå principerna bakom riktlinjerna
- Kunna resonera kring gråzoner
- Våga fråga när du är osäker
- Ta ansvar för dina professionella val

### "Professionell trygghet, inte fullständig kontroll"
Du behöver inte vara AI-expert för att använda AI professionellt. Du behöver:
- Tillräcklig förståelse för möjligheter och begränsningar
- Medvetenhet om risker
- Mod att göra bedömningar
- Ödmjukhet att erkänna osäkerhet
    `,
    externalResources: externalResources['modul-5'],
    quiz: {
      passingScore: 70,
      questions: [
        {
          id: 'q5-1',
          text: 'Vilken information ska du INTE mata in i publika AI-verktyg?',
          options: [
            'Allmänt tillgänglig branschinformation',
            'Konfidentiell kundinformation och personuppgifter',
            'Generella frågor om projektledning',
            'Förfrågningar om att förklara begrepp'
          ],
          correctAnswer: 1,
          explanation: 'Konfidentiell information, personuppgifter och affärshemligheter ska aldrig matas in i publika AI-verktyg.'
        },
        {
          id: 'q5-2',
          text: 'Vad menas med "omdöme framför checklistor"?',
          options: [
            'Att checklistor är onödiga',
            'Att ignorera riktlinjer',
            'Att förstå principerna och kunna resonera kring gråzoner',
            'Att alltid fråga chefen'
          ],
          correctAnswer: 2,
          explanation: 'Professionellt omdöme handlar om att förstå principerna bakom riktlinjer och kunna göra egna bedömningar i situationer som inte täcks av checklistor.'
        }
      ]
    }
  },
  {
    id: 'modul-6',
    number: 6,
    title: 'Förankring och fortsatt lärande',
    description: 'Erfarenhetsutbyte, community och vägen framåt',
    estimatedTime: 30,
    keyPoints: [
      'Dela och lär av varandra',
      'Håll dig uppdaterad',
      'Interna resurser och forum',
      'Din personliga utvecklingsplan'
    ],
    content: `
# Del 6: Förankring och fortsatt lärande

## Syfte
Avsluta utbildningen med fokus på hur du fortsätter utvecklas och bidrar till Curagos gemensamma lärande.

## Dela och lär av varandra

### Erfarenhetsutbyte
AI-området utvecklas snabbt. Den bästa kunskapskällan är ofta kollegor som testat i praktiken:
- Dela framgångar och misslyckanden
- Beskriv konkreta användningsfall
- Ställ frågor när du kör fast

### Dokumentera din användning
- Vilka prompts fungerar bra?
- Vilka verktyg passar för olika uppgifter?
- Vilka fallgropar har du upptäckt?

## Håll dig uppdaterad

### Förhållningssätt till nyheter
AI-nyheter bombarderar oss dagligen. Ett balanserat förhållningssätt:
- Följ utvecklingen utan att bli överväldigad
- Fokusera på tillämpning, inte hype
- Utvärdera nyheter kritiskt: "Vad betyder detta praktiskt?"

### Rekommenderade källor
- MIT Technology Review
- Harvard Business Review (AI-artiklar)
- Branschspecifika nyhetsbrev
- Curagos interna kanaler

## Interna resurser

### På Curago har du tillgång till:
- Kollegors erfarenheter och best practices
- Interna riktlinjer för AI-användning
- Forum för frågor och diskussion
- Uppdateringar när nya verktyg eller riktlinjer tillkommer

## Din personliga utvecklingsplan

### Reflektera över:
1. **Var står du nu?** Hur bekväm är du med AI i ditt arbete?
2. **Vad vill du utveckla?** Specifika användningsområden eller generell förståelse?
3. **Hur ska du öva?** Konkreta situationer där du kan testa

### Sätt ett personligt mål
Definiera ett konkret mål för de kommande 30 dagarna:
- "Jag ska använda AI för att sammanfatta mötesanteckningar"
- "Jag ska testa AI som sparringpartner för en presentation"
- "Jag ska utforska hur AI kan hjälpa med X i mitt nuvarande uppdrag"

## Avslutning

Du har nu genomfört Curagos AI-utbildning. Kom ihåg:

- **AI är ett verktyg** - inte magi, inte hot
- **Du är ansvarig** - för kvalitet, etik och omdöme
- **Lärandet fortsätter** - detta är början, inte slutet
- **Dela med dig** - din erfarenhet hjälper kollegor

Lycka till!
    `,
    externalResources: externalResources['modul-6'],
    quiz: {
      passingScore: 70,
      questions: [
        {
          id: 'q6-1',
          text: 'Vad är det bästa sättet att fortsätta lära sig om AI efter denna utbildning?',
          options: [
            'Vänta på nästa formella utbildning',
            'Läsa all AI-nyheter dagligen',
            'Praktisera, dela erfarenheter med kollegor och hålla sig uppdaterad balanserat',
            'Undvika AI tills det blir mer moget'
          ],
          correctAnswer: 2,
          explanation: 'Kontinuerligt lärande sker bäst genom praktisk användning kombinerat med erfarenhetsutbyte och balanserad omvärldsbevakning.'
        }
      ]
    }
  }
]

export function getModules(): Module[] {
  return modules
}

export function getModuleById(id: string): Module | undefined {
  return modules.find(m => m.id === id)
}

export function getModuleByNumber(num: number): Module | undefined {
  return modules.find(m => m.number === num)
}
