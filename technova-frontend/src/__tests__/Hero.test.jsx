/**
 * Tests for Hero component
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hero from '../components/Hero'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
}))

// Mock react-tsparticles
vi.mock('react-tsparticles', () => ({
  default: ({ children, ...props }) => <div data-testid="particles" {...props}>{children}</div>
}))

vi.mock('tsparticles', () => ({
  loadFull: vi.fn()
}))

// Mock hooks
vi.mock('../hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false
}))

describe('Hero', () => {
  it('renders the main headline', () => {
    render(<Hero />)
    
    expect(screen.getByText('TRANSFORM YOUR IDEAS')).toBeInTheDocument()
    expect(screen.getByText('INTO DIGITAL REALITY')).toBeInTheDocument()
  })

  it('renders the subheading', () => {
    render(<Hero />)
    
    expect(screen.getByText(/Architecting the future of digital experiences/i)).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(<Hero />)
    
    const consultationButton = screen.getByRole('button', { name: /get free consultation/i })
    const servicesButton = screen.getByRole('button', { name: /explore our services/i })
    
    expect(consultationButton).toBeInTheDocument()
    expect(servicesButton).toBeInTheDocument()
  })

  it('renders trust indicators', () => {
    render(<Hero />)
    
    expect(screen.getByText(/Trusted by 250\+ companies worldwide/i)).toBeInTheDocument()
  })

  it('renders scroll indicator', () => {
    render(<Hero />)
    
    const scrollButton = screen.getByRole('button', { name: /scroll to see more content/i })
    expect(scrollButton).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    render(<Hero />)
    
    const heroSection = screen.getByRole('region', { name: /hero/i }) || 
                       document.getElementById('hero')
    expect(heroSection).toBeInTheDocument()
  })
})