import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Award, CheckCircle2, AlertCircle, RefreshCw, Star, 
  ArrowRight, ArrowLeft, Languages, ClipboardList, HelpCircle, 
  GraduationCap, Book, Brain, Check, X, RotateCcw, Lightbulb, 
  Sparkles, CheckSquare, Trophy, AlertTriangle, FileText, Share2,
  Calendar, ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- DATA STRUCTURES ---

interface VocabItem {
  fr: string;
  ar: string;
  explanation: string;
}

interface SpeechSection {
  id: number;
  title: string;
  ar: string;
  fr: string;
  vocabulary: VocabItem[];
  analysis: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  frenchContext?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// Royal Speech of 1999 broken down with rich educational annotation
const SPEECH_SECTIONS_1999: SpeechSection[] = [
  {
    id: 1,
    title: "تأسيس وافتتاح الدورة والمجلس الأعلى للقضاء",
    ar: "بسرور بالغ وابتهاج عميق يسعدنا أن نلتقي لكم، ونحن نفتتح هذه الدورة التي يعقدها المجلس الأعلى للقضاء. وهو شعور نابع مما تحظى به هذه المؤسسة الدستورية الموقرة الموضوعة تحت رئاسة جلالتنا ، ونابع كذلك من الأهمية القصوى التي توليها للقضاء باعتباره مسؤولية منوطة بأمير المؤمنين يفوض النهوض بها لقضاة باسمه يصدرون الأحكام.",
    fr: "C'est avec grand plaisir et une profonde joie que Nous vous rencontrons pour ouvrir cette session que tient le Conseil Supérieur de la Magistrature. Ce sentiment émane du prestige dont jouit cette honorable institution placée sous la Haute Présidence de Notre Majesté, ainsi que de l'importance extrême que Nous accordons à la justice, en tant que responsabilité dévolue à Amir Al Mouminine qui en fait délégation aux magistrats chargés de prononcer en son Nom les jugements.",
    vocabulary: [
      { fr: "Conseil Supérieur de la Magistrature", ar: "المجلس الأعلى للقضاء", explanation: "المؤسسة الدستورية المسؤولة عن تدبير شؤون القضاة (تسمى حالياً في دستور 2011: المجلس الأعلى للسلطة القضائية CSPJ)." },
      { fr: "Magistrats / Magistrature", ar: "القضاة / سلك القضاء", explanation: "تطلق على القضاة المهنيين سواء قضاة الأحكام (الجلوس) أو قضاة النيابة العامة (الواقف)." },
      { fr: "Responsabilité dévolue", ar: "مسؤولية منوطة", explanation: "مسؤولية مسندة أو موكولة لجهة معينة بموجب القانون أو الدستور." },
      { fr: "Faire délégation", ar: "يفوض / يفوض النهوض بها", explanation: "نقل الصلاحيات أو الاختصاصات من صاحب السلطة الأصلي إلى شخص أو هيئة أخرى." },
      { fr: "Prononcer les jugements", ar: "يصدرون الأحكام", explanation: "النطق أو التصريح بالأحكام القضائية بعد المداولة واستيفاء الإجراءات." }
    ],
    analysis: "لاحظ كيف تُرجمت الصيغة الملكية السامية 'يسعدنا' بـ 'Nous' مع كتابة حرف 'N' كبيراً (Majuscule de majesté) احتراماً للمقام السامي وصياغة خطابات الدولة الرسمية. كما تُرجم مصطلح 'أمير المؤمنين' بشكل صوتي 'Amir Al Mouminine' باعتباره لقباً دستورياً إسلامياً فريداً."
  },
  {
    id: 2,
    title: "مواصلة المسير والارتكاز على التراث الفقهي",
    ar: "وعلى النهج الذي سلك أسلافنا الميامين والذي وطده والدنا المنعم جلالة الملك الحسن الثاني، أكرم الله مثواه، نحن عازمون على متابعة المسير بما تتطلبه هذه المسؤولية من عناية ورعاية على أساس متين من مرجعيتنا الإسلامية الثابتة، ومن ثراتنا العلمي الزاخر المتجلي في الرصيد الفقهي والاجتهادي الذي خلفه فقهاء الأمة وفي طليعتهم قضاة المغرب على مر التاريخ، أولئك الذين اعترف لهم بالتقوى والنزاهة وشهد لهم بالتبريز في أحكام النوازل والقضايا المستحدثة.",
    fr: "Suivant la voie empruntée par Nos Glorieux Ancêtres et consolidée par Notre Auguste Père, Feu Sa Majesté le Roi Hassan II, que Dieu l'ait en Sa Sainte Miséricorde, Nous sommes déterminé à faire preuve de persévérance, avec tout l'intérêt et le soin que requiert cette responsabilité, sur la base solide de Notre référentiel islamique constant et de Notre riche patrimoine de sciences religieuses représenté par le capital jurisprudentiel en matière de fiqh et d'interprétation, légué au fil de l'histoire par les Oulémas de la Oumma, à leur tête les magistrats, dont la probité et l'honnêteté sont reconnues et qui se prévalent de témoignages saluant leur qualité de maîtres dans le jugement des cas d'espèces et des affaires inédites.",
    vocabulary: [
      { fr: "Capital jurisprudentiel", ar: "الرصيد الفقهي والاجتهادي", explanation: "تراكم القرارات والأحكام التفسيرية للقانون. 'Jurisprudence' تعني الاجتهاد القضائي." },
      { fr: "La probité et l'honnêteté", ar: "التقوى والنزاهة", explanation: "المبادئ الأخلاقية الأساسية المفروضة في القضاة لتأكيد حيادهم ونزاهتهم الشديدة." },
      { fr: "Cas d'espèces", ar: "أحكام النوازل", explanation: "القضايا العينية المعروضة على القاضي والتي تتطلب تطبيقاً مخصصاً للقانون." },
      { fr: "Affaires inédites", ar: "القضايا المستحدثة", explanation: "القضايا الجديدة والطارئة التي لم يسبق للمشرع تنظيمها تفصيلاً وتحتاج لاجتهاد مفسر." },
      { fr: "Légué", ar: "خلفه / يورث", explanation: "ما تركه السلف للخلف من تراث مادي أو فكري وعلمي." }
    ],
    analysis: "المصطلحات الفقهية والشريعة الإسلامية تُرجمت هنا بذكاء لتناسب القارئ الأجنبي والقانون المقارن، حيث تُرجمت 'أحكام النوازل' بـ 'jugement des cas d'espèces' وهي ترجمة قانونية بامتياز تقابل القضايا الخاصة المحددة."
  },
  {
    id: 3,
    title: "عصرنة القضاء وتأصيل مفهوم السلطة والمسؤولية",
    ar: "وإذا كنا نريد استمرار هذه الصورة الأصيلة المشرقة لقضائنا في إطار دعائمه القوية ومرتكزاته الراسخة، فإننا نتطلع كذلك إلى أن يكون هذا القضاء متطورا ومتجددا يواكب ما يعرفه العالم المتقدم في مواجهة المشكلات التي يثيرها العصر وتولدها الحضارة الحديثة ويساير ما عقدنا العزم على إنجازه، بإذن الله، وما دعونا إلى التعبئة له بمنظور تصحيحي للمسؤولية ومفهوم جديد للسلطة.",
    fr: "Tout en étant animé de la volonté d'assurer la pérennité de cette image authentique et rayonnante de Notre justice, dans le cadre de ses solides bases et de ses assises constantes, Nous aspirons également à ce que cette justice soit évoluée et empreinte de renouveau, qu'elle accompagne le monde développé dans sa confrontation avec les problèmes marquant Notre époque et qu'engendre la civilisation contemporaine, et qu'elle œuvre en harmonie avec les actions que Nous avons, grâce à Dieu, la ferme détermination d'accomplir et avec les objectifs pour lesquels Nous avons appelé à la mobilisation, selon une vision rénovée de la responsabilité et une nouvelle conception de l'autorité.",
    vocabulary: [
      { fr: "Pérennité", ar: "استمرار / ديمومة", explanation: "البقاء والدوام لفترات طويلة مع الحفاظ على الأصول والثوابت." },
      { fr: "Empreinte de renouveau", ar: "متجدد", explanation: "يتسم بالتطوير والتحديث وعصرنة آلياته لتلائم المستجدات." },
      { fr: "Mobilisation", ar: "التعبئة", explanation: "حشد الطاقات والموارد والجهود البشرية لتحقيق هدف إصلاحي وطني." },
      { fr: "Nouvelle conception de l'autorité", ar: "مفهوم جديد للسلطة", explanation: "المفهوم الدستوري الحديث الذي يربط السلطة بالخدمة العامة وحماية الحقوق والمسؤولية." },
      { fr: "Œuvrer en harmonie", ar: "يساير / يعمل في انسجام", explanation: "العمل بشكل متطابق ومتكامل مع السياسات الكبرى والبرامج الإصلاحية." }
    ],
    analysis: "عبارة 'منظور تصحيحي' تُرجمت بـ 'une vision rénovée' (رؤية مجددة) للدلالة على الطابع الإيجابي والتطويري للإصلاح دون الاقتصار على مجرد إصلاح الخطأ."
  },
  {
    id: 4,
    title: "الإصلاحات السابقة وضمان الحقوق والحريات والتنمية",
    ar: "لقد أنجزت في عهد والدنا المقدس، رضوان الله عليه ، إصلاحات كثيرة تحث على الاعتزاز والافتخار بما تحقق بها من اطمئنان على سير العدالة في بلادنا وارتياح المصالح المواطنين في نطاق استقلال القضاء وتنظيم جهازه وتوحيده وإعادة هيكلة مختلف أصنافه ودرجاته وإحداث محاكم متخصصة واتخاذ تدابير تنظيمية وتشريعية لصالحه وصالح القضاة كي ينهض هذا القطاع الحيوي بدوره في ضمان الحقوق والحريات وفي ترسيخ سيادة الشرعية والقانون وتثبيت دولة الحق والعدل، وهو الدور الذي به يصبح القضاء مكونا فاعلا في التنمية بكل متطلباتها السياسية والاقتصادية والاجتماعية",
    fr: "Le règne de Notre Auguste Père, que Dieu ait son âme, a été marqué par de nombreuses réformes, qui sont un motif de fierté pour avoir contribué à l'instauration de la sérénité quant au fonctionnement de la justice dans Notre pays et la satisfaction quant à la protection des intérêts des citoyens, dans le cadre de l'indépendance de la justice, l'organisation de son appareil, son unification, la restructuration de ses différents degrés et catégories, la création de tribunaux spécialisés et l'adoption de mesures réglementaires et législatives à son profit et dans l'intérêt des magistrats, afin que ce secteur vital puisse assumer son rôle en matière de garantie des droits et libertés, de consécration de la prééminence de la légalité et de la loi et de consolidation de l'état de droit et de l'équité. C'est ce rôle qui fait de la justice une composante agissante dans le domaine du développement dans ses dimensions politique, économique et sociale.",
    vocabulary: [
      { fr: "Indépendance de la justice", ar: "استقلال القضاء", explanation: "المبدأ الدستوري والقانوني الكوني الذي يفصل السلطة القضائية عن التنفيذية والتشريعية." },
      { fr: "Tribunaux spécialisés", ar: "محاكم متخصصة", explanation: "المحاكم التي تنظر في نوع معين من القضايا كالمحاكم التجارية والإدارية." },
      { fr: "Prééminence de la légalité", ar: "سيادة الشرعية", explanation: "خضوع الجميع لقواعد القانون وسمو القوانين الدستورية والعادية فوق كل إرادة فردية." },
      { fr: "État de droit et de l'équité", ar: "دولة الحق والعدل (دولة الحق والقانون)", explanation: "نظام سياسي وقانوني يخضع فيه المواطنون والسلطات العامة لقوانين واضحة ومنصفة." },
      { fr: "Mesures réglementaires et législatives", ar: "تدابير تنظيمية وتشريعية", explanation: "المراسيم والقرارات (التنظيمية) الصادرة عن السلطة التنفيذية، والقوانين (التشريعية) الصادرة عن البرلمان." }
    ],
    analysis: "لاحظ ترجمة 'دولة الحق والعدل' بـ 'l'état de droit et de l'équité' حيث يُطلق مصطلح 'L'État de droit' عالمياً للتعبير عن خضوع الإدارة لحكم القانون، والإنصاف هنا يكمل مفهوم العدل الروحي."
  },
  {
    id: 5,
    title: "التكوين المستمر وتوسيع المحاكم المتخصصة (مجلس الدولة للشطط)",
    ar: "وعلى الرغم من كل ما تحقق فإننا نسعى إلى مزيد من التطوير والتحديث حتى نمكن قضاءنا من رفع التحديات التي تفرضها مشارفة الألفية الثالثة، مما يقتضي تكوينا مستمرا ومتفتحا يستوجب العناية بالمعهد الوطني للقضاء بإعادة هيكلته وتحسين برامجه وتحيين مناهج تأطيره وتجديد طرق عمله، وإن من شأن مثل هذا التكوين أن يؤهل جهازنا القضائي لمواكبة تجدد القوانين العالمية ولكسب ثقة الذين يرغبون في التعامل معنا، إضافة إلى كسب ثقة المواطنين. ورغبة منا في توسيع مجالات التطوير والتحديث قررنا الزيادة التدريجية في عدد المحاكم التجارية، كما قررنا إحداث محاكم استئناف إدارية في أفق إنشاء مجلس للدولة يتوج الهرم القضائي والإداري لبلادنا حتى تتسنى مواجهة كل أشكال الشطط وحتى يتاح ضمان سيادة الشرعية ودعم الإنصاف بين المتقاضين،",
    fr: "Les réalisations accomplies ne Nous dispensent nullement d'aspirer à davantage de progrès et de modernisation de manière à permettre à Notre justice de faire face aux défis qui se posent déjà à l'orée du troisième millénaire, ce qui implique une formation continue et ouverte et, partant, tout l'intérêt à accorder à l'Institut National des Etudes Judiciaires à travers sa restructuration, l'amélioration de ses programmes, l'actualisation de ses méthodes d'encadrement et la rénovation de ses modes de travail. Une telle formation est de nature à habiliter Notre appareil judiciaire à accompagner le renouvellement des législations dans le monde et à gagner, en plus de la confiance des citoyens, celle de tous ceux qui désirent être Nos partenaires. Désireux d'élargir les domaines d'évolution et de modernisation, Nous avons décidé d'augmenter progressivement le nombre des tribunaux de commerce, tout comme Nous avons décidé la création de cours d'appel administratives dans la perspective de mettre en place un Conseil d'Etat pour couronner la pyramide judiciaire et administrative de Notre pays et faire face ainsi à toutes les formes d'abus, assurer la prééminence de la légalité et faire prévaloir l'équité entre les justiciables.",
    vocabulary: [
      { fr: "L'orée du troisième millénaire", ar: "مشارفة الألفية الثالثة", explanation: "البدايات أو العتبة الزمنية لدخول الألفية الجديدة." },
      { fr: "Conseil d'État", ar: "مجلس للدولة", explanation: "المحكمة الإدارية العليا التي تتوج الهرم القضائي الإداري وتراقب مشروعية القرارات الإدارية." },
      { fr: "Abus de pouvoir (ou Abus)", ar: "الشطط في استعمال السلطة", explanation: "استخدام موظف عمومي أو إدارة عمومية لصلاحياتها في غير ما خصصت له قانوناً أو بطريقة مجحفة." },
      { fr: "Justiciables", ar: "المتقاضين", explanation: "الأفراد والمؤسسات الذين يخضعون لاختصاص المحاكم ويمتثلون أمامها لحسم النزاعات." },
      { fr: "Institut National des Études Judiciaires", ar: "المعهد الوطني للقضاء (حالياً المعهد العالي للقضاء)", explanation: "مؤسسة تكوين القضاة والملحقين القضائيين وكتاب الضبط وغيرهم من مهنيي القضاء." }
    ],
    analysis: "تظهر أهمية المصطلحات القضائية هنا؛ فكلمة 'المتقاضين' تُرجمت بـ 'justiciables' بدلاً من 'plaideurs' لأن الأخيرة تعني الخصوم المترافعين تحديداً، بينما 'Justiciables' تشمل كل خاضع لسلطة القضاء."
  },
  {
    id: 6,
    title: "حماية المال العام من العبث والاستغلال",
    ar: "وإننا لندعو حكومتنا للإسراع لإعداد القوانين المنظمة للمجلس الأعلى والمجالس الجهوية للحسابات باعتبارها إطارا قضائيا قائما لحماية المال العام من أن تمتد إليه أيدي العبث والتسيب واستغلال النفوذ، وباستكمال هذا الإطار الشامل لتحديث القضاء وتأهيله وعقلنة تدبير شؤونه وتوفير بنايات لائقة لمحاكمة وإمداده بالوسائل المادية والمعنوية، نكون قد عملنا على تفعيله وهيانا له أسباب القيام بما أنيط به من تحقيق العدالة الاجتماعي",
    fr: "Nous appelons Notre gouvernement à hâter la préparation des lois régissant la cour des comptes et les cours régionales des comptes, en tant que cadre judiciaire destiné à préserver les deniers publics contre toute tentation de dilapidation ou d'abus. A travers le parachèvement de ce cadre global visant la modernisation de la justice, sa mise à niveau, la rationalisation de la gestion de ses affaires, la réalisation d'édifices convenables pour ses instances et sa dotation en moyens matériels et moraux, Nous aurons œuvré à sa dynamisation et Nous lui aurons garanti les conditions lui permettant d'assumer la mission qui lui est dévolue pour l'instauration de la justice sociale.",
    vocabulary: [
      { fr: "Cour des comptes", ar: "المجلس الأعلى للحسابات", explanation: "الهيئة القضائية العليا المكلفة بمراقبة وتدقيق المالية العامة بالمملكة." },
      { fr: "Deniers publics", ar: "المال العام", explanation: "الأموال المخصصة للمنفعة العامة والمملوكة للدولة أو الجماعات الترابية." },
      { fr: "Dilapidation", ar: "العبث والتبديد", explanation: "صرف المال العام في غير أوجهه القانونية أو إهداره بدون مبرر وبسوء تدبير." },
      { fr: "Abus de confiance / Abus", ar: "التسيب واستغلال النفوذ", explanation: "استخدام المركز الوظيفي أو النفوذ لتحقيق مكاسب شخصية غير مشروعة." },
      { fr: "Parachèvement", ar: "استكمال", explanation: "إتمام وإنجاز المشروع بالكامل حتى يبلغ غايته النهائية." }
    ],
    analysis: "لاحظ ترجمة 'المال العام' بـ 'deniers publics' وهي عبارة فرنسية كلاسيكية متأصلة في القانون المالي الإداري تدل على الطابع الرسمي للأموال تحت وصاية المحاسب العمومي."
  },
  {
    id: 7,
    title: "شروط نزاهة القاضي واستقلال أحكامه",
    ar: "ومن البديهي أنه لن يحقق القضاء هذا المبتغى إلا إذا ضمنا لهيئته الحرمة اللازمة والفعالية الضرورية بجعل أحكامه الصادرة باسمنا تستهدف الإنصاف وفورية البت والتنفيذ وجريان مفعولها على من يعنيهم الأمر على أن تكون هذه الأحكام صادرة عن التطبيق السليم للقانون وفق مقتضيات نصوصه وما يمليه ضمير القاضي بمنأى عن كل أشكال الضغوط المادية والمعنوية وسائر الاعتبارات الذاتية والمؤثرات الخارجية.",
    fr: "La justice ne saurait, évidemment, atteindre cet objectif que si Nous garantissions à ce corps le respect et l'efficacité indispensables, en faisant en sorte que ses jugements, rendus en Notre Nom, visent l'équité, la célérité dans l'examen et l'exécution, et leur application effective vis-à-vis des intéressés, sachant que ces jugements doivent procéder d'une saine application de la loi, en conformité avec les dispositions de ses textes et l'intime conviction du magistrat, à l'abri de toutes formes de pression matérielle ou morale, des considérations subjectives et des influences extérieures.",
    vocabulary: [
      { fr: "Intime conviction", ar: "ما يمليه ضمير القاضي", explanation: "الاقتناع الصميمي الوجداني للقاضي بمدى صحة الأدلة والوقائع دون إكراه خارجي." },
      { fr: "Saine application de la loi", ar: "التطبيق السليم للقانون", explanation: "تفسير قواعد القانون وتطبيقها على النازلة بحياد ودون انحراف في السلطة." },
      { fr: "Célérité dans l'examen", ar: "فورية البت", explanation: "البحث والفصل في الدعاوى القضائية داخل آجال معقولة دون تماطل يضر بالمتقاضين." },
      { fr: "Influences extérieures", ar: "المؤثرات الخارجية", explanation: "أي تدخل أو ضغط من جهة غير قضائية يهدف إلى التأثير على حياد القاضي وقراره." },
      { fr: "Rendus en Notre Nom", ar: "الصادرة باسمنا", explanation: "الصيغة التنفيذية للأحكام بالمملكة المغربية والتي تصدر وتنفذ باسم جلالة الملك." }
    ],
    analysis: "مصطلح 'ضمير القاضي' تمت ترجمته بشكل رائع بـ 'l'intime conviction du magistrat' وهو مفهوم قانوني شهير في المسطرة الجنائية الفرنسية والمغربية يعني القناعة الوجدانية الخالصة للعدالة."
  }
];

const SPEECH_SECTIONS_2001: SpeechSection[] = [
  {
    id: 1,
    title: "النهوض بأوضاع المرأة وإعلاء كرامتها في ظل الشريعة",
    ar: "لقد آلينا على نفسنا، منذ اعتلينا عرش أسلافنا المنعمين أن نواصل النهوض بأوضاع المرأة المغربية في كل مجالات الحياة الوطنية، وأن نرفع كل أشكال الحيف الذي تعانيه من منطلق صفتنا أميرا للمؤمنين وحاميا لحمى الملة والدين، ملتزمين بشريعة الإسلام فيما أحلت وحرمت أو أباحت وعملا بترسيخ قيم العدل والمساواة بين الرجل والمرأة، مصداقا لقول جدنا المصطفى عليه الصلاة والسلام، إنما النساء شقائق الرجال في الأحكام».",
    fr: "Nous Nous sommes attaché, depuis Notre accession au trône de Nos glorieux ancêtres, à poursuivre les actions en faveur de la promotion de la condition de la femme dans tous les secteurs d'activité de la nation et à l'affranchir de toutes les formes d'injustice qu'elle subit. Nous Nous y employons en Notre qualité d'Amir Al Mouminine, défenseur de la religion et de la communauté de ses adeptes. Nous adhérons pleinement et au même titre, à la Charia dans tout ce qu'elle prescrit de licite, d'illicite ou de loisible. Oeuvrant pour raffermir les valeurs de justice et d'égalité entre l'homme et la femme, Nous confirmons, de la sorte, ces paroles de notre ancêtre Sidna Mohammed prière et paix soient sur lui :>>Les femmes sont assurément les sœurs des hommes dans les prescriptions.>>>>",
    vocabulary: [
      { fr: "Amir Al Mouminine", ar: "أمير المؤمنين", explanation: "الصفة الدستورية والدينية السامية لجلالة الملك بالمغرب بوصفه رئيس الدولة وحامي حمى الدين والملة." },
      { fr: "Affranchir de toutes les formes d'injustice", ar: "نرفع كل أشكال الحيف", explanation: "التحرر ورفع الظلم أو الجور والتمييز السلبي الذي كان يطال المرأة في المجتمع." },
      { fr: "Les femmes sont assurément les sœurs des hommes dans les prescriptions", ar: "إنما النساء شقائق الرجال في الأحكام", explanation: "الحديث النبوي الشريف الذي يؤسس للمساواة التامة في التكريم والمسؤولية والعدالة الإنسانية." },
      { fr: "Prescrit de licite, d'illicite ou de loisible", ar: "فيما أحلت وحرمت أو أباحت", explanation: "الأحكام التكليفية والشرعية في الفقه الإسلامي المنظمة للمعاملات والأحوال." }
    ],
    analysis: "تأكيد جلالة الملك على كونه 'حامياً لحمى الملة والدين' بصفته 'أميراً للمؤمنين' (Amir Al Mouminine) والالتزام بالشريعة والحديث الشريف 'إنما النساء شقائق الرجال' (Les femmes sont les sœurs des hommes) لترسيخ قيم العدل والمساواة."
  },
  {
    id: 2,
    title: "الوسطية الإسلامية وتماسك خلية الأسرة",
    ar: "واعتبارا لكون الشريعة الإسلامية قائمة على الوسطية والاعتدال وتحري مقاصد الإصلاح الاجتماعي، فإننا حريصون على ضمان حقوق النساء والرجال على حد سواء، غايتنا في ذلك تماسك الأسرة وتضامن أفرادها وتثبيت التقاليد المغربية الأصيلة القائمة على روح المودة والوئام والتكافل الاجتماعي الذي نحن مؤتمنون على استمراره، ولا سيما في نواته الأساسية المتمثلة في الأسرة.",
    fr: "La Charia islamique est fondée sur le juste milieu et la pondération ainsi que sur la quête du redressement et du mieux-être de la société ce qui constitue, du reste, la finalité ultime de toute démarche. Aussi, avons-Nous le souci de garantir les droits des femmes au même titre que ceux des hommes. Nous entendons, au-delà of cet objectif, préserver la cohésion de la famille, unie et solidaire, et raffermir les traditions marocaines authentiques dans un esprit d'entente, de concorde et d'entraide sociale. Car, Nous avons pour mission d'en assurer la pérennité, notamment dans sa cellule de base qu'est la famille.",
    vocabulary: [
      { fr: "Le juste milieu et la pondération", ar: "الوسطية والاعتدال", explanation: "ميزات الشريعة الإسلامية السمحة المبتعدة عن الغلو والتشدد والتفريط." },
      { fr: "Cohésion de la famille", ar: "تماسك الأسرة", explanation: "الحفاظ على تلاحم الروابط العائلية وحمايتها من التفكك والانحلال." },
      { fr: "Cellule de base", ar: "النواة الأساسية", explanation: "الوصف السوسيولوجي والقانوني الدقيق للأسرة بوصفها اللبنة الأساسية لبناء المجتمع." },
      { fr: "Entraide sociale", ar: "التكافل الاجتماعي", explanation: "التعاون والتضامن والتآزر المادي والمعنوي بين أفراد المجتمع والأسرة." }
    ],
    analysis: "يقترن مفهوم 'الوسطية والاعتدال' بـ 'juste milieu et pondération' ليعكس وسطية الشريعة ومقاصد الإصلاح الاجتماعي، مع التركيز على أن الأسرة هي 'الcellule de base' (النواة الأساسية)."
  },
  {
    id: 3,
    title: "تأسيس وتنصيب اللجنة الاستشارية الخاصة بمدونة الأحوال الشخصية",
    ar: "وفي سياق هذا التوجه كان استقبالنا لممثلات عن الهيئات السياسية والمنظمات والجمعيات النسوية المغربية. كما كان قرارنا بإنشاء لجنة خاصة يسعدنا اليوم أن نتولى تنصيبها ، مكلفين إياها بالنظر في الآليات والمساطر التي تضمن تطبيقا سليما لمدونة الأحوال الشخصية، وكذا الانكباب على إعداد مشروع مراجعة لها.",
    fr: "C'est dans cet esprit, que Nous avons reçu les représentantes des formations politiques, des organisations et des associations féminines marocaines. C'est également dans cette perspective que Nous avons décidé de former la commission spéciale que Nous avons le plaisir d'installer dans ses fonctions aujourd'hui. Nous lui confions la mission d'examiner les mécanismes et les procédures propres à garantir la bonne application des dispositions de la Moudawana, et à s'atteler parallèlement, à l'élaboration d'un projet de révision de ce texte.",
    vocabulary: [
      { fr: "Moudawana", ar: "مدونة الأحوال الشخصية", explanation: "الاسم التاريخي لمدونة الأسرة بالمغرب التي كانت تنظم العلاقات العائلية." },
      { fr: "Formations politiques", ar: "الهيئات السياسية", explanation: "الأحزاب والمجموعات السياسية الممثلة لمختلف شرائح وتوجهات المجتمع." },
      { fr: "Procédures propres à garantir la bonne application", ar: "المساطر التي تضمن تطبيقا سليما", explanation: "الإجراءات والتدابير القانونية والقضائية الكفيلة بتفعيل نصوص القانون بشكل صحيح." },
      { fr: "Projet de révision", ar: "مشروع مراجعة", explanation: "الخطة أو المسودة القانونية الرامية إلى تعديل وتحيين المقتضيات التشريعية لتلائم التطورات." }
    ],
    analysis: "تُرجمت 'مدونة الأحوال الشخصية' بلفظها المعرب والشائع في الفقه والترجمة القانونية 'Moudawana' مع تكليف اللجنة بمهمتين: الضمان الإجرائي للمدونة وتعديلها (projet de révision)."
  },
  {
    id: 4,
    title: "معايير اختيار أعضاء اللجنة والتمثيلية النسوية",
    ar: "وقد راعينا في اختيار أعضاء هذه اللجنة الاستشارية أن تكون ممثلة للجانب الفقهي والقضائي العلمي. كما راعينا فيها حضور العنصر النسوي حريصين على أن يكون جميع أعضائها يتحلون بالكفاية العالية، وبالموضوعية والحياد وبالخبرة في المجالات التي ينتمون إليها. وأسندنا رئاستها للأستاذ إدريس الضحاك لما يتوافر له من مؤهلات شخصية رفيعة ونزاهة فكرية وخبرة قضائية.",
    fr: "Nous avons tenu à ce que cette commission consultative reflète, dans sa composition, le volet jurisprudentiel, judiciaire et scientifique et fasse apparaître la présence de l'élément féminin. Nous avons veillé également à ce que tous ses membres soient hautement qualifiés, neutres, objectifs et expérimentés dans leurs domaines de compétence. Nous avons confié la présidence de la commission à Monsieur Driss Dahhak en considération de ses hautes qualités personnelles, de sa probité intellectuelle et de son expérience dans le domaine judiciaire.",
    vocabulary: [
      { fr: "Volet jurisprudentiel", ar: "الجانب الفقهي", explanation: "المنظور العلمي والشرعي المستنبط للأحكام الفرعية من أدلتها التفصيلية." },
      { fr: "Élément féminin", ar: "العنصر النسوي", explanation: "المشاركة الفاعلة للمرأة في صياغة القوانين المتعلقة بحياتها وأسرتها لضمان التوازن والواقعية." },
      { fr: "Probité intellectuelle", ar: "النزاهة الفكرية", explanation: "الالتزام بالصدق العلمي والموضوعية والترفع عن التحيزات المسبقة والتحجر الفكري." },
      { fr: "Expérimentés", ar: "الخبرة والموضوعية", explanation: "التمتع بالدراية العملية والحياد العلمي اللازم لإصدار آراء صائبة ومتوازنة." }
    ],
    analysis: "لاحظ ترجمة 'النزاهة الفكرية' بـ 'probité intellectuelle' لربط الاستقامة الأخلاقية بجودة المجهود الفكري للجنة الاستشارية التي ترأسها الفقيه القانوني د. إدريس الضحاك."
  },
  {
    id: 5,
    title: "مراعاة مقاصد الشريعة وإنصاف المرأة دون غلو أو تنكر للهوية",
    ar: "وإننا لعلى يقين من أنكم حضرات الأعضاء ستكونون في مستوى المسؤولية التي نعهد بها إليكم لإنجازها ، طبقا لما أنتم ملزمون به من مراعاة مقاصد الشريعة السمحة وإنصاف المرأة وتجسيد تكريمها كما أراد لها الإسلام ذلك، ووفق ما تمليه عليكم ضمائركم الحية وخبرتكم بالواقع الاجتماعي المغربي. وبذلك سنكون قد عملنا على تحرير المرأة من كل ما يعوق مواصلة مساهمتها الفعالة في بناء المجتمع المغربي المتضامن دون تطرف أو تحجر أو تنكر لهويتنا المغربية الإسلامية الثابتة.",
    fr: "Nous sommes convaincu que vous, distingués membres de la commission, saurez vous hisser au niveau des responsabilités que nous vous confions et accomplir votre mission selon ce que dicte le devoir qui vous incombe de garder à l'esprit la finalité ultime des prescriptions généreuses de la Charia et d'être équitables et bienveillants à l'égard de la femme, comme le prescrit l'Islam. Vous agirez en votre âme et conscience et selon votre appréciation de la réalité sociale du Maroc telle que vous l'avez côtoyée et pratiquée. Ainsi nous aurons oeuvré à affranchir la femme de toutes les entraves qui l'empêchent d'apporter sa pleine contribution à l'édification d'une société marocaine solidaire et prémunie contre l'extrémisme et le fanatisme, sans jamais renier notre identité marocaine islamique immuable.",
    vocabulary: [
      { fr: "Finalité ultime des prescriptions de la Charia", ar: "مقاصد الشريعة السمحة", explanation: "الأهداف الكبرى والغايات الإنسانية للشريعة الإسلامية مثل جلب المصالح ودرء المفاسد." },
      { fr: "En votre âme et conscience", ar: "ما تمليه ضمائركم الحية", explanation: "الوازع الأخلاقي والمهني الذاتي الباطن الذي يوجه سلوك القاضي أو الفقيه." },
      { fr: "Extrémisme et fanatisme", ar: "التطرف والتحجر", explanation: "الانغلاق الفكري وعدم القدرة على التجديد والاجتهاد والتشدد المذموم في تطبيق الأحكام." },
      { fr: "Identité marocaine islamique immuable", ar: "الهوية المغربية الإسلامية الثابتة", explanation: "الركائز التاريخية والحضارية المشكلة للشخصية والكيان الوطني المغربي." }
    ],
    analysis: "تُرجمت 'مقاصد الشريعة' بـ 'finalité ultime des prescriptions de la Charia'، وصيغت 'التطرف والتحجر' بـ 'extrémisme et fanatisme'، مما يبرز التزام المغرب بالوسطية والاعتدال."
  },
  {
    id: 6,
    title: "المكتسبات التاريخية للمرأة المغربية في عهد جلالة الملكين محمد الخامس والحسن الثاني",
    ar: "حضرات السيدات والسادة، لقد تحقق بفضل النهج المتبصر والعمل الريادي لكل من جدنا ووالدنا المنعمين جلالة الملكين محمد الخامس والحسن الثاني، أكرم الله مثواهما ، العديد من المكاسب للمرأة المغربية، كان من بينها الإصلاح الذي أدخل على مدونة الأحوال الشخصية في عهد والدنا المنعم، طيب الله ثراه.",
    fr: "Mesdames et Messieurs, Grâce à la démarche clairvoyante adoptée par Nos regrettés Grand-père et Père, feu Sa Majesté le Roi Mohammed V et feu Sa Majesté le Roi Hassan II que Dieu ait leur âme, et au travail de précurseur qu'ils ont accompli, la femme marocaine a pu inscrire à son actif beaucoup de réalisations et d'acquis, notamment les amendements apportés à la Moudawana, du temps de Notre Auguste Père que Dieu l'ait en sa sainte miséricorde -.",
    vocabulary: [
      { fr: "Démarche clairvoyante", ar: "النهج المتبصر", explanation: "الرؤية الاستراتيجية الذكية والمستشرفة للمستقبل في قيادة ورش النهوض بالمرأة." },
      { fr: "Travail de précurseur", ar: "العمل الريادي", explanation: "المبادرات والجهود السباقة والتأسيسية التي مهدت الطريق للتطور الاجتماعي للمرأة." },
      { fr: "Réalisations et acquis", ar: "المكاسب والإنجازات", explanation: "الحقوق والامتيازات والضمانات التي حصلت عليها المرأة وتراكمت عبر مسار الإصلاح الوطني." },
      { fr: "Auguste Père", ar: "والدنا المنعم", explanation: "تعبير ملكي راقٍ ومهيب للإشارة إلى جلالة المغفور له الملك الحسن الثاني طيب الله ثراه." }
    ],
    analysis: "تعبيرات ملكية غاية في الرقي مثل 'démarche clairvoyante' لـ 'النهج المتبصر' و'travail de précurseur' لـ 'العمل الريادي' تبرز استمرارية البناء التاريخي لمنظومة الحقوق بالمغرب."
  },
  {
    id: 7,
    title: "رصد ثغرات تفعيل الإصلاح واستيعاب المستجدات الاجتماعية",
    ar: "غير أن عدم التحلي بفضائل السلوك الإسلامي القويم في المعاملة الأسرية، إلى جانب عدم التفعيل الكامل لذلك الإصلاح، وتزايد وعي المرأة بحقوقها وواجباتها بفعل التقدم الذي حققه المغرب، وانخراطها الفاعل في مختلف مناحي الحياة الوطنية، كل ذلك يملي علينا رصد مقتضيات المدونة التي تحتاج إلى تفعيل واستيعاب ما تمليه الظروف الاجتماعية المتغيرة والقضايا المستجدة وجعل كل ذلك في مقدمة ما تنشغل به اللجنة وتقترح له الأحكام المناسبة.",
    fr: "Toutefois, le relâchement des vertus de la bonne conduite prescrite par l'Islam dans les rapports au sein de la famille, ainsi que la non-application intégrale de la réforme précitée de la Moudawana et la prise de conscience grandissante que manifeste la femme à l'égard de ses droits et de ses obligations, suite aux progrès enregistrés au Maroc et à l'insertion active de la femme dans les divers secteurs d'activité de la nation, sont autant de facteurs qui nous commandent de recenser les dispositions de la Moudawana qui nécessitent d'être mises en application de façon effective et de tenir compte des contraintes imposées par les mutations sociales et les préoccupations de l'heure. Ainsi, la commission pourra se pencher sur ces questions en priority et proposer les solutions appropriées.",
    vocabulary: [
      { fr: "Relâchement des vertus", ar: "عدم التحلي بفضائل السلوك", explanation: "التراجع أو التراخي في تطبيق القيم والمبادئ الأخلاقية القويمة للإسلام داخل كنف الأسرة." },
      { fr: "Prise de conscience grandissante", ar: "تزايد وعي المرأة", explanation: "تنامي النضج الثقافي والحقوقي والاجتماعي للمرأة ومعرفتها الدقيقة لحقوقها القانونية والتزاماتها." },
      { fr: "Mutations sociales", ar: "الظروف الاجتماعية المتغيرة", explanation: "التحولات والديناميات الكبرى التي تطرأ على نسيج وبنية المجتمع بمرور الزمن." },
      { fr: "Préoccupations de l'heure", ar: "القضايا المستجدة / شاغل الساعة", explanation: "الملفات الساخنة والنوازل العصرية التي تقتضي حلولاً واجتهادات فقهية فورية وواقعية." }
    ],
    analysis: "يتم استخدام عبارة 'relâchement des vertus' كمعادل بليغ لـ 'عدم التحلي بفضائل السلوك' في السياق الأسري، بينما قوبلت 'المستجدات والظروف الاجتماعية المتغيرة' بـ 'mutations sociales et préoccupations de l'heure'."
  },
  {
    id: 8,
    title: "المزاوجة الخلاقة بين ثوابت الدين وكونية حقوق الإنسان",
    ar: "ولن يتأتى لنا ذلك إلا بمزاوجة خلاقة بين التشبث بثوابتنا الدينية التي تشكل جوهر هويتنا وبين الانسجام التام مع روح العصر المتسمة بالطابع الكوني لحقوق الإنسان، وفي إطار الاجتهاد الذي أنتم مكلفون به، وتحقيقا لمقاصد الشريعة السمحة في تحكيم المصلحة المشتركة بين أعضاء الأسرة في ظل التوازن المحكم بين الحقوق والواجبات مصداقا لقوله تعالى : ولهن مثل الذي عليهن بالمعروف.",
    fr: "Cependant, rien de tout cela ne pourra se concrétiser sans un dosage subtil qui permette de concilier entre, d'une part, l'attachement aux valeurs immuables qui forment le socle de notre identité, et d'autre part, l'adhésion pleine et entière à l'esprit du temps caractérisé notamment par l'universalité des Droits de l'Homme. Cet effort doit s'accomplir dans le cadre de la mission d' «Ijtihad» qui vous est confiée et dans l'esprit des desseins généreux de la Charia qui consistent, justement, à faire prévaloir l'intérêt général des membres de la communauté, dans le strict équilibre entre les droits et les obligations, conformément à ces paroles divines »elles ont autant de droits que d'obligations, selon le bon usage».",
    vocabulary: [
      { fr: "Un dosage subtil", ar: "مزاوجة خلاقة", explanation: "الربط المتوازن والذكي والدقيق الذي لا يخل بأي من المكونين: الأصالة والمعاصرة." },
      { fr: "Valeurs immuables", ar: "ثوابتنا الدينية", explanation: "المبادئ والعقائد والأحكام القطعية في الدين الإسلامي التي لا تقبل التغيير أو التبديل بتغير الأزمنة." },
      { fr: "Universalité des Droits de l'Homme", ar: "الطابع الكوني لحقوق الإنسان", explanation: "المواثيق والإعلانات الدولية التي تقر حقوقاً أصيلة لكافة البشر بقطع النظر عن الخصوصيات." },
      { fr: "Strict équilibre", ar: "التوازن المحكم", explanation: "العدالة والمساواة المثلى التي تمنع تغول طرف على الآخر في منظومة الحقوق والواجبات المتبادلة." }
    ],
    analysis: "تعبير 'مزاوجة خلاقة' تُرجم بـ 'un dosage subtil' للتعبير عن تحقيق التوافق السلس بين 'ثوابت الهوية' (valeurs immuables) و'كونية حقوق الإنسان' (universalité des Droits de l'Homme)."
  },
  {
    id: 9,
    title: "تنزيل الأحكام منازلها وسلوك الاعتدال والتوافق وحوار الشركاء",
    ar: "وإننا لنحث هذه اللجنة الموقرة التي نحيطها بكامل رعايتنا أن تتحلى بأعلى درجات الوعي بمسؤوليتها الجسيمة في الحفاظ على مقاصد الشريعة الإسلامية، ومحكم نصوصها ، وأن تلتزم الموضوعية والفهم العميق لواقعنا الاجتماعي، وأن تنزل الأحكام منازلها من حيث مراعاة الضرورة والمصلحة العامة التي حكمها الشرع في كثير من القضايا والأحكام، دون أن تتقيد باجتهاد سابق كان له ما يبرره في زمانه وبيئته. وفي هذا السياق، فإن اللجنة مطالبة بالإصغاء إلى كل الأطراف المعنية وفتح الأبواب أمامها للإدلاء بآرائها والوقوف على مطالبها بإمعان وتبصر ورحابة صدر. وإننا لننتظر من هذه اللجنة أن تستوعب جسامة الأمانة الملقاة عليها ، مستحضرة ما للأسرة المغربية من حرمات نحرص على صيانتها ، سالكة مسلك الاعتدال والتوافق لبلوغ ما ننشده جميعا لوطننا من حفاظ على هويته الإسلامية ومن تقدم اجتماعي وتأهيل شامل لكل طاقاته ومكوناته وتضافر جهود نسائه ورجاله، في إطار من الكرامة والمساواة والإنصاف من أجل رفع ما يواجهه من تحديات داخلية وخارجية. وفقكم الله ورعاكم وسدد خطاكم لما فيه خير هذا البلد الأمين. وقل اعملوا فسيرى الله عملكم ورسوله والمؤمنون». صدق الله العظيم. والسلام عليكم ورحمة الله تعالى وبركاته",
    fr: "Nous exhortons cette commission que Nous assurons de toute notre sollicitude, à prendre toute la mesure des responsabilités dont elle a la charge, pour la préservation des desseins de la Charia islamique et l'appréciation rigoureuse de ses textes. Nous l'engageons à s'astreindre au devoir d'objectivité, à cerner notre réalité sociale, à assigner à chacune des prescriptions la place qui lui revient, en ayant constamment en vue ce qui est nécessaire et ce qui relève de l'intérêt général. Ces deux considérations ont, en effet, aux yeux de la Charia, la prééminence sur les autres, dans beaucoup de situations et de cas de figure. Pour autant, la commission ne doit pas s'estimer liée par des précédents jurisprudentiels qui avaient certainement leur justification à leur époque et dans le milieu qui était le leur. Dans ce contexte, il appartient à la commission d'être à l'écoute de toutes les personnalités, les instances, les organisations, les associations et other parties concernées, laissant à chacune toute latitude d'exposer son point de vue, et examinant leurs doléances avec application et discernement, en faisant preuve de patience et de disponibilité. Nous attendons de la commission qu'elle apprécie à sa juste valeur l'ampleur de la mission dont elle a la charge, en gardant à l'esprit les valeurs sacrées qui caractérisent la famille marocaine et que Nous Nous efforçons de préserver. Nous l'engageons à emprunter la voie de la modération et du consensus, afin de concrétiser les vœux que nous formons tous pour notre patrie. La sauvegarde de son identité islamique, le progrès social et la mise à niveau de ses potentialités, ses ressources et ses atouts, dans le cadre d'actions concertées, menées conjointement par ses femmes et ses hommes, dans la dignité et dans un esprit d'égalité et d'équité, sont autant d'objectifs à rechercher, afin que notre pays puisse relever les défis, tant internes qu'externes, qui l'attendent. Puisse Dieu bénir et couronner de succès les efforts que vous déployez dans l'intérêt de ce pays paisible. <<Dis: Agissez! Dieu verra vos actions ainsi que le Prophète et les croyants». Véridique est la parole de Dieu le Tout Puissant. WA Salamou Alaikoum WA Rahmatou Allah Wa Barakatouh.",
    vocabulary: [
      { fr: "Assigner à chacune des prescriptions la place qui lui revient", ar: "تنزل الأحكام منازلها", explanation: "إعمال القواعد الأصولية السليمة بمراعاة مقاصد الشريعة والظروف المحيطة بالتطبيق الفعلي." },
      { fr: "Précédents jurisprudentiels", ar: "باجتهاد سابق", explanation: "الاجتهادات التاريخية والآراء الفقهية القديمة التي ارتبطت ببيئة وزمان معينين ولم تعد صالحة للتنزيل المعاصر." },
      { fr: "Toute latitude d'exposer son point de vue", ar: "الإصغاء إلى كل الأطراف وفتح الأبواب", explanation: "تفعيل المقاربة التشاركية والاستماع المتبصر لكافة أطياف المجتمع والمنظمات النسوية والمدنية." },
      { fr: "Voie de la modération et du consensus", ar: "مسلك الاعتدال والتوافق", explanation: "انتهاج التراضي والحلول الوسطى المقبولة شرعياً ومجتمعياً لبلوغ الإجماع في إصلاح قوانين الأسرة." }
    ],
    analysis: "يرسم الخطاب الملكي منهجية عمل اللجنة: عدم التقيد بالاجتهادات السابقة التي تجاوزها الزمن (ne pas s'estimer liée par des précédents jurisprudentiels) وضرورة الانفتاح والحوار والإصغاء لكافة الشركاء والفاعلين."
  }
];

const SPEECH_SECTIONS_2002: SpeechSection[] = [
  {
    id: 1,
    title: "تقلد الأمانة وإصلاح وتحديث القضاء",
    ar: "ما فتئنا منذ تقلدنا الأمانة العظمى لقيادة شعبنا، والتي يعتبر القضاء من صميم مسؤولياتها ، نوجه حكومتنا والبرلمان إلى الأهمية القصوى التي توليها لإصلاح القضاء وتحديثه وتأهيله للإسهام الفعال في المشروع المجتمعي الديمقراطي الحداثي الذي نسهر على تحقيقه.",
    fr: "Depuis que Nous assumons la mission suprême de guider Notre peuple, mission dont la justice constitue intrinsèquement une des charges essentielles, Nous ne cessons de souligner, à l'intention de Notre gouvernement et du Parlement, tout l'intérêt que Nous attachons à la réforme et la modernisation de la justice et à sa mise à niveau pour qu'elle apporte son concours efficace au projet sociétal démocratique et moderniste que Nous Nous efforçons de concrétiser.",
    vocabulary: [
      { fr: "Assumer la mission suprême", ar: "تقلد الأمانة العظمى", explanation: "تعبير سيادي رسمي يدل على تحمل المسؤولية العليا لقيادة الدولة والشعب." },
      { fr: "Intrinsèquement", ar: "من صميم", explanation: "بشكل ذاتي وجوهري لا ينفصل عن الشيء وعضوي فيه." },
      { fr: "Mise à niveau", ar: "تأهيله", explanation: "عملية التحديث والتطوير لرفع القدرة والأداء ليتناسب مع المعايير القانونية والتنموية المطلوبة." },
      { fr: "Projet sociétal", ar: "المشروع المجتمعي", explanation: "الرؤية التنموية المتكاملة لبناء مجتمع ديمقراطي حديث ومتطور." }
    ],
    analysis: "لاحظ استخدام صيغة الجمع الملكية السامية 'Nous assumons' و 'Notre' لترجمة 'تقلدنا' و 'شعبنا'، واستعمال كلمة 'Intrinsèquement' للتعبير الدقيق عن لفظ 'من صميم'."
  },
  {
    id: 2,
    title: "المسؤولية الجسيمة للقضاة في إصلاح العدالة",
    ar: "وقد أبينا اليوم، ومن خلال رئاستنا لافتتاح دورة المجلس الأعلى للقضاء إلا أن نتوجه إلى هذا المجلس ومن خلاله إلى كافة أسرة العدل بخطاب مباشر يستهدف إبراز مدى المسؤولية الجسيمة الملقاة على عاتق القضاة أنفسهم في إصلاح الجهاز المؤتمن على العدل الذي يتوقف عليه كسبنا لرهان الديمقراطية والتنمية.",
    fr: "En présidant, today, l'ouverture de cette session du Conseil Supérieur de la Magistrature, Nous tenions à adresser à cette instance, et à travers elle, à l'ensemble de la famille de la justice, un discours direct, visant à mettre en relief les responsabilités considérables qui incombent aux magistrats eux-mêmes, dans la réforme de l'appareil ayant en charge la justice dont dépend la réussite du pari de la démocratie et du développement.",
    vocabulary: [
      { fr: "Responsabilités considérables", ar: "المسؤولية الجسيمة", explanation: "الواجبات الكبرى والهامة والخطيرة الملقاة على عاتق القائمين بالمهام القضائية." },
      { fr: "Incomber à", ar: "الملقاة على عاتق / تقع على", explanation: "فعل قانوني يعبر عن وجوب القيام بالالتزام أو الواجب من طرف شخص معين." },
      { fr: "La famille de la justice", ar: "أسرة العدل", explanation: "تعبير مجازي رسمي يضم القضاة، والمحامين، وكتاب الضبط، وسائر المهنيين القضائيين." },
      { fr: "Réussite du pari", ar: "كسب الرهان", explanation: "تحقيق النجاح في الأهداف الاستراتيجية الكبرى كالديمقراطية والتنمية في المغرب." }
    ],
    analysis: "تمت ترجمة 'أسرة العدل' بـ 'famille de la justice' وهو مصطلح إداري وقضائي مستخدم بكثرة للدلالة على الهيئة المتكاملة للعدالة."
  },
  {
    id: 3,
    title: "بناء دولة الحق وضمان سيادة القانون ومساواة الجميع",
    ar: "وإننا لنعتبر أن قضاء واعيا كل الوعي بحتمية هذا الرهان ومؤهلا لاستيعاب التحولات التي يعرفها المغرب، لهو القادر وحده على رفع هذا التحدي، مواصلا ومعززا رسالته التقليدية المتمثلة في السهر على ضمان النظام العام وتأمين السلم الاجتماعي مستجيبا في نفس الوقت لمتطلبات جديدة تتمثل في ضرورة حرص القضاء على التفعيل والتجسيد الملموسين المفهوم ومضمون بناء الديمقراطية ودولة الحق بضمان سيادة القانون ومساواة الجميع أمامه في جميع الظروف والأحوال.",
    fr: "Nous considérons que seule une justice pleinement consciente de l'inéluctabilité de ces enjeux et capable d'intégrer les mutations que connaît le Maroc, est apte à relever ce défi, poursuivant et consolidant ainsi sa mission traditionnelle qui consiste à assurer le respect de l'ordre et la paix sociale. Cette justice doit aussi répondre à de nouvelles exigences, à savoir, donner sens et consistance à l'édification de l'Etat de droit et conférer un contenu concret et palpable à la démocratie, en assurant, à tout moment et en toute circonstance, la primauté de la loi et l'égalité de tous devant elle.",
    vocabulary: [
      { fr: "Inéluctabilité", ar: "حتمية", explanation: "الضرورة القانونية والاجتماعية التي لا مفر منها ولا يمكن تجنبها." },
      { fr: "Paix sociale", ar: "السلم الاجتماعي", explanation: "حالة الطمأنينة والاستقرار الداخلي للمجتمع وضمان تعايشه السلمي تحت سيادة القانون." },
      { fr: "Primauté de la loi", ar: "سيادة القانون", explanation: "المبدأ الأساسي الذي يقتضي سمو القانون فوق الجميع وخضوع سائر السلطات له." },
      { fr: "L'égalité de tous devant elle", ar: "مساواة الجميع أمامه", explanation: "مبدأ دستوري يمنع التمييز بين المواطنين أمام أحكام وسلطة القضاء والقانون." }
    ],
    analysis: "تمت ترجمة 'سيادة القانون' بـ 'la primauté de la loi' وهي تعني حرفياً سمو القانون، وهي مرادفة لـ 'prééminence de la légalité' ولكن بتركيز أكبر على التشريع المكتوب."
  },
  {
    id: 4,
    title: "توفير الأمن القانوني والقضائي لتعزيز الاستثمار",
    ar: "كما يجب على القضاء أن يوفر الرؤية التوقعية الحقوقية المطمئنة والموضحة للضمانات التي يكفلها القانون، معززا بذلك مناخ الثقة التي تعد حجر الزاوية للاقتصاد الليبرالي، مساهما في النهوض بالاستثمار والنماء الاقتصادي",
    fr: "La justice doit, en outre, assurer la prévisibilité et la sécurité juridiques qui précisent les protections garanties par la loi, et donc instaurer la confiance, clef de voûte de l'économie libérale, et par la-même, contribuer à la relance des investissements et à la croissance économique.",
    vocabulary: [
      { fr: "La sécurité juridique", ar: "الرؤية التوقعية الحقوقية (الأمن القانوني)", explanation: "استقرار القواعد القانونية ووضوحها بحيث يمكن للمواطن والمستثمر توقع نتائج تصرفاته مسبقاً." },
      { fr: "Clef de voûte", ar: "حجر الزاوية", explanation: "العنصر الأساسي والجوهري الذي يرتكز عليه البناء بأكمله (في الأصل المعماري: حجر العقد)." },
      { fr: "Relance des investissements", ar: "النهوض بالاستثمار", explanation: "تنشيط وتحفيز تدفق الرساميل لإحداث مشاريع إنتاجية وتنموية جديدة." }
    ],
    analysis: "تُرجم تعبير 'الرؤية التوقعية الحقوقية' بمفهوم 'la prévisibilité et la sécurité juridiques' وهو المفهوم العلمي الحديث للأمن القانوني والقضائي الضروري لحماية الحقوق وتشجيع الاستثمار."
  },
  {
    id: 5,
    title: "تأهيل وتطهير القضاء ومسلسل البناء",
    ar: "لذا حرصنا على إعادة الاعتبار للقضاء وتأهيله وتطهيره من كل النقائص والشوائب المشينة، محددين بكل حزم ووضوح سبيل الإصلاح الذي لا مناص منه. وقد تحقق بالفعل تقدم لا جدال فيه، حيث تم إيقاف مسلسل التدهور والمضي قدما في عملية إعادة البناء وعصرنة العدالة مما مكن من تعزيز الاستقلال الفعلي للقضاء وتقوية سلطته في تجسيد المساواة أمام القانون والإسراع في تنفيذ الأحكام.",
    fr: "Aussi, Nous sommes-Nous attaché à réhabiliter la justice, à la mettre à niveau et à la débarrasser de toutes les tares et les carences, en traçant clairement et fermement le chemin de l'inéluctable réforme. Des progrès indéniables ont été accomplis; le processus de détérioration a été stoppé et le travail de reconstruction et de modernisation de la justice est largement entamé. De fait, l'indépendance de la justice s'en trouve confortée, et son autorité renforcée pour concrétiser l'égalité devant la loi et accélérer l'exécution des jugements.",
    vocabulary: [
      { fr: "Réhabiliter", ar: "إعادة الاعتبار", explanation: "إرجاع المكانة والاعتبار والتقدير لقطاع أو شخص واستعادة هيبته وهيبته المؤسساتية." },
      { fr: "Les tares et les carences", ar: "النقائص والشوائب المشينة", explanation: "العيوب والاختلالات والسلبيات التي تؤثر على جودة ومصداقية العمل القضائي." },
      { fr: "Exécution des jugements", ar: "تنفيذ الأحكام", explanation: "إخراج الحكم القضائي الحائز لقوة الشيء المقضي به إلى حيز التطبيق الفعلي بسلطة القانون." }
    ],
    analysis: "لاحظ ترجمة 'الشوائب المشينة' بـ 'les tares' وهي لفظة قوية قانونياً تدل على العيوب الجوهرية التي تضر بصورة وأداء الجهاز العدلي."
  },
  {
    id: 6,
    title: "دور المحاكم المتخصصة والقضاء الفردي",
    ar: "وفيما أخذت المحاكم الإدارية والتجارية تعطي ثمارها في مجال ترسيخ سيادة القانون، سواء في علاقات الإدارة بالمواطن، أو في ميدان الأعمال، فقد تحققت على المستوى التشريعي إصلاحات هامة في انتظار أخرى هي في طريق الإنجاز، من شأنها استكمال بناء صرح العدالة وتعزيز قدرات المحاكم للتغلب على البطء باعتماد القضاء الفردي، فضلا عن إضفاء البعد الإنساني على قانون السجون وعصرنة القضاء الجنائي وإعادة تأهيل المهن القضائية وتحسين تكوين القضاة وكافة الأعوان القضائيين وكذا ظروف عملهم في العديد من المحاكم.",
    fr: "Alors que les tribunaux administratifs et de commerce ont commencé à fournir leurs apports en matière de renforcement de la primauté de la loi dans les rapports de l'administration avec les citoyens et dans le domaine des affaires, on relève, sur le plan du droit, les réformes importantes qui ont été réalisées ou sont en cours de réalisation et qui parachèvent la construction de l'édifice judiciaire. Elles tendent aussi à renforcer la capacité des tribunaux à résorber les lenteurs, en introduisant l'institution du juge unique, ainsi que leur aptitude à humaniser le droit pénitentiaire, moderniser la physionomie de la justice pénale, réhabiliter les professions judiciaires, perfectionner la formation des juges et des agents du secrétariat-greffe, et améliorer leurs conditions de travail dans de nombreux tribunaux.",
    vocabulary: [
      { fr: "Juge unique", ar: "القضاء الفردي", explanation: "نظام قضائي تفصل فيه هيئة مشكلة من قاضٍ واحد في النزاع، بهدف تسريع البت وتبسيط الإجراءات عكس القضاء الجماعي." },
      { fr: "Droit pénitentiaire", ar: "قانون السجون", explanation: "القواعد القانونية المنظمة لإدارة المؤسسات السجنية ومعاملة النزلاء وحفظ حقوقهم الإنسانية والاجتماعية." },
      { fr: "Secrétariat-greffe", ar: "الأعوان القضائيين (كتابة الضبط)", explanation: "جهاز كتابة الضبط الإداري والقضائي الذي يسجل الدعاوى ويحرر المحاضر ويوثق الجلسات والأحكام." },
      { fr: "Professions judiciaires", ar: "المهن القضائية", explanation: "المهن المساعدة للقضاء مثل المحاماة، التوثيق، المفوضين القضائيين، والخبراء." }
    ],
    analysis: "القضاء الفردي تُرجم بـ 'institution du juge unique' وهو مصطلح قانوني دولي دقيق، وتعبير 'الأعوان القضائيين' قوبل بـ 'agents du secrétariat-greffe' وهو ما يعرف بكتابة الضبط حالياً."
  },
  {
    id: 7,
    title: "التعبئة الكاملة وانتهاء زمن العرقلة",
    ar: "وبالرغم مما قطعناه من خطوات، فإن إصلاح القضاء لايزال بعيدا عن الهدف الذي نتوخاه له ودون الطموحات المشروعة للمتقاضين وللمجتمع. ولذا فإننا مصممون على أن يأخذ تسريع النهج الإصلاحي وتيرته القصوى، فقد دقت ساعة الحقيقة، معلنة حلول وقت التعبئة الكاملة والقوية للقضاة ولكل الفاعلين في مجال العدالة للمضي قدما بإصلاح القضاء نحو وجهته الصحيحة وانتهاء زمن العرقلة والتخاذل والتردد والانتظارية",
    fr: "Malgré le chemin parcouru, la réforme est encore loin du but que Nous nous sommes fixé et en deçà des attentes et des aspirations légitimes des justiciables et de la société. Nous devons donc impérativement passer à la vitesse supérieure, car l'heure est à la mobilisation massive et forte des magistrats et de tous les protagonistes du monde judiciaire. Il faut poursuivre résolument la réforme judiciaire et lui imprimer l'orientation judicieuse qui s'impose. En effet, l'obstruction et l'attentisme ne sont plus de mise. L'hésitation et la frilosité ne sont plus permises.",
    vocabulary: [
      { fr: "En deçà des attentes", ar: "دون الطموحات المشروعة", explanation: "عدم بلوغ المستوى أو الأهداف المقبولة التي ينتظرها المجتمع والمواطنون من العدالة." },
      { fr: "Passer à la vitesse supérieure", ar: "يأخذ تسريع النهج الإصلاحي وتيرته القصوى", explanation: "تعبير اصطلاحي بليغ يعني تسريع الخطوات ورفع الإيقاع لتجنب التباطؤ الزمني." },
      { fr: "L'attentisme", ar: "الانتظارية", explanation: "موقف سلبي يقوم على الترقب وعدم المبادرة والانتظار دون بذل الجهد اللازم للإصلاح." },
      { fr: "Frilosité", ar: "التردد والتخوف", explanation: "الخشية من اتخاذ القرارات الجريئة والإحجام عن الانخراط الفعال في مسيرة التغيير." }
    ],
    analysis: "تُرجم مصطلح 'الانتظارية' بـ 'l'attentisme' بدقة متناهية، وهو مفهوم سياسي وقانوني يصف الممانعة والتباطؤ في التنزيل الإيجابي للإصلاحات الجوهرية."
  },
  {
    id: 8,
    title: "أخلاقيات القضاء والمعاقبة التأديبية الصارمة",
    ar: "وفي هذا الصدد، يجب على المجلس الأعلى للقضاء أن يعزز المكتسبات وينخرط بكل حزم ووضوح في هذا الورش الإصلاحي الكبير، مضطلعا بمهامه الدستورية كاملة في السهر على ضوابط وأخلاقيات القضاء بالمعاقبة التأديبية الحازمة والصارمة لكل الذين أثبتوا عدم أهليتهم لتحمل ما طوقوا به من مسؤوليات بسبب تفريطهم وتجاوزاتهم أو الذين أساؤوا لسمعة القضاء بسلوكهم وتصرفاتهم، والذين ينسفون في لحظة واحدة بانحرافاتهم الشائنة ما تحقق من منجزات خلال سنوات من الكد والجهد.",
    fr: "Dans ce contexte, il incombe au Conseil Supérieur de la Magistrature de consolider les acquis et de s'impliquer plus clairement et plus fortement dans l'immense chantier de la réforme. Il appartient au CSM d'assumer pleinement sa mission constitutionnelle de gardien de la déontologie et de l'éthique judiciaire, en sanctionnant avec rigueur et fermeté tous ceux qui, par leurs défaillances, se montrent indignes de leur charge, qui, par leurs conduite, jettent le discrédit sur la justice et qui, par leurs dérives insolentes, sapent en quelques instants des années de travail et d'efforts.",
    vocabulary: [
      { fr: "Déontologie et éthique judiciaire", ar: "ضوابط وأخلاقيات القضاء", explanation: "القواعد السلوكية والمهنية والقيم الأخلاقية المفروضة على القاضي كالحياد والنزاهة والوقار والنزاهة." },
      { fr: "Sanctionner avec rigueur", ar: "المعاقبة التأديبية الحازمة والصارمة", explanation: "إيقاع العقوبات التأديبية القانونية المناسبة بحق المخالفين لالتزاماتهم دون تراخٍ." },
      { fr: "Jeter le discrédit", ar: "أساؤوا لسمعة", explanation: "إضعاف هيبة وثقة الجمهور في نزاهة واستقلال العدالة نتيجة سلوك فردي غير مسؤول." }
    ],
    analysis: "كلمة 'أخلاقيات القضاء' تُرجمت بالزوج المترادف 'déontologie et éthique judiciaire' لجمع الجانبين التقني المهني والأخلاقي المعنوي للمسؤولية."
  },
  {
    id: 9,
    title: "مفهوم استقلال القضاء وحماية حقوق المتقاضين",
    ar: "وإننا إذ ندعو المجلس المضاعفة جهوده لتوطيد استقلال القضاء وتقويته، فإننا نؤكد بأن هذا الاستقلال لا يعد امتيازا مخولا للقاضي ليعمل بهواه بمنأى عن كل محاسبة، بل إن مبدأ استقلال القضاء يعد بالأحرى قاعدة ديمقراطية لكفالة حسن سير العدالة وضمانة دستورية لحماية حقوق المتقاضين وحقا للمواطنين في الاحتماء بقضاء مستقل ومحايد.",
    fr: "Nous appelons le Conseil à redoubler d'efforts pour consolider et renforcer l'indépendance de la justice, réaffirmant, à cet égard, que l'indépendance n'est pas un privilège octroyé au juge pour faire impunément ce que bon lui semble, mais plutôt une règle démocratique de bon fonctionnement de la justice, une garantie constitutionnelle de la protection des droits des justiciables et un droit des citoyens à être protégés par une justice indépendante et impartiale.",
    vocabulary: [
      { fr: "Privilège octroyé", ar: "امتياز مخول", explanation: "حق خاص أو رخصة حصرية تعطى لجهة معينة ليستفيد منها الشخص بصفة فردية." },
      { fr: "Faire impunément ce que bon lui semble", ar: "ليعمل بهواه بمنأى عن كل محاسبة", explanation: "القيام بالتصرفات دون خوف من المسؤولية أو الجزاء أو المساءلة القانونية والتأديبية." },
      { fr: "Indépendante et impartiale", ar: "مستقل ومحايد", explanation: "الركنان الأساسيان للعدالة النزيهة؛ الاستقلال عن سائر السلط الأخرى والحياد التام تجاه أطراف الخصومة." }
    ],
    analysis: "جملة 'ليعمل بهواه بمنأى عن كل محاسبة' صيغت بعبقرية فرنسية 'faire impunément ce que bon lui semble' لتسليط الضوء على ربط المسؤولية بالمحاسبة والجزاء."
  },
  {
    id: 10,
    title: "تدبير المسار المهني للقضاة وتكريس الاستحقاق",
    ar: "كما ينبغي للمجلس أن يعمل بنفس الحزم والعزم على النهوض بدوره الأساسي في تعزيز الضمانات التي يكفلها الدستور للقضاة، معتمدا المساواة والتجرد في تدبير وضعيتهم المهنية بناء على المعايير الموضوعية المضمنة في نظامه الداخلي الذي حظي بمصادقتنا السامية، حريصا على مكافأة خصال النزاهة والاستقامة والاستحقاق ونكران الذات والجدية والاجتهاد والشجاعة.",
    fr: "Avec la même détermination, le Conseil se doit de s'acquitter du rôle fondamental qui est le sien dans la consolidation des garanties reconnues aux magistrats par la Constitution, s'astreignant aux règles d'égalité et d'impartialité dans la gestion de leur carrière, se fondant, pour cela, sur les critères objectifs énoncés dans son Règlement Intérieur qui a bénéficié de Notre Haute Approbation. A cet égard, il appartient au CSM de veiller à valoriser la probité et la droiture, d'encourager la compétence et le mérite, de récompenser le dévouement, l'abnégation, l'effort et le courage",
    vocabulary: [
      { fr: "S'astreindre à", ar: "معتمدا / يلتزم صارماً بـ", explanation: "إلزام الذات باتباع قواعد محددة والتقيد الكامل بها دون أي تحيز." },
      { fr: "Règlement Intérieur", ar: "النظام الداخلي", explanation: "مجموعة القواعد التنظيمية التي تضبط سير الهيئة وصلاحياتها وتحدد معايير تدبير مساراتها." },
      { fr: "L'abnégation", ar: "نكران الذات", explanation: "التضحية بالمصلحة الخاصة والشخصية في سبيل الصالح العام وتأدية الواجب المهني والوطني." }
    ],
    analysis: "حظيت 'نكران الذات' بترجمة رائعة هي 'l'abnégation' وهي لفظة فرنسية رفيعة المستوى تدل على التفاني التام في المسؤولية الوطنية والأخلاقية."
  },
  {
    id: 11,
    title: "محاربة النزعات الفئوية والانتخابوية في سلك القضاء",
    ar: "ولأننا حريصون على عدم تسخير هذا المبدإ كمطية لأغراض أخرى، فإن على المجلس أن ينأى بنفسه وبصفة نهائية عن كل النزعات الفئوية المهنية والانتخابوية الضيقة والممارسات المنحازة، حتى يحقق لذاته الاستقلال اللازم ويدرك بنفسه ويرسخ الوعي لدى الغير بأن الاستقلال هو الشرط الملازم للمسؤولية، جاعلا مصلحة الأمة فوق كل اعتبار.",
    fr: "Et parce que Nous demeurons attentif à ce que ce principe ne soit ni instrumentalisé ni asservi à d'autres fins, il incombe au CSM de se départir, une fois pour toutes, de toute logique corporatiste, électoraliste et de tout parti-pris, pour assumer sa propre indépendance et pour comprendre et faire comprendre que le corollaire de l'indépendance, c'est la responsabilité, en plaçant toujours l'intérêt de la nation au-dessus de tout autre considération.",
    vocabulary: [
      { fr: "Instrumentalisé ni asservi", ar: "تسخير هذا المبدإ كمطية لأغراض أخرى", explanation: "توظيف واستغلال المبادئ القانونية السامية لخدمة أجندات أو مصالح ضيقة وفئوية." },
      { fr: "Logique corporatiste", ar: "النزعات الفئوية المهنية", explanation: "التمترس خلف المصالح الضيقة لجماعة مهنية معينة على حساب المصلحة المشتركة والصالح العام." },
      { fr: "Le corollaire", ar: "الشرط الملازم", explanation: "النتيجة المنطقية واللازمة التي تترتب حتماً على الشيء وترافقه بشكل كامل ولا ينفصم عنه." }
    ],
    analysis: "تمت ترجمة 'النزعات الفئوية المهنية والانتخابوية الضيقة' بـ 'toute logique corporatiste, électoraliste' وهو توصيف علمي دقيق في السوسيولوجيا والسياسة الدستورية والمهنية."
  },
  {
    id: 12,
    title: "التعبئة الشاملة ودور الودادية الحسنية للقضاة",
    ar: "إن التعبئة الشاملة التي يتطلبها الورش الكبير لإصلاح القضاء تستلزم المشاركة الفعالة والواسعة للقضاة فيه. وهنا يبرز الدور المنوط بالودادية الحسنية للقضاة التي ننتظر منها وفي نطاق مهامها وأهدافها أن تواكب هذا الإصلاح وتدعمه بكل فعالية ، متيحة بذلك لجميع القضاة الإسهام في تجديد الصرح المشترك للعدالة وإضافة قيمة جديدة البرامج التعاون الدولي والانفتاح على العالم القضائي والتكوين المستمر وتحديث القضاء.",
    fr: "La mobilisation totale que requiert l'immense chantier de la réforme de la justice, exige d'aller plus loin pour élargir la participation des magistrats à cette vaste entreprise. C'est ici que prend tout son relief le rôle qui revient naturellement à l'Amicale Hassanienne des Magistrats. Nous attendons d'elle, dans les limites de ses compétences et conformément à sa mission et sa vocation, qu'elle apporte sa contribution afin de pouvoir accompagner et soutenir activement cette réforme, et de permettre à chacun d'apporter sa pierre à la rénovation de l'édifice commun de la justice, d'apporter une valeur ajoutée aux programmes de coopération internationale, d'ouverture du monde judiciaire, de formation continue et de modernisation de la justice.",
    vocabulary: [
      { fr: "Apporter sa pierre à", ar: "الإسهام في", explanation: "تعبير مجازي شهير يعني المشاركة الفعالة بوضع لبنة أو جهد ملموس في بناء مشروع مشترك كبير." },
      { fr: "Vocation", ar: "أهدافها / طبيعة رسالتها", explanation: "الرسالة السامية أو الوظيفة الجوهرية التاريخية التي تضطلع بها الهيئة أو المؤسسة المهنية." },
      { fr: "L'Amicale Hassanienne des Magistrats", ar: "الودادية الحسنية للقضاة", explanation: "الجمعية المهنية التاريخية الممثلة لقضاة المملكة المغربية والتي تأسست للدفاع عن قيم القضاء." }
    ],
    analysis: "عبارة 'الإسهام في تجديد الصرح المشترك للعدالة' تمت صياغتها فرنسياً بأسلوب بليغ وراقي 'permettre à chacun d'apporter sa pierre à la rénovation de l'édifice commun de la justice'."
  },
  {
    id: 13,
    title: "تحديث هياكل الودادية وتعبئة الطاقات الجديدة",
    ar: "ولكي يتأتى للودادية ذلك, ينبغي لها أن تستيقظ من سباتها العميق، وأن تكف عن الحسابات والصراعات المتجاوزة، وتقوم بمراجعة وتحيين نظامها الأساسي بما يكفل لها استيعاب التطور الفكري والتحولات التي يعرفها المشهد القضائي، وكذا تجديد هيئاتها المسيرة بما يضمن لها تعبئة طاقات جديدة وإناطة المسؤولية بها. وبذلكم تسترجع الودادية إشعاعها وتحمل من جديد مشعل استقلال القضاء والدفاع عن حقوق القضاة، وتحدد النهج القويم لعملها والمساهمتها في إصلاح القضاء ",
    fr: "Pour cela, l'Amicale doit sortir de sa longue léthargie, rompre avec les calculs et les combats d'arrière-garde, revoir et actualiser ses statuts de manière à prendre en compte l'évolution des idées et les changements que connaît la scène judiciaire, renouveler ses instances dirigeantes de manière à mobiliser de nouvelles compétences et à responsabiliser de nouvelles énergies. L'Amicale pourra alors reconquérir l'espace perdu, reprendre le flambeau de l'indépendance de la justice et de la défense des droits des magistrats et définir clairement sa ligne d'action et sa contribution à la réforme de la justice.",
    vocabulary: [
      { fr: "Léthargie", ar: "سباتها العميق", explanation: "حالة الركود الشديد والجمود والخمول والكسل الطويل الذي يشل حركة الهيئة." },
      { fr: "Combats d'arrière-garde", ar: "الحسابات والصراعات المتجاوزة", explanation: "المعارك الهامشية القديمة وغير المجدية التي فات أوانها ولا تفيد في التطوير والمضي قدماً." },
      { fr: "Reprendre le flambeau", ar: "تحمل من جديد مشعل", explanation: "تحمل مسؤولية قيادة المبادرة والدفاع عن قضية سامية واستكمال مسيرة إصلاحها الكبرى." }
    ],
    analysis: "تُرجمت 'الصراعات المتجاوزة' بـ 'combats d'arrière-garde' وهو مصطلح عسكري واستراتيجي يصف الانشغال بمعارك هامشية تافهة من الماضي وتجاهل المستقبل."
  },
  {
    id: 14,
    title: "الإصلاح في قلب دمقرطة المجتمع وخيار استراتيجي مصيري",
    ar: "الذي يوجد اليوم في قلب عملية تغيير المجتمع وتحديثه ودمقرطته وبناء دولة الحق والقانون والنماء والتقدم، أي في صميم اختيارات استراتيجية لا رجعة فيها وتحديات مصيرية يجب على المغرب أن يرفعها ، وهو ما لن يتم إلا بالمساهمة الحاسمة والفعالة للقضاء.",
    fr: "La réforme de la justice est aujourd'hui au cœur du changement et de la modernisation, de la démocratisation de la société et de l'édification de l'Etat de droit, de la croissance et du développement, c'est-à-dire au cœur de choix stratégiques irréversibles, de défis majeurs que le Maroc doit impérativement relever et auxquels la justice doit apporter une contribution décisive.",
    vocabulary: [
      { fr: "Démocratisation", ar: "دمقرطته", explanation: "تنزيل الآليات والمبادئ الديمقراطية وتكريسها في شتى مناحي التدبير المؤسساتي والاجتماعي." },
      { fr: "Choix stratégiques irréversibles", ar: "اختيارات استراتيجية لا رجعة فيها", explanation: "التوجهات الكبرى والنهائية للدولة التي لا تراجع عنها لضمان التطور والتنمية المستدامة." },
      { fr: "Contribution décisive", ar: "مساهمة حاسمة وفعالة", explanation: "المشاركة القوية والمؤثرة التي ترجح كفة النجاح وتحسم مصير التغيير الهيكلي." }
    ],
    analysis: "تمت ترجمة 'دمقرطته' بـ 'démocratisation' وهو صياغة المصدر الدال على جعل المجتمع والمؤسسات تسير وفق الضوابط الديمقراطية والحياد القضائي."
  },
  {
    id: 15,
    title: "مصالحة المواطنين مع جهازهم القضائي واستعادة الثقة",
    ar: "وإننا لنهيب بكل القضاة الحريصين كل الحرص على النهوض بمسؤوليتهم التاريخية والمحافظة على شرف وكرامة الأمانة الملقاة على عاتقهم، أن يعملوا على مصالحة المغاربة مع جهازهم القضائي، واستعادة ثقتهم في شموخ وعظمة عدالة مستقلة نزيهة كفأة وقوية جديرة بما يرمز إليه اسمها من توقير واحترام والسلام عليكم ورحمة الله تعالى وبركاته.",
    fr: "Nous en appelons à tous les magistrats qui ont à cœur de s'acquitter de leur mission historique et de préserver l'honneur et la dignité de leur charge, pour s'engager à réconcilier les Marocains avec leur justice, à restaurer la confiance et à restituer au Maroc les grandeurs d'une justice indépendante, saine, compétente et forte, d'une justice digne des égards et du respect qu'évoque ce vocable. Wassalamou Alaïkoum.",
    vocabulary: [
      { fr: "Réconcilier les Marocains avec leur justice", ar: "مصالحة المغاربة مع جهازهم القضائي", explanation: "إعادة بناء جسور الثقة المتبادلة وتغيير الصورة النمطية السلبية السائدة عن القضاء لدى المواطن المغربي." },
      { fr: "Digne des égards", ar: "جديرة بما يرمز إليه اسمها من توقير", explanation: "تستحق الاحترام والتبجيل والاهتمام الكامل والمهابة لما تمثله من قيمة دستورية عليا وسلطة مستقلة." }
    ],
    analysis: "تعبير 'نصالح المغاربة مع جهازهم القضائي' تُرجم بـ 'réconcilier les Marocains avec leur justice' وهو من أقوى الشعارات التوجيهية في تاريخ إصلاح العدالة بالمغرب."
  }
];

const SPEECH_SECTIONS_2003: SpeechSection[] = [
  {
    id: 1,
    title: "إصلاح القضاء كدعامة لسيادة القانون والتنمية",
    ar: "يسعدنا أن نجعل من افتتاحنا للسنة القضائية مناسبة لإضافة لبنات جديدة في مسار إصلاح جهاز العدل لما يكفله القضاء المستقل والنزيه والفعال من سيادة القانون وإشاعة الثقة والأمن على الأشخاص والممتلكات وتحفيز التنمية والاستثمار وتوطيد الاستقرار وترسيخ الديمقراطية التي نضعها فوق كل اعتبار.",
    fr: "II Nous plaît de Nous prévaloir de l'ouverture de l'année judiciaire et en faire l'occasion de poser de nouveaux jalons au processus engagé pour la réforme de l'appareil judiciaire, tant il est vrai qu'une justice indépendante, intègre et efficiente conforte la suprématie de la loi et assure confiance et sécurité pour les personnes et les biens. Si elle favorise le développement et incite à l'investissement, elle apporte aussi la garantie du renforcement de la stabilité et de la démocratie, que Nous plaçons au dessus de toute autre considération.",
    vocabulary: [
      { fr: "Poser de nouveaux jalons", ar: "إضافة لبنات جديدة", explanation: "إضافة خطوات أو علامات بارزة وهامة في طريق البناء الإصلاحي لمرفق العدالة." },
      { fr: "Suprématie de la loi", ar: "سيادة القانون", explanation: "المبدأ الدستوري والقانوني السامي الذي يقتضي خضوع الجميع لقواعد وأحكام القانون دون استثناء." },
      { fr: "Justice indépendante, intègre et efficiente", ar: "قضاء مستقل ونزيه وفعال", explanation: "الثالوث الوظيفي للعدالة الكفيل بضمان الحقوق وحماية الاستثمارات والمعاملات." },
      { fr: "Au dessus de toute autre considération", ar: "فوق كل اعتبار", explanation: "جعل الخيار أو المبدأ (الديمقراطية هنا) أولى الأولويات والغاية القصوى للدولة والمجتمع." }
    ],
    analysis: "لاحظ استخدام المصطلح المجازي 'poser de nouveaux jalons' للتعبير البليغ عن 'إضافة لبنات جديدة'، وتعد 'suprématie de la loi' مرادفاً لسيادة القانون (أو primauté de la loi) في الفقه القانوني الفرنسي."
  },
  {
    id: 2,
    title: "مواصلة وتحديث وعصرنة برنامج إصلاح العدالة",
    ar: "فهل مكنت الجهود التي بذلت في هذا الشأن من بلوغ الأهداف المنشودة؟ كلا إننا مع تنويهنا بما تحقق من منجزات تعتبر أن برنامج إصلاح القضاء طموح وشاق وطويل وإننا لعازمون على تسريع وتيرته لتحديث جهاز العدل وتخليقه وتأهيله. وها نحن اليوم نتخذ تدابير ملموسة ليسهم القضاء في البناء الجماعي المغرب الديمقراطية والتنمية.",
    fr: "Mais est-ce que les efforts déployés à cet égard ont permis d'atteindre les objectifs escomptés ? La réponse est assurément non. En effet, tout en Nous félicitant des réalisations accomplies jusque-là, Nous considérons que l'action de réforme de la justice est un programme ambitieux, laborieux et de longue haleine, dont Nous tenons résolument à accélérer la cadence, pour assurer la modernisation, la moralisation et la mise à niveau de l'appareil judiciaire. We voilà donc aujourd'hui, prenant des mesures concrètes pour que la justice puisse apporter sa contribution à l'effort collectif qui est engagé pour édifier le Maroc de la démocratie et du développement.",
    vocabulary: [
      { fr: "Objectifs escomptés", ar: "الأهداف المنشودة", explanation: "الغايات والنتائج الكبرى المخطط لها والمنتظر الوصول إليها بنهاية الورش الإصلاحي." },
      { fr: "De longue haleine", ar: "طويل الأمد / طويل النفس", explanation: "المشاريع والخطط التي تتطلب وقتاً طويلاً ومثابرة وجهوداً مستمرة لتحقيق ثمارها." },
      { fr: "La moralisation", ar: "تخليق جهاز العدل", explanation: "إدراج القواعد الأخلاقية والمهنية الصارمة ومحاربة الفساد والرشوة وتفعيل مدونات السلوك القضائي." },
      { fr: "Mise à niveau", ar: "تأهيل", explanation: "تحسين وتطوير قدرات الموارد البشرية واللوجستية للارتقاء بجودة المرفق العمومي." }
    ],
    analysis: "تمت ترجمة عبارة 'تخليق' بـ 'moralisation'، وهو مصطلح قانوني وسياسي حديث يعبر عن إدراج القواعد الأخلاقية ومحاربة الفساد في الإدارة والقضاء."
  },
  {
    id: 3,
    title: "تحديث القضاء التجاري وإعداد قانون التحكيم",
    ar: "وهكذا ، وتجسيدا لنهجنا الراسخ للنهوض بالاستثمار، وتفعيلا لما ورد في رسالتنا الموجهة لوزيرنا الأول في هذا الشأن، فإننا ندعو حكومتنا إلى مواصلة الجهود لعصرنة القضاء بعقلنة العمل وتبسيط المساطر وتعميم المعلوميات. كما يجب تنويع مساطر التسوية التوافقية لما قد ينشأ من منازعات بين التجار، وذلك من خلال الإعداد السريع المشروع قانون التحكيم التجاري الوطني والدولي، ليستجيب نظامنا القضائي لمتطلبات عولمة الاقتصاد وتنافسيته ويسهم في جلب الاستثمار الأجنبي.",
    fr: "Ainsi, conformément à Notre ferme volonté de continuer à œuvrer pour la promotion des investissements et en application de Nos directives énoncées dans la lettre que nous avons adressée à cet effet, à Notre Premier Ministre, Nous invitons Notre Gouvernement à poursuivre les efforts de modernisation de la justice, en rationalisant le travail, en simplifiant les procédures et en assurant la généralisation de l'informatique. Il est tout aussi nécessaire, par ailleurs, de diversifier les procédures de règlement consensuel des litiges qui viennent à surgir entre les partenaires dans les transactions commerciales, et ce en procédant, avec la célérité voulue, à l'élaboration d'un projet de loi d'arbitrage commercial, national et international, qui permette à notre système judiciaire de répondre aux exigences de la mondialisation et de la compétitivité de l'économie, et de contribuer à drainer les investissements étrangers.",
    vocabulary: [
      { fr: "Règlement consensuel des litiges", ar: "التسوية التوافقية للمنازعات", explanation: "الوسائل والبدائل الودية لفض الخلافات التجارية مثل الوساطة والصلح دون ولوج الخصومة القضائية." },
      { fr: "Arbitrage commercial", ar: "التحكيم التجاري", explanation: "آلية تعاقدية خاصة لفض المنازعات التجارية بواسطة محكمين يختارهم الأطراف لإصدار حكم ملزم." },
      { fr: "Exigences de la mondialisation", ar: "متمتطلبات عولمة الاقتصاد", explanation: "المعايير الدولية الجديدة المتمثلة في السرعة والائتمان وتنافسية الأسواق وسهولة المعاملات." },
      { fr: "Drainer les investissements étrangers", ar: "جلب الاستثمار الأجنبي", explanation: "استقطاب رؤوس الأموال والشركات الدولية لإنشاء مشاريع تنموية محلية بفضل بيئة قانونية آمنة." }
    ],
    analysis: "عبارة 'مساطر التسوية التوافقية' قوبلت بـ 'procédures de règlement consensuel' وهي الآليات البديلة لفض المنازعات (ADR) مثل الوساطة والصلح التي تخفف العبء على المحاكم العادية."
  },
  {
    id: 4,
    title: "إنشاء أقسام قضاء الأسرة وتكوين القضاة",
    ar: "وسيرا على هذا النهج التحديثي، فقد أصدرنا تعليماتنا السامية إلى وزيرنا في العدل كي يعمل على فتح أقسام لقضاء الأسرة في أهم المحاكم ويحرص على أن تعم فيما بعد كل أنحاء المملكة وعلى الإسراع بتكوين قاضي الأسرة المتخصص، لأن قضاء الأحوال الشخصية الحالي غير مؤهل لتطبيق مدونة الأسرة التي نحرص على إنجازها بكامل الاهتمام، ترسيخا لتماسك العائلة في ظل التكافؤ والإنصاف.",
    fr: "Toujours dans le cadre de cette démarche moderniste, Nous avons donné Nos Hautes Instructions à Notre Ministre de la Justice pour assurer l'ouverture de sections de la justice de la famille dans les principaux tribunaux, et veiller ultérieurement à la généralisation de ces structures à toutes les Régions du Royaume et à l'accélération de la formation de juges de famille spécialisées. Car en effet, les juridictions actuellement en charge des questions de statut personnel ne sont pas aptes à assurer l'application du Code de la Famille, projet à la réalisation duquel Nous sommes particulièrement attaché, afin de consolider la cohésion de la famille dans un esprit d'équilibre et d'équité.",
    vocabulary: [
      { fr: "Statut personnel", ar: "الأحوال الشخصية", explanation: "مجموعة القواعد القانونية المنظمة لروابط الأسرة كالنكاح والطلاق والميراث والنفقة والحضانة." },
      { fr: "Code de la Famille", ar: "مدونة الأسرة", explanation: "القانون الدستوري والمدني المغربي الشامل المنظم للعلاقات الزوجية والأسرية والأطفال." },
      { fr: "Cohésion de la famille", ar: "تماسك العائلة", explanation: "الحفاظ على استقرار الأسرة وحمايتها من التفكك وتشتت الأطفال." },
      { fr: "Équilibre et équité", ar: "التكافؤ والإنصاف", explanation: "القيم التي توفر لكل طرف في العلاقة الأسرية (الزوج، الزوجة، الأبناء) حقوقه العادلة والمتوازنة." }
    ],
    analysis: "تُرجمت 'الأحوال الشخصية' بـ 'statut personnel'، و'مدونة الأسرة' بـ 'Code de la Famille' للدلالة على القوانين المنظمة للزواج والطلاق والميراث والنسب، مع التركيز على التكافؤ والإنصاف (Équilibre et équité)."
  },
  {
    id: 5,
    title: "مفهوم صندوق التكافل العائلي وحماية الأسرة",
    ar: "ولهذه الغاية، وبدلا من إحداث صندوق للنفقة قد يفهم منه التشجيع غير المقصود على أبغض الحلال عند الله وتشتيت شمل الأسرة، فإننا نصدر توجيهاتنا إلى حكومتنا قصد الدراسة المتأنية لإيجاد صندوق للتكافل العائلي يعتمد في جزء من موارده على طوابع ذات قيمة رمزية توضع على الوثائق المرتبطة بالحياة الشخصية والعائلية وترصد نفقاته على أساس معايير مدققة، مستهدفين من ذلك ضمان حقوق الأم المعوزة وحماية الأطفال من التشرد الناتج عن الطلاق.",
    fr: "Ainsi, au lieu de créer une caisse de pension alimentaire, qui pourrait être perçue à tort comme une incitation à ce qui constitue pour Dieu le plus détestable des actes licites, et aboutit à l'éclatement de la famille, Nous donnons Nos instructions à Notre Gouvernement pour étudier minutieusement la mise en place d'un Fonds d'entraide familiale, qui serait alimenté, partiellement, à partir du produit de timbres à valeur symbolique apposés sur les actes relatifs au statut personnel et familial, Fonds dont les prestations seraient allouées selon des critères rigoureux, l'objectif étant de garantir les droits de la mère démunie et de protéger les enfants qui risquent d'être livrés à l'abandon à la suite du divorce de leurs parents.",
    vocabulary: [
      { fr: "Caisse de pension alimentaire", ar: "صندوق النفقة", explanation: "المقترح الأولي لتأمين نفقة المطلقات والأولاد، والذي استبدل بفكرة التكافل لتفادي تشجيع التفكك." },
      { fr: "Fonds d'entraide familiale", ar: "صندوق للتكافل العائلي", explanation: "صندوق مالي عمومي لمساعدة الأمهات المعوزات وحماية الأطفال من الضياع بعد الطلاق." },
      { fr: "Le plus détestable des actes licites", ar: "أبغض الحلال عند الله", explanation: "التعبير الديني الفقهي الإسلامي الخاص بالطلاق بصفته مباحاً شرعاً لكنه غير محبذ اجتماعياً وروحياً." },
      { fr: "Mère démunie", ar: "الأم المعوزة", explanation: "المرأة المطلقة التي تفتقر للوسائل المالية الكافية لإعالة نفسها وأولادها بعد انفصال الأسرة." }
    ],
    analysis: "تُرجمت العبارة الدينية الإسلامية 'أبغض الحلال عند الله' (الطلاق) بأسلوب فرنسي يعبر عن معناها العقدي 'le plus détestable des actes licites' لضمان نقل البعد الفقهي والاجتماعي بدقة للأجنبي."
  },
  {
    id: 6,
    title: "قضاء متخصص وحماية المال العام من الفساد",
    ar: "وتظل غايتنا إيجاد قضاء متخصص يكفل الفعالية في البت في المنازعات ويضمن الحق في المحاكمة العادلة ومساواة المواطنين أمام القانون في جميع الظروف والأحوال. لذلك نأمر حكومتنا ، بأن تنكب على دراسة وضعية محكمة العدل الخاصة وأن ترفع إلينا ما توصلت إليه من اقتراحات، آخذة بعين الاعتبار ما تفرضه ضرورة وجود قضاء متخصص في الجرائم المالية، حريص على تخليق الحياة العامة وحماية المال العام من كل أشكال الفساد وترسيخ ثقافة وأخلاقيات المسؤولية.",
    fr: "Notre but demeure la création d'une justice spécialisée, qui, outre l'efficience dans le règlement des litiges, garantisse le droit à un procès équitable et l'égalité des citoyens devant la loi, en toutes circonstances et dans tous les cas. Aussi, ordonnons-Nous à Notre Gouvernement de se pencher sur la situation de la Cour spéciale de justice et de Nous soumettre les propositions auxquelles il aura abouti, en gardant à l'esprit l'impératif de la mise en place d'une juridiction spécialisée dans les crimes financiers, soucieuse de moraliser la vie publique, de protéger les deniers publics contre toutes sortes de prévarication, et d'ancrer dans les mœurs la culture et l'éthique de la responsabilité.",
    vocabulary: [
      { fr: "Droit à un procès équitable", ar: "الحق في المحاكمة العادلة", explanation: "المبدأ الحقوقي الدستوري والكوني الذي يضمن للمتهم كافة حقوق الدفاع والحياد التام للمحكمة." },
      { fr: "Cour spéciale de justice", ar: "محكمة العدل الخاصة", explanation: "محكمة استثنائية سابقة بالمغرب كانت معنية بجرائم الغدر والرشوة واختلاس الأموال العامة." },
      { fr: "Prévarication", ar: "الفساد / نهب المال العام", explanation: "المخالفات الجسيمة والخيانة العظمى للواجب المهني واختلاس المال العام المرتبط بالوظيفة." },
      { fr: "Moraliser la vie publique", ar: "تخليق الحياة العامة", explanation: "ترسيخ مبادئ الشفافية والنزاهة وربط المسؤولية بالمحاسبة ومكافحة استغلال النفوذ بالدولة." }
    ],
    analysis: "تم استخدام مصطلح 'prévarication' لترجمة 'الفساد' في سياق جرائم الأموال العامة والموظفين الحكوميين وهو مرادف دقيق وقانوني رصين."
  },
  {
    id: 7,
    title: "تحسين الوضعية المادية والمهنية للمنتسبين للقضاء",
    ar: "ولأن تأهيل العدالة رهين بالتكوين الجيد للقضاة وبتحسين الوضعية المادية للقضاة المبتدئين والأعوان القضائيين، فإننا نهيب بحكومتنا أن تنظر في مراجعة وضعيتهم المادية ووضع نظام أساسي محفز لكتاب الضبط، تحصينا لهم من كل الإغراءات والانحرافات المخلة بشرف القضاء ونزاهة رسالته.",
    fr: "La mise à niveau de la Justice étant tributaire de la bonne formation des magistrats et de l'amélioration de la situation matérielle des juges débutants et des auxiliaires de justice, Nous invitons Notre gouvernement à étudier les moyens de réviser leurs conditions matérielles et à élaborer, à l'intention des greffiers, un statut qui soit motivant à même de les prémunir contre les tentations et les dérives qui portent atteinte à l'honneur de la justice et à l'intégrité de sa mission.",
    vocabulary: [
      { fr: "Greffiers", ar: "كتاب الضبط", explanation: "موظفو هيئة كتابة الضبط المسؤولون عن تدوين الجلسات وحفظ الملفات وتحرير الأحكام والسجلات بالمحكمة." },
      { fr: "Auxiliaires de justice", ar: "الأعوان القضائيين", explanation: "المهنيون المساعدون للقضاء كالمفوضين القضائيين، والخبراء، والتراجمة، والموثقين." },
      { fr: "Prémunir contre les tentations", ar: "تحصينهم من الإغراءات", explanation: "بناء حواجز حماية مادية وأخلاقية تحول دون انزلاق الموظفين والقضاة في الرشوة والفساد." },
      { fr: "Juges débutants", ar: "القضاة المبتدئين", explanation: "القضاة المعينون حديثاً في السلك القضائي والذين يحتاجون لظروف مادية لائقة تضمن حيادهم ووقارهم." }
    ],
    analysis: "تُرجم 'كتاب الضبط' بـ 'greffiers' و'الأعوان القضائيين' بـ 'auxiliaires de justice'، وهي المهن القضائية المساعدة الداعمة لعمل القاضي داخل المحكمة."
  },
  {
    id: 8,
    title: "تأسيس ودادية موظفي العدل وتحصينها",
    ar: "كما ندعو إلى إحداث ودادية خاصة بموظفي العدل تتكفل برعاية أحوالهم والنهوض بمهنتهم في نطاق عمل جمعوي منسجم مع خصوصية القضاء الذي لا يعتبر مرفقا إداريا، وإنما هو مؤسسة دستورية يتعين أن تظل محصنة من كل تأثير أو ضغط مهما كان شكله أو مصدره",
    fr: "Nous appelons également à la mise en place d'une Amicale des fonctionnaires de la justice qui veillera à la promotion de leur situation sociale et professionnelle, dans le cadre d'une action associative adaptée à la spécificité de la justice, celle-ci n'étant pas un service administratif, mais plutôt une institution constitutionnelle qui doit rester à l'abri de toute influence ou pression quelle qu'en soit la forme ou l'origine.",
    vocabulary: [
      { fr: "Amicale des fonctionnaires", ar: "ودادية الموظفين", explanation: "الجمعية المهنية والاجتماعية التي تهدف لرعاية مصالح الموظفين وتوطيد الروابط الأخوية بينهم." },
      { fr: "Action associative", ar: "عمل جمعوي", explanation: "الأنشطة الثقافية والاجتماعية والرياضية المهيكلة في إطار جمعيات مدنية منظمة." },
      { fr: "Service administratif", ar: "مرفق إداري", explanation: "الإدارة الحكومية التقليدية الخاضعة للتسلسل الإداري، والخطاب يميز القضاء عنها لحصانته الخاصة." },
      { fr: "À l'abri de toute influence", ar: "محصنة من كل تأثير", explanation: "البقاء بعيداً ووقائياً ضد أي تداخل أو ضغوطات خارجية تمس بنزاهة وصيانة العدالة." }
    ],
    analysis: "يركز الخطاب على أن القضاء ليس مجرد 'مرفق إداري' (service administratif) بل 'مؤسسة دستورية' مستقلة يجب حمايتها من أي ضغوط خارجية."
  },
  {
    id: 9,
    title: "إنشاء المؤسسة المحمدية للأعمال الاجتماعية",
    ar: "مؤكدين موصول عنايتنا الشاملة بأحوال أسرة العدل بقرارنا إحداث المؤسسة المحمدية للأعمال الاجتماعية لقضاة وموظفي العدل.",
    fr: "A cet égard, et en confirmation de l'intérêt particulier et constant que Nous portons à la situation de la famille de la justice, Nous avons décidé la création de la Fondation Mohammedienne des œuvres sociales des magistrats et des fonctionnaires de la justice.",
    vocabulary: [
      { fr: "Fondation Mohammedienne", ar: "المؤسسة المحمدية", explanation: "المؤسسة الرسمية المخصصة لتقديم الخدمات الاجتماعية ودعم التكافل والسكن والصحة لأسرة العدل بالمغرب." },
      { fr: "Œuvres sociales", ar: "الأعمال الاجتماعية", explanation: "مشاريع الدعم السكني والخدمات الصحية، والترفيهية والأنشطة التكافلية للموظفين وعائلاتهم." },
      { fr: "Famille de la justice", ar: "أسرة العدل", explanation: "تعبير مجازي راقٍ يشمل القضاة، والموظفين، وكافة مهنيي منظومة العدالة." }
    ],
    analysis: "تُرجمت 'المؤسسة المحمدية للأعمال الاجتماعية لقضاة وموظفي العدل' رسمياً بـ 'Fondation Mohammedienne des œuvres sociales des magistrats et des fonctionnaires de la justice' وهي الذراع الاجتماعي للعدالة المغربية."
  },
  {
    id: 10,
    title: "عصرنة التكوين الجامعي والقضائي",
    ar: "وبموازاة ذلك، فإننا ننتظر من حكومة جلالتنا أن تسرع بتفعيل ما يوفره إصلاح نظام التعليم والتكوين الجامعي والقضائي من إمكانات الانفتاح والشراكة لتأمين تكوين عصري ومتين لقضاتنا ، ولكل المهن المرتبطة بالعدالة.",
    fr: "D'autre part, Nous attendons du Gouvernement de Notre Majesté de se prévaloir rapidement des possibilités d'ouverture et de partenariat qu'offre la réforme du système de l'enseignement et de la formation universitaire et judiciaire, pour assurer une formation moderne et solide à nos magistrats ainsi qu'à tous ceux qui exercent des professions liées à la justice.",
    vocabulary: [
      { fr: "Se prévaloir des possibilités", ar: "تفعيل وتطوير ما يوفره", explanation: "الاستفادة القصوى والعملية من المزايا والشراكات المتاحة لتطوير المنظومة." },
      { fr: "Professions liées à la justice", ar: "المهن المرتبطة بالعدالة", explanation: "المهن القانونية والقضائية كالمحاماة، والتوثيق، والمفوضين القضائيين، والخبراء." },
      { fr: "Formation moderne et solide", ar: "تكوين عصري ومتين", explanation: "التعليم العالي والتدريب المهني القائم على دراسة القوانين الوطنية ومقارنتها والاتفاقيات الدولية." }
    ],
    analysis: "كلمة 'متين' تُرجمت بـ 'solide' في سياق التكوين القضائي للتعبير عن جودة وأصالة التكوين العلمي الذي يتلقاه القضاة لمواجهة عولمة الاقتصاد."
  },
  {
    id: 11,
    title: "الكرامة الإنسانية للسجناء ورعايتهم الاجتماعية",
    ar: "وإن ما توليه من رعاية شاملة للبعد الاجتماعي في مجال العدالة لا يستكمل إلا بما نوفره من الكرامة الإنسانية للمواطنين السجناء التي لا تجردهم منها الأحكام القضائية السالبة للحرية.",
    fr: "Par ailleurs, la sollicitude particulière que Nous réservons à la dimension sociale, dans le domaine de la justice, ne serait pas complète, sans que nous assurions aux citoyens incarcérés leur dignité humaine, qui, du reste, ne leur est pas déniée du fait d'une décision de justice privative de liberté.",
    vocabulary: [
      { fr: "Citoyens incarcérés", ar: "المواطنين السجناء", explanation: "السجناء المعتقلون والمودعون بالمؤسسات السجنية، والخطاب يصفهم بالمواطنين تأكيداً لحقوقهم الأساسية." },
      { fr: "Dignité humaine", ar: "الكرامة الإنسانية", explanation: "الحق الأصيل لكل إنسان في المعاملة الإنسانية اللائقة والبعد عن التعذيب والمهانة مهما كان وضعه القانوني." },
      { fr: "Privative de liberté", ar: "سالبة للحرية", explanation: "العقوبات والقرارات القضائية التي تمنع الشخص من الحركة والتنقل كالاعتقال والحبس والسجن." },
      { fr: "N'est pas déniée", ar: "لا تجردهم منها", explanation: "عدم حرمان أو سلب الصفة الإنسانية والكرامة الدستورية عن السجين بفعل عقوبته الجنائية." }
    ],
    analysis: "مصطلح 'الأحكام السالبة للحرية' تُرجم بدقة متناهية بالفرنسية 'décision de justice privative de liberté' وهو التعبير الفني الدقيق المعتمد في القانون الجنائي المقارن وحقوق الإنسان."
  },
  {
    id: 12,
    title: "إعادة إدماج نزلاء المؤسسات السجنية وتحديثها",
    ar: "ولقد تأثرنا بالغ التأثر لما وقع في بعض السجون من حوادث مؤلمة، لذلك وبموازاة مع الإصلاح المتقدم الذي شمل قانون السجون، وبرنامج العمل الطموح الذي تسهر على أن تنهض به مؤسسة محمد السادس لإعادة إدماج نزلاء المؤسسات السجنية، فقد أصدرنا تعليماتنا قصد الإسراع ببناء مركبات سجنية عصرية مدنية وفلاحية والاعتناء بالظروف المادية والمعنوية للسجناء.",
    fr: "Nous avons été profondément touché par les événements douloureux qui se sont produits dans certaines prisons. Par conséquent, et parallèlement à la réforme avancée qui englobe la législation pénitentiaire et le programme d'actions ambitieux dont Nous supervisons la réalisation par la Fondation Mohammed VI pour la réinsertion des pensionnaires des établissements pénitentiaires, Nous avons donné Nos Instructions pour faire construire rapidement des complexes pénitentiaires modernes, civils et agricoles, et pour veiller à l'amélioration des conditions matérielles et morales des prisonniers.",
    vocabulary: [
      { fr: "Législation pénitentiaire", ar: "قانون السجون", explanation: "مجموعة القوانين والقواعد المنظمة للحياة داخل المؤسسات السجنية وحقوق السجناء وواجباتهم." },
      { fr: "Réinsertion des pensionnaires", ar: "إعادة إدماج النزلاء", explanation: "إعداد السجناء علمياً ومهنياً ونفسياً للعودة والمساهمة بشكل إيجابي في المجتمع بعد انقضاء عقوبتهم." },
      { fr: "Complexes pénitentiaires", ar: "مركبات سجنية", explanation: "المباني والمنشآت السجنية الحديثة المصممة لتأمين السجن مع توفير فضاءات للتعليم والتأهيل المهني." },
      { fr: "Conditions matérielles et morales", ar: "الظروف المادية والمعنوية", explanation: "الجوانب الحياتية والغذائية والطبية (المادية) والتعليمية والنفسية والأسرية (المعنوية) للسجين." }
    ],
    analysis: "استعمال لفظ 'réinsertion' لترجمة 'إعادة إدماج'، ومصطلح 'pensionnaires' لـ 'نزلاء' بدلاً من 'prisonniers' أو 'détenus' يعكس المنظور الحقوقي والإنساني لإعادة تأهيل السجناء."
  },
  {
    id: 13,
    title: "شروط وضوابط العفو الملكي الإنساني",
    ar: "وللتخفيف من معاناة بعض الفئات من السجناء الذي يحظون بعطفنا لاعتبارات إنسانية، فقد أصدرنا توجيهاتنا السامية لوزيرنا في العدل ليرفع لنظرنا السديد اقتراحات بالعفو الملكي على مجموعة من السجناء المصابين بمرض عضال أو العاجزين أو المعاقين أو النساء الحوامل والمرضعات أو الأطفال ذوي المهارات التربوية والفنية بحسب معايير ولوائح إسمية مدققة سنعلن عن قرارنا بشأنها في الوقت المناسب.",
    fr: "Soucieux d'atténuer les souffrances de certaines catégories de prisonniers qui bénéficient de Notre compassion pour des raisons humanitaires, Nous avons donné Nos Hautes Directives à Notre Ministre de la Justice pour qu'il soumette à Notre Haute appréciation des propositions visant à faire bénéficier de la Grâce Royale, une catégorie de prisonniers atteints de maladies incurables, des prisonniers invalides ou handicapés, ou des prisonnières enceintes ou allaitantes, ou des enfants dotés d'aptitudes éducatives ou artistiques particulières. Ces propositions devront être élaborées selon des critères rigoureux et sur la base de listes nominatives précises. Nous annoncerons au moment opportun la décision que Nous aurons prise à leur égard.",
    vocabulary: [
      { fr: "Grâce Royale", ar: "العفو الملكي", explanation: "الحق السيادي الدستوري للملك في إسقاط العقوبة أو تخفيضها أو استبدالها لفائدة السجين." },
      { fr: "Maladies incurables", ar: "مرض عضال", explanation: "الأمراض الخطيرة والمستعصية على العلاج الطبي والتي تبرر العفو والافراج لأسباب إنسانية." },
      { fr: "Femmes enceintes ou allaitantes", ar: "النساء الحوامل والمرضعات", explanation: "الفئات النسوية الضعيفة التي يراعي القانون والبعد الإنساني ظروف أمومتها وحماية جنينها وأطفالها." },
      { fr: "Listes nominatives précises", ar: "لوائح إسمية مدققة", explanation: "الملفات واللوائح التي تحمل الأسماء والمعلومات الدقيقة التي تقترحها لجنة العفو الملكي وتخضع للتمحيص الدقيق." }
    ],
    analysis: "تُرجم 'العفو الملكي' بـ 'Grâce Royale'، ويعد العفو حقاً سيادياً دستورياً يمارسه جلالة الملك بناءً على اقتراحات مدققة ترفعها لجنة العفو المختصة بوزارة العدل."
  },
  {
    id: 14,
    title: "قضاة تنفيذ العقوبات والمسطرة الجنائية",
    ar: "كما أننا ندعو الحكومة إلى اغتنام المهلة المحددة لتفعيل القانون الجديد للمسطرة الجنائية من أجل تكوين وتأهيل قضاة تنفيذ العقوبات لمتابعة سلوك السجناء التائبين والإسهام في توسيع فرص الإفراج",
    fr: "Nous appelons le gouvernement à mettre à profit les délais impartis pour l'entrée en vigueur du nouveau code de procédure pénale, pour assurer la formation et la qualification des juges d'exécution des peines, de sorte qu'ils puissent observer la conduite des prisonniers repentis et contribuer à accroître les opportunités de mise en liberté.",
    vocabulary: [
      { fr: "Code de procédure pénale", ar: "قانون المسطرة الجنائية", explanation: "مجموعة القواعد التي تنظم إجراءات البحث والتحقيق والمحاكمة وتطبيق العقوبات الجنائية." },
      { fr: "Juges d'exécution des peines", ar: "قضاة تنفيذ العقوبات", explanation: "القضاة المتخصصون في مراقبة قانونية وملاءمة تطبيق العقوبات السجنية وتوجيه نزلاء المؤسسات." },
      { fr: "Prisonniers repentis", ar: "السجناء التائبين", explanation: "السجناء الذين أبانوا عن سلوك حسن وتوبة صادقة ورغبة حقيقية في الاندماج الاجتماعي السليم." },
      { fr: "Mise en liberté", ar: "فرص الإفراج / السراح", explanation: "الآليات والفرص المتاحة لإطلاق سراح السجين قبل انتهاء مدته مثل السراح المقيد بشروط." }
    ],
    analysis: "يبرز هنا دور 'قاضي تنفيذ العقوبات' (juge d'exécution des peines) وهو مؤسسة قانونية مستحدثة لمتابعة مسار السجين داخل المؤسسة وتقييم حسن سلوكه لمنحه العفو أو السراح المقيد."
  },
  {
    id: 15,
    title: "حماية كيان الأمة والحديث الشريف والعدل مذهب الحكم",
    ar: "والله تعالى نسأل أن يعينكم، معشر القضاة على إقامة العدل بكل ما يتطلبه من استقلال واستقامة وكفاية واجتهاد وحماية لأمن وسلامة وحرمة المواطنين وكيان الأمة والدولة من كل عمل إجرامي أو إرهابي. فتلك سبيلكم إلى استحقاق شرف النيابة عن جلالتنا في تحمل مسؤولية القضاء التي نناشدكم أن تتقوا الله في جسامة أمانتها . وذلك طريقكم لترسيخ ثقة المتقاضين ومصالحتهم مع القضاء وإشاعة العدل الذي جعلناه قوام مذهبنا في الحكم وغايته وعماد ما ننشده لشعبنا الحر الأبي من تطور ديمقراطي وتماسك اجتماعي وتقدم اقتصادي. والسلام عليكم ورحمة الله تعالى وبركاته.",
    fr: "Nous implorons Dieu Tout-Puissant de vous prêter assistance, honorables magistrats, pour que vous puissiez rendre la justice avec toute l'indépendance, la rectitude et la compétence nécessaires et avec l'Ijtihad requis, et prémunir la sécurité des citoyens et la sûreté et l'inviolabilité de la nation et de l'Etat, contre tout acte criminel ou terroriste. Telle est la voie que vous devez suivre pour être dignes de l'honneur qui vous échoit de rendre la justice au nom de Notre Majesté. C'est une lourde responsabilité dont Nous vous engageons à assumer les charges devant Dieu. C'est à ce prix que vous parviendrez à consolider la confiance des justiciables et à les réconcilier with la justice. Ainsi, vous ferez régner la justice dont Nous avons fait le socle et la finalité de Notre doctrine du pouvoir. C'est, en effet, sur elle que Nous fondons l'ambition d'assurer à Notre peuple libre et fier, le progrès démocratique, la cohésion sociale et l'essor économique que Nous appelons de Nos Vœux. WA Salamou Alaikoum WA Rahmatou Allah Wa Barakatouh.",
    vocabulary: [
      { fr: "Ijtihad requis", ar: "الاجتهاد المطلوب", explanation: "بذل قاضي الحكم أقصى وسعه الفكري والمهني لتطبيق وتفسير القانون على النوازل المستجدة بإنصاف." },
      { fr: "Doctrine du pouvoir", ar: "مذهبنا في الحكم", explanation: "الرؤية والفلسفة السياسية والدستورية التي يستند إليها رئيس الدولة في إدارة شؤون الحكم وإقرار العدالة." },
      { fr: "Inviolabilité de la nation", ar: "حرمة كيان الأمة", explanation: "صيانة أمن واستقلال وسيادة وتماسك مقومات المجتمع والدولة ضد التهديدات الإجرامية أو الإرهابية." },
      { fr: "Cohésion sociale et essor économique", ar: "تماسك اجتماعي وتقدم اقتصادي", explanation: "الغايات الاقتصادية والاجتماعية الكبرى التي يسهم القضاء المستقل والعادل في تحقيقها عبر حماية الحقوق." }
    ],
    analysis: "جاء في ختام الخطاب الملكي تحديد 'العدل' بأنه 'قوام المذهب في الحكم وغايته' وتُرجمت بدقة بـ 'le socle et la finalité de Notre doctrine du pouvoir' كمنهج وفلسفة دستورية لإقرار دولة الحق."
  }
];

const SPEECH_SECTIONS_2004: SpeechSection[] = [
  {
    id: 1,
    title: "إقامة العدل وتوفير الفضائل المثلى للقضاة",
    ar: "يطيب لنا أن نخاطبكم ومن خلالكم أسرة القضاء التي نحرص على أن تتوافر فيها كل الفضائل المثلى للنهوض بأمانة إقامة العدل الذي يعد من وظائف الإمامة العظمى والأساس الراسخ للحكم القويم وصون حقوق المواطنين وضمان مساواتهم أمام القانون.",
    fr: "Il Nous plaît de Nous adresser à vous, et à travers vous, à la famille de la magistrature dont Nous tenons à ce qu'elle soit nantie de toutes les vertus que requiert la mission qui lui est dévolue: celle d'administrer la justice, et remplir ainsi une fonction majeure de l'Imamat Suprême. La justice, en effet, est le socle sur lequel reposent l'exercice judicieux du pouvoir, la protection des droits des citoyens et la volonté de garantir leur égalité devant la loi.",
    vocabulary: [
      { fr: "Famille de la magistrature", ar: "أسرة القضاء", explanation: "جهاز القضاة والنيابة العامة وكتاب الضبط ومهنيي العدالة." },
      { fr: "Imamat Suprême", ar: "الإمامة العظمى", explanation: "المفهوم الإسلامي والدستوري المغربي التاريخي لولاية أمر الأمة ورعاية حقوقها الشرعية والقانونية." },
      { fr: "Socle", ar: "الأساس الراسخ", explanation: "الدعامة المتينة أو الركيزة الأساسية التي يستند إليها صرح البناء المؤسساتي للدولة." },
      { fr: "Exercice judicieux du pouvoir", ar: "الحكم القويم", explanation: "الممارسة العادلة والمتوازنة والرشيدة لسلطات الدولة وصلاحياتها." }
    ],
    analysis: "لاحظ ترجمة 'الإمامة العظمى' بمصطلحها الإسلامي والدستوري الدقيق 'Imamat Suprême'، ووصف القضاء بأنه 'الأساس الراسخ' بلفظ 'socle' لبيان متانة هذه المؤسسة الدستورية."
  },
  {
    id: 2,
    title: "كسب ثقة المتقاضين عبر النزاهة والاستقلال",
    ar: "ولا يمكن للقضاء أن يحقق المكانة الجديرة به إلا حين يكتسب ثقة المتقاضين التي لا تتحقق إلا من خلال ما يتحلى به القضاة من نزاهة وتجرد واستقامة واستقلال عن أي تأثير أو تدخل.",
    fr: "La justice ne peut accéder à la place qui lui revient qu'en s'assurant la confiance des justiciables, laquelle reste tributaire de l'intégrité, l'impartialité et la rectitude des magistrats qui doivent, par ailleurs, rester à l'abri de toute influence ou interférence.",
    vocabulary: [
      { fr: "Confiance des justiciables", ar: "ثقة المتقاضين", explanation: "الاطمئنان الوجداني والقانوني للمواطنين تجاه نزاهة الأحكام وجودتها وسرعة تنفيذها." },
      { fr: "Intégrité, impartialité et rectitude", ar: "نزاهة وتجرد واستقامة", explanation: "القيم والمبادئ الأخلاقية الأساسية لحياد القاضي ووقاره وبعده عن الشبهات." },
      { fr: "Tributaire de", ar: "تتحقق من خلال / رهينة بـ", explanation: "علاقة ارتباط سببية وشرط أساسي لا يمكن لشيء أن يتحقق بدونه." },
      { fr: "Influence ou interférence", ar: "تأثير أو تدخل", explanation: "أي محاولة للتوجيه أو الضغط أو التشويش الخارجي على قرار المحكمة." }
    ],
    analysis: "تُرجمت الثلاثية الأخلاقية للقضاء 'نزاهة وتجرد واستقامة' بـ 'intégrité, impartialité et rectitude' وهي ألفاظ دقيقة ومترابطة في أدبيات القضاء المقارن."
  },
  {
    id: 3,
    title: "استقلال القضاء عن السلطة التشريعية والتنفيذية وسلطة المال والإعلام",
    ar: "إن استقلال القضاء الذي نحن عليه حريصون ليس فقط إزاء السلطتين التشريعية والتنفيذية الذي يضمنه الدستور، ولكن أمام السلط الأخرى شديدة الإغواء، وفي مقدمتها سلطة المال المغرية بالارتشاء ، وسلطة الإعلام التي أصبحت بما لها من نفوذ متزايد وأثر قوي في تكييف الرأي العام سلطة رابعة في عصرنا،",
    fr: "Car l'indépendance de la justice à laquelle Nous sommes si fermement attaché, n'est pas uniquement celle qui est envisageable par rapport aux pouvoirs législatif et exécutif, et qui est, du reste, garantie par la Constitution mais une indépendance à l'égard d'autres pouvoirs très tentants, et notamment celui de l'argent à forte capacité corruptrice. Il en va de même de l'information dont l'influence croissante et l'impact puissant sur le conditionnement et le modelage de l'opinion publique ont fait aujourd'hui un véritable quatrième pouvoir,",
    vocabulary: [
      { fr: "Pouvoirs législatif et exécutif", ar: "السلطتين التشريعية والتنفيذية", explanation: "سلطة تشريع القوانين (البرلمان) وسلطة تنفيذه وتدبير الشأن العام (الحكومة)." },
      { fr: "Capacité corruptrice", ar: "شديدة الإغواء (المغرية بالارتشاء)", explanation: "القدرة المالية والوسائل المغرية التي تسعى لحرف العدالة عن حيادها عبر الرشوة." },
      { fr: "Conditionnement et modelage", ar: "تكييف الرأي العام", explanation: "التأثير الموجه والصياغة الممنهجة للأفكار والمواقف المجتمعية العامة." },
      { fr: "Quatrième pouvoir", ar: "سلطة رابعة", explanation: "الوصف المجازي لوسائل الإعلام والصحافة بالنظر لتأثيرها الكبير على المؤسسات والمجتمع." }
    ],
    analysis: "تمت ترجمة 'سلطة الإعلام' بـ 'l'information' والتعبير عن تكييف وتشكيل الرأي العام بـ 'conditionnement et modelage de l'opinion publique'، ووصف سلطة المال بـ 'capacité corruptrice' للدلالة على خطر الرشوة."
  },
  {
    id: 4,
    title: "سلطة النفس الأمارة بالسوء وميثاق الضمير كرقيب ذاتي",
    ar: "فضلا عن سلطة النفس الأمارة بالسوء، وإننا لنعتبر أن استقلال القاضي بمعناه الحق عن هذه المؤثرات الجامحة لا تكفله الوسائل القانونية مهما كانت متوافرة، وإنما يكفله قبل كل شيء الميثاق الذي بينه وبين ضميره، فهو رقيبه الذاتي الدائم والوسيلة المثلى لتحصين نفسه من كل تأثير أو انحراف وهو يقوم برسالته النبيلة.",
    fr: "sans parler de cet autre pouvoir qu'est l'inclination maléfique qui habite l'être humain. Nous considérons, en effet, que l'indépendance, réelle et effective, du magistrat à l'égard de sollicitations aussi pressantes, ne saurait être garantie par les seuls moyens juridiques, si abondants soient-ils. En revanche, le garde-fou le plus sûr réside, avant tout, dans le pacte scellé entre le juge et sa conscience. Tel est, en effet, le gage de la vigilance qu'il s'impose à lui-même, et le moyen le plus fiable de se prémunir contre toute ingérence ou dérive pendant l'exercice de sa noble mission.",
    vocabulary: [
      { fr: "Inclination maléfique", ar: "النفس الأمارة بالسوء", explanation: "النزعة البشرية الداخلية نحو الانحراف أو الخضوع للشهوات والميول غير العادلة." },
      { fr: "Pacte scellé", ar: "الميثاق الذي بينه وبين", explanation: "العهد والالتزام الأخلاقي والقانوني الوثيق المبرم مع الذات." },
      { fr: "Garde-fou", ar: "الوسيلة المثلى للتحصين", explanation: "حاجز الأمان أو الآلية الوقائية التي تمنع الشخص من الانزلاق والسقوط في الخطأ." },
      { fr: "Prémunir contre", ar: "تحصين نفسه من", explanation: "أخذ الحيطة والحماية والوقاية الاستباقية لتجنب المخاطر والانحرافات." }
    ],
    analysis: "تمت ترجمة التعبير القرآني 'النفس الأمارة بالسوء' بمفهوم فلسفي أخلاقي رفيع 'l'inclination maléfique qui habite l'être humain'، وترجمة 'تحصين' بـ 'garde-fou' وهو مصطلح قانوني مجازي يدل على الحماية والتحصين من الانحراف."
  },
  {
    id: 5,
    title: "دور ومسؤولية المجلس الأعلى للقضاء كأول الملتزمين بالنزاهة",
    ar: "وإذا كان المغرب في نطاق نظابة الملكي الدستوري قد بوأ المجلس الأعلى للقضاء المكانة السامية كمؤسسة دستورية برئاسة جلالتنا وجعل معظم الأعضاء منتخبين للسهر على الضمانات المخولة للقضاة، فإن أعضاء هذا المجلس هم أول الملزمين بالحرص على استقلال القضاء ونزاهته وحرمته،",
    fr: "Le Maroc, dans le cadre de son régime monarchique constitutionnel, a érigé le Conseil Supérieur de la Magistrature en institution constitutionnelle, présidée par Notre Majesté et dont les membres, élus pour la plupart, ont pour mission de veiller sur les garanties conférées aux magistrats. Il n'en reste pas moins que c'est aux membres du Conseil qu'il appartient d'abord, de s'assurer de l'indépendance, de l'intégrité et de l'inviolabilité de la justice.",
    vocabulary: [
      { fr: "Régime monarchique constitutionnel", ar: "النظام الملكي الدستوري", explanation: "نظام الحكم الديمقراطي الذي يقوده الملك بصفته رئيساً للدولة ومحترماً لأحكام الدستور." },
      { fr: "Érigé", ar: "بوأ", explanation: "رفع مكانة أو أسس ورسخ الهيكل المؤسساتي في القانون والدستور." },
      { fr: "Inviolabilité", ar: "حرمة القضاء", explanation: "الهيبة والقدسية والحصانة التي تمنع أي مساس أو تشكيك أو انتهاك لاستقلال وحياد العدالة." },
      { fr: "Garanties conférées", ar: "الضمانات المخولة", explanation: "الحقوق القانونية والدستورية المقررة للقضاة لحمايتهم أثناء أداء وظائفهم السامية." }
    ],
    analysis: "لاحظ استخدام كلمة 'Inviolabilité' لترجمة 'حرمته'، وهو مصطلح يدل على الحصانة المطلقة وعدم قابلية الانتهاك أو التأثير غير القانوني."
  },
  {
    id: 6,
    title: "التزام القضاة بالقيم الأخلاقية والقدوة الحسنة",
    ar: "مجسدين هذه الفضائل المثلى بالالتزام بضوابط وأخلاقيات المهنة. فعليكم، رعاكم الله، أن تكونوا القدوة في هذا المجال، معتبرين مهمتكم تكليفا قبل أن تكون تشريفا، حريصين على ألا تكونوا ، والعياذ بالله، ممن ينهى عن خلق ويأتي بأسوأ منه. ومن ثمة، وكما هو شأن كل مسؤول من الوزير المسؤول سياسيا أمام الملك والبرلمان وأمام المحكمة العليا في حالة خرقه للقانون إلى البرلماني الذي ترفع عنه الحصانة في حالة إخلاله بالدستور والقانون،",
    fr: "Ils se doivent, en effet, d'incarner ces vertus cardinales, en se pliant aux normes éthiques et déontologiques de la profession. Tachez donc d'être le modèle à suivre en la matière, en ayant à l'esprit que si elle vous honore, votre mission, est d'abord un devoir qui vous interpelle. Gardez-vous d'être - qu'à Dieu ne plaise - de ceux qui, pour redresser un tort, tombent dans un travers encore plus grave. Il y va du magistrat comme de tout autre responsable, depuis le ministre, qui est politiquement responsable devant le Roi et le Parlement, et even devant la Haute Cour de justice, en cas d'infraction à la loi, jusqu'au député qui perd le bénéfice de l'immunité parlementaire en cas d'atteinte à la Constitution ou à la loi.",
    vocabulary: [
      { fr: "Vertus cardinales", ar: "الفضائل المثلى", explanation: "القيم والمبادئ السامية الأساسية كالعدل، والحكمة، والاعتدال، والشجاعة." },
      { fr: "Normes éthiques et déontologiques", ar: "ضوابط وأخلاقيات المهنة", explanation: "الواجبات المهنية والميثاق الأخلاقي وسلوكيات ممارسة المهنة القضائية بوقار وحياد." },
      { fr: "Un devoir qui vous interpelle", ar: "تكليفا", explanation: "مسؤولية وواجب عظيم يستلزم المحاسبة والحرص، بعيداً عن مجرد الوجاهة الاجتماعية." },
      { fr: "Immunité parlementaire", ar: "الحصانة البرلمانية", explanation: "الضمانة القانونية التي تمنع اتخاذ إجراءات سالبة للحرية ضد البرلماني لتمكينه من أداء مهامه دون تضييق." }
    ],
    analysis: "تُرجم التعبير البلاغي 'تكليفاً قبل أن يكون تشريفاً' بعبارة معبرة 'si elle vous honore, votre mission est d'abord un devoir qui vous interpelle'. كما تُرجم البيت الشعري المجازي 'ينهى عن خلق ويأتي بأسوأ منه' بـ 'ceux qui, pour redresser un tort, tombent dans un travers encore plus grave'."
  },
  {
    id: 7,
    title: "خضوع القاضي للقانون وضمانات استقلاله",
    ar: "فإن القاضي المطوق بأمانة صيانة سيادة القانون لا يعتبر بالأحرى فوقه وليس منزها عن متابعته عند الإخلال بواجباته، علما بأن الضمانات المخولة له لا يجوز أن تفسر بكونها امتيازا تفضيليا ، وإنما هي ضمانات لأداء مهمته باستقلال وفي تقيد بالقانون، وإلا فمن يراقب المراقب.",
    fr: "En effet, le magistrat qui a pour devoir de veiller à la primauté de la loi, ne saurait, à plus forte raison, se placer au-dessus d'elle; pas plus qu'il ne peut se soustraire aux poursuites judiciaires s'il venait à faillir aux devoirs qui sont les siens. Car les garanties qui lui sont accordées ne sauraient être assimilées à des avantages préférentiels ou des privilèges. Ce sont plutôt des gages pour qu'il remplisse sa mission en toute indépendance et dans le plein respect de la loi. Autrement qui contrôlerait le contrôleur ?",
    vocabulary: [
      { fr: "Primauté de la loi", ar: "سيادة القانون", explanation: "المبدأ الدستوري الأساسي القاضي بسمو القواعد القانونية وخضوع سائر سلطات الدولة ومواطنيها لها." },
      { fr: "À plus forte raison", ar: "بالأحرى", explanation: "صيغة منطقية وقانونية تفيد الانتقال من فرضية صعبة الاستبعاد إلى فرضية أولى بالقبول." },
      { fr: "Se soustraire aux poursuites", ar: "منزها عن متابعته", explanation: "التهرب أو الإفلات من المتابعة والملاحقة القضائية والقانونية في حال ارتكاب خطأ تأديبي أو جنائي." },
      { fr: "Qui contrôlerait le contrôleur", ar: "من يراقب المراقب", explanation: "تساؤل كوني فلسفي يفيد وجوب خضوع الأجهزة الرقابية والعدلية لأحكام القانون والمحاسبة دون استثناء." }
    ],
    analysis: "لاحظ الترجمة البديعة للسؤال الفلسفي القانوني التاريخي 'من يراقب المراقب' بالفرنسية 'Autrement qui contrôlerait le contrôleur?' وهو تساؤل لاتيني شهير (Quis custodiet ipsos custodes) يدل على ربط المسؤولية بالمحاسبة."
  },
  {
    id: 8,
    title: "اقتراح تعديلات النظام الداخلي وتعزيز الاستقامة",
    ar: "وحرصا من جلالتنا على تدعيم دولة المؤسسات، فإننا ندعوكم إلى أن ترفعوا إلى نظرنا السامي مقترحات تكميلية للنظام الداخلي للمجلس تستهدف ضمان استقلالية أعضائه وتخويله رفع توصيات في شأن المخلين منهم بشرف وضوابط وأخلاقيات عضويته بكيفية تجعل من مكوناته نموذجا يحتذى في الاستقامة والنزاهة.",
    fr: "Eu égard au souci qui anime Notre Majesté de consolider l'Etat des institutions, Nous vous invitons à soumettre à Notre Haute appréciation, des propositions complémentaires au Règlement Intérieur du Conseil, qui soient de nature à garantir l'indépendance de ses membres et qui lui permettent de soumettre des recommandations concernant ceux parmi eux qui viendraient à porter atteinte à l'honneur de ses membres et aux règles d'éthique et de déontologie qui s'y imposent. Il s'agit, en effet, de faire en sorte que le Conseil, dans toutes ses composantes, soit un modèle de droiture et d'intégrité.",
    vocabulary: [
      { fr: "État des institutions", ar: "دولة المؤسسات", explanation: "البناء الدستوري والسياسي القائم على الفصل بين السلط واحترام توازنها وقانونية قراراتها." },
      { fr: "Règlement Intérieur du Conseil", ar: "النظام الداخلي للمجلس", explanation: "مجموعة القواعد التي تنظم طريقة عمل وسير الهيئة وصلاحياتها وتأديب أعضائها." },
      { fr: "Modèle de droiture et d'intégrité", ar: "نموذجاً يحتذى في الاستقامة والنزاهة", explanation: "القدوة والريادة الأخلاقية والسلوكية التي تتسم بالصدق والابتعاد عن الشبهات." },
      { fr: "Porter atteinte à l'honneur", ar: "الإخلال بالشرف", explanation: "القيام بتصرفات شائنة تمس بالسمعة الشخصية أو المهنية والهيبة والاعتبار." }
    ],
    analysis: "تمت ترجمة 'دولة المؤسسات' بـ 'l'Etat des institutions' وهو التعبير المقابل لها في القانون الدستوري والعلوم السياسية لترسيخ البناء المؤسساتي."
  },
  {
    id: 9,
    title: "الجمع بين الرعاية والصرامة والتسامح في الهفوات",
    ar: "وإن التقدير الكبير والرعاية السامية والموصولة التي تحظى بها أسرة القضاء لدى جلالتنا، وإيثار العفو والتسامح فيما يقع فيه البعض من هفوات أو أخطاء ممن أراد الحق فأخطأ سبيله لا يعادله إلا دعوتنا المجلس إلى الحزم والصرامة في التصدي لكل إخلال بضوابط وأخلاقيات عضوية المجلس الأعلى للقضاء وأسرته في التزام بالقانون وحرص على حرمة القضاء وحصانته المغربية",
    fr: "La grande estime et la haute et constante sollicitude de Notre Majesté pour la famille de la justice, ainsi que le pardon et l'indulgence dont Nous avons fait montre lorsque certains, pourtant bien intentionnés, sont tombés dans des errements et des travers, n'ont d'égale que Notre volonté d'exhorter le Conseil à faire preuve de fermeté et de sévérité pour contrecarrer toute atteinte à l'éthique et à la déontologie du Conseil Supérieur de la Magistrature et de la famille de la justice, et ce dans le plein respect de la loi, de l'honneur de la justice et de son inviolabilité.",
    vocabulary: [
      { fr: "Sollicitude constante", ar: "الرعاية الموصولة", explanation: "العناية الفائقة والدائمة والمستديمة التي توليها قيادة الدولة لقطاع أو فئة معينة." },
      { fr: "Pardon et indulgence", ar: "العفو والتسامح", explanation: "التغاضي والرحمة في التعاطي مع زلات غير مقصودة لترسيخ روح التوجيه والإصلاح الإيجابي." },
      { fr: "Errements et travers", ar: "الهفوات أو الأخطاء", explanation: "السلوكيات الخاطئة أو الأخطاء المهنية البسيطة التي لا تمس الشرف أو الاستقلال مباشرة." },
      { fr: "Fermeté et sévérité", ar: "الحزم والصرامة", explanation: "الحسم الفوري وغير المتردد في تطبيق القانون وتأديب المتجاوزين لحماية هيبة المؤسسة." }
    ],
    analysis: "لاحظ استخدام اللفظة المترادفة البليغة 'errements et travers' للتعبير عن 'الهفوات أو الأخطاء'، والتعبير عن 'ممن أراد الحق فأخطأ سبيله' بالوصف الفرنسي الدقيق 'certains, pourtant bien intentionnés' (حسنو النية)."
  },
  {
    id: 10,
    title: "حرية التعبير وحقوق المواطنة للقضاة في إطار مهني",
    ar: "وإدراكا منا بأن التزام القضاة بمسؤوليتهم الجسيمة في جو من الاستقلال والتجرد والوقار لا يحرمهم من التعبير عن أراءهم البناءة كقوة اقتراحية لإصلاح القضاء وإيجاد كل الوسائل الكفيلة بتمكينهم من ممارسة حقوق المواطنة كاملة في التزام بقانون وأخلاقيات وخصوصيات رسالتهم النبيلة،",
    fr: "Conscient que l'engagement des magistrats dans l'accomplissement de leurs lourdes responsabilités, dans un climat d'indépendance, d'impartialité et de dignité, ne les prive aucunement d'exprimer leurs opinions constructives en tant que force de proposition pour réformer la justice, et de trouver tous les moyens de leur permettre d'exercer pleinement leurs droits de citoyenneté, dans le respect de la loi, de la déontologie et de la spécificité de leur noble mission,",
    vocabulary: [
      { fr: "Force de proposition", ar: "قوة اقتراحية", explanation: "الهيئة أو الفئة الاجتماعية والمهنية القادرة على صياغة وبث وتطوير رؤى وحلول للمشاكل العامة." },
      { fr: "Droits de citoyenneté", ar: "حقوق المواطنة", explanation: "الحقوق الأساسية كالتعبير والمشاركة والانتساب والانتخاب المضمونة دستورياً للمواطن." },
      { fr: "Spécificité de leur noble mission", ar: "خصوصيات رسالتهم النبيلة", explanation: "الخصوصية الأخلاقية والمهنية للقضاة التي تفرض التزام التحفظ والوقار والنزاهة المطلقة." },
      { fr: "Dignité", ar: "الوقار", explanation: "السلوك الرفيع والهيبة والأخلاق الرفيعة التي تجعل القاضي بعيداً عن الصراعات والانحيازات." }
    ],
    analysis: "تمت ترجمة 'قوة اقتراحية' بـ 'force de proposition'، وهو مصطلح فرنسي عصري متداول بكثرة في مجالات السياسة والتسيير العمومي يدل على الهيئات التي تبادر بتقديم الأفكار والحلول."
  },
  {
    id: 11,
    title: "المؤسسات الثلاث الكبرى لأسرة القضاء",
    ar: "فقد وفرنا لهم لهذا الغرض ثلاث مؤسسات متكاملة، بدءا من المجلس الأعلى للقضاء باعتباره المؤسسة الدستورية الساهرة على الضمانات الدستورية والقانونية المخولة للقضاة، إلى الودادية الحسنية للقضاة التي تحتضن مختلف أنشطتهم وانشغالاتهم وتعبئتهم كقوة اقتراحية لإصلاح قطاع العدل إلى المؤسسة المحمدية للنهوض بالأعمال الاجتماعية لأسرة القضاء.",
    fr: "Nous avons, à cet effet, mis à leur disposition trois institutions complémentaires: à commencer par le Conseil Supérieur de la Magistrature, en tant qu'institution constitutionnelle veillant sur les garanties constitutionnelles et juridiques conférées aux magistrats; puis l'Amicale Hassanienne des Magistrats, qui regroupe leurs différentes activités et préoccupations et les mobilise en tant que force de proposition pour réformer la justice; et enfin, la Fondation Mohammadia pour la promotion des œuvres sociales de la famille de la justice.",
    vocabulary: [
      { fr: "Institutions complémentaires", ar: "مؤسسات متكاملة", explanation: "الهياكل الثلاثة التي تغطي الجانب الدستوري، الجمعوي/المهني، والاجتماعي للعدالة." },
      { fr: "Activités et préoccupations", ar: "أنشطتهم وانشغالاتهم", explanation: "مجالات الاهتمام والتطوير والتحديات الفكرية والعملية والمهنية للقضاة." },
      { fr: "Promotion des œuvres sociales", ar: "النهوض بالأعمال الاجتماعية", explanation: "تحسين الجوانب المعيشية والصحية والاجتماعية ودعم التكافل والأنشطة الترفيهية والثقافية." },
      { fr: "Fondation Mohammadia", ar: "المؤسسة المحمدية للأعمال الاجتماعية", explanation: "المؤسسة الرسمية المحدثة لرعاية الشؤون والخدمات الاجتماعية لقضاة وموظفي وزارة العدل بالمغرب." }
    ],
    analysis: "تُظهر الفقرة كيف حدد الخطاب الملكي مجالات عمل المؤسسات الثلاث لضمان التوازن بين الواجبات الدستورية، والنشاط الجمعوي المهني، والجانب الاجتماعي التكافلي للأسرة القضائية."
  },
  {
    id: 12,
    title: "قنوات التواصل المؤسسي لتفادي المساس بالحياد",
    ar: "وبذلك، وفرنا للقضاة فضاءات رحبة وقنوات للتواصل والتعبير عن الرأي واقتراح الحلول الملموسة للمشاكل المطروحة داخل إطار مؤسسي ومحدد. وكل ممارسة لهذه الحقوق خارج تلك المؤسسات من شأنها أن تمس باستقلاله وتجرده اللذين هما قوام نهوضه على الوجه الأمثل بمسؤوليته الجسيمة.",
    fr: "Nous avons, ainsi, mis à la disposition des magistrats de vastes espaces d'expression, d'interaction et de communication qui leur permettent de proposer des solutions concrètes aux problèmes posés, dans un cadre institutionnel bien défini. Tout exercice de ces droits en dehors du cadre de ces institutions est de nature à compromettre leur indépendance et leur impartialité, vertus essentielles pour qu'ils puissent remplir au mieux les lourdes tâches qui sont les leurs.",
    vocabulary: [
      { fr: "Cadre institutionnel bien défini", ar: "إطار مؤسسي ومحدد", explanation: "الهياكل والضوابط القانونية والتنظيمية الرسمية التي تؤطر العمل وتمنع الفوضى أو الانحياز." },
      { fr: "Compromettre leur indépendance", ar: "تمس باستقلاله وتجرده", explanation: "إضعاف حياد القاضي أو تعريضه للتشكيك والشبهات في أعين المتقاضين." },
      { fr: "Vertus essentielles", ar: "قوام نهوضه (الفضائل الجوهرية)", explanation: "القيم والمقومات والأسس الأخلاقية التي يرتكز عليها نجاح القاضي ومصداقيته." },
      { fr: "Solutions concrètes", ar: "حلول ملموسة", explanation: "الإجراءات العملية والواقعية والناجعة القابلة للتطبيق الفوري لحل الإشكالات." }
    ],
    analysis: "تُرجمت 'تمس باستقلاله وتجرده' بـ 'compromettre leur indépendance et leur impartialité' حيث يوضح الخطاب ضرورة تفادي ممارسة العمل الخارجي الذي قد يشوب نزاهة وحياد القاضي."
  },
  {
    id: 13,
    title: "جلالة الملك الملاذ الدائم وضامن حرمة القضاء",
    ar: "فعلى القضاة العمل داخل هذه المؤسسات لإيجاد الحلول المرتبطة بمهنتهم وأوضاعهم، وبعد استنفاذ اللجوء لكل هذه الهيئات وعدم إحقاق الحق أو ملاحظة وجود خروقات عميقة، فإن جلالتنا تظل الملاذ الدائم لضمان حرمة القضاء واستقلاله في كل الظروف والأحوال لإعطاء كل ذي حق حقه وإعادة الأمور إلى نصابها.",
    fr: "Il appartient donc aux magistrats de s'employer, au sein de ces institutions, à trouver des solutions aux problèmes qui affectent leur profession et leur situation. Lorsque tous les recours ont été épuisés, au sein de ces institutions, sans que justice n'ait été faite et alors que perdurent de graves transgressions de la loi, Notre Majesté demeure l'ultime recours pour garantir l'inviolabilité et l'indépendance de la justice, en toutes circonstances et dans tous les cas de figure, pour que chacun soit rétabli dans ses droits et que les choses rentrent dans l'ordre.",
    vocabulary: [
      { fr: "Recours épuisés", ar: "استنفاذ اللجوء", explanation: "استعمال وتجريب كافة الآليات والمؤسسات والطعون المتاحة قانونياً دون جدوى." },
      { fr: "Transgressions de la loi", ar: "خروقات عميقة", explanation: "المخالفات الجسيمة والتجاوزات العميقة والمنهجية لأحكام القانون والعدالة." },
      { fr: "Ultime recours", ar: "الملاذ الدائم", explanation: "الضامن الأخير والملجأ النهائي في الدولة لحماية الحقوق وإقرار العدالة عند انسداد الآفاق القضائية." },
      { fr: "Rétabli dans ses droits", ar: "إعطاء كل ذي حق حقه", explanation: "استرجاع الحقوق المغتصبة أو المهضومة لأصحابها وإعادة تصحيح الأوضاع القانونية المتضررة." }
    ],
    analysis: "تُرجم مصطلح 'الملاذ الدائم' بـ 'l'ultime recours' وهو تعبير قانوني ودستوري يدل على الدور التحكيمي الأعلى لرئيس الدولة لضمان استقلال السلطة القضائية وحماية حقوق المواطنين."
  },
  {
    id: 14,
    title: "التوجيه الرباني والحديث الشريف وسند أمير المؤمنين",
    ar: "وستجدون دوما في خديم المغرب الأول، أمير المؤمنين، ليس فقط رئيسا لمجلسكم الأعلى، ولكن أيضا ملاذكم الأسمى وسندكم الأقوى في التمسك بمستلزمات مهمتكم السامية. وإننا لنناشدكم أن تلتزموا في أداء مهامكم بأمره تعالى : وإذا حكمتم بين الناس أن تحكموا بالعدل، وبمغزى حكمة الحديث النبوي الشريف قاض في الجنة وقاضيان في النار»،",
    fr: "En assumant vos lourdes charges et les contraintes y afférentes, vous trouverez toujours, en la personne du premier Serviteur du Maroc, Amir Al Mouminine, non seulement le Président de votre Conseil, mais également votre plus ferme soutien. Nous vous engageons vivement à vous conformer, dans l'accomplissement de votre mission, à cette injonction divine: 'Si vous jugez vos semblables, jugez-les avec équité', tout en gardant à l'esprit la sagesse de ce noble Hadith prophétique: 'Un juge au paradis, deux en enfer'.",
    vocabulary: [
      { fr: "Amir Al Mouminine", ar: "أمير المؤمنين", explanation: "اللقب الشرعي والدستوري التاريخي لملك المغرب بصفته حامياً للملة والدين والضوابط الأخلاقية والشرعية." },
      { fr: "Premier Serviteur du Maroc", ar: "خديم المغرب الأول", explanation: "تعبير متواضع بليغ يجسد به ملك المغرب ارتباط قيادته بخدمة الشعب والوطن." },
      { fr: "Injonction divine", ar: "أمره تعالى", explanation: "التوجيه القرآني الصريح والواجب الاتباع باعتباره حكماً إلهياً سامياً." },
      { fr: "Hadith prophétique", ar: "الحديث النبوي الشريف", explanation: "الأقوال والتوجيهات المنقولة عن الرسول صلى الله عليه وسلم لتأطير سلوك العدالة والتحذير من مغبة الظلم." }
    ],
    analysis: "يبرز في هذه الفقرة التوجيه الشرعي والروحي لعمل القضاة، بالاستشهاد بالقرآن الكريم 'إذا حكمتم بين الناس أن تحكموا بالعدل' (jugez avec équité)، والحديث النبوي الشريف (Hadith prophétique)."
  }
];

/* MISPLACED 2012 CONSTITUTIONAL SPEECH SECTIONS IN SPEECH_SECTIONS_2004
  {
    id: 8,
    title: "المؤتمر السادس لجمعية المحاكم الدستورية ونشر سيادة القانون (2012)",
    ar: "إنه لمن دواعي الاعتزاز أن تحتضن المملكة المغربية أعمال المؤتمر السادس الجمعية المحاكم الدستورية التي تتقاسم استعمال اللغة الفرنسية، برعايتنا السامية، بمدينة مراكش، أرض الحوار والملتقيات الدولية الكبرى. ويطيب لنا ، في البداية، أن نشيد بالأهداف النبيلة لجمعيتكم، ومساهمتها القيمة في نشر ثقافة سيادة القانون عماد دولة الحق والمؤسسات، وفي النهوض بالعدالة الدستورية، باعتبارها التجسيد الأمثل لسمو الدستور. ومما يضفي على مؤتمركم أهمية خاصة، كونه ينعقد في ظل التحولات التي يعرفها القانون الدستوري المعاصر، والتطورات المؤسسية التي تشهدها العديد من بلدان منطقتنا، بمختلف انعكاساتها، وما يقترن بها من تبؤ القضاء الدستوري المكانة المتميزة في المنظومة الديمقراطية الحديثة، ليس فقط كأساس للتوازن بين السلطات الدستورية، وإنما باعتباره أيضا مرجعا لها ولحقوق المواطن في ظلها.",
    fr: "C’est un motif de fierté que le Royaume du Maroc abrite les travaux du 6ème Congrès de l’Association des Cours Constitutionnelles ayant en partage l’usage de la langue française, sous Notre Haut Patronage, à Marrakech, terre de dialogue et de grands forums internationaux. Il Nous est agréable, tout d’abord, de saluer les nobles objectifs de votre Association et sa contribution de valeur à la diffusion de la culture de la primauté du droit, socle de l’Etat de droit et des institutions, et à la promotion de la justice constitutionnelle, en tant qu’incarnation optimale de la suprématie de la Constitution. Ce qui confère à votre Congrès une importance particulière, c’est le fait qu’il se tient à l’ombre des mutations que connaît le droit constitutionnel contemporain, et des développements institutionnels que connaissent de nombreux pays de notre région, avec leurs diverses répercussions, et ce qui s’y associe comme accession de la justice constitutionnelle à une place privilégiée dans le système démocratique moderne, non seulement en tant que fondement de l’équilibre entre les pouvoirs constitutionnels, mais aussi en tant que référence pour ces derniers et pour les droits des citoyens.",
    vocabulary: [
      { fr: "Justice constitutionnelle", ar: "العدالة الدستورية / القضاء الدستوري", explanation: "نظام الرقابة القضائية على دستورية القوانين لضمان مطابقتها للوثيقة الدستورية العليا." },
      { fr: "Primauté du droit", ar: "سيادة القانون", explanation: "خضوع كافة سلطات الدولة ومواطنيها للقواعد القانونية الموضوعة بالتوافق العام." },
      { fr: "Suprématie de la Constitution", ar: "سمو الدستور", explanation: "المبدأ الذي يضع الدستور في قمة الهرم القانوني للدولة متفوقاً على كافة القوانين والأنظمة." }
    ],
    analysis: "يبرز في هذه الفقرة مصطلح 'العدالة الدستورية' (justice constitutionnelle) كركيزة لسيادة القانون وتكريس مبدأ 'سمو الدستور' (suprématie de la Constitution). استخدام لغة قانونية دستورية رفيعة ومحكمة."
  },
  {
    id: 9,
    title: "المواطن والقضاء الدستوري في ظل الدستور الجديد للمملكة (2012)",
    ar: "ومن هذا المنطلق، تتجلى وجاهة اختياركم الموضوع المواطن والقضاء الدستوري كمحور أساسي لأشغال مؤتمركم اختيارا يجسد الالتزام القوي بجعل المواطن بحقوقه وواجباته، وحرياته، ووجوب ضمان كرامته، مرجعا وغاية لعمل المؤسسات الدستورية. ويصادف انعقاد مؤتمركم مرور سنة على إقرار دستور جديد للمملكة، بمضامين جد متقدمة، مؤسسة لنموذج دستوري مغربي متميز يشكل المواطن فيه صلب الأولويات والاهتمامات عمادة ترسيخ بناء دولة ديمقراطية حديثة، ترتكز على المشاركة والتعددية والحكامة الجيدة للمؤسسات الوطنية والترابية في ربط بين المسؤولية والمحاسبة، وذلك في إطار من التضامن والمساواة وتكافؤ الفرص.",
    fr: "C’est dans cette perspective que se manifeste la pertinence du choix de votre sujet : « Le citoyen et la justice constitutionnelle » comme axe fondamental des travaux de votre Congrès, choix qui incarne l’engagement fort de faire du citoyen, avec ses droits, ses devoirs, ses libertés et l’obligation de garantir sa dignité, la référence et la finalité de l’action des institutions constitutionnelles. La tenue de votre Congrès coïncide avec le premier anniversaire de l’adoption d’une nouvelle Constitution pour le Royaume, dotée de contenus très avancés, fondant un modèle constitutionnel marocain singulier dans lequel le citoyen constitue le cœur des priorités et des préoccupations, comme socle pour consolider l’édification d’un Etat démocratique moderne, basé sur la participation, le pluralisme et la bonne gouvernance des institutions nationales et territoriales dans l’articulation entre responsabilité et reddition des comptes, le tout dans un cadre de solidarité, d’égalité et d’égalité des chances.",
    vocabulary: [
      { fr: "Engagement fort", ar: "الالتزام القوي", explanation: "التعهد الوطني الصادق والعمل الجاد من لدن الدولة والمؤسسات لتحقيق تطلعات المواطنين وحماية كرامتهم." },
      { fr: "Responsabilité et reddition des comptes", ar: "المسؤولية والمحاسبة (ربط المسؤولية بالمحاسبة)", explanation: "المبدأ الدستوري الحديث الذي يقضي بمحاسبة كل مسؤول عمومي عن تدبيره للمال العام والصلاحيات الموكولة إليه." },
      { fr: "Gouvernance des institutions", ar: "حكامة المؤسسات (الحكامة الجيدة)", explanation: "الأساليب والقواعد الحديثة المعتمدة في إدارة المؤسسات بكفاءة وشفافية ومشاركة." }
    ],
    analysis: "تتطرق الفقرة للترابط الوثيق بين المواطن والقضاء الدستوري، وتسلط الضوء على مبدأ ربط المسؤولية بالمحاسبة (responsabilité et reddition des comptes) والحكامة الجيدة (bonne gouvernance) التي كرسها دستور 2011 كركائز للنموذج المغربي الديمقراطي التنموي."
  },
  {
    id: 10,
    title: "الاجتهاد القضائي الدستوري ومواجهة التحديات التنموية (2012)",
    ar: "وفي هذا الصدد، فإن دستور المملكة الجديد، بموازاة مع ارتقائه بالمكانة المؤسسية للسلطات التشريعية والتنفيذية والقضائية وتقويتها ، في ظل فصلها وتوازنها واستقلالها ، قد أقر ميثاقا للحقوق والحريات الأساسية بمختلف أجيالها ، وذلك ضمن منظومة متكاملة لحقوق الإنسان، كما هو متعارف عليها عالميا . كما كرس الآليات الكفيلة بضمان حمايتها وممارستها الفعلية، وفي صدارتها تخويل المواطن حق اللجوء إلى المحكمة الدستورية، لإثارة عدم دستورية أي قانون من شأن تطبيقه على نزاع معروض على القضاء، أن يمس بحقوقه وحرياتها الدستورية. وبالنظر لكافة المضامين المتقدمة للدستور الجديد للمملكة الذي أضحت ديباجته جزءا لا يتجزأ منه، وبارتقاء المجلس الدستوري إلى محكمة دستورية ذات اختصاصات واسعة، فإننا نتوخى توطيد دعائم المدرسة الدستورية المغربية الحافلة بعطاء الفقهاء الدستوريين المغاربة، عن طريق انبثاق اجتهاد قضائي دستوري خلاق وطموح، غايته المثلى، تكريس سمو الدستور والتقيد بأحكامه، نصا وروحا.",
    fr: "À cet égard, la nouvelle Constitution du Royaume, parallèlement à la revalorisation et au renforcement de la place institutionnelle des pouvoirs législatif, exécutif et judiciaire, sous le sceau de leur séparation, de leur équilibre et de leur indépendance, a consacré une charte des droits et libertés fondamentaux de différentes générations, dans le cadre d’un système intégré des droits de l’Homme tel qu’il est universellement reconnu. Elle a également instauré des mécanismes de nature à garantir leur protection et leur exercice effectif, au premier rang desquels figure l’octroi au citoyen du droit de saisine de la Cour Constitutionnelle, pour soulever l’inconstitutionnalité de toute loi dont l’application dans un litige soumis à la justice porterait atteinte à ses droits et libertés constitutionnels. Au vu de toutes les dispositions avancées de la nouvelle Constitution du Royaume, dont le préambule fait désormais partie intégrante, et de l’élévation du Conseil Constitutionnel au rang de Cour Constitutionnelle dotée de larges compétences, Nous visons à consolider les piliers de l’école constitutionnelle marocaine, riche de l’apport des constitutionnalistes marocains, à travers l’émergence d’une jurisprudence constitutionnelle créative et ambitieuse, dont le but ultime est de consacrer la suprématie de la Constitution et le respect de ses dispositions, dans leur texte et leur esprit.",
    vocabulary: [
      { fr: "Exception d'inconstitutionnalité", ar: "الدفع بعدم الدستورية (إثارة عدم الدستورية)", explanation: "آلية تخول للمتقاضين الطعن بعدم دستورية قانون يمس بحقوقهم وحرياتهم الدستورية المعروضة أمام المحكمة." }
    ],
    analysis: "يركز هذا المقطع على الآليات الدستورية لحماية الحقوق، وفي مقدمتها الدفع بعدم الدستورية (exception d'inconstitutionnalité) كأداة هامة لتكريس سمو الدستور."
  }
];
*/

const SPEECH_SECTIONS_2024: SpeechSection[] = [
  {
    id: 1,
    title: "المقدمة والجهوية كورش استراتيجي",
    ar: `يطيب لنا، أن نتوجه إليكم في افتتاح المناظرة الوطنية الثانية للجهوية المتقدمة، التي تنعقد تحت رعايتنا السامية، تأكيدا للاهتمام البالغ الذي نوليه لهذا الورش الاستراتيجي، الذي من شأنه المساهمة في توطيد الحكامة الترابية الجيدة وتحقيق التنمية الاقتصادية والاجتماعية ببلادنا، على المستويين الوطني والمحلي.

وإذا كانت النسخة الأولى من هذا الملتقى الوطني الهام قد شكلت مناسبة لاعتماد الإطار التوجيهي المتعلق بتفعيل ممارسة الجهة لاختصاصاتها الذاتية والمشتركة، والذي يعتبر إطارا مرجعيا مبنيا على مقاربة تشاركية، يستشرف سبل التعاون والشراكة بين الأطراف المعنية، فإن هذا الإطار قد شكل وسيشكل دائما مصدر التزام يسائل كافة الأطراف الموقعة عليه.

وإننا نتطلع لأن تشكل هذه المناظرة فرصة لاستعراض حصيلة تنزيل ورش الجهوية المتقدمة، ولتكريس التفاعل الإيجابي بين كافة المتدخلين، من مسؤولين حكوميين وممثلين عن المؤسسات العمومية ومنتخبين، حول الأسئلة ذات الاهتمام المشترك المتصلة بالتفعيل الأمثل لهذا الورش، وكذا البحث عن أنجع السبل لجعل الجهوية المتقدمة رافعة للتنمية الاقتصادية والاجتماعية، قادرة على مواجهة تحديات التنمية، ومعالجة أوجه النمو غير المتكافئ، والتفاوتات المجالية.`,
    fr: `Il Nous plaît de vous adresser ce message à l’ouverture des 2èmes Assises nationales de la régionalisation avancée qui se tiennent sous Notre Haut Patronage. Cette Haute sollicitude Royale témoigne de l’intérêt éminent que Nous attachons à ce chantier stratégique, susceptible de concourir à la consolidation de la bonne gouvernance territoriale et à la réalisation du développement socio-économique dans notre pays, aux niveaux national et local.

La première édition de cet important symposium national a été l’occasion d’adopter le cadre directif de mise en œuvre effective, par chaque région, de ses compétences propres et partagées. Adossé à une approche participative, ce cadre de référence permet d’explorer les voies de coopération et de partenariat entre les parties prenantes. A ce titre, il a toujours constitué une source d’engagement pour l’ensemble des parties signataires.

Notre souhait is que ces Assises soient l’occasion de dresser le bilan de la mise en œuvre du chantier de la régionalisation avancée et de favoriser davantage l’interaction positive entre tous les intervenants, qu’ils soient responsables gouvernementaux, représentants d’établissements publics ou élus, autour des questions d’intérêt commun, liées à la meilleure façon de mener à bien ce chantier. Nous attendons aussi qu’elles offrent l’opportunité d’identifier les moyens les plus efficaces d’ériger la régionalisation avancée en levier majeur de développement socio-économique. Il sera ainsi possible de relever les défis qui se posent en la matière et de remédier à l’inégale croissance et aux disparités spatiales.`,
    vocabulary: [
      { fr: "Chantier stratégique", ar: "الورش الاستراتيجي", explanation: "مشروع هيكلي وطني بعيد المدى يهدف لإحداث تحول نوعي في البنى التحتية والتنظيمية للدولة." },
      { fr: "Gouvernance territoriale", ar: "الحكامة الترابية", explanation: "التنسيق المشترك والفعال بين الفاعلين المحليين والشركاء لتدبير وتطوير المجال الجغرافي." },
      { fr: "Disparités spatiales", ar: "التفاوتات المجالية", explanation: "الفوارق الاقتصادية والاجتماعية ومستوى البنيات التحتية غير المتكافئ بين مختلف المناطق والجهات." }
    ],
    analysis: "يؤكد جلالة الملك في مقدمة الرسالة الملكية على أن الجهوية المتقدمة ورش استراتيجي غايته القصوى تحقيق الحكامة الترابية ورفع التفاوتات المجالية."
  },
  {
    id: 2,
    title: "تقييم المكتسبات والمرور إلى السرعة القصوى",
    ar: `إذا كانت الولاية الانتدابية الأولى قد تزامنت مع إحداث وتفعيل مختلف هياكل مجالس الجهات، واستكمال إصدار النصوص التطبيقية للقوانين التنظيمية المتعلقة بالجماعات الترابية، وكذا اعتماد أولى وثائق التخطيط وبرامج التنمية، فضلا عن إصدار الميثاق الوطني للاتمركز الإداري، فإن الولاية الحالية تقتضي المرور إلى السرعة القصوى من أجل التجسيد الفعلي والناجع لهذا الورش المهيكل على أرض الواقع.

ومن هذا المنطلق, تقتضي المرحلة الحالية وقفة تقييمية للأشواط التي قطعتها بلادنا على درب إرساء أسس الجهوية المتقدمة، وتعزيز اللاتمركز الإداري، ولاسيما فيما يتعلق بتفعيل التوصيات المنبثقة عن الدورة الأولى للمناظرة في هذا الشأن.

وقد سبق لنا أن دعونا في الرسالة التي وجهناها للمشاركين في المناظرة الوطنية الأولى للجهوية المتقدمة لسنة 2019، إلى "وضع إطار منهجي، محدد من حيث الجدولة الزمنية، لمراحل ممارسة الجهات لاختصاصاتها".

وفي هذا الصدد، يقتضي البعد الاستراتيجي لمسار الجهوية المتقدمة المزيد من انخراط كافة الفاعلين في مسلسل للتشاور والحوار البناء، بما ينسجم مع منطق التدرج والتطور في التنزيل الكامل لهذا الورش، وخاصة فيما يتعلق بتدقيق وتحديد وتملك الاختصاصات وممارستها بشكل فعال، من أجل رفع التحديات التي أفرزتها الممارسة العملية.`,
    fr: `Le premier mandat a coïncidé avec la création et l’activation des différentes structures des conseils régionaux, la finalisation des textes d'application des lois organiques relatives aux collectivités territoriales, l'adoption des premiers documents d'aménagement et programmes de développement, ainsi qu’avec la promulgation de la Charte nationale de la déconcentration administrative. Le mandat présent, quant à lui, requiert une célérité redoublée pour la mise en œuvre efficace de ce chantier structurant.

Ainsi, l'étape actuelle nécessite une évaluation des progrès réalisés par notre pays sur la voie de la régionalisation avancée et du renforcement de la déconcentration administrative, notamment en ce qui concerne l’application effective des recommandations en la matière, issues de la première édition des Assises nationales de la régionalisation avancée.

D’ailleurs, dans le message que Nous avons adressé, en 2019, aux participants aux premières Assises nationales de la régionalisation avancée, Nous avons appelé à « mettre en place un cadre méthodologique définissant le calendrier des étapes par lesquelles les Régions devront passer dans l’exercice de leurs compétences ».

À cet égard, la portée stratégique de la régionalisation avancée exige une implication accrue de tous les acteurs dans le processus de concertation et de dialogue constructif. Afin de relever les défis qui ont émergé de la pratique sur le terrain, cette action doit être menée conformément à la logique de gradation et d’évolution dans la pleine concrétisation de ce chantier, notamment en ce qui concerne l’audit, la définition, l’appropriation et l’exercice efficace des compétences dévolues.`,
    vocabulary: [
      { fr: "Célérité redoublée", ar: "السرعة القصوى", explanation: "تسريع وتيرة الإنجاز والعمل الإداري والميداني لتدارك التأخير وتحقيق الأهداف الاستراتيجية." },
      { fr: "Déconcentration administrative", ar: "اللاتمركز الإداري", explanation: "توزيع الصلاحيات والمهام الإدارية من الإدارات المركزية إلى المصالح والوحدات اللاممركزة على الصعيد الجهوي والمحلي." },
      { fr: "Lois organiques", ar: "القوانين التنظيمية", explanation: "قوانين مكملة للدستور تحدد القواعد التفصيلية لتنظيم وتسيير المؤسسات وسلطات الجماعات الترابية." }
    ],
    analysis: "يشير جلالته إلى ضرورة الانتقال إلى السرعة القصوى (célérité redoublée) في تنزيل ورش الجهوية المتقدمة مع تعزيز اللاتمركز الإداري الفعال."
  },
  {
    id: 3,
    title: "التحديات الثلاثة الأولى: اللاتمركز والاختصاصات والتشاركية",
    ar: `في سياق حرصنا على ضمان تنزيل أمثل لورش الجهوية المتقدمة، فإننا ندعو إلى مواصلة الجهود لمواجهة مختلف التحديات الراهنة والمستقبلية، التي يطرحها هذا الورش المهيكل، نذكر من بينها سبع تحديات كبرى.

أولا: تحدي الأجرأة الفعلية للميثاق الوطني للاتمركز الإداري :
فكما هو معلوم، حظي ورش اللاتمركز الإداري بعناية خاصة من لدن جلالتنا منذ اعتلائنا العرش، بالنظر لأهميته الاستراتيجية ضمن الدينامية المؤسساتية المواكبة لتنزيل الجهوية المتقدمة. وقد دعونا إلى التسريع بتفعيل مضامين الميثاق عبر نقل فعلي للاختصاصات الوظيفية والصلاحيات التقريرية إلى المستوى الجهوي. غير أنه لوحظ تأخر غالبية القطاعات الوزارية في التفعيل الحقيقي لورش اللاتمركز الإداري، ولا سيما في مجال الاختصاصات ذات الأولوية المتعلقة بالاستثمار، مما يعقد الإجراءات الإدارية ولا يمكن المستثمرين من إنجاز مشاريعهم في ظروف ملائمة.

ثانيا: تحدي تدقيق وتفعيل اختصاصات الجماعات الترابية لاسيما منها المجالس الجهوية، والذي يعد من الشروط الأساسية للتفعيل الحقيقي لورش الجهوية المتقدمة والنهوض بالتنمية الاقتصادية والاجتماعية للبلاد. إلا أن هذا الأمر أيضا، وبالرغم من المجهودات المبذولة في هذا المجال، لم يتحقق بعد على الوجه المطلوب. وندعو إلى اعتماد مقاربة شاملة تضطلع فيها كل من القطاعات الوزارية المعنية والجماعات الترابية بمسؤولياتها الكاملة.

ثالثا: تحدي تعزيز الديمقراطية التشاركية على المستوى الجهوي والمحلي، تنفيذا لمقتضيات دستور المملكة، وهو ما يقتضي تفعيل إشراك المواطنات والمواطنين وجمعيات المجتمع المدني في عملية صياغة وإعداد وتنفيذ ومراقبة، وتقييم السياسات العمومية المتخذة بمعية المجالس المنتخبة، لبلوغ الأهداف المتوخاة منها.`,
    fr: `Ayant à cœur d'assurer une mise en œuvre optimale du chantier de la régionalisation avancée, Nous appelons à la poursuite des efforts déployés pour répondre aux différents enjeux présents et à venir, posés par ce chantier structurant. Nous en mentionnons sept défis majeurs.

Premièrement : le défi de l’application effective de la Charte nationale de déconcentration administrative  :
Ce chantier a fait l'objet d'une attention particulière de Notre Majesté. Nous avons appelé à accélérer l’opérationnalisation de la Charte nationale de déconcentration administrative, qui repose sur un transfert effectif des attributions et des pouvoirs décisionnels au niveau régional. Toutefois, force est de constater que la plupart des départements ministériels ont tardé à l'activer, notamment dans le domaine des compétences prioritaires liées à l’investissement, ce qui compliquerait les procédures administratives d'investissement.

Deuxièmement : le défi de l’audit et de l’opérationnalisation des attributions des collectivités territoriales, notamment des conseils régionaux, condition essentielle pour impulser la dynamique de développement économique et social du pays. Nous préconisons l'adoption d'une approche globale dans le cadre de laquelle chacun des départements ministériels et collectivités territoriales concernés assumera pleinement ses responsabilités.

Troisièmement : le renforcement de la démocratie participative aux niveaux régional et local, conformément aux dispositions de la Constitution du Royaume. Pour cela, les citoyennes et les citoyens, et les associations de la société civile doivent être impliqués dans le processus d’élaboration, de préparation, d’application, de suivi et d’évaluation des politiques publiques prises avec les conseils élus.`,
    vocabulary: [
      { fr: "Pouvoirs décisionnels", ar: "الصلاحيات التقريرية", explanation: "السلطة القانونية المخولة للمصالح اللاممركزة لاتخاذ القرارات دون الحاجة للرجوع للإدارة المركزية بالرباط." },
      { fr: "Audit des compétences", ar: "تدقيق الاختصاصات", explanation: "عملية التحليل والفرز الدقيق للصلاحيات المشتركة والذاتية بين الدولة والجهات لتفادي التداخل والجمود." },
      { fr: "Démocratie participative", ar: "الديمقراطية التشاركية", explanation: "نظام يتيح للمواطنين والمجتمع المدني المساهمة الفعلية في اتخاذ القرار وتتبع المشاريع العامة بجانب الهيئات المنتخبة." }
    ],
    analysis: "يتطرق جلالة الملك للتحديات الثلاثة الأولى مركزاً على تدقيق الاختصاصات (audit des compétences) وضرورة نقل الصلاحيات التقريرية وتفعيل المبادئ التشاركية."
  },
  {
    id: 4,
    title: "التحديات من الرابع إلى السابع: الحكامة والتمويل والمرونة",
    ar: `رابعا: تحدي ربط المسؤولية بالمحاسبة في مجال تدبير الشأن الترابي :
بما أن الجهات بمعية الجماعات الترابية الأخرى أضحت مكونا رئيسيا للامركزية ببلادنا وركيزة أساسية في التدبير الترابي، فقد أصبح من الضروري تعزيز مبادئ التخليق ومحاربة الفساد، من خلال تطوير فلسفة الرقابة والمحاسبة، إعمالا للمبدأ الدستوري القائم على ربط المسؤولية بالمحاسبة.

خامسا: تحدي الارتقاء بجاذبية المجالات الترابية لجذب الاستثمار المنتج، كرافعة أساسية لتقوية التنمية المستدامة :
تلعب جاذبية أي مجال ترابي دورا أساسيا في تحفيز النمو الاقتصادي، وخلق فرص الشغل. وهذا رهان يتوقف ربحه على توفر استراتيجية إرادية تستهدف تعزيز الجاذبية، عبر توفير بيئة مواتية للمقاولات وبنيات تحتية حديثة ويد عاملة مؤهلة، مما يستدعي بالضرورة مقاربة مندمجة وتشاركية بين الجماعات الترابية والدولة والقطاع الخاص.

سادسا: تحدي قدرة الجهات على ابتكار آليات تمويلية جديدة :
أثبتت التجربة والممارسة العملية أن أشكال التمويلات التقليدية لتمويل الاستراتيجيات والتدابير لم تعد كافية، مما يقتضي بلورة أشكال تمويلية أخرى تتيحها اليوم البيئة التشريعية وتفعيل النموذج الجديد للميزانية المحلية القائم على النجاعة.

سابعا: تحدي التصدي لبعض الأزمات والتكيف مع التحولات التي يفرضها واقع اليوم وتأثيرات الغد :
قد تواجه الجهات جملة من التهديدات المتنامية طبيعياً واقتصادياً وبيئياً، مما يقوض الجهود التنموية إذا لم يتم التصدي لها. ولذلك، لا بد من تبني مقاربة أكثر مرونة وتفاعلية في التخطيط الجهوي، وإدماج استراتيجية تدبير المخاطر على نحو كامل ضمن برامجها التنموية لضمان تنمية مستدامة وشاملة.`,
    fr: `Quatrièmement : le défi lié au principe de corrélation de la responsabilité à la reddition des comptes dans le domaine de la gestion des affaires territoriales. Les Régions et les autres collectivités territoriales étant devenues une composante clé et un pilier de la gestion territoriale, il est désormais nécessaire de renforcer les principes de moralisation et de lutte contre la corruption, en développant la philosophie de contrôle et de responsabilisation, conformément au principe constitutionnel qui articule l’exercice de la responsabilité à la reddition des comptes.

Cinquièmement : le défi de l’amélioration de l’attractivité des espaces territoriaux pour attirer les investissements productifs, comme levier essentiel de renforcement du développement durable : l'attractivité des espaces territoriaux joue un rôle primordial dans la stimulation de la croissance économique et la création d'emplois. Pour gagner ce pari, il convient de mettre en place une strategy volontariste (infrastructures modernes, environnement propice aux entreprises), à travers une approche intégrée et participative unissant l'Etat, les collectivités, le secteur privé et la société civile.

Sixièmement : le défi lié à la capacité des Régions à concevoir des mécanismes de financement inédits : les formes traditionnelles de financement ne permettent plus de relever les défis actuels. Il est donc nécessaire de développer d’autres formes de financement en opérationnalisant le nouveau modèle budgétaire local basé sur l’efficacité et en s'ouvrant aux opportunités de la législation des finances locales.

Septièmement : le défi de faire face à certains crises et de s’adapter aux transformations d’aujourd’hui et aux impacts de demain : plusieurs Régions peuvent être confrontées à des menaces (naturelles, économiques, environnementales) soudaines et imprévisibles. Il faut donc adopter une approche plus souple et interactive en matière d’aménagement régional en intégrant pleinement la stratégie de gestion des risques dans les programmes de développement pour assurer un développement durable et inclusif.`,
    vocabulary: [
      { fr: "Reddition des comptes", ar: "ربط المسؤولية بالمحاسبة", explanation: "المبدأ الدستوري والقانوني الكوني القائم على وجوب خضوع كل مسؤول عمومي للمراقبة وتقديم الحساب عن تسييره." },
      { fr: "Attractivité des espaces", ar: "جاذبية المجالات الترابية", explanation: "مجموع الخصائص الاقتصادية والبنيوية والمؤسساتية التي تجعل منطقة ما محفزة ومستقطبة للاستثمارات والأنشطة المنتجة." },
      { fr: "Modèle budgétaire basé sur l'efficacité", ar: "نموذج الميزانية القائم على النجاعة", explanation: "أسلوب مالي حديث يربط الاعتمادات المالية والاعتمادات المحققة ببلوغ الأهداف المحددة في برامج العمل والسياسات العامة." }
    ],
    analysis: "يربط جلالة الملك نجاح التنمية الترابية بتخليق الحياة العامة عبر 'ربط المسؤولية بالمحاسبة' (la reddition des comptes) وابتكار التمويل المالي الذاتي والقدرة الاستباقية لتفادي الأزمات."
  },
  {
    id: 5,
    title: "الأوراش الحيوية ذات الأولوية: الماء، النقل، والتحول الرقمي",
    ar: `من بين هذه الإشكاليات والمخاطر التي تعيق جهود التنمية بجهات مملكتنا العزيزة، هناك: تدبير أزمة الإجهاد المائي، وتطوير منظومة النقل والتنقل، والانخراط في مسار التحول الرقمي.

فمعلوم أن المغرب أصبح، منذ مدة، يعيش في وضعية إجهاد مائي هيكلي. وإشكالية الإجهاد المائي تسائل كافة المعنيين، بما في ذلك الجهات والجماعات الترابية، المطالبين بالتعامل مع هذا المعطى، بكل ما يقتضيه ذلك من جدية وتظافر للجهود، وإرساء حكامة مائية لتعزيز المقاربة المندمجة للسياسة العمومية في مجال الماء.

أما فيما يتعلق بتطوير منظومة النقل والتنقل لتحقيق التنمية الجهوية المندمجة، فمن المؤكد أن هذا القطاع سيعرف خلال السنوات القليلة المقبلة تطورا بوتيرة متسارعة، نظرا للدينامية الاستثمارية لبلادنا، والأوراش الكبرى التي تم إطلاقها في إطار استعدادات بلادنا لتنظيم كأس العالم 2030. أصبح تطوير منظومة للنقل تتمتع بالشمولية والاستدامة مطلبا أساسيا لتقليص الفوارق المجالية والاجتماعية على المستوى الترابي.

وبخصوص التحول الرقمي بالجماعات الترابية، فقد أصبح اليوم، من جهته، شرطا وليس اختيارا لمسايرة الثورة التكنولوجية التي يعرفها عالم اليوم. فلا يمكن تصور أي عملية تنموية ترابية بدون تنمية رقمية، خصوصا وأننا نشهد إدماجا متزايدا للتكنولوجيا الرقمية في جميع مجالات تدبير الشأن الترابي.`,
    fr: `La gestion de la crise du stress hydrique, le développement du système de transport et de mobilité, l’adhésion au processus de transformation numérique sont parmi les problèmes et les périls auxquels il faut remédier car ils compromettent les efforts de développement dans les Régions de Notre cher Royaume.

Il est de notoriété publique que le Maroc se trouve, depuis quelque temps, en situation de stress hydrique structurel. Le problème du stress hydrique interpelle l’ensemble des acteurs concernés, y compris les Régions et les collectivités territoriales qui sont appelés à faire preuve de sérieux et à mutualiser leurs efforts pour y remédier, en instaurant une gouvernance de l’eau afin de renforcer l’approche intégrée de la politique publique dans le domaine de l’eau.

S’agissant de l’extension du système de transport et de mobilité pour parvenir au développement régional intégré, il est certain que ce secteur connaitra, au cours des prochaines années, une évolution rapide, due à la dynamique d'investissement de notre pays et aux chantiers d’envergure lancés pour organiser la Coupe du monde 2030. Le développement d’un système de transport inclusif et durable constitue désormais une exigence essentielle pour atteindre le développement régional intégré et réduire les disparités spatiales et sociales.

Plutôt qu’un choix délibéré, la transformation numérique des collectivités territoriales est désormais une condition essentielle pour que celles-ci se mettent au diapason de la révolution technologique à l’œuvre dans le monde d’aujourd’hui. De fait, aucune dynamique de développement territorial ne peut être conçue sans son corollaire numérique.`,
    vocabulary: [
      { fr: "Stress hydrique structurel", ar: "إجهاد مائي هيكلي", explanation: "تراجع دائم وحرج في الموارد المائية المتوفرة مقارنة بالطلب المتنامي عليها بفعل قلة التساقطات والجفاف وتغير المناخ." },
      { fr: "Gouvernance de l'eau", ar: "حكامة مائية", explanation: "التدبير المتكامل والمنسق لتعبئة وحماية الموارد المائية وتوزيعها بعدالة بمشاركة كافة المتدخلين." },
      { fr: "Transformation numérique", ar: "التحول الرقمي", explanation: "إدماج التقنيات والبرمجيات الرقمية الحديثة في تسيير الإدارات والخدمات وتدبير الشأن العام المحلي لتسهيل الإجراءات." }
    ],
    analysis: "يحدد جلالة الملك ثلاثة مجالات ذات أولوية مصيرية للتنمية المحلية والجهوية: تخفيف وطأة الإجهاد المائي (stress hydrique)، عصرنة النقل لمواكبة كأس العالم 2030، وتعميم التحول الرقمي."
  },
  {
    id: 6,
    title: "الخاتمة ورسم خارطة الطريق استراتيجياً",
    ar: `استشعارا من بلادنا لحجم التحديات والإشكاليات المطروحة أمامها، ومن منطلق إيماننا بالأهمية البالغة التي يكتسيها ورش الجهوية المتقدمة، وما تقتضيه المرحلة الحالية من وقفة تأملية تقييمية لحصيلة تنزيله، وخصوصا فيما يتعلق بتفعيل التوصيات الصادرة عن النسخة الأولى لهذه المناظرة، فإننا ندعوكم للخروج بخارطة طريق واضحة المعالم ومتوافق بشأنها، تتيح اعتماد توجهات استراتيجية للمرحلة القادمة.

وإذ نتطلع، في ختام مناظرتكم، للتوصيات والخلاصات الوجيهة والبناءة التي ستتمخض عنها، فإننا نسأل الله تعالى أن يكلل أعمالكم بالنجاح، ويوفقكم لما فيه مصلحة الوطن والمواطنين.

والسـلام عليكـم ورحمـة الله تعـالـى وبـركـاتـه`,
    fr: `Prenant la mesure de l’ampleur des défis et des problématiques qui se posent à notre pays et, intimement convaincu de l’importance cruciale du chantier de la régionalisation avancée et compte tenu de l’étape actuelle, il convient de marquer un temps d’arrêt pour dresser le bilan de sa mise en œuvre en lien notamment avec la concrétisation des recommandations issues de la première édition de ces Assises. Dans le même esprit, Nous vous exhortons à tracer une feuille de route claire et consensuelle, qui permet de définir les orientations stratégiques pour la prochaine étape.

Nous formons le souhait que ces Assises nationales soient l’occasion de formuler des recommandations et des conclusions pertinentes et constructives et Nous prions le Très-Haut de couronner vos travaux de succès et de guider vos pas au service de la patrie et des citoyens.

Wassalamou alaikoum warahmatoullahi wabarakatouh`,
    vocabulary: [
      { fr: "Feuille de route", ar: "خارطة طريق", explanation: "مخطط عمل تفصيلي واضح المعالم يحدد المراحل والآجال والمسؤوليات لتحقيق الأهداف الاستراتيجية المشتركة." },
      { fr: "Orientations stratégiques", ar: "توجهات استراتيجية", explanation: "الخيارات والمسارات الكبرى والخطوط العريضة لسياسات الدولة في المدى المتوسط والبعيد." },
      { fr: "Recommandations et conclusions", ar: "التوصيات والخلاصات", explanation: "المخرجات والاقتراحات الفنية والقانونية والعملية الصادرة عن المؤتمر كإرشاد للتنفيذ المستقبلي." }
    ],
    analysis: "يختتم جلالته بالحث على صياغة خارطة طريق (feuille de route) واضحة وتوافقية ترسم المعالم الاستراتيجية للمرحلة القادمة لورش الجهوية المتقدمة بالمملكة."
  }
];

const SPEECH_SECTIONS_2018: SpeechSection[] = [
  {
    id: 1,
    title: "المقدمة والترحيب بالوفود السامية",
    ar: "يطيب لنا أن نتوجه إليكم، في مستهل هذا الملتقى الدولي، مرحبين بكافة المشاركين في هذا المؤتمر القانوني والقضائي الرفيع ، الذي حرصنا على أن نحيطه برعايتنا السامية، تعبيرا عن المكانة المتميزة التي تحظى بها السلطة القضائية لدينا، والعطف الموصول الذي نسبغه على مؤسساتها وأعضائها.",
    fr: "Nous avons le plaisir d’adresser ce message aux participants à la conférence internationale de haut niveau qui s’ouvre aujourd’hui, et qui est consacrée à des questions juridico-judiciaires de la plus grande importance, et de leur souhaiter la bienvenue. Notre Haut Patronage témoigne à l’évidence de l’estime portée au pouvoir judiciaire et de la constante sollicitude que Nous accordons à ses institutions et à ses membres.",
    vocabulary: [
      { fr: "Conférence internationale de haut niveau", ar: "المؤتمر القانوني والقضائي الرفيع", explanation: "الملتقى القضائي الدولي رفيع المستوى المخصص لتطوير العدالة والتبادل المعرفي." },
      { fr: "Sollicitude constante", ar: "العطف الموصول", explanation: "الرعاية والاهتمام الملكي المستمر والدائم الممنوح للقضاة والمؤسسات القضائية." },
      { fr: "Pouvoir judiciaire", ar: "السلطة القضائية", explanation: "أحد السلطات الثلاث للدولة المستقلة، المسؤولة عن حماية الحقوق وتطبيق القوانين." }
    ],
    analysis: "يبرز جلالة الملك في هذا الجزء الاستهلالي ترحيبه بالوفود المشاركة ورعايته السامية للمؤتمر، مؤكداً على المكانة الرفيعة التي تحظى بها السلطة القضائية (pouvoir judiciaire) لدى جلالته والعطف الموصول (sollicitude constante) لأعضائها ومؤسساتها."
  },
  {
    id: 2,
    title: "الجهود الموصولة واستقلال العدالة",
    ar: "لقد أولينا منذ اعتلائنا العرش، مجهوداً موصولاً لتمكين السلطة القضائية من كافة الوسائل والضمانات الدستورية والقانونية لتمكينها من القيام بمهامها السامية، وذلك إيماناً منا بأن العدالة هي عماد دولة الحق والقانون، والركيزة الأساسية للأمن والاستقرار وحماية حقوق المواطنين وحرياتهم.",
    fr: "Depuis Notre accession au Trône, Nous avons déployé des efforts constants afin de doter le pouvoir judiciaire de tous les moyens et garanties constitutionnels et juridiques pour lui permettre d'accomplir sa noble mission, convaincu que la justice is le fondement de l'État de droit et le pilier essentiel de la sécurité, de la stabilité et de la protection des droits et libertés des citoyens.",
    vocabulary: [
      { fr: "Accession au Trône", ar: "اعتلائنا العرش", explanation: "تولي جلالة الملك مقاليد الحكم والقيادة الدستورية والروحية للبلاد." },
      { fr: "Garanties constitutionnelles", ar: "الضمانات الدستورية", explanation: "الوسائل والحماية المقررة بالدستور لضمان استقلالية ونزاهة السلطة القضائية." },
      { fr: "Fondement de l'État de droit", ar: "عماد دولة الحق والقانون", explanation: "المبدأ الذي يجعل القانون فوق الجميع ويضمن حماية الحقوق والحريات." }
    ],
    analysis: "يربط جلالة الملك بين استقلال السلطة القضائية وتمكينها من كافة الضمانات (garanties constitutionnelles) وبين ترسيخ 'دولة الحق والقانون' (fondement de l'État de droit) كشرط لحماية حقوق وحريات المواطنين."
  },
  {
    id: 3,
    title: "الضمانات الدستورية ومحاربة التدخل",
    ar: "وفي هذا الصدد، كرس دستور المملكة مجموعة من الحقوق والضمانات الأساسية، في صدارتها قرينة البراءة، والحق في محاكمة عادلة داخل أجل معقول. كما منع الدستور صراحة أي تدخل في القضايا المعروضة على القضاء، أو أي تأثير غير قانوني على القضاة، معتبراً الإخلال بذلك خطأً مهنياً جسيماً يترتب عنه عقوبات تأديبية أو جنائية.",
    fr: "À cet égard, la Constitution du Royaume a consacré un ensemble de droits et de garanties fondamentaux, au premier rang desquels figurent la présomption d'innocence et le droit à un procès équitable dans un délai raisonnable. De même, la Constitution proscrit expressément toute ingérence dans les affaires soumises à la justice ou toute influence illégale sur les magistrats, considérant tout manquement à ce devoir comme une faute professionnelle grave passible de sanctions disciplinaires ou pénales.",
    vocabulary: [
      { fr: "Présomption d'innocence", ar: "قرينة البراءة", explanation: "المبدأ الحقوقي الأساسي الذي يقتضي بأن المتهم بريء حتى تثبت إدانته بمحاكمة عادلة." },
      { fr: "Procès équitable", ar: "محاكمة عادلة", explanation: "محاكمة تحترم كافة ضمانات الدفاع وحقوق الأطراف المعروضة أمام محكمة مستقلة ومحايدة." },
      { fr: "Faute professionnelle grave", ar: "خطأ مهني جسيم", explanation: "إخلال القاضي بواجباته المهنية كالتجرد والاستقلال، يترتب عنه عقوبات تأديبية أو جنائية." }
    ],
    analysis: "يركز هذا القسم على الضمانات الدستورية الممنوحة للمتقاضين، كـ 'قرينة البراءة' (présomption d'innocence) والحق في 'محاكمة عادلة' (procès équitable). كما يبرز المنع الدستوري لأي تدخل (proscription de toute ingérence) أو محاولة التأثير على القضاة للحفاظ على نزاهة ومصداقية الأحكام."
  },
  {
    id: 4,
    title: "الميثاق الوطني لإصلاح العدالة واستقلال النيابة العامة (2018)",
    ar: "وقد حرصنا على ترجمة هذه المبادئ الدستورية في ميثاق وطني لإصلاح منظومة العدالة، يتضمن مجموعة من الإصلاحات التشريعية والتنظيمية والعملية، عهدنا بإعداده، وفق مقاربة تشاركية موسعة، إلى نخبة من القضاة والمحامين والخبراء والحقوقيين ومهنيي العدالة. وفي هذا الإطار، تم إصدار نصوص قانونية ذات أهمية كبرى، وفي مقدمتها القانونان التنظيميان المتعلقان بالمجلس الأعلى للسلطة القضائية وبالنظام الأساسي للقضاة، بالإضافة إلى القانون الذي نقل بموجبه الإشراف على النيابة العامة من وزير العدل إلى الوكيل العام للملك لدى محكمة النقض.",
    fr: "En outre, Nous nous sommes attaché à décliner ces principes constitutionnels dans une Charte nationale de réforme de la justice, dont l’élaboration a été confiée, par Nos soins, à une pléiade de magistrats, d’avocats, d’experts, de défenseurs des droits humains et de professionnels de la justice. Ce travail collégial, réalisé avec une approche participative élargie, a permis de répertorier les réformes législatives et réglementaires à mener et les mesures à prendre. C’est dans ce contexte qu’ont été adoptés des textes de loi éminemment importants, notamment deux lois organiques relatives respectivement au Conseil supérieur du pouvoir judiciaire et au Statut des magistrats. Il en est de même de la loi qui place le ministère public sous l’autorité, non plus du Ministre de la justice, mais du Procureur général du Roi près la Cour de cassation.",
    vocabulary: [
      { fr: "Ministère public / Parquet", ar: "النيابة العامة", explanation: "الجهاز القضائي المسؤول عن إقامة دعوى الحق العام ومتابعة المتهمين وتمثيل المصلحة العامة للمجتمع." },
      { fr: "Procureur général du Roi près la Cour de cassation", ar: "الوكيل العام للملك لدى محكمة النقض", explanation: "أعلى سلطة قضائية تسهر على رئاسة النيابة العامة بعد نقل سلطتها من وزير العدل." },
      { fr: "Lois organiques", ar: "القوانين التنظيمية", explanation: "قوانين مكملة للدستور توضح تفاصيل تنظيم وعمل السلطات الدستورية والمؤسسات الكبرى." }
    ],
    analysis: "يتطرق هذا الجزء لأبرز تحول هيكلي في تاريخ القضاء المغربي المعاصر: استقلال النيابة العامة (ministère public) عبر نقل الإشراف التام عليها إلى الوكيل العام للملك لدى محكمة النقض (Procureur général du Roi près la Cour de cassation) بدلاً من وزير العدل."
  },
  {
    id: 5,
    title: "الاستقلال في خدمة المواطن والتنمية وحق التقاضي (2018)",
    ar: "وقد تمكنت بلادنا بفضل هذه المبادرة الجماعية، من قطع أشواط أساسية في مسار استكمال الإطار المؤسسي لحكامة منظومة العدالة. وإننا لنتطلع إلى التسريع بتفعيل ما تضمنه الميثاق من تدابير أخرى ملائمة، تهدف إلى تحيين التشريع، وتطوير أداء القضاء، والرفع من نجاعته، ترسيخا لاستقلاله الذي كرسه دستور المملكة. وبصفتنا الضامن لاستقلال السلطة القضائية، فإننا لحريصون على أن تكون الغاية المثلى من التكريس الدستوري لاستقلال القضاء، هي جعله في خدمة المواطن، وفي خدمة التنمية وفي خدمة دولة القانون. وبغض النظر عما حققه المغرب من إنجازات، في بناء الإطار المؤسساتي لمنظومة العدالة، فإنه يبقى منشغلا، مثل كل المجتمعات التي تولي أهمية قصوى للموضوع، بالرهانات والتحديات التي تواجه القضاء عبر العالم.",
    fr: "Grâce à cet effort collectif, notre pays a réussi à franchir des étapes décisives pour la mise en place du cadre institutionnel de son appareil judiciaire et de sa gouvernance. Notre souhait est que soit activée à présent l’application des autres mesures contenues dans la Charte, qui visent à mettre en concordance les différentes législations avec les progrès réalisés, à améliorer le rendement et l’efficacité de la justice et à rendre effective et palpable l’indépendance de l’appareil judiciaire, conformément à la Constitution du Royaume. Garant de l’indépendance du pouvoir judiciaire, Nous veillons tout particulièrement à ce que ce principe constitutionnel soit placé au service des citoyens, au service du développement et au service de l’Etat de droit. Le Maroc a réalisé des avancées dans la mise en place d’un cadre institutionnel de son système judiciaire. Néanmoins, et à l’instar de tous les pays qui attachent une importance capitale à la justice, il reste préoccupé par les défis auxquels se trouvent confrontés les différents systèmes judiciaires à travers le monde.",
    vocabulary: [
      { fr: "Garant de l'indépendance", ar: "الضامن لاستقلال القضاء", explanation: "الصفة الدستورية الممنوحة لجلالة الملك لضمان وحماية استقلال السلطة القضائية عن أي شطط أو تدخل." },
      { fr: "En service des citoyens", ar: "في خدمة المواطن", explanation: "جعل جودة الخدمة القضائية والتقرب من المتقاضين من صلب أولويات وغايات العدالة." },
      { fr: "Gouvernance de la justice", ar: "حكامة منظومة العدالة", explanation: "مجموعة الأساليب والمساطر المستعملة لإدارة وتدبير المحاكم بنجاعة وشفافية ومسؤولية." }
    ],
    analysis: "يحدد جلالة الملك المفهوم الفلسفي والعملي لـ 'الاستقلال' بأنه ليس ترفاً للقضاة بل وسيلة ليكون القضاء 'في خدمة المواطن والتنمية' (au service des citoyens et du développement) وجلالته هو 'الضامن لهذا الاستقلال' (Garant de l’indépendance)."
  },
  {
    id: 6,
    title: "الاستقلال كحق للمتقاضي وواجب على القاضي (2018)",
    ar: "ويأتي في مقدمة هذه التحديات، ضمان تفعيل استقلال السلطة القضائية في الممارسة والتطبيق، باعتبار أن مبدأ الاستقلال لم يشرع لفائدة القضاة، وإنما لصالح المتقاضين، وأنه إذ يرتب حقا للمتقاضين، فكونه يلقي واجبا على عاتق القاضي. فهو حق للمتقاضين في أن يحكم القاضي بكل استقلال وتجرد وحياد، وأن يجعل من القانون وحده مرجعا لقراراته، ومما يمليه عليه ضميره سندا لاقتناعاته. وهو واجب على القاضي، الذي عليه أن يتقيد بالاستقلال والنزاهة، والبعد عن أي تأثر أو إغواء يعرضه للمساءلة التأديبية أو الجنائية. كما أن تعزيز الثقة في القضاء، باعتباره الحصن المنيع لدولة القانون، والرافعة الأساسية للتنمية، يشكل تحديا آخر يجب رفعه بتطوير العدالة وتحسين أدائها، لمواكبة التحولات الاقتصادية والاجتماعية، التي تشهدها مختلف المجتمعات.",
    fr: "De ce point de vue, le premier impératif est de garantir l’effectivité de l’indépendance du pouvoir judiciaire dans le fonctionnement pratique de la justice. A ce propos, rappelons que le principe a été consacré, non pas au bénéfice des magistrats, mais à l’intention des justiciables et à leur profit. Le principe a ainsi créé un droit pour les justiciables et un devoir pour les magistrats. Que le juge se montre totalement indépendant, impartial et neutre au moment de rendre une sentence, est un droit pour les justiciables. En effet, le magistrat ne doit fonder ses décisions que sur les règles de droit et il doit statuer exclusivement en son âme et conscience, guidé par ses seules convictions. En revanche, il est du devoir du juge de se plier aux exigences d’indépendance et d’intégrité et de se prémunir contre toute forme d’influence ou tentation, sous peine de tomber sous le coup d’une procédure disciplinaire ou pénale. Il importe aussi de relever un autre défi qui consiste à accroître la confiance en la Justice, érigée en rempart inexpugnable de défense de l’Etat de droit et en levier essentiel du développement. A cette fin, l’appareil judiciaire doit se perfectionner et améliorer son rendement pour être à même d’accompagner les transformations économiques et sociales à l’œuvre dans toutes les sociétés.",
    vocabulary: [
      { fr: "En son âme et conscience", ar: "بضميره وسندا لاقتناعاته (بضميره الصميم)", explanation: "الالتزام الداخلي والأخلاقي العميق للقاضي بالبت في القضايا وفق الاقتناع الذاتي المبني على القانون المنصف والنزيه." },
      { fr: "Procédure disciplinaire ou pénale", ar: "المساءلة التأديبية أو الجنائية", explanation: "المساطر القانونية المتخذة لمحاسبة القاضي في حالة خرقه لفرض النزاهة والاستقلال والتجرد." },
      { fr: "Rempart inexpugnable", ar: "الحصن المنيع", explanation: "الدور الحمائي الفعال والجدار الحصين الذي يلعبه القضاء لمنع انتهاك الحقوق وخرق الحريات الأساسية." }
    ],
    analysis: "هذا هو الجانب الأكثر عمقاً في الخطاب: إقرار معادلة 'الاستقلال كحق للمتقاضي وواجب على القاضي'. وتُرجمت الصيغة الكلاسيكية 'ضميره وقناعته' بـ 'en son âme et conscience' وهي لغة قضائية فرنسية عريقة وبليغة."
  },
  {
    id: 7,
    title: "العصرنة والعدالة الجنائية والرقمنة والتعاون الدولي (2018)",
    ar: "ومن بين الأسباب المحققة لذلك، تسهيل ولوج أبواب القانون والعدالة، عبر تحديث التشريعات لتواكب مستجدات العصر، وملاءمتها للالتزامات الدولية، خاصة منها ذات الصلة بحقوق الإنسان، وتيسير البت داخل أجل معقول، وضمان الأمن القضائي اللازم لتحسين مناخ الأعمال، وتشجيع الاستثمار وتحقيق التنمية، فضلا عن دعم فعالية وشفافية الإدارة القضائية، باستثمار ما تتيحه تكنولوجيا المعلوميات، ومأسسة الوسائل البديلة لحل المنازعات. وإن تطوير العدالة الجنائية يقتضي دراسة الصيغ التي تجعلها تحقق الملاءمة المثلى بين واجب صيانة الحقوق والحريات، وبين هاجس الحفاظ على قيم وركائز المجتمع، ودرء كل خطر يهدده، في عالم كثرت فيه المخاطر، وتشابكت فيه العلاقات، ونما فيه التواصل الرقمي. ويظل بلوغ الأهداف المرجوة رهينا بتحسين تأهيل نساء ورجال القضاء، والرفع من القدرات المؤسسية للعدالة، ودعم تخليق جميع مكوناتها، ومؤازرة كل مجهود يبذل لهذا الغرض، بتنمية التعاون الدولي وتطوير مجالاته. وفقكم الله، وألهمكم الصواب والرشاد، وتوج أشغالكم بالتوفيق والسداد. والسلام عليكم ورحمة الله تعالى وبركاته",
    fr: "Pour cela, il importe notamment de faciliter l’accès au droit et à la justice. Une modernisation des législations nationales est toujours nécessaire pour les mettre en phase avec les changements et en conformité avec les engagements internationaux du pays, en particulier, ceux qui se rapportent aux droits humains. En outre, les mesures nécessaires doivent être prises pour que les décisions de justice soient prononcées dans des d’un délai raisonnable. De plus, la sécurité juridique et judiciaire doit être assurée pour améliorer le climat des affaires, donner aux investissements une impulsion vigoureuse et contribuer en définitive au développement du pays. Par ailleurs, l’efficacité et la transparence de l’administration judiciaire doivent être renforcées grâce à l’utilisation des technologies de l’information et à l’institutionnalisation des modes alternatifs de règlement des litiges. De son côté, la justice pénale appelle une attention particulière pour lui permettre de trouver un équilibre judicieux entre l’impératif de garantir les droits et les libertés et l’impérieuse nécessité de préserver les valeurs et les piliers de la société et de protéger le corps social contre tout danger, notamment au moment où notre monde est assailli de périls en tous genres; où les relations se complexifient constamment, où les dangers de la communication numérique s’accroissent avec les dérives que l’on sait. La réalisation de l’ensemble des objectifs poursuivis reste cependant tributaire de l’amélioration de la formation des magistrats et de la mise à niveau optimale des professionnels de la justice, d’un renforcement des capacités institutionnelles et d’un appui à la moralisation de l’ensemble de ses composantes, en s’attachant à développer la coopération internationale. Puisse Dieu guider vos pas, vous inspirer sagesse et clairvoyance et couronner vos travaux de succès.",
    vocabulary: [
      { fr: "Modes alternatifs de règlement des litiges (MARL)", ar: "الوسائل البديلة لحل المنازعات", explanation: "آليات كالوساطة والتحكيم والصلح لتسوية الخلافات خارج المحاكم لتقليص الضغط وتيسير البت." },
      { fr: "Modernisation des législations", ar: "تحديث التشريعات", explanation: "مواءمة القوانين الوطنية وتطويرها لتساير التغيرات الاقتصادية والاجتماعية والالتزامات الدولية للبلاد." },
      { fr: "Justice pénale", ar: "العدالة الجنائية / القضاء الجنائي", explanation: "فرع القضاء المكلف بالتحقيق في الجرائم ومعاقبة مرتكبيها مع موازنة صيانة حريات المتهمين." }
    ],
    analysis: "تختتم الرسالة السامية برؤية استشرافية لعصرنة العدالة عبر 'الوسائل البديلة لحل المنازعات' (Modes alternatifs de règlement des litiges - MARL)، والاعتماد على 'تكنولوجيا المعلوميات' (Technologies de l'information) لترسيخ نجاعة الإدارة القضائية ومواءمة الالتزامات الدولية لحقوق الإنسان."
  }
];

const SPEECH_SECTIONS_2019: SpeechSection[] = [
  {
    id: 1,
    title: "افتتاح الدورة وتكريس علاقة العدالة بالاستثمار",
    ar: "إنه لمن دواعي سرورنا أن نتوجه إليكم، في افتتاح الدورة الثانية للمؤتمر الدولي للعدالة، الذي أضفينا عليه رعايتنا السامية، باعتباره ملتقى دوليا متميزا لتبادل الأفكار، وتقاسم التجارب والخبرات، وإطلاق المزيد من الشراكات، في سبيل تطوير منظومة العدالة، وتكريس مكانتها، والرفع من مستوى فعاليتها ونجاعتها.\nوإذ نرحب بكم ضيوفا كراما على أرض المملكة المغربية، فإننا نشيد باختياركم لهذه الدورة موضوع “العدالة والاستثمار: التحديات والرهانات”. لما يجسده هذا موضوع من وعي بأهمية الاستثمار كرافعة للتنمية، وبالدور الحاسم الذي تضطلع به العدالة في الدفع بالنمو الاقتصادي، عبر تعزيز دولة الحق والقانون، وضمان الأمن القانوني والقضائي اللازم لتحقيق التنمية الشاملة.",
    fr: "Il Nous plait de vous adresser ce message à l’occasion de l’ouverture de la Conférence internationale sur la justice, qui tient ici sa deuxième session. Notre Haut Patronage témoigne de l’importance particulière de cette rencontre internationale, devenue un espace d’échange d’idées, de partage d’expériences et de savoir-faire, une plate-forme pour le lancement de nouveaux partenariats, à même de développer le système de justice, de conforter son rôle, d’accroître son efficacité.\nNous vous souhaitons la bienvenue au Royaume du Maroc et saluons la thématique que vous avez retenue pour la présente édition : «Justice et Investissement : défis et enjeux». Ce choix met en évidence la prise de conscience de l’importance que revêt désormais l’investissement, en tant que levier de développement. Il témoigne aussi du rôle crucial qui incombe à la justice pour impulser la croissance économique, en s’attachant notamment à renforcer l’Etat de droit, à garantir la sécurité juridique et judiciaire nécessaire à la réalisation du développement global.",
    vocabulary: [
      { fr: "Conférence internationale sur la justice", ar: "المؤتمر الدولي للعدالة", explanation: "الملتقى القضائي الدولي رفيع المستوى المخصص لتطوير العدالة والتبادل المعرفي." },
      { fr: "Justice et Investissement", ar: "العدالة والاستثمار", explanation: "العلاقة الوظيفية والتكاملية بين الأمن القضائي وتحفيز التنمية الاقتصادية." },
      { fr: "Sécurité juridique et judiciaire", ar: "الأمن القانوني والقضائي", explanation: "استقرار القواعد القانونية وتوقع الأحكام القضائية كضمانة لحماية الحقوق وتشجيع الاستثمار." }
    ],
    analysis: "يفتتح جلالة الملك الرسالة السامية بالترحيب بالضيوف وتأكيد رعايته الكريمة للمؤتمر، مبرزاً الأهمية البالغة لموضوع 'العدالة والاستثمار' كرافعة للتنمية ودفع النمو الاقتصادي في إطار دولة الحق والقانون (État de droit)."
  },
  {
    id: 2,
    title: "الرؤية الاستراتيجية لتحسين مناخ الأعمال والاستثمار",
    ar: "لقد أكدنا في مناسبات عديدة، على ضرورة وضع رؤية استراتيجية في مجال تحسين مناخ الأعمال. رؤية قوامها توفير بيئة مناسبة للاستثمار، واعتماد منظومة قانونية حديثة ومتكاملة ومندمجة، تجعل من المقاولة رافعة أساسية للتنمية الاقتصادية والاجتماعية.\nولهذه الغاية، أصدرنا توجيهاتنا للإسراع بإخراج الميثاق الجديد للاستثمار، وإصلاح مراكزه الجهوية، وتمكينها من الصلاحيات اللازمة للقيام بدورها على أكمل وجه، ووضع حد للعراقيل التي تحول دون أدائها للدور المنوط بها.\nكما ألححنا في أكثر من مناسبة على ضرورة تبسيط مساطر الاستثمار، وتحيين برامج المواكبة الموجهة للمقاولات، وتسهيل ولوجها للتمويل، والرفع من إنتاجيتها، وتكوين وتأهيل مواردها البشرية.",
    fr: "Pour améliorer le climat des affaires, Nous avons souligné, à maintes reprises, la nécessité d’établir une vision stratégique centrée sur la mise en place d’un environnement favorable à l’investissement, par l’adoption d’un systeme juridique moderne, cohérent, intégré dans lequel l’entreprise constitue un levier essentiel du développement socio-économique.\nA cet effet, Nous avons donné Nos orientations pour que soit accélérée l’adoption de la nouvelle Charte de l’Investissement, et que soient restructurés les Centres régionaux d’Investissement. A cet égard, il convient de mettre fin aux contraintes que ces établissements rencontrent dans l’exercice de leurs mandat, en leur attribuant les prérogatives nécessaires au plein accomplissement de leur mission.\nEn outre, Nous avons insisté maintes fois sur la nécessité de simplifier les procédures d’investissement et d’améliorer les programmes d’accompagnement des entreprises, pour faciliter leur accès aux financements et former leurs ressources humaines à accroître la productivité.",
    vocabulary: [
      { fr: "Climat des affaires", ar: "مناخ الأعمال", explanation: "البيئة التنظيمية والقانونية والاقتصادية التي تحيط بنشاط المقاولات والاستثمارات وتؤثر في جاذبيتها." },
      { fr: "Charte de l'Investissement", ar: "ميثاق الاستثمار", explanation: "الإطار القانوني المرجعي الموحد الذي ينظم الحوافز والضمانات الممنوحة للمستثمرين." },
      { fr: "Centres régionaux d'Investissement (CRI)", ar: "المراكز الجهوية للاستثمار", explanation: "المؤسسات العمومية الجهوية المكلفة بتسهيل ومواكبة المشاريع الاستثمارية على المستوى المحلي." }
    ],
    analysis: "تتناول هذه الفقرة المحاور العملية لتحسين 'مناخ الأعمال' (climat des affaires)، عبر إصلاح المراكز الجهوية (Centres régionaux) وتبسيط المساطر (simplifier les procédures) لتجعل من المقاولة رافعة تنموية حقيقية."
  },
  {
    id: 3,
    title: "دور القضاء والعدالة كشريك في التنمية والمواكبة",
    ar: "حضرت السيدات والسادة،\nإنه بقدر ما تعتبر العدالة من المفاتيح المهمة في مجال تحسين مناخ الاستثمار وتشجيع المبادرة الحرة وحماية المقاولة، فإن القضاء مدعو للقيام بدوره الأساس في مواكبة هذا المسار، واستيعاب تحديات الظرفية الاقتصادية العالمية، والمناخ الاقتصادي الوطني.",
    fr: "Mesdames, Messieurs,\nLa justice est l’une des clés essentielles pour fortifier le climat des affaires, promouvoir la liberté d’entreprendre et protéger l’entreprise. Par conséquent, le système judiciaire est appelé à jouer le rôle fondamental qui est le sien en s’attachant à accompagner cette dynamique, à appréhender la nature des défis posés par la conjoncture économique mondiale, à cerner les spécificités de l’économie nationale.",
    vocabulary: [
      { fr: "Liberté d'entreprendre", ar: "المبادرة الحرة", explanation: "المبدأ الاقتصادي والدستوري الذي يكفل للأفراد حرية ممارسة الأنشطة التجارية والاستثمارية." },
      { fr: "Protéger l'entreprise", ar: "حماية المقاولة", explanation: "توفير الحماية القانونية والقضائية للكيانات الاقتصادية ضد الإفلاس التعسفي أو المنافسة غير المشروعة." },
      { fr: "Conjoncture économique mondiale", ar: "الظرفية الاقتصادية العالمية", explanation: "الحالة والمؤشرات الاقتصادية العامة على الصعيد الدولي التي تؤثر في الأسواق الوطنية والمحلية." }
    ],
    analysis: "يُبرز جلالة الملك دور القضاء كأحد المفاتيح الأساسية لـ 'حماية المقاولة' (protéger l'entreprise) ودعم المبادرة الحرة (liberté d'entreprendre) في ظل التقلبات والتحديات الاقتصادية العالمية."
  },
  {
    id: 4,
    title: "الترسانة القانونية والمهيكلة لتطوير المال والأعمال",
    ar: "ومن هذا المنطلق، قامت المملكة المغربية بإقرار مجموعة من النصوص القانونية الحديثة والمهيكلة، الهادفة إلى تطوير منظومة المال والأعمال، وتشجيع الاستثمار، وتنشيط الدورة الاقتصادية، ودعم المقاولات الوطنية، وجعلها رافعة للتنمية الاقتصادية.",
    fr: "C’est pour ces raisons que le Royaume du Maroc a adopté un arsenal juridique moderne et structurant afin de développer le monde de la finance et des affaires, d’encourager l’investissement et d’insuffler une dynamique vigoureuse au circuit économique, en soutenant les entreprises nationales, ainsi devenues les leviers du développement économique.",
    vocabulary: [
      { fr: "Arsenal juridique", ar: "الترسانة القانونية / النصوص القانونية والمهيكلة", explanation: "مجموع القوانين والنصوص التشريعية المتكاملة التي تنظم قطاعاً معيناً مثل المال والأعمال." },
      { fr: "Monde de la finance et des affaires", ar: "منظومة المال والأعمال", explanation: "البيئة المؤسساتية والتشريعية التي تحكم الأسواق المالية والشركات والاستثمارات التجارية." },
      { fr: "Circuit économique", ar: "الدورة الاقتصادية", explanation: "تدفق الأموال والسلع والخدمات بين الفاعلين الاقتصاديين لإنتاج وتوزيع الثروة." }
    ],
    analysis: "يتحدث النص عن جهود المغرب التشريعية في بناء 'ترسانة قانونية عصرية' (arsenal juridique moderne) لتطوير المال والأعمال وتنشيط الدورة الاقتصادية (circuit économique)."
  },
  {
    id: 5,
    title: "الإصلاحات القانونية الحديثة والأدوار الاقتصادية الجديدة للقاضي",
    ar: "ونخص بالذكر هنا، بعض النصوص الهامة، التي تم اعتمادها مؤخرا، كتعديل مدونة التجارة، وقوانين الشركات، وكذا القانون المتعلق بالضمانات المنقولة، فضلا عن تكريس مقاربة تخرج القاضي من الأدوار الكلاسيكية إلى أخرى ذات أبعاد اقتصادية واجتماعية، وتضمن تحقيق أمن المقاولة والسلم الاجتماعي داخلها، عبر إقرار التوازن الموضوعي بين حقوق الأجراء وأرباب العمل.",
    fr: "Nous nous référons plus particulièrement à d’importants textes adoptés récemment, comme la version remaniée du Code de commerce, les lois sur les sociétés, la loi sur les garanties mobilières. Il a été, également, question de consolider l’approche qui incite les magistrats à dépasser les limites de leur mandat traditionnel pour remplir des missions à visée économique et sociale. Ainsi, ils sont encouragés à garantir la sécurité et la paix sociale dans l’entreprise, en instaurant, en termes de droits, un équilibre objectif entre employeurs et salariés.",
    vocabulary: [
      { fr: "Code de commerce", ar: "مدونة التجارة", explanation: "القانون الموحد والأساسي الذي يحكم الأنشطة التجارية والتجار وصعوبات المقاولة." },
      { fr: "Garanties mobilières", ar: "الضمانات المنقولة", explanation: "الرهون والضمانات التي تنصب على أموال منقولة لتسهيل الحصول على تمويلات بنكية للمقاولات." },
      { fr: "Équilibre objectif", ar: "التوازن الموضوعي", explanation: "تحقيق التعادل المنصف بين مصالح الشغيلة (حقوق الأجراء) ومصالح المشغلين (أرباب العمل) لضمان السلم الاجتماعي." }
    ],
    analysis: "ترسيخ 'الأدوار ذات الأبعاد الاقتصادية والاجتماعية للقاضي' يتجاوز المفاهيم التقليدية، لضمان السلم الاجتماعي والتوازن بين الأجراء وأرباب العمل (équilibre objectif entre employeurs et salariés)."
  },
  {
    id: 6,
    title: "تعزيز المصداقية والمكانة الرفيعة للمغرب لدى المستثمرين",
    ar: "وهو ما ساهم في تعزيز مكانة المغرب، كبلد يحظى بالثقة والمصداقية لدى المستثمرين الأجانب، ومختلف الفاعلين الاقتصاديين والماليين.",
    fr: "Grâce à cet ensemble de mesures, le Maroc s’affirme, davantage encore, comme un pays crédible et digne de confiance auprès des investisseurs étrangers et des différents acteurs économiques et financiers.",
    vocabulary: [
      { fr: "Pays crédible", ar: "بلد يحظى بالثقة والمصداقية", explanation: "الدول التي تتسم باستقرار مؤسساتي وقانوني يشجع الفاعلين الدوليين على الاستثمار فيها." },
      { fr: "Investisseurs étrangers", ar: "المستثمرين الأجانب", explanation: "الأشخاص الطبيعيون أو المعنويون من جنسيات أجنبية الذين يوظفون أموالهم في مشاريع بالمملكة." }
    ],
    analysis: "تُظهر الفقرة الأثر الإيجابي المباشر للإصلاحات على 'مكانة ومصداقية المغرب' (crédibilité du Maroc) كحاضن جاذب ومرجعي للاستثمارات الأجنبية المباشرة."
  },
  {
    id: 7,
    title: "أهمية الاجتهاد القضائي التجاري ومحكمة النقض في حماية الحقوق",
    ar: "ولايفوتنا التأكيد على أهمية القرارات المبدئية الصادرة عن القضاء المغربي في هذا المجال، وخاصة محكمة النقض، والتي سعت إلى إعطاء مصداقية وثبات ومرونة للمقررات التحكيمية الأجنبية، وكرست الحماية القانونية لبراءات الاختراع وحقوق المؤلف.",
    fr: "A cet égard, Nous tenons à souligner l’importance des arrêts de principe rendus par la Justice marocaine, notamment par la Cour de Cassation. L’action de cette dernière contribue, en effet, à apporter de la crédibilité, de la stabilité, de la souplesse aux décisions arbitrales étrangères, à renforcer la protection juridique des brevets d’invention et des droits d’auteur.",
    vocabulary: [
      { fr: "Arrêts de principe", ar: "القرارات المبدئية", explanation: "الأحكام القضائية الصادرة عن المحاكم العليا التي تضع قواعد تفسيرية مبدئية يسترشد بها القضاء الأدنى." },
      { fr: "Cour de Cassation", ar: "محكمة النقض", explanation: "أعلى مؤسسة قضائية في الهرم القضائي المغربي مهمتها مراقبة تطبيق القانون وتوحيد الاجتهاد." },
      { fr: "Brevets d'invention", ar: "براءات الاختراع", explanation: "الشهادات القانونية التي تمنح للمخترعين لحماية حقوقهم الاستئثارية في استغلال ابتكاراتهم." }
    ],
    analysis: "إشادة ملكية بالقرارات المبدئية (arrêts de principe) لمحكمة النقض (Cour de Cassation) في تعزيز موثوقية التحكيم الأجنبي وحماية الملكية الفكرية وبراءات الاختراع."
  },
  {
    id: 8,
    title: "تعبئة الحكومة للإسراع بإصدار القوانين والمراسيم التطبيقية",
    ar: "وفي سياق هذه الإصلاحات التشريعية، وما أطلقته من دينامية فعالة، فإننا نهيب بالحكومة إلى الإسراع بإقرار باقي النصوص القانونية ذات الصلة، وإعداد النصوص التنظيمية المتعلقة بالقوانين المصادق عليها.",
    fr: "Dans le cadre de ces réformes législatives qui ont d’ores et déjà généré une dynamique porteuse d’efficacité, Nous engageons le gouvernement à accélérer l’approbation des derniers textes juridiques connexes, à élaborer les documents réglementaires se rapportant aux lois approuvées.",
    vocabulary: [
      { fr: "Réformes législatives", ar: "الإصلاحات التشريعية", explanation: "مسلسل تحديث وتغيير القوانين والأنظمة القانونية لتلائم التطورات الاقتصادية والاجتماعية." },
      { fr: "Documents réglementaires", ar: "النصوص التنظيمية / المراسيم التطبيقية", explanation: "المراسيم والقرارات الصادرة عن السلطة التنفيذية لتوضيح كيفية تطبيق القوانين المصادق عليها." }
    ],
    analysis: "يدعو جلالة الملك الحكومة لتسريع وتيرة إصدار 'النصوص التنظيمية' (documents réglementaires) لضمان التنزيل السليم والفعال للقوانين التي صادق عليها البرلمان."
  },
  {
    id: 9,
    title: "توفير الأمن القضائي الكامل للمستثمرين وتوحيد آليات تسوية النزاعات",
    ar: "حضرات السيدات والسادة،\nإن توفير المناخ المناسب للاستثمار، لا يقتضي فقط تحديث التشريعات المحفزة، بل يقتضي أيضا توفير الضمانات القانونية والاقتصادية، الكفيلة بتحقيق الثقة في النظام القضائي، وتوفير الأمن الكامل للمستثمرين. ومن هنا تبرز أهمية توحيد آليات ومساطر تسوية منازعات الاستثمار، على الصعيد الوطني والجهوي والدولي، وتجاوز إشكاليات الاختصاص القضائي الوطني في هذا المجال، عبر إقامة نظام قانوني ملائم، يتوخى تفادي المشاكل والحد من المنازعات، وكذلك إنشاء هيئات متخصصة في فض هذا النوع من النزاعات، داخل الآجال المعقولة، وتراعي خصوصيات المنازعات المالية والتجارية، وتتسم بالسرعة والفعالية والمرونة.",
    fr: "Mesdames, Messieurs,\nAu-delà de l’actualisation des législations incitatives en vigueur, la mise en place d’un climat propice à l’investissement requiert des garanties juridiques et économiques susceptibles de renforcer la confiance dans le système judiciaire et d’assurer une sécurité totale aux investisseurs. En conséquence, aux niveaux national, régional et international, il est important de procéder à une uniformisation des normes et des procédures de règlement des litiges liés à l’investissement. Il est également primordial de dépasser les problématiques liées à la compétence des juridictions nationales, en mettant en place un système juridique adapté. Ce dispositif nouveau doit permettre de prévenir les problèmes éventuels et d’endiguer les contentieux, grâce à la création d’organes spécialisés dans la résolution de différends, selon des délais raisonnables. Il doit aussi être en mesure de prendre en considération les spécificités des litiges financiers et d’agir avec diligence, efficacité et souplesse.",
    vocabulary: [
      { fr: "Système judiciaire", ar: "النظام القضائي / منظومة القضاء", explanation: "مجموع المحاكم والقوانين والقضاة الذين يتولون إقامة العدل وتطبيق القانون." },
      { fr: "Règlement des litiges", ar: "تسوية منازعات الاستثمار", explanation: "الوسائل والإجراءات القانونية المتبعة لحل الخلافات الناشئة بين المستثمرين والشركاء أو الإدارة." },
      { fr: "Compétence des juridictions", ar: "الاختصاص القضائي", explanation: "السلطة القانونية الممنوحة لمحكمة معينة للفصل في النزاعات المعروضة عليها بناء على نوعها أو جغرافيتها." }
    ],
    analysis: "توضح الفقرة أن جذب الاستثمار يقتضي تجاوز إشكاليات الاختصاص القضائي الوطني عبر 'توحيد آليات تسوية النزاعات' وإنشاء هيئات متخصصة تتسم بالمرونة والسرعة."
  },
  {
    id: 10,
    title: "مأسسة وتطوير الطرق القضائية البديلة (الوساطة والتحكيم والصلح)",
    ar: "وفي هذا الصدد، سبق أن أكدنا في خطابنا بمناسبة ذكرى ثورة الملك والشعب لسنة 2009، على “ضرورة تطوير الطرق القضائية البديلة، كالوساطة والتحكيم والصلح”؛ وهي التوجيهات التي ضمناها رسالتنا لمؤتمركم هذا في دورته الأولى، حيث دعونا فيها إلى مأسسة الوسائل البديلة لحل المنازعات.\nواستجابة للرغبة الملحة للمستثمرين، في تبسيط وتسريع المساطر الإدارية والقضائية، فقد تم إعداد مشروع مدونة خاصة بالتحكيم والوساطة الاتفاقية، في أفق عرضه على مسطرة المصادقة.",
    fr: "A cet égard, dans Notre Discours prononcé en 2009, à l’occasion de la Révolution du Roi et du Peuple, Nous avions déjà souligné la nécessité de développer les modes judiciaires alternatifs, comme la médiation, l’arbitrage, la conciliation. De même, dans Notre Message adressé à la première édition de votre conférence, Nous avions, parmi d’autres orientations, appelé à une institutionnalisation des modes alternatifs de règlement des litiges.\nEn réponse aux demandes pressantes des investisseurs pour la simplification et l’accélération des procédures administratives et judiciaires, un projet de Code de l’arbitrage et de la médiation conventionnelle se trouve actuellement en attente d’approbation.",
    vocabulary: [
      { fr: "Modes judiciaires alternatifs", ar: "الطرق القضائية البديلة", explanation: "آليات موازية للقضاء العادي لحل الخلافات ودياً وتوفير الوقت والتكلفة." },
      { fr: "Médiation, arbitrage, conciliation", ar: "الوساطة والتحكيم والصلح", explanation: "أبرز أشكال الوسائل البديلة لفض النزاعات التجارية والمدنية بموافقة الأطراف." },
      { fr: "Institutionnalisation", ar: "مأسسة الوسائل البديلة", explanation: "وضع إطار مؤسسي وقانوني منظم وموثوق لآليات التحكيم والوساطة ليعتد بقراراتها رسمياً." }
    ],
    analysis: "تأكيد جلالة الملك على 'مأسسة الوسائل البديلة لحل المنازعات' (institutionnalisation des modes alternatifs) كاستجابة لمطالب المستثمرين في تسهيل المساطر وتجنب بطء التقاضي."
  },
  {
    id: 11,
    title: "تحسين موقع المغرب في مؤشر مناخ الأعمال العالمي",
    ar: "لقد مكنت الجهود المبذولة، من تنامي وتيرة الاستثمارات التي تستقطبها المملكة، وتحسن موقعها ضمن مـؤشر مناخ الأعمال (Doing Business) لسنة 2019.\nوإننا لنتطلع للارتقاء ببلادنا إلى مراحل أكثر تقدما في مؤشر مناخ الأعمال، وتحسين موقعها بولوج دائرة الدول الخمسين الأوائل في مجال جودة مناخ الأعمال.",
    fr: "Le Royaume, grâce aux efforts déployés en ce sens, attire aujourd’hui de plus en plus d’investissements et progresse par conséquent dans le classement Doing Business 2019.\nNous formons le souhait que notre pays parvienne à améliorer sa position selon l’Indicateur du climat des affaires, et à intégrer les cinquante pays les mieux classés pour la qualité du climat des affaires qui les caractérise.",
    vocabulary: [
      { fr: "Doing Business", ar: "مؤشر مناخ الأعمال العالمي", explanation: "التقرير السنوي الصادر عن البنك الدولي لقياس سهولة ممارسة الأنشطة التجارية في دول العالم." },
      { fr: "Qualité du climat des affaires", ar: "جودة مناخ الأعمال", explanation: "مدى ملاءمة البيئة التنظيمية والتشريعية لسهولة ممارسة الأعمال والتجارة وتجنيب الصعوبات." }
    ],
    analysis: "إشادة بالتقدم الملموس للمغرب في تصنيف 'Doing Business' لعام 2019، وتحديد رؤية استراتيجية واضحة تهدف لولوج قائمة الخمسين دولة الأولى عالمياً."
  },
  {
    id: 12,
    title: "المحاكم التجارية والتحول الرقمي واللامادية في التقاضي",
    ar: "حضرات السيدات والسادة،\nلقد مر ربع قرن على إحداث المحاكم التجارية في بلادنا، وهي مناسبة سانحة لتقييم هذه التجربة، والنظر في سبل تطويرها، بالعمل على تعزيز المكتسبات، واستشراف آفاق جديدة تستلهم أنجح التجارب عبر العالم، على غرار فكرة محاكم الأعمال، التي بدأت تتبناها بعض الدول.\nوترسيخا لهذا التوجه، يتعين إيلاء عناية خاصة للتكوين المتخصص لمختلف مكونات منظومة العدالة، عملا على رفع قدرات المحاكم في إصدار الأحكام العادلة والملائمة، داخل آجال معقولة. وهنا نشير إلى دور المحاكم العليا في توحيد الاجتهاد وتفسير القاعدة القانونية، وهي مناسبة لتثمين الرصيد المهم الذي راكمه القضاء التجاري بالمغرب في هذا المجال، كقضاء متخصص.\nوفي نفس السياق، ندعو لاستثمار ما توفره الوسائل التكنولوجية الحديثة من إمكانيات لنشر المعلومة القانونية والقضائية، وتبني خيار تعزيز وتعميم لامادية الإجراءات والمساطر القانونية والقضائية، والتقاضي عن بعد، باعتبارها وسائل فعالة تسهم في تحقيق السرعة والنجاعة، وذلك انسجاما مع متطلبات منازعات المال والأعمال، مع الحرص على تقعيدها قانونيا، وانخراط كل مكونات منظومة العدالة في ورش التحول الرقمي.",
    fr: "Mesdames, Messieurs,\nUn quart de siècle s’est écoulé depuis que notre pays s’est doté de tribunaux de commerce. Le moment Nous paraît, donc, opportun d’évaluer cette expérience et de lui donner les moyens de se développer, en consolidant ses acquis et en lui ouvrant des perspectives nouvelles, inspirées des expériences les plus réussies dans le monde, comme celle des juridictions des affaires, que certains pays ont mises en place.\nEn appui à cette orientation, une attention particulière doit être accordée à la formation spécialisée des différentes composantes du système de justice. Le but is d’accroître la capacité des juridictions à rendre, dans des délais raisonnables, des sentences justes et appropriées. A cet égard, il convient de souligner le rôle des Cours Suprêmes dans l’harmonisation de la jurisprudence et l’interprétation de la règle de droit. Saisissons ici l’occasion pour saluer l’action de la Justice Commerciale marocaine, cette instance spécialisée qui compte à son actif d’importantes réalisations.\nDans le même esprit, pour assurer une meilleure diffusion de l’information juridique et judiciaire, Nous recommandons l’utilisation des nouvelles technologies. Nous préconisons aussi le renforcement et la généralisation de la dématérialisation des formalités et procédures juridiques et judiciaires ainsi que le recours aux services de justice à distance. A l’aide de ces outils efficients, le travail judiciaire gagnera en rapidité et en efficacité et sera mieux adapté aux exigences de traitement des éventuels contentieux dans le monde des affaires et de la finance. Tout en veillant à doter ces outils d’un fondement juridique, il convient d’impliquer les différentes composantes du système de justice dans le chantier de transition digitale.",
    vocabulary: [
      { fr: "Tribunaux de commerce", ar: "المحاكم التجارية", explanation: "المحاكم المتخصصة في النظر في النزاعات بين التجار والشركات والمعاملات التجارية." },
      { fr: "Dématérialisation des formalités", ar: "لامادية الإجراءات والمساطر", explanation: "الاستغناء عن السجلات والأوراق التقليدية واعتماد الأنظمة الإلكترونية في تقييد وتدبير الملفات." },
      { fr: "Transition digitale / numérique", ar: "التحول الرقمي", explanation: "الاعتماد الشامل على التكنولوجيا والأنظمة الذكية لتسريع ورقمنة الإدارة القضائية." }
    ],
    analysis: "يدعو جلالة الملك لتعميم 'لامادية الإجراءات' (dématérialisation) والتقاضي عن بعد كأدوات عصرية لتحقيق السرعة والنجاعة المطلوبة في منازعات المال والأعمال."
  },
  {
    id: 13,
    title: "بناء فضاء آمن للاستثمار والخاتمة السامية",
    ar: "حضرات السيدات والسادة،\nإن خلق فضاء آمن للاستثمار بأبعاده الاقتصادية والاجتماعية والحقوقية والإدارية والهيكلية، يفرض علينا جميعا اليوم، بذل المزيد من الجهود في اتجاه ترسيخ دولة القانون، وتعزيز استقلال السلطة القضائية، ودعم التنبؤ القانوني، وتأهيل الفاعلين في المجال القضائي، وتطوير الإدارة القضائية، وتعزيز حكامتها، من خلال مقاربة شمولية مندمجة، تتعامل مع قضايا الاستثمار في مختلف جوانبها، المرتبطة بالقوانين التجارية والبنكية، والضريبية والجمركية، والعقارية والتوثيقية والاجتماعية، وتستحضر الأبعاد الدولية والتكنولوجية التي تفرضها عولمة التبادل التجاري والمالي والاقتصادي عبر القارات.\nوإننا لواثقون، بأن هذا المؤتمر، وانطلاقا من الحضور الوازن للمشاركين فيه، من وزراء وقضاة ورجال القانون والاقتصاد والسياسة، والمال والأعمال، والخبراء والأكاديميين، سيكون فرصة سانحة للتداول في الممارسات الفضلى، وابتكار حلول جديدة وواقعية، ورؤى متطورة، والخروج بمقترحات وتوصيات، ستساهم لا محالة في إغناء مجال الأعمال والاستثمار، وتحسين مناخه وتعزيز دوره، وستشكل موردا ينهل منه المشرعون وصناع القرار والدارسون والمهتمون.\nوفقكم الله وسدد خطاكم، وكلل بالتوفيق أعمالكم.\nوالسلام عليكم ورحمة الله تعالى وبركاته”.",
    fr: "Mesdames, Messieurs,\nPour mettre en place un environnement sûr pour l’investissement, fort de ses assises économique, sociale, administrative et institutionnelle et sensible à la dimension de promotion des droits de l’Homme, nous devons œuvrer davantage à consolider l’Etat de droit, à renforcer l’indépendance du pouvoir judiciaire, à favoriser les occurrences d’anticipation juridique, à donner aux acteurs de la justice une formation de qualité, à moderniser l’administration judiciaire et à renforcer sa gouvernance. Pour ce faire, il importe de mettre en œuvre une approche intégrée. D’une part, elle sera à même d’aborder les affaires liées à l’investissement sous tous les aspects associés aux législations commerciale et bancaire, fiscale et douanière, foncière, notariale et sociale; d’autre part, elle pourra prendre en considération la portée internationale et la composante technologique de la mondialisation des échanges commerciaux, financiers et économiques.\nEtant donné la stature éminente des participants à cette conférence qui réunit des ministres, des magistrats, des juristes, des économistes, des personnalités des mondes politique, économique et financier ainsi que des experts et des académiciens, Nous sommes persuadé que cette rencontre constituera une bonne opportunité pour débattre sur les bonnes pratiques, proposer des solutions innovantes et réalistes, mettre au point une approche élaborée. Elle pourra, ainsi, formuler des recommandations et des propositions qui contribueront à enrichir le monde des affaires et de l’investissement, en le dotant d’un contexte favorable et en renforçant son rôle. Les idées ainsi dégagées pourront inspirer tour à tour législateurs, décideurs, chercheurs, ainsi que toute personne sensible à ces questions.\nQue Dieu guide vos pas et couronne vos travaux de succès.\nWassalamou alaikoum warahmatoullahi taala wabarakatouh ».",
    vocabulary: [
      { fr: "Environnement sûr", ar: "فضاء آمن للاستثمار", explanation: "الوسط الاستثماري المتكامل الذي يوفر الثقة التامة والحماية القانونية الفعالة للرأسمال." },
      { fr: "Approche intégrée", ar: "مقاربة شمولية مندمجة", explanation: "رؤية تجمع مختلف القوانين التجارية والبنكية والضريبية والجمركية والعقارية في نسق واحد." },
      { fr: "Mondialisation des échanges", ar: "عولمة التبادل التجاري", explanation: "ترابط الأسواق العالمية وتدفق السلع ورؤوس الأموال العابر للقارات بنظم قانونية موحدة." }
    ],
    analysis: "يختتم جلالة الملك الخطاب بالدعوة لترسيخ استقلال السلطة القضائية (indépendance du pouvoir judiciaire) وبناء بيئة متكاملة تدمج الأبعاد الدولية والتكنولوجية، متمنياً للمشاركين كامل السداد."
  }
];

const SPEECH_SECTIONS_2024_ALT: SpeechSection[] = [
  {
    id: 1,
    title: "المقدمة والترحيب بالوفود",
    ar: "يطيب لنا، بمناسبة انعقاد المؤتمر العالمي الثامن لمنظمة المدن والحكومات المحلية المتحدة بمدينة طنجة، تحت رعايتنا السامية، أن نتوجه بأصدق عبارات الترحيب والتقدير إلى كافة المشاركات والمشاركين فيه، من قادة محليين جهويين، ومسؤولين حكوميين، ومنتخبين، وخبراء، وممثلي المنظمات والشبكات الدولية. كما نعرب عن اعتزازنا باحتضان المملكة المغربية لهذا الملتقى العالمي الرفيع، حول قضايا أصبحت في صلب مستقبل التنمية والحكامة عبر العالم، وفي مقدمتها تطوير الديمقراطية وتجديد الحكامة المحلية، وتعزيز العدالة المجالية، وتقوية الدور المحوري الذي يجب أن تضطلع به المدن والجهات والجماعات الترابية، في بناء مستقبل أكثر إنصافا واستدامة.",
    fr: "Il Nous plait, à l’occasion du huitième Congrès mondial de l’Organisation des Cités et Gouvernements Locaux Unis, qui se tient sous Notre Haut Patronage, à Tanger, de souhaiter la bienvenue aux participants et participantes : dirigeants locaux et régionaux, responsables gouvernementaux, élus, experts et représentants d’organismes et de réseaux internationaux. Nous les assurons de toute l’estime que Nous leur portons. Nous sommes fier que le Royaume du Maroc accueille les assises de cette auguste assemblée mondiale, dont le propos est de débattre de questions inscrites au cœur des dynamiques futures de développement et de gouvernance dans le monde, avec, au premier chef, la promotion de la pratique démocratique, le renouvellement de la gouvernance locale, la consolidation de la justice territoriale, le renforcement du rôle central des cités, des régions et des collectivités territoriales dans la construction d’un avenir porteur de plus d’équité et respectueux de l’exigence de durabilité.",
    vocabulary: [
      { fr: "Justice territoriale", ar: "العدالة المجالية", explanation: "توزيع متوازن ومستصف للموارد والمرافق العامة والفرص الاقتصادية بين مختلف المجالات والجهات." },
      { fr: "Collectivités territoriales", ar: "الجماعات الترابية", explanation: "كيانات جغرافية وقانونية خاضعة للقانون العام تتمتع بالاستقلال المالي والإداري وتدير شؤونها ذاتياً." },
      { fr: "Gouvernance locale", ar: "الحكامة المحلية", explanation: "أسلوب متميز في تدبير الشأن العام الترابي يرتكز على الديمقراطية التشاركية والنجاعة والمشاركة الواسعة." }
    ],
    analysis: "يؤصل الخطاب السامي لمفهوم 'الحكامة المحلية' و'العدالة المجالية' (justice territoriale) كركائز أساسية لبناء مستقبل 'الجماعات الترابية' (collectivités territoriales)."
  },
  {
    id: 2,
    title: "دلالات طنجة التاريخية وشعار المؤتمر",
    ar: "إن احتضان مدينة طنجة لهذا المؤتمر يحمل دلالات عميقة. فهذه المدينة، بما ترمز إليه من انفتاح حضاري، وبما تتميز به من موقع استراتيجي عند ملتقى القارات والبحار، تجسد معنى التواصل والتلاقي بين الشعوب والثقافات، وتعكس صورة المغرب المنفتح على محيطه، الواثق في اختياراته، المتمسك بهويته، والمقبل بثبات على المستقبل. وإن اختياركم لشعار \"جيل جديد من الخدمات العمومية المحلية الشاملة\"، يعكس وعيا جماعيا متقدما بأن الحكامة الترابية لم تعد شأنا إداريا أو تنظيميا فحسب، بل أصبحت رافعة أساسية لترسيخ العدالة المجالية، وتقليص الفوارق الاجتماعية، وتجديد الثقة بين المواطن والمؤسسات، وتحويل الالتزامات الدولية الكبرى إلى مشاريع ملموسة، داخل المدن والجهات والجماعات الترابية الأخرى.",
    fr: "En tant que ville hôte de ce congrès, Tanger atteste, de fort belle manière, son statut de cité ouverte aux divers flux civilisationnels et celui de carrefour stratégiquement situé à la confluence des continents et des étendues marines. Elle démontre également toute sa valeur de creuset d’échanges et de métissages entre les peuples et les cultures et incarne l’idée d’un Maroc ouvert sur son voisinage, confiant dans ses choix, attaché à son identité, résolument orienté vers l’avenir. Le thème que vous avez retenu pour ce congrès : \"une nouvelle génération de services publics locaux universels\" reflète une prise de conscience accrue chez tous que la gouvernance territoriale n’est plus seulement une affaire d’ordre administratif ou de logique organisationnelle. Elle s’affirme désormais comme un levier essentiel pour consolider la justice territoriale, réduire les inégalités sociales, restaurer la confiance entre le citoyen et les institutions, décliner les engagements internationaux majeurs sous forme de projets concrets dans les cités, les régions et le reste des collectivités territoriales.",
    vocabulary: [
      { fr: "Services publics locaux universels", ar: "الخدمات العمومية المحلية الشاملة", explanation: "خدمات أساسية كالصحة والتعليم والماء والكهرباء تقدمها الوحدات المحلية لكافة المواطنين دون تمييز وبجودة عالية." },
      { fr: "Inégalités sociales", ar: "الفوارق الاجتماعية", explanation: "الفروق غير العادلة في الدخل والفرص ومستويات العيش بين مختلف الفئات الاجتماعية في البلد." },
      { fr: "Gouvernance territoriale", ar: "الحكامة الترابية", explanation: "التنسيق الفعال والمشترك بين الفاعلين العموميين والخواص والمجتمع المدني لتنمية المجال الجغرافي." }
    ],
    analysis: "هنا يتم تعريف الحكامة الترابية (gouvernance territoriale) ليس فقط كأداة إدارية بل كرافعة لتكريس العدالة المجالية والاجتماعية."
  },
  {
    id: 3,
    title: "الإصلاح المجالي والجهوية المتقدمة",
    ar: "لقد حرصنا، منذ اعتلائنا عرش أسلافنا الميامين، على جعل الإصلاح المجالي أحد المرتكزات الاستراتيجية للمشروع المجتمعي والتنموي لبلادنا، إيمانا منا بأن الدولة الحديثة لا تقاس فقط بقوة مؤسساتها المركزية، بل كذلك بقدرتها على تمكين مجالاتها الترابية من المبادرة والمشاركة، وتقريب القرار العمومي من المواطن، وجعل التنمية المجالية ثمرة للتكامل وتظافر الجهود بين الدولة والجماعات الترابية وباقي الفاعلين. ومن هذا المنطلق، فإن الجهوية المتقدمة التي أرسينا دعائمها في المغرب هي اختيار استراتيجي لتحديث الدولة، وترسيخ الديمقراطية المحلية، وتحرير الطاقات، وتكريس مبدأ الإنصاف بين الجهات، وربط التنمية بخصوصيات كل مجال وبمؤهلاته وحاجيات ساكنته.",
    fr: "Depuis Notre Accession au Trône de Nos Glorieux Ancêtres, Nous avons érigé la réforme territoriale en orientation stratégique clé du projet sociétal et développemental de notre pays, mû en cela par la ferme conviction qu’un Etat ne doit pas sa modernité uniquement à la solidité de ses institutions centrales, mais aussi à sa capacité à doter ses domaines territoriaux d’un pouvoir de prise d’initiative et de participation, à rendre la décision publique plus accessible aux citoyens, à concevoir le développement territorial comme le fruit d’efforts concertés et complémentaires engageant l’Etat, les collectivités territoriales et le reste des intervenants. A cet égard, la Régionalisation avancée dont Nous avons posé les fondements au Maroc représente un choix stratégique à travers lequel l’Etat tend à moderniser ses structures, à consolider la démocratie locale, à libérer les potentiels et les énergies, à consacrer le principe d’équité entre les régions, à articuler le développement de chaque territoire avec ses spécificités, ses atouts et les besoins de sa population.",
    vocabulary: [
      { fr: "Régionalisation avancée", ar: "الجهوية المتقدمة", explanation: "نموذج مغربي متميز للامركزية يمنح الجهات صلاحيات واسعة وموارد مالية لتنمية جهوية مندمجة وقائمة بذاتها." },
      { fr: "Démocratie locale", ar: "الديمقراطية المحلية", explanation: "مشاركة السكان الفعالة عبر هيئات منتخبة ومجالس ترابية في صنع القرار وإدارة الشؤون المحلية." },
      { fr: "Réforme territoriale", ar: "الإصلاح المجالي", explanation: "إعادة هيكلة الصلاحيات والحدود الجغرافية والعلاقات بين المركز والجهات لتحقيق التوازن التنموي." }
    ],
    analysis: "الخطاب يوضح أن 'الدولة الحديثة' تتطلب تمكين الجهات من خلال 'الجهوية المتقدمة' (régionalisation avancée)، وجعل القرار العمومي قريباً من المواطن."
  },
  {
    id: 4,
    title: "دور الجهة والتدبير الحر والشفافية",
    ar: "وقد مكنت هذه الرؤية من ترسيخ موقع الجهة باعتبارها فضاء للتخطيط الاستراتيجي، وتعبئة الاستثمار، وإنعاش الاقتصاد المحلي، وتقوية الالتقائية بين البرامج القطاعية والترابية. كما مكنت من تعزيز دور العمالات والأقاليم والجماعات، في إطار تكامل مؤسساتي يقوم على التدبير الحر، والتضامن والتعاون، وربط المسؤولية بالمحاسبة. إن ما نريده من هذا الورش هو إقامة تنظيم ترابي خلاق، لا يكتفي بإدارة الحاجيات اليومية، بل يملك القدرة على استباق التحولات، وتوجيه الاستثمار، ومواكبة الانتقال الرقمي والبيئي، وتحسين جودة الخدمات العمومية، إدماج الشباب والنساء والفئات الهشة في دينامية التنمية.",
    fr: "A la faveur de cette vision, la Région se confirme comme un espace propice à la planification stratégique, à la mobilisation de l’investissement, à la stimulation de l’économie locale, à la poursuite d’une transversalité accrue entre les programmes sectoriels et territoriaux. Le rôle des préfectures, des provinces et des collectivités s’en est également trouvé renforcé dans le cadre d’une complémentarité institutionnelle fondée sur la libre gestion, la solidarité et la coopération, la reddition des comptes. Nous attendons de ce chantier qu’il débouche sur la mise en place d’une organisation territoriale innovante qui ne se limite pas à gérer les besoins quotidiens, mais qui se dote des ressources nécessaires pour anticiper les transformations potentielles, encadrer l’investissement, accompagner la transition numérique et écologique, améliorer la qualité des services publics, favoriser l’insertion des jeunes, des femmes et des catégories vulnérables dans la dynamique de développement.",
    vocabulary: [
      { fr: "Planification stratégique", ar: "التخطيط الاستراتيجي", explanation: "عملية رسم الأهداف المستقبلية للمجال الترابي وتحديد الآليات والموارد لتنزيلها على المدى المتوسط والبعيد." },
      { fr: "Libre gestion", ar: "التدبير الحر", explanation: "المبدأ الدستوري الذي يخول للجماعات الترابية سلطة التداول والتقرير وتدبير شؤونها بكامل الحرية والاستقلالية." },
      { fr: "Reddition des comptes", ar: "ربط المسؤولية بالمحاسبة", explanation: "المبدأ الدستوري والديمقراطي الذي يلزم مدبري الشأن العام بتقديم الحساب حول نتائج تدبيرهم واستعمالهم للموارد." }
    ],
    analysis: "هذا الجزء يؤكد على مبادئ دستورية حاكمة للحكامة الترابية كـ 'التدبير الحر' (libre gestion) و'ربط المسؤولية بالمحاسبة' (la reddition des comptes)."
  },
  {
    id: 5,
    title: "منهجية التنمية الترابية والتعاقد والشراكة",
    ar: "وتكريسا لهذا التوجه، أطلقنا جيلا جديدا من برامج التنمية الترابية المندمجة، يجسد إرادة راسخة في تجديد أساليب العمل العمومي، من خلال الانطلاق من التشخيص الدقيق لحاجيات الساكنة، والإنصات للفاعلين المحليين، وترتيب الأولويات وفق أثرها المباشر على المواطن، ولا سيما في مجالات التشغيل والتعليم، والصحة والماء، والتأهيل الترابي، وتحسين ظروف العيش الكريم. ولا تكمن أهمية هذه البرامج في حجم المشاريع التي تحملها فحسب، بل في المنهجية التي تؤسس لها، والقائمة على التشاور، والتعاقد، والتتبع، والتقييم، والنجاعة في استعمال الموارد، وربط الأهداف بالنتائج. وبذلك تصبح التنمية الترابية مسارا مشتركا، تتقاسم فيه الدولة والجماعات الترابية والقطاع الخاص والمجتمع المدني مسؤولية بلورة المشاريع وتنفيذها وتقييم أثرها.",
    fr: "En appui à cette orientation, Nous avons lancé une nouvelle génération de programmes de développement territorial intégré qui traduit une volonté inébranlable de remettre à neuf les méthodes de l’action publique. Ce travail commence par une identification rigoureuse des besoins de la population, l’écoute prêtée aux acteurs locaux, la définition de l’ordre des priorités en fonction de leur impact direct sur la vie des citoyens, notamment dans les secteurs de l’emploi, de l’éducation, de la santé, de l’eau, de la mise à niveau territoriale. Le but recherché est de créer un cadre de vie digne et d’en améliorer les conditions. L’importance de ces programmes ne réside pas seulement dans le volume ou l’envergure des projets qu’ils portent, mais bien plus encore dans la méthodologie qu’ils instaurent. Celle-ci repose sur la concertation, la contractualisation, le suivi, l’évaluation, l’efficience dans l’allocation des ressources ainsi que sur la corrélation entre les objectifs fixés et les résultats escomptés. C’est ainsi que le développement territorial se conçoit désormais comme un processus commun dans lequel l’État, les collectivités territoriales, le secteur privé et la société civile assument, conjointement, la responsabilité d’élaborer les projets, d'en assurer l’exécution et d'en évaluer l’impact.",
    vocabulary: [
      { fr: "Développement territorial intégré", ar: "برامج التنمية الترابية المندمجة", explanation: "برامج تنموية تشمل قطاعات متعددة وتنسق بين مختلف مستويات التدخل لتحقيق تنمية متكاملة ومستدامة للمجال." },
      { fr: "Contractualisation", ar: "التعاقد", explanation: "أداة قانونية لتحديد التزامات كل من الدولة والجماعات الترابية والشركاء في تمويل وإنجاز المشاريع التنموية المشتركة." },
      { fr: "Efficience", ar: "النجاعة", explanation: "تحقيق أفضل النتائج الممكنة باستخدام الموارد والوسائل المالية والبشرية المتاحة بأقل تكلفة ووقت." }
    ],
    analysis: "يوضح الخطاب الانتقال من التدبير القطاعي المعزول إلى التدبير المندمج التشاركي القائم على 'التشاور' و'التعاقد' (contractualisation) والتقييم والنجاعة."
  },
  {
    id: 6,
    title: "التعاون الإفريقي والتعاون جنوب-جنوب اللامركزي",
    ar: "وفي نفس السياق، تندرج المبادرات التي أطلقناها لفائدة القارة الإفريقية، ضمن رؤية متجددة للتعاون جنوب - جنوب، ومن بينها المبادرة الرامية إلى تمكين دول الساحل من الولوج إلى المحيط الأطلسي، ومشروع أنبوب الغاز الإفريقي الأطلسي، ومبادرة الدول الإفريقية الأطلسية، وهي مبادرات تجعل من الواجهة الأطلسية الإفريقية فضاء استراتيجيا للتعاون والازدهار المشترك، وتعزز دور المغرب كفاعل موثوق، وشريك ملتزم في خدمة تنمية إفريقية مستقرة ومندمجة. كما يواصل المغرب جعل التعاون الدولي اللامركزي رافعة عملية لتقاسم التجارب والخبرات بين الجماعات الترابية، ولا سيما مع نظيراتها الإفريقية. وهو ما يقوم به الصندوق الإفريقي لدعم التعاون الدولي اللامركزي للجماعات الترابية الذي، ومنذ إحداثه سنة 2020، أضحى آلية مبتكرة لمواكبة شراكات ترابية ذات أثر ملموس، وترسيخ تعاون إفريقي يقوم على التنمية المحلية، والحكامة الجيدة، وتقوية القدرات، وتبادل الخبرات.",
    fr: "Dans le même contexte, Nous avons lancé, au profit du continent africain, des initiatives guidées by une vision renouvelée de la coopération Sud-Sud. Parmi celles-ci figurent l’Initiative visant à favoriser l’accès des États du Sahel à l’Océan Atlantique, le projet de Gazoduc Africain Atlantique, ainsi que le Processus des États Africains Atlantiques. Ces initiatives font de la façade atlantique africaine un espace stratégique de coopération et de prospérité partagée et confortent le rôle du Maroc en tant qu'acteur crédible et partenaire engagé au service d’un développement africain stable et intégré. De surcroît, le Maroc continue de faire de la coopération internationale décentralisée un levier opérationnel de partage d'expériences et d'expertises entre les collectivités territoriales, tout particulièrement avec leurs consœurs africaines. C'est précisément la mission dévolue au Fonds Africain d’Appui à la Coopération Décentralisée Internationale (FACDI) des collectivités territoriales, qui, quelques années après sa création en 2020, est devenu un mécanisme novateur pour accompagner des partenariats territoriaux à impact réel et pour ancrer une coopération interafricaine axée sur le développement local, la bonne gouvernance, le renforcement des capacités et l'échange de savoir-faire.",
    vocabulary: [
      { fr: "Coopération décentralisée internationale", ar: "التعاون الدولي اللامركزي", explanation: "علاقات التعاون والشراكة المباشرة التي تقيمها الجماعات الترابية الوطنية مع مثيلاتها الأجنبية لتبادل الخبرات والمشاريع." },
      { fr: "Coopération Sud-Sud", ar: "التعاون جنوب - جنوب", explanation: "إطار للتعاون الاقتصادي والتنموي بين بلدان الجنوب يقوم على أساس المنفعة المتبادلة والسيادة والتنمية المشتركة." },
      { fr: "Renforcement des capacités", ar: "تقوية القدرات", explanation: "تأهيل وتطوير المهارات والمؤهلات المهنية والتدبيرية للمنتخبين والموظفين الترابيين لضمان نجاعة الإدارة المحلية." }
    ],
    analysis: "يسلط الخطاب الضوء على مبادرة 'التعاون جنوب - جنوب' (coopération Sud-Sud) و'التعاون الدولي اللامركزي' (coopération décentralisée internationale) كشراكات عابرة للحدود تهدف لتنمية إفريقية مستدامة ومستقرة."
  }
];

/* CORRUPTED DUPLICATE SECTION
const SPEECH_SECTIONS_2000: SpeechSection[] = [� الحقوق وحماية المستضعفين وإلغاء الأحكام الجائرة والممارسات غير القانونية." },
      { fr: "Dissémination", ar: "إشاعة ونشر قيم", explanation: "النشر والتوزيع الممنهج والترسيخ المستدام للأفكار والقيم النبيلة في المجتمع." }
    ],
    analysis: "يشرح الجزء الختامي تفرد الهيئة القضائية بكونها الوحيدة التي تعمل وتفتتح وتصدر الأحكام باسم جلالة الملك، ويربط القضاء بنجاح الاستثمار والتنمية والتقدم والازدهار."
  }
];
*/

const SPEECH_SECTIONS_2009: SpeechSection[] = [
  {
    id: 1,
    title: "أهداف ثورة الملك والشعب وسيادة القانون",
    ar: "لقد كان في طليعة أهداف ثورة الملك والشعب استرجاع استقلال المغرب، وبناء دولة المؤسسات القوية بسيادة القانون، وعدالة القضاء.",
    fr: "La révolution du Roi et du peuple avait essentiellement pour objet, le recouvrement de l'indépendance du Maroc et l'édification de l'Etat des institutions, fort de la suprématie de la loi et de l'équité de sa justice",
    vocabulary: [
      { fr: "Recouvrement de l'indépendance", ar: "استرجاع استقلال", explanation: "استعادة السيادة الوطنية والتحرر من ربقة الاستعمار أو الحماية الأجنبية." },
      { fr: "Suprématie de la loi", ar: "سيادة القانون", explanation: "المبدأ الدستوري والقانوني السامي الذي يقتضي خضوع الجميع لقواعد وأحكام القانون بالتساوي." },
      { fr: "Équité de sa justice", ar: "عدالة القضاء", explanation: "تحقيق النصفة والعدل التام من خلال سلطة قضائية نزيهة وحيادية." }
    ],
    analysis: "يؤكد جلالة الملك على الارتباط الوثيق بين استقلال المغرب (indépendance du Maroc) وتأسيس دولة الحق والمؤسسات القائمة على 'سيادة القانون' (suprématie de la loi) وعدالة القضاء."
  },
  {
    id: 2,
    title: "إطلاق الإصلاح الشامل والعميق للقضاء",
    ar: "ومواصلة للجهاد الأكبر لتحقيق هذا الهدف الأسمى، فقد ارتأينا أن نخصص خطابنا ، المخلد لذكراها السادسة والخمسين لإطلاق الإصلاح الشامل والعميق للقضاء، تعزيزا لأوراش التحديث المؤسسي والتنموي الذي نقوده.",
    fr: "Poursuivant le grand combat engagé pour concrétiser cet ultime dessein, Nous avons jugé opportun de consacrer Notre discours commémoratif du 56ème anniversaire de cette Révolution, à l'amorce de la réforme globale et profonde de la justice, de manière à renforcer les chantiers que Nous conduisons pour que Notre pays entre de plain-pied dans la modernité institutionnelle et réalise ses objectifs de développement.",
    vocabulary: [
      { fr: "Poursuivant le grand combat", ar: "ومواصلة للجهاد الأكبر", explanation: "الاستمرار في السعي والمجاهدة لبناء الوطن وتحديث مؤسساته بعد معركة الاستقلال السياسية." },
      { fr: "Réforme globale et profonde", ar: "الإصلاح الشامل والعميق", explanation: "ورش هيكلي متكامل يطال كافة جوانب منظومة العدالة وليس مجرد تغييرات جزئية أو طفيفة." },
      { fr: "Modernité institutionnelle", ar: "التحديث المؤسسي", explanation: "عصرنة الإدارة والمؤسسات الدستورية لتلائم متطلبات العصر ودولة الحق والقانون." }
    ],
    analysis: "يقابل التعبير التاريخي المغربي 'الجهاد الأكبر' العبارة الفرنسية 'le grand combat'، ويرتبط ورش تحديث القضاء بشكل عضوي بـ 'التحديث المؤسسي والتنموي' (modernité institutionnelle et développement)."
  },
  {
    id: 3,
    title: "القطيعة مع المقاربات الأحادية والجزئية",
    ar: "فمنذ تولينا أمانة قيادتك، وضعنا في صلب انشغالاتنا إصلاح القضاء، بمنظور جديد، يشكل قطيعة مع التراكمات السلبية، للمقاربات الأحادية والجزئية",
    fr: "Depuis que Nous est échue la charge d'assurer la conduite de la nation, Nous avons placé au cœur de Nos préoccupations, la réforme de la justice, une réforme qui procède d'une vision innovante, en rupture with les accumulations négatives issues des approches unilatérales et partielles",
    vocabulary: [
      { fr: "Depuis que Nous est échue la charge", ar: "فمنذ تولينا أمانة قيادتك", explanation: "تعبير مهيب عن استلام مسؤولية قيادة البلاد والأمانة الدستورية والشرعية السامية لخدمة الأمة." },
      { fr: "Vision innovante", ar: "منظور جديد", explanation: "رؤية تجديدية وعصرية متطورة تتجاوز الأساليب التقليدية المستهلكة." },
      { fr: "En rupture with les accumulations négatives", ar: "يشكل قطيعة مع التراكمات السلبية", explanation: "الحسم الفكري والإداري المنهجي مع الممارسات السلبية والعيوب التراكمية السابقة لضمان النجاعة." }
    ],
    analysis: "تبرز في هذه الفقرة ترجمة 'قطيعة' بـ 'en rupture'، دلالةً على رغبة جلالة الملك في التأسيس لـ 'منظور جديد' (vision innovante) يتجاوز كل ما هو جزئي ومؤقت."
  },
  {
    id: 4,
    title: "المنهجية التشاورية والإصلاح الجوهري",
    ar: "وقد أخذنا بالمنهجية التشاورية والإدماجية التي سلكناها ، بنجاعة، في القضايا الوطنية الكبرى، لبلورة إصلاح جوهري، لا يقتصر على قطاع القضاء، وإنما يمتد ، بعمقه وشموليته، لنظام العدالة..",
    fr: "Aussi, et loin de toute démarche unilatérale, avons-Nous retenu, en la matière, la démarche consultative, participative et inclusive que Nous avions judicieusement suivie pour traiter les grandes questions nationales. Au lieu de quelques mesures étriquées, Nous avons décidé de mettre au point une réforme substantielle qui ne se limite pas au seul secteur judiciaire, mais qui, par sa consistance et sa globalité, englobe l'ensemble du système de la justice.",
    vocabulary: [
      { fr: "Démarche consultative, participative et inclusive", ar: "المنهجية التشاورية والإدماجية", explanation: "المقاربة التشاركية الواسعة التي تدمج كافة الفاعلين وتستمع لآرائهم لإغناء المشروع." },
      { fr: "Réforme substantielle", ar: "إصلاح جوهري", explanation: "إصلاح بنيوي عميق يمس جوهر وهيكل النظام ولا يكتفي بمظاهره الخارجية السطحية." },
      { fr: "L'ensemble du système de la justice", ar: "نظام العدالة", explanation: "المنظومة القانونية والقضائية والمهن المساعدة للعدالة بكافة تفرعاتها ومؤسساتها." }
    ],
    analysis: "تُرجمت 'المنهجية التشاورية والإدماجية' بـ 'démarche consultative, participative et inclusive'، وتُرجم 'إصلاح جوهري' بـ 'réforme substantielle'، للدلالة على شمولية الورش لنظام العدالة برمته."
  },
  {
    id: 5,
    title: "تأسيس الهيئة الاستشارية التعددية والتمثيلية",
    ar: "ونود الإشادة بما أبانت عنه كافة الهيئات والفعاليات المؤهلة، من تجاوب صادق لما دعونا إليه من استشارات موسعة، وبما أثمرته من تصورات وجيهة. وحرصا على استمرار هذا النهج البناء، فإننا نعتزم إيجاد هيئة استشارية قارة تعددية وتمثيلية، تتيح للقضاء الانفتاح على محيطه، وتشكل إطارا مؤسسيا للتفكير وتبادل الخبرات بشأن القضايا ذات الصلة بالعدالة. وذلك في احترام لصلاحيات المؤسسات الدستورية، واستقلال السلطة القضائية، واختصاصات السلطات العمومية.",
    fr: "A cet égard, Nous tenons à rendre hommage à toutes les institutions, instances et autres acteurs qualifiés qui ont réagi positivement et sincèrement à Notre appel en faveur de consultations élargies, lesquelles ont débouché sur des idées pertinentes, dont Nous nous félicitons également. Ayant à cœur de continuer sur cette voie, avec la même démarche constructive, Nous comptons mettre en place une instance consultative, pluraliste et représentative, permettant à la justice de s'ouvrir sur son environnement. Il s'agit d'un cadre institutionnel de réflexion et d'échange de savoir-faire, sur les questions ayant trait à la justice, et ce, dans le respect des prérogatives des institutions constitutionnelles, de l'indépendance du pouvoir judiciaire et des attributions des autorités publiques.",
    vocabulary: [
      { fr: "Instance consultative, pluraliste et représentative", ar: "هيئة استشارية قارة تعددية وتمثيلية", explanation: "هيئة مؤسسية تجمع مختلف الآراء والخبرات وتشرك المجتمع في بلورة السياسات القضائية وتحديثها." },
      { fr: "Cadre institutionnel de réflexion", ar: "إطار مؤسسي للتفكير", explanation: "فضاء منظم ومنسق يسهل الحوار الفكري وتبادل الآراء العلمية والخبرات بطرق علمية." },
      { fr: "Respect des prérogatives", ar: "احترام لصلاحيات", explanation: "الالتزام بالحدود القانونية والمهام الدستورية المسندة لكل سلطة وجهاز في الدولة صوناً لمبدأ فصل السلط." }
    ],
    analysis: "تأكيد جلالة الملك على إنشاء 'هيئة استشارية قارة تعددية وتمثيلية' (instance consultative, pluraliste et représentative) كفضاء للتشاور والتبادل (échange de savoir-faire) مع صون استقلال السلطة القضائية."
  },
  {
    id: 6,
    title: "العدل أساس الملك وخارطة طريق الإصلاح",
    ar: "إننا نعتبر القضاء عمادا لما نحرص عليه من مساواة المواطنين أمام القانون، وملاذا للإنصاف الموطد للاستقرار الاجتماعي، بل إن قوة شرعية الدولة نفسها، وحرمة مؤسساتها من قوة العدل الذي هو أساس الملك. لذا ، قررنا إعطاء دفعة جديدة وقوية لإصلاحه. وذلك وفق خارطة طريق واضحة في مرجعياتها ، طموحة في أهدافها، محددة في أسبقياتها ، ومضبوطة في تفعيلها .",
    fr: "La justice représente, à Nos yeux, la clef de voûte pour la concrétisation d'un principe auquel Nous sommes particulièrement attaché, à savoir l'égalité des citoyens devant la loi. Elle constitue le recours et le gage de l'équité, comme facteur de consolidation de la stabilité sociale. Mieux encore, la légitimité même de l'Etat et l'inviolabilité de ses institutions puisent leur force dans celle de la justice qui constitue le fondement même du pouvoir. Aussi avons-Nous décidé de donner une nouvelle et forte impulsion à la réforme de la justice, suivant une feuille de route claire dans son référentiel, ambitieuse dans ses objectifs, précise dans ses priorités et rigoureuse dans ses mécanismes d'application",
    vocabulary: [
      { fr: "Clef de voûte", ar: "عمادا ومحورا", explanation: "حجر الزاوية أو المرتكز الأساسي والهيكلي الذي يستند إليه النظام والعدالة في الدولة." },
      { fr: "Inviolabilité de ses institutions", ar: "حرمة مؤسساتها", explanation: "صون هيبة ومكانة وقدسية المؤسسات الدستورية ضد أي استهتار أو تجاوز لقوانينها." },
      { fr: "Fondement même du pouvoir", ar: "أساس الملك", explanation: "القاعدة الأزلية والجوهرية لثبات شرعية السلطة والحكم واستقرار الدولة وسلامتها." },
      { fr: "Feuille de route", ar: "خارطة طريق", explanation: "البرنامج الزمني والعملي المحدد لتنفيذ مخطط الإصلاح بوضوح وبوسائل دقيقة." }
    ],
    analysis: "يربط جلالة الملك بين القضاء وكونه 'العدل أساس الملك' بتعبير بليغ جداً في الفرنسية: 'la justice qui constitue le fondement même du pouvoir'، معلناً عن 'خارطة طريق' (feuille de route) واضحة المعالم."
  },
  {
    id: 7,
    title: "القضاء من وظائف إمارة المؤمنين ورعاية الملك",
    ar: "وفي صدارة المرجعيات ثوابت الأمة، القائمة على كون القضاء من وظائف إمارة المؤمنين، وأن الملك هو المؤتمن على ضمان استقلال السلطة القضائية. كما ينبغي، في هذا الصدد، الأخذ بعين الاعتبار، مختلف المقترحات والتوصيات الوطنية الوجيهة، وكذا الخلاصات البناءة المشروع وزارة العدل، ولاستشاراتها الموسعة فضلا عن الالتزامات الدولية للمملكة.",
    fr: "Viennent, en tête de ce référentiel, les constantes de la Nation selon lesquelles la justice est du ressort de la Commanderie des Croyants, et le Roi est le Garant de l'indépendance du pouvoir judiciaire. A cet égard, il importe également de prendre en considération les différentes propositions et recommandations nationales pertinentes, ainsi que les conclusions constructives dégagées du projet du ministère de la justice et des larges consultations initiées par lui. Il en est de même des engagements internationaux souscrits par le Royaume.",
    vocabulary: [
      { fr: "Commanderie des Croyants", ar: "إمارة المؤمنين", explanation: "الصفة الشرعية والدينية السامية التي تمنح جلالة الملك ولاية حماية الملة والدين والعدل وحماية حقوق الأفراد." },
      { fr: "Garant de l'indépendance", ar: "المؤتمن على ضمان استقلال", explanation: "الدور الدستوري السامي لملك البلاد في كفالة وحفظ استقلالية القضاء وحمايته من التداخلات." },
      { fr: "Engagements internationaux souscrits", ar: "الالتزامات الدولية للمملكة", explanation: "المعاهدات والاتفاقيات الدولية التي التزم بها المغرب كعضو نشيط ومسؤول في المجتمع الدولي." }
    ],
    analysis: "القضاء من وظائف 'إمارة المؤمنين' (Commanderie des Croyants) والملك هو الضامن الدستوري (le Garant) لاستقلاله، مع مراعاة المقترحات الوطنية والالتزامات الدولية (engagements internationaux)."
  },
  {
    id: 8,
    title: "أهداف الإصلاح ومحاوره الاستراتيجية الستة",
    ar: "أما الأهداف المنشودة، فهي توطيد الثقة والمصداقية في قضاء فعال ومنصف باعتباره حصنا منيعا لدولة الحق، وعمادا للأمن القضائي، والحكامة الجيدة، ومحفزا للتنمية، وكذا تأهيله ليواكب التحولات الوطنية والدولية، ويستجيب لمتطلبات عدالة القرن الحادي والعشرين. ولتحقيق هذه الأهداف الكبرى، ندعو الحكومة إلى بلورة مخطط متكامل ومضبوط، يجسد العمق الاستراتيجي للإصلاح، في محاور أساسية، وهي",
    fr: "Quant aux objectifs visés par cette réforme, il s'agit de consolider la confiance dans une justice efficiente et équitable et d'en conforter la crédibilité, tant il est vrai qu'elle constitue un rempart inexpugnable pour la défense de l'Etat de droit, un fondement essentiel de la sécurité judiciaire et de la bonne gouvernance et un facteur d'impulsion du développement. L'on doit également veiller à assurer la mise à niveau de ce secteur pour lui permettre d'être au diapason des mutations qui s'opèrent à l'échelle nationale et internationale et de répondre aux exigences de la justice du vingt-et-unième siècle. Afin de donner corps à ces grands desseins, Nous appelons le gouvernement à élaborer le plan d'une réforme globale et profonde de la justice, un plan intégré et précis, propre à refléter la profondeur stratégique de la réforme. Ce plan devrait se décliner en six axes majeurs, en l'occurrence",
    vocabulary: [
      { fr: "Rempart inexpugnable", ar: "حصنا منيعا", explanation: "الدرع القوي غير القابل للاختراق أو التجاوز لحماية دولة القانون وحقوق الأفراد والعدالة الاجتماعية." },
      { fr: "Sécurité judiciaire", ar: "الأمن القضائي", explanation: "ضمان جودة وتوقع الأحكام القضائية واستقرار المراكز القانونية للمواطنين والشركاء الاقتصاديين." },
      { fr: "Bonne gouvernance", ar: "الحكامة الجيدة", explanation: "الأسلوب الراشد لإدارة مرفق العدالة استناداً للشفافية والكفاءة وربط المسؤولية بالمحاسبة والنزاهة الميدانية." },
      { fr: "Au diapason des mutations", ar: "يواكب التحولات", explanation: "الانسجام والتناغم التام والسريع مع المتغيرات الاقتصادية والاجتماعية والتكنولوجية المعاصرة." }
    ],
    analysis: "يتجلى القضاء كـ 'rempart inexpugnable' (حصن منيع) لدولة الحق، وهو ركيزة أساسية للأمن القضائي (sécurité judiciaire) والحكامة الجيدة (bonne gouvernance). ويدعو جلالته الحكومة لوضع مخطط متكامل بستة محاور."
  },
  {
    id: 9,
    title: "المحاور الستة الكبرى للإصلاح",
    ar: "تعزيز ضمانات استقلال القضاء وتحديث المنظومة القانونية، وتأهيل الهياكل والموارد البشرية والرفع من النجاعة القضائية وترسيخ التخليق، وحسن التفعيل",
    fr: "La consolidation des garanties de l'indépendance de la justice,. La modernisation de son cadre normatif,. La mise à niveau de ses structures et de ses ressources humaines,. - L'amélioration de l'efficience judiciaire,. - L'ancrage des règles de moralisation de la justice, - La mise en œuvre optimale de la réforme.",
    vocabulary: [
      { fr: "Cadre normatif", ar: "المنظومة القانونية / الإطار المعياري", explanation: "مجموع القوانين والقواعد والمساطر واللوائح المنظمة لمختلف مجالات الحياة والنشاط القضائي والاجتماعي." },
      { fr: "Efficience judiciaire", ar: "النجاعة القضائية", explanation: "سرعة ودقة وجودة الفصل في القضايا وتنفيذ الأحكام بأقل جهد وتكلفة ممكنة مع صون الحقوق." },
      { fr: "Moralisation de la justice", ar: "تخليق القضاء", explanation: "ترسيخ مبادئ النزاهة والضمير المهني ومكافحة كل مظاهر الانحراف والرشوة والفساد الإداري." },
      { fr: "Mise en œuvre optimale", ar: "حسن التفعيل والتحقيق الأكمل", explanation: "تطبيق بنود ومشاريع الإصلاح بأفضل الطرق والبرامج لضمان النتائج الإيجابية المرجوة للمواطنين." }
    ],
    analysis: "المحاور الستة تلخص استراتيجية عصرنة القضاء المغربي: الاستقلال، تحديث الإطار المعياري (cadre normatif)، التأهيل، النجاعة (efficience)، التخليق (moralisation)، والتفعيل الأمثل."
  },
  {
    id: 10,
    title: "المجالات الستة ذات الأسبقية الفورية",
    ar: "شعبي العزيز مهما كانت وجاهة الأهداف الاستراتيجية التي يمتد إنجازها على المدى البعيد ، فلا ينبغي أن تحجب عنا حاجة المواطنين الملحة في أن يلمسوا عن قرب، وفي الأمد المنظور الأثر الإيجابي المباشر للإصلاح. لذا، نوجه الحكومة، وخاصة وزارة العدل للشروع في تفعيله في ستة مجالات، ذات أسبقية.",
    fr: "Cher peuple,. Quelle que soit la pertinence des objectifs stratégiques tracés, dont la réalisation s'étale sur le long terme, cela ne devrait pas occulter pour nous le besoin pressant des citoyens de sentir de près, et à brève échéance, l'impact positif direct de la réforme. A cet effet, Nous donnons Nos Hautes Directives au gouvernement, notamment au ministère de la justice, pour amorcer la mise en œuvre de cette réforme dans six domaines d'action prioritaires.",
    vocabulary: [
      { fr: "Besoin pressant des citoyens", ar: "حاجة المواطنين الملحة", explanation: "الطلبات الحيوية والفورية لأفراد المجتمع التي لا تقبل التأخير أو التسويف والمماطلة الإدارية." },
      { fr: "À brève échéance", ar: "في الأمد المنظور / القريب", explanation: "تحقيق نتائج وإجراءات ملموسة وعاجلة يشعر بها المواطن في حياته اليومية دون انتظار طويل." },
      { fr: "Hautes Directives", ar: "توجيهاتنا السامية", explanation: "التعليمات والتوجيهات الملكية العليا الواجبة التفعيل الفوري من لدن الحكومة والسلطات العمومية." }
    ],
    analysis: "يؤكد جلالة الملك أن المخططات بعيدة المدى لا يجب أن تشغلنا عن 'حاجة المواطنين الملحة' (besoin pressant) ليشعروا بالأثر الإيجابي بصفة عاجلة (à brève échéance) عبر 6 مجالات ذات أسبقية."
  },
  {
    id: 11,
    title: "أولاً: دعم استقلال القضاء وتمثيلية المرأة ومراجعة النظام الأساسي",
    ar: "أولا دعم ضمانات الاستقلالية: وذلك بإيلاء المجلس الأعلى للقضاء المكانة الجديرة به، كمؤسسة دستورية قائمة الذات، وتحويله، حصريا ، الصلاحيات اللازمة، لتدبير المسار المهني للقضاة، وإعادة النظر في طريقة انتخابه، بما يكفل لعضويته الكفاءة والنزاهة، ويضمن تمثيلية نسوية مناسبة لحضور المرأة في سلك القضاء، فضلا عن عقلنة تسيير عمله. وفي نفس الإطار، يجدر مراجعة النظام الأساسي للقضاة، في اتجاه تعزيز الاحترافية والمسؤولية والتجرد، ودينامية الترقية المهنية، وذلك في ارتباط مع إخراج القانون الأساسي لكتاب الضبط، وإعادة النظر في الإطار القانوني المنظم لمختلف المهن القضائية.",
    fr: "Premièrement : La consolidation des garanties de l'indépendance de la Justice, en assurant au Conseil supérieur de la Magistrature un statut digne de son rang en tant qu'institution constitutionnelle à part entière. Il importe, à cet égard, de lui conférer de manière exclusive les attributions nécessaires à la gestion de la carrière des magistrats. Il s'agit également de revoir le mode d'élection de ses membres pour garantir qu'ils satisfont aux critères de compétence et d'intégrité requises. Il faudrait aussi y introduire une représentation féminine reflétant adéquatement la place de la femme magistrat dans notre système judiciaire. Par ailleurs, le fonctionnement du Conseil devrait faire l'objet d'une plus grande rationalisation. Dans le même cadre de consolidation de l'indépendance de la justice, il convient de procéder à la révision du Statut de la Magistrature dans le sens d'une professionnalisation et d'une responsabilisation accrues et pour une impartialité plus élevée et une meilleure dynamique de promotion professionnelle. Cette action doit être menée en relation avec l'élaboration d'un Statut du Greffe et la révision du cadre juridique régissant les différentes professions judiciaires.",
    vocabulary: [
      { fr: "À part entière", ar: "قائمة الذات", explanation: "المستقلة تماماً في كيانها الدستوري وصلاحياتها وقراراتها دون تبعية لأي سلطة أخرى." },
      { fr: "Représentation féminine", ar: "تمثيلية نسوية مناسبة", explanation: "ضمان وجود القاضيات في هيئات وعضوية المجلس الأعلى للقضاء لتعزيز مبدأ المساواة في القرار القضائي." },
      { fr: "Impartialité", ar: "التجرد والحياد", explanation: "ابتعاد القاضي التام عن الميول الشخصية أو التأثيرات الخارجية لإصدار حكم موضوعي عادل وصادق." },
      { fr: "Statut du Greffe", ar: "القانون الأساسي لكتاب الضبط", explanation: "المنظومة القانونية المنظمة لمهام وحقوق وواجبات موظفي هيئة كتابة الضبط الفاعلين في المحاكم." }
    ],
    analysis: "يركز هذا المحور على مأسسة 'المجلس الأعلى للقضاء' (Conseil supérieur de la Magistrature) كمؤسسة قائمة الذات (à part entière) وتوفير تمثيلية نسوية مناسبة (représentation féminine) ومراجعة النظام الأساسي للقضاة وكتاب الضبط (Statut du Greffe)."
  },
  {
    id: 12,
    title: "ثانياً: تحديث القوانين وتطوير السياسة الجنائية وبدائل القضاء",
    ar: "ثانيا تحديث المنظومة القانونية : ولا سيما ما يتعلق منها بمجال الأعمال والاستثمار وضمان شروط المحاكمة العادلة. وهو ما يتطلب نهج سياسة جنائية جديدة، تقوم على مراجعة وملاءمة القانون والمسطرة الجنائية، ومواكبتهما للتطورات، بإحداث مرصد وطني للإجرام، وذلك في تناسق مع مواصلة تأهيل المؤسسات الإصلاحية والسجنية. وبموازاة ذلك، يتعين تطوير الطرق القضائية البديلة، كالوساطة والتحكيم والصلح، والأخذ بالعقوبات البديلة، وإعادة النظر في قضاء القرب.",
    fr: "Deuxièmement : La modernisation du cadre normatif, notamment pour ce qui se rattache aux affaires et aux investissements, ainsi que la garantie des conditions du procès équitable. Il est, donc, nécessaire d'adopter une nouvelle politique pénale fondée sur la révision et l'adéquation du Code pénal et du Code de procédure pénale. En outre, et afin de mettre ces deux codes et leurs différents dispositifs au diapason des évolutions en cours, il importe notamment de procéder la création d'un Observatoire national de la criminalité, et ce, en synergie avec la poursuite du processus de mise à niveau des établissements pénitentiaires et de réforme. Parallèlement, il convient de développer des modes alternatifs de règlement des différends comme la médiation, l'arbitrage et la conciliation, d'appliquer les peines de substitution et de revoir la justice de proximité.",
    vocabulary: [
      { fr: "Procès équitable", ar: "المحاكمة العادلة", explanation: "الضمانة الدستورية والحقوقية الأساسية التي تمنح للمتهم كافة سبل الدفاع وحماية حقوقه الجسدية والمعنوية طيلة أطوار الدعوى." },
      { fr: "Politique pénale", ar: "السياسة الجنائية", explanation: "الخطة الاستراتيجية المعتمدة من الدولة للوقاية من الجريمة ومكافحتها ومعاملة الجناة وتأهيلهم." },
      { fr: "Observatoire national de la criminalité", ar: "مرصد وطني للإجرام", explanation: "مؤسسة علمية متخصصة في رصد وتتبع تطور الجريمة وتحليل الظواهر الإجرامية واقتراح حلول تشريعية لها." },
      { fr: "Peines de substitution", ar: "العقوبات البديلة", explanation: "تدابير وبدائل لفرص العقوبة السالبة للحرية (مثل الخدمة للمنفعة العامة) للتأهيل الاجتماعي للجناة وسد الخصاص." }
    ],
    analysis: "يطالب جلالته بـ 'سياسة جنائية جديدة' (nouvelle politique pénale) وعصرنة القوانين وتوفير شروط 'المحاكمة العادلة' (procès équitable)، موازاةً مع إقرار 'الوسائل البديلة لفض المنازعات' (modes alternatifs) و'العقوبات البديلة' (peines de substitution)."
  },
  {
    id: 13,
    title: "ثالثاً: حكامة الهياكل واللاتمركز وتفعيل التفتيش",
    ar: "ثالثا تأهيل الهياكل القضائية والإدارية وذلك بنهج حكامة جديدة للمصالح المركزية لوزارة العدل وللمحاكم، تعتمد اللاتمركز، لتمكين المسؤولين القضائيين من الصلاحيات اللازمة، بما في ذلك تفعيل التفتيش الدوري والخاص، بكل حزم وتجرد ، وكذا اعتماد خريطة وتنظيم قضائي عقلاني، مستجيب لمتطلبات الإصلاح.",
    fr: "Troisièmement : La modernisation des structures judiciaires et administratives : Il s'agit, à cet égard, d'adopter une nouvelle gouvernance de l'administration centrale du ministère de la justice et des tribunaux, sur la base du principe de la déconcentration qui devrait permettre aux responsables judiciaires de disposer des compétences nécessaires à l'exercice de leurs fonctions, y compris le recours à l'inspection périodique et à l'inspection spéciale avec fermeté et impartialité. Il importe aussi d'adopter une carte et une organisation judiciaires rationalisées, répondant aux exigences de la réforme.",
    vocabulary: [
      { fr: "Déconcentration", ar: "اللاتمركز", explanation: "تفويض الصلاحيات الإدارية والمالية والتقنية من الإدارات المركزية إلى المسؤولين والتمثيليات الجهوية لتسريع اتخاذ القرار الميداني." },
      { fr: "Inspection périodique et spéciale", ar: "التفتيش الدوري والخاص", explanation: "آلية لمراقبة وتدقيق عمل المحاكم والمسؤولين للتأكد من حسن سير المرفق ومنع ارتكاب الأخطاء الجسيمة." },
      { fr: "Organisation judiciaire rationalisée", ar: "تنظيم قضائي عقلاني", explanation: "ملاءمة خريطة توزيع المحاكم واختصاصاتها الجغرافية والنوعية مع الواقع التنموي والسكاني والاجتماعي للبلاد." }
    ],
    analysis: "يؤكد هذا المحور على اعتماد مبدأ 'اللاتمركز' (déconcentration) لتسهيل مأمورية المسؤولين القضائيين، وإعمال التفتيش (inspection) بحزم وتجرد، لبلوغ حكامة عقلانية (nouvelle gouvernance)."
  },
  {
    id: 14,
    title: "رابعاً: تأهيل الموارد البشرية وتحسين الوضع المادي والاجتماعي",
    ar: "رابعا تأهيل الموارد البشرية : تكوينا وأداء وتقويما، مع العمل على تحسين الأوضاع المادية للقضاة وموظفي العدل، وإيلاء الاهتمام اللازم للجانب الاجتماعي، بتفعيل المؤسسة المحمدية، تجسيدا لرعايتنا الدائمة لأسرة القضاء.",
    fr: "Quatrièmement : La mise à niveau des ressources humaines, aux plans formation, performance et évaluation. Il faudrait également veiller à la revalorisation de la situation matérielle des magistrats et du personnel de la justice et attacher au volet social toute l'importance requise, notamment par la mise en place de la Fondation Mohammedia des œuvres sociales des magistrats et des fonctionnaires de la Justice. Ainsi sera illustrée de nouveau la bienveillante et constante sollicitude que Nous réservons à la famille de la justice.",
    vocabulary: [
      { fr: "Revalorisation de la situation matérielle", ar: "تحسين الأوضاع المادية", explanation: "الارتقاء بالرواتب والتعويضات والبدلات لضمان عيش كريم للقضاة والموظفين وتحصينهم مادياً ومكافحة الانحراف." },
      { fr: "Fondation Mohammedia des œuvres sociales", ar: "المؤسسة المحمدية للأعمال الاجتماعية", explanation: "المؤسسة الملكية المتخصصة في تقديم وتجويد الخدمات الاجتماعية والصحية والسكنية والترفيهية لمنتسبي العدالة." },
      { fr: "Bienveillante sollicitude", ar: "الرعاية الدائمة والسامية", explanation: "الاهتمام والعناية الملكية والربانية المستمرة بظروف ومكتسبات وحقوق أسرة القضاء قضاة وموظفين." }
    ],
    analysis: "الجانب الاجتماعي والمادي ركيزة الاستقلال المهني للقضاة، حيث دعا جلالته لـ 'revalorisation de la situation matérielle' وتفعيل 'المؤسسة المحمدية' (Fondation Mohammedia) تجسيداً للرعاية الملكية (bienveillante sollicitude)."
  },
  {
    id: 15,
    title: "خامساً: النجاعة القضائية، تبسيط المساطر وتسهيل الولوج",
    ar: "خامسا الرفع من النجاعة القضائية للتصدي لما يعانيه المتقاضون من هشاشة وتعقيد وبطء العدالة. وهذا ما يقتضي تبسيط وشفافية المساطر، والرفع من جودة الأحكام، والخدمات القضائية، وتسهيل ولوج المتقاضين إلى المحاكم، وتسريع وتيرة معالجة الملفات، وتنفيذ الأحكام.",
    fr: "Cinquièmement : L'amélioration de l'efficience judiciaire par la lutte contre les précarités, lenteurs et autres complexités qui handicapent le système judiciaire, et portent préjudice aux justiciables. Pour cela, il est nécessaire de simplifier les procédures et d'en garantir la transparence, d'améliorer la qualité des jugements et des prestations judiciaires et de faciliter l'accès des justiciables aux différentes juridictions du pays. Il importe aussi d'assurer une diligence accrue dans le traitement des dossiers et une plus grande célérité dans l'exécution des décisions de justice.",
    vocabulary: [
      { fr: "Justiciables", ar: "المتقاضون", explanation: "المواطنون والأشخاص والمؤسسات الذين يلجؤون للمحاكم والعدالة للمطالبة بحقوقهم أو فض خلافاتهم القانونية." },
      { fr: "Diligence accrue", ar: "دقة ووتيرة سريعة ومثابرة", explanation: "السرعة المعقولة والاجتهاد الحثيث والدقيق في دراسة وحسم القضايا دون مماطلة." },
      { fr: "Célérité dans l'exécution", ar: "تسريع وتيرة تنفيذ الأحكام", explanation: "تنزيل القرارات والأحكام القضائية الصادرة عن المحاكم على أرض الواقع فوراً وبقوة القانون دون عراقيل." }
    ],
    analysis: "تُرجم 'المتقاضون' بـ 'justiciables'، وتهدف 'النجاعة القضائية' (efficience judiciaire) إلى القضاء على بطء العدالة (lenteurs judiciaire) عبر التبسيط والسرعة في التنفيذ (célérité dans l'exécution)."
  },
  {
    id: 16,
    title: "سادساً: تخليق القضاء ومحاربة الرشوة واستغلال النفوذ",
    ar: "سادسا تخليق القضاء لتحصينه من الارتشاء واستغلال النفوذ ، ليساهم بدوره في تخليق الحياة العامة بالطرق القانونية.",
    fr: "Sixièmement : La moralisation de la justice pour la prémunir contre les tentations de corruption et d'abus de pouvoir et lui permettre, à son tour, de contribuer, par les moyens juridiques, à la moralisation de la vie publique.",
    vocabulary: [
      { fr: "Moralisation de la justice", ar: "تخليق القضاء", explanation: "النهوض بالقيم والأخلاقيات لمنتسبي العدالة والتمسك بالأمانة والاستقامة والنزاهة المطلقة." },
      { fr: "Corruption", ar: "الارتشاء", explanation: "آفة تقديم أو طلب مبالغ مالية أو هدايا أو امتيازات مقابل تقديم خدمة أو تحوير مجرى العدالة بالباطل." },
      { fr: "Abus de pouvoir", ar: "استغلال النفوذ", explanation: "استخدام المنصب أو الجاه أو النفوذ الوظيفي لفرض قرارات أو تحقيق مآرب وأغراض شخصية بشكل غير مشروع." }
    ],
    analysis: "الضمير الأخلاقي أساس العدالة؛ فـ 'moralisation' (التخليق) درع لحماية القضاء من 'corruption' (الارتشاء) واستغلال النفوذ (abus de pouvoir)، مما يساهم في تخليق الحياة العامة عموماً."
  },
  {
    id: 17,
    title: "المحك الحقيقي للإصلاح والمسؤولية المركزية",
    ar: "شعبي العزيز إن المحك الحقيقي لهذا الإصلاح الجوهري، لا يكمن في مجرد وضعه، وإنما في القدرة على حسن تفعيله وتدبيره، وهو ما ينبغي أن يتم على صعيدين. فعلى المستوى المركزي، نؤكد أن مسؤولية تفعيل هذا الإصلاح، والإشراف عليه، منوطة بالحكومة، وخاصة وزارة العدل، وذلك وفق برامج محددة في أهدافها ومراحلها ، ومضبوطة في وسائل التنفيذ والمتابعة والتقويم.",
    fr: "Pour juger de la pertinence réelle de cette réforme substantielle, il faudra, non seulement en évaluer la teneur, mais juger également de la capacité à en assurer une mise en œuvre optimale et un pilotage efficient. Ce travail doit être mené à deux niveaux. Au niveau central, Nous réaffirmons que la mise en œuvre et le pilotage de cette réforme incombent au gouvernement, notamment le ministère de la justice. Cette responsabilité doit être assumée selon des programmes précis dans leurs objectifs, leur calendrier et leurs moyens d'exécution, de suivi et d'évaluation.",
    vocabulary: [
      { fr: "Pilotage efficient", ar: "حسن تفعيل وتدبير الإصلاح", explanation: "القيادة والتوجيه والتتبع المستمر لمشروعات المخطط الإصلاحي لضمان السير السلس نحو الأهداف." },
      { fr: "Incombent au gouvernement", ar: "منوطة بالحكومة", explanation: "مسندة بمسؤوليتها الدستورية والسياسية والتنفيذية للجهاز التنفيذي لتنزيلها وحوكمتها فعلياً." },
      { fr: "Moyens d'exécution, de suivi et d'évaluation", ar: "وسائل التنفيذ والمتابعة والتقويم", explanation: "الآليات المادية والمنهجية لقياس نسب الإنجاز ورصد وتصحيح الاختلالات والصعوبات الميدانية." }
    ],
    analysis: "المحك الحقيقي لـ 'réforme substantielle' يكمن في 'القدرة على حسن تفعيلها وتدبيرها' (pilotage efficient et mise en œuvre)، وهي مسؤولية 'منوطة بالحكومة' (incombent au gouvernement)."
  },
  {
    id: 18,
    title: "تعبئة شاملة ودورة خاصة للمجلس الأعلى للقضاء",
    ar: "أما على صعيد المحاكم، فإن نجاح الإصلاح يظل رهينا بانتهاج عدم التمركز وبتوافر الكفاءات اللازمة. ولهذه الغاية، ندعو المجلس الأعلى للقضاء، لعقد دورة خاصة، لاقتراح المسؤولين القضائيين بالمحاكم، المؤهلين للنهوض الميداني بهذا الإصلاح الحاسم. إن الأمر يتعلق بورش شاق وطويل يتطلب تعبئة شاملة ، لا تقتصر على أسرة القضاء والعدالة، وإنما تشمل كافة المؤسسات والفعاليات، بل وكل المواطنين.",
    fr: "Au niveau des tribunaux, le succès de la réforme demeure tributaire de la mise en œuvre du principe de la déconcentration et de la disponibilité des compétences nécessaires à cet effet. Aussi, appelons-Nous le Conseil supérieur de la Magistrature à tenir une session spéciale pour proposer des responsables judiciaires aptes à prendre en charge, à l'échelle des tribunaux, la mise en œuvre pratique de cette réforme décisive. C'est un chantier ardu et de longue haleine, qui exige une mobilisation générale, non seulement au sein de la famille de la justice et de la magistrature, mais aussi parmi les institutions et les forces vives du pays, voire tous les citoyens.",
    vocabulary: [
      { fr: "Tributaire", ar: "رهيناً بـ", explanation: "معلقاً حدوثه ونجاحه بشكل كلي وحاسم على توفر شرط أو عامل أساسي (عدم التمركز هنا)." },
      { fr: "Session spéciale", ar: "دورة خاصة للمجلس", explanation: "اجتماع غير اعتيادي ومحدد الأجندة يعقده المجلس لمناقشة ملفات مستعجلة وعالية الأهمية والخطورة." },
      { fr: "Mobilisation générale", ar: "تعبئة شاملة", explanation: "تظافر وتضافر جهود كافة الفاعلين والمواطنين والمؤسسات لإنجاح الأوراش والخطط الوطنية الكبرى." },
      { fr: "Forces vives du pays", ar: "الفعاليات الحية للبلاد", explanation: "الجمعيات والنخب والمجتمع المدني والأشخاص النشيطون المساهمون في الرقي والوعي والتنمية والعدل." }
    ],
    analysis: "تأكيد جلالة الملك على أن نجاح الإصلاح في المحاكم 'تنزيل ميداني' يقتضي 'دورة خاصة' (session spéciale) للمجلس الأعلى، مع تفعيل 'تعبئة شاملة' (mobilisation générale) تشمل 'القوى الحية' (forces vives du pays)."
  },
  {
    id: 19,
    title: "القضاء حجر الزاوية للديمقراطية والمواطنة والعدالة الشاملة",
    ar: "وإننا لنعتبر الإصلاح الجوهري للقضاء حجر الزاوية في ترسيخ الديمقراطية والمواطنة لدى شبابنا وأجيالنا الحاضرة والصاعدة لذا ، ننتظر من الجميع الانخراط القوي في كسب هذا الرهان الحيوي، بنفس روح الثورة الدائمة للملك والشعب على درب استكمال بناء مغرب العدالة التي نريدها شاملة، بأبعادها القضائية والمجالية والاجتماعية أوفياء، في ذلك، للذكرى الخالدة لجدنا ووالدنا المنعمين جلالة الملكين محمد الخامس والحسن الثاني، ولشهداء التحرير والوحدة، أكرم الله مثواهم. إن الله يأمركم أن تؤدوا الأمانات إلى أهلها وإذا حكمتم بين الناس أن تحكموا بالعدل». صدق الله والعظيم. والسلام عليكم ورحمة الله تعالى وبركاته ..",
    fr: "Nous sommes profondément convaincu que la réforme substantielle de la justice est la pierre angulaire sur laquelle reposent la consolidation de la démocratie et l'ancrage des valeurs citoyennes chez les jeunes et les générations montantes dans notre pays. Aussi, nous attendons-Nous à ce que chacun, animé de l'esprit pérenne de la Révolution du Roi et du Peuple, adhère pleinement à l'effort engagé pour gagner ce pari vital et s'associe à la marche que Nous conduisons afin de doter le Maroc d'une justice globale et forte de ses composantes judiciaire, spatiale et sociale. Nous demeurerons ainsi fidèles à la mémoire indélébile de Nos vénérés Grand-père et Père, feu Leurs Majestés les Rois Mohammed V et Hassan II, ainsi que des martyrs de la lutte pour la libération et l'unité du pays, que Dieu ait leurs âmes. 'Dieu vous prescrit de restituer les dépôts à leurs propriétaires et de vous montrer équitables quand vous êtes appelés à juger vos semblables. C'est là une noble mission que Dieu vous exhorte à remplir. Dieu entend tout, voit tout.' Véridique est la parole de Dieu. Wassalamou alaikoum warahmatoullahi wabarakatouh.",
    vocabulary: [
      { fr: "Pierre angulaire", ar: "حجر الزاوية", explanation: "الأساس البنيوي المتين الذي ينطلق منه أو يعتمد ويستند عليه أي مشروع أو بناء سياسي واجتماعي وطني." },
      { fr: "Ancrage des valeurs citoyennes", ar: "ترسيخ قيم المواطنة", explanation: "تثبيت وتوطيد وعي ومبادئ الانتماء والالتزام بالقوانين والحقوق في وجدان الأجيال والشباب." },
      { fr: "Justice globale", ar: "عدالة شاملة بأبعادها", explanation: "العدالة المتكاملة التي تمتد لتشمل البعد القضائي، البعد المجالي المتوازن، والبعد الاجتماعي لخدمة الفئات المستضعفة." },
      { fr: "Mémoire indélébile", ar: "الذكرى الخالدة", explanation: "الوفاء والذكرى الراسخة غير القابلة للنسيان لقادة وأبطال معركة الاستقلال والبناء والتنمية للوطن." }
    ],
    analysis: "يُتوج الخطاب الملكي بالإعلان عن أن إصلاح القضاء هو 'حجر الزاوية' (pierre angulaire) للديمقراطية، ويحث المواطنين والشباب على الانخراط في 'مغرب العدالة الشاملة' (justice globale) مستشهداً بالتوجيه القرآني العظيم."
  }
];

const SPEECH_SECTIONS_2012: SpeechSection[] = [
  {
    id: 1,
    title: "تنصيب الهيئة العليا للحوار الوطني لإصلاح منظومة العدالة",
    ar: "الحمد لله والصلاة والسلام على مولانا رسول الله وآله وصحبه، حضرات السيدات والسادة، يطيب لنا أن نتولى تنصيب أعضاء الهيئة العليا للحوار الوطني حول الإصلاح العميق والشامل لمنظومة العدالة.",
    fr: "Louange à Dieu, Prière et salut sur le Prophète, Sa famille et Ses compagnons. Mesdames, Messieurs. Nous sommes heureux de procéder à l'installation de la haute Instance du dialogue national sur la réforme profonde et globale du système judiciaire.",
    vocabulary: [
      { fr: "Procéder à l'installation", ar: "أن نتولى تنصيب", explanation: "الإجراء البروتوكولي والعملي الرسمي للبدء الفعلي لمهام هيئة أو مؤسسة وطنية جديدة." },
      { fr: "Haute Instance", ar: "الهيئة العليا", explanation: "لجنة أو هيئة وطنية رفيعة المستوى تضم شخصيات وازنة يعهد إليها بمهمة استراتيجية." },
      { fr: "Réforme profonde et globale", ar: "الإصلاح العميق والشامل", explanation: "تغيير هيكلي وجذري يطال كل أجزاء ومفاصل النظام المستهدف دون استثناء." }
    ],
    analysis: "يبرز في مستهل الخطاب الأسلوب الملكي الرسمي في تنصيب الهيئة العليا (installation de la haute Instance)، مؤكداً على الطابع الاستراتيجي والشمولي لورش إصلاح منظومة العدالة (système judiciaire)."
  },
  {
    id: 2,
    title: "الرعاية الملكية السامية والعدل كقوام دولة الحق والقانون",
    ar: "وقد أبينا إلا أن نضفي رعايتنا السامية على هذا الحوار، اعتبارا للعناية الفائقة التي ما فتئنا نوليها لهذا الإصلاح الجوهري الذي جعلناه في صدارة الأوراش الإصلاحية الكبرى التي نقودها ، إيمانا منا بأن العدل هو قوام دولة الحق والمؤسسات وسيادة القانون التي نحن لها ضامنون، وتحفيز الاستثمار والتنمية التي نحن على تحقيقها عاملون.",
    fr: "Nous avons tenu à ce que ce dialogue s'instaure sous notre Haut Patronage, réaffirmant ainsi Notre attachement fort et constant à cette réforme substantielle, que Nous avons inscrite en tête des grands chantiers des réformes menées sous Notre impulsion. Nous sommes, en effet, convaincu que la justice est le socle sur lequel repose l'Etat de droit et des institutions. Elle est fondamentale pour faire prévaloir la suprématie de la loi, dont Nous sommes le Garant, ainsi que pour inciter à l'investissement et stimuler le développement dont Nous nous employons à faire une réalité tangible.",
    vocabulary: [
      { fr: "Sous notre Haut Patronage", ar: "تحت رعايتنا السامية", explanation: "الرعاية والاهتمام الملكي المباشر الذي يضفي طابعاً سيادياً وأهمية وطنية قصوى على المشروع." },
      { fr: "Socle", ar: "قوام وملاذ", explanation: "القاعدة المتينة والركيزة الأساسية التي يستند عليها البناء المؤسساتي والحقوقي للدولة." },
      { fr: "Inciter à l'investissement", ar: "تحفيز الاستثمار", explanation: "توفير مناخ قضائي وقانوني آمن يشجع رؤوس الأموال الوطنية والأجنبية على الاستقرار بالمملكة." }
    ],
    analysis: "يربط جلالة الملك بصفة مباشرة بين القضاء كـ 'socle' (قوام) لدولة الحق والإنصاف، وبين التنمية والقدرة على 'تحفيز الاستثمار' (inciter à l'investissement)، مما يجعل الأمن القضائي محركاً اقتصادياً بامتياز."
  },
  {
    id: 3,
    title: "المرجعيات التاريخية ومخطط الإصلاح في خطابي 2008 و2009",
    ar: "وقد سبق لنا في خطاب العرش لسنة 2008 أن دعونا لحوار واسع لبلورة مخطط مضبوط للإصلاح العميق للقضاء. كما حددنا المحاور الأساسية لهذا الإصلاح في خطابنا الموجه للأمة في 20 غشت 2009",
    fr: "II Nous a déjà été donné, à l'occasion du Discours du Trône de 2008, d'appeler à un dialogue élargi permettant de mettre au point un plan rigoureux de réforme profonde de la justice. Nous en avons fixé les axes principaux dans Notre Discours à la Nation du 20 août 2009.",
    vocabulary: [
      { fr: "Dialogue élargi", ar: "حوار واسع", explanation: "نقاش وطني منفتح يشمل كافة الفاعلين من قضاة ومحامين وحقوقيين ومجتمع مدني لإبداء آرائهم." },
      { fr: "Plan rigoureux", ar: "مخطط مضبوط", explanation: "خطة عمل دقيقة محددة الأهداف والآليات والجدولة الزمنية للتنفيذ العملي." },
      { fr: "Axes principaux", ar: "المحاور الأساسية", explanation: "الركائز الأساسية التي تفرعت عنها توجهات المخطط الإصلاحي الشامل." }
    ],
    analysis: "يضع جلالة الملك هذا اللقاء في سياقه التاريخي التراكمي، مستحضراً محطة خطاب العرش لعام 2008 وخارطة الطريق المعمقة لخطاب 20 غشت 2009 الذي رسم 'المحاور الأساسية' (axes principaux)."
  },
  {
    id: 4,
    title: "التتويج الدستوري وقواعد العدالة وحقوق المتقاضين",
    ar: "وقد حرصنا على تتويج هذا المسار الإصلاحي بمقتضيات الدستور الجديد للمملكة التي تنص على ضمان الملك لاستقلال القضاء، وتكرس القضاء كسلطة مستقلة قائمة الذات عن السلطتين التشريعية والتنفيذية، وإحداث المجلس الأعلى للسلطة القضائية كمؤسسة دستورية برئاستنا ، وبالنص على حقوق المتقاضين وقواعد سير العدالة ودور القضاء في حماية حقوق الأشخاص والجماعات وحرياتهم.",
    fr: "Nous avons veillé à ce que ce processus réformateur soit, à terme, couronné by les dispositions de la Nouvelle Constitution du Royaume. Celles-ci stipulent, en effet, la garantie par la loi de l'indépendance de la justice et consacrent la justice comme pouvoir indépendant à part entière par rapport aux Pouvoirs législatif et exécutif. Y sont également énoncés les droits des justiciables, et les règles de fonctionnement de la justice, ainsi que le rôle de la justice dans la protection des droits et des libertés des personnes et des collectivités.",
    vocabulary: [
      { fr: "Pouvoir indépendant à part entière", ar: "سلطة مستقلة قائمة الذات", explanation: "تأكيد الفصل الدستوري التام والكامل للسلطة القضائية عن السلطتين التشريعية والتنفيذية." },
      { fr: "Conseil Supérieur du Pouvoir Judiciaire", ar: "المجلس الأعلى للسلطة القضائية", explanation: "المؤسسة الدستورية السامية التي خلفت المجلس الأعلى للقضاء لتعزيز استقلال السلطة القضائية." },
      { fr: "Droits des justiciables", ar: "حقوق المتقاضين", explanation: "مجموع الضمانات الدستورية التي تكفل للأفراد معاملة عادلة وقانونية ومحاكمة متكافئة أمام المحاكم." }
    ],
    analysis: "تتجلى في هذه الفقرة الأهمية البالغة لدستور 2011 الذي ارتقى بالقضاء إلى 'سلطة مستقلة قائمة الذات' (pouvoir indépendant à part entière) وأحدث المجلس الأعلى للسلطة القضائية (Conseil Supérieur du Pouvoir Judiciaire)."
  },
  {
    id: 5,
    title: "تركيبة الهيئة التعددية والمنهجية التشاركية والإدماجية",
    ar: "تلكم هي المرجعيات الأساسية لهذا الحوار الوطني الذي نريده مناسبة لتأكيد تشبث المغاربة بالنموذج الديمقراطي التنموي المغربي المتميز. حضرات السيدات والسادة، من منطلق نجاعة المقاربة التشاركية والإدماجية التي اعتمدناها في مختلف القضايا والإصلاحات الكبرى، فقد تم الحرص على أن تشمل التركيبة التعددية لهذه الهيئة العليا جميع المؤسسات الدستورية والقطاعات الحكومية والقضائية، وتمثيلية وازنة للمجتمع المدني ومختلف الفعاليات المؤهلة المعنية بإصلاح منظومة العدالة.",
    fr: "Tels sont les référents fondamentaux de ce dialogue national dont Nous voulons qu'il soit l'occasion de réaffirmer l'attachement des Marocains au modèle marocain singulier de démocratie et de développement. Mesdames, Messieurs, Vu l'efficacité de l'approche participative et inclusive que nous avons adoptée pour aborder les questions majeures et les grandes réformes, il est vite apparu nécessaire de veiller à ce que la composition plurielle de la haute Instance englobe toutes les institutions démocratiques et les secteurs gouvernementaux et judiciaires, et reflète une représentation conséquente de la société civile et des différentes organisations qualifiées, concernées par la réforme du système judiciaire",
    vocabulary: [
      { fr: "Approche participative et inclusive", ar: "المقاربة التشاركية والإدماجية", explanation: "منهجية العمل القائمة على إدماج وإشراك كافة وجهات النظر والهيئات ذات الصلة بصنع القرار الوطني." },
      { fr: "Composition plurielle", ar: "التركيبة التعددية", explanation: "تنوع الفاعلين والممثلين من مشارب دستورية ومهنية ومجتمعية مختلفة لضمان شمولية مخرجات الحوار." },
      { fr: "Représentation conséquente", ar: "تمثيلية وازنة", explanation: "حضور قوي ومؤثر للهيئات غير الحكومية والمجتمع المدني لضمان تمثيل نبض المجتمع وتطلعاته." }
    ],
    analysis: "يستند النموذج المغربي على 'المقاربة التشاركية والإدماجية' (approche participative et inclusive)، وهو ما تُرجم بوضع 'تركيبة تعددية' (composition plurielle) للهيئة تشمل مختلف الحساسيات والشركاء والمجتمع المدني."
  },
  {
    id: 6,
    title: "صهر الجهود ومهام الإشراف على الحوار الوطني",
    ar: "ونود في هذا الصدد، أن نتوجه بعبارات التقدير لأعضاء هذه الهيئة الموقرة، منوهين بغيرتهم الوطنية وبكفاءتهم وخبرتهم ونزاهتهم وتنوع مشاربهم، داعين إياهم إلى الانصهار في بوتقة عمل وطني بناء. وستتولى هذه الهيئة الاستشارية كإطار تعددي وتمثيلي يتيح انفتاح القضاء على محيطه الداخلي والخارجي، مهمة الإشراف على هذا الحوار الوطني ورفع مشاريع توصيات بشأن إصلاح منظومة العدالة لنظرنا السامي.",
    fr: "A ce propos, Nous tenons à rendre hommage aux membres de cette honorable instance, en saluant leur patriotisme, leur compétence, leur expertise, leur intégrité et la diversité de leurs sensibilités et leurs horizons. Nous les engageons tous à s'unir et à fusionner leurs efforts dans le creuset d'une action nationale constructive. Cette instance consultative, en tant que cadre pluriel et représentatif permettant l'ouverture de la justice sur son environnement interne et externe, aura pour mission de superviser ce dialogue national et de soumettre à Notre Haute Appréciation des projets de recommandations sur la réforme du système judiciaire.",
    vocabulary: [
      { fr: "Creuset d'une action nationale constructive", ar: "بوتقة عمل وطني بناء", explanation: "الاندماج التام ونبذ الخلافات الفئوية لصهر الكفاءات في سبيل تحقيق هدف مصلحة الوطن السامية." },
      { fr: "Ouverture de la justice sur son environnement", ar: "انفتاح القضاء على محيطه", explanation: "تخطي الانغلاق التقليدي للمحاكم والتقرب من تطلعات المجتمع المدني والشركاء السوسيو-اقتصاديين." },
      { fr: "Projets de recommandations", ar: "مشاريع توصيات", explanation: "المقترحات والحلول العملية الصادرة عن الهيئة والتي ستشكل ركائز الميثاق الوطني لإصلاح العدالة." }
    ],
    analysis: "يبرز توجيه جلالة الملك لأعضاء الهيئة لـ 'الانصهار في بوتقة عمل وطني' (s'unir et à fusionner leurs efforts dans le creuset)، محدداً مهامهم في صياغة 'مشاريع توصيات' (projets de recommandations) موجهة للنظر الملكي السامي."
  },
  {
    id: 7,
    title: "صياغة الميثاق الوطني والالتزام بمسؤولية الإصلاح",
    ar: "وإننا ننتظر منكم، لما هو معهود فيكم من روح المسؤولية الوطنية العالية انتهاج الاجتهاد الخلاق والإصغاء والانفتاح للتفعيل الأكمل لمشروع إصلاح العدالة. كما ندعو جميع الفاعلين للتعبئة والانخراط في هذا الحوار الوطني الذي سنتعهده بالرعاية والمتابعة غايتنا الجماعية بلورة ميثاق وطني واضح في أهدافه ومحدد في أسبقياته وبرامجه ووسائل تمويله ومضبوط في آليات تفعيله وتقويمه. وستجدون في جلالتنا ، كضامن لاستقلال القضاء وساهر على احترام الدستور وحقوق وحريات الأفراد والجماعات خير سند لكم في النهوض بهذه المسؤولية الوطنية الجسيمة والنبيلة. أعانكم الله وسدد خطاكم وكلل أعمالكم بالتوفيق. والسلام عليكم ورحمة الله تعالى وبركاته.",
    fr: "Compte tenu du sens élevé du devoir national qui vous est reconnu, Nous nous attachons à ce que vous empruntiez la voie de l'effort créatif, de l'écoute et de l'ouverture pour donner son expression concrète et optimale au projet de réforme de la justice. Nous appelons également tous les acteurs à se mobiliser et s'investir dans ce dialogue national dont Nous suivrons attentivement le déroulement. En effet, notre dessein commun est de mettre au point une charte nationale, avec des objectifs clairs, des priorités, des programmes et des moyens de financement précis et des mécanismes de mise en oeuvre et d'évaluation rigoureux. Vous trouverez en Notre Majesté, en tant que Garant de l'indépendance de la justice, veillant au respect de la Constitution et des droits et libertés des individus et des collectivités, le meilleur soutien qui soit pour vous acquitter d'une responsabilité nationale aussi lourde que noble. Puisse Dieu vous assister dans votre tâche, guider vos pas et couronner vos travaux de succès.",
    vocabulary: [
      { fr: "Effort créatif", ar: "الاجتهاد الخلاق", explanation: "التفكير المبتكر والخارج عن النمطية التقليدية لصياغة حلول قضائية وقانونية حديثة وملائمة." },
      { fr: "Charte nationale", ar: "ميثاق وطني", explanation: "وثيقة مرجعية توافقية ملزمة ترسم خريطة طريق إصلاح العدالة بموافقة كافة الأطراف والفاعلين." },
      { fr: "Moyens de financement précis", ar: "وسائل تمويله ومضبوط في آليات تفعيله", explanation: "توفير الميزانيات والاعتمادات اللازمة لضمان ألا تظل مخرجات الحوار حبراً على ورق بل حقيقة ممولة وملموسة." }
    ],
    analysis: "يختتم جلالة الملك الخطاب بتوجيه الهيئة لصياغة 'ميثاق وطني' (charte nationale) متكامل وشامل بآليات تمويل وتقويم دقيقة، معلناً رعاية جلالته ودعمه الكامل كـ 'ضامن لاستقلال القضاء' (Garant de l'indépendance de la justice)."
  },
  {
    id: 8,
    title: "المؤتمر السادس لجمعية المحاكم الدستورية ونشر سيادة القانون (2012)",
    ar: "إنه لمن دواعي الاعتزاز أن تحتضن المملكة المغربية أعمال المؤتمر السادس الجمعية المحاكم الدستورية التي تتقاسم استعمال اللغة الفرنسية، برعايتنا السامية، بمدينة مراكش، أرض الحوار والملتقيات الدولية الكبرى. ويطيب لنا ، في البداية، أن نشيد بالأهداف النبيلة لجمعيتكم، ومساهمتها القيمة في نشر ثقافة سيادة القانون عماد دولة الحق والمؤسسات، وفي النهوض بالعدالة الدستورية، باعتبارها التجسيد الأمثل لسمو الدستور. ومما يضفي على مؤتمركم أهمية خاصة، كونه ينعقد في ظل التحولات التي يعرفها القانون الدستوري المعاصر، والتطورات المؤسسية التي تشهدها العديد من بلدان منطقتنا، بمختلف انعكاساتها، وما يقترن بها من تبؤ القضاء الدستوري المكانة المتميزة في المنظومة الديمقراطية الحديثة، ليس فقط كأساس للتوازن بين السلطات الدستورية، وإنما باعتباره أيضا مرجعا لها ولحقوق المواطن في ظلها.",
    fr: "C’est un motif de fierté que le Royaume du Maroc abrite les travaux du 6ème Congrès de l’Association des Cours Constitutionnelles ayant en partage l’usage de la langue française, sous Notre Haut Patronage, à Marrakech, terre de dialogue et de grands forums internationaux. Il Nous est agréable, tout d’abord, de saluer les nobles objectifs de votre Association et sa contribution de valeur à la diffusion de la culture de la primauté du droit, socle de l’Etat de droit et des institutions, et à la promotion de la justice constitutionnelle, en tant qu’incarnation optimale de la suprématie de la Constitution. Ce qui confère à votre Congrès une importance particulière, c’est le fait qu’il se tient à l’ombre des mutations que connaît le droit constitutionnel contemporain, et des développements institutionnels que connaissent de nombreux pays de notre région, avec leurs diverses répercussions, et ce qui s’y associe comme accession de la justice constitutionnelle à une place privilégiée dans le système démocratique moderne, non seulement en tant que fondement de l’équilibre entre les pouvoirs constitutionnels, mais aussi en tant que référence pour ces derniers et pour les droits des citoyens.",
    vocabulary: [
      { fr: "Justice constitutionnelle", ar: "العدالة الدستورية / القضاء الدستوري", explanation: "نظام الرقابة القضائية على دستورية القوانين لضمان مطابقتها للوثيقة الدستورية العليا." },
      { fr: "Primauté du droit", ar: "سيادة القانون", explanation: "خضوع كافة سلطات الدولة ومواطنيها للقواعد القانونية الموضوعة بالتوافق العام." },
      { fr: "Suprématie de la Constitution", ar: "سمو الدستور", explanation: "المبدأ الذي يضع الدستور في قمة الهرم القانوني للدولة متفوقاً على كافة القوانين والأنظمة." }
    ],
    analysis: "يبرز في هذه الفقرة مصطلح 'العدالة الدستورية' (justice constitutionnelle) كركيزة لسيادة القانون وتكريس مبدأ 'سمو الدستور' (suprématie de la Constitution). استخدام لغة قانونية دستورية رفيعة ومحكمة."
  },
  {
    id: 9,
    title: "المواطن والقضاء الدستوري في ظل الدستور الجديد للمملكة (2012)",
    ar: "ومن هذا المنطلق، تتجلى وجاهة اختياركم الموضوع المواطن والقضاء الدستوري كمحور أساسي لأشغال مؤتمركم اختيارا يجسد الالتزام القوي بجعل المواطن بحقوقه وواجباته، وحرياته، ووجوب ضمان كرامته، مرجعا وغاية لعمل المؤسسات الدستورية. ويصادف انعقاد مؤتمركم مرور سنة على إقرار دستور جديد للمملكة، بمضامين جد متقدمة، مؤسسة لنموذج دستوري مغربي متميز يشكل المواطن فيه صلب الأولويات والاهتمامات عمادة ترسيخ بناء دولة ديمقراطية حديثة، ترتكز على المشاركة والتعددية والحكامة الجيدة للمؤسسات الوطنية والترابية في ربط بين المسؤولية والمحاسبة، وذلك في إطار من التضامن والمساواة وتكافؤ الفرص.",
    fr: "C’est dans cette perspective que se manifeste la pertinence du choix de votre sujet : « Le citoyen et la justice constitutionnelle » comme axe fondamental des travaux de votre Congrès, choix qui incarne l’engagement fort de faire du citoyen, avec ses droits, ses devoirs, ses libertés et l’obligation de garantir sa dignité, la référence et la finalité de l’action des institutions constitutionnelles. La tenue de votre Congrès coïncide avec le premier anniversaire de l’adoption d’une nouvelle Constitution pour le Royaume, dotée de contenus très avancés, fondant un modèle constitutionnel marocain singulier dans lequel le citoyen constitue le cœur des priorités et des préoccupations, comme socle pour consolider l’édification d’un Etat démocratique moderne, basé sur la participation, le pluralisme et la bonne gouvernance des institutions nationale et territoriales dans l’articulation entre responsabilité et reddition des comptes, le tout dans un cadre de solidarité, d’égalité et d’égalité des chances.",
    vocabulary: [
      { fr: "Engagement fort", ar: "الالتزام القوي", explanation: "التعهد الوطني الصادق والعمل الجاد من لدن الدولة والمؤسسات لتحقيق تطلعات المواطنين وحماية كرامتهم." },
      { fr: "Responsabilité et reddition des comptes", ar: "المسؤولية والمحاسبة (ربط المسؤولية بالمحاسبة)", explanation: "المبدأ الدستوري الحديث الذي يقضي بمحاسبة كل مسؤول عمومي عن تدبيره للمال العام والصلاحيات الموكولة إليه." },
      { fr: "Gouvernance des institutions", ar: "حكامة المؤسسات (الحكامة الجيدة)", explanation: "الأساليب والقواعد الحديثة المعتمدة في إدارة المؤسسات بكفاءة وشفافية ومشاركة." }
    ],
    analysis: "تتطرق الفقرة للترابط الوثيق بين المواطن والقضاء الدستوري، وتسلط الضوء على مبدأ ربط المسؤولية بالمحاسبة (responsabilité et reddition des comptes) والحكامة الجيدة (bonne gouvernance) التي كرسها دستور 2011 كركائز للنموذج المغربي الديمقراطي التنموي."
  },
  {
    id: 10,
    title: "الاجتهاد القضائي الدستوري ومواجهة التحديات التنموية (2012)",
    ar: "وفي هذا الصدد، فإن دستور المملكة الجديد، بموازاة مع ارتقائه بالمكانة المؤسسية للسلطات التشريعية والتنفيذية والقضائية وتقويتها ، في ظل فصلها وتوازنها واستقلالها ، قد أقر ميثاقا للحقوق والحريات الأساسية بمختلف أجيالها ، وذلك ضمن منظومة متكاملة لحقوق الإنسان، كما هو متعارف عليها عالميا . كما كرس الآليات الكفيلة بضمان حمايتها وممارستها الفعلية، وفي صدارتها تخويل المواطن حق اللجوء إلى المحكمة الدستورية، لإثارة عدم دستورية أي قانون من شأن تطبيقه على نزاع معروض على القضاء، أن يمس بحقوقه وحرياتها الدستورية. وبالنظر لكافة المضامين المتقدمة للدستور الجديد للمملكة الذي أضحت ديباجته جزءا لا يتجزأ منه، وبارتقاء المجلس الدستوري إلى محكمة دستورية ذات اختصاصات واسعة، فإننا نتوخى توطيد دعائم المدرسة الدستورية المغربية الحافلة بعطاء الفقهاء الدستوريين المغاربة، عن طريق انبثاق اجتهاد قضائي دستوري خلاق وطموح، غايته المثلى، تكريس سمو الدستور والتقيد بأحكامه، نصا وروحا.",
    fr: "À cet égard, la nouvelle Constitution du Royaume, parallèlement à la revalorisation et au renforcement de la place institutionnelle des pouvoirs législatif, exécutif et judiciaire, sous le sceau de leur séparation, de leur équilibre et de leur indépendance, a consacré une charte des droits et libertés fondamentaux de différentes générations, dans le cadre d’un système intégré des droits de l’Homme tel qu’il est universellement reconnu. Elle a également instauré des mécanismes de nature à garantir leur protection et leur exercice effectif, au premier rang desquels figure l’octroi au citoyen du droit de saisine de la Cour Constitutionnelle, pour soulever l’inconstitutionnalité de toute loi dont l’application dans un litige soumis à la justice porterait atteinte à ses droits et libertés constitutionnels. Au vu de toutes les dispositions avancées de la nouvelle Constitution du Royaume, dont le préambule fait désormais partie intégrante, et de l’élévation du Conseil Constitutionnel au rang de Cour Constitutionnelle dotée de larges compétences, Nous visons à consolider les piliers de l’école constitutionnelle marocaine, riche de l’apport des constitutionnalistes marocains, à travers l’émergence d’une jurisprudence constitutionnelle créative et ambitieuse, dont le but ultime est de consacrer la suprématie de la Constitution et le respect de ses dispositions, dans leur texte et leur esprit.",
    vocabulary: [
      { fr: "Exception d'inconstitutionnalité", ar: "الدفع بعدم الدستورية (إثارة عدم الدستورية)", explanation: "آلية تمكن المتقاضي من الطعن في دستورية مقتضى قانوني يطبق عليه في نزاع معروض أمام القضاء العادي." },
      { fr: "Jurisprudence constitutionnelle créative", ar: "اجتهاد قضائي دستوري خلاق وطموح", explanation: "الأحكام والقرارات التفسيرية المبتكرة للمحكمة الدستورية التي توسع من حماية الحقوق الأساسية." },
      { fr: "Séparation, équilibre et indépendance des pouvoirs", ar: "فصل السلط وتوازنها واستقلالها", explanation: "المفهوم الكلاسيكي والمطور للديمقراطية الذي يمنع تغول سلطة على أخرى عبر آليات الرقابة والتوازن المتبادل." }
    ],
    analysis: "هنا يتم تناول 'الدفع بعدم الدستورية' (Exception d'inconstitutionnalité) المتمثل في 'حق اللجوء للمحكمة الدستورية لإثارة عدم دستورية قانون'، وهو تطور تاريخي ارتقى بالمجلس الدستوري إلى محكمة دستورية (Cour Constitutionnelle) ذات صلاحيات واسعة لترسيخ الاجتهاد الدستوري الخلاق."
  },
  {
    id: 11,
    title: "النهوض بوظائف العدالة الدستورية والتعاون القضائي الدولي (2012)",
    ar: "أصحاب المعالي، حضرات السيدات والسادة، إن القضاء الدستوري مدعو للانخراط في دينامية جديدة، ترتكز على مساهمة جميع الفعاليات القضائية والأكاديمية عن طريق استشعار طبيعة وظائفه المجتمعية والمؤسسية والتنموية الجديدة، في إطار معادلة لا تنفصل فيها التنمية عن الديمقراطية، وكذا عن طريق آليات عمله، لا سيما منها مناهج التأويل الدستوري السليم، بمبادئه وحدوده. وإننا نتطلع إلى أن تواصل جمعيتكم القيام بدورها الفاعل في إضاءة سبل الممارسة الدستورية والديمقراطية في مجتمعاتنا، والمساهمة في استشراف التحولات المستقبلية. وبموازاة ذلك، فإننا ندعوكم للمزيد من توثيق روابط الصداقة والتعاون والشراكة بين مؤسساتكم، لا سيما من خلال توسيع مجال تقاسم الاجتهادات الدستورية المتميزة والمساهمة الجماعية في الرفع من القدرات العلمية والمنهجية لهيئاتكم. داعين الله تعالى أن يكلل أشغالكم بكامل التوفيق. والسلام عليكم ورحمة الله تعالى وبركاته.",
    fr: "Excellences, Mesdames et Messieurs, La justice constitutionnelle est appelée à s’engager dans une dynamique nouvelle, basée sur la contribution de tous les acteurs judiciaires et académiques à travers la prise de conscience de la nature de ses nouvelles fonctions sociétales, institutionnelles et de développement, dans le cadre d’une équation où développement et démocratie sont indissociables, ainsi que par les mécanismes de son action, notamment les méthodes d’interprétation constitutionnelle saine, avec ses principes et ses limites. Nous aspirons à ce que votre Association poursuive son rôle actif pour éclairer les voies de la pratique constitutionnelle et démocratique dans nos sociétés, et contribuer à anticiper les mutations futures. Parallèlement à cela, Nous vous invitons à resserrer davantage les liens d’amitié, de coopération et de partenariat entre vos institutions, notamment en élargissant le partage des jurisprudences constitutionnelles distinguées et en contribuant collectivement au renforcement des capacités scientifiques et méthodologiques de vos instances. Priant le Très-Haut de couronner vos travaux de plein succès. Que la paix, la miséricorde de Dieu et Ses bénédictions soient sur vous.",
    vocabulary: [
      { fr: "Interprétation constitutionnelle", ar: "التأويل الدستوري / تفسير الدستور", explanation: "استخلاص المعاني والمفاهيم والأحكام الدستورية الكامنة من نصوص الوثيقة الدستورية تماشياً مع روح العصر." },
      { fr: "Fonctions sociétales et institutionnelles", ar: "وظائف مجتمعية ومؤسسية", explanation: "الأدوار التفاعلية التي تمارسها المحاكم الدستورية لحل النزاعات المجتمعية وتثبيت توازن المؤسسات." },
      { fr: "Dialogue judiciaire constitutionnel", ar: "حوار قضائي دستوري", explanation: "تبادل الخبرات وتلاقح الأفكار والاجتهادات القضائية بين المحاكم الدستورية في مختلف البلدان." }
    ],
    analysis: "توضح هذه الخاتمة الانتقال بوظائف المحاكم الدستورية من مجرد حراسة شكلية للقوانين إلى لعب 'أدوار مجتمعية وتنموية ومؤسسية' (fonctions sociétales, institutionnelles et de développement) ترتكز على 'التأويل الدستوري السليم' (interprétation constitutionnelle saine)."
  }
];

const SPEECH_SECTIONS_2000: SpeechSection[] = [
  {
    id: 1,
    title: "افتتاح الدورة والترحاب بأسرة الحق والقانون",
    ar: "إنه لمن دواعي سعادتنا أن نخاطبكم في افتتاح أشغال الدورة الثانية السنوية للمكتب الدائم لاتحاد المحامين العرب، مرحبين بكافة المشاركين فيها من منطلق اعتزازنا بالانتماء لأسرة الحق والقانون، ومن مبدا ما توليه من تقدير خاص لهيئة المحامين الذين يتقاسمون وأسرة القضاء أمانة إقامة العدل الذي جعلناه أساس مشروعنا المجتمعي الديمقراطي الحداثي ومبتغاه",
    fr: "C'est avec plaisir que Nous nous adressons à Vous à l'ouverture des travaux de la deuxième session annuelle du Bureau permanent de l'Union des avocats arabes, souhaitant la bienvenue à tous les participants à cette importante rencontre, partant de Notre fierté d'appartenir à la famille du Droit, et de la considération particulière que Nous portons à l'Ordre des avocats, qui partagent avec la famille de la magistrature la mission d'établir la justice dont Nous avons fait le fondement et la finalité de Notre projet de société démocratique et moderne.",
    vocabulary: [
      { fr: "L'Union des avocats arabes", ar: "اتحاد المحامين العرب", explanation: "منظمة حقوقية عربية غير حكومية تأسست عام 1944 وتضم نقابات المحامين في الدول العربية." },
      { fr: "La famille de la magistrature", ar: "أسرة القضاء / سلك القضاء", explanation: "الهيئة القضائية التي تشمل القضاة والمستشارين المكلفين بالفصل في الخصومات وتطبيق القانون." },
      { fr: "Projet de société démocratique et moderne", ar: "مشروعنا المجتمعي الديمقراطي الحداثي", explanation: "الرؤية الاستراتيجية للمملكة لبناء مجتمع يحترم الحريات والديمقراطية وحقوق الإنسان مع الحفاظ على الهوية الوطنية." }
    ],
    analysis: "يؤكد جلالة الملك في افتتاح الدورة على التلازم العضوي بين أسرة القضاء (famille de la magistrature) وهيئة المحامين (Ordre des avocats) كشريكين يتقاسمان أمانة إقامة العدل، واضعاً القضاء العادل كركيزة أساسية للمشروع المجتمعي الحداثي."
  },
  {
    id: 2,
    title: "الإشادة باتحاد المحامين العرب ودوره التاريخي والقومي",
    ar: "وسيرا على النهج القويم لوالدنا المنعم جلالة الملك الحسن الثاني، أكرم الله مثواه أبينا إلا أن نخص جمعكم المبارك هذا بسامي رعايتنا تكريما وإشادة منا باتحاد المحامين العرب، هذه المؤسسة الحقوقية العربية العريقة التي نهضت بدور طلائعي في معركة التحرير والديمقراطية، وساهمت بشكل رائد وجدي وفعال على مدى أكثر من نصف قرن في النضال من أجل ترسيخ مبادئ دولة الحق والقانون وحماية حقوق الإنسان وصيانة المبادئ السامية لمهنة المحاماة، فضلا عن مساندتها لكل توجه وحدوي عربي ونبذها للتجزئة والانفصال، مع حرصها على الدعم الفاعل للقضايا المصيرية للأمة العربية، وفي مقدمتها الكفاح العادل للشعب الفلسطيني من أجل استرجاع حقوقه المشروعة.",
    fr: "Suivant la juste voie de Notre vénéré père, Feu Sa Majesté le Roi Hassan II, que Dieu bénisse son âme, Nous avons tenu à accorder Notre haut patronage à votre réunion bénie en hommage à l'Union des avocats arabes, cette prestigieuse institution de droit qui a été à l'avant-garde du combat pour la libération et la démocratie, et qui a contribué de manière active et efficiente, depuis plus d'un demi-siècle, à la lutte pour la consécration des principes de l'Etat de droit, la protection des droits de l'homme et la sauvegarde des nobles principes de la profession d'avocat. Une institution qui a, en outre, soutenu toutes les démarches unitaires dans le monde arabe, rejeté le séparatisme et le morcellement et toujours veillé à apporter son soutien actif aux causes décisives de la nation arabe, avec à leur tête le juste combat du peuple palestinien pour le recouvrement de ses droits légitimes.",
    vocabulary: [
      { fr: "Prestigieuse institution de droit", ar: "المؤسسة الحقوقية العريقة", explanation: "وصف يعكس المكانة التاريخية والاعتبارية الرفيعة للاتحاد كمنظمة مدافعة عن الحق والقانون." },
      { fr: "Consécration des principes de l'Etat de droit", ar: "ترسيخ مبادئ دولة الحق والقانون", explanation: "العمل الدؤوب لترسيخ سيادة القانون، والمساواة أمامه، وفصل السلطات في النظم الدستورية." },
      { fr: "Rejeté le séparatisme et le morcellement", ar: "نبذها للتجزئة والانفصال", explanation: "موقف مبدئي يرفض النزعات الانفصالية ويدعم وحدة الدول وسيادتها الترابية." }
    ],
    analysis: "يشيد الخطاب بالدور التاريخي والطلائعي (avant-garde) لـ 'اتحاد المحامين العرب' في معركة التحرير وحماية حقوق الإنسان، ويثني على موقفه القومي الثابت الداعم لوحدة الشعوب والرافض للتجزئة والنزعات الانفصالية (rejet du séparatisme)."
  },
  {
    id: 3,
    title: "القدس الشريف وسلاح الحق والقانون والشرعية",
    ar: "وما إطلاقكم اسم دورة القدس على هذا الملتقى الهام إلا دليل على تضامنكم مع انتفاضة الأقصى التي ما فتئنا نعمل بصفتنا رئيسا للجنة القدس الشريف، على تعبئة كل الطاقات وبذل كل الجهود واتخاذ كل المبادرات لنصرتها في جهادها المستميت من أجل الدفاع عن حرمات أولى القبلتين وثالث الحرمين وتحرير فلسطين من براثن الاحتلال الإسرائيلي الغاشم وقيام الدولة الفلسطينية المستقلة وعاصمتها القدس الشريف. إنكم وأنتم تشاطرون الأمة العربية شرف النضال في سبيل دعم انتفاضة الأقصى لتدركون مدى فعالية سلاحكم، ألا وهو سلاح الحق والقانون والشرعية والعدل والإنصاف في وقف ما ترتكبه آلة الحرب الإسرائيلية من تقتيل للشعب الفلسطيني الأعزل.",
    fr: "Le fait que vous ayez baptisé cette importante rencontre «Session d'Al Qods», constitue un témoignage de votre solidarité avec l'Intifada d'Al Aqsa en faveur de laquelle Nous n'avons cessé, en Notre qualité de Président du Comité Al Qods, de mobiliser toutes les potentialités, de consentir tous les efforts et de prendre toutes les initiatives afin de soutenir son Jihad inlassable, pour la défense de la première Qibla et troisième lieu saint, la libération de la Palestine du joug de l'occupation israélienne inique et l'avènement de l'Etat palestinien indépendant avec Al Qods Al Charif comme capitale. En partageant avec la nation arabe l'honneur du combat pour soutenir l'Intifada d'Al Aqsa, vous saisissez combien l'arme que vous détenez est efficace, l'arme du Droit, de la loi, de la légalité, de la justice et de l'équité, pour faire cesser les tueries perpétrées par la machine de guerre israélienne contre le peuple palestinien sans armes.",
    vocabulary: [
      { fr: "Président du Comité Al Qods", ar: "رئيس لجنة القدس", explanation: "الصفة الرسمية والمسؤولية السامية لجلالة الملك في قيادة اللجنة المنبثقة عن منظمة التعاون الإسلامي لحماية القدس الشريف." },
      { fr: "L'arme du Droit, de la loi, de la légalité", ar: "سلاح الحق والقانون والشرعية", explanation: "توظيف المبادئ القانونية الدولية والقرارات الأممية كأداة ردع سلمية في مواجهة القوى الاستعمارية وسلطات الاحتلال." },
      { fr: "Le joug de l'occupation", ar: "براثن الاحتلال", explanation: "تعبير يصف السيطرة الاستعمارية القمعية وغير الشرعية المفروضة على الأراضي والشعوب المحتلة." }
    ],
    analysis: "يتناول الخطاب البعد القومي والسيادي لقضية القدس برئاسة جلالة الملك لـ 'لجنة القدس الشريف'، مركزا على 'سلاح الحق والقانون' (arme du Droit) كأداة حضارية وقانونية فعالة وشرعية لمواجهة انتهاكات الاحتلال ومناصرة الشعب الفلسطيني الأعزل."
  },
  {
    id: 4,
    title: "المجتمع المدني وآليات العلاقات الدولية المعاصرة",
    ar: "وبحكم ما أصبح لصون حقوق الإنسان وللمنظمات الوطنية والدولية غير الحكومية وللرأي العام الداخلي والخارجي من نفوذ وازن في عمليات صنع القرار فإننا نهيب بكم لمضاعفة الجهود قصد توظيف هذه الآليات المؤثرة والأساسية في العلاقات الدولية المعاصرة من أجل حشد التأييد العالمي للحق العربي في القدس المكلومة التي يجسد كفاحها المشروع شعار اتحادكم النبيل: الحق والعروبة وترجيح خيار السلم والحوار والشرعية الذي نحن متشبتون به على ركوب آلة الحرب وفرض الأمر الواقع بقوة السلاح",
    fr: "Partant de l'influence déterminante de la défense des droits de l'homme, des organisations non gouvernementales nationales et internationales et de l'opinion publique nationale et internationale sur l'opération de prise de décision, Nous vous exhortons à redoubler d'efforts en vue de mettre à contribution ces mécanismes essentiels, à l'influence certaine sur les relations internationales, afin d'obtenir le soutien le plus large de la communauté internationale au droit arabe sur Al Qods éprouvée, dont le combat légitime trouve son illustration dans la devise de votre honorable union: droit et arabité, et de faire prévaloir l'option de la paix, du dialogue et de la légalité, à laquelle Nous sommes attachés, sur le recours à la machine de guerre, à la politique du fait accompli imposé par la force des armes.",
    vocabulary: [
      { fr: "Prise de décision", ar: "صنع القرار", explanation: "المسار السياسي والتنظيمي المعقد الذي تسلكه الحكومات والمنظمات الدولية لإقرار التوجهات والسياسات العامة." },
      { fr: "Politique du fait accompli", ar: "فرض الأمر الواقع", explanation: "فرض وضع قانوني أو جغرافي أحادي الجانب بالقوة العسكرية دون استناد إلى شرعية قانونية أو اتفاقيات مسبقة." },
      { fr: "Option de la paix, du dialogue et de la légalité", ar: "خيار السلم والحوار والشرعية", explanation: "النهج الدبلوماسي العقلاني الذي يرتكز على احترام العهود والمواثيق الدولية والجلوس لطلب الحلول التفاوضية." }
    ],
    analysis: "يشير جلالة الملك إلى التحول الكبير في 'العلاقات الدولية المعاصرة'، حيث أصبح للمجتمع المدني والمنظمات غير الحكومية نفوذ وازن في 'صنع القرار' (prise de décision)، داعياً إلى تعبئة هذه الآليات لنصرة القدس وترجيح خيار السلم والحوار على سياسة الأمر الواقع (politique du fait accompli)."
  },
  {
    id: 5,
    title: "الكونية الإنسانية والرسالة النبيلة للمحاماة",
    ar: "إن موقفكم الثابت من مساندة الحق الفلسطيني لم ينبع من مجرد الانتماء القومي ومناصرة قضاياه فحسب، ولكنه يصدر بالأساس عن الوعي بالطابع الكوني لرسالة المحامي القائمة على صيانة الكرامة الإنسانية وحماية قيم العدل والإنصاف والذود عن الحريات العامة الفردية الجماعية، كما أنه نابع من الإيمان بأن المحاماة رسالة إنسانية نبيلة وضرورية في أي مجتمع مستمدة سموها ونبلها من إحقاق الحق ورفع المظالم ومساعدة العدالة على بلوغ هذه المقاصد العليا. واعتبارا لهذه المبادئ السامية للمحاماة كرست القوانين الداخلية والمواثيق الدولية مبدأ الحق في الدفاع والمحاكمة العادلة تأكيدا للرسالة الكونية للمحاماة.",
    fr: "Votre position constante de soutien aux droits palestiniens ne procède pas seulement du sentiment d'appartenance à la nation arabe et de l'impératif de soutenir ses causes, mais découle essentiellement de la prise de conscience du caractère universel de la mission de l'avocat, basée sur la préservation de la dignité humaine, la défense des idéaux de justice et d'équité et la protection des libertés publiques individuelles et collectives. Cette position découle également du fait que la profession d'avocat est une mission humanitaire noble et indispensable dans toute société, tirant sa grandeur et sa vertu de l'affirmation du droit, de la lutte contre l'injustice et du concours qu'elle apporte à la Justice pour la réalisation de ces nobles desseins. Eu égard à ces nobles principes de la profession d'avocat, les lois nationales et les conventions internationales ont consacré le droit à la défense et à un procès équitable, confirmant ainsi la mission universelle de cette profession.",
    vocabulary: [
      { fr: "Caractère universel de la mission de l'avocat", ar: "الطابع الكوني لرسالة المحامي", explanation: "البعد العالمي والإنساني لمهنة الدفاع التي لا تنحصر بحدود جغرافية أو قومية بل تدافع عن الكرامة الإنسانية أينما كانت." },
      { fr: "Droit à la défense et à un procès équitable", ar: "الحق في الدفاع والمحاكمة العادلة", explanation: "مبدأ قانوني ودستوري جوهري يضمن لكل متهم فرصة تقديم دفوعاته كاملة وحرية اختيار محاميه أمام محكمة مستقلة ومحايدة." },
      { fr: "Lutte contre l'injustice", ar: "رفع المظالم / محاربة الجور", explanation: "الهدف الأسمى لرسالة الدفاع والقضاء لإعادة الحقوق المغتصبة وتصحيح الاختلالات القانونية لحماية الضعفاء." }
    ],
    analysis: "يسلط الخطاب الضوء على 'الطابع الكوني لرسالة المحامي' (caractère universel de la mission de l'avocat) الذي لا يرتبط فقط بالبعد القومي بل بالقيم الإنسانية الكونية مثل الكرامة والعدالة والحق الدستوري والدولي في 'الدفاع والمحاكمة العادلة' (droit à la défense et à un procès équitable)."
  },
  {
    id: 6,
    title: "علاقة المحاماة بدولة الحق والقانون والتنمية الاقتصادية",
    ar: "كما ارتبطت قيم هذه المهنة الشريفة بالمصلحة العامة نظرا لمساهمتها الفعالة في تحقيق العدالة عن طريق تسهيل ممارسة الجميع لحق الولوج إلى ميدان القانون والقضاء، هذا فضلا عن حمولتها السياسية القوية المتمثلة في سعي المحامين الدائم لإقرار أسس عدالة نزيهة ومستقلة بالنظر لما للعدالة بهذا المفهوم من ارتباط جوهري بدولة الحق والقانون، ولما لها أيضا من تأثير حاسم في ترسيخ دعائم المجتمع الديمقراطي وحماية حقوق الإنسان بما يحمله ذلك من انعكاس إيجابي على الاستقرار السياسي وتوفير المناخ السليم المحفز للتنمية الاقتصادية والاجتماعية.",
    fr: "Les valeurs de cette honorable profession sont également liées à l'intérêt général, en raison de sa contribution active à la consécration de la Justice en facilitant le recours de tout un chacun au domaine du droit et de justice. Il convient aussi de relever la forte charge politique de cette profession en raison de l'action permanente des avocats pour asseoir les fondements d'une justice honnête et indépendante, du fait du lien étroit entre Etat de droit et justice, du rôle déterminant de celle-ci dans la consolidation des fondements de la société démocratique et la défense des droits de l'homme, avec tout ce que cela a comme répercussions positives sur la stabilité politique et la garantie d'un environnement sain et incitatif au développement économique et social.",
    vocabulary: [
      { fr: "Le recours au domaine du droit et de justice", ar: "حق الولوج إلى ميدان القانون والقضاء", explanation: "تيسير وصول المواطنين، ولا سيما الفئات الهشة، للمعلومات القانونية والمؤازرة القضائية دون معوقات مادية أو إدارية." },
      { fr: "Stabilité politique", ar: "الاستقرار السياسي", explanation: "حالة التوازن والأمن في الدولة الناتجة عن عدالة المؤسسات وحماية الحقوق والحريات مما يضمن السلم المجتمعي." },
      { fr: "Environnement sain et incitatif au développement", ar: "بيئة سليمة محفزة للتنمية", explanation: "المناخ العام المستقر والشفاف الذي يضمن تكافؤ الفرص وحماية الملكية وتوفير الأمان القانوني للمشاريع التنموية." }
    ],
    analysis: "يربط جلالة الملك مهنة المحاماة بالمصلحة العامة و'الولوج إلى ميدان القانون والقضاء' (recours au domaine du droit et de justice)، مبرزاً الأثر المباشر للعدالة النزيهة والمستقلة على 'الاستقرار السياسي' (stabilité politique) وتأسيس بيئة استثمارية واجتماعية 'محفزة للتنمية' (incitatif au développement)."
  },
  {
    id: 7,
    title: "التحديات الداخلية لمهنة المحاماة وأخلاقياتها",
    ar: "لقد أصبحت مهنة المحاماة في المجتمع الديمقراطي الحديث تحتل مكانة متميزة بالنظر للدور المحوري للمحامي في تحقيق العدل والدفاع عن دولة الحق والقانون. لكن بقدر تعاظم هذه المكانة المحورية للمحاماة، بقدر ما تتنامى تحديات مهنية داخلية وخارجية من شأنها أن تخل بنهوض المحامي بدوره الأساسي في إنارة الطريق أمام القضاء لتحقيق العدالة المنشودة. وإن من أكبر المعوقات المهنية الداخلية التي تؤثر سلبا على المحاماة ما يعرفه الواقع من مساس بأخلاقياتها وقيمها وتغليب الاعتبارات المادية على مبادئها الإنسانية السامية، وهو ما يؤدي إلى الإخلال بالواجبات التي تفرضها المهنة على المحامي. فهذه الشوائب لا تمس بقدسية مهنة المحاماة فقط، بل وتلقي بظلالها السلبية على الحماية القانونية المطلوب توفيرها لعموم المتقاضين، هذه الحماية التي يعد ضمانها جوهر عمل المحامي ورسالته في آن واحد.",
    fr: "La profession d'avocat occupe une place privilégiée dans la société démocratique moderne du fait du rôle central joué par l'avocat dans l'instauration de la justice et la défense de l'état de droit. Mais, à mesure que se renforce la place centrale de cette profession, l'on voit se multiplier des défis professionnels, internes et externes, à même d'empêcher l'avocat d'assumer son rôle fondamental consistant à éclairer la justice pour réaliser l'équité escomptée. Parmi les grandes entraves professionnelles internes qui influent négativement sur la profession figurent l'atteinte à son éthique et à ses valeurs et le fait de faire prévaloir les considérations matérielles sur les nobles principes humanitaires qui la régissent, ce qui conduit au manquement aux devoirs qu'impose la profession à l'avocat. Ces entraves ne portent pas atteinte uniquement à la sacralité de la profession d'avocat, mais influent aussi négativement sur la protection juridique qui doit être assurée à l'ensemble des justiciables, cette protection dont la garantie constitue l'essence même de l'action de l'avocat et de sa mission.",
    vocabulary: [
      { fr: "Éclairer la justice", ar: "إنارة الطريق أمام القضاء", explanation: "الدور المساعد للمحامي بتقديم الحجج والأدلة القانونية والواقعية التي تمكن القاضي من إصدار حكم عادل ومنصف." },
      { fr: "Considérations matérielles", ar: "الاعتبارات المادية", explanation: "تغليب الجوانب المالية والربحية على الجانب الإنساني والحقوقي النبيل لرسالة المحاماة السامية." },
      { fr: "Sacralité de la profession d'avocat", ar: "قدسية مهنة المحاماة", explanation: "المكانة المعنوية والحقوقية الرفيعة للمهنة المستمدة من التزامها التاريخي بالدفاع عن المظلومين والذود عن قيم الحق." }
    ],
    analysis: "يتطرق جلالة الملك بصراحة وشجاعة إلى 'المعوقات الداخلية' التي تؤثر سلباً على المهنة، محذراً من المساس بالأخلاقيات وتغليب 'الاعتبارات المادية' (considérations matérielles) على المبادئ السامية، لأن ذلك يمس بـ 'قدسية المهنة' (sacralité de la profession) وبحماية حقوق المتقاضين."
  },
  {
    id: 8,
    title: "التحديات الخارجية والعولمة وقانون الأعمال",
    ar: "أما بالنسبة للمعوقات الخارجية، فيكفي التذكير بما تتعرض له المحاماة من تحديات ترمي إلى الخروج بها إلى مجال الخدمات التجارية وإخضاعها لمنطق السوق وجرها إلى حلبة المنافسة الدولية، مما يمس بهويتها الأصيلة. وما ذلك إلا نتيجة للتطورات الاقتصادية العالمية المتسارعة والأبعاد الدولية التي أصبح يتخذها القانون، خاصة عن طريق الاتفاقيات الدولية التي تهم قانون الأعمال والجرائم الاقتصادية والبيئة والتقنيات الحديثة للاتصال والتطور المتسارع في مجال البيولوجيا وغيرها من العلوم، مما يفرض على المحامي أن يكون على إلمام واسع بالمجال الذي يتدخل فيه ويقدم خدمة قانونية على مستوى عال من الأداء تحت طائلة مسؤوليته المهنية.",
    fr: "En ce qui concerne les entraves externes, il suffit de rappeler les défis auxquels la profession d'avocat est confrontée et qui visent à la dévier vers le secteur des prestations commerciales, à la soummettre à la loi du marché et à l'entraîner sur la scène de la concurrence internationale, ce qui porte atteinte à sa mission authentique. Tout cela n'est que le résultat des mutations économiques mondiales accélérées et de la dimension internationale que revêt désormais la loi, particulièrement à travers les conventions internationales, qui concernent le droit des affaires, les délits économiques, l'environnement, les nouvelles technologies de la communication et l'évolution accélérée en matière de biologie et d'autres sciences, ce qui implique pour l'avocat d'être parfaitement au fait du domaine de son intervention et de présenter une prestation juridique d'une haute qualité, en assumant pleinement sa responsabilité professionnelle.",
    vocabulary: [
      { fr: "Droit des affaires et délits économiques", ar: "قانون الأعمال والجرائم الاقتصادية", explanation: "الفروع القانونية الحديثة المرتبطة بالشركات، والتمويل، والضرائب، والجرائم المالية كغسل الأموال والاحتيال التجاري." },
      { fr: "Prestations commerciales / Loi du marché", ar: "الخدمات التجارية / منطق السوق", explanation: "محاولات تحويل مهنة المحاماة من رسالة إنسانية مدافعة عن الحقوق إلى خدمة تجارية تخضع للعرض والطلب والمنافسة المادية الشرسة." },
      { fr: "Responsabilité professionnelle", ar: "المسؤولية المهنية", explanation: "الالتزام القانوني والأخلاقي الذي يتحمله المحامي لتقديم مشورة ودفاع دقيق وخال من الأخطاء الجسيمة لعملائه." }
    ],
    analysis: "يشخص جلالة الملك بدقة التحديات الخارجية المترتبة على العولمة الاقتصادية ومحاولات إخضاع المحاماة لـ 'منطق السوق' (loi du marché)، داعياً المحامين إلى الإلمام بـ 'قانون الأعمال' (droit des affaires) والمستجدات العلمية والتقنية لتقديم استشارات قانونية متطورة تليق بالمعايير الدولية."
  },
  {
    id: 9,
    title: "إصلاح وهيكلة مهنة المحاماة وفق تنظيم حديث",
    ar: "ونتيجة لهذه التحديات فإن المحاماة توجد اليوم في موقع دفاع حتى لا تفقد قواعدها وتقاليدها وأعرافها وثقة من يلجأ إليها. ولن يتسنى رفع تلكم التحديات إلا بالعمل على إصلاح وهيكلة المهنة وفق تنظيم حديث ومتطور يحافظ للمحاماة على استقلالها وحرمتها ، ويضمن في نفس الوقت تطورها وتكيفها مع المتطلبات المستجدة. كما أن كسب هذا الرهان الحيوي لن يتم إلا بتأمين الضمانات الأخلاقية للمهنة وأعرافها الأصيلة الملزمة والعمل على الرفع من مؤهلات ومستوى أداء المحامي لرسالته ، لا ليكون أكثر دراية بالمجال القانوني فقط، ولكن ليكون أيضا فعالا في ممارسته، متحكما في التقنيات الحديثة للمعرفة والاتصال، متفتحا على الثقافة الإنسانية، ملما بالأساليب المبتكرة في ميدان التسيير والتدبير، لأن كل تفريط في هذه المقومات من شأنه أن يرهن حرية المحامي واستقلاله، والحال أن هذين الشرطين هما قوام رسالته وضمان نجاحه في مهمته.",
    fr: "Du fait de ces défis, la profession d'avocat se trouve actuellement en position de défense pour ne pas se défaire de ses règles, de ses traditions et de ses coutumes et perdre ainsi la confiance de ceux qui y recourent. Ces défis ne peuvent être relevés qu'en oeuvrant pour réformer et structurer la profession conformément à une organisation moderne et évoluée, qui préserve à la profession d'avocat son indépendance et son inviolabilité et garantit en même temps son développement et son adaptation aux nouvelles exigences. Ce défi vital ne peut être relevé qu'en assurant à la profession ses garanties d'éthique et ses coutumes authentiques contraignantes et en améliorant les compétences de l'avocat et le niveau d'accomplissement de sa mission, non seulement pour être plus au fait du domaine juridique mais aussi pour être efficace dans l'exercice de la profession, maîtrisant les nouvelles technologies du savoir et de la communication, ouvert sur la culture humaine et ayant une connaissance approfondie des nouvelles méthodes de management et de gestion. Car, toute négligence de ces facteurs est de nature à hypothéquer la liberté de l'avocat et son indépendance, deux conditions qui constituent le fondement et la garantie du succès de sa mission.",
    vocabulary: [
      { fr: "Organisation moderne et évoluée", ar: "تنظيم حديث ومتطور", explanation: "تحديث الهياكل والقوانين الداخلية المنظمة لنقابات المحامين لتتماشى مع العصر الرقمي وعولمة الخدمات القانونية." },
      { fr: "Garanties d'éthique", ar: "الضمانات الأخلاقية", explanation: "مجموعة الضوابط السلوكية والمهنية الصارمة التي تحمي شرف المهنة وتضمن ثقة المتقاضين في نزاهة دفاعهم." },
      { fr: "Méthodes de management et de gestion", ar: "أساليب التسيير والتدبير", explanation: "الآليات الحديثة لإدارة مكاتب المحاماة الكبرى كشركات مهنية منظمة تعتمد الكفاءة والرقمنة." }
    ],
    analysis: "يطرح الخطاب خطة عمل لإصلاح وهيكلة المهنة عبر 'تنظيم حديث ومتطور' (organisation moderne et évoluée)، واضعاً شرطين أساسيين لحماية استقلالية المحامي: تأمين 'الضمانات الأخلاقية' (garanties d'éthique) والتحكم في التقنيات الحديثة والتدبير الإداري العصري (méthodes de management)."
  },
  {
    id: 10,
    title: "التطلع للألفية الثالثة وتثمين جهود المحامين المغاربة والعرب",
    ar: "ونحن إذ نعرب عن تنويهنا باستضافة زملائكم المحامين المغاربة لهذه الدورة وباستشعارهم ومشاركتهم الواعية في هذا التوجه الذي نقوده اليوم من أجل بناء مجتمع ديمقراطي حداثي، لنؤكد ثقتنا في أن كافة المحامين العرب قادرون على النهوض بالمسؤوليات الملقاة على عاتقهم ورفع كل التحديات التي تحملها طلائع الألفية الثالثة، مثلما رفعوا تحديات القرن الذي نودعه بما هو معهود فيهم من غيرة على قيم الحق والعدل وروية وسداد في الرأي وعمل دؤوب ومشترك مع أسرة القضاء على دعم التنمية والديمقراطية وترسيخ دعائم دولة الحق والقانون وستجدون في جلالتنا وفي المملكة المغربية خير سند لكم في تحقيق هذه المقاصد السامية. أعانكم الله وسدد خطاكم وكلل أعمالكم بالتوفيق. والسلام عليكم ورحمة الله تعالى وبركاته.",
    fr: "Tout en saluant l'initiative de vos collègues avocats marocains d'accueillir cette session, leur prise de conscience et leur adhésion volontaire au processus que Nous menons actuellement pour l'édification d'une société démocratique moderne, Nous réaffirmons notre foi en la capacité de tous les avocats arabes à assumer les responsabilités qui sont les leurs et à relever tous les défis qui se profilent avec ce début du troisième millénaire, comme ils avaient relevé les défis du siècle que nous quittons, vu leur attachement constant aux valeurs de la justice et de l'équité, leur perspicacité, leur persévérance et leur action commune avec la famille de la justice pour soutenir le développement et la démocratie et consolider les fondements de l'Etat de droit. Vous trouverez auprès de Notre Majesté et du Royaume du Maroc le meilleur soutien pour la réalisation de ces nobles objectifs. Que la paix, la miséricorde et la bénédiction de Dieu soient sur vous.",
    vocabulary: [
      { fr: "Défi du troisième millénaire", ar: "تحديات الألفية الثالثة", explanation: "التحديات الهائلة التي تواجهها المجتمعات العربية في القرن الحادي والعشرين كالرقمنة، التنافسية الاقتصادية، والتحولات الجيوسياسية." },
      { fr: "L'édification d'une société démocratique moderne", ar: "بناء مجتمع ديمقراطي حداثي", explanation: "المشروع التنموي المتكامل للمغرب الذي يزاوج بين الحفاظ على القيم الأصيلة والتبني النشط لآليات الديمقراطية والتحديث." },
      { fr: "Le meilleur soutien", ar: "خير سند", explanation: "الالتزام الملكي الدائم والمطلق بدعم ومواكبة الهيئات الحقوقية والمهنية الساعية لإحقاق العدل وترسيخ دولة القانون." }
    ],
    analysis: "يختتم جلالة الملك الرسالة السامية بتأكيد ثقته الكبيرة في المحامين العرب للتصدي لـ 'تحديات الألفية الثالثة' (défis du troisième millénaire)، مجدداً التعبير عن الدعم الملكي الكامل كـ 'خير سند' (meilleur soutien) لهم في مسعاهم النبيل لترسيخ دولة الحق والقانون."
  }
];

const SPEECH_SECTIONS_2005: SpeechSection[] = [
  {
    id: 1,
    title: "افتتاح أعمال المؤتمر الـ 49 والاعتزاز بالاختيار والرهانات العالمية والمحلية للمحاماة",
    ar: "إنه لمن دواعي اعتزازنا ، أن يعقد الاتحاد الدولي للمحامين مؤتمره التاسع والأربعين على أرض المملكة المغربية، اختياراً منه لبلدنا ، كملتقى للحضارات، وأرض للحوار والتسامح والتشبع بقيم العدل وحقوق الإنسان، وتجسيدا لثقته في عزمنا الوطيد وعملنا الدؤوب، على المضي قدما في بناء المجتمع الديمقراطي التنموي الحداثي، المبني على التعددية الفكرية والسياسية، وسيادة القانون، في إطار دولة الحق والمؤسسات التي نعتبر فصل السلط، واستقلال القضاء، وضمان الدفاع عن الحقوق، وصيانتها بالمحاماة الملتزمة، من مقوماتها الراسخة.\nومما يجعل جمعكم الموقر يحظى برعايتنا السامية موضوعه الهام الذي وفقتم في اختياره، ولا سيما عندما ينصب النقاش وتبادل الأفكار على أخلاقيات مهنتكم النبيلة، في مداها الموحد، وما تطرحه من تساؤلات. فالموضوعات والقضايا التي سيعالجها مؤتمركم، وإن كانت مهنية خالصة في بعضها ، فإنها ذات طابع شمولي تستوعب المتغيرات المتسارعة التي يعرفها عالمنا، والمستجدات التي يفرضها التقدم التكنولوجي، واتساع الفجوة الرقمية، وكذا انعكاسات أثر العولمة وتحرير المبادلات على زيادة الهوة بين الدول النامية والدول المتقدمة. فضلا عن جعل قوة القانون، وخيار الأمان والسلام، يفرضان نفسهما على قانون القوة، ومنطق العنف والتنافر، المشحون بمخاطر الإرهاب المقيت وذلكم ما يطرح عدة تحديات حقيقية تشكل لديكم انشغالا بما سيكون عليه تفاعلكم المهني معها، والتكيف مع متغيراتها الحاسمة.",
    fr: "C'est pour Nous un réel motif de fierté que l'Union internationale des Avocats tienne son quarante-neuvième Congrès au Royaume du Maroc. En portant son choix sur notre pays, elle reconnaît en lui ce carrefour des civilisations et cette terre de dialogue et de tolérance, où les valeurs de justice et des droits de l'Homme sont fortement ancrées. Elle marque aussi sa confiance en la ferme volonté qui Nous anime et l'action soutenue que Nous menons pour aller de l'avant dans l'édification d'une société démocratique, développée et moderne, fondée sur le pluralisme culturel et politique et sur la suprématie de la loi, dans le cadre de l'Etat de droit et des institutions, lequel repose fondamentalement, de Notre point de vue, sur la séparation des pouvoirs, l'indépendance de la justice, ainsi que sur la garantie de la défense des droits et leur préservation par l'exercice engagé de la profession d'avocat.\nLa Haute Sollicitude dont Nous entourons votre rencontre tient à l'importance du thème que vous lui avez si pertinemment choisi, ainsi que par les débats et l'échange d'idées sur des questions d'importance telles la déontologie de votre noble métier et les différentes problématiques qu'elle suscite. Même si des questions parmi celles qui seront abordées par votre congrès, sont fondamentalement d'ordre professionnel, elles revêtent néanmoins un caractère global en rapport with les mutations rapides que connaît le monde, les innovations engendrées par les progrès technologiques, l'aggravation du fossé numérique, ainsi que l'accentuation des disparités entre les pays en développement et les nations avancées, notamment du fait des retombées de la mondialisation et de la libéralisation des échanges. Il s'y ajoute la nécessité de faire prévaloir la force de la loi et les impératifs de sécurité et de paix sur la loi de la force et la logique de la violence et de l'animosité, si lourde des périls du terrorisme immonde. Autant de faits qui posent un large éventail de défis qui retiendront votre attention, au sens où il vous faudra appréhender l'impératif d'interaction et d'adaptation de vos pratiques professionnelles aux changements décisifs qui en découlent.",
    vocabulary: [
      { fr: "Union internationale des Avocats", ar: "الاتحاد الدولي للمحامين", explanation: "" },
      { fr: "Royaume du Maroc", ar: "المملكة المغربية", explanation: "" },
      { fr: "Carrefour des civilisations", ar: "ملتقى للحضارات", explanation: "" },
      { fr: "Terre de dialogue et de tolérance", ar: "أرض للحوار والتسامح", explanation: "" },
      { fr: "Valeurs de justice", ar: "قيم العدل", explanation: "" },
      { fr: "Droits de l'Homme", ar: "حقوق الإنسان", explanation: "" },
      { fr: "Ferme volonté", ar: "عزمنا الوطيد", explanation: "" },
      { fr: "Action soutenue", ar: "عملنا الدؤوب", explanation: "" },
      { fr: "Société démocratique, développée et moderne", ar: "المجتمع الديمقراطي التنموي الحداثي", explanation: "" },
      { fr: "Pluralisme culturel et politique", ar: "التعددية الفكرية والسياسية", explanation: "" },
      { fr: "Suprématie de la loi", ar: "سيادة القانون", explanation: "" },
      { fr: "Etat de droit et des institutions", ar: "دولة الحق والمؤسسات", explanation: "" },
      { fr: "Séparation des pouvoirs", ar: "فصل السلط", explanation: "" },
      { fr: "Indépendance de la justice", ar: "استقلال القضاء", explanation: "" },
      { fr: "Garantie de la défense des droits", ar: "ضمان الدفاع عن الحقوق", explanation: "" },
      { fr: "Exercice engagé de la profession d'avocat", ar: "المحاماة الملتزمة", explanation: "" },
      { fr: "Haute Sollicitude", ar: "رعايتنا السامية", explanation: "" },
      { fr: "Déontologie de votre métier", ar: "أخلاقيات مهنتكم", explanation: "" },
      { fr: "Fossé numérique", ar: "الفجوة الرقمية", explanation: "" },
      { fr: "Libéralisation des échanges", ar: "تحرير المبادلات", explanation: "" }
    ],
    analysis: ""
  },
  {
    id: 2,
    title: "عولمة المهنة، قيم السلوك، واستقلال السلطة القضائية والعدل والإنصاف",
    ar: "فنحن نعيش عالما يتجه نحو النمطية والانفتاح، ويتجاوز في مسيرته الحثيثة آية نزعة إقليمية، أو انغلاق على الذات، أو إيثار للخصوصية على الكونية. بما يعنيه ذلك من أبعاد إيجابية، تتمثل في المزيد من تقنين حقوق الأفراد وتوسيعها ، ووضع الآليات الكفيلة بحمايتها وتنميتها وتحصينها من كل تداعيات سلبية تمس حقوق الإنسان في هويته وحرمته، أو في حريته وملكيته، أو تعكس انفلات التكنولوجيا المتطورة من المسؤولية الأخلاقية. وهو ما يستوجب التفكير في إرساء دعائم عدالة فعالة تواكب هذا التطور، وتصون حقوق الأفراد والجماعات، وخاصة في الدول النامية. ولا شك في أن هذه العدالة تمثل بالنسبة لكم فضاءا جديدا للقيام برسالتكم النبيلة.\nوبقدر ما أصبح لمهنة المحاماة من طابع عالمي، فإنها تواجه ضرورة توحيد القيم السلوكية المثلى، واعتماد التكوين المستمر، والاستجابة لمتطلبات مواكبة العالم الرقمي، والتوفيق بين وجوب احترام الحريات، وصيانة النظام العام، في ظل سيادة القانون وسلطة القضاء، دون أن ننسى أنها قبل كل شيء، مهنة إنسانية مثالية تقتضي إلى جانب الفقه القانوني، النزاهة في العمل من أجل مساعدة القضاء الذي يعتبر المحامون جزءا من أسرته الكبيرة الموقرة، وشريكا أساسيا له في تحمل مسؤولية إحقاق الحقوق ورفع المظالم على أسس العدل والإنصاف وسيادة القانون، ونشر الثقة والاستقرار اللازمين لتأمين الحياة الاجتماعية، وتحفيز الاستثمار، والنهوض بالتنمية الاقتصادية.\nولنا اليقين في أنكم ستكرسون جهودكم ونقاشكم، في سبيل ترسيخ تلكم المبادئ والقيم السلوكية التي ينبغي للمحامي احترامها ، والالتزام بضوابطها. فالمحامي يمارس المهام المنوطة به في نطاق تقاليد وأعراف مكتسبة على مدى أجيال، متقيدا في سلوكه المهني بمبادئ الاستقلال والتجرد والنزاهة، والكرامة والشرف، وما تقتضيه الأخلاق الحميدة.\nكما أن أسرة المحاماة لا يمكن أن تنهض بمهمتها ، ولا أن ترفع التحديات التي تواجهها ، ديمقراطية تنموية وطنية كانت، أو سلمية شرعية دولية، لإقامة نظام عالمي أكثر إنصافا وإنسانية وتضامنا إلا بالتشبث بالقيم الأخلاقية الراسخة وما ظل يتراكم من ممارسات اجتهادية مشرقة، تعتبر إضاءات لا يخبو نورها على مدى الزمن، وكذا من تبادل خبراتكم المتنوعة أيضا، وتحقيق الاندماج في الرسالة العالمية لمهنة المحاماة، بما تتطلبه من قدرة على التكيف مع التطور القضائي، ورفع التحدي القانوني للعولمة الشرسة، وجعل المحاماة الشريفة شريكة للعدالة النزيهة في تحقيق الحكامة الجيدة.",
    fr: "En effet, nous vivons aujourd'hui dans un monde de plus en plus standardisé et de plus en plus ouvert, poursuivant sa marche résolue, et faisant fi de toute tendance régionaliste, repli identitaire ou subordination de l'universalisme au singularisme. Ce mouvement planétaire produit un certain nombre d'effets positifs. Il favorise notamment la régulation normative et l'élargissement des droits individuels et renforce les mécanismes de protection des droits de l'Homme, notamment la sauvegarde de l'intégrité physique et morale de la personne, de sa liberté et de son droit de propriété, ainsi que sa préservation contre le risque de voir l'utilisation de la technologie avancée échapper aux normes de responsabilité éthique.\nIl devient donc nécessaire de réfléchir aux moyens à même de consolider les fondements de la Justice pour la mettre au diapason de ce progrès et de garantir de manière efficiente les droits individuels et collectifs, notamment dans les pays en développement. Nul doute que ce type de justice offre pour vous un nouvel espace d'exercice de votre noble mission.\nCette globalisation du métier d'avocat exige une plus grande harmonisation des référentiels d'une conduite vertueuse, l'adoption du principe de formation continue, et l'adaptation aux exigences du monde numérique. Elle nécessite de concilier respect des libertés et devoir de préservation de l'ordre public, dans le cadre de la suprématie de la loi et sous l'autorité de la justice. Nous ne devons pas non plus perdre de vue l'aspect avant tout humain et noble du métier d'avocat, qui, outre la connaissance des sciences juridiques, requiert de la probité professionnelle au service de la justice. Les avocats sont, en effet, des membres de la grande et honorable famille de la justice et son partenaire privilégié dans l'accomplissement de la mission qui lui est dévolue, à savoir rétablir les droits et redresser les torts sur des bases de justice, d'équité, de primauté de la loi, pour que règnent la confiance et la stabilité, gages de sécurité pour la société et stimulant de l'investissement et du développement économique.\nNous sommes convaincu que vous vous attacherez, à travers vos efforts et vos débats, à consacrer ces valeurs et principes de conduite auxquels l'avocat doit s'astreindre. En effet, celui-ci est tenu de se conformer à des conventions et à des usages professionnels qui se sont établis au fil des générations. Il a ainsi l'obligation d'observer scrupuleusement, dans l'exercice de son métier, les principes d'indépendance, d'impartialité, d'intégrité et d'honnêteté. Il doit constamment faire preuve d'une haute moralité et d'une grande dignité.\nPour s'acquitter convenablement de sa mission et relever les défis auxquels elle fait face, qu'ils soient en rapport avec les impératifs de la démocratie et du développement au niveau national, ou avec l'instauration de la paix et le respect de la légalité internationale, pour l'établissement d'un ordre mondial plus équitable, plus humain et plus solidaire, la communauté des avocats n'a d'autre choix que de demeurer fermement attachée aux valeurs morales immuables et de s'inspirer du patrimoine cumulé des pratiques jurisprudentielles lumineuses, qui ont traversé le temps comme autant de moments phares à l'éclat inaltérable.\nIl vous faudra également échanger vos diverses expériences et adhérer à la mission universelle du métier d'avocat, en développant notamment une aptitude à s'adapter continuellement aux progrès de la justice, à relever les défis juridiques d'une mondialisation féroce et à faire de cette profession le partenaire honorable d'une justice intègre, gage d'une bonne gouvernance.",
    vocabulary: [
      { fr: "Régulation normative", ar: "تقنين حقوق الأفراد", explanation: "" },
      { fr: "Responsabilité éthique", ar: "المسؤولية الأخلاقية", explanation: "" },
      { fr: "Justice efficiente", ar: "عدالة فعالة", explanation: "" },
      { fr: "Droits individuels et collectifs", ar: "حقوق الأفراد والجماعات", explanation: "" },
      { fr: "Globalisation du métier", ar: "عولمة المهنة", explanation: "" },
      { fr: "Conduite vertueuse", ar: "قيم سلوكية مثلى", explanation: "" },
      { fr: "Formation continue", ar: "التكوين المستمر", explanation: "" },
      { fr: "Préservation de l'ordre public", ar: "صيانة النظام العام", explanation: "" },
      { fr: "Autorité de la justice", ar: "سلطة القضاء", explanation: "" },
      { fr: "Sciences juridiques", ar: "الفقه القانوني", explanation: "" },
      { fr: "Probité professionnelle", ar: "النزاهة في العمل", explanation: "" },
      { fr: "Rétablir les droits", ar: "إحقاق الحقوق", explanation: "" },
      { fr: "Redresser les torts", ar: "رفع المظالم", explanation: "" },
      { fr: "Justice et équité", ar: "العدل والإنصاف", explanation: "" },
      { fr: "Indépendance et impartialité", ar: "الاستقلال والتجرد", explanation: "" },
      { fr: "Dignité et honnêteté", ar: "الكرامة والشرف", explanation: "" },
      { fr: "Légalité internationale", ar: "الشرعية الدولية", explanation: "" },
      { fr: "Ordre mondial équitable", ar: "نظام عالمي منصف", explanation: "" },
      { fr: "Pratiques jurisprudentielles", ar: "الممارسات الاجتهادية", explanation: "" },
      { fr: "Justice intègre", ar: "العدالة النزيهة", explanation: "" }
    ],
    analysis: ""
  },
  {
    id: 3,
    title: "أخلاقيات المهنة، العدالة الانتقالية، هيئة الإنصاف والمصالحة، والتنمية البشرية الشاملة",
    ar: "وفي عالم يعرف اهتزازا للمرجعيات القانونية والسلوكية والروحية الفاضلة وتصاعدا للأصوليات الهوجاء، ومدا للنزوعات المادية والتشيئية، فإننا نشيد بتركيز أعمالكم على إصدار الإعلان العالمي لأخلاقيات المهنة ونود التنويه في هذا الصدد، بما جسدته أسرة المحاماة، ليس فقط في المجال القضائي، بل أيضاً في كل ميادين النضال من أجل كرامة الإنسان وإحقاق الحق من التزام بالخلق الرفيع، داعين إياكم لتكريسه في مدونة للسلوك.\nوإننا لجد معتزين بكون هذا الإعلان سيرتبط إقراره ببلدكم الثاني المغرب وبخاصة بمدينة فاس العريقة التي أنشئت فيها جامعة القرويين التي تعد إحدى أقدم الجامعات في العالم، فظلت منارا للإشعاع الثقافي والحضاري الذي يستمد نسغه من أصالة المغرب وعقيدته الإسلامية السمحة، ومن انفتاحه على القيم الكونية، فضلا عن ثقافته التي انصهرت في بوتقتها الموحدة روافد ثقافية متعددة : أمازيغية، وعربية إسلامية، وإفريقية ومتوسطية وعالمية معاصرة، شرقية وغربية، شمالية وجنوبية متفاعلة ومبدعة لنسيج حضاري متميز بغنى مكوناته ، وانصهارها ضمن هوية فريدة في مزجها الخلاق بين الأصالة والمعاصرة.\nوإن من دواعي ابتهاجنا بملتقاكم، تزامنه مع تفعيل ما نحرص عليه من توجه حثيث، لإغناء وتحديث الإطار القانوني المنظم لمهنة المحاماة، لتواكب المستجدات وترقى إلى مستوى مواجهة التحديات، عاملين على أن تحقق التكامل والانسجام مع التطور الذي تعرفه هذه المهنة عالميا، على أساس التوفيق بين الخصوصية الوطنية والقيم الكونية. وهو الإطار الذي سوف يؤمن استقلالية المحاماة، ويرفع مستوى أدائها. كما أنه سيدعم سبل التواصل والتعاون والتشارك، مضيفا بذلك لبنة جديدة إلى ما شيدناه على درب الإصلاحات الكبرى التي نقودها بعزم وحزم للنهوض ببلدنا ، وجعله في مستوى الدول المتقدمة.\nفالمملكة المغربية حريصة على أن تظل رسالة الدفاع حاضرة بمصداقيتها في قلب الممارسة المؤسسية التي تنهض بها السلطة القضائية، باعتبارها الضامن الفعلي لمساواة المواطنين أمام القانون وسيادته، واستقرار المجتمع، والثقة في المعاملات، وتحفيز التنمية والاستثمار. ومن ثم جعلنا في مقدمة ركائز مشروعنا الديمقراطي الارتقاء بالعمل القضائي، وتأهيله باستمرار، مهيبين بوزارة العدل، وجمعية هيئات المحامين بالمغرب أن تنسج فيما بينها علاقات شراكة وتعاون ثابتة، في إطار المسؤولية والتعبئة من أجل تحديث المنظومة القانونية، وتأهيل كل الفاعلين في الحقل القضائي، مع الانفتاح على التجارب المثمرة، والاستشراف للغد الأفضل.\nأصحاب المعالي والسعادة، السيدات والسادة الأساتذة الأجلاء، لقد بوأ المغرب على الدوام، صدارة سياساته الداخلية والخارجية، الالتزام بالحق والمشروعية، وانتهاج سياسة فاضلة تعتمد الأخلاق والوفاء بالعهود ، وكذا العمل الدؤوب على تحقيق الإنصاف، وترجيح التسوية القانونية لفض كل المنازعات. وقد جعلنا من هذه المبادئ الكونية السامية عماد مذهبنا في الحكامة الجيدة، سواء لاستكمال بناء وإعلاء صرح الديمقراطية، أو لاسترجاع أقاليمنا الصحراوية الجنوبية وإنهاء النزاع المفتعل حول مغربيتها بالحل السياسي المتوافق عليه، في نطاق الشرعية الدولية، وبما يكفل لسكانها حكما ذاتيا في نطاق سيادة المملكة ووحدتها الترابية، اقتناعا منا بعدالة قضيتنا ، ويقينا منا بالمنطق العصري لعالم اليوم الذي لا يعترف إلا بالدول الديمقراطية القوية، والتكتلات الاقتصادية العملاقة، والذي لا مكان فيه للكيانات الهجينة والضعيفة.\nوحصاً منا على ترسيخ وتوسيع ما حققه المغرب من منجزات ديمقراطية ومكتسبات دستورية، مبنية على تفعيل ما التزم به من تشبث بحقوق الإنسان، كما هو متعارف عليها عالميا ، فقد عملنا على الانخراط في الأوفاق الدولية، ورفع التحفظات بشأن بعضها التي صارت غير ذات موضوع مع ما اعتمدناه من تشريعات متقدمة في كل المجالات، مستكملين بذلك اندماج بلادنا التام في المنظومة الحقوقية العالمية. كما فتحنا أوراشا كبرى، كرست السمو بالمنظومة القانونية للمملكة بما يصون الحريات ويوسع مجالها، سواء من خلال إقرار مدونات جديدة ومتقدمة للانتخابات والشغل علاوة على مشروع قانون الأحزاب السياسية الهادف إلى تأهيلها للنهوض بدورها كاملا كرافعة أساسية للمشاركة الديمقراطية وتكوين النخب المؤهلة للتدبير الجيد للشأن العام، أو على وجه الخصوص، بإعادة النظر في قانون المسطرة الجنائية، معززا بذلك مقومات المحاكمة العادلة، أخذا بالضمانات التي تحقق المساواة. كما تم تعديل قانون الصحافة والحريات العامة، بما يعطي لحرية التعبير مدلولها الحقيقي الملتزم.\nوتأكيداً منه لمناهضة كل ممارسة منبوذة قد تعرض الإنسان إلى التعذيب وتخدش كرامته، فقد أفرد المغرب مقتضيات جزرية رادعة، تنهل من الاتفاقية الدولية ذات الصلة بالموضوع، ضمن توجه شمولي وديمقراطي لتحديث وإصلاح قانون الجزاءات في إطار سياسة جنائية متقدمة.\nوقد كان منطلقنا في هذه الدينامية الحقوقية المتوالية والمتماسكة الحلقات إقدامنا منذ اعتلائنا العرش على المبادرة الشجاعة والفاضلة لإحداث هيئة للإنصاف والمصالحة، والهادفة للطي الحضاري والنهائي والعادل لماضي الانتهاكات الجسيمة لحقوق الإنسان من لدن شعب لا يتهرب من ماضيه، ولا يظل سجين سلبياته، عاملا على تحويله إلى مصدر قوة ودينامية لبناء مجتمع ديمقراطي وحداثي. وهذا ما أكدنا عليه خلال تنصيبنا لهيئة الإنصاف والمصالحة التي أصبحت اليوم، بفضل ما وفرناه لها من أسباب التجرد والاستقلال، ووسائل التحري، وإجلاء الحقيقة، وجبر الضرر، وبفعل التزام ونضالية مكوناتها ، في طليعة الهيئات القليلة المشهود لها ، ليس فقط عربيا وإسلاميا وإفريقيا ، بل عالميا، ومن قبل المنظمات المختصة بالريادة، لما طبع عملها البناء، من إسهام فاعل في جعل ما تنهض به من مهام العدالة الانتقالية، ركيزة أساسية لتحصين الانتقال الديمقراطي.\nتحدونا في ذلك عزيمة قوية لترسيخ حقوق وواجبات الإنسان، ثقافة وممارسة والتربية عليها، في تلازم بين دمقرطة الدولة والمجتمع وفي هذا السياق، دعمنا استقلال المجلس الاستشاري لحقوق الإنسان في نهوضه بحماية الحريات، وترسيخ المواطنة المسؤولة.\nكما أحدثنا ديوانا للمظالم، باعتباره مؤسسة وسيطة بين المواطن والإدارة، لإحقاق الحقوق، ورفع الحيف في إطار الإنصاف وبموازاة مع ذلك عملنا على تجسيد ما نتقاسمه مع دول العالم المتقدمة، من مبادئ تخليق الحياة العامة، ومحاربة الارتشاء واستغلال النفوذ بكل أنواعه، وذلك بالتوقيع على الاتفاقية الدولية لمحاربة الفساد ، والقيام ببلورة مضامينها ، وبتفعيل المحاسبة والمراقبة البرلمانية والقضائية والإدارية، في ظل سيادة القانون.\nكما أن المغرب يواصل في توافق والتحام منقطعي النظير، مسيرته الحثيثة والرصينة، في اتجاه تحقيق المساواة بين الرجال والنساء في الحقوق والواجبات وضمان التوازن والاستقرار الأسري من خلال مدونة جديدة ورائدة للأسرة، جمعت بتوفيق من الله بين الحفاظ على الأصالة الوطنية، وبين الانفتاح على العصر، وإنصاف المرأة ورعاية حقوق الطفل وتعميقا لمدلول المساواة بين المرأة والرجل في هذا اتجاه، قررنا تمكين أبناء المرأة المغربية من أب أجنبي من الجنسية المغربية، تجسيدا لصيانة تماسك العائلة المغربية وترسيخا لوعي أبنائها بالمواطنة المسؤولة. ولكي يحقق المغرب ما ننشده من تسريع وتيرة التقدم والتطور، أخذنا بالمنهج الشمولي للتنمية البشرية الذي يتوخى توطيد المكاسب الهامة في مجال الحقوق الأساسية، بإيلاء أهمية قصوى للنهوض بالحقوق الاقتصادية والاجتماعية والثقافية.\nولهذه الغاية، أقدمنا على إطلاق المبادرة الوطنية للتنمية البشرية». هدفنا الأسمى جعل الإنسان في صلب عملية التنمية، ومحورها ووسيلتها وغايتها، ضمن منظور محرر للطاقات، تشكل فيه الديمقراطية رديفا للتنمية والتضامن الاجتماعي وتكافؤ الفرص الكفيل بتمكين كل مغربية ومغربي من الاستثمار الأمثل المؤهلاتهما ، في إطار مشاركتهما الفاعلة في الحياة العامة، وبما يوفر لهما أسباب العيش الحر الكريم الذي يعد الغاية المثلى لما ننشده لهما من المواطنة المسؤولة والكاملة، وإن ما تم إنجازه في هذه الأوراش المتعددة، ليصب بكل روافده، في اتجاه تحقيق تطلعات شعبنا الأبي وشبابه الطموح، وتجسيد إرادتنا في الرقي بالملكية الدستورية المغربية إلى ملكية مواطنة، ملكية ديمقراطية فاعلة، لا تدخر جهداً في أن تجعل من المغرب بلدا جديرا بماضيه التليد، فاعلا في فضائه الجهوي والإقليمي متعاونا مع المنتظم الدولي في تحقيق السلم والتسامح والتضامن بين الشعوب.\nوإننا ، إذ نرحب بكل المشاركين في هذا الملتقى الهام، منوهين بالمبادئ السامية التي يقوم عليها اتحادكم الموقر، وبالمقاصد النبيلة التي يسعى لتحقيقها ، لواثقون بأن مؤهلاتكم القانونية والمهنية العالية، وخصالكم الأخلاقية الفاضلة، ستمكنكم من تتويج أعمالكم بالنجاح المحقق على المعهود في اتحادكم العتيد، من التزام ومسؤولية، وروح نضالية، وحضور في سائر المحافل والجبهات الوطنية والدولية ونصرة الحق والإنصاف والشرعية، سواء في المعاملات الفردية الجماعية، أو في مجال العلاقات الدولية.\nوفقكم الله لما فيه المزيد من دعم قيم العدل، بالوسيلة الحضارية والديمقراطية للقانون، والدفع بالتي هي أحسن، وتعزيز استقلال القضاء، ومؤازرته على تحقيق الإنصاف، والدفاع عن القضايا العادلة، وجعل منكم فرادى وجماعات، على الدوام طلائع ديمقراطية للمجتمع المدني، وللقوى الحية لكل أمة، وللبشرية جمعاء، في العمل الدؤوب والملموس، على ضمان كرامة الإنسان وأمنه على حريته وحقوقه وحرمته الشخصية والعائلية والوطنية والقومية، في كل ربوع العالم، وفي ظل الإخاء والمساواة والوئام والتضامن والسلم بين كل الأنام. والسلام عليكم ورحمة الله تعالى وبركاته",
    fr: "A cet égard, Nous saluons l'accent qui sera mis dans vos travaux sur la promulgation de la Déclaration mondiale sur la déontologie de la profession d'avocat. Ce projet répond, en effet, aux exigences d'un exercice conforme aux règles d'éthique de votre métier, dans un monde marqué par l'ébranlement des nobles références juridiques, comportementales et spirituelles et par la poussée des fondamentalismes aveugles, des matérialismes et des nihilismes. A ce propos, Nous tenons à rendre hommage à la communauté des avocats pour l'engagement de haute moralité auquel ses membres sont restés attachés, non seulement dans le domaine judiciaire, mais aussi sur tous les fronts de lutte pour la préservation de la dignité humaine et pour le rétablissement des droits. Aussi vous convions-Nous à consacrer cet engagement moral dans un Code de conduite.\nNous sommes particulièrement fier que ladite Déclaration sera associée, de par sa proclamation, à votre deuxième pays, le Maroc, notamment à la ville historique de Fès qui abrite l'Université Al-Quarwiyyine, l'une des plus anciennes universités au Monde. Cette cité a, en effet, constitué un haut lieu de rayonnement culturel et civilisationnel tirant sa gloire de l'authenticité du Maroc, de sa religion islamique généreuse et tolérante et de son ouverture sur les valeurs universelles, outre sa culture dont la matrix unifiée a intégré en son sein divers affluents culturels amazigh, arabo-islamique, africain, méditerranéen, mondial contemporain, oriental et occidental, boréal et austral. Voilà autant de composantes interactives et créatrices qui se sont mêlées les unes aux autres dans une texture civilisationnelle riche des éléments constitutifs d'une identité unique qui se distingue par un savant dosage entre authenticité et modernité.\nPar ailleurs, c'est pour Nous un réel motif de joie que la tenue de votre rencontre coïncide avec la mise en oeuvre d'une orientation à laquelle Nous nous sommes toujours attaché, à savoir enrichir et moderniser le cadre juridique organisant la profession d'avocat au Maroc pour la mettre au diapason des derniers développements et lui permettre de relever les défis auxquels elle fait face. Nous veillerons ainsi à ce qu'elle suive de manière cohérente et complémentaire le rythme des progrès qu'elle connaît à l'échelle mondiale, en alliant la spécificité nationale aux valeurs universelles. Outre la consolidation de l'indépendance de la profession et l'accroissement de son efficience, ce cadre permettra aussi d'intensifier les moyens de communication, de coopération et de partenariat, apportant ainsi une nouvelle pierre à l'édifice des grandes réformes que Nous conduisons avec fermeté et détermination, pour assurer l'essor de Notre pays et le hisser au niveau des nations avancées.\nA cet égard, le Royaume du Maroc est résolu à préserver la crédibilité de la mission dévolue à la défense dans le cadre des pratiques institutionnelles du pouvoir judiciaire. Celui-ci est, en effet, le véritable garant de l'égalité des citoyens devant la loi et de la suprématie de celle-ci, de la stabilité sociale, de l'instauration de la confiance dans les affaires et de la dynamisation du développement et de l'investissement. Aussi avons-Nous tenu à faire de l'amélioration et de la mise à niveau permanente de l'activité judiciaire l'un des fondements majeurs de notre projet démocratique.\nA cet égard, Nous exhortons le Ministère de la Justice et l'Association des Barreaux du Maroc à tisser des liens constants de partenariat et de coopération, dans un esprit de responsabilité et de mobilisation, en vue de la modernisation de notre dispositif juridique et la mise à niveau des différents intervenants dans le champ judiciaire, tout en restant ouvert sur les expériences réussies et en explorant les perspectives d'un avenir meilleur.\nLe Maroc a, de tout temps, accordé la priorité absolue, dans ses politiques intérieures et extérieures, à l'attachement sans faille à la légalité et à la légitimité, ainsi qu'à la poursuite d'une politique vertueuse fondée sur le respect des valeurs morales, la fidélité aux engagements pris, l'action inlassable en faveur de l'équité et le recours prioritaire à la loi pour le règlement des différends.\nNous avons fait de ces nobles valeurs universelles le fondement de Notre conception de la bonne gouvernance, que ce soit pour le parachèvement du process d'édification démocratique, ou la récupération de nos provinces sahariennes du Sud, ainsi que pour mettre un terme au conflit artificiel créé autour de leur marocanité par le biais d'une solution politique consensuelle et définitive, qui recueille l'appui de la communauté internationale et confère une autonomie à nos provinces du Sud, dans le cadre de la Souveraineté du Royaume, de son unité nationale et de son intégrité territoriale. En cela, nous sommes convaincus de la justesse de notre cause et adhérons à la logique qui sous-tend le monde d'aujourd'hui, où il n'y a de place qu'aux Etats démocratiques forts et aux méga-groupements économiques, et aucunement aux entités hybrides et faibles.\nAttaché que Nous sommes au raffermissement et à l'élargissement des réalisations démocratiques et des acquis constitutionnels que le Maroc a engrangés, en particulier la mise en œuvre de ses engagements en matière de respect des droits de l'Homme, tels qu'ils sont universellement reconnus, Nous avons veillé à ce que le Royaume du Maroc adhère aux différentes conventions internationales en la matière et lève les réserves formulées au sujet de certaines d'entre elles, devenues caduques au regard des législations avancées que nous avons adoptées dans tous les domaines. Cette démarche nous a ainsi permis de parachever l'adhésion pleine et entière du Maroc au système juridique international. Dans la même foulée, Nous avons lancé de grands chantiers qui ont permis de rehausser le dispositif juridique du Royaume et d'assurer ainsi la préservation des libertés et l'élargissement de leur espace. Cette action a été menée à travers la promulgation des nouveaux codes très avancés, électoral et du travail, auxquels viendra s'ajouter le projet de loi sur les partis politiques, destiné à assurer leur mise à niveau pour qu'ils puissent remplir pleinement leur rôle de levier essentiel de la participation démocratique et de la formation d'élites aptes à assurer une bonne gestion des affaires publiques.\nDans la même optique, une révision du Code de procédure pénale a été notamment opérée, ce qui a permis de renforcer les facteurs garants d'un procès juste et les garanties propres à concrétiser le principle d'égalité. Il a été également procédé à la révision du Code de la presse et de celui des libertés publiques, de sorte que la liberté d'expression puisse revêtir sa signification réelle basée sur l'esprit d'engagement et de responsabilité.\nConfirmant son attachement à combattre toute pratique éhontée soumettant l'Homme à la torture et portant atteinte à sa dignité, le Maroc a mis en place un dispositif répressif inspiré de l'Accord international pertinent, suivant une approche globale et démocratique, visant à moderniser et à réformer la législation pénale dans le cadre d'une politique avancée en la matière.\nCette dynamique juridique soutenue, aux maillons cohérents, a eu comme point de départ l'initiative courageuse et vertueuse que Nous avons lancée dès Notre accession au Trône, et qui a consisté en la création de l'Instance Equité et Réconciliation, avec pour mission le règlement définitif, civilisé et juste des graves violations passées des droits de l'Homme, ce processus mené par un peuple qui ne renie pas son passé, mais qui refuse de rester prisonnier de ses épisodes noirs, faisant de ce passé un facteur de force favorisant une dynamique propice à l'édification d'une société démocratique et moderne. Ce sont ces principes-là que Nous avons tenu à mettre en exergue lorsque Nous avons présidé l'installation de l'Instance Equité et Réconciliation.\nAinsi, grâce à ce que Nous lui avons assuré en termes de garanties d'impartialité et d'indépendance, et en moyens d'investigation, propres à assurer l'établissement de la vérité et la réparation des préjudices, et grâce également au sens élevé du devoir et de l'engagement militant de ses membres, l'IER figure désormais en première ligne des rares structures similaires reconnues pour leur leadership dans leur domaine d'action, non seulement aux niveaux arabe, islamique ou africain, mais aussi au niveau mondial, ainsi que par les organisations spécialisées. En effet, le travail louable qu'elle a accompli a fortement contribué à faire de sa mission en matière de justice transitionnelle un atout majeur pour la consolidation de la transition démocratique. Nous sommes, à cet égard, fermement déterminé à poursuivre Notre action pour le raffermissement des droits de l'Homme, en tant que culture et pratique, et l'éducation du citoyen sur les principes des droits et des devoirs, dans le cadre du lien organique entre la démocratisation de l'Etat et celle de la société.\nDans ce contexte, Nous avons renforcé l'autonomie du Conseil consultatif des Droits de l'Homme (CCDH) dans son action visant à protéger les libertés et à raffermir les valeurs de citoyenneté responsable. Nous avons également créé Diwan al-Madhalim, comme institution d'intermédiation entre le citoyen et l'administration, œuvrant pour rétablir les droits et lever les injustices dans un esprit d'équité. Parallèlement, Nous avons veillé à concrétiser les valeurs que nous partageons avec les nations avancées, concernant la moralisation de la vie publique, la lutte contre la corruption et l'abus d'influence sous toutes ses formes. A cet effet, le Maroc a signé l'accord international sur la lutte contre la corruption et s'attache à la concrétisation de ses dispositions, ainsi qu'à la mise en œuvre des mécanismes de suivi et de contrôle parlementaire, judiciaire et administratif, dans le cadre de la suprématie de la loi.\nBénéficiant d'un consensus et d'une symbiose exemplaires, le Maroc poursuit sa marche soutenue et rationnelle sur la voie de la réalisation de l'égalité entre les hommes et les femmes, en termes de droits et d'obligations, et de la préservation de l'équilibre et de la stabilité familiale, à travers la promulgation -par la Grâce de Dieu- d'un nouveau Code de la Famille qui allie la protection de l'authenticité nationale à l'ouverture sur l'esprit du temps, l'équité envers la femme à la protection des droits de l'enfant. Dans le même sens, et pour donner une portée plus grande à l'égalité entre l'homme et la femme, Nous avons décidé d'octroyer aux enfants nés d'une mère marocaine et d'un père étranger le droit d'obtenir la nationalité marocaine, soucieux que Nous sommes de préserver la cohésion de la famille marocaine et de sensibiliser davantage nos enfants aux valeurs de citoyenneté responsable.\nD'autre part, et pour permettre au Maroc d'atteindre le rythme accéléré de progrès et de développement que Nous lui souhaitons, Nous avons adopté l'approche globale de développement humain qui vise à consolider les importantes réalisations accomplies en matière de droits politiques, en accordant un intérêt prioritaire à la promotion des droits économiques, sociaux et culturels. A cet effet, Nous avons lancé l'Initiative nationale pour le Développement humain, Notre ultime objectif étant de placer l'homme au cœur du processus de développement, d'en faire son pivot, son moyen et sa finalité. Cette Initiative procède ainsi d'une vision libératrice des énergies, et où la démocratie est synonyme de développement, de solidarité sociale et d'égalité des chances. Une égalité qui vise à permettre à tous les Marocains, hommes et femmes, d'optimiser la mise en valeur de leurs potentialités, dans le cadre d'une participation active à la vie publique, et dans des conditions propices à une vie digne, qui constitue la finalité suprême de la citoyenneté responsable, pleine et entière que Nous leur souhaitons. Les réalisations atteintes au titre de ces multiples chantiers convergent toutes vers la concrétisation des aspirations qui animent Notre peuple valeureux et sa jeunesse ambitieuse, tout comme elles tendent à donner corps à Notre volonté de hisser la Monarchie constitutionnelle marocaine au rang de Monarchie citoyenne, démocratique, agissante, ne ménageant aucun effort pour faire du Maroc un pays digne de son passé glorieux, actif dans son environnement sous-régional et régional, et contribuant aux efforts de la communauté internationale pour la concrétisation des valeurs de paix, de tolérance et de solidarité entre les peuples.\nEn souhaitant la bienvenue aux participants à cette importante rencontre, et en louant les hautes valeurs qui sous-tendent l'action de votre Union, ainsi que les nobles idéaux qu'elle aspire à concrétiser, Nous sommes convaincu que vos grandes compétences juridiques, votre professionnalisme émérite et vos vertus morales, vous permettront d'assurer plein succès à vos travaux, comme cela a toujours été le cas pour votre prestigieuse Union qui a constamment fait preuve d'engagement, de responsabilité et de militantisme et qui s'est toujours signalée par sa présence aux différents forums et sur une multitude de fronts, aux plans national et international, ainsi que par son attachement à la défense des principes de justice, d'équité et de légalité, que ce soit au titre des relations d'échange individuelles et collectives, ou dans le cadre des relations internationales.\nPuisse Dieu vous accorder davantage de réussite dans votre action permanente au service de la promotion et de la consolidation des valeurs de justice, armés en cela de cet instrument civilisé et démocratique qu'est le droit, et attachés à repousser le mal par le bien, à renforcer l'indépendance de la Justice et à soutenir celle-ci dans sa quête de l'équité. Nous prions le Tout-Puissant de l'aider à défendre les causes justes et à demeurer, à titre individuel et collectif, en première ligne de l'élite démocratique de la société civile, des forces vives de chaque nation et de l'humanité tout entière, engagés dans une action soutenue, permanente et concrète en faveur de la préservation de la dignité de l'Homme, de la sécurité et de l'inviolabilité de ses droits et de son intégrité, tant personnelle et familiale qu'aux niveaux national et international, sous toutes les latitudes, et sous le règne de la fraternité, de l'égalité, de la concorde, de la solidarité et de la paix entre tous les humains.",
    vocabulary: [
      { fr: "Déclaration mondiale sur la déontologie", ar: "الإعلان العالمي لأخلاقيات المهنة", explanation: "" },
      { fr: "Code de conduite", ar: "مدونة للسلوك", explanation: "" },
      { fr: "Authenticité et modernité", ar: "الأصالة والمعاصرة", explanation: "" },
      { fr: "Cadre juridique", ar: "الإطار القانوني", explanation: "" },
      { fr: "Pratiques institutionnelles", ar: "الممارسة المؤسسية", explanation: "" },
      { fr: "Égalité des citoyens devant la loi", ar: "مساواة المواطنين أمام القانون", explanation: "" },
      { fr: "Amélioration de l'activité judiciaire", ar: "الارتقاء بالعمل القضائي", explanation: "" },
      { fr: "Association des Barreaux du Maroc", ar: "جمعية هيئات المحامين بالمغرب", explanation: "" },
      { fr: "Règlement des différends", ar: "فض المنازعات", explanation: "" },
      { fr: "Code de procédure pénale", ar: "قانون المسطرة الجنائية", explanation: "" },
      { fr: "Procès juste", ar: "المحاكمة العادلة", explanation: "" },
      { fr: "Instance Equité et Réconciliation", ar: "هيئة الإنصاف والمصالحة", explanation: "" },
      { fr: "Justice transitionnelle", ar: "العدالة الانتقالية", explanation: "" },
      { fr: "Conseil consultatif des Droits de l'Homme", ar: "المجلس الاستشاري لحقوق الإنسان", explanation: "" },
      { fr: "Diwan al-Madhalim", ar: "ديوان المظالم", explanation: "" },
      { fr: "Moralisation de la vie publique", ar: "تخليق الحياة العامة", explanation: "" },
      { fr: "Lutte contre la corruption", ar: "محاربة الفساد", explanation: "" },
      { fr: "Code de la Famille", ar: "مدونة الأسرة", explanation: "" },
      { fr: "Initiative nationale pour le Développement humain", ar: "المبادرة الوطنية للتنمية البشرية", explanation: "" },
      { fr: "Monarchie constitutionnelle", ar: "الملكية الدستورية", explanation: "" }
    ],
    analysis: ""
  }
];

const SPEECH_SECTIONS_2007: SpeechSection[] = [
  {
    id: 1,
    title: "الذكرى الخمسينية لتأسيس المجلس الأعلى وتأسيس استقلال القضاء",
    ar: "حضرات الأساتذة قضاة المجلس الأعلى أصحاب الفضيلة القضاة والمحامين وأسرة العدالة، معشر الحضور الكريم\nإنه لمن دواعي اعتزازنا أن يخلد المجلس الأعلى الذكرى الخمسينية لتأسيسه، وأن نتوجه اليوم إلى المشاركين في أشغال هذه الندوة الدولية الهامة التي يختتم بها المجلس احتفالاته التي امتدت على مدى السنة الجارية، اعتبارا للمكانة المتميزة التي تحظى بها لدينا أسرة العدالة بصفة عامة ، وهيأتها القضائية العليا بصفة خاصة.\nلقد كان المجلس الأعلى في مقدمة المؤسسات التي وضع أسسها جدنا المنعم جلالة الملك محمد الخامس في بداية عهد الاستقلال، حرصا من جلالته، أكرم الله مثواه على تجسيد السيادة الوطنية والتأسيس لاستقلال القضاء.\nومن هذا المنطلق، تشكل هذه الذكرى محطة تاريخية ترمز إلى عهد زاخر بالبناء بناء الدولة المغربية العصرية، على أسس الملكية الدستورية الديمقراطية والاجتماعية القائمة على توطيد دولة الحق والمؤسسات والالتزام بمبدأ فصل السلط وترسيخ سيادة القانون وإقامة العدل والإنصاف، باعتبارها من وظائف الإمامة العظمى التي نحن على القيام بها مؤتمنون، وعلى محجتها البيضاء سائرون، ذودا عن المقدسات والحرمات وصونا للسيادة والوحدة الوطنية، وسهرا على الأمن والطمأنينة والاستقرار وحماية للحقوق والحريات الفردية والجماعية.\nويطيب لنا أن نعرب عن عميق تقديرنا ، لما قام به المجلس الأعلى، لتخليد هذا الحدث البارز في تاريخ القضاء ببلادنا من احتفالات متسمة بالإتقان، وذلك ضمن أعمال جديرة بالإشادة لما تميزت به من جمع بين تنظيم الندوات القيمة والمتعددة حول مسار القضاء والعدالة بالمملكة، وبين تنظيم المعارض الجهوية التي اشتملت على الوثائق والمستندات والمؤلفات والإصدارات الجامعة للدراسات والأبحاث القضائية ومختلف السجلات والصور والأفلام.\nوهو ما جعل المغاربة قاطبة يستحضرون بكل افتخار المنجزات الكبرى التي قام بها جدنا المقدس ووالدنا المنعم جلالة الملكين محمد الخامس والحسن الثاني، خلد الله في الصالحات أعمالهما ، في مجال تشييد قضاء عصري، وذلكم ضمن صرح متجدد ، نحن أشد حرصا على إصلاحه وتطويره دعما لأسسه وصيانة لحرمته، وتأهيلا لكل مكوناته، والإسهام المخلص في ترسيخ دولة الحق وسيادة القانون والنهوض بالتنمية.\nونود التنويه بما قام به المجلس الأعلى من إصدار العديد من المجلدات المتضمنة الأعمال واجتهادات قضاته على امتداد نصف قرن من العطاء والتجديد ، وذلك بمختلف اللغات، فضلا عن نشره لأهم أحكامه، وكذا للقرارات التي تهم المغرب الصادرة عن بعض المحاكم العليا الأجنبية، بالإضافة إلى الأحكام المتعلقة بمجلس الاستئناف الشرعي الأعلى.\nومما لا ريب فيه أن هذه الأعمال الجليلة والمتعددة المقاصد تقدم صورة متكاملة عن مسار العدالة في المغرب، وتعتبر مرجعا ثمينا لكل رجال ونساء القضاء والقانون ولكل باحث عن الاجتهاد القضائي في مجال معين",
    fr: "Honorables juges de la Cour Suprême.\nHonorables gens de robe et autres membres de la famille de la justice.\nMesdames, Messieurs.\nC'est, pour Nous, un motif de joie que la Cour Suprême célèbre son cinquantenaire et que Nous nous adressions aujourd'hui aux participants prenant part à cet important séminaire international par lequel la Cour Suprême boucle une série de manifestations commémoratives qui s'est étalée sur toute l'année en cours. Nous en sommes heureux, eu égard à la place privilégiée qu'occupe auprès de Nous la famille de la justice en général, et plus particulièrement, son instance judiciaire suprême.\nLa Cour Suprême faisait partie des premières institutions dont Notre vénéré Grand Père, le Roi Mohammed V- que Dieu sanctifie Son âme, avait posé les fondations, marquant ainsi sa volonté de donner son expression concrète à la souveraineté nationale, et de poser les jalons fondateurs d'une justice indépendante.\nCette commémoration marque donc d'une pierre blanche l'histoire de notre pays. Elle incarne une ère foisonnant de chantiers pour l'édification d'un Etat marocain moderne, ayant pour socle la monarchie constitutionnelle, démocratique et sociale, et pour piliers le renforcement de l'Etat de droit et les institutions, l'attachement au principe de la séparation des pouvoirs, la consolidation de la règle de la primauté de la loi et l'administration de la justice dans l'équité. Celle-ci s'impose d'autant plus qu'elle relève intrinsèquement des attributs de la \" Imamat \" Suprême dont Nous sommes le dépositaire, et qui Nous éclaire la voie dans Notre volonté de défendre les valeurs et institutions sacrées et de protéger la souveraineté et l'unité nationale de notre pays. C'est aussi en vertu des devoirs inhérents à la \" Imamat \" que Nous veillons à la sécurité, la quiétude et la stabilité des citoyens, ainsi qu'à la protection des droits et des libertés individuels et collectifs.\nNous nous réjouissons profondément de tout ce qui a été fait par la Cour Suprême pour la parfaite organisation des célébrations qui ont donné tout l'éclat qu'elle mérite à la commémoration de cet événement majeur de l'histoire judiciaire de notre pays. Ce qui leur a conféré un relief particulier, ce sont les nombreux colloques et séminaires de haute facture académique qui ont été organisés au sujet du parcours judiciaire du Royaume, ainsi que les expositions régionales qui ont permis d'admirer, entre autres, les documents et les archives, les recueils et les corpus d'études et de recherches judiciaires, outre les divers registres et supports sonores et visuels.\nVoila pourquoi les Marocains se remémorent unanimement et avec beaucoup de fierté les grandes réalisations accomplies par Nos vénérés Grand Père et Père, Leurs Majestés les Rois Mohammed V et Hassan II que Dieu bénisse leur œuvre éternellement pour édifier une justice moderne. Nous avons donc particulièrement à cœur d'assurer la réforme et le développement de cet édifice, pour en consolider les fondations, en préserver l'inviolabilité et mettre à niveau toutes ses composantes. Nous entendons le voir apporter une contribution sincère au raffermissement de l'Etat de droit, de la primauté de la loi, et du processus de développement en cours.\nNous tenons à rendre hommage à la Cour Suprême pour la publication, dans différentes langues, de nombreux volumes, où se trouve consigné le fruit de tant de travaux et d'efforts jurisprudentiels, qui ont été menés au cours d'un demi siècle riche en apports féconds et innovants, et ce, outre la publication des principaux jugements de la Cour, des décisions concernant le Maroc, rendues par de hautes instances judiciaires étrangères et des arrêts de justice concernant le Conseil supérieur des cours d'appel en droit musulman.\nNul doute que des travaux aussi éminents, aux desseins si nombreux, donnent une image assez complète de l'itinéraire de la justice au Maroc. Ils constituent assurément une référence précieuse pour les hommes et les femmes de la magistrature et de la loi, et pour tout chercheur.",
    vocabulary: [
      { fr: "La Cour Suprême", ar: "المجلس الأعلى", explanation: "" },
      { fr: "Son cinquantenaire", ar: "الذكرى الخمسينية لتأسيسه", explanation: "" },
      { fr: "Séminaire international", ar: "ندوة دولية", explanation: "" },
      { fr: "La famille de la justice", ar: "أسرة العدالة", explanation: "" },
      { fr: "L'instance judiciaire suprême", ar: "الهيئة القضائية العليا", explanation: "" },
      { fr: "L'indépendance de la justice", ar: "استقلال القضاء", explanation: "" },
      { fr: "La souveraineté nationale", ar: "السيادة الوطنية", explanation: "" },
      { fr: "La monarchie constitutionnelle", ar: "الملكية الدستورية", explanation: "" },
      { fr: "L'Etat de droit et les institutions", ar: "دولة الحق والمؤسسات", explanation: "" },
      { fr: "La séparation des pouvoirs", ar: "فصل السلط", explanation: "" },
      { fr: "La primauté de la loi", ar: "سيادة القانون", explanation: "" },
      { fr: "L'administration de la justice dans l'équité", ar: "إقامة العدل والإنصاف", explanation: "" },
      { fr: "Les droits et les libertés individuels et collectifs", ar: "الحقوق والحريات الفردية والجماعية", explanation: "" },
      { fr: "Les recherches judiciaires", ar: "الأبحاث القضائية", explanation: "" },
      { fr: "La jurisprudence", ar: "الاجتهاد القضائي", explanation: "" },
      { fr: "Une justice moderne", ar: "قضاء عصري", explanation: "" },
      { fr: "Jugements", ar: "أحكام", explanation: "" },
      { fr: "Décisions", ar: "قرارات", explanation: "" },
      { fr: "Hautes instances judiciaires", ar: "المحاكم العليا", explanation: "" },
      { fr: "Conseil supérieur des cours d'appel", ar: "مجلس الاستئناف الشرعي الأعلى", explanation: "" }
    ],
    analysis: ""
  },
  {
    id: 2,
    title: "مستقبل القضاء في القرن 21 وتحديات العولمة والألفية الثالثة",
    ar: "أصحاب الفضيلة والسعادة، حضرات السيدات والسادة،\nإن تتويج احتفالات المجلس الأعلى بالذكرى الخمسينية لتأسيسه بهذه الندوة الدولية الهامة حول مستقبل القضاء في القرن الحادي والعشرين ليندرج ضمن منظورنا الشامل لاستشراف مستقبل العدالة في المغرب وفي غيره من بلدان المعمور\nكما أنه يجسد اهتمامنا الكبير بشؤون العدالة الذي يبرز جليا في الانشغال الدائم لقضاتنا بمواكبة ما تحمله الألفية الثالثة من تحديات على المستوى الدولي، وذلك في سياق عالمي يعرف تحديات وتغيرات متسارعة بفعل العوامل الاقتصادية والتجارية ذات التكنولوجيا المتطورة، وتنامي نزوعات التطرف والإرهاب، وكثافة وتعقد العلاقات الدولية بفعل اكتساح العولمة بشتى تجلياتها وانعكاساتها لمختلف مناحي العلاقات الاجتماعية والاقتصادية، وما أفرزته من أقضية ومنازعات غير مسبوقة، مما يتطلب اعتماد فقه الواقع، والاجتهاد في التفاعل مع نوازله، ويضاعف أهمية القانون والقضاء في نظر الفاعلين الاقتصاديين والسياسيين في إيجاد حلول وتسويات عادلة لها. كما أنه يجعل العدالة، وفي طليعتها المجلس الأعلى الموقر، أثقل مسؤولية في مواجهة هذه التحولات.\nوإن حضور نخبة من رؤساء المحاكم العليا ، من مختلف الدول والقارات، وكذا عدد من الفقهاء والقضاة والمحامين المغاربة والأجانب المرموقين، لأشغال هذه الندوة الهامة، لمن شأنه الارتقاء بالمناقشات، وتبادل الخبرات والآراء، في فضاءات الفكر القانوني والقضائي والفقهي وإضفاء طابع التألق والإشعاع على أعمالها.\nوفي هذا السياق، ننوه بالحضور المتميز للشخصيات المرموقة المشاركة في هذه الندوة، مرحبين بهم في بلدهم الثاني المغرب المنفتح عبر التاريخ على مختلف الثقافات والحضارات، والمؤمن بضرورة التعاون الدولي وتضافر كل الجهود الهادفة إلى ترسيخ السلام والأمن والعدل والإنصاف بين الأمم وداخل المجتمعات.\nوفي هذا الإطار، يندرج حرصنا على أن ينشر المجلس الأعلى، كل ما يتعلق بتاريخنا القضائي والفقهي، وجعله مجالا فسيحا أمام الباحثين والمهتمين من رجال القانون والقضاء، للدراسة والتحليل والتأويل",
    fr: "Le fait que la Cour Suprême couronne les célébrations marquant son cinquantenaire, par l'organisation de cette importante rencontre internationale, sur l'avenir de la justice au 21è siècle, s'inscrit parfaitement dans la vision intégrée que Nous avons, pour entrevoir l'avenir de la justice au Maroc et ailleurs.\nIl traduit également tout l'intérêt que Nous attachons aux questions de justice et qui trouve clairement son illustration dans le souci constant de nos magistrats d'être en phase avec les exigences du 3ème millénaire, et les défis dont il est porteur, dans un contexte mondialisé, marqué par des mutations rapides. Ces changements sont imputables à un faisceau de facteurs économiques et commerciaux faisant appel à une technologie pointue, ainsi qu'à la montée des démons de l'extrémisme et du terrorisme, ainsi qu'à la densité et à la complexité des relations internationales. Ces mutations sont aussi la conséquence de la déferlante globalisante, aux multiples facettes et aux diverses répercussions sur les relations sociales et économiques, notamment l'émergence d'un type inédit de litiges et de contentieux sans précédent.\nTout ceci exige l'adoption d'une jurisprudence de la réalité, ainsi que la faculté d'adaptation et d'interaction avec les impératifs qui en découlent. Du coup, la loi et la justice assument, aux yeux des acteurs économiques et politiques, une importance accrue, pour apporter aux litiges précités, des solutions et des règlements équitables. De même que la responsabilité de la justice, et au premier chef, de l'honorable Cour Suprême, n'en est que plus grande, pour faire face à ces mutations.\nLa participation aux travaux de cette importante manifestation, d'une constellation de Présidents de Cours Suprêmes, de différents Etats et de divers continents, ainsi que celle d'un si grand nombre de jurisconsultes, de magistrats et d'éminents avocats marocains et étrangers, sont le gage d'un debate de haute facture, promettant un échange fructueux d'expériences et d'avis, dans un espace de réflexion juridique, judiciaire et jurisprudentielle, ainsi qu'un impact et un retentissement positifs pour ces travaux.\nC'est dire à quel point Nous nous réjouisons de la présence et de la participation de ces éminentes personnalités. Nous leur souhaitons la bienvenue dans leur deuxième pays, le Maroc, qui s'est toujours montré ouvert sur les différentes cultures et civilisations, et qui croit fermement en la nécessité d'une coopération internationale et d'efforts concertés, voués à la consolidation de la paix et de la sécurité, de la justice et de l'équité, entre les nations et au sein des communautés.\nC'est dans cet esprit que s'inscrit Notre vœu de voir la Cour suprême publier tout ce qui se rattache à notre histoire judiciaire et jurisprudentielle, de sorte à en faire un vaste domaine d'étude, d'analyse et d'interprétation pour les chercheurs parmi les juristes, les magistrats et les autres personnes intéressées.",
    vocabulary: [
      { fr: "L'avenir de la justice", ar: "مستقبل العدالة", explanation: "" },
      { fr: "Réflexion juridique, judiciaire et jurisprudentielle", ar: "الفكر القانوني والقضائي والفقهي", explanation: "" },
      { fr: "Coopération internationale", ar: "التعاون الدولي", explanation: "" },
      { fr: "La paix, la sécurité, la justice et l'équité", ar: "السلام والأمن والعدل والإنصاف", explanation: "" },
      { fr: "Mutations rapides", ar: "تحديات وتغيرات متسارعة", explanation: "" },
      { fr: "La globalisante", ar: "العولمة", explanation: "" },
      { fr: "Litiges et contentieux", ar: "الأقضية والمنازعات", explanation: "" },
      { fr: "Jurisprudence de la réalité", ar: "فقه الواقع", explanation: "" },
      { fr: "Présidents de Cours Suprêmes", ar: "رؤساء المحاكم العليا", explanation: "" },
      { fr: "Jurisconsultes, magistrats et avocats", ar: "الفقهاء والقضاة والمحامين", explanation: "" },
      { fr: "Échange d'expériences et d'avis", ar: "تبادل الخبرات والآراء", explanation: "" },
      { fr: "L'interprétation", ar: "التأويل", explanation: "" },
      { fr: "L'histoire judiciaire", ar: "تاريخنا القضائي", explanation: "" },
      { fr: "Les impératifs qui en découlent", ar: "نوازله", explanation: "" },
      { fr: "Les acteurs économiques et politiques", ar: "الفاعلين الاقتصاديين والسياسيين", explanation: "" },
      { fr: "Règlements équitables", ar: "تسويات عادلة", explanation: "" },
      { fr: "Les questions de justice", ar: "شؤون العدالة", explanation: "" },
      { fr: "Les communautés", ar: "المجتمعات", explanation: "" },
      { fr: "L'étude, d'analyse et d'interprétation", ar: "الدراسة والتحليل والتأويل", explanation: "" },
      { fr: "Le 3ème millénaire", ar: "الألفية الثالثة", explanation: "" }
    ],
    analysis: ""
  },
  {
    id: 3,
    title: "النهج القويم للعدل كأساس للملك وضمان استقلال القضاء وإصلاحه",
    ar: "ونغتنم هذه المناسبة، لنجدد الإعراب عما نكنه لأسرة العدالة الأثيرة لدى جلالتنا ، وللقضاة رفيعي الدرجة، ولصفوتهم بالمجلس الأعلى من مختلف الأجيال التي تعاقبت على حمل هذه الأمانة من تقدير واعتبار\nوإننا حريصون على السير على النهج القويم لأسلافنا الميامين الذي أقاموا دولة المغرب الموحدة، منذ أزيد من اثني عشر قرنا ، على الأساس الصحيح والحصن الحصين للعدل، جاعلين منه أساس الملك. ولذلك يذكر التاريخ للمغرب، ملكا شعبا، أنه كان يحيط القضاة بما يستحقونه من تبجيل واحترام.\nوهو ما نحن بصفتنا أميرا للمؤمنين، مؤتمنون عليه وحريصون على ترسيخه وفاء لعهد البيعة المقدسة، والتزاما بأحكام دستور المملكة ملتزمين بضمان استقلال القضاء وإصلاحه، لما له من دور حيوي في توطيد أسس الديمقراطية، وتحقيق الأمن القضائي، وترسيخ الثقة اللازمة لتحفيز الاستثمار، والنهوض بالتنمية.\nوكما أكدنا ذلك، وخاصة في خطاب العرش الأخير وافتتاح البرلمان، فإننا حريصون على القيام بإصلاح عميق وشامل لقطاع القضاء، سنتولى الإعلان عن خطوطه العريضة، في المدى القريب، بعون الله وتوفيقه. وإننا لواثقون من أن أسرة العدالة، وخاصة المجلس الأعلى، باعتباره أعلى هيئة قضائية وطنية، سيشكل قاطرة لهذا الإصلاح المنشود لكونه يضم خيرة قضاة المملكة، في طليعتهم الرئيس الأول للمجلس، والوكيل العام للملك به المشهود لهم بالكفاءة والنزاهة والتجرد والغيرة على حرمة القضاء واستقلاله.\nكما أننا على يقين بأن وزيرنا في العدل، بما هو معهود فيه من تشبث بثوابت الأمة ومقدساتها، والتزام ثابت، وإسهام صادق وموصول في توطيد دعائم دولة الحق والقانون، في مختلف المسؤوليات السامية التي تقلدها ، لن يدخر جهدا في العمل تحت قيادتنا في حرص على استقلال القضاء، واحترام لمبدأ فصل السلط من أجل زيادة إشعاع المجلس الأعلى، وتمكينه من الوسائل الضرورية للنهوض بالأمانة الجسيمة الملقاة على عاتقه.\nكما أن أسرة القضاء، بصفة عامة، ستعمل على الانخراط بفعالية ومسؤولية في هذا الإصلاح الجذري والمصيري الذي يعد من شروط صيانة المواطنة الكاملة والتنمية الشاملة التي تنشدها لوطننا العزيز. غايتنا المثلى أن يظل المجلس، اسما على مسمى: قمة شامخة لصرح قضاء مستقل ونزيه ومنارة مشعة للاجتهاد المواكب للمستجدات. داعين أسرته الموقرة، لمضاعفة جهودها الموفقة، لجعله قاطرة لهذا الإصلاح المنشود من أجل تحقيق المزيد من التحديث والعصرنة والتوثيق والشفافية والانفتاح، في التزام دائم بسيادة القانون، ومساواة كل المواطنين أمامه معربية\nوفقكم الله، وسدد خطاكم، وكلل مساعيكم وأعمال هذه الندوة بالنجاح. والسلام عليكم ورحمة الله تعالى وبركاته",
    fr: "Nous saisissons cette occasion pour dire toute l'estime et toute la considération que Notre Majesté porte à l'honorable famille de la justice, aux magistrats de haut rang, ainsi qu'à leur élite siégeant à la Cour suprême, et à tous ceux qui se sont passé le relais pour assumer cette charge.\nNous nous attachons également à suivre la voie judicieuse tracée par Nos Vénérés Aïeux qui, depuis plus de onze siècles, ont érigé l'Etat marocain unifié sur de solides assises et l'ont entouré d'un rempart infranchissable, celui de la justice dont ils ont fait, à juste titre, le socle sur lequel repose le pouvoir. Voilà pourquoi l'histoire retient que le Maroc, à travers ses Rois et son peuple, avait toujours manifesté aux magistrats les égards et le respect qui leur étaient dus.\nC'est là une responsabilité dont Nous restons dépositaire, en Notre qualité d'Amir Al-Mouminine, et une réalité que Nous tenons à conforter et à consolider, fidèle en cela au pacte sacré de la Beia et attaché que Nous sommes aux dispositions de la Constitution du Royaume. Nous avons également le souci constant de garantir l'indépendance et d'assurer la réforme de la justice, compte tenu du rôle clé qui lui revient dans l'oeuvre visant à consolider les piliers de la démocratie, assurer la sécurité judiciaire et instaurer la confiance nécessaire pour stimuler l'investissement et dynamiser le processus de développement.\nAinsi que Nous l'avons réaffirmé, notamment lors du dernier Discours du Trône et à l'occasion de l'ouverture du Parlement, Nous entendons engager une réforme profonde et globale du secteur de la justice, réforme dont Nous annoncerons, à brève échéance, les grandes lignes.\nNous sommes convaincu que la famille de la justice, notamment la Cour suprême, la plus haute instance judiciaire du pays, poursuivra inlassablement ses efforts pour faire aboutir cette réforme, tant il est vrai que cette instance comprend en son sein les plus éminents magistrats du Royaume, avec à leur tête, le premier Président de la Cour, et le Procureur général du Roi à la Cour, connus et reconnus pour leur compétence, leur intégrité, leur impartialité et leur attachement à l'inviolabilité et l'indépendance de la justice.\nNous sommes également convaincu que Notre ministre de la justice, -fort des qualités qu'on lui a toujours connues, en l'occurrence un attachement jamais démenti, dans les nombreuses et hautes fonctions qu'il a assumées, aux valeurs constantes et sacrées de la nation, un engagement ferme et un apport sincère et constant en faveur de la consolidation de l'Etat de droit-, ne ménagera aucun effort pour œuvrer scrupuleusement, sous Notre conduite, à ce que l'indépendance de la justice soit assurée et le principe de séparation des pouvoirs respecté. Le but est d'étendre davantage le rayonnement de la Cour suprême et de la doter des moyens lui permettant de s'acquitter des lourdes responsabilités dont elle a la charge.\nPar ailleurs, toute la famille de la justice s'investira, avec efficacité et en toute responsibility, dans cette réforme radicale et déterminante, qui constitue un préalable à l'exercice d'une citoyenneté pleine et entière et à la réalisation du développement global, que Nous souhaitons pour Notre chère patrie. Notre ambition ultime est que la Cour continue à être l'incarnation concrète du nom qui la désigne, et demeure au sommet d'une structure administrant une justice indépendante et intègre, et s'érigeant comme un haut lieu d'innovation et de réflexion jurisprudentielle, en phase avec les impératifs et les réalités de l'heure. A cet égard, Nous engageons l'honorable famille de la Cour à multiplier ses efforts afin que cette juridiction se mue en véritable locomotive pour la réforme souhaitée et permette ainsi d'aller plus en avant sur la voie de la modernité, de l'authentification, de la transparence et de l'ouverture, et ayant toujours à l'esprit, le nécessaire respect des principes de la primauté de la loi et de l'égalité de tous les citoyens devant elle.\nPuisse Dieu guider vos pas et couronner de succès les travaux de votre colloque. Wassalamou alaikoum warhmatoullahi wa barakatouh.",
    vocabulary: [
      { fr: "Amir Al-Mouminine", ar: "أمير المؤمنين", explanation: "" },
      { fr: "Le pacte sacré de la Beia", ar: "عهد البيعة المقدسة", explanation: "" },
      { fr: "La Constitution du Royaume", ar: "دستور المملكة", explanation: "" },
      { fr: "La sécurité judiciaire", ar: "الأمن القضائي", explanation: "" },
      { fr: "Stimuler l'investissement", ar: "تحفيز الاستثمار", explanation: "" },
      { fr: "Dynamiser le processus de développement", ar: "النهوض بالتنمية", explanation: "" },
      { fr: "Discours du Trône", ar: "خطاب العرش", explanation: "" },
      { fr: "L'ouverture du Parlement", ar: "افتتاح البرلمان", explanation: "" },
      { fr: "Une réforme profonde et globale", ar: "إصلاح عميق وشامل", explanation: "" },
      { fr: "Le premier Président de la Cour", ar: "الرئيس الأول للمجلس", explanation: "" },
      { fr: "Le Procureur général du Roi", ar: "الوكيل العام للملك", explanation: "" },
      { fr: "Compétence, intégrité, impartialité", ar: "الكفاءة والنزاهة والتجرد", explanation: "" },
      { fr: "Notre ministre de la justice", ar: "وزيرنا في العدل", explanation: "" },
      { fr: "Valeurs constantes et sacrées de la nation", ar: "ثوابت الأمة ومقدساتها", explanation: "" },
      { fr: "L'Etat de droit", ar: "دولة الحق والقانون", explanation: "" },
      { fr: "Une citoyenneté pleine et entière", ar: "المواطنة الكاملة", explanation: "" },
      { fr: "Le développement global", ar: "التنمية الشاملة", explanation: "" },
      { fr: "La modernité", ar: "التحديث والعصرنة", explanation: "" },
      { fr: "La transparence et l'ouverture", ar: "الشفافية والانفتاح", explanation: "" },
      { fr: "L'égalité de tous les citoyens devant la loi", ar: "مساواة كل المواطنين أمام القانون", explanation: "" }
    ],
    analysis: ""
  }
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "ما هو المصطلح الدستوري الرسمي الذي يقابل عبارة 'المجلس الأعلى للقضاء' في الفرنسية القانونية؟",
    options: [
      "Conseil National de la Justice",
      "Conseil Supérieur de la Magistrature",
      "Cour Suprême de la Magistrature",
      "Conseil de l'Ordre des Magistrats"
    ],
    correctAnswer: "Conseil Supérieur de la Magistrature",
    explanation: "المصطلح الرسمي هو 'Conseil Supérieur de la Magistrature'. وهو هيئة دستورية تضمن استقلال القضاء وتدبر مسارات القضاة المهنية."
  },
  {
    id: 2,
    question: "تُرجمت عبارة 'الشطط في استعمال السلطة' أو 'الشطط' في الفقرة الخامسة بمصطلح فرنسي شهير في القانون الإداري وهو:",
    options: [
      "L'erreur judiciaire",
      "L'abus de pouvoir",
      "La fraude légale",
      "L'excès administratif"
    ],
    correctAnswer: "L'abus de pouvoir",
    explanation: "يُعبر مصطلح 'L'abus de pouvoir' أو 'Excès de pouvoir' في القانون الإداري بدقة عن انحراف السلطة أو الشطط في استعمالها لمخالفة القانون."
  },
  {
    id: 3,
    question: "ما هي الترجمة القانونية الصحيحة لمصطلح 'المتقاضين' (الأشخاص الخاضعين لسلطة المحاكم)؟",
    options: [
      "Les plaideurs",
      "Les justiciables",
      "Les défenseurs",
      "Les accusés"
    ],
    correctAnswer: "Les justiciables",
    explanation: "'Justiciables' هي الترجمة الأعم والأدق وتشمل كل من يحق له التقاضي والمثول أمام المحاكم، بينما 'plaideurs' تعني الخصوم في دعوى عينية."
  },
  {
    id: 4,
    question: "في لغة القانون والمالية العمومية، ما هي الترجمة الفصحى الأكثر دقة لعبارة 'المال العام'؟",
    options: [
      "L'argent public",
      "Les deniers publics",
      "La caisse étatique",
      "Le budget général"
    ],
    correctAnswer: "Les deniers publics",
    explanation: "يُستخدم مصطلح 'les deniers publics' قانونياً للإشارة للأموال والممتلكات العامة الخاضعة للرقابة وتدقيق المحاسبين العموميين."
  },
  {
    id: 5,
    question: "ما المقابل الفرنسي القانوني لعبارة 'ضمير القاضي' أو 'القناعة الوجدانية الصميمة للقاضي'؟",
    options: [
      "La conscience juridique",
      "L'intime conviction",
      "L'avis personnel",
      "Le jugement moral"
    ],
    correctAnswer: "L'intime conviction",
    explanation: "تعبّر 'L'intime conviction du magistrat' عن حرية القاضي في تكوين اقتناعه الشخصي والوجداني الصميم بناء على الأدلة والقرائن المعروضة."
  },
  {
    id: 6,
    question: "ما هي ترجمة المحكمة المالية العليا 'المجلس الأعلى للحسابات' بالمغرب؟",
    options: [
      "La Cour de Cassation",
      "La Cour des comptes",
      "Le Conseil Supérieur du Budget",
      "L'Inspection Générale des Finances"
    ],
    correctAnswer: "La Cour des comptes",
    explanation: "المجلس الأعلى للحسابات يُترجم بـ 'La Cour des comptes'، وهي المؤسسة الدستورية القضائية العليا لتدقيق ومراقبة مالية الدولة."
  },
  {
    id: 7,
    question: "اختر الكلمة الفرنسية التي تعني 'تبديد أو إهدار المال العام بالعبث والتسيب':",
    options: [
      "La corruption",
      "La dilapidation",
      "Le détournement",
      "Le recel"
    ],
    correctAnswer: "La dilapidation",
    explanation: "'La dilapidation' تعني تبديد أو إهلاك المال العام بعبث وتصرف طائش، بينما 'détournement' يعني الاختلاس المباشر."
  },
  {
    id: 8,
    question: "ما المعنى الدقيق للمصطلح الدستوري والقانوني الكوني 'L'État de droit'؟",
    options: [
      "دولة القانون (دولة الحق والقانون)",
      "المحكمة الوطنية الكبرى",
      "سيادة السلطة القضائية",
      "الإدارة الترابية للدولة"
    ],
    correctAnswer: "دولة القانون (دولة الحق والقانون)",
    explanation: "يعني 'L'État de droit' دولة الحق والقانون التي يخضع فيها المواطنون والحكومة وسائر السلطات لقانون موحد يحترم الحقوق والحريات."
  },
  {
    id: 9,
    question: "ترجم عبارة 'سيادة الشرعية' في السياق القضائي والدستوري:",
    options: [
      "La primauté de la coutume",
      "La prééminence de la légalité",
      "La souveraineté politique",
      "L'autorité de la chose jugée"
    ],
    correctAnswer: "La prééminence de la légalité",
    explanation: "'La prééminence de la légalité' تعني سيادة وسمو الشرعية الدستورية والقانونية وخضوع كل التصرفات لها."
  },
  {
    id: 10,
    question: "ما المقابل القانوني لعبارة 'الاجتهاد القضائي' المتراكم من قرارات المحاكم الكبرى كالمحكمة العليا؟",
    options: [
      "La législation",
      "La doctrine",
      "La jurisprudence",
      "La coutume juridique"
    ],
    correctAnswer: "La jurisprudence",
    explanation: "الاجتهاد القضائي يترجم دائماً بـ 'La jurisprudence'، بينما 'La doctrine' تعني الفقه (آراء أساتذة القانون) و'La législation' تعني التشريع."
  }
];

// Matching Game term pairs
const MATCH_PAIRS = [
  { fr: "Jurisprudence", ar: "الاجتهاد القضائي" },
  { fr: "Justiciables", ar: "المتقاضون" },
  { fr: "L'équité", ar: "الإنصاف" },
  { fr: "Deniers publics", ar: "المال العام" },
  { fr: "Dilapidation", ar: "تبديد المال" },
  { fr: "Abus de pouvoir", ar: "الشطط في استعمال السلطة" },
  { fr: "Intime conviction", ar: "القناعة الصميمة للقاضي" },
  { fr: "Magistrature", ar: "سلك القضاء" }
];

const SPEECH_SECTIONS_2025: SpeechSection[] = [
  {
    id: 1,
    title: "افتتاح الدورة التشريعية والأداء البرلماني والدبلوماسية الحزبية",
    ar: "الحمد لله، والصلاة والسلام على مولانا رسول الله وآله وصحبه. حضرات السيدات والسادة البرلمانيين المحترمين، نفتتح اليوم، بعون الله وتوفيقه، السنة التشريعية الأخيرة لمجلس النواب، من الولاية الحالية. وهي مناسبة للتعبير لكم ، عن تقديرنا للعمل الذي تقومون به، سواء في مجال التشريع، أو مراقبة العمل الحكومي، أو في تقييم السياسات العمومية. كما نود الإشادة بالجهود المبذولة، للارتقاء بالدبلوماسية الحزبية والبرلمانية، في خدمة القضايا العليا للبلاد؛ داعين إلى المزيد من الاجتهاد والفعالية، في إطار من التعاون والتكامل مع الدبلوماسية الرسمية.",
    fr: "Louange à Dieu, Paix et Salut sur le Prophète, Sa Famille et Ses Compagnons. Mesdames et Messieurs les honorables parlementaires, Avec l’aide du Seigneur, Nous ouvrons aujourd’hui la dernière année législative du mandat en cours de la Chambre des Représentants. C’est l’occasion de vous assurer du prix que Nous attachons à votre travail, qu’il soit d’ordre législatif ou qu’il se rapporte au contrôle de l’action gouvernementale et à l’évaluation des politiques publiques. Nous tenons aussi à saluer les efforts déployés pour relever le niveau de performance de la diplomatie partisane et parlementaire afin de mieux servir les Causes supérieures de la Nation. Nous appelons également à ce qu’en la matière, un travail plus applied et plus efficace soit mené dans une logique de coopération et de complémentarité avec la diplomatie officielle.",
    vocabulary: [
      { fr: "Évaluation des politiques publiques", ar: "تقييم السياسات العمومية", explanation: "وظيفة دستورية لمجلس النواب لقياس الأثر الفعلي للسياسات والبرامج الحكومية على المستهدفين." },
      { fr: "Diplomatie partisane et parlementaire", ar: "الدبلوماسية الحزبية والبرلمانية", explanation: "النشاط الخارجي للأحزاب والبرلمان لدعم القضايا الوطنية الاستراتيجية بالتكامل مع الدبلوماسية الرسمية." },
      { fr: "Contrôle de l'action gouvernementale", ar: "مراقبة العمل الحكومي", explanation: "مساءلة الجهاز التنفيذي ومراقبة أدائه عبر الأسئلة الشفهية والكتابية ولجان التقصي." }
    ],
    analysis: "يركز الخطاب الملكي السامي على المهام الدستورية الرئيسية للبرلمان (التشريع، المراقبة، التقييم) مشيداً بالتكامل بين الدبلوماسية البرلمانية والدبلوماسية الرسمية في حماية المصالح العليا للوطن."
  },
  {
    id: 2,
    title: "التجند والالتزام وتأطير المواطنين في القوانين والحريات",
    ar: "ولأنها السنة الأخيرة ، بالنسبة لأعضاء مجلس النواب، ندعوكم لتكريسها للعمل، بروح الجدية والمسؤولية، لاستكمال المخططات التشريعية، وتنفيذ البرامج والمشاريع المفتوحة، والتحلي باليقظة والالتزام ، في الدفاع عن قضايا المواطنين. كما لا ينبغي أن يكون هناك تناقض أو تنافس، بين المشاريع الوطنية الكبرى والبرامج الاجتماعية، ما دام الهدف هو تنمية البلاد، وتحسين ظروف عيش المواطنين، أينما كانوا. وفي نفس السياق، ينبغي إعطاء عناية خاصة، لتأطير المواطنين، والتعريف بالمبادرات التي تتخذها السلطات العمومية، ومختلف القوانين والقرارات، لا سيما تلك التي تهم حقوق وحريات المواطنين، بصفة مباشرة. وهات المسألة ليست مسؤولية الحكومة وحدها، وإنما هي مسؤولية الجميع، وفي مقدمتهم أنتم، معشر البرلمانيين، لأنكم تمثلون المواطنين. وهي أيضا مسؤولية الأحزاب السياسية والمنتخبين، في مختلف المجالس المنتخبة، وعلى جميع المستويات الترابية، إضافة إلى وسائل الإعلام، وفعاليات المجتمع المدني، وكل القوى الحية للأمة.",
    fr: "Comme il s’agit, pour les membres de la Chambre des Représentants, de la dernière année de leur mandat, Nous vous invitons à vous employer avec sérieux et responsabilité à mener à bonne fin les processus législatifs, à mettre en œuvre les programmes et les projets en chantier, à demeurer alertes et engagés à plaider la cause des citoyens. Par ailleurs, il ne devrait y avoir ni antinomie ni rivalité entre les grands projets nationaux et les programmes sociaux, tant que le but recherché est de développer le pays et d’améliorer les conditions de vie des citoyens, où qu’ils soient. Dans la même veine, une attention particulière doit être portée à l’encadrement des citoyens et à la communication autour des initiatives engagées par les pouvoirs publics, et des différentes lois et décisions, notamment celles ayant trait directement aux droits et aux libertés des citoyens. Cette mission n’est pas du seul ressort du gouvernement. Elle est l’affaire de tous, et vous, les parlementaires, êtes en première ligne, car vous êtes les représentants des citoyens. C’est aussi la responsabilité des partis politiques et des mandataires siégeant au sein des différents Conseils élus, à tous les échelons de l’organisation territoriale. Doivent également s’y associer médias, acteurs de la société civile et, globalement, toutes les forces vives de la Nation.",
    vocabulary: [
      { fr: "Droits et libertés des citoyens", ar: "حقوق وحريات المواطنين", explanation: "المكاسب والضمانات الدستورية والقانونية المفروض حمايتها وإشاعتها بين أفراد المجتمع." },
      { fr: "Projets nationaux et programmes sociaux", ar: "المشاريع الوطنية والبرامج الاجتماعية", explanation: "التناغم المعتمد بين الأوراش الهيكلية الاستثمارية الكبرى والبرامج الاجتماعية المباشرة لتطوير البلاد." },
      { fr: "Encadrement des citoyens", ar: "تأطير المواطنين", explanation: "الدور التوعوي والتربوي والسياسي المنوط بالأحزاب والمنتخبين والمجتمع المدني والإعلام." }
    ],
    analysis: "يبرز الخطاب التكامل بين الأوراش الهيكلية والبرامج الاجتماعية، مشدداً على المسؤولية الجماعية للبرلمان والأحزاب والإعلام والمجتمع المدني في التأطير والتعريف بالقوانين والقرارات المباشرة."
  },
  {
    id: 3,
    title: "العدالة الاجتماعية والمجالية كتوجه استراتيجي راسخ",
    ar: "حضرات السيدات والسادة البرلمانيين، لقد دعونا في خطاب العرش الأخير، إلى تسريع مسيرة المغرب الصاعد، وإطلاق جيل جديد من برامج التنمية الترابية. وهي كما تعلمون، من القضايا الكبرى، التي تتجاوز الزمن الحكومي والبرلماني. وبلادنا والحمد لله، تفتح الباب، من خلال الديناميات التي أطلقناها، أمام تحقيق عدالة اجتماعية ومجالية أكبر. كما نعمل على استفادة الجميع، من ثمار النمو، ومن تكافؤ الفرص بين أبناء المغرب الموحد، في مختلف الحقوق، السياسية والاقتصادية والاجتماعية، وغيرها. لذلك، نعتبر أن مستوى التنمية المحلية، هو المرآة التي تعكس بصدق، مدى تقدم المغرب الصاعد والمتضامن، الذي نعمل جميعا على ترسيخ مكانته. فالعدالة الاجتماعية، ومحاربة الفوارق المجالية، ليست مجرد شعار فارغ، أو أولوية مرحلية، قد تتراجع أهميتها حسب الظروف؛ وإنما نعتبرها توجها استراتيجيا، يجب على جميع الفاعلين الالتزام به، ورهانا مصيريا، ينبغي أن يحكم مختلف السياسات التنموية.",
    fr: "Mesdames et Messieurs les honorables parlementaires, Nous avons appelé dans le dernier Discours du Trône à accélérer la marche du Maroc émergent et à lancer une nouvelle génération de programmes de développement territorial. Ainsi que vous le savez, il s’agit d’enjeux majeurs qui débordent la limite temporelle de l’action gouvernementale et parlementaire. Dieu soit loué, à la faveur des dynamiques que Nous avons impulsées, notre pays se fraye un chemin sûr vers une plus grande justice sociale et territoriale. Nous nous attachons aussi à ce que les fruits de la croissance profitent à tous, à ce que les enfants du Maroc uni jouissent à égalité des droits politiques, économiques et sociaux et de bien d’autres. Aussi, Nous considérons que le niveau du développement local est le vrai miroir du progrès du Maroc émergent et solidaire, dont nous nous employons tous à consolider le statut. De fait, le diptyque 'justice sociale et lutte contre les inégalités territoriales' est loin d’être un slogan creux, ou une priorité conjoncturelle dont l’importance pourrait décliner au gré des circonstances. Nous le considérons plutôt comme une orientation stratégique qui requiert l’engagement de tous les acteurs, ainsi qu’un enjeu crucial qui doit imprégner les différentes politiques de développement.",
    vocabulary: [
      { fr: "Justice sociale et territoriale", ar: "العدالة الاجتماعية والمجالية", explanation: "المبدأ الاستراتيجي القائم على تقليص التفاوتات بين الفئات الاجتماعية والمناطق الجغرافية." },
      { fr: "Inégalités territoriales", ar: "الفوارق المجالية", explanation: "التفاوت غير المتكافئ في البنيات التحتية والتنمية بين مختلف الأقاليم والجهات." },
      { fr: "Égalité des chances", ar: "تكافؤ الفرص", explanation: "ضمان الاستفادة المتبادلة والمتساوية لجميع المواطنين من ثمار النمو والحقوق الشاملة." }
    ],
    analysis: "يعلن الخطاب الملكي أن العدالة الاجتماعية والمجالية خيار استراتيجي عابر للولايات الحكومية والبرلمانية، يحدد مدى تقدم المغرب الصاعد والمتضامن عبر ثمار النمو وتكافؤ الفرص."
  },
  {
    id: 4,
    title: "جيل جديد لبرامج التنمية الترابية وثقافة النتائج",
    ar: "لذا، فإن توجه المغرب الصاعد، من أجل تحقيق العدالة الاجتماعية والمجالية، يتطلب اليوم ، تعبئة جميع طاقاته. فالتحول الكبير، الذي نسعى إلى تحقيقه على مستوى التنمية الترابية، يتطلب تغييرا ملموسا في العقليات، وفي طريقة العمل، وترسيخا حقيقيا لثقافة النتائج؛ وذلك بناء على معطيات ميدانية دقيقة، وباستعمال التكنولوجيات الرقمية. لذلك، ننتظر وتيرة أسرع، وأثرا أقوى للجيل الجديد من برامج التنمية الترابية، التي وجهنا الحكومة لإعدادها ، وذلك في إطار علاقات رابح - رابح بين المجالات الحضرية والقروية. ويتعلق الأمر، على الخصوص، بالقضايا الرئيسية، ذات الأسبقية التي حددناها؛ وعلى رأسها تشجيع المبادرات المحلية، والأنشطة الاقتصادية، وتوفير فرص الشغل للشباب، والنهوض بقطاعات التعليم والصحة، وبالتأهيل الترابي. وفي هذا الصدد، ندعو الجميع، كل من موقعه، إلى محاربة كل الممارسات، التي تضيع الوقت والجهد والإمكانات؛ لأنه من غير المقبول التهاون في نجاعة ومردودية الاستثمار العمومي.",
    fr: "Par ailleurs, le cap tracé par le Maroc émergent pour réaliser la justice sociale et spatiale exige la mobilisation de toutes les potentialités dont il dispose. En effet, la transformation majeure que Nous entendons opérer en matière de développement territorial, requiert un changement significatif des mentalités et des méthodes de travail, ainsi qu’un véritable enracinement de la culture du résultat. Cette démarche doit reposer sur la collecte de données de terrain précises et l’utilisation des technologies numériques. Aussi, s’agissant de la nouvelle génération de programmes de développement territorial que le gouvernement doit s’atteler à élaborer conformément à Nos orientations, Nous attendons qu’ils se caractérisent par une plus grande célérité et qu’ils produisent un impact plus fort. Ce travail doit être mené dans le respect d’une relation gagnant-gagnant entre les zones urbaines et rurales. Il s’agit notamment des questions clés que Nous avons définies comme prioritaires, au premier rang desquelles figurent l’encouragement des initiatives locales et des activités économiques, la création d’emplois pour les jeunes, la promotion concrète des secteurs de l’éducation et de la santé, ainsi que la mise à niveau territoriale. Et parce que toute négligence affectant l’efficacité et la rentabilité des investissements publics est inadmissible, Nous exhortons, chacun à son niveau, à lutter contre toute pratique chronophage, énergivore et avide de ressources.",
    vocabulary: [
      { fr: "Culture du résultat", ar: "ثقافة النتائج", explanation: "نمودج تدبيري حديث يعتمد قياس الأثر الميداني الفعلي بدلاً من الروتين الإداري الشكلي." },
      { fr: "Rentabilité des investissements publics", ar: "مردودية الاستثمار العمومي", explanation: "ضمان أقصى نجاعة للمال العام والاستثمارات الوطنية لمنع ضياع الموارد والجهود." },
      { fr: "Mise à niveau territoriale", ar: "التأهيل الترابي", explanation: "تزويد المجالات الهشة والقروية بالتجهيزات الأساسية والمرافق التنموية الكفيلة بدمجها." }
    ],
    analysis: "يشدد الخطاب على ربط التنمية الترابية بالتحول الرقمي ودقة المعطيات الميدانية وترسيخ 'ثقافة النتائج' (culture du résultat) وحظر التهاون في نجاعة ومردودية الاستثمار العمومي."
  },
  {
    id: 5,
    title: "المناطق الجبلية والسواحل والمراكز القروية الناشئة",
    ar: "وإضافة إلى توجيهاتنا في خطاب العرش، بخصوص التنمية الترابية، ندعو للتركيز أيضا على القضايا التالية: - أولا: إعطاء عناية خاصة للمناطق الأكثر هشاشة، بما يراعي خصوصياتها، وطبيعة حاجياتها، وخاصة مناطق الجبال والواحات. فلا يمكن تحقيق التنمية الترابية المنسجمة، بدون تكامل وتضامن فعلي بين المناطق والجهات. وقد أصبح من الضروري، إعادة النظر في تنمية المناطق الجبلية، التي تغطي 30 % من التراب الوطني، وتمكينها من سياسة عمومية مندمجة تراعي خصوصياتها، ومؤهلاتها الكثيرة. - ثانيا: التفعيل الأمثل والجاد، لآليات التنمية المستدامة للسواحل الوطنية، بما في ذلك القانون المتعلق بالساحل، والمخطط الوطني للساحل. وذلك بما يساهم في تحقيق التوازن الضروري، بين التنمية المتسارعة لهذه الفضاءات، ومتطلبات حمايتها وتثمين مؤهلاتها الكبيرة، ضمن اقتصاد بحري وطني، يخلق الثروة وفرص الشغل. - ثالثا: توسيع نطاق برنامج المراكز القروية الناشئة، باعتبارها آلية ملائمة، لتدبير التوسع الحضري، والتخفيف من آثاره السلبية. ومن شأن هذه المراكز الناشئة كذلك، أن تشكل حلقة فعالة، في تقريب الخدمات الإدارية والاجتماعية والاقتصادية، من المواطنين بالعالم القروي.",
    fr: "Outre les directives contenues dans Notre Discours du Trône à propos du développement territorial, Nous appelons à ce que l’accent soit mis également sur les points suivants : - Premièrement : accorder un intérêt particulier aux régions en situation de très grande précarité, notamment les zones montagneuses et les oasis, en tenant compte de leurs spécificités et de la nature de leurs besoins. De fait, le développement territorial harmonieux ne saurait être réalisé sans une complémentarité et une solidarité effective entre les différentes zones et les diverses régions. A cet égard, il devient indispensable de reconsidérer le développement des zones montagneuses qui couvrent 30% du territoire national. En effet, ces espaces doivent être dotés d’une politique publique intégrée qui prend en considération leurs particularités et leurs nombreuses potentialités. - Deuxièmement : mener avec sérieux l’opérationnalisation optimale des leviers de développement durable du littoral national, y compris la loi relative au littoral et le Plan national du littoral. Le but est de contribuer à assurer l’équilibre nécessaire entre le développement accelerated de ces espaces et les exigences de leur protection et de mise en valeur de leurs grands atouts, dans le cadre d’une économie maritime nationale, génératrice de richesse et d’emplois. - Troisièmement : étendre le Programme National pour le développement des Centres ruraux émergents, en tant que levier adapté pour la gestion de l’urbanisation et la réduction de ses impacts négatifs. En outre, ces centres émergents sont susceptibles de devenir un maillon efficace dans la dynamique visant à fournir aux citoyens en milieu rural des services administratifs, sociaux et économiques de proximité.",
    vocabulary: [
      { fr: "Politique publique intégrée", ar: "سياسة عمومية مندمجة", explanation: "استراتيجية حكومية متعددة الأبعاد تستهدف تطوير وتكافؤ التنمية بالمناطق الجبلية (30% من المغرب)." },
      { fr: "Développement durable du littoral", ar: "التنمية المستدامة للسواحل", explanation: "إعمال قانون الساحل والمخطط الوطني لتأمين اقتصاد بحري وطني خالق للثروة والشغل." },
      { fr: "Centres ruraux émergents", ar: "المراكز القروية الناشئة", explanation: "مراكز نمو وسيطة لتقريب الخدمات الأساسية ومنع الاستقطاب الحاد للهجرة نحو المدن." }
    ],
    analysis: "رسم الخطاب 3 محاور عملية استثنائية: سياسة عمومية مندمجة للمناطق الجبلية، تنمية مستدامة للسواحل واقتصاد بحري، وتوسيع برنامج المراكز القروية الناشئة لتقريب الخدمات."
  },
  {
    id: 6,
    title: "التعبئة الجماعية وتغليب المصالح العليا للوطن",
    ar: "حضرات السيدات والسادة البرلمانيين، إن السنة التي نحن مقبلون عليها، حافلة بالمشاريع والتحديات. وإننا ننتظر منكم جميعا، حكومة وبرلمانا، أغلبية ومعارضة، تعبئة كل الطاقات والإمكانات، وتغليب المصالح العليا للوطن والمواطنين. فكونوا رعاكم الله، في مستوى الثقة الموضوعة فيكم، وفي مستوى الأمانة الملقاة على عاتقكم، وما تتطلبه خدمة الوطن، من نزاهة والتزام ونكران ذات. قال تعالى: 'فمن يعمل مثقال ذرة خيرا يره، ومن يعمل مثقال ذرة شرا يره'. صدق الله العظيم. والسلام عليكم ورحمة الله تعالى وبركاته.",
    fr: "Mesdames et Messieurs les honorables parlementaires, L’année qui se profile devant nous abonde en projets et en défis. Dès lors, Nous attendons de vous tous, au gouvernement comme au Parlement, en tant que Majorité et au sein de l’Opposition, que vous mobilisiez toutes les énergies et toutes les potentialités et que vous fassiez prévaloir les intérêts supérieurs de la Nation et des citoyens. Soyez, que Dieu vous garde, dignes de la confiance placée en vous et à la hauteur de la responsabilité qui vous incombe. Faites aussi preuve d’intégrité, d’engagement et d’abnégation au service de la Patrie. Le Très-Haut dit : 'Quiconque fait un bien fût-ce du poids d'un atome, le verra, et quiconque fait un mal fût-ce du poids d'un atome, le verra'. Véridique est la parole de Dieu. Wassalamou alaikoum warahmatoullahi wabarakatouh.",
    vocabulary: [
      { fr: "Intérêts supérieurs de la Nation", ar: "المصالح العليا للوطن", explanation: "الغايات والمكاسب الوطنية الكبرى التي تجب على القوى السياسية والأحزاب تقديمها على أي حسابات." },
      { fr: "Intégrité et abnégation", ar: "النزاهة ونكران الذات", explanation: "القيم الشريفة المفروض توفرها في ممثلي الأمة والمسؤولين لخدمة المصلحة العامة بصدق." },
      { fr: "Mobilisation des énergies", ar: "تعبئة الطاقات والإمكانات", explanation: "تضافر جهود الحكومة والبرلمان أغلبية ومعارضة لمواجهة التحديات التنموية الوطنية." }
    ],
    analysis: "نداء ملكي سامٍ للبرلمان والحكومة بأغلبيته ومعارضته لاستنهاض كل الطاقات والتحلي بالنزاهة ونكران الذات وتغليب المصالح العليا للوطن والمواطنين."
  }
];

const SPEECH_SECTIONS_2025_SAHARA: SpeechSection[] = [
  {
    id: 1,
    title: "الفتح الجديد وترسيخ مغربية الصحراء (ما بعد 31 أكتوبر 2025)",
    ar: "الحمد لله، والصلاة والسلام على مولانا رسول الله وآله وصحبه. قال تعالى \"إنا فتحنا لك فتحا مبينا\". صدق الله العظيم . شعبي العزيز، بعد خمسين سنة من التضحيات، ها نحن نبدأ، بعون الله وتوفيقه، فتحا جديدا، في مسار ترسيخ مغربية الصحراء، والطي النهائي لهذا النزاع المفتعل، في إطار حل توافقي، على أساس مبادرة الحكم الذاتي. وإنه من دواعي الاعتزاز، أن يتزامن هذا التحول التاريخي، مع تخليد الذكرى الخمسين للمسيرة الخضراء، والذكرى السبعين لاستقلال المغرب. وبهذه المناسبة، يسعدني أن أتقاسم معك اليوم، مشاعر الارتياح، لمضمون القرار الأخير لمجلس الأمن. إننا نعيش مرحلة فاصلة، ومنعطفا حاسما، في تاريخ المغرب الحديث. فهناك ما قبل 31 أكتوبر 2025، وهناك ما بعده. لقد حان وقت المغرب الموحد، من طنجة إلى لكويرة، الذي لن يتطاول أحد على حقوقه، وعلى حدوده التاريخية.",
    fr: "Louange à Dieu, Prière et salut sur le Prophète, Sa famille et Ses compagnons. Dieu dit dans Son Livre Sacré : \"Nous t’avons accordé une victoire éclatante\". Véridique est la parole de Dieu. Cher peuple, Par la grâce du Seigneur et avec Son aide, après cinquante ans de sacrifices, nous ouvrons un nouveau chapitre victorieux dans le processus de consécration de la Marocanité du Sahara, destiné à clore définitivement le dossier de ce conflit artificiel, par une solution consensuelle fondée sur l’Initiative d’Autonomie. C’est un véritable motif de fierté que ce changement historique intervienne à la période où sont commémorés respectivement les cinquantième et soixante-dixième anniversaires de la Marche Verte et de l’Indépendance du Maroc. A cette occasion, Je me réjouis de partager avec toi la satisfaction que M’inspire la teneur de la dernière Résolution du Conseil de Sécurité. Nous vivons une étape charnière et un tournant décisif dans l’Histoire du Maroc moderne: Désormais, il y aura un avant et un après 31 octobre 2025. Il est venu le temps du Maroc uni qui s’étend de Tanger à Lagouira : celui dont nul ne s’avisera de bafouer les droits, ni de transgresser les frontières historiques.",
    vocabulary: [
      { fr: "Consécration de la Marocanité du Sahara", ar: "ترسيخ مغربية الصحراء", explanation: "التأكيد القانوني والدبلوماسي التاريخي للسيادة المغربية الكاملة على الأقاليم الجنوبية." },
      { fr: "Initiative d'Autonomie", ar: "مبادرة الحكم الذاتي", explanation: "المقترح المبتكر والواقعي المعتمد دولياً لحل النزاع المفتعل في إطار السيادة المغربية." },
      { fr: "Résolution du Conseil de Sécurité", ar: "قرار مجلس الأمن", explanation: "القرار الأممي التاريخي الصادر في 31 أكتوبر 2025 والمكرس لمرتكزات الحل النهائي." },
      { fr: "Limites et frontières historiques", ar: "الحدود التاريخية والحقوق الوطنية", explanation: "الوحدة الترابية الشاملة للمملكة المغربية الممتدة من طنجة إلى لكويرة." }
    ],
    analysis: "يعلن الخطاب الملكي السامي مرحلة فاصلة في تاريخ المغرب الحديث ('ما بعد 31 أكتوبر 2025')، مؤكداً بدء فتح جديد لطي النزاع المفتعل نهائياً على أساس مبادرة الحكم الذاتي والقرار التاريخي لمجلس الأمن."
  },
  {
    id: 2,
    title: "من التدبير إلى التغيير والاعتراف الدولي والسيادة الاقتصادية",
    ar: "شعبي العزيز، لقد قلت في خطاب سابق، أننا انتقلنا في قضية وحدتنا الترابية، من مرحلة التدبير إلى مرحلة التغيير. فالدينامية التي أطلقناها، في السنوات الأخيرة، بدأت تعطي ثمارها على جميع الأصعدة. ذلك أن ثلثي الدول بالأمم المتحدة، أصبحت تعتبر مبادرة الحكم الذاتي، هي الإطار الوحيد لحل هذا النزاع. كما أن الاعتراف بالسيادة الاقتصادية للمملكة، على الأقاليم الجنوبية عرف تزايدا كبيرا، بعد قرارات القوى الاقتصادية الكبرى، كالولايات المتحدة الأمريكية وفرنسا وبريطانيا، وروسيا وإسبانيا والاتحاد الأوروبي، بتشجيع الاستثمارات والمبادلات التجارية مع هذه الأقاليم. وهو ما يؤهلها لتصبح قطبا للتنمية والاستقرار، ومحورا اقتصاديا بمحيطها الجهوي، بما في ذلك منطقة الساحل والصحراء.",
    fr: "Cher peuple, Dans un précédent Discours, J’ai affirmé qu’en ce qui concernait l’affaire de notre intégrité territoriale, nous étions passés d’une phase de gestion proprement dite à celle d’une dynamique de changement. En effet, la dynamique que Nous avons impulsée ces dernières années a commencé à porter ses fruits sur tous les plans. De fait, les deux-tiers des Etats-membres des Nations Unies considèrent désormais que l’Initiative d’Autonomie est le seul cadre qui vaille pour parvenir au règlement de ce conflit. Par ailleurs, la reconnaissance de la souveraineté économique du Royaume sur ses Provinces du Sud s’est largement étendue après que de grandes puissances économiques comme les Etats-Unis d’Amérique, la France, la Grande-Bretagne, la Russie, l’Espagne et l’Union Européenne ont décidé d’encourager les investissements dans ces provinces et de promouvoir les échanges commerciaux avec elles. Avec un tel atout, ces provinces peuvent désormais s’affirmer au sein de leur environnement régional, y compris la région du Sahel et du Sahara, comme un pôle de développement et de stabilité et un axe central de l’activité économique.",
    vocabulary: [
      { fr: "Souveraineté économique", ar: "السيادة الاقتصادية", explanation: "شرعية وحق المملكة المغربية الكامل في تنمية واستغلال موارد أقاليمها الجنوبية وجذب الاستثمارات العالمية." },
      { fr: "Pôle de développement et de stabilité", ar: "قطب للتنمية والاستقرار", explanation: "تحويل الصحراء المغربية إلى قاطرة اقتصادية ومحور استقرار إقليمي لعموم منطقة الساحل والصحراء." },
      { fr: "Dynamique de changement", ar: "دينامية التغيير", explanation: "الاستراتيجية الدبلوماسية الانتقالية من موقف الدفاع والمناورة إلى تثبيت المواقف الدولية الحازمة." }
    ],
    analysis: "يرصد الخطاب تحول قضية الصحراء المغربية من مرحلة التدبير إلى مرحلة التغيير، مدعومة بتأييد ثلثي دول الأمم المتحدة واعتراف القوى الاقتصادية الكبرى بالسيادة الاقتصادية للمملكة."
  },
  {
    id: 3,
    title: "تحيين وتفصيل مبادرة الحكم الذاتي والتقدير الدولي",
    ar: "واليوم ندخل، والحمد لله، مرحلة الحسم على المستوى الأممي، حيث حدد قرار مجلس الأمن المبادئ والمرتكزات، الكفيلة بإيجاد حل سياسي نهائي لهذا النزاع، في إطار حقوق المغرب المشروعة. وفي سياق هذا القرار الأممي، سيقوم المغرب بتحيين وتفصيل مبادرة الحكم الذاتي، وسيقدمها للأمم المتحدة، لتشكل الأساس الوحيد للتفاوض، باعتبارها الحل الواقعي والقابل للتطبيق. ولا يفوتنا هنا، أن نتقدم بعبارات الشكر والتقدير لجميع الدول، التي ساهمت في هذا التغيير، بمواقفها البناءة، ومساعيها الدؤوبة، في سبيل نصرة الحق والشرعية. وأخص بالذكر الولايات المتحدة الأمريكية، بقيادة صديقنا فخامة الرئيس دونالد ترامب، الذي مكنت جهوده من فتح الطريق للوصول إلى حل نهائي لهذا النزاع. كما نشكر أصدقاءنا في بريطانيا وإسبانيا، وخاصة فرنسا، على جهودهم من أجل نجاح هذا المسار السلمي. ونتوجه أيضا بجزيل الشكر لكل الدول العربية والإفريقية الشقيقة، التي ما فتئت تعبر عن دعمها، الدائم واللامشروط، لمغربية الصحراء، وكذا مختلف الدول عبر العالم، التي تدعم مبادرة الحكم الذاتي.",
    fr: "Dieu soit loué, nous entrons dans la phase décisive du processus onusien dès lors que la Résolution du Conseil de Sécurité définit les principes et les fondements susceptibles de conduire à un règlement politique définitif de ce conflit, dans le strict respect des droits légitimes du Maroc. Dans le droit fil de la Résolution onusienne, le Maroc procédera à l’actualisation et à la formulation détaillée de la Proposition d’Autonomie en vue d’une soumission ultérieure aux Nations Unies. En tant que solution réaliste et applicable, elle devra constituer la seule base de négociation. Nous saisissons cette occasion pour exprimer nos remerciements et notre considération à tous les pays qui, par leurs positions constructives et leurs efforts soutenus en faveur du bon droit et de la légitimité, ont contribué à l’avènement de ce changement. Je réserve une mention spéciale aux Etats-Unis d’Amérique, sous le leadership de Notre Ami, Son Excellence le Président Donald Trump, dont les efforts ont permis d’ouvrir la voie à un règlement définitif de ce conflit. Nous remercions aussi nos amis en Grande-Bretagne et en Espagne, et plus spécialement, en France, dont les efforts ont concouru à faire aboutir ce processus pacifique. Nos vifs remerciements vont également à tous les pays arabes et africains frères qui n’ont jamais cessé d’exprimer leur soutien inconditionnel à la Marocanité du Sahara, ainsi qu’aux différents pays du monde qui appuient l’Initiative d’Autonomie.",
    vocabulary: [
      { fr: "Actualisation de la Proposition d'Autonomie", ar: "تحيين وتفصيل مبادرة الحكم الذاتي", explanation: "إعداد الصياغة التفصيلية الدقيقة لمبادرة الحكم الذاتي كإطار حاط وحيد للتفاوض الأممي." },
      { fr: "Solution réaliste et applicable", ar: "حل واقعي وقابل للتطبيق", explanation: "المرتكز الأممي المعتمد في قرارات مجلس الأمن لإنهاء النزاع الإقليمي المفتعل." },
      { fr: "Processus pacifique onusien", ar: "المسار السلمي الأممي", explanation: "المفاوضات والرعاية الأممية لإنهاء الخلاف تحت مظلة الشرعية والحق التاريخي." }
    ],
    analysis: "يعلن المغرب تحيين وتفصيل مقترح الحكم الذاتي لتقديمه للأمم المتحدة كأرضية حصرية للتفاوض، موجهاً الشكر والتقدير للولايات المتحدة والعديد من القوى الأوروبية والعربية والإفريقية."
  },
  {
    id: 4,
    title: "نداء جمع الشمل والحوار الأخوي الصادق وإحياء الاتحاد المغاربي",
    ar: "ورغم التطورات الإيجابية، التي تعرفها قضية وحدتنا الترابية، يبقى المغرب حريصا على إيجاد حل لا غالب فيه ولا مغلوب، يحفظ ماء وجه جميع الأطراف. فالمغرب لا يعتبر هذه التحولات انتصارا، ولا يستغلها لتأجيج الصراع والخلافات. وفي هذا السياق، نوجه نداء صادقا، لإخواننا في مخيمات تندوف، لاغتنام هذه الفرصة التاريخية، لجمع الشمل مع أهلهم، وما يتيحه الحكم الذاتي، للمساهمة في تدبير شؤونهم المحلية، وفي تنمية وطنهم، وبناء مستقبلهم، في إطار المغرب الموحد. وبصفتي ملك البلاد، الضامن لحقوق وحريات المواطنين، أؤكد أن جميع المغاربة سواسية، لا فرق بين العائدين من مخيمات تندوف، وبين إخوانهم داخل أرض الوطن. ومن جهة أخرى، أدعو أخي فخامة الرئيس عبد المجيد تبون، لحوار أخوي صادق، بين المغرب والجزائر، من أجل تجاوز الخلافات، وبناء علاقات جديدة، تقوم على الثقة، وروابط الأخوة وحسن الجوار. كما نجدد التزامنا بمواصلة العمل، من أجل إحياء الاتحاد المغاربي، على أساس الاحترام المتبادل، والتعاون والتكامل، بين دوله الخمس.",
    fr: "Bien que la question de notre intégrité territoriale connaisse des évolutions positives, le Maroc demeure attaché à la nécessité de parvenir à une solution qui sauve la face de toutes les parties, sans vainqueur, ni vaincu. Le Maroc ne brandit pas ces changements comme un trophée et ne souhaite nullement attiser les antagonismes ou accentuer les divisions. Dans ce contexte, Nous appelons sincèrement nos frères dans les camps de Tindouf à saisir cette opportunité historique pour retrouver les leurs et jouir de la possibilité que leur offre l’Initiative d’autonomie de contribuer à la gestion des affaires locales, au développement de leur patrie et à la construction de leur avenir, dans le giron du Maroc uni. En Ma qualité de Roi, garant des droits et des libertés des citoyens, J’affirme solennellement que les Marocains, étant tous égaux, il n’y a pas de différence entre les personnes rentrées des camps de Tindouf et leurs frères installés dans le reste du territoire national. Par ailleurs, J’invite Mon Frère, Son Excellence le Président Abdelmadjid Tebboune à un dialogue fraternel sincère entre le Maroc et l’Algérie afin que, nos différends dépassés, nous jetions les bases de relations nouvelles fondées sur la confiance, la fraternité et le bon voisinage. En outre, Nous réitérons notre engagement à continuer d’œuvrer à la relance de l’Union du Maghreb, sur la base du respect mutuel, de la coopération et de la complémentarité entre ses cinq Etats-membres.",
    vocabulary: [
      { fr: "Solution sans vainqueur ni vaincu", ar: "حل لا غالب فيه ولا مغلوب", explanation: "الموقف الشهم والرصين للمملكة الذي يحفظ ماء وجه جميع الأطراف ويرفض التباهي والانتصار الذاتي." },
      { fr: "Dialogue fraternel sincère", ar: "حوار أخوي صادق", explanation: "الدعوة الملكية المتجددة للجزائر لتجاوز الخلافات وبناء علاقات ثنائية جديدة قائمة على حسن الجوار." },
      { fr: "Égalité des citoyens et retour", ar: "المساواة بين جميع المواطنين والعودة", explanation: "الضمانة الدستورية والملكية السامية للمواطنين القادمين من مخيمات تندوف بدمجهم الكامل." }
    ],
    analysis: "يستعرض الخطاب سمو الموقف المغربي المتسامح القائم على مبدأ 'لا غالب ولا مغلوب'، موجهاً نداء تاريخياً لإخواننا بتندوف، ودعوة متجددة لحوار أخوي مع الجزائر وإحياء بناء الاتحاد المغاربي."
  },
  {
    id: 5,
    title: "التضحيات الوطنية والإشادة بالقوات المسلحة والدبلوماسية الوطنية",
    ar: "شعبي العزيز، إن ما تعرفه أقاليمنا الجنوبية من تنمية شاملة وأمن واستقرار، هو بفضل تضحيات جميع المغاربة. ولا يسعنا هنا، إلا أن نعبر عن اعتزازنا وتقديرنا، لكل رعايانا الأوفياء، لاسيما سكان أقاليمنا الجنوبية، الذين أكدوا على الدوام، تشبثهم بمقدسات الأمة، وبالوحدة الوطنية والترابية للبلاد. كما نشيد بالجهود الدؤوبة، التي تبذلها الدبلوماسية الرسمية والحزبية والبرلمانية، ومختلف المؤسسات الوطنية، من أجل الطي النهائي لملف وحدتنا الترابية. ونغتنم ذكرى المسيرة الخضراء الخالدة، لنستحضر بكل إجلال وتقدير، التضحيات الجسيمة، التي قدمتها القوات المسلحة الملكية، والقوات الأمنية، بكل مكوناتها، وعائلاتهم بمختلف مناطق البلاد، طيلة خمسين سنة الماضية، في سبيل الدفاع عن وحدة الوطن، والحفاظ على أمنه واستقراره. كما نترحم على الأرواح الطاهرة لمبدعها، والدنا المنعم جلالة الملك الحسن الثاني، أكرم الله مثواه، وكل شهداء الوطن الأبرار. والسلام عليكم ورحمة الله تعالى وبركاته.",
    fr: "Cher peuple, Le développement général de nos provinces du sud, ainsi que la sécurité et la stabilité qui y règnent, ont été possibles grâce aux sacrifices de tous les Marocains. A ce propos, Nous tenons à exprimer la fierté et la considération que Nous inspirent tous Nos fidèles sujets, et plus particulièrement les habitants de nos Provinces du sud, qui ont toujours manifesté leur attachement aux symboles sacrés de la Nation, à son unité nationale et à son intégrité territoriale. Nous saluons également les efforts inlassables de la diplomatie officielle, partisane et parlementaire et ceux des différentes institutions nationales, pour clore définitivement le dossier de notre intégrité territoriale. L’anniversaire de la Glorieuse Marche Verte est l’occasion de nous remémorer avec déférence les grands sacrifices consentis, durant les cinquante dernières années, par les Forces Armées Royales et les Forces de sécurité dans toutes leurs composantes, ainsi que par leurs familles established sur tout le territoire national, afin de défendre l’unité du pays et de préserver sa sécurité et sa stabilité. Nous nous rappelons avec recueillement et saluons la mémoire de l’Artisan de la Marche Verte, Notre Vénéré Père, Sa Majesté le Roi Hassan II, que Dieu l’ait en Sa sainte miséricorde, ainsi que celle de tous les valeureux martyrs de la Nation. Wassalamou alaikoum wa rahmatoullah wa barakatouh.",
    vocabulary: [
      { fr: "Attachement aux symboles sacrés", ar: "التشبث بمقدسات الأمة والوحدة الترابية", explanation: "صمود وتلاحم الساكنة والتفافهم الدائم حول الثوابت الوطنية والعرش العلوي المجيد." },
      { fr: "Forces Armées Royales et Sécurité", ar: "القوات المسلحة الملكية والقوات الأمنية", explanation: "الدرع الحصين للوطن وتضحياتهم الجسيمة طيلة نصف قرن دفاعاً عن سيادة واستقرار المملكة." },
      { fr: "Artisan de la Marche Verte", ar: "مبدع المسيرة الخضراء", explanation: "الملك الراحل الحسن الثاني طيب الله ثراه عبقري السلم والمسيرة المظفرة لاسترجاع الصحراء." }
    ],
    analysis: "يختتم الخطاب الملكي بالإشادة بسكان الصحراء المغربية والقوات المسلحة الملكية والأمن والدبلوماسية الوطنية، مع الاستحضار الخالد لمبدع المسيرة الخضراء جلالة الملك الحسن الثاني والمطالبة بالوفاء لشهداء الوطن."
  }
];

export type SpeechYearKey = 1999 | 2000 | 2001 | 2002 | 2003 | 2004 | 2005 | 2007 | 2009 | 2012 | 2018 | 2019 | 2024 | 2025 | "2025_sahara";

const SPEECH_TITLES: Record<SpeechYearKey, { title: string; subtitle: string }> = {
  1999: { title: "خطاب العرش الأول (1999)", subtitle: "الرؤية التأسيسية لإصلاح منظومة القضاء" },
  2000: { title: "خطاب اتحاد المحامين العرب (2000)", subtitle: "تلازم القضاء والمحاماة لإقامة العدالة" },
  2001: { title: "خطاب افتتاح السنة القضائية (2001)", subtitle: "تحديث الأجهزة القضائية وتقريب القضاء" },
  2002: { title: "خطاب افتتاح السنة القضائية (2002)", subtitle: "تأهيل المحاكم وتطوير القضاء الاستثماري" },
  2003: { title: "خطاب افتتاح السنة القضائية (2003)", subtitle: "عصرنة القوانين وحماية الاستثمار والأسرة" },
  2004: { title: "خطاب افتتاح السنة القضائية (2004)", subtitle: "تعزيز نجاعة المحاكم وتكريس الاستقلالية" },
  2005: { title: "خطاب افتتاح السنة القضائية (2005)", subtitle: "مواصلة الإصلاح الشامل وتأهيل العنصر البشري" },
  2007: { title: "خطاب افتتاح السنة القضائية (2007)", subtitle: "ترسيخ دولة الحق والقانون والأمن القضائي" },
  2009: { title: "خطاب العرش السامي (2009)", subtitle: "خارطة الطريق الاستراتيجية للإصلاح العميق" },
  2012: { title: "خطاب تنصيب الهيئة العليا للحوار (2012)", subtitle: "التأسيس للميثاق الوطني لإصلاح منظومة العدالة" },
  2018: { title: "الرسالة السامية لمؤتمر مراكش الدولي (2018)", subtitle: "استقلال القضاء وصون ضمانات المتقاضين" },
  2019: { title: "الرسالة السامية للمؤتمر الدولي الثاني للعدالة (2019)", subtitle: "العدالة والاستثمار: التحديات والرهانات" },
  2024: { title: "الرسالة السامية لمؤتمر المدن والحكومات المتحدة (2024)", subtitle: "الخدمات العمومية المحلية الشاملة والجهوية المتقدمة" },
  2025: { title: "خطاب افتتاح السنة التشريعية (10 أكتوبر 2025)", subtitle: "العدالة الاجتماعية والمجالية وجيل جديد من التنمية الترابية" },
  "2025_sahara": { title: "الخطاب السامي الموجه للشعب الوفي (31 أكتوبر 2025)", subtitle: "القرار التاريخي لمجلس الأمن والحكم الذاتي والذكرى 50 للمسيرة الخضراء" }
};

// Bilingual Dictionaries for Instant Terminology Lookup
const DICTIONARY_AR_FR: Record<string, string> = {
  "الملك": "le Roi",
  "محمد": "Mohammed",
  "السادس": "VI",
  "المغرب": "le Maroc",
  "المغربية": "marocaine / du Maroc",
  "المملكة": "le Royaume",
  "العرش": "le Trône",
  "الرعاية": "le Patronage",
  "السامية": "Haute / Royale",
  "الرسالة": "le Message / la Lettre",
  "رسالة": "Message / Lettre",
  "الخطاب": "le Discours",
  "خطاب": "Discours",
  "القضاء": "la Justice / le Pouvoir Judiciaire",
  "القضائي": "judiciaire",
  "القضائية": "judiciaire / judiciaires",
  "العدل": "la Justice",
  "العدالة": "la Justice",
  "المحاكم": "les Tribunaux",
  "المحكمة": "la Cour / le Tribunal",
  "الدستور": "la Constitution",
  "الدستوري": "constitutionnel",
  "الدستورية": "constitutionnelle",
  "القانون": "la Loi / le Droit",
  "القوانين": "les Lois",
  "التنمية": "le Développement",
  "الاستثمار": "l'Investissement",
  "الاقتصاد": "l'Économie",
  "الاقتصادي": "économique",
  "المقاولة": "l'Entreprise",
  "المقاولات": "les Entreprises",
  "الشغل": "l'Emploi / le Travail",
  "التعليم": "l'Éducation / l'Enseignement",
  "الصحة": "la Santé",
  "المواطن": "le Citoyen",
  "المواطنين": "les Citoyens",
  "المتقاضين": "les Justiciables",
  "الحق": "le Droit / la Vérité",
  "الحقوق": "les Droits",
  "الحريات": "les Libertés",
  "الديمقراطية": "la Démocratie",
  "الحكامة": "la Gouvernance",
  "المحلية": "locale / locales",
  "الجهوية": "la Régionalisation / régionale",
  "المتقدمة": "avancée / avancées",
  "الترابية": "territoriale / territoriales",
  "الجماعات": "les Collectivités",
  "المجالية": "territoriale / spatiale",
  "الفوارق": "les Inégalités / Disparités",
  "الاجتماعية": "sociales",
  "التعاون": "la Coopération",
  "التضامن": "la Solidarité",
  "الاستدامة": "la Durabilité",
  "مستدام": "durable",
  "التكامل": "la Complémentarité / l'Intégration",
  "الالتقائية": "la Transversalité / la Convergence",
  "الإنصاف": "l'Équité",
  "النزاعات": "les Litiges / Contentieux",
  "المنازعات": "les Différends / Litiges",
  "الصلح": "la Conciliation",
  "الوساطة": "la Médiation",
  "التحكيم": "l'Arbitrage",
  "النيابة": "le Ministère Public / le Parquet",
  "العامة": "Public / Générale",
  "التشريعية": "législatif / législative",
  "التنفيذية": "exécutif / exécutive",
  "المسؤولية": "la Responsabilité",
  "المحاسبة": "la Reddition des comptes",
  "الرقمي": "numérique / digital",
  "التحول": "la Transformation / Transition",
  "الإصلاح": "la Réforme",
  "الشراكة": "le Partenariat",
  "الشراكات": "les Partenariats",
  "التمويل": "le Financement",
  "الشباب": "les Jeunes",
  "النساء": "les Femmes",
  "الأطفال": "les Enfants",
  "الأسرة": "la Famille",
  "الأجر": "le Salaire",
  "الأجراء": "les Salariés / Employés",
  "أرباب": "les Patrons / Employeurs",
  "صاحب": "Sa / le Détenteur",
  "النقض": "la Cassation",
  "التجارة": "le Commerce",
  "التجاري": "commercial",
  "المال": "la Finance / l'Argent / les Deniers",
  "المالية": "financière / financières",
  "العمومية": "publique / publiques",
  "الخدمات": "les Services",
  "شعار": "Thème / Slogan / Devise",
  "جيل": "Génération",
  "جديد": "Nouvelle / Nouveau",
  "طنجة": "Tanger",
  "مراكش": "Marrakech",
  "الرباط": "Rabat",
  "يونيو": "Juin",
  "الجاري": "Courant",
  "الساكنة": "la Population",
  "التشخيص": "le Diagnostic",
  "الموارد": "les Ressources",
  "المناخ": "le Climat",
  "المناخية": "climatiques",
  "الهجرة": "la Migration",
  "الأطلسي": "Atlantique",
  "الإفريقي": "Africain",
  "الساحل": "le Sahel",
  "الغاز": "le Gaz",
  "الصندوق": "le Fonds",
  "المنتخبين": "les Élus",
  "الكرامة": "la Dignité",
  "تطلعات": "Aspirations",
  "التشاور": "la Concertation",
  "التعاقد": "la Contractualisation",
  "التتبع": "le Suivi",
  "التقييم": "l'Évaluation",
  "النجاعة": "l'Efficience / l'Efficacité",
  "الأمن": "la Sécurité",
  "صون": "la Préservation / la Sauvegarde",
  "ضمان": "la Garantie",
  "ضمانات": "les Garanties",
  "المحاكمة": "le Procès",
  "العادلة": "Équitable",
  "التخطيط": "la Planification",
  "الاستراتيجي": "Stratégique"
};

const DICTIONARY_FR_AR: Record<string, string> = {
  "roi": "الملك",
  "majesté": "الجلالة",
  "message": "الرسالة",
  "lettre": "الرسالة / الكتاب",
  "congrès": "المؤتمر",
  "gouvernements": "الحكومات",
  "cités": "المدن",
  "locaux": "المحلية",
  "unis": "المتحدة",
  "services": "الخدمات",
  "publics": "العمومية",
  "justice": "العدالة / القضاء",
  "territoriale": "المجالية",
  "régionalisation": "الجهوية",
  "avancée": "المتقدمة",
  "réforme": "الإصلاح",
  "constitution": "الدستور",
  "pouvoir": "السلطة",
  "judiciaire": "القضائي / القضائية",
  "législatif": "التشريعية",
  "exécutif": "التنفيذية",
  "développement": "التنمية",
  "démocratie": "الديمقراطية",
  "gouvernance": "الحكامة",
  "sécurité": "الأمن",
  "garantie": "ضمان",
  "justiciables": "المتقاضين / المتقاضون",
  "règles": "قواعد",
  "procès": "محاكمة / المحاكمة",
  "équitable": "العادلة / العادل",
  "coopération": "التعاون",
  "solidarité": "التضامن",
  "économie": "الاقتصاد",
  "investissement": "الاستثمار",
  "durabilité": "الاستدامة",
  "durable": "مستدام",
  "citoyen": "المواطن",
  "institutions": "المؤسسات",
  "responsabilité": "المسؤولية",
  "comptes": "المحاسبة",
  "femmes": "النساء",
  "jeunes": "الشباب",
  "vulnérables": "الفئات الهشة",
  "partenariats": "الشراكات",
  "ressources": "الموارد",
  "climatiques": "المناخية",
  "migration": "الهجرة",
  "santé": "الصحة",
  "éducation": "التعليم / التربية",
  "eau": "الماء",
  "emploi": "التشغيل",
  "logement": "السكن",
  "numérique": "الرقمي",
  "transparence": "الشفافية",
  "participation": "المشاركة",
  "multilatéralisme": "التعددية",
  "sahara": "الصحراء",
  "afrique": "إفريقيا",
  "atlantique": "الأطلسي",
  "sahel": "الساحل",
  "fonds": "الصندوق",
  "élus": "المنتخبين / المنتخبون",
  "dignité": "الكرامة",
  "aspirations": "التطلعات",
  "légitimes": "المشروعة",
  "entreprises": "المقاولات",
  "entreprise": "المقاولة",
  "finance": "المال / المالية",
  "affaires": "الأعمال",
  "tanger": "طنجة",
  "marrakech": "مراكش",
  "rabat": "الرباط",
  "juin": "يونيو",
  "courant": "الجاري",
  "population": "الساكنة",
  "diagnostic": "التشخيص",
  "concertation": "التشاور",
  "contractualisation": "التعاقد",
  "suivi": "التتبع",
  "évaluation": "التقييم",
  "efficience": "النجاعة",
  "efficacité": "الفعالية",
  "préservation": "صون",
  "sauvegarde": "صون / حماية",
  "planification": "التخطيط",
  "stratégique": "الاستراتيجي",
  "loi": "القانون",
  "loi organique": "القانون التنظيمي",
  "parquet": "النيابة العامة",
  "code": "مدونة / قانون",
  "tribunal": "المحكمة",
  "tribunaux": "المحاكم",
  "cour": "المحكمة",
  "cassation": "النقض"
};

// Helper to extract up to 10 legal terms from a given speech section
function extractSectionTerms(section: SpeechSection | null): VocabItem[] {
  if (!section) return [];
  const terms: VocabItem[] = [...(section.vocabulary || [])];
  
  const MASTER_EXTENSIONS: { ar: string; fr: string; explanation: string }[] = [
    { ar: "الملك", fr: "le Roi", explanation: "رئيس الدولة وممثلها الأسمى، وتصدر الأحكام وتنفذ باسم جلالته." },
    { ar: "الدستور", fr: "la Constitution", explanation: "القانون الأسمى للدولة الذي ينظم السلطات ويضمن الحقوق والحريات." },
    { ar: "استقلال القضاء", fr: "l'indépendance de la justice", explanation: "المبدأ الدستوري والقانوني الكوني لفصل السلط القضائية." },
    { ar: "المتقاضين", fr: "les justiciables", explanation: "الأفراد والمؤسسات الخاضعون لاختصاص المحاكم وحقهم في الإنصاف." },
    { ar: "العدالة", fr: "la justice", explanation: "الغاية الأسمى للقانون لضمان الإنصاف والمساواة أمام القضاء." },
    { ar: "الجهوية المتقدمة", fr: "la régionalisation avancée", explanation: "نموذج اللامركزية الإدارية المغربي الرائد لتنمية مستدامة." },
    { ar: "الاستثمار", fr: "l'investissement", explanation: "توظيف الرساميل في مشاريع تنموية تتطلب بيئة قضائية وقانونية آمنة." },
    { ar: "الحكامة", fr: "la gouvernance", explanation: "أسلوب إدارة المؤسسات العامة بالارتكاز على النجاعة والشفافية." },
    { ar: "النزاعات", fr: "les litiges / contentieux", explanation: "الخصومات والادعاءات المعروضة على القضاء للبت فيها وحسمها." },
    { ar: "الصلح", fr: "la conciliation", explanation: "الوسائل البديلة لحل المنازعات ودياً بين الأطراف دون قضاء خصومة." },
    { ar: "الوساطة", fr: "la médiation", explanation: "تدخل طرف ثالث محايد لمساعدة الأطراف في التوصل لحل ودي للنزاع." },
    { ar: "التحكيم", fr: "l'arbitrage", explanation: "قضاء خاص اتفاقي يعهد فيه الأطراف بنزاعهم لمحكمين لحسمه بقرار ملزم." },
    { ar: "النيابة العامة", fr: "le Ministère Public / le Parquet", explanation: "الهيئة القضائية المكلفة بتمثيل المجتمع والمطالبة بتطبيق القانون." },
    { ar: "المسؤولية والمحاسبة", fr: "la responsabilité et la reddition des comptes", explanation: "المبدأ الدستوري الذي يربط ممارسة السلطة بتقديم الحساب." },
    { ar: "التحول الرقمي", fr: "la transition digitale / numérique", explanation: "رقمنة الإدارات والمحاكم لتسريع ونجاعة الخدمات القضائية." },
    { ar: "الإنصاف", fr: "l'équité", explanation: "تطبيق روح العدالة والمساواة بما يتجاوز حرفية النص الجافة." },
    { ar: "المحكمة", fr: "le tribunal / la cour", explanation: "الهيئة القضائية الرسمية المخولة للنظر والفصل في الدعاوى والطلبات." },
    { ar: "الخدمات العمومية", fr: "les services publics", explanation: "المرافق والأنشطة الإدارية الموجهة لتلبية الحاجيات الأساسية للمواطنين." },
    { ar: "التنمية المستدامة", fr: "le développement durable", explanation: "التنمية التي تلبي احتياجات الحاضر دون المساس بقدرة الأجيال المقبلة." },
    { ar: "الكرامة", fr: "la dignité", explanation: "الحق الإنساني المتأصل والمصون دستورياً لكل المواطنين والمواطنات." },
    { ar: "التدبير الحر", fr: "la libre gestion", explanation: "مبدأ دستوري يمنح الجماعات الترابية استقلالية تدبير شؤونها بقراراتها." },
    { ar: "التعاقد", fr: "la contractualisation", explanation: "آلية الشراكة والتزام الأطراف لإنجاز المشاريع التنموية المشتركة." },
    { ar: "التخطيط الاستراتيجي", fr: "la planification stratégique", explanation: "تحديد الأهداف التنموية المتوسطة والبعيدة المدى وآليات تحقيقها." },
    { ar: "سيادة الشرعية", fr: "la prééminence de la légalité", explanation: "خضوع سائر القرارات الإدارية والتصرفات لسيادة القانون والعدالة." },
    { ar: "المحاكمة العادلة", fr: "le procès équitable", explanation: "الضمانات الدستورية والمحاكمة وفق شروط قانونية نزيهة وحيادية." },
    { ar: "التنمية المحلية", fr: "le développement local", explanation: "تحسين جودة عيش الساكنة محلياً عبر الموارد والفاعلين الترابيين." },
    { ar: "التعاون جنوب - جنوب", fr: "la coopération Sud-Sud", explanation: "التعاون التنموي والشراكة الاقتصادية بين بلدان الجنوب لتحقيق الازدهار." },
    { ar: "القوانين", fr: "les lois", explanation: "التشريعات المكتوبة التي تنظم المعاملات وتحدد الواجبات والحقوق." },
    { ar: "المقاولة", fr: "l'entreprise", explanation: "الوحدة الاقتصادية المنتجة والمشغلة التي تستلزم بيئة تشريعية مشجعة." },
    { ar: "العمل المشترك", fr: "l'action concertée", explanation: "تنسيق الجهود بين الدولة والجماعات الترابية وباقي الشركاء للتنمية." }
  ];

  const arText = section.ar || "";
  const frText = section.fr || "";

  for (const ext of MASTER_EXTENSIONS) {
    if (terms.length >= 10) break;
    const isDuplicate = terms.some(
      t => t.ar.toLowerCase().includes(ext.ar.toLowerCase()) || 
           ext.ar.toLowerCase().includes(t.ar.toLowerCase()) ||
           t.fr.toLowerCase().includes(ext.fr.toLowerCase()) ||
           ext.fr.toLowerCase().includes(t.fr.toLowerCase())
    );
    if (isDuplicate) continue;

    if (arText.includes(ext.ar) || frText.toLowerCase().includes(ext.fr.toLowerCase())) {
      terms.push(ext);
    }
  }

  // Pad to 10 if still needed
  for (const ext of MASTER_EXTENSIONS) {
    if (terms.length >= 10) break;
    const isDuplicate = terms.some(
      t => t.ar.toLowerCase().includes(ext.ar.toLowerCase()) || 
           ext.ar.toLowerCase().includes(t.ar.toLowerCase()) ||
           t.fr.toLowerCase().includes(ext.fr.toLowerCase()) ||
           ext.fr.toLowerCase().includes(t.fr.toLowerCase())
    );
    if (!isDuplicate) {
      terms.push(ext);
    }
  }

  return terms.slice(0, 10);
}

// Helper to get customized main ideas in Arabic for each section
function getSectionMainIdeas(section: SpeechSection | null, year: SpeechYearKey): string[] {
  if (!section) return [];
  const key = `${year}_${section.id}`;
  
  const CUSTOM_IDEAS: Record<string, string[]> = {
    "1999_1": [
      "افتتاح الدورة العادية للمجلس الأعلى للقضاء برئاسة جلالة الملك محمد السادس.",
      "التأكيد على الأهمية القصوى والمنزلة الرفيعة التي يتبوأها جهاز القضاء في البناء الدستوري للمملكة.",
      "إبراز الطابع الروحي والتاريخي للقضاء بصفته مسؤولية دينية موكولة لأمير المؤمنين، يفوض النهوض بها لقضاة يصدرون الأحكام باسمه."
    ],
    "1999_2": [
      "تأكيد العزم على مواصلة مسار التحديث والتطوير القضائي وفق النهج الذي أسسه الملك الراحل الحسن الثاني.",
      "الارتكاز القوي على المرجعية الإسلامية الثابتة والتراث العلمي والاجتهادي الزاخر لفقهاء الأمة وقضاتها.",
      "تثمين نزاهة وتقوى قضاة المغرب تاريخياً، والدعوة للاقتداء بتبريزهم الفقهي في حسم القضايا والنوازل المستحدثة."
    ],
    "1999_3": [
      "التطلع لبناء قضاء حديث ومتطور يواكب عصر العولمة والثورة التكنولوجية والمشكلات المعاصرة.",
      "التعبئة الوطنية الشاملة لإصلاح منظومة العدالة من خلال رؤية تجديدية للمسؤولية.",
      "ترسيخ المفهوم الجديد للسلطة الذي يربط الإدارة والعدالة بالمواطنة وحماية الحقوق والحريات."
    ],
    "1999_4": [
      "تثمين الإصلاحات الهيكلية والتنظيمية السابقة التي عززت توحيد جهاز القضاء وتأسيس المحاكم المتخصصة.",
      "صون استقلال القضاء وتوفير الضمانات الكفيلة بتمكين القضاة من أداء رسالتهم بنزاهة وحياد.",
      "اعتبار القضاء مكوناً فاعلاً ومحورياً في تحقيق التنمية الشاملة بأبعادها السياسية الاقتصادية والاجتماعية."
    ],
    "1999_5": [
      "تطوير وتحديث المعهد الوطني للقضاء (المعهد العالي للقضاء حالياً) لضمان تكوين مستمر ومتفتح يواكب التشريعات المقارنة.",
      "تعزيز الثقة في المنظومة القضائية لدى المواطنين والشركاء الأجانب والفاعلين الاقتصاديين.",
      "توسيع نطاق المحاكم التجارية وإحداث محاكم استئناف إدارية تمهيداً لإنشاء مجلس الدولة كأعلى سلطة للرقابة على الشطط الإداري."
    ],
    "1999_6": [
      "الدعوة للإسراع بإعداد وتنزيل القوانين المنظمة للمجلس الأعلى والمجالس الجهوية للحسابات لحماية المال العام.",
      "مكافحة كافة أشكال التسيب والعبث بالموارد المالية للدولة ومحاربة استغلال النفوذ والفساد الإداري.",
      "توفير بيئة مادية لائقة وبنايات حديثة للمحاكم وعقلنة تدبير الشؤون القضائية لتحقيق العدالة الاجتماعية."
    ],
    "1999_7": [
      "التأكيد على أن تحقيق أهداف القضاء يقتضي ضمان الحرمة والمهابة اللازمة للمؤسسات القضائية واستقلال أحكامها.",
      "ربط الأحكام القضائية بقيم الإنصاف وفورية البت والسرعة في التنفيذ لضمان حقوق المتقاضين.",
      "إلزام القضاة بالاستناد الحصري على التطبيق السليم للقانون وما يمليه الضمير والوجدان بمنأى عن الضغوط والمؤثرات الخارجية."
    ],
    "2001_1": [
      "العزم الملكي الراسخ على النهوض الشامل بأوضاع المرأة المغربية وحمايتها من كافة أشكال الحيف والتمييز.",
      "الارتكاز على صفة أمير المؤمنين في تفعيل الإصلاح مع الالتزام التام بحدود وثوابت الشريعة الإسلامية السمحاء.",
      "تأصيل المساواة والعدل الإنساني استناداً للحديث النبوي الشريف الشامخ: 'إنما النساء شقائق الرجال في الأحكام'."
    ],
    "2001_2": [
      "اعتماد منهجية الاجتهاد الإسلامي المعتدل والمنفتح القائم على الوسطية والاعتدال واليسر ومراعاة مقاصد الشريعة.",
      "ترسيخ دور الأسرة كنواة أساسية للمجتمع وصيانة حقوق الطفل والكرامة الإنسانية لجميع أفرادها.",
      "الدعوة لبناء مدونة أسرة عصرية متوازنة تعكس التطور الاجتماعي والاقتصادي للمملكة المغربية."
    ],
    "2001_3": [
      "تكليف لجنة استشارية ملكية خاصة لإعداد مشروع تعديل مدونة الأحوال الشخصية (التي أصبحت مدونة الأسرة).",
      "اختيار أعضاء اللجنة من ذوي الكفاءة والنزاهة الفكرية والفقهية لضمان صياغة قانونية رفيعة المستوى ومتكاملة.",
      "الجمع الخلاق بين الأصالة الفقهية المستنيرة والمعاصرة القانونية في صيانة حقوق المرأة والطفل وحماية تماسك الأسرة."
    ],
    "2024_1": [
      "الترحيب السامي بالوفود المشاركة في المؤتمر العالمي لمنظمة المدن والحكومات المحلية المتحدة بطنجة.",
      "التأكيد على دور الجماعات الترابية في قيادة الديمقراطية المحلية وتحقيق التنمية المجالية والإنصاف بين الجهات.",
      "الدعوة لبناء مستقبل مشترك أكثر إنصافاً واستدامة من خلال تمكين الإدارات والوحدات اللامركزية."
    ],
    "2024_2": [
      "إبراز الدلالات التاريخية والجغرافية لمدينة طنجة كرمز للانفتاح والتعايش والحوار الثقافي بين القارات.",
      "تثمين شعار المؤتمر المتمثل في تقديم 'جيل جديد من الخدمات العمومية المحلية الشاملة'.",
      "التأكيد على أن الحكامة الترابية تعد رافعة أساسية لتقليص الفوارق الاجتماعية وتجديد ثقة المواطن في المؤسسات."
    ],
    "2024_3": [
      "اعتبار الإصلاح المجالي والترابي أحد المرتكزات الاستراتيجية لبناء الدولة المغربية الحديثة وتقريب القرار من المواطن.",
      "التأكيد على أن الجهوية المتقدمة اختيار استراتيجي لا رجعة فيه لتحديث الدولة وتحرير الطاقات الترابية.",
      "الربط الوثيق بين خطط التنمية والخصوصيات الجغرافية والثقافية والاحتياجات الفعلية لساكنة كل جهة."
    ],
    "2024_4": [
      "تكريس موقع الجهة كفضاء قيادي للتخطيط الاستراتيجي المستدام وجذب الاستثمارات وتنشيط الاقتصاد المحلي.",
      "تعزيز التعاون والالتقائية والانسجام بين البرامج القطاعية المركزية والمخططات التنموية الترابية.",
      "تفعيل مبادئ التدبير الحر، والتعاون والتعاضد المؤسساتي، وربط المسؤولية بالمحاسبة لتجاوز العقبات الإدارية."
    ],
    "2024_5": [
      "إطلاق برامج تنموية مندمجة تركز على التشخيص الدقيق والإنصات الفعال للمواطنين والفاعلين على الأرض.",
      "إعطاء الأولوية القصوى لقطاعات الحياة اليومية الحرجة: التشغيل، التعليم، الصحة، وتدبير ندرة المياه.",
      "إرساء منهجية تعاقدية وتشاركية صارمة في تقييم النتائج وتدبير الموارد بنجاعة لبناء العيش الكريم."
    ],
    "2024_6": [
      "إبراز العمق الإفريقي للمغرب وتفعيل المبادرات الاستراتيجية الكبرى للتعاون جنوب-جنوب (الولوج للأطلسي وأنبوب الغاز).",
      "تفعيل التعاون الدولي اللامركزي كرافعة لنقل الخبرات والنجاحات الإدارية والتنموية بين الوحدات الترابية.",
      "تثمين الصندوق الإفريقي لدعم التعاون اللامركزي (FACDI) كأداة مبتكرة لتقوية القدرات وتحقيق التنمية الإفريقية المشتركة."
    ],
    "2025_1": [
      "التأكيد على الأهمية الدستورية للتشريع، ومراقبة العمل الحكومي، وتقييم السياسات العمومية في السنة التشريعية الأخيرة.",
      "الإشادة بالجهود المبذولة للارتقاء بالدبلوماسية البرلمانية والحزبية في خدمة القضايا العليا للوطن.",
      "الدعوة إلى المزيد من الاجتهاد والفعالية والتعاون والتكامل التام مع الدبلوماسية الرسمية للمملكة."
    ],
    "2025_2": [
      "استكمال المخططات التشريعية والبرامج المفتوحة بروح الجدية والمسؤولية والالتزام بالدفاع عن المواطنين.",
      "تأكيد عدم وجود تناقض أو تنافس بين المشاريع الوطنية الكبرى والبرامج الاجتماعية لتنمية البلاد وتجويد العيش.",
      "التأكيد على المسؤولية الجماعية للبرلمان والأحزاب والمجتمع المدني والإعلام في تأطير المواطنين والتعريف بالقوانين والقرارات."
    ],
    "2025_3": [
      "تسريع مسيرة المغرب الصاعد وإطلاق جيل جديد من برامج التنمية الترابية العابرة للزمن الحكومي والبرلماني.",
      "اعتبار العدالة الاجتماعية والمجالية توجهاً استراتيجياً ورهاناً مصيرياً وليس مجرد شعار أو أولوية مرحلية.",
      "ضمان تكافؤ الفرص واستفادة جميع المواطنين بمختلف أقاليم المملكة من ثمار النمو والحقوق المضمونة."
    ],
    "2025_4": [
      "التأكيد على تغيير العقليات وطريقة العمل وترسيخ ثقافة النتائج القائمة على المعطيات الميدانية والدقة والرقمنة.",
      "تسريع وتيرة وأثر الجيل الجديد لبرامج التنمية الترابية في إطار علاقة رابح-رابح بين المجالات الحضرية والقروية.",
      "محاربة الممارسات الهادرة للوقت والجهد والإمكانات وعدم التهاون في نجاعة ومردودية الاستثمار العمومي."
    ],
    "2025_5": [
      "إقرار سياسة عمومية مندمجة خاصة بتنمية المناطق الجبلية (التي تشكل 30% من التراب الوطني) والواحات.",
      "التفعيل الأمثل للتنمية المستدامة للسواحل الوطنية وقانون الساحل لبناء اقتصاد بحري خلق للثروة والشغل.",
      "توسيع برنامج المراكز القروية الناشئة كآلية لتدبير التوسع الحضري وتقريب الخدمات الأساسية من العالم القروي."
    ],
    "2025_6": [
      "دعوة البرلمان والحكومة بأغلبيتها ومعارضتها لتعبئة كافة الطاقات والإمكانات لمواجهة تحديات السنة المقبلة.",
      "تغليب المصالح العليا للوطن والمواطنين والارتكاز على مبادئ النزاهة والالتزام ونكران الذات.",
      "الاستدلال بالآية الكريمة لتأكيد أمانة العمل والمحاسبة الإلهية والمؤسساتية على المجهودات والممارسات."
    ],
    "2025_sahara_1": [
      "الإعلان عن بدء فتح جديد لترسيخ مغربية الصحراء والطي النهائي للنزاع المفتعل على أساس الحكم الذاتي.",
      "التزامن التاريخي المشرّف بين القرار الأممي والذكرى 50 للمسيرة الخضراء والذكرى 70 للاستقلال.",
      "تأكيد مرحلة فاصلة في تاريخ المغرب الحديث: 'ما قبل 31 أكتوبر 2025 وما بعده' لمغرب موحد من طنجة إلى لكويرة."
    ],
    "2025_sahara_2": [
      "التحول الاستراتيجي من مرحلة التدبير إلى مرحلة التغيير بفضل الدينامية الدبلوماسية الملكية.",
      "اعتماد ثلثي دول الأمم المتحدة لمبادرة الحكم الذاتي كإطار وحيد لحل النزاع الإقليمي.",
      "تزايد الاعتراف بالسيادة الاقتصادية للمغرب وتشجيع الاستثمارات الدولية لجعل الصحراء قطباً للتنمية والاستقرار."
    ],
    "2025_sahara_3": [
      "دخول مرحلة الحسم الأممي وتحيين وتفصيل مبادرة الحكم الذاتي كأساس حصري للتفاوض.",
      "توجيه الشكر والتقدير للولايات المتحدة الأمريكية وللرئيس دونالد ترامب لدورهم في فتح طريق الحل النهائي.",
      "الإشادة بمواقف بريطانيا وإسبانيا وخاصة فرنسا، وكافة الدول العربية والإفريقية الشقيقة الداعمة لمغربية الصحراء."
    ],
    "2025_sahara_4": [
      "التأكيد على حرص المغرب على إيجاد حل 'لا غالب فيه ولا مغلوب' يحفظ ماء وجه جميع الأطراف دون استغلال للانتصار.",
      "توجيه نداء صادق لأبناء الوطن بمخيمات تندوف لاغتنام الفرصة التاريخية والعودة لجمع الشمل والمساهمة في الحكم الذاتي.",
      "دعوة الرئيس الجزائري لحوار أخوي صادق لتجاوز الخلافات وبناء حسن الجوار وإحياء الاتحاد المغاربي."
    ],
    "2025_sahara_5": [
      "تثمين صمود وتضحيات سكان الأقاليم الجنوبية وتشبثهم بمقدسات الأمة والوحدة الترابية.",
      "الإشادة بتضحيات القوات المسلحة الملكية والأجهزة الأمنية والدبلوماسية الوطنية طيلة 50 سنة حمايةً للوطن.",
      "الترحم الخالد على مبدع المسيرة الخضراء جلالة المغفور له الملك الحسن الثاني وعلى شهداء الوطن الأبرار."
    ]
  };

  if (CUSTOM_IDEAS[key]) {
    return CUSTOM_IDEAS[key];
  }

  const fallbacks: Record<number, string[]> = {
    2000: [
      "إبراز مكانة السلطة القضائية المستقلة كصمام أمان لحماية الحقوق والحريات الأساسية للمواطنين.",
      "التأكيد على المبادئ الدستورية الراسخة للمملكة المغربية في فصل السلط والتعاون المتوازن بينها.",
      "الدعوة لتخليق الحياة العامة وتفعيل آليات المحاسبة والشفافية وتوفير شروط المحاكمة العادلة."
    ],
    2002: [
      "مواصلة إصلاح العدالة وتأهيل الموارد البشرية العاملة في المحاكم للرقي بمستوى الأحكام الصادرة.",
      "تحديث الهياكل القضائية ودعم التخصص في العمل القضائي لملائمة متطلبات الاقتصاد والاستثمار.",
      "الإنصات المستمر لتطلعات الساكنة لتعزيز ثقتها في القضاء وتيسير ولوجها للعدالة والإنصاف."
    ],
    2003: [
      "إبراز أهمية مدونة الأسرة الجديدة كورش مجتمعي وتنموي رائد يحافظ على تماسك الأسرة ويصون حقوق أفرادها.",
      "التوفيق الخلاق بين ثوابت المرجعية الإسلامية والمواثيق والاتفاقيات الدولية لحقوق الإنسان.",
      "التأكيد على دور القاضي المنصف والمتبصر في التفسير الإيجابي للتشريع وحماية المصلحة الفضلى للأطفال."
    ],
    2004: [
      "النهوض بالعمل الاجتماعي والإنساني وتأسيس مقومات التضامن المجتمعي لصيانة كرامة الفئات الهشة.",
      "إدماج مبادئ المساواة والعدالة الاجتماعية كشرط أساسي للتنمية الاقتصادية المستدامة والمواطنة الحقة.",
      "دعوة كافة الفاعلين لتثمين المكتسبات الحقوقية والتشريعية التي قطعتها المملكة المغربية بثبات."
    ],
    2005: [
      "تأكيد الرؤية الملكية السامية لإصلاح وتحديث القطاع المالي والإداري بما يخدم التنافسية الاقتصادية للمغرب.",
      "ربط المنظومة القضائية بآليات حسم المنازعات التجارية بطرق سريعة وفعالة ومضمونة العواقب.",
      "التشجيع المتواصل للفاعلين والشركاء المحليين والدوليين للاستثمار في فضاء قانوني ومؤسساتي آمن ونزيه."
    ],
    2007: [
      "الدعوة لتعزيز المكتسبات الديمقراطية وتطوير آليات الحكامة الجيدة في سائر مرافق الدولة وإداراتها العامة.",
      "التركيز على حماية حقوق المتقاضين وترسيخ مبادئ النزاهة والموضوعية في تطبيق النصوص القانونية والمسطرية.",
      "توسيع مجالات التدريب والتكوين التخصصي للقضاة وكتاب الضبط لمواكبة تحولات بيئة المال والأعمال."
    ],
    2009: [
      "إطلاق ورش الإصلاح الشامل والعميق لمنظومة العدالة بمفهومها الواسع المندمج الذي يتجاوز حدود المحاكم.",
      "تأصيل المرجعية التاريخية لثورة الملك والشعب وربطها بالتحديث المؤسسي الدائم وسيادة الشرعية والقانون.",
      "القطيعة التامة مع التراكمات السلبية السابقة واعتماد منهجية تشاركية واسعة لإنجاح إصلاح القضاء الجوهري."
    ],
    2012: [
      "تأسيس وتوطيد الهيئة العليا للحوار الوطني حول إصلاح منظومة العدالة كمنصة تشاركية جامعة لكافة المتدخلين.",
      "صياغة خارطة طريق شاملة وعملية لترسيخ استقلال السلطة القضائية تماشياً مع مقتضيات دستور 2011 الجديد.",
      "ضمان الأمن القضائي للمتقاضين والشركاء الاقتصاديين وتعزيز قيم الاستقامة والحياد في المرفق القضائي."
    ],
    2018: [
      "تثمين الخطوات التاريخية التي قطعها المغرب في استقلال السلطة القضائية وتأسيس رئاسة النيابة العامة.",
      "التأكيد على أن استقلال القضاء ليس امتيازاً للقضاة بل هو حق دستوري أصيل للمواطن ومسؤولية جسيمة.",
      "دعوة جميع الفاعلين لربط استقلال القضاء بالنجاعة والنزاهة وصون حقوق الدفاع وتكريس شروط المحاكمة العادلة."
    ],
    2019: [
      "التأكيد على الارتباط الوثيق والجدلي بين القضاء والاستثمار لبناء بيئة اقتصادية جاذبة ومستقرة ومحفزة.",
      "الدعوة لتفعيل الوسائل البديلة لحل النزاعات كالصلح والوساطة والتحكيم لتسريع حسم منازعات التجارة والأعمال.",
      "استثمار التكنولوجيا الحديثة لتعميم 'لامادية الإجراءات والمسائل القضائية' لربح الوقت وتكريس الشفافية والنزاهة."
    ]
  };

  if (fallbacks[year]) {
    return fallbacks[year];
  }

  return [
    `مضمون ومحور الفقرة يركز على موضوع: ${section.title || "الخطاب الملكي السامي"} وتفاصيله الحيوية.`,
    "ترسيخ مبدأ سيادة القانون وضمان الإنصاف وتطوير الأداء المؤسسي والإداري لخدمة المواطن والصالح العام.",
    "الربط الوثيق بين المرجعية الدستورية الثابتة للمملكة والتنمية الشاملة بأبعادها الاقتصادية والاجتماعية."
  ];
}

export default function LegalTranslation() {
  const [activeTab, setActiveTab] = useState<'lessons' | 'games' | 'quiz' | 'evaluation'>('lessons');
  const [selectedSpeechYear, setSelectedSpeechYear] = useState<SpeechYearKey>("2025_sahara");
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  
  const activeSpeechSections = useMemo(() => {
    if (selectedSpeechYear === 1999) return SPEECH_SECTIONS_1999;
    if (selectedSpeechYear === 2000) return SPEECH_SECTIONS_2000;
    if (selectedSpeechYear === 2001) return SPEECH_SECTIONS_2001;
    if (selectedSpeechYear === 2002) return SPEECH_SECTIONS_2002;
    if (selectedSpeechYear === 2003) return SPEECH_SECTIONS_2003;
    if (selectedSpeechYear === 2004) return SPEECH_SECTIONS_2004;
    if (selectedSpeechYear === 2005) return SPEECH_SECTIONS_2005;
    if (selectedSpeechYear === 2007) return SPEECH_SECTIONS_2007;
    if (selectedSpeechYear === 2009) return SPEECH_SECTIONS_2009;
    if (selectedSpeechYear === 2012) return SPEECH_SECTIONS_2012;
    if (selectedSpeechYear === 2018) return SPEECH_SECTIONS_2018;
    if (selectedSpeechYear === 2019) return SPEECH_SECTIONS_2019;
    if (selectedSpeechYear === 2024) return SPEECH_SECTIONS_2024;
    if (selectedSpeechYear === 2025) return SPEECH_SECTIONS_2025;
    if (selectedSpeechYear === "2025_sahara") return SPEECH_SECTIONS_2025_SAHARA;
    return SPEECH_SECTIONS_2025_SAHARA;
  }, [selectedSpeechYear]);

  const [selectedSection, setSelectedSection] = useState<SpeechSection>(SPEECH_SECTIONS_2025_SAHARA[0]);


  // Sync selectedSection when active speech speech year changes
  useEffect(() => {
    setSelectedSection(activeSpeechSections[0]);
  }, [activeSpeechSections]);


  
  // Game states
  const [gameMode, setGameMode] = useState<'flashcard' | 'match'>('flashcard');
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [matchSelections, setMatchSelections] = useState<{ fr: string | null; ar: string | null }>({ fr: null, ar: null });
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [matchScore, setMatchScore] = useState(0);
  const [matchAttempts, setMatchAttempts] = useState(0);
  const [matchFeedback, setMatchFeedback] = useState<'success' | 'error' | null>(null);

  // Quiz & Evaluation states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  // Load streak & progression from localStorage
  useEffect(() => {
    const savedStreak = localStorage.getItem('legal_translation_streak');
    if (savedStreak) setStreakCount(parseInt(savedStreak));
    
    const savedProgress = localStorage.getItem('legal_translation_quiz_submitted');
    if (savedProgress === 'true') {
      const savedAnswers = localStorage.getItem('legal_translation_answers');
      if (savedAnswers) {
        setUserAnswers(JSON.parse(savedAnswers));
        setQuizSubmitted(true);
      }
    }
  }, []);

  const handleFlip = (idx: number) => {
    setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // --- MATCHING GAME LOGIC ---
  const randomizedFr = useMemo(() => {
    return [...MATCH_PAIRS].sort(() => Math.random() - 0.5);
  }, [matchedPairs.length === 0]);

  const randomizedAr = useMemo(() => {
    return [...MATCH_PAIRS].sort(() => Math.random() - 0.5);
  }, [matchedPairs.length === 0]);

  const handleMatchSelect = (type: 'fr' | 'ar', val: string) => {
    if (matchedPairs.includes(val)) return;

    setMatchSelections(prev => {
      const next = { ...prev, [type]: val };
      
      // If both selected, verify match
      if (next.fr && next.ar) {
        const correctAr = MATCH_PAIRS.find(p => p.fr === next.fr)?.ar;
        setMatchAttempts(a => a + 1);
        
        if (correctAr === next.ar) {
          // Success
          setMatchedPairs(p => [...p, next.fr!, next.ar!]);
          setMatchScore(s => s + 10);
          setMatchFeedback('success');
          setTimeout(() => {
            setMatchSelections({ fr: null, ar: null });
            setMatchFeedback(null);
          }, 800);
        } else {
          // Failure
          setMatchFeedback('error');
          setTimeout(() => {
            setMatchSelections({ fr: null, ar: null });
            setMatchFeedback(null);
          }, 800);
        }
      }
      return next;
    });
  };

  const resetMatchGame = () => {
    setMatchedPairs([]);
    setMatchScore(0);
    setMatchAttempts(0);
    setMatchSelections({ fr: null, ar: null });
    setMatchFeedback(null);
  };

  // --- QUIZ LOGIC ---
  const handleAnswerSelect = (option: string) => {
    if (quizSubmitted) return;
    setSelectedAnswer(option);
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex + 1] || null);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1]);
    }
  };

  const quizScore = useMemo(() => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) score++;
    });
    return score;
  }, [userAnswers]);

  const evaluationLevel = useMemo(() => {
    const percentage = (quizScore / QUIZ_QUESTIONS.length) * 100;
    if (percentage <= 40) return {
      title: "مبتدئ في الترجمة القانونية",
      desc: "تحتاج إلى تعزيز حصيلتك المصطلحية القضائية. المصطلحات الرسمية مثل 'الشطط' أو 'سلك القضاء' ما زالت تشكل تحدياً بالنسبة لك. ننصحك بإعادة قراءة الدروس القانونية والتركيز على مفاتيح ترجمة الدستور والمحاكم الإدارية.",
      badge: "برونزية المصطلحات 🥉",
      color: "text-amber-700 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30",
      progress: percentage
    };
    if (percentage <= 75) return {
      title: "مترجم قانوني متوسط",
      desc: "لديك فهم جيد للمبادئ الأساسية وتجيد ترجمة المخططات والمحاكم العامة. لكن المصطلحات الدقيقة والتعبيرات البلاغية الرفيعة مثل 'القناعة الصميمة' أو 'أحكام النوازل' تتطلب منك دقة أكبر. استمر في الممارسة للحصول على المستوى المتقدم.",
      badge: "فضية المترجم المتمهن 🥈",
      color: "text-slate-700 bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800/30",
      progress: percentage
    };
    return {
      title: "مترجم قانوني محترف واعد",
      desc: "ما شاء الله! متمكن جداً من الأسلوب البلاغي والقانوني الرفيع. تجيد التمييز الدقيق بين الكلمات القانونية واللغة الدارجة وتفهم المرجعيات القضائية المغربية بنجاح كبير. أنت جاهز للتعامل مع وثائق رسمية متقدمة.",
      badge: "الذهبية للمترجم القدير 🥇",
      color: "text-teal-700 bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/30",
      progress: percentage
    };
  }, [quizScore]);

  const submitQuiz = () => {
    setQuizSubmitted(true);
    localStorage.setItem('legal_translation_quiz_submitted', 'true');
    localStorage.setItem('legal_translation_answers', JSON.stringify(userAnswers));
    const newStreak = streakCount + 1;
    setStreakCount(newStreak);
    localStorage.setItem('legal_translation_streak', newStreak.toString());
    setActiveTab('evaluation');
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setSelectedAnswer(null);
    setCurrentQuestionIndex(0);
    setQuizSubmitted(false);
    localStorage.removeItem('legal_translation_quiz_submitted');
    localStorage.removeItem('legal_translation_answers');
    setActiveTab('quiz');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-10" dir="rtl">
      
      {/* Main Tabs Navigation */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('lessons')}
          className={cn(
            "flex-1 py-3 text-xs md:text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
            activeTab === 'lessons'
              ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 shadow-md scale-[1.02]"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
          )}
        >
          <Book className="w-4 h-4" />
          الدروس
        </button>
        <button
          onClick={() => setActiveTab('games')}
          className={cn(
            "flex-1 py-3 text-xs md:text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
            activeTab === 'games'
              ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 shadow-md scale-[1.02]"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
          )}
        >
          <Brain className="w-4 h-4" />
          الألعاب
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={cn(
            "flex-1 py-3 text-xs md:text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
            activeTab === 'quiz'
              ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 shadow-md scale-[1.02]"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
          )}
        >
          <ClipboardList className="w-4 h-4" />
          الاختبار
        </button>
        <button
          onClick={() => setActiveTab('evaluation')}
          className={cn(
            "flex-1 py-3 text-xs md:text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
            activeTab === 'evaluation'
              ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 shadow-md scale-[1.02]"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
          )}
        >
          <Award className="w-4 h-4" />
          التقييم
        </button>
      </div>

      {/* --- CONTENT TABS --- */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: INTERACTIVE LESSONS */}
        {activeTab === 'lessons' && (
          <motion.div
            key="lessons-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 md:space-y-8"
          >
            {/* Extremely compact active speech selection and info */}
            <div className="relative p-4 md:p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] md:text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    النص موضوع الدراسة والترجمة
                  </span>
                </div>
                <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5 leading-relaxed">
                  {SPEECH_TITLES[selectedSpeechYear]?.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {SPEECH_TITLES[selectedSpeechYear]?.subtitle}
                </p>
              </div>

              {/* Compact Year Selector Trigger */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                  className="w-full sm:w-auto flex items-center justify-between gap-2.5 px-4 py-2.5 text-xs font-black rounded-xl bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm transition-all active:scale-95"
                >
                  <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-extrabold truncate max-w-[200px] sm:max-w-[240px]">
                    {SPEECH_TITLES[selectedSpeechYear]?.title}
                  </span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0", yearDropdownOpen && "rotate-180")} />
                </button>

                {/* Dropdown Popover */}
                {yearDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setYearDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-[300px] sm:w-[360px] max-h-[340px] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 py-2 custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 mb-1.5">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 block uppercase tracking-wider text-right">
                          اختر الخطاب أو الرسالة الملكية السامية:
                        </span>
                      </div>
                      {([1999, 2000, 2001, 2002, 2003, 2004, 2005, 2007, 2009, 2012, 2018, 2019, 2024, 2025, "2025_sahara"] as SpeechYearKey[]).map((yearKey) => (
                        <button
                          key={yearKey}
                          onClick={() => {
                            setSelectedSpeechYear(yearKey);
                            setYearDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-right px-4 py-2.5 text-xs flex flex-col gap-1 transition-colors border-b border-slate-100 dark:border-slate-800/40 last:border-0",
                            selectedSpeechYear === yearKey
                              ? "bg-teal-50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-400 font-bold"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-extrabold text-slate-900 dark:text-white leading-snug">
                              {SPEECH_TITLES[yearKey]?.title}
                            </span>
                            {selectedSpeechYear === yearKey && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-black shrink-0">
                                الحالي
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed block">
                            {SPEECH_TITLES[yearKey]?.subtitle}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* أقسام الخطاب موضوع الدراسة والترجمة: Organized Grid Layout */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      أقسام الخطاب موضوع الدراسة والترجمة:
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      اختر فقرة لدراستها ومقارنة الترجمة الرسمية بين العربية والفرنسية
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
                    إجمالي الفقرات: {activeSpeechSections.length}
                  </span>
                </div>
              </div>

              {/* Organized Grid of Speech Sections (All visible in one page layout) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                {activeSpeechSections.map((sec) => {
                  const isSelected = selectedSection?.id === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => setSelectedSection(sec)}
                      className={cn(
                        "relative p-3 rounded-xl border text-right transition-all duration-200 cursor-pointer flex items-start gap-2.5 group",
                        isSelected
                          ? "bg-teal-600 dark:bg-teal-600 text-white border-teal-600 dark:border-teal-500 shadow-md scale-[1.01] ring-2 ring-teal-500/20"
                          : "bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 border-slate-200/90 dark:border-slate-700/80 hover:bg-teal-50/60 dark:hover:bg-slate-800 hover:border-teal-200 dark:hover:border-teal-800 shadow-2xs"
                      )}
                    >
                      {/* Section Badge */}
                      <span
                        className={cn(
                          "w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 transition-colors mt-0.5",
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300 group-hover:bg-teal-100 dark:group-hover:bg-teal-950/60"
                        )}
                      >
                        {sec.id}
                      </span>

                      {/* Section Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span
                            className={cn(
                              "text-[10px] font-extrabold uppercase tracking-wider",
                              isSelected ? "text-teal-100" : "text-slate-400 dark:text-slate-500"
                            )}
                          >
                            الفقرة {sec.id}
                          </span>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                          )}
                        </div>
                        <h5
                          className={cn(
                            "text-xs font-bold leading-snug line-clamp-2",
                            isSelected ? "text-white" : "text-slate-900 dark:text-slate-100"
                          )}
                        >
                          {sec.title}
                        </h5>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Paragraph Study Reader takes full width */}
            <div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              
              {/* Section header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="text-xs text-teal-600 font-bold uppercase">الفقرة {selectedSection?.id || 1} من الخطاب</span>
                  <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-snug">
                    {selectedSection?.title || "تحميل الفقرة..."}
                  </h2>
                </div>
                <div className="p-2 bg-teal-50 dark:bg-teal-500/10 rounded-xl text-teal-600 dark:text-teal-400 shrink-0">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
              </div>

              {/* Side-by-side or stacked translations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                
                {/* Arabic side */}
                <div className="p-5 bg-teal-50/30 dark:bg-teal-950/5 rounded-2xl border border-teal-500/5 relative space-y-3">
                  <div className="text-xs font-black text-teal-800 dark:text-teal-300 flex items-center gap-1.5 pb-2 border-b border-teal-500/10">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                    النص العربي الرسمي للفقرة
                  </div>
                  <p className="text-sm md:text-base text-slate-800 dark:text-slate-200 leading-loose text-justify font-serif whitespace-pre-line">
                    {selectedSection?.ar}
                  </p>
                </div>

                {/* French side */}
                <div className="p-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 relative space-y-3" dir="ltr">
                  <div className="text-xs font-black text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5 pb-2 border-b border-indigo-500/10 text-left">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    Texte Français Officiel
                  </div>
                  <p className="text-sm md:text-base text-slate-800 dark:text-slate-200 leading-loose text-justify font-sans whitespace-pre-line">
                    {selectedSection?.fr}
                  </p>
                </div>

              </div>

              {/* Combined Study Section: Key Terms & Main Ideas */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-8">
                
                {/* 1. Extract 10 Legal Terms Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <Languages className="w-5 h-5 text-teal-600 shrink-0" />
                    <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white">
                      المصطلحات القانونية الأساسية المستخرجة من الفقرة (10 مصطلحات)
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {extractSectionTerms(selectedSection).map((item, idx) => (
                      <div 
                        key={idx} 
                        className="p-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-teal-50/20 dark:hover:bg-teal-950/10 rounded-xl border border-slate-200/60 dark:border-slate-800 transition-all flex flex-col gap-2 relative overflow-hidden group shadow-sm"
                      >
                        <div className="absolute top-0 right-0 w-1 h-full bg-teal-600/30 group-hover:bg-teal-600 transition-colors" />
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-black text-slate-900 dark:text-white font-serif">
                            {item.ar}
                          </span>
                          <span className="text-xs font-bold text-teal-700 dark:text-teal-400 font-sans" dir="ltr">
                            {item.fr}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          {item.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Text Content & Main Ideas (مضمون النص وأفكاره الأساسية) display */}
                <div className="p-5 bg-teal-50/20 dark:bg-teal-950/10 rounded-2xl border border-teal-500/10 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-teal-500/20">
                    <FileText className="w-5 h-5 text-teal-700 shrink-0" />
                    <h3 className="text-sm md:text-base font-black text-teal-900 dark:text-teal-300">
                      مضمون النص والأفكار الأساسية
                    </h3>
                  </div>
                  
                  <ul className="space-y-3">
                    {getSectionMainIdeas(selectedSection, selectedSpeechYear).map((idea, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-teal-600/15 text-teal-700 dark:text-teal-400 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {idea}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: INTERACTIVE VOCABULARY GAMES */}
        {activeTab === 'games' && (
          <motion.div
            key="games-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Game Selector Menu */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setGameMode('flashcard')}
                className={cn(
                  "px-5 py-2.5 text-xs md:text-sm font-black rounded-full transition-all flex items-center gap-2 border",
                  gameMode === 'flashcard'
                    ? "bg-teal-700 text-white border-teal-700 shadow-md"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                )}
              >
                <RotateCcw className="w-4 h-4" />
                البطاقات التفاعلية (Flashcards)
              </button>
              <button
                onClick={() => {
                  setGameMode('match');
                  resetMatchGame();
                }}
                className={cn(
                  "px-5 py-2.5 text-xs md:text-sm font-black rounded-full transition-all flex items-center gap-2 border",
                  gameMode === 'match'
                    ? "bg-teal-700 text-white border-teal-700 shadow-md"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                )}
              >
                <Brain className="w-4 h-4" />
                لعبة مطابقة المصطلحات (Match)
              </button>
            </div>

            {/* GAME 1: FLASHCARDS */}
            {gameMode === 'flashcard' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">بطاقات الاستذكار الفعالة</h3>
                  <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                    انقر فوق البطاقات لقلبها واكتشاف المعنى القانوني والمقابل باللغة العربية. طريقة ممتازة للطلبة لحفظ المصطلحات الصعبة.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {MATCH_PAIRS.map((pair, idx) => {
                    const isFlipped = flippedCards[idx] || false;
                    return (
                      <div 
                        key={idx}
                        onClick={() => handleFlip(idx)}
                        className="h-44 w-full perspective-1000 cursor-pointer"
                      >
                        <div className={cn(
                          "relative w-full h-full transition-transform duration-500 transform-style-3d shadow-md hover:shadow-xl rounded-2xl border",
                          isFlipped ? "rotate-y-180 bg-teal-50 dark:bg-slate-900 border-teal-200 dark:border-teal-800/80" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        )}>
                          
                          {/* Front (French) */}
                          <div className={cn(
                            "absolute inset-0 w-full h-full p-6 flex flex-col justify-between backface-hidden",
                            isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"
                          )}>
                            <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase">
                              <span>مصطلح فرنسي</span>
                              <Languages className="w-4 h-4 text-teal-600" />
                            </div>
                            <div className="text-center font-mono text-lg font-black text-teal-900 dark:text-teal-300 py-3" dir="ltr">
                              {pair.fr}
                            </div>
                            <div className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                              اضغط للقلب ومطالعة العربية
                            </div>
                          </div>

                          {/* Back (Arabic) */}
                          <div className={cn(
                            "absolute inset-0 w-full h-full p-6 flex flex-col justify-between backface-hidden rotate-y-180",
                            isFlipped ? "opacity-100" : "opacity-0 pointer-events-none"
                          )}>
                            <div className="flex justify-between items-center text-xs text-teal-600 font-bold uppercase">
                              <span>المقابل القانوني بالعربية</span>
                              <Check className="w-4 h-4" />
                            </div>
                            <div className="text-center text-md font-black text-slate-800 dark:text-slate-200 py-3">
                              {pair.ar}
                            </div>
                            <div className="text-center text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase">
                              أحسنت! احفظ المصطلح جلياً
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* GAME 2: TERM MATCHER */}
            {gameMode === 'match' && (
              <div className="max-w-4xl mx-auto space-y-6 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                
                {/* Score & attempts board */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">لعبة التوصيل وتطابق الكلمات</h3>
                    <p className="text-xs text-slate-400">طابق الكلمة الفرنسية بمرادفها القانوني في الطرف المقابل.</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-black">
                    <span className="px-3 py-1.5 bg-teal-50 dark:bg-teal-500/15 rounded-lg text-teal-700 dark:text-teal-400">النقاط: {matchScore}</span>
                    <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">المحاولات: {matchAttempts}</span>
                    <button 
                      onClick={resetMatchGame}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-teal-600 transition-colors"
                      title="إعادة اللعب"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Match Complete overlay */}
                {matchedPairs.length === MATCH_PAIRS.length * 2 ? (
                  <div className="py-12 text-center space-y-4">
                    <Trophy className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
                    <h4 className="text-xl font-black text-slate-900 dark:text-white">عمل رائع ومتميز! 🎉</h4>
                    <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                      لقد نجحت في مطابقة جميع المصطلحات بنجاح في {matchAttempts} محاولات وبمجموع نقاط {matchScore}. مستواك في تطور مستمر!
                    </p>
                    <button 
                      onClick={resetMatchGame}
                      className="px-6 py-2.5 bg-teal-700 text-white rounded-xl font-bold text-sm hover:bg-teal-800 transition-colors"
                    >
                      العب مجدداً
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-4">
                    
                    {/* Left Column (French Selection) */}
                    <div className="space-y-3" dir="ltr">
                      <div className="text-xs font-black text-slate-400 mb-2 border-b pb-1 text-left uppercase">French Terminology</div>
                      {randomizedFr.map((p) => {
                        const isMatched = matchedPairs.includes(p.fr);
                        const isSelected = matchSelections.fr === p.fr;
                        return (
                          <button
                            key={p.fr}
                            disabled={isMatched}
                            onClick={() => handleMatchSelect('fr', p.fr)}
                            className={cn(
                              "w-full text-left px-4 py-3 rounded-xl border font-mono text-xs transition-all flex justify-between items-center",
                              isMatched 
                                ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 opacity-60"
                                : isSelected
                                  ? matchFeedback === 'success'
                                    ? "bg-emerald-500 text-white border-emerald-500"
                                    : matchFeedback === 'error'
                                      ? "bg-rose-500 text-white border-rose-500 scale-[0.98] animate-shake"
                                      : "bg-teal-700 text-white border-teal-700 scale-[1.02] shadow-sm"
                                  : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-500/40"
                            )}
                          >
                            <span className="truncate">{p.fr}</span>
                            {isMatched && <Check className="w-3.5 h-3.5" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Column (Arabic Selection) */}
                    <div className="space-y-3">
                      <div className="text-xs font-black text-slate-400 mb-2 border-b pb-1 uppercase">المصطلحات بالعربية</div>
                      {randomizedAr.map((p) => {
                        const isMatched = matchedPairs.includes(p.ar);
                        const isSelected = matchSelections.ar === p.ar;
                        return (
                          <button
                            key={p.ar}
                            disabled={isMatched}
                            onClick={() => handleMatchSelect('ar', p.ar)}
                            className={cn(
                              "w-full text-right px-4 py-3 rounded-xl border text-xs transition-all flex justify-between items-center",
                              isMatched 
                                ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 opacity-60"
                                : isSelected
                                  ? matchFeedback === 'success'
                                    ? "bg-emerald-500 text-white border-emerald-500"
                                    : matchFeedback === 'error'
                                      ? "bg-rose-500 text-white border-rose-500 scale-[0.98] animate-shake"
                                      : "bg-teal-700 text-white border-teal-700 scale-[1.02] shadow-sm"
                                  : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-500/40"
                            )}
                          >
                            {isMatched && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                            <span className="truncate">{p.ar}</span>
                          </button>
                        );
                      })}
                    </div>

                  </div>
                )}

              </div>
            )}

          </motion.div>
        )}

        {/* TAB 3: QUIZ / TEST SECTION */}
        {activeTab === 'quiz' && (
          <motion.div
            key="quiz-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-3xl mx-auto"
          >
            {quizSubmitted ? (
              <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto animate-bounce" />
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">لقد أتممت الاختبار بنجاح!</h3>
                <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                  تم حفظ إجاباتك وإعداد تقرير تقييم تفصيلي يحدد مستواك الفعلي ومكامن الضعف والقوة بناءً على أسلوب الترجمة القانونية المقارنة.
                </p>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setActiveTab('evaluation')}
                    className="px-6 py-3 bg-teal-700 text-white font-black rounded-xl text-sm hover:bg-teal-800 transition-colors shadow-lg shadow-teal-700/20 flex items-center gap-2"
                  >
                    مراجعة تقييم المستوى والشهادة
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={resetQuiz}
                    className="px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm hover:bg-slate-200 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    إعادة الاختبار من جديد
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                    <span>السؤال {currentQuestionIndex + 1} من {QUIZ_QUESTIONS.length}</span>
                    <span>معدل الإنجاز: {Math.round(((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-600 transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Active Question Panel */}
                <div className="space-y-4">
                  <div className="p-4 bg-teal-50/20 dark:bg-teal-950/5 rounded-2xl border border-teal-500/10">
                    <h4 className="text-base md:text-lg font-black text-slate-900 dark:text-white leading-relaxed">
                      {QUIZ_QUESTIONS[currentQuestionIndex].question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {QUIZ_QUESTIONS[currentQuestionIndex].options.map((opt, oIdx) => {
                      const isSelected = selectedAnswer === opt;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleAnswerSelect(opt)}
                          className={cn(
                            "w-full text-right p-4 rounded-xl border transition-all flex items-center gap-3",
                            isSelected
                              ? "bg-teal-700 text-white border-teal-700 font-bold shadow-md"
                              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:border-slate-300"
                          )}
                        >
                          <span className={cn(
                            "w-6 h-6 rounded-full border text-xs font-black flex items-center justify-center shrink-0",
                            isSelected ? "bg-white text-teal-800 border-white" : "border-slate-300"
                          )}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="font-sans text-sm">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quiz Navigation controls */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={handlePrevQuestion}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-black rounded-xl disabled:opacity-40 flex items-center gap-2 transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                    السابق
                  </button>

                  {currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? (
                    <button
                      onClick={submitQuiz}
                      disabled={Object.keys(userAnswers).length < QUIZ_QUESTIONS.length}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-black rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-2"
                    >
                      <CheckSquare className="w-4 h-4" />
                      إرسال وتدقيق الأجوبة
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-black rounded-xl flex items-center gap-2 transition-all"
                    >
                      التالي
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {Object.keys(userAnswers).length < QUIZ_QUESTIONS.length && (
                  <div className="text-center text-[10px] text-amber-600 font-bold flex items-center justify-center gap-1.5 pt-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    يرجى الإجابة على جميع الأسئلة لتتمكن من إرسال وتدقيق التقييم بنجاح.
                  </div>
                )}

              </div>
            )}
          </motion.div>
        )}

        {/* TAB 4: EVALUATION & ANALYSIS REPORT */}
        {activeTab === 'evaluation' && (
          <motion.div
            key="evaluation-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {!quizSubmitted ? (
              <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
                <AlertCircle className="w-16 h-16 text-teal-600 mx-auto" />
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">بوابة التقييم مغلقة</h3>
                <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                  لم تنجز الاختبار التفاعلي بعد. يرجى المذاكرة ثم الخضوع للاختبار القانوني حتى تقوم خوارزميتنا بتحليل إجاباتك وإصدار تقرير التقييم ومستواك الدقيق.
                </p>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="px-6 py-2.5 bg-teal-700 text-white rounded-xl font-bold text-sm hover:bg-teal-800 transition-colors"
                >
                  ابدأ الاختبار التفاعلي الآن
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* Assessment Summary card */}
                <div className={cn(
                  "p-6 md:p-8 rounded-3xl border shadow-xl flex flex-col md:flex-row items-center gap-6 justify-between",
                  evaluationLevel.color
                )}>
                  <div className="space-y-4 text-right flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 dark:bg-slate-900/40 text-xs font-black border border-current/10">
                      {evaluationLevel.badge}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black">
                      مستواك: {evaluationLevel.title}
                    </h3>
                    <p className="text-xs md:text-sm font-medium leading-relaxed opacity-90">
                      {evaluationLevel.desc}
                    </p>

                    {/* Score Bar */}
                    <div className="space-y-1 pt-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span>النتيجة الإجمالية</span>
                        <span>{quizScore} من {QUIZ_QUESTIONS.length} صحيحة ({evaluationLevel.progress}%)</span>
                      </div>
                      <div className="w-full h-3 bg-white/50 dark:bg-slate-900/40 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-700 rounded-full transition-all"
                          style={{ width: `${evaluationLevel.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-center p-6 bg-white dark:bg-slate-950 rounded-2xl border border-teal-500/10 shadow-md">
                    <div className="text-[50px] md:text-[60px] font-black text-teal-600 dark:text-teal-400 leading-none">
                      {quizScore * 10}
                    </div>
                    <div className="text-xs font-black text-slate-400 mt-2">مجموع نقاط الترجمة</div>
                  </div>
                </div>

                {/* Performance Badge / Certificate Certificate */}
                <div className="p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 text-white rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden text-center space-y-4">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
                  
                  <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
                    <Award className="w-8 h-8 text-yellow-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-md md:text-lg font-serif font-black text-teal-300">معهد القانون المغربي الرقمي</h4>
                    <h3 className="text-xl md:text-2xl font-black">شهادة مشاركة وإنجاز</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      نقر بأن الباحث(ة) قد أتم بنجاح دراسة واختبار "الترجمة القانونية المقارنة للخطاب الملكي السامي لافتتاح المجلس الأعلى للقضاء لعام 1999" محرزاً مستوى:
                    </p>
                    <div className="text-lg md:text-xl font-bold text-yellow-400 py-2">
                      【 {evaluationLevel.title} 】
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-center items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    <span>الرقم المرجعي: ASKL-TR-{quizScore}-2026</span>
                    <span className="hidden sm:inline">•</span>
                    <span>التوثيق: منصة اسأل القانون Ask Law</span>
                  </div>
                </div>

                {/* Detailed Correction & Explanations */}
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-teal-600" />
                    مراجعة وتدقيق إجاباتك بالتفصيل اللغوي:
                  </h3>

                  <div className="space-y-4">
                    {QUIZ_QUESTIONS.map((q, idx) => {
                      const isCorrect = userAnswers[idx] === q.correctAnswer;
                      return (
                        <div 
                          key={q.id}
                          className={cn(
                            "p-5 rounded-2xl border transition-all text-right space-y-3",
                            isCorrect 
                              ? "bg-emerald-50/20 dark:bg-emerald-950/5 border-emerald-100 dark:border-emerald-900/30" 
                              : "bg-rose-50/20 dark:bg-rose-950/5 border-rose-100 dark:border-rose-900/30"
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-xs text-slate-400 font-bold">السؤال {q.id}</span>
                              <h4 className="text-sm md:text-base font-black text-slate-800 dark:text-slate-200">{q.question}</h4>
                            </div>
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shrink-0",
                              isCorrect 
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400" 
                                : "bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400"
                            )}>
                              {isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                              {isCorrect ? "إجابة صحيحة" : "تحتاج لمراجعة"}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold py-2 border-y border-dashed border-slate-200/40 dark:border-slate-800/40">
                            <div className="space-y-1">
                              <span className="text-slate-400">إجابتك:</span>
                              <div className={isCorrect ? "text-emerald-600" : "text-rose-600"}>{userAnswers[idx] || "لم تجب"}</div>
                            </div>
                            {!isCorrect && (
                              <div className="space-y-1">
                                <span className="text-slate-400">الإجابة الصحيحة الدقيقة:</span>
                                <div className="text-emerald-600">{q.correctAnswer}</div>
                              </div>
                            )}
                          </div>

                          {/* Analysis / explanation of correct answer */}
                          <div className="p-3 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/60 flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                              <strong className="text-slate-700 dark:text-slate-300">التعليل القانوني الفقهي: </strong> 
                              {q.explanation}
                            </p>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reset Panel */}
                <div className="text-center pt-4">
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-2 border"
                  >
                    <RotateCcw className="w-4 h-4" />
                    إعادة المذاكرة والبدء من جديد
                  </button>
                </div>

              </div>
            )}

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
