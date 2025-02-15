import { Router, Request, Response } from "express";
import { createFarcasterMarket, scheduleFarcasterMarket, validateFarcasterMarket } from "../controllers/farcaster";


const router = Router();


router.post("/farcaster/schedule", scheduleFarcasterMarket);
router.post("/farcaster/validate", validateFarcasterMarket);
router.post("/farcaster/create", createFarcasterMarket);


export default router;
