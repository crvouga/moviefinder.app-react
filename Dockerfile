# Use Bun as base image
FROM oven/bun:1 AS base

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
