import { createContext, useEffect, useState, type ReactNode } from "react";
import type {
  AuthResponse,
  AuthResponseData,
} from "../types/auth/authResponse";

type AuthContextType = {
  auth: AuthResponseData | null;
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthContextProviderProps = {
  children: ReactNode;
};

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [auth, setAuth] = useState<AuthResponseData | null>(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  useEffect(() => {
    if (auth) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);

  const login = (authResponse: AuthResponse) => {
    setAuth(authResponse.data || null);
  };

  const logout = () => {
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
