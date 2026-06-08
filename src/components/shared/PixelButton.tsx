import React from 'react';
import { audioManager } from '../../utils/audio';

interface PixelButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const variants = {
    primary: {
      bg: '#4a6fa5',
      bgHover: '#5a7fb5',
      bgActive: '#3a5f95',
      border: '#2a4f75',
      text: '#f0e6d2'
    },
    secondary: {
      bg: '#8b5a2b',
      bgHover: '#9b6a3b',
      bgActive: '#7b4a1b',
      border: '#5b3a1b',
      text: '#f0e6d2'
    },
    danger: {
      bg: '#e06c75',
      bgHover: '#f07c85',
      bgActive: '#d05c65',
      border: '#a04c55',
      text: '#f0e6d2'
    },
    success: {
      bg: '#6a8c5f',
      bgHover: '#7a9c6f',
      bgActive: '#5a7c4f',
      border: '#3a5c2f',
      text: '#f0e6d2'
    }
  };

  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const colors = variants[variant];

  const handleClick = (e: React.MouseEvent) => {
    if (!disabled && onClick) {
      audioManager.playClick();
      onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${sizes[size]}
        font-pixel
        text-center
        transition-all
        duration-100
        select-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5'}
        active:translate-y-0.5
        ${className}
      `}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `3px solid ${colors.border}`,
        borderTopColor: colors.bgHover,
        borderLeftColor: colors.bgHover,
        boxShadow: disabled ? 'none' : `2px 2px 0 ${colors.border}`,
        imageRendering: 'pixelated',
        letterSpacing: '1px'
      }}
    >
      {children}
    </button>
  );
};
