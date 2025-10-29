/**
 * Demo page showcasing the 3D Glowing Network Background
 * Full-screen immersive experience with no UI elements
 */
import { useState, useEffect } from 'react'
import Background3D from '../components/Background3D'
import SphereNetwork from '../components/SphereNetwork'

const NetworkDemo = () => {
  const [currentBackground, setCurrentBackground] = useState('sphere')
  const [showControls, setShowControls] = useState(false)

  // Toggle background type with keyboard
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === ' ') {
        setCurrentBackground(prev => prev === 'sphere' ? 'network' : 'sphere')
      }
      if (e.key === 'c') {
        setShowControls(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-primary-900">
      {/* Background Animation */}
      {currentBackground === 'sphere' ? <SphereNetwork /> : <Background3D />}
      
      {/* Optional minimal controls (hidden by default) */}
      {showControls && (
        <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
          <button
            onClick={() => setCurrentBackground('sphere')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              currentBackground === 'sphere'
                ? 'bg-accent text-primary-900 shadow-glow'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Sphere Network
          </button>
          <button
            onClick={() => setCurrentBackground('network')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              currentBackground === 'network'
                ? 'bg-accent text-primary-900 shadow-glow'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            3D Network
          </button>
        </div>
      )}

      {/* Hidden keyboard instructions */}
      <div className="absolute bottom-4 left-4 z-50 text-white/30 text-xs space-y-1 select-none pointer-events-none">
        <div>Press SPACE to switch backgrounds</div>
        <div>Press C to toggle controls</div>
      </div>

      {/* Performance indicator */}
      <div className="absolute top-4 left-4 z-50 text-accent/50 text-xs font-mono">
        {currentBackground === 'sphere' ? 'SPHERE MODE' : '3D NETWORK MODE'}
      </div>
    </div>
  )
}

export default NetworkDemo