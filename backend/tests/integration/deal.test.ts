import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import { createTestUser, authHeader } from "../helpers";
import { CategoryModel } from "../../src/models/category.model";
import { ProductModel } from "../../src/models/product.model";
import { DealModel } from "../../src/models/deal.model";

const makeCategory = async () =>
  CategoryModel.create({
    title: "Fruits",
    slug: "fruits",
    image: "fruits.png",
    description: "Fresh fruits",
    isActive: true,
  });

const makeProduct = async (categoryId: mongoose.Types.ObjectId) =>
  ProductModel.create({
    name: "Red Apple",
    slug: "red-apple",
    category: categoryId,
    price: 2.5,
    image: "apple.png",
    isActive: true,
  });

const makeDeal = async (
  productId: mongoose.Types.ObjectId,
  overrides: Partial<Record<string, unknown>> = {},
) =>
  DealModel.create({
    title: "Apple Bonanza",
    description: "20% off apples",
    product: productId,
    image: "/uploads/deals/apple-bonanza.png",
    discountPercentage: 20,
    badge: "Hot Deal",
    isActive: true,
    ...overrides,
  });

describe("GET /api/v1/deals", () => {
  it("lists only active deals", async () => {
    const category = await makeCategory();
    const product = await makeProduct(category._id);
    await makeDeal(product._id, { title: "Active Deal" });
    await makeDeal(product._id, { title: "Inactive Deal", isActive: false });

    const response = await request(app).get("/api/v1/deals");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe("Active Deal");
    expect(response.body.data[0].product.slug).toBe("red-apple");
  });
});

describe("GET /api/v1/deals/:id", () => {
  it("returns a deal by id", async () => {
    const category = await makeCategory();
    const product = await makeProduct(category._id);
    const deal = await makeDeal(product._id);

    const response = await request(app).get(`/api/v1/deals/${deal._id.toString()}`);

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("Apple Bonanza");
  });

  it("returns 404 for an inactive deal", async () => {
    const category = await makeCategory();
    const product = await makeProduct(category._id);
    const deal = await makeDeal(product._id, { isActive: false });

    const response = await request(app).get(`/api/v1/deals/${deal._id.toString()}`);

    expect(response.status).toBe(404);
  });
});

describe("Admin deal routes", () => {
  it("rejects listing without a token", async () => {
    const response = await request(app).get("/api/v1/admin/deals");
    expect(response.status).toBe(401);
  });

  it("rejects listing for a non-admin user", async () => {
    const { token } = await createTestUser();

    const response = await request(app)
      .get("/api/v1/admin/deals")
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(403);
  });

  it("allows an admin to create a deal for an existing product", async () => {
    const { token } = await createTestUser({ role: "admin" });
    const category = await makeCategory();
    const product = await makeProduct(category._id);

    const response = await request(app)
      .post("/api/v1/admin/deals")
      .set("Authorization", authHeader(token))
      .send({
        title: "Weekend Special",
        description: "Great savings",
        product: product._id.toString(),
        image: "/uploads/deals/weekend-special.png",
        discountPercentage: 15,
        badge: "New",
      });

    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe("Weekend Special");
  });

  it("rejects creating a deal for a non-existent product", async () => {
    const { token } = await createTestUser({ role: "admin" });

    const response = await request(app)
      .post("/api/v1/admin/deals")
      .set("Authorization", authHeader(token))
      .send({
        title: "Ghost Deal",
        description: "N/A",
        product: "64b7f7f7f7f7f7f7f7f7f7f7",
        image: "/uploads/deals/ghost-deal.png",
        discountPercentage: 10,
        badge: "New",
      });

    expect(response.status).toBe(400);
  });

  it("allows an admin to update a deal", async () => {
    const { token } = await createTestUser({ role: "admin" });
    const category = await makeCategory();
    const product = await makeProduct(category._id);
    const deal = await makeDeal(product._id);

    const response = await request(app)
      .patch(`/api/v1/admin/deals/${deal._id.toString()}`)
      .set("Authorization", authHeader(token))
      .send({ discountPercentage: 50 });

    expect(response.status).toBe(200);
    expect(response.body.data.discountPercentage).toBe(50);
  });

  it("allows an admin to delete a deal and 404s afterward", async () => {
    const { token } = await createTestUser({ role: "admin" });
    const category = await makeCategory();
    const product = await makeProduct(category._id);
    const deal = await makeDeal(product._id);
    const id = deal._id.toString();

    const deleteResponse = await request(app)
      .delete(`/api/v1/admin/deals/${id}`)
      .set("Authorization", authHeader(token));

    expect(deleteResponse.status).toBe(200);

    const getResponse = await request(app)
      .get(`/api/v1/admin/deals/${id}`)
      .set("Authorization", authHeader(token));

    expect(getResponse.status).toBe(404);
  });
});
