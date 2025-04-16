import { createClient } from "@/lib/supabase";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const { data: products, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    console.error("Error fetching products for sitemap:", error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
    ];
  }

  const productUrls: MetadataRoute.Sitemap = products?.map((product) => ({
    url: `${baseUrl}/i/${product.id}`,
    lastModified: product.created_at
      ? new Date(product.created_at)
      : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  })) ?? [];

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
  ];

  return [...staticUrls, ...productUrls];
}
