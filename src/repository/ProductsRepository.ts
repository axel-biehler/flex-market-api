import { nanoid } from 'nanoid';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Product } from '../models/Product';

export default class ProductsRepository {
  private dynamodb: DocumentClient = new DocumentClient({ region: process.env.REGION! });

  public async createProduct(product: Product): Promise<any> {
    const item: Product = {
      id: nanoid(),
      description: product.description,
      imageUrls: product.imageUrls,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      createdAt: new Date().toISOString(),
    };

    try {
      await this.dynamodb.put({
        TableName: process.env.PRODUCTS_TABLE!,
        Item: item,
      }).promise();
    } catch (error) {
      console.error(error);
      throw new Error('Error creating product');
    }
  }

  public async getProduct(id: string): Promise<Product | undefined> {
    try {
      const result = await this.dynamodb.get({
        TableName: process.env.PRODUCTS_TABLE!,
        Key: {
          id,
        },
      }).promise();

      return result.Item as Product;
    } catch (error) {
      throw new Error('Error getting product');
    }
  }

  public async updateProduct(id: string, product: Product): Promise<void> {
    try {
      await this.dynamodb.update({
        TableName: process.env.PRODUCTS_TABLE!,
        Key: {
          id,
        },
        UpdateExpression: 'set #name = :name, price = :price, description = :description, quantity = :quantity, imageUrls = :imageUrls',
        ExpressionAttributeNames: {
          '#name': 'name',
        },
        ExpressionAttributeValues: {
          ':name': product.name,
          ':price': product.price,
          ':description': product.description,
          ':quantity': product.quantity,
          ':imageUrls': product.imageUrls,
        },
      }).promise();
    } catch (error) {
      throw new Error('Error updating product');
    }
  }

  public async deleteProduct(id: string): Promise<void> {
    try {
      await this.dynamodb.delete({
        TableName: process.env.PRODUCTS_TABLE!,
        Key: {
          id,
        },
      }).promise();
    } catch (error) {
      throw new Error('Error deleting product');
    }
  }

  public async getProducts(): Promise<Product[]> {
    try {
      const result = await this.dynamodb.scan({
        TableName: process.env.PRODUCTS_TABLE!,
      }).promise();

      return result.Items as Product[];
    } catch (error) {
      throw new Error('Error getting products');
    }
  }
}
