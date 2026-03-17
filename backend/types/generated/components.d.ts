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

export interface GridContentGridContent extends Struct.ComponentSchema {
  collectionName: 'components_grid_content_grid_contents';
  info: {
    displayName: 'grid_content';
  };
  attributes: {
    Date: Schema.Attribute.String;
    media: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Titre: Schema.Attribute.String;
    Views: Schema.Attribute.Integer;
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
      'grid-content.grid-content': GridContentGridContent;
      'quizz-answer.quizz-answers': QuizzAnswerQuizzAnswers;
    }
  }
}
