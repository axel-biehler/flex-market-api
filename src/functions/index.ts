import { handlerPath } from '../libs/handler-resolver';

const hello = {
  handler: `${handlerPath(__dirname)}/handler.hello`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/hello',
        authorizer: {
          name: 'jwtAuthorizer',
          scopes: ['read:products'],
        },
      },
    },
  ],
};

export { hello };
