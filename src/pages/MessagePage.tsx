import React from 'react'
import { HeaderManager } from '../components/header/HeaderManager.tsx'
import '../styles/pages/MessagePage.css'

function MessagePage() {
  return (
    <div className='message-page-container'>
      <HeaderManager />
      <span className='message-page-title'>Tin nhắn</span>
      <div className='message-page-left-box'>
        <div className='message-page-search-chat-container'>
          <input
            className='message-page-search-chat-input'
            placeholder='Tìm kiếm cuộc trò chuyện'
          />
        </div>
        <div className='message-page-chat-list'>

        </div>
      </div>
      <div className='message-page-right-box'>
        <div className='message-page-chat-title-container'>
        </div>
        <div className='message-page-chat-main-container'>

        </div>
      </div>
      <div className='message-page-chat-interface-container'>
        <input
          className='meesage-page-chat-interface-input'
          placeholder='Nhập tin nhắn...'
        />
        <button className='message-page-chat-interface-send-button'>
          Send
        </button>
      </div>
    </div>
  );
}
export { MessagePage };
