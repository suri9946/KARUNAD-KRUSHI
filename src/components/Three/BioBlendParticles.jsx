import React, { useEffect, useRef } from 'react';

/**
 * BioBlendParticles Component
 * Renders a high-performance HTML5 Canvas animation with 2,000 point particles.
 * - Progress = 0: Brownian motion of floating biological particles.
 * - Progress > 0: Particles morph into a structured hexagonal/grid mesh representing soil restoration.
 * - Includes mouse proximity magnetic force feedback.
 * 
 * @param {Object} props
 * @param {number} props.progress - Scroll progress from Stage 3 to 5 (value from 0 to 1)
 */
export default function BioBlendParticles({ progress = 0 }) {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  // Initialize particles once on mount
  useEffect(() => {
    const totalParticles = 1200; // Optimized for performance while looking dense
    const temp = [];

    // Target grid structure coords (centered in viewport)
    const cols = 40;
    const rows = 30;
    const gridSpacingX = window.innerWidth / (cols + 1);
    const gridSpacingY = window.innerHeight / (rows + 1);

    for (let i = 0; i < totalParticles; i++) {
      // Starting random positions
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      // Pre-calculate target grid positions for morph state
      const colIdx = i % cols;
      const rowIdx = Math.floor(i / cols) % rows;
      const targetX = gridSpacingX * (colIdx + 1) + (Math.random() - 0.5) * 10;
      const targetY = gridSpacingY * (rowIdx + 1) + (Math.random() - 0.5) * 10;

      temp.push({
        x,
        y,
        originX: x,
        originY: y,
        targetX,
        targetY,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 1.5 + 0.5,
        baseAlpha: Math.random() * 0.4 + 0.3,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseAngle: Math.random() * Math.PI
      });
    }

    particlesRef.current = temp;

    // Listen to mouse coordinates
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, active: false };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Responsive canvas resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.resetTransform();
        ctx.scale(dpr, dpr);
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      
      // Interpolate progress smoothly to avoid layout jumps
      const morphFactor = Math.min(Math.max(progress, 0), 1);

      // Draw active network mesh links if particles cluster
      if (morphFactor > 0.25) {
        ctx.strokeStyle = `rgba(34, 197, 94, ${(morphFactor - 0.25) * 0.15})`;
        ctx.lineWidth = 0.5;
        
        // Render simple network mesh for local clusters (optimized check)
        const checkStep = 8;
        for (let i = 0; i < particles.length; i += checkStep) {
          const p1 = particles[i];
          for (let j = i + 1; j < Math.min(i + 15, particles.length); j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
            if (dist < 60) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // Update and Draw individual particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Position interpolation: Morph state vs. Brownian float state
        const currentTargetX = (1 - morphFactor) * p.originX + morphFactor * p.targetX;
        const currentTargetY = (1 - morphFactor) * p.originY + morphFactor * p.targetY;

        // Add soft brownian drift to original positions
        p.originX += p.vx * 0.5;
        p.originY += p.vy * 0.5;

        // Keep brownian limits inside window bounds
        if (p.originX < 0 || p.originX > w) p.vx *= -1;
        if (p.originY < 0 || p.originY > h) p.vy *= -1;

        // Interpolate current coordinates to targeting coordinates
        p.x += (currentTargetX - p.x) * 0.08;
        p.y += (currentTargetY - p.y) * 0.08;

        // 2. Mouse magnetic repulsion effect
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < 100) {
            const force = (100 - dist) / 100; // Repelling force multiplier
            const angle = Math.atan2(dy, dx);
            const repelX = Math.cos(angle) * force * 15;
            const repelY = Math.sin(angle) * force * 15;
            p.x += repelX;
            p.y += repelY;
          }
        }

        // 3. Pulse alpha calculation
        p.pulseAngle += p.pulseSpeed;
        const currentAlpha = p.baseAlpha + Math.sin(p.pulseAngle) * 0.15;

        // 4. Render Particle Point
        // Color shifts from blue/teal (science) to rich green (organic crops) on progress
        const colorTeal = `rgba(20, 184, 166, ${currentAlpha})`;
        const colorGreen = `rgba(34, 197, 94, ${currentAlpha * (1 + morphFactor * 0.5)})`;
        ctx.fillStyle = morphFactor > 0.4 ? colorGreen : colorTeal;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (1 + morphFactor * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  );
}
