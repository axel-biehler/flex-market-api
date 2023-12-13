import { ItemSize } from './Product';

export interface CartItem {
  itemId: string;
  quantity: number;
  size: ItemSize;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  totalAmount: number;
}
