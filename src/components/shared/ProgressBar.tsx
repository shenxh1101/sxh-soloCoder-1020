import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  color?: string;
  bgColor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  showValue = false,
  color = '#6a8c5f',
  bgColor = '#2a2a2a',
  size = 'md',
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizes = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between mb-1">
          {label && (
            <span className="text-xs font-pixel text-f0e6d2">{label}</span>
          )}
          {showValue && (
            <span className="text-xs font-pixel text-f0e6d2">
              {Math.round(value)}/{max}
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${sizes[size]} relative`}
        style={{
          backgroundColor: bgColor,
          border: '2px solid #1a1a1a',
          boxShadow: 'inset 1px 1px 0 rgba(0,0,0,0.5)'
        }}
      >
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `inset 0 -2px 0 rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)`
          }}
        />
        <div
          className="absolute top-0 left-0 w-full h-1 opacity-30"
          style={{ backgroundColor: '#fff' }}
        />
      </div>
    </div>
  );
};
