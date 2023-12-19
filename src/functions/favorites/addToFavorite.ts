import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import Ajv from 'ajv';
import { getUserInfo } from '../../libs/getUserInfo';
import { Favorite, FavoriteItem } from '../../models/Favorite';
import FavoritesRepository from '../../repository/FavoritesRepository';

const favoriteSchema = {

  type: 'object',
  properties: {
    itemId: { type: 'string' },
    size: {
      type: 'string',
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
  },
  required: ['itemId', 'size'],
  additionalProperties: false,
};

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
    const validate = ajv.compile(favoriteSchema);
    const body = JSON.parse(event.body) as FavoriteItem;
    const userInfo = await getUserInfo(authorization);
    const favoritesRepository = new FavoritesRepository();

    if (!validate(body)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid favorite items',
          errors: validate.errors,
        }),
      };
    }

    const currentFavorite: Favorite | undefined = await favoritesRepository.getById(userInfo?.sub!);

    let favoriteItems: FavoriteItem[] = [];

    if (currentFavorite) {
      if (currentFavorite.items.find((item) => item.itemId === body.itemId && item.size === body.size) !== undefined) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: 'Item already in favorite',
          }),
        };
      }
      favoriteItems = [
        ...currentFavorite!.items,
        body,
      ];
    } else {
      favoriteItems = [
        body,
      ];
    }

    const favorite: Favorite = {
      userId: userInfo?.sub!,
      items: favoriteItems,
    };

    if (favorite.items.length <= 0) {
      await favoritesRepository.removeById(userInfo?.sub!);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Favorite emptied',
        }),
      };
    }

    await favoritesRepository.addOrUpdateFavorite(favorite);

    if (!validate(body)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid favorite items',
          errors: validate.errors,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'items added to favorite',
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error,
        message: 'Error adding to favorite',
      }),
    };
  }
}
