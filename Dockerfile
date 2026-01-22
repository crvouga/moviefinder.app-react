# Use Debian as base image for better CPU compatibility
FROM --platform=linux/amd64 debian:bookworm-slim AS base

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Bun baseline build (no AVX required)
# Using a specific version for stability - update as needed
ARG BUN_VERSION=1.3.6
ARG TARGETPLATFORM
RUN curl -fsSL https://github.com/oven-sh/bun/releases/download/bun-v${BUN_VERSION}/bun-linux-x64-baseline.zip -o bun.zip && \
    unzip -q bun.zip && \
    mv bun-linux-x64-baseline/bun /usr/local/bin/bun && \
    chmod +x /usr/local/bin/bun && \
    rm -rf bun.zip bun-linux-x64-baseline

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Build the frontend
RUN bun run build

# Expose port (default Bun port is usually 3000, adjust if needed)
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Run the backend server
CMD ["bun", "run", "src/backend.ts"]
