import { useEffect, useState } from "react";

import AuthContext from "./auth-context";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const AUTH_REQUEST_CONFIG = {
  timeout: 20000,
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        if (isMounted) {
          setToken(null);
          setUser(null);
          setIsReady(true);
        }
        return;
      }

      if (isMounted) {
        setToken(storedToken);
      }

      try {
        const response = await axiosInstance.get(
          API_PATHS.AUTH.ME,
          AUTH_REQUEST_CONFIG,
        );

        if (isMounted) {
          setUser(response.data.user);
        }
      } catch {
        localStorage.removeItem("token");

        if (isMounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    };

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const setAuth = (authPayload) => {
    localStorage.setItem("token", authPayload.token);
    setToken(authPayload.token);
    setUser({
      _id: authPayload._id,
      name: authPayload.name,
      email: authPayload.email,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isReady,
        isAuthenticated: Boolean(token && user),
        setAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
