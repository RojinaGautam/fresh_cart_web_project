import {
  setAuthToken,
  getAuthToken,
  setStoredUser,
  getStoredUser,
  clearStoredAuth,
} from "@/lib/auth-storage";
import { FreshCartUser } from "@/lib/api/auth";

const testUser: FreshCartUser = {
  id: "user-1",
  fullName: "Jane Doe",
  email: "jane@example.com",
  phoneNumber: "1234567890",
  role: "customer",
  isVerified: true,
};

// js-cookie writes to document.cookie, which jsdom supports natively.
// Clear all cookies between tests so state doesn't leak across specs.
const clearAllCookies = () => {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    if (name) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  });
};

describe("auth-storage", () => {
  afterEach(() => {
    clearAllCookies();
  });

  it("getAuthToken returns undefined when no token cookie is set", () => {
    expect(getAuthToken()).toBeUndefined();
  });

  it("setAuthToken then getAuthToken round-trips the token value", () => {
    setAuthToken("token-abc-123");
    expect(getAuthToken()).toBe("token-abc-123");
  });

  it("setStoredUser then getStoredUser round-trips the user object", () => {
    setStoredUser(testUser);
    expect(getStoredUser()).toEqual(testUser);
  });

  it("getStoredUser returns null when no user cookie is set", () => {
    expect(getStoredUser()).toBeNull();
  });

  it("getStoredUser returns null and removes the cookie when the stored value is malformed JSON", () => {
    document.cookie = "user_data=not-valid-json;path=/";
    expect(getStoredUser()).toBeNull();
    expect(document.cookie).not.toContain("not-valid-json");
  });

  it("clearStoredAuth removes both the token and user cookies", () => {
    setAuthToken("token-xyz");
    setStoredUser(testUser);

    clearStoredAuth();

    expect(getAuthToken()).toBeUndefined();
    expect(getStoredUser()).toBeNull();
  });
});
