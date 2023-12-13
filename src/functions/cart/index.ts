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

export {
  addToCart,
};
