import { Router, Request, Response } from "express";
import { getUserActivity } from "../controllers/user";

const router = Router();

router.get("/activity/:userAddress", getUserActivity);

export default router;