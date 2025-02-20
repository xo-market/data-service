import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class MarketPrice {
    constructor(props?: Partial<MarketPrice>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    marketId!: string

    @StringColumn_({array: true, nullable: false})
    outcomePrices!: (string)[]

    @StringColumn_({nullable: false})
    txnHash!: string

    @FloatColumn_({nullable: false})
    timestamp!: number
}
