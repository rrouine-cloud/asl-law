import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Calendar, 
  Coins, 
  UserCheck, 
  AlertTriangle, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Scale,
  FileText,
  Clock,
  History
} from 'lucide-react';
import { cn } from '../lib/utils';

type ContractType = 'CDD' | 'CDI';
type Status = 'executive' | 'worker';
type TerminationReason = 'dismissal' | 'resignation' | 'retirement' | 'end_of_contract';

interface CalculationResult {
  noticePeriod: { amount: number; duration: string; law: string };
  severance: { amount: number; hours: number; law: string };
  damages: { amount: number; months: number; law: string };
  unemployment: { amount: number; duration: string; law: string };
  cddCompensation?: { amount: number; months: number; law: string };
  unusedLeave: { amount: number; days: number; law: string };
  unpaidDays: { amount: number; days: number; law: string };
  overtime: { amount: number; hours: number; law: string };
  holidayCompensation: { amount: number; days: number; law: string };
  certificateCompensation: { amount: number; law: string };
  isAbusive: boolean;
  total: number;
}

export default function LaborCompensation() {
  const [step, setStep] = useState(() => Number(localStorage.getItem('labor_step')) || 1);
  const [contractType, setContractType] = useState<ContractType>(() => (localStorage.getItem('labor_contractType') as ContractType) || 'CDI');
  const [status, setStatus] = useState<Status>(() => (localStorage.getItem('labor_status') as Status) || 'worker');
  const [terminationReason, setTerminationReason] = useState<TerminationReason>(() => (localStorage.getItem('labor_terminationReason') as TerminationReason) || 'dismissal');
  
  // Dates & Salary
  const [startDate, setStartDate] = useState(() => localStorage.getItem('labor_startDate') || '');
  const [endDate, setEndDate] = useState(() => localStorage.getItem('labor_endDate') || '');
  const [cddEndDate, setCddEndDate] = useState(() => localStorage.getItem('labor_cddEndDate') || '');
  const [salary, setSalary] = useState<number>(() => Number(localStorage.getItem('labor_salary')) || 0);
  
  // Dismissal Details
  const [isSeriousMisconduct, setIsSeriousMisconduct] = useState(() => localStorage.getItem('labor_isSeriousMisconduct') === 'true');
  const [selectedMisconducts, setSelectedMisconducts] = useState<string[]>(() => JSON.parse(localStorage.getItem('labor_selectedMisconducts') || '[]'));
  const [isEmployerSeriousMisconduct, setIsEmployerSeriousMisconduct] = useState(() => localStorage.getItem('labor_isEmployerSeriousMisconduct') === 'true');
  const [isAbusiveReason, setIsAbusiveReason] = useState(() => localStorage.getItem('labor_isAbusiveReason') === 'true');
  const [selectedAbusiveReasons, setSelectedAbusiveReasons] = useState<string[]>(() => JSON.parse(localStorage.getItem('labor_selectedAbusiveReasons') || '[]'));
  const [wasProcedureFollowed, setWasProcedureFollowed] = useState(() => localStorage.getItem('labor_wasProcedureFollowed') !== 'false');
  
  // Special Status
  const [isStaffDelegate, setIsStaffDelegate] = useState(() => localStorage.getItem('labor_isStaffDelegate') === 'true');
  const [hasCnss, setHasCnss] = useState(() => localStorage.getItem('labor_hasCnss') === 'true');

  // Additional Compensations
  const [unusedLeaveDays, setUnusedLeaveDays] = useState<number>(() => Number(localStorage.getItem('labor_unusedLeaveDays')) || 0);
  const [unpaidWorkDays, setUnpaidWorkDays] = useState<number>(() => Number(localStorage.getItem('labor_unpaidWorkDays')) || 0);
  const [overtimeHours, setOvertimeHours] = useState<number>(() => Number(localStorage.getItem('labor_overtimeHours')) || 0);
  const [workedHolidaysDays, setWorkedHolidaysDays] = useState<number>(() => Number(localStorage.getItem('labor_workedHolidaysDays')) || 0);
  const [hasNoWorkCertificate, setHasNoWorkCertificate] = useState(() => localStorage.getItem('labor_hasNoWorkCertificate') === 'true');
  const [smigDifference, setSmigDifference] = useState<number>(() => Number(localStorage.getItem('labor_smigDifference')) || 0);
  const [isMaternityClaim, setIsMaternityClaim] = useState(() => localStorage.getItem('labor_isMaternityClaim') === 'true');
  
  const [result, setResult] = useState<CalculationResult | null>(() => {
    const saved = localStorage.getItem('labor_result');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('labor_step', step.toString());
    localStorage.setItem('labor_contractType', contractType);
    localStorage.setItem('labor_status', status);
    localStorage.setItem('labor_terminationReason', terminationReason);
    localStorage.setItem('labor_startDate', startDate);
    localStorage.setItem('labor_endDate', endDate);
    localStorage.setItem('labor_cddEndDate', cddEndDate);
    localStorage.setItem('labor_salary', salary.toString());
    localStorage.setItem('labor_isSeriousMisconduct', isSeriousMisconduct.toString());
    localStorage.setItem('labor_selectedMisconducts', JSON.stringify(selectedMisconducts));
    localStorage.setItem('labor_isEmployerSeriousMisconduct', isEmployerSeriousMisconduct.toString());
    localStorage.setItem('labor_isAbusiveReason', isAbusiveReason.toString());
    localStorage.setItem('labor_selectedAbusiveReasons', JSON.stringify(selectedAbusiveReasons));
    localStorage.setItem('labor_wasProcedureFollowed', wasProcedureFollowed.toString());
    localStorage.setItem('labor_isStaffDelegate', isStaffDelegate.toString());
    localStorage.setItem('labor_hasCnss', hasCnss.toString());
    localStorage.setItem('labor_unusedLeaveDays', unusedLeaveDays.toString());
    localStorage.setItem('labor_unpaidWorkDays', unpaidWorkDays.toString());
    localStorage.setItem('labor_overtimeHours', overtimeHours.toString());
    localStorage.setItem('labor_workedHolidaysDays', workedHolidaysDays.toString());
    localStorage.setItem('labor_hasNoWorkCertificate', hasNoWorkCertificate.toString());
    localStorage.setItem('labor_smigDifference', smigDifference.toString());
    localStorage.setItem('labor_isMaternityClaim', isMaternityClaim.toString());
    localStorage.setItem('labor_result', JSON.stringify(result));
  }, [
    step, contractType, status, terminationReason, startDate, endDate, cddEndDate, salary,
    isSeriousMisconduct, selectedMisconducts, isEmployerSeriousMisconduct, isAbusiveReason,
    selectedAbusiveReasons, wasProcedureFollowed, isStaffDelegate, hasCnss, unusedLeaveDays,
    unpaidWorkDays, overtimeHours, workedHolidaysDays, hasNoWorkCertificate, smigDifference,
    isMaternityClaim, result
  ]);

  const downloadAsText = () => {
    if (!result) return;
    
    let text = `تقرير تقدير تعويضات الشغل\n`;
    text += `==========================\n\n`;
    text += `نوع العقد: ${contractType === 'CDD' ? 'محدد المدة' : 'غير محدد المدة'}\n`;
    text += `الصفة: ${status === 'executive' ? 'إطار' : 'عامل/مستخدم'}\n`;
    text += `الأجر الشهري: ${salary} درهم\n`;
    text += `تاريخ البداية: ${startDate}\n`;
    text += `تاريخ النهاية: ${endDate}\n\n`;
    text += `التعويضات المستحقة:\n`;
    if (result.noticePeriod.amount > 0) text += `- أجل الإخطار: ${result.noticePeriod.amount} درهم\n`;
    if (result.severance.amount > 0) text += `- الأقدمية: ${result.severance.amount} درهم\n`;
    if (result.damages.amount > 0) text += `- الضرر: ${result.damages.amount} درهم\n`;
    if (result.unusedLeave.amount > 0) text += `- العطلة السنوية: ${result.unusedLeave.amount} درهم\n`;
    if (result.unpaidDays.amount > 0) text += `- أيام غير مدفوعة: ${result.unpaidDays.amount} درهم\n`;
    if (result.overtime.amount > 0) text += `- الساعات الإضافية: ${result.overtime.amount} درهم\n`;
    if (result.holidayCompensation.amount > 0) text += `- الأعياد والراحة: ${result.holidayCompensation.amount} درهم\n`;
    if (result.certificateCompensation.amount > 0) text += `- شهادة الشغل: ${result.certificateCompensation.amount} درهم\n`;
    
    text += `\nالمجموع التقديري: ${result.total} درهم\n\n`;
    text += `ملاحظة: هذه النتائج تقديرية بناءً على مدونة الشغل المغربية.`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `تقرير_تعويضات_${new Date().getTime()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const misconductOptions = [
    "السرقة أو خيانة الأمانة",
    "السكر العلني أو تعاطي المخدرات",
    "الاعتداء بالضرب أو السب الفادح",
    "إفشاء سر مهني نتج عنه ضرر",
    "التحريض على الفساد",
    "رفض إنجاز شغل من اختصاصه عمداً",
    "تغيب غير مبرر لأكثر من 4 أيام أو 8 أنصاف أيام في السنة",
    "إلحاق ضرر جسيم بالتجهيزات أو الآلات"
  ];

  const abusiveReasonOptions = [
    "الانتماء النقابي أو ممارسة أنشطة نقابية",
    "الترشح لمهمة مندوب الأجراء",
    "تقديم شكوى ضد المشغل",
    "العرق أو اللون أو الجنس أو الحالة العائلية",
    "الإعاقة أو الدين أو الرأي السياسي"
  ];

  const calculateSeniority = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    let years = e.getFullYear() - s.getFullYear();
    let months = e.getMonth() - s.getMonth();
    if (months < 0 || (months === 0 && e.getDate() < s.getDate())) {
      years--;
      months += 12;
    }
    // Article 54: Include fractions of years
    return { years, months, totalYears: years + (months / 12) };
  };

  const handleCalculate = () => {
    if (!startDate || !endDate || salary <= 0) return;

    const seniority = calculateSeniority(startDate, endDate);
    // Article 55: The basic salary is the average of the last 52 weeks or 12 months
    const hourlyWage = salary / 191; 
    const dailyWage = salary / 26;
    
    let res: CalculationResult = {
      noticePeriod: { amount: 0, duration: '', law: '' },
      severance: { amount: 0, hours: 0, law: '' },
      damages: { amount: 0, months: 0, law: '' },
      unemployment: { amount: 0, duration: '', law: '' },
      unusedLeave: { amount: 0, days: 0, law: '' },
      unpaidDays: { amount: 0, days: 0, law: '' },
      overtime: { amount: 0, hours: 0, law: '' },
      holidayCompensation: { amount: 0, days: 0, law: '' },
      certificateCompensation: { amount: 0, law: '' },
      isAbusive: false,
      total: 0
    };

    // Article 40: Employer's serious misconduct = Abusive dismissal
    const effectiveDismissal = terminationReason === 'dismissal' || isEmployerSeriousMisconduct;
    
    // Abusive if:
    // 1. Procedure not followed (Art 62)
    // 2. Reason is discriminatory (Art 36)
    // 3. No serious misconduct and no valid reason (Art 33/41)
    // 4. Employer committed serious misconduct (Art 40)
    const isAbusive = effectiveDismissal && (
      isAbusiveReason || 
      !wasProcedureFollowed || 
      isEmployerSeriousMisconduct ||
      (!isSeriousMisconduct && terminationReason === 'dismissal')
    );
    
    res.isAbusive = isAbusive;

    if (contractType === 'CDD') {
      // Article 33: CDD termination
      if (cddEndDate && !isSeriousMisconduct && terminationReason !== 'resignation') {
        const remaining = calculateSeniority(endDate, cddEndDate);
        const months = Math.max(0, remaining.totalYears * 12);
        res.cddCompensation = {
          amount: months * salary,
          months: Math.round(months),
          law: 'الفصل 33: في حالة إنهاء العقد محدد المدة قبل أوانه، يستحق الأجير تعويضاً يعادل مبلغ الأجور المستحقة عن الفترة المتبقية.'
        };
        res.total = res.cddCompensation.amount;
      }
    } else {
      // CDI Logic
      // 1. Notice Period (Article 43, 51)
      // Note: Not paid if serious misconduct (Art 61)
      if (effectiveDismissal && !isSeriousMisconduct) {
        let noticeMonths = 0;
        let noticeLabel = '';
        if (status === 'executive') {
          if (seniority.totalYears < 1) { noticeMonths = 1; noticeLabel = 'شهر واحد'; }
          else if (seniority.totalYears < 5) { noticeMonths = 2; noticeLabel = 'شهران'; }
          else { noticeMonths = 3; noticeLabel = '3 أشهر'; }
        } else {
          if (seniority.totalYears < 1) { noticeMonths = 8/26; noticeLabel = '8 أيام'; }
          else if (seniority.totalYears < 5) { noticeMonths = 1; noticeLabel = 'شهر واحد'; }
          else { noticeMonths = 2; noticeLabel = 'شهران'; }
        }
        res.noticePeriod = {
          amount: noticeMonths * salary,
          duration: noticeLabel,
          law: 'الفصل 51: يترتب عن إنهاء العقد دون أجل إخطار أداء تعويض يعادل الأجر الذي كان سيتقاضاه الأجير لو استمر في شغله.'
        };
      }

      // 2. Severance Pay (Article 52, 53)
      // Note: Not paid if serious misconduct (Art 61)
      if (effectiveDismissal && !isSeriousMisconduct && seniority.totalYears >= 0.5) {
        let totalHours = 0;
        const years = seniority.totalYears;
        
        totalHours += Math.min(5, years) * 96;
        if (years > 5) totalHours += Math.min(5, years - 5) * 144;
        if (years > 10) totalHours += Math.min(5, years - 10) * 192;
        if (years > 15) totalHours += (years - 15) * 240;

        // Article 58: 100% increase for delegates
        if (isStaffDelegate) totalHours *= 2;

        res.severance = {
          amount: totalHours * (salary / 191),
          hours: Math.round(totalHours),
          law: `الفصل 52-53: يستحق الأجير تعويضاً عن الأقدمية بعد 6 أشهر من الشغل. ${isStaffDelegate ? 'يضاعف التعويض بنسبة 100% لكونك مندوب أجراء (الفصل 58).' : ''}`
        };
      }

      // 3. Damages (Article 41)
      if (isAbusive) {
        const damageMonths = Math.min(36, 1.5 * seniority.totalYears);
        res.damages = {
          amount: damageMonths * salary,
          months: Number((damageMonths || 0).toFixed(2)),
          law: 'الفصل 41: في حالة الفصل التعسفي، يحدد مبلغ التعويض عن الضرر على أساس أجر شهر ونصف عن كل سنة عمل أو جزء من السنة، بسقف 36 شهراً.'
        };
      }

      // 4. Unemployment (Article 59)
      if (hasCnss && effectiveDismissal) {
        const smig = 3120;
        const unempAmount = Math.min(smig, salary * 0.7);
        res.unemployment = {
          amount: unempAmount * 6,
          duration: '6 أشهر',
          law: 'الفصل 59: يستفيد الأجير المفصول من التعويض عن فقدان الشغل وفق القوانين الجاري بها العمل.'
        };
      }

      res.total = res.noticePeriod.amount + res.severance.amount + res.damages.amount;
    }

    // Common Additional Compensations
    // 1. Unused Leave (Articles 252, 254)
    if (unusedLeaveDays > 0) {
      res.unusedLeave = {
        amount: unusedLeaveDays * dailyWage,
        days: unusedLeaveDays,
        law: 'الفصل 252-254: يستحق الأجير عند إنهاء عقد شغله تعويضاً عن عدم التمتع بالعطلة السنوية المؤدى عنها أياً كانت أسباب إنهاء العقد.'
      };
    }

    // 2. Unpaid Days
    if (unpaidWorkDays > 0) {
      res.unpaidDays = {
        amount: unpaidWorkDays * dailyWage,
        days: unpaidWorkDays,
        law: 'الأجور المستحقة عن أيام العمل الفعلية التي لم يتم صرفها بعد.'
      };
    }

    // 3. Overtime (Article 198)
    if (overtimeHours > 0) {
      // Simplification: 25% increase for standard overtime
      res.overtime = {
        amount: overtimeHours * hourlyWage * 1.25,
        hours: overtimeHours,
        law: 'الفصل 198: الساعات الإضافية تمنح الحق في زيادة في الأجر (25% كحد أدنى حسب المقتضيات القانونية).'
      };
    }

    // 4. Holiday/Rest Day Compensation
    if (workedHolidaysDays > 0) {
      res.holidayCompensation = {
        amount: workedHolidaysDays * dailyWage * 2, // Double pay for holidays
        days: workedHolidaysDays,
        law: 'التعويض عن اشتغال أيام الأعياد والراحة الأسبوعية (زيادة 100%).'
      };
    }

    // 5. Work Certificate (Article 72)
    if (hasNoWorkCertificate) {
      res.certificateCompensation = {
        amount: salary * 0.5, // Estimated penalty/compensation
        law: 'الفصل 72: يجب على المشغل تسليم شهادة الشغل للأجير تحت طائلة التعويض.'
      };
    }

    // 6. SMIG Difference & Maternity
    let otherTotal = smigDifference;
    if (isMaternityClaim) otherTotal += salary * 0.5; // Placeholder for maternity claim

    res.total += res.unusedLeave.amount + res.unpaidDays.amount + res.overtime.amount + res.holidayCompensation.amount + res.certificateCompensation.amount + otherTotal;

    // Save for Legal Advisor
    localStorage.setItem('labor_calc_result', JSON.stringify({
      contractType,
      status,
      salary,
      startDate,
      endDate,
      terminationReason,
      isAbusive: res.isAbusive,
      total: res.total,
      breakdown: {
        notice: res.noticePeriod.amount,
        severance: res.severance.amount,
        damages: res.damages.amount,
        unusedLeave: res.unusedLeave.amount,
        unpaidDays: res.unpaidDays.amount,
        overtime: res.overtime.amount,
        holidays: res.holidayCompensation.amount,
        certificate: res.certificateCompensation.amount
      }
    }));

    setResult(res);
    setStep(5);
  };

  const toggleMisconduct = (m: string) => {
    setSelectedMisconducts(prev => 
      prev.includes(m) ? prev.filter(i => i !== m) : [...prev, m]
    );
  };

  const toggleAbusiveReason = (r: string) => {
    setSelectedAbusiveReasons(prev => 
      prev.includes(r) ? prev.filter(i => i !== r) : [...prev, r]
    );
  };

  return (
    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden" dir="rtl">
      {/* Progress Bar */}
      <div className="h-2 bg-slate-100 flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i}
            className={cn(
              "flex-1 transition-all duration-500",
              step >= i ? "bg-amber-500" : "bg-transparent"
            )}
          />
        ))}
      </div>

      <div className="p-6 md:p-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">المعلومات الأساسية</h2>
                <p className="text-slate-500">حدد نوع العقد وصفتك المهنية للبدء.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">نوع عقد الشغل (الفصل 16)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setContractType('CDI')}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all text-center",
                        contractType === 'CDI' ? "border-amber-500 bg-amber-50" : "border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <div className="font-bold mb-1">غير محدد المدة</div>
                      <div className="text-xs text-slate-400">CDI</div>
                    </button>
                    <button
                      onClick={() => setContractType('CDD')}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all text-center",
                        contractType === 'CDD' ? "border-amber-500 bg-amber-50" : "border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <div className="font-bold mb-1">محدد المدة</div>
                      <div className="text-xs text-slate-400">CDD</div>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">الصفة المهنية</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setStatus('worker')}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all text-center",
                        status === 'worker' ? "border-amber-500 bg-amber-50" : "border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <div className="font-bold mb-1">عامل / مستخدم</div>
                    </button>
                    <button
                      onClick={() => setStatus('executive')}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all text-center",
                        status === 'executive' ? "border-amber-500 bg-amber-50" : "border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <div className="font-bold mb-1">إطار (Cadre)</div>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
              >
                المتابعة
                <ChevronLeft className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">التواريخ والأجر</h2>
                <p className="text-slate-500">الأقدمية تحسب من تاريخ بداية العمل الفعلي (الفصل 54).</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">تاريخ بداية العمل</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">تاريخ التوقف عن العمل</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  />
                </div>

                {contractType === 'CDD' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">تاريخ انتهاء العقد (الأجل)</label>
                    <input
                      type="date"
                      value={cddEndDate}
                      onChange={(e) => setCddEndDate(e.target.value)}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">معدل الأجر الشهري (الفصل 55-57)</label>
                  <input
                    type="number"
                    value={salary || ''}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    placeholder="الأجر الأساسي + التوابع"
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">السابق</button>
                <button onClick={() => setStep(3)} disabled={!startDate || !endDate || salary <= 0} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold">المتابعة</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">سبب إنهاء العلاقة (الفصل 33-40)</h2>
                <p className="text-slate-500">كيف انتهت علاقة الشغل؟</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'dismissal', label: 'فصل من طرف المشغل', desc: 'المشغل هو من قرر إنهاء العقد' },
                  { id: 'resignation', label: 'استقالة إرادية', desc: 'الأجير قرر المغادرة طواعية' },
                  { id: 'retirement', label: 'بلوغ سن التقاعد', desc: 'الوصول للسن القانوني للتقاعد' },
                  { id: 'end_of_contract', label: 'انتهاء مدة العقد', desc: 'حلول الأجل المتفق عليه في عقد CDD' }
                ].map((reason) => (
                  <button
                    key={reason.id}
                    onClick={() => setTerminationReason(reason.id as TerminationReason)}
                    className={cn(
                      "p-6 rounded-2xl border-2 transition-all text-right",
                      terminationReason === reason.id ? "border-amber-500 bg-amber-50" : "border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className="font-bold text-slate-900">{reason.label}</div>
                    <div className="text-sm text-slate-500">{reason.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">السابق</button>
                <button onClick={() => setStep(4)} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold">المتابعة</button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">تفاصيل إضافية (الضمانات القانونية)</h2>
                <p className="text-slate-500">يرجى الإجابة بدقة لتحديد الطابع التعسفي للفصل من عدمه.</p>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto px-2">
                {terminationReason === 'dismissal' && (
                  <>
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-4 border border-slate-100">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={isSeriousMisconduct} onChange={e => setIsSeriousMisconduct(e.target.checked)} className="w-5 h-5 accent-amber-500" />
                        <span className="font-bold text-slate-700">هل ارتكبت "خطأ جسيماً"؟ (الفصل 39)</span>
                      </label>
                      {isSeriousMisconduct && (
                        <div className="mr-8 space-y-2">
                          <p className="text-xs text-slate-500 mb-2">اختر الأخطاء المرتكبة (إن وجدت):</p>
                          {misconductOptions.map(m => (
                            <label key={m} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                              <input type="checkbox" checked={selectedMisconducts.includes(m)} onChange={() => toggleMisconduct(m)} className="w-4 h-4" />
                              {m}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl space-y-4 border border-slate-100">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={!wasProcedureFollowed} onChange={e => setWasProcedureFollowed(!e.target.checked)} className="w-5 h-5 accent-amber-500" />
                        <span className="font-bold text-slate-700">هل تم الفصل دون جلسة استماع؟ (الفصل 62)</span>
                      </label>
                      <p className="text-xs text-slate-500 mr-8">الفصل 62 يوجب إتاحة الفرصة للأجير للدفاع عن نفسه بحضور مندوب الأجراء.</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl space-y-4 border border-slate-100">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={isAbusiveReason} onChange={e => setIsAbusiveReason(e.target.checked)} className="w-5 h-5 accent-amber-500" />
                        <span className="font-bold text-slate-700">هل السبب تمييزي أو غير مشروع؟ (الفصل 36)</span>
                      </label>
                      {isAbusiveReason && (
                        <div className="mr-8 space-y-2">
                          <p className="text-xs text-slate-500 mb-2">اختر السبب (الفصل 36 يمنع الفصل لهذه الأسباب):</p>
                          {abusiveReasonOptions.map(r => (
                            <label key={r} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                              <input type="checkbox" checked={selectedAbusiveReasons.includes(r)} onChange={() => toggleAbusiveReason(r)} className="w-4 h-4" />
                              {r}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="p-4 bg-slate-50 rounded-2xl space-y-4 border border-slate-100">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={isEmployerSeriousMisconduct} onChange={e => setIsEmployerSeriousMisconduct(e.target.checked)} className="w-5 h-5 accent-amber-500" />
                    <span className="font-bold text-slate-700">هل غادرت بسبب خطأ جسيم للمشغل؟ (الفصل 40)</span>
                  </label>
                  <p className="text-xs text-slate-500 mr-8">مثل: السب الفادح، العنف، التحرش الجنسي، التحريض على الفساد.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl space-y-4 border border-slate-100">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={isStaffDelegate} onChange={e => setIsStaffDelegate(e.target.checked)} className="w-5 h-5 accent-amber-500" />
                    <span className="font-bold text-slate-700">هل أنت مندوب أجراء أو ممثل نقابي؟ (الفصل 58)</span>
                  </label>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl space-y-4 border border-slate-100">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={hasCnss} onChange={e => setHasCnss(e.target.checked)} className="w-5 h-5 accent-amber-500" />
                    <span className="font-bold text-slate-700">هل أنت مسجل في الضمان الاجتماعي؟</span>
                  </label>
                </div>

                {/* New Additional Compensation Fields */}
                <div className="p-6 bg-amber-50/50 rounded-2xl space-y-6 border border-amber-100">
                  <h3 className="font-bold text-amber-900 flex items-center gap-2">
                    <Coins className="w-5 h-5" />
                    مستحقات إضافية (اختياري)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-600">أيام الإجازة غير المستعملة (م 252)</label>
                      <input 
                        type="number" 
                        value={unusedLeaveDays || ''} 
                        onChange={e => setUnusedLeaveDays(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-600">أيام عمل لم تتقاضَ أجرها</label>
                      <input 
                        type="number" 
                        value={unpaidWorkDays || ''} 
                        onChange={e => setUnpaidWorkDays(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-600">ساعات إضافية غير مدفوعة (م 198)</label>
                      <input 
                        type="number" 
                        value={overtimeHours || ''} 
                        onChange={e => setOvertimeHours(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-600">أيام عمل في الأعياد/الراحة</label>
                      <input 
                        type="number" 
                        value={workedHolidaysDays || ''} 
                        onChange={e => setWorkedHolidaysDays(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer text-sm">
                      <input type="checkbox" checked={hasNoWorkCertificate} onChange={e => setHasNoWorkCertificate(e.target.checked)} className="w-4 h-4 accent-amber-500" />
                      <span>لم أتسلم شهادة الشغل (الفصل 72)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer text-sm">
                      <input type="checkbox" checked={isMaternityClaim} onChange={e => setIsMaternityClaim(e.target.checked)} className="w-4 h-4 accent-amber-500" />
                      <span>تعويض عن إجازة الولادة (الفصل 270)</span>
                    </label>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-600">فروقات الأجر/الأقدمية (م 350، 356)</label>
                      <input 
                        type="number" 
                        value={smigDifference || ''} 
                        onChange={e => setSmigDifference(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                        placeholder="المبلغ الإجمالي للفوارق"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(3)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">السابق</button>
                <button onClick={handleCalculate} className="flex-[2] py-4 bg-amber-600 text-white rounded-2xl font-bold">حساب النتائج</button>
              </div>
            </motion.div>
          )}


          {step === 5 && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4",
                  result.isAbusive ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
                )}>
                  <Scale className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">
                  {result.isAbusive ? "فصل تعسفي محتمل" : "إنهاء قانوني للعقد"}
                </h2>
                <p className="text-slate-500">تفصيل التعويضات المستحقة وفق مدونة الشغل.</p>
              </div>

              <div className="space-y-4">
                {result.noticePeriod.amount > 0 && (
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>التعويض عن أجل الإخطار ({result.noticePeriod.duration})</span>
                      <span className="text-blue-600">{result.noticePeriod.amount.toLocaleString()} درهم</span>
                    </div>
                    <p className="text-xs text-slate-500">{result.noticePeriod.law}</p>
                  </div>
                )}

                {result.severance.amount > 0 && (
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>التعويض عن الفصل ({result.severance.hours} ساعة)</span>
                      <span className="text-emerald-600">{result.severance.amount.toLocaleString()} درهم</span>
                    </div>
                    <p className="text-xs text-slate-500">{result.severance.law}</p>
                  </div>
                )}

                {result.damages.amount > 0 && (
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>التعويض عن الضرر ({result.damages.months} شهر)</span>
                      <span className="text-purple-600">{result.damages.amount.toLocaleString()} درهم</span>
                    </div>
                    <p className="text-xs text-slate-500">{result.damages.law}</p>
                  </div>
                )}

                {result.cddCompensation && (
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>تعويض الفترة المتبقية ({result.cddCompensation.months} شهر)</span>
                      <span className="text-amber-600">{result.cddCompensation.amount.toLocaleString()} درهم</span>
                    </div>
                    <p className="text-xs text-slate-500">{result.cddCompensation.law}</p>
                  </div>
                )}

                {result.unemployment.amount > 0 && (
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>تعويض فقدان الشغل (CNSS)</span>
                      <span className="text-indigo-600">{result.unemployment.amount.toLocaleString()} درهم</span>
                    </div>
                    <p className="text-xs text-slate-500">{result.unemployment.law}</p>
                  </div>
                )}

                {result.unusedLeave.amount > 0 && (
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>التعويض عن العطلة السنوية ({result.unusedLeave.days} يوم)</span>
                      <span className="text-amber-600">{result.unusedLeave.amount.toLocaleString()} درهم</span>
                    </div>
                    <p className="text-xs text-slate-500">{result.unusedLeave.law}</p>
                  </div>
                )}

                {result.unpaidDays.amount > 0 && (
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>أيام عمل غير مدفوعة ({result.unpaidDays.days} يوم)</span>
                      <span className="text-slate-600">{result.unpaidDays.amount.toLocaleString()} درهم</span>
                    </div>
                    <p className="text-xs text-slate-500">{result.unpaidDays.law}</p>
                  </div>
                )}

                {result.overtime.amount > 0 && (
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>الساعات الإضافية ({result.overtime.hours} ساعة)</span>
                      <span className="text-orange-600">{result.overtime.amount.toLocaleString()} درهم</span>
                    </div>
                    <p className="text-xs text-slate-500">{result.overtime.law}</p>
                  </div>
                )}

                {result.holidayCompensation.amount > 0 && (
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>العمل في الأعياد/الراحة ({result.holidayCompensation.days} يوم)</span>
                      <span className="text-red-600">{result.holidayCompensation.amount.toLocaleString()} درهم</span>
                    </div>
                    <p className="text-xs text-slate-500">{result.holidayCompensation.law}</p>
                  </div>
                )}

                {result.certificateCompensation.amount > 0 && (
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>التعويض عن عدم تسلم شهادة الشغل</span>
                      <span className="text-slate-600">{result.certificateCompensation.amount.toLocaleString()} درهم</span>
                    </div>
                    <p className="text-xs text-slate-500">{result.certificateCompensation.law}</p>
                  </div>
                )}

                {result.total === 0 && (
                  <div className="p-8 bg-red-50 rounded-3xl text-center border border-red-100">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-900 font-bold">لا توجد تعويضات مستحقة</p>
                    <p className="text-red-600 text-sm mt-2">
                      {isSeriousMisconduct ? "الفصل بسبب الخطأ الجسيم يسقط الحق في التعويضات (الفصل 61)." : "الاستقالة الإرادية أو بلوغ سن التقاعد لا تخول الحق في تعويضات الفصل والضرر (الفصل 60)."}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-8 bg-slate-900 rounded-[2rem] text-white">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
                  <span className="text-slate-400">المجموع التقديري</span>
                  <span className="text-3xl font-black text-amber-500">{result.total.toLocaleString()} درهم</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  * تنبيه: هذه النتائج تقديرية. الفصل 63 يلقي عبء الإثبات على المشغل. الفصل 65 يحدد أجل 90 يوماً لرفع الدعوى. يرجى استشارة محامٍ مختص.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => window.print()} 
                  className="flex-1 min-w-[140px] py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                >
                  <FileText className="w-5 h-5" />
                  تحميل (PDF)
                </button>
                <button 
                  onClick={downloadAsText} 
                  className="flex-1 min-w-[140px] py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                >
                  <FileText className="w-5 h-5" />
                  تحميل (Text)
                </button>
                <button 
                  onClick={() => { setStep(1); setResult(null); }} 
                  className="flex-1 min-w-[140px] py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                >
                  حساب جديد
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Print-only Report Template */}
      <div className="hidden print:block p-12 bg-white text-slate-900" dir="rtl">
        <div className="text-center border-b-2 border-slate-900 pb-8 mb-8">
          <h1 className="text-3xl font-black mb-2">تقرير تقدير تعويضات الشغل</h1>
          <p className="text-slate-500">صادر عن تطبيق الحاسبة القانونية المغربية</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="space-y-2">
            <h3 className="font-bold border-b border-slate-200 pb-1">معلومات العقد</h3>
            <p>نوع العقد: {contractType === 'CDD' ? 'محدد المدة (CDD)' : 'غير محدد المدة (CDI)'}</p>
            <p>الصفة المهنية: {status === 'executive' ? 'إطار' : 'عامل/مستخدم'}</p>
            <p>الأجر الشهري: {salary.toLocaleString()} درهم</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold border-b border-slate-200 pb-1">الفترة الزمنية</h3>
            <p>تاريخ البداية: {startDate}</p>
            <p>تاريخ النهاية: {endDate}</p>
            <p>سبب الإنهاء: {
              terminationReason === 'dismissal' ? 'فصل من طرف المشغل' :
              terminationReason === 'resignation' ? 'استقالة' :
              terminationReason === 'retirement' ? 'تقاعد' : 'انتهاء العقد'
            }</p>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="font-bold text-xl mb-4 bg-slate-100 p-3 rounded-lg">الخلاصة القانونية</h3>
          <div className={cn(
            "p-6 rounded-2xl border-2 mb-4",
            result?.isAbusive ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"
          )}>
            <p className="font-bold text-lg mb-2">
              الحالة: {result?.isAbusive ? "فصل تعسفي" : "إنهاء قانوني"}
            </p>
            <p className="text-sm">
              {result?.isAbusive 
                ? "بناءً على المعطيات المقدمة، يعتبر هذا الفصل فصلاً تعسفياً يخول الحق في التعويض عن الضرر وفق الفصل 41 من مدونة الشغل."
                : "بناءً على المعطيات المقدمة، يعتبر إنهاء العلاقة الشغلية قانونياً."}
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-12">
          <h3 className="font-bold text-xl mb-4">تفاصيل التعويضات</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-3 text-right border">نوع التعويض</th>
                <th className="p-3 text-right border">المبلغ (درهم)</th>
                <th className="p-3 text-right border">الأساس القانوني</th>
              </tr>
            </thead>
            <tbody>
              {result?.noticePeriod && result.noticePeriod.amount > 0 && (
                <tr>
                  <td className="p-3 border font-bold">أجل الإخطار</td>
                  <td className="p-3 border">{result.noticePeriod.amount.toLocaleString()}</td>
                  <td className="p-3 border text-xs">الفصل 51</td>
                </tr>
              )}
              {result?.severance && result.severance.amount > 0 && (
                <tr>
                  <td className="p-3 border font-bold">الأقدمية</td>
                  <td className="p-3 border">{result.severance.amount.toLocaleString()}</td>
                  <td className="p-3 border text-xs">الفصل 52-53</td>
                </tr>
              )}
              {result?.damages && result.damages.amount > 0 && (
                <tr>
                  <td className="p-3 border font-bold">الضرر</td>
                  <td className="p-3 border">{result.damages.amount.toLocaleString()}</td>
                  <td className="p-3 border text-xs">الفصل 41</td>
                </tr>
              )}
              {result?.cddCompensation && (
                <tr>
                  <td className="p-3 border font-bold">الفترة المتبقية</td>
                  <td className="p-3 border">{result?.cddCompensation?.amount?.toLocaleString() || '0'}</td>
                  <td className="p-3 border text-xs">الفصل 33</td>
                </tr>
              )}
              {result?.unusedLeave && result.unusedLeave.amount > 0 && (
                <tr>
                  <td className="p-3 border font-bold">العطلة السنوية</td>
                  <td className="p-3 border">{result.unusedLeave.amount.toLocaleString()}</td>
                  <td className="p-3 border text-xs">الفصل 252</td>
                </tr>
              )}
              {result?.unpaidDays && result.unpaidDays.amount > 0 && (
                <tr>
                  <td className="p-3 border font-bold">أيام غير مدفوعة</td>
                  <td className="p-3 border">{result.unpaidDays.amount.toLocaleString()}</td>
                  <td className="p-3 border text-xs">-</td>
                </tr>
              )}
              {result?.overtime && result.overtime.amount > 0 && (
                <tr>
                  <td className="p-3 border font-bold">الساعات الإضافية</td>
                  <td className="p-3 border">{result.overtime.amount.toLocaleString()}</td>
                  <td className="p-3 border text-xs">الفصل 198</td>
                </tr>
              )}
              {result?.holidayCompensation && result.holidayCompensation.amount > 0 && (
                <tr>
                  <td className="p-3 border font-bold">الأعياد والراحة</td>
                  <td className="p-3 border">{result.holidayCompensation.amount.toLocaleString()}</td>
                  <td className="p-3 border text-xs">-</td>
                </tr>
              )}
              {result?.certificateCompensation && result.certificateCompensation.amount > 0 && (
                <tr>
                  <td className="p-3 border font-bold">شهادة الشغل</td>
                  <td className="p-3 border">{result.certificateCompensation.amount.toLocaleString()}</td>
                  <td className="p-3 border text-xs">الفصل 72</td>
                </tr>
              )}
              {(smigDifference > 0 || isMaternityClaim) && (
                <tr>
                  <td className="p-3 border font-bold">مطالبات أخرى (أقدمية/ولادة/أجر)</td>
                  <td className="p-3 border">{(smigDifference + (isMaternityClaim ? salary * 0.5 : 0)).toLocaleString()}</td>
                  <td className="p-3 border text-xs">م 350، 356، 270</td>
                </tr>
              )}
              <tr className="bg-amber-50 font-black">
                <td className="p-3 border text-xl">المجموع التقديري</td>
                <td className="p-3 border text-xl text-amber-600">{result?.total.toLocaleString()}</td>
                <td className="p-3 border"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-20 pt-8 border-t border-slate-200 text-xs text-slate-400 text-center">
          <p>هذا التقرير تقديري ولا يعوض الاستشارة القانونية لدى محامٍ مختص.</p>
          <p>تاريخ الاستخراج: {new Date().toLocaleDateString('ar-MA')}</p>
        </div>
      </div>
    </div>
  );
}
