import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import Ajv from 'ajv';
import { Cart, CartItem } from '../../models/Cart';
import ProductsRepository from '../../repository/ProductsRepository';
import CartsRepository from '../../repository/CartsRepository';
import { getUserInfo } from '../../libs/getUserInfo';

const cartSchema = {

  type: 'object',
  properties: {
    itemId: { type: 'string' },
    quantity: { type: 'integer', minimum: 0 },
    size: {
      type: 'string',
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
  },
  required: ['itemId', 'quantity', 'size'],
  additionalProperties: false,
};

const getCartTotalPrice = async (cartItems: CartItem[]) => {
  const productsRepository = new ProductsRepository();

  const price = await Promise.all(
    cartItems.map(async (item) => {
      const product = await productsRepository.getProduct(item.itemId);

      return product!.price * item.quantity;
    }),
  );
  return price.reduce((a, b) => a + b, 0);
};

async function verifyStock(cartItems: CartItem) {
  const productsRepository = new ProductsRepository();

  const product = await productsRepository.getProduct(cartItems.itemId);

  return !(product && product.stock[cartItems.size] < cartItems.quantity);
}

export default async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const ajv = new Ajv();
  const authorization = event.headers?.authorization;

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing body',
      }),
    };
  }

  if (!authorization) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing authorization header',
      }),
    };
  }
  try {
    const validate = ajv.compile(cartSchema);
    const body = JSON.parse(event.body) as CartItem;
    const userInfo = await getUserInfo(authorization);
    const cartsRepository = new CartsRepository();

    const currentCart: Cart | undefined = await cartsRepository.getById(userInfo?.sub!);

    let newCartItems: CartItem[] = [];

    if (currentCart) {
      if (currentCart.items.find((item) => item.itemId === body.itemId && item.size === body.size) !== undefined) {
        newCartItems = currentCart.items.map((item) => {
          if (item.itemId === body.itemId && item.size === body.size) {
            return {
              ...item,
              quantity: body.quantity,
            };
          }
          return item;
        });
      } else {
        newCartItems = [
          ...currentCart.items,
          body,
        ];
      }
    } else {
      newCartItems = [
        body,
      ];
    }

    newCartItems = newCartItems.filter((item) => item.quantity > 0);

    const newCart: Cart = {
      userId: userInfo?.sub!,
      items: newCartItems,
      totalAmount: await getCartTotalPrice(newCartItems),
    };

    if (newCart.items.length <= 0) {
      await cartsRepository.removeById(userInfo?.sub!);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Cart emptied',
        }),
      };
    }

    await cartsRepository.addOrUpdateCart(newCart);

    if (!validate(body)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid cart items',
          errors: validate.errors,
        }),
      };
    }

    if (!(await verifyStock(body))) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Product out of stock in this size',
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'items added to cart',
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error adding to cart',
      }),
    };
  }
}
