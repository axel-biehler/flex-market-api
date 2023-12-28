import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import Ajv from 'ajv';
import { nanoid } from 'nanoid';
import OrdersRepository from '../../repository/OrdersRepository';
import ProductsRepository from '../../repository/ProductsRepository';
import { Order, OrderItem } from '../../models/Order';
import { getUserInfo } from '../../libs/getUserInfo';

const ordersSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          itemId: { type: 'string' },
          quantity: { type: 'number', minimum: 1 },
          size: {
            type: 'string',
            enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          },
        },
        required: ['itemId', 'quantity', 'size'],
        additionalProperties: false,
      },
    },
    shippingAddress: { type: 'string' },
  },
  required: ['items', 'shippingAddress'],
  additionalProperties: false,
};

export default async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const ajv = new Ajv();

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

  const validate = ajv.compile(ordersSchema);

  if (!validate(JSON.parse(event.body))) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid product',
        errors: validate.errors,
      }),
    };
  }

  try {
    const userInfo = await getUserInfo(authorization);
    const order = {
      orderId: nanoid(),
      ...JSON.parse(event.body!),
    };

    const ordersRepository = new OrdersRepository();
    const productsRepository = new ProductsRepository();

    const items = await productsRepository.getProductsByUUIDs(order.items.map((item: OrderItem) => item.itemId));

    const newOrder: Order = {
      ...order,
      orderId: nanoid(),
      items: [
        ...items.map((item) => ({
          itemId: item.id,
          quantity: order.items.find((orderItem: OrderItem) => orderItem.itemId === item.id)?.quantity!,
          size: order.items.find((orderItem: OrderItem) => orderItem.itemId === item.id)?.size!,
          price: item.price,
        })),
      ],
      orderDate: new Date().toISOString(),
      status: 'PENDING',
      totalAmount: items.reduce((acc, item) => acc + item.price, 0),
      userId: userInfo?.sub!,
    };

    await ordersRepository.createOrder(newOrder);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Order created',
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error creating order',
      }),
    };
  }
}
