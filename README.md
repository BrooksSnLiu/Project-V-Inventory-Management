Project-V Inventory Management Service

The Inventory Management service provides read-only inventory data to other modules in the enterprise system, including the Menu, POS, and Transactions teams.
All inventory data comes from the Database team’s API.
This service does not store or modify data locally.

Tech Stack

Node.js

Express

ES Modules

node:test for unit tests

Project Structure

src/
  app.js                   Sets up Express application and middleware
  server.js                Starts the HTTP server
  inventory.service.js     Business logic (DB-driven, no local state)
  controllers/
    inventory.controller.js  Route handler functions
  routes/
    inventory.routes.js      API routes

test/
  service.test.js           Unit tests for the service layer


  How to Run

npm install
npm run dev
npm test

The service runs on:
http://localhost:3000

Environment Variables

The service requires a Database API base URL:

DB_API_BASE=<database-service-url>


Example (placeholder only):

DB_API_BASE=http://db-team-service:4000


If this value is not set, all read operations will fail with the error:
"DB API base URL not configured yet"

API Endpoints

All endpoints are prefixed with /api/v1.

Health
GET /health

Returns basic service status.

Inventory (Read-Only)

These endpoints fetch data from the Database service.

GET /items
GET /items/:id
GET /stock/:id/level

Not Supported in This Service

The Inventory module does not create or delete inventory items.
These operations belong to the Database or Facilities/Menu workflows.

Calls to these endpoints will return 501 Not Implemented:

POST /items
DELETE /items/:id

Stock Adjustment (Future Integration)
POST /stock/adjust


This endpoint exists for the API contract but currently returns a
"not implemented" message until integration with the Transactions module is completed.

Architecture Summary
Database Service (source of truth)
         ↓
Inventory Service (this module)
         ↓
Menu, POS, Transactions teams consume the Inventory API


The Inventory service:

Does not store data locally

Maps Database API responses into a consistent internal item format

Exposes stable APIs for other teams

Testing

Tests verify that:

Read operations fail clearly when DB_API_BASE is not configured

adjustStock is intentionally not implemented

No in-memory storage is used

Tests align with the new DB-driven architecture

Sprint 3 Summary

Converted the entire module to a DB-driven architecture

Removed in-memory Maps

Added mapping layer for Database responses

Updated controllers and routes

Updated unit tests

Added improved error handling

Documented integration points with other modules