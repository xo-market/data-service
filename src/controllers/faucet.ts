import { mintCollateralTokens } from "../utils/contracts";

/**
 * @route POST /faucet/token
 * @description get some collateral tokens minted to given address.
 * @param {file} recipient - file to upload.
 * @returns {Object} JSON response with success boolean, txns_hash .
 */
export const claimCollateralTokenFaucet = async (req: any, res: any) => {
    try {

        const { recipient } = req.body;
        if (!recipient) {
            return res.status(400).json({ success: false, error: 'No recipient address provided' });
        }
        const amount = "100"; // Amount to mint (base amount)
        const mint_txn = await mintCollateralTokens(recipient, amount);
        if (!mint_txn.success) {
            return res.status(400).json({ success: false, error: mint_txn.message });
        }
        return res.json({
            success: true,
            txn_hash: mint_txn.txn_hash

        });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            error: 'Error uploading to IPFS',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
