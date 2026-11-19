"use strict";

// CRUD + aggregation client for the MongoDB practicum.
// Requires a running MongoDB (see docker-compose.yml).
const MongoClient = require("mongodb").MongoClient;
const logic = require("./lib/logic");

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGO_DB || "practicum";

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection("users");
    const orders = db.collection("orders");

    // INDEXES: create the indexes used by the lab queries.
    for (const spec of logic.buildIndexSpecs()) {
      await db.collection(spec.collection).createIndex(spec.keys, {
        name: spec.name,
        unique: Boolean(spec.unique)
      });
    }

    // CREATE (upsert keeps the lab repeatable).
    const newUser = {
      _id: 100,
      name: "Lab User",
      email: "lab.user@example.test",
      country: "ID",
      createdAt: new Date()
    };
    if (logic.isValidUser(newUser)) {
      await users.updateOne({ _id: newUser._id }, { $set: newUser }, { upsert: true });
    }

    // READ.
    const allUsers = await users.find({}).sort({ name: 1 }).toArray();
    console.log("users:", allUsers.length);

    // UPDATE.
    await users.updateOne({ _id: 100 }, { $set: { country: "SG" } });

    // AGGREGATION (server side).
    const revenue = await orders.aggregate(logic.buildRevenuePipeline()).toArray();
    console.log("revenue by user:", revenue);

    // AGGREGATION (client side, pure logic, DB-free helpers).
    const localOrders = await orders.find({}).toArray();
    console.log("revenue (local):", logic.revenueByUser(localOrders));
    console.log("orders by status:", logic.ordersByStatus(localOrders));
    console.log("top products:", logic.topProducts(localOrders, 3));
    console.log("enriched first order:", logic.enrichOrder(localOrders[0]));

    // DELETE (cleanup of the lab user).
    await users.deleteOne({ _id: 100 });
    console.log("done");
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  main().catch(function onError(err) {
    console.error(err);
    process.exitCode = 1;
  });
}

module.exports = { main: main };
