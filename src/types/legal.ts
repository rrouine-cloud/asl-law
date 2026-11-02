
export interface LawArticle {
  id: string;
  number: string;
  title?: string;
  content: string;
  section?: string;
  chapter?: string;
}

export type LawData = Record<string, string>;

export interface LawDatabase {
  [key: string]: LawData;
}
