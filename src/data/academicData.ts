export interface AcademicResource {
  title: string;
  author: string;
  year: string;
  type: 'book' | 'thesis' | 'article' | 'law' | 'foreign';
  location: string;
  downloadUrl?: string;
  description?: string;
}

export const LOCAL_ACADEMIC_RESOURCES: AcademicResource[] = [
  {
    title: "شرح قانون الالتزامات والعقود المغربي",
    author: "عبد القادر العرعاري",
    year: "2022",
    type: "book",
    location: "مكتبة كلية الحقوق أكدال",
    downloadUrl: "https://bibliotheque.fsjest.ma/"
  }
];
