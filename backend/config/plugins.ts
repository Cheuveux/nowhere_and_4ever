import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({});

// backend/config/plugins.ts
export default {
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        credentials: {
          accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY,
          secretAccessKey: process.env.SUPABASE_S3_SECRET_KEY,
        },
        region: process.env.SUPABASE_S3_REGION,
        endpoint: process.env.SUPABASE_S3_ENDPOINT,
        forcePathStyle: true, // obligatoire pour Supabase
        params: {
          Bucket: process.env.SUPABASE_S3_BUCKET,
        },
      },
    },
  },
};