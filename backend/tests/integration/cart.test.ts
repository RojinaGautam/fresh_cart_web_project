import request from "supertest";
import app from "../../src/app";
import { createTestUser, authHeader } from "../helpers";
import { CategoryModel } from "../../src/models/category.model";
import { ProductModel } from "../../src/models/product.model";

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

describe("Cart routes", () => {
  it("rejects all cart routes without authentication", async () => {
    const response = await request(app).get("/api/v1/cart");
    expect(response.status).toBe(401);
  });

  it("returns an empty cart for a new user", async () => {
    const { token } = await createTestUser();

    const response = await request(app)
      .get("/api/v1/cart")
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.items).toEqual([]);
    expect(response.body.data.subtotal).toBe(0);
  });

  it("adds an item to the cart", async () => {
    const { token } = await createTestUser();
    const product = await makeProduct();

    const response = await request(app)
      .post("/api/v1/cart/items")
      .set("Authorization", authHeader(token))
      .send({ productId: product._id.toString(), quantity: 2 });

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0].quantity).toBe(2);
    expect(response.body.data.subtotal).toBe(5);
  });

  it("increments quantity when adding an item already in the cart", async () => {
    const { token } = await createTestUser();
    const product = await makeProduct();

    await request(app)
      .post("/api/v1/cart/items")
      .set("Authorization", authHeader(token))
      .send({ productId: product._id.toString(), quantity: 1 });

    const response = await request(app)
      .post("/api/v1/cart/items")
      .set("Authorization", authHeader(token))
      .send({ productId: product._id.toString(), quantity: 3 });

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0].quantity).toBe(4);
  });

  it("rejects adding a non-existent product", async () => {
    const { token } = await createTestUser();

    const response = await request(app)
      .post("/api/v1/cart/items")
      .set("Authorization", authHeader(token))
      .send({ productId: "64b7f7f7f7f7f7f7f7f7f7f7", quantity: 1 });

    expect(response.status).toBe(404);
  });

  it("updates the quantity of an item already in the cart", async () => {
    const { token } = await createTestUser();
    const product = await makeProduct();

    await request(app)
      .post("/api/v1/cart/items")
      .set("Authorization", authHeader(token))
      .send({ productId: product._id.toString(), quantity: 1 });

    const response = await request(app)
      .patch(`/api/v1/cart/items/${product._id.toString()}`)
      .set("Authorization", authHeader(token))
      .send({ quantity: 5 });

    expect(response.status).toBe(200);
    expect(response.body.data.items[0].quantity).toBe(5);
  });

  it("returns 404 updating quantity for an item not in the cart", async () => {
    const { token } = await createTestUser();
    const product = await makeProduct();

    const response = await request(app)
      .patch(`/api/v1/cart/items/${product._id.toString()}`)
      .set("Authorization", authHeader(token))
      .send({ quantity: 5 });

    expect(response.status).toBe(404);
  });

  it("removes an item from the cart", async () => {
    const { token } = await createTestUser();
    const product = await makeProduct();

    await request(app)
      .post("/api/v1/cart/items")
      .set("Authorization", authHeader(token))
      .send({ productId: product._id.toString(), quantity: 1 });

    const response = await request(app)
      .delete(`/api/v1/cart/items/${product._id.toString()}`)
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.items).toEqual([]);
  });

  it("clears the cart, including when it is already empty", async () => {
    const { token } = await createTestUser();

    const response = await request(app)
      .delete("/api/v1/cart")
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.items).toEqual([]);
  });
});
