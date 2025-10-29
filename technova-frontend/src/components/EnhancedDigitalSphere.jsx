/**
 * Enhanced 3D Neural Network Sphere
 * Advanced shader-based glowing sphere with interconnected neural pathways
 */
import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Custom glow shader material
const GlowShaderMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color('#00e0ff'),
    glowColor: new THREE.Color('#00ffff'),
    intensity: 1.0,
    pulse: 1.0,
  },
  // Vertex shader
  `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vDistanceToCenter;
    uniform float time;
    uniform float pulse;
    
    void main() {
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vDistanceToCenter = length(position);
      
      // Add subtle vertex displacement for organic feel
      vec3 pos = position;
      float displacement = sin(time * 2.0 + position.x * 5.0 + position.y * 5.0) * 0.02;
      pos += normal * displacement * pulse;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 color;
    uniform vec3 glowColor;
    uniform float time;
    uniform float intensity;
    uniform float pulse;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vDistanceToCenter;
    
    void main() {
      // Create fresnel glow effect
      float fresnel = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
      fresnel = pow(fresnel, 2.0);
      
      // Pulsing animation
      float timePulse = sin(time * 3.0) * 0.3 + 0.7;
      
      // Distance-based intensity
      float distanceGlow = 1.0 / (vDistanceToCenter * 0.5 + 1.0);
      
      // Combine effects
      float finalGlow = fresnel * timePulse * distanceGlow * intensity * pulse;
      vec3 finalColor = mix(color, glowColor, fresnel) * finalGlow;
      
      gl_FragColor = vec4(finalColor, finalGlow * 0.8);
    }
  `
)

extend({ GlowShaderMaterial })

// Neural network node component
const NeuralNode = ({ position, size = 0.05, delay = 0 }) => {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay
      // Flickering effect
      const flicker = Math.sin(time * 8 + delay * 10) * 0.3 + 0.7
      meshRef.current.material.opacity = flicker * 0.9
      meshRef.current.scale.setScalar(size * (1 + Math.sin(time * 4 + delay) * 0.3))
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 8, 6]} />
      <meshBasicMaterial 
        color="#00ffff" 
        transparent 
        opacity={0.9}
        emissive="#00aaff"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

// Neural pathway line component
const NeuralPathway = ({ start, end, animated = true }) => {
  const lineRef = useRef()
  
  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...start)
    const endVec = new THREE.Vector3(...end)
    const midPoint = startVec.clone().lerp(endVec, 0.5)
    
    // Add curve for more organic look
    midPoint.add(new THREE.Vector3(
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.3
    ))
    
    const curve = new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec)
    return curve.getPoints(20)
  }, [start, end])

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points)
    return geom
  }, [points])

  useFrame((state) => {
    if (lineRef.current && animated) {
      const time = state.clock.elapsedTime
      // Animate line opacity with data flow effect
      const flow = (Math.sin(time * 4 + start[0] * 2) + 1) * 0.5
      lineRef.current.material.opacity = 0.3 + flow * 0.4
    }
  })

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial 
        color="#00e0ff" 
        transparent 
        opacity={0.5}
        linewidth={2}
      />
    </line>
  )
}

// Main neural network sphere
const NeuralNetworkSphere = () => {
  const groupRef = useRef()
  const sphereRef = useRef()

  // Generate neural network structure
  const { nodes, connections } = useMemo(() => {
    const nodePositions = []
    const nodeConnections = []
    const radius = 2.5
    
    // Create nodes in spherical distribution
    const nodeCount = 60
    for (let i = 0; i < nodeCount; i++) {
      // Fibonacci sphere distribution for even spacing
      const phi = Math.acos(1 - 2 * (i + 0.5) / nodeCount)
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
      
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)
      
      nodePositions.push([x, y, z])
    }
    
    // Create connections between nearby nodes
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const dist = Math.sqrt(
          Math.pow(nodePositions[i][0] - nodePositions[j][0], 2) +
          Math.pow(nodePositions[i][1] - nodePositions[j][1], 2) +
          Math.pow(nodePositions[i][2] - nodePositions[j][2], 2)
        )
        
        // Connect nodes within a certain distance
        if (dist < 1.8 && Math.random() > 0.6) {
          nodeConnections.push({
            start: nodePositions[i],
            end: nodePositions[j]
          })
        }
      }
    }

    return {
      nodes: nodePositions,
      connections: nodeConnections
    }
  }, [])

  // Animation
  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (groupRef.current) {
      // Slow rotation
      groupRef.current.rotation.y = time * 0.15
      groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.2
    }

    if (sphereRef.current) {
      // Update shader uniforms
      sphereRef.current.material.uniforms.time.value = time
      sphereRef.current.material.uniforms.pulse.value = Math.sin(time * 2) * 0.3 + 0.7
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main sphere structure */}
      <mesh ref={sphereRef}>
        <icosahedronGeometry args={[2.5, 2]} />
        <glowShaderMaterial 
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Neural nodes */}
      {nodes.map((position, index) => (
        <NeuralNode 
          key={index} 
          position={position} 
          size={0.03 + Math.random() * 0.02}
          delay={index * 0.1}
        />
      ))}

      {/* Neural pathways */}
      {connections.map((connection, index) => (
        <NeuralPathway 
          key={index}
          start={connection.start}
          end={connection.end}
          animated={true}
        />
      ))}

      {/* Inner core */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 12]} />
        <meshBasicMaterial 
          color="#ffffff" 
          emissive="#00ffff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}

// Particle field for atmosphere
const ParticleField = () => {
  const particlesRef = useRef()

  const particles = useMemo(() => {
    const positions = new Float32Array(200 * 3)
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return positions
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
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
        size={0.02}
        color="#00aaff"
        transparent
        opacity={0.4}
        sizeAttenuation={true}
      />
    </points>
  )
}

// Main component
const EnhancedDigitalSphere = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-full z-0" 
      style={{ 
        background: 'linear-gradient(135deg, #071633 0%, #0a0f24 50%, #051120 100%)' 
      }}
    >
      <Canvas
        camera={{ 
          position: [0, 2, 6], 
          fov: 50,
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
        {/* Lighting setup */}
        <ambientLight intensity={0.1} color="#071633" />
        
        {/* Key lights for the sphere */}
        <pointLight 
          position={[4, 4, 4]} 
          intensity={0.8} 
          color="#00e0ff"
          distance={15}
        />
        <pointLight 
          position={[-4, -2, -4]} 
          intensity={0.4} 
          color="#0080ff"
          distance={12}
        />
        <directionalLight
          position={[0, 10, 0]}
          intensity={0.2}
          color="#00aaff"
        />

        {/* Main neural network sphere */}
        <NeuralNetworkSphere />

        {/* Atmospheric particles */}
        <ParticleField />

        {/* Fog for depth */}
        <fog attach="fog" args={['#071633', 8, 25]} />
      </Canvas>

      {/* CSS glow overlay */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '70vmin',
          height: '70vmin',
          background: `radial-gradient(circle, 
            rgba(0, 224, 255, 0.2) 0%, 
            rgba(0, 255, 255, 0.1) 30%, 
            rgba(0, 128, 255, 0.05) 60%,
            transparent 100%)`,
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />

      {/* Additional atmospheric glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, 
            transparent 0%, 
            transparent 40%, 
            rgba(7, 22, 51, 0.3) 80%, 
            rgba(7, 22, 51, 0.8) 100%)`
        }}
      />
    </div>
  )
}

export default EnhancedDigitalSphere