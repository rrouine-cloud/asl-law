/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, BookOpen, ClipboardList, GraduationCap, Menu, X, ChevronLeft, Home as HomeIcon, Map as MapIcon, Scale, Bell, User, Search, Calendar, Clock, Sparkles, Facebook, Instagram, Linkedin, Twitter, MessageCircle, CheckSquare, Book, Gavel, Lightbulb, ArrowLeftRight, Languages, Headphones, Moon, Sun, Building2, Brain, Calculator, Car, ExternalLink, Settings, ShieldCheck, ShieldAlert, PenTool, Laptop, Layers } from 'lucide-react';
import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { isApiKeySet, setManualApiKey } from './lib/gemini';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import SplashScreen from './components/SplashScreen';
import PWAInstall from './components/PWAInstall';

// Eager load components for flawless mobile/PWA experience and instant transitions
import Home from './components/Home';
import CareersGuide from './components/CareersGuide';
import AboutContact from './components/AboutContact';
import MyLessons from './components/MyLessons';
import CaseLawSearch from './components/CaseLawSearch';
import LegalTextFinder from './components/LegalTextFinder';
import SmartLawyerAssistant from './components/SmartLawyerAssistant';
import ContractGenerator from './components/ContractGenerator';
import LegalCalculator from './components/LegalCalculator';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Logo from './components/Logo';
import AdalaMap from './components/AdalaMap';
import LegalTranslation from './components/LegalTranslation';
import LegalMethodology from './components/LegalMethodology';

interface NavItemType {
  name: string;
  href: string;
  icon: any;
  central?: boolean;
}

const navigation: NavItemType[] = [
  { name: 'الرئيسية', href: '/', icon: HomeIcon },
  { name: 'قوانينك', href: '/legal-finder', icon: Search },
  { name: 'المساعد الذكي', href: '/smart-assistant', icon: Sparkles },
  { name: 'الاختصاص القضائي', href: '/adala-map', icon: MapIcon },
  { name: 'ملخصات', href: '/lessons', icon: Book },
  { name: 'المنهجية القانونية', href: '/methodology', icon: Layers },
  { name: 'الاجتهادات', href: '/caselaw', icon: Gavel },
  { name: 'العقود', href: '/contract-generator', icon: FileText },
  { name: 'الحاسبة', href: '/legal-calculator', icon: Calculator },
  { name: 'الترجمة القانونية', href: '/legal-translation', icon: Languages },
];

const FEATURE_COLORS: Record<string, { activeText: string; dotBg: string }> = {
  '/': { activeText: 'text-[#0f2d59] dark:text-amber-400', dotBg: 'bg-[#0f2d59] dark:bg-amber-400' },
  '/legal-finder': { activeText: 'text-blue-600 dark:text-blue-400', dotBg: 'bg-blue-600' },
  '/legal-calculator': { activeText: 'text-emerald-600 dark:text-emerald-400', dotBg: 'bg-emerald-600' },
  '/caselaw': { activeText: 'text-amber-600 dark:text-amber-400', dotBg: 'bg-amber-600' },
  '/smart-assistant': { activeText: 'text-purple-600 dark:text-purple-400', dotBg: 'bg-purple-600' },
  '/adala-map': { activeText: 'text-rose-600 dark:text-rose-400', dotBg: 'bg-rose-600' },
  '/lessons': { activeText: 'text-indigo-600 dark:text-indigo-400', dotBg: 'bg-indigo-600' },
  '/methodology': { activeText: 'text-purple-600 dark:text-purple-400', dotBg: 'bg-purple-600' },
  '/contract-generator': { activeText: 'text-orange-600 dark:text-orange-400', dotBg: 'bg-orange-600' },
  '/legal-translation': { activeText: 'text-cyan-600 dark:text-cyan-400', dotBg: 'bg-cyan-600' },
};

function NavItem({ item, active, onClick }: { item: NavItemType, active: boolean, onClick?: () => void }) {
  const color = FEATURE_COLORS[item.href] || { activeText: 'text-teal-600 dark:text-teal-400', dotBg: 'bg-teal-600' };

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 px-3 py-2 transition-all duration-300 relative group flex-1",
        active 
          ? color.activeText 
          : "text-slate-400 hover:text-slate-800 dark:hover:text-white"
      )}
    >
      <div className="relative">
        <item.icon className={cn(
          "w-6 h-6 transition-transform duration-300",
          active ? "scale-110" : "group-hover:scale-110"
        )} />
        {active && (
          <motion.div 
            layoutId="activeDot"
            className={cn("absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full", color.dotBg)}
          />
        )}
      </div>
      <span className="text-[10px] font-black whitespace-nowrap text-center tracking-tight">{item.name}</span>
    </Link>
  );
}

// Theme toggle removed to maintain a permanent clean light theme

interface FeatureDetails {
  name: string;
  fullName: string;
  description: string;
  icon: any;
}

const FEATURE_REGISTRY: Record<string, FeatureDetails> = {
  '/': {
    name: 'الرئيسية',
    fullName: 'المنصة الرئيسية لـ مفتاح القانون',
    description: 'المنظومة القانونية المغربية الشاملة للباحثين والمهنيين والعموم',
    icon: HomeIcon,
  },
  '/adala-map': {
    name: 'الاختصاص القضائي',
    fullName: 'الخريطة القضائية والاختصاص',
    description: 'تحديد المحكمة المختصة محلياً ونوعياً لملفك بذكاء',
    icon: MapIcon,
  },
  '/legal-finder': {
    name: 'المرجع القانوني',
    fullName: 'المرجع القانوني المغربي الشامل',
    description: 'بحث فوري ودقيق في نصوص ومواد القوانين محلياً',
    icon: Search,
  },
  '/smart-assistant': {
    name: 'المساعد القانوني',
    fullName: 'المستشار القانوني الذكي AI',
    description: 'مستشارك التفاعلي للإجابة بذكاء على الاستفسارات وصياغة الطلبات',
    icon: Sparkles,
  },
  '/lessons': {
    name: 'ملخصات ومباريات',
    fullName: 'دروس وملخصات القانون - سلك الإجازة',
    description: 'مراجعة شاملة لدروس القانون وسلك الإجازة والتحضير للامتحانات والمهن القضائية',
    icon: Book,
  },
  '/methodology': {
    name: 'المنهجية القانونية',
    fullName: 'المنهجية القانونية ومناهج البحث العلمي',
    description: 'دروس المناهج، كتابة الموضوع، حل النوازل، الاستشارات، ومولد الإحالات الآلي',
    icon: Layers,
  },
  '/caselaw': {
    name: 'الاجتهادات القضائية',
    fullName: 'محرك البحث في الاجتهادات القضائية',
    description: 'استكشاف قرارات محكمة النقض المغربية والمحاكم بمختلف الغرف',
    icon: Gavel,
  },
  '/contract-generator': {
    name: 'صياغة العقود',
    fullName: 'المولد الذكي للعقود والنماذج',
    description: 'إنشاء وتوليد العقود والنماذج القانونية المغربية بمواصفات رسمية',
    icon: FileText,
  },
  '/legal-calculator': {
    name: 'الحاسبة القانونية',
    fullName: 'الحاسبة القانونية المغربية الذكية',
    description: 'حساب دقيق لتعويضات الشغل، حوادث السير، والمستحقات الأسرية',
    icon: Calculator,
  },
  '/careers': {
    name: 'دليل المهن القضائية',
    fullName: 'دليل المهن القانونية والقضائية',
    description: 'توجيه مهني متكامل واختبار الميول للمهنة المناسبة وآفاقها',
    icon: GraduationCap,
  },
  '/about': {
    name: 'عن التطبيق',
    fullName: 'تفاصيل منصة مفتاح القانون',
    description: 'تعرف على أهداف المنصة والقائمين عليها ومعلومات الاتصال المباشر',
    icon: Scale,
  },
  '/privacy': {
    name: 'سياسة الخصوصية',
    fullName: 'سياسة الخصوصية والبيانات',
    description: 'معايير الحفاظ على أمن وسرية وخصوصية بيانات المستخدمين بالكامل',
    icon: ShieldCheck,
  },
  '/terms': {
    name: 'شروط الاستخدام',
    fullName: 'شروط وبنود الخدمة والاستخدام',
    description: 'القواعد والبنود التي تحكم استخدام التطبيق ومختلف الخدمات التابعة',
    icon: ShieldAlert,
  },
  '/legal-translation': {
    name: 'الترجمة القانونية',
    fullName: 'أكاديمية الترجمة القانونية المقارنة',
    description: 'تمكين الطلبة من المصطلحات والترجمات الفرنسية للنصوص الرسمية والخطب السامية مع اختبارات تفاعلية وتقييم مستمر لمستواهم.',
    icon: Languages,
  },
};

function TopHeader() {
  return (
    <header className="hidden md:flex flex-wrap items-center justify-between mb-8 pb-5 border-b border-teal-500/10 relative z-10 gap-x-8 gap-y-4 no-print px-6 md:px-12 lg:px-16">
      <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-teal-500/20 to-transparent" />
      
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="flex lg:hidden items-center gap-3 shrink-0">
          <Logo size="md" showText={true} />
        </div>
      </div>
      
      {/* Actions Group removed for clean professional aesthetic */}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-20 py-12 border-t border-teal-500/10 px-6 md:px-12 lg:px-16 w-full">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <Logo size="sm" showText={true} />
        </div>
        
        <p className="text-xs text-[var(--muted)] text-center md:text-right">
          © {new Date().getFullYear()} مفتاح القانون Law Key · المنظومة القانونية الرقمية. جميع الحقوق محفوظة.
          <br />
          <span className="mt-2 block font-bold text-teal-600/80">تم اعداد هدا التطبيق من طرف RIDA ROUINE</span>
        </p>

        <div className="flex gap-6">
          <a 
            href="https://www.mahakim.ma/#/suivi/dossier-suivi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            تتبع ملفك القضائي (محاكم)
          </a>
          <Link to="/privacy" className="text-xs text-[var(--muted)] hover:text-teal-600 flex items-center">سياسة الخصوصية</Link>
          <Link to="/terms" className="text-xs text-[var(--muted)] hover:text-teal-600 flex items-center">شروط الاستخدام</Link>
        </div>
      </div>
    </footer>
  );
}

// Default secondary pinned features list (maximum 4 items around center Home)
const DEFAULT_SECONDARY_PINNED = ['/legal-finder', '/smart-assistant', '/legal-calculator', '/caselaw'];

function BottomNavBar({ locationPath }: { locationPath: string }) {
  const [customPinned, setCustomPinned] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pinned_bottom_features');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(h => h !== '/');
          if (filtered.length > 0) return filtered.slice(0, 4);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SECONDARY_PINNED;
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('pinned_bottom_features');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const filtered = parsed.filter(h => h !== '/');
            if (filtered.length > 0) {
              setCustomPinned(filtered.slice(0, 4));
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('pinned_features_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('pinned_features_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Always keep Home ('/') at the start/side of the bottom navigation bar
  const homeItem = navigation.find(item => item.href === '/') || navigation[0];
  const secondaryNavItems = navigation.filter(item => item.href !== '/' && customPinned.includes(item.href)).slice(0, 4);
  const activeSecondary = secondaryNavItems.length > 0 
    ? secondaryNavItems 
    : navigation.filter(item => item.href !== '/' && DEFAULT_SECONDARY_PINNED.includes(item.href)).slice(0, 4);

  // Home on the side, followed by user's chosen secondary features
  const displayItems = [homeItem, ...activeSecondary];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-800/60 px-2 py-1.5 pb-safe flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.06)] lg:hidden">
      <div className="flex items-center justify-around w-full max-w-md mx-auto">
        {displayItems.map((item) => (
          <NavItem 
            key={item.href} 
            item={item} 
            active={locationPath === item.href} 
          />
        ))}
      </div>
    </nav>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[var(--background)] flex font-sans selection:bg-[var(--accent)]/30 zellige-bg overflow-hidden" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 h-screen sticky top-0 z-50 shadow-xl shadow-slate-200/50">
        <div className="p-8 pb-4 flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-4 mb-8 shrink-0">
            <Logo size="lg" showText={true} />
          </div>

          <div className="space-y-1 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {navigation.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-4 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 group mb-1 min-h-[48px]",
                    active
                      ? "bg-teal-700 text-white shadow-lg shadow-teal-700/20"
                      : "text-slate-500 hover:bg-teal-50 dark:hover:bg-slate-800/50 hover:text-teal-600 dark:text-slate-400"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
                    active ? "text-white" : "text-slate-400 group-hover:text-teal-600"
                  )} />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="mt-auto p-8 pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest leading-relaxed">
            تم التطوير بواسطة<br/>
            <span className="text-teal-600">RIDA ROUINE</span>
          </p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Top Header (Fixed with Compact Feature Info) */}
        <header className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-2.5 flex flex-col gap-2 sticky top-0 z-50 shadow-sm no-print">
          <div className="flex items-center justify-between w-full">
            <Logo size="sm" showText={true} />
            <div className="flex items-center gap-2">
              {/* Theme toggle removed */}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative px-0 py-4 md:py-8 lg:py-12 pb-28 lg:pb-12">
          <div className="w-full relative">
            <TopHeader />
            <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-teal-500/10 border-t-teal-500 rounded-full animate-spin" />
                    <Scale className="w-6 h-6 text-teal-500 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <p className="text-teal-600 font-black text-xs uppercase tracking-widest animate-pulse">جاري التحميل...</p>
                </div>
              }>
                {children}
              </Suspense>
            </motion.div>
          </AnimatePresence>
          <Footer />
        </div>
      </main>

      {/* Bottom Navigation Bar (Mobile Only) - Dynamic Pinned Features */}
      <BottomNavBar locationPath={location.pathname} />
    </div>
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <SplashScreen key="splash" />
          ) : (
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lessons" element={<MyLessons />} />
                <Route path="/methodology" element={<LegalMethodology />} />
                <Route path="/careers" element={<CareersGuide />} />
                <Route path="/caselaw" element={<CaseLawSearch />} />
                <Route path="/legal-finder" element={<LegalTextFinder />} />
                <Route path="/legal-calculator" element={<LegalCalculator />} />
                <Route path="/contract-generator" element={<ContractGenerator />} />
                <Route path="/smart-assistant" element={<SmartLawyerAssistant />} />
                <Route path="/adala-map" element={<AdalaMap />} />
                <Route path="/accident-compensation" element={<LegalCalculator />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/about" element={<AboutContact />} />
                <Route path="/legal-translation" element={<LegalTranslation />} />
              </Routes>
              <PWAInstall />
            </Layout>
          )}
        </AnimatePresence>
      </ThemeProvider>
    </Router>
  );
}
