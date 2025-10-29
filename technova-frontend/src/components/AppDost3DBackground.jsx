/**
 * AppDost 3D Circular Network Background
 * Exact replica of AppDost's circular network design in 3D space
 * Features: Perfect circle of nodes, intelligent connections, cyan glow effects
 */
import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Custom glow material for nodes and connections
const NetworkGlowMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color('#00e0ff'),
    intensity: 1.0,
    pulseSpeed: 2.0,
    glowRadius: 0.5,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float time;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 color;
    uniform float time;
    uniform float intensity;
    uniform float pulseSpeed;
    uniform float glowRadius;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      // Distance from center for radial glow
      float distanceFromCenter = length(vUv - 0.5);
      
      // Pulsing animation
      float pulse = sin(time * pulseSpeed) * 0.3 + 0.7;
      
      // Core glow calculation
      float glow = 1.0 - smoothstep(0.0, glowRadius, distanceFromCenter);
      glow = pow(glow, 2.0) * intensity * pulse;
      
      // Outer rim enhancement
      float rim = 1.0 - smoothstep(0.4, 0.5, distanceFromCenter);
      rim *= 0.5;
      
      float finalGlow = glow + rim;
      vec3 finalColor = color * finalGlow;
      
      gl_FragColor = vec4(finalColor, finalGlow * 0.8);
    }
  `
)

extend({ NetworkGlowMaterial })

// Enhanced connection line with data flow effect
const ConnectionLine = ({ start, end, delay = 0, intensity = 1.0 }) => {
  const lineRef = useRef()
  const materialRef = useRef()

  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...start)
    const endVec = new THREE.Vector3(...end)
    
    // Create smooth curve
    const distance = startVec.distanceTo(endVec)
    const midPoint = startVec.clone().lerp(endVec, 0.5)
    
    // Add subtle arc for more organic feel
    const perpendicular = new THREE.Vector3()
      .crossVectors(startVec, endVec)
      .normalize()
      .multiplyScalar(distance * 0.1)
    
    midPoint.add(perpendicular)
    
    const curve = new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec)
    return curve.getPoints(30)
  }, [start, end])

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [points])

  useFrame((state) => {
    if (materialRef.current) {
      const time = state.clock.elapsedTime + delay
      
      // Data flow animation
      const flow = (Math.sin(time * 3 + delay * 5) + 1) * 0.5
      const pulse = Math.sin(time * 1.5 + delay) * 0.2 + 0.8
      
      materialRef.current.opacity = (0.4 + flow * 0.4) * intensity * pulse
    }
  })

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        ref={materialRef}
        color="#00e0ff"
        transparent
        opacity={0.6}
        linewidth={2}
      />
    </line>
  )
}

// Glowing network node
const NetworkNode = ({ position, size = 0.08, delay = 0, isMainNode = false }) => {
  const meshRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      const time = state.clock.elapsedTime + delay
      
      // Pulsing animation
      const pulse = Math.sin(time * 2 + delay * 3) * 0.3 + 0.7
      const scale = isMainNode ? size * 1.5 : size
      
      meshRef.current.scale.setScalar(scale * (0.8 + pulse * 0.2))
      glowRef.current.scale.setScalar(scale * (2 + pulse * 0.5))
      
      // Update material properties
      if (meshRef.current.material) {
        meshRef.current.material.uniforms.time.value = time
        meshRef.current.material.uniforms.intensity.value = pulse * (isMainNode ? 1.5 : 1.0)
      }
    }
  })

  return (
    <group position={position}>
      {/* Core node */}
      <mesh ref={meshRef}>
        <circleGeometry args={[size, 16]} />
        <networkGlowMaterial
          transparent
          blending={THREE.AdditiveBlending}
          color={isMainNode ? "#00ffff" : "#00e0ff"}
          intensity={isMainNode ? 1.5 : 1.0}
          pulseSpeed={2.0}
          glowRadius={0.8}
        />
      </mesh>
      
      {/* Outer glow halo */}
      <mesh ref={glowRef}>
        <circleGeometry args={[size * 2, 16]} />
        <meshBasicMaterial
          color={isMainNode ? "#00ffff" : "#00e0ff"}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// Main AppDost circular network component
const AppDostCircularNetwork = () => {
  const groupRef = useRef()

  // Generate perfect circular network exactly like AppDost photo
  const { nodes, connections } = useMemo(() => {
    const networkNodes = []
    const networkConnections = []
    
    // Main circle parameters - larger to match photo
    const radius = 5.5
    const nodeCount = 32 // More nodes for denser network like photo
    const centerPos = [0, 0, 0]
    
    // Create center node (larger and brighter)
    networkNodes.push({
      position: centerPos,
      isMainNode: true,
      id: 'center'
    })
    
    // Create multiple concentric rings like in AppDost photo
    const rings = [
      { radius: radius * 0.4, nodeCount: 12, id: 'inner' },
      { radius: radius * 0.7, nodeCount: 20, id: 'middle' }, 
      { radius: radius, nodeCount: 32, id: 'outer' }
    ]
    
    const allRingNodes = []
    
    rings.forEach((ring, ringIndex) => {
      const ringNodes = []
      for (let i = 0; i < ring.nodeCount; i++) {
        const angle = (i / ring.nodeCount) * Math.PI * 2
        const x = Math.cos(angle) * ring.radius
        const y = Math.sin(angle) * ring.radius
        const z = (Math.random() - 0.5) * 0.3 // Subtle z variation
        
        const nodeData = {
          position: [x, y, z],
          isMainNode: false,
          id: `${ring.id}_${i}`,
          angle: angle,
          ringIndex: ringIndex,
          ringRadius: ring.radius
        }
        
        networkNodes.push(nodeData)
        ringNodes.push(nodeData)
      }
      allRingNodes.push(ringNodes)
    })
    
    // Create connections like AppDost photo pattern
    
    // 1. Center to inner ring
    allRingNodes[0].forEach(node => {
      networkConnections.push({
        start: centerPos,
        end: node.position,
        intensity: 1.0,
        delay: node.angle
      })
    })
    
    // 2. Inner ring to middle ring (selective connections)
    allRingNodes[0].forEach((innerNode, index) => {
      // Connect to closest middle ring nodes
      const closestMiddle = allRingNodes[1].reduce((closest, middleNode, midIndex) => {
        const angleDiff = Math.abs(innerNode.angle - middleNode.angle)
        const minAngleDiff = Math.min(angleDiff, Math.PI * 2 - angleDiff)
        return minAngleDiff < closest.diff ? { node: middleNode, diff: minAngleDiff, index: midIndex } : closest
      }, { node: null, diff: Infinity, index: -1 })
      
      if (closestMiddle.node) {
        networkConnections.push({
          start: innerNode.position,
          end: closestMiddle.node.position,
          intensity: 0.8,
          delay: innerNode.angle + closestMiddle.node.angle
        })
      }
    })
    
    // 3. Middle ring to outer ring (dense connections like photo)
    allRingNodes[1].forEach((middleNode, index) => {
      // Connect to 2-3 outer ring nodes
      for (let offset = 0; offset <= 2; offset++) {
        const targetIndex = Math.floor((index / allRingNodes[1].length) * allRingNodes[2].length) + offset
        if (targetIndex < allRingNodes[2].length) {
          const outerNode = allRingNodes[2][targetIndex % allRingNodes[2].length]
          networkConnections.push({
            start: middleNode.position,
            end: outerNode.position,
            intensity: 0.6 - (offset * 0.1),
            delay: middleNode.angle + outerNode.angle
          })
        }
      }
    })
    
    // 4. Ring-to-ring connections within same ring (creates the web pattern)
    allRingNodes.forEach((ringNodes, ringIndex) => {
      ringNodes.forEach((node, index) => {
        // Connect to next 1-2 neighbors in same ring
        for (let offset = 1; offset <= 2; offset++) {
          const targetIndex = (index + offset) % ringNodes.length
          const targetNode = ringNodes[targetIndex]
          
          if (Math.random() > 0.4) { // 60% chance for connection
            networkConnections.push({
              start: node.position,
              end: targetNode.position,
              intensity: 0.4 - (ringIndex * 0.05),
              delay: node.angle + targetNode.angle + ringIndex
            })
          }
        }
      })
    })
    
    return {
      nodes: networkNodes,
      connections: networkConnections
    }
  }, [])

  // Rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      
      // Very slow rotation like AppDost
      groupRef.current.rotation.z = time * 0.05
      
      // Slight 3D wobble
      groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.1
      groupRef.current.rotation.y = Math.cos(time * 0.15) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Render all connections */}
      {connections.map((connection, index) => (
        <ConnectionLine
          key={`connection_${index}`}
          start={connection.start}
          end={connection.end}
          delay={connection.delay}
          intensity={connection.intensity}
        />
      ))}
      
      {/* Render all nodes */}
      {nodes.map((node, index) => (
        <NetworkNode
          key={`node_${node.id}`}
          position={node.position}
          size={node.isMainNode ? 0.12 : 0.06}
          delay={index * 0.1}
          isMainNode={node.isMainNode}
        />
      ))}
    </group>
  )
}

// Atmospheric background particles
const BackgroundParticles = () => {
  const particlesRef = useRef()

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(150 * 3)
    for (let i = 0; i < 150; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return positions
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.z = state.clock.elapsedTime * 0.02
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
        size={0.03}
        color="#004466"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  )
}

// Main AppDost 3D Background Component
const AppDost3DBackground = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-full z-0" 
      style={{ 
        background: 'linear-gradient(135deg, #0f1419 0%, #1a252f 30%, #0d1b26 70%, #08111a 100%)' 
      }}
    >
      <Canvas
        camera={{ 
          position: [0, 2, 10], 
          fov: 50,
          near: 0.1,
          far: 100
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.8
        }}
        dpr={[1, 2]}
      >
        {/* Lighting setup to match AppDost photo */}
        <ambientLight intensity={0.05} color="#001a2e" />
        
        {/* Main key light from above */}
        <directionalLight 
          position={[0, 10, 5]} 
          intensity={0.6} 
          color="#00d4ff"
        />
        
        {/* Network glow light */}
        <pointLight 
          position={[0, 0, 3]} 
          intensity={1.2} 
          color="#00e6ff"
          distance={25}
        />
        
        {/* Subtle rim lights for depth */}
        <pointLight 
          position={[10, 5, 8]} 
          intensity={0.2} 
          color="#0099cc"
          distance={20}
        />
        <pointLight 
          position={[-10, -5, 8]} 
          intensity={0.2} 
          color="#0099cc"
          distance={20}
        />

        {/* Main circular network */}
        <AppDostCircularNetwork />

        {/* Background particles */}
        <BackgroundParticles />

        {/* Atmospheric fog */}
        <fog attach="fog" args={['#0a1a2e', 15, 40]} />
      </Canvas>

      {/* CSS overlay for additional glow effect */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '80vmin',
          height: '80vmin',
          background: `radial-gradient(circle, 
            rgba(0, 224, 255, 0.15) 0%, 
            rgba(0, 255, 255, 0.08) 40%, 
            rgba(0, 128, 255, 0.03) 70%,
            transparent 100%)`,
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
      />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, 
            transparent 0%, 
            transparent 30%, 
            rgba(4, 16, 24, 0.4) 70%, 
            rgba(2, 5, 8, 0.8) 100%)`
        }}
      />
    </div>
  )
}

export default AppDost3DBackground