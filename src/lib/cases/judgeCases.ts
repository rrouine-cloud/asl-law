import { JudgeCase } from '../offlineDatabase';

export const extendedJudgeCases: JudgeCase[] = [
  {
    id: 'jud-4',
    title: 'قضية تزوير في محررات رسمية',
    type: 'جنائي - تزوير',
    parties: { plaintiff: 'إدارة التسجيل العقاري', defendant: 'عدل (موثق تقليدي)' },
    facts: 'اتهام عدل بتزوير توقيع شخص متوفى في عقد بيع عقار لصالح أحد الورثة.',
    documents: [
      { title: 'عقد البيع المطعون فيه', content: 'يحمل توقيعاً يشتبه في كونه مزوراً.', type: 'رسمي', credibility: 50 },
      { title: 'تقرير خبرة الخطوط', content: 'يؤكد وجود اختلاف جوهري في التوقيع.', type: 'خبرة', credibility: 95 }
    ],
    witnesses: [
      { 
        name: 'العدل الآخر (الشريك)', 
        testimony: 'لم أكن حاضراً وقت توقيع هذا العقد بالذات.', 
        credibility: 60, 
        emotionalState: 'nervous',
        hiddenTruth: 'كان يعلم بالتزوير لكنه خاف من الفضيحة.',
        unlockTrigger: 'مواجهته بمسؤولية العدلين المشتركة قانوناً'
      }
    ],
    incident: {
      trigger: 'المتهم يدعي المرض ويطلب تأجيل الجلسة للمرة الخامسة.',
      options: [
        { text: 'رفض التأجيل والأمر بإحضاره طبياً', action: 'prosecute', impact: { reputation: 10, social: 5 }, feedback: 'منعت تماطل العدالة.' },
        { text: 'تأجيل أخير مع إنذار', action: 'delay', impact: { reputation: 0, social: 0 }, feedback: 'توازن بين الحق في الصحة والعدالة.' },
        { text: 'قبول التأجيل دون شروط', action: 'ignore', impact: { reputation: -10, social: -5 }, feedback: 'تراخٍ في تسيير الملف.' }
      ]
    },
    pleas: {
      text: 'دفع الدفاع بتقادم الجريمة لأن العقد يعود لـ 15 سنة.',
      options: [
        { text: 'رفض الدفع (التزوير جريمة مستمرة)', action: 'reject', impact: 15, feedback: 'تطبيق سليم للقانون الجنائي.' },
        { text: 'قبول الدفع بالتقادم', action: 'accept', impact: -20, feedback: 'خطأ قانوني فادح في تكييف التزوير.' }
      ]
    },
    interrogation: [
      {
        speaker: 'المتهم (العدل)',
        text: 'أنا أمارس هذه المهنة منذ 40 سنة، هل يعقل أن أقامر بسمعتي؟',
        options: [
          { text: 'لماذا لم يوقع المتوفى في سجلاتك الرسمية؟', type: 'smart', revealClue: 'المتهم يعترف أن السجل ضاع.', impact: 10 },
          { text: 'الخبرة تؤكد التزوير، من وقع بدله؟', type: 'pressure', impact: 5 },
          { text: 'هل كنت تعرف المتوفى شخصياً؟', type: 'neutral', impact: 0 }
        ]
      }
    ],
    discussions: {
      civilParty: 'المطالبة بإبطال العقد وإرجاع الحالة لما كانت عليه.',
      prosecution: 'المطالبة بأقصى العقوبات (السجن المؤبد) لخطورة الجريمة.',
      defense: 'المطالبة بالبراءة لانتفاء القصد الجرمي والشك في الخبرة.'
    },
    lastWord: 'أنا بريء، ومهنتي هي شرفي.',
    socialMedia: [
      { user: "@LandGuard", comment: "لا أمان في العقار إذا فسد الموثقون.", sentiment: 'negative' },
      { user: "@JusticeSeeker", comment: "يجب الضرب بيد من حديد على المزورين.", sentiment: 'negative' }
    ],
    verdictOptions: [
      { 
        text: 'الإدانة بالسجن النافذ 10 سنوات.', 
        isCorrect: true, 
        legalScore: 100, 
        ethicalScore: 90,
        socialImpact: 50,
        reasoning: 'ثبوت التزوير في محرر رسمي من طرف موظف عمومي (في حكمه).', 
        feedback: 'حكم رادع يحمي الثقة العامة في المحررات الرسمية.'
      },
      { 
        text: 'البراءة لفائدة الشك.', 
        isCorrect: false, 
        legalScore: 30, 
        ethicalScore: 20,
        socialImpact: -60,
        reasoning: 'تجاهل خبرة الخطوط القاطعة.', 
        feedback: 'حكم يشجع على الفساد الإداري.'
      }
    ],
    correctJudgment: {
      verdict: 'السجن 10 سنوات نافذة وغرامة مالية.',
      reasoning: 'ثبوت جناية التزوير في محرر رسمي طبقاً للفصل 352 من القانون الجنائي.',
      legalBasis: 'الفصل 352 و353 من القانون الجنائي المغربي.'
    }
  },
  {
    id: 'jud-5',
    title: 'نزاع حول "حق الكد والسعاية"',
    type: 'أسري - حقوق مالية',
    parties: { plaintiff: 'الأرملة (زهرة)', defendant: 'ورثة الزوج (أبناؤه من زوجة أخرى)' },
    facts: 'الأرملة تطالب بنصف ثروة الزوج التي تراكمت خلال 40 سنة من الزواج، بدعوى مساهمتها الفعلية في تنميتها (حق الكد والسعاية).',
    documents: [
      { title: 'شهادات استغلال فلاحي', content: 'تثبت عمل الزوجة في الضيعة.', type: 'وثيقة', credibility: 80 },
      { title: 'إحصاء التركة', content: 'قائمة بالأموال والعقارات.', type: 'رسمي', credibility: 100 }
    ],
    witnesses: [
      { 
        name: 'عامل قديم في الضيعة', 
        testimony: 'زهرة كانت هي من تدير العمال وتبيع المحصول في السوق.', 
        credibility: 90, 
        emotionalState: 'confident'
      }
    ],
    incident: {
      trigger: 'أحد الورثة يتهم الأرملة بأنها كانت مجرد "خادمة" وليست شريكة.',
      options: [
        { text: 'توبيخه على العبارة المهينة', action: 'dismiss', impact: { reputation: 10, social: 10 }, feedback: 'حفظت كرامة المتقاضين.' },
        { text: 'تجاهل الأمر ومواصلة البحث', action: 'ignore', impact: { reputation: -5, social: 0 }, feedback: 'سمحت بتوتر الجو العام للجلسة.' }
      ]
    },
    pleas: {
      text: 'دفع الورثة بأن "الكد والسعاية" عرف غير مقنن ولا يلزم المحكمة.',
      options: [
        { text: 'رفض الدفع (العرف مصدر من مصادر القانون)', action: 'reject', impact: 15, feedback: 'فهم عميق لروح مدونة الأسرة والاجتهاد القضائي.' },
        { text: 'قبول الدفع لغياب نص صريح', action: 'accept', impact: -15, feedback: 'تضييق على حقوق النساء في الثروة المشتركة.' }
      ]
    },
    interrogation: [
      {
        speaker: 'الأرملة (زهرة)',
        text: 'بعت ذهبي واشتغلت في الحقول تحت الشمس لنبني هذا البيت معاً.',
        options: [
          { text: 'هل تملكين فواتير أو عقوداً باسمك؟', type: 'smart', revealClue: 'الأرملة تعترف أن كل شيء كان باسم الزوج.', impact: 5 },
          { text: 'كم كانت مساهمتك المادية التقريبية؟', type: 'neutral', impact: 10 },
          { text: 'لماذا لم تطلبي كتابة نصيبك في حياته؟', type: 'pressure', impact: 0 }
        ]
      }
    ],
    discussions: {
      civilParty: 'المطالبة بنسبة 40% من التركة كحق كد وسعاية قبل التقسيم الإرثي.',
      prosecution: 'النيابة العامة تترك الأمر لواسع نظر المحكمة مع مراعاة العدل.',
      defense: 'الدفاع يصر على أن الزوجة كانت تقوم بواجبها الزوجي فقط.'
    },
    lastWord: 'أريد حقي في عرق جبيني، لا أريد صدقة.',
    socialMedia: [
      { user: "@WomenRights", comment: "حان الوقت للاعتراف القانوني بالكد والسعاية.", sentiment: 'positive' },
      { user: "@Tradition", comment: "هذا سيخرب نظام الإرث الشرعي.", sentiment: 'negative' }
    ],
    verdictOptions: [
      { 
        text: 'الحكم للأرملة بنسبة 30% من التركة كحق كد وسعاية.', 
        isCorrect: true, 
        legalScore: 90, 
        ethicalScore: 100,
        socialImpact: 60,
        reasoning: 'إقرار الحق بناءً على المساهمة الفعلية الثابتة بشهادة الشهود والقرائن.', 
        feedback: 'حكم منصف يتماشى مع التوجهات الحديثة للقضاء المغربي.'
      },
      { 
        text: 'رفض الطلب لعدم وجود عقد مكتوب.', 
        isCorrect: false, 
        legalScore: 60, 
        ethicalScore: 20,
        socialImpact: -40,
        reasoning: 'جمود في التفسير يضيع حقوقاً ثابتة واقعياً.', 
        feedback: 'حكم سيتم نقضه غالباً لمخالفته روح العدالة.'
      }
    ],
    correctJudgment: {
      verdict: 'استحقاق الأرملة لمبلغ مالي يعادل ثلث التركة كحق كد وسعاية.',
      reasoning: 'ثبوت المساهمة في تنمية أموال الزوج، وتطبيقاً لمبدأ العدل والإنصاف والاجتهاد القضائي المستقر.',
      legalBasis: 'المادة 49 من مدونة الأسرة (الاجتهاد القضائي في الكد والسعاية).'
    }
  },
  {
    id: 'jud-6',
    title: 'قضية اعتداء على موظف عمومي',
    type: 'جنائي - جنحي',
    parties: { plaintiff: 'شرطي مرور', defendant: 'سائق سيارة أجرة' },
    facts: 'الشرطي يدعي أن السائق أهانه واعتدى عليه جسدياً أثناء تحرير مخالفة، بينما السائق يدعي أن الشرطي هو من بدأ باستعمال العنف.',
    documents: [
      { title: 'شهادة طبية للشرطي', content: 'عجز لمدة 10 أيام.', type: 'طبية', credibility: 80 },
      { title: 'محضر الضابطة القضائية', content: 'يتضمن تصريحات الطرفين وشهود عيان.', type: 'رسمي', credibility: 100 }
    ],
    witnesses: [
      { 
        name: 'بائع متجول', 
        testimony: 'رأيت السائق يدفع الشرطي بقوة بعد أن أخذ منه أوراق السيارة.', 
        credibility: 75, 
        emotionalState: 'nervous'
      }
    ],
    incident: {
      trigger: 'زملاء السائق يتجمعون أمام المحكمة ويحدثون ضجيجاً للمطالبة بإطلاق سراحه.',
      options: [
        { text: 'تجاهل الضجيج والتركيز على الملف', action: 'ignore', impact: { reputation: 0, social: 5 }, feedback: 'حافظت على هدوئك المهني.' },
        { text: 'الأمر بتفريق التجمهر فوراً', action: 'prosecute', impact: { reputation: 10, social: -10 }, feedback: 'فرضت هيبة الدولة والقانون.' }
      ]
    },
    pleas: {
      text: 'دفع الدفاع باستفزاز الشرطي للسائق عبر عبارات نابية.',
      options: [
        { text: 'رفض الدفع (لا مبرر للاعتداء الجسدي)', action: 'reject', impact: 10, feedback: 'حماية الموظف العمومي أثناء مزاولة مهامه.' },
        { text: 'قبول الاستفزاز كظرف تخفيف', action: 'accept', impact: 5, feedback: 'مراعاة السياق النفسي للواقعة.' }
      ]
    },
    interrogation: [
      {
        speaker: 'السائق',
        text: 'لقد أهان كرامتي أمام الناس، لم أتمالك نفسي.',
        options: [
          { text: 'هل الكرامة تبرر ضرب موظف يؤدي واجبه؟', type: 'pressure', impact: 10 },
          { text: 'لماذا لم تسلك مسطرة التظلم الإداري؟', type: 'smart', impact: 5 },
          { text: 'صف لنا بالضبط كيف بدأ الاحتكاك.', type: 'neutral', impact: 0 }
        ]
      }
    ],
    discussions: {
      civilParty: 'المطالبة بدرهم رمزي كتعويض عن إهانة البدلة الرسمية.',
      prosecution: 'المطالبة بالحبس النافذ لردع كل من تسول له نفسه إهانة الأمن.',
      defense: 'المطالبة بالبراءة أو أقصى ظروف التخفيف.'
    },
    lastWord: 'أنا أعتذر، كنت في حالة غضب شديد.',
    socialMedia: [
      { user: "@TaxiDriver", comment: "الشرطة دائماً تظلمنا! نحن مع زميلنا.", sentiment: 'positive' },
      { user: "@LawOrder", comment: "الاعتداء على الأمن خط أحمر.", sentiment: 'negative' }
    ],
    verdictOptions: [
      { 
        text: 'الإدانة بالحبس النافذ شهرين وغرامة.', 
        isCorrect: true, 
        legalScore: 100, 
        ethicalScore: 80,
        socialImpact: 20,
        reasoning: 'ثبوت جنحة إهانة والاعتداء على موظف عمومي أثناء القيام بمهامه.', 
        feedback: 'حكم يكرس حماية الموظف العمومي.'
      },
      { 
        text: 'البراءة لثبوت الاستفزاز.', 
        isCorrect: false, 
        legalScore: 40, 
        ethicalScore: 30,
        socialImpact: -50,
        reasoning: 'الاستفزاز لا يبرر العنف الجسدي ضد الأمن.', 
        feedback: 'حكم يضعف هيبة السلطة العامة.'
      }
    ],
    correctJudgment: {
      verdict: 'الحبس شهرين نافذة وغرامة 2000 درهم.',
      reasoning: 'ثبوت الأفعال المنسوبة للمتهم وخطورتها على النظام العام.',
      legalBasis: 'الفصل 263 و267 من القانون الجنائي المغربي.'
    }
  }
];
