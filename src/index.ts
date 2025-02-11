import "dotenv/config"; // Loads .env variables if present
import express, { Request, Response } from "express";
const cors = require('cors');
import marketMetadataRoutes from "./routes/marketMetadata";
import schedulerRoutes from "./routes/scheduler";

import { agenda } from "./resolvers/agenda";
import "./resolvers/farcaster";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({ status: "OK", message: "Hello XO Market!" });
});

// NFT routes
app.use("/market/metadata", marketMetadataRoutes);
app.use("/scheduler", schedulerRoutes);

export default app;
