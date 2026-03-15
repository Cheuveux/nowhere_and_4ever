import type { Schema, Struct } from '@strapi/strapi';

export interface QuizzAnswerQuizzAnswers extends Struct.ComponentSchema {
  collectionName: 'components_quizz_answer_quizz_answers';
  info: {
    displayName: 'quizz-answers';
  };
  attributes: {
    points: Schema.Attribute.Integer;
    Text: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'quizz-answer.quizz-answers': QuizzAnswerQuizzAnswers;
    }
  }
}
