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
    
    // Enhanced animated gradient with flowing colors
    float gradientPos = (sin(time * 0.4 + vPosition.y * 1.8) + 1.0) * 0.5;
    float flowEffect = sin(time * 0.6 + vPosition.x * 3.0 + vPosition.z * 2.0) * 0.3 + 0.7;
    
    vec3 colorA = mix(color1, color2, smoothstep(0.0, 0.5, gradientPos * flowEffect));
    vec3 finalColor = mix(colorA, color3, smoothstep(0.5, 1.0, gradientPos));
    
    // Dynamic glow with multiple wave patterns
    float wave1 = sin(time * 1.8 + vPosition.x * 2.5);
    float wave2 = cos(time * 2.3 + vPosition.y * 3.0);
    float wave3 = sin(time * 1.2 + vPosition.z * 2.8);
    
    float glow = 0.3 + 0.2 * wave1 + 0.15 * wave2 + 0.1 * wave3;
    
    // Enhanced intensity with flowing energy effect
    float energyFlow = sin(time * 0.8 + length(vPosition) * 0.5) * 0.2 + 0.8;
    float intensity = vAlpha * glow * energyFlow * (0.4 + 0.2 * depthFactor);
    
    gl_FragColor = vec4(finalColor * intensity, intensity * 0.6);
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
    
    // Subtle pulsing glow
    alpha *= 0.5 + 0.15 * sin(gl_FragCoord.x * 0.01 + gl_FragCoord.y * 0.01);
    
    gl_FragColor = vec4(vColor, alpha * 0.6);
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
      
      // Dimmed multi-dimensional color variation
      const r = 0.0 + t * 0.15 + angle * 0.05;
      const g = 0.3 + t * 0.2 + Math.sin(angle * Math.PI * 2) * 0.08;
      const b = 0.4 + t * 0.15 + Math.cos(angle * Math.PI * 3) * 0.1;
      
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
        color1: { value: new THREE.Color(0x003355) }, // Darker cyan
        color2: { value: new THREE.Color(0x004466) }, // Darker turquoise  
        color3: { value: new THREE.Color(0x001133) }, // Much deeper blue
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
  
  // Optimized 3D animations with smooth performance
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Optimized sphere rotation with smooth easing
    if (sphereRef.current) {
      // Smooth primary rotation with reduced calculations
      const rotationSpeed = 0.1;
      const breatheSpeed = 0.3;
      
      sphereRef.current.rotation.x = Math.sin(time * 0.05) * 0.1 + time * 0.02;
      sphereRef.current.rotation.y = time * rotationSpeed;
      sphereRef.current.rotation.z = Math.cos(time * 0.04) * 0.06;
      
      // Smooth breathing scale animation with easing
      const breathe = 1 + Math.sin(time * breatheSpeed) * 0.015;
      sphereRef.current.scale.setScalar(breathe);
      
      // Gentle floating motion
      sphereRef.current.position.y = Math.sin(time * 0.2) * 0.08;
      sphereRef.current.position.x = Math.cos(time * 0.15) * 0.04;
    }
    
    // Ultra-optimized particle animation with smooth interpolation
    if (particlesRef.current && Math.floor(time * 60) % 3 === 0) { // Update every 3 frames at 60fps
      const positions = particlesRef.current.geometry.attributes.position.array;
      const originalPositions = particlePositions;
      
      // Use smoother, more efficient calculations
      const timeScale = time * 0.2;
      
      for (let i = 0; i < positions.length; i += 9) { // Update every 3rd particle for performance
        const index = i / 3;
        const offset = index * 0.1;
        
        // Ultra-smooth floating with bezier-like curves
        const floatX = Math.sin(timeScale + offset) * 0.012;
        const floatY = Math.cos(timeScale * 0.8 + offset) * 0.015;
        const floatZ = Math.sin(timeScale * 1.2 + offset) * 0.01;
        
        // Apply smooth interpolation
        positions[i] = originalPositions[i] + floatX;
        positions[i + 1] = originalPositions[i + 1] + floatY;
        positions[i + 2] = originalPositions[i + 2] + floatZ;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    // Update shader uniforms with animation
    if (linesRef.current) {
      linesRef.current.material.uniforms.time.value = time;
      linesRef.current.material.uniforms.cameraPosition.value.copy(state.camera.position);
      
      // Dynamic line animations with organic pulsing
      const positions = linesRef.current.geometry.attributes.position.array;
      const alphas = linesRef.current.geometry.attributes.alpha.array;
      
      for (let i = 0; i < alphas.length; i++) {
        const lineIndex = Math.floor(i / 2);
        
        // Multiple frequency pulsing for organic feel
        const pulseFreq1 = 0.5 + (lineIndex % 10) * 0.1;
        const pulseFreq2 = 0.8 + (lineIndex % 7) * 0.15;
        const pulse = Math.sin(time * pulseFreq1 + lineIndex * 0.5) * 0.25 + 
                     Math.cos(time * pulseFreq2 + lineIndex * 0.3) * 0.15 + 0.6;
        
        alphas[i] = Math.max(0.1, pulse);
        
        // Subtle position morphing for living network effect
        if (i % 6 === 0) { // Only animate every 6th vertex for performance
          const posIndex = i * 3;
          const morphAmount = Math.sin(time * 0.3 + lineIndex * 0.1) * 0.02;
          positions[posIndex] += morphAmount;
          positions[posIndex + 1] += Math.cos(time * 0.25 + lineIndex * 0.12) * 0.015;
          positions[posIndex + 2] += Math.sin(time * 0.35 + lineIndex * 0.08) * 0.018;
        }
      }
      
      linesRef.current.geometry.attributes.alpha.needsUpdate = true;
      linesRef.current.geometry.attributes.position.needsUpdate = true;
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

function CameraAnimation() {
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const camera = state.camera;
    
    // Smooth, subtle camera movement for immersive experience
    const radius = 10;
    const elevation = Math.sin(time * 0.03) * 0.3; // Reduced frequency for smoothness
    const azimuth = time * 0.015; // Slower rotation for elegance
    
    // Gentle circular camera movement
    const radiusVariation = 1 + Math.sin(time * 0.02) * 0.05; // Reduced variation
    camera.position.x = Math.cos(azimuth) * radius * radiusVariation;
    camera.position.y = elevation + Math.cos(time * 0.025) * 0.2;
    camera.position.z = Math.sin(azimuth) * radius * radiusVariation;
    
    // Smooth look-at with minimal offset
    camera.lookAt(
      Math.sin(time * 0.05) * 0.1,
      Math.cos(time * 0.04) * 0.05,
      0
    );
  });
  
  return null;
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
      
      // Dimmed color variety with darker gradients
      const t = Math.random();
      colors[i * 3] = 0.0 + t * 0.2;     // R: 0.0 to 0.2
      colors[i * 3 + 1] = 0.2 + t * 0.25; // G: 0.2 to 0.45  
      colors[i * 3 + 2] = 0.3 + t * 0.2; // B: 0.3 to 0.5
      
      sizes[i] = 0.8 + Math.random() * 2.2;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (particlesRef.current) {
      // Enhanced multi-layered rotation with orbital movement
      particlesRef.current.rotation.y = time * 0.02 + Math.sin(time * 0.1) * 0.05;
      particlesRef.current.rotation.x = Math.sin(time * 0.015) * 0.12 + time * 0.008;
      particlesRef.current.rotation.z = Math.cos(time * 0.012) * 0.08;
      
      // Orbital movement around the main sphere
      const orbitRadius = 0.3;
      particlesRef.current.position.x = Math.cos(time * 0.1) * orbitRadius;
      particlesRef.current.position.z = Math.sin(time * 0.1) * orbitRadius;
      particlesRef.current.position.y = Math.sin(time * 0.08) * 0.2;
      
      // Animate individual particle positions for floating effect
      const positions = particlesRef.current.geometry.attributes.position.array;
      const colors = particlesRef.current.geometry.attributes.color.array;
      const sizes = particlesRef.current.geometry.attributes.size.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const index = i / 3;
        // Create flowing movement
        const waveX = Math.sin(time * 0.2 + index * 0.1) * 0.5;
        const waveY = Math.cos(time * 0.15 + index * 0.2) * 0.3;
        const waveZ = Math.sin(time * 0.18 + index * 0.15) * 0.4;
        
        positions[i] += waveX * 0.01;
        positions[i + 1] += waveY * 0.01;
        positions[i + 2] += waveZ * 0.01;
        
        // Animate particle sizes for pulsing effect
        const sizePulse = 1 + Math.sin(time * 1.5 + index * 0.5) * 0.3;
        sizes[index] = (0.8 + Math.random() * 2.2) * sizePulse;
        
        // Subtle color animation
        const colorShift = Math.sin(time * 0.5 + index * 0.3) * 0.1;
        colors[i + 1] += colorShift * 0.1; // Green channel animation
        colors[i + 2] += colorShift * 0.08; // Blue channel animation
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.size.needsUpdate = true;
      particlesRef.current.geometry.attributes.color.needsUpdate = true;
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
      {/* Darker gradient background for better contrast */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 20%, rgba(0, 60, 80, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 70% 80%, rgba(0, 90, 120, 0.1) 0%, transparent 70%),
            linear-gradient(135deg, #000000 0%, #0a0a0a 20%, #0f1419 40%, #1a252f 60%, #000510 80%, #000000 100%)
          `
        }}
      />
      
      {/* 3D Canvas with animated camera */}
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
        {/* Dimmed lighting setup for less brightness */}
        <ambientLight intensity={0.2} color="#102030" />
        
        {/* Primary key light - much dimmer */}
        <pointLight 
          position={[12, 8, 15]} 
          intensity={0.6} 
          color="#004466" 
          distance={30}
          decay={2}
        />
        
        {/* Secondary fill light - subtle */}
        <pointLight 
          position={[-8, -6, 10]} 
          intensity={0.3} 
          color="#003344" 
          distance={25}
          decay={2}
        />
        
        {/* Rim light for depth - very subtle */}
        <pointLight 
          position={[0, 0, -10]} 
          intensity={0.4} 
          color="#002233" 
          distance={20}
          decay={1.5}
        />
        
        {/* Main sphere network */}
        <AppDostSphere />
        
        {/* Floating background particles */}
        <FloatingParticles />
        
        {/* Camera animation for immersive movement */}
        <CameraAnimation />
        
        {/* Enhanced fog for atmospheric depth */}
        <fog attach="fog" args={['#000510', 8, 25]} />
      </Canvas>
      
      {/* Subtle glow overlay with darker tones */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at center, transparent 0%, rgba(0,60,100,0.04) 50%, rgba(0,40,80,0.06) 80%, transparent 100%),
            radial-gradient(circle at 60% 40%, rgba(0,50,80,0.03) 0%, transparent 70%),
            radial-gradient(circle at 40% 60%, rgba(20,60,90,0.02) 0%, transparent 80%)
          `,
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Strong dark vignette for focus and contrast */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.6) 100%),
            linear-gradient(135deg, rgba(0,0,0,0.2) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.2) 100%)
          `,
          mixBlendMode: 'multiply'
        }}
      />
    </div>
  );
}