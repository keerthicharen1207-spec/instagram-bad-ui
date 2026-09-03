import React from 'react';
import { ViewType } from '../types';
import { Home, Search, PlusSquare, Clapperboard, ShoppingBag } from 'lucide-react';

interface BottomNavProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onOpenCreate: () => void;
  userAvatar: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenCreate,
  userAvatar,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-t border-neutral-900 h-14 max-w-lg mx-auto flex items-center justify-around px-2">
      {/* 1. Home */}
      <button
        type="button"
        onClick={() => onNavigate('feed')}
        className={`p-2 transition-transform active:scale-90 cursor-pointer ${
          currentView === 'feed' ? 'text-white' : 'text-neutral-400 hover:text-white'
        }`}
        aria-label="Home Feed"
      >
        <Home className={`w-6 h-6 ${currentView === 'feed' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
      </button>

      {/* 2. Explore / Search */}
      <button
        type="button"
        onClick={() => onNavigate('explore')}
        className={`p-2 transition-transform active:scale-90 cursor-pointer ${
          currentView === 'explore' ? 'text-white' : 'text-neutral-400 hover:text-white'
        }`}
        aria-label="Explore & Search"
      >
        <Search className={`w-6 h-6 ${currentView === 'explore' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
      </button>

      {/* 3. Create */}
      <button
        type="button"
        onClick={onOpenCreate}
        className="p-2 transition-transform active:scale-90 cursor-pointer text-neutral-400 hover:text-white"
        aria-label="Create Post, Story, Reel, or Live"
      >
        <PlusSquare className="w-6 h-6 stroke-[1.8]" />
      </button>

      {/* 4. Reels */}
      <button
        type="button"
        onClick={() => onNavigate('reels')}
        className={`p-2 transition-transform active:scale-90 cursor-pointer ${
          currentView === 'reels' ? 'text-white' : 'text-neutral-400 hover:text-white'
        }`}
        aria-label="Reels"
      >
        <Clapperboard className={`w-6 h-6 ${currentView === 'reels' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
      </button>

      {/* 5. Shop */}
      <button
        type="button"
        onClick={() => onNavigate('shop')}
        className={`p-2 transition-transform active:scale-90 cursor-pointer ${
          currentView === 'shop' ? 'text-white' : 'text-neutral-400 hover:text-white'
        }`}
        aria-label="Instagram Shop"
      >
        <ShoppingBag className={`w-6 h-6 ${currentView === 'shop' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
      </button>

      {/* 6. Profile */}
      <button
        type="button"
        onClick={() => onNavigate('profile')}
        className="p-2 transition-transform active:scale-90 cursor-pointer"
        aria-label="Your Profile"
      >
        <div
          className={`w-6 h-6 rounded-full overflow-hidden border ${
            currentView === 'profile' ? 'border-white ring-1 ring-white' : 'border-transparent'
          }`}
        >
          <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </button>
    </nav>
  );
};
