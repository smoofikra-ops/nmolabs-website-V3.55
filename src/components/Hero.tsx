import React, { useState, useEffect, useRef } from 'react';
import { useSite } from '../context/SiteContext';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { Sparkles, ScanLine, ArrowLeft, Users, Target, TrendingUp } from 'lucide-react';
import { AnalysisModal } from './AnalysisModal';
import { useContent } from '../context/ContentContext';

import { ParallaxBackground } from './ParallaxBackground';

const TypewriterText = ({ text, speed = 60 }: { text: string; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className="whitespace-pre-line">{displayedText}</span>;
};

const Bubbles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {[...Array(15)].map((_, i) => {
        const size = Math.random() * 60 + 20;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * 5;
        
        return (
          <div 
            key={i}
            className="absolute bottom-[-100px] rounded-full bg-white/[0.04] backdrop-blur-[2px] border border-white/10"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              animation: `floatUp ${duration}s linear ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
};

export const Hero = () => {
  const { config, updateConfig } = useSite();
  const { content } = useContent();
  const heroContent = content.hero;
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(heroRef, { margin: "200px" });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShouldLoadVideo(true), 2500); 
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = config.heroVideoPlaybackRate ?? 1;
    }
  }, [config.heroVideoPlaybackRate]);

  useEffect(() => {
    if (videoRef.current && isInView && shouldLoadVideo) {
      videoRef.current.play().catch(err => {
        console.warn("Mobile autoplay video play request was prevented: ", err);
      });
    }
  }, [isInView, shouldLoadVideo]);

  if (!config.sections.hero) return null;

  const handleScan = async () => {
    if (!url) return;
    setIsScanning(true);
    setScanProgress(0);
    setShowModal(true);
    setAnalysisResults(null);
    
    const newLead = {
      id: Date.now().toString(),
      url: url,
      date: new Date().toLocaleString('ar-SA')
    };
    updateConfig({ scanLeads: [newLead, ...(config.scanLeads || [])] });
    
    // Simulate progress bar over 30+ seconds
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          return 90;
        }
        return prev + Math.floor(Math.random() * 2) + 1;
      });
    }, 450);

    try {
      const delayTime = 30000 + Math.floor(Math.random() * 10000);
      await new Promise(resolve => setTimeout(resolve, delayTime));

      clearInterval(interval);
      setScanProgress(100);

      // Dummy results that look realistic based on best practices
      const dummyResults = {
        speedScore: Math.floor(Math.random() * 30) + 40,
        seoScore: Math.floor(Math.random() * 20) + 70,
        uxScore: Math.floor(Math.random() * 30) + 50,
        trustScore: Math.floor(Math.random() * 15) + 75,
        issues: [
          'صور غير محسنة بحجم كبير تعيق سرعة التحميل.',
          'غياب وصف الميتا (Meta Description) لبعض المنتجات الأساسية.',
          'أزرار الشراء صغيرة وغير واضحة لمستخدمي الجوال.',
          'عدم وجود تأكيدات للثقة (Trust Badges) في صفحة الدفع.',
        ],
        recommendations: [
          'ضغط صور المنتجات بصيغة WebP لتسريع الموقع.',
          'استخدام ألوان متباينة لأزرار الإضافة للسلة.',
          'كتابة وصف بيعي مخصص لكل منتج لتعزيز الـ SEO.',
          'إضافة مراجعات وتقييمات العملاء لزيادة الثقة.'
        ]
      };

      setTimeout(() => {
        setIsScanning(false);
        setAnalysisResults(dummyResults);
      }, 500);

    } catch (err) {
      clearInterval(interval);
      setIsScanning(false);
      // Handle error
    }
  };

  return (
    <section ref={heroRef} className="relative min-h-[70vh] md:min-h-screen pt-32 pb-16 md:py-24 flex items-center justify-center overflow-hidden bg-[color:var(--glass-bg)] bg-dots-pattern" id="hero">
      <Bubbles />
      
      {/* Background Effects */}
      <ParallaxBackground>
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, var(--color-brand-blue-val, ${config.primaryColor}) 0%, transparent 60%), 
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 40px 40px, 40px 40px',
          }}
        />
        
        {/* Video Background (if provided) */}
        {heroContent.videoUrl && (
          <>
            <video 
              ref={videoRef}
              autoPlay 
              loop={config.heroVideoLoop ?? true}
              muted 
              playsInline 
              preload="metadata"
              poster={config.heroVideoPoster || "https://l.top4top.io/p_37931425f1.jpeg" || undefined}
              className="absolute inset-0 w-full h-full object-cover opacity-50 md:opacity-40 transition-opacity duration-1000 pointer-events-none"
              src={heroContent.videoUrl} 
            />
            {/* Mobile Video Overlay for readability */}
            <div className="absolute inset-0 bg-black/60 z-[1] md:hidden pointer-events-none" />
          </>
        )}
      </ParallaxBackground>

      {/* Video Thumbnail (if provided) */}
      {config.heroThumbVideoUrl && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-40 w-32 h-24 md:w-[300px] md:h-[200px] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-white/20 md:border-2 group cursor-pointer hover:border-[color:var(--color-brand-blue-val)] transition-colors"
        >
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            preload="none"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            src={isInView && shouldLoadVideo && !isMobile ? config.heroThumbVideoUrl : undefined} 
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
        </motion.div>
      )}
      
      <div 
        className="glow-bg w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-glow pointer-events-none z-[1]"
        style={{ backgroundColor: config.primaryColor }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center mt-12 md:mt-0">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/60 border border-black shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.08)] text-sm font-medium mb-4 text-[color:var(--color-brand-green-val)] backdrop-blur-md" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            <Sparkles size={16} className="opacity-90" />
            <span className="tracking-wide font-black">نحن لسنا شركة تسويق .. نحن شريك نمو</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-900/40 to-blue-800/40 border border-blue-500/30 text-blue-200 text-xs md:text-sm font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all cursor-default"
            >
              ابتكارات تقنية
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-900/40 to-purple-800/40 border border-purple-500/30 text-purple-200 text-xs md:text-sm font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all cursor-default overflow-hidden relative group"
            >
               <span className="relative z-10">لأول مرة</span>
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[color:var(--color-brand-blue-val)]/20 to-transparent border border-[color:var(--color-brand-blue-val)]/30 text-white text-xs md:text-sm font-medium shadow-sm transition-all cursor-default flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-brand-blue-val)] animate-pulse" />
              حقوق محفوظة وحصرية لـ NmoLabs
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight drop-shadow-2xl">
            {heroContent.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-[color:var(--color-text-muted)] mb-12 max-w-2xl mx-auto leading-relaxed font-light min-h-[4rem] md:min-h-[4.5rem]">
            <TypewriterText text={heroContent.description} />
          </p>

          <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-hide gap-4 md:gap-6 mb-12 md:mb-16 max-w-5xl mx-auto w-full px-2">
            <div className="snap-center shrink-0 w-[80vw] md:w-auto p-4 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 bg-black/50 md:bg-black/40 flex flex-row md:flex-col items-center md:justify-center gap-4 md:gap-5 transition-all duration-300 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] hover:border-[#2bc2c2]/30 hover:shadow-[0_0_20px_rgba(43,194,194,0.1),inset_0_4px_12px_rgba(0,0,0,0.8)] cursor-default">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-black/50 shadow-[inset_0_2px_8px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.05)] border border-black flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-[color:var(--color-brand-blue-val)] drop-shadow-[0_0_8px_rgba(79,142,247,0.5)]" />
              </div>
              <div className="text-right md:text-center flex-1 md:flex-none">
                <h3 className="text-sm md:text-lg font-bold text-white mb-1 md:mb-3 text-shadow-sm">الزوار يدخلون... وما يشترون</h3>
                <p className="text-[#9ca3af] text-[11px] md:text-sm leading-relaxed max-w-[200px] md:max-w-none">معدل التحويل منخفض والعملاء يطلعون بدون شراء</p>
              </div>
            </div>
            <div className="snap-center shrink-0 w-[80vw] md:w-auto p-4 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 bg-black/50 md:bg-black/40 flex flex-row md:flex-col items-center md:justify-center gap-4 md:gap-5 transition-all duration-300 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] hover:border-[#2bc2c2]/30 hover:shadow-[0_0_20px_rgba(43,194,194,0.1),inset_0_4px_12px_rgba(0,0,0,0.8)] cursor-default">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-black/50 shadow-[inset_0_2px_8px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.05)] border border-black flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 md:w-8 md:h-8 text-[color:var(--color-brand-blue-val)] drop-shadow-[0_0_8px_rgba(79,142,247,0.5)]" />
              </div>
              <div className="text-right md:text-center flex-1 md:flex-none">
                <h3 className="text-sm md:text-lg font-bold text-white mb-1 md:mb-3 text-shadow-sm">العميل يتردد... ويطلع</h3>
                <p className="text-[#9ca3af] text-[11px] md:text-sm leading-relaxed max-w-[200px] md:max-w-none">مشاكل في تجربة المستخدم تخلي العميل يشك ويترك المتجر</p>
              </div>
            </div>
            <div className="snap-center shrink-0 w-[80vw] md:w-auto p-4 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 bg-black/50 md:bg-black/40 flex flex-row md:flex-col items-center md:justify-center gap-4 md:gap-5 transition-all duration-300 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] hover:border-[#2bc2c2]/30 hover:shadow-[0_0_20px_rgba(43,194,194,0.1),inset_0_4px_12px_rgba(0,0,0,0.8)] cursor-default">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-black/50 shadow-[inset_0_2px_8px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.05)] border border-black flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-[color:var(--color-brand-blue-val)] drop-shadow-[0_0_8px_rgba(79,142,247,0.5)]" />
              </div>
              <div className="text-right md:text-center flex-1 md:flex-none">
                <h3 className="text-sm md:text-lg font-bold text-white mb-1 md:mb-3 text-shadow-sm">تصرف على الإعلانات... بدون نتيجة</h3>
                <p className="text-[#9ca3af] text-[11px] md:text-sm leading-relaxed max-w-[200px] md:max-w-none">ميزانية إعلانات عالية لكن المبيعات ما ترتفع</p>
              </div>
            </div>
          </div>

          <div className="max-w-xl mx-auto md:ml-auto md:mr-12 relative group z-20">
            <div className={`absolute -inset-1 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse`} style={{ background: `linear-gradient(90deg, ${config.primaryColor}, ${config.accentColor}, ${config.primaryColor})`, backgroundSize: '200% 100%' }}></div>
            
            {/* Desktop Version (Inline layout) */}
            <div className="hidden md:flex flex-row items-center bg-[color:var(--color-brand-dark)] backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 md:p-2 md:pl-2 shadow-2xl focus-within:border-[color:var(--color-brand-blue-val)] w-full">
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourstore.com"
                className="flex-1 bg-transparent border-none outline-none text-white px-3 md:px-4 font-english text-sm md:text-lg placeholder-[color:var(--color-text-muted)] text-left focus:ring-0 min-w-0"
                dir="ltr"
                disabled={isScanning}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleScan();
                }}
              />
              <button
                onClick={handleScan}
                disabled={isScanning || !url}
                className="shrink-0 flex items-center justify-center gap-1.5 md:gap-2 h-12 md:h-14 px-5 md:px-8 rounded-xl font-bold text-sm md:text-lg text-white transition-all duration-300 disabled:opacity-50 relative overflow-hidden shadow-[0_0_20px_rgba(79,142,247,0.5)] hover:shadow-[0_0_30px_rgba(79,142,247,0.8)] hover:scale-105"
                style={{ backgroundColor: config.primaryColor }}
              >
                {isScanning ? (
                  <span className="flex items-center gap-2 font-english">
                    {scanProgress}% 
                    <ScanLine size={20} className="animate-pulse" />
                  </span>
                ) : (
                  <>
                    {heroContent.ctaText}
                    <ArrowLeft size={20} className="rotate-180 animate-bounce" />
                  </>
                )}
              </button>
            </div>

            {/* Mobile Version (Independent Input & Centered Gradient Button Underneath) */}
            <div className="flex md:hidden flex-col gap-3.5 w-full max-w-sm mx-auto px-4">
              <div className="relative rounded-xl bg-black/50 border border-white/10 shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)]">
                <input 
                  type="url" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yourstore.com"
                  className="w-full bg-transparent border-none outline-none text-white px-4 py-2.5 rounded-xl font-english text-sm placeholder-[color:var(--color-text-muted)] text-center focus:ring-0 focus:ring-offset-0 focus:border-transparent"
                  dir="ltr"
                  disabled={isScanning}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleScan();
                  }}
                />
              </div>
              <button
                onClick={handleScan}
                disabled={isScanning || !url}
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden shadow-lg border border-white/10 active:scale-95 active:brightness-110"
                style={{ 
                  background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.accentColor} 100%)`,
                  boxShadow: `0 0 15px ${config.primaryColor}50`
                }}
              >
                {isScanning ? (
                  <span className="flex items-center gap-2 font-english">
                    جاري الفحص {scanProgress}% 
                    <ScanLine size={18} className="animate-pulse" />
                  </span>
                ) : (
                  <>
                    {heroContent.ctaText}
                    <ArrowLeft size={18} className="rotate-180 shrink-0" />
                  </>
                )}
              </button>
            </div>
            
            {/* Loading Bar */}
            <AnimatePresence>
              {isScanning && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 4 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="absolute -bottom-2 left-0 right-0 rounded-full overflow-hidden bg-[color:var(--glass-border)]"
                >
                  <motion.div 
                    className="h-full shadow-[0_0_10px_currentColor]"
                    style={{ backgroundColor: config.accentColor, color: config.accentColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${scanProgress}%` }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <AnalysisModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        url={url}
        results={analysisResults}
        isAnalyzing={isScanning}
      />

      {/* Animated subtle divider between Hero and next section */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[color:var(--color-brand-blue-val)] to-transparent opacity-40">
        <motion.div 
          className="absolute top-0 h-[1px] bg-white shadow-[0_0_10px_white]"
          animate={{ left: ['-20%', '120%'] }}
          transition={{ duration: 5, ease: 'linear', repeat: Infinity }}
          style={{ width: '15%' }}
        />
      </div>
    </section>
  );
};

