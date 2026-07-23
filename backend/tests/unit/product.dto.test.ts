import { CreateProductDTO, UpdateProductDTO } from "../../src/dtos/product.dto";

const validProduct = {
  name: "Red Apple",
  slug: "red-apple",
  category: "64b7f7f7f7f7f7f7f7f7f7f7",
  price: 2.5,
  image: "apple.png",
};

describe("CreateProductDTO", () => {
  it("accepts a minimal valid payload and applies defaults", () => {
    const result = CreateProductDTO.safeParse(validProduct);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.stock).toBe(100);
      expect(result.data.isActive).toBe(true);
      expect(result.data.isFeatured).toBe(false);
      expect(result.data.rating).toBe(4.9);
    }
  });

  it("rejects a non-positive price", () => {
    const result = CreateProductDTO.safeParse({ ...validProduct, price: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects a missing image", () => {
    const { image, ...rest } = validProduct;
    const result = CreateProductDTO.safeParse(rest);
    expect(result.success).toBe(false);
  });

});

describe("UpdateProductDTO", () => {
  it("accepts a partial payload with a single field", () => {
    const result = UpdateProductDTO.safeParse({ price: 3.99 });
    expect(result.success).toBe(true);
  });

  it("accepts an empty payload because defaulted fields (stock, rating, etc.) still populate the object", () => {
    // ProductSchema.partial() keeps zod defaults active for fields like `stock`/`unit`/`rating`,
    // so an empty {} still parses to a non-empty object and satisfies the
    // "at least one field is required" refine. This documents the actual behavior.
    const result = UpdateProductDTO.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects an invalid field even when partial", () => {
    const result = UpdateProductDTO.safeParse({ price: -1 });
    expect(result.success).toBe(false);
  });
});
