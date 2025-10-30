/**
 * Enhanced Sphere Network Background with Advanced 3D Effects
 * Creates a sophisticated particle network that forms a glowing sphere structure
 */
import { useCallback, useMemo, useEffect, useState } from 'react'
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'

const SphereNetwork = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

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
    console.log('Sphere Network loaded', container)
  }, [])

  // Advanced sphere-like particle configuration
  const sphereConfig = useMemo(() => {
    const centerX = dimensions.width / 2
    const centerY = dimensions.height / 2
    const _radius = Math.min(dimensions.width, dimensions.height) * 0.25

    return {
      fullScreen: {
        enable: true,
        zIndex: 0,
      },
      background: {
        color: {
          value: '#071633',
        },
        image: `radial-gradient(circle at ${centerX}px ${centerY}px, 
          rgba(14, 165, 164, 0.1) 0%, 
          rgba(14, 165, 164, 0.05) 25%, 
          transparent 50%)`,
        position: 'center',
        repeat: 'no-repeat',
        size: 'cover',
      },
      fpsLimit: 120,
      particles: {
        number: {
          value: 200,
          density: {
            enable: true,
            area: 1200,
          },
        },
        color: {
          value: [
            '#0ea5a4',
            '#7CFFB2', 
            '#4F9CF9',
            '#00D4FF',
            '#39FF14',
            '#1B998B'
          ],
        },
        shape: {
          type: ['circle', 'triangle'],
          options: {
            circle: {
              radius: 2,
            },
            triangle: {
              sides: 3,
            },
          },
        },
        opacity: {
          value: { min: 0.2, max: 1 },
          animation: {
            enable: true,
            speed: 2,
            minimumValue: 0.1,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 5 },
          animation: {
            enable: true,
            speed: 4,
            minimumValue: 0.5,
            sync: false,
          },
        },
        links: {
          enable: true,
          distance: 120,
          color: {
            value: '#0ea5a4',
          },
          opacity: 0.8,
          width: 2,
          triangles: {
            enable: true,
            color: {
              value: '#0ea5a4',
            },
            opacity: 0.15,
          },
          shadow: {
            enable: true,
            blur: 8,
            color: {
              value: '#0ea5a4',
            },
          },
        },
        move: {
          enable: true,
          speed: { min: 0.5, max: 2 },
          direction: 'none',
          random: true,
          straight: false,
          outModes: {
            default: 'bounce',
          },
          attract: {
            enable: true,
            rotateX: 1200,
            rotateY: 1200,
          },
          trail: {
            enable: true,
            length: 5,
            fillColor: {
              value: '#0ea5a4',
            },
          },
          gravity: {
            enable: true,
            acceleration: 0.05,
            maxSpeed: 2,
          },
          spin: {
            acceleration: 1,
            enable: false,
          },
        },
        rotate: {
          value: {
            min: 0,
            max: 360,
          },
          direction: 'random',
          animation: {
            enable: true,
            speed: 5,
            sync: false,
          },
        },
        wobble: {
          distance: 30,
          enable: true,
          speed: {
            angle: 50,
            move: 10,
          },
        },
        orbit: {
          animation: {
            count: 0,
            enable: false,
            speed: 1,
            sync: false,
          },
          enable: false,
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
          width: 1,
        },
      },
      interactivity: {
        detect_on: 'window',
        events: {
          onHover: {
            enable: true,
            mode: ['repulse', 'bubble', 'connect'],
          },
          onClick: {
            enable: true,
            mode: ['push', 'repulse'],
          },
          resize: true,
        },
        modes: {
          repulse: {
            distance: 150,
            duration: 0.4,
            factor: 100,
            speed: 1,
            maxSpeed: 50,
            easing: 'ease-out-quad',
          },
          bubble: {
            distance: 250,
            size: 10,
            duration: 2,
            opacity: 1,
            speed: 3,
            divs: {
              distance: 200,
              duration: 0.4,
              mix: false,
              selectors: [],
            },
          },
          connect: {
            distance: 200,
            links: {
              opacity: 1,
            },
            radius: 60,
          },
          push: {
            default: true,
            groups: [],
            quantity: 6,
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
      // Advanced emitters for dynamic effects
      emitters: [
        {
          autoPlay: true,
          fill: true,
          life: {
            wait: false,
          },
          rate: {
            quantity: 2,
            delay: 5,
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
              value: { min: 3, max: 8 },
              animation: {
                enable: true,
                speed: 8,
                minimumValue: 1,
                sync: false,
              },
            },
            move: {
              enable: true,
              speed: { min: 1, max: 3 },
              outModes: {
                default: 'destroy',
              },
              gravity: {
                enable: false,
              },
              trail: {
                enable: true,
                length: 8,
                fillColor: '#7CFFB2',
              },
            },
            color: {
              value: ['#7CFFB2', '#0ea5a4', '#4F9CF9'],
            },
            opacity: {
              value: { min: 0.3, max: 1 },
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0,
                sync: false,
                startValue: 'max',
                destroy: 'min',
              },
            },
            life: {
              duration: {
                sync: false,
                value: { min: 4, max: 8 },
              },
              count: 1,
            },
            links: {
              enable: true,
              distance: 100,
              color: '#7CFFB2',
              opacity: 0.6,
              width: 1,
            },
          },
        },
      ],
    }
  }, [dimensions])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-primary-900 z-0">
      {/* Main particle system */}
      <Particles
        id="sphere-network-particles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={sphereConfig}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Central glow effect */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none"
        style={{
          background: `radial-gradient(circle, 
            rgba(14, 165, 164, 0.3) 0%, 
            rgba(14, 165, 164, 0.15) 30%, 
            rgba(124, 255, 178, 0.1) 50%,
            transparent 70%)`
        }}
      />
      
      {/* Outer ring glow */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none"
        style={{
          background: `conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(14, 165, 164, 0.1) 90deg,
            rgba(124, 255, 178, 0.15) 180deg,
            rgba(14, 165, 164, 0.1) 270deg,
            transparent 360deg
          )`
        }}
      />
      
      {/* Depth gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, 
            transparent 0%, 
            transparent 30%, 
            rgba(7, 22, 51, 0.2) 60%, 
            rgba(7, 22, 51, 0.6) 100%)`
        }}
      />

      {/* Animated border glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-4 rounded-full opacity-30"
          style={{
            border: '1px solid #0ea5a4',
            boxShadow: `
              0 0 20px #0ea5a4,
              inset 0 0 20px rgba(14, 165, 164, 0.1)
            `,
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  )
}

export default SphereNetwork