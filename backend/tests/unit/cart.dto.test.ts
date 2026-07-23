import { AddCartItemDTO, UpdateCartItemDTO } from "../../src/dtos/cart.dto";

describe("AddCartItemDTO", () => {
  it("accepts a payload with productId only and defaults quantity to 1", () => {
    const result = AddCartItemDTO.safeParse({ productId: "abc123" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.quantity).toBe(1);
    }
  });

  it("rejects an empty productId", () => {
    const result = AddCartItemDTO.safeParse({ productId: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a zero or negative quantity", () => {
    const result = AddCartItemDTO.safeParse({ productId: "abc123", quantity: 0 });
    expect(result.success).toBe(false);
  });
});

describe("UpdateCartItemDTO", () => {
  it("accepts a valid quantity", () => {
    const result = UpdateCartItemDTO.safeParse({ quantity: 3 });
    expect(result.success).toBe(true);
  });

  it("rejects a quantity below 1", () => {
    const result = UpdateCartItemDTO.safeParse({ quantity: 0 });
    expect(result.success).toBe(false);
  });
});
