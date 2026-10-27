import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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

// User-scoped Local Storage helpers
function getLocalFavorites(uid: string): string[] {
  if (typeof window === 'undefined' || !uid) return [];
  try {
    const raw = localStorage.getItem(`noble_favs_${uid}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getLocalBookmarks(uid: string): string[] {
  if (typeof window === 'undefined' || !uid) return [];
  try {
    const raw = localStorage.getItem(`noble_bmks_${uid}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalFavorites(uid: string, favs: string[]) {
  if (typeof window === 'undefined' || !uid) return;
  try {
    localStorage.setItem(`noble_favs_${uid}`, JSON.stringify(favs));
  } catch (e) {
    console.warn('Failed to save favorites to local storage', e);
  }
}

function saveLocalBookmarks(uid: string, bmks: string[]) {
  if (typeof window === 'undefined' || !uid) return;
  try {
    localStorage.setItem(`noble_bmks_${uid}`, JSON.stringify(bmks));
  } catch (e) {
    console.warn('Failed to save bookmarks to local storage', e);
  }
}

export const CollectionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId, isSignedIn } = useAppAuth();
  const currentUserIdRef = useRef<string>(userId);

  // Initialize with the current user's local store
  const [favorites, setFavorites] = useState<string[]>(() => getLocalFavorites(userId));
  const [bookmarks, setBookmarks] = useState<string[]>(() => getLocalBookmarks(userId));

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isMongoConnected, setIsMongoConnected] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Synchronize with backend API (MongoDB on Vercel)
  const refreshFromCloud = useCallback(async (targetUid?: string) => {
    const target = targetUid || currentUserIdRef.current;
    if (!target) return;

    try {
      setIsSyncing(true);
      const res = await fetch(`/api/user-data?userId=${encodeURIComponent(target)}`);
      if (res.ok) {
        const data = await res.json();
        
        // Guard against race conditions if user switched while fetching
        if (currentUserIdRef.current !== target) return;

        setIsMongoConnected(Boolean(data.isMongoConnected));

        if (Array.isArray(data.favorites) && Array.isArray(data.bookmarks)) {
          if (data.isMongoConnected) {
            // MongoDB is active: cloud is authoritative for this specific user
            setFavorites(data.favorites);
            setBookmarks(data.bookmarks);
            saveLocalFavorites(target, data.favorites);
            saveLocalBookmarks(target, data.bookmarks);
          } else {
            // Local storage mode: keep user's local items
            const localFavs = getLocalFavorites(target);
            const localBmks = getLocalBookmarks(target);
            setFavorites(localFavs);
            setBookmarks(localBmks);
          }
          setLastSyncedAt(new Date());
        }
      }
    } catch (err) {
      console.warn('Could not sync collections from cloud (using user local storage)', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // When userId changes (user signs in, switches accounts, or logs out to guest):
  // Immediately switch in-memory state to that user's store and prevent leaking!
  useEffect(() => {
    currentUserIdRef.current = userId;

    // 1. Immediately switch to the new user's isolated local storage
    const newFavs = getLocalFavorites(userId);
    const newBmks = getLocalBookmarks(userId);
    setFavorites(newFavs);
    setBookmarks(newBmks);
    setLastSyncedAt(null);

    // 2. Fetch the user's remote data from MongoDB if available
    refreshFromCloud(userId);
  }, [userId, isSignedIn, refreshFromCloud]);

  // Keep the current user's local storage in sync whenever their favorites change
  useEffect(() => {
    if (userId) {
      saveLocalFavorites(userId, favorites);
    }
  }, [favorites, userId]);

  // Keep the current user's local storage in sync whenever their bookmarks change
  useEffect(() => {
    if (userId) {
      saveLocalBookmarks(userId, bookmarks);
    }
  }, [bookmarks, userId]);

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
      const activeUid = currentUserIdRef.current;
      setFavorites(prev => {
        const next = prev.includes(shapeId)
          ? prev.filter(id => id !== shapeId)
          : [...prev, shapeId];
        saveLocalFavorites(activeUid, next);
        return next;
      });

      // Background sync to MongoDB API for this user
      if (activeUid) {
        try {
          fetch('/api/user-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: activeUid,
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
    []
  );

  const toggleBookmark = useCallback(
    async (shapeId: string) => {
      const activeUid = currentUserIdRef.current;
      setBookmarks(prev => {
        const next = prev.includes(shapeId)
          ? prev.filter(id => id !== shapeId)
          : [...prev, shapeId];
        saveLocalBookmarks(activeUid, next);
        return next;
      });

      // Background sync to MongoDB API for this user
      if (activeUid) {
        try {
          fetch('/api/user-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: activeUid,
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
    []
  );

  const clearFavorites = useCallback(async () => {
    const activeUid = currentUserIdRef.current;
    setFavorites([]);
    saveLocalFavorites(activeUid, []);
    if (activeUid) {
      try {
        await fetch('/api/user-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: activeUid, action: 'clearFavorites' }),
        });
      } catch {
        // ignore
      }
    }
  }, []);

  const clearBookmarks = useCallback(async () => {
    const activeUid = currentUserIdRef.current;
    setBookmarks([]);
    saveLocalBookmarks(activeUid, []);
    if (activeUid) {
      try {
        await fetch('/api/user-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: activeUid, action: 'clearBookmarks' }),
        });
      } catch {
        // ignore
      }
    }
  }, []);

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
