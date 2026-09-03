import React, { useState, useRef } from 'react';
import { soundEngine } from '../services/soundEngine';

interface DynamicSizeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  shrinkMode?: boolean; // If true, shrinks to tiny dot; if false, expands wildly or toggles
}

export const DynamicSizeButton: React.FC<DynamicSizeButtonProps> = ({
  children,
  shrinkMode = true,
  onClick,
  className = '',
  ...props
}) => {
  const [scale, setScale] = useState(1);
  const [clickCount, setClickCount] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    soundEngine.playKeyBeep();
    // Dynamically change size: shrink dramatically or expand wildly
    if (shrinkMode) {
      // Shrinks to 40% size to make it hard to click
      setScale(0.38);
    } else {
      // Swells to huge size or fluctuates
      setScale(1.45);
    }

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      // Slowly restore to normal size so user isn't stuck forever
      setScale(1);
    }, 1800);
  };

  const handleMouseLeave = () => {
    // Reset after delay
    timeoutRef.current = window.setTimeout(() => {
      setScale(1);
    }, 1200);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundEngine.playClickSfx();
    setClickCount((c) => c + 1);
    setScale(1);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: `scale(${scale})`,
        transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transformOrigin: 'center center',
      }}
      className={`cursor-pointer transition-transform select-none ${className}`}
    >
      {children}
    </button>
  );
};
