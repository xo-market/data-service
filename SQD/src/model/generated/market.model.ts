import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class Market {
    constructor(props?: Partial<Market>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    marketId!: string

    @StringColumn_({nullable: false})
    creator!: string

    @StringColumn_({nullable: false})
    startsAt!: string

    @StringColumn_({nullable: false})
    expiresAt!: string

    @StringColumn_({nullable: false})
    collateralToken!: string

    @IntColumn_({nullable: false})
    outcomeCount!: number

    @StringColumn_({nullable: false})
    name!: string

    @StringColumn_({nullable: false})
    description!: string

    @StringColumn_({nullable: false})
    image!: string

    @StringColumn_({nullable: false})
    category!: string

    @StringColumn_({nullable: false})
    type!: string

    @StringColumn_({array: true, nullable: false})
    tags!: (string)[]

    @StringColumn_({nullable: false})
    rules!: string

    @StringColumn_({nullable: false})
    externalURL!: string

    @StringColumn_({nullable: false})
    animationURL!: string

    @StringColumn_({nullable: false})
    backgroundColor!: string

    @StringColumn_({nullable: false})
    metaDataURI!: string

    @StringColumn_({nullable: false})
    txnHash!: string
}
