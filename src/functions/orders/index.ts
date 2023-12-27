import { handlerPath } from '../../libs/handler-resolver';

const addOrder = {
  handler: `${handlerPath(__dirname)}/handler.addOrder`,
  events: [
    {
      httpApi: {
        method: 'post',
        path: '/orders',
        authorizer: {
          name: 'jwtAuthorizer',
        },
      },
    },
  ],
};

const getOrdersAdmin = {
  handler: `${handlerPath(__dirname)}/handler.getOrdersAdmin`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/orders/admin',
        authorizer: {
          name: 'jwtAuthorizer',
          scopes: ['admin'],
        },
      },
    },
  ],
};

const getOrders = {
  handler: `${handlerPath(__dirname)}/handler.getOrders`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/orders',
        authorizer: {
          name: 'jwtAuthorizer',
        },
      },
    },
  ],
};

const changeStateOrder = {
  handler: `${handlerPath(__dirname)}/handler.changeStateOrder`,
  events: [
    {
      httpApi: {
        method: 'patch',
        path: '/orders',
        authorizer: {
          name: 'jwtAuthorizer',
        },
      },
    },
  ],
};

export {
  addOrder,
  getOrdersAdmin,
  getOrders,
  changeStateOrder,
};
