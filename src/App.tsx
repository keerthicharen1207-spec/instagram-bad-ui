import React, { useState } from 'react';
import {
  ViewType,
  Post,
  Reel,
  StoryGroup,
  Note,
  ChatThread,
  Message,
  ShopProduct,
  CartItem,
  LiveStream,
  UserProfile,
} from './types';
import {
  CURRENT_USER,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_REELS,
  INITIAL_NOTES,
  INITIAL_CHATS,
  INITIAL_PRODUCTS,
  INITIAL_LIVE_STREAM,
} from './data/mockData';

// Authentic Instagram Components & Views
import { InstagramHeader } from './components/InstagramHeader';
import { BottomNav } from './components/BottomNav';
import { CreateModal } from './components/CreateModal';
import { StoryViewerModal } from './components/StoryViewerModal';
import { FeedView } from './views/FeedView';
import { ReelsView } from './views/ReelsView';
import { ExploreView } from './views/ExploreView';
import { ChatView } from './views/ChatView';
import { ShopView } from './views/ShopView';
import { ProfileView } from './views/ProfileView';
import { LiveView } from './views/LiveView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [currentView, setCurrentView] = useState<ViewType>('feed');

  // Application Data States
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<StoryGroup[]>(INITIAL_STORIES);
  const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_CHATS);
  const [products] = useState<ShopProduct[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([
    { product: INITIAL_PRODUCTS[0], quantity: 1 },
  ]);
  const [liveStream, setLiveStream] = useState<LiveStream>(INITIAL_LIVE_STREAM);

  // Modals & Overlays
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLiveViewOpen, setIsLiveViewOpen] = useState(false);

  // Post handlers
  const handleAddPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
    setCurrentView('feed');
  };

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  // Story handlers (disappearing after 24h)
  const handleAddStory = (newItem: { mediaUrl: string; caption?: string; filter?: string }) => {
    setStories((prev) => {
      const ownStoryIndex = prev.findIndex((s) => s.isOwnStory);
      const storyItem = {
        id: 'item-own-' + Date.now(),
        mediaUrl: newItem.mediaUrl,
        mediaType: 'image' as const,
        caption: newItem.caption,
        timestamp: 'Just now',
        filter: newItem.filter,
      };

      if (ownStoryIndex >= 0) {
        const updated = [...prev];
        updated[ownStoryIndex] = {
          ...updated[ownStoryIndex],
          items: [...updated[ownStoryIndex].items, storyItem],
        };
        return updated;
      } else {
        const newGroup: StoryGroup = {
          id: 'story-own',
          username: currentUser.username,
          avatarUrl: currentUser.avatarUrl,
          isOwnStory: true,
          hasUnseen: false,
          items: [storyItem],
        };
        return [newGroup, ...prev];
      }
    });
    // Open the new story to preview
    setActiveStoryIndex(0);
  };

  // Reel handlers
  const handleAddReel = (newReel: Reel) => {
    setReels((prev) => [newReel, ...prev]);
    setCurrentView('reels');
  };

  const handleUpdateReel = (updatedReel: Reel) => {
    setReels((prev) => prev.map((r) => (r.id === updatedReel.id ? updatedReel : r)));
  };

  // Chat handlers
  const handleSendMessage = (threadId: string, message: Message) => {
    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          const existingMsgIdx = thread.messages.findIndex((m) => m.id === message.id);
          if (existingMsgIdx >= 0) {
            const updatedMessages = [...thread.messages];
            updatedMessages[existingMsgIdx] = message;
            return { ...thread, messages: updatedMessages };
          }
          return {
            ...thread,
            messages: [...thread.messages, message],
            lastActive: 'Just now',
          };
        }
        return thread;
      })
    );
  };

  const handleAddNote = (newNote: Note) => {
    setNotes((prev) => [newNote, ...prev.filter((n) => !n.isOwn)]);
  };

  // Shopping handlers
  const handleAddToCart = (product: ShopProduct, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartItemQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: qty } : item
        )
      );
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Calculate unread chat messages
  const unreadChatCount = threads.reduce((acc, t) => acc + t.unreadCount, 0);

  // User posts for profile
  const userPosts = posts.filter(
    (p) => p.username === currentUser.username || p.username === 'alex.rivers'
  );
  const userReels = reels.filter(
    (r) => r.creator === currentUser.username || r.creator === 'alex.rivers'
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased flex flex-col justify-between">
      {/* Top Instagram Header (Adaptive for Feed, Explore, DMs, Shop, Profile) */}
      <InstagramHeader
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenCreate={() => setIsCreateModalOpen(true)}
        unreadChatCount={unreadChatCount}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full max-w-lg mx-auto overflow-x-hidden">
        {currentView === 'feed' && (
          <FeedView
            posts={posts}
            stories={stories}
            onUpdatePost={handleUpdatePost}
            onOpenStory={(idx) => setActiveStoryIndex(idx)}
            onOpenCreate={() => setIsCreateModalOpen(true)}
            onOpenLive={() => setIsLiveViewOpen(true)}
            onShareToChat={(post) => {
              if (threads.length > 0) {
                handleSendMessage(threads[0].id, {
                  id: 'msg-share-' + Date.now(),
                  sender: 'me',
                  text: `Shared post by @${post.username}: ${post.caption.slice(0, 50)}...`,
                  mediaUrl: post.images[0],
                  timestamp: 'Just now',
                });
                alert(`Shared post to ${threads[0].contactName}!`);
              }
            }}
            currentUsername={currentUser.username}
            currentUserAvatar={currentUser.avatarUrl}
          />
        )}

        {currentView === 'explore' && (
          <ExploreView
            posts={posts}
            reels={reels}
            onOpenPost={(post) => {
              // Open in feed or focus
            }}
            onOpenReel={() => setCurrentView('reels')}
          />
        )}

        {currentView === 'reels' && (
          <ReelsView
            reels={reels}
            onUpdateReel={handleUpdateReel}
            onOpenCreateReel={() => setIsCreateModalOpen(true)}
            currentUsername={currentUser.username}
          />
        )}

        {currentView === 'shop' && (
          <ShopView
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateCartItemQty={handleUpdateCartItemQty}
            onClearCart={handleClearCart}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            user={currentUser}
            userPosts={userPosts.length > 0 ? userPosts : posts}
            userReels={userReels.length > 0 ? userReels : reels}
            onOpenPost={() => setCurrentView('feed')}
            onOpenCreate={() => setIsCreateModalOpen(true)}
          />
        )}

        {currentView === 'chat' && (
          <ChatView
            threads={threads}
            notes={notes}
            onBack={() => setCurrentView('feed')}
            onSendMessage={handleSendMessage}
            onAddNote={handleAddNote}
            currentUsername={currentUser.username}
            currentUserAvatar={currentUser.avatarUrl}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      {currentView !== 'live' && (
        <BottomNav
          currentView={currentView}
          onNavigate={setCurrentView}
          onOpenCreate={() => setIsCreateModalOpen(true)}
          userAvatar={currentUser.avatarUrl}
        />
      )}

      {/* Story Viewer Modal (24h Ephemeral Stories with Segmented Progress) */}
      {activeStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialStoryIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
          onReply={(username, text) => {
            const thread = threads.find((t) => t.username === username) || threads[0];
            if (thread) {
              handleSendMessage(thread.id, {
                id: 'msg-' + Date.now(),
                sender: 'me',
                text: `Replied to story: "${text}"`,
                timestamp: 'Just now',
              });
            }
          }}
        />
      )}

      {/* Create Modal (Post with up to 10 carousels, 24h Story, Reel with effects, or Live) */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddPost={handleAddPost}
        onAddStory={handleAddStory}
        onAddReel={handleAddReel}
        onStartLive={() => setIsLiveViewOpen(true)}
        currentUserAvatar={currentUser.avatarUrl}
        currentUsername={currentUser.username}
      />

      {/* Live Stream View (Interactive Stream & Broadcaster Camera) */}
      {isLiveViewOpen && (
        <LiveView
          liveStream={liveStream}
          onClose={() => setIsLiveViewOpen(false)}
          currentUsername={currentUser.username}
          currentUserAvatar={currentUser.avatarUrl}
        />
      )}
    </div>
  );
}
