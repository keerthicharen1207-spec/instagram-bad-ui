import React, { useState } from 'react';
import { Reel, Comment } from '../types';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreVertical,
  Volume2,
  VolumeX,
  Music,
  Camera,
  Sparkles,
  ChevronUp,
  ChevronDown,
  X,
  Plus
} from 'lucide-react';

interface ReelsViewProps {
  reels: Reel[];
  onUpdateReel: (updatedReel: Reel) => void;
  onOpenCreateReel: () => void;
  currentUsername: string;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  reels,
  onUpdateReel,
  onOpenCreateReel,
  currentUsername,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [heartBurst, setHeartBurst] = useState(false);
  const [followingCreators, setFollowingCreators] = useState<Record<string, boolean>>({});

  const currentReel = reels[activeIndex] || reels[0];

  const handleNext = () => {
    if (activeIndex < reels.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const handleToggleLike = () => {
    if (!currentReel) return;
    const isLiked = !currentReel.isLiked;
    onUpdateReel({
      ...currentReel,
      isLiked,
      likes: isLiked ? currentReel.likes + 1 : Math.max(0, currentReel.likes - 1),
    });
  };

  const handleDoubleTap = () => {
    if (!currentReel) return;
    if (!currentReel.isLiked) {
      onUpdateReel({
        ...currentReel,
        isLiked: true,
        likes: currentReel.likes + 1,
      });
    }
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 700);
  };

  const handleToggleSave = () => {
    if (!currentReel) return;
    onUpdateReel({
      ...currentReel,
      isSaved: !currentReel.isSaved,
    });
  };

  const handleToggleFollow = (creator: string) => {
    setFollowingCreators((prev) => ({
      ...prev,
      [creator]: !prev[creator],
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !currentReel) return;

    const newComment: Comment = {
      id: 'rc-' + Date.now(),
      author: currentUsername,
      text: newCommentText.trim(),
      timestamp: 'Just now',
      likes: 0,
    };

    onUpdateReel({
      ...currentReel,
      comments: [newComment, ...currentReel.comments],
    });

    setNewCommentText('');
  };

  if (!currentReel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-neutral-400">
        <p>No Reels found.</p>
        <button
          onClick={onOpenCreateReel}
          className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm"
        >
          Create First Reel
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-[calc(100vh-7rem)] sm:h-[84vh] bg-black rounded-none sm:rounded-2xl overflow-hidden select-none border-x border-neutral-900 shadow-2xl">
      {/* Reel Media / Background Video Visual */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentReel.videoGradient || 'from-neutral-900 to-black'} flex items-center justify-center cursor-pointer`}
        onDoubleClick={handleDoubleTap}
      >
        {currentReel.videoUrl ? (
          <img
            src={currentReel.videoUrl}
            alt={currentReel.caption}
            className="w-full h-full object-cover opacity-90 transition-opacity"
          />
        ) : null}

        {/* Ambient lighting overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

        {/* Double-tap heart burst animation */}
        {heartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart className="w-28 h-28 text-white fill-white animate-ping opacity-90 drop-shadow-2xl" />
          </div>
        )}
      </div>

      {/* Top Header: Reels Title & Camera Button */}
      <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between text-white drop-shadow">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight">Reels</span>
          <span className="text-xs text-neutral-400 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {activeIndex + 1} / {reels.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-sm cursor-pointer"
            aria-label="Toggle mute"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenCreateReel}
            className="p-2 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-sm cursor-pointer flex items-center gap-1"
            title="Create new Reel"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Chevrons for Desktop / Mouse users */}
      <div className="absolute top-1/2 -translate-y-1/2 left-2 z-20 flex flex-col gap-2">
        <button
          type="button"
          disabled={activeIndex === 0}
          onClick={handlePrev}
          className="p-1.5 bg-black/50 rounded-full text-white hover:bg-black/80 disabled:opacity-20 cursor-pointer backdrop-blur-sm"
          title="Previous reel"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          type="button"
          disabled={activeIndex === reels.length - 1}
          onClick={handleNext}
          className="p-1.5 bg-black/50 rounded-full text-white hover:bg-black/80 disabled:opacity-20 cursor-pointer backdrop-blur-sm"
          title="Next reel"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Right Action Rail: Like, Comment, Share, Save, Vinyl */}
      <div className="absolute right-3 bottom-14 z-20 flex flex-col items-center gap-4 text-white drop-shadow">
        {/* Like */}
        <button
          type="button"
          onClick={handleToggleLike}
          className="flex flex-col items-center gap-1 cursor-pointer group"
        >
          <div className="p-2 rounded-full bg-black/30 backdrop-blur-sm group-active:scale-125 transition-transform">
            <Heart
              className={`w-7 h-7 transition-colors ${
                currentReel.isLiked ? 'text-red-500 fill-red-500 stroke-red-500' : 'stroke-[2]'
              }`}
            />
          </div>
          <span className="text-xs font-semibold">{currentReel.likes.toLocaleString()}</span>
        </button>

        {/* Comment */}
        <button
          type="button"
          onClick={() => setIsCommentsOpen(true)}
          className="flex flex-col items-center gap-1 cursor-pointer group"
        >
          <div className="p-2 rounded-full bg-black/30 backdrop-blur-sm group-active:scale-125 transition-transform">
            <MessageCircle className="w-7 h-7 stroke-[2]" />
          </div>
          <span className="text-xs font-semibold">{currentReel.comments.length}</span>
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={() => {
            onUpdateReel({ ...currentReel, shares: currentReel.shares + 1 });
            alert('Reel link copied to clipboard!');
          }}
          className="flex flex-col items-center gap-1 cursor-pointer group"
        >
          <div className="p-2 rounded-full bg-black/30 backdrop-blur-sm group-active:scale-125 transition-transform">
            <Send className="w-6 h-6 -rotate-12 stroke-[2]" />
          </div>
          <span className="text-xs font-semibold">{currentReel.shares}</span>
        </button>

        {/* Bookmark / Save */}
        <button
          type="button"
          onClick={handleToggleSave}
          className="flex flex-col items-center gap-1 cursor-pointer group"
        >
          <div className="p-2 rounded-full bg-black/30 backdrop-blur-sm group-active:scale-125 transition-transform">
            <Bookmark
              className={`w-6 h-6 ${
                currentReel.isSaved ? 'fill-white stroke-white' : 'stroke-[2]'
              }`}
            />
          </div>
        </button>

        {/* Spinning Vinyl Audio Disc */}
        <div className="mt-1 relative w-9 h-9 rounded-full border-2 border-white/60 bg-neutral-900 overflow-hidden flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
          <img
            src={currentReel.avatarUrl}
            alt="Audio creator"
            className="w-4 h-4 rounded-full object-cover"
          />
        </div>
      </div>

      {/* Bottom Creator Info & Caption Overlay */}
      <div className="absolute left-4 right-16 bottom-4 z-20 text-white drop-shadow text-left space-y-2">
        {/* Creator Info & Follow Button */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white cursor-pointer">
            <img
              src={currentReel.avatarUrl}
              alt={currentReel.creator}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-semibold text-sm cursor-pointer hover:underline">
            {currentReel.creator}
          </span>
          <button
            type="button"
            onClick={() => handleToggleFollow(currentReel.creator)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              followingCreators[currentReel.creator]
                ? 'bg-neutral-800/80 text-white border-neutral-700'
                : 'bg-white text-black border-white hover:bg-neutral-200'
            }`}
          >
            {followingCreators[currentReel.creator] ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Caption */}
        <p className="text-xs text-neutral-100 line-clamp-2">{currentReel.caption}</p>

        {/* Special Effect Tag */}
        {currentReel.effectName && (
          <div className="inline-flex items-center gap-1 text-[11px] bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-white/90">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>{currentReel.effectName}</span>
          </div>
        )}

        {/* Audio Track Ticker */}
        <div className="flex items-center gap-1.5 text-xs text-white/90">
          <Music className="w-3.5 h-3.5" />
          <span className="truncate max-w-[220px]">{currentReel.audioTrack}</span>
        </div>
      </div>

      {/* Reel Comments Drawer */}
      {isCommentsOpen && (
        <div className="absolute inset-x-0 bottom-0 top-1/3 z-30 bg-neutral-900/98 backdrop-blur-lg rounded-t-2xl border-t border-neutral-800 flex flex-col p-4 text-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-3">
            <h3 className="font-semibold text-sm">Comments ({currentReel.comments.length})</h3>
            <button
              type="button"
              onClick={() => setIsCommentsOpen(false)}
              className="p-1 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {currentReel.comments.length === 0 ? (
              <p className="text-center text-xs text-neutral-500 py-6">No comments yet. Be the first to comment!</p>
            ) : (
              currentReel.comments.map((comment) => (
                <div key={comment.id} className="flex items-start justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold">{comment.author}</span>
                      <span className="text-neutral-500 text-[10px]">{comment.timestamp}</span>
                    </div>
                    <p className="text-neutral-200">{comment.text}</p>
                  </div>
                  <button className="text-neutral-500 hover:text-red-500 p-1">
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add comment input */}
          <form onSubmit={handleAddComment} className="pt-3 border-t border-neutral-800 flex items-center gap-2">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Add a comment for the creator..."
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-full px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="px-3 py-2 text-xs font-semibold text-blue-500 hover:text-blue-400 disabled:opacity-40 cursor-pointer"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
