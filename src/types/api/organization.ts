export type OrgInfo = {
  id: number;
  name: string;
  slug?: string | null;
  description?: string | null;
  domain?: string | null;
  is_active: boolean;
  created_at?: string | null;
};

export type OrgUserItem = {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  role: string;
  is_verified: boolean;
  google_id?: string | null;
  is_active: boolean;
};

export type OrgUsage = {
  active_assistants: number;
  total_calls: number;
  success_rate: number;
  api_key_count: number;
};

export type OrgStats = {
  total_members: number;
  admins: number;
  verified: number;
};

export type OrganizationPayload = {
  organization?: OrgInfo | null;
  org_users: OrgUserItem[];
  usage: OrgUsage;
  member_stats: OrgStats;
};