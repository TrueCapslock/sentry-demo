import { useState, useEffect, useCallback, type ReactNode } from 'react'

interface SlideDeckProps {
  slides: ReactNode[]
  slideLabels: string[]
}

export default function SlideDeck({ slides, slideLabels }: SlideDeckProps) {
  const [current, setCurrent] = useState(0)
  const [overview, setOverview] = useState(false)

  const next = useCallback(() => {
    setCurrent((i) => Math.min(i + 1, slides.length - 1))
  }, [slides.length])

  const prev = useCallback(() => {
    setCurrent((i) => Math.max(i - 1, 0))
  }, [])

  const goTo = useCallback((index: number) => {
    setCurrent(index)
    setOverview(false)
  }, [])

  useEffect(() => {
    const isInputTarget = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      const editable = (e.target as HTMLElement).isContentEditable
      return tag === 'INPUT' || tag === 'TEXTAREA' || editable
    }

    function onKey(e: KeyboardEvent) {
      if (isInputTarget(e)) return

      if (overview) {
        if (e.key === 'Escape') { setOverview(false); return }
        const num = parseInt(e.key)
        if (num >= 1 && num <= 9 && num <= slides.length) {
          goTo(num - 1)
        }
        return
      }
      if (e.key === 'Escape' || e.key === 'o') {
        setOverview((v) => !v)
        return
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        prev()
      }
    }
    function onNavigate(e: CustomEvent<{ delta: number }>) {
      if (e.detail.delta > 0) next()
      else prev()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('slide:navigate', onNavigate as EventListener)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('slide:navigate', onNavigate as EventListener)
    }
  }, [next, prev, overview, goTo, slides.length])

  return (
    <div className="slide-deck">
      <div className="slide-content">
        {slides[current]}
      </div>

      <div className="slide-footer">
        <button onClick={prev} disabled={current === 0}>◀</button>
        <button onClick={() => setOverview((v) => !v)} className="btn-overview">
          ⋮⋮
        </button>
        <span className="slide-counter">{current + 1} / {slides.length}</span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((current + 1) / slides.length) * 100}%` }}
          />
        </div>
        <button onClick={next} disabled={current === slides.length - 1}>▶</button>
      </div>

      {overview && (
        <div className="overlay" onClick={() => setOverview(false)}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="overlay-title">Slide-oversikt</h2>
            <div className="overlay-grid">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`overlay-item ${i === current ? 'active' : ''}`}
                  onClick={() => goTo(i)}
                >
                  <span className="overlay-num">{i + 1}</span>
                  <span className="overlay-label">{slideLabels[i]}</span>
                </button>
              ))}
            </div>
            <p className="overlay-hint">Trykk talltast eller klikk for å hoppe — Esc for å lukke</p>
          </div>
        </div>
      )}
    </div>
  )
}
