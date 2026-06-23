import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2 text-sm font-extrabold text-[#16863d]"
    >
      <Image
        src="/logo.png"
        alt="FreshCart logo"
        width={28}
        height={28}
        className="h-7 w-7 rounded-md object-cover"
        priority
      />
      <span>FreshCart</span>
    </Link>
  );
}
