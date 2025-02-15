import { Router, Request, Response } from "express";
import { PinataSDK } from "pinata-web3";
import { fetchFarcasterCast } from "../providers/farcaster";
import { agenda } from "../resolvers/agenda";
import { upload } from "../fileUpload";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL,
});

const router = Router();


/**
 * @route POST /schedule/farcaster
 * @description Schedules a job to resolve the Farcaster market.
 * @param {string} market_id - Market ID.
 * @param {string} cast_hash - farcaster cast hash.
 * @param {Date} expiry - expiration date of the market.
 * @param {string} settlement_factor - one of the settlement factor :"likes", "recasts", "replies".
 * @param {number} count - count of likes or recasts, or replies required for the market to be valid.
 * @returns {Object} JSON response with success boolean and message.
 */
router.post("/schedule/farcaster", async (req: any, res: any) => {
  try {
    const { market_id, cast_hash, expiry, settlement_factor, count } = req.body;

    if (!market_id || !cast_hash || !expiry || !settlement_factor || !count) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const cast_response = await fetchFarcasterCast(cast_hash);
    if (!cast_response) {
      return res.status(400).json({ success: false, error: "Invalid cast hash" });
    }
    let expiration_date = new Date(expiry);
    if (expiration_date <= new Date()) {
      return res.status(400).json({ success: false, error: "Expiration date has passed" });
    }

    switch (settlement_factor) {
      case "likes":
        if (cast_response.likes_count >= count) {
          return res.status(400).json({ success: false, message: `Cast already has ${count} or more likes.` });
        }
        await agenda.schedule(expiration_date, 'resolveFarcasterLikes', { market_id, cast_hash });
        break;
      case "recasts":
        if (cast_response.recasts_count >= count) {
          return res.status(400).json({ success: false, message: `Cast already has ${count} or more recasts.` });
        }
        await agenda.schedule(expiration_date, 'resolveFarcasterRecasts', { market_id, cast_hash });
        break;
      case "replies":
        if (cast_response.replies >= count) {
          return res.status(400).json({ success: false, message: `Cast already has ${count} or more replies.` });
        }
        await agenda.schedule(expiration_date, 'resolveFarcasterReplies', { market_id, cast_hash });
        break;
      default:
        return res.status(400).json({ success: false, error: "Invalid settlement factor" });
    }



    return res.json({
      success: true,
      message: "Market Resolver Scheduled",
    });

  } catch (error: any) {
    console.error("Error validating Market(Farcaster):", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});


/**
 * @route POST /validate/farcaster
 * @description Accepts NFT metadata, uploads it to Pinata (IPFS), and returns an IPFS hash.
 * @param {string} cast_hash - farcaster cast hash.
 * @param {string} settlement_factor - one of the settlement factor :"likes", "recasts", "replies".
 * @param {number} count - count of likes or recasts, or replies required for the market to be valid.
 * @returns {Object} JSON response with success boolean and message.
 */
router.post("/validate/farcaster", async (req: any, res: any) => {
  try {
    const { cast_hash, settlement_factor, count } = req.body;

    if (!cast_hash || !settlement_factor || !count) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const cast_response = await fetchFarcasterCast(cast_hash);
    if (!cast_response) {
      return res.status(400).json({ success: false, error: "Invalid cast hash" });
    }


    switch (settlement_factor) {
      case "likes":
        if (cast_response.likes_count >= count) {
          return res.status(400).json({ success: false, message: `Cast already has ${count} or more likes.` });
        }
        break;
      case "recasts":
        if (cast_response.recasts_count >= count) {
          return res.status(400).json({ success: false, message: `Cast already has ${count} or more recasts.` });
        }
        break;
      case "replies":
        if (cast_response.replies >= count) {
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
    console.error("Error validating Market(Farcaster):", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});


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
router.post("/create/farcaster", async (req: any, res: any) => {
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
    console.error("Error uploading NFT metadata:", error);
    return res.status(500).json({ success: false, error: error.message || "Internal server error" });
  }
});


/**
 * @route POST /upload
 * @description Upload image to ipfs and return the image link.
 * @param {file} file - file to upload.
 * @returns {Object} JSON response with success boolean, image link .
 */
router.post("/upload", upload, async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const file = new File(
      [req.file.buffer],
      req.file.originalname,
      { type: req.file.mimetype }
    );

    const upload_result = await pinata.upload.file(file);

    return res.json({
      success: true,
      image_link: `https://gateway.pinata.cloud/ipfs/${upload_result.IpfsHash}`

    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      error: 'Error uploading to IPFS',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
})

/**
 * @route GET /ipfs/:hash
 * @description Retrieves Market metadata from Pinata using the provided IPFS hash.
 * @param {string} hash - Express request object containing the IPFS hash as a URL parameter.
 * @returns {Object} JSON response containing Market metadata.
 */

router.get("/:hash", async (req: any, res: any) => {
  try {
    const { hash } = req.params;
    const file_response = await pinata.gateways.get(hash);

    // fileResponse.data may be a string or object
    const data =
      typeof file_response.data === "string"
        ? JSON.parse(file_response.data)
        : file_response.data;

    return res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error retrieving NFT metadata:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
