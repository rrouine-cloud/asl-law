/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Gavel, CheckCircle2, AlertTriangle, Scale, UserCheck } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 sm:px-8 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
            <Gavel className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-black text-slate-900 dark:text-white">شروط الاستخدام</h1>
            <p className="text-blue-600 font-bold text-sm tracking-widest mt-1">TERMS OF SERVICE</p>
          </div>
        </div>

        <section className="space-y-6">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            باستخدامك لتطبيق <strong>اسأل القانون (Ask Law)</strong>، فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية قبل البدء في استخدام الخدمات.
          </p>

          <div className="grid gap-6">
            <TermItem 
              icon={<UserCheck className="w-5 h-5" />}
              title="الاستخدام العادل"
              content="يُسمح باستخدام التطبيق للأغراض التعليمية والأكاديمية والبحث القانوني. يُمنع منعاً باتاً استغلال التطبيق لإنشاء محتوى مضلل أو غير قانوني أو استنزاف الموارد التقنية بشكل متعمد."
            />
            <TermItem 
              icon={<AlertTriangle className="w-5 h-5" />}
              title="إخلاء المسؤولية"
              content="المعلومات المقدمة عبر المساعد الذكي هي لأغراض استرشادية فقط ولا تعوض الاستشارة القانونية المهنية من محامٍ معتمد. نحن نبذل قصارى جهدنا لضمان دقة المعلومات ولكننا لا نتحمل مسؤولية القرارات المتخذة بناءً عليها."
            />
            <TermItem 
              icon={<Scale className="w-5 h-5" />}
              title="الملكية الفكرية"
              content="جميع المحتويات والتقنيات والعلامات التجارية الموجودة في التطبيق هي ملك حصري لمطوري 'اسأل القانون'. يُمنع نسخ أو إعادة توزيع أي جزء من التطبيق دون إذن كتابي مسبق."
            />
            <TermItem 
              icon={<CheckCircle2 className="w-5 h-5" />}
              title="إنهاء الخدمة"
              content="نحتفظ بالحق في تعليق أو إلغاء وصول المستخدم إلى التطبيق في حال مخالفة هذه الشروط أو القيام بأعمال تضر بسلامة المنصة أو مستخدميها."
            />
          </div>
        </section>

        <section className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-900/20">
          <h2 className="text-xl font-black text-blue-900 dark:text-blue-400 mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5" />
            اتفاقية المستخدم
          </h2>
          <p className="text-blue-800/80 dark:text-blue-400/80 text-sm leading-relaxed font-bold">
            هذه الشروط تشكل اتفاقية كاملة بينك وبين "اسأل القانون" فيما يتعلق باستخدامك للتطبيق. من خلال النقر على "موافق" أو الاستمرار في الاستخدام، فإنك تقر بفهمك لهذه الشروط.
            <br />
            تاريخ السريان: {new Date().toLocaleDateString('ar-MA')}
          </p>
        </section>

        <footer className="text-center pt-8 border-t border-slate-100 dark:border-slate-800">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            تم تصميم هذه الشروط لحماية نزاهة التطبيق وضمان تجربة آمنة لجميع المستخدمين.
          </p>
        </footer>
      </motion.div>
    </div>
  );
}

function TermItem({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 transition-all hover:shadow-md">
      <div className="w-10 h-10 shrink-0 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="font-black text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
