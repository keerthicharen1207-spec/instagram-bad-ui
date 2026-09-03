import React, { useState, useEffect } from 'react';
import { soundEngine } from '../services/soundEngine';
import { Shield, EyeOff } from 'lucide-react';

interface BlackoutFlasherProps {
  onCycle?: () => void;
}

export const BlackoutFlasher: React.FC<BlackoutFlasherProps> = () => {
  const [countdown, setCountdown] = useState(10);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isBlackout, setIsBlackout] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          triggerBlackoutSequence();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const triggerBlackoutSequence = () => {
    // 1. Flash white
    setIsFlashing(true);
    soundEngine.playCameraSnap();

    setTimeout(() => {
      setIsFlashing(false);
      // 2. Blackout for 2 seconds
      setIsBlackout(true);
      soundEngine.playBuzzer();

      setTimeout(() => {
        setIsBlackout(false);
      }, 2000);
    }, 150);
  };

  return (
    <>
      {/* Visual countdown banner on page */}
      <div className="flex items-center justify-center gap-1.5 py-1 px-3 bg-red-950/80 border border-red-800/60 rounded-lg text-[10px] text-red-300 font-mono animate-pulse select-none">
        <EyeOff className="w-3.5 h-3.5 text-red-400" />
        <span>Mandatory 10s Security Blackout in: </span>
        <strong className="text-red-200 text-xs font-bold">{countdown}s</strong>
      </div>

      {/* 1. Flash White Overlay */}
      {isFlashing && (
        <div className="fixed inset-0 z-[120] bg-white pointer-events-none transition-opacity duration-75" />
      )}

      {/* 2. Solid Pitch Black Screen Overlay */}
      {isBlackout && (
        <div className="fixed inset-0 z-[130] bg-black flex flex-col items-center justify-center p-6 text-center select-none cursor-wait">
          <div className="space-y-4 max-w-sm">
            <div className="w-12 h-12 mx-auto rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center animate-spin">
              <Shield className="w-6 h-6 text-red-500" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-red-500 tracking-widest uppercase font-mono">
                [BLACK SCREEN PROTOCOL ACTIVE]
              </h2>
              <p className="text-xs text-neutral-400">
                Instagram Security 10-Second Quantum Re-calibration. Please do not touch your screen or blink.
              </p>
            </div>
            <div className="w-48 mx-auto bg-neutral-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-red-600 h-full w-full animate-pulse" />
            </div>
            <span className="text-[10px] text-neutral-600 font-mono block">
              Resuming session in 2 seconds...
            </span>
          </div>
        </div>
      )}
    </>
  );
};
