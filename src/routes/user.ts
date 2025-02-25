import { Router, Request, Response } from "express";
import { getUserActivity, getCurremtUserMarketData, getPastUserMarketData } from "../controllers/user";

const router = Router();

router.get("/activity/:userAddress", getUserActivity);
router.get("/current-market/:userAddress", getCurremtUserMarketData);
router.get("/past-market/:userAddress", getPastUserMarketData);

export default router;