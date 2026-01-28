
export type InterfaceLanguage = 'en' | 'zh-TW' | 'zh-CN' | 'ru';
export type Dialect = 'Eastern' | 'Western';

export type LocalizedString = string | Partial<Record<InterfaceLanguage, string>>;

export interface LearnedWord {
  armenian: string;
  translation: string;
  learnedAt: number;
}

export interface UserProgress {
  xp: number;
  streak: number;
  gems: number;
  hearts: number;
  lastHeartRefill: number;
  level: number;
  currentUnit: number;
  completedLessons: string[];
  dialect: Dialect;
  learnedWords: LearnedWord[];
}

export enum ExerciseType {
  EXPLANATION = 'EXPLANATION',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRANSLATION = 'TRANSLATION',
  LISTENING = 'LISTENING',
  SPEAKING = 'SPEAKING',
  MATCHING = 'MATCHING',
  FILL_IN_BLANKS = 'FILL_IN_BLANKS',
  UNSCRAMBLE = 'UNSCRAMBLE'
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: LocalizedString;
  armenianText?: string;
  translation?: LocalizedString;
  explanation?: LocalizedString;
  options?: string[] | Record<InterfaceLanguage, string[]>;
  correctAnswer: string;
  audioPrompt?: string;
  pairs?: { left: string; right: string }[];
  // New fields for interactive exercises
  sentenceWithBlank?: string; 
  unscrambleWords?: string[];
}

export interface Lesson {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  exercises: Exercise[];
}

export interface Unit {
  id: number;
  title: LocalizedString;
  lessons: Lesson[];
  location?: string;
}
