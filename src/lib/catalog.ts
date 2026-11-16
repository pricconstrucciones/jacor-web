// Catálogo público de la web: lo genera la gestión con «Publicar catálogo» (data/catalogo.json).
// Si todavía no se publicó, se usan datos de EJEMPLO para desarrollar (data/catalogo-ejemplo.json).
// Solo contiene campos públicos: el precio público final (con IVA), nunca costos, precios mayoristas, stock ni notas.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { ACTIVE_LINES, PRODUCT_ORDER } from "./content";
import type { Catalog } from "./types";

export * from "./types";
export { ACTIVE_LINES } from "./content";

let cache: Catalog | null = null;

export function getCatalog(): Catalog {
  if (cache) return cache;
  const real = path.join(process.cwd(), "data", "catalogo.json");
  const file = existsSync(real) ? real : path.join(process.cwd(), "data", "catalogo-ejemplo.json");
  const all = JSON.parse(readFileSync(file, "utf8")) as Catalog;
  // La web muestra solo las líneas activas de esta etapa (ver content.ts); el resto no genera páginas.
  // Orden por defecto: líneas y categorías según el catálogo (indumentaria antes que calzado) y productos según PRODUCT_ORDER
  const cats = ACTIVE_LINES.flatMap((k) => all.lines[k].categories);
  const rank = (slug: string) => { const i = PRODUCT_ORDER.indexOf(slug); return i < 0 ? 999 : i; };
  const products = all.products.filter((p) => ACTIVE_LINES.includes(p.line)).sort((a, b) =>
    ACTIVE_LINES.indexOf(a.line) - ACTIVE_LINES.indexOf(b.line) || cats.indexOf(a.category) - cats.indexOf(b.category) || rank(a.slug) - rank(b.slug) || a.name.localeCompare(b.name, "es"));
  cache = { ...all, products };
  return cache;
}
