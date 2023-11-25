import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import ProductsRepository from '../../repository/ProductsRepository';
import { Product } from '../../models/Product';

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
    const product = await repository.getProduct(id);

    if (!product) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Product not found',
        }),
      };
    }

    const input = JSON.parse(event.body!);

    const newProduct: Product = {
      id: product.id,
      description: input.description || product.description,
      imageUrls: input.imageUrls || product.imageUrls,
      name: input.name || product.name,
      price: input.price || product.price,
      quantity: input.quantity || product.quantity,
      createdAt: product.createdAt,
    };

    await repository.updateProduct(product.id, newProduct);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Product updated',
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error updating product',
      }),
    };
  }
}
