import 'dotenv/config';
import { MongoClient, Db } from 'mongodb';

/**
 * Sanitizes MongoDB connection URIs by:
 * 1. Removing surrounding quotes or whitespace
 * 2. Stripping template placeholder brackets like `<username>` and `<password>`
 * 3. Safely encoding special characters in the username & password with encodeURIComponent
 *    (preventing MongoParseError: Password contains unescaped characters)
 */
export function sanitizeMongoUri(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  let str = raw.trim().replace(/^["']|["']$/g, '');

  const protocolMatch = str.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/);
  if (!protocolMatch) return str;

  const protocol = protocolMatch[1];
  const rest = protocolMatch[2];

  const atIndex = rest.lastIndexOf('@');
  if (atIndex === -1) return str; // no credentials

  const userInfo = rest.substring(0, atIndex);
  const hostAndOptions = rest.substring(atIndex + 1);

  const colonIndex = userInfo.indexOf(':');
  if (colonIndex === -1) {
    let user = userInfo;
    if (user.startsWith('<') && user.endsWith('>')) user = user.slice(1, -1);
    try {
      user = decodeURIComponent(user);
    } catch {}
    return `${protocol}${encodeURIComponent(user)}@${hostAndOptions}`;
  }

  let user = userInfo.substring(0, colonIndex);
  let pass = userInfo.substring(colonIndex + 1);

  // Strip placeholder angle brackets if user entered <username> or <password>
  if (user.startsWith('<') && user.endsWith('>')) user = user.slice(1, -1);
  if (pass.startsWith('<') && pass.endsWith('>')) pass = pass.slice(1, -1);

  // Decode first in case user partially encoded, then strictly encode
  try {
    user = decodeURIComponent(user);
  } catch {}
  try {
    pass = decodeURIComponent(pass);
  } catch {}

  return `${protocol}${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${hostAndOptions}`;
}

const rawUri = process.env.MONGODB_URI || '';
const sanitizedUri = sanitizeMongoUri(rawUri);

let clientPromise: Promise<MongoClient> | null = null;

/**
 * Connects to MongoDB with connection caching for Vercel Serverless Functions.
 * Reuses the existing connection pool across invocations.
 */
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db } | null> {
  if (!sanitizedUri) {
    return null;
  }

  try {
    if (!clientPromise) {
      const client = new MongoClient(sanitizedUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      clientPromise = client.connect();
    }

    const client = await clientPromise;
    const db = client.db('noble_polyhedra');
    return { client, db };
  } catch (error: any) {
    console.warn('[MongoDB] Connection unavailable (fallback to browser storage):', error?.message || error);
    // Reset clientPromise so future requests can retry if credentials or network change
    clientPromise = null;
    return null;
  }
}
