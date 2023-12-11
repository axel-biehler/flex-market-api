import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import ProductsRepository from '../../repository/ProductsRepository';
import S3Repository from '../../repository/S3Repository';

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
    const s3Repository = new S3Repository(process.env.PUBLIC_BUCKET_NAME!);
    const product = await repository.getProduct(id);

    if (!(product)) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Product not found',
        }),
      };
    }

    await repository.deleteProduct(id);
    try {
      await s3Repository.deleteFolder(`${product.id}/`);
    } catch (error) {
      console.error(error);
    }

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
