import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { Cart } from '../models/Cart';

export default class CartsRepository {
  private dynamoDbClient: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({ region: process.env.REGION! });
    this.dynamoDbClient = DynamoDBDocumentClient.from(client);
  }

  public async addOrUpdateCart(cart: Cart): Promise<any> {
    try {
      await this.dynamoDbClient.send(new PutCommand({
        TableName: process.env.CARTS_TABLE!,
        Item: cart,
        ConditionExpression: 'attribute_not_exists(cartId)', // Check if cartId doesn't exist
      }));
    } catch (error: any) {
      console.log('here');
      if (error.name === 'ConditionalCheckFailedException') {
        console.log('biloute');
        // If the cart already exists, update it instead
        await this.dynamoDbClient.send(new PutCommand({
          TableName: process.env.CARTS_TABLE!,
          Item: cart,
        }));
      } else {
        console.error(error);
        throw new Error('Error creating or updating cart');
      }
    }
  }

  public async getById(userId: string): Promise<Cart | undefined> {
    try {
      console.log('cartId', userId);
      const result = await this.dynamoDbClient.send(new GetCommand({
        TableName: process.env.CARTS_TABLE!,
        Key: {
          userId,
        },
      }));

      if (result.Item) {
        return result.Item as Cart;
      }
      return undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  public removeById(userId: string): Promise<any> {
    return this.dynamoDbClient.send(new DeleteCommand({
      TableName: process.env.CARTS_TABLE!,
      Key: {
        userId,
      },
    }));
  }
}
