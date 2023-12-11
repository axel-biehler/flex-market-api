import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import S3Repository from '../../repository/S3Repository';
import { getUserInfo } from '../../libs/getUserInfo';
import { getManagementToken } from '../../libs/getManagementToken';
import ProfilesRepository from '../../repository/ProfileRepository';

export default async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const { body } = event;
  const authorization = event.headers?.authorization;

  if (!authorization) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing authorization header',
      }),
    };
  }

  if (!body && typeof body !== 'string') {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing body',
      }),
    };
  }

  const userInfo = await getUserInfo(authorization);
  const s3Repository = new S3Repository(process.env.PUBLIC_BUCKET_NAME!);
  const objectKey = `${userInfo?.sub!}/${JSON.parse(body).key}`;
  const token = await getManagementToken();
  const profileRepository = new ProfilesRepository(token.access_token);
  const url = await s3Repository.generatePutPresignedUrl(objectKey);
  await profileRepository.updateProfile(userInfo?.sub!, {
    picture: `${process.env.PUBLIC_BUCKET_URL}/${objectKey}`,
  });

  console.log(url);

  return {
    statusCode: 200,
    body: JSON.stringify({
      url,
    }),
  };
}
