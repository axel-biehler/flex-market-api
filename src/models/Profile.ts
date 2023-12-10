interface Identity {
  connection: string;
  user_id: string;
  provider: string;
  isSocial: boolean;
  access_token?: string;
  access_token_secret?: string;
  refresh_token?: string;
  profileData: {
    email: string;
    email_verified: boolean;
    name: string;
    username: string;
    given_name: string;
    phone_number: string;
    phone_verified: boolean;
    family_name: string;
  };
}

export interface UserProfile {
  user_id: string;
  email: string;
  email_verified: boolean;
  username: string;
  phone_number: string;
  phone_verified: boolean;
  created_at: string | Date; // Assuming ISO_8601 format will be parsed into Date object
  updated_at: string | Date; // Same assumption as above
  identities: Identity[];
  app_metadata: any; // More specific type can be defined based on the metadata structure
  user_metadata: any; // Same as above
  picture: string;
  name: string;
  nickname: string;
  multifactor: string[];
  last_ip: string;
  last_login: string | Date; // Same assumption as above
  logins_count: number;
  blocked: boolean;
  given_name: string;
  family_name: string;
}
