import { StaticCase, InterrogationCase, StaticEvent } from './legalData';
import { extendedLawyerCases } from './cases/lawyerCases';
import { extendedJudgeCases } from './cases/judgeCases';
import { extendedInvestigatorCases } from './cases/investigatorCases';

/**
 * Interface for the new interactive Judge cases
 */
export interface JudgeCase {
  id: string;
  title: string;
  type: string;
  parties: { plaintiff: string; defendant: string };
  facts: string;
  documents: { title: string; content: string; type: string; credibility: number }[];
  witnesses: { 
    name: string; 
    testimony: string; 
    credibility: number; 
    emotionalState: 'nervous' | 'confident' | 'angry' | 'hesitant';
    hiddenTruth?: string;
    unlockTrigger?: string;
  }[];
  incident?: {
    trigger: string;
    options: { text: string; action: 'dismiss' | 'prosecute' | 'ignore' | 'accept' | 'reject' | 'delay'; impact: { reputation: number; social: number }; feedback: string }[];
  };
  pleas?: {
    text: string;
    options: { text: string; action: 'accept' | 'reject'; impact: number; feedback: string }[];
  };
  interrogation: {
    speaker: string;
    text: string;
    options: { text: string; type: 'pressure' | 'smart' | 'neutral'; revealClue?: string; impact: number }[];
  }[];
  discussions: {
    civilParty: string;
    prosecution: string;
    defense: string;
  };
  lastWord: string;
  socialMedia: { user: string; comment: string; sentiment: 'positive' | 'negative' | 'neutral' }[];
  verdictOptions: { 
    text: string; 
    isCorrect: boolean; 
    legalScore: number; 
    ethicalScore: number;
    reasoning: string; 
    feedback: string;
    socialImpact: number;
  }[];
  correctJudgment: { verdict: string; reasoning: string; legalBasis: string };
}

export interface LawyerCase {
  id: string;
  title: string;
  type: 'commercial' | 'labor' | 'family' | 'criminal';
  description: string;
  facts: string;
  initialEvidence: string[];
  clientTrust: number;
  isClientHonest: boolean;
  baseFees: number;
  investigation: {
    witnesses: { name: string; testimony: string; isLying: boolean; cost: { money: number; energy: number } }[];
    evidence: { title: string; description: string; isMisleading: boolean; cost: { money: number; energy: number } }[];
    laws: { text: string; relevance: number; cost: { money: number; energy: number } }[];
  };
  analysis: {
    qualifications: { text: string; isCorrect: boolean; feedback: string }[];
    strategies: { text: string; impact: number; feedback: string }[];
  };
  courtSession: {
    judgeMood: number;
    opposingCounsel: string;
    events: {
      trigger: string;
      options: { text: string; type: 'objection' | 'question' | 'evidence'; impact: number; feedback: string }[];
    }[];
  };
  verdict: {
    winFeedback: string;
    lossFeedback: string;
    rewards: { budget: number; reputation: number; energy: number };
  };
}

// --- LAWYER CASES (LawyerCase) ---
export const lawyerDatabase: LawyerCase[] = [
  {
    id: 'law-1',
    title: 'قضية نفقة معقدة',
    type: 'family',
    description: 'نزاع حول الحضانة والنفقة بعد الطلاق مع إخفاء الدخل.',
    facts: 'الزوج يدعي البطالة بينما تملك الزوجة صوراً له وهو يدير مشروعاً تجارياً سرياً.',
    initialEvidence: ['رسم الطلاق', 'صور فوتوغرافية'],
    clientTrust: 80,
    isClientHonest: true,
    baseFees: 15000,
    investigation: {
      witnesses: [
        { name: 'الجار', testimony: 'أراه يخرج كل صباح ببدلة رسمية.', isLying: false, cost: { money: 500, energy: 10 } }
      ],
      evidence: [
        { title: 'كشف حساب بنكي', description: 'يظهر تحويلات منتظمة من شركة مجهولة.', isMisleading: false, cost: { money: 2000, energy: 20 } }
      ],
      laws: [
        { text: 'المادة 190 من مدونة الأسرة', relevance: 100, cost: { money: 0, energy: 15 } }
      ]
    },
    analysis: {
      qualifications: [
        { text: 'إخفاء الدخل الحقيقي للتهرب من النفقة', isCorrect: true, feedback: 'تحليل دقيق للوقائع.' }
      ],
      strategies: [
        { text: 'المطالبة ببحث اجتماعي وتدقيق بنكي', impact: 30, feedback: 'استراتيجية فعالة لكشف الدخل.' }
      ]
    },
    courtSession: {
      judgeMood: 50,
      opposingCounsel: 'محامي الزوج',
      events: [
        {
          trigger: 'الزوج يقدم شهادة احتياج من السلطة المحلية',
          options: [
            { text: 'الطعن في الشهادة وتقديم كشف الحساب', type: 'evidence', impact: 20, feedback: 'القاضي اقتنع بوجود دخل خفي.' }
          ]
        }
      ]
    },
    verdict: {
      winFeedback: 'تم الحكم بنفقة عادلة للأطفال.',
      lossFeedback: 'المحكمة اعتمدت على شهادة الاحتياج لعدم كفاية الأدلة.',
      rewards: { budget: 20000, reputation: 15, energy: 10 }
    }
  },
  {
    id: 'law-2',
    title: 'فصل تعسفي في شركة تقنية',
    type: 'labor',
    description: 'مهندس برمجيات تم فصله بدعوى ارتكاب خطأ جسيم (سرقة بيانات).',
    facts: 'ياسين مهندس متميز، تم فصله فجأة بعد رفضه التوقيع على تنازل عن براءة اختراع.',
    initialEvidence: ['رسالة الفصل', 'عقد الشغل'],
    clientTrust: 90,
    isClientHonest: true,
    baseFees: 25000,
    investigation: {
      witnesses: [
        { name: 'زميل سابق', testimony: 'المدير هدد ياسين أمامنا.', isLying: false, cost: { money: 1000, energy: 15 } }
      ],
      evidence: [
        { title: 'فيديو الكاميرا', description: 'يظهر ياسين يحمل كيساً.', isMisleading: true, cost: { money: 3000, energy: 15 } }
      ],
      laws: [
        { text: 'المادة 41 من مدونة الشغل', relevance: 100, cost: { money: 0, energy: 20 } }
      ]
    },
    analysis: {
      qualifications: [
        { text: 'فصل تعسفي لعدم ثبوت الخطأ الجسيم', isCorrect: true, feedback: 'صحيح، عبء الإثبات على المشغل.' }
      ],
      strategies: [
        { text: 'التركيز على خرق مسطرة الفصل', impact: 25, feedback: 'نقطة قانونية قوية.' }
      ]
    },
    courtSession: {
      judgeMood: 60,
      opposingCounsel: 'محامي الشركة',
      events: [
        {
          trigger: 'الشركة تقدم فيديو الكاميرا كدليل قاطع',
          options: [
            { text: 'المطالبة بخبرة تقنية على الفيديو', type: 'evidence', impact: 15, feedback: 'الخبرة أثبتت أن الكيس كان يحتوي ملابس خاصة.' }
          ]
        }
      ]
    },
    verdict: {
      winFeedback: 'تم الحكم بتعويضات مهمة للأجير.',
      lossFeedback: 'المحكمة اعتبرت الخطأ الجسيم ثابتاً.',
      rewards: { budget: 30000, reputation: 25, energy: 20 }
    }
  },
  ...extendedLawyerCases
];

// --- JUDGE CASES (JudgeCase) ---
export const judgeDatabase: JudgeCase[] = [
  {
    id: 'jud-1',
    title: 'قضية حادثة سير مروعة',
    type: 'جنائي - سير',
    parties: { plaintiff: 'عائلة الضحية', defendant: 'سائق شاحنة (عمر)' },
    facts: 'حادثة سير مروعة أدت لوفاة شخص. السائق يدعي أن الفرامل تعطلت فجأة، بينما تقرير الخبرة الأولية يقول أن الشاحنة كانت في حالة جيدة.',
    documents: [
      { title: 'تقرير الخبرة الميكانيكية', content: 'نظام الكبح سليم تماماً.', type: 'خبرة', credibility: 90 },
      { title: 'سجل الصيانة', content: 'آخر صيانة كانت قبل أسبوع.', type: 'وثيقة', credibility: 100 }
    ],
    witnesses: [
      { 
        name: 'إبراهيم (ميكانيكي)', 
        testimony: 'السائق زارني قبل الحادث وقال أن هناك صوتاً غريباً في الفرامل لكنه لم يصلحها.', 
        credibility: 85, 
        emotionalState: 'confident',
        hiddenTruth: 'السائق طلب منه تزوير تقرير الصيانة بعد الحادث.',
        unlockTrigger: 'مواجهة الشاهد بسجل الصيانة الرسمي'
      }
    ],
    incident: {
      trigger: 'أحد أقارب الضحية يحاول تصوير المتهم بهاتفه داخل القاعة خلسة.',
      options: [
        { text: 'طرده من الجلسة فوراً', action: 'dismiss', impact: { reputation: 5, social: -5 }, feedback: 'حافظت على هيبة المحكمة ونظام الجلسة.' },
        { text: 'الأمر بحجز الهاتف ومتابعته', action: 'prosecute', impact: { reputation: 10, social: -10 }, feedback: 'صرامة في تطبيق قانون المسطرة الجنائية.' },
        { text: 'تنبيهه بالاكتفاء بوضعه في جيبه', action: 'ignore', impact: { reputation: -5, social: 5 }, feedback: 'تسامح قد يفسر على أنه ضعف في الضبط.' }
      ]
    },
    pleas: {
      text: 'دفع محامي المتهم ببطلان محضر الضابطة القضائية لعدم توقيع المتهم عليه.',
      options: [
        { text: 'قبول الدفع (بطلان المحضر)', action: 'accept', impact: 10, feedback: 'احترمت المسطرة الجنائية وحقوق الدفاع.' },
        { text: 'رفض الدفع لثبوت الهوية', action: 'reject', impact: -5, feedback: 'استمرت المحاكمة لكن هناك ثغرة قانونية.' }
      ]
    },
    interrogation: [
      {
        speaker: 'المتهم (عمر)',
        text: 'أقسم أنني حاولت التوقف لكن الدواسة كانت صلبة جداً! لم أقصد قتله.',
        options: [
          { text: 'لماذا لم تستخدم فرامل اليد؟', type: 'pressure', revealClue: 'المتهم يعترف أنه ارتبك ونسيها.', impact: 5 },
          { text: 'الخبرة تقول أن الفرامل سليمة، أنت تكذب!', type: 'smart', revealClue: 'المتهم يبدأ بالارتباك ويعترف أنه كان مسرعاً.', impact: 10 },
          { text: 'هل كنت تشعر بالتعب قبل الرحلة؟', type: 'neutral', impact: 0 }
        ]
      }
    ],
    discussions: {
      civilParty: 'المطالبة بتعويض قدره 500,000 درهم وجبر الضرر.',
      prosecution: 'ملتمس الإدانة بأقصى العقوبات لثبوت الإهمال والرعونة.',
      defense: 'المطالبة بالبراءة لفائدة الشك ووجود عيب ميكانيكي خفي.'
    },
    lastWord: 'أنا نادم جداً، لم أكن أريد إيذاء أحد، أرجو من المحكمة الرأفة.',
    socialMedia: [
      { user: "@JusticeNow", comment: "هؤلاء السائقون يقتلوننا في الطرقات! يجب إعدامه.", sentiment: 'negative' },
      { user: "@LegalMind", comment: "يجب انتظار التقرير التقني النهائي، الحوادث تقع.", sentiment: 'neutral' }
    ],
    verdictOptions: [
      { 
        text: 'إدانة بالقتل الخطأ مع أقصى عقوبة حبسية.', 
        isCorrect: false, 
        legalScore: 60, 
        ethicalScore: 30,
        socialImpact: 50,
        reasoning: 'تسرع في الحكم دون اعتبار للخبرة التقنية الثانية.', 
        feedback: 'محكمة النقض ستنقض هذا الحكم لوجود عيب تقني.'
      },
      { 
        text: 'إدانة مخففة مع غرامة وتعويض مدني.', 
        isCorrect: true, 
        legalScore: 100, 
        ethicalScore: 90,
        socialImpact: -10,
        reasoning: 'مراعاة العيب التقني الخفي مع تحميل السائق مسؤولية الإرهاق.', 
        feedback: 'حكم متوازن يراعي كل جوانب القضية.'
      }
    ],
    correctJudgment: {
      verdict: 'الحبس 6 أشهر موقوفة التنفيذ وغرامة 5000 درهم.',
      reasoning: 'ثبوت الخطأ غير العمدي الناتج عن الإرهاق، مع مراعاة العيب الميكانيكي كظرف تخفيف.',
      legalBasis: 'المادة 172 من مدونة السير.'
    }
  },
  {
    id: 'jud-2',
    title: 'نزاع حول حضانة الأطفال',
    type: 'أسري - حضانة',
    parties: { plaintiff: 'الأب (كريم)', defendant: 'الأم (ليلى)' },
    facts: 'الأب يطالب بإسقاط الحضانة عن الأم بدعوى أنها تزوجت من أجنبي، بينما تدعي الأم أن الزواج صوري فقط لتأمين إقامة في الخارج.',
    documents: [
      { title: 'عقد زواج أجنبي', content: 'عقد موثق في فرنسا.', type: 'رسم', credibility: 100 }
    ],
    witnesses: [
      { 
        name: 'خالة الأطفال', 
        testimony: 'ليلى تحب أطفالها والزوج الجديد لا يسكن معهم أصلاً.', 
        credibility: 70, 
        emotionalState: 'hesitant'
      }
    ],
    incident: {
      trigger: 'الأب يبدأ بالصراخ واتهام الأم بالخيانة داخل القاعة.',
      options: [
        { text: 'تنبيهه بضرورة الهدوء', action: 'dismiss', impact: { reputation: 5, social: 0 }, feedback: 'تسيير مرن للجلسة.' },
        { text: 'طرده من القاعة', action: 'prosecute', impact: { reputation: 10, social: -5 }, feedback: 'حزم في ضبط الجلسة.' },
        { text: 'تجاهله ومواصلة الاستماع', action: 'ignore', impact: { reputation: -5, social: 0 }, feedback: 'فقدان جزئي للسيطرة.' }
      ]
    },
    pleas: {
      text: 'دفع محامي الأم بعدم اختصاص المحكمة مكانياً لأن السكن الفعلي في مدينة أخرى.',
      options: [
        { text: 'قبول الدفع (إحالة الملف)', action: 'accept', impact: 10, feedback: 'تطبيق سليم لقواعد الاختصاص.' },
        { text: 'رفض الدفع للاستعجال', action: 'reject', impact: -5, feedback: 'تجاوز قواعد الاختصاص قد يبطل الحكم.' }
      ]
    },
    interrogation: [
      {
        speaker: 'الأم (ليلى)',
        text: 'أطفالي هم حياتي، زواجي كان مجرد ورقة لضمان مستقبلهم المادي.',
        options: [
          { text: 'هل يعيش الزوج الجديد مع الأطفال؟', type: 'smart', revealClue: 'الأم تعترف أنه يزورهم أحياناً.', impact: 10 },
          { text: 'ألا تخشين على مصلحة الأطفال؟', type: 'pressure', impact: 5 },
          { text: 'من ينفق على الأطفال حالياً؟', type: 'neutral', impact: 0 }
        ]
      }
    ],
    discussions: {
      civilParty: 'الأب يصر على نقل الحضانة له فوراً خوفاً على أخلاق الأطفال.',
      prosecution: 'النيابة العامة تؤكد على تغليب مصلحة المحضون الفضلى.',
      defense: 'الدفاع يطلب الإبقاء على الحضانة لتعلق الأطفال بأمهم.'
    },
    lastWord: 'أرجوكم لا تحرموني من أطفالي، هم كل ما أملك.',
    socialMedia: [
      { user: "@FamilyFirst", comment: "الأم أحق بأطفالها مهما كانت الظروف.", sentiment: 'positive' },
      { user: "@LawIsLaw", comment: "يجب تطبيق المدونة، القانون واضح.", sentiment: 'negative' }
    ],
    verdictOptions: [
      { 
        text: 'إسقاط الحضانة ونقلها للأب.', 
        isCorrect: false, 
        legalScore: 100, 
        ethicalScore: 50,
        socialImpact: -30,
        reasoning: 'تطبيق حرفي للمادة 175 من مدونة الأسرة دون اعتبار للمصلحة الفضلى.', 
        feedback: 'قانونياً صحيح، لكن محكمة النقض قد تتدخل لمصلحة الطفل.'
      },
      { 
        text: 'الإبقاء على الحضانة مع الأم لمصلحة المحضون.', 
        isCorrect: true, 
        legalScore: 80, 
        ethicalScore: 100,
        socialImpact: 40,
        reasoning: 'تغليب مصلحة الأطفال الفضلى على نص القانون الجاف.', 
        feedback: 'قرار شجاع يراعي روح القانون المغربي.'
      }
    ],
    correctJudgment: {
      verdict: 'الإبقاء على الحضانة مع الأم مع تشديد الرقابة.',
      reasoning: 'مصلحة الأطفال تقتضي البقاء مع الأم في هذه المرحلة العمرية، والزواج لم يثبت ضرره عليهم.',
      legalBasis: 'المادة 186 من مدونة الأسرة.'
    }
  },
  {
    id: 'jud-3',
    title: 'قضية تشهير بمؤثرة',
    type: 'رأي عام - تشهير',
    parties: { plaintiff: 'مؤثرة مشهورة', defendant: 'صحفي استقصائي' },
    facts: 'الصحفي نشر تحقيقاً يتهم المؤثرة بالترويج لمنتجات تجميل مغشوشة تسببت في حروق لبعض الفتيات. المؤثرة تقاضيه بتهمة التشهير ونشر أخبار زائفة.',
    documents: [
      { title: 'مقال صحفي', content: 'تحقيق مفصل مع شهادات ضحايا.', type: 'مقال', credibility: 70 },
      { title: 'تقرير مختبر', content: 'يؤكد وجود مواد سامة في عينات من المنتج.', type: 'خبرة', credibility: 95 }
    ],
    witnesses: [
      { 
        name: 'إحدى الضحايا', 
        testimony: 'استعملت المنتج الذي نصحت به وأصبت بحروق من الدرجة الثانية.', 
        credibility: 90, 
        emotionalState: 'angry'
      }
    ],
    incident: {
      trigger: 'الصحفي يقدم تسجيلاً صوتياً جديداً لم يكن في الملف.',
      options: [
        { text: 'قبول الدليل الجديد', action: 'accept', impact: { reputation: 10, social: 5 }, feedback: 'البحث عن الحقيقة يبرر قبول الدليل.' },
        { text: 'رفضه لعدم سلوك المسطرة', action: 'reject', impact: { reputation: 5, social: -5 }, feedback: 'احترام المسطرة الجنائية واجب.' },
        { text: 'تأجيل الجلسة للدراسة', action: 'delay', impact: { reputation: 0, social: 0 }, feedback: 'قرار حكيم لإعطاء فرصة للدفاع.' }
      ]
    },
    pleas: {
      text: 'دفع محامي المؤثرة بعدم قبول الدعوى لانتفاء الصفة في الصحفي للقيام بالتحقيق.',
      options: [
        { text: 'رفض الدفع (حرية الصحافة)', action: 'reject', impact: 10, feedback: 'حرية التعبير مكفولة دستورياً.' },
        { text: 'قبول الدفع شكلياً', action: 'accept', impact: -10, feedback: 'قرار قد يفسر على أنه محاباة للمشاهير.' }
      ]
    },
    interrogation: [
      {
        speaker: 'الصحفي',
        text: 'واجبي المهني يفرض علي تحذير الناس من خطر يهدد صحتهم.',
        options: [
          { text: 'هل تأكدت من مصدر المنتجات؟', type: 'smart', impact: 5 },
          { text: 'ألم تكن تهدف لزيادة المشاهدات؟', type: 'pressure', impact: 5 },
          { text: 'ما هو مصدر معلوماتك الأولية؟', type: 'neutral', impact: 0 }
        ]
      }
    ],
    discussions: {
      civilParty: 'المطالبة بتعويض رمزي قدره درهم واحد واعتذار علني.',
      prosecution: 'المطالبة بتطبيق قانون الصحافة والنشر بصرامة.',
      defense: 'المطالبة بالبراءة لثبوت صحة الوقائع والمصلحة العامة.'
    },
    lastWord: 'أنا صحفي، وهدفي كان حماية الفتيات من التضليل.',
    socialMedia: [
      { user: "@FansClub", comment: "إنهم يغارون من نجاحها! هي بريئة.", sentiment: 'positive' },
      { user: "@HealthWatch", comment: "الصحة قبل كل شيء، شكراً للصحافة الحرة.", sentiment: 'negative' }
    ],
    verdictOptions: [
      { 
        text: 'إدانة الصحفي بتهمة التشهير.', 
        isCorrect: false, 
        legalScore: 40, 
        ethicalScore: 20,
        socialImpact: -50,
        reasoning: 'تجاهل المصلحة العامة وحرية الصحافة المبنية على أدلة.', 
        feedback: 'حكم يقيد حرية التعبير ويضر بالمجتمع.'
      },
      { 
        text: 'براءة الصحفي لثبوت صحة الوقائع والمصلحة العامة.', 
        isCorrect: true, 
        legalScore: 100, 
        ethicalScore: 100,
        socialImpact: 60,
        reasoning: 'الصحفي قام بواجبه والوقائع ثابتة بتقرير المختبر.', 
        feedback: 'انتصار للعدالة وللصحافة الجادة.'
      }
    ],
    correctJudgment: {
      verdict: 'براءة المتهم ورفض المطالب المدنية.',
      reasoning: 'ثبوت صحة الوقائع المنشورة وانتفاء القصد الجرمي، مع تغليب حق المواطن في المعلومة المتعلقة بصحته.',
      legalBasis: 'قانون الصحافة والنشر المغربي.'
    }
  },
  ...extendedJudgeCases
];

// --- INVESTIGATOR CASES (LoopholeCase) ---
export const investigatorDatabase: InterrogationCase[] = [
  {
    id: 'inv-1',
    level: 1,
    type: 'theft',
    title: 'سرقة محل مجوهرات "الجوهرة"',
    scenario: 'تمت سرقة محل مجوهرات في منتصف الليل. تم العثور على بصمات جزئية في مسرح الجريمة، وهناك شاهد يدعي رؤية شخص يشبه المتهم قرب المحل.',
    suspect: {
      name: 'عمر (المتهم)',
      trait: 'liar',
      description: 'شاب في الثلاثينيات، يبدو واثقاً جداً ويختلق تفاصيل كثيرة لتبرير غيابه.',
      initialMood: 'واثق ومراوغ'
    },
    evidence: [
      { id: 'ev-1', title: 'كاميرا المراقبة', description: 'تسجيل غير واضح يظهر شخصاً بملابس رياضية زرقاء.', type: 'digital' },
      { id: 'ev-2', title: 'شهادة الحارس', description: 'يؤكد رؤية شخص يرتدي سترة زرقاء يغادر الزقاق الخلفي للمحل.', type: 'testimony' },
      { id: 'ev-3', title: 'بصمات جزئية', description: 'بصمات وجدت على زجاج العرض المحطم، تتطابق جزئياً مع المتهم.', type: 'physical' }
    ],
    contradictions: [
      { id: 'con-1', targetId1: 'ev-2', targetId2: 'inv-statement-1', explanation: 'المتهم يدعي أنه كان نائماً، لكن الحارس رآه في الخارج.' }
    ],
    goldenQuestion: {
      trigger: 'بعد مواجهته بشهادة الحارس وتناقض قصة النوم',
      question: 'لماذا وجدت سترة زرقاء مبللة في سلة مهملات منزلك إذا كنت نائماً طوال الليل؟',
      feedback: 'هذا السؤال كسر دفاعه تماماً وجعله ينهار.'
    },
    legalRules: [
      'الفصل 505 من القانون الجنائي المغربي المتعلق بالسرقة.',
      'شروط صحة الاعتراف القضائي.',
      'قوة الإثبات بواسطة القرائن والشهادة.'
    ]
  },
  ...extendedInvestigatorCases
];

export const eventDatabase: StaticEvent[] = [
  {
    title: 'ندوة حول إصلاح العدالة',
    description: 'تمت دعوتك للمشاركة في ندوة وطنية حول رقمنة المحاكم.',
    options: [
      { 
        text: 'المشاركة بفعالية', 
        hint: 'تعزيز الرقمنة',
        impact: { reputation: 15, budget: -1000, energy: -20, feedback: 'ساهمت في إشعاع صورة القضاء.' }
      },
      { 
        text: 'الاعتذار لانشغالات مهنية', 
        hint: 'التركيز على الملفات',
        impact: { reputation: -5, budget: 0, energy: 10, feedback: 'فوت فرصة للتواصل المهني.' }
      }
    ]
  }
];
