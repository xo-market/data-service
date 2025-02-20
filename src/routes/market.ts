import { Router, Request, Response } from "express";
import { createFarcasterMarket, scheduleFarcasterMarket, validateFarcasterMarket } from "../controllers/farcaster";
import { getAllMarkets } from "../controllers/market";


const router = Router();

router.get("/all",getAllMarkets)
router.post("/farcaster/schedule", scheduleFarcasterMarket);
router.post("/farcaster/validate", validateFarcasterMarket);
router.post("/farcaster/create", createFarcasterMarket);


export default router;
