import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { HeaderManager } from '../../components/header/jobseeker/HeaderManager.tsx';
import { useUserCredential } from '../../store';
import { UploadCVAPI, ChatAPI } from '../../api';
import type { AIChatMessage, AIPromptInfo } from '../../utils/interface';
import '../../styles/pages/AIEvaluatePage.css';

function AIEvaluatePage() {
  const { userBasicInfo } = useUserCredential();
  
  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [promptInfo, setPromptInfo] = useState<AIPromptInfo | null>(null);
  
  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState('');
  const [limitReached, setLimitReached] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle file selection
  const handleFileSelect = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Vui lòng chọn file PDF hoặc DOCX');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setUploadError('File không được vượt quá 10MB');
      return;
    }
    
    setSelectedFile(file);
    setUploadError('');
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Upload CV
  const handleUpload = async () => {
    if (!selectedFile || !userBasicInfo?.id) return;
    
    setIsUploading(true);
    setUploadError('');
    
    try {
      const response = await UploadCVAPI(selectedFile, userBasicInfo.id);
      
      if (response.success && response.data) {
        setSessionId(response.data.sessionId);
        setPromptInfo(response.data.promptInfo);
        
        // Add initial AI response to messages
        setMessages([{
          role: 'assistant',
          content: response.data.response
        }]);
      } else {
        setUploadError(response.message || 'Tải lên thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Tải lên thất bại. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  // Send chat message
  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend || !sessionId || !userBasicInfo?.id || limitReached) return;
    
    // Add user message to chat
    const userMessage: AIChatMessage = {
      role: 'user',
      content: messageToSend
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsSending(true);
    setChatError('');
    
    try {
      const response = await ChatAPI(userBasicInfo.id, sessionId, messageToSend);
      
      if (response.success && response.data) {
        // Add AI response to chat
        const aiMessage: AIChatMessage = {
          role: 'assistant',
          content: response.data.response
        };
        setMessages(prev => [...prev, aiMessage]);
        setPromptInfo(response.data.promptInfo);
        
        // Check if limit reached
        if (response.data.promptInfo.remaining === 0) {
          setLimitReached(true);
        }
      } else {
        // Check for limit reached error
        if (response.code === 'PROMPT_LIMIT_REACHED') {
          setLimitReached(true);
          if (response.promptInfo) {
            setPromptInfo(response.promptInfo);
          }
          setChatError('Bạn đã đạt giới hạn số lượt hỏi. Vui lòng tải lên CV mới để bắt đầu phiên mới.');
        } else {
          setChatError(response.message || 'Gửi tin nhắn thất bại.');
        }
      }
    } catch (error: unknown) {
      console.error('Chat error:', error);
      // Handle 429 error
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { code?: string; promptInfo?: AIPromptInfo } } };
        if (axiosError.response?.status === 429) {
          setLimitReached(true);
          if (axiosError.response.data?.promptInfo) {
            setPromptInfo(axiosError.response.data.promptInfo);
          }
          setChatError('Bạn đã đạt giới hạn số lượt hỏi. Vui lòng tải lên CV mới để bắt đầu phiên mới.');
        } else {
          setChatError('Gửi tin nhắn thất bại. Vui lòng thử lại.');
        }
      } else {
        setChatError('Gửi tin nhắn thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsSending(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick action buttons
  const quickActions = [
    { label: 'Đánh giá CV', message: 'Evaluate my CV with score and suggestions' },
    { label: 'Kiểm tra ATS', message: 'Check my CV for ATS compatibility and suggest improvements' },
    { label: 'Điểm mạnh & yếu', message: 'Analyze the strengths and weaknesses of my CV' },
    { label: 'Gợi ý cải thiện', message: 'Give me specific suggestions to improve my CV' }
  ];

  // Reset session (start new)
  const handleNewSession = () => {
    setSessionId(null);
    setSelectedFile(null);
    setMessages([]);
    setPromptInfo(null);
    setLimitReached(false);
    setChatError('');
    setUploadError('');
  };

  return (
    <div className="ai-evaluate-page-container">
      <HeaderManager />
      
      <div className="ai-evaluate-page-content">
        <div className="ai-evaluate-page-header">
          <h1 className="ai-evaluate-page-title">AI Đánh Giá CV</h1>
          <p className="ai-evaluate-page-subtitle">
            Tải lên CV của bạn để nhận phân tích và gợi ý cải thiện từ AI
          </p>
        </div>

        {!sessionId ? (
          // Upload Section
          <div className="ai-evaluate-upload-section">
            <div
              className={`ai-evaluate-upload-box ${isDragOver ? 'drag-over' : ''} ${selectedFile ? 'has-file' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept=".pdf,.doc,.docx"
                hidden
              />
              
              {selectedFile ? (
                <div className="ai-evaluate-file-selected">
                  <div className="ai-evaluate-file-icon">
                    {selectedFile.name.endsWith('.pdf') ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <path d="M9 15v-2h2c.6 0 1 .4 1 1s-.4 1-1 1H9z" />
                        <path d="M12 17h-3" />
                        <path d="M15 13h-1v4h1" />
                        <path d="M15 15h1" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    )}
                  </div>
                  <span className="ai-evaluate-file-name">{selectedFile.name}</span>
                  <span className="ai-evaluate-file-size">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              ) : (
                <div className="ai-evaluate-upload-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="ai-evaluate-upload-text">
                    Kéo thả file vào đây hoặc click để chọn
                  </span>
                  <span className="ai-evaluate-upload-hint">
                    Hỗ trợ PDF, DOC, DOCX (tối đa 10MB)
                  </span>
                </div>
              )}
            </div>

            {uploadError && (
              <div className="ai-evaluate-error">{uploadError}</div>
            )}

            <button
              className="ai-evaluate-upload-button"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <>
                  <span className="ai-evaluate-spinner"></span>
                  Đang tải lên...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Tải lên và phân tích
                </>
              )}
            </button>
          </div>
        ) : (
          // Chat Section
          <div className="ai-evaluate-chat-section">
            {/* Prompt Counter */}
            <div className="ai-evaluate-prompt-counter">
              <div className="ai-evaluate-prompt-info">
                <span className="ai-evaluate-prompt-label">Số lượt hỏi:</span>
                <span className={`ai-evaluate-prompt-count ${limitReached ? 'limit-reached' : ''}`}>
                  {promptInfo ? `${promptInfo.used}/${promptInfo.max}` : '0/10'}
                </span>
              </div>
              <button
                className="ai-evaluate-new-session-btn"
                onClick={handleNewSession}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Tải CV mới
              </button>
            </div>

            {/* Chat Messages */}
            <div className="ai-evaluate-chat-container" ref={chatContainerRef}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`ai-evaluate-message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
                >
                  <div className="ai-evaluate-message-avatar">
                    {msg.role === 'user' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 8V4H8" />
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <path d="M8 14h.01" />
                        <path d="M16 14h.01" />
                        <path d="M9 18h6" />
                      </svg>
                    )}
                  </div>
                  <div className="ai-evaluate-message-content">
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              
              {isSending && (
                <div className="ai-evaluate-message ai-message">
                  <div className="ai-evaluate-message-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 8V4H8" />
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <path d="M8 14h.01" />
                      <path d="M16 14h.01" />
                      <path d="M9 18h6" />
                    </svg>
                  </div>
                  <div className="ai-evaluate-message-content">
                    <div className="ai-evaluate-typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Error */}
            {chatError && (
              <div className="ai-evaluate-chat-error">{chatError}</div>
            )}

            {/* Quick Actions */}
            {!limitReached && (
              <div className="ai-evaluate-quick-actions">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="ai-evaluate-quick-action-btn"
                    onClick={() => handleSendMessage(action.message)}
                    disabled={isSending}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input */}
            <div className="ai-evaluate-chat-input-container">
              <textarea
                className="ai-evaluate-chat-input"
                placeholder={limitReached ? 'Đã hết lượt hỏi. Vui lòng tải CV mới.' : 'Nhập câu hỏi của bạn...'}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSending || limitReached}
                rows={1}
              />
              <button
                className="ai-evaluate-send-btn"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isSending || limitReached}
              >
                {isSending ? (
                  <span className="ai-evaluate-spinner small"></span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { AIEvaluatePage };
