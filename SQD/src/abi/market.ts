import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AuthorityUpdated: event("0x2f658b440c35314f52658ea8a740e05b284cdc84dc9ae01e891f21b8933e7cad", "AuthorityUpdated(address)", {"authority": p.address}),
    CollateralRedeemed: event("0x6bdc08ebe005c38be702a234af7f14535a719b81061f6893ad85ff62fe925397", "CollateralRedeemed(uint256,address,uint256)", {"marketId": indexed(p.uint256), "redeemer": indexed(p.address), "amount": p.uint256}),
    CollateralTokenAllowed: event("0xef5bafd4fd27c833a4b67248375f7264fb1df78e12b6146634e459dd4811ad40", "CollateralTokenAllowed(address,bool)", {"token": indexed(p.address), "allowed": p.bool}),
    InsuranceAddressSet: event("0xb6e4d225c1c4ffe562f1388af0e16470943bd1688236517eb9bd41373e97c3e3", "InsuranceAddressSet(address)", {"insuranceAddress": indexed(p.address)}),
    MarketCreated: event("0x292b548816e114e209b2507bcd9746ccf2016f8677b7755d74570e9598f75fce", "MarketCreated(uint256,address,uint40,uint40,address,uint8,string)", {"marketId": indexed(p.uint256), "creator": indexed(p.address), "startsAt": p.uint40, "expiresAt": p.uint40, "collateralToken": p.address, "outcomeCount": p.uint8, "metaDataURI": p.string}),
    MarketPriceChanged: event("0xa059f7b995139bca6463ccc673a703e41d03defd1e6ecbac0e0a03761d9f9e5b", "MarketPriceChanged(uint256,uint256[])", {"marketId": indexed(p.uint256), "outcomePrices": p.array(p.uint256)}),
    MarketResolved: event("0xacef513e023ec1abbd3ca7f9f777a61f3806bf0118d30302223ef3a4c9afb284", "MarketResolved(uint256,address,uint256)", {"marketId": indexed(p.uint256), "resolver": indexed(p.address), "winningTokenId": p.uint256}),
    MarketResolverFeeSet: event("0xd3aa86ea0d861d4db7068954a70acb7529fbd109d55dd455bb5f6348ce0c52d8", "MarketResolverFeeSet(address,uint16)", {"resolver": indexed(p.address), "feeBps": p.uint16}),
    MarketResolverSet: event("0xab31742e55ed9f801fdf5008b7dddd0a46837888ab508b0ab5f3a08ae4973725", "MarketResolverSet(address,bool)", {"resolver": indexed(p.address), "isPublicResolver": p.bool}),
    MarketReviewed: event("0xfb75f1f04c88399a6f5fc3d73519baf41da5a6671a7ce93acac38c14c9003703", "MarketReviewed(uint256,bool,string)", {"marketId": indexed(p.uint256), "isApproved": p.bool, "data": p.string}),
    MarketStatusUpdated: event("0xd067ebf1565b7b7f7e3c08ccb7f355defc06fd6a3e5e3da1f0a43c8a235350ac", "MarketStatusUpdated(uint256,uint8)", {"marketId": indexed(p.uint256), "status": p.uint8}),
    MinimumInitialCollateralSet: event("0xf061c45608f654ce41f651a8f81f43e59181bb794bc5f5893973bbeefd400103", "MinimumInitialCollateralSet(uint256)", {"amount": p.uint256}),
    OutcomeTokensBought: event("0xeb9457593caf7fc87806f628109f2f96fcfa5381c0e28c0372c40d1391f7d144", "OutcomeTokensBought(uint256,address,uint8,uint256,uint256)", {"marketId": indexed(p.uint256), "buyer": indexed(p.address), "outcome": p.uint8, "amount": p.uint256, "cost": p.uint256}),
    OutcomeTokensSold: event("0xb2cab92e8c420c65261523fc7ec7f15931cb7ad6bc4547497017eaaf9765ce3b", "OutcomeTokensSold(uint256,address,uint8,uint256,uint256)", {"marketId": indexed(p.uint256), "seller": indexed(p.address), "outcome": p.uint8, "amount": p.uint256, "received": p.uint256}),
    ProtocolFeeSet: event("0xdb5aafdb29539329e37d4e3ee869bc4031941fd55a5dfc92824fbe34b204e30d", "ProtocolFeeSet(uint256)", {"feeBps": p.uint256}),
    XOMarketsAddressSet: event("0x490526bf1df8a67c5c22e05acd3243a949f8214a3a9c1b87f147c9e560f661d7", "XOMarketsAddressSet(address)", {"xoMarketsAddress": indexed(p.address)}),
}

export const functions = {
    ALPHA: viewFun("0xb0bb1c5a", "ALPHA()", {}, p.uint256),
    LARGE_NUMBER: viewFun("0xd900c887", "LARGE_NUMBER()", {}, p.uint256),
    MAX_BPS: viewFun("0xfd967f47", "MAX_BPS()", {}, p.uint256),
    RESOLUTION_PERIOD: viewFun("0x50f90594", "RESOLUTION_PERIOD()", {}, p.uint256),
    authority: viewFun("0xbf7e214f", "authority()", {}, p.address),
    buy: fun("0x9b29429d", "buy(uint256,uint8,uint256,uint256)", {"_marketId": p.uint256, "_outcome": p.uint8, "_amount": p.uint256, "_maxCost": p.uint256}, ),
    createMarket: fun("0x06394c2f", "createMarket(uint40,uint40,address,uint256,uint16,uint8,address,string)", {"_startsAt": p.uint40, "_expiresAt": p.uint40, "_collateralToken": p.address, "_initialCollateral": p.uint256, "_creatorFeeBps": p.uint16, "_outcomeCount": p.uint8, "_resolver": p.address, "_metaDataURI": p.string}, ),
    getCollateralTokenAllowed: viewFun("0x583bc2b5", "getCollateralTokenAllowed(address)", {"token": p.address}, p.bool),
    getExtendedMarket: viewFun("0x2ed00bef", "getExtendedMarket(uint256)", {"_marketId": p.uint256}, p.struct({"market": p.struct({"id": p.uint128, "expiresAt": p.uint40, "startsAt": p.uint40, "createdAt": p.uint40, "resolvedAt": p.uint40, "winningOutcome": p.uint128, "resolver": p.address, "creatorFeeBps": p.uint16, "outcomeTokenStartIndex": p.uint256, "outcomeCount": p.uint8, "collateralToken": p.address, "collateralAmount": p.uint256, "status": p.uint8}), "collateralAmounts": p.array(p.uint256), "outcomePrices": p.array(p.uint256)})),
    getInsuranceAddress: viewFun("0x04122aa8", "getInsuranceAddress()", {}, p.address),
    getMarket: viewFun("0xeb44fdd3", "getMarket(uint256)", {"_marketId": p.uint256}, p.struct({"id": p.uint128, "expiresAt": p.uint40, "startsAt": p.uint40, "createdAt": p.uint40, "resolvedAt": p.uint40, "winningOutcome": p.uint128, "resolver": p.address, "creatorFeeBps": p.uint16, "outcomeTokenStartIndex": p.uint256, "outcomeCount": p.uint8, "collateralToken": p.address, "collateralAmount": p.uint256, "status": p.uint8})),
    getMarketCollateral: viewFun("0x1783af9a", "getMarketCollateral(uint256)", {"marketId": p.uint256}, p.uint256),
    getMarketOutcomeTokenAmount: viewFun("0x993fca77", "getMarketOutcomeTokenAmount(uint256,uint8)", {"marketId": p.uint256, "outcome": p.uint8}, p.uint256),
    getMarketOutcomeTokenIndex: viewFun("0x35f6f689", "getMarketOutcomeTokenIndex(uint256,uint8)", {"marketId": p.uint256, "outcome": p.uint8}, p.uint256),
    getMarketResolver: viewFun("0x41a976f6", "getMarketResolver(address)", {"_resolver": p.address}, p.struct({"isPublicResolver": p.bool, "feeBps": p.uint16})),
    getMinimumInitialCollateral: viewFun("0xcdb2ffdf", "getMinimumInitialCollateral()", {}, p.uint256),
    getOutcomePurchaseCost: viewFun("0x42a5aca4", "getOutcomePurchaseCost(uint256,uint8,uint256)", {"_marketId": p.uint256, "_outcome": p.uint8, "_amount": p.uint256}, p.uint256),
    getOutcomeSaleReturn: viewFun("0x509e70bb", "getOutcomeSaleReturn(uint256,uint8,uint256)", {"_marketId": p.uint256, "_outcome": p.uint8, "_amount": p.uint256}, p.uint256),
    getPrice: viewFun("0xc0a027f4", "getPrice(uint256,uint8)", {"marketId": p.uint256, "_outcome": p.uint8}, p.uint256),
    getPrices: viewFun("0x91492956", "getPrices(uint256)", {"marketId": p.uint256}, p.array(p.uint256)),
    getProtocolFee: viewFun("0xa5a41031", "getProtocolFee()", {}, p.uint256),
    getRedeemableAmount: viewFun("0xddcd45b2", "getRedeemableAmount(uint256,uint256)", {"marketId": p.uint256, "amount": p.uint256}, p.uint256),
    isConsumingScheduledOp: viewFun("0x8fb36037", "isConsumingScheduledOp()", {}, p.bytes4),
    isMarketResolved: viewFun("0x53ac55f5", "isMarketResolved(uint256)", {"marketId": p.uint256}, p.bool),
    redeem: fun("0xdb006a75", "redeem(uint256)", {"_marketId": p.uint256}, ),
    redeemDefaultedMarket: fun("0xa2d7fadb", "redeemDefaultedMarket(uint256)", {"_marketId": p.uint256}, ),
    resolveMarket: fun("0xf09f6fa0", "resolveMarket(uint256,uint128)", {"_marketId": p.uint256, "_winningOutcome": p.uint128}, ),
    reviewMarket: fun("0x64e7c986", "reviewMarket(uint256,bool,string)", {"_marketId": p.uint256, "_isApproved": p.bool, "data": p.string}, ),
    sell: fun("0x66f390e5", "sell(uint256,uint8,uint256,uint256)", {"_marketId": p.uint256, "_outcome": p.uint8, "_amount": p.uint256, "_minReturn": p.uint256}, ),
    setAuthority: fun("0x7a9e5e4b", "setAuthority(address)", {"newAuthority": p.address}, ),
    setCollateralTokenAllowed: fun("0xf59a40f5", "setCollateralTokenAllowed(address,bool)", {"token": p.address, "allowed": p.bool}, ),
    setInsuranceAddress: fun("0xbb208f55", "setInsuranceAddress(address)", {"insuranceAddress": p.address}, ),
    setMarketResolver: fun("0xf8eef64f", "setMarketResolver(address,bool)", {"_resolver": p.address, "_isPublicResolver": p.bool}, ),
    setMarketResolverFee: fun("0x7add0a1e", "setMarketResolverFee(uint16)", {"_feeBps": p.uint16}, ),
    setMinimumInitialCollateral: fun("0xc2b212d4", "setMinimumInitialCollateral(uint256)", {"amount": p.uint256}, ),
    setProtocolFee: fun("0x787dce3d", "setProtocolFee(uint256)", {"feeBps": p.uint256}, ),
    setXOMarketsAddress: fun("0x9dab21c4", "setXOMarketsAddress(address)", {"_xoMarkets": p.address}, ),
    xOutcomes: viewFun("0x6bed5256", "xOutcomes()", {}, p.address),
    xoMarkets: viewFun("0xb687c5c3", "xoMarkets()", {}, p.address),
}

export class Contract extends ContractBase {

    ALPHA() {
        return this.eth_call(functions.ALPHA, {})
    }

    LARGE_NUMBER() {
        return this.eth_call(functions.LARGE_NUMBER, {})
    }

    MAX_BPS() {
        return this.eth_call(functions.MAX_BPS, {})
    }

    RESOLUTION_PERIOD() {
        return this.eth_call(functions.RESOLUTION_PERIOD, {})
    }

    authority() {
        return this.eth_call(functions.authority, {})
    }

    getCollateralTokenAllowed(token: GetCollateralTokenAllowedParams["token"]) {
        return this.eth_call(functions.getCollateralTokenAllowed, {token})
    }

    getExtendedMarket(_marketId: GetExtendedMarketParams["_marketId"]) {
        return this.eth_call(functions.getExtendedMarket, {_marketId})
    }

    getInsuranceAddress() {
        return this.eth_call(functions.getInsuranceAddress, {})
    }

    getMarket(_marketId: GetMarketParams["_marketId"]) {
        return this.eth_call(functions.getMarket, {_marketId})
    }

    getMarketCollateral(marketId: GetMarketCollateralParams["marketId"]) {
        return this.eth_call(functions.getMarketCollateral, {marketId})
    }

    getMarketOutcomeTokenAmount(marketId: GetMarketOutcomeTokenAmountParams["marketId"], outcome: GetMarketOutcomeTokenAmountParams["outcome"]) {
        return this.eth_call(functions.getMarketOutcomeTokenAmount, {marketId, outcome})
    }

    getMarketOutcomeTokenIndex(marketId: GetMarketOutcomeTokenIndexParams["marketId"], outcome: GetMarketOutcomeTokenIndexParams["outcome"]) {
        return this.eth_call(functions.getMarketOutcomeTokenIndex, {marketId, outcome})
    }

    getMarketResolver(_resolver: GetMarketResolverParams["_resolver"]) {
        return this.eth_call(functions.getMarketResolver, {_resolver})
    }

    getMinimumInitialCollateral() {
        return this.eth_call(functions.getMinimumInitialCollateral, {})
    }

    getOutcomePurchaseCost(_marketId: GetOutcomePurchaseCostParams["_marketId"], _outcome: GetOutcomePurchaseCostParams["_outcome"], _amount: GetOutcomePurchaseCostParams["_amount"]) {
        return this.eth_call(functions.getOutcomePurchaseCost, {_marketId, _outcome, _amount})
    }

    getOutcomeSaleReturn(_marketId: GetOutcomeSaleReturnParams["_marketId"], _outcome: GetOutcomeSaleReturnParams["_outcome"], _amount: GetOutcomeSaleReturnParams["_amount"]) {
        return this.eth_call(functions.getOutcomeSaleReturn, {_marketId, _outcome, _amount})
    }

    getPrice(marketId: GetPriceParams["marketId"], _outcome: GetPriceParams["_outcome"]) {
        return this.eth_call(functions.getPrice, {marketId, _outcome})
    }

    getPrices(marketId: GetPricesParams["marketId"]) {
        return this.eth_call(functions.getPrices, {marketId})
    }

    getProtocolFee() {
        return this.eth_call(functions.getProtocolFee, {})
    }

    getRedeemableAmount(marketId: GetRedeemableAmountParams["marketId"], amount: GetRedeemableAmountParams["amount"]) {
        return this.eth_call(functions.getRedeemableAmount, {marketId, amount})
    }

    isConsumingScheduledOp() {
        return this.eth_call(functions.isConsumingScheduledOp, {})
    }

    isMarketResolved(marketId: IsMarketResolvedParams["marketId"]) {
        return this.eth_call(functions.isMarketResolved, {marketId})
    }

    xOutcomes() {
        return this.eth_call(functions.xOutcomes, {})
    }

    xoMarkets() {
        return this.eth_call(functions.xoMarkets, {})
    }
}

/// Event types
export type AuthorityUpdatedEventArgs = EParams<typeof events.AuthorityUpdated>
export type CollateralRedeemedEventArgs = EParams<typeof events.CollateralRedeemed>
export type CollateralTokenAllowedEventArgs = EParams<typeof events.CollateralTokenAllowed>
export type InsuranceAddressSetEventArgs = EParams<typeof events.InsuranceAddressSet>
export type MarketCreatedEventArgs = EParams<typeof events.MarketCreated>
export type MarketPriceChangedEventArgs = EParams<typeof events.MarketPriceChanged>
export type MarketResolvedEventArgs = EParams<typeof events.MarketResolved>
export type MarketResolverFeeSetEventArgs = EParams<typeof events.MarketResolverFeeSet>
export type MarketResolverSetEventArgs = EParams<typeof events.MarketResolverSet>
export type MarketReviewedEventArgs = EParams<typeof events.MarketReviewed>
export type MarketStatusUpdatedEventArgs = EParams<typeof events.MarketStatusUpdated>
export type MinimumInitialCollateralSetEventArgs = EParams<typeof events.MinimumInitialCollateralSet>
export type OutcomeTokensBoughtEventArgs = EParams<typeof events.OutcomeTokensBought>
export type OutcomeTokensSoldEventArgs = EParams<typeof events.OutcomeTokensSold>
export type ProtocolFeeSetEventArgs = EParams<typeof events.ProtocolFeeSet>
export type XOMarketsAddressSetEventArgs = EParams<typeof events.XOMarketsAddressSet>

/// Function types
export type ALPHAParams = FunctionArguments<typeof functions.ALPHA>
export type ALPHAReturn = FunctionReturn<typeof functions.ALPHA>

export type LARGE_NUMBERParams = FunctionArguments<typeof functions.LARGE_NUMBER>
export type LARGE_NUMBERReturn = FunctionReturn<typeof functions.LARGE_NUMBER>

export type MAX_BPSParams = FunctionArguments<typeof functions.MAX_BPS>
export type MAX_BPSReturn = FunctionReturn<typeof functions.MAX_BPS>

export type RESOLUTION_PERIODParams = FunctionArguments<typeof functions.RESOLUTION_PERIOD>
export type RESOLUTION_PERIODReturn = FunctionReturn<typeof functions.RESOLUTION_PERIOD>

export type AuthorityParams = FunctionArguments<typeof functions.authority>
export type AuthorityReturn = FunctionReturn<typeof functions.authority>

export type BuyParams = FunctionArguments<typeof functions.buy>
export type BuyReturn = FunctionReturn<typeof functions.buy>

export type CreateMarketParams = FunctionArguments<typeof functions.createMarket>
export type CreateMarketReturn = FunctionReturn<typeof functions.createMarket>

export type GetCollateralTokenAllowedParams = FunctionArguments<typeof functions.getCollateralTokenAllowed>
export type GetCollateralTokenAllowedReturn = FunctionReturn<typeof functions.getCollateralTokenAllowed>

export type GetExtendedMarketParams = FunctionArguments<typeof functions.getExtendedMarket>
export type GetExtendedMarketReturn = FunctionReturn<typeof functions.getExtendedMarket>

export type GetInsuranceAddressParams = FunctionArguments<typeof functions.getInsuranceAddress>
export type GetInsuranceAddressReturn = FunctionReturn<typeof functions.getInsuranceAddress>

export type GetMarketParams = FunctionArguments<typeof functions.getMarket>
export type GetMarketReturn = FunctionReturn<typeof functions.getMarket>

export type GetMarketCollateralParams = FunctionArguments<typeof functions.getMarketCollateral>
export type GetMarketCollateralReturn = FunctionReturn<typeof functions.getMarketCollateral>

export type GetMarketOutcomeTokenAmountParams = FunctionArguments<typeof functions.getMarketOutcomeTokenAmount>
export type GetMarketOutcomeTokenAmountReturn = FunctionReturn<typeof functions.getMarketOutcomeTokenAmount>

export type GetMarketOutcomeTokenIndexParams = FunctionArguments<typeof functions.getMarketOutcomeTokenIndex>
export type GetMarketOutcomeTokenIndexReturn = FunctionReturn<typeof functions.getMarketOutcomeTokenIndex>

export type GetMarketResolverParams = FunctionArguments<typeof functions.getMarketResolver>
export type GetMarketResolverReturn = FunctionReturn<typeof functions.getMarketResolver>

export type GetMinimumInitialCollateralParams = FunctionArguments<typeof functions.getMinimumInitialCollateral>
export type GetMinimumInitialCollateralReturn = FunctionReturn<typeof functions.getMinimumInitialCollateral>

export type GetOutcomePurchaseCostParams = FunctionArguments<typeof functions.getOutcomePurchaseCost>
export type GetOutcomePurchaseCostReturn = FunctionReturn<typeof functions.getOutcomePurchaseCost>

export type GetOutcomeSaleReturnParams = FunctionArguments<typeof functions.getOutcomeSaleReturn>
export type GetOutcomeSaleReturnReturn = FunctionReturn<typeof functions.getOutcomeSaleReturn>

export type GetPriceParams = FunctionArguments<typeof functions.getPrice>
export type GetPriceReturn = FunctionReturn<typeof functions.getPrice>

export type GetPricesParams = FunctionArguments<typeof functions.getPrices>
export type GetPricesReturn = FunctionReturn<typeof functions.getPrices>

export type GetProtocolFeeParams = FunctionArguments<typeof functions.getProtocolFee>
export type GetProtocolFeeReturn = FunctionReturn<typeof functions.getProtocolFee>

export type GetRedeemableAmountParams = FunctionArguments<typeof functions.getRedeemableAmount>
export type GetRedeemableAmountReturn = FunctionReturn<typeof functions.getRedeemableAmount>

export type IsConsumingScheduledOpParams = FunctionArguments<typeof functions.isConsumingScheduledOp>
export type IsConsumingScheduledOpReturn = FunctionReturn<typeof functions.isConsumingScheduledOp>

export type IsMarketResolvedParams = FunctionArguments<typeof functions.isMarketResolved>
export type IsMarketResolvedReturn = FunctionReturn<typeof functions.isMarketResolved>

export type RedeemParams = FunctionArguments<typeof functions.redeem>
export type RedeemReturn = FunctionReturn<typeof functions.redeem>

export type RedeemDefaultedMarketParams = FunctionArguments<typeof functions.redeemDefaultedMarket>
export type RedeemDefaultedMarketReturn = FunctionReturn<typeof functions.redeemDefaultedMarket>

export type ResolveMarketParams = FunctionArguments<typeof functions.resolveMarket>
export type ResolveMarketReturn = FunctionReturn<typeof functions.resolveMarket>

export type ReviewMarketParams = FunctionArguments<typeof functions.reviewMarket>
export type ReviewMarketReturn = FunctionReturn<typeof functions.reviewMarket>

export type SellParams = FunctionArguments<typeof functions.sell>
export type SellReturn = FunctionReturn<typeof functions.sell>

export type SetAuthorityParams = FunctionArguments<typeof functions.setAuthority>
export type SetAuthorityReturn = FunctionReturn<typeof functions.setAuthority>

export type SetCollateralTokenAllowedParams = FunctionArguments<typeof functions.setCollateralTokenAllowed>
export type SetCollateralTokenAllowedReturn = FunctionReturn<typeof functions.setCollateralTokenAllowed>

export type SetInsuranceAddressParams = FunctionArguments<typeof functions.setInsuranceAddress>
export type SetInsuranceAddressReturn = FunctionReturn<typeof functions.setInsuranceAddress>

export type SetMarketResolverParams = FunctionArguments<typeof functions.setMarketResolver>
export type SetMarketResolverReturn = FunctionReturn<typeof functions.setMarketResolver>

export type SetMarketResolverFeeParams = FunctionArguments<typeof functions.setMarketResolverFee>
export type SetMarketResolverFeeReturn = FunctionReturn<typeof functions.setMarketResolverFee>

export type SetMinimumInitialCollateralParams = FunctionArguments<typeof functions.setMinimumInitialCollateral>
export type SetMinimumInitialCollateralReturn = FunctionReturn<typeof functions.setMinimumInitialCollateral>

export type SetProtocolFeeParams = FunctionArguments<typeof functions.setProtocolFee>
export type SetProtocolFeeReturn = FunctionReturn<typeof functions.setProtocolFee>

export type SetXOMarketsAddressParams = FunctionArguments<typeof functions.setXOMarketsAddress>
export type SetXOMarketsAddressReturn = FunctionReturn<typeof functions.setXOMarketsAddress>

export type XOutcomesParams = FunctionArguments<typeof functions.xOutcomes>
export type XOutcomesReturn = FunctionReturn<typeof functions.xOutcomes>

export type XoMarketsParams = FunctionArguments<typeof functions.xoMarkets>
export type XoMarketsReturn = FunctionReturn<typeof functions.xoMarkets>

