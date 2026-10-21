import React from 'react';
import { WATERMARK_LOGO_URL, LOCAL_LOGO_URL } from '../utils/whatsapp';

interface WatermarkBadgeProps {
  position?: 'bottom-right' | 'center' | 'bottom-left' | 'top-right';
  size?: 'sm' | 'md' | 'lg';
  opacity?: string;
  className?: string;
}

export const WatermarkBadge: React.FC<WatermarkBadgeProps> = ({
  position = 'bottom-right',
  size = 'md',
  opacity = 'opacity-90',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-20 sm:w-24',
    md: 'w-24 sm:w-32',
    lg: 'w-32 sm:w-44',
  }[size];

  const positionClasses = {
    'bottom-right': 'bottom-3 right-3 sm:bottom-3.5 sm:right-3.5',
    'bottom-left': 'bottom-3 left-3 sm:bottom-3.5 sm:left-3.5',
    'top-right': 'top-3 right-3 sm:top-3.5 sm:right-3.5',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }[position];

  return (
    <div
      className={`absolute ${positionClasses} ${opacity} pointer-events-none select-none z-10 transition-opacity filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] drop-shadow-[0_0_8px_rgba(255,255,255,0.35)] ${className}`}
      aria-hidden="true"
    >
      <img
        src={WATERMARK_LOGO_URL}
        alt="Marca d'água Oficial TFT Corretor Imobiliário"
        className={`${sizeClasses} h-auto object-contain`}
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== LOCAL_LOGO_URL) {
            target.src = LOCAL_LOGO_URL;
          }
        }}
      />
    </div>
  );
};
