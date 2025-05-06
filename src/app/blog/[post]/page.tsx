import Image from "next/image";
import { notFound } from "next/navigation";
import postsData from "@/utils/posts.json";

type ContentBlockParagraph = { type: "paragraph"; text: string };
type ContentBlockHeading = { type: "heading"; level: number; text: string };
type ContentBlock = ContentBlockParagraph | ContentBlockHeading;

type Post = {
  slug: string;
  title: string;
  createdAt: string;
  primaryImage: string;
  content: ContentBlock[];
  seoTitle: string;
  seoDescription: string;
};

// Explicitly type the imported JSON data
const posts: Post[] = postsData as Post[];

export async function generateStaticParams() {
  return posts.map((post) => ({
    post: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ post: string }> }) {
  const internalParams = await params;
  const post = getPost(internalParams.post);

  if (!post) {
    notFound();
  }

  return {
    title: post.seoTitle,
    description: post.seoDescription,
  };
}

function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

const renderContentBlock = (block: ContentBlock, index: number) => {
  if (block.type === "paragraph") {
    return (
      <p key={index} className="mb-4 leading-relaxed">
        {block.text}
      </p>
    );
  }

  if (block.type === "heading") {
    switch (block.level) {
      case 1:
        return <h1 key={index} className="text-3xl font-semibold mt-6 mb-3">{block.text}</h1>;
      case 2:
        return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3">{block.text}</h2>;
      case 3:
        return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{block.text}</h3>;
      case 4:
        return <h4 key={index} className="text-lg font-semibold mt-6 mb-3">{block.text}</h4>;
      case 5:
        return <h5 key={index} className="text-base font-semibold mt-6 mb-3">{block.text}</h5>;
      case 6:
        return <h6 key={index} className="text-sm font-semibold mt-6 mb-3">{block.text}</h6>;
      default:
        // Fallback to h2 if level is unspecified or out of range for typical use
        return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3">{block.text}</h2>;
    }
  }
  return null;
};

export default async function PostPage({ params }: { params: Promise<{ post: string }> }) {
  const internalParams = await params;
  const post = getPost(internalParams.post);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen relative font-lusitana tracking-tight">
      <main className="container max-w-screen-md mx-auto px-4 py-8 font-lusitana">
        <div className="fixed inset-0 w-screen h-screen -z-10">
          <Image
            src="/bg.webp" // Assuming a general background image
            alt="Background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        <article className="bg-white bg-opacity-10 p-6 sm:p-10 shadow-xl rounded-lg">
          <h1 className="text-3xl sm:text-3xl font-bold mb-4 text-center" dangerouslySetInnerHTML={{ __html: post.title }}>
          </h1>
          <p className="text-sm mb-6 text-center">
            Published on {formatDate(post.createdAt)}
          </p>

          {post.primaryImage && (
            <div className="mb-8 flex justify-center">
              <Image
                src={post.primaryImage}
                alt={post.title}
                width={400} // Adjust as needed
                height={400} // Adjust as needed
                className="object-cover rounded-md shadow-lg border-2 border-white"
                priority
              />
            </div>
          )}

          <div className="prose prose-lg prose-invert max-w-none mx-auto">
            {post.content.map(renderContentBlock)}
          </div>
        </article>
      </main>
    </div>
  );
}

// Basic styling for prose elements (can be expanded or moved to a global CSS file)
// Ensure you have Tailwind Typography plugin if you use 'prose' classes extensively.
// If not, define custom styles for h2, h3, p etc.
// For example, if you don't use the prose plugin:
// h2: text-2xl font-semibold mt-6 mb-3
// p: mb-4 leading-relaxed
