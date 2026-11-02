import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Info, ChevronRight, ChevronLeft, RotateCcw, Scale, BookOpen, Gavel, DollarSign, Users, Heart, PieChart, Download } from 'lucide-react';
import { calculateInheritance, InheritanceInput, HeirResult } from '../lib/inheritanceLogic';
import { cn } from '../lib/utils';

const steps = [
  { id: 'basic', title: 'معلومات التركة', icon: DollarSign },
  { id: 'parents', title: 'الوالدان والأجداد', icon: Heart },
  { id: 'family', title: 'الزوج والأبناء', icon: Users },
  { id: 'siblings', title: 'الإخوة والأخوات', icon: BookOpen },
];

export default function InheritanceCalculator() {
  const [currentStep, setCurrentStep] = useState(() => Number(localStorage.getItem('inheritance_step')) || 0);
  const [results, setResults] = useState<{
    results: HeirResult[];
    finalEstate: number;
    actualWill: number;
    netAfterDebts: number;
  } | null>(() => {
    const saved = localStorage.getItem('inheritance_results');
    return saved ? JSON.parse(saved) : null;
  });

  const [input, setInput] = useState<InheritanceInput>(() => {
    const saved = localStorage.getItem('inheritance_input');
    return saved ? JSON.parse(saved) : {
      estateValue: 0,
      debts: 0,
      will: 0,
      deceasedGender: 'male',
      isFatherAlive: true,
      isMotherAlive: true,
      grandfather: false,
      paternalGrandmother: false,
      maternalGrandmother: false,
      isMarried: false,
      sonsCount: 0,
      daughtersCount: 0,
      wivesCount: 0,
      husbandPresent: false,
      fullBrothersCount: 0,
      paternalBrothersCount: 0,
      maternalSiblingsCount: 0,
      fullSistersCount: 0,
      paternalSistersCount: 0,
    };
  });

  const [currency, setCurrency] = useState<'MAD' | 'RYAL'>(() => (localStorage.getItem('inheritance_currency') as 'MAD' | 'RYAL') || 'MAD');

  useEffect(() => {
    localStorage.setItem('inheritance_step', currentStep.toString());
    localStorage.setItem('inheritance_results', JSON.stringify(results));
    localStorage.setItem('inheritance_input', JSON.stringify(input));
    localStorage.setItem('inheritance_currency', currency);
  }, [currentStep, results, input, currency]);

  const convertToMAD = (val: number) => currency === 'RYAL' ? val / 20 : val;
  const convertFromMAD = (val: number) => currency === 'RYAL' ? val * 20 : val;

  const formatCurrency = (val: number, type: 'MAD' | 'RYAL' | 'FRANK' = currency === 'RYAL' ? 'RYAL' : 'MAD') => {
    const roundedMAD = Math.round(val);
    
    if (type === 'RYAL') {
      const ryals = roundedMAD * 20;
      if (roundedMAD >= 10000) {
        const millions = roundedMAD / 10000;
        return `${millions.toLocaleString(undefined, { maximumFractionDigits: 2 })} مليون سنتيم`;
      }
      if (roundedMAD >= 50 && roundedMAD <= 100) {
        // "11 ميه" logic: every 5 MAD is 100 Ryal (1 "Miya")
        // 50 MAD = 1000 Ryal (10 Miya)
        // 55 MAD = 1100 Ryal (11 Miya)
        const miya = roundedMAD * 2 / 10; // 50 * 2 / 10 = 10
        return `${miya} مية (ريال)`;
      }
      return `${ryals.toLocaleString()} ريال`;
    }
    if (type === 'FRANK') {
      return `${(roundedMAD * 100).toLocaleString()} فرنك (سنتيم)`;
    }
    return `${roundedMAD.toLocaleString()} د.م`;
  };

  const handleInputChange = (field: keyof InheritanceInput, value: any) => {
    if (field === 'estateValue' || field === 'debts' || field === 'will') {
      const madValue = currency === 'RYAL' ? value / 20 : value;
      setInput(prev => ({ ...prev, [field]: madValue }));
    } else {
      setInput(prev => ({ ...prev, [field]: value }));
    }
  };

  const getInputValue = (field: keyof InheritanceInput) => {
    const val = input[field] as number;
    return currency === 'RYAL' ? Math.round(val * 20) : Math.round(val);
  };

  const handleCalculate = () => {
    const calculation = calculateInheritance(input);
    setResults(calculation);
  };

  const resetCalculator = () => {
    setResults(null);
    setCurrentStep(0);
    setInput({
      estateValue: 0,
      debts: 0,
      will: 0,
      deceasedGender: 'male',
      isFatherAlive: true,
      isMotherAlive: true,
      grandfather: false,
      paternalGrandmother: false,
      maternalGrandmother: false,
      isMarried: false,
      sonsCount: 0,
      daughtersCount: 0,
      wivesCount: 0,
      husbandPresent: false,
      fullBrothersCount: 0,
      paternalBrothersCount: 0,
      maternalSiblingsCount: 0,
      fullSistersCount: 0,
      paternalSistersCount: 0,
    });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="max-w-4xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="mb-6 md:mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-xl mb-4">
          <Calculator className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[var(--primary)] mb-2">حاسبة المواريث الشرعية</h1>
        <p className="text-sm md:text-base text-[var(--muted)] max-w-lg mx-auto">
          حساب دقيق للمواريث وفق مدونة الأسرة المغربية وأحكام الشريعة الإسلامية، مع بيان السند القانوني والشرعي لكل وارث.
        </p>
      </div>

      {!results ? (
        <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-xl overflow-hidden">
          {/* Progress Bar */}
          <div className="flex border-b border-[var(--border)]">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex-1 py-4 px-2 text-center border-b-2 transition-all duration-500 flex flex-col items-center gap-1",
                  index === currentStep ? "border-amber-500 text-amber-600 bg-amber-50/50" : "border-transparent text-[var(--muted)]"
                )}
              >
                <step.icon className={cn("w-5 h-5", index === currentStep ? "text-amber-600" : "text-[var(--muted)]")} />
                <span className="text-xs font-bold hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>

          <div className="p-4 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {currentStep === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--primary)]">جنس المتوفى</label>
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleInputChange('deceasedGender', 'male')}
                          className={cn(
                            "flex-1 py-3 rounded-xl border-2 transition-all font-bold",
                            input.deceasedGender === 'male' ? "border-amber-500 bg-amber-50 text-amber-700" : "border-[var(--border)] text-[var(--muted)]"
                          )}
                        >
                          ذكر
                        </button>
                        <button
                          onClick={() => handleInputChange('deceasedGender', 'female')}
                          className={cn(
                            "flex-1 py-3 rounded-xl border-2 transition-all font-bold",
                            input.deceasedGender === 'female' ? "border-amber-500 bg-amber-50 text-amber-700" : "border-[var(--border)] text-[var(--muted)]"
                          )}
                        >
                          أنثى
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-[var(--primary)]">وحدة الحساب</label>
                      <div className="flex p-1 bg-[var(--secondary)] rounded-xl border border-[var(--border)]">
                        <button
                          onClick={() => setCurrency('MAD')}
                          className={cn(
                            "flex-1 py-2 rounded-lg font-bold transition-all",
                            currency === 'MAD' ? "bg-white shadow-sm text-amber-600" : "text-[var(--muted)]"
                          )}
                        >
                          الدرهم المغربي
                        </button>
                        <button
                          onClick={() => setCurrency('RYAL')}
                          className={cn(
                            "flex-1 py-2 rounded-lg font-bold transition-all",
                            currency === 'RYAL' ? "bg-white shadow-sm text-amber-600" : "text-[var(--muted)]"
                          )}
                        >
                          الريال المغربي
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--primary)]">
                        مقدار التركة ({currency === 'MAD' ? 'بالدرهم' : 'بالريال'})
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={getInputValue('estateValue') || ''}
                          onChange={(e) => handleInputChange('estateValue', Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold"
                          placeholder="0"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted)] font-bold">
                          {formatCurrency(input.estateValue, 'FRANK')}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--primary)]">الديون</label>
                      <input
                        type="number"
                        value={getInputValue('debts') || ''}
                        onChange={(e) => handleInputChange('debts', Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--primary)]">الوصية</label>
                      <input
                        type="number"
                        value={getInputValue('will') || ''}
                        onChange={(e) => handleInputChange('will', Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold"
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--secondary)] border border-[var(--border)]">
                          <span className="font-bold text-[var(--primary)]">هل الأب حي؟</span>
                          <button
                            onClick={() => handleInputChange('isFatherAlive', !input.isFatherAlive)}
                            className={cn(
                              "px-6 py-2 rounded-lg font-bold transition-all",
                              input.isFatherAlive ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                            )}
                          >
                            {input.isFatherAlive ? 'نعم' : 'لا'}
                          </button>
                        </div>
                        {!input.isFatherAlive && (
                          <div className="p-4 rounded-2xl border border-dashed border-amber-200 bg-amber-50/30 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-amber-800">الجد (وإن علا)</span>
                              <input
                                type="checkbox"
                                checked={input.grandfather}
                                onChange={(e) => handleInputChange('grandfather', e.target.checked)}
                                className="w-5 h-5 accent-amber-600"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-amber-800">الجدة لأب (وإن علت)</span>
                              <input
                                type="checkbox"
                                checked={input.paternalGrandmother}
                                onChange={(e) => handleInputChange('paternalGrandmother', e.target.checked)}
                                className="w-5 h-5 accent-amber-600"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--secondary)] border border-[var(--border)]">
                          <span className="font-bold text-[var(--primary)]">هل الأم حية؟</span>
                          <button
                            onClick={() => handleInputChange('isMotherAlive', !input.isMotherAlive)}
                            className={cn(
                              "px-6 py-2 rounded-lg font-bold transition-all",
                              input.isMotherAlive ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                            )}
                          >
                            {input.isMotherAlive ? 'نعم' : 'لا'}
                          </button>
                        </div>
                        {!input.isMotherAlive && (
                          <div className="p-4 rounded-2xl border border-dashed border-amber-200 bg-amber-50/30">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-amber-800">الجدة لأم (وإن علت)</span>
                              <input
                                type="checkbox"
                                checked={input.maternalGrandmother}
                                onChange={(e) => handleInputChange('maternalGrandmother', e.target.checked)}
                                className="w-5 h-5 accent-amber-600"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--secondary)] border border-[var(--border)]">
                      <span className="font-bold text-[var(--primary)]">هل المتوفى متزوج؟</span>
                      <button
                        onClick={() => handleInputChange('isMarried', !input.isMarried)}
                        className={cn(
                          "px-6 py-2 rounded-lg font-bold transition-all",
                          input.isMarried ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                        )}
                      >
                        {input.isMarried ? 'نعم' : 'لا'}
                      </button>
                    </div>

                    {input.isMarried && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border border-amber-100 bg-amber-50/20"
                      >
                        {input.deceasedGender === 'male' ? (
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-amber-800">عدد الزوجات</label>
                            <input
                              type="number"
                              min="0"
                              max="4"
                              value={input.wivesCount}
                              onChange={(e) => handleInputChange('wivesCount', Number(e.target.value))}
                              className="w-full px-4 py-2 rounded-xl border border-amber-200 outline-none focus:ring-2 focus:ring-amber-500"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm font-bold text-amber-800">الزوج حي؟</span>
                            <input
                              type="checkbox"
                              checked={input.husbandPresent}
                              onChange={(e) => handleInputChange('husbandPresent', e.target.checked)}
                              className="w-5 h-5 accent-amber-600"
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-amber-800">عدد الأبناء (ذكور)</label>
                          <input
                            type="number"
                            min="0"
                            value={input.sonsCount}
                            onChange={(e) => handleInputChange('sonsCount', Number(e.target.value))}
                            className="w-full px-4 py-2 rounded-xl border border-amber-200 outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-amber-800">عدد البنات (إناث)</label>
                          <input
                            type="number"
                            min="0"
                            value={input.daughtersCount}
                            onChange={(e) => handleInputChange('daughtersCount', Number(e.target.value))}
                            className="w-full px-4 py-2 rounded-xl border border-amber-200 outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--primary)]">عدد الإخوة الأشقاء</label>
                      <input
                        type="number"
                        min="0"
                        value={input.fullBrothersCount}
                        onChange={(e) => handleInputChange('fullBrothersCount', Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--primary)]">عدد الأخوات الشقيقات</label>
                      <input
                        type="number"
                        min="0"
                        value={input.fullSistersCount}
                        onChange={(e) => handleInputChange('fullSistersCount', Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--primary)]">عدد الإخوة لأب</label>
                      <input
                        type="number"
                        min="0"
                        value={input.paternalBrothersCount}
                        onChange={(e) => handleInputChange('paternalBrothersCount', Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[var(--primary)]">عدد الأخوات لأب</label>
                      <input
                        type="number"
                        min="0"
                        value={input.paternalSistersCount}
                        onChange={(e) => handleInputChange('paternalSistersCount', Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-[var(--primary)]">عدد الإخوة لأم (ذكور وإناث)</label>
                      <input
                        type="number"
                        min="0"
                        value={input.maternalSiblingsCount}
                        onChange={(e) => handleInputChange('maternalSiblingsCount', Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-12 flex items-center justify-between pt-8 border-t border-[var(--border)]">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                  currentStep === 0 ? "opacity-0 pointer-events-none" : "text-[var(--muted)] hover:bg-[var(--secondary)]"
                )}
              >
                <ChevronRight className="w-5 h-5" />
                السابق
              </button>

              {currentStep === steps.length - 1 ? (
                <button
                  onClick={handleCalculate}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold shadow-xl shadow-amber-500/20 hover:scale-105 transition-all"
                >
                  <Calculator className="w-5 h-5" />
                  احسب الميراث
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[var(--primary)] text-white font-bold hover:bg-[var(--primary)]/90 transition-all"
                >
                  التالي
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 bg-white p-4 rounded-3xl"
          id="inheritance-result-card"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white border border-amber-100 shadow-sm">
              <p className="text-[10px] md:text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">إجمالي التركة</p>
              <p className="text-sm md:text-xl font-bold text-slate-900">{formatCurrency((results as any).estateValue)}</p>
            </div>
            <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white border border-amber-100 shadow-sm">
              <p className="text-[10px] md:text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">التركة الصافية</p>
              <p className="text-sm md:text-xl font-bold text-slate-900">{formatCurrency(results.netAfterDebts)}</p>
            </div>
            <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white border border-amber-100 shadow-sm">
              <p className="text-[10px] md:text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">الوصية المنفذة</p>
              <p className="text-sm md:text-xl font-bold text-slate-900">{formatCurrency(results.actualWill)}</p>
            </div>
            <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-amber-600 text-white shadow-lg shadow-amber-600/20">
              <p className="text-[10px] md:text-xs font-bold text-amber-100 uppercase tracking-wider mb-1">المبلغ القابل للتوزيع</p>
              <p className="text-sm md:text-xl font-bold">{formatCurrency(results.finalEstate)}</p>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-[var(--border)] bg-[var(--secondary)]/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <h3 className="font-serif font-bold text-lg md:text-xl text-[var(--primary)] flex items-center gap-2">
                <Scale className="w-5 h-5 md:w-6 h-6 text-amber-600" />
                تفاصيل توزيع الحصص
              </h3>
              <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
                <button
                  onClick={resetCalculator}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-50 px-3 md:px-4 py-2 rounded-xl transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  إعادة الحساب
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-[var(--secondary)]/30 text-[var(--muted)] text-sm">
                    <th className="px-6 py-4 font-bold">الوارث</th>
                    <th className="px-6 py-4 font-bold">النصيب</th>
                    <th className="px-6 py-4 font-bold">النسبة</th>
                    <th className="px-6 py-4 font-bold">المبلغ</th>
                    <th className="px-6 py-4 font-bold">السند القانوني</th>
                    <th className="px-6 py-4 font-bold">السند الشرعي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {results.results.map((heir, index) => (
                    <motion.tr
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={index}
                      className="hover:bg-[var(--primary)]/5 transition-colors group"
                    >
                      <td className="px-4 md:px-6 py-4 md:py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm md:text-base text-[var(--primary)]">{heir.name}</span>
                          {heir.note && (
                            <span className="text-[9px] md:text-[10px] text-amber-600 font-bold mt-1 bg-amber-50 px-2 py-0.5 rounded-full inline-block w-fit">
                              {heir.note}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-6">
                        <span className="inline-flex items-center justify-center px-2 md:px-3 py-1 rounded-lg bg-amber-100 text-amber-800 font-mono font-bold text-xs md:text-sm">
                          {heir.shareFraction}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-6">
                        <div className="flex items-center gap-2">
                          <div className="hidden sm:flex w-8 h-8 rounded-full bg-amber-50 items-center justify-center text-amber-600">
                            <PieChart className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs md:text-sm font-bold text-[var(--primary)]">
                              {(heir.percentage || 0).toFixed(1)}%
                            </span>
                            <div className="w-12 md:w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${heir.percentage}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-amber-500"
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-6 font-bold text-sm md:text-base text-[var(--primary)]">
                        <div className="flex flex-col">
                          <span>{formatCurrency(heir.amount)}</span>
                          <span className="text-[9px] md:text-[10px] text-[var(--muted)] font-normal">
                            {formatCurrency(heir.amount, currency === 'RYAL' ? 'MAD' : 'RYAL')}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-6">
                        <div className="flex items-center gap-2 text-[10px] md:text-xs text-[var(--muted)] group-hover:text-amber-700 transition-colors">
                          <Gavel className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{heir.legalBasis}</span>
                          <span className="sm:hidden">{heir.legalBasis.split(' ')[1]}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-6">
                        <div className="flex items-start gap-2 text-[10px] md:text-xs text-[var(--muted)] max-w-[120px] md:max-w-xs group-hover:text-amber-700 transition-colors">
                          <BookOpen className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <div className="flex flex-col gap-1">
                            <span className="italic line-clamp-2 sm:line-clamp-none">"{heir.religiousBasis}"</span>
                            <span className="text-[8px] md:text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                              {heir.religiousSource}
                            </span>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex gap-4">
            <Info className="w-6 h-6 text-amber-600 shrink-0" />
            <div className="text-sm text-amber-800 leading-relaxed">
              <p className="font-bold mb-1">تنبيه هام:</p>
              هذه الحاسبة تقدم نتائج تقديرية بناءً على القواعد العامة لمدونة الأسرة المغربية. في الحالات المعقدة أو عند وجود نزاع، يرجى استشارة عدول أو محامٍ متخصص أو التوجه للمحكمة المختصة (قسم قضاء الأسرة) للحصول على فريضة رسمية.
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
