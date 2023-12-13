export enum ItemSize {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export enum ItemGender {
  MEN = 'MEN',
  WOMEN = 'WOMEN',
  UNISEX = 'UNISEX',
}

export enum Category {
  TOPS = 'TOPS',
  BOTTOMS = 'BOTTOMS',
  DRESSES = 'DRESSES',
  OUTERWEAR = 'OUTERWEAR',
  UNDERWEAR = 'UNDERWEAR',
  FOOTWEAR = 'FOOTWEAR',
  ACCESSORIES = 'ACCESSORIES',
  ATHLETIC = 'ATHLETIC',
  SLEEPWEAR = 'SLEEPWEAR',
  SWIMWEAR = 'SWIMWEAR',
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  specs: { [key: string]: string };
  stock: { [key: string]: number };
  imagesUrl: string[];
  gender: ItemGender,
  createdAt: string;
  category: Category;
}
