/**
 * Simple Visible 3D Ring Network
 * Bright, clear network sphere that's guaranteed to be visible
 */
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Simple bright glowing node
const BrightNode = ({ position, delay = 0 }) => {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay
      const pulse = Math.sin(time * 3) * 0.3 + 1.0
      meshRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.1, 8, 6]} />
      <meshBasicMaterial 
        color="#00ffff" 
        emissive="#00aaff"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

// Simple bright connection line
const BrightConnection = ({ start, end, delay = 0 }) => {
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
      const pulse = Math.sin(time * 2) * 0.3 + 0.7
      lineRef.current.material.opacity = pulse
    }
  })

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial 
        color="#00e0ff" 
        transparent 
        opacity={0.8}
      />
    </line>
  )
}

// Simple ring network that's definitely visible
const SimpleRingNetwork = () => {
  const groupRef = useRef()

  // Create simple, visible network
  const { nodes, connections } = useMemo(() => {
    const networkNodes = []
    const networkConnections = []
    
    // Main ring - larger and more visible
    const radius = 4
    const nodeCount = 20
    
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const z = 0
      
      networkNodes.push({
        position: [x, y, z],
        index: i
      })
    }
    
    // Create connections
    networkNodes.forEach((node, index) => {
      // Connect to next node (ring)
      const nextIndex = (index + 1) % networkNodes.length
      networkConnections.push({
        start: node.position,
        end: networkNodes[nextIndex].position,
        delay: index * 0.1
      })
      
      // Connect across (web pattern)
      if (index % 3 === 0) {
        const oppositeIndex = (index + Math.floor(nodeCount / 2)) % nodeCount
        networkConnections.push({
          start: node.position,
          end: networkNodes[oppositeIndex].position,
          delay: index * 0.2
        })
      }
    })
    
    return { nodes: networkNodes, connections: networkConnections }
  }, [])

  // Simple rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Render connections */}
      {connections.map((connection, index) => (
        <BrightConnection
          key={`conn_${index}`}
          start={connection.start}
          end={connection.end}
          delay={connection.delay}
        />
      ))}
      
      {/* Render nodes */}
      {nodes.map((node, index) => (
        <BrightNode
          key={`node_${index}`}
          position={node.position}
          delay={index * 0.1}
        />
      ))}
    </group>
  )
}

// Simple visible background
const SimpleVisibleBackground = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-full"
      style={{ 
        background: 'linear-gradient(135deg, #071633 0%, #0a0f24 100%)'
      }}
    >
      <Canvas
        camera={{ 
          position: [0, 0, 10], 
          fov: 75
        }}
        gl={{ 
          antialias: true,
          alpha: true
        }}
      >
        {/* Bright lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 5]} intensity={2} color="#00ccff" />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />

        {/* Simple ring network */}
        <SimpleRingNetwork />
      </Canvas>

      {/* Visible glow effect */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0, 224, 255, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />
    </div>
  )
}

export default SimpleVisibleBackground