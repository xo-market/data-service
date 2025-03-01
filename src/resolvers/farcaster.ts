import { fetchFarcasterCast } from '../providers/farcaster';
import { resolveMarketTxn } from '../utils/contracts';
import { agenda } from './agenda';

interface ResolveFarcasterMarket {
    cast_hash: string;
    market_id: string;
    count: number;
    winning_outcome: number;
}

agenda.define('resolveFarcasterLikes', async (job) => {
    const { cast_hash, market_id, count, winning_outcome } = job.attrs.data as ResolveFarcasterMarket;

    const post_data = await fetchFarcasterCast(cast_hash);
    if (!post_data) {
        console.log(`Cannot fetch cast data for: ${cast_hash} cast`);
        return;
    }
    if (post_data.likes_count < count) {
        console.log(`Market ${market_id} Does not meet the condition post likes :${post_data.likes_count} >= ${count} for cast ${cast_hash}`);
        return;
    }
    let resolve_market = await resolveMarketTxn(Number(market_id), Number(winning_outcome));
    if (!resolve_market.success) {
        console.log(`Transaction Failed to Resolve Market : ${market_id} for the cast ${cast_hash} due to ${resolve_market.message}`);
        return;
    }
    console.log(`Market Resolved Successfully : ${market_id} for the cast ${cast_hash}`);
});

agenda.define('resolveFarcasterRecasts', async (job) => {
    const { cast_hash, market_id, count, winning_outcome } = job.attrs.data as ResolveFarcasterMarket;
    const post_data = await fetchFarcasterCast(cast_hash);
    if (!post_data) {
        console.log(`Cannot fetch cast data for: ${cast_hash} cast`);
        return;
    }
    if (post_data.recasts_count < count) {
        console.log(`Market ${market_id} Does not meet the condition post recasts_count :${post_data.recasts_count} >= ${count} for cast ${cast_hash}`);
        return;
    }
    let resolve_market = await resolveMarketTxn(Number(market_id), Number(winning_outcome));
    if (!resolve_market.success) {
        console.log(`Transaction Failed to Resolve Market : ${market_id} for the cast ${cast_hash} due to ${resolve_market.message}`);
        return;
    }
    console.log(`Market Resolved Successfully : ${market_id} for the cast ${cast_hash}`);
});

agenda.define('resolveFarcasterReplies', async (job) => {
    const { cast_hash, market_id, count, winning_outcome } = job.attrs.data as ResolveFarcasterMarket;
    const post_data = await fetchFarcasterCast(cast_hash);
    if (!post_data) {
        console.log(`Cannot fetch cast data for: ${cast_hash} cast`);
        return;
    }
    if (post_data.replies < count) {
        console.log(`Market ${market_id} Does not meet the condition post replies :${post_data.recasts_count} >= ${count} for cast ${cast_hash}`);
        return;
    }
    let resolve_market = await resolveMarketTxn(Number(market_id), Number(winning_outcome));
    if (!resolve_market.success) {
        console.log(`Transaction Failed to Resolve Market : ${market_id} for the cast ${cast_hash} due to ${resolve_market.message}`);
        return;
    }
    console.log(`Market Resolved Successfully : ${market_id} for the cast ${cast_hash}`);
});
