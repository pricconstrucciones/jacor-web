// Tipos del catálogo público y utilidades sin acceso a archivos (se usan también en el navegador).
export type LineKey = "indumentaria-laboral" | "calzado-de-seguridad" | "epp";
export type Product = {
  slug: string; name: string; brand: string; category: string; line: LineKey; description: string | null;
  colors: string[]; sizes: string[]; images: { file: string; alt: string; color?: string }[]; // color: arma la galería por color (no habilita variantes)
  // Ficha comercial (opcionales: el catálogo de ejemplo no los trae)
  code?: string; summary?: string | null; pendingSizes?: string[];
  /** Colores a confirmar: se ven y se pueden pedir solo como preferencia (JACOR los valida). */
  colorsPending?: string[];
  /** Precio público FINAL con IVA incluido (null = a confirmar). Nunca hay precios mayoristas en la web. */
  prices?: { base: number | null; bySize?: Record<string, number | null> }; specs?: { label: string; value: string }[]; care?: string | null; pendingVariants?: boolean;
};
export type Catalog = { generatedAt: string; ejemplo?: boolean; lines: Record<LineKey, { name: string; categories: string[] }>; products: Product[] };

export const LINE_KEYS: LineKey[] = ["indumentaria-laboral", "calzado-de-seguridad", "epp"];
export const imageUrl = (file: string) => `/catalogo/${file}`;

/** Importe en pesos, sin centavos si es redondo: $ 31.000 */
export const money = (n: number) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });
/** Precio público final de un talle (null = a confirmar o sin precio publicado). */
export function priceFor(p: Pick<Product, "prices">, size: string | null): number | null {
  if (!p.prices) return null;
  if (p.prices.bySize && size) return size in p.prices.bySize ? p.prices.bySize[size] : null;
  return p.prices.base;
}
/** Precio más bajo con valor y si varía según el talle (para «Desde $ …»). */
export function fromPrice(p: Pick<Product, "prices">): { min: number | null; varies: boolean } {
  if (!p.prices) return { min: null, varies: false };
  const vals = [p.prices.base, ...Object.values(p.prices.bySize ?? {})].filter((v): v is number => v !== null);
  const min = vals.length ? Math.min(...vals) : null;
  return { min, varies: !!p.prices.bySize && new Set(Object.values(p.prices.bySize)).size > 1 };
}

export const PROVINCES = [
  "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes",
  "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones",
  "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe",
  "Santiago del Estero", "Tierra del Fuego", "Tucumán",
] as const;

export const FREQUENCIES = { MENSUAL: "Mensual", BIMESTRAL: "Bimestral", TRIMESTRAL: "Trimestral", SEMESTRAL: "Semestral", ANUAL: "Anual" } as const;

/** Buzón de solicitudes (por ahora, la gestión local). Se fija al generar el sitio. */
export const INBOX_URL = (process.env.NEXT_PUBLIC_SOLICITUDES_URL ?? "http://127.0.0.1:3000/api/publico").replace(/\/$/, "");
