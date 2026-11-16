import type { Metadata } from "next";
import Link from "next/link";
import { CatalogBrowser } from "@/components/catalog-browser";
import { ACTIVE_LINES, getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Catálogo de indumentaria laboral: camisas, pantalones, bombachas, bermudas, remeras, chombas y ambos.",
  alternates: { canonical: "/catalogo/" },
};

export default function Catalogo() {
  const { lines, products } = getCatalog();
  return (
    <div className="wrap">
      <div className="crumbs"><Link href="/">Inicio</Link> / Catálogo</div>
      <h1 className="page-title">Catálogo</h1>
      <CatalogBrowser products={products} categories={ACTIVE_LINES.flatMap((k) => lines[k].categories)} lines={ACTIVE_LINES.map((k) => ({ key: k, name: lines[k].name }))} />
    </div>
  );
}
