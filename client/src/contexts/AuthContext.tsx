import React, { createContext, useState, useContext, useEffect } from 'react';
import { Users } from '../types/database';

const API_BASE = import.meta.env.VITE_API_URL;


interface AuthContextType {
  user: Users | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // Add these new methods
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  resetError: () => void;
  resetSuccess: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const resetError = () => setError(null);


  const fetchUser = async () => {
  try {
    setLoading(true);
    const res = await fetch(`${API_BASE}/getCurrentUser`, {
      credentials: 'include',
      headers: {
       'Cache-Control': 'no-cache'
      },
    });
    if (!res.ok) throw new Error('Non authentifié');
    const data = await res.json();
    setUser(data);
  } catch (err) {
    setUser(null);
  } finally {
    setLoading(false);
  }
};



  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important pour cookies
        body: JSON.stringify({ email, password }),

      });


      if (!res.ok) {
        setUser(null)
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur de connexion');
      }

      // Re-fetch user data since token is now set in cookie
      await fetchUser();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur d’inscription');
      }

      // Connexion automatique après inscription
      await fetchUser();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur d’inscription';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    setError(null);
  };
  const requestPasswordReset = async (email: string) => {
    setLoading(true);
    setError(null);
    setResetSuccess(false);
    
    try {
      const res = await fetch(`${API_BASE}/forgot_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
         credentials: 'omit',
         body: JSON.stringify({ email:email }),
      });


      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to send reset email');
      }
     
      setResetSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    setResetSuccess(false);
    
    try {
      const res = await fetch(`${API_BASE}/reset_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify({token, newPassword }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Password reset failed');
      }

      setResetSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
     fetchUser();
   }, []);


  return (
    <AuthContext.Provider
      value={{
       user,
        isAuthenticated: user !== null && user.role !== 'nouveaux_utilisateur',
        isAdmin: user?.role === 'chef_de_service',
        login,
        register,
        logout,
        requestPasswordReset,
        resetPassword,
        loading,
        error,
        resetError,
        resetSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );


};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
