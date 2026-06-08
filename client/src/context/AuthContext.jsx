import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile, login as loginRequest, register as registerRequest } from '../services/authService.js';
import { setAuthToken } from '../services/api.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'task-manager-auth';

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { user: null, token: null };
  });
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    setAuthToken(auth.token);

    if (auth.token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  useEffect(() => {
    const refreshProfile = async () => {
      if (!auth.token) {
        setBootstrapping(false);
        return;
      }

      try {
        const user = await getProfile();
        setAuth((current) => ({ ...current, user }));
      } catch {
        setAuth({ user: null, token: null });
      } finally {
        setBootstrapping(false);
      }
    };

    refreshProfile();
  }, []);

  const login = useCallback(async (payload) => {
    const data = await loginRequest(payload);
    setAuth(data);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await registerRequest(payload);
    setAuth(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    setAuth({ user: null, token: null });
  }, []);

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      isAuthenticated: Boolean(auth.token),
      bootstrapping,
      login,
      register,
      logout
    }),
    [auth, bootstrapping, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

