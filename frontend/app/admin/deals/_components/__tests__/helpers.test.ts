import {
  emptyDealForm,
  getErrorMessage,
  validateDealForm,
} from "@/app/admin/deals/_components/helpers";

describe("getErrorMessage", () => {
  it("extracts the message from an axios-shaped error response", () => {
    const error = { response: { data: { message: "Product is required" } } };
    expect(getErrorMessage(error, "fallback")).toBe("Product is required");
  });

  it("returns the fallback for a plain Error", () => {
    expect(getErrorMessage(new Error("boom"), "fallback")).toBe("fallback");
  });
});

describe("validateDealForm", () => {
  const validForm = {
    ...emptyDealForm,
    title: "Weekend Sale",
    description: "20% off",
    product: "product-1",
    image: "/uploads/deals/a.png",
    discountPercentage: "20",
    badge: "Hot",
  };

  it("accepts a fully filled form", () => {
    expect(validateDealForm(validForm)).toBe("");
  });

  it("requires a title", () => {
    expect(validateDealForm({ ...validForm, title: "" })).toBe("Title is required");
  });

  it("requires a description", () => {
    expect(validateDealForm({ ...validForm, description: "  " })).toBe(
      "Description is required",
    );
  });

  it("requires a product", () => {
    expect(validateDealForm({ ...validForm, product: "" })).toBe("Product is required");
  });

  it("requires an image", () => {
    expect(validateDealForm({ ...validForm, image: "" })).toBe(
      "Please upload a deal image",
    );
  });

  it("rejects an empty discount percentage", () => {
    expect(validateDealForm({ ...validForm, discountPercentage: "" })).toBe(
      "Discount percentage must be a number between 0 and 100",
    );
  });

  it("rejects a non-numeric discount percentage", () => {
    expect(validateDealForm({ ...validForm, discountPercentage: "abc" })).toBe(
      "Discount percentage must be a number between 0 and 100",
    );
  });

  it("rejects a negative discount percentage", () => {
    expect(validateDealForm({ ...validForm, discountPercentage: "-5" })).toBe(
      "Discount percentage must be a number between 0 and 100",
    );
  });

  it("rejects a discount percentage over 100", () => {
    expect(validateDealForm({ ...validForm, discountPercentage: "150" })).toBe(
      "Discount percentage must be a number between 0 and 100",
    );
  });

  it("accepts a discount percentage of exactly 0", () => {
    expect(validateDealForm({ ...validForm, discountPercentage: "0" })).toBe("");
  });

  it("accepts a discount percentage of exactly 100", () => {
    expect(validateDealForm({ ...validForm, discountPercentage: "100" })).toBe("");
  });

  it("requires a badge", () => {
    expect(validateDealForm({ ...validForm, badge: "" })).toBe("Badge is required");
  });
});
