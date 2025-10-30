/**
 * Utility functions for the application
 */

/**
 * Combines class names conditionally
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

/**
 * Animates number from 0 to target value
 */
export const animateValue = (start, end, duration, callback) => {
  let startTime = null
  
  const animate = (currentTime) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    const value = Math.floor(easeOut * (end - start) + start)
    
    callback(value)
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

/**
 * Debounce function to limit rate of function calls
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Enhanced smooth scroll to element with easing
 */
export const scrollToElement = (elementId, offset = 0, duration = 1000) => {
  const element = document.getElementById(elementId)
  if (!element) return

  const startPosition = window.pageYOffset
  const targetPosition = element.offsetTop - offset
  const distance = targetPosition - startPosition
  let startTime = null

  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  }

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)

    const easedProgress = easeInOutCubic(progress)
    const currentPosition = startPosition + (distance * easedProgress)

    window.scrollTo(0, currentPosition)

    if (progress < 1) {
      requestAnimationFrame(animation)
    }
  }

  requestAnimationFrame(animation)
}

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * Generate unique ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}