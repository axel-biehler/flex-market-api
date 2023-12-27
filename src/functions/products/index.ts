import { handlerPath } from '../../libs/handler-resolver';

const addProduct = {
  handler: `${handlerPath(__dirname)}/handler.addProduct`,
  events: [
    {
      httpApi: {
        method: 'post',
        path: '/products',
        authorizer: {
          name: 'jwtAuthorizer',
          scopes: ['admin'],
        },
      },
    },
  ],
};

const deleteProduct = {
  handler: `${handlerPath(__dirname)}/handler.deleteProduct`,
  events: [
    {
      httpApi: {
        method: 'delete',
        path: '/products/{id}',
        authorizer: {
          name: 'jwtAuthorizer',
          scopes: ['admin'],
        },
      },
    },
  ],
};

const updateProduct = {
  handler: `${handlerPath(__dirname)}/handler.updateProduct`,
  events: [
    {
      httpApi: {
        method: 'patch',
        path: '/products/{id}',
        authorizer: {
          name: 'jwtAuthorizer',
          scopes: ['admin'],
        },
      },
    },
  ],
};

const getProductById = {
  handler: `${handlerPath(__dirname)}/handler.getProductById`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/products/{id}',
        authorizer: {
          name: 'jwtAuthorizer',
        },
      },
    },
  ],
};

const getProducts = {
  handler: `${handlerPath(__dirname)}/handler.getProducts`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/products',
        authorizer: {
          name: 'jwtAuthorizer',
        },
      },
    },
  ],
};

const searchProducts = {
  handler: `${handlerPath(__dirname)}/handler.searchProducts`,
  events: [
    {
      httpApi: {
        method: 'post',
        path: '/products/search',
        authorizer: {
          name: 'jwtAuthorizer',
        },
      },
    },
  ],
};

export {
  addProduct,
  deleteProduct,
  updateProduct,
  getProductById,
  getProducts,
  searchProducts,
};
