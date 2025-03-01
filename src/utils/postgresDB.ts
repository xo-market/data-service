import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.PG_URL, // Use connection string
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
});

// Function to execute queries
export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } catch (error) {
    console.error("❌ Database query error:", error);
    throw error;
  } finally {
    client.release();
  }
};

export default pool;
