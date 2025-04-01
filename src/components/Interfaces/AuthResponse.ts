export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
}
