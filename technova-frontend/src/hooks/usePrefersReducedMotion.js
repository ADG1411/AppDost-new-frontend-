/**
 * Custom hook to detect user's motion preferences
 * Respects prefers-reduced-motion media query
 */
import { useState, useEffect } from 'react'

export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQueryList.matches)

    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQueryList.addEventListener('change', handleChange)
    return () => mediaQueryList.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}