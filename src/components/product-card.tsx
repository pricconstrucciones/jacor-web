import Link from "next/link";
import { IMAGE_SIZES } from "@/lib/content";
import { fromPrice, imageUrl, money, type Product } from "@/lib/types";
import { ImageSlot } from "./image-slot";

export function ProductCard({ p }: { p: Product }) {
  const img = p.images[0];
  return (
    <Link className={`tile${p.line === "calzado-de-seguridad" ? " tile-calzado" : ""}`} href={`/producto/${p.slug}/`}>
      <ImageSlot src={img && imageUrl(img.file)} alt={img?.alt ?? p.name} size={IMAGE_SIZES.product} />
      <div className="body">
        <b>{p.name}</b>
        <div className="muted">{[p.category, p.brand].filter(Boolean).join(" · ")}</div>
        {(() => { const f = fromPrice(p); return f.min !== null ? <div className="tile-price">{f.varies ? "Desde " : ""}{money(f.min)}<span> IVA incl.</span></div> : <div className="tile-price ask">Precio a consultar</div>; })()}
      </div>
    </Link>
  );
}
