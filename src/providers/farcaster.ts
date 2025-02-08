import "dotenv/config";

interface CastData {
    hash: string;
    timestamp: string;
    text: string;
    likes_count: number;
    recasts_count: number;
    replies: number;
    embeds: any[];
}

export async function fetchFarcasterCast(hash: string): Promise<CastData | null> {
    const token = process.env.PINATA_JWT;
    if (!token) {
        throw new Error('Missing PINATA_JWT in environment variables');
    }

    const url = `https://api.pinata.cloud/v3/farcaster/casts/${hash}`;
    const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.cast) {
            throw new Error('Invalid response structure');
        }

        const {
            hash,
            timestamp,
            text,
            reactions: { likes_count, recasts_count },
            replies: { count: replies },
            embeds,
        } = data.cast;

        return { hash, timestamp, text, likes_count, recasts_count, replies, embeds };
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

// // Usage example:
// fetchFarcasterCast("0x3751773da82bb9521cf9d6f57d340d0de9fd1b67")
//     .then(response => console.log(response))
//     .catch(error => console.error('Error fetching cast:', error));

