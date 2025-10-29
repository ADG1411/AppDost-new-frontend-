/**
 * Tests for Header component
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../components/Header'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    header: ({ children, ...props }) => <header {...props}>{children}</header>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}))

// Mock hooks
vi.mock('../hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false
}))

describe('Header', () => {
  it('renders the header with navigation', () => {
    render(<Header />)
    
    // Check if main navigation items are present
    expect(screen.getByText('TechNova Digital')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('shows mobile menu button on mobile', () => {
    render(<Header />)
    
    const mobileMenuButton = screen.getByLabelText(/open menu/i)
    expect(mobileMenuButton).toBeInTheDocument()
  })

  it('toggles mobile menu when clicked', () => {
    render(<Header />)
    
    const mobileMenuButton = screen.getByLabelText(/open menu/i)
    fireEvent.click(mobileMenuButton)
    
    // After clicking, it should show "Close menu"
    expect(screen.getByLabelText(/close menu/i)).toBeInTheDocument()
  })

  it('includes skip to content link for accessibility', () => {
    render(<Header />)
    
    const skipLink = screen.getByText('Skip to main content')
    expect(skipLink).toBeInTheDocument()
    expect(skipLink).toHaveClass('skip-to-content')
  })

  it('has proper ARIA attributes', () => {
    render(<Header />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    
    const mobileMenuButton = screen.getByLabelText(/open menu/i)
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false')
  })
})