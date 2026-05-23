import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { triggerBookingModal } from './BookingModal';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import branchImg from '../assets/images/regenerated_image_1779062361308.png';
import ecommerceImg from '../assets/images/regenerated_image_1779062368023.png';
import sallaLogo from '../assets/images/regenerated_image_1779415116970.png';
import zidLogo from '../assets/images/regenerated_image_1779415117734.svg';

const branchChallenges = [
  {
    title: 'الضغط الموسمي وقلة الكفاءة',
    desc: 'المواسم والعروض تخلق ضغط هائل على الفروع، مما يدفع لتوظيف بائعين موسميين بسرعة مع تفاوت في جودة الخدمة.'
  },
  {
    title: 'ضياع فرص البيع وقت الزحام',
    desc: 'الانتظار الطويل يخلي العملاء يغادرون بدون شراء وتضيع فرص البيع الإضافي.'
  },
  {
    title: 'صعوبة الإلمام بآلاف المنتجات',
    desc: 'العدد الكبير للمنتجات وتغير الأسعار والعروض يصعّب على أي موظف حفظ كل التفاصيل بدقة.'
  },
  {
    title: 'تجربة عميل غير ثابتة',
    desc: 'تختلف الخدمة من فرع لآخر حسب خبرة الموظف وضغط العمل، والعميل اليوم يتوقع تجربة سريعة وموحدة في كل مكان.'
  },
  {
    title: 'ارتفاع تكاليف التشغيل',
    desc: 'كل موسم يحتاج توظيف وتدريب ومتابعة فرق جديدة بدون ضمان للجودة.'
  },
  {
    title: 'توقعات العميل الحديث أسرع من الواقع',
    desc: 'العميل تعود على السرعة والرد الفوري من التطبيقات والذكاء الاصطناعي، لكنه يواجه في الفروع التقليدية انتظار وبطء.'
  }
];

const branchValues = [
  {
    title: 'ريادة وابتكار',
    desc: 'علامتك التجارية ستكون من أوائل الشركات في المملكة والخليج اللي سخّرت الذكاء الاصطناعي داخل الفروع بشكل عملي وحقيقي. هذي الريادة تعطي صورة ابتكارية قوية للعلامة، وتميز تنافسي، وتجربة عميل مستقبلية تسبق المنافسين. نقطة تسويقية قوية تقدر تستخدمها في كل حملاتك.'
  },
  {
    title: 'توسيع شريحة العملاء',
    desc: 'الأداة تدعم لغات متعددة وتفهم لهجات مختلفة، فتقدر تخدم العملاء من مختلف الجنسيات بسهولة وتكسر حاجز اللغة.'
  },
  {
    title: 'عمل 24/7 بدون موظفين',
    desc: 'يشتغل معك على مدار الساعة، يرد ويخدم ويبيع حتى خارج أوقات الدوام الرسمي، بدون ما تحتاج طاقم إضافي.'
  },
  {
    title: 'حفظ سلوك واهتمامات العميل',
    desc: 'الأداة تتعلم من كل زيارة، تحفظ المنتجات المفضلة والاحتياجات وتوقعات العميل. فإذا رجع الفرع مرة ثانية، تقدر تقدم له تجربة شخصية سريعة ومخصصة له بالضبط.'
  }
];

const ecommerceChallenges = [
  {
    title: 'انخفاض معدل التحويل',
    desc: 'المتاجر الكبيرة اللي توصل زياراتها لـ 50 ألف - 100 ألف زيارة يوميًا تعاني من انخفاض معدل التحويل. الأداة تعطي كل عميل إجابة سريعة وسهلة، فتزيد فرص إتمام الشراء وتواكب توقعات العميل الحديث.'
  },
  {
    title: 'ارتفاع نسبة المرتجعات',
    desc: 'بإعطاء العميل صورة كاملة وواضحة عن المنتج من البداية، تقل فرص الخطأ في الشراء وبالتالي تقل المرتجعات.'
  },
  {
    title: 'تكاليف خدمة العملاء',
    desc: 'تقلل الحاجة لفرق دعم كبيرة موسميًا، وتثبت جودة الخدمة بدون تكاليف تدريب وتوظيف متكررة.'
  }
];

const ecommerceValues = [
  {
    title: 'خدمة عملاء 24/7',
    desc: 'أي عميل يدخل المتجر يلقى مساعد ذكي جاهز يرد عليه فورًا، حتى خارج أوقات الدوام. ما تحتاج موظفين إضافيين للتغطية الليلية.'
  },
  {
    title: 'رفع المبيعات تلقائيًا',
    desc: 'تقوم برفع الـ Upsell و Cross-sell للعميل بناءً على اهتمامه، فتزيد قيمة السلة الشرائية بدون جهد إضافي من الفريق.'
  },
  {
    title: 'ريادة وابتكار تسويقي',
    desc: 'علامتك التجارية ستكون من أوائل الشركات في المملكة والخليج اللي طبقت الذكاء الاصطناعي بشكل عملي. هذي الريادة تعطيك تميز تنافسي ونقطة قوة تسويقية قوية تقدر تبني عليها حملاتك.'
  },
  {
    title: 'توسيع شريحة العملاء',
    desc: 'يدعم لغات ولهجات متعددة، فتقدر تخدم العملاء من مختلف الجنسيات وتكسر حاجز اللغة بسهولة.'
  },
  {
    title: 'ذاكرة ذكية للعميل',
    desc: 'يحفظ سلوك العميل واهتماماته والمنتجات المفضلة لديه. إذا رجع مرة ثانية، تقدر تقدم له تجربة شخصية سريعة ومخصصة لتوقعاته واحتياجاته بالضبط.'
  }
];

type AccordionItemProps = { title: string, content: string, isOpen: boolean, onClick: () => void, colorClass: string };

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content, isOpen, onClick, colorClass }) => {
  return (
    <div className="border border-white/10 rounded-2xl bg-black/20 overflow-hidden mb-3 transition-colors hover:border-white/20">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 text-right transition-colors hover:bg-white/5"
      >
        <span className="font-bold text-[color:var(--color-text-main)] text-sm md:text-base">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={colorClass}
        >
          <ChevronDown size={32} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 pt-0 text-[color:var(--color-text-muted)] text-sm leading-relaxed border-t border-white/5 mt-2">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Solutions = () => {
  const { config } = useSite();
  const [branchTab, setBranchTab] = useState<'challenges' | 'values'>('challenges');
  const [ecoTab, setEcoTab] = useState<'challenges' | 'values'>('challenges');
  const [openChallengeId, setOpenChallengeId] = useState<number | null>(0);
  const [openValueId, setOpenValueId] = useState<number | null>(0);
  const [openEcoId, setOpenEcoId] = useState<number | null>(0);

  // Typewriter effect component for Navigator of Growth
  const TypewriterText = ({ text, speed = 50, delay = 0 }: { text: string; speed?: number, delay?: number }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [start, setStart] = useState(false);

    React.useEffect(() => {
      const t = setTimeout(() => setStart(true), delay);
      return () => clearTimeout(t);
    }, [delay]);

    React.useEffect(() => {
      if (!start) return;
      setDisplayedText('');
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, [text, speed, start]);

    return <span className="whitespace-pre-line">{displayedText}</span>;
  };

  if (!config.sections.solutions) return null;

  return (
    <section className="py-32 relative bg-dots-pattern" id="solutions">
      {/* Background decoration */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[color:var(--color-brand-purple-val)] opacity-20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-[color:var(--color-text-main)]"
          >
            لماذا ابتكرنا "البائع الذكي"؟
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-xl text-[color:var(--color-text-muted)] max-w-3xl mx-auto font-light"
          >
            حلول مبتكرة لمواجهة التحديات في الفروع التقليدية والمتاجر الإلكترونية وتقديم قيمة تفاعلية تليق بتوقعات العميل.
          </motion.p>
        </div>

        <div className="flex md:grid md:grid-cols-2 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-hide gap-8 lg:gap-12 relative items-start pb-4 w-full px-2">
          
          {/* Card 1: Retail Branches */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="snap-center shrink-0 w-[85vw] md:w-auto p-8 md:p-10 rounded-3xl border border-black/80 bg-black/40 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(79,142,247,0.15)] transition-all duration-500 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[color:var(--color-brand-blue-val)] opacity-10 blur-[60px] rounded-full group-hover:opacity-20 transition-all duration-700 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-40 h-40 relative group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 shrink-0">
                  <div className="absolute inset-0 bg-[color:var(--color-brand-blue-val)] opacity-20 blur-[30px] rounded-full group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"></div>
                  <img 
                    src={branchImg} 
                    alt="البائع الذكي للفروع" 
                    loading="lazy"
                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=400&h=400";
                      e.currentTarget.classList.add("rounded-2xl");
                    }}
                  />
                </div>
                 <button 
                  onClick={() => triggerBookingModal('البائع الذكي للفروع')} 
                  className="mt-4 w-full px-6 py-2.5 bg-[color:var(--color-brand-blue-val)] hover:brightness-110 text-white rounded-full font-bold text-sm shadow-[0_0_15px_rgba(43,194,194,0.3)] transition-transform hover:-translate-y-1 block text-center cursor-pointer"
                >
                  كن أول من يحصل على الخدمة
                </button>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[color:var(--color-text-main)] text-shadow-sm">البائع الذكي للفروع</h3>
              <p className="text-[color:var(--color-text-muted)] mb-6 leading-relaxed font-light">
                إليك التحديات التي واجهناها والتي دفعتنا للابتكار، بالإضافة إلى القيمة المضافة لعلامتك التجارية.
              </p>

              <div className="flex gap-2 mb-6 bg-black/40 p-1.5 rounded-full border border-white/10 w-max">
                <button 
                  onClick={() => setBranchTab('challenges')} 
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${branchTab === 'challenges' ? 'bg-[color:var(--color-brand-blue-val)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  التحديات
                </button>
                <button 
                  onClick={() => setBranchTab('values')} 
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${branchTab === 'values' ? 'bg-[color:var(--color-brand-blue-val)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  القيمة المضافة
                </button>
              </div>
              
              <div className="w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={branchTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {branchTab === 'challenges' && branchChallenges.map((challenge, i) => (
                      <AccordionItem 
                        key={i}
                        title={challenge.title}
                        content={challenge.desc}
                        isOpen={openChallengeId === i}
                        onClick={() => setOpenChallengeId(openChallengeId === i ? null : i)}
                        colorClass="text-[color:var(--color-brand-blue-val)]"
                      />
                    ))}
                    {branchTab === 'values' && branchValues.map((val, i) => (
                      <AccordionItem 
                        key={i}
                        title={val.title}
                        content={val.desc}
                        isOpen={openValueId === i}
                        onClick={() => setOpenValueId(openValueId === i ? null : i)}
                        colorClass="text-[color:var(--color-brand-blue-val)]"
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Card 2: E-commerce */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="snap-center shrink-0 w-[85vw] md:w-auto p-8 md:p-10 rounded-3xl border border-black/80 bg-black/40 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(124,58,237,0.15)] transition-all duration-500 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[color:var(--color-brand-purple-val)] opacity-10 blur-[60px] rounded-full group-hover:opacity-20 transition-all duration-700 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-40 h-40 relative group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 shrink-0">
                  <div className="absolute inset-0 bg-[color:var(--color-brand-purple-val)] opacity-20 blur-[30px] rounded-full group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"></div>
                  <img 
                    src={ecommerceImg} 
                    alt="البائع الذكي للمتاجر الإلكترونية" 
                    loading="lazy"
                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=400&h=400";
                      e.currentTarget.classList.add("rounded-2xl");
                    }}
                  />
                </div>
                 <button 
                  onClick={() => triggerBookingModal('البائع الذكي للمتاجر الإلكترونية')} 
                  className="mt-4 w-full px-6 py-2.5 bg-[color:var(--color-brand-purple-val)] hover:brightness-110 text-white rounded-full font-bold text-sm shadow-[0_0_15px_rgba(19,80,91,0.3)] transition-transform hover:-translate-y-1 block text-center cursor-pointer"
                >
                  تواصل معنا
                </button>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[color:var(--color-text-main)] text-shadow-sm">البائع الذكي للمتاجر الإلكترونية</h3>
              <p className="text-[color:var(--color-text-muted)] mb-6 leading-relaxed font-light">
                أداة تضعك في الريادة؛ توسع شرائح عملائك، وتعمل على مدار الساعة وتحفظ التفضيلات لتقديم خدمة شخصية لا تُنسى.
              </p>
              
              <div className="flex gap-2 mb-6 bg-black/40 p-1.5 rounded-full border border-white/10 w-max">
                <button 
                  onClick={() => setEcoTab('challenges')} 
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${ecoTab === 'challenges' ? 'bg-[color:var(--color-brand-purple-val)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  التحديات
                </button>
                <button 
                  onClick={() => setEcoTab('values')} 
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${ecoTab === 'values' ? 'bg-[color:var(--color-brand-purple-val)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  القيمة المضافة
                </button>
              </div>
              
              <div className="w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={ecoTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {ecoTab === 'challenges' && ecommerceChallenges.map((challenge, i) => (
                      <AccordionItem 
                        key={i}
                        title={challenge.title}
                        content={challenge.desc}
                        isOpen={openEcoId === i}
                        onClick={() => setOpenEcoId(openEcoId === i ? null : i)}
                        colorClass="text-[color:var(--color-brand-purple-val)]"
                      />
                    ))}
                    {ecoTab === 'values' && ecommerceValues.map((val, i) => (
                      <AccordionItem 
                        key={i}
                        title={val.title}
                        content={val.desc}
                        isOpen={openEcoId === i}
                        onClick={() => setOpenEcoId(openEcoId === i ? null : i)}
                        colorClass="text-[color:var(--color-brand-purple-val)]"
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Navigator of Growth Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 w-full p-8 md:p-12 rounded-3xl border border-[color:var(--color-brand-blue-val)]/30 bg-black/60 relative overflow-hidden group shadow-[inset_0_4px_20px_rgba(0,0,0,0.8),0_0_30px_rgba(79,142,247,0.15)] backdrop-blur-md"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[color:var(--color-brand-blue-val)]/5 via-transparent to-[color:var(--color-brand-purple-val)]/5 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/30 border border-blue-500/30 text-xs font-bold mb-6 text-blue-300">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                قريباً - أداة جديدة
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black mb-6 text-white text-shadow-sm drop-shadow-[0_2px_10px_rgba(79,142,247,0.3)]">
                سفير النمو <span className="text-[color:var(--color-brand-blue-val)] block mt-2 text-2xl md:text-3xl font-bold">Ambassador of Growth</span>
              </h3>
              
              <div className="font-mono text-[color:var(--color-text-muted)] leading-relaxed space-y-4 mb-8 text-sm md:text-base border-r-2 border-[color:var(--color-brand-blue-val)]/50 pr-4">
                <p>
                  <TypewriterText text='نعمل حالياً على إطلاق أداة "سفير النمو" قريباً للمتاجر الإلكترونية... الأداة ستكون متاحة على منصات (زد وسلة) لجميع التجار.' delay={300} speed={40} />
                </p>
                <p className="text-gray-300">
                  <TypewriterText text="صُممت هذه الأداة خصيصاً لحل مشكلة ارتفاع تكاليف الاستحواذ للعملاء، حيث تقدم عوائد أعلى وأكثر موثوقية، بتكلفة أقل ومصداقية أسرع." delay={3000} speed={40} />
                </p>
                <p className="text-[color:var(--color-brand-blue-val)] font-bold text-lg pt-2">
                  <TypewriterText text="أداة أساسية لكل تاجر، لا غنى عنها في سوق التجارة الرقمية." delay={7000} speed={50} />
                </p>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center gap-6 relative">
              <div className="absolute inset-0 bg-[color:var(--color-brand-blue-val)] opacity-15 blur-[60px] rounded-full animate-pulse pointer-events-none" />
              <div className="grid grid-cols-2 gap-4 relative z-10 w-full max-w-[340px]">
                <div className="bg-[#0c1619] border-2 border-[#2bc2c2]/20 hover:border-[#2bc2c2]/60 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-[#0c1619]/80 transition-all shadow-[0_0_20px_rgba(43,194,194,0.15)] hover:shadow-[0_0_30px_rgba(43,194,194,0.35)] transform hover:-translate-y-1">
                  <img src={sallaLogo} alt="Salla" className="w-20 h-20 object-contain" />
                  <span className="text-sm font-bold text-gray-200">سلة</span>
                </div>
                <div className="bg-[#140b19] border-2 border-[#7C3AED]/20 hover:border-[#7C3AED]/60 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-[#140b19]/80 transition-all shadow-[0_0_20px_rgba(124,58,237,0.15)] hover:shadow-[0_0_30px_rgba(124,58,237,0.35)] transform hover:-translate-y-1">
                  <img src={zidLogo} alt="Zid" className="w-20 h-20 object-contain" />
                  <span className="text-sm font-bold text-gray-200">زد</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
