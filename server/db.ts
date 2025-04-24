import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a new pool using the connection string from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon.tech
  }
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test the connection
const testConnection = async () => {
  let client: PoolClient | undefined;
  try {
    client = await pool.connect();
    console.log('Successfully connected to the database');
  } catch (err) {
    console.error('Error connecting to the database:', err);
    throw err; // Re-throw the error to ensure the application fails if DB connection fails
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Run the connection test
testConnection().catch((err) => {
  console.error('Failed to connect to the database:', err);
  process.exit(1);
});

export default pool;