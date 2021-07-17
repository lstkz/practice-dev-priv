export interface User {
  id: string;
  email: string;
  username: string;
  isAdmin?: boolean | null;
  isVerified: boolean;
}

export interface AuthData {
  user: User;
  token: string;
}