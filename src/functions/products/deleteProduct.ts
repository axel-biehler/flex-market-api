import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import ProductsRepository from '../../repository/ProductsRepository';

export default async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const id = event.pathParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing id',
      }),
    };
  }

  try {
    const repository = new ProductsRepository();

    if (!(await repository.getProduct(id))) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Product not found',
        }),
      };
    }

    await repository.deleteProduct(id);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Product deleted',
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error deleting product',
      }),
    };
  }
}
