import { agenda } from './agenda';

interface VerifyFarcasterLikesData {
    cast_hash: string;
    market_id: string;
}

agenda.define('verifyFarcasterLikes', async (job) => {
    const { cast_hash, market_id } = job.attrs.data as VerifyFarcasterLikesData;
    // dummy delay to simulate likes verification
    await new Promise(res => setTimeout(res, 2000));
    console.log(`Verified that cast ${cast_hash} has enough liked for market: "${market_id}"`);
});
