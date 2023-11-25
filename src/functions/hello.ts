import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import getUserInfo from '../libs/getUserInfo';

export default async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  console.log('event', event);
  const user = await getUserInfo(event.headers.authorization!);
  console.log(JSON.stringify(user, null, 2));
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello World',
    }),
  };
}
