import React, { createContext, useState, useContext, ReactNode } from 'react';

interface NavbarContextType {
  isNavbarBlue: boolean;
  setIsNavbarBlue: (isBlue: boolean) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const NavbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isNavbarBlue, setIsNavbarBlue] = useState(false);

  return (
    <NavbarContext.Provider value={{ isNavbarBlue, setIsNavbarBlue }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};