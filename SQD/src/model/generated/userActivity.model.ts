import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class UserActivity {
    constructor(props?: Partial<UserActivity>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    userAddress!: string

    @StringColumn_({nullable: false})
    marketId!: string

    @StringColumn_({nullable: false})
    action!: string

    @IntColumn_({nullable: true})
    outcome!: number | undefined | null

    @BigIntColumn_({nullable: true})
    quantity!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    totalAmount!: bigint | undefined | null

    @StringColumn_({nullable: false})
    txnHash!: string

    @FloatColumn_({nullable: false})
    timestamp!: number
}
