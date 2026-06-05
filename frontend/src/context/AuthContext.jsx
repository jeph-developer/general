import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/users/login', { UserName: username, Password: password });
    setUser(res.data.user);
    return res.data;
  };

  const register = async (username, password) => {
    const res = await api.post('/users/register', { UserName: username, Password: password });
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await api.post('/users/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
