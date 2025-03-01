import { fetchFarcasterCast } from "../providers/farcaster";
import { agenda } from "../resolvers/agenda";
import { getFarcasterPost } from "../utils/neynar";
import { pinata } from "../utils/pinata";

/**
 * @route POST /schedule/farcaster
 * @description Schedules a job to resolve the Farcaster market.
 * @param {string} market_id - Market ID.
 * @param {string} cast_url - farcaster (warpcast) cast url.
 * @param {Date} expiry - expiration date of the market.
 * @param {string} settlement_factor - one of the settlement factor :"likes", "recasts", "replies".
 * @param {number} count - count of likes or recasts, or replies required for the market to be valid.
 * @param {number} winning_outcome - winning outcome of the market.
 * @returns {Object} JSON response with success boolean and message.
 */
export const scheduleFarcasterMarket = async (req: any, res: any) => {
    try {
        const { market_id, cast_url, expiry, settlement_factor, count, winning_outcome } = req.body;

        if (!market_id || !cast_url || !expiry || !settlement_factor || !count || !winning_outcome) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const cast_response = await getFarcasterPost(cast_url);
        if (!cast_response) {
            return res.status(400).json({ success: false, error: "Invalid cast hash" });
        }
        const cast_likes = cast_response.cast.reactions.likes_count;
        const cast_recasts = cast_response.cast.reactions.recasts_count;
        const cast_replies = cast_response.cast.replies.count;
        const cast_hash = cast_response.cast.hash;
        let expiration_date = new Date(expiry);
        if (expiration_date <= new Date()) {
            return res.status(400).json({ success: false, error: "Expiration date has passed" });
        }

        switch (settlement_factor) {
            case "likes":
                if (cast_likes >= count) {
                    return res.status(400).json({ success: false, message: `Cast already has ${count} or more likes.` });
                }
                await agenda.schedule(expiration_date, 'resolveFarcasterLikes', { market_id, cast_hash, count, winning_outcome });
                break;
            case "recasts":
                if (cast_recasts >= count) {
                    return res.status(400).json({ success: false, message: `Cast already has ${count} or more recasts.` });
                }
                await agenda.schedule(expiration_date, 'resolveFarcasterRecasts', { market_id, cast_hash, count, winning_outcome });
                break;
            case "replies":
                if (cast_replies >= count) {
                    return res.status(400).json({ success: false, message: `Cast already has ${count} or more replies.` });
                }
                await agenda.schedule(expiration_date, 'resolveFarcasterReplies', { market_id, cast_hash, count, winning_outcome });
                break;
            default:
                return res.status(400).json({ success: false, error: "Invalid settlement factor" });
        }

        return res.json({
            success: true,
            message: "Market Resolver Scheduled",
        });

    } catch (error: any) {
        console.error("Error validating Farcster Market:", error);
        return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
}

/**
 * @route POST /validate/farcaster
 * @description Accepts NFT metadata, uploads it to Pinata (IPFS), and returns an IPFS hash.
 * @param {string} cast_url - farcaster (warpcast) cast url.
 * @param {string} settlement_factor - one of the settlement factor :"likes", "recasts", "replies".
 * @param {number} count - count of likes or recasts, or replies required for the market to be valid.
 * @returns {Object} JSON response with success boolean and message.
 */
export const validateFarcasterMarket = async (req: any, res: any) => {
    try {
        const { cast_url, settlement_factor, count } = req.body;

        if (!cast_url || !settlement_factor || !count) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const cast_response = await getFarcasterPost(cast_url);
        if (!cast_response) {
            return res.status(400).json({ success: false, error: "Invalid cast hash" });
        }

        switch (settlement_factor) {
            case "likes":
                if (cast_response.cast.reactions.likes_count >= count) {
                    return res.status(400).json({ success: false, message: `Cast already has ${count} or more likes.` });
                }
                break;
            case "recasts":
                if (cast_response.cast.reactions.recasts_count >= count) {
                    return res.status(400).json({ success: false, message: `Cast already has ${count} or more recasts.` });
                }
                break;
            case "replies":
                if (cast_response.cast.replies.count >= count) {
                    return res.status(400).json({ success: false, message: `Cast already has ${count} or more replies.` });
                }
                break;
            default:
                return res.status(400).json({ success: false, error: "Invalid settlement factor" });
        }

        return res.json({
            success: true,
            message: "Valid Market",
        });

    } catch (error: any) {
        console.error("Error validating Farcaster Market:", error);
        return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
}

/**
 * @route POST /create/farcaster
 * @description Accepts Market metadata, uploads it to Pinata (IPFS), and returns an IPFS hash.
 * @param {string} name - The name of the Market.
 * @param {string} description - The description of the Market.
 * @param {string} image - The Image URL of the Market.
 * @param {Array} attributes - An array of Market attributes.
 * @param {string} external_url - External link related to the Market.
 * @param {string} animation_url - URL to an animation (if applicable).
 * @param {string} background_color - Background color for display.
 * @returns {Object} JSON response with success boolean, IPFS hash and metadata details.
 */
export const createFarcasterMarket = async (req: any, res: any) => {
    try {
        const { name, description, image, attributes, external_url, animation_url, background_color } = req.body;

        // Helper function for validation
        const isValidString = (value: any) => typeof value === "string" && value.trim() !== "";
        const isValidArray = (value: any) => Array.isArray(value) && value.length > 0;

        // Check required fields
        if (
            !isValidString(name) ||
            !isValidString(description) ||
            !isValidString(image) ||
            !isValidArray(attributes) ||
            !isValidString(external_url) ||
            !isValidString(animation_url) ||
            !isValidString(background_color)
        ) {
            return res.status(400).json({ success: false, error: "Missing or invalid required fields" });
        }

        const metadata = {
            name,
            description,
            image,
            attributes,
            external_url,
            animation_url,
            background_color,
        };

        // Convert metadata to a JSON file
        const metadata_string = JSON.stringify(metadata, null, 2);
        const blob = new Blob([metadata_string], { type: "application/json" });
        const file = new File([blob], "metadata.json", { type: "application/json" });

        // Upload to Pinata
        const upload_result = await pinata.upload.file(file);

        if (!upload_result || !upload_result.IpfsHash) {
            return res.status(400).json({ success: false, error: "Failed to upload metadata to IPFS" });
        }

        return res.json({
            success: true,
            ipfs_hash: upload_result.IpfsHash,
            timestamp: upload_result.Timestamp,
        });

    } catch (error: any) {
        console.error("Error Creating Farcaster Market:", error);
        return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
}


/**
* @route GET /farcaster/cast
* @description Returns Farcaster cast detail.
* @param {string} cast_url - Farcaster cast_url.
* @returns {Object} JSON cast detail.
*/
export const getfarcasterCastDetail = async (req: any, res: any) => {
    try {
        const { cast_url } = req.query;
        if (!cast_url) {
            return res.status(400).json({ success: false, error: "Missing cast_url" });
        }
        let cast_deatail = await getFarcasterPost(cast_url);
        if (!cast_deatail) {
            return res.status(400).json({ success: false, error: "Invalid cast hash" });
        }
        return res.json({ success: true, cast: cast_deatail.cast });
    } catch (error: any) {
        console.error("Error Fetching Market Prices:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}