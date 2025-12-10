export type UserRole = 'member' | 'agent' | 'spv' | 'manager' | 'sponsor';
export type MembershipTier = 'basic' | 'exclusive' | 'vip';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  created_at: string;
}

export interface Membership {
  id: string;
  user_id: string;
  tier: MembershipTier;
  price: number;
  duration_months: number;
  started_at: string;
  expires_at: string;
  is_active: boolean;
}

export interface Basecamp {
  id: string;
  user_id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  capacity: number;
  image_url?: string;
  created_at: string;
}

export interface Sponsor {
  id: string;
  user_id: string;
  sponsor_type: 'spu' | 'sgu';
  organization_name: string;
  certificate_url?: string;
  created_at: string;
}

export interface Commission {
  id: string;
  user_id: string;
  referred_user_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  membership_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  transaction_id: string;
  created_at: string;
}

export interface Referral {
  id: string;
  user_id: string;
  referred_by_user_id: string;
  qr_code_url: string;
  status: 'active' | 'inactive';
  created_at: string;
}
