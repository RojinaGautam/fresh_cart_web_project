import dotenv from "dotenv";
import mongoose from "mongoose";
import { MONGODB_URL } from "../configs/constant";
import { CategoryModel } from "../models/category.model";
import { ProductModel } from "../models/product.model";
import { DealModel } from "../models/deal.model";

dotenv.config();

// ---------------------------------------------------------------------------
// Image resolution helpers — mirrors frontend/lib/productImages.ts exactly so
// seeded Product/Category `image` fields resolve to the same static assets
// the frontend already serves from /public/images.
// ---------------------------------------------------------------------------

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
  "premium-bananas": "/images/products/bananas.png",
  strawberry: "/images/products/strawberries.png",
  strawberries: "/images/products/strawberries.png",
  "mixed-berries": "/images/products/strawberries.png",
  "organic-raspberries": "/images/products/strawberries.png",
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
  oldPrice: string;
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
      { name: "Red Lady Apple", price: "$3.60", oldPrice: "$4.20", tag: "Organic" },
      { name: "Mixed Berries", price: "$4.75", oldPrice: "$5.30", tag: "Fresh" },
      { name: "Hass Avocado", price: "$2.40", oldPrice: "$3.00", tag: "Popular" },
      { name: "Sweet Bananas", price: "$1.40", oldPrice: "$1.80", tag: "Daily" },
      { name: "Valencia Oranges", price: "$3.20", oldPrice: "$3.90", tag: "Citrus" },
      { name: "Grapes", price: "$4.10", oldPrice: "$4.80", tag: "Seedless" },
    ],
  },
  {
    title: "Vegetables",
    slug: "vegetables",
    description:
      "Fresh greens, roots, herbs, mushrooms, and local vegetable harvest.",
    products: [
      { name: "Garden Vegetables", price: "$3.95", oldPrice: "$4.50", tag: "Local" },
      { name: "Curly Kale Bunch", price: "$3.25", oldPrice: "$3.90", tag: "Green" },
      { name: "Harvest Carrots", price: "$2.80", oldPrice: "$3.30", tag: "Fresh" },
      { name: "Vine Tomatoes", price: "$2.95", oldPrice: "$3.50", tag: "Juicy" },
      { name: "Potatoes", price: "$2.40", oldPrice: "$2.90", tag: "Staple" },
      { name: "Onions", price: "$1.90", oldPrice: "$2.30", tag: "Daily" },
      { name: "Broccoli", price: "$3.10", oldPrice: "$3.70", tag: "Crunchy" },
    ],
  },
  {
    title: "Meat & Poultry",
    slug: "meat-poultry",
    description: "Chicken, beef, lamb, sausages, and prepared grocery cuts.",
    products: [
      { name: "Chicken Breast Pack", price: "$8.90", oldPrice: "$10.30", tag: "Lean" },
      { name: "Whole Chicken", price: "$11.40", oldPrice: "$12.80", tag: "Family" },
      { name: "Premium Steak Cut", price: "$12.50", oldPrice: "$14.00", tag: "Premium" },
      { name: "Rosemary Beef Cut", price: "$11.25", oldPrice: "$13.20", tag: "Fresh" },
      { name: "Lamb", price: "$13.90", oldPrice: "$15.50", tag: "Tender" },
      { name: "Sausages", price: "$6.40", oldPrice: "$7.20", tag: "Grill" },
    ],
  },
  {
    title: "Dairy & Eggs",
    slug: "dairy-eggs",
    description: "Milk, cheese, yogurt, butter, eggs, and daily dairy essentials.",
    products: [
      { name: "Farm Fresh Milk", price: "$3.20", oldPrice: "$3.90", tag: "Fresh" },
      { name: "Eggs", price: "$4.10", oldPrice: "$4.80", tag: "Farm" },
      { name: "Cheese Board Pack", price: "$6.90", oldPrice: "$8.20", tag: "Popular" },
      { name: "Greek Yogurt Cup", price: "$2.25", oldPrice: "$2.90", tag: "Daily" },
      { name: "Butter", price: "$3.70", oldPrice: "$4.20", tag: "Creamy" },
      { name: "Dairy Breakfast Set", price: "$7.50", oldPrice: "$8.60", tag: "Combo" },
    ],
  },
  {
    title: "Bakery",
    slug: "bakery",
    description: "Bread, pastries, buns, cakes, and freshly baked grocery treats.",
    products: [
      { name: "Fresh Bread Loaf", price: "$3.40", oldPrice: "$4.10", tag: "Baked" },
      { name: "Breakfast Croissant", price: "$2.80", oldPrice: "$3.30", tag: "Morning" },
      { name: "Soft Dinner Rolls", price: "$4.20", oldPrice: "$4.90", tag: "Family" },
      { name: "Sweet Pastry Box", price: "$6.75", oldPrice: "$7.80", tag: "Treat" },
    ],
  },
  {
    title: "Pantry Staples",
    slug: "pantry-staples",
    description: "Rice, pasta, flour, spices, oils, sauces, and dry goods.",
    products: [
      { name: "Rice Pantry Pack", price: "$9.50", oldPrice: "$10.80", tag: "Bulk" },
      { name: "Pasta & Sauce Kit", price: "$5.40", oldPrice: "$6.10", tag: "Staple" },
      { name: "Flour", price: "$3.25", oldPrice: "$3.80", tag: "Baking" },
      { name: "Olive Oil Bottle", price: "$7.75", oldPrice: "$9.00", tag: "Kitchen" },
      { name: "Cooking Spice Set", price: "$6.20", oldPrice: "$7.50", tag: "Aromatic" },
    ],
  },
  {
    title: "Frozen Foods",
    slug: "frozen-foods",
    description: "Frozen vegetables, meals, desserts, and quick cooking options.",
    products: [
      { name: "Frozen Veggie Mix", price: "$4.50", oldPrice: "$5.20", tag: "Frozen" },
      { name: "Quick Meal Tray", price: "$6.80", oldPrice: "$7.60", tag: "Fast" },
      { name: "Frozen Greens Pack", price: "$3.90", oldPrice: "$4.40", tag: "Green" },
      { name: "Frozen Dessert Box", price: "$5.25", oldPrice: "$6.20", tag: "Sweet" },
    ],
  },
  {
    title: "Beverages",
    slug: "beverages",
    description: "Juices, water, tea, coffee, sparkling drinks, and fresh bottles.",
    products: [
      { name: "Fresh Citrus Juice", price: "$3.80", oldPrice: "$4.50", tag: "Juice" },
      { name: "Sparkling Water Pack", price: "$5.60", oldPrice: "$6.40", tag: "Pack" },
      { name: "Tea", price: "$4.30", oldPrice: "$5.10", tag: "Calm" },
      { name: "Cold Coffee Bottle", price: "$2.90", oldPrice: "$3.40", tag: "Chilled" },
      { name: "Soft Drinks", price: "$4.90", oldPrice: "$5.70", tag: "Party" },
    ],
  },
  {
    title: "Snacks",
    slug: "snacks",
    description: "Chips, nuts, biscuits, sweets, fries, and quick bites.",
    products: [
      { name: "Crispy Fries Cup", price: "$2.90", oldPrice: "$3.50", tag: "Crunchy" },
      { name: "Biscuit Snack Box", price: "$3.35", oldPrice: "$3.90", tag: "Tea time" },
      { name: "Mixed Nuts Pack", price: "$4.60", oldPrice: "$5.30", tag: "Protein" },
      { name: "Sweet Treat Bag", price: "$2.75", oldPrice: "$3.20", tag: "Sweet" },
      { name: "Chocolate", price: "$2.50", oldPrice: "$3.00", tag: "Treat" },
    ],
  },
  {
    title: "Household",
    slug: "household",
    description: "Cleaning supplies, laundry, paper goods, and kitchen basics.",
    products: [
      { name: "Laundry Essentials", price: "$9.25", oldPrice: "$10.50", tag: "Fresh" },
      { name: "Kitchen Cleaner", price: "$4.30", oldPrice: "$5.00", tag: "Daily" },
      { name: "Paper Goods Pack", price: "$6.40", oldPrice: "$7.20", tag: "Home" },
      { name: "Dishwash Liquid", price: "$3.90", oldPrice: "$4.60", tag: "Clean" },
      { name: "Cleaning Brush Set", price: "$5.90", oldPrice: "$6.80", tag: "Clean" },
    ],
  },
  {
    title: "Personal Care",
    slug: "personal-care",
    description: "Soap, shampoo, hygiene items, skincare, and everyday care.",
    products: [
      { name: "Shampoo Bottle", price: "$6.90", oldPrice: "$7.80", tag: "Care" },
      { name: "Hand Soap Set", price: "$4.20", oldPrice: "$4.90", tag: "Hygiene" },
      { name: "Toothpaste", price: "$3.20", oldPrice: "$3.90", tag: "Daily" },
      { name: "Body Wash Bottle", price: "$5.50", oldPrice: "$6.20", tag: "Fresh" },
      { name: "Daily Care Pack", price: "$8.75", oldPrice: "$9.80", tag: "Daily" },
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
    image: "/images/deals/snack-variety-deal.png",
    oldPrice: "$32.00",
    newPrice: "$22.40",
    badge: "30% off",
    category: "Snacks",
  },
  {
    title: "Organic Vegetable Harvest Box",
    description:
      "Fresh greens, carrots, mushrooms, peppers, and market vegetables packed in one box.",
    image: "/images/deals/organic-vegetable-box.png",
    oldPrice: "$28.75",
    newPrice: "$20.15",
    badge: "Fresh pick",
    category: "Vegetables",
  },
  {
    title: "Home Care Essentials Bundle",
    description:
      "Daily home and personal care supplies grouped for easy weekly restocking.",
    image: "/images/deals/home-care-bundle.png",
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
        title: category.title,
        slug: category.slug,
        description: category.description,
        image: getCategoryImage(category.title),
        isActive: true,
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
          name: product.name,
          slug,
          category: doc._id,
          price: parsePrice(product.price),
          oldPrice: parsePrice(product.oldPrice),
          image: getProductImage({ name: product.name, category: category.title }),
          tag: product.tag,
          unit: "",
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
        name: trending.name,
        slug,
        category: categoryId,
        price: parsePrice(trending.price),
        image: getProductImage({ name: trending.name, category: trending.category }),
        unit: trending.unit,
        isFeatured: true,
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
        name: deal.title,
        slug,
        description: deal.description,
        category: categoryId,
        price: newPrice,
        oldPrice,
        image: deal.image,
        tag: deal.badge,
        unit: "",
      },
      { upsert: true, new: true },
    );

    await DealModel.findOneAndUpdate(
      { product: productDoc._id },
      {
        title: deal.title,
        description: deal.description,
        product: productDoc._id,
        discountPercentage,
        badge: deal.badge,
        isActive: true,
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
