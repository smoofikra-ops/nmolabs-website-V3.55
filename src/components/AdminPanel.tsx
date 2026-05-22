import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Save, Layout, Type, Palette, Link as LinkIcon, X, LineChart, ExternalLink, ArrowUp, ArrowDown, Plus, Sparkles, Check, Users, Trash, Wrench, ChevronDown, Info } from 'lucide-react';

const Tooltip = ({ text, children }: { text: string, children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-black/90 text-white text-xs text-center rounded-lg border border-white/20 shadow-xl z-50 pointer-events-none"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AdminPanel = () => {
  const { config, updateConfig, saveConfig, hasUnsavedChanges, isAdminMode, setIsAdminMode, resetConfig } = useSite();
  const [activeTab, setActiveTab] = useState<'header' | 'hero' | 'body' | 'footer' | 'colors' | 'links' | 'reports' | 'partners' | 'tools'>('header');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [openToolCategory, setOpenToolCategory] = useState<number | null>(null);

  if (!isAdminMode) return null;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveConfig();
      setIsSaving(false);
      setSaveMessage('تم الحفظ بنجاح!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 800);
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowCloseModal(true);
    } else {
      setIsAdminMode(false);
    }
  };

  const confirmDiscard = () => {
    const saved = localStorage.getItem('nmo_site_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      updateConfig({ ...parsed, sectionOrder: parsed.sectionOrder || config.sectionOrder, customSections: parsed.customSections || config.customSections });
    } else {
      resetConfig();
    }
    setShowCloseModal(false);
    setTimeout(() => setIsAdminMode(false), 50);
  };

  const handleSaveAndClose = () => {
    saveConfig();
    setShowCloseModal(false);
    setIsAdminMode(false);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...config.sectionOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    updateConfig({ sectionOrder: newOrder });
  };

  const handleGenerateSection = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newSectionId = `custom_${Date.now()}`;
      const newSection = {
        id: newSectionId,
        type: 'custom',
        title: 'قسم جديد (AI)',
        content: 'محتوى تجريبي تم توليده بواسطة الذكاء الاصطناعي مخصص لمتجرك.'
      };
      
      updateConfig({
        customSections: [...(config.customSections || []), newSection],
        sectionOrder: [...config.sectionOrder, newSectionId],
        sections: { ...config.sections, [newSectionId]: true }
      });
      setIsGenerating(false);
    }, 1500);
  };

  const getSectionName = (key: string) => {
    switch(key) {
      case 'hero': return 'القسم الرئيسي (Hero)';
      case 'services': return 'الخدمات';
      case 'ecommerce': return 'إنشاء المتاجر الإلكترونية';
      case 'solutions': return 'الحلول';
      case 'tools': return 'الأدوات';
      case 'workflow': return 'رحلة العميل';
      case 'faq': return 'الأسئلة الشائعة';
      case 'testimonials': return 'قصص النجاح';
      default: 
        const custom = config.customSections?.find(s => s.id === key);
        return custom ? custom.title : key;
    }
  };

  const tabs = [
    { id: 'header', icon: <Layout size={18} />, label: '1. الهيدر (Header)' },
    { id: 'hero', icon: <Type size={18} />, label: '2. القسم الرئيسي (Hero)' },
    { id: 'body', icon: <Layout size={18} />, label: '3. أقسام الموقع (Body)' },
    { id: 'footer', icon: <Type size={18} />, label: '4. الفوتر (Footer)' },
    { id: 'colors', icon: <Palette size={18} />, label: 'الألوان' },
    { id: 'links', icon: <LinkIcon size={18} />, label: 'الروابط' },
    { id: 'partners', icon: <Users size={18} />, label: 'شركاء النجاح' },
    { id: 'tools', icon: <Wrench size={18} />, label: 'الأدوات والخدمات' },
    { id: 'reports', icon: <LineChart size={18} />, label: 'التقارير' },
  ];

  return (
    <>
      <div id="admin-panel-root" className="fixed inset-0 z-[100] flex rtl">
        {/* Sidebar */}
        <div className="w-64 bg-brand-darker border-l border-white/10 p-6 flex flex-col h-full relative">
        <button onClick={handleClose} className="absolute left-6 top-6 text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="mb-12 mt-2 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="text-brand-blue" />
            لوحة التحكم
          </h2>
        </div>
        
        <div className="flex flex-col gap-2 flex-grow">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-brand-blue/20 text-brand-blue' : 'hover:bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-auto space-y-3">
          {saveMessage && (
            <div className="text-brand-green text-sm text-center bg-brand-green/10 py-2 rounded-lg flex flex-col items-center justify-center">
              <span><Check size={16} className="inline mr-1"/></span>
              {saveMessage}
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className={`w-full text-white p-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${hasUnsavedChanges ? 'bg-brand-green hover:bg-emerald-600' : 'bg-brand-blue hover:bg-blue-600'}`}
          >
            <Save size={18} />
            {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
          
          <button
            onClick={() => {
              const cfg = localStorage.getItem('nmo_site_config');
              if (cfg) {
                navigator.clipboard.writeText(cfg);
                setSaveMessage('تم نسخ الإعدادات للمتصفح!');
                setTimeout(() => setSaveMessage(''), 3000);
              }
            }}
            className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-brand-green p-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <Sparkles size={16} />
            نسخ الإعدادات الحالية
          </button>

          <button 
            onClick={hasUnsavedChanges ? handleSaveAndClose : handleClose}
            className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white p-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            {hasUnsavedChanges ? 'حفظ وإغلاق' : 'إغلاق اللوحة'}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-brand-dark/95 backdrop-blur-3xl overflow-y-auto p-10">
        <div className="max-w-3xl mx-auto glass-panel p-8 rounded-2xl">
          <h3 className="text-2xl mb-6 font-bold border-b border-white/10 pb-4">
            {tabs.find(t => t.id === activeTab)?.label}
          </h3>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {activeTab === 'header' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">النص التعريفي (Logo)</label>
                    <input 
                      type="text" 
                      value={config.logoText || 'NMOLABS'}
                      onChange={(e) => updateConfig({ logoText: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:border-brand-blue outline-none transition-colors"
                    />
                  </div>
                  <div>
                     <label className="block text-sm text-gray-400 mb-2">رقم التواصل (واتساب)</label>
                     <Tooltip text="أدخل رقم الواتساب بالصيغة الدولية لتوجيه العملاء عند الضغط على 'تواصل معنا'."><Info size={14} className="text-gray-500 cursor-help" /></Tooltip>
                     <input 
                       type="text" 
                       value={config.contactNumber || ''}
                       onChange={(e) => updateConfig({ contactNumber: e.target.value })}
                       placeholder="+966500000000"
                       className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:border-brand-blue outline-none transition-colors font-english text-left"
                       dir="ltr"
                     />
                  </div>
                  <div className="bg-brand-blue/10 border border-brand-blue/20 p-5 rounded-xl">
                    <h4 className="text-lg font-bold mb-4">خيارات الهيدر المتقدمة</h4>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-bold">إظهار زر الوضع الداكن/الفاتح</p>
                        <p className="text-sm text-gray-400">تفعيل خيار تبديل بين الوضع الليلي والنهاري في الهيدر</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={config.showThemeToggle !== false}
                          onChange={(e) => updateConfig({ showThemeToggle: e.target.checked })}
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[color:var(--color-brand-blue-val)]"></div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-brand-blue/10 border border-brand-blue/20 p-5 rounded-xl">
                    <h4 className="text-lg font-bold mb-4">ربط خدمات التحليل (API)</h4>
                    <p className="text-sm text-gray-300 mb-4">للحصول على تقارير حقيقية ودقيقة عند فحص روابط المتاجر، قم بإضافة مفاتيح API الخاصة بك هنا. ننصح باستخدام Google PageSpeed Insights لمعلومات الأداء، و OpenAI لتحليل المحتوى وتجربة المستخدم.</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">Google PageSpeed Insights API Key</label>
                        <input 
                          type="password" 
                          value={config.apiKeys?.pageSpeed || ''}
                          onChange={(e) => updateConfig({ apiKeys: { ...config.apiKeys, pageSpeed: e.target.value } })}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white text-left font-english"
                          placeholder="AIzaSy..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">OpenAI / Gemini API Key (لتحليل المحتوى)</label>
                        <input 
                          type="password" 
                          value={config.apiKeys?.openai || ''}
                          onChange={(e) => updateConfig({ apiKeys: { ...config.apiKeys, openai: e.target.value } })}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white text-left font-english"
                          placeholder="sk-..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-blue/10 border border-brand-blue/20 p-5 rounded-xl">
                    <h4 className="text-lg font-bold mb-2">زر بدء التحليل</h4>
                    <p className="text-sm text-gray-300">الزر الأساسي في الهيدر مثبت على فتح التحليل المباشر في الصفحة الرئيسية.</p>
                  </div>
                </div>
              )}

              {activeTab === 'hero' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">العنوان الرئيسي (Hero)</label>
                    <input 
                      type="text" 
                      value={config.heroTitle}
                      onChange={(e) => updateConfig({ heroTitle: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:border-brand-blue outline-none transition-colors"
                    />
                  </div>
                  <div>
                     <label className="block text-sm text-gray-400 mb-2">النص الفرعي (Hero)</label>
                     <textarea 
                       value={config.heroSubtitle}
                       onChange={(e) => updateConfig({ heroSubtitle: e.target.value })}
                       className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:border-brand-blue outline-none transition-colors h-24"
                     />
                  </div>
                  <div>
                     <label className="block text-sm text-gray-400 mb-2">نص الزر</label>
                     <input 
                       type="text" 
                       value={config.heroButtonText}
                       onChange={(e) => updateConfig({ heroButtonText: e.target.value })}
                       className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:border-brand-blue outline-none transition-colors"
                     />
                  </div>
                  <div>
                     <div className="flex items-center gap-2 mb-2">
                       <label className="block text-sm text-gray-400">صورة مصغرة / مؤقتة للفيديو (Poster)</label>
                       <Tooltip text="تظهر الصورة قبل تحميل الفيديو أو إذا لم يعمل."><Info size={14} className="text-gray-500 cursor-help" /></Tooltip>
                     </div>
                     <input 
                       type="text" 
                       value={config.heroVideoPoster || ''}
                       onChange={(e) => updateConfig({ heroVideoPoster: e.target.value })}
                       placeholder="https://example.com/poster.jpg"
                       className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:border-brand-blue outline-none transition-colors font-english text-left"
                       dir="ltr"
                     />
                  </div>
                  <div>
                     <div className="flex items-center gap-2 mb-2">
                       <label className="block text-sm text-gray-400">رابط فيديو الخلفية الشفافة (اختياري)</label>
                       <Tooltip text="أدخل رابط فيديو مباشر بصيغة mp4. للشفافية المدمجة استخدم mix-blend-screen."><Info size={14} className="text-gray-500 cursor-help" /></Tooltip>
                     </div>
                     <input 
                       type="text" 
                       value={config.heroVideoUrl}
                       onChange={(e) => updateConfig({ heroVideoUrl: e.target.value })}
                       placeholder="https://example.com/bg-video.mp4"
                       className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:border-brand-blue outline-none transition-colors font-english text-left"
                       dir="ltr"
                     />
                  </div>
                  <div>
                     <div className="flex items-center gap-2 mb-2">
                       <label className="block text-sm text-gray-400">رابط فيديو مصغر (مثبّت في الزاوية، اختياري)</label>
                       <Tooltip text="سيظهر هذا الفيديو كعنصر متحرك في زاوية الشاشة لإضافة لمسة تفاعلية."><Info size={14} className="text-gray-500 cursor-help" /></Tooltip>
                     </div>
                     <input 
                       type="text" 
                       value={config.heroThumbVideoUrl || ''}
                       onChange={(e) => updateConfig({ heroThumbVideoUrl: e.target.value })}
                       placeholder="https://example.com/thumb-video.mp4"
                       className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:border-brand-blue outline-none transition-colors font-english text-left"
                       dir="ltr"
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <div className="flex items-center gap-2 mb-2">
                         <label className="block text-sm text-gray-400">تكرار الفيديو (Loop)</label>
                       </div>
                       <label className="flex items-center gap-2 cursor-pointer bg-black/50 border border-white/10 p-3 rounded-xl hover:border-brand-blue transition-colors">
                         <input 
                           type="checkbox" 
                           checked={config.heroVideoLoop ?? true}
                           onChange={(e) => updateConfig({ heroVideoLoop: e.target.checked })}
                           className="w-5 h-5 accent-brand-blue"
                         />
                         <span className="text-sm text-gray-300">تشغيل مستمر</span>
                       </label>
                     </div>
                     <div>
                       <div className="flex items-center gap-2 mb-2">
                         <label className="block text-sm text-gray-400">سرعة الفيديو</label>
                         <Tooltip text="اختر سرعة تشغيل فيديو الخلفية (من 0.25 إلى 2.0)"><Info size={14} className="text-gray-500 cursor-help" /></Tooltip>
                       </div>
                       <select 
                         value={config.heroVideoPlaybackRate || 1}
                         onChange={(e) => updateConfig({ heroVideoPlaybackRate: parseFloat(e.target.value) })}
                         className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:border-brand-blue outline-none transition-colors font-english text-left"
                         dir="ltr"
                       >
                         <option value="0.25">0.25x</option>
                         <option value="0.5">0.5x</option>
                         <option value="0.75">0.75x</option>
                         <option value="1">1.0x (طبيعي)</option>
                         <option value="1.25">1.25x</option>
                         <option value="1.5">1.5x</option>
                         <option value="2">2.0x</option>
                       </select>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'body' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col gap-1">
                        <p className="text-gray-400 text-sm">قم بتفعيل، تعطيل، أو إعادة ترتيب أقسام الموقع</p>
                        <p className="text-xs text-gray-500">استخدم أزرار الأسهم لرفع وخفض الأقسام وتغيير ترتيبها في الصفحة الرئيسية</p>
                      </div>
                    <button 
                      onClick={handleGenerateSection}
                      disabled={isGenerating}
                      className="text-sm bg-brand-blue/20 hover:bg-brand-blue/30 text-brand-blue px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
                    >
                      {isGenerating ? <div className="w-4 h-4 rounded-full border-2 border-brand-blue border-t-transparent animate-spin" /> : <Sparkles size={16} />}
                      {isGenerating ? 'جاري التوليد...' : 'إضافة قسم بالذكاء الاصطناعي'}
                    </button>
                  </div>
                  
                  {config.sectionOrder.map((key, index) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                          <button 
                            disabled={index === 0} 
                            onClick={() => moveSection(index, 'up')}
                            className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button 
                            disabled={index === config.sectionOrder.length - 1} 
                            onClick={() => moveSection(index, 'down')}
                            className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>
                        <span className="font-bold">{getSectionName(key)}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={config.sections[key] ?? true}
                          onChange={(e) => updateConfig({ 
                            sections: { ...config.sections, [key]: e.target.checked }
                          })}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'footer' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">نص وصف الفوتر</label>
                    <textarea 
                      value={config.footerDescription || ''}
                      onChange={(e) => updateConfig({ footerDescription: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:border-brand-blue outline-none transition-colors h-24"
                    />
                  </div>
                  <div className="border-t border-white/10 pt-6">
                    <h4 className="text-lg font-bold mb-4">حسابات التواصل الاجتماعي</h4>
                    <div className="space-y-4">
                      {config.socialLinks?.map((link, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 border border-white/5 bg-black/30 rounded-xl">
                          <div className="w-full md:w-1/3">
                            <label className="block text-xs text-gray-400 mb-1">المنصة</label>
                            <input 
                              type="text" 
                              disabled
                              value={link.name}
                              className="w-full bg-white/5 border border-white/10 p-2 text-sm rounded outline-none text-gray-400"
                            />
                          </div>
                          <div className="w-full md:w-2/3">
                            <label className="block text-xs text-gray-400 mb-1">الرابط</label>
                            <input 
                              type="url" 
                              value={link.url}
                              onChange={(e) => {
                                const newArray = [...(config.socialLinks || [])];
                                newArray[idx] = { ...link, url: e.target.value };
                                updateConfig({ socialLinks: newArray });
                              }}
                              placeholder="https://"
                              className="w-full bg-black/50 border border-white/10 p-2 text-sm rounded focus:border-brand-blue outline-none font-english text-left"
                              dir="ltr"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'colors' && (
                <div className="space-y-6">
                  <div className="bg-brand-blue/10 border border-brand-blue/20 p-5 rounded-xl mb-6">
                     <h4 className="text-lg font-bold mb-4">خلفية الموقع (Background Image)</h4>
                     <p className="text-sm text-gray-300 mb-4">يمكنك إضافة رابط صورة لتكون خلفية للموقع، أو تركها فارغة لاستخدام الألوان فقط.</p>
                     <div className="flex gap-4">
                       <input 
                         type="url" 
                         placeholder="https://example.com/image.png"
                         value={config.backgroundImage || ''}
                         onChange={(e) => updateConfig({ backgroundImage: e.target.value })}
                         className="flex-1 bg-black/50 border border-white/10 p-3 rounded-xl focus:border-[color:var(--color-brand-blue-val)] outline-none transition-colors font-english text-left"
                         dir="ltr"
                       />
                       <button
                         onClick={async () => {
                           const prompt = window.prompt('أدخل وصف الخلفية التي تريد للذكاء الاصطناعي رسمها:');
                           if (!prompt) return;
                           // Simulate an AI generation for background image by using Unsplash source (for demonstration)
                           // Ideally, we could use an API or real image-generation tool
                           const query = encodeURIComponent(prompt);
                           const imgUrl = `https://source.unsplash.com/random/1920x1080/?${query}&auto=format&fit=crop&q=80`;
                           updateConfig({ backgroundImage: imgUrl });
                           alert('تم توليد وتعيين الخلفية بنجاح!');
                         }}
                         className="bg-[color:var(--color-brand-purple-val)] hover:brightness-110 px-4 rounded-xl font-bold flex items-center justify-center gap-2 whitespace-nowrap"
                       >
                         توليد بالذكاء الاصطناعي
                       </button>
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">اللون الأساسي (Primary)</label>
                    <div className="flex gap-4">
                      <input 
                        type="color" 
                        value={config.primaryColor}
                        onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                        className="w-12 h-12 rounded bg-transparent border-0 cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={config.primaryColor}
                        onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                        className="flex-1 bg-black/50 border border-white/10 p-3 rounded-xl focus:border-brand-blue outline-none transition-colors font-english text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">اللون الثانوي (Secondary)</label>
                    <div className="flex gap-4">
                      <input 
                        type="color" 
                        value={config.secondaryColor}
                        onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                        className="w-12 h-12 rounded bg-transparent border-0 cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={config.secondaryColor}
                        onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                        className="flex-1 bg-black/50 border border-white/10 p-3 rounded-xl focus:border-brand-blue outline-none transition-colors font-english text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={resetConfig}
                    className="text-sm text-red-400 hover:text-red-300 underline mt-4"
                  >
                    استعادة الألوان والإعدادات الافتراضية
                  </button>
                </div>
              )}

              {activeTab === 'links' && (
                <div className="space-y-6">
                  <div className="bg-brand-blue/10 border border-brand-blue/20 p-5 rounded-xl">
                    <h4 className="text-lg font-bold mb-2">ربط النطاق (Domain DNS)</h4>
                    <p className="text-sm text-gray-300 mb-4">لربط النطاق الخاص بك، قم بإضافة السجلات التالية في لوحة تحكم مزود النطاق:</p>
                    <div className="space-y-3 font-english text-sm" dir="ltr">
                      <div className="bg-black/50 p-3 rounded border border-white/10 flex justify-between">
                         <span className="text-gray-400">Type: A</span>
                         <span className="text-brand-blue font-mono">198.51.100.1</span>
                      </div>
                      <div className="bg-black/50 p-3 rounded border border-white/10 flex justify-between">
                         <span className="text-gray-400">Type: CNAME</span>
                         <span className="text-brand-purple font-mono">nmolabs.com</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                     <label className="block text-sm text-gray-400 mb-2">ربط API : SEMrush</label>
                     <input 
                        type="text" 
                        value={config.apiLinks.semrush || ''}
                        onChange={(e) => updateConfig({ apiLinks: { ...config.apiLinks, semrush: e.target.value } })}
                        placeholder="API Key / EndPoint"
                        className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:border-brand-blue outline-none transition-colors font-english text-left"
                        dir="ltr"
                      />
                  </div>
                  <div>
                     <label className="block text-sm text-gray-400 mb-2">ربط API : Hotjar</label>
                     <input 
                        type="text" 
                        value={config.apiLinks.hotjar || ''}
                        onChange={(e) => updateConfig({ apiLinks: { ...config.apiLinks, hotjar: e.target.value } })}
                        placeholder="Site ID / Mapping URL"
                        className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:border-brand-blue outline-none transition-colors font-english text-left"
                        dir="ltr"
                      />
                  </div>
                  <div>
                     <label className="block text-sm text-gray-400 mb-2">ربط API : OpenAI / Gemini / Claude</label>
                     <input 
                        type="text" 
                        value={config.apiLinks.chatgpt || ''}
                        onChange={(e) => updateConfig({ apiLinks: { ...config.apiLinks, chatgpt: e.target.value } })}
                        placeholder="Bearer sk-..."
                        className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:border-brand-blue outline-none transition-colors font-english text-left mb-2"
                        dir="ltr"
                      />
                  </div>
                </div>
              )}

              {activeTab === 'partners' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-400 text-sm">إدارة شركاء النجاح</p>
                    <button 
                      onClick={() => {
                         const newPartner = { id: `partner_${Date.now()}`, name: 'شريك جديد', imageUrl: '', linkUrl: '' };
                         updateConfig({ partners: [...(config.partners || []), newPartner] });
                      }}
                      className="text-sm bg-brand-green/20 hover:bg-brand-green/30 text-brand-green px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <Plus size={16} />
                      إضافة شريك جديد
                    </button>
                  </div>
                  
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {(config.partners || []).map((partner, index) => (
                      <div key={partner.id} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <span className="font-bold text-lg">{partner.name || `شريك #${index + 1}`}</span>
                              {partner.imageUrl && <img src={partner.imageUrl} className="w-8 h-8 rounded shrink-0 object-contain bg-white/10" />}
                           </div>
                           <button 
                             onClick={() => {
                               const newArray = [...config.partners];
                               newArray.splice(index, 1);
                               updateConfig({ partners: newArray });
                             }}
                             className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                           >
                             <Trash size={16} />
                           </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                             <label className="block text-sm text-gray-400 mb-1">اسم الشريك</label>
                             <input 
                               type="text" 
                               value={partner.name}
                               onChange={(e) => {
                                 const newArray = [...config.partners];
                                 newArray[index] = { ...partner, name: e.target.value };
                                 updateConfig({ partners: newArray });
                               }}
                               className="w-full bg-black/50 border border-white/10 p-2 text-sm rounded focus:border-brand-blue outline-none transition-colors"
                             />
                           </div>
                           <div>
                             <label className="block text-sm text-gray-400 mb-1">رابط الشريك (اختياري)</label>
                             <input 
                               type="url" 
                               value={partner.linkUrl}
                               onChange={(e) => {
                                 const newArray = [...config.partners];
                                 newArray[index] = { ...partner, linkUrl: e.target.value };
                                 updateConfig({ partners: newArray });
                               }}
                               placeholder="https://"
                               className="w-full bg-black/50 border border-white/10 p-2 text-sm rounded focus:border-brand-blue outline-none font-english text-left"
                               dir="ltr"
                             />
                           </div>
                           <div className="md:col-span-2">
                             <label className="block text-sm text-gray-400 mb-1">صورة الشعار (رابط URL أو رفع صورة)</label>
                             <div className="flex gap-2">
                               <input 
                                 type="url" 
                                 value={partner.imageUrl}
                                 onChange={(e) => {
                                   const newArray = [...config.partners];
                                   newArray[index] = { ...partner, imageUrl: e.target.value };
                                   updateConfig({ partners: newArray });
                                 }}
                                 placeholder="https://..."
                                 className="flex-1 bg-black/50 border border-white/10 p-2 text-sm rounded focus:border-brand-blue outline-none font-english text-left"
                                 dir="ltr"
                               />
                               <label className="flex items-center justify-center bg-white/10 border border-white/20 hover:bg-white/20 px-4 rounded cursor-pointer transition-colors text-sm">
                                  رفع صورة
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          const newArray = [...config.partners];
                                          newArray[index] = { ...partner, imageUrl: reader.result as string };
                                          updateConfig({ partners: newArray });
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                               </label>
                             </div>
                           </div>
                           <div className="md:col-span-2">
                             <label className="block text-sm text-gray-400 mb-1">لون هوية الشعار (يظهر عند التمرير)</label>
                             <div className="flex gap-2">
                               <input 
                                 type="color" 
                                 value={partner.color || config.primaryColor}
                                 onChange={(e) => {
                                   const newArray = [...config.partners];
                                   newArray[index] = { ...partner, color: e.target.value };
                                   updateConfig({ partners: newArray });
                                 }}
                                 className="w-12 h-10 p-1 bg-black/50 border border-white/10 rounded cursor-pointer"
                               />
                               <input 
                                 type="text" 
                                 value={partner.color || config.primaryColor}
                                 onChange={(e) => {
                                   const newArray = [...config.partners];
                                   newArray[index] = { ...partner, color: e.target.value };
                                   updateConfig({ partners: newArray });
                                 }}
                                 className="flex-1 bg-black/50 border border-white/10 p-2 text-sm rounded focus:border-brand-blue outline-none font-english text-left"
                                 dir="ltr"
                               />
                             </div>
                           </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-2 border-t border-white/10 pt-2">
                          <button 
                            disabled={index === 0} 
                            onClick={() => {
                               const newArray = [...config.partners];
                               [newArray[index], newArray[index - 1]] = [newArray[index - 1], newArray[index]];
                               updateConfig({ partners: newArray });
                            }}
                            className="p-1.5 hover:bg-white/10 text-gray-400 rounded disabled:opacity-30 transition-colors"
                            title="تحريك لأعلى"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button 
                            disabled={index === (config.partners?.length || 0) - 1} 
                            onClick={() => {
                               const newArray = [...config.partners];
                               [newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
                               updateConfig({ partners: newArray });
                            }}
                            className="p-1.5 hover:bg-white/10 text-gray-400 rounded disabled:opacity-30 transition-colors"
                            title="تحريك لأسفل"
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tools' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold border-b border-white/10 pb-4">إدارة الأدوات والخدمات</h3>
                  {config.toolCategories?.map((category, catIndex) => {
                    const isOpen = openToolCategory === catIndex;
                    return (
                      <div key={category.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all duration-300">
                        <div className="p-4 bg-black/20 flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <button 
                              onClick={() => setOpenToolCategory(isOpen ? null : catIndex)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <ChevronDown size={20} className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <input
                              type="text"
                              value={category.title}
                              onChange={(e) => {
                                const newCategories = [...config.toolCategories];
                                newCategories[catIndex].title = e.target.value;
                                updateConfig({ toolCategories: newCategories });
                              }}
                              className="bg-transparent text-lg font-bold text-white border-none focus:outline-none w-full"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button 
                              disabled={catIndex === 0} 
                              onClick={(e) => {
                                 e.stopPropagation();
                                 const newArray = [...config.toolCategories];
                                 [newArray[catIndex], newArray[catIndex - 1]] = [newArray[catIndex - 1], newArray[catIndex]];
                                 updateConfig({ toolCategories: newArray });
                              }}
                              className="p-1.5 hover:bg-white/10 text-gray-400 rounded disabled:opacity-30 transition-colors"
                            >
                              <ArrowUp size={16} />
                            </button>
                            <button 
                              disabled={catIndex === config.toolCategories.length - 1} 
                              onClick={(e) => {
                                 e.stopPropagation();
                                 const newArray = [...config.toolCategories];
                                 [newArray[catIndex], newArray[catIndex + 1]] = [newArray[catIndex + 1], newArray[catIndex]];
                                 updateConfig({ toolCategories: newArray });
                              }}
                              className="p-1.5 hover:bg-white/10 text-gray-400 rounded disabled:opacity-30 transition-colors"
                            >
                              <ArrowDown size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 space-y-2 border-t border-white/5">
                                {category.tools.map((tool, toolIndex) => (
                                  <div key={toolIndex} className="flex gap-4 items-center bg-black/40 p-3 rounded-lg border border-white/5">
                                    <input
                                      type="text"
                                      value={tool.name}
                                      onChange={(e) => {
                                        const newCategories = [...config.toolCategories];
                                        newCategories[catIndex].tools[toolIndex].name = e.target.value;
                                        updateConfig({ toolCategories: newCategories });
                                      }}
                                      className="bg-transparent flex-1 focus:outline-none focus:border-b focus:border-brand-blue"
                                    />
                                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                                       <input 
                                         type="checkbox" 
                                         checked={tool.locked}
                                         onChange={(e) => {
                                            const newCategories = [...config.toolCategories];
                                            newCategories[catIndex].tools[toolIndex].locked = e.target.checked;
                                            updateConfig({ toolCategories: newCategories });
                                         }}
                                         className="accent-[color:var(--color-brand-purple-val)] w-4 h-4 cursor-pointer"
                                       />
                                       مغلق (برو)
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="space-y-8">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">الزيارات الكلية</div>
                      <div className="text-3xl font-black text-brand-blue">4,291</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">نقرات الأدوات</div>
                      <div className="text-3xl font-black text-brand-green">1,832</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">زيارات الأسئلة الشائعة</div>
                      <div className="text-3xl font-black text-brand-purple">845</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">نقرات شركاء النجاح</div>
                      <div className="text-3xl font-black text-white">{config.partnerClicks?.length || 0}</div>
                    </div>
                  </div>

                  {config.partnerClicks && config.partnerClicks.length > 0 && (
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                      <h4 className="text-lg font-bold mb-4">أحدث نقرات شركاء النجاح</h4>
                      <div className="space-y-3 h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {[...config.partnerClicks].reverse().slice(0, 20).map((click, i) => {
                          const partner = config.partners.find(p => p.id === click.partnerId);
                          return (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/5 text-sm">
                              <div className="flex items-center gap-3">
                                {partner?.imageUrl ? (
                                  <img src={partner.imageUrl} className="w-6 h-6 object-contain rounded" />
                                ) : (
                                  <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-bold text-xs">P</div>
                                )}
                                <span className="text-white">{partner?.name || 'شريك غير معروف'}</span>
                              </div>
                              <div className="text-gray-400 font-english" dir="ltr">
                                {new Date(click.timestamp).toLocaleString()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <h4 className="text-lg font-bold mb-4">تحليل العناصر والخدمات</h4>
                    <div className="space-y-4">
                      {['خدمة تحسين تجربة المستخدم', 'محلل المنافسين الشامل', 'أداة التقويم التسويقي', 'حاسبة أداء الحملات'].map((item, i) => (
                        <div key={item} className="flex flex-col gap-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white">{item}</span>
                            <span className="text-gray-400">{100 - (i * 15)}% استخدام</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-l from-brand-blue to-transparent rounded-full" style={{ width: `${100 - (i * 15)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Leads Data */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold">العملاء ومتاجرهم للتحليل المباشر</h4>
                      <div className="text-sm bg-brand-blue/20 text-brand-blue px-3 py-1 rounded-full">
                        الإجمالي: {config.scanLeads?.length || 0}
                      </div>
                    </div>
                    
                    {(!config.scanLeads || config.scanLeads.length === 0) ? (
                      <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-gray-400">لا يوجد بيانات حتى الآن. قم بتجربة أداة التحليل في الصفحة الرئيسية.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {config.scanLeads.map((lead) => (
                          <div key={lead.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all">
                            <div>
                              <a 
                                href={lead.url.startsWith('http') ? lead.url : `https://${lead.url}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-english font-medium text-lg text-white hover:text-brand-blue flex items-center gap-2 transition-colors mb-1"
                                dir="ltr"
                              >
                                {lead.url}
                                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                              </a>
                              <div className="text-xs text-gray-500">{lead.date}</div>
                            </div>
                            <a 
                              href={lead.url.startsWith('http') ? lead.url : `https://${lead.url}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue hover:bg-brand-blue hover:text-white transition-all shrink-0"
                            >
                              <ExternalLink size={18} />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      </div>
      
      {showCloseModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm" dir="rtl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[color:var(--color-brand-darker)] border border-white/10 p-8 rounded-3xl max-w-sm w-full mx-4 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <h3 className="text-xl font-bold mb-3 text-white text-center">هل تريد الإغلاق بدون حفظ؟</h3>
            <p className="text-[#9ca3af] mb-6 text-sm text-center font-light leading-relaxed">لديك تغييرات لم يتم حفظها. يمكن تجاهل هذه التغييرات أو حفظها قبل الإغلاق.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleSaveAndClose} 
                className="w-full py-3 rounded-xl transition-colors font-bold shadow-[0_0_15px_rgba(79,142,247,0.3)] hover:shadow-[0_0_25px_rgba(79,142,247,0.5)] text-white"
                style={{ backgroundColor: config.primaryColor }}
              >
                حفظ وإغلاق
              </button>
              <button 
                onClick={confirmDiscard} 
                className="w-full py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors font-bold"
              >
                تجاهل التغييرات
              </button>
              <button 
                onClick={() => setShowCloseModal(false)} 
                className="w-full py-3 bg-transparent text-[#9ca3af] hover:text-white transition-colors"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

