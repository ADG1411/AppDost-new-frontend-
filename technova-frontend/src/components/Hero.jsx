/**
 * Hero component with particle background, animated text, and CTA buttons
 * Features accessibility support and reduced motion preferences
 */
import { useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'
import { FaArrowDown, FaPlay } from 'react-icons/fa'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { scrollToElement } from '../utils/helpers'
import AppDostSphereBackground from './AppDostSphereBackground'

const Hero = () => {
  const prefersReducedMotion = usePrefersReducedMotion()

  // Initialize particles
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine)
  }, [])

  const particlesLoaded = useCallback(async (_container) => {
    // Particle system loaded
  }, [])

  // Particle configuration
  const particlesOptions = useMemo(() => ({
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: !prefersReducedMotion,
          mode: "push",
        },
        onHover: {
          enable: !prefersReducedMotion,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: ["#0ea5a4", "#7CFFB2"],
      },
      links: {
        color: "#0ea5a4",
        distance: 150,
        enable: !prefersReducedMotion,
        opacity: 0.2,
        width: 1,
      },
      collisions: {
        enable: false,
      },
      move: {
        direction: "none",
        enable: !prefersReducedMotion,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: prefersReducedMotion ? 0 : 80,
      },
      opacity: {
        value: 0.3,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  }), [prefersReducedMotion])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 1.2,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom cubic-bezier for smooth easing
      }
    }
  }

  const scrollToServices = () => {
    scrollToElement('services', 100)
  }

  const scrollToContact = () => {
    scrollToElement('contact', 100)
  }

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Enhanced 3D Network Background */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 z-0">
          <AppDostSphereBackground />
        </div>
      )}

      {/* Static background for reduced motion */}
      {prefersReducedMotion && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center flex items-center justify-center min-h-screen gpu-accelerated">
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
          variants={prefersReducedMotion ? {} : containerVariants}
          className="max-w-6xl mx-auto py-20 lg:py-32"
        >
          {/* Main Headline */}
          <motion.h1 
            variants={prefersReducedMotion ? {} : itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-display font-bold leading-[0.9] mb-8 lg:mb-10"
          >
            <span className="block text-white tracking-tight">
              TRANSFORM YOUR IDEAS
            </span>
            <span className="block text-gradient mt-2 lg:mt-4 tracking-tight">
              INTO DIGITAL REALITY
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={prefersReducedMotion ? {} : itemVariants}
            className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-muted max-w-4xl mx-auto mb-12 lg:mb-16 leading-relaxed font-light"
          >
            Architecting the future of digital experiences with product-led engineering and data-driven design.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={prefersReducedMotion ? {} : itemVariants}
            className="flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center items-center mb-16 lg:mb-20"
          >
            <motion.button
              onClick={scrollToContact}
              whileHover={prefersReducedMotion ? {} : { 
                scale: 1.05,
                boxShadow: "0 25px 60px rgba(0, 229, 255, 0.4)",
                y: -2
              }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25,
                mass: 0.8
              }}
              className="btn-primary group relative overflow-hidden px-8 lg:px-10 py-4 lg:py-5 text-base lg:text-lg font-semibold"
              aria-label="Get free consultation"
            >
              <span className="relative z-10 flex items-center">
                Get Free Consultation
                <motion.div
                  animate={prefersReducedMotion ? {} : { x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="ml-2"
                >
                  →
                </motion.div>
              </span>
            </motion.button>

            <motion.button
              onClick={scrollToServices}
              whileHover={prefersReducedMotion ? {} : { 
                scale: 1.05, 
                y: -2,
                boxShadow: "0 15px 40px rgba(0, 229, 255, 0.2)"
              }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25,
                mass: 0.8
              }}
              className="btn-secondary group flex items-center px-8 lg:px-10 py-4 lg:py-5 text-base lg:text-lg font-semibold"
              aria-label="Explore our services"
            >
              <FaPlay className="mr-3 text-sm group-hover:scale-110 transition-transform" />
              Explore Services
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            variants={prefersReducedMotion ? {} : itemVariants}
            className="text-muted text-sm lg:text-base"
          >
            <p className="mb-6 font-medium">Trusted by 250+ companies worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-12 opacity-70">
              <div className="text-xs font-semibold tracking-wider">FORTUNE 500</div>
              <div className="text-xs font-semibold tracking-wider">STARTUPS</div>
              <div className="text-xs font-semibold tracking-wider">ENTERPRISES</div>
              <div className="text-xs font-semibold tracking-wider">SCALE-UPS</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={prefersReducedMotion ? {} : { 
          opacity: 1, 
          y: 0,
          transition: { delay: 1.5 }
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.button
          onClick={() => scrollToElement('metrics', 100)}
          animate={prefersReducedMotion ? {} : { y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center text-muted hover:text-accent transition-colors focus-visible p-2 rounded"
          aria-label="Scroll to see more content"
        >
          <span className="text-xs mb-2 font-medium">Scroll to explore</span>
          <FaArrowDown className="text-lg" />
        </motion.button>
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-900/50 pointer-events-none"></div>
    </section>
  )
}

export default Hero