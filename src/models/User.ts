import { UserRole } from "@prisma/client";

export interface User {
    id: string; // UUID
    email: string;
    username: string;
    password: string; // This will be hashed
    role: UserRole;
    is_verified: boolean;
  }

export interface UpdateUserParams {
    email?: string;
    password?: string;
    is_verified?: boolean;
    role?: UserRole;
  }