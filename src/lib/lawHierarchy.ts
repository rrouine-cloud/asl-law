import { MoroccanLaw, naturalCompare } from './moroccanLegalEngine';

export interface HierarchyChapter {
  id: string;
  book: string;
  section: string;
  chapter: string;
  articleKeys: string[];
}

export interface HierarchyBookGroup {
  book: string;
  chapters: HierarchyChapter[];
  totalArticles: number;
}

// Constitution Chapters mapping
const CONSTITUTION_CHAPTERS = [
  { range: [1, 18], chapter: 'الباب الأول: أحكام عامة', book: 'دستور المملكة المغربية' },
  { range: [19, 40], chapter: 'الباب الثاني: الحريات والحقوق الأساسية', book: 'دستور المملكة المغربية' },
  { range: [41, 59], chapter: 'الباب الثالث: الملكية', book: 'دستور المملكة المغربية' },
  { range: [60, 86], chapter: 'الباب الرابع: السلطة التشريعية', book: 'دستور المملكة المغربية' },
  { range: [87, 94], chapter: 'الباب الخامس: السلطة التنفيذية', book: 'دستور المملكة المغربية' },
  { range: [95, 106], chapter: 'الباب السادس: العلاقات بين السلط', book: 'دستور المملكة المغربية' },
  { range: [107, 128], chapter: 'الباب السابع: السلطة القضائية', book: 'دستور المملكة المغربية' },
  { range: [129, 134], chapter: 'الباب الثامن: المحكمة الدستورية', book: 'دستور المملكة المغربية' },
  { range: [135, 146], chapter: 'الباب التاسع: الجهات والجماعات الترابية الأخرى', book: 'دستور المملكة المغربية' },
  { range: [147, 150], chapter: 'الباب العاشر: المجلس الأعلى للحسابات', book: 'دستور المملكة المغربية' },
  { range: [151, 153], chapter: 'الباب الحادي عشر: المجلس الاقتصادي والاجتماعي والبيئي', book: 'دستور المملكة المغربية' },
  { range: [154, 171], chapter: 'الباب الثاني عشر: الحكامة الجيدة', book: 'دستور المملكة المغربية' },
  { range: [172, 176], chapter: 'الباب الثالث عشر: مراجعة الدستور', book: 'دستور المملكة المغربية' },
  { range: [177, 180], chapter: 'الباب الرابع عشر: أحكام خاصة وانتقالية', book: 'دستور المملكة المغربية' }
];

export function getLawHierarchy(law: MoroccanLaw): HierarchyBookGroup[] {
  const articleKeys = Object.keys(law.data).sort(naturalCompare);
  if (articleKeys.length === 0) return [];

  // Case 1: Law has explicit articlesMeta (like Labour Code)
  if (law.articlesMeta && Object.keys(law.articlesMeta).length > 0) {
    const chaptersMap = new Map<string, HierarchyChapter>();

    for (const key of articleKeys) {
      const meta = law.articlesMeta[key];
      const book = meta?.hierarchy?.book || 'الكتاب العام';
      const section = meta?.hierarchy?.section || 'القسم العام';
      const chapter = meta?.hierarchy?.chapter || 'أحكام تمهيدية وعامة';

      const chapterKey = `${book}:::${section}:::${chapter}`;

      if (!chaptersMap.has(chapterKey)) {
        chaptersMap.set(chapterKey, {
          id: chapterKey,
          book,
          section,
          chapter,
          articleKeys: []
        });
      }
      chaptersMap.get(chapterKey)!.articleKeys.push(key);
    }

    // Group into books
    const booksMap = new Map<string, HierarchyBookGroup>();
    for (const chap of chaptersMap.values()) {
      if (!booksMap.has(chap.book)) {
        booksMap.set(chap.book, {
          book: chap.book,
          chapters: [],
          totalArticles: 0
        });
      }
      const bGroup = booksMap.get(chap.book)!;
      bGroup.chapters.push(chap);
      bGroup.totalArticles += chap.articleKeys.length;
    }

    return Array.from(booksMap.values());
  }

  // Case 2: Constitution mapping
  if (law.id === 'constitution') {
    const bookName = 'دستور المملكة المغربية (2011)';
    const chapters: HierarchyChapter[] = CONSTITUTION_CHAPTERS.map(c => {
      const matchedKeys = articleKeys.filter(k => {
        const n = parseInt(k, 10);
        return !isNaN(n) && n >= c.range[0] && n <= c.range[1];
      });
      return {
        id: c.chapter,
        book: bookName,
        section: '',
        chapter: c.chapter,
        articleKeys: matchedKeys
      };
    }).filter(c => c.articleKeys.length > 0);

    return [{
      book: bookName,
      chapters,
      totalArticles: articleKeys.length
    }];
  }

  // Case 3: Fallback grouping by blocks of articles
  const blockSize = 50;
  const chapters: HierarchyChapter[] = [];
  for (let i = 0; i < articleKeys.length; i += blockSize) {
    const chunk = articleKeys.slice(i, i + blockSize);
    const startKey = chunk[0];
    const endKey = chunk[chunk.length - 1];
    const label = `المواد من ${startKey} إلى ${endKey}`;

    chapters.push({
      id: `block_${i}`,
      book: law.shortName,
      section: '',
      chapter: label,
      articleKeys: chunk
    });
  }

  return [{
    book: law.shortName,
    chapters,
    totalArticles: articleKeys.length
  }];
}

/**
 * Find the chapter corresponding to a given article key
 */
export function findChapterForArticle(
  hierarchy: HierarchyBookGroup[],
  articleKey: string
): HierarchyChapter | null {
  for (const b of hierarchy) {
    for (const c of b.chapters) {
      if (c.articleKeys.includes(articleKey)) {
        return c;
      }
    }
  }
  return null;
}
