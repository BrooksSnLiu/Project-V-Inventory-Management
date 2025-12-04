# Project-V Inventory Management Service

## Overview
The **Inventory Management Service** provides **read-only** inventory data.  
All information is retrieved directly from the configured Database API, which acts as the source of truth.

The service:
- All data is fetched directly from the central Database API
- Inventory information is always real-time and up-to-date
- The service exposes stable, read-only endpoints for consumers

---

## Environment Setup

Create a `.env` file in the backend directory with the following variables:

```env
DB_API_BASE=<your-database-api-url>
DB_API_USERNAME=<your-database-username>
DB_API_PASSWORD=<your-database-password>
INVENTORY_COLLECTION=<inventory-collection-name>
PORT=10000

### Installation
## Install dependencies
npm install

## Start the server (development)
npm run dev
The service will be available at:
http://localhost:10000

### API Endpoints
All routes are prefixed with /api/v1

## Health Check
GET /api/v1/health

## Inventory Data
GET /api/v1/items                → Returns all items
GET /api/v1/items/:id            → Returns a single item by ID
GET /api/v1/stock/:id/level      → Returns current stock level for an item

Each endpoint returns data directly from the database after being mapped into a consistent inventory format.

### Project Structure

src/
├── app.js                      # Express app and middleware
├── server.js                   # Service entry point
├── inventory.service.js        # Logic for fetching and mapping inventory data
├── controllers/
│   └── inventory.controller.js
├── routes/
│   └── inventory.routes.js
└── test/
    ├── unit/
    └── integration/


### Testing

## Run all tests:
npm test

The test suite validates:

  Proper behavior when environment variables are missing
  Correct mapping of inventory documents
  Endpoint responses and HTTP behavior
  Error handling for invalid conditions

Both unit tests and integration tests are included
