import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { Product } from '../models/Product';

export default class ProductsRepository {
  private dynamoDbClient: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({ region: process.env.REGION });
    this.dynamoDbClient = DynamoDBDocumentClient.from(client);
  }

  public async createProduct(product: Product): Promise<any> {
    const item: Product = {
      ...product,
      createdAt: new Date().toISOString(),
    };

    try {
      await this.dynamoDbClient.send(new PutCommand({
        TableName: process.env.PRODUCTS_TABLE,
        Item: item,
      }));
    } catch (error) {
      console.error(error);
      throw new Error('Error creating product');
    }
  }

  public async getProduct(id: string): Promise<Product | undefined> {
    try {
      const result = await this.dynamoDbClient.send(new GetCommand({
        TableName: process.env.PRODUCTS_TABLE,
        Key: { id },
      }));

      return result.Item as Product;
    } catch (error) {
      throw new Error('Error getting product');
    }
  }

  public async updateProduct(id: string, product: Product): Promise<void> {
    try {
      await this.dynamoDbClient.send(new UpdateCommand({
        TableName: process.env.PRODUCTS_TABLE,
        Key: { id },
        UpdateExpression: 'set #name = :name, price = :price, description = :description, specs = :specs, '
            + 'stock = :stock, imagesUrl = :imagesUrl, gender = :gender, createdAt = :createdAt, category = :category',
        ExpressionAttributeNames: {
          '#name': 'name',
        },
        ExpressionAttributeValues: {
          ':name': product.name,
          ':price': product.price,
          ':description': product.description,
          ':specs': product.specs,
          ':stock': product.stock,
          ':imagesUrl': product.imagesUrl,
          ':gender': product.gender,
          ':createdAt': product.createdAt,
          ':category': product.category,
        },
      }));
    } catch (error) {
      throw new Error('Error updating product');
    }
  }

  public async deleteProduct(id: string): Promise<void> {
    try {
      await this.dynamoDbClient.send(new DeleteCommand({
        TableName: process.env.PRODUCTS_TABLE,
        Key: { id },
      }));
    } catch (error) {
      throw new Error('Error deleting product');
    }
  }

  public async getProducts(): Promise<Product[]> {
    try {
      const result = await this.dynamoDbClient.send(new ScanCommand({
        TableName: process.env.PRODUCTS_TABLE,
      }));

      return result.Items as Product[];
    } catch (error) {
      throw new Error('Error getting products');
    }
  }
}
