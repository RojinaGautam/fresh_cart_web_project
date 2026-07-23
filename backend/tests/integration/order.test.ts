import request from "supertest";
import app from "../../src/app";
import { createTestUser, authHeader } from "../helpers";
import { CategoryModel } from "../../src/models/category.model";
import { ProductModel } from "../../src/models/product.model";
import * as mailer from "../../src/uttils/mailer.util";

jest.mock("../../src/uttils/mailer.util");

const makeProduct = async (overrides: Partial<Record<string, unknown>> = {}) => {
  const category = await CategoryModel.create({
    title: "Fruits",
    slug: "fruits",
    image: "fruits.png",
    description: "Fresh fruits",
    isActive: true,
  });

  return ProductModel.create({
    name: "Red Apple",
    slug: "red-apple",
    category: category._id,
    price: 2.5,
    image: "apple.png",
    isActive: true,
    ...overrides,
  });
};

const toDateString = (date: Date) => date.toISOString().slice(0, 10);

const validOrderPayload = () => ({
  shippingAddress: "123 Main St, Springfield",
  paymentMethod: "Cash on delivery",
  deliveryDate: toDateString(new Date()),
  deliveryTimeSlot: "09:00-11:00",
});

const addToCart = async (token: string, productId: string, quantity = 1) =>
  request(app)
    .post("/api/v1/cart/items")
    .set("Authorization", authHeader(token))
    .send({ productId, quantity });

describe("POST /api/v1/orders", () => {
  it("rejects order creation without authentication", async () => {
    const response = await request(app)
      .post("/api/v1/orders")
      .send(validOrderPayload());

    expect(response.status).toBe(401);
  });

  it("rejects order creation with an empty cart", async () => {
    const { token } = await createTestUser();

    const response = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", authHeader(token))
      .send(validOrderPayload());

    expect(response.status).toBe(400);
  });

  it("rejects order creation with a past delivery date", async () => {
    const { token } = await createTestUser();
    const product = await makeProduct();
    await addToCart(token, product._id.toString());

    const past = new Date();
    past.setDate(past.getDate() - 2);

    const response = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", authHeader(token))
      .send({ ...validOrderPayload(), deliveryDate: toDateString(past) });

    expect(response.status).toBe(400);
  });

  it("creates an order from the cart, clears the cart, and sends a confirmation email", async () => {
    const { token } = await createTestUser();
    const product = await makeProduct();
    await addToCart(token, product._id.toString(), 2);

    const response = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", authHeader(token))
      .send(validOrderPayload());

    expect(response.status).toBe(201);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.subtotal).toBe(5);
    expect(response.body.data.status).toBe("pending");
    expect(mailer.sendOrderConfirmationEmail).toHaveBeenCalledTimes(1);

    const cartResponse = await request(app)
      .get("/api/v1/cart")
      .set("Authorization", authHeader(token));

    expect(cartResponse.body.data.items).toEqual([]);
  });
});

describe("GET /api/v1/orders", () => {
  it("lists only the authenticated user's orders", async () => {
    const { token } = await createTestUser();
    const { token: otherToken } = await createTestUser();
    const product = await makeProduct();

    await addToCart(token, product._id.toString());
    await request(app)
      .post("/api/v1/orders")
      .set("Authorization", authHeader(token))
      .send(validOrderPayload());

    await addToCart(otherToken, product._id.toString());
    await request(app)
      .post("/api/v1/orders")
      .set("Authorization", authHeader(otherToken))
      .send(validOrderPayload());

    const response = await request(app)
      .get("/api/v1/orders")
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });
});

describe("GET /api/v1/orders/:id", () => {
  it("returns the order for its owner", async () => {
    const { token } = await createTestUser();
    const product = await makeProduct();
    await addToCart(token, product._id.toString());

    const createResponse = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", authHeader(token))
      .send(validOrderPayload());

    const orderId = createResponse.body.data.id;

    const response = await request(app)
      .get(`/api/v1/orders/${orderId}`)
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(orderId);
  });

  it("returns 404 when fetching another user's order", async () => {
    const { token } = await createTestUser();
    const { token: otherToken } = await createTestUser();
    const product = await makeProduct();
    await addToCart(token, product._id.toString());

    const createResponse = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", authHeader(token))
      .send(validOrderPayload());

    const orderId = createResponse.body.data.id;

    const response = await request(app)
      .get(`/api/v1/orders/${orderId}`)
      .set("Authorization", authHeader(otherToken));

    expect(response.status).toBe(404);
  });

  it("returns 400 for a malformed order id", async () => {
    const { token } = await createTestUser();

    const response = await request(app)
      .get("/api/v1/orders/not-a-valid-id")
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(400);
  });
});

describe("Admin order routes", () => {
  it("rejects listing without a token", async () => {
    const response = await request(app).get("/api/v1/admin/orders");
    expect(response.status).toBe(401);
  });

  it("rejects listing for a non-admin user", async () => {
    const { token } = await createTestUser();

    const response = await request(app)
      .get("/api/v1/admin/orders")
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(403);
  });

  it("lists all orders across users for an admin", async () => {
    const { token: adminToken } = await createTestUser({ role: "admin" });
    const { token: userToken } = await createTestUser();
    const product = await makeProduct();
    await addToCart(userToken, product._id.toString());
    await request(app)
      .post("/api/v1/orders")
      .set("Authorization", authHeader(userToken))
      .send(validOrderPayload());

    const response = await request(app)
      .get("/api/v1/admin/orders")
      .set("Authorization", authHeader(adminToken));

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it("updates order status and sends a status email for out_for_delivery", async () => {
    const { token: adminToken } = await createTestUser({ role: "admin" });
    const { token: userToken } = await createTestUser();
    const product = await makeProduct();
    await addToCart(userToken, product._id.toString());
    const createResponse = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", authHeader(userToken))
      .send(validOrderPayload());

    const orderId = createResponse.body.data.id;

    const response = await request(app)
      .patch(`/api/v1/admin/orders/${orderId}/status`)
      .set("Authorization", authHeader(adminToken))
      .send({ status: "out_for_delivery" });

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("out_for_delivery");
    expect(mailer.sendOrderStatusEmail).toHaveBeenCalledTimes(1);
  });

  it("rejects an invalid order status", async () => {
    const { token: adminToken } = await createTestUser({ role: "admin" });
    const { token: userToken } = await createTestUser();
    const product = await makeProduct();
    await addToCart(userToken, product._id.toString());
    const createResponse = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", authHeader(userToken))
      .send(validOrderPayload());

    const orderId = createResponse.body.data.id;

    const response = await request(app)
      .patch(`/api/v1/admin/orders/${orderId}/status`)
      .set("Authorization", authHeader(adminToken))
      .send({ status: "teleporting" });

    expect(response.status).toBe(400);
  });
});
