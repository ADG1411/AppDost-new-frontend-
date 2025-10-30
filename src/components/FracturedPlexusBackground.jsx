import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, Line } from '@react-three/drei';
import * as THREE from 'three';

// Shader for the fractured plexus lines with cyan-blue to turquoise gradient
const FracturedPlexusShader = {
  vertex: `
    attribute float opacity;
    attribute vec3 color;
    varying float vOpacity;
    varying vec3 vColor;
    
    void main() {
      vOpacity = opacity;
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = 2.0;
    }
  `,
  fragment: `
    varying float vOpacity;
    varying vec3 vColor;
    
    void main() {
      // Create subtle glow effect
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      
      gl_FragColor = vec4(vColor, vOpacity * alpha);
    }
  `
};

// Generate chaotic, crystalline network structure
function generateFracturedNetwork(nodeCount = 200, connectionDistance = 0.3) {
  const nodes = [];
  const connections = [];
  
  // Create chaotic, asymmetrical distribution using multiple random clusters
  for (let i = 0; i < nodeCount; i++) {
    let x, y, z;
    
    if (i < nodeCount * 0.3) {
      // Dense central cluster
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.5;
      x = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.4;
      y = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.4;
      z = (Math.random() - 0.5) * 0.6;
    } else if (i < nodeCount * 0.6) {
      // Scattered outer fragments
      x = (Math.random() - 0.5) * 3;
      y = (Math.random() - 0.5) * 3;
      z = (Math.random() - 0.5) * 3;
    } else {
      // Crystalline formations - geometric clusters
      const clusterIndex = Math.floor(Math.random() * 5);
      const clusterCenter = [
        [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2],
        [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2],
        [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2],
        [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2],
        [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2]
      ][clusterIndex];
      
      x = clusterCenter[0] + (Math.random() - 0.5) * 0.3;
      y = clusterCenter[1] + (Math.random() - 0.5) * 0.3;
      z = clusterCenter[2] + (Math.random() - 0.5) * 0.3;
    }
    
    // Create gradient colors from cyan-blue to turquoise-green
    const depth = (z + 2) / 4; // Normalize z to 0-1
    const r = 0.0 + depth * 0.2; // Dark blue to slight red component
    const g = 0.8 + depth * 0.2; // High green component
    const b = 1.0 - depth * 0.3; // Full blue to turquoise
    
    nodes.push({
      position: [x, y, z],
      color: [r, g, b],
      opacity: 0.6 + Math.random() * 0.4
    });
  }
  
  // Create asymmetrical, chaotic connections
  const connectionLines = [];
  nodes.forEach((node, i) => {
    const nodeConnections = [];
    let connectionCount = 0;
    
    nodes.forEach((otherNode, j) => {
      if (i !== j && connectionCount < 8) {
        const distance = Math.sqrt(
          Math.pow(node.position[0] - otherNode.position[0], 2) +
          Math.pow(node.position[1] - otherNode.position[1], 2) +
          Math.pow(node.position[2] - otherNode.position[2], 2)
        );
        
        // Variable connection distance for chaotic structure
        const dynamicDistance = connectionDistance + Math.random() * 0.4;
        
        if (distance < dynamicDistance) {
          // Avoid duplicate connections
          const connectionExists = connections.some(conn => 
            (conn.start === i && conn.end === j) || (conn.start === j && conn.end === i)
          );
          
          if (!connectionExists) {
            connections.push({ start: i, end: j, distance });
            
            // Create line geometry
            const linePositions = [
              ...node.position,
              ...otherNode.position
            ];
            
            // Blend colors for the line
            const lineColor = [
              (node.color[0] + otherNode.color[0]) / 2,
              (node.color[1] + otherNode.color[1]) / 2,
              (node.color[2] + otherNode.color[2]) / 2
            ];
            
            connectionLines.push({
              positions: linePositions,
              color: lineColor,
              opacity: Math.max(node.opacity, otherNode.opacity) * 0.7
            });
            
            connectionCount++;
          }
        }
      }
    });
  });
  
  return { nodes, connections: connectionLines };
}

// Fractured plexus network component
function FracturedPlexus({ nodeCount = 200, animationSpeed = 0.3 }) {
  const meshRef = useRef();
  const lineGroupRef = useRef();
  
  const networkData = useMemo(() => generateFracturedNetwork(nodeCount), [nodeCount]);
  
  // Create node geometry and materials
  const { nodePositions, nodeColors, nodeOpacities } = useMemo(() => {
    const positions = new Float32Array(networkData.nodes.length * 3);
    const colors = new Float32Array(networkData.nodes.length * 3);
    const opacities = new Float32Array(networkData.nodes.length);
    
    networkData.nodes.forEach((node, i) => {
      positions[i * 3] = node.position[0];
      positions[i * 3 + 1] = node.position[1];
      positions[i * 3 + 2] = node.position[2];
      
      colors[i * 3] = node.color[0];
      colors[i * 3 + 1] = node.color[1];
      colors[i * 3 + 2] = node.color[2];
      
      opacities[i] = node.opacity;
    });
    
    return { nodePositions: positions, nodeColors: colors, nodeOpacities: opacities };
  }, [networkData]);
  
  // Animation
  useFrame((state) => {
    if (meshRef.current && lineGroupRef.current) {
      const time = state.clock.elapsedTime * animationSpeed;
      
      // Subtle rotation for the entire fractured structure
      meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
      meshRef.current.rotation.y = time * 0.05;
      meshRef.current.rotation.z = Math.cos(time * 0.15) * 0.05;
      
      lineGroupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
      lineGroupRef.current.rotation.y = time * 0.05;
      lineGroupRef.current.rotation.z = Math.cos(time * 0.15) * 0.05;
    }
  });
  
  return (
    <>
      {/* Nodes */}
      <Points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={nodePositions}
            count={nodePositions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={nodeColors}
            count={nodeColors.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-opacity"
            array={nodeOpacities}
            count={nodeOpacities.length}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={FracturedPlexusShader.vertex}
          fragmentShader={FracturedPlexusShader.fragment}
          transparent
          vertexColors
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Connection Lines */}
      <group ref={lineGroupRef}>
        {networkData.connections.map((connection, index) => (
          <Line
            key={index}
            points={[
              [connection.positions[0], connection.positions[1], connection.positions[2]],
              [connection.positions[3], connection.positions[4], connection.positions[5]]
            ]}
            color={new THREE.Color(connection.color[0], connection.color[1], connection.color[2])}
            lineWidth={1}
            transparent
            opacity={connection.opacity}
          />
        ))}
      </group>
    </>
  );
}

// Atmosphere particles for depth
function FracturedAtmosphere() {
  const particlesRef = useRef();
  
  const particleData = useMemo(() => {
    const count = 800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const opacities = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Random distribution in larger space
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      
      // Cyan-blue to turquoise gradient
      const intensity = Math.random();
      colors[i * 3] = 0.0 + intensity * 0.3; // Red component
      colors[i * 3 + 1] = 0.7 + intensity * 0.3; // Green component
      colors[i * 3 + 2] = 0.9 + intensity * 0.1; // Blue component
      
      opacities[i] = Math.random() * 0.3;
    }
    
    return { positions, colors, opacities };
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;
      particlesRef.current.rotation.y = time * 0.01;
      particlesRef.current.rotation.x = Math.sin(time * 0.01) * 0.05;
    }
  });
  
  return (
    <Points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={particleData.positions}
          count={particleData.positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={particleData.colors}
          count={particleData.colors.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-opacity"
          array={particleData.opacities}
          count={particleData.opacities.length}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={FracturedPlexusShader.vertex}
        fragmentShader={FracturedPlexusShader.fragment}
        transparent
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Main fractured plexus background component
export default function FracturedPlexusBackground() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Dark teal/navy gradient background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(0, 77, 77, 0.8) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(0, 51, 102, 0.6) 0%, transparent 50%),
            linear-gradient(135deg, 
              rgb(13, 42, 64) 0%, 
              rgb(0, 51, 77) 25%,
              rgb(0, 64, 77) 50%,
              rgb(13, 77, 64) 75%,
              rgb(0, 38, 64) 100%
            )
          `
        }}
      />
      
      {/* Three.js Canvas */}
      <Canvas
        camera={{ 
          position: [0, 0, 5], 
          fov: 60,
          near: 0.1,
          far: 100
        }}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      >
        {/* Subtle ambient lighting */}
        <ambientLight intensity={0.2} color="#004d4d" />
        
        {/* Key light for the network */}
        <pointLight 
          position={[2, 2, 2]} 
          intensity={0.5} 
          color="#00cccc" 
        />
        
        {/* Fill light */}
        <pointLight 
          position={[-2, -1, 1]} 
          intensity={0.3} 
          color="#0099aa" 
        />
        
        {/* Main fractured plexus network */}
        <FracturedPlexus nodeCount={200} animationSpeed={0.2} />
        
        {/* Atmospheric particles */}
        <FracturedAtmosphere />
      </Canvas>
      
      {/* Subtle vignette overlay */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, 
              transparent 30%, 
              rgba(0, 26, 51, 0.3) 70%, 
              rgba(0, 13, 26, 0.6) 100%
            )
          `,
          zIndex: 2
        }}
      />
    </div>
  );
}