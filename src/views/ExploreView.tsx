import React, { useState } from 'react';
import { Post, Reel } from '../types';
import {
  Search,
  X,
  Layers,
  Clapperboard,
  Heart,
  MessageCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ExploreViewProps {
  posts: Post[];
  reels: Reel[];
  onOpenPost: (post: Post) => void;
  onOpenReel: (reel: Reel) => void;
}

const CATEGORIES = [
  'For You',
  'Travel',
  'Architecture',
  'Coffee',
  'Design',
  'Ceramics',
  'Music',
  'Photography',
];

export const ExploreView: React.FC<ExploreViewProps> = ({
  posts,
  reels,
  onOpenPost,
  onOpenReel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('For You');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [detailCarouselIdx, setDetailCarouselIdx] = useState(0);

  // Combine items for the explore grid
  const filteredPosts = posts.filter(
    (p) =>
      p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-lg mx-auto pb-20 select-none">
      {/* 1. SEARCH BAR */}
      <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-md px-3 py-2 border-b border-neutral-900">
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, accounts, audio..."
            className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-neutral-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 2. TOPIC PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 pb-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-white text-black'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. EXPLORE GRID (Staggered 3-column with tall reels & carousel icons) */}
      <div className="grid grid-cols-3 gap-1 p-1">
        {filteredPosts.map((post, idx) => {
          const isCarousel = post.images && post.images.length > 1;
          const isReelSpan = idx % 5 === 2; // Every 5th item is styled like a tall Reel tile

          return (
            <div
              key={post.id}
              onClick={() => {
                setSelectedPost(post);
                setDetailCarouselIdx(0);
              }}
              className={`relative bg-neutral-900 overflow-hidden cursor-pointer group ${
                isReelSpan ? 'row-span-2 aspect-[9/16]' : 'aspect-square'
              }`}
            >
              <img
                src={post.images[0]}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Multi-photo Carousel Indicator Icon */}
              {isCarousel && !isReelSpan && (
                <div className="absolute top-2 right-2 text-white/90 drop-shadow">
                  <Layers className="w-4 h-4" />
                </div>
              )}

              {/* Tall Reel indicator */}
              {isReelSpan && (
                <div className="absolute top-2 right-2 text-white/90 drop-shadow flex items-center gap-1">
                  <Clapperboard className="w-4 h-4" />
                </div>
              )}

              {/* Hover overlay with likes and comments count */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-xs font-bold">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{post.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{post.comments.length}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. POST DETAIL MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-neutral-900 bg-black/80">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-neutral-700">
                  <img
                    src={selectedPost.avatarUrl}
                    alt={selectedPost.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-semibold text-xs text-white">{selectedPost.username}</span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Image / Carousel */}
            <div className="relative aspect-square w-full bg-black">
              <img
                src={selectedPost.images[detailCarouselIdx] || selectedPost.images[0]}
                alt="Post preview"
                className="w-full h-full object-cover"
              />

              {selectedPost.images.length > 1 && (
                <>
                  <div className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {detailCarouselIdx + 1} / {selectedPost.images.length}
                  </div>

                  {detailCarouselIdx > 0 && (
                    <button
                      onClick={() => setDetailCarouselIdx((p) => Math.max(0, p - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 text-white rounded-full"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}

                  {detailCarouselIdx < selectedPost.images.length - 1 && (
                    <button
                      onClick={() =>
                        setDetailCarouselIdx((p) => Math.min(selectedPost.images.length - 1, p + 1))
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 text-white rounded-full"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Caption & Comments info */}
            <div className="p-3.5 space-y-2 overflow-y-auto max-h-48 text-xs">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="font-semibold text-white">
                  {selectedPost.likes.toLocaleString()} likes
                </span>
                <span className="text-[10px] text-neutral-500">{selectedPost.postedAgo}</span>
              </div>

              <p className="text-neutral-200">
                <span className="font-semibold text-white mr-1">{selectedPost.username}</span>
                {selectedPost.caption}
              </p>

              {selectedPost.comments.length > 0 && (
                <div className="pt-2 border-t border-neutral-900 space-y-1.5">
                  {selectedPost.comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-1.5 text-neutral-300">
                      <span className="font-semibold text-white">{c.author}:</span>
                      <span>{c.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
