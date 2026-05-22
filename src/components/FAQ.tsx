import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqCategories = [
  {
    title: 'حول المنصة والحلول الذكية',
    questions: [
      {
        q: 'هل أنتم مجرد وكالة تسويق (Agency) تقليدية؟',
        a: 'لا، نحن منصة (SaaS) وشريك نمو تقني. ندمج بين أدوات الذكاء الاصطناعي لتحليل المتجر، وبين خبرات التسويق لإدارة الحملات وصناعة المحتوى، لنوفر لك بيئة نمو متكاملة مبنية على الأرقام الحقيقية وليس التخمين.'
      },
      {
        q: 'ما هي الحلول الذكية التي تغير طريقة البيع؟',
        a: 'نقدم مجموعة متكاملة من أدوات التحليلات، تحسين محركات البحث، إدارة الحملات الإعلانية المدعومة، وفحص جودة المتاجر لاكتشاف أسباب تسرب العملاء ومعالجتها فوراً.'
      },
      {
        q: 'ما هي مميزات هذه الحلول الذكية وكيف تفيد متجري؟',
        a: 'تتميز حلولنا بالدقة وسرعة التنفيذ والاعتماد التام على الأرقام والذكاء الاصطناعي بدلاً من التخمين. ستتمكن من تحسين واجهة المستخدم، تقليل التكاليف الإعلانية، ورفع معدل التحويل بشكل حقيقي ومستدام.'
      },
      {
        q: 'كم يحتاج تنفيذ وتفعيل هذه الحلول؟',
        a: 'يبدأ التحسن الأولي خلال أول 14 يوماً من خلال التدقيق التقني، وتظهر نتائج حملات النمو المتكاملة خلال 30 إلى 90 يوماً كحد أقصى للوصول لأفضل استقرار للأداء (ROAS).'
      },
      {
        q: 'كيف تختلف المنصة عن أدوات التحليل الأخرى في السوق؟',
        a: 'نحن لا نقدم لك أرقاماً مجردة فقط، بل نربط كل مشكلة بحل تسويقي متكامل، وندير التنفيذ لك إن أردت، مما يجعلنا شريك نمو أكثر من مجرد أداة مراقبة.'
      }
    ]
  },
  {
    title: 'الأسعار والتواصل',
    questions: [
      {
        q: 'هل الأدوات في المنصة متوفرة باشتراك منفصل أم ضمن الخدمات؟',
        a: 'الأدوات متاحة لجميع مشتركي الباقات التسويقية كجزء من الشراكة. ويمكن قريباً الاشتراك بها بشكل منفصل للمتاجر التي ترغب في الإدارة الذاتية.'
      },
      {
        q: 'هل توجد باقات مخصصة تناسب حجم متجري؟',
        a: 'نعم، نوفر باقات مرنة ومتدرجة (الأعمال والاحترافية) بالإضافة إلى الباقات المخصصة بالكامل التي تلبي احتياجات المتاجر ذات الحجم الأكبر وتتضمن ربط API متقدم.'
      },
      {
        q: 'كيفية التواصل معكم لمعرفة الباقة الأنسب؟',
        a: 'يمكنك التواصل معنا بكل يسر عبر زر "تواصل معنا" المتاح في قسم الباقات، ليتم تحويلك مباشرة للواتساب وسيقوم فريقنا بتقديم استشارة لترشيح أفضل مسار لنموك.'
      },
      {
        q: 'هل توجد فترة تجريبية قبل الالتزام بالباقات المدفوعة؟',
        a: 'نقدم باقة مجانية مدى الحياة تمنحك وصولاً للأدوات الأساسية مثل حاسبة الأداء وفاحص السرعة لتبدأ بتحسين متجرك فوراً وبدون أي التزام.'
      },
      {
        q: 'هل تدعمون المتاجر المبنية على منصة زد وسلة؟',
        a: 'بالتأكيد! المنصة مصممة بأعلى توافق لدعم متاجر سلاسل زد وسلة بالكامل لاستخراج البيانات وتنفيذ خطط التحسين التسويقي بسهولة فائقة.'
      }
    ]
  },
  {
    title: 'متاعب Google وحلولها',
    questions: [
      {
        q: 'حساب Google Merchant Center الخاص بي معلق، هل يمكنكم حله؟',
        a: 'نعم، نمتلك خبرة واسعة في حل تعليق Merchant Center، نعالج مشاكل الوصف المضلل والبيانات المفقودة لضمان إطلاق منتجاتك بسلام.'
      },
      {
        q: 'منتجاتي تُرفض باستمرار في إعلانات جوجل، ما الحل؟',
        a: 'نحن نقوم بفحص المنتجات المرفوضة، وتحديد سياسات المحتوى التي تم انتهاكها كالتسعير، جودة الصور، أو المشاكل التقنية مثل GTIN المفقود، ونحل المشكلة من جذورها.'
      },
      {
        q: 'حساب Google Ads الخاص بي تعرض للإيقاف، كيف تساعدونني؟',
        a: 'حالات الإيقاف تحتاج مراجعة دقيقة لتشخيص السبب مثل مشكلات الفوترة الدفع والمخالفات. نقوم بتقديم التماس احترافي وندير التواصل لحل هذه الأزمة.'
      },
      {
        q: 'نشاطي في Google Business لا يظهر بخرائط نتائج البحث المحلية، هل من حل؟',
        a: 'نقدم خدمة تحسين للظهور المحلي تكسبك ثقة البحث، تشمل تحسين الكلمات المفتاحية لمجالك واستعادة ثقة نشاطك.'
      },
      {
        q: 'ماذا عن مشاكل الفهرسة في Search Console؟',
        a: 'نقوم بتحليل تقارير القنصل لتحديد الصفحات غير المفهرسة، تصحيح أخطاء الأداء لتأمين Core Web Vitals متفوق يعزز نتائج متجرك ومبيعاته.'
      }
    ]
  },
  {
    title: 'الحملات وضمان الجودة',
    questions: [
      {
        q: 'ما هو الضمان الأكيد لنجاح الحملات؟',
        a: 'نحن لا نطلق أي حملة قبل سد جميع "ثغرات التسرب" في متجرك (مشاكل تقنية، صور ضعيفة، رحلة شراء معقدة). هذا التحليل المسبق يرفع دقة نجاح الحملة بأكثر من 80% مقارنة بالانطلاق الأعمى دون بيانات.'
      },
      {
        q: 'كيف يتم قياس أداء الحملة الإعلانية؟',
        a: 'نعتمد على مؤشرات الأداء الحقيقية (KPIs) ونستخدم لوحات تحكم دقيقة تراقب العائد الإعلاني ومعدلات التحويل بشكل فوري لتحسين الحملات باستمرار.'
      },
      {
        q: 'هل توفرون تقارير دورية لأداء متجري؟',
        a: 'نعم، من خلال لوحة التحكم الخاصة بالمنصة ستحصل على بيانات دقيقة، كما نوفر تقارير تلخيصية وتوصيات إستراتيجية.'
      },
      {
        q: 'ماذا لو لم أحصل على النتائج المتوقعة رغم كل التحسينات؟',
        a: 'نحن نؤمن بالشراكة والمشاركة في المخاطر. نُركز فوراً على اختبار وتطبيق حملات ال A/B Testing وتحليل التسرب لتصحيح المسار بشكل عاجل وفوري.'
      },
      {
        q: 'هل تقومون بصناعة المحتوى أم إدارة الحملات الإعلانية فقط؟',
        a: 'نحن نقدم دورة نجاح متكاملة! نبني لك إستراتيجية المحتوى، نكتب النصوص التسويقية الجذابة، وندير الإعلانات بأعلى دقة ومعايير.'
      }
    ]
  }
];

export const FAQ = () => {
  const { config } = useSite();
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
                activeCategory === idx 
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
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {faqCategories[activeCategory].questions.map((faq, i) => {
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
