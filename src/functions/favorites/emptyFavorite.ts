import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserInfo } from '../../libs/getUserInfo';
import FavoritesRepository from '../../repository/FavoritesRepository';

export default async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const authorization = event.headers?.authorization;
  if (!authorization) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing authorization header',
      }),
    };
  }
  try {
    const userInfo = await getUserInfo(authorization);
    const favoritesRepository = new FavoritesRepository();

    try {
      await favoritesRepository.removeById(userInfo?.sub!);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Favorite emptied',
        }),
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Error emptying favorite or already empty',
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error emptying favorite',
      }),
    };
  }
}
