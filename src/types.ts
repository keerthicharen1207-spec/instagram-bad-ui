export type ViewType = 'feed' | 'explore' | 'reels' | 'shop' | 'profile' | 'chat' | 'live';

export interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  username: string;
  avatarUrl: string;
  images: string[]; // Supports single or carousel up to 10 items
  caption: string;
  likes: number;
  isLiked: boolean;
  isSaved?: boolean;
  comments: Comment[];
  location?: string;
  postedAgo: string;
  audioTrack?: string;
  taggedUsers?: string[];
}

export interface StoryItem {
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  timestamp: string; // e.g. "2h ago", "18h ago" (within 24 hours)
  filter?: string;
  duration?: number;
}

export interface StoryGroup {
  id: string;
  username: string;
  avatarUrl: string;
  isOwnStory?: boolean;
  hasUnseen: boolean;
  isLive?: boolean;
  items: StoryItem[];
}

export interface Reel {
  id: string;
  creator: string;
  avatarUrl: string;
  videoUrl?: string;
  videoGradient: string;
  audioTrack: string;
  caption: string;
  effectName?: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  shares: number;
  isSaved?: boolean;
  views?: number;
}

export interface Note {
  id: string;
  username: string;
  avatarUrl: string;
  text: string; // Short status update, e.g. "Grabbing iced matcha 🍵"
  songTitle?: string;
  songArtist?: string;
  timestamp: string;
  isOwn?: boolean;
}

export interface InstantSnap {
  id: string;
  sender: string;
  senderAvatar: string;
  imageUrl: string;
  caption: string;
  viewDurationSeconds: number;
  isViewed: boolean;
  timestamp: string;
  isExpired?: boolean;
}

export interface Message {
  id: string;
  sender: 'me' | 'them' | string;
  text?: string;
  mediaUrl?: string;
  mediaType?: 'text' | 'image' | 'video' | 'instant';
  isDisappearing?: boolean;
  isViewed?: boolean;
  viewDurationSeconds?: number;
  timestamp: string;
  liked?: boolean;
  instantSnap?: InstantSnap;
}

export interface ChatThread {
  id: string;
  contactName: string;
  username: string;
  avatarUrl: string;
  status: string;
  isGroup?: boolean;
  members?: string[];
  unreadCount: number;
  messages: Message[];
  lastActive?: string;
}

export interface ShopProduct {
  id: string;
  title: string;
  brand: string;
  brandAvatar: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  category: 'Fashion' | 'Beauty' | 'Tech' | 'Home' | 'Wellness' | 'Design';
  description: string;
  inStock: boolean;
  isWishlisted?: boolean;
}

export interface CartItem {
  product: ShopProduct;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface LiveStream {
  id: string;
  hostUsername: string;
  hostAvatar: string;
  title: string;
  viewerCount: number;
  streamGradient: string;
  comments: { id: string; username: string; avatarUrl: string; text: string; timestamp: string }[];
  isLive: boolean;
}

export interface UserProfile {
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  websiteUrl?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isVerified?: boolean;
}
