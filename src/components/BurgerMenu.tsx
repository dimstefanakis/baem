"use client";

import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import burgerIcon from "@/icons/burger.svg";

export function BurgerMenu({ useBackground = true }: { useBackground?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image src={burgerIcon} height={48} width={28} className="cursor-pointer py-2 text-black" alt="menu" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`rounded-none border-2 border-white shadow mr-[15px] ${useBackground ? 'bg-[url(/bg.webp)] bg-white/80 bg-blend-lighten' : 'bg-transparent'}`}>
        <DropdownMenuItem className="text-black text-lg cursor-pointer font-lusitana">
          <Link href="/blog">Blog</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-black text-lg cursor-pointer font-lusitana">
          <Link href="/about">About Mona Baem</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-black text-lg cursor-pointer font-lusitana">
          <Link
            href={`mailto:monabaemtattoo@gmail.com?subject=Contact Mona Baem&body=Hi, I'm interested in getting a tattoo design from Mona Baem.`}
          >
            Contact
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-black text-lg cursor-pointer font-lusitana">
          <Link href="https://www.instagram.com/mona.baem_tattoo" target="_blank">Instagram</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 