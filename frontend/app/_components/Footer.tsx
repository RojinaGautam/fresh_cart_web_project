import Link from "next/link";
import { FiGlobe, FiShare2 } from "react-icons/fi";

const footerGroups = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/dashboard" },
      { label: "Organic Fruit", href: "/dashboard" },
      { label: "Fresh Greens", href: "/dashboard" },
      { label: "Local Dairy", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Sustainability", href: "/about" },
      { label: "Farmer Partners", href: "/about" },
      { label: "Careers", href: "/support" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/support" },
      { label: "Shipping Policy", href: "/support" },
      { label: "Returns", href: "/support" },
      { label: "Contact Us", href: "/support" },
    ],
  },
];

export default function Footer({ wide = false }: { wide?: boolean }) {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div
        className={`mx-auto w-full px-5 py-10 md:px-8 ${
          wide ? "max-w-[1500px]" : "max-w-6xl"
        }`}
      >
        <div className="grid gap-8 text-xs text-gray-500 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <p className="text-sm font-semibold text-[#16863d]">FreshCart</p>
            <p className="mt-3 max-w-xs leading-5">
              Direct from local farms to your kitchen. We believe in
              transparency, sustainability, and the power of fresh ingredients.
            </p>
            <div className="mt-4 flex gap-3 text-[#26332b]">
              <FiGlobe size={15} />
              <FiShare2 size={15} />
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="font-bold text-[#26332b]">{group.title}</p>
              <div className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block transition hover:text-green-700"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-gray-100 pt-5 text-[10px] text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 FreshCart. All rights reserved.</p>
          <div className="flex gap-5">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
