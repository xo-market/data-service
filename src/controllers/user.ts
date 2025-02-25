import { query } from "../utils/postgresDB";


/**
 * @route GET /user/activity/:userAddress
 * @description Returns list of user activity.
 * @param {string} userAddress - User address.
 * @returns {Object} JSON response containing list of user activity.
 */
export const getUserActivity = async (req: any, res: any) => {
    try {
        const { userAddress } = req.params;
        if (!userAddress) {
            return res.status(400).json({ success: false, error: "Missing userAddress" });
        }
        let user_activities = await query(`SELECT * FROM user_activity WHERE user_address = $1`, [userAddress]);

        return res.json({ success: true, data: user_activities });
    } catch (error: any) {
        console.error("Error Fetching User Activity:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}


/**
 * @route GET /user/current-market/:userAddress
 * @description Returns list of current markets user have.
 * @param {string} userAddress - User address.
 * @returns {Object} JSON response containing list of user market.
 */
export const getCurremtUserMarketData = async (req: any, res: any) => {
    try {
        const { userAddress } = req.params;
        if (!userAddress) {
            return res.status(400).json({ success: false, error: "Missing userAddress" });
        }
        let user_activities = await query(
            `SELECT 
                umd.market_id, 
                umd.outcome, 
                umd.quantity,
                m.name AS market_name, 
                m.description AS market_description,
                m.creator AS market_creator,
                m.expires_at
             FROM user_market_data umd
             JOIN market m ON umd.market_id = m.market_id
             WHERE umd.user_address = $1 AND umd.is_expired = $2`,
            [userAddress, false]
        );

        return res.json({ success: true, data: user_activities });
    } catch (error: any) {
        console.error("Error Fetching User Activity:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * @route GET /user/past-market/:userAddress
 * @description Returns list of past markets user had.
 * @param {string} userAddress - User address.
 * @returns {Object} JSON response containing list of user market.
 */
export const getPastUserMarketData = async (req: any, res: any) => {
    try {
        const { userAddress } = req.params;
        if (!userAddress) {
            return res.status(400).json({ success: false, error: "Missing userAddress" });
        }
        let user_activities = await query(
            `SELECT 
                umd.market_id, 
                umd.outcome as user_outcome, 
                umd.wining_outcome,
                umd.quantity,
                umd.is_redeemed,
                umd.is_claimable,
                m.name AS market_name, 
                m.description AS market_description,
                m.creator AS market_creator,
                m.expires_at as expired_at
             FROM user_market_data umd
             JOIN market m ON umd.market_id = m.market_id
             WHERE umd.user_address = $1 AND umd.is_expired = $2`,
            [userAddress, true]
        );

        return res.json({ success: true, data: user_activities });
    } catch (error: any) {
        console.error("Error Fetching User Activity:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}