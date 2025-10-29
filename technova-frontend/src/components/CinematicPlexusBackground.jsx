/**
 * Cinematic Plexus Network Background
 * High-resolution plexus network forming a semi-transparent sphere
 * Electric blue to neon green gradient with volumetric lighting and bloom effects
 */
import { useRef, useMemo } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Advanced plexus shader with gradient and depth effects
const PlexusShaderMaterial = shaderMaterial(
  {
    time: 0,
    colorStart: new THREE.Color('#0080ff'), // Electric blue
    colorEnd: new THREE.Color('#00ff80'),   // Neon green
    intensity: 1.0,
    depth: 0.5,
    bloom: 1.0,
  },
  // Vertex shader
  `
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying float vDepth;
    uniform float time;
    
    void main() {
      vPosition = position;
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vDepth = -mvPosition.z;
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment shader
  `
    uniform vec3 colorStart;
    uniform vec3 colorEnd;
    uniform float time;
    uniform float intensity;
    uniform float depth;
    uniform float bloom;
    
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying float vDepth;
    
    void main() {
      // Distance from center for gradient
      float distanceFromCenter = length(vWorldPosition.xy);
      float normalizedDistance = distanceFromCenter / 8.0;
      
      // Color gradient from blue to green
      vec3 color = mix(colorStart, colorEnd, normalizedDistance);
      
      // Depth-based brightness (depth of field effect)
      float depthFactor = 1.0 - smoothstep(3.0, 12.0, vDepth);
      depthFactor = mix(0.2, 1.0, depthFactor);
      
      // Pulsing animation
      float pulse = sin(time * 2.0 + distanceFromCenter * 0.5) * 0.3 + 0.7;
      
      // Volumetric lighting effect
      float volumetric = 1.0 / (1.0 + distanceFromCenter * 0.1);
      
      // Combine effects
      float finalIntensity = intensity * depthFactor * pulse * volumetric * bloom;
      vec3 finalColor = color * finalIntensity;
      
      gl_FragColor = vec4(finalColor, finalIntensity * 0.9);
    }
  `
)

extend({ PlexusShaderMaterial })

// Plexus network node with sophisticated effects
class PlexusNode {
  constructor(x, y, z, index) {
    this.position = new THREE.Vector3(x, y, z)
    this.originalPosition = this.position.clone()
    this.connections = []
    this.index = index
    this.brightness = Math.random() * 0.5 + 0.5
    this.pulseOffset = Math.random() * Math.PI * 2
  }
}

// Cinematic plexus network component
const CinematicPlexusNetwork = () => {
  const groupRef = useRef()
  const nodesRef = useRef()
  const connectionsRef = useRef()

  // Generate sophisticated plexus network
  const { nodes, connections, nodeGeometry, connectionGeometry } = useMemo(() => {
    const plexusNodes = []
    const plexusConnections = []
    
    // Create nodes in a semi-spherical distribution
    const nodeCount = 150
    const radius = 6
    
    // Generate nodes with proper 3D distribution
    for (let i = 0; i < nodeCount; i++) {
      // Use fibonacci sphere distribution for even spacing
      const phi = Math.acos(1 - 2 * (i + 0.5) / nodeCount)
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
      
      // Add randomization for organic feel
      const r = radius * (0.6 + Math.random() * 0.4)
      const x = r * Math.sin(phi) * Math.cos(theta) + (Math.random() - 0.5) * 0.5
      const y = r * Math.sin(phi) * Math.sin(theta) + (Math.random() - 0.5) * 0.5
      const z = r * Math.cos(phi) + (Math.random() - 0.5) * 0.5
      
      plexusNodes.push(new PlexusNode(x, y, z, i))
    }
    
    // Create connections based on proximity (plexus algorithm)
    const maxConnectionDistance = 2.5
    const maxConnectionsPerNode = 6
    
    plexusNodes.forEach((node, nodeIndex) => {
      let connectionCount = 0
      
      plexusNodes.forEach((otherNode, otherIndex) => {
        if (nodeIndex !== otherIndex && connectionCount < maxConnectionsPerNode) {
          const distance = node.position.distanceTo(otherNode.position)
          
          if (distance < maxConnectionDistance) {
            // Connection strength based on distance (closer = stronger)
            const strength = 1.0 - (distance / maxConnectionDistance)
            
            plexusConnections.push({
              start: node.position,
              end: otherNode.position,
              strength: strength,
              distance: distance,
              startIndex: nodeIndex,
              endIndex: otherIndex
            })
            
            connectionCount++
          }
        }
      })
    })
    
    // Create optimized geometries
    const nodePositions = new Float32Array(plexusNodes.length * 3)
    const nodeSizes = new Float32Array(plexusNodes.length)
    const nodeColors = new Float32Array(plexusNodes.length * 3)
    
    plexusNodes.forEach((node, index) => {
      nodePositions[index * 3] = node.position.x
      nodePositions[index * 3 + 1] = node.position.y
      nodePositions[index * 3 + 2] = node.position.z
      
      nodeSizes[index] = 0.03 + node.brightness * 0.02
      
      // Color based on distance from center
      const distanceFromCenter = node.position.length()
      const colorT = Math.min(distanceFromCenter / 8, 1)
      
      nodeColors[index * 3] = colorT * 0.2 + 0.8     // R: blue to green
      nodeColors[index * 3 + 1] = colorT * 0.8 + 0.2 // G: blue to green  
      nodeColors[index * 3 + 2] = (1 - colorT) * 0.8 // B: blue to green
    })
    
    const nodeGeo = new THREE.BufferGeometry()
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3))
    nodeGeo.setAttribute('size', new THREE.BufferAttribute(nodeSizes, 1))
    nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3))
    
    // Connection lines geometry
    const connectionPositions = new Float32Array(plexusConnections.length * 6)
    const connectionOpacities = new Float32Array(plexusConnections.length * 2)
    
    plexusConnections.forEach((connection, index) => {
      // Start point
      connectionPositions[index * 6] = connection.start.x
      connectionPositions[index * 6 + 1] = connection.start.y
      connectionPositions[index * 6 + 2] = connection.start.z
      
      // End point
      connectionPositions[index * 6 + 3] = connection.end.x
      connectionPositions[index * 6 + 4] = connection.end.y
      connectionPositions[index * 6 + 5] = connection.end.z
      
      // Opacity based on strength and distance
      const opacity = connection.strength * 0.6
      connectionOpacities[index * 2] = opacity
      connectionOpacities[index * 2 + 1] = opacity
    })
    
    const connectionGeo = new THREE.BufferGeometry()
    connectionGeo.setAttribute('position', new THREE.BufferAttribute(connectionPositions, 3))
    connectionGeo.setAttribute('opacity', new THREE.BufferAttribute(connectionOpacities, 1))
    
    return {
      nodes: plexusNodes,
      connections: plexusConnections,
      nodeGeometry: nodeGeo,
      connectionGeometry: connectionGeo
    }
  }, [])

  // Sophisticated animation
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (groupRef.current) {
      // Gentle rotation for cinematic effect
      groupRef.current.rotation.y = time * 0.05
      groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.1
      
      // Breathing effect
      const breathe = Math.sin(time * 0.3) * 0.05 + 1.0
      groupRef.current.scale.setScalar(breathe)
    }
    
    // Update shader uniforms for nodes
    if (nodesRef.current && nodesRef.current.material) {
      nodesRef.current.material.uniforms.time.value = time
    }
    
    // Update shader uniforms for connections
    if (connectionsRef.current && connectionsRef.current.material) {
      connectionsRef.current.material.uniforms.time.value = time
    }
  })

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments ref={connectionsRef} geometry={connectionGeometry}>
        <plexusShaderMaterial
          transparent
          blending={THREE.AdditiveBlending}
          colorStart="#0080ff"
          colorEnd="#00ff80"
          intensity={0.8}
          bloom={1.2}
        />
      </lineSegments>
      
      {/* Network nodes */}
      <points ref={nodesRef} geometry={nodeGeometry}>
        <plexusShaderMaterial
          transparent
          blending={THREE.AdditiveBlending}
          colorStart="#0080ff"
          colorEnd="#00ff80"
          intensity={1.5}
          bloom={1.8}
          sizeAttenuation={true}
        />
      </points>
    </group>
  )
}

// Volumetric atmosphere
const VolumetricAtmosphere = () => {
  const atmosphereRef = useRef()

  const atmosphereGeometry = useMemo(() => {
    const positions = new Float32Array(300 * 3)
    const sizes = new Float32Array(300)
    
    for (let i = 0; i < 300; i++) {
      // Distribute in larger sphere around the plexus
      const radius = 12 + Math.random() * 8
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = Math.random() * Math.PI * 2
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      sizes[i] = Math.random() * 0.5 + 0.1
    }
    
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    
    return geometry
  }, [])

  useFrame((state) => {
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = state.clock.elapsedTime * 0.01
      atmosphereRef.current.rotation.x = state.clock.elapsedTime * 0.005
    }
  })

  return (
    <points ref={atmosphereRef} geometry={atmosphereGeometry}>
      <pointsMaterial
        size={0.02}
        color="#003366"
        transparent
        opacity={0.3}
        sizeAttenuation={true}
      />
    </points>
  )
}

// Main cinematic plexus background
const CinematicPlexusBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-[#0a1428] to-[#041018] flex items-center justify-center">
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
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4
        }}
        dpr={[1, 2]}
      >
        {/* Cinematic lighting setup */}
        <ambientLight intensity={0.1} color="#001a2e" />
        
        {/* Key light */}
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.8} 
          color="#0099ff"
        />
        
        {/* Fill light */}
        <pointLight 
          position={[0, 0, 0]} 
          intensity={1.5} 
          color="#00aa88"
          distance={20}
        />
        
        {/* Rim lights for depth */}
        <pointLight 
          position={[-8, 5, 8]} 
          intensity={0.6} 
          color="#0080ff"
          distance={15}
        />
        <pointLight 
          position={[8, -5, 8]} 
          intensity={0.6} 
          color="#00ff80"
          distance={15}
        />

        {/* Main plexus network */}
        <CinematicPlexusNetwork />

        {/* Volumetric atmosphere */}
        <VolumetricAtmosphere />

        {/* Atmospheric fog for depth of field */}
        <fog attach="fog" args={['#041018', 8, 25]} />
      </Canvas>

      {/* Bloom effect overlay */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '90vmin',
          height: '90vmin',
          background: `
            radial-gradient(circle, 
              rgba(0, 128, 255, 0.15) 0%, 
              rgba(0, 170, 136, 0.1) 30%, 
              rgba(0, 255, 128, 0.05) 60%,
              transparent 100%)
          `,
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />

      {/* Volumetric lighting overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 150% 100% at 50% 50%, 
              rgba(0, 128, 255, 0.02) 0%,
              transparent 50%),
            radial-gradient(ellipse at center, 
              transparent 0%, 
              transparent 30%, 
              rgba(4, 16, 24, 0.6) 70%, 
              rgba(4, 16, 24, 0.9) 100%)
          `
        }}
      />
    </div>
  )
}

export default CinematicPlexusBackground