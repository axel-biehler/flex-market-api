import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import Ajv from 'ajv';
import ProductsRepository from '../../repository/ProductsRepository';

const productSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    price: { type: 'number' },
    description: { type: 'string' },
    quantity: { type: 'number' },
    imageUrls: {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
    },
  },
  required: ['name', 'price', 'description', 'quantity', 'imageUrls'],
  additionalProperties: false,
};

export default async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const ajv = new Ajv();

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing body',
      }),
    };
  }

  const validate = ajv.compile(productSchema);

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
    const product = JSON.parse(event.body!);
    const repository = new ProductsRepository();

    await repository.createProduct(product);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Product created',
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error creating product',
      }),
    };
  }
}
