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

const getRoles = {
  handler: `${handlerPath(__dirname)}/handler.getRoles`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/me/roles',
        authorizer: {
          name: 'jwtAuthorizer',
        },
      },
    },
  ],
};

const deleteUser = {
  handler: `${handlerPath(__dirname)}/handler.deleteUser`,
  events: [
    {
      httpApi: {
        method: 'delete',
        path: '/me',
        authorizer: {
          name: 'jwtAuthorizer',
        },
      },
    },
  ],
};

export {
  getProfile, updateProfile, changeProfilePicture, getRoles, deleteUser,
};
