import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogBrowser } from "@/components/catalog-browser";
import { ACTIVE_LINES, getCatalog, type LineKey } from "@/lib/catalog";

export const dynamicParams = false;
export const generateStaticParams = () => ACTIVE_LINES.map((linea) => ({ linea }));

type Props = { params: Promise<{ linea: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { linea } = await params;
  const line = ACTIVE_LINES.includes(linea as LineKey) ? getCatalog().lines[linea as LineKey] : undefined;
  if (!line) return {};
  return { title: line.name, description: `${line.name}: ${line.categories.join(", ").toLowerCase()}. Solicitá tu cotización.`, alternates: { canonical: `/catalogo/${linea}/` } };
}

export default async function Linea({ params }: Props) {
  const { linea } = await params;
  const { lines, products } = getCatalog();
  const line = ACTIVE_LINES.includes(linea as LineKey) ? lines[linea as LineKey] : undefined;
  if (!line) notFound(); // líneas no activas en esta etapa (ver content.ts)
  return (
    <div className="wrap">
      <div className="crumbs"><Link href="/">Inicio</Link> / <Link href="/catalogo/">Catálogo</Link> / {line.name}</div>
      <h1 className="page-title">{line.name}</h1>
      <CatalogBrowser products={products.filter((p) => p.line === linea)} />
    </div>
  );
}
