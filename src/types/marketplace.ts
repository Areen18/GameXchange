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
  status: "pending_payment" | "payment_reported" | "credentials_shared" | "completed" | "cancelled";
  created_at: string;
  type: "buy" | "sell";
  
  // Manual payment fields
  payment_qr_code?: string;
  payment_upi_id?: string;
  payment_instructions?: string;
  payment_reported_at?: string;
  
  // Credentials
  riot_id?: string;
  riot_password?: string;
  credentials_submitted_at?: string;
  
  // For seller view
  has_payment_info?: boolean;
  has_credentials?: boolean;
  
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
  paymentQrCode?: string;
  paymentUpiId?: string;
  paymentInstructions?: string;
}
