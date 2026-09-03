import React, { useState } from 'react';
import { UserProfile, Post, Reel } from '../types';
import {
  Grid,
  Clapperboard,
  Bookmark,
  UserCheck,
  Menu,
  Plus,
  Layers,
  Heart,
  MessageCircle,
  ExternalLink,
  Settings,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { RunawayButton } from '../components/RunawayButton';

interface ProfileViewProps {
  user: UserProfile;
  userPosts: Post[];
  userReels: Reel[];
  onOpenPost: (post: Post) => void;
  onOpenCreate: () => void;
  onLogout?: () => void;
}

const HIGHLIGHTS = [
  { id: 'h-1', title: 'Travel ✈️', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=80' },
  { id: 'h-2', title: 'Kyoto ⛩️', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80' },
  { id: 'h-3', title: 'Design 🎨', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&auto=format&fit=crop&q=80' },
  { id: 'h-4', title: 'Studio 🏺', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200&auto=format&fit=crop&q=80' },
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  userPosts,
  userReels,
  onOpenPost,
  onOpenCreate,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'reels' | 'saved' | 'tagged'>('grid');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bioText, setBioText] = useState(user.bio);
  const [fullName, setFullName] = useState(user.fullName);

  const savedPosts = userPosts.filter((p) => p.isSaved);

  return (
    <div className="max-w-lg mx-auto pb-20 select-none text-white">
      {/* 1. TOP HEADER */}
      <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-neutral-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 cursor-pointer">
          <span className="font-bold text-base">{user.username}</span>
          <ChevronDown className="w-4 h-4 text-neutral-400" />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenCreate}
            className="text-white hover:text-neutral-400 cursor-pointer"
            title="Create"
          >
            <Plus className="w-6 h-6 stroke-[1.8]" />
          </button>
          <button className="text-white hover:text-neutral-400 cursor-pointer" title="Settings">
            <Menu className="w-6 h-6 stroke-[1.8]" />
          </button>
        </div>
      </div>

      {/* 2. PROFILE INFO & STATS */}
      <div className="px-4 py-3 space-y-3">
        <div className="flex items-center justify-between gap-4">
          {/* Avatar with Story Ring */}
          <div className="w-20 h-20 rounded-full p-[2px] story-ring-gradient flex-shrink-0 cursor-pointer">
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-full h-full object-cover rounded-full border-2 border-black"
            />
          </div>

          {/* Stats */}
          <div className="flex-1 flex justify-around text-center">
            <div>
              <span className="block font-bold text-sm">{userPosts.length}</span>
              <span className="text-xs text-neutral-400">posts</span>
            </div>
            <div>
              <span className="block font-bold text-sm">
                {(user.followersCount / 1000).toFixed(1)}K
              </span>
              <span className="text-xs text-neutral-400">followers</span>
            </div>
            <div>
              <span className="block font-bold text-sm">{user.followingCount}</span>
              <span className="text-xs text-neutral-400">following</span>
            </div>
          </div>
        </div>

        {/* Name & Bio */}
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-xs text-white">{fullName}</span>
            {user.isVerified && (
              <span className="w-3.5 h-3.5 bg-blue-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                ✓
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-300 whitespace-pre-line leading-relaxed">{bioText}</p>
          {user.websiteUrl && (
            <a
              href={user.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline pt-0.5"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{user.websiteUrl.replace('https://', '')}</span>
            </a>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Edit profile
          </button>
          <button
            type="button"
            onClick={() => alert('Profile link copied to clipboard!')}
            className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Share profile
          </button>
          {onLogout && (
            <RunawayButton
              maxEvasions={3}
              evasionRadius={30}
              onClick={onLogout}
              className="px-3 py-1.5 bg-red-950/70 border border-red-800/80 hover:bg-red-900 rounded-lg text-xs font-semibold text-red-300 flex items-center justify-center gap-1 cursor-pointer"
              title="Return to Frustragram Login / 10s Blackout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </RunawayButton>
          )}
        </div>

        {/* 3. STORY HIGHLIGHTS */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pt-2 pb-1">
          {HIGHLIGHTS.map((h) => (
            <div key={h.id} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
              <div className="w-14 h-14 rounded-full p-[1.5px] border border-neutral-700 hover:border-neutral-500 transition-colors">
                <img
                  src={h.image}
                  alt={h.title}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-[10px] text-neutral-300 truncate max-w-[60px]">{h.title}</span>
            </div>
          ))}
          {/* New highlight button */}
          <div
            onClick={onOpenCreate}
            className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-neutral-400">New</span>
          </div>
        </div>
      </div>

      {/* 4. PROFILE TABS (GRID, REELS, SAVED, TAGGED) */}
      <div className="flex border-t border-neutral-900 mt-2">
        <button
          type="button"
          onClick={() => setActiveTab('grid')}
          className={`flex-1 py-3 flex items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'grid' ? 'border-b-2 border-white text-white' : 'text-neutral-500'
          }`}
          aria-label="Posts grid"
        >
          <Grid className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reels')}
          className={`flex-1 py-3 flex items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'reels' ? 'border-b-2 border-white text-white' : 'text-neutral-500'
          }`}
          aria-label="Reels tab"
        >
          <Clapperboard className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-3 flex items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'saved' ? 'border-b-2 border-white text-white' : 'text-neutral-500'
          }`}
          aria-label="Saved posts"
        >
          <Bookmark className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tagged')}
          className={`flex-1 py-3 flex items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'tagged' ? 'border-b-2 border-white text-white' : 'text-neutral-500'
          }`}
          aria-label="Tagged photos"
        >
          <UserCheck className="w-5 h-5" />
        </button>
      </div>

      {/* 5. TAB CONTENT */}
      {activeTab === 'grid' && (
        <div className="grid grid-cols-3 gap-0.5">
          {userPosts.map((post) => {
            const isCarousel = post.images && post.images.length > 1;
            return (
              <div
                key={post.id}
                onClick={() => onOpenPost(post)}
                className="relative aspect-square bg-neutral-900 cursor-pointer group overflow-hidden"
              >
                <img
                  src={post.images[0]}
                  alt="Post preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {isCarousel && (
                  <div className="absolute top-1.5 right-1.5 text-white/90 drop-shadow">
                    <Layers className="w-4 h-4" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs font-semibold">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>{post.comments.length}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'reels' && (
        <div className="grid grid-cols-3 gap-0.5">
          {userReels.map((reel) => (
            <div
              key={reel.id}
              className="relative aspect-[9/16] bg-neutral-900 cursor-pointer group overflow-hidden"
            >
              <img
                src={reel.videoUrl || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80'}
                alt={reel.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-white text-[10px] font-semibold drop-shadow">
                <Clapperboard className="w-3 h-3" />
                <span>{(reel.views || reel.likes * 4).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="grid grid-cols-3 gap-0.5">
          {savedPosts.length === 0 ? (
            <div className="col-span-3 py-16 text-center text-xs text-neutral-500">
              No saved posts yet. Bookmark posts to see them here.
            </div>
          ) : (
            savedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onOpenPost(post)}
                className="relative aspect-square bg-neutral-900 cursor-pointer overflow-hidden"
              >
                <img src={post.images[0]} alt="Saved" className="w-full h-full object-cover" />
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'tagged' && (
        <div className="py-16 text-center text-xs text-neutral-500">
          When photos and videos tag you, they will appear here.
        </div>
      )}

      {/* 6. EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4">
            <h3 className="font-semibold text-sm text-center">Edit Profile</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-2 bg-neutral-800 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-2 bg-blue-600 rounded-lg text-xs font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
