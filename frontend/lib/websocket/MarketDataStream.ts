type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
}

interface OrderBookDepth {
  symbol: string;
  bids: Array<[number, number]>;
  asks: Array<[number, number]>;
  timestamp: number;
}

interface StreamOptions {
  url: string;
  reconnectDelay?: number;
  maxReconnectDelay?: number;
  reconnectAttempts?: number;
}

export class MarketDataStream {
  private ws: WebSocket | null = null;
  private state: ConnectionState = 'disconnected';
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempt = 0;
  private readonly options: Required<StreamOptions>;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private lastHeartbeat = 0;

  private priceUpdateHandlers: Set<(data: MarketData) => void> = new Set();
  private volumeChangeHandlers: Set<(data: MarketData) => void> = new Set();
  private depthUpdateHandlers: Set<(data: OrderBookDepth) => void> = new Set();
  private stateChangeHandlers: Set<(state: ConnectionState) => void> = new Set();

  constructor(options: StreamOptions) {
    this.options = {
      url: options.url,
      reconnectDelay: options.reconnectDelay || 1000,
      maxReconnectDelay: options.maxReconnectDelay || 30000,
      reconnectAttempts: options.reconnectAttempts || Infinity,
    };
  }

  connect(): void {
    if (this.state === 'connected' || this.state === 'connecting') {
      return;
    }

    this.setState('connecting');
    this.ws = new WebSocket(this.options.url);

    this.ws.onopen = () => this.handleOpen();
    this.ws.onmessage = (event) => this.handleMessage(event);
    this.ws.onerror = (error) => this.handleError(error);
    this.ws.onclose = () => this.handleClose();
  }

  disconnect(): void {
    this.clearTimers();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setState('disconnected');
  }

  subscribe(symbols: string[]): void {
    this.send({
      action: 'subscribe',
      symbols,
    });
  }

  unsubscribe(symbols: string[]): void {
    this.send({
      action: 'unsubscribe',
      symbols,
    });
  }

  onPriceUpdate(handler: (data: MarketData) => void): () => void {
    this.priceUpdateHandlers.add(handler);
    return () => this.priceUpdateHandlers.delete(handler);
  }

  onVolumeChange(handler: (data: MarketData) => void): () => void {
    this.volumeChangeHandlers.add(handler);
    return () => this.volumeChangeHandlers.delete(handler);
  }

  onDepthUpdate(handler: (data: OrderBookDepth) => void): () => void {
    this.depthUpdateHandlers.add(handler);
    return () => this.depthUpdateHandlers.delete(handler);
  }

  onStateChange(handler: (state: ConnectionState) => void): () => void {
    this.stateChangeHandlers.add(handler);
    return () => this.stateChangeHandlers.delete(handler);
  }

  getState(): ConnectionState {
    return this.state;
  }

  isConnected(): boolean {
    return this.state === 'connected';
  }

  private handleOpen(): void {
    this.setState('connected');
    this.reconnectAttempt = 0;
    this.startHeartbeat();
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'price':
          this.priceUpdateHandlers.forEach((handler) => handler(data));
          break;
        case 'volume':
          this.volumeChangeHandlers.forEach((handler) => handler(data));
          break;
        case 'depth':
          this.depthUpdateHandlers.forEach((handler) => handler(data));
          break;
        case 'heartbeat':
          this.lastHeartbeat = Date.now();
          break;
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  }

  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
  }

  private handleClose(): void {
    this.clearTimers();
    
    if (this.state === 'disconnected') {
      return;
    }

    this.setState('reconnecting');
    this.scheduleReconnect();
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempt >= this.options.reconnectAttempts) {
      this.setState('disconnected');
      return;
    }

    const delay = Math.min(
      this.options.reconnectDelay * Math.pow(2, this.reconnectAttempt),
      this.options.maxReconnectDelay
    );

    this.reconnectAttempt++;
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startHeartbeat(): void {
    this.lastHeartbeat = Date.now();
    this.heartbeatTimer = setInterval(() => {
      const timeSinceLastHeartbeat = Date.now() - this.lastHeartbeat;
      
      if (timeSinceLastHeartbeat > 10000) {
        this.ws?.close();
      } else {
        this.send({ type: 'ping' });
      }
    }, 5000);
  }

  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private send(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  private setState(newState: ConnectionState): void {
    if (this.state !== newState) {
      this.state = newState;
      this.stateChangeHandlers.forEach((handler) => handler(newState));
    }
  }
}
