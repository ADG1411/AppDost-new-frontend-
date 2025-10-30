/**
 * Modern 3D Ring Network Sphere
 * Glowing holographic data web with interconnected neon blue lines and dots
 * Designed for high-end tech websites like AppDost, IBM Watson, DeepMind
 */
import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Advanced glow shader for holographic effect
const HolographicGlowMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color('#00e0ff'),
    glowIntensity: 1.0,
    pulseSpeed: 2.0,
    depthFactor: 0.5,
  },
  // Vertex shader
  `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vDepth;
    uniform float time;
    
    void main() {
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vDepth = -mvPosition.z / 10.0; // Depth for 3D effect
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment shader
  `
    uniform vec3 color;
    uniform float time;
    uniform float glowIntensity;
    uniform float pulseSpeed;
    uniform float depthFactor;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vDepth;
    
    void main() {
      // Holographic pulse effect
      float pulse = sin(time * pulseSpeed) * 0.3 + 0.7;
      
      // Depth-based glow (3D illusion)
      float depthGlow = 1.0 - smoothstep(0.0, 1.0, vDepth * depthFactor);
      depthGlow = mix(0.3, 1.0, depthGlow); // Outer lines blurred, inner sharp
      
      // Fresnel effect for holographic look
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = 1.0 - abs(dot(vNormal, viewDirection));
      fresnel = pow(fresnel, 2.0);
      
      // Combine effects
      float finalGlow = pulse * depthGlow * fresnel * glowIntensity;
      vec3 finalColor = color * finalGlow;
      
      gl_FragColor = vec4(finalColor, finalGlow * 0.8);
    }
  `
)

extend({ HolographicGlowMaterial })

// Glowing network node with flickering effect
const NetworkNode = ({ position, size = 0.04, delay = 0 }) => {
  const meshRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      const time = state.clock.elapsedTime + delay
      
      // Subtle flickering effect
      const flicker = Math.sin(time * 8 + delay * 15) * 0.2 + 0.8
      const pulse = Math.sin(time * 3 + delay * 5) * 0.15 + 0.85
      
      meshRef.current.scale.setScalar(size * pulse)
      glowRef.current.scale.setScalar(size * 6 * flicker)
      
      // Update opacity for flickering
      meshRef.current.material.opacity = flicker * 0.95
      glowRef.current.material.opacity = flicker * 0.3
    }
  })

  return (
    <group position={position}>
      {/* Bright core dot */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 8, 6]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.95}
          emissive="#00e0ff"
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {/* Glowing halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 6, 12, 8]} />
        <meshBasicMaterial 
          color="#00e0ff" 
          transparent 
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// Holographic connection line
const HolographicConnection = ({ start, end, depth = 0.5, delay = 0 }) => {
  const lineRef = useRef()
  const materialRef = useRef()

  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...start)
    const endVec = new THREE.Vector3(...end)
    
    // Add slight curve for organic feel
    const midPoint = startVec.clone().lerp(endVec, 0.5)
    const distance = startVec.distanceTo(endVec)
    midPoint.z += Math.sin(distance) * 0.1
    
    const curve = new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec)
    return curve.getPoints(25)
  }, [start, end])

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [points])

  useFrame((state) => {
    if (materialRef.current) {
      const time = state.clock.elapsedTime + delay
      
      // Gentle pulsing glow
      const pulse = Math.sin(time * 2.5 + delay * 4) * 0.3 + 0.7
      
      // Depth-based opacity (3D illusion)
      const depthOpacity = 0.3 + (depth * 0.4)
      
      materialRef.current.opacity = pulse * depthOpacity
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

// Main 3D Ring Network Sphere
const RingNetworkSphere = () => {
  const groupRef = useRef()
  const innerRingRef = useRef()
  const outerRingRef = useRef()

  // Generate 3D ring-shaped sphere network
  const { nodes, connections } = useMemo(() => {
    const networkNodes = []
    const networkConnections = []
    
    // Create multiple rings at different depths for 3D effect
    const rings = [
      { radius: 3.5, nodeCount: 16, z: 0, depth: 1.0 },      // Main ring
      { radius: 3.2, nodeCount: 14, z: 0.8, depth: 0.8 },   // Inner front
      { radius: 3.2, nodeCount: 14, z: -0.8, depth: 0.6 },  // Inner back  
      { radius: 3.8, nodeCount: 18, z: 0.4, depth: 0.7 },   // Outer front
      { radius: 3.8, nodeCount: 18, z: -0.4, depth: 0.5 },  // Outer back
    ]
    
    const allRings = []
    
    rings.forEach((ring, ringIndex) => {
      const ringNodes = []
      
      for (let i = 0; i < ring.nodeCount; i++) {
        const angle = (i / ring.nodeCount) * Math.PI * 2
        const x = Math.cos(angle) * ring.radius
        const y = Math.sin(angle) * ring.radius
        const z = ring.z + Math.sin(angle * 3) * 0.2 // Add wave for organic 3D shape
        
        const node = {
          position: [x, y, z],
          depth: ring.depth,
          ringIndex,
          nodeIndex: i,
          angle
        }
        
        networkNodes.push(node)
        ringNodes.push(node)
      }
      
      allRings.push(ringNodes)
    })
    
    // Create sophisticated connection patterns
    
    // 1. Intra-ring connections (perimeter of each ring)
    allRings.forEach((ringNodes, ringIndex) => {
      ringNodes.forEach((node, nodeIndex) => {
        const nextNode = ringNodes[(nodeIndex + 1) % ringNodes.length]
        
        networkConnections.push({
          start: node.position,
          end: nextNode.position,
          depth: node.depth,
          delay: node.angle + ringIndex
        })
      })
    })
    
    // 2. Inter-ring connections (between rings)
    for (let i = 0; i < allRings.length - 1; i++) {
      const ring1 = allRings[i]
      const ring2 = allRings[i + 1]
      
      ring1.forEach((node1, index) => {
        // Connect to closest nodes in adjacent ring
        const ratio = ring2.length / ring1.length
        const targetIndex1 = Math.floor(index * ratio)
        const targetIndex2 = Math.ceil(index * ratio) % ring2.length
        
        if (Math.random() > 0.3) {
          networkConnections.push({
            start: node1.position,
            end: ring2[targetIndex1].position,
            depth: (node1.depth + ring2[targetIndex1].depth) / 2,
            delay: node1.angle + ring2[targetIndex1].angle
          })
        }
      })
    }
    
    // 3. Cross connections for web effect
    allRings.forEach((ringNodes, ringIndex) => {
      ringNodes.forEach((node, nodeIndex) => {
        // Connect across diameter
        const oppositeIndex = Math.floor(ringNodes.length / 2 + nodeIndex) % ringNodes.length
        const oppositeNode = ringNodes[oppositeIndex]
        
        if (Math.random() > 0.6) {
          networkConnections.push({
            start: node.position,
            end: oppositeNode.position,
            depth: node.depth * 0.7,
            delay: node.angle + oppositeNode.angle
          })
        }
        
        // Connect to nodes in other rings at similar angles
        allRings.forEach((otherRing, otherRingIndex) => {
          if (otherRingIndex !== ringIndex && Math.random() > 0.8) {
            const similarAngleIndex = Math.floor((node.angle / (Math.PI * 2)) * otherRing.length)
            const targetNode = otherRing[similarAngleIndex % otherRing.length]
            
            networkConnections.push({
              start: node.position,
              end: targetNode.position,
              depth: (node.depth + targetNode.depth) / 2 * 0.6,
              delay: node.angle + targetNode.angle + ringIndex
            })
          }
        })
      })
    })
    
    return { nodes: networkNodes, connections: networkConnections }
  }, [])

  // Smooth rotation and breathing animation
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (groupRef.current) {
      // Slow 360° rotation
      groupRef.current.rotation.z = time * 0.1
      groupRef.current.rotation.y = time * 0.05
      
      // Gentle breathing effect
      const breathe = Math.sin(time * 0.8) * 0.05 + 1.0
      groupRef.current.scale.setScalar(breathe)
    }
    
    // Counter-rotation for inner elements
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -time * 0.15
    }
    
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y = time * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      <group ref={innerRingRef}>
        {/* Render connections with depth-based opacity */}
        {connections.map((connection, index) => (
          <HolographicConnection
            key={`conn_${index}`}
            start={connection.start}
            end={connection.end}
            depth={connection.depth}
            delay={connection.delay}
          />
        ))}
      </group>
      
      <group ref={outerRingRef}>
        {/* Render glowing nodes */}
        {nodes.map((node, index) => (
          <NetworkNode
            key={`node_${index}`}
            position={node.position}
            size={0.03 + node.depth * 0.02}
            delay={index * 0.1 + node.depth}
          />
        ))}
      </group>
    </group>
  )
}

// Immersive digital aura particles
const DigitalAura = () => {
  const particlesRef = useRef()

  const particles = useMemo(() => {
    const positions = new Float32Array(200 * 3)
    const sizes = new Float32Array(200)
    
    for (let i = 0; i < 200; i++) {
      // Distribute around the sphere
      const radius = 8 + Math.random() * 12
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = Math.random() * Math.PI * 2
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      sizes[i] = Math.random() * 0.5 + 0.2
    }
    
    return { positions, sizes }
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime
      particlesRef.current.rotation.y = time * 0.02
      particlesRef.current.rotation.z = time * 0.01
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.sizes.length}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#004466"
        transparent
        opacity={0.4}
        sizeAttenuation={true}
        vertexColors={false}
      />
    </points>
  )
}

// Main Modern Ring Network Background
const ModernRingNetworkBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-[#071633] to-[#0a0f24] flex items-center justify-center">
      <Canvas
        camera={{ 
          position: [0, 0, 8], 
          fov: 60,
          near: 0.1,
          far: 100
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        dpr={[1, 2]}
      >
        {/* Modern lighting setup */}
        <ambientLight intensity={0.2} color="#001a33" />
        
        {/* Key light for the network */}
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8} 
          color="#00ccff"
        />
        
        {/* Fill light */}
        <pointLight 
          position={[0, 0, 4]} 
          intensity={1.5} 
          color="#00e0ff"
          distance={20}
        />
        
        {/* Rim lights for 3D effect */}
        <pointLight 
          position={[-8, 4, 3]} 
          intensity={0.5} 
          color="#0099dd"
          distance={15}
        />
        <pointLight 
          position={[8, -4, 3]} 
          intensity={0.5} 
          color="#0099dd"
          distance={15}
        />

        {/* Main ring network sphere */}
        <RingNetworkSphere />

        {/* Digital aura particles */}
        <DigitalAura />

        {/* Atmospheric fog */}
        <fog attach="fog" args={['#0a0f24', 10, 30]} />
      </Canvas>

      {/* Soft radial glow overlay */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '80vmin',
          height: '80vmin',
          background: `radial-gradient(circle, 
            rgba(0, 224, 255, 0.15) 0%, 
            rgba(0, 180, 255, 0.08) 30%, 
            rgba(0, 120, 200, 0.04) 60%,
            transparent 100%)`,
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />

      {/* Immersive digital aura */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 50% 50%, 
              rgba(0, 224, 255, 0.03) 0%,
              transparent 40%),
            radial-gradient(ellipse at center, 
              transparent 0%, 
              transparent 40%, 
              rgba(10, 15, 36, 0.6) 80%, 
              rgba(7, 22, 51, 0.9) 100%)
          `
        }}
      />
    </div>
  )
}

export default ModernRingNetworkBackground