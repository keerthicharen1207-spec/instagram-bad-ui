import React, { useState } from 'react';
import { Post, Reel, StoryGroup } from '../types';
import {
  X,
  Image as ImageIcon,
  Film,
  Camera,
  Radio,
  Plus,
  Trash2,
  Sparkles,
  MapPin,
  Music,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPost: (newPost: Post) => void;
  onAddStory: (newStoryItem: { mediaUrl: string; caption?: string; filter?: string }) => void;
  onAddReel: (newReel: Reel) => void;
  onStartLive: () => void;
  currentUserAvatar: string;
  currentUsername: string;
}

type CreateTab = 'post' | 'story' | 'reel' | 'live';

const SAMPLE_POST_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
];

const REEL_AUDIO_OPTIONS = [
  'Billie Eilish - BIRDS OF A FEATHER',
  'Kendrick Lamar - Not Like Us',
  'Chappell Roan - Good Luck, Babe!',
  'Fred again.. - leavemealone',
  'Kavinsky - Nightcall (Synthwave)',
];

const REEL_EFFECTS = ['Normal', 'Cinematic 35mm', 'Retro VHS 90s', 'Golden Hour', 'Moody Teal'];

export const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onAddPost,
  onAddStory,
  onAddReel,
  onStartLive,
  currentUserAvatar,
  currentUsername,
}) => {
  const [activeTab, setActiveTab] = useState<CreateTab>('post');

  // Post state (supports carousel of up to 10 images!)
  const [selectedImages, setSelectedImages] = useState<string[]>([SAMPLE_POST_IMAGES[0]]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [postCaption, setPostCaption] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [postAudio, setPostAudio] = useState('');
  const [previewCarouselIndex, setPreviewCarouselIndex] = useState(0);

  // Story state
  const [storyImage, setStoryImage] = useState(SAMPLE_POST_IMAGES[1]);
  const [storyCaption, setStoryCaption] = useState('');
  const [storyFilter, setStoryFilter] = useState('Normal');

  // Reel state
  const [reelCaption, setReelCaption] = useState('');
  const [reelAudio, setReelAudio] = useState(REEL_AUDIO_OPTIONS[0]);
  const [reelEffect, setReelEffect] = useState(REEL_EFFECTS[1]);
  const [reelImage, setReelImage] = useState(SAMPLE_POST_IMAGES[2]);

  if (!isOpen) return null;

  // Add image to carousel (up to 10)
  const handleAddImage = (url: string) => {
    if (selectedImages.length >= 10) {
      alert('You can share a carousel set of up to 10 photos/videos on Instagram.');
      return;
    }
    setSelectedImages((prev) => [...prev, url]);
    setCustomImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    if (selectedImages.length <= 1) return;
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    if (previewCarouselIndex >= selectedImages.length - 1) {
      setPreviewCarouselIndex(Math.max(0, selectedImages.length - 2));
    }
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImages.length === 0) return;

    const newPost: Post = {
      id: 'post-user-' + Date.now(),
      username: currentUsername,
      avatarUrl: currentUserAvatar,
      images: selectedImages,
      caption: postCaption.trim() || 'Moments captured ✨',
      likes: 1,
      isLiked: true,
      comments: [],
      location: postLocation.trim() || undefined,
      audioTrack: postAudio.trim() || undefined,
      postedAgo: 'JUST NOW',
    };

    onAddPost(newPost);
    onClose();
  };

  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStory({
      mediaUrl: storyImage,
      caption: storyCaption.trim() || undefined,
      filter: storyFilter !== 'Normal' ? storyFilter : undefined,
    });
    onClose();
  };

  const handleSubmitReel = (e: React.FormEvent) => {
    e.preventDefault();
    const newReel: Reel = {
      id: 'reel-user-' + Date.now(),
      creator: currentUsername,
      avatarUrl: currentUserAvatar,
      videoUrl: reelImage,
      videoGradient: 'from-purple-900 via-indigo-900 to-black',
      audioTrack: reelAudio,
      caption: reelCaption.trim() || 'New reel drop! 🔥 #reels #explore',
      effectName: reelEffect !== 'Normal' ? reelEffect : undefined,
      likes: 1,
      isLiked: true,
      comments: [],
      shares: 0,
      views: 1,
    };

    onAddReel(newReel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 select-none">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3 bg-neutral-900">
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="font-semibold text-sm text-white">Create New</h2>
          <div className="w-5" />
        </div>

        {/* Tab Selection: Post, Story, Reel, Live */}
        <div className="flex border-b border-neutral-800 bg-black/40">
          <button
            type="button"
            onClick={() => setActiveTab('post')}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'post'
                ? 'text-white border-b-2 border-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Post</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('story')}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'story'
                ? 'text-white border-b-2 border-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Story</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reel')}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'reel'
                ? 'text-white border-b-2 border-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Reel</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onStartLive();
            }}
            className="flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Go Live</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: POST (Single or Carousel up to 10 images) */}
          {activeTab === 'post' && (
            <form onSubmit={handleSubmitPost} className="space-y-4">
              {/* Image Carousel Preview */}
              <div className="relative aspect-square w-full bg-black rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center">
                <img
                  src={selectedImages[previewCarouselIndex]}
                  alt="Post preview"
                  className="w-full h-full object-cover"
                />

                {/* Carousel indicators */}
                {selectedImages.length > 1 && (
                  <>
                    <div className="absolute top-3 right-3 bg-black/70 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                      {previewCarouselIndex + 1} / {selectedImages.length}
                    </div>

                    <button
                      type="button"
                      disabled={previewCarouselIndex === 0}
                      onClick={() => setPreviewCarouselIndex((p) => Math.max(0, p - 1))}
                      className="absolute left-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      disabled={previewCarouselIndex === selectedImages.length - 1}
                      onClick={() => setPreviewCarouselIndex((p) => Math.min(selectedImages.length - 1, p + 1))}
                      className="absolute right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Carousel Strip & Add Button (Up to 10 photos/videos) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-neutral-300 font-medium">
                    Carousel Media ({selectedImages.length}/10):
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Select below or paste custom URL
                  </span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 cursor-pointer ${
                        previewCarouselIndex === idx ? 'border-blue-500' : 'border-neutral-700'
                      }`}
                      onClick={() => setPreviewCarouselIndex(idx)}
                    >
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                      {selectedImages.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(idx);
                          }}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-red-600/90 rounded-full text-white hover:bg-red-700"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Sample Photo Picker to easily add to carousel */}
                <div className="mt-2 pt-2 border-t border-neutral-800">
                  <p className="text-[11px] text-neutral-400 mb-1.5">Add sample photo to carousel:</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {SAMPLE_POST_IMAGES.slice(0, 10).map((sampleImg, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddImage(sampleImg)}
                        className="aspect-square rounded-md overflow-hidden border border-neutral-700 hover:opacity-80 transition-opacity cursor-pointer relative group"
                        title="Add to post"
                      >
                        <img src={sampleImg} alt="Sample" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom image URL input */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="Or paste any image URL..."
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customImageUrl.trim()) handleAddImage(customImageUrl.trim());
                    }}
                    className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Caption */}
              <div>
                <textarea
                  rows={3}
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  placeholder="Write a caption... (hashtags, thoughts, story)"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                />
              </div>

              {/* Location & Music */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="text"
                    value={postLocation}
                    onChange={(e) => setPostLocation(e.target.value)}
                    placeholder="Add Location..."
                    className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2">
                  <Music className="w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="text"
                    value={postAudio}
                    onChange={(e) => setPostAudio(e.target.value)}
                    placeholder="Add Music..."
                    className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Share button */}
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Share to Feed
              </button>
            </form>
          )}

          {/* TAB 2: STORY (Casual photo/vertical video, 24h expiration) */}
          {activeTab === 'story' && (
            <form onSubmit={handleSubmitStory} className="space-y-4">
              <div className="relative aspect-[9/16] max-h-72 mx-auto bg-black rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center">
                <img src={storyImage} alt="Story preview" className="w-full h-full object-cover" />
                {storyCaption && (
                  <div className="absolute inset-x-4 bottom-8 text-center pointer-events-none">
                    <span className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-md text-xs font-medium">
                      {storyCaption}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Select Story Photo:
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {SAMPLE_POST_IMAGES.slice(0, 5).map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setStoryImage(img)}
                      className={`aspect-square rounded-md overflow-hidden border-2 cursor-pointer ${
                        storyImage === img ? 'border-pink-500 ring-2 ring-pink-500/50' : 'border-neutral-700'
                      }`}
                    >
                      <img src={img} alt="Story thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Story Filter:
                </label>
                <div className="flex gap-2">
                  {['Normal', 'Clarendon', 'Juno', 'Vintage', 'Lark'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setStoryFilter(f)}
                      className={`px-3 py-1 text-xs rounded-full border cursor-pointer ${
                        storyFilter === f
                          ? 'bg-white text-black border-white font-semibold'
                          : 'border-neutral-700 text-neutral-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={storyCaption}
                  onChange={(e) => setStoryCaption(e.target.value)}
                  placeholder="Add a text sticker or caption..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-yellow-500 text-white font-semibold text-xs rounded-xl cursor-pointer transition-opacity hover:opacity-90"
              >
                Share to Your Story (24h)
              </button>
            </form>
          )}

          {/* TAB 3: REEL (Short-form video with audio and special effects) */}
          {activeTab === 'reel' && (
            <form onSubmit={handleSubmitReel} className="space-y-4">
              <div className="relative aspect-[9/16] max-h-64 mx-auto bg-black rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center">
                <img src={reelImage} alt="Reel preview" className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-[11px] text-white/90 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                    🎵 {reelAudio}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Audio Track:
                </label>
                <select
                  value={reelAudio}
                  onChange={(e) => setReelAudio(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-xs text-white focus:outline-none cursor-pointer"
                >
                  {REEL_AUDIO_OPTIONS.map((track) => (
                    <option key={track} value={track}>
                      🎵 {track}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Special Effect:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {REEL_EFFECTS.map((eff) => (
                    <button
                      key={eff}
                      type="button"
                      onClick={() => setReelEffect(eff)}
                      className={`px-2.5 py-1 text-[11px] rounded-full border cursor-pointer ${
                        reelEffect === eff
                          ? 'bg-purple-600 text-white border-purple-500 font-semibold'
                          : 'border-neutral-700 text-neutral-300'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      {eff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <textarea
                  rows={2}
                  value={reelCaption}
                  onChange={(e) => setReelCaption(e.target.value)}
                  placeholder="Write a reel caption & hashtags (#reels #trending)..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Share Reel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
