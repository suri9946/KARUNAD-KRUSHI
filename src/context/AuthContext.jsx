import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('kk_admin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (email === 'admin@karunadkrushi.com' && password === 'admin123') {
      const adminUser = { email, role: 'super_admin', name: 'Karunad Admin' };
      localStorage.setItem('kk_admin_user', JSON.stringify(adminUser));
      setUser(adminUser);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials. Use admin@karunadkrushi.com / admin123' };
  };

  const logout = () => {
    localStorage.removeItem('kk_admin_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
