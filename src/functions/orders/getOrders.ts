import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import OrdersRepository from '../../repository/OrdersRepository';
import { getUserInfo } from '../../libs/getUserInfo';

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

    const userInfo = await getUserInfo(authorization);

    const orders = await repository.getOrders();

    const filteredOrders = orders.filter((order) => order.userId === userInfo?.sub);

    return {
      statusCode: 200,
      body: JSON.stringify({
        orders: filteredOrders,
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
