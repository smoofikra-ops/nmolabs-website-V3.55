import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize the Supabase client safely
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

// Boolean flag to check if Supabase is properly configured
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co'
);

// Type definitions for our dynamic content
export interface IdentitySettings {
  siteName: string;
  logoText: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  themeMode: 'dark' | 'light';
}

export interface HeroContent {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  videoUrl: string;
  fallbackImageUrl: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon identifier (e.g. Layout, Megaphone, Share2, Search, PenTool)
  category: string;
  ctaText: string;
  ctaLink: string;
}

export interface PackageItem {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  isFeatured: boolean;
  ctaText: string;
  ctaLink: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SuccessStoryItem {
  id: string;
  storeName: string;
  logoUrl: string;
  resultText: string;
  growthPercentage: string;
  brandColor: string;
}

export interface SiteContent {
  identity: IdentitySettings;
  hero: HeroContent;
  services: ServiceItem[];
  packages: PackageItem[];
  faq: FaqItem[];
  successStories: SuccessStoryItem[];
}

// Predefined dynamic website default content in Arabic
export const defaultContent: SiteContent = {
  identity: {
    siteName: "نمو لابز | NMOLABS",
    logoText: "NMOLABS",
    primaryColor: "#4F8EF7",
    secondaryColor: "#7C3AED",
    accentColor: "#22D3A0",
    themeMode: "dark"
  },
  hero: {
    title: "نمِّ متجرك بالذكاء.. لا بالتخمين",
    description: "حلل متجرك، اكتشف نقاط الضعف، واحصل على خطة نمو وتسويق ذكية في مكان واحد.",
    ctaText: "حلل الآن",
    ctaLink: "#analyzer",
    videoUrl: "https://b.top4top.io/m_37896jjzf1.mp4",
    fallbackImageUrl: ""
  },
  services: [
    {
      id: "srv_1",
      title: "إنشاء المتاجر الإلكترونية",
      description: "من اختيار الاسم والهوية وحتى التشغيل والتسويق الكامل — نبني لك متجرًا احترافيًا جاهزًا للنمو والمبيعات.",
      icon: "Layout",
      category: "متاجر",
      ctaText: "تفاصيل أكثر",
      ctaLink: ""
    },
    {
      id: "srv_2",
      title: "إدارة الحملات الإعلانية",
      description: "نوجه ميزانيتك نحو الجمهور الصح. استهداف دقيق يعتمد على البيانات لرفع العائد الإعلاني ROAS.",
      icon: "Megaphone",
      category: "إعلانات",
      ctaText: "تفاصيل أكثر",
      ctaLink: ""
    },
    {
      id: "srv_3",
      title: "إدارة السوشيال ميديا",
      description: "لا ننشر محتوى فقط، بل نبني مجتمعاً يتفاعل ويشتري. إدارة كاملة للحسابات.",
      icon: "Share2",
      category: "سوشيال",
      ctaText: "تفاصيل أكثر",
      ctaLink: ""
    },
    {
      id: "srv_4",
      title: "تحسين محركات البحث SEO",
      description: "نتصدر نتائج بحث جوجل لنضمن لك زوار حقيقيين ومجانيين يبحثون عن منتجك فعلياً.",
      icon: "Search",
      category: "سيو",
      ctaText: "تفاصيل أكثر",
      ctaLink: ""
    },
    {
      id: "srv_5",
      title: "كتابة المحتوى البيعي",
      description: "نكتب الكلمات التي تقنع القارئ بفتح محفظته والدفع مباشرة والتخلي عن التردد.",
      icon: "PenTool",
      category: "محتوى",
      ctaText: "تفاصيل أكثر",
      ctaLink: ""
    },
    {
      id: "srv_6",
      title: "تصميم واجهات المتاجر وتحسين UX",
      description: "نصمم واجهات لا تبدو جميلة فقط، بل تسهل عملية الشراء وتزيد نسبة التحويل.",
      icon: "Layout",
      category: "تصميم",
      ctaText: "تفاصيل أكثر",
      ctaLink: ""
    }
  ],
  packages: [
    {
      id: "pkg_1",
      name: "الباقة المجانية",
      description: "مجموعة مختارة من الأدوات الأساسية لمساعدتك في البدء.",
      price: "0",
      features: ["حاسبة أداء المتجر", "فاحص السرعة", "مولد العناوين", "دعم مجتمعي"],
      isFeatured: false,
      ctaText: "ابدأ مجاناً",
      ctaLink: ""
    },
    {
      id: "pkg_2",
      name: "باقة الأعمال",
      description: "احصل على وصول شامل إلى أدوات التحليل الأساسية.",
      price: "149",
      features: ["جميع الأدوات المجانية", "محلل UX وفاحص SEO", "تحليل المنافسين", "أفكار الحملات الإعلانية", "حلول أزمات Google الأساسية", "دعم فني عبر البريد"],
      isFeatured: true,
      ctaText: "اختر الباقة",
      ctaLink: ""
    },
    {
      id: "pkg_3",
      name: "الباقة الاحترافية",
      description: "افتح جميع الإمكانيات والأدوات المتقدمة في المنصة.",
      price: "299",
      features: ["وصول كامل لجميع الأدوات", "أدوات مدعومة بالذكاء الاصطناعي", "تغطية شاملة لحلول Google", "تقارير مخصصة ومفصلة", "مدير حساب مخصص", "أولوية في الدعم الفني"],
      isFeatured: false,
      ctaText: "اختر الباقة",
      ctaLink: ""
    },
    {
      id: "pkg_4",
      name: "باقة مخصصة",
      description: "هل تبحث عن حلول خاصة وحجم عمل أكبر؟",
      price: "أسعار مخصصة",
      features: ["كل ميزات الاحترافية", "أدوات مخصصة لتجارتك", "استشارات تسويقية", "ربط API خاص"],
      isFeatured: false,
      ctaText: "تواصل معنا",
      ctaLink: "https://wa.me/966545698905"
    }
  ],
  faq: [
    {
      id: "faq_1",
      question: "هل أنتم مجرد وكالة تسويق (Agency) تقليدية؟",
      answer: "لا، نحن منصة (SaaS) وشريك نمو تقني. ندمج بين أدوات الذكاء الاصطناعي لتحليل المتجر، وبين خبرات التسويق لإدارة الحملات وصناعة المحتوى، لنوفر لك بيئة نمو متكاملة مبنية على الأرقام الحقيقية وليس التخمين.",
      category: "حول المنصة والحلول الذكية"
    },
    {
      id: "faq_2",
      question: "ما هي الحلول الذكية التي تغير طريقة البيع؟",
      answer: "نقدم مجموعة متكاملة من أدوات التحليلات، تحسين محركات البحث، إدارة الحملات الإعلانية المدعومة، وفحص جودة المتاجر لاكتشاف أسباب تسرب العملاء ومعالجتها فوراً.",
      category: "حول المنصة والحلول الذكية"
    },
    {
      id: "faq_3",
      question: "ما هي مميزات هذه الحلول الذكية وكيف تفيد متجري؟",
      answer: "تتميز حلولنا بالدقة وسرعة التنفيذ والاعتماد التام على الأرقام والذكاء الاصطناعي بدلاً من التخمين. ستتمكن من تحسين واجهة المستخدم، تقليل التكاليف الإعلانية، ورفع معدل التحويل بشكل حقيقي ومستدام.",
      category: "حول المنصة والحلول الذكية"
    },
    {
      id: "faq_4",
      question: "هل توجد باقات مخصصة تناسب حجم متجري؟",
      answer: "نعم، نوفر باقات مرنة ومتدرجة (الأعمال والاحترافية) بالإضافة إلى الباقات المخصصة بالكامل التي تلبي احتياجات المتاجر ذات الحجم الأكبر وتتضمن ربط API متقدم.",
      category: "الأسعار والتواصل"
    },
    {
      id: "faq_5",
      question: "هل تدعمون المتاجر المبنية على منصة زد وسلة؟",
      answer: "بالتأكيد! المنصة مصممة بأعلى توافق لدعم متاجر سلاسل زد وسلة بالكامل لاستخراج البيانات وتنفيذ خطط التحسين التسويقي بسهولة فائقة.",
      category: "الأسعار والتواصل"
    },
    {
      id: "faq_6",
      question: "حساب Google Merchant Center الخاص بي معلق، هل يمكنكم حله؟",
      answer: "نعم، نمتلك خبرة واسعة في حل تعليق Merchant Center، نعالج مشاكل الوصف المضلل والبيانات المفقودة لضمان إطلاق منتجاتك بسلام.",
      category: "متاعب Google وحلولها"
    },
    {
      id: "faq_7",
      question: "ما هو الضمان الأكيد لنجاح الحملات؟",
      answer: "نحن لا نطلق أي حملة قبل سد جميع \"ثغرات التسرب\" في متجرك (مشاكل تقنية، صور ضعيفة، رحلة شراء معقدة). هذا التحليل المسبق يرفع دقة نجاح الحملة بأكثر من 80% مقارنة بالانطلاق الأعمى دون بيانات.",
      category: "الحملات وضمان الجودة"
    }
  ],
  successStories: [
    {
      id: "story_1",
      storeName: "الفكرة النادرة",
      logoUrl: "https://cdn.salla.sa/cdn-cgi/image/fit=scale-down,width=400,height=400,onerror=redirect,format=auto/BrzyDD/5GmtTmSorZpwTyuxAPydLrhQ20Zl5HMfO5392Rek.png",
      resultText: "زيادة في المبيعات بفضل إعادة بناء رحلة العميل بالكامل خلال 3 أشهر فقط.",
      growthPercentage: "+300%",
      brandColor: "#e63450"
    },
    {
      id: "story_2",
      storeName: "نخلتين واي فاي",
      logoUrl: "https://cdn.salla.sa/cdn-cgi/image/fit=scale-down,width=400,height=400,onerror=redirect,format=auto/wBalV/H2Do5qXWaQdqr9xBlSCxSz4CTZvn14mVFKvIhQHD.png",
      resultText: "تقليل تكلفة الاستحواذ على العميل CAC مع مضاعفة العائد الإعلاني.",
      growthPercentage: "+8x ROAS",
      brandColor: "#0e2f67"
    },
    {
      id: "story_3",
      storeName: "ثلث اليوم للمفروشات",
      logoUrl: "https://cdn.salla.sa/cdn-cgi/image/fit=scale-down,width=400,height=400,onerror=redirect,format=auto/mQdDnZ/PyXrrxl7c8MJjl9A6wokcULOPOTmMNUqsaxfKR1v.png",
      resultText: "تقليل المرتجعات بفضل التحليل الدقيق للسلوك وتوضيح وصف المنتجات بدقة وتقنية النماذج الذكية.",
      growthPercentage: "-40%",
      brandColor: "#235418"
    },
    {
      id: "story_4",
      storeName: "مناديل ريجين",
      logoUrl: "https://media.zid.store/13b20f5f-3857-45e3-9134-458d965caf58/a8827d63-f750-41ea-b5b2-1be59091326a.png",
      resultText: "زيادة ملحوظة في المبيعات وتفاعل فائق مع العملاء عبر السوشيال ميديا وقنوات الإعلان.",
      growthPercentage: "+120%",
      brandColor: "#22b6ed"
    }
  ]
};

interface ContentContextProps {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => Promise<void>;
  resetContent: () => Promise<void>;
  isSupabaseConfigured: boolean;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextProps | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('nmolabsSiteContent');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultContent,
          ...parsed,
          identity: { ...defaultContent.identity, ...(parsed.identity || {}) },
          hero: { ...defaultContent.hero, ...(parsed.hero || {}) }
        };
      } catch (e) {
        console.error("Failed to parse nmolabsSiteContent from localStorage", e);
        return defaultContent;
      }
    }
    return defaultContent;
  });

  const [isLoading, setIsLoading] = useState<boolean>(isSupabaseConfigured);

  // Fetch settings from Supabase on mount if configured
  useEffect(() => {
    const fetchSettings = async () => {
      if (!isSupabaseConfigured) {
        setIsLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('content')
          .eq('id', 1)
          .single();
        
        if (data && data.content && Object.keys(data.content).length > 0) {
          const parsed = data.content as any;
          const merged: SiteContent = {
            ...defaultContent,
            ...parsed,
            identity: { ...defaultContent.identity, ...(parsed.identity || {}) },
            hero: { ...defaultContent.hero, ...(parsed.hero || {}) },
            services: parsed.services || defaultContent.services,
            packages: parsed.packages || defaultContent.packages,
            faq: parsed.faq || defaultContent.faq,
            successStories: parsed.successStories || defaultContent.successStories,
          };
          setContent(merged);
          localStorage.setItem('nmolabsSiteContent', JSON.stringify(merged));
        } else if (error) {
          console.warn("Supabase site_settings empty or inaccessible. Using local state.", error.message);
        }
      } catch (e) {
        console.error("Failed to fetch settings from Supabase database:", e);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const updateContent = async (newContent: SiteContent) => {
    setContent(newContent);
    localStorage.setItem('nmolabsSiteContent', JSON.stringify(newContent));
    
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ id: 1, content: newContent, updated_at: new Date().toISOString() });
        
        if (error) {
          console.error("Failed to sync settings with Supabase Database:", error.message);
          throw error;
        }
      } catch (e) {
        console.error("Failed to sync settings with Supabase:", e);
        throw e;
      }
    }
  };

  const resetContent = async () => {
    setContent(defaultContent);
    localStorage.removeItem('nmolabsSiteContent');
    
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ id: 1, content: defaultContent, updated_at: new Date().toISOString() });
        
        if (error) {
          console.error("Failed to reset settings in Supabase Database:", error.message);
          throw error;
        }
      } catch (e) {
        console.error("Failed to reset settings in Supabase:", e);
        throw e;
      }
    }
  };

  // Sync visual colors to documentElement classes/variables if needed
  useEffect(() => {
    if (content.identity.primaryColor) {
      document.documentElement.style.setProperty('--color-brand-blue-val', content.identity.primaryColor);
    }
    if (content.identity.secondaryColor) {
      document.documentElement.style.setProperty('--color-brand-purple-val', content.identity.secondaryColor);
    }
    if (content.identity.accentColor) {
      document.documentElement.style.setProperty('--color-brand-green-val', content.identity.accentColor);
    }
    
    // Manage dark/light theme classes on html
    if (content.identity.themeMode === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  }, [content.identity]);

  return (
    <ContentContext.Provider value={{ content, updateContent, resetContent, isSupabaseConfigured, isLoading }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
