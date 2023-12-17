import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { Cart } from '../models/Cart';
import { Favorite } from '../models/Favorite';

export default class FavoritesRepository {
  private dynamoDbClient: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({ region: process.env.REGION! });
    this.dynamoDbClient = DynamoDBDocumentClient.from(client);
  }

  public async addOrUpdateFavorite(favorites: Favorite): Promise<any> {
    try {
      await this.dynamoDbClient.send(new PutCommand({
        TableName: process.env.FAVORITES_TABLE!,
        Item: favorites,
        ConditionExpression: 'attribute_not_exists(cartId)', // Check if cartId doesn't exist
      }));
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        // If the cart already exists, update it instead
        await this.dynamoDbClient.send(new PutCommand({
          TableName: process.env.FAVORITES_TABLE!,
          Item: favorites,
        }));
      } else {
        console.error(error);
        throw new Error('Error creating or updating favorites');
      }
    }
  }

  public async getById(userId: string): Promise<Favorite | undefined> {
    try {
      const result = await this.dynamoDbClient.send(new GetCommand({
        TableName: process.env.FAVORITES_TABLE!,
        Key: {
          userId,
        },
      }));

      if (result.Item) {
        return result.Item as Cart;
      }
      return undefined;
    } catch (error) {
      return undefined;
    }
  }

  public removeById(userId: string): Promise<any> {
    return this.dynamoDbClient.send(new DeleteCommand({
      TableName: process.env.FAVORITES_TABLE!,
      Key: {
        userId,
      },
    }));
  }
}
