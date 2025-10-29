/**
 * Ultra-Precise AppDost Network Recreation
 * Perfect geometric circle with exact node positioning and connections
 */
import { useEffect, useRef, useState } from 'react'

const AppDostPrecision = () => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('resize', updateDimensions)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !dimensions.width || !dimensions.height) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const centerX = dimensions.width / 2
    const centerY = dimensions.height / 2
    const baseRadius = Math.min(dimensions.width, dimensions.height) * 0.25

    // Generate perfect circular network like AppDost
    const generatePerfectCircle = () => {
      const nodes = []
      
      // Main circle nodes (like in AppDost image)
      const mainCircleNodes = 24
      for (let i = 0; i < mainCircleNodes; i++) {
        const angle = (2 * Math.PI * i) / mainCircleNodes
        const x = centerX + baseRadius * Math.cos(angle)
        const y = centerY + baseRadius * Math.sin(angle)
        
        nodes.push({
          x,
          y,
          originalX: x,
          originalY: y,
          radius: 3,
          opacity: 1,
          type: 'main',
          angle: angle,
          id: i
        })
      }

      // Inner ring
      const innerNodes = 12
      for (let i = 0; i < innerNodes; i++) {
        const angle = (2 * Math.PI * i) / innerNodes + Math.PI / innerNodes // offset
        const x = centerX + (baseRadius * 0.6) * Math.cos(angle)
        const y = centerY + (baseRadius * 0.6) * Math.sin(angle)
        
        nodes.push({
          x,
          y,
          originalX: x,
          originalY: y,
          radius: 2.5,
          opacity: 0.9,
          type: 'inner',
          angle: angle,
          id: i + mainCircleNodes
        })
      }

      // Center node
      nodes.push({
        x: centerX,
        y: centerY,
        originalX: centerX,
        originalY: centerY,
        radius: 4,
        opacity: 1,
        type: 'center',
        angle: 0,
        id: 'center'
      })

      // Outer scattered nodes for complexity
      const outerNodes = 16
      for (let i = 0; i < outerNodes; i++) {
        const angle = (2 * Math.PI * i) / outerNodes
        const radiusVar = baseRadius * (1.3 + Math.random() * 0.4)
        const x = centerX + radiusVar * Math.cos(angle)
        const y = centerY + radiusVar * Math.sin(angle)
        
        nodes.push({
          x,
          y,
          originalX: x,
          originalY: y,
          radius: 2,
          opacity: 0.7,
          type: 'outer',
          angle: angle,
          id: i + mainCircleNodes + innerNodes + 1
        })
      }

      return nodes
    }

    const nodes = generatePerfectCircle()
    let time = 0

    const animate = () => {
      // Clear with exact AppDost background color
      ctx.fillStyle = '#0a1628'
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      time += 0.008 // Slow rotation

      // Subtle rotation for main circle only
      nodes.forEach(node => {
        if (node.type === 'main' || node.type === 'inner') {
          const currentRadius = Math.sqrt(
            Math.pow(node.originalX - centerX, 2) + 
            Math.pow(node.originalY - centerY, 2)
          )
          const rotationSpeed = node.type === 'main' ? 0.0003 : -0.0002
          node.angle += rotationSpeed
          node.x = centerX + currentRadius * Math.cos(node.angle)
          node.y = centerY + currentRadius * Math.sin(node.angle)
        }
      })

      // Draw connections with AppDost-style logic
      ctx.lineWidth = 1.5
      ctx.strokeStyle = '#00d4ff'
      
      nodes.forEach((nodeA, i) => {
        nodes.forEach((nodeB, j) => {
          if (i >= j) return
          
          const distance = Math.sqrt(
            Math.pow(nodeA.x - nodeB.x, 2) + 
            Math.pow(nodeA.y - nodeB.y, 2)
          )
          
          let shouldConnect = false
          let maxDistance = 0
          
          // Connection rules like AppDost
          if (nodeA.type === 'center' || nodeB.type === 'center') {
            maxDistance = baseRadius * 0.7
            shouldConnect = distance < maxDistance
          } else if (nodeA.type === nodeB.type && nodeA.type === 'main') {
            maxDistance = baseRadius * 0.8
            shouldConnect = distance < maxDistance
          } else if (
            (nodeA.type === 'main' && nodeB.type === 'inner') ||
            (nodeA.type === 'inner' && nodeB.type === 'main')
          ) {
            maxDistance = baseRadius * 0.5
            shouldConnect = distance < maxDistance
          } else if (nodeA.type === nodeB.type && nodeA.type === 'inner') {
            maxDistance = baseRadius * 0.4
            shouldConnect = distance < maxDistance
          } else if (
            (nodeA.type === 'outer' && (nodeB.type === 'main' || nodeB.type === 'inner')) ||
            (nodeB.type === 'outer' && (nodeA.type === 'main' || nodeA.type === 'inner'))
          ) {
            maxDistance = baseRadius * 0.6
            shouldConnect = distance < maxDistance
          }
          
          if (shouldConnect) {
            const opacity = Math.max(0.2, 1 - (distance / maxDistance))
            
            ctx.globalAlpha = opacity * 0.8
            ctx.shadowColor = '#00d4ff'
            ctx.shadowBlur = 2
            ctx.beginPath()
            ctx.moveTo(nodeA.x, nodeA.y)
            ctx.lineTo(nodeB.x, nodeB.y)
            ctx.stroke()
            ctx.shadowBlur = 0
          }
        })
      })

      // Draw nodes with AppDost-style glow
      nodes.forEach(node => {
        ctx.globalAlpha = node.opacity
        
        // Outer glow
        ctx.shadowColor = '#00d4ff'
        ctx.shadowBlur = 12
        ctx.fillStyle = '#00d4ff'
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()
        
        // Inner bright core
        ctx.shadowBlur = 0
        ctx.fillStyle = node.type === 'center' ? '#ffffff' : '#a0e7ff'
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * 0.5, 0, Math.PI * 2)
        ctx.fill()
      })

      // Mouse interaction with bright green connections (like AppDost)
      const mouseDistance = Math.sqrt(
        Math.pow(mouseRef.current.x - centerX, 2) + 
        Math.pow(mouseRef.current.y - centerY, 2)
      )
      
      if (mouseDistance < baseRadius * 2) {
        ctx.globalAlpha = 0.6
        ctx.strokeStyle = '#39ff14'
        ctx.lineWidth = 2
        ctx.shadowColor = '#39ff14'
        ctx.shadowBlur = 8
        
        nodes.forEach(node => {
          const distanceToMouse = Math.sqrt(
            Math.pow(mouseRef.current.x - node.x, 2) + 
            Math.pow(mouseRef.current.y - node.y, 2)
          )
          
          if (distanceToMouse < 180) {
            ctx.beginPath()
            ctx.moveTo(mouseRef.current.x, mouseRef.current.y)
            ctx.lineTo(node.x, node.y)
            ctx.stroke()
          }
        })
        ctx.shadowBlur = 0
      }

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0" style={{ backgroundColor: '#0a1628' }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        style={{ backgroundColor: '#0a1628' }}
      />
      
      {/* Perfect circular ambient glow */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '50vmin',
          height: '50vmin',
          background: `radial-gradient(circle, 
            rgba(0, 212, 255, 0.12) 0%, 
            rgba(0, 212, 255, 0.06) 50%, 
            rgba(0, 212, 255, 0.02) 80%,
            transparent 100%)`,
          borderRadius: '50%',
        }}
      />
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(0, 212, 255, 0.4) 1px, transparent 0)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}

export default AppDostPrecision