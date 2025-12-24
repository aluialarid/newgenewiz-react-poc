import { useState, useEffect, useCallback } from 'react';
import { authService, clearTokenCache } from '../services/api';
import type { LoginRequest, UserInfoResponse } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState<UserInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for valid session on mount
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const userInfo = await authService.me();
        setUser(userInfo);
        setError(null);
      } catch {
        // No valid session
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void checkSession();
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.login(credentials);
      // Fetch user info after successful login
      const userInfo = await authService.me();
      setUser(userInfo);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Log the error but continue with cleanup
      console.error('Logout error:', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      clearTokenCache();
      setUser(null);
      setError(null);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout
  };
};

