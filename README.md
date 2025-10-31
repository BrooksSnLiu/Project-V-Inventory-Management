### Project-V-Inventory-Management

This project will manage stock from the Menu and Facilities teams respectively. An item's quantity value will increase when restocked, and decrease when sold. If an item's quantity reaches zero, then the item will be marked as "Sold-Out", and cannot be sold until it gets restocked.

## Environment

Visual Studio Code

## How to run

npm install        # install packages
npm run dev        # start in dev mode
The service will run on http://localhost:3000.
npm test           # run unit tests

## Project structure

# The project is organized so that logic, controllers, and routes are kept separate:

src/
  app.js                 → sets up Express app, mounts routes
  server.js              → starts the server
  inventoryService.js    → business logic (in-memory)
  controllers/           → request handlers
  routes/                → API route definitions
test/
  service.test.js        → unit tests for core functions

## API (base: /api/v1)
# All endpoints are under the base path /api/v1.

GET /health – check service
POST /items – add item
GET /items/:id – get item
DELETE /items/:id – delete item
POST /stock/adjust – adjust stock
GET /stock/:id/level – get stock level



## Sprint-1 notes

State is in-memory only, so it resets when the server restarts.

Unit tests cover adding, reading, deleting, adjusting stock, and idempotency.

Keep it simple: no database, no extras, just core functionality(for now).

## Sprint-2 notes

Added a new feature that checks whether an item is sellable or not.

Added unit tests to make sure that the new feature works as intended.
