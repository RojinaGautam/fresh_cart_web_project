const fallbackGroceryImage = "/images/products/fallback-grocery.png";

const productImageMap: Record<string, string> = {
  "fresh-bread-loaf": "/images/products/fresh-bread-loaf.png",
  "breakfast-croissant": "/images/products/breakfast-croissant.png",
  "soft-dinner-rolls": "/images/products/soft-dinner-rolls.png",
  "sweet-pastry-box": "/images/products/sweet-pastry-box.png",
  bakery: "/images/products/bakery.png",
  apple: "/images/products/apples.png",
  apples: "/images/products/apples.png",
  "red-lady-apple": "/images/products/apples.png",
  banana: "/images/products/bananas.png",
  bananas: "/images/products/bananas.png",
  "sweet-bananas": "/images/products/bananas.png",
  strawberry: "/images/products/strawberries.png",
  strawberries: "/images/products/strawberries.png",
  "mixed-berries": "/images/products/strawberries.png",
  orange: "/images/products/oranges.png",
  oranges: "/images/products/oranges.png",
  "valencia-oranges": "/images/products/oranges.png",
  grape: "/images/products/grapes.png",
  grapes: "/images/products/grapes.png",
  "mixed-fruits": "/images/products/mixed-fruits.png",
  "hass-avocado": "/avocado-hd.png",
  "organic-hass-avocado": "/avocado-hd.png",
  carrot: "/images/products/carrots.png",
  carrots: "/images/products/carrots.png",
  "harvest-carrots": "/images/products/carrots.png",
  tomato: "/images/products/tomatoes.png",
  tomatoes: "/images/products/tomatoes.png",
  "vine-tomatoes": "/images/products/tomatoes.png",
  potato: "/images/products/potatoes.png",
  potatoes: "/images/products/potatoes.png",
  onion: "/images/products/onions.png",
  onions: "/images/products/onions.png",
  spinach: "/images/products/spinach.png",
  broccoli: "/images/products/broccoli.png",
  "mixed-vegetables": "/images/products/mixed-vegetables.png",
  "garden-vegetables": "/images/products/mixed-vegetables.png",
  "market-veggie-box": "/images/products/mixed-vegetables.png",
  "curly-kale-bunch": "/leafygreens-hd.png",
  chicken: "/images/products/chicken-breast.png",
  "chicken-breast": "/images/products/chicken-breast.png",
  "chicken-breast-pack": "/images/products/chicken-breast.png",
  "whole-chicken": "/images/products/whole-chicken.png",
  beef: "/images/products/beef.png",
  "premium-steak-cut": "/images/products/beef.png",
  "rosemary-beef-cut": "/images/products/beef.png",
  lamb: "/images/products/lamb.png",
  sausages: "/images/products/sausages.png",
  "family-meat-box": "/images/products/meat-poultry.png",
  "meat-poultry": "/images/products/meat-poultry.png",
  milk: "/images/products/milk.png",
  "farm-fresh-milk": "/images/products/milk.png",
  eggs: "/images/products/eggs.png",
  cheese: "/images/products/cheese.png",
  "cheese-board-pack": "/images/products/cheese.png",
  yogurt: "/images/products/yogurt.png",
  "greek-yogurt-cup": "/images/products/yogurt.png",
  butter: "/images/products/butter.png",
  "dairy-breakfast-set": "/images/products/dairy-eggs.png",
  "dairy-eggs": "/images/products/dairy-eggs.png",
  rice: "/images/products/rice.png",
  "rice-pantry-pack": "/images/products/rice.png",
  pasta: "/images/products/pasta.png",
  "pasta-sauce-kit": "/images/products/pasta.png",
  flour: "/images/products/flour.png",
  "cooking-oil": "/images/products/cooking-oil.png",
  "olive-oil-bottle": "/images/products/cooking-oil.png",
  spices: "/images/products/spices.png",
  "cooking-spice-set": "/images/products/spices.png",
  "pantry-staples": "/images/products/pantry-staples.png",
  "frozen-vegetables": "/images/products/frozen-vegetables.png",
  "frozen-veggie-mix": "/images/products/frozen-vegetables.png",
  "frozen-meals": "/images/products/frozen-meals.png",
  "quick-meal-tray": "/images/products/frozen-meals.png",
  "ice-cream": "/images/products/ice-cream.png",
  "frozen-dessert-box": "/images/products/ice-cream.png",
  "frozen-greens-pack": "/images/products/frozen-vegetables.png",
  "frozen-foods": "/images/products/frozen-foods.png",
  "orange-juice": "/images/products/orange-juice.png",
  "fresh-citrus-juice": "/images/products/orange-juice.png",
  "bottled-water": "/images/products/bottled-water.png",
  "sparkling-water-pack": "/images/products/bottled-water.png",
  tea: "/images/products/tea.png",
  coffee: "/images/products/coffee.png",
  "cold-coffee-bottle": "/images/products/coffee.png",
  "soft-drinks": "/images/products/soft-drinks.png",
  beverages: "/images/products/beverages.png",
  "daily-drink-bundle": "/images/products/beverages.png",
  chips: "/images/products/chips.png",
  "crispy-fries-cup": "/images/products/chips.png",
  biscuits: "/images/products/biscuits.png",
  "biscuit-snack-box": "/images/products/biscuits.png",
  nuts: "/images/products/nuts.png",
  "mixed-nuts-pack": "/images/products/nuts.png",
  chocolate: "/images/products/chocolate.png",
  "sweet-treat-bag": "/images/products/chocolate.png",
  snacks: "/images/products/snacks.png",
  detergent: "/images/products/detergent.png",
  "laundry-essentials": "/images/products/detergent.png",
  "cleaning-spray": "/images/products/cleaning-spray.png",
  "kitchen-cleaner": "/images/products/cleaning-spray.png",
  "toilet-paper": "/images/products/toilet-paper.png",
  "paper-goods-pack": "/images/products/toilet-paper.png",
  "dishwash-liquid": "/images/products/dishwash-liquid.png",
  household: "/images/products/household.png",
  "cleaning-brush-set": "/images/products/household.png",
  shampoo: "/images/products/shampoo.png",
  "shampoo-bottle": "/images/products/shampoo.png",
  soap: "/images/products/soap.png",
  "hand-soap-set": "/images/products/soap.png",
  toothpaste: "/images/products/toothpaste.png",
  handwash: "/images/products/handwash.png",
  "body-wash-bottle": "/images/products/handwash.png",
  "personal-care": "/images/products/personal-care.png",
  "daily-care-pack": "/images/products/personal-care.png",
};

const categoryImageMap: Record<string, string> = {
  fruits: "/images/categories/fruits.png",
  vegetables: "/images/categories/vegetables.png",
  "meat-poultry": "/images/categories/meat-poultry.png",
  "dairy-eggs": "/images/categories/dairy-eggs.png",
  bakery: "/images/categories/bakery.png",
  "pantry-staples": "/images/categories/pantry-staples.png",
  "frozen-foods": "/images/categories/frozen-foods.png",
  beverages: "/images/categories/beverages.png",
  snacks: "/images/categories/snacks.png",
  household: "/images/categories/household.png",
  "personal-care": "/images/categories/personal-care.png",
};

const categoryNameMap: Record<string, string> = {
  fruits: "Fruits",
  vegetables: "Vegetables",
  "meat-poultry": "Meat & Poultry",
  "dairy-eggs": "Dairy & Eggs",
  bakery: "Bakery",
  "pantry-staples": "Pantry Staples",
  "frozen-foods": "Frozen Foods",
  beverages: "Beverages",
  snacks: "Snacks",
  household: "Household",
  "personal-care": "Personal Care",
};

export const normalizeImageKey = (value?: string | null) =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const getCategorySlug = (category?: string | null) =>
  normalizeImageKey(category).replace(/-and-/g, "-");

export const getCategoryNameFromSlug = (slug?: string | null) =>
  categoryNameMap[getCategorySlug(slug)] || "";

export const getCategoryImage = (category?: string | null) =>
  categoryImageMap[getCategorySlug(category)] || fallbackGroceryImage;

export const getProductImage = ({
  name,
  category,
}: {
  name?: string | null;
  category?: string | null;
}) =>
  productImageMap[normalizeImageKey(name)] ||
  productImageMap[getCategorySlug(category)] ||
  getCategoryImage(category);

export const productImagePaths = {
  fallbackGroceryImage,
  productImageMap,
  categoryImageMap,
  categoryNameMap,
};
