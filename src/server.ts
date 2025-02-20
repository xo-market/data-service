import app from "./index";
import { agenda } from "./resolvers/agenda";
import "./resolvers/farcaster";
import pool from "./utils/postgresDB";
import { PoolClient } from "pg";  
const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await agenda.start();
  console.log('Agenda started and connected to MongoDB');
  pool.connect()
  .then((client: PoolClient) => { 
    console.log('Connected to PostgreSQL');
    client.release(); // Release client back to the pool
  })
  .catch((error: any) => {
    console.error('Failed to connect to PostgreSQL:', error);
    process.exit(1);
  });
});