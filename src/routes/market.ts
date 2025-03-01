import { Router, Request, Response } from "express";
import { createFarcasterMarket, scheduleFarcasterMarket, validateFarcasterMarket } from "../controllers/farcaster";
import { getAllMarkets, getMarketPrices } from "../controllers/market";


const router = Router();

router.get("/all", getAllMarkets)
router.get("/price-chart/:market_id", getMarketPrices)
router.post("/farcaster/schedule", scheduleFarcasterMarket);
router.post("/farcaster/validate", validateFarcasterMarket);
router.post("/farcaster/create", createFarcasterMarket);


export default router;
