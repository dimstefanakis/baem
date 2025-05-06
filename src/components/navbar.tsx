"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BurgerMenu } from "@/components/BurgerMenu";

export function Navbar() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <header className="items-center px-10 top-0 z-50 w-full border-b backdrop-blur">
      <div className="flex w-full items-center justify-center h-14 relative">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-custom text-xl">MonaBaem</span>
        </Link>
        <div className="absolute right-0 flex items-center">
          <BurgerMenu />
        </div>
      </div>
    </header>
  );
}