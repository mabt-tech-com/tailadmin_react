export type AuthUser = {
  id: number;
  organization_id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  role?: string;
  is_verified?: boolean;
};

export type AuthOrganization = {
  id: number;
  name: string;
  slug: string;
};

export type LoginRequest = {
  organization: string; // slug
  email: string;
  password: string;
  remember_me?: boolean;
};

export type LoginResponse =
  | { success: true; redirect?: string; user?: AuthUser; organization?: AuthOrganization }
  | { success: false; error: string };

export type RegisterRequest = {
  organization: string; // org name
  organization_slug: string; // org slug
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  terms: boolean;
};

export type RegisterResponse =
  | { success: true; redirect?: string }
  | { success: false; error: string };

export type GoogleLoginRequest = {
  credential: string;
  organization: string; // slug
};

export type GoogleRegisterRequest = {
  credential: string;
  organization: string; // slug
  organization_name: string; // name
};

export type LogoutResponse =
  | { success: true; redirect?: string }
  | { success: false; error: string };