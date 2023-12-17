import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import CartsRepository from '../../repository/CartsRepository';
import { getUserInfo } from '../../libs/getUserInfo';

export default async function getCartById(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
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
    const cartsRepository = new CartsRepository();
    const userInfo = await getUserInfo(authorization);

    const cart = await cartsRepository.getById(userInfo?.sub!);

    if (!cart) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Cart not found',
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(cart),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error getting cart',
      }),
    };
  }
}
