import { render, screen, fireEvent } from "@testing-library/react";
import Navbar, { Avatar, getProfileImageUrl } from "@/app/_components/Navbar";
import { FreshCartUser } from "@/lib/api/auth";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/lib/contexts/CartContext", () => ({
  useCart: () => ({
    cart: { items: [{ quantity: 2 }, { quantity: 3 }] },
  }),
}));

jest.mock("@/lib/contexts/WishlistContext", () => ({
  useWishlist: () => ({
    wishlist: { items: [{}] },
  }),
}));

const baseUser: FreshCartUser = {
  id: "1",
  fullName: "Alice Smith",
  email: "alice@example.com",
  phoneNumber: "1234567890",
  role: "customer",
  isVerified: true,
};

describe("getProfileImageUrl", () => {
  it("returns an empty string for null", () => {
    expect(getProfileImageUrl(null)).toBe("");
  });

  it("returns an empty string for undefined", () => {
    expect(getProfileImageUrl(undefined)).toBe("");
  });

  it("passes through an absolute http(s) URL unchanged", () => {
    expect(getProfileImageUrl("http://example.com/a.png")).toBe(
      "http://example.com/a.png",
    );
  });

  it("prefixes a relative path with the API origin", () => {
    expect(getProfileImageUrl("/uploads/avatars/a.png")).toBe(
      "http://localhost:4000/uploads/avatars/a.png",
    );
  });
});

describe("Avatar", () => {
  it("renders an img tag when the user has a profileImage", () => {
    render(<Avatar user={{ ...baseUser, profileImage: "/uploads/a.png" }} />);

    const img = screen.getByRole("img", { name: "Alice Smith" });
    expect(img).toHaveAttribute("src", "http://localhost:4000/uploads/a.png");
  });

  it("renders the first-letter initial badge when there is no profileImage", () => {
    render(<Avatar user={{ ...baseUser, profileImage: null }} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});

describe("Navbar", () => {
  it("renders the primary nav links", () => {
    render(<Navbar variant="storefront" />);

    expect(screen.getByRole("link", { name: "Shop" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Deals" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Support" })).toBeInTheDocument();
  });

  it("shows the cart item count badge when the cart has items", () => {
    render(<Navbar variant="storefront" user={baseUser} />);

    // cart quantities 2 + 3 = 5
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("shows login/signup links when no user is provided", () => {
    render(<Navbar variant="storefront" />);

    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign up" })).toBeInTheDocument();
  });

  it("shows a profile link instead of login/signup when a user is provided", () => {
    render(<Navbar variant="storefront" user={baseUser} />);

    expect(screen.getByRole("link", { name: "Go to profile" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
  });

  it("toggles the mobile menu open and closed", () => {
    render(<Navbar variant="storefront" />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(screen.getAllByRole("link", { name: "Sign up" }).length).toBe(1);

    fireEvent.click(toggle);
    // Mobile menu adds a second "Sign up" link (mobile nav), so there should be two now.
    expect(screen.getAllByRole("link", { name: "Sign up" }).length).toBeGreaterThan(1);

    fireEvent.click(toggle);
    expect(screen.getAllByRole("link", { name: "Sign up" }).length).toBe(1);
  });
});
