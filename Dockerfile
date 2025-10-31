# ---- Build a tiny image with Node LTS ----
FROM node:20-alpine

# App directory
WORKDIR /app

# Install 
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY src ./src

#copy tests
COPY test ./test

# Service config
ENV NODE_ENV=production
EXPOSE 3000

# Start HTTP server
CMD ["node", "src/server.js"]
