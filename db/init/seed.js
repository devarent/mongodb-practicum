// mongosh seed script.
// Runs on first database init through /docker-entrypoint-initdb.d.
// Creates the "practicum" database with users and orders collections.
const database = db.getSiblingDB("practicum");

const users = [
  { _id: 1, name: "Alya Putri", email: "alya.putri@example.test", country: "ID", createdAt: new Date("2025-01-05T08:00:00Z") },
  { _id: 2, name: "Bima Saputra", email: "bima.saputra@example.test", country: "ID", createdAt: new Date("2025-01-11T09:30:00Z") },
  { _id: 3, name: "Citra Dewi", email: "citra.dewi@example.test", country: "SG", createdAt: new Date("2025-02-02T10:15:00Z") },
  { _id: 4, name: "Dimas Prakoso", email: "dimas.prakoso@example.test", country: "US", createdAt: new Date("2025-02-20T11:00:00Z") },
  { _id: 5, name: "Eka Rahma", email: "eka.rahma@example.test", country: "ID", createdAt: new Date("2025-03-01T07:45:00Z") }
];

const orders = [
  { _id: 101, userId: 1, status: "completed", amount: 150.00, items: [{ sku: "SKU-1", qty: 2, price: 50.00 }, { sku: "SKU-2", qty: 1, price: 50.00 }], createdAt: new Date("2025-03-03T12:00:00Z") },
  { _id: 102, userId: 1, status: "paid", amount: 80.00, items: [{ sku: "SKU-3", qty: 1, price: 80.00 }], createdAt: new Date("2025-03-05T12:00:00Z") },
  { _id: 103, userId: 2, status: "pending", amount: 45.50, items: [{ sku: "SKU-2", qty: 1, price: 45.50 }], createdAt: new Date("2025-03-06T12:00:00Z") },
  { _id: 104, userId: 2, status: "cancelled", amount: 200.00, items: [{ sku: "SKU-9", qty: 1, price: 200.00 }], createdAt: new Date("2025-03-07T12:00:00Z") },
  { _id: 105, userId: 3, status: "shipped", amount: 320.00, items: [{ sku: "SKU-1", qty: 4, price: 60.00 }, { sku: "SKU-4", qty: 2, price: 40.00 }], createdAt: new Date("2025-03-08T12:00:00Z") },
  { _id: 106, userId: 3, status: "completed", amount: 99.00, items: [{ sku: "SKU-5", qty: 1, price: 99.00 }], createdAt: new Date("2025-03-10T12:00:00Z") },
  { _id: 107, userId: 4, status: "completed", amount: 75.25, items: [{ sku: "SKU-3", qty: 1, price: 75.25 }], createdAt: new Date("2025-03-11T12:00:00Z") },
  { _id: 108, userId: 5, status: "pending", amount: 60.00, items: [{ sku: "SKU-2", qty: 2, price: 30.00 }], createdAt: new Date("2025-03-12T12:00:00Z") },
  { _id: 109, userId: 5, status: "completed", amount: 130.00, items: [{ sku: "SKU-1", qty: 1, price: 50.00 }, { sku: "SKU-6", qty: 2, price: 40.00 }], createdAt: new Date("2025-03-13T12:00:00Z") },
  { _id: 110, userId: 1, status: "completed", amount: 25.00, items: [{ sku: "SKU-7", qty: 1, price: 25.00 }], createdAt: new Date("2025-03-14T12:00:00Z") }
];

// Idempotent: safe to run more than once against the same database.
database.users.deleteMany({});
database.orders.deleteMany({});
database.users.insertMany(users);
database.orders.insertMany(orders);

print("Seeded practicum: " + users.length + " users, " + orders.length + " orders");
