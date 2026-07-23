import request from "supertest";
import app from "../../src/app";
import { createTestUser, authHeader } from "../helpers";

const validTicketPayload = () => ({
  name: "Jane Doe",
  email: "jane.doe@freshcart.test",
  subject: "Order issue",
  message: "My order arrived damaged.",
});

describe("POST /api/v1/support", () => {
  it("creates a support ticket without requiring authentication", async () => {
    const response = await request(app)
      .post("/api/v1/support")
      .send(validTicketPayload());

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe("open");
    expect(response.body.data.subject).toBe("Order issue");
  });

  it("rejects a ticket with an invalid payload", async () => {
    const response = await request(app)
      .post("/api/v1/support")
      .send({ ...validTicketPayload(), email: "not-an-email" });

    expect(response.status).toBe(400);
  });
});

describe("Admin support routes", () => {
  it("rejects listing without a token", async () => {
    const response = await request(app).get("/api/v1/admin/support");
    expect(response.status).toBe(401);
  });

  it("rejects listing for a non-admin user", async () => {
    const { token } = await createTestUser();

    const response = await request(app)
      .get("/api/v1/admin/support")
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(403);
  });

  it("lists all tickets for an admin", async () => {
    const { token } = await createTestUser({ role: "admin" });
    await request(app).post("/api/v1/support").send(validTicketPayload());

    const response = await request(app)
      .get("/api/v1/admin/support")
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it("fetches a single ticket by id", async () => {
    const { token } = await createTestUser({ role: "admin" });
    const createResponse = await request(app)
      .post("/api/v1/support")
      .send(validTicketPayload());
    const ticketId = createResponse.body.data.id;

    const response = await request(app)
      .get(`/api/v1/admin/support/${ticketId}`)
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(ticketId);
  });

  it("returns 404 for an unknown ticket id", async () => {
    const { token } = await createTestUser({ role: "admin" });

    const response = await request(app)
      .get("/api/v1/admin/support/64b7f7f7f7f7f7f7f7f7f7f7")
      .set("Authorization", authHeader(token));

    expect(response.status).toBe(404);
  });

  it("updates a ticket's status to resolved", async () => {
    const { token } = await createTestUser({ role: "admin" });
    const createResponse = await request(app)
      .post("/api/v1/support")
      .send(validTicketPayload());
    const ticketId = createResponse.body.data.id;

    const response = await request(app)
      .patch(`/api/v1/admin/support/${ticketId}/status`)
      .set("Authorization", authHeader(token))
      .send({ status: "resolved" });

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("resolved");
  });

  it("rejects an invalid ticket status", async () => {
    const { token } = await createTestUser({ role: "admin" });
    const createResponse = await request(app)
      .post("/api/v1/support")
      .send(validTicketPayload());
    const ticketId = createResponse.body.data.id;

    const response = await request(app)
      .patch(`/api/v1/admin/support/${ticketId}/status`)
      .set("Authorization", authHeader(token))
      .send({ status: "archived" });

    expect(response.status).toBe(400);
  });
});
