import { Router } from "express";
import { fetchFarcasterCast } from "../providers/farcaster";
import { getMarket } from "../utils/gemini";

const router = Router();

/**
 * POST /generate-market/farcaster
 * Accept cast_hash and return market response.
 */
router.post("/farcaster", async (req: any, res: any) => {
  try {
    const {cast_hash} = req.body;
    if (!cast_hash) {
      return res.status(400).json({ success: false, error: "No cast hash provided" });
    }

    const cast_response = await fetchFarcasterCast(cast_hash);
    // console.log(cast_response);
    if (!cast_response) {
      return res.status(400).json({ success: false, error: "Error fetching cast" });
    }
    const market_response = await getMarket(cast_response.text);


    return res.json({
      success: true,
      market: market_response,
    });
  } catch (error: any) {
    console.error("Error generating market data:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});
 
 
export default router;
