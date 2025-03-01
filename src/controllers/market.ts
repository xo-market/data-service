import { query } from "../utils/postgresDB";
/**
 * @route GET /market/all
 * @description Returns list of Market with filter.
 * @param {string} category - category name like "poltics", "election", etc [case-insensitive]
 * @param {string} type - type of market public or private [case-insensitive]
 * @param {string} tags - tags name like "fun", "crypto", etc [case-insensitive]
 * @param {string} search - search any market based on match for name or description [case-insensitive]
 * @param {string} limit - limit the number of markets to return
 * @param {string} sort_order - either ASC or DESC
 * @param {string} sort_by - sort by any of the following fields: starts_at, expires_at, collateral_token, outcome_count, name, description, image, category, type, tags, rules, external_url, animation_url, background_color, txn_hash
 * @returns {Object} JSON response containing list of Market.
 */

export const getAllMarkets = async (req: any, res: any) => {
    try {
        const {
            category,
            type,
            tags,
            creator,
            search,
            limit = 10,
            offset = 0,
            sortBy = 'starts_at',
            sort_order = 'DESC'
        } = req.query;

        let queryString = `SELECT * FROM market`;
        const queryParams: any[] = [];
        let conditions: string[] = [];

        // Add filter conditions
        if (category) {
            conditions.push(`LOWER(category) = LOWER($${queryParams.length + 1})`);
            queryParams.push(category);
        }

        if (type) {
            conditions.push(`LOWER(type) = LOWER($${queryParams.length + 1})`);
            queryParams.push(type);
        }

        if (tags) {
            // Handle array of tags or single tag
            const tagArray = Array.isArray(tags) ? tags : [tags];
            // Convert input tags to lowercase
            const lowerTagArray = tagArray.map(tag => tag.toLowerCase());

            // For PostgreSQL arrays, use the ANY operator with array_lower to compare case-insensitively
            conditions.push(`
                EXISTS (
                    SELECT 1 FROM (
                        SELECT unnest(tags) as tag
                    ) t 
                    WHERE LOWER(t.tag) = ANY($${queryParams.length + 1})
                )
            `);
            queryParams.push(lowerTagArray);
        }

        if (creator) {
            conditions.push(`LOWER(creator) = LOWER($${queryParams.length + 1})`);
            queryParams.push(creator);
        }

        // Text search for name or description
        if (search) {
            conditions.push(`(LOWER(name) LIKE LOWER($${queryParams.length + 1}) OR LOWER(description) LIKE LOWER($${queryParams.length + 1}))`);
            queryParams.push(`%${search}%`);
        }

        // Add WHERE clause if there are conditions
        if (conditions.length > 0) {
            queryString += ` WHERE ${conditions.join(' AND ')}`;
        }

        // Convert camelCase sortBy parameter to snake_case for database
        const sortByColumn = sortBy.replace(/([A-Z])/g, '_$1').toLowerCase();

        // Add sorting
        queryString += ` ORDER BY ${sortByColumn} ${sort_order}`;

        // Add pagination
        queryString += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        queryParams.push(limit, offset);

        // Get count for pagination
        let countQuery = 'SELECT COUNT(*) as total FROM market';
        if (conditions.length > 0) {
            countQuery += ` WHERE ${conditions.join(' AND ')}`;
        }
        const totalCount = await query(countQuery, queryParams.slice(0, -2));

        // Get filtered markets
        const markets = await query(queryString, queryParams);

        return res.json({
            success: true,
            markets,
            pagination: {
                total: parseInt(totalCount[0].total),
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
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


