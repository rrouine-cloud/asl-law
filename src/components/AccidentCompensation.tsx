import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  Calculator, 
  Scale, 
  User, 
  Calendar, 
  Briefcase, 
  HeartPulse, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Loader2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Users,
  Stethoscope,
  TrendingUp,
  FileText,
  Download
} from 'lucide-react';
import { cn } from '../lib/utils';
import { calculateAccidentCompensationLocal, AccidentInput } from '../lib/legalCalculations';

interface CompensationResult {
  total: number;
  breakdown: {
    category: string;
    amount: number;
    details: string;
    legalBasis: string;
  }[];
  summary: string;
  legalAdvice?: string;
  isAiGenerated?: boolean;
}

export default function AccidentCompensation() {
  const [step, setStep] = useState(() => Number(localStorage.getItem('accident_step')) || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompensationResult | null>(() => {
    const saved = localStorage.getItem('accident_result');
    return saved ? JSON.parse(saved) : null;
  });

  // Form State
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('accident_formData');
    return saved ? JSON.parse(saved) : {
      age: '',
      profession: '',
      monthlyIncome: '',
      hasIncomeProof: true,
      accidentDate: '',
      ittDays: '', // Temporary disability days
      ippPercentage: '', // Permanent disability percentage
      needsThirdPerson: false,
      painSeverity: 'none', // none, light, important, very_important
      disfigurementSeverity: 'none', // none, light, important, very_important
      careerImpact: 'none', // none, retirement, promotion_loss, extra_work_loss
      studyInterruption: 'none', // none, partial, total
      isDeathCase: false,
      dependents: [] as { relation: string, age: number, isDisabled: boolean }[]
    };
  });

  useEffect(() => {
    localStorage.setItem('accident_step', step.toString());
    localStorage.setItem('accident_result', JSON.stringify(result));
    localStorage.setItem('accident_formData', JSON.stringify(formData));
  }, [step, result, formData]);

  const handleCalculateLocal = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const input: AccidentInput = {
        age: parseInt(formData.age),
        monthlyIncome: parseFloat(formData.monthlyIncome) || 0,
        hasIncomeProof: formData.hasIncomeProof,
        ittDays: parseInt(formData.ittDays) || 0,
        ippPercentage: parseInt(formData.ippPercentage) || 0,
        needsThirdPerson: formData.needsThirdPerson,
        painSeverity: formData.painSeverity,
        disfigurementSeverity: formData.disfigurementSeverity,
        careerImpact: formData.careerImpact,
        studyInterruption: formData.studyInterruption,
        isDeathCase: formData.isDeathCase
      };

      const localResult = calculateAccidentCompensationLocal(input);
      setResult({
        ...localResult,
        legalAdvice: "هذا الحساب تقديري بناءً على القواعد العامة لظهير 1984. ينصح دائماً باستشارة محامٍ متخصص لتدقيق الملف.",
        isAiGenerated: false
      });
      setStep(4);
    } catch (err) {
      setError("حدث خطأ أثناء الحساب المحلي. يرجى التأكد من صحة البيانات.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center space-y-4 mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-white shadow-xl border border-amber-500/10 mb-4"
        >
          <Car className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />
        </motion.div>
        <h2 className="text-2xl md:text-5xl font-serif font-bold text-slate-900">حساب تعويض <span className="text-amber-600">حوادث السير</span></h2>
        <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
          أداة متطورة لحساب التعويضات المستحقة عن الأضرار البدنية الناتجة عن حوادث السير وفقاً لآخر التعديلات القانونية المغربية (القانون 70.24).
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
                step >= s ? "bg-amber-600 text-white shadow-lg shadow-amber-200" : "bg-slate-100 text-slate-400"
              )}
            >
              {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
          ))}
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-amber-600"
            initial={{ width: '0%' }}
            animate={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>
      </div>

      <div className="luxury-card p-6 md:p-12 zellige-bg relative overflow-hidden">
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
                <User className="w-6 h-6 text-amber-600" />
                <h3 className="text-2xl font-bold text-slate-900">البيانات الشخصية والمهنية</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">السن عند وقوع الحادثة</label>
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500/30 outline-none transition-all"
                    placeholder="مثلاً: 35"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">المهنة</label>
                  <input 
                    type="text" 
                    value={formData.profession}
                    onChange={(e) => setFormData({...formData, profession: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500/30 outline-none transition-all"
                    placeholder="مثلاً: موظف، تاجر..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">الدخل الشهري الصافي (بالدرهم)</label>
                  <input 
                    type="number" 
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500/30 outline-none transition-all"
                    placeholder="مثلاً: 5000"
                  />
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                  <input 
                    type="checkbox" 
                    checked={formData.hasIncomeProof}
                    onChange={(e) => setFormData({...formData, hasIncomeProof: e.target.checked})}
                    className="w-5 h-5 accent-amber-600"
                  />
                  <label className="text-sm font-bold text-slate-700">هل يتوفر إثبات للدخل؟ (شهادة عمل، كشف بنكي...)</label>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={nextStep}
                  disabled={!formData.age || !formData.profession}
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
                <Stethoscope className="w-6 h-6 text-amber-600" />
                <h3 className="text-2xl font-bold text-slate-900">الأضرار البدنية (الخبرة الطبية)</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">مدة العجز المؤقت (ITT) بالأيام</label>
                  <input 
                    type="number" 
                    value={formData.ittDays}
                    onChange={(e) => setFormData({...formData, ittDays: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500/30 outline-none transition-all"
                    placeholder="مثلاً: 45"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">نسبة العجز الدائم (IPP) %</label>
                  <input 
                    type="number" 
                    value={formData.ippPercentage}
                    onChange={(e) => setFormData({...formData, ippPercentage: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500/30 outline-none transition-all"
                    placeholder="مثلاً: 15"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">شدة الألم الجسماني</label>
                  <select 
                    value={formData.painSeverity}
                    onChange={(e) => setFormData({...formData, painSeverity: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500/30 outline-none transition-all"
                  >
                    <option value="none">بدون ألم خاص</option>
                    <option value="light">على جانب من الأهمية</option>
                    <option value="important">مهم</option>
                    <option value="very_important">مهم جداً</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">تشويه الخلقة</label>
                  <select 
                    value={formData.disfigurementSeverity}
                    onChange={(e) => setFormData({...formData, disfigurementSeverity: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500/30 outline-none transition-all"
                  >
                    <option value="none">بدون تشويه</option>
                    <option value="light">على جانب من الأهمية</option>
                    <option value="important">مهم</option>
                    <option value="very_important">مهم جداً</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border-2 border-amber-100">
                <input 
                  type="checkbox" 
                  checked={formData.needsThirdPerson}
                  onChange={(e) => setFormData({...formData, needsThirdPerson: e.target.checked})}
                  className="w-5 h-5 accent-amber-600"
                />
                <label className="text-sm font-bold text-amber-900">هل يحتاج المصاب للاستعانة بشخص آخر للقيام بأعمال الحياة العادية؟</label>
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
                <TrendingUp className="w-6 h-6 text-amber-600" />
                <h3 className="text-2xl font-bold text-slate-900">الآثار المهنية والدراسية</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">التأثير على الحياة المهنية</label>
                  <select 
                    value={formData.careerImpact}
                    onChange={(e) => setFormData({...formData, careerImpact: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500/30 outline-none transition-all"
                  >
                    <option value="none">بدون تأثير مهني خاص</option>
                    <option value="retirement">تعجيل الإحالة إلى التقاعد</option>
                    <option value="promotion_loss">فقدان أهلية الترقي</option>
                    <option value="extra_work_loss">الحرمان من القيام بأعمال إضافية</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">التأثير على الدراسة (للطلبة)</label>
                  <select 
                    value={formData.studyInterruption}
                    onChange={(e) => setFormData({...formData, studyInterruption: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500/30 outline-none transition-all"
                  >
                    <option value="none">لا ينطبق / بدون انقطاع</option>
                    <option value="partial">انقطاع شبه نهائي</option>
                    <option value="total">انقطاع نهائي عن الدراسة</option>
                  </select>
                </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold">تأكيد البيانات</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  سيتم حساب التعويض بناءً على ظهير 1984 وتعديلاته. يرجى التأكد من أن جميع النسب والأرقام مأخوذة من تقرير خبرة طبية رسمي لضمان دقة النتيجة.
                </p>
              </div>

              <div className="flex flex-col gap-4 pt-6">
                <div className="flex gap-4">
                  <button 
                    onClick={prevStep}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                  >
                    <ChevronRight className="w-5 h-5" />
                    <span>السابق</span>
                  </button>
                  <button 
                    onClick={handleCalculateLocal}
                    disabled={isLoading}
                    className="flex-[2] py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-200"
                  >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Calculator className="w-6 h-6" />}
                    <span>احسب التعويض</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && result && (
            <motion.div
              key="result"
              id="accident-result-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 bg-white p-4 rounded-3xl"
            >
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900">نتيجة حساب التعويض التقديرية</h3>
                <div className="inline-block px-8 py-4 bg-slate-900 text-white rounded-[2rem] text-4xl font-black">
                  {result.total.toLocaleString()} <span className="text-amber-400 text-xl">درهم</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-600" />
                      تفاصيل التعويضات
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {result.breakdown.map((item, i) => (
                      <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800">{item.category}</span>
                          <span className="text-amber-600 font-black">{item.amount.toLocaleString()} د.م</span>
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
                  <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-3">
                    <h4 className="font-bold text-amber-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      تحليل الخبير القانوني
                    </h4>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      {result.summary}
                    </p>
                  </div>

                  {result.legalAdvice && (
                    <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-3">
                      <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                        <Scale className="w-5 h-5" />
                        توصيات قانونية
                      </h4>
                      <p className="text-sm text-indigo-800 leading-relaxed italic">
                        {result.legalAdvice}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-center gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  إجراء حساب جديد
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legal Disclaimer */}
      <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-200 flex items-start gap-4">
        <Info className="w-6 h-6 text-slate-400 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-700">تنبيه قانوني هام</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            هذه الأداة تقدم حسابات تقديرية بناءً على النصوص القانونية والاجتهادات القضائية المعمول بها في المغرب. النتائج النهائية للتعويض تخضع لسلطة القضاء التقديرية ولتفاصيل الخبرة الطبية القضائية. لا تعتبر هذه النتائج بمثابة حكم نهائي أو التزام من أي جهة.
          </p>
        </div>
      </div>
    </div>
  );
}
