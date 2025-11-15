/**
 * AuthContext - Single Source of Truth for Authentication
 * 
 * Features:
 * - Session persistence with localStorage
 * - Auto token refresh on 401
 * - Bootstrap user on mount via /me endpoint
 * - Graceful logout with state cleanup
 * - Redirect to previous location after login
 */

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  registerAPI,
  loginAPI,
  logoutAPI,
  getMeAPI,
  refreshTokenAPI,
  getStoredUser,
  getStoredToken,
  isAuthenticated
} from "../utils/authAPI";

const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();

// Toggle between Firebase and Backend API
// Set to 'api' to use backend, 'firebase' to use Firebase
const AUTH_MODE = import.meta.env.VITE_AUTH_MODE || 'api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Bootstrap: Restore user session on mount
   * If tokens exist, call /me to verify and restore user
   */
  useEffect(() => {
    const bootstrapAuth = async () => {
      console.log('🚀 Bootstrap auth starting...');
      if (AUTH_MODE === 'api') {
        try {
          const storedUser = getStoredUser();
          const storedAccessToken = getStoredToken();
          
          console.log('📦 Stored user:', storedUser);
          console.log('🔑 Stored token exists:', !!storedAccessToken);
          
          if (storedUser && storedAccessToken) {
            // Set initial state from localStorage
            console.log('✅ Restoring session from localStorage');
            setCurrentUser(storedUser);
            setAccessToken(storedAccessToken);
            setRefreshToken(localStorage.getItem('novalib_refresh_token'));
            
            // Verify token with backend in background
            try {
              const result = await getMeAPI();
              console.log('✅ Token verified, user updated:', result.user);
              setCurrentUser(result.user);
            } catch (error) {
              console.warn('⚠️ Token verification failed, clearing session:', error);
              // Clear invalid session
              localStorage.removeItem('novalib_access_token');
              localStorage.removeItem('novalib_refresh_token');
              localStorage.removeItem('novalib_user');
              setCurrentUser(null);
              setAccessToken(null);
              setRefreshToken(null);
            }
          } else {
            console.log('❌ No stored user or token found');
          }
        } catch (error) {
          console.error('❌ Session restore failed:', error);
        } finally {
          console.log('🏁 Bootstrap complete, isLoading = false');
          setIsLoading(false);
        }
      } else {
        // Firebase mode - use onAuthStateChanged
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
          setIsLoading(false);
        });
        return unsubscribe;
      }
    };

    bootstrapAuth();
  }, []);

  /**
   * Fetch current user from backend
   */
  const fetchMe = async () => {
    try {
      const result = await getMeAPI();
      setCurrentUser(result.user);
      return result.user;
    } catch (error) {
      console.error('Fetch me failed:', error);
      throw error;
    }
  };

  /**
   * Refresh access token using refresh token
   * Called automatically by http interceptor on 401
   */
  const refreshAccess = async () => {
    try {
      const result = await refreshTokenAPI();
      setAccessToken(result.accessToken);
      return result.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      await handleLogout();
      throw error;
    }
  };

  /**
   * Register new user
   */
  const registerUser = async (email, password, name) => {
    if (AUTH_MODE === 'api') {
      const result = await registerAPI({ name, email, password });
      setCurrentUser(result.user);
      setAccessToken(result.tokens.accessToken);
      setRefreshToken(result.tokens.refreshToken);
      return result;
    } else {
      return createUserWithEmailAndPassword(auth, email, password);
    }
  };

  /**
   * Login existing user
   */
  const loginUser = async (email, password) => {
    if (AUTH_MODE === 'api') {
      const result = await loginAPI({ email, password });
      console.log('✅ Login successful:', result.user);
      console.log('🔑 Tokens stored in localStorage');
      setCurrentUser(result.user);
      setAccessToken(result.tokens.accessToken);
      setRefreshToken(result.tokens.refreshToken);
      return result;
    } else {
      return signInWithEmailAndPassword(auth, email, password);
    }
  };

  /**
   * Sign in with Google (Firebase only for now)
   */
  const signInWithGoogle = async () => {
    if (AUTH_MODE === 'api') {
      throw new Error('Google sign-in not yet implemented for API mode');
    } else {
      return signInWithPopup(auth, googleProvider);
    }
  };

  /**
   * Logout - Clear session locally and on server
   */
  const handleLogout = async () => {
    if (AUTH_MODE === 'api') {
      try {
        await logoutAPI();
      } catch (error) {
        console.error('Server logout failed:', error);
        // Continue with local cleanup even if server fails
      }
      
      // Clear state
      setCurrentUser(null);
      setAccessToken(null);
      setRefreshToken(null);
    } else {
      await signOut(auth);
    }
  };

  const value = {
    // State
    currentUser,
    user: currentUser, // Alias for consistency
    accessToken,
    refreshToken,
    isLoading,
    loading: isLoading, // Alias for backward compatibility
    
    // Actions
    registerUser,
    loginUser,
    signInWithGoogle,
    logout: handleLogout,
    fetchMe,
    refreshAccess,
    
    // Utilities
    authMode: AUTH_MODE,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
