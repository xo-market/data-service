import "dotenv/config"; // Loads .env variables if present
import express, { Request, Response } from "express";
const cors = require('cors');
import marketMetadataRoutes from "./routes/marketMetadata";
import genearteMarketRoutes from "./routes/generateMarketRoutes";

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
app.use("/generate-market", genearteMarketRoutes);

export default app;
