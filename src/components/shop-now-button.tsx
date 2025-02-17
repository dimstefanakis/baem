"use client";
import { motion, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ShopNowButton() {
  const [isFixed, setIsFixed] = useState(false);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight / 6;
      setIsFixed(window.scrollY >= viewportHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isFixed) {
      animate(scope.current, {
        opacity: 0,
        y: 20,
      });
    } else {
      animate(scope.current, {
        opacity: 1,
        y: 0,
      });
    }
  }, [isFixed]);

  return (
      <motion.div
        ref={scope}
        initial={{ opacity: 0, y: 20 }}
        viewport={{ once: true, margin: "-100px" }}
        className="fixed bottom-16 z-50"
      >
      <Link href="/shop">

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative transition-shadow duration-300
         rounded-full border-2 border-black/10 shadow-lg hover:shadow-xl overflow-hidden
         shadow-md border-2 border-white shadow-inner [box-shadow:inset_0_2px_4px_rgba(0,0,0,0.4)] drop-shadow-md"
        >
          <Image
            src="/shopnowbg.png"
            alt="bg"
            fill
            className="object-cover absolute top-0 left-0 right-0 bottom-0 z-[-1]"
          />
          <motion.button
            className={`w-[200px] text-black px-8 py-3 font-semibold text-lg`}
          >
            Shop Now
          </motion.button>
        </motion.div>
      </Link>
    </motion.div>
  );
}
