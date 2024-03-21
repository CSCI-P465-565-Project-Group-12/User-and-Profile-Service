export interface Profile {
    profile_id: string; // UUID
    user_id: string; // Foreign Key, UUID
    first_name: string;
    last_name: string;
    contact_number: string;
    bio?: string; // Nullable
    address?: string; // Nullable
  }

export interface UpdateProfileParams {
    first_name?: string;
    last_name?: string;
    contact_number?: string;
    bio?: string;
    address?: string;
  }