import jwt, { JwtPayload } from 'jsonwebtoken';

export async function getUserInfo(bearer: string): Promise<jwt.JwtPayload | undefined> {
  const token = bearer.replace('Bearer ', '');

  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
