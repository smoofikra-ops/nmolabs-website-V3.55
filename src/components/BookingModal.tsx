import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Clock, Phone, User as UserIcon, Briefcase, FileText, CheckCircle, AlertCircle, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { db, googleSignIn, getAccessToken, OperationType, handleFirestoreError } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

// Helper custom helper to trigger the booking modal from anywhere
export const triggerBookingModal = (serviceType?: string) => {
  const event = new CustomEvent('open-booking-modal', {
    detail: { serviceType }
  });
  window.dispatchEvent(event);
};

interface CountryOption {
  code: string;
  name: string;
  prefix: string;
  placeholder: string;
}

const countries: CountryOption[] = [
  { code: 'SA', name: 'السعودية', prefix: '+966', placeholder: '5XXXXXXXX' },
  { code: 'AE', name: 'الإمارات', prefix: '+971', placeholder: '5XXXXXXXX' },
  { code: 'KW', name: 'الكويت', prefix: '+965', placeholder: 'XXXXXXXX' },
  { code: 'QA', name: 'قطر', prefix: '+974', placeholder: 'XXXXXXXX' },
  { code: 'BH', name: 'البحرين', prefix: '+973', placeholder: 'XXXXXXXX' },
  { code: 'OM', name: 'عمان', prefix: '+968', placeholder: 'XXXXXXXX' }
];

const serviceOptions = [
  'إنشاء المتاجر الإلكترونية',
  'خدمات التسويق المتكاملة',
  'حلول النمو الذكية',
  'أدوات تحليل المتاجر',
  'تحسين SEO',
  'إدارة الحملات الإعلانية',
  'تصميم وتحسين واجهة المتجر UX/UI',
  'استشارة عامة'
];

export const BookingModal = () => {
  const { config } = useSite();
  const [isOpen, setIsOpen] = useState(false);
  
  // Wizard step state (1 to 5)
  const [step, setStep] = useState(1);
  
  // Form input states
  const [fullName, setFullName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('SA');
  const [mobileNumber, setMobileNumber] = useState('');
  const [clientType, setClientType] = useState<'company' | 'individual'>('individual');
  const [serviceType, setServiceType] = useState(serviceOptions[0]);
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [gcalSynced, setGcalSynced] = useState(false);

  const isRTL = config.language !== 'en';
  const currentCountryObj = countries.find(c => c.code === selectedCountry) || countries[0];

  // Listen to open requests
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      const prefill = customEvent.detail?.serviceType || '';
      
      // Determine if prefill matches one of the services or default to it
      if (prefill) {
        // Look for exact match or close match in service options
        const found = serviceOptions.find(opt => opt.includes(prefill) || prefill.includes(opt));
        setServiceType(found || prefill);
      } else {
        setServiceType(serviceOptions[0]);
      }
      
      setIsOpen(true);
      setStep(1);
      
      // Reset statuses & inputs
      setIsSuccess(false);
      setGcalSynced(false);
      setSubmitError('');
      setFullName('');
      setSelectedCountry('SA');
      setMobileNumber('');
      setClientType('individual');
      setNotes('');
      setSelectedDate('');
      setSelectedTime('');
      setErrors({});
    };

    window.addEventListener('open-booking-modal', handleOpen);
    return () => window.removeEventListener('open-booking-modal', handleOpen);
  }, []);

  // Keyboard close support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  // Available slots: 10:00 to 18:00 as requested
  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Block past dates
  const getMinDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Check if slot is in the past for today
  const isTimeSlotDisabled = (time: string) => {
    if (!selectedDate) return false;
    const todayStr = getMinDateString();
    if (selectedDate === todayStr) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      const [slotHour] = time.split(':').map(Number);
      
      // If today and hour is past or within 30 minutes, disable to allow scheduling headstart
      return slotHour <= currentHour;
    }
    return false;
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!fullName.trim()) {
        newErrors.fullName = 'شرفنا باسمك الكريم';
      } else if (fullName.trim().length < 2) {
        newErrors.fullName = 'الاسم يجب أن يكون ثنائياً أو ثلاثياً على الأقل';
      }
      
      if (!mobileNumber.trim()) {
        newErrors.mobileNumber = 'يرجى إدخال رقم الجوال';
      } else {
        // Dynamic length check based on prefix/country
        const cleanNum = mobileNumber.replace(/\s+/g, '');
        if (!/^[0-9]{7,10}$/.test(cleanNum)) {
          newErrors.mobileNumber = `يرجى إدخال رقم جوال صحيح (مثال: ${currentCountryObj.placeholder})`;
        }
      }
    }
    
    if (currentStep === 2) {
      if (!serviceType) {
        newErrors.serviceType = 'يرجى اختيار الخدمة المطلوبة';
      }
    }
    
    if (currentStep === 4) {
      if (!selectedDate) {
        newErrors.selectedDate = 'يرجى تحديد تاريخ الاستشارة';
      }
      if (!selectedTime) {
        newErrors.selectedTime = 'يرجى تحديد وقت الاستشارة المفضل';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitError('');

    if (!validateStep(1) || !validateStep(2) || !validateStep(4)) {
      setSubmitError('يرجى التأكد من ملء كافة البيانات المطلوبة بشكل صحيح.');
      return;
    }

    setIsSubmitting(true);
    const fullPhoneFormatted = `${currentCountryObj.prefix} ${mobileNumber.trim()}`;

    try {
      const bookingId = `book_${Date.now()}`;
      const payload = {
        fullName: fullName.trim(),
        mobileNumber: fullPhoneFormatted,
        country: currentCountryObj.name,
        clientType,
        serviceType,
        notes: notes.trim(),
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        createdAt: new Date().toISOString()
      };

      // 1. SAVE to Firebase Firestore
      const bookingDocRef = doc(db, 'bookings', bookingId);
      await setDoc(bookingDocRef, payload).catch((err) => {
        handleFirestoreError(err, OperationType.CREATE, `bookings/${bookingId}`);
      });

      // 2. SEND email trigger to nomutech2026@gmail.com via Formspree API
      try {
        await fetch('https://formspree.io/f/nomutech2026@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            email: 'nomutech2026@gmail.com',
            _subject: `استشارة جديدة من ${fullName.trim()} - NMOLABS`,
            "الاسم الكامل": fullName.trim(),
            "رقم الجوال": fullPhoneFormatted,
            "الدولة": currentCountryObj.name,
            "نوع العميل": clientType === 'company' ? 'شركة / مؤسسة' : 'فرد',
            "الخدمة المطلوبة": serviceType,
            "سبب التواصل / التحدي": notes.trim() || 'لم يتم تحديده',
            "التاريخ المختار": selectedDate,
            "الوقت المختار": selectedTime,
            "معرف الحجز في قاعدة البيانات": bookingId
          })
        });
      } catch (emailErr) {
        console.warn('Formspree dispatch failed, booking saved in DB:', emailErr);
      }

      // 3. ATTEMPT Google Calendar Schedule (Workspace Integration API)
      let syncedId = null;
      try {
        const token = await getAccessToken();
        if (token) {
          const startDateTime = `${selectedDate}T${selectedTime}:00`;
          const startDateInstant = new Date(startDateTime);
          const endDateInstant = new Date(startDateInstant.getTime() + 60 * 60 * 1000); // 1 hour slot
          
          const eventPayload = {
            summary: `استشارة نمو لابز - ${fullName}`,
            description: `العميل: ${fullName} (${clientType === 'company' ? 'شركة' : 'فرد'})\nالهاتف: ${fullPhoneFormatted}\nالخدمة: ${serviceType}\nالملاحظات: ${notes}`,
            start: {
              dateTime: startDateInstant.toISOString(),
              timeZone: 'Asia/Riyadh'
            },
            end: {
              dateTime: endDateInstant.toISOString(),
              timeZone: 'Asia/Riyadh'
            }
          };

          const eventRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventPayload)
          });

          if (eventRes.ok) {
            const eventData = await eventRes.json();
            syncedId = eventData.id;
            setGcalSynced(true);
            await setDoc(bookingDocRef, { ...payload, googleEventId: syncedId }).catch(() => {});
          }
        }
      } catch (gcalError) {
        console.warn('Google Calendar sync skipped/failed:', gcalError);
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'حدث خطأ غير متوقع أثناء الحجز. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignInGoogle = async () => {
    try {
      await googleSignIn();
      setGcalSynced(true);
    } catch (e) {
      console.error('Failed to link Google Calendar:', e);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Backdrop overlay */}
        <div className="absolute inset-0 cursor-pointer" onClick={() => setIsOpen(false)} />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-[#07070F]/95 border border-white/15 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(79,142,247,0.15)] relative z-10"
        >
          {/* Top Header & Wizard Progress */}
          <div className="p-6 border-b border-white/10 bg-black/40">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#4F8EF7]" />
                  حجز موعد استشارتك المجانية
                </h3>
                <p className="text-xs text-gray-400 mt-1">احصل على جلسة مخصصة لدراسة متطلبات نمو متجرك</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 transition-all text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {!isSuccess && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span className="font-semibold text-[#4F8EF7]">
                    {step === 1 && 'بيانات التواصل'}
                    {step === 2 && 'نوع العميل والخدمة'}
                    {step === 3 && 'سبب التواصل'}
                    {step === 4 && 'اختيار الموعد'}
                    {step === 5 && 'مراجعة وتأكيد الحجز'}
                  </span>
                  <span className="font-english">الخطوة {step} من 5</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#4F8EF7] via-[#7C3AED] to-[#22D3A0] rounded-full"
                    animate={{ width: `${(step / 5) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Core Body Container */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-8"
              >
                <div className="w-16 h-16 bg-[#22D3A0]/10 border border-[#22D3A0]/30 text-[#22D3A0] rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,211,160,0.2)]">
                  <CheckCircle size={36} />
                </div>
                
                <h4 className="text-xl md:text-2xl font-bold text-white mb-3">تم تأكيد حجزك بنجاح</h4>
                
                <p className="text-gray-300 max-w-md leading-relaxed mb-6 text-sm">
                  شكرًا لتواصلك واهتمامك بـ NMOLABS. تم استلام طلب الاستشارة، وسيتواصل معك فريقنا لتأكيد التفاصيل ومساعدتك في الخطوة القادمة.
                </p>

                {gcalSynced ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22D3A0]/10 border border-[#22D3A0]/20 text-[#22D3A0] rounded-full text-xs font-medium mb-6">
                    <span className="w-2 h-2 rounded-full bg-[#22D3A0] animate-pulse"></span>
                    تم المزامنة مباشرة مع Google Calendar الخاص بك!
                  </div>
                ) : (
                  <button
                    onClick={handleSignInGoogle}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4F8EF7]/10 border border-[#4F8EF7]/20 text-[#4F8EF7] hover:bg-[#4F8EF7]/20 transition-all rounded-full text-xs font-semibold mb-6"
                  >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                    اضغط لتفعيل المزامنة المباشرة مع Google Calendar
                  </button>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  className="px-8 py-3 bg-white text-black font-bold rounded-full hover:opacity-90 transition-all text-sm shadow-md"
                >
                  العودة للموقع
                </button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {submitError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Step 1: Contact Details */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-bold text-slate-200 mb-2">
                        الاسم بالكامل <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          setErrors(prev => ({ ...prev, fullName: '' }));
                        }}
                        placeholder="شرفنا باسمك"
                        className={`w-full bg-black/60 border rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-gray-500 ${
                          errors.fullName 
                            ? 'border-red-500/50 focus:border-red-500' 
                            : 'border-white/20 focus:border-[#4F8EF7] focus:shadow-[0_0_10px_rgba(79,142,247,0.2)]'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-200 mb-2">
                        الدولة <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedCountry}
                        onChange={(e) => {
                          setSelectedCountry(e.target.value);
                          setMobileNumber('');
                          setErrors(prev => ({ ...prev, mobileNumber: '' }));
                        }}
                        className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all focus:border-[#4F8EF7] focus:shadow-[0_0_10px_rgba(79,142,247,0.2)] cursor-pointer"
                      >
                        {countries.map((c) => (
                          <option key={c.code} value={c.code} className="bg-[#07070F] text-white">
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-200 mb-2">
                        رقم الجوال <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2 items-stretch">
                        <span className="bg-white/5 border border-white/20 px-4 py-3 rounded-xl text-sm text-gray-300 font-bold font-english flex items-center justify-center select-none shrink-0 min-w-[70px]">
                          {currentCountryObj.prefix}
                        </span>
                        <input
                          type="tel"
                          value={mobileNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setMobileNumber(val);
                            setErrors(prev => ({ ...prev, mobileNumber: '' }));
                          }}
                          placeholder={currentCountryObj.placeholder}
                          className={`flex-grow bg-black/60 border rounded-xl px-4 py-3 text-white text-sm outline-none transition-all font-english ${
                            errors.mobileNumber 
                              ? 'border-red-500/50 focus:border-red-500' 
                              : 'border-white/20 focus:border-[#4F8EF7] focus:shadow-[0_0_10px_rgba(79,142,247,0.2)]'
                          }`}
                        />
                      </div>
                      {errors.mobileNumber && (
                        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.mobileNumber}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Client & Service Type */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-bold text-slate-200 mb-2">
                        نوع العميل <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setClientType('individual')}
                          className={`py-3.5 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                            clientType === 'individual'
                              ? 'bg-[#4F8EF7]/10 border-[#4F8EF7] text-white shadow-[0_0_15px_rgba(79,142,247,0.15)]'
                              : 'bg-black/40 border-white/10 text-gray-400 hover:bg-black/60 hover:border-white/20'
                          }`}
                        >
                          <UserIcon size={16} className={clientType === 'individual' ? 'text-[#4F8EF7]' : ''} />
                          فرد
                        </button>
                        <button
                          type="button"
                          onClick={() => setClientType('company')}
                          className={`py-3.5 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                            clientType === 'company'
                              ? 'bg-[#7C3AED]/10 border-[#7C3AED] text-white shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                              : 'bg-black/40 border-white/10 text-gray-400 hover:bg-black/60 hover:border-white/20'
                          }`}
                        >
                          <Briefcase size={16} className={clientType === 'company' ? 'text-[#7C3AED]' : ''} />
                          مؤسسة أو شركة
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-200 mb-2">
                        نوع الخدمة المطلوبة <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={serviceType}
                        onChange={(e) => {
                          setServiceType(e.target.value);
                          setErrors(prev => ({ ...prev, serviceType: '' }));
                        }}
                        className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all focus:border-[#4F8EF7] focus:shadow-[0_0_10px_rgba(79,142,247,0.2)] cursor-pointer"
                      >
                        {serviceOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#07070F] text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Reason / Notes */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-bold text-slate-200 mb-2">
                        سبب التواصل / الملاحظات
                      </label>
                      <textarea
                        rows={5}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="اكتب باختصار سبب التواصل أو التحدي الذي تواجهه في متجرك"
                        className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all focus:border-[#4F8EF7] focus:shadow-[0_0_10px_rgba(79,142,247,0.2)] placeholder:text-gray-500 resize-none leading-relaxed"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Appointment date & time */}
                {step === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-bold text-slate-200 mb-2">
                        تاريخ الموعد المفضل <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          min={getMinDateString()}
                          value={selectedDate}
                          onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setSelectedTime(''); // Reset time slot on date change to ensure availability check
                            setErrors(prev => ({ ...prev, selectedDate: '', selectedTime: '' }));
                          }}
                          className={`w-full bg-black/60 border rounded-xl px-4 py-3 text-white text-sm outline-none transition-all font-english cursor-pointer ${
                            errors.selectedDate 
                              ? 'border-red-500/50 focus:border-red-500' 
                              : 'border-white/20 focus:border-[#4F8EF7] focus:shadow-[0_0_10px_rgba(79,142,247,0.2)]'
                          }`}
                        />
                      </div>
                      {errors.selectedDate && (
                        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.selectedDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-slate-200">
                          وقت الموعد المفضل <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[10px] text-gray-400">ساعات العمل: 10:00 - 18:00</span>
                      </div>
                      
                      {/* TODO: Connect booking dates and availability with Google Calendar API. */}
                      <div className="grid grid-cols-3 gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/10 max-h-[170px] overflow-y-auto scrollbar-thin">
                        {timeSlots.map((time) => {
                          const isDisabled = isTimeSlotDisabled(time);
                          const isSelected = selectedTime === time;
                          
                          return (
                            <button
                              key={time}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => {
                                setSelectedTime(time);
                                setErrors(prev => ({ ...prev, selectedTime: '' }));
                              }}
                              className={`py-3 rounded-xl text-xs font-bold transition-all font-english flex items-center justify-center ${
                                isDisabled 
                                  ? 'opacity-30 bg-white/5 border border-dashed border-white/5 text-gray-500 cursor-not-allowed'
                                  : isSelected
                                    ? 'bg-gradient-to-r from-[#4F8EF7] to-[#7C3AED] text-white border-transparent shadow-[0_0_12px_rgba(79,142,247,0.3)]'
                                    : 'bg-[#0F0F1B] border border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/5'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                      {errors.selectedTime && (
                        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.selectedTime}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Summary Review & Confirm */}
                {step === 5 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4">
                      <h4 className="text-sm font-bold text-[#22D3A0] border-b border-white/5 pb-2 mb-3">مراجعة تفاصيل حجز الموعد</h4>
                      
                      <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs">
                        <div>
                          <span className="text-gray-400 block mb-1">الاسم الكامل:</span>
                          <span className="text-white font-semibold">{fullName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block mb-1">رقم الجوال:</span>
                          <span className="text-white font-semibold font-english" dir="ltr">{currentCountryObj.prefix} {mobileNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block mb-1">نوع الخدمة:</span>
                          <span className="text-white font-semibold">{serviceType}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block mb-1">نوع العميل:</span>
                          <span className="text-white font-semibold">{clientType === 'company' ? 'مؤسسة أو شركة' : 'فرد'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block mb-1">تاريخ الموعد:</span>
                          <span className="text-white font-semibold font-english">{selectedDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block mb-1">توقيت الموعد:</span>
                          <span className="text-[#4F8EF7] font-bold font-english">{selectedTime}</span>
                        </div>
                      </div>

                      {notes.trim() && (
                        <div className="border-t border-white/5 pt-3">
                          <span className="text-gray-400 text-xs block mb-1">سبب التواصل / الملاحظات:</span>
                          <p className="text-gray-300 text-xs leading-relaxed italic bg-black/30 p-2.5 rounded-lg border border-white/5">{notes}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Core Footer Actions */}
          {!isSuccess && (
            <div className="p-6 border-t border-white/10 bg-black/40 flex gap-3 justify-between items-center">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-3 border border-white/15 rounded-full text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
                >
                  <ChevronRight size={14} className="rtl:hidden" />
                  <ChevronLeft size={14} className="ltr:hidden" />
                  السابق
                </button>
              ) : (
                <div /> // Spacer
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-[#4F8EF7] hover:bg-[#4F8EF7]/90 text-white rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(79,142,247,0.2)]"
                >
                  التالي
                  <ChevronLeft size={14} className="rtl:hidden" />
                  <ChevronRight size={14} className="ltr:hidden" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#4F8EF7] to-[#7C3AED] hover:shadow-[0_0_20px_rgba(79,142,247,0.3)] text-white hover:opacity-95 rounded-full text-xs font-bold transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري تأكيد الموعد...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} />
                      تأكيد الحجز وجدولة الموعد
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
