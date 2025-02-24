module.exports = class Data1740425624361 {
    name = 'Data1740425624361'

    async up(db) {
        await db.query(`CREATE TABLE "market" ("id" character varying NOT NULL, "market_id" text NOT NULL, "creator" text NOT NULL, "starts_at" text NOT NULL, "expires_at" text NOT NULL, "collateral_token" text NOT NULL, "outcome_count" integer NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "image" text NOT NULL, "category" text NOT NULL, "type" text NOT NULL, "tags" text array NOT NULL, "rules" text NOT NULL, "external_url" text NOT NULL, "animation_url" text NOT NULL, "background_color" text NOT NULL, "meta_data_uri" text NOT NULL, "txn_hash" text NOT NULL, CONSTRAINT "PK_1e9a2963edfd331d92018e3abac" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "market_price" ("id" character varying NOT NULL, "market_id" text NOT NULL, "outcome_prices" text array NOT NULL, "txn_hash" text NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_2d0e67fad606926d3f44a79bab5" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "user_activity" ("id" character varying NOT NULL, "user_address" text NOT NULL, "market_id" text NOT NULL, "action" text NOT NULL, "outcome" integer, "quantity" numeric, "total_amount" numeric, "txn_hash" text NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_daec6d19443689bda7d7785dff5" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "user_market_data" ("id" character varying NOT NULL, "user_address" text NOT NULL, "market_id" text NOT NULL, "is_redeemed" boolean NOT NULL, "is_claimable" boolean NOT NULL, "is_expired" boolean NOT NULL, "outcome" integer NOT NULL, "wining_outcome" integer, "quantity" numeric NOT NULL, CONSTRAINT "PK_0f8113022be6ba99476273bfbec" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "market"`)
        await db.query(`DROP TABLE "market_price"`)
        await db.query(`DROP TABLE "user_activity"`)
        await db.query(`DROP TABLE "user_market_data"`)
    }
}
