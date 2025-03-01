import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class UserMarketData {
    constructor(props?: Partial<UserMarketData>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    userAddress!: string

    @StringColumn_({nullable: false})
    marketId!: string

    @BooleanColumn_({nullable: false})
    isRedeemed!: boolean

    @BooleanColumn_({nullable: false})
    isClaimable!: boolean

    @BooleanColumn_({nullable: false})
    isExpired!: boolean

    @IntColumn_({nullable: false})
    outcome!: number

    @IntColumn_({nullable: true})
    winingOutcome!: number | undefined | null

    @BigIntColumn_({nullable: false})
    quantity!: bigint
}
