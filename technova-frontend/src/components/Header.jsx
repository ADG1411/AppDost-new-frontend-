/**
 * Header component with sticky navigation, glass morphism effect, and mobile menu
 * Includes accessibility features and keyboard navigation
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes } from 'react-icons/fa'
import { navigation, company } from '../data/content'
import { cn, scrollToElement } from '../utils/helpers'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const prefersReducedMotion = usePrefersReducedMotion()

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Handle navigation click
  const handleNavClick = (href, name) => {
    setIsMobileMenuOpen(false)
    setActiveSection(name.toLowerCase())
    
    if (href.startsWith('/')) {
      // For now, scroll to sections on the same page
      const sectionId = href === '/' ? 'hero' : href.substring(1)
      scrollToElement(sectionId, 100)
    }
  }

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.2,
        ease: 'easeInOut'
      }
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: 'easeOut'
      }
    }
  }

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="skip-to-content"
        onFocus={(e) => e.target.focus()}
      >
        Skip to main content
      </a>

      <motion.header
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={prefersReducedMotion ? {} : headerVariants}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ultra-smooth gpu-accelerated',
          isScrolled 
            ? 'glass shadow-lg border-b border-white/10' 
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              className="flex items-center space-x-3 focus-visible"
            >
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary-600 to-accent rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl lg:text-2xl">TN</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display font-bold text-xl lg:text-2xl text-white leading-tight">
                  {company.name}
                </h1>
                <p className="text-xs lg:text-sm text-muted -mt-0.5 leading-tight">
                  {company.tagline}
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-8 smooth-navigation" role="navigation">
              <div className="flex items-center space-x-6 xl:space-x-8">
                {navigation.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item.href, item.name)}
                    whileHover={prefersReducedMotion ? {} : { y: -2 }}
                    whileTap={prefersReducedMotion ? {} : { y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                      mass: 0.5
                    }}
                    className={cn(
                      'text-sm lg:text-base font-medium transition-colors duration-200 focus-visible px-4 py-2.5 rounded-lg relative smooth-button ultra-smooth',
                      activeSection === item.name.toLowerCase()
                        ? 'text-accent bg-accent/10'
                        : 'text-white hover:text-accent hover:bg-white/5'
                    )}
                    aria-current={activeSection === item.name.toLowerCase() ? 'page' : undefined}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>
            </nav>

            {/* CTA Button - Desktop */}
            <div className="hidden lg:block">
              <motion.button
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                onClick={() => handleNavClick('/contact', 'Contact')}
                className="btn-primary text-sm lg:text-base px-6 lg:px-8 py-2.5 lg:py-3 font-semibold shadow-lg"
              >
                Get Started
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-3 rounded-xl text-white hover:bg-white/10 focus-visible transition-colors duration-200 flex items-center justify-center"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <FaTimes className="w-5 h-5" />
              ) : (
                <FaBars className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.nav
                id="mobile-menu"
                initial={prefersReducedMotion ? false : "closed"}
                animate="open"
                exit="closed"
                variants={prefersReducedMotion ? {} : mobileMenuVariants}
                className="md:hidden overflow-hidden"
                role="navigation"
              >
                <div className="px-2 pt-2 pb-3 space-y-1 glass border-t border-white/10">
                  {navigation.map((item, index) => (
                    <motion.button
                      key={item.name}
                      onClick={() => handleNavClick(item.href, item.name)}
                      initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
                      animate={prefersReducedMotion ? {} : { 
                        opacity: 1, 
                        x: 0,
                        transition: { delay: index * 0.1 }
                      }}
                      className={cn(
                        'block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors focus-visible',
                        activeSection === item.name.toLowerCase()
                          ? 'text-accent bg-accent/10'
                          : 'text-white hover:text-accent hover:bg-white/5'
                      )}
                      aria-current={activeSection === item.name.toLowerCase() ? 'page' : undefined}
                    >
                      {item.name}
                    </motion.button>
                  ))}
                  
                  {/* Mobile CTA */}
                  <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
                    animate={prefersReducedMotion ? {} : { 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: navigation.length * 0.1 }
                    }}
                    className="pt-4"
                  >
                    <button
                      onClick={() => handleNavClick('/contact', 'Contact')}
                      className="btn-primary w-full text-center"
                    >
                      Get Started
                    </button>
                  </motion.div>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  )
}

export default Header