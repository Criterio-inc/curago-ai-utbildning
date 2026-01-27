# Modul 3: AI i styrning, projekt och förändringsarbete
## Planering, prioritering, riskhantering och scenarioanalys

**Tid:** 60 minuter  
**Typ:** Praktisk tillämpning  
**Status:** Ej påbörjad

---

## Lärandemål

Efter denna modul ska deltagaren kunna:

1. **Använda** AI för att analysera nuläge och formulera problemställningar
2. **Identifiera** risker och beroenden med AI-stöd
3. **Testa** scenarier och alternativa angreppssätt systematiskt
4. **Stödja** projektplanering och prioritering med AI
5. **Förstå** hur AI kompletterar – men inte ersätter – mänskligt ledarskap

---

## Nyckelbegrepp

### Scenarioanalys
Metod för att utforska möjliga framtider genom att systematiskt variera antaganden och förutsättningar. AI kan snabbt generera och utvärdera många scenarier.

### Riskidentifiering
Process för att identifiera potentiella hot mot projektets framgång. AI kan hjälpa till att systematiskt täcka in olika riskkategorier.

### Beroendeanalys
Kartläggning av hur olika aktiviteter, beslut eller system påverkar varandra. AI kan hjälpa till att visualisera och kommunicera komplexa beroenden.

### Problemformulering
Konsten att definiera ett problem på ett sätt som möjliggör effektiv lösning. AI kan hjälpa till att utmana och förfina problemformuleringar.

---

## Huvudinnehåll

### 1. AI för nulägesanalys och problemformulering

En av de största utmaningarna i projekt är att korrekt förstå utgångsläget. AI kan hjälpa genom att:

- Strukturera komplex information
- Identifiera luckor i förståelsen
- Utmana antaganden
- Generera frågor att besvara

**Promptmall – Nulägesanalys:**
```
Jag arbetar med [PROJEKT/UPPDRAG] för [TYP AV ORGANISATION].

Här är vad vi vet om nuläget:
[BESKRIV NULÄGET]

Hjälp mig genom att:
1. Strukturera informationen i kategorier (t.ex. styrkor, svagheter, möjligheter, hot)
2. Identifiera vad som verkar oklart eller motsägelsefullt
3. Föreslå 5-7 frågor vi borde ställa för att förstå situationen bättre
4. Flagga antaganden som verkar outtalade
```

**Promptmall – Problemformulering:**
```
Vi har formulerat följande problem:
[PROBLEMFORMULERING]

Hjälp mig utvärdera formuleringen:
1. Är problemet för brett eller för smalt?
2. Vilka underliggande orsaker kan finnas?
3. Vilka intressenter påverkas och hur?
4. Föreslå 2-3 alternativa sätt att formulera problemet

Var kritisk – syftet är att förfina, inte bekräfta.
```

### 2. Riskidentifiering och beroendeanalys

#### Systematisk riskidentifiering

AI kan hjälpa till att täcka fler riskkategorier än vi ofta tänker på spontant:

| Riskkategori | Exempel på frågor AI kan hjälpa med |
|--------------|-------------------------------------|
| **Organisatoriska** | Resursbrist, nyckelpersoner slutar, bristande förankring |
| **Tekniska** | Integration, prestanda, säkerhet, kompetens |
| **Externa** | Regeländringar, leverantörer, marknadsförändringar |
| **Politiska** | Ledningsbyte, prioriteringsändringar, motstånd |
| **Ekonomiska** | Budgetöverskridanden, dolda kostnader, finansieringsbortfall |

**Promptmall – Riskidentifiering:**
```
Projektet handlar om [BESKRIVNING].
Kontext: [ORGANISATION, TIDSRAM, BUDGET]

Hjälp mig identifiera risker inom följande kategorier:
1. Organisatoriska risker
2. Tekniska risker
3. Externa risker
4. Politiska/förankringsrisker
5. Ekonomiska risker

För varje risk, ange:
- Beskrivning (1 mening)
- Sannolikhet (Låg/Medel/Hög)
- Konsekvens om den inträffar (Låg/Medel/Hög)
- Förslag på riskreducerande åtgärd
```

#### Beroendeanalys

**Promptmall – Beroendeanalys:**
```
Projektet har följande huvudaktiviteter/komponenter:
[LISTA AKTIVITETER]

Analysera:
1. Vilka aktiviteter måste slutföras före andra startar?
2. Vilka aktiviteter kan ske parallellt?
3. Var finns de kritiska beroendena som kan blockera hela projektet?
4. Vilka externa beroenden (beslut, resurser, leveranser) finns?

Presentera som en enkel lista, inte diagram.
```

### 3. Scenarioanalys och alternativa angreppssätt

En av AI:s styrkor är att snabbt generera och utvärdera alternativ.

#### Typer av scenarioanalys:

| Typ | Användning | AI:s roll |
|-----|------------|-----------|
| **Best/worst/likely case** | Grovplanering, riskförståelse | Generera tänkbara utfall |
| **What-if-scenarier** | Testa känsliga antaganden | Räkna på konsekvenser |
| **Alternativa angreppssätt** | Strategival, prioritering | Generera och jämföra alternativ |
| **Stresstestning** | Robusthet, beredskap | Identifiera brytpunkter |

**Promptmall – Scenarioanalys:**
```
Vi planerar [PROJEKT/BESLUT] under följande antaganden:
[LISTA ANTAGANDEN]

Skapa tre scenarier:
1. OPTIMISTISKT: Vad händer om allt går bättre än förväntat?
2. PESSIMISTISKT: Vad händer om flera saker går fel?
3. TROLIGT: Vad är mest sannolikt baserat på erfarenhet?

För varje scenario:
- Beskriv situationen (3-4 meningar)
- Konsekvenser för tid, kostnad, kvalitet
- Vilka beslut bör vi ta annorlunda?
```

**Promptmall – Alternativa angreppssätt:**
```
Vi överväger följande lösning på [PROBLEM]:
[BESKRIV FÖRESLAGEN LÖSNING]

Generera 3-4 fundamentalt olika sätt att lösa samma problem.

För varje alternativ:
- Kort beskrivning
- Fördelar jämfört med ursprungsförslaget
- Nackdelar och risker
- När passar detta alternativ bäst?

Syftet är att utmana vårt tänkande, inte bekräfta det.
```

### 4. Projektplanering och prioritering

#### Nedbrytning av arbete

**Promptmall – WBS (Work Breakdown Structure):**
```
Projektet ska leverera [SLUTRESULTAT].
Tidram: [TID]
Team: [BESKRIVNING]

Bryt ner arbetet i:
1. Huvudfaser (3-5 faser)
2. Aktiviteter per fas (3-7 aktiviteter)
3. Uppskattad arbetsinsats per aktivitet (S/M/L)

Flagga aktiviteter som:
- Kräver extern expertis
- Har höga beroenden
- Är kritiska för milstolpar
```

#### Prioriteringsmatris

**Promptmall – Prioritering:**
```
Vi har följande möjliga initiativ/åtgärder:
[LISTA]

Hjälp mig prioritera genom att bedöma varje punkt utifrån:
- Affärsvärde (Låg/Medel/Hög)
- Genomförbarhet (Låg/Medel/Hög)
- Beroenden av andra initiativ
- Risk om vi INTE gör det

Sammanfatta i en prioriterad lista med motivering.
```

### 5. AI som komplement till mänskligt ledarskap

**Vad AI kan göra i projektstyrning:**

✅ Generera strukturer och förslag snabbt

✅ Täcka in perspektiv vi glömt

✅ Utmana antaganden systematiskt

✅ Dokumentera och kommunicera planer

✅ Processa stora mängder information

**Vad AI INTE kan ersätta:**

❌ Förankring och relationsbyggande

❌ Omdöme om organisationskultur och politik

❌ Läsa av rum och anpassa i realtid

❌ Ta ansvar för beslut

❌ Motivation och ledarskap av människor

> **Nyckelinsikt:** AI kan göra dig till en bättre projektledare genom att frigöra tid från administration till ledarskap. Men ledarskapet kan aldrig delegeras till AI.

---

## Praktiska exempel

### Exempel 1: Riskworkshop med AI-stöd

**Situation:** Du faciliterar en riskworkshop för ett digitaliseringsprojekt i en kommun. Du har 2 timmar med 8 deltagare.

**Traditionellt:** Du brainstormar risker på post-its, grupperar, prioriterar.

**Med AI-stöd:**
1. **Före:** Be AI generera en initial risklista baserat på projektbeskrivning
2. **Under:** Använd listan som utgångspunkt – deltagarna bekräftar, ifrågasätter, lägger till
3. **Efter:** Be AI strukturera resultatet och föreslå riskreducerande åtgärder

**Värde:** Workshopen startar inte från noll, deltagarna kan fokusera på det de vet bäst, du missar färre riskkategorier.

### Exempel 2: Scenarioplanering för styrgrupp

**Situation:** Styrgruppen ska besluta om projektets fortsättning. Budget är under press.

**Med AI-stöd:**
1. Be AI generera tre budgetscenarier (100%, 75%, 50%)
2. För varje scenario: vad kan levereras, vilka risker uppstår, vilka kompromisser krävs
3. Presentera som beslutsunderlag med tydliga val

**Värde:** Strukturerad diskussion om avvägningar istället för förhandling om siffror.

### Exempel 3: Förändringsledning

**Situation:** En organisation ska införa ett nytt arbetssätt. Du behöver förstå var motståndet kan uppstå.

**Med AI-stöd:**
```
Vi inför [FÖRÄNDRING] i [ORGANISATION].

Analysera utifrån förändringsmotstånd:
1. Vilka grupper påverkas mest?
2. Vad förlorar respektive grupp?
3. Vad kan de vara oroliga för?
4. Var finns potentiella ambassadörer?
5. Vilka kommunikationsinsatser behövs för varje grupp?
```

**Värde:** Systematisk analys av intressenter innan förändringen, inte reaktivt under.

---

## Praktiska övningar

### Övning 1: Riskidentifiering (15 min)

**Scenario:** Din kund, en mellanstor kommun, ska upphandla och implementera ett nytt HR-system. Projektet har 18 månaders tidram och 5 MSEK budget.

**Uppgift:**
1. Formulera en prompt för att identifiera risker
2. Kör prompten (eller simulera)
3. Utvärdera: Vilka risker fångades? Vilka missades?
4. Hur skulle du komplettera med din egen erfarenhet?

### Övning 2: Scenarioanalys (15 min)

**Scenario:** Ett förändringsprojekt är halvvägs. Nya politiska signaler tyder på att prioriteringarna kan ändras efter valet om 6 månader.

**Uppgift:**
1. Formulera en prompt för att generera tre scenarier för projektets framtid
2. Identifiera vilka beslut som bör fattas nu vs. efter valet
3. Hur skulle du presentera detta för styrgruppen?

### Övning 3: Alternativa angreppssätt (10 min)

**Scenario:** En förvaltning vill "bli mer digital" men har inte definierat vad det betyder. Du har fått uppdraget att föreslå en väg framåt.

**Uppgift:**
1. Formulera problemet på 2-3 olika sätt
2. Be AI generera alternativa angreppssätt för varje formulering
3. Reflektera: Hur påverkar problemformuleringen vilka lösningar som föreslås?

### Övning 4: Verkligt case (Hemuppgift)

Välj ett pågående eller nyligen avslutat projekt. Använd AI för att:
1. Retrospektivt identifiera risker ni missade
2. Generera alternativa angreppssätt ni kunde ha övervägt
3. Reflektera: Hade AI-stöd förändrat något?

---

## Reflektionsfrågor

1. Hur kan AI-stöd förändra hur du faciliterar workshops?

2. Var ser du störst potential för AI i din projektledarpraktik?

3. Vilka risker finns med att lita för mycket på AI i planering?

4. Hur säkerställer du att AI-genererade planer är förankrade?

5. När bör du INTE använda AI i projektstyrning?

---

## Fördjupning & externa resurser

### Svenska resurser
| Resurs | Källa | Beskrivning |
|--------|-------|-------------|
| Digital verksamhetsutveckling | SKR | Ramverk för digitalisering i kommuner |
| Projektmodellen PPS | Tieto/Praktisk Projektstyrning | Svensk projektmetodik |
| Förändringsledning i offentlig sektor | SKL Kommentus | Handbok anpassad för svenska förhållanden |

### Nordisk kontext
- **Samverkansmodellen** – Nordisk tradition av fackligt samarbete vid förändringar
- **Tillitsbaserad styrning** – Svenskt förhållningssätt till ledning och styrning

### Internationella artiklar
| Resurs | Källa | Beskrivning |
|--------|-------|-------------|
| How AI Will Transform Project Management | Harvard Business Review | Framtidsperspektiv på AI i projektledning |
| AI in Change Management: Early Findings | Prosci | Forskning om AI i förändringsledning |

### Ramverk
- **ADKAR-modellen** – Klassiskt ramverk för förändringsledning
- **Riskmatris** – Sannolikhet x konsekvens för prioritering
- **Stakeholder mapping** – Intressentanalys för förändringsprojekt

### Verktyg
- **Notion AI** – AI-stöd i projektdokumentation
- **Monday.com AI** – AI-funktioner i projektverktyg
- **Microsoft Copilot** – AI-stöd i Microsoft Project och Planner

---

## Kunskapstest

### Fråga 1
Vad är ett bra användningsområde för AI i riskidentifiering?

- A) Ersätta riskworkshops helt
- B) Generera en initial risklista som utgångspunkt för diskussion
- C) Automatiskt prioritera alla risker
- D) Besluta vilka risker som ska accepteras

**Rätt svar:** B

---

### Fråga 2
Vilken typ av scenarioanalys passar för att testa ett projekts robusthet?

- A) Best case-scenario
- B) Likely case-scenario
- C) Stresstestning
- D) Historisk jämförelse

**Rätt svar:** C

---

### Fråga 3
Vad kan AI INTE ersätta i projektstyrning?

- A) Dokumentation av planer
- B) Generering av risklistor
- C) Förankring och relationsbyggande med intressenter
- D) Nedbrytning av arbete i aktiviteter

**Rätt svar:** C

---

### Fråga 4
Hur påverkar problemformuleringen AI:s förslag på lösningar?

- A) Inte alls – AI ser alla möjliga lösningar
- B) Starkt – formuleringen styr vilka lösningar som genereras
- C) Bara om man ber om det explicit
- D) AI korrigerar automatiskt dåliga formuleringar

**Rätt svar:** B

---

### Fråga 5
När är AI-stöd mest värdefullt i ett förändringsprojekt?

- A) I beslutsfattande om vem som ska sägas upp
- B) I analys av intressenter och potentiellt motstånd före förändringen
- C) I att ersätta kommunikation med berörda
- D) I att automatisera feedbackinsamling utan mänsklig analys

**Rätt svar:** B

---

## Sammanfattning

- **AI stödjer** nulägesanalys genom att strukturera information och identifiera luckor
- **Riskidentifiering** blir mer systematisk med AI som genererar initial lista
- **Scenarioanalys** kan snabbas upp dramatiskt med AI:s förmåga att generera alternativ
- **Problemformuleringen** styr AI:s svar – var medveten om hur du formulerar
- **Ledarskapet** kan aldrig delegeras – AI frigör tid från admin till relationer

---

*Gå vidare till Modul 4: AI i kunddialog och uppdrag →*
