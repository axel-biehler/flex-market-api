import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { getUserInfo } from '../../libs/getUserInfo';
import FavoritesRepository from '../../repository/FavoritesRepository';

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

  try {
    const favoritesRepository = new FavoritesRepository();
    const userInfo = await getUserInfo(authorization);

    const favorite = await favoritesRepository.getById(userInfo?.sub!);

    if (!favorite) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Favorite not found',
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(favorite),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error getting favorite',
      }),
    };
  }
}
