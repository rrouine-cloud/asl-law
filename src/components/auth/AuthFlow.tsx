import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, LogIn, Loader2, ShieldCheck, ShieldAlert, Globe } from 'lucide-react';
import { auth, googleProvider } from '../../lib/firebase';
import { signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';

export default function AuthFlow({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    
    setIsLoggingIn(true);
    setErrorText(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Login Error:", error);
      if (error.code === 'auth/cancelled-popup-request') {
        // This happens if a new login attempt is made while one is still pending
        return;
      }
      if (error.code === 'auth/popup-closed-by-user') {
        setErrorText("تم إغلاق النافذة المنبثقة. يرجى المحاولة مرة أخرى وتأكد من السماح بالنوافذ المنبثقة في متصفحك.");
      } else if (error.code === 'auth/popup-blocked') {
        setErrorText("تم حظر النافذة المنبثقة من قبل المتصفح. يرجى تفعيل النوافذ المنبثقة والمحاولة مرة أخرى.");
      } else if (error.code === 'auth/network-request-failed') {
        setErrorText("خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت.");
      } else if (error.message?.includes('Pending promise') || error.code === 'auth/internal-error' || error.message?.includes('Assertion failed')) {
        setErrorText("حدث خطأ في النظام. يرجى تحديث الصفحة (Refresh) والمحاولة مرة أخرى.");
      } else {
        setErrorText(`حدث خطأ أثناء تسجيل الدخول (${error.code || 'unknown'}). يرجى المحاولة مرة أخرى.`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans selection:bg-amber-200" dir="rtl">
        {/* Artistic Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl relative"
        >
          {/* Decorative Frame */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-amber-500/20 via-slate-500/20 to-indigo-500/20 rounded-[3rem] blur-sm" />
          
          <div className="relative bg-white rounded-[2.8rem] shadow-2xl p-10 md:p-16 border border-slate-200/50 backdrop-blur-sm overflow-hidden">
            {/* Top Branding Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-l from-indigo-900 via-amber-600 to-indigo-900" />
            
            <div className="flex flex-col items-center mb-12">
              <div className="relative group mb-8">
                <div className="absolute -inset-4 bg-amber-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 opacity-50" />
                <div className="w-24 h-24 bg-indigo-950 rounded-3xl flex items-center justify-center shadow-2xl relative z-10 transform -rotate-3 group-hover:rotate-0 transition-all duration-500">
                  <Scale className="w-12 h-12 text-amber-400" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">اسأل القانون</h1>
              <div className="h-1 w-20 bg-amber-500 rounded-full mb-6" />
              <p className="text-lg text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                المنصة الرقمية المتطورة للعدالة الذكية ومواكبة المهنة القضائية بالمغرب
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-12">
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <h3 className="font-black text-slate-900 text-sm">حماية المسؤولية المهنية</h3>
                  <p className="text-xs text-slate-500 mt-1">تتبع دقيق للآجال القانونية لتفادي تفويت الفرص</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-amber-200 transition-all">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-amber-600 group-hover:text-white transition-all">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <h3 className="font-black text-slate-900 text-sm">مزامنة سحابية فورية</h3>
                  <p className="text-xs text-slate-500 mt-1">الوصول لملفاتك من الحاسوب أو الهاتف في أي وقت</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {errorText && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-shake">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <span className="font-bold">{errorText}</span>
                </div>
              )}

              <button 
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full py-5 bg-indigo-950 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-4 hover:bg-slate-900 hover:shadow-2xl transition-all relative overflow-hidden group active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                    <span>جاري التحقق...</span>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" alt="Google" className="w-6 h-6" />
                    <span>الولوج عبر حساب Google</span>
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-xs text-slate-500 font-bold mb-2">تواجه مشكلة في تسجيل الدخول؟</p>
                <button 
                  onClick={() => window.open(window.location.href, '_blank')}
                  className="text-xs text-indigo-600 font-black underline decoration-indigo-200 underline-offset-4 hover:text-amber-600 transition-colors"
                >
                  اضغط هنا لفتح التطبيق في نافذة جديدة
                </button>
              </div>

              <div className="flex items-center gap-4 justify-center py-2">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">نظام مشفر ومعتمد</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              
              <div className="flex justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
                <ShieldAlert className="w-6 h-6" />
                <Scale className="w-6 h-6" />
                <Globe className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <p className="mt-8 text-center text-slate-500 text-sm font-medium">
            جميع الحقوق محفوظة © {new Date().getFullYear()} منصة اسأل القانون
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
