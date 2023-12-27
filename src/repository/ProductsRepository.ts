import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  BatchGetCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { InputSearchProducts, Product } from '../models/Product';

export default class ProductsRepository {
  private dynamoDbClient: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({ region: process.env.REGION });
    this.dynamoDbClient = DynamoDBDocumentClient.from(client);
  }

  public async createProduct(product: Product): Promise<any> {
    const item: Product = {
      ...product,
      searchName: product.name.toLowerCase(),
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
          ':searchName': product.name.toLowerCase(),
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

  public async searchProducts(filter: InputSearchProducts): Promise<Product[]> {
    const params: any = {
      TableName: process.env.PRODUCTS_TABLE,
    };

    const filterExpressions: string[] = [];
    const expressionAttributeValues: { [key: string]: any } = {};
    const expressionAttributeNames: { [key: string]: any } = {};

    if (filter.gender) {
      filterExpressions.push('gender = :gender');
      expressionAttributeValues[':gender'] = filter.gender;
    }

    if (filter.name) {
      // Use placeholders for the attribute names
      const searchNamePlaceholder = '#searchName';

      // Adjust the filter expression to use the 'searchName' field
      filterExpressions.push(`contains (${searchNamePlaceholder}, :name)`);
      expressionAttributeValues[':name'] = filter.name.toLowerCase(); // Assuming you want to keep the case-insensitive search

      if (!params.ExpressionAttributeNames) {
        params.ExpressionAttributeNames = {};
      }
      params.ExpressionAttributeNames[searchNamePlaceholder] = 'searchName';
    }

    if (filter.category && filter.category.length > 0) {
      // Initialize an array to hold the individual category filter expressions
      const categoryFilterExpressions: string[] = [];

      // Iterate over the categories and construct individual filter expressions
      filter.category.forEach((cat, index) => {
        const key = `:category${index}`;
        categoryFilterExpressions.push(`contains (category, ${key})`);
        expressionAttributeValues[key] = cat;
      });

      // Join the individual category filter expressions with 'OR'
      if (categoryFilterExpressions.length > 0) {
        const categoryFilterString = categoryFilterExpressions.join(' OR ');
        // Enclose the OR conditions in parentheses to ensure proper precedence
        filterExpressions.push(`(${categoryFilterString})`);
      }
    }

    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(' AND '); // for ScanCommand or KeyConditionExpression for QueryCommand
      params.ExpressionAttributeValues = expressionAttributeValues;

      if (Object.keys(expressionAttributeNames).length > 0) {
        params.ExpressionAttributeNames = expressionAttributeNames;
      }
    }

    const command = new ScanCommand(params);

    try {
      const results = await this.dynamoDbClient.send(command);
      console.log('Items found:', results.Items);
      return results.Items as Product[];
    } catch (error) {
      console.error('Error searching items:', error);
      throw new Error('Failed to search products');
    }
  }

  public async getProductsByUUIDs(uuids: string[]): Promise<Product[]> {
    // Define the keys for the items you want to get
    const keys = uuids.map((uuid) => ({
      id: uuid, // 'id' should be the name of your primary key attribute
    }));

    const params = {
      RequestItems: {
        [process.env.PRODUCTS_TABLE!]: { // Replace with your table name
          Keys: keys,
        },
      },
    };

    try {
      const data = await this.dynamoDbClient.send(new BatchGetCommand(params));
      // Assuming 'YourTableName' is the actual name of your DynamoDB table
      const items = data.Responses ? data.Responses[process.env.PRODUCTS_TABLE!] : [];
      console.log('Retrieved items:', items);
      return items as Product[];
    } catch (error) {
      console.error('Error retrieving items by UUIDs:', error);
      throw new Error('Failed to retrieve products by UUIDs');
    }
  }
}
