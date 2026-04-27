# Hemvar v1.0 — roadmap

Statusoversikt og prioritert plan for levering av v1.0 per Hovedavtalen §3. Oppdatert april 2026.

## Kontraktsforpliktede funksjoner (Hovedavtalen §3)

| # | Funksjon | Status |
|---|----------|--------|
| 1 | Brukerregistrering og pålogging | ❌ Backend |
| 2 | Abonnement og betaling | ❌ Backend |
| 3 | Dashboard og årshjul | 🟡 Dashboard bygget, årshjul mangler |
| 4 | Oppgaveregister og tiltakshåndtering | 🟡 Driftsoppgaver bygget, tiltak-CRUD mangler |
| 5 | Avviksregistrering og -oversikt | 🟡 Under arbeid (denne iterasjonen) |
| 6 | Dokumentarkiv og FDV-struktur (NS 3451) | 🟡 Delvis, arkiv-side mangler |
| 7 | Adminpanel og brukeradministrasjon | ❌ Må bygges |
| 8 | Skalerbar kodebase | 🟢 React + modulær |
| 9 | Sikkerhet, hosting, GDPR | ❌ Backend/infra |
| 10 | Tilstandsanalyse (NS 3424, TG/KG) | 🟡 Visning bygget, registrering mangler |
| 11 | Tiltaksregistrering og vedlikeholdsplan | 🟡 «Neste tiltak» vises, plan-side mangler |

Legend: 🟢 ferdig · 🟡 delvis · ❌ ikke bygget

## Målgruppe (avklaring pågår)

Per Pål-mailen (april 2026): v1.0 leveres til **borettslag, sameier og tilsvarende organiserte eiendomsaktører**. Enebolig/fritid er utenfor scope og vurderes senere som egen modus eller separat produkt. Venter formell bekreftelse fra Pål.

## Sprint-plan

### Sprint 1 — Kjernen av FDV
1. ✅ **Avvik** — registrering og oversikt (pkt 5)
2. ✅ **Driftsoppgaver** — tabell og registrering
3. ✅ **Dokumentarkiv** — NS 3451-tre og last opp (pkt 6)
4. **Vedlikeholdsplan** — tidslinje med tiltak (pkt 11) ← *pågår*

### Sprint 2 — Tilstandsanalyse og integrasjon
5. Tilstandsanalyse — registrering med TG/KG (pkt 10)
6. **Ingest av data fra tilstandsrapporter** — auto-opprette tiltak i vedlikeholdsplanen fra innsendte tilstandsvurderinger (Fagvar-kobling senere)
7. Årshjul — driftsoppgaver fordelt over året (pkt 3)

### Sprint 3 — Admin
8. Adminpanel og brukeradministrasjon (pkt 7)
9. Varsler og frister

### Backend-avhengig (Mathias)
- Pålogging, abonnement, hosting, GDPR (pkt 1, 2, 9)
- Fagvar-integrasjon (inbound webhook for tilstandsrapporter)
- Persistens av all data

## Designprinsipper (forankret)

- **Bygningsdel er navet** (ADR-001). All data henger på bygningsdel.
- **Avvik knyttes til bygningsdel som regel**, men skal også kunne registreres uten — brukeren skal ikke tvinges til å velge bygningsdel hvis det ikke passer.
- **Klartekst fremfor fagspråk.** «Tak», ikke «Yttertak kategori 26». NS-koder lagres i data, skjules i UI.
- **TG/KG oversettes til klartekst** i UI. Brukes som metadata bak «Teknisk informasjon»-disclosure.
- **Vedlikeholdstiltak er direkte koblet til tilstandsvurdering.** Et tiltak bærer `source` som refererer til tilstandsrapporten det kom fra. Manuelt opprettede tiltak har `source: 'manuell'`.
- **Design-system** — Plus Jakarta Sans, hvite containere på varm bakgrunn (`#F5F2EA`), 1 px hårline, brand-teal `#073932` som primær, skriftsystem i én sans-serif.

## Prototype-spesifikke ting å fjerne før launch

- **X-knappen i onboarding-popupen** (`src/components/Onboarding.jsx`). Lar bruker dismiss onboarding uten å fullføre — kun for prototype-testing. Skal fjernes i v1.0. Se TODO-kommentar i komponenten.

## Referansedokumenter
- `Docs/overtakelse-til-cowork.md` — prosjekt-overtakelse
- `Docs/adr/ADR-001-bygningsdel-som-nav.md` — arkitekturvalg
- `Docs/arkitektur-ns3451.md` — kundens visjon i dybden
- Hovedavtalen (25.06.2025)
- Overdragelsesavtalen (mars 2026)
