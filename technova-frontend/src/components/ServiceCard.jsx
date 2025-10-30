/**
 * ServiceCard component for individual service display
 * Features hover effects, tech stack display, and accessibility support
 */
import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const ServiceCard = ({ service, index, isVisible }) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const Icon = service.icon

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      rotateY: -10
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        delay: prefersReducedMotion ? 0 : index * 0.1,
        ease: "easeOut"
      }
    }
  }

  const hoverVariants = {
    hover: {
      y: prefersReducedMotion ? 0 : -8,
      scale: prefersReducedMotion ? 1 : 1.03,
      rotateY: prefersReducedMotion ? 0 : 1,
      boxShadow: prefersReducedMotion ? "none" : "0 25px 50px rgba(0, 229, 255, 0.15)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.8
      }
    }
  }

  return (
    <motion.article
      initial={prefersReducedMotion ? false : "hidden"}
      animate={isVisible ? "visible" : "hidden"}
      whileHover={prefersReducedMotion ? {} : "hover"}
      variants={prefersReducedMotion ? {} : { ...cardVariants, ...hoverVariants }}
      className="card group relative overflow-hidden h-full flex flex-col cursor-pointer bg-black/30 backdrop-blur-sm border border-white/10 hover:border-cyan-400/50 ultra-smooth gpu-accelerated smooth-hover"
      role="article"
      tabIndex={0}
    >
      {/* Background gradient effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      {/* Icon and header */}
      <div className="relative z-10 flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:shadow-glow transition-all duration-300`}>
            <Icon className="text-2xl text-white" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white group-hover:text-gradient transition-colors duration-300">
              {service.title}
            </h3>
          </div>
        </div>
        
        <motion.div
          animate={prefersReducedMotion ? {} : { 
            x: [0, 5, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <FaArrowRight className="text-lg" />
        </motion.div>
      </div>

      {/* Description */}
      <p className="text-gray-300 mb-6 leading-relaxed flex-grow">
        {service.description}
      </p>

      {/* Key benefits */}
      <div className="mb-6">
        <h4 className="text-white font-semibold mb-3 text-sm">Key Benefits:</h4>
        <ul className="space-y-2" role="list">
          {service.bullets.map((bullet, bulletIndex) => (
            <li key={bulletIndex} className="flex items-start text-sm text-gray-300">
              <span className="text-cyan-400 mr-2 mt-1">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tech stack */}
      <div className="mt-auto">
        <h4 className="text-white font-semibold mb-3 text-sm">Technologies:</h4>
        <div className="flex flex-wrap gap-2">
          {service.techStack.map((tech, techIndex) => (
            <span
              key={techIndex}
              className="px-3 py-1 bg-white/10 text-accent text-xs font-medium rounded-full border border-accent/20 group-hover:bg-accent/10 group-hover:border-accent/40 transition-all duration-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/30 rounded-2xl transition-all duration-300"></div>
    </motion.article>
  )
}

export default ServiceCard