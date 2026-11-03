import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, 
  Scale, 
  BookOpen, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown,
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  X, 
  AlertCircle, 
  Settings, 
  Info,
  Layers,
  Hash,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  MOROCCAN_LAWS_DATABASE, 
  MoroccanLaw, 
  executeMoroccanLegalQuery, 
  SearchResultType,
  naturalCompare,
  extractArticleNumber,
  normalizeArabic
} from '../lib/moroccanLegalEngine';
import { 
  getLawHierarchy, 
  findChapterForArticle, 
  HierarchyBookGroup, 
  HierarchyChapter 
} from '../lib/lawHierarchy';

export default function LegalTextFinder() {
  const location = useLocation();
  const allLaws = MOROCCAN_LAWS_DATABASE;

  // Selected law state (default to labour_code or saved law)
  const [selectedLawId, setSelectedLawId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('legal_finder_current_law');
      if (saved && MOROCCAN_LAWS_DATABASE.some(l => l.id === saved)) return saved;
    }
    return MOROCCAN_LAWS_DATABASE.find(l => l.id === 'labour_code')?.id || MOROCCAN_LAWS_DATABASE[0]?.id || 'labour_code';
  });

  const currentLaw = useMemo(() => {
    return allLaws.find(l => l.id === selectedLawId) || allLaws[0];
  }, [selectedLawId, allLaws]);

  // Articles list for current law
  const lawArticleKeys = useMemo(() => {
    if (!currentLaw?.data) return [];
    return Object.keys(currentLaw.data).sort(naturalCompare);
  }, [currentLaw]);

  // Law hierarchy (Books -> Sections -> Chapters)
  const lawHierarchy = useMemo(() => {
    return getLawHierarchy(currentLaw);
  }, [currentLaw]);

  // Active Article Key state
  const [selectedArticleKey, setSelectedArticleKey] = useState<string>('');
  
  // Dedicated Article Input State ("خانة إدخال الفصل المطلوب")
  const [articleInput, setArticleInput] = useState<string>('');
  const [searchResultState, setSearchResultState] = useState<SearchResultType | null>(null);

  // Confidence & Verification Metadata
  const [confidenceLevel, setConfidenceLevel] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');

  // Display & Reader Settings
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showFullMetadata, setShowFullMetadata] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(18);

  // Toolbar state
  const [copied, setCopied] = useState<boolean>(false);
  const articleInputRef = useRef<HTMLInputElement>(null);

  // Active Article Metadata
  const activeArticleMeta = useMemo(() => {
    if (!currentLaw?.articlesMeta || !selectedArticleKey) return null;
    return currentLaw.articlesMeta[selectedArticleKey] || null;
  }, [currentLaw, selectedArticleKey]);

  // Active Chapter in hierarchy
  const currentChapter = useMemo(() => {
    return findChapterForArticle(lawHierarchy, selectedArticleKey);
  }, [lawHierarchy, selectedArticleKey]);

  // Breadcrumb structural values (الكتاب > القسم > الباب)
  const breadcrumbBook = activeArticleMeta?.hierarchy?.book || currentChapter?.book || currentLaw.shortName;
  const breadcrumbSection = activeArticleMeta?.hierarchy?.section || currentChapter?.section || null;
  const breadcrumbChapter = activeArticleMeta?.hierarchy?.chapter || currentChapter?.chapter || 'أحكام عامة';

  // Initialize selected article when law changes
  useEffect(() => {
    if (lawArticleKeys.length > 0) {
      if (!selectedArticleKey || !lawArticleKeys.includes(selectedArticleKey)) {
        const firstKey = lawArticleKeys[0];
        setSelectedArticleKey(firstKey);
        setArticleInput(firstKey);
      } else {
        setArticleInput(selectedArticleKey);
      }
    } else {
      setSelectedArticleKey('');
      setArticleInput('');
    }
  }, [currentLaw, lawArticleKeys]);

  // Keep articleInput synced when selectedArticleKey changes
  useEffect(() => {
    if (selectedArticleKey) {
      setArticleInput(selectedArticleKey);
    }
  }, [selectedArticleKey, selectedLawId]);

  // Location state integration
  useEffect(() => {
    if (location.state && (location.state as any).sourceId) {
      const srcId = (location.state as any).sourceId;
      const artNum = (location.state as any).articleNumber;
      if (allLaws.some(l => l.id === srcId)) {
        setSelectedLawId(srcId);
        if (artNum) {
          setSelectedArticleKey(artNum);
          setArticleInput(artNum);
        }
      }
    }
  }, [location.state, allLaws]);

  // Law select handler
  const handleLawSelect = (lawId: string) => {
    setSelectedLawId(lawId);
    localStorage.setItem('legal_finder_current_law', lawId);
    setSearchResultState(null);
    setConfidenceLevel('HIGH');
  };

  // Select article helper
  const handleSelectArticle = (law: MoroccanLaw, key: string, confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH') => {
    if (law.id !== selectedLawId) {
      setSelectedLawId(law.id);
      localStorage.setItem('legal_finder_current_law', law.id);
    }
    setSelectedArticleKey(key);
    setArticleInput(key);
    setConfidenceLevel(confidence);
    setSearchResultState(null);
  };

  // Direct Article Number Input Handler - Automatically and instantly loads result!
  const handleArticleInputChange = (val: string) => {
    setArticleInput(val);
    const cleanNum = extractArticleNumber(val) || val.trim();
    if (!cleanNum) return;

    // 1. Direct match in current law
    if (currentLaw.data[cleanNum]) {
      setSelectedArticleKey(cleanNum);
      setSearchResultState(null);
      return;
    }

    // 2. Normalized match in current law
    const norm = normalizeArabic(cleanNum);
    const match = lawArticleKeys.find(k => normalizeArabic(k) === norm);
    if (match) {
      setSelectedArticleKey(match);
      setSearchResultState(null);
      return;
    }
  };

  // Submit Article Jump (e.g. on Enter or when typing full expression)
  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = extractArticleNumber(articleInput) || articleInput.trim();
    if (!cleanNum) return;

    if (currentLaw.data[cleanNum]) {
      handleSelectArticle(currentLaw, cleanNum, 'HIGH');
      return;
    }

    // Search across laws if not found in current law
    const result = executeMoroccanLegalQuery(cleanNum, allLaws, currentLaw);
    if (result.kind === 'DIRECT_ARTICLE') {
      handleSelectArticle(result.law, result.articleKey, result.confidence);
    } else {
      setSearchResultState(result);
    }
  };

  // Navigation: Previous & Next Article
  const currentIndex = useMemo(() => {
    return lawArticleKeys.indexOf(selectedArticleKey);
  }, [lawArticleKeys, selectedArticleKey]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < lawArticleKeys.length - 1;

  const goToPrev = () => {
    if (hasPrev) {
      const prevKey = lawArticleKeys[currentIndex - 1];
      setSelectedArticleKey(prevKey);
      setArticleInput(prevKey);
      setSearchResultState(null);
    }
  };

  const goToNext = () => {
    if (hasNext) {
      const nextKey = lawArticleKeys[currentIndex + 1];
      setSelectedArticleKey(nextKey);
      setArticleInput(nextKey);
      setSearchResultState(null);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) return;

      if (e.key === 'ArrowLeft') {
        goToNext();
      } else if (e.key === 'ArrowRight') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, lawArticleKeys]);

  // Current Article Text
  const currentArticleText = useMemo(() => {
    if (!currentLaw?.data || !selectedArticleKey) return '';
    return currentLaw.data[selectedArticleKey] || '';
  }, [currentLaw, selectedArticleKey]);

  // Related Sub-Articles
  const relatedSubArticles = useMemo(() => {
    if (!currentLaw?.data || !selectedArticleKey) return [];
    const baseMatch = selectedArticleKey.match(/^(\d+)/);
    if (!baseMatch) return [];
    const baseNum = baseMatch[1];

    return lawArticleKeys
      .filter(k => {
        if (k === selectedArticleKey) return false;
        return (
          k.startsWith(`${baseNum}-`) || 
          k.startsWith(`${baseNum}.`) || 
          k.startsWith(`${baseNum}_`) || 
          k.startsWith(`${baseNum} `) ||
          k.includes(`${baseNum} مكرر`)
        );
      })
      .map(k => ({ key: k, content: currentLaw.data[k] }));
  }, [currentLaw, selectedArticleKey, lawArticleKeys]);

  // Copy article text
  const handleCopy = () => {
    if (!currentArticleText) return;
    const hierarchyText = activeArticleMeta?.hierarchy
      ? [
          activeArticleMeta.hierarchy.book,
          activeArticleMeta.hierarchy.section,
          activeArticleMeta.hierarchy.chapter,
          activeArticleMeta.hierarchy.branch,
        ].filter(Boolean).join(' > ')
      : '';

    const label = activeArticleMeta?.article_label_ar || `${currentLaw.articlePrefix} ${selectedArticleKey}`;
    const pageInfo = activeArticleMeta?.source_page_start ? `الصفحة في النص الرسمي: ص. ${activeArticleMeta.source_page_start}\n` : '';

    const citation = `المادة: ${label}
${hierarchyText ? `التبويب الهيكلي: ${hierarchyText}\n` : ''}${pageInfo}القانون: ${currentLaw.officialName}
المرجع: ${currentLaw.reference}
الجريدة الرسمية: ${currentLaw.officialGazette}
المصدر: ${currentLaw.source}
الحالة: ${currentLaw.status}

النص القانوني:
"${currentArticleText}"
`;
    navigator.clipboard.writeText(citation).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Download article text
  const handleDownload = () => {
    if (!currentArticleText) return;
    const hierarchyText = activeArticleMeta?.hierarchy
      ? [
          activeArticleMeta.hierarchy.book,
          activeArticleMeta.hierarchy.section,
          activeArticleMeta.hierarchy.chapter,
          activeArticleMeta.hierarchy.branch,
        ].filter(Boolean).join(' > ')
      : '';

    const label = activeArticleMeta?.article_label_ar || `${currentLaw.articlePrefix} ${selectedArticleKey}`;
    const pageInfo = activeArticleMeta?.source_page_start ? `الصفحة في النص الرسمي: ص. ${activeArticleMeta.source_page_start}\n` : '';

    const content = `المملكة المغربية
المنظومة التشريعية الرسمية

المادة: ${label}
${hierarchyText ? `التبويب الهيكلي: ${hierarchyText}\n` : ''}${pageInfo}القانون: ${currentLaw.officialName}
المرجع: ${currentLaw.reference}
الجريدة الرسمية: ${currentLaw.officialGazette}
المصدر: ${currentLaw.source}
الحالة: ${currentLaw.status}

النص القانوني:
------------------------------------------
${currentArticleText}
------------------------------------------
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentLaw.shortName}_${currentLaw.articlePrefix}_${selectedArticleKey}.txt`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  // Legal Content Formatter
  const renderFormattedArticleContent = (content: string) => {
    if (!content) return <p className="text-slate-400 italic">لا يتوفر نص لهذه المادة في قاعدة البيانات المتاحة.</p>;

    const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    return (
      <div className="space-y-4 text-justify font-serif text-slate-800" style={{ fontSize: `${fontSize}px`, lineHeight: 2.2 }}>
        {lines.map((line, idx) => {
          const isSectionHeader = /^(الباب|القسم|الفرع|الكتاب|الجزء|المبحث|المطلب)\s+/i.test(line) ||
                                  (line.startsWith('**') && line.endsWith('**')) ||
                                  line.startsWith('###') || line.startsWith('##');
          
          if (isSectionHeader) {
            const cleanTitle = line.replace(/^[#*]+\s*/, '').replace(/[*]+$/, '');
            return (
              <div 
                key={idx} 
                className="font-sans font-extrabold text-base md:text-lg text-[#0f2d59] pt-4 pb-2 border-r-4 border-[#0f766e] pr-3 bg-slate-50/80 rounded-l-lg mb-3"
              >
                {cleanTitle}
              </div>
            );
          }

          const numberedMatch = line.match(/^(\d+)(?:[-.)\s]+)(.*)$/);
          if (numberedMatch) {
            return (
              <div key={idx} className="flex items-start gap-3 my-2.5">
                <span className="font-sans font-bold text-[#0f2d59] shrink-0 bg-[#0f2d59]/5 px-2.5 py-0.5 rounded text-sm mt-1 border border-[#0f2d59]/15">
                  {numberedMatch[1]}
                </span>
                <p className="text-slate-800 flex-1 leading-loose">
                  {numberedMatch[2]}
                </p>
              </div>
            );
          }

          if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
            const cleanBullet = line.replace(/^[•\-*]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-3 pr-2 my-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0f766e] mt-3 shrink-0"></span>
                <p className="text-slate-800 flex-1 leading-loose">
                  {cleanBullet}
                </p>
              </div>
            );
          }

          return (
            <p key={idx} className="text-slate-800 leading-loose">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-4 px-3 sm:px-6 lg:px-8 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-4">

        {/* 1. Header: Law Picker & Direct Instant Article Lookup */}
        <header className="glass-panel rounded-2xl border border-white/80 dark:border-slate-800/80 shadow-xs p-4 sm:p-5 no-print space-y-3.5">
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Law Selector Dropdown */}
            <div className="relative md:w-72 shrink-0">
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                اختر القانون أو المدونة:
              </label>
              <div className="relative">
                <select
                  value={selectedLawId}
                  onChange={(e) => handleLawSelect(e.target.value)}
                  className="w-full h-11 pr-3.5 pl-9 bg-white/90 hover:bg-white border border-slate-200/90 rounded-xl font-bold text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all cursor-pointer appearance-none truncate shadow-2xs"
                  title="القانون المختار"
                >
                  {allLaws.map(law => (
                    <option key={law.id} value={law.id}>
                      {law.shortName} ({Object.keys(law.data).length} {law.articlePrefix})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Direct Article Number Input Form (خانة إدخال الفصل المطلوب وتعطي النتيجة مباشرة وتلقائياً) */}
          <form onSubmit={handleArticleSubmit} className="pt-1">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              
              {/* Prominent Direct Article Input Box */}
              <div className="w-full relative flex items-center bg-white/95 border-2 border-blue-600/30 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10 rounded-2xl h-13 px-4 shadow-xs transition-all">
                <div className="flex items-center gap-2 text-blue-700 font-black text-sm shrink-0 pl-3 border-l border-slate-200">
                  <Hash className="w-4 h-4 text-blue-600" />
                  <span>رقم {currentLaw.articlePrefix}:</span>
                </div>

                <input
                  ref={articleInputRef}
                  type="text"
                  value={articleInput}
                  onChange={(e) => handleArticleInputChange(e.target.value)}
                  placeholder={`مثال: 1، 15، 39، 62... (النتيجة تظهر تلقائياً بمجرد الكتابة)`}
                  className="w-full bg-transparent pr-3 font-mono font-bold text-sm sm:text-base text-slate-900 placeholder:text-slate-400 placeholder:font-sans placeholder:font-normal outline-none"
                  title={`أدخل رقم ${currentLaw.articlePrefix}`}
                  autoFocus
                />

                {articleInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setArticleInput('');
                      articleInputRef.current?.focus();
                    }}
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    title="مسح"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </form>

        </header>

        {/* 2. Disambiguation View: When search matches multiple laws */}
        {searchResultState && searchResultState.kind === 'MULTI_LAW_MATCH' && (
          <div className="glass-card rounded-2xl border border-white/80 shadow-sm p-4 space-y-3 text-right animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h2 className="text-sm font-black text-[#0f2d59]">
                  تطابق المادة [{searchResultState.articleKey}] في ({searchResultState.matches.length}) نصوص قانونية
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  اختر القانون المراد عرضه مباشرة:
                </p>
              </div>
              <button
                onClick={() => setSearchResultState(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {searchResultState.matches.map((match) => (
                <div
                  key={match.law.id}
                  onClick={() => handleSelectArticle(match.law, match.articleKey, 'HIGH')}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-600 bg-white/80 hover:bg-white transition-all cursor-pointer group space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0f2d59] group-hover:text-blue-600">
                      {match.law.shortName} • {match.law.articlePrefix} {match.articleKey}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {match.law.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-serif leading-relaxed line-clamp-2">
                    {match.snippet}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Not Found Notice */}
        {searchResultState && searchResultState.kind === 'NOT_FOUND' && (
          <div className="bg-amber-50 rounded-2xl border border-amber-200/80 p-3.5 text-right flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <p className="font-bold text-xs text-amber-900">
                {searchResultState.message}
              </p>
            </div>
            <button
              onClick={() => setSearchResultState(null)}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 px-2 py-1 cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* 5. Main Document Reading View (المطلوب: عرض المواد بدقة وسرعة فورية) */}
        <main className="glass-card rounded-2xl border border-white/80 dark:border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.03)] overflow-hidden text-right">
          
          {/* Header Bar with Law Info & Quick Action Buttons */}
          <div className="bg-gradient-to-b from-white/90 to-white/70 px-5 sm:px-7 py-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Scale className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-bold text-slate-800">{currentLaw.shortName}</span>
                <span className="text-slate-300">·</span>
                <span className="text-[11px] text-emerald-700 font-bold">{currentLaw.status}</span>
                <span className="text-slate-300">·</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {currentIndex + 1} من {lawArticleKeys.length}
                </span>
              </div>
              
              <div className="flex items-baseline gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#0f2d59] tracking-tight">
                  {activeArticleMeta?.article_label_ar || `${currentLaw.articlePrefix} ${selectedArticleKey || '1'}`}
                </h1>
                {activeArticleMeta?.source_page_start && (
                  <span className="text-[11px] text-slate-500 font-mono font-medium">
                    (ص. {activeArticleMeta.source_page_start})
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions Toolbar */}
            <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center no-print">
              
              {/* Copy Citation */}
              <button
                onClick={handleCopy}
                className={cn(
                  "h-9 px-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs",
                  copied
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                    : "bg-white border-slate-200 text-slate-700 hover:text-blue-700 hover:border-slate-300 hover:bg-slate-50"
                )}
                title="نسخ نص المادة بالمرجع الكامل"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
              </button>

              {/* Download */}
              <button
                onClick={handleDownload}
                className="h-9 w-9 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-blue-700 rounded-xl transition-all cursor-pointer shadow-2xs flex items-center justify-center"
                title="تحميل النص الرسمي"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Print */}
              <button
                onClick={handlePrint}
                className="h-9 w-9 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-blue-700 rounded-xl transition-all cursor-pointer shadow-2xs hidden sm:flex items-center justify-center"
                title="طباعة"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Font Size Adjuster */}
              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
                <button
                  onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
                  title="تصغير الخط"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="px-1 text-xs font-mono font-bold text-slate-600 select-none">
                  {fontSize}
                </span>
                <button
                  onClick={() => setFontSize(prev => Math.min(26, prev + 2))}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
                  title="تكبير الخط"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Breadcrumbs Bar (الكتاب > القسم > الباب) */}
          <div className="bg-slate-50/80 border-b border-slate-200/80 px-5 sm:px-7 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-slate-600 font-medium">
              <span className="text-blue-700 font-bold shrink-0">المسار الهيكلي:</span>
              <span className="text-slate-800 font-semibold">
                {breadcrumbBook}
              </span>

              {breadcrumbSection && (
                <>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-700">
                    {breadcrumbSection}
                  </span>
                </>
              )}

              <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-blue-700 font-bold">
                {breadcrumbChapter}
              </span>
            </div>
          </div>

          {/* Legal Text Reading Space */}
          <div className="p-6 sm:p-9 md:p-11 min-h-[360px] bg-white selection:bg-blue-600/15">
            
            {/* Article Content Render */}
            <article className="max-w-4xl mx-auto">
              {renderFormattedArticleContent(currentArticleText)}
            </article>

            {/* Related Sub-Articles / Followers */}
            {relatedSubArticles.length > 0 && (
              <section className="mt-10 pt-6 border-t border-slate-200 max-w-4xl mx-auto space-y-4">
                <div className="flex items-center gap-2 text-[#0f2d59] font-black text-sm">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <h3>المواد والمتممات التابعة ({relatedSubArticles.length}):</h3>
                </div>

                <div className="space-y-3">
                  {relatedSubArticles.map(sub => (
                    <div 
                      key={sub.key} 
                      className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-[#0f2d59]">
                          {currentLaw.articlePrefix} {sub.key}
                        </h4>
                        <button
                          onClick={() => handleSelectArticle(currentLaw, sub.key, 'HIGH')}
                          className="text-[11px] font-bold text-blue-600 hover:text-[#0f2d59] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          عرض كمادة رئيسية <ChevronLeft className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-slate-800 font-serif leading-relaxed text-xs sm:text-sm">
                        {renderFormattedArticleContent(sub.content)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Bottom Stepper Bar */}
            <div className="mt-10 pt-5 border-t border-slate-100 flex items-center justify-between max-w-4xl mx-auto no-print">
              <button
                disabled={!hasPrev}
                onClick={goToPrev}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer border shadow-2xs",
                  hasPrev
                    ? "bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50"
                )}
              >
                <ChevronRight className="w-4 h-4" />
                <span>{currentLaw.articlePrefix} السابق</span>
              </button>

              <span className="text-xs font-mono font-bold text-slate-500">
                {currentIndex + 1} / {lawArticleKeys.length}
              </span>

              <button
                disabled={!hasNext}
                onClick={goToNext}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer border shadow-2xs",
                  hasNext
                    ? "bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50"
                )}
              >
                <span>{currentLaw.articlePrefix} التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}
