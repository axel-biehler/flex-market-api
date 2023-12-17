import { handlerPath } from '../../libs/handler-resolver';

const addToCart = {
  handler: `${handlerPath(__dirname)}/handler.addToCart`,
  events: [
    {
      httpApi: {
        method: 'post',
        path: '/carts',
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
        path: '/carts',
        authorizer: {
          name: 'jwtAuthorizer',
        },
      },
    },
  ],
};

const getCartById = {
  handler: `${handlerPath(__dirname)}/handler.getCartById`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/carts',
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
  getCartById,
};
