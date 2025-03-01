import { mintCollateralTokens, transferNativeToken } from "../utils/contracts";
import { ethers } from "ethers";
import "dotenv/config";


const RPC_URL = process.env.RPC_URL;
const COLLATERAL_TOKEN = process.env.COLLATERAL_TOKEN;
const RESOLVER_PRIVATE_KEY = process.env.RESOLVER_PRIVATE_KEY;

/**
 * @route POST /faucet/token
 * @description get some collateral tokens minted to given address.
 * @param {file} recipient - file to upload.
 * @returns {Object} JSON response with success boolean, txns_hash .
 */
export const claimCollateralTokenFaucet = async (req: any, res: any) => {
    try {
        if (!RPC_URL || !COLLATERAL_TOKEN || !RESOLVER_PRIVATE_KEY) {
            return {
              success: false,
              message:
                "Missing environment variables: RPC_URL, COLLATERAL_TOKEN, or RESOLVER_PRIVATE_KEY",
            };
          }
        const { recipient } = req.body;
        if (!recipient) {
            return res.status(400).json({ success: false, error: 'No recipient address provided' });
        }

        const collateral_amount = "100"; // Amount of collateral tokens to mint
        const native_token_amount = "0.1"; // Amount of native tokens to transfer

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const signer = new ethers.Wallet(RESOLVER_PRIVATE_KEY, provider);

        // Get current nonce
        const nonce = await provider.getTransactionCount(signer.address, "latest");

        // Prepare transactions with nonce management
        const nativeTxPromise = transferNativeToken(recipient, native_token_amount, signer, nonce);
        const mintTxPromise = mintCollateralTokens(recipient, collateral_amount, signer, nonce + 1);

        // Execute both transactions concurrently
        const [transfer_txn, mint_txn] = await Promise.all([nativeTxPromise, mintTxPromise]);

        // Check if either transaction failed
        if (!transfer_txn.success || !mint_txn.success) {
            return res.status(400).json({
                success: false,
                error: transfer_txn.success ? mint_txn.message : transfer_txn.message,
            });
        }

        return res.json({
            success: true,
            native_txn_hash: transfer_txn.transactionHash,
            collateral_txn_hash: mint_txn.txn_hash
        });

    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
