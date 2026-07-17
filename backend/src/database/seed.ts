import dotenv from "dotenv";
import mongoose from "mongoose";
import { MONGODB_URL } from "../configs/constant";
import { CategoryModel } from "../models/category.model";
import { ProductModel } from "../models/product.model";
import { DealModel } from "../models/deal.model";

dotenv.config();

// ---------------------------------------------------------------------------
// Image resolution helpers — map seeded Product/Category/Deal `image` fields
// to files served by the backend's own /uploads static route (see
// backend/uploads/{products,categories,deals}), not the frontend's public folder.
// ---------------------------------------------------------------------------

const fallbackGroceryImage = "/uploads/products/fallback-grocery.png";

const productImageMap: Record<string, string> = {
  "fresh-bread-loaf": "/uploads/products/fresh-bread-loaf.png",
  "breakfast-croissant": "/uploads/products/breakfast-croissant.png",
  "soft-dinner-rolls": "/uploads/products/soft-dinner-rolls.png",
  "sweet-pastry-box": "/uploads/products/sweet-pastry-box.png",
  bakery: "/uploads/products/bakery.png",
  apple: "/uploads/products/apples.png",
  apples: "/uploads/products/apples.png",
  "red-lady-apple": "/uploads/products/apples.png",
  banana: "/uploads/products/bananas.png",
  bananas: "/uploads/products/bananas.png",
  "sweet-bananas": "/uploads/products/bananas.png",
  "premium-bananas": "/uploads/products/bananas.png",
  strawberry: "/uploads/products/strawberries.png",
  strawberries: "/uploads/products/strawberries.png",
  "mixed-berries": "/uploads/products/strawberries.png",
  "organic-raspberries": "/uploads/products/strawberries.png",
  orange: "/uploads/products/oranges.png",
  oranges: "/uploads/products/oranges.png",
  "valencia-oranges": "/uploads/products/oranges.png",
  grape: "/uploads/products/grapes.png",
  grapes: "/uploads/products/grapes.png",
  "mixed-fruits": "/uploads/products/mixed-fruits.png",
  "hass-avocado": "/uploads/products/avocado-hd.png",
  "organic-hass-avocado": "/uploads/products/avocado-hd.png",
  carrot: "/uploads/products/carrots.png",
  carrots: "/uploads/products/carrots.png",
  "harvest-carrots": "/uploads/products/carrots.png",
  tomato: "/uploads/products/tomatoes.png",
  tomatoes: "/uploads/products/tomatoes.png",
  "vine-tomatoes": "/uploads/products/tomatoes.png",
  potato: "/uploads/products/potatoes.png",
  potatoes: "/uploads/products/potatoes.png",
  onion: "/uploads/products/onions.png",
  onions: "/uploads/products/onions.png",
  spinach: "/uploads/products/spinach.png",
  broccoli: "/uploads/products/broccoli.png",
  "mixed-vegetables": "/uploads/products/mixed-vegetables.png",
  "garden-vegetables": "/uploads/products/mixed-vegetables.png",
  "curly-kale-bunch": "/uploads/products/leafygreens-hd.png",
  chicken: "/uploads/products/chicken-breast.png",
  "chicken-breast": "/uploads/products/chicken-breast.png",
  "chicken-breast-pack": "/uploads/products/chicken-breast.png",
  "whole-chicken": "/uploads/products/whole-chicken.png",
  beef: "/uploads/products/beef.png",
  "premium-steak-cut": "/uploads/products/beef.png",
  "rosemary-beef-cut": "/uploads/products/beef.png",
  lamb: "/uploads/products/lamb.png",
  sausages: "/uploads/products/sausages.png",
  "meat-poultry": "/uploads/products/meat-poultry.png",
  milk: "/uploads/products/milk.png",
  "farm-fresh-milk": "/uploads/products/milk.png",
  eggs: "/uploads/products/eggs.png",
  cheese: "/uploads/products/cheese.png",
  "cheese-board-pack": "/uploads/products/cheese.png",
  yogurt: "/uploads/products/yogurt.png",
  "greek-yogurt-cup": "/uploads/products/yogurt.png",
  butter: "/uploads/products/butter.png",
  "dairy-breakfast-set": "/uploads/products/dairy-eggs.png",
  "dairy-eggs": "/uploads/products/dairy-eggs.png",
  rice: "/uploads/products/rice.png",
  "rice-pantry-pack": "/uploads/products/rice.png",
  pasta: "/uploads/products/pasta.png",
  "pasta-sauce-kit": "/uploads/products/pasta.png",
  flour: "/uploads/products/flour.png",
  "cooking-oil": "/uploads/products/cooking-oil.png",
  "olive-oil-bottle": "/uploads/products/cooking-oil.png",
  spices: "/uploads/products/spices.png",
  "cooking-spice-set": "/uploads/products/spices.png",
  "pantry-staples": "/uploads/products/pantry-staples.png",
  "frozen-vegetables": "/uploads/products/frozen-vegetables.png",
  "frozen-veggie-mix": "/uploads/products/frozen-vegetables.png",
  "frozen-meals": "/uploads/products/frozen-meals.png",
  "quick-meal-tray": "/uploads/products/frozen-meals.png",
  "ice-cream": "/uploads/products/ice-cream.png",
  "frozen-dessert-box": "/uploads/products/ice-cream.png",
  "frozen-greens-pack": "/uploads/products/frozen-vegetables.png",
  "frozen-foods": "/uploads/products/frozen-foods.png",
  "orange-juice": "/uploads/products/orange-juice.png",
  "fresh-citrus-juice": "/uploads/products/orange-juice.png",
  "bottled-water": "/uploads/products/bottled-water.png",
  "sparkling-water-pack": "/uploads/products/bottled-water.png",
  tea: "/uploads/products/tea.png",
  coffee: "/uploads/products/coffee.png",
  "cold-coffee-bottle": "/uploads/products/coffee.png",
  "soft-drinks": "/uploads/products/soft-drinks.png",
  beverages: "/uploads/products/beverages.png",
  chips: "/uploads/products/chips.png",
  "crispy-fries-cup": "/uploads/products/chips.png",
  biscuits: "/uploads/products/biscuits.png",
  "biscuit-snack-box": "/uploads/products/biscuits.png",
  nuts: "/uploads/products/nuts.png",
  "mixed-nuts-pack": "/uploads/products/nuts.png",
  chocolate: "/uploads/products/chocolate.png",
  "sweet-treat-bag": "/uploads/products/chocolate.png",
  snacks: "/uploads/products/snacks.png",
  detergent: "/uploads/products/detergent.png",
  "laundry-essentials": "/uploads/products/detergent.png",
  "cleaning-spray": "/uploads/products/cleaning-spray.png",
  "kitchen-cleaner": "/uploads/products/cleaning-spray.png",
  "toilet-paper": "/uploads/products/toilet-paper.png",
  "paper-goods-pack": "/uploads/products/toilet-paper.png",
  "dishwash-liquid": "/uploads/products/dishwash-liquid.png",
  household: "/uploads/products/household.png",
  "cleaning-brush-set": "/uploads/products/household.png",
  shampoo: "/uploads/products/shampoo.png",
  "shampoo-bottle": "/uploads/products/shampoo.png",
  soap: "/uploads/products/soap.png",
  "hand-soap-set": "/uploads/products/soap.png",
  toothpaste: "/uploads/products/toothpaste.png",
  handwash: "/uploads/products/handwash.png",
  "body-wash-bottle": "/uploads/products/handwash.png",
  "personal-care": "/uploads/products/personal-care.png",
  "daily-care-pack": "/uploads/products/personal-care.png",
};

const categoryImageMap: Record<string, string> = {
  fruits: "/uploads/categories/fruits.png",
  vegetables: "/uploads/categories/vegetables.png",
  "meat-poultry": "/uploads/categories/meat-poultry.png",
  "dairy-eggs": "/uploads/categories/dairy-eggs.png",
  bakery: "/uploads/categories/bakery.png",
  "pantry-staples": "/uploads/categories/pantry-staples.png",
  "frozen-foods": "/uploads/categories/frozen-foods.png",
  beverages: "/uploads/categories/beverages.png",
  snacks: "/uploads/categories/snacks.png",
  household: "/uploads/categories/household.png",
  "personal-care": "/uploads/categories/personal-care.png",
};

const normalizeImageKey = (value?: string | null) =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const getCategorySlug = (category?: string | null) =>
  normalizeImageKey(category).replace(/-and-/g, "-");

const getCategoryImage = (category?: string | null) =>
  categoryImageMap[getCategorySlug(category)] || fallbackGroceryImage;

const getProductImage = ({
  name,
  category,
}: {
  name?: string | null;
  category?: string | null;
}) =>
  productImageMap[normalizeImageKey(name)] ||
  productImageMap[getCategorySlug(category)] ||
  getCategoryImage(category);

const slugify = (value: string) => normalizeImageKey(value);

const parsePrice = (value: string) => Number(value.replace(/[^0-9.]/g, ""));

// ---------------------------------------------------------------------------
// Source data — transcribed from the frontend's hardcoded arrays:
// frontend/app/(homepage)/categories/category-data.ts,
// frontend/app/dashboard/page.tsx, frontend/app/(homepage)/deals/page.tsx
// ---------------------------------------------------------------------------

type SeedProduct = {
  name: string;
  price: string;
  tag: string;
};

type SeedCategory = {
  title: string;
  slug: string;
  description: string;
  products: SeedProduct[];
};

const seedCategories: SeedCategory[] = [
  {
    title: "Fruits",
    slug: "fruits",
    description:
      "Seasonal fruit, berries, bananas, and citrus for fresh daily baskets.",
    products: [
      { name: "Red Lady Apple", price: "$3.60", tag: "Organic" },
      { name: "Mixed Berries", price: "$4.75", tag: "Fresh" },
      { name: "Hass Avocado", price: "$2.40", tag: "Popular" },
      { name: "Sweet Bananas", price: "$1.40", tag: "Daily" },
      { name: "Valencia Oranges", price: "$3.20", tag: "Citrus" },
      { name: "Grapes", price: "$4.10", tag: "Seedless" },
    ],
  },
  {
    title: "Vegetables",
    slug: "vegetables",
    description:
      "Fresh greens, roots, herbs, mushrooms, and local vegetable harvest.",
    products: [
      { name: "Garden Vegetables", price: "$3.95", tag: "Local" },
      { name: "Curly Kale Bunch", price: "$3.25", tag: "Green" },
      { name: "Harvest Carrots", price: "$2.80", tag: "Fresh" },
      { name: "Vine Tomatoes", price: "$2.95", tag: "Juicy" },
      { name: "Potatoes", price: "$2.40", tag: "Staple" },
      { name: "Onions", price: "$1.90", tag: "Daily" },
      { name: "Broccoli", price: "$3.10", tag: "Crunchy" },
    ],
  },
  {
    title: "Meat & Poultry",
    slug: "meat-poultry",
    description: "Chicken, beef, lamb, sausages, and prepared grocery cuts.",
    products: [
      { name: "Chicken Breast Pack", price: "$8.90", tag: "Lean" },
      { name: "Whole Chicken", price: "$11.40", tag: "Family" },
      { name: "Premium Steak Cut", price: "$12.50", tag: "Premium" },
      { name: "Rosemary Beef Cut", price: "$11.25", tag: "Fresh" },
      { name: "Lamb", price: "$13.90", tag: "Tender" },
      { name: "Sausages", price: "$6.40", tag: "Grill" },
    ],
  },
  {
    title: "Dairy & Eggs",
    slug: "dairy-eggs",
    description: "Milk, cheese, yogurt, butter, eggs, and daily dairy essentials.",
    products: [
      { name: "Farm Fresh Milk", price: "$3.20", tag: "Fresh" },
      { name: "Eggs", price: "$4.10", tag: "Farm" },
      { name: "Cheese Board Pack", price: "$6.90", tag: "Popular" },
      { name: "Greek Yogurt Cup", price: "$2.25", tag: "Daily" },
      { name: "Butter", price: "$3.70", tag: "Creamy" },
      { name: "Dairy Breakfast Set", price: "$7.50", tag: "Combo" },
    ],
  },
  {
    title: "Bakery",
    slug: "bakery",
    description: "Bread, pastries, buns, cakes, and freshly baked grocery treats.",
    products: [
      { name: "Fresh Bread Loaf", price: "$3.40", tag: "Baked" },
      { name: "Breakfast Croissant", price: "$2.80", tag: "Morning" },
      { name: "Soft Dinner Rolls", price: "$4.20", tag: "Family" },
      { name: "Sweet Pastry Box", price: "$6.75", tag: "Treat" },
    ],
  },
  {
    title: "Pantry Staples",
    slug: "pantry-staples",
    description: "Rice, pasta, flour, spices, oils, sauces, and dry goods.",
    products: [
      { name: "Rice Pantry Pack", price: "$9.50", tag: "Bulk" },
      { name: "Pasta & Sauce Kit", price: "$5.40", tag: "Staple" },
      { name: "Flour", price: "$3.25", tag: "Baking" },
      { name: "Olive Oil Bottle", price: "$7.75", tag: "Kitchen" },
      { name: "Cooking Spice Set", price: "$6.20", tag: "Aromatic" },
    ],
  },
  {
    title: "Frozen Foods",
    slug: "frozen-foods",
    description: "Frozen vegetables, meals, desserts, and quick cooking options.",
    products: [
      { name: "Frozen Veggie Mix", price: "$4.50", tag: "Frozen" },
      { name: "Quick Meal Tray", price: "$6.80", tag: "Fast" },
      { name: "Frozen Greens Pack", price: "$3.90", tag: "Green" },
      { name: "Frozen Dessert Box", price: "$5.25", tag: "Sweet" },
    ],
  },
  {
    title: "Beverages",
    slug: "beverages",
    description: "Juices, water, tea, coffee, sparkling drinks, and fresh bottles.",
    products: [
      { name: "Fresh Citrus Juice", price: "$3.80", tag: "Juice" },
      { name: "Sparkling Water Pack", price: "$5.60", tag: "Pack" },
      { name: "Tea", price: "$4.30", tag: "Calm" },
      { name: "Cold Coffee Bottle", price: "$2.90", tag: "Chilled" },
      { name: "Soft Drinks", price: "$4.90", tag: "Party" },
    ],
  },
  {
    title: "Snacks",
    slug: "snacks",
    description: "Chips, nuts, biscuits, sweets, fries, and quick bites.",
    products: [
      { name: "Crispy Fries Cup", price: "$2.90", tag: "Crunchy" },
      { name: "Biscuit Snack Box", price: "$3.35", tag: "Tea time" },
      { name: "Mixed Nuts Pack", price: "$4.60", tag: "Protein" },
      { name: "Sweet Treat Bag", price: "$2.75", tag: "Sweet" },
      { name: "Chocolate", price: "$2.50", tag: "Treat" },
    ],
  },
  {
    title: "Household",
    slug: "household",
    description: "Cleaning supplies, laundry, paper goods, and kitchen basics.",
    products: [
      { name: "Laundry Essentials", price: "$9.25", tag: "Fresh" },
      { name: "Kitchen Cleaner", price: "$4.30", tag: "Daily" },
      { name: "Paper Goods Pack", price: "$6.40", tag: "Home" },
      { name: "Dishwash Liquid", price: "$3.90", tag: "Clean" },
      { name: "Cleaning Brush Set", price: "$5.90", tag: "Clean" },
    ],
  },
  {
    title: "Personal Care",
    slug: "personal-care",
    description: "Soap, shampoo, hygiene items, skincare, and everyday care.",
    products: [
      { name: "Shampoo Bottle", price: "$6.90", tag: "Care" },
      { name: "Hand Soap Set", price: "$4.20", tag: "Hygiene" },
      { name: "Toothpaste", price: "$3.20", tag: "Daily" },
      { name: "Body Wash Bottle", price: "$5.50", tag: "Fresh" },
      { name: "Daily Care Pack", price: "$8.75", tag: "Daily" },
    ],
  },
];

// Dashboard "Trending Now" products. Items whose name matches an existing
// category product exactly get flagged isFeatured instead of duplicated.
const trendingProducts = [
  { name: "Organic Hass Avocado", category: "Fruits", price: "$2.40", unit: "/pc" },
  { name: "Organic Raspberries", category: "Fruits", price: "$4.80", unit: "/pt" },
  { name: "Curly Kale Bunch", category: "Vegetables", price: "$3.25", unit: "/ea" },
  { name: "Premium Bananas", category: "Fruits", price: "$0.89", unit: "/lb" },
  { name: "Fresh Bread Loaf", category: "Bakery", price: "$3.40", unit: "/loaf" },
  { name: "Farm Fresh Milk", category: "Dairy & Eggs", price: "$3.20", unit: "/bottle" },
  { name: "Fresh Citrus Juice", category: "Beverages", price: "$3.80", unit: "/bottle" },
  { name: "Crispy Fries Cup", category: "Snacks", price: "$2.90", unit: "/cup" },
  { name: "Laundry Essentials", category: "Household", price: "$9.25", unit: "/pack" },
  { name: "Shampoo Bottle", category: "Personal Care", price: "$6.90", unit: "/bottle" },
];

// deals/page.tsx "Today's Best Deals" bundles — become Products + Deals.
const bestDeals = [
  {
    title: "Snack Variety Party Box",
    description:
      "A crunchy family-size chips mix for movie nights, lunch boxes, and quick snack trays.",
    image: "/uploads/deals/snack-variety-deal.png",
    oldPrice: "$32.00",
    newPrice: "$22.40",
    badge: "30% off",
    category: "Snacks",
  },
  {
    title: "Organic Vegetable Harvest Box",
    description:
      "Fresh greens, carrots, mushrooms, peppers, and market vegetables packed in one box.",
    image: "/uploads/deals/organic-vegetable-box.png",
    oldPrice: "$28.75",
    newPrice: "$20.15",
    badge: "Fresh pick",
    category: "Vegetables",
  },
  {
    title: "Home Care Essentials Bundle",
    description:
      "Daily home and personal care supplies grouped for easy weekly restocking.",
    image: "/uploads/deals/home-care-bundle.png",
    oldPrice: "$24.90",
    newPrice: "$17.40",
    badge: "Save 30%",
    category: "Household",
  },
];

const seed = async () => {
  await mongoose.connect(MONGODB_URL);
  console.log("MongoDB connected for seeding");

  const categoryIdByTitle = new Map<string, mongoose.Types.ObjectId>();
  const productIdByName = new Map<string, mongoose.Types.ObjectId>();

  for (const category of seedCategories) {
    const doc = await CategoryModel.findOneAndUpdate(
      { slug: category.slug },
      {
        $set: {
          title: category.title,
          slug: category.slug,
          description: category.description,
          isActive: true,
        },
        // Only apply the seed default image when the category doc is first
        // created — never clobber an image an admin has since uploaded.
        $setOnInsert: { image: getCategoryImage(category.title) },
      },
      { upsert: true, new: true },
    );

    categoryIdByTitle.set(category.title, doc._id);
    console.log(`Category upserted: ${category.title}`);

    for (const product of category.products) {
      const slug = slugify(product.name);
      const productDoc = await ProductModel.findOneAndUpdate(
        { slug },
        {
          $set: {
            name: product.name,
            slug,
            category: doc._id,
            price: parsePrice(product.price),
            tag: product.tag,
            unit: "",
          },
          $setOnInsert: {
            image: getProductImage({ name: product.name, category: category.title }),
          },
        },
        { upsert: true, new: true },
      );

      productIdByName.set(product.name, productDoc._id);
    }

    console.log(`  ${category.products.length} products upserted`);
  }

  for (const trending of trendingProducts) {
    const existingId = productIdByName.get(trending.name);

    if (existingId) {
      await ProductModel.findByIdAndUpdate(existingId, { isFeatured: true });
      console.log(`Marked featured: ${trending.name}`);
      continue;
    }

    const categoryId = categoryIdByTitle.get(trending.category);

    if (!categoryId) {
      console.warn(
        `Skipping trending product "${trending.name}" — category "${trending.category}" not found`,
      );
      continue;
    }

    const slug = slugify(trending.name);
    const productDoc = await ProductModel.findOneAndUpdate(
      { slug },
      {
        $set: {
          name: trending.name,
          slug,
          category: categoryId,
          price: parsePrice(trending.price),
          unit: trending.unit,
          isFeatured: true,
        },
        $setOnInsert: {
          image: getProductImage({ name: trending.name, category: trending.category }),
        },
      },
      { upsert: true, new: true },
    );

    productIdByName.set(trending.name, productDoc._id);
    console.log(`Created featured product: ${trending.name}`);
  }

  for (const deal of bestDeals) {
    const categoryId = categoryIdByTitle.get(deal.category);

    if (!categoryId) {
      console.warn(
        `Skipping deal "${deal.title}" — category "${deal.category}" not found`,
      );
      continue;
    }

    const slug = slugify(deal.title);
    const oldPrice = parsePrice(deal.oldPrice);
    const newPrice = parsePrice(deal.newPrice);
    const discountPercentage = Math.round(((oldPrice - newPrice) / oldPrice) * 100);

    const productDoc = await ProductModel.findOneAndUpdate(
      { slug },
      {
        $set: {
          name: deal.title,
          slug,
          description: deal.description,
          category: categoryId,
          price: newPrice,
          tag: deal.badge,
          unit: "",
        },
        $setOnInsert: { image: deal.image },
      },
      { upsert: true, new: true },
    );

    await DealModel.findOneAndUpdate(
      { product: productDoc._id },
      {
        $set: {
          title: deal.title,
          description: deal.description,
          product: productDoc._id,
          discountPercentage,
          badge: deal.badge,
          isActive: true,
        },
        $setOnInsert: { image: deal.image },
      },
      { upsert: true, new: true },
    );

    console.log(`Deal upserted: ${deal.title}`);
  }

  console.log("Seeding complete.");
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
