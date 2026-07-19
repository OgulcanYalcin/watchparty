import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { getMyProfile } from '../services/users';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('accessToken'),
  );
  const [checking, setChecking] = useState<boolean>(
    () => !!localStorage.getItem('accessToken'),
  );

  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
  };

  useEffect(() => {
    if (!token) return;
    getMyProfile()
      .then(() => setChecking(false))
      .catch(() => {
        logout();
        setChecking(false);
      });
  }, []);

  const setAuth = (newToken: string) => {
    localStorage.setItem('accessToken', newToken);
    setToken(newToken);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <p className="text-light/60">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}