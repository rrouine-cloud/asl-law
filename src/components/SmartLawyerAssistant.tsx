import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Calendar,
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Clock, 
  ClipboardList,
  Bell,
  Scale,
  FileText,
  Gavel,
  Check,
  Loader2,
  RefreshCw,
  Download,
  X,
  Search,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Types ---
interface LegalDeadline {
  id: string;
  name: string;
  category: 'CIVIL' | 'CRIMINAL' | 'ADMIN' | 'COMMERCIAL' | 'CASSATION';
  days: number;
  description: string;
  isDaysFull?: boolean; // If true, "آجال كاملة" (don't count first and last day)
}

interface SavedCase {
  id: string;
  title: string;
  caseNumber: string;
  procedureType: string;
  specialty: string;
  notificationDate: string;
  deadlineDate: string;
  status: 'SAFE' | 'WARNING' | 'CRITICAL' | 'EXPIRED' | 'DONE';
  notifiedStages: string[]; // ['month', 'week', '72h', '24h']
}

const LEGAL_SPECIALTIES = [
  { id: 'civil', name: 'مدني' },
  { id: 'labor', name: 'شغل' },
  { id: 'real_estate', name: 'عقاري' },
  { id: 'criminal', name: 'جنائي' },
  { id: 'admin', name: 'إداري' },
  { id: 'commercial', name: 'تجاري' },
  { id: 'rentals', name: 'أكرية' },
  { id: 'family', name: 'أسري' },
  { id: 'other', name: 'غير ذلك' },
];

// --- Deadlines Database (Based on Moroccan Law) ---
const LEGAL_DEADLINES: LegalDeadline[] = [
  // --- المسطرة المدنية ---
  { id: 'cv-opposition', name: 'التعرض (مدني)', category: 'CIVIL', days: 15, description: 'تبدأ من تاريخ التبليغ (بالنسبة لأحكام الدرجة الأولى غير القابلة للاستئناف).' },
  { id: 'cv-appeal', name: 'الاستئناف العادي (مدني)', category: 'CIVIL', days: 30, description: 'الأجل العادي ويبدأ من تاريخ التبليغ.' },
  { id: 'cv-appeal-outside', name: 'الاستئناف (خارج المغرب)', category: 'CIVIL', days: 60, description: 'مضاعفة الأجل مرتين للأطراف المقيمين خارج المملكة المغربية.' },
  { id: 'cv-appeal-pause', name: 'توقف الأجل (وفاة/أهلية)', category: 'CIVIL', days: 15, description: 'الفترة التي يجب أن تمر بعد تبليغ الورثة قبل بدء سريان الأجل من جديد.' },
  { id: 'ca-cassation', name: 'النقض العادي (مدني)', category: 'CIVIL', days: 30, description: 'الأجل العادي للطعن بالنقض من تاريخ التبليغ.' },
  { id: 'ca-cassation-reduced', name: 'النقض المخفض', category: 'CIVIL', days: 15, description: 'في قضايا الأسرة، الجنسية، الانتخابات، القضايا الاجتماعية، والقضايا الاستعجالية.' },
  { id: 'ex-review', name: 'إعادة النظر (مدني)', category: 'CIVIL', days: 30, description: 'الأجل العادي من تاريخ التبليغ.' },
  { id: 'ex-review-fact', name: 'إعادة النظر (تزوير/تدليس)', category: 'CIVIL', days: 30, description: 'من تاريخ الإقرار بالزور أو اكتشاف التدليس أو المستندات الجديدة.' },
  { id: 'ex-review-cassation', name: 'إعادة النظر (قرارات النقض)', category: 'CIVIL', days: 365, description: 'الأجل العام لطلب إعادة النظر في قرارات محكمة النقض من تاريخ صدور القرار.' },
  { id: 'ex-third-party', name: 'تعرض الغير الخارج عن الخصومة', category: 'CIVIL', days: 365, description: 'تبتدئ من تاريخ صدور المقرر القضائي المطعون فيه.' },

  // --- المادة الإدارية ---
  { id: 'ad-annulment', name: 'دعوى الإلغاء (شطط)', category: 'ADMIN', days: 60, description: 'الأجل العام لرفع الدعوى، ويبدأ من تاريخ نشر القرار أو تبليغه.' },
  { id: 'ad-annulment-pre', name: 'دعوى الإلغاء (بعد التظلم)', category: 'ADMIN', days: 60, description: 'أجل جديد يبدأ بعد الرفض الصريح أو الضمني (مرور 60 يوماً على التظلم).' },
  { id: 'ad-damages', name: 'دعوى التعويض', category: 'ADMIN', days: 1825, description: '5 سنوات - أجل التقادم العام للمطالبة بالتعويض من تاريخ العلم بالضرر.' },
  { id: 'ad-tax-admin', name: 'تظلم ضريبي (إداري)', category: 'ADMIN', days: 63, description: 'الأجل المحدد لتقديم التظلم الإداري أمام الإدارة الضريبية.' },
  { id: 'ad-tax-court', name: 'طعن ضريبي (قضائي)', category: 'ADMIN', days: 60, description: 'أجل اللجوء إلى القضاء الإداري بعد صدور قرار رفض التظلم.' },
  { id: 'ad-appeal', name: 'استئناف إداري', category: 'ADMIN', days: 30, description: 'أجل استئناف الأحكام الصادرة عن المحاكم الإدارية من تاريخ التبليغ.' },

  // --- المادة التجارية ---
  { id: 'cm-appeal', name: 'الاستئناف التجاري', category: 'COMMERCIAL', days: 15, description: 'الأجل العام لاستئناف الأحكام الصادرة عن المحاكم التجارية.' },
  { id: 'cm-appeal-payment', name: 'استئناف (أمر بالأداء)', category: 'COMMERCIAL', days: 15, description: 'أجل استئناف الحكم الصادر في إطار التعرض على الأمر بالأداء.' },
  { id: 'cm-appeal-competence', name: 'استئناف (الاختصاص النوعي)', category: 'COMMERCIAL', days: 10, description: 'أجل استئناف الحكم المتعلق بالاختصاص النوعي.' },
  { id: 'cm-execution-warning', name: 'أجل الإعذار (تجاري)', category: 'COMMERCIAL', days: 10, description: 'الأجل الذي يمنحه عون التنفيذ للمنفذ عليه للوفاء.' },
  { id: 'cm-seizure-report', name: 'محضر الحجز التنفيذي', category: 'COMMERCIAL', days: 20, description: 'تبدأ بعد انقضاء أجل الإعذار (10 أيام).' },

  // --- المسطرة الجنائية ---
  { id: 'cr-opposition', name: 'التعرض (جنائي)', category: 'CRIMINAL', days: 10, description: 'أجل كامل. من تاريخ التبليغ للأوامر الغيابية.', isDaysFull: true },
  { id: 'cr-appeal', name: 'الاستئناف (جنائي)', category: 'CRIMINAL', days: 10, description: 'من تاريخ النطق بالحكم (حضوري) أو التبليغ (بمثابة حضوري).' },
  { id: 'cr-appeal-additional', name: 'استئناف (أطراف أخرى)', category: 'CRIMINAL', days: 5, description: 'أجل إضافي لباقي الأطراف في حال استأنف أحدهم.' },
  { id: 'cr-appeal-vocal', name: 'استئناف (الوكيل العام)', category: 'CRIMINAL', days: 60, description: 'أجل خاص للوكيل العام للملك للاستئناف.' },
  { id: 'cr-cassation', name: 'النقض (جنائي)', category: 'CRIMINAL', days: 10, description: 'أجل كامل. من يوم النطق أو التبليغ.', isDaysFull: true },
  { id: 'cr-transmission-prison', name: 'إرسال تصريح السجين', category: 'CRIMINAL', days: 1, description: 'الأجل الممنوح للمؤسسة السجنية لإرسال تصريح النقض (24 ساعة).' },
];

// --- Helper Functions ---
const MOROCCAN_HOLIDAYS = [
  '01-01', // New Year
  '01-11', // Manifesto
  '05-01', // Labor Day
  '07-30', // Throne Day
  '08-14', // Oued Ed-Dahab
  '08-20', // Revolution
  '08-21', // Youth Day
  '11-06', // Green March
  '11-18', // Independence Day
];

const isWeekend = (date: Date) => date.getDay() === 6 || date.getDay() === 0;

const isHoliday = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return MOROCCAN_HOLIDAYS.includes(`${month}-${day}`);
};

const calculateLegalDeadline = (startDateStr: string, days: number, isFull: boolean = false) => {
  let date = new Date(startDateStr);
  
  // In Moroccan Law, "أجل كامل" (Full Deadline) doesn't count the first day and the last day
  // If isFull is true, we add 1 day at the start. 
  // Then we add the specified days.
  // Then we check if the end date falls on a weekend or holiday to extend it.
  
  let resultDate = new Date(date);
  resultDate.setDate(resultDate.getDate() + days);

  // If it's a "Full Deadline", we effectively need one more day to ensure the "last day" is full
  if (isFull) {
    resultDate.setDate(resultDate.getDate() + 1);
  }

  // Extend if falls on holiday or weekend
  while (isWeekend(resultDate) || isHoliday(resultDate)) {
    resultDate.setDate(resultDate.getDate() + 1);
  }

  return resultDate;
};

const getStatus = (deadlineDateStr: string, isDone: boolean = false) => {
  if (isDone) return 'DONE';
  const now = new Date();
  const deadline = new Date(deadlineDateStr);
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'EXPIRED';
  if (diffDays <= 2) return 'CRITICAL';
  if (diffDays <= 7) return 'WARNING';
  return 'SAFE';
};

export default function SmartLawyerAssistant() {
  const [cases, setCases] = useState<SavedCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filterStatus, setFilterStatus] = useState<SavedCase['status'] | null>(null);
  const [filterSpecialty, setFilterSpecialty] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // New Case Form State
  const [title, setTitle] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [specialty, setSpecialty] = useState('civil');
  const [selectedProcedureId, setSelectedProcedureId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [calculatedDate, setCalculatedDate] = useState<Date | null>(null);

  // Calculate deadline when inputs change (Safe way)
  useEffect(() => {
    const procedure = LEGAL_DEADLINES.find(p => p.id === selectedProcedureId);
    if (procedure && startDate) {
      const d = calculateLegalDeadline(startDate, procedure.days, procedure.isDaysFull);
      setCalculatedDate(d);
    } else {
      setCalculatedDate(null);
    }
  }, [selectedProcedureId, startDate]);

  // Load Local Storage
  useEffect(() => {
    const saved = localStorage.getItem('advocate_cases');
    if (saved) setCases(JSON.parse(saved));
  }, []);

  // Save to Local Storage
  useEffect(() => {
    localStorage.setItem('advocate_cases', JSON.stringify(cases));
  }, [cases]);

  // Request Notification Permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  // Handle Notifications (Background job simulated with Effect)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Notification.permission !== 'granted') return;
      
      const now = new Date();
      // Deadlines (Cases) Notifications
      cases.forEach(c => {
        if (c.status === 'DONE' || c.status === 'EXPIRED') return;
        
        const deadline = new Date(c.deadlineDate);
        const diffHours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        let notificationContent = '';
        let stageKey = '';

        if (diffHours <= 24 && diffHours > 0 && !c.notifiedStages.includes('24h')) {
          notificationContent = `🚨 أجل عاجل جداً (24س): ينتهي أجل الملف "${c.title}" غداً!`;
          stageKey = '24h';
        } else if (diffHours <= 72 && diffHours > 24 && !c.notifiedStages.includes('72h')) {
          notificationContent = `⚠️ تنبيه (3 أيام): اقترب أجل الطعن في ملف "${c.title}".`;
          stageKey = '72h';
        } else if (diffHours <= 168 && diffHours > 72 && !c.notifiedStages.includes('week')) {
          notificationContent = `📅 تذكير أسبوعي: ملف "${c.title}" يتطلب الانتباه للأجل القادم.`;
          stageKey = 'week';
        }

        if (notificationContent && stageKey) {
          new Notification('مساعد المحامي: تنبيه آجال الطعون', { 
            body: notificationContent,
            tag: `deadline-${c.id}-${stageKey}`
          });
          
          setCases(prev => prev.map(item => item.id === c.id ? { ...item, notifiedStages: [...item.notifiedStages, stageKey] } : item));
        }
      });
    }, 60000); 
    return () => clearInterval(interval);
  }, [cases]);

  const handleSaveCase = async () => {
    if (!title || !selectedProcedureId || !calculatedDate) {
      alert("يرجى ملء جميع البيانات");
      return;
    }
    
    setLoading(true);
    const procedure = LEGAL_DEADLINES.find(p => p.id === selectedProcedureId);
    const newCaseData = {
      title,
      caseNumber,
      procedureType: procedure?.name || '',
      specialty,
      notificationDate: startDate,
      deadlineDate: calculatedDate.toISOString(),
      status: getStatus(calculatedDate.toISOString()),
      notifiedStages: [],
      updatedAt: new Date().toISOString()
    };

    if (editingId) {
      setCases(cases.map(c => c.id === editingId ? { ...c, ...newCaseData } as any : c));
    } else {
      const newCase: SavedCase = {
        id: Math.random().toString(36).substr(2, 9),
        ...newCaseData,
      } as any;
      setCases([newCase, ...cases]);
    }
      
    // Reset Form
    setTitle('');
    setCaseNumber('');
    setSelectedProcedureId('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setCalculatedDate(null);
    setEditingId(null);
    setLoading(false);
  };

  const deleteCase = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الملف؟")) {
      setCases(cases.filter(c => c.id !== id));
    }
  };

  const toggleDone = async (id: string) => {
    const c = cases.find(item => item.id === id);
    if (!c) return;

    const newStatus = c.status === 'DONE' ? getStatus(c.deadlineDate) : 'DONE';
    setCases(cases.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  const stats = useMemo(() => {
    return {
      safe: cases.filter(c => c.status === 'SAFE').length,
      warning: cases.filter(c => c.status === 'WARNING').length,
      critical: cases.filter(c => c.status === 'CRITICAL').length,
      expired: cases.filter(c => c.status === 'EXPIRED').length,
      done: cases.filter(c => c.status === 'DONE').length,
    };
  }, [cases]);

  const printReport = () => {
    window.print();
  };

  const startEdit = (c: SavedCase) => {
    setEditingId(c.id);
    setTitle(c.title);
    setCaseNumber(c.caseNumber);
    setSpecialty(c.specialty || 'civil');
    setStartDate(c.notificationDate);
    const proc = LEGAL_DEADLINES.find(p => p.name === c.procedureType);
    setSelectedProcedureId(proc?.id || '');
    // Scroll smoothly to form section on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCases = useMemo(() => {
    let result = cases;
    if (filterStatus) result = result.filter(c => c.status === filterStatus);
    if (filterSpecialty) result = result.filter(c => c.specialty === filterSpecialty);
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(term) || 
        c.caseNumber.toLowerCase().includes(term) || 
        c.procedureType.toLowerCase().includes(term)
      );
    }
    return result;
  }, [cases, filterStatus, filterSpecialty, searchTerm]);

  return (
    <div className="min-h-[90vh] bg-[#f8fafc] dark:bg-[#070d19] py-8 px-4 md:px-8 font-sans zellige-bg transition-colors duration-300" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* CSS custom variables for print & scroll */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            nav, .no-print, button, input, select, .tabs-container { display: none !important; }
            .print-only { display: block !important; }
            .bg-white, .dark\\:bg-\\[\\#0f1c30\\] { border: none !important; box-shadow: none !important; background: white !important; color: black !important; }
            body { background: white !important; padding: 0 !important; }
            .max-w-7xl { max-width: 100% !important; }
          }
          .print-only { display: none; }
        `}} />

        {/* --- Upper Professional Header --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-teal-50 dark:bg-teal-950/40 text-[var(--accent)] rounded-md font-bold text-[11px] tracking-wider flex items-center gap-1 border border-teal-200/50">
                <Sparkles className="w-3 h-3" />
                المساعد الرقمي المتقدم
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#0f2d59] dark:text-white mt-1.5 tracking-tight">
              مساعد الآجال والمدد القانونية
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-2xl">
              حساب ومراقبة آجال الطعن والتعرض طبقاً للمسطرة المدنية والجنائية المغربية مع مراعاة العطل والأعياد الوطنية.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={printReport}
              className="px-3.5 py-2 bg-white dark:bg-[#0f1c30] text-slate-700 dark:text-slate-200 rounded-lg font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
              طباعة جرد الآجال
            </button>
          </div>
        </div>

        {/* --- Bento Grid Stats Row (Quick Filters) --- */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 no-print">
          <button 
            onClick={() => setFilterStatus(filterStatus === 'DONE' ? null : 'DONE')}
            className={cn(
              "p-3 space-y-1 text-right transition-all duration-200 rounded-xl border cursor-pointer",
              filterStatus === 'DONE' 
                ? "bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200" 
                : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white leading-none">{stats.done}</div>
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">آجال مكتملة</div>
          </button>

          <button 
            onClick={() => setFilterStatus(filterStatus === 'SAFE' ? null : 'SAFE')}
            className={cn(
              "p-3 space-y-1 text-right transition-all duration-200 rounded-xl border cursor-pointer",
              filterStatus === 'SAFE' 
                ? "bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200" 
                : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 bg-teal-100 dark:bg-teal-950/40 text-[var(--accent)] rounded-lg flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white leading-none">{stats.safe}</div>
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">في أمان مريح</div>
          </button>

          <button 
            onClick={() => setFilterStatus(filterStatus === 'WARNING' ? null : 'WARNING')}
            className={cn(
              "p-3 space-y-1 text-right transition-all duration-200 rounded-xl border cursor-pointer",
              filterStatus === 'WARNING' 
                ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200" 
                : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white leading-none">{stats.warning}</div>
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">تنبيه متوسط</div>
          </button>

          <button 
            onClick={() => setFilterStatus(filterStatus === 'CRITICAL' ? null : 'CRITICAL')}
            className={cn(
              "p-3 space-y-1 text-right transition-all duration-200 rounded-xl border cursor-pointer",
              filterStatus === 'CRITICAL' 
                ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200" 
                : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-lg flex items-center justify-center">
                <Bell className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white leading-none">{stats.critical}</div>
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">آجال حرجة</div>
          </button>

          <button 
            onClick={() => setFilterStatus(filterStatus === 'EXPIRED' ? null : 'EXPIRED')}
            className={cn(
              "p-3 space-y-1 text-right transition-all duration-200 rounded-xl border cursor-pointer",
              filterStatus === 'EXPIRED' 
                ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100" 
                : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg flex items-center justify-center">
                <Trash2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white leading-none">{stats.expired}</div>
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">فوات الأجل</div>
          </button>
        </div>

        {/* --- Two-Column Layout --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start no-print">
          
          {/* RIGHT COLUMN: Interactive Calculator & Creator (Span 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-[var(--accent)] flex items-center justify-center shrink-0">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#0f2d59] dark:text-white">
                  {editingId ? 'تعديل بيانات الملف' : 'حاسبة الآجال وإضافة ملف'}
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">أدخل تفاصيل التبليغ لحساب تاريخ انتهاء الأجل</p>
              </div>
            </div>

            <div className="space-y-3 text-right">
              {/* Client / File Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <Plus className="w-3 h-3 text-[var(--accent)]" />
                  اسم الموكل / اسم الملف
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: ورثة أحمد التازي"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500 transition-colors placeholder:text-slate-400"
                />
              </div>

              {/* Case Number */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <ClipboardList className="w-3 h-3 text-[var(--accent)]" />
                  رقم الملف بالمحكمة
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: 2024/1203/45"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500 transition-colors placeholder:text-slate-400"
                />
              </div>

              {/* Specialty */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <Gavel className="w-3 h-3 text-[var(--accent)]" />
                  المادة / التخصص القضائي
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500 transition-colors cursor-pointer"
                >
                  {LEGAL_SPECIALTIES.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Procedure Selection grouped by category */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <Scale className="w-3 h-3 text-[var(--accent)]" />
                  نوع الطعن والمسطرة المعتمدة
                </label>
                <select
                  value={selectedProcedureId}
                  onChange={(e) => setSelectedProcedureId(e.target.value)}
                  className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500 transition-colors cursor-pointer"
                >
                  <option value="">-- اختر المسطرة القانونية --</option>
                  <optgroup label="المادة والمسطرة المدنية">
                    {LEGAL_DEADLINES.filter(p => p.category === 'CIVIL').map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.days} يوم)</option>
                    ))}
                  </optgroup>
                  <optgroup label="المادة الإدارية">
                    {LEGAL_DEADLINES.filter(p => p.category === 'ADMIN').map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.days} يوم)</option>
                    ))}
                  </optgroup>
                  <optgroup label="المادة التجارية">
                    {LEGAL_DEADLINES.filter(p => p.category === 'COMMERCIAL').map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.days} يوم)</option>
                    ))}
                  </optgroup>
                  <optgroup label="المادة والمسطرة الجنائية">
                    {LEGAL_DEADLINES.filter(p => p.category === 'CRIMINAL').map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.days} يوم)</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Start Notification Date */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[var(--accent)]" />
                  تاريخ التبليغ أو النطق بالقرار
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500 transition-colors cursor-pointer"
                />
              </div>
            </div>

            {/* Real-time calculated Result Box */}
            <AnimatePresence>
              {selectedProcedureId && startDate && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="p-3.5 bg-slate-900 text-white rounded-xl relative overflow-hidden shadow-2xs space-y-3 border-r-3 border-[var(--accent)]"
                >
                  <div className="space-y-1 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-slate-400 text-[10px] font-medium">
                        <Clock className="w-3 h-3 text-[var(--accent)]" />
                        الأجل المحتسب
                      </div>
                      {LEGAL_DEADLINES.find(p => p.id === selectedProcedureId)?.isDaysFull && (
                        <span className="px-1.5 py-0.5 bg-teal-500/20 text-teal-300 rounded text-[9px] font-bold">
                          آجال كاملة
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm font-bold tracking-tight text-white mt-0.5">
                      {calculatedDate ? calculatedDate.toLocaleDateString('ar-MA', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : ''}
                    </div>

                    <div className="text-[10px] text-slate-400 leading-relaxed pt-0.5">
                      {LEGAL_DEADLINES.find(p => p.id === selectedProcedureId)?.description}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button 
                      onClick={handleSaveCase}
                      disabled={loading || !title}
                      className="flex-1 px-3 py-2 bg-[var(--accent)] text-white rounded-lg font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                      {editingId ? 'تحديث الملف' : 'حفظ ومتابعة الأجل'}
                    </button>
                    {editingId && (
                      <button 
                        onClick={() => {
                          setEditingId(null);
                          setTitle('');
                          setCaseNumber('');
                          setSelectedProcedureId('');
                          setCalculatedDate(null);
                        }}
                        className="px-3 py-2 bg-white/10 text-white rounded-lg font-bold text-xs hover:bg-white/20 transition-all cursor-pointer"
                      >
                        إلغاء
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* LEFT COLUMN: List & Search & Tabs (Span 7) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Filter Tools Panel */}
            <div className="space-y-2.5">
              <div className="flex flex-col md:flex-row gap-2 items-center">
                
                {/* Search field */}
                <div className="relative w-full md:flex-1 flex items-center">
                  <input 
                    type="text" 
                    placeholder="بحث باسم الموكل، رقم الملف، أو نوع المسطرة..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 pr-9 pl-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl transition-all outline-none text-xs font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Reset Filters action */}
                {(filterStatus || filterSpecialty || searchTerm) && (
                  <button 
                    onClick={() => {
                      setFilterStatus(null);
                      setFilterSpecialty(null);
                      setSearchTerm('');
                    }}
                    className="w-full md:w-auto px-3 py-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-rose-100 transition-all shrink-0 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    إلغاء التصفية
                  </button>
                )}
              </div>

              {/* Specialty quick tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button 
                  onClick={() => setFilterSpecialty(null)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer",
                    !filterSpecialty 
                      ? "bg-[#0f2d59] text-white" 
                      : "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  )}
                >
                  الكل
                </button>
                {LEGAL_SPECIALTIES.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setFilterSpecialty(filterSpecialty === s.id ? null : s.id)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer",
                      filterSpecialty === s.id 
                        ? "bg-[#0f2d59] text-white" 
                        : "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Case List container */}
            <div className="space-y-2">
              {filteredCases.length === 0 ? (
                <div className="py-10 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                  <h3 className="font-bold text-xs text-slate-800 dark:text-white">لا توجد مواعيد آجال مسجلة</h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 max-w-xs mx-auto">
                    استخدم الحاسبة الجانبية لإضافة ملف جديد ومراقبة سريان أجله.
                  </p>
                </div>
              ) : (
                filteredCases.map(c => {
                  const now = new Date();
                  const dDate = new Date(c.deadlineDate);
                  const diffTime = dDate.getTime() - now.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  return (
                    <div 
                      key={c.id} 
                      className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 group transition-all"
                    >
                      <div className="space-y-1 flex-1 text-right min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-xs md:text-sm text-[#0f2d59] dark:text-white tracking-tight">
                            {c.title}
                          </h4>
                          <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-medium rounded">
                            {LEGAL_SPECIALTIES.find(s => s.id === c.specialty)?.name || 'عام'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-y-0.5 gap-x-3 text-[11px] text-slate-400 dark:text-slate-500">
                          <span className="flex items-center gap-1">
                            <ClipboardList className="w-3 h-3 opacity-60 text-slate-400" />
                            {c.caseNumber || 'بدون رقم'}
                          </span>
                          <span className="flex items-center gap-1 text-[var(--accent)] font-medium">
                            <Scale className="w-3 h-3 opacity-60" />
                            {c.procedureType}
                          </span>
                        </div>
                      </div>

                      {/* Middle Side: Days remaining */}
                      <div className="flex items-center gap-3 shrink-0 md:border-x md:border-slate-100 dark:md:border-slate-800 md:px-4">
                        <div className="text-right">
                          <div className="text-[9px] text-slate-400 font-medium">تاريخ الاستحقاق</div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 font-sans">
                            {dDate.toLocaleDateString('ar-MA')}
                          </div>
                          <div className="mt-0.5">
                            {c.status === 'DONE' ? (
                              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full">
                                مكتمل
                              </span>
                            ) : diffDays < 0 ? (
                              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-full">
                                منتهي منذ {-diffDays} يوم
                              </span>
                            ) : (
                              <span className={cn(
                                "px-2 py-0.5 text-[10px] font-bold rounded-full",
                                c.status === 'CRITICAL' ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400" :
                                c.status === 'WARNING' ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400" :
                                "bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400"
                              )}>
                                متبقي {diffDays} يوم
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
                        <button 
                          onClick={() => toggleDone(c.id)}
                          title={c.status === 'DONE' ? 'إعادة تنشيط الأجل' : 'تحديد كمنجز'}
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer",
                            c.status === 'DONE' 
                              ? "bg-emerald-600 text-white" 
                              : "bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700"
                          )}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        
                        <button 
                          onClick={() => startEdit(c)}
                          title="تعديل تفاصيل الملف"
                          className="w-8 h-8 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>

                        <button 
                          onClick={() => deleteCase(c.id)}
                          title="حذف الملف"
                          className="w-8 h-8 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* --- Print Mode Only Section --- */}
        <div className="print-only" dir="rtl">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '26pt', fontWeight: 'bold', color: '#0f2d59' }}>جرد آجال الملفات والمواعيد القانونية</h1>
            <p style={{ fontSize: '12pt', color: '#666', marginTop: '10px' }}>تقرير مستخرج بتاريخ: {new Date().toLocaleDateString('ar-MA')}</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f2d59', color: 'white' }}>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>اسم الملف / الموكل</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>رقم الملف</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>نوع المسطرة</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>تاريخ الاستحقاق</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>الحالة الحالية</th>
              </tr>
            </thead>
            <tbody>
              {(cases || []).map(c => (
                <tr key={c.id}>
                  <td style={{ border: '1px solid #ddd', padding: '10px', fontWeight: 'bold' }}>{c.title}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>{c.caseNumber}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', color: '#0f766e' }}>{c.procedureType}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', fontWeight: 'bold' }}>{new Date(c.deadlineDate).toLocaleDateString('ar-MA')}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                    {c.status === 'SAFE' ? 'في أمان مريح' : 
                     c.status === 'WARNING' ? 'تنبيه متوسط' : 
                     c.status === 'CRITICAL' ? 'حرج جداً' : 
                     c.status === 'EXPIRED' ? 'فوات الأجل' : 'مكتمل ومُنجز'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '50px', fontSize: '10pt', color: '#888', fontStyle: 'italic', textAlign: 'center' }}>
            * هذا التقرير مستخرج بشكل رسمي وآمن محلياً من "اسأل القانون - المنصة الرقمية المغربية".
          </div>
        </div>

      </div>
    </div>
  );
}
