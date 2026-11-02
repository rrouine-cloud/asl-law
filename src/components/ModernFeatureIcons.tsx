import React from 'react';

interface ModernIconProps {
  className?: string;
}

// 1. قوانينك - Modern Legal Codex & Digital Scale Prism
export function LawCodexIcon({ className = "w-10 h-10" }: ModernIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="codex-bg" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="0.5" stopColor="#1D4ED8" />
          <stop offset="1" stopColor="#0F2D59" />
        </linearGradient>
        <linearGradient id="codex-gold" x1="20" y1="12" x2="44" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="0.5" stopColor="#EAB308" />
          <stop offset="1" stopColor="#CA8A04" />
        </linearGradient>
        <linearGradient id="codex-cyan" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67E8F9" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
        <filter id="codex-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#1D4ED8" floodOpacity="0.35" />
        </filter>
      </defs>
      {/* Dynamic Base Shield/Parchment */}
      <rect x="8" y="10" width="48" height="46" rx="14" fill="url(#codex-bg)" filter="url(#codex-glow)" />
      {/* Inner Gloss Overlay */}
      <path d="M9 22C9 15.3726 14.3726 10 21 10H43C49.6274 10 55 15.3726 55 22V28L9 36V22Z" fill="white" fillOpacity="0.12" />
      
      {/* Central Pillar & Balance Beam */}
      <rect x="30" y="18" width="4" height="28" rx="2" fill="url(#codex-gold)" />
      <path d="M18 24C18 23 32 21 46 24" stroke="url(#codex-gold)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="22" r="3" fill="#FEF08A" />

      {/* Left Pan */}
      <path d="M18 25L14 34H22L18 25Z" fill="url(#codex-cyan)" fillOpacity="0.25" />
      <path d="M13 34C13 36.7614 15.2386 39 18 39C20.7614 39 23 36.7614 23 34H13Z" fill="url(#codex-cyan)" />
      <line x1="18" y1="24" x2="14" y2="34" stroke="#A5F3FC" strokeWidth="1.2" />
      <line x1="18" y1="24" x2="22" y2="34" stroke="#A5F3FC" strokeWidth="1.2" />

      {/* Right Pan */}
      <path d="M46 25L42 34H50L46 25Z" fill="url(#codex-gold)" fillOpacity="0.25" />
      <path d="M41 34C41 36.7614 43.2386 39 46 39C48.7614 39 51 36.7614 51 34H41Z" fill="url(#codex-gold)" />
      <line x1="46" y1="24" x2="42" y2="34" stroke="#FEF08A" strokeWidth="1.2" />
      <line x1="46" y1="24" x2="50" y2="34" stroke="#FEF08A" strokeWidth="1.2" />

      {/* Base Pedestal */}
      <rect x="24" y="44" width="16" height="4" rx="2" fill="url(#codex-gold)" />
    </svg>
  );
}

// 2. الحاسبة القانونية - Modern FinTech Legal Matrix
export function LegalCalculatorIcon({ className = "w-10 h-10" }: ModernIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="calc-bg" x1="10" y1="6" x2="54" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#059669" />
          <stop offset="0.5" stopColor="#047857" />
          <stop offset="1" stopColor="#064E3B" />
        </linearGradient>
        <linearGradient id="calc-neon" x1="16" y1="14" x2="48" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6EE7B7" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
        <filter id="calc-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#047857" floodOpacity="0.35" />
        </filter>
      </defs>
      {/* Device Body */}
      <rect x="12" y="8" width="40" height="48" rx="12" fill="url(#calc-bg)" filter="url(#calc-glow)" />
      <rect x="12" y="8" width="40" height="48" rx="12" stroke="#34D399" strokeWidth="1" strokeOpacity="0.3" />
      
      {/* Neon Digital Display */}
      <rect x="18" y="14" width="28" height="12" rx="4" fill="#022C22" stroke="#059669" strokeWidth="1" />
      <text x="42" y="23" fill="url(#calc-neon)" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="end">MAD</text>
      <rect x="21" y="21" width="10" height="2" rx="1" fill="#34D399" opacity="0.8" />
      
      {/* Keypad Matrix Grid */}
      <rect x="18" y="30" width="7" height="6" rx="2" fill="#065F46" />
      <rect x="28" y="30" width="7" height="6" rx="2" fill="#065F46" />
      <rect x="38" y="30" width="8" height="6" rx="2" fill="#F59E0B" />

      <rect x="18" y="38" width="7" height="6" rx="2" fill="#065F46" />
      <rect x="28" y="38" width="7" height="6" rx="2" fill="#065F46" />
      <rect x="38" y="38" width="8" height="6" rx="2" fill="#10B981" />

      <rect x="18" y="46" width="17" height="6" rx="2" fill="#34D399" />
      <rect x="38" y="46" width="8" height="6" rx="2" fill="#F59E0B" />
      
      {/* Equal Sign Indicator */}
      <line x1="23" y1="48" x2="30" y2="48" stroke="#064E3B" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="23" y1="50" x2="30" y2="50" stroke="#064E3B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 3. الاجتهاد القضائي - Supreme Court Gavel & Precedent Light
export function CaselawGavelIcon({ className = "w-10 h-10" }: ModernIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="gavel-bg" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D97706" />
          <stop offset="0.6" stopColor="#B45309" />
          <stop offset="1" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="gavel-head" x1="20" y1="14" x2="44" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE68A" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#92400E" />
        </linearGradient>
        <filter id="gavel-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#B45309" floodOpacity="0.35" />
        </filter>
      </defs>
      {/* Base Badge */}
      <rect x="8" y="8" width="48" height="48" rx="14" fill="url(#gavel-bg)" filter="url(#gavel-glow)" />
      
      {/* Soundwave Rays */}
      <path d="M16 26C16 18 22 14 30 14" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 4" opacity="0.6" />
      <path d="M48 26C48 18 42 14 34 14" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 4" opacity="0.6" />

      {/* Gavel Hammer Head (Angled 45 deg) */}
      <g transform="rotate(-30 32 30)">
        <rect x="22" y="14" width="20" height="10" rx="3" fill="url(#gavel-head)" stroke="#FEF3C7" strokeWidth="1" />
        {/* Ring Accents */}
        <line x1="26" y1="14" x2="26" y2="24" stroke="#FEF3C7" strokeWidth="1.5" />
        <line x1="38" y1="14" x2="38" y2="24" stroke="#FEF3C7" strokeWidth="1.5" />
        {/* Handle */}
        <rect x="30" y="24" width="4" height="24" rx="2" fill="#FEF3C7" />
      </g>

      {/* Sound Block / Pedestal */}
      <rect x="18" y="44" width="28" height="6" rx="3" fill="#FEF3C7" opacity="0.9" />
      <rect x="15" y="48" width="34" height="4" rx="2" fill="#78350F" opacity="0.8" />
    </svg>
  );
}

// 4. المساعد الذكي - Quantum AI Legal Neural Core
export function SmartAssistantIcon({ className = "w-10 h-10" }: ModernIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="ai-bg" x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9333EA" />
          <stop offset="0.5" stopColor="#7E22CE" />
          <stop offset="1" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id="ai-core" x1="20" y1="20" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F472B6" />
          <stop offset="0.5" stopColor="#EC4899" />
          <stop offset="1" stopColor="#DB2777" />
        </linearGradient>
        <radialGradient id="ai-glow-rad" cx="50%" cy="50%" r="50%">
          <stop stopColor="#F472B6" stopOpacity="0.8" />
          <stop offset="1" stopColor="#9333EA" stopOpacity="0" />
        </radialGradient>
        <filter id="ai-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#7E22CE" floodOpacity="0.35" />
        </filter>
      </defs>
      {/* Background Container */}
      <rect x="8" y="8" width="48" height="48" rx="14" fill="url(#ai-bg)" filter="url(#ai-glow)" />

      {/* Ambient Neural Core Glow */}
      <circle cx="32" cy="32" r="16" fill="url(#ai-glow-rad)" />

      {/* Intersecting Orbital Rings */}
      <ellipse cx="32" cy="32" rx="16" ry="7" transform="rotate(-30 32 32)" stroke="#E9D5FF" strokeWidth="1.5" strokeDasharray="3 2" />
      <ellipse cx="32" cy="32" rx="16" ry="7" transform="rotate(30 32 32)" stroke="#F472B6" strokeWidth="1.5" />

      {/* Core Glowing Diamond Sparkle */}
      <path d="M32 18L35 29L46 32L35 35L32 46L29 35L18 32L29 29L32 18Z" fill="#FFFFFF" />
      <circle cx="32" cy="32" r="3" fill="url(#ai-core)" />

      {/* Satellite Synaptic Nodes */}
      <circle cx="20" cy="22" r="2" fill="#E9D5FF" />
      <circle cx="44" cy="22" r="2.5" fill="#F472B6" />
      <circle cx="42" cy="42" r="2" fill="#E9D5FF" />
      <circle cx="22" cy="42" r="2.5" fill="#F472B6" />
    </svg>
  );
}

// 5. الاختصاص القضائي - 3D Court Map & Jurisdictional Radar
export function JurisdictionMapIcon({ className = "w-10 h-10" }: ModernIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="map-bg" x1="6" y1="8" x2="58" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E11D48" />
          <stop offset="0.5" stopColor="#BE123C" />
          <stop offset="1" stopColor="#881337" />
        </linearGradient>
        <linearGradient id="pin-head" x1="24" y1="14" x2="40" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE4E6" />
          <stop offset="1" stopColor="#FDA4AF" />
        </linearGradient>
        <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#BE123C" floodOpacity="0.35" />
        </filter>
      </defs>
      {/* Background Tile */}
      <rect x="8" y="8" width="48" height="48" rx="14" fill="url(#map-bg)" filter="url(#map-glow)" />

      {/* Radar Isometric Grid Rings */}
      <ellipse cx="32" cy="42" rx="18" ry="8" stroke="#FFE4E6" strokeWidth="1" strokeOpacity="0.4" />
      <ellipse cx="32" cy="42" rx="11" ry="5" stroke="#FFE4E6" strokeWidth="1.2" strokeOpacity="0.7" />
      <ellipse cx="32" cy="42" rx="4" ry="2" fill="#FFE4E6" />

      {/* 3D Map Pin with Pillar */}
      <path d="M32 14C26.4772 14 22 18.4772 22 24C22 30.5 32 42 32 42C32 42 42 30.5 42 24C42 18.4772 37.5228 14 32 14Z" fill="url(#pin-head)" />
      
      {/* Inner Court / Star Emissary */}
      <circle cx="32" cy="24" r="4.5" fill="#BE123C" />
      <path d="M32 21L33 23.5L35.5 24L33 24.5L32 27L31 24.5L28.5 24L31 23.5L32 21Z" fill="#FFE4E6" />
    </svg>
  );
}

// 6. ملخصات الإجازة - Academic Law Codex & Graduation Crest
export function AcademicSummariesIcon({ className = "w-10 h-10" }: ModernIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="acad-bg" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F46E5" />
          <stop offset="0.5" stopColor="#4338CA" />
          <stop offset="1" stopColor="#312E81" />
        </linearGradient>
        <linearGradient id="cap-gold" x1="20" y1="14" x2="44" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="1" stopColor="#CA8A04" />
        </linearGradient>
        <filter id="acad-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#4338CA" floodOpacity="0.35" />
        </filter>
      </defs>
      {/* Base Badge */}
      <rect x="8" y="8" width="48" height="48" rx="14" fill="url(#acad-bg)" filter="url(#acad-glow)" />

      {/* Graduation Cap (Mortarboard) */}
      <path d="M32 16L14 24L32 32L50 24L32 16Z" fill="#FFFFFF" />
      <path d="M22 28.5V36C22 39 26.5 42 32 42C37.5 42 42 39 42 36V28.5L32 34L22 28.5Z" fill="#C7D2FE" />
      
      {/* Golden Tassel & Ribbon */}
      <circle cx="32" cy="24" r="2" fill="url(#cap-gold)" />
      <path d="M44 26.5L46 36L48 37" stroke="url(#cap-gold)" strokeWidth="2" strokeLinecap="round" />

      {/* Book Base Underneath */}
      <path d="M16 46C20 44 26 44 32 46C38 44 44 44 48 46V49C44 47 38 47 32 49C26 47 20 47 16 49V46Z" fill="#FDE047" />
    </svg>
  );
}

// 7. المنهجية القانونية - Architectural Blueprint & Analytical Layers
export function LegalMethodologyIcon({ className = "w-10 h-10" }: ModernIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="meth-bg" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#334155" />
          <stop offset="0.6" stopColor="#0F2D59" />
          <stop offset="1" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="meth-cyan" x1="18" y1="16" x2="46" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <filter id="meth-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#0F2D59" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* Base Badge */}
      <rect x="8" y="8" width="48" height="48" rx="14" fill="url(#meth-bg)" filter="url(#meth-glow)" />

      {/* Isometric Layer 3 (Bottom) */}
      <path d="M32 46L16 38L32 30L48 38L32 46Z" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
      
      {/* Isometric Layer 2 (Middle) */}
      <path d="M32 38L16 30L32 22L48 30L32 38Z" fill="#0F2D59" stroke="#38BDF8" strokeWidth="1.5" fillOpacity="0.7" />

      {/* Isometric Layer 1 (Top Glass Layer) */}
      <path d="M32 30L16 22L32 14L48 22L32 30Z" fill="url(#meth-cyan)" fillOpacity="0.35" stroke="#BAE6FD" strokeWidth="2" />

      {/* Analytical Blueprint Coordinate Pointer */}
      <circle cx="32" cy="22" r="3.5" fill="#38BDF8" />
      <circle cx="32" cy="22" r="1.5" fill="#FFFFFF" />
      
      {/* Precision Drafting Compass Needle */}
      <line x1="32" y1="22" x2="38" y2="17" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 8. العقود - Smart Contract Document & Certified Seal
export function LegalContractsIcon({ className = "w-10 h-10" }: ModernIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="cont-bg" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EA580C" />
          <stop offset="0.5" stopColor="#C2410C" />
          <stop offset="1" stopColor="#9A3412" />
        </linearGradient>
        <linearGradient id="cont-gold" x1="32" y1="36" x2="48" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="1" stopColor="#EAB308" />
        </linearGradient>
        <filter id="cont-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#C2410C" floodOpacity="0.35" />
        </filter>
      </defs>
      {/* Container Tile */}
      <rect x="8" y="8" width="48" height="48" rx="14" fill="url(#cont-bg)" filter="url(#cont-glow)" />

      {/* Parchment Page */}
      <rect x="18" y="14" width="28" height="36" rx="4" fill="#FFF7ED" />
      
      {/* Folded Corner */}
      <path d="M40 14V20H46L40 14Z" fill="#FDBA74" />

      {/* Document Legal Paragraph Lines */}
      <rect x="22" y="20" width="14" height="2" rx="1" fill="#FB923C" />
      <rect x="22" y="25" width="20" height="2" rx="1" fill="#FDBA74" />
      <rect x="22" y="30" width="18" height="2" rx="1" fill="#FDBA74" />
      <rect x="22" y="35" width="12" height="2" rx="1" fill="#FDBA74" />

      {/* Certified Golden Wax Seal */}
      <circle cx="38" cy="42" r="7" fill="url(#cont-gold)" stroke="#FFF7ED" strokeWidth="1.5" />
      <path d="M35 42L37.5 44.5L41.5 39.5" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 9. الترجمة القانونية - Dual-Globe Bilingual Prism (ع / FR)
export function LegalTranslationIcon({ className = "w-10 h-10" }: ModernIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="trans-bg" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0D9488" />
          <stop offset="0.5" stopColor="#0F766E" />
          <stop offset="1" stopColor="#115E59" />
        </linearGradient>
        <linearGradient id="trans-cyan" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2DD4BF" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
        <filter id="trans-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#0F766E" floodOpacity="0.35" />
        </filter>
      </defs>
      {/* Base Badge */}
      <rect x="8" y="8" width="48" height="48" rx="14" fill="url(#trans-bg)" filter="url(#trans-glow)" />

      {/* Intertwined Linguistic Shields */}
      {/* Shield 1: Arabic Badge (ع) */}
      <rect x="15" y="16" width="22" height="22" rx="7" fill="#CCFBF1" stroke="#2DD4BF" strokeWidth="1.2" />
      <text x="26" y="32" fill="#0F766E" fontSize="13" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">ع</text>

      {/* Shield 2: French / Latin Badge (FR) */}
      <rect x="27" y="26" width="22" height="22" rx="7" fill="#134E4A" stroke="#5EEAD4" strokeWidth="1.2" />
      <text x="38" y="41" fill="#5EEAD4" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">FR</text>

      {/* Quantum Bridge Exchange Arrows */}
      <path d="M38 19L44 19L44 23" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 44L20 44L20 40" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
