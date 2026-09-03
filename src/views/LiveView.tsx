import React, { useState, useEffect } from 'react';
import { LiveStream } from '../types';
import {
  Radio,
  X,
  Heart,
  Send,
  Users,
  MessageCircle,
  HelpCircle,
  Volume2,
  VolumeX,
  Camera,
  Mic,
  MicOff,
  SwitchCamera
} from 'lucide-react';

interface LiveViewProps {
  liveStream: LiveStream;
  onClose: () => void;
  currentUsername: string;
  currentUserAvatar: string;
}

interface FloatingHeart {
  id: number;
  color: string;
  left: number; // percentage
}

export const LiveView: React.FC<LiveViewProps> = ({
  liveStream,
  onClose,
  currentUsername,
  currentUserAvatar,
}) => {
  const [isBroadcasterMode, setIsBroadcasterMode] = useState(false);
  const [viewerCount, setViewerCount] = useState(liveStream.viewerCount);
  const [comments, setComments] = useState(liveStream.comments);
  const [commentText, setCommentText] = useState('');
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [cameraFlipped, setCameraFlipped] = useState(false);

  // Dynamic viewer count fluctuate slightly
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Send rising floating heart
  const triggerHeart = () => {
    const colors = ['#ec4899', '#ef4444', '#f43f5e', '#a855f7', '#eab308'];
    const newHeart: FloatingHeart = {
      id: Date.now() + Math.random(),
      color: colors[Math.floor(Math.random() * colors.length)],
      left: 70 + Math.random() * 20, // right aligned
    };

    setFloatingHearts((prev) => [...prev, newHeart]);

    // Clean up heart after 2s
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 2000);
  };

  // Send live comment
  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: 'lc-' + Date.now(),
      username: currentUsername,
      avatarUrl: currentUserAvatar,
      text: commentText.trim(),
      timestamp: 'Just now',
    };

    setComments((prev) => [...prev, newComment]);
    setCommentText('');
    triggerHeart();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none">
      {/* Live Stream Main Screen */}
      <div className="relative w-full max-w-md h-full max-h-[96vh] sm:rounded-2xl overflow-hidden bg-neutral-950 flex flex-col justify-between shadow-2xl border border-neutral-900">
        {/* Background Visual: Live Stream Broadcast visual */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${
            isBroadcasterMode
              ? 'from-zinc-900 via-neutral-950 to-black'
              : liveStream.streamGradient
          } flex items-center justify-center`}
        >
          {/* Simulated DJ / Host background photo */}
          {!isBroadcasterMode && (
            <img
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000&auto=format&fit=crop&q=80"
              alt="Live stream feed"
              className="w-full h-full object-cover opacity-80"
            />
          )}

          {/* Broadcaster selfie preview simulation */}
          {isBroadcasterMode && (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <img
                src={currentUserAvatar}
                alt="Broadcasting"
                className={`w-full h-full object-cover ${cameraFlipped ? '-scale-x-100' : ''}`}
              />
              <div className="absolute top-16 bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow">
                You are LIVE to 420 followers
              </div>
            </div>
          )}

          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none" />
        </div>

        {/* Floating Hearts Container */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
          {floatingHearts.map((heart) => (
            <div
              key={heart.id}
              className="absolute bottom-20 animate-float-heart"
              style={{
                left: `${heart.left}%`,
                color: heart.color,
                animation: 'floatUp 1.8s ease-out forwards',
              }}
            >
              <Heart className="w-8 h-8 fill-current drop-shadow" />
            </div>
          ))}
        </div>

        {/* Top Header: Broadcaster Avatar, Live Badge, Viewer Count, Mode Toggle, Close */}
        <div className="relative z-20 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full ring-2 ring-red-500 overflow-hidden">
              <img
                src={isBroadcasterMode ? currentUserAvatar : liveStream.hostAvatar}
                alt="Host"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-white drop-shadow">
                  {isBroadcasterMode ? currentUsername : liveStream.hostUsername}
                </span>
                <span className="px-1.5 py-0.5 bg-gradient-to-r from-red-600 to-pink-600 text-white text-[9px] font-extrabold rounded-sm uppercase tracking-wider flex items-center gap-0.5">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-neutral-300 drop-shadow truncate max-w-[160px]">
                {liveStream.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-xs text-white font-semibold">
              <Users className="w-3.5 h-3.5 text-red-400" />
              <span>{viewerCount.toLocaleString()}</span>
            </div>

            {/* Toggle Broadcaster vs Watcher mode for testing */}
            <button
              type="button"
              onClick={() => setIsBroadcasterMode(!isBroadcasterMode)}
              className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-full backdrop-blur-md cursor-pointer"
            >
              {isBroadcasterMode ? 'Watch DJ' : 'My Broadcast'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Middle Stream Indicators / Broadcaster Controls */}
        {isBroadcasterMode && (
          <div className="relative z-20 flex justify-end gap-2 px-4">
            <button
              type="button"
              onClick={() => setIsMicMuted(!isMicMuted)}
              className="p-2.5 bg-black/50 backdrop-blur-md rounded-full text-white cursor-pointer"
              title="Toggle Mic"
            >
              {isMicMuted ? <MicOff className="w-5 h-5 text-red-400" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={() => setCameraFlipped(!cameraFlipped)}
              className="p-2.5 bg-black/50 backdrop-blur-md rounded-full text-white cursor-pointer"
              title="Flip Camera"
            >
              <SwitchCamera className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Bottom Section: Live Comments Stream + Interactive Bar */}
        <div className="relative z-20 p-3 space-y-2">
          {/* Rolling Comments Stream */}
          <div className="max-h-48 overflow-y-auto space-y-1.5 no-scrollbar pr-2 flex flex-col justify-end">
            {comments.slice(-8).map((comm) => (
              <div
                key={comm.id}
                className="flex items-start gap-2 bg-black/40 backdrop-blur-sm px-2.5 py-1.5 rounded-xl text-xs max-w-[85%]"
              >
                <img
                  src={comm.avatarUrl}
                  alt={comm.username}
                  className="w-4 h-4 rounded-full object-cover flex-shrink-0 mt-0.5"
                />
                <div className="text-white">
                  <span className="font-bold text-neutral-200 mr-1.5">{comm.username}</span>
                  <span className="text-neutral-100">{comm.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Chat Input & Reactions Rail */}
          <div className="flex items-center gap-2 pt-1">
            <form onSubmit={handleSendComment} className="flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Comment on live..."
                className="w-full bg-black/50 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-xs text-white placeholder-neutral-300 focus:outline-none focus:border-white transition-colors"
              />
            </form>

            <button
              type="button"
              onClick={triggerHeart}
              className="p-2.5 bg-gradient-to-tr from-pink-600 to-rose-500 rounded-full text-white active:scale-125 transition-transform cursor-pointer shadow-lg"
              title="Send Heart"
            >
              <Heart className="w-5 h-5 fill-white stroke-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
