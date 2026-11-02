import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, GraduationCap, Building2, Calendar, UserCheck, ChevronLeft, X, FileText, CheckCircle2, Info, ExternalLink, MapPin, Clock, Scale, History, Share2, Link, Facebook, Twitter, Linkedin, Trophy, RefreshCw, RotateCcw, Send, Sparkles, User, Bot, Loader2, Download, CheckSquare, BookOpen, ClipboardList } from 'lucide-react';
import { cn } from '../lib/utils';
import SelfAssessment from './SelfAssessment';

const quizQuestions = [
  {
    id: 1,
    question: "ما هو النشاط الذي تجد فيه نفسك أكثر؟",
    options: [
      { text: "الترافع والدفاع عن المظلومين", careerId: 'lawyer' },
      { text: "تحليل النصوص وإصدار الأحكام", careerId: 'judicial-attache' },
      { text: "تنظيم العقود وتوثيق المعاملات", careerId: 'adoul' },
      { text: "الإدارة الميدانية وقيادة الفريق", careerId: 'qaid' }
    ]
  },
  {
    id: 2,
    question: "كيف تفضل أن يكون يوم عملك؟",
    options: [
      { text: "مليء بالحركة والتنقل بين المحاكم", careerId: 'lawyer' },
      { text: "هادئ في مكتب خاص مع دراسة الملفات", careerId: 'judicial-attache' },
      { text: "استقبال المواطنين في مكتب التوثيق", careerId: 'adoul' },
      { text: "في الميدان مع السلطات المحلية", careerId: 'qaid' }
    ]
  },
  {
    id: 3,
    question: "ما هي المواد القانونية التي استمتعت بدراستها أكثر؟",
    options: [
      { text: "القانون الجنائي والمسطرة الجنائية", careerId: 'judicial-attache' },
      { text: "القانون التجاري وقانون الشركات", careerId: 'finance-administrator' },
      { text: "القانون الإداري والحكامة", careerId: 'qaid' },
      { text: "قانون الأسرة والمواريث", careerId: 'adoul' }
    ]
  },
  {
    id: 4,
    question: "ما هي المهارة التي تتقنها أكثر؟",
    options: [
      { text: "الخطابة والإقناع", careerId: 'lawyer' },
      { text: "الحياد والموضوعية", careerId: 'judicial-attache' },
      { text: "الدقة في صياغة العقود", careerId: 'adoul' },
      { text: "اتخاذ القرارات السريعة", careerId: 'qaid' }
    ]
  },
  {
    id: 5,
    question: "ما هو مستواك الدراسي الحالي أو المستهدف؟",
    options: [
      { text: "الإجازة فقط", careerId: 'lawyer' },
      { text: "الماستر فما فوق", careerId: 'judicial-attache' },
      { text: "دكتوراه الدولة", careerId: 'finance-administrator' },
      { text: "لا يهم، المهم هو الكفاءة", careerId: 'qaid' }
    ]
  },
  {
    id: 6,
    question: "هل تفضل الاستقلالية في العمل أم التبعية الإدارية؟",
    options: [
      { text: "الاستقلالية التامة (مهنة حرة)", careerId: 'lawyer' },
      { text: "العمل ضمن مؤسسة قضائية", careerId: 'judicial-attache' },
      { text: "العمل ضمن سلك الوظيفة العمومية", careerId: 'finance-administrator' },
      { text: "العمل في سلك الأمن", careerId: 'police-officer' }
    ]
  },
  {
    id: 7,
    question: "كيف تتعامل مع الضغوط الكبيرة؟",
    options: [
      { text: "أواجهها بجرأة وتحدي", careerId: 'police-officer' },
      { text: "أتعامل معها بهدوء وحكمة", careerId: 'judicial-attache' },
      { text: "أنظم وقتي بدقة لتجاوزها", careerId: 'finance-administrator' },
      { text: "أستشير زملائي للوصول لحل", careerId: 'adoul' }
    ]
  },
  {
    id: 8,
    question: "ما مدى اهتمامك بالجانب المالي ؟",
    options: [
      { text: "هو هدفي الأساسي من المهنة", careerId: 'lawyer' },
      { text: "يهمني الاستقرار المادي والراتب الثابت", careerId: 'judicial-attache' },
      { text: "يهمني خدمة المجتمع أكثر من المال", careerId: 'police-officer' },
      { text: "أبحث عن توازن بين الربح والخدمة", careerId: 'adoul' }
    ]
  },
  {
    id: 9,
    question: "هل تحب العمل الجماعي أم الفردي؟",
    options: [
      { text: "أحب قيادة فريق عمل", careerId: 'qaid' },
      { text: "أفضل العمل الفردي المركز", careerId: 'judicial-attache' },
      { text: "أحب التواصل مع مختلف فئات المجتمع", careerId: 'lawyer' },
      { text: "أفضل العمل في مكتب مع مساعدين", careerId: 'adoul' }
    ]
  },
  {
    id: 10,
    question: "ما هو طموحك النهائي في مسارك المهني؟",
    options: [
      { text: "أن أكون محامياً مشهوراً", careerId: 'lawyer' },
      { text: "أن أصل إلى أعلى مراتب القضاء", careerId: 'judicial-attache' },
      { text: "أن أكون مسؤولاً كبيراً في الإدارة", careerId: 'qaid' },
      { text: "أن أكون خبيراً قانونياً دولياً", careerId: 'finance-administrator' }
    ]
  }
];

const masterPrograms = [
  {
    id: 'legal-judicial',
    title: "ماستر المهن القانونية والقضائية",
    description: "يهدف هذا الماستر إلى تكوين أطر عليا متخصصة في المهن القانونية والقضائية، وتعميق المعارف في المساطر والمهارات العملية.",
    requirements: [
      "الحصول على شهادة الإجازة في القانون الخاص.",
      "اكتساب معارف في المواد الأساسية للقانون الخاص وبعض مواد القانون العام.",
      "دراسة الملف (التوفر على ميزة واحدة على الأقل).",
      "اجتياز اختبار كتابي ومقابلة شفوية."
    ],
    prospects: [
      "قطاع العدالة (القضاء، المحاماة، التوثيق، الاستشارة، العدول، المفوضين القضائيين).",
      "إدارات السجون، الأمن، والداخلية.",
      "القطاع الخاص، والتسجيل في سلك الدكتوراه."
    ],
    subjects: ["القضاء المدني", "القضاء الجنائي", "قضاء الأسرة", "القضاء التجاري", "القضاء الإداري", "المهارات الحياتية", "قانون الرقمنة والذكاء الاصطناعي"],
    faculties: ["كلية الحقوق السويسي - الرباط", "كلية الحقوق أكدال - الرباط", "كلية الحقوق عين الشق - الدار البيضاء", "كلية الحقوق طنجة", "كلية الحقوق مراكش"]
  },
  {
    id: 'civil-economic',
    title: "ماستر القانون المدني الاقتصادي",
    description: "يركز على الجوانب المدنية في المعاملات الاقتصادية والمالية، وتعميق النظرية العامة للالتزامات والعقود.",
    requirements: [
      "الإجازة في الدراسات الأساسية.",
      "معارف في: القانون المدني، العقود الخاصة، المسطرة المدنية، التجاري.",
      "دراسة الملف (ميزة واحدة على الأقل، ونقط جيدة في مواد التخصص).",
      "اجتياز اختبار كتابي ومقابلة شفوية."
    ],
    prospects: [
      "إطار قانوني في القطاع العام (القضاء، الإدارات).",
      "المهن الحرة (المحاماة، التوثيق، الاستشارة).",
      "ولوج الشركات والمقاولات، ومتابعة البحث العلمي."
    ],
    subjects: ["مصادر الالتزام", "القانون العقاري المعمق", "قانون الضمانات", "القانون التجاري المعمق", "القانون الاقتصادي"],
    faculties: ["كلية الحقوق سطات", "كلية الحقوق فاس", "كلية الحقوق مكناس"]
  },
  {
    id: 'contracts-real-estate',
    title: "ماستر منازعات العقود والعقار والتعمير",
    description: "تخصص دقيق يعالج الإشكالات القانونية المرتبطة بالعقار والتعمير والمنازعات الناشئة عن العقود.",
    requirements: [
      "الإجازة في القانون الخاص أو القانون العام.",
      "دراسة الملف (الاعتماد على المعدل العام لسنوات الإجازة).",
      "اجتياز اختبار كتابي ومقابلة شفوية."
    ],
    prospects: [
      "أطر عليا متخصصة ومستشارين قانونيين في القطاعين العام والخاص.",
      "خلق مقاولات خاصة، والبحث الأكاديمي في مجال الاستثمارات العقارية."
    ],
    subjects: ["منازعات التحفيظ العقاري", "القانون المدني المعمق", "قانون التعمير والتجزئات", "الحقوق العينية"],
    faculties: ["كلية الحقوق تطوان", "كلية الحقوق طنجة", "كلية الحقوق وجدة"]
  },
  {
    id: 'business-law',
    title: "ماستر قانون المقاولة والأعمال",
    description: "يهدف إلى تكوين متخصصين في قانون الأعمال والشركات، ومواكبة المقاولة في جوانبها القانونية والمالية.",
    requirements: [
      "الإجازة في القانون.",
      "معارف في: القانون التجاري، الشركات، صعوبات المقاولة، البنكي والمالي.",
      "دراسة الملف (الأولوية للناجحين في الدورة العادية، التمكن من اللغات).",
      "اجتياز اختبار كتابي ومقابلة شفوية."
    ],
    prospects: [
      "القطاع الخاص (تأمين، بنوك، مستشار قانوني).",
      "القطاع العام (القضاء التجاري، الإدارات العمومية).",
      "المهن الحرة ومتابعة سلك الدكتوراه."
    ],
    subjects: ["التجاري المعمق", "المدني المعمق", "الشغل المعمق", "القانون البنكي", "صعوبات المقاولة"],
    faculties: ["كلية الحقوق السويسي - الرباط", "كلية الحقوق عين الشق - الدار البيضاء", "كلية الحقوق القنيطرة", "كلية الحقوق أكادير"]
  },
  {
    id: 'public-finance',
    title: "ماستر تدبير المالية العمومية",
    description: "تخصص يجمع بين القانون والاقتصاد والتدبير المالي العمومي، ويهدف لتكوين أطر في تدبير المال العام.",
    requirements: [
      "الإجازة في القانون أو الاقتصاد أو التدبير.",
      "رصيد معرفي في المالية العمومية.",
      "دراسة الملف (ميزة واحدة على الأقل).",
      "اختبار كتابي ومقابلة باللغتين العربية والفرنسية."
    ],
    prospects: [
      "الإدارات والمقاولات العمومية، الجماعات الترابية.",
      "المحاكم الإدارية والمالية، هيئات التقنين والحكامة.",
      "القطاع الخاص والمؤسسات المالية."
    ],
    subjects: ["القانون الإداري", "تدبير مالية الدولة", "النظام الجبائي", "المحاسبة العمومية", "القضاء المالي"],
    faculties: ["كلية الحقوق سلا", "كلية الحقوق أكدال - الرباط", "كلية الحقوق مراكش"]
  },
  {
    id: 'constitutional-political',
    title: "ماستر الدراسات الدستورية والسياسية والإدارية",
    description: "يركز على تحليل النظم السياسية والدستورية والسياسات العمومية والإدارية.",
    requirements: [
      "الإجازة في القانون العام أو العلوم السياسية.",
      "مهارات تواصلية باللغات الأجنبية.",
      "دراسة الملف، اختبار كتابي ومقابلة."
    ],
    prospects: [
      "القطاع العام (الوزارات، البرلمان، الجماعات الترابية).",
      "القطاع الخاص والمنظمات غير الحكومية.",
      "سلك الدكتوراه."
    ],
    subjects: ["الدستوري المعمق", "علم السياسة", "تحليل السياسات", "المنازعات الدستورية", "التدبير العمومي"],
    faculties: ["كلية الحقوق أكدال - الرباط", "كلية الحقوق السويسي - الرباط", "كلية الحقوق فاس"]
  },
  {
    id: 'disputes-law',
    title: "ماستر قانون المنازعات",
    description: "يهدف إلى ضبط مختلف أنواع المنازعات (مدنية، جنائية، إدارية، تجارية) والمساطر المرتبطة بها.",
    requirements: [
      "الإجازة في القانون الخاص أو العام.",
      "تكوين لغوي متين.",
      "دراسة الملف، اختبار كتابي، ومقابلة شفوية."
    ],
    prospects: [
      "الإدارات العمومية، المقاولات العامة والخاصة.",
      "المهن الحرة والقضائية، متابعة سلك الدكتوراه."
    ],
    subjects: ["المدني المعمق", "الجنائي المعمق", "الإداري المعمق", "التنظيم القضائي", "القضاء الإداري"],
    faculties: ["كلية الحقوق المحمدية", "كلية الحقوق سطات", "كلية الحقوق القنيطرة"]
  },
  {
    id: 'cyber-criminal',
    title: "ماستر العلوم الجنائية والأمن السيبراني",
    description: "تخصص حديث يجمع بين القانون الجنائي الكلاسيكي والتحديات الرقمية والجرائم الإلكترونية.",
    requirements: [
      "الإجازة في القانون الخاص.",
      "الإلمام بالتقنيات الرقمية واللغات.",
      "دراسة الملف واختبار كتابي."
    ],
    prospects: [
      "الأمن الوطني، الدرك الملكي (خلايا الجرائم الإلكترونية).",
      "مستشار في الأمن الرقمي للشركات.",
      "القضاء المتخصص في الجرائم المالية والإلكترونية."
    ],
    subjects: ["القانون الجنائي المعمق", "المسطرة الجنائية", "الجرائم الإلكترونية", "الأمن السيبراني", "الأدلة الرقمية"],
    faculties: ["كلية الحقوق طنجة", "كلية الحقوق المحمدية"]
  }
];

const masterQuizQuestions = [
  {
    id: 1,
    question: "ما هو الفرع القانوني الذي تميل إليه أكثر؟",
    options: [
      { text: "القانون الخاص (مدني، تجاري، عقار)", score: { 'legal-judicial': 2, 'civil-economic': 2, 'contracts-real-estate': 2, 'business-law': 2, 'disputes-law': 1, 'cyber-criminal': 1 } },
      { text: "القانون العام (إداري، دستوري، مالية)", score: { 'public-finance': 2, 'constitutional-political': 2, 'disputes-law': 1 } }
    ]
  },
  {
    id: 2,
    question: "ما هي المادة التي حصلت فيها على أعلى نقطة؟",
    options: [
      { text: "القانون المدني / الالتزامات والعقود", score: { 'civil-economic': 3, 'legal-judicial': 2, 'contracts-real-estate': 2 } },
      { text: "القانون الجنائي", score: { 'cyber-criminal': 3, 'legal-judicial': 2, 'disputes-law': 1 } },
      { text: "القانون التجاري / الشركات", score: { 'business-law': 3, 'civil-economic': 1 } },
      { text: "القانون الإداري / الدستوري", score: { 'constitutional-political': 3, 'public-finance': 1 } },
      { text: "المالية العمومية", score: { 'public-finance': 3 } }
    ]
  },
  {
    id: 3,
    question: "ما هي الميزة (Mention) التي حصلت عليها في تلك المادة؟",
    options: [
      { text: "مقبول (10-12)", score: {} },
      { text: "مستحسن (12-14)", score: { all: 1 } },
      { text: "جيد (14-16)", score: { all: 2 } },
      { text: "جيد جداً (16 فما فوق)", score: { all: 3 } }
    ]
  },
  {
    id: 4,
    question: "ما هو طموحك المهني الأساسي؟",
    options: [
      { text: "القضاء أو المحاماة", score: { 'legal-judicial': 3, 'disputes-law': 2, 'civil-economic': 1 } },
      { text: "العمل في الشركات والأبناك", score: { 'business-law': 3, 'civil-economic': 2 } },
      { text: "الإدارة العمومية أو الجماعات", score: { 'public-finance': 2, 'constitutional-political': 2 } },
      { text: "البحث الأكاديمي والتدريس", score: { 'constitutional-political': 2, 'civil-economic': 1 } },
      { text: "الأمن أو مكافحة الجريمة", score: { 'cyber-criminal': 3 } }
    ]
  },
  {
    id: 5,
    question: "هل لديك استعداد للدراسة في مدينة أخرى لتقوية حظوظك؟",
    options: [
      { text: "نعم، مستعد تماماً", score: { all: 1 } },
      { text: "أفضل البقاء في كليتي الحالية", score: {} }
    ]
  }
];

const careers = [
  {
    id: 'judicial-attache',
    title: "الملحقين القضائيين",
    description: "السلك القضائي هو العمود الفقري للعدالة. الملحقون القضائيون هم قضاة المستقبل الذين يتم تكوينهم بالمعهد العالي للقضاء.",
    degree: "الإجازة أو الماستر",
    ageLimit: "45 سنة كحد أقصى",
    institution: "المجلس الأعلى للسلطة القضائية",
    details: {
      specializations: [
        "القانون الخاص: شهادة الإجازة في القانون الخاص، أو الماستر (أو الماستر المتخصص/دبلوم الدراسات العليا) في العلوم القانونية المشفوع بالإجازة في القانون الخاص.",
        "الشريعة: شهادة الإجازة في الشريعة، أو الماستر المشفوع بالإجازة في الشريعة أو القانون الخاص."
      ],
      generalConditions: [
        "ألا يتجاوز عمر المترشح 45 سنة في فاتح يناير 2026.",
        "التمتع بالحقوق الوطنية والقدرة البدنية اللازمة لممارسة مهام القضاء.",
        "استيفاء الشروط العلمية (الدبلومات) المذكورة أعلاه.",
        "تخصص نسبة 25% من المناصب لفائدة مكفولي الأمة، المقاومين، وقدماء العسكريين والمحاربين، بينما تخصص نسبة 7% لذوي الاحتياجات الخاصة."
      ],
      registration: {
        link: "https://attaches.cspj.ma",
        deadline: "16 فبراير 2026 على الساعة 16:30 زوالاً",
        documents: [
          "طلب الترشيح",
          "نسخة من البطاقة الوطنية",
          "نسخة من الدبلوم",
          "كشوف النقط للسنوات الجامعية",
          "صورة فوتوغرافية حديثة",
          "للموظفين: ترخيص نهائي وغير مشروط من الإدارة المشغلة"
        ]
      },
      exams: {
        written: [
          "القانون المدني",
          "القانون الجنائي",
          "مدونة الأسرة",
          "مدونة الشغل",
          "موضوع عام",
          "اختبار في اللغات الأجنبية (الفرنسية، الإنجليزية، أو الإسبانية)"
        ],
        oral: [
          "المسطرة المدنية والجنائية",
          "مدونة التجارة والتأمينات"
        ],
        threshold: "عتبة النجاح: 170 نقطة على الأقل في الكتابي، شريطة عدم الحصول على نقطة إقصائية (أقل من 5/20)."
      },
      selection: "سيتم حصر عدد المترشحين المقبولين لاجتياز الامتحان الكتابي في عشرة أضعاف عدد المناصب المتبارى بشأنها (حوالي 3000 مترشح)، مع الأولوية لحاملي الماستر.",
      previousExams: [
        { year: "2026", title: "امتحان الملحقين القضائيين - من دورة 1988", link: "" },
      ]
    }
  },
  {
    id: 'qaid',
    title: "مباراة القياد",
    description: "ولوج السلك العادي للمعهد الملكي للإدارة الترابية لتكوين رجال السلطة (القياد).",
    degree: "الإجازة أو الماستر",
    ageLimit: "35 سنة كحد أقصى",
    institution: "وزارة الداخلية",
    details: {
      generalConditions: [
        "البالغين 35 سنة على الأكثر عند تاريخ إجراء المباراة.",
        "الحاصلين على دبلوم يخول التوظيف في سلم الأجور رقم 10 على الأقل.",
        "الطول: 1.60 متر على الأقل للإناث، و1.70 متر على الأقل للذكور.",
        "المستوفين لشروط القدرة البدنية."
      ],
      registration: {
        link: "https://concours.interieur.gov.ma",
        deadline: "من 27 يناير إلى 05 فبراير 2026 (12:00 زوالاً)",
        documents: [
          "استمارة طلب المشاركة موقعة",
          "نسخة لأصل الشواهد العلمية",
          "نسخة لأصل كشف النقط (الإجازة والماستر)",
          "نسخة لأصل البطاقة الوطنية",
          "شهادة طبية تتضمن قياس الطول",
          "صورة شخصية حديثة",
          "ترخيص الإدارة (للموظفين)"
        ],
        rejectionCriteria: [
          "عدم استيفاء شرط التسجيل المسبق بالموقع الإلكتروني",
          "عدم إرفاق الوثائق المطلوبة أو عدم تطابقها مع المعلومات المضمنة",
          "الملفات المودعة خارج الآجال",
          "المترشحون الذين لم يتمكنوا في مناسبتين سابقتين من اجتياز المباراة بنجاح"
        ]
      },
      exams: {
        preSelection: [
          "اختبار باللغة العربية حول مستجدات الحكامة والتنمية الترابية (3س، معامل 3)",
          "اختبار بلغة أجنبية حول مستجدات قانونية أو سياسية أو اقتصادية (3س، معامل 3)",
          "استبيان متعدد الاختيارات حول الثقافة العامة والمؤسسات الوطنية (1.5س، معامل 4)"
        ],
        finalSelection: [
          "اختبار بسيكو-تقني تقيمي",
          "اختبار وضعية محاكاة (فردية وجماعية) لتقييم التواصل والسلوك",
          "اختبار شفوي (معامل 10)"
        ]
      },
      selection: "يتم الانتقاء الأولي بناءً على الشواهد العلمية، التجربة المهنية، والسن.",
      previousExams: [
        { year: "2024", title: "مباراة القياد - دورة 2024", link: "#" },
        { year: "2023", title: "مباراة القياد - دورة 2023", link: "#" }
      ]
    }
  },
  {
    id: 'lawyer',
    title: "المحاماة",
    description: "مهنة حرة، مستقلة، تساعد القضاء، وتساهم في تحقيق العدالة، والمحامون جزء من أسرة القضاء.",
    degree: "الإجازة في القانون",
    ageLimit: "45 سنة كحد أقصى",
    institution: "وزارة العدل / هيئات المحامين",
    details: {
      generalConditions: [
        "أن يكون مغربياً أو من مواطني دولة تربطها بالمغرب اتفاقية تعامل بالمثل.",
        "بالغاً من العمر 21 سنة ومتمتعاً بحقوقه الوطنية والمدنية.",
        "حاصلاً على شهادة الإجازة في العلوم القانونية.",
        "حاصلاً على شهادة الأهلية لممارسة مهنة المحاماة.",
        "ألا يكون مداناً قضائياً أو تأديبياً بأفعال منافية للشرف."
      ],
      stages: [
        "الحصول على شهادة الإجازة في العلوم القانونية.",
        "الإعلان عن فتح الترشح لمباراة المحاماة (كل 4 سنوات تقريباً).",
        "التسجيل المعلوماتي عبر بوابة وزارة العدل (www.justice.gov.ma).",
        "اجتياز الاختبارات الكتابية والشفوية.",
        "الحصول على شهادة الأهلية والتقييد في إحدى الهيئات.",
        "اجتياز التدريب لمدة سنتين."
      ],
      exams: {
        written: [
          "موضوع في القانون المدني أو الإداري مع المسطرة المدنية",
          "موضوع في القانون الجنائي مع المسطرة الجنائية",
          "موضوع عام (اجتماعي، اقتصادي، قانوني، ثقافي)"
        ],
        oral: [
          "مدونة الأسرة أو المادة الاجتماعية أو التجارية",
          "المسطرة المدنية أو الجنائية",
          "التنظيم القضائي",
          "القانون المنظم لمهنة المحاماة وتقاليدها"
        ],
        previousExams: [
          { year: "2023", title: "امتحان الأهلية لمزاولة مهنة المحاماة - دورة 2023", link: "#" },
          { year: "2022", title: "امتحان الأهلية لمزاولة مهنة المحاماة - دورة 2022", link: "#" }
        ]
      }
    }
  },
  {
    id: 'judicial-officer',
    title: "المفوضين القضائيين",
    description: "مساعد للقضاء يمارس مهنة حرة، يتولى مهام التبليغ والتنفيذ.",
    degree: "الإجازة في الحقوق/الشريعة",
    ageLimit: "25 إلى 45 سنة",
    institution: "وزارة العدل / الهيئة الوطنية",
    details: {
      generalConditions: [
        "الجنسية المغربية.",
        "السن بين 25 و45 سنة.",
        "الإجازة في الحقوق أو الشريعة.",
        "وضعية سليمة تجاه الخدمة العسكرية.",
        "التمتع بالحقوق المدنية والقدرة البدنية.",
        "خلو السجل العدلي من جرائم الأموال أو الجنايات."
      ],
      training: {
        duration: "6 أشهر",
        phases: [
          "3 أشهر بالمعهد العالي للقضاء (دراسة وأشغال تطبيقية)",
          "شهر ونصف تدريب بكتابة ضبط المحاكم",
          "شهر ونصف تدريب ميداني بمكاتب المفوضين"
        ],
        content: [
          "القواعد العامة للتبليغ والتنفيذ",
          "التنظيم القضائي والمبادئ العامة للتقاضي",
          "تحرير المحاضر والوثائق والمعاينات",
          "أخلاقيات المهنة ومسؤولية المفوض",
          "توظيف التقنيات الحديثة في تدبير المكتب",
          "مساطر الحجز والبيوعات القضائية"
        ]
      },
      exemptions: "يعفى من المباراة (في حدود الثلث): المنتدبون القضائيون (10 سنوات عمل) والمحررون/كتاب الضبط (15 سنة عمل + إجازة)."
    }
  },
  {
    id: 'finance-administrator',
    title: "متصرفي وزارة المالية",
    description: "توظيف متصرفين من الدرجة الثانية بوزارة الاقتصاد والمالية للمساهمة في تنزيل السياسات العمومية والمالية للدولة.",
    degree: "الماستر أو الماستر المتخصص",
    ageLimit: "45 سنة كحد أقصى",
    institution: "وزارة الاقتصاد والمالية",
    details: {
      specializations: [
        "العلوم الاقتصادية والتدبيرية (640 منصب): الافتحاص، التدبير المالي، البنك، مالية المقاولات، الاقتصاد القياسي، الاقتصاد الرقمي.",
        "العلوم القانونية (126 منصب): قانون الأعمال، القانون المدني، قانون العقود والعقار، المهن القضائية والقانونية، قانون المنازعات.",
        "العلوم الإدارية والمالية (24 منصب): المالية العامة، القانون الإداري، العلوم والتقنيات الضريبية.",
        "الموارد البشرية (11 منصب): تدبير الموارد البشرية.",
        "علوم الإعلام (4 مناصب): تدبير المعلومات."
      ],
      generalConditions: [
        "الجنسية المغربية.",
        "السن: 45 سنة على الأكثر في فاتح يناير من سنة المباراة.",
        "الحصول على الماستر أو الماستر المتخصص أو دبلوم الدراسات العليا المعمقة/المتخصصة في التخصصات المطلوبة.",
        "تخصيص 25% من المناصب لمكفولي الأمة، المقاومين، وقدماء العسكريين والمحاربين.",
        "تخصيص 7% من المناصب للأشخاص في وضعية إعاقة."
      ],
      registration: {
        link: "https://e-recrutement.finances.gov.ma",
        deadline: "9 أبريل 2025 على الساعة 16:30 زوالاً",
        documents: [
          "نسخة من بطاقة التعريف الوطنية",
          "نسخة من الدبلوم المطلوب",
          "سيرة ذاتية (CV) تحمل صورة المترشح ومعطيات التواصل",
          "نسخة من قرار المعادلة (للشواهد الأجنبية أو الخاصة)",
          "شهادة الإعاقة (بالنسبة للأشخاص المعاقين)",
          "شهادة تثبت صفة مقاوم أو مكفول الأمة (عند الاقتضاء)",
          "ترخيص الإدارة النهائي (للموظفين)",
          "شهادة التخصص (إذا لم يذكر التخصص في الدبلوم)"
        ],
        rejectionCriteria: [
          "عدم التسجيل الإلكتروني في البرمجية المعدة لذلك",
          "كل ترشيح ناقص أو تم تحميله بطريقة غير صحيحة",
          "تضمين معلومات خاطئة في طلب الترشيح"
        ]
      },
      exams: {
        written: [
          "اختبار كتابي: QCM أو سؤال عام أو أسئلة حول السياسات العمومية أو مجالات وزارة المالية (3 ساعات، معامل 2)"
        ],
        oral: [
          "اختبار شفوي: مناقشة مواضيع التخصص واختصاصات القطاع لتقييم القدرة على ممارسة المهام (15-30 دقيقة، معامل 2)"
        ],
        threshold: "عتبة التأهل للشفوي: الحصول على معدل لا يقل عن 12 من 20 في الاختبار الكتابي."
      },
      selection: "يتم الإعلان عن لوائح المترشحين ونتائج المباراة عبر موقع الوزارة وبوابة التشغيل العمومي، ويعتبر ذلك بمثابة استدعاء.",
      previousExams: [
        { year: "2024", title: "مباراة متصرفي وزارة المالية - دورة 2024", link: "#" },
        { year: "2023", title: "مباراة متصرفي وزارة المالية - دورة 2023", link: "#" }
      ]
    }
  },
  {
    id: 'adoul',
    title: "خطة العدالة (العدول)",
    description: "مهنة دينية وقانونية عريقة، تساهم في توثيق الحقوق والمعاملات وحفظ الأنساب.",
    degree: "الإجازة في الشريعة/القانون",
    ageLimit: "25 إلى 45 سنة",
    institution: "وزارة العدل",
    details: {
      generalConditions: [
        "أن يكون المترشح مغربياً.",
        "السن: بين 25 و45 سنة.",
        "الحصول على شهادة الإجازة في الشريعة أو القانون الخاص أو ما يعادلها.",
        "التمتع بالحقوق الوطنية والقدرة البدنية.",
        "خلو السجل العدلي من السوابق الجنائية."
      ],
      exams: {
        written: [
          "موضوع في القانون المدني (معامل 2)",
          "موضوع في مدونة الأسرة (معامل 2)",
          "موضوع في الفقه المالكي (معامل 2)",
          "موضوع عام (معامل 1)"
        ],
        oral: [
          "عرض حول التنظيم القضائي",
          "عرض حول قانون التوثيق العدلي",
          "اختبار في الحفظ من القرآن الكريم"
        ]
      },
      training: {
        duration: "سنة واحدة",
        phases: [
          "6 أشهر من التكوين النظري بالمعهد العالي للقضاء",
          "6 أشهر من التدريب الميداني بمكاتب العدول والمحاكم"
        ]
      }
    }
  },
  {
    id: 'judicial-expert',
    title: "الخبراء القضائيون",
    description: "مساعدون للقضاء يقدمون آراء تقنية وفنية في نزاعات معينة تتطلب خبرة متخصصة.",
    degree: "دبلوم تخصصي + تجربة",
    ageLimit: "غير محدد (يشترط التجربة)",
    institution: "وزارة العدل",
    details: {
      generalConditions: [
        "الجنسية المغربية.",
        "التمتع بالحقوق الوطنية والمدنية.",
        "خلو السجل العدلي من أي عقوبة جنائية أو جنحية.",
        "التوفر على تجربة مهنية لا تقل عن 5 سنوات في مجال التخصص.",
        "الإقامة الفعلية بدائرة نفوذ محكمة الاستئناف المطلوب التسجيل بها."
      ],
      stages: [
        "تقديم طلب التسجيل في لائحة الخبراء القضائيين.",
        "دراسة الملف من طرف لجنة مختصة بوزارة العدل.",
        "أداء القسم القانوني أمام محكمة الاستئناف.",
        "التسجيل النهائي في جدول الخبراء السنوي."
      ]
    }
  },
  {
    id: 'sworn-translator',
    title: "التراجمة المقبولون لدى المحاكم",
    description: "يتولون ترجمة الوثائق والمستندات الرسمية والشهادات أمام القضاء والإدارات.",
    degree: "الإجازة أو الماستر في الترجمة",
    ageLimit: "25 سنة على الأقل",
    institution: "وزارة العدل",
    details: {
      generalConditions: [
        "الجنسية المغربية.",
        "السن لا يقل عن 25 سنة.",
        "التمتع بالحقوق الوطنية والمدنية.",
        "خلو السجل العدلي من السوابق.",
        "الحصول على شهادة الإجازة في الترجمة أو لغة أجنبية معينة."
      ],
      exams: {
        written: [
          "ترجمة نص من العربية إلى اللغة الأجنبية المطلوبة",
          "ترجمة نص من اللغة الأجنبية إلى العربية",
          "موضوع حول التنظيم القضائي"
        ],
        oral: [
          "محادثة باللغة الأجنبية المختارة",
          "أسئلة حول قانون المهنة وأخلاقياتها"
        ]
      }
    }
  },
  {
    id: 'judicial-delegate',
    title: "المنتدبون القضائيون",
    description: "هيئة كتابة الضبط - يعتبر المنتدب القضائي من الأطر العليا بوزارة العدل، ويتولى مهام إدارية وقضائية هامة بالمحاكم.",
    degree: "الإجازة أو الماستر",
    ageLimit: "45 سنة كحد أقصى",
    institution: "وزارة العدل",
    details: {
      specializations: [
        "العلوم القانونية أو الشريعة (الإجازة أو الماستر).",
        "تخصصات أخرى حسب الحاجة (الاقتصاد، التدبير، المعلوميات)."
      ],
      generalConditions: [
        "الجنسية المغربية.",
        "السن: 18 سنة على الأقل و45 سنة على الأكثر.",
        "التمتع بالحقوق الوطنية والقدرة البدنية."
      ],
      exams: {
        written: [
          "اختبار في التخصص المطلوب (قانون خاص، قانون عام، إلخ).",
          "اختبار حول منظومة العدالة أو موضوع عام."
        ],
        oral: [
          "مناقشة مع لجنة حول الثقافة القانونية والمهام المنوطة بالمنتدب القضائي."
        ]
      }
    }
  },
  {
    id: 'judicial-editor',
    title: "المحررون القضائيون",
    description: "أطر متوسطة في هيئة كتابة الضبط، يساهمون في تحرير المحاضر وتدبير الملفات القضائية.",
    degree: "DEUG أو تقني متخصص",
    ageLimit: "45 سنة كحد أقصى",
    institution: "وزارة العدل",
    details: {
      generalConditions: [
        "الحصول على دبلوم الدراسات الجامعية العامة (DEUG) في القانون أو الشريعة.",
        "أو دبلوم تقني متخصص في تخصصات مطلوبة.",
        "السن بين 18 و45 سنة."
      ],
      exams: {
        written: [
          "أسئلة متعددة الاختيارات (QCM) أو موضوع في التخصص.",
          "اختبار في التنظيم القضائي."
        ],
        oral: [
          "مقابلة شفوية لتقييم المهارات التواصلية والمعرفية."
        ]
      },
      previousExams: [
        { year: "2024", title: "مباراة المحررين القضائيين - دورة 2024", link: "#" },
        { year: "2023", title: "مباراة المحررين القضائيين - دورة 2023", link: "#" }
      ]
    }
  },
  {
    id: 'police-officer',
    title: "ضباط وعمداء الشرطة",
    description: "العمل في سلك الأمن الوطني يتطلب خلفية قانونية صلبة لضمان تطبيق القانون وحماية المواطنين.",
    degree: "الإجازة (للضباط) / الماستر (للعمداء)",
    ageLimit: "30 إلى 35 سنة",
    institution: "المديرية العامة للأمن الوطني",
    details: {
      generalConditions: [
        "الجنسية المغربية.",
        "السن: بين 21 و30 سنة (للضباط) وبين 21 و35 سنة (للعمداء).",
        "الطول: 1.70 متر على الأقل للذكور و1.67 متر للإناث.",
        "حدة البصر: 15/20 على الأقل (بدون نظارات).",
        "خلو السجل العدلي من السوابق."
      ],
      exams: {
        written: [
          "موضوع عام حول القضايا السياسية أو الاقتصادية أو الاجتماعية.",
          "اختبار في القانون الجنائي أو المسطرة الجنائية."
        ],
        physical: [
          "اختبار الجري (1500 متر).",
          "اختبارات رياضية أخرى."
        ],
        oral: [
          "مقابلة مع لجنة لتقييم الشخصية والثقافة العامة."
        ]
      }
    }
  }
];

// ... existing imports

export default function CareersGuide() {
  const [activeTab, setActiveTab] = useState<'guide' | 'quiz' | 'master' | 'assessment'>('quiz');
  
  // Career Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<typeof careers[0] | null>(null);
  
  // Selection State
  const [selectedCareer, setSelectedCareer] = useState<typeof careers[0] | null>(null);
  const [selectedMaster, setSelectedMaster] = useState<typeof masterPrograms[0] | null>(null);

  // Master Quiz State
  const [masterQuizStep, setMasterQuizStep] = useState(0);
  const [masterQuizScores, setMasterQuizScores] = useState<Record<string, number>>({});
  const [masterQuizResult, setMasterQuizResult] = useState<typeof masterPrograms[0] | null>(null);
  const [showMasterQuiz, setShowMasterQuiz] = useState(false);

  // Calculator State
  const [semesters, setSemesters] = useState<string[]>(new Array(6).fill('pass'));
  const [years, setYears] = useState(3);
  const [calcResult, setCalcResult] = useState<{ score: number; level: string } | null>(null);

  const gradeCategories = [
    { label: "أقل من المعدل", value: "under", score: 9, isMention: false },
    { label: "مقبول", value: "pass", score: 11, isMention: false },
    { label: "مستحسن", value: "fair", score: 13, isMention: true },
    { label: "جيد", value: "good", score: 15, isMention: true },
    { label: "جيد جداً", value: "very_good", score: 17, isMention: true },
  ];

  const calculatedMentions = semesters.filter(s => {
    const cat = gradeCategories.find(c => c.value === s);
    return cat?.isMention;
  }).length;

  const handleQuizAnswer = (careerId: string) => {
    setQuizScores(prev => ({
      ...prev,
      [careerId]: (prev[careerId] || 0) + 1
    }));

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Calculate result
      const finalScores = { ...quizScores, [careerId]: (quizScores[careerId] || 0) + 1 };
      let bestCareerId = '';
      let maxScore = -1;

      Object.entries(finalScores).forEach(([id, score]) => {
        if (score > maxScore) {
          maxScore = score;
          bestCareerId = id;
        }
      });

      const result = careers.find(c => c.id === bestCareerId) || careers[0];
      setQuizResult(result);
    }
  };

  const handleMasterQuizAnswer = (score: Record<string, number>) => {
    const newScores = { ...masterQuizScores };
    Object.entries(score).forEach(([id, val]) => {
      if (id === 'all') {
        masterPrograms.forEach(p => {
          newScores[p.id] = (newScores[p.id] || 0) + val;
        });
      } else {
        newScores[id] = (newScores[id] || 0) + val;
      }
    });
    setMasterQuizScores(newScores);

    if (masterQuizStep < masterQuizQuestions.length - 1) {
      setMasterQuizStep(masterQuizStep + 1);
    } else {
      // Calculate result
      let bestMasterId = '';
      let maxScore = -1;

      Object.entries(newScores).forEach(([id, score]) => {
        if (score > maxScore) {
          maxScore = score;
          bestMasterId = id;
        }
      });

      const result = masterPrograms.find(m => m.id === bestMasterId) || masterPrograms[0];
      setMasterQuizResult(result);
    }
  };

  const calculateMasterChance = () => {
    const semesterScores = semesters.map(s => gradeCategories.find(c => c.value === s)?.score || 10);
    const avg = semesterScores.reduce((a, b) => a + b, 0) / 6;
    let score = avg * 10;
    score += calculatedMentions * 5;
    if (years === 3) score += 10;
    
    let level = "ضعيفة";
    if (score > 140) level = "عالية جداً";
    else if (score > 125) level = "جيدة";
    else if (score > 115) level = "متوسطة";

    setCalcResult({ score, level });
  };

  const resetMasterQuiz = () => {
    setMasterQuizStep(0);
    setMasterQuizScores({});
    setMasterQuizResult(null);
    setShowMasterQuiz(true);
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizScores({});
    setQuizResult(null);
  };

  return (
    <div className="py-2 space-y-8">
      <div className="pt-2"></div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 px-4 overflow-x-auto no-scrollbar pb-2">
        {[
          { id: 'quiz', name: 'اختبار الميول', icon: Sparkles },
          { id: 'assessment', name: 'التقييم الشخصي', icon: CheckSquare },
          { id: 'guide', name: 'دليل المباريات', icon: Briefcase },
          { id: 'master', name: 'توجيه الماستر', icon: GraduationCap },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 whitespace-nowrap shadow-sm border",
              activeTab === tab.id
                ? "bg-amber-600 text-white shadow-amber-600/20 border-amber-600 scale-105"
                : "bg-[var(--card)] text-[var(--muted)] border-[var(--border)] hover:border-amber-500/30"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'assessment' && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <SelfAssessment />
          </motion.div>
        )}

        {activeTab === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto space-y-6 px-4"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-5xl font-serif font-bold text-[var(--primary)]">اكتشف مهنتك المستقبلية</h2>
              <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
                أجب على 10 أسئلة دقيقة لنساعدك في تحديد المسار القانوني الذي يتناسب مع شخصيتك وطموحاتك.
              </p>
            </div>

            <div className="bg-[var(--card)] rounded-3xl shadow-2xl border border-[var(--border)] p-6 md:p-12 relative overflow-hidden min-h-[400px] flex flex-col justify-center">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
              
              {!quizResult ? (
                <div className="relative z-10 space-y-6">
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }}
                      className="h-full bg-amber-500"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>السؤال {quizStep + 1} من {quizQuestions.length}</span>
                    <span>{Math.round(((quizStep + 1) / quizQuestions.length) * 100)}%</span>
                  </div>

                  <motion.div
                    key={quizStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-lg md:text-3xl font-serif font-bold text-[var(--primary)] leading-tight">
                      {quizQuestions[quizStep].question}
                    </h3>

                    <div className="grid grid-cols-1 gap-3">
                      {quizQuestions[quizStep].options.map((option, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.01, x: -2 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleQuizAnswer(option.careerId)}
                          className="p-4 rounded-xl border-2 border-[var(--border)] hover:border-amber-500/30 hover:bg-amber-50/50 dark:hover:bg-amber-900/20 text-right transition-all group flex items-center justify-between"
                        >
                          <span className="text-sm md:text-lg font-bold text-[var(--foreground)] group-hover:text-amber-700">{option.text}</span>
                          <ChevronLeft className="w-4 h-4 text-[var(--muted)] group-hover:text-amber-500" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative z-10 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Trophy className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[var(--muted)]">النتيجة المقترحة لك:</h3>
                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-[var(--primary)]">{quizResult.title}</h2>
                  </div>

                  <p className="text-sm md:text-base text-slate-600 max-w-lg mx-auto leading-relaxed italic">
                    "{quizResult.description}"
                  </p>

                  <div className="flex flex-col gap-3 justify-center pt-4">
                    <button
                      onClick={() => setSelectedCareer(quizResult)}
                      className="px-6 py-3 bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-all text-sm"
                    >
                      عرض تفاصيل المهنة
                    </button>
                    <button
                      onClick={resetQuiz}
                      className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      إعادة الاختبار
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'master' && (
          <motion.div
            key="master"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto space-y-12 px-4"
          >
            {/* Calculator Section */}
            <div className="bg-[var(--card)] rounded-[40px] shadow-2xl border border-[var(--border)] overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-8 text-white">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <CheckSquare className="w-7 h-7" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold">حاسبة الانتقاء الأولي للماستر</h2>
                </div>
                <p className="text-amber-100 text-sm md:text-base">قدر حظوظك في اجتياز عتبة الانتقاء بناءً على معايير كليات الحقوق المغربية.</p>
              </div>
              
              <div className="p-8 md:p-12 grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {semesters.map((grade, i) => (
                      <div key={i} className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">الفصل {i + 1}</label>
                        <select 
                          value={grade}
                          onChange={(e) => {
                            const newGrades = [...semesters];
                            newGrades[i] = e.target.value;
                            setSemesters(newGrades);
                          }}
                          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold text-[var(--primary)] text-sm"
                        >
                          {gradeCategories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">عدد الميزات (تلقائي)</label>
                      <div className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl font-bold text-[var(--primary)] text-center">
                        {calculatedMentions}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">مدة نيل الإجازة</label>
                      <select 
                        value={years}
                        onChange={(e) => setYears(parseInt(e.target.value))}
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold text-[var(--primary)]"
                      >
                        <option value={3}>3 سنوات (عادية)</option>
                        <option value={4}>4 سنوات</option>
                        <option value={5}>5 سنوات فما فوق</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={calculateMasterChance}
                    className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold shadow-xl shadow-amber-600/20 hover:bg-amber-700 transition-all flex items-center justify-center gap-3"
                  >
                    <RefreshCw className="w-5 h-5" />
                    احسب النتيجة
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center text-center space-y-6 bg-slate-50 rounded-[32px] p-8 border border-slate-100">
                  {calcResult ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      <div className="relative">
                        <svg className="w-40 h-40 transform -rotate-90">
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-slate-200"
                          />
                          <motion.circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={440}
                            initial={{ strokeDashoffset: 440 }}
                            animate={{ strokeDashoffset: 440 - (440 * Math.min(calcResult.score, 160)) / 160 }}
                            className="text-amber-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold text-[var(--primary)]">{Math.round(calcResult.score)}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">نقطة تقديرية</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-sm text-slate-500">حظوظك في الانتقاء:</p>
                        <div className={cn(
                          "px-6 py-3 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 shadow-sm",
                          calcResult.level === "عالية جداً" ? "bg-green-50 text-green-700 border border-green-100" :
                          calcResult.level === "جيدة" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                          calcResult.level === "متوسطة" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-red-50 text-red-700 border border-red-100"
                        )}>
                          <Trophy className="w-5 h-5" />
                          {calcResult.level}
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed italic">
                        * هذه النتيجة تقديرية بناءً على المعايير العامة، وقد تختلف من كلية لأخرى ومن ماستر لآخر.
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-24 h-24 bg-[var(--background)] rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <GraduationCap className="w-12 h-12 text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-bold">أدخل معدلاتك لحساب حظوظك</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Master Matchmaker Quiz / List */}
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-right">
                  <h2 className="text-2xl md:text-4xl font-serif font-bold text-[var(--primary)]">دليل الماستر الذكي</h2>
                  <p className="text-sm text-slate-500">استكشف تخصصات الماستر المتاحة أو خض الاختبار لتجد ما يناسبك.</p>
                </div>
                <button 
                  onClick={resetMasterQuiz}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-amber-600 transition-all flex items-center gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  ابدأ اختبار الميول (الماستر)
                </button>
              </div>

              {showMasterQuiz && !masterQuizResult ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[var(--card)] rounded-[40px] shadow-2xl border border-[var(--border)] p-8 md:p-12 relative overflow-hidden"
                >
                  <button 
                    onClick={() => setShowMasterQuiz(false)}
                    className="absolute top-6 left-6 p-2 rounded-full hover:bg-slate-100 text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="max-w-2xl mx-auto space-y-8">
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((masterQuizStep + 1) / masterQuizQuestions.length) * 100}%` }}
                        className="h-full bg-amber-500"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>السؤال {masterQuizStep + 1} من {masterQuizQuestions.length}</span>
                      <span>{Math.round(((masterQuizStep + 1) / masterQuizQuestions.length) * 100)}%</span>
                    </div>

                    <motion.div
                      key={masterQuizStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-8"
                    >
                      <h3 className="text-xl md:text-3xl font-serif font-bold text-[var(--primary)] leading-tight text-center">
                        {masterQuizQuestions[masterQuizStep].question}
                      </h3>

                      <div className="grid grid-cols-1 gap-4">
                        {masterQuizQuestions[masterQuizStep].options.map((option, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.02, x: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleMasterQuizAnswer(option.score)}
                            className="p-6 rounded-2xl border-2 border-slate-100 hover:border-amber-500/30 hover:bg-amber-50/50 text-right transition-all group flex items-center justify-between"
                          >
                            <span className="text-base md:text-xl font-bold text-slate-700 group-hover:text-amber-700">{option.text}</span>
                            <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-amber-500" />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ) : masterQuizResult ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[var(--card)] rounded-[40px] shadow-2xl border border-[var(--border)] p-8 md:p-12 text-center space-y-8"
                >
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Trophy className="w-12 h-12" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">الماستر الأكثر ملاءمة لمؤهلاتك:</h3>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-[var(--primary)]">{masterQuizResult.title}</h2>
                  </div>

                  <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed italic">
                    "{masterQuizResult.description}"
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    <button
                      onClick={() => {
                        setSelectedMaster(masterQuizResult);
                        setShowMasterQuiz(false);
                      }}
                      className="px-8 py-4 bg-amber-600 text-white rounded-2xl font-bold shadow-xl shadow-amber-600/20 hover:bg-amber-700 transition-all"
                    >
                      عرض تفاصيل الماستر
                    </button>
                    <button
                      onClick={resetMasterQuiz}
                      className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
                    >
                      <RotateCcw className="w-5 h-5" />
                      إعادة الاختبار
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {masterPrograms.map((master) => (
                    <motion.div
                      key={master.id}
                      whileHover={{ y: -8 }}
                      className="luxury-card p-6 flex flex-col relative overflow-hidden group cursor-pointer"
                      onClick={() => setSelectedMaster(master)}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[40px] -mr-8 -mt-8 transition-all group-hover:bg-amber-500/10" />
                      
                      <div className="relative flex-1 flex flex-col">
                        <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-amber-600 group-hover:text-white rounded-xl flex items-center justify-center shadow-inner transition-all duration-500 mb-6">
                          <GraduationCap className="w-6 h-6" />
                        </div>

                        <h3 className="text-xl font-serif font-bold text-[var(--primary)] mb-3 group-hover:text-amber-700 transition-colors">{master.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3 italic">
                          "{master.description}"
                        </p>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <MapPin className="w-3 h-3" />
                            <span>{master.faculties.length} كليات</span>
                          </div>
                          <span className="text-amber-600 text-xs font-bold flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                            التفاصيل
                            <ChevronLeft className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'guide' && (
          <motion.div
            key="guide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8 px-4"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-5xl font-serif font-bold text-[var(--primary)]">دليل المهن القانونية</h2>
              <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
                استكشف مختلف المسارات المهنية المتاحة لخريجي القانون في المغرب، مع تفاصيل دقيقة حول شروط الولوج والمباريات.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {careers.map((career) => (
                <motion.div
                  key={career.id}
                  whileHover={{ y: -4 }}
                  className="luxury-card p-5 flex flex-col relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-bl-[30px] -mr-6 -mt-6 transition-all group-hover:bg-amber-500/10" />
                  
                  <div className="relative flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-slate-50 text-slate-400 group-hover:bg-amber-600 group-hover:text-white rounded-lg flex items-center justify-center shadow-inner transition-all duration-500">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 text-[9px] font-bold rounded-full uppercase tracking-widest border border-amber-500/20">
                        {career.degree}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-[var(--primary)] mb-2 group-hover:text-amber-700 transition-colors">{career.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1 line-clamp-3 italic">
                      "{career.description}"
                    </p>

                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>{career.ageLimit}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Building2 className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[100px]">{career.institution}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => setSelectedCareer(career)}
                        className="w-full py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-amber-600 transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        تفاصيل المباراة
                        <ChevronLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Career Details Modal */}
      <AnimatePresence>
        {selectedCareer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCareer(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-[var(--card)] rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--secondary)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-600/20">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-[var(--primary)]">{selectedCareer.title}</h3>
                    <p className="text-xs text-[var(--muted)] font-bold uppercase tracking-widest">{selectedCareer.institution}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCareer(null)}
                  className="p-2 rounded-full hover:bg-[var(--card)] hover:shadow-md transition-all text-[var(--muted)] hover:text-red-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar" dir="rtl">
                {/* Overview Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-amber-600">
                    <Info className="w-6 h-6" />
                    <h4 className="text-xl font-bold">نظرة عامة</h4>
                  </div>
                  <p className="text-[var(--foreground)] leading-relaxed text-lg bg-amber-50/50 dark:bg-amber-900/10 p-6 rounded-3xl border border-amber-500/10">
                    {selectedCareer.description}
                  </p>
                </section>

                {/* Conditions Section */}
                <section className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-amber-600">
                      <UserCheck className="w-6 h-6" />
                      <h4 className="text-xl font-bold">شروط الترشيح</h4>
                    </div>
                    <ul className="space-y-3">
                      {selectedCareer.details.generalConditions?.map((condition, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{condition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-amber-600">
                      <GraduationCap className="w-6 h-6" />
                      <h4 className="text-xl font-bold">المؤهلات المطلوبة</h4>
                    </div>
                    <div className="p-6 rounded-3xl bg-[var(--secondary)] border border-[var(--border)] space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">الدبلوم:</span>
                        <span className="text-sm font-bold text-[var(--primary)]">{selectedCareer.degree}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">السن:</span>
                        <span className="text-sm font-bold text-[var(--primary)]">{selectedCareer.ageLimit}</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Registration & Exams */}
                <section className="grid md:grid-cols-2 gap-8">
                  {selectedCareer.details.registration && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-amber-600">
                        <ExternalLink className="w-6 h-6" />
                        <h4 className="text-xl font-bold">التسجيل والآجال</h4>
                      </div>
                      <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">آخر أجل:</span>
                          <span className="text-sm font-bold text-amber-400">{selectedCareer.details.registration.deadline}</span>
                        </div>
                        <a 
                          href={selectedCareer.details.registration.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-3 bg-amber-600 hover:bg-amber-700 rounded-xl transition-all text-sm font-bold"
                        >
                          بوابة التسجيل الإلكتروني
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedCareer.details.exams && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-amber-600">
                        <FileText className="w-6 h-6" />
                        <h4 className="text-xl font-bold">الاختبارات</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">الاختبارات الكتابية:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedCareer.details.exams.written?.map((exam, i) => (
                              <span key={i} className="px-3 py-1 bg-[var(--secondary)] border border-[var(--border)] rounded-lg text-[10px] text-[var(--muted)]">{exam}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Previous Exams Section */}
                {selectedCareer.details.previousExams && (
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 text-amber-600">
                      <History className="w-6 h-6" />
                      <h4 className="text-xl font-bold">الامتحانات السابقة</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedCareer.details.previousExams.map((exam, i) => (
                        <a 
                          key={i}
                          href={exam.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-all">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[var(--primary)]">{exam.title}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">سنة {exam.year}</p>
                            </div>
                          </div>
                          <Download className="w-5 h-5 text-slate-300 group-hover:text-amber-500" />
                        </a>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  المصدر: {selectedCareer.institution}
                </p>
                <div className="flex gap-2">
                  <button className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-amber-600 transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Master Details Modal */}
      <AnimatePresence>
        {selectedMaster && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMaster(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-[var(--card)] rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--secondary)]/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-600/20">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-[var(--primary)]">{selectedMaster.title}</h3>
                    <p className="text-xs text-[var(--muted)] font-bold uppercase tracking-widest">تفاصيل سلك الماستر</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedMaster(null)}
                  className="p-2 rounded-full hover:bg-[var(--secondary)] hover:shadow-md transition-all text-[var(--muted)] hover:text-red-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar" dir="rtl">
                {/* Overview Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-amber-600">
                    <Info className="w-6 h-6" />
                    <h4 className="text-xl font-bold">وصف الماستر</h4>
                  </div>
                  <p className="text-[var(--foreground)] leading-relaxed text-lg bg-amber-500/5 p-6 rounded-3xl border border-amber-500/10">
                    {selectedMaster.description}
                  </p>
                </section>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Requirements Section */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-3 text-amber-600">
                      <UserCheck className="w-6 h-6" />
                      <h4 className="text-xl font-bold">شروط الولوج</h4>
                    </div>
                    <ul className="space-y-3">
                      {selectedMaster.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-3 text-[var(--muted)] text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Prospects Section */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-3 text-amber-600">
                      <Briefcase className="w-6 h-6" />
                      <h4 className="text-xl font-bold">الآفاق المهنية</h4>
                    </div>
                    <ul className="space-y-3">
                      {selectedMaster.prospects.map((prospect, i) => (
                        <li key={i} className="flex items-start gap-3 text-[var(--muted)] text-sm">
                          <Trophy className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                          <span>{prospect}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                {/* Subjects Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-amber-600">
                    <BookOpen className="w-6 h-6" />
                    <h4 className="text-xl font-bold">المواد المدرسة</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMaster.subjects.map((subject, i) => (
                      <span key={i} className="px-4 py-2 bg-[var(--secondary)] border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] font-bold">
                        {subject}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Faculties Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-amber-600">
                    <Building2 className="w-6 h-6" />
                    <h4 className="text-xl font-bold">الكليات المتوفرة</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedMaster.faculties.map((faculty, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-bold text-slate-700">{faculty}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  دليل الماستر - اسأل القانون
                </p>
                <button 
                  onClick={() => setSelectedMaster(null)}
                  className="px-6 py-2 bg-amber-600 text-white rounded-xl font-bold text-sm"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
