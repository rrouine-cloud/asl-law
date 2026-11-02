import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Info, Users, ShieldCheck, MessageSquare } from 'lucide-react';

export default function AboutContact() {
  return (
    <div className="space-y-20 py-12">
      {/* About Us Section */}
      <section className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-amber-50 shadow-xl shadow-amber-900/5 border border-amber-500/10 mb-6"
          >
            <Info className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />
          </motion.div>
        
        <div className="space-y-4">
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[var(--primary)]">من نحن</h2>
          <p className="text-xl text-[var(--muted)] max-w-3xl mx-auto leading-relaxed font-light">
            "دليل القانوني" هي منصة رقمية مغربية متخصصة تهدف إلى مرافقة طلبة الحقوق والباحثين في مسارهم الأكاديمي والمهني، من خلال توفير موارد تعليمية وتوجيهات دقيقة للتميز في المباريات القانونية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-12">
          {[
            { title: "رؤيتنا", desc: "أن نكون المرجع الأول للطالب القانوني المغربي في رحلته نحو النجاح.", icon: Users },
            { title: "مهمتنا", desc: "تبسيط المعلومة القانونية وتوفير أدوات تخطيط ذكية للتحصيل العلمي.", icon: ShieldCheck },
            { title: "قيمنا", desc: "الدقة، الأمانة العلمية، والابتكار في خدمة العدالة.", icon: MessageSquare }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 mx-auto">
                <item.icon className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-[var(--primary)] mb-3">{item.title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="max-w-5xl mx-auto luxury-card p-12 md:p-20 zellige-bg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-bl-[120px] -mr-12 -mt-12 blur-3xl" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative">
          <div className="space-y-10">
            <h3 className="text-4xl font-serif font-bold text-[var(--primary)]">اتصل بنا</h3>
            <p className="text-lg text-[var(--muted)] font-light leading-relaxed">
              نحن هنا للإجابة على تساؤلاتكم واستقبال اقتراحاتكم لتطوير المنصة. لا تترددوا في التواصل معنا.
            </p>
            
            <div className="space-y-6">
              {[
                { icon: Mail, label: "البريد الإلكتروني", value: "contact@dalil-qanouni.ma" },
                { icon: Phone, label: "الهاتف", value: "+212 5XX XX XX XX" },
                { icon: MapPin, label: "المقر", value: "الرباط، المملكة المغربية" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 shadow-inner">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-lg font-bold text-[var(--primary)]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form className="space-y-6 bg-white/50 backdrop-blur-sm p-8 rounded-[32px] border border-white shadow-xl">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">الاسم الكامل</label>
              <input type="text" className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 transition-all outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
              <input type="email" className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 transition-all outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">الرسالة</label>
              <textarea rows={4} className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 transition-all outline-none resize-none" />
            </div>
            <button className="w-full py-5 bg-[var(--primary)] text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all">
              إرسال الرسالة
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
