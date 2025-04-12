import React, { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/api/authService";

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: UserInfo | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setUser: (user: UserInfo | null) => void;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  setUser: () => {},
  logout: async () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      setLoading(true);
      const userData = await authService.fetchUserProfile();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  useEffect(() => {
    console.log("User state changed:", user);
  }, [user]);

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, refreshUser, setUser, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserContext;
