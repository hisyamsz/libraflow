import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface UserExtended extends User {
  accessToken?: string;
  role?: string;
  nis?: string;
  phone?: string | null;
  class?: string | null;
}

export interface AuthState {
  user: UserExtended | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  setUser: (user: UserExtended | null) => void;
  clearAuth: () => void;
}

export interface SessionExtended extends Session {
  accessToken?: string;
}

export interface JWTExtended extends JWT {
  user?: UserExtended;
}
