import {
  emptyProductForm,
  getErrorMessage,
  validateProductForm,
} from "@/app/admin/products/_components/helpers";

describe("getErrorMessage", () => {
  it("extracts the message from an axios-shaped error response", () => {
    const error = { response: { data: { message: "Slug already exists" } } };
    expect(getErrorMessage(error, "fallback")).toBe("Slug already exists");
  });

  it("returns the fallback for a plain Error", () => {
    expect(getErrorMessage(new Error("boom"), "fallback")).toBe("fallback");
  });
});

describe("validateProductForm", () => {
  const validForm = {
    ...emptyProductForm,
    name: "Apples",
    slug: "apples",
    category: "category-1",
    price: "3.5",
    image: "/uploads/products/apples.png",
  };

  it("accepts a fully filled form", () => {
    expect(validateProductForm(validForm)).toBe("");
  });

  it("requires a name", () => {
    expect(validateProductForm({ ...validForm, name: "" })).toBe(
      "Product name is required",
    );
  });

  it("requires a slug", () => {
    expect(validateProductForm({ ...validForm, slug: "  " })).toBe("Slug is required");
  });

  it("requires a category", () => {
    expect(validateProductForm({ ...validForm, category: "" })).toBe(
      "Category is required",
    );
  });

  it("rejects an empty price", () => {
    expect(validateProductForm({ ...validForm, price: "" })).toBe(
      "A valid price is required",
    );
  });

  it("rejects a non-numeric price", () => {
    expect(validateProductForm({ ...validForm, price: "abc" })).toBe(
      "A valid price is required",
    );
  });

  it("requires an image", () => {
    expect(validateProductForm({ ...validForm, image: "" })).toBe(
      "Please upload a product image",
    );
  });
});
