"use client";

import { createContext, useContext, ReactNode } from "react";
import { HomeButton } from "./home-button";

interface HomeContextType {
  showHomeButton: boolean;
  onHomeClick: () => void;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export function HomeProvider({
  children,
  showHomeButton,
  onHomeClick,
}: {
  children: ReactNode;
  showHomeButton: boolean;
  onHomeClick: () => void;
}) {
  return (
    <HomeContext.Provider value={{ showHomeButton, onHomeClick }}>
      <div className="relative min-h-screen">
        <div className="fixed top-4 left-4 z-50">
          <HomeButton show={showHomeButton} onHome={onHomeClick} />
        </div>
        {children}
      </div>
    </HomeContext.Provider>
  );
}

export function useHome() {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
}
