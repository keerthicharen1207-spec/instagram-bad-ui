import React, { useState, useEffect } from 'react';
import { ViewType } from '../types';
import {
  Home,
  Search,
  PlusSquare,
  Clapperboard,
  ShoppingBag,
  AlertTriangle,
  Flame,
  Skull,
  FileWarning,
} from 'lucide-react';
import { RunawayButton } from './RunawayButton';
import { DynamicSizeButton } from './DynamicSizeButton';

interface DeceptiveNavbarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onOpenCreate: () => void;
  userAvatar: string;
  scrollYOffset?: number;
}

interface NavItemConfig {
  id: ViewType | 'create';
  realAction: () => void;
  lyingLabel: string;
  realLabel: string;
  icon: React.ReactNode;
}

export const DeceptiveNavbar: React.FC<DeceptiveNavbarProps> = ({
  currentView,
  onNavigate,
  onOpenCreate,
  userAvatar,
  scrollYOffset = 0,
}) => {
  // Misleading button labels that lie about their function
  const [shuffleOrder, setShuffleOrder] = useState<number[]>([0, 1, 2, 3, 4, 5]);

  // Periodic subtle shuffling of button order to confuse muscle memory!
  useEffect(() => {
    const shuffleTimer = setInterval(() => {
      setShuffleOrder((prev) => {
        const copy = [...prev];
        // Swap two random adjacent positions
        const idx = Math.floor(Math.random() * 5);
        const temp = copy[idx];
        copy[idx] = copy[idx + 1];
        copy[idx + 1] = temp;
        return copy;
      });
    }, 12000);

    return () => clearInterval(shuffleTimer);
  }, []);

  // Compute unexpected shifting based on scrolling
  const shiftX = Math.sin(scrollYOffset / 50) * 22;
  const shiftY = Math.cos(scrollYOffset / 60) * 8;

  const items: NavItemConfig[] = [
    {
      id: 'feed',
      realAction: () => onNavigate('feed'),
      lyingLabel: 'Delete All Posts',
      realLabel: 'Feed',
      icon: (
        <Skull
          className={`w-6 h-6 transition-transform ${
            currentView === 'feed' ? 'stroke-[2.5] text-red-400 scale-110' : 'stroke-[1.8] text-neutral-400'
          }`}
        />
      ),
    },
    {
      id: 'explore',
      realAction: () => onNavigate('explore'),
      lyingLabel: 'Disable WiFi',
      realLabel: 'Explore',
      icon: (
        <Flame
          className={`w-6 h-6 transition-transform ${
            currentView === 'explore' ? 'stroke-[2.5] text-amber-400 scale-110' : 'stroke-[1.8] text-neutral-400'
          }`}
        />
      ),
    },
    {
      id: 'create',
      realAction: onOpenCreate,
      lyingLabel: 'Send Spam',
      realLabel: 'Create',
      icon: (
        <PlusSquare className="w-6 h-6 stroke-[1.8] text-neutral-400 hover:text-white" />
      ),
    },
    {
      id: 'reels',
      realAction: () => onNavigate('reels'),
      lyingLabel: 'Install Virus',
      realLabel: 'Reels',
      icon: (
        <Clapperboard
          className={`w-6 h-6 transition-transform ${
            currentView === 'reels' ? 'stroke-[2.5] text-purple-400 scale-110' : 'stroke-[1.8] text-neutral-400'
          }`}
        />
      ),
    },
    {
      id: 'shop',
      realAction: () => onNavigate('shop'),
      lyingLabel: 'Donate All Money',
      realLabel: 'Shop',
      icon: (
        <ShoppingBag
          className={`w-6 h-6 transition-transform ${
            currentView === 'shop' ? 'stroke-[2.5] text-emerald-400 scale-110' : 'stroke-[1.8] text-neutral-400'
          }`}
        />
      ),
    },
    {
      id: 'profile',
      realAction: () => onNavigate('profile'),
      lyingLabel: 'Ban My Account',
      realLabel: 'Profile',
      icon: (
        <div
          className={`w-6 h-6 rounded-full overflow-hidden border ${
            currentView === 'profile' ? 'border-amber-400 ring-2 ring-amber-400' : 'border-transparent'
          }`}
        >
          <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
        </div>
      ),
    },
  ];

  return (
    <nav
      style={{
        transform: `translate(${shiftX}px, ${shiftY}px)`,
        transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.4, 1)',
      }}
      className="fixed bottom-1 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border border-neutral-800/80 rounded-2xl h-14 max-w-lg mx-auto flex items-center justify-around px-2 shadow-2xl select-none"
    >
      {shuffleOrder.map((mappedIdx) => {
        const item = items[mappedIdx];
        const isCurrent = currentView === item.id;

        return (
          <DynamicSizeButton
            key={item.id}
            shrinkMode={true}
            onClick={item.realAction}
            className="group relative p-2 text-center"
            title={`Deceptive Button: Labeled "${item.lyingLabel}", actually opens ${item.realLabel}`}
          >
            <div className="flex flex-col items-center">
              {item.icon}
              {/* Lying text label */}
              <span className="text-[8px] text-neutral-500 group-hover:text-red-400 truncate max-w-[50px] block leading-none mt-0.5">
                {item.lyingLabel}
              </span>
            </div>
          </DynamicSizeButton>
        );
      })}
    </nav>
  );
};
