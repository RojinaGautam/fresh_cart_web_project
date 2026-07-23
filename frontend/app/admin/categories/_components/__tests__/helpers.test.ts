import {
  emptyCategoryForm,
  getErrorMessage,
  validateCategoryForm,
} from "@/app/admin/categories/_components/helpers";

describe("getErrorMessage", () => {
  it("extracts the message from an axios-shaped error response", () => {
    const error = { response: { data: { message: "Slug already exists" } } };
    expect(getErrorMessage(error, "fallback")).toBe("Slug already exists");
  });

  it("returns the fallback when the error has no response data", () => {
    expect(getErrorMessage(new Error("network down"), "fallback")).toBe("fallback");
  });

  it("returns the fallback for a null error", () => {
    expect(getErrorMessage(null, "fallback")).toBe("fallback");
  });

  it("returns the fallback when response.data.message is not a string", () => {
    const error = { response: { data: { message: 500 } } };
    expect(getErrorMessage(error, "fallback")).toBe("fallback");
  });
});

describe("validateCategoryForm", () => {
  const validForm = {
    ...emptyCategoryForm,
    title: "Snacks",
    slug: "snacks",
    image: "/uploads/categories/a.png",
    description: "Chips and treats",
  };

  it("accepts a fully filled form", () => {
    expect(validateCategoryForm(validForm)).toBe("");
  });

  it("requires a title", () => {
    expect(validateCategoryForm({ ...validForm, title: "  " })).toBe("Title is required");
  });

  it("requires a slug", () => {
    expect(validateCategoryForm({ ...validForm, slug: "" })).toBe("Slug is required");
  });

  it("requires an image", () => {
    expect(validateCategoryForm({ ...validForm, image: "" })).toBe(
      "Please upload a category image",
    );
  });

  it("requires a description", () => {
    expect(validateCategoryForm({ ...validForm, description: "   " })).toBe(
      "Description is required",
    );
  });
});
