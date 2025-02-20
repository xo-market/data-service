module.exports = class Data1740070425654 {
    name = 'Data1740070425654'

    async up(db) {
        await db.query(`CREATE TABLE "market" ("id" character varying NOT NULL, "market_id" text NOT NULL, "creator" text NOT NULL, "starts_at" text NOT NULL, "expires_at" text NOT NULL, "collateral_token" text NOT NULL, "outcome_count" integer NOT NULL, "meta_data_uri" text NOT NULL, "txn_hash" text NOT NULL, CONSTRAINT "PK_1e9a2963edfd331d92018e3abac" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "market_price" ("id" character varying NOT NULL, "market_id" text NOT NULL, "outcome_prices" text array NOT NULL, "txn_hash" text NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_2d0e67fad606926d3f44a79bab5" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "market"`)
        await db.query(`DROP TABLE "market_price"`)
    }
}
