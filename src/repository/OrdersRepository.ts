import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Order } from '../models/Order';

export default class OrdersRepository {
  private dynamoDbClient: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({ region: process.env.REGION });
    this.dynamoDbClient = DynamoDBDocumentClient.from(client);
  }

  public async createOrder(product: Order): Promise<any> {
    try {
      await this.dynamoDbClient.send(new PutCommand({
        TableName: process.env.ORDERS_TABLE,
        Item: product,
      }));
    } catch (error) {
      console.error(error);
      throw new Error('Error creating order');
    }
  }

  public async getOrder(orderId: string): Promise<Order | undefined> {
    try {
      const result = await this.dynamoDbClient.send(new GetCommand({
        TableName: process.env.ORDERS_TABLE,
        Key: { orderId },
      }));

      return result.Item as Order;
    } catch (error) {
      throw new Error('Error getting product');
    }
  }

  public async getOrders(): Promise<Order[]> {
    try {
      const result = await this.dynamoDbClient.send(new ScanCommand({
        TableName: process.env.ORDERS_TABLE,
      }));

      return result.Items as Order[];
    } catch (error) {
      throw new Error('Error getting products');
    }
  }

  public async updateOrderStatus(orderId: string, status: string): Promise<void> {
    try {
      await this.dynamoDbClient.send(new UpdateCommand({
        TableName: process.env.ORDERS_TABLE!,
        Key: {
          orderId,
        },
        UpdateExpression: 'set #st = :status',
        ExpressionAttributeNames: {
          '#st': 'status',
        },
        ExpressionAttributeValues: {
          ':status': status,
        },
      }));

      console.log('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      throw new Error('Error updating order');
    }
  }
}
