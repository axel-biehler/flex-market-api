import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { getUserInfo } from '../../libs/getUserInfo';
import ProfilesRepository from '../../repository/ProfileRepository';
import { getManagementToken } from '../../libs/getManagementToken';

export default async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const authorization = event.headers?.authorization;

  if (!authorization) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing authorization header',
      }),
    };
  }

  const userInfo = await getUserInfo(authorization);
  const token = await getManagementToken();
  const profileRepository = new ProfilesRepository(token.access_token);
  await profileRepository.deleteUser(userInfo?.sub!);

  return {
    statusCode: 200,
    body: JSON.stringify('User deleted successfully'),
  };
}
