import React, { useState, useEffect } from 'react';
import { Post, StoryGroup, Comment } from '../types';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Plus,
  Volume2,
  Music,
  MapPin,
  Smile,
  Radio
} from 'lucide-react';
import { RunawayButton } from '../components/RunawayButton';
import { DynamicSizeButton } from '../components/DynamicSizeButton';

interface FeedViewProps {
  posts: Post[];
  stories: StoryGroup[];
  onUpdatePost: (updatedPost: Post) => void;
  onOpenStory: (index: number) => void;
  onOpenCreate: () => void;
  onOpenLive: () => void;
  onShareToChat?: (post: Post) => void;
  onScrollOffset?: (y: number) => void;
  currentUsername: string;
  currentUserAvatar: string;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  stories,
  onUpdatePost,
  onOpenStory,
  onOpenCreate,
  onOpenLive,
  onShareToChat,
  onScrollOffset,
  currentUsername,
  currentUserAvatar,
}) => {
  // Active slide index for each carousel post (keyed by post id)
  const [carouselIndices, setCarouselIndices] = useState<Record<string, number>>({});
  // Inline comment inputs
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  // Heart pop animation on double-tap
  const [heartAnimPostId, setHeartAnimPostId] = useState<string | null>(null);
  // Comments sheet/modal for specific post
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);

  // Track window scroll to make navigation shift unexpectedly!
  useEffect(() => {
    const handleScroll = () => {
      if (onScrollOffset) {
        onScrollOffset(window.scrollY);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onScrollOffset]);

  // Toggle Like with animation
  const handleToggleLike = (post: Post) => {
    const isNowLiked = !post.isLiked;
    onUpdatePost({
      ...post,
      isLiked: isNowLiked,
      likes: isNowLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
    });
  };

  // Double tap like on image
  const handleDoubleTap = (post: Post) => {
    if (!post.isLiked) {
      onUpdatePost({
        ...post,
        isLiked: true,
        likes: post.likes + 1,
      });
    }
    setHeartAnimPostId(post.id);
    setTimeout(() => setHeartAnimPostId(null), 800);
  };

  // Toggle Save / Bookmark
  const handleToggleSave = (post: Post) => {
    onUpdatePost({
      ...post,
      isSaved: !post.isSaved,
    });
  };

  // Carousel navigation
  const handleCarouselNav = (postId: string, direction: 'prev' | 'next', max: number) => {
    setCarouselIndices((prev) => {
      const current = prev[postId] || 0;
      let next = direction === 'next' ? current + 1 : current - 1;
      if (next < 0) next = 0;
      if (next >= max) next = max - 1;
      return { ...prev, [postId]: next };
    });
  };

  // Add Comment
  const handleAddComment = (post: Post) => {
    const text = (commentInputs[post.id] || '').trim();
    if (!text) return;

    const newComment: Comment = {
      id: 'comm-' + Date.now(),
      author: currentUsername,
      authorAvatar: currentUserAvatar,
      text,
      timestamp: 'Just now',
      likes: 0,
    };

    onUpdatePost({
      ...post,
      comments: [...post.comments, newComment],
    });

    setCommentInputs((prev) => ({ ...prev, [post.id]: '' }));
  };

  return (
    <div className="max-w-lg mx-auto pb-20 select-none">
      {/* 1. STORIES TRAY */}
      <div className="py-3 px-2 border-b border-neutral-800/80 overflow-x-auto no-scrollbar flex items-center gap-3">
        {/* "Your Story" Button */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group">
          <div className="relative">
            <div
              onClick={() => onOpenStory(0)}
              className="w-16 h-16 rounded-full p-[2px] story-ring-gradient cursor-pointer"
            >
              <img
                src={currentUserAvatar}
                alt="Your story"
                className="w-full h-full object-cover rounded-full border-2 border-black"
              />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenCreate();
              }}
              className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-black hover:bg-blue-600 cursor-pointer shadow"
              title="Add to story"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
          <span className="text-[11px] text-neutral-300 truncate max-w-[68px]">Your Story</span>
        </div>

        {/* Stories from Following */}
        {stories.slice(1).map((storyGroup, idx) => {
          const actualIndex = idx + 1;
          return (
            <div
              key={storyGroup.id}
              onClick={() => {
                if (storyGroup.isLive) {
                  onOpenLive();
                } else {
                  onOpenStory(actualIndex);
                }
              }}
              className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group"
            >
              <div className="relative">
                <div
                  className={`w-16 h-16 rounded-full p-[2px] transition-transform group-hover:scale-105 ${
                    storyGroup.isLive
                      ? 'live-badge-gradient animate-pulse'
                      : storyGroup.hasUnseen
                      ? 'story-ring-gradient'
                      : 'border border-neutral-700'
                  }`}
                >
                  <img
                    src={storyGroup.avatarUrl}
                    alt={storyGroup.username}
                    className="w-full h-full object-cover rounded-full border-2 border-black"
                  />
                </div>

                {/* LIVE Badge */}
                {storyGroup.isLive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-gradient-to-r from-red-600 to-pink-600 text-white text-[9px] font-bold rounded-sm border border-black uppercase tracking-wider flex items-center gap-0.5">
                    <Radio className="w-2.5 h-2.5 animate-spin" />
                    <span>LIVE</span>
                  </div>
                )}
              </div>
              <span className="text-[11px] text-neutral-300 truncate max-w-[68px]">
                {storyGroup.username}
              </span>
            </div>
          );
        })}
      </div>

      {/* 2. POSTS FEED */}
      <div className="divide-y divide-neutral-900">
        {posts.map((post) => {
          const images = post.images && post.images.length > 0 ? post.images : ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80'];
          const currentIndex = carouselIndices[post.id] || 0;
          const isCarousel = images.length > 1;

          return (
            <article key={post.id} className="pt-3 pb-4">
              {/* Post Header: Avatar, Username, Location, More */}
              <div className="flex items-center justify-between px-3.5 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full p-[1.5px] story-ring-gradient cursor-pointer">
                    <img
                      src={post.avatarUrl}
                      alt={post.username}
                      className="w-full h-full object-cover rounded-full border border-black"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-xs text-white hover:underline cursor-pointer">
                        {post.username}
                      </span>
                      <span className="text-[10px] text-neutral-400">• {post.postedAgo}</span>
                    </div>
                    {post.location && (
                      <div className="flex items-center gap-0.5 text-[10px] text-neutral-400">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>{post.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="text-neutral-400 hover:text-white cursor-pointer p-1"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Media Container: Single Photo or Carousel up to 10 photos/videos */}
              <div
                className="relative aspect-square w-full bg-neutral-950 overflow-hidden select-none cursor-pointer"
                onDoubleClick={() => handleDoubleTap(post)}
              >
                <img
                  src={images[currentIndex]}
                  alt={`${post.username} photo ${currentIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Double-tap heart pop animation */}
                {heartAnimPostId === post.id && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Heart className="w-24 h-24 text-white fill-white animate-ping opacity-90 drop-shadow-2xl" />
                  </div>
                )}

                {/* Carousel badge (e.g. 1/4) */}
                {isCarousel && (
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    {currentIndex + 1}/{images.length}
                  </div>
                )}

                {/* Carousel prev/next chevrons */}
                {isCarousel && currentIndex > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCarouselNav(post.id, 'prev', images.length);
                    }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-opacity cursor-pointer shadow"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}

                {isCarousel && currentIndex < images.length - 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCarouselNav(post.id, 'next', images.length);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-opacity cursor-pointer shadow"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Action Bar (Like, Comment, Share, Carousel Dots, Bookmark) */}
              <div className="flex items-center justify-between px-3.5 pt-3 pb-1">
                <div className="flex items-center gap-4">
                  {/* Heart / Like with Dynamic Sizing & Dodging */}
                  <DynamicSizeButton
                    shrinkMode={true}
                    onClick={() => handleToggleLike(post)}
                    title={post.isLiked ? 'Unlike (Or will it delete?)' : 'Send Toxic Reaction'}
                    className="p-1"
                  >
                    <Heart
                      className={`w-6 h-6 transition-colors ${
                        post.isLiked
                          ? 'text-red-500 fill-red-500 stroke-red-500 animate-pulse'
                          : 'text-white hover:text-neutral-400 stroke-[1.8]'
                      }`}
                    />
                  </DynamicSizeButton>

                  {/* Comment Button (Runs away slightly on approach) */}
                  <RunawayButton
                    maxEvasions={3}
                    evasionRadius={35}
                    onClick={() => setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id)}
                    className="text-white hover:text-neutral-400 p-1"
                    title="Leave unsolicited criticism"
                  >
                    <MessageCircle className="w-6 h-6 stroke-[1.8]" />
                  </RunawayButton>

                  {/* Share to Chat */}
                  <RunawayButton
                    maxEvasions={3}
                    evasionRadius={40}
                    onClick={() => {
                      if (onShareToChat) onShareToChat(post);
                    }}
                    className="text-white hover:text-neutral-400 p-1"
                    title="Leak to authorities"
                  >
                    <Send className="w-6 h-6 -rotate-12 stroke-[1.8]" />
                  </RunawayButton>
                </div>

                {/* Carousel Dots indicator */}
                {isCarousel && (
                  <div className="flex items-center gap-1.5">
                    {images.map((_, dotIdx) => (
                      <div
                        key={dotIdx}
                        className={`rounded-full transition-all ${
                          currentIndex === dotIdx
                            ? 'w-1.5 h-1.5 bg-blue-500'
                            : 'w-1 h-1 bg-neutral-600'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Save / Bookmark (Shrinks dynamically when cursor approaches) */}
                <DynamicSizeButton
                  shrinkMode={true}
                  onClick={() => handleToggleSave(post)}
                  title={post.isSaved ? 'Remove from Discard Bin' : 'Trash Post Permanently'}
                  className="p-1 text-white hover:text-neutral-400"
                >
                  <Bookmark
                    className={`w-6 h-6 ${
                      post.isSaved ? 'fill-white stroke-white' : 'stroke-[1.8]'
                    }`}
                  />
                </DynamicSizeButton>
              </div>

              {/* Likes counter */}
              <div className="px-3.5 py-0.5">
                <span className="font-semibold text-xs text-white">
                  {post.likes.toLocaleString()} likes
                </span>
              </div>

              {/* Caption & Hashtags */}
              <div className="px-3.5 pt-1 text-xs text-neutral-200">
                <span className="font-semibold text-white mr-1.5">{post.username}</span>
                <span className="whitespace-pre-line">{post.caption}</span>
              </div>

              {/* Audio tag if present */}
              {post.audioTrack && (
                <div className="px-3.5 pt-1 flex items-center gap-1 text-[11px] text-neutral-400">
                  <Music className="w-3 h-3" />
                  <span>{post.audioTrack}</span>
                </div>
              )}

              {/* Comments counter button */}
              {post.comments.length > 0 && (
                <div className="px-3.5 pt-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id)}
                    className="text-xs text-neutral-400 hover:text-neutral-200 cursor-pointer"
                  >
                    View all {post.comments.length} comments
                  </button>
                </div>
              )}

              {/* Expandable Comments Drawer / List */}
              {activeCommentsPostId === post.id && (
                <div className="px-3.5 pt-2 pb-1 space-y-2 border-t border-neutral-800/60 mt-2">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start justify-between text-xs">
                      <div className="flex gap-2">
                        <span className="font-semibold text-white">{comment.author}</span>
                        <span className="text-neutral-300">{comment.text}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedComments = post.comments.map((c) =>
                            c.id === comment.id
                              ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
                              : c
                          );
                          onUpdatePost({ ...post, comments: updatedComments });
                        }}
                        className="text-neutral-500 hover:text-red-500 p-0.5"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            comment.isLiked ? 'text-red-500 fill-red-500' : ''
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Inline Add Comment Input */}
              <div className="px-3.5 pt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment(post);
                  }}
                  placeholder="Add a comment..."
                  className="flex-1 bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
                {Boolean((commentInputs[post.id] || '').trim()) && (
                  <button
                    type="button"
                    onClick={() => handleAddComment(post)}
                    className="text-xs font-semibold text-blue-500 hover:text-blue-400 cursor-pointer"
                  >
                    Post
                  </button>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setCommentInputs((prev) => ({
                      ...prev,
                      [post.id]: (prev[post.id] || '') + ' ❤️',
                    }))
                  }
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  <Smile className="w-4 h-4" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
