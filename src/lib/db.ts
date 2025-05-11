import { Db, MongoClient } from 'mongodb';
import { sleep } from './utils';
import logger from './logger';

/*
Use a global variable to store the connection
This exists outside React's rendering cycle and persists between requests
*/
declare global {
  // eslint-disable-next-line no-var
  var mongoDBPromise: Promise<{ client: MongoClient; db: Db }> | undefined;
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) throw new Error('Please define the MONGODB_URI environment variable');

if (!dbName) throw new Error('Please define the MONGODB_DB environment variable');

// Configuration for connection retries
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function createConnection() {
  logger('Attempting to connect to MongoDB...');

  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const client = await MongoClient.connect(uri!, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });
      const db = client.db(dbName);
      // Test the connection with a ping
      await db.command({ ping: 1 });
      logger(`Successfully connected to MongoDB (attempt ${attempt})`);
      return { client, db };
    } catch (e) {
      lastError = e;
      logger(
        `MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed: %s`,
        e instanceof Error ? e.message : String(e),
      );
      // Only sleep if we're going to retry
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
      }
    }
  }
  logger('Failed to connect to MongoDB after multiple attempts');
  throw {
    code: 'MONGODB_CONNECTION_FAILED',
    message: 'Unable to connect to the database. Please try again later.',
    originalError: lastError,
  };
}

async function connectToDatabase() {
  const caller = new Error().stack?.split('\n')[2] || 'unknown';
  logger('Connection requested from: %s', caller);

  // If we already have a connection promise, use it
  if (!global.mongoDBPromise) {
    global.mongoDBPromise = createConnection();
    logger('Created new connection promise');
  } else {
    logger('Reusing existing connection promise');
  }

  try {
    // Wait for the connection
    const conn = await global.mongoDBPromise;
    // Verify the connection is still alive
    await conn.db.command({ ping: 1 });

    return conn;
  } catch (e) {
    logger(
      'Connection is no longer valid, creating a new one %s',
      e instanceof Error ? e.message : String(e),
    );
    global.mongoDBPromise = createConnection();
    return global.mongoDBPromise;
  }
}

export default connectToDatabase;
