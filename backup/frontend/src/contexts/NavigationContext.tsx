import React, { createContext, useContext, useState, useEffect } from 'react';
import { Home, Zap, Hammer, Leaf, Flower as FlowerPot, Palette, Award, PlayCircle, Library, Heart, Users, Settings } from 'lucide-react';

export interface NavigationItem {
  path: string;
  icon: React.ComponentType<any>;
  label: string;
  emoji: string;
  color: string;
  isVisible: boolean;
  order: number;
}

interface NavigationContextType {
  navItems: NavigationItem[];
}

const DEFAULT_NAV_ITEMS: NavigationItem[] = [
  { 
    path: '/', 
    icon: Home, 
    label: 'Home', 
    emoji: '🏠', 
    color: 'from-emerald-500 to-green-500',
    isVisible: true,
    order: 0
  },
  { 
    path: '/essentials', 
    icon: Leaf, 
    label: 'Essentials', 
    emoji: '🍃', 
    color: 'from-green-500 to-emerald-500',
    isVisible: true,
    order: 1
  },
  { 
    path: '/techniques', 
    icon: Zap, 
    label: 'Techniques', 
    emoji: '⚡', 
    color: 'from-yellow-500 to-orange-500',
    isVisible: true,
    order: 2
  },
  { 
    path: '/videos', 
    icon: PlayCircle, 
    label: 'Videos', 
    emoji: '▶️', 
    color: 'from-red-500 to-pink-500',
    isVisible: true,
    order: 3
  },
  { 
    path: '/tools', 
    icon: Hammer, 
    label: 'Tools', 
    emoji: '🔨', 
    color: 'from-blue-500 to-indigo-500',
    isVisible: true,
    order: 4
  },
  { 
    path: '/pots', 
    icon: FlowerPot, 
    label: 'Pots', 
    emoji: '🪴', 
    color: 'from-amber-500 to-orange-500',
    isVisible: true,
    order: 5
  },
  { 
    path: '/accessories', 
    icon: Palette, 
    label: 'Accessories', 
    emoji: '🎨', 
    color: 'from-pink-500 to-rose-500',
    isVisible: true,
    order: 6
  },
  { 
    path: '/books', 
    icon: Library, 
    label: 'Books', 
    emoji: '📚', 
    color: 'from-indigo-500 to-purple-500',
    isVisible: true,
    order: 7
  },
  { 
    path: '/suggestions', 
    icon: Award, 
    label: 'Suggestions', 
    emoji: '🏆', 
    color: 'from-purple-500 to-violet-500',
    isVisible: true,
    order: 8
  },
  { 
    path: '/about-us', 
    icon: Users, 
    label: 'About Us', 
    emoji: '👥', 
    color: 'from-teal-500 to-cyan-500',
    isVisible: true,
    order: 9
  }
];

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navItems = DEFAULT_NAV_ITEMS.filter(item => item.isVisible).sort((a, b) => a.order - b.order);

  const value: NavigationContextType = {
    navItems
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};