/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Scale, Sparkles } from 'lucide-react';

export default function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-white dark:bg-slate-950"
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="w-32 h-32 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20 border border-emerald-400/20 relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-800"
        >
          <img 
            src="/icon.png" 
            alt="Logo" 
            className="w-full h-full object-cover relative z-10" 
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }} 
          />
          <Scale className="w-16 h-16 text-amber-300 relative z-0" />
          
          {/* Decorative Sparks */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-4 -right-4 text-emerald-400"
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>
        </motion.div>

        {/* Outer Ring Animation */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 -m-4 border-2 border-dashed border-emerald-500/30 rounded-[3rem]"
        />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mt-12 text-center"
      >
        <h1 className="text-4xl font-serif font-black text-slate-900 dark:text-white mb-2 tracking-tight">مفتاح القانون</h1>
        <div className="flex items-center justify-center gap-2">
          <span className="w-8 h-px bg-emerald-500/30" />
          <span className="text-xs font-black text-teal-600 uppercase tracking-[0.3em] opacity-80">Law Key</span>
          <span className="w-8 h-px bg-emerald-500/30" />
        </div>
      </motion.div>

      {/* Loading Bar */}
      <div className="absolute bottom-20 left-0 right-0 px-12 max-w-sm mx-auto">
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-full w-full bg-gradient-to-r from-teal-600 to-emerald-800"
          />
        </div>
      </div>
    </motion.div>
  );
}
