import React, { useState, useEffect } from 'react';
import { AuthContext } from './authContextInstance';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('chaiva_token') || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Validate session on mount if token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/v1/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setUser(data.user);
        } else {
          // Token invalid or expired
          localStorage.removeItem('chaiva_token');
          localStorage.removeItem('chaiva_user');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.warn('Auth verification network error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  // Login action
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      if (data.accessToken) {
        localStorage.setItem('chaiva_token', data.accessToken);
        setToken(data.accessToken);
      }

      if (data.user) {
        localStorage.setItem('chaiva_user', JSON.stringify(data.user));
        setUser(data.user);
      }

      return { success: true, user: data.user, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Register action
  const register = async (name, email, phone, password) => {
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create account.');
      }

      if (data.accessToken) {
        localStorage.setItem('chaiva_token', data.accessToken);
        setToken(data.accessToken);
      }

      if (data.user) {
        localStorage.setItem('chaiva_user', JSON.stringify(data.user));
        setUser(data.user);
      }

      return { success: true, user: data.user, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Logout action
  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      localStorage.removeItem('chaiva_token');
      localStorage.removeItem('chaiva_user');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
