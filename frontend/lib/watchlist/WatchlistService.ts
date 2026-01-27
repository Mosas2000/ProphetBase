export interface WatchlistItem {
  symbol: string;
  name: string;
  currentPrice: number;
  change24h: number;
  volume: number;
  order: number;
}

export interface Watchlist {
  id: string;
  name: string;
  items: WatchlistItem[];
  createdAt: number;
  updatedAt: number;
}

export class WatchlistService {
  private watchlists: Map<string, Watchlist> = new Map();
  private readonly MAX_WATCHLISTS = 10;
  private readonly MAX_ITEMS_PER_WATCHLIST = 50;

  createWatchlist(name: string): Watchlist {
    if (this.watchlists.size >= this.MAX_WATCHLISTS) {
      throw new Error(`Maximum of ${this.MAX_WATCHLISTS} watchlists allowed`);
    }

    const watchlist: Watchlist = {
      id: `WL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      items: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.watchlists.set(watchlist.id, watchlist);
    return watchlist;
  }

  getWatchlists(): Watchlist[] {
    return Array.from(this.watchlists.values()).sort(
      (a, b) => b.updatedAt - a.updatedAt
    );
  }

  getWatchlist(id: string): Watchlist | undefined {
    return this.watchlists.get(id);
  }

  addItem(watchlistId: string, item: Omit<WatchlistItem, 'order'>): Watchlist {
    const watchlist = this.watchlists.get(watchlistId);
    if (!watchlist) {
      throw new Error('Watchlist not found');
    }

    if (watchlist.items.length >= this.MAX_ITEMS_PER_WATCHLIST) {
      throw new Error(`Maximum of ${this.MAX_ITEMS_PER_WATCHLIST} items allowed`);
    }

    const exists = watchlist.items.some((i) => i.symbol === item.symbol);
    if (exists) {
      throw new Error('Symbol already in watchlist');
    }

    const newItem: WatchlistItem = {
      ...item,
      order: watchlist.items.length,
    };

    watchlist.items.push(newItem);
    watchlist.updatedAt = Date.now();
    this.watchlists.set(watchlistId, watchlist);

    return watchlist;
  }

  removeItem(watchlistId: string, symbol: string): Watchlist {
    const watchlist = this.watchlists.get(watchlistId);
    if (!watchlist) {
      throw new Error('Watchlist not found');
    }

    watchlist.items = watchlist.items
      .filter((item) => item.symbol !== symbol)
      .map((item, index) => ({ ...item, order: index }));
    
    watchlist.updatedAt = Date.now();
    this.watchlists.set(watchlistId, watchlist);

    return watchlist;
  }

  reorderItems(
    watchlistId: string,
    fromIndex: number,
    toIndex: number
  ): Watchlist {
    const watchlist = this.watchlists.get(watchlistId);
    if (!watchlist) {
      throw new Error('Watchlist not found');
    }

    const items = [...watchlist.items];
    const [removed] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, removed);

    watchlist.items = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    watchlist.updatedAt = Date.now();
    this.watchlists.set(watchlistId, watchlist);

    return watchlist;
  }

  updatePrices(updates: Map<string, { price: number; change24h: number; volume: number }>): void {
    this.watchlists.forEach((watchlist) => {
      watchlist.items.forEach((item) => {
        const update = updates.get(item.symbol);
        if (update) {
          item.currentPrice = update.price;
          item.change24h = update.change24h;
          item.volume = update.volume;
        }
      });
    });
  }

  deleteWatchlist(id: string): void {
    this.watchlists.delete(id);
  }

  renameWatchlist(id: string, newName: string): Watchlist {
    const watchlist = this.watchlists.get(id);
    if (!watchlist) {
      throw new Error('Watchlist not found');
    }

    watchlist.name = newName;
    watchlist.updatedAt = Date.now();
    this.watchlists.set(id, watchlist);

    return watchlist;
  }
}
