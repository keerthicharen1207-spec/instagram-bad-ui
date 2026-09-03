import React, { useState, useEffect, useRef } from 'react';
import { StoryGroup } from '../types';
import { X, Heart, Send, Pause, Play, Volume2, VolumeX } from 'lucide-react';

interface StoryViewerModalProps {
  stories: StoryGroup[];
  initialStoryIndex: number;
  onClose: () => void;
  onReply?: (username: string, text: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialStoryIndex,
  onClose,
  onReply,
}) => {
  const [groupIndex, setGroupIndex] = useState(initialStoryIndex);
  const [itemIndex, setItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showHeartToast, setShowHeartToast] = useState(false);

  const currentGroup = stories[groupIndex] || stories[0];
  const currentItem = currentGroup?.items[itemIndex] || currentGroup?.items[0];
  const DURATION_MS = 5000; // 5 seconds per story
  const intervalRef = useRef<number | null>(null);

  // Timer loop for progress bar
  useEffect(() => {
    setProgress(0);
    setIsLiked(false);
  }, [groupIndex, itemIndex]);

  useEffect(() => {
    if (isPaused) return;

    const step = 50; // update every 50ms
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (step / DURATION_MS) * 100;
        if (next >= 100) {
          handleNext();
          return 0;
        }
        return next;
      });
    }, step);

    return () => clearInterval(timer);
  }, [isPaused, groupIndex, itemIndex, currentGroup]);

  const handleNext = () => {
    if (itemIndex < currentGroup.items.length - 1) {
      setItemIndex((prev) => prev + 1);
    } else if (groupIndex < stories.length - 1) {
      setGroupIndex((prev) => prev + 1);
      setItemIndex(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (itemIndex > 0) {
      setItemIndex((prev) => prev - 1);
    } else if (groupIndex > 0) {
      setGroupIndex((prev) => prev - 1);
      const prevGroup = stories[groupIndex - 1];
      setItemIndex(prevGroup.items.length - 1);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (onReply) {
      onReply(currentGroup.username, replyText.trim());
    }
    setReplyText('');
    setShowHeartToast(true);
    setTimeout(() => setShowHeartToast(false), 1500);
  };

  const handleLikeStory = () => {
    setIsLiked((prev) => !prev);
    if (!isLiked) {
      setShowHeartToast(true);
      setTimeout(() => setShowHeartToast(false), 1200);
    }
  };

  if (!currentGroup || !currentItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none">
      {/* Background backdrop blur */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30"
        style={{ backgroundImage: `url(${currentItem.mediaUrl})` }}
      />

      {/* Main vertical story container */}
      <div className="relative w-full max-w-md h-full max-h-[92vh] sm:rounded-2xl overflow-hidden bg-neutral-900 flex flex-col justify-between shadow-2xl border border-neutral-800">
        {/* Story Image / Media Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-300"
          style={{ backgroundImage: `url(${currentItem.mediaUrl})` }}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Subtle gradient overlay at top and bottom for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
        </div>

        {/* Tap areas for left / right navigation */}
        <div className="absolute inset-0 flex z-10">
          <div
            className="w-1/3 h-4/5 cursor-pointer"
            onClick={handlePrev}
            aria-label="Previous story"
          />
          <div
            className="w-2/3 h-4/5 cursor-pointer"
            onClick={handleNext}
            aria-label="Next story"
          />
        </div>

        {/* Top Header with Segmented Progress Bars & User Profile */}
        <div className="relative z-20 pt-3 px-3">
          {/* Segmented Progress Bars */}
          <div className="flex gap-1 mb-2">
            {currentGroup.items.map((_, idx) => {
              let fillPercent = 0;
              if (idx < itemIndex) fillPercent = 100;
              else if (idx === itemIndex) fillPercent = progress;

              return (
                <div
                  key={idx}
                  className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-white transition-all ease-linear"
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* User Info Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-white">
                <img
                  src={currentGroup.avatarUrl}
                  alt={currentGroup.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white drop-shadow">
                <span className="font-semibold">{currentGroup.username}</span>
                <span className="text-neutral-300 text-[11px]">• {currentItem.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 hover:bg-black/30 rounded-full cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="p-1 hover:bg-black/30 rounded-full cursor-pointer"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1 hover:bg-black/30 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Caption Overlay (if present) */}
        {currentItem.caption && (
          <div className="relative z-20 px-4 py-2 my-auto text-center pointer-events-none">
            <span className="inline-block bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium">
              {currentItem.caption}
            </span>
          </div>
        )}

        {/* Heart Pop Animation */}
        {showHeartToast && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none animate-bounce">
            <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-lg" />
          </div>
        )}

        {/* Bottom Bar: Reply Input & Reactions */}
        <div className="relative z-20 p-3 flex items-center gap-2">
          <form onSubmit={handleSendReply} className="flex-1 flex items-center">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${currentGroup.username}...`}
              className="w-full bg-black/40 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 text-xs text-white placeholder-neutral-300 focus:outline-none focus:border-white transition-colors"
            />
          </form>

          <button
            type="button"
            onClick={handleLikeStory}
            className="p-2 text-white hover:text-red-500 transition-colors cursor-pointer"
            aria-label="Like story"
          >
            <Heart
              className={`w-6 h-6 transition-transform active:scale-125 ${
                isLiked ? 'text-red-500 fill-red-500' : ''
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => {
              if (onReply) onReply(currentGroup.username, 'Shared a story');
            }}
            className="p-2 text-white hover:text-neutral-300 transition-colors cursor-pointer"
            aria-label="Share story"
          >
            <Send className="w-6 h-6 -rotate-12" />
          </button>
        </div>
      </div>
    </div>
  );
};
