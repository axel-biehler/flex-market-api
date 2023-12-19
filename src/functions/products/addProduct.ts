import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import Ajv from 'ajv';
import { nanoid } from 'nanoid';
import ProductsRepository from '../../repository/ProductsRepository';
import S3Repository from '../../repository/S3Repository';

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
  },
  required: [
    'name',
    'description',
    'price',
    'specs',
    'stock',
    'imagesUrl',
    'gender',
    'category',
  ],
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
    const product = {
      id: nanoid(),
      ...JSON.parse(event.body!),
    };
    const repository = new ProductsRepository();
    const s3Repository = new S3Repository(process.env.PUBLIC_BUCKET_NAME!);

    const imageUrls = await Promise.all(
      product.imagesUrl.map(async (imageUrl: string) => s3Repository.generatePutPresignedUrl(`${product.id}/${imageUrl}`)),
    );

    const productWithImages = {
      ...product,
      imagesUrl: product.imagesUrl.map((imageUrl: string) => `${process.env.PUBLIC_BUCKET_URL}/${product.id}/${imageUrl}`),
    };

    await repository.createProduct(productWithImages);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Product created',
        presignedUrls: imageUrls,
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
