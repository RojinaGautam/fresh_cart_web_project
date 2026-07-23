import request from "supertest";
import app from "../../src/app";
import { createTestUser, authHeader } from "../helpers";

describe("Admin user routes", () => {
  it("rejects listing without a token", async () => {
    const response = await request(app).get("/api/v1/admin/users");
    expect(response.status).toBe(401);
  });

  it("rejects listing for a non-admin user", async () => {
    const { token } = await createTestUser();

    const response = await request(app)
      .get("/api/v1/admin/users")
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(403);
  });

  it("lists users for an admin", async () => {
    const { token } = await createTestUser({ role: "admin" });
    await createTestUser();

    const response = await request(app)
      .get("/api/v1/admin/users")
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it("fetches a single user by id", async () => {
    const { token } = await createTestUser({ role: "admin" });
    const { user } = await createTestUser();

    const response = await request(app)
      .get(`/api/v1/admin/users/${user._id.toString()}`)
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe(user.email);
  });

  it("returns 400 for a malformed user id", async () => {
    const { token } = await createTestUser({ role: "admin" });

    const response = await request(app)
      .get("/api/v1/admin/users/not-a-valid-id")
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(400);
  });

  it("creates a pre-verified user", async () => {
    const { token } = await createTestUser({ role: "admin" });

    const response = await request(app)
      .post("/api/v1/admin/users")
      .set("Authorization", authHeader(token))
      .send({
        fullName: "New Employee",
        email: "employee@freshcart.test",
        phoneNumber: "9822222222",
        password: "Password1",
        role: "user",
      });

    expect(response.status).toBe(201);
    expect(response.body.data.isVerified).toBe(true);
  });

  it("rejects creating a user with a duplicate email", async () => {
    const { token } = await createTestUser({ role: "admin" });
    const { user } = await createTestUser();

    const response = await request(app)
      .post("/api/v1/admin/users")
      .set("Authorization", authHeader(token))
      .send({
        fullName: "Duplicate",
        email: user.email,
        phoneNumber: "9822222222",
        password: "Password1",
      });

    expect(response.status).toBe(400);
  });

  it("updates a user's details", async () => {
    const { token } = await createTestUser({ role: "admin" });
    const { user } = await createTestUser();

    const response = await request(app)
      .patch(`/api/v1/admin/users/${user._id.toString()}`)
      .set("Authorization", authHeader(token))
      .send({ fullName: "Renamed User" });

    expect(response.status).toBe(200);
    expect(response.body.data.fullName).toBe("Renamed User");
  });

  it("deletes a user and 404s afterward", async () => {
    const { token } = await createTestUser({ role: "admin" });
    const { user } = await createTestUser();
    const id = user._id.toString();

    const deleteResponse = await request(app)
      .delete(`/api/v1/admin/users/${id}`)
      .set("Authorization", authHeader(token));

    expect(deleteResponse.status).toBe(200);

    const getResponse = await request(app)
      .get(`/api/v1/admin/users/${id}`)
      .set("Authorization", authHeader(token));

    expect(getResponse.status).toBe(404);
  });
});
