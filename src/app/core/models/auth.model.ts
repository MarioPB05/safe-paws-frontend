export interface AuthResponse {
  token: string;
}

export interface AuthVerifyResponse {
  valid: boolean;
  expiresAt: string;
}
