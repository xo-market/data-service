import { ethers } from "ethers";
import "dotenv/config";
import MarketABI from "../utils/MarketABI.json";

const RPC_URL = process.env.RPC_URL;
const MARKET_CONTRACT = process.env.MARKET_CONTRACT;
const COLLATERAL_TOKEN = process.env.COLLATERAL_TOKEN;
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

export async function mintCollateralTokens(
  recipient: string,
  amount: string,
  signer: ethers.Wallet,
  nonce: number
) {
  try {
    if (!COLLATERAL_TOKEN) {
      return { success: false, message: "Missing environment variables:  COLLATERAL_TOKEN" };
    }
    const abi = ["function mint(address to, uint256 amount) external"];
    const contract = new ethers.Contract(COLLATERAL_TOKEN, abi, signer);

    const decimals = 18; // Adjust if your token has different decimals
    const tokens_to_mint = ethers.parseUnits(amount, decimals);

    const tx = await contract.mint(recipient, tokens_to_mint, { nonce });

    // console.log(`Collateral mint transaction hash: ${tx.hash}`);
    await tx.wait();

    return { success: true, txn_hash: tx.hash };
  } catch (error) {
    console.error("Minting failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}


export async function transferNativeToken(
  recipient: string,
  amount: string,
  signer: ethers.Wallet,
  nonce: number
) {
  try {
    const parsedAmount = ethers.parseEther(amount); // Convert to Wei

    const tx = await signer.sendTransaction({
      to: recipient,
      value: parsedAmount,
      nonce // Manually set nonce
    });

    // console.log(`Transaction sent: ${tx.hash}`);
    await tx.wait();

    return { success: true, transactionHash: tx.hash };
  } catch (error) {
    console.error("Transaction failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
