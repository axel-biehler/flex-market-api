import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import ProductsRepository from '../../repository/ProductsRepository';

export default async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  if (!event.pathParameters?.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing id',
      }),
    };
  }

  try {
    const repository = new ProductsRepository();

    const product = await repository.getProduct(event.pathParameters.id);

    if (!product) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Product not found',
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        product,
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
