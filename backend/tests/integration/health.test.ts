import request from "supertest";
import app from "../../src/app";

describe("GET /", () => {
  it("reports the API is running", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "FreshCart API is running",
    });
  });
});

describe("unknown routes", () => {
  it("returns a 404 JSON payload for unmatched API routes", async () => {
    const response = await request(app).get("/api/v1/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});
