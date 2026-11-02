/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ShieldCheck, Lock, Eye, FileText, Scale } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 sm:px-8 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-black text-slate-900 dark:text-white">سياسة الخصوصية</h1>
            <p className="text-amber-600 font-bold text-sm tracking-widest mt-1">PRIVACY POLICY</p>
          </div>
        </div>

        <section className="space-y-6">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            نحن في <strong>اسأل القانون (Ask Law)</strong>، نولي أهمية قصوى لخصوصية مستخدمينا. توضح هذه الصفحة كيف نقوم بجمع واستخدام وحماية معلوماتك الشخصية عند استخدامك لتطبيقنا.
          </p>

          <div className="grid gap-6">
            <PolicyItem 
              icon={<Eye className="w-5 h-5" />}
              title="المعلومات التي نجمعها"
              content="نجمع معلومات محدودة تهدف لتحسين تجربتك، مثل معلومات الحساب الأساسية (الاسم والبريد الإلكتروني) عند التسجيل عبر جوجل، وسجلات تفاعلك مع المساعد الذكي لتوفير ردود أكثر دقة."
            />
            <PolicyItem 
              icon={<Lock className="w-5 h-5" />}
              title="كيفية حماية بياناتك"
              content="نستخدم تقنيات تشفير متقدمة وخدمات Firebase الآمنة لضمان حماية بياناتك من الوصول غير المصرح به. لا يتم مشاركة بياناتك الشخصية مع أطراف ثالثة لأغراض تسويقية."
            />
            <PolicyItem 
              icon={<Scale className="w-5 h-5" />}
              title="حقوقك القانونية"
              content="لديك الحق الكامل في الوصول إلى بياناتك، تعديلها، أو طلب حذفها نهائياً من أنظمتنا في أي وقت من خلال إعدادات الحساب أو الاتصال بنا مباشرة."
            />
            <PolicyItem 
              icon={<FileText className="w-5 h-5" />}
              title="ملفات تعريف الارتباط"
              content="نستخدم ملفات تعريف الارتباط (Cookies) والتقنيات المشابهة لتحليل حركة المرور وتحسين أداء التطبيق وضمان بقاء جلسة عملك نشطة وآمنة."
            />
          </div>
        </section>

        <section className="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-[2rem] border border-amber-100 dark:border-amber-900/20">
          <h2 className="text-xl font-black text-amber-900 dark:text-amber-400 mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5" />
            تعديلات السياسة
          </h2>
          <p className="text-amber-800/80 dark:text-amber-400/80 text-sm leading-relaxed font-bold">
            قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر لمواكبة التطورات التقنية أو القانونية. سيتم إخطارك بأي تغييرات جوهرية من خلال التطبيق.
            <br />
            تاريخ آخر تحديث: {new Date().toLocaleDateString('ar-MA')}
          </p>
        </section>

        <footer className="text-center pt-8 border-t border-slate-100 dark:border-slate-800">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            تم إعداد هذه السياسة لضمان الامتثال للقوانين المعمول بها وحماية حقوق المستخدمين.
          </p>
        </footer>
      </motion.div>
    </div>
  );
}

function PolicyItem({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 transition-all hover:shadow-md">
      <div className="w-10 h-10 shrink-0 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-amber-600 shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="font-black text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
