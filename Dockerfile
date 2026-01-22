# Build stage - use Node.js for building (more compatible, no AVX issues)
FROM --platform=linux/amd64 node:20-slim AS builder

# Install curl and unzip for downloading Bun
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install Bun for dependency installation (baseline build)
# We use Bun to install because it's faster and handles bun.lock
ARG BUN_VERSION=1.1.38
RUN curl -fsSL https://github.com/oven-sh/bun/releases/download/bun-v${BUN_VERSION}/bun-linux-x64-baseline.zip -o bun.zip && \
    unzip -q bun.zip && \
    install -m 755 bun-linux-x64-baseline/bun /usr/local/bin/bun && \
    rm -rf bun.zip bun-linux-x64-baseline

# Install dependencies with Bun (faster, handles bun.lock)
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Build the frontend with Node.js via npx (more compatible, no AVX issues)
# Use npx to run vite directly, avoiding any Bun-specific issues
RUN npx vite build

# Runtime stage - use Bun baseline for running
FROM --platform=linux/amd64 debian:bookworm-slim AS runtime

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Bun baseline build for runtime (no AVX required)
ARG BUN_VERSION=1.1.38
RUN curl -fsSL https://github.com/oven-sh/bun/releases/download/bun-v${BUN_VERSION}/bun-linux-x64-baseline.zip -o bun.zip && \
    unzip -q bun.zip && \
    install -m 755 bun-linux-x64-baseline/bun /usr/local/bin/bun && \
    rm -rf bun.zip bun-linux-x64-baseline

WORKDIR /app

# Copy package files and installed dependencies from builder
COPY --from=builder /app/package.json /app/bun.lock ./
COPY --from=builder /app/node_modules ./node_modules

# Copy built files and source
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

# Expose port (default Bun port is usually 3000, adjust if needed)
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Run the backend server
CMD ["bun", "run", "src/backend.ts"]
