import React, { useState, useEffect } from 'react';
import { AuthContext } from './authContextInstance';

// Resolve backend API base URL from Vite environment variables
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api/v1`
    : '/api/v1');

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('apnichai_token') || null;
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
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setUser(data.user);
        } else {
          // Token invalid or expired
          localStorage.removeItem('apnichai_token');
          localStorage.removeItem('apnichai_user');
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
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      if (data.accessToken) {
        localStorage.setItem('apnichai_token', data.accessToken);
        setToken(data.accessToken);
      }

      if (data.user) {
        localStorage.setItem('apnichai_user', JSON.stringify(data.user));
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
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create account.');
      }

      if (data.accessToken) {
        localStorage.setItem('apnichai_token', data.accessToken);
        setToken(data.accessToken);
      }

      if (data.user) {
        localStorage.setItem('apnichai_user', JSON.stringify(data.user));
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
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      localStorage.removeItem('apnichai_token');
      localStorage.removeItem('apnichai_user');
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
        apiBaseUrl: API_BASE_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
