import React from 'react';
import { useSite } from '../context/SiteContext';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';

export const Workflow = () => {
  const { config } = useSite();

  if (!config.sections.workflow) return null;

  return (
    <section className="py-32 relative overflow-hidden bg-grid-pattern" id="workflow">
      <div className="absolute inset-0 bg-[color:var(--color-brand-darker)] z-0" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-[color:var(--color-text-main)] leading-tight"
          >
            نحن لسنا شركة تسويق فقط..
            <br />
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--color-brand-blue-val)] to-[color:var(--color-brand-green-val)] drop-shadow-[0_0_15px_rgba(79,142,247,0.3)] hover:drop-shadow-[0_0_30px_rgba(79,142,247,0.8)] transition-all duration-500 block mt-2 text-5xl md:text-7xl">نحن شريك نمو</span>
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-xl text-[color:var(--color-text-muted)] max-w-3xl mx-auto font-light leading-relaxed"
          >
            نحلل متجرك، نكتشف نقاط الضعف، نبني خطة نمو، نحسن تجربة العميل، وندير حملاتك لتحقيق نتائج قابلة للقياس.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Main Flow Diagram */}
          <div className="relative flex flex-col items-center max-w-md mx-auto w-full">
            <div className="absolute inset-0 bg-[color:var(--color-brand-blue-val)] opacity-5 blur-[100px] rounded-full pointer-events-none" />
            
            {['تحليل البيانات', 'التحسين والتجهيز', 'إطلاق الحملات', 'زيادة المبيعات', 'الولاء والاستدامة'].map((step, i) => (
              <React.Fragment key={i}>
                <motion.div 
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.15 }}
                  className="w-full bg-black/40 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] border border-black/80 py-6 px-8 rounded-2xl text-center font-bold text-lg relative group overflow-hidden"
                  style={{ 
                    boxShadow: i === 3 ? `0 0 30px -10px ${config.primaryColor}` : 'none',
                    borderColor: i === 3 ? config.primaryColor : 'var(--glass-border)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[color:var(--color-text-main)] to-transparent opacity-0 group-hover:opacity-10 transition-opacity translate-x-[-100%] group-hover:translate-x-[100%] duration-1000" />
                  <span className="relative z-10 text-[color:var(--color-text-main)] group-hover:text-[color:var(--color-brand-blue-val)] transition-colors">{step}</span>
                </motion.div>
                {i < 4 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    whileInView={{ opacity: 1, height: 40 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: i * 0.15 + 0.1 }}
                    className="w-px bg-gradient-to-b from-[color:var(--color-brand-blue-val)] to-transparent flex items-center justify-center my-1 relative"
                  >
                    <ArrowDown size={18} className="absolute -bottom-4 text-[color:var(--color-brand-blue-val)] animate-bounce" />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Conversion Journey Dashboard simulation */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl relative overflow-hidden bg-black/40 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] border border-black/80"
          >
             <div className="absolute top-0 right-0 w-80 h-80 bg-[color:var(--color-brand-purple-val)] opacity-10 blur-[80px] rounded-full pointer-events-none" />
             
             <div className="flex items-center justify-between mb-10 relative z-10 border-b border-[color:var(--glass-border)] pb-6">
                <h3 className="text-2xl font-bold text-[color:var(--color-text-main)]">رحلة التحويل المثالية</h3>
                <div className="text-sm font-english text-[color:var(--color-brand-green-val)] flex items-center gap-2 bg-[color:var(--color-brand-green-val)]/10 px-3 py-1 rounded-full border border-[color:var(--color-brand-green-val)]/20">
                  <div className="w-2 h-2 rounded-full bg-[color:var(--color-brand-green-val)] animate-pulse" />
                  Live Tracking
                </div>
             </div>
             
             <div className="space-y-6 relative z-10 font-english" dir="ltr">
               {[
                 { label: 'زائر متردد', labelAr: 'زائر متردد', color: '#ef4444', value: 100 },
                 { label: 'تفاعل واهتمام', labelAr: 'تفاعل', color: '#f97316', value: 80 },
                 { label: 'Trust (بناء الثقة)', labelAr: 'ثقة', color: '#eab308', value: 65 },
                 { label: 'Conversion (قرار شراء)', labelAr: 'شراء', color: '#22d3a0', value: 40 },
                 { label: 'عميل دائم (Loyalty)', labelAr: 'ولاء', color: '#4f8ef7', value: 25 }
               ].map((phase, i) => (
                 <div key={i} className="group cursor-default">
                    <div className="flex justify-between text-sm mb-2 text-[color:var(--color-text-muted)] group-hover:text-[color:var(--color-text-main)] transition-colors">
                      <span>{phase.labelAr}</span>
                      <span>{phase.value}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-[color:var(--glass-bg)] border border-[color:var(--glass-border)] overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${phase.value}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: "easeOut" }}
                        className="absolute top-0 bottom-0 left-0 h-full rounded-full"
                        style={{ backgroundColor: phase.color, boxShadow: `0 0 10px ${phase.color}` }}
                      />
                    </div>
                 </div>
               ))}
             </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
