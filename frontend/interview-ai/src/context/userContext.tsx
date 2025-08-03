// UserContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from 'react';
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface UserContextType {
    user: User | null;
    loading: boolean;
    updateUser: (userData: User) => void;
    clearUser: () => void;
  }
  

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const useUserContext = (): UserContextType => {
    const context = useContext(UserContext);

    if (!context) {
      throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
  };

interface UserProviderProps {
  children: ReactNode;
}
const UserProvider: React.FC<UserProviderProps> = ({ children }) => {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (user) return;
        const accessToken = localStorage.getItem("token");

        if (!accessToken) {
            setLoading(false);
            return;
        }
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [])

    const updateUser =  (userData: User) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setLoading(false);
    }

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

  return (
    <UserContext.Provider value={{user, loading, updateUser, clearUser}}>
      {children}
    </UserContext.Provider>
  )
};

export default UserProvider;
