import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HeaderManager as JobSeekerHeader } from '../../components/header/jobseeker/HeaderManager';
import { HeaderManager as EmployerHeader } from '../../components/header/employer/HeaderManager';
import { HeaderManager as AdminHeader } from '../../components/header/admin/HeaderManager';
import { useUserCredential } from '../../store';
import { GetConversationsAPI, GetChatMessagesAPI, StartChatAPI } from '../../api';
import type { ChatConversation, ChatMessage } from '../../utils/interface';
import '../../styles/pages/MessagePage.css';

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

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  // Filter conversations by search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) {
      return conversations;
    }
    return conversations.filter(c =>
      c.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  // Handle sending message via StartChatAPI (which also sends the first message)
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
      // Use StartChatAPI to send message (backend handles the message sending)
      await StartChatAPI(selectedConversation.partnerId);
      
      // Reload messages to get the actual message from server
      const response = await GetChatMessagesAPI(selectedConversation.partnerId, 0, 50);
      const sortedMessages = [...(response.content || [])].reverse();
      setMessages(sortedMessages);

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
                <p>Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin</p>
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
    </div>
  );
}

export { MessagePage };
