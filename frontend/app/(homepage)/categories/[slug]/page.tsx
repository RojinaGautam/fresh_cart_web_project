import { notFound } from "next/navigation";
import CategoryBrowsePage from "../_components/CategoryBrowsePage";
import { getCategoriesAction, getCategoryAction } from "@/lib/actions/categories-action";
import { Category } from "@/lib/api/categories";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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

  return (
    <CategoryBrowsePage category={category} otherCategories={otherCategories} />
  );
}
