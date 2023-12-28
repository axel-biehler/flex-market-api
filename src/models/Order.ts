import { ItemSize } from './Product';

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  SENT = 'SENT',
}

export interface Order {
  orderId: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: Date;
  status: string;
  shippingAddress: string;
}

export interface OrderItem {
  itemId: string;
  quantity: number;
  size: ItemSize;
  price: number;
}
