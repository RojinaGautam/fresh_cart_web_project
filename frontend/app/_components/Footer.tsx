import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 text-[11px] text-gray-500 md:grid-cols-[1fr_auto_auto]">
        <div>
          <p className="font-black text-green-700">FreshCart</p>
          <p className="mt-2 max-w-xs">
            FreshCart. Smoothly Delivered to Your Door.
          </p>
        </div>
        <div>
          <p className="font-bold text-gray-800">Company</p>
          <Link href="/dashboard" className="mt-2 block hover:text-green-700">
            About Us
          </Link>
          <Link href="/dashboard" className="mt-1 block hover:text-green-700">
            Sustainability
          </Link>
        </div>
        <div>
          <p className="font-bold text-gray-800">Support</p>
          <Link href="/dashboard" className="mt-2 block hover:text-green-700">
            Privacy Policy
          </Link>
          <Link href="/dashboard" className="mt-1 block hover:text-green-700">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
}
