## Project-V Inventory Management Service

## Overview
The Inventory Management Service provides read-only inventory data to other modules in the Project-V enterprise system.
All inventory information is fetched directly from the Database Team’s API, which acts as the single source of truth.

This service:                

- Does not store any local data
- Does not modify or create inventory records
- Exposes stable, consistent APIs for Menu, POS, Transactions, and Facilities teams

## Quick Start

### 1. Install Dependencies
npm install

### 2. Configure Environment
Create a .env file in the project root:

DB_API_BASE=<database-service-url>

If not set, all read operations will fail with:
DB API base URL not configured yet

### 3. Run the Service
npm run dev

### 4. Run Tests
npm test

## Project Structure
src/
  app.js                  Express application and middleware
  server.js               HTTP server entry point
  inventory.service.js    Business logic (DB-driven; no local state)

  controllers/
    inventory.controller.js     Route handlers

  routes/
    inventory.routes.js         API route definitions

test/
  service.test.js         Unit tests for service behavior

## API Endpoints
All endpoints are prefixed with /api/v1.

## Health
GET /health
Returns basic service status.

## Inventory (Read-Only)
These endpoints retrieve data directly from the Database API.

GET /items
Returns all items.

GET /items/:id
Returns a specific item.

GET /stock/:id/level
Returns the stock level of the given item.

## Not Supported
The Inventory module does not create, edit, or delete inventory items.
These operations belong to the Database Team or other workflow modules.

The following return 501 Not Implemented:

POST /items
DELETE /items/:id

## Stock Adjustment (Future Integration)
POST /stock/adjust

This endpoint exists for API-contract alignment but currently returns a
“not implemented” response until Transactions Team integration is complete.

## Architecture Summary
Database Service (source of truth)
           ↓
Inventory Management Service
           ↓
Menu / POS / Transactions / Facilities Teams

The Inventory Management Service:

- Stores no local data
- Fetches all records from the Database API
- Maps external DB responses into consistent internal formats
- Provides stable consumption interfaces for other teams

## Testing
The test suite verifies that:

- Read operations fail clearly when DB_API_BASE is missing
- adjustStock is intentionally not implemented
- No in-memory Maps or local storage exist
- Service layer correctly interacts with the Database Team API
- Mapping layer produces consistent output
- Errors are handled properly under the new DB-driven design
- Unit tests align with Sprint 3 architecture

Run all tests using:
npm test

## Sprint 3 Summary
- Converted entire module to a DB-driven architecture
- Removed all legacy in-memory Maps
- Added response-mapping layer for Database Team outputs
- Updated controllers, routes, and service logic
- Improved error handling and failure messages
- Rewrote unit tests to match the new architecture
- Documented integration expectations for consuming modules
