# Security Scan Report

**Projekt:** Curago AI-utbildning
**Datum:** 2026-01-28
**Skannat av:** Claude Code (automatisk säkerhetsskanning)
**Övergripande riskbedömning:** MEDEL

---

## Sammanfattning

Applikationen har en solid säkerhetsgrund med korrekt autentisering, auktorisering och parametriserade databasfrågor. Inga läckta hemligheter eller hårdkodade credentials hittades. Dock finns förbättringspotential kring HTTP-säkerhetshuvuden, rate limiting och beroendeuppdateringar.

---

## 1. Beroendesårbarheter (npm audit)

### KRITISK: Next.js 14.2.3

| Sårbarhet | Allvarlighetsgrad | Advisory |
|-----------|-------------------|----------|
| Cache Poisoning | Kritisk | GHSA-gp8f-8m3g-qvj9 |
| DoS via Image Optimization | Kritisk | GHSA-g77x-44xx-532m |
| DoS med Server Actions | Kritisk | GHSA-7m27-7ghc-44w9 |
| Authorization Bypass i Middleware | Kritisk | GHSA-f82v-jwr5-mffw |
| SSRF via Middleware Redirect | Hög | GHSA-4342-x723-ch2f |
| Content Injection (Image Optimization) | Hög | GHSA-xv57-4mr9-wg8v |
| Race Condition Cache Poisoning | Hög | GHSA-qpjv-v59x-3qc4 |
| Information Exposure (dev server) | Medel | GHSA-3h52-269p-cp9r |
| DoS med Server Components | Medel | GHSA-mwv6-3258-q52c, GHSA-5j59-xgg2-r9c4 |
| Cache Key Confusion | Medel | GHSA-g5qg-72qw-gw5v |
| DoS via Image Optimizer remotePatterns | Medel | GHSA-9g9p-9gw9-jx7f |

**Rekommendation:** Uppgradera Next.js till minst 14.2.35 (`npm audit fix --force`).

### LÅG: cookie-paket (<0.7.0)

| Sårbarhet | Allvarlighetsgrad | Advisory |
|-----------|-------------------|----------|
| Out-of-bounds characters i cookie-namn | Låg | GHSA-pxg6-pf52-xh8x |

**Rekommendation:** Uppgradera `@supabase/ssr` till >=0.8.0.

---

## 2. Hårdkodade hemligheter och credentials

**Status: INGA FUNNA**

- Inga API-nycklar, lösenord eller tokens hårdkodade i källkoden
- Inga `.env`-filer committade i git-historik
- Inga `.key`- eller `.pem`-filer i repot
- `.gitignore` exkluderar korrekt `.env*.local`, `*.pem`

---

## 3. XSS-risker (Cross-Site Scripting)

### 3.1 `dangerouslySetInnerHTML` i ModuleView.tsx (MEDEL risk)

**Filer:** `components/ModuleView.tsx:415`, `components/ModuleView.tsx:425`

Markdown-innehåll parsas med regex och renderas som rå HTML:
```tsx
<span dangerouslySetInnerHTML={{
  __html: trimmed.slice(2)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
}} />
```

**Risk:** Om en markdown-fil innehåller skadlig HTML (`<script>`, `<img onerror>`, etc.) kommer den att köras i användarens webbläsare.

**Mitigerande faktor:** Markdown-filerna är versionshanterade i repot och redigeras bara av betrodda utvecklare.

**Rekommendation:** Använd ett sanitize-bibliotek som `DOMPurify` eller `rehype-sanitize` innan rendering.

### 3.2 `dangerouslySetInnerHTML` i layout.tsx (LÅG risk)

**Fil:** `app/layout.tsx:25`

Hårdkodad inline-script för tema-initiering. Ingen användarinput involverad -- säker.

---

## 4. Autentisering och auktorisering

### 4.1 Styrkor
- Email-domänvalidering begränsar registrering till `@curago.se`
- Middleware skyddar alla `/utbildning/*`-routes med sessionskontroll (`middleware.ts:58-65`)
- Supabase Auth hanterar lösenords-hashing och sessionshantering
- Email normaliseras till lowercase (förhindrar case-sensitivity-attacker)

### 4.2 Svagheter

| Problem | Risk | Detalj |
|---------|------|--------|
| Domänkontroll bara klientsida | Medel | `isEmailAllowed()` körs i `lib/supabase.ts` (klientsida). Ingen server-sida validering utöver Supabase Auth |
| Enkel lösenordspolicy | Låg | Bara `password.length < 6` kontrolleras (`app/page.tsx:69`). Inga komplexitetskrav |
| Ingen brute-force-skydd | Medel | Ingen rate limiting på inloggningsförsök (Supabase kan ha inbyggt skydd) |

---

## 5. API-endpoints

### `GET /api/modules` (`app/api/modules/route.ts`)

| Kontroll | Status |
|----------|--------|
| Autentisering krävs | Nej (publikt innehåll) |
| Användarinput | Ingen |
| SQL-injektion | Ej tillämpligt |
| Rate limiting | Saknas |
| Cache-headers | Saknas |

**Risk:** Utan rate limiting kan denna endpoint belastas med upprepade requests som varje gång parsar alla markdown-filer från disk.

### `GET /api/stats` (`app/api/stats/route.ts`)

| Kontroll | Status |
|----------|--------|
| Autentisering krävs | Nej |
| Service Role Key | Faller tillbaka till anon-nyckel om saknas (rad 10-11) |
| SQL-injektion | Nej (RPC-anrop via Supabase) |
| Rate limiting | Saknas |
| Felhantering | Bra (loggar server-side, returnerar defaults) |

---

## 6. Saknade HTTP-säkerhetshuvuden

`next.config.js` saknar konfiguration av säkerhetshuvuden:

| Header | Status | Rekommenderat värde |
|--------|--------|-------------------|
| `X-Frame-Options` | Saknas | `DENY` |
| `X-Content-Type-Options` | Saknas | `nosniff` |
| `Referrer-Policy` | Saknas | `strict-origin-when-cross-origin` |
| `Content-Security-Policy` | Saknas | Anpassad policy |
| `Strict-Transport-Security` | Saknas | `max-age=31536000; includeSubDomains` |
| `Permissions-Policy` | Saknas | Begränsa kamera, mikrofon, etc. |

**Rekommendation:** Lägg till headers-konfiguration i `next.config.js`:
```js
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      ],
    }]
  },
}
```

---

## 7. Databasåtkomst och SQL-injektion

**Status: INGEN RISK FUNNEN**

Alla databasfrågor använder Supabase query builder som parametriserar alla värden:
- `hooks/useProgress.ts` -- `.eq('user_id', user.id).eq('module_id', moduleId)`
- `components/QuizView.tsx` -- `.upsert({...}, { onConflict: 'user_id,module_id' })`
- `app/api/stats/route.ts` -- `.rpc('get_landing_stats')`

**Rekommendation:** Verifiera att Supabase Row Level Security (RLS) är aktiverat och korrekt konfigurerat så att användare bara kan komma åt sina egna rader.

---

## 8. Övriga observationer

| Observation | Risk | Detalj |
|-------------|------|--------|
| Ingen CORS-policy | Låg | Next.js hanterar som standard, men explicit konfiguration rekommenderas |
| localStorage för progress | Låg | Användare kan manipulera progress via DevTools. Kritisk data (quiz) sparas i Supabase |
| Ingen audit-loggning | Medel | Inga loggar av inloggningsförsök, quizresultat eller administratörsåtgärder |
| Ingen `.env.example` | Låg | Ingen template-fil för nödvändiga miljövariabler |
| Ingen GDPR-hantering | Medel | Inget system för dataradering, export eller samtyckeshantering synligt i koden |

---

## Prioriterad åtgärdslista

### Kritiskt (åtgärda omgående)
1. **Uppgradera Next.js** till >=14.2.35 -- 11 kända sårbarheter inklusive auth bypass och cache poisoning
2. **Uppgradera @supabase/ssr** till >=0.8.0

### Högt (åtgärda före produktionssättning)
3. **Lägg till HTTP-säkerhetshuvuden** i `next.config.js`
4. **Implementera rate limiting** på API-endpoints
5. **Sanera HTML-output** i `ModuleView.tsx` med DOMPurify eller liknande

### Medel (planera in)
6. **Verifiera Supabase RLS-policyer** i Supabase-dashboarden
7. **Implementera audit-loggning** av autentiseringsförsök
8. **Stärk lösenordspolicy** (komplexitetskrav)
9. **Granska GDPR-compliance** (dataraderingsmekanismer)

### Lågt (vid tillfälle)
10. **Skapa `.env.example`** med alla nödvändiga miljövariabler
11. **Lägg till caching** för `/api/modules`-endpoint
12. **Explicit CORS-konfiguration**

---

## Slutsats

Applikationen har goda säkerhetsgrunder men behöver framför allt uppdaterade dependencies (Next.js har 11 kända sårbarheter) och HTTP-säkerhetshuvuden. Inga läckta hemligheter eller injektionssårbarheter hittades. Den mest akuta åtgärden är att uppgradera Next.js.
