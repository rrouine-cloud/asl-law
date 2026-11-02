export interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    scores: Record<string, number>;
  }[];
}

export interface Career {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  exams: string;
  institution: string;
  ageLimit?: string;
  degree: string;
}

export interface Resource {
  id: string;
  title: string;
  category: string;
  type: 'book' | 'summary' | 'law';
  url: string;
}

export interface StudyPlan {
  id: string;
  dailyHours: number;
  priority: string;
  schedule: {
    time: string;
    subject: string;
    type: 'study' | 'break' | 'review';
  }[];
}
