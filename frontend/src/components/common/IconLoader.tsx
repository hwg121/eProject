import React, { Suspense, lazy } from 'react';

// Lazy load icons to reduce bundle size
const iconMap = {
  // Common icons
  'plus': () => import('lucide-react').then(m => ({ default: m.Plus })),
  'search': () => import('lucide-react').then(m => ({ default: m.Search })),
  'edit': () => import('lucide-react').then(m => ({ default: m.Edit })),
  'trash': () => import('lucide-react').then(m => ({ default: m.Trash2 })),
  'star': () => import('lucide-react').then(m => ({ default: m.Star })),
  'arrow-right': () => import('lucide-react').then(m => ({ default: m.ArrowRight })),
  'sparkles': () => import('lucide-react').then(m => ({ default: m.Sparkles })),
  'heart': () => import('lucide-react').then(m => ({ default: m.Heart })),
  'users': () => import('lucide-react').then(m => ({ default: m.Users })),
  'award': () => import('lucide-react').then(m => ({ default: m.Award })),
  'zap': () => import('lucide-react').then(m => ({ default: m.Zap })),
  'hammer': () => import('lucide-react').then(m => ({ default: m.Hammer })),
  'leaf': () => import('lucide-react').then(m => ({ default: m.Leaf })),
  'play-circle': () => import('lucide-react').then(m => ({ default: m.PlayCircle })),
  'library': () => import('lucide-react').then(m => ({ default: m.Library })),
  'wrench': () => import('lucide-react').then(m => ({ default: m.Wrench })),
};

interface IconLoaderProps {
  name: keyof typeof iconMap;
  className?: string;
  size?: number;
}

const IconLoader: React.FC<IconLoaderProps> = ({ name, className = '', size = 24 }) => {
  const LazyIcon = lazy(iconMap[name] || iconMap['plus']);

  return (
    <Suspense fallback={<div className={`w-${size} h-${size} ${className}`} />}>
      <LazyIcon className={className} size={size} />
    </Suspense>
  );
};

export default IconLoader;


