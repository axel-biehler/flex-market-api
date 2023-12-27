/* eslint-disable no-template-curly-in-string */
export default {
  FlexMarketTableOrders: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      TableName: 'flex-market-orders-${self:provider.stage}',
      KeySchema: [
        { AttributeName: 'orderId', KeyType: 'HASH' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: '${self:custom.table_throughput}',
        WriteCapacityUnits: '${self:custom.table_throughput}',
      },
      AttributeDefinitions: [
        { AttributeName: 'orderId', AttributeType: 'S' },
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
