import { handlerPath } from '../../libs/handler-resolver';

const getProfile = {
  handler: `${handlerPath(__dirname)}/handler.getProfile`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/me',
        authorizer: {
          name: 'jwtAuthorizer',
        },
      },
    },
  ],
};

const updateProfile = {
  handler: `${handlerPath(__dirname)}/handler.updateProfile`,
  events: [
    {
      httpApi: {
        method: 'patch',
        path: '/me',
        authorizer: {
          name: 'jwtAuthorizer',
        },
      },
    },
  ],
};

const changeProfilePicture = {
  handler: `${handlerPath(__dirname)}/handler.changeProfilePicture`,
  events: [
    {
      httpApi: {
        method: 'post',
        path: '/me',
        authorizer: {
          name: 'jwtAuthorizer',
        },
      },
    },
  ],
};

export { getProfile, updateProfile, changeProfilePicture };
