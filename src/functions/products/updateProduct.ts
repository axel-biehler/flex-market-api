import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import Ajv from 'ajv';
import ProductsRepository from '../../repository/ProductsRepository';
import { Product } from '../../models/Product';

const productSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    specs: {
      type: 'object',
      additionalProperties: { type: 'string' },
    },
    stock: {
      type: 'object',
      additionalProperties: { type: 'number' },
    },
    imagesUrl: {
      type: 'array',
      items: { type: 'string' },
    },
    gender: {
      type: 'string',
      enum: ['MEN', 'WOMEN', 'UNISEX'],
    },
    createdAt: { type: 'string' },
    category: {
      type: 'string',
      enum: [
        'TOPS',
        'BOTTOMS',
        'DRESSES',
        'OUTERWEAR',
        'UNDERWEAR',
        'FOOTWEAR',
        'ACCESSORIES',
        'ATHLETIC',
        'SLEEPWEAR',
        'SWIMWEAR',
      ],
    },
    additionalProperties: false,
  },
};

export default async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const id = event.pathParameters?.id;
  const ajv = new Ajv();

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

    const validate = ajv.compile(productSchema);

    const input: Partial<Product> = JSON.parse(event.body!);

    if (!validate(input)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid body',
          errors: validate.errors,
        }),
      };
    }

    const newProduct: Product = {
      id: product.id,
      name: input.name || product.name,
      searchName: input.name ? input.name.toLowerCase() : product.searchName,
      description: input.description || product.description,
      price: input.price || product.price,
      specs: product.specs,
      stock: product.stock,
      imagesUrl: input.imagesUrl || product.imagesUrl,
      gender: product.gender,
      createdAt: product.createdAt,
      category: product.category,
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
