import React, { useState, useEffect } from 'react';
import { soundEngine } from '../services/soundEngine';
import { CaptchaModal } from './CaptchaModal';
import { RunawayButton } from './RunawayButton';
import { AlertCircle, Cookie, BellRing, Sparkles, X } from 'lucide-react';

interface RandomPopupManagerProps {
  onTriggerGlobalCaptcha?: (reason: string) => void;
}

export const RandomPopupManager: React.FC<RandomPopupManagerProps> = () => {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
  const [captchaReason, setCaptchaReason] = useState('Periodic Human Verification');
  const [annoyingBanner, setAnnoyingBanner] = useState<string | null>(
    '⚠️ Notice: Your scrolling speed is 14% higher than average. Please scroll more slowly.'
  );

  // Trigger annoying popups periodically every 40-60 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const roll = Math.random();
      if (roll < 0.4) {
        setCaptchaReason('Periodic Inactivity / Activity Security Scan');
        setIsCaptchaOpen(true);
      } else if (roll < 0.7) {
        soundEngine.playBuzzer();
        setActivePopup('cookie');
      } else {
        soundEngine.playBuzzer();
        setActivePopup('premium');
      }
    }, 45000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* 1. ANNOYING TOP BANNER */}
      {annoyingBanner && (
        <div className="bg-amber-500/90 text-black text-[11px] font-semibold px-3 py-1 flex items-center justify-between sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-1.5 truncate">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{annoyingBanner}</span>
          </div>
          <RunawayButton
            maxEvasions={2}
            onClick={() => {
              setAnnoyingBanner(null);
              setTimeout(() => {
                setAnnoyingBanner('⚠️ Session notice: Frustragram algorithms are optimizing your feed.');
              }, 15000);
            }}
            className="text-black font-bold p-1 cursor-pointer text-xs"
          >
            ✕
          </RunawayButton>
        </div>
      )}

      {/* 2. POPUP: COOKIE POLICY INTERRUPTER */}
      {activePopup === 'cookie' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
          <div className="relative w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-2xl p-4 shadow-2xl space-y-3 text-white">
            <div className="flex items-center gap-2 text-amber-400">
              <Cookie className="w-6 h-6" />
              <h3 className="font-bold text-sm">Enhanced Tracking Cookies</h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              To deliver the most frustrating experience possible, we require permission to store 8,421 tracking cookies in your browser storage.
            </p>
            <div className="p-2 bg-neutral-900 rounded-lg text-[10px] text-neutral-400 max-h-20 overflow-y-auto border border-neutral-800">
              Cookie 1/8421: _frustra_eye_tracker_v9. Cookie 2/8421: _cursor_hesitation_analyzer. Cookie 3/8421: _patience_depletion_telemetry...
            </div>
            <div className="flex gap-2 pt-2">
              {/* Lying buttons: "Decline" actually accepts, "Accept" runs away! */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClickSfx();
                  setActivePopup(null);
                }}
                className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Reject Non-Essential (Accepts All)
              </button>
              <RunawayButton
                maxEvasions={4}
                onClick={() => {
                  soundEngine.playClickSfx();
                  setActivePopup(null);
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded-lg text-white"
              >
                Accept All
              </RunawayButton>
            </div>
          </div>
        </div>
      )}

      {/* 3. POPUP: FAKE PREMIUM UPSELL */}
      {activePopup === 'premium' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-neutral-900 to-neutral-950 border border-amber-500/50 rounded-2xl p-4 shadow-2xl space-y-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold text-sm">Frustragram Gold VIP</span>
              </div>
              <RunawayButton
                maxEvasions={3}
                onClick={() => setActivePopup(null)}
                className="text-neutral-400 hover:text-white text-xs p-1"
              >
                ✕
              </RunawayButton>
            </div>
            <p className="text-xs text-neutral-300">
              Upgrade now to unlock 2x faster rotating keyboards and 50% more unexpected blackouts!
            </p>
            <div className="text-xl font-bold text-amber-400 text-center py-1">
              $99.99 <span className="text-xs font-normal text-neutral-400">/ hour</span>
            </div>
            <div className="space-y-2 pt-1">
              <RunawayButton
                maxEvasions={3}
                onClick={() => {
                  soundEngine.playFanfare();
                  alert('Thank you! Your credit card has been charged $0.00 because this is a simulation.');
                  setActivePopup(null);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs rounded-xl"
              >
                Upgrade To VIP Now
              </RunawayButton>
              <button
                type="button"
                onClick={() => setActivePopup(null)}
                className="w-full py-1.5 text-[10px] text-neutral-500 hover:text-neutral-400 underline cursor-pointer text-center block"
              >
                No thanks, I prefer regular frustration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. TIME WASTING CAPTCHA POPUP */}
      <CaptchaModal
        isOpen={isCaptchaOpen}
        reason={captchaReason}
        onSuccess={() => setIsCaptchaOpen(false)}
        onCancel={() => setIsCaptchaOpen(false)}
      />
    </>
  );
};
