import React, { useEffect, useState } from 'react';
import { useSite } from '../context/SiteContext';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Moon, Sun, Menu, X } from 'lucide-react';
import { triggerBookingModal } from './BookingModal';
import siteLogo from '../assets/images/site-logo.png';

export const Header = () => {
  const { config, updateConfig } = useSite();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { name: 'الرئيسية', act: 'hero' },
    { 
      name: 'خدماتنا', 
      dropdown: [
        { name: 'إنشاء المتاجر', act: 'ecommerce' },
        { name: 'حلول النمو', act: 'solutions' },
        { name: 'أدوات نمو لابز', act: 'tools' }
      ]
    },
    { name: 'قصص النجاح', act: 'testimonials' },
    { name: 'الأسعار', act: 'pricing' },
    { name: 'المدونة', act: 'blog' },
    { name: 'الأسئلة الشائعة', act: 'faq' },
    { name: 'تواصل معنا', act: 'contact' },
  ];

  const handleScroll = (id: string) => {
    setIsMobileMenuOpen(false);
    if (config.currentRoute && config.currentRoute !== 'home') {
      updateConfig({ currentRoute: 'home' });
      // add a small timeout to let React render the home component before scrolling
      setTimeout(() => {
        if(id === 'hero') window.scrollTo({top: 0, behavior: 'smooth'});
        else if(id === 'contact' && config.contactNumber) {
          window.open(`https://wa.me/${config.contactNumber.replace(/[^0-9]/g, '')}`, '_blank');
        } else {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    if(id === 'hero') window.scrollTo({top: 0, behavior: 'smooth'});
    else if(id === 'contact' && config.contactNumber) {
      window.open(`https://wa.me/${config.contactNumber.replace(/[^0-9]/g, '')}`, '_blank');
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleTheme = () => {
    const newTheme = config.theme === 'dark' ? 'light' : 'dark';
    updateConfig({ theme: newTheme });
  };

  useEffect(() => {
    if (config.theme === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  }, [config.theme]);

  // Handle body scrolling when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-active');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('mobile-menu-active');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('mobile-menu-active');
    };
  }, [isMobileMenuOpen]);

  // Sync document direction (RTL / LTR) with selected config language
  useEffect(() => {
    const isEn = config.language === 'en';
    document.documentElement.dir = isEn ? 'ltr' : 'rtl';
    document.documentElement.lang = isEn ? 'en' : 'ar';
  }, [config.language]);

  const handleToggleLanguage = () => {
    updateConfig({ language: config.language === 'en' ? 'ar' : 'en' });
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-black/40 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] border border-black/80 rounded-2xl px-4 md:px-6 py-3 transition-colors backdrop-blur-md">
        {/* Mobile Menu Button - Right (for RTL) */}
        <button 
          className="lg:hidden text-white hover:text-[color:var(--color-brand-blue)] transition-colors p-2 -mr-2"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Logo - Right */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleScroll('hero')}>
          <img src={siteLogo} alt="NMOLABS" className="h-10 object-contain drop-shadow-[0_0_15px_rgba(79,142,247,0.3)]"
            onError={(e) => {
              // Fallback to text if image not uploaded yet
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <span className="hidden font-bold text-xl tracking-wide font-english text-[color:var(--color-text-main)]">{config.logoText || 'NMOLABS'}</span>
        </div>

        {/* Navigation - Middle (Hidden on mobile) */}
        <nav className="hidden lg:flex items-center gap-6">
          {mainNavItems.map((item, idx) => (
            item.dropdown ? (
              <div key={idx} className="relative group">
                <button className="text-sm font-medium text-[color:var(--color-text-muted)] hover:text-[color:var(--color-brand-blue)] transition-colors flex items-center gap-1">
                  {item.name}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:rotate-180 transition-transform"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex flex-col">
                  {item.dropdown.map((dropItem, dropIdx) => (
                    <button 
                      key={dropIdx}
                      onClick={() => handleScroll(dropItem.act)}
                      className="text-right px-4 py-3 text-sm text-[color:var(--color-text-muted)] hover:text-white hover:bg-[color:var(--color-brand-blue)]/20 transition-colors w-full border-b border-white/5 last:border-0"
                    >
                      {dropItem.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button 
                key={idx}
                onClick={() => handleScroll(item.act)}
                className="text-sm font-medium text-[color:var(--color-text-muted)] hover:text-[color:var(--color-brand-blue)] transition-colors"
              >
                {item.name}
              </button>
            )
          ))}
        </nav>

        {/* Actions - Left */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 border-l border-white/10 pl-4 ml-2">
            {config.showThemeToggle && (
              <button onClick={toggleTheme} className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-brand-blue)] transition-colors cursor-pointer">
                {config.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <button 
              onClick={handleToggleLanguage}
              className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-main)] transition-colors font-english text-sm font-medium flex items-center gap-1 cursor-pointer"
            >
              <Globe size={18} />
              {config.language === 'en' ? 'عربي' : 'EN'}
            </button>
          </div>
          <button 
            onClick={() => triggerBookingModal('تحليل المتاجر')}
            className="hidden sm:block px-6 py-2.5 rounded-full font-bold text-sm bg-[color:var(--color-text-main)] text-[color:var(--color-brand-dark)] hover:opacity-90 transition-all shadow-lg hover:shadow-xl cursor-pointer"
            style={{ boxShadow: `0 0 20px -5px ${config.primaryColor}` }}
          >
            {config.language === 'en' ? 'Start Analysis' : 'ابدأ التحليل الآن'}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[320px] bg-gradient-to-b from-[#0c0c0c] to-[#121212] border-l border-white/10 shadow-2xl z-[70] lg:hidden flex flex-col p-8 overflow-y-auto"
              dir={config.language === 'en' ? 'ltr' : 'rtl'}
            >
              <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <img src={siteLogo} alt="NMOLABS" className="h-10 object-contain drop-shadow-md" />
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 text-gray-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                {mainNavItems.map((item, idx) => (
                  <div key={idx} className="mb-2">
                    {item.dropdown ? (
                      <div className="flex flex-col gap-2 bg-white/[0.02] rounded-2xl p-4 border border-white/5">
                        <span className="text-gray-300 font-bold px-2 flex items-center gap-2 select-none">
                          <div className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-brand-blue-val)]" />
                          {item.name}
                        </span>
                        <div className="flex flex-col gap-1 mt-2">
                          {item.dropdown.map((dropItem, dropIdx) => (
                            <button
                              key={dropIdx}
                              onClick={() => handleScroll(dropItem.act)}
                              className="text-right text-gray-400 hover:text-white py-2.5 px-4 rounded-xl hover:bg-[color:var(--color-brand-blue-val)]/10 transition-all font-medium text-sm flex items-center gap-2"
                            >
                              <span className="w-1 h-1 rounded-full bg-gray-500 opacity-50" />
                              {dropItem.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleScroll(item.act)}
                        className="text-right text-gray-300 hover:text-white hover:bg-white/5 py-3.5 px-4 rounded-2xl w-full font-bold transition-all text-base flex items-center gap-3 border border-transparent hover:border-white/5"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-brand-blue-val)]" />
                        {item.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4">
                <div className="flex items-center justify-center gap-4">
                  {config.showThemeToggle && (
                    <button onClick={toggleTheme} className="text-gray-400 hover:text-white transition-colors p-3.5 bg-white/5 hover:bg-white/10 rounded-xl flex-1 flex justify-center cursor-pointer">
                      {config.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                  )}
                  <button 
                    onClick={handleToggleLanguage}
                    className="text-gray-400 hover:text-white transition-colors font-english text-sm font-bold flex items-center justify-center gap-2 p-3.5 bg-white/5 hover:bg-white/10 rounded-xl flex-1 cursor-pointer"
                  >
                    <Globe size={18} />
                    {config.language === 'en' ? 'عربي' : 'English'}
                  </button>
                </div>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    triggerBookingModal('تحليل المتاجر');
                  }}
                  className="w-full py-4 rounded-xl font-bold text-[color:var(--color-brand-dark)] transition-transform active:scale-95 cursor-pointer shadow-lg relative overflow-hidden group"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <span className="relative z-10">{config.language === 'en' ? 'Start Analysis' : 'ابدأ التحليل الآن'}</span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
