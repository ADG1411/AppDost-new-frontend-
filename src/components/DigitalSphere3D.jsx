/**
 * 3D Digital Sphere with Rotating Neon Network
 * Creates a futuristic glowing sphere made of interconnected lines and nodes
 */
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, Line, Text } from '@react-three/drei'
import * as THREE from 'three'

// Custom shader material for glowing neon effect
const GlowMaterial = ({ color = '#00e0ff', intensity = 1 }) => {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(color) },
        intensity: { value: intensity },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        uniform float time;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          
          vec3 pos = position;
          // Add subtle vertex animation
          pos += normal * sin(time * 2.0 + position.x * 10.0) * 0.02;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float intensity;
        uniform float time;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          // Create pulsing glow effect
          float pulse = sin(time * 3.0) * 0.3 + 0.7;
          
          // Distance-based glow
          float glow = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          glow = pow(glow, 2.0);
          
          vec3 finalColor = color * intensity * pulse * (glow + 0.2);
          gl_FragColor = vec4(finalColor, glow * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
  }, [color, intensity])

  useFrame((state) => {
    material.uniforms.time.value = state.clock.elapsedTime
  })

  return material
}

// Sphere wireframe with interconnected lines
const DigitalSphere = () => {
  const sphereRef = useRef()
  const linesRef = useRef()
  const nodesRef = useRef()

  // Generate sphere geometry with custom wireframe
  const { sphereGeometry, lineGeometry, nodePositions } = useMemo(() => {
    // Create sphere points
    const radius = 2
    const segments = 20
    const rings = 15
    
    const spherePoints = []
    const linePoints = []
    const nodes = []

    // Generate sphere vertices
    for (let i = 0; i <= rings; i++) {
      const theta = (i / rings) * Math.PI
      for (let j = 0; j <= segments; j++) {
        const phi = (j / segments) * Math.PI * 2
        
        const x = radius * Math.sin(theta) * Math.cos(phi)
        const y = radius * Math.cos(theta)
        const z = radius * Math.sin(theta) * Math.sin(phi)
        
        spherePoints.push(x, y, z)
        
        // Add as potential node
        if (i % 2 === 0 && j % 3 === 0) {
          nodes.push(x, y, z)
        }

        // Create horizontal lines
        if (j < segments) {
          const nextPhi = ((j + 1) / segments) * Math.PI * 2
          const nextX = radius * Math.sin(theta) * Math.cos(nextPhi)
          const nextZ = radius * Math.sin(theta) * Math.sin(nextPhi)
          
          linePoints.push(x, y, z, nextX, y, nextZ)
        }

        // Create vertical lines
        if (i < rings) {
          const nextTheta = ((i + 1) / rings) * Math.PI
          const nextY = radius * Math.cos(nextTheta)
          const nextX = radius * Math.sin(nextTheta) * Math.cos(phi)
          const nextZ = radius * Math.sin(nextTheta) * Math.sin(phi)
          
          linePoints.push(x, y, z, nextX, nextY, nextZ)
        }
      }
    }

    // Additional interconnecting lines for network effect
    for (let i = 0; i < nodes.length; i += 3) {
      for (let j = i + 3; j < Math.min(i + 15, nodes.length); j += 3) {
        const dist = Math.sqrt(
          Math.pow(nodes[i] - nodes[j], 2) +
          Math.pow(nodes[i + 1] - nodes[j + 1], 2) +
          Math.pow(nodes[i + 2] - nodes[j + 2], 2)
        )
        
        if (dist < 1.5) {
          linePoints.push(
            nodes[i], nodes[i + 1], nodes[i + 2],
            nodes[j], nodes[j + 1], nodes[j + 2]
          )
        }
      }
    }

    const sphereGeom = new THREE.SphereGeometry(radius, segments, rings)
    const lineGeom = new THREE.BufferGeometry()
    lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3))

    return {
      sphereGeometry: sphereGeom,
      lineGeometry: lineGeom,
      nodePositions: new Float32Array(nodes)
    }
  }, [])

  // Animation loop
  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Rotate the entire sphere
    if (sphereRef.current) {
      sphereRef.current.rotation.y = time * 0.2
      sphereRef.current.rotation.x = time * 0.1
    }

    // Animate lines
    if (linesRef.current) {
      linesRef.current.rotation.y = time * 0.15
      linesRef.current.rotation.x = time * 0.08
    }

    // Animate nodes
    if (nodesRef.current) {
      nodesRef.current.rotation.y = time * 0.25
      nodesRef.current.rotation.x = time * 0.12
    }
  })

  return (
    <group>
      {/* Main wireframe sphere */}
      <group ref={sphereRef}>
        <mesh geometry={sphereGeometry}>
          <meshBasicMaterial 
            color="#00e0ff" 
            wireframe 
            transparent 
            opacity={0.3}
          />
        </mesh>
      </group>

      {/* Interconnecting lines */}
      <group ref={linesRef}>
        <line geometry={lineGeometry}>
          <lineBasicMaterial 
            color="#00e0ff" 
            transparent 
            opacity={0.6}
            linewidth={2}
          />
        </line>
      </group>

      {/* Glowing nodes at intersections */}
      <group ref={nodesRef}>
        <Points positions={nodePositions} stride={3}>
          <pointsMaterial
            size={0.1}
            color="#00ffff"
            transparent
            opacity={0.8}
            sizeAttenuation={false}
          />
        </Points>
      </group>
    </group>
  )
}

// Main 3D Scene Component
const DigitalSphere3D = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-0" style={{ background: 'linear-gradient(135deg, #071633 0%, #0a0f24 100%)' }}>
      <Canvas
        camera={{ 
          position: [0, 0, 8], 
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={0.2} color="#071633" />
        <pointLight 
          position={[5, 5, 5]} 
          intensity={1} 
          color="#00e0ff"
          distance={20}
          decay={2}
        />
        <pointLight 
          position={[-5, -5, -5]} 
          intensity={0.5} 
          color="#00ffff"
          distance={15}
          decay={2}
        />

        {/* Main Digital Sphere */}
        <DigitalSphere />

        {/* Outer glow effect */}
        <mesh>
          <sphereGeometry args={[4, 32, 32]} />
          <meshBasicMaterial
            color="#00e0ff"
            transparent
            opacity={0.05}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Post-processing effects would go here */}
      </Canvas>

      {/* Additional glow overlay */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '60vmin',
          height: '60vmin',
          background: `radial-gradient(circle, 
            rgba(0, 224, 255, 0.15) 0%, 
            rgba(0, 255, 255, 0.08) 40%, 
            transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
      />
    </div>
  )
}

export default DigitalSphere3D