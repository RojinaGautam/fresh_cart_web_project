import { updateProfileSchema } from "@/app/dashboard/profile/_components/schema";

describe("updateProfileSchema", () => {
  it("accepts a valid payload", () => {
    const result = updateProfileSchema.safeParse({
      fullName: "Jane Doe",
      phoneNumber: "1234567890",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty fullName", () => {
    const result = updateProfileSchema.safeParse({
      fullName: "",
      phoneNumber: "1234567890",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Full name is required");
    }
  });

  it("rejects a missing fullName field", () => {
    const result = updateProfileSchema.safeParse({
      phoneNumber: "1234567890",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a phoneNumber shorter than 10 characters", () => {
    const result = updateProfileSchema.safeParse({
      fullName: "Jane Doe",
      phoneNumber: "12345",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Phone number must be at least 10 digits",
      );
    }
  });

  it("accepts a phoneNumber that is exactly 10 characters", () => {
    const result = updateProfileSchema.safeParse({
      fullName: "Jane Doe",
      phoneNumber: "0123456789",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a missing phoneNumber field", () => {
    const result = updateProfileSchema.safeParse({
      fullName: "Jane Doe",
    });

    expect(result.success).toBe(false);
  });
});
