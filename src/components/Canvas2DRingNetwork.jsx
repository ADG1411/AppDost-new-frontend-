/**
 * Canvas 2D Ring Network - Guaranteed Visible
 * Using Canvas 2D API for guaranteed rendering
 */
import { useRef, useEffect } from 'react'

const Canvas2DRingNetwork = () => {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateSize()
    window.addEventListener('resize', updateSize)

    // Network parameters
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 300
    const nodeCount = 24
    const nodes = []

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2
      nodes.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        angle: angle,
        index: i
      })
    }

    // Animation function
    const animate = (time) => {
      // Clear canvas
      ctx.fillStyle = 'rgba(7, 22, 51, 1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Rotation
      const rotation = time * 0.0005

      // Draw connections
      ctx.strokeStyle = '#00e0ff'
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.6

      nodes.forEach((node, index) => {
        const rotatedX = centerX + Math.cos(node.angle + rotation) * radius
        const rotatedY = centerY + Math.sin(node.angle + rotation) * radius

        // Connect to next node (circle)
        const nextIndex = (index + 1) % nodes.length
        const nextNode = nodes[nextIndex]
        const nextRotatedX = centerX + Math.cos(nextNode.angle + rotation) * radius
        const nextRotatedY = centerY + Math.sin(nextNode.angle + rotation) * radius

        ctx.beginPath()
        ctx.moveTo(rotatedX, rotatedY)
        ctx.lineTo(nextRotatedX, nextRotatedY)
        ctx.stroke()

        // Cross connections
        if (index % 3 === 0) {
          const crossIndex = (index + Math.floor(nodeCount / 2)) % nodeCount
          const crossNode = nodes[crossIndex]
          const crossRotatedX = centerX + Math.cos(crossNode.angle + rotation) * radius
          const crossRotatedY = centerY + Math.sin(crossNode.angle + rotation) * radius

          ctx.globalAlpha = 0.3
          ctx.beginPath()
          ctx.moveTo(rotatedX, rotatedY)
          ctx.lineTo(crossRotatedX, crossRotatedY)
          ctx.stroke()
          ctx.globalAlpha = 0.6
        }
      })

      // Draw nodes
      ctx.fillStyle = '#00ffff'
      ctx.globalAlpha = 1

      nodes.forEach((node) => {
        const rotatedX = centerX + Math.cos(node.angle + rotation) * radius
        const rotatedY = centerY + Math.sin(node.angle + rotation) * radius
        
        // Pulsing effect
        const pulse = Math.sin(time * 0.003 + node.index * 0.2) * 0.3 + 0.7
        const nodeSize = 4 * pulse

        ctx.beginPath()
        ctx.arc(rotatedX, rotatedY, nodeSize, 0, Math.PI * 2)
        ctx.fill()

        // Glow effect
        const gradient = ctx.createRadialGradient(rotatedX, rotatedY, 0, rotatedX, rotatedY, 20)
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.6)')
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(rotatedX, rotatedY, 20, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#00ffff'
      })

      animationId = requestAnimationFrame(animate)
    }

    animate(0)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #071633 0%, #0a0f24 100%)',
      position: 'relative'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />
      
      {/* Status indicator */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: '#00ffff',
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif'
      }}>
        ✅ Canvas 2D Ring Network Active
      </div>
    </div>
  )
}

export default Canvas2DRingNetwork