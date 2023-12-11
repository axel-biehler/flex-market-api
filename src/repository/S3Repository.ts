import {
  S3Client, PutObjectCommand, DeleteObjectsCommand, ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default class S3Repository {
  private readonly bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  public async generatePutPresignedUrl(objectKey: string) {
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

  public async deleteFolder(folderKey: string) {
    const client = new S3Client({ region: process.env.AWS_REGION });

    // List objects in the bucket with the specified folder prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: folderKey,
    });

    const listResponse = await client.send(listCommand);
    const objectsToDelete = listResponse.Contents?.map((object) => ({ Key: object.Key }));

    if (objectsToDelete && objectsToDelete.length === 0) {
      return `No objects found under folder ${folderKey}.`;
    }

    // Create a DeleteObjectsCommand to delete the objects
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: this.bucketName,
      Delete: {
        Objects: objectsToDelete,
      },
    });

    try {
      await client.send(deleteCommand);
      return `Deleted ${objectsToDelete!.length} objects under folder ${folderKey}.`;
    } catch (error) {
      console.error('Error deleting folder', error);
      throw error;
    }
  }
}
