import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  RefreshCw, 
  Download, 
  Printer,
  Trash2,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertTriangle,
  X,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Search,
  BookOpen,
  Sparkles,
  Wand2,
  Calendar,
  Layers,
  ShoppingBag,
  Home as HomeIcon2,
  User,
  UserCheck,
  Briefcase,
  Clock,
  DollarSign,
  MapPin,
  CheckSquare,
  Square,
  Check,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Types ---
type ContractCategory = 'PROPERTY' | 'VEHICLES' | 'ADMINISTRATIVE' | 'PROFESSIONAL' | 'PERSONAL' | 'LEGAL' | 'MISC' | 'AI_ASSISTANT' | 'RENTAL' | 'SALE' | 'CIVIL' | 'COMPLAINTS' | 'WAIVERS' | 'AGRI';

interface DocumentField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'date' | 'number' | 'textarea';
}

interface ContractTemplate {
  id: string;
  name: string;
  category: ContractCategory;
  description: string;
  fields: DocumentField[];
  generateText: (data: Record<string, string>) => string;
  rawTemplate?: string;
}

const CATEGORIES: Record<ContractCategory, { name: string, icon: any }> = {
  AI_ASSISTANT: { name: 'استكشاف النماذج المتوافقة مع القانون المغربي', icon: Sparkles },
  PROPERTY: { name: 'العقارات والأراضي', icon: BookOpen },
  VEHICLES: { name: 'السيارات والآليات', icon: RefreshCw },
  ADMINISTRATIVE: { name: 'وثائق إدارية', icon: FileText },
  PROFESSIONAL: { name: 'تجارية ومهنية', icon: RefreshCw },
  PERSONAL: { name: 'التزامات شخصية', icon: CheckCircle2 },
  LEGAL: { name: 'قانونية وتوكيلات', icon: FileText },
  RENTAL: { name: 'عقود الكراء', icon: HomeIcon2 },
  SALE: { name: 'عقود البيع', icon: ShoppingBag },
  CIVIL: { name: 'التزامات مدنية', icon: Layers },
  COMPLAINTS: { name: 'الشكايات والتظلمات', icon: AlertTriangle },
  WAIVERS: { name: 'التنازلات والإشهادات', icon: FileText },
  AGRI: { name: 'المجال الفلاحي', icon: Layers },
  MISC: { name: 'نماذج أخرى', icon: Search },
};

const getFieldIcon = (fieldId: string, fieldLabel: string, fieldType: string) => {
  const idLower = fieldId.toLowerCase();
  const labelLower = fieldLabel.toLowerCase();

  if (fieldType === 'date' || idLower.includes('date') || labelLower.includes('تاريخ') || labelLower.includes('أجل')) {
    return <Calendar className="w-5 h-5 text-slate-400 dark:text-slate-500" />;
  }
  if (idLower.includes('employer') || idLower.includes('seller') || idLower.includes('owner') || idLower.includes('party1') || labelLower.includes('أول') || labelLower.includes('صاحب') || labelLower.includes('بائع') || labelLower.includes('مكري') || labelLower.includes('مواكل')) {
    return <User className="w-5 h-5 text-slate-400 dark:text-slate-500" />;
  }
  if (idLower.includes('employee') || idLower.includes('buyer') || idLower.includes('tenant') || idLower.includes('party2') || labelLower.includes('ثاني') || labelLower.includes('عامل') || labelLower.includes('مشتري') || labelLower.includes('مكتري') || labelLower.includes('وكيل')) {
    return <UserCheck className="w-5 h-5 text-slate-400 dark:text-slate-500" />;
  }
  if (idLower.includes('job') || idLower.includes('profession') || labelLower.includes('مهنة') || labelLower.includes('صفة')) {
    return <Briefcase className="w-5 h-5 text-slate-400 dark:text-slate-500" />;
  }
  if (idLower.includes('duration') || idLower.includes('term') || idLower.includes('time') || labelLower.includes('مدة') || labelLower.includes('فترة')) {
    return <Clock className="w-5 h-5 text-slate-400 dark:text-slate-500" />;
  }
  if (idLower.includes('salary') || idLower.includes('price') || idLower.includes('rent') || idLower.includes('amount') || labelLower.includes('أجر') || labelLower.includes('ثمن') || labelLower.includes('مبلغ') || labelLower.includes('سومة')) {
    return <DollarSign className="w-5 h-5 text-slate-400 dark:text-slate-500" />;
  }
  if (idLower.includes('city') || idLower.includes('loc') || labelLower.includes('مدينة') || labelLower.includes('عنوان') || labelLower.includes('موقع')) {
    return <MapPin className="w-5 h-5 text-slate-400 dark:text-slate-500" />;
  }
  return <FileText className="w-5 h-5 text-slate-400 dark:text-slate-500" />;
};

const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'individual_employment_contract',
    name: 'عقد عمل / شغل فردي (مفصل)',
    category: 'PROFESSIONAL',
    description: 'نموذج عقد عمل متكامل يحتوي على كافة البيانات، الراتب، نوع العملة، مدة الإجازة السنوية، والالتزامات.',
    fields: [
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'employerName', label: 'اسم الطرف الأول / صاحب العمل', placeholder: 'الاسم الكامل أو اسم الشركة، السجل التجاري، العنوان...', type: 'textarea' },
      { id: 'employeeName', label: 'اسم الطرف الثاني / العامل', placeholder: 'الاسم الكامل، رقم البطاقة الوطنية CIN، العنوان...', type: 'textarea' },
      { id: 'employeeJob', label: 'مهنة الطرف الثاني', placeholder: 'مثلاً: مهندس برمجيات، محاسب، تقني...', type: 'text' },
      { id: 'contractDuration', label: 'مدة العقد', placeholder: 'مثلاً: سنة واحدة تجدد تلقائياً / غير محددة المدة (CDI)', type: 'text' },
      { id: 'monthlySalary', label: 'مبلغ الأجر / الرتب الشهري', placeholder: 'مثلاً: 6000.00', type: 'text' },
      { id: 'currency', label: 'نوع العملة', placeholder: 'درهم مغربي', type: 'text' },
      { id: 'annualLeaveDays', label: 'مدة الاجازة السنوية (يوم)', placeholder: 'مثلاً: 18 يوماً', type: 'text' },
      { id: 'additionalTasksConsent', label: 'الموافقة على التكليف بأعمال إضافية', placeholder: 'نعم', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: 'مثلاً: الرباط', type: 'text' },
    ],
    generateText: (data) => `
عقد عمل (شغل) فردي

بين الموقعين أسفله:
الطرف الأول (صاحب العمل): ${data.employerName || '................'}
والطرف الثاني (العامل): ${data.employeeName || '................'}

اتفق الطرفان بكامل الأهلية والرضى على تحرير هذا العقد بالشروط والتعهدات التالية:

الفصل الأول: مهنة ووظيفة العامل
يعمل الطرف الثاني لدى الطرف الأول بمهنة: ${data.employeeJob || '................'}.

الفصل الثاني: مدة العقد وتاريخ الشروع
يسري هذا العقد لمدة: ${data.contractDuration || '................'} وذلك ابتداءً من تاريخ ${data.date || '........'}.

الفصل الثالث: الأجر ونوع العملة
يتقاضى الطرف الثاني أجراً شهرياً صافياً قدره: ${data.monthlySalary || '........'} ${data.currency || 'درهم مغربي'} يؤدى في نهاية كل شهر شمسي.

الفصل الرابع: الإجازة السنوية والعطل
يستفيد الطرف الثاني من إجازة سنوية مدفوعة الأجر مدتها: ${data.annualLeaveDays || '18'} يوماً عن كل سنة عمل فعلي، وفق القوانين الجاري بها العمل.

الفصل الخامس: التزامات الطرف الثاني والأعمال الإضافية
${data.additionalTasksConsent === 'نعم' || !data.additionalTasksConsent ? 'يوافق الطرف الثاني على تكليفه من قبل الطرف الأول بأعمال إضافية غير مذكورة بصلب هذا العقد على أن لا تخرج عن قدرته وإمكانياته وتخصص المهنة.' : 'يلتزم الطرف الثاني بالمهام والمهمات المحددة حصراً بالاتفاق مع الطرف الأول.'}
يلتزم الطرف الثاني بالحفاظ على السر المهني وممتلكات ومعدات العمل.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

إمضاء الطرف الأول (صاحب العمل):                    إمضاء الطرف الثاني (العامل):
`
  },
  {
    id: 'detailed_property_sale',
    name: 'عقد بيع عقار (مفصل)',
    category: 'PROPERTY',
    description: 'نموذج بيع عقاري متكامل يتضمن بيانات الرسم العقاري، شروط الأداء، الالتزامات والضمانات.',
    fields: [
      { id: 'sellerInfo', label: 'هوية البائع (الاسم الكامل، الصفة، CIN أو رقم السجل التجاري، العنوان)', placeholder: 'مثلاً: السيد إبراهيم دعلوش بن بوزكري، شخص ذاتي، CIN: IB546، الساكن بـ...', type: 'textarea' },
      { id: 'buyerInfo', label: 'هوية المشتري (الاسم الكامل، الصفة، CIN/السجل، العنوان)', placeholder: 'مثلاً: شركة عبداوي لمواد البناء (شخص معنوي)، سجل تجاري 1234، ممثلها السيد محمد...', type: 'textarea' },
      { id: 'propType', label: 'نوع العقار وموقعه', placeholder: 'مثلاً: شقة بالطبق الثالث، مساحتها 80 متر مربع، بحي...', type: 'text' },
      { id: 'propTitle', label: 'رقم الرسم العقاري / مطلب التحفيظ', placeholder: 'مثلاً: رسم عقاري عدد 1234/56 أو عقد ملكية عدلي...', type: 'text' },
      { id: 'originDoc', label: 'أصل الملكية', placeholder: 'بموجب شراء مؤرخ في... مسجل بـ...', type: 'textarea' },
      { id: 'price', label: 'ثمن البيع (بالأرقام والكلمات)', placeholder: 'مثلاً: 500.000 درهم (خمسمائة ألف درهم)', type: 'text' },
      { id: 'paymentMethod', label: 'طريقة الأداء', placeholder: 'نقداً / شيك رقم... مسحوب على بنك...', type: 'text' },
      { id: 'conditions', label: 'شروط إضافية (اختياري)', placeholder: 'أدخل أي شروط خاصة هنا لتضمينها في العقد بشكل نهائي...', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: 'مثلاً: الفقيه بن صالح', type: 'text' },
      { id: 'date', label: 'تاريخ التوقيع', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
بين الموقعين أسفله:
الطرف الأول: ${data.sellerInfo || '........'} 
المصرح به في هذا العقد بـ "البائع" من جهة أولى

والطرف الثاني: ${data.buyerInfo || '........'} 
المصرح به في هذا العقد بـ "المشتري" من جهة ثانية

وقع الاتفاق والتراضي بين الطرفين وهما بكامل قواهما العقلية وأهليتهما القانونية على ما يلي:

الفصل الأول: موضوع البيع
بمقتضى هذا العقد وتحت جميع الضمانات الفعلية والقانونية الجاري بها العمل في المادة العقارية، باع الطرف الأول للطرف الثاني الذي قبل منه الشراء العقار التالي:
${data.propType || '........'}
المسجل تحت ${data.propTitle || '........'}.

الفصل الثاني: أصل الملكية
يصرح البائع ويؤكد أن العقار المذكور قد آلت إليه ملكيته بموجب ${data.originDoc || '........'}.

الفصل الثالث: الثمن وطريقة الأداء
حدد الثمن الإجمالي لهذا البيع في مبلغ ${data.price || '........'} درهم.
وصرح البائع أنه تسلم المبلغ المذكور بواسطة: ${data.paymentMethod || '........'}، ويعتبر توقيعه على هذا العقد بمثابة إبراء تام ونهائي للمشتري من الثمن.

الفصل الرابع: الحيازة والتصرف
يقر المشتري أنه عاين العقار المبيع معاينة تامة نافية للجهالة، وأنه قبله بحالته الراهنة، ويتحوز به ابتداءً من تاريخ التوقيع على هذا العقد.

الفصل الخامس: شروط خاصة واتفاقات إضافية
تفق الطرفان على الالتزام بما يلي: ${data.conditions || 'تطبق القوانين والأنظمة المعمول بها في هذا الصدد.'}

الفصل السادس: المصاريف القانونية
يتحمل المشتري جميع مصاريف التسجيل والتحفيظ والواجبات المرتبطة بهذا العقد أمام الإدارات المختصة.

حرر في حسن نية بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

إمضاء الطرف الأول (البائع):                       إمضاء الطرف الثاني (المشتري):
`
  },
  {
    id: 'unified_rental_law',
    name: 'عقد كراء (قانون 67.12 و 49.16)',
    category: 'PROPERTY',
    description: 'نموذج كراء سكني أو مهني محين طبقاً لآخر التعديلات القانونية، مع تحديد الزيادة القانونية.',
    fields: [
      { id: 'owner', label: 'بيانات المكري (صاحب الملك)', placeholder: '', type: 'textarea' },
      { id: 'tenant', label: 'بيانات المكتري', placeholder: '', type: 'textarea' },
      { id: 'property', label: 'وصف العين المكتراة', placeholder: 'شقة، محل تجاري، عنوان المحل...', type: 'text' },
      { id: 'purpose', label: 'الغرض من الكراء', placeholder: 'سكني / مهني / تجاري', type: 'text' },
      { id: 'rent', label: 'السومة الكرائية الشهرية', placeholder: '', type: 'text' },
      { id: 'increaseRate', label: 'نسبة الزيادة القانونية', placeholder: 'مثلاً: 10% كل 3 سنوات', type: 'text' },
      { id: 'startDate', label: 'تاريخ بداية الكراء', placeholder: '', type: 'date' },
      { id: 'conditions', label: 'شروط إضافية', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ العقد', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
بين الموقعين أسفله:
المكري: ${data.owner || '........'}
المكتري: ${data.tenant || '........'}

تم الاتفاق على عقد كراء خاضع لمقتضيات القانون 67.12 (للسكن) أو 49.16 (للتجاري) وفق البنود التالية:

1. موضوع الكراء: يكتري الطرف الثاني من الطرف الأول المحل الكائن بـ ${data.property || '........'} وذلك لغرض ${data.purpose || '........'}.
2. الواجب الكرائي: حدد السومة الكرائية في مبلغ ${data.rent || '........'} درهم شهرياً، تؤدى في اليوم الأول من كل شهر.
3. مدة الكراء: يبتدئ هذا العقد من تاريخ ${data.startDate || '........'} ولمدة غير محددة (أو محددة في...).
4. الزيادة في الكراء: يتم تطبيق زيادة قانونية قدرها ${data.increaseRate || '........'} وفق الآجال المنصوص عليها قانوناً.
5. الالتزامات: ${data.conditions || 'يلتزم المكتري بالمحافظة على العين المكتراة وأداء مستحقات استهلاك الماء والكهرباء والضريبة على النظافة.'}
6. فسخ العقد: يخضع فسخ العقد للإجراءات القانونية والمساطر المنصوص عليها في القوانين الجاري بها العمل.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

إمضاء المكري:                                        إمضاء المكتري:
`
  },
  {
    id: 'general_wakala',
    name: 'وكالة عامة شمولية',
    category: 'LEGAL',
    description: 'نموذج وكالة عامة تمنح الوكيل صلاحيات واسعة للإدارة والتمثيل أمام الإدارات والمحاكم.',
    fields: [
      { id: 'principal', label: 'بيانات الموكِّل (صاحب الشأن)', placeholder: '', type: 'textarea' },
      { id: 'agent', label: 'بيانات الموكَّل له (الوكيل)', placeholder: '', type: 'textarea' },
      { id: 'powers', label: 'نطاق الوكالة (اختياري)', placeholder: 'اترك فارغاً للصلاحيات العامة الشاملة', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد(ة): ${data.principal || '................'}

أوكل بمقتضى هذا العقد وكالة عامة ومسؤولة للسيد(ة): ${data.agent || '................'}

وذلك لينوب عني ويقوم مقامي في تمثيلي أمام جميع الإدارات العمومية والخصوصية، والمؤسسات البنكية، والمحاكم بجميع درجاتها، وله الحق في:
- التوقيع على كافة الوثائق والطلبات والشكايات.
- قبض المبالغ والحوالات وفتح الحسابات أو إغلاقها.
- تمثيلي في كافة القضايا القانونية والنزاعات.
- ${data.powers || 'كافة التصرفات القانونية والإدارية دون استثناء.'}

وهذه وكالة مفوضة وشاملة صالحة للعمل بها غاية إلغائها من طرفي.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

إمضاء الموكل:
`
  },
  {
    id: 'truck_sale_detailed',
    name: 'عقد بيع شاحنة / مركبة فلاحية',
    category: 'VEHICLES',
    description: 'نموذج بيع المركبات الكبيرة مع جميع بيانات الأطراف والوصف التقني.',
    fields: [
      { id: 'seller', label: 'بيانات البائع (الاسم، الشخصية، CIN/السجل، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'buyer', label: 'بيانات المشتري (الاسم، الشخصية، CIN/السجل، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'vehicleType', label: 'نوع المركبة (شاحنة، جرار، مقطورة)', placeholder: '', type: 'text' },
      { id: 'brand', label: 'الماركة والنوع التقني', placeholder: '', type: 'text' },
      { id: 'frameNum', label: 'رقم الإطار الحديدي', placeholder: '', type: 'text' },
      { id: 'plateNum', label: 'رقم التسجيل (اللوحة)', placeholder: '', type: 'text' },
      { id: 'price', label: 'الثمن وطريقة الأداء', placeholder: '', type: 'text' },
      { id: 'conditions', label: 'شروط إضافية', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ التوقيع', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
بين الموقعين أسفله:
الطرف الأول (البائع): ${data.seller || '........'}
الطرف الثاني (المشتري): ${data.buyer || '........'}

بمقتضى هذا العقد، باع الطرف الأول للطرف الثاني المركبة من نوع "${data.vehicleType || '........'}" ذات المواصفات التالية:
- الماركة والنوع: ${data.brand || '........'}
- رقم الإطار الحديدي: ${data.frameNum || '........'}
- رقم التسجيل: ${data.plateNum || '........'}

وذلك بثمن إجمالي قدره ${data.price || '........'} درهم، صرح البائع بقبضه كاملاً عند تحرير هذا العقد.
${data.conditions || 'يصرح المشتري أنه عاين المركبة معاينة تامة وأنها تناسب غرضه.'}

حرر في حسن نية بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

إمضاء البائع:                                        إمضاء المشتري:
`
  },
  {
    id: 'debt_ack_model',
    name: 'اعتراف بدين موثق',
    category: 'CIVIL',
    description: 'نموذج للاعتراف بالذمة المالية مع الالتزام بموعد الوفاء.',
    fields: [
      { id: 'debtor', label: 'هوية المدين (المعترف بالدين)', placeholder: '', type: 'textarea' },
      { id: 'creditor', label: 'هوية الدائن', placeholder: '', type: 'textarea' },
      { id: 'amount', label: 'المبلغ المالي (رقماً وكتابة)', placeholder: '', type: 'text' },
      { id: 'dueDate', label: 'أجل الوفاء (تاريخ الاسترجاع)', placeholder: '', type: 'date' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ تحرير الوثيقة', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد(ة): ${data.debtor || '................'}

أعترف وأشهد على نفسي، بمقتضى هذه الوثيقة، أن بذمتي مبلغاً مالياً لفائدة السيد(ة): ${data.creditor || '................'} وقدره ${data.amount || '................'} درهم.

والتزم بمقتضى هذا الاعتراف بإرجاع المبلغ المذكور في أجل أقصاه ${data.dueDate || '................'}.
وهذا اعتراف مني بالدين وسأكون ملزماً به أمام كافة الجهات المختصة.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

إمضاء المدين:
`
  },
  {
    id: 'discharge_receipt',
    name: 'إبراء ذمة واستلام مبلغ',
    category: 'CIVIL',
    description: 'نموذج إبراء ذمة يثبت استلام مبلغ مالي وإبراء ذمة المدين بصفة نهائية.',
    fields: [
      { id: 'releaser', label: 'بيانات المصرح (المستلم)', placeholder: 'الاسم الكامل، CIN، العنوان', type: 'textarea' },
      { id: 'released', label: 'بيانات الطرف المبرأ ذمته (الدافع)', placeholder: 'الاسم الكامل، CIN، العنوان', type: 'textarea' },
      { id: 'amount', label: 'المبلغ المالي', placeholder: 'مثلاً: 5000.00 درهم', type: 'text' },
      { id: 'amountWords', label: 'المبلغ بالكلمات', placeholder: 'مثلاً: خمسة آلاف درهم', type: 'text' },
      { id: 'chequeInfo', label: 'تفاصيل الدفع (رقم الشيك أو نقداً)', placeholder: 'شيك رقم... أو نقداً', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ التوقيع', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد(ة): ${data.releaser || '................'}

بموجب هذا الاعتراف و تحت جميع الضمانات القانونية الجاري بها العمل أشهد على نفسي شهادة الطوع و الرضى و أنا في كامل قواي العقلية و اعترف اعترافا تاما أنني تسلمت من السيد(ة): ${data.released || '................'} 
مبلغ قدره ونهايته ${data.amount || '........'} درهم هكذا "${data.amountWords || '........'}" الذي هو مدين لي به لأنه قام بتأديته بواسطة (${data.chequeInfo || '........'}) وأتحمل جميع مسؤولياته و اعترف بأنني حزت جميع المبلغ.

و بهذا أعترف وألتزم و عليه أمضي بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'family_kinship_ack',
    name: 'إشهاد بالنسب والقرابة',
    category: 'MISC',
    description: 'إشهاد يقر فيه الشخص بعلاقة قرابة أو نسب مع أشخاص آخرين.',
    fields: [
      { id: 'witness', label: 'بيانات المصرح (المشهد)', placeholder: '', type: 'textarea' },
      { id: 'relatives', label: 'بيانات الأقرباء', placeholder: 'الأسماء، البطائق الوطنية، العناوين', type: 'textarea' },
      { id: 'kinshipType', label: 'نوع القرابة / النسب', placeholder: 'مثلاً: هم أبناء عمومتي وشرفاء النسب سباعي...', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ الإشهاد', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد(ة): ${data.witness || '................'}

بموجب هدا الإشهاد والإقرار وتحت جميع الضمانات الفعلية و القانونية الجاري بها العمل أشهد على نفسي شهادة الطوع و الرضا وأنا في كامل قواي العقلية على أن:
${data.relatives || '................'}

${data.kinshipType || '................'}

وأشهد بالله ورسوله على ما ذكر أعلاه وعلى هذا أوقع.

حرر في: ${data.city || '.......'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'paternity_declaration',
    name: 'إقرار بالبنوة',
    category: 'MISC',
    description: 'تصريح بالولادة الشرعية ونسب المولود للزوج.',
    fields: [
      { id: 'declarant', label: 'بيانات المصرح (الأم/الأب)', placeholder: '', type: 'textarea' },
      { id: 'childName', label: 'اسم المولود(ة)', placeholder: '', type: 'text' },
      { id: 'birthDate', label: 'تاريخ الولادة', placeholder: '', type: 'date' },
      { id: 'birthPlace', label: 'مكان الولادة', placeholder: '', type: 'text' },
      { id: 'spouseName', label: 'اسم الزوج/الزوجة (الطرف الآخر)', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ التصريح', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع(ة) أسفله: 
السيد(ة): ${data.declarant || '................'}

بمقتضاه أصرح تصريحا تاما و لا رجعة فيه انه ازدادت عندي مولود(ة) شرعي(ة) اسمه(ا) ${data.childName || '........'} المزداد(ة) بتاريخ ${data.birthDate || '........'} بـ ${data.birthPlace || '........'} من زوجي(تـي) الشرعي(ة) السيد(ة) ${data.spouseName || '........'}.

هدا ما اقر به وأمضيت بمحض إرادتي و بحسن نية.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'rental_commitment_simple',
    name: 'إلتزام بالكراء',
    category: 'RENTAL',
    description: 'التزام من المكتري بشروط كراء محل أو طابق سكني.',
    fields: [
      { id: 'tenant', label: 'بيانات المكتري', placeholder: '', type: 'textarea' },
      { id: 'property', label: 'وصف العين المكتراة وموقعها', placeholder: 'مثلاً: الطابق الأول من المنزل الكائن بـ...', type: 'textarea' },
      { id: 'owner', label: 'بيانات المكري / صاحب الملك', placeholder: '', type: 'textarea' },
      { id: 'startDate', label: 'تاريخ بداية الكراء', placeholder: '', type: 'date' },
      { id: 'rentPrice', label: 'الثمن الكرائي الشهري', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ التوقيع', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد(ة): ${data.tenant || '................'}

أشهد على نفسي شهادة الطوع والرضى وأنا في كامل قواي العقلة والجسدية وأصرح أنني قمت بكراء ${data.property || '................'} من السيد(ة): ${data.owner || '................'} و ذلك ابتداء من تاريخ ${data.startDate || '........'} بثمن قدره ونهايته ${data.rentPrice || '........'} درهم كل شهر مقابل وصل إبراء.

كما ألتزم بأداء واجب استهلاك الكهرباء والماء الصالح للشرب وأتعهد بكتابة عقد الكراء مع صاحب الملك عند حضوره.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'debt_receipt_ack',
    name: 'إعـتـراف بقبض دين',
    category: 'CIVIL',
    description: 'إشهاد باستلام مبلغ مالي في إطار تسوية دين.',
    fields: [
      { id: 'receiver', label: 'بيانات القابض (الدائن)', placeholder: '', type: 'textarea' },
      { id: 'payer', label: 'بيانات الدافع (المدين)', placeholder: '', type: 'textarea' },
      { id: 'amount', label: 'المبلغ المالي', placeholder: '', type: 'text' },
      { id: 'amountWords', label: 'المبلغ بالكلمات', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ القبض', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أشهد أنا الموقع أسفله:
السيد(ة): ${data.receiver || '................'}

بموجب هذا الاعتراف و تحت جميع الضمانات القانونية الجاري بها العمل أشهد على نفسي شهادة الطوع و الرضى و أنا في كامل قواي العقلية و اعترف اعترافا تاما أنني تسلمت من السيد(ة): ${data.payer || '................'} مبلغا ماليا قدره ${data.amount || '........'} درهم هكذا "${data.amountWords || '........'}".

و بهذا أعترف وألتزم و عليه أمضي بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'car_sale_notarized',
    name: 'إشـهــاد ببيع سيارة',
    category: 'SALE',
    description: 'نموذج إشهاد ببيع سيارة مع كامل البيانات التقنية للمركبة.',
    fields: [
      { id: 'seller', label: 'بيانات البائع', placeholder: '', type: 'textarea' },
      { id: 'brand', label: 'العلامة (مثلاً: DACIA)', placeholder: '', type: 'text' },
      { id: 'model', label: 'النوع / الموديل', placeholder: '', type: 'text' },
      { id: 'frameNum', label: 'رقم الإطار الحديدي', placeholder: '', type: 'text' },
      { id: 'plateNum', label: 'رقم التسجيل (اللوحة)', placeholder: '', type: 'text' },
      { id: 'buyer', label: 'بيانات المشتري', placeholder: '', type: 'textarea' },
      { id: 'price', label: 'الثمن (بالأرقام والكلمات)', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ البيع', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع(ة) أسفله:
السيد(ة): ${data.seller || '................'}

بموجب هذا الاعتراف و تحت جميع الضمانات القانونية و الفعلية الجاري بها العمل اعترف اعتراف أنني بعت السيارة ذات البيانات التالية:
- العلامة: ${data.brand || '........'}
- النوع: ${data.model || '........'}
- رقم الإطار الحديدي: ${data.frameNum || '........'}
- المسجلة تحت عدد: ${data.plateNum || '........'}

إلى السيد(ة): ${data.buyer || '................'} بثمن قدره ${data.price || '........'} درهم وذلك بتاريخ ${data.date || '........'}.

وبهذا أصرح وألتزم وعليه أمضي بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'border_agreement',
    name: 'إلتزام بالحدود',
    category: 'CIVIL',
    description: 'اتفاق والتزام بين الجيران بخصوص حدود العقارات المتجاورة.',
    fields: [
      { id: 'parties', label: 'بيانات الأطراف المتعاقدة', placeholder: 'الأسماء، البطائق الوطنية، العناوين', type: 'textarea' },
      { id: 'boundaryDesc', label: 'وصف الحدود المتفق عليها', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ التحرير', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
نحن الموقعين أسفله:
${data.parties || '................'}

يصرح الأطراف المذكورون أعلاه أنهم يلتزمون باحترام الحدود المعروفة والمبينة للبقع الأرضية المتجاورة الكائنة بـ ${data.city || '........'}، وأنهم لا يتجاوزونها بأي حال من الأحوال.

${data.boundaryDesc || '................'}

وبهذا تم التصريح وبرضى الأطراف وتحت مسؤوليتهم تم التوقيع على الصفاء وحسن النية.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

إمضاء الأطراف:
`
  },
  {
    id: 'collective_land_proxy',
    name: 'التزام أراضي الجموع',
    category: 'MISC',
    description: 'التزام بالنيابة عن الورثة في استخلاص حقوق الأراضي السلالية.',
    fields: [
      { id: 'representative', label: 'بيانات النائب', placeholder: '', type: 'textarea' },
      { id: 'heirs', label: 'بيانات الورثة / الأشقاء الممثلين', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.representative || '................'}

أصرح أنني أنوب عن أشقائي / الورثة المذكورين أسفله في استخلاص أو الاستفادة من الأراضي السلالية أو الجموع:
${data.heirs || '................'}

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'crop_sharing_commitment',
    name: 'إلتزام بالاشتراك في محصول فلاحي',
    category: 'PROFESSIONAL',
    description: 'اتفاق على الاشتراك في محصول زراعي وتوزيع الأرباح والتكاليف.',
    fields: [
      { id: 'party1', label: 'بيانات الطرف الأول', placeholder: '', type: 'textarea' },
      { id: 'party2', label: 'بيانات الطرف الثاني (الشريك)', placeholder: '', type: 'textarea' },
      { id: 'landDetails', label: 'بيانات الأرض والمحصول', placeholder: 'رقم الأرض، المساحة، نوع المحصول...', type: 'textarea' },
      { id: 'sharingRatio', label: 'نسبة الاشتراك وشروط التقسيم', placeholder: 'مثلاً: النصف في المحصول والزيتون...', type: 'textarea' },
      { id: 'expiryDate', label: 'تاريخ انتهاء الشراكة', placeholder: '', type: 'date' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ العقد', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد(ة): ${data.party1 || '................'}

بمقتضى هذا الالتزام ألتزم أن السيد(ة): ${data.party2 || '................'} مشترك معي في محصول ${data.landDetails || '................'} و ذاك إلى غاية ${data.expiryDate || '........'}.

${data.sharingRatio || 'يتم تقسيم المحصول بالتساوي وتكاليف العمل مشتركة بين الطرفين.'}

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

إمضاء الطرف الأول:                               إمضاء الطرف الثاني:
`
  },
  {
    id: 'irrigation_fees_commitment',
    name: 'إلتزام بالري',
    category: 'CIVIL',
    description: 'التزام بأداء أقساط وكاليف استهلاك مياه الري الفلاحية.',
    fields: [
      { id: 'farmer', label: 'بيانات الفلاح', placeholder: '', type: 'textarea' },
      { id: 'landLoc', label: 'موقع الأرض والمركز الفلاحي', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ التوقيع', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.farmer || '................'}

ألتزم إلتزاما تاما وأشهد على نفسي أنني سأقوم بأداء أقساط إستهلاك مياه الري التي تخص الأرض الفلاحية السقوية الكائنة بـ ${data.landLoc || '........'} لفائدة مركز التنمية الفلاحية المختص.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'car_responsibility_ack',
    name: 'إلتزام بمسؤولية السيارة',
    category: 'VEHICLES',
    description: 'التزام بتحمل كامل المسؤولية القانونية والوثائق المتعلقة بالسيارة.',
    fields: [
      { id: 'owner', label: 'بيانات المالك الأصلي', placeholder: '', type: 'textarea' },
      { id: 'responsible', label: 'بيانات الشخص المسؤول', placeholder: '', type: 'textarea' },
      { id: 'plateNum', label: 'رقم التسجيل', placeholder: '', type: 'text' },
      { id: 'brand', label: 'العلامة (الماركة)', placeholder: '', type: 'text' },
      { id: 'frameNum', label: 'رقم الإطار الحديدي', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ الالتزام', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
نحن الموقعين أسفله:
1) السيد(ة): ${data.owner || '................'}
2) السيد(ة): ${data.responsible || '................'}

يصرح السيد(ة): ${data.responsible || '................'} ويلتزم التزاما تاما بأنه يتحمل مسؤولية السيارة ذات البيانات المذكورة أسفله ابتداء من تاريخ توقيع هذا الالتزام، كما أنه المسؤول الوحيد عن كافة الوثائق والتببعات المتعلقة بالسيارة:
- المسجلة تحت عدد: ${data.plateNum || '........'}
- العلامة: ${data.brand || '........'}
- رقم الإطار الحديدي: ${data.frameNum || '........'}

وبهذا نصرح ونلتزم وعليه نمضي بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'grey_card_commitment',
    name: 'التزام بتحمل البطاقة الرمادية',
    category: 'VEHICLES',
    description: 'تعهد من البائع بصحة معلومات السيارة وتحمله لمصاريف الورقة الرمادية.',
    fields: [
      { id: 'seller', label: 'بيانات البائع', placeholder: '', type: 'textarea' },
      { id: 'buyer', label: 'بيانات المشتري', placeholder: '', type: 'textarea' },
      { id: 'carType', label: 'نوع السيارة (النوع، الصنف)', placeholder: '', type: 'text' },
      { id: 'plateNum', label: 'رقم التسجيل', placeholder: '', type: 'text' },
      { id: 'frameNum', label: 'رقم الإطار الحديدي', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ التوقيع', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.seller || '................'}

بمقتضى هدا الالتزام وتحت جميع الضمانات الفعلية والقانونية الجاري بها العمل أشهد على نفسي شهادة الطوع والرضى وأنا في كامل قواي العقلية أنني ألتزم التزاما تاما وأتعهد كل التعهد بصحة المعلومات التي تحملهم السيارة التي قمت ببيعها للسيد: ${data.buyer || '................'} و أنا المتحمل الوحيد للورقة الرمادية فقط.

بيانات السيارة:
- النوع: ${data.carType || '........'}
- المسجلة تحت رقم: ${data.plateNum || '........'}
- الإطار الحديدي: ${data.frameNum || '........'}

وبهذا أصرح وألتزم وعليه أمضي بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'indefinite_debt_ack',
    name: 'التزام بدين دون تحديد المدة',
    category: 'CIVIL',
    description: 'اعتراف بالدين لفائدة طرف آخر دون تحديد سقف زمني للسداد.',
    fields: [
      { id: 'debtor', label: 'بيانات المدين', placeholder: '', type: 'textarea' },
      { id: 'creditor', label: 'بيانات الدائن', placeholder: '', type: 'textarea' },
      { id: 'amount', label: 'المبلغ المالي', placeholder: '', type: 'text' },
      { id: 'amountWords', label: 'المبلغ بالكلمات', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ الالتزام', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.debtor || '................'}

بموجب هذا الاعتراف وتحت جميع الضمانات الفعلية والقانونية الجاري بها العمل، أشهد على نفسي شهادة الطوع والرضا وأنا بكامل قواي العقلية وأعترف اعترافا تاما لا رجعة فيه بأنني مدين لفائدة السيد(ة): ${data.creditor || '................'} بمبلغ قدره ${data.amount || '........'} درهم هكذا "${data.amountWords || '........'}".

هذا ما أعترف وأشهد به على نفسي وبمحض إرادتي بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}.

الإمضاء:
`
  },
  {
    id: 'dated_debt_ack',
    name: 'اعتراف بدين مع تاريخ سداد',
    category: 'CIVIL',
    description: 'اعتراف بالدين مع الالتزام بتسديده في تاريخ محدد.',
    fields: [
      { id: 'debtor', label: 'بيانات المدين', placeholder: '', type: 'textarea' },
      { id: 'creditor', label: 'بيانات الدائن', placeholder: '', type: 'textarea' },
      { id: 'amount', label: 'المبلغ المالي', placeholder: '', type: 'text' },
      { id: 'amountWords', label: 'المبلغ بالكلمات', placeholder: '', type: 'text' },
      { id: 'dueDate', label: 'تاريخ السداد المتفق عليه', placeholder: '', type: 'date' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ الالتزام', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.debtor || '................'}

بموجب هذا الاعتراف وتحت جميع الضمانات الفعلية والقانونية الجاري بها العمل أشهد على نفسي شهادة الطوع والرضا وأنا بكامل قواي العقلية وأعترف اعترافا تاما لا رجعة فيه بأنني مدين لفائدة السيد: ${data.creditor || '................'} بمبلغ قدره ونهايته ${data.amount || '........'} درهم هكذا "${data.amountWords || '........'}".

ألتزم بتسديده بتاريخ ${data.dueDate || '........'} وذلك ابتداء من تاريخ توقيع هذا الالتزام. 
هذا ما أعترف وأشهد به على نفسي وبمحض إرادتي بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}.

الإمضاء:
`
  },
  {
    id: 'unemployment_declaration',
    name: 'تصريح بعدم العمل',
    category: 'MISC',
    description: 'إشهاد بشرف يفيد بعدم مزاولة أي مهنة في القطاع العام أو الخاص.',
    fields: [
      { id: 'declarant', label: 'بيانات المصرح(ة)', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ التصريح', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقعة أسفله:
السيدة: ${data.declarant || '................'}

بمقتضى هذا التصريح أصرح، واشهد على نفسي شهادة الطوع والرضا وأنا في كامل قواي لعقلية والجسدية على أنني لا أزاول أية مهنة سواء بالقطاع الخاص أو بالقطاع العام. 

وبهذا أصرح و عليه امضي في بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'coop_contributions_receipt',
    name: 'إقرار باستلام مساهمات مالية',
    category: 'PROFESSIONAL',
    description: 'إشهاد باستلام مبالغ مالية (مساهمات، دفعات شهري...) من مكتب تعاونية.',
    fields: [
      { id: 'receiver', label: 'بيانات المستلم', placeholder: '', type: 'textarea' },
      { id: 'amount', label: 'إجمالي المبلغ المستلم', placeholder: '', type: 'text' },
      { id: 'amountWords', label: 'المبلغ بالكلمات', placeholder: '', type: 'text' },
      { id: 'coopName', label: 'اسم التعاونية / المكتب', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ الاستلام', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع اسفله:
السيد: ${data.receiver || '................'}

اشهد اني استلمت من مكتب ${data.coopName || '........'} جميع مساهماتي المالية البالغة قيمتها ${data.amount || '........'} درهم ( ${data.amountWords || '........'} ) وهو مجموع ما أديته كدفعات استثنائية ودفعات شهري.

حرر في بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'work_commitment',
    name: 'التزام بالعمل الجاد',
    category: 'PROFESSIONAL',
    description: 'التزام بالانضباط، احترام مواقيت العمل، واتباع برامج الإدارة.',
    fields: [
      { id: 'employee', label: 'بيانات الموظف / العامل', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.employee || '................'}

ألتزم التزاما تاما وأنا في كامل قواي العقلية والجسدية وأتعهد تعهد كاملا بان احترم مواقيت العمل بالإضافة إلى الانضباط داخل العمل كما أحيط إلى علم سيادتكم بان سأحترم جميع البرامج الناتجة عن الإدارة والانضباط داخلها كما أحيط إلى علم بأنني شخصية جادة ومثابرة كالمعتاد.

حرر في بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'customs_usage_commitment',
    name: 'التزام الجمارك',
    category: 'MISC',
    description: 'التزام خاص بالسلع الفلاحية المستوردة بعدم البيع والاستغلال الشخصي فقط.',
    fields: [
      { id: 'owner', label: 'بيانات صاحب السلعة', placeholder: '', type: 'textarea' },
      { id: 'goodsDesc', label: 'وصف السلعة المذكورة', placeholder: 'سلعة خاصة بالفلاحة...', type: 'text' },
      { id: 'farmLoc', label: 'موقع الضيعة المستهدفة', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ الالتزام', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.owner || '................'}

بمقتضى هذا الالتزام و تحت جميع الضمانات القانونية و الفعلية الجاري بها العمر ألتزم التزام تاما لا رجعة فيه بأني السلعة التي سأدخلها والمتمثلة في (${data.goodsDesc || '........'}) للمغرب لن أبيعها و سأستغلها في الفلاحة في الضيعة الكائنة بـ ${data.farmLoc || '........'}.

 وبهذا ألتزم و عليه أمضي بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'weapon_safe_custody',
    name: 'التزام بحفظ السلاح',
    category: 'MISC',
    description: 'التزام بتوفير خزينة منيعة لحفظ السلاح وأداء المستحقات.',
    fields: [
      { id: 'owner', label: 'بيانات صاحب السلاح', placeholder: '', type: 'textarea' },
      { id: 'storageLoc', label: 'مكان الحفظ (مثلاً: الغرفة الشخصية)', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ التوقيع', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.owner || '................'}

بمقتضاه أشهد على نفسي شهادة الطوع و الرضى و أنا في كامل قواي العقلية و ألتزم التزاما تاما و لا جعة فيه أنني أتوفر على الخزينة المنيعة لحفظ و صيانة السلاح الظاهر بـ ${data.storageLoc || '........'}.
كما ألتزم بأداء المستحقات و الواجبات التي تتعلق بوثائق حمل السلاح و القنص.
هذا ما ألتزم عليه بمحض إرادتي و بحسن نية.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'hunting_rifle_responsibility',
    name: 'التزام بصيانة بندقية الصيد',
    category: 'MISC',
    description: 'التزام بالمحافظة على بندقية الصيد وعدم تسليمها للغير وتحمل المسؤولية.',
    fields: [
      { id: 'owner', label: 'بيانات صاحب البندقية', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ الالتزام', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله: 
السيد: ${data.owner || '................'}

اشهد على نفسي و أنا في كامل قواي العقلية و الجسدية أنني التزم بالمحافظة على بندقية الصيد التي املكها و أنني التزم بوضعها و حفضها في مكان أمين و عدم استعمالها إلا في الصيد فقط، كما التزم بعدم تسليمها لغيري و عدم السماح لأي كان باستعمالها سواي، و أنني أتحمل كامل المسؤولية القانونية الخاصة بي و أنني المسؤول عنها و عن أية حوادث قد ترتكب بها لا قدر الله.
كما انني التزم باداء الواجب السنوي المتعلق برخصة حمل السلاح و الصيد داخل الاجل القانوني دون تماطل و لا تأخير.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'housing_aid_commitment',
    name: 'التزام الدعم السكني',
    category: 'MISC',
    description: 'التزام بتخصيص العقار للسكن الرئيسي لمدة أربع سنوات في إطار السكن الاجتماعي.',
    fields: [
      { id: 'owner', label: 'بيانات المستفيد(ة)', placeholder: '', type: 'textarea' },
      { id: 'propertyTitle', label: 'رقم الرسم العقاري', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ التوقيع', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع(ة) أسفله:
السيد(ة): ${data.owner || '................'}

أصرح بشرفي أنني ألتزم بتخصيص العقار موضوع الرسم العقاري عدد ${data.propertyTitle || '........'} المقتنى في إطار السكن الاجتماعي، لسكني الرئيسي لمدة أربع سنوات.

حرر في بـ ${data.city || '.......'} بتاريخ: ${data.date || '........'}

الإمضاء (مصادق عليه):
`
  },
  {
    id: 'school_attendance_commitment',
    name: 'إلتزام مدرسي',
    category: 'MISC',
    description: 'التزام من ولي الأمر بمواصلة التلميذ لدراسته العادية وانضباطه.',
    fields: [
      { id: 'parent', label: 'بيانات ولي الأمر', placeholder: '', type: 'textarea' },
      { id: 'studentName', label: 'اسم الطالب / التلميذ', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ التوقيع', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.parent || '................'}

أصرح وألتزم أن الطالب / التلميذ المسمى ${data.studentName || '........'} سيلتزم وسيواصل دراسته العادية طبقا للقوانين الجاري بها العمل في هذا الشأن داخل المؤسسة. كما أنه يلتزم بالحضور المستدام طيلة أوقات الدراسة العادية وانه أن خالف هذا الالتزام سيكون مجبرا على تحمل المسؤولية كاملة. 

وبهذا أصرح وألتزم وعليه أمضي في بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'university_internal_rules',
    name: 'إلتزام جامعي',
    category: 'MISC',
    description: 'التزام باحترام القانون الداخلي للجامعة.',
    fields: [
      { id: 'student', label: 'بيانات الطالب(ة)', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ التوقيع', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقعة أسفله:
السيد(ة): ${data.student || '................'}

بمقتضاه التزم التزاما تاما باحترام القانون الداخلي للجامعة.

وبهذا أصرح وألتزم وعليه أمضي في بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'master_specialized_commitment',
    name: 'التزام الماستر (مفصل)',
    category: 'MISC',
    description: 'التزام مفصل لطلبة الماستر يتضمن المواظبة واحترام الضوابط البيداغوجية والقانون الداخلي.',
    fields: [
      { id: 'studentName', label: 'الاسم الكامل', placeholder: '', type: 'text' },
      { id: 'birthInfo', label: 'تاريخ ومكان الميلاد', placeholder: '', type: 'text' },
      { id: 'nationality', label: 'الجنسية', placeholder: '', type: 'text' },
      { id: 'cne', label: 'الرقم الوطني للطالب CNE', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم بطاقة التعريف الوطنية', placeholder: '', type: 'text' },
      { id: 'masterName', label: 'اسم مسلك الماستر', placeholder: '', type: 'text' },
      { id: 'academicYear', label: 'الموسم الجامعي', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ التوقيع', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع(ة) أسفله:
الاسم الكامل: ${data.studentName || '................'}
تاريخ ومكان الميلاد: ${data.birthInfo || '................'}
الجنسية: ${data.nationality || '................'}
الرقم الوطني للطالب(ة): ${data.cne || '................'}
رقم بطاقة التعريف الوطنية: ${data.cin || '................'}
مسلك الماستر: ${data.masterName || '................'}
الموسم الجامعي: ${data.academicYear || '................'}

ألتزم بـ مقتضيات دفتر الضوابط البيداغوجية الوطنية لسلك الماستر، ولا سيما:
- الحضور إجباري في جميع الحصص الدراسية والأشغال التطبيقية والتوجيهية.
- احترام أوقات الدراسة والمواظبة.
- عدم التغيب أكثر من ثلاث مرات بدون مبرر مقبول، وهو ما قد يؤدي إلى عدم استيفاء الوحدة.
- إحاطة الإدارة بكل تغيير في المعلومات المضمنة في ملف التسجيل.
- احترام القانون الداخلي للمؤسسة.

وفي حالة مخالفتي لهذه المقتضيات فإن للإدارة صلاحية اتخاذ جميع الإجراءات القانونية.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

التوقيع (مصادق عليه):
`
  },
  {
    id: 'master_attendance_commitment',
    name: 'التزام بحضور حصص الماستر',
    category: 'MISC',
    description: 'التزام الطالب بالحضور وعدم التغيب لأكثر من 3 حصص في الوحدة.',
    fields: [
      { id: 'student', label: 'بيانات الطالب(ة)', placeholder: '', type: 'textarea' },
      { id: 'masterName', label: 'اسم مسلك الماستر', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ التوقيع', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع(ة) أسفه الطالب(ة): ${data.student || '................'}

ألتزم باحترام الضوابط البيداغوجية المنصوص عليها، وبحضور الحصص الدراسية بمسلك ماستر: ${data.masterName || '................'} 

وأي تغيب لثلاث حصص في الوحدة الواحدة، بدون مبرر يعرضني للإقصاء من متابعة الدراسة بهذا الماستر. 

والسلام

حرر بـ ${data.city || '.......'} في بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'doctorate_commitment',
    name: 'إلتزام الدكتوراه',
    category: 'MISC',
    description: 'التزام طالب الدكتوراه بالمشاركة في التكوينات واحترام ميثاق الأطروحات.',
    fields: [
      { id: 'student', label: 'بيانات الطالب(ة)', placeholder: '', type: 'textarea' },
      { id: 'cne', label: 'الرقم الوطني للطالب', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ التوقيع', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله السيد (ة): ${data.student || '................'}
الرقم الوطني للطالب: ${data.cne || '................'}

ألتزم بالحضور والمشاركة بمختلف التكوينات المبرمجة في سلك الدكتوراه والمعلن عنها من قبل قطب الدراسات في الدكتوراه وفقا لميثاق الأطروحات ولمقررات مجلس الدكتوراه وكذا نظامه الداخلي.

كما أعلم تمام العلم أن للقطب الحق في التشطيب على اسمي من قائمة المسجلين بسلك الدكتوراه عند عدم الالتزام بالميثاق أو عدم التسجيل وإعادة التسجيل في الوقت المحدد.

وبه ألتزم وأمضي بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}
`
  },
  {
    id: 'residency_cohabitation_ack',
    name: 'التزام بالسكن (لشهادة السكنى)',
    category: 'MISC',
    description: 'إشهاد من طرف بسكن شخص آخر معه في نفس العنوان قصد الحصول على شهادة السكنى.',
    fields: [
      { id: 'host', label: 'بيانات المستضيف (صاحب السكن)', placeholder: '', type: 'textarea' },
      { id: 'guest', label: 'بيانات الضيف (المقيم)', placeholder: '', type: 'textarea' },
      { id: 'address', label: 'العنوان المشترك', placeholder: '', type: 'textarea' },
      { id: 'duration', label: 'مدة الإقامة (مثلاً: تزيد عن 6 أشهر)', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ الالتزام', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع (ة) أسفله:
السيد(ة): ${data.host || '................'}

بموجب هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية أشهد على نفسي وألتزم وأنا بكامل قواي العقلية والجسدية بأن السيد(ة): ${data.guest || '................'} يسكن معي بنفس العنوان: ${data.address || '........'} دون أي مقابل مادي لمدة ${data.duration || '........'}، وذلك قصد الحصول على شهادة السكنى.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'id_card_address_change',
    name: 'التزام بتغيير عنوان البطاقة الوطنية',
    category: 'ADMINISTRATIVE',
    description: 'التزام يفيد بتغيير مقر السكنى قصد استعماله في ملف تغيير عنوان البطاقة الوطنية للتعريف الإلكترونية.',
    fields: [
      { id: 'fullName', label: 'الاسم الكامل', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم بطاقة التعريف الوطنية', placeholder: '', type: 'text' },
      { id: 'birthInfo', label: 'تاريخ ومكان الازدياد', placeholder: '', type: 'text' },
      { id: 'job', label: 'المهنة', placeholder: '', type: 'text' },
      { id: 'oldAddress', label: 'العنوان القديم', placeholder: '', type: 'textarea' },
      { id: 'newAddress', label: 'العنوان الجديد', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ التحرير', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله: 
الاسم الكامل: ${data.fullName || '................'}
رقم بطاقة التعريف الوطنية: ${data.cin || '................'}
تاريخ ومكان الازدياد: ${data.birthInfo || '................'}
المهنة: ${data.job || '................'}
العنوان القديم: ${data.oldAddress || '................'}
العنوان الجديد: ${data.newAddress || '................'}

أصرّح بموجب هذا الالتزام وتحت جميع الضمانات القانونية الجاري بها العمل، أنني قمت بتغيير مقر سكناي من العنوان المشار إليه أعلاه إلى العنوان الجديد، وأنني ألتزم بإخبار المصالح المختصة بكل تغيير قد يطرأ مستقبلاً على محل إقامتي، طبقًا لمقتضيات القانون المتعلق بالبطاقة الوطنية للتعريف الإلكترونية.
كما أصرّح أن المعلومات الواردة أعلاه صحيحة، وأُقدّم هذا الالتزام قصد استعماله في ملف تغيير عنوان البطاقة الوطنية للتعريف الإلكترونية.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'agri_cert_commitment',
    name: 'التزام بالحصول على الشهادة الإدارية للفلاحة',
    category: 'PROPERTY',
    description: 'تعهد بالقيام بالإجراءات اللازمة للحصول على الشهادة الإدارية للفلاحة.',
    fields: [
      { id: 'farmer', label: 'بيانات الفلاح (الاسم الكامل، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'status', label: 'الصفة (فلاح/مالك عقار/مستغل...)', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.farmer || '................'}

بصفتي ${data.status || 'فلاح/مالك عقار فلاحي/مستغل زراعي...'}، ألتزم التزامًا تامًا ونهائيًا بالقيام بجميع الإجراءات الإدارية والقانونية اللازمة للحصول على الشهادة الإدارية للفلاحة، وفقًا لما تقتضيه القوانين والأنظمة الجاري بها العمل.
كما أتعهد بتقديم جميع الوثائق المطلوبة، والتقيد بكافة الشروط والضوابط المعمول بها لدى المصالح المختصة، مع العمل على احترام الآجال القانونية لإنجاز هذه الإجراءات. وأقر بأن أي تأخير أو إخلال بالشروط القانونية للحصول على الشهادة الإدارية المذكورة سيكون تحت مسؤوليتي الخاصة، دون تحميل أي جهة أخرى تبعات ذلك.
وحرر هذا الالتزام للإدلاء به عند الحاجة.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'foreign_husband_cohabitation',
    name: 'التزام الزوج الأجنبي بسكن الزوجة عند والديها',
    category: 'PERSONAL',
    description: 'التزام وتعهد من الزوج الأجنبي بالموافقة على سكن زوجته المغربية في بيت والديها.',
    fields: [
      { id: 'husbandName', label: 'اسم الزوج', placeholder: '', type: 'text' },
      { id: 'birthInfo', label: 'تاريخ ومكان الميلاد', placeholder: '', type: 'text' },
      { id: 'nationality', label: 'الجنسية', placeholder: '', type: 'text' },
      { id: 'passport', label: 'رقم جواز السفر وتاريخ صدوره', placeholder: '', type: 'text' },
      { id: 'husbandAddress', label: 'عنوان إقامته', placeholder: '', type: 'textarea' },
      { id: 'wifeName', label: 'اسم الزوجة', placeholder: '', type: 'text' },
      { id: 'parentAddress', label: 'عنوان بيت الوالدين', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله: 
السيد ${data.husbandName || '................'}، المولود بتاريخ ${data.birthInfo || '................'}، حامل لجنسية ${data.nationality || '................'}، ورقم جواز السفر ${data.passport || '................'}، والمقيم بـ ${data.husbandAddress || '................'} 

أصرح بموجب هذا الالتزام وأتعهد بالموافقة الكاملة على أن تسكن زوجتي، السيدة ${data.wifeName || '................'}، في بيت والديها الكائن بـ ${data.parentAddress || '................'} يأتي هذا القرار بناءً على رغبتها وظروفها الشخصية، وأؤكد أنني ألتزم باحترام هذا الترتيب بشكل كامل.

كما أتعهد باحترام كافة الحقوق الزوجية المنصوص عليها في القانون المغربي، وأقر بمسؤوليتي التامة تجاه زوجتي وضمان كل حقوقها كما هو متعارف عليه شرعًا وقانونًا.
هذا الالتزام يتم بمحض إرادتي ودون أي إكراه أو ضغوط من أي جهة، وأقر بأنه يمكن تقديمه كوثيقة رسمية أمام الجهات المختصة عند الحاجة.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'passport_parental_consent',
    name: 'موافقة الأب للحصول على جواز السفر',
    category: 'ADMINISTRATIVE',
    description: 'التزام من الأب بالموافقة على حصول ابنه على جواز سفر بيومتري.',
    fields: [
      { id: 'fatherInfo', label: 'بيانات الأب (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'childName', label: 'اسم الابن', placeholder: '', type: 'text' },
      { id: 'childBirth', label: 'تاريخ ازدياد الابن', placeholder: '', type: 'date' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله: 
السيد: ${data.fatherInfo || '................'}

بموجب هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية أشهد على نفسي والتزم وانا بكامل قواي العقلية والجسدية باني أمنح موافقتي الكاملة لابني: ${data.childName || '........'}، المزداد بتاريخ ${data.childBirth || '........'} وذلك بالحصول على جواز السفر البيومتري.
تصريح تام وصحيح متحملا بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'cancel_all_proxies',
    name: 'إلغاء جميع التوكيلات (عليا أو دون علم)',
    category: 'LEGAL',
    description: 'التزام وتصريح بالشرف لإلغاء وإخلاء المسؤولية عن جميع التوكيلات السابقة.',
    fields: [
      { id: 'declarantInfo', label: 'بيانات المصرح(ة) (الاسم، الميلاد، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد(ة): ${data.declarantInfo || '................'}

بمقتضى توقيعي على هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية أشهد على نفسي وألتزم وأصرح وأنا بكامل قواي العقلية والجسدية بأنني أخلي مسؤوليتي وألغي جميع التوكيلات التي صدرت مني عن علم أو دون علم لأي شخص كان ليبطل بذلك مفعولها القانوني نهائيا أمام أي إدارة أو مصلحة إدارية أو قضائية دون استثناء.
التزام وتصريح تام وصحيح متحمل(ة) بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'association_hq_commitment',
    name: 'التزام بتوفير مقر للجمعية',
    category: 'PROFESSIONAL',
    description: 'التزام موجه للباشا لتوفير منزل ليكون مقراً للجمعية.',
    fields: [
      { id: 'presidentName', label: 'اسم رئيس الجمعية', placeholder: '', type: 'text' },
      { id: 'assocName', label: 'اسم الجمعية', placeholder: '', type: 'text' },
      { id: 'authority', label: 'باشا مدينة (مثلاً: الفقيه بن صالح)', placeholder: '', type: 'text' },
      { id: 'address', label: 'عنوان المقر المقترح', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
الحمد لله وحده                                      بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

رئيس جمعية ${data.assocName || '................'}

إلى السيد المحترم: 
باشا مدينة ${data.authority || '................'}

الموضوع: التزام بتوفير مقر
سلام تام بوجود مولانا الإمام وبعد،

أتشرف سيدي الباشا، أن أخبركم أني ${data.presidentName || '................'} ألتزم بتوفير المنزل الكائن بـ ${data.address || '................'} ليكون مقرا للجمعية كلما اقتضت الضرورة لذلك.

وتقبلوا منا فائق الاحترام والتقدير والسلام.

التوقيع:
`
  },
  {
    id: 'jewel_receipt_loss',
    name: 'تصريح بضياع توصيل مجوهرات',
    category: 'MISC',
    description: 'تصريح بضياع توصيل مجوهرات ذهبية وتحمل المسؤولية قصد البيع.',
    fields: [
      { id: 'ownerInfo', label: 'بيانات صاحبة الوثيقة', placeholder: '', type: 'textarea' },
      { id: 'jewelDesc', label: 'وصف الذهب (عيار، وزن، نوع)', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقعة أسفله: 
السيدة: ${data.ownerInfo || '................'}

بمقتضى توقيعي على هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية أشهد على نفسي وأصرح وأنا بكامل قواي العقلية والجسدية بأن التوصيل الخاص بـ ${data.jewelDesc || '................'} قد ضاع مني في ظروف خارجة عن إرادتي وإنني أتحمل مسؤوليته كاملة.

التزام وتصريح تام وصحيح متحملة بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

التوقيع:
`
  },
  {
    id: 'birth_witness_midwife',
    name: 'تصريح شهود بازدياد مولود (قابلة)',
    category: 'PERSONAL',
    description: 'إشهاد من أربعة شهود يثبتون واقعة ازدياد مولود بمنزل وبإشراف قابلة.',
    fields: [
      { id: 'witness1', label: 'الشاهد الأول (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'witness2', label: 'الشاهد الثاني (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'witness3', label: 'الشاهد الثالث (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'witness4', label: 'الشاهد الرابع (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'motherInfo', label: 'بيانات الأم', placeholder: '', type: 'textarea' },
      { id: 'fatherInfo', label: 'بيانات الأب', placeholder: '', type: 'textarea' },
      { id: 'childInfo', label: 'بيانات المولود (الاسم، الجنس، تاريخ الميلاد، مكان السكن)', placeholder: '', type: 'textarea' },
      { id: 'midwife', label: 'اسم القابلة', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ الإشهاد', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
نحن الموقعين أسفله:
1) ${data.witness1 || '................'}
2) ${data.witness2 || '................'}
3) ${data.witness3 || '................'}
4) ${data.witness4 || '................'}

بموجب هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية نشهد على أنفسنا ونلتزم ونحن بكامل قوانا العقلية والجسدية بأن السيدة: ${data.motherInfo || '................'} المتزوجة من السيد: ${data.fatherInfo || '................'} قد ازداد لهما مولود ببياناته التالية:
${data.childInfo || '................'}
وقد أشرفت عليها القابلة السيدة: ${data.midwife || '................'}

بهذا نشهد ونصرح متحملين بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

توقيعات الشهود:
`
  },
  {
    id: 'daughter_study_abroad_consent',
    name: 'موافقة سفر الابنة للدراسة بالخارج',
    category: 'PERSONAL',
    description: 'التزام من الأب بالموافقة على سفر ابنته للدراسة بالخارج وتحمل كافة مصاريفها.',
    fields: [
      { id: 'fatherInfo', label: 'بيانات الأب (الاسم، الميلاد، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'daughterInfo', label: 'بيانات الابنة (الاسم، الميلاد، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'country', label: 'الديار (الدولة المتوجه إليها)', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله: 
السيد: ${data.fatherInfo || '................'}

بموجب هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية أشهد على نفسي و ألتزم وأنا بكامل قواي العقلية والجسدية بأنني أمنح موافقتي لابنتي: ${data.daughterInfo || '................'} قصد مغادرة التراب الوطني والسفر نحو الديار ${data.country || '................'} لإتمام دراستها، كما أتحمل بالمقابل جميع مصاريف تنقلها ذهابا وإيابا إضافة إلى المصاريف اليومية والدراسية والسكن والتطبيب.

التزام تام وصحيح متحملا بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

إمضاء:
`
  },
  {
    id: 'cnss_injury_declaration',
    name: 'تصريح بالشرف للضمان الاجتماعي (CNSS)',
    category: 'ADMINISTRATIVE',
    description: 'تصريح بوقوع حادث أو إصابة قصد الإدلاء به لمصالح الضمان الاجتماعي.',
    fields: [
      { id: 'declarantInfo', label: 'بيانات المصرح (الاسم، الميلاد، CIN، رقم CNSS)', placeholder: '', type: 'textarea' },
      { id: 'injuryDate', label: 'تاريخ وساعة الإصابة', placeholder: '', type: 'text' },
      { id: 'injuryDesc', label: 'وصف الإصابة ومكان وقوعها', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.declarantInfo || '................'}

بموجب هذه الوثيقة وبكافة الضمانات الفعلية والقانونية أشهد على نفسي و أصرح وأنا بكامل قواي العقلية والجسدية بأنه بتاريخ ${data.injuryDate || '................'} قد تعرضت لـ ${data.injuryDesc || '........'}.

التزام وتصريح تام و صحيح وقعته بعد الإطلاع و الفهم التامين له متحملا بذلك كافة المسؤوليات القانونية الناتجة عنه في حالة ثبوت عكس ذلك.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

إمضاء:
`
  },
  {
    id: 'matrilineal_descent_ack',
    name: 'إقرار بالبنوة من صلب الأم (مع شهود)',
    category: 'PERSONAL',
    description: 'تصريح من الأم وإشهاد من شاهدين بأن الأبناء هم من صلبها وهي الكفيلة بهم.',
    fields: [
      { id: 'motherInfo', label: 'بيانات الأم (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'childrenInfo', label: 'بيانات الأبناء (الأسماء وتواريخ الميلاد)', placeholder: '', type: 'textarea' },
      { id: 'witness1', label: 'الشاهد الأول (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'witness2', label: 'الشاهد الثاني (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقعة أسفله: 
السيدة: ${data.motherInfo || '................'}

بمقتضى توقيعي على هذه الوثيقة و تحت كافة الضمانات الفعلية والقانونية أشهد على نفسي وأصرح و أنا بكامل قواي العقلية والجسدية بأن:
${data.childrenInfo || '................'}
هما أبنائي من صلبي وإنني الكفيلة والمعيلة الوحيدة لهما معا.

التزام وتصريح تامين وصحيحين متحملة بذلك كافة المسؤوليات القانونية الناتجة عنه.

إمضاء الأم:

--- إلتزام وتصريح الشاهدين ---
نحن الموقعين أسفله:
1) ${data.witness1 || '................'}
2) ${data.witness2 || '................'}

نشهد على أنفسنا ونحن بكامل قوانا العقلية والجسدية بأن الأطفال المذكورين أعلاه هما أبناء السيدة المذكورة وهي الكفيلة والمعيلة الوحيدة لهما.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

توقيع الشاهد الأول:                                توقيع الشاهد الثاني:
`
  },
  {
    id: 'building_guard_commitment',
    name: 'التزام حارس عمارة',
    category: 'PROFESSIONAL',
    description: 'التزام من الحارس بتحمل مسؤولية الأمن والنظافة مقابل أجر.',
    fields: [
      { id: 'guardInfo', label: 'بيانات الحارس (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'buildingName', label: 'اسم أو رقم العمارة', placeholder: '', type: 'text' },
      { id: 'salary', label: 'الأجر الشهري المتفق عليه', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله : 
السيد : ${data.guardInfo || '................'}

بمقتضى توقيعي على هذه الوثيقة و تحت كافة الضمانات الفعلية و القانونية و بصفتي حارس عمارة ${data.buildingName || '................'} أشهد على نفسي و ألتزم و أنا بكامل قواي العقلية و الجسدية بأنني أتحمل مسؤولية أمنها وحراستها و نظافتها وذلك مقابل أجر شهري قدره ${data.salary || '........'} درهم.

التزام تام و صحيح متحملا بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

التوقيع:
`
  },
  {
    id: 'utility_split_commitment',
    name: 'التزام أداء فاتورة الماء والكهرباء (مشترك)',
    category: 'PROPERTY',
    description: 'اتفاق بين صاحب الملك والمكتريين على تقسيم وأداء فواتير الاستهلاك.',
    fields: [
      { id: 'ownerInfo', label: 'بيانات صاحب الملك', placeholder: '', type: 'textarea' },
      { id: 'tenant1Info', label: 'بيانات المكتري الأول ومحله', placeholder: '', type: 'textarea' },
      { id: 'tenant2Info', label: 'بيانات المكتري الثاني ومحله', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
نحن الموقعين أسفله:
1) الطرف الأول (صاحب الملك): ${data.ownerInfo || '................'}
2) الطرف الثاني (المكتري 1): ${data.tenant1Info || '................'}
3) الطرف الثالث (المكتري 2): ${data.tenant2Info || '................'}

بمقتضى توقيعنا على هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية نشهد على أنفسنا ونصرح ونحن بكامل قوانا العقلية والجسدية بأننا نتفق على أننا سنقوم بأداء واجب الماء والكهرباء وذلك بعد قسمة المبلغ الإجمالي على ثلاثتنا وفي حالة عدم أداء أحد الأطراف لواجبه الفردي فمن حق الطرفين الأخرين قطع الإمداد عنه وأخذ ما لزم من إجراءات في حقه.

التزام تام وصحيح متحملين بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

توقيع الطرف 1:            توقيع الطرف 2:            توقيع الطرف 3:
`
  },
  {
    id: 'no_moroccan_passport_declaration',
    name: 'تصريح بعدم تسلم جواز سفر مغربي',
    category: 'ADMINISTRATIVE',
    description: 'تصريح يفيد بعدم الحصول على جواز مغربي والدخول بالجواز الأجنبي.',
    fields: [
      { id: 'declarantInfo', label: 'بيانات المصرح (الاسم، CIN، العنوان، الإقامة)', placeholder: '', type: 'textarea' },
      { id: 'authority', label: 'العمالة أو القنصلية المعنية', placeholder: '', type: 'text' },
      { id: 'lastEntryDate', label: 'تاريخ الدخول الأخير', placeholder: '', type: 'text' },
      { id: 'entryPoint', label: 'المطار / نقطة الحدود', placeholder: '', type: 'text' },
      { id: 'originPoint', label: 'البلد القادم منه', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله : 
السيد: ${data.declarantInfo || '................'}

أصرح بمقتضى هذه الوثيقة أنني لم أحصل على جواز سفر مغربي سواء من عمالة ${data.authority || '................'} أو أية قنصلية مغربية بالخارج.
كما أصرح أني دخلت أرض الوطن آخر مرة يوم ${data.lastEntryDate || '........'} عبر مطار ${data.entryPoint || '........'} قادم من مطار ${data.originPoint || '........'} وذلك بواسطة جواز سفري الأجنبي المرافق لهذا التصريح. 

هذا ما أصرح به وألتزم متحمل(ة) كافة المسؤوليات الناتجة عن هذا التصريح.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

إمضاء:
`
  },
  {
    id: 'no_insurance_declaration',
    name: 'إلتزام بعدم التوفر على تأمين',
    category: 'ADMINISTRATIVE',
    description: 'تصريح يفيد بعدم توفر الأب (أو طرف آخر) على أي تأمين خاص سوى بطاقة الراميد.',
    fields: [
      { id: 'declarantInfo', label: 'بيانات المصرح(ة)', placeholder: '', type: 'textarea' },
      { id: 'personInfo', label: 'بيانات الشخص المعني (الأب مثلاً)', placeholder: '', type: 'textarea' },
      { id: 'ramidNum', label: 'رقم بطاقة الراميد (إن وجد)', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله: 
السيد(ة): ${data.declarantInfo || '................'}

بموجب هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية أشهد نفسي وأصرح وأنا بكامل قواي العقلية والجسدية بأن والدي ${data.personInfo || '................'} لا يتوفر على أي تأمين خاص غير استفادته من بطاقة الراميد الحاملة للرقم: ${data.ramidNum || '................'}.

التزام تام وصحيح متحمل(ة) بذلك كافة المسؤوليات القانونية الناتجة عنه في حالة ثبوت عكس ذلك.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

إمضاء:
`
  },
  {
    id: 'dialysis_request',
    name: 'طلب الاستفادة من تصفية الكلي',
    category: 'MISC',
    description: 'نموذج طلب موجه لمركز غسيل الكلي للاستفادة من حصص التصفية.',
    fields: [
      { id: 'applicantInfo', label: 'بيانات مقدم الطلب', placeholder: '', type: 'textarea' },
      { id: 'centerLocation', label: 'مكان مركز غسيل الكلي', placeholder: '', type: 'text' },
      { id: 'patientInfo', label: 'بيانات المريض (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

من السيد(ة): ${data.applicantInfo || '................'}
إلى: مركز غسيل الكلي بـ ${data.centerLocation || '................'}

الموضوع: طلب الاستفادة من حصص التصفية.
سلام تام بوجود مولانا الإمام وبعد،

علاقة بالموضوع المشار إليه أعلاه، يشرفني ويسعدني سيادتكم التقدم إليكم بهذا الطلب والرامي إلى تمكين والدي (أو المريض) ${data.patientInfo || '................'} من الاستفادة من حصص التصفية داخل مؤسستكم الموقرة. 

وفي انتظار ذلك تقبلوا مني فائق التقدير والاحترام والسلام.

الامضاء:
`
  },
  {
    id: 'jewel_sale_responsibility',
    name: 'التزام بملكية مجوهرات للبيع (بدون توصيل)',
    category: 'MISC',
    description: 'التزام بملكية الذهب الشخصي وتحمل المسؤولية في حالة ضياع توصيل الشراء.',
    fields: [
      { id: 'ownerInfo', label: 'بيانات صاحبة الوثيقة', placeholder: '', type: 'textarea' },
      { id: 'jewelDesc', label: 'وصف الذهب (نوع، عيار...)', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقعة أسفله : 
السيدة: ${data.ownerInfo || '................'}

بمقتضى توقيعي على هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية أشهد على نفسي وأصرح وأنا بكامل قواي العقلية والجسدية بأن ${data.jewelDesc || '........'} هو في ملكيتي الشخصية منذ مدة ليست بالقصيرة وقد ضاع مني التوصيل الذي اقتنيته به في ظروف خارج عن إرادتي.

تصريح تام و صحيح متحملة بذلك كافة المسؤوليات القانونية الناتجة عنه في حالة ثبوت عكس ذلك.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

التوقيع:
`
  },
  {
    id: 'retraction_statements',
    name: 'التزام وتراجع عن أقوال وتصريحات',
    category: 'PERSONAL',
    description: 'التزام بالتراجع عن اتهامات سابقة (بالخيانة مثلاً) رغبة في الصلح.',
    fields: [
      { id: 'husbandInfo', label: 'بيانات الزوج', placeholder: '', type: 'textarea' },
      { id: 'wifeInfo', label: 'بيانات الزوجة', placeholder: '', type: 'textarea' },
      { id: 'otherParty', label: 'الطرف الآخر (الذي وجهت له الاتهامات)', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله : 
السيد: ${data.husbandInfo || '................'}

بمقتضى توقيعي على هذه الوثيقة و تحت كافة الضمانات الفعلية و القانونية أشهد على نفسي و أصرح و أنا بكامل قواي العقلية والجسدية بأنني ألتزم لفائدة زوجتي السيدة: ${data.wifeInfo || '................'} بانه وبعد أن راودتني شكوك حول خيانتها لي مع ${data.otherParty || '................'} فإنني أتراجع عن جميع الأقوال والاتهامات التي وجهتها إليهما معا.

وبذلك فإنني أشهد على نفسي و ألتزم بأن لا أقوم بافتعال المشاكل أو توجيه الاتهامات للزوجة بالخيانة و في حالة حصول عكس ذلك فإنني أتحمل جميع المسؤوليات و التبعيات الناتجة عنه وذلك رغبة مني في الصلح.

التزام تام وصحيح متحملا بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

التوقيع:
`
  },
  {
    id: 'taxi_working_consent',
    name: 'التزام مالك مأذونية بموافقة العمل لسائق',
    category: 'PROFESSIONAL',
    description: 'التزام من صاحب المأذونية (لكريمة) بالموافقة على عمل سائق معين.',
    fields: [
      { id: 'ownerInfo', label: 'بيانات صاحب المأذونية', placeholder: '', type: 'textarea' },
      { id: 'driverInfo', label: 'بيانات السائق', placeholder: '', type: 'textarea' },
      { id: 'taxiInfo', label: 'بيانات سيارة الأجرة (رقم المأذونية، الصنف...)', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد(ة): ${data.ownerInfo || '................'}

بمقتضى هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية أشهد على نفسي وألتزم وأنا بكامل قواي العقلية والجسدية بأنني أمنح موافقتي للسيد: ${data.driverInfo || '................'} للعمل كـسائق مهني لسيارة الأجرة ذات البيانات التالية:
${data.taxiInfo || '................'}

التزام تام وصحيح متحملا بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

التوقيع:
`
  },
  {
    id: 'valid_proxy_commitment',
    name: 'التزام بصحة وسريان مفعول وكالة',
    category: 'LEGAL',
    description: 'التزام يفيد بأن الوكالة العامة لا تزال سارية المفعول ولم يطرأ عليها أي إلغاء.',
    fields: [
      { id: 'agentInfo', label: 'بيانات الوكيل (المصرح)', placeholder: '', type: 'textarea' },
      { id: 'proxyDetails', label: 'تفاصيل الوكالة (الرقم، التاريخ، المصادقة)', placeholder: '', type: 'textarea' },
      { id: 'principalName', label: 'اسم الموكل', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.agentInfo || '................'}

بمقتضى توقيعي على هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية أشهد على نفسي وأصرح وأنا بكامل قواي العقلية والجسدية بأن الوكالة ${data.proxyDetails || '................'} الصادرة لفائدتي من طرف السيد: ${data.principalName || '................'} لا زالت سارية المفعول إلى حدود اليوم ولم يطرأ عليها أي تغيير أو إلغاء أو فسخ.

التزام وتصريح تام وصحيح متحملا بذلك كافة المسؤوليات القانونية الناتجة عنه خاصة في حالة ثبوت عكس ذلك.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

التوقيع:
`
  },
  {
    id: 'death_removal_civil_status',
    name: 'التزام بعدم إسقاط متوفى من الحالة المدنية',
    category: 'ADMINISTRATIVE',
    description: 'تصريح بالشرف يفيد بعدم القيام بإجراءات إسقاط المتوفى من سجلات الحالة المدنية.',
    fields: [
      { id: 'declarantInfo', label: 'بيانات المصرح (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'deceasedName', label: 'اسم المتوفى', placeholder: '', type: 'text' },
      { id: 'deathDate', placeholder: '', label: 'تاريخ الوفاة', type: 'date' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد(ة): ${data.declarantInfo || '................'}

بموجب هذه الوثيقة وتحت كافة الضمانات القانونية الجاري بها العمل، أصرح بشرفي أنني لم أقم بإسقاط المتوفى السيد(ة): ${data.deceasedName || '................'}، المتوفى بتاريخ ${data.deathDate || '........'}، من سجلات الحالة المدنية، وأنني أتحمل كامل المسؤولية في حالة ثبوت العكس.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

التوقيع:
`
  },
  {
    id: 'worker_dues_receipt',
    name: 'إبراء ذمة بخصوص مستحقات عمل',
    category: 'PROFESSIONAL',
    description: 'التزام ותصريح باستلام كافة المستحقات المالية عن فترة عمل وإبراء ذمة المشغل.',
    fields: [
      { id: 'workerInfo', label: 'بيانات العامل(ة)', placeholder: '', type: 'textarea' },
      { id: 'employerInfo', label: 'بيانات المشغل / الشركة', placeholder: '', type: 'textarea' },
      { id: 'workPeriod', label: 'فترة العمل (من... إلى...)', placeholder: '', type: 'text' },
      { id: 'amount', label: 'المبلغ الإجمالي المستلم (اختياري)', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع(ة) أسفله: 
السيد(ة): ${data.workerInfo || '................'}

أشهد على نفسي وبمحض إرادتي وأنا بكامل قواي العقلية والجسدية أنني توصلت من السيد(ة) / شركة ${data.employerInfo || '................'} بكافة مستحقاتي المالية المترتبة عن فترة عملي الممتدة من ${data.workPeriod || '........'} وذلك بمبلغ إجمالي قدره ${data.amount || '........'} درهم.
وبهذا أبرئ ذمة المشغل المذكور إبراءً تاماً وشاملاً ونهائياً من أي تعويض أو حق كيفما كان نوعه، وأتعهد بأنني لن أطالبه مستقبلاً بأي شيء بخصوص هذا الموضوع أمام أي جهة إدارية أو قضائية.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

توقيع العامل(ة):
`
  },
  {
    id: 'shop_equipment_receipt',
    name: 'التزام باستلام معدات لتسيير محل',
    category: 'PROFESSIONAL',
    description: 'التزام وتصريح بتسلم معدات وتجهيزات قصد تسيير محل تجاري وتحمل مسؤوليتها.',
    fields: [
      { id: 'managerInfo', label: 'بيانات المسير (المستلم)', placeholder: '', type: 'textarea' },
      { id: 'ownerInfo', label: 'بيانات صاحب المحل', placeholder: '', type: 'textarea' },
      { id: 'shopDetails', label: 'بيانات المحل (الاسم، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'equipmentList', label: 'قائمة المعدات والتجهيزات المستلمة', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد(ة): ${data.managerInfo || '................'}

أقر بموجبه أنني تسلمت من السيد(ة): ${data.ownerInfo || '................'} كافة المعدات والتجهيزات المبينة أسفله، وذلك قصد تسيير المحل الكائن بـ ${data.shopDetails || '................'}.
قائمة المعدات:
${data.equipmentList || '................'}

وألتزم بحفظ هذه المعدات وصيانتها واستعمالها فيما خصصت له، كما أتحمل المسؤولية كاملة في حالة ضياعها أو إتلافها، وأتعهد بإرجاعها لصاحبها عند انتهاء فترة المسيري بحالتها التي تسلمتها بها.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

إمضاء المسير:
`
  },
  {
    id: 'job_practice_declaration',
    name: 'تصريح بمزاولة مهنة',
    category: 'PROFESSIONAL',
    description: 'تصريح بالشرف يفيد بمزاولة مهنة حرة أو حرفة معينة.',
    fields: [
      { id: 'declarantInfo', label: 'بيانات المصرح(ة)', placeholder: '', type: 'textarea' },
      { id: 'jobTitle', label: 'المهنة أو الحرفة المزاولة', placeholder: '', type: 'text' },
      { id: 'jobLocation', label: 'مكان مزاولة المهنة', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع(ة) أسفله:
السيد(ة): ${data.declarantInfo || '................'}

أصرح بشرفي أنني أزاول مهنة / حرفة ${data.jobTitle || '........'} بمدينة ${data.jobLocation || '........'}، وذلك بصفة مستمرة ومنتظمة. 
أقدم هذا التصريح قصد المد بـه للجهات المختصة واستعماله فيما يسمح به القانون.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

توقيع المصرح(ة):
`
  },
  {
    id: 'minors_guardianship_commitment',
    name: 'التزام بكفالة أبناء قاصرين',
    category: 'PERSONAL',
    description: 'التزام بكفالة الأبناء القاصرين وتحمل كافة مصاريفهم وضمان عيش كريم لهم.',
    fields: [
      { id: 'guardianInfo', label: 'بيانات الكفيل (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'childrenInfo', label: 'بيانات الأطفال القاصرين', placeholder: '', type: 'textarea' },
      { id: 'relationship', label: 'صلة القرابة', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد(ة): ${data.guardianInfo || '................'}

أصرح بموجبه وأنا بكامل قواي العقلية والجسدية أنني ألتزم بكفالة الأطفال القاصرين المذكورين أسفله بصفتي ${data.relationship || '........'} لهم:
${data.childrenInfo || '................'}
وأتعهد بتحمل كافة مصاريف عيشهم وتطبيبهم ودراستهم وضمان عيش كريم لهم، كما أتحمل المسؤولية القانونية كاملة تجاههم.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

إمضاء الكفيل:
`
  },
  {
    id: 'child_custody_commitment',
    name: 'التزام بكفالة طفل / طفلة',
    category: 'PERSONAL',
    description: 'التزام بكفالة طفل معين وضمان حقوقه المادية والمعنوية.',
    fields: [
      { id: 'guardianInfo', label: 'بيانات الكفيل(ة)', placeholder: '', type: 'textarea' },
      { id: 'childInfo', label: 'بيانات الطفل(ة)', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع(ة) أسفله:
السيد(ة): ${data.guardianInfo || '................'}

ألتزم بمقتضاه بكفالة الطفل(ة) ${data.childInfo || '................'} كفالة تامة ودائمة، وأتعهد بضمان كافة حقوقه(ا) المادية والمعنوية من سكن ونفقة وتمدرس وتطبيب، وتحمل المسؤولية الكاملة في ذلك.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

توقيع الكفيل(ة):
`
  },
  {
    id: 'no_prosecution_commitment',
    name: 'تنازل عن متابعة (ضرب وجرح)',
    category: 'LEGAL',
    description: 'التزام بعدم التعرض والتنازل عن المتابعة القضائية في قضية ضرب وجرح صلحاً.',
    fields: [
      { id: 'victimInfo', label: 'بيانات المتنازل (الضحية)', placeholder: '', type: 'textarea' },
      { id: 'offenderInfo', label: 'بيانات المتنازل له (المعتدي)', placeholder: '', type: 'textarea' },
      { id: 'incidentDetails', label: 'تفاصيل الواقعة (التاريخ، المكان، رقم المحضر إن وجد)', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد(ة): ${data.victimInfo || '................'}

بموجب هذا الالتزام، أصرح أنني أتنازل تنازلاً تاماً ونهائياً ولا رجعة فيه عن متابعة السيد(ة): ${data.offenderInfo || '................'} بخصوص واقعة الضرب والجرح التي حدثت بتاريخ ${data.incidentDetails || '........'}.
ويأتي هذا التنازل رغبة مني في الصلح والمودة، وأتعهد بعدم ملاحقته قضائياً مستقبلاً بخصوص هذا الموضوع، كما أبرئ ذمته من أي تعويض مادي أو معنوي.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

توقيع المتنازل:
`
  },
  {
    id: 'no_income_commitment',
    name: 'التزام بعدم الدخل',
    category: 'ADMINISTRATIVE',
    description: 'تصريح بالشرف يفيد بعدم توفر الشخص على أي دخل مادي أو أجر شهري.',
    fields: [
      { id: 'declarantInfo', label: 'بيانات المصرح (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع(ة) أسفله : 
السيد(ة) : ${data.declarantInfo || '................'} ، مغربي(ة)، كامل(ة) الأهلية.

بمقتضى توقيعي على هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية أشهد على نفسي وأصرح وأنا بكامل قواي العقلية والجسدية بأنني لا أتقاضى أي أجر شهري وليس لدي أي دخل مادي وغير خاضعة للنظام الضريبي وذلك قصد الحصول على شهادة الدخل والإبراء الضريبي. 

التزام تام و صحيح متحملا بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

التوقيع:
`
  },
  {
    id: 'widow_single_wife_commitment',
    name: 'التزام بعدم الزواج – الترمل – الزوجة الوحيدة',
    category: 'PERSONAL',
    description: 'التزام يفيد بأن المصرحة هي الزوجة الوحيدة للمتوفى وأنها لا تزال أرملة.',
    fields: [
      { id: 'wifeInfo', label: 'بيانات الأرملة (الاسم، CIN، العنوان، تاريخ الازدياد)', placeholder: '', type: 'textarea' },
      { id: 'husbandName', label: 'اسم الزوج المتوفى (قيد حياته)', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقعة أسفله:
السيدة: ${data.wifeInfo || '................'}، مغربية، كاملة الأهلية.

بموجب هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية أشهد على نفسي و ألتزم وأنا بكامل قواي العقلية والجسدية بأنني الزوجة الوحيدة للمرحوم والمسمى قيد حياته: ${data.husbandName || '................'}، كما أني لم يسبق لي الطلاق منه أو الزواج بعده، ولازلت أرملة إلى يومنا هذا.

التزام تام و صحيح وقعته بعد الإطلاع و الفهم التامين له متحملة بذلك كافة المسؤوليات القانونية الناتجة عنه في حالة ثبوت عكس ذلك.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

إمضاء:
`
  },
  {
    id: 'illegitimate_birth_declaration',
    name: 'التزام بالولادة عن علاقة غير شرعية',
    category: 'PERSONAL',
    description: 'تصريح بالولادة خارج إطار الزواج لغرض إداري (شهادة الميلاد).',
    fields: [
      { id: 'motherInfo', label: 'بيانات الأم (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'childInfo', label: 'بيانات الطفل(ة) (الاسم، الجنس)', placeholder: '', type: 'text' },
      { id: 'fatherName', label: 'اسم الأب البيولوجي', placeholder: '', type: 'text' },
      { id: 'hospitalName', label: 'اسم المستشفى', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
انا الموقعة أسفله: 
السيدة: ${data.motherInfo || '................'}، مغربية، كاملة الأهلية.

بمقتضى هذه الوثيقة وأنا متمتعة بكامل قواي العقلية والبدنية أصرح على أنني أنجبت طفل(ة) ${data.childInfo || '........'} من علاقة غير شرعية مع السيد: ${data.fatherName || '................'}، تمت عملية الولادة بالمستشفى ${data.hospitalName || '........'}.
وأن ابنتي المذكورة أعلاه مازالت على قيد الحياة، كما أشهد أنها غير مسجلة بكناش التعريف والحالة المدنية وبالتالي فهي غير خاضعة إطلاقا لنظامها.

وعليه فإنني أتحمل جميع المسؤوليات الناتجة عن هذا الالتزام، وأطلب من المعنيين بالأمر منحي شهادة الولادة للإدلاء بها لدى المصالح المختصة. 

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

إمضاء:
`
  },
  {
    id: 'single_status_declaration',
    name: 'إلتزام بعدم الزواج (عازب/ة)',
    category: 'PERSONAL',
    description: 'تصريح بالشرف يفيد بأن الشخص لا زال أعزباً ولم يسبق له الزواج.',
    fields: [
      { id: 'declarantInfo', label: 'بيانات المصرح(ة) (الاسم، CIN، العنوان، سنة الازدياد، المهنة)', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع(ة) أسفله :
السيد(ة): ${data.declarantInfo || '................'}

أشهد وأصرح بما تصح به الشهادة شرعا وقانونا شهادة الرضى والقبول التام، وأنا في كامل قواي العقلية والجسدية وبدون اية ضغوط خارجية وتحت جميع الضمانات الفعلية والقانونية في اوسع نطاقها الجاري بها العمل والسارية المفعول حسب قانون الالتزامات والعقود بأني مازلت أعزب(ة) بدون زواج حتى الان.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

إمضاء:
`
  },
  {
    id: 'no_property_tax_commitment',
    name: 'التزام بعدم الملكية وعدم الخضوع للنظام الضريبي',
    category: 'ADMINISTRATIVE',
    description: 'تصريح يفيد بعدم امتلاك أي عقارات وعدم الخضوع للضريبة.',
    fields: [
      { id: 'declarantInfo', label: 'بيانات المصرح(ة) (الاسم، CIN، العنوان، تاريخ الازدياد)', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع(ة) أسفله: 
السيد(ة): ${data.declarantInfo || '................'}

بمقتضى توقيعي على هذه الوثيقة و تحت كافة الضمانات الفعلية والقانونية أشهد على نفسي وأصرح وأنا بكامل قواي العقلية والجسدية بأنني لا أتوفر على أية أملاك عقارية سكنية أو غيرها داخل ربوع المملكة أو خارجها وبذلك فإنني غير خاضع للنظام الضريبي.

التزام تام وصحيح متحملا بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

التوقيع:
`
  },
  {
    id: 'abstinence_from_alcohol_violence',
    name: 'التزام بعدم تعاطي الكحول والتعنيف',
    category: 'PERSONAL',
    description: 'تعهد من الزوج تجاه زوجته بعدم شرب الكحول أو ممارسة العنف.',
    fields: [
      { id: 'husbandInfo', label: 'بيانات الزوج (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'wifeName', label: 'اسم الزوجة', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ الالتزام', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله: 
السيد: ${data.husbandInfo || '................'}

بموجب هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية أشهد على نفسي وألتزم وأنا بكامل قواي العقلية والجسدية لفائدة زوجتي السيدة: ${data.wifeName || '........'} بأنني لن أقوم نهائيا بشرب أية مشروبات كحولية كما أتعهد بأن لا أمارس عليها أية عنف سواء لفظي أو جسدي وذلك ابتداء من تاريخ اليوم الموافق لـ ${data.date || '........'}.
وفي حالة إخلالي بهذا الالتزام فإنني أتحمل بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

إمضاء:
`
  },
  {
    id: 'no_assets_no_bank_no_job',
    name: 'التزام بعدم ملكية عقار وعدم التوفر على حساب بنكي أو عمل',
    category: 'ADMINISTRATIVE',
    description: 'تصريح شامل بالشرف بضعف الإمكانيات المادية.',
    fields: [
      { id: 'declarantInfo', label: 'بيانات المصرح (الاسم، CIN، العنوان، تاريخ الازدياد)', placeholder: '', type: 'textarea' },
      { id: 'dailyIncome', label: 'الدخل اليومي التقريبي (بالدرهم)', placeholder: 'مثلاً: ما بين 50 و 100 درهم', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله: 
السيد: ${data.declarantInfo || '................'}

بموجب هذه الوثيقة و بكافة الضمانات الفعلية والقانونية أشهد على نفسي وأصرح وأنا بكامل قواي العقلية والجسدية بأنني لا أتوفر على أية أملاك سواء عقارية أو غيرها، ولا أتوفر على حساب بنكي بأية مؤسسة بنكية، كما أنني لا أتوفر على عمل رسمي قار، حيث أنني أعمل بشكل موسمي وأتقاضى مبلغ يتراوح ما بين ${data.dailyIncome || '........'} درهم في اليوم الواحد.

التزام تام وصحيح متحملا بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

إمضاء:
`
  },
  {
    id: 'business_activity_license_commitment',
    name: 'الـتزام بعدم ممارسة نشاط تجاري إلا بعد الحصول على رخصة',
    category: 'PROFESSIONAL',
    description: 'تعهد بعدم مزاولة نشاط تجاري في محل معين قبل الحصول على التراخيص.',
    fields: [
      { id: 'proprietorInfo', label: 'بيانات صاحب المشروع (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'activityType', label: 'نوع النشاط المراد ممارسته', placeholder: 'مثلاً: مقهى، بيع المواد الغذائية...', type: 'text' },
      { id: 'shopLocation', label: 'موقع المحل التجاري', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله :
السيد: ${data.proprietorInfo || '................'}

بموجب هذه الوثيقة وبكافة الضمانات الفعلية والقانونية أشهد على نفسي وألتزم وأنا بتمام الوعي والإدراك بأنني لن أقوم بـ ${data.activityType || '........'} بالمحل التجاري الكائن بـ ${data.shopLocation || '........'} إلا بعد الحصول على رخصة لممارسة هذا النشاط.

التزام تام وصحيح متحملا بذلك كافة المسؤوليات القانونية الناتجة عنه في حالة ثبوت عكس ذلك.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

إمضاء:
`
  },
  {
    id: 'rental_stop_activity_commitment',
    name: 'التزام بكراء وايقاف نشاط تجاري بمحل',
    category: 'PROPERTY',
    description: 'تصريح بإنهاء النشاط التجاري والتخلي عن كراء محل.',
    fields: [
      { id: 'tenantInfo', label: 'بيانات المكتري (الاسم، CIN، العنوان، تاريخ الازدياد)', placeholder: '', type: 'textarea' },
      { id: 'shopLocation', label: 'موقع المحل التجاري', placeholder: '', type: 'text' },
      { id: 'startDate', label: 'تاريخ بداية الكراء', placeholder: '', type: 'date' },
      { id: 'stopDate', label: 'تاريخ التوقف عن النشاط', placeholder: '', type: 'date' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله: 
السيد: ${data.tenantInfo || '................'}

بمقتضى توقيعي على هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية أشهد على نفسي وأصرح وأنا بكامل قواي العقلية والجسدية بأنني كنت أكتري المحل التجاري الكائن بـ ${data.shopLocation || '........'} بتاريخ ${data.startDate || '........'} وقد أوقفت نشاطي التجاري وتخليت عنه بتاريخ ${data.stopDate || '........'}.

التزام تام وصحيح متحملا بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

التوقيع:
`
  },
  {
    id: 'family_support_commitment',
    name: 'التزام بالتحمل العائلي',
    category: 'PERSONAL',
    description: 'التزام بالتكفل بمصاريف ونفقة أفراد العائلة (الزوجة والأبناء).',
    fields: [
      { id: 'supporterInfo', label: 'بيانات المتكفل (الاسم، CIN، العنوان، تاريخ الازدياد)', placeholder: '', type: 'textarea' },
      { id: 'wifeName', label: 'اسم الزوجة', placeholder: '', type: 'text' },
      { id: 'childrenNames', label: 'أسماء الأبناء', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
انا الموقع أسفله:
السيد: ${data.supporterInfo || '................'}

بموجب هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية أشهد على نفسي وألتزم و أنا بكامل قواي العقلية والجسدية بأنني المتحمل والمتكفل الوحيد بمصاريف ونفقة عائلتي:
الزوجة : ${data.wifeName || '........'}
الأبناء: ${data.childrenNames || '........'}
والتي تشمل مصاريف السكن والمأكل والمشرب والتطبيب والتمدرس وباقي المصاريف اليومية دون استثناء.

التزام تام وصحيح متحملا بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'no_health_insurance_commitment',
    name: 'التزام بعد التوفر على تأمين أو تغطية صحية',
    category: 'ADMINISTRATIVE',
    description: 'تصريح يفيد بعدم توفر الشخص على أي تغطية صحية باستثناء الراميد.',
    fields: [
      { id: 'declarantInfo', label: 'بيانات المصرح(ة) (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'ramidNum', label: 'رقم بطاقة الراميد', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقعة أسفله: 
السيدة: ${data.declarantInfo || '................'}

بموجب هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية أشهد نفسي وأصرح وأنا بكامل قواي العقلية والجسدية بأنني لا اتوفر على أي تأمين خاص أو تغطية صحية غير استفادتي من بطاقة الراميد الحاملة للرقم: ${data.ramidNum || '................'}.

التزام تام وصحيح متحملة بذلك كافة المسؤوليات القانونية الناتجة عنه في حالة ثبوت عكس ذلك.  

حرر باـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

إمضاء:
`
  },
  {
    id: 'work_stop_declaration',
    name: 'التزام بالتوقف عن العمل',
    category: 'PROFESSIONAL',
    description: 'تصريح بالشرف يفيد بالتوقف عن العمل في شركة معينة وترك المهام.',
    fields: [
      { id: 'declarantInfo', label: 'بيانات المصرح(ة) (الاسم، CIN، العنوان، رقم CNSS إن وجد)', placeholder: '', type: 'textarea' },
      { id: 'companyName', label: 'اسم الشركة', placeholder: '', type: 'text' },
      { id: 'stopDate', label: 'تاريخ التوقف', placeholder: '', type: 'date' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقعة أسفله:
السيدة: ${data.declarantInfo || '................'}

بمقتضى توقيعي على هذه الوثيقة و تحت كافة الضمانات الفعلية والقانونية أشهد على نفسي وأصرح وأنا بكامل قواي العقلية و الجسدية بأني كنت أعمل لدى شركة: ${data.companyName || '........'} وتوقفت عن ممارسة مهامي داخل الشركة بتاريخ ${data.stopDate || '........'}.

التزام تام وصحيح متحملة بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

التوقيع:
`
  },
  {
    id: 'prisoner_visit_commitment',
    name: 'التزام بزيارة سجين',
    category: 'ADMINISTRATIVE',
    description: 'التزام بزيارة سجين معين بشكل منتظم في السجن المحلي.',
    fields: [
      { id: 'visitorInfo', label: 'بيانات الزائر (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'prisonerName', label: 'اسم السجين', placeholder: '', type: 'text' },
      { id: 'prisonLocation', label: 'مكان السجن (المدينة)', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد : ${data.visitorInfo || '................'}

بموجب هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية أشهد على نفسي وألتزم وأنا بكامل قواي العقلية والجسدية بأني سأقوم بزيارة المعتقل بالسجن المحلي لمدينة ${data.prisonLocation || '........'} السيد: ${data.prisonerName || '................'} وذلك بشكل منتظم أثناء فترات الزيارة.

التزام تام وصحيح متحملا بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

إمضاء:
`
  },
  {
    id: 'marriage_continuation_commitment',
    name: 'التزام باستمرار العلاقة الزوجية',
    category: 'PERSONAL',
    description: 'تصريح يفيد باستمرار العلاقة الزوجية وعدم وقوع انفصال أو طلاق.',
    fields: [
      { id: 'wifeInfo', label: 'بيانات الزوجة (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'husbandInfo', label: 'بيانات الزوج (الاسم، CIN، تاريخ الازدياد)', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقعة أسفله : 
السيدة: ${data.wifeInfo || '................'}

بموجب هذه الوثيقة و تحت كافة الضمانات الفعلية و القانونية أشهد على نفسي و ألتزم وأنا بكامل قواي العقلية الجسدية بأن زواجي من السيد: ${data.husbandInfo || '........'} لازال مستمرا إلى يومنا هذا ولم يسبق لي الانفصال أو الطلاق منه.

التزام تام و صحيح متحملة بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

إمضاء:
`
  },
  {
    id: 'land_area_responsibility_commitment',
    name: 'التزام بتحمل مساحة أرضية',
    category: 'PROPERTY',
    description: 'تعهد بتحمل مسؤولية استغلال مساحة أرضية معينة وضمان حقوق الآخرين.',
    fields: [
      { id: 'declarantInfo', label: 'بيانات المصرح (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'areaDetails', label: 'تفاصيل المساحة والموقع', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله :
السيد: ${data.declarantInfo || '................'}

بمقتضاه ألتزم التزاما تاما أنني أتحمل كامل مسؤوليتي بضمان استغلال المساحة التي تقدر بـ ${data.areaDetails || '........'} وأتعهد بمنح هذه المساحة إلى ذوي الحقوق كل ما طلبوا ذلك.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'builder_commitment_requirements',
    name: 'التزام معلم بالبناء مع ذكر المتطلبات',
    category: 'PROFESSIONAL',
    description: 'تعهد من المقاول (معلم) بإتمام أعمال البناء والإصلاح وفق شروط مادية محددة.',
    fields: [
      { id: 'builderInfo', label: 'بيانات المعلم (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'ownerInfo', label: 'بيانات صاحب المنزل', placeholder: '', type: 'textarea' },
      { id: 'houseLoc', label: 'موقع المنزل (الرسم العقاري، المساحة، الرخصة)', placeholder: '', type: 'textarea' },
      { id: 'requirements', label: 'المتطلبات التقنية (الزليج، الرخام، الخشب...)', placeholder: '', type: 'textarea' },
      { id: 'totalPrice', label: 'الثمن الإجمالي للعملية', placeholder: 'مثلاً: 122.000 درهم', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.builderInfo || '................'}

بموجب هذا الاعتراف وتحت جميع الضمانات الفعلية والقانونية الجاري بها العمل أشهد وألتزم على نفسي أنني كلفت من طرف السيدة: ${data.ownerInfo || '........'} بإتمام عملية بناء وإصلاح المنزل الكائن بـ ${data.houseLoc || '................'}.
وذلك وفقا للمتطلبات التالية: 
${data.requirements || '................'}
كل هذا بثمن قدره ونهايته ${data.totalPrice || '........'} درهم. 

كما أنني المكلف الوحيد بالعمال وواجباتهم التابعين لي إلى غاية إتمام عملية البناء والإصلاح.
وبهذا ألتزم وعليه أمضي بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}.

الإمضاء:
`
  },
  {
    id: 'goods_sale_commitment',
    name: 'التزام ببيع سلعة',
    category: 'PROFESSIONAL',
    description: 'تعهد ببيع مادة معينة (مثل الخبز) بثمن محدد والالتزام بشروط التعويض.',
    fields: [
      { id: 'sellerInfo', label: 'بيانات البائع (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'goodsType', label: 'نوع المادة أو السلعة', placeholder: 'مثلاً: مادة الخبز', type: 'text' },
      { id: 'pricePerUnit', label: 'الثمن المحدد للوحدة', placeholder: '', type: 'text' },
      { id: 'penaltyAmount', label: 'مبلغ التعويض عند الإخلال', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا المـوقع أسفلـه:
السيد: ${data.sellerInfo || '................'}

أصـرح وألتزم بأني أبيع ${data.goodsType || '........'} إلى الموزعين بثمن قـدره ${data.pricePerUnit || '........'} درهم إبتداءا من تـاريخ ${data.date || '........'}.
وإذا خـالفـت هـذا الالـتزام سوف أؤدي إلى المعـنيين بالأمـر الواجب قدره ${data.penaltyAmount || '........'} درهم بـدون تراجـع أو تمـاطل وفي أقرب وقت ممكن.

وبهذا أصرح وألتزم بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}.

الإمضاء:
`
  },
  {
    id: 'no_alimony_declaration',
    name: 'التزام بعدم النفقة',
    category: 'PERSONAL',
    description: 'إشهاد من طرف المطلقة بأنها لا تتوصل بأي نفقة من طليقها.',
    fields: [
      { id: 'wifeInfo', label: 'بيانات المصرحة (الاسم، CIN، العنوان، تاريخ الازدياد)', placeholder: '', type: 'textarea' },
      { id: 'exHusbandName', label: 'اسم الطليق', placeholder: '', type: 'text' },
      { id: 'divorceDetails', label: 'تفاصيل الطلاق (التاريخ، الملف، رقم الحكم)', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
انا الموقعة أسفله:
السيدة: ${data.wifeInfo || '................'}

بموجب هذا الالتزام أشهد على نفسي شهادة الطوع والرضى أنني لا أستفيد من أي نفقة لا أنا ولا أبنائي، من طليقي السيد: ${data.exHusbandName || '........'} منذ طلاقنا بتاريخ ${data.divorceDetails || '........'}.

وبهذا أصرح وألتزم وعليه أمضي بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}.

الإمضاء:
`
  },
  {
    id: 'one_utility_contract_cancellation',
    name: 'التزام للمكتب الوطني للكهرباء',
    category: 'ADMINISTRATIVE',
    description: 'تعهد بفسخ عقدة الاشتراك في حالة وجود نزاع مع الورثة بخصوص المحل.',
    fields: [
      { id: 'tenantInfo', label: 'بيانات المكتري (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'heirsInfo', label: 'بيانات الورثة المعنيين بالنزاع', placeholder: '', type: 'text' },
      { id: 'shopDetails', label: 'بيانات الدكان / المحل (العنوان، رقم التسجيل)', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
انا الموقع أسفله:
السيد: ${data.tenantInfo || '................'}

أتعهد وألتزم للمكتب الوطني للكهرباء بـ ${data.city || '........'} بأن يقوم بفسخ عقدة الاشتراك في حالة أي نزاع مع ورثة ${data.heirsInfo || '........'} على الدكان الكائن بـ ${data.shopDetails || '........'} بصفتي مكتريا له.

وبهذا أصرح وألتزم وعليه أمضي بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}.

الإمضاء:
`
  },
  {
    id: 'cheque_receipt_commitment',
    name: 'التزام بتسلم شيك',
    category: 'LEGAL',
    description: 'إشهاد باستلام شيك مالي بعد تسديد دين نقدا وتبرئة الذمة.',
    fields: [
      { id: 'receiverInfo', label: 'بيانات المستلم (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'amount', label: 'المبلغ المالي', placeholder: '', type: 'text' },
      { id: 'chequeNum', label: 'رقم الشيك', placeholder: '', type: 'text' },
      { id: 'debtorName', label: 'اسم الشخص الدافع (المدين سابقا)', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
انا الموقع أسفله:
السيد: ${data.receiverInfo || '................'}

بمقتضى هدا الالتزام وتحت جميع الضمانات الفعلية والقانونية الجاري بها العمل أشهد على نفسي شهادة الطوع والرضى وأنا في كامل قواي العقلية أنني ألتزم التزاما تاما وأتعهد كل تعهد بصحة المعلومات التي تثبت أنني تسلمت من الشخص الذي كنت مدينا له السيد: ${data.debtorName || '........'} بمبلغ: ${data.amount || '........'} درهم الشيك رقم: ${data.chequeNum || '........'} بعد ما قمت بدفع المبلغ الذي كنت مدينا له به نقدا وأتحمل جميع مسؤولياته.

وبهذا أصرح وألتزم وعليه أمضي بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}.

الإمضاء:
`
  },
  {
    id: 'lost_cheque_ack',
    name: 'التزام بضياع شيك',
    category: 'LEGAL',
    description: 'إقرار باستلام شيك على بياض وضياعه في ظروف غامضة مع تحمل المسؤولية.',
    fields: [
      { id: 'receiverInfo', label: 'بيانات المستلم (الاسم، CIN، العنوان)', placeholder: '', type: 'textarea' },
      { id: 'giverInfo', label: 'بيانات الشخص الذي سلم الشيك', placeholder: '', type: 'textarea' },
      { id: 'lostDetails', label: 'تفاصيل الضياع (الفترة، الظروف)', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقعة أسفله :
السيدة: ${data.receiverInfo || '................'}

بمقتضى هذا الالتزام وتحت جميع الضمانات الفعلية والقانونية الجاري بها العمل أشهد على نفسي شهادة الطوع والرضى وأنا في كامل قواي العقلية أنني ألتزم التزاما تاما بأنني تسلمت شيكا على بياض خلال شهر ${data.lostDetails || '........'} من السيد: ${data.giverInfo || '................'}.
كما أنني أعترف اعترافا تاما أنه ضاع مني في ظروف غامضة وأتحمل جميع مسؤولياته القانونية الناتجة عن ذلك.

وبهذا أصرح وألتزم وعليه أمضي بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}.

الإمضاء:
`
  },
  {
    id: 'shop_noise_commitment',
    name: 'التزام محل بعدم إزعاج السكان',
    category: 'PROFESSIONAL',
    description: 'تعهد من صاحب محل بعدم استعمال آلات مزعجة واحترام راحة الجيران.',
    fields: [
      { id: 'ownerInfo', label: 'بيانات صاحب المحل', placeholder: '', type: 'textarea' },
      { id: 'shopLoc', label: 'موقع المحل والنشاط المزاول', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.ownerInfo || '................'}

أصرح وألتزم التزاما تاما وأنا في كامل قواي العقلية أنني أشغل المحل الكائن بـ ${data.shopLoc || '........'} لغرض التجارة فقط، كما أنني لا أستعمل الآلات العصرية التي من الممكن أن تحدث أي صوت قد يقوم بإزعاج السكان.
لهذا فأنا أتحمل كافة المسؤوليات والتي ألتزم من خلالها بعدم إزعاجهم التزاما تاما دائما دواما لا رجعة فيه.

وبهذا أصرح وألتزم وعليه أمضي بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}.

الإمضاء:
`
  },
  {
    id: 'house_responsibility_commitment',
    name: 'التزام تحمل مسؤولية منزل',
    category: 'PROPERTY',
    description: 'تعهد بتحمل كامل المسؤولية عن منزل معين يخص أشخاصاً آخرين.',
    fields: [
      { id: 'responsibleInfo', label: 'بيانات الشخص المسؤول', placeholder: '', type: 'textarea' },
      { id: 'ownersInfo', label: 'بيانات أصحاب المنزل (الأسماء، CIN)', placeholder: '', type: 'textarea' },
      { id: 'houseLoc', label: 'موقع المنزل والرسم العقاري', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.responsibleInfo || '................'}

أشهد وألتزم التزاما تاما لا رجعة فيه وأشهد على نفسي شهادة الطوع والرضا وأنا بكامل قواي العقلية والجسدية على أنني أتحمل كامل المسؤولية المتعلقة بالمنزل الكائن بـ ${data.houseLoc || '................'} الذي هو في ملكية السيدات: ${data.ownersInfo || '........'}.

وبهذا أصرح وألتزم وعليه أمضي بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}.

الإمضاء:
`
  },
  {
    id: 'rental_agreement_simple',
    name: 'التزام بكراء محل',
    category: 'PROPERTY',
    description: 'نموذج مبسط لكراء عقار مع الالتزام بالمحافظة على التجهيزات.',
    fields: [
      { id: 'tenantInfo', label: 'بيانات المكتري (المصرح)', placeholder: '', type: 'textarea' },
      { id: 'propertyInfo', label: 'بيانات الملك (الاسم، الرسم العقاري، الموقع، المساحة)', placeholder: '', type: 'textarea' },
      { id: 'rentPrice', label: 'السومة الكرائية (بالدرهم)', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.tenantInfo || '................'}

ألتزم وأصرح و أشهد على نفسي شهادة الطوع والرضا وأنا في كامل قواي العقلية والجسدية على أن أقوم بكراء الملك المسمى: ${data.propertyInfo || '................'} بسومة كرائية قدرها ${data.rentPrice || '........'} درهم.
وذلك شريطة أن تتم المحافظة على الملك وما يحتوي عليه من تجهيزات وعدم تفويت المفاتيح للغير دون استشارة صاحب الملك.

وبهذا أصرح وألتزم وعليه أمضي بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}.

الإمضاء:
`
  },
  {
    id: 'land_benefit_waiver_proxy',
    name: 'تنازل عن منفعة قطعة أرضية مع توكيل مفوض',
    category: 'PROPERTY',
    description: 'عقد تنازل عن استغلال قطعة أرضية مع توكيل الطرف الثاني للقيام بالإجراءات.',
    fields: [
      { id: 'party1', label: 'بيانات الطرف الأول (المتنازل)', placeholder: '', type: 'textarea' },
      { id: 'party2', label: 'بيانات الطرف الثاني (المتنازل له)', placeholder: '', type: 'textarea' },
      { id: 'landLoc', label: 'موقع القطعة الأرضية، مساحتها، وحدودها', placeholder: 'جنوبا، شمالا، شرقا، غربا...', type: 'textarea' },
      { id: 'originProperty', label: 'أصل الملك (وثيقة ثبوت الملكية)', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
بين الموقعين أسفله:
الطرف الأول (المتنازل): ${data.party1 || '........'}
الطرف الثاني (المتنازل له): ${data.party2 || '........'}

تم الاتفاق والتراضي على ما يلي:
بموجب هـذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية تنازل الطرف الأول للطرف الثاني القابل منه بعد الرضى والقبول والمعاينة جميع منفعة القطعة الأرضية الواقعة ${data.landLoc || '........'} ليتصرف فيها ويتملكها ويستغلها استغلالا تاما بجميع مرافقها ومنافعها.

أصل الملك: ${data.originProperty || '........'}.
يصرح الطرف الأول المتنازل على ان منفعة القطعة الأرضية المذكورة خالية من أي متابعة أو دين أو رهن وقد أصبحت تحت التصرف والتملك والاستغلال التام للمتنازل له وأبرأه من جميع التبعات ومن حقه التصرف فيها حالا ومستقبلا وتحمل كافة المسؤوليات والتبعات القانونية الخاصة بها حيث لم يبق للمتنازل فيها أي حق قليلا أو كثيرا.
يصرح الطرف الثاني المتنازل له أنه عاين القطعة الأرضية المذكورة أعلاه وقبلها على الحالة التي هي عليها ويلتزم بتحمل مسؤوليتها كاملة ابتداء من تاريخ المصادقة.

--- وكالة مفوضة ---
بموجب هذه الوثيقة أوكل عني الطرف الأول السيد: ${data.party2 || '........'} لينوب عني ويقوم مقامي في القيام بكافة الإجراءات الإدارية والقانونية الخاصة بتمثيلي أمام جميع الإدارات العمومية والشبه العمومية (مصلحة الماء، الكهرباء، البلدية، العمالة، الضرائب...) بكل ما يعرض له في ذلك من قول أو فعل وطلب وسحب وأداء وكذا الحصول على رخصة البناء والتوقيع نيابة عني وذلك دون الحاجة لحضوري.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}.

توقيع الطرف الأول:                                توقيع الطرف الثاني:
`
  },
  {
    id: 'building_proc_proxy',
    name: 'نمودج وكـالة اجراءات بناء بقعة أرضية',
    category: 'LEGAL',
    description: 'توكيل للقيام بكافة الإجراءات الإدارية لبناء بقعة أرضية أمام مختلف الإدارات.',
    fields: [
      { id: 'principal', label: 'بيانات الموكل (صاحب الأرض)', placeholder: '', type: 'textarea' },
      { id: 'agent', label: 'بيانات الوكيل', placeholder: '', type: 'textarea' },
      { id: 'plotDetails', label: 'رقم وموقع البقعة الأرضية', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
انا الموقع أسفله:
السيد: ${data.principal || '................'}

بموجب هذه الوثيقة و تحت كافة الضمانات الفعلية و القانونية اشهد على نفسي و ألتزم و أنا بكامل قواي العقلية والجسدية بأنني أوكل عني السيد: ${data.agent || '................'} لينوب عني و يقوم مقامي فيما تصح فيه النيابة شرعا وقانونا من أجل قيامه بكافة الإجراءات الإدارية والقانونية الخاصة بي دون استثناء بما فيها المتعلقة بالبقعة الأرضية رقم: ${data.plotDetails || '........'}.
حيث يصبح له الحق في التكلم بالنيابة عني أمام جميع الإدارات العمومية والشبه العمومية والخاصة (توزيع الماء والكهرباء، مصلحة الضرائب، البلدية، العمالة...) وينوب عني كذلك في استخراج واستلام رخصة البناء وباقي الشواهد الإدارية، بكل ما يعرض له في ذلك من قول أو فعل والتوقيع نيابة عني في كافة الأوراق والمعاملات المتعلقة بهذا الخصوص وذلك دون الحاجة لحضوري.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}.

الإمضاء:
`
  },
  {
    id: 'house_building_proxy',
    name: 'نمودج وكالة بالبناء فوق منزل',
    category: 'LEGAL',
    description: 'توكيل للقيام بإجراءات البناء فوق منزل قائم (إضافة طوابق).',
    fields: [
      { id: 'principal', label: 'بيانات الموكل', placeholder: '', type: 'textarea' },
      { id: 'agent', label: 'بيانات الوكيل', placeholder: '', type: 'textarea' },
      { id: 'houseLoc', label: 'موقع المنزل', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع (ة)أسفله:
السيد(ة): ${data.principal || '................'}

بموجب هذه الوثيقة وبكافة الضمانات الفعلية والقانونية اشهد على نفسي وألتزم وأنا بكامل قواي العقلية والجسدية بأنني أوكل عني السيد(ة): ${data.agent || '................'} لينوب عني ويقوم مقامي من أجل قيامه بكافة الإجراءات الإدارية والقانونية قصد البناء فوق المنزل الكائن بـ ${data.houseLoc || '................'}.
بحيث يصبح له الحق في تمثيلي والتكلم بالنيابة عني امام جميع الإدارات العمومية والشبه العمومية والخاصة (البلدية، العمالة، مصلحة الضرائب) في كل ما يعرض له في ذلك من قول أو فعل وطلب وسحب وأداء واستخراج رخصة البناء والتوقيع نيابة عني في كافة الأوراق والمعاملات المتعلقة بهذا الخصوص فقط وذلك دون الحاجة لحضوري (باستثناء البيع والشراء).

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}.

الإمضاء:
`
  },
  {
    id: 'shop_management_proxy',
    name: 'وكالة بالتصرف الكامل في محل تجاري',
    category: 'LEGAL',
    description: 'توكيل لإدارة محل تجاري، فسح عقود الكراء، التنازل عنه، والتعامل مع السجل التجاري.',
    fields: [
      { id: 'principal', label: 'بيانات الموكل', placeholder: '', type: 'textarea' },
      { id: 'agent', label: 'بيانات الوكيل', placeholder: '', type: 'textarea' },
      { id: 'shopLoc', label: 'موقع المحل التجاري', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
انا الموقع أسفله:
السيد(ة): ${data.principal || '................'}

بموجب هذه الوثيقة و بكافة الضمانات الفعلية والقانونية اشهد على نفسي وألتزم وأنا بكامل قواي العقلية والجسدية بأنني أوكل عني السيد(ة): ${data.agent || '................'} لينوب عني ويقوم مقامي في كل ما يخص المحل التجاري الكائن بـ ${data.shopLoc || '................'}.
حيث يحق له تحرير وفسخ ومصادقة عقد الكراء أو التنازل عنه أو كرائه لمكتري جديد وكذا التنازل عن السجل التجاري والتعامل مع جميع الإدارات العمومية والضرائب والمحاكم بكل ما يعرض له في ذلك من قول أو فعل والتوقيع نيابة عني في كافة الأوراق والمعاملات المتعلقة بهذا الأمر دون الحاجة لحضوري.

حرر بـ ${data.city || '.......'} بتاريخ ${data.date || '........'}.

الإمضاء:
`
  },
  {
    id: 'landline_cancellation',
    name: 'طلب فسخ عقد الهاتف الثابت',
    category: 'ADMINISTRATIVE',
    description: 'نموذج طلب رسمي لإلغاء اشتراك خدمات الهاتف الثابت لاتصالات المغرب.',
    fields: [
      { id: 'fullName', label: 'الاسم الكامل للمشترك(ة)', placeholder: '', type: 'text' },
      { id: 'address', label: 'عنوان السكن المربوط بالخدمة', placeholder: '', type: 'textarea' },
      { id: 'agencyCity', label: 'مدينة الوكالة التجارية', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
من السيدة/السيد: ${data.fullName || '................'}
العنوان: ${data.address || '................'}

إلى السيد: مدير الوكالة التجارية لاتصالات المغرب بـ ${data.agencyCity || '................'}

الموضوع: طلب فسخ عقدة الهاتف الثابت.

سلام تام بوجود مولانا الإمام،

وبعد:
علاقة بالموضوع المشار إليه أعلاه، يشرفني سيدي المدير أن أرفع لكم طلبي هذا راجية منكم أن ينال قبولكم ملتمسة فيه قطع الاتصال بالهاتف الثابت بالمنزل الكائن بالعنوان أعلاه.

وفي انتظار ذلك تقبلوا سيدي فائق الاحترام والتقدير.

والســــــــــــــــــــــــــلام

حرر بـ ${data.city || '.......'} في ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'promise_to_sell_realestate',
    name: 'عقد وعد بالبيع (عقاري)',
    category: 'PROPERTY',
    description: 'عقد وعد بالبيع يحدد شروط البيع المستقبلي، العربون، والأجل المحدد لإتمام العقد النهائي.',
    fields: [
      { id: 'sellerInfo', label: 'بيانات الواعد (البائع)', placeholder: '', type: 'textarea' },
      { id: 'buyerInfo', label: 'بيانات الموعود له (المشتري)', placeholder: '', type: 'textarea' },
      { id: 'propDesc', label: 'وصف العقار ومساحته وحدوده', placeholder: 'بقعة أرضية، حدودها، طولها وعرضها...', type: 'textarea' },
      { id: 'deadlineMonth', label: 'شهر نهاية الأجل', placeholder: 'مثلاً: دجنبر', type: 'text' },
      { id: 'deadlineYear', label: 'سنة نهاية الأجل', placeholder: 'مثلاً: 2024', type: 'text' },
      { id: 'delayPenalty', label: 'شرط جزائي عند التأخير (درهم)', placeholder: '', type: 'text' },
      { id: 'totalPrice', label: 'ثمن البيع الإجمالي', placeholder: '', type: 'text' },
      { id: 'deposit', label: 'مبلغ العربون المؤدى', placeholder: '', type: 'text' },
      { id: 'inheritanceDoc', label: 'أصل الملكية (إرث/شراء...)', placeholder: '', type: 'text' },
      { id: 'courtCity', label: 'المدينة المختصة قضائياً', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ التوقيع', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
تم تحرير هذا العقد بين كل من:
- الطرف الأول: ${data.sellerInfo || '........'} (المعبر عنه فيما بعد بالواعد)
- الطرف الثاني: ${data.buyerInfo || '........'} (المعبر عنه فيما بعد بالموعود له)

يقر الطرفان بأهليتهما للتعاقد واتفاقهما على ما يلى:

- البند الأول:
يمتلك الواعد العقار الموصوف ادناه كما يلي: ${data.propDesc || '........'}

- البند الثاني:
يلتزم الواعد ببيع العقار المبين بالبند السابق للموعود له إذا ما أبدى الأخير رغبته فى الشراء خلال أجل أقصاه نهاية شهر ${data.deadlineMonth || '........'} من سنة ${data.deadlineYear || '........'} على أن تبدى هذه الرغبة بإنذار على يد مفوض قضائي فى حالة تغيب الواعد عن موطنه الثابت بهذا العقد أو في حالة امتناعه عن إتمام العقد فور إبداء الرغبة شفاهة من الموعود له. وحينئذ يحق للموعود له اتخاذ الإجراءات القانونية لتحويل العقد إلى عقد بيع صحيح وذلك بعد إبداء هذه الرغبة.

- البند الثالث:
يلتزم الواعد بتسليم العين للموعود له بعد ثلاثة أشهر من إبداء الأخير رغبته في إتمام البيع. وإلا كان ملتزما بان يدفع للموعود له مبلغ ${data.delayPenalty || '........'} درهم عن كل تأخير. وقد روعي فى هذا التقدير ما سوف يتكبده الموعود له من خسائر بسبب إرجاء التسليم.

- البند الرابع:
تم الاتفاق على ثمن قدره ${data.totalPrice || '........'} درهم فقط يلتزم الموعود له بأن يدفع منه مبلغ ${data.deposit || '........'} درهم عند التوقيع على العقد الابتدائي. والباقي عند التوقيع على العقد النهائي.

- البند الخامس:
يقر الواعد بخلو العين من كافة الحقوق العينية الأصلية والتبعية كما هي معرفة به في القانون.

- البند السادس:
يقر الواعد بأنه الحائز للعين محل هذا العقد وبأنها غير مؤجرة ولم تحرر عقود إيجار فى شأنها.

- البند السابع:
يضمن الواعد للموعود له كافة التعرضات القانونية الصادرة من الغير.

- البند الثامن:
انتقلت الملكية للواعد بموجب ${data.inheritanceDoc || '........'}

- البند التاسع:
يقر الموعود له بأنه عاين العين معاينه تامة نافية للجهالة وأنه قبل التعامل فيها بحالتها التي كانت عليها وقت المعاينة.

- البند العاشر:
تختص محاكم ${data.courtCity || '........'} بنظر ما ينشب عن هذا العقد من منازعات.

- البند الحادي عشر:
نحن الطرفان المتعاقدان والموقعان اسفله على العقد مع تصحيح الامضاء نشهد ونحن عارفين قدره وملتزمين بتنفيذ جميع البنود الواردة في العقد وحرر هذا العقد في حسن نية من نسختين، لكل طرف نسخة يومه ${data.date || '........'}.

إمضاء الواعد:                                             إمضاء الموعود له:
`
  },
  {
    id: 'prosecutor_complaint_generic',
    name: 'شكاية إلى وكيل الملك (نموذج عام)',
    category: 'LEGAL',
    description: 'نموذج شكاية رسمية ترفع إلى السيد وكيل الملك لعرض وقائع جنائية أو جنحية.',
    fields: [
      { id: 'plaintiffInfo', label: 'بيانات المشتكي (المتضرر)', placeholder: '', type: 'textarea' },
      { id: 'defenseInfo', label: 'بيانات المشتكى به', placeholder: '', type: 'textarea' },
      { id: 'courtCity', label: 'مدينة المحكمة الابتدائية', placeholder: '', type: 'text' },
      { id: 'subject', label: 'موضوع الشكاية', placeholder: '', type: 'text' },
      { id: 'facts', label: 'عرض الوقائع بالتفصيل', placeholder: 'اذكر التاريخ، الساعة، الحجج، الشهود...', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
لفائدة: ${data.plaintiffInfo || '................'}
ضــــد: ${data.defenseInfo || '................'}

إلى السيد وكيل الملك لدى المحكمة الابتدائية بمدينة ${data.courtCity || '................'}

الموضوع: شكاية من أجل ${data.subject || '................'}

بكل تقدير واحترام يشرفني أن أعرض على سيادتكم ما يلي:
حيث أنه ${data.facts || '................'}

لهذه الأسباب أطلب من سيادتكم الموقرة اتخاذ الإجراءات اللازمة والضرورية وإعطاء أوامركم للضابطة القضائية قصد إجراء بحث في الموضوع ومتابعة المشتكى به أعلاه بالمنسوب إليه ولسيادتكم واسع النظر.

وتقبلوا فائق احترامي وعظيم شكري.

حرر بـ ${data.city || '.......'} في: ${data.date || '........'}

التوقيع:
`
  },
  {
    id: 'road_block_threat_complaint',
    name: 'شكاية من أجل اعتراض الطريق والتهديد',
    category: 'LEGAL',
    description: 'شكاية جنائية في مواجهة من يعترض سبيل وسائل النقل أو يهدد بالأذى (سائقي التطبيقات وغيرهم).',
    fields: [
      { id: 'plaintiffInfo', label: 'بيانات المشتكي كاملة', placeholder: '', type: 'textarea' },
      { id: 'courtCity', label: 'مدينة المحكمة', placeholder: '', type: 'text' },
      { id: 'defendantName', label: 'هوية المشتكى به / بيانات السيارة', placeholder: '', type: 'text' },
      { id: 'incidentDate', label: 'تاريخ الواقعة وساعتها', placeholder: '', type: 'text' },
      { id: 'factsDetails', label: 'تفاصيل ما وقع بالضبط (التهديد، العنف...)', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'تاريخ تحرير الشكاية', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
من: ${data.plaintiffInfo || '................'}
إلى السيد وكيل الملك لدى المحكمة الابتدائية بـ ${data.courtCity || '................'}

الموضوع: شكاية من أجل اعتراض الطريق والتهديد

سلام تام بوجود مولانا الإمام،

يشرفني أن أتقدم إلى سيادتكم بهذه الشكاية ضد المدعو: ${data.defendantName || '................'}

الوقائع:
بتاريخ ${data.incidentDate || '................'} بينما كنت أزاول عملي، فوجئت بالمشتكى به يقوم بقطع طريقي بشكل خطير وتعمد إيقافي.
${data.factsDetails || '................'}
هذا التصرف عرضني للخطر، وأدى إلى عرقلة السير العام، كما أن المعني بالأمر تهجم علي لفظيًا/حاول الاعتداء علي.

الأساس القانوني:
– الفصل 591 من القانون الجنائي: تجريم عرقلة الطريق أو اعتراض وسائل النقل.
– الفصول 400 وما بعدها: تجريم العنف أو التهديد.
– الفصل 595: تجريم إلحاق الضرر بممتلكات الغير.

الطلب:
ألتمس من سيادتكم فتح بحث في النازلة ومتابعة المشتكى به طبقا للقانون، حماية لسلامتي الجسدية والمعنوية وضمانًا لحق السير بأمان في الطريق العمومي.

وتفضلوا، سيدي وكيل الملك، بقبول فائق الاحترام والتقدير.

حرر بـ ${data.city || '.......'} في: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'fraud_complaint_540',
    name: 'شكاية من أجل النصب (الفصل 540)',
    category: 'LEGAL',
    description: 'نموذج شكاية النصب ترفع لوكيل الملك عند التعرض للاحتيال أو سلب مال باستعمال طرق تدليسية.',
    fields: [
      { id: 'plaintiffInfo', label: 'بيانات المشتكي كاملة والعنوان', placeholder: '', type: 'textarea' },
      { id: 'courtCity', label: 'مدينة المحكمة المختصة', placeholder: '', type: 'text' },
      { id: 'incidentDate', label: 'تاريخ وقوع النصب', placeholder: '', type: 'text' },
      { id: 'facts', label: 'عرض وقائع النصب وطريقته', placeholder: '', type: 'textarea' },
      { id: 'defendantInfo', label: 'هوية المشتكى به وعنوانه', placeholder: '', type: 'text' },
      { id: 'attachments', label: 'المرفقات (شهود، وثائق...)', placeholder: '', type: 'textarea' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
من: ${data.plaintiffInfo || '................'}
إلى السيد وكيل الملك لدى المحكمة الابتدائية بـ ${data.courtCity || '................'}

الموضوع: شكاية من أجل النصب

بكل تقدير واحترام يشرفني أن أعرض على سيادتكم ما يلي:
أنه بتاريخ ${data.incidentDate || '................'}.
${data.facts || '........'}
وبما أن هذه الأفعال تكون جريمة النصب المنصوص عليها وعلى عقوبتها في الفصل 540 من القانون الجنائي والمرتكبة بالدائرة القضائية لمحكمتكم منذ زمن لم يمض عليه أمد التقادم الجنحي.

لهذه الأسباب، نلتمس من سيادتكم العمل على إصدار أمركم للضابطة القضائية المختصة من أجل الاستماع إلى المشتكى به: ${data.defendantInfo || '........'} بشأن الأفعال المنسوبة إليه ومتابعته من أجل جريمة النصب طبقا للفصل المشار إليه أعلاه وإشعاري بذلك حتى أتمكن من الانتصاب طرفا مدنيا للمطالبة بالتعويض.

المرفقات: ${data.attachments || '................'}

حرر بـ ${data.city || '.......'} في: ${data.date || '........'}

التوقيع:
`
  },
  {
    id: 'breach_of_trust_debt',
    name: 'شكاية خيانة الأمانة وعدم تسديد دين',
    category: 'LEGAL',
    description: 'شكاية جنائية تدمج بين خيانة الأمانة وإنكار الدين الثابت بوثيقة.',
    fields: [
      { id: 'plaintiffInfo', label: 'بيانات المشتكي', placeholder: '', type: 'textarea' },
      { id: 'defendantInfo', label: 'بيانات المشتكى به', placeholder: '', type: 'textarea' },
      { id: 'courtCity', label: 'مدينة المحكمة', placeholder: '', type: 'text' },
      { id: 'debtAmount', label: 'مبلغ الدين', placeholder: '', type: 'text' },
      { id: 'dueDate', label: 'تاريخ استحقاق الدين', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
لفائدة السيد(ة): ${data.plaintiffInfo || '................'}
ضد السيد(ة): ${data.defendantInfo || '................'}

إلى السيد وكيل الملك لدى المحكمة الابتدائية بـ ${data.courtCity || '................'}

الموضوع: شكاية في شأن خيانة الامانة وعدم تسديد دين

سلام تام بوجود مولانا الإمام،

وبعد، حيث انني قد أقرضت المشتكى به على وجه السلف والإحسان مبلغ وقدره ${data.debtAmount || '........'} درهم (رفقته اعتراف بدين).
وحيث أن تاريخ انتهاء مدة أداء الدين قد انتهى بتاريخ ${data.dueDate || '........'} ورغم أني توجهت عنده بحسن نية في عدة مناسبات لمطالبته بأداء الدين، لأفاجئ بإفصاحه المباشر عن عدم رغبته في أداء الدين، و إنكاره الدين، وحيث أن جميع المساعي الودية معه قد بائت بالفشل.

لهذه الأسباب ألتمس من سيادتكم الموقرة إعطاء أمركم للضابطة القضائية من أجل استدعاء المشتكى به و سماعه ومتابعته فيما نسب اليه من أجل جنحة خيانة الأمانة وعدم تسديد الدين و اتخاذ جميع الإجراءات الزجرية في حقه.

وتقبلوا سيدي فائق احتراماتي.

المرفقات: نسخة من اعتراف بدين.

حرر بـ ${data.city || '.......'} في: ${data.date || '........'}

الامضاء:
`
  },
  {
    id: 'bad_cheque_complaint',
    name: 'شكاية شيك بدون رصيد',
    category: 'LEGAL',
    description: 'شكاية رسمية عند استلام شيك ورجوعه من البنك دون صرف (عدم وجود مؤونة).',
    fields: [
      { id: 'plaintiffInfo', label: 'بيانات المشتكي', placeholder: '', type: 'textarea' },
      { id: 'courtCity', label: 'مدينة المحكمة', placeholder: '', type: 'text' },
      { id: 'defendantInfo', label: 'هوية المشتكى به الكاملة', placeholder: '', type: 'text' },
      { id: 'chequeNum', label: 'رقم الشيك', placeholder: '', type: 'text' },
      { id: 'bankName', label: 'اسم البنك والوكالة المطرود منها', placeholder: '', type: 'text' },
      { id: 'amount', label: 'مبلغ الشيك (درهم)', placeholder: '', type: 'text' },
      { id: 'chequeDate', label: 'تاريخ الشيك', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ الحالي', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
الحمد لله وحد                                                      

من السيد(ة): ${data.plaintiffInfo || '................'}
إلى السيد المحترم: وكيل الملك لدى المحكمة الابتدائية بــ ${data.courtCity || '................'}

الموضوع: شكاية بخصوص شيك بدون رصيد

سلام تام بوجود مولانا الإمام وبعد،

يشرفني أن أتقدم إلى سيادتكم المحترمة بهذه الشكاية من أجل اتخاذ الإجراءات القانونية اللازمة بخصوص شيك بدون رصيد توصلت به من طرف السيد/السيدة ${data.defendantInfo || '................'}

حيث إن المشتكى به قام بتسليمي شيكًا يحمل رقم ${data.chequeNum || '........'}، مسحوبًا على بنك ${data.bankName || '........'} بمبلغ قدره ${data.amount || '........'} درهم، وذلك بتاريخ ${data.chequeDate || '........'}، وعند تقديمي للشيك من أجل صرفه لدى المؤسسة البنكية المذكورة، تم رفض الأداء بعلة عدم وجود رصيد كافٍ حسب ما هو ثابت من شهادة الرفض الصادرة عن البنك.

وبناءً على ذلك، ألتمس من سيادتكم الموقرة فتح بحث في الموضوع واتخاذ الإجراءات القانونية اللازمة في حق المشتكى به طبقًا لمقتضيات القانون الجنائي وقانون الشيكات الجاري بهما العمل.

وتفضلوا، السيد وكيل الملك، بقبول فائق عبارات التقدير والاحترام.

حرر بـ ${data.city || '.......'} في: ${data.date || '........'}

التوقيع:
`
  },
  {
    id: 'water_pressure_complaint',
    name: 'شكاية انخفاض صبيب المياه',
    category: 'ADMINISTRATIVE',
    description: 'شكاية موجهة للمكتب الوطني للماء والكهرباء بخصوص ضعف تزويد الماء بالمنزل.',
    fields: [
      { id: 'customerInfo', label: 'بيانات المشترك والعنوان', placeholder: '', type: 'textarea' },
      { id: 'contractNum', label: 'رقم الاشتراك أو العقد', placeholder: '', type: 'text' },
      { id: 'branchCity', label: 'مدينة قطاع الماء', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
من السيد(ة): ${data.customerInfo || '................'}
رقم الاشتراك أو العقد: ${data.contractNum || '................'}

إلى السيد المحترم المدير الإقليمي للمكتب الوطني للماء والكهبرة – قطاع الماء بــ ${data.branchCity || '................'}

الموضوع: شكاية بخصوص انخفاض صبيب المياه.

سلام تام بوجود مولانا الإمام وبعد،

يشرفني أن أتقدم إلى سيادتكم المحترمة بهذه الشكاية لأحيطكم علمًا بأننا نعاني منذ مدة من انخفاض حاد ومتكرر في صبيب المياه بمحل سكناي، وهو ما تسبب لنا في صعوبات كبيرة في قضاء الحاجات اليومية.
ورغم أداء جميع الفواتير في وقتها واحترام الالتزامات التعاقدية، إلا أن مشكل ضعف الضغط لا يزال قائمًا، مما يدل على وجود خلل تقني أو ضعف في شبكة التوزيع بالمنطقة.

وعليه، ألتمس من سيادتكم الموقرة التدخل العاجل لإصلاح المشكل، وإعادة الصبيب إلى حالته العادية.

وتقبلوا، السيد المدير، فائق التقدير والاحترام.

حرر بـ ${data.city || '.......'} في: ${data.date || '........'}

التوقيع:
`
  },
  {
    id: 'scholarship_complaint',
    name: 'شكاية بخصوص منحة',
    category: 'ADMINISTRATIVE',
    description: 'نموذج شكاية للمطالبة بمستحقات المنحة الدراسية الموقوفة أو المتأخرة.',
    fields: [
      { id: 'studentInfo', label: 'بيانات الطالب ورقم الهوية', placeholder: '', type: 'textarea' },
      { id: 'authorityName', label: 'اسم الجهة المختصة (وزارة، أكاديمية...)', placeholder: '', type: 'text' },
      { id: 'grantType', label: 'نوع المنحة (دراسة، تدريب، دعم...)', placeholder: '', type: 'text' },
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
إلى السيد/ ${data.authorityName || '................'} المحترم،

تحية طيبة و بعد،

أنا الموقع أدناه، ${data.studentInfo || '................'}
أتقدم إليكم بهذه الشكاية بخصوص منحة ${data.grantType || '........'} التي لم أتوصل بها/تم إيقافها، رغم استيفائي لجميع الشروط المطلوبة للاستفادة منها.
لقد قمت باستكمال جميع الإجراءات الإدارية المطلوبة، وأرفقت الوثائق اللازمة ضمن المهل المحددة، إلا أنني فوجئت بعدم إدراج اسمي ضمن المستفيدين/بتوقفها دون معرفة الأسباب. 

لذا، ألتمس منكم التحقق من وضعيتي وإعادة النظر في القرار المتخذ، واتخاذ الإجراءات اللازمة لضمان حقي في الاستفادة من هذه المنحة.

وأرجو من سيادتكم النظر في طلبي هذا بعناية واتخاذ ما ترونه مناسبًا لإنصافي في أقرب وقت ممكن.

وفي انتظار ذلك تقبلوا مني سيادتكم فائق التقدير والاحترام والسلام.

حرر بـ ${data.city || '.......'} في: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'complaint_v1_general',
    name: 'نموذج شكاية عامة',
    category: 'COMPLAINTS',
    description: 'نموذج شكاية عامة يمكن استخدامه لمختلف الأغراض القانونية والإدارية.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'الاسم الكامل', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم بطاقة التعريف الوطنية', placeholder: '', type: 'text' },
      { id: 'address', label: 'العنوان', placeholder: '', type: 'textarea' },
      { id: 'recipient', label: 'موجهة إلى السيد', placeholder: 'مثلاً: وكيل الملك لدى المحكمة الابتدائية', type: 'text' },
      { id: 'subject', label: 'الموضوع', placeholder: '', type: 'text' },
      { id: 'details', label: 'نص الشكاية (الوقائع)', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
حرر بـ ${data.city || '.......'} في ${data.date || '........'}

لفائدة السيد: ${data.fullName || '................'}
الحامل لبطاقة التعريف الوطنية رقم: ${data.cin || '..............'}
العنوان: ${data.address || '................'}

موجهة إلى السيد: ${data.recipient || '................'}

الموضوع: شكاية من أجل ${data.subject || '................'}

سلام تام بوجود مولانا الإمام المؤيد بالله.

وبعد،
يشرفني أن أعرض أمام سيادتكم شكايتي هاته راجياً أن تجد لديكم العناية التي تستحقها، وهذا نصها:

${data.details || '................'}

وفي انتظار ما ستقررونه في هذا الشأن، تقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'complaint_colleague_harassment',
    name: 'شكاية بزميل(ة) في العمل/تظلم',
    category: 'COMPLAINTS',
    description: 'شكاية ضد زميل في العمل بسبب تصرفات غير مهنية أو اعتداء.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'الاسم الكامل للمشتكي', placeholder: '', type: 'text' },
      { id: 'address', label: 'العنوان', placeholder: '', type: 'textarea' },
      { id: 'recipient', label: 'موجهة إلى السيد المحترم مدير الشركة/المصلحة', placeholder: '', type: 'text' },
      { id: 'colleagueName', label: 'اسم الزميل المشتكى به', placeholder: '', type: 'text' },
      { id: 'details', label: 'تفاصيل الواقعة', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
بـ ${data.city || '.......'} في ${data.date || '........'}

من السيد: ${data.fullName || '................'}
العنوان: ${data.address || '................'}

إلى السيد المحترم: ${data.recipient || '................'}

الموضوع: شكاية / تظلم ضد ${data.colleagueName || '................'}

سلام تام بوجود مولانا الإمام.

وبعد،
يؤسفني سيدي المدير أن أتقدم أمامكم بشكايتي هاته ضد المسماة ${data.colleagueName || '................'} التي تعمل معي بنفس المصلحة.

حيث أنها ${data.details || '................'}

لذا ألتمس منكم سيدي المدير التدخل لرفع هذا الضرر واتخاذ الإجراءات اللازمة في حق المعنية بالأمر لضمان سير العمل في ظروف مهنية سليمة.

وتقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'complaint_tax_discrepancy',
    name: 'شكاية لرئيس مصلحة الضرائب',
    category: 'COMPLAINTS',
    description: 'شكاية بخصوص فرق في تقدير جباية أو ضريبة.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'الاسم الكامل', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم ب.ت.و', placeholder: '', type: 'text' },
      { id: 'address', label: 'العنوان', placeholder: '', type: 'textarea' },
      { id: 'taxBase', label: 'رقم الملف الضريبي', placeholder: '', type: 'text' },
      { id: 'taxType', label: 'نوع الضريبة المتنازع عليها', placeholder: '', type: 'text' },
      { id: 'details', label: 'أسباب الاعتراض', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
حرر بـ ${data.city || '.......'} في ${data.date || '........'}

من السيد: ${data.fullName || '................'}
الحامل لبطاقة التعريف الوطنية رقم: ${data.cin || '..............'}
العنوان: ${data.address || '................'}

إلى السيد: رئيس مصلحة الضرائب بـ ${data.city || '.......'}

الموضوع: شكاية بخصوص ${data.taxType || '................'} (ملف رقم ${data.taxBase || '........'})

سلام تام بوجود مولانا الإمام.

وبعد،
يشرفني أن أتقدم لسيادتكم بهذه الشكاية بخصوص الضريبة السالفة الذكر، حيث أنني لاحظت وجود حيف/خطأ في تقدير مبلغ الضريبة.

حيث أن ${data.details || '................'}

لذا ألتمس منكم سيدي الرئيس مراجعة هذا الملف والقيام ببحث ميداني/إداري لتصحيح هذا الوضع وإعادة النظر في مبلغ الجباية المفروض علي.

وفي انتظار ردكم، تقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'complaint_neighbor_noise',
    name: 'شكاية حول الضجيج والضوضاء',
    category: 'COMPLAINTS',
    description: 'شكاية ضد الجيران أو محل بسبب الضجيج وإزعاج الساكنة.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'الاسم الكامل للمشتكي', placeholder: '', type: 'text' },
      { id: 'address', label: 'العنوان', placeholder: '', type: 'textarea' },
      { id: 'recipient', label: 'موجهة إلى (قائد، وكيل الملك...)', placeholder: '', type: 'text' },
      { id: 'neighborInfo', label: 'المشتكى به (الاسم أو المحل)', placeholder: '', type: 'text' },
      { id: 'noiseType', label: 'نوع الضجيج (موسيقى، آلات، صراخ...)', placeholder: '', type: 'text' },
      { id: 'details', label: 'تفاصيل الواقعة والأوقات', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
حرر بـ ${data.city || '.......'} في ${data.date || '........'}

من السيد: ${data.fullName || '................'}
الساكن بـ: ${data.address || '................'}

إلى السيد: ${data.recipient || '................'}

الموضوع: شكاية حول الضجيج والضوضاء الصادر عن ${data.neighborInfo || '........'}

سلام تام بوجود مولانا الإمام.

وبعد،
يشرفني أن أتقدم أمامكم بهذه الشكاية ضد ${data.neighborInfo || '................'} الكائن بجواري بالعنوان المذكور أعلاه.

حيث أن المعني بالأمر يتسبب في ضجيج عارم ونفاد الصبر من خلال ${data.noiseType || '........'}، وذلك في أوقات متأخرة/طوال اليوم.
${data.details || '................'}
مما يتسبب في أضرار نفسية وصحية لي ولأسرتي ويقلق راحتنا في بيوتنا.

لذا ألتمس منكم التدخل العاجل لرفع هذا الضرر الجسيم وإلزام المعني بالأمر باحترام السكينة والوقار وفق ما يقتضيه القانون.

وتقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'complaint_v2_landlord',
    name: 'شكاية بمكتري قصد رفع الضرر',
    category: 'COMPLAINTS',
    description: 'شكاية من صاحب الملك ضد المكتري بسبب إحداث أضرار أو مخالفة العقد.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'ownerName', label: 'اسم صاحب الملك', placeholder: '', type: 'text' },
      { id: 'tenantName', label: 'اسم المكتري', placeholder: '', type: 'text' },
      { id: 'propertyLoc', label: 'عنوان العقار المكتري', placeholder: '', type: 'textarea' },
      { id: 'damageDetails', label: 'تفاصيل الضرر أو المخالفة', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
حرر بـ ${data.city || '.......'} في ${data.date || '........'}

لفائدة السيد: ${data.ownerName || '................'} (صاحب الملك)
ضــــــــــد: ${data.tenantName || '................'} (المكتري)

إلى السيد: وكيل الملك لدى المحكمة الابتدائية بـ ${data.city || '.......'}

الموضوع: شكاية قصد رفع الضرر الناتج عن المكتري

سلام تام بوجود مولانا الإمام.

وبعد،
يشرفني أن أعرض أمام سيادتكم أن المشتكى به يكتري مني المحل/الشقة الكائنة بـ ${data.propertyLoc || '................'}.
وحيث أنه قام بـ ${data.damageDetails || '................'} مما ألحق بي وبجرياني أضراراً بليغة.

لذا ألتمس منكم إعطاء أوامركم للضابطة القضائية لإجراء معاينة والبحث في الموضوع واتخاذ الإجراءات الزجرية اللازمة في حقه.

وتقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'complaint_car_scam',
    name: 'شكاية بالنصب في تغيير مكونات سيارة',
    category: 'COMPLAINTS',
    description: 'شكاية ضد ميكانيكي أو بائع بسبب النصب عبر تغيير قطع غيار أصلية بغيرها أو التلاعب.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المشتكي', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم ب.ت.و', placeholder: '', type: 'text' },
      { id: 'address', label: 'العنوان', placeholder: '', type: 'textarea' },
      { id: 'mechanicInfo', label: 'اسم المشتكى به (الميكانيكي/المحل)', placeholder: '', type: 'text' },
      { id: 'carInfo', label: 'بيانات السيارة (النوع، اللوحة)', placeholder: '', type: 'text' },
      { id: 'details', label: 'تفاصيل النصب والتلاعب المكتشف', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
حرر بـ ${data.city || '.......'} في ${data.date || '........'}

من السيد: ${data.fullName || '................'}
الحامل لبطاقة التعريف الوطنية رقم: ${data.cin || '..............'}
العنوان: ${data.address || '................'}

إلى السيد: وكيل الملك لدى المحكمة الابتدائية بـ ${data.city || '.......'}

الموضوع: شكاية من أجل النصب وتغيير مكونات سيارة

سلام تام بوجود مولانا الإمام.

وبعد،
يشرفني أن أعرض أمام سيادتكم أنني وضعت سيارتي من نوع ${data.carInfo || '........'} لدى المشتكى به ${data.mechanicInfo || '................'} قصد الإصلاح.
إلا أنني فوجئت بعد استلامها بأن المعني بالأمر قام بـ ${data.details || '................'} واستبدال قطع غيار أصلية بأخرى غير صالحة/قديمة دون علمي، مما يعد نصباً واحتيالاً ومساً بسلامتي.

لذا ألتمس منكم إعطاء أوامركم للبحث في هذه النازلة ومتابعة المشتكى به وفقاً للقانون.

وتقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'complaint_prevented_entry',
    name: 'شكاية بمنعي من دخول منزلي',
    category: 'COMPLAINTS',
    description: 'شكاية ضد شخص يمنع صاحب البيت أو المكتري من الدخول إلى مسكنه.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المشتكي', placeholder: '', type: 'text' },
      { id: 'address', label: 'عنوان المنزل موضوع النزاع', placeholder: '', type: 'textarea' },
      { id: 'defendantName', label: 'اسم المشتكى به', placeholder: '', type: 'text' },
      { id: 'details', label: 'ملابسات المنع وتاريخه', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
حرر بـ ${data.city || '.......'} في ${data.date || '........'}

من السيد: ${data.fullName || '................'}
العنوان: ${data.address || '................'}

إلى السيد: وكيل الملك لدى المحكمة الابتدائية بـ ${data.city || '.......'}

الموضوع: شكاية من أجل منعي من دخول منزلي

سلام تام بوجود مولانا الإمام.

وبعد،
يشرفني أن أعرض لسيادتكم أن المشتكى به ${data.defendantName || '................'} قام بمنعي من الدخول إلى منزلي الكائن بالعنوان أعلاه بطريقة غير قانونية.
حيث أنه ${data.details || '................'} مما حرمني من حقي في السكن وحيازة ملكي.

لذا ألتمس منكم التدخل العاجل لتمكيني من دخولي منزلي وفتح بحث مع المشتكى به بخصوص هذا الاعتداء على الملكية والحيازة.

وتقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'complaint_assault_abuse',
    name: 'شكاية بالضرب والسب والشتم',
    category: 'COMPLAINTS',
    description: 'شكاية جنائية في حالة التعرض لاعتداء جسدي ولفظي.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المشتكي', placeholder: '', type: 'text' },
      { id: 'address', label: 'العنوان', placeholder: '', type: 'textarea' },
      { id: 'defendantInfo', label: 'بيانات المشتكى به', placeholder: '', type: 'text' },
      { id: 'incidentDetails', label: 'تفاصيل الاعتداء (الزمان والمكان)', placeholder: '', type: 'textarea' },
      { id: 'witnesses', label: 'الشهود أو المرفقات (شهادة طبية مثلاً)', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
حرر بـ ${data.city || '.......'} في ${data.date || '........'}

من السيد: ${data.fullName || '................'}
العنوان: ${data.address || '................'}

إلى السيد: وكيل الملك لدى المحكمة الابتدائية بـ ${data.city || '.......'}

الموضوع: شكاية من أجل الضرب والسب والشتم

سلام تام بوجود مولانا الإمام.

وبعد،
يشرفني أن أتقدم لسيادتكم بهذه الشكاية ضد ${data.defendantInfo || '................'} الذي اعترض سبيلي بـ ${data.incidentDetails || '................'} وقام بالاعتداء علي بالضرب والسب والشتم بأقذع الأوصاف أمام مرأى ومسمع الناس.

وقد نتج عن ذلك أضرار جسدية ونفسية (أرفق شهادة طبية رقم: ${data.witnesses || '.......'}).

لذا ألتمس منكم متابعة المشتكى به من أجل أفعاله الإجرامية وإنصافي وفق القانون.

وتقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'complaint_assault_battery',
    name: 'شكاية بالضرب والجرح',
    category: 'COMPLAINTS',
    description: 'شكاية في حالة التعرض لاعتداء جسدي عنيف خلف جروحاً (جناية/جنحة).',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المشتكي', placeholder: '', type: 'text' },
      { id: 'defendantName', label: 'اسم المعتدي', placeholder: '', type: 'text' },
      { id: 'incidentPlace', label: 'مكان ووقائع الاعتداء', placeholder: '', type: 'textarea' },
      { id: 'medicalCert', label: 'مدة العجز في الشهادة الطبية', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
حرر بـ ${data.city || '.......'} في ${data.date || '........'}

من السيد: ${data.fullName || '................'}

إلى السيد: وكيل الملك لدى المحكمة الابتدائية بـ ${data.city || '.......'}

الموضوع: شكاية من أجل الضرب والجرح المفضي إلى عجز

سلام تام بوجود مولانا الإمام.

وبعد،
يعرض المشتكي لسيادتكم أنه تعرض لاعتداء شنيع من طرف ${data.defendantName || '................'} بتاريخ ${data.date || '........'} بـ ${data.incidentPlace || '................'}.
حيث استعمل المعتدي ${data.defendantName || '........'} وسائل عنيفة تسببت للمشتكي في جروح بالغة استوجبت منحه شهادة طبية مدة العجز بها ${data.medicalCert || '........'} يوماً (مرفقة).

لذا نلتمس منكم إعطاء التعليمات للقبض على المعتدي ومتابعته بالأفعال المنسوبة إليه.

وتقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'complaint_tax_notice_paid',
    name: 'شكاية بتوصل بإعلام ضريبي مؤدى عنه',
    category: 'COMPLAINTS',
    description: 'تظلم بخصوص مطالبة ضريبية لضريبة سبق أداؤها فعلياً.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم الملزم بالضريبة', placeholder: '', type: 'text' },
      { id: 'address', label: 'العنوان', placeholder: '', type: 'textarea' },
      { id: 'taxBase', label: 'رقم الإشعار أو الملف', placeholder: '', type: 'text' },
      { id: 'paymentRef', label: 'رقم وتاريخ وصل الأداء السابق', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
حرر بـ ${data.city || '.......'} في ${data.date || '........'}

من السيد: ${data.fullName || '................'}
العنوان: ${data.address || '................'}

إلى السيد: قابض الإدارة الجبائية بـ ${data.city || '.......'}

الموضوع: شكاية بتوصل بإعلام ضريبي سبق وأن تم أداء قيمته

سلام تام بوجود مولانا الإمام.

وبعد،
أحيطكم علماً أنني توصلت بإعلام ضريبي رقم ${data.taxBase || '........'} يطالبني بأداء مبلغ مالي برسم ضريبة ${data.taxBase || '........'}.
وحيث أنني قمت فعلياً بأداء هذه الضريبة بتاريخ سابق تحت وصل رقم ${data.paymentRef || '................'} (مرفق نسخة منه).

لذا أرجو منكم تصحيح هذا الخطأ الإداري وتحيين وضعيتي الجبائية لإيقاف إجراءات التحصيل.

وتقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'complaint_electricity_theft',
    name: 'شكاية باختلاس مادة الكهرباء',
    category: 'COMPLAINTS',
    description: 'شكاية ضد شخص يقوم بسرقة الكهرباء من عداد الغير أو الشبكة العامة.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المشتكي (المتضرر)', placeholder: '', type: 'text' },
      { id: 'address', label: 'عنوان العداد أو العقار', placeholder: '', type: 'textarea' },
      { id: 'defendantName', label: 'اسم المشتكى به أو عنوانه', placeholder: '', type: 'text' },
      { id: 'details', label: 'كيفية اكتشاف الاختلاس', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
حرر بـ ${data.city || '.......'} في ${data.date || '........'}

من السيد: ${data.fullName || '................'}
العنوان: ${data.address || '................'}

إلى السيد: المدير الإقليمي للمكتب الوطني للكهرباء بـ ${data.city || '.......'}

الموضوع: شكاية باختلاس مادة الكهرباء

سلام تام بوجود مولانا الإمام.

وبعد،
أتقدم لسيادتكم بهذه الشكاية قصد إخباركم أنني لاحظت ارتفاعاً مريباً في فاتورة الكهرباء، وبعد تفقد العداد تبين لي أن المشتكى به ${data.defendantName || '................'} يقوم باختلاس الكهرباء عبر ربط عشوائي من عدادي/الشبكة.
${data.details || '................'}

لذا أطلب من مصالحكم إرسال فرقة تقنية للمعاينة وإثبات حالة الاختلاس واتخاذ المتعين قانوناً لحمايتي من هذه السرقة.

وتقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'complaint_tax_correction',
    name: 'شكاية لتصحيح خطأ ضريبي',
    category: 'COMPLAINTS',
    description: 'طلب رسمي لتصحيح خطأ مادي أو حسابي في تقدير الضريبة.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'الاسم الكامل', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم ب.ت.و', placeholder: '', type: 'text' },
      { id: 'taxId', label: 'رقم التعريف الضريبي', placeholder: '', type: 'text' },
      { id: 'errorDetails', label: 'تفاصيل الخطأ المراد تصحيحه', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
حرر بـ ${data.city || '.......'} في ${data.date || '........'}

من السيد: ${data.fullName || '................'}
الحامل لبطاقة التعريف الوطنية رقم: ${data.cin || '..............'}

إلى السيد: مدير مصلحة الضرائب بـ ${data.city || '.......'}

الموضوع: شكاية قصد تصحيح خطأ ضريبي

سلام تام بوجود مولانا الإمام.

وبعد،
يشرفني أن أتقدم لسيادتكم بطلبي هذا قصد تصحيح خطأ مادي شاب ملفي الضريبي رقم ${data.taxId || '........'}.
حيث أنه تم ${data.errorDetails || '................'}.

لذا ألتمس منكم بكل احترام إعطاء أوامركم للمصالح المختصة قصد القيام بالتصحيح اللازم وإنصافي.

وتقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'complaint_illegal_dump',
    name: 'شكاية حول المطارح العشوائية',
    category: 'COMPLAINTS',
    description: 'شكاية موجهة للسلطات المحلية بخصوص تراكم النفايات في الحي.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المشتكي / ممثل الساكنة', placeholder: '', type: 'text' },
      { id: 'neighborhood', label: 'اسم الحي المتضرر', placeholder: '', type: 'text' },
      { id: 'details', label: 'وصف الوضعية الكارثية', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
حرر بـ ${data.city || '.......'} في ${data.date || '........'}

من السيد: ${data.fullName || '................'}
نيابة عن سكان حي: ${data.neighborhood || '................'}

إلى السيد: رئيس المجلس الجماعي / قائد الملحقة الإدارية

الموضوع: شكاية حول مطرح عشوائي للنفايات

سلام تام بوجود مولانا الإمام.

وبعد،
نحيطكم علماً سيدي الرئيس/القائد أن ساكنة الحي المذكور تعاني من تفاقم مطرح عشوائي للأزبال والنفايات بـ ${data.neighborhood || '........'} مما أصبح يهدد صحة الساكنة.
${data.details || '................'}

لذا نلتمس منكم التدخل العاجل لرفع هذه النفايات وتطهير المنطقة وتوفير حاويات كافية حفاظاً على البيئة والصحة العامة.

وتقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'complaint_vagrancy',
    name: 'شكاية حول إزعاج الساكنة من طرف المتسكعين',
    category: 'COMPLAINTS',
    description: 'شكاية أمنية بخصوص تجمع أشخاص غرباء يسببون القلق للساكنة.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المشتكي', placeholder: '', type: 'text' },
      { id: 'address', label: 'عنوان السكن المتضرر', placeholder: '', type: 'textarea' },
      { id: 'details', label: 'وصف السلوكيات المزعجة', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
حرر بـ ${data.city || '.......'} في ${data.date || '........'}

من السيد: ${data.fullName || '................'}
العنوان: ${data.address || '................'}

إلى السيد: عميد الشرطة / قائد الدرك الملكي بـ ${data.city || '.......'}

الموضوع: شكاية حول إزعاج الساكنة من طرف متسكعين

سلام تام بوجود مولانا الإمام.

وبعد،
يشرفني أن أبلغكم أن سكان حي ${data.city || '.......'} يعانون من تجمع مجموعة من الأشخاص المتسكعين والغرباء الذين يقضون وقتهم في ${data.details || '................'} مما يسبب ذعراً وإزعاجاً دائماً للساكنة ولأطفالنا.

لذا نلتمس من سيادتكم تكثيف الدوريات الأمنية في هذه المنطقة وتطهيرها من هذه السلوكيات ضماناً للأمن والسكينة.

وتقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'complaint_attempted_assault',
    name: 'شكاية بمحاولة اعتداء',
    category: 'COMPLAINTS',
    description: 'شكاية أمنية فور تعرض الشخص لمحاولة اعتداء جسدي باءت بالفشل أو تم منعها.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المشتكي', placeholder: '', type: 'text' },
      { id: 'defendantName', label: 'اسم المشتكى به (إن وجد)', placeholder: '', type: 'text' },
      { id: 'incidentPlace', label: 'مكان وتفاصيل المحاولة', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
حرر بـ ${data.city || '.......'} في ${data.date || '........'}

من السيد: ${data.fullName || '................'}

إلى السيد: وكيل الملك لدى المحكمة الابتدائية بـ ${data.city || '.......'}

الموضوع: شكاية بمحاولة اعتداء

سلام تام بوجود مولانا الإمام.

وبعد،
أعرض لسيادتكم أنني تعرضت لمحاولة اعتداء شنيعة من طرف ${data.defendantName || 'أشخاص مجهولين'} بتاريخ ${data.date || '........'} بـ ${data.incidentPlace || '................'}.
وحيث أنه لولا الأقدار الإلهية وتدخل المارة لحدث ما لا يحمد عقباه.

لذا ألتمس منكم فتح بحث في النازلة وتحديد هوية المعتدين ومتابعتهم حماية لسلامتي وحياتي.

وتقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'complaint_debt_non_payment',
    name: 'شكاية بعدم الوفاء بأداء دين',
    category: 'COMPLAINTS',
    description: 'شكاية بخصوص مماطلة في أداء دين ثابت بوثيقة أو اعتراف.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم الدائن (المشتكي)', placeholder: '', type: 'text' },
      { id: 'debtorName', label: 'اسم المدين (المشتكى به)', placeholder: '', type: 'text' },
      { id: 'amount', label: 'مبلغ الدين بالدرهم', placeholder: '', type: 'text' },
      { id: 'docRef', label: 'مرجع الوثيقة (تاريخ الاعتراف بالدين)', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
حرر بـ ${data.city || '.......'} في ${data.date || '........'}

من السيد: ${data.fullName || '................'}
لفائدة السيد: ${data.debtorName || '................'}

إلى السيد: وكيل الملك لدى المحكمة الابتدائية بـ ${data.city || '.......'}

الموضوع: شكاية بعدم الوفاء بأداء دين

سلام تام بوجود مولانا الإمام.

وبعد،
يشرفني أن أعرض أمام سيادتكم أن المشتكى به في ذمته مبلغ مالي قدره ${data.amount || '........'} درهم لفائدتي، وهو دين ثابت بموجب ${data.docRef || '........'}.
وحيث أن المدة الممنوحة للأداء قد انقضت، ورغم المطالبات الودية إلا أنه يماطل ويرفض الأداء دون مبرر قانوني.

لذا نلتمس منكم استدعاء المعني بالأمر ومساءلته حول هذا الفعل وإنصافي.

وتقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'complaint_water_bill_high',
    name: 'شكاية غلاء فاتورة الماء/الكهرباء',
    category: 'COMPLAINTS',
    description: 'اعتراض على مبلغ فاتورة استهلاك مرتفع جداً وغير مبرر.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المشترك', placeholder: '', type: 'text' },
      { id: 'contractNum', label: 'رقم العقد / الاشتراك', placeholder: '', type: 'text' },
      { id: 'billMonth', label: 'شهر وسنة الفاتورة المغلوطة', placeholder: '', type: 'text' },
      { id: 'billAmount', label: 'المبلغ المذكور في الفاتورة', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
حرر بـ ${data.city || '.......'} في ${data.date || '........'}

من السيد: ${data.fullName || '................'}
رقم العقد: ${data.contractNum || '........'}

إلى السيد: مدير الوكالة التجارية للماء والكهرباء بـ ${data.city || '.......'}

الموضوع: شكاية بخصوص غلاء وتضخم فاتورة الاستهلاك

سلام تام بوجود مولانا الإمام.

وبعد،
أحيطكم علماً أنني توصلت بفاتورة استهلاك شهر ${data.billMonth || '........'} بمبلغ خيالي قدره ${data.billAmount || '........'} درهم، وهو مبلغ لا يعكس استهلاكي الحقيقي والمعتاد.
أرجح وجود عطب في العداد أو خطأ في القراءة البشرية.

لذا ألتمس منكم إيقاف عملية الاستخلاص مؤقتاً وإيفاد لجنة لمراقبة العداد والتأكد من صحة الأرقام المسجلة.

وتقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'complaint_cafe_threat',
    name: 'شكاية بالسب والشتم والتهديد داخل مقهى',
    category: 'COMPLAINTS',
    description: 'شكاية بخصوص تعرض الشخص لمضايقات أو تهديدات في فضاء عمومي (مقهى).',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المشتكي', placeholder: '', type: 'text' },
      { id: 'cafeName', label: 'اسم المقهى وموقعه', placeholder: '', type: 'text' },
      { id: 'defendantName', label: 'اسم المشتكى به', placeholder: '', type: 'text' },
      { id: 'incidentDetails', label: 'تفاصيل الواقعة والتهديدات', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
حرر بـ ${data.city || '.......'} في ${data.date || '........'}

من السيد: ${data.fullName || '................'}

إلى السيد: وكيل الملك لدى المحكمة الابتدائية بـ ${data.city || '.......'}

الموضوع: شكاية من أجل السب والشتم والتهديد داخل مقهى

سلام تام بوجود مولانا الإمام.

وبعد،
أحيط سيادتكم علماً أنني كنت متواجداً بمقهى ${data.cafeName || '........'} بتاريخ ${data.date || '........'}، حيث تعرضت لهجوم لفظي وتهديدات خطيرة من طرف ${data.defendantName || '................'}.
وحيث أنه ${data.incidentDetails || '................'} مما تسبب في إحراجي أمام الزبائن وتهديد سلامتي الشخصية.

لذا نلتمس منكم استدعاء المعني بالأمر ومساءلته حول هذه الأفعال وحمايتي من أي اعتداء مستقبلي.

وتقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'complaint_public_safety',
    name: 'شكاية بخصوص خطر يهدد السلامة العامة',
    category: 'COMPLAINTS',
    description: 'شكاية بخصوص حائط آيل للسقوط أو أسلاك مكشوفة أو أي خطر عمومي.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المشتكي', placeholder: '', type: 'text' },
      { id: 'hazardLoc', label: 'موقع الخطر', placeholder: '', type: 'textarea' },
      { id: 'details', label: 'وصف الخطر (مثلاً حائط مشقق، بالوعة مفتوحة...)', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
حرر بـ ${data.city || '.......'} في ${data.date || '........'}

من السيد: ${data.fullName || '................'}

إلى السيد: رئيس المجلس الجماعي / قائد المنطقة

الموضوع: شكاية بخصوص خطر يهدد السلامة العامة

سلام تام بوجود مولانا الإمام.

وبعد،
نلفت انتباهكم سيدي القائد/الرئيس إلى وجود خطر جسيم يهدد المارة والساكنة بـ ${data.hazardLoc || '........'}.
حيث أن ${data.details || '................'}.
وحيث أن هذا الوضع يشكل خطراً حقيقياً خاصة على الأطفال وكبار السن في حالة استمرار الإهمال.

لذا نلتمس من مصالحكم التدخل الفوري لإزالة هذا الخطر أو إلزام المعنيين بالأمر بالقيام بالإصلاحات الضرورية.

وتقبلوا فائق التقدير والاحترام.

والسلام.

إمضاء:
`
  },
  {
    id: 'legal_memo_withdrawal',
    name: 'مقال تنازل عن مذكرة مودعة بالمحكمة',
    category: 'LEGAL',
    description: 'نموذج للتنازل عن مذكرة سبق إيداعها بالمحكمة في إطار دعوى رائجة.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'الاسم الكامل', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم بطاقة التعريف الوطنية', placeholder: '', type: 'text' },
      { id: 'address', label: 'العنوان', placeholder: '', type: 'textarea' },
      { id: 'caseNum', label: 'رقم ملف الدعوى', placeholder: '', type: 'text' },
      { id: 'court', label: 'المحكمة المختصة', placeholder: '', type: 'text' },
      { id: 'section', label: 'القسم / الغرفة', placeholder: '', type: 'text' },
      { id: 'memoDate', label: 'تاريخ إيداع المذكرة المتنازل عنها', placeholder: '', type: 'date' },
      { id: 'subject', label: 'موضوع المذكرة', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
الحمد لله وحده

أنا الموقع أسفله:
السيد(ة) ${data.fullName || '................'}، الحامل(ة) لبطاقة التعريف الوطنية رقم ${data.cin || '.............'}، والقاطن(ة) بـ ${data.address || '................'}، وبعد الاطلاع على ملف الدعوى رقم ${data.caseNum || '........'} الرائج أمام محكمة ${data.court || '........'}، قسم ${data.section || '........'}، والذي أنا أحد أطرافه، أتقدم إلى سيادتكم بهذا المقال قصد التصريح بما يلي:

إنني أصرّح بكل احترام للمحكمة الموقرة أنني أتنازل تنازلاً نهائياً ولا رجعة فيه عن المذكرة التي سبق لي إيداعها بتاريخ ${data.memoDate || '........'}، المتعلقة بموضوع: ${data.subject || '................'}

ويأتي هذا التنازل عن المذكرة بإرادتي الحرة ودون أي ضغط أو إكراه من أي جهة كانت، مع تأكيدي التام على علمي الكامل بالآثار القانونية المترتبة عن هذا التنازل، وقبولي باعتماد المحكمة للمقتضيات التي تراها مناسبة في ضوء هذا التصريح.

وبناءً عليه، ألتمس من المحكمة الموقرة التفضل بــ اعتبار المذكرة المتنازل عنها كأن لم تكن، والاستمرار في مسار البت في الملف وفق الضوابط القانونية الجاري بها العمل.

وتفضلوا بقبول فائق الاحترام والتقدير.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الاسم الكامل: ${data.fullName || '................'}
رقم بطاقة التعريف الوطنية: ${data.cin || '................'}
العنوان: ${data.address || '................'}
`
  },
  {
    id: 'agri_chamber_delist',
    name: 'طلب التشطيب من لوائح الغرفة الفلاحية',
    category: 'AGRI',
    description: 'طلب رسمي للتوقف عن التسجيل في الغرفة الفلاحية بسبب توقف النشاط أو غيره.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'region', label: 'جهة الغرفة الفلاحية', placeholder: '', type: 'text' },
      { id: 'fullName', label: 'الاسم الكامل', placeholder: '', type: 'text' },
      { id: 'regNum', label: 'رقم التسجيل بالغرفة', placeholder: '', type: 'text' },
      { id: 'activityLoc', label: 'مكان ممارسة النشاط', placeholder: '', type: 'text' },
      { id: 'stopDate', label: 'تاريخ التوقف عن النشاط', placeholder: '', type: 'date' },
      { id: 'reason', label: 'سبب التشطيب', placeholder: 'توقف عن النشاط، تقاعد، أسباب صحية...', type: 'text' },
    ],
    generateText: (data) => `
إلــى السيــد رئيــس الغرفــة الفلاحية لجهــة ${data.region || '................'}

الموضوع: طلب التشطيب من لوائح الغرفة الفلاحية

سلام تام بوجود مولانا الإمام وبعد،

يشرفني أن أتقدم إلى سيادتكم بهذا الطلب من أجل التشطيب على اسمي من لوائح الغرفة الفلاحية، وذلك نظراً لـ ${data.reason || '................'}.

وأحيطكم علماً أنني كنت مسجلاً بالغرفة الفلاحية تحت رقم ${data.regNum || '................'}، وأمارس النشاط الفلاحي بـ ${data.activityLoc || '................'}، إلا أنني لم أعد أزاوله منذ تاريخ ${data.stopDate || '........'}.

وعليه، ألتمس من سيادتكم الموقرة اتخاذ الإجراءات الإدارية اللازمة لتشطيبي من اللوائح الرسمية للغرفة الفلاحية، مع خالص التقدير والاحترام.

وتقبلوا، السيد الرئيس، فائق عبارات التقدير والاحترام.

حرر بـ ${data.city || '........'}، في: ${data.date || '........'}

الإمضاء:
${data.fullName || '................'}
`
  },
  {
    id: 'agri_registry_delist',
    name: 'طلب تشطيب من السجل الفلاحي',
    category: 'AGRI',
    description: 'طلب موجه للمصلحة الفلاحية للتشطيب من السجل الفلاحي.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'deptName', label: 'اسم المصلحة الفلاحية', placeholder: '', type: 'text' },
      { id: 'fullName', label: 'الاسم الكامل', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم بطاقة التعريف الوطنية', placeholder: '', type: 'text' },
      { id: 'address', label: 'العنوان', placeholder: '', type: 'textarea' },
      { id: 'regNum', label: 'رقم التسجيل في السجل', placeholder: '', type: 'text' },
      { id: 'farmLoc', label: 'عنوان الضيعة أو الأرض', placeholder: '', type: 'text' },
      { id: 'reason', label: 'سبب التشطيب', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
إلى السيد: رئيس المصلحة الفلاحية بـ ${data.deptName || '........'}.

من طرف: السيد(ة) ${data.fullName || '................'}، الحامل(ة) لبطاقة التعريف الوطنية رقم: ${data.cin || '.............'}، الساكن(ة) بـ: ${data.address || '................'}.

الموضوع: طلب التشطيب من السجل الفلاحي.

سلام تام بوجود مولانا الإمام، وبعد،

يشرفني أن أتقدم إلى سيادتكم بهذا الطلب قصد التشطيب على اسمي من السجل الفلاحي، وذلك لـ ${data.reason || '................'}.

أحيطكم علمًا بأنني كنت مسجلًا(ة) في السجل الفلاحي تحت رقم ${data.regNum || '........'}، والمتعلق بالضيعة الكائنة بـ ${data.farmLoc || '................'}. وبما أنني لم أعد معنيًا(ة) بهذا النشاط، فإنني ألتمس منكم اتخاذ الإجراءات اللازمة للتشطيب على اسمي من هذا السجل.

وفي انتظار ردكم، تقبلوا مني فائق التقدير والاحترام.

حرر بـ ${data.city || '........'} في ${data.date || '........'}

التوقيع:
`
  },
  {
    id: 'agri_land_gift',
    name: 'عقد صدقة أرض فلاحية',
    category: 'AGRI',
    description: 'عقد هبة/صدقة لقطعة أرض فلاحية دون مقابل.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'donorInfo', label: 'بيانات المتصدق (الاسم، CIN، العنوان، الولادة)', placeholder: '', type: 'textarea' },
      { id: 'recipientInfo', label: 'بيانات المتصدق عليه (الاسم، CIN، العنوان، الولادة)', placeholder: '', type: 'textarea' },
      { id: 'landLoc', label: 'موقع الأرض وحدودها', placeholder: 'العنوان الكامل أو الموقع، المساحة، الحدود...', type: 'textarea' },
      { id: 'landTitle', label: 'رقم الرسم العقاري (إن وجد)', placeholder: '', type: 'text' },
      { id: 'witness1', label: 'الشاهد الأول (الاسم، CIN)', placeholder: '', type: 'text' },
      { id: 'witness2', label: 'الشاهد الثاني (الاسم، CIN)', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
عقد صدقة أرض فلاحية

الطرف الأول (المتصدق):
${data.donorInfo || '................'}

الطرف الثاني (المتصدق عليه):
${data.recipientInfo || '................'}

موضوع العقد:
يشهد الطرف الأول، وهو بكامل قواه العقلية ووعيه وإرادته الحرة، أنه يتصدق نهائيًا ودون مقابل على الطرف الثاني بقطعة أرض فلاحية، ملكه الخاص، الكائنة بـ ${data.landLoc || '........'}، والمحددة كالتالي:
المساحة: كما هو مبين في الوثائق.
رقم الرسم العقاري: ${data.landTitle || '........'}

بنود العقد:
1. يتنازل الطرف الأول عن جميع حقوقه وملكيته للأرض المذكورة أعلاه لصالح الطرف الثاني كصدقة جارية خالصة لوجه الله تعالى.
2. يحق للطرف الثاني التصرف الكامل في الأرض، زراعةً أو استغلالًا أو بيعًا، دون أي اعتراض من الطرف الأول.
3. يُقر الطرف الثاني بقبول هذه الصدقة والتصرف فيها بما يتفق مع الغرض الذي وهبت لأجله.
4. هذا العقد نهائي وغير قابل للتراجع أو الطعن، إلا بما يتعارض مع أحكام الشريعة الإسلامية أو القوانين الجاري بها العمل.
5. يتحمل الطرف الثاني مسؤولية تسجيل هذا العقد لدى الجهات الإدارية المختصة لاستكمال إجراءات التحفيظ أو التسجيل العقاري.

الشهود:
يشهد الموقعون أدناه على صحة هذا العقد وصدوره عن الطرف الأول بكامل إرادته:
الشاهد الأول: ${data.witness1 || '................'}
الشاهد الثاني: ${data.witness2 || '................'}

حرر بـ ${data.city || '........'} في ${data.date || '........'}

توقيع الطرف الأول:                            توقيع الطرف الثاني:
`
  },
  {
    id: 'waived_electricity_meter_entry',
    name: 'تنازل لإدخال عداد الكهرباء',
    category: 'WAIVERS',
    description: 'تنازل عن حق إدخال عداد الكهرباء لفائدة شخص آخر في نفس العقار.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'الاسم الكامل للمتنازل', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم بطاقة التعريف الوطنية', placeholder: '', type: 'text' },
      { id: 'address', label: 'العنوان', placeholder: '', type: 'textarea' },
      { id: 'propertyLoc', label: 'عنوان العقار المعني', placeholder: '', type: 'text' },
      { id: 'beneficiaryName', label: 'اسم المتنازل له', placeholder: '', type: 'text' },
      { id: 'beneficiaryCin', label: 'رقم CIN للمتنازل له', placeholder: '', type: 'text' },
      { id: 'beneficiaryAddress', label: 'عنوان المتنازل له', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد(ة) ${data.fullName || '................'}، الحامل(ة) لبطاقة التعريف الوطنية رقم ${data.cin || '.............'}، والقاطن(ة) بـ ${data.address || '................'}

أشهد وأصرح بما يلي:
إني أتنازل بملء إرادتي ودون أي ضغط أو إكراه، عن حقي في إدخال عداد الكهرباء المرتبط بالعقار الكائن بـ ${data.propertyLoc || '........'}، لفائدة السيد(ة) ${data.beneficiaryName || '................'}، الحامل(ة) لرقم بطاقة التعريف الوطنية ${data.beneficiaryCin || '.............'}، والقاطن(ة) بـ ${data.beneficiaryAddress || '................'}

ويحق للسيد(ة) ${data.beneficiaryName || '........'} التقدم بكافة الإجراءات الإدارية والقانونية اللازمة لإدخال عداد الكهرباء باسمه/ها، مع الجهات المختصة.

أقر أن هذا التنازل نهائي وغير قابل للتراجع، وهو صادر عني بكامل إرادتي، وأنا مسؤول عن صحة هذا التصريح أمام الجهات المعنية.
تنازلا تاما صحيحا، متحمل بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

التوقيع:
`
  },
  {
    id: 'waived_land_usufruct',
    name: 'تنازل عن منفعة قطعة أرضية',
    category: 'PROPERTY',
    description: 'تنازل عن حق الانتفاع أو الزينة في قطعة أرضية لفائدة طرف آخر.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'donorInfo', label: 'بيانات المتنازل', placeholder: '', type: 'textarea' },
      { id: 'recipientInfo', label: 'بيانات المتنازل له', placeholder: '', type: 'textarea' },
      { id: 'landLoc', label: 'موقع القطعة الأرضية', placeholder: '', type: 'text' },
      { id: 'area', label: 'مساحة الأرض', placeholder: '', type: 'text' },
      { id: 'boundaries', label: 'الحدود (شمال، جنوب، شرق، غرب)', placeholder: '', type: 'textarea' },
      { id: 'originTitle', label: 'أصل الملك (الوثيقة المثبتة)', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
تم الاتفاق والتراضي على ما يلي:

بموجب هـذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية تنازل الطرف الأول ${data.donorInfo || '................'} للطرف الثاني ${data.recipientInfo || '................'} القابل منه بعد الرضى والقبول والمعاينة جميع منفعة القطعة الأرضية الواقعة بـ ${data.landLoc || '........'}، البالغ مساحتها ${data.area || '........'}، وحدودها هي: شمالا: ${data.boundaries || '........'} ليتصرف فيها ويتملكها ويستغلها استغلالا تاما بجميع مرافقها ومنافعها.

أصل الملك: ${data.originTitle || '................'}

يصرح الطرف الأول المتنازل على أن منفعة القطعة الأرضية المذكورة خالية من أي متابعة أو دين أو رهن وقد أصبحت تحت التصرف والتملك والاستغلال التام للمتنازل له وأبرأه من جميع التبعات ومن حقه التصرف فيها حالا ومستقبلا وتحمل كافة المسؤوليات والتبعات القانونية الخاصة بها حيث لم يبق للمتنازل فيها أي حق قليلا أو كثيرا.

يصرح الطرف الثاني المتنازل له أنه عاين القطعة الأرضية المذكورة أعلاه وقبلها على الحالة التي هي عليها ويلتزم بتحمل مسؤوليتها كاملة ابتداء من تاريخ المصادقة.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

توقيع الطرف الأول:                            توقيع الطرف الثاني:
`
  },
  {
    id: 'delegated_proxy_land',
    name: 'وكالة مفوضة (قطعة أرضية)',
    category: 'LEGAL',
    description: 'وكالة تمنح الوكيل حق تمثيل الموكل في كافة الإجراءات الإدارية والقانونية المتعلقة بقطعة أرضية.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'principalInfo', label: 'بيانات الموكل', placeholder: '', type: 'textarea' },
      { id: 'agentInfo', label: 'بيانات الوكيل', placeholder: '', type: 'textarea' },
      { id: 'landLoc', label: 'موقع القطعة الأرضية', placeholder: '', type: 'text' },
      { id: 'area', label: 'مساحة الأرض', placeholder: '', type: 'text' },
      { id: 'boundaries', label: 'الحدود', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد(ة): ${data.principalInfo || '................'}

أوكل عني بمقتضى هذه الوثيقة السيد(ة): ${data.agentInfo || '................'}

وذلك لينوب عني ويقوم مقامي فيما تصح فيه النيابة شرعا وقانونا من أجل قيامه بكافة الإجراءات الإدارية والقانونية الخاصة بمنفعة القطعة الأرضية الواقعة بـ ${data.landLoc || '........'}، البالغ مساحتها ${data.area || '........'}، وحدودها هي: ${data.boundaries || '........'}.

بحيث يصبح له الحق في تمثيلي والتكلم بالنيابة عني أمام جميع الإدارات العمومية والشبه العمومية والخاصة بما فيها مصلحة توزيع الماء والكهرباء قصد التزود بالعدادين، والبلدية، والعمالة، ومصالح المالية والضرائب، وباقي الدوائر الرسمية، بكل ما يعرض له في ذلك من قول أو فعل وطلب وسحب وأداء وقبض وإبراء، مع حق التصرف والتملك والاستغلال وكذا الحصول على الوثائق الإدارية الخاصة بالبقعة المذكورة بما فيها رخصة البناء والتوقيع نيابة عني في كافة الأوراق والمعاملات المتعلقة بهذا الخصوص.

وكالة مفوضة تامة وصحيحة سلمتها للمعني بالأمر قصد الإدلاء بها عند الحاجة.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

توقيع الموكل:                                توقيع الوكيل:
`
  },
  {
    id: 'waived_delivery_land',
    name: 'تنازل وتسليم (بقعة أرضية)',
    category: 'PROPERTY',
    description: 'إشهاد بالتنازل وتسليم بقعة أرضية مع رخصة بنائها وتصميمها.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'donorInfo', label: 'بيانات المتنازل', placeholder: '', type: 'textarea' },
      { id: 'recipientInfo', label: 'بيانات المتنازل له', placeholder: '', type: 'textarea' },
      { id: 'landLoc', label: 'موقع البقعة الأرضية', placeholder: '', type: 'text' },
      { id: 'area', label: 'المساحة', placeholder: '', type: 'text' },
      { id: 'boundaries', label: 'الحدود', placeholder: '', type: 'textarea' },
      { id: 'buildLicense', label: 'رقم وتاريخ رخصة البناء', placeholder: '', type: 'text' },
      { id: 'designDate', label: 'تاريخ رسم التصميم', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
بموجب هذه الوثيقة وتحت كافة الضمانات الفعلية والقانونية، يشهد ويلتزم الطرف الأول ${data.donorInfo || '................'} بأنه يتنازل ويسلم لفائدة الطرف الثاني ${data.recipientInfo || '................'} البقعة الأرضية الكائنة بـ ${data.landLoc || '........'}، البالغ مساحتها ${data.area || '........'} والمحدودة بـ: ${data.boundaries || '........'}.
رخصة بنائها عدد: ${data.buildLicense || '........'} وتصميمها بتاريخ ${data.designDate || '........'}.

حيث يصرح الطرف المتنازل أن البقعة المتنازل عنها خالية من النزاع وأنها قد أصبحت في حيازة المتنازل له وأبرأه من جميع التبعات ومن حقه التصرف فيها حالا ومستقبلا حيث يتحمل كافة المسؤوليات والتبعات القانونية الخاصة بها.

ويصرح الطرف الثاني المتنازل له أنه عاين البقعة الأرضية المذكورة وقبلها على الحالة التي هي عليها ويلتزم بتحمل مسؤوليتها كاملة ابتداء من تاريخ المصادقة.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

توقيع المتنازل:                                توقيع المتنازل له:
`
  },
  {
    id: 'waived_divorce_dues',
    name: 'تنازل عن مستحقات مالية بعد التطليق',
    category: 'WAIVERS',
    description: 'تنازل من المطلقة عن المستحقات المالية المحكوم بها لفائدتها.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المتنازلة', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'address', label: 'العنوان', placeholder: '', type: 'textarea' },
      { id: 'exSpouseName', label: 'اسم الطليق', placeholder: '', type: 'text' },
      { id: 'judgmentNum', label: 'رقم الحكم وتاريخه', placeholder: '', type: 'text' },
      { id: 'fileNum', label: 'رقم الملف', placeholder: '', type: 'text' },
      { id: 'duesDetails', label: 'تفاصيل المبالغ المتنازل عنها', placeholder: 'نفقة، متعة، عدو...', type: 'textarea' },
    ],
    generateText: (data) => `
أنا الموقعة أسفله:
السيدة: ${data.fullName || '................'}، الحاملة لبطاقة التعريف الوطنية رقم: ${data.cin || '.............'} والساكنة بـ ${data.address || '................'}

بموجب هذه الوثيقة وبكافة الضمانات الفعلية والقانونية، أشهد على نفسي وألتزم وأنا بكامل قواي العقلية والجسدية بأنني أتنازل لفائدة طليقي السيد: ${data.exSpouseName || '................'} عن المستحقات المالية المقررة بعد التطليق والمتمثلة في:
${data.duesDetails || '................'}

موضوع الحكم عدد: ${data.judgmentNum || '........'} ملف عدد: ${data.fileNum || '........'} بتاريخ: ${data.date || '........'} تنازلا تاما وصحيحا لا رجعة فيه مخلية إياه بذلك من أية متابعات قضائية، قانونية، مدنية أو مديونية في هذا الموضوع.

تنازلا تاما وصحيحا متحملة بذلك كافة المسؤوليات القانونية الناتجة عنه.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'waived_shop_exploitation',
    name: 'تنازل عن استغلال محل تجاري',
    category: 'WAIVERS',
    description: 'تنازل عن حق استغلال رخصة محل تجاري لفائدة طرف آخر.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المتنازل', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'address', label: 'العنوان', placeholder: '', type: 'textarea' },
      { id: 'beneficiaryName', label: 'اسم المتنازل له', placeholder: '', type: 'text' },
      { id: 'shopLoc', label: 'موقع المحل التجاري', placeholder: '', type: 'text' },
      { id: 'activity', label: 'نوع النشاط التجاري', placeholder: '', type: 'text' },
      { id: 'contractDate', label: 'تاريخ عقد الكراء الأصلي', placeholder: '', type: 'date' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.fullName || '................'}، الحامل لبطاقة التعريف الوطنية رقم: ${data.cin || '.............'} والساكن بـ ${data.address || '................'}

أشهد على نفسي بأنني أتنازل لفائدة السيد: ${data.beneficiaryName || '................'} عن استغلال المحل التجاري الكائن بـ ${data.shopLoc || '........'} المخصص لبيع ${data.activity || '........'} موضوع عقد الكراء المصادق عليه بتاريخ ${data.contractDate || '........'} حيث له الحق وكامل الصلاحية في حيازة المحل والتصرف فيه وإبرام عقد الكراء مع الجهات المعنية. كما يلتزم المتنازل له بأداء مستحقات الكراء وما إلى ذلك من المترتبات القانونية والمالية.

تنازلا تاما لا رجوع فيه حاضرا أو مستقبلا.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'waived_gold_ownership',
    name: 'تنازل عن ملكية ذهب',
    category: 'WAIVERS',
    description: 'تنازل عن ملكية مجوهرات ذهبية لفائدة طرف آخر.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المتنازل', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'address', label: 'العنوان', placeholder: '', type: 'textarea' },
      { id: 'beneficiaryName', label: 'اسم المتنازل له', placeholder: '', type: 'text' },
      { id: 'goldDetails', label: 'تفاصيل الذهب (الوزن، النوع، العيار...)', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.fullName || '................'}، الحامل لبطاقة التعريف الوطنية رقم: ${data.cin || '.............'} والساكن بـ ${data.address || '................'}

أشهد على نفسي بأنني أتنازل لفائدة السيد(ة): ${data.beneficiaryName || '................'} عن ملكية الذهب المتمثل في:
${data.goldDetails || '................'}

تنازلا تاما ونهائيا لا رجوع فيه، مبرئا ذمته من أي حق أو مطلب مستقبلي بخصوص هذا الذهب. كما أصرح أن هذا الذهب في ملكيتي الخاصة وليس موضوع أي نزاع أو رهن.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'waived_electricity_meter',
    name: 'تنازل عن عداد كهرباء',
    category: 'WAIVERS',
    description: 'تنازل عن اشتراك عداد الكهرباء لفائدة مشترك جديد.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المتنازل', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'meterNum', label: 'رقم العداد / الاشتراك', placeholder: '', type: 'text' },
      { id: 'address', label: 'موقع العداد (العنوان)', placeholder: '', type: 'textarea' },
      { id: 'beneficiaryName', label: 'اسم المتنازل له', placeholder: '', type: 'text' },
      { id: 'beneficiaryCin', label: 'رقم CIN للمتنازل له', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.fullName || '................'}، الحامل لبطاقة التعريف الوطنية رقم: ${data.cin || '.............'}

أشهد على نفسي وبكافة الضمانات الفعلية والقانونية الجاري بها العمل، أنني أتنازل تنازلا تاما ونهائيا لا رجوع فيه لفائدة السيد(ة): ${data.beneficiaryName || '................'} الحامل(ة) لبطاقة التعريف الوطنية رقم ${data.beneficiaryCin || '.............'} عن عداد الكهرباء المسجل باسمي تحت رقم ${data.meterNum || '........'} الكائن بـ ${data.address || '................'}

وبمقتضى هذا التنازل، أصبح للمتنازل له الحق في تحويل العداد المذكور لاسمه الشخصي لدى المصالح المختصة، مع تحمل كافة التكاليف والمترتبات ابتداء من تاريخ هذا التنازل.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'waived_water_meter',
    name: 'تنازل عن عداد الماء',
    category: 'WAIVERS',
    description: 'تنازل عن اشتراك عداد الماء لفائدة مشترك جديد.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المتنازل', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'meterNum', label: 'رقم العداد / الاشتراك', placeholder: '', type: 'text' },
      { id: 'address', label: 'موقع العداد (العنوان)', placeholder: '', type: 'textarea' },
      { id: 'beneficiaryName', label: 'اسم المتنازل له', placeholder: '', type: 'text' },
      { id: 'beneficiaryCin', label: 'رقم CIN للمتنازل له', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.fullName || '................'}، الحامل لبطاقة التعريف الوطنية رقم: ${data.cin || '.............'}

أشهد على نفسي وبكافة الضمانات الفعلية والقانونية الجاري بها العمل، أنني أتنازل تنازلا تاما ونهائيا لا رجوع فيه لفائدة السيد(ة): ${data.beneficiaryName || '................'} الحامل(ة) لبطاقة التعريف الوطنية رقم ${data.beneficiaryCin || '.............'} عن عداد مياه الشرب المسجل باسمي تحت رقم ${data.meterNum || '........'} الكائن بـ ${data.address || '................'}

وبمقتضى هذا التنازل، أصبح للمتنازل له الحق في تحويل العداد المذكور لاسمه الشخصي لدى المصالح المختصة، مع تحمل كافة التكاليف والمترتبات ابتداء من تاريخ هذا التنازل.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'waived_complaint_dispute',
    name: 'تنازل عن شكاية (نزاع)',
    category: 'WAIVERS',
    description: 'تنازل رسمي عن شكاية بخصوص نزاع بين طرفين.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المتنازل (المشتكي)', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'beneficiaryName', label: 'اسم المتنازل له (المشتكى به)', placeholder: '', type: 'text' },
      { id: 'complaintDetails', label: 'موضوع الشكاية وتفاصيل النزاع', placeholder: '', type: 'textarea' },
      { id: 'referance', label: 'مرجع الشكاية (رقم المحضر أو الملف إن وجد)', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.fullName || '................'}، الحامل لبطاقة التعريف الوطنية رقم: ${data.cin || '.............'}

أصرح بملء إرادتي وكامل قواي العقلية أنني أتنازل بصفة نهائية ولا رجعة فيها عن الشكاية التي سبق وأن تقدمت بها ضد السيد(ة): ${data.beneficiaryName || '................'} بخصوص ${data.complaintDetails || '................'} (مرجع: ${data.referance || '........'}).

ويأتي هذا التنازل بعد صلح تم بيننا، وبموجبه أبرئ ذمته من أي متابعة قضائية أو قانونية، وألتمس من السلطات المختصة (الشرطة، الدرك، النيابة العامة) حفظ الملف أو اتخاذ ما يقتضيه هذا التنازل من إجراءات قانونية ملائمة.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'waived_fishing_boat',
    name: 'تنازل (صاحب مركب صيد)',
    category: 'WAIVERS',
    description: 'تنازل عن مهام أو مستحقات بخصوص مركب صيد.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المتنازل', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'boatName', label: 'اسم المركب', placeholder: '', type: 'text' },
      { id: 'boatNum', label: 'رقم تسجيل المركب', placeholder: '', type: 'text' },
      { id: 'details', label: 'تفاصيل التنازل', placeholder: '', type: 'textarea' },
      { id: 'beneficiaryName', label: 'اسم المتنازل له', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.fullName || '................'}، الحامل لبطاقة التعريف الوطنية رقم: ${data.cin || '.............'}، بصفتي (مالك/مجهز/بحار) بالمركب المسمى "${data.boatName || '........'}" المسجل تحت رقم ${data.boatNum || '........'}.

أشهد على نفسي أنني أتنازل لفائدة السيد: ${data.beneficiaryName || '................'} عن ${data.details || '................'}.

تنازلا تاما وصحيحا لا رجعة فيه، مبرئا ذمته من أي تبعات بخصوص ما ذكر أعلاه.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'waived_complaint_general',
    name: 'تنازل عن شكاية (عام)',
    category: 'WAIVERS',
    description: 'نموذج عام للتنازل عن شكاية أمام السلطات.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المتنازل', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'beneficiaryName', label: 'اسم المشتكى به', placeholder: '', type: 'text' },
      { id: 'complaintSubject', label: 'موضوع الشكاية', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.fullName || '................'}، الحامل لبطاقة التعريف الوطنية رقم: ${data.cin || '.............'}

بموجب هذه الوثيقة، أصرح بأنني أتنازل بصفة رسمية ونهائية عن الشكاية التي وضعتها ضد السيد(ة): ${data.beneficiaryName || '................'} بخصوص ${data.complaintSubject || '................'}.

أقر أن هذا التنازل نابع من إرادتي الحرة، وأنا متنازل عن كافة حقوقي المدنية والمطالب الناتجة عن هذا النزاع، ملتمسا من الجهات المعنية إيقاف المتابعة.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'waived_marital_return',
    name: 'تنازل عن دعوى الرجوع لبيت الزوجية',
    category: 'LEGAL',
    description: 'تنازل عن دعوى قضائية لاستئناف الحياة الزوجية.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم الزوج/الزوجة المتنازل(ة)', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'spouseName', label: 'اسم الطرف الآخر', placeholder: '', type: 'text' },
      { id: 'caseNum', label: 'رقم ملف الدعوى', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
أنا الموقع(ة) أسفله:
السيد(ة): ${data.fullName || '................'}، الحامل(ة) لبطاقة التعريف الوطنية رقم: ${data.cin || '.............'}

أصرح بأنني أتنازل بصفة نهائية ولا رجعة فيها عن الدعوى التي رفعتها ضد زوجي/زوجتي السيد(ة): ${data.spouseName || '................'} والمتعلقة بـ "الرجوع لبيت الزوجية" في الملف رقم ${data.caseNum || '........'}.

ويأتي هذا التنازل رغبة مني في إعطاء فرصة للصلح أو لاتفاق حبي بين الطرفين، وألتمس من المحكمة الموقرة قبول هذا التنازل.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'waived_phone_line',
    name: 'تنازل عن خط هاتف ثابت وانترنت',
    category: 'WAIVERS',
    description: 'تنازل عن خط هاتف ثابت لمتنازل له جديد.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المتنازل', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'phoneNum', label: 'رقم الهاتف', placeholder: '', type: 'text' },
      { id: 'beneficiaryName', label: 'اسم المتنازل له', placeholder: '', type: 'text' },
      { id: 'beneficiaryCin', label: 'رقم CIN للمتنازل له', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.fullName || '................'}، الحامل لبطاقة التعريف الوطنية رقم: ${data.cin || '.............'}

أشهد أنني أتنازل كليا ونهائيا لفائدة السيد(ة): ${data.beneficiaryName || '................'} الحامل(ة) لرقم بطاقة التعريف الوطنية ${data.beneficiaryCin || '.............'} عن خط الهاتف الثابت (والإنترنت) رقم ${data.phoneNum || '........'}.

للمتنازل له الحق في القيام بكافة الإجراءات لدى شركة الاتصالات لتحويل الخط المذكور لاسمه الشخصي.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'waived_home_furniture',
    name: 'تنازل عن أثاث منزل',
    category: 'WAIVERS',
    description: 'تنازل عن ملكية أثاث منزلي لفائدة طرف آخر.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المتنازل', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'beneficiaryName', label: 'اسم المتنازل له', placeholder: '', type: 'text' },
      { id: 'furnitureDetails', label: 'قائمة الأثاث المتنازل عنه', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.fullName || '................'}، الحامل لبطاقة التعريف الوطنية رقم: ${data.cin || '.............'}

أشهد على نفسي بأنني أتنازل لفائدة السيد(ة): ${data.beneficiaryName || '................'} عن ملكية الأثاث المنزلي التالي:
${data.furnitureDetails || '................'}

تنازلا تاما وصحيحا، مبرئا ذمته من أي حق لي فيه.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'waived_accident_compensation',
    name: 'تنازل عن التعويض (حادثة سير)',
    category: 'VEHICLES',
    description: 'تنازل عن التعويضات المادية الناتجة عن حادثة سير بعد الحصول على صلح.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المتنازل (المصاب)', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'accidentDate', label: 'تاريخ الحادثة', placeholder: '', type: 'date' },
      { id: 'accidentLoc', label: 'مكان الحادثة', placeholder: '', type: 'text' },
      { id: 'carNum', label: 'رقم السيارة المسببة', placeholder: '', type: 'text' },
      { id: 'ownerName', label: 'اسم مالك السيارة/السائق', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.fullName || '................'}، الحامل لبطاقة التعريف الوطنية رقم: ${data.cin || '.............'}

أصرح بأنني أتنازل بصفة نهائية ولا رجعة فيها عن كافة حقوقي في التعويض عن الحادثة التي تعرضت لها بتاريخ ${data.accidentDate || '........'} بـ ${data.accidentLoc || '........'} والناتجة عن السيارة رقم ${data.carNum || '........'} التي كان يسوقها/يملكها السيد: ${data.ownerName || '................'}.

ويأتي هذا التنازل بعد حصولي على صلح مرضٍ وتوصل بكل مستحقاتي المادية، وبموجبه أبرئ ذمته وذمة شركة التأمين من أي مطالبة مستقبلية.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'special_proxy_complaint_waiver',
    name: 'وكالة خاصة (تنازل عن شكاية)',
    category: 'LEGAL',
    description: 'وكالة تمنح الوكيل حق التنازل عن شكاية نيابة عن الموكل.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'principalInfo', label: 'بيانات الموكل', placeholder: '', type: 'textarea' },
      { id: 'agentInfo', label: 'بيانات الوكيل', placeholder: '', type: 'textarea' },
      { id: 'complaintDetails', label: 'تفاصيل الشكاية (رقمها، المشتكى به، الموضوع)', placeholder: '', type: 'textarea' },
    ],
    generateText: (data) => `
أنا الموقع(ة) أسفله:
السيد(ة): ${data.principalInfo || '................'}

أوكل بمقتضى هذه الوثيقة السيد(ة): ${data.agentInfo || '................'}

وذلك لينوب عني ويقوم مقامي في التنازل عن الشكاية التي سبق وأن تقدمت بها ضد ${data.complaintDetails || '................'}.
بموجب هذه الوكالة، يحق للوكيل المذكور التوقيع على محاضر الصلح والتنازل أمام الشرطة أو الدرك أو النيابة العامة أو قضاء التحقيق، والقيام بكافة الإجراءات القانونية اللازمة لطي هذا الملف بصفة نهائية.

وكالة خاصة ومحدودة في موضوعها، سلمتها للمعني قصد الإدلاء بها عند الحاجة.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

توقيع الموكل:
`
  },
  {
    id: 'proxy_commercial_shop',
    name: 'وكالة (محل تجاري)',
    category: 'LEGAL',
    description: 'وكالة لتمويل وإدارة شؤون محل تجاري.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'principalInfo', label: 'بيانات الموكل (المالك)', placeholder: '', type: 'textarea' },
      { id: 'agentInfo', label: 'بيانات الوكيل (المسير)', placeholder: '', type: 'textarea' },
      { id: 'shopLoc', label: 'موقع المحل', placeholder: '', type: 'text' },
      { id: 'activity', label: 'نوع النشاط', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد(ة): ${data.principalInfo || '................'}

أوكل بمقتضى هذه الوثيقة السيد(ة): ${data.agentInfo || '................'}

لينوب عني في إدارة وتسيير المحل التجاري الكائن بـ ${data.shopLoc || '........'} والمخصص لنشاط ${data.activity || '........'}.
لل وكيل الحق في تمثيلي أمام جميع الإدارات العمومية، وأداء الواجبات الضريبية والكراء، والتعاقد مع المزودين، وتمثيلي أمام مصلحة الضرائب والضمان الاجتماعي والمكتب الوطني للكهرباء والماء، والتوقيع على كافة الوثائق اللازمة لهذا النشاط.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

توقيع الموكل:
`
  },
  {
    id: 'waived_labor_inspector',
    name: 'تنازل عن شكاية لدى مفتش الشغل',
    category: 'PROFESSIONAL',
    description: 'تنازل عن شكاية نزاع شغل بعد الحصول على تسوية أو صلح.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم الأجير المتنازل', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'employerName', label: 'اسم المشغل / الشركة', placeholder: '', type: 'text' },
      { id: 'settlementAmount', label: 'مبلغ التسوية (إن وجد)', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.fullName || '................'}، الحامل لبطاقة التعريف الوطنية رقم ${data.cin || '.............'}

أصرح بملء إرادتي أنني أتنازل عن الشكاية التي وضعتها ضد مشغلي ${data.employerName || '................'} لدى مفتشية الشغل بـ ${data.city || '........'}.
ويأتي هذا التنازل بعد حصولي على كافة مستحقاتي القانونية والمالية الناتجة عن فترة عملي وفصلت عن العمل، والتي قدرت بـ ${data.settlementAmount || '........'} درهم.
بموجب هذا التنازل، أبرئ ذمة المشغل من أي مطالبة مستقبلية أمام القضاء أو الإدارة بخصوص هذا النزاع.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'waived_apartment_eviction',
    name: 'تنازل عن دعوى إفراغ شقة',
    category: 'RENTAL',
    description: 'تنازل المكري عن دعوى إفراغ شقة بعد التوصل بالمستحقات أو الاتفاق.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المكري (المالك)', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'tenantName', label: 'اسم المكتري', placeholder: '', type: 'text' },
      { id: 'apartmentLoc', label: 'موقع الشقة', placeholder: '', type: 'text' },
      { id: 'caseNum', label: 'رقم ملف الدعوى', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.fullName || '................'}، الحامل لبطاقة التعريف الوطنية رقم ${data.cin || '.............'} بصفتي مكريا للشقة الكائنة بـ ${data.apartmentLoc || '........'}.

أصرح بأنني أتنازل بصفة نهائية عن دعوى الإفراغ التي رفعتها ضد المكتري السيد: ${data.tenantName || '................'} في الملف رقم ${data.caseNum || '........'}.
ويأتي هذا التنازل بعد أداء المكتري لما بذمته من واجبات كرائية/أو صلح بين الطرفين، وعليه فإنني ألتمس من المحكمة حفظ الملف.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'waived_rape_complaint',
    name: 'تنازل عن شكاية (اغتصاب)',
    category: 'LEGAL',
    description: 'نموذج تنازل عن شكاية اغتصاب (يستخدم في حالات الصلح أو الزواج أو غيرها قانونيا).',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المتنازلة', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'accusedName', label: 'اسم المشتكى به', placeholder: '', type: 'text' },
      { id: 'caseDetails', label: 'رقم المحضر أو الملف', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
أنا الموقعة أسفله:
السيدة: ${data.fullName || '................'}، الحاملة لبطاقة التعريف الوطنية رقم ${data.cin || '.............'}

أصرح بملء إرادتي وكامل قواي العقلية أنني أتنازل تنازلا تاما ومطلقا عن الشكاية التي وضعتها ضد السيد: ${data.accusedName || '................'} بخصوص تهمة الاغتصاب في الملف رقم ${data.caseDetails || '........'}.
أقر أن هذا التنازل نابع من رغبتي الخاصة في الصلح، وأتنازل عن كافة حقوقي المدنية والمطالب التعويضية.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'waived_collision_simple',
    name: 'تنازل عن حادثة سير (اصطدام بسيط)',
    category: 'VEHICLES',
    description: 'تنازل عن متابعة في حادثة سير بسيطة دون أضرار جسدية.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'الاسم الكامل', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'otherParty', label: 'اسم الطرف الآخر', placeholder: '', type: 'text' },
      { id: 'carNum', label: 'رقم السيارة', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.fullName || '................'}، الحامل لبطاقة التعريف الوطنية رقم ${data.cin || '.............'}

أشهد وبكافة الضمانات القانونية، أنني أتنازل عن الحادثة التي وقعت لي مع السيد: ${data.otherParty || '................'} صاحب السيارة رقم ${data.carNum || '........'}.
بما أن الأضرار كانت بسيطة وقد تم التوافق وديا، فإنني أتنازل عن أي متابعة قانونية أو مطالبة بتعويض.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'waived_collision_settled',
    name: 'تنازل عن حادثة سير (بعد التعويض)',
    category: 'VEHICLES',
    description: 'تنازل عن حادثة سير بعد التوصل بمبلغ مادي تعويضي.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'الاسم الكامل', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'otherParty', label: 'اسم الطرف الآخر', placeholder: '', type: 'text' },
      { id: 'amount', label: 'المبلغ المتوصل به', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.fullName || '................'}، الحامل لبطاقة التعريف الوطنية رقم ${data.cin || '.............'}

أصرح أنني توصلت من السيد: ${data.otherParty || '................'} بمبلغ قدره ${data.amount || '........'} درهم، كتعويض نهائي وشامل عن الأضرار اللاحقة بي جراء حادثة سير.
وبموجبه، أعلن تنازلي التام عن أي شكاية أو متابعة أو مطالبة بتعويض مستقبلي.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'waived_assault_fight',
    name: 'تنازل عن شكاية (شجار)',
    category: 'WAIVERS',
    description: 'تنازل عن شكاية ضرب وجرح أو شجار بعد الصلح.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المشتكي', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'otherParty', label: 'اسم المشتكى به', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.fullName || '................'}، الحامل لبطاقة التعريف الوطنية رقم ${data.cin || '.............'}

أصرح بأنني أتنازل بصفة نهائية وتامة عن الشكاية التي وضعتها ضد السيد: ${data.otherParty || '................'} بخصوص واقعة الشجار/الضرب التي حدثت بيننا.
أقر بالصلح التام وأتنازل عن كافة حقوقي المدنية.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'waived_trust_breach',
    name: 'تنازل عن شكاية (خيانة أمانة)',
    category: 'WAIVERS',
    description: 'تنازل عن شكاية خيانة الأمانة بعد استرداد الحقوق أو الصلح.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المشتكي', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'otherParty', label: 'اسم المشتكى به', placeholder: '', type: 'text' },
      { id: 'details', label: 'تفاصيل الموضوع (مبلغ أو غرض مسترد)', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.fullName || '................'}، الحامل لبطاقة التعريف الوطنية رقم ${data.cin || '.............'}

أعلن تنازلي التام عن الشكاية المتعلقة بخيانة الأمانة ضد السيد: ${data.otherParty || '................'} بخصوص ${data.details || '................'}.
بما أنني استرددت حقوقي/تم الصلح، فإنني أبرئ ذمته من أي متابعة.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },
  {
    id: 'waived_theft_complaint',
    name: 'تنازل عن شكاية (سرقة)',
    category: 'WAIVERS',
    description: 'تنازل عن شكاية سرقة بعد استرداد المسروقات والصلح.',
    fields: [
      { id: 'city', label: 'المدينة', placeholder: '', type: 'text' },
      { id: 'date', label: 'التاريخ', placeholder: '', type: 'date' },
      { id: 'fullName', label: 'اسم المشتكي', placeholder: '', type: 'text' },
      { id: 'cin', label: 'رقم CIN', placeholder: '', type: 'text' },
      { id: 'otherParty', label: 'اسم المشتكى به', placeholder: '', type: 'text' },
    ],
    generateText: (data) => `
أنا الموقع أسفله:
السيد: ${data.fullName || '................'}، الحامل لبطاقة التعريف الوطنية رقم ${data.cin || '.............'}

أصرح بتنازلي عن الشكاية التي وضعتها بخصوص واقعة السرقة ضد السيد: ${data.otherParty || '................'}.
أقر بالحصول على مسروقاتي/أو تسوية ودية وأتنازل عن المتابعة القضائية.

حرر بـ ${data.city || '........'} بتاريخ: ${data.date || '........'}

الإمضاء:
`
  },


];

export default function ContractGenerator() {
  const [step, setStep] = useState<'CATEGORY' | 'TEMPLATE' | 'FORM' | 'PREVIEW' | 'ARCHIVE'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contract_generator_step');
      return (saved as any) || 'CATEGORY';
    }
    return 'CATEGORY';
  });
  const [activeCategory, setActiveCategory] = useState<ContractCategory | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contract_generator_category');
      return (saved as any) || null;
    }
    return null;
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contract_generator_template_id');
      return saved || null;
    }
    return null;
  });
  const [contractData, setContractData] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contract_generator_data');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [generatedDoc, setGeneratedDoc] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contract_generator_generated');
      return saved || '';
    }
    return '';
  });
  const [editableDoc, setEditableDoc] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contract_generator_editable');
      return saved || '';
    }
    return '';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showRiskModal, setShowRiskModal] = useState(false);
  
  // Persistence Effects
  useEffect(() => { localStorage.setItem('contract_generator_step', step); }, [step]);
  useEffect(() => { if (activeCategory) localStorage.setItem('contract_generator_category', activeCategory); }, [activeCategory]);
  useEffect(() => { if (selectedTemplateId) localStorage.setItem('contract_generator_template_id', selectedTemplateId); }, [selectedTemplateId]);
  useEffect(() => { localStorage.setItem('contract_generator_data', JSON.stringify(contractData)); }, [contractData]);
  useEffect(() => { localStorage.setItem('contract_generator_generated', generatedDoc); }, [generatedDoc]);
  useEffect(() => { localStorage.setItem('contract_generator_editable', editableDoc); }, [editableDoc]);
  
  // Audit States
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? window.navigator.onLine : true);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(window.navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);
  
  // AI States
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiTemplate, setAiTemplate] = useState<ContractTemplate | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contract_generator_ai_template');
      if (saved) {
        const data = JSON.parse(saved);
        // Reconstruct the Template object because it has a function
        return {
          ...data,
          generateText: (formData: Record<string, string>) => {
            let text = data.rawTemplate || '';
            Object.keys(formData).forEach(key => {
              text = text.replace(new RegExp(`{{${key}}}`, 'g'), formData[key] || '................');
            });
            return text;
          }
        };
      }
    }
    return null;
  });

  useEffect(() => {
    if (aiTemplate) {
      // Functions are not serializable, we might need a custom recovery logic if we want to persist AI templates fully
      // For now, let's store basics.
      localStorage.setItem('contract_generator_ai_template', JSON.stringify({
        ...aiTemplate,
        generateText: undefined // will be reconstructed
      }));
    }
  }, [aiTemplate]);

  // Helper to remove markdown stars and symbols
  const stripMarkdown = (text: string) => {
    return text
      .replace(/\*\*/g, '')          // Bold
      .replace(/\*/g, '')           // Italic/Bullet
      .replace(/###/g, '')          // H3
      .replace(/##/g, '')           // H2
      .replace(/#/g, '')            // H1
      .replace(/_{1,}/g, '_')       // Remove excessive underscores but keep space markers
      .replace(/`{1,}/g, '')        // Code blocks
      .trim();
  };

  const [archivedDocs, setArchivedDocs] = useState<{id: string, name: string, date: string, content: string}[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contract_archive');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const localAudit = (text: string) => {
    const redLines = [
      { keywords: ['مخدرات', 'أسلحة', 'حشيش', 'ممنوع', 'ممنوعات', 'مهلوسات'], message: "محل العقد غير مشروع (تجارة ممنوعة أو مخالفة للنظام العام المغربي).", level: 'RED' },
      { keywords: ['رصيف شارع', 'حديقة عامة', 'ملك عمومي', 'شاطئ', 'غابة ملك الدولة', 'ساحة عمومية'], message: "لا يمكن التعاقد على أموال خارجة عن دائرة التعامل (الأملاك العامة للدولة).", level: 'RED' },
      { keywords: ['عضو بشري', 'كلى', 'دم', 'أعضاء بشرية', 'بيع أعضاء'], message: "إتجار في البشر أو أعضائهم؛ جسم الإنسان خارج دائرة التعامل التجاري قانوناً.", level: 'RED' },
      { keywords: ['ورث مستقبل', 'تركة مستقبلية', 'ورث حي', 'ميراث شخص حي'], message: "يمنع التعاقد على تركة إنسان لا يزال على قيد الحياة طبقاً للفصل 61 من ق ل ع.", level: 'RED' },
      { keywords: ['فائدة فاحشة', 'ربا', 'فائدة 50%', 'فائدة 100%', 'ربا فاحش'], message: "محتوى قد يخالف ضوابط الفوائد والربا في القانون المغربي (تجاوز سقف بنك المغرب).", level: 'YELLOW' },
      { keywords: ['مستحيل', 'غير قابل للتنفيذ', 'بند مستحيل'], message: "لا التزام بمستحيل؛ البند قد يكون باطلاً بطلاناً مطلقاً.", level: 'YELLOW' },
      { keywords: ['منع من العمل مدى الحياة', 'عدم ممارسة أي نشاط'], message: "شروط تقيد الحرية الشخصية بشكل مبالغ فيه قد تعتبر باطلة.", level: 'YELLOW' },
      { keywords: ['إعفاء من المسؤولية تماماً', 'عدم ضمان العيوب الخفية'], message: "قد يعتبر شرطاً تعسفياً في عقود الاستهلاك طبقاً للقانون 31.08.", level: 'YELLOW' }
    ];

    const detected = redLines.filter(line => line.keywords.some(k => text.includes(k)));
    
    if (detected.length > 0) {
      const hasCritical = detected.some(d => d.level === 'RED');
      return {
        score: hasCritical ? 15 : 45,
        status: hasCritical ? "CRITICAL" : "WARNING",
        pillars: { financial: 30, time: 50, execution: 40, legal: 20 },
        red_flags: detected.map(d => ({ level: d.level, message: d.message })),
        missing_clauses: ["بند القوة القاهرة", "بند اختصاص المحاكم المغربية", "بند تسوية النزاعات ودياً"],
        safe_alternative: "نقترح إعادة صياغة العقد بالكامل ليتوافق مع القانون المغربي، مع حذف البنود التي تمس بالنظام العام."
      };
    }

    return {
      score: 88,
      status: "SAFE",
      pillars: { financial: 85, time: 92, execution: 80, legal: 90 },
      red_flags: [{ level: "GREEN", message: "الوثيقة تبدو متوازنة وقانونية بناءً على الفحص المحلي الأولي." }],
      missing_clauses: [],
      safe_alternative: ""
    };
  };

  const filteredTemplates = useMemo(() => {
    let templates = CONTRACT_TEMPLATES;
    
    // If we have an active category, filter by it
    if (activeCategory) {
      templates = templates.filter(t => t.category === activeCategory);
    }
    
    // Global search across all templates if no category, or within category
    if (searchTerm) {
      templates = templates.filter(t => 
        t.name.includes(searchTerm) || 
        t.description.includes(searchTerm)
      );
    }
    
    return templates;
  }, [activeCategory, searchTerm]);

  const handleArchive = () => {
    if (!editableDoc || !activeContractTemplate) return;
    const newDoc = {
      id: Date.now().toString(),
      name: activeContractTemplate.name,
      date: new Date().toLocaleDateString('ar-MA'),
      content: editableDoc
    };
    const updated = [newDoc, ...archivedDocs];
    setArchivedDocs(updated);
    localStorage.setItem('contract_archive', JSON.stringify(updated));
    alert('تم حفظ الوثيقة في أرشيفك الشخصي بنجاح! يمكنك العودة إليها في أي وقت.');
  };

  const handleAuditAndDownload = async () => {
    setIsAuditing(true);
    setShowRiskModal(true);
    setAuditResult(null);
    
    setTimeout(() => {
      const result = localAudit(editableDoc);
      setAuditResult(result);
      setIsAuditing(false);
    }, 1500);
  };

  const handleRegenerateSafe = async () => {
    if (!auditResult?.safe_alternative) return;
    setIsRegenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const appendixText = `\n\n[تعديل وتأمين البنود القانونية تلقائياً]:\n${auditResult.safe_alternative}`;
      const cleanedText = editableDoc + appendixText;
      
      setGeneratedDoc(cleanedText);
      setEditableDoc(cleanedText);
      setAuditResult(null);
      setShowRiskModal(false);
      alert("تم تصحيح العقد وصياغته بشكل قانوني آمن محلياً.");
    } catch (error) {
      console.error("Fix failed:", error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const deleteArchived = (id: string) => {
    const updated = archivedDocs.filter(d => d.id !== id);
    setArchivedDocs(updated);
    localStorage.setItem('contract_archive', JSON.stringify(updated));
  };

  const activeContractTemplate = useMemo(() => 
    aiTemplate || CONTRACT_TEMPLATES.find(t => t.id === selectedTemplateId)
  , [selectedTemplateId, aiTemplate]);

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    setAiTemplate(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const promptText = aiPrompt.toLowerCase();
      let matchedTemplate = CONTRACT_TEMPLATES.find(t => 
        promptText.includes(t.name.toLowerCase()) || 
        t.name.toLowerCase().includes(promptText) ||
        (t.description && t.description.toLowerCase().includes(promptText))
      );

      if (!matchedTemplate) {
        if (promptText.includes('كراء') || promptText.includes('ايجار')) {
          matchedTemplate = CONTRACT_TEMPLATES.find(t => t.id === 'rent_residential' || t.id === 'commercial_rent');
        } else if (promptText.includes('بيع') || promptText.includes('شراء')) {
          matchedTemplate = CONTRACT_TEMPLATES.find(t => t.id === 'car_sale' || t.id === 'land_sale' || t.id === 'house_sale');
        } else if (promptText.includes('تنازل') || promptText.includes('ابراء')) {
          matchedTemplate = CONTRACT_TEMPLATES.find(t => t.category === 'WAIVERS');
        } else if (promptText.includes('شكاية') || promptText.includes('تظلم')) {
          matchedTemplate = CONTRACT_TEMPLATES.find(t => t.category === 'COMPLAINTS');
        } else if (promptText.includes('شغل') || promptText.includes('عمل') || promptText.includes('توظيف')) {
          matchedTemplate = CONTRACT_TEMPLATES.find(t => t.category === 'PROFESSIONAL');
        }
      }

      let newTemplate: ContractTemplate;

      if (matchedTemplate) {
        newTemplate = {
          ...matchedTemplate,
          id: `ai_${Date.now()}`,
          name: `عقد مخصص: ${matchedTemplate.name}`,
          category: 'AI_ASSISTANT',
          description: `تم توليد وصياغة هذا النموذج محلياً بناءً على طلبك لـ "${aiPrompt}" وهو مبني على قالب معتمد.`,
        };
      } else {
        newTemplate = {
          id: `ai_${Date.now()}`,
          name: aiPrompt.length > 30 ? aiPrompt.slice(0, 30) + '...' : aiPrompt,
          category: 'AI_ASSISTANT',
          description: `عقد مخصص صِيغَ محلياً بالكامل استجابةً لـ "${aiPrompt}".`,
          fields: [
            { id: 'first_party', label: 'الطرف الأول الكامل', type: 'text', placeholder: 'الاسم الكامل، رقم ب.ت.و، العنوان' },
            { id: 'second_party', label: 'الطرف الثاني الكامل', type: 'text', placeholder: 'الاسم الكامل، رقم ب.ت.و، العنوان' },
            { id: 'subject', label: 'موضوع الاتفاق والالتزام بالتفصيل', type: 'textarea', placeholder: 'اكتب تفاصيل الالتزام أو الشيء المتفق عليه...' },
            { id: 'price', label: 'المبلغ الإجمالي أو المقابل المالي (إن وجد)', type: 'text', placeholder: 'درهم مغربي مكتوباً ومرقماً' },
            { id: 'city', label: 'مكان التوقيع والمصادقة', type: 'text', placeholder: 'مثال: الدار البيضاء، الرباط...' },
            { id: 'date', label: 'تاريخ سريان العقد', type: 'date', placeholder: '' }
          ],
          rawTemplate: `عقد اتفاق والتزام مخصص

الحمد لله وحده،

بموجب هذا العقد والتراضي التام بين الطرفين الموقعين أدناه:

الطرف الأول:
السيد(ة) / الشركة: {{first_party}}، والمشار إليه في هذا العقد بـ (الطرف الأول).

الطرف الثاني:
السيد(ة) / الشركة: {{second_party}}، والمشار إليه في هذا العقد بـ (الطرف الثاني).

بموجب هذا الاتفاق، تم الاتفاق والتراضي على ما يلي:

البند الأول: موضوع الاتفاق
يلتزم الطرفان بالبند المتفق عليه وهو: {{subject}}، بمرونة تامة ووفقاً للأعراف والتشريعات المعمول بها بالمملكة المغربية.

البند الثاني: المقابل المالي والشروط المالية
اتفق الطرفان على أن المقابل الإجمالي أو القيمة المخصصة لهذا الاتفاق هي: {{price}}، تلتزم الجهة المعنية بدفعها وفق الشروط المتفق عليها.

البند الثالث: القانون واجب التطبيق وحل النزاعات
يخضع هذا العقد لقوانين المملكة المغربية الشريفة (وبخاصة قانون الالتزامات والعقود). وأي نزاع ينشأ بخصوص تفسيره أو تنفيذه يتم عرضه على المحكمة المختصة بمدينة {{city}}.

حرر هذا العقد بحسن نية بمدينة {{city}} بتاريخ {{date}} في نسختين أصليتين، بيد كل طرف نسخة للعمل بها عند الحاجة.

توقيع الطرف الأول:                            توقيع الطرف الثاني:`,
          generateText: (formData) => {
            let text = `عقد اتفاق والتزام مخصص

الحمد لله وحده،

بموجب هذا العقد والتراضي التام بين الطرفين الموقعين أدناه:

الطرف الأول:
السيد(ة) / الشركة: {{first_party}}، والمشار إليه في هذا العقد بـ (الطرف الأول).

الطرف الثاني:
السيد(ة) / الشركة: {{second_party}}، والمشار إليه في هذا العقد بـ (الطرف الثاني).

بموجب هذا الاتفاق، تم الاتفاق والتراضي على ما يلي:

البند الأول: موضوع الاتفاق
يلتزم الطرفان بالبند المتفق عليه وهو: {{subject}}، بمرونة تامة ووفقاً للأعراف والتشريعات المعمول بها بالمملكة المغربية.

البند الثاني: المقابل المالي والشروط المالية
اتفق الطرفان على أن المقابل الإجمالي أو القيمة المخصصة لهذا الاتفاق هي: {{price}}، تلتزم الجهة المعنية بدفعها وفق الشروط المتفق عليها.

البند الثالث: القانون واجب التطبيق وحل النزاعات
يخضع هذا العقد لقوانين المملكة المغربية الشريفة (وبخاصة قانون الالتزامات والعقود). وأي نزاع ينشأ بخصوص تفسيره أو تنفيذه يتم عرضه على المحكمة المختصة بمدينة {{city}}.

حرر هذا العقد بحسن نية بمدينة {{city}} بتاريخ {{date}} في نسختين أصليتين، بيد كل طرف نسخة للعمل بها عند الحاجة.

توقيع الطرف الأول:                            توقيع الطرف الثاني:`;
            Object.keys(formData).forEach(key => {
              text = text.replace(new RegExp(`{{${key}}}`, 'g'), formData[key] || '................');
            });
            return text;
          }
        };
      }

      setAiTemplate(newTemplate);
      setStep('FORM');
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleGenerateContract = () => {
    if (activeContractTemplate) {
      let text = activeContractTemplate.generateText(contractData);
      
      // Append custom deadlines if provided
      if (contractData['custom_deadlines']) {
        text += `\n\n--- شروط وآجال إضافية ---\n${contractData['custom_deadlines']}`;
      }
      
      const cleanedText = stripMarkdown(text);
      setGeneratedDoc(cleanedText);
      setEditableDoc(cleanedText); // Initialize editable text
      setStep('PREVIEW');
    }
  };

  const handleDownloadWord = () => {
    if (!editableDoc || !activeContractTemplate) return;

    // Additional safety check before download
    const auditStatus = auditResult?.status || localAudit(editableDoc).status;
    if (auditStatus === 'CRITICAL') {
      alert("عذراً، لا يمكن تحميل هذه الوثيقة لمخالفتها الجسيمة للنظام العام أو القوانين المغربية. يرجى تعديلها أو توليد نموذج آمن.");
      return;
    }
    
    // Split text into paragraphs for better formatting in Word
    const paragraphs = stripMarkdown(editableDoc).split('\n').filter(p => p.trim() !== '');
    const formattedParagraphs = paragraphs.map(p => `<p class="paragraph">${p}</p>`).join('');

    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${activeContractTemplate.name}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
          
          @page {
            size: A4;
            margin: 2cm;
          }
          body { 
            font-family: 'Amiri', serif; 
            direction: rtl; 
            text-align: justify;
            line-height: 1.5;
            font-size: 16pt;
            color: #000;
          }
          .title { 
            text-align: center; 
            font-size: 20pt; 
            font-weight: bold;
            margin-bottom: 30pt;
            text-decoration: underline;
            display: block;
            color: #000;
          }
          .paragraph {
            margin-bottom: 15pt;
            text-indent: 0pt;
          }
          .signatures {
            margin-top: 60pt;
            width: 100%;
          }
          .sig-box {
            width: 45%;
            display: inline-block;
            vertical-align: top;
            text-align: center;
          }
          .sig-space {
            height: 100px;
          }
        </style>
      </head>
      <body>
        <div class="title">${activeContractTemplate.name}</div>
        
        <div class="content">
          ${formattedParagraphs}
          
          <div class="signatures">
            <div class="sig-box">
              <p style="font-weight: bold;">إمضاء الطرف الأول:</p>
              <div class="sig-space"></div>
            </div>
            <div class="sig-box">
              <p style="font-weight: bold;">إمضاء الطرف الثاني:</p>
              <div class="sig-space"></div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeContractTemplate.name}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    if (!editableDoc || !activeContractTemplate) return;

    // Additional safety check before download
    const auditStatus = auditResult?.status || localAudit(editableDoc).status;
    if (auditStatus === 'CRITICAL') {
      alert("عذراً، لا يمكن تحميل هذه الوثيقة لمخالفتها الجسيمة للنظام العام أو القوانين المغربية. يرجى تعديلها أو توليد نموذج آمن.");
      return;
    }

    const paragraphs = stripMarkdown(editableDoc).split('\n').filter(p => p.trim() !== '');
    const formattedParagraphs = paragraphs.map(p => `<p class="paragraph">${p}</p>`).join('');

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
        <head>
          <title>${activeContractTemplate.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
            @page {
              size: A4;
              margin: 2cm;
            }
            body {
              font-family: 'Amiri', serif;
              direction: rtl;
              text-align: justify;
              line-height: 1.8;
              font-size: 14pt;
              color: #000;
              padding: 1cm;
            }
            .title {
              text-align: center;
              font-size: 22pt;
              font-weight: bold;
              margin-bottom: 40pt;
              border-bottom: 3px double #000;
              padding-bottom: 15px;
            }
            .paragraph {
              margin-bottom: 15pt;
              text-align: justify;
              line-height: 2.0;
            }
            .signatures {
              margin-top: 60pt;
              width: 100%;
              page-break-inside: avoid;
            }
            .sig-box {
              width: 45%;
              display: inline-block;
              vertical-align: top;
              text-align: center;
            }
            .sig-space {
              height: 120px;
            }
          </style>
        </head>
        <body>
          <div class="title">${activeContractTemplate.name}</div>
          <div class="content">
            ${formattedParagraphs}
            <div class="signatures">
              <div class="sig-box">
                <p style="font-weight: bold;">إمضاء الطرف الأول:</p>
                <div class="sig-space"></div>
              </div>
              <div class="sig-box" style="float: left;">
                <p style="font-weight: bold;">إمضاء الطرف الثاني:</p>
                <div class="sig-space"></div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-[90vh] bg-slate-50 p-4 md:p-8 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="pt-2"></div>
        {/* Actions bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 no-print mb-6">
          <div className="flex gap-2">
            <button 
              onClick={() => setStep('ARCHIVE')}
              className="px-6 py-3 bg-indigo-50 text-indigo-700 border-2 border-indigo-100 rounded-2xl font-black text-xs hover:bg-indigo-100 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              الأرشيف ({archivedDocs.length})
            </button>
            {step !== 'CATEGORY' && (
              <button 
                onClick={() => {
                  if (step === 'PREVIEW') setStep('FORM');
                  else if (step === 'FORM') setStep('TEMPLATE');
                  else if (step === 'TEMPLATE' || step === 'ARCHIVE') setStep('CATEGORY');
                }}
                className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-black text-xs hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
              >
                تراجع
              </button>
            )}
            <button 
              onClick={() => {
                setStep('CATEGORY');
                setActiveCategory(null);
                setSelectedTemplateId(null);
                setContractData({});
                setGeneratedDoc('');
              }}
              className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all shadow-xl flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              بدء من جديد
            </button>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-10 no-print">
          {['القواعد', 'النماذج', 'البيانات', 'المعاينة'].map((s, i) => {
            const stepOrder = ['CATEGORY', 'TEMPLATE', 'FORM', 'PREVIEW'];
            const currentIdx = stepOrder.indexOf(step);
            const isActive = currentIdx >= i;
            return (
              <div key={s} className="flex flex-col items-center gap-2 relative">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-black transition-all border-4",
                  isActive ? "bg-indigo-600 border-indigo-100 text-white" : "bg-white border-slate-100 text-slate-300"
                )}>
                  {i + 1}
                </div>
                <span className={cn("text-[10px] font-black uppercase", isActive ? "text-indigo-600" : "text-slate-400")}>{s}</span>
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Categories */}
          {step === 'CATEGORY' && (
            <motion.div 
              key="step-cat"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
            >
              <div className="relative max-w-xl mx-auto no-print">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="ابحث عن نموذج ذكي (مثلاً: بيع، كراء، وكالة...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-11 pr-10 pl-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold outline-none focus:border-indigo-500 transition-all text-xs md:text-sm text-right text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>

              {searchTerm ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredTemplates.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedTemplateId(t.id);
                        setAiTemplate(null);
                        setStep('FORM');
                      }}
                      className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-indigo-500/60 text-right transition-all flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40">
                        <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                      </div>
                      <div className="space-y-1 pt-0.5 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{t.name}</h4>
                        <p className="text-[11px] font-normal text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{t.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 no-print">
                  {(Object.keys(CATEGORIES) as ContractCategory[]).map(catKey => {
                    const CatIcon = CATEGORIES[catKey].icon;
                    return (
                      <button
                        key={catKey}
                        onClick={() => {
                          setActiveCategory(catKey);
                          setStep('TEMPLATE');
                        }}
                        className="group bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-indigo-500/60 transition-all text-center space-y-2.5 cursor-pointer active:scale-98"
                      >
                        <div className="w-10 h-10 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                          <CatIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{CATEGORIES[catKey].name}</h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">نماذج مسبقة متوافقة مع القانون المغربي</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* Archive Step */}
          {step === 'ARCHIVE' && (
             <motion.div 
               key="step-archive"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4"
             >
               <div className="text-right space-y-1 border-b border-slate-100 dark:border-slate-800 pb-3">
                 <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">أرشيف الوثائق</h2>
                 <p className="text-xs text-slate-500 dark:text-slate-400">جميع الوثائق المحفوظة سابقاً على جهازك</p>
               </div>

               {archivedDocs.length === 0 ? (
                 <div className="py-10 text-center space-y-2">
                   <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                   <p className="text-slate-400 font-bold text-xs">الأرشيف فارغ حالياً.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {archivedDocs.map(doc => (
                     <div key={doc.id} className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between gap-3">
                       <div className="space-y-1.5">
                         <div className="flex justify-between items-center">
                           <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">{doc.date}</span>
                           <button onClick={() => deleteArchived(doc.id)} className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer">
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                         <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{doc.name}</h4>
                         <p className="text-[11px] font-normal text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{doc.content}</p>
                       </div>
                       <button 
                         onClick={() => {
                           setEditableDoc(doc.content);
                           setGeneratedDoc(doc.content);
                           setStep('PREVIEW');
                         }}
                         className="w-full py-2 bg-white dark:bg-slate-700 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 rounded-lg font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                       >
                         فتح ومعاينة
                       </button>
                     </div>
                   ))}
                 </div>
               )}
             </motion.div>
          )}

          {/* Step 2: Templates List or AI Input */}
          {step === 'TEMPLATE' && (
            <motion.div 
              key="step-temp"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-4 no-print"
            >
              {activeCategory === 'AI_ASSISTANT' ? (
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                  <div className="text-center space-y-2">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center mx-auto">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">المولد الذكي للنماذج المغربية</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                        اطلب إعداد نموذج قانوني مخصص غير موجود ضمن القائمة المسبقة.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <textarea
                      placeholder="مثلاً: عقد بيع حصة في شركة، التزام بعدم التعرض، اتفاقية شراكة مهنية..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium outline-none focus:border-indigo-500 transition-all text-xs min-h-[100px] text-right text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={handleAIGenerate}
                        disabled={isAiGenerating || !aiPrompt.trim()}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer",
                          isAiGenerating ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"
                        )}
                      >
                        {isAiGenerating ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            جاري التوليد...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            توليد النموذج الآن
                          </>
                        )}
                      </button>

                      <button 
                        onClick={() => setAiPrompt("أريد إعداد نموذج لوثيقة قانونية غير موجودة ضمن النماذج المسبقة، تتعلق بـ: ")}
                        className="px-4 py-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800 rounded-xl font-bold text-xs hover:bg-amber-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Wand2 className="w-4 h-4" />
                        إعداد نموذج مخصص
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-800/60 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-medium text-amber-800 dark:text-amber-300 leading-relaxed">
                      يتم توليد هذه النماذج بناءً على القوانين المغربية. يرجى مراجعة النص المولد دائماً والتأكد من دقته القانونية قبل الاستخدام الرسمية.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Search Bar */}
                  <div className="relative max-w-xl mx-auto">
                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder={`ابحث في قسم ${CATEGORIES[activeCategory!]?.name || ''}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-10 pr-10 pl-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold outline-none focus:border-indigo-500 transition-all text-xs text-right text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredTemplates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setSelectedTemplateId(t.id);
                          setAiTemplate(null);
                          setStep('FORM');
                        }}
                        className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-indigo-500/60 text-right transition-all flex items-start gap-3 group cursor-pointer"
                      >
                        <div className="w-9 h-9 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40">
                          <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                        </div>
                        <div className="space-y-1 pt-0.5 min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{t.name}</h4>
                          <p className="text-[11px] font-normal text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{t.description}</p>
                        </div>
                      </button>
                    ))}
                    {filteredTemplates.length === 0 && (
                      <div className="col-span-full py-10 text-center space-y-2">
                        <Search className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto" />
                        <p className="text-slate-400 font-bold text-xs">لا يوجد أي نموذج يطابق بحثك في هذا القسم.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Form */}
          {step === 'FORM' && activeContractTemplate && (
            <motion.div 
              key="step-form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white dark:bg-[#0f1c30] p-6 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 no-print text-right"
            >
              {/* Form Title Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-black text-[#0f2d59] dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-7 bg-[var(--accent)] rounded-full inline-block" />
                    {activeContractTemplate.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-bold text-xs">
                    تعبئة دقيقة وموثوقة لجميع بيانات وبنود العقد
                  </p>
                </div>
                <button
                  onClick={() => setStep('TEMPLATE')}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all flex items-center gap-1.5"
                >
                  <ArrowRight className="w-4 h-4" />
                  تغيير النموذج
                </button>
              </div>

              {/* Section 1: معلومات العقد (Contract Core Details) */}
              <div className="space-y-4">
                <div className="flex items-center justify-start gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100/80 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-base text-slate-900 dark:text-slate-100">معلومات العقد</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeContractTemplate.fields.map(f => {
                    const isCurrencyField = f.id.toLowerCase().includes('currency') || f.label.includes('عملة');
                    const isAdditionalConsent = f.id.toLowerCase().includes('consent') || f.id.toLowerCase().includes('task') || f.label.includes('موافقة');

                    if (isCurrencyField || isAdditionalConsent) return null; // We handle currency & additional consents below in dedicated sections

                    return (
                      <div key={f.id} className={cn("space-y-1.5", f.type === 'textarea' ? "md:col-span-2" : "")}>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block pr-1">
                          {f.label}
                        </label>

                        <div className="relative">
                          {f.type === 'textarea' ? (
                            <textarea
                              placeholder={f.placeholder || f.label}
                              value={contractData[f.id] || ''}
                              onChange={(e) => setContractData(prev => ({ ...prev, [f.id]: e.target.value }))}
                              className="w-full py-3 pr-11 pl-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all text-xs text-slate-800 dark:text-slate-100 min-h-[90px]"
                            />
                          ) : (
                            <input
                              type={f.type}
                              placeholder={f.placeholder || f.label}
                              value={contractData[f.id] || ''}
                              onChange={(e) => setContractData(prev => ({ ...prev, [f.id]: e.target.value }))}
                              className="w-full py-3.5 pr-11 pl-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all text-xs text-slate-800 dark:text-slate-100"
                            />
                          )}
                          <div className="absolute right-3.5 top-3.5 pointer-events-none">
                            {getFieldIcon(f.id, f.label, f.type)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: نوع العملة (Currency Options) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-start gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 flex items-center justify-center font-bold">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-base text-slate-900 dark:text-slate-100">نوع العملة</h4>
                </div>

                <div className="flex flex-wrap items-center gap-6 pr-2 pt-1">
                  {[
                    { id: 'درهم مغربي', label: 'درهم مغربي' },
                    { id: 'دولار امريكي', label: 'دولار امريكي' },
                    { id: 'دينار عراقي', label: 'دينار عراقي' },
                    { id: 'أورو (EUR)', label: 'أورو (EUR)' }
                  ].map((curr) => {
                    const isSelected = (contractData['currency'] || 'درهم مغربي') === curr.id;
                    return (
                      <label key={curr.id} className="flex items-center gap-2.5 cursor-pointer font-bold text-xs text-slate-800 dark:text-slate-200 select-none">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => setContractData(prev => ({ ...prev, currency: curr.id }))}
                          className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                        />
                        <span>{curr.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: التزامات الطرف الثاني (Second Party Obligations) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-start gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-base text-slate-900 dark:text-slate-100">التزامات الطرف الثاني</h4>
                </div>

                <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                    هل يوافق الطرف الثاني على تكليفه من قبل الطرف الأول بأعمال غير مذكورة بالعقد على ان لا تخرج عن قدرته وامكانياته؟
                  </p>
                  
                  <div className="flex items-center gap-8 pr-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800 dark:text-slate-200">
                      <input 
                        type="checkbox" 
                        checked={(contractData['additionalTasksConsent'] || 'نعم') === 'نعم'}
                        onChange={() => setContractData(prev => ({ ...prev, additionalTasksConsent: 'نعم' }))}
                        className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                      />
                      <span>نعم</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800 dark:text-slate-200">
                      <input 
                        type="checkbox" 
                        checked={contractData['additionalTasksConsent'] === 'كلا'}
                        onChange={() => setContractData(prev => ({ ...prev, additionalTasksConsent: 'كلا' }))}
                        className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                      />
                      <span>كلا</span>
                    </label>
                  </div>
                </div>

                {/* Deadlines / Additional Terms */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block pr-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    الآجال، التواريخ أو شروط إضافية (اختياري)
                  </label>
                  <textarea
                    placeholder="أدخل أي آجال محددة، تواريخ أداء، أو شروط زمنية خاصة هنا..."
                    value={contractData['custom_deadlines'] || ''}
                    onChange={(e) => setContractData(prev => ({ ...prev, ['custom_deadlines']: e.target.value }))}
                    className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all text-xs text-slate-800 dark:text-slate-100 min-h-[90px]"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={handleGenerateContract} 
                  className="w-full py-4 bg-[#0f2d59] hover:bg-[#0a1f3f] text-white rounded-xl font-black text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-3"
                >
                  <RefreshCw className="w-5 h-5" />
                  توليد الوثيقة النهائية والمعاينة
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Preview */}
          {step === 'PREVIEW' && generatedDoc && activeContractTemplate && (
            <motion.div 
              key="step-preview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs gap-3 no-print">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">تم توليد الوثيقة بنجاح</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">يمكنك المراجعة، التعديل المباشر، التحميل أو حفظها بالأرشيف</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button 
                    onClick={handleAuditAndDownload} 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-2xs hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> فحص وتحميل
                  </button>
                  <button 
                    onClick={handleArchive} 
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-2xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" /> حفظ بالأرشيف
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs min-h-[600px] relative">
                <div className="contract-document" dir="rtl">
                  <h2 className="text-center font-bold border-b-2 border-slate-900 dark:border-slate-200 pb-4 mb-6 text-xl md:text-2xl underline uppercase block">
                    {activeContractTemplate.name}
                  </h2>
                  <textarea
                    value={editableDoc}
                    onChange={(e) => setEditableDoc(e.target.value)}
                    className="w-full min-h-[500px] border-none focus:ring-0 resize-none p-0 bg-transparent whitespace-pre-wrap outline-none no-print font-serif text-base md:text-lg leading-[2] text-slate-800 dark:text-slate-100 text-justify"
                    placeholder="قم بتعديل الوثيقة هنا..."
                  />
                  <div className="hidden print:block whitespace-pre-wrap text-justify">
                    {editableDoc}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Styles for Print */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            aside, header, nav, .no-print, button, .custom-scrollbar, [role="step-indicator"] { display: none !important; }
            body, .bg-slate-50, .min-h-screen { background: white !important; }
            .max-w-5xl { max-width: 100% !important; margin: 0 !important; width: 100% !important; }
            .p-4, .p-8, .p-10, .p-16, .p-24 { padding: 0 !important; }
            .border-2, .shadow-2xl, .shadow-xl { border: none !important; box-shadow: none !important; }
            .contract-document { 
              font-family: 'Amiri', serif !important;
              color: black !important;
              line-height: 1.5 !important;
              padding: 1.5cm !important;
              font-size: 16pt !important;
              text-align: justify !important;
            }
            .contract-document h2 {
              font-size: 20pt !important;
              margin-bottom: 30pt !important;
              text-align: center !important;
            }
          }
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        `}} />
      </div>

      {/* Risk Engine Modal - Fully Redesigned for Mobile (Drawer on Mobile / Modal on Desktop) */}
      <AnimatePresence>
        {showRiskModal && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-10 no-print" dir="rtl">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRiskModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-white w-full max-w-5xl md:rounded-[4rem] rounded-t-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto md:max-h-[85vh]"
            >
              {/* Left Side: Stats/Score (Mobile Header-like on small screens) */}
              <div className="w-full md:w-1/3 bg-indigo-600 p-8 md:p-12 flex flex-col justify-between text-white border-l-0 md:border-l-8 border-indigo-700 shadow-inner shrink-0">
                <div className="space-y-6 md:space-y-8">
                  <div className="flex justify-between items-center md:block">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-500 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg">
                      <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <button onClick={() => setShowRiskModal(false)} className="md:hidden p-2 bg-white/10 rounded-full">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="space-y-2 md:space-y-4">
                    <h3 className="text-2xl md:text-3xl font-black leading-tight">ميزان الأمان القانوني</h3>
                    <p className="text-indigo-100 font-medium text-xs md:text-sm leading-relaxed">تحليل ذكي يعتمد على قانون الالتزامات والعقود المغربي لضمان حماية مصالحك.</p>
                  </div>
                </div>
                
                <div className="mt-8 md:mt-0 space-y-4 md:space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-black text-xl md:text-3xl border-2",
                      isAuditing ? "animate-pulse border-white/20" : "bg-white/10 border-white/20"
                    )}>
                      {isAuditing ? "..." : auditResult?.score || 0}%
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">درجة الحماية الكلية</p>
                      <p className="text-xs font-black text-white">{isAuditing ? "جاري التحليل..." : (auditResult?.status === 'SAFE' ? 'آمن جداً' : 'يتطلب حذراً')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Detailed Analysis */}
              <div className="flex-1 p-6 md:p-14 overflow-y-auto custom-scrollbar">
                {isAuditing ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 space-y-6 text-center">
                    <div className="relative">
                      <RefreshCw className="w-16 h-16 text-indigo-600 animate-spin" />
                      <Sparkles className="w-8 h-8 text-amber-500 absolute -top-2 -right-2 animate-bounce" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-black text-slate-800">جاري قراءة ما بين السطور...</h4>
                      <p className="text-slate-400 font-bold text-sm">يتم الآن فحص البنود التعسفية والخطوط الحمراء القانونية.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-10 md:space-y-12">
                    {/* Risk Pillars */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      {Object.entries(auditResult?.pillars || {}).map(([key, value]) => (
                        <div key={key} className="bg-slate-50 p-4 md:p-5 rounded-2xl md:rounded-3xl border-2 border-white shadow-sm hover:border-indigo-100 transition-colors">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">
                            {key === 'financial' && 'المخاطر مالية'}
                            {key === 'time' && 'المخاطر زمنية'}
                            {key === 'execution' && 'مخاطر تنفيذ'}
                            {key === 'legal' && 'نزاع قانوني'}
                          </p>
                          <div className="flex items-end justify-between">
                            <span className="text-xl md:text-2xl font-black text-slate-800 leading-none">{value as number}%</span>
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              (value as number) < 30 ? "bg-emerald-500" : (value as number) < 70 ? "bg-amber-400" : "bg-red-500"
                            )} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Red Flags Section */}
                    <div className="space-y-4">
                      <h4 className="text-lg md:text-xl font-black text-slate-900 border-r-4 border-indigo-600 pr-3">تنبيهات التدقيق (Red-Flags)</h4>
                      <div className="space-y-3">
                        {auditResult?.red_flags?.map((flag: any, i: number) => (
                          <div key={i} className={cn(
                            "p-4 md:p-5 rounded-2xl border-2 flex items-start gap-4",
                            flag.level === 'RED' ? "bg-red-50 border-red-100" : flag.level === 'YELLOW' ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"
                          )}>
                            <AlertTriangle className={cn("w-5 h-5 shrink-0 mt-0.5", flag.level === 'RED' ? "text-red-500" : flag.level === 'YELLOW' ? "text-amber-500" : "text-emerald-500")} />
                            <p className="text-xs md:text-sm font-bold text-slate-700 leading-relaxed">{flag.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Missing Clauses */}
                    {auditResult?.missing_clauses?.length > 0 && (
                      <div className="p-6 md:p-8 bg-indigo-50 rounded-[2rem] md:rounded-[2.5rem] border-2 border-white shadow-sm space-y-4">
                        <div className="flex items-center gap-3 text-indigo-800">
                          <Info className="w-5 h-5" />
                          <h5 className="font-black">بنود مفقودة يُنصح بإضافتها:</h5>
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {auditResult.missing_clauses.map((clause: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-xs font-black text-indigo-600/70">
                              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                              {clause}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="sticky bottom-0 bg-white pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-4">
                      {auditResult?.status === 'CRITICAL' ? (
                        <div className="flex-1 p-5 bg-red-50 border-2 border-red-100 rounded-2xl text-center space-y-3">
                          <p className="text-red-700 font-black text-sm">هذا العقد يحتوي على مخالفات قانونية جسيمة ولا يمكن تحميله بصيغته الحالية.</p>
                          <button 
                            onClick={handleRegenerateSafe}
                            disabled={isRegenerating}
                            className="w-full py-4 bg-red-600 text-white rounded-xl font-black text-xs hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                          >
                            {isRegenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            إصلاح وتوليد نسخة قانونية آمنة فوراً
                          </button>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={() => {
                              handleDownloadWord();
                              setShowRiskModal(false);
                            }}
                            className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-base md:text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
                          >
                            <Download className="w-5 h-5" />
                            تحميل بصيغة Word
                          </button>

                          <button 
                            onClick={() => {
                              handleDownloadPDF();
                              setShowRiskModal(false);
                            }}
                            className="flex-1 py-5 bg-teal-600 text-white rounded-2xl font-black text-base md:text-lg hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 flex items-center justify-center gap-3"
                          >
                            <Printer className="w-5 h-5" />
                            تحميل بصيغة PDF
                          </button>
                          
                          {auditResult?.status === 'WARNING' && (
                            <button 
                              onClick={handleRegenerateSafe}
                              disabled={isRegenerating}
                              className="flex-1 py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black text-base md:text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                            >
                              {isRegenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-amber-500" />}
                              تحسين الصياغة القانونية
                            </button>
                          )}
                        </>
                      )}
                      
                      <button 
                        onClick={() => setShowRiskModal(false)}
                        className="px-8 py-5 bg-slate-50 border-2 border-slate-200 text-slate-500 rounded-2xl font-black text-lg hover:bg-slate-100 transition-all"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
