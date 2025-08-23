import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Hook and Provider
 * 
 * Features:
 * - User state management
 * - Authentication methods (sign in, sign up, sign out)
 * - Loading states for async operations
 * - Persistent authentication using localStorage
 * 
 * TODO: Backend Integration
 * - Replace mock authentication with actual API calls
 * - Integrate with VITE_BACKEND_URL/auth endpoints
 * - Use VITE_API_KEY for secure authentication
 * - Implement JWT token management
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Sign In Function
   * TODO: Replace with actual API call
   */
  const signIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual authentication API call
      // const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signin`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-API-Key': import.meta.env.VITE_API_KEY
      //   },
      //   body: JSON.stringify({ email, password })
      // });

      // Mock authentication - remove in production
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      if (email === 'demo@example.com' && password === 'password') {
        const mockUser: User = {
          id: '1',
          email,
          fullName: 'Demo User'
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
      } else {
        throw new Error('Invalid credentials');
      }
      
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign Up Function  
   * TODO: Replace with actual API call
   */
  const signUp = async (email: string, password: string, fullName: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual registration API call
      // const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-API-Key': import.meta.env.VITE_API_KEY
      //   },
      //   body: JSON.stringify({ email, password, fullName })
      // });

      // Mock registration - remove in production
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        fullName
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign Out Function
   * TODO: Add server-side session invalidation
   */
  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    
    // TODO: Invalidate server session
    // fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signout`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'X-API-Key': import.meta.env.VITE_API_KEY
    //   }
    // });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};