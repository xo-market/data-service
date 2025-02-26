    
    # ---------------------------
    # 2. PRODUCTION STAGE
    # ---------------------------
    FROM node:22-slim
    
    # Create and set working directory
    WORKDIR /app
    
    # Copy package.json & pnpm-lock.yaml
    COPY package.json pnpm-lock.yaml ./
    COPY tsconfig.json ./
    COPY src ./src
    COPY commands.json ./
    COPY renovate.json ./
    COPY schema.graphql ./
    COPY squid.yaml ./

    # Install pnpm globally
    RUN npm install -g pnpm

    # Install SQD globally
    RUN npm install -g sqd

    RUN npm install -g typescript

    # Install only production dependencies
    RUN pnpm install
    
    ENV DB_NAME=postgres
    ENV GQL_PORT=8000
    ENV MARKET_CONTRACT=0x9C5c116B90dA4ae820f9078586ef232f8FabC510
    ENV RPC_URL=https://rpc.xo-testnet.t.raas.gelato.cloud
    ENV DB_URL= #change this
    
    RUN pnpm build

    RUN pnpm squid-typeorm-migration generate
    RUN pnpm squid-typeorm-migration apply
    RUN pnpm squid-evm-typegen src/abi ./abi/*
    RUN pnpm build

    # Expose the port (not strictly required for Cloud Run, but good practice)
    EXPOSE 8080
    
    # Start the SQD server
    CMD ["node", "lib/main.js"]
    RUN pnpm squid-graphql-server
    