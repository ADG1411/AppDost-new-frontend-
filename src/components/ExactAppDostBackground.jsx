/**
 * Exact AppDost Circular Network Background
 * Precise recreation of the circular network pattern from the AppDost reference photo
 */
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Simple glowing node exactly like AppDost photo
const AppDostNode = ({ position, size = 0.06, intensity = 1.0, delay = 0 }) => {
  const meshRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      const time = state.clock.elapsedTime + delay
      
      // Gentle pulsing like in AppDost
      const pulse = Math.sin(time * 1.5 + delay * 2) * 0.2 + 0.8
      
      meshRef.current.scale.setScalar(size * pulse)
      glowRef.current.scale.setScalar(size * 4 * pulse)
      
      // Update opacity
      meshRef.current.material.opacity = intensity * pulse
      glowRef.current.material.opacity = intensity * 0.25 * pulse
    }
  })

  return (
    <group position={position}>
      {/* Bright core node */}
      <mesh ref={meshRef}>
        <circleGeometry args={[size, 8]} />
        <meshBasicMaterial 
          color="#00ffff" 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* Soft glow halo */}
      <mesh ref={glowRef}>
        <circleGeometry args={[size * 4, 12]} />
        <meshBasicMaterial 
          color="#00aaff" 
          transparent 
          opacity={0.15}
        />
      </mesh>
    </group>
  )
}

// Simple connection line matching AppDost style
const AppDostConnection = ({ start, end, intensity = 1.0, delay = 0 }) => {
  const lineRef = useRef()

  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  }, [start, end])

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [points])

  useFrame((state) => {
    if (lineRef.current) {
      const time = state.clock.elapsedTime + delay
      
      // Gentle animation
      const pulse = Math.sin(time * 2 + delay * 3) * 0.3 + 0.7
      lineRef.current.material.opacity = intensity * 0.5 * pulse
    }
  })

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial 
        color="#00d4ff" 
        transparent 
        opacity={0.5}
        linewidth={1}
      />
    </line>
  )
}

// Main AppDost circular network exactly like the photo
const AppDostCircleNetwork = () => {
  const groupRef = useRef()

  // Recreate EXACT circular pattern from AppDost photo
  const { nodes, connections } = useMemo(() => {
    const networkNodes = []
    const networkConnections = []
    
    // Analyze the photo: Large circular network with evenly distributed nodes
    const radius = 5.2 // Large circle like in photo
    const nodeCount = 28 // Counted from AppDost photo
    
    // Create the main circular ring exactly like photo
    const circleNodes = []
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const z = 0 // Keep flat like in AppDost photo
      
      const node = {
        position: [x, y, z],
        id: `circle_${i}`,
        angle: angle,
        index: i
      }
      
      networkNodes.push(node)
      circleNodes.push(node)
    }
    
    // Create connections exactly like AppDost photo pattern
    
    // 1. Circle perimeter connections (creates the outer ring)
    circleNodes.forEach((node, index) => {
      const nextIndex = (index + 1) % circleNodes.length
      const nextNode = circleNodes[nextIndex]
      
      networkConnections.push({
        start: node.position,
        end: nextNode.position,
        intensity: 0.8,
        delay: node.angle
      })
    })
    
    // 2. Cross-diameter connections (creates the web pattern like photo)
    circleNodes.forEach((node, index) => {
      // Connect to opposite side (creates diameter lines)
      const oppositeIndex = (index + Math.floor(nodeCount / 2)) % nodeCount
      const oppositeNode = circleNodes[oppositeIndex]
      
      // Only create some diameter lines (not all, like in photo)
      if (index % 3 === 0) {
        networkConnections.push({
          start: node.position,
          end: oppositeNode.position,
          intensity: 0.6,
          delay: node.angle + oppositeNode.angle
        })
      }
    })
    
    // 3. Triangular web connections (creates the complex web like photo)
    circleNodes.forEach((node, index) => {
      // Connect to nodes creating triangular patterns
      const step1 = Math.floor(nodeCount / 3)
      const step2 = Math.floor(2 * nodeCount / 3)
      
      const target1Index = (index + step1) % nodeCount
      const target2Index = (index + step2) % nodeCount
      
      const target1 = circleNodes[target1Index]
      const target2 = circleNodes[target2Index]
      
      // Selective connections like in AppDost photo
      if (Math.random() > 0.4) {
        networkConnections.push({
          start: node.position,
          end: target1.position,
          intensity: 0.4,
          delay: node.angle + target1.angle
        })
      }
      
      if (Math.random() > 0.5) {
        networkConnections.push({
          start: node.position,
          end: target2.position,
          intensity: 0.4,
          delay: node.angle + target2.angle
        })
      }
    })
    
    // 4. Additional web connections for density (like photo)
    circleNodes.forEach((node, index) => {
      // Connect to nearby nodes (2-4 positions away)
      for (let offset of [2, 3, 4]) {
        const targetIndex = (index + offset) % nodeCount
        const targetNode = circleNodes[targetIndex]
        
        // Random connections for organic web pattern
        if (Math.random() > 0.7) {
          networkConnections.push({
            start: node.position,
            end: targetNode.position,
            intensity: 0.3,
            delay: node.angle + targetNode.angle
          })
        }
      }
    })
    
    return {
      nodes: networkNodes,
      connections: networkConnections
    }
  }, [])

  // Slow rotation like AppDost
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      groupRef.current.rotation.z = time * 0.05 // Very slow like AppDost
    }
  })

  return (
    <group ref={groupRef}>
      {/* Render connections first (behind nodes) */}
      {connections.map((connection, index) => (
        <AppDostConnection
          key={`conn_${index}`}
          start={connection.start}
          end={connection.end}
          intensity={connection.intensity}
          delay={connection.delay}
        />
      ))}
      
      {/* Render nodes on top */}
      {nodes.map((node, index) => (
        <AppDostNode
          key={`node_${node.id}`}
          position={node.position}
          size={0.06}
          intensity={1.0}
          delay={index * 0.05}
        />
      ))}
    </group>
  )
}

// Background particles like AppDost photo
const AppDostParticles = () => {
  const particlesRef = useRef()

  const particles = useMemo(() => {
    const positions = new Float32Array(150 * 3)
    for (let i = 0; i < 150; i++) {
      // Distribute particles around the scene like in photo
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return positions
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.z = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#004466"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  )
}

// Exact AppDost Background Recreation
const ExactAppDostBackground = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-full z-0" 
      style={{ 
        // Exact background gradient matching AppDost photo
        background: `
          radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0, 60, 90, 0.4) 0%, transparent 60%),
          linear-gradient(135deg, #1a2f42 0%, #0f1e2d 30%, #0a1520 70%, #050d15 100%)
        `
      }}
    >
      <Canvas
        camera={{ 
          position: [0, 0, 12], 
          fov: 50,
          near: 0.1,
          far: 100
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        {/* Lighting matching AppDost photo */}
        <ambientLight intensity={0.3} color="#002244" />
        
        <directionalLight 
          position={[0, 0, 10]} 
          intensity={1.0} 
          color="#00aaff"
        />
        
        <pointLight 
          position={[0, 0, 8]} 
          intensity={0.8} 
          color="#00ccff"
          distance={25}
        />

        {/* Main circular network */}
        <AppDostCircleNetwork />

        {/* Background particles */}
        <AppDostParticles />
      </Canvas>

      {/* Central glow effect like AppDost photo */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '65vmin',
          height: '65vmin',
          background: `radial-gradient(circle, 
            rgba(0, 180, 255, 0.12) 0%, 
            rgba(0, 120, 200, 0.06) 40%, 
            rgba(0, 80, 150, 0.03) 70%,
            transparent 100%)`,
          borderRadius: '50%',
          filter: 'blur(35px)',
        }}
      />

      {/* Outer vignette like photo */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, 
            transparent 0%, 
            transparent 35%, 
            rgba(10, 21, 32, 0.4) 70%, 
            rgba(5, 13, 21, 0.8) 100%)`
        }}
      />
    </div>
  )
}

export default ExactAppDostBackground