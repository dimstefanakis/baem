import { createClient } from "@/lib/supabase";
import { MetadataRoute } from "next";
import postsData from "@/utils/posts.json"; // Import blog posts

// Define a type for the post structure, specifically for sitemap generation
type PostSitemapEntry = {
  slug: string;
  createdAt: string;
  // Add other fields if needed for sitemap logic in the future
};

const posts: PostSitemapEntry[] = postsData as PostSitemapEntry[];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const { data: products, error } = await supabase
    .from("products")
    .select("*");

  let productUrls: MetadataRoute.Sitemap = [];
  if (error) {
    console.error("Error fetching products for sitemap:", error);
    // Continue without product URLs if there's an error
  } else if (products) {
    productUrls = products.map((product) => ({
      url: `${baseUrl}/i/${product.id}`,
      lastModified: product.created_at
        ? new Date(product.created_at)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  }

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`, // Add the main blog page
      lastModified: new Date(), // Or use the latest post's date
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const blogPostUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.createdAt),
    changeFrequency: "monthly", // Or "weekly" if posts are updated often
    priority: 0.6,
  }));

  return [...staticUrls, ...productUrls, ...blogPostUrls];
}
