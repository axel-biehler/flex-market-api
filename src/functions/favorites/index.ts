import { handlerPath } from '../../libs/handler-resolver';

const addToFavorite = {
  handler: `${handlerPath(__dirname)}/handler.addToFavorite`,
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

const emptyFavorite = {
  handler: `${handlerPath(__dirname)}/handler.emptyFavorite`,
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
  handler: `${handlerPath(__dirname)}/handler.removeFromFavorite`,
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
  addToFavorite,
  emptyFavorite,
  removeFromFavorite,
  getFavoriteById,
};
