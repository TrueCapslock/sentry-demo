# Sentry-demo — Fremdriftsplan

## ✅ Fullført

- [x] Vite + React + TypeScript oppsett med `@sentry/react` v10.57.0
- [x] Slide-deck med piltast-navigasjon (← → / mellomrom), progress bar, og slide-oversikt (Esc / `o` / knapp)
- [x] 9 slides: Velkommen, Agenda, Om Sentry, Plattform, Oppsett, Feilsporing, **Demo-app + Dashboard**, Ytelse, Oppsummering
- [x] Plattform-slide med GlitchTip- og Sentry-logoer og lenkede URL-er
- [x] `Sentry.init()` med DSN, environment, release, browserTracingIntegration, replayIntegration, **feedbackIntegration**
- [x] Sentry ErrorBoundary med fallback UI rundt todo-appen
- [x] Source maps lastes opp til Sentry via `sentry-vite-plugin` ved bygg (release matcher `main.tsx`)
- [x] Mørk presentasjonsstil (CSS-variabler)
- [x] **Demo-app** (todo) med bevisste bugs og live event-log
- [x] **Brukerkontekst**: `Sentry.setUser()` og `Sentry.setTag()` satt for demo-økten
- [x] **Tags & levels**: `warning` / `error` / `fatal` på feil, tags for `demo-source`, `action`, `reason`
- [x] **Breadcrumbs**: `Sentry.addBreadcrumb()` for alle handlinger (legg til, slett, krasj, async)
- [x] **Performance spans**: `startInactiveSpan()` for add-todo-operasjoner med attributter og status
- [x] **Feedback widget**: `feedbackIntegration()` med dark mode, åpnes via knapp i todo-appen
- [x] `dcc.config.js` for developer-control-center (build, watch, sourcemap-opplasting)
- [x] Bygg-kommando (`npm run build`) — TypeScript + Vite + source map-opplasting

## 📋 Gjenstående / forbedringspotensial

- [ ] **Deploy** — bygg og host på GitHub Pages / Vercel / Netlify slik at alle kan følge med fra egen maskin
- [ ] **Flere slides** — f.eks. Release-demo, Source Maps-demo, Session Replay-demo
- [ ] **Auto-play-modus** — slides som går automatisk med valgfritt intervall
- [ ] **Presenteringsnotater** — notater per slide som kun vises i eget vindu

## 🔧 Kjøring

```bash
npm run dev      # utviklingsserver
npm run build    # produksjonsbygg
npm run preview  # forhåndsvis bygg
```
