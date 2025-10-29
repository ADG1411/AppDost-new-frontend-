/**
 * Exact AppDost-style Circular Network Background
 * Perfect recreation of the geometric network sphere pattern
 */
import { useCallback, useMemo, useEffect, useState } from 'react'
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'

const AppDostExact = () => {
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
    console.log('AppDost exact particles loaded', container)
  }, [])

  // Generate circular positioning for particles
  const generateCircularNodes = () => {
    const nodes = []
    const centerX = 50 // percentage
    const centerY = 50 // percentage
    const layers = 4 // number of concentric circles
    const baseRadius = 15 // base radius in percentage

    // Create concentric circles of nodes
    for (let layer = 1; layer <= layers; layer++) {
      const radius = baseRadius * layer
      const nodesInLayer = layer * 12 // more nodes in outer layers
      
      for (let i = 0; i < nodesInLayer; i++) {
        const angle = (2 * Math.PI * i) / nodesInLayer
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)
        
        nodes.push({ x, y })
      }
    }

    // Add center node
    nodes.push({ x: centerX, y: centerY })

    return nodes
  }

  const circularNodes = useMemo(() => generateCircularNodes(), [])

  // Perfect AppDost configuration
  const exactConfig = useMemo(() => ({
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
        value: 100,
        density: {
          enable: false,
        },
      },
      color: {
        value: '#00d4ff',
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: 1,
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.6,
          sync: false,
        },
      },
      size: {
        value: 4,
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 2,
          sync: false,
        },
      },
      links: {
        enable: true,
        distance: 200,
        color: '#00d4ff',
        opacity: 0.8,
        width: 2,
        triangles: {
          enable: true,
          color: '#00d4ff',
          opacity: 0.1,
        },
        shadow: {
          enable: true,
          blur: 5,
          color: '#00d4ff',
        },
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: 'none',
        random: false,
        straight: false,
        outModes: {
          default: 'bounce',
        },
        attract: {
          enable: true,
          rotateX: 3000,
          rotateY: 3000,
        },
        // Circular orbital motion
        path: {
          clamp: false,
          delay: {
            random: {
              enable: false,
              minimumValue: 0
            },
            value: 0
          },
          enable: true,
          options: {
            sides: 6,
            turnSteps: 30,
            angle: 30
          },
          generator: 'polygonPathGenerator'
        },
      },
      // Circular positioning
      position: {
        x: { random: false, value: 50 },
        y: { random: false, value: 50 },
      },
    },
    interactivity: {
      detect_on: 'window',
      events: {
        onHover: {
          enable: true,
          mode: 'connect',
        },
        onClick: {
          enable: true,
          mode: 'repulse',
        },
        resize: true,
      },
      modes: {
        connect: {
          distance: 300,
          links: {
            opacity: 1,
          },
          radius: 100,
        },
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    detectRetina: true,
    smooth: true,
    // Manual particle positioning for perfect circle
    manualParticles: circularNodes.map((node, index) => ({
      id: `node-${index}`,
      position: {
        x: node.x,
        y: node.y,
      },
      options: {
        color: {
          value: index % 3 === 0 ? '#00d4ff' : '#0ea5a4',
        },
        size: {
          value: index === circularNodes.length - 1 ? 6 : 4, // center node larger
        },
        opacity: {
          value: 1,
        },
      },
    })),
  }), [circularNodes])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#0a1628] z-0">
      {/* Main particle system */}
      <Particles
        id="appdost-exact-particles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={exactConfig}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Perfect circular glow overlay */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '70vmin',
          height: '70vmin',
          background: `radial-gradient(circle, 
            rgba(0, 212, 255, 0.1) 0%, 
            rgba(0, 212, 255, 0.05) 50%, 
            transparent 70%)`
        }}
      />
      
      {/* Geometric grid overlay for structure */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }}
      />
      
      {/* Central bright glow */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
        style={{
          background: '#00d4ff',
          borderRadius: '50%',
          boxShadow: `
            0 0 20px #00d4ff,
            0 0 40px #00d4ff,
            0 0 60px rgba(0, 212, 255, 0.5)
          `,
        }}
      />
    </div>
  )
}

export default AppDostExact