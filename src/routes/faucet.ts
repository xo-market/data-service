import { Router, Request, Response } from "express";
import { claimCollateralTokenFaucet } from "../controllers/faucet";

const router = Router();

router.post("/token", claimCollateralTokenFaucet);

export default router;