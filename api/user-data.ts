import { connectToDatabase } from './_db';

interface UserDataPayload {
  userId: string;
  action?: 'toggleFavorite' | 'toggleBookmark' | 'syncAll' | 'clear' | 'clearFavorites' | 'clearBookmarks';
  shapeId?: string;
  favorites?: string[];
  bookmarks?: string[];
}

// Vercel Serverless Function: /api/user-data
export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { db } = (await connectToDatabase()) || {};

  // GET: Fetch user's bookmarks & favorites
  if (req.method === 'GET') {
    const userId = (req.query?.userId as string) || '';

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' });
    }

    if (!db) {
      // MongoDB is not configured or offline - tell the client to use local storage
      return res.status(200).json({
        success: true,
        isMongoConnected: false,
        message: 'MongoDB URI not configured. Storing in local browser storage.',
        favorites: [],
        bookmarks: [],
      });
    }

    try {
      const collection = db.collection('user_shapes');
      const userData = await collection.findOne({ userId });

      return res.status(200).json({
        success: true,
        isMongoConnected: true,
        favorites: userData?.favorites || [],
        bookmarks: userData?.bookmarks || [],
      });
    } catch (err: any) {
      console.error('MongoDB read error:', err);
      return res.status(500).json({ error: 'Database read failed', details: err.message });
    }
  }

  // POST: Update, toggle, or synchronize bookmarks and favorites
  if (req.method === 'POST') {
    const body: UserDataPayload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { userId, action, shapeId, favorites, bookmarks } = body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId in request body' });
    }

    if (!db) {
      return res.status(200).json({
        success: true,
        isMongoConnected: false,
        message: 'MongoDB URI not configured. Client will persist in local storage.',
        favorites: favorites || [],
        bookmarks: bookmarks || [],
      });
    }

    try {
      const collection = db.collection('user_shapes');
      const existing = await collection.findOne({ userId });
      let updatedFavorites: string[] = existing?.favorites || [];
      let updatedBookmarks: string[] = existing?.bookmarks || [];

      if (action === 'toggleFavorite' && shapeId) {
        if (updatedFavorites.includes(shapeId)) {
          updatedFavorites = updatedFavorites.filter(id => id !== shapeId);
        } else {
          updatedFavorites = [...updatedFavorites, shapeId];
        }
      } else if (action === 'toggleBookmark' && shapeId) {
        if (updatedBookmarks.includes(shapeId)) {
          updatedBookmarks = updatedBookmarks.filter(id => id !== shapeId);
        } else {
          updatedBookmarks = [...updatedBookmarks, shapeId];
        }
      } else if (action === 'syncAll') {
        if (Array.isArray(favorites)) {
          // Merge unique
          updatedFavorites = Array.from(new Set([...updatedFavorites, ...favorites]));
        }
        if (Array.isArray(bookmarks)) {
          // Merge unique
          updatedBookmarks = Array.from(new Set([...updatedBookmarks, ...bookmarks]));
        }
      } else if (action === 'clearFavorites') {
        updatedFavorites = [];
      } else if (action === 'clearBookmarks') {
        updatedBookmarks = [];
      } else if (action === 'clear') {
        updatedFavorites = [];
        updatedBookmarks = [];
      }

      await collection.updateOne(
        { userId },
        {
          $set: {
            userId,
            favorites: updatedFavorites,
            bookmarks: updatedBookmarks,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      return res.status(200).json({
        success: true,
        isMongoConnected: true,
        favorites: updatedFavorites,
        bookmarks: updatedBookmarks,
      });
    } catch (err: any) {
      console.error('MongoDB write error:', err);
      return res.status(500).json({ error: 'Database write failed', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
