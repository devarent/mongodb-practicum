"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const logic = require("../src/lib/logic");

const sampleOrders = [
  { userId: 1, status: "completed", amount: 100, items: [{ sku: "A", qty: 2, price: 30 }, { sku: "B", qty: 1, price: 40 }] },
  { userId: 2, status: "completed", amount: 250, items: [{ sku: "A", qty: 1, price: 250 }] },
  { userId: 1, status: "cancelled", amount: 500, items: [{ sku: "C", qty: 1, price: 500 }] },
  { userId: 3, status: "pending", amount: 50, items: [{ sku: "B", qty: 1, price: 50 }] }
];

test("isValidUser accepts a well formed user", function () {
  assert.equal(logic.isValidUser({ name: "Alya", email: "alya@example.test" }), true);
});

test("isValidUser rejects bad email and empty name", function () {
  assert.equal(logic.isValidUser({ name: "Alya", email: "bad-email" }), false);
  assert.equal(logic.isValidUser({ name: "", email: "a@example.test" }), false);
  assert.equal(logic.isValidUser(null), false);
});

test("isValidOrder validates amount, items and status", function () {
  assert.equal(logic.isValidOrder({ amount: 10, items: [], status: "paid" }), true);
  assert.equal(logic.isValidOrder({ amount: -1, items: [], status: "paid" }), false);
  assert.equal(logic.isValidOrder({ amount: 10, items: [], status: "unknown" }), false);
});

test("lineTotal and enrichOrder compute item totals", function () {
  assert.equal(logic.lineTotal({ qty: 2, price: 30 }), 60);
  const enriched = logic.enrichOrder(sampleOrders[0]);
  assert.equal(enriched.items[0].lineTotal, 60);
  assert.equal(enriched.computedTotal, 100);
});

test("revenueByUser ignores cancelled orders and sorts by revenue", function () {
  assert.deepEqual(logic.revenueByUser(sampleOrders), [
    { userId: 2, revenue: 250 },
    { userId: 1, revenue: 100 },
    { userId: 3, revenue: 50 }
  ]);
});

test("ordersByStatus counts every status", function () {
  assert.deepEqual(logic.ordersByStatus(sampleOrders), {
    completed: 2,
    cancelled: 1,
    pending: 1
  });
});

test("topProducts sums units and respects the limit", function () {
  assert.deepEqual(logic.topProducts(sampleOrders, 2), [
    { sku: "A", units: 3 },
    { sku: "B", units: 2 }
  ]);
});

test("buildRevenuePipeline has the expected stages", function () {
  const pipeline = logic.buildRevenuePipeline();
  assert.equal(pipeline.length, 4);
  assert.ok(pipeline[0].$match);
  assert.ok(pipeline[1].$group);
  assert.ok(pipeline[2].$sort);
  assert.ok(pipeline[3].$project);
  assert.equal(pipeline[0].$match.status.$ne, "cancelled");
});

test("buildIndexSpecs includes a unique email index", function () {
  const specs = logic.buildIndexSpecs();
  const emailIndex = specs.find(function (s) { return s.keys.email === 1; });
  assert.ok(emailIndex);
  assert.equal(emailIndex.unique, true);
  assert.equal(emailIndex.collection, "users");
});

test("seed script declares both collections and inserts data", function () {
  const seedPath = path.join(__dirname, "..", "db", "init", "seed.js");
  const source = fs.readFileSync(seedPath, "utf8");
  assert.match(source, /users/);
  assert.match(source, /orders/);
  assert.match(source, /insertMany/);
  assert.match(source, /getSiblingDB\("practicum"\)/);
});

test("client script uses CRUD and aggregation calls", function () {
  const srcPath = path.join(__dirname, "..", "src", "index.js");
  const source = fs.readFileSync(srcPath, "utf8");
  assert.match(source, /insert|updateOne/);
  assert.match(source, /deleteOne/);
  assert.match(source, /\.aggregate\(/);
  assert.match(source, /createIndex/);
});
