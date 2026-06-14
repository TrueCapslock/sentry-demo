import * as Sentry from '@sentry/react'
import { useState } from 'react'

const codeSnippet = `import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: 'https://key@o0.ingest.us.sentry.io/0',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 0.1,
})`

export default function DemosetupSlide() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'fail'>('idle')

  async function verify() {
    setStatus('sending')
    try {
      const eventId = Sentry.captureMessage('✅ Verifiser oppsett – test OK')
      await Sentry.flush(2000)
      setStatus(eventId ? 'ok' : 'fail')
    } catch {
      setStatus('fail')
    }
  }

  return (
    <div className="slide">
      <h2>Live Demo — Oppsett</h2>
      <p className="demo-intro">Slik ser Sentry-integrasjonen ut i koden:</p>
      <pre className="code-block">
        <code>{codeSnippet}</code>
      </pre>
      <div className="demo-actions">
        <button className="btn" onClick={verify} disabled={status === 'sending'}>
          {status === 'sending' ? '⏳ Sender...' : '✅ Verifiser oppsett'}
        </button>
        {status === 'ok' && <span className="verify-ok">✓ Sendt! Sjekk Issues i Sentry</span>}
        {status === 'fail' && <span className="verify-fail">✗ Feil ved sending</span>}
      </div>
    </div>
  )
}
