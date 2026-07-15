import { notFound } from "next/navigation";
import CategoryBrowsePage from "../_components/CategoryBrowsePage";
import { getCategoriesAction, getCategoryAction } from "@/lib/actions/categories-action";
import { Category } from "@/lib/api/categories";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ search?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const [categoryResponse, categoriesResponse] = await Promise.all([
    getCategoryAction(slug),
    getCategoriesAction(),
  ]);

  if (!categoryResponse.success) {
    notFound();
  }

  const category = categoryResponse.data as Category;
  const otherCategories = categoriesResponse.success
    ? (categoriesResponse.data as Category[])
    : [];
  const initialSearch = resolvedSearchParams?.search || "";

  return (
    <CategoryBrowsePage
      key={`${category.slug}-${initialSearch}`}
      category={category}
      otherCategories={otherCategories}
      initialSearch={initialSearch}
    />
  );
}
