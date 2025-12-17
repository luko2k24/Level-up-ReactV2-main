import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  role?: string | null;
  rol?: string | null;
  roles?: string[];
  authorities?: string[];
  [key: string]: any;
} | null;

type AuthContextType = {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: { user: User; token: string }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 CARGA INICIAL DESDE LOCALSTORAGE
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    // Rehidratar desde el token (no depende del backend).
    try {
      const payload = JSON.parse(atob(storedToken.split(".")[1] || ""));

      const role =
        payload.role ||
        payload.rol ||
        (Array.isArray(payload.roles) && payload.roles[0]) ||
        (Array.isArray(payload.authorities) && payload.authorities[0]) ||
        null;

      const normalizedUser = {
        ...payload,
        role,
      };

      setUser(normalizedUser);
      setToken(storedToken);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ LOGIN CORRECTO
  const login = ({ user, token }: { user: User; token: string }) => {
    const normalizedUser = {
      ...user,
      role:
        user?.role ||
        user?.rol ||
        (Array.isArray(user?.roles) && user.roles[0]) ||
        (Array.isArray(user?.authorities) && user.authorities[0]) ||
        null,
    };

    setUser(normalizedUser);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", token);
  };

  // ✅ LOGOUT LIMPIO
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
