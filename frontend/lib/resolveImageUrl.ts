const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Product/category images can be either a static asset served by the
// frontend's own /public folder (e.g. "/images/products/apples.png", from
// the seed data) or a file uploaded through the admin UI and served by the
// backend (e.g. "/uploads/products/169...-abc.png"). Only the latter needs
// the backend origin prefixed.
export const resolveImageUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/uploads/")) return `${apiUrl}${path}`;
  return path;
};
