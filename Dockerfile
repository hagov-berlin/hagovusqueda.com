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

RUN npm run build  

RUN apk add yt-dlp

CMD ["npm", "run", "start"]
