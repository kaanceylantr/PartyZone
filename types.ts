
export enum ViewState {
  HOME = 'HOME',
  WHEEL = 'WHEEL',
  BOTTLE = 'BOTTLE',
  SURVEY = 'SURVEY',
  NEVER_HAVE_I_EVER = 'NEVER_HAVE_I_EVER',
  PROFILE = 'PROFILE'
}

export interface User {
  username: string;
  email: string;
  avatarId?: number; // 0-7 index for predefined avatars
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

export interface SavedWheel {
  id: string;
  username: string;
  title: string;
  questions: string[];
  targetCount: number;
  createdAt: string;
}

export interface SavedSurveyList {
  id: string;
  username: string;
  title: string;
  surveys: Survey[];
  createdAt: string;
}

export interface SavedNHIEList {
  id: string;
  username: string;
  title: string;
  questions: string[];
  createdAt: string;
}
