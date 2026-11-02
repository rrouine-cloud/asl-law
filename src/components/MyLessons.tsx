import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, GraduationCap, ChevronLeft, Search, Book, LayoutGrid, List, 
  ArrowRight, ClipboardList, X, ChevronRight, Layers, HelpCircle,
  FileText, Scale as ScaleIcon, Building2, Users, Briefcase, Landmark, Coins,
  Shield, Heart, Home as HomeIcon, Globe, User, Bookmark
} from 'lucide-react';
import { cn } from '../lib/utils';
import { lawIntroductionContent, shariaIntroductionContent, sociologyOfLawContent, constitutionalLawContent, LessonSection, legalArticlesData, legalTextsData } from '../lib/lessonsData';

const levels = [
  { id: 'license', name: 'سلك الإجازة', icon: GraduationCap },
  { id: 'articles', name: 'مقالات قانونية', icon: FileText },
  { id: 'laws', name: 'نصوص قانونية', icon: ScaleIcon },
  { id: 'theses', name: 'رسائل وأطاريح', icon: BookOpen },
];

const initialTheses = [
  {
    id: '1',
    title: 'الدولة الاجتماعية وسؤال المنظومة القانونية',
    author: 'باحث قانوني',
    url: 'https://drive.google.com/file/d/1an_AjpuXgktrkP6cFZyfSWVJU_HdGAup/view?usp=sharing',
    date: '2024',
    type: 'رسالة لنيل الماستر'
  },
  {
    id: '2',
    title: 'دور الرقمنة في تحسين وتجويد الخدمات الادارية بالمغرب',
    author: 'باحث قانوني',
    url: 'https://drive.google.com/file/to/1pctUylH7jncidmDIYFytDtBGuuwdMt8M/view?usp=sharing',
    date: '2023',
    type: 'أطروحة دكتوراه'
  },
  {
    id: '3',
    title: 'التبليغ التقليدي والالكتروني في العمل القضائي',
    author: 'باحث قانوني',
    url: 'https://drive.google.com/file/d/1BT5pSzULys9L7YJUgIPk-D4TEaY1uR-T/view?usp=sharing',
    date: '2024',
    type: 'رسالة لنيل الماستر'
  },
  {
    id: '4',
    title: 'برامج التنمية الجهوية واشكالية التقائية السياسات العمومية',
    author: 'باحث قانوني',
    url: 'https://drive.google.com/file/d/1HoLnYj9Gq7uPIEmy0zs-whCDrw--x0D9/view?usp=sharing',
    date: '2024',
    type: 'رسالة لنيل الماستر'
  },
  {
    id: '5',
    title: 'مساطر تحصيل الديون العمومية بين الأمن القانوني والقضائي',
    author: 'باحث قانوني',
    url: 'https://drive.google.com/file/d/1imLC0yBmcP8tdBRB9TtjccjEnbxQ1pkN/view?usp=sharing',
    date: '2024',
    type: 'رسالة لنيل الماستر'
  },
  {
    id: '6',
    title: 'الإصلاح الجبائي ركيزة لإصلاح الدولة الاجتماعية',
    author: 'باحث قانوني',
    url: 'https://drive.google.com/file/d/1e5-eX3Pl3SBn5N2Lh5TKyoK96dy98jC5/view?usp=sharing',
    date: '2024',
    type: 'رسالة لنيل الماستر'
  },
  {
    id: '7',
    title: 'الإصلاح الجبائي والاستدامة المالية',
    author: 'باحث قانوني',
    url: 'https://drive.google.com/file/d/1Zn7YqScijP7DIEtqAG3cxV_rvmzLka31/view?usp=sharing',
    date: '2024',
    type: 'أطروحة دكتوراه'
  },
  {
    id: '8',
    title: 'تطور البرلمانية المعقلنة ضمن التجربة الدستورية المغربية',
    author: 'باحث قانوني',
    url: 'https://drive.google.com/file/d/15vxJfgV396Awq0TqAj64H_x-bS0iPV9G/view?usp=sharing',
    date: '2024',
    type: 'رسالة لنيل الماستر'
  },
  {
    id: '9',
    title: 'السياسة الضريبية بالمغرب ورهانات تحقيق الدولة الاجتماعية',
    author: 'باحث قانوني',
    url: 'https://drive.google.com/file/d/1H0fKkpKqaq3wE09NZNEMTrYGBOhclHLm/view?usp=sharing',
    date: '2024',
    type: 'رسالة لنيل الماستر'
  },
  {
    id: '10',
    title: 'السياسات الطاقية بالمغرب ورهان الانتقال الى الاقتصاد الأخضر',
    author: 'باحث قانوني',
    url: 'https://drive.google.com/file/d/1NyDILj7yfl3h5B7ccBc17JyDTUEieio-/view?usp=sharing',
    date: '2024',
    type: 'رسالة لنيل الماستر'
  },
  {
    id: '11',
    title: 'المديونية الخارجية واشكالية استدامة المالية العمومية بالمغرب',
    author: 'باحث قانوني',
    url: 'https://drive.google.com/file/d/1_iDQGL8YIM2g_iQB4e7peGhlkWYWZrle/view?usp=sharing',
    date: '2024',
    type: 'أطروحة دكتوراه'
  },
  {
    id: '12',
    title: 'المشاركة السياسية وتكريس حقوق المواطنة',
    author: 'باحث قانوني',
    url: 'https://drive.google.com/file/d/1ERTVdiTJj2JbZ7I4mrgkFr7MVtq6EimA/view?usp=sharing',
    date: '2024',
    type: 'رسالة لنيل الماستر'
  }
];

const licenseData = [
  {
    semester: 'الفصل الأول',
    subjects: [
      'مدخل لدراسة القانون',
      'مدخل لدراسة الشريعة',
      'علم الاجتماع القانوني',
      'النظرية العامة للقانون الدستوري',
      'مدخل لعلم السياسة',
      'اللغات الاجنبية',
      'المهارات الحياتية والذاتية'
    ]
  },
  {
    semester: 'الفصل الثاني',
    subjects: [
      'القانون الجنائي العام',
      'القانون التجاري الاساسي',
      'مدخل للعلاقات الدولية',
      'النظرية العامة للإلتزامات و العقود',
      'مدخل الى القانون الاداري و التنظيم الإداري',
      'اللغات الاجنبية',
      'المهارات الرقمية والمعلوماتية'
    ]
  },
  {
    semester: 'الفصل الثالث',
    subjects: [
      'قانون الأسرة',
      'القانون الإجتماعي',
      'المالية العامة',
      'القانون الجنائي الخاص',
      'النشاط الإداري',
      'اللغات الأجنبية',
      'المهارات الفنية والثقافية'
    ]
  },
  {
    semester: 'الفصل الرابع',
    subjects: [
      'قانون الشركات',
      'التنظيم القضائي',
      'القانون العقاري',
      'المنازعات الإدارية',
      'حقوق الانسان والحريات العامة',
      'اللغات الأجنبية',
      'المهارات الحياتية والذاتية'
    ]
  },
  {
    semester: 'الفصل الخامس',
    subjects: [
      'القانون الدولي الخاص',
      'الحقوق العينية',
      'مسؤولية مهني القانون والقضاء',
      'قانون الرقمنة والذكاء الاصطناعي',
      'مساعدوا العدالة',
      'اللغات الأجنبية',
      'المهارات الرقمية المعلوماتية'
    ]
  },
  {
    semester: 'الفصل السادس',
    subjects: [
      'المسطرة المدنية',
      'المسطرة الجنائية',
      'المواريث والحقوق المالية',
      'الوسائل البديلة لتسوية المنازعات',
      'ممارسة الترافع',
      'اللغات الأجنبية',
      'المهارات الحياتية والذاتية'
    ]
  },
  {
    semester: 'تخصص المال والأعمال',
    subjects: [
      'مدخل للمحاسبة الخاصة بالمقاولات',
      'صعوبة المقاولة',
      'العقود التجارية',
      'وسائل الأداء والإئتمان',
      'قانون الرقمنة والذكاء الاصطناعي',
      'القانون البنكي',
      'قانون الملكية الفكرية',
      'قانون التأمين',
      'أساسيات في مالية المقاولة'
    ]
  }
];

function LessonViewer({ onClose, content, title }: { onClose: () => void, content: LessonSection[], title: string }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const renderFormattedParagraph = (p: string, i: number) => {
    const trimmed = p.trim();

    // 1. Meta information (Author / Date / Researcher)
    if (trimmed.startsWith('الكاتب:') || trimmed.startsWith('التاريخ:') || trimmed.startsWith('الباحث:') || trimmed.startsWith('الباحثة:') || trimmed.startsWith('طالب باحث') || trimmed.startsWith('دكتور في')) {
      return (
        <div key={i} className="inline-flex items-center gap-2 px-3.5 py-1.5 my-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 font-medium text-xs md:text-sm border border-amber-200/80 dark:border-amber-800/80">
          <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{p}</span>
        </div>
      );
    }

    // 2. المباحث (Deep Indigo Theme)
    if (/^المبحث\b/.test(trimmed) || trimmed.startsWith('المبحث الأول') || trimmed.startsWith('المبحث الثاني') || trimmed.startsWith('المبحث الثالث') || trimmed.startsWith('المبحث الرابع')) {
      return (
        <div key={i} className="my-6 p-4 rounded-xl bg-gradient-to-l from-indigo-50/90 via-indigo-100/70 to-indigo-50/90 dark:from-indigo-950/80 dark:via-indigo-900/60 dark:to-indigo-950/80 border-r-4 border-indigo-600 dark:border-indigo-400 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <h4 className="text-lg md:text-xl font-bold font-serif text-indigo-950 dark:text-indigo-100 leading-snug">
            {p}
          </h4>
        </div>
      );
    }

    // 3. المطالب (Emerald Forest Theme)
    if (/^المطلب\b/.test(trimmed) || trimmed.startsWith('المطلب الأول') || trimmed.startsWith('المطلب الثاني') || trimmed.startsWith('المطلب الثالث') || trimmed.startsWith('المطلب الرابع')) {
      return (
        <div key={i} className="my-5 p-3.5 rounded-xl bg-gradient-to-l from-emerald-50/90 via-emerald-100/60 to-emerald-50/90 dark:from-emerald-950/70 dark:via-emerald-900/50 dark:to-emerald-950/70 border-r-4 border-emerald-500 dark:border-emerald-400 shadow-xs flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <h5 className="text-base md:text-lg font-bold font-serif text-emerald-950 dark:text-emerald-100 leading-snug">
            {p}
          </h5>
        </div>
      );
    }

    // 4. الفقرات (Vibrant Purple Theme)
    if (/^الفقرة\b/.test(trimmed) || trimmed.startsWith('الفقرة الأولى') || trimmed.startsWith('الفقرة الثانية') || trimmed.startsWith('الفقرة الثالثة')) {
      return (
        <div key={i} className="my-4 px-4 py-2.5 rounded-lg bg-purple-50/90 dark:bg-purple-950/50 border-r-4 border-purple-500 dark:border-purple-400 flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
          <h6 className="text-base md:text-lg font-bold font-serif text-purple-950 dark:text-purple-100">
            {p}
          </h6>
        </div>
      );
    }

    // 5. المحاور (Sky Blue / Cyan Theme)
    if (/^المحور\b/.test(trimmed) || trimmed.startsWith('المحور الأول') || trimmed.startsWith('المحور الثاني') || trimmed.startsWith('المحور الثالث') || trimmed.startsWith('محور')) {
      return (
        <div key={i} className="my-4 px-4 py-2.5 rounded-lg bg-sky-50/90 dark:bg-sky-950/50 border-r-4 border-sky-500 dark:border-sky-400 flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
          <h6 className="text-base md:text-lg font-bold font-serif text-sky-950 dark:text-sky-100">
            {p}
          </h6>
        </div>
      );
    }

    // 6. التقسيمات الترتيبية الفرعية (أولا، ثانيا، ثالثا، رابعا...) (Warm Amber Theme)
    if (/^(أولا|ثانيا|ثالثا|رابعا|خامسا|سادسا|سابعا|ثامنا|تاسعا|عاشرا)(\s*[:：\.-]|\b)/.test(trimmed)) {
      return (
        <div key={i} className="my-3.5 px-3.5 py-2 rounded-lg bg-amber-50/90 dark:bg-amber-950/40 border-r-3 border-amber-500 dark:border-amber-400">
          <span className="font-bold font-serif text-base md:text-lg text-amber-950 dark:text-amber-100">
            {p}
          </span>
        </div>
      );
    }

    // 7. الآراء الفقهية والاتجاهات (Teal / Cyan Theme)
    if (/^(الرأي الأول|الرأي الثاني|الرأي الثالث|الاتجاه الأول|الاتجاه الثاني|الموقف الأول|الموقف الثاني)(\s*[:：\.-]|\b)/.test(trimmed)) {
      return (
        <div key={i} className="my-3 px-3.5 py-2 rounded-lg bg-teal-50/80 dark:bg-teal-950/40 border-r-3 border-teal-500 text-teal-950 dark:text-teal-100">
          <span className="font-bold text-base md:text-lg">
            {p}
          </span>
        </div>
      );
    }

    // 8. مقدمة، خاتمة، ملخص، إشكالية، أهمية الموضوع (Rose / Fuchsia / Blue Callout Boxes)
    if (/^(مقدمة|المقدمة)(\s*[:：\.-]|\b)/.test(trimmed)) {
      return (
        <div key={i} className="my-5 p-3.5 rounded-xl bg-rose-50/90 dark:bg-rose-950/40 border-r-4 border-rose-500 flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
          <h4 className="text-lg md:text-xl font-bold font-serif text-rose-950 dark:text-rose-100">
            {p}
          </h4>
        </div>
      );
    }

    if (/^(خاتمة|الخاتمة)(\s*[:：\.-]|\b)/.test(trimmed)) {
      return (
        <div key={i} className="my-5 p-3.5 rounded-xl bg-fuchsia-50/90 dark:bg-fuchsia-950/40 border-r-4 border-fuchsia-500 flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 shrink-0" />
          <h4 className="text-lg md:text-xl font-bold font-serif text-fuchsia-950 dark:text-fuchsia-100">
            {p}
          </h4>
        </div>
      );
    }

    if (/^(الملخص|ملخص|أهمية الموضوع|دوافع اختيار الموضوع|الدراسات السابقة|إشكالية البحث|الإشكالية المحورية|الإشكالية المركزية|الكلمات المفتاحية)(\s*[:：\.-]|\b)/.test(trimmed)) {
      return (
        <div key={i} className="my-4 p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 shadow-xs">
          <h5 className="font-bold text-base md:text-lg text-blue-950 dark:text-blue-100 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>{p}</span>
          </h5>
        </div>
      );
    }

    // Default Paragraph
    return (
      <p key={i} className="text-base md:text-lg text-slate-800 dark:text-slate-200 leading-[1.9] text-justify font-normal">
        {p}
      </p>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed inset-0 z-[1000] bg-white dark:bg-slate-900 flex flex-col"
    >
      {/* Sticky Top Bar */}
      <div className="h-16 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white truncate">{title}</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">قراءة النص الكامل</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onClose}
            className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">إغلاق</span>
          </button>
        </div>
      </div>

      {/* Main Content Area - Full Clean Document Flow (No outer box cards) */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 custom-scrollbar">
        <div className="max-w-3xl mx-auto px-5 md:px-10 py-8 md:py-12 space-y-10">
          {content.map((section, idx) => (
            <div 
              key={idx}
              className="space-y-5 pb-8 border-b border-slate-100 dark:border-slate-800/80 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[11px] font-bold rounded-md border border-amber-200/50 dark:border-amber-800/50">
                  القسم {idx + 1}
                </span>
              </div>
              
              <h4 className="text-xl md:text-2xl font-serif font-bold text-slate-900 dark:text-white leading-snug border-r-3 border-amber-500 pr-3">
                {section.title}
              </h4>
              
              <div className="space-y-4">
                {section.content.map((p, i) => renderFormattedParagraph(p, i))}
              </div>

              {section.diagram && (
                <div className="p-4 my-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase">
                    <Layers className="w-4 h-4" />
                    توضيح بصري: {section.diagram.label || 'بيانات تكميلية'}
                  </div>
                  
                  {section.diagram.type === 'relation' ? (
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                      {section.diagram.nodes?.map((node, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <div className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-xs text-slate-800 dark:text-slate-200">
                            {node}
                          </div>
                          {i < (section.diagram.nodes?.length || 0) - 1 && (
                            <ArrowRight className="w-3.5 h-3.5 text-amber-500 rotate-180 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
                      <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center w-full">
                        <div className="text-[10px] font-bold text-red-500">الطرف الأول</div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{section.diagram.left}</div>
                      </div>
                      <div className="p-2.5 bg-amber-600 rounded-lg text-center text-white w-full">
                        <div className="text-[10px] font-bold opacity-80">النتيجة</div>
                        <div className="font-bold text-xs mt-0.5">{section.diagram.center}</div>
                      </div>
                      <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center w-full">
                        <div className="text-[10px] font-bold text-blue-500">الطرف الثاني</div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{section.diagram.right}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const articleCategories = [
  { id: 'civil', name: 'المادة المدنية', icon: HomeIcon },
  { id: 'criminal', name: 'المادة الجنائية', icon: Shield },
  { id: 'commercial', name: 'المادة التجارية و الأعمال', icon: Briefcase },
  { id: 'constitutional', name: 'المادة الدستورية', icon: FileText },
  { id: 'regulatory_laws', name: 'القوانين التنظيمية', icon: ScaleIcon },
  { id: 'judicial_authority', name: 'السلطة القضائية', icon: Shield },
  { id: 'constitutional_institutions', name: 'المؤسسات الدستورية', icon: Building2 },
  { id: 'judicial_org', name: 'التنظيم القضائي', icon: Layers },
  { id: 'electoral', name: 'المادة الانتخابية', icon: ClipboardList },
  { id: 'social', name: 'المادة الاجتماعية', icon: Users },
  { id: 'family', name: 'المادة الأسرية', icon: Heart },
  { id: 'realestate', name: 'المادة العقارية', icon: Building2 },
  { id: 'admin', name: 'المادة الإدارية', icon: Landmark },
  { id: 'financial', name: 'المادة المالية', icon: Coins },
];

const lawCategories = [
  { id: 'civil', name: 'المادة المدنية', icon: HomeIcon },
  { id: 'criminal', name: 'المادة الجنائية', icon: Shield },
  { id: 'commercial', name: 'المادة التجارية و الأعمال', icon: Briefcase },
  { id: 'realestate', name: 'المادة العقارية', icon: Building2 },
  { id: 'constitutional', name: 'المادة الدستورية', icon: FileText },
  { id: 'regulatory_laws', name: 'القوانين التنظيمية', icon: ScaleIcon },
  { id: 'judicial_authority', name: 'السلطة القضائية', icon: Shield },
  { id: 'constitutional_institutions', name: 'المؤسسات الدستورية', icon: Building2 },
  { id: 'judicial_org', name: 'التنظيم القضائي', icon: Layers },
  { id: 'electoral', name: 'المادة الانتخابية', icon: ClipboardList },
  { id: 'social', name: 'المادة الاجتماعية', icon: Users },
  { id: 'family', name: 'المادة الأسرية', icon: Heart },
  { id: 'admin', name: 'المادة الإدارية', icon: Landmark },
  { id: 'financial', name: 'المادة المالية', icon: Coins },
  { id: 'digital', name: 'مادة المعاملات الالكترونية', icon: Globe },
];

const isCategoryMatch = (selectedCategory: string | null, itemCategory: string) => {
  if (!selectedCategory) return true;
  if (!itemCategory) return false;
  if (selectedCategory === itemCategory) return true;

  const sel = selectedCategory.trim();
  const item = itemCategory.trim();

  const synonyms: Record<string, string[]> = {
    'المادة العقارية': ['المادة العقارية', 'القانون العقاري', 'عقاري', 'تحفيظ عقاري'],
    'القانون العقاري': ['المادة العقارية', 'القانون العقاري', 'عقاري', 'تحفيظ عقاري'],
    'المادة المدنية': ['المادة المدنية', 'القانون المدني', 'مدني'],
    'القانون المدني': ['المادة المدنية', 'القانون المدني', 'مدني'],
    'المادة الجنائية': ['المادة الجنائية', 'القانون الجنائي', 'جنائي'],
    'القانون الجنائي': ['المادة الجنائية', 'القانون الجنائي', 'جنائي'],
    'المادة التجارية و الأعمال': ['المادة التجارية و الأعمال', 'القانون التجاري', 'المادة التجارية', 'تجاري'],
    'المادة التجارية': ['المادة التجارية و الأعمال', 'القانون التجاري', 'المادة التجارية', 'تجاري'],
    'القانون التجاري': ['المادة التجارية و الأعمال', 'القانون التجاري', 'المادة التجارية', 'تجاري'],
    'المادة الأسرية': ['المادة الأسرية', 'قانون الأسرة', 'أسرة', 'مدونة الأسرة'],
    'قانون الأسرة': ['المادة الأسرية', 'قانون الأسرة', 'أسرة', 'مدونة الأسرة'],
    'المادة الإدارية': ['المادة الإدارية', 'القانون الإداري', 'إداري'],
    'القانون الإداري': ['المادة الإدارية', 'القانون الإداري', 'إداري'],
    'المادة الاجتماعية': ['المادة الاجتماعية', 'قانون الشغل', 'اجتماعي'],
    'مادة المعاملات الالكترونية': ['مادة المعاملات الالكترونية', 'المعاملات الإلكترونية', 'التبادل الإلكتروني'],
    'حقوق الإنسان': ['حقوق الإنسان', 'الحقوق والحريات'],
    'القانون الدولي': ['القانون الدولي', 'المادة الدولية'],
  };

  if (synonyms[sel] && synonyms[sel].includes(item)) {
    return true;
  }

  if (sel.includes('عقار') && item.includes('عقار')) return true;
  if (sel.includes('مدن') && item.includes('مدن')) return true;
  if (sel.includes('جنائ') && item.includes('جنائ')) return true;
  if (sel.includes('تجار') && item.includes('تجار')) return true;
  if (sel.includes('أسر') && item.includes('أسر')) return true;
  if (sel.includes('إدار') && item.includes('إدار')) return true;

  return false;
};

export default function MyLessons() {
  const [activeLevel, setActiveLevel] = useState('license');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showLessonViewer, setShowLessonViewer] = useState(false);
  const [activeLessonContent, setActiveLessonContent] = useState<LessonSection[]>([]);
  const [activeLessonTitle, setActiveLessonTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Thesis state
  const [theses, setTheses] = useState(initialTheses);
  const [isScraping, setIsScraping] = useState(false);

  const fetchScrapedTheses = async () => {
    setIsScraping(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsScraping(false);
    }
  };

  const filteredLicenseData = useMemo(() => {
    if (!searchQuery) return licenseData;
    return licenseData.map(semester => ({
      ...semester,
      subjects: semester.subjects.filter(subject => 
        subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(semester => semester.subjects.length > 0);
  }, [searchQuery]);

  const filteredArticles = useMemo(() => {
    if (!selectedCategory && !searchQuery) return [];
    return legalArticlesData.filter(art => 
      isCategoryMatch(selectedCategory, art.category) && 
      (art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
       art.author.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [selectedCategory, searchQuery]);

  const filteredLaws = useMemo(() => {
    if (!selectedCategory && !searchQuery) return [];
    return legalTextsData.filter(law => 
      isCategoryMatch(selectedCategory, law.category) && 
      (law.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       law.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [selectedCategory, searchQuery]);

  const handleSubjectClick = (subject: string) => {
    if (subject === 'مدخل لدراسة القانون') {
      setActiveLessonContent(lawIntroductionContent);
      setActiveLessonTitle('مدخل لدراسة القانون');
      setShowLessonViewer(true);
      return;
    }
    
    if (subject === 'مدخل لدراسة الشريعة') {
      setActiveLessonContent(shariaIntroductionContent);
      setActiveLessonTitle('مدخل لدراسة الشريعة');
      setShowLessonViewer(true);
      return;
    }
    
    if (subject === 'علم الاجتماع القانوني') {
      setActiveLessonContent(sociologyOfLawContent);
      setActiveLessonTitle('علم الاجتماع القانوني');
      setShowLessonViewer(true);
      return;
    }

    if (subject === 'النظرية العامة للقانون الدستوري') {
      setActiveLessonContent(constitutionalLawContent);
      setActiveLessonTitle('النظرية العامة للقانون الدستوري');
      setShowLessonViewer(true);
      return;
    }
  };

  const handleArticleClick = (article: any) => {
    const paragraphs = article.content.split('\n').filter((p: string) => p.trim() !== '');
    const formattedContent = [
      {
        title: article.title,
        content: [
          `الكاتب: ${article.author}`,
          `التاريخ: ${article.date}`,
          ...paragraphs
        ]
      }
    ];
    setActiveLessonTitle(article.title);
    setActiveLessonContent(formattedContent);
    setShowLessonViewer(true);
  };

  return (
    <div className="py-6 space-y-8">
      <AnimatePresence>
        {showLessonViewer && (
          <LessonViewer 
            onClose={() => setShowLessonViewer(false)} 
            content={activeLessonContent}
            title={activeLessonTitle}
          />
        )}
      </AnimatePresence>

      {!showLessonViewer && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="pt-1"></div>

      {/* Level Selection */}
      <div className="max-w-2xl mx-auto px-4 md:px-0">
        <div className="bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 p-1 rounded-2xl gap-1 grid grid-cols-2 lg:flex lg:flex-row items-stretch justify-center w-full shadow-sm backdrop-blur-sm">
          {levels.map((level) => {
            const isActive = activeLevel === level.id;
            return (
              <button
                key={level.id}
                onClick={() => {
                  setActiveLevel(level.id);
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                className={cn(
                  "group relative flex items-center justify-center gap-2 px-3 py-2.5 md:px-4 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 lg:flex-1 outline-none overflow-hidden",
                  isActive
                    ? "text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="myLessonsActiveLevelTab"
                    className="absolute inset-0 bg-[#0f2d59] rounded-xl -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <level.icon className={cn(
                  "w-3.5 h-3.5 md:w-4.5 md:h-4.5 transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-white" : "text-amber-500"
                )} />
                <span className="relative z-10 whitespace-nowrap">{level.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Controls */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full md:max-w-md">
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              className="p-3 bg-[var(--card)] border border-[var(--border)] rounded-xl text-amber-600 hover:bg-amber-50 transition-all"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] w-5 h-5" />
            <input
              type="text"
              placeholder={activeLevel === 'license' ? "ابحث عن مادة أو درس..." : "ابحث في المحتوى..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-[var(--foreground)]"
            />
          </div>
        </div>
        {activeLevel === 'license' && (
          <div className="flex gap-2 bg-[var(--card)] p-1.5 rounded-xl border border-[var(--border)]">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-amber-100 text-amber-600" : "text-[var(--muted)] hover:bg-[var(--secondary)]")}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-amber-100 text-amber-600" : "text-[var(--muted)] hover:bg-[var(--secondary)]")}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeLevel === 'license' && (
          <motion.div
            key="license"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto px-1"
          >
            {filteredLicenseData.map((semester, sIdx) => (
              <div key={sIdx} className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs">
                    {sIdx + 1}
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{semester.semester}</h3>
                </div>
                <div className="space-y-2">
                  {semester.subjects.map((subject, subIdx) => (
                    <motion.div
                      key={subIdx}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSubjectClick(subject)}
                      className={cn(
                        "bg-slate-50/80 dark:bg-slate-800/40 hover:bg-amber-50/60 dark:hover:bg-amber-950/20 px-3 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 transition-all group flex items-center justify-between cursor-pointer active:scale-[0.98]",
                        (subject === 'مدخل لدراسة القانون' || subject === 'مدخل لدراسة الشريعة' || subject === 'علم الاجتماع القانوني') && "border-amber-300/60 dark:border-amber-500/40 bg-amber-50/40 dark:bg-amber-950/30"
                      )}
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 text-slate-400 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-all shrink-0 shadow-2xs">
                          <Book className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors leading-tight">{subject}</span>
                      </div>
                      <ChevronLeft className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeLevel === 'articles' && (
          <motion.div
            key="articles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto"
          >
            {!selectedCategory && !searchQuery ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {articleCategories.map((cat) => (
                  <div 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-amber-500/60 transition-all group cursor-pointer text-center space-y-2.5 active:scale-98"
                  >
                    <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{cat.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">مقالات متخصصة</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-amber-600 dark:text-amber-400">
                    {searchQuery ? `نتائج البحث عن: ${searchQuery}` : selectedCategory}
                  </h3>
                  <span className="text-xs text-slate-500">{filteredArticles.length} مقال متاح</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredArticles.length > 0 ? filteredArticles.map((art) => (
                    <div 
                      key={art.id} 
                      onClick={() => handleArticleClick(art)}
                      className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-amber-500/60 hover:shadow-xs transition-all cursor-pointer group active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <h4 className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors leading-snug">
                            {art.title}
                          </h4>
                          {searchQuery && (
                            <span className="inline-block text-[10px] text-amber-600 font-medium px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 rounded-md">
                              {art.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <ChevronLeft className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 group-hover:-translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full text-center py-10 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <p className="text-xs text-slate-500">لا توجد مقالات تطابق بحثك حالياً.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeLevel === 'laws' && (
          <motion.div
            key="laws"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto"
          >
            {!selectedCategory && !searchQuery ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {lawCategories.map((cat) => (
                  <div 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500/60 transition-all group cursor-pointer text-center space-y-2.5 active:scale-98"
                  >
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{cat.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">النصوص والتشريعات</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-blue-600 dark:text-blue-400">
                    {searchQuery ? `نتائج البحث عن: ${searchQuery}` : selectedCategory}
                  </h3>
                  <span className="text-xs text-slate-500">{filteredLaws.length} نص متاح</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredLaws.length > 0 ? filteredLaws.map((law) => (
                    <div 
                      key={law.id} 
                      onClick={() => law.url && window.open(law.url, '_blank')}
                      className={`bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2.5 hover:border-blue-500/60 transition-all shadow-2xs ${law.url ? 'cursor-pointer group' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center shrink-0">
                            <ScaleIcon className="w-4 h-4" />
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-400 leading-snug">{law.title}</h4>
                            {searchQuery && (
                              <span className="text-[10px] text-blue-600 font-medium px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 rounded-md">
                                {law.category}
                              </span>
                            )}
                          </div>
                        </div>
                        {law.url && (
                          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Globe className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">{law.description}</p>
                      {law.url && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">عرض النص القانوني الكامل</span>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="col-span-full text-center py-10 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <p className="text-xs text-slate-500">لا توجد نصوص قانونية تطابق بحثك حالياً.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeLevel === 'theses' && (
          <motion.div
            key="theses"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto space-y-4"
          >
            {/* Header Content */}
            <div className="bg-amber-50/70 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-200/60 dark:border-amber-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
               <div className="text-right">
                  <h3 className="text-base font-bold text-amber-900 dark:text-amber-200">رسائل وأطاريح قانونية</h3>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">مكتبة متخصصة لتعميق التكوين العلمي والقانوني</p>
               </div>
               <button
                  onClick={fetchScrapedTheses}
                  disabled={isScraping}
                  className={cn(
                    "px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-2xs shrink-0",
                    isScraping 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                      : "bg-amber-600 text-white hover:bg-amber-700"
                  )}
               >
                  {isScraping ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      جاري الفحص...
                    </>
                  ) : (
                    <>
                      <Globe className="w-3.5 h-3.5" />
                      تحديث من خزانة FSJEST الرقمية
                    </>
                  )}
               </button>
            </div>

            {/* List of Theses */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {theses.map((thesis) => (
                <motion.div 
                  layout
                  key={thesis.id}
                  className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2.5 hover:border-amber-500/60 transition-all group shadow-2xs"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="w-9 h-9 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-md shrink-0">
                      {thesis.type}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                      {thesis.title}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-500">بقلم: {thesis.author}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">{thesis.date}</span>
                    <a 
                      href={thesis.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold text-xs hover:underline"
                    >
                      تحميل النسخة
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
