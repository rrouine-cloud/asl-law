import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, FileText, Scale, Copy, Check,
  Sparkles, Layers, MessageSquare, Cpu,
  CheckCircle2, ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';

type CitationType = 'book' | 'thesis' | 'article' | 'conference' | 'court_ruling' | 'legislation' | 'secondary';

interface CitationData {
  // Common
  author: string;
  title: string;
  page: string;

  // Book specific
  part: string;
  edition: string;
  publisher: string;
  place: string;
  year: string;
  multipleAuthors: boolean;
  hasMultipleWorksBySameAuthor: boolean;
  shortTitle: string;

  // Thesis specific
  degreeType: string;
  specialization: string;
  faculty: string;
  university: string;
  academicYear: string;

  // Article specific
  journal: string;
  issue: string;
  seasonOrYear: string;

  // Conference specific
  conferenceSubject: string;
  organizer: string;
  eventLocationAndDate: string;
  isUnpublished: boolean;

  // Court ruling specific
  courtName: string;
  rulingNumber: string;
  rulingDate: string;
  caseNumber: string;
  courtSourceType: 'published' | 'secondary' | 'unpublished';
  courtSourceDetail: string;

  // Legislation specific
  legType: 'law' | 'decree' | 'ministerial';
  legNumber: string;
  legSubject: string;
  legEnactingDecree: string;
  officialGazetteNumber: string;
  officialGazetteDate: string;

  // Secondary source specific
  originalAuthor: string;
  originalTitle: string;
  originalPublisherDetails: string;
  originalPage: string;

  // Repetition flags
  isRepeated: boolean;
  isSameAsAbove: boolean;
}

export default function LegalMethodology() {
  const [activeTab, setActiveTab] = useState<'methods' | 'essay' | 'case' | 'consultation' | 'citations' | 'generator'>('methods');
  
  // State for Citation Generator
  const [citationType, setCitationType] = useState<CitationType>('book');
  const [formData, setFormData] = useState<CitationData>({
    author: '',
    title: '',
    page: '',
    part: '',
    edition: '',
    publisher: '',
    place: '',
    year: '',
    multipleAuthors: false,
    hasMultipleWorksBySameAuthor: false,
    shortTitle: '',
    degreeType: 'رسالة ماستر',
    specialization: 'القانون الخاص',
    faculty: '',
    university: '',
    academicYear: '',
    journal: '',
    issue: '',
    seasonOrYear: '',
    conferenceSubject: '',
    organizer: '',
    eventLocationAndDate: '',
    isUnpublished: false,
    courtName: 'محكمة النقض',
    rulingNumber: '',
    rulingDate: '',
    caseNumber: '',
    courtSourceType: 'published',
    courtSourceDetail: '',
    legType: 'law',
    legNumber: '',
    legSubject: '',
    legEnactingDecree: '',
    officialGazetteNumber: '',
    officialGazetteDate: '',
    originalAuthor: '',
    originalTitle: '',
    originalPublisherDetails: '',
    originalPage: '',
    isRepeated: false,
    isSameAsAbove: false,
  });

  const [copiedFootnote, setCopiedFootnote] = useState(false);
  const [copiedBibliography, setCopiedBibliography] = useState(false);

  // Formatted citations calculation strictly adhering to legal documentation rules
  const formattedCitations = useMemo(() => {
    const {
      author, title, page, part, edition, publisher, place, year,
      multipleAuthors, hasMultipleWorksBySameAuthor, shortTitle,
      degreeType, specialization, faculty, university, academicYear,
      journal, issue, seasonOrYear, conferenceSubject, organizer,
      eventLocationAndDate, isUnpublished, courtName, rulingNumber,
      rulingDate, caseNumber, courtSourceType, courtSourceDetail,
      legType, legNumber, legSubject, legEnactingDecree,
      officialGazetteNumber, officialGazetteDate,
      originalAuthor, originalTitle, originalPublisherDetails, originalPage,
      isRepeated, isSameAsAbove
    } = formData;

    let footnote = '';
    let biblio = '';

    // 1. المرجع نفسه (Ibid)
    if (isSameAsAbove) {
      footnote = `المرجع نفسه${page ? `، ص ${page}` : '.'}`;
      biblio = author ? `${author}: المرجع نفسه.` : 'المرجع نفسه.';
      return { footnote, biblio };
    }

    // 2. مرجع سابق (Op. cit / الإحالة اللاحقة غير الموالية مباشرة)
    if (isRepeated) {
      switch (citationType) {
        case 'book':
          if (multipleAuthors) {
            const firstAuthor = author.split('،')[0] || author.split(',')[0] || author;
            footnote = `${firstAuthor.trim()} وآخرون، مرجع سابق${page ? `، ص ${page}` : '.'}`;
          } else if (hasMultipleWorksBySameAuthor && shortTitle) {
            footnote = `${author || '[اسم المؤلف]'}: ${shortTitle}…، مرجع سابق${page ? `، ص ${page}` : '.'}`;
          } else {
            footnote = `${author || '[اسم المؤلف]'}، مرجع سابق${page ? `، ص ${page}` : '.'}`;
          }
          break;

        case 'thesis':
        case 'article':
        case 'conference':
          footnote = `${author || '[اسم الباحث/المؤلف]'}، مرجع سابق${page ? `، ص ${page}` : '.'}`;
          break;

        case 'court_ruling':
          footnote = `${courtName || 'المحكمة'}، قرار عدد ${rulingNumber || '...'}، مرجع سابق${page ? `، ص ${page}` : '.'}`;
          break;

        case 'legislation':
          if (legType === 'law') {
            footnote = `القانون رقم ${legNumber || '...'} ${legSubject ? `المتعلق بـ ${legSubject}` : ''}.`;
          } else if (legType === 'decree') {
            footnote = `المرسوم رقم ${legNumber || '...'} ${legSubject ? `المتعلق بـ ${legSubject}` : ''}.`;
          } else {
            footnote = `قرار ${legEnactingDecree || 'الوزير'} رقم ${legNumber || '...'}${legSubject ? ` في شأن ${legSubject}` : ''}.`;
          }
          break;

        case 'secondary':
          footnote = `${originalAuthor || '[المؤلف الأصلي]'}، مرجع سابق${originalPage ? `، ص ${originalPage}` : ''}، نقلا عن ${author || '[المؤلف الوسيط]'}، مرجع سابق${page ? `، ص ${page}` : '.'}`;
          break;
      }

      // Generates corresponding bibliography
      biblio = author ? `${author}، مرجع سابق.` : 'مرجع سابق.';
      return { footnote, biblio };
    }

    // 3. الإحالة الأولى وقائمة المراجع
    switch (citationType) {
      case 'book':
        footnote = `${author || '[اسم المؤلف]'}: ${title || '[عنوان الكتاب]'}${part ? `، ${part}` : ''}${edition ? `، ${edition}` : ''}${publisher ? `، ${publisher}` : ''}${place ? ` ${place}` : ''}${year ? `، ${year}` : ''}${page ? `، ص ${page}` : '.'}`;
        biblio = `${author || '[اسم المؤلف]'}: ${title || '[عنوان الكتاب]'}${part ? `، ${part}` : ''}${edition ? `، ${edition}` : ''}${publisher ? `، ${publisher}` : ''}${place ? ` ${place}` : ''}${year ? `، ${year}` : '.'}`;
        break;

      case 'thesis':
        footnote = `${author || '[اسم الباحث]'}: ${title || '[عنوان الرسالة/الأطروحة]'}${degreeType ? `، ${degreeType}` : ''}${specialization ? ` في ${specialization}` : ''}${faculty ? `، ${faculty}` : ''}${university ? `، ${university}` : ''}${academicYear ? `، السنة الجامعية ${academicYear}` : ''}${page ? `، ص ${page}` : '.'}`;
        biblio = `${author || '[اسم الباحث]'}: ${title || '[عنوان الرسالة/الأطروحة]'}${degreeType ? `، ${degreeType}` : ''}${specialization ? ` في ${specialization}` : ''}${faculty ? `، ${faculty}` : ''}${university ? `، ${university}` : ''}${academicYear ? `، السنة الجامعية ${academicYear}` : '.'}`;
        break;

      case 'article':
        footnote = `${author || '[اسم المؤلف]'} : ${title || '[عنوان المقال]'}${journal ? ` - ${journal}` : ''}${issue ? ` - ${issue}` : ''}${seasonOrYear ? `، ${seasonOrYear}` : ''}${page ? `، ص ${page}` : '.'}`;
        biblio = `${author || '[اسم المؤلف]'} : ${title || '[عنوان المقال]'}${journal ? ` - ${journal}` : ''}${issue ? ` - ${issue}` : ''}${seasonOrYear ? `، ${seasonOrYear}` : '.'}`;
        break;

      case 'conference':
        footnote = `${author || '[اسم الباحث]'}: ${title || '[عنوان المداخلة]'}${conferenceSubject ? `، مداخلة في أشغال الندوة حول موضوع: "${conferenceSubject}"` : ''}${organizer ? ` المنظمة من طرف ${organizer}` : ''}${eventLocationAndDate ? ` ${eventLocationAndDate}` : ''}${isUnpublished ? '، مداخلة غير منشورة' : `${publisher ? `، ${publisher}` : ''}${year ? `، ${year}` : ''}`}${page ? `، ص ${page}` : '.'}`;
        biblio = `${author || '[اسم الباحث]'}: ${title || '[عنوان المداخلة]'}${conferenceSubject ? `، مداخلة في أشغال الندوة حول موضوع: "${conferenceSubject}"` : ''}${organizer ? ` المنظمة من طرف ${organizer}` : ''}${eventLocationAndDate ? ` ${eventLocationAndDate}` : ''}${isUnpublished ? '، مداخلة غير منشورة' : `${publisher ? `، ${publisher}` : ''}${year ? `، ${year}` : ''}`}.`;
        break;

      case 'court_ruling':
        footnote = `${courtName || 'محكمة النقض'}، قرار عدد ${rulingNumber || '[رقم القرار]'}${rulingDate ? `، صادر بتاريخ ${rulingDate}` : ''}، ${caseNumber ? `ملف عدد ${caseNumber}` : '(رقم الملف غير مذكور)'}${courtSourceType === 'published' ? `${courtSourceDetail ? `، منشور بـ: ${courtSourceDetail}` : ''}` : courtSourceType === 'secondary' ? `${courtSourceDetail ? `، أورده ${courtSourceDetail}` : ''}` : '، غير منشور'}${page ? `، ص ${page}` : '.'}`;
        biblio = `${courtName || 'محكمة النقض'}، قرار عدد ${rulingNumber || '[رقم القرار]'}${rulingDate ? `، صادر بتاريخ ${rulingDate}` : ''}، ${caseNumber ? `ملف عدد ${caseNumber}` : '(رقم الملف غير مذكور)'}${courtSourceType === 'published' ? `${courtSourceDetail ? `، منشور بـ: ${courtSourceDetail}` : ''}` : courtSourceType === 'secondary' ? `${courtSourceDetail ? `، أورده ${courtSourceDetail}` : ''}` : '، غير منشور'}.`;
        break;

      case 'legislation':
        if (legType === 'law') {
          footnote = `القانون رقم ${legNumber || '[رقم القانون]'} ${legSubject || '[الموضوع]'}${legEnactingDecree ? ` الصادر بتنفيذه الظهير الشريف رقم ${legEnactingDecree}` : ''}${officialGazetteNumber ? `، الجريدة الرسمية عدد ${officialGazetteNumber}` : ''}${officialGazetteDate ? ` بتاريخ ${officialGazetteDate}` : ''}${page ? `، ص ${page}` : '.'}`;
          biblio = `القانون رقم ${legNumber || '[رقم القانون]'} ${legSubject || '[الموضوع]'}${legEnactingDecree ? ` الصادر بتنفيذه الظهير الشريف رقم ${legEnactingDecree}` : ''}${officialGazetteNumber ? `، الجريدة الرسمية عدد ${officialGazetteNumber}` : ''}${officialGazetteDate ? ` بتاريخ ${officialGazetteDate}` : '.'}`;
        } else if (legType === 'decree') {
          footnote = `مرسوم رقم ${legNumber || '[رقم المرسوم]'}${officialGazetteDate ? ` صادر في ${officialGazetteDate}` : ''} ${legSubject || '[الموضوع]'}${officialGazetteNumber ? `، الجريدة الرسمية عدد ${officialGazetteNumber}` : ''}${page ? `، ص ${page}` : '.'}`;
          biblio = `مرسوم رقم ${legNumber || '[رقم المرسوم]'}${officialGazetteDate ? ` صادر في ${officialGazetteDate}` : ''} ${legSubject || '[الموضوع]'}${officialGazetteNumber ? `، الجريدة الرسمية عدد ${officialGazetteNumber}` : '.'}`;
        } else {
          footnote = `قرار ${legEnactingDecree || 'الوزير'} رقم ${legNumber || '[رقم القرار]'}${officialGazetteDate ? ` صادر في ${officialGazetteDate}` : ''} ${legSubject || '[الموضوع]'}${officialGazetteNumber ? `، الجريدة الرسمية عدد ${officialGazetteNumber}` : ''}${page ? `، ص ${page}` : '.'}`;
          biblio = `قرار ${legEnactingDecree || 'الوزير'} رقم ${legNumber || '[رقم القرار]'}${officialGazetteDate ? ` صادر في ${officialGazetteDate}` : ''} ${legSubject || '[الموضوع]'}${officialGazetteNumber ? `، الجريدة الرسمية عدد ${officialGazetteNumber}` : '.'}`;
        }
        break;

      case 'secondary':
        footnote = `${originalAuthor || '[اسم المؤلف الأصلي]'}، ${originalTitle || '[عنوان الكتاب الأصلي]'}${originalPublisherDetails ? `، ${originalPublisherDetails}` : ''}${originalPage ? `، ص ${originalPage}` : ''}، نقلا عن ${author || '[اسم المؤلف الوسيط]'}، مرجع سابق${page ? `، ص ${page}` : '.'}`;
        biblio = `${originalAuthor || '[اسم المؤلف الأصلي]'}، ${originalTitle || '[عنوان الكتاب الأصلي]'}${originalPublisherDetails ? `، ${originalPublisherDetails}` : ''} (نقلا عن: ${author || '[اسم المؤلف الوسيط]'}).`;
        break;
    }

    return { footnote, biblio };
  }, [formData, citationType]);

  const copyToClipboard = (text: string, type: 'footnote' | 'biblio') => {
    navigator.clipboard.writeText(text);
    if (type === 'footnote') {
      setCopiedFootnote(true);
      setTimeout(() => setCopiedFootnote(false), 2000);
    } else {
      setCopiedBibliography(true);
      setTimeout(() => setCopiedBibliography(false), 2000);
    }
  };

  return (
    <div className="py-4 max-w-5xl mx-auto px-3 sm:px-6 space-y-6 text-right font-sans">
      {/* Top Header - Compact Clean Minimalist Line */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
            <h1 className="text-xl md:text-2xl font-black font-serif text-slate-900 dark:text-white">
              المنهجية القانونية والبحث العلمي
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            دليل الباحث والسياسي والقانوني الشامل - المناهج، المواضيع، النوازل، الاستشارات، وتوثيق المراجع.
          </p>
        </div>
      </div>

      {/* Redesigned Single-Page Menu Banner (ستار القوائم المنهجية) */}
      <div className="bg-slate-100/90 dark:bg-slate-900/90 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            المحاور والمنهجيات القانونية (اختر المنهجية)
          </span>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 hidden sm:inline-block">
            6 محاور منهجية متكاملة
          </span>
        </div>

        {/* 6-Column Single Page Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { id: 'methods', num: '01', label: 'المناهج القانونية', icon: Layers },
            { id: 'essay', num: '02', label: 'كتابة موضوع قانوني', icon: FileText },
            { id: 'case', num: '03', label: 'حل النازلة القانونية', icon: Scale },
            { id: 'consultation', num: '04', label: 'تقديم استشارة قانونية', icon: MessageSquare },
            { id: 'citations', num: '05', label: 'قواعد التوثيق', icon: BookOpen },
            { id: 'generator', num: '06', label: 'مولد الإحالات الآلي', icon: Cpu },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-xl transition-all duration-200 cursor-pointer text-center group border",
                  isActive
                    ? "bg-[#0f2d59] dark:bg-indigo-600 text-white border-[#0f2d59] dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/20 scale-[1.02]"
                    : "bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/60 hover:bg-indigo-50/70 dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800/50 shadow-xs"
                )}
              >
                {/* Number badge */}
                <div className="flex items-center justify-between w-full text-[10px] font-bold px-0.5">
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded-md text-[9px] font-mono font-black",
                      isActive
                        ? "bg-amber-400 text-[#0f2d59]"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:group-hover:bg-indigo-950 dark:group-hover:text-indigo-300"
                    )}
                  >
                    {tab.num}
                  </span>
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-transform group-hover:scale-110",
                      isActive ? "text-amber-400" : "text-slate-400 dark:text-slate-400 group-hover:text-indigo-600"
                    )}
                  />
                </div>

                {/* Title */}
                <span className="text-xs sm:text-xs font-bold leading-tight line-clamp-2">
                  {tab.label}
                </span>

                {/* Active Indicator Bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-amber-400"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Streamlined Content Views */}
      <AnimatePresence mode="wait">
        {/* TAB 1: المناهج القانونية (النص كما هو بالكامل بدون بطائق أو صناديق) */}
        {activeTab === 'methods' && (
          <motion.div
            key="tab-methods"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 text-slate-900 dark:text-slate-100 leading-relaxed font-sans text-sm md:text-base"
          >
            {/* المقدمة */}
            <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg md:text-xl font-bold font-serif text-indigo-900 dark:text-indigo-300">
                مقدمة وتكامل المناهج:
              </h2>
              <p className="text-justify leading-loose text-slate-800 dark:text-slate-200">
                تتوزع مناهج البحث في العلوم الاجتماعية بين شكلين رئيسيين هما المناهج النظرية والمناهج التطبيقية. وعلى الرغم من التمييز بينهما، إلا أنهما يتكاملان؛ فالإطار النظري يوجه الأدوات التطبيقية، والأدوات الإجرائية تسعف الباحث في تفسير الظاهرة واختبار الفرضيات واقعياً.
              </p>
            </div>

            {/* أولاً */}
            <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg md:text-xl font-bold font-serif text-indigo-900 dark:text-indigo-300">
                أولاً: تصنيفات مناهج البحث العلمي
              </h2>
              <div className="space-y-2 text-justify leading-loose pr-2">
                <p>
                  <strong>التصنيف التقليدي الأول:</strong> يقسم المناهج إلى المنهج التحليلي، والمنهج التركيبي، والمنهج التحليلي الاكتشافي (الاختراع). ويُعاب عليه أنه ناقص لأنه يركز على الأفكار فقط ويهمل القوانين والظواهر.
                </p>
                <p>
                  <strong>التصنيف التقليدي الثاني:</strong> يقسم المناهج إلى المنهج التلقائي والمنهج العقلي التأملي. ويُعاب عليه تركيزه على وسائل الحصول على المعرفة والشروط العقلية بدلاً من قوانين وأصول البحث العلمي.
                </p>
                <p>
                  <strong>التصنيفات الحديثة (ويتني وماركيز):</strong> بالغا في تحديد المناهج وأقحما أنواعاً من البحوث وطرق الثقافة وأجزاء من المناهج الأصيلة.
                </p>
                <p>
                  <strong>المناهج الأصلية المتفق عليها:</strong> تشمل المنهج الاستدلالي، والمنهج التاريخي، والمنهج التجريبي، والمنهج الجدلي.
                </p>
                <p>
                  <strong>المناهج الفرعية المتفق عليها:</strong> تشمل المنهج الوصفي، والمنهج الإحصائي، والمنهج التحليلي، والمنهج المقارن.
                </p>
              </div>
            </div>

            {/* ثانياً: المناهج النظرية */}
            <div className="space-y-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg md:text-xl font-bold font-serif text-indigo-900 dark:text-indigo-300">
                ثانياً: المناهج النظرية
              </h2>
              <p className="text-justify leading-loose">
                تمتاز بتزويد الباحث بالمفاهيم الأساسية (كالبنية والنسق) وتوجيهه نحو ما يجب التركيز عليه واقتراح أدوات جمع المعطيات. وأبرز هذه المناهج:
              </p>

              <div className="space-y-4 pr-2">
                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    1. المنهج الوضعي:
                  </h3>
                  <p className="text-justify leading-loose">
                    <strong>النشأة:</strong> ولد في فرنسا على يد أوجست كونت (مستنداً إلى أستاذه سان سيمون) لإتمام سلسلة العلوم الوضعية وإيجاد حلول للاضطرابات التي تلت الثورة الفرنسية.<br/>
                    <strong>خصائصه عند كونت:</strong> يتسم بالطموح التوحيدي (للوصول بالعلوم الاجتماعية لدرجة دقة العلوم الطبيعية وعدم تجزئتها)، والطابع الغائي (تحقيق السلام وضبط المجتمع)، والطبيعة الوضعية (استقراء واقع الظاهرة واستبعاد التفكير اللاهوتي والميتافيزيقي).<br/>
                    <strong>مرتكزات الاتجاه الوضعي:</strong> دراسة الظواهر كأشياء خارجية، وإحلال فكرة القانون محل القوى الخارقة، وإخضاع التصور الفلسفي للملاحظة.<br/>
                    <strong>خطواته:</strong> الملاحظة، والافتراض، والتجربة (والتي يمكن استبدالها بدراسة تاريخ الظاهرة في العلوم الاجتماعية)، ثم التفسير.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    2. المنهج الوظيفي:
                  </h3>
                  <p className="text-justify leading-loose">
                    <strong>تعريفه:</strong> طريقة علمية تعتمد على "الوظيفة" (الفعل أو الدور الذي يقدمه الجزء لصالح توازن واستقرار الكل) كآلية لتفسير الظواهر.<br/>
                    <strong>الاتجاهات الوظيفية:</strong> تنقسم إلى التحليل المطلق عند "مالينوفسكي" (كل عنصر ثقافي يقوم بوظيفة حيوية ومطلقة تجاه الكل)، والتحليل النسبي عند "روبرت ميرتون" (الوظيفة أداة نسبية لوجود وظائف صريحة وأخرى كامنة، وإمكانية ممارسة الجزء لعدة وظائف).<br/>
                    <strong>الانتقادات:</strong> الغموض في مفهوم الوظيفة، والمبالغة في محاكاة العلوم البيولوجية العضوية، وإهمال التغير الاجتماعي والصراع الطبقي.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    3. المنهج البنيوي:
                  </h3>
                  <p className="text-justify leading-loose">
                    <strong>تعريفه:</strong> يركز على دراسة "البنية" وهي العلاقات الثابتة نسبياً والمتكررة بين عناصر الظاهرة، حيث تُحدد طبيعة كل عنصر من خلال علاقته بالباقين.<br/>
                    <strong>مبادئه:</strong> النظر للأشياء كأنساق مترابطة الأجزاء، وأن الأنشطة المتكررة هي وحدة التحليل، مع عدم الاهتمام بالتاريخ.<br/>
                    <strong>نتائجه وانتقاداته:</strong> نُعت بفلسفة "موت الإنسان" (لأنه يرى البشر صنائع للبنيات وليسوا صانعيها)، وإلغاء التاريخ، والسقوط في النظرة الاختزالية للواقع.<br/>
                    <strong>البنيوية التكوينية:</strong> ظهرت كحركة تصحيحية أعادت مكانة التاريخ والإنسان باعتباره مؤثراً في البنية ومستوعباً لتغيرات البيئة.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    4. المنهج النسقي:
                  </h3>
                  <p className="text-justify leading-loose">
                    <strong>تعريفه:</strong> منهج علمي حديث يعتمد على التجريد وبناء النماذج، وتجاوز نواقص البنيوية الوظيفية بتركيزه على "اتساق" الظواهر كأنساق منفتحة ومتحولة.<br/>
                    <strong>التحليل السياسي النسقي:</strong> طبقه "ديفيد أستون" معتبراً النظام السياسي كـ"علبة سوداء" تتفاعل مع بيئتها الخارجية عبر "المدخلات" (المطالبات والمساندة) و"المخرجات" (التشريعات والقرارات والتدابير) للحفاظ على توازنه وتكيفه.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    5. المنهج التاريخي (الاستردادي):
                  </h3>
                  <p className="text-justify leading-loose">
                    <strong>تعريفه:</strong> عملية استرداد واسترجاع للماضي لتوضيح الظواهر الحاضرة وفهم التغير الاجتماعي، ومن رواده ابن خلدون، وماكس فيبر، وكارل ماركس.<br/>
                    <strong>خطواته:</strong> اختيار موضوع البحث، وجمع البيانات من مصادر أولية (وثائق، آثار) وثانوية (صحف، دراسات سابقة)، ونقد مصادر البيانات (داخلي وخارجي)، وصياغة الفروض، وتحليل الحقائق وتفسيرها، ثم استخلاص النتائج.<br/>
                    <strong>تقييمه:</strong> يمتاز بقلة التكلفة واتباع النقد العلمي، ولكن يُعاب عليه عدم خضوع المادة التاريخية للتجريب، وصعوبة تعميم النتائج، واحتمالية تعرض المعرفة التاريخية للتزوير والتلف.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    6. المنهج المقارن:
                  </h3>
                  <p className="text-justify leading-loose">
                    <strong>تعريفه:</strong> يعتمد على المقارنة لإبراز أوجه الشبه والاختلاف بين ظاهرتين متماثلتين أو أكثر. وحل هذا المنهج محل التجربة في العلوم القانونية لسد النقص والفراغ التشريعي.
                  </p>
                </div>
              </div>
            </div>

            {/* ثالثاً: المناهج التطبيقية */}
            <div className="space-y-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg md:text-xl font-bold font-serif text-indigo-900 dark:text-indigo-300">
                ثالثاً: المناهج التطبيقية (أدوات البحث)
              </h2>
              <p className="text-justify leading-loose">
                هي آليات إجرائية تُجمع بواسطتها المعطيات والمعلومات حول الظاهرة من الواقع (مثل: الملاحظة، الاستبيان، المقابلة، والمناهج المختبرية). وركز النص على:
              </p>

              <div className="space-y-4 pr-2">
                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    أداة العينة:
                  </h3>
                  <p className="text-justify leading-loose">
                    <strong>تعريفها:</strong> مجموعة جزئية من مجتمع الدراسة يتم اختيارها بطريقة معينة لإجراء البحث عليها، ثم تعميم نتائجها على المجتمع الأصلي.<br/>
                    <strong>أنواعها:</strong> العينة الاحتمالية (تعتمد على نظرية الاحتمالات وتكافؤ الفرص لكل عنصر) والعينة العقلانية (تتوقف على توفر معلومات كافية عن مجتمع البحث).<br/>
                    <strong>شروطها:</strong><br/>
                    • يجب أن تكون بعيدة عن الانحياز وتُختار بشكل عشوائي.<br/>
                    • أن تمثل مجتمع البحث الأصلي بشكل صحيح وصادق وتكون خواصها قريبة منه.<br/>
                    • تحقيق التجانس بين مكوناتها، وفي حال عدم تجانسه يُقسم المجتمع إلى مجتمعات أصغر متجانسة.<br/>
                    • القيام بحصر مسبق لكافة مكونات مجتمع البحث الأصلي وتجزئته إلى وحدات معاينة داخل إطار إحصائي خاص.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    ثانياً: أداة الملاحظة المباشرة
                  </h3>
                  <p className="text-justify leading-loose">
                    تعد الملاحظة أقدم وسائل جمع المعلومات، وتُعرف بأنها الوسيلة التي يُحاول بها الباحث التحقق من السلوك الظاهري للأشخاص بمشاهدتهم يعبرون عن أنفسهم في ظروف الحياة العادية أو مواقف خاصة. وهي طريقة علمية تهتم بدراسة المجتمعات من حيث عناصرها العرقية، وأصولها الثقافية، ودياناتها، وطقوسها، وقيمها، وتقاليدها.<br/>
                    <strong>شروط الملاحظة المباشرة:</strong><br/>
                    • تدريب الباحث تدريباً دقيقاً على أساليب التفكير العلمي لضمان حياده وموضوعيته واكتشاف القوانين الاجتماعية.<br/>
                    • اتصاف الباحث بدقة الملاحظة، والتحلي بالصبر، وعدم التعجل في استنتاج النتائج.<br/>
                    • تعلم لغة أفراد المجتمع المبحوث، وفهم نظام عاطفتهم وتخاطبهم، والتفكير بمثل طريقتهم.<br/>
                    • الاستعانة بمرشد أو وسيط أمين وموضوعي من أعضاء مجتمع الدراسة إذا تعذر إتقان اللغة لضيق الوقت أو الإمكانات.<br/>
                    • تسجيل المعلومات فور الحصول عليها مباشرة لتجنب النسيان أو الخطأ.<br/>
                    • الاستعانة بالوسائل المعينة مثل آلات التصوير، أجهزة تسجيل الأصوات، والخرائط الجغرافية والبيانية، والاستفادة من أحدث وسائل جمع وتصنيف البيانات وجدولتها.<br/>
                    • جمع البيانات بطريقة تلقائية دون إشعار الآخرين بأنهم مراقبون، كالمشاركة في الأحاديث العابرة، أو الشعائر، والمراسم، والعادات.<br/>
                    • تبويب البيانات وتصنيفها بعد الحصول عليها إلى مجموعات متجانسة في شكل تكرارات إحصائية للوصول لاستنتاجات محددة، مثل تصنيف النظم الاجتماعية أنثروبولوجياً على أساس القرابة، أو الدين، أو العرق، أو المنافع الاقتصادية.<br/>
                    <strong>أنواع الملاحظة المباشرة:</strong><br/>
                    1. <strong>الملاحظة الخارجية:</strong> وتنقسم إلى نوعين:<br/>
                    - بدون مشاركة: يكون الملاحظ في وضعية المتفرج (كالصحفي يوجه كاميرته)، لكنه يمتاز عن الصحفي بتسلحه بمعرفة مسبقة حول ما يجب ملاحظته ليكون مستعداً لكل احتمالات التفاعل مع الواقع.<br/>
                    - بالمشاركة: تتميز بانخراط الباحث في الجماعة والعيش وسطهم والاندماج معهم، وتسمح بفهم أعمق للظواهر، وتُستعمل غالباً في دراسة الشعوب، والأحزاب، والنقابات.<br/>
                    2. <strong>الملاحظة الداخلية:</strong> لا يكون الملاحظ فيها أجنبياً عن مجتمع البحث، وتميز بين شكلين:<br/>
                    - الملاحظة الموجهة من الخارج: ويكلف فيها الباحث شخصاً من داخل المجموعة للقيام بالملاحظة.<br/>
                    - الملاحظة الداخلية بالمشاركة: يكون الباحث منتمياً أصلاً إلى مجتمع البحث، وهي مهمة نظراً للثقة التي يحظى بها، ولكن يعاب عليها احتمال عدم الدقة عندما يتحول الباحث من محايد إلى موجه للظاهرة.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    ثالثاً: أداة المقابلة
                  </h3>
                  <p className="text-justify leading-loose">
                    المقابلة هي محادثة شفوية يقوم بها الباحث لجمع معلومات بطريقة شفوية، بشرط ضمان الحد الأدنى من تعاون المبحوث. وتعتبر أداة رئيسة في ميادين متعددة كالطب، والصحافة، والمحاماة، وإدارة الأعمال، والخدمة الاجتماعية، وبرزت كأداة بحث رئيسة في مجال التشخيص والعلاج النفسي، وهي شائعة الاستعمال في البحوث الميدانية لتحقيقها عدة أغراض في آن واحد.<br/>
                    <strong>تصنيفات المقابلة (من حيث الهدف):</strong><br/>
                    • مقابلة توثيقية: تستهدف الحصول على معلومات مضت.<br/>
                    • مقابلة الرأي: تستهدف معرفة مواقف الناس وآرائهم بشأن قضايا معينة.<br/>
                    (أشار النص أيضاً إلى وجود تصنيفات أخرى من حيث حرية الباحث ومن حيث حرية المبحوث).<br/>
                    <strong>واجبات المقابلة (مراحل الإجراء):</strong><br/>
                    • التفتيش عن المبحوثين: البحث عن الأفراد الذين يشكلون العينة، مع الإشارة إلى أن التفتيش عن وحدات العينة العشوائية أصعب بكثير من العينة المقننة نظراً لوجوب تقيد الباحث بالأسماء والذهاب لعناوينهم مهما كانت متباعدة.<br/>
                    • تحقيق المقابلة مع المبحوثين: تشجيعهم وتوفير جو إيجابي للمقابلة، مع الحرص على أن تكون الأسئلة الاستبيانية قليلة وواضحة ومركّزة.<br/>
                    • طرح الأسئلة الاستبيانية.<br/>
                    • تسجيل الإجابات: تدوين الباحث للإجابات بنفسه، علماً أن تدوين الأسئلة المفتوحة أصعب من الأسئلة المغلقة.<br/>
                    <strong>مميزات وعيوب المقابلة:</strong><br/>
                    • <strong>المميزات:</strong> تقدم معلومات غزيرة ومميزة لكل جوانب الموضوع؛ معلوماتها أكثر دقة من الاستبيان لإمكانية شرح الأسئلة وتقييم الصفات الشخصية للمبحوثين؛ وسيلة هامة في المجتمعات التي تكثر فيها الأمية؛ تشعر الفرد بأهميته مقارنة بالاستبيان.<br/>
                    • <strong>العيوب:</strong> مكلفة من حيث الوقت والجهد (تتطلب وقتاً للإعداد وجهداً للتنقل)؛ قد يخطئ الباحث في تسجيل المعلومات؛ يتوقف نجاحها على رغبة المبحوث في التعاون؛ تتطلب مهارات خاصة كاللباقة والجرأة؛ صعوبة الوصول لبعض الشخصيات نظراً لمركزهم السياسي أو الإداري.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    رابعاً: أداة الاستمارة (الاستبيان)
                  </h3>
                  <p className="text-justify leading-loose">
                    الاستمارة أو الاستبيان هي وسيلة جمع المعلومات المتعلقة بموضوع البحث عن طريق إعداد استمارة تتضمن مجموعة من الأسئلة، يتم تعبئتها من قبل عينة ممثلة من الأفراد بطريقة يحددها الباحث حسب أغراض بحثه.<br/>
                    <strong>أنواع الأسئلة في الاستبيان:</strong><br/>
                    • <strong>الأسئلة المغلقة (الاستبيان المقيد):</strong> يكتب تحت كل سؤال خيارات متعددة وعلى المجيب اختيار بعضها أو كلها. مميزاتها: الإجابة محددة وموحدة مما يسهل المقارنة، وسهولة التصنيف والتبويب والتحليل مما يوفر الوقت. عيوبها: تقييد المبحوث في إجابات محددة سلفاً، واحتمال إغفال الباحث لبعض الخيارات.<br/>
                    • <strong>الأسئلة المفتوحة (الاستبيان المفتوح):</strong> يُمنح المبحوث مطلق الحرية في الإجابة وتأتي الإجابات متنوعة، ويُستخدم هذا النوع عند نقص المعلومات المعمقة عن الظاهرة. مميزاتها: عدم تقييد المبحوث وترك الحرية له لكتابة ما يراه مناسباً. عيوبها: تطرح صعوبات على الباحث أثناء تصنيف الإجابات وتحليلها.<br/>
                    • <strong>الأسئلة المغلقة المفتوحة (الاستبيان المقيد المفتوح):</strong> يطرح الباحث سؤالاً مغلقاً يحدد الإجابة ويقيد المبحوثباختيارها، ثم يتبعه بسؤال مفتوح يطلب فيه توضيح أسباب هذا الاختيار والتعليق عليه.<br/>
                    <strong>الشروط الشكلية والموضوعية للاستبيان:</strong><br/>
                    • <strong>الشروط الشكلية:</strong> يقسم الاستبيان إلى ثلاثة أجزاء: (1) المقدمة: تتضمن التعريف بالباحث وأهمية البحث وضمان سرية المعلومات. (2) الإرشادات: تتضمن معلومات حول تعبئة الاستبيان وعنوان الباحث للاتصال والاستفسار. (3) المتن: ويتضمن الأسئلة الموجهة للمبحوث.<br/>
                    • <strong>الشروط الموضوعية:</strong> صياغة الأسئلة بشكل واضح وبلغة سليمة تناسب مستوى الفئات المستهدفة، والتدرج في طرح الأسئلة من السهل إلى الصعب ومن العام إلى الخاص.<br/>
                    • <strong>إعداد الاستمارة:</strong> صياغة الأسئلة بدقة ووضوح وتجنب الغموض، وتنظيم الأسئلة وفق ترتيب معين لتجنب ملل المبحوث.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    خامساً: أداة تحليل المضمون
                  </h3>
                  <p className="text-justify leading-loose">
                    تُستخدم هذه الأداة لدراسة محتويات الوثائق، الصحف، والمجلات.<br/>
                    <strong>خصائص تحليل المضمون:</strong><br/>
                    • التركيز على الكلمات، والجمل، والمصطلحات، والمفاهيم المتكررة في النص لتحديد مدى أهمية الفقرات والنصوص.<br/>
                    • أشار النص إلى خاصية مفادها أنه لا يجب أن يعتمد التحليل على نتائج صحيحة ودقيقة والمعلومات الواردة في مضمون النص.<br/>
                    <strong>أنواع أدوات تحليل المضمون:</strong><br/>
                    • <strong>التحليل الكلاسيكي:</strong> أسلوب قديم يستعمل كثيراً لتحليل الوثائق (مثل تحليل النصوص الأدبية والتعليق عليها). ويتميز بخاصيتين؛ الأولى أنه تحليل كيفي يبحث عن مغزى النص المستتر ويستخرج الأفكار الأساسية والثانوية، والثانية أنه تحليل غير كمي لا يعتمد على إحصاء تكرار المفردات انطلاقاً من قناعة أن فكرة وردت مرة واحدة يمكن أن تكون هي الأساسية، ويعتمد هذا الأسلوب على الحدس.<br/>
                    • <strong>التحليل الكمي:</strong> طريقة حديثة تقوم على إدخال الإحصاء في دراسة النصوص، واحتساب العناصر المكونة للنص وإحصائها وتصنيفها. وتدعي هذه الطريقة الموضوعية لأنها تجعل النتائج مستقلة عن ذاتية الباحث وعن التقييم الذاتي (عكس الكلاسيكي). وقد عرفت تطوراً كبيراً ولم تعد تقوم على الإحصاء فقط، بل أصبحت تراعي مدى غنى قاموس المبحوث وأشكال وطرق تعبيره. (مثال تطبيقي من النص: دراسة مقارنة لخطاب الحملة الانتخابية الفرنسية عام 1974 أظهرت أن ميتيران تحدث بمعدل 129 كلمة/دقيقة بقاموس أكثر غنى، بينما تحدث جيسكار بسرعة 148 كلمة/دقيقة، في حين جاء طول الجمل متعادلاً بينهما).
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: كيفية كتابة موضوع قانوني */}
        {activeTab === 'essay' && (
          <motion.div
            key="tab-essay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 text-slate-900 dark:text-slate-100 leading-relaxed font-sans text-sm md:text-base"
          >
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-xl font-bold font-serif text-[#0f2d59] dark:text-indigo-300">
                منهجية الإجابة على موضوع قانوني
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                دليل الشروط والخطوات العلمية والتقنية لتحرير وتأطير موضوع قانوني متكامل.
              </p>
            </div>

            <div className="space-y-4">
              {/* التقديم والمدخل */}
              <div className="space-y-3 text-justify leading-loose">
                <p>
                  كثيرا ما يتساءل الطلبة على كيفية الإجابة على موضوع قانوني وإقناع الأستاذ بالإجابة الجيدة والحصول على أعلى المعدلات، وفي هذا الصدد فإن المناهج الحديثة في التعلم تقتضي تحويل الطالب من مجرد ملاحظ إلى فاعل نشيط في الحياة الجامعية بتمكينه من الأدوات والوسائل المنهجية والتقنية للبحث القانوني، وليكون جواب الطالب أو الباحث على موضوع معين في مجال القانون متكامل ومنظم، فلا بد أن ينظم أفكاره ومعلوماته وفقا لمنهجية علمية تسهل على القارئ أو الأستاذ المصحح الاطلاع على المعلومات وفهمها بطريقة ميسرة، ولهذا الغرض تتعدد المنهجيات القانونية مابين ” منهجية تحليل نص قانوني، تحليل موضوع، تعليق على قرار، مشروع نهاية الدراسة أو عرض قانوني “، ونحن سنكتفي هنا بالحديث على طريقة أو منهجية الإجابة على سؤال الموضوع القانوني.
                </p>
                <p>
                  إن الإجابة على موضوع قانوني تقتضي إتباع قواعد علمية وأخرى تقنية لإخراجه في قالب منهجي، وهذا ما يشغل بال الطلبة المقبلين على الامتحانات مما يجعلهم لا يفضلون الإجابة عن الموضوع بالرغم من تمكنهم من المادة، وتمسكهم وتفضيلهم للأسئلة المباشرة، وهو تخوف غير مبرر على الإطلاق، لأن المنهجية القانونية هي جزء لا يتجزأ من أهم ما يدرس للطالب منذ ولوجه لكلية الحقوق، وهي مادة أساسية في السداسي الأول مسلك القانون الجدع المشترك، ويتم إعادة تدريسها في سلك الماستر، لذلك فالطالب ملزم بالإجابة على مثل هذه الأسئلة والتعود عليها لأنه مطالب بها كذلك حتى في مباريات الولوج إلى الوظيفة العمومية.
                </p>
                <p>
                  وعلى العموم فمنهجية الإجابة على موضوع قانوني يجب أن تمر عبر مجموعة من الخطوات،حيث تتكون من ثلاثة عناصر أساسية هي ” المقدمة، التصميم، والعرض” بالإضافة إلى الخاتمة حسب الاختيار.
                </p>
              </div>

              {/* 1- المقدمة */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <h3 className="font-bold text-base md:text-lg text-indigo-900 dark:text-indigo-300 font-serif">
                  1- المقدمة:
                </h3>
                <p className="text-justify leading-loose">
                  لا شك أن للمقدمة دور كبير في تحديد معالم الجواب، ومدى تمكن الطالب من الجواب، وبذلك فالمقدمة هي الإطار العام للموضوع، فمن خلالها يمكن للقارئ أو المصحح، أن يعرف أين يندرج موضوع السؤال، وكذلك التطور التاريخي للموضوع المطروح، وعلى المنهجية المعتمدة في الإجابة، فالطالب ملزم بالتفاعل مع الموضوع، بطرح الأسئلة الآتية من أجل صياغة مقدمة جيدة:
                </p>
                <ul className="list-disc list-inside space-y-1 pr-3 text-justify leading-loose">
                  <li>ما هي المفاهيم الأساسية التي يتمحور حولها الموضوع؟</li>
                  <li>التأصيل التاريخي للموضوع، أو لمحة تاريخية، أو مسيرة الإصلاحات التشريعية؟</li>
                  <li>ما هو الإطار أو السند القانوني الذي ينظم الموضوع؟</li>
                  <li>ما هي العناصر الأساسية المميزة للموضوع؟</li>
                  <li>ما هو موقف القضاء من الموضوع؟</li>
                  <li>ما هو موقف القانون المقارن؟</li>
                  <li>ما هو موقف الفقه من الموضوع؟</li>
                </ul>
                <p className="text-justify leading-loose">
                  وبالتالي فالطالب في المقدمة ملزم بأن ينتقل من الأفكار العامة حتى يصل إلى السؤال المطروح، معرفا بذلك بمفاهيم السؤال، وإطاره القانوني، والتاريخي وكذلك امتداداته.
                </p>
                <p className="text-justify leading-loose">
                  ثم تقسيم السؤال إلى عدة أسئلة (الإشكالية)، من أجل الإجابة عليها في العرض.
                </p>
              </div>

              {/* 2- التصميم */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <h3 className="font-bold text-base md:text-lg text-indigo-900 dark:text-indigo-300 font-serif">
                  2- التصميم:
                </h3>
                <p className="text-justify leading-loose">
                  يعتبر التصميم من المسائل التي تأرق بال الطالب وتجعله يتساءل عن التصميم الذي سيسلكه، وكيفية الوصول إليه وهل هناك نماذج من التصاميم يمكن حفظها، وفي هذا الصدد فالتصميم يتطلب مجهودا ذهنيا كبيرا كما يتطلب إلماما واسعا بالموضوع، لأن وضع التصميم المناسب يتطلب تفكيك الموضوع، وتحديد عناصر الإجابة التي يجب تجميعها في أفكار أساسية منظمة في محورين حتى يكون الموضوع متوازيا شكلا ومضمونا.
                </p>
                <p className="text-justify leading-loose">
                  ويعتبر التصميم جزء لا يتجزأ من المقدمة، فمن خلاله يشرح الطالب كيفية جوابه على السؤال، وفي أي فقرة سيشرح كل جزء من السؤال.
                </p>
                <p className="text-justify leading-loose">
                  وإذا كان يستحسن تقسيم الموضوع إلى محورين فقط ” مبحثين أو مطلبين أو فقرتين..”، كما أشرنا إلى ذلك أعلاه، فانه يتوجب على الطالب أن يعلن في المقدمة فقط على التقسيم الأساسي، أما التقسيم الفرعي فسيظهر في العرض.
                </p>
                <p className="text-justify leading-loose">
                  ومن الأمور المستحبة أن تكون المقدمة والتصميم في صفحة واحدة، والإجابة على الموضوع في الصفحات الموالية.
                </p>
              </div>

              {/* 3- العرض */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <h3 className="font-bold text-base md:text-lg text-indigo-900 dark:text-indigo-300 font-serif">
                  3- العرض:
                </h3>
                <p className="text-justify leading-loose">
                  يعتبر العرض التطبيق أو التنزيل الفعلي للتصميم، والإجابة على الإشكالية المطروحة في الموضوع، فهو الذي توظف فيه المعلومات القانونية التي اكتسبها الطالب والتي يعرفها من خلال المحاضرات أو المراجع التي اطلع عليها، أو ما يسمى بالتراكم المعرفي للطالب التي لن يكون لها أهمية إلا إذا أحسن استعمالها وتوظيفها بطريقة واضحة وبأسلوب قانوني ولغة عربية سليمة، وخالية ما أمكن ذلك من الأخطاء اللغوية والإملائية، تبرز قدرات الطالب العلمية والذكائية ويتوجب تفادي الاختزال والاختصار خاصة عندما يكون السؤال ” أجب بإسهاب ” وأن يلتزم الدقة والوضوح، وأن لا يهتم بالكم على حساب الكيف، كما يتوجب على الطالب احترام نطاق السؤال المطروح وعدم الخروج عنه أو جلب معلومات لا علاقة لها بالموضوع، بل التمسك فقط بالمعلومات الضرورية، وتجنب الأحكام المتسرعة والقبلية وأن يتميز بالنظرة الموضوعية والمستقلة.
                </p>
              </div>

              {/* 4- الخاتمة */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <h3 className="font-bold text-base md:text-lg text-indigo-900 dark:text-indigo-300 font-serif">
                  4- الخاتمة:
                </h3>
                <p className="text-justify leading-loose">
                  تعتبر أمر اختياري إلا أنها أحيانا تعتبر ضرورية، من أجل تقديم خلاصة عامة أو استنتاجات حول النتيجة المتوصل إليها في العرض، ويمكن أيضا طرح فيها سؤال أخر يفتح أمامك البحث في موضوع آخر ذي صلة وثيقة بموضوع التحليل لتكون بذلك خاتمة مفتوحة.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: كيفية حل النازلة القانونية */}
        {activeTab === 'case' && (
          <motion.div
            key="tab-case"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 text-slate-800 dark:text-slate-200 leading-relaxed text-sm md:text-base font-sans"
          >
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-xl font-bold font-serif text-[#0f2d59] dark:text-indigo-300">
                منهجية حل النازلة القانونية
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                دليل الخطوات النظرية والعملية الشاملة لتحليل وقائع النازلة واستخراج المشاكل وصياغة الحلول القانونية.
              </p>
            </div>

            <div className="space-y-6 text-justify leading-loose">
              {/* التعريف بالنازلة */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <p>
                  النازلة هي مجموعة من الوقائع المترابطة في ما بينها، التي تثيرها إشكالات قانونية، تستلزم إيجاد حلول قانونية لها.
                </p>
                <p>
                  يقتضي حل النازلة البحث والتدقيق في النقاط القانونية التي تثيرها، وذلك من أجل إعطاء حلول لها في ضوء ما هو مقرر في القانون.
                </p>
              </div>

              {/* أهمية النازلة */}
              <div className="space-y-3">
                <h3 className="font-bold text-base md:text-lg text-indigo-900 dark:text-indigo-300 font-serif flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  تتمثل أهمية النازلة في عدة نواح منها:
                </h3>
                <ul className="space-y-2 pr-4 text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold shrink-0">✓</span>
                    <span>تثبت استيعاب الطالب للمادة وللنصوص القانونية المرتبطة بها استيعاباً عميقاً وجيداً؛</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold shrink-0">✓</span>
                    <span>تؤهل الطالب للتعامل مع وقائع مشابهة في الحياة العملية، وإيجاد الحلول لمختلف الحالات الواقعية؛</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold shrink-0">✓</span>
                    <span>تمثل تدريباً عملياً على الربط بين القانون والواقع، وبالتالي تجاوز ذلك الانفصام الذي يقع لخريجي كليات الحقوق بين ما درسوه من جهة وما هم مطالبون به في الحياة العملية.</span>
                  </li>
                </ul>
              </div>

              {/* ما يستلزمه حل النازلة */}
              <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <h3 className="font-bold text-base md:text-lg text-indigo-900 dark:text-indigo-300 font-serif flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  يستلزم حل النازلة مجموعة أمور نجملها في ما يلي:
                </h3>
                <ul className="space-y-2 pr-4 text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold shrink-0">✓</span>
                    <span><strong>معرفة محتوى النازلة:</strong> عن طريق تحديد العناصر المهمة في الوقائع المكونة لها؛ فقد لا تكون بالضرورة كل الوقائع الواردة في النازلة مهمة ومفيدة. ولذلك على الطالب أن يميز بين المهم من الوقائع وما لا حاجة له به.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold shrink-0">✓</span>
                    <span><strong>معرفة وضبط المشكل أو المشاكل القانونية:</strong> التي تثيرها النازلة بدقة.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold shrink-0">✓</span>
                    <span><strong>إيجاد الحلول الناجعة لتلك المشاكل:</strong> عن طريق مناقشتها من حيث الموضوع ومن حيث الشكل، ودراسة مختلف الإمكانيات القانونية المتاحة لاختيار أنسبها.</span>
                  </li>
                </ul>
              </div>

              {/* الخطوات العملية لحل النازلة */}
              <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <h3 className="font-bold text-base md:text-lg text-indigo-900 dark:text-indigo-300 font-serif">
                  تتمثل الخطوات العملية لحل النازلة في ما يلي:
                </h3>

                {/* 1. خطوات تتعلق بالوقائع */}
                <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-sm md:text-base">
                    1. خطوات تتعلق بالوقائع، وتشمل:
                  </h4>
                  <ul className="space-y-1.5 pr-3 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold shrink-0">✓</span>
                      <span>القراءة المتأنية والمركزة للنازلة، مع الوقوف على الكلمات المفاتيح، والمصطلحات الأساسية؛</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold shrink-0">✓</span>
                      <span>فرز الوقائع المهمة واستبعاد الوقائع الثانوية، وعدم إضافة وقائع غير مذكورة في النازلة، أو تحميل الوقائع الواردة فيها أكثر مما تحتمل؛</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold shrink-0">✓</span>
                      <span>إعادة تركيب الوقائع بالأسلوب الخاص، مع مراعاة التسلسل المنطقي للأحداث، والحرص على الاختصار وتفادي التكرار.</span>
                    </li>
                  </ul>
                </div>

                {/* 2. خطوات تتعلق بالمشاكل القانونية */}
                <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-sm md:text-base">
                    2. خطوات تتعلق بالمشاكل القانونية، وتشمل:
                  </h4>
                  <ul className="space-y-1.5 pr-3 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold shrink-0">✓</span>
                      <span>فهم الأسئلة المطروحة؛</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold shrink-0">✓</span>
                      <span>ربط الوقائع بالأسئلة المطروحة، عن طريق إعادة صياغة الأسئلة في قالب إشكالي.</span>
                    </li>
                  </ul>
                </div>

                {/* 3. خطوات تتعلق بالحلول */}
                <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-sm md:text-base">
                    3. خطوات تتعلق بالحلول، وتشمل:
                  </h4>
                  <ul className="space-y-1.5 pr-3 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold shrink-0">✓</span>
                      <span>تكييف الوقائع المفرزة تكييفاً قانونياً؛</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold shrink-0">✓</span>
                      <span>إعطاء أجوبة قانونية عن المشاكل القانونية، مع تجنب الانطباعات والاعتبارات الشخصية؛</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold shrink-0">✓</span>
                      <span>تقديم الحل النهائي في الأخير إذا كانت هناك نقطة قانونية وحيدة أو مشكل قانوني وحيد مثار في النازلة. وعند نهاية تحليل كل نقطة قانونية، إذا كانت هناك أكثر من نقطة قانونية أو مشكل قانوني مثار في النازلة.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* عناصر تحرير النازلة */}
              <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <h3 className="font-bold text-base md:text-lg text-indigo-900 dark:text-indigo-300 font-serif">
                  تتكون عناصر تحرير النازلة مما يلي:
                </h3>

                <div className="space-y-4 pr-2">
                  <div>
                    <h4 className="font-bold text-indigo-800 dark:text-indigo-400 text-base">
                      1. في المقدمة:
                    </h4>
                    <ul className="space-y-1 pr-4 mt-1 text-slate-700 dark:text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold shrink-0">✓</span>
                        <span>بيان الإطار العام للنازلة دون الحسم في الحل النهائي لها؛</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold shrink-0">✓</span>
                        <span>عرض موجز للوقائع بأسلوب الطالب، مع مراعاة التسلسل الزمني للأحداث، والاقتصار على الوقائع التي لها علاقة بالمشاكل القانونية التي تثيرها النازلة؛</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold shrink-0">✓</span>
                        <span>إبراز المشاكل القانونية المثارة في النازلة؛</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold shrink-0">✓</span>
                        <span>الإعلان عن خطة معالجة النازلة.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-indigo-800 dark:text-indigo-400 text-base">
                      2. في العرض:
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                      يتم التقسيم بناء على الخطة المعلنة، مع الحرص على ما يلي:
                    </p>
                    <ul className="space-y-1 pr-4 text-slate-700 dark:text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold shrink-0">✓</span>
                        <span>تحديد المفاهيم الأساسية للمصطلحات الواردة في النازلة؛</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold shrink-0">✓</span>
                        <span>إعمال النصوص القانونية مع ربطها بوقائع النازلة؛</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold shrink-0">✓</span>
                        <span>عرض الاجتهادات القضائية والآراء الفقهية، عند الاقتضاء، ومناقشتها لاستبعاد ما ينبغي استبعاده منها؛</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold shrink-0">✓</span>
                        <span>بيان موقف المشرع المغربي مع ربطه بالنازلة؛</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold shrink-0">✓</span>
                        <span>تقديم الحل المناسب بحسب النقطة أو النقاط القانونية المثارة في النازلة، مع استعمال أسلوب التعليل (حيث إن ... - وبما أن ....).</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-indigo-800 dark:text-indigo-400 text-base">
                      3. في الخاتمة:
                    </h4>
                    <p className="pr-4 text-slate-700 dark:text-slate-300">
                      هي عبارة عن خلاصة نهائية يتم تقديمها في الأخير عن طريق تجميع الحلول المتوصل إليها.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: تقديم استشارة قانونية */}
        {activeTab === 'consultation' && (
          <motion.div
            key="tab-consultation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 text-slate-800 dark:text-slate-200 leading-relaxed text-sm md:text-base font-sans"
          >
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-xl font-bold font-serif text-[#0f2d59] dark:text-indigo-300">
                منهجية حل الاستشارات القانونية (وفق رؤية الأستاذ الدكتور عطاء الله بوحميدة)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                دليل تفكيك النزاعات وتحليل الوقائع للوصول إلى حلول قانونية سليمة عبر المرحلتين التحضيرية والتحريرية.
              </p>
            </div>

            <div className="space-y-6 text-justify leading-loose">
              {/* التقديم والمدخل */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <p>
                  تعتبر منهجية حل الاستشارات القانونية من أهم الأدوات التي يحتاجها الطالب في تكوينه الأكاديمي، والقانوني في ممارسته المهنية. فهي تتيح الانتقال من الجانب النظري المجرد إلى التطبيق العملي، وتمكن المستشار من تفكيك الوقائع وتحليلها للوصول إلى حلول قانونية سليمة ومنطقية. وتقوم هذه المنهجية على مرحلتين أساسيتين: <strong>مرحلة تحضيرية</strong>، و<strong>مرحلة تحريرية</strong>.
                </p>
              </div>

              {/* المرحلة الأولى: المرحلة التحضيرية */}
              <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <h3 className="font-bold text-base md:text-lg text-indigo-900 dark:text-indigo-300 font-serif">
                  المرحلة الأولى: المرحلة التحضيرية (التمهيد للاستشارة)
                </h3>
                <p>
                  تهدف هذه المرحلة إلى استخلاص العناصر الأساسية للنزاع أو المسألة المطروحة، وتنقسم إلى ثلاث ركائز رئيسية:
                </p>

                <div className="space-y-4 pr-2">
                  {/* أ. الوقائع */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-2">
                    <h4 className="font-bold text-indigo-800 dark:text-indigo-400 text-base">
                      أ. الوقائع
                    </h4>
                    <p>
                      الوقائع هي مجموع الأحداث القانونية والمادية التي أدى تتابعها الزمني إلى تكوين موضوع النزاع (وهي بمثابة "سبب النزاع").
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 pr-2">
                      <li><strong>طريقة صياغتها:</strong> تُعرض بأسلوب موضوعي، دون إبداء أي رأي أو حكم عليها.</li>
                      <li><strong>ضوابطها:</strong> تُرتَّب ترتيباً تسلسلياً وزمنياً دقيقاً.</li>
                      <li><strong>شرط أساسي:</strong> يجب انتقاؤها بدقة، بحيث يتم حذف الوقائع الثانوية التي لم تؤثر بشكل مباشر في نشوب النزاع أو تطوره، مع التركيز على الجوهر القانوني للمسألة.</li>
                    </ul>
                  </div>

                  {/* ب. الإجراءات */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-2">
                    <h4 className="font-bold text-indigo-800 dark:text-indigo-400 text-base">
                      ب. الإجراءات
                    </h4>
                    <p>
                      الإجراءات هي المراحل القانونية والإدارية والقضائية التي مر بها النزاع منذ نشأته.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 pr-2">
                      <li><strong>ضوابط الترتيب:</strong> تُرتَّب ترتيباً زمنياً، مع مراعاة التسلسل الهرمي للجهات التي تم الالتجاء إليها.</li>
                      <li><strong>على المستوى الإداري:</strong> تبدأ من أدنى مصلحة (كالقسم أو المديرية)، ثم تتصاعد إلى أعلى سلم إداري (كالإدارة المركزية أو الوزارة).</li>
                      <li><strong>على المستوى القضائي:</strong> تُرتَّب وفق درجات التقاضي (المحكمة الابتدائية، ثم محكمة الاستئناف/المجلس، ثم المحكمة العليا/محكمة النقض، أو المحكمة الإدارية ثم مجلس الدولة).</li>
                      <li><strong>ملاحظة:</strong> إذا لم يقم المستشير بأي إجراء، فإن هذا العنصر يسقط تلقائياً من منهجية الاستشارة.</li>
                    </ul>
                  </div>

                  {/* ج. طرح المسائل القانونية */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-2">
                    <h4 className="font-bold text-indigo-800 dark:text-indigo-400 text-base">
                      ج. طرح المسائل القانونية
                    </h4>
                    <p>
                      هي حجر الزاوية في الاستشارة، وتتمثل في تحويل الوقائع والإجراءات إلى تساؤلات قانونية دقيقة.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 pr-2">
                      <li><strong>الهدف:</strong> استخراج كافة المسائل القانونية المطروحة، وحصرها بشكل شامل دون التوسع في مسائل لا علاقة لها بالموضوع.</li>
                      <li><strong>طريقة الصياغة:</strong> تُصاغ على شكل تساؤلات مباشرة وواضحة.</li>
                    </ul>

                    {/* نموذج تطبيقي */}
                    <div className="mt-3 p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                      <p className="font-bold text-indigo-900 dark:text-indigo-300 text-sm mb-1">
                        نموذج تطبيقي (مثال في نزاع إداري بين بلدية وموظف):
                      </p>
                      <ol className="list-decimal list-inside space-y-1 text-slate-800 dark:text-slate-200 text-sm pr-2">
                        <li>ما هي طبيعة النزاع القائم بين الطرفين (إداري أم خاص)؟</li>
                        <li>هل التظلم الإداري وجوبي في هذا النزاع؟</li>
                        <li>ما هي الدعوى الملائمة لرفعها في هذه الحالة؟</li>
                        <li>ما هي الجهة القضائية المختصة نوعياً ومحلياً؟</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              {/* المرحلة الثانية: المرحلة التحريرية */}
              <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <h3 className="font-bold text-base md:text-lg text-indigo-900 dark:text-indigo-300 font-serif">
                  المرحلة الثانية: المرحلة التحريرية (صياغة الحلول)
                </h3>
                <p>
                  في هذه المرحلة، يتم الانتقال من طرح الأسئلة إلى تقديم الأجوبة القانونية، بحيث تُخصص <strong>فقرة مستقلة</strong> لكل مسألة قانونية تم طرحها سابقاً. ويُعمل في كل فقرة على اتباع نفس البنية الثلاثية (الوقائع، السؤال القانوني، الحل القانوني والإجابة).
                </p>

                <div className="space-y-4 pr-2">
                  <h4 className="font-bold text-indigo-800 dark:text-indigo-400 text-base">
                    النموذج الهيكلي للإجابة عن كل مسألة قانونية:
                  </h4>

                  {/* الفقرة الأولى */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base">
                      الفقرة الأولى: فيما يخص تحديد طبيعة النزاع
                    </h5>
                    <ul className="space-y-1.5 pr-2 text-slate-700 dark:text-slate-300">
                      <li><strong>• الوقائع:</strong> إعادة فرز وذكر الوقائع الخاصة بهذه المسألة فقط (أو ذكرها كاملة إن كانت جميعها ذات صلة مباشرة).</li>
                      <li><strong>• السؤال القانوني:</strong> يُعاد طرح السؤال المحدد لهذه النقطة.</li>
                      <li>
                        <strong>• الحل القانوني:</strong> القراءة الدقيقة للقاعدة القانونية التي تحكم المسألة.
                        <div className="mt-1 pr-3 border-r-2 border-indigo-400 dark:border-indigo-600 text-xs md:text-sm space-y-1 text-slate-600 dark:text-slate-400">
                          <p><em>القاعدة الذهبية:</em> في حال وجود نص قانوني واضح يُجيب عن الإشكال، يُعتمد عليه مباشرة دون اللجوء إلى الفقه أو الاجتهاد القضائي، لأن الهدف من الاستشارة هو الوصول إلى الحل الصحيح لا الانخراط في الجدل الفقهي.</p>
                          <p><em>الاستثناء:</em> في حال عدم وجود نص تشريعي أو اجتهاد قضائي، يمكن الاستعانة بموقف الفقه لسد الفراغ القانوني.</p>
                        </div>
                      </li>
                      <li><strong>• الإجابة:</strong> الخروج بحكم قانوني واضح بناءً على الحل القانوني المعتمد.</li>
                    </ul>
                  </div>

                  {/* الفقرة الثانية */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base">
                      الفقرة الثانية: فيما يخص مسألة التظلم الإداري (وجوبياً كان أم اختيارياً)
                    </h5>
                    <ul className="space-y-1.5 pr-2 text-slate-700 dark:text-slate-300">
                      <li><strong>• الوقائع:</strong> (ذات الصلة بهذا الإجراء).</li>
                      <li><strong>• السؤال القانوني:</strong> (مثال: هل كان التظلم وجوبياً؟).</li>
                      <li><strong>• الحل القانوني:</strong> (الرجوع إلى القانون المنظم للإجراءات).</li>
                      <li><strong>• الإجابة:</strong> (يُحدد هل قام المستشير به أم لا، وما هي آثاره على سير الدعوى).</li>
                    </ul>
                  </div>

                  {/* الفقرة الثالثة */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base">
                      الفقرة الثالثة: فيما يخص الدعوى الملائمة
                    </h5>
                    <ul className="space-y-1.5 pr-2 text-slate-700 dark:text-slate-300">
                      <li><strong>• الوقائع:</strong> (ذات الصلة بنوع الدعوى).</li>
                      <li><strong>• السؤال القانوني:</strong> (هل الدعوى المناسبة هي دعوى الإلغاء، أم دعوى التعويض، أم دعوى التفسير مثلاً؟).</li>
                      <li><strong>• الحل القانوني:</strong> (تحديد طبيعة الدعوى بناءً على المطلوب: نقض قرار إداري أم المطالبة بتعويض عن ضرر).</li>
                      <li><strong>• الإجابة:</strong> (تحديد الدعوى التي ينبغي على المستشير رفعها).</li>
                    </ul>
                  </div>

                  {/* الفقرة الرابعة */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base">
                      الفقرة الرابعة: فيما يخص الجهة القضائية المختصة
                    </h5>
                    <ul className="space-y-1.5 pr-2 text-slate-700 dark:text-slate-300">
                      <li><strong>• الوقائع:</strong> (ذات الصلة بمكان وجود الأطراف والموضوع).</li>
                      <li><strong>• السؤال القانوني الفرعي الأول:</strong> ما هي الجهة المختصة نوعياً؟ (إداري، مدني، تجاري...).</li>
                      <li><strong>• السؤال القانوني الفرعي الثاني:</strong> ما هي الجهة المختصة محلياً؟ (أي محكمة أو مجلس).</li>
                      <li><strong>• الحل القانوني:</strong> الرجوع إلى قواعد الاختصاص في قانون المسطرة أو القانون الأساسي للجهة.</li>
                      <li><strong>• الإجابة:</strong> تحديد الجهة القضائية بدقة (مثال: الغرفة الإدارية بمجلس قضاء كذا، أو المحكمة الإدارية بكذا).</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* الخاتمة (الحوصلة) */}
              <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <h3 className="font-bold text-base md:text-lg text-indigo-900 dark:text-indigo-300 font-serif">
                  الخاتمة (الحوصلة)
                </h3>
                <p>
                  الحوصلة ليست مجرد إعادة لتكرار ما سبق، بل هي تركيز وتجميع للإجابات الفرعية المتفرقة في فقرات سابقة، وصياغتها في مقطع موجز يقدم صورة شاملة ومتكاملة عن الاستشارة.
                </p>

                <div className="p-4 bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl space-y-2">
                  <span className="font-bold text-amber-900 dark:text-amber-300 text-sm">
                    صياغة نموذجية للحوصلة:
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 italic font-serif leading-relaxed text-sm md:text-base">
                    "خلاصة القول إن النزاع القائم بين السيد .... والسيد .... يُعتبر نزاعاً إدارياً، كونه يدور بين أحد الأفراد وجهة إدارية، عملاً بالمادة ... من القانون ...، وعليه يتعين على السيد ... أن يقدم تظلماً وجوبياً لدى الإدارة المعنية، ثم يرفع دعوى الإلغاء ضد القرار المذكور أمام الجهة القضائية المختصة نوعياً (الغرفة الإدارية بمجلس قضاء ...)، والمختصة محلياً (دائرة اختصاصها ...)، وذلك في حدود الأجل القانوني المحدد لذلك."
                  </p>
                </div>
              </div>

              {/* تذكير منهجي */}
              <div className="p-4 bg-indigo-900 text-white rounded-xl space-y-1 shadow-sm">
                <span className="font-bold text-amber-300 text-sm md:text-base block">
                  تذكير منهجي:
                </span>
                <p className="text-xs md:text-sm text-indigo-100 leading-relaxed">
                  هذه المنهجية تحقق لك سلسلة منطقية تبدأ بـ <strong>"ماذا حدث؟"</strong> (الوقائع والإجراءات)، مروراً بـ <strong>"ما المشكلة القانونية هنا؟"</strong> (المسائل القانونية)، وصولاً إلى <strong>"ما العمل الآن؟"</strong> (الحلول والإجابة)، وهو ما يمنح إجابتك العمق الأكاديمي والتطبيقي الذي يؤهلك للحصول على درجات عليا.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: قواعد التوثيق والمراجع */}
        {activeTab === 'citations' && (
          <motion.div
            key="tab-citations"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 text-slate-900 dark:text-slate-100 leading-relaxed font-sans text-sm md:text-base"
          >
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-xl font-bold font-serif text-[#0f2d59] dark:text-indigo-300">
                قواعد التوثيق وضوابط البحث العلمي
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                دليل ضوابط الكتابة والتوثيق الأكاديمي للهوامش والمراجع والأبحاث القانونية.
              </p>
            </div>

            {/* أولا: ضوابط الكتابة */}
            <div className="space-y-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg md:text-xl font-bold font-serif text-indigo-900 dark:text-indigo-300">
                أولا: ضوابط الكتابة
              </h2>

              <div className="space-y-3 pr-2">
                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    أ- بيانات البحث:
                  </h3>
                  <p className="text-justify leading-loose">
                    تحتوي الصفحة الأولى من البحث على: عنوان البحث بخط Simplified Arabic حجم 18، كما تحتوي أسفل العنوان مباشرة من جهة اليسار على الاسم الكامل للباحث ودرجته العلمية، والجامعة التي ينتمي إليها وصفته إن اقتضى الحال بخط Simplified Arabic حجم 14.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    ب- مواصفات النص:
                  </h3>
                  <p className="text-justify leading-loose">
                    تقدم الأبحاث مكتوبة على مستند (Word 2007) أو (Word 2003) وتكون الحواشي (cm 2.5) على جوانب الصفحة الأربعة.<br/>
                    تكتب الأبحاث باللغة العربية بخط Simplified Arabic حجم 14، وتكتب العناوين الرئيسية والفرعية للفقرات بنفس الحجم والخط مثلها مثل النص الرئيسي لكن مع تضخيم الخط. وتكون المسافة بين الأسطر نقطة واحدة (1) multiple)، وبين الفقرات (6 pt). مع ترك فراغ بشكل آلي في بداية كل عنوان أو فقرة قدره (cm 0.6).<br/>
                    أما الأبحاث باللغة اللاتينية فتكتب بخط Time new Roman، بحجم 12، وتكتب العناوين الرئيسية والفرعية للفقرات بنفس الحجم والخط مثلها مثل النص الرئيسي لكن مع تضخيم الخط. وتكون المسافة بين الأسطر نقطة واحدة ونصف (1,5) multiple)، وبين الفقرات (12 pt). مع ترك فراغ بشكل آلي في بداية كل عنوان أو فقرة قدره (cm 0.6).
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    ج- الهوامش:
                  </h3>
                  <p className="text-justify leading-loose">
                    يلتزم الباحث بكتابة الهوامش في الصفحات المتعلقة بها أسفل الصفحة وذلك بكيفية آلية، مع إعطائها رقما تسلسليا بالنسبة للبحث بأكمله.<br/>
                    وتكتب الهوامش باللغة العربية بخط Simplified Arabic حجم 11، بينما تكتب الهوامش باللغة اللاتنية بخط Time new Roman، حجم 9.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    د- علامات الترقيم:
                  </h3>
                  <p className="text-justify leading-loose">
                    توضع النقطة (.) بعد الكلمة مباشرة دون وجود فراغ بينهما، ويوضع فراغ واحد بين الكلمات أو بين النّقطة وبداية الجملة التّالية. ولا توضع النقطة (.) أبدا في العناوين، أما إذا كان العنوان يضم عنوانين أحدهما فرعي والآخر رئيسي فيفصل بينهما بنقطتين.<br/>
                    يجب إدراك الفرق بين الفاصلة بالعربية (،) والفاصلة بالأجنبية (,) واستغلالهما في المكان المناسب، كما تكتب الفاصلة بعد الكلمة مباشرة ولا يوجد فراغ بينهما.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    هـ- مختلفات:
                  </h3>
                  <p className="text-justify leading-loose">
                    • تكتب واو العطف ملتصقة بالكلمة التي تليها ولا يترك فراغ بينهما.<br/>
                    • عدم تزيين النص بالألوان والخطوط العريضة وتكبير الحجم، يجب احترام الشروط المعروضة سابقا.<br/>
                    • ضبط اتجاه النص بالعربية من اليمين الى اليسار، والنص بالأجنبية من اليسار إلى اليمين، وضبط اتجاه الجمل في النصوص إذا كانت باللغة العربية أو بالأجنبية.
                  </p>
                </div>
              </div>
            </div>

            {/* ثانيا: ضوابط التوثيق */}
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-bold font-serif text-indigo-900 dark:text-indigo-300">
                ثانيا: ضوابط التوثيق
              </h2>

              <div className="space-y-4 pr-2">
                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    أ- المؤلفـات:
                  </h3>
                  <p className="text-justify leading-loose">
                    1– اسم المؤلف، عنوان الكتاب، (رقم الجزء أو السلسلة إن وجد)، الطبعة، الناشر، مكان النشر، سنة النشر، رقم الصفحة؛ كما يلي:<br/>
                    – امحمد لفروجي: صعوبات المقاولة والمساطر القضائية الكفيلة بمعالجتها، الطبعة الأولى، مطبعة النجاح الجديدة الدار البيضاء، فبراير 2000، ص 000.<br/>
                    2– ويستشهد بالكتاب في الإحالة اللاحقة غير الموالية مباشرة على النحو التالي:<br/>
                    امحمد لفروجي، مرجع سابق، ص 000.<br/>
                    3– ما لم يكن يوجد أكثر من مرجع واحد للمؤلف نفسه، ففي هذه الحالة يتم استخدام العنوان مختصرا كما يلي:<br/>
                    – امحمد لفروجي: صعوبات المقاولة…، مرجع سابق، ص 000.<br/>
                    4– أما في قائمة المراجع فيرد الكتاب على النحو التالي:<br/>
                    – امحمد لفروجي: صعوبات المقاولة والمساطر القضائية الكفيلة بمعالجتها، الطبعة الأولى، مطبعة النجاح الجديدة الدار البيضاء، فبراير 2000.<br/>
                    5– وبالنسبة إلى الكتاب الذي اشترك في تأليفه أكثر من مؤلفين، فيكتب أسماء المؤلفين جميعا عند الإحالة الأولى فقط، هكذا:<br/>
                    أحمد شكري السباعي، امحمد لفروجي، عز الدين بنستي: الشركات التجارية، الطبعة الأولى، مطبعة النجاح الجديدة الدار البيضاء، فبراير 2010، ص 000.<br/>
                    أما في باقي الإحالات فيكتب اسم المؤلف الأول مع عبارة “وآخرون”، مثال:<br/>
                    أحمد شكري السباعي وآخرون، مرجع سابق، ص 000.<br/>
                    6– بالنسبة للإحالة على الصفحات إذا كانت الإحالة على صفحتين تتم الإشارة إليهما هكذا مثلا: ص 12 و13. وإذا كانت الإحالة تشمل 3 صفحات فأكثر تتم الإحالة على الشكل التالي: ص 12 وما بعدها.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    ب- الرسائل والأطروحات:
                  </h3>
                  <p className="text-justify leading-loose">
                    <strong>* بالنسبة للرسائل:</strong><br/>
                    1– اسم الباحث، عنوان الرسالة، نوع الرسالة (رسالة ماستر أو رسالة دبلوم الدراسات العليا المعمقة أو المتخصصة، أو رسالة دبلوم الدراسات العليا)، التخصص (قانون عام أم خاص)، الكلية، الجامعة، السنة الجامعية، رقم الصفحة أو الصفحات.<br/>
                    إدريس مساعيد: مهام مراقب الحسابات في صعوبات المقاولة، رسالة لنيل دبلوم الدراسات العليا المعمقة في القانون الخاص، كلية العلوم القانونية والاقتصادية والاجتماعية عين الشق، جامعة الحسن الثاني بالدار البيضاء، السنة الجامعية، 2002-2003، ص 000.<br/>
                    2- ويستشهد بالرسالة في الإحالة اللاحقة غير الموالية مباشرة على النحو التالي:<br/>
                    إدريس مساعيد، مرجع سابق، ص 000.<br/>
                    3- أما في قائمة المراجع فترد الرسالة على النحو التالي:<br/>
                    إدريس مساعيد: مهام مراقب الحسابات في صعوبات المقاولة، رسالة لنيل دبلوم الدراسات العليا المعمقة في القانون الخاص، كلية العلوم القانونية والاقتصادية والاجتماعية عين الشق، جامعة الحسن الثاني بالدار البيضاء، السنة الجامعية، 2002-2003.<br/><br/>

                    <strong>* بالنسبة للأطروحة:</strong><br/>
                    1- اسم الباحث، عنوان الأطروحة، نوع الأطروحة (أطروحة، أطروحة دولة) التخصص (قانون عام أم خاص)، الكلية، الجامعة، السنة الجامعية، رقم الصفحة أو الصفحات.<br/>
                    امحمد لفروجي: القانون البنكي المغربي وحماية حقوق الزبناء، أطروحة لنيل الدكتوراه الدولة في القانون الخاص، كلية الحقوق بالدار البيضاء، السنة الجامعية 1996 / 1997، ص 000.<br/>
                    2- ويستشهد بالأطروحة في الإحالة اللاحقة غير الموالية مباشرة على النحو التالي:<br/>
                    امحمد لفروجي، مرجع سابق، ص 000.<br/>
                    3- أما في قائمة المراجع فترد الأطروحة على النحو التالي:<br/>
                    امحمد لفروجي: القانون البنكي المغربي وحماية حقوق الزبناء، أطروحة لنيل الدكتوراه الدولة في القانون الخاص، كلية الحقوق بالدار البيضاء، السنة الجامعية 1996 / 1997.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    ج- المقالات:
                  </h3>
                  <p className="text-justify leading-loose">
                    1- بالنسبة إلى المقالات، يكون الأمر كما يلي: اسم المؤلف، عنوان المقال، اسم المجلة، رقم العدد، سنة النشر، رقم الصفحة. مثال:<br/>
                    صالح الذهبي : دور المصالح في إنقاذ المؤسسات التي تمر بصعوبات اقتصادية- مجلة القضاء المدني- العدد 12، صيف/خريف 2012، ص 000.<br/>
                    2- ويستشهد بالمقال في الإحالة اللاحقة غير الموالية مباشرة على النحو التالي:<br/>
                    – صالح الذهبي، مرجع سابق، ص 000.<br/>
                    3- أما في قائمة المراجع، فنكتب: صالح الذهبي : دور المصالح في إنقاذ المؤسسات التي تمر بصعوبات اقتصادية، مجلة القضاء المدني- العدد 12، صيف/خريف 2012.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    د- المساهمات والمداخلات:
                  </h3>
                  <p className="text-justify leading-loose">
                    1- بالنسبة للمساهمات والمداخلات وهي العروض التي تلقى في الندوات والمؤتمرات يكون التوثيق كالتالي:<br/>
                    – اسم المؤلف، عنوان المساهمة أو المداخلة أو العرض، موضوع الندوة أو المؤتمر، الجهة المنظمة، مكان التنظيم، تاريخ التنظيم، الناشر، مكان النشر، سنة النشر، رقم الصفحة. مثال:<br/>
                    – زكرياء العماري: نهائية الرسم العقاري بين الإطلاق والتقييد، مداخلة في أشغال الندوة الدولية الأولى الذي نظمها مختبر الدراسات القانونية المدنية والعقارية بجامعة القاضي عياض بمراكش حول موضوع: “مستجدات نظام التحفيظ العقاري في دول المغرب العربي” يومي 23 و 24 مارس 2012، بمقر كلية العلوم القانونية والاقتصادية والاجتماعية بمراكش، المطبعة الوراقة الوطنية، مراكش 2013، ص 000.<br/>
                    2- وتذكر في الإحالة الموالية كما يلي:<br/>
                    زكرياء العماري: مرجع سابق، ص 000.<br/>
                    3- أما في قائمة المراجع فتتم الإشارة إليها بجميع البيانات أعلاه دون رقم الصفحة أو الصفحات.<br/>
                    4- وإذا كانت أشغال الندوة غير منشورة وتحصل الباحث على نسخة من العرض أو المداخلة من صاحب المداخلة مباشرة فيتم التوثيق كما يلي:<br/>
                    زكرياء العماري: نهائية الرسم العقاري بين الإطلاق والتقييد، مداخلة في أشغال الندوة الدولية الأولى الذي نظمها مختبر الدراسات القانونية المدنية والعقارية بجامعة القاضي عياض بمراكش حول موضوع: “مستجدات نظام التحفيظ العقاري في دول المغرب العربي” يومي 23 و 24 مارس 2012، مداخلة غير منشورة، ص 000.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    هـ- القرارات والأحكام القضائية:
                  </h3>
                  <p className="text-justify leading-loose">
                    1- يتم الإشارة إليها كما يلي:<br/>
                    المحكمة المصدرة للحكم، رقم الحكم، تاريخ الحكم، رقم الملف، منشور بـ (إذا كان نصه منشور بالكامل تتم الإشارة إلى المرجع المنشور به وفق الضوابط المشار إليها أعلاه).<br/>
                    مثلا: محكمة النقض، قرار عدد 125، صادر بتاريخ 12 مارس 2016، ملف مدني عدد 1325/1/2/2016، منشور بمجلة القضاء المدني، العدد 12، شتاء/ربيع 2016، ص 000.<br/>
                    2- وإذا كان مشار إلى القاعدة أو المبدأ الذي جاء به الحكم أو القرار دون نشر نصه كاملا فيتم التوثيق كما يلي:<br/>
                    مثلا: محكمة النقض، قرار عدد 125، صادر بتاريخ 12 مارس 2016، ملف مدني عدد 1325/1/2/2016، أورده امحمد لفروجي، مرجع سابق، ص 000.<br/>
                    3- وإذا كانت إحدى البيانات الخاصة بالحكم المذكورة غير متوفرة يتم التوثيق كما يلي:<br/>
                    مثلا: محكمة النقض، قرار عدد 125، صادر بتاريخ 12 مارس 2016، (رقم الملف غير مذكور)، منشور بمجلة القضاء المدني، العدد 12، شتاء/ربيع 2016، ص 000.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    ملاحظة هامة بالنسبة لتوثيق الإحالة عن طريق الواسطة:
                  </h3>
                  <p className="text-justify leading-loose">
                    إذا تعذر الحصول على المرجع الأصلي لفكرة معينة، واقتصر على نقل الفكرة من مرجع آخر فيتم التوثيق كما يلي:<br/>
                    نبيل اسماعيل عمر، صعوبات التنفيذ، منشأة المعارف، الإسكندرية، 2016، ص 000، نقلا عن أحمد شكري السباعي، مرجع سابق، ص 000.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif text-indigo-800 dark:text-indigo-400">
                    و- النصوص التشريعية والتنظيمية:
                  </h3>
                  <p className="text-justify leading-loose">
                    <strong>* بالنسبة للنصوص التشريعية:</strong><br/>
                    1- تتم الإشارة إليها كما يلي:<br/>
                    – رقم القانون وموضوعه ومراجع الظهير الشريف الصادر بتنفيذه (رقمه وتاريخه الهجري والميلادي) ومراجع الجريدة الرسمية المنشور فيها (رقمها وتاريخها الميلادي ورقم الصفحة).<br/>
                    مثلا: القانون رقم 39.08 المتعلق بمدونة الحقوق العينية الصادر بتنفيذه الظهير الشريف رقم 1.11.178 المؤرخ في 25 من ذي الحجة 1432 (11 نوفمبر 2011)، الجريدة الرسمية عدد 5998 بتاريخ 24 نوفمبر 2011، ص 5587.<br/>
                    2– ويشار إلى القانون فيما يأتي لاحقا على النحو التالي: – القانون رقم 39.08 المتعلق بمدونة الحقوق العينية<br/><br/>

                    <strong>* بالنسبة للنصوص التنظيمية:</strong><br/>
                    <strong>1- المراسيم:</strong><br/>
                    تتم الإشارة إليها كما يلي:<br/>
                    – رقم المرسوم وتاريخ صدوره (الهجري والميلادي) وموضوعه ومراجع الجريدة الرسمية المنشور فيها (رقمها وتاريخها الميلادي ورقم الصفحة).<br/>
                    مثلا: مرسوم رقم 2.14.881 صادر في 27 من جمادى الآخرة 1436 (17 أبريل 2015) بتطبيق المادة 174 من القانون رقم 39.08 المتعلق بمدونة الحقوق العينية، الجريدة الرسمية عدد 5998 بتاريخ 24 نوفمبر 2011، ص 5587.<br/>
                    – ويشار إلى المرسوم فيما يأتي لاحقا على النحو التالي: – المرسوم رقم 2.14.881 المتعلق بتطبيق المادة 174 من القانون رقم 39.08 المتعلق بمدونة الحقوق العينية.<br/><br/>

                    <strong>2- القرارات الوزارية:</strong><br/>
                    تتم الإشارة إليها كما يلي:<br/>
                    – القطاع الوزاري المصدر للقرار ورقم القرار وتاريخ صدوره (الهجري والميلادي) وموضوعه ومراجع الجريدة الرسمية المنشور فيها (رقمها وتاريخها الميلادي ورقم الصفحة).<br/>
                    مثلا: قرار وزير الأوقاف والشؤون الإسلامية رقم 4140.12 صادر في 5 صفر 1434 (19 ديسمبر 2012) في شأن تحديد كيفيات إجراء المعاوضات العينية للأموال الموقوفة، الجريدة الرسمية عدد 5998 بتاريخ 24 نوفمبر 2011، ص 5587.<br/>
                    ويشار إلى القرار فيما يأتي لاحقا على النحو التالي: – قرار وزير الأوقاف والشؤون الإسلامية رقم 4140.12 في شأن تحديد كيفيات إجراء المعاوضات العينية للأموال الموقوفة.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: مولد الإحالات الآلي */}
        {activeTab === 'generator' && (
          <motion.div
            key="tab-generator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 text-slate-800 dark:text-slate-200 text-sm font-sans"
          >
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-xl font-bold font-serif text-[#0f2d59] dark:text-indigo-300 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-600" />
                <span>مولد التوثيق والإحالات القانونية الآلي</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                قم باختيار نوع المرجع وإدخال بياناته للحصول على التوثيق الأكاديمي الدقيق للهامش ولائحة المراجع المعتمد في البحوث القانونية.
              </p>
            </div>

            {/* Type Switcher Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
              {[
                { id: 'book', label: 'كتاب / مؤلف' },
                { id: 'thesis', label: 'رسالة / أطروحة' },
                { id: 'article', label: 'مقال بمجلة' },
                { id: 'conference', label: 'مداخلة / ندوة' },
                { id: 'court_ruling', label: 'قرار قضائي' },
                { id: 'legislation', label: 'نص تشريعي / تنظيمي' },
                { id: 'secondary', label: 'إحالة بالواسطة (نقلاً عن)' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setCitationType(t.id as CitationType)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border whitespace-nowrap",
                    citationType === t.id
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Repetition Toggles */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-6 text-xs font-medium">
              <span className="font-bold text-slate-700 dark:text-slate-300">حالة المرجع:</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="citationStatus"
                  checked={!formData.isRepeated && !formData.isSameAsAbove}
                  onChange={() => setFormData(p => ({ ...p, isRepeated: false, isSameAsAbove: false }))}
                  className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>إحالة أولى (مرجع جديد)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="citationStatus"
                  checked={formData.isRepeated}
                  onChange={() => setFormData(p => ({ ...p, isRepeated: true, isSameAsAbove: false }))}
                  className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>مرجع سابق (Op. cit)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="citationStatus"
                  checked={formData.isSameAsAbove}
                  onChange={() => setFormData(p => ({ ...p, isSameAsAbove: true, isRepeated: false }))}
                  className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>المرجع نفسه (Ibid)</span>
              </label>
            </div>

            {/* Form Fields according to type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {!formData.isSameAsAbove && (
                <>
                  {/* Book Specific */}
                  {citationType === 'book' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">اسم المؤلف / المؤلفين:</label>
                        <input
                          type="text"
                          placeholder="مثال: امحمد لفروجي"
                          value={formData.author}
                          onChange={(e) => setFormData(p => ({ ...p, author: e.target.value }))}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                        />
                      </div>

                      {!formData.isRepeated && (
                        <>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">عنوان الكتاب:</label>
                            <input
                              type="text"
                              placeholder="مثال: صعوبات المقاولة والمساطر القضائية الكفيلة بمعالجتها"
                              value={formData.title}
                              onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">الجزء / السلسلة (إن وجد):</label>
                            <input
                              type="text"
                              placeholder="مثال: الجزء الأول"
                              value={formData.part}
                              onChange={(e) => setFormData(p => ({ ...p, part: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">الطبعة:</label>
                            <input
                              type="text"
                              placeholder="مثال: الطبعة الأولى"
                              value={formData.edition}
                              onChange={(e) => setFormData(p => ({ ...p, edition: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">الناشر والمطبعة:</label>
                            <input
                              type="text"
                              placeholder="مثال: مطبعة النجاح الجديدة"
                              value={formData.publisher}
                              onChange={(e) => setFormData(p => ({ ...p, publisher: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">مكان النشر:</label>
                            <input
                              type="text"
                              placeholder="مثال: الدار البيضاء"
                              value={formData.place}
                              onChange={(e) => setFormData(p => ({ ...p, place: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">تاريخ / سنة النشر:</label>
                            <input
                              type="text"
                              placeholder="مثال: فبراير 2000"
                              value={formData.year}
                              onChange={(e) => setFormData(p => ({ ...p, year: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>
                        </>
                      )}

                      {/* Book options for repeated citations */}
                      {formData.isRepeated && (
                        <div className="col-span-full space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                          <label className="flex items-center gap-2 cursor-pointer text-xs">
                            <input
                              type="checkbox"
                              checked={formData.multipleAuthors}
                              onChange={(e) => setFormData(p => ({ ...p, multipleAuthors: e.target.checked }))}
                              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                            />
                            <span>أكثر من مؤلفين (3 مؤلفين فأكثر) - سيتم توليد "وآخرون" تلقائياً</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-xs">
                            <input
                              type="checkbox"
                              checked={formData.hasMultipleWorksBySameAuthor}
                              onChange={(e) => setFormData(p => ({ ...p, hasMultipleWorksBySameAuthor: e.target.checked }))}
                              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                            />
                            <span>يوجد أكثر من مرجع واحد للمؤلف نفسه (تخصيص عنوان مختصر)</span>
                          </label>

                          {formData.hasMultipleWorksBySameAuthor && (
                            <div className="space-y-1 max-w-sm pt-1">
                              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">العنوان المختصر للكتاب:</label>
                              <input
                                type="text"
                                placeholder="مثال: صعوبات المقاولة"
                                value={formData.shortTitle}
                                onChange={(e) => setFormData(p => ({ ...p, shortTitle: e.target.value }))}
                                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* Thesis Specific */}
                  {citationType === 'thesis' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">اسم الباحث:</label>
                        <input
                          type="text"
                          placeholder="مثال: إدريس مساعيد"
                          value={formData.author}
                          onChange={(e) => setFormData(p => ({ ...p, author: e.target.value }))}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                        />
                      </div>

                      {!formData.isRepeated && (
                        <>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">عنوان الرسالة / الأطروحة:</label>
                            <input
                              type="text"
                              placeholder="مثال: مهام مراقب الحسابات في صعوبات المقاولة"
                              value={formData.title}
                              onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">نوع الرسالة / الدرجة العلمية:</label>
                            <input
                              type="text"
                              placeholder="مثال: رسالة لنيل دبلوم الدراسات العليا المعمقة"
                              value={formData.degreeType}
                              onChange={(e) => setFormData(p => ({ ...p, degreeType: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">التخصص:</label>
                            <input
                              type="text"
                              placeholder="مثال: القانون الخاص"
                              value={formData.specialization}
                              onChange={(e) => setFormData(p => ({ ...p, specialization: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">الكلية:</label>
                            <input
                              type="text"
                              placeholder="مثال: كلية العلوم القانونية والاقتصادية والاجتماعية عين الشق"
                              value={formData.faculty}
                              onChange={(e) => setFormData(p => ({ ...p, faculty: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">الجامعة:</label>
                            <input
                              type="text"
                              placeholder="مثال: جامعة الحسن الثاني بالدار البيضاء"
                              value={formData.university}
                              onChange={(e) => setFormData(p => ({ ...p, university: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">السنة الجامعية:</label>
                            <input
                              type="text"
                              placeholder="مثال: 2002-2003"
                              value={formData.academicYear}
                              onChange={(e) => setFormData(p => ({ ...p, academicYear: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {/* Article Specific */}
                  {citationType === 'article' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">اسم كاتب المقال:</label>
                        <input
                          type="text"
                          placeholder="مثال: صالح الذهبي"
                          value={formData.author}
                          onChange={(e) => setFormData(p => ({ ...p, author: e.target.value }))}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                        />
                      </div>

                      {!formData.isRepeated && (
                        <>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">عنوان المقال:</label>
                            <input
                              type="text"
                              placeholder="مثال: دور المصالح في إنقاذ المؤسسات التي تمر بصعوبات اقتصادية"
                              value={formData.title}
                              onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">اسم المجلة:</label>
                            <input
                              type="text"
                              placeholder="مثال: مجلة القضاء المدني"
                              value={formData.journal}
                              onChange={(e) => setFormData(p => ({ ...p, journal: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">رقم العدد:</label>
                            <input
                              type="text"
                              placeholder="مثال: العدد 12"
                              value={formData.issue}
                              onChange={(e) => setFormData(p => ({ ...p, issue: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">فصل / سنة النشر:</label>
                            <input
                              type="text"
                              placeholder="مثال: صيف/خريف 2012"
                              value={formData.seasonOrYear}
                              onChange={(e) => setFormData(p => ({ ...p, seasonOrYear: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {/* Conference Specific */}
                  {citationType === 'conference' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">اسم الباحث / صاحب المداخلة:</label>
                        <input
                          type="text"
                          placeholder="مثال: زكرياء العماري"
                          value={formData.author}
                          onChange={(e) => setFormData(p => ({ ...p, author: e.target.value }))}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                        />
                      </div>

                      {!formData.isRepeated && (
                        <>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">عنوان المداخلة / المساهمة:</label>
                            <input
                              type="text"
                              placeholder="مثال: نهائية الرسم العقاري بين الإطلاق والتقييد"
                              value={formData.title}
                              onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">موضوع الندوة أو المؤتمر:</label>
                            <input
                              type="text"
                              placeholder="مثال: مستجدات نظام التحفيظ العقاري في دول المغرب العربي"
                              value={formData.conferenceSubject}
                              onChange={(e) => setFormData(p => ({ ...p, conferenceSubject: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">الجهة المنظمة:</label>
                            <input
                              type="text"
                              placeholder="مثال: مختبر الدراسات القانونية المدنية والعقارية بجامعة القاضي عياض"
                              value={formData.organizer}
                              onChange={(e) => setFormData(p => ({ ...p, organizer: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">مكان وتاريخ التنظيم:</label>
                            <input
                              type="text"
                              placeholder="مثال: بمقر كلية الحقوق بمراكش يومي 23 و24 مارس 2012"
                              value={formData.eventLocationAndDate}
                              onChange={(e) => setFormData(p => ({ ...p, eventLocationAndDate: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1 col-span-full pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                              <input
                                type="checkbox"
                                checked={formData.isUnpublished}
                                onChange={(e) => setFormData(p => ({ ...p, isUnpublished: e.target.checked }))}
                                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                              />
                              <span>مداخلة غير منشورة</span>
                            </label>
                          </div>

                          {!formData.isUnpublished && (
                            <>
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">الناشر والمطبعة:</label>
                                <input
                                  type="text"
                                  placeholder="مثال: المطبعة الوراقة الوطنية"
                                  value={formData.publisher}
                                  onChange={(e) => setFormData(p => ({ ...p, publisher: e.target.value }))}
                                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">مكان وسنة النشر:</label>
                                <input
                                  type="text"
                                  placeholder="مثال: مراكش 2013"
                                  value={formData.year}
                                  onChange={(e) => setFormData(p => ({ ...p, year: e.target.value }))}
                                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                                />
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* Court Ruling Specific */}
                  {citationType === 'court_ruling' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">المحكمة المصدرة:</label>
                        <input
                          type="text"
                          placeholder="مثال: محكمة النقض"
                          value={formData.courtName}
                          onChange={(e) => setFormData(p => ({ ...p, courtName: e.target.value }))}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">رقم القرار / الحكم:</label>
                        <input
                          type="text"
                          placeholder="مثال: 125"
                          value={formData.rulingNumber}
                          onChange={(e) => setFormData(p => ({ ...p, rulingNumber: e.target.value }))}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                        />
                      </div>

                      {!formData.isRepeated && (
                        <>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">تاريخ الصدور:</label>
                            <input
                              type="text"
                              placeholder="مثال: 12 مارس 2016"
                              value={formData.rulingDate}
                              onChange={(e) => setFormData(p => ({ ...p, rulingDate: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">رقم الملف القضائي:</label>
                            <input
                              type="text"
                              placeholder="مثال: 1325/1/2/2016 (أو اتركه فارغاً إذا كان غير مذكور)"
                              value={formData.caseNumber}
                              onChange={(e) => setFormData(p => ({ ...p, caseNumber: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">حالة نشر القرار:</label>
                            <select
                              value={formData.courtSourceType}
                              onChange={(e) => setFormData(p => ({ ...p, courtSourceType: e.target.value as any }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            >
                              <option value="published">منشور بالكامل في مجلة / منشور</option>
                              <option value="secondary">أورده مرجع آخر</option>
                              <option value="unpublished">غير منشور</option>
                            </select>
                          </div>

                          {formData.courtSourceType !== 'unpublished' && (
                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                                {formData.courtSourceType === 'published' ? 'المجلة والمرجع الناشر:' : 'اسم المؤلف والمرجع الناقل:'}
                              </label>
                              <input
                                type="text"
                                placeholder={formData.courtSourceType === 'published' ? "مثال: مجلة القضاء المدني، العدد 12، شتاء/ربيع 2016" : "مثال: امحمد لفروجي، مرجع سابق"}
                                value={formData.courtSourceDetail}
                                onChange={(e) => setFormData(p => ({ ...p, courtSourceDetail: e.target.value }))}
                                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                              />
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* Legislation Specific */}
                  {citationType === 'legislation' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">نوع النص:</label>
                        <select
                          value={formData.legType}
                          onChange={(e) => setFormData(p => ({ ...p, legType: e.target.value as any }))}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500 font-bold text-indigo-700 dark:text-indigo-300"
                        >
                          <option value="law">قانون / نص تشريعي</option>
                          <option value="decree">مرسوم تنظيمي</option>
                          <option value="ministerial">قرار وزاري</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">رقم القانون / المرسوم / القرار:</label>
                        <input
                          type="text"
                          placeholder={formData.legType === 'law' ? "مثال: 39.08" : formData.legType === 'decree' ? "مثال: 2.14.881" : "مثال: 4140.12"}
                          value={formData.legNumber}
                          onChange={(e) => setFormData(p => ({ ...p, legNumber: e.target.value }))}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">موضوع النص:</label>
                        <input
                          type="text"
                          placeholder={formData.legType === 'law' ? "مثال: المتعلق بمدونة الحقوق العينية" : "مثال: بتطبيق المادة 174 من القانون رقم 39.08"}
                          value={formData.legSubject}
                          onChange={(e) => setFormData(p => ({ ...p, legSubject: e.target.value }))}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                        />
                      </div>

                      {!formData.isRepeated && (
                        <>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                              {formData.legType === 'law' ? 'الظهير الشريف الصادر بتنفيذه:' : 'القطاع الوزاري المصدر / جهة الإصدار:'}
                            </label>
                            <input
                              type="text"
                              placeholder={formData.legType === 'law' ? "مثال: 1.11.178 المؤرخ في 25 من ذي الحجة 1432 (11 نوفمبر 2011)" : "مثال: قرار وزير الأوقاف والشؤون الإسلامية"}
                              value={formData.legEnactingDecree}
                              onChange={(e) => setFormData(p => ({ ...p, legEnactingDecree: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">رقم الجريدة الرسمية:</label>
                            <input
                              type="text"
                              placeholder="مثال: 5998"
                              value={formData.officialGazetteNumber}
                              onChange={(e) => setFormData(p => ({ ...p, officialGazetteNumber: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">تاريخ الجريدة الرسمية:</label>
                            <input
                              type="text"
                              placeholder="مثال: 24 نوفمبر 2011"
                              value={formData.officialGazetteDate}
                              onChange={(e) => setFormData(p => ({ ...p, officialGazetteDate: e.target.value }))}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {/* Secondary Source Specific (نقلاً عن) */}
                  {citationType === 'secondary' && (
                    <>
                      <div className="col-span-full border-b border-slate-200 dark:border-slate-800 pb-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                        1. بيانات المرجع الأصلي (المرجع المنقول عنه):
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">اسم المؤلف الأصلي:</label>
                        <input
                          type="text"
                          placeholder="مثال: نبيل اسماعيل عمر"
                          value={formData.originalAuthor}
                          onChange={(e) => setFormData(p => ({ ...p, originalAuthor: e.target.value }))}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">عنوان المرجع الأصلي:</label>
                        <input
                          type="text"
                          placeholder="مثال: صعوبات التنفيذ"
                          value={formData.originalTitle}
                          onChange={(e) => setFormData(p => ({ ...p, originalTitle: e.target.value }))}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">بيانات النشر الأصلية (الدار، المكان، السنة):</label>
                        <input
                          type="text"
                          placeholder="مثال: منشأة المعارف، الإسكندرية، 2016"
                          value={formData.originalPublisherDetails}
                          onChange={(e) => setFormData(p => ({ ...p, originalPublisherDetails: e.target.value }))}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">الصفحة في المرجع الأصلي:</label>
                        <input
                          type="text"
                          placeholder="مثال: 110"
                          value={formData.originalPage}
                          onChange={(e) => setFormData(p => ({ ...p, originalPage: e.target.value }))}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="col-span-full border-b border-slate-200 dark:border-slate-800 pb-1 text-xs font-bold text-indigo-700 dark:text-indigo-400 pt-2">
                        2. بيانات المرجع الوسيط (الذي نقلت منه الفكرة):
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">اسم المؤلف الوسيط:</label>
                        <input
                          type="text"
                          placeholder="مثال: أحمد شكري السباعي"
                          value={formData.author}
                          onChange={(e) => setFormData(p => ({ ...p, author: e.target.value }))}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Page Number (Always Present) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">رقم الصفحة (ص):</label>
                <input
                  type="text"
                  placeholder="مثال: 145 (أو 12 و13، أو 12 وما بعدها)"
                  value={formData.page}
                  onChange={(e) => setFormData(p => ({ ...p, page: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-indigo-500 font-bold"
                />
              </div>
            </div>

            {/* Generated Results Inline */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    <span>1. صيغة التوثيق في الهامش (Footnote):</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(formattedCitations.footnote, 'footnote')}
                    className="flex items-center gap-1 text-[11px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 px-2.5 py-1 rounded-md font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all cursor-pointer border border-indigo-200/60 dark:border-indigo-800"
                  >
                    {copiedFootnote ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFootnote ? 'تم النسخ!' : 'نسخ الهامش'}</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl font-serif text-sm text-slate-900 dark:text-slate-100 select-all leading-relaxed shadow-2xs">
                  {formattedCitations.footnote}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    <span>2. صيغة التوثيق في لائحة المراجع (Bibliography):</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(formattedCitations.biblio, 'biblio')}
                    className="flex items-center gap-1 text-[11px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 px-2.5 py-1 rounded-md font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all cursor-pointer border border-indigo-200/60 dark:border-indigo-800"
                  >
                    {copiedBibliography ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBibliography ? 'تم النسخ!' : 'نسخ المرجع'}</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl font-serif text-sm text-slate-900 dark:text-slate-100 select-all leading-relaxed shadow-2xs">
                  {formattedCitations.biblio}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
