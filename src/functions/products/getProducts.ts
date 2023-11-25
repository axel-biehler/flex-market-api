import { APIGatewayProxyResultV2 } from 'aws-lambda';
import ProductsRepository from '../../repository/ProductsRepository';

export default async function handler(): Promise<APIGatewayProxyResultV2> {
  try {
    const repository = new ProductsRepository();

    const products = await repository.getProducts();

    return {
      statusCode: 200,
      body: JSON.stringify({
        products,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error getting products',
      }),
    };
  }
}
