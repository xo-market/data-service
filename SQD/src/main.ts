import "dotenv/config"
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { TypeormDatabase } from '@subsquid/typeorm-store'
import * as marketAbi from './abi/market'
import { Market, MarketPrice } from './model'

const MARKET_CONTRACT_ADDRESS =process.env.MARKET_CONTRACT || ""

const processor = new EvmBatchProcessor()
  .setRpcEndpoint(process.env.RPC_URL)
  .setFinalityConfirmation(5)
  .addLog({
    range: { from: 1989045 },
    address: [MARKET_CONTRACT_ADDRESS],
    topic0: [marketAbi.events.MarketCreated.topic,marketAbi.events.MarketPriceChanged.topic],
  })
  .setFields({
    log: {
      transactionHash: true,
    },
  })

const db = new TypeormDatabase({ supportHotBlocks: true })

processor.run(db, async (ctx) => {
  let markets: Market[] = []
  let marketPrices: MarketPrice[] = []

  for (let block of ctx.blocks) {
    ctx.log.info(block.logs)
    for (let log of block.logs) {
      ctx.log.info(log.address)

      if (log.address === MARKET_CONTRACT_ADDRESS.toLowerCase() &&
        log.topics[0] === marketAbi.events.MarketCreated.topic) {
        let { marketId, creator, startsAt, expiresAt, collateralToken, outcomeCount, metaDataURI } = marketAbi.events.MarketCreated.decode(log)
        markets.push(new Market({
          id: log.id,
          marketId: marketId.toString(),
          creator,
          startsAt: startsAt.toString(),
          expiresAt: expiresAt.toString(),
          collateralToken,
          outcomeCount,
          metaDataURI,
          txnHash: log.transactionHash
        }))
      }

      if (log.address === MARKET_CONTRACT_ADDRESS.toLowerCase() &&
        log.topics[0] === marketAbi.events.MarketPriceChanged.topic) {
        let { marketId, outcomePrices } = marketAbi.events.MarketPriceChanged.decode(log)

        marketPrices.push(new MarketPrice({
          id: log.id,
          marketId: marketId.toString(),
          outcomePrices: outcomePrices.map(price => price.toString()),
          txnHash: log.transactionHash
        }))

      }
    }
  }
  await ctx.store.insert(markets)
  await ctx.store.insert(marketPrices)
})
