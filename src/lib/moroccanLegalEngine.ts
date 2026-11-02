import { constitutionData } from '../data/laws/constitution';
import { obligationsAndContractsData } from '../data/laws/obligationsAndContracts';
import { familyCode } from '../constants/laws';
import { LABOUR_CODE_DATA, LABOUR_CODE_META, type ArticleMeta, type ArticleHierarchy } from '../data/laws/labourCodeLoader';
import { civilProcedureData } from '../data/laws/civilProcedure';
import { judicialInspectorateData } from '../data/laws/judicialInspectorate';
import { criminalLawData } from '../data/laws/criminalLaw';
import { criminalProcedureData } from '../data/laws/criminalProcedure';

export type { ArticleMeta, ArticleHierarchy };

export interface MoroccanLaw {
  id: string;
  name: string;
  officialName: string;
  shortName: string;
  aliases: string[];
  categoryId: string;
  categoryName: string;
  articlePrefix: 'المادة' | 'الفصل';
  status: string;
  lastUpdate: string;
  reference: string;
  officialGazette: string;
  source: string;
  sourceUrl: string;
  data: Record<string, string>;
  articlesMeta?: Record<string, ArticleMeta>;
}

export const MOROCCAN_LAWS_DATABASE: MoroccanLaw[] = [
  {
    id: 'constitution',
    name: 'دستور المملكة المغربية (2011)',
    officialName: 'دستور المملكة المغربية الصادر بتنفيذه الظهير الشريف رقم 1.11.91',
    shortName: 'الدستور',
    aliases: ['دستور', 'الدستور', 'دستور 2011', 'الدستور المغربي', 'دستور المملكة'],
    categoryId: 'constitutional',
    categoryName: 'المادة الدستورية',
    articlePrefix: 'الفصل',
    status: 'نافذ وسارٍ',
    lastUpdate: '29 يوليو 2011',
    reference: 'ظهير شريف رقم 1.11.91 صادر في 27 من شعبان 1432 (29 يوليو 2011) بتنفيذ نص الدستور',
    officialGazette: 'الجريدة الرسمية عدد 5964 مكرر بتاريخ 30 يوليو 2011، ص 3600',
    source: 'الأمانة العامة للحكومة - المملكة المغربية',
    sourceUrl: 'http://www.sgg.gov.ma',
    data: constitutionData
  },
  {
    id: 'family_code',
    name: 'مدونة الأسرة المغربية',
    officialName: 'القانون رقم 70.03 بمثابة مدونة الأسرة',
    shortName: 'مدونة الأسرة',
    aliases: ['مدونة الأسرة', 'الأسرة', 'اسرة', 'مدونة الاسرة', 'قانون الأسرة', 'الأحوال الشخصية', 'احوال شخصية', 'قانون 70.03', '70.03'],
    categoryId: 'family',
    categoryName: 'قانون الأسرة',
    articlePrefix: 'المادة',
    status: 'سارية المفعول ومحيّنة',
    lastUpdate: '2024',
    reference: 'ظهير شريف رقم 1.04.22 صادر في 12 من ذي الحجة 1424 (3 فبراير 2004) بتنفيذ القانون رقم 70.03',
    officialGazette: 'الجريدة الرسمية عدد 5184 بتاريخ 14 ذو الحجة 1424 (5 فبراير 2004)، ص 418',
    source: 'الأمانة العامة للحكومة - المملكة المغربية',
    sourceUrl: 'http://www.sgg.gov.ma',
    data: familyCode
  },
  {
    id: 'obligations_contracts',
    name: 'ظهير الالتزامات والعقود (ق.ل.ع)',
    officialName: 'ظهير 9 رمضان 1331 (12 أغسطس 1913) بمثابة قانون الالتزامات والعقود',
    shortName: 'الالتزامات والعقود',
    aliases: ['قانون الالتزامات والعقود', 'الالتزامات والعقود', 'التزامات وعقود', 'ق.ل.ع', 'قلع', 'ق ل ع', 'عقود', 'ظهير الالتزامات والعقود', 'العقود', 'الالتزامات', 'ظهير الالتزامات'],
    categoryId: 'civil',
    categoryName: 'المادة المدنية',
    articlePrefix: 'الفصل',
    status: 'سارٍ ومحيّن',
    lastUpdate: '2024 (محيّن بالقانون 53.05 والقانون 31.08)',
    reference: 'ظهير شريف صادر في 9 رمضان 1331 (12 أغسطس 1913)',
    officialGazette: 'الجريدة الرسمية عدد 46 بتاريخ 12 سبتمبر 1913، ص 78',
    source: 'الأمانة العامة للحكومة - المملكة المغربية',
    sourceUrl: 'http://www.sgg.gov.ma',
    data: obligationsAndContractsData
  },
  {
    id: 'labour_code',
    name: 'مدونة الشغل المغربية (القانون رقم 65.99)',
    officialName: 'القانون رقم 65.99 المتعلق بمدونة الشغل (589 مادة كاملة)',
    shortName: 'مدونة الشغل',
    aliases: ['مدونة الشغل', 'الشغل', 'شغل', 'قانون الشغل', 'العمل', 'مدونة العمل', 'قانون العمل', 'قانون 65.99', '65.99', 'مدونة شغل'],
    categoryId: 'social',
    categoryName: 'المادة الاجتماعية والشغل',
    articlePrefix: 'المادة',
    status: 'سارية ومحيّنة (كاملة 589 مادة)',
    lastUpdate: '2024 (الظهير الشريف 1.03.194)',
    reference: 'ظهير شريف رقم 1.03.194 صادر في 14 من رجب 1424 (11 سبتمبر 2003) بتنفيذ القانون رقم 65.99',
    officialGazette: 'الجريدة الرسمية عدد 5167 بتاريخ 13 شوال 1424 (8 ديسمبر 2003)، ص 3969',
    source: 'وزارة الإدماج الاقتصادي والمقاولة الصغرى والتشغيل والكفاءات والأمانة العامة للحكومة',
    sourceUrl: 'http://www.sgg.gov.ma',
    data: LABOUR_CODE_DATA,
    articlesMeta: LABOUR_CODE_META
  },
  {
    id: 'civil_procedure',
    name: 'قانون المسطرة المدنية',
    officialName: 'الظهير الشريف بمثابة قانون رقم 1.74.447 بالمصادقة على نص قانون المسطرة المدنية',
    shortName: 'المسطرة المدنية',
    aliases: ['قانون المسطرة المدنية', 'المسطرة المدنية', 'مسطرة مدنية', 'ق.م.م', 'ق م م'],
    categoryId: 'civil',
    categoryName: 'المادة المدنية',
    articlePrefix: 'الفصل',
    status: 'سارٍ ومحيّن',
    lastUpdate: '2024',
    reference: 'ظهير شريف بمثابة قانون رقم 1.74.447 صادر في 11 رمضان 1394 (28 شتنبر 1974)',
    officialGazette: 'الجريدة الرسمية عدد 3230 مكرر مرتين بتاريخ 13 رمضان 1394 (30 شتنبر 1974)، ص 2741',
    source: 'وزارة العدل والأمانة العامة للحكومة',
    sourceUrl: 'http://www.sgg.gov.ma',
    data: civilProcedureData
  },
  {
    id: 'criminal_law',
    name: 'مجموعة القانون الجنائي المغربي',
    officialName: 'مجموعة القانون الجنائي المصادق عليها بالظهير الشريف رقم 1.59.413',
    shortName: 'القانون الجنائي',
    aliases: ['مجموعة القانون الجنائي', 'القانون الجنائي', 'قانون جنائي', 'جنائي', 'ق.ج', 'ق ج', 'قانون العقوبات'],
    categoryId: 'criminal',
    categoryName: 'المادة الجنائية',
    articlePrefix: 'الفصل',
    status: 'سارٍ ومحيّن',
    lastUpdate: '2024 (محيّن بالقانون 43.22 المتعلق بالعقوبات البديلة)',
    reference: 'ظهير شريف رقم 1.59.413 صادر في 28 جمادى الثانية 1382 (26 نونبر 1962)',
    officialGazette: 'الجريدة الرسمية عدد 2640 مكرر بتاريخ 12 محرم 1383 (5 يونيو 1963)، ص 1253',
    source: 'الأمانة العامة للحكومة ووزارة العدل',
    sourceUrl: 'http://www.sgg.gov.ma',
    data: criminalLawData
  },
  {
    id: 'criminal_procedure',
    name: 'قانون المسطرة الجنائية',
    officialName: 'القانون رقم 22.01 المتعلق بالمسطرة الجنائية',
    shortName: 'المسطرة الجنائية',
    aliases: ['قانون المسطرة الجنائية', 'المسطرة الجنائية', 'مسطرة جنائية', 'ق.م.ج', 'ق م ج'],
    categoryId: 'criminal',
    categoryName: 'المادة الجنائية',
    articlePrefix: 'المادة',
    status: 'سارٍ ومحيّن',
    lastUpdate: '2024',
    reference: 'ظهير شريف رقم 1.02.255 صادر في 25 رجب 1423 (3 أكتوبر 2002) بتنفيذ القانون رقم 22.01',
    officialGazette: 'الجريدة الرسمية عدد 5078 بتاريخ 27 ذو القعدة 1423 (30 يناير 2003)، ص 315',
    source: 'وزارة العدل والأمانة العامة للحكومة',
    sourceUrl: 'http://www.sgg.gov.ma',
    data: criminalProcedureData
  },
  {
    id: 'judicial_inspectorate',
    name: 'القانون رقم 38.21 المتعلق بالمفتشية العامة للشؤون القضائية',
    officialName: 'القانون رقم 38.21 المتعلق بالمفتشية العامة للشؤون القضائية',
    shortName: 'المفتشية القضائية',
    aliases: ['المفتشية العامة للشؤون القضائية', 'المفتشية القضائية', 'مفتشية القضاء', 'قانون 38.21', '38.21'],
    categoryId: 'judicial_authority',
    categoryName: 'التنظيم القضائي والمهن',
    articlePrefix: 'المادة',
    status: 'نافذ وسارٍ',
    lastUpdate: '2021',
    reference: 'ظهير شريف رقم 1.21.74 صادر في 3 ذي الحجة 1442 (14 يوليوز 2021) بتنفيذ القانون رقم 38.21',
    officialGazette: 'الجريدة الرسمية عدد 7006 بتاريخ 11 ذو الحجة 1442 (22 يوليوز 2021)، ص 5707',
    source: 'المجلس الأعلى للسلطة القضائية',
    sourceUrl: 'http://www.cspj.ma',
    data: judicialInspectorateData
  }
];

// --- ARABIC NORMALIZATION HELPERS ---
export const normalizeArabic = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/[\u064B-\u065F]/g, "") // Diacritics
    .replace(/[أإآء]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\u0621-\u064A0-9a-zA-Z\s\-.]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
};

export const extractArticleNumber = (query: string): string => {
  if (!query) return "";
  const cleaned = query
    .replace(/^(?:ابحث\s+عن|اريد|ما\s+هي|ما\s+هو|اعطني|نص)\s*/i, "")
    .replace(/^(?:المادة|الفصل|الماده|فصل|مادة|ماده|البند|بند|رقم)\s*/i, "")
    .trim();
  
  // Extract number pattern like "49", "267-1", "12 مكرر", "12 bis"
  const match = cleaned.match(/^(\d+(?:[-_.]\d+)?(?:\s*(?:مكرر|bis|أ|ب))?)/i);
  if (match) return match[1].trim();

  // Try extracting any number in string
  const numOnly = cleaned.match(/\b(\d+(?:[-_.]\d+)?(?:\s*مكرر)?)\b/);
  return numOnly ? numOnly[1].trim() : cleaned;
};

// Result types
export type SearchResultType =
  | {
      kind: 'DIRECT_ARTICLE';
      law: MoroccanLaw;
      articleKey: string;
      articleText: string;
      confidence: 'HIGH' | 'MEDIUM';
    }
  | {
      kind: 'MULTI_LAW_MATCH';
      articleKey: string;
      matches: {
        law: MoroccanLaw;
        articleKey: string;
        articleText: string;
        snippet: string;
      }[];
    }
  | {
      kind: 'AMBIGUOUS_LAW';
      queryText: string;
      articleKey?: string;
      candidateLaws: MoroccanLaw[];
    }
  | {
      kind: 'TOPIC_SEARCH';
      queryText: string;
      results: {
        law: MoroccanLaw;
        articleKey: string;
        articleText: string;
        snippet: string;
        score: number;
        confidence: 'HIGH' | 'MEDIUM' | 'LOW';
      }[];
    }
  | {
      kind: 'NOT_FOUND';
      queryText: string;
      law?: MoroccanLaw;
      message: string;
      confidence: 'LOW';
    };

/**
 * Intelligent Query Parser according to user specifications:
 * Case 1: "المادة 49 من مدونة الأسرة" -> Direct Law + Article (HIGH confidence)
 * Case 2: "المادة 49" or "49" -> Disambiguation across all laws containing article 49
 * Case 3: "49 الأسرة" -> Inferred Law + Article
 * Case 4: Ambiguous law like "قانون المسطرة" -> Multiple candidate laws
 * Case 5: Topic search: "ما المادة المتعلقة بالفصل التعسفي؟" -> Semantic & Keyword search
 */
export function executeMoroccanLegalQuery(
  rawQuery: string,
  lawsDatabase: MoroccanLaw[] = MOROCCAN_LAWS_DATABASE,
  currentLawContext?: MoroccanLaw
): SearchResultType {
  const query = rawQuery.trim();
  if (!query) {
    return {
      kind: 'NOT_FOUND',
      queryText: query,
      message: 'يرجى إدخال استعلام قانوني أو رقم مادة للبحث.',
      confidence: 'LOW'
    };
  }

  const queryNorm = normalizeArabic(query);

  // 1. Check if the query is referring to an ambiguous law like "المسطرة"
  const isAmbiguousProcedure = 
    queryNorm === 'مسطره' || 
    queryNorm === 'المسطره' || 
    queryNorm === 'قانون المسطره' ||
    queryNorm.startsWith('مسطره ') || 
    queryNorm.startsWith('قانون المسطره ');

  // Extract possible article number from query
  const numberMatch = query.match(/\b(\d+(?:[-_.]\d+)?(?:\s*مكرر)?)\b/);
  const detectedNumber = numberMatch ? numberMatch[1].trim() : '';

  if (isAmbiguousProcedure && !queryNorm.includes('مدني') && !queryNorm.includes('جنائي')) {
    const candidateLaws = lawsDatabase.filter(
      l => l.id === 'civil_procedure' || l.id === 'criminal_procedure'
    );
    return {
      kind: 'AMBIGUOUS_LAW',
      queryText: query,
      articleKey: detectedNumber || undefined,
      candidateLaws
    };
  }

  // 2. Identify if a specific law is mentioned in the query
  let matchedLaw: MoroccanLaw | undefined;
  
  // Sort laws by alias length descending so specific names match before generic ones
  for (const law of lawsDatabase) {
    const matchedAlias = law.aliases.find(alias => {
      const aliasNorm = normalizeArabic(alias);
      return queryNorm.includes(aliasNorm);
    });
    if (matchedAlias) {
      matchedLaw = law;
      break;
    }
  }

  // 3. CASE 1 & CASE 3: Law identified + Article number present
  if (matchedLaw && detectedNumber) {
    const artKey = findArticleKey(matchedLaw, detectedNumber);
    if (artKey && matchedLaw.data[artKey]) {
      return {
        kind: 'DIRECT_ARTICLE',
        law: matchedLaw,
        articleKey: artKey,
        articleText: matchedLaw.data[artKey],
        confidence: 'HIGH'
      };
    } else {
      const keys = Object.keys(matchedLaw.data).sort(naturalCompare);
      const minKey = keys[0] || '1';
      const maxKey = keys[keys.length - 1] || 'غير محدد';
      return {
        kind: 'NOT_FOUND',
        queryText: query,
        law: matchedLaw,
        message: `لم أجد نتيجة موثوقة للمادة "${detectedNumber}" ضمن ${matchedLaw.name}. (تتراوح المواد المتاحة في قاعدة البيانات من ${minKey} إلى ${maxKey}).`,
        confidence: 'LOW'
      };
    }
  }

  // 4. CASE 2: Article number ONLY (e.g. "المادة 49", "49", "فصل 230")
  // Check if the query is just an article number or "المادة X" without other keywords
  const isQueryNumberOnly = 
    Boolean(detectedNumber) && 
    (queryNorm === detectedNumber || 
     queryNorm === `الماده ${detectedNumber}` || 
     queryNorm === `الفصل ${detectedNumber}` ||
     queryNorm === `ماده ${detectedNumber}` ||
     queryNorm === `فصل ${detectedNumber}` ||
     queryNorm === `رقم ${detectedNumber}`);

  if (isQueryNumberOnly && detectedNumber) {
    const matches: {
      law: MoroccanLaw;
      articleKey: string;
      articleText: string;
      snippet: string;
    }[] = [];

    for (const law of lawsDatabase) {
      const artKey = findArticleKey(law, detectedNumber);
      if (artKey && law.data[artKey]) {
        const text = law.data[artKey];
        matches.push({
          law,
          articleKey: artKey,
          articleText: text,
          snippet: text.slice(0, 110).replace(/\n/g, ' ')
        });
      }
    }

    if (matches.length === 1) {
      return {
        kind: 'DIRECT_ARTICLE',
        law: matches[0].law,
        articleKey: matches[0].articleKey,
        articleText: matches[0].articleText,
        confidence: 'HIGH'
      };
    }

    if (matches.length > 1) {
      return {
        kind: 'MULTI_LAW_MATCH',
        articleKey: detectedNumber,
        matches
      };
    }

    return {
      kind: 'NOT_FOUND',
      queryText: query,
      message: `لم أجد نتيجة موثوقة لهذه المادة (${detectedNumber}) ضمن قاعدة البيانات القانونية المتاحة.`,
      confidence: 'LOW'
    };
  }

  // 5. Law mentioned WITHOUT article number (e.g. "مدونة الأسرة", "قانون الالتزامات")
  if (matchedLaw && !detectedNumber) {
    // If user just searched for a law, open article 1 of that law
    const keys = Object.keys(matchedLaw.data).sort(naturalCompare);
    const firstKey = keys[0] || '1';
    return {
      kind: 'DIRECT_ARTICLE',
      law: matchedLaw,
      articleKey: firstKey,
      articleText: matchedLaw.data[firstKey] || '',
      confidence: 'MEDIUM'
    };
  }

  // 6. If detectedNumber exists but didn't match single number query strictly:
  // Check if it's an article number query with some noise
  if (detectedNumber && query.split(/\s+/).length <= 4) {
    // If a current law context is available and has this article:
    if (currentLawContext) {
      const artKey = findArticleKey(currentLawContext, detectedNumber);
      if (artKey && currentLawContext.data[artKey]) {
        return {
          kind: 'DIRECT_ARTICLE',
          law: currentLawContext,
          articleKey: artKey,
          articleText: currentLawContext.data[artKey],
          confidence: 'MEDIUM'
        };
      }
    }

    // Check all laws
    const matches: {
      law: MoroccanLaw;
      articleKey: string;
      articleText: string;
      snippet: string;
    }[] = [];

    for (const law of lawsDatabase) {
      const artKey = findArticleKey(law, detectedNumber);
      if (artKey && law.data[artKey]) {
        const text = law.data[artKey];
        matches.push({
          law,
          articleKey: artKey,
          articleText: text,
          snippet: text.slice(0, 110).replace(/\n/g, ' ')
        });
      }
    }

    if (matches.length > 0) {
      return {
        kind: 'MULTI_LAW_MATCH',
        articleKey: detectedNumber,
        matches
      };
    }
  }

  // 7. CASE 5: TOPIC / KEYWORD SEARCH (e.g. "ما المادة المتعلقة بالفصل التعسفي؟")
  const topicResults = searchByTopic(query, lawsDatabase, matchedLaw);
  if (topicResults.length > 0) {
    return {
      kind: 'TOPIC_SEARCH',
      queryText: query,
      results: topicResults
    };
  }

  // If nothing found:
  return {
    kind: 'NOT_FOUND',
    queryText: query,
    message: 'المصدر المتاح لا يحتوي على معلومات كافية للتحقق من هذا الاستعلام.',
    confidence: 'LOW'
  };
}

/**
 * Searches laws by topic / keyword semantic match
 */
function searchByTopic(
  rawQuery: string,
  lawsDatabase: MoroccanLaw[],
  filterLaw?: MoroccanLaw
): {
  law: MoroccanLaw;
  articleKey: string;
  articleText: string;
  snippet: string;
  score: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}[] {
  // Clean query and extract keywords
  const stopWords = new Set([
    'ما', 'هي', 'هو', 'المادة', 'الفصل', 'المتعلقة', 'المتعلق', 'في', 'من', 'عن', 'على', 'إلى', 
    'الي', 'هل', 'كيف', 'شروط', 'احكام', 'حكم', 'نص', 'قانون', 'اريد', 'معرفة'
  ]);

  const cleanQuery = normalizeArabic(rawQuery);
  const keywords = cleanQuery
    .split(/\s+/)
    .filter(word => word.length >= 3 && !stopWords.has(word));

  if (keywords.length === 0) return [];

  const candidateLaws = filterLaw ? [filterLaw] : lawsDatabase;
  const scoredResults: {
    law: MoroccanLaw;
    articleKey: string;
    articleText: string;
    snippet: string;
    score: number;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  }[] = [];

  for (const law of candidateLaws) {
    for (const [key, text] of Object.entries(law.data)) {
      const textNorm = normalizeArabic(text);
      let score = 0;

      // Exact phrase match
      if (textNorm.includes(cleanQuery)) {
        score += 80;
      }

      // Keyword matches
      let matchedKwCount = 0;
      for (const kw of keywords) {
        if (textNorm.includes(kw)) {
          matchedKwCount++;
          score += 25;
        }
      }

      if (matchedKwCount === keywords.length && keywords.length > 1) {
        score += 30; // All keywords present bonus
      }

      if (score >= 25) {
        // Build concise snippet around first matching keyword
        const firstKw = keywords.find(kw => textNorm.includes(kw)) || keywords[0];
        const matchIdx = textNorm.indexOf(firstKw);
        const start = Math.max(0, matchIdx - 40);
        const end = Math.min(text.length, matchIdx + 110);
        const snippet = (start > 0 ? '...' : '') + text.slice(start, end).replace(/\n/g, ' ') + (end < text.length ? '...' : '');

        scoredResults.push({
          law,
          articleKey: key,
          articleText: text,
          snippet,
          score,
          confidence: score >= 60 ? 'HIGH' : score >= 35 ? 'MEDIUM' : 'LOW'
        });
      }
    }
  }

  // Sort descending by score
  return scoredResults.sort((a, b) => b.score - a.score).slice(0, 10);
}

/**
 * Natural comparison for sorting Moroccan legal article numbers (handles 1, 2, 2 مكرر, 12-1, 100)
 */
export const naturalCompare = (a: string, b: string): number => {
  const numA = parseFloat(a.replace(/[^\d.]/g, '')) || 0;
  const numB = parseFloat(b.replace(/[^\d.]/g, '')) || 0;
  if (numA !== numB) return numA - numB;
  return a.localeCompare(b, 'ar');
};

/**
 * Helper to match an article key inside a law
 */
function findArticleKey(law: MoroccanLaw, num: string): string | null {
  if (law.data[num]) return num;

  const numNorm = normalizeArabic(num);
  const keys = Object.keys(law.data);

  // Exact normalized match
  const found = keys.find(k => normalizeArabic(k) === numNorm);
  if (found) return found;

  // Prefix match (e.g. "12" matching "12 مكرر" or "12-1")
  const prefixMatch = keys.find(k => {
    const kNorm = normalizeArabic(k);
    return kNorm.startsWith(`${numNorm} `) || kNorm.startsWith(`${numNorm}-`) || kNorm.startsWith(`${numNorm}.`);
  });

  return prefixMatch || null;
}
