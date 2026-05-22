import React from 'react';
import { create } from 'zustand';

// KEEP ALL TYPES THE SAME
export type SectionVisibility = {
  [key: string]: boolean;
};

export type ScanLead = {
  id: string;
  url: string;
  date: string;
};

export type Partner = {
  id: string;
  name: string;
  color?: string;
  imageUrl: string;
  linkUrl?: string;
};

export type SectionData = {
  id: string;
  type: string;
  title: string;
  content: string;
};

export type PartnerClick = {
  partnerId: string;
  timestamp: number;
};

export type Tool = {
  name: string;
  locked: boolean;
  iconName: string;
  iconColor: string;
};

export type ToolCategory = {
  id: string;
  title: string;
  tools: Tool[];
};

export type SocialLink = {
  name: string;
  url: string;
  icon: string;
};

export type SiteConfig = {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroVideoUrl: string;
  heroVideoPoster: string;
  heroThumbVideoUrl: string;
  heroVideoLoop: boolean;
  heroVideoPlaybackRate: number;
  contactNumber: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  backgroundImage?: string;
  theme: 'dark' | 'light';
  showThemeToggle: boolean;
  apiKeys: {
    pageSpeed: string;
    openai: string;
  };
  sections: SectionVisibility;
  sectionOrder: string[];
  apiLinks: ApiLinks;
  scanLeads: ScanLead[];
  customSections: SectionData[];
  partners: Partner[];
  partnerClicks: PartnerClick[];
  toolCategories: ToolCategory[];
  socialLinks: SocialLink[];
  footerDescription: string;
  currentRoute?: string;
  logoText?: string;
  language?: 'ar' | 'en';
};

export type ApiLinks = {
  semrush: string;
  hotjar: string;
  chatgpt: string;
  gemini: string;
  claude: string;
};

const defaultConfig: SiteConfig = {
  heroTitle: 'نمِّ متجرك بالذكاء.. لا بالتخمين',
  heroSubtitle: 'حلل متجرك، اكتشف نقاط الضعف، واحصل على خطة نمو وتسويق ذكية في مكان واحد.',
  heroButtonText: 'حلل الآن',
  heroVideoUrl: 'https://b.top4top.io/m_37896jjzf1.mp4', 
  heroVideoPoster: '',
  heroThumbVideoUrl: 'https://a.top4top.io/m_37750z9te1.mp4',
  heroVideoLoop: true,
  heroVideoPlaybackRate: 1,
  contactNumber: '+966545698905',
  primaryColor: '#4F8EF7',
  secondaryColor: '#7C3AED',
  accentColor: '#22D3A0',
  backgroundColor: '#07070F',
  theme: 'dark',
  showThemeToggle: true,
  apiKeys: {
    pageSpeed: '',
    openai: ''
  },
  sections: {
    hero: true,
    services: true,
    whyUs: true,
    solutions: true,
    ecommerce: true,
    tools: true,
    workflow: true,
    testimonials: true,
    faq: true,
    analyzer: true,
    blog: true
  },
  sectionOrder: ['hero', 'services', 'solutions', 'tools', 'workflow', 'testimonials', 'faq', 'blog'],
  apiLinks: {
    semrush: '',
    hotjar: '',
    chatgpt: '',
    gemini: '',
    claude: ''
  },
  scanLeads: [],
  customSections: [],
  partnerClicks: [],
  toolCategories: [
    {
      id: 'store-analysis',
      title: 'تحليل المتاجر',
      tools: [
        { name: 'محلل UX', locked: false, iconName: 'Activity', iconColor: 'text-blue-400' },
        { name: 'فاحص جودة المنتجات', locked: true, iconName: 'CheckSquare', iconColor: 'text-gray-400' },
        { name: 'محلل المنافسين', locked: true, iconName: 'LineChart', iconColor: 'text-gray-400' },
        { name: 'فاحص شامل', locked: true, iconName: 'Search', iconColor: 'text-gray-400' },
      ]
    },
    {
      id: 'seo-opt',
      title: 'تحسين SEO',
      tools: [
        { name: 'فاحص SEO', locked: false, iconName: 'Code', iconColor: 'text-brand-green' },
        { name: 'محلل الكلمات المفتاحية', locked: true, iconName: 'Hash', iconColor: 'text-gray-400' },
        { name: 'محسن Google Merchant', locked: true, iconName: 'Target', iconColor: 'text-gray-400' },
        { name: 'محلل الروابط الخلفية', locked: true, iconName: 'LinkIcon', iconColor: 'text-gray-400' },
      ]
    },
    {
      id: 'ads-camp',
      title: 'الحملات الإعلانية',
      tools: [
        { name: 'محسن Google Ads', locked: true, iconName: 'Target', iconColor: 'text-gray-400' },
        { name: 'منشئ إعلانات Meta', locked: true, iconName: 'Target', iconColor: 'text-gray-400' },
        { name: 'أفكار سناب وتيك توك', locked: false, iconName: 'Target', iconColor: 'text-purple-400' },
        { name: 'حاسبة الحملات', locked: false, iconName: 'LineChart', iconColor: 'text-purple-400' },
      ]
    },
    {
      id: 'free-tools',
      title: 'أدوات مجانية',
      tools: [
        { name: 'حاسبة أداء المتجر', locked: false, iconName: 'Activity', iconColor: 'text-brand-green' },
        { name: 'مولد العناوين', locked: false, iconName: 'Type', iconColor: 'text-brand-green' },
        { name: 'فاحص السرعة', locked: false, iconName: 'Zap', iconColor: 'text-brand-green' },
        { name: 'مولد ردود العملاء', locked: false, iconName: 'MessageCircle', iconColor: 'text-brand-green' },
      ]
    },
    {
      id: 'google-crisis',
      title: 'حلول مشاكل Google',
      tools: [
        { name: 'حل مشكلة الوصف المضلل في Google Merchant Center', locked: true, iconName: 'Layout', iconColor: 'text-gray-400' },
        { name: 'حل تعليق حسابات Google Ads', locked: true, iconName: 'AlertTriangle', iconColor: 'text-gray-400' },
        { name: 'إصلاح خرائط جوجل', locked: true, iconName: 'MapPin', iconColor: 'text-gray-400' },
        { name: 'إصلاح فهرسة Search Console', locked: true, iconName: 'Search', iconColor: 'text-gray-400' },
      ]
    }
  ],
  partners: [
    { id: '1', name: 'الفكرة النادرة - دعاية واعلان', color: '#e63450', imageUrl: 'https://cdn.salla.sa/cdn-cgi/image/fit=scale-down,width=400,height=400,onerror=redirect,format=auto/BrzyDD/5GmtTmSorZpwTyuxAPydLrhQ20Zl5HMfO5392Rek.png', linkUrl: 'https://ric.com.sa/' },
    { id: '2', name: 'بوابة الشبكات - انتينا ورواتر 5G', color: '#f29b6d', imageUrl: '', linkUrl: 'https://netgate-sa.com/' },
    { id: '3', name: 'نخلتين واي فاي - انتينا وراتر', color: '#0e2f67', imageUrl: 'https://cdn.salla.sa/cdn-cgi/image/fit=scale-down,width=400,height=400,onerror=redirect,format=auto/wBalV/H2Do5qXWaQdqr9xBlSCxSz4CTZvn14mVFKvIhQHD.png', linkUrl: 'https://nakhltain.com/' },
    { id: '4', name: 'ثلث اليوم للمفروشات', color: '#235418', imageUrl: 'https://cdn.salla.sa/cdn-cgi/image/fit=scale-down,width=400,height=400,onerror=redirect,format=auto/mQdDnZ/PyXrrxl7c8MJjl9A6wokcULOPOTmMNUqsaxfKR1v.png', linkUrl: 'https://thulth-sa.com/' },
    { id: 'partner_1778961537430', name: 'مناديل ريجين', color: '#22b6ed', imageUrl: 'https://media.zid.store/13b20f5f-3857-45e3-9134-458d965caf58/a8827d63-f750-41ea-b5b2-1be59091326a.png', linkUrl: 'https://regine-sa.com' },
    { id: 'partner_1779035910510', name: 'الأجهزة المبتكرة', color: '#de9336', imageUrl: '', linkUrl: '' },
    { id: 'partner_1779035948609', name: 'صفقات كوم - كوزماتيكس', color: '#f5abc5', imageUrl: '', linkUrl: 'https://safaqatcom.com/' },
    { id: 'partner_1779064216129', name: 'Rayflow Studio - ورشات عمل', color: '#414798', imageUrl: '', linkUrl: '' },
    { id: 'partner_1779064264993', name: 'مناديل حصة', color: '#fdb700', imageUrl: '', linkUrl: '' },
    { id: 'partner_1779064308309', name: 'بولي مارت - مصنع بلاستيك', color: '', imageUrl: '', linkUrl: '' },
    { id: 'partner_1779064336725', name: 'شركة مقاولات', color: '', imageUrl: '', linkUrl: '' }
  ],
  socialLinks: [
    { name: 'Instagram', url: 'https://www.instagram.com/nmolabs', icon: 'Instagram' },
    { name: 'Twitter', url: 'https://x.com/NmoLabs', icon: 'Twitter' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@nmolabs', icon: 'TikTok' },
    { name: 'Snapchat', url: 'https://www.snapchat.com/add/nmolabs', icon: 'Ghost' },
    { name: 'Facebook', url: '', icon: 'Facebook' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/nmolabs', icon: 'Linkedin' }
  ],
  footerDescription: 'منصة وشريك نمو تقني لرواد الأعمال والمتاجر الإلكترونية في السعودية.',
  currentRoute: 'home',
  logoText: 'NMOLABS',
  language: 'ar'
};

const getInitialConfig = () => {
  const saved = localStorage.getItem('nmo_site_config');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      let order = parsed.sectionOrder || defaultConfig.sectionOrder;
      order = order.filter((s: string) => s !== 'analyzer');
      if (!order.includes('blog')) {
        order.push('blog');
      }
      return {
        ...defaultConfig,
        ...parsed,
        sectionOrder: order,
        sections: { ...defaultConfig.sections, ...(parsed.sections || {}) },
        customSections: parsed.customSections || [],
        partners: parsed.partners || defaultConfig.partners,
        partnerClicks: parsed.partnerClicks || [],
        socialLinks: parsed.socialLinks || defaultConfig.socialLinks,
        footerDescription: parsed.footerDescription || defaultConfig.footerDescription,
        currentRoute: 'home',
        logoText: parsed.logoText || defaultConfig.logoText,
        language: parsed.language || 'ar'
      };
    } catch (e) {
      console.error("Failed to load config", e);
    }
  }
  return defaultConfig;
};

type SiteContextType = {
  config: SiteConfig;
  hasUnsavedChanges: boolean;
  isAdminMode: boolean;
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
  saveConfig: () => void;
  resetConfig: () => void;
  setIsAdminMode: (val: boolean) => void;
};

export const useSite = create<SiteContextType>((set, get) => ({
  config: getInitialConfig(),
  hasUnsavedChanges: false,
  isAdminMode: false,
  updateConfig: (newConfig) => {
    set((state) => ({ 
      config: { ...state.config, ...newConfig },
      hasUnsavedChanges: true
    }));
  },
  saveConfig: () => {
    localStorage.setItem('nmo_site_config', JSON.stringify(get().config));
    set({ hasUnsavedChanges: false });
  },
  resetConfig: () => {
    localStorage.removeItem('nmo_site_config');
    set({ config: defaultConfig, hasUnsavedChanges: false });
  },
  setIsAdminMode: (val) => set({ isAdminMode: val }),
}));

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
