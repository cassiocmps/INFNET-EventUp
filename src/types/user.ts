export type UserRole = "organizer" | "participant";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  favorites: string[];
  registrations: string[];
}

export interface Role {
  id: UserRole;
  label: string;
}
