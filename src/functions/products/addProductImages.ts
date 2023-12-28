import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import Ajv from 'ajv';
import ProductsRepository from '../../repository/ProductsRepository';
import S3Repository from '../../repository/S3Repository';

const imagesSchema = {
  type: 'object',
  properties: {
    imagesUrl: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: [
    'imagesUrl',
  ],
  additionalProperties: false,
};

interface Input {
  imagesUrl: string[];
}

export default async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const ajv = new Ajv();
  const id = event.pathParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing id',
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

  const validate = ajv.compile(imagesSchema);

  const body: Input = JSON.parse(event.body!);

  if (!validate(body)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid product',
        errors: validate.errors,
      }),
    };
  }

  try {
    const images: string[] = body.imagesUrl;
    const repository = new ProductsRepository();
    const s3Repository = new S3Repository(process.env.PUBLIC_BUCKET_NAME!);

    const product = await repository.getProduct(id);

    if (!product) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Product not found',
        }),
      };
    }

    const imageUrls = await Promise.all(
      images.map(async (imageUrl: string) => s3Repository.generatePutPresignedUrl(`${id}/${imageUrl}`)),
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'images created',
        presignedUrls: imageUrls,
        imageUrls: images.map((imageUrl) => `${process.env.PUBLIC_BUCKET_URL}/${id}/${imageUrl}`),
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
