import React, { useState, useRef } from 'react';
import { soundEngine } from '../services/soundEngine';

interface RunawayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  maxEvasions?: number;
  evasionRadius?: number;
  children: React.ReactNode;
  fakeLabel?: string; // Optional deceptive label
}

export const RunawayButton: React.FC<RunawayButtonProps> = ({
  maxEvasions = 4,
  evasionRadius = 55,
  children,
  fakeLabel,
  onClick,
  className = '',
  ...props
}) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [evasionCount, setEvasionCount] = useState(0);
  const [isTired, setIsTired] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (isTired) return;

    if (evasionCount < maxEvasions) {
      soundEngine.playKeyBeep();
      // Random dodge in angle and distance
      const angle = Math.random() * Math.PI * 2;
      const dist = evasionRadius * (0.6 + Math.random() * 0.7);
      const newX = Math.cos(angle) * dist;
      const newY = Math.sin(angle) * dist;

      setOffset({ x: newX, y: newY });
      setEvasionCount((c) => c + 1);

      // Reset timer
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => {
        setOffset({ x: 0, y: 0 });
        setEvasionCount(0);
      }, 4000);
    } else {
      // Button gets exhausted for 2.5 seconds, allowing the user to click!
      setIsTired(true);
      setTimeout(() => {
        setIsTired(false);
        setEvasionCount(0);
        setOffset({ x: 0, y: 0 });
      }, 2500);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundEngine.playClickSfx();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      {...props}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: isTired ? 'transform 0.4s ease-out' : 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      className={`relative cursor-pointer select-none transition-all ${
        isTired ? 'ring-2 ring-emerald-500/50' : ''
      } ${className}`}
    >
      {fakeLabel ? (
        <span title="Warning: Deceptive label">{fakeLabel}</span>
      ) : (
        children
      )}
      {isTired && (
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] bg-neutral-900 text-emerald-400 px-1 py-0.5 rounded border border-emerald-800 whitespace-nowrap animate-bounce">
          Caught! Click now!
        </span>
      )}
    </button>
  );
};
