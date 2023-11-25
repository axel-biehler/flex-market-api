import { Product } from './Product';

export interface Cart {
  id: string;
  userId: string;
  items: {
    product: Product;
    quantity: number;
  }[];
}
