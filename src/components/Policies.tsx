import React from 'react';
import { motion } from 'motion/react';
import { useSite } from '../context/SiteContext';
import { ArrowRight } from 'lucide-react';

const PolicyContainer: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
  const { updateConfig } = useSite();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-black/40 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10"
    >
      <button 
        onClick={() => updateConfig({ currentRoute: 'home' })}
        className="flex items-center gap-2 text-brand-blue mb-8 hover:text-white transition-colors"
      >
        <ArrowRight size={20} />
        العودة للرئيسية
      </button>
      <h1 className="text-3xl md:text-5xl font-black mb-8 font-tajawal">{title}</h1>
      <div className="prose prose-invert max-w-none prose-headings:text-brand-purple prose-headings:font-bold prose-a:text-brand-blue prose-p:text-gray-300">
        {children}
      </div>
    </motion.div>
  );
};

export const PrivacyPolicy = () => (
  <PolicyContainer title="سياسة الخصوصية">
    <h2>1. جمع المعلومات</h2>
    <p>في نمو لابز الني نحترم خصوصيتك ونسعى لحماية بياناتك. نقوم بجمع المعلومات التي تقدمها عند تسجيل الحساب أو ملء النماذج.</p>
    <h2>2. استخدام المعلومات</h2>
    <p>تستخدم المعلومات لتقديم الخدمات، تحسين تجربة المستخدم، والتواصل معك بخصوص أي تحديثات تخص منصة نمو لابز.</p>
    <h2>3. حماية البيانات</h2>
    <p>نحرص على استخدام أفضل المعايير التقنية لحماية بياناتك من الوصول غير المصرح به.</p>
  </PolicyContainer>
);

export const TermsOfService = () => (
  <PolicyContainer title="شروط الاستخدام">
    <h2>1. قبول الشروط</h2>
    <p>باستخدام منصة نمو لابز أنت توافق على الالتزام بجميع شروط الاستخدام المذكورة هنا.</p>
    <h2>2. الخدمات المقدمة</h2>
    <p>تقدم المنصة خدمات إنشاء المتاجر الذكية باستخدام أحدث التقنيات. نحن نشرف على رفع جودة الأداء التسويقي لعملائنا.</p>
    <h2>3. إخلاء المسؤولية عن النتائج</h2>
    <p>على الرغم من التزامنا بتحقيق أفضل النتائج، فإن نجاح المتاجر يعتمد على عوامل خارجية ولذلك لا نضمن مبيعات محددة.</p>
  </PolicyContainer>
);

export const CookiePolicy = () => (
  <PolicyContainer title="سياسة ملفات الارتباط">
    <h2>1. ما هي ملفات الارتباط؟</h2>
    <p>ملفات الارتباط هي نصوص صغيرة يتم تخزينها في متصفحك لتحسين تجربتك في منصتنا.</p>
    <h2>2. كيفية استخدامنا لها</h2>
    <p>نستخدمها لتحليل التصفح، الأداء، ولفهم أفضل السبل لتحسين تجربة المستخدمين لدينا.</p>
    <h2>3. إدارة ملفات الارتباط</h2>
    <p>يمكنك في أي وقت مسح ملفات الارتباط عن طريق المتصفح الذي تستخدمه.</p>
  </PolicyContainer>
);

export const Disclaimer = () => (
  <PolicyContainer title="إخلاء المسؤولية">
    <h2>1. المحتوى المرئي والنصي</h2>
    <p>نقوم ببذل العناية الكاملة في التحقق من صحة المحتوى والمقترحات والحلول المقدمة، ونحرص على التحديث باستمرار.</p>
    <h2>2. المواقع الخارجية</h2>
    <p>قد تحتوي منصتنا على روابط لشركاء ومواقع ثالثة (مثل أنظمة الدفع). لا نتحمل المسؤولية عن الشروط والأحكام الخاصة بهم.</p>
    <h2>3. التعديلات</h2>
    <p>يحق لإدارة نمو لابز إجراء أي تعديلات دون سابق إشعار.</p>
  </PolicyContainer>
);
