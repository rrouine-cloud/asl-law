import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckSquare, 
  Sparkles, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  Trophy, 
  AlertCircle, 
  RefreshCw,
  Gavel,
  Users,
  Scale,
  Briefcase,
  Building2,
  Heart,
  Globe,
  ArrowRight,
  X,
  GraduationCap,
  School,
  Award
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ASSESSMENT_POOL } from '../data/legalData';

type Specialization = 'criminal' | 'commercial' | 'civil' | 'family' | 'administrative' | 'social' | 'real_estate' | 'constitutional' | 'regulatory_laws' | 'judicial_authority' | 'constitutional_institutions' | 'judicial_org' | 'electoral';
type AssessmentMode = 'theory' | 'cases' | 'specialized';
type EducationLevel = 'license' | 'master' | 'doctorate';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation: string;
}

interface AssessmentResult {
  score: number;
  total: number;
  level: string;
  advice: string;
}

const specializations = [
  { id: 'civil', label: 'المادة المدنية', icon: Scale, color: 'bg-blue-500' },
  { id: 'criminal', label: 'المادة الجنائية', icon: Gavel, color: 'bg-red-500' },
  { id: 'commercial', label: 'المادة التجارية و الأعمال', icon: Briefcase, color: 'bg-amber-500' },
  { id: 'constitutional', label: 'المادة الدستورية', icon: Building2, color: 'bg-violet-500' },
  { id: 'regulatory_laws', label: 'القوانين التنظيمية', icon: Scale, color: 'bg-indigo-500' },
  { id: 'judicial_authority', label: 'السلطة القضائية', icon: Gavel, color: 'bg-teal-500' },
  { id: 'constitutional_institutions', label: 'المؤسسات الدستورية', icon: Building2, color: 'bg-cyan-500' },
  { id: 'judicial_org', label: 'التنظيم القضائي', icon: Scale, color: 'bg-rose-500' },
  { id: 'electoral', label: 'المادة الانتخابية', icon: CheckSquare, color: 'bg-fuchsia-500' },
  { id: 'social', label: 'المادة الاجتماعية', icon: Heart, color: 'bg-orange-500' },
  { id: 'family', label: 'المادة الأسرية', icon: Users, color: 'bg-pink-500' },
  { id: 'administrative', label: 'المادة الادارية', icon: Building2, color: 'bg-slate-500' },
  { id: 'real_estate', label: 'المادة العقارية', icon: Globe, color: 'bg-emerald-500' },
];

export default function SelfAssessment() {
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | null>(null);
  const [selectedSpec, setSelectedSpec] = useState<Specialization | null>(null);
  const [mode, setMode] = useState<AssessmentMode>('theory');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestedTopic, setSuggestedTopic] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const generateQuestions = async (spec: Specialization, assessmentMode: AssessmentMode) => {
    if (assessmentMode === 'specialized') {
      generateSpecializedTopic(spec);
      return;
    }
    setIsGenerating(true);
    setError(null);
    setQuestions([]);
    setCurrentIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setAssessmentResult(null);
    setAnalysisResult(null);

    const specLabel = specializations.find(s => s.id === spec)?.label;

    const theoryPrompt = `قم بتوليد 20 سؤالاً متعدد الاختيارات (QCM) في تخصص "${specLabel}" بناءً على القانون المغربي. 
    يجب أن تكون الأسئلة دقيقة وتختبر الفهم العميق للمواد القانونية.
    لكل سؤال، قدم 4 خيارات، وحدد الإجابة الصحيحة، وقدم شرحاً موجزاً للتعليل القانوني.`;

    const casesPrompt = `قم بتوليد 10 "نوازل قانونية" (Legal Cases) في تخصص "${specLabel}" مستمدة من الواقع العملي للمحاكم المغربية ومن نصوص القانون المغربي وإشكالات الاجتهاد القضائي.
    كل نازلة يجب أن تكون عبارة عن سيناريو واقعي معقد يتطلب تحليلاً قانونياً.
    لكل نازلة، قدم 4 خيارات للحل القانوني الصحيح، وحدد الخيار الصحيح مع تعليل قانوني مفصل يذكر المواد القانونية والاجتهادات القضائية ذات الصلة.`;

    // 1. Offline/Free Mode Fallback
    if (!navigator.onLine) {
      const localQuestions = assessmentMode === 'theory' ? ASSESSMENT_POOL.theory : ASSESSMENT_POOL.cases;
      setQuestions(localQuestions);
      setIsGenerating(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const localPool = assessmentMode === 'theory' ? ASSESSMENT_POOL.theory : ASSESSMENT_POOL.cases;
      const shuffled = [...localPool].sort(() => 0.5 - Math.random());
      setQuestions(shuffled.slice(0, 10));
    } catch (err: any) {
      console.error("Generation error:", err);
      setError("عذراً، حدث خطأ أثناء تحميل الأسئلة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSpecializedTopic = async (spec: Specialization) => {
    setIsGenerating(true);
    setError(null);
    setSuggestedTopic(null);
    setAnalysisResult(null);

    await new Promise(resolve => setTimeout(resolve, 800));

    const LOCAL_TOPICS: Record<Specialization, string> = {
      civil: "أثر نظرية الظروف الطارئة على الالتزامات العقدية في ضوء أحكام قانون الالتزامات والعقود المغربي.",
      criminal: "العقوبات البديلة في القانون الجنائي المغربي وآفاق تفعيلها للحد من الاكتظاظ السجني.",
      commercial: "المسؤولية القانونية لمسيري الشركات التجارية في حالة صعوبات المقاولة طبقاً لمدونة التجارة.",
      constitutional: "دور المحكمة الدستورية المغربية في مراقبة دستورية القوانين وحماية الحقوق والحريات.",
      regulatory_laws: "القوانين التنظيمية المتعلقة بالجماعات الترابية ومبدأ التدبير الحر بالمغرب.",
      judicial_authority: "استقلال السلطة القضائية في المغرب بين الوثيقة الدستورية والواقع العملي.",
      constitutional_institutions: "دور مجلس المنافسة في تنظيم السوق ومحاربة الممارسات الاحتكارية بالمغرب.",
      judicial_org: "مستجدات قانون التنظيم القضائي الجديد للمملكة وأثره على نجاعة العدالة.",
      electoral: "النظام الانتخابي المغربي وضمانات نزاهة العمليات الانتخابية.",
      social: "حماية الأجير في حالة الفصل التعسفي في ضوء مقتضيات مدونة الشغل المغربية والعمل القضائي.",
      family: "إشكاليات تطبيق مقتضيات مدونة الأسرة المغربية بعد مرور عقدين على صدورها وآفاق التعديل.",
      administrative: "دعوى إلغاء القرارات الإدارية بسبب الشطط في استعمال السلطة أمام المحاكم الإدارية.",
      real_estate: "إجراءات التحفيظ العقاري في المغرب ودور المحافظ في حماية الملكية العقارية."
    };

    setSuggestedTopic(LOCAL_TOPICS[spec] || "بحث تحليلي في نظرية البطلان والابطال في القانون المدني المغربي.");
    setIsGenerating(false);
  };

  const analyzeHandwriting = async () => {
    if (!suggestedTopic) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const localAnalysis = `تحليل وتوجيه قانوني منهجي للموضوع المقترح: "${suggestedTopic}"

1. المنهجية الموصى بها لمعالجة الموضوع:
   - المقدمة: الإطار العام للموضوع، أهمية الموضوع (العملية والنظرية)، الإشكالية المحورية (طرح التساؤل الرئيسي)، والتصميم المعتمد (تقسيم ثنائي: مبحثين).
   - المبحث الأول: التأصيل القانوني والمفاهيمي (الأسس التشريعية المغربية).
   - Mبحث الثاني: الإشكاليات التطبيقية والعمل القضائي (مواقف المحاكم ومحكمة النقض).
   - الخاتمة: استخلاص النتائج وتقديم مقترحات وتوصيات عملية وتعديلات تشريعية مطلوبة.

2. المراجع والنصوص الواجب الإحالة عليها:
   - القوانين والمدونات ذات الصلة المباشرة بالموضوع.
   - قرارات محكمة النقض المغربية الحديثة التي كرست مبادئ هامة في هذا الصدد.
   - الآراء الفقهية الكبرى لتوضيح أوجه الخلاف والتأصيل العلمي.

3. نصائح ذهبية للمترشح:
   - احرص على استخدام مصطلحات قانونية دقيقة وتجنب الحشو اللغوي.
   - ركز على التحليل والنقد البناء بدلاً من مجرد السرد التلقائي للمواد القانونية.
   - احترم مبدأ التوازن بين شقي التصميم المعتمد قدر الإمكان لضمان منهجية رصينة ومقبولة في الامتحانات المهنية والمباريات القضائية.`;

    setAnalysisResult(localAnalysis);
    setIsAnalyzing(false);
  };

  const calculateResult = async () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.correctAnswer) {
        score++;
      }
    });

    const total = questions.length;
    const percentage = (score / total) * 100;

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    let level = "مبتدئ";
    let advice = "تحتاج إلى مراجعة القواعد الأساسية للنصوص القانونية المعنية والاطلاع على المبادئ العامة لتعزيز معارفك.";
    
    if (percentage >= 90) {
      level = "خبير / ممتاز";
      advice = "أداء استثنائي! لديك تمكن تام ودقيق من المواد القانونية والتفاصيل الدقيقة والاجتهاد القضائي المغربي. استمر في هذا المستوى الرائع!";
    } else if (percentage >= 70) {
      level = "متقدم / جيد جداً";
      advice = "مستوى متميز جداً. تملك فهماً قوياً للمقتضيات القانونية وتطبيقاتها. ينصح بمواصلة الاطلاع على مستجدات العمل القضائي الحديثة لتصل لدرجة التميز.";
    } else if (percentage >= 50) {
      level = "متوسط / مقبول";
      advice = "لديك قاعدة معرفية جيدة ولكن هناك بعض الثغرات في الاستدلال والتكييف الدقيق. ركز على قراءة المواد التفصيلية وشروحات المواد لتطوير مستواك.";
    }

    setAssessmentResult({
      score,
      total,
      level,
      advice
    });
    setShowResults(true);
    setIsGenerating(false);
  };

  const handleAnswer = (optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  if (!selectedLevel) {
    return (
      <div className="py-12 space-y-12">
        {/* Offline Banner */}
        <AnimatePresence>
          {isOffline && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto mb-8 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 shadow-sm"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">أنت في وضع عدم الاتصال</p>
                <p className="text-[10px] opacity-80">تم تفعيل الاختبارات المحلية المتاحة.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-amber-50 border border-amber-500/10 mb-4"
          >
            <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />
          </motion.div>
          <h2 className="text-5xl font-serif font-bold text-slate-900">اختر مستواك الدراسي</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light">
            حدد مستواك الحالي لنتمكن من تخصيص الأسئلة والمواضيع القانونية بما يتناسب مع مسارك الأكاديمي.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
          {[
            { id: 'license', label: 'سلك الإجازة', desc: 'مواضيع أساسية واختبارات للمواد الجذعية', icon: GraduationCap, color: 'bg-blue-500' },
            { id: 'master', label: 'سلك الماستر', desc: 'مواضيع معمقة ونوازل قانونية مركبة', icon: School, color: 'bg-amber-500' },
            { id: 'doctorate', label: 'سلك الدكتوراه', desc: 'مواضيع نقدية، مقارنة وأطروحات بحثية', icon: Award, color: 'bg-purple-500' },
          ].map((level) => (
            <motion.button
              key={level.id}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedLevel(level.id as EducationLevel)}
              className="luxury-card p-10 flex flex-col items-center text-center gap-6 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -mr-16 -mt-16 transition-all group-hover:bg-amber-50" />
              
              <div className={cn(
                "w-16 h-16 md:w-20 md:h-20 rounded-[28px] flex items-center justify-center text-white shadow-2xl relative z-10 transition-transform group-hover:rotate-12",
                level.color
              )}>
                <level.icon className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              
              <div className="space-y-2 relative z-10">
                <h3 className="text-2xl font-serif font-bold text-slate-800">{level.label}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{level.desc}</p>
              </div>

              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm group-hover:gap-4 transition-all">
                <span>اختيار هذا المستوى</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedSpec) {
    return (
      <div className="py-12 space-y-12">
        <div className="flex items-center justify-between max-w-6xl mx-auto px-4">
          <button 
            onClick={() => setSelectedLevel(null)}
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-amber-600 transition-all flex items-center gap-2 font-bold"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            <span>تغيير المستوى</span>
          </button>
          <div className="px-6 py-2 rounded-full bg-amber-100 text-amber-900 font-black text-sm uppercase tracking-widest">
            {selectedLevel === 'license' ? 'سلك الإجازة' : selectedLevel === 'master' ? 'سلك الماستر' : 'سلك الدكتوراه'}
          </div>
        </div>

        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-amber-50 border border-amber-500/10 mb-4"
          >
            <CheckSquare className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />
          </motion.div>
          <h2 className="text-5xl font-serif font-bold text-slate-900">التقييم الشخصي القانوني</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light">
            اختبر معلوماتك القانونية من خلال أسئلة نظرية أو نوازل واقعية مستنبطة من القوانين المغربية لتقييم مستواك المعرفي والعملي.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button 
              onClick={() => setMode('theory')}
              className={cn(
                "px-6 py-3 pl-4 rounded-2xl font-bold transition-all border-2",
                mode === 'theory' 
                  ? "bg-amber-600 border-amber-600 text-white shadow-lg" 
                  : "bg-white border-slate-200 text-slate-500 hover:border-amber-500/30"
              )}
            >
              أسئلة نظرية (QCM)
            </button>
            <button 
              onClick={() => setMode('cases')}
              className={cn(
                "px-6 py-3 rounded-2xl font-bold transition-all border-2",
                mode === 'cases' 
                  ? "bg-amber-600 border-amber-600 text-white shadow-lg" 
                  : "bg-white border-slate-200 text-slate-500 hover:border-amber-500/30"
              )}
            >
              نوازل قانونية (واقعية)
            </button>
            <button 
              onClick={() => setMode('specialized')}
              className={cn(
                "px-6 py-3 rounded-2xl font-bold transition-all border-2",
                mode === 'specialized' 
                  ? "bg-amber-600 border-amber-600 text-white shadow-lg" 
                  : "bg-white border-slate-200 text-slate-500 hover:border-amber-500/30"
              )}
            >
              مواضيع متخصصة (Scan)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          {specializations.map((spec) => (
            <motion.button
              key={spec.id}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedSpec(spec.id as Specialization);
                generateQuestions(spec.id as Specialization, mode);
              }}
              className="luxury-card p-8 flex flex-col items-center text-center gap-6 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -mr-16 -mt-16 transition-all group-hover:bg-amber-50" />
              
              <div className={cn(
                "w-16 h-16 md:w-20 md:h-20 rounded-[28px] flex items-center justify-center text-white shadow-2xl relative z-10 transition-transform group-hover:rotate-12",
                spec.color
              )}>
                <spec.icon className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              
              <div className="space-y-2 relative z-10">
                <h3 className="text-2xl font-serif font-bold text-slate-800">{spec.label}</h3>
                <p className="text-sm text-slate-500">
                  {mode === 'theory' ? '20 سؤالاً نظرياً' : mode === 'cases' ? '10 نوازل واقعية' : 'تحليل مقال بخط اليد'} في {spec.label}
                </p>
              </div>

              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm group-hover:gap-4 transition-all">
                <span>ابدأ {mode === 'theory' ? 'الاختبار' : mode === 'cases' ? 'التحليل' : 'التجربة'}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-amber-100 border-t-amber-600 animate-spin" />
          <Sparkles className="w-8 h-8 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-serif font-bold text-slate-800">جاري تحضير الأسئلة...</h3>
          <p className="text-slate-500">نقوم بتوليد اختبار مخصص بناءً على آخر المستجدات القانونية.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-600">
          <AlertCircle className="w-10 h-10" />
        </div>
        <p className="text-xl font-bold text-slate-800">{error}</p>
        <div className="flex gap-4">
          <button 
            onClick={() => selectedSpec && generateQuestions(selectedSpec, mode)}
            className="px-8 py-3 rounded-2xl bg-amber-600 text-white font-bold shadow-lg hover:bg-amber-700 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            إعادة المحاولة
          </button>
          <button 
            onClick={() => {
              const localQuestions = mode === 'theory' ? ASSESSMENT_POOL.theory : ASSESSMENT_POOL.cases;
              setQuestions(localQuestions);
              setError(null);
            }}
            className="px-8 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
          >
            استخدام الأسئلة المحلية
          </button>
        </div>
      </div>
    );
  }

  if (showResults && assessmentResult) {
    const percentage = (assessmentResult.score / assessmentResult.total) * 100;
    
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-12">
        <div className="luxury-card p-12 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-amber-50 border-4 border-amber-100 mb-4"
          >
            <Trophy className="w-12 h-12 md:w-16 md:h-16 text-amber-600" />
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-4xl font-serif font-bold text-slate-900">نتيجتك النهائية</h2>
            <div className="text-7xl font-black text-amber-600">{assessmentResult.score} / {assessmentResult.total}</div>
            <div className="inline-block px-6 py-2 rounded-full bg-amber-100 text-amber-900 font-black text-xl uppercase tracking-widest">
              المستوى: {assessmentResult.level}
            </div>
            <p className="text-xl text-slate-500">لقد أجبت بشكل صحيح على {percentage}% من الأسئلة.</p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-right space-y-4">
            <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" />
              نصائح لتطوير مستواك:
            </h4>
            <p className="text-slate-600 leading-relaxed text-lg">{assessmentResult.advice}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => generateQuestions(selectedSpec!, mode)}
              className="px-8 py-4 rounded-2xl bg-amber-600 text-white font-bold shadow-xl shadow-amber-600/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              إعادة الاختبار
            </button>
            <button 
              onClick={() => setSelectedSpec(null)}
              className="px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
            >
              اختيار تخصص آخر
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-serif font-bold text-slate-800 px-4">مراجعة الإجابات والتعليل القانوني</h3>
          <div className="space-y-6">
            {questions.map((q, i) => (
              <div key={i} className={cn(
                "luxury-card p-8 border-r-8",
                userAnswers[i] === q.correctAnswer ? "border-r-green-500" : "border-r-red-500"
              )}>
                <div className="flex justify-between items-start gap-4 mb-6">
                  <h4 className="text-xl font-bold text-slate-800 leading-relaxed">{i + 1}. {q.text}</h4>
                  {userAnswers[i] === q.correctAnswer ? (
                    <span className="px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold shrink-0">إجابة صحيحة</span>
                  ) : (
                    <span className="px-4 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-bold shrink-0">إجابة خاطئة</span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {q.options.map((opt, optIdx) => (
                    <div 
                      key={optIdx}
                      className={cn(
                        "p-4 rounded-xl border text-sm transition-all",
                        optIdx === q.correctAnswer 
                          ? "bg-green-50 border-green-200 text-green-900 font-bold" 
                          : optIdx === userAnswers[i]
                            ? "bg-red-50 border-red-200 text-red-900"
                            : "bg-slate-50 border-slate-100 text-slate-500"
                      )}
                    >
                      {opt}
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>التعليل القانوني:</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  if (selectedSpec && mode === 'specialized') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        <div className="flex items-center justify-between gap-6">
          <button 
            onClick={() => setSelectedSpec(null)}
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-amber-600 transition-all"
          >
            <ArrowRight className="w-6 h-6 rotate-180" />
          </button>
          <h2 className="text-3xl font-serif font-bold text-slate-900">تحليل مقال قانوني متخصص</h2>
        </div>

        <div className="luxury-card p-10 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-bl-[100px] -mr-12 -mt-12" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3 text-amber-600 font-black text-xs uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>الموضوع المقترح</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 leading-relaxed">
              {suggestedTopic || "جاري توليد الموضوع..."}
            </h3>
            <p className="text-slate-500 text-lg leading-relaxed">
              قم بكتابة مقال تحليلي حول هذا الموضوع بخط يدك، ثم قم بتصويره أو مسحه ضوئياً ورفعه هنا للتحليل والتقييم.
            </p>
          </div>

          <div className="pt-8 border-t border-slate-100 space-y-8 relative z-10">
            {!analysisResult && (
              <button 
                onClick={analyzeHandwriting}
                disabled={isAnalyzing}
                className="w-full py-6 bg-amber-600 text-white font-bold rounded-[2rem] shadow-2xl shadow-amber-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>جاري تحليل وتوليد الإجابة...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>عرض التحليل والاجابة التدريبية</span>
                  </>
                )}
              </button>
            )}

            {analysisResult && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-[32px] bg-slate-900 text-white space-y-6 shadow-2xl"
              >
                <div className="flex items-center gap-3 text-amber-400 font-black text-xs uppercase tracking-widest">
                  <Trophy className="w-4 h-4" />
                  <span>نتيجة التحليل والتقييم</span>
                </div>
                <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                  {analysisResult}
                </div>
                <button 
                  onClick={() => {
                    setAnalysisResult(null);
                    generateSpecializedTopic(selectedSpec!);
                  }}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all border border-white/10"
                >
                  تجربة موضوع جديد
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      {/* Progress Header */}
      <div className="flex items-center justify-between gap-6">
        <button 
          onClick={() => setSelectedSpec(null)}
          className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-amber-600 transition-all"
        >
          <ArrowRight className="w-6 h-6 rotate-180" />
        </button>
        
        <div className="flex-1 space-y-2">
          <div className="flex justify-between text-sm font-bold text-slate-500">
            <span>السؤال {currentIndex + 1} من {questions.length}</span>
            <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
            />
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-500/10 text-amber-700 text-xs font-black uppercase tracking-widest">
          {specializations.find(s => s.id === selectedSpec)?.label}
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="luxury-card p-10 md:p-16 space-y-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-bl-[120px] -mr-12 -mt-12 blur-3xl" />
          
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 leading-relaxed relative z-10">
            {currentQuestion.text}
          </h3>

          <div className="grid grid-cols-1 gap-4 relative z-10">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={cn(
                  "p-6 rounded-2xl border-2 text-right transition-all duration-300 flex items-center gap-4 group",
                  userAnswers[currentIndex] === idx
                    ? "bg-amber-600 border-amber-600 text-white shadow-xl shadow-amber-600/20 scale-[1.02]"
                    : "bg-white border-slate-100 text-slate-600 hover:border-amber-500/30 hover:bg-amber-50/30"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 font-bold text-sm transition-colors",
                  userAnswers[currentIndex] === idx
                    ? "bg-white text-amber-600 border-white"
                    : "border-slate-200 text-slate-400 group-hover:border-amber-500 group-hover:text-amber-600"
                )}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-lg font-medium">{option}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center gap-4">
        <button
          onClick={prevQuestion}
          disabled={currentIndex === 0}
          className={cn(
            "px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2",
            currentIndex === 0
              ? "bg-slate-100 text-slate-300 cursor-not-allowed"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          )}
        >
          <ChevronRight className="w-5 h-5" />
          السابق
        </button>

        <button
          onClick={nextQuestion}
          disabled={userAnswers[currentIndex] === undefined}
          className={cn(
            "px-12 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-xl",
            userAnswers[currentIndex] === undefined
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-amber-600 text-white shadow-amber-600/20 hover:scale-105 active:scale-95"
          )}
        >
          <span>{currentIndex === questions.length - 1 ? "إنهاء الاختبار" : "التالي"}</span>
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
