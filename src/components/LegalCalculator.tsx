import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { Calculator, Car, Users, Scale, Heart, Briefcase } from 'lucide-react';
import InheritanceCalculator from './InheritanceCalculator';
import AccidentCompensation from './AccidentCompensation';
import MaritalEntitlements from './MaritalEntitlements';
import LaborCompensation from './LaborCompensation';
import { cn } from '../lib/utils';

type CalculatorType = 'inheritance' | 'accident' | 'marital' | 'labor';

export default function LegalCalculator() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<CalculatorType>('inheritance');

  useEffect(() => {
    const state = location.state as { defaultTab?: CalculatorType };
    if (state?.defaultTab) {
      setActiveTab(state.defaultTab);
    }
  }, [location]);

  const tabs = [
    {
      id: 'inheritance',
      title: 'حساب المواريث',
      description: 'تقسيم التركة وفق مدونة الأسرة',
      icon: Users,
      color: 'amber'
    },
    {
      id: 'accident',
      title: 'تعويض حوادث السير',
      description: 'حساب التعويضات البدنية (ظهير 1984)',
      icon: Car,
      color: 'blue'
    },
    {
      id: 'marital',
      title: 'المستحقات الزوجية',
      description: 'تقدير مستحقات الطلاق والنفقة',
      icon: Heart,
      color: 'pink'
    },
    {
      id: 'labor',
      title: 'تعويضات الشغل',
      description: 'حساب تعويضات الفصل والضرر',
      icon: Briefcase,
      color: 'emerald'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-1 px-4" dir="rtl">
      <div className="pt-2"></div>

      {/* Tab Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 max-w-5xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CalculatorType)}
            className={cn(
              "flex-1 p-5 rounded-2xl border-2 transition-all text-right relative overflow-hidden group cursor-pointer",
              activeTab === tab.id 
                ? "bg-white dark:bg-slate-900 border-emerald-600 shadow-lg shadow-emerald-600/10" 
                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-800 hover:border-emerald-200"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors",
              activeTab === tab.id ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-800 text-slate-500 group-hover:text-emerald-600"
            )}>
              <tab.icon className="w-5 h-5" />
            </div>
            <h3 className={cn(
              "text-base font-extrabold mb-1",
              activeTab === tab.id ? "text-emerald-700 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"
            )}>
              {tab.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{tab.description}</p>
            
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute top-4 left-4"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              </motion.div>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'inheritance' ? (
              <InheritanceCalculator />
            ) : activeTab === 'accident' ? (
              <AccidentCompensation />
            ) : activeTab === 'marital' ? (
              <MaritalEntitlements />
            ) : (
              <LaborCompensation />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="mt-16 p-8 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center shrink-0">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2 text-center md:text-right">
            <h4 className="text-xl font-bold">دقة الحسابات القانونية</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              تعتمد هذه الحاسبة على أحدث النصوص القانونية المغربية، بما في ذلك مدونة الأسرة، مدونة الشغل، وظهير 1984 المتعلق بحوادث السير. يتم تحديث القواعد الحسابية بانتظام لمواكبة التعديلات التشريعية والاجتهادات القضائية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
