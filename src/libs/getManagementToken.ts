import fetch from 'node-fetch';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export async function getManagementToken(): Promise<TokenResponse> {
  const response = await fetch(`${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_AUDIENCE,
      grant_type: 'client_credentials',
    }),
  });

  return await response.json() as TokenResponse;
}
