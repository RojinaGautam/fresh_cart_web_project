import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/dashboard" className="text-sm font-black text-green-700">
      FreshCart
    </Link>
  );
}
