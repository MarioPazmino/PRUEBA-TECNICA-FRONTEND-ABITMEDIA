export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  data: {
    username: string;
    token: string;
    expiresIn: number;
  };
  message: string;
}
