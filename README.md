# XO Market Data Service

This service provides a unified interface for **market-related data** and is built on top of **IPFS** and **GraphQL** subgraphs. The service is **Docker containerized**, making it easy to deploy on any container platform (e.g., Google Cloud Run, AWS ECS, Kubernetes).

---

## Features

1. **Create & Fetch Market Metadata**  
   - Stores market metadata on **IPFS** for decentralized and immutable storage.  
   - Provides APIs to upload new metadata and retrieve existing ones by IPFS hash.

2. **Query Market Data via GraphQL**  
   - Integrates with **subgraphs** to fetch the latest market data (prices, volume, etc.).  
   - Aggregates data from multiple on-chain or off-chain sources for broader insight.

3. **Query Account Data via GraphQL**  
   - Retrieve user or account information through connected subgraphs.  
   - Useful for analyzing holders, positions, or other account-level metrics.

4. **Real-Time Market Updates**  
   - Offers endpoints or subscriptions for real-time data such as **latest prices**, **trading volume**, and **chart updates**.  
   - Helps you stay up-to-date on current market movements.

---

## Getting Started

1. **Clone or Download** this repository.
2. **Build & Run** the Docker container:
   ```bash
   docker build -t xo-market-data-service .
   docker run -p 8080:8080 xo-market-data-service
   ```
3. The service runs on port **8080** by default (configurable via environment variables).

---

## Deployment

- Deploy anywhere that supports Docker containers, such as:
  - **Google Cloud Run**
  - **AWS ECS / Fargate**
  - **Kubernetes** (self-managed or hosted)
