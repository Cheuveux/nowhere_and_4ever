// config/plugins.ts
export default {
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY,
            secretAccessKey: process.env.SUPABASE_S3_SECRET_KEY,
          },
          region: process.env.SUPABASE_S3_REGION,
          endpoint: process.env.SUPABASE_S3_ENDPOINT,
          forcePathStyle: true,
          params: {
            Bucket: process.env.SUPABASE_S3_BUCKET,
          },
        },
        // URL publique pour la lecture des fichiers
        baseUrl: `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/${process.env.SUPABASE_S3_BUCKET}`,
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
};