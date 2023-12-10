import { UserProfile } from '../models/Profile';

export default class ProfilesRepository {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  public async getProfile(id: string): Promise<UserProfile | undefined> {
    const response = await fetch(`${process.env.AUTH0_DOMAIN}/api/v2/users/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    return await response.json() as UserProfile;
  }

  public async updateProfile(userId: string, userData: Partial<UserProfile>): Promise<string> {
    const response = await fetch(`${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...userData,
      }),
    });

    return await response.json() as any;
  }
}
