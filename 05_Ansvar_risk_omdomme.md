# Modul 5: Ansvar, risk och professionellt omdöme
## Etik, bias, transparens, informationssäkerhet och regelverk

**Tid:** 60 minuter  
**Typ:** Fördjupning  
**Status:** Ej påbörjad

---

## Lärandemål

Efter denna modul ska deltagaren kunna:

1. **Identifiera** centrala riskområden vid AI-användning i konsultarbete
2. **Förklara** vad bias innebär och hur det kan påverka AI-resultat
3. **Bedöma** vilken information som är lämplig att dela med AI-verktyg
4. **Beskriva** huvuddragen i EU:s AI-förordning och svensk tillämpning
5. **Förstå** hur OSL, GDPR och arbetsrättsliga regler påverkar AI-användning
6. **Göra** professionella avvägningar kring AI-användning i specifika situationer

---

## Nyckelbegrepp

### Bias (snedvridning)
Systematiska fel i AI-resultat som beror på snedvridning i träningsdata eller modelldesign. Kan leda till orättvisa eller missvisande utfall.

### Transparens
Öppenhet om hur AI används, vilka begränsningar som finns, och när AI har bidragit till ett resultat.

### Hallucination
När AI genererar information som verkar trovärdig men är helt fabricerad – påhittade fakta, källor eller citat.

### AI-literacy
Grundläggande förståelse för hur AI fungerar, dess möjligheter och begränsningar – en förutsättning för ansvarsfull användning.

### EU AI Act
EU:s förordning om artificiell intelligens – världens första omfattande AI-lagstiftning med krav baserade på risknivå.

---

## Huvudinnehåll

### 1. Centrala riskområden

#### A. Kvalitetsrisker

| Risk | Beskrivning | Konsekvenspotential |
|------|-------------|---------------------|
| **Hallucinationer** | AI fabricerar fakta, siffror, källor | Felaktiga beslutsunderlag |
| **Inkonsekvens** | Samma fråga ger olika svar | Opålitlighet |
| **Föråldrad information** | AI:s kunskap har cutoff-datum | Missade förändringar |
| **Kontextblindhet** | AI förstår inte kundens specifika situation | Irrelevanta förslag |

**Hur minskar vi kvalitetsrisk?**
- Verifiera alltid fakta och siffror
- Ange tydlig kontext i promptar
- Behandla AI-output som utkast, inte färdig produkt
- Var extra skeptisk till specifika påståenden

#### B. Etiska risker

| Risk | Beskrivning | Konsekvenspotential |
|------|-------------|---------------------|
| **Bias** | Systematisk snedvridning mot grupper | Diskriminering, orättvisa |
| **Brist på representation** | Träningsdata speglar inte alla perspektiv | Blinda fläckar |
| **Automatiserad orättvisa** | Beslut baserade på biased AI | Förstärkt orättvisa |

**Hur minskar vi etisk risk?**
- Var medveten om att bias existerar
- Ifrågasätt resultat som verkar ensidiga
- Komplettera med mänsklig bedömning
- Var extra försiktig vid beslut som påverkar människor

#### C. Informationssäkerhetsrisker

| Risk | Beskrivning | Konsekvenspotential |
|------|-------------|---------------------|
| **Dataläckage** | Känslig information når AI-leverantör | Sekretessbrott |
| **Träningsdata** | Information kan användas för träning | Förlust av konfidentialitet |
| **Tredjepartsdeling** | Data kan delas vidare | Avtalsbott |

**Hur minskar vi informationssäkerhetsrisk?**
- Anonymisera känslig information
- Använd godkända verktyg enligt policy
- Anta att allt du skriver kan lagras
- Dela aldrig personuppgifter, affärshemligheter eller sekretessbelagd information

### 2. Bias – vad det är och varför det spelar roll

#### Hur bias uppstår

```
TRÄNINGSDATA → MODELL → OUTPUT
   (biased)   (lär sig)  (biased)
```

1. **Träningsdata** speglar historiska mönster, inklusive fördomar
2. **Modellen** lär sig att återskapa dessa mönster
3. **Output** förstärker eller reproducerar snedvridningen

#### Typer av bias att vara medveten om:

| Typ | Beskrivning | Exempel |
|-----|-------------|---------|
| **Historisk bias** | Data speglar historiska orättvisor | Rekryteringsmodeller som missgynnar kvinnor |
| **Representationsbias** | Vissa grupper underrepresenterade | Ansiktsigenkänning som fungerar sämre för mörkhyade |
| **Språkbias** | Engelska dominerar, andra språk underrepresenterade | Sämre kvalitet på svenska svar |
| **Kulturell bias** | Västerländska perspektiv dominerar | Antaganden som inte gäller globalt |
| **Bekräftelsebias** | AI bekräftar frågeställarens antaganden | "Ja-sägande" utan kritisk granskning |

#### Frågor att ställa sig:

- Vems perspektiv saknas i detta svar?
- Gäller detta i vår specifika kontext?
- Har jag frågat på ett ledande sätt?
- Finns det alternativa tolkningar?

### 3. Informationssäkerhet i praktiken

#### Vad du ALDRIG ska dela med öppna AI-verktyg:

🚫 **Personuppgifter** – namn, personnummer, kontaktuppgifter

🚫 **Känsliga personuppgifter** – hälsa, religion, politisk åsikt

🚫 **Affärshemligheter** – strategier, opublicerade planer

🚫 **Sekretessbelagd information** – enligt avtal eller lag

🚫 **Autentiseringsuppgifter** – lösenord, API-nycklar

🚫 **Kundspecifik information** – utan medgivande

#### Säkrare alternativ:

| Istället för | Gör så här |
|--------------|------------|
| "Analysera avtalet med Företag X" | Anonymisera: "Analysera ett IT-avtal med en kommunal kund" |
| "Sammanfatta intervju med Anna Andersson" | Ta bort namn: "Sammanfatta intervju med en mellanchef" |
| "Vår budget är 5 MSEK" | Generalisera: "Budget i storleksordningen 3-7 MSEK" |
| "Vår strategi för 2025 är..." | Dela inte alls – för känsligt |

#### Verktygsval och policy:

- **Följ alltid** Curagos och kundens policy för AI-verktyg
- **Fråga** om du är osäker på vad som är tillåtet
- **Dokumentera** inte vilka AI-verktyg du använt om det inte är explicit efterfrågat
- **Var medveten** om att olika verktyg har olika datapolicy

### 4. Regelverk – EU och Sverige

#### A. DIGG/IMY:s 18 riktlinjer för generativ AI (januari 2025)

Den 21 januari 2025 lanserade DIGG och IMY nationella riktlinjer för generativ AI i offentlig förvaltning. Detta är den mest aktuella svenska vägledningen och täcker sju huvudområden:

| Område | Fokus |
|--------|-------|
| **Ledning och ansvar** | Styrning, roller, ansvarsfördelning |
| **Informationssäkerhet** | Klassificering, riskhantering, tekniska krav |
| **Upphovsrätt** | Användning av upphovsrättsskyddat material |
| **Dataskydd (GDPR)** | Personuppgiftshantering, konsekvensbedömning |
| **Etik** | Ansvarsfull användning, mänsklig kontroll |
| **Arbetsrätt** | MBL, facklig samverkan, personalfrågor |
| **Anskaffning** | Upphandling, leverantörskrav |

**Viktiga principer från riktlinjerna:**

1. **"Human in the loop"** – Mänsklig kontroll i beslutsfattande
2. **Transparens** – Öppenhet om AI-användning
3. **Hållbarhet** – Miljö- och resurshänsyn
4. **Integritetsskydd** – GDPR-efterlevnad från start

**Praktisk användning:**
- Riktlinjerna finns på **digg.se/ai**
- Uppdateras löpande i takt med utvecklingen
- Riktar sig till alla i offentlig förvaltning – från medarbetare till ledning

> **För konsulter:** Riktlinjerna är ett utmärkt referensdokument att hänvisa till i kunddialoger. De ger legitimitet och trygghet för kunder som är osäkra på AI-användning.

---

#### B. EU AI Act – Översikt

EU:s AI-förordning (AI Act) trädde i kraft i augusti 2024 och är världens första omfattande AI-lagstiftning. Den påverkar hur AI får utvecklas och användas inom EU.

**Riskbaserat ramverk:**

| Risknivå | Exempel | Krav |
|----------|---------|------|
| **Oacceptabel risk** | Social poängsättning, manipulation | Förbjudet |
| **Hög risk** | AI i rekrytering, kreditbedömning, utbildning | Strikt reglerat |
| **Begränsad risk** | Chatbotar, AI-genererat innehåll | Transparenskrav |
| **Minimal risk** | Spamfilter, rekommendationssystem | Inga specifika krav |

**Viktiga datum:**

| Datum | Vad händer |
|-------|------------|
| Februari 2025 | Förbjudna AI-praktiker förbjuds, AI-literacy-krav börjar gälla |
| Augusti 2025 | Regler för generativ AI (GPAI-modeller) gäller |
| Augusti 2026 | Huvuddelen av regelverket gäller fullt ut |
| Augusti 2027 | Regler för högrisk-AI i produkter gäller |

**Sverige:** Regeringen har gett IMY (Integritetsskyddsmyndigheten) och DIGG samordningsansvar för AI-tillsyn. AI Sweden stödjer implementering i näringsliv och offentlig sektor.

---

#### B. GDPR och AI – Svensk tillämpning

GDPR (Dataskyddsförordningen) gäller fullt ut för AI som behandlar personuppgifter. IMY har utfärdat vägledning specifikt för AI.

**Centrala principer:**

| Princip | Betydelse för AI |
|---------|------------------|
| **Ändamålsbegränsning** | Data insamlad för ett syfte får inte utan vidare användas för AI-träning |
| **Uppgiftsminimering** | Samla bara in data som verkligen behövs |
| **Riktighet** | AI-output om personer måste vara korrekt |
| **Lagringsminimering** | Radera data när den inte längre behövs |
| **Rättslig grund** | Måste finnas laglig grund för behandlingen |

**Särskilt viktigt:**
- **Automatiserat beslutsfattande (Art. 22):** Beslut som enbart baseras på automatiserad behandling och har rättslig verkan kräver mänsklig granskning
- **Konsekvensbedömning:** Krävs ofta vid AI-användning som behandlar personuppgifter
- **Registerföring:** Organisationen måste dokumentera vilka AI-verktyg som används

**IMY:s vägledning:** IMY har publicerat specifik vägledning om AI och personuppgifter. Kolla imy.se för aktuella riktlinjer.

---

#### C. OSL – Offentlighets- och sekretesslagen

För konsulter som arbetar mot offentlig sektor är OSL central.

**Huvudprinciper:**

| Fråga | Betydelse |
|-------|-----------|
| **Allmänna handlingar** | AI-genererade dokument kan bli allmänna handlingar |
| **Sekretess** | Sekretessbelagd information får INTE delas med AI-verktyg utanför myndigheten |
| **Molntjänster** | Användning av amerikanska AI-tjänster är problematisk för sekretessbelagd info |
| **Utlämnande** | Om AI-output sparas kan det begäras ut |

**Praktisk konsekvens för konsulter:**

🚫 Dela aldrig sekretessbelagd information med öppna AI-verktyg som ChatGPT eller Claude

⚠️ Var medveten om att kommuner/regioner kan ha striktare regler

✅ Använd anonymisering eller godkända verktyg enligt kundens policy

**Schrems II-problematiken:** Överföring av personuppgifter till USA (där de flesta AI-leverantörer finns) är juridiskt komplicerat. Många offentliga organisationer har därför restriktioner för amerikanska molntjänster.

---

#### D. Arbetsrätt och facklig samverkan (MBL)

Vid AI-införande i organisationer gäller MBL (Medbestämmandelagen).

**När gäller MBL?**
- Införande av nya AI-verktyg som påverkar arbetssituationen
- Förändringar i arbetsuppgifter till följd av AI
- AI-baserad övervakning eller prestationsmätning

**Arbetsgivarens skyldigheter:**
1. **Informationsplikt** – Informera facket om planerade förändringar
2. **Förhandlingsskyldighet** – Förhandla innan beslut fattas
3. **Rätt till insyn** – Fackliga representanter har rätt att förstå hur AI används

**För konsulter:** Om uppdraget handlar om AI-införande, säkerställ att kunden hanterar den fackliga processen korrekt. Det är ofta en framgångsfaktor – inte bara ett juridiskt krav.

---

#### E. Upphandling och AI (LOU/LUF)

För offentliga kunder som upphandlar AI-tjänster gäller LOU (Lagen om offentlig upphandling).

**Relevanta aspekter:**

| Aspekt | Övervägande |
|--------|-------------|
| **Kravspecifikation** | Definiera funktionskrav, inte specifika produkter |
| **Dataskydd** | Ställ krav på GDPR-compliance |
| **Lokalisering** | Överväg krav på datalagring inom EU |
| **Transparens** | Kan kräva insyn i hur AI-modellen fungerar |
| **Etik** | Möjligt att ställa etiska krav i upphandlingen |

**DIGG:s vägledning:** DIGG har publicerat stöd för upphandling av AI i offentlig sektor.

---

#### F. Vad betyder regelverken för konsulter?

| Område | Din skyldighet |
|--------|----------------|
| **AI-literacy** | Du förväntas ha grundläggande förståelse (EU AI Act) |
| **Transparens** | Berätta när AI använts i vissa situationer |
| **Dataskydd** | Följ GDPR, anonymisera personuppgifter |
| **Sekretess** | Respektera OSL i offentliga uppdrag |
| **Kundrådgivning** | Hjälpa kunder förstå sina skyldigheter |
| **Facklig process** | Påminn kunder om MBL vid AI-införande |

### 5. Professionellt omdöme – ett ramverk

#### Bedömningsfrågor före AI-användning

| Fråga | Om JA → |
|-------|---------|
| Innehåller uppgiften känslig information? | Anonymisera eller avstå |
| Är faktagranskning kritisk? | Planera för verifiering |
| Kan fel få allvarliga konsekvenser? | Var extra noggrann med granskning |
| Berör det beslut om människor? | Var medveten om bias |
| Förväntar sig kunden att AI inte används? | Var transparent eller avstå |

#### Beslutstrappa för osäkra situationer

```
1. Kan jag verifiera resultatet?
   ↓ NEJ → Använd inte AI för denna uppgift
   ↓ JA
2. Är informationen lämplig att dela?
   ↓ NEJ → Anonymisera eller abstrahera
   ↓ JA
3. Förstår jag output tillräckligt för att ta ansvar?
   ↓ NEJ → Fördjupa dig eller fråga kollega
   ↓ JA
4. Använd AI, granska noggrant, ta ägarskap
```

#### Situationer som kräver extra omdöme

| Situation | Övervägande |
|-----------|-------------|
| Analys som påverkar anställningar | Hög risk för bias, mänsklig granskning kritisk |
| Juridiska dokument | AI förstår inte juridisk kontext |
| Medicinsk eller hälsorelaterad rådgivning | Kan vara livsavgörande, undvik AI |
| Politiskt känsliga frågor | AI kan ha bias, var extra kritisk |
| Beslut om barn eller utsatta grupper | Extra höga krav på noggrannhet |

---

## Praktiska exempel

### Exempel 1: Dilemma om informationsdelning

**Situation:** Du ska sammanfatta en rapport som innehåller kommunens planerade besparingsprogram med namngivna förvaltningar och budgetsiffror.

**Alternativ:**
1. Klistra in hela rapporten i ChatGPT
2. Anonymisera och generalisera innan AI-användning
3. Sammanfatta manuellt

**Rätt val:** Alternativ 2 eller 3, beroende på känslighet. Aldrig alternativ 1 med verkliga namn och siffror.

### Exempel 2: Bias i rekryteringsanalys

**Situation:** AI hjälper dig analysera CV:n för en rekryteringsprocess.

**Risk:** AI kan systematiskt nedvärdera kandidater baserat på namn, utbildningsbakgrund eller andra faktorer som korrelerar med kön eller etnicitet.

**Åtgärd:** 
- Anonymisera CV:n före analys
- Låt AI bara extrahera information, inte ranka
- Mänsklig bedömning av slutkandidater

### Exempel 3: Transparens om AI-användning

**Situation:** Du har använt AI för att skriva första utkast till en rapport. Kunden frågar hur rapporten tagits fram.

**Bättre svar:** "Jag har använt AI som stöd för struktur och formulering, men all analys, slutsatser och fakta är granskade och validerade av mig. Rapporten representerar min professionella bedömning."

**Sämre svar:** "Jag skrev den." (om det inte stämmer)

---

## Praktiska övningar

### Övning 1: Riskbedömning (15 min)

**Scenario:** Du ska använda AI för följande uppgifter. Bedöm risknivå (Låg/Medel/Hög) och motivera:

1. Sammanfatta publikt tillgängliga årsredovisningar
2. Analysera intervjuer med kommunanställda om arbetsmiljö
3. Skriva utkast till e-post till kund
4. Ta fram beslutsunderlag om personalförändringar
5. Generera förslag på workshopövningar

**Diskutera:** Hur påverkar risknivån hur du använder AI?

### Övning 2: Anonymiseringsövning (10 min)

**Uppgift:** Skriv om följande text så den kan användas med öppna AI-verktyg:

*"Jag intervjuade Anna Svensson, ekonomichef på Stenungsunds kommun, om deras nya budgetprocess. Hon berättade att de har 450 MSEK i budget och planerar neddragningar på socialförvaltningen med 15 anställda."*

<details>
<summary>Visa förslag</summary>

*"Jag intervjuade ekonomichefen på en mellanstor kommun om deras nya budgetprocess. Hon berättade att de har en budget i intervallet 300-500 MSEK och planerar personalförändringar på en av förvaltningarna."*

</details>

### Övning 3: Dilemmasituation (15 min)

**Scenario:** En kund ber dig analysera medarbetarenkäter för att identifiera "problemindivider" med hjälp av AI.

**Diskutera i grupp:**
1. Vilka etiska problem ser ni?
2. Hur skulle ni svara kunden?
3. Finns det ett sätt att hjälpa kunden som är etiskt försvarbart?
4. Var går gränsen för vad vi som konsulter ska göra?

### Övning 4: DIGG/IMY:s riktlinjer i praktiken (15 min)

**Uppgift:** Gå till digg.se/ai och bekanta dig med de 18 riktlinjerna.

**Scenario:** Din kund (en mellanstor kommun) vill börja använda generativ AI för att:
- Sammanfatta medborgarförslag
- Skriva utkast till beslutsunderlag
- Besvara vanliga frågor via chattbot på hemsidan

**Uppgift i par:**
1. Identifiera vilka av de 7 områdena i riktlinjerna som är mest relevanta
2. Lista 3-5 konkreta frågor kunden bör besvara innan de börjar
3. Föreslå en "quick win" – något kunden kan börja med som har låg risk

**Diskutera:** Hur kan ni som konsulter använda riktlinjerna i kunddialoger?

### Övning 5: Självreflektion (Hemuppgift)

Tänk på ett uppdrag du nyligen arbetat med:
1. Hade AI kunnat bidra? Hur?
2. Vilka risker hade det inneburit?
3. Hur hade du hanterat dessa risker?
4. Hade du behövt vara transparent mot kunden om AI-användning?

---

## Reflektionsfrågor

1. Har du själv upplevt att AI gett dig bias-präglad information? Hur märkte du det?

2. Var går din personliga gräns för vilken information du delar med AI-verktyg?

3. Hur skulle du reagera om en kollega använde AI för något du bedömer olämpligt?

4. Tror du att kunder förväntar sig att konsulter använder AI? Borde de informeras?

5. Hur balanserar du effektivitet mot säkerhet och etik?

---

## Fördjupning & externa resurser

### Primära svenska resurser (2025)
| Resurs | URL | Beskrivning |
|--------|-----|-------------|
| **[DIGG: AI för offentlig förvaltning](https://www.digg.se/ai-for-offentlig-forvaltning)** | digg.se/ai | De 18 riktlinjerna + vägledning, webbinarier |
| **[IMY: AI och dataskydd](https://www.imy.se/)** | imy.se | GDPR-vägledning specifikt för AI |
| **[AI-kommissionens färdplan](https://www.regeringen.se/rattsliga-dokument/statens-offentliga-utredningar/2024/11/sou-202489/)** | regeringen.se | Nationell strategi och handlingsplan |
| **[AI Sweden](https://www.ai.se/sv)** | ai.se | Nationellt centrum – resurser, nätverk, utbildning |
| **[SKR: AI i kommuner](https://skr.se/digitaliseringivalfarden/datadrivenutveckling/artificiellintelligensai.716.html)** | skr.se | Erfarenheter och stöd för kommunsektorn |

### Svenska myndigheter med AI-ansvar
| Myndighet | Roll |
|-----------|------|
| **[DIGG](https://www.digg.se)** | Samordning, vägledning, AI-verkstad |
| **[IMY](https://www.imy.se)** | Dataskyddstillsyn, regulatorisk sandlåda |
| **[Upphandlingsmyndigheten](https://www.upphandlingsmyndigheten.se)** | Vägledning om upphandling av AI |
| **[Finansinspektionen](https://www.fi.se)** | AI i finanssektorn |
| **[Socialstyrelsen](https://www.socialstyrelsen.se)** | AI i vård och omsorg |
| **[Skolverket](https://www.skolverket.se)** | AI i utbildning |

### EU-resurser
| Resurs | Beskrivning |
|--------|-------------|
| **[AI Act Explorer](https://artificialintelligenceact.eu/)** | Komplett guide till EU AI Act |
| **[EU AI Office](https://digital-strategy.ec.europa.eu/en/policies/ai-office)** | Officiell EU-resurs för AI-reglering |
| **[EDPB](https://www.edpb.europa.eu/)** | Europeiska dataskyddsstyrelsen – AI och GDPR |

### Forskning och fördjupning
| Resurs | Beskrivning |
|--------|-------------|
| **[Lunds universitet – AI-forskning](https://www.ai.lu.se/)** | Svensk akademisk forskning om AI |
| **[RISE](https://www.ri.se/sv/expertisomraden/ai)** | Forskningsinstitut med AI-fokus |
| **[Gender Shades](http://gendershades.org/)** | Banbrytande forskning om bias (Buolamwini) |
| **[Anthropic Research](https://www.anthropic.com/research)** | Hur Claude är designad för säkerhet |

---

## Kunskapstest

### Fråga 1
Vad är en "hallucination" i AI-sammanhang?

- A) När AI vägrar svara
- B) När AI genererar trovärdig men fabricerad information
- C) När AI ger samma svar upprepade gånger
- D) När AI missar relevant information

**Rätt svar:** B

---

### Fråga 2
Vilken typ av information ska du ALDRIG dela med öppna AI-verktyg?

- A) Publikt tillgängliga rapporter
- B) Generella branschfrågor
- C) Personuppgifter och affärshemligheter
- D) Frågor om projektmetodik

**Rätt svar:** C

---

### Fråga 3
Vilken svensk lag är särskilt viktig att beakta vid AI-användning i offentlig sektor?

- A) Marknadsföringslagen
- B) Offentlighets- och sekretesslagen (OSL)
- C) Produktansvarslagen
- D) Konsumenttjänstlagen

**Rätt svar:** B

---

### Fråga 4
Vad kräver MBL (Medbestämmandelagen) vid AI-införande?

- A) Att AI-leverantören godkänner användningen
- B) Att facket informeras och förhandling sker innan beslut
- C) Att alla anställda genomgår AI-utbildning
- D) Att IMY godkänner implementeringen

**Rätt svar:** B

---

### Fråga 5
Vad är ett tecken på att AI kan vara påverkad av bias?

- A) Svaret är grammatiskt korrekt
- B) Svaret bekräftar dina antaganden utan kritik
- C) Svaret är långt och detaljerat
- D) Svaret innehåller citat

**Rätt svar:** B

---

## Sammanfattning

- **Kvalitetsrisker** inkluderar hallucinationer och kontextblindhet – verifiera alltid
- **Bias finns** i alla AI-system – ifrågasätt ensidiga svar
- **Informationssäkerhet** kräver anonymisering av känslig information
- **EU AI Act** ställer krav på transparens och AI-literacy
- **Professionellt omdöme** innebär att göra medvetna avvägningar, inte att följa checklistor

---

*Gå vidare till Modul 6: Förankring och fortsatt lärande →*
