# ADR-001: Bygningsdel som nav i portalen

**Status:** Foreslått
**Dato:** 2026-04-17
**Deciders:** Martin Hansen (design/frontend), kunde (visjon), backend-utvikler (API-kontrakt)

---

## Kontekst

Hemvar er en FDV-portal for borettslag, sameier og eneboligeiere. Kundens
eksplisitte visjon er at *bygningsdelen* (NS 3451-kategorien — tak, fasade,
bad, osv.) skal være navet som all annen data henger på: tilstand, oppgaver,
avvik, dokumenter og vedlikeholdstiltak er alle egenskaper ved en bygningsdel.

Dagens portal er bygget motsatt vei. Navigasjonen er organisert rundt
*funksjoner* — Oppgaver, Avvik, Tilstand, Vedlikeholdsplan, Dokumenter — hver
med sin egen toppnivå-meny. Bygningsdeler ligger gjemt to nivåer ned under
"Eiendom". Bygningsdel-detaljsiden bruker faner (Tilstand / Oppgaver / Avvik
/ Dokumenter / Vedlikehold) som fragmenterer bildet av én fysisk gjenstand.

Samtidig er målgruppen ikke bygningsingeniører, men *vanlige huseiere og
styremedlemmer*. Tidligere diskusjoner (seksjon 4 i overtakelsen) har
fastslått at fagspråk — NS-koder, TG/KG-tall — ikke skal være synlig i UI.

En mockup (`tak-side-forslag.html`) demonstrerer en alternativ struktur: én
rullbar side per bygningsdel, seks seksjoner i brukerens spørsmålsrekkefølge
(*Hvordan står det til? → Hva må gjøres? → Hva ble funnet? → Huskeliste →
Dokumenter → Historikk*), og all teknisk terminologi skjult bak
disclosure-elementer.

Vi står altså med et misforhold mellom kundens mentalmodell (bygningsdelen
er primær) og dagens informasjonsarkitektur (funksjonen er primær). Dette
må avgjøres før videre utvikling, fordi beslutningen påvirker menystruktur,
ruter, datahenting og minst én større side-refaktor.

**Krefter i spill:**

- Kundevisjon som eksplisitt krav.
- Brukbarhet for ikke-tekniske brukere.
- Forrige sesjons mockup er allerede laget og peker i én retning.
- Koden er ikke i produksjon — ingen brukere å migrere ennå.
- Mock-data fortsatt; backend-kontrakt ikke låst. Lav endringskostnad nå,
  høy senere.
- Martin vil eksplisitt godkjenne struktur- og ikon-endringer.

---

## Beslutning

**Valgt retning:** Restrukturere portalen slik at bygningsdelen blir primær
navigasjonsakse, med en rullbar detaljside per bygningsdel etter mønsteret
i `tak-side-forslag.html`. Funksjonelle oversikter (alle avvik, alle
oppgaver på tvers av bygningsdeler) beholdes som sekundære visninger men
fjernes fra toppmenyen.

*(Denne beslutningen skal bekreftes av Martin før implementasjon.)*

---

## Alternativer vurdert

### Alternativ A: Behold dagens struktur

Ingen strukturell endring. Oppgaver, Avvik, Tilstand, Vedlikehold forblir
egne menypunkter med egne sider. Bygningsdel-detalj beholder fanene. Vi
jobber videre med polering, data-kobling og Fagvar-integrasjon.

| Dimensjon             | Vurdering                                         |
| --------------------- | ------------------------------------------------- |
| Kompleksitet å levere | Lav — ingen endring                                |
| Leveringstid          | Kortest                                           |
| Samsvar med visjon    | Svakt — bryter med "bygningsdel som nav"          |
| Brukbarhet            | OK, men fragmentert informasjon per bygningsdel   |
| Teknisk gjeld         | Ingen ny, men låser dagens form                   |
| Omarbeidings-risiko   | Høy hvis kunde insisterer senere                  |

**Fordeler:** Ingen arbeid. All eksisterende kode og mental modell beholdes.
Forutsigbart.
**Ulemper:** Vi bygger videre på en arkitektur som eksplisitt bryter med
kundens uttalte visjon. Sannsynlig dyr omlegging senere.

### Alternativ B: Full restrukturering (som foreslått i mockupen)

Bygningsdel blir primær nav. `BygningsdelDetailPage.jsx` refaktoreres fra
faner til rullbar seksjonert side. Toppmeny krympes til **Hjemme · Bygget ·
Huskeliste · Plan · Dokumenter · Innstillinger**. Tilstand forsvinner som
eget menypunkt — tilstandsdata blir innhold på bygningsdelen. Oppgaver og
Avvik slås sammen til "Huskeliste". Ruter som `/tilstand`, `/avvik`,
`/oppgaver` kan beholdes internt, men skjules i navigasjon.

| Dimensjon             | Vurdering                                         |
| --------------------- | ------------------------------------------------- |
| Kompleksitet å levere | Høy — berører navigasjon, flere sider, kontekster |
| Leveringstid          | Estimert 2–3 dagers arbeid til første spill-bar   |
| Samsvar med visjon    | Sterkt — speiler kundens mentalmodell direkte     |
| Brukbarhet            | Sterk for målgruppen; svarer på huseier-spørsmål  |
| Teknisk gjeld         | Sletter gjeld (faner→sider) men krever refaktor   |
| Omarbeidings-risiko   | Lav hvis kunden bekrefter retningen               |

**Fordeler:** Koden speiler endelig visjonen. Én fortelling per bygningsdel.
Enklere mental modell for brukeren. Lav kostnad å gjøre *nå* (ingen
produksjonsbrukere, mock-data). Mockupen finnes allerede som mal.
**Ulemper:** Størst kortsiktig innsats. Bryter opp eksisterende context-er
— krever tverrgående datahenting på bygningsdel-kode. Funksjonelle
oversikter (f.eks. "alle åpne avvik på tvers av eiendommer") må løses som
sekundær visning, ikke primær sti.

### Alternativ C: Hybrid — ny bygningsdel-side, uendret meny

Implementer den rullbare bygningsdel-siden fra mockupen (erstatt fanene),
men behold dagens toppnivå-meny med Oppgaver, Avvik, Tilstand, osv.
Bygningsdelen løftes ikke i IA — bare detaljsiden moderniseres.

| Dimensjon             | Vurdering                                         |
| --------------------- | ------------------------------------------------- |
| Kompleksitet å levere | Middels — én stor side-refaktor, ingen meny-endring |
| Leveringstid          | Estimert 1–1,5 dag                                |
| Samsvar med visjon    | Delvis — bedre detaljside, men IA fortsatt funksjonsdrevet |
| Brukbarhet            | Bedre enn A, svakere enn B                        |
| Teknisk gjeld         | Duplisering: data vises både på bygningsdel-side *og* i funksjonssider |
| Omarbeidings-risiko   | Middels                                           |

**Fordeler:** Halv risiko, halv gevinst. Brukeren får den nye fortellingen
der det betyr mest (bygningsdel-detalj). Ingen meny-redesign å diskutere.
**Ulemper:** Inkonsistent mental modell — brukeren skjønner ikke hvorfor
samme avvik dukker opp både i "Avvik"-liste og på Tak-siden. Vi ender med
to kilder til sannhet i UI-et.

---

## Trade-off-analyse

Hovedvalget er mellom **leveringshastighet (A)**, **visjonsforankring (B)**
og **kompromiss (C)**. Siden portalen ennå ikke er i produksjon og
backend-API ikke er låst, er den tekniske endringskostnaden lavere *nå*
enn den noen gang kommer til å bli igjen. Det taler for B.

Det viktigste argumentet *mot* B er risiko for "scope creep" — en stor
refaktor som åpner flere følge-spørsmål (hvordan filtrere avvik på tvers
av bygningsdeler hvis menypunktet forsvinner? hvor bor historikk-
arkivet?). Disse må besvares eksplisitt før implementasjon for at B ikke
skal blø tidsbruk.

C er fristende fordi det virker som "trygg midtveis", men i praksis gir
det dårligst samsvar mellom meny (funksjonsbasert) og detaljside
(bygningsdel-basert). Brukeren sitter igjen med en dobbel struktur.

---

## Konsekvenser

**Hvis B velges, blir følgende enklere:**

- Kundens visjon reflekteres direkte i IA.
- Nye brukere skjønner modellen uten opplæring.
- Backend-API kan designes rundt bygningsdel-endepunkter
  (`/buildings/:id/parts/:nsCode`) uten å måtte tilby funksjonsnære
  snitt først.
- Dokumenter og vedlikeholdstiltak knyttes naturlig til bygningsdel.

**Hvis B velges, blir følgende vanskeligere:**

- "Globale" lister (alle åpne avvik, alle oppgaver denne uken) må
  designes som sekundær visning — hvor ligger de?
- Dashboardet må sannsynligvis redesignes i tråd med ny logikk.
- Kontrollrunder-siden (`/oppgaver/:id`) må plasseres i ny mental modell.
- Flere contexter blir lest av samme side — krever god hooks-design for
  å unngå prop-drilling.

**Ting vi må revurdere senere:**

- Dashboard-struktur (avgjøres i separat ADR).
- Backend API-kontrakt (koordineres med backend-utvikleren).
- Når tid "Start prosjektering"-knappen (v2.0) skal legges inn og hvor.

---

## Action items

1. [ ] Martin bekrefter eller avviser valget av alternativ B
2. [ ] Hvis bekreftet: definer de 4 åpne spørsmålene før implementasjon
   - Hvor havner globale lister (alle avvik / alle oppgaver)?
   - Hvor havner kontrollrunder i ny meny?
   - Skal `/tilstand`-ruten beholdes som "teknisk visning" eller fjernes helt?
   - Hva gjør vi med Dashboardet — egen ADR?
2. [ ] Oppdater `Docs/arkitektur-ns3451.md` med endelig valg
3. [ ] Lag en implementasjonsplan (separat dokument) med faser:
   - Fase 1: Ny `BygningsdelDetailPage.jsx` basert på mockup
   - Fase 2: Meny-restrukturering i `src/lib/constants.js`
   - Fase 3: Skjul/oversette NS-koder og TG/KG på tvers av portalen
   - Fase 4: Redesign dashboard (egen ADR først)
4. [ ] Koordiner med backend-utvikler: bekreft at API-kontrakten kan
   bygges rundt bygningsdel-endepunkter
