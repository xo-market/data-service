import { Router, Request, Response } from "express";
import { PinataSDK } from "pinata-web3";

// Create Pinata instance
// The environment variables are loaded from .env (in local dev) or set in production
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL,
});

// Define router
const router = Router();

/**
 * POST /nft
 * Accept NFT metadata, pin to Pinata (IPFS), return IPFS hash.
 */
router.post("/", async (req: any, res: any) => {
  try {
    const nftMetadata = req.body;

    // Convert JSON metadata to a Blob, then to a File for upload
    const metadataString = JSON.stringify(nftMetadata, null, 2);
    const blob = new Blob([metadataString], { type: "application/json" });
    const file = new File([blob], "metadata.json", { type: "application/json" });

    const uploadResult = await pinata.upload.file(file);

    return res.json({
      success: true,
      ipfsHash: uploadResult.IpfsHash,
      pinSize: uploadResult.PinSize,
      timestamp: uploadResult.Timestamp,
    });
  } catch (error: any) {
    console.error("Error uploading NFT metadata:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /nft/:hash
 * Retrieve metadata from Pinata by IPFS hash and return.
 */
router.get("/:hash", async (req: any, res: any) => {
  try {
    const { hash } = req.params;
    const fileResponse = await pinata.gateways.get(hash);

    // fileResponse.data may be a string or object
    const data =
      typeof fileResponse.data === "string"
        ? JSON.parse(fileResponse.data)
        : fileResponse.data;

    return res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error retrieving NFT metadata:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
