import {
  emptyUserForm,
  getErrorMessage,
  validateUserForm,
} from "@/app/admin/users/_components/helpers";

describe("getErrorMessage", () => {
  it("extracts the message from an axios-shaped error response", () => {
    const error = { response: { data: { message: "Email already exists" } } };
    expect(getErrorMessage(error, "fallback")).toBe("Email already exists");
  });

  it("returns the fallback for a plain Error", () => {
    expect(getErrorMessage(new Error("boom"), "fallback")).toBe("fallback");
  });
});

describe("validateUserForm", () => {
  const validForm = {
    ...emptyUserForm,
    fullName: "Jane Doe",
    email: "jane@example.com",
    phoneNumber: "1234567890",
    role: "user" as const,
    password: "secret1",
  };

  it("accepts a fully filled create-mode form", () => {
    expect(validateUserForm(validForm, "create")).toBe("");
  });

  it("accepts an edit-mode form with no password", () => {
    expect(validateUserForm({ ...validForm, password: "" }, "edit")).toBe("");
  });

  it("requires a fullName", () => {
    expect(validateUserForm({ ...validForm, fullName: "" }, "create")).toBe(
      "Full name is required",
    );
  });

  it("rejects an invalid email", () => {
    expect(validateUserForm({ ...validForm, email: "not-an-email" }, "create")).toBe(
      "Valid email is required",
    );
  });

  it("rejects a phoneNumber shorter than 10 digits", () => {
    expect(validateUserForm({ ...validForm, phoneNumber: "123" }, "create")).toBe(
      "Phone number must be at least 10 digits",
    );
  });

  it("rejects an invalid role", () => {
    expect(
      validateUserForm({ ...validForm, role: "superadmin" as never }, "create"),
    ).toBe("Role is required");
  });

  it("requires a password in create mode", () => {
    expect(validateUserForm({ ...validForm, password: "" }, "create")).toBe(
      "Password is required",
    );
  });

  it("rejects a password shorter than 6 characters", () => {
    expect(validateUserForm({ ...validForm, password: "abc" }, "create")).toBe(
      "Password must be at least 6 characters",
    );
  });

  it("rejects a short password in edit mode too, when provided", () => {
    expect(validateUserForm({ ...validForm, password: "abc" }, "edit")).toBe(
      "Password must be at least 6 characters",
    );
  });
});
