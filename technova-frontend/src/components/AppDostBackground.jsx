/**
 * AppDost-Style Circular Network Background
 * Creates a perfect circular/spherical particle network with glowing connections
 * Matches the exact style from the reference image
 */
import { useCallback, useMemo, useEffect, useState } from 'react'
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'

const AppDostBackground = () => {
  const [_dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine)
  }, [])

  const particlesLoaded = useCallback(async (container) => {
    console.log('AppDost-style particles loaded', container)
  }, [])

  // Configuration that matches AppDost's circular network design
  const appDostConfig = useMemo(() => ({
    fullScreen: {
      enable: true,
      zIndex: 0,
    },
    background: {
      color: {
        value: '#0a1628',
      },
    },
    fpsLimit: 120,
    particles: {
      number: {
        value: 180,
        density: {
          enable: true,
          area: 1000,
        },
      },
      color: {
        value: '#0ea5a4',
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: { min: 0.4, max: 1 },
        animation: {
          enable: true,
          speed: 1.5,
          minimumValue: 0.2,
          sync: false,
        },
      },
      size: {
        value: { min: 2, max: 4 },
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 1,
          sync: false,
        },
      },
      links: {
        enable: true,
        distance: 150,
        color: '#0ea5a4',
        opacity: 0.7,
        width: 1.5,
        triangles: {
          enable: true,
          color: '#0ea5a4',
          opacity: 0.1,
        },
        shadow: {
          enable: true,
          blur: 10,
          color: '#0ea5a4',
        },
      },
      move: {
        enable: true,
        speed: 1,
        direction: 'none',
        random: false,
        straight: false,
        outModes: {
          default: 'bounce',
        },
        attract: {
          enable: true,
          rotateX: 800,
          rotateY: 800,
        },
        // Circular motion to create sphere-like structure
        path: {
          clamp: false,
          delay: {
            random: {
              enable: false,
              minimumValue: 0
            },
            value: 0
          },
          enable: false,
          options: {}
        },
      },
      // Add orbit behavior for circular patterns
      orbit: {
        animation: {
          count: 0,
          enable: true,
          speed: 0.5,
          sync: false,
        },
        enable: true,
        opacity: 1,
        rotation: {
          random: {
            enable: true,
            minimumValue: 1,
          },
          value: {
            min: 0,
            max: 360,
          },
        },
        width: 2,
      },
      // Add wobble for organic movement
      wobble: {
        distance: 20,
        enable: true,
        speed: {
          angle: 10,
          move: 5,
        },
      },
    },
    interactivity: {
      detect_on: 'window',
      events: {
        onHover: {
          enable: true,
          mode: 'repulse',
        },
        onClick: {
          enable: true,
          mode: 'push',
        },
        resize: true,
      },
      modes: {
        repulse: {
          distance: 120,
          duration: 0.4,
          factor: 50,
          speed: 1,
          maxSpeed: 30,
        },
        push: {
          quantity: 4,
        },
      },
    },
    detectRetina: true,
    smooth: true,
    motion: {
      disable: false,
      reduce: {
        factor: 4,
        value: false,
      },
    },
    // Central attractor emitter
    emitters: {
      autoPlay: true,
      fill: true,
      life: {
        wait: false,
      },
      rate: {
        quantity: 1,
        delay: 10,
      },
      shape: 'circle',
      startCount: 0,
      size: {
        mode: 'percent',
        height: 0,
        width: 0,
      },
      position: {
        x: 50,
        y: 50,
      },
      particles: {
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 3 },
        },
        move: {
          enable: true,
          speed: { min: 0.5, max: 1.5 },
          outModes: {
            default: 'bounce',
          },
        },
        color: {
          value: '#7CFFB2',
        },
        opacity: {
          value: { min: 0.6, max: 1 },
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0.3,
          },
        },
        life: {
          duration: {
            sync: false,
            value: 15,
          },
          count: 1,
        },
        links: {
          enable: true,
          distance: 100,
          color: '#7CFFB2',
          opacity: 0.4,
          width: 1,
        },
      },
    },
  }), [])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#0a1628] z-0">
      {/* Main particle system */}
      <Particles
        id="appdost-particles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={appDostConfig}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Central circular glow - matches AppDost design */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '60vmin',
          height: '60vmin',
          background: `radial-gradient(circle, 
            rgba(14, 165, 164, 0.15) 0%, 
            rgba(14, 165, 164, 0.08) 40%, 
            rgba(14, 165, 164, 0.03) 70%,
            transparent 100%)`,
          borderRadius: '50%',
        }}
      />
      
      {/* Outer ring glow */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-rotate-slow"
        style={{
          width: '80vmin',
          height: '80vmin',
          background: `conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(14, 165, 164, 0.1) 45deg,
            rgba(124, 255, 178, 0.1) 90deg,
            rgba(14, 165, 164, 0.1) 135deg,
            transparent 180deg,
            transparent 225deg,
            rgba(14, 165, 164, 0.1) 270deg,
            rgba(124, 255, 178, 0.1) 315deg,
            transparent 360deg
          )`,
          borderRadius: '50%',
        }}
      />
      
      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(14, 165, 164, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 164, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, 
            transparent 0%, 
            transparent 50%, 
            rgba(10, 22, 40, 0.4) 80%, 
            rgba(10, 22, 40, 0.8) 100%)`
        }}
      />
    </div>
  )
}

export default AppDostBackground