import { handlerPath } from '../../libs/handler-resolver';

const addToCart = {
  handler: `${handlerPath(__dirname)}/handler.addToCart`,
  events: [
    {
      httpApi: {
        method: 'post',
        path: '/favorites',
        authorizer: {
          name: 'jwtAuthorizer',
        },
      },
    },
  ],
};

const emptyCart = {
  handler: `${handlerPath(__dirname)}/handler.emptyCart`,
  events: [
    {
      httpApi: {
        method: 'delete',
        path: '/favorites',
        authorizer: {
          name: 'jwtAuthorizer',
        },
      },
    },
  ],
};

const removeFromFavorite = {
  handler: `${handlerPath(__dirname)}/handler.emptyCart`,
  events: [
    {
      httpApi: {
        method: 'patch',
        path: '/favorites',
        authorizer: {
          name: 'jwtAuthorizer',
        },
      },
    },
  ],
};

const getFavoriteById = {
  handler: `${handlerPath(__dirname)}/handler.getFavoriteById`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/favorites',
        authorizer: {
          name: 'jwtAuthorizer',
        },
      },
    },
  ],
};

export {
  addToCart,
  emptyCart,
  removeFromFavorite,
  getFavoriteById,
};
