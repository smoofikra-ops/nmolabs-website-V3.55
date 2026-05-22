import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity } from 'lucide-react';
import { triggerBookingModal } from './BookingModal';

export const StickyCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isMobile = window.innerWidth <= 768;
      
      if (!isMobile) {
        setIsVisible(false);
        return;
      }

      const footer = document.querySelector('footer');
      let footerVisible = false;
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        // Hide if footer starts coming into the viewport
        if (footerRect.top <= window.innerHeight + 10) {
          footerVisible = true;
        }
      }

      setIsVisible(scrollY > 400 && !footerVisible);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleClick = () => {
    triggerBookingModal('تحليل المتاجر');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          className="fixed bottom-[16px] left-[14px] right-[14px] z-[9999] md:hidden"
        >
          <button
            onClick={handleClick}
            className="w-full py-4 px-6 rounded-full font-bold text-base flex items-center justify-center gap-3 text-white shadow-2xl relative overflow-hidden transition-all duration-300 no-global-hover"
            style={{
              background: 'linear-gradient(135deg, var(--color-brand-blue-val, #2bc2c2) 0%, var(--color-brand-purple-val, #7C3AED) 100%)',
              boxShadow: '0 8px 32px rgba(43, 194, 194, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            <Activity className="w-5 h-5 animate-pulse text-white shrink-0" />
            <span className="tracking-wide">حلل متجرك الآن</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
