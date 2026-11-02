import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Star, X, Pin } from 'lucide-react';
import { cn } from '../lib/utils';
import {
  LawCodexIcon,
  LegalCalculatorIcon,
  CaselawGavelIcon,
  SmartAssistantIcon,
  JurisdictionMapIcon,
  AcademicSummariesIcon,
  LegalMethodologyIcon,
  LegalContractsIcon,
  LegalTranslationIcon
} from './ModernFeatureIcons';

const allQuotes = [
  "أنت حامي العدالة القادم، استمر في شغفك بالقانون.",
  "المحاماة رسالة، وأنت أهل لحملها بكل أمانة.",
  "طريق القانون طويل، لكن خطوتك اليوم هي بداية التغيير.",
  "كن عادلاً في حكمك، قوياً في دفاعك، صادقاً في قولك.",
  "القانون ليس مجرد نصوص، بل هو روح تسعى لإحقاق الحق.",
  "أنتِ صوت الحق في المستقبل، كوني فخورة بمساركِ القانوني.",
  "ذكاؤكِ وحكمتكِ هما سلاحكِ الأقوى في عالم القضاء.",
  "المستقبل ينتظر بصمتكِ القانونية المتميزة.",
  "كوني ملهمة في دفاعكِ، رائدة في فكركِ، عادلة في قراراتكِ.",
  "المرأة في القانون قوة لا يستهان بها، وأنتِ خير مثال."
];

// Core 9 features with bespoke modern icons and crisp typographic subtitles
const coreFeatures = [
  {
    id: 'laws',
    name: 'قوانينك',
    subtitle: 'نصوص تشريعية محيّنة',
    href: '/legal-finder',
    IconComponent: LawCodexIcon,
    hoverGlow: 'group-hover:drop-shadow-[0_8px_16px_rgba(37,99,235,0.3)]'
  },
  {
    id: 'calculator',
    name: 'الحاسبة القانونية',
    subtitle: 'حساب التعويضات والأتعاب',
    href: '/legal-calculator',
    IconComponent: LegalCalculatorIcon,
    hoverGlow: 'group-hover:drop-shadow-[0_8px_16px_rgba(5,150,105,0.3)]'
  },
  {
    id: 'caselaw',
    name: 'الاجتهاد القضائي',
    subtitle: 'قرارات محكمة النقض',
    href: '/caselaw',
    IconComponent: CaselawGavelIcon,
    hoverGlow: 'group-hover:drop-shadow-[0_8px_16px_rgba(217,119,6,0.3)]'
  },
  {
    id: 'assistant',
    name: 'المساعد الذكي',
    subtitle: 'استشارات وصياغة فورية',
    href: '/smart-assistant',
    IconComponent: SmartAssistantIcon,
    hoverGlow: 'group-hover:drop-shadow-[0_8px_16px_rgba(147,51,234,0.3)]'
  },
  {
    id: 'jurisdiction',
    name: 'الاختصاص القضائي',
    subtitle: 'دوائر ومحاكم المملكة',
    href: '/adala-map',
    IconComponent: JurisdictionMapIcon,
    hoverGlow: 'group-hover:drop-shadow-[0_8px_16px_rgba(225,29,72,0.3)]'
  },
  {
    id: 'summaries',
    name: 'ملخصات الإجازة',
    subtitle: 'محاضرات ومحاور S1-S6',
    href: '/lessons',
    IconComponent: AcademicSummariesIcon,
    hoverGlow: 'group-hover:drop-shadow-[0_8px_16px_rgba(79,70,229,0.3)]'
  },
  {
    id: 'methodology',
    name: 'المنهجية القانونية',
    subtitle: 'تحليل النوازل والقرارات',
    href: '/methodology',
    IconComponent: LegalMethodologyIcon,
    hoverGlow: 'group-hover:drop-shadow-[0_8px_16px_rgba(15,45,89,0.35)]'
  },
  {
    id: 'contracts',
    name: 'العقود',
    subtitle: 'نماذج وصياغة محررات',
    href: '/contract-generator',
    IconComponent: LegalContractsIcon,
    hoverGlow: 'group-hover:drop-shadow-[0_8px_16px_rgba(234,88,12,0.3)]'
  },
  {
    id: 'translation',
    name: 'الترجمة القانونية',
    subtitle: 'مصطلحات عربي - فرنسي',
    href: '/legal-translation',
    IconComponent: LegalTranslationIcon,
    hoverGlow: 'group-hover:drop-shadow-[0_8px_16px_rgba(13,148,136,0.3)]'
  }
];

const DEFAULT_PINNED_HREFS = ['/legal-finder', '/smart-assistant', '/legal-calculator', '/caselaw'];

export default function Home() {
  const [quote, setQuote] = useState("");
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [pinnedHrefs, setPinnedHrefs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pinned_bottom_features');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((h: string) => h !== '/');
          if (filtered.length > 0) return filtered.slice(0, 4);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PINNED_HREFS;
  });

  useEffect(() => {
    const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    setQuote(randomQuote);
  }, []);

  const togglePinFeature = (href: string) => {
    let updated: string[];
    if (pinnedHrefs.includes(href)) {
      if (pinnedHrefs.length <= 1) return;
      updated = pinnedHrefs.filter(h => h !== href);
    } else {
      if (pinnedHrefs.length >= 4) {
        updated = [...pinnedHrefs.slice(1, 4), href];
      } else {
        updated = [...pinnedHrefs, href];
      }
    }
    setPinnedHrefs(updated);
    try {
      localStorage.setItem('pinned_bottom_features', JSON.stringify(updated.slice(0, 4)));
      window.dispatchEvent(new Event('pinned_features_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 pb-20 text-right font-sans">

      {/* Main Feature Grid - Preserving the exact 3x3 layout with modern, high-end vector icons and glass-card elevation */}
      <section className="max-w-4xl mx-auto px-4 pt-2">
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
          {coreFeatures.map((feat) => {
            const Icon = feat.IconComponent;

            return (
              <Link
                key={feat.id}
                to={feat.href}
                className="flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.08)] hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer text-center space-y-2.5 active:scale-95"
              >
                {/* Modern Vector Icon Artwork with dynamic glow on hover */}
                <div className={cn(
                  "w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                  feat.hoverGlow
                )}>
                  <Icon className="w-full h-full drop-shadow-sm" />
                </div>

                {/* Feature Name & Smart Subtitle */}
                <div className="space-y-0.5">
                  <span className="block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-[#0f2d59] dark:group-hover:text-amber-400 transition-colors leading-tight">
                    {feat.name}
                  </span>
                  <span className="hidden sm:block text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors font-medium">
                    {feat.subtitle}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Favorites Action Button Bar */}
      <section className="max-w-2xl mx-auto px-4 text-center pt-2">
        <button
          onClick={() => setShowFavoritesModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/90 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full font-bold text-slate-700 dark:text-slate-200 text-xs transition-all active:scale-95 cursor-pointer shadow-xs hover:shadow-sm"
        >
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
          <span>تخصيص المفضلة والتثبيت بالقائمة السفلية</span>
        </button>
      </section>

      {/* Inspirational Quote Section */}
      {quote && (
        <section className="max-w-xl mx-auto px-6 text-center pt-2">
          <p className="text-slate-500 dark:text-slate-400 italic text-xs md:text-sm font-medium leading-relaxed font-serif">
            "{quote}"
          </p>
        </section>
      )}

      {/* Favorites & Navigation Pinning Modal */}
      <AnimatePresence>
        {showFavoritesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowFavoritesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl text-right space-y-4 my-8"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-base">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <h3>تخصيص القائمة السفلية والمفضلة</h3>
                </div>
                <button 
                  onClick={() => setShowFavoritesModal(false)}
                  className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                حدد الخصائص التي تريد تثبيتها في الشريط السفلي للتطبيق (حد أقصى 4 خصائص) للوصول إليها بنقرة واحدة:
              </p>

              <div className="space-y-2 py-2 max-h-[60vh] overflow-y-auto pl-1">
                {coreFeatures.map((f) => {
                  const Icon = f.IconComponent;
                  const isPinned = pinnedHrefs.includes(f.href);

                  return (
                    <div
                      key={f.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0">
                          <Icon className="w-full h-full" />
                        </div>
                        <div>
                          <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 block">{f.name}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">{f.subtitle}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={f.href}
                          onClick={() => setShowFavoritesModal(false)}
                          className="text-[11px] font-bold text-[#0f766e] hover:underline px-2 py-1"
                        >
                          فتح
                        </Link>
                        <button
                          onClick={() => togglePinFeature(f.href)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer",
                            isPinned
                              ? "bg-[#0f2d59] text-amber-400 shadow-2xs"
                              : "bg-white dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600 hover:text-slate-800"
                          )}
                        >
                          <Pin className={cn("w-3.5 h-3.5", isPinned && "fill-amber-400")} />
                          <span>{isPinned ? "مُثبتة بالسفلي" : "تثبيت"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setShowFavoritesModal(false)}
                className="w-full py-3 bg-[#0f2d59] text-white hover:bg-[#0a1f3f] rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md"
              >
                حفظ وإغلاق
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
