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
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  CornerDownLeft, 
  Settings, 
  Info,
  Layers
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
import { generateContent } from '../lib/gemini';

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
  
  // Jump to article input state
  const [quickJumpNumber, setQuickJumpNumber] = useState<string>('');

  // Search query & interaction state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [searchResultState, setSearchResultState] = useState<SearchResultType | null>(null);

  // Confidence & Verification Metadata
  const [confidenceLevel, setConfidenceLevel] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');

  // Display & Reader Settings
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showFullMetadata, setShowFullMetadata] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(18);

  // Chapters & Structure Side Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerSearchQuery, setDrawerSearchQuery] = useState<string>('');
  const [expandedChapterIds, setExpandedChapterIds] = useState<Set<string>>(new Set());

  // Simplified Explanation State ("شرح مبسط")
  const [simplifiedExplanation, setSimplifiedExplanation] = useState<string | null>(null);
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState<boolean>(false);
  const [explanationError, setExplanationError] = useState<string | null>(null);

  // Toolbar state
  const [copied, setCopied] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  // Initialize or update selected article when law changes
  useEffect(() => {
    if (lawArticleKeys.length > 0) {
      if (!selectedArticleKey || !lawArticleKeys.includes(selectedArticleKey)) {
        setSelectedArticleKey(lawArticleKeys[0]);
        setQuickJumpNumber(lawArticleKeys[0]);
      } else {
        setQuickJumpNumber(selectedArticleKey);
      }
    } else {
      setSelectedArticleKey('');
      setQuickJumpNumber('');
    }
    setSimplifiedExplanation(null);
    setExplanationError(null);
  }, [currentLaw, lawArticleKeys]);

  // Keep quickJumpNumber synced when selectedArticleKey changes
  useEffect(() => {
    if (selectedArticleKey) {
      setQuickJumpNumber(selectedArticleKey);
    }
    setSimplifiedExplanation(null);
    setExplanationError(null);
  }, [selectedArticleKey, selectedLawId]);

  // Auto-expand current chapter when drawer opens
  useEffect(() => {
    if (isDrawerOpen && currentChapter?.id) {
      setExpandedChapterIds(prev => new Set([...prev, currentChapter.id]));
    }
  }, [isDrawerOpen, currentChapter]);

  // Escape key listener for side drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  // Law select handler
  const handleLawSelect = (lawId: string) => {
    setSelectedLawId(lawId);
    localStorage.setItem('legal_finder_current_law', lawId);
    setSearchQuery('');
    setSearchResultState(null);
    setConfidenceLevel('HIGH');
    setIsDrawerOpen(false);
  };

  // Select article helper
  const handleSelectArticle = (law: MoroccanLaw, key: string, confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH') => {
    if (law.id !== selectedLawId) {
      setSelectedLawId(law.id);
      localStorage.setItem('legal_finder_current_law', law.id);
    }
    setSelectedArticleKey(key);
    setQuickJumpNumber(key);
    setConfidenceLevel(confidence);
    setSearchResultState(null);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  // Open drawer and optionally focus on a specific chapter
  const openDrawerWithChapter = (chapterId?: string) => {
    if (chapterId) {
      setExpandedChapterIds(prev => new Set([...prev, chapterId]));
    } else if (currentChapter?.id) {
      setExpandedChapterIds(prev => new Set([...prev, currentChapter.id]));
    }
    setIsDrawerOpen(true);
  };

  // Toggle chapter expansion in drawer
  const toggleChapterExpansion = (chapterId: string) => {
    setExpandedChapterIds(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  // Smart Query Execution
  const handleExecuteSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearchFocused(false);
    const result = executeMoroccanLegalQuery(query, allLaws, currentLaw);

    if (result.kind === 'DIRECT_ARTICLE') {
      handleSelectArticle(result.law, result.articleKey, result.confidence);
      setSearchResultState(null);
    } else {
      setSearchResultState(result);
    }
  };

  // Handle direct quick jump by article number
  const handleQuickJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = quickJumpNumber.trim();
    if (!num) return;

    if (currentLaw.data[num]) {
      handleSelectArticle(currentLaw, num, 'HIGH');
      return;
    }

    const normalizedTarget = normalizeArabic(num);
    const match = lawArticleKeys.find(k => normalizeArabic(k) === normalizedTarget);
    if (match) {
      handleSelectArticle(currentLaw, match, 'HIGH');
      return;
    }

    const result = executeMoroccanLegalQuery(num, allLaws, currentLaw);
    if (result.kind === 'DIRECT_ARTICLE') {
      handleSelectArticle(result.law, result.articleKey, result.confidence);
    } else {
      setSearchResultState(result);
    }
  };

  // Search input auto-suggestions
  const searchSuggestions = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return [];

    const queryNorm = normalizeArabic(query);
    const cleanNum = extractArticleNumber(query);
    const cleanNumNorm = normalizeArabic(cleanNum);

    const inCurrentLaw = lawArticleKeys
      .filter(k => {
        const kNorm = normalizeArabic(k);
        if (kNorm === cleanNumNorm || kNorm.startsWith(cleanNumNorm)) return true;
        const meta = currentLaw.articlesMeta?.[k];
        if (meta?.article_label_ar && normalizeArabic(meta.article_label_ar).includes(queryNorm)) return true;
        return false;
      })
      .slice(0, 5)
      .map(k => {
        const meta = currentLaw.articlesMeta?.[k];
        return {
          law: currentLaw,
          key: k,
          label: meta?.article_label_ar || `${currentLaw.articlePrefix} ${k}`,
          snippet: currentLaw.data[k]?.slice(0, 80).replace(/\n/g, ' ') || ''
        };
      });

    let acrossOtherLaws: { law: MoroccanLaw; key: string; label?: string; snippet: string }[] = [];
    if (cleanNum && inCurrentLaw.length < 3) {
      for (const law of allLaws) {
        if (law.id === currentLaw.id) continue;
        if (law.data[cleanNum]) {
          const meta = law.articlesMeta?.[cleanNum];
          acrossOtherLaws.push({
            law,
            key: cleanNum,
            label: meta?.article_label_ar || `${law.articlePrefix} ${cleanNum}`,
            snippet: law.data[cleanNum].slice(0, 80).replace(/\n/g, ' ')
          });
        }
      }
    }

    return [...inCurrentLaw, ...acrossOtherLaws].slice(0, 6);
  }, [searchQuery, currentLaw, lawArticleKeys, allLaws]);

  // Click outside listener for suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Location state integration
  useEffect(() => {
    if (location.state && (location.state as any).sourceId) {
      const srcId = (location.state as any).sourceId;
      const artNum = (location.state as any).articleNumber;
      if (allLaws.some(l => l.id === srcId)) {
        setSelectedLawId(srcId);
        if (artNum) setSelectedArticleKey(artNum);
      }
    }
  }, [location.state, allLaws]);

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
      setQuickJumpNumber(prevKey);
      setSearchResultState(null);
    }
  };

  const goToNext = () => {
    if (hasNext) {
      const nextKey = lawArticleKeys[currentIndex + 1];
      setSelectedArticleKey(nextKey);
      setQuickJumpNumber(nextKey);
      setSearchResultState(null);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) return;
      if (isDrawerOpen) return;

      if (e.key === 'ArrowLeft') {
        goToNext();
      } else if (e.key === 'ArrowRight') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, lawArticleKeys, isDrawerOpen]);

  // Current Article Text
  const currentArticleText = useMemo(() => {
    if (!currentLaw?.data || !selectedArticleKey) return '';
    return currentLaw.data[selectedArticleKey] || '';
  }, [currentLaw, selectedArticleKey]);

  // Related Sub-Articles (e.g., 267-1, 267 مكرر)
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

  // Filtered hierarchy inside drawer based on drawerSearchQuery
  const filteredHierarchy = useMemo(() => {
    const query = normalizeArabic(drawerSearchQuery.trim());
    if (!query) return lawHierarchy;

    return lawHierarchy.map(bookGroup => {
      const matchingChapters = bookGroup.chapters.filter(chap => {
        const chapTitleNorm = normalizeArabic(chap.chapter);
        const secTitleNorm = normalizeArabic(chap.section);
        const bookTitleNorm = normalizeArabic(chap.book);
        if (chapTitleNorm.includes(query) || secTitleNorm.includes(query) || bookTitleNorm.includes(query)) {
          return true;
        }
        return chap.articleKeys.some(k => {
          const kNorm = normalizeArabic(k);
          if (kNorm.includes(query)) return true;
          const text = currentLaw.data[k];
          return text && normalizeArabic(text).includes(query);
        });
      });

      return {
        ...bookGroup,
        chapters: matchingChapters
      };
    }).filter(bg => bg.chapters.length > 0);
  }, [lawHierarchy, drawerSearchQuery, currentLaw]);

  // Copy article text with full formal Moroccan legal citation
  const handleCopy = () => {
    if (!currentArticleText) return;
    const hierarchyText = [
      breadcrumbBook,
      breadcrumbSection,
      breadcrumbChapter,
    ].filter(Boolean).join(' > ');

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
    const hierarchyText = [
      breadcrumbBook,
      breadcrumbSection,
      breadcrumbChapter,
    ].filter(Boolean).join(' > ');

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

  // Generate Simplified Explanation using Gemini API with zero hallucination
  const handleGenerateSimplifiedExplanation = async () => {
    if (!currentArticleText) return;
    setIsGeneratingExplanation(true);
    setExplanationError(null);

    const prompt = `أنت مساعد قانوني مغربي متخصص حصرياً في شرح وتبسيط النصوص التشريعية المغربية.
قواعد صارمة:
1. اشرح مضمون هذه المادة بلغة عربية سليمة وواضحة ومختصرة دون تغيير معناها القانوني.
2. لا تخترع أي مقتضيات أو أحكام غير موجودة في النص الرسمي.
3. التزم حصرياً بالنص المقدم أدناه.

القانون: ${currentLaw.officialName}
${currentLaw.articlePrefix} رقم: ${selectedArticleKey}
النص القانوني الرسمي:
"${currentArticleText}"

المطلوب:
- قدم فقرة واحدة موجزة تلخص جوهر الحكم القانوني للمادة.
- اذكر أهم الآثار أو الشروط العملية في 2 إلى 3 نقاط موجزة إن وجدت.`;

    try {
      const response = await generateContent({
        prompt,
        type: 'legal_simplification'
      });

      const explanationText = 
        response?.candidates?.[0]?.content?.parts?.[0]?.text || 
        response?.text || 
        (typeof response === 'string' ? response : null);

      if (explanationText) {
        setSimplifiedExplanation(explanationText);
      } else {
        setSimplifiedExplanation(
          `تحدد هذه المادة من ${currentLaw.shortName} القواعد القانونية المنظمة لـ: ${currentLaw.articlePrefix} ${selectedArticleKey}، وتتضمن أحكاماً ملزمة تسري وفق الضوابط التشريعية المعتمدة.`
        );
      }
    } catch (err: any) {
      console.error("Error generating legal explanation:", err);
      setExplanationError("تعذر توليد الشرح التوضيحي حالياً. يمكنك الاعتماد المباشر على النص الرسمي أعلاه.");
    } finally {
      setIsGeneratingExplanation(false);
    }
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
    <div className="min-h-screen bg-slate-50/60 py-5 px-3 sm:px-6 lg:px-8 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-3.5">

        {/* 1. Sleek, Concise Search & Control Header */}
        <header className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3.5 sm:p-4 no-print space-y-3">
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
            
            {/* Field 1: Compact Law Picker */}
            <div className="relative md:w-64 shrink-0">
              <label className="sr-only">اختر القانون</label>
              <select
                value={selectedLawId}
                onChange={(e) => handleLawSelect(e.target.value)}
                className="w-full h-11 pr-3 pl-8 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl font-bold text-xs sm:text-[13px] text-slate-800 focus:ring-2 focus:ring-[#0f2d59]/20 focus:border-[#0f2d59] outline-none transition-all cursor-pointer appearance-none truncate"
                title="القانون المختار"
              >
                {allLaws.map(law => (
                  <option key={law.id} value={law.id}>
                    {law.shortName} ({Object.keys(law.data).length} {law.articlePrefix})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Field 2: Smart Unified Search Input */}
            <div className="relative flex-1" ref={searchContainerRef}>
              <form onSubmit={handleExecuteSearch} className="relative flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  placeholder="ابحث برقم المادة أو بالكلمات (مثال: 62، فصل 230، طرد تعسفي...)"
                  className="w-full h-11 pr-9 pl-16 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs sm:text-[13px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#0f2d59]/20 focus:border-[#0f2d59] outline-none transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResultState(null);
                      searchInputRef.current?.focus();
                    }}
                    className="absolute left-11 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    title="مسح البحث"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="submit"
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 h-8 px-2.5 bg-[#0f2d59] hover:bg-[#1a3d72] text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                  title="تنفيذ البحث"
                >
                  <Search className="w-3 h-3" />
                  <span className="hidden sm:inline">بحث</span>
                </button>
              </form>

              {/* Instant Suggestions Popover */}
              {isSearchFocused && searchQuery.trim() && searchSuggestions.length > 0 && (
                <div className="absolute z-30 top-full mt-1.5 inset-x-0 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 overflow-hidden">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-100 flex items-center justify-between">
                    <span>نتائج ومقترحات مباشرة</span>
                    <span className="text-[10px] text-[#0f766e]">اضغط للعرض الفوري</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
                    {searchSuggestions.map((item, idx) => (
                      <button
                        key={`${item.law.id}-${item.key}-${idx}`}
                        type="button"
                        onClick={() => handleSelectArticle(item.law, item.key, 'HIGH')}
                        className="w-full text-right px-3 py-2 hover:bg-slate-50 transition-colors flex flex-col gap-0.5 cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#0f2d59] group-hover:text-[#0f766e]">
                            {item.law.shortName} • {item.label || `${item.law.articlePrefix} ${item.key}`}
                          </span>
                          <span className="text-[10px] text-[#0f766e] opacity-0 group-hover:opacity-100 transition-opacity">
                            عرض المادة ←
                          </span>
                        </div>
                        {item.snippet && (
                          <p className="text-[11px] text-slate-500 font-serif line-clamp-1">
                            {item.snippet}...
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Field 3: Direct Quick Jump Number Input */}
            <form onSubmit={handleQuickJumpSubmit} className="flex items-center gap-1.5 shrink-0">
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl h-11 px-2.5 focus-within:ring-2 focus-within:ring-[#0f2d59]/20 focus-within:border-[#0f2d59] transition-all">
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap pl-1">
                  {currentLaw.articlePrefix}:
                </span>
                <input
                  type="text"
                  value={quickJumpNumber}
                  onChange={(e) => setQuickJumpNumber(e.target.value)}
                  placeholder={selectedArticleKey || "1"}
                  className="w-14 bg-transparent text-center font-mono font-bold text-xs sm:text-sm text-[#0f2d59] outline-none"
                  title="أدخل رقم المادة للانتقال الفوري"
                />
              </div>

              {/* Prev / Next buttons */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl h-11 p-1">
                <button
                  type="button"
                  disabled={!hasPrev}
                  onClick={goToPrev}
                  className={cn(
                    "h-full px-2 rounded-lg transition-colors flex items-center justify-center",
                    hasPrev 
                      ? "text-slate-700 hover:text-[#0f2d59] hover:bg-white cursor-pointer shadow-2xs" 
                      : "text-slate-300 cursor-not-allowed"
                  )}
                  title={`${currentLaw.articlePrefix} السابق (→)`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={!hasNext}
                  onClick={goToNext}
                  className={cn(
                    "h-full px-2 rounded-lg transition-colors flex items-center justify-center",
                    hasNext 
                      ? "text-slate-700 hover:text-[#0f2d59] hover:bg-white cursor-pointer shadow-2xs" 
                      : "text-slate-300 cursor-not-allowed"
                  )}
                  title={`${currentLaw.articlePrefix} التالي (←)`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Settings / Display Toggle Button */}
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className={cn(
                  "h-11 px-2.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer",
                  showSettings 
                    ? "bg-[#0f2d59] text-white border-[#0f2d59]" 
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                )}
                title="إعدادات القراءة وحجم الخط"
              >
                <Settings className="w-4 h-4" />
              </button>
            </form>

          </div>

          {/* Collapsible Reader Settings */}
          {showSettings && (
            <div className="pt-2.5 pb-1 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-600">حجم خط القراءة:</span>
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
                  <button
                    onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                    className="p-1 hover:bg-white rounded text-slate-600 hover:text-[#0f2d59] transition-colors cursor-pointer"
                    title="تصغير الخط"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-xs font-mono font-bold text-slate-700 select-none">
                    {fontSize}px
                  </span>
                  <button
                    onClick={() => setFontSize(prev => Math.min(26, prev + 2))}
                    className="p-1 hover:bg-white rounded text-slate-600 hover:text-[#0f2d59] transition-colors cursor-pointer"
                    title="تكبير الخط"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFullMetadata(!showFullMetadata)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg border font-medium text-[11px] transition-colors cursor-pointer flex items-center gap-1",
                    showFullMetadata 
                      ? "bg-[#0f766e]/10 text-[#0f766e] border-[#0f766e]/30" 
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  )}
                >
                  <Info className="w-3 h-3" />
                  <span>{showFullMetadata ? 'إخفاء المراجع الموسعة' : 'عرض المراجع الرسمية الموسعة'}</span>
                </button>
              </div>
            </div>
          )}
        </header>

        {/* 2. Disambiguation View */}
        {searchResultState && searchResultState.kind === 'MULTI_LAW_MATCH' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3 text-right animate-in fade-in">
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
                  className="p-3 rounded-xl border border-slate-200 hover:border-[#0f766e] bg-slate-50 hover:bg-white transition-all cursor-pointer group space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0f2d59] group-hover:text-[#0f766e]">
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

        {/* 3. Ambiguous Law Candidate View */}
        {searchResultState && searchResultState.kind === 'AMBIGUOUS_LAW' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3 text-right animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-sm font-black text-[#0f2d59]">
                حدد القانون المطلوب لاستعلام: "{searchResultState.queryText}"
              </h2>
              <button
                onClick={() => setSearchResultState(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {searchResultState.candidateLaws.map((law) => {
                const targetKey = searchResultState.articleKey && law.data[searchResultState.articleKey] 
                  ? searchResultState.articleKey 
                  : Object.keys(law.data)[0];
                return (
                  <button
                    key={law.id}
                    onClick={() => handleSelectArticle(law, targetKey, 'HIGH')}
                    className="p-3 rounded-xl border border-slate-200 hover:border-[#0f2d59] bg-slate-50 hover:bg-white text-right transition-all cursor-pointer"
                  >
                    <div className="font-bold text-xs text-[#0f2d59]">{law.name}</div>
                    <div className="text-[11px] text-[#0f766e] mt-1 font-bold">
                      عرض المادة {searchResultState.articleKey || 'الأولى'} ←
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Topic / Keyword Search Results View */}
        {searchResultState && searchResultState.kind === 'TOPIC_SEARCH' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3 text-right animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h2 className="text-sm font-black text-[#0f2d59]">
                  نتائج البحث الموضوعي عن: "{searchResultState.queryText}"
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  تم العثور على ({searchResultState.results.length}) مادة ذات صلة:
                </p>
              </div>
              <button
                onClick={() => setSearchResultState(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {searchResultState.results.map((res, idx) => (
                <div
                  key={`${res.law.id}-${res.articleKey}-${idx}`}
                  onClick={() => handleSelectArticle(res.law, res.articleKey, res.confidence)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-[#0f766e] bg-slate-50 hover:bg-white transition-all cursor-pointer group space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0f2d59] group-hover:text-[#0f766e]">
                      {res.law.shortName} • {res.law.articlePrefix} {res.articleKey}
                    </span>
                    <span className="text-[10px] text-emerald-800 font-bold">
                      تطابق موثوق
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-serif leading-relaxed">
                    {res.snippet}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Not Found Notice */}
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

        {/* 6. Formal Legal Document Card */}
        <main className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden text-right">
          
          {/* Header Bar */}
          <div className="bg-gradient-to-b from-slate-50/80 to-white px-5 sm:px-7 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Scale className="w-3.5 h-3.5 text-[#0f766e]" />
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
                    : "bg-white border-slate-200 text-slate-700 hover:text-[#0f2d59] hover:border-slate-300 hover:bg-slate-50"
                )}
                title="نسخ نص المادة بالمرجع الكامل"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
              </button>

              {/* Download */}
              <button
                onClick={handleDownload}
                className="h-9 w-9 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-[#0f2d59] rounded-xl transition-all cursor-pointer shadow-2xs flex items-center justify-center"
                title="تحميل النص الرسمي"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Print */}
              <button
                onClick={handlePrint}
                className="h-9 w-9 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-[#0f2d59] rounded-xl transition-all cursor-pointer shadow-2xs hidden sm:flex items-center justify-center"
                title="طباعة"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Simplified Explanation Trigger Button */}
              <button
                onClick={handleGenerateSimplifiedExplanation}
                disabled={isGeneratingExplanation}
                className="h-9 px-3 bg-[#0f766e]/10 hover:bg-[#0f766e]/20 text-[#0f766e] border border-[#0f766e]/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                title="شرح وتوضيح مبسط للمادة"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0f766e]" />
                <span className="hidden sm:inline">شرح مبسط</span>
              </button>
            </div>
          </div>

          {/* Optional Expanded Metadata Banner */}
          {showFullMetadata && (
            <div className="bg-slate-50/80 border-b border-slate-200 px-5 sm:px-7 py-3 text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 animate-in fade-in">
              <div>
                <strong className="text-slate-800">الاسم الرسمي: </strong>
                <span>{currentLaw.officialName}</span>
              </div>
              <div>
                <strong className="text-slate-800">المرجع: </strong>
                <span>{currentLaw.reference}</span>
              </div>
              <div>
                <strong className="text-slate-800">الجريدة الرسمية: </strong>
                <span>{currentLaw.officialGazette}</span>
              </div>
              <div>
                <strong className="text-slate-800">المصدر: </strong>
                <span>{currentLaw.source}</span>
              </div>
              <div>
                <strong className="text-slate-800">تاريخ التحيين: </strong>
                <span>{currentLaw.lastUpdate}</span>
              </div>
            </div>
          )}

          {/* 7. Interactive Horizontal Breadcrumbs Bar (شريط تنقل أفقي فوق نص المادة) */}
          <nav 
            aria-label="المسار الهيكلي للمادة"
            className="bg-slate-50/90 border-b border-slate-200/90 px-5 sm:px-7 py-2.5 flex items-center justify-between gap-3 overflow-x-auto no-print text-xs"
          >
            <div className="flex items-center gap-1.5 flex-nowrap shrink-0 text-slate-600">
              <span className="flex items-center gap-1 font-bold text-[#0f766e] shrink-0 ml-1">
                <Layers className="w-3.5 h-3.5" />
                <span>المسار:</span>
              </span>

              {/* Book (الكتاب) */}
              {breadcrumbBook && (
                <button
                  type="button"
                  onClick={() => openDrawerWithChapter(currentChapter?.id)}
                  className="font-medium text-slate-700 hover:text-[#0f2d59] hover:underline cursor-pointer truncate max-w-[180px] sm:max-w-[240px] transition-colors text-right"
                  title="انقر لتصفح أبواب هذا الكتاب في الفهرس الكامل"
                >
                  {breadcrumbBook}
                </button>
              )}

              {/* Section (القسم) */}
              {breadcrumbSection && (
                <>
                  <ChevronLeft className="w-3 h-3 text-slate-400 shrink-0" />
                  <button
                    type="button"
                    onClick={() => openDrawerWithChapter(currentChapter?.id)}
                    className="font-medium text-slate-700 hover:text-[#0f2d59] hover:underline cursor-pointer truncate max-w-[180px] sm:max-w-[240px] transition-colors text-right"
                    title="انقر لتصفح أقسام هذا الكتاب في الفهرس الكامل"
                  >
                    {breadcrumbSection}
                  </button>
                </>
              )}

              {/* Chapter (الباب) */}
              {breadcrumbChapter && (
                <>
                  <ChevronLeft className="w-3 h-3 text-slate-400 shrink-0" />
                  <button
                    type="button"
                    onClick={() => openDrawerWithChapter(currentChapter?.id)}
                    className="font-bold text-[#0f2d59] hover:text-[#0f766e] hover:underline cursor-pointer truncate max-w-[200px] sm:max-w-[280px] transition-colors text-right"
                    title="انقر للتنقل بين أبواب القانون في الفهرس الكامل"
                  >
                    {breadcrumbChapter}
                  </button>
                </>
              )}
            </div>

            {/* Quick Button to Open Side Drawer */}
            <button
              type="button"
              onClick={() => openDrawerWithChapter(currentChapter?.id)}
              className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-[#0f2d59] border border-slate-200 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
              title="تصفح فهرس الأبواب والمواد الكاملة"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#0f766e]" />
              <span className="hidden sm:inline">تصفح الأبواب والمواد</span>
              <span className="sm:hidden">الأبواب</span>
            </button>
          </nav>

          {/* Legal Text Reading Space */}
          <div className="p-6 sm:p-9 md:p-11 min-h-[360px] bg-white selection:bg-[#0f766e]/15">

            {/* Article Content Render */}
            <article className="max-w-4xl mx-auto">
              {renderFormattedArticleContent(currentArticleText)}
            </article>

            {/* Simplified Explanation Section */}
            {isGeneratingExplanation && (
              <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2 animate-pulse max-w-4xl mx-auto">
                <Sparkles className="w-4 h-4 text-[#0f766e] animate-spin" />
                <span>جارٍ صياغة شرح قانوني مبسط للمادة...</span>
              </div>
            )}

            {simplifiedExplanation && (
              <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-2.5 max-w-4xl mx-auto animate-in fade-in no-print">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f2d59]">
                    <Sparkles className="w-3.5 h-3.5 text-[#0f766e]" />
                    <span>شرح مبسط لمقتضيات المادة</span>
                  </div>
                  <button
                    onClick={() => setSimplifiedExplanation(null)}
                    className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    إغلاق
                  </button>
                </div>
                <div className="text-xs sm:text-[13px] text-slate-800 leading-relaxed font-sans whitespace-pre-line">
                  {simplifiedExplanation}
                </div>
                <div className="text-[11px] text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200/60">
                  تنبيه: هذا الشرح للتوضيح فقط، ويبقى النص التشريعي الرسمي هو المعتمد قانوناً.
                </div>
              </div>
            )}

            {explanationError && (
              <p className="mt-4 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 max-w-4xl mx-auto">
                {explanationError}
              </p>
            )}

            {/* Related Sub-Articles / Followers */}
            {relatedSubArticles.length > 0 && (
              <section className="mt-10 pt-6 border-t border-slate-200 max-w-4xl mx-auto space-y-4">
                <div className="flex items-center gap-2 text-[#0f2d59] font-black text-sm">
                  <Layers className="w-4 h-4 text-[#0f766e]" />
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
                          className="text-[11px] font-bold text-[#0f766e] hover:text-[#0f2d59] flex items-center gap-1 cursor-pointer transition-colors"
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
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer border shadow-2xs",
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
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer border shadow-2xs",
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

      {/* 8. Slide-over Side Drawer: Full Chapters & Articles Browser (النافذة الجانبية لتصفح فهرس المواد الكامل) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end no-print animate-in fade-in duration-200" dir="rtl">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over panel */}
          <aside 
            className="relative z-10 w-full max-w-md sm:max-w-lg bg-white h-full shadow-2xl border-r border-slate-200 flex flex-col animate-in slide-in-from-right duration-250"
            role="dialog"
            aria-modal="true"
            aria-label={`فهرس ${currentLaw.name}`}
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#0f766e]" />
                  <h2 className="font-black text-sm sm:text-base text-[#0f2d59]">
                    فهرس الأبواب والمواد
                  </h2>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {currentLaw.officialName} ({lawArticleKeys.length} {currentLaw.articlePrefix})
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                title="إغلاق الفهرس (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search within Drawer */}
            <div className="p-3.5 border-b border-slate-100 bg-white">
              <div className="relative">
                <input
                  type="text"
                  value={drawerSearchQuery}
                  onChange={(e) => setDrawerSearchQuery(e.target.value)}
                  placeholder="ابحث في عناوين الأبواب أو أرقام المواد..."
                  className="w-full h-10 pr-9 pl-8 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#0f2d59]/20 focus:border-[#0f2d59] outline-none transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                {drawerSearchQuery && (
                  <button
                    onClick={() => setDrawerSearchQuery('')}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Chapters & Articles List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredHierarchy.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  لا توجد نتائج مطابقة لبحثك في الفهرس.
                </div>
              ) : (
                filteredHierarchy.map((bookGroup, bIdx) => (
                  <div key={`book-${bIdx}`} className="space-y-2.5">
                    {/* Book Title */}
                    <div className="flex items-center justify-between text-xs font-bold text-[#0f2d59] bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/60">
                      <span className="truncate">{bookGroup.book}</span>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0 mr-2">
                        {bookGroup.chapters.reduce((acc, c) => acc + c.articleKeys.length, 0)} {currentLaw.articlePrefix}
                      </span>
                    </div>

                    {/* Chapters inside Book */}
                    <div className="space-y-2 pr-1">
                      {bookGroup.chapters.map((chap) => {
                        const isCurrentChap = currentChapter?.id === chap.id;
                        const isExpanded = expandedChapterIds.has(chap.id) || drawerSearchQuery.trim().length > 0;

                        return (
                          <div 
                            key={chap.id}
                            className={cn(
                              "rounded-xl border transition-all overflow-hidden",
                              isCurrentChap 
                                ? "border-[#0f766e]/40 bg-[#0f766e]/5" 
                                : "border-slate-200 bg-white hover:border-slate-300"
                            )}
                          >
                            {/* Chapter Header Toggle */}
                            <button
                              type="button"
                              onClick={() => toggleChapterExpansion(chap.id)}
                              className="w-full text-right p-3 flex items-center justify-between gap-2 hover:bg-slate-50/70 transition-colors cursor-pointer"
                            >
                              <div className="space-y-0.5 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    "font-bold text-xs sm:text-[13px] truncate",
                                    isCurrentChap ? "text-[#0f766e]" : "text-slate-800"
                                  )}>
                                    {chap.chapter}
                                  </span>
                                  {isCurrentChap && (
                                    <span className="text-[10px] bg-[#0f766e] text-white px-1.5 py-0.2 rounded font-bold shrink-0">
                                      الحالي
                                    </span>
                                  )}
                                </div>
                                {chap.section && (
                                  <div className="text-[11px] text-slate-500 font-medium truncate">
                                    {chap.section}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 text-slate-400 mr-2">
                                <span className="text-[10px] font-mono font-medium text-slate-500">
                                  {chap.articleKeys.length} {currentLaw.articlePrefix}
                                </span>
                                <ChevronDown className={cn(
                                  "w-4 h-4 transition-transform duration-200",
                                  isExpanded && "rotate-180 text-slate-700"
                                )} />
                              </div>
                            </button>

                            {/* Articles Grid under Chapter */}
                            {isExpanded && (
                              <div className="p-2.5 pt-0 border-t border-slate-100/80 bg-slate-50/40">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-2">
                                  {chap.articleKeys.map((aKey) => {
                                    const isSelected = selectedArticleKey === aKey;
                                    return (
                                      <button
                                        key={aKey}
                                        type="button"
                                        onClick={() => {
                                          handleSelectArticle(currentLaw, aKey, 'HIGH');
                                          setIsDrawerOpen(false);
                                        }}
                                        className={cn(
                                          "p-2 rounded-lg text-right transition-all cursor-pointer flex flex-col gap-0.5 border text-xs",
                                          isSelected
                                            ? "bg-[#0f2d59] text-white border-[#0f2d59] shadow-xs font-bold"
                                            : "bg-white hover:bg-slate-100/80 text-slate-700 border-slate-200 hover:border-slate-300"
                                        )}
                                      >
                                        <span className={cn(
                                          "font-bold font-mono",
                                          isSelected ? "text-amber-300" : "text-[#0f2d59]"
                                        )}>
                                          {currentLaw.articlePrefix} {aKey}
                                        </span>
                                        <span className={cn(
                                          "text-[10px] line-clamp-1 font-serif",
                                          isSelected ? "text-slate-200" : "text-slate-500"
                                        )}>
                                          {currentLaw.data[aKey]?.slice(0, 40).replace(/\n/g, ' ')}...
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer with current status */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
              <span>المادة الحالية: <strong>{currentLaw.articlePrefix} {selectedArticleKey}</strong></span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
              >
                إغلاق الفهرس
              </button>
            </div>
          </aside>
        </div>
      )}

    </div>
  );
}
