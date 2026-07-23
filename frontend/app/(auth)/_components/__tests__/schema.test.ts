import { registerSchema, loginSchema, updatePasswordSchema } from "@/app/(auth)/_components/schema";

describe("registerSchema", () => {
  const validPayload = {
    fullName: "Jane Doe",
    email: "jane@example.com",
    phoneNumber: "1234567890",
    password: "secret1",
    confirmPassword: "secret1",
  };

  it("accepts a valid payload", () => {
    expect(registerSchema.safeParse(validPayload).success).toBe(true);
  });

  it("rejects an empty fullName", () => {
    const result = registerSchema.safeParse({ ...validPayload, fullName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({ ...validPayload, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Invalid email address");
    }
  });

  it("rejects a phoneNumber shorter than 10 digits", () => {
    const result = registerSchema.safeParse({ ...validPayload, phoneNumber: "123" });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 6 characters", () => {
    const result = registerSchema.safeParse({
      ...validPayload,
      password: "abc",
      confirmPassword: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched password and confirmPassword", () => {
    const result = registerSchema.safeParse({
      ...validPayload,
      confirmPassword: "different",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["confirmPassword"]);
      expect(result.error.issues[0].message).toBe(
        "Password and confirm password do not match",
      );
    }
  });
});

describe("loginSchema", () => {
  it("accepts a valid payload", () => {
    const result = loginSchema.safeParse({
      email: "jane@example.com",
      password: "secret1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 6 characters", () => {
    const result = loginSchema.safeParse({
      email: "jane@example.com",
      password: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing password field", () => {
    const result = loginSchema.safeParse({ email: "jane@example.com" });
    expect(result.success).toBe(false);
  });
});

describe("updatePasswordSchema", () => {
  const validPayload = {
    currentPassword: "current1",
    newPassword: "newpass1",
    confirmPassword: "newpass1",
  };

  it("accepts a valid payload", () => {
    expect(updatePasswordSchema.safeParse(validPayload).success).toBe(true);
  });

  it("rejects a currentPassword shorter than 6 characters", () => {
    const result = updatePasswordSchema.safeParse({
      ...validPayload,
      currentPassword: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a newPassword shorter than 6 characters", () => {
    const result = updatePasswordSchema.safeParse({
      ...validPayload,
      newPassword: "abc",
      confirmPassword: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched newPassword and confirmPassword", () => {
    const result = updatePasswordSchema.safeParse({
      ...validPayload,
      confirmPassword: "different1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["confirmPassword"]);
      expect(result.error.issues[0].message).toBe(
        "New password and confirm password do not match",
      );
    }
  });
});
