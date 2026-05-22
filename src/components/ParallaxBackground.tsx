import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export const ParallaxBackground = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div ref={ref} className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div style={{ y, width: '100%', height: '130%', top: '-15%', position: 'absolute' }}>
        {children}
      </motion.div>
    </div>
  );
};
