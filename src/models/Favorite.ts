import { ItemSize } from './Product';

export interface FavoriteItem {
  itemId: string;
  size: ItemSize;
}

export interface Favorite {
  userId: string;
  items: FavoriteItem[];
}
