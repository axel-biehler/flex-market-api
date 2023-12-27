import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import OrdersRepository from '../../repository/OrdersRepository';

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
    const repository = new OrdersRepository();

    const orders = await repository.getOrders();

    return {
      statusCode: 200,
      body: JSON.stringify({
        orders,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error getting orders',
      }),
    };
  }
}
