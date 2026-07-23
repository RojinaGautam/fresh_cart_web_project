import request from "supertest";
import app from "../../src/app";
import { createTestUser, authHeader } from "../helpers";

describe("PATCH /api/v1/auth/update", () => {
  it("rejects profile updates without authentication", async () => {
    const response = await request(app)
      .patch("/api/v1/auth/update")
      .send({ fullName: "New Name" });

    expect(response.status).toBe(401);
  });

  it("updates fullName and phoneNumber", async () => {
    const { token } = await createTestUser();

    const response = await request(app)
      .patch("/api/v1/auth/update")
      .set("Authorization", authHeader(token))
      .send({ fullName: "Updated Name", phoneNumber: "9811111111" });

    expect(response.status).toBe(200);
    expect(response.body.data.fullName).toBe("Updated Name");
    expect(response.body.data.phoneNumber).toBe("9811111111");
  });

  it("adds a new address when no id is provided", async () => {
    const { token } = await createTestUser();

    const response = await request(app)
      .patch("/api/v1/auth/update")
      .set("Authorization", authHeader(token))
      .send({
        addresses: [{ label: "Home", street: "123 Main St", city: "Springfield" }],
      });

    expect(response.status).toBe(200);
    expect(response.body.data.addresses).toHaveLength(1);
    expect(response.body.data.addresses[0]).toMatchObject({
      label: "Home",
      street: "123 Main St",
      city: "Springfield",
    });
    expect(response.body.data.addresses[0].id).toEqual(expect.any(String));
  });

  it("updates an existing address in place when its id is provided", async () => {
    const { token } = await createTestUser();

    const firstResponse = await request(app)
      .patch("/api/v1/auth/update")
      .set("Authorization", authHeader(token))
      .send({
        addresses: [{ label: "Home", street: "123 Main St", city: "Springfield" }],
      });

    const existingId = firstResponse.body.data.addresses[0].id;

    const secondResponse = await request(app)
      .patch("/api/v1/auth/update")
      .set("Authorization", authHeader(token))
      .send({
        addresses: [
          { id: existingId, label: "Work", street: "456 Office Rd", city: "Metropolis" },
        ],
      });

    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body.data.addresses).toHaveLength(1);
    expect(secondResponse.body.data.addresses[0]).toMatchObject({
      id: existingId,
      label: "Work",
      street: "456 Office Rd",
      city: "Metropolis",
    });
  });
});

describe("PATCH /api/v1/auth/update-password", () => {
  it("rejects an incorrect current password", async () => {
    const { token } = await createTestUser({ password: "Test1234" });

    const response = await request(app)
      .patch("/api/v1/auth/update-password")
      .set("Authorization", authHeader(token))
      .send({ currentPassword: "WrongPassword1", newPassword: "NewPassword1" });

    expect(response.status).toBe(400);
  });

  it("updates the password and allows login with the new password only", async () => {
    const { token, user } = await createTestUser({ password: "Test1234" });

    const response = await request(app)
      .patch("/api/v1/auth/update-password")
      .set("Authorization", authHeader(token))
      .send({ currentPassword: "Test1234", newPassword: "NewPassword1" });

    expect(response.status).toBe(200);

    const oldLoginResponse = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: "Test1234",
    });
    expect(oldLoginResponse.status).toBe(400);

    const newLoginResponse = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: "NewPassword1",
    });
    expect(newLoginResponse.status).toBe(200);
  });
});
