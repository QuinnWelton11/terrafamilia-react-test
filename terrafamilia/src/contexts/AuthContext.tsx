import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import SupabaseService from "../services/supabase";
import type { Profile } from "../services/supabase";

interface AuthContextType {
  user: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (data: {
    email: string;
    password: string;
    username: string;
    full_name: string;
    country?: string;
    state_province?: string;
    phone_number?: string;
  }) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuthStatus();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = SupabaseService.onAuthStateChange(async (authUser) => {
      if (authUser) {
        try {
          const profile = await SupabaseService.getProfile(authUser.id);
          setUser(profile);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authUser = await SupabaseService.getCurrentUser();
      if (authUser) {
        const profile = await SupabaseService.getProfile(authUser.id);
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const { user: authUser } = await SupabaseService.signIn(email, password);
      if (authUser) {
        const profile = await SupabaseService.getProfile(authUser.id);
        setUser(profile);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Sign in failed:", error);
      return false;
    }
  };

  const signUp = async (data: {
    email: string;
    password: string;
    username: string;
    full_name: string;
    country?: string;
    state_province?: string;
    phone_number?: string;
  }): Promise<boolean> => {
    try {
      const { user: authUser } = await SupabaseService.signUp(data);
      if (authUser) {
        const profile = await SupabaseService.getProfile(authUser.id);
        setUser(profile);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Sign up failed:", error);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await SupabaseService.signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async (): Promise<void> => {
    await checkAuthStatus();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
