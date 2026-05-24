import React, { useState, useEffect, useRef } from 'react';
import { useSite } from '../context/SiteContext';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Activity, LineChart, Target, Hash, CheckSquare, Search, Code, Link as LinkIcon, Share2, PenTool, Calendar, Headphones, MessageSquare, Wrench, Zap, Type, MessageCircle, ChevronDown, CheckCircle2, AlertTriangle, MapPin, Layout } from 'lucide-react';
import { ToolAnalyzerModal } from './ToolAnalyzerModal';
import { triggerBookingModal } from './BookingModal';

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

const getToolTheme = (index: number, locked: boolean) => {
  if (locked) {
    return {
      border: 'border-white/5 hover:border-white/20',
      glow: 'shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(255,255,255,0.05),inset_0_2px_10px_rgba(0,0,0,0.8)]',
      text: 'text-gray-400',
      iconBg: 'bg-black/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] border border-white/5',
      badge: 'text-[#7c3aed] bg-[#7c3aed]/10 border-[#7c3aed]/20',
      iconColor: 'text-gray-400'
    };
  }
  
  const themes = [
    {
      border: 'border-[#2bc2c2]/20 hover:border-[#2bc2c2]/50',
      glow: 'shadow-[0_0_20px_rgba(43,194,194,0.05),inset_0_4px_12px_rgba(0,0,0,0.9)] hover:shadow-[0_0_30px_rgba(43,194,194,0.25),inset_0_4px_12px_rgba(0,0,0,0.9)]',
      text: 'text-[#2bc2c2]',
      iconBg: 'bg-[#2bc2c2]/10 group-hover/card:bg-[#2bc2c2]/20 border border-[#2bc2c2]/10',
      badge: 'text-[#2bc2c2] bg-[#2bc2c2]/10 border-[#2bc2c2]/20',
      iconColor: 'text-[#2bc2c2]'
    },
    {
      border: 'border-[#7C3AED]/20 hover:border-[#7C3AED]/50',
      glow: 'shadow-[0_0_20px_rgba(124,58,237,0.05),inset_0_4px_12px_rgba(0,0,0,0.9)] hover:shadow-[0_0_30px_rgba(124,58,237,0.25),inset_0_4px_12px_rgba(0,0,0,0.9)]',
      text: 'text-[#7C3AED]',
      iconBg: 'bg-[#7C3AED]/10 group-hover/card:bg-[#7C3AED]/20 border border-[#7C3AED]/10',
      badge: 'text-[#7C3AED] bg-[#7C3AED]/10 border-[#7C3AED]/20',
      iconColor: 'text-[#7C3AED]'
    },
    {
      border: 'border-[#22d3a0]/20 hover:border-[#22d3a0]/50',
      glow: 'shadow-[0_0_20px_rgba(34,211,160,0.05),inset_0_4px_12px_rgba(0,0,0,0.9)] hover:shadow-[0_0_30px_rgba(34,211,160,0.25),inset_0_4px_12px_rgba(0,0,0,0.9)]',
      text: 'text-[#22d3a0]',
      iconBg: 'bg-[#22d3a0]/10 group-hover/card:bg-[#22d3a0]/20 border border-[#22d3a0]/10',
      badge: 'text-[#22d3a0] bg-[#22d3a0]/10 border-[#22d3a0]/20',
      iconColor: 'text-[#22d3a0]'
    },
    {
      border: 'border-[#f43f5e]/20 hover:border-[#f43f5e]/50',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.05),inset_0_4px_12px_rgba(0,0,0,0.9)] hover:shadow-[0_0_30px_rgba(244,63,94,0.25),inset_0_4px_12px_rgba(0,0,0,0.9)]',
      text: 'text-[#f43f5e]',
      iconBg: 'bg-[#f43f5e]/10 group-hover/card:bg-[#f43f5e]/20 border border-[#f43f5e]/10',
      badge: 'text-[#f43f5e] bg-[#f43f5e]/10 border-[#f43f5e]/20',
      iconColor: 'text-[#f43f5e]'
    }
  ];
  return themes[index % themes.length];
};

export const ToolsGrid = () => {
  const { config } = useSite();
  const { content } = useContent();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedPackageIdx, setExpandedPackageIdx] = useState<number | null>(1); // default to popular package (1)
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll mobile marquee effect
  useEffect(() => {
    const container = categoriesRef.current;
    if (!container || window.innerWidth >= 768) return;

    let animationFrameId: number;
    const scrollSpeed = 0.5; // pixels per frame

    const autoScroll = () => {
      if (!isPaused && container) {
        // RTL scroll moves negative. Adjusting safely.
        container.scrollLeft -= scrollSpeed;
        
        // Wrap around circular logic
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (Math.abs(container.scrollLeft) >= maxScroll - 1) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused]);

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

        {/* Mobile Swipe Hint */}
        <div className="hidden max-md:flex items-center justify-center gap-1.5 text-xs text-[color:var(--color-brand-blue-val)] mb-4 animate-pulse">
          <span>يمكنك السحب يميناً ويساراً ↔</span>
        </div>

        {/* Tools Layout (Sidebar + Grid) */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 max-w-7xl mx-auto mb-32" id="tools-container">
          
          {/* Categories Sidebar */}
          <div 
            ref={categoriesRef}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setTimeout(() => setIsPaused(false), 1500)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="w-full md:w-1/3 lg:w-1/4 grid grid-cols-3 max-md:gap-2 md:flex md:flex-col gap-3 shrink-0 keep-grid"
          >
            {config.toolCategories?.map((category, idx) => (
              <button
                key={category.id || idx}
                onClick={() => setOpenIndex(idx)}
                className={`text-right px-6 py-5 rounded-2xl flex items-center justify-between transition-all duration-300 border shrink-0 
                  max-md:flex-col max-md:items-center max-md:justify-center max-md:text-center max-md:p-2.5 max-md:gap-1.5 max-md:rounded-xl
                  ${
                    openIndex === idx 
                      ? 'bg-[color:var(--color-brand-blue-val)]/15 border-[color:var(--color-brand-blue-val)]/60 text-[color:var(--color-brand-green-val)] shadow-[0_0_15px_rgba(43,194,194,0.15)]' 
                      : 'bg-black/50 border-white/10 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] text-gray-400 hover:bg-black/60 hover:text-white hover:border-white/15'
                  }`}
              >
                <span className={`font-bold text-lg max-md:text-[10px] max-md:leading-tight ${openIndex === idx ? 'text-shadow-sm' : ''}`}>{category.title}</span>
                <div className={`w-10 h-10 max-md:w-7 max-md:h-7 rounded-xl flex items-center justify-center ${openIndex === idx ? 'bg-[color:var(--color-brand-blue-val)]/20' : 'bg-black/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] border border-white/5 shrink-0'}`}>
                  <IconMapper name={category.tools?.[0]?.iconName || 'Wrench'} className={`w-5 h-5 max-md:w-3.5 max-md:h-3.5 ${openIndex === idx ? 'text-[color:var(--color-brand-green-val)] drop-shadow-[0_0_5px_rgba(34,211,160,0.5)]' : 'opacity-60'}`} />
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
                  
                  <div className="bg-black/30 border border-white/10 rounded-3xl p-6 max-md:p-4 shadow-inner">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {config.toolCategories[openIndex || 0].tools.map((tool, i) => {
                        const theme = getToolTheme(i, tool.locked);
                        return (
                          <div 
                            key={i} 
                            onClick={() => {
                              setSelectedTool(tool);
                              setIsModalOpen(true);
                            }}
                            tabIndex={0}
                            className={`relative p-8 max-md:p-5 rounded-3xl max-md:rounded-2xl flex flex-col justify-between transition-all duration-300 group/tooltip group/card min-h-[160px] max-md:min-h-[125px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand-blue-val)]/50 bg-black/50 border ${theme.border} ${theme.glow} max-md:bg-[#0c1220] max-md:border-white/20 max-md:shadow-[0_0_12px_rgba(43,194,194,0.08)]`}
                          >
                            {/* Tooltip on Desktop only */}
                            {!isMobile && (
                              <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 transition-all duration-300 pointer-events-none z-50 transform group-hover/tooltip:-translate-y-2 group-focus-within/tooltip:-translate-y-2 w-max max-w-xs">
                                <div className="bg-[color:var(--bg-color-darker)] backdrop-blur text-[color:var(--color-text-main)] p-3 rounded-xl shadow-xl border border-[color:var(--glass-border)] text-right">
                                  <h5 className="font-bold text-sm mb-1 text-[color:var(--color-brand-blue-val)]">{tool.name}</h5>
                                  <p className="text-xs text-[color:var(--color-text-muted)] whitespace-normal leading-relaxed">{getToolDescription(tool.name)}</p>
                                </div>
                              </div>
                            )}

                            <div className="flex items-start justify-between mb-6 relative z-10 gap-3">
                              <div className="flex-1">
                                <h4 className="font-bold text-base md:text-lg text-white mb-1 group-hover/card:text-[color:var(--color-brand-blue-val)] transition-colors">{tool.name}</h4>
                                <p className="text-xs text-gray-400 font-light mt-1.5 leading-relaxed">
                                  {getToolDescription(tool.name)}
                                </p>
                              </div>
                              <div className={`w-12 h-12 rounded-xl ${theme.iconBg} flex items-center justify-center transition-transform duration-300 group-hover/card:scale-110 shrink-0`}>
                                <IconMapper name={tool.iconName} className={`w-6 h-6 ${theme.iconColor} transition-colors`} />
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                              {tool.locked ? (
                                <div className="flex items-center gap-1.5 text-xs text-[#7c3aed] bg-[#7c3aed]/10 border border-[#7c3aed]/20 px-3 py-1.5 rounded-full font-bold shadow-sm">
                                  <Lock size={12} />
                                  <span>مدفوعة</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-xs text-[#22d3a0] bg-[#22d3a0]/10 border border-[#22d3a0]/20 px-3 py-1.5 rounded-full font-bold shadow-sm">
                                  <Zap size={12} />
                                  <span>أداة مجانية</span>
                                </div>
                              )}
                              
                              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 opacity-0 group-hover/card:opacity-100 transition-opacity text-white">
                                {tool.locked ? <Lock size={14} /> : <Zap size={14} />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
          
          {isMobile ? (
            <div className="flex flex-col gap-4 w-full px-2">
              {pricingPackages.map((pkg, i) => {
                const isExpanded = expandedPackageIdx === i;
                return (
                  <div 
                    key={i}
                    className={`bg-black/50 border rounded-2xl overflow-hidden transition-all duration-300 ${isExpanded ? 'border-[color:var(--color-brand-blue-val)] shadow-[0_0_20px_rgba(79,142,247,0.15)]' : 'border-white/10'}`}
                  >
                    {/* Accordion Trigger Header */}
                    <button
                      onClick={() => setExpandedPackageIdx(isExpanded ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-right cursor-pointer"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-white">{pkg.name}</h3>
                          {pkg.popular && (
                            <span className="text-[9px] font-bold px-2 py-0.5 bg-[color:var(--color-brand-blue-val)]/25 text-[color:var(--color-brand-blue-val)] rounded-full border border-[color:var(--color-brand-blue-val)]/30">الأكثر طلبًا</span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400 font-light text-right">{pkg.desc}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end font-english" dir="ltr">
                          <span className="text-sm font-black text-white">{pkg.price} {pkg.currency}</span>
                          <span className="text-[9px] text-gray-500">{pkg.period}</span>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-gray-400 shrink-0"
                        >
                          <ChevronDown size={20} />
                        </motion.div>
                      </div>
                    </button>

                    {/* Accordion Content */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-white/5 bg-black/20"
                        >
                          <div className="p-5 space-y-4">
                            <div className="space-y-3">
                              {pkg.features.map((feat, fi) => (
                                <div key={fi} className="flex items-start gap-2.5">
                                  <CheckCircle2 className="w-4 h-4 text-[color:var(--color-brand-blue-val)] shrink-0 mt-0.5" />
                                  <span className="text-xs text-gray-300 font-light">{feat}</span>
                                </div>
                              ))}
                            </div>
                            <button 
                              onClick={() => {
                                if (i === 0) {
                                  setAlertMessage("يمكنك الآن استخدام الأدوات المجانية. نتمنى لك التوفيق في تجارتك الإلكترونية ومشروعك.");
                                } else {
                                  setAlertMessage("هذه الخدمة قيد التطوير حاليًا وسيتم تفعيل الاشتراك قريبًا.");
                                }
                              }}
                              className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-blue to-brand-purple hover:shadow-[0_0_20px_rgba(79,142,247,0.4)] transition-all cursor-pointer text-center border-none"
                            >
                              {pkg.buttonLabel}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-hide gap-8 pb-4 w-full px-2">
              {pricingPackages.map((pkg, i) => (
                <motion.div
                  key={i}
                  id={`package-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`snap-center shrink-0 w-[85vw] md:w-auto bg-black/40 relative rounded-3xl p-8 border ${pkg.popular ? 'border-[color:var(--color-brand-blue-val)] shadow-[0_0_30px_rgba(79,142,247,0.15)] transform md:-translate-y-4' : 'border-[color:var(--glass-border)] shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)]'} flex flex-col h-full`}
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
          )}
        </div>

        <ToolAnalyzerModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tool={selectedTool}
        />

        {/* Custom Premium Alert Dialog for Mobile Package Taps */}
        <AnimatePresence>
          {alertMessage && (
            <div 
              className="fixed inset-0 z-[300] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 rtl text-right"
              onClick={() => setAlertMessage(null)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#090d16] border-2 border-[#2bc2c2]/40 rounded-3xl p-6 max-w-sm w-full shadow-[0_0_30px_rgba(43,194,194,0.25)] relative"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#2bc2c2]/10 flex items-center justify-center text-[#2bc2c2] shrink-0">
                    <Zap size={20} className="animate-pulse" />
                  </div>
                  <h3 className="font-bold text-lg text-white">إشعار المنصة</h3>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed font-light mb-6">
                  {alertMessage}
                </p>
                <button 
                  onClick={() => setAlertMessage(null)}
                  className="w-full py-3 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold text-sm rounded-xl active:scale-95 transition-all cursor-pointer shadow-lg"
                >
                  حسنًا، فهمت
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
