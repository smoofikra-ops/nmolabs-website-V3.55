import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSite } from '../context/SiteContext';

const blogPosts = [
  {
    id: 1,
    title: 'أهمية التخطيط السليم قبل إطلاق متجرك الإلكتروني',
    excerpt: 'خطوات عملية واضحة لتخطيط وإدارة مشروعك التجاري لضمان نمو وتطوير مستدام قبل إطلاق أي حملات إعلانية.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400',
    date: '18 مايو 2026',
    category: 'إدارة الأعمال'
  },
  {
    id: 2,
    title: 'مواكبة التطورات والابتكار في التجارة الإلكترونية',
    excerpt: 'تعرف على أحدث التوجهات التقنية في المتاجر الإلكترونية، وكيف تستخدم الابتكار لمضاعفة مبيعاتك ونموك.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600&h=400',
    date: '15 مايو 2026',
    category: 'التطوير والابتكار'
  },
  {
    id: 3,
    title: 'نصائح لزيادة المبيعات: للتجار المبتدئين والحاليين',
    excerpt: 'دليل شامل يجمع أهم الاستراتيجيات لرفع العائد على الاستثمار، وكيفية التعامل مع تحديات السوق بنجاح.',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=600&h=400',
    date: '10 مايو 2026',
    category: 'نصائح النمو'
  },
  {
    id: 4,
    title: 'كيف تقرأ تقارير الحملات الإعلانية وتحللها؟',
    excerpt: 'أسرار رفع كفاءة إعلاناتك من خلال الفهم العميق لتقارير الأداء وتتبع سلوك العملاء بدقة.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400',
    date: '05 مايو 2026',
    category: 'التسويق الرقمي'
  },
  {
    id: 5,
    title: 'الدليل الشامل لربط البكسلات وتتبع الإحالات',
    excerpt: 'كل ما تحتاج لمعرفته حول إعداد بكسل سناب شات، ميتا وتيك توك لتتبع الإحالات الناجحة وتعظيم أرباحك.',
    image: 'https://images.unsplash.com/photo-1432888117426-15c015d86c8f?auto=format&fit=crop&q=80&w=600&h=400',
    date: '28 أبريل 2026',
    category: 'التتبع التحليلي'
  },
  {
    id: 6,
    title: 'الفرق الشامل للبدء بين منصة سلة ومنصة زد',
    excerpt: 'مقارنة مفصلة وتجربة حقيقية لضمان اختيار المنصة الأمثل لمشروعك بين عملاقي التجارة الإلكترونية سلة وزد.',
    image: 'https://images.unsplash.com/photo-1531538512165-8b8120e2ef5b?auto=format&fit=crop&q=80&w=600&h=400',
    date: '20 أبريل 2026',
    category: 'منصات التجارة'
  }
];

export const Blog = () => {
  const { config } = useSite();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (config.sections.blog === false) return null;

  if (isMobile) {
    return (
      <section className="py-24 relative overflow-hidden bg-black/10" id="blog">
        {/* Background decoration */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[color:var(--color-brand-blue-val)] opacity-10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4 text-[color:var(--color-text-main)]"
          >
            مدونة مختبرات النمو
          </motion.h2>
          <div className="w-20 h-1 bg-[color:var(--color-brand-blue-val)] mx-auto rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-6">
            {blogPosts.map((post) => (
              <div 
                key={post.id} 
                className="w-full bg-black/40 border border-white/10 rounded-2xl overflow-hidden hover:border-[color:var(--color-brand-blue-val)] transition-all duration-300 flex flex-col text-right shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                dir="rtl"
              >
                <div className="h-52 overflow-hidden relative border-b border-white/5">
                  <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[color:var(--color-brand-blue-val)] border border-[color:var(--color-brand-blue-val)]/30 drop-shadow-md">
                    {post.category}
                  </div>
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    loading="lazy"
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between relative mt-[-20px] z-20 bg-gradient-to-b from-transparent to-black/40">
                  <div>
                    <div className="text-xs text-[color:var(--color-text-muted)] mb-3 flex items-center gap-2">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                       {post.date}
                    </div>
                    <h3 className="text-xl font-bold text-[color:var(--color-text-main)] mb-3 leading-snug">{post.title}</h3>
                    <p className="text-[color:var(--color-text-muted)] text-sm leading-relaxed mb-6">{post.excerpt}</p>
                  </div>
                  <button className="text-[color:var(--color-text-main)] bg-white/5 border border-white/10 hover:bg-[color:var(--color-brand-blue-val)] hover:border-[color:var(--color-brand-blue-val)] px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-between transition-all duration-300 w-full">
                    <span>قراءة المزيد</span>
                    <span className="text-lg">&larr;</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 relative overflow-hidden bg-black/10" id="blog">
      {/* Background decoration */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[color:var(--color-brand-blue-val)] opacity-10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-6 text-[color:var(--color-text-main)]"
        >
          مدونة مختبرات النمو
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="w-24 h-1 bg-[color:var(--color-brand-blue-val)] mx-auto rounded-full"
        />
      </div>

      <div className="relative group overflow-hidden w-full ltr" dir="ltr">
        {/* Left/Right fading edge masks */}
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[color:var(--color-bg-main)] to-transparent z-10 pointer-events-none hidden md:block"></div>
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[color:var(--color-bg-main)] to-transparent z-10 pointer-events-none hidden md:block"></div>
        
        <div
           className="flex gap-6 w-max pl-6 animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused]"
        >
           {[...blogPosts, ...blogPosts, ...blogPosts, ...blogPosts].map((post, idx) => (
             <div 
               key={`${post.id}-${idx}`} 
               className="w-[380px] bg-black/40 border border-white/10 rounded-2xl overflow-hidden hover:border-[color:var(--color-brand-blue-val)] hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex-shrink-0 group/card text-right shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] flex flex-col"
               dir="rtl"
             >
                <div className="h-52 overflow-hidden relative border-b border-white/5">
                  <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[color:var(--color-brand-blue-val)] border border-[color:var(--color-brand-blue-val)]/30 drop-shadow-md">
                    {post.category}
                  </div>
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover/card:scale-110 group-hover/card:rotate-1 transition-all duration-700" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between relative mt-[-20px] z-20 bg-gradient-to-b from-transparent to-black/40">
                  <div>
                    <div className="text-xs text-[color:var(--color-text-muted)] mb-3 flex items-center gap-2">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                       {post.date}
                    </div>
                    <h3 className="text-xl font-bold text-[color:var(--color-text-main)] mb-3 line-clamp-2 leading-snug group-hover/card:text-[color:var(--color-brand-blue-val)] transition-colors">{post.title}</h3>
                    <p className="text-[color:var(--color-text-muted)] text-sm line-clamp-3 leading-relaxed mb-6">{post.excerpt}</p>
                  </div>
                  <button className="text-[color:var(--color-text-main)] bg-white/5 border border-white/10 hover:bg-[color:var(--color-brand-blue-val)] hover:border-[color:var(--color-brand-blue-val)] px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-between group/btn transition-all duration-300 w-full">
                    <span>قراءة المزيد</span>
                    <span className="text-lg group-hover/btn:-translate-x-1 transition-transform">&larr;</span>
                  </button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};
