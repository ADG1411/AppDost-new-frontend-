/**
 * Advanced 3D Glowing Network Circle Background Component
 * Creates a full-screen animated particle network with sphere-like structure
 * Similar to AppDost's futuristic background design
 */
import { useCallback, useMemo } from 'react'
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'

const Background3D = () => {
  // Initialize particles engine
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine)
  }, [])

  const particlesLoaded = useCallback(async (container) => {
    console.log('3D Network particles loaded', container)
  }, [])

  // Advanced particle configuration for 3D glowing network effect
  const particlesConfig = useMemo(() => ({
    fullScreen: {
      enable: true,
      zIndex: 0,
    },
    background: {
      color: {
        value: '#071633',
      },
    },
    fpsLimit: 120,
    particles: {
      number: {
        value: 150,
        density: {
          enable: true,
          area: 1000,
        },
      },
      color: {
        value: ['#0ea5a4', '#7CFFB2', '#4F9CF9', '#00D4FF'],
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: { min: 0.3, max: 1 },
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.1,
          sync: false,
        },
      },
      size: {
        value: { min: 1, max: 4 },
        animation: {
          enable: true,
          speed: 3,
          minimumValue: 0.5,
          sync: false,
        },
      },
      links: {
        enable: true,
        distance: 150,
        color: '#0ea5a4',
        opacity: 0.6,
        width: 1,
        triangles: {
          enable: true,
          color: '#0ea5a4',
          opacity: 0.1,
        },
        shadow: {
          enable: true,
          blur: 5,
          color: '#0ea5a4',
        },
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'out',
        },
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200,
        },
        trail: {
          enable: true,
          length: 3,
          fillColor: '#0ea5a4',
        },
      },
      wobble: {
        distance: 20,
        enable: true,
        speed: 10,
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
          mode: ['repulse', 'bubble'],
        },
        onClick: {
          enable: true,
          mode: 'push',
        },
        resize: true,
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
        bubble: {
          distance: 200,
          size: 8,
          duration: 2,
          opacity: 1,
          speed: 3,
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
        value: true,
      },
    },
    // Advanced 3D effect configurations
    emitters: [
      {
        autoPlay: true,
        fill: true,
        life: {
          wait: false,
        },
        rate: {
          quantity: 1,
          delay: 7,
        },
        shape: 'square',
        startCount: 0,
        size: {
          mode: 'percent',
          height: 0,
          width: 0,
        },
        particles: {
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 2, max: 6 },
            animation: {
              enable: true,
              speed: 5,
              minimumValue: 1,
              sync: false,
            },
          },
          move: {
            enable: true,
            speed: { min: 2, max: 4 },
            outModes: {
              default: 'destroy',
              bottom: 'none',
            },
            gravity: {
              enable: false,
            },
          },
          color: {
            value: '#7CFFB2',
          },
          opacity: {
            value: { min: 0.1, max: 1 },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0,
              sync: false,
              startValue: 'max',
              destroy: 'min',
            },
          },
          life: {
            duration: {
              sync: false,
              value: 3,
            },
            count: 1,
          },
        },
        position: {
          x: { random: true },
          y: { random: true },
        },
      },
    ],
    // Custom effects for glowing appearance
    themes: [
      {
        name: 'light',
        default: {
          value: true,
          mode: 'light',
        },
        options: {
          background: {
            color: {
              value: '#071633',
            },
          },
          particles: {
            color: {
              value: '#0ea5a4',
            },
          },
        },
      },
    ],
  }), [])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-primary-900 z-0">
      <Particles
        id="background3d-particles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={particlesConfig}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Additional glowing overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/20 via-transparent to-primary-900/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
      
      {/* Radial gradient overlay for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, 
            transparent 0%, 
            transparent 40%, 
            rgba(7, 22, 51, 0.3) 70%, 
            rgba(7, 22, 51, 0.8) 100%)`
        }}
      />
    </div>
  )
}

export default Background3D