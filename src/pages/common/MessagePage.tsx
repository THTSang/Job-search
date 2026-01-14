import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HeaderManager as JobSeekerHeader } from '../../components/header/jobseeker/HeaderManager';
import { HeaderManager as EmployerHeader } from '../../components/header/employer/HeaderManager';
import { HeaderManager as AdminHeader } from '../../components/header/admin/HeaderManager';
import { useUserCredential } from '../../store';
import { GetConversationsAPI, GetChatMessagesAPI, StartChatAPI, SearchChatUsersAPI, SendMessageAPI } from '../../api';
import type { ChatConversation, ChatMessage, ChatUserSearchResult } from '../../utils/interface';
import '../../styles/pages/MessagePage.css';

// Navigation state interface for starting new conversations
interface MessagePageState {
  recipientId?: string;
  recipientName?: string;
}

function MessagePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, userBasicInfo } = useUserCredential();

  // Determine which header to use based on route
  const getHeader = () => {
    if (location.pathname.startsWith('/admin')) {
      return AdminHeader;
    } else if (location.pathname.startsWith('/employer')) {
      return EmployerHeader;
    }
    return JobSeekerHeader;
  };
  const HeaderManager = getHeader();

  // State
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New conversation modal state
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChatUserSearchResult[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Start chat with a user (from search or navigation state)
  const startChatWithUser = useCallback(async (recipientId: string, recipientName: string) => {
    try {
      setStartingChat(true);
      
      // Call StartChatAPI to create/get the conversation
      const response = await StartChatAPI(recipientId);
      
      // Create conversation object
      const newConversation: ChatConversation = {
        chatId: response.chatId,
        partnerId: response.partnerId,
        partnerName: response.partnerName || recipientName,
        lastMessage: '',
        lastMessageAt: new Date().toISOString(),
        isRead: true
      };

      // Check if conversation already exists
      setConversations(prev => {
        const existingIndex = prev.findIndex(c => c.partnerId === recipientId);
        if (existingIndex >= 0) {
          // Move existing to top and select it
          const existing = prev[existingIndex];
          const updated = [...prev];
          updated.splice(existingIndex, 1);
          setSelectedConversation(existing);
          return [existing, ...updated];
        } else {
          // Add new conversation and select it
          setSelectedConversation(newConversation);
          return [newConversation, ...prev];
        }
      });

      setShowNewChatModal(false);
      setUserSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      console.error('Failed to start chat:', err);
      setError('Không thể bắt đầu cuộc trò chuyện');
    } finally {
      setStartingChat(false);
    }
  }, []);

  // Handle navigation state (when redirected from other pages)
  useEffect(() => {
    const state = location.state as MessagePageState | null;
    if (state?.recipientId && state?.recipientName && token && userBasicInfo) {
      // Clear the state to prevent re-triggering
      navigate(location.pathname, { replace: true, state: null });
      startChatWithUser(state.recipientId, state.recipientName);
    }
  }, [location.state, token, userBasicInfo, navigate, location.pathname, startChatWithUser]);

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoadingConversations(true);
        setError(null);
        const response = await GetConversationsAPI(0, 50);
        setConversations(response.content || []);
      } catch (err) {
        console.error('Failed to load conversations:', err);
        setError('Không thể tải danh sách cuộc trò chuyện');
      } finally {
        setLoadingConversations(false);
      }
    };

    if (token && userBasicInfo) {
      loadConversations();
    } else {
      setLoadingConversations(false);
    }
  }, [token, userBasicInfo]);

  // Load messages when conversation is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) {
        setMessages([]);
        return;
      }

      try {
        setLoadingMessages(true);
        const response = await GetChatMessagesAPI(selectedConversation.partnerId, 0, 50);
        // API returns newest first, so reverse for display (oldest first)
        const sortedMessages = [...(response.content || [])].reverse();
        setMessages(sortedMessages);
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [selectedConversation]);

  // Poll for new messages every 3 seconds when a conversation is selected
  useEffect(() => {
    if (!selectedConversation || !token) return;

    const pollMessages = async () => {
      try {
        const response = await GetChatMessagesAPI(selectedConversation.partnerId, 0, 50);
        const sortedMessages = [...(response.content || [])].reverse();
        setMessages(sortedMessages);
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    // Poll every 3 seconds
    pollingRef.current = setInterval(pollMessages, 3000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [selectedConversation, token]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Search users with debounce
  useEffect(() => {
    if (!showNewChatModal) return;

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!userSearchQuery.trim()) {
      setSearchResults([]);
      setSearchingUsers(false);
      return;
    }

    // Debounce search by 300ms
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setSearchingUsers(true);
        const response = await SearchChatUsersAPI(userSearchQuery.trim(), 0, 20);
        // Filter out current user
        const filtered = (response.content || []).filter(u => u.id !== userBasicInfo?.id);
        setSearchResults(filtered);
      } catch (err) {
        console.error('Failed to search users:', err);
        setSearchResults([]);
      } finally {
        setSearchingUsers(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [userSearchQuery, showNewChatModal, userBasicInfo?.id]);

  // Filter conversations by search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) {
      return conversations;
    }
    return conversations.filter(c =>
      c.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  // Handle sending message via SendMessageAPI
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sendingMessage) {
      return;
    }

    const content = newMessage.trim();
    setSendingMessage(true);

    // Optimistic UI update
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      senderId: userBasicInfo?.id || '',
      recipientId: selectedConversation.partnerId,
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');

    try {
      // Use SendMessageAPI to send the message
      const sentMessage = await SendMessageAPI(selectedConversation.partnerId, content);
      
      // Replace optimistic message with actual message from server
      setMessages(prev => prev.map(m => 
        m.id === optimisticMessage.id ? sentMessage : m
      ));

      // Update conversation's last message
      setConversations(prev => {
        const index = prev.findIndex(c => c.partnerId === selectedConversation.partnerId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            lastMessage: content,
            lastMessageAt: new Date().toISOString(),
          };
          // Move to top
          const [conversation] = updated.splice(index, 1);
          return [conversation, ...updated];
        }
        return prev;
      });
    } catch (err) {
      console.error('Failed to send message:', err);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      setNewMessage(content); // Restore message so user can retry
    } finally {
      setSendingMessage(false);
      messageInputRef.current?.focus();
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format time for display
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isYesterday) {
      return 'Hôm qua';
    }

    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  // Format message time
  const formatMessageTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  // Get role display text
  const getRoleDisplayText = (role: string) => {
    switch (role) {
      case 'RECRUITER':
        return 'Nhà tuyển dụng';
      case 'ADMIN':
        return 'Quản trị viên';
      case 'USER':
      default:
        return 'Ứng viên';
    }
  };

  // Handle conversation click
  const handleConversationClick = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    // Mark as read
    setConversations(prev =>
      prev.map(c =>
        c.chatId === conversation.chatId ? { ...c, isRead: true } : c
      )
    );
  };

  // Handle new chat modal
  const handleOpenNewChatModal = () => {
    setShowNewChatModal(true);
    setUserSearchQuery('');
    setSearchResults([]);
  };

  const handleCloseNewChatModal = () => {
    setShowNewChatModal(false);
    setUserSearchQuery('');
    setSearchResults([]);
  };

  // Handle selecting a user from search results
  const handleSelectUser = (user: ChatUserSearchResult) => {
    startChatWithUser(user.id, user.name);
  };

  return (
    <div className="message-page-container">
      <HeaderManager />

      {/* Not logged in state */}
      {!token || !userBasicInfo ? (
        <div className="message-page-not-logged-in">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <h3>Vui lòng đăng nhập</h3>
          <p>Bạn cần đăng nhập để sử dụng tính năng tin nhắn</p>
          <button className="login-redirect-button" onClick={() => navigate('/auth')}>
            Đăng nhập
          </button>
        </div>
      ) : error ? (
        <div className="message-page-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          <h3>Đã xảy ra lỗi</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Thử lại
          </button>
        </div>
      ) : (
        <div className="message-page-content">
          {/* Left Sidebar - Conversations */}
          <div className="message-page-sidebar">
            <div className="message-page-sidebar-header">
              <h2 className="message-page-title">Tin nhắn</h2>
              <button 
                className="new-chat-button"
                onClick={handleOpenNewChatModal}
                title="Cuộc trò chuyện mới"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>

            <div className="message-page-search-container">
              <input
                type="text"
                className="message-page-search-input"
                placeholder="Tìm kiếm cuộc trò chuyện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>

            <div className="message-page-conversation-list">
              {loadingConversations ? (
                <div className="message-page-loading">
                  <div className="loading-spinner"></div>
                  <span>Đang tải...</span>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="message-page-empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{searchQuery ? 'Không tìm thấy cuộc trò chuyện' : 'Chưa có tin nhắn nào'}</span>
                  <button className="start-chat-hint-button" onClick={handleOpenNewChatModal}>
                    Bắt đầu trò chuyện mới
                  </button>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.chatId}
                    className={`message-page-conversation-item ${selectedConversation?.chatId === conversation.chatId ? 'active' : ''} ${!conversation.isRead ? 'unread' : ''}`}
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <div className="conversation-avatar">
                      {getInitials(conversation.partnerName)}
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-header">
                        <span className="conversation-name">{conversation.partnerName}</span>
                        <span className="conversation-time">{formatTime(conversation.lastMessageAt)}</span>
                      </div>
                      <p className="conversation-preview">{conversation.lastMessage}</p>
                    </div>
                    {!conversation.isRead && <span className="unread-dot"></span>}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel - Chat */}
          <div className="message-page-chat">
            {!selectedConversation ? (
              <div className="message-page-no-chat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <h3>Chọn một cuộc trò chuyện</h3>
                <p>Chọn một cuộc trò chuyện từ danh sách bên trái hoặc bắt đầu cuộc trò chuyện mới</p>
                <button className="start-new-chat-button" onClick={handleOpenNewChatModal}>
                  Cuộc trò chuyện mới
                </button>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="message-page-chat-header">
                  <div className="chat-header-info">
                    <div className="chat-header-avatar">
                      {getInitials(selectedConversation.partnerName)}
                    </div>
                    <div className="chat-header-details">
                      <span className="chat-header-name">{selectedConversation.partnerName}</span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="message-page-messages">
                  {loadingMessages ? (
                    <div className="message-page-loading">
                      <div className="loading-spinner"></div>
                      <span>Đang tải tin nhắn...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="message-page-no-messages">
                      <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((message, index) => {
                        const isSent = message.senderId === userBasicInfo?.id;
                        const showTime = index === 0 ||
                          new Date(message.createdAt).getTime() - new Date(messages[index - 1].createdAt).getTime() > 300000; // 5 minutes

                        return (
                          <div key={message.id}>
                            {showTime && (
                              <div className="message-time-divider">
                                <span>{formatMessageTime(message.createdAt)}</span>
                              </div>
                            )}
                            <div className={`message-bubble ${isSent ? 'sent' : 'received'}`}>
                              <p className="message-content">{message.content}</p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Input */}
                <div className="message-page-input-container">
                  <input
                    ref={messageInputRef}
                    type="text"
                    className="message-page-input"
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sendingMessage}
                  />
                  <button
                    className="message-page-send-button"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13" />
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="new-chat-modal-overlay" onClick={handleCloseNewChatModal}>
          <div className="new-chat-modal" onClick={(e) => e.stopPropagation()}>
            <div className="new-chat-modal-header">
              <h3>Cuộc trò chuyện mới</h3>
              <button className="modal-close-button" onClick={handleCloseNewChatModal}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="new-chat-modal-search">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                autoFocus
              />
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>

            <div className="new-chat-modal-results">
              {searchingUsers ? (
                <div className="modal-loading">
                  <div className="loading-spinner"></div>
                  <span>Đang tìm kiếm...</span>
                </div>
              ) : startingChat ? (
                <div className="modal-loading">
                  <div className="loading-spinner"></div>
                  <span>Đang bắt đầu cuộc trò chuyện...</span>
                </div>
              ) : !userSearchQuery.trim() ? (
                <div className="modal-hint">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <p>Nhập tên hoặc email để tìm kiếm người dùng</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="modal-no-results">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 15h8M9 9h.01M15 9h.01" />
                  </svg>
                  <p>Không tìm thấy người dùng nào</p>
                </div>
              ) : (
                <div className="user-search-results">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="user-search-item"
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="user-search-avatar">
                        {getInitials(user.name)}
                      </div>
                      <div className="user-search-info">
                        <span className="user-search-name">{user.name}</span>
                        <span className="user-search-email">{user.email}</span>
                        <span className="user-search-role">{getRoleDisplayText(user.role)}</span>
                      </div>
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
}

export { MessagePage };
