const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "Create a Prediction Market Title and Rules\nYou are provided with a piece of text (which may be a tweet, post, news excerpt, etc.).\nYour task is to determine whether the text implies a verifiable, mutually exclusive event that can serve as the basis for a prediction market.\nIf it does, generate a concise prediction market title along with clear, well-defined rules for determining the outcomes.\nIf the text does not yield a valid prediction market (e.g., it is subjective or non-verifiable),\nrespond with 'No valid prediction market can be derived from the input\n\nNote: \n- all the prediction market must be mutually exclusive\n- for dependency on external data or sites consider top google ranked sites that are valid and working\n \nhere are some examples\n\nexample 1:\n\n<user>: \"Bitcoin to will go down this year\"\n<model>: {\n    \"valid_market\": true,\n    \"title\": \"Bitcoin hits $100K by Dec 31, 2025\",\n    \"rules\": \"\n        - This market will resolve to \"Yes\" if the bitcoin price will reach to $100,000 or more on Dec 31, 2025, 11:59 PM UTC. Otherwise, this market will resolve to \"No\".\n        - The resolution source for this market is Binance, specifically the BTCUSDT currently available at https://www.binance.com/en/trade/BTC_USDT.\n        - Please note that this market is about the price according to Binance BTCUSDT, not according to other sources or spot markets.\n    \",\n    \"resolution_source\": \"Binance, specifically the BTCUSDT currently available at https://www.binance.com/en/trade/BTC_USDT.\",\n}\n\nexample 2:\n\n<user>: \"seems like trump is ging to for a big action on his 11 day?\n<model>:{\n    \"valid_market\": true,\n    \"title\": \"US Presidential election: Republican win?\",\n    \"rules\":\"\n        - This market will resolve \"Yes\" of Donald Trump issues and signs an executive order on January 30, 2025. Otherwise, this market will resolve to \"No\".\n        - Executive actions will not qualify toward this market’s resolution.\n        - The resolution source for this market will be information from the US federal government (e.g. https://www.whitehouse.gov/, https://www.federalregister.gov/presidential-documents/executive-orders). Only executive orders with issuance dates of January 30, 2025 will count for this market.\n\"\n    \"resolution_source\": \"US federal government site (e.g. https://www.whitehouse.gov/, https://www.federalregister.gov/presidential-documents/executive-orders). Only executive orders with issuance dates of January 30, 2025 will count for this market.\",\n}\n\nexample 3:\n\n<user>: \"I think the US is going to go to war with China\"\n<model>:{\n    \"valid_market\": true,\n    \"title\": \"US-China War?\",\n    \"rules\":\"\n        - This market will resolve \"Yes\" if the US and China are at war. Otherwise, this market will resolve to \"No\".\n        - The resolution source for this market will be information from the CNN official site (https://cnn.com/) . Only wars between the US and China will count for this market.\n\",\n    \"resolution_source\": \"CNN official site (https://cnn.com/) .\n\n}\n\nexample 4:\n\n<user>: \"sky has blue color that i like it\"\n<model>:{\n    \"valid_market\": false,\n    \"title\": \"This is not a valid prediction market\",\n}\n\n\n\n ",
  });
  
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

interface MarketData {
    valid_market: boolean;
    title: string;
    resolution_source: string;
    rules: string[];
}

export async function getMarket(prompt_text: string): Promise<MarketData | undefined> {
    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chatSession.sendMessage(prompt_text);
    const markdownString = result.response.text();
    console.log(markdownString);
    
    const cleanedString = markdownString.replace(/```json\s*|\s*```/g, '').trim();
    let parsedJSON;
    try {
        parsedJSON = JSON.parse(cleanedString);
        // console.log("Parsed JSON:", parsedJSON);
    } catch (error) {
        // console.error("Error parsing JSON:", error);
    }
    return  parsedJSON
}

// getMarket("< user text>");