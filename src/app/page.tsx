import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/category-card";
import { ACTIVE_LINES, getCatalog } from "@/lib/catalog";
import { CATEGORY_IMAGES, HERO, OMBU } from "@/lib/content";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Inicio() {
  const { lines, products } = getCatalog();
  // Primero indumentaria, después calzado; sin categorías vacías
  const categories = ACTIVE_LINES.flatMap((k) => lines[k].categories).filter((c) => products.some((p) => p.category === c));
  return (
    <>
      {/* Portada editorial: foto panorámica dominante, texto HTML superpuesto sobre un degradado para la legibilidad */}
      <section className="hero-ed" aria-labelledby="hero-titulo">
        {HERO.image && <img className="hero-ed-img" src={HERO.image} alt={HERO.imageAlt} width={1672} height={941} fetchPriority="high" decoding="async" />}
        <div className="hero-ed-shade" aria-hidden="true" />
        <div className="wrap hero-ed-content">
          <span className="hero-ed-rule" aria-hidden="true" />
          <h1 id="hero-titulo">{HERO.title}</h1>
          <p className="hero-ed-sub">{HERO.subtitle}</p>
          <p className="hero-ed-actions">
            <Link className="btn btn-primary btn-lg" href="/catalogo/">Ver catálogo</Link>
            <Link className="btn btn-ghost btn-lg" href="/solicitud/?tipo=empresa">Pedir cotización para empresas</Link>
          </p>
        </div>
      </section>

      {/* Línea OMBÚ: marca de las prendas que comercializa JACOR (no reemplaza a JACOR como identidad del sitio) */}
      <section className="ombu" aria-labelledby="ombu-titulo">
        <div className="wrap ombu-grid">
          <img className="ombu-logo" src={OMBU.logo} alt="OMBÚ" width={124} height={109} loading="lazy" />
          <div>
            <h2 id="ombu-titulo">{OMBU.title}</h2>
            <p>{OMBU.text}</p>
          </div>
          <Link className="btn btn-dark" href={OMBU.href}>Ver prendas OMBÚ</Link>
        </div>
      </section>

      <section className="section cats" aria-labelledby="cats-titulo">
        <div className="wrap">
          <div className="cats-head">
            <h2 id="cats-titulo">Catálogo</h2>
            <Link className="cats-all" href="/catalogo/">Ver todo el catálogo <span aria-hidden="true">→</span></Link>
          </div>
          <div className="cats-grid">
            {categories.map((c) => <CategoryCard key={c} name={c} image={CATEGORY_IMAGES[c]} />)}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap grid2">
          <div className="path empresa">
            <h2 style={{ color: "#fff" }}>Empresas</h2>
            <p>Compras por volumen, varios talles por pedido y compras recurrentes.</p>
            <Link className="btn btn-primary" href="/empresas/">Soluciones para empresas</Link>
          </div>
          <div className="path particular">
            <h2 style={{ color: "#fff" }}>Particulares</h2>
            <p>Elegí el producto, el color y el talle, sumalo al carrito y enviá tu pedido. Lo confirmamos antes de cualquier cobro.</p>
            <Link className="btn btn-ghost" href="/catalogo/">Ver catálogo</Link>
          </div>
        </div>
      </section>
    </>
  );
}
