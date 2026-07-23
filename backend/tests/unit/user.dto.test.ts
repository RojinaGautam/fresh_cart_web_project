import {
  AddressDTO,
  UpdatePasswordDTO,
  UpdateProfileDTO,
} from "../../src/dtos/user.dto";

describe("AddressDTO", () => {
  it("accepts a valid address without an id (new address)", () => {
    const result = AddressDTO.safeParse({
      label: "Home",
      street: "123 Main St",
      city: "Springfield",
    });

    expect(result.success).toBe(true);
  });

  it("accepts a valid address with an id (existing address update)", () => {
    const result = AddressDTO.safeParse({
      id: "64b7f7f7f7f7f7f7f7f7f7f7",
      label: "Work",
      street: "456 Office Rd",
      city: "Metropolis",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an address missing a required field", () => {
    const result = AddressDTO.safeParse({
      label: "Home",
      city: "Springfield",
    });

    expect(result.success).toBe(false);
  });
});

describe("UpdateProfileDTO", () => {
  it("rejects a phone number shorter than 10 digits", () => {
    const result = UpdateProfileDTO.safeParse({ phoneNumber: "123" });
    expect(result.success).toBe(false);
  });

  it("accepts a payload with a nested addresses array", () => {
    const result = UpdateProfileDTO.safeParse({
      addresses: [{ label: "Home", street: "123 Main St", city: "Springfield" }],
    });

    expect(result.success).toBe(true);
  });

  it("rejects a payload with an invalid nested address", () => {
    const result = UpdateProfileDTO.safeParse({
      addresses: [{ label: "Home", street: "", city: "Springfield" }],
    });

    expect(result.success).toBe(false);
  });
});

describe("UpdatePasswordDTO", () => {
  it("accepts valid current and new passwords", () => {
    const result = UpdatePasswordDTO.safeParse({
      currentPassword: "Test1234",
      newPassword: "NewPass123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a new password shorter than 6 characters", () => {
    const result = UpdatePasswordDTO.safeParse({
      currentPassword: "Test1234",
      newPassword: "abc",
    });

    expect(result.success).toBe(false);
  });
});
