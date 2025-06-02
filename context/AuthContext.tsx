import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextType {
  isLoading: boolean;
  userToken: string | null;
  setIsLoading: (value: boolean) => void;
  setUserToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  userToken: null,
  setIsLoading: () => {},
  setUserToken: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{
      isLoading,
      userToken,
      setIsLoading,
      setUserToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};