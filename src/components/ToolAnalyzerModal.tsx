import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Activity, Zap, CheckCircle2, Bot, Lock } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export const ToolAnalyzerModal = ({ isOpen, onClose, tool }) => {
  const { config } = useSite();
  const [formData, setFormData] = useState<any>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  if (!isOpen || !tool) return null;

  const renderInputs = () => {
    switch (tool.name) {
      case 'محلل UX':
      case 'فاحص SEO':
      case 'فاحص جودة المنتجات':
      case 'محلل المنافسين':
      case 'فاحص شامل':
      case 'محلل الروابط الخلفية':
      case 'إصلاح فهرسة Search Console':
      case 'فاحص السرعة':
        return (
          <input
            type="url"
            value={formData.url || ''}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="أدخل رابط المتجر (مثال: https://yourstore.com)"
            className="w-full bg-[#151f2e] border border-white/10 rounded-xl px-5 py-4 text-white text-right placeholder-gray-500 focus:outline-none focus:border-[color:var(--color-brand-blue-val)] transition-colors focus:ring-1 focus:ring-[color:var(--color-brand-blue-val)]"
            dir="ltr"
          />
        );
      case 'محلل الكلمات المفتاحية':
        return (
          <input
            type="text"
            value={formData.keyword || ''}
            onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
            placeholder="أدخل الكلمة المفتاحية المراد تحليلها"
            className="w-full bg-[#151f2e] border border-white/10 rounded-xl px-5 py-4 text-white text-right placeholder-gray-500 focus:outline-none focus:border-[color:var(--color-brand-blue-val)] transition-colors focus:ring-1 focus:ring-[color:var(--color-brand-blue-val)]"
          />
        );
      case 'حل مشكلة الوصف المضلل في Google Merchant Center':
      case 'محسن Google Merchant':
        return (
          <div className="space-y-4">
            <input
              type="url"
              value={formData.url || ''}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="رابط المتجر"
              className="w-full bg-[#151f2e] border border-white/10 rounded-xl px-5 py-4 text-white text-right placeholder-gray-500 focus:outline-none focus:border-[color:var(--color-brand-blue-val)] transition-colors"
              dir="ltr"
            />
            <input
              type="url"
              value={formData.xml || ''}
              onChange={(e) => setFormData({ ...formData, xml: e.target.value })}
              placeholder="رابط خريطة الموقع (XML Sitemap)"
              className="w-full bg-[#151f2e] border border-white/10 rounded-xl px-5 py-4 text-white text-right placeholder-gray-500 focus:outline-none focus:border-[color:var(--color-brand-blue-val)] transition-colors"
              dir="ltr"
            />
          </div>
        );
      case 'محسن Google Ads':
      case 'حل تعليق حسابات Google Ads':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={formData.accountLink || ''}
              onChange={(e) => setFormData({ ...formData, accountLink: e.target.value })}
              placeholder="رابط الحساب الإعلاني أو الإعلان المشكلة"
              className="w-full bg-[#151f2e] border border-white/10 rounded-xl px-5 py-4 text-white text-right placeholder-gray-500 focus:outline-none focus:border-[color:var(--color-brand-blue-val)] transition-colors"
              dir="ltr"
            />
            {tool.name.includes('تعليق') && (
               <textarea
                 value={formData.details || ''}
                 onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                 placeholder="اشرح المشكلة باختصار..."
                 className="w-full bg-[#151f2e] border border-white/10 rounded-xl px-5 py-4 text-white text-right placeholder-gray-500 focus:outline-none focus:border-[color:var(--color-brand-blue-val)] transition-colors h-24"
               />
            )}
          </div>
        );
      case 'حاسبة الحملات':
        return (
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={formData.budget || ''}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="الميزانية الإعلانية"
              className="bg-[#151f2e] border border-white/10 rounded-xl px-5 py-3 text-white focus:border-[color:var(--color-brand-blue-val)] transition-colors"
            />
            <input
              type="number"
              value={formData.cpc || ''}
              onChange={(e) => setFormData({ ...formData, cpc: e.target.value })}
              placeholder="تكلفة النقرة المتوقعة (CPC)"
              className="bg-[#151f2e] border border-white/10 rounded-xl px-5 py-3 text-white focus:border-[color:var(--color-brand-blue-val)] transition-colors"
            />
          </div>
        );
      case 'حاسبة أداء المتجر':
        return (
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={formData.visits || ''}
              onChange={(e) => setFormData({ ...formData, visits: e.target.value })}
              placeholder="عدد الزيارات الشهري"
              className="bg-[#151f2e] border border-white/10 rounded-xl px-5 py-3 text-white focus:border-[color:var(--color-brand-blue-val)] transition-colors"
            />
            <input
              type="number"
              value={formData.sales || ''}
              onChange={(e) => setFormData({ ...formData, sales: e.target.value })}
              placeholder="عدد الطلبات"
              className="bg-[#151f2e] border border-white/10 rounded-xl px-5 py-3 text-white focus:border-[color:var(--color-brand-blue-val)] transition-colors"
            />
            <input
              type="number"
              value={formData.conversion || ''}
              onChange={(e) => setFormData({ ...formData, conversion: e.target.value })}
              placeholder="معدل التحويل (%)"
              className="bg-[#151f2e] border border-white/10 rounded-xl px-5 py-3 text-white focus:border-[color:var(--color-brand-blue-val)] transition-colors col-span-2"
            />
          </div>
        );
      case 'مولد العناوين':
      case 'منشئ إعلانات Meta':
      case 'أفكار سناب وتيك توك':
      case 'مولد ردود العملاء':
        return (
          <textarea
            value={formData.prompt || ''}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            placeholder="صف بدقة ما تريد العمل عليه (منتجاتك، شريحتك التي تستهدفها، نوع الإعلان)..."
            className="w-full bg-[#151f2e] border border-white/10 rounded-xl px-5 py-4 text-white text-right placeholder-gray-500 focus:outline-none focus:border-[color:var(--color-brand-blue-val)] transition-colors h-32"
          />
        );
      case 'إصلاح خرائط جوجل':
        return (
          <input
            type="url"
            value={formData.mapLink || ''}
            onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
            placeholder="أدخل رابط خرائط جوجل لنشاطك التجاري"
            className="w-full bg-[#151f2e] border border-white/10 rounded-xl px-5 py-4 text-white text-right placeholder-gray-500 focus:outline-none focus:border-[color:var(--color-brand-blue-val)] transition-colors"
            dir="ltr"
          />
        );
      default:
        return (
          <input
            type="text"
            value={formData.general || ''}
            onChange={(e) => setFormData({ ...formData, general: e.target.value })}
            placeholder="أدخل البيانات المطلوبة..."
            className="w-full bg-[#151f2e] border border-white/10 rounded-xl px-5 py-4 text-white text-right placeholder-gray-500 focus:outline-none focus:border-[color:var(--color-brand-blue-val)] transition-colors"
          />
        );
    }
  };

  const isFormValid = () => Object.values(formData).some((v) => !!v);

  const generateReportForTool = (toolName: string) => {
    let dummyReport = {
      overallScore: Math.floor(Math.random() * 30) + 65,
      summary: `تم الانتهاء من فحص وتحليل البيانات بنجاح باستخدام نموذج "${toolName}" المخصص.`,
      insights: [
        'أداء مستقر في بعض المناطق مع وجود تحديات واضحة تجب معالجتها.',
        'سرعة استجابة الخادم تعتبر جيدة لكن حجم الصور يؤثر سلباً.',
        'بعض الروابط الداخلية تحتاج لتفعيل لتحسين زحف محركات البحث.'
      ],
      recommendations: [
        'تحسين تجربة المستخدم على الهواتف المحمولة.',
        'كتابة وصف دقيق وواضح لصفحات المنتجات الرئيسية.',
        'زيادة أمان الموقع عبر إضافة شارات التوثيق المعترف بها.'
      ]
    };

    if (toolName === 'حاسبة أداء المتجر' && formData.visits) {
       const v = parseInt(formData.visits) || 1000;
       const s = parseInt(formData.sales) || 10;
       const cr = ((s / v) * 100).toFixed(2);
       dummyReport.insights = [
         `عدد الزيارات: ${v} زيارة`,
         `إجمالي الطلبات المُدخلة: ${s} طلب`,
         `معدل التحويل الحالي: ${cr}% بناءً على المعطيات.`
       ];
       dummyReport.recommendations = [
         'العمل على زيادة معدل التحويل (CR) عبر تعديل واجهة الدفع.',
         'إضافة عناصر تبني الثقة مثل تقييمات العملاء في الواجهة.',
         'إعادة استهداف زوار السلة المتروكة بعروض خاصة.'
       ];
       dummyReport.overallScore = parseFloat(cr) > 2 ? 85 : 55;
    } else if (toolName.includes('Merchant')) {
       dummyReport.insights = [
           'تحليل الوصف المضاف أظهر وجود كلمات تعتبر مضللة حسب سياسات Google (مثل: الأفضل، الأرخص إطلاقاً).',
           'عناوين المنتجات لا تتوافق مع التنسيق القياسي (العلامة التجارية + المنتج + الميزة).',
           'بعض روابط الصور في XML لا تعمل وتسبب رفض المنتجات.'
       ];
       dummyReport.recommendations = [
           'إزالة الكلمات الدعائية المبالغ فيها من وصف المنتجات.',
           'تعديل ملف الـ XML ليتوافق مع معايير Google Merchant.',
           'إضافة معلومات الشحن والضرائب بشكل واضح وصريح في إعدادات الحساب.'
       ];
    } else if (toolName.includes('خرائط جوجل')) {
       dummyReport.insights = [
           'تحليل نشاط الخريطة يظهر نقصاً في معدل التفاعل مقارنة بالمنافسين في نفس المنطقة.',
           'لم يتم استغلال ميزة "الإعلانات المحلية" (Local Engine Ads) للظهور أعلى نتائج البحث المجانية.',
           'المحتوى والعروض على الخريطة غير محدثة، ولم يتم الاستفادة من روابط المشاركة المباشرة (Direct Share Links) لزيادة المراجعات.'
       ];
       dummyReport.recommendations = [
           'الرد بشكل مستمر واحترافي على جميع مراجعات العملاء، السلبية والإيجابية، مع استخدام كلمات مفتاحية في الرد.',
           'إضافة صور جديدة باستمرار (واجهة المحل، المنتجات، العروض، وفريق العمل) لزيادة ثقة جوجل.',
           'كتابة محتوى تفصيلي للخدمات وإضافة العروض (Offers) بشكل دوري وتنشيط الإعلانات.',
           'مشاركة رابط الخريطة القصير عبر الواتساب ووسائل التواصل الاجتماعي لحث العملاء الراضين على التقييم.'
       ];
    } else if (toolName === 'فاحص السرعة') {
        dummyReport.insights = [
          'السرعة على الجوال بطيئة نسبياً بسبب كثرة ملفات الجافا سكربت.',
          'الصور مساحتها كبيرة وغير محولة بصيغة WebP.',
          'تأخر في استجابة الخادم الرئيسي.'
        ];
        dummyReport.recommendations = [
          'تأجيل تحميل ملفات JS غير الضرورية.',
          'ضغط جميع الصور وتقليل جودتها بنسبة لا تؤثر على الرؤية.',
          'الاعتماد على شبكة توزيع محتوى (CDN) لتسريع الاستجابة.'
        ];
    } else if (toolName === 'مولد العناوين') {
        dummyReport.summary = `تم توليد أفكار عناوين إبداعية بناءً على الوصف المقدم عبر نموذجنا المخصص للنسخ الإعلاني الذكي.`;
        dummyReport.overallScore = 95;
        dummyReport.insights = [
          'العناوين تم تحسينها لتناسب محركات البحث ولتجذب انتباه العميل بأول 3 ثوانٍ.',
          'استخدام الكلمات القوية (Power Words) لزيادة نسبة النقر (CTR).',
        ];
        dummyReport.recommendations = [
          'العرض الذي لا يُقاوم: ' + (formData.prompt ? formData.prompt + ' بأفضل سعر وتوصيل مجاني!' : 'اكتشف الجودة بأفضل سعر ممكن.'),
          'عنوان فضولي: السر وراء نجاح أقوى المتاجر... هل جربت ' + (formData.prompt || 'هذا المنتج') + '؟',
          'عنوان مباشر للمشكلة: وفر وقتك ومالك واحصل على ' + (formData.prompt || 'الحل الأمثل لمتطلباتك') + ' اليوم بديل المنتجات العادية.',
          'عنوان بنظام القوائم: 3 أسباب تجعل ' + (formData.prompt || 'هذا المنتج') + ' الخيار الأول للعملاء في المملكة.'
        ];
    } else if (toolName === 'مولد ردود العملاء') {
        dummyReport.summary = `تم صياغة الردود الاحترافية المطلوبة للتعامل مع العملاء بذكاء.`;
        dummyReport.overallScore = 98;
        dummyReport.insights = [
          'استخدام نبرة صوت احترافية وهادئة لامتصاص غضب العميل أو شكره.',
          'توفير حلول مباشرة ضمن سياق الرد.'
        ];
        dummyReport.recommendations = [
          'رد الشكر والتقدير: "أهلاً بك عميلنا العزيز، شكراً لثقتك بنا ونسعد دائماً بخدمتك! شاركنا تجربتك لكي نرتقي معاً."',
          'رد الاعتذار والتأخير: "نعتذر منك على التأخير غير المقصود في وصول طلبك. نعمل بكامل طاقتنا لمعالجة الأمر، وسنتواصل معك خلال 24 ساعة."',
          'رد الاستفسار عن تفاصيل: "أهلاً بك، يمكنك الإطلاع على كافة المواصفات والأسعار عبر الرابط التالي. لا تتردد إن احتجت لمساعدة إضافية!"'
        ];
    } else if (toolName === 'أفكار سناب وتيك توك') {
        dummyReport.summary = `تمت هندسة أفكار تسويقية مبتكرة للفيديو القصير تلائم خوارزميات سناب شات وتيك توك.`;
        dummyReport.overallScore = 90;
        dummyReport.insights = [
          'خوارزميات تيك توك وسناب شات تفضل الفيديوهات العفوية التي تبدأ بسؤال أو خطاف (Hook) قوي.',
          'متوسط مدة الفيديو يجب أن تتراوح بين 15 إلى 30 ثانية لضمان الإكتمال (Watch rate).'
        ];
        dummyReport.recommendations = [
          'فكرة 1: "فيديو قبل وبعد" - عرض المشكلة التي يحلها المنتج ثم النتيجة المذهلة مع موسيقى ترند.',
          'فكرة 2: "تجهيز الطلب" (Pack an order with me) - هذا النوع يحقق تفاعل عالي جداً ويعزز الشفافية والثقة.',
          'فكرة 3: "سؤال وجواب" - الرد على أكثر تعليق متكرر في حسابك بفيديو مباشر.',
          'فكرة 4: "تحدي الـ 5 ثواني" - إظهار أفضل ميزة في منتجك بأسرع وقت لشد الانتباه الفوري.'
        ];
    } else if (toolName === 'منشئ إعلانات Meta') {
        dummyReport.summary = `تم تصميم محتوى إعلاني لفيسبوك وانستقرام جاهز للإطلاق.`;
        dummyReport.overallScore = 92;
        dummyReport.insights = [
          'تم الاعتماد على نموذج A/B لاختبار عدة نصوص.',
          'التركيز على الاستهداف النفسي واستخدام (النداء الدائم) للعمل المباشر.'
        ];
        dummyReport.recommendations = [
          'إعلان (عاطفي): "هل تعبت من البحث طويلاً؟ الحل أصبح بين يديك الآن. اطلب [اسم المنتج] واستعد لتجربة مختلفة كلياً."',
          'إعلان (منطقي): "وفر 30% من ميزانيتك واحصل على الجودة التي تستحقها، مع ضمان الاسترجاع. الكمية محدودة جداً!"',
          'إعلان (اجتماعي): "انضم لأكثر من 5000 عميل سعيد بتجربته معنا. تصفح آراء عملائنا واطلب الآن."',
        ];
    }

    return dummyReport;
  };

  const handleAnalyze = async () => {
    if (!isFormValid()) return;
    setIsAnalyzing(true);
    setResults(null);

    // Simulate real delay (at least 30 seconds)
    const delayTime = 30000 + Math.floor(Math.random() * 10000);
    await new Promise(resolve => setTimeout(resolve, delayTime));

    setIsAnalyzing(false);
    
    setResults(generateReportForTool(tool.name));
  };

  const handleClose = () => {
    setFormData({});
    setIsAnalyzing(false);
    setResults(null);
    onClose();
  };

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
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="bg-[#0b121c] border border-[color:var(--color-brand-blue-val)] border-opacity-20 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_40px_rgba(43,194,194,0.1)] relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#0b121c]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[color:var(--color-brand-blue-val)]/10 flex items-center justify-center text-[color:var(--color-brand-blue-val)]">
                {tool.locked ? <Bot size={20} className="text-[color:var(--color-brand-purple-val)]" /> : <Bot size={20} />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#e2e8f0] mb-0.5">{tool.name}</h2>
                <p className="text-xs text-[#94a3b8]">{tool.locked ? 'أداة مدفوعة (تتطلب اشتراك للحصول على التقرير الكامل)' : 'أداة مجانية (تقرير كامل)'}</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            {!isAnalyzing && !results ? (
              <div className="max-w-xl mx-auto py-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">النموذج جاهز للتحليل</h3>
                  <p className="text-[#94a3b8] text-sm">أدخل البيانات المطلوبة بدقة للحصول على أفضل تقرير وتوصيات من الذكاء الاصطناعي الخاص بنا.</p>
                </div>
                
                <div className="mb-8">
                  {renderInputs()}
                </div>
                
                <button
                  onClick={handleAnalyze}
                  disabled={!isFormValid()}
                  className="w-full py-4 bg-[color:var(--color-brand-blue-val)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-[#0b121c] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Search size={18} />
                  <span>بدء الفحص والتحليل</span>
                </button>
              </div>
            ) : isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
                <div className="w-20 h-20 mb-8 relative">
                  <div className="absolute inset-0 border-4 border-[#1e293b] rounded-full"></div>
                  <div className={`absolute inset-0 border-4 ${tool.locked ? 'border-[color:var(--color-brand-purple-val)]' : 'border-[color:var(--color-brand-blue-val)]'} rounded-full border-t-transparent animate-spin`}></div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white tracking-wide">جاري فحص البيانات...</h3>
                <p className="text-[#94a3b8] text-center text-sm max-w-sm leading-relaxed">
                  الرجاء الانتظار قليلاً (قد يستغرق الأمر حتى 30 ثانية)، يتم التواصل مع نموذج الذكاء الاصطناعي واستخراج أدق النتائج وأفضل الحلول.
                </p>
                <div className="mt-8 font-english text-xs text-[color:var(--color-brand-blue-val)] opacity-70 animate-pulse">Running Deep Analysis Models...</div>
              </div>
            ) : results ? (
              <div className="space-y-6 animate-fade-in text-gray-200">
                {/* Score */}
                <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-[#111827] border border-white/5 shadow-inner">
                   <div className="w-24 h-24 shrink-0 rounded-full bg-[#0b121c] flex items-center justify-center border-4 border-[color:var(--color-brand-blue-val)] shadow-[0_0_20px_rgba(43,194,194,0.15)]">
                     <span className="text-3xl font-bold font-english text-white">{results.overallScore}</span><span className="text-sm text-gray-400 mt-2">%</span>
                   </div>
                   <div className="text-center md:text-right">
                     <h3 className="text-xl font-bold text-white mb-2">النتيجة العامة للتقييم</h3>
                     <p className="text-sm text-[#94a3b8] leading-relaxed">{results.summary}</p>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 relative">
                  {/* Insights Section */}
                  <div className="p-6 rounded-2xl bg-[#111827] border border-white/5 relative overflow-hidden group">
                    <h4 className="flex items-center gap-2 font-bold mb-5 text-[#38bdf8] text-lg">
                      <Activity size={20} />
                      التشخيص والتحليل
                    </h4>
                    <ul className="space-y-4 relative z-10">
                      {results.insights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-[15px] text-[#cbd5e1] leading-relaxed">
                          <span className="w-2 h-2 rounded-full bg-[#38bdf8] shrink-0 mt-2 shadow-[0_0_8px_#38bdf8]"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations Section */}
                  <div className="p-6 rounded-2xl bg-[#111827] border border-white/5 relative overflow-hidden group">
                    <h4 className="flex items-center gap-2 font-bold mb-5 text-[#34d399] text-lg">
                      <CheckCircle2 size={20} />
                      التوصيات والحلول
                    </h4>
                    
                    {/* Partial Blur if Locked */}
                    <div className={`relative z-10 ${tool.locked ? 'h-[140px] overflow-hidden' : ''}`}>
                      <ul className="space-y-4">
                        {results.recommendations.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-[15px] text-[#cbd5e1] leading-relaxed">
                            <span className="w-2 h-2 rounded-full bg-[#34d399] shrink-0 mt-2 shadow-[0_0_8px_#34d399]"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                        {tool.locked && (
                          <>
                           <li className="flex items-start gap-3 text-[15px] text-[#cbd5e1] leading-relaxed blur-[3px] opacity-60">
                             <span className="w-2 h-2 rounded-full bg-[#34d399] shrink-0 mt-2 shadow-[0_0_8px_#34d399]"></span>
                             <span>هذه توصية مخفية تتطلب ترقية باقتك للوصول إلى التحليل الاحترافي.</span>
                           </li>
                           <li className="flex items-start gap-3 text-[15px] text-[#cbd5e1] leading-relaxed blur-[4px] opacity-40">
                             <span className="w-2 h-2 rounded-full bg-[#34d399] shrink-0 mt-2 shadow-[0_0_8px_#34d399]"></span>
                             <span>الخطوة التالية المتقدمة لتحقيق نمو أفضل في المبيعات وتجربة المستخدم.</span>
                           </li>
                          </>
                        )}
                      </ul>
                      
                      {tool.locked && (
                         <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#111827] to-transparent pointer-events-none flex items-end justify-center pb-2">
                         </div>
                      )}
                    </div>
                    {tool.locked && (
                      <div className="mt-4 text-center">
                         <a 
                           href="#pricing"
                           onClick={handleClose}
                           className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl text-sm font-bold shadow-lg transition-colors cursor-pointer"
                         >
                           <Lock size={16} />
                           اشترك لعرض جميع التوصيات
                         </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer in report */}
                <div className="pt-6 flex justify-end">
                  <button onClick={handleClose} className="px-6 py-2 bg-white/5 hover:bg-white/10 text-[#e2e8f0] rounded-xl transition-colors text-sm font-medium border border-white/10">
                    إنهاء وإغلاق التقرير
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
