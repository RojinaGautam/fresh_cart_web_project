import { notFound } from "next/navigation";
import CategoryBrowsePage from "./_components/CategoryBrowsePage";
import { getCategoriesAction } from "@/lib/actions/categories-action";
import { Category } from "@/lib/api/categories";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const categoriesResponse = await getCategoriesAction();
  const categories = categoriesResponse.success
    ? (categoriesResponse.data as Category[])
    : [];

  if (categories.length === 0) {
    notFound();
  }

  const initialSearch = resolvedSearchParams?.search || "";

  return (
    <CategoryBrowsePage
      key={`all-${initialSearch}`}
      category={categories[0]}
      otherCategories={categories}
      initialSearch={initialSearch}
      browseAllProducts
    />
  );
}
