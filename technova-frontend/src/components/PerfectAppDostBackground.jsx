/**
 * Perfect AppDost Photo Recreation
 * Exact replica of the circular network from the reference photo
 */
import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Perfect circular network node
const PerfectNode = ({ position, size = 0.08, intensity = 1.0, delay = 0 }) => {
  const meshRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      const time = state.clock.elapsedTime + delay
      
      // Subtle pulsing like in photo
      const pulse = Math.sin(time * 1.5 + delay) * 0.15 + 0.85
      
      meshRef.current.scale.setScalar(size * pulse)
      glowRef.current.scale.setScalar(size * 3 * pulse)
      
      // Update opacity
      meshRef.current.material.opacity = intensity * pulse
      glowRef.current.material.opacity = intensity * 0.3 * pulse
    }
  })

  return (
    <group position={position}>
      {/* Core bright node */}
      <mesh ref={meshRef}>
        <circleGeometry args={[size, 12]} />
        <meshBasicMaterial 
          color="#00ffff" 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* Outer glow halo */}
      <mesh ref={glowRef}>
        <circleGeometry args={[size * 3, 16]} />
        <meshBasicMaterial 
          color="#00aaff" 
          transparent 
          opacity={0.2}
        />
      </mesh>
    </group>
  )
}

// Perfect connection line matching photo
const PerfectConnection = ({ start, end, intensity = 1.0, delay = 0 }) => {
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
      
      // Gentle pulsing animation
      const pulse = Math.sin(time * 2 + delay) * 0.2 + 0.8
      lineRef.current.material.opacity = intensity * 0.6 * pulse
    }
  })

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial 
        color="#00d4ff" 
        transparent 
        opacity={0.6}
        linewidth={1}
      />
    </line>
  )
}

// Main network exactly like AppDost photo
const PerfectAppDostNetwork = () => {
  const groupRef = useRef()

  // Recreate EXACT pattern from photo
  const { nodes, connections } = useMemo(() => {
    const networkNodes = []
    const networkConnections = []
    
    // Photo analysis: Single large circle with evenly spaced nodes
    const radius = 4.5
    const nodeCount = 24 // Counted from photo
    
    // Create the main circular ring
    const mainRingNodes = []
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const z = 0 // Keep flat like in photo
      
      const nodeData = {
        position: [x, y, z],
        id: `main_${i}`,
        angle: angle,
        index: i
      }
      
      networkNodes.push(nodeData)
      mainRingNodes.push(nodeData)
    }
    
    // Create connections exactly like in photo
    mainRingNodes.forEach((node, index) => {
      // Connect to next neighbor (creates the circle outline)
      const nextIndex = (index + 1) % mainRingNodes.length
      const nextNode = mainRingNodes[nextIndex]
      
      networkConnections.push({
        start: node.position,
        end: nextNode.position,
        intensity: 1.0,
        delay: node.angle
      })
      
      // Connect across the circle (creates the web pattern)
      // From photo: connects to nodes across the diameter
      const oppositeIndex = (index + Math.floor(nodeCount / 2)) % nodeCount
      const oppositeNode = mainRingNodes[oppositeIndex]
      
      networkConnections.push({
        start: node.position,
        end: oppositeNode.position,
        intensity: 0.7,
        delay: node.angle + oppositeNode.angle
      })
      
      // Connect to nodes at 1/3 and 2/3 positions (creates triangular patterns)
      const third1Index = (index + Math.floor(nodeCount / 3)) % nodeCount
      const third2Index = (index + Math.floor(2 * nodeCount / 3)) % nodeCount
      
      const third1Node = mainRingNodes[third1Index]
      const third2Node = mainRingNodes[third2Index]
      
      if (Math.random() > 0.3) { // Selective connections like photo
        networkConnections.push({
          start: node.position,
          end: third1Node.position,
          intensity: 0.5,
          delay: node.angle + third1Node.angle
        })
      }
      
      if (Math.random() > 0.4) {
        networkConnections.push({
          start: node.position,
          end: third2Node.position,
          intensity: 0.4,
          delay: node.angle + third2Node.angle
        })
      }
      
      // Additional nearby connections for density
      if (Math.random() > 0.5) {
        const nearIndex1 = (index + 2) % nodeCount
        const nearIndex2 = (index - 2 + nodeCount) % nodeCount
        
        networkConnections.push({
          start: node.position,
          end: mainRingNodes[nearIndex1].position,
          intensity: 0.6,
          delay: node.angle + mainRingNodes[nearIndex1].angle
        })
      }
    })
    
    return {
      nodes: networkNodes,
      connections: networkConnections
    }
  }, [])

  // Slow rotation like in AppDost
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      groupRef.current.rotation.z = time * 0.1 // Slow rotation
    }
  })

  return (
    <group ref={groupRef}>
      {/* Render all connections first (behind nodes) */}
      {connections.map((connection, index) => (
        <PerfectConnection
          key={`connection_${index}`}
          start={connection.start}
          end={connection.end}
          intensity={connection.intensity}
          delay={connection.delay}
        />
      ))}
      
      {/* Render all nodes on top */}
      {nodes.map((node, index) => (
        <PerfectNode
          key={`node_${node.id}`}
          position={node.position}
          size={0.08}
          intensity={1.0}
          delay={index * 0.1}
        />
      ))}
    </group>
  )
}

// Minimal particles for atmosphere
const SubtleParticles = () => {
  const particlesRef = useRef()

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(80 * 3) // Fewer particles
    for (let i = 0; i < 80; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5
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
          count={particlePositions.length / 3}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#003366"
        transparent
        opacity={0.4}
        sizeAttenuation={true}
      />
    </points>
  )
}

// Perfect AppDost Background - Exact Photo Recreation
const PerfectAppDostBackground = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-full z-0" 
      style={{ 
        background: 'radial-gradient(ellipse at center, #162636 0%, #0f1f2a 40%, #0a141c 70%, #050b0f 100%)' 
      }}
    >
      <Canvas
        camera={{ 
          position: [0, 0, 9], 
          fov: 45,
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
        {/* Simple lighting setup matching photo */}
        <ambientLight intensity={0.2} color="#001122" />
        
        <directionalLight 
          position={[0, 0, 10]} 
          intensity={0.8} 
          color="#00ccff"
        />

        {/* Perfect network recreation */}
        <PerfectAppDostNetwork />

        {/* Subtle background particles */}
        <SubtleParticles />
      </Canvas>

      {/* Photo-accurate glow overlay */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '60vmin',
          height: '60vmin',
          background: `radial-gradient(circle, 
            rgba(0, 204, 255, 0.1) 0%, 
            rgba(0, 150, 200, 0.05) 50%, 
            transparent 100%)`,
          borderRadius: '50%',
          filter: 'blur(30px)',
        }}
      />
    </div>
  )
}

export default PerfectAppDostBackground