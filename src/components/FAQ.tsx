import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export const FAQ = () => {
  const { config } = useSite();
  const { content } = useContent();
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Group FAQs by category dynamically
  const faqCategoriesMap: { [key: string]: { q: string; a: string }[] } = {};
  content.faq.forEach(item => {
    const cat = item.category || 'عام';
    if (!faqCategoriesMap[cat]) {
      faqCategoriesMap[cat] = [];
    }
    faqCategoriesMap[cat].push({ q: item.question, a: item.answer });
  });

  const faqCategories = Object.keys(faqCategoriesMap).length > 0 
    ? Object.keys(faqCategoriesMap).map(title => ({
        title,
        questions: faqCategoriesMap[title]
      }))
    : [{ title: 'عام', questions: [] }];

  const currentCategoryIndex = activeCategory >= faqCategories.length ? 0 : activeCategory;

  if (!config.sections.faq) return null;

  return (
    <section className="py-32 relative bg-grid-pattern" id="faq">
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-[color:var(--color-brand-blue-val)] opacity-10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-[color:var(--glass-border)] text-sm font-medium mb-6 text-[color:var(--color-text-muted)]"
          >
            <HelpCircle size={16} />
            إجابات شفافة
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4 text-[color:var(--color-text-main)]"
          >
            الأسئلة الشائعة
          </motion.h2>
          <p className="text-xl text-[color:var(--color-text-muted)] font-light">كل ما يدور في ذهنك حول منهجيتنا التقنية في التسويق.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {faqCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveCategory(idx);
                setOpenIndex(null);
              }}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                currentCategoryIndex === idx 
                  ? 'bg-[color:var(--color-brand-blue-val)] text-white shadow-[0_0_15px_rgba(79,142,247,0.4)]'
                  : 'bg-black/40 border border-black/80 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] text-[color:var(--color-text-muted)] hover:text-white hover:bg-black/60 hover:border-[color:var(--color-brand-blue-val)]/50'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        <div className="space-y-4 min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCategoryIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {faqCategories[currentCategoryIndex].questions.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                  <div 
                    key={i}
                    className={`transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1 ${isOpen ? 'bg-[color:var(--color-brand-blue-val)]/5 border border-[color:var(--color-brand-blue-val)]/30 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)]' : 'bg-black/40 border-black/80 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] hover:bg-black/60 hover:border-white/10'}`}
                  >
                    <button 
                      className="w-full text-right p-6 text-lg md:text-xl font-bold flex items-center justify-between text-[color:var(--color-text-main)]"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                    >
                      <span className="pl-4 leading-relaxed">{faq.q}</span>
                      <div 
                        className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[color:var(--color-brand-blue-val)] text-white' : 'bg-[color:var(--glass-bg)] text-[color:var(--color-text-muted)]'}`}
                      >
                        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <div className="p-6 pt-0 text-[color:var(--color-text-muted)] leading-relaxed font-light border-t border-[color:var(--glass-border)] mx-6 mt-2">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
