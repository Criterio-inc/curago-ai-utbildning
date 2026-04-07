# Förvaltningsplan – Curago AI-utbildning

> Plan för överlämning av drift och förvaltning från nuvarande utvecklare till Curago, inklusive kostnadsbild, kontoflytt och SSO-integration mot Microsoft 365.

---

## 1. Nuläge

Applikationen drivs idag på **gratis-konton** registrerade på extern utvecklare:

| Tjänst | Konto idag | Syfte | Plan idag |
|--------|------------|-------|-----------|
| **GitHub** | Extern utvecklare | Källkod, version, CI | Free |
| **Vercel** | Extern utvecklare | Hosting, deploy, CDN | Hobby (gratis) |
| **Supabase** | Extern utvecklare | Databas, auth, användardata | Free |
| **Domän** | – | (saknas, körs på `*.vercel.app`) | – |

**Risker med nuläget:**
- Allt ägande ligger på en privatperson – Curago saknar formell kontroll
- Supabase Free pausar projekt efter 7 dagars inaktivitet och har 500 MB databasgräns
- Vercel Hobby tillåter inte kommersiellt bruk enligt deras ToS
- Ingen SLA, ingen backup-policy, inga loggar äldre än 1 dag
- SSO mot Curagos M365 är inte möjligt på gratisnivåerna

---

## 2. Målbild – Curago äger och förvaltar

Alla tjänster flyttas över till **Curago-ägda konton** kopplade till en organisations-mejladress (t.ex. `it@curago.se` eller `tech@curago.se`). Curago betalar fakturorna direkt till respektive leverantör. Extern utvecklare behåller åtkomst som "Member/Developer" mot löpande timarvode.

```
Curago Org (ägare)
├── GitHub Org: criterio-inc (eller curago-ab)
│   └── Repo: curago-ai-utbildning
├── Vercel Team: Curago
│   └── Project: curago-ai-utbildning → utbildning.curago.se
├── Supabase Org: Curago
│   └── Project: curago-utbildning (Pro plan)
└── Microsoft Entra ID (M365)
    └── Enterprise App: Curago Utbildning (SAML SSO)
```

---

## 3. Kostnadsbild (löpande, exkl. moms)

| Tjänst | Plan | Pris/mån | Kommentar |
|--------|------|----------|-----------|
| **Supabase Pro** | Pro | **$25** (~270 kr) | 8 GB databas, 250 GB bandbredd, daglig backup 7 dagar, ingen pausning, e-postsupport |
| **Vercel Pro** | Pro | **$20/användare** (~220 kr) | Krävs för kommersiellt bruk + custom domän + analytics. 1 användare räcker initialt |
| **GitHub Team** | Team | **$4/användare** (~45 kr) | Endast om Curago vill ha privat org med fler än enstaka användare. Free räcker länge |
| **Domän** | `.se` | **~10 kr/mån** | Engångskostnad ~120 kr/år hos Loopia/Binero |
| **Anthropic / OpenAI** | – | 0 kr | Appen anropar inte LLM:er idag, allt innehåll är statiskt markdown |
| **Summa drift** | | **~500–550 kr/mån** | ≈ 6 000–6 600 kr/år |

**Förvaltningsarvode (förslag):**
- Löpande underhåll, säkerhetspatchar, dependency-uppdateringar, mindre innehållsändringar: **fast retainer 2–4 h/mån**
- Större ändringar (nya moduler, designändringar, nya features): **á-pris per timme** enligt avtal

> **Total årskostnad inkl. förvaltning (riktvärde):** ca 15 000–25 000 kr/år beroende på ambitionsnivå.

---

## 4. Överlämning – steg för steg

### 4.1 Skapa Curago-konton
1. **GitHub**: Skapa GitHub-organisation `curago` (eller använd befintlig). Verifiera domän `curago.se`.
2. **Vercel**: Skapa Vercel Team `Curago` med `it@curago.se`. Välj **Pro plan**.
3. **Supabase**: Skapa Supabase Organization `Curago` med `it@curago.se`. Välj **Pro plan**.
4. **Domän**: Registrera `utbildning.curago.se` som CNAME (eller köp ny domän om så önskas).

### 4.2 Flytta resurserna
1. **GitHub-repo**: Transfer repo från nuvarande org → `curago/curago-ai-utbildning`. Bjud in extern utvecklare som Maintainer.
2. **Vercel-projekt**: Transfer project till Curago Team. Koppla GitHub-repot på nytt. Sätt env-vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. **Supabase-projekt**: 
   - Alt A (rekommenderas): **Skapa nytt Pro-projekt** i Curagos org, exportera databasen från gamla projektet (`pg_dump`), importera till nya. Uppdatera env-vars i Vercel.
   - Alt B: Använd Supabases "Transfer project" mellan organisationer (kräver att båda är på betalande planer).
4. **Domän**: Peka `utbildning.curago.se` mot Vercel (CNAME → `cname.vercel-dns.com`). Lägg till domänen i Vercel-projektet.
5. **Verifiera**: Logga in, kör genom en modul, ta ett quiz, kontrollera att progress sparas.

### 4.3 Avveckla gamla konton
- Pausa eller radera gamla Supabase- och Vercel-projekt efter 2 veckors verifierad drift på det nya.
- Behåll en SQL-backup lokalt under övergångsperioden.

---

## 5. SSO mot Microsoft 365 (Entra ID)

Idag används **e-post + lösenord** via Supabase Auth, begränsat till `@curago.se`. För att konsulter ska kunna logga in med sitt vanliga Microsoft-konto (samma SSO som Outlook/Teams) sätter vi upp **SAML 2.0 mellan Supabase och Microsoft Entra ID**.

> **Förutsättning:** Supabase SSO kräver **Pro plan + SSO add-on** ($75/mån extra) ELLER att man använder Supabases inbyggda **Azure OAuth-provider** som ingår i Pro-planen utan extratillägg. För Curagos storlek räcker **Azure OAuth-providern** – den ger samma användarupplevelse (en knapp "Logga in med Microsoft") utan SAML-priset.

### 5.1 Variant A – Azure OAuth (rekommenderas, ingår i Pro)

**I Microsoft Entra ID (admin.microsoft.com → Entra ID):**
1. Gå till **Entra ID → App registrations → New registration**
2. Namn: `Curago Utbildning`
3. Supported account types: **Single tenant** (endast Curago)
4. Redirect URI: `https://<projekt-id>.supabase.co/auth/v1/callback` (Web)
5. Klicka **Register**
6. Notera **Application (client) ID** och **Directory (tenant) ID**
7. Gå till **Certificates & secrets → New client secret** – kopiera värdet (visas bara en gång)
8. Gå till **API permissions** – verifiera att `User.Read` (Microsoft Graph) är tillagt och **Grant admin consent**
9. (Valfritt) Under **Token configuration** lägg till `email` och `upn` som optional claims

**I Supabase Dashboard:**
1. **Authentication → Providers → Azure**
2. Slå på providern
3. Klistra in:
   - **Client ID** (Application ID från steg 6)
   - **Client Secret** (från steg 7)
   - **Azure Tenant URL**: `https://login.microsoftonline.com/<tenant-id>`
4. Spara

**I koden (`lib/supabase.ts`):**
```typescript
await supabase.auth.signInWithOAuth({
  provider: 'azure',
  options: {
    scopes: 'email openid profile',
    redirectTo: `${window.location.origin}/utbildning`
  }
})
```

**På loginsidan (`app/page.tsx`):**
Lägg till en knapp **"Logga in med Microsoft"** vid sidan av det befintliga e-postformuläret. Behåll e-post/lösenord som fallback för admin.

### 5.2 Variant B – SAML SSO (för större organisationer)
Om Curago vill ha tvingande SSO med automatisk användarprovisionering, gruppmappning och central avstängning vid offboarding:
- Aktivera **Supabase SSO add-on** (+$75/mån)
- Skapa en **Enterprise Application** i Entra ID istället för App Registration
- Konfigurera SAML-metadata enligt Supabases guide
- Mappa Entra-grupper → Supabase-roller

För Curagos storlek (~handfull konsulter) räcker Variant A.

### 5.3 Domänlås
Oavsett variant: behåll kodregeln att endast `@curago.se`-adresser släpps in. Detta är en extra säkerhet ifall någon felkonfigurerar Azure-appen som multi-tenant.

---

## 6. Säkerhet & efterlevnad

| Område | Åtgärd |
|--------|--------|
| **Backup** | Supabase Pro tar daglig backup, 7 dagars retention. Komplettera med veckovis `pg_dump` till Curagos OneDrive |
| **Hemligheter** | `.env` i Vercel, aldrig i repot. Rotera Supabase service-role key vid personalbyte |
| **GDPR** | Användardata = e-post + quiz-resultat. Lägg till radering på begäran via Supabase Dashboard. Personuppgiftsbiträdesavtal (DPA) finns hos både Supabase och Vercel |
| **Dependency-patchar** | Månatlig `npm audit` + Dependabot på GitHub-repot |
| **Loggar** | Vercel Pro = 1 veckas loggar, Supabase Pro = 7 dagars Postgres-loggar |
| **2FA** | Tvinga 2FA på alla GitHub/Vercel/Supabase-konton |

---

## 7. Förvaltningsåtaganden (förslag till avtal)

| Aktivitet | Frekvens | Tid |
|-----------|----------|-----|
| Säkerhetsuppdateringar (npm audit, Dependabot-PRs) | Månad | 1 h |
| Övervakning av drift (Vercel/Supabase status) | Löpande | – |
| Innehållsändringar i markdown-moduler | Vid behov | 0,25–1 h/ändring |
| Mindre buggfixar | Vid behov | Ingår upp till X h/mån |
| Större ändringar (nya moduler, features) | Beställning | Á-pris |
| Backup-verifiering | Kvartal | 0,5 h |
| Årlig genomgång (kostnader, dependencies, säkerhet) | År | 2 h |

---

## 8. Sammanfattning

**Vad Curago behöver besluta:**
1. Vem internt äger kontona (förslag: `it@curago.se`)?
2. Önskad domän (`utbildning.curago.se`?)
3. SSO-variant: **A (Azure OAuth, ingår)** eller B (SAML, +$75/mån)?
4. Förvaltningsavtal – retainer eller löpande timdebitering?

**Vad det kostar löpande:**
- **Drift**: ca **500–550 kr/mån** (Supabase Pro + Vercel Pro + domän)
- **Förvaltning**: enligt avtal, riktvärde **2–4 h/mån**
- **Total**: ~**15 000–25 000 kr/år**

**Tid för överlämning:** 1–2 arbetsdagar för kontoflytt + SSO-konfiguration, plus en veckas parallell drift för verifiering.
