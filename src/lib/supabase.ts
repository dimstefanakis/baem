import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types_db";

export const createClient = (tags?: string[]) =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) =>
          fetch(input, {
            ...init,
            cache: "no-store",
            next: {
              tags: tags ?? [],
            },
          }),
      },
    },
  );
