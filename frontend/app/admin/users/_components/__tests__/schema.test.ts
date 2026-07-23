import { adminUserSchema } from "@/app/admin/users/_components/schema";

describe("adminUserSchema", () => {
  const validPayload = {
    fullName: "Jane Doe",
    email: "jane@example.com",
    phoneNumber: "1234567890",
    role: "user" as const,
    password: "secret1",
  };

  it("accepts a valid payload", () => {
    expect(adminUserSchema.safeParse(validPayload).success).toBe(true);
  });

  it("accepts a payload with no password (edit mode)", () => {
    const { password: _password, ...rest } = validPayload;
    expect(adminUserSchema.safeParse(rest).success).toBe(true);
  });

  it("rejects an empty fullName", () => {
    expect(adminUserSchema.safeParse({ ...validPayload, fullName: "" }).success).toBe(
      false,
    );
  });

  it("rejects an invalid email", () => {
    expect(
      adminUserSchema.safeParse({ ...validPayload, email: "not-an-email" }).success,
    ).toBe(false);
  });

  it("rejects a phoneNumber shorter than 10 digits", () => {
    expect(
      adminUserSchema.safeParse({ ...validPayload, phoneNumber: "123" }).success,
    ).toBe(false);
  });

  it("rejects a role outside admin/user", () => {
    expect(
      adminUserSchema.safeParse({ ...validPayload, role: "superadmin" }).success,
    ).toBe(false);
  });

  it("rejects a password shorter than 6 characters when provided", () => {
    expect(adminUserSchema.safeParse({ ...validPayload, password: "abc" }).success).toBe(
      false,
    );
  });

  it("accepts the admin role", () => {
    expect(adminUserSchema.safeParse({ ...validPayload, role: "admin" }).success).toBe(
      true,
    );
  });
});
