"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiUsers } from "react-icons/fi";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: FiGrid },
  { href: "/admin/users", label: "Users", icon: FiUsers },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="space-y-2 rounded-md border border-gray-200 bg-white p-3 shadow-sm">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold ${
              isActive
                ? "bg-[#079b3b] text-white"
                : "text-gray-600 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
