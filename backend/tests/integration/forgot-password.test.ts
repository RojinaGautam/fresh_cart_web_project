import request from "supertest";
import app from "../../src/app";
import { createTestUser } from "../helpers";
import * as mailer from "../../src/uttils/mailer.util";

jest.mock("../../src/uttils/mailer.util");

const getSentOtp = () => {
  const mockFn = mailer.sendPasswordResetEmail as jest.Mock;
  return mockFn.mock.calls[mockFn.mock.calls.length - 1][2];
};

describe("POST /api/v1/auth/forgot-password", () => {
  it("returns 404 for an unknown email", async () => {
    const response = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "nobody@freshcart.test" });

    expect(response.status).toBe(404);
  });

  it("sends a password reset email for a known account", async () => {
    const { user } = await createTestUser();

    const response = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: user.email });

    expect(response.status).toBe(200);
    expect(mailer.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
  });
});

describe("POST /api/v1/auth/reset-password", () => {
  it("rejects an incorrect OTP", async () => {
    const { user } = await createTestUser();
    await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: user.email });

    const response = await request(app).post("/api/v1/auth/reset-password").send({
      email: user.email,
      otp: "000000",
      newPassword: "BrandNewPass1",
    });

    expect(response.status).toBe(400);
  });

  it("resets the password with a correct OTP and invalidates the old password", async () => {
    const { user } = await createTestUser({ password: "Test1234" });
    await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: user.email });
    const otp = getSentOtp();

    const resetResponse = await request(app).post("/api/v1/auth/reset-password").send({
      email: user.email,
      otp,
      newPassword: "BrandNewPass1",
    });

    expect(resetResponse.status).toBe(200);

    const oldLoginResponse = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: "Test1234",
    });
    expect(oldLoginResponse.status).toBe(400);

    const newLoginResponse = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: "BrandNewPass1",
    });
    expect(newLoginResponse.status).toBe(200);
  });
});
