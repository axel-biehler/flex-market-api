import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default class S3Repository {
  private readonly bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  public async generatePresignedUrl(objectKey: string) {
    const client = new S3Client({ region: process.env.AWS_REGION });

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
    });

    try {
      return await getSignedUrl(client, command, { expiresIn: 300 });
    } catch (error) {
      console.error('Error generating pre-signed URL', error);
      throw error;
    }
  }
}
