import request from "supertest";
import app from "../../src/app";
import * as mailer from "../../src/uttils/mailer.util";

jest.mock("../../src/uttils/mailer.util");

describe("Auth flow", () => {
  const payload = {
    fullName: "Jane Doe",
    email: "jane.doe@freshcart.test",
    phoneNumber: "9812345678",
    password: "Password1",
  };

  const getSentOtp = () => {
    const mockFn = mailer.sendVerificationEmail as jest.Mock;
    return mockFn.mock.calls[mockFn.mock.calls.length - 1][2];
  };

  it("registers a new user as unverified and sends a verification email", async () => {
    const response = await request(app).post("/api/v1/auth/register").send(payload);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe(payload.email);
    expect(response.body.data.isVerified).toBe(false);
    expect(mailer.sendVerificationEmail).toHaveBeenCalledTimes(1);
  });

  it("rejects registration with a duplicate email", async () => {
    await request(app).post("/api/v1/auth/register").send(payload);
    const response = await request(app).post("/api/v1/auth/register").send(payload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("rejects registration with an invalid payload", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({ ...payload, email: "not-an-email" });

    expect(response.status).toBe(400);
  });

  it("rejects login before the account is verified", async () => {
    await request(app).post("/api/v1/auth/register").send(payload);

    const response = await request(app).post("/api/v1/auth/login").send({
      email: payload.email,
      password: payload.password,
    });

    expect(response.status).toBe(403);
  });

  it("rejects email verification with the wrong OTP", async () => {
    await request(app).post("/api/v1/auth/register").send(payload);

    const response = await request(app).post("/api/v1/auth/verify-email").send({
      email: payload.email,
      otp: "000000",
    });

    expect(response.status).toBe(400);
  });

  it("verifies the account with the correct OTP and allows login", async () => {
    await request(app).post("/api/v1/auth/register").send(payload);
    const otp = getSentOtp();

    const verifyResponse = await request(app)
      .post("/api/v1/auth/verify-email")
      .send({ email: payload.email, otp });

    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.body.data.isVerified).toBe(true);

    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: payload.email,
      password: payload.password,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.data.token).toEqual(expect.any(String));
  });

  it("rejects login with an incorrect password", async () => {
    await request(app).post("/api/v1/auth/register").send(payload);
    const otp = getSentOtp();
    await request(app).post("/api/v1/auth/verify-email").send({ email: payload.email, otp });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: payload.email,
      password: "WrongPassword1",
    });

    expect(response.status).toBe(400);
  });

  it("returns the authenticated user on /whoami with a valid token", async () => {
    await request(app).post("/api/v1/auth/register").send(payload);
    const otp = getSentOtp();
    await request(app).post("/api/v1/auth/verify-email").send({ email: payload.email, otp });
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: payload.email,
      password: payload.password,
    });

    const response = await request(app)
      .get("/api/v1/auth/whoami")
      .set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe(payload.email);
  });

  it("rejects /whoami without a token", async () => {
    const response = await request(app).get("/api/v1/auth/whoami");
    expect(response.status).toBe(401);
  });

  it("rejects /whoami with a malformed token", async () => {
    const response = await request(app)
      .get("/api/v1/auth/whoami")
      .set("Authorization", "Bearer not-a-real-token");

    expect(response.status).toBe(401);
  });
});
