import { Router, Request, Response } from "express";
import { getfarcasterCastDetail } from "../controllers/farcaster";

const router = Router();

router.get("/cast", getfarcasterCastDetail);

export default router;