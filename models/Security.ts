export interface Security {
    security_id: string; // UUID
    user_id: string; // Foreign Key, UUID
    duo_auth_id: string; // Duo's user identifier or 2FA tokens
  }