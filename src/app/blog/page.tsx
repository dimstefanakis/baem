import Image from "next/image";
import Link from "next/link";
import posts from "@/utils/posts.json"; // Import the posts data

// Define a type for individual post previews, mirroring the JSON structure
type PostPreview = {
  slug: string;
  title: string;
  createdAt: string;
  primaryImage: string;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function Blog() {
  return (
    <div className="min-h-screen relative font-lusitana tracking-tight">
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
        <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
        <div className="relative flex flex-1 flex-col items-start justify-center sm:mt-[100px]">
          <div className="space-y-10 text-lg w-full"> {/* Increased space-y for better separation */}
            {(posts as PostPreview[]).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div className="w-full flex flex-col sm:flex-row min-h-[200px] items-center group">
                  <div className="w-full sm:w-1/3 md:w-1/4 flex-shrink-0">
                    <Image
                      src={post.primaryImage}
                      alt={post.title}
                      width={200}
                      height={200}
                      className="object-cover w-full h-auto block border-2 border-white shadow-md group-hover:shadow-lg transition-shadow duration-300 rounded"
                      priority={false}
                    />
                  </div>
                  <div className="flex flex-col w-full h-full justify-center space-y-2 mt-4 sm:mt-0 sm:ml-6">
                    <h2 className="text-2xl font-medium transition-colors duration-300" dangerouslySetInnerHTML={{ __html: post.title }}>
                    </h2>
                    <p className="text-sm font-bold">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
