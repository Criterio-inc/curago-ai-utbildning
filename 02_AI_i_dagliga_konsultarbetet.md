# Modul 2: AI i det dagliga konsultarbetet
## Praktisk användning för analys, strukturering och kommunikation

**Tid:** 60 minuter  
**Typ:** Praktisk tillämpning  
**Status:** Ej påbörjad

---

## Lärandemål

Efter denna modul ska deltagaren kunna:

1. **Använda** AI för att bearbeta och strukturera stora informationsmängder
2. **Formulera** effektiva promptar för olika konsultuppgifter
3. **Utvärdera** när AI tillför värde – och när det inte gör det
4. **Tillämpa** AI för att förbättra kvalitet i texter och presentationer
5. **Etablera** en rutin för att granska och kvalitetssäkra AI-genererat material

---

## Nyckelbegrepp

### Prompting
Konsten att formulera instruktioner till en AI-modell på ett sätt som ger önskat resultat. Bra promptar är tydliga, specifika och ger relevant kontext.

### Kontext
Den bakgrundsinformation du ger AI:n för att den ska förstå uppgiften bättre. Mer relevant kontext = bättre resultat.

### Iteration
Att förfina resultatet genom flera omgångar – du ber AI förbättra, justera eller tänka om baserat på första svaret.

### Hallucination
När AI genererar information som låter trovärdig men är påhittad. Särskilt vanligt vid faktafrågor, referenser och specifika siffror.

### Verifiering
Processen att kontrollera att AI-genererat innehåll är korrekt, relevant och lämpligt för syftet.

---

## Huvudinnehåll

### 1. Grundprinciper för effektiv prompting

En bra prompt innehåller:

| Element | Beskrivning | Exempel |
|---------|-------------|---------|
| **Roll** | Vem AI ska agera som | "Du är en erfaren managementkonsult..." |
| **Uppgift** | Vad som ska göras | "...som ska sammanfatta ett möte..." |
| **Kontext** | Relevant bakgrund | "...med en kommunledning om digitalisering..." |
| **Format** | Önskad struktur | "...i punktform med max 5 huvudpunkter..." |
| **Begränsningar** | Vad som ska undvikas | "...utan teknisk jargong." |

#### Exempel på stark prompt:

```
Du är en erfaren konsult inom offentlig sektor. 

Jag har genomfört en workshop med 12 deltagare från kommunens 
förvaltningsledning. Temat var prioritering av digitaliseringsprojekt 
för kommande budget.

Sammanfatta bifogade anteckningar i följande format:
1. Beslut som fattades (max 3)
2. Frågor som kräver vidare utredning (max 5)
3. Nästa steg med ansvarig och deadline

Skriv för mottagare utan teknisk bakgrund. Undvik förkortningar.
```

#### Vanliga misstag att undvika:

❌ **För vagt:** "Skriv om mötet"

❌ **Ingen kontext:** "Gör en sammanfattning" (av vad? för vem?)

❌ **Otydligt format:** "Gör det bra" (vad innebär bra?)

❌ **Motsägelser:** "Var kortfattad och inkludera alla detaljer"

### 2. Konkreta användningsområden

#### A. Bearbeta stora informationsmängder

**Användningsfall:**
- Sammanfatta långa dokument eller rapporter
- Extrahera nyckelinformation från intervjutranskript
- Identifiera teman och mönster i enkätsvar

**Promptmall – Sammanfattning:**
```
Sammanfatta dokumentet nedan. Fokusera på:
- Huvudsakliga slutsatser (3-5 punkter)
- Rekommenderade åtgärder
- Eventuella risker eller invändningar som nämns

Längd: Max 300 ord
Språk: Anpassat för beslutsfattare utan teknisk bakgrund

[DOKUMENT]
```

**Promptmall – Mönsteridentifiering:**
```
Analysera följande intervjusvar (10 respondenter).

Identifiera:
1. Återkommande teman (nämn hur många som tar upp varje tema)
2. Motsättningar eller spänningar mellan svar
3. Överraskande eller avvikande perspektiv

Ge konkreta citat som stödjer varje tema.

[INTERVJUSVAR]
```

#### B. Ta fram beslutsunderlag

**Användningsfall:**
- Strukturera argument för och emot
- Göra första utkast till analysramverk
- Generera frågeställningar för vidare utredning

**Promptmall – Pro/con-analys:**
```
Vi överväger [BESLUT] i kontexten [SITUATION].

Strukturera en analys med:
1. Fördelar (3-5 punkter med kort motivering)
2. Nackdelar (3-5 punkter med kort motivering)
3. Kritiska framgångsfaktorer om vi går vidare
4. Frågor som behöver besvaras innan beslut

Var balanserad och lyft fram osäkerheter.
```

#### C. Sammanfatta möten och intervjuer

**Användningsfall:**
- Mötesprotokoll med beslut och åtgärder
- Intervjusammanfattningar för analys
- Snabb briefing inför uppföljningsmöte

**Promptmall – Mötessammanfattning:**
```
Sammanfatta bifogad mötesanteckning/transkript.

Format:
## Deltagare
## Syfte med mötet
## Huvudpunkter (max 5)
## Beslut
## Åtgärder (vem gör vad, deadline)
## Öppna frågor

Skriv koncist. Använd inte mer än 400 ord.
```

#### D. Förbättra texter och presentationer

**Användningsfall:**
- Finslipa formuleringar
- Anpassa ton och språknivå
- Korta ner eller bygga ut text
- Strukturera om för bättre flöde

**Promptmall – Textförbättring:**
```
Förbättra följande text. Behåll budskapet men:
- Gör språket mer [konkret/formellt/engagerande]
- Korta ner till hälften av nuvarande längd
- Strukturera med tydliga avsnitt

Förklara kort vilka ändringar du gjort och varför.

[ORIGINALTEXT]
```

**Promptmall – Anpassning till målgrupp:**
```
Anpassa följande text för [MÅLGRUPP].

Tänk på:
- Kunskapsnivå: [hög/medel/låg] inom ämnet
- Ton: [formell/informell]
- Vad de bryr sig om: [tid/kostnad/kvalitet/etc.]

[ORIGINALTEXT]
```

### 3. När AI tillför värde – och när det inte gör det

#### ✅ AI tillför värde när:

| Situation | Varför det fungerar |
|-----------|---------------------|
| Första utkast behövs snabbt | AI ger startpunkt att bygga vidare på |
| Stort material ska bearbetas | AI är snabb på att processa text |
| Variation eller alternativ önskas | AI genererar många förslag |
| Struktur saknas | AI kan organisera ostrukturerad information |
| Formulering ska finslipas | AI är bra på språklig polish |

#### ⚠️ AI är riskabelt eller olämpligt när:

| Situation | Varför det är problematiskt |
|-----------|-----------------------------|
| Fakta måste vara korrekta | AI hallucinerar och fabricerar |
| Specifika siffror eller referenser behövs | Stor risk för fel |
| Känslig eller konfidentiell information | Risk för dataläckage |
| Juridisk precision krävs | AI förstår inte juridiska nyanser |
| Unik kunskap om kunden behövs | AI känner inte till kundens kontext |

### 4. Kvalitetssäkring av AI-genererat material

#### Checklista innan leverans:

- [ ] **Fakta verifierade** – Har jag kontrollerat påståenden mot källor?
- [ ] **Siffror stämmer** – Har jag räknat efter eller dubbelkollat?
- [ ] **Kontext korrekt** – Stämmer detta för kundens specifika situation?
- [ ] **Ton lämplig** – Passar språket mottagaren?
- [ ] **Egen röst** – Har jag gjort texten till min egen?
- [ ] **Inga hallucinationer** – Finns det något som låter för bra för att vara sant?

#### Varningssignaler för hallucinationer:

🚩 Specifika siffror utan källa ("Studier visar att 73% av...")

🚩 Referenser till rapporter eller författare (kontrollera alltid!)

🚩 Mycket detaljerade beskrivningar av något du inte frågade specifikt om

🚩 Påståenden som låter auktoritativa men saknar nyans

---

## Praktiska övningar

### Övning 1: Promptformulering (15 min)

**Scenario:** Du har precis avslutat en serie intervjuer med 8 mellanchefer i en kommun om deras upplevelse av ett nytt ärendehanteringssystem. Du har transkript på totalt 45 sidor.

**Uppgift:** Formulera en prompt som hjälper dig:
1. Identifiera huvudsakliga teman i intervjuerna
2. Hitta citat som illustrerar varje tema
3. Sammanfatta i ett format lämpligt för en styrgrupp

**Tips:** Använd promptmallen för mönsteridentifiering som utgångspunkt.

### Övning 2: Iterativ förbättring (15 min)

**Scenario:** Du har fått följande svar från AI på en prompt om att sammanfatta en strategidiskussion, men det är inte riktigt vad du behöver:

*"Mötet handlade om strategi. Deltagarna diskuterade många viktiga saker. Det finns flera möjligheter framåt. Nästa steg är att fortsätta arbetet."*

**Uppgift:** Skriv en uppföljningsprompt som:
- Specificerar vad som saknades
- Ber om konkret format
- Ger AI mer kontext att arbeta med

### Övning 3: Kvalitetsgranskning (10 min)

**Scenario:** AI har genererat följande stycke för ett beslutsunderlag:

*"Enligt Statskontorets rapport 'Digital mognad i kommunsektorn 2024' har 67% av svenska kommuner implementerat AI-baserade chatbotar för medborgarservice. Forskaren Maria Lindgren vid Göteborgs universitet menar att 'kommuner som inte digitaliserar kommer halka efter inom tre år'."*

**Uppgift:** 
1. Vilka varningssignaler ser du?
2. Vad skulle du behöva verifiera innan användning?
3. Hur skulle du omformulera om du inte kan verifiera?

<details>
<summary>Visa svar</summary>

**Varningssignaler:**
- Specifik rapport med exakt titel och årtal (kan vara fabricerad)
- Exakt procenttal (67%) utan verifierbar källa
- Nämnd forskare med citat (kan vara påhittad)
- Auktoritativt språk ("kommer halka efter")

**Behöver verifieras:**
- Finns rapporten? Kontrollera Statskontorets webbplats
- Stämmer siffran? Läs ursprungskällan
- Finns forskaren? Sök på universitetet
- Sa hen verkligen detta? Hitta originalkällan

**Omformulering utan verifiering:**
"Många kommuner har börjat använda AI-baserade chatbotar för medborgarservice, och trenden förväntas fortsätta. Kommuner som inte följer utvecklingen kan riskera att hamna efter."

</details>

### Övning 4: Verkligt arbetsflöde (Hemuppgift)

**Uppgift:** Välj en uppgift från ditt nuvarande uppdrag och testa AI-stöd:
1. Formulera en prompt
2. Utvärdera resultatet
3. Iterera vid behov
4. Reflektera: Sparade det tid? Höjde det kvaliteten?

Dokumentera erfarenheten för diskussion vid nästa tillfälle.

---

## Reflektionsfrågor

1. Vilka av dina vanliga arbetsuppgifter skulle du vilja testa med AI-stöd?

2. Hur avgör du var gränsen går mellan att AI hjälper och att du tappar ägarskap?

3. Vilka risker ser du med att bli för beroende av AI i konsultarbetet?

4. Hur skulle du förklara för en skeptisk kollega värdet av AI-stöd?

5. Vad skulle behöva förändras i hur du arbetar för att dra nytta av AI?

---

## Fördjupning & externa resurser

### Svenska resurser
| Resurs | Källa | Beskrivning |
|--------|-------|-------------|
| [AI för offentlig förvaltning](https://www.digg.se/ai-for-offentlig-forvaltning) | DIGG | Praktisk vägledning för AI i förvaltning |
| [AI Sweden resurser](https://www.ai.se/sv) | AI Sweden | Nationellt AI-center med resurser och nätverk |
| [AI i kommuner och regioner](https://skr.se/digitaliseringivalfarden/datadrivenutveckling/artificiellintelligensai.716.html) | SKR | Case och lärdomar från kommunsektorn |

### Internationella resurser
| Resurs | Källa | Tid | Beskrivning |
|--------|-------|-----|-------------|
| [Prompt Engineering Guide](https://www.promptingguide.ai/) | DAIR.AI | 2-3 timmar | Omfattande guide till prompttekniker |
| [AI for Knowledge Workers](https://www.coursera.org/learn/ai-for-knowledge-workers) | Coursera / UC Davis | 8 timmar | Praktisk kurs för kunskapsarbetare |

### Promptbibliotek
- **[Anthropic Prompt Library](https://docs.anthropic.com/en/resources/prompt-library/library)** – Exempel på effektiva promptar för olika uppgifter
- **[OpenAI Cookbook](https://cookbook.openai.com/)** – Teknisk guide till prompting

### Verktyg att utforska
- **[Claude](https://claude.ai)** – Anthropics AI-assistent med projektfunktion
- **[ChatGPT](https://chat.openai.com)** – OpenAIs AI-assistent med Custom GPTs
- **[Notion AI](https://www.notion.so/product/ai)** – AI integrerat i dokumentverktyg

---

## Kunskapstest

### Fråga 1
Vilka element bör en bra prompt innehålla?

- A) Bara uppgiften – AI förstår resten
- B) Roll, uppgift, kontext, format och eventuella begränsningar
- C) Så mycket information som möjligt utan struktur
- D) Enbart tekniska instruktioner

**Rätt svar:** B

---

### Fråga 2
När är AI särskilt riskabelt att använda?

- A) När du behöver ett första utkast snabbt
- B) När du vill ha variation och alternativ
- C) När specifika fakta, siffror eller referenser måste vara korrekta
- D) När du ska förbättra språket i en text

**Rätt svar:** C

---

### Fråga 3
Vad är en "hallucination" i AI-sammanhang?

- A) När AI vägrar svara på frågor
- B) När AI genererar information som låter trovärdig men är påhittad
- C) När AI ger samma svar flera gånger
- D) När AI svarar på fel språk

**Rätt svar:** B

---

### Fråga 4
Vilken är en bra strategi för att förbättra AI-resultat?

- A) Acceptera första svaret och gå vidare
- B) Byta till en annan AI-modell
- C) Iterera – ge feedback och be AI förbättra baserat på vad som saknas
- D) Skriva längre promptar med mer text

**Rätt svar:** C

---

### Fråga 5
Vad bör du alltid göra innan du använder AI-genererat material i en leverans?

- A) Köra texten genom stavningskontroll
- B) Verifiera fakta, kontrollera att kontext stämmer och göra innehållet till ditt eget
- C) Fråga AI om materialet är korrekt
- D) Dela materialet med en kollega för godkännande

**Rätt svar:** B

---

## Sammanfattning

- **Bra promptar** är tydliga, ger kontext och specificerar önskat format
- **AI passar** för första utkast, bearbetning av stort material, variation och finslipning
- **AI är riskabelt** när fakta måste stämma, vid känslig information och juridisk precision
- **Alltid kvalitetssäkra** – verifiera fakta, kontrollera siffror, gör texten till din
- **Iteration** är nyckeln – första svaret är sällan det bästa

---

*Gå vidare till Modul 3: AI i styrning, projekt och förändringsarbete →*
