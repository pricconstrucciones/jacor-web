"use client";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const uniq = (xs: string[]) => [...new Set(xs)].sort((a, b) => a.localeCompare(b, "es", { numeric: true }));

/** Búsqueda y filtros en el navegador (el catálogo es chico y ya viene completo en la página). */
export function CatalogBrowser({ products, categories, lines }: { products: Product[]; categories?: string[]; lines?: { key: string; name: string }[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const cats = categories ?? uniq(products.map((p) => p.category));
  // Acceso directo desde el inicio: /catalogo/?categoria=Camisas
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("categoria");
    if (c && cats.includes(c)) setCat(c);
    const b = params.get("buscar");
    if (b) setQ(b.slice(0, 60));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const colors = uniq(products.flatMap((p) => p.colors));
  const shown = useMemo(() => products.filter((p) =>
    (!q || norm(`${p.name} ${p.category} ${p.brand} ${p.summary ?? ""} ${p.description ?? ""}`).includes(norm(q))) &&
    (!cat || p.category === cat) && (!color || p.colors.includes(color))), [products, q, cat, color]);

  const group = (title: string, values: string[], value: string | null, set: (v: string | null) => void) => values.length > 0 && (
    <>
      <h4>{title}</h4>
      {values.map((v) => <button key={v} type="button" className={`chip${value === v ? " on" : ""}`} aria-pressed={value === v} onClick={() => set(value === v ? null : v)}>{v}</button>)}
    </>
  );

  return (
    <div className="catalog">
      <aside className="filters" aria-label="Filtros">
        <label className="muted" htmlFor="buscar">Buscar</label>
        <input id="buscar" className="search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Producto, categoría o marca" />
        {cats.length > 1 && group("Categoría", cats, cat, setCat)}
        {group("Color", colors, color, setColor)}
      </aside>
      <div>
        <p className="muted" aria-live="polite">{shown.length} {shown.length === 1 ? "producto" : "productos"}</p>
        {!shown.length ? <p className="placeholder">No hay productos que coincidan con la búsqueda.</p>
          : lines && new Set(shown.map((p) => p.line)).size > 1
            // Varias líneas a la vista: una sección por línea, en el orden del catálogo (indumentaria primero)
            ? lines.map((l) => { const ps = shown.filter((p) => p.line === l.key); return ps.length > 0 && (
                <section key={l.key} className="line-sec" aria-labelledby={`linea-${l.key}`}>
                  <div className="line-head"><h2 id={`linea-${l.key}`}>{l.name}</h2><span className="muted">{ps.length} {ps.length === 1 ? "producto" : "productos"}</span></div>
                  <div className="products">{ps.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
                </section>); })
            : <div className="products">{shown.map((p) => <ProductCard key={p.slug} p={p} />)}</div>}
      </div>
    </div>
  );
}
