import type { Schema, Struct } from '@strapi/strapi';

export interface AudioTrackAudioTrack extends Struct.ComponentSchema {
  collectionName: 'components_audio_track_audio_tracks';
  info: {
    displayName: 'audio-track';
  };
  attributes: {
    cover: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    sound: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

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
      'audio-track.audio-track': AudioTrackAudioTrack;
      'quizz-answer.quizz-answers': QuizzAnswerQuizzAnswers;
    }
  }
}
