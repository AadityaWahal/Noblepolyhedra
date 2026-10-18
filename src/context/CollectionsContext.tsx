import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAppAuth } from './AuthContext';

interface CollectionsContextType {
  favorites: string[];
  bookmarks: string[];
  isFavorite: (shapeId: string) => boolean;
  isBookmarked: (shapeId: string) => boolean;
  toggleFavorite: (shapeId: string) => Promise<void>;
  toggleBookmark: (shapeId: string) => Promise<void>;
  clearFavorites: () => Promise<void>;
  clearBookmarks: () => Promise<void>;
  isSyncing: boolean;
  isMongoConnected: boolean;
  lastSyncedAt: Date | null;
  refreshFromCloud: () => Promise<void>;
}

const CollectionsContext = createContext<CollectionsContextType>({
  favorites: [],
  bookmarks: [],
  isFavorite: () => false,
  isBookmarked: () => false,
  toggleFavorite: async () => {},
  toggleBookmark: async () => {},
  clearFavorites: async () => {},
  clearBookmarks: async () => {},
  isSyncing: false,
  isMongoConnected: false,
  lastSyncedAt: null,
  refreshFromCloud: async () => {},
});

export const useCollections = () => useContext(CollectionsContext);

export const CollectionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId, isSignedIn } = useAppAuth();
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('noble_user_favorites');
      return stored ? JSON.parse(stored) : ['D-1', 'sD-1']; // default favorites
    } catch {
      return ['D-1', 'sD-1'];
    }
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('noble_user_bookmarks');
      return stored ? JSON.parse(stored) : ['C-1', 'I-1']; // default bookmarks
    } catch {
      return ['C-1', 'I-1'];
    }
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isMongoConnected, setIsMongoConnected] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Keep local storage in sync whenever favorites or bookmarks change
  useEffect(() => {
    try {
      localStorage.setItem('noble_user_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites to local storage', e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('noble_user_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('Failed to save bookmarks to local storage', e);
    }
  }, [bookmarks]);

  // Synchronize with backend API (MongoDB on Vercel)
  const refreshFromCloud = useCallback(async () => {
    if (!userId) return;

    try {
      setIsSyncing(true);
      const res = await fetch(`/api/user-data?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        setIsMongoConnected(Boolean(data.isMongoConnected));

        if (Array.isArray(data.favorites) && Array.isArray(data.bookmarks)) {
          // If remote has data, merge with local data
          setFavorites(prev => Array.from(new Set([...prev, ...data.favorites])));
          setBookmarks(prev => Array.from(new Set([...prev, ...data.bookmarks])));
          setLastSyncedAt(new Date());

          // If local has items not on server, push a merge back
          const hasLocalUniqueFavs = favorites.some(id => !data.favorites.includes(id));
          const hasLocalUniqueBms = bookmarks.some(id => !data.bookmarks.includes(id));

          if ((hasLocalUniqueFavs || hasLocalUniqueBms) && data.isMongoConnected) {
            await fetch('/api/user-data', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId,
                action: 'syncAll',
                favorites,
                bookmarks,
              }),
            });
          }
        }
      }
    } catch (err) {
      console.warn('Could not sync collections from cloud (using local storage)', err);
    } finally {
      setIsSyncing(false);
    }
  }, [userId, favorites, bookmarks]);

  // Initial cloud sync on mount and when user identity changes
  useEffect(() => {
    refreshFromCloud();
  }, [userId, isSignedIn]);

  const isFavorite = useCallback(
    (shapeId: string) => favorites.includes(shapeId),
    [favorites]
  );

  const isBookmarked = useCallback(
    (shapeId: string) => bookmarks.includes(shapeId),
    [bookmarks]
  );

  const toggleFavorite = useCallback(
    async (shapeId: string) => {
      setFavorites(prev => {
        const next = prev.includes(shapeId)
          ? prev.filter(id => id !== shapeId)
          : [...prev, shapeId];
        return next;
      });

      // Background sync to MongoDB API
      if (userId) {
        try {
          fetch('/api/user-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              action: 'toggleFavorite',
              shapeId,
            }),
          })
            .then(res => res.json())
            .then(data => {
              if (data?.isMongoConnected !== undefined) {
                setIsMongoConnected(data.isMongoConnected);
              }
              setLastSyncedAt(new Date());
            })
            .catch(() => {});
        } catch {
          // ignore offline
        }
      }
    },
    [userId]
  );

  const toggleBookmark = useCallback(
    async (shapeId: string) => {
      setBookmarks(prev => {
        const next = prev.includes(shapeId)
          ? prev.filter(id => id !== shapeId)
          : [...prev, shapeId];
        return next;
      });

      // Background sync to MongoDB API
      if (userId) {
        try {
          fetch('/api/user-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              action: 'toggleBookmark',
              shapeId,
            }),
          })
            .then(res => res.json())
            .then(data => {
              if (data?.isMongoConnected !== undefined) {
                setIsMongoConnected(data.isMongoConnected);
              }
              setLastSyncedAt(new Date());
            })
            .catch(() => {});
        } catch {
          // ignore offline
        }
      }
    },
    [userId]
  );

  const clearFavorites = useCallback(async () => {
    setFavorites([]);
    if (userId) {
      try {
        await fetch('/api/user-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, action: 'clear' }),
        });
      } catch {
        // ignore
      }
    }
  }, [userId]);

  const clearBookmarks = useCallback(async () => {
    setBookmarks([]);
    if (userId) {
      try {
        await fetch('/api/user-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, action: 'clear' }),
        });
      } catch {
        // ignore
      }
    }
  }, [userId]);

  return (
    <CollectionsContext.Provider
      value={{
        favorites,
        bookmarks,
        isFavorite,
        isBookmarked,
        toggleFavorite,
        toggleBookmark,
        clearFavorites,
        clearBookmarks,
        isSyncing,
        isMongoConnected,
        lastSyncedAt,
        refreshFromCloud,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};
