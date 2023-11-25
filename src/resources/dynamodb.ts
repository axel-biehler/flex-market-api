/* eslint-disable no-template-curly-in-string */
export default {
  FlexMarketTable: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      TableName: 'flex-market-products-${self:provider.stage}',
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: '${self:custom.table_throughput}',
        WriteCapacityUnits: '${self:custom.table_throughput}',
      },
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
      ],
      SSESpecification: {
        SSEEnabled: true,
      },
      TimeToLiveSpecification: {
        AttributeName: 'ttl',
        Enabled: true,
      },
    },
  },
};
