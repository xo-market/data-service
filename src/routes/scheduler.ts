import { Router, Request, Response } from "express";
import { agenda } from "../resolvers/agenda";


// Define router
const router = Router();

/**
 * POST /scheduler
 * schedule the job .
 */
router.post("/", async (req: any, res: any) => {
    try {
        const { cast_hash, market_id } = req.body;

        if (!cast_hash || !market_id) {
            return res.status(400).json({ success: false, error: "No cast hash or market id provided" });
        }
        let targetDate = new Date();
        targetDate.setSeconds(targetDate.getSeconds() + 10);

        await agenda.schedule(targetDate, 'verifyFarcasterLikes', { cast_hash, market_id });
        res.json({ success: true, message: 'verifyFarcasterLikes added to agenda' });

    } catch (error) {
        console.error('Error scheduling job:', error);
        res.status(500).json({ error: 'Failed to schedule email' });
    }
});



export default router;
