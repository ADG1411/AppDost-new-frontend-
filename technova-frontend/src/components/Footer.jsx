/**
 * Footer component with company info, navigation, social links, and newsletter signup
 * Features accessibility support and responsive design
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaPaperPlane, FaHeart } from 'react-icons/fa'
import { company, socialLinks } from '../data/content'
import { validateEmail, scrollToElement } from '../utils/helpers'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState('idle') // idle, loading, success, error
  const prefersReducedMotion = usePrefersReducedMotion()

  const currentYear = new Date().getFullYear()

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateEmail(email)) {
      setNewsletterStatus('error')
      setTimeout(() => setNewsletterStatus('idle'), 3000)
      return
    }

    setNewsletterStatus('loading')
    
    // Simulate newsletter signup (replace with actual API call)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setNewsletterStatus('success')
      setEmail('')
      setTimeout(() => setNewsletterStatus('idle'), 5000)
    } catch (_error) {
      setNewsletterStatus('error')
      setTimeout(() => setNewsletterStatus('idle'), 3000)
    }
  }

  const footerSections = [
    {
      title: 'Services',
      links: [
        { name: 'AI & Machine Learning', href: '/services#ai-ml' },
        { name: 'Cloud & DevOps', href: '/services#cloud' },
        { name: 'Web & Mobile Apps', href: '/services#web-mobile' },
        { name: 'UI/UX Design', href: '/services#design' },
        { name: 'Cybersecurity', href: '/services#security' },
        { name: 'MLOps', href: '/services#mlops' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Team', href: '/about#team' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/contact' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Case Studies', href: '/projects' },
        { name: 'White Papers', href: '/resources' },
        { name: 'Documentation', href: '/docs' },
        { name: 'Support', href: '/support' },
        { name: 'API', href: '/api' }
      ]
    }
  ]

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Security', href: '/security' }
  ]

  return (
    <footer className="bg-primary-900 border-t border-white/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/95 to-primary-900/90"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-primary-600/10 blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Newsletter Section */}
        <div className="py-16 border-b border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
                Stay Updated
              </h2>
              <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
                Get the latest insights on digital transformation, technology trends, 
                and exclusive resources delivered to your inbox.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      required
                      disabled={newsletterStatus === 'loading'}
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                    disabled={newsletterStatus === 'loading'}
                    className="px-6 py-3 bg-accent hover:bg-accent/90 text-primary-900 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary-900 disabled:opacity-50"
                    aria-label="Subscribe to newsletter"
                  >
                    {newsletterStatus === 'loading' ? (
                      <div className="w-5 h-5 border-2 border-primary-900/20 border-t-primary-900 rounded-full animate-spin"></div>
                    ) : (
                      <FaPaperPlane className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
                
                {/* Status messages */}
                {newsletterStatus === 'success' && (
                  <motion.p 
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    className="text-accent text-sm mt-2"
                  >
                    Thanks for subscribing! Check your email for confirmation.
                  </motion.p>
                )}
                {newsletterStatus === 'error' && (
                  <motion.p 
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-2"
                  >
                    Please enter a valid email address.
                  </motion.p>
                )}
              </form>
            </motion.div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Company Info */}
            <div className="lg:col-span-4">
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, x: -30 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {/* Logo */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">TN</span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-white">
                      {company.name}
                    </h3>
                    <p className="text-muted text-sm">
                      {company.tagline}
                    </p>
                  </div>
                </div>
                
                <p className="text-muted leading-relaxed mb-6">
                  {company.description}
                </p>
                
                {/* Contact Info */}
                <div className="space-y-2 text-sm text-muted mb-6">
                  <p>{company.address}</p>
                  <p>
                    <a 
                      href={`mailto:${company.email}`} 
                      className="hover:text-accent transition-colors"
                    >
                      {company.email}
                    </a>
                  </p>
                  <p>
                    <a 
                      href={`tel:${company.phone}`} 
                      className="hover:text-accent transition-colors"
                    >
                      {company.phone}
                    </a>
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        whileHover={prefersReducedMotion ? {} : { scale: 1.2, y: -2 }}
                        className="w-10 h-10 bg-white/10 hover:bg-accent hover:text-primary-900 text-muted rounded-lg flex items-center justify-center transition-all duration-300 focus-visible"
                        aria-label={`Follow us on ${social.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    )
                  })}
                </div>
              </motion.div>
            </div>

            {/* Footer Links */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {footerSections.map((section, _sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: prefersReducedMotion ? 0 : _sectionIndex * 0.1 
                  }}
                  viewport={{ once: true }}
                >
                  <h4 className="font-semibold text-white mb-4 text-lg">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <button
                          onClick={() => scrollToElement(link.href.substring(1), 100)}
                          className="text-muted hover:text-accent transition-colors text-sm focus-visible p-1 -m-1 rounded"
                        >
                          {link.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            <div className="text-center md:text-left">
              <p className="text-muted text-sm flex items-center justify-center md:justify-start">
                © {currentYear} {company.name}. Made with 
                <FaHeart className="text-red-400 mx-1" /> 
                by our amazing team.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {legalLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToElement(link.href.substring(1), 100)}
                  className="text-muted hover:text-accent transition-colors text-sm focus-visible p-1 -m-1 rounded"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer