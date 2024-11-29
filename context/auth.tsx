import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../config/API";
import { AuthContextType, User } from "../types/auth";

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => false,
  logout: async () => {},
  register: async () => false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (!loading) {
      const inAuthGroup = segments[0] === "(auth)";

      if (!user && !inAuthGroup) {
        router.replace("/login");
      } else if (user && inAuthGroup) {
        router.replace("/home");
      }
    }
  }, [user, loading, segments]);

  const checkUser = async () => {
    try {
      const token = await AsyncStorage.getItem("sessionToken");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await api.get<User>("/auth/profile");
      setUser(response.data);
    } catch (error) {
      console.log("No user logged in");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await api.post<{ token: string; user: User }>(
        "/auth/login",
        {
          username,
          password,
        }
      );

      if (response.data.token) {
        await AsyncStorage.setItem("sessionToken", response.data.token);
      }

      setUser(response.data.user);
      return true;
    } catch (error: any) {
      throw error.response?.data?.message || "Login failed";
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
      await AsyncStorage.removeItem("sessionToken");
      setUser(null);
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const register = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await api.post<{ token: string; user: User }>(
        "/auth/register",
        {
          username,
          password,
        }
      );

      if (response.data.token) {
        await AsyncStorage.setItem("sessionToken", response.data.token);
      }

      setUser(response.data.user);
      return true;
    } catch (error: any) {
      throw error.response?.data?.message || "Registration failed";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
