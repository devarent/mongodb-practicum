"use strict";

// Pure functions for the MongoDB practicum.
// No database, network, or environment access in this module.

function isValidUser(user) {
  return Boolean(
    user &&
    typeof user.name === "string" &&
    user.name.length > 0 &&
    typeof user.email === "string" &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(user.email)
  );
}

const VALID_STATUSES = ["pending", "paid", "shipped", "completed", "cancelled"];

function isValidOrder(order) {
  return Boolean(
    order &&
    Number.isFinite(order.amount) &&
    order.amount >= 0 &&
    Array.isArray(order.items) &&
    VALID_STATUSES.includes(order.status)
  );
}

function lineTotal(item) {
  return item.qty * item.price;
}

function enrichOrder(order) {
  const items = (order.items || []).map((item) => ({
    sku: item.sku,
    qty: item.qty,
    price: item.price,
    lineTotal: lineTotal(item)
  }));
  const computedTotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return Object.assign({}, order, { items: items, computedTotal: computedTotal });
}

function revenueByUser(orders) {
  const totals = new Map();
  for (const order of orders) {
    if (order.status === "cancelled") continue;
    totals.set(order.userId, (totals.get(order.userId) || 0) + order.amount);
  }
  return Array.from(totals, function toRow(entry) {
    return { userId: entry[0], revenue: entry[1] };
  }).sort(function byRevenue(a, b) {
    return b.revenue - a.revenue;
  });
}

function ordersByStatus(orders) {
  const counts = {};
  for (const order of orders) {
    counts[order.status] = (counts[order.status] || 0) + 1;
  }
  return counts;
}

function topProducts(orders, limit) {
  const max = limit === undefined ? 3 : limit;
  const units = new Map();
  for (const order of orders) {
    if (order.status === "cancelled") continue;
    for (const item of order.items || []) {
      units.set(item.sku, (units.get(item.sku) || 0) + item.qty);
    }
  }
  return Array.from(units, function toRow(entry) {
    return { sku: entry[0], units: entry[1] };
  }).sort(function byUnits(a, b) {
    return b.units - a.units;
  }).slice(0, max);
}

// Server-side aggregation pipeline used by src/index.js.
function buildRevenuePipeline() {
  return [
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: "$userId", revenue: { $sum: "$amount" }, count: { $sum: 1 } } },
    { $sort: { revenue: -1 } },
    { $project: { _id: 0, userId: "$_id", revenue: 1, count: 1 } }
  ];
}

function buildIndexSpecs() {
  return [
    { collection: "users", keys: { email: 1 }, name: "email_1", unique: true },
    { collection: "orders", keys: { userId: 1 }, name: "userId_1", unique: false },
    { collection: "orders", keys: { status: 1, createdAt: -1 }, name: "status_1_createdAt_-1", unique: false }
  ];
}

module.exports = {
  isValidUser: isValidUser,
  isValidOrder: isValidOrder,
  lineTotal: lineTotal,
  enrichOrder: enrichOrder,
  revenueByUser: revenueByUser,
  ordersByStatus: ordersByStatus,
  topProducts: topProducts,
  buildRevenuePipeline: buildRevenuePipeline,
  buildIndexSpecs: buildIndexSpecs
};
