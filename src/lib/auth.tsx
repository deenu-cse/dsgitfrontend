"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const GITHUB_CLIENT_ID = "Ov23liMoZ95tZPCFYSwp";
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-dsgit.onrender.com';

interface User {
  username: string;
  avatar_url: string;
  githubId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, read user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('dsa_web_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse stored user:", e);
    }
    setLoading(false);
  }, []);

  // Listen for OAuth callback messages (from the callback page)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'DSA_AUTH_SUCCESS' && event.data?.user) {
        const u = event.data.user;
        setUser(u);
        localStorage.setItem('dsa_web_user', JSON.stringify(u));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const login = () => {
    // Build GitHub OAuth URL with redirect back to our callback page
    const redirectUri = `${window.location.origin}/auth/callback`;
    const state = Math.random().toString(36).substring(2);
    sessionStorage.setItem('oauth_state', state);

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo%20user:email%20read:user&state=${state}`;
    
    // Open in a popup window for smoother UX
    const width = 500, height = 700;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;
    window.open(authUrl, 'github-oauth', `width=${width},height=${height},left=${left},top=${top}`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dsa_web_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
