import React, { createContext, useState, useContext, useCallback } from 'react';

interface UiContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSearch: (query: string) => void;
}

const UiContext = createContext<UiContextType | undefined>(undefined);

export const UiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query.toLowerCase().trim());
  }, []);

  return (
    <UiContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        searchQuery,
        setSearchQuery,
        activeTab,
        setActiveTab,
        handleSearch
      }}
    >
      {children}
    </UiContext.Provider>
  );
};

export const useUi = () => {
  const context = useContext(UiContext);
  if (context === undefined) {
    throw new Error('useUi must be used within a UiProvider');
  }
  return context;
};