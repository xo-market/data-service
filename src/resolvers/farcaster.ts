import { agenda } from './agenda';

interface ResolveFarcasterMarket {
    cast_hash: string;
    market_id: string;
}

agenda.define('resolveFarcasterLikes', async (job) => {
    // TODO
    const { cast_hash, market_id } = job.attrs.data as ResolveFarcasterMarket;
    console.log(`Resolve Market : ${market_id} for the cast ${cast_hash} has enough likes`);
});

agenda.define('resolveFarcasterRecasts', async (job) => {
    //TODO
    const { cast_hash, market_id } = job.attrs.data as ResolveFarcasterMarket;
    console.log(`Resolve Market : ${market_id} for the cast ${cast_hash} has enough replies`);
});

agenda.define('resolveFarcasterReplies', async (job) => {
    //TODO
    const { cast_hash, market_id } = job.attrs.data as ResolveFarcasterMarket;
    console.log(`Resolve Market : ${market_id} for the cast ${cast_hash} has enough recasts`);
});
