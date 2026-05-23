import React, { useState, useRef } from 'react';
import { useSite } from '../context/SiteContext';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Megaphone, Share2, Search, PenTool, Layout as LayoutIcon, 
  ChevronDown, ArrowUpRight, X 
} from 'lucide-react';
import { triggerBookingModal } from './BookingModal';
import { useContent } from '../context/ContentContext';

const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'Layout': return <LayoutIcon className="w-10 h-10" />;
    case 'Megaphone': return <Megaphone className="w-10 h-10" />;
    case 'Share2': return <Share2 className="w-10 h-10" />;
    case 'Search': return <Search className="w-10 h-10" />;
    case 'PenTool': return <PenTool className="w-10 h-10" />;
    default: return <LayoutIcon className="w-10 h-10" />;
  }
};

const getServiceDeliverables = (title: string) => {
  const t = title || '';
  if (t.includes('إنشاء') || t.includes('متاجر')) {
    return ['باقة الانطلاقة', 'باقة النمو', 'باقة التشغيل الكامل', 'الباقة المخصصة'];
  }
  if (t.includes('الحملات') || t.includes('إعلانات')) {
    return ['دراسة السوق والمنافسين', 'إطلاق وإدارة الإعلانات', 'تحسين مستمر (A/B Testing)', 'تقارير أداء دورية'];
  }
  if (t.includes('سوشيال') || t.includes('السوشيال')) {
    return ['خطة محتوى شهرية', 'تصميم بوستات وفيديوهات', 'إدارة التفاعل', 'توثيق الحسابات'];
  }
  if (t.includes('SEO') || t.includes('سيو') || t.includes('البحث')) {
    return ['تدقيق فني للمتجر', 'تحليل كلمات مفتاحية', 'بناء روابط خلفية (Backlinks)', 'تحسين سرعة الموقع'];
  }
  if (t.includes('المحتوى') || t.includes('كتابة')) {
    return ['وصف منتجات احترافي', 'نصوص الإعلانات (Copywriting)', 'إيميلات تسويقية', 'صفحات الهبوط'];
  }
  if (t.includes('واجهات') || t.includes('تصميم') || t.includes('UX')) {
    return ['خرائط حرارية لتحليل السلوك', 'تصميم صفحات المنتجات', 'تحسين عملية الدفع Checkout', 'User Testing'];
  }
  return ['استشارة مجانية', 'تحليل الأداء الرقمي', 'دعم فني متكامل', 'خطة تحسين مقترحة'];
};

export const Services = () => {
  const { config } = useSite();
  const { content } = useContent();
  const services = content.services || [];
  
  const [openId, setOpenId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 0]);

  if (!config.sections.services) return null;

  const activeService = services.find(s => s.id === openId);
  const isStoreService = activeService && (
    activeService.id === 'srv_1' || 
    activeService.title.includes('إنشاء المتاجر') || 
    activeService.title.includes('متاجر')
  );

  return (
    <section className="py-32 relative z-10 bg-radial-glow" id="services" ref={sectionRef}>
      {/* Dark gradient fade from top */}
      <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[color:var(--color-brand-dark)] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[color:var(--color-brand-blue-val)] opacity-10 blur-[100px] rounded-full pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-[color:var(--glass-border)] text-sm font-medium mb-6 text-[color:var(--color-text-muted)]"
          >
            حلول نمو ذكية
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-[color:var(--color-text-main)]"
          >
            خدمات التسويق المتكاملة
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-xl text-[color:var(--color-text-muted)] max-w-3xl mx-auto font-light"
          >
            حلول تسويق احترافية لبناء حضور رقمي قوي وتحقيق نمو حقيقي ومستدام.
          </motion.p>
        </div>

        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-hide gap-6 pb-4 w-full px-2">
          {services.map((service, index) => {
            const serviceIcon = getServiceIcon(service.icon);
            return (
              <motion.div
                key={service.id}
                style={{ y: isMobile ? 0 : (index % 3 === 0 ? y1 : index % 3 === 1 ? y2 : y3) }}
                className="snap-center shrink-0 w-[85vw] md:w-auto flex-1 flex flex-col h-full"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:-translate-y-2 transition-all duration-500 rounded-3xl overflow-hidden group relative flex flex-col h-full shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] border-2 border-white/5 hover:border-[color:var(--color-brand-blue-val)] hover:shadow-[inset_0_4px_15px_rgba(0,0,0,1),0_0_20px_rgba(79,142,247,0.3)] bg-black/40 w-full"
                >
                  {/* Hover Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-brand-blue-val)] to-[color:var(--color-brand-purple-val)] opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none z-0" />
                  
                  {/* Animated Border Top */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[color:var(--color-brand-blue-val)] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-in-out opacity-0 group-hover:opacity-100" />
                  
                  <div className="p-8 relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-8">
                      <div 
                        className="p-4 rounded-2xl transition-all duration-500 bg-black/50 shadow-[inset_0_2px_8px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.05)] border border-white/5 text-[color:var(--color-brand-blue-val)] group-hover:text-white group-hover:bg-[color:var(--color-brand-blue-val)] group-hover:shadow-[0_0_20px_var(--color-brand-blue-val)] flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3"
                      >
                        {serviceIcon}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 text-[color:var(--color-text-main)] group-hover:text-[color:var(--color-brand-blue-val)] transition-colors duration-300">{service.title}</h3>
                    <p className="text-[color:var(--color-text-muted)] leading-relaxed text-sm lg:text-base font-light mb-8 flex-1">
                      {service.description}
                    </p>

                    {/* Section Divider with animation */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 group-hover:via-[color:var(--color-brand-blue-val)] to-transparent mb-6 transition-colors duration-500"></div>

                    <button 
                      onClick={() => setOpenId(service.id)}
                      className="flex items-center gap-2 text-[color:var(--color-brand-blue-val)] group-hover:text-white font-bold mt-auto hover:gap-3 transition-all duration-300 cursor-pointer"
                    >
                      <span>تفاصيل أكثر</span>
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Modern Modal */}
      <AnimatePresence>
        {openId !== null && activeService && (
          <div 
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#030307]/97 backdrop-blur-[2px] p-4 rtl"
            onClick={() => setOpenId(null)}
          >
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               onClick={(e) => e.stopPropagation()}
               className={`bg-[#080812] border-2 border-white/15 rounded-[24px] w-full ${isStoreService ? 'max-w-6xl' : 'max-w-2xl'} overflow-hidden shadow-[0_0_50px_rgba(79,142,247,0.25)] relative flex flex-col max-h-[90vh]`}
            >
               {/* Modal Header */}
               <div className="p-6 pb-6 border-b border-white/10 flex justify-between items-start sticky top-0 bg-[#080812] z-10">
                 <div className="flex flex-col gap-2">
                   <div 
                     className="p-3 w-max rounded-xl text-[color:var(--color-brand-blue-val)] bg-[color:var(--color-brand-blue-val)]/10 mb-2 border border-white/5"
                   >
                     {getServiceIcon(activeService.icon)}
                   </div>
                   <h3 className="text-2xl md:text-3xl font-bold text-white pr-1">{activeService.title}</h3>
                 </div>
                 <button 
                   onClick={() => setOpenId(null)}
                   className="p-3 text-white bg-white/5 hover:bg-white/20 border border-white/10 rounded-full transition-all cursor-pointer shadow-lg flex items-center justify-center"
                   aria-label="إغلاق"
                 >
                   <X size={20} />
                 </button>
               </div>

               {/* Modal Body */}
               <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                 <p className={`text-lg text-[color:var(--color-text-muted)] font-light leading-relaxed ${isStoreService ? 'text-center max-w-3xl mx-auto mb-10' : 'mb-8'}`}>
                   {activeService.description}
                 </p>
                 
                 {!isStoreService && (
                   <>
                     <h4 className="text-sm font-bold mb-6 text-[color:var(--color-brand-green-val)] uppercase tracking-wider flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-[color:var(--color-brand-green-val)] shadow-[0_0_8px_var(--color-brand-green-val)]" />
                       ماذا نقدم في هذه الخدمة؟
                     </h4>
                     
                     <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                       {getServiceDeliverables(activeService.title).map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-[color:var(--color-text-main)] bg-[color:var(--glass-bg)] border border-[color:var(--glass-border)] p-4 rounded-xl">
                           {item}
                         </li>
                       ))}
                     </ul>
                   </>
                 )}

                 {isStoreService && (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {/* Package 1 */}
                     <div className="relative rounded-3xl p-6 flex flex-col h-full bg-black/40 border border-white/5 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300 group">
                       <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                       <div className="relative z-10 flex flex-col h-full">
                         <h4 className="text-xl font-bold mb-2 text-white">الانطلاقة</h4>
                         <div className="flex items-baseline gap-1 mb-2">
                           <span className="text-sm text-gray-400">تبدأ من</span>
                           <span className="text-3xl font-bold text-white">1500</span>
                           <span className="text-sm text-gray-400">ريال</span>
                         </div>
                         <p className="text-xs text-gray-400 mb-6 h-10">كل ما تحتاجه لإطلاق متجر إلكتروني احترافي وجاهز للبيع.</p>
                         <ul className="space-y-3 flex-grow mb-6">
                           {['اختيار اسم المتجر', 'تصميم الشعار والهوية', 'إنشاء وتهيئة المتجر', 'تصميم وتخصيص الواجهة', 'رفع المنتجات والسياسات', 'ربط الدفع والشحن وتسليم المتجر'].map((txt, i) => (
                             <li key={i} className="flex items-start gap-2 text-sm text-gray-300"><ChevronDown className="w-4 h-4 text-blue-400 rotate-[-90deg] shrink-0 mt-0.5" /> <span>{txt}</span></li>
                           ))}
                         </ul>
                         <button 
                           onClick={() => { setOpenId(null); triggerBookingModal('إنشاء المتاجر - باقة الانطلاقة'); }}
                           className="w-full py-3 rounded-xl font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/30 transition-colors shrink-0 cursor-pointer"
                         >
                           ابدأ متجرك الآن
                         </button>
                       </div>
                     </div>

                     {/* Package 2 */}
                     <div className="relative rounded-3xl p-6 flex flex-col h-full bg-black/40 border-2 border-brand-purple shadow-[0_0_40px_rgba(124,58,237,0.15)] transform md:-translate-y-2 hover:shadow-[0_0_50px_rgba(124,58,237,0.3)] transition-all duration-300 group">
                       <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-brand-blue to-brand-purple text-white text-xs font-bold rounded-full shadow-lg z-10">الأكثر طلبًا</div>
                       <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/20 to-transparent rounded-3xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                       <div className="relative z-10 flex flex-col h-full">
                         <h4 className="text-xl font-bold mb-2 text-white">النمو</h4>
                         <div className="flex items-baseline gap-1 mb-2">
                           <span className="text-sm text-gray-400">تبدأ من</span>
                           <span className="text-3xl font-bold text-white">2800</span>
                           <span className="text-sm text-gray-400">ريال</span>
                         </div>
                         <p className="text-xs text-gray-400 mb-6 h-10">للأنشطة التي تريد الانطلاق باحترافية وتحليل وتسويق ذكي.</p>
                         <ul className="space-y-3 flex-grow mb-6">
                           <li className="flex items-start gap-2 text-sm text-white font-bold"><ChevronDown className="w-4 h-4 text-brand-purple rotate-[-90deg] shrink-0 mt-0.5" /> <span>كل ما في الباقة الأولى +</span></li>
                           {['إنشاء الحسابات الإعلانية', 'تأسيس Google Ads & Meta', 'ربط البكسلات وأدوات التتبع', 'ربط جوجل اناليتكس GTM', 'تجهيز المتجر للتحليل'].map((txt, i) => (
                             <li key={i} className="flex items-start gap-2 text-sm text-gray-300"><ChevronDown className="w-4 h-4 text-brand-purple rotate-[-90deg] shrink-0 mt-0.5" /> <span>{txt}</span></li>
                           ))}
                         </ul>
                         <button 
                           onClick={() => { setOpenId(null); triggerBookingModal('إنشاء المتاجر - باقة النمو'); }}
                           className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-brand-blue to-brand-purple text-white border-none hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all shrink-0 cursor-pointer"
                         >
                           ابدأ النمو
                         </button>
                       </div>
                     </div>

                     {/* Package 3 */}
                     <div className="relative rounded-3xl p-6 flex flex-col h-full bg-black/40 border border-white/5 hover:border-brand-green/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300 group">
                       <div className="absolute inset-0 bg-gradient-to-b from-brand-green/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                       <div className="relative z-10 flex flex-col h-full">
                         <h4 className="text-xl font-bold mb-2 text-white">التشغيل الكامل</h4>
                         <div className="flex items-baseline gap-1 mb-2">
                           <span className="text-sm text-gray-400">تبدأ من</span>
                           <span className="text-3xl font-bold text-white">4500</span>
                           <span className="text-sm text-gray-400">ريال</span>
                         </div>
                         <p className="text-xs text-gray-400 mb-6 h-10">إدارة وتشغيل وتطوير متجرك بالكامل لتحقيق نمو حقيقي ومستدام.</p>
                         <ul className="space-y-3 flex-grow mb-6">
                           <li className="flex items-start gap-2 text-sm text-white font-bold"><ChevronDown className="w-4 h-4 text-brand-green rotate-[-90deg] shrink-0 mt-0.5" /> <span>كل ما في الباقة الأولى والثانية +</span></li>
                           {['إدارة المتجر وتحسين الواجهة', 'تحسين تجربة المستخدم UX', 'إعداد خطة تسويقية متكاملة', 'إدارة الحملات والسوشيال ميديا', 'متابعة الأداء ودعم فني مستمر'].map((txt, i) => (
                             <li key={i} className="flex items-start gap-2 text-sm text-gray-300"><ChevronDown className="w-4 h-4 text-brand-green rotate-[-90deg] shrink-0 mt-0.5" /> <span>{txt}</span></li>
                           ))}
                         </ul>
                         <button 
                           onClick={() => { setOpenId(null); triggerBookingModal('إنشاء المتاجر - التشغيل الكامل'); }}
                           className="w-full py-3 rounded-xl font-bold bg-brand-green/10 text-brand-green border border-brand-green/20 hover:bg-brand-green/30 transition-colors shrink-0 cursor-pointer"
                         >
                           ابدأ التشغيل الكامل
                         </button>
                       </div>
                     </div>

                     {/* Package 4 */}
                     <div className="relative rounded-3xl p-6 flex flex-col h-full bg-black/40 border border-white/5 hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] transition-all duration-300 group">
                       <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                       <div className="relative z-10 flex flex-col h-full">
                         <h4 className="text-xl font-bold mb-2 text-white">الباقة المخصصة</h4>
                         <div className="flex items-baseline gap-1 mb-2">
                           <span className="text-xl font-bold text-gray-300">تسعير مخصص</span>
                         </div>
                         <p className="text-xs text-gray-400 mb-6 h-10">حلول مخصصة بالكامل حسب احتياج نشاطك ومتطلبات مشروعك.</p>
                         <ul className="space-y-3 flex-grow mb-6">
                           {['تصميم خاص وحلول مخصصة', 'تطويرات برمجية وأنظمة خاصة', 'تكاملات API', 'استشارات متقدمة', 'أدوات ذكاء اصطناعي'].map((txt, i) => (
                             <li key={i} className="flex items-start gap-2 text-sm text-gray-300"><ChevronDown className="w-4 h-4 text-orange-400 rotate-[-90deg] shrink-0 mt-0.5" /> <span>{txt}</span></li>
                           ))}
                         </ul>
                         <button 
                           onClick={() => { setOpenId(null); triggerBookingModal('إنشاء المتاجر - الباقة المخصصة'); }}
                           className="w-full py-3 rounded-xl font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/30 transition-colors shrink-0 cursor-pointer"
                         >
                           اطلب خطة مخصصة
                         </button>
                       </div>
                     </div>
                   </div>
                 )}
               </div>

               {/* Modal Footer */}
               {!isStoreService && (
                 <div className="p-6 md:p-8 bg-white/5 border-t border-white/10 flex justify-end items-center gap-4 sticky bottom-0">
                   <button 
                      className="w-full md:w-auto flex items-center justify-center gap-2 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(79,142,247,0.3)] hover:shadow-[0_0_25px_rgba(79,142,247,0.5)] transform hover:scale-105 cursor-pointer"
                      style={{ backgroundColor: config.primaryColor }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenId(null);
                        triggerBookingModal(activeService.title);
                      }}
                    >
                     <span>اطلب الخدمة الآن</span>
                     <ArrowUpRight size={18} />
                   </button>
                 </div>
               )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
