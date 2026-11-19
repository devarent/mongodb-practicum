# MongoDB Practicum

## Overview
A hands-on lab for practicing MongoDB document modeling, the aggregation
pipeline, indexes, replica set concepts, and a small Node.js CRUD plus
aggregation exercise. Everything runs locally with Docker. No cloud account
and no real credentials are required.

## Architecture
- MongoDB 8 container stores two collections: `users` and `orders`.
- Mongo Express container provides a web UI on port 8081.
- `db/init/seed.js` runs once on first database init through `/docker-entrypoint-initdb.d`.
- `src/index.js` is a Node.js client that exercises CRUD and server-side aggregation.
- `src/lib/logic.js` holds pure functions so the core logic can be tested
  without a running database.

Data model:
- users: `{ _id, name, email, country, createdAt }`
- orders: `{ _id, userId, status, amount, items: [{ sku, qty, price }], createdAt }`

Replica set concepts (covered conceptually, not started by this compose file):
- A replica set is a group of mongod instances that hold the same data set.
- One node is primary and accepts writes; secondary nodes replicate the oplog.
- An election promotes a secondary when the primary is unavailable.
- Read preference and write concern control consistency and availability.
- To experiment locally, start a three-node set with `mongod --replSet rs0`
  and run `rs.initiate()` in mongosh.

## How to run
1. Copy `.env.example` to `.env` and replace every `REPLACE_ME` placeholder.
2. Start the services:
   `docker compose up -d`
3. Seed data is loaded automatically on the first start of a fresh volume.
   To seed again, remove the `mongo-data` volume first, then start again.
4. Run the client:
   `npm install`
   `npm start`
5. Open Mongo Express at `http://localhost:8081` (basic auth from `.env`).
6. Stop everything:
   `docker compose down`

## Test commands
- Run all unit tests (no database required): `npm test`
- Run a single file: `node --test tests/logic.test.js`

The test suite uses pure logic only and runs without MongoDB or any
third-party package. CI uses the same command on Node.js 22.

## Project structure
```
.
|-- .github/workflows/ci.yml   # CI: Node 22, runs unit tests
|-- .env.example               # placeholder environment variables
|-- .gitignore
|-- LICENSE                    # MIT 2026
|-- README.md
|-- docker-compose.yml         # mongo:8 + mongo-express
|-- package.json
|-- db/
|   `-- init/seed.js           # mongosh seed for users + orders
|-- scripts/
|   |-- backup.sh              # mongodump placeholder
|   `-- restore.sh             # mongorestore placeholder
|-- src/
|   |-- index.js               # CRUD + aggregation client
|   `-- lib/logic.js           # pure, DB-free logic
`-- tests/
    `-- logic.test.js          # node:test unit tests (no DB)
```

## Security notes
- Every credential in this repository is a placeholder (`REPLACE_ME`).
- Never commit a real `.env` file. It is ignored by git.
- Change the default Mongo Express credentials before exposing ports publicly.
- Bind published ports to localhost in any shared or production-like setup.
- Backups contain real data; store them outside the repo and encrypt at rest.
- Use least-privilege database users for the application client.

## Tech stack
- MongoDB 8
- Mongo Express
- Node.js 22 or newer (tested on 22 and 26)
- `mongodb` npm driver
- Docker and Docker Compose
- `node:test` for unit tests

## Repository topics
Suggested GitHub topics for this repository: `mongodb`, `docker`,
`docker-compose`, `nodejs`, `aggregation-pipeline`, `database-modeling`,
`indexes`, `replica-set`, `crud`, `practicum`. These are metadata labels only;
they are listed here so the repository can be tagged consistently on GitHub.

## License
MIT 2026 Arya Fatthurahman.
