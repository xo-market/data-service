import { ethers } from "ethers";
import "dotenv/config";
import MarketABI from "../utils/MarketABI.json";

const RPC_URL = process.env.RPC_URL;
const MARKET_CONTRACT = process.env.MARKET_CONTRACT;
const RESOLVER_PRIVATE_KEY = process.env.RESOLVER_PRIVATE_KEY;

export async function resolveMarketTxn(marketId: number, winningOutcome: number): Promise<{ success: boolean; message: string; txHash?: string }> {
    try {

        if (!RPC_URL || !MARKET_CONTRACT || !RESOLVER_PRIVATE_KEY) {
            return { success: false, message: "Missing environment variables: RPC_URL, MARKET_CONTRACT, or RESOLVER_PRIVATE_KEY" };
        }

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const signer = new ethers.Wallet(RESOLVER_PRIVATE_KEY, provider);
        const contract = new ethers.Contract(MARKET_CONTRACT, MarketABI, signer);

        const tx = await contract.resolveMarket(marketId, winningOutcome);
        const receipt = await tx.wait();

        return { success: true, message: "Transaction successful", txHash: receipt.transactionHash };

    } catch (error: any) {
        return { success: false, message: error.message || "Unknown error occurred" };
    }
}
