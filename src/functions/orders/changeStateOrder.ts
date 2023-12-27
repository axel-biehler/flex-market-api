import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import Ajv from 'ajv';
import OrdersRepository from '../../repository/OrdersRepository';
import { getUserInfo } from '../../libs/getUserInfo';
import ProfilesRepository from '../../repository/ProfileRepository';
import { getManagementToken } from '../../libs/getManagementToken';
import { OrderStatus } from '../../models/Order';

const ordersSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['PENDING', 'COMPLETED', 'CANCELLED', 'SENT'],
    },
    orderId: { type: 'string' },
  },
  required: ['status', 'orderId'],
  additionalProperties: false,
};

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

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing body',
      }),
    };
  }

  try {
    const body: { orderId: string, status: OrderStatus } = JSON.parse(event.body!);
    const ajv = new Ajv();
    const validate = ajv.compile(ordersSchema);

    if (!validate(body)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid order',
          errors: validate.errors,
        }),
      };
    }

    const repository = new OrdersRepository();

    const userInfo = await getUserInfo(authorization);
    const token = await getManagementToken();
    const userRepository = new ProfilesRepository(token.access_token);

    const roles = await userRepository.getRoles(userInfo?.sub!);

    const order = await repository.getOrder(body.orderId);

    if (roles.length === 0 && body.status !== 'CANCELLED') {
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: 'You are not allowed to change the status of this order',
        }),
      };
    }

    if (!order) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Order not found',
        }),
      };
    }

    await repository.updateOrderStatus(body.orderId, body.status);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Order updated',
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error updating order',
      }),
    };
  }
}
