import type { MetadataRoute } from "next";
import { ACTIVE_LINES, getCatalog } from "@/lib/catalog";
import { abs } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const { generatedAt, products } = getCatalog();
  const lastModified = new Date(generatedAt);
  const pages = ["/", "/catalogo/", "/empresas/", "/nosotros/", "/contacto/", "/privacidad/"];
  return [
    ...pages.map((p) => ({ url: abs(p), lastModified })),
    ...ACTIVE_LINES.map((k) => ({ url: abs(`/catalogo/${k}/`), lastModified })),
    ...products.map((p) => ({ url: abs(`/producto/${p.slug}/`), lastModified })),
  ];
}
