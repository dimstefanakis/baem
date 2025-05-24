import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import postsData from "@/utils/posts.json";

type ContentBlockParagraph = { type: "paragraph"; text: string };
type ContentBlockHeading = { type: "heading"; level: number; text: string };
type ContentBlockList = { type: "list"; items: string[] };
type ContentBlockLink = { type: "link"; text: string; url: string };
type ContentBlock = ContentBlockParagraph | ContentBlockHeading | ContentBlockList | ContentBlockLink;

type Post = {
  slug: string;
  title: string;
  createdAt: string;
  primaryImage: string;
  content: ContentBlock[];
  seoTitle: string;
  seoDescription: string;
  relatedPosts?: {
    slug: string;
    title: string;
    primaryImage: string;
  }[];
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

  if (block.type === "list") {
    return (
      <ul key={index} className="mb-4 ml-6 list-disc space-y-2">
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex} className="leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "link") {
    return (
      <Link key={index} href={block.url} className="text-blue-500 hover:text-blue-600">{block.text}</Link>
    );
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
                className="object-cover shadow-lg border-2 border-white"
                priority
              />
            </div>
          )}

          <div className="prose prose-lg prose-invert max-w-none mx-auto">
            {post.content.map(renderContentBlock)}
          </div>
          {post.relatedPosts && (
            <div className="flex flex-col w-full items-center mt-10">
              <h2 className="text-2xl font-semibold mb-4">Read Next</h2>
              {post.relatedPosts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.slug}>
                  <div className="flex flex-col gap-2 items-center">
                    <Image src={post.primaryImage} alt={post.title} width={200} height={200} className="shadow-lg border-2 border-white" />
                    <p className="text-center max-w-xs mt-4" dangerouslySetInnerHTML={{__html: post.title}}></p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
