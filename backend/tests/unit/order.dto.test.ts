import { CreateOrderDTO } from "../../src/dtos/order.dto";

const basePayload = {
  shippingAddress: "123 Main St, Springfield",
  paymentMethod: "Cash on delivery" as const,
  deliveryTimeSlot: "09:00-11:00" as const,
};

const toDateString = (date: Date) => date.toISOString().slice(0, 10);

describe("CreateOrderDTO", () => {
  it("accepts a valid payload with today's date", () => {
    const result = CreateOrderDTO.safeParse({
      ...basePayload,
      deliveryDate: toDateString(new Date()),
    });

    expect(result.success).toBe(true);
  });

  it("accepts a future delivery date", () => {
    const future = new Date();
    future.setDate(future.getDate() + 3);

    const result = CreateOrderDTO.safeParse({
      ...basePayload,
      deliveryDate: toDateString(future),
    });

    expect(result.success).toBe(true);
  });

  it("rejects a past delivery date", () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);

    const result = CreateOrderDTO.safeParse({
      ...basePayload,
      deliveryDate: toDateString(past),
    });

    expect(result.success).toBe(false);
  });

  it("rejects a malformed delivery date", () => {
    const result = CreateOrderDTO.safeParse({
      ...basePayload,
      deliveryDate: "07/20/2026",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty shipping address", () => {
    const result = CreateOrderDTO.safeParse({
      ...basePayload,
      shippingAddress: "",
      deliveryDate: toDateString(new Date()),
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid payment method", () => {
    const result = CreateOrderDTO.safeParse({
      ...basePayload,
      paymentMethod: "bitcoin",
      deliveryDate: toDateString(new Date()),
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid delivery time slot", () => {
    const result = CreateOrderDTO.safeParse({
      ...basePayload,
      deliveryTimeSlot: "midnight",
      deliveryDate: toDateString(new Date()),
    });

    expect(result.success).toBe(false);
  });

  it("rejects a Card payment without a paymentIntentId", () => {
    const result = CreateOrderDTO.safeParse({
      ...basePayload,
      paymentMethod: "Card",
      deliveryDate: toDateString(new Date()),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["paymentIntentId"]);
    }
  });

  it("accepts a Card payment with a paymentIntentId", () => {
    const result = CreateOrderDTO.safeParse({
      ...basePayload,
      paymentMethod: "Card",
      paymentIntentId: "pi_test_123",
      deliveryDate: toDateString(new Date()),
    });

    expect(result.success).toBe(true);
  });
});
