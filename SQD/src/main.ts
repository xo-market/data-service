import "dotenv/config"
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { TypeormDatabase } from '@subsquid/typeorm-store'
import * as marketAbi from './abi/market'
import { Market, MarketPrice, UserActivity, UserMarketData } from './model'
import { extractMarketMetaData, MarketMetaData } from "./utils"
import { randomUUID } from "crypto"

const MARKET_CONTRACT_ADDRESS = process.env.MARKET_CONTRACT || ""

const processor = new EvmBatchProcessor()
  .setRpcEndpoint(process.env.RPC_URL)
  .setFinalityConfirmation(5)
  .addLog({
    range: { from: 2429963 },
    address: [MARKET_CONTRACT_ADDRESS],
    topic0: [marketAbi.events.MarketCreated.topic, marketAbi.events.MarketPriceChanged.topic, marketAbi.events.MarketResolved.topic, marketAbi.events.OutcomeTokensBought.topic, marketAbi.events.OutcomeTokensSold.topic, marketAbi.events.CollateralRedeemed.topic],
  })
  .setFields({
    log: {
      transactionHash: true,
    },
  })

const db = new TypeormDatabase({ supportHotBlocks: true })

processor.run(db, async (ctx) => {


  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      console.log(log.topics);
      if (log.address !== MARKET_CONTRACT_ADDRESS.toLowerCase()) {
        return
      }
      if (log.topics[0] === marketAbi.events.MarketCreated.topic) {
        let { marketId, creator, startsAt, expiresAt, collateralToken, outcomeCount, metaDataURI } = marketAbi.events.MarketCreated.decode(log)
        let meta_data: MarketMetaData | null = await extractMarketMetaData(metaDataURI)
        if (!meta_data) {
          console.log("Invalid meta data")
          return
        }
        await ctx.store.insert(new Market({
          id: randomUUID(),
          marketId: marketId.toString(),
          creator,
          startsAt: startsAt.toString(),
          expiresAt: expiresAt.toString(),
          collateralToken,
          outcomeCount,
          metaDataURI,
          name: meta_data.name,
          description: meta_data.description,
          image: meta_data.image,
          category: meta_data.category,
          type: meta_data.type,
          tags: meta_data.tags,
          rules: meta_data.rules,
          externalURL: meta_data.external_url,
          animationURL: meta_data.animation_url,
          backgroundColor: meta_data.background_color,
          txnHash: log.transactionHash
        }))
        await ctx.store.insert(new UserActivity({
          id: randomUUID(),
          userAddress: creator,
          marketId: marketId.toString(),
          outcome: undefined,
          quantity: undefined,
          totalAmount: undefined,
          action: "create-market",
          txnHash: log.transactionHash,
          timestamp: block.header.timestamp
        }))
        for(let i=0;i<outcomeCount;i++){
          await ctx.store.insert(new UserMarketData({
            id: randomUUID(),
            userAddress: creator,
            marketId: marketId.toString(),
            isRedeemed: false,
            isClaimable: false,
            isExpired: false,
            outcome: i,
            winingOutcome: undefined,
            quantity: BigInt(0), // fetch the quantity from the contract
          }))
        }
       
      }

      if (log.topics[0] === marketAbi.events.MarketPriceChanged.topic) {
        let { marketId, outcomePrices } = marketAbi.events.MarketPriceChanged.decode(log)

        await ctx.store.insert(new MarketPrice({
          id: randomUUID(),
          marketId: marketId.toString(),
          outcomePrices: outcomePrices.map(price => price.toString()),
          txnHash: log.transactionHash,
          timestamp: block.header.timestamp
        }))
      }

      if (log.topics[0] === marketAbi.events.OutcomeTokensBought.topic) {
        let { marketId, buyer, outcome, amount, cost } = marketAbi.events.OutcomeTokensBought.decode(log)
        await ctx.store.insert(new UserActivity({
          id: randomUUID(),
          userAddress: buyer,
          marketId: marketId.toString(),
          outcome: outcome,
          quantity: amount,
          totalAmount: cost,
          action: "buy",
          txnHash: log.transactionHash,
          timestamp: block.header.timestamp
        }))
        let userMarketData = await ctx.store.findOne(UserMarketData, {
          where: {
            userAddress: buyer,
            marketId: marketId.toString(),
            outcome: outcome,
          }
        });
        if (userMarketData) {
          userMarketData.quantity = userMarketData.quantity + amount;
          await ctx.store.save(userMarketData);
        }
      }

      if (log.topics[0] === marketAbi.events.OutcomeTokensSold.topic) {
        let { marketId, seller, outcome, amount, received } = marketAbi.events.OutcomeTokensSold.decode(log)
        await ctx.store.insert(new UserActivity({
          id: randomUUID(),
          userAddress: seller,
          marketId: marketId.toString(),
          outcome: outcome,
          quantity: amount,
          totalAmount: received,
          action: "sell",
          txnHash: log.transactionHash,
          timestamp: block.header.timestamp
        }))
        let userMarketData = await ctx.store.findOne(UserMarketData, {
          where: {
            userAddress: seller,
            marketId: marketId.toString(),
            outcome: outcome,
          }
        });
        if (userMarketData) {
          userMarketData.quantity = userMarketData.quantity - amount;
          await ctx.store.save(userMarketData);
        }
      }

      if (log.topics[0] === marketAbi.events.MarketResolved.topic) {
        let { marketId, resolver, winningTokenId } = marketAbi.events.MarketResolved.decode(log)
        let allUserMarketData = await ctx.store.find(UserMarketData, {
          where: {
            marketId: marketId.toString(),
          }
        });

        for (let record of allUserMarketData) {
          record.isExpired = true;
          record.winingOutcome = Number(winningTokenId);
          if (record.outcome === Number(winningTokenId)) {
            record.isClaimable = true;
          }
        }
        await ctx.store.save(allUserMarketData);

      }

      if (log.topics[0] === marketAbi.events.CollateralRedeemed.topic) {
        let { marketId, redeemer, amount } = marketAbi.events.CollateralRedeemed.decode(log)
        let newActivities: UserActivity[] = []
        let redeemedTransactions = await ctx.store.find(UserMarketData, {
          where: {
            marketId: marketId.toString(),
            userAddress: redeemer,
          }
        });

        for (let record of redeemedTransactions) {
          if (record.winingOutcome === record.outcome) {
            record.isRedeemed = true;
            newActivities.push(new UserActivity({
              id: randomUUID(),
              userAddress: redeemer,
              marketId: marketId.toString(),
              outcome: record.outcome,
              quantity: record.quantity,
              totalAmount: undefined,
              action: "redeem",
              txnHash: log.transactionHash,
              timestamp: block.header.timestamp
            }))
          }
        }
        await ctx.store.save(redeemedTransactions);
        await ctx.store.insert(newActivities);
      }

    }
  }

})
