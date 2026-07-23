import { resolveImageUrl } from "@/lib/resolveImageUrl";

describe("resolveImageUrl", () => {
  it("returns an empty string for null", () => {
    expect(resolveImageUrl(null)).toBe("");
  });

  it("returns an empty string for undefined", () => {
    expect(resolveImageUrl(undefined)).toBe("");
  });

  it("returns an empty string for an empty string", () => {
    expect(resolveImageUrl("")).toBe("");
  });

  it("passes through absolute http URLs unchanged", () => {
    expect(resolveImageUrl("http://example.com/a.png")).toBe("http://example.com/a.png");
  });

  it("passes through absolute https URLs unchanged", () => {
    expect(resolveImageUrl("https://example.com/a.png")).toBe("https://example.com/a.png");
  });

  it("prefixes the backend origin for /uploads/ paths", () => {
    expect(resolveImageUrl("/uploads/products/apples.png")).toBe(
      "http://localhost:4000/uploads/products/apples.png",
    );
  });

  it("leaves other relative paths unchanged", () => {
    expect(resolveImageUrl("/logo.png")).toBe("/logo.png");
  });
});
