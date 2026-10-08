import { useEffect, useRef } from 'react'

const COLORS = { orange: '246, 127, 0', muted: '105, 120, 138' }
const SPAWN_INTERVAL = 160

function GraphBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frameId = 0
    let width = 0
    let height = 0
    let targetCount = 0
    let lastFrame = 0
    let lastSpawn = 0
    let nodes = []

    function addNode(bornAt) {
      const anchor = nodes.length > 0 && Math.random() < 0.7
        ? nodes[Math.floor(Math.random() * nodes.length)]
        : null
      const angle = Math.random() * Math.PI * 2
      const distance = 80 + Math.random() * 190
      const x = anchor
        ? anchor.x + Math.cos(angle) * distance / width
        : 0.03 + Math.random() * 0.94
      const y = anchor
        ? anchor.y + Math.sin(angle) * distance / height
        : 0.03 + Math.random() * 0.94

      if (nodes.length >= targetCount) nodes.shift()
      nodes.push({
        x: Math.min(0.97, Math.max(0.03, x)),
        y: Math.min(0.97, Math.max(0.03, y)),
        vx: (Math.random() - 0.5) * 0.004,
        vy: (Math.random() - 0.5) * 0.004,
        radius: 1.4 + Math.random(),
        color: Math.random() < 0.12 ? COLORS.muted : COLORS.orange,
        bornAt,
      })
    }

    function nodeOpacity(node, index, now) {
      const entrance = Math.min(1, (now - node.bornAt) / 700)
      const exit = Math.min(1, (index + 1) / 6)
      return Math.max(0, entrance * exit)
    }

    function draw(now) {
      context.clearRect(0, 0, width, height)
      const reach = 360

      for (let i = 0; i < nodes.length; i += 1) {
        const first = nodes[i]
        const firstOpacity = nodeOpacity(first, i, now)

        const nearby = []
        for (let j = i + 1; j < nodes.length; j += 1) {
          const second = nodes[j]
          const dx = (second.x - first.x) * width
          const dy = (second.y - first.y) * height
          const distance = Math.hypot(dx, dy)
          if (distance > reach) continue

          nearby.push({ second, dx, dy, distance, index: j })
        }

        nearby.sort((a, b) => a.distance - b.distance)
        const connections = nearby.slice(0, 4)
        const distant = nearby.filter((candidate) =>
          candidate.distance > reach * 0.45 && !connections.includes(candidate))
        if (distant.length > 0) connections.push(distant[0])
        if (distant.length > 2) connections.push(distant[Math.floor(distant.length / 2)])

        for (const { second, dx, dy, distance, index } of connections) {

          const connectionAge = now - Math.max(first.bornAt, second.bornAt)
          const progress = Math.min(1, Math.max(0, connectionAge / 650))
          const strength = (1 - distance / reach) * firstOpacity * nodeOpacity(second, index, now)
          context.beginPath()
          context.moveTo(first.x * width, first.y * height)
          context.lineTo(first.x * width + dx * progress, first.y * height + dy * progress)
          context.strokeStyle = `rgba(${second.color}, ${strength * 0.2})`
          context.lineWidth = 1
          context.stroke()
        }

        const centerX = first.x * width
        const centerY = first.y * height
        const glow = context.createRadialGradient(
          centerX, centerY, 0, centerX, centerY, first.radius * 3)
        glow.addColorStop(0, `rgba(${first.color}, ${firstOpacity * 0.06})`)
        glow.addColorStop(1, `rgba(${first.color}, 0)`)
        context.beginPath()
        context.arc(centerX, centerY, first.radius * 3, 0, Math.PI * 2)
        context.fillStyle = glow
        context.fill()

        context.beginPath()
        context.arc(centerX, centerY, first.radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(${first.color}, ${firstOpacity * 0.38})`
        context.fill()
      }
    }

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      targetCount = Math.min(135, Math.max(34, Math.round(width * height / 10500)))
      nodes = nodes.slice(-targetCount)

      const now = performance.now()
      if (motionPreference.matches) {
        while (nodes.length < targetCount) addNode(now - 2000)
      } else if (nodes.length === 0) {
        addNode(now)
        lastSpawn = now
      }
      draw(now)
    }

    function animate(now) {
      if (now - lastFrame >= 32) {
        const elapsed = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0
        lastFrame = now

        if (now - lastSpawn >= SPAWN_INTERVAL) {
          addNode(now)
          lastSpawn = now
        }

        for (const node of nodes) {
          node.x += node.vx * elapsed
          node.y += node.vy * elapsed
          if (node.x < 0.03 || node.x > 0.97) node.vx *= -1
          if (node.y < 0.03 || node.y > 0.97) node.vy *= -1
        }
        draw(now)
      }
      frameId = window.requestAnimationFrame(animate)
    }

    function handleMotionChange() {
      window.cancelAnimationFrame(frameId)
      nodes = []
      lastFrame = 0
      resize()
      if (!motionPreference.matches) frameId = window.requestAnimationFrame(animate)
    }

    resize()
    if (!motionPreference.matches) frameId = window.requestAnimationFrame(animate)
    window.addEventListener('resize', resize)
    motionPreference.addEventListener('change', handleMotionChange)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      motionPreference.removeEventListener('change', handleMotionChange)
    }
  }, [])

  return <canvas ref={canvasRef} className="graph-background" aria-hidden="true" />
}

export default GraphBackground
