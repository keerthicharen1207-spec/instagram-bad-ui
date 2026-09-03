import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../services/soundEngine';
import { ShieldAlert, CheckCircle2, RotateCw, AlertTriangle, X } from 'lucide-react';
import { RunawayButton } from './RunawayButton';

interface CaptchaModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
  reason?: string;
}

type CaptchaType = 'images' | 'math' | 'slider' | 'patience';

const CAPTCHA_IMAGES = [
  { id: 1, isTarget: true, src: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=150&auto=format&fit=crop&q=80', label: 'Bus' },
  { id: 2, isTarget: false, src: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=150&auto=format&fit=crop&q=80', label: 'Coffee' },
  { id: 3, isTarget: true, src: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=150&auto=format&fit=crop&q=80', label: 'Traffic' },
  { id: 4, isTarget: false, src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150&auto=format&fit=crop&q=80', label: 'Laptop' },
  { id: 5, isTarget: true, src: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=150&auto=format&fit=crop&q=80', label: 'Signal' },
  { id: 6, isTarget: false, src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=150&auto=format&fit=crop&q=80', label: 'Lamp' },
  { id: 7, isTarget: false, src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=150&auto=format&fit=crop&q=80', label: 'Desk' },
  { id: 8, isTarget: true, src: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=150&auto=format&fit=crop&q=80', label: 'Car' },
  { id: 9, isTarget: false, src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150&auto=format&fit=crop&q=80', label: 'Forest' },
];

export const CaptchaModal: React.FC<CaptchaModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
  reason = 'Unusual Human-like Clicking Activity Detected',
}) => {
  const [captchaType, setCaptchaType] = useState<CaptchaType>('images');
  const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fakeWarningOpen, setFakeWarningOpen] = useState(false);

  // Math Captcha state
  const [mathAnswer, setMathAnswer] = useState('');

  // Slider Captcha state
  const [sliderVal, setSliderVal] = useState(10);

  // Patience Captcha state (hold still without mouse movement for 3.5 seconds)
  const [stillTime, setStillTime] = useState(0);
  const stillIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    // Pick random captcha type
    const types: CaptchaType[] = ['images', 'math', 'slider', 'patience'];
    const chosen = types[Math.floor(Math.random() * types.length)];
    setCaptchaType(chosen);
    setSelectedImageIds([]);
    setErrorMessage('');
    setIsVerifying(false);
    setStillTime(0);
    setMathAnswer('');
    soundEngine.playBuzzer();
  }, [isOpen]);

  // Patience challenge timer
  useEffect(() => {
    if (captchaType !== 'patience' || !isOpen) return;

    stillIntervalRef.current = window.setInterval(() => {
      setStillTime((prev) => {
        if (prev >= 100) {
          clearInterval(stillIntervalRef.current!);
          handlePass();
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    const handleMouseMove = () => {
      // Reset patience if mouse moves!
      setStillTime(0);
      setErrorMessage('Movement detected! Hold your mouse completely still!');
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (stillIntervalRef.current) clearInterval(stillIntervalRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [captchaType, isOpen]);

  if (!isOpen) return null;

  const toggleImage = (id: number) => {
    soundEngine.playClickSfx();
    setSelectedImageIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handlePass = () => {
    soundEngine.playFanfare();
    setIsVerifying(false);
    onSuccess();
  };

  const handleVerifyImages = () => {
    setIsVerifying(true);
    setErrorMessage('');
    setTimeout(() => {
      // If user selected at least 2 targets
      const targetMatches = selectedImageIds.filter((id) =>
        CAPTCHA_IMAGES.find((img) => img.id === id)?.isTarget
      );

      if (targetMatches.length >= 2) {
        handlePass();
      } else {
        setIsVerifying(false);
        soundEngine.playBuzzer();
        setErrorMessage('Failed! That did not look like a traffic vehicle. Try again!');
        setSelectedImageIds([]);
      }
    }, 1400);
  };

  const handleVerifyMath = () => {
    // (47 * 3 - 19) / 2 = (141 - 19) / 2 = 122 / 2 = 61
    if (mathAnswer.trim() === '61') {
      handlePass();
    } else {
      soundEngine.playBuzzer();
      setErrorMessage('Incorrect calculation! Hint: Order of operations matters.');
    }
  };

  const handleVerifySlider = () => {
    // Target is exactly 73
    if (Math.abs(sliderVal - 73) <= 2) {
      handlePass();
    } else {
      soundEngine.playBuzzer();
      setErrorMessage(`Current value is ${sliderVal}%. You must set it between 71% and 75%!`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 select-none">
      <div className="relative w-full max-w-sm bg-neutral-950 border-2 border-red-500/80 rounded-2xl shadow-2xl p-4 text-white overflow-hidden animate-jitter">
        {/* Header */}
        <div className="flex items-start justify-between pb-2 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse flex-shrink-0" />
            <div>
              <h3 className="font-bold text-xs text-red-400 uppercase tracking-wider">
                Mandatory Security Interruption
              </h3>
              <p className="text-[10px] text-neutral-400">{reason}</p>
            </div>
          </div>

          {/* Deceptive X Button (Runs away or triggers fake warning) */}
          <RunawayButton
            maxEvasions={3}
            onClick={() => setFakeWarningOpen(true)}
            className="p-1 text-neutral-500 hover:text-red-400 cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </RunawayButton>
        </div>

        {/* Fake Warning Overlay */}
        {fakeWarningOpen && (
          <div className="absolute inset-0 bg-red-950/95 z-20 p-4 flex flex-col items-center justify-center text-center space-y-3">
            <AlertTriangle className="w-10 h-10 text-amber-400 animate-bounce" />
            <h4 className="font-bold text-sm text-red-200">PENALTY WARNING</h4>
            <p className="text-xs text-neutral-300">
              Closing this captcha prematurely will lower your Frustragram Social Credit Score and add 3 more captchas!
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setFakeWarningOpen(false)}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs rounded font-semibold cursor-pointer"
              >
                I Will Comply
              </button>
              {onCancel && (
                <button
                  onClick={() => {
                    setFakeWarningOpen(false);
                    onCancel();
                  }}
                  className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-xs rounded font-semibold cursor-pointer"
                >
                  Bypass Anyway
                </button>
              )}
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mt-2 p-2 bg-red-950/70 border border-red-800 rounded-lg text-[11px] text-red-300">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Captcha Type 1: IMAGES */}
        {captchaType === 'images' && (
          <div className="py-3 space-y-2">
            <div className="bg-neutral-900 border border-neutral-800 p-2 rounded-lg text-xs font-semibold text-neutral-200">
              Select all images containing{' '}
              <span className="text-amber-400 underline font-bold">Vehicles or Traffic</span>:
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {CAPTCHA_IMAGES.map((img) => {
                const isSelected = selectedImageIds.includes(img.id);
                return (
                  <div
                    key={img.id}
                    onClick={() => toggleImage(img.id)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-amber-400 scale-95 ring-2 ring-amber-400/50' : 'border-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-amber-400 text-black rounded-full p-0.5 shadow">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              disabled={isVerifying}
              onClick={handleVerifyImages}
              className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-lg disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Auditing AI Biometrics...</span>
                </>
              ) : (
                <span>Submit Verification</span>
              )}
            </button>
          </div>
        )}

        {/* Captcha Type 2: MATH */}
        {captchaType === 'math' && (
          <div className="py-4 space-y-3">
            <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg text-center">
              <span className="text-xs text-neutral-400 block mb-1">Evaluate the expression:</span>
              <span className="text-lg font-mono font-bold text-amber-400">
                ((47 × 3) - 19) ÷ 2 = ?
              </span>
            </div>
            <input
              type="number"
              value={mathAnswer}
              onChange={(e) => setMathAnswer(e.target.value)}
              placeholder="Enter numerical answer"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-center text-sm font-bold text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleVerifyMath}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Verify Computation
            </button>
          </div>
        )}

        {/* Captcha Type 3: SLIDER */}
        {captchaType === 'slider' && (
          <div className="py-4 space-y-3">
            <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg text-center">
              <span className="text-xs text-neutral-400 block mb-1">
                Precision Calibration Required:
              </span>
              <span className="text-sm font-bold text-amber-400">
                Slide the needle to exactly <span className="underline">73%</span>
              </span>
              <div className="text-2xl font-mono font-bold text-white mt-2">{sliderVal}%</div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={sliderVal}
              onChange={(e) => setSliderVal(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />

            <button
              type="button"
              onClick={handleVerifySlider}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Lock Calibration
            </button>
          </div>
        )}

        {/* Captcha Type 4: PATIENCE */}
        {captchaType === 'patience' && (
          <div className="py-4 space-y-3 text-center">
            <div className="text-xs text-neutral-300">
              Biometric Inactivity Test:
              <strong className="block text-amber-400 text-sm mt-1">
                Do not move your mouse or touch the screen!
              </strong>
            </div>

            <div className="w-full bg-neutral-800 rounded-full h-4 overflow-hidden border border-neutral-700">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-150"
                style={{ width: `${stillTime}%` }}
              />
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">
              Calibrating stillness: {stillTime}%
            </span>
          </div>
        )}

        {/* Tiny Emergency Skip */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handlePass}
            className="text-[8px] text-neutral-700 hover:text-neutral-500 underline cursor-pointer"
          >
            [Developer Debug: Bypass Captcha]
          </button>
        </div>
      </div>
    </div>
  );
};
