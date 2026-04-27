# Hemvar-portal — overtakelse

Dette dokumentet beskriver prosjektets nåværende tilstand, beslutninger som
er tatt, og åpne spørsmål. Det er skrevet for en ny Claude-agent (Cowork)
som skal ta over der forrige sesjon sluttet.

---

## 1. Om prosjektet

**Hva:** Hemvar er en FDV-portal (Forvaltning, Drift, Vedlikehold) for
borettslag, sameier og eneboligeiere.

**Hvem:**
- **Martin Hansen** — designer/front-end-utvikler (Mediavibe). Ny til Node.js.
- **Backend-utvikler** — jobber parallelt med API og Fagvar-integrasjon.
- **Kunde** — betaler for prosjektet, har en klar visjon (se seksjon 3).

**Tech:** Vite + React + React Router + Tailwind CSS + shadcn/ui.
All data er fortsatt mock — ingen backend-kobling ennå.

**Kjører på:** http://localhost:5180 (port satt i `vite.config.js`).
**GitHub:** https://github.com/Martinshans/hemvar-portal (main-branch).

---

## 2. Designsystem

**Farger (A1 Ren Teal):**
- Primær: `#073932` (dyp teal)
- Bakgrunn: `#F5F2EA` (varm off-white)
- Kort: `#FEFDFB` (hvit)
- Status: grønn (OK), orange (avvik), rød (kritisk)
- Søk- og filterfelt skal alltid være hvite
- Sidebar skal være hvit

**Logo:** `/public/hemvar-logo.png` (bruker må legge denne selv hvis den
ikke ligger der ennå).

**Språk:** Norsk (nb-NO) gjennomgående. Alle tall og datoer formateres
etter norsk standard.

**Stil:** Dus, rolig, "skandinavisk". Ingen harde kontraster.

---

## 3. Kundens visjon — NS 3451 som nav

**Kjerneprinsipp:** Hele portalen skal organiseres rundt bygningsdelen
(NS 3451-tabellen). Bygningsdelen er navet — alle data henger på bygningsdelen,
ikke omvendt.

```
                Bygningsdel (f.eks. Tak)
                       |
   ┌──────────┬────────┼────────┬─────────────┐
   ▼          ▼        ▼        ▼             ▼
Tilstand  Oppgaver  Avvik  Dokumenter  Vedlikeholdstiltak
```

**Tre moduler:**
- **Drift:** lovpålagte/periodiske oppgaver per bygningsdel
- **Vedlikehold:** tilstandsanalyser + livssykluskostnader → vedlikeholdsplan
- **Dokumentasjon:** tegninger, servicerapporter knyttet til bygningsdel

**Data-kilde:** Tilstandsanalyser kommer inn fra **Fagvar.no** (vår
søsterportal). Backend-utvikleren håndterer integrasjonen.

**V2.0:** "Start prosjektering"-knapp på vedlikeholdstiltak.

Se `Docs/arkitektur-ns3451.md` for full beskrivelse.

---

## 4. Viktig brukerperspektiv (diskutert sist i forrige sesjon)

Brukeren er en vanlig huseier eller styremedlem — **ikke en bygningsingeniør**.

**Prinsipper som vi er blitt enige om:**
- **Språket må være menneskelig.** "Tak", ikke "Yttertak kategori 26".
- **NS 3451-koder skal være usynlige** for vanlige brukere.
  De kan vises som metadata i små "teknisk info"-seksjoner for de som vil.
- **TG/KG-tall skal oversettes** til klartekst ("Trenger oppfølging",
  "Kritisk") før brukeren ser dem.
- **En spade skal kalles en spade** — hverdagsspråk alltid.
- **Brukerens mentale modell:** "Jeg tenker på taket mitt", ikke "Jeg
  skal filtrere tilstandsvurderinger på kategori 26".

---

## 5. Hva som er bygget så langt

### Struktur
- AppShell med Sidebar (med kollapserbare grupper), Topbar, MobileNav
- React Router med flere sider
- Context for delt state: ConditionContext, DeviationContext, MaintenanceContext

### Sider
- **Dashboard** (`/dashboard`) — KPIer, årshjul, aktivitet, kommende oppgaver
- **Oppgaver** (`/oppgaver`) — liste + sheet fra høyre; kan "Sjekket" eller "Registrer avvik" (avvik flyter da til Åpne avvik)
- **Kontrollrunder** (`/oppgaver/:id`) — kompakt utvidbar sjekkliste
- **Avvik** (`/avvik`) — liste + detaljer
- **Tilstandsvurdering** (`/tilstand`) — tabell; klikk → sheet med 6 containers (Tilstandsgrad, Kontrollpunkt, Vurdering, Estimert kostnad, Tiltaksbeskrivelse, Bilder). Har "Tiltak gjennomført"-knapp som arkiverer data som historikk og nullstiller TG/KG, og oppretter/oppdaterer et vedlikeholdstiltak (kobler Tilstand → Vedlikeholdsplan)
- **Vedlikeholdsplan** (`/vedlikehold`) — tidslinje + liste
- **Vedlikeholdshistorikk** (`/tilstand/historikk`) — egen side (ikke fane)
- **Dokumentarkiv** (`/dokumenter`) — NS 3451-hierarki i sidebar, hvit bakgrunn, nedlastningsknapp + slett
- **Bygningsdeler** (`/eiendom/bygningsdeler`) — oversikt med "Hva må du gjøre nå?" øverst (akutt/planlegg-liste), deretter status-grupper: Kritisk → Trenger oppmerksomhet → I orden → Ikke vurdert (skjult bak knapp)
- **Bygningsdel detalj** (`/eiendom/bygningsdeler/:code`) — tabs (Tilstand, Oppgaver, Avvik, Dokumenter, Vedlikehold). **Dette skal endres, se seksjon 7.**
- **Brukere** (`/admin/brukere`) — med roller
- **Innstillinger** (`/admin/innstillinger`) — org/varsler/personvern
- **Abonnement** (`/abonnement`)

### Offentlige sider (uten sidebar)
- `/rapport/:token` — nedlastingsside for tilstandsrapport (fra Fagvar-e-post). Har Hemvar-logo + "Bli med på ventelisten"-knapp
- `/ventelisten` — enkel landingsside med e-post-signup

### Data
- `/src/data/mock-tasks.js` (15 oppgaver)
- `/src/data/mock-deviations.js` (10 avvik)
- `/src/data/mock-conditions.js` (8 tilstander)
- `/src/data/mock-maintenance.js` (6 tiltak)
- `/src/data/mock-documents.js` (12 dokumenter)
- `/src/data/kontrolloppgaver.js` (78 kontrolloppgaver)
- `/src/data/kontrollpunkter.js` (300+ kontrollpunkter)
- `/src/data/ns3451-categories.js` (NS 3451 med kategorier og helper-funksjoner)
- `/src/data/ns3424-grades.js` (TG- og KG-definisjoner)

### Mockup-filer (for diskusjon, ikke produksjon)
- `/color-options.html` — 3 fargetemaer
- `/color-options-a.html` — 4 varianter av A Ren Teal
- `/color-palette.html`
- `/bygningsdeler-forslag.html` — 5 alternativer for bygningsdel-oversikten
- `/tak-side-forslag.html` — **viktig — se seksjon 7**
- `/portal-kart.html` — kart over alle funksjoner

---

## 6. Dagens menystruktur

```
🏠 Oversikt                  → /dashboard
🏢 Eiendom                    (gruppe)
   Byggoversikt              → /eiendom/bygg
   Bygningsdeler             → /eiendom/bygningsdeler
   Dokumentarkiv             → /dokumenter
📋 Oppgaver                   (gruppe)
   Alle oppgaver             → /oppgaver
   Årshjul                   → /oppgaver/arshjul
⚠️ Avvik                      (gruppe)
   Åpne avvik                → /avvik
   Historikk                 → /avvik/historikk
🔍 Tilstand                   (gruppe)
   Tilstandsanalyse          → /tilstand
   Vedlikeholdsplan          → /vedlikehold
   Vedlikeholdshistorikk     → /tilstand/historikk
──────────
Innstillinger
   Profil                    → /admin/innstillinger
   Brukere                   → /admin/brukere
   Abonnement                → /abonnement
```

Definert i `/src/lib/constants.js`.

---

## 7. DER SESJONEN SLUTTET — åpent spørsmål

Brukeren reflekterte over at kundens visjon ("bygningsdeler er navet") ikke
gjenspeiles i dagens struktur. Bygningsdeler er gjemt 2 nivåer ned under
Eiendom, mens funksjonelle lister (Oppgaver/Avvik/Tilstand) er øverst.

Brukeren ba om et mockup av hvordan en enkelt bygningsdel-side burde se ut
for en vanlig huseier. Jeg lagde **`/tak-side-forslag.html`** — åpne den.

**Forslaget:**
- **Én rullbar side**, ikke faner.
- Seks seksjoner fra topp til bunn:
  1. Status-hero — hva er status (i klartekst, ingen TG-tall synlig)
  2. Neste tiltak — hva må gjøres, når, kostnad
  3. Hva ble funnet — tilstandsvurderingen i klartekst. Teknisk info skjult bak en "Teknisk informasjon"-disclosure
  4. Huskeliste — oppgaver + avvik samlet (ikke separert)
  5. Dokumenter — alt knyttet til denne bygningsdelen
  6. Historikk — tidslinje over hva som er skjedd

**Konsekvens: hele menyen kan forenkles.** Forslag:
```
🏠 Hjemme                    → dashboard
🏗️ Bygget                    → bygningsdeler (primær nav)
⚠️ Huskeliste                → oppgaver + avvik kombinert
📊 Plan                      → vedlikehold + kostnader fremover
📄 Dokumenter
⚙️ Innstillinger
```

Da forsvinner Tilstand som eget menypunkt — tilstandsdataen er bare innhold
på bygningsdel-siden.

**Status:** Brukeren har ikke bestemt seg ennå. Neste Claude-agent må:
1. Diskutere denne retningen med brukeren
2. Få godkjenning før implementasjon
3. Hvis godkjent: implementere mønsteret fra `/tak-side-forslag.html` i
   `BygningsdelDetailPage.jsx` (erstatter fanene), og restrukturere menyen
4. Oppdatere alle steder hvor NS-koder og TG/KG er synlige — enten skjule
   dem eller oversette til klartekst

---

## 8. Andre løse tråder / fremtidig arbeid

- **Koble til backend:** Når backend-utvikleren er klar, definer API-kontrakt:
  - `GET /api/buildings/:id/parts` — alle bygningsdeler med data
  - `GET /api/buildings/:id/parts/:nsCode` — alt for én bygningsdel
  - `POST /api/buildings/:id/conditions` — inbound webhook fra Fagvar
- **Legge til "Start prosjektering"-knapp (v2.0)** — placeholder finnes allerede
- **Klikkbare bygningsdel-badges** overalt i portalen (så man kan hoppe fra
  f.eks. et avvik til bygningsdel-siden)
- **Dashboardet** bør kanskje prioriteres om etter den nye tankegangen
- **Dokumentene** bør koble seg enklere til bygningsdeler ved opplasting

---

## 9. Konvensjoner / ting å passe på

- **Ikke endre ikoner og struktur uten å spørre.** Brukeren er eksplisitt
  om at han vil godkjenne endringer før de implementeres.
- **Farger: alltid hvit bakgrunn** på søk, filter, sidebar, dokumentlister.
- **Bruk eksisterende context-er** (ConditionContext, DeviationContext,
  MaintenanceContext) — ikke introduser ny state uten grunn.
- **Ikke push til GitHub uten at brukeren ber om det.** Brukeren har
  eksplisitt sagt "ikke push" tidligere.
- **Ikke lag nye dokumentasjonsfiler (`.md`, `README`) uten at brukeren ber
  om det.** Unntak: denne overtakelsen og `Docs/arkitektur-ns3451.md` som
  er eksplisitt bestilt.
- **Norsk alltid.** Alle strenger i UI og dialog med brukeren er på norsk.

---

## 10. Raskt-kom-i-gang for neste agent

```bash
cd /Users/martin/Hemvar/hemvar-portal
npm install       # hvis første gang
npm run dev       # starter på port 5180
```

Les først:
1. Dette dokumentet (du er her nå)
2. `Docs/arkitektur-ns3451.md` — kundens visjon i dybden
3. `/src/lib/constants.js` — dagens meny
4. `/src/App.jsx` — alle ruter
5. `/tak-side-forslag.html` — det mest aktuelle designforslaget

Siste melding fra forrige sesjon oppsummerer det åpne spørsmålet. Start
samtalen med brukeren ved å referere til dette — ikke begynn å kode før
han har tatt en avgjørelse om menystrukturen.
