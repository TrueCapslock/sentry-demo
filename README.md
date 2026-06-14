# Sentry-demo — Presentasjon med live demo

En presentasjon bygget med Vite + React + TypeScript som viser frem **Sentry** i praksis. Hver side er en slide, og underveis kjøres live demoer hvor feil sendes til Sentry direkte fra presentasjonen.

## Kom i gang

```bash
npm install
npm run dev
```

Åpne URL-en som vises i terminalen (som standard `http://localhost:5173`).

## Slik bruker du presentasjonen

### Navigasjon

| Tast | Handling |
|------|----------|
| → / ↓ / Mellomrom | Neste slide |
| ← / ↑ | Forrige slide |
| `Esc` eller `o` | Åpne slide-oversikt (grid) |
| `1`–`9` | Hopp til slide (i oversiktsmodus) |

Bunnlinjen viser slide-nummer, fremdriftsindikator og navigasjonsknapper.

### Slides

1. **Velkommen** — introduksjon
2. **Agenda** — oversikt over presentasjonen
3. **Hva er Sentry?** — om feilsporingsverktøyet
4. **Plattform** — GlitchTip vs Sentry
5. **Oppsett** — hvordan Sentry ble installert
6. **Feilsporing** — knapper som sender ulike typer feil
7. **Demo-app + Dashboard** — en todo-app med bevisste bugs og live event-log
8. **Ytelse** — generer ytelsesspans
9. **Oppsummering** — hva vi har sett

## Demoen

Slide 7 inneholder en **todo-app** med innebygde bugs for å demonstrere hvordan Sentry fanger opp feil:

- **Tom input** — prøv å legge til uten tekst
- **"feil"-trigger** — skriv en todo som inneholder ordet "feil" (hver 3. gang)
- **Sletting** — forsøk å slette det tredje elementet
- **💥 Krasj** — trigger et render-krasj som fanges av Sentry ErrorBoundary
- **⚡ Async** — kast en uhåndtert feil i et Promise

Hver handling logges i sanntid i panelet til høyre, og feilene havner i Sentry-dashboardet. Alle feil har brukerkontekst (`demo-user`), tags, breadcrumbs, og performance-spans.

En **💬 Feedback**-knapp lar deg sende tilbakemelding direkte til Sentry.

## Bygg

```bash
npm run build    # produksjonsbygg (source maps lastes opp til Sentry)
npm run preview  # forhåndsvis bygg
```
