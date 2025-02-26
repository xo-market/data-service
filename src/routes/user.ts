import { Router, Request, Response } from "express";
import { getUserActivity, getCurrentUserMarketData, getPastUserMarketData, getUserLeaderboard } from "../controllers/user";

const router = Router();

router.get("/activity/:userAddress", getUserActivity);
router.get("/current-market/:userAddress", getCurrentUserMarketData);
router.get("/past-market/:userAddress", getPastUserMarketData);
router.get("/leaderboard", getUserLeaderboard);

export default router;