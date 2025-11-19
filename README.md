🚀 Quick Start
1. Install dependencies
npm install

2. Configure environment

Create a .env file and set:

DB_API_BASE=<database-api-url>


If this value is missing, all read operations will fail with:

DB API base URL not configured yet

3. Run the service
npm run dev

4. Run tests
npm test

📁 Project Structure
src/
  app.js                  Express app + middleware setup
  server.js               Starts the HTTP server
  inventory.service.js    Business logic (DB-driven, no local state)

  controllers/
    inventory.controller.js    Handles API requests

  routes/
    inventory.routes.js        Defines API endpoints

test/
  service.test.js         Unit tests for DB-driven service behavior

📡 API Endpoints

All endpoints are prefixed with /api/v1.

Health
GET /health

Returns basic service status.

📦 Inventory (Read-Only)

These routes proxy data from the Database Team.

GET /items

Retrieve all items from the Database service.

GET /items/:id

Retrieve a single item by ID.

GET /stock/:id/level

Retrieve stock level for a specific item.

🚫 Not Supported in This Service

The Inventory module does NOT perform create/update/delete operations.

These routes return 501 Not Implemented:

POST /items

DELETE /items/:id

📉 Stock Adjustment (Future Integration)
POST /stock/adjust

Present only for API contract alignment.
Currently returns a “not implemented” message until integration with the Transactions Team is completed.

🏗️ Architecture Summary
Database Service (source of truth)
        ↓
Inventory Service (this module)
        ↓
Menu Team / POS / Transactions Team / Facilities


The Inventory Service:

Has no local database

Reads everything from the DB Team’s service

Maps values into a consistent internal format

Provides a stable API for consuming teams

🧪 Testing

Tests verify that:

Read operations fail clearly when DB_API_BASE is missing

adjustStock is intentionally not implemented

No in-memory Maps or local storage exists

Service layer correctly forwards calls to Database API

Mapping logic produces consistent item/stock output

Error handling follows the new DB-driven architecture

Run all tests:

npm test

📝 Sprint 3 Summary

Migrated completely to Database-driven architecture

Removed in-memory storage (Maps)

Added item/stock mapping layer

Updated controllers, services, and routes

Improved error handling and failure messages

Updated unit tests to match DB-driven flow

Documented integration for other enterprise teams
