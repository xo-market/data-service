# ---------------------------
# 1. BUILD STAGE
# ---------------------------
    FROM node:22-slim AS builder

    # Create and set working directory
    WORKDIR /app
    
    # Copy only package info first (faster caching)
    COPY package.json pnpm-lock.yaml ./
    
    # Install pnpm globally
    RUN npm install -g pnpm
    
    # Install all dependencies (including dev)
    RUN pnpm install
    
    # Copy the rest of the source code
    COPY tsconfig.json ./
    COPY src ./src
    
    # Build the TypeScript code to `dist/`
    RUN pnpm build
    
    
    # ---------------------------
    # 2. PRODUCTION STAGE
    # ---------------------------
    FROM node:22-slim
    
    # Create and set working directory
    WORKDIR /app
    
    # Copy package.json & pnpm-lock.yaml
    COPY package.json pnpm-lock.yaml ./
    
    # Install pnpm globally
    RUN npm install -g pnpm
    
    # Install only production dependencies
    RUN pnpm install --prod
    
    # Copy compiled code from the build stage
    COPY --from=builder /app/dist ./dist
    
    # Expose the port (not strictly required for Cloud Run, but good practice)
    EXPOSE 8080
    
    # Start the server
    CMD ["node", "dist/server.js"]
    