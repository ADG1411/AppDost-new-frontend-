/**
 * Perfect Full-Screen Plexus Network
 * Complete viewport coverage with enhanced visual quality
 * Larger scale, more nodes, better distribution for perfect screen coverage
 */
import { useRef, useMemo } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Enhanced full-screen plexus shader
const FullScreenPlexusShader = shaderMaterial(
  {
    time: 0,
    colorStart: new THREE.Color('#0080ff'),
    colorMid: new THREE.Color('#00aaff'),
    colorEnd: new THREE.Color('#00ff80'),
    intensity: 1.2,
    pulseSpeed: 1.0,
    glowRadius: 2.0,
  },
  // Vertex shader
  `
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying float vDistanceFromCenter;
    varying float vDepth;
    uniform float time;
    
    void main() {
      vPosition = position;
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vDistanceFromCenter = length(worldPosition.xy);
      
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vDepth = -mvPosition.z;
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment shader
  `
    uniform vec3 colorStart;
    uniform vec3 colorMid;
    uniform vec3 colorEnd;
    uniform float time;
    uniform float intensity;
    uniform float pulseSpeed;
    uniform float glowRadius;
    
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying float vDistanceFromCenter;
    varying float vDepth;
    
    void main() {
      // Enhanced gradient system
      float normalizedDistance = vDistanceFromCenter / 15.0;
      vec3 color;
      
      if (normalizedDistance < 0.5) {
        color = mix(colorStart, colorMid, normalizedDistance * 2.0);
      } else {
        color = mix(colorMid, colorEnd, (normalizedDistance - 0.5) * 2.0);
      }
      
      // Enhanced depth effect for full screen
      float depthFactor = 1.0 - smoothstep(5.0, 25.0, vDepth);
      depthFactor = mix(0.15, 1.0, depthFactor);
      
      // Dynamic pulsing
      float pulse = sin(time * pulseSpeed + vDistanceFromCenter * 0.2) * 0.4 + 0.6;
      
      // Enhanced glow effect
      float glow = 1.0 / (1.0 + vDistanceFromCenter * 0.05);
      glow = pow(glow, 0.8) * glowRadius;
      
      // Enhanced brightness for full screen visibility
      float finalIntensity = intensity * depthFactor * pulse * glow * 1.5;
      vec3 finalColor = color * finalIntensity;
      
      gl_FragColor = vec4(finalColor, min(finalIntensity * 0.9, 1.0));
    }
  `
)

extend({ FullScreenPlexusShader })

// Perfect full-screen plexus network
const PerfectFullScreenPlexus = () => {
  const groupRef = useRef()
  const connectionsRef = useRef()
  const nodesRef = useRef()

  // Generate enhanced full-screen plexus network
  const { nodes, connections, nodeGeometry, connectionGeometry } = useMemo(() => {
    const plexusNodes = []
    const plexusConnections = []
    
    // Enhanced parameters for full screen coverage
    const nodeCount = 250 // More nodes for better coverage
    const radius = 12 // Larger radius for full screen
    const maxConnectionDistance = 3.5 // Longer connections
    const maxConnections = 8 // More connections per node
    
    // Create nodes with better distribution for full screen
    for (let i = 0; i < nodeCount; i++) {
      let x, y, z
      
      if (i < nodeCount * 0.6) {
        // Main sphere distribution (60% of nodes)
        const phi = Math.acos(1 - 2 * (i + 0.5) / (nodeCount * 0.6))
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
        
        const r = radius * (0.4 + Math.random() * 0.6)
        x = r * Math.sin(phi) * Math.cos(theta)
        y = r * Math.sin(phi) * Math.sin(theta)
        z = r * Math.cos(phi) * 0.7 // Flatten slightly for better screen coverage
      } else {
        // Extended distribution for edge coverage (40% of nodes)
        const angle = (Math.random() * Math.PI * 2)
        const distance = radius * (1.2 + Math.random() * 0.8)
        
        x = Math.cos(angle) * distance + (Math.random() - 0.5) * 4
        y = Math.sin(angle) * distance + (Math.random() - 0.5) * 4
        z = (Math.random() - 0.5) * 6
      }
      
      plexusNodes.push({
        position: new THREE.Vector3(x, y, z),
        index: i,
        brightness: 0.5 + Math.random() * 0.5,
        size: 0.04 + Math.random() * 0.03
      })
    }
    
    // Enhanced connection algorithm for full coverage
    plexusNodes.forEach((node, nodeIndex) => {
      let connectionCount = 0
      const distances = []
      
      // Calculate all distances first
      plexusNodes.forEach((otherNode, otherIndex) => {
        if (nodeIndex !== otherIndex) {
          const distance = node.position.distanceTo(otherNode.position)
          distances.push({ index: otherIndex, distance, node: otherNode })
        }
      })
      
      // Sort by distance and connect to closest nodes
      distances.sort((a, b) => a.distance - b.distance)
      
      distances.forEach((item) => {
        if (connectionCount < maxConnections && item.distance < maxConnectionDistance) {
          const strength = 1.0 - (item.distance / maxConnectionDistance)
          
          plexusConnections.push({
            start: node.position,
            end: item.node.position,
            strength: strength,
            distance: item.distance,
            startIndex: nodeIndex,
            endIndex: item.index
          })
          
          connectionCount++
        }
      })
    })
    
    // Create optimized geometries with enhanced attributes
    const nodePositions = new Float32Array(plexusNodes.length * 3)
    const nodeSizes = new Float32Array(plexusNodes.length)
    const nodeOpacities = new Float32Array(plexusNodes.length)
    
    plexusNodes.forEach((node, index) => {
      nodePositions[index * 3] = node.position.x
      nodePositions[index * 3 + 1] = node.position.y  
      nodePositions[index * 3 + 2] = node.position.z
      
      nodeSizes[index] = node.size
      nodeOpacities[index] = node.brightness
    })
    
    const nodeGeo = new THREE.BufferGeometry()
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3))
    nodeGeo.setAttribute('size', new THREE.BufferAttribute(nodeSizes, 1))
    nodeGeo.setAttribute('opacity', new THREE.BufferAttribute(nodeOpacities, 1))
    
    // Enhanced connection geometry
    const connectionPositions = new Float32Array(plexusConnections.length * 6)
    const connectionStrengths = new Float32Array(plexusConnections.length * 2)
    
    plexusConnections.forEach((connection, index) => {
      connectionPositions[index * 6] = connection.start.x
      connectionPositions[index * 6 + 1] = connection.start.y
      connectionPositions[index * 6 + 2] = connection.start.z
      
      connectionPositions[index * 6 + 3] = connection.end.x
      connectionPositions[index * 6 + 4] = connection.end.y
      connectionPositions[index * 6 + 5] = connection.end.z
      
      const strength = connection.strength * 0.8
      connectionStrengths[index * 2] = strength
      connectionStrengths[index * 2 + 1] = strength
    })
    
    const connectionGeo = new THREE.BufferGeometry()
    connectionGeo.setAttribute('position', new THREE.BufferAttribute(connectionPositions, 3))
    connectionGeo.setAttribute('strength', new THREE.BufferAttribute(connectionStrengths, 1))
    
    return {
      nodes: plexusNodes,
      connections: plexusConnections,
      nodeGeometry: nodeGeo,
      connectionGeometry: connectionGeo
    }
  }, [])

  // Enhanced animation for full screen effect
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (groupRef.current) {
      // Slower, more elegant rotation
      groupRef.current.rotation.y = time * 0.03
      groupRef.current.rotation.x = Math.sin(time * 0.05) * 0.08
      groupRef.current.rotation.z = Math.cos(time * 0.04) * 0.02
      
      // Gentle breathing for organic feel
      const breathe = Math.sin(time * 0.2) * 0.03 + 1.0
      groupRef.current.scale.setScalar(breathe)
    }
    
    // Update shader time for both materials
    if (connectionsRef.current?.material) {
      connectionsRef.current.material.uniforms.time.value = time
    }
    
    if (nodesRef.current?.material) {
      nodesRef.current.material.uniforms.time.value = time
    }
  })

  return (
    <group ref={groupRef}>
      {/* Enhanced connection lines */}
      <lineSegments ref={connectionsRef} geometry={connectionGeometry}>
        <fullScreenPlexusShader
          transparent
          blending={THREE.AdditiveBlending}
          colorStart="#0099ff"
          colorMid="#00ccff"
          colorEnd="#00ff99"
          intensity={1.0}
          pulseSpeed={1.2}
          glowRadius={1.8}
        />
      </lineSegments>
      
      {/* Enhanced network nodes */}
      <points ref={nodesRef} geometry={nodeGeometry}>
        <fullScreenPlexusShader
          transparent
          blending={THREE.AdditiveBlending}
          colorStart="#00aaff"
          colorMid="#00ddff"
          colorEnd="#00ffaa"
          intensity={1.8}
          pulseSpeed={1.5}
          glowRadius={2.5}
          sizeAttenuation={true}
        />
      </points>
    </group>
  )
}

// Enhanced atmospheric effects for full screen
const FullScreenAtmosphere = () => {
  const atmosphereRef = useRef()
  const dustRef = useRef()

  const { atmosphereGeometry, dustGeometry } = useMemo(() => {
    // Main atmosphere particles
    const atmospherePositions = new Float32Array(400 * 3)
    const atmosphereSizes = new Float32Array(400)
    
    for (let i = 0; i < 400; i++) {
      const radius = 18 + Math.random() * 12
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = Math.random() * Math.PI * 2
      
      atmospherePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      atmospherePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      atmospherePositions[i * 3 + 2] = radius * Math.cos(phi)
      
      atmosphereSizes[i] = Math.random() * 0.8 + 0.2
    }
    
    const atmosphereGeo = new THREE.BufferGeometry()
    atmosphereGeo.setAttribute('position', new THREE.BufferAttribute(atmospherePositions, 3))
    atmosphereGeo.setAttribute('size', new THREE.BufferAttribute(atmosphereSizes, 1))
    
    // Dust particles for depth
    const dustPositions = new Float32Array(600 * 3)
    const dustSizes = new Float32Array(600)
    
    for (let i = 0; i < 600; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 50
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 40
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 30
      
      dustSizes[i] = Math.random() * 0.3 + 0.1
    }
    
    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
    dustGeo.setAttribute('size', new THREE.BufferAttribute(dustSizes, 1))
    
    return { atmosphereGeometry: atmosphereGeo, dustGeometry: dustGeo }
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = time * 0.008
      atmosphereRef.current.rotation.x = time * 0.003
    }
    
    if (dustRef.current) {
      dustRef.current.rotation.y = -time * 0.002
      dustRef.current.rotation.z = time * 0.001
    }
  })

  return (
    <>
      <points ref={atmosphereRef} geometry={atmosphereGeometry}>
        <pointsMaterial
          size={0.03}
          color="#004466"
          transparent
          opacity={0.4}
          sizeAttenuation={true}
        />
      </points>
      
      <points ref={dustRef} geometry={dustGeometry}>
        <pointsMaterial
          size={0.015}
          color="#002244"
          transparent
          opacity={0.2}
          sizeAttenuation={true}
        />
      </points>
    </>
  )
}

// Perfect full-screen plexus background
const PerfectFullScreenPlexusBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden" style={{
      background: `
        radial-gradient(ellipse 120% 80% at 30% 20%, rgba(0, 50, 100, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse 100% 120% at 80% 80%, rgba(0, 80, 60, 0.2) 0%, transparent 50%),
        linear-gradient(135deg, #0a1428 0%, #051018 30%, #041018 70%, #020810 100%)
      `
    }}>
      <Canvas
        camera={{ 
          position: [0, 0, 15], 
          fov: 60,
          near: 0.1,
          far: 200
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.6
        }}
        dpr={[1, 2]}
      >
        {/* Enhanced lighting for full screen */}
        <ambientLight intensity={0.15} color="#001122" />
        
        <directionalLight 
          position={[15, 15, 10]} 
          intensity={0.9} 
          color="#0099ff"
        />
        
        <pointLight 
          position={[0, 0, 0]} 
          intensity={2.0} 
          color="#00aaaa"
          distance={30}
        />
        
        <pointLight 
          position={[-12, 8, 12]} 
          intensity={0.8} 
          color="#0088ff"
          distance={25}
        />
        
        <pointLight 
          position={[12, -8, 12]} 
          intensity={0.8} 
          color="#00ff88"
          distance={25}
        />

        {/* Perfect full-screen plexus network */}
        <PerfectFullScreenPlexus />

        {/* Enhanced atmosphere */}
        <FullScreenAtmosphere />

        {/* Optimized fog for full screen depth */}
        <fog attach="fog" args={['#041018', 12, 40]} />
      </Canvas>

      {/* Enhanced bloom effects for full screen */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, 
              rgba(0, 153, 255, 0.12) 0%, 
              transparent 40%),
            radial-gradient(circle at 70% 70%, 
              rgba(0, 255, 153, 0.08) 0%, 
              transparent 40%),
            radial-gradient(ellipse 150% 100% at center, 
              rgba(0, 128, 200, 0.06) 0%, 
              transparent 60%)
          `,
          filter: 'blur(100px)',
        }}
      />

      {/* Perfect vignette for full screen immersion */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, 
              transparent 0%, 
              transparent 20%, 
              rgba(4, 16, 24, 0.4) 60%, 
              rgba(2, 8, 16, 0.8) 90%,
              rgba(2, 8, 16, 0.95) 100%)
          `
        }}
      />
    </div>
  )
}

export default PerfectFullScreenPlexusBackground