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
  
  // Wizard step state (1 to 6)
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
  
  // Bespoke Calendar states
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed
  
  const [calendarMonth, setCalendarMonth] = useState(currentMonth);
  const [calendarYear, setCalendarYear] = useState(currentYear);
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFirestoreError, setIsFirestoreError] = useState(false);
  const [gcalSynced, setGcalSynced] = useState(false);

  const isRTL = config.language !== 'en';
  const currentCountryObj = countries.find(c => c.code === selectedCountry) || countries[0];

  // Listen to open requests
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      const prefill = customEvent.detail?.serviceType || '';
      
      if (prefill) {
        const found = serviceOptions.find(opt => opt.includes(prefill) || prefill.includes(opt));
        setServiceType(found || prefill);
      } else {
        setServiceType(serviceOptions[0]);
      }
      
      setIsOpen(true);
      setStep(1);
      
      // Reset statuses & inputs
      setIsSuccess(false);
      setIsFirestoreError(false);
      setGcalSynced(false);
      setSubmitError('');
      setFullName('');
      setSelectedCountry('SA');
      setMobileNumber('');
      setClientType('individual');
      setNotes('');
      setSelectedDate('');
      setSelectedTime('');
      setCalendarMonth(currentMonth);
      setCalendarYear(currentYear);
      setErrors({});
    };

    window.addEventListener('open-booking-modal', handleOpen);
    return () => window.removeEventListener('open-booking-modal', handleOpen);
  }, [currentMonth, currentYear]);

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

  // Block past dates helper for comparison
  const getMinDateString = () => {
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Check if time slot is in the past for today
  const isTimeSlotDisabled = (time: string) => {
    if (!selectedDate) return false;
    const todayStr = getMinDateString();
    if (selectedDate === todayStr) {
      const now = new Date();
      const currentHour = now.getHours();
      const [slotHour] = time.split(':').map(Number);
      return slotHour <= currentHour;
    }
    return false;
  };

  // --- BESPOKE CALENDAR UTILS ---
  const monthsArabic = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const handlePrevMonth = () => {
    if (calendarYear === currentYear && calendarMonth === currentMonth) return;
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(prev => prev - 1);
    } else {
      setCalendarMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(prev => prev + 1);
    } else {
      setCalendarMonth(prev => prev + 1);
    }
  };

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay(); // 0 = Sun, 1 = Mon...

  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDayIndex = getFirstDayOfMonth(calendarYear, calendarMonth);
  const weekDays = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  const isDateDisabled = (day: number) => {
    const checkDate = new Date(calendarYear, calendarMonth, day);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const checkMidnight = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
    return checkMidnight < todayMidnight;
  };

  const isDateToday = (day: number) => {
    return calendarYear === today.getFullYear() &&
           calendarMonth === today.getMonth() &&
           day === today.getDate();
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    const [selY, selM, selD] = selectedDate.split('-').map(Number);
    return calendarYear === selY &&
           (calendarMonth + 1) === selM &&
           day === selD;
  };

  const handleSelectDate = (day: number) => {
    const yyyy = calendarYear;
    const mm = String(calendarMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    setSelectedDate(dateStr);
    setSelectedTime(''); // Reset time selection on date change
    setErrors(prev => ({ ...prev, selectedDate: '', selectedTime: '' }));
    
    // Auto advance to Step 5 (Time Selection) after selection
    setTimeout(() => {
      setStep(5);
    }, 200);
  };

  // --- VALIDATION AND STEP WIZARD UTILS ---
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
        newErrors.selectedDate = 'يرجى تحديد تاريخ الاستشارة من التقويم';
      }
    }

    if (currentStep === 5) {
      if (!selectedTime) {
        newErrors.selectedTime = 'يرجى تحديد وقت الاستشارة المفضل';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 6));
    }
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  // --- ACTIONS & SUBMISSIONS ---
  const handleWhatsAppConfirm = () => {
    const fullPhone = `${currentCountryObj.prefix} ${mobileNumber.trim()}`;
    const msg = `أهلاً نمو لابز، أود تأكيد موعد استشارتي المجانية:\n\n` +
                `الاسم: ${fullName.trim()}\n` +
                `رقم الجوال: ${fullPhone}\n` +
                `نوع العميل: ${clientType === 'company' ? 'شركة / مؤسسة' : 'فرد'}\n` +
                `الخدمة: ${serviceType}\n` +
                `التاريخ: ${selectedDate}\n` +
                `الوقت: ${selectedTime}\n` +
                `سبب التواصل: ${notes.trim() || 'لم يحدد بعد'}`;
    
    const whatsappNumber = config.contactNumber || '966500000000';
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSubmit = async () => {
    setSubmitError('');

    if (!validateStep(1) || !validateStep(2) || !validateStep(4) || !validateStep(5)) {
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

      // 1. SEND email trigger to nomutech2026@gmail.com first so they still get the notice even if Firestore fails
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
            "معرف الحجز السحابي": bookingId
          })
        });
      } catch (emailErr) {
        console.warn('Formspree notification skipped:', emailErr);
      }

      // 2. SAVE to Firebase Firestore securely
      try {
        const bookingDocRef = doc(db, 'bookings', bookingId);
        await setDoc(bookingDocRef, payload);
        setIsFirestoreError(false);
      } catch (firestoreErr: any) {
        // Log technical detail quietly inside the dev console as requested
        console.error('Technical Booking Error:', firestoreErr);
        // Set Firestore error flag to display friendly WhatsApp fallback instead of crashing
        setIsFirestoreError(true);
      }

      // 3. ATTEMPT Google Calendar Schedule (Dynamic comments preserved)
      // TODO: Connect selected booking date and time to Google Calendar API.
      // TODO: Fetch unavailable slots from Google Calendar API.
      // TODO: Create Google Calendar event after successful booking.
      try {
        const token = await getAccessToken();
        if (token && !isFirestoreError) {
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
            setGcalSynced(true);
          }
        }
      } catch (gcalError) {
        console.warn('Google Calendar sync skipped:', gcalError);
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setSubmitError('تعذر إرسال طلب الحجز حاليًا، يرجى المحاولة لاحقًا أو التواصل معنا عبر واتساب.');
    } finally {
      setIsSubmitting(false);
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
          className="bg-[#07070F]/95 border border-white/20 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(79,142,247,0.15)] relative z-10"
        >
          {/* Top Header & Wizard Progress */}
          <div className="p-6 border-b border-white/10 bg-black/40">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#22D3A0]" />
                  حجز موعد استشارتك المجانية
                </h3>
                <p className="text-sm text-gray-400 mt-1">احصل على جلسة مخصصة لدراسة متطلبات نمو متجرك</p>
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
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span className="font-bold text-[#22D3A0]">
                    {step === 1 && 'بيانات التواصل'}
                    {step === 2 && 'نوع العميل والخدمة'}
                    {step === 3 && 'سبب التواصل'}
                    {step === 4 && 'اختيار التاريخ'}
                    {step === 5 && 'اختيار الوقت'}
                    {step === 6 && 'مراجعة وتأكيد الحجز'}
                  </span>
                  <span className="font-english font-bold">الخطوة {step} من 6</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#4F8EF7] via-[#7C3AED] to-[#22D3A0] rounded-full"
                    animate={{ width: `${(step / 6) * 100}%` }}
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
                className="flex flex-col items-center justify-center text-center py-6"
              >
                {isFirestoreError ? (
                  <>
                    <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                      <AlertCircle size={36} />
                    </div>
                    
                    <h4 className="text-lg md:text-xl font-bold text-white mb-4 leading-relaxed max-w-md px-2">
                      تم استلام بياناتك محليًا، ولكن تعذر إرسال الطلب للنظام حاليًا. يرجى التواصل معنا عبر واتساب لتأكيد الموعد.
                    </h4>

                    <button
                      onClick={handleWhatsAppConfirm}
                      className="px-8 py-3.5 bg-gradient-to-r from-[#22D3A0] to-[#4F8EF7] hover:shadow-[0_0_20px_rgba(34,211,160,0.3)] text-black font-extrabold rounded-full text-sm transition-all flex items-center gap-2 mb-4 cursor-pointer"
                    >
                      <Phone size={16} />
                      تأكيد عبر واتساب
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-[#22D3A0]/10 border border-[#22D3A0]/30 text-[#22D3A0] rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,211,160,0.2)]">
                      <CheckCircle size={36} />
                    </div>
                    
                    <h4 className="text-xl md:text-2xl font-bold text-white mb-3">تم تأكيد حجزك بنجاح</h4>
                    
                    <p className="text-sm text-gray-300 max-w-md leading-relaxed mb-6">
                      شكرًا لتواصلك واهتمامك بـ NMOLABS. تم استلام طلب الاستشارة، وسيتواصل معك فريقنا لتأكيد التفاصيل ومساعدتك في الخطوة القادمة.
                    </p>

                    {gcalSynced && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22D3A0]/10 border border-[#22D3A0]/20 text-[#22D3A0] rounded-full text-sm font-medium mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#22D3A0] animate-pulse"></span>
                        تم المزامنة مباشرة مع Google Calendar الخاص بك!
                      </div>
                    )}

                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-8 py-3.5 bg-white text-black font-bold rounded-full hover:opacity-90 transition-all text-sm shadow-md cursor-pointer"
                    >
                      العودة للموقع
                    </button>
                  </>
                )}
              </motion.div>
            ) : (
              <div className="space-y-5">
                {submitError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Step 1: Contact Details */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-bold text-slate-100 mb-2">
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
                        className={`w-full bg-black/60 border rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all placeholder:text-gray-500 ${
                          errors.fullName 
                            ? 'border-red-500/50 focus:border-red-500' 
                            : 'border-white/20 focus:border-[#22D3A0] focus:shadow-[0_0_12px_rgba(34,211,160,0.2)]'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-400 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={14} /> {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-100 mb-2">
                        الدولة <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedCountry}
                        onChange={(e) => {
                          setSelectedCountry(e.target.value);
                          setMobileNumber('');
                          setErrors(prev => ({ ...prev, mobileNumber: '' }));
                        }}
                        className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all focus:border-[#22D3A0] focus:shadow-[0_0_12px_rgba(34,211,160,0.2)] cursor-pointer"
                      >
                        {countries.map((c) => (
                          <option key={c.code} value={c.code} className="bg-[#07070F] text-white">
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-100 mb-2">
                        رقم الجوال <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2 items-stretch">
                        <span className="bg-white/5 border border-white/20 px-4 py-3 rounded-xl text-sm text-white font-bold font-english flex items-center justify-center select-none shrink-0 min-w-[75px]">
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
                          className={`flex-grow bg-black/60 border rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all font-english ${
                            errors.mobileNumber 
                              ? 'border-red-500/50 focus:border-red-500' 
                              : 'border-white/20 focus:border-[#22D3A0] focus:shadow-[0_0_12px_rgba(34,211,160,0.2)]'
                          }`}
                        />
                      </div>
                      {errors.mobileNumber && (
                        <p className="text-sm text-red-400 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={14} /> {errors.mobileNumber}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Client & Service Type */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-bold text-slate-100 mb-2">
                        نوع العميل <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setClientType('individual')}
                          className={`py-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
                          className={`py-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
                      <label className="block text-sm font-bold text-slate-100 mb-2">
                        نوع الخدمة المطلوبة <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={serviceType}
                        onChange={(e) => {
                          setServiceType(e.target.value);
                          setErrors(prev => ({ ...prev, serviceType: '' }));
                        }}
                        className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all focus:border-[#22D3A0] focus:shadow-[0_0_12px_rgba(34,211,160,0.2)] cursor-pointer"
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
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-bold text-slate-100 mb-2">
                        سبب التواصل / الملاحظات
                      </label>
                      <textarea
                        rows={5}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="اكتب باختصار سبب التواصل أو التحدي الذي تواجهه في متجرك"
                        className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all focus:border-[#22D3A0] focus:shadow-[0_0_12px_rgba(34,211,160,0.2)] placeholder:text-gray-500 resize-none leading-relaxed"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Calendar Picker */}
                {step === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="space-y-3"
                  >
                    <label className="block text-sm font-bold text-slate-100">
                      اختر تاريخ الموعد من التقويم <span className="text-red-500">*</span>
                    </label>
                    
                    {/* Bespoke Premium Calendar Wizard */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-4 shadow-inner">
                      {/* Month Swapper */}
                      <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-2xl p-3 mb-4">
                        <button
                          type="button"
                          disabled={calendarYear === currentYear && calendarMonth === currentMonth}
                          onClick={handlePrevMonth}
                          className={`p-2 rounded-xl border border-white/10 text-white transition-all ${
                            calendarYear === currentYear && calendarMonth === currentMonth
                              ? 'opacity-30 cursor-not-allowed'
                              : 'hover:bg-white/5 cursor-pointer'
                          }`}
                        >
                          <ChevronRight size={18} className="rtl:block ltr:hidden" />
                          <ChevronLeft size={18} className="ltr:block rtl:hidden" />
                        </button>
                        
                        <span className="text-sm md:text-base font-bold text-white font-english">
                          {monthsArabic[calendarMonth]} {calendarYear}
                        </span>
                        
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          className="p-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all cursor-pointer"
                        >
                          <ChevronLeft size={18} className="rtl:block ltr:hidden" />
                          <ChevronRight size={18} className="ltr:block rtl:hidden" />
                        </button>
                      </div>

                      {/* Week Header */}
                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {weekDays.map(wd => (
                          <span key={wd} className="text-xs md:text-sm font-bold text-gray-400 py-1">
                            {wd}
                          </span>
                        ))}
                      </div>

                      {/* Days Grid Cells */}
                      <div className="grid grid-cols-7 gap-1.5">
                        {cells.map((day, idx) => {
                          if (day === null) {
                            return <div key={`empty-${idx}`} />;
                          }

                          const disabled = isDateDisabled(day);
                          const todayHighlight = isDateToday(day);
                          const selected = isDateSelected(day);

                          return (
                            <button
                              key={`day-${day}`}
                              type="button"
                              disabled={disabled}
                              onClick={() => handleSelectDate(day)}
                              className={`py-2 md:py-2.5 rounded-xl text-sm font-bold transition-all font-english flex items-center justify-center ${
                                disabled
                                  ? 'opacity-20 text-gray-600 cursor-not-allowed border-none'
                                  : selected
                                    ? 'bg-gradient-to-r from-[#22D3A0] to-[#4F8EF7] text-black font-extrabold shadow-[0_0_12px_rgba(34,211,160,0.35)]'
                                    : todayHighlight
                                      ? 'border border-[#22D3A0] text-[#22D3A0] hover:bg-white/5'
                                      : 'bg-white/[0.02] border border-white/10 text-white hover:border-white/30 hover:bg-white/5'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {errors.selectedDate && (
                      <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.selectedDate}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Step 5: Time Selection */}
                {step === 5 && (
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-slate-100">
                        اختر وقت الموعد المفضل <span className="text-red-500">*</span>
                      </label>
                      <span className="text-sm text-gray-400 font-english">{selectedDate}</span>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
                      <div className="grid grid-cols-3 gap-2.5 max-md:grid-cols-2">
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
                              className={`py-3.5 rounded-xl text-sm font-bold transition-all font-english flex items-center justify-center cursor-pointer ${
                                isDisabled 
                                  ? 'opacity-25 bg-white/5 border border-dashed border-white/5 text-gray-500 cursor-not-allowed'
                                  : isSelected
                                    ? 'bg-gradient-to-r from-[#22D3A0] to-[#4F8EF7] text-black font-extrabold border border-[#22D3A0] shadow-[0_0_15px_rgba(34,211,160,0.4)]'
                                    : 'bg-white/[0.03] border border-white/10 text-white hover:border-[#22D3A0]/50 hover:bg-white/5'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    {errors.selectedTime && (
                      <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.selectedTime}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Step 6: Summary Review */}
                {step === 6 && (
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="space-y-4"
                  >
                    <div className="bg-white/[0.03] border border-white/20 rounded-2xl p-5 space-y-4">
                      <h4 className="text-base font-bold text-[#22D3A0] border-b border-white/5 pb-2 mb-3">مراجعة تفاصيل حجز الموعد</h4>
                      
                      <div className="grid grid-cols-2 gap-y-4 gap-x-3 text-sm">
                        <div>
                          <span className="text-gray-400 block mb-1">الاسم الكامل:</span>
                          <span className="text-white font-bold">{fullName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block mb-1">رقم الجوال:</span>
                          <span className="text-white font-bold font-english" dir="ltr">{currentCountryObj.prefix} {mobileNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block mb-1">نوع الخدمة:</span>
                          <span className="text-white font-bold">{serviceType}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block mb-1">نوع العميل:</span>
                          <span className="text-white font-bold">{clientType === 'company' ? 'مؤسسة أو شركة' : 'فرد'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block mb-1">تاريخ الموعد:</span>
                          <span className="text-[#22D3A0] font-bold font-english">{selectedDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block mb-1">توقيت الموعد:</span>
                          <span className="text-[#4F8EF7] font-bold font-english">{selectedTime}</span>
                        </div>
                      </div>

                      {notes.trim() && (
                        <div className="border-t border-white/5 pt-3.5">
                          <span className="text-gray-400 text-sm block mb-1.5">سبب التواصل / الملاحظات:</span>
                          <p className="text-gray-300 text-sm leading-relaxed italic bg-black/30 p-3 rounded-lg border border-white/5">{notes}</p>
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
                  className="px-5 py-3 border border-white/20 rounded-full text-sm font-bold text-white hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight size={16} className="rtl:hidden" />
                  <ChevronLeft size={16} className="ltr:hidden" />
                  السابق
                </button>
              ) : (
                <div /> // Spacer
              )}

              {step < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-[#4F8EF7] hover:bg-[#4F8EF7]/90 text-white rounded-full text-sm font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(79,142,247,0.2)] cursor-pointer"
                >
                  التالي
                  <ChevronLeft size={16} className="rtl:hidden" />
                  <ChevronRight size={16} className="ltr:hidden" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#22D3A0] to-[#4F8EF7] hover:shadow-[0_0_20px_rgba(34,211,160,0.35)] text-black font-extrabold rounded-full text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} className="text-black" />
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
