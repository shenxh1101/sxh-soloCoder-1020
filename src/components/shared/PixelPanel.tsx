import React from 'react';

interface PixelPanelProps {
  children: React.ReactNode;
  title?: string;
  variant?: 'wood' | 'dark' | 'light';
  className?: string;
  headerActions?: React.ReactNode;
  onClick?: () => void;
}

export const PixelPanel: React.FC<PixelPanelProps> = ({
  children,
  title,
  variant = 'wood',
  className = '',
  headerActions,
  onClick
}) => {
  const variants = {
    wood: {
      bg: '#6b4423',
      border: '#3a2412',
      headerBg: '#8b5a2b',
      accent: '#e8c170',
      text: '#f0e6d2'
    },
    dark: {
      bg: '#1a2744',
      border: '#0a1724',
      headerBg: '#2a3754',
      accent: '#4a6fa5',
      text: '#f0e6d2'
    },
    light: {
      bg: '#f0e6d2',
      border: '#c0a080',
      headerBg: '#e8c170',
      accent: '#8b5a2b',
      text: '#1a2744'
    }
  };

  const colors = variants[variant];

  return (
    <div
      className={`relative ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      style={{
        backgroundColor: colors.bg,
        border: `4px solid ${colors.border}`,
        boxShadow: `inset 2px 2px 0 ${colors.headerBg}, inset -2px -2px 0 ${colors.border}, 4px 4px 0 rgba(0,0,0,0.3)`
      }}
    >
      {title && (
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{
            backgroundColor: colors.headerBg,
            borderBottom: `3px solid ${colors.border}`
          }}
        >
          <h3
            className="font-pixel text-sm font-bold"
            style={{ color: colors.text, letterSpacing: '2px' }}
          >
            {title}
          </h3>
          {headerActions}
        </div>
      )}
      <div className="p-4" style={{ color: colors.text }}>
        {children}
      </div>
      <div
        className="absolute top-1 left-1 w-2 h-2"
        style={{ backgroundColor: colors.accent, opacity: 0.5 }}
      />
      <div
        className="absolute top-1 right-1 w-2 h-2"
        style={{ backgroundColor: colors.accent, opacity: 0.5 }}
      />
    </div>
  );
};
