import React, { useEffect, useRef } from 'react';

export const MouseParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.innerWidth <= 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isMouseMoving = false;
    let timeoutId: number;
    let globalOpacity = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      
      if (currentX === -100) {
        currentX = targetX;
        currentY = targetY;
      }
      
      isMouseMoving = true;
      clearTimeout(timeoutId);
      
      timeoutId = window.setTimeout(() => {
        isMouseMoving = false;
      }, 150);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (targetX !== -100) {
        // Smoothly lerp towards the target
        currentX += (targetX - currentX) * 0.15;
        currentY += (targetY - currentY) * 0.15;

        // Fade logic
        if (isMouseMoving) {
          globalOpacity = Math.min(1, globalOpacity + 0.05);
        } else {
          globalOpacity = Math.max(0, globalOpacity - 0.02);
        }

        if (globalOpacity > 0) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          
          // Draw a soft ambient glow (purple/blue)
          const ambientRadius = 400;
          const ambientGrad = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, ambientRadius);
          ambientGrad.addColorStop(0, `rgba(79, 142, 247, ${0.15 * globalOpacity})`); // Blue
          ambientGrad.addColorStop(0.5, `rgba(168, 85, 247, ${0.05 * globalOpacity})`); // Purple
          ambientGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = ambientGrad;
          ctx.beginPath();
          ctx.arc(currentX, currentY, ambientRadius, 0, Math.PI * 2);
          ctx.fill();

          // Draw a tighter core glow (blue)
          const coreRadius = 150;
          const coreGrad = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, coreRadius);
          coreGrad.addColorStop(0, `rgba(79, 142, 247, ${0.4 * globalOpacity})`);
          coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(currentX, currentY, coreRadius, 0, Math.PI * 2);
          ctx.fill();
          
          // Even brighter center point
          const centerRadius = 40;
          const centerGrad = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, centerRadius);
          centerGrad.addColorStop(0, `rgba(255, 255, 255, ${0.6 * globalOpacity})`);
          centerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = centerGrad;
          ctx.beginPath();
          ctx.arc(currentX, currentY, centerRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden="true"
    />
  );
};
