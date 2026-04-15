export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface AccountListing {
  id: string;
  game: string;
  region: string;
  level: number;
  rank: string;
  skins: number;
  agents: string;
  email_changeable: boolean;
  price: number;
  negotiable: boolean;
  description: string;
  image_url?: string | null;
  seller_name: string;
  created_at: string;
}

export interface Trade {
  id: string;
  account_id: string;
  account_rank: string;
  account_level: number;
  account_skins: number;
  region: string;
  price: number;
  platform_fee: number;
  total_amount: number;
  status: "pending_payment" | "payment_secured" | "awaiting_details" | "verify_access" | "completed" | "cancelled" | "disputed";
  created_at: string;
  type: "buy" | "sell";
  account_email: string;
  account_password: string;
  security_code: string;
  buyer_name?: string;
  seller_name?: string;
}

export interface CreateListingInput {
  region: string;
  level: number;
  rank: string;
  skins: number;
  agents: string;
  emailChangeable: boolean;
  price: number;
  negotiable: boolean;
  description: string;
  deliveryEmail: string;
  deliveryPassword: string;
  deliveryCode?: string;
}
