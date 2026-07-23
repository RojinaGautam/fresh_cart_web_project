import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import { createTestUser, authHeader } from "../helpers";
import { CategoryModel } from "../../src/models/category.model";
import { ProductModel } from "../../src/models/product.model";

const makeCategory = async (overrides: Partial<Record<string, unknown>> = {}) =>
  CategoryModel.create({
    title: "Fruits",
    slug: "fruits",
    image: "fruits.png",
    description: "Fresh fruits",
    isActive: true,
    ...overrides,
  });

const makeProduct = async (
  categoryId: mongoose.Types.ObjectId,
  overrides: Partial<Record<string, unknown>> = {},
) =>
  ProductModel.create({
    name: "Red Apple",
    slug: "red-apple",
    description: "Crisp and juicy",
    category: categoryId,
    price: 2.5,
    image: "apple.png",
    unit: "1kg",
    isFeatured: false,
    isActive: true,
    ...overrides,
  });

describe("GET /api/v1/products", () => {
  it("lists only active products with pagination meta", async () => {
    const category = await makeCategory();
    await makeProduct(category._id, { name: "Apple", slug: "apple" });
    await makeProduct(category._id, {
      name: "Inactive Banana",
      slug: "inactive-banana",
      isActive: false,
    });

    const response = await request(app).get("/api/v1/products");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].slug).toBe("apple");
    expect(response.body.meta.total).toBe(1);
  });

  it("filters products by category slug", async () => {
    const fruitCategory = await makeCategory();
    const otherCategory = await makeCategory({
      title: "Bakery",
      slug: "bakery",
    });
    await makeProduct(fruitCategory._id, { name: "Apple", slug: "apple" });
    await makeProduct(otherCategory._id, { name: "Bread", slug: "bread" });

    const response = await request(app).get("/api/v1/products?category=bakery");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].slug).toBe("bread");
  });

  it("filters products by search term against name/description/tag", async () => {
    const category = await makeCategory();
    await makeProduct(category._id, { name: "Green Grapes", slug: "green-grapes" });
    await makeProduct(category._id, { name: "Yellow Banana", slug: "yellow-banana" });

    const response = await request(app).get("/api/v1/products?search=grapes");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].slug).toBe("green-grapes");
  });

  it("filters featured products only when featured=true", async () => {
    const category = await makeCategory();
    await makeProduct(category._id, {
      name: "Featured Apple",
      slug: "featured-apple",
      isFeatured: true,
    });
    await makeProduct(category._id, {
      name: "Regular Pear",
      slug: "regular-pear",
      isFeatured: false,
    });

    const response = await request(app).get("/api/v1/products?featured=true");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].slug).toBe("featured-apple");
  });
});

describe("GET /api/v1/products/:slug", () => {
  it("returns a product by slug with populated category", async () => {
    const category = await makeCategory();
    await makeProduct(category._id);

    const response = await request(app).get("/api/v1/products/red-apple");

    expect(response.status).toBe(200);
    expect(response.body.data.slug).toBe("red-apple");
    expect(response.body.data.category).toMatchObject({ slug: "fruits" });
  });

  it("returns 404 for an unknown slug", async () => {
    const response = await request(app).get("/api/v1/products/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("returns 404 for an inactive product", async () => {
    const category = await makeCategory();
    await makeProduct(category._id, { isActive: false });

    const response = await request(app).get("/api/v1/products/red-apple");

    expect(response.status).toBe(404);
  });
});

describe("Admin product routes", () => {
  it("rejects listing without a token", async () => {
    const response = await request(app).get("/api/v1/admin/products");
    expect(response.status).toBe(401);
  });

  it("rejects listing for a non-admin user", async () => {
    const { token } = await createTestUser();

    const response = await request(app)
      .get("/api/v1/admin/products")
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(403);
  });

  it("allows an admin to create a product", async () => {
    const { token } = await createTestUser({ role: "admin" });
    const category = await makeCategory();

    const response = await request(app)
      .post("/api/v1/admin/products")
      .set("Authorization", authHeader(token))
      .send({
        name: "Organic Carrot",
        slug: "organic-carrot",
        category: category._id.toString(),
        price: 1.99,
        image: "carrot.png",
      });

    expect(response.status).toBe(201);
    expect(response.body.data.slug).toBe("organic-carrot");
  });

  it("rejects creating a product with a non-existent category", async () => {
    const { token } = await createTestUser({ role: "admin" });

    const response = await request(app)
      .post("/api/v1/admin/products")
      .set("Authorization", authHeader(token))
      .send({
        name: "Ghost Product",
        slug: "ghost-product",
        category: "64b7f7f7f7f7f7f7f7f7f7f7",
        price: 1,
        image: "ghost.png",
      });

    expect(response.status).toBe(400);
  });

  it("rejects creating a product with a duplicate slug", async () => {
    const { token } = await createTestUser({ role: "admin" });
    const category = await makeCategory();
    await makeProduct(category._id);

    const response = await request(app)
      .post("/api/v1/admin/products")
      .set("Authorization", authHeader(token))
      .send({
        name: "Another Apple",
        slug: "red-apple",
        category: category._id.toString(),
        price: 3,
        image: "apple2.png",
      });

    expect(response.status).toBe(400);
  });

  it("allows an admin to update a product", async () => {
    const { token } = await createTestUser({ role: "admin" });
    const category = await makeCategory();
    const product = await makeProduct(category._id);

    const response = await request(app)
      .patch(`/api/v1/admin/products/${product._id.toString()}`)
      .set("Authorization", authHeader(token))
      .send({ price: 4.99 });

    expect(response.status).toBe(200);
    expect(response.body.data.price).toBe(4.99);
  });

  it("allows an admin to delete a product and 404s afterward", async () => {
    const { token } = await createTestUser({ role: "admin" });
    const category = await makeCategory();
    const product = await makeProduct(category._id);
    const id = product._id.toString();

    const deleteResponse = await request(app)
      .delete(`/api/v1/admin/products/${id}`)
      .set("Authorization", authHeader(token));

    expect(deleteResponse.status).toBe(200);

    const getResponse = await request(app)
      .get(`/api/v1/admin/products/${id}`)
      .set("Authorization", authHeader(token));

    expect(getResponse.status).toBe(404);
  });
});
