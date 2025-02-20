import { query } from "../utils/postgresDB";
/**
 * @route GET /market/all
 * @description Returns list of Market.
 * @returns {Object} JSON response containing list of Market.
 */
export const getAllMarkets = async (req: any, res: any) => {
    try {

        let markets = await query(`SELECT * FROM market`);

        return res.json({ success: true, markets });
    } catch (error: any) {
        console.error("Error Fetching Markets:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}

/**
* @route GET /market/prices
* @description Returns list of price for particular market.
* @param {string} market_id - Market ID.
* @returns {Object} JSON response containing list of price at specific timestamp.
*/
export const getMarketPrices = async (req: any, res: any) => {
    try {
        const { market_id } = req.params;
        if (!market_id) {
            return res.status(400).json({ success: false, error: "Missing market_id" });
        }
        let all_prices = await query(`SELECT outcome_prices as price, timestamp FROM market_price WHERE market_id = $1`, [market_id]);

        return res.json({ success: true, prices: all_prices });
    } catch (error: any) {
        console.error("Error Fetching Market Prices:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}


