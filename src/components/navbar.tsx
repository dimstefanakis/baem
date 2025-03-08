"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  
  if (pathname === "/") {
    return null;
  }

  return (
    <header className="items-center px-10 top-0 z-50 w-full border-b backdrop-blur">
      <div className="flex w-full items-center justify-center h-14">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-custom text-xl">MonaBaem</span>
        </Link>
      </div>
    </header>
  );
} 