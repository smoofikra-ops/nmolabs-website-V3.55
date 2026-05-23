import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { useContent } from '../context/ContentContext';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

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
  const { config, updateConfig } = useSite();
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

  const statsList = content.successStories.length > 0 
    ? content.successStories.map(story => ({
        num: story.growthPercentage,
        title: story.storeName,
        desc: story.resultText,
        color: story.brandColor
      }))
    : [
        { num: '+300%', title: 'زيادة في المبيعات', desc: 'لأحد عملائنا في قطاع التجزئة بفضل إعادة بناء رحلة العميل بالكامل خلال 3 أشهر فقط.', color: '#4f8ef7' },
        { num: '+8x', title: 'مضاعفة ROAS', desc: 'تقليل تكلفة الاستحواذ على العميل CAC مع مضاعفة العائد الإعلاني.', color: '#7c3aed' },
        { num: '-40%', title: 'تقليل المرتجعات', desc: 'بفضل التحليل الدقيق للسلوك وتوضيح وصف المنتجات بدقة وتقنية النماذج الذكية.', color: '#22d3a0' }
      ];

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
        <p className="text-xl text-[color:var(--color-text-muted)]">شركاء النجاح الذين حققنا معهم قفزات نوعية في التحويل والمبيعات.</p>
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
      
      <div className="max-w-7xl mx-auto px-6 mt-32 relative z-10">
         <div className="grid md:grid-cols-3 gap-8">
            {statsList.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-10 rounded-3xl text-center relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 bg-black/40 border border-white/5 shadow-[inset_0_4px_15px_rgba(0,0,0,1),0_0_20px_rgba(0,0,0,0.5)]"
                style={{ 
                  borderColor: stat.color ? `${stat.color}40` : 'rgba(255,255,255,0.05)'
                }}
                onMouseEnter={(e) => {
                  if (stat.color) {
                    e.currentTarget.style.borderColor = stat.color;
                    e.currentTarget.style.boxShadow = `inset 0 4px 15px rgba(0,0,0,1), 0 0 25px ${stat.color}50`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (stat.color) {
                    e.currentTarget.style.borderColor = `${stat.color}40`;
                    e.currentTarget.style.boxShadow = 'inset 0 4px 15px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.5)';
                  }
                }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none z-0" 
                  style={{ 
                    backgroundImage: `linear-gradient(to bottom right, ${stat.color || 'var(--color-brand-blue-val)'}, var(--color-brand-purple-val))` 
                  }}
                />
                  
                {/* Animated Border Top */}
                <div 
                  className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-in-out opacity-0 group-hover:opacity-100" 
                  style={{ 
                    backgroundImage: `linear-gradient(to right, transparent, ${stat.color || 'var(--color-brand-blue-val)'}, transparent)` 
                  }}
                />
                
                <div 
                  className="absolute top-0 right-0 w-32 h-32 opacity-5 blur-[40px] rounded-full group-hover:opacity-10 transition-opacity" 
                  style={{ backgroundColor: stat.color || 'var(--color-brand-blue-val)' }}
                />
                
                <div className="relative z-10">
                  {/* Dynamic Counter Effect */}
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0, y: 20 }}
                    whileInView={{ scale: 1, opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 100, delay: i * 0.2 }}
                    className="text-6xl font-black tracking-tighter mb-6 font-english relative inline-block drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] text-white animate-[pulse_4s_ease-in-out_infinite]" 
                    style={{
                      color: '#fff',
                      textShadow: stat.color ? `0 0 15px ${stat.color}` : undefined
                    }}
                  >
                    {stat.num}
                  </motion.div>
                  
                  <h3 
                    className="text-2xl font-bold mb-4 text-[color:var(--color-text-main)] transition-colors duration-300"
                    onMouseEnter={(e) => { if (stat.color) e.currentTarget.style.color = stat.color; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
                  >
                    {stat.title}
                  </h3>
                  <p className="text-[color:var(--color-text-muted)] leading-relaxed font-light">{stat.desc}</p>
                </div>
              </motion.div>
            ))}
         </div>
      </div>
    </section>
  );
};
