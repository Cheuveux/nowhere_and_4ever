export type Answer = {
  text: string;
  points: number;
};

export type Question = {
  id: number;
  text: string;
  answer: Answer[];
};

export type ResultData = {
  range: [number, number];
  label: string;
  color: string;
  tag: string;
  description: string;
};

export type StrapiAnswer = {
  Text: string;
  points: number;
};

export type StrapiItem = {
  id: number;
  question?: string; // v5 format
  answer?: StrapiAnswer[]; // v5 format
  attributes?: {
    question: string; // v4 format
    answer: StrapiAnswer[]; // v4 format
  };
};

export type Phase = "intro" | "quiz" | "result";