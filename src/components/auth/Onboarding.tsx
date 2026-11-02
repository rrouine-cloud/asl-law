import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, UserCheck, GraduationCap, Scale, Briefcase, Gavel, FileText, ChevronRight, ArrowLeft } from 'lucide-react';

interface OnboardingData {
  name: string;
  gender: 'male' | 'female' | '';
  education: 'bachelor' | 'master' | 'phd' | 'other' | '';
  role: 'public_servant' | 'lawyer' | 'judge' | 'conservator' | '';
  interest: 'civil' | 'criminal' | 'commercial' | 'administrative' | 'family' | 'social' | 'international' | '';
}

export default function Onboarding({ onComplete }: { onComplete: (data: OnboardingData) => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    gender: '',
    education: '',
    role: '',
    interest: ''
  });

  const handleNext = (field: keyof OnboardingData, value: any) => {
    const newData = { ...data, [field]: value };
    setData(newData);

    if (field === 'education' && value !== 'other') {
      setStep(4); // Skip to interest if not 'other'
    } else if (field === 'role' || field === 'gender') {
      setStep(step + 1);
    } else if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(newData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-600"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold mb-6">أهلاً بك، ما هو اسمك؟</h2>
              <input 
                type="text" 
                className="w-full p-4 border border-slate-200 rounded-2xl mb-4"
                placeholder="اسمك الشخصي"
                onChange={(e) => setData({...data, name: e.target.value})}
              />
              <button onClick={() => setStep(2)} className="w-full p-4 bg-indigo-600 text-white rounded-2xl font-bold">التالي</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold mb-6">اختر جنسك</h2>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleNext('gender', 'male')} className="p-6 border-2 border-slate-200 rounded-3xl hover:border-indigo-600">ذكر</button>
                <button onClick={() => handleNext('gender', 'female')} className="p-6 border-2 border-slate-200 rounded-3xl hover:border-indigo-600">أنثى</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold mb-6">ما هو مستواك الدراسي؟</h2>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleNext('education', 'bachelor')} className="p-4 border rounded-2xl">إجازة</button>
                <button onClick={() => handleNext('education', 'master')} className="p-4 border rounded-2xl">ماستر</button>
                <button onClick={() => handleNext('education', 'phd')} className="p-4 border rounded-2xl">دكتوراه</button>
                <button onClick={() => setStep(3.5)} className="p-4 border rounded-2xl">غير ذلك</button>
              </div>
            </motion.div>
          )}

          {step === 3.5 && (
            <motion.div key="step3.5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold mb-6">ما صفتك؟</h2>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleNext('role', 'public_servant')} className="p-4 border rounded-2xl">موظف عمومي</button>
                <button onClick={() => handleNext('role', 'lawyer')} className="p-4 border rounded-2xl">محامي</button>
                <button onClick={() => handleNext('role', 'judge')} className="p-4 border rounded-2xl">قاضي</button>
                <button onClick={() => handleNext('role', 'conservator')} className="p-4 border rounded-2xl">محافظ قضائي</button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold mb-6">مجال اهتمامك؟</h2>
              <div className="grid grid-cols-2 gap-4">
                {['المدني', 'الجنائي', 'التجاري', 'الإداري', 'الأسري', 'الاجتماعي', 'الدولي'].map(i => (
                  <button key={i} onClick={() => handleNext('interest', i)} className="p-4 border rounded-2xl">{i}</button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
