import React, { useState, useEffect } from 'react';
import { useContent, SiteContent, defaultContent } from '../context/ContentContext';
import { 
  Plus, Trash2, Edit, Save, RotateCcw, LogOut, Lock, 
  Settings, Play, Briefcase, Package, HelpCircle, Trophy, 
  Check, X, ChevronRight, Layout, Eye, Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  // TODO: Replace localStorage auth with Supabase Auth before production.
  const { content, updateContent, resetContent } = useContent();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('nmo_admin_authenticated') === 'true';
  });
  
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'identity' | 'hero' | 'services' | 'packages' | 'faq' | 'stories'>('identity');
  
  // Dynamic local state of content to edit
  const [editedContent, setEditedContent] = useState<SiteContent>(JSON.parse(JSON.stringify(content)));
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  
  // Modal state for additions/edits
  const [serviceModal, setServiceModal] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; index: number; data: any } | null>(null);
  const [packageModal, setPackageModal] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; index: number; data: any; newFeature: string } | null>(null);
  const [faqModal, setFaqModal] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; index: number; data: any } | null>(null);
  const [storyModal, setStoryModal] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; index: number; data: any } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; index: number; onConfirm: () => void } | null>(null);

  // Sync editedContent with context changes if external reset occurs
  useEffect(() => {
    setEditedContent(JSON.parse(JSON.stringify(content)));
  }, [content]);

  // Auto close toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1122') {
      localStorage.setItem('nmo_admin_authenticated', 'true');
      setIsAuthenticated(true);
      setToastMessage({ text: 'تم تسجيل الدخول بنجاح!', type: 'success' });
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 500); // For shake animation duration
      setToastMessage({ text: 'رمز المرور غير صحيح!', type: 'error' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nmo_admin_authenticated');
    setIsAuthenticated(false);
    setToastMessage({ text: 'تم تسجيل الخروج بنجاح!', type: 'info' });
  };

  const handleSaveAll = () => {
    updateContent(editedContent);
    setToastMessage({ text: 'تم حفظ جميع التعديلات بنجاح وتطبيقها على الموقع!', type: 'success' });
  };

  const handleResetDefaults = () => {
    setConfirmDelete({
      type: 'الافتراضيات',
      index: -1,
      onConfirm: () => {
        resetContent();
        setEditedContent(JSON.parse(JSON.stringify(defaultContent)));
        setToastMessage({ text: 'تم استعادة محتوى المصنع الافتراضي!', type: 'info' });
        setConfirmDelete(null);
      }
    });
  };

  const showNotification = (text: string, type: 'success' | 'info' | 'error') => {
    setToastMessage({ text, type });
  };

  // Helper to deep update simple keys
  const updateIdentity = (key: keyof typeof defaultContent.identity, value: any) => {
    setEditedContent(prev => ({
      ...prev,
      identity: {
        ...prev.identity,
        [key]: value
      }
    }));
  };

  const updateHero = (key: keyof typeof defaultContent.hero, value: string) => {
    setEditedContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [key]: value
      }
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07070F] flex items-center justify-center relative overflow-hidden px-4" dir="rtl">
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[120px]" />
        
        {/* Passcode Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full max-w-md bg-black/40 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden ${
            loginError ? 'animate-shake' : ''
          }`}
        >
          {/* Decorative Top Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400" />
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-blue-400 shadow-inner">
              <Lock size={28} className="animate-pulse" />
            </div>
            <h1 className="text-2xl font-black text-white font-arabic">لوحة التحكم NMOLABS</h1>
            <p className="text-gray-400 text-sm mt-2 text-center">أدخل رمز المرور لفتح لوحة التحكم والتعديل على محتوى الموقع</p>
          </div>
          
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-gray-300 text-xs font-bold block">رمز المرور (Passcode)</label>
              <input 
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••"
                maxLength={8}
                className="w-full bg-white/5 hover:bg-white/10 focus:bg-black/60 border border-white/10 focus:border-blue-500 rounded-2xl py-4 px-6 text-center text-xl font-bold tracking-widest text-white outline-none transition-all placeholder:text-gray-600"
                autoFocus
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full py-4 rounded-2xl font-bold text-black bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-300 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              <span>دخول النظام</span>
              <Check size={18} />
            </button>
          </form>
          
          <div className="text-center mt-6 text-xs text-gray-500">
            Nmolabs Growth & Tech Partner v3.4
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070F] text-white flex flex-col font-arabic relative overflow-hidden" dir="rtl">
      {/* Background Gradients */}
      <div className="absolute top-[-40%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-40%] right-[-20%] w-[80%] h-[80%] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      {/* Admin Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold tracking-widest">
            NM
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">لوحة الإدارة MVP</h1>
            <p className="text-xs text-gray-400">تعديل محتوى واجهة موقع NMOLABS</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl transition-all border border-white/5">
            <Eye size={14} />
            <span>عرض الموقع</span>
          </a>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 hover:border-transparent px-3 py-2 rounded-xl transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>تسجيل خروج</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 md:p-6 gap-6 z-10">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 flex flex-col gap-2">
          <div className="bg-black/30 border border-white/5 backdrop-blur-xl rounded-2xl p-4 flex flex-col gap-1.5 shadow-xl">
            <p className="text-xs text-gray-500 px-3 mb-2 font-bold uppercase tracking-wider">الأقسام والخيارات</p>
            
            <button 
              onClick={() => setActiveTab('identity')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all text-right w-full cursor-pointer border ${
                activeTab === 'identity' 
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
              }`}
            >
              <Palette size={18} />
              <span>هوية الموقع والمظهر</span>
            </button>

            <button 
              onClick={() => setActiveTab('hero')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all text-right w-full cursor-pointer border ${
                activeTab === 'hero' 
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
              }`}
            >
              <Layout size={18} />
              <span>القسم الرئيسي (Hero)</span>
            </button>

            <button 
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all text-right w-full cursor-pointer border ${
                activeTab === 'services' 
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
              }`}
            >
              <Briefcase size={18} />
              <span>الخدمات (Services)</span>
            </button>

            <button 
              onClick={() => setActiveTab('packages')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all text-right w-full cursor-pointer border ${
                activeTab === 'packages' 
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
              }`}
            >
              <Package size={18} />
              <span>باقات الاشتراك (Packages)</span>
            </button>

            <button 
              onClick={() => setActiveTab('faq')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all text-right w-full cursor-pointer border ${
                activeTab === 'faq' 
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
              }`}
            >
              <HelpCircle size={18} />
              <span>الأسئلة الشائعة (FAQ)</span>
            </button>

            <button 
              onClick={() => setActiveTab('stories')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all text-right w-full cursor-pointer border ${
                activeTab === 'stories' 
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
              }`}
            >
              <Trophy size={18} />
              <span>قصص النجاح والشعارات</span>
            </button>
          </div>

          <div className="bg-black/30 border border-white/5 backdrop-blur-xl rounded-2xl p-4 flex flex-col gap-2.5 shadow-xl">
            <p className="text-xs text-gray-500 font-bold uppercase px-1">استعادة المحتوى الافتراضي</p>
            <p className="text-xs text-gray-400 px-1 leading-relaxed">يمكنك في أي وقت تصفير التعديلات والعودة للنسخة الثابتة للموقع.</p>
            <button 
              onClick={handleResetDefaults}
              className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-dashed border-white/10 hover:border-rose-500/40 text-gray-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all text-xs font-bold cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>استعادة ضبط المصنع الافتراضي</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Editor Panel */}
        <main className="flex-1 min-w-0">
          <div className="bg-black/30 border border-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl relative">
            
            {/* Form Title & Icon */}
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-inner">
                {activeTab === 'identity' && <Palette size={20} />}
                {activeTab === 'hero' && <Layout size={20} />}
                {activeTab === 'services' && <Briefcase size={20} />}
                {activeTab === 'packages' && <Package size={20} />}
                {activeTab === 'faq' && <HelpCircle size={20} />}
                {activeTab === 'stories' && <Trophy size={20} />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {activeTab === 'identity' && 'هوية الموقع والسمة البصرية'}
                  {activeTab === 'hero' && 'تحرير القسم الرئيسي (Hero Section)'}
                  {activeTab === 'services' && 'إدارة الخدمات (Services)'}
                  {activeTab === 'packages' && 'إدارة باقات الاشتراك المتاحة'}
                  {activeTab === 'faq' && 'إدارة الأسئلة الشائعة'}
                  {activeTab === 'stories' && 'إدارة قصص نجاح الشركاء والشعارات'}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {activeTab === 'identity' && 'تعديل شعار الموقع، الألوان الأساسية، والوضع العام'}
                  {activeTab === 'hero' && 'تعديل العنوان الرئيسي، الوصف، الفيديو التوضيحي وروابط الأزرار'}
                  {activeTab === 'services' && 'إضافة أو تعديل أو حذف خدمات الموقع والأيقونات والروابط'}
                  {activeTab === 'packages' && 'إدارة باقات الخدمة المعروضة في شبكة أدوات المنصة'}
                  {activeTab === 'faq' && 'إضافة وتنسيق الأسئلة والأجوبة وتصنيفها في تبويبات'}
                  {activeTab === 'stories' && 'تحرير شعارات الماركات، نسب النمو، وقصص النجاح الإعلانية'}
                </p>
              </div>
            </div>

            {/* TAB CONTENT: IDENTITY */}
            {activeTab === 'identity' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-bold block">اسم الموقع (Title Tag)</label>
                    <input 
                      type="text"
                      value={editedContent.identity.siteName}
                      onChange={(e) => updateIdentity('siteName', e.target.value)}
                      placeholder="نمو لابز | NMOLABS"
                      className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-blue-500 rounded-2xl py-3.5 px-4 text-white outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-bold block">نص الشعار بالإنجليزية (Logo Text)</label>
                    <input 
                      type="text"
                      value={editedContent.identity.logoText}
                      onChange={(e) => updateIdentity('logoText', e.target.value)}
                      placeholder="NMOLABS"
                      className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-blue-500 rounded-2xl py-3.5 px-4 text-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-bold block flex items-center justify-between">
                      <span>اللون الأساسي (Primary)</span>
                      <span className="text-[10px] text-gray-500 font-mono">{editedContent.identity.primaryColor}</span>
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="color"
                        value={editedContent.identity.primaryColor}
                        onChange={(e) => updateIdentity('primaryColor', e.target.value)}
                        className="w-12 h-12 bg-transparent border-0 cursor-pointer overflow-hidden p-0 rounded-xl"
                      />
                      <input 
                        type="text"
                        value={editedContent.identity.primaryColor}
                        onChange={(e) => updateIdentity('primaryColor', e.target.value)}
                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 text-sm text-center font-mono outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-bold block flex items-center justify-between">
                      <span>اللون الثانوي (Secondary)</span>
                      <span className="text-[10px] text-gray-500 font-mono">{editedContent.identity.secondaryColor}</span>
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="color"
                        value={editedContent.identity.secondaryColor}
                        onChange={(e) => updateIdentity('secondaryColor', e.target.value)}
                        className="w-12 h-12 bg-transparent border-0 cursor-pointer overflow-hidden p-0 rounded-xl"
                      />
                      <input 
                        type="text"
                        value={editedContent.identity.secondaryColor}
                        onChange={(e) => updateIdentity('secondaryColor', e.target.value)}
                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 text-sm text-center font-mono outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-bold block flex items-center justify-between">
                      <span>لون الإجراء الإضافي (Accent)</span>
                      <span className="text-[10px] text-gray-500 font-mono">{editedContent.identity.accentColor}</span>
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="color"
                        value={editedContent.identity.accentColor}
                        onChange={(e) => updateIdentity('accentColor', e.target.value)}
                        className="w-12 h-12 bg-transparent border-0 cursor-pointer overflow-hidden p-0 rounded-xl"
                      />
                      <input 
                        type="text"
                        value={editedContent.identity.accentColor}
                        onChange={(e) => updateIdentity('accentColor', e.target.value)}
                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 text-sm text-center font-mono outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6 space-y-3">
                  <label className="text-gray-300 text-sm font-bold block">مظهر السمة الافتراضي</label>
                  <div className="grid grid-cols-2 gap-4 max-w-sm">
                    <button 
                      onClick={() => updateIdentity('themeMode', 'dark')}
                      className={`py-3 rounded-2xl font-bold text-sm border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        editedContent.identity.themeMode === 'dark'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-md'
                          : 'bg-white/[0.02] text-gray-400 border-white/5 hover:text-white'
                      }`}
                    >
                      <Check size={16} className={editedContent.identity.themeMode === 'dark' ? 'opacity-100' : 'opacity-0'} />
                      <span>داكن (Dark Mode)</span>
                    </button>
                    <button 
                      onClick={() => updateIdentity('themeMode', 'light')}
                      className={`py-3 rounded-2xl font-bold text-sm border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        editedContent.identity.themeMode === 'light'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-md'
                          : 'bg-white/[0.02] text-gray-400 border-white/5 hover:text-white'
                      }`}
                    >
                      <Check size={16} className={editedContent.identity.themeMode === 'light' ? 'opacity-100' : 'opacity-0'} />
                      <span>مضيء (Light Mode)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: HERO */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-bold block">العنوان العريض (Main Catchy Title)</label>
                  <input 
                    type="text"
                    value={editedContent.hero.title}
                    onChange={(e) => updateHero('title', e.target.value)}
                    placeholder="نمِّ متجرك بالذكاء.. لا بالتخمين"
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-blue-500 rounded-2xl py-3.5 px-4 text-white outline-none transition-all font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-bold block">الوصف التوضيحي (Description Subtitle)</label>
                  <textarea 
                    rows={3}
                    value={editedContent.hero.description}
                    onChange={(e) => updateHero('description', e.target.value)}
                    placeholder="حلل متجرك، اكتشف نقاط الضعف، واحصل على خطة نمو وتسويق ذكية في مكان واحد."
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-blue-500 rounded-2xl py-3.5 px-4 text-white outline-none transition-all resize-none leading-relaxed text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-6">
                  <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-bold block">عنوان زر الاتصال الرئيسي (CTA Label)</label>
                    <input 
                      type="text"
                      value={editedContent.hero.ctaText}
                      onChange={(e) => updateHero('ctaText', e.target.value)}
                      placeholder="حلل الآن"
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-blue-500 rounded-2xl py-3.5 px-4 text-white outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-bold block">رابط الزر (CTA Anchor/Url)</label>
                    <input 
                      type="text"
                      value={editedContent.hero.ctaLink}
                      onChange={(e) => updateHero('ctaLink', e.target.value)}
                      placeholder="#analyzer"
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-blue-500 rounded-2xl py-3.5 px-4 text-white font-mono outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2 border-t border-white/5 pt-6">
                  <label className="text-gray-300 text-sm font-bold block flex items-center gap-1">
                    <Play size={14} className="text-blue-400" />
                    <span>رابط الفيديو التوضيحي الخلفي (Video URL - mp4)</span>
                  </label>
                  <input 
                    type="text"
                    value={editedContent.hero.videoUrl}
                    onChange={(e) => updateHero('videoUrl', e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-blue-500 rounded-2xl py-3.5 px-4 text-white font-mono outline-none transition-all"
                  />
                  <p className="text-[10px] text-gray-500">أدخل رابط فيديو ينتهي بـ .mp4 ليتم تشغيله تلقائياً في الخلفية بطريقة سينمائية هادئة.</p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SERVICES */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400 font-bold">إجمالي الخدمات المضافة: {editedContent.services.length}</span>
                  <button 
                    onClick={() => setServiceModal({
                      isOpen: true,
                      mode: 'add',
                      index: -1,
                      data: { id: `srv_${Date.now()}`, title: '', description: '', icon: 'Layout', category: 'خدمة', ctaText: 'تفاصيل أكثر', ctaLink: '' }
                    })}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 font-bold text-xs text-black transition-all cursor-pointer shadow-lg shadow-blue-500/10"
                  >
                    <Plus size={14} />
                    <span>إضافة خدمة جديدة</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editedContent.services.map((srv, idx) => (
                    <div 
                      key={srv.id}
                      className="bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all flex flex-col justify-between gap-4 group hover:shadow-lg"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-400 font-bold flex-shrink-0">
                          {srv.icon === 'Megaphone' && <span className="text-lg">📢</span>}
                          {srv.icon === 'Share2' && <span className="text-lg">🔗</span>}
                          {srv.icon === 'Search' && <span className="text-lg">🔍</span>}
                          {srv.icon === 'PenTool' && <span className="text-lg">✏️</span>}
                          {srv.icon !== 'Megaphone' && srv.icon !== 'Share2' && srv.icon !== 'Search' && srv.icon !== 'PenTool' && <span className="text-lg">💻</span>}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-white">{srv.title}</h3>
                            <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 font-bold">{srv.category}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-3">{srv.description}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1">
                        <span className="text-[10px] text-gray-500">رمز الأيقونة: <code className="font-mono text-gray-400 bg-white/5 px-1 py-0.5 rounded">{srv.icon}</code></span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setServiceModal({ isOpen: true, mode: 'edit', index: idx, data: { ...srv } })}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-blue-400 transition-all cursor-pointer"
                            title="تعديل الخدمة"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => setConfirmDelete({
                              type: 'الخدمة',
                              index: idx,
                              onConfirm: () => {
                                setEditedContent(prev => {
                                  const updated = [...prev.services];
                                  updated.splice(idx, 1);
                                  return { ...prev, services: updated };
                                });
                                showNotification('تم حذف الخدمة بنجاح.', 'info');
                                setConfirmDelete(null);
                              }
                            })}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-black text-rose-400 transition-all cursor-pointer"
                            title="حذف الخدمة"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: PACKAGES */}
            {activeTab === 'packages' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400 font-bold">باقات الاشتراك الفعالة: {editedContent.packages.length}</span>
                  <button 
                    onClick={() => setPackageModal({
                      isOpen: true,
                      mode: 'add',
                      index: -1,
                      data: { id: `pkg_${Date.now()}`, name: '', description: '', price: '', features: [], isFeatured: false, ctaText: 'اختر الباقة', ctaLink: '' },
                      newFeature: ''
                    })}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 font-bold text-xs text-black transition-all cursor-pointer shadow-lg shadow-blue-500/10"
                  >
                    <Plus size={14} />
                    <span>إضافة باقة جديدة</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {editedContent.packages.map((pkg, idx) => (
                    <div 
                      key={pkg.id}
                      className={`relative bg-white/[0.02] rounded-3xl p-6 transition-all flex flex-col justify-between gap-5 border ${
                        pkg.isFeatured ? 'border-purple-500/30 bg-gradient-to-b from-purple-500/[0.05] to-transparent shadow-lg' : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      {pkg.isFeatured && (
                        <div className="absolute top-4 left-4 bg-purple-500 text-black font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          الباقة المميزة (الأكثر طلباً)
                        </div>
                      )}
                      
                      <div>
                        <div className="flex items-end gap-2">
                          <h3 className="font-black text-lg text-white">{pkg.name}</h3>
                          <span className="text-xs text-gray-500 mb-1">({pkg.price === '0' ? 'مجانية' : pkg.price === 'أسعار مخصصة' ? 'مخصصة' : `$${pkg.price} شهرياً`})</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 leading-relaxed">{pkg.description}</p>
                        
                        {/* Features List chips */}
                        <div className="mt-4 space-y-1.5">
                          <p className="text-[10px] text-gray-500 font-bold">ميزات الباقة ({pkg.features.length}):</p>
                          <div className="flex flex-wrap gap-1.5">
                            {pkg.features.map((feat, fIdx) => (
                              <span key={fIdx} className="text-[10px] bg-white/5 text-gray-300 border border-white/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check size={10} className="text-emerald-400" />
                                <span>{feat}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-white/5 pt-3">
                        <span className="text-[10px] text-gray-500">رابط الدعوة: <code className="font-mono text-gray-400 bg-white/5 px-1 py-0.5 rounded">{pkg.ctaLink || '#'}</code></span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setPackageModal({ isOpen: true, mode: 'edit', index: idx, data: { ...pkg }, newFeature: '' })}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-blue-400 transition-all cursor-pointer"
                            title="تعديل الباقة"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => setConfirmDelete({
                              type: 'الباقة',
                              index: idx,
                              onConfirm: () => {
                                setEditedContent(prev => {
                                  const updated = [...prev.packages];
                                  updated.splice(idx, 1);
                                  return { ...prev, packages: updated };
                                });
                                showNotification('تم حذف الباقة بنجاح.', 'info');
                                setConfirmDelete(null);
                              }
                            })}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-black text-rose-400 transition-all cursor-pointer"
                            title="حذف الباقة"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: FAQ */}
            {activeTab === 'faq' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400 font-bold">إجمالي الأسئلة الشائعة: {editedContent.faq.length}</span>
                  <button 
                    onClick={() => setFaqModal({
                      isOpen: true,
                      mode: 'add',
                      index: -1,
                      data: { id: `faq_${Date.now()}`, question: '', answer: '', category: 'حول المنصة والحلول الذكية' }
                    })}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 font-bold text-xs text-black transition-all cursor-pointer shadow-lg shadow-blue-500/10"
                  >
                    <Plus size={14} />
                    <span>إضافة سؤال جديد</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {editedContent.faq.map((item, idx) => (
                    <div 
                      key={item.id}
                      className="bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all flex flex-col md:flex-row justify-between gap-4 group"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs px-2.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 font-bold">{item.category}</span>
                          <span className="text-xs text-gray-500 font-mono">ID: {item.id}</span>
                        </div>
                        <h4 className="font-bold text-sm text-white">{item.question}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed font-light">{item.answer}</p>
                      </div>

                      <div className="flex items-center gap-2 md:self-center">
                        <button 
                          onClick={() => setFaqModal({ isOpen: true, mode: 'edit', index: idx, data: { ...item } })}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-blue-400 transition-all cursor-pointer"
                          title="تعديل السؤال"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => setConfirmDelete({
                            type: 'السؤال',
                            index: idx,
                            onConfirm: () => {
                              setEditedContent(prev => {
                                const updated = [...prev.faq];
                                updated.splice(idx, 1);
                                return { ...prev, faq: updated };
                              });
                              showNotification('تم حذف السؤال بنجاح.', 'info');
                              setConfirmDelete(null);
                            }
                          })}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-black text-rose-400 transition-all cursor-pointer"
                          title="حذف السؤال"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: STORIES */}
            {activeTab === 'stories' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400 font-bold">قصص النجاح المضافة: {editedContent.successStories.length}</span>
                  <button 
                    onClick={() => setStoryModal({
                      isOpen: true,
                      mode: 'add',
                      index: -1,
                      data: { id: `story_${Date.now()}`, storeName: '', logoUrl: '', resultText: '', growthPercentage: '+0%', brandColor: '#4F8EF7' }
                    })}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 font-bold text-xs text-black transition-all cursor-pointer shadow-lg shadow-blue-500/10"
                  >
                    <Plus size={14} />
                    <span>إضافة علامة تجارية / قصة نجاح</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editedContent.successStories.map((story, idx) => (
                    <div 
                      key={story.id}
                      className="bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all flex justify-between gap-4 group"
                    >
                      <div className="flex gap-4 flex-1">
                        <div className="w-16 h-16 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-center p-2 flex-shrink-0 overflow-hidden">
                          <img 
                            src={story.logoUrl || '/logo.jpg'} 
                            alt={story.storeName} 
                            className="w-full h-full object-contain filter brightness-110 drop-shadow-md"
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/000000/ffffff?text=LOGO'; }}
                          />
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-white">{story.storeName}</h4>
                            <span 
                              className="text-[9px] px-2 py-0.5 rounded-full text-white font-bold"
                              style={{ backgroundColor: story.brandColor || '#333' }}
                            >
                              {story.growthPercentage}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed font-light line-clamp-3">{story.resultText}</p>
                          <div className="text-[9px] text-gray-500 flex items-center gap-1.5">
                            <span>لون الهوية:</span>
                            <span className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ backgroundColor: story.brandColor }} />
                            <span className="font-mono">{story.brandColor}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-end">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => setStoryModal({ isOpen: true, mode: 'edit', index: idx, data: { ...story } })}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-blue-400 transition-all cursor-pointer"
                            title="تعديل القصة"
                          >
                            <Edit size={12} />
                          </button>
                          <button 
                            onClick={() => setConfirmDelete({
                              type: 'قصة نجاح الشريك',
                              index: idx,
                              onConfirm: () => {
                                setEditedContent(prev => {
                                  const updated = [...prev.successStories];
                                  updated.splice(idx, 1);
                                  return { ...prev, successStories: updated };
                                });
                                showNotification('تم حذف علامة الشريك بنجاح.', 'info');
                                setConfirmDelete(null);
                              }
                            })}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-black text-rose-400 transition-all cursor-pointer"
                            title="حذف القصة"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <span className="text-[8px] text-gray-600 font-mono">ID: {story.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FLOATING ACTION CONTROL BAR FOR UNSAVED CHANGES */}
            <div className="border-t border-white/5 pt-6 mt-12 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="text-xs text-gray-400 text-center sm:text-right">
                💡 <span className="font-bold">ملاحظة:</span> لا يتم تطبيق أي من التعديلات المسجلة على الموقع العام بشكل فوري إلا عند النقر على <span className="text-blue-400 font-bold">حفظ التغييرات</span>.
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={handleSaveAll}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-300 hover:opacity-90 active:scale-[0.98] transition-all font-bold text-black shadow-lg shadow-blue-500/10 cursor-pointer"
                >
                  <Save size={16} />
                  <span>حفظ التغييرات ونشرها</span>
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-6 px-6 text-center text-xs text-gray-500 mt-12 backdrop-blur-sm z-10 bg-black/20">
        لوحة تحكم نمو لابز الإدارية MVP • تم التطوير بالتعاون مع Antigravity AI • جميع الحقوق محفوظة لـ NMOLABS © 2026
      </footer>

      {/* ========================================================================= */}
      {/* ======================= PORTAL MODALS AND POPUPS ======================== */}
      {/* ========================================================================= */}

      {/* SERVICE MODAL */}
      {serviceModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-[#0d0d17] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 text-white"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-lg font-bold text-white">
                {serviceModal.mode === 'add' ? 'إضافة خدمة جديدة للموقع' : `تعديل خدمة: ${serviceModal.data.title}`}
              </h3>
              <button onClick={() => setServiceModal(null)} className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-bold block">عنوان الخدمة</label>
                <input 
                  type="text"
                  value={serviceModal.data.title}
                  onChange={(e) => setServiceModal(prev => prev ? { ...prev, data: { ...prev.data, title: e.target.value } } : null)}
                  placeholder="مثال: إدارة السوشيال ميديا"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-bold block">التصنيف الإرشادي (Label Tag)</label>
                  <input 
                    type="text"
                    value={serviceModal.data.category}
                    onChange={(e) => setServiceModal(prev => prev ? { ...prev, data: { ...prev.data, category: e.target.value } } : null)}
                    placeholder="مثال: سوشيال"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-bold block">رمز الأيقونة (من Lucide)</label>
                  <select 
                    value={serviceModal.data.icon}
                    onChange={(e) => setServiceModal(prev => prev ? { ...prev, data: { ...prev.data, icon: e.target.value } } : null)}
                    className="w-full bg-[#0d0d17] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none text-white"
                  >
                    <option value="Layout">واجهات ومتاجر (Layout)</option>
                    <option value="Megaphone">إعلانات وحملات (Megaphone)</option>
                    <option value="Share2">تفاعل وشبكات (Share2)</option>
                    <option value="Search">محركات بحث وسيو (Search)</option>
                    <option value="PenTool">كتابة ومحتوى (PenTool)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-bold block">شرح وتفاصيل الخدمة بالتفصيل</label>
                <textarea 
                  rows={4}
                  value={serviceModal.data.description}
                  onChange={(e) => setServiceModal(prev => prev ? { ...prev, data: { ...prev.data, description: e.target.value } } : null)}
                  placeholder="اكتب وصفاً جذاباً يشرح مزايا الخدمة وكيفية تقديمها بأسلوب مقنع بيعياً..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-blue-500 outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-bold block">عنوان زر الإجراء (CTA Label)</label>
                  <input 
                    type="text"
                    value={serviceModal.data.ctaText}
                    onChange={(e) => setServiceModal(prev => prev ? { ...prev, data: { ...prev.data, ctaText: e.target.value } } : null)}
                    placeholder="تفاصيل أكثر"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-bold block">رابط الزر (CTA URL/Anchor)</label>
                  <input 
                    type="text"
                    value={serviceModal.data.ctaLink}
                    onChange={(e) => setServiceModal(prev => prev ? { ...prev, data: { ...prev.data, ctaLink: e.target.value } } : null)}
                    placeholder="مثال: #analyzer"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-white/5 pt-4">
              <button 
                onClick={() => {
                  setEditedContent(prev => {
                    const list = [...prev.services];
                    if (serviceModal.mode === 'add') {
                      list.push(serviceModal.data);
                    } else {
                      list[serviceModal.index] = serviceModal.data;
                    }
                    return { ...prev, services: list };
                  });
                  showNotification(serviceModal.mode === 'add' ? 'تمت إضافة الخدمة بنجاح.' : 'تم تعديل الخدمة بنجاح.', 'success');
                  setServiceModal(null);
                }}
                className="flex-1 py-3 rounded-xl bg-blue-500 text-black font-bold text-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                حفظ الخدمة
              </button>
              <button 
                onClick={() => setServiceModal(null)}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* PACKAGE MODAL */}
      {packageModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-[#0d0d17] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 text-white"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-lg font-bold text-white">
                {packageModal.mode === 'add' ? 'إضافة باقة اشتراك جديدة' : `تعديل باقة: ${packageModal.data.name}`}
              </h3>
              <button onClick={() => setPackageModal(null)} className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-bold block">اسم الباقة</label>
                  <input 
                    type="text"
                    value={packageModal.data.name}
                    onChange={(e) => setPackageModal(prev => prev ? { ...prev, data: { ...prev.data, name: e.target.value } } : null)}
                    placeholder="مثال: باقة الأعمال"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-bold block">السعر الشهري (بالدولار أو نص)</label>
                  <input 
                    type="text"
                    value={packageModal.data.price}
                    onChange={(e) => setPackageModal(prev => prev ? { ...prev, data: { ...prev.data, price: e.target.value } } : null)}
                    placeholder="مثال: 149 أو أسعار مخصصة"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-bold block">شرح موجز للباقة</label>
                <input 
                  type="text"
                  value={packageModal.data.description}
                  onChange={(e) => setPackageModal(prev => prev ? { ...prev, data: { ...prev.data, description: e.target.value } } : null)}
                  placeholder="مجموعة من الميزات الرائعة لمساعدتك في النمو والتحليل الذكي..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div className="space-y-2 border-t border-white/5 pt-4">
                <label className="text-xs text-gray-400 font-bold block">ميزات الباقة (Features Manager)</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={packageModal.newFeature}
                    onChange={(e) => setPackageModal(prev => prev ? { ...prev, newFeature: e.target.value } : null)}
                    placeholder="اكتب اسم ميزة واضغط إضافة..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (packageModal.newFeature.trim()) {
                          setPackageModal(prev => {
                            if (!prev) return null;
                            return {
                              ...prev,
                              newFeature: '',
                              data: {
                                ...prev.data,
                                features: [...prev.data.features, prev.newFeature.trim()]
                              }
                            };
                          });
                        }
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      if (packageModal.newFeature.trim()) {
                        setPackageModal(prev => {
                          if (!prev) return null;
                          return {
                            ...prev,
                            newFeature: '',
                            data: {
                              ...prev.data,
                              features: [...prev.data.features, prev.newFeature.trim()]
                            }
                          };
                        });
                      }
                    }}
                    className="px-4 py-2 bg-blue-500 text-black font-bold text-xs rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                  >
                    <span>إضافة</span>
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mt-2 bg-black/40 border border-white/5 p-3 rounded-2xl min-h-[60px]">
                  {packageModal.data.features.length === 0 ? (
                    <span className="text-[10px] text-gray-600 self-center mx-auto">لم تتم إضافة أي ميزات للباقة حتى الآن.</span>
                  ) : (
                    packageModal.data.features.map((feat: string, fIdx: number) => (
                      <span key={fIdx} className="text-[10px] bg-white/5 border border-white/5 text-gray-300 pl-1.5 pr-3 py-1 rounded-full flex items-center gap-1">
                        <Check size={10} className="text-emerald-400" />
                        <span>{feat}</span>
                        <button 
                          onClick={() => setPackageModal(prev => {
                            if (!prev) return null;
                            const copy = [...prev.data.features];
                            copy.splice(fIdx, 1);
                            return { ...prev, data: { ...prev.data, features: copy } };
                          })}
                          className="w-4 h-4 rounded-full bg-white/10 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 flex items-center justify-center font-bold"
                        >
                          <X size={8} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-bold block">عنوان الزر الإجرائي (CTA Label)</label>
                  <input 
                    type="text"
                    value={packageModal.data.ctaText}
                    onChange={(e) => setPackageModal(prev => prev ? { ...prev, data: { ...prev.data, ctaText: e.target.value } } : null)}
                    placeholder="اختر الباقة"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-bold block">رابط زر الشراء (WhatsApp/Link)</label>
                  <input 
                    type="text"
                    value={packageModal.data.ctaLink}
                    onChange={(e) => setPackageModal(prev => prev ? { ...prev, data: { ...prev.data, ctaLink: e.target.value } } : null)}
                    placeholder="مثال: https://wa.me/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 font-mono outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="isFeatured"
                  checked={packageModal.data.isFeatured}
                  onChange={(e) => setPackageModal(prev => prev ? { ...prev, data: { ...prev.data, isFeatured: e.target.checked } } : null)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <label htmlFor="isFeatured" className="text-xs text-gray-300 font-bold cursor-pointer select-none">
                  تمييز هذه الباقة كأكثر الباقات طلباً (يتم إحاطتها بتصميم متوهج مميز)
                </label>
              </div>
            </div>

            <div className="flex gap-3 border-t border-white/5 pt-4">
              <button 
                onClick={() => {
                  setEditedContent(prev => {
                    const list = [...prev.packages];
                    if (packageModal.mode === 'add') {
                      list.push(packageModal.data);
                    } else {
                      list[packageModal.index] = packageModal.data;
                    }
                    return { ...prev, packages: list };
                  });
                  showNotification(packageModal.mode === 'add' ? 'تمت إضافة الباقة بنجاح.' : 'تم تعديل الباقة بنجاح.', 'success');
                  setPackageModal(null);
                }}
                className="flex-1 py-3 rounded-xl bg-blue-500 text-black font-bold text-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                حفظ الباقة
              </button>
              <button 
                onClick={() => setPackageModal(null)}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* FAQ MODAL */}
      {faqModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-[#0d0d17] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 text-white"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-lg font-bold text-white">
                {faqModal.mode === 'add' ? 'إضافة سؤال وجواب جديد' : 'تعديل السؤال الشائع'}
              </h3>
              <button onClick={() => setFaqModal(null)} className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-bold block">التصنيف أو مجموعة الأسئلة</label>
                <select 
                  value={faqModal.data.category}
                  onChange={(e) => setFaqModal(prev => prev ? { ...prev, data: { ...prev.data, category: e.target.value } } : null)}
                  className="w-full bg-[#0d0d17] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none text-white"
                >
                  <option value="حول المنصة والحلول الذكية">حول المنصة والحلول الذكية</option>
                  <option value="الأسعار والتواصل">الأسعار والتواصل</option>
                  <option value="متاعب Google وحلولها">متاعب Google وحلولها</option>
                  <option value="الحملات وضمان الجودة">الحملات وضمان الجودة</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-bold block">السؤال</label>
                <input 
                  type="text"
                  value={faqModal.data.question}
                  onChange={(e) => setFaqModal(prev => prev ? { ...prev, data: { ...prev.data, question: e.target.value } } : null)}
                  placeholder="مثال: هل تدعمون المتاجر المبنية على سلة وزد؟"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-bold block">الإجابة التفصيلية</label>
                <textarea 
                  rows={5}
                  value={faqModal.data.answer}
                  onChange={(e) => setFaqModal(prev => prev ? { ...prev, data: { ...prev.data, answer: e.target.value } } : null)}
                  placeholder="اكتب الإجابة الكاملة والتوضيح بأسلوب راقٍ وشامل..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-blue-500 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex gap-3 border-t border-white/5 pt-4">
              <button 
                onClick={() => {
                  setEditedContent(prev => {
                    const list = [...prev.faq];
                    if (faqModal.mode === 'add') {
                      list.push(faqModal.data);
                    } else {
                      list[faqModal.index] = faqModal.data;
                    }
                    return { ...prev, faq: list };
                  });
                  showNotification(faqModal.mode === 'add' ? 'تم حفظ السؤال بنجاح.' : 'تم تعديل السؤال بنجاح.', 'success');
                  setFaqModal(null);
                }}
                className="flex-1 py-3 rounded-xl bg-blue-500 text-black font-bold text-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                حفظ السؤال
              </button>
              <button 
                onClick={() => setFaqModal(null)}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* STORY MODAL */}
      {storyModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-[#0d0d17] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 text-white"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-lg font-bold text-white">
                {storyModal.mode === 'add' ? 'إضافة شريك جديد / قصة نجاح' : `تعديل قصة: ${storyModal.data.storeName}`}
              </h3>
              <button onClick={() => setStoryModal(null)} className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-bold block">اسم المتجر / العلامة</label>
                  <input 
                    type="text"
                    value={storyModal.data.storeName}
                    onChange={(e) => setStoryModal(prev => prev ? { ...prev, data: { ...prev.data, storeName: e.target.value } } : null)}
                    placeholder="مثال: الفكرة النادرة"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-bold block">معدل النمو المحقق (الأرباح أو النسبة)</label>
                  <input 
                    type="text"
                    value={storyModal.data.growthPercentage}
                    onChange={(e) => setStoryModal(prev => prev ? { ...prev, data: { ...prev.data, growthPercentage: e.target.value } } : null)}
                    placeholder="مثال: +300% أو +8x ROAS"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-bold block">رابط شعار المتجر (PNG / SVG Logo URL)</label>
                <input 
                  type="text"
                  value={storyModal.data.logoUrl}
                  onChange={(e) => setStoryModal(prev => prev ? { ...prev, data: { ...prev.data, logoUrl: e.target.value } } : null)}
                  placeholder="https://cdn.salla.sa/..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 font-mono outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-bold block">ملخص النتائج والنجاح</label>
                <textarea 
                  rows={3}
                  value={storyModal.data.resultText}
                  onChange={(e) => setStoryModal(prev => prev ? { ...prev, data: { ...prev.data, resultText: e.target.value } } : null)}
                  placeholder="أدخل ملخصاً للنتائج التي تحققت للمتجر كتقليل تكلفة الاستحواذ أو مضاعفة المبيعات..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-blue-500 outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1 border-t border-white/5 pt-4">
                <label className="text-xs text-gray-400 font-bold block">اللون المميز للماركة (Brand Color)</label>
                <div className="flex gap-3 items-center">
                  <input 
                    type="color"
                    value={storyModal.data.brandColor}
                    onChange={(e) => setStoryModal(prev => prev ? { ...prev, data: { ...prev.data, brandColor: e.target.value } } : null)}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <input 
                    type="text"
                    value={storyModal.data.brandColor}
                    onChange={(e) => setStoryModal(prev => prev ? { ...prev, data: { ...prev.data, brandColor: e.target.value } } : null)}
                    placeholder="#4F8EF7"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-white/5 pt-4">
              <button 
                onClick={() => {
                  setEditedContent(prev => {
                    const list = [...prev.successStories];
                    if (storyModal.mode === 'add') {
                      list.push(storyModal.data);
                    } else {
                      list[storyModal.index] = storyModal.data;
                    }
                    return { ...prev, successStories: list };
                  });
                  showNotification(storyModal.mode === 'add' ? 'تمت إضافة قصة الشريك بنجاح.' : 'تم تعديل قصة الشريك بنجاح.', 'success');
                  setStoryModal(null);
                }}
                className="flex-1 py-3 rounded-xl bg-blue-500 text-black font-bold text-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                حفظ الشريك
              </button>
              <button 
                onClick={() => setStoryModal(null)}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="w-full max-w-sm bg-[#120d0d] border border-rose-500/20 rounded-3xl p-6 shadow-2xl text-center text-white space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-2 animate-bounce">
              <Trash2 size={24} />
            </div>
            <h3 className="text-base font-bold text-white">هل أنت متأكد من الحذف؟</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              أنت على وشك حذف {confirmDelete.type}. هذا الإجراء فوري وسيتعين عليك الضغط على حفظ التعديلات لنشره.
            </p>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={confirmDelete.onConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 text-black font-bold text-xs hover:opacity-90 transition-all cursor-pointer"
              >
                تأكيد الحذف
              </button>
              <button 
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                تراجع
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST SUCCESS / INFO NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 left-6 z-[120] px-5 py-4 rounded-2xl border text-sm font-bold shadow-2xl flex items-center gap-3 backdrop-blur-md ${
              toastMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
              toastMessage.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
              'bg-blue-500/10 border-blue-500/20 text-blue-400'
            }`}
          >
            {toastMessage.type === 'success' && <Check size={18} className="animate-bounce" />}
            {toastMessage.type === 'error' && <X size={18} className="animate-bounce" />}
            {toastMessage.type === 'info' && <Settings size={18} className="animate-spin" />}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
