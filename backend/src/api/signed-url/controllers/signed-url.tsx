'use strict';

const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

module.exports = {
  async getSignedUrl(ctx) {
    const { fileKey } = ctx.query;

    if (!fileKey) {
      return ctx.badRequest('fileKey query parameter is required');
    }

    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CF_ACCESS_KEY_ID,
        secretAccessKey: process.env.CF_SECRET_ACCESS_KEY,
      },
    });

    try {
      const command = new GetObjectCommand({
        Bucket: process.env.CF_BUCKET_NAME,
        Key: fileKey,
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // Expires in 1 hour
      ctx.send({ url });
    } catch (err) {
      console.error(err);
      ctx.throw(500, 'Failed to generate signed URL');
    }
  },
};
