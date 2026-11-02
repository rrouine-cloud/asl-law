/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Newspaper, ChevronLeft, ExternalLink, RefreshCw } from 'lucide-react';

interface NewsItem {
  title: string;
  url: string;
}

const LOCAL_NEWS: NewsItem[] = [
  {
    title: "مستجدات مسودة مشروع قانون المسطرة المدنية الجديد بالمغرب لعام 2024",
    url: "#"
  },
  {
    title: "وزارة العدل المغربية تعلن عن رقمنة جديدة للمحاكم وتحديث المنصات الإلكترونية",
    url: "#"
  },
  {
    title: "صدور مقتضيات جديدة لتنظيم المهن القانونية والقضائية بالجريدة الرسمية",
    url: "#"
  },
  {
    title: "مقررات جديدة لمحكمة النقض تكرس الأمن القضائي وحماية حقوق المستهلك",
    url: "#"
  },
  {
    title: "ندوات علمية حول رقمنة العدالة وتأثير الذكاء الاصطناعي على المهن القانونية",
    url: "#"
  }
];

export default function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>(LOCAL_NEWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (news.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [news]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 animate-pulse">
        <Newspaper className="w-3 h-3 text-amber-500" />
        <div className="w-24 h-2 bg-white/20 rounded" />
      </div>
    );
  }

  if (news.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-hidden max-w-[150px] sm:max-w-xs md:max-w-md lg:max-w-lg">
      <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full border border-amber-200/50 dark:border-amber-800/50 flex-shrink-0">
        <Newspaper className="w-3 h-3" />
        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider">الأخبار</span>
      </div>

      <div className="relative h-5 flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.a
            key={currentIndex}
            href={news[currentIndex].url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center group cursor-pointer"
          >
            <p className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 truncate hover:text-amber-600 dark:hover:text-amber-500 transition-colors flex-1 text-right">
              {news[currentIndex].title}
            </p>
            <ExternalLink className="w-2.5 h-2.5 ml-1 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.a>
        </AnimatePresence>
      </div>
    </div>
  );
}
