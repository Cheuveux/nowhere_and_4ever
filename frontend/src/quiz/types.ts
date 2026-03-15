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
  emoji: string;
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
  attributes: {
    question: string;
    answer: StrapiAnswer[];
  };
};

export type Phase = "intro" | "quiz" | "result";