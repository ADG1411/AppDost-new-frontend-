/**
 * AppDost Logo Component
 * Recreates the AppDost logo with gradient colors and professional styling
 */
import React from 'react'

const AppDostLogo = ({ 
  size = 'md', 
  showTagline = true, 
  className = '',
  textColor = 'text-white' 
}) => {
  const sizes = {
    sm: {
      container: 'w-8 h-8',
      text: 'text-base',
      tagline: 'text-xs'
    },
    md: {
      container: 'w-12 h-12 lg:w-14 lg:h-14',
      text: 'text-xl lg:text-2xl',
      tagline: 'text-xs lg:text-sm'
    },
    lg: {
      container: 'w-16 h-16',
      text: 'text-2xl',
      tagline: 'text-sm'
    },
    xl: {
      container: 'w-20 h-20',
      text: 'text-3xl',
      tagline: 'text-base'
    }
  }

  const currentSize = sizes[size]

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${currentSize.container} flex items-center justify-center relative overflow-hidden`}>
        {/* AppDost Logo Image */}
        <img 
          src="/images/appdost-logo.png" 
          alt="AppDost Logo" 
          className="w-full h-full object-contain"
          style={{ 
            filter: 'brightness(1.1) contrast(1.1)',
            imageRendering: 'crisp-edges'
          }}
        />
      </div>

      {/* Logo Text */}
      <div className="hidden sm:block">
        <h1 className={`font-display font-bold ${currentSize.text} ${textColor} leading-tight`}>
          <span className="text-gradient bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            AppDost
          </span>
        </h1>
        {showTagline && (
          <p className={`${currentSize.tagline} text-cyan-300/90 -mt-0.5 leading-tight font-medium tracking-wider`}>
            COMPLETE IT SOLUTION
          </p>
        )}
      </div>
    </div>
  )
}

export default AppDostLogo