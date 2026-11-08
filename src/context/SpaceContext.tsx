/**
 * Space & User Presence Context
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Space, SpaceMember } from '../types/orbit';
import { INITIAL_SPACES, CURRENT_USER, PARTNER } from '../utils/mockData';
import { haptics } from '../utils/haptics';

interface SpaceContextType {
  currentSpace: Space;
  spaces: Space[];
  currentUser: SpaceMember;
  partner: SpaceMember;
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
  switchSpace: (spaceId: string) => void;
  createSpace: (name: string, emoji: string, anniversaryOrDate?: string, description?: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const SpaceContext = createContext<SpaceContextType | undefined>(undefined);

export const SpaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [spaces, setSpaces] = useState<Space[]>(INITIAL_SPACES);
  const [currentSpaceId, setCurrentSpaceId] = useState<string>('space_us');
  const [currentUser, setCurrentUser] = useState<SpaceMember>(CURRENT_USER);
  const [partner] = useState<SpaceMember>(PARTNER);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'fluid'>('mobile');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    // Apply dark class to html documentElement
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  const currentSpace = spaces.find((s) => s.id === currentSpaceId) || spaces[0];

  const switchSpace = (spaceId: string) => {
    haptics.selection();
    setCurrentSpaceId(spaceId);
  };

  const createSpace = (name: string, emoji: string, anniversaryOrDate?: string, description?: string) => {
    haptics.success();
    const newSpace: Space = {
      id: `space_${Date.now()}`,
      name: name.trim(),
      emoji: emoji.trim() || '🪐',
      description: description?.trim() || 'Shared couple micro-space',
      members: [currentUser, partner],
      anniversaryOrDate: anniversaryOrDate?.trim() || undefined,
    };
    setSpaces((prev) => [...prev, newSpace]);
    setCurrentSpaceId(newSpace.id);
  };

  const toggleTheme = () => {
    haptics.light();
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <SpaceContext.Provider
      value={{
        currentSpace,
        spaces,
        currentUser,
        partner,
        themeMode,
        toggleTheme,
        switchSpace,
        createSpace,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </SpaceContext.Provider>
  );
};

export const useSpace = () => {
  const context = useContext(SpaceContext);
  if (!context) {
    throw new Error('useSpace must be used within a SpaceProvider');
  }
  return context;
};
