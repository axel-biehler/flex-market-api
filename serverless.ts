import type { AWS } from '@serverless/typescript';

import { products } from './src/functions';
import resources from './src/resources';

const serverlessConfiguration: AWS = {
  useDotenv: true,
  service: 'flex-market-api',
  frameworkVersion: '3',
  package: {
    individually: true,
  },
  plugins: ['serverless-esbuild', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: 'eu-west-3',
    stage: '${self:custom.stage}',
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:PutItem',
              'dynamodb:GetItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:Scan',
              'dynamodb:BatchWriteItem',
              'dynamodb:BatchGetItem',
              'dynamodb:Query',
            ],
            Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/flex-market-products-${self:provider.stage}',
          },
        ],
      },
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      REGION: '${self:custom.region}',
      STAGE: '${self:custom.stage}',
    },
    httpApi: {
      cors: true,
      authorizers: {
        jwtAuthorizer: {
          type: 'jwt',
          name: 'jwtAuthorizer',
          identitySource: '$request.header.Authorization',
          audience: ['https://api.flex-market.abiehler.com'],
          issuerUrl: 'https://dev-v0o6dpfxq5so8mnl.us.auth0.com/',
        },
      },
    },
  },
  custom: {
    region: 'eu-west-3',
    stage: 'dev',
    table_throughputs: {
      prod: 3,
      default: 1,
    },
    table_throughput: '${self:custom.TABLE_THROUGHPUTS.${self:custom.stage}, self:custom.table_throughputs.default}',
    prefix: '${self:service}-${self:custom.stage}',
  },
  resources: {
    Resources: {
      ...resources,
    },
  },

  functions: {
    ...products,
  },
};

module.exports = serverlessConfiguration;
