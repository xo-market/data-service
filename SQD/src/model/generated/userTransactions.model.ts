import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class UserTransactions {
    constructor(props?: Partial<UserTransactions>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    userAddress!: string

    @StringColumn_({nullable: false})
    marketId!: string

    @IntColumn_({nullable: false})
    outcome!: number

    @BigIntColumn_({nullable: false})
    quantity!: bigint

    @BigIntColumn_({nullable: false})
    totalAmount!: bigint

    @StringColumn_({nullable: false})
    type!: string

    @BooleanColumn_({nullable: false})
    isClaimable!: boolean

    @BooleanColumn_({nullable: false})
    isExpired!: boolean

    @BooleanColumn_({nullable: false})
    isRedeemed!: boolean

    @StringColumn_({nullable: false})
    txnHash!: string

    @FloatColumn_({nullable: false})
    timestamp!: number
}
