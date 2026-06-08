import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "prode-token";

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(decodeURIComponent(escape(atob(payload))));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedToken) {
      const decoded = decodeToken(savedToken);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(decoded);
        setToken(savedToken);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }, []);

  const login = (tokenData) => {
    localStorage.setItem(TOKEN_KEY, tokenData);
    setToken(tokenData);
    setUser(decodeToken(tokenData));
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}