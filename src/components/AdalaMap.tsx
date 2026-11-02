/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Scale, 
  Gavel, 
  Building2, 
  ShieldAlert, 
  Navigation,
  ArrowLeft,
  ChevronRight,
  Landmark,
  Briefcase,
  Globe,
  Settings,
  HelpCircle,
  FileText,
  Users,
  CreditCard,
  Building,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Share2
} from 'lucide-react';
import { UNIQUE_JUDICIAL_MAP, JudicialEntry } from '../data/judicialMapData';
import { cn } from '../lib/utils';
import { determineJurisdiction, CASE_TYPE, JurisdictionInput, JurisdictionResult } from '../services/jurisdictionService';

type Tab = 'spatial' | 'subject';

export default function AdalaMap() {
  const [activeTab, setActiveTab] = useState<Tab>('spatial');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommune, setSelectedCommune] = useState<JudicialEntry | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Subject Matter state
  const [subjectInput, setSubjectInput] = useState<JurisdictionInput>({
    caseType: CASE_TYPE.CIVIL,
    value: 0
  });
  const [jurisdictionResult, setJurisdictionResult] = useState<(JurisdictionResult & { localCourt?: string }) | null>(null);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false);

  const subjectSuggestions = useMemo(() => {
    if (!subjectSearch.trim()) return [];
    const term = subjectSearch.trim();
    return UNIQUE_JUDICIAL_MAP.filter(item => 
      item.commune.includes(term)
    ).slice(0, 5);
  }, [subjectSearch]);

  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.trim();
    const filtered = UNIQUE_JUDICIAL_MAP.filter(item => 
      item.commune.includes(term) || 
      item.primaryCourt.includes(term)
    );

    return filtered.sort((a, b) => {
      const aStarts = a.commune.startsWith(term);
      const bStarts = b.commune.startsWith(term);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.commune.localeCompare(b.commune);
    }).slice(0, 8); // Shorter list as requested
  }, [searchTerm]);

  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const JURISDICTION_CATEGORIES: Record<string, CASE_TYPE[]> = {
    "القضاء المدني": [CASE_TYPE.CIVIL, CASE_TYPE.PROXIMITY, CASE_TYPE.FAMILY],
    "القضاء الاجتماعي": [CASE_TYPE.SOCIAL, CASE_TYPE.LABOR_DISPUTE, CASE_TYPE.WORK_ACCIDENT, CASE_TYPE.SOCIAL_SECURITY],
    "القضاء التجاري": [CASE_TYPE.COMMERCIAL, CASE_TYPE.COMMERCIAL_CONTRACTS, CASE_TYPE.MERCHANT_DISPUTES, CASE_TYPE.COMMERCIAL_PAPER, CASE_TYPE.PARTNER_DISPUTE, CASE_TYPE.BUSINESS_ASSET, CASE_TYPE.BUSINESS_DISTRESS],
    "القضاء الإداري": [CASE_TYPE.ADMINISTRATIVE, CASE_TYPE.ELECTION, CASE_TYPE.TAX, CASE_TYPE.EXPROPRIATION, CASE_TYPE.PENSIONS, CASE_TYPE.PUBLIC_DEBTS, CASE_TYPE.ADMIN_LIABILITY],
  };

  const handleCalculateJurisdiction = () => {
    const result = determineJurisdiction(subjectInput);
    
    // Find local court based on commune if selected
    let localCourt = '';
    if (subjectInput.commune) {
      const entry = UNIQUE_JUDICIAL_MAP.find(e => e.commune === subjectInput.commune);
      if (entry) {
        if (result.courtType === "تجارية") localCourt = entry.commercialPrimary;
        else if (result.courtType === "إدارية") localCourt = entry.adminPrimary;
        else if (result.courtType === "قسم متخصص" && result.specializedDivision?.includes("تجاري")) localCourt = entry.primaryCourt;
        else if (result.courtType === "قسم متخصص" && result.specializedDivision?.includes("إداري")) localCourt = entry.primaryCourt;
        else localCourt = entry.primaryCourt;
      }
    }

    setJurisdictionResult({ ...result, localCourt });
  };

  const openInMaps = (courtName: string, label?: string) => {
    let query = courtName;
    if (label) {
      if (label.includes("التجارية")) query = "المحكمة التجارية " + courtName;
      else if (label.includes("الإدارية")) query = "المحكمة الإدارية " + courtName;
      else if (label.includes("الابتدائية")) query = "المحكمة الابتدائية " + courtName;
      else if (label.includes("الاستئناف")) query = "محكمة الاستئناف " + courtName;
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  const handleSelect = (item: JudicialEntry) => {
    setSelectedCommune(item);
    setSearchTerm(item.commune);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 overflow-x-hidden" dir="rtl">
      {/* Header Section */}
      <section className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 pt-3 pb-6 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="flex flex-wrap justify-center gap-3 mt-1 max-w-4xl mx-auto">
             {[
               { label: "محاكم الاستئناف", count: 23 },
               { label: "المحاكم الابتدائية", count: 89 },
               { label: "مراكز القاضي المقيم", count: 82 },
               { label: "محاكم استئناف تجارية", count: 5 },
               { label: "محاكم ابتدائية تجارية", count: 10 },
               { label: "محاكم استئناف إدارية", count: 5 },
               { label: "محاكم ابتدائية إدارية", count: 10 }
             ].map((stat, i) => (
               <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-transform hover:scale-105">
                  <span className="text-amber-600 font-black text-xs md:text-sm">{stat.count}</span>
                  <span className="text-[9px] md:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter whitespace-nowrap">{stat.label}</span>
               </div>
             ))}
          </div>

          <div className="flex justify-center mt-8 md:mt-10">
            <div className="inline-flex p-1.5 bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 rounded-[1.5rem] md:rounded-[2rem] gap-1.5 shadow-md backdrop-blur-sm self-center">
              {/* الاختصاص المحلي */}
              <button
                onClick={() => setActiveTab('spatial')}
                className={cn(
                  "group relative flex items-center justify-center gap-2.5 px-5 py-3 md:px-8 md:py-3.5 rounded-xl md:rounded-[1.35rem] text-xs md:text-base font-bold transition-all duration-300 outline-none overflow-hidden",
                  activeTab === 'spatial'
                    ? "text-white shadow-md shadow-amber-500/20"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {activeTab === 'spatial' && (
                  <motion.div
                    layoutId="adalaMapActiveTab"
                    className="absolute inset-0 bg-[#0f2d59] rounded-xl md:rounded-[1.35rem] -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <MapPin className={cn(
                  "w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:scale-110",
                  activeTab === 'spatial' ? "text-white" : "text-amber-500"
                )} />
                <span className="relative z-10 whitespace-nowrap">الاختصاص المحلي</span>
              </button>

              {/* الاختصاص النوعي */}
              <button
                onClick={() => setActiveTab('subject')}
                className={cn(
                  "group relative flex items-center justify-center gap-2.5 px-5 py-3 md:px-8 md:py-3.5 rounded-xl md:rounded-[1.35rem] text-xs md:text-base font-bold transition-all duration-300 outline-none overflow-hidden",
                  activeTab === 'subject'
                    ? "text-white shadow-md shadow-amber-500/20"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {activeTab === 'subject' && (
                  <motion.div
                    layoutId="adalaMapActiveTab"
                    className="absolute inset-0 bg-[#0f2d59] rounded-xl md:rounded-[1.35rem] -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Scale className={cn(
                  "w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:scale-110",
                  activeTab === 'subject' ? "text-white" : "text-amber-500"
                )} />
                <span className="relative z-10 whitespace-nowrap">الاختصاص النوعي</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-6 relative z-30">
        <AnimatePresence mode="wait">
          {activeTab === 'spatial' ? (
            <motion.div
              key="spatial-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Search Box */}
              {!selectedCommune && (
                <div className="max-w-2xl mx-auto">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowResults(true);
                      }}
                      onFocus={() => setShowResults(true)}
                      placeholder="ابحث عن الجماعة (مثلاً: الداخلة، بوزنيقة)..."
                      className="w-full h-12 pr-10 pl-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none transition-all text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                    />
                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-600 dark:text-rose-400 pointer-events-none" />
                    
                    <AnimatePresence>
                      {showResults && suggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full right-0 left-0 mt-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl z-[201] overflow-hidden"
                        >
                          {suggestions.map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSelect(item)}
                              className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-amber-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-50 dark:border-slate-700 last:border-0 text-right"
                            >
                              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-black text-slate-900 dark:text-white text-sm md:text-base leading-tight mb-0.5 truncate">{item.commune}</div>
                                <div className="text-[9px] text-slate-400 font-bold uppercase truncate">مركز {item.primaryCourt}</div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {selectedCommune && (
                <div className="space-y-6">
                  {/* Selection Header */}
                  <motion.div 
                    layoutId="selection-header"
                    className="bg-white dark:bg-slate-800 p-4 md:p-5 rounded-2xl md:rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-between gap-4 w-full"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-amber-600/30 shrink-0">
                        <Landmark className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="text-right">
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-serif">{selectedCommune.commune}</h2>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedCommune(null)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-2 text-xs md:text-sm shrink-0"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                      بحث جديد
                    </button>
                  </motion.div>

                      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-6 md:space-y-8">
                          <CourtSection 
                            title="القضاء العادي"
                            icon={<Building2 />}
                            items={[
                              { label: "الجماعة الترابية", value: selectedCommune.commune, highlight: true },
                              { label: "المحكمة الابتدائية المختصة", value: selectedCommune.primaryCourt, searchable: true },
                              { label: "محكمة الاستئناف التابعة لها", value: selectedCommune.appealCourt, searchable: true },
                            ]}
                            color="amber"
                            onSearch={openInMaps}
                          />

                          <CourtSection 
                            title="القضاء التجاري"
                            icon={<Briefcase />}
                            items={[
                              { label: "المحكمة الابتدائية التجارية", value: selectedCommune.commercialPrimary, searchable: true },
                              { label: "محكمة الاستئناف التجارية", value: selectedCommune.commercialAppeal, searchable: true },
                            ]}
                            color="blue"
                            onSearch={openInMaps}
                          />
                        </div>

                        <div className="space-y-6 md:space-y-8">
                          <CourtSection 
                            title="القضاء الإداري"
                            icon={<Landmark />}
                            items={[
                              { label: "المحكمة الابتدائية الإدارية", value: selectedCommune.adminPrimary, searchable: true },
                              { label: "محكمة الاستئناف الإدارية", value: selectedCommune.adminAppeal, searchable: true },
                            ]}
                            color="indigo"
                            onSearch={openInMaps}
                          />
                      
                      {selectedCommune.judicialCenters && selectedCommune.judicialCenters.length > 0 && (
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 justify-end">
                            قضاء القرب (المراكز القضائية)
                            <MapPin className="w-4 h-4 text-amber-600" />
                          </h3>
                          <div className="flex flex-wrap gap-2 justify-end">
                            {selectedCommune.judicialCenters.map((center, i) => (
                              <button 
                                key={i} 
                                onClick={() => openInMaps(center)}
                                className="px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-slate-700 border border-slate-200 hover:border-amber-500 hover:text-amber-700 transition-all flex items-center gap-1.5 shadow-sm"
                              >
                                <Navigation className="w-3 h-3" />
                                {center}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-3 flex-row-reverse relative z-10">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50 border border-red-100 text-red-700 shadow-sm">
                            <ShieldAlert className="w-5 h-5" />
                          </div>
                          <div className="text-right">
                            <h3 className="text-base font-bold text-slate-900">قسم الجرائم المالية</h3>
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed text-right relative z-10">
                          تتبع لـ <strong className="text-amber-700 hover:underline cursor-pointer font-bold" onClick={() => openInMaps(selectedCommune.financialCrimesAppeal, "محكمة الاستئناف")}>قسم الجرائم المالية بـ {selectedCommune.financialCrimesAppeal}</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : activeTab === 'subject' ? (
            <motion.div
              key="subject-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid lg:grid-cols-12 gap-8 items-start"
            >
              {/* Form Side - The Wizard */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-2xl relative">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-lg text-xl font-serif">1</div>
                  
                  <div className="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-slate-700 pb-6">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-100 dark:border-amber-900/30">
                      <Settings className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">إعداد التشخيص</h3>
                      <p className="text-xs md:text-sm text-slate-500 font-bold">حدد معطيات النزاع بدقة للحصول على النتيجة</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Commune Selection */}
                    <div className="space-y-3 relative">
                      <label className="text-sm md:text-base font-black text-slate-700 dark:text-slate-300 flex items-center gap-2 justify-end">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        الجماعة الترابية
                      </label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={subjectSearch}
                          onChange={(e) => {
                            setSubjectSearch(e.target.value);
                            setShowSubjectSuggestions(true);
                          }}
                          onFocus={() => setShowSubjectSuggestions(true)}
                          placeholder="المدينة أو الجماعة محل النزاع..."
                          className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 text-right font-bold text-base focus:border-amber-500 outline-none transition-all shadow-sm"
                        />
                        <AnimatePresence>
                          {showSubjectSuggestions && subjectSuggestions.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute top-full right-0 left-0 mt-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-[100] overflow-hidden"
                            >
                              {subjectSuggestions.map((item, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setSubjectInput({...subjectInput, commune: item.commune});
                                    setSubjectSearch(item.commune);
                                    setShowSubjectSuggestions(false);
                                  }}
                                  className="w-full px-6 py-4 text-right hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm md:text-base font-black border-b border-slate-50 dark:border-slate-700 last:border-0"
                                >
                                  {item.commune}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-3">
                      <label className="text-sm md:text-base font-black text-slate-700 dark:text-slate-300 flex items-center gap-2 justify-end">
                        <Gavel className="w-4 h-4 text-amber-600" />
                        طبيعة القضية
                      </label>
                      <select 
                        value={selectedCategory}
                        onChange={(e) => {
                          const cat = e.target.value;
                          setSelectedCategory(cat);
                          if (JURISDICTION_CATEGORIES[cat]) {
                            setSubjectInput({...subjectInput, caseType: JURISDICTION_CATEGORIES[cat][0]});
                          }
                        }}
                        className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 text-right font-black text-sm md:text-base focus:border-amber-500 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="">اختر طبيعة القضية...</option>
                        {Object.keys(JURISDICTION_CATEGORIES).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Case Subtype Selection */}
                    {selectedCategory && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <label className="text-sm md:text-base font-black text-slate-700 dark:text-slate-300 flex items-center gap-2 justify-end">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          نوع النزاع
                        </label>
                        <select 
                          value={subjectInput.caseType}
                          onChange={(e) => setSubjectInput({...subjectInput, caseType: e.target.value as CASE_TYPE})}
                          className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 text-right font-black text-sm md:text-base focus:border-amber-500 outline-none transition-all appearance-none cursor-pointer"
                        >
                          {JURISDICTION_CATEGORIES[selectedCategory].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </motion.div>
                    )}

                    {/* Value */}
                    <div className="space-y-3">
                      <label className="text-sm md:text-base font-black text-slate-700 dark:text-slate-300 flex items-center gap-2 justify-end">
                        <CreditCard className="w-4 h-4 text-amber-600" />
                        المطالب المالية (بالدرهم)
                      </label>
                      <div className="relative">
                        <input 
                          type="number"
                          placeholder="أدخل مبلغ المطالبة..."
                          value={subjectInput.value || ''}
                          onChange={(e) => setSubjectInput({...subjectInput, value: Number(e.target.value)})}
                          className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 text-right font-black text-base focus:border-amber-500 outline-none transition-all shadow-sm"
                        />
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">MAD</div>
                      </div>
                    </div>

                    {/* Special Contexts (Articles 39, 68) */}
                    {(selectedCategory === "القضاء الاجتماعي" || selectedCategory === "القضاء الإداري") && (
                      <div className="space-y-4 pt-2">
                        <label className="text-xs md:text-sm font-black text-slate-400 flex items-center gap-2 justify-end uppercase tracking-widest">
                          ظروف استثنائية (م 68 وم 39)
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                          {selectedCategory === "القضاء الاجتماعي" && (
                            <>
                              <ModernToggle 
                                label="موطن المؤمن له أو الأجير خارج المغرب"
                                active={!!subjectInput.isResidenceOutsideMorocco}
                                onClick={() => setSubjectInput({...subjectInput, isResidenceOutsideMorocco: !subjectInput.isResidenceOutsideMorocco})}
                              />
                              {subjectInput.caseType === CASE_TYPE.WORK_ACCIDENT && (
                                <ModernToggle 
                                  label="الحادثة وقعت خارج المغرب"
                                  active={!!subjectInput.isOutsideMorocco}
                                  onClick={() => setSubjectInput({...subjectInput, isOutsideMorocco: !subjectInput.isOutsideMorocco})}
                                />
                              )}
                            </>
                          )}
                          {selectedCategory === "القضاء الإداري" && (
                            <ModernToggle 
                              label="النزاع نشأ خارج دوائر اختصاص المحاكم الإدارية"
                              active={!!subjectInput.isOutsideKnownJurisdiction}
                              onClick={() => setSubjectInput({...subjectInput, isOutsideKnownJurisdiction: !subjectInput.isOutsideKnownJurisdiction})}
                            />
                          )}
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={handleCalculateJurisdiction}
                      className="w-full h-16 bg-slate-900 dark:bg-amber-600 text-white rounded-2xl font-black shadow-xl shadow-slate-200 dark:shadow-amber-900/20 hover:scale-[1.02] active:scale-98 transition-all text-lg md:text-xl flex items-center justify-center gap-3 mt-4"
                    >
                      توليد قرار الاختصاص
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Side */}
              <div className="lg:col-span-7 h-full">
                {!jurisdictionResult ? (
                  <div className="bg-slate-100/50 dark:bg-slate-800/50 h-full min-h-[500px] border-4 border-dashed border-slate-200 dark:border-slate-700 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 group transition-all">
                     <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg mb-8 group-hover:scale-110 transition-transform">
                       <HelpCircle className="w-12 h-12 text-slate-300" />
                     </div>
                     <h3 className="text-2xl font-black text-slate-400 font-serif">بانتظار المدخلات...</h3>
                     <p className="text-base text-slate-400 mt-4 font-bold max-w-sm">قم بتعبئة بيانات النزاع في الجانب الأيمن ليقوم المحرك الذكي بتحليل النصوص القانونية وتحديد الاختصاص.</p>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[3rem] border-2 border-amber-600 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-2 bg-amber-600"></div>
                      <div className="absolute top-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full -ml-24 -mt-24 blur-3xl"></div>
                      
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-slate-100 dark:border-slate-700 pb-8">
                        <div className="flex items-center gap-4 flex-row-reverse">
                          <div className="w-16 h-16 bg-amber-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-600/30">
                            <CheckCircle className="w-10 h-10" />
                          </div>                          <div className="text-right">
                            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-serif">نتيجة التشخيص الذكي</h3>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <DiagnosticItem 
                          label="المحكمة المختصة نوعياً"
                          value={jurisdictionResult.courtType}
                          subValue={jurisdictionResult.specializedDivision}
                          icon={<Building2 className="w-6 h-6" />}
                        />
                        {jurisdictionResult.localCourt && (
                          <DiagnosticItem 
                            label="المقر المختص مكانياً"
                            value={jurisdictionResult.localCourt}
                            icon={<MapPin className="w-6 h-6" />}
                            highlight
                          />
                        )}
                        <DiagnosticItem 
                          label="درجة التقاضي"
                          value={jurisdictionResult.isFinal ? "ابتدائي وانتهائي" : "ابتدائي"}
                          icon={<Scale className="w-6 h-6" />}
                        />
                         <DiagnosticItem 
                          label="قابلية الطعن"
                          value={jurisdictionResult.isFinal ? "غير قابل للاستئناف" : "قابل للاستئناف"}
                          icon={<ShieldAlert className="w-6 h-6" />}
                        />
                      </div>

                      <div className="mt-12 p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-700 relative">
                        <h4 className="text-sm font-black text-slate-400 mb-4 flex items-center gap-2 justify-end uppercase tracking-widest">
                          <Scale className="w-4 h-4 text-amber-600" />
                          التحليل القانوني والتعليل
                        </h4>
                        
                        <div className="flex flex-wrap gap-2 justify-end mb-6">
                          {jurisdictionResult.legalBasis.map(basis => (
                            <span key={basis} className="px-4 py-1.5 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-xs md:text-sm font-black flex items-center gap-2">
                              {basis}
                            </span>
                          ))}
                        </div>

                        {jurisdictionResult.notes && (
                          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl text-slate-700 dark:text-slate-300 text-sm md:text-lg font-bold leading-relaxed text-right border border-slate-100 dark:border-slate-700 shadow-sm font-serif">
                            {jurisdictionResult.notes}
                          </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                           <div className="flex gap-2">
                              <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-600 transition-colors border border-slate-200 dark:border-slate-700">
                                <Navigation className="w-5 h-5" />
                              </button>                           </div>
                           <p className="text-[10px] md:text-xs font-black text-slate-400 italic">هذا التشخيص استرشادي مبني على قانون المسطرة المدنية الجديد</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-16 text-center">
        <p className="text-slate-400 text-xs md:text-sm font-bold leading-relaxed px-10">
          مرسوم رقم 2.25.963 صادر في فاتح رمضان 1447 (19 فبراير 2026).<br />
          يحتوي هذا النطاق على كافة تعديلات الخريطة القضائية المحدثة وفق آخر إصدار للمسطرة المدنية.
        </p>
      </div>
    </div>
  );
}

// --- Modern UI Sub-components ---

const ModernToggle = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center justify-between px-4 py-3 md:py-4 rounded-2xl border-2 transition-all group h-14 md:h-16",
      active 
        ? "bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-600/20" 
        : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200"
    )}
  >
    <div className={cn(
      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
      active ? "bg-white border-white" : "border-slate-300 dark:border-slate-600"
    )}>
      {active && <CheckCircle className="w-4 h-4 text-amber-600" />}
    </div>
    <span className="text-xs md:text-sm font-black text-right leading-tight pr-1">{label}</span>
  </button>
);

const DiagnosticItem = ({ label, value, subValue, icon, highlight }: { label: string, value: string, subValue?: string, icon: React.ReactNode, highlight?: boolean }) => (
  <div className={cn(
    "p-6 md:p-8 rounded-[2rem] border-2 transition-all",
    highlight 
      ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30" 
      : "bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700/50 shadow-sm"
  )}>
    <div className="flex items-start justify-between gap-4 flex-row-reverse mb-4">
      <div className={cn(
        "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all shrink-0",
        highlight ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30" : "bg-slate-100 dark:bg-slate-700 text-slate-500"
      )}>
        {icon}
      </div>
      <div className="text-right">
        <div className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
        <div className={cn(
          "text-2xl md:text-3xl font-black font-serif transition-colors leading-tight",
          highlight ? "text-amber-700 dark:text-amber-400" : "text-slate-900 dark:text-white"
        )}>
          {value}
        </div>
      </div>
    </div>
    {subValue && (
      <div className="flex justify-end mt-2">
        <span className="px-3 py-1 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-[10px] md:text-xs font-black shadow-lg">
          {subValue}
        </span>
      </div>
    )}
  </div>
);

interface CourtSectionProps {
  title: string;
  icon: React.ReactNode;
  items: { label: string, value: string, highlight?: boolean, searchable?: boolean }[];
  color: string;
  onSearch: (value: string, label: string) => void;
}

function CourtSection({ title, icon, items, color, onSearch }: CourtSectionProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-lg hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between group">
      <div className="flex items-center gap-3 mb-5 flex-row-reverse border-b border-slate-100 pb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-amber-200 bg-amber-50 text-amber-700 shadow-sm shrink-0 transition-transform group-hover:rotate-6">
          {React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5" })}
        </div>
        <div className="text-right flex-1 min-w-0">
          <h3 className="text-base md:text-lg font-bold text-slate-950 leading-tight truncate">{title}</h3>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col text-right relative pr-4 group/item">
            <div className="absolute right-0 top-1 bottom-1 w-1 rounded-full bg-amber-500/20 group-hover/item:bg-amber-500 transition-all"></div>
            <span className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wide leading-none mb-1">{item.label}</span>
            <div className="flex items-center gap-2 justify-end group/val">
              {item.searchable && (
                <button 
                  onClick={() => onSearch(item.value, item.label)}
                  className="p-1.5 bg-slate-50 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg opacity-0 group-hover/val:opacity-100 transition-all shadow-sm"
                  title="تحديد الموقع على الخريطة"
                >
                  <Navigation className="w-3.5 h-3.5" />
                </button>
              )}
              <span className={cn(
                "transition-colors leading-tight font-bold",
                item.highlight ? "text-base md:text-lg text-amber-700" : "text-sm md:text-base text-slate-800",
                item.searchable && "cursor-pointer hover:text-amber-700 underline decoration-dotted decoration-amber-300"
              )}
              onClick={() => item.searchable && onSearch(item.value, item.label)}
              >
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
