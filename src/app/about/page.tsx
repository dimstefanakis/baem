import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="">
      <main className="container max-w-screen-md mx-auto px-4 py-8 font-lusitana">
        <div className="fixed inset-0 w-screen h-screen -z-10">
          <Image
            src="/bg.webp"
            alt="Background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <h1 className="text-4xl font-bold mb-8 text-center">About Mona Baem</h1>
        <div className="relative flex flex-1 flex-col items-center justify-center sm:mt-[100px]">
          <div className="space-y-6 text-lg">
            <p>Hey, and welcome to my world!</p>
            <p>
              My work is all about bold visual identity and clean, meaningful
              design. I focus on five main tattoo styles: Cybersigilism, Anime,
              Neo-Tribal, Y2K, and Gothic. Each category reflects a part of my
              influences — from digital minimalism and sacred geometry to
              nostalgic 2000s aesthetics and anime culture.
            </p>
            <p>
              I design for people all around the world. I&apos;m inspired by
              architecture, subcultures, internet visuals, and the power of
              strong symbolism. Whether you&apos;re into structured linework or soft
              character art, my goal is to create pieces that are personal,
              well-designed, and lasting.
            </p>
            <p>
              Thanks for being here — I hope you find something that speaks to
              you.
            </p>
            <p>xx Mona 𓆙</p>
          </div>
        </div>
      </main>
    </div>
  );
}
