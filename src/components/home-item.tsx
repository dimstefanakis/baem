'use client'
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
interface HomeItemProps {
  imageSrc: string;
  title: string;
  slug: string;
}

export default function HomeItem({ imageSrc, title, slug }: HomeItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      className="w-screen h-screen flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >

      <h2 className="text-5xl text-center pb-10">{title}</h2>
      <div className="w-[90%] h-[60vh] md:h-auto md:w-[30%] bg-white relative">
        <Link href={`/shop/${slug}`}>
          <Image
            src="/bg.webp"
            alt="bg"
            fill
            className="absolute object-cover opacity-20 w-full h-full"
            priority
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.8,
              opacity: { duration: 0.8 },
              y: { duration: 0.6 }
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Image
              src={imageSrc}
              alt="item image"
              className="w-full h-full object-contain shadow-md border-2 border-white shadow-inner [box-shadow:inset_0_2px_4px_rgba(0,0,0,0.4)] drop-shadow-md"
              width={642}
              height={857}
            />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}