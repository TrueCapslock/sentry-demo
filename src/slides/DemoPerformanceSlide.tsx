import * as Sentry from '@sentry/react'
import { useState } from 'react'

export default function DemoPerformanceSlide() {
  const [logs, setLogs] = useState<string[]>([])

  function addLog(msg: string) {
    setLogs((prev) => [...prev.slice(-20), msg])
  }

  function simpleSpan() {
    const span = Sentry.startInactiveSpan({ name: 'manuell-span', op: 'test' })
    addLog('✅ Manuell span startet og avsluttet')
    span.end()
  }

  function heavyCompute() {
    const span = Sentry.startInactiveSpan({ name: 'tung-beregning', op: 'function' })
    addLog('🐢 Simulerer tung beregning (200 ms)...')
    const start = performance.now()
    while (performance.now() - start < 200) {}
    span.setAttribute('duration_ms', '200')
    span.setStatus({ code: 1 })
    span.end()
    addLog('✅ Tung beregning ferdig — span sendt')
  }

  function nestedSpans() {
    const parent = Sentry.startInactiveSpan({ name: 'forelder-span', op: 'http.server' })
    addLog('📦 Forelder-span startet')

    const child1 = Sentry.startInactiveSpan({ name: 'db-spørring', op: 'db.query' })
    const start1 = performance.now()
    while (performance.now() - start1 < 80) {}
    child1.setAttribute('db.table', 'users')
    child1.setStatus({ code: 1 })
    child1.end()
    addLog('  └─ DB-spørring: 80 ms ✅')

    const child2 = Sentry.startInactiveSpan({ name: 'eksternt-api', op: 'http.client' })
    const start2 = performance.now()
    while (performance.now() - start2 < 120) {}
    child2.setAttribute('http.url', '/api/payments')
    child2.setAttribute('http.method', 'POST')
    child2.setStatus({ code: 1 })
    child2.end()
    addLog('  └─ Eksternt API: 120 ms ✅')

    parent.setStatus({ code: 1 })
    parent.end()
    addLog('📦 Forelder-span ferdig — se trestruktur i Performance')
  }

  function withMeasurement() {
    const span = Sentry.startInactiveSpan({ name: 'måling-eksempel', op: 'function' })
    const start = performance.now()

    const items = Array.from({ length: 10000 }, (_, i) => ({ id: i, val: Math.random() }))
    items.sort((a, b) => a.val - b.val)

    const elapsed = performance.now() - start
    Sentry.setMeasurement('items-sorted', 10000, 'none')
    Sentry.setMeasurement('sort-duration', elapsed, 'millisecond')

    span.setAttribute('items', '10000')
    span.setStatus({ code: 1 })
    span.end()
    addLog(`📊 Sorterte 10 000 elementer på ${Math.round(elapsed)} ms — egendefinerte målinger sendt`)
  }

  return (
    <div className="slide demo-app-slide">
      <h2>Live Demo — Ytelse</h2>
      <p className="demo-intro">
        Spans er byggesteinene i Sentry Performance. Hver operasjon du måler blir en span,
        og spans kan nestes i et tre. Prøv knappene under og se resultatet i Sentry.
      </p>

      <div className="demo-app-layout">
        <div className="demo-app-panel">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="perf-card" onClick={simpleSpan}>
              <span className="perf-icon">⏱️</span>
              <div>
                <strong>Manuell span</strong>
                <span className="perf-desc">Enkel span uten ekstra data</span>
              </div>
            </div>

            <div className="perf-card" onClick={heavyCompute}>
              <span className="perf-icon">🐢</span>
              <div>
                <strong>Tung beregning</strong>
                <span className="perf-desc">200 ms CPU-løkke målt som span med attributter</span>
              </div>
            </div>

            <div className="perf-card" onClick={nestedSpans}>
              <span className="perf-icon">📦</span>
              <div>
                <strong>Nestete spans (tre)</strong>
                <span className="perf-desc">Forelder med to barn: DB-spørring + API-kall — viser trestruktur i Sentry</span>
              </div>
            </div>

            <div className="perf-card" onClick={withMeasurement}>
              <span className="perf-icon">📊</span>
              <div>
                <strong>Egendefinerte målinger</strong>
                <span className="perf-desc">Sorterer 10 000 elementer og sender `items-sorted` og `sort-duration` som custom metrics</span>
              </div>
            </div>
          </div>
        </div>

        <div className="demo-app-iframe">
          <div className="iframe-header">
            <span>Aktivitetslogg</span>
            <a
              href="https://prokom.sentry.io/performance/?project=4511564169478224&statsPeriod=1h"
              target="_blank"
              rel="noopener noreferrer"
              className="btn iframe-btn"
            >
              🚀 Performance
            </a>
          </div>
          <ul className="log-list">
            {logs.length === 0 && (
              <li className="log-empty">Klikk på en test for å se hva som skjer...</li>
            )}
            {logs.map((log, i) => (
              <li key={i} className="log-item log-performance">
                <span className="log-msg">{log}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
