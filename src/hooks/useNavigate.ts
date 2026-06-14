import { useCallback } from 'react'

declare global {
  interface WindowEventMap {
    'slide:navigate': CustomEvent<{ delta: number }>
  }
}

export function useNavigate(): () => void {
  return useCallback(() => {
    window.dispatchEvent(new CustomEvent('slide:navigate', { detail: { delta: 1 } }))
  }, [])
}
