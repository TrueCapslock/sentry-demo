import * as Sentry from '@sentry/react'
import { useState, useEffect, useRef } from 'react'

let todoCount = 0

interface LogEntry {
  id: number
  time: string
  message: string
  type: 'error' | 'info' | 'warning' | 'performance'
}

let logId = 0
const listeners: Array<(entry: LogEntry) => void> = []

export function pushLog(message: string, type: LogEntry['type'] = 'info') {
  const entry: LogEntry = {
    id: ++logId,
    time: new Date().toLocaleTimeString(),
    message,
    type,
  }
  listeners.forEach((fn) => fn(entry))
}

function TodoContent() {
  const [todos, setTodos] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [showIssues, setShowIssues] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)
  const [crash, setCrash] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [fbName, setFbName] = useState('')
  const [fbEmail, setFbEmail] = useState('')
  const [fbMsg, setFbMsg] = useState('')
  const [fbSent, setFbSent] = useState(false)

  useEffect(() => {
    Sentry.setUser({ id: 'demo-123', username: 'demo-user', email: 'demo@prokom.no' })
    Sentry.setTag('demo-source', 'todo-app')
    Sentry.setTag('ui-version', '1.0')
    Sentry.setContext('demo-session', {
      started: new Date().toISOString(),
      feature: 'todo-app-demo',
    })
  }, [])

  useEffect(() => {
    const fn = (entry: LogEntry) => setLogs((prev) => [...prev.slice(-50), entry])
    listeners.push(fn)
    return () => {
      const idx = listeners.indexOf(fn)
      if (idx >= 0) listeners.splice(idx, 1)
    }
  }, [])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [logs])

  if (crash) {
    throw new Error('🚨 Render-krasj fanget av ErrorBoundary!')
  }

  function addTodo() {
    setError(null)

    Sentry.addBreadcrumb({
      category: 'todo.action',
      message: `Prøver å legge til: "${input}"`,
      level: 'info',
    })

    if (!input.trim()) {
      const err = new Error('⚠️ Prøvde å legge til tom todo!')
      Sentry.captureException(err, {
        tags: { action: 'add-todo', reason: 'empty-input' },
        level: 'warning',
      })
      pushLog('Kan ikke legge til tom todo (warning)', 'error')
      setError('Kan ikke legge til tom todo')
      return
    }

    const span = Sentry.startInactiveSpan({
      name: 'add-todo',
      op: 'ui.action',
    })
    span.setAttribute('todoContent', input)

    todoCount++
    if (input.toLowerCase().includes('feil') && todoCount % 3 === 0) {
      const err = new Error('🔥 Tilfeldig krasj ved "feil"-todo')
      Sentry.captureException(err, {
        tags: { action: 'add-todo', reason: 'feil-trigger' },
        level: 'fatal',
      })
      span.setStatus({ code: 2, message: 'unknown_error' })
      span.end()
      pushLog('Tilfeldig krasj utløst! (fatal)', 'error')
      setError('💥 Oops! En feil oppstod (sjekk Sentry)')
      return
    }
    setTodos([...todos, input])
    pushLog(`La til: "${input}"`, 'performance')
    setInput('')
    span.setStatus({ code: 1 })
    span.end()
  }

  function removeTodo(index: number) {
    setError(null)

    Sentry.addBreadcrumb({
      category: 'todo.action',
      message: `Prøver å slette element ${index + 1}`,
      level: 'info',
    })

    if (index === 2 && todos.length > 2) {
      const err = new Error('🗑️ Klarte ikke slette element 2')
      Sentry.captureException(err, {
        tags: { action: 'remove-todo', reason: 'index-blocked' },
        level: 'error',
      })
      pushLog('Kunne ikke slette element 2 (error)', 'error')
      setError('💥 Kunne ikke slette dette elementet')
      return
    }
    setTodos(todos.filter((_, i) => i !== index))
    pushLog(`Slettet element ${index + 1}`, 'info')
  }

  function crashRender() {
    Sentry.addBreadcrumb({
      category: 'todo.action',
      message: 'Utløser bevisst render-krasj',
      level: 'warning',
    })
    setCrash(true)
  }

  function triggerAsyncError() {
    Sentry.addBreadcrumb({
      category: 'todo.action',
      message: 'Utløser async-feil',
      level: 'warning',
    })
    pushLog('⚡ Async-feil utløst! (uhåndtert)', 'warning')
    new Promise(() => {
      throw new Error('⚡ Async feil fra demo-appen')
    })
  }

  function showFeedback() {
    setFeedbackOpen(true)
    setFbSent(false)
    setFbName('')
    setFbEmail('')
    setFbMsg('')
  }

  function submitFeedback() {
    if (!fbMsg.trim()) return
    Sentry.captureFeedback({
      message: fbMsg,
      name: fbName || undefined,
      email: fbEmail || undefined,
      tags: { source: 'feedback-modal' },
    })
    setFbSent(true)
    pushLog('Tilbakemelding sendt til Sentry!', 'info')
    setTimeout(() => setFeedbackOpen(false), 1500)
  }

  return (
    <div className="slide demo-app-slide">
      <h2>Live Demo — App med feil</h2>
      <p className="demo-intro">Todo-app med bevisste bugs — følg med i live-loggen</p>

      <div className="demo-app-layout">
        <div className="demo-app-panel">
          <div className="todo-input-row">
            <input
              className="todo-input"
              placeholder="Skriv en todo..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            />
            <button className="btn" onClick={addTodo}>Legg til</button>
          </div>

          {error && <p className="todo-error">{error}</p>}

          <ul className="todo-list">
            {todos.length === 0 && (
              <li className="todo-empty">Ingen todos — legg til noen!</li>
            )}
            {todos.map((todo, i) => (
              <li key={i} className="todo-item">
                <span>{todo}</span>
                <button className="todo-del" onClick={() => removeTodo(i)}>✕</button>
              </li>
            ))}
          </ul>

          <div className="demo-actions">
            <button className="btn danger" onClick={crashRender}>💥 Krasj</button>
            <button className="btn danger" onClick={triggerAsyncError}>⚡ Async</button>
            <button className="btn" onClick={showFeedback}>💬 Feedback</button>
          </div>
        </div>

        <div className="demo-app-iframe">
          <div className="iframe-header">
            <span>Live Event Log</span>
            <button className="btn iframe-btn" onClick={() => setShowIssues(!showIssues)}>
              {showIssues ? 'Skjul' : '📊 Sentry'}
            </button>
          </div>
          {showIssues ? (
            <div className="sentry-placeholder">
              <p>Åpne Sentry for å se Issues:</p>
              <a
                href="https://prokom.sentry.io/issues/?environment=development&project=4511564169478224&statsPeriod=1h"
                target="_blank"
                rel="noopener noreferrer"
                className="btn sentry-link"
              >
                🚀 Gå til Sentry Dashboard
              </a>
            </div>
          ) : (
            <ul className="log-list" ref={listRef}>
              {logs.length === 0 && (
                <li className="log-empty">Aktiver demo-appen for å se hendelser...</li>
              )}
              {logs.map((log) => (
                <li key={log.id} className={`log-item log-${log.type}`}>
                  <span className="log-time">{log.time}</span>
                  <span className="log-msg">{log.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {feedbackOpen && (
        <div className="feedback-overlay" onClick={() => setFeedbackOpen(false)}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            {fbSent ? (
              <>
                <h3>✅ Takk for tilbakemeldingen!</h3>
                <p className="feedback-hint">Den er sendt til Sentry.</p>
              </>
            ) : (
              <>
                <h3>💬 Send tilbakemelding</h3>
                <input className="todo-input" placeholder="Navn (valgfritt)" value={fbName} onChange={(e) => setFbName(e.target.value)} />
                <input className="todo-input" placeholder="E-post (valgfritt)" value={fbEmail} onChange={(e) => setFbEmail(e.target.value)} />
                <textarea className="todo-input feedback-textarea" placeholder="Beskriv hva du opplevde..." value={fbMsg} onChange={(e) => setFbMsg(e.target.value)} rows={3} />
                <div className="demo-actions">
                  <button className="btn" onClick={() => setFeedbackOpen(false)}>Avbryt</button>
                  <button className="btn" onClick={submitFeedback} disabled={!fbMsg.trim()}>Send</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ErrorFallback(errorData: {
  error: unknown
  componentStack: string
  eventId: string
  resetError(): void
}) {
  return (
    <div className="slide demo-app-slide">
      <h2>💥 Appen krasjet</h2>
      <div className="error-boundary-fallback">
        <p>En uventet feil oppstod under rendering:</p>
        <pre className="error-details">{String(errorData.error)}</pre>
        <p className="error-hint">Feilen er logget i Sentry med event ID: <code>{errorData.eventId}</code></p>
        <button className="btn" onClick={errorData.resetError}>🔄 Prøv igjen</button>
      </div>
    </div>
  )
}

export default function DemoAppSlide() {
  return (
    <Sentry.ErrorBoundary fallback={ErrorFallback}>
      <TodoContent />
    </Sentry.ErrorBoundary>
  )
}
