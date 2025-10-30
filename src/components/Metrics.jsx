/**
 * Metrics component with animated counters and key statistics
 * Triggers animations when component enters viewport
 */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { metrics } from '../data/content'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { animateValue, formatNumber } from '../utils/helpers'

const MetricCard = ({ metric, index, shouldAnimate }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  
  const Icon = metric.icon

  // Animate the counter when shouldAnimate becomes true
  useEffect(() => {
    if (shouldAnimate && !hasAnimated) {
      setHasAnimated(true)
      if (prefersReducedMotion) {
        setDisplayValue(metric.value)
      } else {
        animateValue(0, metric.value, 2000, setDisplayValue)
      }
    }
  }, [shouldAnimate, hasAnimated, metric.value, prefersReducedMotion])

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        delay: prefersReducedMotion ? 0 : index * 0.1,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? false : "hidden"}
      animate={shouldAnimate ? "visible" : "hidden"}
      variants={prefersReducedMotion ? {} : cardVariants}
      whileHover={prefersReducedMotion ? {} : { 
        y: -10,
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className="card group cursor-default bg-black/30 backdrop-blur-sm border border-white/10 hover:border-cyan-400/50"
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-accent flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
          <Icon className="text-2xl text-white" aria-hidden="true" />
        </div>
      </div>

      {/* Value */}
      <div className="text-center mb-2">
        <span 
          className="text-4xl lg:text-5xl font-bold text-gradient font-display"
          aria-label={`${metric.value}${metric.suffix} ${metric.label}`}
        >
          {formatNumber(displayValue)}
          <span className="text-accent">{metric.suffix}</span>
        </span>
      </div>

      {/* Label */}
      <h3 className="text-center text-gray-300 font-medium text-lg">
        {metric.label}
      </h3>

      {/* Decorative elements */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-600/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </motion.div>
  )
}

const Metrics = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.2
  })
  const prefersReducedMotion = usePrefersReducedMotion()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  }

  return (
    <section 
      id="metrics" 
      ref={elementRef}
      className="py-20 lg:py-32 relative overflow-hidden"
    >
      {/* Enhanced background for better visibility */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-4">
            Proven Impact
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our track record speaks for itself. Here's how we've helped organizations 
            transform their digital presence and achieve measurable results.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          animate={hasIntersected ? "visible" : "hidden"}
          variants={prefersReducedMotion ? {} : containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              index={index}
              shouldAnimate={hasIntersected}
            />
          ))}
        </motion.div>

        {/* Additional Context */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            duration: prefersReducedMotion ? 0 : 0.6, 
            delay: prefersReducedMotion ? 0 : 0.5 
          }}
          className="text-center mt-16"
        >
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-300 text-lg leading-relaxed">
              Every project is an opportunity to push boundaries and deliver exceptional results. 
              Our multidisciplinary team combines technical expertise with creative vision to 
              build solutions that don't just meet requirements—they exceed expectations.
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                ISO 27001 Certified
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                WCAG AA Compliant
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                SOC 2 Type II
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                GDPR Ready
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Metrics