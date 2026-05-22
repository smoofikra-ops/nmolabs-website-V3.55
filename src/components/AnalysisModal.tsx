import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertTriangle, Info, Zap, Smartphone, Search, Monitor, ShieldCheck } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export const AnalysisModal = ({ isOpen, onClose, url, results, isAnalyzing }) => {
  const { config } = useSite();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        dir="rtl"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-[color:var(--bg-color)] border border-[color:var(--color-brand-blue-val)] border-opacity-30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
            <div>
              <h2 className="text-2xl font-bold text-[color:var(--color-text-main)] mb-1">نتيجة فحص المتجر</h2>
              <p className="text-sm text-[color:var(--color-text-muted)] font-english" dir="ltr">{url}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-[color:var(--color-text-muted)] hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          /* Body */
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 mb-8 relative">
                  <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-[color:var(--color-brand-blue-val)] rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[color:var(--color-text-main)]">جاري تحليل متجرك...</h3>
                <p className="text-[color:var(--color-text-muted)] text-center max-w-md">نحن نقوم الآن بفحص سرعة الموقع، تجربة المستخدم، توافقية الجوال، وتحسينات محركات البحث.</p>
                <div className="mt-8 font-english text-sm text-[color:var(--color-brand-blue-val)] animate-pulse">Analyzing DOM & Network calls...</div>
              </div>
            ) : results ? (
              <div className="space-y-8">
                {/* Overall Score */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ScoreCard title="الأداء والسرعة" score={results.speedScore} icon={<Zap />} />
                  <ScoreCard title="تحسين محركات البحث" score={results.seoScore} icon={<Search />} />
                  <ScoreCard title="تجربة المستخدم (UI/UX)" score={results.uxScore} icon={<Smartphone />} />
                  <ScoreCard title="الموثوقية والأمان" score={results.trustScore} icon={<ShieldCheck />} />
                </div>

                {/* Detailed Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Issues */}
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center justify-between">
                      المشاكل التي تعيق مبيعاتك
                      <AlertTriangle size={20} />
                    </h3>
                    <ul className="space-y-3">
                      {results.issues.map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                          <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-red-400"></span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center justify-between">
                      فرص التحسين لرفع التحويل
                      <CheckCircle size={20} />
                    </h3>
                    <ul className="space-y-3">
                      {results.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                          <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-green-400"></span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="bg-[#000080] rounded-xl p-8 text-center border border-white/20 mt-8 relative overflow-hidden shadow-xl">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-4 text-shadow-sm">جاهز لحل هذه المشاكل ومضاعفة مبيعاتك؟</h3>
                    <p className="text-white opacity-90 mb-6 max-w-xl mx-auto">فريق نمو لابز مستعد للعمل معك على تحسين متجرك الإلكتروني، وتطبيق أفضل الممارسات التي أثبتت نجاحها.</p>
                    <button 
                      onClick={() => {
                        onClose();
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-8 py-3 bg-[color:var(--color-brand-blue-val)] hover:brightness-110 text-white font-bold rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg shadow-black"
                    >
                      تواصل معنا الآن للبدء
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[color:var(--color-brand-blue-val)] to-transparent opacity-10 animate-pulse pointer-events-none"></div>
                </div>
              </div>
            ) : (
               <div className="text-center py-10 text-gray-400">حدث خطأ أثاء التحليل. يرجى المحاولة لاحقاً.</div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ScoreCard = ({ title, score, icon }) => {
  // Deep premium dark background and high-contrast light elements matching the tier
  let bgClass = "bg-[#061814]/90 border-green-500/40 text-green-300 shadow-[0_4px_20px_rgba(16,185,129,0.15)]";
  let glowColor = "rgba(16,185,129,0.3)";
  
  if (score < 50) {
    bgClass = "bg-[#1c0808]/90 border-red-500/40 text-red-300 shadow-[0_4px_20px_rgba(239,68,68,0.15)]";
    glowColor = "rgba(239,68,68,0.3)";
  } else if (score < 80) {
    bgClass = "bg-[#1c1208]/90 border-orange-500/40 text-orange-300 shadow-[0_4px_20px_rgba(249,115,22,0.15)]";
    glowColor = "rgba(249,115,22,0.3)";
  }

  return (
    <motion.div 
      initial={{ scale: 0.85, opacity: 0, y: 15 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.05, 
        y: -4,
        borderColor: "rgba(255,255,255,0.6)",
        boxShadow: `0 12px 30px -5px rgba(0, 0, 0, 0.5), 0 0 20px ${glowColor}`
      }}
      transition={{ 
        type: "spring", 
        stiffness: 180, 
        damping: 14 
      }}
      className={`relative p-6 rounded-2xl border flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-300 ${bgClass}`}
    >
      {/* Top micro-line glow edge */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-40" />

      {/* Floating Animated Icon Wrapper */}
      <motion.div 
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="mb-3 opacity-95 relative z-10"
      >
        {icon}
      </motion.div>

      {/* Pulsing Highlighted Score Number */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-4xl font-extrabold font-english mb-1 text-white select-none relative z-10 flex items-baseline gap-0.5 justify-center tracking-tight"
        style={{ textShadow: `0 0 12px ${glowColor}` }}
      >
        {score}
        <span className="text-base select-none opacity-80">%</span>
      </motion.div>

      {/* High-contrast subtitle/label with Tajawal Arabic pairing */}
      <div className="text-xs font-bold text-slate-200 relative z-10 select-none opacity-90">
        {title}
      </div>
    </motion.div>
  );
};
