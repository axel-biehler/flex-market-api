import jwt, { JwtPayload } from 'jsonwebtoken';
import * as process from 'process';

export default async function getUserInfo(bearer: string): Promise<jwt.JwtPayload | undefined> {
  console.log(bearer);
  const token = bearer.replace('Bearer ', '');
  console.log(process.env.ISSUER, process.env.AUDIENCE);

  try {
    const decoded = jwt.decode(token) as JwtPayload;

    return {
      decoded,
    };
  } catch (error) {
    console.error(error);
    return {
      undefined,
    };
  }
}
