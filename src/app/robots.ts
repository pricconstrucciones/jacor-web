import type { MetadataRoute } from "next";
import { abs, INDEXABLE } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/solicitud/"] }, sitemap: abs("/sitemap.xml") };
}
