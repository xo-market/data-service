import { query } from "../utils/postgresDB";

 
/**
 * @route GET /user/activity:userAddress
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

        return res.json({ success: true, data:user_activities });
    } catch (error: any) {
        console.error("Error Fetching User Activity:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
 