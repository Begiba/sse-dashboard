# --- Stage 1: Builder with full Node.js for installing dependencies
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# --- Stage 2: Runtime with only needed files
FROM node:24-alpine
WORKDIR /app

# Only copy what's needed for production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/index.js ./index.js

EXPOSE 4123
CMD ["node", "index.js"]
