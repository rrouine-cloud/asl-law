import { LawyerCase } from '../offlineDatabase';

export const extendedLawyerCases: LawyerCase[] = [
  {
    id: 'law-3',
    title: 'نزاع تجاري حول علامة مسجلة',
    type: 'commercial',
    description: 'شركة ناشئة تتهم شركة كبرى بتقليد علامتها التجارية وإرباك المستهلكين.',
    facts: 'شركة "كوزمو" للمشروبات اكتشفت أن شركة "كوزموس" الكبرى أطلقت منتجاً بنفس الألوان والتصميم تقريباً.',
    initialEvidence: ['صور المنتجين', 'شهادة تسجيل العلامة'],
    clientTrust: 75,
    isClientHonest: true,
    baseFees: 45000,
    investigation: {
      witnesses: [
        { name: 'خبير تسويق', testimony: 'التشابه يؤدي حتماً لتضليل المستهلك العادي.', isLying: false, cost: { money: 5000, energy: 20 } }
      ],
      evidence: [
        { title: 'فواتير التصميم', description: 'تثبت أن الشركة الناشئة سبقت الكبرى في التصميم.', isMisleading: false, cost: { money: 1000, energy: 10 } }
      ],
      laws: [
        { text: 'القانون 17.97 المتعلق بحماية الملكية الصناعية', relevance: 100, cost: { money: 0, energy: 15 } }
      ]
    },
    analysis: {
      qualifications: [
        { text: 'منافسة غير مشروعة وتقليد علامة تجارية', isCorrect: true, feedback: 'تكييف قانوني سليم.' }
      ],
      strategies: [
        { text: 'المطالبة بوقف التسويق فوراً وتعويض عن الضرر', impact: 35, feedback: 'إجراء استعجالي ضروري.' }
      ]
    },
    courtSession: {
      judgeMood: 45,
      opposingCounsel: 'مكتب محاماة دولي',
      events: [
        {
          trigger: 'الخصم يدعي أن العلامة "وصفية" ولا يمكن احتكارها',
          options: [
            { text: 'إثبات الطابع المميز للعلامة عبر شهادة التسجيل', type: 'evidence', impact: 25, feedback: 'القاضي رفض دفع الخصم.' }
          ]
        }
      ]
    },
    verdict: {
      winFeedback: 'تم الحكم بمنع الشركة الكبرى من استخدام التصميم وتعويض مادي.',
      lossFeedback: 'المحكمة اعتبرت التشابه غير كافٍ لإحداث خلط.',
      rewards: { budget: 60000, reputation: 30, energy: 15 }
    }
  },
  {
    id: 'law-4',
    title: 'طرد تعسفي لممثلة نقابية',
    type: 'labor',
    description: 'شركة نسيج تطرد عاملة بعد انتخابها مندوبة للأجراء.',
    facts: 'فاطمة تعمل منذ 10 سنوات، تم طردها بدعوى "تراجع المردودية" مباشرة بعد نشاطها النقابي.',
    initialEvidence: ['محضر انتخاب المناديب', 'رسالة الطرد'],
    clientTrust: 95,
    isClientHonest: true,
    baseFees: 12000,
    investigation: {
      witnesses: [
        { name: 'مفتش الشغل', testimony: 'الشركة رفضت كل محاولات الصلح والوساطة.', isLying: false, cost: { money: 0, energy: 25 } }
      ],
      evidence: [
        { title: 'تقييمات الأداء السابقة', description: 'تظهر أن مردودية فاطمة كانت دائماً ممتازة.', isMisleading: false, cost: { money: 500, energy: 10 } }
      ],
      laws: [
        { text: 'المادة 457 من مدونة الشغل (حماية المناديب)', relevance: 100, cost: { money: 0, energy: 20 } }
      ]
    },
    analysis: {
      qualifications: [
        { text: 'طرد تعسفي مرتبط بالنشاط النقابي', isCorrect: true, feedback: 'هذا النوع من الطرد له حماية خاصة.' }
      ],
      strategies: [
        { text: 'المطالبة بالرجوع للعمل أو تعويض مضاعف', impact: 40, feedback: 'القانون يحمي المناديب بصرامة.' }
      ]
    },
    courtSession: {
      judgeMood: 70,
      opposingCounsel: 'محامي الشركة',
      events: [
        {
          trigger: 'الشركة تدعي وجود أزمة اقتصادية تفرض تقليص العمال',
          options: [
            { text: 'إثبات أن فاطمة هي الوحيدة التي طردت', type: 'question', impact: 30, feedback: 'كشفت زيف ادعاء الأزمة.' }
          ]
        }
      ]
    },
    verdict: {
      winFeedback: 'حكم تاريخي بإعادة العاملة لعملها مع تعويض عن فترة التوقف.',
      lossFeedback: 'المحكمة قبلت مبررات الشركة الاقتصادية.',
      rewards: { budget: 25000, reputation: 40, energy: 10 }
    }
  },
  {
    id: 'law-5',
    title: 'نزاع حول إرث عقاري ضخم',
    type: 'family',
    description: 'أحد الورثة يطالب بإبطال عقد بيع قام به الأب قبل وفاته بدعوى "مرض الموت".',
    facts: 'الأب باع ضيعة فلاحية لابنه الأكبر بثمن بخس قبل وفاته بأسبوع وهو في غيبوبة.',
    initialEvidence: ['عقد البيع', 'شهادة طبية'],
    clientTrust: 60,
    isClientHonest: false,
    baseFees: 80000,
    investigation: {
      witnesses: [
        { name: 'الطبيب المعالج', testimony: 'المتوفى لم يكن في وعيه الكامل عند التوقيع.', isLying: false, cost: { money: 10000, energy: 30 } }
      ],
      evidence: [
        { title: 'كشف الحساب البنكي للابن', description: 'لا يظهر خروج مبلغ الثمن المذكور في العقد.', isMisleading: false, cost: { money: 5000, energy: 20 } }
      ],
      laws: [
        { text: 'المادة 344 من قانون الالتزامات والعقود (مرض الموت)', relevance: 100, cost: { money: 0, energy: 25 } }
      ]
    },
    analysis: {
      qualifications: [
        { text: 'إبطال عقد بيع بسبب مرض الموت والصورية', isCorrect: true, feedback: 'تحليل قانوني دقيق.' }
      ],
      strategies: [
        { text: 'الطعن في العقد وإجراء خبرة طبية وخطية', impact: 45, feedback: 'إجراءات حاسمة في قضايا الإرث.' }
      ]
    },
    courtSession: {
      judgeMood: 30,
      opposingCounsel: 'نقيب سابق للمحامين',
      events: [
        {
          trigger: 'الابن يقدم شهوداً يؤكدون وعي الأب عند التوقيع',
          options: [
            { text: 'مواجهة الشهود بالتقرير الطبي الرسمي', type: 'evidence', impact: 30, feedback: 'الشهود ارتبكوا أمام الحقيقة الطبية.' }
          ]
        }
      ]
    },
    verdict: {
      winFeedback: 'تم إبطال العقد وإعادة الضيعة للتركة.',
      lossFeedback: 'المحكمة اعتبرت العقد صحيحاً لعدم كفاية إثبات حالة الغيبوبة.',
      rewards: { budget: 150000, reputation: 50, energy: -20 }
    }
  },
  {
    id: 'law-6',
    title: 'قضية شيك بدون رصيد لشركة مقاولات',
    type: 'commercial',
    description: 'مقاول فرعي يطالب بمستحقاته عبر شيك تم رفضه من البنك.',
    facts: 'الشركة الكبرى سلمت شيكاً بمليون درهم، لكن الحساب كان مغلقاً.',
    initialEvidence: ['أصل الشيك', 'شهادة الرفض من البنك'],
    clientTrust: 85,
    isClientHonest: true,
    baseFees: 30000,
    investigation: {
      witnesses: [
        { name: 'مدير البنك', testimony: 'الحساب أغلق قبل إصدار الشيك بيومين.', isLying: false, cost: { money: 0, energy: 15 } }
      ],
      evidence: [
        { title: 'مراسلات إلكترونية', description: 'تثبت علم الشركة بعدم وجود رصيد.', isMisleading: false, cost: { money: 1000, energy: 10 } }
      ],
      laws: [
        { text: 'المادة 316 من مدونة التجارة', relevance: 100, cost: { money: 0, energy: 10 } }
      ]
    },
    analysis: {
      qualifications: [
        { text: 'إصدار شيك بدون رصيد مع سوء النية', isCorrect: true, feedback: 'جريمة تجارية وجنائية في آن واحد.' }
      ],
      strategies: [
        { text: 'رفع دعوى استعجالية للأداء مع الحجز التحفظي', impact: 35, feedback: 'ضمان استخلاص الدين.' }
      ]
    },
    courtSession: {
      judgeMood: 55,
      opposingCounsel: 'محامي الشركة الكبرى',
      events: [
        {
          trigger: 'الشركة تدعي أن الشيك كان "للضمان" فقط',
          options: [
            { text: 'تذكير المحكمة بأن الشيك أداة وفاء لا ضمان', type: 'objection', impact: 40, feedback: 'القانون المغربي يمنع شيك الضمان.' }
          ]
        }
      ]
    },
    verdict: {
      winFeedback: 'تم الحكم بالأداء مع التعويض والحجز على ممتلكات الشركة.',
      lossFeedback: 'المحكمة قبلت دفع الضمان وأحالت الملف للتحقيق.',
      rewards: { budget: 50000, reputation: 20, energy: 15 }
    }
  },
  {
    id: 'law-7',
    title: 'نزاع كراء مهني (عيادة طبية)',
    type: 'commercial',
    description: 'صاحب عمارة يطالب بإفراغ طبيب بدعوى الاحتياج للسكن.',
    facts: 'الطبيب يكتري المحل منذ 20 سنة، وصاحب الملك يريد تحويل العمارة لفندق.',
    initialEvidence: ['عقد الكراء', 'إنذار بالإفراغ'],
    clientTrust: 90,
    isClientHonest: true,
    baseFees: 20000,
    investigation: {
      witnesses: [
        { name: 'خبير عقاري', testimony: 'قيمة الأصل التجاري (السمعة) للعيادة ضخمة.', isLying: false, cost: { money: 4000, energy: 15 } }
      ],
      evidence: [
        { title: 'تصميم التهيئة الجديد', description: 'يظهر أن المنطقة تجارية ولا يسمح فيها بالسكن الفردي.', isMisleading: false, cost: { money: 1000, energy: 20 } }
      ],
      laws: [
        { text: 'القانون 49.16 المتعلق بكراء العقارات المخصصة للاستعمال التجاري أو الصناعي أو الحرفي', relevance: 100, cost: { money: 0, energy: 15 } }
      ]
    },
    analysis: {
      qualifications: [
        { text: 'رفض الإفراغ لعدم جدية سبب الاحتياج والمطالبة بالتعويض', isCorrect: true, feedback: 'الكراء المهني محمي بقوة القانون.' }
      ],
      strategies: [
        { text: 'المطالبة بتعويض كامل عن فقدان الأصل التجاري', impact: 30, feedback: 'حق قانوني مكفول.' }
      ]
    },
    courtSession: {
      judgeMood: 50,
      opposingCounsel: 'محامي صاحب الملك',
      events: [
        {
          trigger: 'الخصم يدعي أن الطبيب لم يؤدِ الكراء لشهرين',
          options: [
            { text: 'تقديم وصولات الأداء أو وصولات العرض العيني', type: 'evidence', impact: 25, feedback: 'أثبتت التزام موكلك بالأداء.' }
          ]
        }
      ]
    },
    verdict: {
      winFeedback: 'رفض دعوى الإفراغ لعدم جدية السبب.',
      lossFeedback: 'الحكم بالإفراغ مع تعويض بسيط.',
      rewards: { budget: 35000, reputation: 25, energy: 10 }
    }
  },
  {
    id: 'law-8',
    title: 'قضية تحفيظ عقاري متنازع عليه',
    type: 'commercial',
    description: 'نزاع حول ملكية بقعة أرضية في منطقة حضرية سريعة النمو.',
    facts: 'موكلك اشترى الأرض بعقد عرفي، لكن شخصاً آخر قدم تعرضاً بناءً على رسم ملكية قديم.',
    initialEvidence: ['عقد الشراء العرفي', 'شهادة الملكية المؤقتة'],
    clientTrust: 70,
    isClientHonest: true,
    baseFees: 50000,
    investigation: {
      witnesses: [
        { name: 'مقدم الحي', testimony: 'موكلك هو من يحوز الأرض فعلياً منذ سنوات.', isLying: false, cost: { money: 500, energy: 10 } }
      ],
      evidence: [
        { title: 'تصميم طبوغرافي', description: 'يحدد حدود الأرض بدقة.', isMisleading: false, cost: { money: 3000, energy: 15 } }
      ],
      laws: [
        { text: 'القانون 14.07 المتعلق بالتحفيظ العقاري', relevance: 100, cost: { money: 0, energy: 20 } }
      ]
    },
    analysis: {
      qualifications: [
        { text: 'دعوى استحقاق عقاري وتثبيت ملكية', isCorrect: true, feedback: 'تكييف صحيح للمساطر العقارية.' }
      ],
      strategies: [
        { text: 'المطالبة بإجراء خبرة عقارية وبحث بعين المكان', impact: 40, feedback: 'الحيازة الفعلية عنصر قوي في العقار غير المحفظ.' }
      ]
    },
    courtSession: {
      judgeMood: 40,
      opposingCounsel: 'محامي متخصص في العقار',
      events: [
        {
          trigger: 'المتعرض يقدم "رسم استمرار" يعود لـ 50 سنة',
          options: [
            { text: 'الطعن في رسم الاستمرار لعدم ذكر الحدود بدقة', type: 'objection', impact: 30, feedback: 'أضعفت حجة الخصم.' }
          ]
        }
      ]
    },
    verdict: {
      winFeedback: 'تم الحكم بصحة التعرض وتثبيت الملكية لموكلك.',
      lossFeedback: 'المحكمة اعتبرت رسم الاستمرار أقوى من العقد العرفي.',
      rewards: { budget: 70000, reputation: 35, energy: -10 }
    }
  },
  {
    id: 'law-9',
    title: 'قضية إهمال طبي في مصحة خاصة',
    type: 'criminal',
    description: 'سيدة فقدت بصرها جزئياً بعد عملية تجميل بسيطة.',
    facts: 'المصحة تدعي أن ما حدث هو "مضاعفات طبيعية"، لكن التقرير الأولي يشير لخطأ في التخدير.',
    initialEvidence: ['الملف الطبي', 'صور قبل وبعد العملية'],
    clientTrust: 85,
    isClientHonest: true,
    baseFees: 35000,
    investigation: {
      witnesses: [
        { name: 'ممرضة سابقة', testimony: 'طبيب التخدير كان مرهقاً جداً ذلك اليوم.', isLying: false, cost: { money: 2000, energy: 20 } }
      ],
      evidence: [
        { title: 'تقرير خبرة طبية مضادة', description: 'تؤكد وجود جرعة زائدة من المخدر.', isMisleading: false, cost: { money: 8000, energy: 25 } }
      ],
      laws: [
        { text: 'المادة 432 من القانون الجنائي (القتل أو الجرح الخطأ)', relevance: 100, cost: { money: 0, energy: 15 } }
      ]
    },
    analysis: {
      qualifications: [
        { text: 'المسؤولية الطبية المدنية والجنائية عن الخطأ المهني', isCorrect: true, feedback: 'تكييف شامل للمسؤولية.' }
      ],
      strategies: [
        { text: 'رفع دعوى تعويض مدني مع المتابعة الجنائية', impact: 45, feedback: 'الضغط الجنائي يسرع التعويض المدني.' }
      ]
    },
    courtSession: {
      judgeMood: 60,
      opposingCounsel: 'محامي شركة التأمين',
      events: [
        {
          trigger: 'الدفاع يدعي أن المريضة لم تحترم نصائح ما بعد العملية',
          options: [
            { text: 'إثبات أن الخطأ وقع داخل غرفة العمليات أصلاً', type: 'evidence', impact: 35, feedback: 'حجة قوية أبطلت دفع الخصم.' }
          ]
        }
      ]
    },
    verdict: {
      winFeedback: 'تم الحكم بتعويض ضخم وإدانة الطبيب بالحبس موقوف التنفيذ.',
      lossFeedback: 'المحكمة اعتبرت ما حدث مضاعفات طبية لا خطأ فيها.',
      rewards: { budget: 100000, reputation: 45, energy: -15 }
    }
  }
];
