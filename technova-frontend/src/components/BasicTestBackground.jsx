/**
 * Basic Test Network - Absolutely Visible
 * Simple test to ensure Three.js is working
 */
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

// Simple spinning cube to test Three.js
const TestCube = () => {
  const cubeRef = useRef()

  useFrame((state) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x = state.clock.elapsedTime
      cubeRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshBasicMaterial color="#00ffff" />
    </mesh>
  )
}

// Basic test background
const BasicTestBackground = () => {
  return (
    <div 
      style={{ 
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #071633 0%, #0a0f24 100%)',
        position: 'relative'
      }}
    >
      {/* Test message */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: '#00ffff',
        fontSize: '24px',
        zIndex: 10
      }}>
        Testing Three.js Visibility
      </div>

      <Canvas
        camera={{ position: [0, 0, 5] }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <TestCube />
      </Canvas>

      {/* Visible overlay */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        color: '#00ffff',
        fontSize: '16px'
      }}>
        You should see a spinning cyan cube
      </div>
    </div>
  )
}

export default BasicTestBackground