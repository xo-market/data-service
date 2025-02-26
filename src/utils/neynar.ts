import "dotenv/config";
import fetch from "node-fetch";

const NEYNAR_API_KEY = process.env.NEYNAR_API || "";

export async function getFarcasterPost(url: string): Promise<any> {
    try {
        const apiUrl = `https://api.neynar.com/v2/farcaster/cast?identifier=${encodeURIComponent(url)}&type=url`;

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                accept: "application/json",
                "x-api-key": NEYNAR_API_KEY,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        // console.error("Error fetching data:", error);
        throw error;
    }
}

// // Example usage
// const testUrl = "https://warpcast.com/vitalik.eth/0x3751773d";
// getFarcasterPost(testUrl)
//     .then((data) => {
//         console.log("Data:", data)
//         console.log(data.cast.reactions.likes_count);
        
//     })
//     .catch((error) => console.error("Fetch failed:", error));
