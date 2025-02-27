import "dotenv/config"; // Loads .env variables if present
import express, { Request, Response } from "express";
const cors = require('cors');
import marketRoutes from "./routes/market";
import ipFsRoutes from "./routes/ipfs";
import userRoutes from "./routes/user";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "OK", message: "Hello XO Market!" });
});

app.use("/market", marketRoutes);
app.use("/ipfs", ipFsRoutes);
app.use("/user", userRoutes);

export default app;
