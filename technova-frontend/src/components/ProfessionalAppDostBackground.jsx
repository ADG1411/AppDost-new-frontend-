/**
 * Professional AppDost Network Background
 * High-quality, enterprise-grade circular network visualization
 * Advanced shaders, professional lighting, and smooth animations
 */
import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Professional glow shader material
const ProfessionalGlowMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color('#00e6ff'),
    glowColor: new THREE.Color('#00ffff'),
    intensity: 1.0,
    pulseSpeed: 1.5,
    radius: 0.1,
    falloff: 2.0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    uniform float time;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 color;
    uniform vec3 glowColor;
    uniform float time;
    uniform float intensity;
    uniform float pulseSpeed;
    uniform float radius;
    uniform float falloff;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      // Distance from center
      float dist = length(vUv - 0.5);
      
      // Professional pulse animation
      float pulse = sin(time * pulseSpeed) * 0.2 + 0.8;
      
      // Multi-layer glow effect
      float innerGlow = 1.0 - smoothstep(0.0, radius, dist);
      float midGlow = 1.0 - smoothstep(radius, radius * 2.0, dist);
      float outerGlow = 1.0 - smoothstep(radius * 2.0, radius * 4.0, dist);
      
      // Combine glows with different intensities
      float finalGlow = innerGlow * 1.0 + midGlow * 0.6 + outerGlow * 0.3;
      finalGlow = pow(finalGlow, falloff) * intensity * pulse;
      
      // Color mixing for professional look
      vec3 finalColor = mix(color, glowColor, innerGlow * 0.7);
      finalColor *= finalGlow;
      
      gl_FragColor = vec4(finalColor, finalGlow * 0.9);
    }
  `
)

extend({ ProfessionalGlowMaterial })

// Professional network connection with advanced effects
const ProfessionalConnection = ({ start, end, intensity = 1.0, delay = 0, type = 'primary' }) => {
  const lineRef = useRef()
  const materialRef = useRef()

  const { points, curve } = useMemo(() => {
    const startVec = new THREE.Vector3(...start)
    const endVec = new THREE.Vector3(...end)
    
    // Create elegant curve for professional look
    const distance = startVec.distanceTo(endVec)
    const midPoint = startVec.clone().lerp(endVec, 0.5)
    
    // Add subtle curve based on connection type
    let curvature = 0
    if (type === 'diagonal') curvature = distance * 0.05
    if (type === 'cross') curvature = distance * 0.03
    
    midPoint.z += curvature
    
    const bezierCurve = new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec)
    return {
      points: bezierCurve.getPoints(40),
      curve: bezierCurve
    }
  }, [start, end, type])

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [points])

  useFrame((state) => {
    if (materialRef.current) {
      const time = state.clock.elapsedTime + delay
      
      // Professional data flow animation
      const flow = (Math.sin(time * 2.5 + delay * 3) + 1) * 0.5
      const basePulse = Math.sin(time * 1.2 + delay) * 0.15 + 0.85
      
      // Different intensities based on connection type
      let typeMultiplier = 1.0
      if (type === 'secondary') typeMultiplier = 0.7
      if (type === 'tertiary') typeMultiplier = 0.4
      
      materialRef.current.opacity = (0.3 + flow * 0.4) * intensity * basePulse * typeMultiplier
    }
  })

  const getConnectionColor = () => {
    switch (type) {
      case 'primary': return '#00e6ff'
      case 'secondary': return '#0099cc'
      case 'tertiary': return '#006699'
      default: return '#00e6ff'
    }
  }

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        ref={materialRef}
        color={getConnectionColor()}
        transparent
        opacity={0.6}
        linewidth={type === 'primary' ? 2 : 1}
      />
    </line>
  )
}

// Professional glowing node
const ProfessionalNode = ({ position, size = 0.1, nodeType = 'standard', delay = 0 }) => {
  const groupRef = useRef()
  const coreRef = useRef()
  const glowRef = useRef()
  const pulseRef = useRef()

  const isCenter = nodeType === 'center'
  const actualSize = isCenter ? size * 1.8 : size

  useFrame((state) => {
    if (groupRef.current && coreRef.current && glowRef.current) {
      const time = state.clock.elapsedTime + delay
      
      // Professional pulsing animation
      const corePulse = Math.sin(time * 1.8 + delay * 2) * 0.1 + 0.9
      const glowPulse = Math.sin(time * 1.2 + delay) * 0.2 + 0.8
      
      // Scale animations
      coreRef.current.scale.setScalar(actualSize * corePulse)
      glowRef.current.scale.setScalar(actualSize * 2.5 * glowPulse)
      
      // Update shader uniforms
      if (coreRef.current.material && coreRef.current.material.uniforms) {
        coreRef.current.material.uniforms.time.value = time
        coreRef.current.material.uniforms.intensity.value = isCenter ? 1.5 : 1.0
      }
      
      // Subtle rotation for center node
      if (isCenter) {
        groupRef.current.rotation.z = time * 0.2
      }
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Core node with professional shader */}
      <mesh ref={coreRef}>
        <circleGeometry args={[actualSize, 16]} />
        <professionalGlowMaterial
          transparent
          blending={THREE.AdditiveBlending}
          color={isCenter ? "#ffffff" : "#00e6ff"}
          glowColor={isCenter ? "#00ffff" : "#00aaff"}
          intensity={isCenter ? 1.8 : 1.2}
          pulseSpeed={1.5}
          radius={0.3}
          falloff={1.5}
        />
      </mesh>
      
      {/* Outer glow halo */}
      <mesh ref={glowRef}>
        <circleGeometry args={[actualSize * 2, 20]} />
        <meshBasicMaterial
          color={isCenter ? "#00ffff" : "#00aaff"}
          transparent
          opacity={isCenter ? 0.15 : 0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Pulse ring for center node */}
      {isCenter && (
        <mesh ref={pulseRef}>
          <ringGeometry args={[actualSize * 1.5, actualSize * 2, 32]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  )
}

// Main professional network component
const ProfessionalNetworkSystem = () => {
  const groupRef = useRef()
  const systemRef = useRef()

  // Create professional network architecture
  const { nodes, connections } = useMemo(() => {
    const networkNodes = []
    const networkConnections = []
    
    // Professional network design parameters
    const centerPos = [0, 0, 0]
    const mainRadius = 4.8
    const nodeCount = 20 // Optimized for professional look
    
    // Center hub node
    networkNodes.push({
      position: centerPos,
      nodeType: 'center',
      id: 'hub',
      angle: 0
    })
    
    // Main ring nodes
    const mainRing = []
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2
      const x = Math.cos(angle) * mainRadius
      const y = Math.sin(angle) * mainRadius
      const z = Math.sin(angle * 3) * 0.2 // Subtle 3D wave
      
      const node = {
        position: [x, y, z],
        nodeType: 'standard',
        id: `ring_${i}`,
        angle: angle,
        index: i
      }
      
      networkNodes.push(node)
      mainRing.push(node)
    }
    
    // Professional connection patterns
    
    // 1. Hub to ring connections (primary)
    mainRing.forEach((node, index) => {
      networkConnections.push({
        start: centerPos,
        end: node.position,
        intensity: 1.0,
        delay: index * 0.1,
        type: 'primary'
      })
    })
    
    // 2. Ring perimeter connections
    mainRing.forEach((node, index) => {
      const nextIndex = (index + 1) % mainRing.length
      const nextNode = mainRing[nextIndex]
      
      networkConnections.push({
        start: node.position,
        end: nextNode.position,
        intensity: 0.8,
        delay: node.angle,
        type: 'secondary'
      })
    })
    
    // 3. Strategic cross connections
    mainRing.forEach((node, index) => {
      // Connect to nodes at golden ratio positions for elegant geometry
      const goldenRatio = 1.618
      const step = Math.round(nodeCount / goldenRatio)
      
      for (let offset of [step, nodeCount - step]) {
        const targetIndex = (index + offset) % nodeCount
        const targetNode = mainRing[targetIndex]
        
        if (Math.random() > 0.3) { // 70% connection probability
          networkConnections.push({
            start: node.position,
            end: targetNode.position,
            intensity: 0.5,
            delay: node.angle + targetNode.angle,
            type: 'tertiary'
          })
        }
      }
    })
    
    // 4. Professional triangular patterns
    mainRing.forEach((node, index) => {
      if (index % 3 === 0) { // Every third node
        const tri1 = (index + Math.floor(nodeCount / 3)) % nodeCount
        const tri2 = (index + Math.floor(2 * nodeCount / 3)) % nodeCount
        
        networkConnections.push({
          start: node.position,
          end: mainRing[tri1].position,
          intensity: 0.4,
          delay: node.angle + mainRing[tri1].angle,
          type: 'tertiary'
        })
      }
    })
    
    return { nodes: networkNodes, connections: networkConnections }
  }, [])

  // Professional rotation and breathing animation
  useFrame((state) => {
    if (groupRef.current && systemRef.current) {
      const time = state.clock.elapsedTime
      
      // Smooth professional rotation
      groupRef.current.rotation.z = time * 0.08
      
      // Subtle breathing effect
      const breathe = Math.sin(time * 0.5) * 0.02 + 1.0
      systemRef.current.scale.setScalar(breathe)
      
      // Gentle wobble for 3D effect
      groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.05
      groupRef.current.rotation.y = Math.cos(time * 0.25) * 0.03
    }
  })

  return (
    <group ref={systemRef}>
      <group ref={groupRef}>
        {/* Render connections first */}
        {connections.map((connection, index) => (
          <ProfessionalConnection
            key={`conn_${index}`}
            start={connection.start}
            end={connection.end}
            intensity={connection.intensity}
            delay={connection.delay}
            type={connection.type}
          />
        ))}
        
        {/* Render nodes on top */}
        {nodes.map((node, index) => (
          <ProfessionalNode
            key={`node_${node.id}`}
            position={node.position}
            size={0.08}
            nodeType={node.nodeType}
            delay={index * 0.08}
          />
        ))}
      </group>
    </group>
  )
}

// Professional atmospheric effects
const ProfessionalAtmosphere = () => {
  const particlesRef = useRef()
  const dustRef = useRef()

  // High-quality particle system
  const { particles, dust } = useMemo(() => {
    // Main particles
    const particlePositions = new Float32Array(120 * 3)
    for (let i = 0; i < 120; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 25
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 25
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    
    // Dust particles
    const dustPositions = new Float32Array(200 * 3)
    for (let i = 0; i < 200; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 30
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 30
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    
    return {
      particles: particlePositions,
      dust: dustPositions
    }
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (particlesRef.current) {
      particlesRef.current.rotation.z = time * 0.015
      particlesRef.current.rotation.y = time * 0.008
    }
    
    if (dustRef.current) {
      dustRef.current.rotation.z = -time * 0.005
      dustRef.current.rotation.x = time * 0.003
    }
  })

  return (
    <>
      {/* Main atmospheric particles */}
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
          size={0.025}
          color="#004466"
          transparent
          opacity={0.6}
          sizeAttenuation={true}
        />
      </points>
      
      {/* Fine dust particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dust.length / 3}
            array={dust}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          color="#002244"
          transparent
          opacity={0.3}
          sizeAttenuation={true}
        />
      </points>
    </>
  )
}

// Main Professional AppDost Background Component
const ProfessionalAppDostBackground = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-full z-0" 
      style={{ 
        background: `
          radial-gradient(ellipse 80% 50% at 50% 40%, rgba(0, 50, 80, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 70%, rgba(0, 40, 70, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, #0a1420 0%, #162636 25%, #0f1f2a 50%, #0a141c 75%, #050b0f 100%)
        ` 
      }}
    >
      <Canvas
        camera={{ 
          position: [0, 1, 10], 
          fov: 42,
          near: 0.1,
          far: 100
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          shadowMap: true
        }}
        dpr={[1, 2]}
      >
        {/* Professional lighting setup */}
        <ambientLight intensity={0.15} color="#001a33" />
        
        {/* Key light */}
        <directionalLight 
          position={[0, 5, 8]} 
          intensity={0.8} 
          color="#00ccff"
          castShadow
        />
        
        {/* Fill light */}
        <pointLight 
          position={[0, 0, 5]} 
          intensity={1.2} 
          color="#00e6ff"
          distance={30}
        />
        
        {/* Rim lights */}
        <pointLight 
          position={[10, 8, 5]} 
          intensity={0.4} 
          color="#0099dd"
          distance={25}
        />
        <pointLight 
          position={[-10, -8, 5]} 
          intensity={0.4} 
          color="#0099dd"
          distance={25}
        />

        {/* Professional network system */}
        <ProfessionalNetworkSystem />

        {/* Atmospheric effects */}
        <ProfessionalAtmosphere />

        {/* Professional fog */}
        <fog attach="fog" args={['#0a141c', 12, 45]} />
      </Canvas>

      {/* Professional glow overlays */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '70vmin',
          height: '70vmin',
          background: `
            radial-gradient(circle, 
              rgba(0, 230, 255, 0.08) 0%, 
              rgba(0, 180, 220, 0.04) 40%, 
              rgba(0, 120, 180, 0.02) 70%,
              transparent 100%)
          `,
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
      />
      
      {/* Subtle vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, 
              transparent 0%, 
              transparent 40%, 
              rgba(5, 11, 15, 0.3) 80%, 
              rgba(5, 11, 15, 0.7) 100%)
          `
        }}
      />
    </div>
  )
}

export default ProfessionalAppDostBackground