import { IconType } from "react-icons";
import { FiClock, FiGift, FiShoppingBag, FiTruck } from "react-icons/fi";

export type DealPage = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  icon: IconType;
  href: string;
  cta: string;
};

export const quickDealPages: DealPage[] = [
  {
    slug: "weekend-snack-cart",
    title: "Weekend Snack Cart",
    eyebrow: "Snack bundle",
    description:
      "Add the snack variety box to your next movie-night cart and keep quick bites ready for the weekend.",
    icon: FiShoppingBag,
    href: "/cart",
    cta: "Open cart",
  },
  {
    slug: "fast-delivery-offer",
    title: "Fast Delivery Offer",
    eyebrow: "Delivery support",
    description:
      "FreshCart delivery support helps you restock urgent weekly essentials with a cleaner checkout flow.",
    icon: FiTruck,
    href: "/support",
    cta: "View support",
  },
  {
    slug: "fresh-coupon-picks",
    title: "Fresh Coupon Picks",
    eyebrow: "Coupon picks",
    description:
      "Use the best current FreshCart bundle savings across produce, snack boxes, and home care deals.",
    icon: FiGift,
    href: "/deals#today",
    cta: "Browse deals",
  },
  {
    slug: "limited-time-savings",
    title: "Limited Time Savings",
    eyebrow: "Limited offers",
    description:
      "Daily care bundles and grocery restock offers are refreshed regularly for practical FreshCart savings.",
    icon: FiClock,
    href: "/deals#limited",
    cta: "View offers",
  },
];

export const getQuickDealPage = (slug: string) =>
  quickDealPages.find((deal) => deal.slug === slug);
