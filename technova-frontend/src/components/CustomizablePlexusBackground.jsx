import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, Line } from '@react-three/drei';
import * as THREE from 'three';

// Configurable plexus network generator
const PlexusConfigurations = {
  // Shape configurations
  shapes: {
    fracturedChaotic: (nodeCount) => {
      const nodes = [];
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
          // Crystalline formations
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
        nodes.push([x, y, z]);
      }
      return nodes;
    },
    
    symmetricalSphere: (nodeCount) => {
      const nodes = [];
      const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
      
      for (let i = 0; i < nodeCount; i++) {
        const y = 1 - (i / (nodeCount - 1)) * 2;
        const radius = Math.sqrt(1 - y * y) * 1.5;
        const theta = phi * i;
        
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        nodes.push([x, y * 1.5, z]);
      }
      return nodes;
    },
    
    wireframeCube: (nodeCount) => {
      const nodes = [];
      const edgeNodes = Math.floor(Math.cbrt(nodeCount));
      
      for (let x = 0; x < edgeNodes; x++) {
        for (let y = 0; y < edgeNodes; y++) {
          for (let z = 0; z < edgeNodes; z++) {
            // Only create nodes on the cube edges/faces
            if (x === 0 || x === edgeNodes - 1 || 
                y === 0 || y === edgeNodes - 1 || 
                z === 0 || z === edgeNodes - 1) {
              nodes.push([
                (x / (edgeNodes - 1) - 0.5) * 2,
                (y / (edgeNodes - 1) - 0.5) * 2,
                (z / (edgeNodes - 1) - 0.5) * 2
              ]);
            }
          }
        }
      }
      return nodes;
    },
    
    chaoticCloud: (nodeCount) => {
      const nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        // Completely random distribution with some clustering
        const clusterCenter = [
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ];
        
        const x = clusterCenter[0] + (Math.random() - 0.5) * 1.5;
        const y = clusterCenter[1] + (Math.random() - 0.5) * 1.5;
        const z = clusterCenter[2] + (Math.random() - 0.5) * 1.5;
        
        nodes.push([x, y, z]);
      }
      return nodes;
    },
    
    concentricRings: (nodeCount) => {
      const nodes = [];
      const rings = 5;
      const nodesPerRing = Math.floor(nodeCount / rings);
      
      for (let ring = 0; ring < rings; ring++) {
        const radius = (ring + 1) * 0.3;
        for (let i = 0; i < nodesPerRing; i++) {
          const angle = (i / nodesPerRing) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = (Math.random() - 0.5) * 0.5;
          nodes.push([x, y, z]);
        }
      }
      return nodes;
    }
  },
  
  // Color configurations
  colorSchemes: {
    cyanTurquoise: (depth) => {
      const r = 0.0 + depth * 0.2;
      const g = 0.8 + depth * 0.2;
      const b = 1.0 - depth * 0.3;
      return [r, g, b];
    },
    
    fieryOrange: (depth) => {
      const r = 1.0;
      const g = 0.4 + depth * 0.6;
      const b = 0.0 + depth * 0.3;
      return [r, g, b];
    },
    
    synthwavePink: (depth) => {
      const r = 1.0 - depth * 0.2;
      const g = 0.0 + depth * 0.4;
      const b = 0.8 + depth * 0.2;
      return [r, g, b];
    },
    
    cyberpunkGreen: (depth) => {
      const r = 0.8 - depth * 0.6;
      const g = 1.0;
      const b = 0.0 + depth * 0.4;
      return [r, g, b];
    },
    
    iceBlue: (depth) => {
      const r = 0.7 + depth * 0.3;
      const g = 0.9 + depth * 0.1;
      const b = 1.0;
      return [r, g, b];
    }
  },
  
  // Background configurations
  backgrounds: {
    darkTealNavy: `
      radial-gradient(circle at 30% 30%, rgba(0, 77, 77, 0.8) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(0, 51, 102, 0.6) 0%, transparent 50%),
      linear-gradient(135deg, 
        rgb(13, 42, 64) 0%, 
        rgb(0, 51, 77) 25%,
        rgb(0, 64, 77) 50%,
        rgb(13, 77, 64) 75%,
        rgb(0, 38, 64) 100%
      )
    `,
    
    charcoalBlack: `
      radial-gradient(circle at 25% 25%, rgba(51, 51, 51, 0.3) 0%, transparent 50%),
      linear-gradient(135deg, 
        rgb(13, 13, 13) 0%, 
        rgb(26, 26, 26) 50%,
        rgb(0, 0, 0) 100%
      )
    `,
    
    deepIndigo: `
      radial-gradient(circle at 40% 30%, rgba(75, 0, 130, 0.4) 0%, transparent 60%),
      linear-gradient(135deg, 
        rgb(25, 25, 112) 0%, 
        rgb(72, 61, 139) 25%,
        rgb(75, 0, 130) 50%,
        rgb(25, 25, 112) 100%
      )
    `,
    
    darkGrittyGray: `
      radial-gradient(circle at 20% 80%, rgba(64, 64, 64, 0.3) 0%, transparent 50%),
      linear-gradient(135deg, 
        rgb(32, 32, 32) 0%, 
        rgb(48, 48, 48) 30%,
        rgb(24, 24, 24) 70%,
        rgb(16, 16, 16) 100%
      )
    `,
    
    deepPurple: `
      radial-gradient(circle at 60% 40%, rgba(128, 0, 128, 0.3) 0%, transparent 50%),
      linear-gradient(135deg, 
        rgb(25, 0, 51) 0%, 
        rgb(51, 0, 102) 50%,
        rgb(75, 0, 130) 100%
      )
    `
  }
};

// Enhanced shader with customizable line styles
const CustomPlexusShader = {
  vertex: `
    attribute float opacity;
    attribute vec3 color;
    attribute float size;
    varying float vOpacity;
    varying vec3 vColor;
    varying float vSize;
    
    void main() {
      vOpacity = opacity;
      vColor = color;
      vSize = size;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = size;
    }
  `,
  fragment: `
    varying float vOpacity;
    varying vec3 vColor;
    varying float vSize;
    
    void main() {
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);
      
      // Thin sharp style
      float alpha = 1.0 - smoothstep(0.0, 0.4, dist);
      alpha *= alpha; // Sharper edges
      
      gl_FragColor = vec4(vColor, vOpacity * alpha);
    }
  `
};

// Generate network with configuration
function generateConfigurableNetwork(
  nodeCount = 200, 
  shapeType = 'fracturedChaotic',
  colorScheme = 'cyanTurquoise',
  connectionDistance = 0.3,
  maxConnections = 8
) {
  const shapeGenerator = PlexusConfigurations.shapes[shapeType];
  const colorGenerator = PlexusConfigurations.colorSchemes[colorScheme];
  
  if (!shapeGenerator || !colorGenerator) {
    console.warn('Invalid shape or color scheme specified');
    return { nodes: [], connections: [] };
  }
  
  const nodePositions = shapeGenerator(nodeCount);
  const nodes = nodePositions.map((position, i) => {
    const depth = (position[2] + 2) / 4; // Normalize z to 0-1
    const color = colorGenerator(depth);
    
    return {
      position,
      color,
      opacity: 0.6 + Math.random() * 0.4,
      size: 1.5 + Math.random() * 1.0
    };
  });
  
  // Create connections
  const connections = [];
  const connectionLines = [];
  
  nodes.forEach((node, i) => {
    let connectionCount = 0;
    
    nodes.forEach((otherNode, j) => {
      if (i !== j && connectionCount < maxConnections) {
        const distance = Math.sqrt(
          Math.pow(node.position[0] - otherNode.position[0], 2) +
          Math.pow(node.position[1] - otherNode.position[1], 2) +
          Math.pow(node.position[2] - otherNode.position[2], 2)
        );
        
        if (distance < connectionDistance) {
          const connectionExists = connections.some(conn => 
            (conn.start === i && conn.end === j) || (conn.start === j && conn.end === i)
          );
          
          if (!connectionExists) {
            connections.push({ start: i, end: j, distance });
            
            const linePositions = [
              ...node.position,
              ...otherNode.position
            ];
            
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

// Configurable plexus component
function ConfigurablePlexus({ 
  nodeCount = 200, 
  animationSpeed = 0.2,
  shapeType = 'fracturedChaotic',
  colorScheme = 'cyanTurquoise',
  connectionDistance = 0.3,
  maxConnections = 8,
  lineWidth = 1
}) {
  const meshRef = useRef();
  const lineGroupRef = useRef();
  
  const networkData = useMemo(() => 
    generateConfigurableNetwork(nodeCount, shapeType, colorScheme, connectionDistance, maxConnections), 
    [nodeCount, shapeType, colorScheme, connectionDistance, maxConnections]
  );
  
  const { nodePositions, nodeColors, nodeOpacities, nodeSizes } = useMemo(() => {
    const positions = new Float32Array(networkData.nodes.length * 3);
    const colors = new Float32Array(networkData.nodes.length * 3);
    const opacities = new Float32Array(networkData.nodes.length);
    const sizes = new Float32Array(networkData.nodes.length);
    
    networkData.nodes.forEach((node, i) => {
      positions[i * 3] = node.position[0];
      positions[i * 3 + 1] = node.position[1];
      positions[i * 3 + 2] = node.position[2];
      
      colors[i * 3] = node.color[0];
      colors[i * 3 + 1] = node.color[1];
      colors[i * 3 + 2] = node.color[2];
      
      opacities[i] = node.opacity;
      sizes[i] = node.size;
    });
    
    return { nodePositions: positions, nodeColors: colors, nodeOpacities: opacities, nodeSizes: sizes };
  }, [networkData]);
  
  useFrame((state) => {
    if (meshRef.current && lineGroupRef.current) {
      const time = state.clock.elapsedTime * animationSpeed;
      
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
          <bufferAttribute
            attach="attributes-size"
            array={nodeSizes}
            count={nodeSizes.length}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={CustomPlexusShader.vertex}
          fragmentShader={CustomPlexusShader.fragment}
          transparent
          vertexColors
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      <group ref={lineGroupRef}>
        {networkData.connections.map((connection, index) => (
          <Line
            key={index}
            points={[
              [connection.positions[0], connection.positions[1], connection.positions[2]],
              [connection.positions[3], connection.positions[4], connection.positions[5]]
            ]}
            color={new THREE.Color(connection.color[0], connection.color[1], connection.color[2])}
            lineWidth={lineWidth}
            transparent
            opacity={connection.opacity}
          />
        ))}
      </group>
    </>
  );
}

// Main customizable component
export default function CustomizablePlexusBackground({ 
  shapeType = 'fracturedChaotic',
  colorScheme = 'cyanTurquoise',
  backgroundStyle = 'darkTealNavy',
  nodeCount = 200,
  animationSpeed = 0.2,
  connectionDistance = 0.3,
  maxConnections = 8,
  lineWidth = 1
}) {
  const backgroundCSS = PlexusConfigurations.backgrounds[backgroundStyle] || 
                       PlexusConfigurations.backgrounds.darkTealNavy;
  
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ background: backgroundCSS }}
      />
      
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
        <ambientLight intensity={0.2} />
        <pointLight position={[2, 2, 2]} intensity={0.5} />
        <pointLight position={[-2, -1, 1]} intensity={0.3} />
        
        <ConfigurablePlexus 
          nodeCount={nodeCount}
          animationSpeed={animationSpeed}
          shapeType={shapeType}
          colorScheme={colorScheme}
          connectionDistance={connectionDistance}
          maxConnections={maxConnections}
          lineWidth={lineWidth}
        />
      </Canvas>
      
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, 
              transparent 30%, 
              rgba(0, 0, 0, 0.2) 70%, 
              rgba(0, 0, 0, 0.4) 100%
            )
          `,
          zIndex: 2
        }}
      />
    </div>
  );
}