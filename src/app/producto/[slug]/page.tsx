import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToRequest } from "@/components/add-to-request";
import { ColorPicker, ColorProvider, ProductGallery } from "@/components/product-gallery";
import { getCatalog, imageUrl, type Product } from "@/lib/catalog";
import { abs, SITE_NAME } from "@/lib/site";

// «<» escapado dentro del JSON-LD, para que el texto no pueda cerrar la etiqueta <script>.
const LT_ESCAPED = `${String.fromCharCode(92)}u003c`;

// La exportación estática exige al menos una página: sin productos publicados se genera una que responde «no encontrado».
const EMPTY = "sin-productos";
export const dynamicParams = false;
export function generateStaticParams() {
  const slugs = getCatalog().products.map((p) => ({ slug: p.slug }));
  return slugs.length ? slugs : [{ slug: EMPTY }];
}

type Props = { params: Promise<{ slug: string }> };
const find = (slug: string) => getCatalog().products.find((p) => p.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = find((await params).slug);
  if (!p) return {};
  const description = (p.summary || p.description)?.slice(0, 160) ?? `${p.name}: ${p.category.toLowerCase()}${p.brand ? ` ${p.brand}` : ""}. Solicitá tu cotización.`;
  return {
    title: p.name, description,
    alternates: { canonical: `/producto/${p.slug}/` },
    openGraph: { title: p.name, description, url: `/producto/${p.slug}/`, images: p.images.slice(0, 1).map((i) => ({ url: imageUrl(i.file), alt: i.alt })) },
  };
}

/** Datos estructurados (schema.org): producto y migas de pan. Sin precio ni disponibilidad, porque la web no los publica. */
function jsonLd(p: Product, lineName: string) {
  return [
    {
      "@context": "https://schema.org", "@type": "Product", name: p.name, category: p.category,
      ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}), ...(p.description ? { description: p.description } : {}),
      ...(p.images.length ? { image: p.images.map((i) => abs(imageUrl(i.file))) } : {}),
      ...(p.colors.length ? { color: p.colors.join(", ") } : {}),
      ...(p.sizes.length ? { size: p.sizes.join(", ") } : {}),
      url: abs(`/producto/${p.slug}/`),
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [[SITE_NAME, "/"], ["Catálogo", "/catalogo/"], [lineName, `/catalogo/${p.line}/`], [p.name, `/producto/${p.slug}/`]]
        .map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
    },
  ];
}

export default async function Producto({ params }: Props) {
  const p = find((await params).slug);
  if (!p) notFound();
  const line = getCatalog().lines[p.line];
  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(p, line.name)).replace(/</g, LT_ESCAPED) }} />
      <nav className="crumbs" aria-label="Ruta"><Link href="/">Inicio</Link> / <Link href="/catalogo/">Catálogo</Link> / <Link href={`/catalogo/${p.line}/`}>{line.name}</Link> / <span aria-current="page">{p.name}</span></nav>
      <ColorProvider p={{ images: p.images, colors: p.colors, colorsPending: p.colorsPending }}>
      <div className="ficha">
        <div><ProductGallery name={p.name} /></div>
        <div>
          <div className="muted">{[p.brand, p.category].filter(Boolean).join(" · ")}</div>
          <h1>{p.name}</h1>
          {p.code && <div className="ficha-code">Cód. {p.code}</div>}
          {p.summary ? <p className="ficha-lead">{p.summary}</p> : !p.description && <p className="placeholder">[Descripción a definir]</p>}
          <ColorPicker />
          <AddToRequest p={p} />
          <div className="notice">Precios finales con IVA incluido. Tu pedido queda sujeto a confirmación de disponibilidad y condiciones de entrega: no se realiza ningún cobro online.</div>
        </div>
      </div>
      </ColorProvider>
      {/* Ficha ampliada: solo datos confirmados; lo pendiente queda en la gestión */}
      {(p.specs?.length || p.description || p.care) && (
        <div className="ficha-more">
          {!!p.specs?.length && (
            <section>
              <h2>Características técnicas</h2>
              <table className="specs"><tbody>
                {p.specs.map((s, i) => <tr key={i}>{s.label ? <><th scope="row">{s.label}</th><td>{s.value}</td></> : <td colSpan={2}>{s.value}</td>}</tr>)}
              </tbody></table>
            </section>
          )}
          {(p.description || p.care) && (
            <section>
              {p.description && <><h2>Descripción</h2><p style={{ whiteSpace: "pre-line" }}>{p.description}</p></>}
              {p.care && <><h2>Cuidados</h2><p style={{ whiteSpace: "pre-line" }}>{p.care}</p></>}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
