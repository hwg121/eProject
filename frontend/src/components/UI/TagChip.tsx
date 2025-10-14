import React from 'react';
import { Link } from 'react-router-dom';
import { Hash } from 'lucide-react';

interface TagChipProps {
  id: number;
  name: string;
  slug: string;
  size?: 'small' | 'medium' | 'large';
  clickable?: boolean;
  className?: string;
}

const TagChip: React.FC<TagChipProps> = ({
  id,
  name,
  slug,
  size = 'medium',
  clickable = true,
  className = '',
}) => {
  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1.5',
    large: 'text-base px-4 py-2',
  };

  const iconSizes = {
    small: 'w-3 h-3',
    medium: 'w-3.5 h-3.5',
    large: 'w-4 h-4',
  };

  const chipContent = (
    <div
      className={`
        inline-flex items-center space-x-1.5 rounded-full 
        bg-gradient-to-r from-emerald-500 to-emerald-600 
        text-white font-medium transition-all duration-200
        ${sizeClasses[size]}
        ${clickable ? 'cursor-pointer hover:from-emerald-600 hover:to-emerald-700 hover:shadow-md hover:scale-105 active:scale-95' : ''}
        ${className}
      `}
    >
      <Hash className={`${iconSizes[size]} flex-shrink-0`} />
      <span className="whitespace-nowrap">{name}</span>
    </div>
  );

  if (!clickable) {
    return chipContent;
  }

  return (
    <Link 
      to={`/tags/${slug}`}
      className="inline-block no-underline"
      title={`View all content tagged with ${name}`}
    >
      {chipContent}
    </Link>
  );
};

export default TagChip;

