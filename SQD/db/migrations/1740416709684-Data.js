module.exports = class Data1740416709684 {
    name = 'Data1740416709684'

    async up(db) {
        await db.query(`CREATE TABLE "market" ("id" character varying NOT NULL, "market_id" text NOT NULL, "creator" text NOT NULL, "starts_at" text NOT NULL, "expires_at" text NOT NULL, "collateral_token" text NOT NULL, "outcome_count" integer NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "image" text NOT NULL, "category" text NOT NULL, "type" text NOT NULL, "tags" text array NOT NULL, "rules" text NOT NULL, "external_url" text NOT NULL, "animation_url" text NOT NULL, "background_color" text NOT NULL, "meta_data_uri" text NOT NULL, "txn_hash" text NOT NULL, CONSTRAINT "PK_1e9a2963edfd331d92018e3abac" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "market_price" ("id" character varying NOT NULL, "market_id" text NOT NULL, "outcome_prices" text array NOT NULL, "txn_hash" text NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_2d0e67fad606926d3f44a79bab5" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "user_transactions" ("id" character varying NOT NULL, "user_address" text NOT NULL, "market_id" text NOT NULL, "outcome" integer NOT NULL, "quantity" numeric NOT NULL, "total_amount" numeric NOT NULL, "type" text NOT NULL, "is_claimable" boolean NOT NULL, "is_expired" boolean NOT NULL, "is_redeemed" boolean NOT NULL, "txn_hash" text NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_21325240e8a1f55f22a6f35df4f" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "market"`)
        await db.query(`DROP TABLE "market_price"`)
        await db.query(`DROP TABLE "user_transactions"`)
    }
}
