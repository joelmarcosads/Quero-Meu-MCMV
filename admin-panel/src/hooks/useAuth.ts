import { createContext, useContext } from 'react';
import type { Usuario } from '../types';

export interface AuthContextValue {
  user: Usuario | null;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  error: null,
});

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
