# Hemvar arkitektur — NS 3451 som nav

**Kilde:** E-post fra kunde, april 2026
**Status:** Retningsgivende for all videre utvikling

## Kjerneprinsipp

Hele Hemvar bygges opp rundt **NS 3451** (bygningsdelstabellen). Bygningsdelen
er navet — alle data henger på bygningsdelen, ikke omvendt.

```
                   FDVU
            BIM             Klassifikasjon
                  \  |  /
       Statistikk — NS 3451 — Identifikasjon
                  /  |  \
      Bygningsfunksjon     Kostnadskalkyle
          Byggetegninger    Livssykluskostnader
             Tilstandsregistrering
                Byggebeskrivelser
```

## De tre modulene

### 1. Drift
Lovpålagte og periodiske oppgaver knyttet til en bygningsdel.
- Eksempel: Årlig brannkontroll på brannslukningsapparat
- Data bor på bygningsdelen

### 2. Vedlikehold
Tilstandsanalyser (TG/KG) + livssykluskostnader danner grunnlag for
vedlikeholdsplanen.
- Tilstandsanalyse (TG/KG, kontrollpunkter, bilder, vurderinger)
- Livssykluskostnader
- Vedlikeholdsprosjekt (neste steg)

### 3. Dokumentasjon
Alle dokumenter (tegninger, servicerapporter, produktdatablad osv.) skal
knyttes direkte til en bygningsdel.
- Eksempel: Servicerapport fra heisservice → henger på bygningsdelen "Heis"

## Dataflyt

```
Tilstandsanalyse          Vedlikeholdstiltak            Prosjektering (v2.0)
─────────────────         ─────────────────             ───────────────────
TG/KG               →     Grunnlag for tiltak    →      Start prosjektering
Kontrollpunkter     →     Tilgjengelig i tiltak   →     ...
Vurderinger         →     Tilgjengelig i tiltak   →     ...
Bilder              →     Tilgjengelig i tiltak   →     ...
```

Når en bruker åpner et vedlikeholdstiltak, skal all data fra tilstandsanalysen
være direkte synlig.

## Designprinsipper

Kunden vil ha det:
- **Enkelt** — ingen fagterminologi der det ikke trengs
- **Intuitivt** — brukeren skal forstå uten opplæring
- **Visuelt** — god presentasjon av bygningsdelshierarkiet

## Status i portalen

### Allerede på plass
- Tilstandsvurdering bruker bygningsdeler med 2-sifrede koder
- Tilstand → vedlikeholdsplan er koblet via `linkedConditionId`
- Vedlikeholdshistorikk arkiverer data per bygningsdel

### Ikke på plass ennå
- Dokumenter kobles ikke tydelig til bygningsdel i UI
- Oppgaver er ikke gruppert per bygningsdel
- Mangler en **bygningsdel-sentrert visning** (klikk på "Heis" → se alt)
- Vedlikeholdstiltak viser ikke tilstandsdata direkte

## Neste steg (forslag)

1. **Bygningsdel-side** — en side der man velger en bygningsdel og ser alt
   (oppgaver, tilstand, dokumenter, vedlikehold) samlet
2. **Visuell navigasjon** — kart/diagram over bygget der man klikker seg inn
3. **Koble dokumenter** til bygningsdel i opplasting + visning
4. **Vedlikeholdstiltak** viser tilstandsdata (TG/KG, bilder, vurdering)
5. **Start prosjektering**-knapp forberedt for v2.0
