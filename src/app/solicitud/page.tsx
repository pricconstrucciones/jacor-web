import type { Metadata } from "next";
import Link from "next/link";
import { RequestForm, type PriceIndex } from "@/components/request-form";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = { title: "Carrito", robots: { index: false } };

export default function Carrito() {
  // Solo los precios públicos finales del catálogo (con IVA): la gestión los verifica de nuevo al recibir el pedido
  const prices: PriceIndex = Object.fromEntries(getCatalog().products.map((p) => [p.slug, { prices: p.prices }]));
  return (
    <div className="wrap">
      <div className="crumbs"><Link href="/">Inicio</Link> / Carrito</div>
      <h1 className="page-title">Carrito</h1>
      <RequestForm prices={prices} />
    </div>
  );
}
