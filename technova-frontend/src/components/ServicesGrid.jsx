/**
 * ServicesGrid component displaying all services with animations
 * Features responsive grid layout and intersection observer animations
 */
import { motion } from 'framer-motion'
import { services } from '../data/content'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import ServiceCard from './ServiceCard'
import { scrollToElement } from '../utils/helpers'

const ServicesGrid = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1
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
      id="services" 
      ref={elementRef}
      className="py-20 lg:py-32 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900 via-primary-900/98 to-primary-900"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-6">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed mb-8">
            From AI-powered solutions to cutting-edge web applications, we deliver 
            comprehensive digital services that transform businesses and drive growth.
          </p>
          
          {/* Service categories preview */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {services.map((service, index) => (
              <motion.span
                key={service.id}
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
                animate={hasIntersected ? { opacity: 1, scale: 1 } : {}}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : 0.4, 
                  delay: prefersReducedMotion ? 0 : 0.3 + index * 0.1 
                }}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-muted hover:text-accent hover:border-accent/30 transition-all duration-300 cursor-pointer"
                onClick={() => scrollToElement('services', 100)}
              >
                {service.title}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          animate={hasIntersected ? "visible" : "hidden"}
          variants={prefersReducedMotion ? {} : containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              isVisible={hasIntersected}
            />
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
          animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            duration: prefersReducedMotion ? 0 : 0.6, 
            delay: prefersReducedMotion ? 0 : 0.8 
          }}
          className="text-center mt-16"
        >
          <div className="glass rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
              Let's discuss how our expertise can help you achieve your digital transformation goals. 
              Get a free consultation and detailed project roadmap.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                onClick={() => scrollToElement('contact', 100)}
                className="btn-primary"
              >
                Get Free Consultation
              </motion.button>
              
              <motion.button
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                onClick={() => scrollToElement('projects', 100)}
                className="btn-secondary"
              >
                View Case Studies
              </motion.button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-muted text-sm mb-4">Trusted by industry leaders</p>
              <div className="flex justify-center items-center gap-8 text-xs text-muted/60">
                <span>Fast Delivery</span>
                <span>•</span>
                <span>24/7 Support</span>
                <span>•</span>
                <span>Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesGrid