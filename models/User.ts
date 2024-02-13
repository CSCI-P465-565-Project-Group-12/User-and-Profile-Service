export interface User {
    email: string;
    password: string; // This will be hashed
    role: "Admin" | "Venue Owner" | "Regular User";
    is_verified: boolean;
  }