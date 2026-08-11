import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import app from "../dist/app.js";
import prisma from "../dist/lib/prisma.js";

const runId = `${Date.now()}-${randomUUID().slice(0, 8)}`;
const password = "SecureTest123!";
const testEmails = [
  `security-admin-${runId}@example.com`,
  `security-user-a-${runId}@example.com`,
  `security-user-b-${runId}@example.com`,
  `security-delete-${runId}@example.com`,
  `security-register-${runId}@example.com`,
];
const categoryName = `Security Category ${runId}`;
const inactiveCategoryName = `Inactive Category ${runId}`;
const productName = `Security Product ${runId}`;
const inactiveProductName = `Inactive Product ${runId}`;
const results = [];
let server;

const record = (name) => {
  results.push(name);
  console.log(`PASS ${name}`);
};

const containsPassword = (value) => {
  if (Array.isArray(value)) {
    return value.some(containsPassword);
  }

  if (value && typeof value === "object") {
    return Object.entries(value).some(
      ([key, nestedValue]) => key === "password" || containsPassword(nestedValue)
    );
  }

  return false;
};

const cleanup = async () => {
  const users = await prisma.user.findMany({
    where: { email: { in: testEmails } },
    select: { id: true },
  });
  const userIds = users.map(({ id }) => id);
  const categories = await prisma.category.findMany({
    where: { name: { in: [categoryName, inactiveCategoryName] } },
    select: { id: true },
  });
  const categoryIds = categories.map(({ id }) => id);
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { in: [productName, inactiveProductName] } },
        { categoryId: { in: categoryIds } },
      ],
    },
    select: { id: true },
  });
  const productIds = products.map(({ id }) => id);
  const orders = await prisma.order.findMany({
    where: { userId: { in: userIds } },
    select: { id: true },
  });
  const orderIds = orders.map(({ id }) => id);

  await prisma.$transaction([
    prisma.orderItem.deleteMany({
      where: {
        OR: [
          { orderId: { in: orderIds } },
          { productId: { in: productIds } },
        ],
      },
    }),
    prisma.review.deleteMany({
      where: {
        OR: [
          { userId: { in: userIds } },
          { productId: { in: productIds } },
        ],
      },
    }),
    prisma.order.deleteMany({ where: { id: { in: orderIds } } }),
    prisma.product.deleteMany({ where: { id: { in: productIds } } }),
    prisma.category.deleteMany({ where: { id: { in: categoryIds } } }),
    prisma.user.deleteMany({ where: { id: { in: userIds } } }),
  ]);
};

const startServer = async () => {
  await new Promise((resolve, reject) => {
    server = app.listen(0, "127.0.0.1", resolve);
    server.once("error", reject);
  });

  const address = server.address();
  assert(address && typeof address !== "string");
  return `http://127.0.0.1:${address.port}`;
};

const main = async () => {
  assert(process.env.JWT_SECRET, "JWT_SECRET is required for security tests");
  await cleanup();

  const hashedPassword = await bcrypt.hash(password, 10);
  const [admin, userA, userB] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Security Admin",
        email: testEmails[0],
        password: hashedPassword,
        role: "ADMIN",
      },
    }),
    prisma.user.create({
      data: {
        name: "Security User A",
        email: testEmails[1],
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: "Security User B",
        email: testEmails[2],
        password: hashedPassword,
      },
    }),
  ]);

  const baseUrl = await startServer();

  const request = async (path, options = {}) => {
    const headers = { ...options.headers };

    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
    });
    const contentType = response.headers.get("content-type") ?? "";
    assert.match(contentType, /application\/json/i, `${path} did not return JSON`);
    const body = await response.json();
    assert.equal(containsPassword(body), false, `${path} exposed a password field`);
    return { status: response.status, body };
  };

  const login = async (email, suppliedPassword = password) =>
    request("/api/auth/login", {
      method: "POST",
      body: { email, password: suppliedPassword },
    });

  const adminLogin = await login(admin.email);
  assert.equal(adminLogin.status, 200);
  const adminToken = adminLogin.body.data.token;
  record("correct ADMIN login returns a safe response");

  const userALogin = await login(userA.email);
  const userBLogin = await login(userB.email);
  assert.equal(userALogin.status, 200);
  assert.equal(userBLogin.status, 200);
  const userAToken = userALogin.body.data.token;
  const userBToken = userBLogin.body.data.token;
  record("correct USER login returns tokens without password hashes");

  const registration = await request("/api/auth/register", {
    method: "POST",
    body: {
      name: "Registered User",
      email: testEmails[4],
      password,
    },
  });
  assert.equal(registration.status, 201);
  assert.equal(registration.body.data.user.role, "USER");
  assert.equal(
    (
      await request("/api/orders", {
        headers: {
          Authorization: `Bearer ${registration.body.data.token}`,
        },
      })
    ).status,
    200
  );
  assert.equal(
    (
      await request("/api/auth/register", {
        method: "POST",
        body: {
          name: "Unauthorized Admin",
          email: `role-${runId}@example.com`,
          password,
          role: "ADMIN",
        },
      })
    ).status,
    400
  );
  assert.equal(
    (
      await request("/api/auth/register", {
        method: "POST",
        body: {
          name: "Duplicate User",
          email: testEmails[4],
          password,
        },
      })
    ).status,
    409
  );
  record("public registration creates USER sessions and rejects role assignment");

  assert.equal((await login(userA.email, "WrongPassword123!")).status, 401);
  assert.equal((await login(`missing-${runId}@example.com`)).status, 401);
  record("incorrect password and nonexistent email return 401");

  assert.equal((await request("/api/orders")).status, 401);
  assert.equal(
    (await request("/api/orders", { headers: { Authorization: "bad-token" } })).status,
    401
  );
  assert.equal(
    (
      await request("/api/orders", {
        headers: { Authorization: "Bearer malformed.token" },
      })
    ).status,
    401
  );
  const expiredToken = jwt.sign(
    { id: userA.id, role: "USER" },
    process.env.JWT_SECRET,
    { expiresIn: -1 }
  );
  assert.equal(
    (
      await request("/api/orders", {
        headers: { Authorization: `Bearer ${expiredToken}` },
      })
    ).status,
    401
  );
  record("missing, malformed, invalid, and expired tokens return JSON 401");

  assert.equal(
    (
      await request("/api/users", {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
    ).status,
    200
  );
  assert.equal(
    (
      await request("/api/users", {
        headers: { Authorization: `Bearer ${userAToken}` },
      })
    ).status,
    403
  );
  record("ADMIN can access User management and USER receives 403");

  const createDeletedUser = await request("/api/users", {
    method: "POST",
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: "Security Deleted User",
      email: testEmails[3],
      password,
    },
  });
  assert.equal(createDeletedUser.status, 200);
  const deletedUserLogin = await login(testEmails[3]);
  assert.equal(deletedUserLogin.status, 200);
  assert.equal(
    (
      await request(`/api/users/${createDeletedUser.body.data.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      })
    ).status,
    200
  );
  const usersAfterDelete = await request("/api/users", {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.equal(
    usersAfterDelete.body.data.some(
      (user) => user.id === createDeletedUser.body.data.id
    ),
    false
  );
  assert.equal((await login(testEmails[3])).status, 401);
  assert.equal(
    (
      await request("/api/orders", {
        headers: {
          Authorization: `Bearer ${deletedUserLogin.body.data.token}`,
        },
      })
    ).status,
    401
  );
  assert.equal(
    (
      await request(`/api/users/${createDeletedUser.body.data.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { name: "Should Not Change" },
      })
    ).status,
    404
  );
  assert.equal(
    (
      await request(`/api/users/${createDeletedUser.body.data.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      })
    ).status,
    404
  );
  record("soft-deleted Users are excluded and existing tokens are revoked");

  assert.equal(
    (
      await request("/api/categories", {
        method: "POST",
        headers: { Authorization: `Bearer ${userAToken}` },
        body: { name: categoryName },
      })
    ).status,
    403
  );
  const category = await request("/api/categories", {
    method: "POST",
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { name: categoryName },
  });
  assert.equal(category.status, 200);
  assert.equal((await request("/api/categories")).status, 200);
  assert.equal(
    (
      await request(`/api/categories/${category.body.data.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${userAToken}` },
        body: { status: "INACTIVE" },
      })
    ).status,
    403
  );
  assert.equal(
    (
      await request(`/api/categories/${category.body.data.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { status: "ACTIVE" },
      })
    ).status,
    200
  );
  assert.equal(
    (
      await request("/api/categories", {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { name: categoryName },
      })
    ).status,
    409
  );
  record("Category GET, ADMIN writes, USER denial, and duplicate handling work");

  const invalidProduct = await request("/api/products", {
    method: "POST",
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: "Invalid Product",
      price: -1,
      stock: -1,
      categoryId: "not-a-uuid",
    },
  });
  assert.equal(invalidProduct.status, 400);
  record("invalid Product request bodies return JSON 400");

  const malformedJsonResponse = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{",
  });
  assert.equal(malformedJsonResponse.status, 400);
  assert.match(
    malformedJsonResponse.headers.get("content-type") ?? "",
    /application\/json/i
  );
  assert.deepEqual(await malformedJsonResponse.json(), {
    success: false,
    message: "Invalid JSON body",
  });
  record("malformed JSON returns a clean JSON 400 response");

  const foreignKeyProduct = await request("/api/products", {
    method: "POST",
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: `Foreign Key Product ${runId}`,
      price: 10,
      stock: 1,
      categoryId: randomUUID(),
    },
  });
  assert.equal(foreignKeyProduct.status, 409);
  record("invalid foreign keys return JSON 409");

  assert.equal(
    (
      await request("/api/products", {
        method: "POST",
        headers: { Authorization: `Bearer ${userAToken}` },
        body: {
          name: productName,
          price: 12.5,
          stock: 3,
          categoryId: category.body.data.id,
        },
      })
    ).status,
    403
  );
  const product = await request("/api/products", {
    method: "POST",
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: productName,
      price: 12.5,
      stock: 3,
      categoryId: category.body.data.id,
    },
  });
  assert.equal(product.status, 200);
  assert.equal((await request("/api/products")).status, 200);
  assert.equal(
    (
      await request(`/api/products/${product.body.data.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { stock: 3 },
      })
    ).status,
    200
  );
  assert.equal(
    (
      await request(`/api/products/${product.body.data.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${userAToken}` },
        body: { stock: 4 },
      })
    ).status,
    403
  );
  assert.equal(
    (
      await request(`/api/products/${product.body.data.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userAToken}` },
      })
    ).status,
    403
  );
  record("Product GET and role-protected writes work");

  const inactiveProduct = await request("/api/products", {
    method: "POST",
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: inactiveProductName,
      price: 5,
      stock: 2,
      status: "INACTIVE",
      categoryId: category.body.data.id,
    },
  });
  assert.equal(inactiveProduct.status, 200);
  assert.equal(
    (
      await request("/api/orders", {
        method: "POST",
        headers: { Authorization: `Bearer ${userAToken}` },
        body: {
          items: [{ productId: inactiveProduct.body.data.id, quantity: 1 }],
        },
      })
    ).status,
    400
  );
  record("inactive Products cannot be ordered");

  const untrustedOrder = await request("/api/orders", {
    method: "POST",
    headers: { Authorization: `Bearer ${userAToken}` },
    body: {
      userId: userB.id,
      totalPrice: 0.01,
      items: [
        { productId: product.body.data.id, quantity: 2, price: 0.01 },
      ],
    },
  });
  assert.equal(untrustedOrder.status, 400);
  const orderCountBefore = await prisma.order.count({
    where: { userId: userA.id },
  });
  const order = await request("/api/orders", {
    method: "POST",
    headers: { Authorization: `Bearer ${userAToken}` },
    body: {
      items: [{ productId: product.body.data.id, quantity: 2 }],
    },
  });
  assert.equal(order.status, 200);
  assert.equal(order.body.data.userId, userA.id);
  assert.equal(order.body.data.totalPrice, 25);
  assert.equal(order.body.data.orderItems[0].price, 12.5);
  assert.equal(
    (await prisma.product.findUniqueOrThrow({ where: { id: product.body.data.id } }))
      .stock,
    1
  );
  record("Order identity/prices are trusted server-side and stock is reduced");

  assert.equal(
    (
      await request(`/api/orders/${order.body.data.id}`, {
        headers: { Authorization: `Bearer ${userBToken}` },
      })
    ).status,
    404
  );
  assert.equal(
    (
      await request(`/api/orders/${order.body.data.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${userBToken}` },
        body: { status: "CANCELLED" },
      })
    ).status,
    404
  );
  assert.equal(
    (
      await request(`/api/orders/${order.body.data.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userBToken}` },
      })
    ).status,
    404
  );
  assert.equal(
    (
      await request(`/api/orders/${randomUUID()}`, {
        headers: { Authorization: `Bearer ${userAToken}` },
      })
    ).status,
    404
  );
  assert.equal(
    (
      await request(`/api/orders/${order.body.data.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${userAToken}` },
        body: { status: "CONFIRMED" },
      })
    ).status,
    200
  );
  assert.equal(
    (
      await request(`/api/orders/${order.body.data.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${userAToken}` },
        body: { totalPrice: 0.01 },
      })
    ).status,
    400
  );
  record("Order ownership and fake-ID responses are protected with 404");

  const insufficientOrder = await request("/api/orders", {
    method: "POST",
    headers: { Authorization: `Bearer ${userAToken}` },
    body: {
      items: [{ productId: product.body.data.id, quantity: 2 }],
    },
  });
  assert.equal(insufficientOrder.status, 409);
  assert.equal(
    (await prisma.product.findUniqueOrThrow({ where: { id: product.body.data.id } }))
      .stock,
    1
  );
  assert.equal(
    await prisma.order.count({ where: { userId: userA.id } }),
    orderCountBefore + 1
  );
  record("insufficient stock cannot become negative and transaction rolls back");

  const concurrentOrders = await Promise.all([
    request("/api/orders", {
      method: "POST",
      headers: { Authorization: `Bearer ${userAToken}` },
      body: {
        items: [{ productId: product.body.data.id, quantity: 1 }],
      },
    }),
    request("/api/orders", {
      method: "POST",
      headers: { Authorization: `Bearer ${userBToken}` },
      body: {
        items: [{ productId: product.body.data.id, quantity: 1 }],
      },
    }),
  ]);
  assert.deepEqual(
    concurrentOrders.map(({ status }) => status).sort(),
    [200, 409]
  );
  assert.equal(
    (await prisma.product.findUniqueOrThrow({ where: { id: product.body.data.id } }))
      .stock,
    0
  );
  record("concurrent Orders cannot oversell the final stock item");

  assert.equal(
    (
      await request(`/api/orders/${order.body.data.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userAToken}` },
      })
    ).status,
    200
  );
  assert.equal(
    (
      await request(`/api/orders/${order.body.data.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${userAToken}` },
        body: { status: "CANCELLED" },
      })
    ).status,
    404
  );
  record("deleted Orders cannot be modified");

  const untrustedReview = await request("/api/reviews", {
    method: "POST",
    headers: { Authorization: `Bearer ${userAToken}` },
    body: {
      rating: 5,
      productId: product.body.data.id,
      userId: userB.id,
    },
  });
  assert.equal(untrustedReview.status, 400);
  const review = await request("/api/reviews", {
    method: "POST",
    headers: { Authorization: `Bearer ${userAToken}` },
    body: { rating: 5, productId: product.body.data.id },
  });
  assert.equal(review.status, 200);
  assert.equal(review.body.data.userId, userA.id);
  assert.equal(
    (
      await request(`/api/reviews/${review.body.data.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${userAToken}` },
        body: { rating: 4 },
      })
    ).status,
    200
  );
  assert.equal(
    (
      await request(`/api/reviews/${review.body.data.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${userBToken}` },
        body: { rating: 1 },
      })
    ).status,
    403
  );
  assert.equal(
    (
      await request(`/api/reviews/${review.body.data.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { rating: 4 },
      })
    ).status,
    200
  );
  assert.equal(
    (
      await request(`/api/reviews/${review.body.data.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      })
    ).status,
    200
  );
  assert.equal((await request(`/api/reviews/${review.body.data.id}`)).status, 404);
  const ownerDeletedReview = await request("/api/reviews", {
    method: "POST",
    headers: { Authorization: `Bearer ${userAToken}` },
    body: { rating: 5, productId: product.body.data.id },
  });
  assert.equal(ownerDeletedReview.status, 200);
  assert.equal(
    (
      await request(`/api/reviews/${ownerDeletedReview.body.data.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userAToken}` },
      })
    ).status,
    200
  );
  record("Review ownership, ADMIN moderation, soft delete, and safe relations work");

  assert.equal(
    (
      await request(`/api/products/${product.body.data.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      })
    ).status,
    200
  );
  assert.equal((await request(`/api/products/${product.body.data.id}`)).status, 404);
  assert.equal(
    (
      await request("/api/orders", {
        method: "POST",
        headers: { Authorization: `Bearer ${userAToken}` },
        body: {
          items: [{ productId: product.body.data.id, quantity: 1 }],
        },
      })
    ).status,
    404
  );
  record("soft-deleted Products are hidden and cannot be ordered");

  assert.equal(
    (
      await request(`/api/categories/${category.body.data.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userAToken}` },
      })
    ).status,
    403
  );
  assert.equal(
    (
      await request(`/api/categories/${category.body.data.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      })
    ).status,
    200
  );
  assert.equal((await request(`/api/categories/${category.body.data.id}`)).status, 404);
  record("Category soft delete and role permissions work");

  assert.equal((await request("/route-that-does-not-exist")).status, 404);
  record("unknown routes and tested errors always return JSON without passwords");

  console.log(`\n${results.length} security test groups passed.`);
};

try {
  await main();
} finally {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await cleanup();
  await prisma.$disconnect();
}
