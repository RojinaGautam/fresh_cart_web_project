const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Product/category/deal images are served by the backend's /uploads route
// (either seeded or uploaded through the admin UI), e.g.
// "/uploads/products/169...-abc.png". Only backend-relative paths need the
// backend origin prefixed; absolute URLs pass through unchanged.
export const resolveImageUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/uploads/")) return `${apiUrl}${path}`;
  return path;
};

export const FALLBACK_PRODUCT_IMAGE = resolveImageUrl("/uploads/products/fallback-grocery.png");
