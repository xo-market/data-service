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


