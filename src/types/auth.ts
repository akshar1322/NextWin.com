import { User as AuthUser } from 'next-auth';

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface AuthState {
  isLoading: boolean;
  error: string | null;
}

// Extend next-auth types
declare module 'next-auth' {
  interface User {
    firstName?: string;
    lastName?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      firstName?: string;
      lastName?: string;
    }
  }
}
