# ---- Base image ----
FROM node:24-alpine AS base

# Set working dir
WORKDIR /app

# Install deps separately for caching
COPY package.json package-lock.json* ./
RUN npm install

# Copy rest of app
COPY . .

# Generate Prisma client
RUN npx prisma generate

RUN apk add yt-dlp

# Expose Fastify port
EXPOSE 3001

# Run app
CMD ["npm", "run", "dev"]
