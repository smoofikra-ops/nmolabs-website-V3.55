import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { useContent } from '../context/ContentContext';
import { motion } from 'motion/react';

const PartnerLogo = ({ partner }: { partner: any }) => {
  const [imageError, setImageError] = useState(false);
  
  if (partner.imageUrl && !imageError) {
    return (
      <img 
        src={partner.imageUrl} 
        alt={partner.name} 
        loading="lazy" 
        decoding="async"
        onError={() => setImageError(true)}
        className="w-full h-full object-contain transition-transform duration-300 pointer-events-none drop-shadow-md" 
      />
    );
  }
  
  const initials = partner.name ? partner.name.slice(0, 2) : '؟؟';
  
  return (
    <div 
      className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-lg md:text-xl font-extrabold text-white uppercase select-none"
      style={{ 
        background: `linear-gradient(135deg, ${partner.color || 'var(--color-brand-blue-val)'} 0%, var(--color-brand-purple-val) 100%)`,
        boxShadow: `0 0 10px ${partner.color || 'var(--color-brand-blue-val)'}40`
      }}
    >
      {initials}
    </div>
  );
};

export const Testimonials = () => {
  const { config } = useSite();
  const { content } = useContent();

  if (!config.sections.testimonials) return null;

  const basePartners = content.successStories.map(story => ({
    id: story.id,
    name: story.storeName,
    imageUrl: story.logoUrl,
    color: story.brandColor,
    linkUrl: ''
  }));

  const isRTL = config.language !== 'en';
  const marqueeClass = isRTL ? 'animate-[marquee-rtl_80s_linear_infinite]' : 'animate-[marquee-ltr_80s_linear_infinite]';

  return (
    <section className="py-32 relative overflow-hidden bg-[color:var(--glass-bg)] bg-dots-pattern" id="testimonials">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[color:var(--color-brand-dark)] opacity-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 mb-24 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-6 text-[color:var(--color-text-main)]"
        >
          متاجر حققت نمو معنا
        </motion.h2>
        <p className="text-xl text-[color:var(--color-text-muted)] font-light">شركاء النجاح الذين حققنا معهم قفزات نوعية في التحويل والمبيعات.</p>
      </div>

      {/* Infinite Marquee */}
      {basePartners.length > 0 && (
        <div className="relative w-full flex overflow-x-hidden py-20 z-10 group" dir="ltr">
          <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[color:var(--color-brand-dark)] to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[color:var(--color-brand-dark)] to-transparent z-20 pointer-events-none" />
          
          <div className={`flex ${marqueeClass} group-hover:[animation-play-state:paused] whitespace-nowrap items-center shrink-0 w-max`}>
            {[...basePartners, ...basePartners, ...basePartners, ...basePartners, ...basePartners].map((partner, i) => (
              <div 
                key={`marquee1-${partner.id}-${i}`}
                className="mx-4 lg:mx-8 relative group/partner flex flex-col items-center justify-center cursor-pointer w-32 md:w-40 rounded-3xl py-2"
                style={{ '--partner-color': partner.color || 'var(--color-brand-blue-val)' } as React.CSSProperties}
              >
                {/* Tooltip */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover/partner:opacity-100 transition-all duration-300 pointer-events-none z-50 transform group-hover/partner:-translate-y-2 w-max max-w-[250px]">
                  <div 
                    className="bg-black/90 backdrop-blur text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/10 text-center break-words"
                    style={{ boxShadow: `0 0 15px ${partner.color || 'var(--color-brand-blue-val)'}` }}
                  >
                    {partner.name}
                  </div>
                </div>

                {/* Logo Container */}
                <div
                  className="w-32 h-32 md:w-40 md:h-40 rounded-3xl flex items-center justify-center transition-all duration-300 group-hover/partner:scale-110 overflow-hidden relative partner-card-glow"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '2px solid rgba(255,255,255,0.1)',
                    animation: 'border-pulse-glow 3s infinite alternate',
                    animationPlayState: 'running'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.animationPlayState = 'paused'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.animationPlayState = 'running'; }}
                >
                  {/* Background glow to make black logos prominent */}
                  <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-110 pointer-events-none opacity-50"></div>
                  
                  <div className="relative z-10 w-full h-full p-4 flex items-center justify-center">
                    <PartnerLogo partner={partner} />
                  </div>
                </div>

                {/* Mobile Partner Name */}
                <span className="md:hidden mt-2.5 text-sm font-bold text-white text-center break-words max-w-[110px] line-clamp-1">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
          
          <div className={`flex ${marqueeClass} group-hover:[animation-play-state:paused] whitespace-nowrap items-center shrink-0 w-max`} aria-hidden="true">
            {[...basePartners, ...basePartners, ...basePartners, ...basePartners, ...basePartners].map((partner, i) => (
              <div 
                key={`marquee2-${partner.id}-${i}`}
                className="mx-4 lg:mx-8 relative group/partner flex flex-col items-center justify-center cursor-pointer w-32 md:w-40 rounded-3xl py-2"
                style={{ '--partner-color': partner.color || 'var(--color-brand-blue-val)' } as React.CSSProperties}
              >
                {/* Tooltip */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover/partner:opacity-100 transition-all duration-300 pointer-events-none z-50 transform group-hover/partner:-translate-y-2 w-max max-w-[250px]">
                  <div 
                    className="bg-black/90 backdrop-blur text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/10 text-center break-words"
                    style={{ boxShadow: `0 0 15px ${partner.color || 'var(--color-brand-blue-val)'}` }}
                  >
                    {partner.name}
                  </div>
                </div>

                {/* Logo Container */}
                <div
                  className="w-32 h-32 md:w-40 md:h-40 rounded-3xl flex items-center justify-center transition-all duration-300 group-hover/partner:scale-110 overflow-hidden relative partner-card-glow"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '2px solid rgba(255,255,255,0.1)',
                    animation: 'border-pulse-glow 3s infinite alternate',
                    animationPlayState: 'running'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.animationPlayState = 'paused'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.animationPlayState = 'running'; }}
                >
                  {/* Background glow to make black logos prominent */}
                  <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-110 pointer-events-none opacity-50"></div>
                  
                  <div className="relative z-10 w-full h-full p-4 flex items-center justify-center">
                    <PartnerLogo partner={partner} />
                  </div>
                </div>

                {/* Mobile Partner Name */}
                <span className="md:hidden mt-2.5 text-sm font-bold text-white text-center break-words max-w-[110px] line-clamp-1">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
