import React, { useState } from 'react';
import { Scale } from 'lucide-react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  imageClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function Logo({ 
  className, 
  imageClassName,
  size = 'md',
  showText = false 
}: LogoProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-7 h-7 rounded-lg text-xs',
    md: 'w-10 h-10 rounded-xl text-sm',
    lg: 'w-12 h-12 rounded-2xl text-base',
    xl: 'w-24 h-24 rounded-3xl text-2xl'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-12 h-12'
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "relative flex items-center justify-center shadow-md border border-teal-500/20 bg-gradient-to-br from-teal-800 via-emerald-700 to-slate-900 text-amber-300 font-bold overflow-hidden shrink-0 group transition-all duration-300 hover:shadow-teal-500/20",
        sizeClasses[size]
      )}>
        {!imgError ? (
          <img 
            src="/icon.png" 
            alt="مفتاح القانون" 
            className={cn("w-full h-full object-cover relative z-10 group-hover:scale-110 transition-transform duration-500", imageClassName)}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex items-center justify-center relative z-10 text-amber-300 w-full h-full bg-gradient-to-br from-teal-900 via-emerald-800 to-slate-900">
            <Scale className={cn("drop-shadow-sm text-teal-200", iconSizes[size])} />
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <h1 className="text-base md:text-lg font-serif font-black text-[var(--primary)] tracking-tight leading-none mb-0.5">
            مفتاح القانون
          </h1>
          <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest opacity-80">
            Law Key
          </span>
        </div>
      )}
    </div>
  );
}
