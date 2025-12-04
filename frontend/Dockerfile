# frontend/Dockerfile

FROM node:22-alpine

WORKDIR /usr/src/app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Vite dev server will run on 7000 (we’ll confirm vite.config below)
EXPOSE 7000

# Run Vite dev server, listening on all interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "7000"]
