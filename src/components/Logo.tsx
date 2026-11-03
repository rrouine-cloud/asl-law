import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  imageClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

/**
 * شعار "مفتاح القانون" - تصميم ذكي وقانوني متناسق بلونين فقط:
 * 1. الكحلي الملكي العميق (Royal Deep Navy): #0F2D59
 * 2. الذهب الدافئ النبيل (Noble Warm Gold): #F59E0B
 * يدمج بين رأس المفتاح العريق وميزان العدالة المتوازن وعمود القانون ومسننات المحراب التشريعي.
 */
export function LawKeyEmblem({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="شعار مفتاح القانون"
    >
      {/* 1. رأس المفتاح (Bow) - حلقة هندسية دقيقة بلون الكحلي الملكي */}
      <circle 
        cx="32" 
        cy="21" 
        r="14" 
        stroke="#0F2D59" 
        strokeWidth="2.75" 
      />

      {/* 2. ميزان العدالة الذكي داخل رأس المفتاح - بلون الذهب النبيل (#F59E0B) */}
      {/* قمة الميزان (Apex) */}
      <polygon 
        points="32,11.5 34.5,14.5 32,17.5 29.5,14.5" 
        fill="#F59E0B" 
      />

      {/* عارضة الميزان الأفقية المتوازنة */}
      <line 
        x1="22.5" 
        y1="17.5" 
        x2="41.5" 
        y2="17.5" 
        stroke="#F59E0B" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
      />

      {/* كفة الميزان اليمنى وحبال التعليق */}
      <line x1="24.5" y1="17.5" x2="23" y2="23" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" />
      <line x1="28.5" y1="17.5" x2="30" y2="23" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" />
      <path 
        d="M22 23C22 26 24 27.5 26.5 27.5C29 27.5 31 26 31 23H22Z" 
        fill="#F59E0B" 
      />

      {/* كفة الميزان اليسرى وحبال التعليق */}
      <line x1="35.5" y1="17.5" x2="34" y2="23" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" />
      <line x1="39.5" y1="17.5" x2="41" y2="23" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" />
      <path 
        d="M33 23C33 26 35 27.5 37.5 27.5C40 27.5 42 26 42 23H33Z" 
        fill="#F59E0B" 
      />

      {/* نقطة الارتكاز المركزية للميزان والمفتاح */}
      <circle cx="32" cy="21" r="1.5" fill="#0F2D59" />

      {/* 3. الطوق الزخرفي للمفتاح (Collar Rings) - ذهبي */}
      <rect x="27.5" y="33" width="9" height="2.5" rx="1.25" fill="#F59E0B" />
      <rect x="29" y="37" width="6" height="1.5" rx="0.75" fill="#F59E0B" />

      {/* 4. ساق المفتاح (Pillar/Stem) - عمود العدالة بلون الكحلي الملكي */}
      <path 
        d="M30.25 35V56.5C30.25 57.5 31.1 58.25 32 58.25C32.9 58.25 33.75 57.5 33.75 56.5V35H30.25Z" 
        fill="#0F2D59" 
      />

      {/* 5. مسننات المفتاح (Bit/Teeth) - تشكيل تشريعي محكم يمثل بنود القانون ومحراب العدالة */}
      <path 
        d="M33.75 42H43.5C44.3 42 45 42.7 45 43.5V45C45 45.8 44.3 46.5 43.5 46.5H38V48H44.5C45.3 48 46 48.7 46 49.5V51C46 51.8 45.3 52.5 44.5 52.5H33.75V42Z" 
        fill="#0F2D59" 
      />

      {/* تطعيم ذهبي ذكي داخل مسننات المفتاح */}
      <rect x="37" y="44" width="4" height="1.5" rx="0.5" fill="#F59E0B" />
      <rect x="37" y="50" width="5" height="1.5" rx="0.5" fill="#F59E0B" />
    </svg>
  );
}

// التوافق الرجعي مع التسمية السابقة
export const QistasEmblem = LawKeyEmblem;

export default function Logo({ 
  className, 
  size = 'md',
  showText = false 
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-20 h-20 rounded-3xl'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl'
  };

  const subtextSizes = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[10px]',
    xl: 'text-xs'
  };

  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      {/* حاوية الشعار بلوني الكحلي الملكي والذهب فقط */}
      <div className={cn(
        "relative flex items-center justify-center bg-white border border-[#0F2D59]/15 shadow-sm p-1.5 shrink-0 group transition-all duration-300 hover:shadow-md hover:border-[#F59E0B]/50 hover:scale-105",
        sizeClasses[size]
      )}>
        <LawKeyEmblem className="w-full h-full drop-shadow-2xs transition-transform duration-300 group-hover:scale-105" />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col text-right">
          <h1 className={cn(
            "font-serif font-black text-[#0F2D59] dark:text-slate-100 tracking-tight leading-none mb-0.5",
            textSizes[size]
          )}>
            مفتاح القانون
          </h1>
          <span className={cn(
            "font-sans font-bold text-[#D97706] dark:text-[#F59E0B] tracking-wider leading-none",
            subtextSizes[size]
          )}>
            LAW KEY · المنصة القانونية
          </span>
        </div>
      )}
    </div>
  );
}
