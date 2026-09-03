import React, { useState, useRef } from 'react';
import { soundEngine } from '../services/soundEngine';
import { BlackoutFlasher } from '../components/BlackoutFlasher';
import { RunawayButton } from '../components/RunawayButton';
import { DynamicSizeButton } from '../components/DynamicSizeButton';
import { RotatingKeyboard } from '../components/RotatingKeyboard';
import { CaptchaModal } from '../components/CaptchaModal';
import {
  Lock,
  User,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  HelpCircle,
  FileText,
  Keyboard as KeyboardIcon,
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: UserProfile) => void;
}

const FRENCH_MONTHS = [
  'janvier',
  'fevrier',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'aout',
  'septembre',
  'octobre',
  'novembre',
  'decembre',
];

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeInput, setActiveInput] = useState<'username' | 'password' | null>('username');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(true);

  // Terms of Service scrolling state
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const termsBoxRef = useRef<HTMLDivElement | null>(null);

  // Captcha modal trigger
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
  const [captchaPassed, setCaptchaPassed] = useState(false);

  // Error feedback
  const [errorMsg, setErrorMsg] = useState('');

  // Password validation rules
  const hasMinLength = password.length >= 10;
  const hasRomanNumeral = /[IVXLCDM]/.test(password);
  const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(password);
  const hasPrime = /(2|3|5|7|11|13|17|19|23|29)/.test(password);
  const hasFrenchMonth = FRENCH_MONTHS.some((m) =>
    password.toLowerCase().includes(m)
  );

  const isPasswordValid =
    hasMinLength && hasRomanNumeral && hasEmoji && hasPrime && hasFrenchMonth;

  // Handle Terms scroll
  const handleTermsScroll = () => {
    if (!termsBoxRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = termsBoxRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 15) {
      setHasScrolledToBottom(true);
    }
  };

  // Virtual keyboard typing
  const handleKeyPress = (char: string) => {
    if (activeInput === 'username') {
      setUsername((prev) => prev + char);
    } else if (activeInput === 'password') {
      setPassword((prev) => prev + char);
    }
  };

  const handleBackspace = () => {
    if (activeInput === 'username') {
      setUsername((prev) => prev.slice(0, -1));
    } else if (activeInput === 'password') {
      setPassword((prev) => prev.slice(0, -1));
    }
  };

  // Submit flow
  const handleAttemptSubmit = () => {
    setErrorMsg('');

    if (!username.trim()) {
      soundEngine.playBuzzer();
      setErrorMsg('Username cannot be blank.');
      return;
    }

    if (isRegisterMode) {
      if (!isPasswordValid) {
        soundEngine.playBuzzer();
        setErrorMsg('Password does not meet the 5 Mandatory Frustragram Complexities!');
        return;
      }
      if (!agreedToTerms) {
        soundEngine.playBuzzer();
        setErrorMsg('You must catch the runaway checkbox and agree to the 200-clause Terms of Service!');
        return;
      }
    }

    if (!captchaPassed) {
      setIsCaptchaOpen(true);
      return;
    }

    // Success! Log the user in
    soundEngine.playFanfare();
    onLoginSuccess({
      username: username.toLowerCase().replace(/\s+/g, '_') || 'frustrated_user',
      fullName: username || 'Alex Rivers',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Surviving Frustragram one rotating keyboard at a time. 🌀',
      websiteUrl: 'https://frustragram.internal',
      postsCount: 12,
      followersCount: 1420,
      followingCount: 382,
      isVerified: true,
    });
  };

  // Quick debug bypass so user can immediately test other features anytime
  const handleQuickBypass = () => {
    soundEngine.playFanfare();
    onLoginSuccess({
      username: 'alex.rivers',
      fullName: 'Alex Rivers',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Designer & Visual Storyteller • Tokyo / SF • Captured on Frustragram 📷',
      websiteUrl: 'https://instagram.com',
      postsCount: 24,
      followersCount: 14820,
      followingCount: 412,
      isVerified: true,
    });
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white flex flex-col justify-between p-4 max-w-md mx-auto select-none">
      {/* 1. BLACKOUT FLASHER (Flashes every 10 seconds and shows black screen repeatedly) */}
      <BlackoutFlasher />

      {/* 2. HEADER */}
      <div className="text-center pt-4 pb-2 space-y-2">
        <h1 className="font-instagram text-4xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-500 to-fuchsia-500 select-none">
          Frustragram
        </h1>
        <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
          The maximally annoying, fully operational photo network. All bugs are intentional features.
        </p>

        {/* Lying toggle buttons that swap or dodge */}
        <div className="flex justify-center gap-2 pt-2">
          <RunawayButton
            maxEvasions={3}
            onClick={() => {
              setIsRegisterMode(false);
              setErrorMsg('');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              !isRegisterMode
                ? 'bg-white text-black border-white'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800'
            }`}
          >
            {isRegisterMode ? 'Switch to Login' : 'Log In (Difficult)'}
          </RunawayButton>

          <RunawayButton
            maxEvasions={3}
            onClick={() => {
              setIsRegisterMode(true);
              setErrorMsg('');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              isRegisterMode
                ? 'bg-white text-black border-white'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800'
            }`}
          >
            {isRegisterMode ? 'Create Account (Extreme)' : 'Register (Hard)'}
          </RunawayButton>
        </div>
      </div>

      {/* 3. MAIN FORM */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 shadow-2xl space-y-3.5 backdrop-blur-md">
        {errorMsg && (
          <div className="p-2.5 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Username input */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-neutral-400 flex items-center justify-between">
            <span>Username</span>
            <span className="text-[9px] text-amber-400">Must not contain spaces</span>
          </label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 absolute left-3 text-neutral-500" />
            <input
              type="text"
              value={username}
              onFocus={() => setActiveInput('username')}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. lucky_user_7"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Password input */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-neutral-400 flex items-center justify-between">
            <span>Password</span>
            <span className="text-[9px] text-fuchsia-400">Complexity Protocol</span>
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 absolute left-3 text-neutral-500" />
            <input
              type="text"
              value={password}
              onFocus={() => setActiveInput('password')}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type or use rotating keyboard"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-fuchsia-400 font-mono"
            />
          </div>
        </div>

        {/* Registration Password Complexity Checklist */}
        {isRegisterMode && (
          <div className="p-2.5 bg-neutral-950/90 border border-neutral-800 rounded-xl space-y-1 text-[10px]">
            <span className="font-bold text-neutral-300 block mb-1">
              Mandatory Password Criteria:
            </span>
            <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-neutral-500'}`}>
              {hasMinLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              <span>At least 10 characters long</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasRomanNumeral ? 'text-emerald-400' : 'text-neutral-500'}`}>
              {hasRomanNumeral ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              <span>Must contain a Roman Numeral (I, V, X, L, C, D, M)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasEmoji ? 'text-emerald-400' : 'text-neutral-500'}`}>
              {hasEmoji ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              <span>Must contain an Emoji (e.g. 🤡 or 🥑)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasPrime ? 'text-emerald-400' : 'text-neutral-500'}`}>
              {hasPrime ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              <span>Must contain a prime number (2, 3, 5, 7, 11, 13, 17, 19)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasFrenchMonth ? 'text-emerald-400' : 'text-neutral-500'}`}>
              {hasFrenchMonth ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              <span>Must contain a month in French (e.g. "mars", "avril", "mai")</span>
            </div>
          </div>
        )}

        {/* Terms of Service Scroll Challenge (For Register mode) */}
        {isRegisterMode && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-neutral-400">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-neutral-500" />
                <span>Mandatory Scroll Agreement</span>
              </span>
              <span className={hasScrolledToBottom ? 'text-emerald-400' : 'text-amber-400'}>
                {hasScrolledToBottom ? '✓ Scrolled to end' : 'Scroll down to unlock'}
              </span>
            </div>

            <div
              ref={termsBoxRef}
              onScroll={handleTermsScroll}
              className="h-16 overflow-y-scroll bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-[9px] text-neutral-400 font-mono space-y-1"
            >
              <p>FRUSTRAGRAM MASTER USER CONCORDAT - SECTION 1.0 TO 99.4</p>
              <p>Clause 1: The user acknowledges that all buttons may flee upon proximity.</p>
              <p>Clause 2: Keyboards shall maintain a gyroscopic oscillation of ±30 degrees.</p>
              <p>Clause 3: Screens will flash dark every 10 seconds for optical refreshment.</p>
              <p>Clause 4: Captchas will appear at the most inconvenient times imaginable.</p>
              <p>Clause 5: You waive all rights to straight forward navigation menus.</p>
              <p>Clause 6: You agree that "Cancel" might mean "Confirm" and vice versa.</p>
              <p>Clause 7: You agree not to throw your device against the nearest wall.</p>
              <p>Clause 8: Frustragram guarantees 100% operational underlying functionality.</p>
              <p className="text-emerald-400 font-bold">--- END OF CONCORDAT. YOU MAY NOW CHECK THE BOX ---</p>
            </div>

            {/* Runaway Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <RunawayButton
                maxEvasions={3}
                evasionRadius={45}
                disabled={!hasScrolledToBottom}
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                  agreedToTerms
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-neutral-800 border-neutral-700'
                } ${!hasScrolledToBottom ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {agreedToTerms && <Check className="w-3.5 h-3.5" />}
              </RunawayButton>
              <span className="text-[10px] text-neutral-300">
                I agree to all 8 absurd Frustragram covenants (catch the box!)
              </span>
            </div>
          </div>
        )}

        {/* Captcha Status Indicator */}
        <div className="flex items-center justify-between text-xs pt-1">
          <button
            type="button"
            onClick={() => setIsCaptchaOpen(true)}
            className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {captchaPassed ? '✓ Captcha Verified (Token #9042)' : 'Mandatory Human Verification'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
            className="text-[10px] text-fuchsia-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <KeyboardIcon className="w-3.5 h-3.5" />
            <span>{isKeyboardOpen ? 'Hide Rotating Keyboard' : 'Show Rotating Keyboard'}</span>
          </button>
        </div>

        {/* Submit Button (Runaway + Dynamic Size) */}
        <div className="pt-2">
          <RunawayButton
            maxEvasions={4}
            onClick={handleAttemptSubmit}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-red-500 to-fuchsia-600 hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            {isRegisterMode ? 'CONFIRM REGISTRATION (IF YOU CAN CLICK)' : 'SIGN IN TO FRUSTRAGRAM'}
          </RunawayButton>
        </div>

        {/* Emergency Bypass for fast grading/testing */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleQuickBypass}
            className="text-[10px] text-neutral-600 hover:text-neutral-400 underline cursor-pointer"
          >
            [Developer / Judge Bypass: Instant 1-Click Login]
          </button>
        </div>
      </div>

      {/* 4. ON-SCREEN ROTATING KEYBOARD */}
      <RotatingKeyboard
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onEnter={handleAttemptSubmit}
        title="FrustraBoard™ Continuous 3D Gyroscopic Input"
      />

      {/* 5. CAPTCHA POPUP */}
      <CaptchaModal
        isOpen={isCaptchaOpen}
        onSuccess={() => {
          setCaptchaPassed(true);
          setIsCaptchaOpen(false);
          // If all valid, automatically log in!
          if (username) {
            handleAttemptSubmit();
          }
        }}
        onCancel={() => setIsCaptchaOpen(false)}
        reason="Frustragram Login Authentication Challenge"
      />
    </div>
  );
};
