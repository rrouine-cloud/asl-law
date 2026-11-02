import rawLaborCode from './morocco_labor_code_65_99_articles.json';
import updatedArticles1to50 from './morocco_labor_code_articles_1_to_50.json';

export interface ArticleHierarchy {
  book: string | null;
  section: string | null;
  chapter: string | null;
  branch: string | null;
}

export interface ArticleMeta {
  article_number: number;
  article_label_ar: string;
  hierarchy: ArticleHierarchy;
  search_keys?: string[];
  source_page_start?: number;
  source_page_end?: number;
  paragraphs?: string[];
}

export interface UpdatedArticleItem {
  article_number: number;
  article_label: string;
  book: string | null;
  book_title: string | null;
  section: string | null;
  section_title: string | null;
  chapter: string | null;
  chapter_title: string | null;
  branch: string | null;
  branch_title: string | null;
  paragraphs: string[];
  text: string;
}

interface RawArticleItem {
  article_number: number;
  article_label_ar: string;
  raw_heading_in_pdf?: string;
  hierarchy?: {
    book?: string | null;
    section?: string | null;
    chapter?: string | null;
    branch?: string | null;
  };
  source_page_start?: number;
  source_page_end?: number;
  search_keys?: string[];
  text: string;
  text_compact?: string;
}

const articlesRaw = (rawLaborCode as unknown as { articles: Record<string, RawArticleItem> }).articles || {};

export const LABOUR_CODE_DATA: Record<string, string> = {};
export const LABOUR_CODE_META: Record<string, ArticleMeta> = {};
export const LABOUR_CODE_ARTICLES_1_TO_50: UpdatedArticleItem[] = (updatedArticles1to50 as { articles: UpdatedArticleItem[] }).articles;

// 1. Populate all 589 articles from main database
for (const [key, item] of Object.entries(articlesRaw)) {
  LABOUR_CODE_DATA[key] = item.text || item.text_compact || '';
  LABOUR_CODE_META[key] = {
    article_number: item.article_number,
    article_label_ar: item.article_label_ar || `المادة ${key}`,
    hierarchy: {
      book: item.hierarchy?.book || null,
      section: item.hierarchy?.section || null,
      chapter: item.hierarchy?.chapter || null,
      branch: item.hierarchy?.branch || null,
    },
    search_keys: item.search_keys || [],
    source_page_start: item.source_page_start,
    source_page_end: item.source_page_end,
  };
}

// 2. Ensure articles 1 to 50 are updated with accurate paragraphs and combined hierarchy titles
for (const item of LABOUR_CODE_ARTICLES_1_TO_50) {
  const key = String(item.article_number);
  const bookStr = item.book_title ? `${item.book}: ${item.book_title}` : (item.book || null);
  const sectionStr = item.section_title ? `${item.section}: ${item.section_title}` : (item.section || null);
  const chapterStr = item.chapter_title ? `${item.chapter}: ${item.chapter_title}` : (item.chapter || null);
  const branchStr = item.branch_title ? `${item.branch}: ${item.branch_title}` : (item.branch || null);

  LABOUR_CODE_DATA[key] = item.text;
  const existingMeta = LABOUR_CODE_META[key];
  LABOUR_CODE_META[key] = {
    article_number: item.article_number,
    article_label_ar: item.article_label,
    hierarchy: {
      book: bookStr,
      section: sectionStr,
      chapter: chapterStr,
      branch: branchStr,
    },
    search_keys: existingMeta?.search_keys || [
      key,
      item.article_label,
      `مادة ${key}`,
      `مدونة الشغل المادة ${key}`,
      `القانون 65.99 المادة ${key}`
    ],
    source_page_start: existingMeta?.source_page_start,
    source_page_end: existingMeta?.source_page_end,
    paragraphs: item.paragraphs
  };
}

export const LABOUR_CODE_DOC_INFO = (rawLaborCode as unknown as { document: Record<string, unknown> }).document || {
  law_number: "65.99",
  execution_dahir: "1.03.194",
  execution_date_gregorian: "2003-09-11",
  article_count: 589
};

