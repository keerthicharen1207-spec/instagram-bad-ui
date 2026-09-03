import React, { useState } from 'react';
import { ChatThread, Message, Note, InstantSnap } from '../types';
import {
  ArrowLeft,
  Search,
  Edit3,
  Camera,
  Image as ImageIcon,
  Heart,
  Send,
  MoreVertical,
  Phone,
  Video,
  Flame,
  CheckCheck,
  Plus,
  X,
  Music,
  Users
} from 'lucide-react';

interface ChatViewProps {
  threads: ChatThread[];
  notes: Note[];
  onBack: () => void;
  onSendMessage: (threadId: string, message: Message) => void;
  onAddNote: (newNote: Note) => void;
  currentUsername: string;
  currentUserAvatar: string;
}

export const ChatView: React.FC<ChatViewProps> = ({
  threads,
  notes,
  onBack,
  onSendMessage,
  onAddNote,
  currentUsername,
  currentUserAvatar,
}) => {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'primary' | 'general' | 'requests'>('primary');

  // Disappearing Media viewer state
  const [viewingInstant, setViewingInstant] = useState<{
    threadId: string;
    messageId: string;
    mediaUrl: string;
    timer: number;
  } | null>(null);

  // New Note Modal
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteSong, setNewNoteSong] = useState('');

  // Active chat thread
  const activeThread = threads.find((t) => t.id === activeThreadId);

  // Filtered threads
  const filteredThreads = threads.filter(
    (t) =>
      t.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle send text message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeThreadId) return;

    const newMessage: Message = {
      id: 'msg-' + Date.now(),
      sender: 'me',
      text: messageInput.trim(),
      timestamp: 'Just now',
    };

    onSendMessage(activeThreadId, newMessage);
    setMessageInput('');
  };

  // Handle send photo media
  const handleSendPhoto = (isDisappearing = false) => {
    if (!activeThreadId) return;

    const sampleImages = [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    ];
    const pickedImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];

    const newMessage: Message = {
      id: 'msg-' + Date.now(),
      sender: 'me',
      mediaUrl: pickedImage,
      mediaType: isDisappearing ? 'instant' : 'image',
      isDisappearing,
      isViewed: false,
      viewDurationSeconds: 5,
      timestamp: 'Just now',
      text: isDisappearing ? 'View photo once 📸' : undefined,
    };

    onSendMessage(activeThreadId, newMessage);
  };

  // Handle open disappearing instant photo with countdown
  const handleOpenDisappearingPhoto = (threadId: string, message: Message) => {
    if (message.isViewed || !message.mediaUrl) return;

    setViewingInstant({
      threadId,
      messageId: message.id,
      mediaUrl: message.mediaUrl,
      timer: message.viewDurationSeconds || 5,
    });

    // Mark message as viewed
    const viewedMessage: Message = {
      ...message,
      isViewed: true,
    };
    onSendMessage(threadId, viewedMessage);
  };

  // Timer for disappearing instant
  React.useEffect(() => {
    if (!viewingInstant) return;

    if (viewingInstant.timer <= 0) {
      setViewingInstant(null);
      return;
    }

    const timer = setTimeout(() => {
      setViewingInstant((prev) => (prev ? { ...prev, timer: prev.timer - 1 } : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [viewingInstant]);

  // Handle create Note
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const noteObj: Note = {
      id: 'note-own',
      username: currentUsername,
      avatarUrl: currentUserAvatar,
      text: newNoteText.trim(),
      songTitle: newNoteSong.trim() || undefined,
      timestamp: 'Just now',
      isOwn: true,
    };

    onAddNote(noteObj);
    setIsNoteModalOpen(false);
    setNewNoteText('');
    setNewNoteSong('');
  };

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-black text-white select-none pb-16">
      {/* 1. DISAPPEARING MEDIA FULLSCREEN MODAL */}
      {viewingInstant && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-sm aspect-[9/16] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800">
            <img
              src={viewingInstant.mediaUrl}
              alt="Disappearing Instant"
              className="w-full h-full object-cover"
            />
            {/* Top countdown badge */}
            <div className="absolute top-4 right-4 bg-red-600/90 text-white font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse">
              <Flame className="w-3.5 h-3.5" />
              <span>Disappearing in {viewingInstant.timer}s</span>
            </div>
            {/* Close button */}
            <button
              onClick={() => setViewingInstant(null)}
              className="absolute top-4 left-4 p-1.5 bg-black/60 text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. CREATE NOTE MODAL */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Share a thought</h3>
              <button onClick={() => setIsNoteModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Note Speech Bubble Preview */}
            <div className="flex flex-col items-center py-2">
              <div className="relative mb-2 bg-neutral-800 border border-neutral-700 px-3 py-2 rounded-2xl text-xs text-center max-w-[200px] shadow">
                <span>{newNoteText.trim() || 'Share what is on your mind...'}</span>
                {newNoteSong.trim() && (
                  <div className="text-[10px] text-neutral-400 mt-1 flex items-center justify-center gap-1">
                    <Music className="w-3 h-3" />
                    <span>{newNoteSong}</span>
                  </div>
                )}
                {/* Speech bubble beak */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-800 border-r border-b border-neutral-700 rotate-45" />
              </div>
              <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-neutral-700">
                <img src={currentUserAvatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-3">
              <input
                type="text"
                maxLength={60}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Share a thought (up to 60 characters)..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
              />

              <div className="flex items-center gap-1.5 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs">
                <Music className="w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={newNoteSong}
                  onChange={(e) => setNewNoteSong(e.target.value)}
                  placeholder="Attach a song (optional)..."
                  className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
                />
              </div>

              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Share Note
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. CONVERSATION VIEW (WHEN A CHAT IS OPEN) */}
      {activeThread ? (
        <div className="flex flex-col h-[calc(100vh-3.5rem)]">
          {/* Active Thread Header */}
          <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-neutral-900 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveThreadId(null)}
                className="p-1 text-white hover:text-neutral-400 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-neutral-700">
                  <img
                    src={activeThread.avatarUrl}
                    alt={activeThread.contactName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs text-white">
                      {activeThread.contactName}
                    </span>
                    {activeThread.isGroup && (
                      <span className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.2 rounded">
                        Group
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-400">{activeThread.status}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-white">
              <button className="hover:text-neutral-400 cursor-pointer">
                <Phone className="w-4 h-4" />
              </button>
              <button className="hover:text-neutral-400 cursor-pointer">
                <Video className="w-5 h-5" />
              </button>
              <button className="hover:text-neutral-400 cursor-pointer">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeThread.messages.map((msg) => {
              const isMe = msg.sender === 'me';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  {/* Sender name for group chats */}
                  {!isMe && activeThread.isGroup && (
                    <span className="text-[10px] text-neutral-500 mb-0.5 ml-2">
                      {msg.sender}
                    </span>
                  )}

                  {/* Standard Text Message */}
                  {msg.text && !msg.isDisappearing && (
                    <div
                      className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-neutral-800 text-neutral-100 rounded-bl-sm'
                      }`}
                    >
                      <span>{msg.text}</span>
                    </div>
                  )}

                  {/* Photo Media Message */}
                  {msg.mediaUrl && !msg.isDisappearing && (
                    <div className="max-w-[70%] rounded-2xl overflow-hidden border border-neutral-800 mb-1">
                      <img src={msg.mediaUrl} alt="Sent media" className="w-full object-cover" />
                      {msg.text && (
                        <div className="p-2 bg-neutral-900 text-xs text-neutral-200">
                          {msg.text}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Disappearing "Instant" Snap */}
                  {msg.isDisappearing && (
                    <div
                      onClick={() => handleOpenDisappearingPhoto(activeThread.id, msg)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-2xl border cursor-pointer transition-all ${
                        msg.isViewed
                          ? 'bg-neutral-900/60 border-neutral-800 text-neutral-500'
                          : 'bg-gradient-to-r from-pink-900/40 to-purple-900/40 border-pink-500/60 text-white hover:border-pink-400'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          msg.isViewed ? 'bg-neutral-800 text-neutral-500' : 'bg-pink-600 text-white'
                        }`}
                      >
                        <Flame className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold">
                          {msg.isViewed ? 'Opened Instant' : 'View photo once'}
                        </p>
                        <p className="text-[10px] opacity-70">
                          {msg.isViewed ? 'Disappeared' : 'Tap to view for 5s'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Timestamp & Read Receipts */}
                  <div className="flex items-center gap-1 mt-0.5 px-1">
                    <span className="text-[9px] text-neutral-500">{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-blue-400" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-neutral-950 border-t border-neutral-900 flex items-center gap-2">
            {/* Instant Camera button (Disappearing content) */}
            <button
              type="button"
              onClick={() => handleSendPhoto(true)}
              className="p-2 bg-pink-600/90 hover:bg-pink-500 rounded-full text-white cursor-pointer shadow"
              title="Send View Once Instant Photo"
            >
              <Flame className="w-4 h-4" />
            </button>

            {/* Standard photo button */}
            <button
              type="button"
              onClick={() => handleSendPhoto(false)}
              className="p-2 text-neutral-400 hover:text-white cursor-pointer"
              title="Send Photo"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            {/* Text input form */}
            <form onSubmit={handleSend} className="flex-1 flex items-center">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Message..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-full px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
              />
            </form>

            {/* Send or Heart */}
            {messageInput.trim() ? (
              <button
                type="button"
                onClick={handleSend}
                className="p-2 text-blue-500 hover:text-blue-400 font-semibold text-xs cursor-pointer"
              >
                Send
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (activeThreadId) {
                    onSendMessage(activeThreadId, {
                      id: 'msg-' + Date.now(),
                      sender: 'me',
                      text: '❤️',
                      timestamp: 'Just now',
                    });
                  }
                }}
                className="p-2 text-red-500 hover:text-red-400 cursor-pointer"
              >
                <Heart className="w-5 h-5 fill-red-500" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* 4. INBOX THREADS LIST & NOTES SHELF */
        <div className="space-y-3">
          {/* Notes Shelf (Visible above Profile Pictures in the Inbox) */}
          <div className="pt-3 px-3 border-b border-neutral-900 pb-3">
            <h4 className="text-xs font-semibold text-neutral-400 mb-3 px-1">Notes</h4>
            <div className="flex items-start gap-4 overflow-x-auto no-scrollbar pb-1">
              {/* Your Note (+ / Current Note) */}
              <div
                onClick={() => setIsNoteModalOpen(true)}
                className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
              >
                <div className="relative mb-2">
                  {/* Speech Bubble */}
                  <div className="relative bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-2.5 py-1 rounded-xl text-[11px] text-center max-w-[90px] shadow transition-colors">
                    <span className="truncate block">
                      {notes.find((n) => n.isOwn)?.text || 'Note...'}
                    </span>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-800 border-r border-b border-neutral-700 rotate-45" />
                  </div>

                  {/* Avatar with + icon */}
                  <div className="w-14 h-14 rounded-full overflow-hidden ring-1 ring-neutral-700 mt-1 relative">
                    <img src={currentUserAvatar} alt="You" className="w-full h-full object-cover" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center border-2 border-black">
                      <Plus className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-neutral-400">Your note</span>
              </div>

              {/* Friends' Notes */}
              {notes
                .filter((n) => !n.isOwn)
                .map((note) => (
                  <div
                    key={note.id}
                    onClick={() => {
                      // Click on note to initiate quick chat with that user
                      const foundThread = threads.find((t) => t.username === note.username);
                      if (foundThread) setActiveThreadId(foundThread.id);
                    }}
                    className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
                  >
                    {/* Speech Bubble */}
                    <div className="relative mb-2 bg-neutral-800 group-hover:bg-neutral-700 border border-neutral-700 px-2.5 py-1 rounded-xl text-[11px] text-center max-w-[100px] shadow transition-colors">
                      <span className="line-clamp-1">{note.text}</span>
                      {note.songTitle && (
                        <div className="text-[9px] text-neutral-400 truncate flex items-center justify-center gap-0.5">
                          <Music className="w-2.5 h-2.5" />
                          <span>{note.songTitle}</span>
                        </div>
                      )}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-800 border-r border-b border-neutral-700 rotate-45" />
                    </div>

                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full overflow-hidden ring-1 ring-neutral-700">
                      <img src={note.avatarUrl} alt={note.username} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] text-neutral-300 mt-1 truncate max-w-[65px]">
                      {note.username}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="px-4">
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
              />
            </div>
          </div>

          {/* Category Tabs: Primary, General, Requests */}
          <div className="flex border-b border-neutral-900 px-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('primary')}
              className={`flex-1 pb-2.5 transition-colors cursor-pointer ${
                activeTab === 'primary' ? 'text-white border-b-2 border-white' : 'text-neutral-500'
              }`}
            >
              Primary
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`flex-1 pb-2.5 transition-colors cursor-pointer ${
                activeTab === 'general' ? 'text-white border-b-2 border-white' : 'text-neutral-500'
              }`}
            >
              General
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`flex-1 pb-2.5 transition-colors cursor-pointer ${
                activeTab === 'requests' ? 'text-white border-b-2 border-white' : 'text-neutral-500'
              }`}
            >
              Requests
            </button>
          </div>

          {/* Threads List */}
          <div className="divide-y divide-neutral-900/60 px-2">
            {filteredThreads.map((thread) => {
              const lastMsg = thread.messages[thread.messages.length - 1];

              return (
                <div
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className="p-3 flex items-center justify-between hover:bg-neutral-900/50 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-neutral-800 flex-shrink-0">
                      <img
                        src={thread.avatarUrl}
                        alt={thread.contactName}
                        className="w-full h-full object-cover"
                      />
                      {thread.status.includes('Active now') && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                      )}
                    </div>

                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-white">
                          {thread.contactName}
                        </span>
                        {thread.isGroup && (
                          <Users className="w-3 h-3 text-neutral-400" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 truncate max-w-[200px]">
                        {lastMsg?.isDisappearing
                          ? 'Sent an Instant photo 📸'
                          : lastMsg?.text || (lastMsg?.mediaUrl ? 'Sent a photo 📷' : 'Active')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-neutral-500">{thread.lastActive}</span>
                    {thread.unreadCount > 0 && (
                      <span className="w-4 h-4 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
