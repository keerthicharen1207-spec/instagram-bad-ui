import React, { useState, useEffect } from 'react';
import { soundEngine } from '../services/soundEngine';
import { RotateCw, Delete, CornerDownLeft, Sparkles, X } from 'lucide-react';

interface RotatingKeyboardProps {
  isOpen: boolean;
  onClose?: () => void;
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onEnter?: () => void;
  title?: string;
}

const KEYBOARD_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '!', '?', '#'],
];

const EMOJIS = ['🤡', '🥑', '🗿', '🔥', '💀', '👀', '💩', '✨'];

export const RotatingKeyboard: React.FC<RotatingKeyboardProps> = ({
  isOpen,
  onClose,
  onKeyPress,
  onBackspace,
  onEnter,
  title = 'FrustraBoard™ Accessibility Keyboard (Continuous Gyroscopic Rotation)',
}) => {
  const [angleX, setAngleX] = useState(15);
  const [angleZ, setAngleZ] = useState(-10);
  const [direction, setDirection] = useState(1);
  const [scrambleMode, setScrambleMode] = useState(false);
  const [isShift, setIsShift] = useState(false);

  // Continuously rotate up and down!
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setAngleX((prev) => {
        if (prev > 30) setDirection(-1);
        if (prev < -30) setDirection(1);
        return prev + direction * 2.5;
      });
      setAngleZ((prev) => ((prev + 1.5 + 45) % 90) - 45);
    }, 60);

    return () => clearInterval(interval);
  }, [isOpen, direction]);

  if (!isOpen) return null;

  const handleKeyClick = (key: string) => {
    soundEngine.playKeyBeep(key);
    const outputChar = isShift ? key.toUpperCase() : key.toLowerCase();
    onKeyPress(outputChar);
  };

  const handleEmojiClick = (emoji: string) => {
    soundEngine.playKeyBeep();
    onKeyPress(emoji);
  };

  return (
    <div className="fixed bottom-2 left-0 right-0 z-50 pointer-events-none flex flex-col items-center justify-center p-2">
      {/* The rotating keyboard frame */}
      <div
        className="pointer-events-auto w-full max-w-md bg-neutral-950/95 border-2 border-fuchsia-600/70 rounded-2xl p-3 shadow-2xl backdrop-blur-lg transition-transform duration-75 text-white select-none"
        style={{
          transform: `perspective(700px) rotateX(${angleX}deg) rotateZ(${angleZ}deg)`,
          boxShadow: '0 20px 50px rgba(217, 70, 239, 0.35)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-[10px]">
          <div className="flex items-center gap-1 text-fuchsia-400 font-bold tracking-wider">
            <RotateCw className="w-3.5 h-3.5 animate-spin" />
            <span className="truncate max-w-[240px]">{title}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setScrambleMode(!scrambleMode)}
              className="px-1.5 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-[9px] rounded text-neutral-300 flex items-center gap-1 cursor-pointer"
              title="Toggle Gyroscopic Scramble"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>{scrambleMode ? 'Scrambled' : 'QWERTY'}</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                title="Minimize keyboard"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Emoji quick shelf */}
        <div className="flex items-center justify-center gap-1.5 py-1.5 overflow-x-auto no-scrollbar">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              className="w-7 h-7 bg-neutral-900 border border-neutral-800 rounded hover:scale-125 transition-transform text-xs flex items-center justify-center cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Keypad Grid */}
        <div className="space-y-1 mt-1">
          {KEYBOARD_ROWS.map((row, rowIdx) => {
            const displayKeys = scrambleMode ? [...row].reverse() : row;
            return (
              <div key={rowIdx} className="flex justify-center gap-1">
                {displayKeys.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleKeyClick(k)}
                    className="min-w-7 h-8 px-1.5 bg-neutral-900 border border-neutral-800 hover:border-fuchsia-500/80 hover:bg-fuchsia-950/40 rounded text-xs font-bold text-neutral-200 active:scale-90 transition-all flex items-center justify-center shadow cursor-pointer"
                  >
                    {isShift ? k.toUpperCase() : k.toLowerCase()}
                  </button>
                ))}
              </div>
            );
          })}

          {/* Bottom Action Row */}
          <div className="flex justify-center items-center gap-1 pt-1">
            <button
              type="button"
              onClick={() => setIsShift(!isShift)}
              className={`px-2.5 h-8 text-[11px] font-bold rounded cursor-pointer ${
                isShift ? 'bg-fuchsia-600 text-white' : 'bg-neutral-800 text-neutral-300'
              }`}
            >
              ⇧ SHIFT
            </button>
            <button
              type="button"
              onClick={() => onKeyPress(' ')}
              className="flex-1 h-8 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-semibold rounded text-neutral-300 active:scale-95 cursor-pointer"
            >
              SPACE (Continuous Drift)
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playKeyBeep();
                onBackspace();
              }}
              className="px-2.5 h-8 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded flex items-center justify-center cursor-pointer active:scale-95"
              title="Backspace"
            >
              <Delete className="w-4 h-4" />
            </button>
            {onEnter && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClickSfx();
                  onEnter();
                }}
                className="px-2.5 h-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded flex items-center justify-center cursor-pointer active:scale-95"
                title="Enter"
              >
                <CornerDownLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="text-center pt-1.5 text-[9px] text-fuchsia-400/80 font-mono">
          Rotation: {Math.round(angleX)}° X / {Math.round(angleZ)}° Z • Try clicking while spinning!
        </div>
      </div>
    </div>
  );
};
