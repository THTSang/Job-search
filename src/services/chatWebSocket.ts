import { Client } from '@stomp/stompjs';
import type { IMessage, StompSubscription } from '@stomp/stompjs';

// Server URL for WebSocket connection - try native WebSocket first
const WS_BASE_URL = 'ws://44.201.41.10:8080/ws/websocket';

// Message received from WebSocket
export interface WsIncomingMessage {
  id: string;
  senderId: string;
  senderName?: string;
  recipientId: string;
  content: string;
  createdAt: string;
}

// Message to send via WebSocket
export interface WsOutgoingMessage {
  recipientId: string;
  content: string;
}

// Connection status
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// Callback types
type MessageCallback = (message: WsIncomingMessage) => void;
type StatusCallback = (status: ConnectionStatus) => void;

class ChatWebSocketService {
  private client: Client | null = null;
  private subscription: StompSubscription | null = null;
  private messageCallbacks: Set<MessageCallback> = new Set();
  private statusCallbacks: Set<StatusCallback> = new Set();
  private currentStatus: ConnectionStatus = 'disconnected';
  private token: string = '';

  /**
   * Connect to WebSocket server
   * @param token - JWT token for authentication
   */
  connect(token: string): void {
    if (this.client?.connected) {
      console.log('[WebSocket] Already connected');
      return;
    }

    // Disconnect existing client if any
    if (this.client) {
      this.client.deactivate();
    }

    this.token = token;
    this.updateStatus('connecting');

    this.client = new Client({
      // Use native WebSocket
      brokerURL: WS_BASE_URL,
      
      // Send token in STOMP connect headers
      // Try multiple formats for compatibility
      connectHeaders: {
        'token': token,
        'Authorization': `Bearer ${token}`,
      },

      // Debug logging (only in development)
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log('[STOMP]', str);
        }
      },

      // Reconnect settings
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      // On successful connection
      onConnect: () => {
        console.log('[WebSocket] Connected successfully');
        this.updateStatus('connected');
        this.subscribeToMessages();
      },

      // On connection error
      onStompError: (frame) => {
        console.error('[WebSocket] STOMP error:', frame.headers['message']);
        console.error('[WebSocket] Details:', frame.body);
        this.updateStatus('error');
      },

      // On WebSocket error
      onWebSocketError: (event) => {
        console.error('[WebSocket] WebSocket error:', event);
        this.updateStatus('error');
      },

      // On disconnect
      onDisconnect: () => {
        console.log('[WebSocket] Disconnected');
        this.updateStatus('disconnected');
      },

      // On WebSocket close
      onWebSocketClose: () => {
        console.log('[WebSocket] WebSocket closed');
        if (this.currentStatus === 'connected') {
          this.updateStatus('disconnected');
        }
      },
    });

    // Activate the client
    this.client.activate();
  }

  /**
   * Subscribe to incoming messages
   */
  private subscribeToMessages(): void {
    if (!this.client?.connected) {
      console.error('[WebSocket] Cannot subscribe - not connected');
      return;
    }

    // Unsubscribe from previous subscription if exists
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // Subscribe to user's message queue
    this.subscription = this.client.subscribe(
      '/user/queue/messages',
      (message: IMessage) => {
        try {
          const parsedMessage: WsIncomingMessage = JSON.parse(message.body);
          console.log('[WebSocket] Received message:', parsedMessage);
          
          // Notify all registered callbacks
          this.messageCallbacks.forEach(callback => {
            try {
              callback(parsedMessage);
            } catch (err) {
              console.error('[WebSocket] Error in message callback:', err);
            }
          });
        } catch (err) {
          console.error('[WebSocket] Failed to parse message:', err);
        }
      }
    );

    console.log('[WebSocket] Subscribed to /user/queue/messages');
  }

  /**
   * Send a message to a recipient
   * @param recipientId - ID of the recipient
   * @param content - Message content
   */
  sendMessage(recipientId: string, content: string): boolean {
    if (!this.client?.connected) {
      console.error('[WebSocket] Cannot send message - not connected');
      return false;
    }

    const message: WsOutgoingMessage = {
      recipientId,
      content,
    };

    try {
      this.client.publish({
        destination: '/app/chat',
        body: JSON.stringify(message),
      });
      console.log('[WebSocket] Message sent:', message);
      return true;
    } catch (err) {
      console.error('[WebSocket] Failed to send message:', err);
      return false;
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    this.updateStatus('disconnected');
    console.log('[WebSocket] Disconnected');
  }

  /**
   * Register a callback for incoming messages
   * @param callback - Function to call when a message is received
   * @returns Unsubscribe function
   */
  onMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.add(callback);
    return () => {
      this.messageCallbacks.delete(callback);
    };
  }

  /**
   * Register a callback for connection status changes
   * @param callback - Function to call when status changes
   * @returns Unsubscribe function
   */
  onStatusChange(callback: StatusCallback): () => void {
    this.statusCallbacks.add(callback);
    // Immediately call with current status
    callback(this.currentStatus);
    return () => {
      this.statusCallbacks.delete(callback);
    };
  }

  /**
   * Get current connection status
   */
  getStatus(): ConnectionStatus {
    return this.currentStatus;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  /**
   * Update connection status and notify callbacks
   */
  private updateStatus(status: ConnectionStatus): void {
    if (this.currentStatus !== status) {
      this.currentStatus = status;
      this.statusCallbacks.forEach(callback => {
        try {
          callback(status);
        } catch (err) {
          console.error('[WebSocket] Error in status callback:', err);
        }
      });
    }
  }

  /**
   * Reconnect with current token
   */
  reconnect(): void {
    if (this.token) {
      this.disconnect();
      setTimeout(() => {
        this.connect(this.token);
      }, 1000);
    }
  }
}

// Export singleton instance
export const chatWebSocket = new ChatWebSocketService();
