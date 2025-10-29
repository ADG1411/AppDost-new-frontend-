/**
 * Perfect Geometric Network Circle - Manual Implementation
 * Recreates the exact AppDost network structure with precision
 */
import { useEffect, useRef, useState } from 'react'

const GeometricNetwork = () => {
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
    const maxRadius = Math.min(dimensions.width, dimensions.height) * 0.3

    // Generate nodes in perfect circular pattern
    const generateNodes = () => {
      const nodes = []
      const layers = 5
      
      // Center node
      nodes.push({
        x: centerX,
        y: centerY,
        radius: 4,
        opacity: 1,
        layer: 0,
        angle: 0,
        originalX: centerX,
        originalY: centerY
      })

      // Concentric circles
      for (let layer = 1; layer <= layers; layer++) {
        const layerRadius = (maxRadius / layers) * layer
        const nodesInLayer = layer * 8 // More nodes in outer layers
        
        for (let i = 0; i < nodesInLayer; i++) {
          const angle = (2 * Math.PI * i) / nodesInLayer + (layer * 0.1) // Slight offset per layer
          const x = centerX + layerRadius * Math.cos(angle)
          const y = centerY + layerRadius * Math.sin(angle)
          
          nodes.push({
            x,
            y,
            radius: layer === 1 ? 3 : 2,
            opacity: 0.8 + (layer * 0.05),
            layer,
            angle: angle + Math.PI * 2 * Math.random() * 0.1,
            originalX: x,
            originalY: y,
            rotationSpeed: 0.001 + (layer * 0.0002)
          })
        }
      }
      
      return nodes
    }

    const nodes = generateNodes()
    let time = 0

    const animate = () => {
      ctx.fillStyle = '#0a1628'
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      time += 0.016 // ~60fps

      // Update node positions with subtle rotation
      nodes.forEach(node => {
        if (node.layer > 0) {
          const currentRadius = Math.sqrt(
            Math.pow(node.originalX - centerX, 2) + 
            Math.pow(node.originalY - centerY, 2)
          )
          node.angle += node.rotationSpeed
          node.x = centerX + currentRadius * Math.cos(node.angle)
          node.y = centerY + currentRadius * Math.sin(node.angle)
        }
      })

      // Draw connections first (behind nodes)
      ctx.strokeStyle = '#00d4ff'
      ctx.lineWidth = 1.5
      
      nodes.forEach((nodeA, i) => {
        nodes.forEach((nodeB, j) => {
          if (i >= j) return
          
          const distance = Math.sqrt(
            Math.pow(nodeA.x - nodeB.x, 2) + 
            Math.pow(nodeA.y - nodeB.y, 2)
          )
          
          // Connect nodes within certain distance and same/adjacent layers
          const layerDiff = Math.abs(nodeA.layer - nodeB.layer)
          const maxDistance = layerDiff <= 1 ? 120 + (nodeA.layer * 20) : 80
          
          if (distance < maxDistance) {
            const opacity = Math.max(0.1, 1 - (distance / maxDistance))
            
            ctx.globalAlpha = opacity * 0.6
            ctx.beginPath()
            ctx.moveTo(nodeA.x, nodeA.y)
            ctx.lineTo(nodeB.x, nodeB.y)
            ctx.stroke()
            
            // Add glow effect
            ctx.shadowColor = '#00d4ff'
            ctx.shadowBlur = 3
            ctx.stroke()
            ctx.shadowBlur = 0
          }
        })
      })

      // Draw nodes on top
      nodes.forEach(node => {
        ctx.globalAlpha = node.opacity
        
        // Node glow
        ctx.shadowColor = '#00d4ff'
        ctx.shadowBlur = 8
        ctx.fillStyle = '#00d4ff'
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()
        
        // Bright core
        ctx.shadowBlur = 0
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2)
        ctx.fill()
      })

      // Mouse interaction effect
      const mouseDistance = Math.sqrt(
        Math.pow(mouseRef.current.x - centerX, 2) + 
        Math.pow(mouseRef.current.y - centerY, 2)
      )
      
      if (mouseDistance < maxRadius * 1.5) {
        ctx.globalAlpha = 0.3
        ctx.strokeStyle = '#7CFFB2'
        ctx.lineWidth = 2
        ctx.shadowColor = '#7CFFB2'
        ctx.shadowBlur = 10
        
        nodes.forEach(node => {
          const distanceToMouse = Math.sqrt(
            Math.pow(mouseRef.current.x - node.x, 2) + 
            Math.pow(mouseRef.current.y - node.y, 2)
          )
          
          if (distanceToMouse < 150) {
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
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#0a1628] z-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: '#0a1628' }}
      />
      
      {/* Additional atmospheric effects */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '60vmin',
          height: '60vmin',
          background: `radial-gradient(circle, 
            rgba(0, 212, 255, 0.08) 0%, 
            rgba(0, 212, 255, 0.03) 60%, 
            transparent 100%)`,
          borderRadius: '50%',
        }}
      />
    </div>
  )
}

export default GeometricNetwork