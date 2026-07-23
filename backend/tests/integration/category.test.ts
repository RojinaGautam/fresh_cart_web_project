import request from "supertest";
import app from "../../src/app";
import { createTestUser, authHeader } from "../helpers";
import { CategoryModel } from "../../src/models/category.model";

const makeCategory = async (overrides: Partial<Record<string, unknown>> = {}) =>
  CategoryModel.create({
    title: "Fruits",
    slug: "fruits",
    image: "fruits.png",
    description: "Fresh fruits",
    isActive: true,
    ...overrides,
  });

describe("GET /api/v1/categories", () => {
  it("lists only active categories sorted by title", async () => {
    await makeCategory({ title: "Zucchini", slug: "zucchini" });
    await makeCategory({ title: "Apples", slug: "apples" });
    await makeCategory({ title: "Hidden", slug: "hidden", isActive: false });

    const response = await request(app).get("/api/v1/categories");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data.map((c: { slug: string }) => c.slug)).toEqual([
      "apples",
      "zucchini",
    ]);
  });
});

describe("GET /api/v1/categories/:slug", () => {
  it("returns a category by slug", async () => {
    await makeCategory();

    const response = await request(app).get("/api/v1/categories/fruits");

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("Fruits");
  });

  it("returns 404 for an unknown slug", async () => {
    const response = await request(app).get("/api/v1/categories/unknown");
    expect(response.status).toBe(404);
  });

  it("returns 404 for an inactive category", async () => {
    await makeCategory({ isActive: false });

    const response = await request(app).get("/api/v1/categories/fruits");
    expect(response.status).toBe(404);
  });
});

describe("Admin category routes", () => {
  it("rejects listing without a token", async () => {
    const response = await request(app).get("/api/v1/admin/categories");
    expect(response.status).toBe(401);
  });

  it("rejects listing for a non-admin user", async () => {
    const { token } = await createTestUser();

    const response = await request(app)
      .get("/api/v1/admin/categories")
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(403);
  });

  it("allows an admin to create a category", async () => {
    const { token } = await createTestUser({ role: "admin" });

    const response = await request(app)
      .post("/api/v1/admin/categories")
      .set("Authorization", authHeader(token))
      .send({
        title: "Dairy",
        slug: "dairy",
        image: "dairy.png",
        description: "Milk and cheese",
      });

    expect(response.status).toBe(201);
    expect(response.body.data.slug).toBe("dairy");
  });

  it("rejects creating a category with a duplicate slug", async () => {
    const { token } = await createTestUser({ role: "admin" });
    await makeCategory();

    const response = await request(app)
      .post("/api/v1/admin/categories")
      .set("Authorization", authHeader(token))
      .send({
        title: "Fruits Again",
        slug: "fruits",
        image: "fruits2.png",
        description: "Duplicate",
      });

    expect(response.status).toBe(400);
  });

  it("allows an admin to update a category", async () => {
    const { token } = await createTestUser({ role: "admin" });
    const category = await makeCategory();

    const response = await request(app)
      .patch(`/api/v1/admin/categories/${category._id.toString()}`)
      .set("Authorization", authHeader(token))
      .send({ title: "Fresh Fruits" });

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("Fresh Fruits");
  });

  it("allows an admin to delete a category and 404s afterward", async () => {
    const { token } = await createTestUser({ role: "admin" });
    const category = await makeCategory();
    const id = category._id.toString();

    const deleteResponse = await request(app)
      .delete(`/api/v1/admin/categories/${id}`)
      .set("Authorization", authHeader(token));

    expect(deleteResponse.status).toBe(200);

    const getResponse = await request(app)
      .get(`/api/v1/admin/categories/${id}`)
      .set("Authorization", authHeader(token));

    expect(getResponse.status).toBe(404);
  });
});
