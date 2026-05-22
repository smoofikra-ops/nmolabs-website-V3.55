import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronDown, Rocket, Search, Settings, ShoppingBag, Layout as LayoutIcon, Megaphone, LineChart, Cpu, ArrowLeft, Star, ShoppingCart } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const packages = [
  {
    id: 'starter',
    name: 'الانطلاقة',
    desc: 'كل ما تحتاجه لإطلاق متجر إلكتروني احترافي وجاهز للبيع.',
    icon: <Rocket className="w-6 h-6 text-brand-blue" />,
    features: [
      'اختيار اسم المتجر',
      'تصميم الشعار والهوية',
      'إنشاء وتهيئة المتجر',
      'إنشاء الصفحات الإضافية والسياسات',
      'رفع المنتجات',
      'ربط شركات الشحن',
      'إنشاء حسابات السوشيال ميديا',
      'ربط الحسابات بالمتجر',
      'حجز وربط الدومين',
      'تسليم متجر جاهز بالكامل'
    ],
    cta: 'ابدأ متجرك الآن',
    popular: false,
    color: 'from-blue-500/20 to-transparent',
    border: 'border-white/5 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]',
    buttonColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
  },
  {
    id: 'growth',
    name: 'النمو',
    badge: 'الأكثر طلبًا',
    desc: 'للأنشطة التي تريد الانطلاق باحترافية وتحليل وتسويق ذكي.',
    icon: <LineChart className="w-6 h-6 text-brand-purple" />,
    features: [
      'كل ما في الباقة الأولى +',
      'إنشاء الحسابات الإعلانية',
      'تأسيس Google Ads',
      'تأسيس Meta Ads',
      'ربط البكسلات'
    ],
    cta: 'ابدأ النمو',
    popular: true,
    color: 'from-brand-purple/30 to-brand-blue/10',
    border: 'border-brand-purple',
    buttonColor: 'bg-gradient-to-r from-brand-blue to-brand-purple text-white shadow-[0_0_20px_rgba(124,58,237,0.5)] animate-pulse-slow hover:shadow-[0_0_35px_rgba(124,58,237,0.8)]'
  },
  {
    id: 'full-ops',
    name: 'التشغيل الكامل',
    desc: 'إدارة وتشغيل وتطوير متجرك بالكامل لتحقيق نمو حقيقي ومستدام.',
    icon: <Settings className="w-6 h-6 text-brand-green" />,
    features: [
      'كل ما في الباقة الأولى والثانية +',
      'إدارة المتجر',
      'تحسين مستمر للواجهة',
      'تحسين تجربة المستخدم UX',
      'دراسة المنافسين',
      'إعداد خطة تسويقية متكاملة',
      'إدارة الحملات الإعلانية',
      'إدارة السوشيال ميديا',
      'إنشاء محتوى تسويقي',
      'تحسين التحويل',
      'متابعة الأداء والتحليل',
      'دعم فني مستمر',
      'تحسين المبيعات والتحويل'
    ],
    cta: 'ابدأ التشغيل الكامل',
    popular: false,
    color: 'from-brand-green/20 to-transparent',
    border: 'border-white/5 hover:border-brand-green/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]',
    buttonColor: 'bg-brand-green/10 text-brand-green border-brand-green/20 hover:bg-brand-green/30 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
  },
  {
    id: 'custom',
    name: 'الباقة المخصصة',
    desc: 'حلول مخصصة بالكامل حسب احتياج نشاطك ومتطلبات مشروعك.',
    icon: <Cpu className="w-6 h-6 text-orange-400" />,
    features: [
      'تصميم خاص',
      'حلول مخصصة',
      'أنظمة خاصة',
      'تطويرات برمجية',
      'تكاملات API',
      'حلول SaaS',
      'أدوات ذكاء اصطناعي',
      'تخصيص كامل'
    ],
    cta: 'اطلب خطة مخصصة',
    popular: false,
    color: 'from-orange-500/20 to-transparent',
    border: 'border-white/5 hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]',
    buttonColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.4)]'
  }
];

const comparisonFeatures = [
  { name: 'إنشاء وتهيئة المتجر', starter: true, growth: true, 'full-ops': true, custom: true },
  { name: 'تصميم الشعار والهوية', starter: true, growth: true, 'full-ops': true, custom: 'هوية مخصصة متقدمة' },
  { name: 'حجز وربط الدومين', starter: true, growth: true, 'full-ops': true, custom: true },
  { name: 'تأسيس الحملات وربط البكسلات', starter: false, growth: true, 'full-ops': true, custom: true },
  { name: 'إدارة المتجر والحملات', starter: false, growth: false, 'full-ops': true, custom: true },
  { name: 'دراسة المنافسين وتحسين المحتوى', starter: false, growth: false, 'full-ops': true, custom: true },
  { name: 'تطويرات برمجية وتكاملات API', starter: false, growth: false, 'full-ops': false, custom: true },
  { name: 'حلول ذكاء اصطناعي وأنظمة خاصة', starter: false, growth: false, 'full-ops': false, custom: true }
];

const timeline = [
  { step: 1, title: 'دراسة النشاط', icon: <Search className="w-5 h-5" /> },
  { step: 2, title: 'بناء الهوية', icon: <Star className="w-5 h-5" /> },
  { step: 3, title: 'إنشاء المتجر', icon: <ShoppingCart className="w-5 h-5" /> },
  { step: 4, title: 'ربط الأنظمة', icon: <Cpu className="w-5 h-5" /> },
  { step: 5, title: 'إطلاق الحملات', icon: <Megaphone className="w-5 h-5" /> },
  { step: 6, title: 'التحليل والتحسين', icon: <LineChart className="w-5 h-5" /> },
  { step: 7, title: 'النمو والتوسع', icon: <Rocket className="w-5 h-5" /> },
];

export const EcommerceSaas = () => {
  const [hoveredPkg, setHoveredPkg] = useState<string | null>(null);

  return (
    <section className="py-32 relative bg-[#07070F] overflow-hidden" id="ecommerce">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-purple/10 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[150px] opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-blue/30 text-brand-blue font-medium mb-6 animate-pulse-slow">
            <ShoppingBag className="w-4 h-4" />
            <span>قسم إنشاء المتاجر الإلكترونية</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight font-tajawal">
            أطلق متجرك الإلكتروني… <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-blue via-brand-purple to-brand-blue animate-gradient bg-300%">
              وانطلق نحو النمو الحقيقي
            </span>
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed font-light">
            من اختيار الاسم والهوية وحتى التشغيل والتسويق الكامل — نبني لك متجرًا احترافيًا جاهزًا للنمو والمبيعات.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 xl:gap-8 mb-32">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onMouseEnter={() => setHoveredPkg(pkg.id)}
              onMouseLeave={() => setHoveredPkg(null)}
              className={`relative rounded-3xl p-8 lg:p-6 xl:p-8 flex flex-col h-full transition-all duration-500
                bg-black/40 backdrop-blur-xl border ${pkg.border}
                ${pkg.popular ? 'shadow-[0_0_40px_rgba(124,58,237,0.15)] transform md:-translate-y-4' : 'shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)]'}
                ${hoveredPkg === pkg.id && !pkg.popular ? 'transform md:-translate-y-2 shadow-[0_0_30px_rgba(79,142,247,0.1)]' : ''}
              `}
            >
              {/* Background gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-b ${pkg.color} rounded-3xl opacity-50 pointer-events-none transition-opacity duration-300 ${hoveredPkg === pkg.id ? 'opacity-100' : ''}`}></div>

              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white text-sm font-bold rounded-full shadow-lg z-10 whitespace-nowrap">
                  {pkg.badge}
                </div>
              )}

              <div className="relative z-10 flex flex-col h-full">
                <div className="bg-black/30 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 mb-6">
                  {pkg.icon}
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{pkg.name}</h3>
                <p className="text-sm text-gray-400 mb-8 min-h-[60px]">{pkg.desc}</p>
                
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>
                
                <ul className="space-y-4 flex-grow mb-8 overflow-y-auto pr-2 custom-scrollbar">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                      <span className={feat.includes('+') ? 'font-bold text-white' : ''}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 border ${pkg.buttonColor}`}>
                  {pkg.cta}
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mt-16 mb-32 overflow-x-auto rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md custom-scrollbar"
        >
          <table className="w-full text-left border-collapse" dir="rtl">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-6 text-xl font-bold text-white min-w-[200px]">المميزات</th>
                {packages.map(pkg => (
                  <th key={pkg.id} className="p-6 text-center min-w-[150px]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center">
                        {pkg.icon}
                      </div>
                      <span className="font-bold text-white text-lg">{pkg.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feat, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-6 text-gray-300 font-medium">{feat.name}</td>
                  {packages.map(pkg => {
                    // map package id to feature key
                    const key = pkg.id as keyof typeof feat;
                    const value = feat[key];
                    return (
                      <td key={pkg.id} className="p-6 text-center">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <CheckCircle2 className="w-6 h-6 text-brand-green mx-auto" />
                          ) : (
                            <span className="w-4 h-px bg-gray-600 block mx-auto"></span>
                          )
                        ) : (
                          <span className="text-sm font-bold text-gray-200">{value as React.ReactNode}</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Timeline / Journey Section */}
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="mt-32"
        >
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4 font-tajawal">رحلة إطلاق المتجر</h3>
            <p className="text-gray-400">خطوات واضحة ومدروسة لانطلاقة مثالية</p>
          </div>
          
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-purple/20 to-transparent -translate-y-1/2 hidden md:block"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
              {timeline.map((item, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center w-full md:w-auto">
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 rounded-full bg-black/60 border border-brand-purple/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(124,58,237,0.1)] hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:border-brand-purple transition-all duration-300"
                  >
                    {item.icon}
                  </motion.div>
                  <span className="text-sm font-bold text-white mb-1">الخطوة {item.step}</span>
                  <span className="text-sm text-gray-400 text-center whitespace-nowrap">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Why NmoLabs section */}
        <div className="mt-32 grid md:grid-cols-2 gap-12 items-center bg-black/20 p-8 md:p-12 rounded-3xl border border-white/5 backdrop-blur-md">
          <div>
            <h3 className="text-3xl font-bold mb-6 font-tajawal">لماذا <span className="text-brand-blue">NMOLABS</span>؟</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              ليست مجرد جهة تنشئ متجراً لك وفقط، بل شريك متكامل يساعدك في إطلاق، إدارة، وتحسين متجرك الإلكتروني.
            </p>
            <ul className="space-y-4">
              {['تطبيق أفضل ممارسات تجربة المستخدم (UX)', 'تحليل وتتبع كل زائر لتحسين العائد (ROI)', 'التكامل مع أحدث أدوات الذكاء الاصطناعي', 'دعم مستمر لضمان نمو مبيعاتك'].map((feat, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-brand-blue" />
                  </div>
                  <span className="text-gray-300">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-purple blur-[60px] opacity-20 rounded-full"></div>
            <div className="relative glass-panel rounded-2xl p-6 border border-white/10 flex flex-col gap-4 shadow-2xl">
              <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                <span className="text-gray-400">متوسط زيادة المبيعات</span>
                <span className="text-brand-green font-bold text-xl">+145%</span>
              </div>
              <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                <span className="text-gray-400">تحسين معدل التحويل</span>
                <span className="text-brand-blue font-bold text-xl">+2.4x</span>
              </div>
              <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                <span className="text-gray-400">وقت الانطلاق</span>
                <span className="text-brand-purple font-bold text-xl">أسرع بـ 3 أيام</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
