import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Smartphone } from 'lucide-react';

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the install button/banner
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[100] bg-indigo-900 text-white p-6 rounded-[2rem] shadow-2xl border border-white/10 backdrop-blur-xl"
        dir="rtl"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-black text-lg">تثبيت التطبيق على هاتفك</h3>
            <p className="text-sm text-indigo-100 mt-1 opacity-80">استخدم التطبيق كأنه APK أصلي، مع وصول أسرع وتجربة أفضل.</p>
            
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleInstall}
                className="px-6 py-2.5 bg-white text-indigo-900 rounded-xl font-bold text-sm shadow-lg hover:bg-amber-500 hover:text-white transition-all"
              >
                تثبيت الآن
              </button>
              <button
                onClick={() => setShowBanner(false)}
                className="px-4 py-2.5 bg-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                تجاهل
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
