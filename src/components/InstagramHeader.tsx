import React from 'react';
import { ViewType } from '../types';
import { Heart, Send, PlusSquare, ArrowLeft, LogOut } from 'lucide-react';
import { RunawayButton } from './RunawayButton';
import { DynamicSizeButton } from './DynamicSizeButton';

interface InstagramHeaderProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onOpenCreate: () => void;
  onLogout?: () => void;
  unreadChatCount: number;
  hasNotifications?: boolean;
}

export const InstagramHeader: React.FC<InstagramHeaderProps> = ({
  currentView,
  onNavigate,
  onOpenCreate,
  onLogout,
  unreadChatCount,
  hasNotifications = true,
}) => {
  if (currentView === 'live') {
    return null; // Live view has its own immersive overlay header
  }

  // Header for DMs/Chat
  if (currentView === 'chat') {
    return (
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-neutral-800 px-4 h-14 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <RunawayButton
            maxEvasions={2}
            onClick={() => onNavigate('feed')}
            className="p-1 text-white hover:text-neutral-400 cursor-pointer"
            title="Trap in Feed"
          >
            <ArrowLeft className="w-6 h-6" />
          </RunawayButton>
          <div className="flex items-center gap-1.5 cursor-pointer">
            <span className="font-bold text-base text-white">alex.rivers</span>
            <span className="text-xs text-neutral-400">▼</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DynamicSizeButton
            shrinkMode={true}
            onClick={onOpenCreate}
            className="text-white hover:text-neutral-400 p-1"
            title="Self Destruct Thread"
          >
            <PlusSquare className="w-6 h-6" />
          </DynamicSizeButton>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-neutral-900 px-4 h-14 flex items-center justify-between select-none">
      {/* Brand logo (lying tooltip) */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => onNavigate('feed')}
        title="Warning: Clicking this does NOT download free RAM"
      >
        <span className="font-instagram text-3xl tracking-wide text-white select-none">
          Instagram
        </span>
      </div>

      {/* Action icons */}
      <div className="flex items-center gap-3">
        {/* Create (+) */}
        <DynamicSizeButton
          shrinkMode={true}
          onClick={onOpenCreate}
          className="text-white hover:text-neutral-400 p-1"
          title="Corrupt Media Files (Opens Create Post)"
        >
          <PlusSquare className="w-6 h-6" />
        </DynamicSizeButton>

        {/* Notifications (Heart) */}
        <RunawayButton
          maxEvasions={3}
          evasionRadius={35}
          onClick={() => {}}
          className="relative text-white hover:text-neutral-400 p-1"
          title="Report Dislike to Moderators"
        >
          <Heart className="w-6 h-6" />
          {hasNotifications && (
            <span className="absolute 0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </RunawayButton>

        {/* Direct Messages (Send) */}
        <DynamicSizeButton
          shrinkMode={true}
          onClick={() => onNavigate('chat')}
          className="relative text-white hover:text-neutral-400 p-1"
          title="Broadcast Spam To All Contacts"
        >
          <Send className="w-6 h-6 -rotate-12" />
          {unreadChatCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 bg-red-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
              {unreadChatCount}
            </span>
          )}
        </DynamicSizeButton>

        {/* Sign Out / Re-test Login */}
        {onLogout && (
          <RunawayButton
            maxEvasions={2}
            evasionRadius={25}
            onClick={onLogout}
            className="text-neutral-500 hover:text-red-400 p-1 ml-1"
            title="Sign Out to Login Page (Re-test Blackout)"
          >
            <LogOut className="w-4 h-4" />
          </RunawayButton>
        )}
      </div>
    </header>
  );
};

