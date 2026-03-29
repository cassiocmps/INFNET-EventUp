import type { User } from "./user";

export interface AuthContextValue {
  currentUser: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  toggleFavorite: (eventId: string) => Promise<void>;
  isFavorite: (eventId: string) => boolean;
  registerForEvent: (eventId: string) => Promise<void>;
  unregisterFromEvent: (eventId: string) => Promise<void>;
  isRegistered: (eventId: string) => boolean;
  favorites: string[];
  registrations: string[];
  isOrganizer: boolean;
  isParticipant: boolean;
}
