import { getErrorMessage, statusTone } from "@/app/admin/orders/_components/helpers";

describe("getErrorMessage", () => {
  it("extracts the message from an axios-shaped error response", () => {
    const error = { response: { data: { message: "Invalid status" } } };
    expect(getErrorMessage(error, "fallback")).toBe("Invalid status");
  });

  it("returns the fallback for a plain Error", () => {
    expect(getErrorMessage(new Error("boom"), "fallback")).toBe("fallback");
  });
});

describe("statusTone", () => {
  it("returns emerald tones for delivered", () => {
    expect(statusTone("delivered")).toBe("bg-emerald-50 text-emerald-700");
  });

  it("returns sky tones for processing", () => {
    expect(statusTone("processing")).toBe("bg-sky-50 text-sky-700");
  });

  it("returns sky tones for out_for_delivery", () => {
    expect(statusTone("out_for_delivery")).toBe("bg-sky-50 text-sky-700");
  });

  it("returns red tones for cancelled", () => {
    expect(statusTone("cancelled")).toBe("bg-red-50 text-red-700");
  });

  it("returns amber tones as the default for pending", () => {
    expect(statusTone("pending")).toBe("bg-amber-50 text-amber-700");
  });

  it("returns amber tones as the default for an unknown status", () => {
    expect(statusTone("unknown_status")).toBe("bg-amber-50 text-amber-700");
  });
});
