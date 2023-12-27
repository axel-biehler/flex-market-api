import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import Ajv, { Schema } from 'ajv';
import ProductsRepository from '../../repository/ProductsRepository';

const inputValidation: Schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    gender: {
      type: ['string'],
      enum: ['MEN', 'WOMEN', 'UNISEX'], // Add or modify the list based on your valid 'ItemGender' values.
    },
    category: {
      type: ['array'],
      items: {
        type: 'string',
      },
    },
    name: {
      type: ['string'],
    },
  },
  additionalProperties: false,
};

export default async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const body = JSON.parse(event.body!);
  try {
    const ajv = new Ajv();
    if (!ajv.validate(inputValidation, body)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid input',
          errors: ajv.errors,
        }),
      };
    }
    const repository = new ProductsRepository();

    const products = await repository.searchProducts(body);

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
