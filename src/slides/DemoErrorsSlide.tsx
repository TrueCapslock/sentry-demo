import * as Sentry from '@sentry/react'

function triggerError() {
  throw new Error('🚨 Dette er en test-feil fra Sentry-demo!')
}

function triggerAsyncError() {
  new Promise((_, reject) => reject(new Error('💥 Async-feil fra demo')))
}

function triggerHandledError() {
  try {
    JSON.parse('ugyldig json')
  } catch (e) {
    Sentry.captureException(e)
  }
}

function triggerMessage() {
  Sentry.captureMessage('📝 Egen melding sendt til Sentry', 'info')
}

export default function DemoErrorsSlide() {
  return (
    <div className="slide">
      <h2>Live Demo — Feilsporing</h2>
      <p className="demo-intro">Trykk på knappene for å sende feil til Sentry:</p>
      <div className="demo-actions">
        <button className="btn danger" onClick={triggerError}>
          💥 Kast unntak
        </button>
        <button className="btn danger" onClick={triggerAsyncError}>
          ⚡ Async-feil
        </button>
        <button className="btn" onClick={triggerHandledError}>
          🧹 Fanget feil
        </button>
        <button className="btn" onClick={triggerMessage}>
          📬 Egen melding
        </button>
      </div>
      <p className="demo-hint">
        Åpne <strong>Sentry Dashboard</strong> → Issues for å se feilene
      </p>
    </div>
  )
}
