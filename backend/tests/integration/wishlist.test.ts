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

describe("Wishlist routes", () => {
  it("rejects wishlist routes without authentication", async () => {
    const response = await request(app).get("/api/v1/wishlist");
    expect(response.status).toBe(401);
  });

  it("returns an empty wishlist for a new user", async () => {
    const { token } = await createTestUser();

    const response = await request(app)
      .get("/api/v1/wishlist")
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.items).toEqual([]);
  });

  it("adds a product to the wishlist", async () => {
    const { token } = await createTestUser();
    const product = await makeProduct();

    const response = await request(app)
      .post(`/api/v1/wishlist/${product._id.toString()}`)
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0].product.slug).toBe("red-apple");
  });

  it("does not duplicate a product added twice", async () => {
    const { token } = await createTestUser();
    const product = await makeProduct();

    await request(app)
      .post(`/api/v1/wishlist/${product._id.toString()}`)
      .set("Authorization", authHeader(token));

    const response = await request(app)
      .post(`/api/v1/wishlist/${product._id.toString()}`)
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
  });

  it("rejects adding a non-existent product", async () => {
    const { token } = await createTestUser();

    const response = await request(app)
      .post("/api/v1/wishlist/64b7f7f7f7f7f7f7f7f7f7f7")
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(404);
  });

  it("removes a product from the wishlist", async () => {
    const { token } = await createTestUser();
    const product = await makeProduct();

    await request(app)
      .post(`/api/v1/wishlist/${product._id.toString()}`)
      .set("Authorization", authHeader(token));

    const response = await request(app)
      .delete(`/api/v1/wishlist/${product._id.toString()}`)
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.items).toEqual([]);
  });

  it("rejects removing with an invalid product id", async () => {
    const { token } = await createTestUser();

    const response = await request(app)
      .delete("/api/v1/wishlist/not-a-valid-id")
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(400);
  });
});
