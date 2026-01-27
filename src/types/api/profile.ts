export type ProfileOrg = {
  id: number;
  name: string;
  slug?: string | null;
  description?: string | null;
  domain?: string | null;
  is_active: boolean;
  created_at?: string | null;
};

export type ProfileUser = {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  role: string;
  is_verified: boolean;
  google_id?: string | null;
  created_at?: string | null;
  last_login_at?: string | null;
  login_count: number;
};

export type ProfilePayload = {
  user: ProfileUser;
  organization?: ProfileOrg | null;
  api_key_count: number;
};