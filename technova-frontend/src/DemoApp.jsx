/**
 * Demo App for testing the 3D Network Background
 * Toggle between original site and background demo
 */
import { useState } from 'react'
import { useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Metrics from './components/Metrics'
import ServicesGrid from './components/ServicesGrid'
import Footer from './components/Footer'
import NetworkBackgroundDemo from './NetworkBackgroundDemo'
import './index.css'

function App() {
  const [showDemo, setShowDemo] = useState(false)

  // Toggle demo with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'D' || e.key === 'd') {
        setShowDemo(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Add structured data for SEO (only for main site)
  useEffect(() => {
    if (showDemo) return

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "TechNova Digital",
      "alternateName": "TechNova",
      "url": "https://technova.digital",
      "logo": "https://technova.digital/logo.png",
      "description": "Architecting the future of digital experiences with product-led engineering and data-driven design.",
      "foundingDate": "2020",
      "founder": {
        "@type": "Person",
        "name": "Sarah Johnson"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Innovation Drive",
        "addressLocality": "Tech Valley",
        "addressRegion": "CA",
        "postalCode": "94000",
        "addressCountry": "US"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-555-123-4567",
        "contactType": "customer service"
      },
      "sameAs": [
        "https://linkedin.com/company/technova-digital",
        "https://twitter.com/technova_digital",
        "https://github.com/technova-digital"
      ],
      "service": [
        {
          "@type": "Service",
          "name": "AI & Machine Learning",
          "description": "Custom ML model development and deployment"
        },
        {
          "@type": "Service", 
          "name": "Cloud & DevOps",
          "description": "Scalable, secure cloud infrastructure solutions"
        },
        {
          "@type": "Service",
          "name": "Web & Mobile Development",
          "description": "Modern, responsive applications"
        }
      ]
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      const existingScript = document.querySelector('script[type="application/ld+json"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [showDemo])

  // Show 3D Network Background Demo
  if (showDemo) {
    return (
      <>
        <NetworkBackgroundDemo />
        {/* Demo toggle button */}
        <button
          onClick={() => setShowDemo(false)}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-accent text-primary-900 rounded-lg font-semibold shadow-glow hover:bg-accent/90 transition-all duration-300"
        >
          Back to Site
        </button>
        <div className="fixed bottom-4 left-4 z-50 text-white/30 text-xs">
          Press 'D' to toggle demo
        </div>
      </>
    )
  }

  // Show original TechNova site
  return (
    <div className="min-h-screen bg-primary-900 text-white">
      {/* Demo toggle button */}
      <button
        onClick={() => setShowDemo(true)}
        className="fixed top-20 right-4 z-50 px-3 py-2 bg-accent/20 text-accent rounded-lg text-sm font-medium hover:bg-accent/30 transition-all duration-300 border border-accent/30"
      >
        3D Demo
      </button>

      {/* Header with navigation */}
      <Header />
      
      {/* Main content */}
      <main id="main-content" role="main">
        {/* Hero section */}
        <Hero />
        
        {/* Key metrics section */}
        <Metrics />
        
        {/* Services section */}
        <ServicesGrid />
        
        {/* Projects section placeholder */}
        <section id="projects" className="py-20 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-6">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto mb-12">
              Explore some of our most impactful work and see how we've helped 
              organizations transform their digital presence.
            </p>
            <div className="glass rounded-3xl p-12">
              <p className="text-muted text-lg">
                Project showcase coming soon! In the meantime, 
                <a href="#contact" className="text-accent hover:underline ml-1">
                  contact us
                </a> to discuss your project.
              </p>
            </div>
          </div>
        </section>

        {/* Industries section placeholder */}
        <section id="industries" className="py-20 lg:py-32 bg-primary-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-6">
              Industries We <span className="text-gradient">Serve</span>
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto mb-12">
              We bring domain expertise across multiple industries, delivering 
              solutions that understand your unique challenges and requirements.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Healthcare', 'Finance', 'Education', 'Retail', 'Energy', 'Manufacturing'].map((industry) => (
                <div key={industry} className="card text-center">
                  <h3 className="text-xl font-bold text-white mb-2">{industry}</h3>
                  <p className="text-muted">Specialized solutions for {industry.toLowerCase()} sector</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About section placeholder */}
        <section id="about" className="py-20 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-6">
              About <span className="text-gradient">TechNova</span>
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto mb-12">
              Founded in 2020, TechNova Digital has been at the forefront of digital innovation, 
              helping organizations transform their technology landscape and achieve breakthrough results.
            </p>
            <div className="glass rounded-3xl p-12 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
                  <p className="text-muted">
                    To democratize access to cutting-edge technology and empower organizations 
                    to achieve their digital transformation goals through innovative solutions.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Our Vision</h3>
                  <p className="text-muted">
                    To be the world's most trusted partner for digital transformation, 
                    setting new standards for technical excellence and client success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact section placeholder */}
        <section id="contact" className="py-20 lg:py-32 bg-primary-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-6">
                Let's Build Something <span className="text-gradient">Amazing</span>
              </h2>
              <p className="text-xl text-muted max-w-3xl mx-auto">
                Ready to transform your digital presence? Get in touch with our team 
                to discuss your project and receive a detailed proposal.
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="glass rounded-3xl p-8 lg:p-12">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-white font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-white font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-white font-medium mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="Your Company"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="service" className="block text-white font-medium mb-2">
                      Service Interest
                    </label>
                    <select
                      id="service"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    >
                      <option value="">Select a service</option>
                      <option value="ai-ml">AI & Machine Learning</option>
                      <option value="cloud">Cloud & DevOps</option>
                      <option value="web-mobile">Web & Mobile Apps</option>
                      <option value="design">UI/UX Design</option>
                      <option value="security">Cybersecurity</option>
                      <option value="mlops">MLOps</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-white font-medium mb-2">
                      Project Details
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                      placeholder="Tell us about your project..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full btn-primary justify-center"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />

      {/* Demo instruction */}
      <div className="fixed bottom-4 left-4 z-40 text-white/20 text-xs">
        Press 'D' to view 3D network demo
      </div>
    </div>
  )
}

export default App