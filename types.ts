export enum ViewState {
  HOME = 'HOME',
  WHEEL = 'WHEEL',
  BOTTLE = 'BOTTLE',
  SURVEY = 'SURVEY'
}

export interface Question {
  id: string;
  text: string;
  category: 'funny' | 'deep' | 'dare';
}

export interface SurveyOption {
  id: string;
  text: string;
  votes: number;
}

export interface Survey {
  id: string;
  question: string;
  options: SurveyOption[];
}
