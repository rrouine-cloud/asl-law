export interface StaticCase {
  id: string;
  type: 'civil' | 'criminal' | 'family' | 'commercial' | 'tax' | 'rent' | 'traffic' | 'labor';
  parties: {
    plaintiff: string;
    defendant: string;
  };
  facts: string;
  documents: { title: string; content: string; type: string }[];
  trialDialogue: { speaker: string; text: string; role: string }[];
  witnesses: { name: string; testimony: string; credibility: number }[];
  evidence: { title: string; description: string; isLegal: boolean; flaw?: string }[];
  prosecutionOpinion: { text: string; reasoning: string };
  ethicalChallenge?: { scenario: string; options: { text: string; impact: number; feedback: string }[] };
  verdictOptions: { text: string; isCorrect: boolean; reasoning: string; feedback: string }[];
  reconciliationPossible: boolean;
  correctJudgment: {
    verdict: string;
    reasoning: string;
    legalBasis: string;
  };
}

export const moroccanCases: StaticCase[] = [
  {
    id: 'traffic-1',
    type: 'traffic',
    parties: { plaintiff: 'النيابة العامة / الضحية (أ.ب)', defendant: 'السائق (ج.د)' },
    facts: 'وقعت حادثة سير داخل المدار الحضري بمدينة الرباط، حيث صدم السائق (ج.د) الراجل (أ.ب) فوق ممر الراجلين. السائق كان يسير بسرعة مفرطة ولم يحترم حق الأسبقية.',
    documents: [
      { title: 'محضر الشرطة القضائية', content: 'معاينة مكان الحادث، قياس مسافة الكبح، وتصريحات الشهود.', type: 'محضر' },
      { title: 'تقرير طبي', content: 'عجز مؤقت لمدة 45 يوماً للضحية.', type: 'خبرة' }
    ],
    trialDialogue: [
      { speaker: 'النيابة العامة', text: 'المتهم ارتكب جنحة الجرح الخطأ نتيجة عدم التبصر وعدم احترام قانون السير.', role: 'prosecutor' },
      { speaker: 'الدفاع', text: 'موكلي فوجئ بالراجل يقطع الطريق بسرعة، والإنارة كانت ضعيفة.', role: 'defendant' }
    ],
    witnesses: [
      { name: 'عمر (بائع متجول)', testimony: 'رأيت السيارة تمر بسرعة جنونية ولم تتوقف عند ممر الراجلين.', credibility: 90 },
      { name: 'سارة (طالبة)', testimony: 'كنت أعبر الشارع ورأيت السائق يمسك بهاتفه قبل الاصطدام مباشرة.', credibility: 95 },
      { name: 'حميد (صديق المتهم)', testimony: 'المتهم كان يسير ببطء والضحية هو من ارتمى أمام السيارة.', credibility: 30 }
    ],
    evidence: [
      { title: 'شهادة شاهد عيان', description: 'أكد أن السائق كان يتحدث في الهاتف أثناء القيادة.', isLegal: true },
      { title: 'صورة كاميرا مراقبة', description: 'تظهر السائق وهو يتجاوز الإشارة الضوئية الحمراء.', isLegal: true }
    ],
    prosecutionOpinion: {
      text: 'المطالبة بأقصى العقوبات المنصوص عليها في مدونة السير.',
      reasoning: 'نظراً لخطورة الفعل وخرق قواعد السير الجوهرية مما تسبب في عجز بدني للضحية.'
    },
    ethicalChallenge: {
      scenario: 'أثناء الجلسة، قام محامي المتهم بمحاولة استفزازك بالقول أنك منحاز للضحية لأنك تعرف عائلته.',
      options: [
        { text: 'الحفاظ على الهدوء وتذكير المحامي بآداب الجلسة.', impact: 10, feedback: 'أحسنت، الرزانة من شيم القضاة.' },
        { text: 'طرد المحامي من القاعة فوراً.', impact: -5, feedback: 'تسرعت، كان عليك التدرج في العقوبة.' }
      ]
    },
    verdictOptions: [
      { text: 'إدانة المتهم والحكم عليه بالحبس موقوف التنفيذ وغرامة مالية.', isCorrect: true, reasoning: 'ثبوت الخطأ والضرر والعلاقة السببية.', feedback: 'ممتاز! أنت قاضٍ متمكن.' },
      { text: 'براءة المتهم لعدم كفاية الأدلة.', isCorrect: false, reasoning: 'الأدلة وشهادات الشهود قوية جداً.', feedback: 'خطأ قانوني فادح، سيتم الطعن في حكمك بالاستئناف.' }
    ],
    reconciliationPossible: true,
    correctJudgment: {
      verdict: 'إدانة المتهم من أجل الجرح الخطأ، والحكم عليه بغرامة مالية وتعويض مدني للضحية مع توقيف رخصة السياقة.',
      reasoning: 'ثبوت الخطأ في جانب السائق نتيجة السرعة وعدم احترام ممر الراجلين، ووجود علاقة سببية بين الخطأ والضرر.',
      legalBasis: 'المواد 167 و172 من مدونة السير المغربية.'
    }
  },
  {
    id: 'labor-1',
    type: 'labor',
    parties: { plaintiff: 'الأجير (ي.س)', defendant: 'شركة (ت.ك)' },
    facts: 'تعرض الأجير للفصل من عمله بعد 5 سنوات من الخدمة بدعوى ارتكابه لخطأ جسيم يتمثل في الغياب غير المبرر لمدة 3 أيام متتالية.',
    documents: [
      { title: 'عقد الشغل', content: 'عقد غير محدد المدة براتب 6000 درهم.', type: 'عقد' },
      { title: 'رسالة الفصل', content: 'تبليغ الفصل بسبب الغياب غير المبرر.', type: 'وثيقة' }
    ],
    trialDialogue: [
      { speaker: 'المدعي', text: 'فصلي كان تعسفياً، غيابي كان بسبب مرض مفاجئ ولم أتمكن من التبليغ فوراً.', role: 'plaintiff' },
      { speaker: 'المدعى عليه', text: 'الشركة تلتزم بالقانون، والغياب أضر بسير العمل.', role: 'defendant' }
    ],
    witnesses: [
      { name: 'رئيس المصلحة', testimony: 'الأجير لم يتصل بنا ولم يقدم أي مبرر إلا بعد صدور قرار الفصل.', credibility: 80 },
      { name: 'زميل في العمل', testimony: 'ياسين أخبرني أنه مريض في اليوم الثاني من غيابه.', credibility: 70 },
      { name: 'حارس الشركة', testimony: 'رأيت الأجير في المقهى خلال أيام غيابه.', credibility: 40 }
    ],
    evidence: [
      { title: 'شهادة طبية', description: 'تثبت مرض الأجير خلال فترة الغياب.', isLegal: true },
      { title: 'سجل الحضور', description: 'يؤكد غياب الأجير للأيام الثلاثة.', isLegal: true }
    ],
    prosecutionOpinion: {
      text: 'النيابة العامة تترك الأمر للمحكمة في القضايا الاجتماعية.',
      reasoning: 'القضية مدنية اجتماعية تتعلق بحقوق الأجراء.'
    },
    verdictOptions: [
      { text: 'اعتبار الفصل تعسفياً والحكم بالتعويض عن الفصل والإخطار والضرر.', isCorrect: true, reasoning: 'المرض مبرر شرعي والشركة لم تحترم مسطرة الاستماع.', feedback: 'أحسنت، حماية الأجير من تعسف المشغل مبدأ أساسي.' },
      { text: 'رفض الطلب لثبوت الخطأ الجسيم.', isCorrect: false, reasoning: 'المرض الثابت بشهادة طبية ينفي الخطأ الجسيم.', feedback: 'سيتم نقض حكمك، لم تراعِ الظروف القاهرية للأجير.' }
    ],
    reconciliationPossible: true,
    correctJudgment: {
      verdict: 'الحكم على الشركة بأداء تعويضات عن الفصل التعسفي.',
      reasoning: 'عدم احترام مسطرة الفصل المنصوص عليها في المادة 62 من مدونة الشغل، وثبوت مبرر المرض.',
      legalBasis: 'المواد 41 و62 من مدونة الشغل المغربية.'
    }
  },
  {
    id: 'family-1',
    type: 'family',
    parties: { plaintiff: 'الزوجة (ف.ز)', defendant: 'الزوج (ر.ق)' },
    facts: 'تقدمت الزوجة بطلب للتطليق للشقاق بسبب سوء المعاملة والإهمال المادي من طرف الزوج، مع المطالبة بمستحقاتها ومستحقات الأبناء.',
    documents: [
      { title: 'رسم الزواج', content: 'عقد زواج مبرم منذ 10 سنوات.', type: 'عقد' },
      { title: 'شواهد مدرسية للأبناء', content: 'تثبت تمدرس طفلين.', type: 'وثيقة' }
    ],
    trialDialogue: [
      { speaker: 'المدعية', text: 'الحياة أصبحت مستحيلة، يرفض الإنفاق ويغيب عن البيت كثيراً.', role: 'plaintiff' },
      { speaker: 'المدعى عليه', text: 'أنا أحب زوجتي وأبنائي، وضروفي المادية صعبة حالياً.', role: 'defendant' }
    ],
    witnesses: [
      { name: 'الأخت', testimony: 'رأيت آثار الضرب على وجه أختي عدة مرات.', credibility: 85 },
      { name: 'الجار', testimony: 'أسمع صراخاً دائماً ينبعث من منزلهما.', credibility: 75 },
      { name: 'صديق الزوج', testimony: 'الزوج رجل طيب والزوجة هي من تفتعل المشاكل.', credibility: 40 }
    ],
    evidence: [
      { title: 'تقرير الحكمين', description: 'أكد فشل محاولات الصلح واستمرار الشقاق.', isLegal: true },
      { title: 'شهادة طبية', description: 'تثبت تعرض الزوجة للعنف الجسدي.', isLegal: true }
    ],
    prosecutionOpinion: {
      text: 'تطبيق مقتضيات مدونة الأسرة بما يضمن مصلحة الأبناء.',
      reasoning: 'حماية الأسرة والأطفال أولوية قصوى.'
    },
    verdictOptions: [
      { text: 'التطليق للشقاق مع تحديد المستحقات والنفقة.', isCorrect: true, reasoning: 'ثبوت استحالة العشرة وفشل الصلح.', feedback: 'أحسنت، لقد أنصفت الزوجة والأبناء.' },
      { text: 'رفض طلب التطليق لعدم كفاية الحجج.', isCorrect: false, reasoning: 'الشقاق ثابت بتقرير الحكمين والشهادة الطبية.', feedback: 'سيتم استئناف حكمك، لقد أغفلت حقوقاً ثابتة.' }
    ],
    reconciliationPossible: true,
    correctJudgment: {
      verdict: 'التطليق للشقاق مع تحديد مستحقات الزوجة (المتعة، السكنى) ونفقة الأبناء وأجرة حضانتهم.',
      reasoning: 'ثبوت تعذر استمرار العشرة وفشل الصلح، وحق الأبناء في النفقة واجب بقوة القانون.',
      legalBasis: 'المواد 94 إلى 97 من مدونة الأسرة المغربية.'
    }
  },
  {
    id: 'criminal-1',
    type: 'criminal',
    parties: { plaintiff: 'النيابة العامة / الضحية (س.م)', defendant: 'المتهم (خ.ل)' },
    facts: 'تم ضبط المتهم (خ.ل) متلبساً بمحاولة سرقة حقيبة يد من سيدة (س.م) باستعمال العنف وتهديدها بسلاح أبيض في الشارع العام بمدينة الدار البيضاء.',
    documents: [
      { title: 'محضر الضابطة القضائية', content: 'إيقاف المتهم في حالة تلبس وحجز السلاح الأبيض.', type: 'محضر' },
      { title: 'تقرير طبي للضحية', content: 'خدوش وجروح طفيفة وحالة صدمة نفسية.', type: 'خبرة' }
    ],
    trialDialogue: [
      { speaker: 'النيابة العامة', text: 'الفعل يشكل جناية السرقة الموصوفة باستعمال السلاح والعنف في الطريق العام.', role: 'prosecutor' },
      { speaker: 'المتهم', text: 'كنت تحت تأثير المخدرات ولم أكن في وعيي، أنا نادم.', role: 'defendant' }
    ],
    witnesses: [
      { name: 'بائع السجائر', testimony: 'رأيت المتهم يهاجم السيدة ويشهر سكيناً في وجهها.', credibility: 95 },
      { name: 'سائق طاكسي', testimony: 'سمعت صراخ الضحية وطاردت المتهم حتى تم إيقافه.', credibility: 90 }
    ],
    evidence: [
      { title: 'السلاح الأبيض المحجوز', description: 'سكين من الحجم الكبير كان بحوزة المتهم.', isLegal: true },
      { title: 'الحقيبة المسترجعة', description: 'حقيبة الضحية التي حاول المتهم سرقتها.', isLegal: true }
    ],
    prosecutionOpinion: {
      text: 'المطالبة بعقوبة حبسية نافذة تتناسب مع خطورة الفعل الجرمي.',
      reasoning: 'توفر أركان جناية السرقة الموصوفة وظروف التشديد (الليل، السلاح، العنف).'
    },
    ethicalChallenge: {
      scenario: 'أحد أقارب المتهم حاول الاتصال بك هاتفياً قبل الجلسة لطلب الرأفة بالمتهم مقابل "خدمة" مستقبلية.',
      options: [
        { text: 'قطع المكالمة فوراً وإبلاغ النيابة العامة بالواقعة.', impact: 15, feedback: 'ممتاز، النزاهة هي أساس القضاء.' },
        { text: 'الاستماع له دون وعده بشيء ثم تجاهل الأمر.', impact: -10, feedback: 'خطأ، كان عليك التبليغ عن محاولة الإرشاء.' }
      ]
    },
    verdictOptions: [
      { text: 'إدانة المتهم بجناية السرقة الموصوفة والحكم عليه بـ 5 سنوات سجناً نافذاً.', isCorrect: true, reasoning: 'ثبوت حالة التلبس واستعمال السلاح والعنف.', feedback: 'حكم عادل يزجر الجريمة ويحمي المجتمع.' },
      { text: 'إعادة تكييف الفعل إلى سرقة بسيطة والحكم بشهرين حبساً.', isCorrect: false, reasoning: 'استعمال السلاح والعنف يمنع تكييف الفعل كسرقة بسيطة.', feedback: 'تكييف خاطئ، لقد تساهلت مع جناية خطيرة.' }
    ],
    reconciliationPossible: false,
    correctJudgment: {
      verdict: 'إدانة المتهم من أجل جناية السرقة الموصوفة بظروف التعدد والليل واستعمال السلاح.',
      reasoning: 'ثبوت الأركان المادية والمعنوية للجريمة وتوفر ظروف التشديد المنصوص عليها قانوناً.',
      legalBasis: 'الفصول 507 و508 من القانون الجنائي المغربي.'
    }
  },
  {
    id: 'rent-1',
    type: 'rent',
    parties: { plaintiff: 'المكري (أ.ح)', defendant: 'المكتري (م.ن)' },
    facts: 'توقف المكتري عن أداء السومة الكرائية لمدة 4 أشهر متتالية لمحل معد للسكنى بمدينة طنجة، رغم توصله بإنذار بالأداء.',
    documents: [
      { title: 'عقد الكراء', content: 'عقد كراء مصادق عليه بسومة 2500 درهم شهرياً.', type: 'عقد' },
      { title: 'إنذار بالأداء', content: 'تبليغ الإنذار عن طريق مفوض قضائي مع مهلة 15 يوماً.', type: 'وثيقة' }
    ],
    trialDialogue: [
      { speaker: 'المدعي', text: 'أطالب بأداء المتأخرات وإفراغ المكتري لتماطله في الأداء.', role: 'plaintiff' },
      { speaker: 'المدعى عليه', text: 'المحل يحتاج لإصلاحات ضرورية والمكري يرفض القيام بها، لذلك توقفت عن الأداء.', role: 'defendant' }
    ],
    witnesses: [
      { name: 'المفوض القضائي', testimony: 'بلغت الإنذار للمكتري شخصياً ورفض الأداء.', credibility: 100 },
      { name: 'الجار', testimony: 'المحل في حالة جيدة ولا توجد به أعطال تمنع السكن.', credibility: 80 }
    ],
    evidence: [
      { title: 'وصل التبليغ', description: 'يثبت توصل المكتري بالإنذار وعدم استجابته في الأجل.', isLegal: true }
    ],
    prosecutionOpinion: {
      text: 'النيابة العامة غير ممثلة في هذا النوع من القضايا المدنية الصرفة.',
      reasoning: 'نزاع تعاقدي بين خواص.'
    },
    verdictOptions: [
      { text: 'المصادقة على الإنذار والحكم بالأداء والإفراغ للتماطل.', isCorrect: true, reasoning: 'المكتري لم يؤدِ داخل الأجل القانوني ولم يثبت مبرر التوقف.', feedback: 'صحيح، التماطل في الأداء بعد الإنذار يوجب الإفراغ.' },
      { text: 'رفض طلب الإفراغ وإعطاء مهلة إدامية للمكتري.', isCorrect: false, reasoning: 'القانون لا يسمح بمهلة إضافية بعد فوات أجل الإنذار في حالة التماطل.', feedback: 'خطأ، لقد خالفت مقتضيات قانون الكراء الجديد.' }
    ],
    reconciliationPossible: true,
    correctJudgment: {
      verdict: 'المصادقة على الإنذار بالأداء والحكم على المكتري بأداء الوجيبة الكرائية المتخلدة بذمته مع الإفراغ.',
      reasoning: 'ثبوت تماطل المكتري في الأداء رغم إنذاره قانوناً وعدم جديته في الدفع بضرورة الإصلاحات.',
      legalBasis: 'القانون رقم 67.12 المتعلق بتنظيم العلاقات التعاقدية بين المكري والمكتري للمحلات المعدة للسكنى.'
    }
  },
  {
    id: 'commercial-1',
    type: 'commercial',
    parties: { plaintiff: 'شركة (أ.ب) للمشروبات', defendant: 'شركة (ج.د) للتوزيع' },
    facts: 'نزاع حول تقليد علامة تجارية مسجلة لدى المكتب المغربي للملكية الصناعية والتجارية (OMPIC). المدعى عليها قامت بتسويق منتج يحمل اسماً وشعاراً مشابهاً جداً لمنتج المدعية مما أحدث خلطاً لدى المستهلك.',
    documents: [
      { title: 'شهادة تسجيل العلامة', content: 'تثبت ملكية المدعية للعلامة التجارية منذ 2015.', type: 'وثيقة' },
      { title: 'محضر معاينة مفوض قضائي', content: 'ضبط المنتجات المقلدة في نقاط البيع.', type: 'محضر' }
    ],
    trialDialogue: [
      { speaker: 'محامي المدعية', text: 'هذا اعتداء صارخ على الملكية الصناعية ومنافسة غير مشروعة تسببت في خسائر فادحة.', role: 'plaintiff' },
      { speaker: 'محامي المدعى عليها', text: 'التشابه بسيط والجمهور يستطيع التمييز، كما أننا سجلنا علامتنا أيضاً.', role: 'defendant' }
    ],
    witnesses: [
      { name: 'خبير في التسويق', testimony: 'نسبة الخلط لدى المستهلك العادي تتجاوز 70% بسبب تقارب الألوان والخط.', credibility: 90 }
    ],
    evidence: [
      { title: 'عينات من المنتجين', description: 'تظهر التشابه الكبير في التصميم الخارجي.', isLegal: true }
    ],
    prosecutionOpinion: {
      text: 'المطالبة بمصادرة المنتجات المقلدة وإتلافها.',
      reasoning: 'حماية الاقتصاد الوطني وحقوق الملكية الفكرية.'
    },
    verdictOptions: [
      { text: 'الحكم بوقف استغلال العلامة المقلدة وسحب المنتجات من السوق مع التعويض.', isCorrect: true, reasoning: 'ثبوت التقليد والمنافسة غير المشروعة.', feedback: 'ممتاز، حماية الملكية الصناعية ركيزة للاستثمار.' },
      { text: 'رفض الطلب لعدم وجود تطابق تام.', isCorrect: false, reasoning: 'التشابه المؤدي للخلط يكفي لإثبات التقليد قانوناً.', feedback: 'خطأ، القانون يحمي من التشابه أيضاً وليس التطابق فقط.' }
    ],
    reconciliationPossible: true,
    correctJudgment: {
      verdict: 'منع المدعى عليها من استعمال العلامة المقلدة تحت طائلة غرامة تهديدية، مع الحكم بالتعويض.',
      reasoning: 'ثبوت عناصر المنافسة غير المشروعة والاعتداء على علامة تجارية محمية قانوناً.',
      legalBasis: 'القانون رقم 17.97 المتعلق بحماية الملكية الصناعية المغربي.'
    }
  },
  {
    id: 'cyber-1',
    type: 'criminal',
    parties: { plaintiff: 'النيابة العامة / الضحية (ن.م)', defendant: 'المتهم (س.ك)' },
    facts: 'قام المتهم بنشر صور خاصة للضحية على مواقع التواصل الاجتماعي (فيسبوك) مع عبارات مسيئة وتشهيرية بعد رفضها لطلباته الابتزازية.',
    documents: [
      { title: 'محضر المعاينة الإلكترونية', content: 'تفريغ محتوى المنشورات والرسائل الابتزازية.', type: 'محضر' },
      { title: 'تقرير الخبرة التقنية', content: 'تأكيد أن الحساب يعود للمتهم ومن خلال عنوان IP الخاص به.', type: 'خبرة' }
    ],
    trialDialogue: [
      { speaker: 'الضحية', text: 'دمر حياتي وسمعتي، كنت أتلقى تهديدات يومية منه.', role: 'plaintiff' },
      { speaker: 'المتهم', text: 'الحساب تم اختراقه ولا علاقة لي بتلك المنشورات.', role: 'defendant' }
    ],
    witnesses: [
      { name: 'صديقة الضحية', testimony: 'أرتني الرسائل التي كان يرسلها لها قبل النشر.', credibility: 85 }
    ],
    evidence: [
      { title: 'لقطات شاشة (Screenshots)', description: 'توثق المنشورات والتعليقات المسيئة.', isLegal: true }
    ],
    prosecutionOpinion: {
      text: 'المطالبة بأقصى العقوبات لردع الجرائم المعلوماتية.',
      reasoning: 'المساس بالحياة الخاصة للأفراد عبر الوسائل الرقمية جريمة خطيرة.'
    },
    verdictOptions: [
      { text: 'إدانة المتهم بالحبس النافذ وغرامة مالية بتهمة التشهير والابتزاز.', isCorrect: true, reasoning: 'ثبوت الأفعال الجرمية عبر الخبرة التقنية والمعاينة.', feedback: 'أحسنت، مكافحة الجريمة الإلكترونية ضرورة عصرية.' },
      { text: 'البراءة لعدم وجود دليل مادي ملموس (ورقي).', isCorrect: false, reasoning: 'الأدلة الرقمية لها حجية قانونية كاملة في التشريع المغربي الحالي.', feedback: 'خطأ، لقد أغفلت التطور التشريعي في مجال الإثبات الرقمي.' }
    ],
    reconciliationPossible: false,
    correctJudgment: {
      verdict: 'إدانة المتهم من أجل بث وتوزيع ادعاءات ووقائع كاذبة بقصد المس بالحياة الخاصة للأشخاص والتشهير بهم.',
      reasoning: 'ثبوت القصد الجرمي واستعمال وسيلة إلكترونية للابتزاز والتشهير.',
      legalBasis: 'الفصول 447-1 و447-2 من القانون الجنائي المغربي.'
    }
  }
];

export type SuspectTrait = 
  | 'evasive' // المراوغ الذكي
  | 'liar' // الكاذب المحترف
  | 'silent' // الصامت
  | 'aggressive' // العصبي المنفجر
  | 'calm_actor' // الممثل البارد
  | 'legal_thinker' // الذكي القانوني
  | 'inconsistent' // المتناقض
  | 'innocent_looking' // البارد الحقيقي
  | 'emotional_manipulator' // المراوغ العاطفي
  | 'table_flipper' // الانقلابي
  | 'honest'; // الصادق المحتمل

export interface InterrogationCase {
  id: string;
  level: 1 | 2 | 3 | 4;
  type: 'murder' | 'fraud' | 'family' | 'financial' | 'corruption' | 'theft' | 'labor' | 'commercial';
  title: string;
  scenario: string;
  suspect: {
    name: string;
    trait: SuspectTrait;
    description: string;
    initialMood: string;
  };
  evidence: { 
    id: string; 
    title: string; 
    description: string; 
    type: 'physical' | 'statement' | 'digital' | 'document' | 'audio' | 'testimony';
  }[];
  contradictions: { id: string; targetId1: string; targetId2: string; explanation: string }[];
  goldenQuestion?: {
    trigger: string;
    question: string;
    feedback: string;
  };
  legalRules: string[];
  isStoryRelated?: boolean;
  nextCaseId?: string;
}

import { obligationsArticles } from './obligationsData';

export interface LegalRule {
  id: string;
  title: string;
  description: string;
  example: string;
  application: string;
}

export const legalLibrary: LegalRule[] = [
  ...obligationsArticles,
  {
    id: 'nullity',
    title: 'بطلان الإجراءات',
    description: 'كل إجراء تم خرقاً للمقتضيات الجوهرية للمسطرة الجنائية يعتبر باطلاً.',
    example: 'تفتيش منزل دون إذن قضائي أو خارج الأوقات القانونية.',
    application: 'يؤدي إلى استبعاد الدليل المستمد من الإجراء الباطل.'
  },
  {
    id: 'innocence',
    title: 'قرينة البراءة',
    description: 'كل متهم يعتبر بريئاً إلى أن تثبت إدانته بمقرر قضائي حائز لقوة الشيء المقضي به.',
    example: 'لا يمكن إجبار المتهم على إثبات براءته، بل النيابة هي من تثبت الإدانة.',
    application: 'الشك يفسر دائماً لفائدة المتهم.'
  },
  {
    id: 'admissibility',
    title: 'مشروعية الأدلة',
    description: 'لا يمكن الاعتداد بالأدلة التي تم الحصول عليها بطرق غير مشروعة أو عن طريق العنف.',
    example: 'اعتراف تحت التعذيب أو تسجيل مكالمات دون إذن قضائي.',
    application: 'الدليل غير المشروع لا قيمة له أمام القضاء.'
  },
  {
    id: 'traffic_validity',
    title: 'حجية محاضر السير',
    description: 'محاضر مخالفات السير تعتبر حجة إلى أن يثبت العكس بوسائل إثبات قانونية.',
    example: 'إثبات أن الرادار لم يخضع للمعايرة السنوية الإلزامية.',
    application: 'يؤدي إلى بطلان الغرامة وإلغاء العقوبات المرتبطة بها.'
  },
  {
    id: 'criminal_intent',
    title: 'القصد الجرمي',
    description: 'لا جريمة بدون قصد جرمي، إلا في الحالات التي ينص فيها القانون على خلاف ذلك.',
    example: 'الضرب المفضي للموت دون نية إحداثه يختلف عن القتل العمد.',
    application: 'يؤثر جوهرياً على تكييف الجريمة ومدة العقوبة.'
  },
  {
    id: 'mitigating_circumstances',
    title: 'ظروف التخفيف',
    description: 'يجوز للمحكمة منح ظروف التخفيف إذا كانت أخلاق المتهم أو ظروف الجريمة تبرر ذلك.',
    example: 'انعدام السوابق العدلية أو الحالة الاجتماعية الصعبة للمتهم.',
    application: 'تسمح بالنزول بالعقوبة عن الحد الأدنى القانوني.'
  }
];

export const interrogationCases: InterrogationCase[] = [
  {
    id: 'loophole-1',
    level: 1,
    type: 'fraud',
    title: 'المعترف البريء قانوناً',
    scenario: 'تم القبض على مشتبه به في جريمة سرقة موصوفة. أثناء التحقيق، اعترف المشتبه به بكل تفاصيل الجريمة. ومع ذلك، تبين أن الاستنطاق تم في غياب محامٍ وتحت ضغط نفسي شديد دون احترام لآجال الحراسة النظرية.',
    suspect: {
      name: 'سعيد',
      trait: 'inconsistent',
      description: 'يبدو مرتبكاً، يغير أقواله باستمرار تحت الضغط.',
      initialMood: 'منهار نفسياً'
    },
    evidence: [
      { id: 'e1', title: 'محضر الاعتراف', description: 'اعتراف صريح ومفصل بالجريمة موقع من طرف المتهم.', type: 'statement' },
      { id: 'e2', title: 'سجل الحراسة النظرية', description: 'يظهر أن المتهم قضى 72 ساعة دون تمديد كتابي من وكيل الملك.', type: 'digital' },
      { id: 'e3', title: 'تقرير طبي', description: 'يظهر علامات إرهاق شديد وقلة نوم على المتهم.', type: 'physical' }
    ],
    contradictions: [
      { id: 'c1', targetId1: 'e1', targetId2: 'e2', explanation: 'الاعتراف تم بعد تجاوز المدة القانونية للحراسة النظرية دون تمديد.' }
    ],
    goldenQuestion: {
      trigger: 'بعد مواجهته بخرق مسطرة الحراسة النظرية',
      question: 'لماذا وقعت على محضر الاعتراف في الساعة الرابعة صباحاً وأنت محروم من النوم منذ 3 أيام؟',
      feedback: 'المتهم اعترف أن الضغط هو ما دفعه للتوقيع وليس الحقيقة.'
    },
    legalRules: [
      'المادة 66 من قانون المسطرة الجنائية (الحراسة النظرية).',
      'المادة 751 من قانون المسطرة الجنائية (بطلان الإجراءات).',
      'شروط صحة المحاضر.'
    ]
  }
];

export interface StaticEvent {
  title: string;
  description: string;
  options: {
    text: string;
    hint: string;
    impact: {
      budget: number;
      reputation: number;
      energy: number;
      feedback: string;
    };
  }[];
}

export const moroccanEvents: StaticEvent[] = [
  {
    title: 'قضية نزع ملكية كبرى',
    description: 'جماعة محلية تريد نزع ملكية أرض لموكل شركتك لبناء طريق سيار. التعويض المقترح هزيل جداً.',
    options: [
      {
        text: 'رفع دعوى استعجالية لإيقاف الأشغال',
        hint: 'مكلف ولكن يحمي الأرض مؤقتاً',
        impact: { budget: -5000, reputation: 15, energy: -20, feedback: 'نجحت في تأخير الأشغال وكسبت ثقة الموكل.' }
      },
      {
        text: 'التفاوض الودي لرفع قيمة التعويض',
        hint: 'سريع ويوفر الجهد',
        impact: { budget: 10000, reputation: 5, energy: -5, feedback: 'حصلت على زيادة 20% في التعويض وأتعاب جيدة.' }
      }
    ]
  },
  {
    title: 'متدرب موهوب أم واسطة؟',
    description: 'لديك مقعد واحد لمتدرب. هناك طالب متفوق جداً، وهناك ابن قاضٍ معروف قد يسهل لك بعض الأمور.',
    options: [
      {
        text: 'اختيار الطالب المتفوق',
        hint: 'استثمار في الكفاءة',
        impact: { budget: -2000, reputation: 20, energy: 10, feedback: 'المتدرب الجديد أذهل الجميع بذكائه ورفع سمعة المكتب.' }
      },
      {
        text: 'اختيار ابن القاضي',
        hint: 'علاقات عامة',
        impact: { budget: 5000, reputation: -15, energy: -5, feedback: 'كسبت علاقة قوية لكن المتدرب مهمل وسمعتك تضررت قليلاً.' }
      }
    ]
  },
  {
    title: 'نزاع شغل جماعي',
    description: 'عمال المصنع يهددون بإضراب شامل بسبب تأخر الأجور وظروف العمل غير الصحية.',
    options: [
      {
        text: 'فتح حوار مباشر مع مندوبي الأجراء',
        hint: 'حل سلمي ومستدام',
        impact: { budget: -10000, reputation: 15, energy: -30, feedback: 'تم التوصل لاتفاق يرضي الطرفين واستأنف العمل.' }
      },
      {
        text: 'اللجوء لمسطرة المصالحة لدى مندوبية الشغل',
        hint: 'إجراء قانوني رسمي',
        impact: { budget: -2000, reputation: 5, energy: -10, feedback: 'المسطرة تأخذ وقتاً لكنها تضمن حقوق الشركة قانونياً.' }
      }
    ]
  },
  {
    title: 'شيك بدون رصيد',
    description: 'أحد كبار الموكلين قدم لك شيكاً كأتعاب، لكن البنك رفض صرفه لعدم كفاية الرصيد.',
    options: [
      {
        text: 'تقديم شكاية مباشرة لوكيل الملك',
        hint: 'إجراء زجري سريع',
        impact: { budget: 5000, reputation: -5, energy: -15, feedback: 'الموكل أدى المبلغ فوراً خوفاً من السجن لكن علاقتك به انتهت.' }
      },
      {
        text: 'منح الموكل مهلة أسبوع لتسوية الوضع',
        hint: 'حفاظاً على العلاقة التجارية',
        impact: { budget: 0, reputation: 10, energy: 0, feedback: 'الموكل قدر مرونتك وأدى المبلغ مع اعتذار رسمي.' }
      }
    ]
  }
];
