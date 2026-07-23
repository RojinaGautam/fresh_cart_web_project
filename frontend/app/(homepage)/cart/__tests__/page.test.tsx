import { formatSavedAddress, getMinDeliveryDate } from "@/app/(homepage)/cart/page";

describe("getMinDeliveryDate", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns today's date in local-time YYYY-MM-DD format", () => {
    const now = new Date();
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(now.getDate()).padStart(2, "0")}`;

    expect(getMinDeliveryDate()).toBe(expected);
  });

  it("zero-pads single-digit month and day", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 0, 5, 10, 30));

    expect(getMinDeliveryDate()).toBe("2026-01-05");
  });
});

describe("formatSavedAddress", () => {
  it("joins street and city with a comma", () => {
    expect(
      formatSavedAddress({ street: "123 Main St", city: "Springfield" }),
    ).toBe("123 Main St, Springfield");
  });

  it("formats a different street/city pair correctly", () => {
    expect(
      formatSavedAddress({ street: "45 Baker Street", city: "London" }),
    ).toBe("45 Baker Street, London");
  });
});
