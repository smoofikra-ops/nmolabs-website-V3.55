import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Activity, LineChart, Target, Hash, CheckSquare, Search, Code, Link as LinkIcon, Share2, PenTool, Calendar, Headphones, MessageSquare, Wrench, Zap, Type, MessageCircle, ChevronDown, CheckCircle2, AlertTriangle, MapPin, Layout } from 'lucide-react';
import { ToolAnalyzerModal } from './ToolAnalyzerModal';

const IconMapper = ({ name, className }: { name: string, className?: string }) => {
  switch (name) {
    case 'Activity': return <Activity className={className} />;
    case 'CheckSquare': return <CheckSquare className={className} />;
    case 'LineChart': return <LineChart className={className} />;
    case 'Search': return <Search className={className} />;
    case 'Code': return <Code className={className} />;
    case 'Hash': return <Hash className={className} />;
    case 'Target': return <Target className={className} />;
    case 'LinkIcon': return <LinkIcon className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Type': return <Type className={className} />;
    case 'MessageCircle': return <MessageCircle className={className} />;
    case 'Layout': return <Layout className={className} />;
    case 'AlertTriangle': return <AlertTriangle className={className} />;
    case 'MapPin': return <MapPin className={className} />;
    default: return <Wrench className={className} />;
  }
};

const getToolDescription = (name: string) => {
  switch (name) {
    case 'فاحص SEO': return 'احصل على تحليل شامل لتهيئة محركات البحث لمتجرك';
    case 'محلل UX': return 'اكتشف مشاكل واجهة المستخدم وتجربة العميل';
    case 'مدقق الكلمات المفتاحية': return 'اعثر على أفضل الكلمات المفتاحية لجلب الزيارات';
    case 'محلل الروابط الخلفية': return 'افحص قوة الروابط الخلفية التي تشير لمتجرك';
    case 'تحليل المنافسين': return 'راقب أداء منافسيك واستراتيجياتهم';
    case 'تحليل مبيعات السوق': return 'اكتشف المنتجات الأكثر مبيعاً في قطاعك';
    case 'محسن Google Ads': return 'أدوات متقدمة لتحسين أداء حملات جوجل';
    case 'منشئ إعلانات Meta': return 'اصنع إعلانات جذابة لفيسبوك وانستقرام';
    case 'أفكار سناب وتيك توك': return 'احصل على أفكار إبداعية لحملات الفيديو';
    case 'حاسبة الحملات': return 'احسب التكاليف المتوقعة والعائد على الاستثمار';
    case 'حاسبة أداء المتجر': return 'قيم أداء متجرك بناءً على المقاييس الأساسية';
    case 'مولد العناوين': return 'أنشئ عناوين جذابة للمنتجات والمقالات';
    case 'فاحص السرعة': return 'تحقق من سرعة تحميل صفحات متجرك';
    case 'مولد ردود العملاء': return 'اصنع ردوداً احترافية لخدمة العملاء';
    case 'إصلاح Merchant Center': return 'حل مشاكل تعليق المنتجات في جوجل شوبنق';
    case 'حل تعليق حسابات Ads': return 'إرشادات لفك تعليق حسابات جوجل الإعلانية';
    case 'تحسين الخرائط Google Business': return 'تصدر نتائج البحث المحلي في خرائط جوجل';
    case 'إصلاح فهرسة Search Console': return 'حل مشاكل عدم ظهور صفحاتك في بحث جوجل';
    default: return `استخدم أداة ${name} لتحسين أداء متجرك وزيادة مبيعاتك`;
  }
};

export const ToolsGrid = () => {
  const { config } = useSite();
  const { content } = useContent();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pricingPackages = content.packages.map((pkg, i) => {
    const isCustom = pkg.price.includes('أسعار') || pkg.price === 'مخصصة' || isNaN(Number(pkg.price));
    return {
      ...pkg,
      desc: pkg.description,
      buttonLabel: pkg.ctaText || (i === 0 ? 'ابدأ مجاناً' : i === 3 ? 'تواصل معنا' : 'اختر الباقة'),
      popular: pkg.isFeatured,
      color: i === 0 ? '#22d3a0' : i === 1 ? '#4f8ef7' : i === 2 ? '#7c3aed' : '#10b981',
      currency: isCustom ? '' : 'ر.س',
      period: isCustom ? '' : (i === 0 ? '/ مدى الحياة' : '/ شهرياً'),
      contactLink: pkg.ctaLink || (i === 3 && config.contactNumber ? `https://wa.me/${config.contactNumber.replace(/[^0-9]/g, '')}` : undefined)
    };
  });

  if (!config.sections.tools) return null;

  return (
    <section className="py-32 relative bg-[color:var(--glass-bg)] bg-radial-glow" id="tools">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[color:var(--color-brand-dark)] opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-[color:var(--color-text-main)]"
          >
            كل أدوات النمو في مكان واحد
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[color:var(--color-text-muted)] max-w-3xl mx-auto font-light"
          >
            6 أقسام رئيسية، 25+ أداة ذكية، ومحتوى مخصص للسوق السعودي.
          </motion.p>
        </div>

        {/* Tools Layout (Sidebar + Grid) */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 max-w-7xl mx-auto mb-32" id="tools-container">
          
          {/* Categories Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col max-md:flex-row max-md:overflow-x-auto scrollbar-hide gap-3 shrink-0 max-md:pb-4 max-md:px-1">
            {config.toolCategories?.map((category, idx) => (
              <button
                key={category.id || idx}
                onClick={() => setOpenIndex(idx)}
                className={`text-right px-6 py-5 rounded-2xl flex items-center justify-between transition-all duration-300 border shrink-0 max-md:whitespace-nowrap max-md:w-auto max-md:px-4 max-md:py-3 max-md:text-sm max-md:gap-3 ${
                  openIndex === idx 
                    ? 'bg-[color:var(--color-brand-blue-val)]/15 border-[color:var(--color-brand-blue-val)]/50 text-[color:var(--color-brand-green-val)] shadow-[inset_0_2px_8px_rgba(79,142,247,0.15)]' 
                    : 'bg-black/40 border-black shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] text-gray-400 hover:bg-black/60 hover:text-white hover:border-white/10'
                }`}
              >
                <span className={`font-bold text-lg max-md:text-sm ${openIndex === idx ? 'text-shadow-sm' : ''}`}>{category.title}</span>
                <div className={`w-10 h-10 max-md:w-8 max-md:h-8 rounded-xl flex items-center justify-center ${openIndex === idx ? 'bg-[color:var(--color-brand-blue-val)]/20' : 'bg-black/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] border border-white/5'}`}>
                  <IconMapper name={category.tools?.[0]?.iconName || 'Wrench'} className={`w-5 h-5 max-md:w-4 max-md:h-4 ${openIndex === idx ? 'text-[color:var(--color-brand-green-val)] drop-shadow-[0_0_5px_rgba(34,211,160,0.5)]' : 'opacity-60'}`} />
                </div>
              </button>
            ))}
          </div>
          
          {/* Active Category Tools Grid */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <AnimatePresence mode="wait">
              {config.toolCategories && config.toolCategories[openIndex || 0] && (
                <motion.div
                  key={openIndex || 0}
                  initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: 20, filter: 'blur(10px)', position: 'absolute' }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <div className="mb-8 p-4">
                    <h3 className="text-3xl font-bold text-white mb-2">{config.toolCategories[openIndex || 0].title}</h3>
                    <p className="text-gray-400">تشخيص وتطوير أداء متجرك من كل زاوية باستخدام أفضل الأدوات.</p>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    {config.toolCategories[openIndex || 0].tools.map((tool, i) => (
                      <div 
                        key={i} 
                        onClick={() => {
                          setSelectedTool(tool);
                          setIsModalOpen(true);
                        }}
                        tabIndex={0}
                        className={`relative p-8 rounded-3xl flex flex-col justify-between transition-all group/tooltip min-h-[160px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand-blue-val)]/50 ${
                          tool.locked 
                            ? 'bg-black/30 border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] hover:bg-black/40 hover:border-white/10' 
                            : 'bg-black/50 shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.05)] border border-black hover:border-[color:var(--color-brand-blue-val)]/30 hover:shadow-[0_0_20px_rgba(79,142,247,0.1),inset_0_4px_12px_rgba(0,0,0,0.9)]'
                        }`}
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 transition-all duration-300 pointer-events-none z-50 transform group-hover/tooltip:-translate-y-2 group-focus-within/tooltip:-translate-y-2 w-max max-w-xs">
                          <div className="bg-[color:var(--bg-color-darker)] backdrop-blur text-[color:var(--color-text-main)] p-3 rounded-xl shadow-xl border border-[color:var(--glass-border)] text-right">
                            <h5 className="font-bold text-sm mb-1 text-[color:var(--color-brand-blue-val)]">{tool.name}</h5>
                            <p className="text-xs text-[color:var(--color-text-muted)] whitespace-normal leading-relaxed">{getToolDescription(tool.name)}</p>
                          </div>
                        </div>

                        <div className="flex items-start justify-between mb-6 relative z-10">
                          <div>
                            <h4 className="font-bold text-lg text-white mb-1 group-hover:text-[color:var(--color-brand-blue-val)] transition-colors">{tool.name}</h4>
                            <p className="text-sm text-gray-500">أداة مساعدة مخصصة</p>
                          </div>
                          <div className={`w-14 h-14 rounded-2xl bg-black/60 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] border border-white/5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-[color:var(--color-brand-blue-val)]/10`}>
                            <IconMapper name={tool.iconName} className={`w-7 h-7 ${tool.iconColor || 'text-gray-400'} group-hover:text-[color:var(--color-brand-blue-val)] transition-colors`} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          {tool.locked ? (
                            <div className="flex items-center gap-1.5 text-xs text-[color:var(--color-brand-purple-val)] bg-[color:var(--color-brand-purple-val)]/10 border border-[color:var(--color-brand-purple-val)]/20 px-3 py-1.5 rounded-full font-bold shadow-sm">
                              <Lock size={12} />
                              <span>مدفوعة</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs text-[color:var(--color-brand-green-val)] bg-[color:var(--color-brand-green-val)]/10 border border-[color:var(--color-brand-green-val)]/20 px-3 py-1.5 rounded-full font-bold shadow-sm">
                              <Zap size={12} />
                              <span>أداة مجانية</span>
                            </div>
                          )}
                          
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity ${tool.locked ? 'text-[color:var(--color-brand-purple-val)]' : 'text-[color:var(--color-brand-blue-val)]'}`}>
                            <Lock size={14} className={tool.locked ? 'block' : 'hidden'} />
                            <Zap size={14} className={tool.locked ? 'hidden' : 'block'} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Pricing Packages */}
        <div className="mt-20 pt-20 border-t border-white/5" id="pricing-packages">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[color:var(--color-text-main)]">باقات الاشتراك</h2>
            <p className="text-gray-400">اختر الباقة التي تناسب حجم نشاطك</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPackages.map((pkg, i) => (
              <motion.div
                key={i}
                id={`package-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-black/40 relative rounded-3xl p-8 border ${pkg.popular ? 'border-[color:var(--color-brand-blue-val)] shadow-[0_0_30px_rgba(79,142,247,0.15)] transform md:-translate-y-4' : 'border-[color:var(--glass-border)] shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)]'} flex flex-col h-full`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-[color:var(--color-brand-blue-val)] text-white text-xs font-bold rounded-full">
                    الأكثر طلباً
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2 text-white">{pkg.name}</h3>
                <p className="text-sm text-gray-400 mb-6 min-h-[40px]">{pkg.desc}</p>
                
                <div className="mb-8 font-english" dir="ltr">
                  <span className="text-4xl font-black text-white">{pkg.price}</span>
                  <span className="text-xl text-gray-400 ml-1">{pkg.currency}</span>
                  <span className="text-sm text-gray-500 ml-1 block mt-1">{pkg.period}</span>
                </div>
                
                <div className="space-y-4 mb-8 flex-1">
                  {pkg.features.map((feat, fi) => (
                    <div key={fi} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: pkg.color }} />
                      <span className="text-sm text-gray-300">{feat}</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => triggerBookingModal(pkg.buttonLabel.includes('تواصل') || pkg.contactLink ? 'استشارة عامة' : `باقة الأسعار - ${pkg.name}`)}
                  className="w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center text-center cursor-pointer"
                  style={{ 
                    backgroundColor: pkg.popular ? pkg.color : 'rgba(255,255,255,0.05)',
                    color: pkg.popular ? '#fff' : pkg.color,
                    border: pkg.popular ? 'none' : `1px solid ${pkg.color}40`
                  }}
                  onMouseEnter={(e) => {
                    if (!pkg.popular) e.currentTarget.style.backgroundColor = `${pkg.color}15`;
                  }}
                  onMouseLeave={(e) => {
                    if (!pkg.popular) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  }}
                >
                  {pkg.buttonLabel}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <ToolAnalyzerModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tool={selectedTool}
        />

      </div>
    </section>
  );
};
