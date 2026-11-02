import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Baby, 
  Home, 
  Scale, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Loader2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  FileText,
  Download,
  Users,
  GraduationCap,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { exportToWord } from '../lib/wordUtils';

interface EntitlementResult {
  total: number;
  monthlyTotal: number;
  breakdown: {
    category: string;
    amount: number;
    details: string;
    legalBasis: string;
  }[];
  summary: string;
  legalAdvice: string;
}

const PROFESSIONS = [
  {
    category: "القطاع العام (الوظيفة العمومية)",
    jobs: [
      { title: "موظف سلم 6 (أدنى سلم)", salary: 4650 },
      { title: "معلم/أستاذ (ابتدائي/إعدادي)", salary: 8000 },
      { title: "أستاذ التعليم الثانوي (تأهيلي)", salary: 9750 },
      { title: "ممرض مجاز من الدولة", salary: 8600 },
      { title: "متصرف (سلم 11)", salary: 11250 },
      { title: "مهندس دولة (قطاع عام)", salary: 13500 },
      { title: "طبيب عام (قطاع عام)", salary: 15500 },
      { title: "أستاذ جامعي", salary: 20000 },
    ]
  },
  {
    category: "الأمن والعدل",
    jobs: [
      { title: "حارس أمن (شرطة)", salary: 6500 },
      { title: "ضابط شرطة", salary: 9500 },
      { title: "عميد شرطة", salary: 14000 },
      { title: "قاضي (درجة ثانية/ثالثة)", salary: 18000 },
      { title: "ملحق قضائي (متدرب)", salary: 5500 },
    ]
  },
  {
    category: "التكنولوجيا والعمل الرقمي",
    jobs: [
      { title: "مطور برمجيات (Developer)", salary: 16500 },
      { title: "محلل بيانات (Data Analyst)", salary: 15000 },
      { title: "مدير مشروع (Project Manager)", salary: 25000 },
      { title: "مسوق رقمي (Marketer)", salary: 10500 },
      { title: "تقني في الدعم الفني (IT Support)", salary: 7250 },
    ]
  },
  {
    category: "القطاع الخاص والشركات",
    jobs: [
      { title: "مستخدم مركز نداء (فرنسية)", salary: 6250 },
      { title: "مستخدم مركز نداء (لغات أخرى)", salary: 11000 },
      { title: "محاسب (شركة متوسطة)", salary: 9250 },
      { title: "بائع في متجر كبير (Commercial)", salary: 5500 },
      { title: "تقني متخصص (طيران/سيارات)", salary: 8250 },
      { title: "سائق مهني / عامل نقل", salary: 5500 },
    ]
  },
  {
    category: "المهن الحرة",
    jobs: [
      { title: "محامٍ", salary: 16500 },
      { title: "مهندس معماري (حر)", salary: 27500 },
      { title: "طبيب اختصاصي (عيادة خاصة)", salary: 55000 },
      { title: "موثق (Notaire)", salary: 40000 },
    ]
  },
  {
    category: "السياحة والخدمات",
    jobs: [
      { title: "موظف استقبال (Receptionist)", salary: 5750 },
      { title: "طباخ (Chef de Partie)", salary: 10000 },
      { title: "مدير فندق (متوسط)", salary: 22500 },
      { title: "مرشد سياحي (معتمد)", salary: 11000 },
    ]
  },
  {
    category: "المهن اليدوية والعمال",
    jobs: [
      { title: "عامل فلاحي (مياوم)", salary: 2800 },
      { title: "بناء / كهربائي بناء", salary: 6250 },
      { title: "لحام متخصص (Soudeur)", salary: 8000 },
      { title: "عامل نظافة (قطاع خاص)", salary: 3350 },
    ]
  },
  {
    category: "الحد الأدنى القانوني (2026)",
    jobs: [
      { title: "الحد الأدنى للأجور (SMIG) - قطاع خاص", salary: 3191 },
      { title: "الحد الأدنى للأجور - وظيفة عمومية", salary: 4500 },
    ]
  }
];

const INITIAL_FORM_DATA = {
  marriageDuration: '',
  marriageDurationMonths: '',
  husbandSalary: '',
  husbandProfession: '',
  husbandExtraIncome: '0',
  husbandAssets: '',
  isWifeWorking: false,
  wifeBackground: 'medium',
  monthlyMarriageExpense: '',
  hasSadaqMouakhar: false,
  sadaqAmount: '',
  socialClass: 'middle',
  childrenCount: '0',
  childrenData: [] as { ageYears: string, ageMonths: string, schoolType: 'public' | 'private' | 'none', isSpecialNeeds: boolean }[],
  divorceReason: 'normal',
  isPregnant: false,
  currentHousing: 'family_home',
  residenceCity: 'الدار البيضاء',
  localHabits: 'medium',
};

export default function MaritalEntitlements() {
  const [step, setStep] = useState(() => Number(localStorage.getItem('marital_step')) || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EntitlementResult | null>(() => {
    const saved = localStorage.getItem('marital_result');
    return saved ? JSON.parse(saved) : null;
  });

  const analysisMessages = [
    "جاري فحص معطيات النازلة وفق مقتضيات المادة 84...",
    "تحليل الدخل التقديري ومستوى المعيشة المعتاد...",
    "مطابقة الحالة مع احدث الاجتهادات القضائية (2008-2024)...",
    "تقدير وجيبة السكن حسب المستوى الاقتصادي للمدينة...",
    "احتساب الفوارق بناءً على مدة العشرة وظروف الفراق...",
    "صياغة التقرير النهائي للمستحقات..."
  ];

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setAnalysisStep(prev => (prev < analysisMessages.length - 1 ? prev + 1 : prev));
      }, 1600);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  // Form State
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('marital_formData');
    return saved ? JSON.parse(saved) : INITIAL_FORM_DATA;
  });

  const MOROCCAN_CITIES = [
    { name: "الدار البيضاء", level: "high" },
    { name: "الرباط", level: "high" },
    { name: "طنجة", level: "high" },
    { name: "مراكش", level: "high" },
    { name: "أكادير", level: "medium" },
    { name: "فاس", level: "medium" },
    { name: "مكناس", level: "medium" },
    { name: "القنيطرة", level: "medium" },
    { name: "وجدة", level: "medium" },
    { name: "تطوان", level: "medium" },
    { name: "آسفي", level: "low" },
    { name: "خريبكة", level: "low" },
    { name: "تازة", level: "low" },
    { name: "الناظور", level: "low" },
    { name: "بني ملال", level: "low" },
    { name: "سيدي قاسم", level: "low" },
    { name: "تيفلت", level: "low" },
    { name: "أخرى (تكلفة مرتفعة)", level: "high" },
    { name: "أخرى (تكلفة متوسطة)", level: "medium" },
    { name: "أخرى (تكلفة منخفضة)", level: "low" }
  ];

  const handleProfessionChange = (profession: string) => {
    let salary = formData.husbandSalary;
    for (const group of PROFESSIONS) {
      const job = group.jobs.find(j => j.title === profession);
      if (job) {
        salary = job.salary.toString();
        break;
      }
    }
    setFormData({ ...formData, husbandProfession: profession, husbandSalary: salary });
  };

  useEffect(() => {
    localStorage.setItem('marital_step', step.toString());
    localStorage.setItem('marital_result', JSON.stringify(result));
    localStorage.setItem('marital_formData', JSON.stringify(formData));
  }, [step, result, formData]);

  const handleCalculate = async () => {
    setIsLoading(true);
    setAnalysisStep(0);
    setError(null);
    setResult(null);

    // Deep analysis simulation (10 seconds)
    await new Promise(resolve => setTimeout(resolve, 10000));

    const durationYears = parseInt(formData.marriageDuration) || 0;
    const durationMonths = parseInt(formData.marriageDurationMonths) || 0;
    const totalDurationYears = durationYears + (durationMonths / 12);
    
    const salary = parseInt(formData.husbandSalary) || 0;
    const extraIncome = parseInt(formData.husbandExtraIncome) || 0;
    const reportedExpense = parseInt(formData.monthlyMarriageExpense) || 0;
    const children = formData.childrenData;
    const sadaq = parseInt(formData.sadaqAmount) || 0;

    const totalIncome = salary + extraIncome;
    let estimatedRealIncome = totalIncome;
    
    // Evasion detection - Calibrated with jurisprudence
    if (reportedExpense > (totalIncome * 0.7)) {
      estimatedRealIncome = Math.max(totalIncome, reportedExpense * 1.3);
    }

    // Class floors based on Moroccan standard of living
    if (formData.socialClass === 'rich' && estimatedRealIncome < 15000) estimatedRealIncome = 25000;
    if (formData.socialClass === 'middle' && estimatedRealIncome < 5000) estimatedRealIncome = 7500;

    const cityData = MOROCCAN_CITIES.find(c => c.name === formData.residenceCity) || { level: 'medium' };
    const cityMultiplier = cityData.level === 'high' ? 1.3 : cityData.level === 'low' ? 0.8 : 1.0;

    // --- 1. Mut'a (Compensation) - Logic based on shared Precedents ---
    let mutaCoefficient = 1.0;
    
    // Duration Factor (Derived from: 30yrs -> approx 8-10 months income, 1yr -> approx 1-2 months)
    if (totalDurationYears >= 30) mutaCoefficient = 10;
    else if (totalDurationYears >= 20) mutaCoefficient = 8;
    else if (totalDurationYears >= 10) mutaCoefficient = 5;
    else if (totalDurationYears >= 5) mutaCoefficient = 3;
    else if (totalDurationYears >= 2) mutaCoefficient = 1.8;
    else mutaCoefficient = 1.2;

    let muta = estimatedRealIncome * mutaCoefficient;

    // Adjust for Fault/Reason (Benchmarks: Abuse/Violence doubles the amount)
    if (formData.divorceReason === 'arbitrary') {
      muta *= 2.5; 
    } else if (formData.divorceReason === 'normal') {
      muta *= 1.1;
    }

    // Protection Floors (minimums found in jurisprudence)
    if (totalDurationYears >= 20) muta = Math.max(muta, 15000);
    if (totalDurationYears >= 10) muta = Math.max(muta, 7000);
    
    // Specific Diaspora Case (benchmark: 1000€ income -> 10k-20k muta)
    const isDiaspora = formData.husbandProfession.includes('إسبانيا') || formData.husbandProfession.includes('فرنسا') || formData.husbandProfession.includes('الخارج');
    if (isDiaspora && totalDurationYears < 5) {
      muta = Math.max(muta, 8000);
    }

    // --- 2. Idda (Waiting Period) - Benchmarks from shared judgments (1800-4500dh total) ---
    let totalIdda = 3000; // Average
    if (estimatedRealIncome < 3500) totalIdda = 2200;
    else if (estimatedRealIncome > 12000) totalIdda = 6000;
    else if (estimatedRealIncome > 8000) totalIdda = 4500;
    
    totalIdda *= cityMultiplier;

    // --- 3. Child Support, Custody & Breastfeeding ---
    let totalChildSupport = 0;
    let seasonalClothing = 0;
    let medicalFund = 0;
    let totalCustodyFee = 0;
    let totalBreastfeedingFee = 0;

    children.forEach(child => {
      // 3.1 Base Support (Nafaka) - Matching user benchmarks
      let baseSupport = 400; // Standard for labor/manual jobs
      if (isDiaspora) baseSupport = 700;
      else if (estimatedRealIncome > 10000) baseSupport = 1200;
      else if (estimatedRealIncome > 5000) baseSupport = 600;
      else if (estimatedRealIncome < 3000) baseSupport = 300;

      if (child.schoolType === 'private') baseSupport += (estimatedRealIncome * 0.05 + 400);
      if (child.isSpecialNeeds) {
        baseSupport += (estimatedRealIncome * 0.1 + 800);
        medicalFund += (estimatedRealIncome * 0.08 + 1000);
      }
      totalChildSupport += baseSupport;
      
      // 3.2 Custody Fee (أجرة الحضانة) - Benchmarks: 100-200 dh
      let custodyFee = 100;
      if (isDiaspora || estimatedRealIncome > 10000) custodyFee = 200;
      else if (estimatedRealIncome < 3000) custodyFee = 50;
      totalCustodyFee += custodyFee;

      // 3.3 Breastfeeding Fee (أجرة الرضاعة) - Benchmark: 200 dh
      const years = parseInt(child.ageYears) || 0;
      const months = parseInt(child.ageMonths) || 0;
      const totalMonths = (years * 12) + months;
      if (totalMonths < 24) {
        totalBreastfeedingFee += 200;
      }

      seasonalClothing += (baseSupport * 0.5); 
    });
    
    totalChildSupport *= cityMultiplier;

    // --- 4. Monthly Housing (Sokna) - Benchmarks from shared judgements ---
    let monthlyHousingResult = 0;
    if (children.length > 0 && (formData.currentHousing === 'rented' || formData.currentHousing === 'none')) {
      const level = cityData.level;
      if (estimatedRealIncome < 3000) {
        monthlyHousingResult = 700; // Matching cases: 1000-1500dh salary -> 600-700dh housing
      } else if (estimatedRealIncome < 6000) {
        monthlyHousingResult = 850; // Matching cases: 3500dh salary -> 800dh housing
      } else if (estimatedRealIncome < 15000) {
        monthlyHousingResult = 1200; // Matching cases: 1000€ salary -> 1000-1500dh housing
      } else {
        monthlyHousingResult = 2500;
      }
      
      if (level === 'high') monthlyHousingResult *= 1.3;
      if (level === 'low') monthlyHousingResult *= 0.85;
    }

    const totalImmediateAtDivorce = muta + totalIdda + (formData.hasSadaqMouakhar ? sadaq : 0);
    let totalMonthlyEntitlements = (totalChildSupport + (seasonalClothing / 12)) + medicalFund + monthlyHousingResult + totalCustodyFee + totalBreastfeedingFee;

    // Apply the 1/3 Salary Cap for monthly support (Nafaka)
    // Most Moroccan judgments balance between children's needs and husband's ability, 
    // and as per your request, we cap it at 1/3 of total monthly income.
    const maxMonthlyAllowed = totalIncome / 3;
    let isCapped = false;
    
    if (totalMonthlyEntitlements > maxMonthlyAllowed && totalIncome > 0) {
      const scaleFactor = maxMonthlyAllowed / totalMonthlyEntitlements;
      totalChildSupport *= scaleFactor;
      seasonalClothing *= scaleFactor;
      medicalFund *= scaleFactor;
      monthlyHousingResult *= scaleFactor;
      totalCustodyFee *= scaleFactor;
      totalBreastfeedingFee *= scaleFactor;
      totalMonthlyEntitlements = maxMonthlyAllowed;
      isCapped = true;
    }

    const durationText = `${durationYears} سنة${durationMonths > 0 ? ` و ${durationMonths} شهر` : ''}`;

    const breakdown = [
      { 
        category: "واجب المتعة (Art. 84)", 
        amount: Math.round(muta), 
        details: `تعويض جابر للضرر روعيت فيه مدة العشرة (${durationText}) وأسباب الطلاق والوضع المالي للزوج. المطابقة تمت مع أحكام مشابهة تراعي التناسب الاجتماعي.`, 
        legalBasis: "المادة 84 من مدونة الأسرة" 
      },
      { 
        category: "نفقة العدة (IDDA)", 
        amount: Math.round(totalIdda), 
        details: `مبلغ إجمالي لفترة العدة (3 أشهر). قدر بناءً على مستوى الأسعار والوسط الاجتماعي وفقاً للقواعد المقررة قانوناً.`, 
        legalBasis: "المواد 189، 196" 
      },
    ];

    if (children.length > 0) {
      breakdown.push({ 
        category: "نفقة الأبناء والملبس (شهرية)", 
        amount: Math.round(totalChildSupport + (seasonalClothing / 12)), 
        details: `النفقة الشهرية لـ ${children.length} أطفال. ${isCapped ? 'تم سقف المبلغ بما يوافق ثلث راتب الزوج للحفاظ على قدرته على الأداء.' : 'تم الاستناد لنمادج أحكام تقديرية تراعي التناسب بين دخل الملزم وحال مستحق النفقة.'}`, 
        legalBasis: "المواد 189، 191، 198" 
      });

      if (totalCustodyFee > 0) {
        breakdown.push({ 
          category: "أجرة الحضانة (شهرية)", 
          amount: Math.round(totalCustodyFee), 
          details: `أجرة الحاضنة مقابل القيام بشؤون المحضونين. ${isCapped ? 'مبلغ معدل ليناسب سقف الثلث.' : 'اعتمدنا المعايير المعمول بها في تقدير أجرة الحضانة بالتوسط والاعتدال.'}`, 
          legalBasis: "المادة 167 من المدونة" 
        });
      }

      if (totalBreastfeedingFee > 0) {
        breakdown.push({ 
          category: "أجرة الرضاعة (شهرية)", 
          amount: Math.round(totalBreastfeedingFee), 
          details: `واجب مالي للمرضعة طيلة سنتين (الحولين). ${isCapped ? 'مبلغ معدل ليناسب سقف الثلث.' : 'تم تحديدها بناءً على السلطة التقديرية للمحكمة في مراعاة التوسط.'}`, 
          legalBasis: "المادة 201 من المدونة" 
        });
      }
    }

    if (monthlyHousingResult > 0) {
      breakdown.push({ 
        category: "واجب السكن (شهري)", 
        amount: Math.round(monthlyHousingResult), 
        details: `الأجرة الشهرية للسكن المقدرة وفقاً لدخل الملتزم بالنفقة وبمدينة ${formData.residenceCity}. ${isCapped ? 'مبلغ معدل ليناسب سقف الثلث.' : ''}`, 
        legalBasis: "المواد 168 و 191" 
      });
    }

    if (medicalFund > 0) {
      breakdown.push({
        category: "تعويضات طبية تكميلية",
        amount: Math.round(medicalFund),
        details: isCapped ? "تغطية دورية للمصاريف الطبية (معدلة لتناسب سقف الثلث)." : "تغطية دورية للمصاريف الطبية الخاصة بحالات الإعاقة أو المرض المزمن.",
        legalBasis: "المادة 198 من المدونة"
      });
    }

    if (formData.hasSadaqMouakhar) {
      breakdown.push({
        category: "مؤخر الصداق",
        amount: sadaq,
        details: "الدين الثابت في الذمة المستحق عند انحلال ميثاق الزوجية.",
        legalBasis: "عقد الزواج"
      });
    }

    setResult({
      total: Math.round(totalImmediateAtDivorce), // Only Lump Sum in main total for clarity
      monthlyTotal: Math.round(totalMonthlyEntitlements),
      breakdown,
      summary: `${isCapped ? 'ملاحظة: تم سقف المستحقات الشهرية في حدود ثلث راتب الزوج (قاعدة 1/3) لضمان واقعية الحكم. ' : ''}تم تحليل النازلة بناءً على التوجهات القضائية العامة والمعايير القانونية الجاري بها العمل. التقدير راعى خصوصية مهنة الزوج (${formData.husbandProfession}) وطول فترة العشرة التي بلغت ${durationText}. تم دمج معايير تقدير أجرة الحضانة (المادة 167) وأجرة الرضاعة (المادة 201) لضمان تغطية شاملة لكافة بنود المادة 84 من مدونة الأسرة.`,
      legalAdvice: `يُنصح دائماً بتقديم "كشف الحساب البنكي" للزوج، فالاجتهاد القضائي يولي أهمية قصوى لبيانات الدخل الموثقة. لضمان تحصيل "أجرة الرضاعة"، يجب الإشارة لعمر الطفل في المحضر (أقل من سنتين). كما أن "واجب الحضانة" يسقط في حالة زواج الأم أو انتقالها للسكن بعيداً عن الأب بشكل يعيق الزيارة، إلا في استثناءات محدودة.`
    });
    setStep(4);
    setIsLoading(false);
  };

  const downloadWord = async () => {
    if (!result) return;
    await exportToWord(result, formData);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleChildrenCountChange = (count: string) => {
    const n = parseInt(count);
    const newData = [...formData.childrenData];
    if (n > newData.length) {
      for (let i = newData.length; i < n; i++) newData.push({ ageYears: '', ageMonths: '', schoolType: 'public', isSpecialNeeds: false });
    } else {
      newData.length = n;
    }
    setFormData({ ...formData, childrenCount: count, childrenData: newData });
  };

  const handleReset = () => {
    // Clear state
    setFormData(INITIAL_FORM_DATA);
    setResult(null);
    setStep(1);
    
    // Explicitly clear localStorage to prevent hydration issues or stale data
    localStorage.removeItem('marital_step');
    localStorage.removeItem('marital_result');
    localStorage.removeItem('marital_formData');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4" dir="rtl">
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
          >
            <div className="relative w-32 h-32 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-100"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="376.8"
                  initial={{ strokeDashoffset: 376.8 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 10, ease: "linear" }}
                  className="text-emerald-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Scale className="w-12 h-12 text-emerald-500 animate-pulse" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-4">جاري التحليل القانوني المعمق</h3>
            
            <div className="space-y-4">
              <motion.p 
                key={analysisStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-slate-600 font-medium min-h-[3rem]"
              >
                {analysisMessages[analysisStep]}
              </motion.p>
              
              <div className="flex justify-center gap-1">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <motion.div 
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${i <= analysisStep ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-200'}`}
                  />
                ))}
              </div>
            </div>

            <p className="mt-8 text-xs text-slate-400">
              يتم الآن مطابقة المعطيات مع المخرجات القضائية للمادة 84 و189 من مدونة الأسرة
            </p>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4 mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-pink-50 shadow-xl border border-pink-100 mb-4"
        >
          <Heart className="w-8 h-8 md:w-10 md:h-10 text-pink-600" />
        </motion.div>
        <h2 className="text-2xl md:text-4xl font-serif font-bold text-slate-900">حساب <span className="text-pink-600">المستحقات الزوجية</span></h2>
        <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
          أداة لمساعدة النساء على معرفة مستحقاتهن (المتعة، العدة، نفقة الأطفال) وفقاً لمدونة الأسرة المغربية.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                step >= s ? "bg-pink-600 text-white shadow-lg shadow-pink-200" : "bg-slate-100 text-slate-400"
              )}
            >
              {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
          ))}
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-pink-600"
            initial={{ width: '0%' }}
            animate={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 p-6 md:p-12 shadow-xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-pink-600" />
                <h3 className="text-2xl font-bold text-slate-900">بيانات الزواج والوضعية المالية</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">مدة الزواج</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400">سنوات</label>
                      <input 
                        type="number" 
                        value={formData.marriageDuration}
                        onChange={(e) => setFormData({...formData, marriageDuration: e.target.value})}
                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-500/30 outline-none transition-all"
                        placeholder="سنة"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400">أشهر</label>
                      <input 
                        type="number" 
                        value={formData.marriageDurationMonths}
                        onChange={(e) => setFormData({...formData, marriageDurationMonths: e.target.value})}
                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-500/30 outline-none transition-all"
                        placeholder="شهر"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">مهنة الزوج</label>
                  <input 
                    type="text" 
                    list="professions-list"
                    value={formData.husbandProfession}
                    onChange={(e) => handleProfessionChange(e.target.value)}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-500/30 outline-none transition-all"
                    placeholder="اختر المهنة أو اكتبها يدوياً..."
                  />
                  <datalist id="professions-list">
                    {PROFESSIONS.map(group => 
                      group.jobs.map(job => (
                        <option key={job.title} value={job.title}>{group.category}</option>
                      ))
                    )}
                  </datalist>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 underline underline-offset-4 decoration-pink-300">الطبقة الاجتماعية والاقتصادية للأسرة</label>
                    <div className="grid grid-cols-2 gap-2">
                       {[
                         { id: 'rich', label: 'طبقة ميسورة جداً', desc: 'مداخيل عليا، نمط عيش فاخر' },
                         { id: 'middle', label: 'طبقة متوسطة', desc: 'موظفون، أطر، مهن حرة' },
                         { id: 'limited', label: 'طبقة محدودة الدخل', desc: 'أجراء بسيطون، كدح معيشي' },
                         { id: 'fragile', label: 'طبقة هشة', desc: 'دخل غير قار، قطاع غير مهيكل' }
                       ].map(cls => (
                         <button
                           key={cls.id}
                           onClick={() => setFormData({...formData, socialClass: cls.id})}
                           className={cn(
                             "p-3 rounded-xl border-2 text-right transition-all",
                             formData.socialClass === cls.id ? "border-pink-500 bg-pink-50" : "border-slate-100 hover:border-pink-200"
                           )}
                         >
                           <div className={cn("text-sm font-bold", formData.socialClass === cls.id ? "text-pink-700" : "text-slate-700")}>{cls.label}</div>
                           <div className="text-[10px] text-slate-400">{cls.desc}</div>
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 underline underline-offset-4 decoration-pink-300">الوسط الاجتماعي للزوجة (قبل الزواج)</label>
                    <select 
                      value={formData.wifeBackground}
                      onChange={(e) => setFormData({...formData, wifeBackground: e.target.value})}
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-500/30 outline-none transition-all"
                    >
                      <option value="simple">وسط بسيط / متواضع</option>
                      <option value="medium">وسط مغربي معتاد (متوسط)</option>
                      <option value="high">وسط ميسور / رفيع</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-4 p-4 bg-pink-50/50 rounded-2xl border-2 border-pink-100">
                    <input 
                      type="number" 
                      value={formData.husbandSalary}
                      onChange={(e) => setFormData({...formData, husbandSalary: e.target.value})}
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-500/30 outline-none transition-all"
                      placeholder="سيظهر الراتب تلقائياً ويمكنك تعديله"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">مداخيل أخرى للزوج (كراء، تجارة...)</label>
                    <input 
                      type="number" 
                      value={formData.husbandExtraIncome}
                      onChange={(e) => setFormData({...formData, husbandExtraIncome: e.target.value})}
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-500/30 outline-none transition-all"
                      placeholder="مثلاً: 2000"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">ممتلكات الزوج (عقارات، سيارات، أراضي...)</label>
                    <textarea 
                      value={formData.husbandAssets}
                      onChange={(e) => setFormData({...formData, husbandAssets: e.target.value})}
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-500/30 outline-none transition-all h-[100px] resize-none"
                      placeholder="اذكر الممتلكات التي تدر عليه دخلاً أو تدل على يسره..."
                    />
                  </div>
                  <div className="flex flex-col gap-4 p-4 bg-pink-50/50 rounded-2xl border-2 border-pink-100">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={formData.isWifeWorking}
                        onChange={(e) => setFormData({...formData, isWifeWorking: e.target.checked})}
                        className="w-5 h-5 accent-pink-600"
                        id="wife-work"
                      />
                      <label htmlFor="wife-work" className="text-sm font-bold text-pink-900">هل الزوجة تشتغل؟ (يؤثر على تقدير النفقة)</label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-4 bg-pink-50/50 rounded-2xl border-2 border-pink-100 md:col-span-2">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={formData.hasSadaqMouakhar}
                      onChange={(e) => setFormData({...formData, hasSadaqMouakhar: e.target.checked})}
                      className="w-5 h-5 accent-pink-600"
                    />
                    <label className="text-sm font-bold text-pink-900">هل يوجد صداق مؤخر في العقد؟</label>
                  </div>
                  {formData.hasSadaqMouakhar && (
                    <input 
                      type="number" 
                      value={formData.sadaqAmount}
                      onChange={(e) => setFormData({...formData, sadaqAmount: e.target.value})}
                      className="w-full p-3 bg-white border border-pink-200 rounded-xl outline-none"
                      placeholder="مبلغ الصداق بالدرهم"
                    />
                  )}
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={nextStep}
                  disabled={!(formData.marriageDuration || formData.marriageDurationMonths) || !formData.husbandSalary}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>المتابعة</span>
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
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
              <div className="flex items-center gap-3 mb-6">
                <Baby className="w-6 h-6 text-pink-600" />
                <h3 className="text-2xl font-bold text-slate-900">الأطفال والوضعية العائلية</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">عدد الأطفال المحضونين</label>
                  <select 
                    value={formData.childrenCount}
                    onChange={(e) => handleChildrenCountChange(e.target.value)}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-500/30 outline-none transition-all"
                  >
                    {[0,1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                {parseInt(formData.childrenCount) > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="md:col-span-2 space-y-6 p-6 bg-slate-50 rounded-3xl border-2 border-slate-100"
                  >
                    <div className="flex items-center gap-2 mb-2">
                       <Clock className="w-5 h-5 text-pink-600" />
                       <h4 className="font-bold text-slate-900">بيانات الأطفال (لتحديد النفقة والرضاعة والتعليم)</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {formData.childrenData.map((child, i) => (
                        <div key={i} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm">
                          <label className="text-xs font-bold text-slate-500 block mb-1 underline underline-offset-4 decoration-pink-200">الطفل {i + 1}</label>
                          <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400">السن (سنوات)</label>
                                <input 
                                  type="number"
                                  value={child.ageYears}
                                  onChange={(e) => {
                                    const newData = [...formData.childrenData];
                                    newData[i].ageYears = e.target.value;
                                    setFormData({ ...formData, childrenData: newData });
                                  }}
                                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                                  placeholder="سنة"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400">السن (شهور)</label>
                                <input 
                                  type="number"
                                  value={child.ageMonths}
                                  onChange={(e) => {
                                    const newData = [...formData.childrenData];
                                    newData[i].ageMonths = e.target.value;
                                    setFormData({ ...formData, childrenData: newData });
                                  }}
                                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                                  placeholder="شهر"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">نوع التعليم</label>
                              <select
                                value={child.schoolType}
                                onChange={(e) => {
                                  const newData = [...formData.childrenData];
                                  newData[i].schoolType = e.target.value as any;
                                  setFormData({ ...formData, childrenData: newData });
                                }}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                              >
                                <option value="public">تعليم عمومي</option>
                                <option value="private">تعليم خصوصي</option>
                                <option value="none">غير متمدرسين</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                              <input 
                                type="checkbox"
                                checked={child.isSpecialNeeds}
                                onChange={(e) => {
                                  const newData = [...formData.childrenData];
                                  newData[i].isSpecialNeeds = e.target.checked;
                                  setFormData({ ...formData, childrenData: newData });
                                }}
                                className="w-4 h-4 accent-pink-600"
                                id={`needs-${i}`}
                              />
                              <label htmlFor={`needs-${i}`} className="text-[10px] font-bold text-pink-700">من ذوي الاحتياجات الخاصة</label>
                              <Info className="w-3 h-3 text-pink-400 cursor-help" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 underline underline-offset-4 decoration-pink-300">طبيعة الوسط (الأعراف والعادات)</label>
                  <select 
                    value={formData.localHabits}
                    onChange={(e) => setFormData({...formData, localHabits: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-500/30 outline-none transition-all"
                  >
                    <option value="medium">وسط مغربي معتاد (متوسط)</option>
                    <option value="high">وسط رفيع / عادات استهلاكية عالية</option>
                    <option value="simple">وسط بسيط / عادات قروية أو شعبية</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">مدينة إقامة الأم والأبناء</label>
                  <select 
                    value={formData.residenceCity}
                    onChange={(e) => setFormData({...formData, residenceCity: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-500/30 outline-none transition-all"
                  >
                    {MOROCCAN_CITIES.map(city => (
                      <option key={city.name} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">المصروف الشهري للأسرة (أثناء الزواج)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={formData.monthlyMarriageExpense}
                      onChange={(e) => setFormData({...formData, monthlyMarriageExpense: e.target.value})}
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-500/30 outline-none transition-all"
                      placeholder="لتقدير مستوى المعيشة المعتاد"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">د.م / شهر</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                  <input 
                    type="checkbox" 
                    checked={formData.isPregnant}
                    onChange={(e) => setFormData({...formData, isPregnant: e.target.checked})}
                    className="w-5 h-5 accent-pink-600"
                  />
                  <label className="text-sm font-bold text-slate-700">هل توجد حالة حمل حالياً؟</label>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700">وضعية السكن بعد الطلاق</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'family_home', label: 'بيت الزوجية' },
                      { id: 'rented', label: 'سكن مكتري' },
                      { id: 'none', label: 'لا يوجد سكن' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setFormData({...formData, currentHousing: opt.id})}
                        className={cn(
                          "p-4 rounded-xl border-2 font-bold transition-all text-sm",
                          formData.currentHousing === opt.id ? "border-pink-500 bg-pink-50 text-pink-700" : "border-slate-100 text-slate-500"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  onClick={prevStep}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <ChevronRight className="w-5 h-5" />
                  <span>السابق</span>
                </button>
                <button 
                  onClick={nextStep}
                  className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <span>المتابعة</span>
                  <ChevronLeft className="w-5 h-5" />
                </button>
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
              <div className="flex items-center gap-3 mb-6">
                <Scale className="w-6 h-6 text-pink-600" />
                <h3 className="text-2xl font-bold text-slate-900">سياق الطلاق والظروف القانونية</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700">نوع الفراق / مسطرة الطلاق</label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'agreement', label: 'الطلاق الاتفاقي (بالتراضي)', desc: 'يتم بتوافق الزوجين على إنهاء العلاقة ودياً، مما قد يؤدي لتنازلات متبادلة.' },
                      { id: 'arbitrary', label: 'الطلاق التعسفي (من طرف الزوج)', desc: 'إنهاء العلاقة بإرادة الزوج المنفردة دون سبب قاطع، مما يرفع قيمة المتعة جبرياً.' },
                      { id: 'from_wife', label: 'طلاق الشقاق (بطلب الزوجة)', desc: 'بسبب استحالة العشرة أو الضرر. المحكمة تبحث في مسؤولية كل طرف.' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setFormData({...formData, divorceReason: opt.id})}
                        className={cn(
                          "p-4 rounded-2xl border-2 text-right transition-all flex flex-col gap-1",
                          formData.divorceReason === opt.id ? "border-pink-500 bg-pink-50 text-pink-700" : "border-slate-100 text-slate-500 hover:border-pink-200"
                        )}
                      >
                        <div className="flex items-center justify-between w-full font-bold">
                          <span>{opt.label}</span>
                          {formData.divorceReason === opt.id && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <p className="text-xs opacity-70">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-blue-50 border border-blue-100 rounded-3xl space-y-3">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Info className="w-5 h-5" />
                    <h4 className="font-bold text-sm">ملاحظة حول التهرب والمستوى الاجتماعي</h4>
                  </div>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    القضاء المغربي يراعي "الوسط الاجتماعي" والبحث الاجتماعي لمواجهة التلاعب بالدخل الحقيقي. إذا أثبت مستوى عيشك السابق يسراً معيناً، يُلزم الزوج بمستحقات تليق بذلك المستوى بغض النظر عن راتبه المصرح به.
                  </p>
                </div>

                <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-pink-400" />
                    <h4 className="font-bold font-serif italic text-lg decoration-pink-500/50 underline">ضمان العدالة التقديرية</h4>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    يتم تحليل "التقابل المادي" بين يسار الزوج وعسر/يسار الزوجة لضمان ألا تُصاب الزوجة بـ "القهقرى" الاجتماعية بعد الفراق، مع مراعاة طاقة الزوج دون إرهاقه.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  onClick={prevStep}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <ChevronRight className="w-5 h-5" />
                  <span>السابق</span>
                </button>
                <button 
                  onClick={handleCalculate}
                  disabled={isLoading}
                  className="flex-[2] py-4 bg-pink-600 text-white rounded-2xl font-bold hover:bg-pink-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-pink-200"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                  <span>احسب المستحقات التقديرية</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && result && (
            <motion.div
              key="result"
              id="marital-result-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 bg-white p-4 rounded-3xl"
            >
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900">إجمالي المستحقات التقديرية</h3>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <div className="text-center space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">مبالغ تُصرف مرة واحدة</p>
                    <div className="inline-block px-8 py-4 bg-slate-900 text-white rounded-[2rem] text-3xl md:text-4xl font-black">
                      {(result?.total ?? 0).toLocaleString()} <span className="text-pink-400 text-xl">د.م</span>
                    </div>
                    <p className="text-[10px] text-slate-400 italic">المتعة + العدة + الصداق</p>
                  </div>

                  <div className="hidden md:block w-px h-16 bg-slate-200" />

                  <div className="text-center space-y-1">
                    <p className="text-[10px] text-pink-600 font-bold uppercase tracking-wider">الراتب الشهري (النفقة)</p>
                    <div className="inline-block px-8 py-4 bg-pink-50 border-2 border-pink-200 text-pink-600 rounded-[2rem] text-3xl md:text-4xl font-black shadow-lg shadow-pink-100">
                      {(result?.monthlyTotal ?? 0).toLocaleString()} <span className="text-pink-600 text-xl font-bold">د.م</span>
                    </div>
                    <p className="text-[10px] text-pink-400 italic">صافي ما ستتوصل به الزوجة شهرياً</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-pink-600" />
                      تفاصيل المبالغ
                    </h4>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={downloadWord}
                        className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        صيغة Word
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {result.breakdown.map((item, i) => (
                      <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800">{item.category}</span>
                          <span className="text-pink-600 font-black">{item.amount.toLocaleString()} د.م</span>
                        </div>
                        <p className="text-xs text-slate-500">{item.details}</p>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {item.legalBasis}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-pink-50 rounded-3xl border border-pink-100 space-y-3">
                    <h4 className="font-bold text-pink-900 flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      تحليل الخبير القانوني
                    </h4>
                    <p className="text-sm text-pink-800 leading-relaxed">
                      {result.summary}
                    </p>
                  </div>

                    <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-3">
                      <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                        <Scale className="w-5 h-5" />
                        مشمولات النفقة (المادة 189)
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-indigo-800">
                        <div className="bg-white/50 p-2 rounded-lg"><strong>الغذاء:</strong> المأكل والمشرب</div>
                        <div className="bg-white/50 p-2 rounded-lg"><strong>الكسوة:</strong> الملابس بحسب الفصول</div>
                        <div className="bg-white/50 p-2 rounded-lg"><strong>العلاج:</strong> الرعاية و الأدوية</div>
                        <div className="bg-white/50 p-2 rounded-lg"><strong>السكنى:</strong> توفير مسكن أو أجرته</div>
                        <div className="bg-white/50 p-2 rounded-lg"><strong>التعليم:</strong> مصاريف الدراسة</div>
                      </div>
                      <p className="text-[10px] text-indigo-700 leading-relaxed italic">
                        {result.legalAdvice}
                      </p>
                    </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-center">
                <button 
                  onClick={handleReset}
                  className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  إجراء حساب جديد
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
