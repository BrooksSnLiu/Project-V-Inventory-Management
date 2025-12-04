# backend/Dockerfile

FROM node:22-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy source
COPY src ./src

# Backend listens on 10000
ENV PORT=10000
EXPOSE 10000

# Start backend in production mode
CMD ["npm", "start"]
