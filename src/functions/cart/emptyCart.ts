import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserInfo } from '../../libs/getUserInfo';
import CartsRepository from '../../repository/CartsRepository';

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
    const cartsRepository = new CartsRepository();

    try {
      await cartsRepository.removeById(userInfo?.sub!);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Cart emptied',
        }),
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Error emptying cart or already empty',
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error adding to cart',
      }),
    };
  }
}
