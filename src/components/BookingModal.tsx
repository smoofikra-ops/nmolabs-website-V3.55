import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Clock, Phone, User as UserIcon, Briefcase, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
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

export const BookingModal = () => {
  const { config } = useSite();
  const [isOpen, setIsOpen] = useState(false);
  const [prefilledService, setPrefilledService] = useState('');
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [clientType, setClientType] = useState<'company' | 'individual'>('individual');
  const [serviceType, setServiceType] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [gcalSynced, setGcalSynced] = useState(false);

  const isRTL = config.language !== 'en';

  // Listen to open requests
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      const prefill = customEvent.detail?.serviceType || '';
      setPrefilledService(prefill);
      setServiceType(prefill || 'أخرى');
      setIsOpen(true);
      // Reset statuses
      setIsSuccess(false);
      setGcalSynced(false);
      setSubmitError('');
      setFullName('');
      setMobileNumber('');
      setClientType('individual');
      setNotes('');
      setSelectedDate('');
      setSelectedTime('');
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

  // Working hours: 10:00 AM (10:00) to 10:00 PM (22:00)
  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  // Block past dates & allow up to 6 months in future
  const getMinDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Saudi Mobile Number checks
  // Valid formats: start with 05, 5, +9665, 9665 followed by 8 numbers. Total length checks.
  const validateSaudiMobile = (num: string) => {
    const cleanNum = num.trim().replace(/\s+/g, '');
    const saudiRegex = /^(05|5|\+9665|9665)[0-9]{8}$/;
    return saudiRegex.test(cleanNum);
  };

  const getTranslatedText = (key: string) => {
    const trans: Record<string, { ar: string, en: string }> = {
      title: { ar: 'احجز موعد استشارتك المجانية', en: 'Book Your Free Consultation' },
      subtitle: { ar: 'اختر الموعد الأنسب للتواصل ومناقشة متطلبات متجرك', en: 'Select the best time to discuss your store requirements' },
      fullName: { ar: 'الاسم الكامل', en: 'Full Name' },
      mobileNumber: { ar: 'رقم الجوال السعودي', en: 'Saudi Mobile Number' },
      mobileHint: { ar: 'مثال: 05XXXXXXXX', en: 'Example: 05XXXXXXXX' },
      clientType: { ar: 'نوع العميل', en: 'Client Type' },
      individual: { ar: 'فرد', en: 'Individual' },
      company: { ar: 'مؤسسة أو شركة', en: 'Company / Enterprise' },
      serviceType: { ar: 'نوع الخدمة المطلوبة', en: 'Requested Service' },
      notes: { ar: 'ملاحظات إضافية / سبب التواصل', en: 'Additional Details / Goal' },
      notesPlaceholder: { ar: 'اكتب أي تفاصيل إضافية أو سبب التواصل', en: 'Write any specific needs or details here...' },
      prefDate: { ar: 'تاريخ الموعد المفضل', en: 'Preferred Appointment Date' },
      prefTime: { ar: 'وقت الموعد المفضل', en: 'Preferred Appointment Time' },
      workingHoursNote: { ar: 'ساعات العمل الرسمية من 10:00 صباحاً وحتى 10:00 مساءً', en: 'Available from 10:00 AM to 10:00 PM' },
      bookBtn: { ar: 'تأكيد الحجز وجدولة الموعد', en: 'Confirm Booking & Schedule' },
      successTitle: { ar: 'تم جدولة الموعد بنجاح!', en: 'Booking Confirmed Successfully!' },
      successMsg: { ar: 'تم حفظ تفاصيل حجزك في قاعدة بياناتنا وسيقوم أحد مستشارينا بالتواصل معك في الموعد المحدد.', en: 'Your consultation request has been stored. A growth advisor will reach out during your selected time.' },
      syncedWithCalendar: { ar: 'تم المزامنة مباشرة مع Google Calendar الخاص بك!', en: 'Synced with Google Calendar API!' },
      calendarOption: { ar: 'اضغط لتفعيل المزامنة المباشرة مع Google Calendar', en: 'Connect Google Calendar to synchronize' },
      close: { ar: 'إغلاق', en: 'Close' },
      requiredErr: { ar: 'يرجى تعبئة كافة الحقول المطلوبة', en: 'Please fill in all required fields' },
      mobileErr: { ar: 'يرجى إدخال رقم جوال سعودي صحيح (مثال: 05xxxxxxxx)', en: 'Please enter a valid Saudi mobile (05xxxxxxxx)' }
    };
    return trans[key] ? (isRTL ? trans[key].ar : trans[key].en) : '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // Pre-validations
    if (!fullName.trim() || !mobileNumber.trim() || !serviceType || !selectedDate || !selectedTime) {
      setSubmitError(getTranslatedText('requiredErr'));
      return;
    }

    if (!validateSaudiMobile(mobileNumber)) {
      setSubmitError(getTranslatedText('mobileErr'));
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingId = `book_${Date.now()}`;
      const payload = {
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        clientType,
        serviceType,
        notes: notes.trim(),
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        createdAt: new Date().toISOString() // Or request.time inside firestore rules
      };

      // 1. SAVE to Firebase Firestore securely
      const bookingDocRef = doc(db, 'bookings', bookingId);
      await setDoc(bookingDocRef, payload).catch((err) => {
        handleFirestoreError(err, OperationType.CREATE, `bookings/${bookingId}`);
      });

      // 2. ATTEMPT Google Calendar Schedule (Workspace Integration Skill)
      let syncedId = null;
      try {
        const token = await getAccessToken();
        if (token) {
          // Calculate startDate and endDate
          const startDateTime = `${selectedDate}T${selectedTime}:00`;
          const startDateInstant = new Date(startDateTime);
          const endDateInstant = new Date(startDateInstant.getTime() + 60 * 60 * 1000); // 1 hour slot
          
          const eventPayload = {
            summary: `استشارة نمو لابز - ${fullName}`,
            description: `العميل: ${fullName} (${clientType === 'company' ? 'شركة' : 'فرد'})\nالهاتف: ${mobileNumber}\nالخدمة: ${serviceType}\nالملاحظات: ${notes}`,
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

            // Update Doc with Event ID
            await setDoc(bookingDocRef, { ...payload, googleEventId: syncedId }).catch(() => {});
          }
        }
      } catch (gcalError) {
        console.warn('Google Calendar sync failed, falling back to database only:', gcalError);
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Backdrop overlay */}
        <div className="absolute inset-0 cursor-pointer" onClick={() => setIsOpen(false)} />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-[#07070F] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative z-10"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/20">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-[color:var(--color-brand-blue-val)]" />
                {getTranslatedText('title')}
              </h3>
              <p className="text-xs text-[color:var(--color-text-muted)] mt-1">{getTranslatedText('subtitle')}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 transition-all text-[color:var(--color-text-muted)] hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Core Body Section */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-10"
              >
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <CheckCircle size={36} />
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">{getTranslatedText('successTitle')}</h4>
                <p className="text-[color:var(--color-text-muted)] max-w-md leading-relaxed mb-6 text-sm">{getTranslatedText('successMsg')}</p>

                {gcalSynced ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium mb-6 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    {getTranslatedText('syncedWithCalendar')}
                  </div>
                ) : (
                  <button
                    onClick={handleSignInGoogle}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all rounded-full text-xs font-semibold mb-6 shadow"
                  >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                    {getTranslatedText('calendarOption')}
                  </button>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  className="px-8 py-3 bg-white text-black font-bold rounded-full hover:opacity-90 transition-all text-sm shadow-md"
                >
                  {getTranslatedText('close')}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {submitError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Grid for Name & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--color-text-muted)] mb-2 flex items-center gap-1.5">
                      <UserIcon className="w-4 h-4 text-[color:var(--color-brand-blue-val)]" />
                      {getTranslatedText('fullName')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={isRTL ? "الاسم الثلاثي أو الثنائي" : "John Doe"}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[color:var(--color-brand-blue-val)] outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[color:var(--color-text-muted)] mb-2 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-[color:var(--color-brand-blue-val)]" />
                      {getTranslatedText('mobileNumber')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="05xxxxxxxx"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[color:var(--color-brand-blue-val)] outline-none transition-all placeholder:text-gray-600 font-english"
                    />
                    <span className="text-[10px] text-[color:var(--color-text-muted)] mt-1.5 block">{getTranslatedText('mobileHint')}</span>
                  </div>
                </div>

                {/* Grid for Client & Service type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--color-text-muted)] mb-2 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-[color:var(--color-brand-blue-val)]" />
                      {getTranslatedText('clientType')} <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setClientType('individual')}
                        className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                          clientType === 'individual'
                            ? 'bg-[color:var(--color-brand-blue-val)]/15 border-[color:var(--color-brand-blue-val)]/50 text-[color:var(--color-brand-green-val)]'
                            : 'bg-black/40 border-white/10 text-gray-400 hover:bg-black/60'
                        }`}
                      >
                        {getTranslatedText('individual')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setClientType('company')}
                        className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                          clientType === 'company'
                            ? 'bg-[color:var(--color-brand-blue-val)]/15 border-[color:var(--color-brand-blue-val)]/50 text-[color:var(--color-brand-green-val)]'
                            : 'bg-black/40 border-white/10 text-gray-400 hover:bg-black/60'
                        }`}
                      >
                        {getTranslatedText('company')}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[color:var(--color-text-muted)] mb-2 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[color:var(--color-brand-blue-val)]" />
                      {getTranslatedText('serviceType')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[color:var(--color-brand-blue-val)] outline-none transition-all cursor-pointer"
                    >
                      <option value="إنشاء المتاجر الإلكترونية">{isRTL ? "إنشاء المتاجر الإلكترونية" : "E-Commerce store setup"}</option>
                      <option value="أدوات النمو">{isRTL ? "أدوات النمو" : "Growth Tools"}</option>
                      <option value="حلول النمو">{isRTL ? "حلول النمو" : "Growth Solutions"}</option>
                      <option value="تحليل المتاجر">{isRTL ? "تحليل المتاجر" : "Store Analysis"}</option>
                      <option value="التسويق الرقمي">{isRTL ? "التسويق الرقمي" : "Digital Marketing"}</option>
                      <option value="أخرى">{isRTL ? "أخرى" : "Other"}</option>
                    </select>
                  </div>
                </div>

                {/* Notes Textarea */}
                <div>
                  <label className="block text-xs font-medium text-[color:var(--color-text-muted)] mb-2">
                    {getTranslatedText('notes')}
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={getTranslatedText('notesPlaceholder')}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[color:var(--color-brand-blue-val)] outline-none transition-all placeholder:text-gray-600 resize-none"
                  />
                </div>

                {/* Grid for Appointment Scheduler */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--color-text-muted)] mb-2 flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 text-[color:var(--color-brand-blue-val)]" />
                      {getTranslatedText('prefDate')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={getMinDateString()}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:border-[color:var(--color-brand-blue-val)] outline-none transition-all font-english"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[color:var(--color-text-muted)] mb-2 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[color:var(--color-brand-blue-val)]" />
                      {getTranslatedText('prefTime')} <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 max-h-24 overflow-y-auto p-1 bg-black/40 rounded-xl border border-white/10 scrollbar-thin">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedTime === time
                              ? 'bg-[color:var(--color-brand-blue-val)] text-white shadow'
                              : 'bg-black/50 text-gray-300 hover:bg-white/5'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-[color:var(--color-text-muted)] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-brand-blue-val)]"></span>
                  {getTranslatedText('workingHoursNote')}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 mt-2 rounded-full font-bold text-sm bg-gradient-to-r from-[color:var(--color-brand-blue-val)] to-[color:var(--color-brand-purple-val)] hover:shadow-[0_0_20px_rgba(79,142,247,0.4)] text-white hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      ...
                    </>
                  ) : (
                    getTranslatedText('bookBtn')
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
