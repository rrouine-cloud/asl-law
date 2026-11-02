import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Gavel, 
  FileText, 
  Loader2, 
  Scale, 
  ArrowRight,
  ExternalLink,
  Info,
  ChevronLeft,
  BookOpen,
  Hash,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Brain,
  History,
  TrendingUp,
  Zap,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { CaseLaw, CHAMBER_DECISIONS, PublishedDecision } from '../data/caseLawData';

export default function CaseLawSearch() {
  const [keyword, setKeyword] = useState(() => localStorage.getItem('caselaw_keyword') || "");
  const [year, setYear] = useState(() => localStorage.getItem('caselaw_year') || "");
  const [specialization, setSpecialization] = useState<string>(() => {
    const saved = localStorage.getItem('caselaw_specialization');
    const validSpecs = ["الكل", "الغرف المدنية", "الأحوال الشخصية والميراث", "الاجتماعية", "التجارية", "الجنائية", "العقارية", "الإدارية"];
    return saved && validSpecs.includes(saved) ? saved : "الكل";
  });
  const [results, setResults] = useState<CaseLaw[]>(() => {
    const saved = localStorage.getItem('caselaw_results');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [activeMainTab, setActiveMainTab] = useState<'search' | 'chambers'>('search');
  const [activeChamber, setActiveChamber] = useState<string>("الغرف المدنية");
  const [expandedDecisionId, setExpandedDecisionId] = useState<string | null>(null);
  const [copiedDecisionIndex, setCopiedDecisionIndex] = useState<number | null>(null);
  const [chamberSearchQuery, setChamberSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem('caselaw_keyword', keyword);
    localStorage.setItem('caselaw_year', year);
    localStorage.setItem('caselaw_specialization', specialization);
    localStorage.setItem('caselaw_results', JSON.stringify(results));
  }, [keyword, year, specialization, results]);

  const specializations = [
    "الكل", 
    "الغرف المدنية", 
    "الأحوال الشخصية والميراث", 
    "الاجتماعية", 
    "التجارية", 
    "الجنائية", 
    "العقارية", 
    "الإدارية"
  ];

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sortCaseLawByDate = (data: CaseLaw[], selectedYear?: string) => {
    return [...data].sort((a, b) => {
      // Prioritize decisions from the selected year first
      if (selectedYear) {
        const aMatchesYear = a.date && a.date.includes(selectedYear);
        const bMatchesYear = b.date && b.date.includes(selectedYear);
        if (aMatchesYear && !bMatchesYear) return -1;
        if (!aMatchesYear && bMatchesYear) return 1;
      }

      if (!a.date) return 1;
      if (!b.date) return -1;
      
      const parseDate = (dateStr: string) => {
        if (dateStr.includes('-')) {
          return new Date(dateStr).getTime();
        }
        if (dateStr.includes('/')) {
          const parts = dateStr.split('/').map(Number);
          if (parts[0] > 1000) {
            // yyyy/mm/dd
            const [yr, mo, dy] = parts;
            return new Date(yr, mo - 1, dy).getTime();
          } else {
            // dd/mm/yyyy
            const [dy, mo, yr] = parts;
            return new Date(yr, mo - 1, dy).getTime();
          }
        }
        return 0;
      };

      return parseDate(b.date) - parseDate(a.date);
    });
  };

  const getChambersForSpecialization = (spec: string): string[] => {
    if (spec === "الكل") return Object.keys(CHAMBER_DECISIONS);
    return [spec];
  };

  const handleSearch = async () => {
    const trimmedKeyword = keyword.trim();
    const trimmedYear = year.trim();
    
    if (!trimmedKeyword && !trimmedYear) return;
    
    setIsLoading(true);
    setError(null);
    setResults([]);

    const targetChambers = getChambersForSpecialization(specialization);
    const chamberResults: CaseLaw[] = [];

    targetChambers.forEach(chamber => {
      const decisions = CHAMBER_DECISIONS[chamber] || [];
      decisions.forEach(decision => {
        let matchesKeyword = false;
        if (trimmedKeyword) {
          const query = trimmedKeyword.toLowerCase();
          matchesKeyword = 
            decision.subject.toLowerCase().includes(query) ||
            decision.content.toLowerCase().includes(query) ||
            decision.number.toLowerCase().includes(query) ||
            (decision.fileNumber && decision.fileNumber.toLowerCase().includes(query));
        }

        let matchesYear = false;
        if (trimmedYear) {
          matchesYear = decision.date.includes(trimmedYear);
        }

        // Include decisions from the specified year in addition to keyword search results
        const shouldAdd = (trimmedKeyword && trimmedYear)
          ? (matchesKeyword || matchesYear)
          : (trimmedKeyword ? matchesKeyword : (trimmedYear ? matchesYear : false));

        if (shouldAdd) {
          chamberResults.push({
            number: decision.number,
            summary: `${decision.subject}\n\n${decision.content}`,
            date: decision.date,
            court: chamber,
            source: decision.fileNumber ? `ملف رقم: ${decision.fileNumber}` : "محكمة النقض"
          });
        }
      });
    });

    setResults(sortCaseLawByDate(chamberResults, trimmedYear || undefined));
    if (chamberResults.length === 0) {
      setError("لم يتم العثور على أي قرار يطابق بحثك في أرشيف الغرف القضائية.");
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-10 pb-20" dir="rtl">
      <div className="pt-2"></div>

      {/* Main Tab Switcher */}
      <div className="flex justify-center my-4 md:my-8 px-4">
        <div className="inline-flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl md:rounded-full border border-slate-200 dark:border-slate-700 shadow-inner max-w-full">
          <button
            onClick={() => setActiveMainTab("search")}
            className={cn(
              "px-5 sm:px-8 py-3 rounded-xl md:rounded-full text-xs sm:text-base font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer",
              activeMainTab === 'search' 
                ? "bg-[#0f2d59] text-white shadow-md" 
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>محرك البحث القضائي</span>
          </button>
          <button
            onClick={() => setActiveMainTab("chambers")}
            className={cn(
              "px-5 sm:px-8 py-3 rounded-xl md:rounded-full text-xs sm:text-base font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer",
              activeMainTab === 'chambers' 
                ? "bg-[#0f2d59] text-white shadow-md" 
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>تصفح القرارات حسب الغرف</span>
          </button>
        </div>
      </div>

      {activeMainTab === 'search' ? (
        <>
          <div className="max-w-4xl mx-auto py-4 relative">
        {/* Search Input */}
        <div className="relative space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mr-2 flex items-center gap-2">
                  <Scale className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  التخصص المطلوب
                </label>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec) => (
                    <button
                      key={spec}
                      onClick={() => setSpecialization(spec)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                        specialization === spec
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      )}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    الكلمة الافتتاحية أو الموضوع
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="مثال: الحيازة، التعويض عن الضرر..."
                      className="w-full h-12 pr-10 pl-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all text-right font-bold text-xs md:text-sm text-slate-800 dark:text-slate-100 outline-none"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-600 dark:text-amber-400 pointer-events-none">
                      <Search className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      سنة القرار
                    </label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="مثال: 2025"
                      className="w-full h-12 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all text-right font-bold text-xs md:text-sm text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={isLoading || (!keyword.trim() && !year.trim())}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 cursor-pointer",
                  (keyword.trim() || year.trim()) && !isLoading
                    ? "bg-[#0f2d59] text-white hover:bg-[#0a1f3f] shadow-sm"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                )}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>بحث في الاجتهادات القضائية</span>
              </button>

              <div className="flex flex-col items-center justify-center gap-3 text-[10px] text-[var(--muted)]">
                <div className="flex items-center gap-2">
                  <Info className="w-3 h-3" />
                  <span>يتم البحث في أرشيف قرارات الغرف القضائية المدونة محلياً</span>
                </div>
                <div className="flex gap-4">
                  <a 
                    href="https://juriscassation.cspj.ma/Decisions/RechercheDecisions" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:underline flex items-center gap-1 font-bold"
                  >
                    <ExternalLink className="w-3 h-3" />
                    البوابة الرسمية لمحكمة النقض
                  </a>
                </div>
              </div>
            </div>
          </div>

      {/* Results Area */}
      <div className="max-w-5xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 space-y-6"
            >
              <div className="relative">
                <div className="w-20 h-20 border-4 border-amber-100 rounded-full animate-pulse" />
                <Loader2 className="w-10 h-10 text-amber-600 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-slate-500 font-medium animate-pulse">جاري البحث في الأرشيف القضائي...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-[var(--foreground)] font-medium">{error}</p>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="divide-y divide-slate-100"
            >
              <div className="flex items-center justify-between mb-2 pb-3">
                <h3 className="text-lg font-bold text-[var(--foreground)]">نتائج البحث ({results.length})</h3>
                <p className="text-xs text-[var(--muted)]">تم العثور على القرارات التالية</p>
              </div>
              
              {results.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group py-6 relative"
                >
                  {/* Similarity Reason for NLP */}
                  {(item as any).similarity_reason && (
                    <div className="mb-4 p-3 bg-indigo-50/80 rounded-xl text-xs font-bold text-indigo-700 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span>لماذا مشابه: {(item as any).similarity_reason}</span>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-4 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                          قرار رقم: {item.number}
                        </span>
                        {item.date && (
                          <span className="px-3 py-1 text-amber-800 bg-amber-50 rounded-full text-[10px] font-black flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            بتاريخ: {item.date}
                          </span>
                        )}
                        {item.court && (
                          <span className="px-3 py-1 text-indigo-800 bg-indigo-50 rounded-full text-[10px] font-black">
                            {item.court}
                          </span>
                        )}
                      </div>
                      
                      <div className="prose prose-slate max-w-none">
                        <p className={cn(
                          "text-slate-900 leading-relaxed font-serif text-lg whitespace-pre-wrap",
                          expandedId === item.number ? "" : "line-clamp-3"
                        )}>
                          {item.summary}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col gap-2">
                      <button 
                        onClick={() => copyToClipboard(`${item.number}: ${item.summary}\nالمصدر: ${item.source}`, idx)}
                        className={cn(
                          "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                          copiedId === idx ? "bg-green-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-amber-500 hover:text-white"
                        )}
                        title="نسخ القرار"
                      >
                        {copiedId === idx ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button 
                         onClick={() => setExpandedId(expandedId === item.number ? null : item.number)}
                         className="shrink-0 w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all duration-300"
                      >
                        <ChevronLeft className={cn("w-5 h-5 transition-transform", expandedId === item.number ? "-rotate-90" : "")} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
        </>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8 px-4" dir="rtl">
          {/* Chamber Selection Grid */}
          <div className="py-4">
            <h3 className="text-sm font-black text-slate-400 mb-5 mr-1 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500" />
              اختر الغرفة القضائية لتصفح قراراتها الحرفية:
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {Object.keys(CHAMBER_DECISIONS).map((chamber) => {
                const count = CHAMBER_DECISIONS[chamber]?.length || 0;
                return (
                  <button
                    key={chamber}
                    onClick={() => {
                      setActiveChamber(chamber);
                      setExpandedDecisionId(null);
                      setChamberSearchQuery("");
                    }}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2",
                      activeChamber === chamber
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    )}
                  >
                    <span>{chamber}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-black",
                      activeChamber === chamber 
                        ? "bg-amber-400 text-slate-950" 
                        : "bg-slate-200 text-slate-700"
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Decisions List */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight font-serif whitespace-nowrap">
                  قرارات {activeChamber} ({CHAMBER_DECISIONS[activeChamber]?.length || 0})
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-1">
                  حيث ستظهر فقط العناوين والرموز والمقتضيات بشكل مبسط وتفحص حرفياً عند النقر.
                </p>
              </div>

              {/* Fast Search Input */}
              <div className="relative w-full sm:w-80 shrink-0">
                <input
                  type="text"
                  value={chamberSearchQuery}
                  onChange={(e) => setChamberSearchQuery(e.target.value)}
                  placeholder="البحث السريع في قرارات هذه الغرفة..."
                  className="w-full p-3 pr-10 pl-16 bg-slate-100 border border-slate-200 rounded-2xl focus:border-amber-500 focus:bg-white transition-all text-right font-bold text-slate-800 text-xs shadow-inner"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search className="w-4 h-4 text-amber-500" />
                </div>
                {chamberSearchQuery && (
                  <button 
                    onClick={() => setChamberSearchQuery("")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-amber-600 hover:underline font-extrabold"
                  >
                    إلغاء البحث
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-5">
              {(() => {
                const filtered = (CHAMBER_DECISIONS[activeChamber] || []).filter(decision => {
                  if (!chamberSearchQuery.trim()) return true;
                  const query = chamberSearchQuery.toLowerCase();
                  return (
                    decision.subject.toLowerCase().includes(query) ||
                    decision.content.toLowerCase().includes(query) ||
                    decision.number.toLowerCase().includes(query) ||
                    decision.date.toLowerCase().includes(query) ||
                    (decision.fileNumber && decision.fileNumber.toLowerCase().includes(query))
                  );
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <p className="text-slate-500 text-sm font-black">لم يتم العثور على أي قرار يطابق بحثك "{chamberSearchQuery}" في هذه الغرفة.</p>
                      <button 
                        onClick={() => setChamberSearchQuery("")}
                        className="text-xs font-bold text-amber-600 hover:underline"
                      >
                        عرض كافة القرارات
                      </button>
                    </div>
                  );
                }

                return filtered.map((decision, idx) => {
                  const decisionKey = `${activeChamber}-${decision.number}-${decision.fileNumber || idx}`;
                  const isExpanded = expandedDecisionId === decisionKey;
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "group py-4 border-b border-slate-100 transition-all duration-300"
                      )}
                    >
                      {/* Header Button - Only subject text is visible */}
                      <button
                        onClick={() => setExpandedDecisionId(isExpanded ? null : decisionKey)}
                        className="w-full py-3 text-right flex items-start justify-between gap-4 transition-all"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">موضوع القرار المبدئي:</span>
                            <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
                          </div>
                          <h4 className="text-base md:text-lg font-black text-slate-900 leading-relaxed font-sans group-hover:text-amber-600 transition-colors">
                            {decision.subject}
                          </h4>
                        </div>
                        
                        <div className={cn(
                          "w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300",
                          isExpanded ? "bg-slate-900 text-white" : ""
                        )}>
                          <ChevronLeft className={cn("w-5 h-5 transition-transform duration-300", isExpanded ? "-rotate-90" : "")} />
                        </div>
                      </button>

                      {/* Expandable Literal Text Section */}
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="pt-4"
                        >
                          <div className="space-y-6">
                            {/* Metadata Grid */}
                            <div className="flex flex-wrap gap-3">
                              <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-mono font-bold">
                                القرار: {decision.number}
                              </span>
                              <span className="px-3 py-1 bg-amber-50 text-amber-900 rounded-lg text-xs font-mono font-bold">
                                التاريخ: {decision.date}
                              </span>
                              <span className="px-3 py-1 bg-indigo-50 text-indigo-900 rounded-lg text-xs font-mono font-bold">
                                الملف: {decision.fileNumber || "غير محدد"}
                              </span>
                            </div>

                            {/* Original literal Text */}
                            <div className="py-2">
                              <h5 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2 block border-b border-slate-100 pb-1">تفاصيل الحيثيات والقرار الحرفي ومستند الحكم:</h5>
                              <p className="text-slate-900 leading-[1.85] text-base md:text-lg font-medium whitespace-pre-wrap font-serif text-right selection:bg-amber-100">
                                {decision.content}
                              </p>
                            </div>

                            {/* Utilities */}
                            <div className="flex justify-start">
                              <button
                                onClick={() => {
                                  const textToCopy = `القرار عدد: ${decision.number}\nالصادر بتاريخ: ${decision.date}\n${decision.fileNumber || ""}\nالموضوع: ${decision.subject}\n\nالنص الحرفي:\n${decision.content}`;
                                  navigator.clipboard.writeText(textToCopy);
                                  setCopiedDecisionIndex(idx);
                                  setTimeout(() => setCopiedDecisionIndex(null), 2000);
                                }}
                                className={cn(
                                  "px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all shadow-inner",
                                  copiedDecisionIndex === idx 
                                    ? "bg-green-500 text-white-important text-white" 
                                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                                )}
                              >
                                {copiedDecisionIndex === idx ? (
                                  <>
                                    <Check className="w-4 h-4" />
                                    <span>تم نسخ نص القرار بنجاح!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4 text-slate-400" />
                                    <span>نسخ مقتنيات وحيثيات القرار كاملاً</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
