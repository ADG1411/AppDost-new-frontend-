import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Enhanced vertex shader for glowing lines
const vertexShader = `
  attribute float alpha;
  attribute float distanceToCamera;
  varying float vAlpha;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying float vDistanceToCamera;
  
  void main() {
    vAlpha = alpha;
    vPosition = position;
    vDistanceToCamera = distanceToCamera;
    
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Enhanced fragment shader for glowing lines
const fragmentShader = `
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform float time;
  uniform vec3 cameraPosition;
  varying float vAlpha;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying float vDistanceToCamera;
  
  void main() {
    // Distance from camera for depth-based effects
    float distance = length(vWorldPosition - cameraPosition);
    float depthFactor = 1.0 - clamp(distance / 15.0, 0.0, 1.0);
    
    // Create animated gradient with three colors
    float gradientPos = (sin(time * 0.3 + vPosition.y * 1.5) + 1.0) * 0.5;
    vec3 colorA = mix(color1, color2, smoothstep(0.0, 0.5, gradientPos));
    vec3 finalColor = mix(colorA, color3, smoothstep(0.5, 1.0, gradientPos));
    
    // Enhanced glow with multiple frequencies
    float glow = 0.6 + 0.3 * sin(time * 1.5 + vPosition.x * 2.0) + 
                0.1 * sin(time * 3.0 + vPosition.z * 4.0);
    
    // Intensity based on connection strength and depth
    float intensity = vAlpha * glow * (0.7 + 0.3 * depthFactor);
    
    gl_FragColor = vec4(finalColor * intensity, intensity * 0.9);
  }
`;

// Particle vertex shader
const particleVertexShader = `
  attribute float size;
  attribute vec3 color;
  varying vec3 vColor;
  
  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Particle fragment shader
const particleFragmentShader = `
  varying vec3 vColor;
  
  void main() {
    float distance = length(gl_PointCoord - vec2(0.5));
    float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
    
    // Add pulsing glow
    alpha *= 0.8 + 0.2 * sin(gl_FragCoord.x * 0.01 + gl_FragCoord.y * 0.01);
    
    gl_FragColor = vec4(vColor, alpha * 0.9);
  }
`;

function AppDostSphere() {
  const sphereRef = useRef();
  const particlesRef = useRef();
  const linesRef = useRef();
  
  // Create sphere points using enhanced Fibonacci spiral for perfect distribution
  const { positions, connections, particlePositions, particleColors, particleSizes, alphas, distances } = useMemo(() => {
    const positions = [];
    const connections = [];
    const particlePositions = [];
    const particleColors = [];
    const particleSizes = [];
    const alphas = [];
    const distances = [];
    
    const numPoints = 150; // Increased for more detailed network
    const radius = 4.5;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    
    // Generate points on sphere using Fibonacci spiral
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      
      points.push(new THREE.Vector3(x * radius, y * radius, z * radius));
    }
    
    // Create enhanced connections with varying strengths
    const maxDistance = 2.3; // Slightly increased for better connectivity
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const distance = points[i].distanceTo(points[j]);
        if (distance < maxDistance) {
          // Add line vertices
          positions.push(points[i].x, points[i].y, points[i].z);
          positions.push(points[j].x, points[j].y, points[j].z);
          
          // Calculate connection strength based on distance
          const strength = 1.0 - (distance / maxDistance);
          const alpha = 0.4 + strength * 0.6; // Vary alpha based on connection strength
          
          // Add alpha values for both vertices of the line
          alphas.push(alpha, alpha);
          
          // Add distance to camera for depth effects (will be updated in render)
          distances.push(0, 0);
          
          // Add connection data
          connections.push(i, j);
        }
      }
    }
    
    // Create enhanced glowing particles at nodes
    for (let i = 0; i < points.length; i++) {
      particlePositions.push(points[i].x, points[i].y, points[i].z);
      
      // Enhanced three-tone gradient: cyan → turquoise → bright blue
      const t = (points[i].y + radius) / (radius * 2);
      const angle = Math.atan2(points[i].z, points[i].x) / (Math.PI * 2) + 0.5;
      
      // Multi-dimensional color variation
      const r = 0.0 + t * 0.3 + angle * 0.1;
      const g = 0.7 + t * 0.3 + Math.sin(angle * Math.PI * 2) * 0.1;
      const b = 0.8 + t * 0.2 + Math.cos(angle * Math.PI * 3) * 0.15;
      
      particleColors.push(r, g, b);
      
      // Varying particle sizes based on position
      const size = 3 + Math.random() * 4 + t * 2;
      particleSizes.push(size);
    }
    
    return {
      positions: new Float32Array(positions),
      connections,
      particlePositions: new Float32Array(particlePositions),
      particleColors: new Float32Array(particleColors),
      particleSizes: new Float32Array(particleSizes),
      alphas: new Float32Array(alphas),
      distances: new Float32Array(distances)
    };
  }, []);
  
  // Create enhanced line materials
  const lineMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        color1: { value: new THREE.Color(0x00ccff) }, // Bright cyan
        color2: { value: new THREE.Color(0x40e0d0) }, // Turquoise
        color3: { value: new THREE.Color(0x0099cc) }, // Deep blue
        time: { value: 0 },
        cameraPosition: { value: new THREE.Vector3() }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }, []);
  
  // Create particle material
  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }, []);
  
  // Enhanced animation
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Smooth, elegant rotation
    if (sphereRef.current) {
      sphereRef.current.rotation.x = Math.sin(time * 0.08) * 0.1 + time * 0.05;
      sphereRef.current.rotation.y = time * 0.12;
      sphereRef.current.rotation.z = Math.cos(time * 0.06) * 0.05;
    }
    
    // Update shader uniforms
    if (linesRef.current) {
      linesRef.current.material.uniforms.time.value = time;
      linesRef.current.material.uniforms.cameraPosition.value.copy(state.camera.position);
    }
  });
  
  return (
    <group ref={sphereRef}>
      {/* Enhanced Network Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={positions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-alpha"
            array={alphas}
            count={alphas.length}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-distanceToCamera"
            array={distances}
            count={distances.length}
            itemSize={1}
          />
        </bufferGeometry>
        <primitive object={lineMaterial} />
      </lineSegments>
      
      {/* Glowing Particles at Nodes */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particlePositions}
            count={particlePositions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={particleColors}
            count={particleColors.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            array={particleSizes}
            count={particleSizes.length}
            itemSize={1}
          />
        </bufferGeometry>
        <primitive object={particleMaterial} />
      </points>
    </group>
  );
}

function FloatingParticles() {
  const particlesRef = useRef();
  
  const { positions, colors, sizes } = useMemo(() => {
    const count = 300; // Increased particle count
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Enhanced distribution with multiple layers
      const layer = Math.floor(i / 100);
      const baseRadius = 7 + layer * 2;
      const radius = baseRadius + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Enhanced color variety with subtle gradients
      const t = Math.random();
      colors[i * 3] = 0.0 + t * 0.4;     // R: 0.0 to 0.4
      colors[i * 3 + 1] = 0.6 + t * 0.4; // G: 0.6 to 1.0  
      colors[i * 3 + 2] = 0.7 + t * 0.3; // B: 0.7 to 1.0
      
      sizes[i] = 0.8 + Math.random() * 2.2;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (particlesRef.current) {
      // Multi-layered rotation for depth
      particlesRef.current.rotation.y = time * 0.015;
      particlesRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
      particlesRef.current.rotation.z = Math.cos(time * 0.008) * 0.05;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={colors.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          array={sizes}
          count={sizes.length}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function AppDostSphereBackground() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Enhanced gradient background with more depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 20%, rgba(0, 120, 150, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(0, 180, 200, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, #0a1428 0%, #1a4a52 30%, #0d2b35 70%, #051219 100%)
          `
        }}
      />
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ 
          position: [0, 0, 10], 
          fov: 60,
          near: 0.1,
          far: 100
        }}
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%'
        }}
      >
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.4} color="#20b2aa" />
        
        {/* Primary key light */}
        <pointLight 
          position={[12, 8, 15]} 
          intensity={1.2} 
          color="#00e6ff" 
          distance={30}
          decay={2}
        />
        
        {/* Secondary fill light */}
        <pointLight 
          position={[-8, -6, 10]} 
          intensity={0.6} 
          color="#40e0d0" 
          distance={25}
          decay={2}
        />
        
        {/* Rim light for depth */}
        <pointLight 
          position={[0, 0, -10]} 
          intensity={0.8} 
          color="#0099cc" 
          distance={20}
          decay={1.5}
        />
        
        {/* Main sphere network */}
        <AppDostSphere />
        
        {/* Floating background particles */}
        <FloatingParticles />
        
        {/* Enhanced fog for atmospheric depth */}
        <fog attach="fog" args={['#0d2b35', 12, 30]} />
      </Canvas>
      
      {/* Enhanced glow overlay with multiple layers */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at center, transparent 0%, rgba(0,230,255,0.08) 40%, rgba(64,224,208,0.12) 80%, transparent 100%),
            radial-gradient(circle at 60% 40%, rgba(0,200,230,0.06) 0%, transparent 60%),
            radial-gradient(circle at 40% 60%, rgba(100,240,220,0.04) 0%, transparent 70%)
          `,
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Subtle vignette for focus */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, transparent 60%, rgba(5,18,25,0.3) 100%)',
          mixBlendMode: 'multiply'
        }}
      />
    </div>
  );
}