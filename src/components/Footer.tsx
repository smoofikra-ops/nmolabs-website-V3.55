import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useSite, SocialLink } from '../context/SiteContext';
import siteLogo from '../assets/images/site-logo.png';

const getSocialSvg = (icon: string) => {
  switch (icon) {
    case 'Instagram': return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
    case 'Twitter': return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
    case 'TikTok': return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>;
    case 'Ghost': return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>;
    case 'Facebook': return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
    case 'Linkedin': return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
    default: return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/></svg>;
  }
};

export const Footer = () => {
  const { config, updateConfig } = useSite();
  const currentYear = new Date().getFullYear();

  const handleScroll = (id: string) => {
    if (config.currentRoute && config.currentRoute !== 'home') {
      updateConfig({ currentRoute: 'home' });
      setTimeout(() => {
        if(id === 'hero') window.scrollTo({top: 0, behavior: 'smooth'});
        else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    if(id === 'hero') window.scrollTo({top: 0, behavior: 'smooth'});
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 pt-20 pb-8 relative z-20 bg-[color:var(--color-bg-main)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Logo and About Us */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleScroll('hero')}>
              <img src={siteLogo} alt="NMOLABS Logo" className="h-12 object-contain drop-shadow-[0_0_15px_rgba(79,142,247,0.3)]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden text-2xl font-english font-black text-white tracking-wider">
                NMOLABS<span className="text-[color:var(--color-brand-blue-val)]">.</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {config.footerDescription}
            </p>
            <div className="flex gap-4 flex-wrap">
              {config.socialLinks?.map((link, idx) => (
                <a key={idx} href={link.url} target="_blank" rel="noreferrer" title={link.name} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[color:var(--color-brand-blue-val)] hover:text-white hover:border-transparent transition-all duration-300">
                  {getSocialSvg(link.icon)}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">روابط سريعة</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><button onClick={() => handleScroll('hero')} className="hover:text-[color:var(--color-brand-blue-val)] transition-colors">الرئيسية</button></li>
              <li><button onClick={() => handleScroll('services')} className="hover:text-[color:var(--color-brand-blue-val)] transition-colors">خدماتنا</button></li>
              <li><button onClick={() => handleScroll('ecommerce')} className="hover:text-[color:var(--color-brand-blue-val)] transition-colors">إنشاء المتاجر</button></li>
              <li><button onClick={() => handleScroll('solutions')} className="hover:text-[color:var(--color-brand-blue-val)] transition-colors">الحلول الذكية</button></li>
              <li><button onClick={() => handleScroll('blog')} className="hover:text-[color:var(--color-brand-blue-val)] transition-colors">المدونة</button></li>
              <li><button onClick={() => handleScroll('faq')} className="hover:text-[color:var(--color-brand-blue-val)] transition-colors">الأسئلة الشائعة</button></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">السياسات</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><button onClick={() => { updateConfig({ currentRoute: 'privacy' }); window.scrollTo(0, 0); }} className="hover:text-[color:var(--color-brand-blue-val)] transition-colors cursor-pointer">سياسة الخصوصية</button></li>
              <li><button onClick={() => { updateConfig({ currentRoute: 'terms' }); window.scrollTo(0, 0); }} className="hover:text-[color:var(--color-brand-blue-val)] transition-colors cursor-pointer">شروط الاستخدام</button></li>
              <li><button onClick={() => { updateConfig({ currentRoute: 'cookies' }); window.scrollTo(0, 0); }} className="hover:text-[color:var(--color-brand-blue-val)] transition-colors cursor-pointer">سياسة ملفات الارتباط</button></li>
              <li><button onClick={() => { updateConfig({ currentRoute: 'disclaimer' }); window.scrollTo(0, 0); }} className="hover:text-[color:var(--color-brand-blue-val)] transition-colors cursor-pointer">إخلاء المسؤولية</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">التواصل</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[color:var(--color-brand-blue-val)] shrink-0 mt-0.5" />
                <span dir="ltr" className="text-right w-full">المملكة العربية السعودية، الرياض</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[color:var(--color-brand-blue-val)] shrink-0" />
                <span dir="ltr" className="font-english">{config.contactNumber}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[color:var(--color-brand-blue-val)] shrink-0" />
                <span dir="ltr" className="font-english">hello@nmolabs.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {currentYear} نمو لابز. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-2">
            <span>صُنع بشغف في</span>
            <span className="text-white font-black text-xs font-english tracking-widest">NMOLABS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
